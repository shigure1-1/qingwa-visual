import { jsonError, jsonOk, assertSameOrigin, readJson } from "@/lib/commerce/api";
import { addCartItemSchema } from "@/lib/commerce/schemas";
import { getOrCreateGuestSession } from "@/lib/commerce/guest-session";
import { addCartItemForGuest, getCartForGuest } from "@/lib/commerce/catalog";
import { requireWritableCommerce } from "@/lib/commerce/api";

export async function GET() {
  try {
    const session = await getOrCreateGuestSession();
    return jsonOk({ ok: true, cart: await getCartForGuest(session.id) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    requireWritableCommerce();
    const session = await getOrCreateGuestSession();
    const payload = addCartItemSchema.parse(await readJson(request));
    return jsonOk({ ok: true, cart: await addCartItemForGuest(session.id, payload.variantId, payload.quantity) });
  } catch (error) {
    return jsonError(error);
  }
}
