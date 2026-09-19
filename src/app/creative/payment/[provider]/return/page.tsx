import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { CreativeShell } from "@/components/creative/creative-shell";

export const metadata: Metadata = {
  title: "确认支付状态",
  description: "正在等待服务端确认支付结果。",
  robots: { index: false, follow: false },
};

type PaymentReturnPageProps = {
  params: Promise<{ provider: string }>;
};

export default async function PaymentReturnPage({ params }: PaymentReturnPageProps) {
  const { provider } = await params;
  void provider;

  return (
    <CreativeShell className="creative-payment-page">
      <section className="creative-payment-status" aria-labelledby="payment-status-heading">
        <LoaderCircle aria-hidden="true" />
        <p className="creative-status-label">PAYMENT / VERIFYING</p>
        <h1 id="payment-status-heading">服务端确认中</h1>
        <p role="status" aria-live="polite">正在等待服务端核验本次支付结果。浏览器回跳不代表付款成功。</p>
        <Link href="/creative">
          <ArrowLeft aria-hidden="true" />
          返回晴蛙文创
        </Link>
      </section>
    </CreativeShell>
  );
}
