"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  quantity: number;
  product_variant_id: string;
  product_variants: {
    sku: string;
    title: string;
    price_minor: number;
    currency: "CNY";
    products: { title: string; slug: string } | null;
  } | null;
};

type CartResponse = {
  id: string;
  cart_items: CartItem[];
} | null;

const currencyFormatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
});

type CartContentsProps = {
  commerceReady: boolean;
};

export function CartContents({ commerceReady }: CartContentsProps) {
  const [cart, setCart] = useState<CartResponse>(null);
  const [ready, setReady] = useState(commerceReady);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  async function loadCart() {
    const response = await fetch("/api/commerce/cart/items", { cache: "no-store" });
    const result = (await response.json()) as { ok?: boolean; cart?: CartResponse; message?: string };
    if (!response.ok || !result.ok) throw new Error(result.message ?? "购物车暂时无法读取");
    setCart(result.cart ?? null);
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const readinessResponse = await fetch("/api/commerce/readiness", { cache: "no-store" });
        const readiness = (await readinessResponse.json()) as { ready?: boolean };
        if (!readiness.ready) return;
        if (!cancelled) setReady(true);
        await loadCart();
      } catch (error) {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "购物车暂时无法读取");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  async function updateItem(itemId: string, quantity: number) {
    setMessage(null);
    try {
      const response = await fetch(`/api/commerce/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "数量更新失败");
      await loadCart();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "数量更新失败");
    }
  }

  async function removeItem(itemId: string) {
    setMessage(null);
    try {
      const response = await fetch(`/api/commerce/cart/items/${itemId}`, { method: "DELETE" });
      const result = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "商品删除失败");
      await loadCart();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "商品删除失败");
    }
  }

  const items = cart?.cart_items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.product_variants?.price_minor ?? 0;
    return sum + price * item.quantity;
  }, 0);

  if (!ready) return null;
  if (loading) return <p className="creative-inline-status" role="status">正在读取购物车…</p>;

  if (items.length === 0) {
    return (
      <div className="creative-cart-live-empty">
        <ShoppingBag aria-hidden="true" />
        <div>
          <h3>购物车为空</h3>
          <p>从已发布商品中选择规格后，商品会显示在这里。</p>
          <Link href="/creative#creative-categories">查看文创分类</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="creative-cart-live">
      {items.map((item) => {
        const variant = item.product_variants;
        if (!variant) return null;
        return (
          <article className="creative-cart-item" key={item.id}>
            <div>
              <h3>{variant.products?.title ?? "晴蛙文创商品"}</h3>
              <p>{variant.title} · {variant.sku}</p>
            </div>
            <label>
              <span>数量</span>
              <input
                type="number"
                min="1"
                max="99"
                value={item.quantity}
                onChange={(event) => void updateItem(item.id, Number(event.target.value))}
              />
            </label>
            <strong>{currencyFormatter.format((variant.price_minor * item.quantity) / 100)}</strong>
            <button type="button" onClick={() => void removeItem(item.id)}>删除</button>
          </article>
        );
      })}
      {message && <p className="creative-form-error" role="alert">{message}</p>}
      <div className="creative-cart-live-footer">
        <span>商品小计</span>
        <strong>{currencyFormatter.format(subtotal / 100)}</strong>
        <Link className="creative-primary-button" href="/creative/checkout">进入结算</Link>
      </div>
    </div>
  );
}
