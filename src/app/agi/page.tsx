import type { Metadata } from "next";
import { InitiativePage } from "@/components/initiative-page";
import { getInitiative } from "@/content/site";

export const metadata: Metadata = {
  title: "AGI",
  description: "探索人工智能如何成为可以被理解、被使用的创造力工具。",
};

export default function AgiPage() {
  const initiative = getInitiative("agi");
  if (!initiative) return null;
  return <InitiativePage initiative={initiative} />;
}
