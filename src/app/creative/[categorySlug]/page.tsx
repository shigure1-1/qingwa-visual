import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { CatalogEmptyState } from "@/components/creative/catalog-empty-state";
import { CreativeShell } from "@/components/creative/creative-shell";
import { getPublishedProducts } from "@/lib/commerce/catalog";
import {
  creativeCategories,
  getCreativeCategory,
} from "@/content/creative";

type CreativeCategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
};

export function generateStaticParams() {
  return creativeCategories.map((category) => ({ categorySlug: category.slug }));
}

export async function generateMetadata({ params }: CreativeCategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCreativeCategory(categorySlug);
  return category
    ? { title: category.title, description: category.summary }
    : { title: "未找到文创分类" };
}

export default async function CreativeCategoryPage({ params }: CreativeCategoryPageProps) {
  const { categorySlug } = await params;
  const category = getCreativeCategory(categorySlug);
  if (!category) notFound();

  const products = await getPublishedProducts(category.slug).catch(() => []);

  return (
    <CreativeShell className="creative-category-page">
      <section className="creative-category-hero">
        <div>
          <Link className="creative-back-link" href="/creative">
            <ArrowLeft aria-hidden="true" />
            返回晴蛙文创
          </Link>
          <p className="creative-status-label">{category.englishTitle} / {products.length > 0 ? "PUBLISHED" : "PREPARING"}</p>
          <h1>{category.title}</h1>
          <p>{category.summary}</p>
        </div>
        <div
          className="creative-category-hero-optic"
          data-composition={category.composition}
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
      </section>

      {products.length === 0 ? (
          <CatalogEmptyState category={category} pageSection="second" />

      ) : (
        <section className="creative-product-grid page-second-band" data-page-section="second" aria-label={`${category.title}商品`}>
          {products.map((product) => (
            <Link href={`/creative/${category.slug}/${product.slug}`} key={product.slug}>
              <span className="creative-status-label">{product.salesMode === "custom_quote" ? "定制询价" : "可购买"}</span>
              <h2>{product.title}</h2>
              <p>{product.summary}</p>
            </Link>
          ))}
        </section>
      )}
    </CreativeShell>
  );
}
