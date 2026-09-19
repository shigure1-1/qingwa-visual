import { jsonError, jsonOk } from "@/lib/commerce/api";
import { releaseExpiredReservations } from "@/lib/commerce/transactions";
import { getReconcileContext } from "@/lib/commerce/runtime";
import { verifySharedSecret } from "@/lib/commerce/session";
import { CommerceError } from "@/lib/commerce/errors";

export async function POST(request: Request) {
  try {
    const { env } = getReconcileContext();
    if (!verifySharedSecret(request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null, env.COMMERCE_INTERNAL_SHARED_SECRET!)) {
      throw new CommerceError("COMMERCE_UNAUTHORIZED", "内部任务凭据无效", 401);
    }
    return jsonOk({ ok: true, releasedReservations: await releaseExpiredReservations() });
  } catch (error) {
    return jsonError(error);
  }
}
