import type { Metadata } from "next";
import "./creative.css";

export const metadata: Metadata = {
  title: {
    default: "晴蛙文创",
    template: "%s | 晴蛙文创",
  },
  description: "晴蛙文创分类与商品目录。当前目录正在筹备，尚未开放购买。",
};

export default function CreativeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
