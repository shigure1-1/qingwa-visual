import { assertSameOrigin, jsonError, jsonOk, readJson, requireWritableCommerce } from "@/lib/commerce/api";
import { requireGuestSession } from "@/lib/commerce/guest-session";
import { createPaymentRequestSchema } from "@/lib/commerce/schemas";
import { createPaymentAttemptForGuest } from "@/lib/commerce/transactions";
import { getPaymentAdapter } from "@/lib/payments";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    requireWritableCommerce();
    const session = await requireGuestSession();
    const payload = createPaymentRequestSchema.parse(await readJson(request));
    const attempt = await createPaymentAttemptForGuest(session.id, payload.orderNumber, payload.provider, payload.idempotencyKey);
    const adapter = getPaymentAdapter(payload.provider);
    const result = await adapter.initiatePayment({
      paymentId: attempt.paymentId,
      orderNumber: attempt.orderNumber,
      amount: attempt.amount,
      currency: attempt.currency,
      description: `晴蛙文创订单 ${attempt.orderNumber}`,
      clientIp: payload.clientIp,
    });
    return jsonOk({ ok: true, payment: { provider: result.provider, status: result.status, codeUrl: result.codeUrl, qrDataUrl: result.qrDataUrl } });
  } catch (error) {
    return jsonError(error);
  }
}
