import { creativeCategories } from "@/content/creative";

export type ProjectCategory =
  | "数字空间"
  | "数字文旅"
  | "数字影视"
  | "数字动画"
  | "数字孪生"
  | "AIGC"
  | "视觉探索";

export type Project = {
  slug: string;
  title: string;
  englishTitle: string;
  category: ProjectCategory;
  year: string;
  summary: string;
  challenge: string;
  approach: string;
  result: string;
  accent: string;
  secondary: string;
  art: "aperture" | "signal" | "spectrum";
  image?: string;
  sourceLabel?: string;
  concept?: boolean;
};

export type ContactLocation = {
  city: string;
  address: string;
  phone: string;
  email?: string;
};

export type ServiceGalleryLayout =
  | "standard"
  | "two-up"
  | "featured-07-08"
  | "digital-twin-spread"
  | "agi-spread"
  | "film-sequence";

export type ServiceItem = {
  label: string;
  slug: string;
  description: string;
  gallery?: ServiceGalleryItem[];
  galleryLayout?: ServiceGalleryLayout;
};

export type ServiceGalleryItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type InitiativeItem = {
  label: string;
  slug: string;
  description: string;
};

export type Service = {
  title: string;
  navLabel: string;
  englishTitle: string;
  slug: string;
  category: Exclude<ProjectCategory, "视觉探索">;
  description: string;
  heroDescription: string;
  capabilities: string[];
  accent: string;
  secondary: string;
  art: "aperture" | "signal" | "spectrum";
  items: ServiceItem[];
  gallery?: ServiceGalleryItem[];
  galleryLayout?: ServiceGalleryLayout;
};

export type Initiative = {
  label: string;
  slug: string;
  englishTitle: string;
  description: string;
  directions: string[];
  items?: InitiativeItem[];
  gallery?: ServiceGalleryItem[];
  galleryLayout?: ServiceGalleryLayout;
  topic: string;
  accent: string;
  secondary: string;
  art: "aperture" | "signal" | "spectrum";
};

export type NavigationItemKind = "link" | "menu";
export type NavigationItemAlign = "center" | "end";
export type NavigationItemVariant = "default" | "all";

export type NavigationItem = {
  label: string;
  href: string;
  kind: NavigationItemKind;
  align: NavigationItemAlign;
  sectionLabel: string;
  variant: NavigationItemVariant;
  children?: NavigationItem[];
};

export const company = {
  name: "晴蛙视觉",
  englishName: "SUN-FROG VISUAL",
  slogan: "一眼所见，从此不同",
  established: "2010",
  years: "16+",
  projectCount: "1000+",
  provinceCount: "19",
  cityCount: "54",
  summary:
    "以科技为导向、以品牌服务为核心、以创意与内容为主要竞争力，为企业、政府、学校与文旅项目提供从空间到影像、从数字内容到 AI 应用的视觉服务。",
  entities: [
    "武汉晴蛙视觉科技有限公司",
    "武汉晴蛙设计工程有限公司",
    "广州晴蛙传媒科技有限公司",
  ],
  credentials: [
    "国家高新技术企业认定（2024）",
    "国家级科技型中小企业",
    "广播电视节目制作经营许可证",
    "立信企业",
  ],
  profile: {
    overview:
      "以科技为导向、以品牌服务为核心、以创意与内容为主要竞争力。晴蛙为企业、政府、学校与文旅项目提供从空间到影像、从数字内容到 AI 应用的视觉综合服务。",
    entities: [
      {
        name: "武汉晴蛙视觉科技有限公司",
        qualification: "国家级高新技术企业 · 国家级科技型中小企业",
        description:
          "立足于智能视觉与行业应用，以创意为核心、以需求为导向，为政府、国企、央企、文旅、军工、地产与民企等行业客户提供一体化视觉服务。",
        details: [
          {
            title: "覆盖能力",
            value: "数字展厅、数字文旅、AIGC、数字影视、数字动画、数字孪生",
          },
          {
            title: "一站式服务",
            value: "创意策划、剧组拍摄、三维制作、角色动画、影视特效、调色包装与后期剪辑",
          },
          {
            title: "工作准则",
            value: "高性价比、顶尖团队、极客精神，以完善的生态链保障项目品质",
          },
        ],
        tone: "ink",
      },
      {
        name: "武汉晴蛙设计工程有限公司",
        qualification: "国家级高新技术企业 · 科技型中小企业",
        description:
          "秉持“品质第一、用心服务；专注客户，稳健发展”的理念，将态度注入设计，提升品质、打造精品、塑造品牌，为客户提供兼具价值与艺术感的互动智能空间。",
        details: [
          {
            title: "空间类型",
            value: "企业馆、科技馆、博物馆、党建馆、校史馆、纪念馆、商业空间、别墅大宅与景观园林",
          },
          {
            title: "项目方向",
            value: "沉浸式影院、企业馆、科技馆、博物馆、党建馆、校史馆、纪念馆与商业娱乐空间",
          },
          {
            title: "服务对象",
            value: "政府、国企、央企、地产及各类企业",
          },
        ],
        tone: "teal",
      },
      {
        name: "广州晴蛙传媒科技有限公司",
        qualification: "前沿技术导向 · 品牌服务核心",
        description:
          "以创意与内容为主要竞争力，依托长期积累的技术实力和前瞻性的创意设计能力，为建筑、地产、影视、广告、动漫、文旅与娱乐活动等行业提供打动人心的作品。",
        details: [
          {
            title: "数字能力",
            value: "高端 TVC、AIGC、UE5、数字展厅、数字孪生、数字人、IP、VR 与 XR",
          },
          {
            title: "文化主张",
            value: "一眼所见，从此不同；用有灵魂的作品影响世界",
          },
          {
            title: "长期价值",
            value: "服务当下，影响未来；用数字定义文旅未来",
          },
        ],
        tone: "paper",
      },
    ],
  },
};

