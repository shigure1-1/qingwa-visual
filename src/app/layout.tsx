import type { Metadata } from "next";
import { getMetadataBase } from "@/lib/site-url";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/archivo";
import "./foundation.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "晴蛙视觉 | 一眼所见，从此不同",
    template: "%s | 晴蛙视觉",
  },
  description:
    "晴蛙视觉提供晴蛙文创、数字空间、数字文旅、数字影视、数字动画、数字孪生与 AIGC 视觉服务。",
  openGraph: {
    title: "晴蛙视觉 | 一眼所见，从此不同",
    description: "从晴蛙文创、空间与影像到数字孪生和 AIGC，以不同视角建立可被记住的视觉体验。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      data-design-direction="optical-facet"
      data-design-seed="8f0e0fa3"
      data-scroll-behavior="smooth"
    >
      <body>
        {/*
        THESIS: 晴蛙视觉把“改变观看方式”变成可见的折面镜头，拒绝标准深色作品宫格。
        OWN-WORLD: 黑、白、晴蛙青与暖珊瑚光谱偏移；三角切片、校准线、硬切和逐层显影。
        STORY: 访客先识别品牌视角，再看真实项目与能力，最后准备合作简报。
        FIRST VIEWPORT: 左侧品牌主张与行动，右侧巨型折面标志折射作品色场，底部露出下一节。
        FORM: 光学折面，grounded candidate 5，seed 8f0e0fa3。
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
        */}
        {children}
      </body>
    </html>
  );
}
