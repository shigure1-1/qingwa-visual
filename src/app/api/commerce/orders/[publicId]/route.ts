import { jsonError, jsonOk, requireWritableCommerce } from "@/lib/commerce/api";
import { requireGuestSession } from "@/lib/commerce/guest-session";
import { getGuestOrder } from "@/lib/commerce/transactions";
import { CommerceError } from "@/lib/commerce/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicId: string }> },
) {
  try {
    requireWritableCommerce();
    const session = await requireGuestSession();
    const { publicId } = await params;
    const order = await getGuestOrder(session.id, publicId);
    if (!order) throw new CommerceError("COMMERCE_NOT_FOUND", "订单不存在", 404);
    return jsonOk({ ok: true, order });
  } catch (error) {
    return jsonError(error);
  }
}
