import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WorkFilter } from "@/components/work-filter";

export const metadata: Metadata = {
  title: "作品",
  description: "浏览晴蛙视觉在数字空间、数字文旅、数字影视、数字动画、数字孪生与 AIGC 方向的代表项目。",
};

export default function WorkPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <main className="inner-main" id="main-content">
        <section className="page-intro work-intro">
          <div>
            <span>WORK / SELECTED ARCHIVE</span>
            <h1>作品不是答案，<br />是另一种看法。</h1>
          </div>
          <p>从数字空间、数字文旅到数字影视、数字孪生和 AIGC，以下内容整理自晴蛙视觉画册中的代表项目。视觉探索项目会单独标记。</p>
        </section>
        <section className="work-archive page-second-band" data-page-section="second" aria-label="代表项目">
          <Suspense fallback={<p className="work-filter-loading">正在整理项目...</p>}>
            <WorkFilter />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
