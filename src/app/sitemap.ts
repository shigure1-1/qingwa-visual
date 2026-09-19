import type { MetadataRoute } from "next";
import { creativeCategories } from "@/content/creative";
import { initiatives, projects, services } from "@/content/site";
import { getPublishedProducts } from "@/lib/commerce/catalog";
import { getAbsoluteSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getPublishedProducts().catch(() => []);
  const paths = [
    "/",
    "/about",
    "/contact",
    "/creative",
    ...creativeCategories.map((category) => `/creative/${category.slug}`),
    ...products.map((product) => `/creative/${product.categorySlug}/${product.slug}`),
    ...initiatives.flatMap((initiative) => [
      `/${initiative.slug}`,
      ...(initiative.items ?? []).map((item) => `/${initiative.slug}/${item.slug}`),
    ]),
    ...services.flatMap((service) => [
      `/services/${service.slug}`,
      ...service.items.map((item) => `/services/${service.slug}/${item.slug}`),
    ]),
    "/work",
    ...projects.map((project) => `/work/${project.slug}`),
  ];

  return paths.map((path) => ({ url: getAbsoluteSiteUrl(path) }));
}
