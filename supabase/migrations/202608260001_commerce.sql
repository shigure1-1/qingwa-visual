create extension if not exists pgcrypto;

create type public.catalog_status as enum ('draft', 'published', 'archived');
create type public.sales_mode as enum ('direct', 'custom_quote');
create type public.fulfillment_type as enum ('physical', 'digital', 'custom_project');
create type public.cart_status as enum ('open', 'converted', 'abandoned');
create type public.order_status as enum ('pending_payment', 'paid', 'fulfilling', 'shipped', 'completed', 'cancelled', 'refunded');
create type public.payment_status as enum ('created', 'pending', 'succeeded', 'failed', 'closed', 'refunded', 'partially_refunded');
create type public.fulfillment_status as enum ('pending', 'processing', 'fulfilled', 'cancelled');
create type public.reservation_status as enum ('active', 'released', 'consumed', 'expired');
create type public.payment_provider as enum ('wechat', 'alipay');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  english_title text not null,
  summary text not null default '',
  status public.catalog_status not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id),
  slug text not null,
  title text not null,
  summary text not null default '',
  description text not null default '',
  status public.catalog_status not null default 'draft',
  sales_mode public.sales_mode not null default 'direct',
  fulfillment_type public.fulfillment_type not null default 'physical',
  purchasable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  title text not null default '标准规格',
  price_minor bigint check (price_minor is null or price_minor >= 0),
  currency text not null default 'CNY' check (currency = 'CNY'),
  status public.catalog_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  src text not null,
  alt text not null,
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.inventory_items (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  on_hand integer not null default 0 check (on_hand >= 0),
  reserved integer not null default 0 check (reserved >= 0 and reserved <= on_hand),
  updated_at timestamptz not null default now()
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  movement_type text not null check (movement_type in ('receipt', 'adjustment', 'reservation', 'release', 'sale', 'refund')),
  quantity_delta integer not null check (quantity_delta <> 0),
  reference_type text,
  reference_id uuid,
  note text,
  created_at timestamptz not null default now()
);

create table public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  status public.catalog_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.shipping_rate_rules (
  id uuid primary key default gen_random_uuid(),
  shipping_method_id uuid not null references public.shipping_methods(id) on delete cascade,
  province text not null,
  city text,
  amount_minor bigint not null check (amount_minor >= 0),
  currency text not null default 'CNY' check (currency = 'CNY'),
  status public.catalog_status not null default 'draft',
  unique (shipping_method_id, province, city)
);

create table public.guest_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  guest_session_id uuid not null references public.guest_sessions(id) on delete cascade,
  status public.cart_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index carts_one_open_per_guest on public.carts(guest_session_id) where status = 'open';

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_variant_id uuid not null references public.product_variants(id),
  quantity integer not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, product_variant_id)
);

create table public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  guest_session_id uuid not null references public.guest_sessions(id),
  cart_id uuid not null references public.carts(id),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique default ('QW' || to_char(clock_timestamp(), 'YYYYMMDD') || upper(substr(encode(gen_random_bytes(8), 'hex'), 1, 10))),
  guest_session_id uuid not null references public.guest_sessions(id),
  status public.order_status not null default 'pending_payment',
  payment_status public.payment_status not null default 'created',
  fulfillment_status public.fulfillment_status not null default 'pending',
  currency text not null default 'CNY' check (currency = 'CNY'),
  subtotal_minor bigint not null check (subtotal_minor >= 0),
  shipping_minor bigint not null check (shipping_minor >= 0),
  tax_minor bigint not null default 0 check (tax_minor >= 0),
  total_minor bigint not null check (total_minor = subtotal_minor + shipping_minor + tax_minor),
  customer_email text,
  customer_note text,
  shipping_method_code text,
  terms_version text not null,
  privacy_version text not null,
  refund_policy_version text not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id),
  product_title text not null,
  variant_title text not null,
  sku text not null,
  quantity integer not null check (quantity > 0),
  unit_price_minor bigint check (unit_price_minor is null or unit_price_minor >= 0),
  currency text not null default 'CNY' check (currency = 'CNY'),
  customization jsonb not null default '{}'::jsonb
);

create table public.order_addresses (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  province text not null,
  city text not null,
  district text not null,
  address_line1 text not null,
  address_line2 text,
  postal_code text,
  created_at timestamptz not null default now()
);

create table public.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id),
  quantity integer not null check (quantity > 0),
  status public.reservation_status not null default 'active',
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  released_at timestamptz
);
create index inventory_reservations_active_expiry on public.inventory_reservations(status, expires_at);

create table public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider public.payment_provider not null,
  idempotency_key text not null,
  provider_payment_id text,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'CNY' check (currency = 'CNY'),
  status public.payment_status not null default 'created',
  provider_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, idempotency_key)
);

create table public.payment_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider public.payment_provider not null,
  event_id text not null,
  payload_hash text not null,
  event_type text not null,
  order_public_id text,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  applied_at timestamptz,
  unique (provider, event_id),
  unique (provider, payload_hash)
);

