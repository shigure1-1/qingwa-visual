export type CreativeCategorySlug =
  | "qingwa-art"
  | "craft-customization"
  | "ip-customization"
  | "private-film";

export type CreativeCategory = {
  slug: CreativeCategorySlug;
  title: string;
  englishTitle: string;
  summary: string;
  preparationNote: string;
  composition: "aperture" | "fold" | "signal" | "frame";
};

export const creativeCategories: readonly CreativeCategory[] = [
  {
    slug: "qingwa-art",
    title: "艺术定制",
    englishTitle: "ART CUSTOMIZATION",
    summary: "艺术定制分类正在进行内容与制作准备。",
    preparationNote: "该分类尚无已发布商品。商品资料与交易条件确认后会在此上线。",
    composition: "aperture",
  },
  {
    slug: "craft-customization",
    title: "工艺定制",
    englishTitle: "CRAFT CUSTOMIZATION",
    summary: "工艺定制分类正在梳理服务边界与交付信息。",
    preparationNote: "该分类尚未开放。可选工艺、规格与交易条件确认后会在此公布。",
    composition: "fold",
  },
  {
    slug: "ip-customization",
    title: "IP定制",
    englishTitle: "IP CUSTOMIZATION",
    summary: "IP定制分类正在整理内容说明与合作流程。",
    preparationNote: "该分类尚未开放。正式内容与服务说明确认后会在此公布。",
    composition: "signal",
  },
  {
    slug: "private-film",
    title: "私人电影",
    englishTitle: "PRIVATE FILM",
    summary: "私人电影分类正在整理服务说明与交付边界。",
    preparationNote: "该分类尚未开放。服务内容、流程与交易条件确认后会在此公布。",
    composition: "frame",
  },
] as const;

export function getCreativeCategory(slug: string) {
  return creativeCategories.find((category) => category.slug === slug);
}
