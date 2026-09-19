import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <main className="status-page" id="main-content">
        <p>404 / NOT FOUND</p>
        <h1>这里没有可显示的内容。</h1>
        <span>页面可能已调整，或当前内容尚未公开。</span>
        <div>
          <Link href="/">
            <Home aria-hidden="true" />
            返回首页
          </Link>
          <Link href="/creative">
            查看晴蛙文创
            <ArrowLeft aria-hidden="true" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
