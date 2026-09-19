export type HistoryBookletText = {
  pageRange: string;
  title: string;
  lead: string;
  points: string[];
  verificationNote: string;
};

export const historyBookletTexts: HistoryBookletText[] = [
  {
    pageRange: "08-09",
    title: "武汉晴蛙视觉科技有限公司 / 武汉晴蛙设计工程有限公司",
    lead: "画册介绍两家公司在智能视觉、行业应用、空间设计与工程服务方面的业务方向。",
    points: [
      "晴蛙视觉：画册列出数字展厅、数字文旅、AIGC、数字影视、数字动画与数字孪生等服务方向。",
      "晴蛙设计：画册列出沉浸式影院、企业馆、科技馆、博物馆、党建馆、校史馆、纪念馆及商业空间等方向。",
    ],
    verificationNote: "内容来自用户提供的 08-09 页画册自述；资质、客户类型、案例信息及公司关系尚未独立核验。",
  },
  {
    pageRange: "10-11",
    title: "广州晴蛙传媒科技有限公司 / 企业文化",
    lead: "画册介绍广州晴蛙传媒的品牌定位、创意内容方向、数字视觉服务与企业文化表达。",
    points: [
      "画册文字提及建筑、地产、影视、广告、动漫、文旅与娱乐活动等行业服务场景。",
      "企业文化版面呈现口号、使命、价值观与数字文旅主张，作为品牌资料保留。",
    ],
    verificationNote: "内容来自用户提供的 10-11 页画册自述；资质、项目归属、人物身份及使用授权尚未独立核验。",
  },
];

export type { HistoryBookletText as HistoryBookletImage };
export const historyBookletImages = historyBookletTexts;