export const locations: ContactLocation[] = [
  {
    city: "武汉 · 汉阳",
    address: "武汉市汉阳区万隆城市广场805",
    phone: "15717150315",
    email: "546315992@qq.com",
  },
  {
    city: "武汉 · 光谷",
    address: "湖北省武汉市东湖新技术开发区国际企业中心三期1栋3层04号C131",
    phone: "15717150315",
  },
  {
    city: "深圳",
    address: "深圳市罗湖区南湖街道新南社区",
    phone: "15335894300",
    email: "344837310@qq.com",
  },
  {
    city: "上海",
    address: "上海金山区山阳镇湾区文创汇",
    phone: "15900513406",
    email: "243509681@qq.com",
  },
  {
    city: "北京",
    address: "北京市顺义区信达路17号院4号楼",
    phone: "027-8480 0688",
    email: "546315992@qq.com",
  },
  {
    city: "广州",
    address: "广州市白云区广园中路151号4123房",
    phone: "13699746685",
    email: "510756286@qq.com",
  },
  {
    city: "云南 · 昆明",
    address: "云南省昆明市盘龙区新希望·锦麟峯荟二期",
    phone: "13407175779",
    email: "510756286@qq.com",
  },
];

export const socialChannels = ["微信公众号：晴蛙视觉", "视频号：晴蛙视觉", "抖音：晴蛙视觉", "微博：晴蛙视觉"];

const digitalSpaceGallery: ServiceGalleryItem[] = [
  { src: "/services/digital-space/gallery/01.png", alt: "画面标注为国家数字农业区域（京津冀）创新中心，展厅内设环形吊顶装置和大型弧形显示屏", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/02.png", alt: "画面标注为黄冈临空经济区展示中心，展厅墙面排列多块农业景观显示屏，顶部设曲线灯带", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/03.png", alt: "画面标注为国网湖北廉政教育展厅，效果图展示带人物图像和历史照片的数字展示墙", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/04.png", alt: "画面标注为武汉爱机汽车企业展示区，墙面以时间轴和图文展板呈现企业发展历程", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/05.png", alt: "画面标注为东风商用车展厅多媒体影片，深色展厅内设蓝色线形灯带和中央宽屏", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/06.png", alt: "画面标注为菲利华石英玻璃展厅多媒体，效果图展示中央数字沙盘、宽屏和墙面图文展板", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/07.png", alt: "画面标注为智慧地信产业展厅，白蓝色展厅通道内设墙面图文展板和显示屏", width: 2042, height: 1086 },
  { src: "/services/digital-space/gallery/08.png", alt: "画面标注为第二届中国（武汉）文化旅游博览会世界大河馆《大河文明》，直播画面中两位主持人站在冰雪主题展区前", width: 2042, height: 1086 },
  { src: "/services/digital-space/gallery/09.png", alt: "画面标注为安琪酵母科技馆，弧形展厅内设环幕投影、中央模型台和交互终端", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/10.png", alt: "画面标注为武汉科技馆，圆形展厅内设太阳与行星模型、环形展台和舱体式展项", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/11.png", alt: "画面标注为三峡大学校史馆，展厅中央设校名立柱，四周陈列历史照片和图文展板", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/12.png", alt: "画面标注为卓尔智城武汉客厅展厅，参观者站在大型蓝色数据可视化显示墙前", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/13.png", alt: "画面标注为长江信达数字体验馆，白蓝色展厅内设悬挂式数字装置和多块显示屏", width: 1000, height: 528 },
  { src: "/services/digital-space/gallery/14.png", alt: "画面标注为岳普湖爱国主义教育基地，建筑入口内可见红色主题显示屏，门侧立有基地与科技馆标牌", width: 1000, height: 528 },
];

