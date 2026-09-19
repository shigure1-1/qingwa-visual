---
name: 晴蛙视觉
description: 一眼所见，从此不同。以光学折面承载数字空间、影像、数字孪生与 AIGC 的视觉作品集。
colors:
  ink: "#070908"
  ink-soft: "#101511"
  paper: "#f4f3ee"
  white: "#ffffff"
  teal: "#52b8bc"
  teal-deep: "#287b80"
  coral: "#ff6d5a"
  acid: "#d8ff43"
  muted-dark: "#9ba9a2"
  muted-light: "#55615c"
typography:
  display:
    fontFamily: "Noto Sans SC Variable, Microsoft YaHei, sans-serif"
    fontSize: "clamp(3.65rem, 7.4vw, 7.6rem)"
    fontWeight: 720
    lineHeight: 0.97
    letterSpacing: "0"
  body:
    fontFamily: "Noto Sans SC Variable, Microsoft YaHei, sans-serif"
    fontSize: "1rem"
    fontWeight: 480
    lineHeight: 1.9
    letterSpacing: "0"
  label:
    fontFamily: "Archivo Variable, sans-serif"
    fontSize: "0.66rem"
    fontWeight: 640
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  pill: "999px"
spacing:
  sm: "0.75rem"
  md: "1.5rem"
  lg: "3rem"
  section: "clamp(5rem, 10vw, 10rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.5rem"
    height: "3.8rem"
  button-filter:
    backgroundColor: "transparent"
    textColor: "{colors.muted-light}"
    rounded: "{rounded.pill}"
    padding: "0.55rem 1.15rem"
  text-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 0 0.45rem"

# Design System: 晴蛙视觉

## Overview

**Creative North Star: “光学折面”**

晴蛙视觉把“改变观看方式”变成一枚可移动、可折射、可拆解的视觉镜头。网站是 Experience 模式的作品集：代表项目和标志先于公司说明出现，界面退到清晰的校准线、硬切边界和有目的的动效之后。

视觉语言建立在黑色观测场、纸白内容面、晴蛙青识别色和少量暖珊瑚偏移之上。画册案例图是项目页的主要证据层，三角折面、光学圆环、频谱切片和校准标记以低强度覆盖贯穿首页、作品列表、案例详情与合作表单。视觉探索可以充分作者化，但必须继续标注为“视觉探索”，不得被误读为商业证明。

**Key Characteristics:**
- 黑、白、晴蛙青为主，珊瑚和酸绿只在折射、状态或特定项目中承担受控强调。
- 大字号中文显示、Archivo 英文标签、0px 容器圆角。
- 作品图形优先于装饰，动效服务于观看方式而非炫技。
- 画册中的公司概览、项目与联系方式已接入；客户成果、奖项和法律资质仍按发布前核验边界处理。

## Colors

这是一个高对比、低装饰的全色彩系统：深色观测场承载识别，纸白承载阅读，青色承担品牌动作，珊瑚和酸绿只做受控的视觉偏移。

