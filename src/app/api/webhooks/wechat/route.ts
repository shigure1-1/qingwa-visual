import { jsonError, jsonOk } from "@/lib/commerce/api";
import { applyPaymentEvent } from "@/lib/commerce/transactions";
import { sha256Hex } from "@/lib/payments/crypto";
import { getPaymentAdapter } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const event = await getPaymentAdapter("wechat").parseWebhook(rawBody, request.headers);
    const result = await applyPaymentEvent({
      provider: "wechat",
      eventId: event.eventId,
      payloadHash: sha256Hex(rawBody),
      eventType: event.eventType,
      orderPublicId: event.orderNumber,
      providerTransactionId: event.providerTransactionId,
      amountMinor: event.amount,
      currency: event.currency,
      status: event.status,
      payload: event.providerPayload,
    });
    return jsonOk({ code: "SUCCESS", result });
  } catch (error) {
    return jsonError(error);
  }
}
