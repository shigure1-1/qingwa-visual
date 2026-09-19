import type { Metadata } from "next";
import { InitiativePage } from "@/components/initiative-page";
import { getInitiative } from "@/content/site";

export const metadata: Metadata = {
  title: "行业培训",
  description: "把视觉思维、数字工具和项目方法整理为可学习、可实践的课程内容。",
};

export default function EducationTrainingPage() {
  const initiative = getInitiative("education-training");
  if (!initiative) return null;
  return <InitiativePage initiative={initiative} />;
}
