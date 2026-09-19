import { assertSameOrigin, jsonError, jsonOk, readJson, requireWritableCommerce } from "@/lib/commerce/api";
import { shippingQuoteRequestSchema } from "@/lib/commerce/schemas";
import { quoteShipping } from "@/lib/commerce/transactions";
import { CommerceError } from "@/lib/commerce/errors";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    requireWritableCommerce();
    const payload = shippingQuoteRequestSchema.parse(await readJson(request));
    const quote = await quoteShipping({
      province: payload.address.province,
      city: payload.address.city,
      method: "standard",
    });
    if (!quote) throw new CommerceError("COMMERCE_NOT_FOUND", "当前地址没有可用配送规则", 404);
    return jsonOk({ ok: true, quote });
  } catch (error) {
    return jsonError(error);
  }
}
