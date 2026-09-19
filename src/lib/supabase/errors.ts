import "server-only";

import type { PostgrestError } from "@supabase/supabase-js";

import { CommerceError } from "@/lib/commerce/errors";

const knownDatabaseErrors: Record<string, { code: "COMMERCE_NOT_FOUND" | "COMMERCE_CONFLICT"; status: number }> = {
  CART_EMPTY: { code: "COMMERCE_CONFLICT", status: 409 },
  CART_NOT_FOUND: { code: "COMMERCE_NOT_FOUND", status: 404 },
  INSUFFICIENT_INVENTORY: { code: "COMMERCE_CONFLICT", status: 409 },
  INVALID_QUANTITY: { code: "COMMERCE_CONFLICT", status: 409 },
  ORDER_NOT_FOUND: { code: "COMMERCE_NOT_FOUND", status: 404 },
  ORDER_NOT_PAYABLE: { code: "COMMERCE_CONFLICT", status: 409 },
  PAYMENT_AMOUNT_MISMATCH: { code: "COMMERCE_CONFLICT", status: 409 },
  SHIPPING_QUOTE_INVALID: { code: "COMMERCE_CONFLICT", status: 409 },
  VARIANT_NOT_AVAILABLE: { code: "COMMERCE_CONFLICT", status: 409 },
};

export function throwDatabaseError(error: PostgrestError | null): never {
  const message = error?.message ?? "Database operation failed";
  const known = knownDatabaseErrors[message];

  if (known) {
    throw new CommerceError(known.code, message, known.status);
  }

  throw new CommerceError("COMMERCE_INTERNAL_ERROR", "Commerce request failed", 500);
}
