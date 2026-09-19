export type HonorImageKind = "document" | "plaque" | "trophy";

export type HonorImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  kind: HonorImageKind;
};

export type HonorGroup = {
  slug: "enterprise" | "visual" | "design";
  label: string;
  archiveLabel: string;
  description: string;
  images: HonorImage[];
};

const enterpriseImages: HonorImage[] = [
  {
    src: "/about/honors/enterprise/plaque-01.png",
    alt: "企业荣誉挂牌资料 01，用户提供的待核验荣誉图片",
    width: 1015,
    height: 763,
    label: "挂牌资料 01",
    kind: "plaque",
  },
  {
    src: "/about/honors/enterprise/plaque-05.png",
    alt: "企业荣誉挂牌资料 05，用户提供的待核验荣誉图片",
    width: 1015,
    height: 763,
    label: "挂牌资料 05",
    kind: "plaque",
  },
  ...[2, 3, 4].map((value) => {
    const number = String(value).padStart(2, "0");
    return {
      src: `/about/honors/enterprise/plaque-${number}.png`,
      alt: `企业荣誉挂牌资料 ${number}，用户提供的待核验荣誉图片`,
      width: 1015,
      height: 763,
      label: `挂牌资料 ${number}`,
      kind: "plaque" as const,
    };
  }),
  ...Array.from({ length: 4 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      src: `/about/honors/enterprise/trophy-${number}.png`,
      alt: `企业荣誉奖杯资料 ${number}，用户提供的待核验荣誉图片`,
      width: index === 0 ? 467 : 466,
      height: 763,
      label: `奖杯资料 ${number}`,
      kind: "trophy" as const,
    };
  }),
];

function createDocumentImages(
  group: "visual" | "design",
  groupLabel: string,
  dimensions: Array<[number, number]>,
): HonorImage[] {
  return dimensions.map(([width, height], index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      src: `/about/honors/${group}/${number}.png`,
      alt: `${groupLabel}资料 ${number}，用户提供的待核验荣誉图片`,
      width,
      height,
      label: `${groupLabel}资料 ${number}`,
      kind: "document",
    };
  });
}

const visualImages = createDocumentImages(
  "visual",
  "视觉荣誉",
  Array.from({ length: 12 }, (_, index) => (
    index < 4 || index === 7 ? [507, 802] : [505, 800]
  )),
);

const designImages = createDocumentImages(
  "design",
  "设计荣誉",
  Array.from({ length: 12 }, () => [506, 791]),
);

export const honorGroups: HonorGroup[] = [
  {
    slug: "enterprise",
    label: "企业荣誉",
    archiveLabel: "ENTERPRISE / ARCHIVE",
    description: "根目录中的挂牌与奖杯图片，按原始素材编号展示。",
    images: enterpriseImages,
  },
  {
    slug: "visual",
    label: "视觉荣誉",
    archiveLabel: "VISUAL / ARCHIVE",
    description: "按“视觉荣誉”文件夹名称归档，具体文件内容与权属仍待逐项核验。",
    images: visualImages,
  },
  {
    slug: "design",
    label: "设计荣誉",
    archiveLabel: "DESIGN / ARCHIVE",
    description: "按“设计荣誉”文件夹名称归档，具体文件内容与权属仍待逐项核验。",
    images: designImages,
  },
];
