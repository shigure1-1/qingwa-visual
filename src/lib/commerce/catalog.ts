import "server-only";

import { getCommerceEnv } from "@/lib/env/server";
import { createSupabaseAdmin, createSupabaseCatalogAdmin } from "@/lib/supabase/admin";
import { throwDatabaseError } from "@/lib/supabase/errors";

type CatalogRow = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  sales_mode: "direct" | "custom_quote";
  fulfillment_type: "physical" | "digital" | "custom_project";
  product_variants: Array<{ id: string; title: string; price_minor: number | null; currency: "CNY" }> | null;
  product_media: Array<{ src: string; alt: string; width: number; height: number }> | null;
  categories: { slug: string } | Array<{ slug: string }>;
};

export type PublishedProduct = {
  id: string;
  categorySlug: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  salesMode: "direct" | "custom_quote";
  fulfillmentType: "physical" | "digital" | "custom_project";
  priceMinor: number | null;
  currency: "CNY";
  media: Array<{ src: string; alt: string; width: number; height: number }>;
  variants: Array<{ id: string; title: string; priceMinor: number | null; currency: "CNY" }>;
};

function mapPublishedProduct(row: CatalogRow): PublishedProduct {
  const variant = row.product_variants?.[0];
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.id,
    categorySlug: category?.slug ?? "",
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    salesMode: row.sales_mode,
    fulfillmentType: row.fulfillment_type,
    priceMinor: variant?.price_minor ?? null,
    currency: variant?.currency ?? "CNY",
    media: row.product_media ?? [],
    variants: (row.product_variants ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      priceMinor: item.price_minor,
      currency: item.currency,
    })),
  };
}

export async function getPublishedProducts(categorySlug?: string): Promise<PublishedProduct[]> {
  const result = getCommerceEnv();
  if (!result.ok || !result.env.SUPABASE_URL || !result.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const supabase = createSupabaseCatalogAdmin();
  let query = supabase
    .from("products")
    .select("id, category_id, slug, title, summary, description, sales_mode, fulfillment_type, product_variants!inner(id, title, price_minor, currency), product_media(src, alt, width, height), categories!inner(slug)")
    .eq("status", "published")
    .eq("purchasable", true)
    .eq("product_variants.status", "published");

  if (categorySlug) query = query.eq("categories.slug", categorySlug);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throwDatabaseError(error);

  return ((data ?? []) as unknown as CatalogRow[]).map(mapPublishedProduct);
}

export async function getPublishedProduct(categorySlug: string, productSlug: string): Promise<PublishedProduct | null> {
  const products = await getPublishedProducts(categorySlug);
  return products.find((product) => product.slug === productSlug) ?? null;
}

export async function getCartForGuest(guestSessionId: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("carts")
    .select("id, cart_items(id, quantity, product_variant_id, product_variants(product_id, sku, title, price_minor, currency, products(title, slug)))")
    .eq("guest_session_id", guestSessionId)
    .eq("status", "open")
    .maybeSingle();

  if (error) throwDatabaseError(error);
  return data;
}

export async function addCartItemForGuest(
  guestSessionId: string,
  variantId: string,
  quantity: number,
) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("commerce_add_cart_item", {
    p_guest_session_id: guestSessionId,
    p_variant_id: variantId,
    p_quantity: quantity,
  });
  if (error) throwDatabaseError(error);
  return data;
}

export async function updateCartItemForGuest(
  guestSessionId: string,
  cartItemId: string,
  quantity: number,
) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("commerce_update_cart_item", {
    p_guest_session_id: guestSessionId,
    p_cart_item_id: cartItemId,
    p_quantity: quantity,
  });
  if (error) throwDatabaseError(error);
  return data;
}

export async function removeCartItemForGuest(guestSessionId: string, cartItemId: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc("commerce_remove_cart_item", {
    p_guest_session_id: guestSessionId,
    p_cart_item_id: cartItemId,
  });
  if (error) throwDatabaseError(error);
  return data;
}
