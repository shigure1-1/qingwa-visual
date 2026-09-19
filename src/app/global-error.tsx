"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application render failed", error.digest ?? "unknown");
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <main className="status-page status-page-error" id="main-content">
          <p>ERROR / RECOVERY</p>
          <h1>页面暂时无法显示。</h1>
          <span>请重新尝试。交易状态不会由这个页面修改。</span>
          <button type="button" onClick={reset}>
            <RotateCcw aria-hidden="true" />
            重新加载
          </button>
        </main>
      </body>
    </html>
  );
}
