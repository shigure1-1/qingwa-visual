import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreativeShell } from "@/components/creative/creative-shell";
import { requireGuestSession } from "@/lib/commerce/guest-session";
import { getGuestOrder } from "@/lib/commerce/transactions";
import { getCommerceReadiness } from "@/lib/commerce/runtime";

export const metadata: Metadata = {
  title: "订单状态",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type CreativeOrderPageProps = {
  params: Promise<{ publicId: string }>;
};

const currency = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" });

async function loadOrder(publicId: string) {
  try {
    const session = await requireGuestSession();
    return await getGuestOrder(session.id, publicId);
  } catch {
    return null;
  }
}

export default async function CreativeOrderPage({ params }: CreativeOrderPageProps) {
  const readiness = getCommerceReadiness();
  if (!readiness.ready) notFound();

  const { publicId } = await params;
  const order = await loadOrder(publicId);
  if (!order) notFound();

  return (
    <CreativeShell className="creative-commerce-page creative-order-page">
      <header className="creative-commerce-header">
        <Link className="creative-back-link" href="/creative">
          <ArrowLeft aria-hidden="true" />
          返回晴蛙文创
        </Link>
        <p className="creative-status-label">ORDER / {String(order.status).toUpperCase()}</p>
        <h1>订单 {order.public_id}</h1>
        <p>支付、履约与物流状态均来自服务端。浏览器回跳不会改变订单结果。</p>
      </header>
      <section className="creative-order-status page-second-band" data-page-section="second" aria-labelledby="order-status-heading">
        <h2 id="order-status-heading">订单状态</h2>
        <dl>
          <div><dt>订单</dt><dd>{order.status}</dd></div>
          <div><dt>支付</dt><dd>{order.payment_status}</dd></div>
          <div><dt>履约</dt><dd>{order.fulfillment_status}</dd></div>
          <div><dt>应付金额</dt><dd>{currency.format(Number(order.total_minor) / 100)}</dd></div>
        </dl>
      </section>
    </CreativeShell>
  );
}