const smartSpaceGallery: ServiceGalleryItem[] = [
  { src: "/services/digital-space/smart-space/gallery/01.png", alt: "数字空间素材 01：江景大平层室内与城市江景效果图", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/02.png", alt: "数字空间素材 02：江景住宅室内与城市景观效果图", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/03.png", alt: "数字空间素材 03：住宅样板间客厅与餐厅效果图", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/04.png", alt: "数字空间素材 04：活力城景观园林效果图", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/05.png", alt: "数字空间素材 05：地产售楼部空间效果图", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/06.png", alt: "数字空间素材 06：养生 SPA 室内空间效果图", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/07.png", alt: "数字空间素材 07：别墅豪宅室内空间效果图", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/08.png", alt: "数字空间素材 08：酒店与会所室内空间效果图", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/09.png", alt: "数字空间素材 09：武昌古城斗级营景观施工现场画面", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/10.png", alt: "数字空间素材 10：万科红郡阳光房室内画面", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/11.png", alt: "数字空间素材 11：餐饮商业空间室内画面", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/12.png", alt: "数字空间素材 12：民宿室内空间画面", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/13.png", alt: "数字空间素材 13：办公室室内画面", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/14.png", alt: "数字空间素材 14：酒吧室内空间画面", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/15.png", alt: "数字空间素材 15：整形医院室内空间画面", width: 997, height: 633 },
  { src: "/services/digital-space/smart-space/gallery/16.png", alt: "数字空间素材 16：洗浴中心室内空间画面", width: 997, height: 633 },
];

const digitalTourismGallery: ServiceGalleryItem[] = [
  { src: "/services/digital-tourism/gallery/01.png", alt: "数字文旅素材 01：邯郸双子楼建筑投影秀画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/02.png", alt: "数字文旅素材 02：农民春节联欢会舞台视觉画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/03.png", alt: "数字文旅素材 03：荆州楚文化节舞台与观众现场画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/04.png", alt: "数字文旅素材 04：楚文化主题舞台视觉与演出画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/05.png", alt: "数字文旅素材 05：海尔展销会裸眼 3D 屏幕展示画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/06.png", alt: "数字文旅素材 06：春节联欢活动舞台与现场视觉画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/07.png", alt: "数字文旅素材 07：武汉汉街万达广场沉浸艺术场景画面", width: 2044, height: 1090 },
  { src: "/services/digital-tourism/gallery/08.png", alt: "数字文旅素材 08：QQ 飞车亚洲杯总决赛舞台视觉画面", width: 2042, height: 1086 },
  { src: "/services/digital-tourism/gallery/09.png", alt: "数字文旅素材 09：江苏阳羡生态旅游度假区裸眼 3D 画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/10.png", alt: "数字文旅素材 10：江苏龙年主题裸眼 3D 屏幕画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/11.png", alt: "数字文旅素材 11：2019 武汉江滩军运会灯光秀画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/12.png", alt: "数字文旅素材 12：MR 文旅夜游与沉浸体验画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/13.png", alt: "数字文旅素材 13：第二届中国武汉文化旅游博览会直播画面", width: 998, height: 526 },
  { src: "/services/digital-tourism/gallery/14.png", alt: "数字文旅素材 14：远洋地产发布会舞台视觉画面", width: 998, height: 526 },
];

const microFilmGallery: ServiceGalleryItem[] = [
  { src: "/services/digital-film/micro/gallery/01.png", alt: "数字影视微电影图集 01", width: 2044, height: 1084 },
  { src: "/services/digital-film/micro/gallery/02.png", alt: "数字影视微电影图集 02", width: 2044, height: 1084 },
  { src: "/services/digital-film/micro/gallery/03.png", alt: "数字影视微电影图集 03", width: 2044, height: 1084 },
  { src: "/services/digital-film/micro/gallery/04.png", alt: "数字影视微电影图集 04", width: 2044, height: 1084 },
  { src: "/services/digital-film/micro/gallery/05.png", alt: "数字影视微电影图集 05", width: 997, height: 526 },
  { src: "/services/digital-film/micro/gallery/06.png", alt: "数字影视微电影图集 06", width: 997, height: 526 },
  { src: "/services/digital-film/micro/gallery/07.png", alt: "数字影视微电影图集 07", width: 997, height: 526 },
  { src: "/services/digital-film/micro/gallery/08.png", alt: "数字影视微电影图集 08", width: 997, height: 526 },
];

const tvcGallery: ServiceGalleryItem[] = Array.from({ length: 10 }, (_, index) => ({
  src: `/services/digital-film/tvc/gallery/${String(index + 1).padStart(2, "0")}.png`,
  alt: `数字影视 TVC 图集 ${String(index + 1).padStart(2, "0")}`,
  width: 998,
  height: 526,
}));

