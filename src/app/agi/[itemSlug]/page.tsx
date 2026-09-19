import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InitiativePage } from "@/components/initiative-page";
import { getInitiative, getInitiativeItem } from "@/content/site";

type AgiItemRouteProps = {
  params: Promise<{ itemSlug: string }>;
};

export function generateStaticParams() {
  return getInitiative("agi")?.items?.map((item) => ({ itemSlug: item.slug })) ?? [];
}

export async function generateMetadata({ params }: AgiItemRouteProps): Promise<Metadata> {
  const { itemSlug } = await params;
  const result = getInitiativeItem("agi", itemSlug);
  return result
    ? { title: result.item.label, description: result.item.description }
    : { title: "未找到 AGI 子业务" };
}

export default async function AgiItemPage({ params }: AgiItemRouteProps) {
  const { itemSlug } = await params;
  const result = getInitiativeItem("agi", itemSlug);
  if (!result) notFound();
  return <InitiativePage initiative={result.initiative} item={result.item} />;
}
