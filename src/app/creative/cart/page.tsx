import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { CartContents } from "@/components/creative/cart-contents";
import { CommerceSummary } from "@/components/creative/commerce-summary";
import { CreativeShell } from "@/components/creative/creative-shell";
import { getCommerceReadiness } from "@/lib/commerce/runtime";

export const metadata: Metadata = {
  title: "购物车",
  description: "晴蛙文创购物车。当前商品目录与购买功能尚未开放。",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CreativeCartPage() {
  const commerceReady = getCommerceReadiness().ready;

  return (
    <CreativeShell className="creative-commerce-page">
      <header className="creative-commerce-header">
        <Link className="creative-back-link" href="/creative">
          <ArrowLeft aria-hidden="true" />
          继续浏览
        </Link>
        <p className="creative-status-label">CART / {commerceReady ? "READY" : "UNAVAILABLE"}</p>
        <h1>购物车</h1>
        <p>{commerceReady ? "核对已选商品、规格和数量，再进入游客结算。" : "商品目录尚未开放，因此当前不能向购物车添加商品，也不能进入结算。"}</p>
      </header>

      <div className="creative-commerce-layout page-second-band" data-page-section="second">
        <section className="creative-cart-items" aria-labelledby="creative-cart-heading">
          <h2 className="creative-visually-hidden" id="creative-cart-heading">购物车商品</h2>
          {commerceReady ? (
            <CartContents commerceReady={commerceReady} />
          ) : (
            <>
              <div className="creative-cart-columns" aria-hidden="true">
                <span>商品</span>
                <span>规格</span>
                <span>数量</span>
                <span>单价</span>
                <span>小计</span>
              </div>
              <div className="creative-cart-empty">
                <ShoppingBag aria-hidden="true" />
                <div>
                  <h3>购物车为空</h3>
                  <p>这里会在商品正式发布后显示商品名称、规格、数量、单价和小计。</p>
                  <Link href="/creative#creative-categories">查看文创分类</Link>
                </div>
              </div>
              <button className="creative-primary-button" type="button" disabled>
                结算尚未开放
              </button>
            </>
          )}
        </section>
        <CommerceSummary headingId="cart-summary-heading" />
      </div>
    </CreativeShell>
  );
}