const promoFilmGallery: ServiceGalleryItem[] = Array.from({ length: 10 }, (_, index) => ({
  src: `/services/digital-film/promo/gallery/${String(index + 11).padStart(2, "0")}.png`,
  alt: `数字影视宣传片图集 ${String(index + 11).padStart(2, "0")}`,
  width: 998,
  height: 526,
}));

const filmAnimationGallery: ServiceGalleryItem[] = Array.from({ length: 10 }, (_, index) => ({
  src: `/services/digital-animation/film-animation/gallery/${String(index + 1).padStart(2, "0")}.png`,
  alt: `数字动画影视动画图集 ${String(index + 1).padStart(2, "0")}`,
  width: 999,
  height: 526,
}));

const productAnimationGallery: ServiceGalleryItem[] = Array.from({ length: 10 }, (_, index) => ({
  src: `/services/digital-animation/product-animation/gallery/${String(index + 1).padStart(2, "0")}.png`,
  alt: `数字动画产品动画图集 ${String(index + 1).padStart(2, "0")}`,
  width: 999,
  height: 526,
}));

const propertyAnimationGallery: ServiceGalleryItem[] = Array.from({ length: 20 }, (_, index) => ({
  src: `/services/digital-animation/property-animation/gallery/${String(index + 1).padStart(2, "0")}.png`,
  alt: `数字动画地产动画图集 ${String(index + 1).padStart(2, "0")}`,
  width: 999,
  height: 527,
}));

const digitalTwinGallery: ServiceGalleryItem[] = [
  { src: "/services/digital-twin/gallery/01.png", alt: "数字孪生图集 01", width: 2046, height: 1071 },
  ...Array.from({ length: 12 }, (_, index) => ({
    src: `/services/digital-twin/gallery/${String(index + 2).padStart(2, "0")}.png`,
    alt: `数字孪生图集 ${String(index + 2).padStart(2, "0")}`,
    width: 999,
    height: 528,
  })),
  { src: "/services/digital-twin/gallery/14.png", alt: "数字孪生图集 14", width: 2046, height: 1089 },
];

const agiGallery: ServiceGalleryItem[] = Array.from({ length: 17 }, (_, index) => ({
  src: `/agi/gallery/${String(index + 1).padStart(2, "0")}.png`,
  alt: `AGI 图集 ${String(index + 1).padStart(2, "0")}`,
  width: index === 0 ? 2042 : 1000,
  height: index === 0 ? 1064 : 527,
}));

const aigcGallery: ServiceGalleryItem[] = Array.from({ length: 20 }, (_, index) => ({
  src: `/services/aigc/gallery/${String(index + 1).padStart(2, "0")}.png`,
  alt: `AIGC 图集 ${String(index + 1).padStart(2, "0")}`,
  width: 999,
  height: 528,
}));

