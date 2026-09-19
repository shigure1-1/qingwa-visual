import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/service-page";
import { getService, services } from "@/content/site";

type ServiceRouteProps = {
  params: Promise<{ serviceSlug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ serviceSlug: service.slug }));
}

export async function generateMetadata({ params }: ServiceRouteProps): Promise<Metadata> {
  const { serviceSlug } = await params;
  const service = getService(serviceSlug);
  return service
    ? { title: service.title, description: service.description }
    : { title: "未找到服务" };
}

export default async function ServiceRoutePage({ params }: ServiceRouteProps) {
  const { serviceSlug } = await params;
  const service = getService(serviceSlug);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
