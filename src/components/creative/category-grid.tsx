import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { creativeCategories } from "@/content/creative";

type CategoryGridProps = {
  pageSection?: "second";
};

export function CategoryGrid({ pageSection = "second" }: CategoryGridProps) {
  return (
    <section
      className={["creative-categories", pageSection ? "page-second-band" : ""].filter(Boolean).join(" ")}
      data-page-section={pageSection}
      id="creative-categories"
      aria-labelledby="creative-categories-heading"
    >
      <header className="creative-section-heading">
        <h2 id="creative-categories-heading">四个文创方向，正在逐项准备。</h2>
        <p>当前没有已发布商品。分类入口保留真实筹备状态，开放时间以页面后续更新为准。</p>
      </header>
      <div className="creative-category-grid">
        {creativeCategories.map((category) => (
          <Link className="creative-category-tile" href={`/creative/${category.slug}`} key={category.slug}>
            <div
              className="creative-category-optic"
              data-composition={category.composition}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </div>
            <div className="creative-category-copy">
              <span className="creative-status-label">筹备中</span>
              <h3>{category.title}</h3>
              <p>{category.englishTitle}</p>
              <ArrowUpRight aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