export const services: Service[] = [
  {
    title: "数字空间",
    navLabel: "数字空间",
    englishTitle: "DIGITAL SPACE",
    slug: "digital-space",
    category: "数字空间",
    description: "从展厅、展馆到沉浸式影院和智能空间，完成空间策划、视觉内容、展陈与多媒体系统的整合。",
    heroDescription: "让空间不只是被经过，而是成为一条可以被理解、被记住的观看路径。",
    capabilities: ["空间叙事与动线规划", "展陈内容与交互界面", "屏幕、灯光与多媒体系统整合"],
    accent: "#52b8bc",
    secondary: "#071b26",
    art: "aperture",
    items: [
      { label: "展厅展馆", slug: "exhibition", description: "围绕品牌、产业或公共主题组织展厅展馆的空间动线、信息层级与多媒体内容。" },
      { label: "数字影院", slug: "digital-cinema", description: "以环幕、沉浸式屏幕和声音设计构建适合叙事与观看的数字影院体验。" },
      { label: "智能空间全案", slug: "smart-space", description: "把空间设计、设备联动、内容系统与现场使用场景放进同一套解决方案。", gallery: smartSpaceGallery },
      { label: "艺术空间", slug: "art-space", description: "以视觉主题、材料关系和光影节奏建立具有识别度的艺术空间氛围。" },
      { label: "艺术墙体", slug: "art-wall", description: "将品牌信息、图形语言与墙面媒介结合，形成可阅读的空间视觉界面。" },
    ],
    gallery: digitalSpaceGallery,
    galleryLayout: "featured-07-08",
  },
  {
    title: "数字文旅",
    navLabel: "数字文旅",
    englishTitle: "DIGITAL TOURISM",
    slug: "digital-tourism",
    category: "数字文旅",
    description: "以裸眼 3D、赛事发布、3D Mapping、光影秀演和电视综艺，帮助文旅与活动项目建立可被记住的现场体验。",
    heroDescription: "把城市、节庆与现场事件转化为有节奏、有尺度、有传播力的公共视觉体验。",
    capabilities: ["城市与文旅主题提炼", "现场屏幕与光影内容设计", "发布、演出与传播视觉统筹"],
    accent: "#ff6d5a",
    secondary: "#0b2230",
    art: "signal",
    items: [
      { label: "裸眼3D", slug: "naked-eye-3d", description: "针对户外大屏的视差、尺度与观看距离设计裸眼 3D 内容。" },
      { label: "赛事发布", slug: "event-launch", description: "从赛事主题到发布现场，建立适配舞台、屏幕和传播物料的视觉系统。" },
      { label: "3D Mapping", slug: "mapping-show", description: "根据建筑结构与投影条件编排 3D Mapping 画面、节奏和空间变化。" },
      { label: "光影秀演", slug: "light-show", description: "以光、影、声音和现场动线共同编排可观看的城市或场地演出内容。" },
      { label: "电视综艺", slug: "tv-variety", description: "覆盖节目包装、舞台视觉和片头片尾等电视综艺视觉内容。" },
    ],
    gallery: digitalTourismGallery,
    galleryLayout: "featured-07-08",
  },
  {
    title: "数字影视",
    navLabel: "数字影视",
    englishTitle: "DIGITAL FILM",
    slug: "digital-film",
    category: "数字影视",
    description: "覆盖 TVC、宣传片和微电影，从前期创意到视觉执行形成完整影像链路。",
    heroDescription: "从一个核心观点出发，把品牌、人物和产品放进可以被观看的影像叙事。",
    capabilities: ["创意概念与脚本梳理", "拍摄执行与视觉指导", "剪辑、包装与传播版本适配"],
    accent: "#d8ff43",
    secondary: "#111410",
    art: "spectrum",
    items: [
      { label: "TVC", slug: "tvc", description: "为商业广告建立从创意、镜头语言到后期包装的短片表达。", gallery: tvcGallery, galleryLayout: "two-up" },
      { label: "宣传片", slug: "promo-film", description: "梳理企业、城市或产品信息，以清晰的影像结构完成对外传播。", gallery: promoFilmGallery, galleryLayout: "two-up" },
      { label: "微电影", slug: "micro-film", description: "以人物、情节和生活质感为核心，形成完整的短篇叙事影像。", gallery: microFilmGallery, galleryLayout: "film-sequence" },
    ],
  },
  {
    title: "数字动画",
    navLabel: "数字动画",
    englishTitle: "DIGITAL ANIMATION",
    slug: "digital-animation",
    category: "数字动画",
    description: "面向影视、产品、地产和二维内容场景，以动画把结构、功能与叙事转化为清晰的视觉表达。",
    heroDescription: "让复杂的结构、功能与想象，通过运动、材质和镜头变得清晰可见。",
    capabilities: ["三维建模与材质表达", "镜头设计与动画节奏", "产品、地产与影视内容适配"],
    accent: "#52b8bc",
    secondary: "#12232b",
    art: "aperture",
    items: [
      { label: "影视动画", slug: "film-animation", description: "以角色、场景和镜头运动承载影视内容中的世界观与叙事。", gallery: filmAnimationGallery, galleryLayout: "two-up" },
      { label: "产品动画", slug: "product-animation", description: "拆解产品结构和功能，用动画建立易于理解的展示路径。", gallery: productAnimationGallery, galleryLayout: "two-up" },
      { label: "地产动画", slug: "property-animation", description: "将建筑、社区和生活场景转译为具有空间感的地产视觉内容。", gallery: propertyAnimationGallery, galleryLayout: "two-up" },
      { label: "二维动画", slug: "2d-animation", description: "以图形、角色和节奏完成适合品牌传播与内容表达的二维动画。" },
    ],
  },
  {
    title: "数字孪生",
    navLabel: "数字孪生",
    englishTitle: "DIGITAL TWIN",
    slug: "digital-twin",
    category: "数字孪生",
    description: "把售楼、园区、工业、扩展现实与数字人场景转译成可理解、可交互的数字系统。",
    heroDescription: "把真实世界的空间、数据与流程建立成可以浏览、沟通和持续更新的数字镜像。",
    capabilities: ["空间数据与三维场景组织", "信息层级与交互路径设计", "VR、AR、XR、MR 场景适配"],
    accent: "#52b8bc",
    secondary: "#172b3e",
    art: "signal",
    gallery: digitalTwinGallery,
    galleryLayout: "digital-twin-spread",
    items: [
      { label: "售楼系统", slug: "sales-system", description: "围绕项目区位、规划、户型与配套信息建立可视化售楼系统。" },
      { label: "智慧园区", slug: "smart-park", description: "将园区空间、设施和运营信息组织为可查看、可交互的数字界面。" },
      { label: "智慧工业", slug: "smart-industry", description: "面向工业流程与设备关系建立清晰的三维场景和信息入口。" },
      { label: "VR AR XR MR", slug: "extended-reality", description: "根据设备、空间和使用任务设计不同扩展现实媒介中的观看体验。" },
      { label: "数字人", slug: "digital-human", description: "从角色设定、视觉形象到交互场景，构建可用于内容与服务的数字人表达。" },
    ],
  },
  {
    title: "AIGC / AI Agent",
    navLabel: "AIGC",
    englishTitle: "AIGC / AI AGENT",
    slug: "aigc",
    category: "AIGC",
    description: "将商业广告、短剧、漫剧与电影等生成式视觉纳入有叙事、有边界、可控制的内容生产流程。",
    heroDescription: "把生成式工具放进从商业传播到电影创意的视觉系统，让主题、角色与镜头保持一致。",
    capabilities: ["商业传播与电影视觉开发", "主题、角色、风格与提示词设定", "生成内容筛选、人工整合与版本生产"],
    accent: "#d8ff43",
    secondary: "#2f536a",
    art: "spectrum",
    gallery: aigcGallery,
    galleryLayout: "two-up",
    items: [
      { label: "商业广告", slug: "commercial", description: "为商业传播探索概念图、分镜、KV 与可延展的视觉方向。" },
      { label: "短剧", slug: "short-drama", description: "支持短剧角色、场景、气氛与宣发物料的生成式视觉开发。" },
      { label: "漫剧", slug: "comic-drama", description: "围绕漫画角色、分镜、场景与连续叙事，建立适合漫剧内容生产的生成式视觉流程。" },
      { label: "电影", slug: "film", description: "围绕电影概念、角色、场景与镜头语言，建立可延续到动态影像的生成式视觉方向。" },
    ],
  },
];

