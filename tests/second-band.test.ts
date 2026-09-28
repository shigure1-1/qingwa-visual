import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("shared second-band contracts", () => {
  it("marks the first post-hero band across primary pages", () => {
    const expectations: Array<[string, string]> = [
      ["src/app/page.tsx", 'className="proof-band page-second-band"'],
      ["src/components/service-page.tsx", 'className="proof-band page-second-band"'],
      ["src/app/work/page.tsx", 'className="work-archive page-second-band"'],
      ["src/app/work/[slug]/page.tsx", "page-second-band"],
      ["src/app/contact/page.tsx", 'className="brief-section page-second-band"'],
      ["src/app/creative/page.tsx", '<CategoryGrid pageSection="second" />'],
      ["src/components/creative/category-grid.tsx", 'data-page-section={pageSection}'],
      ["src/app/creative/[categorySlug]/page.tsx", "page-second-band"],
      ["src/app/creative/cart/page.tsx", 'className="creative-commerce-layout page-second-band"'],
      ["src/app/creative/checkout/page.tsx", 'className="creative-commerce-layout page-second-band"'],
      ["src/app/creative/order/[publicId]/page.tsx", 'className="creative-order-status page-second-band"'],
    ];

    for (const [path, marker] of expectations) {
      expect(source(path), path).toContain(marker);
      if (path !== "src/app/creative/page.tsx" && path !== "src/components/creative/category-grid.tsx") {
        expect(source(path), path).toContain('data-page-section="second"');
      }
    }
    expect(source("src/components/creative/category-grid.tsx")).toContain('data-page-section={pageSection}');
  });

  it("keeps the partner wall without the removed directions band", () => {
    const initiativePage = source("src/components/initiative-page.tsx");
    const partnerWall = initiativePage.indexOf("<PartnerWall />");
    const collaborationNote = initiativePage.indexOf('<section className="initiative-note">');

    expect(initiativePage).not.toContain("OPEN / DIRECTIONS");
    expect(initiativePage).not.toContain("initiative-directions");
    expect(partnerWall).toBeGreaterThan(-1);
    expect(collaborationNote).toBeGreaterThan(partnerWall);
  });

  it("defines shared sizing tokens and consumes them after page-specific rules", () => {
    const foundation = source("src/app/foundation.css");
    const globals = source("src/app/globals.css");
    const creative = source("src/app/creative/creative.css");

    expect(foundation).toContain("--page-second-min-block: 12rem;");
    expect(foundation).toContain("--page-second-pad-block: clamp(2.6rem, 4vw, 4.4rem);");
    expect(foundation).toContain("--page-second-min-block-compact: 10rem;");
    expect(foundation).toContain("--page-second-min-block-narrow: 8rem;");
    expect(globals).toContain(".page-second-band {");
    expect(globals).toContain("min-block-size: var(--page-second-min-block);");
    expect(globals).toContain("padding-block: var(--page-second-pad-block);");
    expect(globals).toContain("min-block-size: var(--page-second-min-block-compact);");
    expect(globals).toContain("min-block-size: var(--page-second-min-block-narrow);");
    expect(creative).toContain(".creative-categories.page-second-band,");
    expect(creative).toContain(".creative-commerce-layout.page-second-band,");
    expect(creative).toContain("min-block-size: var(--page-second-min-block);");
  });

  it("matches the latest four-line proof-band reference", () => {
    const homePage = source("src/app/page.tsx");
    const foundation = source("src/app/foundation.css");

    expect(homePage).not.toContain("LogoMark");
    expect(homePage).not.toContain('className="proof-band-brand"');
    expect(homePage).toContain('className="proof-band-intro"');
    expect(homePage).toContain('className="proof-band-results"');
    expect(homePage).toContain("创新代数字化视觉服务商");
    expect(homePage).toContain("综合数字影像全案供应商");
    expect(homePage).toContain("百强地产优质视觉制作商");
    expect(homePage).toContain("持续多年为全球盛荟提供视觉服务");
    expect(homePage).toContain('深耕行业<CountUp value={company.years.replace("+", "")} />年');
    expect(homePage).toContain('案例遍布全国：<CountUp value={company.provinceCount} />个省<CountUp value={company.cityCount} />个城市');
    expect(foundation).toContain("grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);");
    expect(foundation).toContain("min-block-size: max(var(--page-second-min-block), 8.34vw);");
    expect(foundation).toContain("content: \"|\";");
    expect(foundation).toContain("display: inline-block;");
    expect(foundation).toContain("text-align-last: justify;");
    expect(foundation).toContain("grid-template-columns: 1fr;");
    expect(foundation).toContain("white-space: normal;");
  });

  it("keeps SERVICE SYSTEM and SERVICE ITEM aligned with the home proof band", () => {
    const servicePage = source("src/components/service-page.tsx");
    const globals = source("src/app/globals.css");
    const foundation = source("src/app/foundation.css");

    expect(servicePage).toContain('className="proof-band page-second-band"');
    expect(servicePage).toContain('className={`service-page ${item ? "service-item-page" : "service-parent-page"}`}');
    expect(globals).toContain(".service-page {");
    expect(foundation).toContain(".proof-band {");
    expect(foundation).toContain("background: var(--teal);");
    expect(foundation).toContain("grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);");
    expect(foundation).toContain("min-block-size: max(var(--page-second-min-block), 8.34vw);");
    expect(foundation).toContain("padding-block: clamp(1.25rem, 2vw, 2.25rem);");
    expect(foundation).toContain("font-size: clamp(1.4rem, 2.3vw, 3.5rem);");
    expect(foundation).not.toContain("service-statement");
  });
});
