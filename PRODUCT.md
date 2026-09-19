# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js App Router, React, TypeScript, Motion for React, and native CSS. Deployment target remains open.

## Users

Prospective clients evaluating Qingwa Visual's point of view, visual capabilities, representative work, and fit for a creative collaboration across enterprise, government, education, cultural-tourism, and product contexts.

## Product Purpose

Present Qingwa Visual as a visual and digital-content company, make its work and capabilities easy to explore, and help prospective clients prepare a collaboration brief using verified contact channels.

## Positioning

Qingwa Visual uses a faceted viewing language to turn a change in perspective into a recognizable visual system: “一眼所见，从此不同”. Its working capabilities include digital spaces, digital tourism, digital film, digital animation, digital twins, AIGC, and AI Agent solutions.

## Capabilities and Constraints

- Confirmed brand name: 晴蛙视觉 / SUN-FROG VISUAL.
- Confirmed slogan: 一眼所见，从此不同.
- The supplied booklet states a 2010 start, 1000+ project cases, 19 provinces, and 54 cities/administrative areas. These are shown as company-reported overview facts and should be re-confirmed before future marketing reuse.
- The booklet identifies three company entities: 武汉晴蛙视觉科技有限公司, 武汉晴蛙设计工程有限公司, and 广州晴蛙传媒科技有限公司.
- The booklet records a 2024 high-tech enterprise recognition, technology SME recognition, a broadcast and television program production license, and other certificate/software-patent pages. Exact certificate wording should be confirmed before legal or tender use.
- No client-specific performance claims, award claims, testimonials, project budgets, or delivery outcomes may be invented. Case descriptions remain factual summaries of the supplied booklet and should be approved item by item for publication.
- Contact information is transcribed from the supplied booklet's final page. Re-confirm phone numbers, email addresses, physical addresses, and social handles before launch; the Beijing entry's `027` telephone area code requires particular confirmation.

## Brand Commitments

- Preserve the supplied faceted frog mark and horizontal Chinese lockup.
- Use the confirmed cyan, black, white, and light-gray treatments visible in the supplied assets.
- The mark is geometric, symmetric, high-contrast, and faceted.
- Keep the optical-facet motion purposeful, bounded, and optional under reduced-motion preferences.

## Evidence on Hand

- `Y:/1.制作项目/2026.08.25公司网站制作/晴蛙视觉/4k-3.jpg`
- `Y:/1.制作项目/2026.08.25公司网站制作/晴蛙视觉/1-晴蛙视觉logo2024.0400.jpg`
- `Y:/1.制作项目/2026.08.25公司网站制作/晴蛙视觉科技-画册（电脑版）2026.08.20-01.pptx`
- Website crops from booklet slides are stored under `public/work/` and `public/contact/`, each with a source JSON sidecar.

## Product Principles

- Show representative work before explaining the company.
- Let every visual choice strengthen a recognizable point of view.
- Distinguish company-reported overview facts from client-specific proof.
- Keep content structured so new projects, services, locations, and channels can be approved and replaced independently.
- Make motion purposeful, legible, and optional.

## Accessibility & Inclusion

Meet WCAG AA contrast, preserve keyboard navigation and visible focus, provide descriptive image alternatives, make phone/email channels actionable, and provide a reduced-motion experience.

## Creative Commerce

晴蛙文创是独立的 storefront 路由域，包含艺术定制、工艺定制、IP定制与私人电影四个分类。首期只公开分类骨架；没有真实商品、价格、SKU、库存、商品图、配送规则和政策版本时，站点保持 `COMMERCE_MODE=catalog`，购物车、结算与支付均不可用，不生成假订单或模拟支付成功。

商品目录由 Supabase 控制台维护。服务端只读取 `status=published` 且 `purchasable=true` 的商品、已发布 variant 和媒体；订单价格、运费、库存和支付结果永远由服务端/数据库事务重新确认。定制类商品可以使用 `custom_quote`，页面显示价格待确认并转向联系定制，不伪装成现货商品。

交易架构支持游客结算、实体物流、Supabase 订单与库存、微信支付和支付宝，但必须在真实凭据、公网 HTTPS 回调、运费规则和政策版本核验后才切换到 `sandbox` 或 `live`。支付回跳不代表成功，只有验签 webhook 或服务端主动查询可以推进订单。

## Operational Truth

- 不把作品案例图当作商品图，不写入未经确认的价格、销量、库存、配送、税费或退款承诺。
- Supabase service role、支付私钥、API v3 key 和平台证书只在 server-only 模块使用。
- 交易表启用 RLS，游客订单只通过服务端 session 隔离读取。
- 任何外部依赖未就绪时回滚到 `catalog`，保留分类浏览和已核验内容。