export const initiatives: Initiative[] = [
  {
    label: "AGI",
    slug: "agi",
    englishTitle: "AGI / NEW CAPABILITIES",
    description: "围绕知识、内容与工作流，探索人工智能如何成为可以被理解、被使用的创造力工具。",
    directions: ["AI 能力与品牌内容", "知识界面与工作流", "面向组织的智能应用探索"],
    gallery: agiGallery,
    galleryLayout: "agi-spread",
    items: [
      {
        label: "网站制作",
        slug: "website-production",
        description: "从品牌目标、内容结构与使用场景出发，建立可持续维护的网站体验。",
      },
      {
        label: "企业AI转型",
        slug: "enterprise-ai-transformation",
        description: "梳理企业的业务流程、知识资产与团队协作方式，探索适合组织实际情况的 AI 应用路径。",
      },
      {
        label: "数字孪生搭建",
        slug: "digital-twin-building",
        description: "将真实空间、业务数据与交互需求组织成可浏览、可沟通、可持续更新的数字孪生基础。",
      },
      {
        label: "本地大模型部署",
        slug: "local-llm-deployment",
        description: "围绕数据边界、算力条件与使用任务，规划本地大模型的部署评估与应用接入方式。",
      },
    ],
    topic: "AGI",
    accent: "#52b8bc",
    secondary: "#071b26",
    art: "aperture",
  },
  {
    label: "行业培训",
    slug: "education-training",
    englishTitle: "EDUCATION / TRAINING",
    description: "面向学校、机构与团队，把视觉思维、数字工具和项目方法整理为可学习、可实践的课程内容。",
    directions: ["视觉设计与表达", "数字内容工具", "项目方法与工作流"],
    topic: "行业培训",
    accent: "#ff6d5a",
    secondary: "#0b2230",
    art: "signal",
  },
  {
    label: "合作伙伴",
    slug: "partners",
    englishTitle: "PARTNERS / OPEN NETWORK",
    description: "与策划、技术、制作、空间和内容团队建立协作网络，为复杂项目匹配合适的专业力量。",
    directions: ["联合策划与创意", "制作与技术协作", "区域与资源伙伴"],
    topic: "合作伙伴",
    accent: "#d8ff43",
    secondary: "#111410",
    art: "spectrum",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getServiceItem(serviceSlug: string, itemSlug: string) {
  const service = getService(serviceSlug);
  const item = service?.items.find((candidate) => candidate.slug === itemSlug);
  return service && item ? { service, item } : undefined;
}

export function getInitiative(slug: string) {
  return initiatives.find((initiative) => initiative.slug === slug);
}

export function getInitiativeItem(initiativeSlug: string, itemSlug: string) {
  const initiative = getInitiative(initiativeSlug);
  const item = initiative?.items?.find((candidate) => candidate.slug === itemSlug);
  return initiative && item ? { initiative, item } : undefined;
}

export const projectCategories: Array<"全部" | ProjectCategory> = [
  "全部",
  ...services.map((service) => service.category),
  "视觉探索",
];

const creativeNavigationItem: NavigationItem = {
  label: "文创商城",
  href: "/creative",
  kind: "menu",
  align: "end",
  sectionLabel: "文创商城 / CREATIVE",
  variant: "default",
  children: [
    ...creativeCategories.map((category) => ({
      label: category.title,
      href: `/creative/${category.slug}`,
      kind: "link" as const,
      align: "end" as const,
      sectionLabel: "文创商城 / CREATIVE",
      variant: "default" as const,
    })),
    {
      label: "进入文创商城",
      href: "/creative",
      kind: "link",
      align: "end",
      sectionLabel: "文创商城 / CREATIVE",
      variant: "all",
    },
  ],
};

const initiativeNavigationItems: NavigationItem[] = initiatives.map((initiative) => ({
  label: initiative.label,
  href: `/${initiative.slug}`,
  kind: initiative.items?.length ? "menu" : "link",
  align: "center",
  sectionLabel: `${initiative.label} / INITIATIVE`,
  variant: "default",
  children: initiative.items?.map((item) => ({
    label: item.label,
    href: `/${initiative.slug}/${item.slug}`,
    kind: "link" as const,
    align: "center" as const,
    sectionLabel: `${initiative.label} / ${item.label}`,
    variant: "default" as const,
  })),
}));

const educationTrainingIndex = initiativeNavigationItems.findIndex(
  (item) => item.href === "/education-training",
);

export const navigation: NavigationItem[] = [
  {
    label: "首页",
    href: "/",
    kind: "link",
    align: "center",
    sectionLabel: "首页",
    variant: "default",
  },
  ...services.map((service) => ({
    label: service.navLabel,
    href: `/services/${service.slug}`,
    kind: "menu" as const,
    align: service.slug === "aigc" ? "end" as const : "center" as const,
    sectionLabel: `${service.title} / SERVICE`,
    variant: "default" as const,
    children: [
      ...service.items.map((item) => ({
        label: item.label,
        href: `/services/${service.slug}/${item.slug}`,
        kind: "link" as const,
        align: service.slug === "aigc" ? "end" as const : "center" as const,
        sectionLabel: `${service.title} / SERVICE`,
        variant: "default" as const,
      })),
      {
        label: "查看该类项目",
        href: `/work?category=${encodeURIComponent(service.category)}`,
        kind: "link" as const,
        align: service.slug === "aigc" ? "end" as const : "center" as const,
        sectionLabel: `${service.title} / SERVICE`,
        variant: "all" as const,
      },
    ],
  })),
  ...initiativeNavigationItems.slice(0, educationTrainingIndex + 1),
  creativeNavigationItem,
  ...initiativeNavigationItems.slice(educationTrainingIndex + 1),
  {
    label: "关于我们",
    href: "/about",
    kind: "link",
    align: "center",
    sectionLabel: "关于我们",
    variant: "default",
  },
  {
    label: "联系我们",
    href: "/contact",
    kind: "link",
    align: "center",
    sectionLabel: "联系我们",
    variant: "default",
  },
];

export const projects: Project[] = [
  {
    slug: "smart-geospatial-exhibition-hall",
    title: "智慧地信产业展厅",
    englishTitle: "SMART GEOSPATIAL EXHIBITION HALL",
    category: "数字空间",
    year: "2024",
    summary: "以空间、屏幕与沉浸式内容组织智慧地信产业的展示体验。",
    challenge: "如何把专业的地理信息、产业能力与企业叙事转化为来访者可以快速理解的现场路径。",
    approach: "从空间动线和内容层级出发，把大屏、展墙、数据界面与沉浸式影像组成同一套展示语法。",
    result: "形成从企业介绍、技术展示到产业应用的完整数字展厅体验。",
    accent: "#52b8bc",
    secondary: "#071b26",
    art: "spectrum",
    image: "/work/space-hanjie.jpg",
    sourceLabel: "画册第 18 页 / 数字空间案例",
  },
  {
    slug: "wuhan-hanjie-immersive-scene",
    title: "武汉汉街沉浸式艺术场景",
    englishTitle: "WUHAN HAN STREET IMMERSIVE SCENE",
    category: "数字文旅",
    year: "2024",
    summary: "以天顶屏与多副屏构建可进入的城市文旅视觉场景。",
    challenge: "如何让公共空间在节庆、游逛和拍摄中都具有连续而鲜明的视觉记忆。",
    approach: "将城市叙事、建筑尺度和动态画面统一为环绕式视觉内容，配合现场屏幕结构组织观看角度。",
    result: "形成适配公共文旅现场的沉浸式艺术场景与数字内容组合。",
    accent: "#ff6d5a",
    secondary: "#0b2230",
    art: "signal",
    image: "/work/tourism-dahesh.jpg",
    sourceLabel: "画册第 22 页 / 数字文旅案例",
  },
  {
    slug: "original-girl-film",
    title: "原味少女",
    englishTitle: "ORIGINAL GIRL",
    category: "数字影视",
    year: "影像案例",
    summary: "一部以人物与生活质感为核心的数字影视案例。",
    challenge: "如何让人物、场景与品牌传播之间建立自然的情绪连接。",
    approach: "以真实表演和生活化镜头为基础，通过片头、海报和视觉包装建立统一识别。",
    result: "形成从短片内容到传播物料的完整影像表达。",
    accent: "#d8ff43",
    secondary: "#111410",
    art: "spectrum",
    image: "/work/film-original-girl.jpg",
    sourceLabel: "画册第 26 页 / 数字影视案例",
  },
  {
    slug: "product-industrial-animation",
    title: "产品与工业动画",
    englishTitle: "PRODUCT / INDUSTRIAL ANIMATION",
    category: "数字动画",
    year: "动画案例",
    summary: "用动画把产品结构、功能和工程逻辑变成易于理解的视觉叙事。",
    challenge: "复杂的产品与工程信息需要在有限时间里完成准确、清楚又有记忆点的表达。",
    approach: "以结构拆解、镜头节奏和材质模拟为核心，把功能信息组织成一条可跟随的视觉路径。",
    result: "覆盖产品动画、机械动画、医疗动画和工程动画等场景。",
    accent: "#52b8bc",
    secondary: "#12232b",
    art: "aperture",
    image: "/work/animation-product.jpg",
    sourceLabel: "画册第 28-30 页 / 数字动画案例",
  },
  {
    slug: "longhu-cim-digital-twin",
    title: "龙湖青云阙数字孪生 CIM",
    englishTitle: "LONGFOR CIM DIGITAL TWIN",
    category: "数字孪生",
    year: "数字孪生案例",
    summary: "将城市、园区与建筑信息组织为可视化的数字孪生场景。",
    challenge: "如何让复杂的城市空间数据既能被专业团队使用，也能被非专业访客看懂。",
    approach: "以 CIM 数据、三维城市模型和交互式信息层组织空间关系，建立从全局到局部的观看层级。",
    result: "形成面向城市、园区与工业场景的数字孪生表达基础。",
    accent: "#52b8bc",
    secondary: "#172b3e",
    art: "spectrum",
    image: "/work/twin-cim.jpg",
    sourceLabel: "画册第 32 页 / 数字孪生案例",
  },
  {
    slug: "aigc-visual-content",
    title: "AIGC 视觉内容",
    englishTitle: "AIGC VISUAL CONTENT",
    category: "AIGC",
    year: "AIGC 案例",
    summary: "以生成式视觉扩展概念探索、角色内容和行业传播的生产边界。",
    challenge: "如何在生成效率和视觉一致性之间建立可重复、可筛选、可交付的工作流。",
    approach: "先建立主题、构图、材质和品牌边界，再用人工筛选与后期整合控制输出质量。",
    result: "覆盖角色、场景、产品与行业视觉等 AIGC 内容方向。",
    accent: "#d8ff43",
    secondary: "#2f536a",
    art: "spectrum",
    image: "/work/aigc-visual.jpg",
    sourceLabel: "画册第 34-36 页 / AIGC 案例",
  },
  {
    slug: "refraction-identity",
    title: "折光识别",
    englishTitle: "REFRACTION IDENTITY",
    category: "视觉探索",
    year: "视觉探索",
    summary: "一组围绕晴蛙视觉官网结构与视觉语言制作的概念探索。",
    challenge: "如何让同一枚标志在静态、动态与空间中保持识别，同时拥有持续变化的能力。",
    approach: "以三角折面作为最小视觉单位，让光、留白和文字共同形成可变化的识别框架。",
    result: "形成一套可应用于片头、海报与数字界面的概念视觉系统。",
    accent: "#52b8bc",
    secondary: "#f4f3ee",
    art: "aperture",
    concept: true,
  },
];

export const processSteps = [
  { title: "看清问题", text: "先确认受众、场景与真正需要改变的认知。" },
  { title: "建立视角", text: "从内容本身提炼视觉规则，而不是套用一种流行风格。" },
  { title: "形成系统", text: "让空间、影像、动效与数字内容都由同一套逻辑生长。" },
  { title: "落到现场", text: "在真实媒介、尺寸与设备中验证，让设计经得起使用。" },
];
