export type PublicCatalogMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  english_title: string;
  summary: string;
  status: "draft" | "published" | "archived";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ProductRow = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: "draft" | "published" | "archived";
  sales_mode: "direct" | "custom_quote";
  fulfillment_type: "physical" | "digital" | "custom_project";
  purchasable: boolean;
  created_at: string;
  updated_at: string;
};

type ProductVariantRow = {
  id: string;
  product_id: string;
  sku: string;
  title: string;
  price_minor: number | null;
  currency: "CNY";
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};

type ProductMediaRow = {
  id: string;
  product_id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  sort_order: number;
  created_at: string;
};

type InventoryItemRow = {
  variant_id: string;
  on_hand: number;
  reserved: number;
  updated_at: string;
};

type InventoryMovementRow = {
  id: string;
  variant_id: string;
  movement_type: "receipt" | "adjustment" | "reservation" | "release" | "sale" | "refund";
  quantity_delta: number;
  reference_type: string | null;
  reference_id: string | null;
  note: string | null;
  created_at: string;
};

type ShippingMethodRow = {
  id: string;
  code: string;
  title: string;
  status: "draft" | "published" | "archived";
  created_at: string;
};

type ShippingRateRuleRow = {
  id: string;
  shipping_method_id: string;
  province: string;
  city: string | null;
  amount_minor: number;
  currency: "CNY";
  status: "draft" | "published" | "archived";
};

type GuestSessionRow = {
  id: string;
  token_hash: string;
  last_seen_at: string;
  expires_at: string;
  created_at: string;
};

type CartRow = {
  id: string;
  guest_session_id: string;
  status: "open" | "converted" | "abandoned";
  created_at: string;
  updated_at: string;
};

type CartItemRow = {
  id: string;
  cart_id: string;
  product_variant_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

type CheckoutSessionRow = {
  id: string;
  guest_session_id: string;
  cart_id: string;
  expires_at: string;
  created_at: string;
};

type OrderRow = {
  id: string;
  public_id: string;
  guest_session_id: string;
  status: "pending_payment" | "paid" | "fulfilling" | "shipped" | "completed" | "cancelled" | "refunded";
  payment_status: "created" | "pending" | "succeeded" | "failed" | "closed" | "refunded" | "partially_refunded";
  fulfillment_status: "pending" | "processing" | "fulfilled" | "cancelled";
  currency: "CNY";
  subtotal_minor: number;
  shipping_minor: number;
  tax_minor: number;
  total_minor: number;
  customer_email: string | null;
  customer_note: string | null;
  shipping_method_code: string | null;
  terms_version: string;
  privacy_version: string;
  refund_policy_version: string;
  created_at: string;
  paid_at: string | null;
  updated_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  variant_id: string;
  product_title: string;
  variant_title: string;
  sku: string;
  quantity: number;
  unit_price_minor: number | null;
  currency: "CNY";
  customization: Json;
};

type OrderAddressRow = {
  id: string;
  order_id: string;
  recipient_name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address_line1: string;
  address_line2: string | null;
  postal_code: string | null;
  created_at: string;
};

type InventoryReservationRow = {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  status: "active" | "released" | "consumed" | "expired";
  expires_at: string;
  created_at: string;
  released_at: string | null;
};

type PaymentAttemptRow = {
  id: string;
  order_id: string;
  provider: "wechat" | "alipay";
  idempotency_key: string;
  provider_payment_id: string | null;
  amount_minor: number;
  currency: "CNY";
  status: "created" | "pending" | "succeeded" | "failed" | "closed" | "refunded" | "partially_refunded";
  provider_payload: Json;
  created_at: string;
  updated_at: string;
};

type PaymentWebhookEventRow = {
  id: string;
  provider: "wechat" | "alipay";
  event_id: string;
  payload_hash: string;
  event_type: string;
  order_public_id: string | null;
  payload: Json;
  received_at: string;
  applied_at: string | null;
};

type IdempotencyKeyRow = {
  id: string;
  guest_session_id: string | null;
  key_hash: string;
  operation: string;
  response: Json | null;
  created_at: string;
  expires_at: string;
};

type FulfillmentRow = {
  id: string;
  order_id: string;
  status: "pending" | "processing" | "fulfilled" | "cancelled";
  created_at: string;
  updated_at: string;
};

type FulfillmentItemRow = {
  id: string;
  fulfillment_id: string;
  order_item_id: string;
  quantity: number;
};

type ShipmentRow = {
  id: string;
  fulfillment_id: string;
  carrier: string;
  tracking_number: string;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
};

type RefundRow = {
  id: string;
  order_id: string;
  payment_attempt_id: string | null;
  amount_minor: number;
  currency: "CNY";
  status: "pending" | "succeeded" | "failed";
  reason: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      categories: Table<CategoryRow>;
      products: Table<ProductRow>;
      product_variants: Table<ProductVariantRow>;
      product_media: Table<ProductMediaRow>;
      inventory_items: Table<InventoryItemRow>;
      inventory_movements: Table<InventoryMovementRow>;
      shipping_methods: Table<ShippingMethodRow>;
      shipping_rate_rules: Table<ShippingRateRuleRow>;
      guest_sessions: Table<GuestSessionRow>;
      carts: Table<CartRow>;
      cart_items: Table<CartItemRow>;
      checkout_sessions: Table<CheckoutSessionRow>;
      orders: Table<OrderRow>;
      order_items: Table<OrderItemRow>;
      order_addresses: Table<OrderAddressRow>;
      inventory_reservations: Table<InventoryReservationRow>;
      payment_attempts: Table<PaymentAttemptRow>;
      payment_webhook_events: Table<PaymentWebhookEventRow>;
      idempotency_keys: Table<IdempotencyKeyRow>;
      fulfillments: Table<FulfillmentRow>;
      fulfillment_items: Table<FulfillmentItemRow>;
      shipments: Table<ShipmentRow>;
      refunds: Table<RefundRow>;
    };
    Views: Record<string, never>;
    Functions: {
      commerce_add_cart_item: {
        Args: { p_guest_session_id: string; p_variant_id: string; p_quantity: number };
        Returns: { cart_id: string; item_id: string };
      };
      commerce_update_cart_item: {
        Args: { p_guest_session_id: string; p_cart_item_id: string; p_quantity: number };
        Returns: { item_id: string; quantity: number };
      };
      commerce_remove_cart_item: {
        Args: { p_guest_session_id: string; p_cart_item_id: string };
        Returns: { item_id: string; removed: boolean };
      };
      commerce_checkout: {
        Args: Record<string, unknown>;
        Returns: Json;
      };
      commerce_create_payment_attempt: {
        Args: Record<string, unknown>;
        Returns: Json;
      };
      commerce_apply_payment_event: {
        Args: Record<string, unknown>;
        Returns: Json;
      };
      commerce_release_expired_reservations: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
    Enums: {
      catalog_status: "draft" | "published" | "archived";
      sales_mode: "direct" | "custom_quote";
      fulfillment_type: "physical" | "digital" | "custom_project";
      cart_status: "open" | "converted" | "abandoned";
      order_status: "pending_payment" | "paid" | "fulfilling" | "shipped" | "completed" | "cancelled" | "refunded";
      payment_status: "created" | "pending" | "succeeded" | "failed" | "closed" | "refunded" | "partially_refunded";
      fulfillment_status: "pending" | "processing" | "fulfilled" | "cancelled";
      reservation_status: "active" | "released" | "consumed" | "expired";
      payment_provider: "wechat" | "alipay";
    };
    CompositeTypes: Record<string, never>;
  };
};
