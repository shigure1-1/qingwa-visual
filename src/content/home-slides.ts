export const homeSlides = [
  {
    src: "/home/hero-slides/01-film-ad.jpg",
    title: "影视广告",
    alt: "影视广告：服务当下，影响未来。竹林水岸影像作品与影视广告服务方向。",
    href: "/services/digital-film",
  },
  {
    src: "/home/hero-slides/02-digital-exhibition.jpg",
    title: "数字展厅",
    alt: "数字展厅：晴蛙视觉数字空间与展厅展馆作品。",
    href: "/services/digital-space",
  },
  {
    src: "/home/hero-slides/03-digital-tourism.jpg",
    title: "数字文旅",
    alt: "数字文旅：晴蛙视觉文旅与现场视觉作品。",
    href: "/services/digital-tourism",
  },
  {
    src: "/home/hero-slides/04-film-animation.jpg",
    title: "影视动画",
    alt: "影视动画：晴蛙视觉动画与数字影像作品。",
    href: "/services/digital-animation",
  },
  {
    src: "/home/hero-slides/05-digital-research.jpg",
    title: "智能数字研究院",
    alt: "智能数字研究院：晴蛙视觉智能数字研究与视觉服务。",
    href: "/agi",
  },
] as const;

export function getHomeSlideIndex(index: number) {
  return ((index % homeSlides.length) + homeSlides.length) % homeSlides.length;
}