create table public.idempotency_keys (
  id uuid primary key default gen_random_uuid(),
  guest_session_id uuid references public.guest_sessions(id),
  key_hash text not null unique,
  operation text not null,
  response jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table public.fulfillments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  status public.fulfillment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fulfillment_items (
  id uuid primary key default gen_random_uuid(),
  fulfillment_id uuid not null references public.fulfillments(id) on delete cascade,
  order_item_id uuid not null references public.order_items(id),
  quantity integer not null check (quantity > 0),
  unique (fulfillment_id, order_item_id)
);

create table public.shipments (
  id uuid primary key default gen_random_uuid(),
  fulfillment_id uuid not null references public.fulfillments(id) on delete cascade,
  carrier text not null,
  tracking_number text not null,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  payment_attempt_id uuid references public.payment_attempts(id),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'CNY' check (currency = 'CNY'),
  status text not null check (status in ('pending', 'succeeded', 'failed')),
  reason text,
  created_at timestamptz not null default now()
);

create index products_published_category on public.products(category_id, status, created_at desc);
create index variants_published_product on public.product_variants(product_id, status);
create index cart_items_cart on public.cart_items(cart_id);
create index orders_guest_created on public.orders(guest_session_id, created_at desc);
create index payment_attempts_order on public.payment_attempts(order_id, created_at desc);

insert into public.categories (slug, title, english_title, summary, sort_order)
values
  ('qingwa-art', '艺术定制', 'ART CUSTOMIZATION', '艺术定制内容方向。', 10),
  ('craft-customization', '工艺定制', 'CRAFT CUSTOMIZATION', '工艺定制内容方向。', 20),
  ('ip-customization', 'IP定制', 'IP CUSTOMIZATION', 'IP定制内容方向。', 30),
  ('private-film', '私人电影', 'PRIVATE FILM', '私人电影内容方向。', 40)
on conflict (slug) do update set title = excluded.title, english_title = excluded.english_title, summary = excluded.summary, sort_order = excluded.sort_order;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_media enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.shipping_methods enable row level security;
alter table public.shipping_rate_rules enable row level security;
alter table public.guest_sessions enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_addresses enable row level security;
alter table public.inventory_reservations enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.idempotency_keys enable row level security;
alter table public.fulfillments enable row level security;
alter table public.fulfillment_items enable row level security;
alter table public.shipments enable row level security;
alter table public.refunds enable row level security;

create policy categories_public_read on public.categories for select to anon, authenticated using (status = 'published');
create policy products_public_read on public.products for select to anon, authenticated using (status = 'published' and purchasable = true);
create policy variants_public_read on public.product_variants for select to anon, authenticated using (
  status = 'published' and exists (
    select 1 from public.products p where p.id = product_id and p.status = 'published' and p.purchasable = true
  )
);
create policy media_public_read on public.product_media for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published' and p.purchasable = true));

revoke all on all tables in schema public from anon, authenticated;
grant select on public.categories, public.products, public.product_variants, public.product_media to anon, authenticated;

create or replace function public.commerce_add_cart_item(p_guest_session_id uuid, p_variant_id uuid, p_quantity integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_cart_id uuid; v_item_id uuid;
begin
  if p_quantity < 1 or p_quantity > 99 then raise exception 'INVALID_QUANTITY'; end if;
  select id into v_cart_id from carts where guest_session_id = p_guest_session_id and status = 'open' for update;
  if v_cart_id is null then insert into carts (guest_session_id) values (p_guest_session_id) returning id into v_cart_id; end if;
  if not exists (select 1 from product_variants v join products p on p.id=v.product_id where v.id=p_variant_id and v.status='published' and p.status='published' and p.purchasable=true) then raise exception 'VARIANT_NOT_AVAILABLE'; end if;
  insert into cart_items (cart_id, product_variant_id, quantity) values (v_cart_id, p_variant_id, p_quantity)
  on conflict (cart_id, product_variant_id) do update set quantity = least(99, cart_items.quantity + excluded.quantity), updated_at = now()
  returning id into v_item_id;
  update carts set updated_at = now() where id = v_cart_id;
  return jsonb_build_object('cart_id', v_cart_id, 'item_id', v_item_id);
end; $$;

create or replace function public.commerce_update_cart_item(p_guest_session_id uuid, p_cart_item_id uuid, p_quantity integer)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_item cart_items%rowtype;
begin
  if p_quantity < 1 or p_quantity > 99 then raise exception 'INVALID_QUANTITY'; end if;
  select ci.* into v_item from cart_items ci join carts c on c.id=ci.cart_id where ci.id=p_cart_item_id and c.guest_session_id=p_guest_session_id and c.status='open' for update;
  if v_item.id is null then raise exception 'CART_NOT_FOUND'; end if;
  update cart_items set quantity=p_quantity, updated_at=now() where id=p_cart_item_id;
  return jsonb_build_object('item_id', p_cart_item_id, 'quantity', p_quantity);
end; $$;

create or replace function public.commerce_remove_cart_item(p_guest_session_id uuid, p_cart_item_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  delete from cart_items ci using carts c where ci.cart_id=c.id and ci.id=p_cart_item_id and c.guest_session_id=p_guest_session_id and c.status='open';
  if not found then raise exception 'CART_NOT_FOUND'; end if;
  return jsonb_build_object('item_id', p_cart_item_id, 'removed', true);
end; $$;

revoke all on function public.commerce_add_cart_item(uuid, uuid, integer) from public, anon, authenticated;
revoke all on function public.commerce_update_cart_item(uuid, uuid, integer) from public, anon, authenticated;
revoke all on function public.commerce_remove_cart_item(uuid, uuid) from public, anon, authenticated;

grant execute on function public.commerce_add_cart_item(uuid, uuid, integer) to service_role;
grant execute on function public.commerce_update_cart_item(uuid, uuid, integer) to service_role;
grant execute on function public.commerce_remove_cart_item(uuid, uuid) to service_role;

comment on table public.categories is 'Supabase console managed published commerce categories.';
comment on table public.products is 'Only approved products with verified price, SKU, media and policy data may be published.';
comment on table public.orders is 'Guest orders; access only through server-side session verification.';
comment on table public.payment_webhook_events is 'Idempotent, signature-verified provider events.';
