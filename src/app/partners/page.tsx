import type { Metadata } from "next";
import { InitiativePage } from "@/components/initiative-page";
import { getInitiative } from "@/content/site";

export const metadata: Metadata = {
  title: "合作伙伴",
  description: "与策划、技术、制作、空间和内容团队建立协作网络。",
};

export default function PartnersPage() {
  const initiative = getInitiative("partners");
  if (!initiative) return null;
  return <InitiativePage initiative={initiative} />;
}
