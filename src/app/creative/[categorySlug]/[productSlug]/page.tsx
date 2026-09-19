import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreativeShell } from "@/components/creative/creative-shell";
import { ProductDetail } from "@/components/creative/product-detail";
import { getCreativeCategory } from "@/content/creative";
import { getPublishedProduct } from "@/lib/commerce/catalog";
import { getCommerceReadiness } from "@/lib/commerce/runtime";

type CreativeProductPageProps = {
  params: Promise<{ categorySlug: string; productSlug: string }>;
};

export async function generateMetadata({ params }: CreativeProductPageProps): Promise<Metadata> {
  const { categorySlug, productSlug } = await params;
  const product = await getPublishedProduct(categorySlug, productSlug).catch(() => null);
  return product
    ? { title: product.title, description: product.summary }
    : { title: "未找到文创商品" };
}

export const dynamic = "force-dynamic";

export default async function CreativeProductPage({ params }: CreativeProductPageProps) {
  const { categorySlug, productSlug } = await params;
  const category = getCreativeCategory(categorySlug);
  const product = await getPublishedProduct(categorySlug, productSlug).catch(() => null);
  if (!category || !product) notFound();

  return (
    <CreativeShell className="creative-product-page">
      <ProductDetail product={product} commerceReady={getCommerceReadiness().ready} />
    </CreativeShell>
  );
}
