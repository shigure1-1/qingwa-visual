"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductVariant = {
  id: string;
  title: string;
  priceMinor: number | null;
};

type PurchaseActionProps = {
  variants: ProductVariant[];
  commerceReady: boolean;
  quoteOnly: boolean;
};

export function PurchaseAction({ variants, commerceReady, quoteOnly }: PurchaseActionProps) {
  const router = useRouter();
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState("1");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (quoteOnly) {
    return null;
  }

  const selectedVariant = variants.find((variant) => variant.id === variantId);
  const unavailable = !commerceReady || !selectedVariant || selectedVariant.priceMinor === null;

  async function addToCart() {
    if (unavailable) return;

    setPending(true);
    setMessage(null);
    try {
      const response = await fetch("/api/commerce/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, quantity: Number(quantity) }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message ?? "商品暂时无法加入购物车");
      }
      router.push("/creative/cart");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "商品暂时无法加入购物车");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="creative-purchase-action">
      {variants.length > 1 && (
        <label className="creative-field-block" htmlFor="product-variant">
          <span>选择规格</span>
          <select
            id="product-variant"
            value={variantId}
            onChange={(event) => setVariantId(event.target.value)}
            disabled={!commerceReady || pending}
          >
            {variants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title}
              </option>
            ))}
          </select>
        </label>
      )}
      <label className="creative-field-block" htmlFor="product-quantity">
        <span>数量</span>
        <input
          id="product-quantity"
          type="number"
          min="1"
          max="99"
          inputMode="numeric"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          disabled={!commerceReady || pending}
        />
      </label>
      <button type="button" onClick={addToCart} disabled={unavailable || pending} aria-disabled={unavailable || pending}>
        {pending ? "正在加入…" : commerceReady ? "加入购物车" : "交易尚未开放"}
      </button>
      {message && <p className="creative-form-error" role="alert">{message}</p>}
    </div>
  );
}
