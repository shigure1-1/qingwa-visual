import { NextResponse } from "next/server";
import { jsonError } from "@/lib/commerce/api";
import { applyPaymentEvent } from "@/lib/commerce/transactions";
import { sha256Hex } from "@/lib/payments/crypto";
import { getPaymentAdapter } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const event = await getPaymentAdapter("alipay").parseWebhook(rawBody, request.headers);
    await applyPaymentEvent({
      provider: "alipay",
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
    return new NextResponse("success", { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return jsonError(error);
  }
}
