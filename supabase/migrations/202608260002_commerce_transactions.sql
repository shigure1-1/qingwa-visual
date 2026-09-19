create or replace function public.commerce_checkout(
  p_guest_session_id uuid,
  p_address jsonb,
  p_email text,
  p_customer_note text,
  p_shipping_method text,
  p_idempotency_hash text,
  p_reservation_minutes integer,
  p_terms_version text,
  p_privacy_version text,
  p_refund_policy_version text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_existing jsonb;
  v_cart_id uuid;
  v_order_id uuid;
  v_public_id text;
  v_subtotal bigint := 0;
  v_shipping bigint;
  v_total bigint;
  v_item record;
begin
  select response into v_existing from idempotency_keys where key_hash=p_idempotency_hash and operation='checkout' and expires_at>now() for update;
  if v_existing is not null then return v_existing; end if;

  select id into v_cart_id from carts where guest_session_id=p_guest_session_id and status='open' for update;
  if v_cart_id is null or not exists(select 1 from cart_items where cart_id=v_cart_id) then raise exception 'CART_EMPTY'; end if;

  select r.amount_minor into v_shipping from shipping_rate_rules r
  join shipping_methods m on m.id=r.shipping_method_id
  where m.code=p_shipping_method and m.status='published' and r.status='published'
    and r.province=p_address->>'province'
    and (r.city is null or r.city=p_address->>'city')
  order by (r.city is not null) desc limit 1;
  if v_shipping is null then raise exception 'SHIPPING_QUOTE_INVALID'; end if;

  for v_item in
    select ci.quantity, v.id variant_id, v.sku, v.title variant_title, v.price_minor, v.currency,
           p.id product_id, p.title product_title
    from cart_items ci join product_variants v on v.id=ci.product_variant_id
    join products p on p.id=v.product_id
    where ci.cart_id=v_cart_id
    order by v.id for update of v
  loop
    if v_item.price_minor is null or not exists(select 1 from products where id=v_item.product_id and status='published' and purchasable=true and sales_mode='direct') then raise exception 'VARIANT_NOT_AVAILABLE'; end if;
    update inventory_items set reserved=reserved+v_item.quantity, updated_at=now()
      where variant_id=v_item.variant_id and on_hand-reserved>=v_item.quantity;
    if not found then raise exception 'INSUFFICIENT_INVENTORY'; end if;
    v_subtotal := v_subtotal + (v_item.price_minor * v_item.quantity);
  end loop;

  v_total := v_subtotal + v_shipping;
  insert into orders (guest_session_id, subtotal_minor, shipping_minor, total_minor, customer_email, customer_note, shipping_method_code, terms_version, privacy_version, refund_policy_version)
  values (p_guest_session_id, v_subtotal, v_shipping, v_total, nullif(p_email,''), nullif(p_customer_note,''), p_shipping_method, p_terms_version, p_privacy_version, p_refund_policy_version)
  returning id, public_id into v_order_id, v_public_id;

  insert into order_items (order_id, variant_id, product_title, variant_title, sku, quantity, unit_price_minor, currency)
  select v_order_id, v.id, p.title, v.title, v.sku, ci.quantity, v.price_minor, v.currency
  from cart_items ci join product_variants v on v.id=ci.product_variant_id join products p on p.id=v.product_id where ci.cart_id=v_cart_id;

  insert into order_addresses (order_id, recipient_name, phone, province, city, district, address_line1, address_line2, postal_code)
  values (v_order_id, p_address->>'recipientName', p_address->>'phone', p_address->>'province', p_address->>'city', p_address->>'district', p_address->>'addressLine1', nullif(p_address->>'addressLine2',''), nullif(p_address->>'postalCode',''));

  insert into inventory_reservations (order_id, variant_id, quantity, expires_at)
  select v_order_id, product_variant_id, quantity, now() + make_interval(mins => p_reservation_minutes) from cart_items where cart_id=v_cart_id;
  insert into fulfillments (order_id) values (v_order_id);
  update carts set status='converted', updated_at=now() where id=v_cart_id;

  v_existing := jsonb_build_object('publicId',v_public_id,'status','pending_payment','subtotalMinor',v_subtotal,'shippingMinor',v_shipping,'totalMinor',v_total,'currency','CNY');
  insert into idempotency_keys (guest_session_id,key_hash,operation,response,expires_at) values (p_guest_session_id,p_idempotency_hash,'checkout',v_existing,now()+interval '24 hours');
  return v_existing;
end; $$;

create or replace function public.commerce_create_payment_attempt(
  p_guest_session_id uuid, p_order_public_id text, p_provider payment_provider, p_idempotency_hash text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order orders%rowtype; v_attempt payment_attempts%rowtype;
begin
  select * into v_order from orders where public_id=p_order_public_id and guest_session_id=p_guest_session_id for update;
  if v_order.id is null then raise exception 'ORDER_NOT_FOUND'; end if;
  if v_order.status <> 'pending_payment' or v_order.payment_status not in ('created','pending') then raise exception 'ORDER_NOT_PAYABLE'; end if;
  insert into payment_attempts(order_id,provider,idempotency_key,amount_minor,currency,status)
  values(v_order.id,p_provider,p_idempotency_hash,v_order.total_minor,v_order.currency,'created')
  on conflict(provider,idempotency_key) do update set updated_at=now()
  returning * into v_attempt;
  return jsonb_build_object('paymentId',v_attempt.id,'orderNumber',v_order.public_id,'amount',v_order.total_minor,'currency',v_order.currency);
end; $$;

create or replace function public.commerce_apply_payment_event(
  p_provider payment_provider, p_event_id text, p_payload_hash text, p_event_type text,
  p_order_public_id text, p_provider_transaction_id text, p_amount_minor bigint,
  p_currency text, p_status payment_status, p_payload jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_order orders%rowtype; v_inserted uuid;
begin
  insert into payment_webhook_events(provider,event_id,payload_hash,event_type,order_public_id,payload)
  values(p_provider,p_event_id,p_payload_hash,p_event_type,p_order_public_id,p_payload)
  on conflict do nothing returning id into v_inserted;
  if v_inserted is null then return jsonb_build_object('duplicate',true); end if;

  select * into v_order from orders where public_id=p_order_public_id for update;
  if v_order.id is null then raise exception 'ORDER_NOT_FOUND'; end if;
  if v_order.total_minor<>p_amount_minor or v_order.currency<>p_currency then raise exception 'PAYMENT_AMOUNT_MISMATCH'; end if;

  update payment_attempts set provider_payment_id=coalesce(p_provider_transaction_id,provider_payment_id), status=p_status, provider_payload=p_payload, updated_at=now()
    where id=(select id from payment_attempts where order_id=v_order.id and provider=p_provider order by created_at desc limit 1);

  if p_status='succeeded' and v_order.payment_status in ('created','pending') then
    update orders set status='paid',payment_status='succeeded',paid_at=now(),updated_at=now() where id=v_order.id;
    update inventory_reservations set status='consumed' where order_id=v_order.id and status='active';
    with consumed as (
      select variant_id, sum(quantity)::integer as quantity
      from inventory_reservations
      where order_id=v_order.id and status='consumed'
      group by variant_id
    )
    update inventory_items i set on_hand=i.on_hand-c.quantity,reserved=i.reserved-c.quantity,updated_at=now()
      from consumed c where i.variant_id=c.variant_id;
  elsif p_status in ('failed','closed') and v_order.payment_status in ('created','pending') then
    update orders set payment_status=p_status,updated_at=now() where id=v_order.id;
  end if;
  update payment_webhook_events set applied_at=now() where id=v_inserted;
  return jsonb_build_object('duplicate',false,'orderPublicId',v_order.public_id,'paymentStatus',p_status);
end; $$;

create or replace function public.commerce_release_expired_reservations()
returns integer language plpgsql security definer set search_path = public as $$
declare v_count integer;
begin
  with expired as (
    update inventory_reservations set status='expired',released_at=now()
    where status='active' and expires_at<now()
    returning order_id,variant_id,quantity
  ), released as (
    update inventory_items i set reserved=greatest(0,i.reserved-e.quantity),updated_at=now()
    from expired e where i.variant_id=e.variant_id returning e.order_id
  )
  select count(*) into v_count from released;
  update orders set status='cancelled',payment_status='closed',updated_at=now()
    where status='pending_payment' and id in (select order_id from inventory_reservations where status='expired');
  return v_count;
end; $$;

revoke all on function public.commerce_checkout(uuid,jsonb,text,text,text,text,integer,text,text,text) from public,anon,authenticated;
revoke all on function public.commerce_create_payment_attempt(uuid,text,payment_provider,text) from public,anon,authenticated;
revoke all on function public.commerce_apply_payment_event(payment_provider,text,text,text,text,text,bigint,text,payment_status,jsonb) from public,anon,authenticated;
revoke all on function public.commerce_release_expired_reservations() from public,anon,authenticated;
grant execute on function public.commerce_checkout(uuid,jsonb,text,text,text,text,integer,text,text,text) to service_role;
grant execute on function public.commerce_create_payment_attempt(uuid,text,payment_provider,text) to service_role;
grant execute on function public.commerce_apply_payment_event(payment_provider,text,text,text,text,text,bigint,text,payment_status,jsonb) to service_role;
grant execute on function public.commerce_release_expired_reservations() to service_role;
