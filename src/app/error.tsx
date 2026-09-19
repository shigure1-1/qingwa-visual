"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route render failed", error.digest ?? "unknown");
  }, [error]);

  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <main className="status-page status-page-error" id="main-content">
        <p>ERROR / RECOVERY</p>
        <h1>这部分内容暂时无法显示。</h1>
        <span>请重新尝试。若涉及订单或支付，请以服务端订单状态为准。</span>
        <button type="button" onClick={reset}>
          <RotateCcw aria-hidden="true" />
          重新加载
        </button>
      </main>
      <SiteFooter />
    </>
  );
}