### Primary
- **晴蛙青** (#52B8BC): 品牌标记、交互下划线、校准线、主色场和案例强调。
- **深晴蛙青** (#287B80): 案例声明带和浅色区域中的深色强调。

### Secondary
- **暖珊瑚** (#FF6D5A): 首页光谱偏移与少量错误状态，不作为大面积品牌底色。
- **酸绿** (#D8FF43): AIGC 项目与高能频谱构图中的受控强调，不作为站点主色。

### Neutral
- **观测黑** (#070908): 全局页头、首页英雄区、案例英雄区和页脚。
- **软黑** (#101511): 服务、关于和合作内容中的深色背景。
- **纸白** (#F4F3EE): 阅读区、筛选区、正文内容面。
- **白** (#FFFFFF): 深色背景上的主文字和折面标志。
- **暗灰绿** (#9BA9A2): 深色背景上的辅助文字。
- **浅灰绿** (#55615C): 纸白背景上的辅助文字。

### Named Rules
**The Optical Rarity Rule.** 晴蛙青负责识别和行动，珊瑚与酸绿只在需要产生折射、频谱或概念区别时出现。

## Typography

**Display Font:** Noto Sans SC Variable (with Microsoft YaHei fallback)
**Body Font:** Noto Sans SC Variable (with Microsoft YaHei fallback)
**Label/Mono Font:** Archivo Variable

**Character:** 中文显示面稳、窄、具有海报式结构；Archivo 的压窄英文标签提供测量、档案和光学仪器感。字距保持为 0，英文标签才使用追踪。

### Hierarchy
- **Display** (720, `clamp(3.65rem, 7.4vw, 7.6rem)`, 0.97): 首页主张和真正的主视觉标题。
- **Headline** (690, `clamp(2.4rem, 5.2vw, 5.6rem)`, 1.06): 首页分区和内页主标题。
- **Title** (650-680, `clamp(1.55rem, 2.5vw, 2.7rem)`, 1.1): 服务、作品和案例分组标题。
- **Body** (480, `1rem`, 1.8-1.9): 说明、表单和案例正文，保持短行宽与较大行距。
- **Label** (620-650, `0.58-0.78rem`, 0.08-0.14em, uppercase for English): 校准信息、类别、序号和辅助元数据。

### Named Rules
**The No-Decorative-Letterspacing Rule.** 中文标题不通过负字距制造密度；追踪只给 Archivo 校准标签和英文标题。

## Layout

页面使用全宽分区和 `--page-pad: clamp(1.25rem, 3.6vw, 4.75rem)`，不把页面内容放进卡片堆叠。首页英雄区采用左侧文字、右侧巨大折面标志的双栏结构；作品条带采用艺术面与元数据面并列结构；服务和流程改为行式信息层级。

关键响应式断点为 1180px、900px 和 580px。1180px 以下导航变为可滚动的全屏手风琴菜单；900px 以下首页英雄改为单列，作品条带改为图在上、文字在下；580px 以下进一步压缩内边距、标题和图形占位。1280×720 短屏使用单独的密度规则，确保主 CTA 和下一节露出。

## Elevation & Depth

系统默认扁平，不使用卡片阴影或玻璃材质。深度来自黑白色面、1px 校准线、clip-path 折面、重叠圆环、混合模式和 Logo 的有限 drop-shadow。悬停时只提升折面、线路或箭头，不抬高整个容器。

### Shadow Vocabulary
- **mark-depth** (`drop-shadow(0 34px 80px rgba(0,0,0,.48))`): 只用于首页主标志，强调折面从观测场中浮出。
- **optical-glow** (`box-shadow: inset 24px -14px 80px rgba(82,184,188,.07)`): 只用于光学圆环内部的弱色场。

### Named Rules
**The Flat-By-Default Rule.** 页面分区保持平面与硬边；深度必须来自视觉机制，而不是装饰性卡片效果。

## Shapes

默认圆角为 0px。筛选器是唯一使用胶囊形状的控件，因为它表达可选状态；输入、按钮、链接和内容容器使用方正边界。折面通过三角 polygon、圆环、斜线、硬切和 1px 边框形成识别轮廓。

## Components

### Buttons
- **Shape:** 方正硬边 (`0px`)；筛选按钮例外为胶囊 (`999px`)。
- **Primary:** 观测黑底、白字、`0.8rem 1.5rem` 内距；首页 CTA 使用无填充下划线行动样式。
- **Hover / Focus:** 主按钮悬停变为晴蛙青；所有控件使用珊瑚色 `3px` 可见焦点环。
- **Secondary:** 合作简报的复制、重填按钮使用透明底与 1px 边框。

### Chips
- **Style:** 透明底、浅色边框、胶囊轮廓。
- **State:** 当前筛选为观测黑底白字，未选状态保留纸白底和浅色边框。

### Cards / Containers
- **Corner Style:** 0px。
- **Background:** 真实项目以画册案例图为主并叠加低强度折面；视觉探索可使用项目专属 accent/secondary 色场；文字面使用纸白。
- **Shadow Strategy:** 默认无阴影；只允许 Logo 和光学圆环使用记录的深度规则。
- **Border:** 1px 分隔线，深色面使用 `rgba(255,255,255,.16)`，浅色面使用 `rgba(7,9,8,.18)`。
- **Internal Padding:** 页面区块使用 `clamp(5rem, 10vw, 10rem)`，条带内容使用 `clamp(2rem, 5vw, 4.5rem)`。

### Inputs / Fields
- **Style:** 无填充、0px 圆角、底部 1px 分隔线；正文和表单统一纸白面。
- **Focus:** 珊瑚色可见焦点环，不移动布局。
- **Error / Disabled:** 错误使用浅珊瑚底和深红字，并通过 `role="alert"` 告知。

### Navigation
- **Desktop:** 1180px 以上使用固定透明渐变页头；首页之后列业务服务，随后是 AGI、行业培训、文创商城、合作伙伴、关于我们与联系我们。带子项的主栏目通过独立箭头展开硬边黑色子菜单，子菜单支持悬停、点击、Tab/Shift+Tab、焦点进入与 Escape 关闭。菜单落点由显式 `align` 决定，不按数组位置推断。
- **Mobile / Compact:** 1180px 以下使用全屏黑色覆盖导航，品牌和关闭按钮保持在覆盖层上方；带子项的栏目使用一次只展开一组的手风琴，面板可纵向滚动。父项和子项都显示 `aria-current` 对应的当前态。
- **Destinations:** 文创商城父项进入 `/creative`，四个分类进入 `/creative/{slug}`；末项“进入文创商城”是显式 `all` 变体。业务父项进入 `/services/{serviceSlug}`，子项进入 `/services/{serviceSlug}/{itemSlug}`；“查看该类项目”同样是显式 `all` 变体并进入带 `?category=` 的作品归档。AGI 进入 `/agi`，并提供网站制作、企业AI转型、数字孪生搭建、本地大模型部署四个子页面 `/agi/{itemSlug}`；行业培训与合作伙伴分别进入 `/education-training` 与 `/partners`。
- **Scroll Behavior:** 在首页或 `/creative` 重复点击各自父入口时平滑回到页面顶部；文创分类、购物车、结算等内部普通链接只执行导航，不强制回顶。

### Signature Component
**Refractive Hero** 是首页签名组件：Motion 读取指针位置，将 Logo 和频谱切片在二维空间内做有限偏移；`prefers-reduced-motion` 时回到静态构图。

### Creative Storefront
晴蛙文创使用独立的商城视觉层：黑色观测场承载商城头部和支付确认，纸白内容面承载分类、商品、购物车与结算，晴蛙青只用于状态、行动和校准线。分类卡片是可扫描的目录入口，不使用案例图伪装商品图；没有真实商品时使用明确的空目录状态。

- 商城主路径为 `/creative`、`/creative/{categorySlug}` 和已发布商品详情；四个分类固定为艺术定制、工艺定制、IP定制、私人电影。
- 交易页保留实体物流、游客结算、微信支付与支付宝的完整结构，但 `catalog` 模式下必须展示禁用状态。按钮、价格和订单状态不能暗示未配置的交易能力。
- 商品图片使用稳定比例和 `next/image`；真实媒体准备前不渲染案例图片或占位商品卡。定制询价商品显示“价格待确认”和联系定制入口。
- 结算字段使用显式标签和分组，错误、pending、空状态和回跳确认均需用产品语言说明恢复路径；支付回跳不直接显示成功。

## Do's and Don'ts

### Do:
- **Do** 让首屏直接展示晴蛙标志、中文主张和“查看作品”行动。
- **Do** 使用真实提供的 Logo 资产，并保留其折面结构和高对比特征。
- **Do** 将画册中的真实案例图、联系人和公司事实作为来源内容，同时把客户成果与法律资质留在发布前核验清单。
- **Do** 让概念项目拥有完整视觉，但在标题、元数据和详情页反复标注概念属性。
- **Do** 检查 1280×720 与 390×844，确保 CTA、菜单和主图都可操作。

### Don't:
- **Don't** 把概念展示写成真实客户项目、奖项、业绩或案例结果。
- **Don't** 引入通用营销英雄、装饰性渐变球、卡片嵌卡片或 stock 风格摄影。
- **Don't** 用珊瑚或酸绿覆盖大面积正常内容区。
- **Don't** 用负字距、不可见焦点或过度动效牺牲阅读和可访问性。
- **Don't** 把画册里的联系方式当作永久不变的渠道；上线前逐项确认电话、邮箱、地址和官方账号。
