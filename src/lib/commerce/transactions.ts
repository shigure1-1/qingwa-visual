import "server-only";

import { getCommerceContext } from "@/lib/commerce/runtime";
import { hashIdempotencyKey } from "@/lib/commerce/guest-session";
import type { CheckoutRequest } from "@/lib/commerce/schemas";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { throwDatabaseError } from "@/lib/supabase/errors";

export async function quoteShipping(input: {
  province: string;
  city: string;
  method: string;
}) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("shipping_rate_rules")
    .select("amount_minor, currency, shipping_methods!inner(code, title)")
    .eq("status", "published")
    .eq("province", input.province)
    .eq("shipping_methods.code", input.method)
    .or(`city.eq.${input.city},city.is.null`)
    .order("city", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throwDatabaseError(error);
  if (!data) return null;
  return { amount: data.amount_minor as number, currency: "CNY" as const, method: input.method };
}

export async function createCheckoutForGuest(
  guestSessionId: string,
  input: CheckoutRequest,
) {
  const { env } = getCommerceContext();
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("commerce_checkout", {
    p_guest_session_id: guestSessionId,
    p_address: input.address,
    p_email: input.email ?? "",
    p_customer_note: input.customerNote ?? "",
    p_shipping_method: input.shippingMethod,
    p_idempotency_hash: hashIdempotencyKey(input.idempotencyKey),
    p_reservation_minutes: env.COMMERCE_RESERVATION_MINUTES,
    p_terms_version: env.COMMERCE_TERMS_VERSION ?? "pending",
    p_privacy_version: env.COMMERCE_PRIVACY_VERSION ?? "pending",
    p_refund_policy_version: env.COMMERCE_REFUND_POLICY_VERSION ?? "pending",
  });

  if (error) throwDatabaseError(error);
  return data;
}

export async function createPaymentAttemptForGuest(
  guestSessionId: string,
  orderPublicId: string,
  provider: "wechat" | "alipay",
  idempotencyKey: string,
) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("commerce_create_payment_attempt", {
    p_guest_session_id: guestSessionId,
    p_order_public_id: orderPublicId,
    p_provider: provider,
    p_idempotency_hash: hashIdempotencyKey(idempotencyKey),
  });

  if (error) throwDatabaseError(error);
  return data as {
    paymentId: string;
    orderNumber: string;
    amount: number;
    currency: "CNY";
  };
}

export async function applyPaymentEvent(event: {
  provider: "wechat" | "alipay";
  eventId: string;
  payloadHash: string;
  eventType: string;
  orderPublicId: string;
  providerTransactionId?: string;
  amountMinor: number;
  currency: "CNY";
  status: "succeeded" | "failed" | "closed" | "refunded";
  payload: Record<string, unknown>;
}) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("commerce_apply_payment_event", {
    p_provider: event.provider,
    p_event_id: event.eventId,
    p_payload_hash: event.payloadHash,
    p_event_type: event.eventType,
    p_order_public_id: event.orderPublicId,
    p_provider_transaction_id: event.providerTransactionId ?? "",
    p_amount_minor: event.amountMinor,
    p_currency: event.currency,
    p_status: event.status,
    p_payload: event.payload,
  });

  if (error) throwDatabaseError(error);
  return data;
}

export async function getGuestOrder(guestSessionId: string, publicId: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select("public_id, status, payment_status, fulfillment_status, currency, subtotal_minor, shipping_minor, total_minor, created_at, paid_at, order_items(product_title, variant_title, sku, quantity, unit_price_minor), order_addresses(recipient_name, phone, province, city, district, address_line1, address_line2, postal_code), shipments(carrier, tracking_number, shipped_at, delivered_at)")
    .eq("guest_session_id", guestSessionId)
    .eq("public_id", publicId)
    .maybeSingle();

  if (error) throwDatabaseError(error);
  return data;
}

export async function releaseExpiredReservations() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("commerce_release_expired_reservations");
  if (error) throwDatabaseError(error);
  return data;
}
