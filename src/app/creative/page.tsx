import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ShoppingBag } from "lucide-react";
import { CategoryGrid } from "@/components/creative/category-grid";
import { CreativeShell } from "@/components/creative/creative-shell";

export const metadata: Metadata = {
  title: "晴蛙文创",
  description: "浏览艺术定制、工艺定制、IP定制与私人电影四个文创方向。当前商品目录正在筹备。",
};

export default function CreativePage() {
  return (
    <CreativeShell className="creative-home">
      <section className="creative-hero">
        <div className="creative-hero-copy">
          <p className="creative-status-label">QINGWA CREATIVE / PREPARING</p>
          <h1>把观看，留在可以触碰的地方。</h1>
          <p>晴蛙文创正在建立四个内容方向。商品资料、价格与交易条件尚未发布，当前仅开放分类浏览。</p>
          <a className="creative-hero-action" href="#creative-categories">
            查看文创分类
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
        <div className="creative-hero-optic" aria-hidden="true">
          <span className="creative-optic-frame" />
          <span className="creative-optic-disc" />
          <span className="creative-optic-cut creative-optic-cut-a" />
          <span className="creative-optic-cut creative-optic-cut-b" />
          <span className="creative-optic-axis" />
        </div>
        <Link className="creative-catalog-status" href="/creative/cart">
          <ShoppingBag aria-hidden="true" />
          <span>
            <strong>商品目录筹备中</strong>
            当前购物车不可用
          </span>
        </Link>
      </section>
      <CategoryGrid pageSection="second" />
      <section className="creative-principle" aria-labelledby="creative-principle-heading">
        <p>发布原则</p>
        <h2 id="creative-principle-heading">只展示已经确认的商品信息，不用案例图片替代商品图，也不预设价格。</h2>
      </section>
    </CreativeShell>
  );
}
