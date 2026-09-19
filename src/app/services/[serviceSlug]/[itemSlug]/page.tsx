import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/service-page";
import { getServiceItem, services } from "@/content/site";

type ServiceItemRouteProps = {
  params: Promise<{ serviceSlug: string; itemSlug: string }>;
};

export function generateStaticParams() {
  return services.flatMap((service) =>
    service.items.map((item) => ({ serviceSlug: service.slug, itemSlug: item.slug })),
  );
}

export async function generateMetadata({ params }: ServiceItemRouteProps): Promise<Metadata> {
  const { serviceSlug, itemSlug } = await params;
  const result = getServiceItem(serviceSlug, itemSlug);
  return result
    ? { title: result.item.label, description: result.item.description }
    : { title: "未找到服务方向" };
}

export default async function ServiceItemRoutePage({ params }: ServiceItemRouteProps) {
  const { serviceSlug, itemSlug } = await params;
  const result = getServiceItem(serviceSlug, itemSlug);
  if (!result) notFound();
  return <ServicePage service={result.service} item={result.item} />;
}
