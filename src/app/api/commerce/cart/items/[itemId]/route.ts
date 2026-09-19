import { assertSameOrigin, jsonError, jsonOk, readJson, requireWritableCommerce } from "@/lib/commerce/api";
import { requireGuestSession } from "@/lib/commerce/guest-session";
import { updateCartItemSchema } from "@/lib/commerce/schemas";
import { removeCartItemForGuest, updateCartItemForGuest } from "@/lib/commerce/catalog";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    assertSameOrigin(request);
    requireWritableCommerce();
    const { itemId } = await params;
    const session = await requireGuestSession();
    const payload = updateCartItemSchema.parse(await readJson(request));
    return jsonOk({ ok: true, item: await updateCartItemForGuest(session.id, itemId, payload.quantity) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  try {
    assertSameOrigin(request);
    requireWritableCommerce();
    const { itemId } = await params;
    const session = await requireGuestSession();
    return jsonOk({ ok: true, item: await removeCartItemForGuest(session.id, itemId) });
  } catch (error) {
    return jsonError(error);
  }
}
