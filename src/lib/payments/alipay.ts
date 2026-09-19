import "server-only";

import QRCode from "qrcode";
import { z } from "zod";

import { CommerceError } from "@/lib/commerce/errors";
import { parseMajorAmountToMinor } from "@/lib/commerce/money";
import { getPaymentContext } from "@/lib/commerce/runtime";
import { signRsaSha256, verifyRsaSha256 } from "@/lib/payments/crypto";
import type {
  PaymentAdapter,
  PaymentInitiationInput,
  PaymentInitiationResult,
  VerifiedPaymentEvent,
} from "@/lib/payments/types";

const alipayPrecreateResponseSchema = z.object({
  code: z.string(),
  msg: z.string().optional(),
  out_trade_no: z.string().optional(),
  qr_code: z.url().optional(),
}).passthrough();

const alipayWebhookSchema = z.object({
  notify_id: z.string().min(1),
  notify_type: z.string().min(1),
  app_id: z.string().min(1),
  seller_id: z.string().min(1),
  trade_no: z.string().optional(),
  out_trade_no: z.string().min(1),
  trade_status: z.enum(["WAIT_BUYER_PAY", "TRADE_CLOSED", "TRADE_SUCCESS", "TRADE_FINISHED"]),
  total_amount: z.string().min(1),
  gmt_payment: z.string().optional(),
  gmt_close: z.string().optional(),
});

function formatShanghaiTimestamp(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`;
}

function canonicalParameters(parameters: URLSearchParams): string {
  const values = new Map<string, string>();
  for (const [key, value] of parameters) {
    if (key === "sign" || key === "sign_type" || value === "") continue;
    if (values.has(key)) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Duplicate Alipay parameter", 400);
    }
    values.set(key, value);
  }

  return [...values.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

function extractResponseNode(raw: string, key: string): string {
  const marker = `\"${key}\"`;
  const keyAt = raw.indexOf(marker);
  if (keyAt < 0) {
    throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Invalid Alipay response", 502);
  }

  const start = raw.indexOf("{", keyAt + marker.length);
  if (start < 0) {
    throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Invalid Alipay response", 502);
  }

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < raw.length; index += 1) {
    const char = raw[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === "\"") inString = false;
      continue;
    }
    if (char === "\"") inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}" && --depth === 0) return raw.slice(start, index + 1);
  }

  throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Invalid Alipay response", 502);
}

function mapTradeStatus(
  status: z.infer<typeof alipayWebhookSchema>["trade_status"],
): VerifiedPaymentEvent["status"] {
  if (status === "TRADE_SUCCESS" || status === "TRADE_FINISHED") return "succeeded";
  if (status === "TRADE_CLOSED") return "closed";
  return "failed";
}

export class AlipayPaymentAdapter implements PaymentAdapter {
  readonly name = "alipay" as const;

  async initiatePayment(input: PaymentInitiationInput): Promise<PaymentInitiationResult> {
    const { env } = getPaymentContext(this.name);
    const parameters = new URLSearchParams({
      app_id: env.ALIPAY_APP_ID!,
      method: "alipay.trade.precreate",
      format: "JSON",
      charset: "utf-8",
      sign_type: "RSA2",
      timestamp: formatShanghaiTimestamp(new Date()),
      version: "1.0",
      notify_url: env.ALIPAY_NOTIFY_URL!,
      biz_content: JSON.stringify({
        out_trade_no: input.orderNumber,
        total_amount: (input.amount / 100).toFixed(2),
        subject: input.description.slice(0, 256),
      }),
    });
    parameters.set("sign", signRsaSha256(canonicalParameters(parameters), env.ALIPAY_PRIVATE_KEY!));

    const response = await fetch("https://openapi.alipay.com/gateway.do", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        "User-Agent": "qingwa-commerce/1.0",
      },
      body: parameters.toString(),
      signal: AbortSignal.timeout(10_000),
    });
    const rawResponse = await response.text();
    if (!response.ok) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Alipay payment request failed", 502);
    }

    const envelope = z.object({ sign: z.string().min(1) }).passthrough().parse(JSON.parse(rawResponse));
    const responseNode = extractResponseNode(rawResponse, "alipay_trade_precreate_response");
    if (!verifyRsaSha256(responseNode, envelope.sign, env.ALIPAY_PUBLIC_KEY!)) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Invalid Alipay response signature", 502);
    }

    const payload = alipayPrecreateResponseSchema.parse(JSON.parse(responseNode));
    if (payload.code !== "10000" || !payload.qr_code) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Alipay rejected payment request", 502);
    }

    return {
      provider: this.name,
      providerPaymentId: payload.out_trade_no,
      status: "pending",
      codeUrl: payload.qr_code,
      qrDataUrl: await QRCode.toDataURL(payload.qr_code, { errorCorrectionLevel: "M", margin: 1 }),
      providerPayload: payload,
    };
  }

  async parseWebhook(rawBody: string, headers: Headers): Promise<VerifiedPaymentEvent> {
    void headers;
    const { env } = getPaymentContext(this.name);
    const parameters = new URLSearchParams(rawBody);
    const signature = parameters.get("sign");
    if (!signature || parameters.get("sign_type") !== "RSA2") {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Missing Alipay signature", 400);
    }
    if (!verifyRsaSha256(canonicalParameters(parameters), signature, env.ALIPAY_PUBLIC_KEY!)) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Invalid Alipay webhook signature", 400);
    }

    const payload = alipayWebhookSchema.parse(Object.fromEntries(parameters.entries()));
    if (payload.app_id !== env.ALIPAY_APP_ID || payload.seller_id !== env.ALIPAY_SELLER_ID) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Alipay merchant mismatch", 400);
    }
    return {
      provider: this.name,
      eventId: payload.notify_id,
      eventType: payload.notify_type,
      orderNumber: payload.out_trade_no,
      providerTransactionId: payload.trade_no,
      amount: parseMajorAmountToMinor(payload.total_amount),
      currency: "CNY",
      status: mapTradeStatus(payload.trade_status),
      occurredAt: payload.gmt_payment ?? payload.gmt_close ?? new Date().toISOString(),
      providerPayload: Object.fromEntries(parameters.entries()),
    };
  }
}

export { canonicalParameters as canonicalAlipayParameters };
