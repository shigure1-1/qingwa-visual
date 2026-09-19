import Link from "next/link";
import { ArrowLeft, PackageOpen } from "lucide-react";
import type { CreativeCategory } from "@/content/creative";

type CatalogEmptyStateProps = {
  category: CreativeCategory;
  pageSection?: "second";
};

export function CatalogEmptyState({ category, pageSection = "second" }: CatalogEmptyStateProps) {
  return (
    <section
      className={["creative-catalog", pageSection ? "page-second-band" : ""].filter(Boolean).join(" ")}
      data-page-section={pageSection}
      aria-labelledby="creative-catalog-heading"
    >
      <div className="creative-empty-state">
        <PackageOpen aria-hidden="true" />
        <div>
          <p className="creative-status-label">CATALOG / PREPARING</p>
          <h2 id="creative-catalog-heading">当前没有已发布商品</h2>
          <p>{category.preparationNote}</p>
          <Link href="/creative#creative-categories">
            <ArrowLeft aria-hidden="true" />
            查看全部分类
          </Link>
        </div>
      </div>
    </section>
  );
}
