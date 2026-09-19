import "server-only";

import QRCode from "qrcode";
import { z } from "zod";

import { CommerceError } from "@/lib/commerce/errors";
import { getPaymentContext } from "@/lib/commerce/runtime";
import { currencySchema } from "@/lib/commerce/money";
import {
  decryptAes256Gcm,
  randomNonce,
  signRsaSha256,
  verifyRsaSha256,
} from "@/lib/payments/crypto";
import type {
  PaymentAdapter,
  PaymentInitiationInput,
  PaymentInitiationResult,
  VerifiedPaymentEvent,
} from "@/lib/payments/types";

const wechatNativeResponseSchema = z.object({ code_url: z.url() }).passthrough();
const wechatNotificationSchema = z.object({
  id: z.string().min(1),
  event_type: z.string().min(1),
  create_time: z.iso.datetime(),
  resource: z.object({
    algorithm: z.literal("AEAD_AES_256_GCM"),
    ciphertext: z.string().min(1),
    nonce: z.string().min(1),
    associated_data: z.string().optional(),
  }),
});
const wechatTransactionSchema = z.object({
  appid: z.string().min(1),
  mchid: z.string().min(1),
  out_trade_no: z.string().min(1),
  transaction_id: z.string().optional(),
  trade_state: z.enum(["SUCCESS", "REFUND", "NOTPAY", "CLOSED", "REVOKED", "PAYERROR"]),
  success_time: z.iso.datetime().optional(),
  amount: z.object({
    total: z.number().int().nonnegative(),
    currency: currencySchema,
  }),
}).passthrough();

function requiredHeader(headers: Headers, name: string): string {
  const value = headers.get(name);
  if (!value) {
    throw new CommerceError("COMMERCE_PROVIDER_ERROR", `Missing ${name}`, 400);
  }
  return value;
}

function responseSignatureMessage(headers: Headers, body: string): string {
  return `${requiredHeader(headers, "wechatpay-timestamp")}\n${requiredHeader(headers, "wechatpay-nonce")}\n${body}\n`;
}

function webhookSignatureMessage(headers: Headers, rawBody: string): string {
  return `${requiredHeader(headers, "wechatpay-timestamp")}\n${requiredHeader(headers, "wechatpay-nonce")}\n${rawBody}\n`;
}

function mapTradeState(
  state: z.infer<typeof wechatTransactionSchema>["trade_state"],
): VerifiedPaymentEvent["status"] {
  if (state === "SUCCESS") return "succeeded";
  if (state === "REFUND") return "refunded";
  if (state === "CLOSED" || state === "REVOKED") return "closed";
  return "failed";
}

export class WechatPaymentAdapter implements PaymentAdapter {
  readonly name = "wechat" as const;

  async initiatePayment(input: PaymentInitiationInput): Promise<PaymentInitiationResult> {
    const { env } = getPaymentContext(this.name);
    const pathname = "/v3/pay/transactions/native";
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = randomNonce();
    const body = JSON.stringify({
      appid: env.WECHAT_PAY_APP_ID,
      mchid: env.WECHAT_PAY_MCH_ID,
      description: input.description.slice(0, 127),
      out_trade_no: input.orderNumber,
      notify_url: env.WECHAT_PAY_NOTIFY_URL,
      amount: { total: input.amount, currency: input.currency },
    });
    const message = `POST\n${pathname}\n${timestamp}\n${nonce}\n${body}\n`;
    const signature = signRsaSha256(message, env.WECHAT_PAY_PRIVATE_KEY!);
    const authorization = [
      `mchid=\"${env.WECHAT_PAY_MCH_ID}\"`,
      `nonce_str=\"${nonce}\"`,
      `timestamp=\"${timestamp}\"`,
      `serial_no=\"${env.WECHAT_PAY_MCH_SERIAL_NO}\"`,
      `signature=\"${signature}\"`,
    ].join(",");

    const response = await fetch(`https://api.mch.weixin.qq.com${pathname}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `WECHATPAY2-SHA256-RSA2048 ${authorization}`,
        "Content-Type": "application/json",
        "User-Agent": "qingwa-commerce/1.0",
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    const responseBody = await response.text();

    if (!verifyRsaSha256(
      responseSignatureMessage(response.headers, responseBody),
      requiredHeader(response.headers, "wechatpay-signature"),
      env.WECHAT_PAY_PLATFORM_PUBLIC_KEY!,
    )) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Invalid WeChat response signature", 502);
    }
    if (!response.ok) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "WeChat payment request failed", 502);
    }

    const payload = wechatNativeResponseSchema.parse(JSON.parse(responseBody));
    return {
      provider: this.name,
      status: "pending",
      codeUrl: payload.code_url,
      qrDataUrl: await QRCode.toDataURL(payload.code_url, { errorCorrectionLevel: "M", margin: 1 }),
      providerPayload: payload,
    };
  }

  async parseWebhook(rawBody: string, headers: Headers): Promise<VerifiedPaymentEvent> {
    const { env } = getPaymentContext(this.name);
    const timestamp = Number(requiredHeader(headers, "wechatpay-timestamp"));
    if (!Number.isFinite(timestamp) || Math.abs(Date.now() / 1000 - timestamp) > 300) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Stale WeChat webhook", 400);
    }
    const serial = requiredHeader(headers, "wechatpay-serial");
    if (serial !== env.WECHAT_PAY_PLATFORM_SERIAL_NO) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Unknown WeChat platform certificate", 400);
    }
    if (!verifyRsaSha256(
      webhookSignatureMessage(headers, rawBody),
      requiredHeader(headers, "wechatpay-signature"),
      env.WECHAT_PAY_PLATFORM_PUBLIC_KEY!,
    )) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "Invalid WeChat webhook signature", 400);
    }

    const notification = wechatNotificationSchema.parse(JSON.parse(rawBody));
    const decrypted = decryptAes256Gcm({
      ciphertext: notification.resource.ciphertext,
      nonce: notification.resource.nonce,
      associatedData: notification.resource.associated_data,
      key: env.WECHAT_PAY_API_V3_KEY!,
    });
    const transaction = wechatTransactionSchema.parse(JSON.parse(decrypted));
    if (transaction.appid !== env.WECHAT_PAY_APP_ID || transaction.mchid !== env.WECHAT_PAY_MCH_ID) {
      throw new CommerceError("COMMERCE_PROVIDER_ERROR", "WeChat merchant mismatch", 400);
    }

    return {
      provider: this.name,
      eventId: notification.id,
      eventType: notification.event_type,
      orderNumber: transaction.out_trade_no,
      providerTransactionId: transaction.transaction_id,
      amount: transaction.amount.total,
      currency: transaction.amount.currency,
      status: mapTradeState(transaction.trade_state),
      occurredAt: transaction.success_time ?? notification.create_time,
      providerPayload: transaction,
    };
  }
}
