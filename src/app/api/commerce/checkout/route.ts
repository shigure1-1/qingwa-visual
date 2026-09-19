import { assertSameOrigin, jsonError, jsonOk, readJson, requireWritableCommerce } from "@/lib/commerce/api";
import { requireGuestSession } from "@/lib/commerce/guest-session";
import { checkoutRequestSchema } from "@/lib/commerce/schemas";
import { createCheckoutForGuest } from "@/lib/commerce/transactions";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    requireWritableCommerce();
    const session = await requireGuestSession();
    const payload = checkoutRequestSchema.parse(await readJson(request));
    const order = await createCheckoutForGuest(session.id, payload);
    return jsonOk({ ok: true, order }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
