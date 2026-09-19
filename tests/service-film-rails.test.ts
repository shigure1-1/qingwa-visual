import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { services } from "@/content/site";

const pageComponent = readFileSync(join(process.cwd(), "src", "components", "service-page.tsx"), "utf8");
const railComponent = readFileSync(join(process.cwd(), "src", "components", "service-film-rails.tsx"), "utf8");
const globalStyles = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

describe("digital film and animation service rails", () => {
  it("renders TVC, promo film, and micro film galleries independently", () => {
    const digitalFilm = services.find((service) => service.slug === "digital-film");
    expect(digitalFilm).toBeDefined();
    expect(digitalFilm?.items.map((item) => item.slug)).toEqual(["tvc", "promo-film", "micro-film"]);
    expect(digitalFilm?.items.map((item) => item.gallery?.length)).toEqual([10, 10, 8]);
    expect(railComponent).toContain("galleryItems.map");
    expect(railComponent).toContain("service-film-rail-copy");
    expect(railComponent).toContain("service-film-rail-media-window");
    expect(pageComponent.indexOf('className="service-statement page-second-band"')).toBeLessThan(pageComponent.indexOf("<ServiceFilmRails service={service} />"));
    expect(pageComponent.indexOf("<ServiceFilmRails service={service} />")).toBeLessThan(pageComponent.indexOf('className="service-capabilities"'));
  });

  it("renders every available digital animation child gallery as its own slideshow", () => {
    const digitalAnimation = services.find((service) => service.slug === "digital-animation");
    const galleryItems = digitalAnimation?.items.filter((item) => (item.gallery?.length ?? 0) > 0);

    expect(digitalAnimation).toBeDefined();
    expect(galleryItems?.map((item) => item.slug)).toEqual([
      "film-animation",
      "product-animation",
      "property-animation",
    ]);
    expect(galleryItems?.map((item) => item.gallery?.length)).toEqual([10, 10, 20]);
    expect(pageComponent).toContain('service.slug === "digital-animation"');
    expect(railComponent).toContain('service.items.filter((item) => (item.gallery?.length ?? 0) > 0)');
    expect(railComponent).toContain("从一帧开始，进入三种动画表达。");
  });

  it("uses a single-window horizontal track with manual and automatic controls", () => {
    expect(railComponent).toContain("service-film-rail-track");
    expect(railComponent).toContain("service-film-rail-slide");
    expect(railComponent).toContain("scrollToFrame");
    expect(railComponent).toContain("setInterval");
    expect(railComponent).toContain("4200");
    expect(railComponent).toContain("onScroll={handleScroll}");
    expect(railComponent).toContain("Pause");
    expect(railComponent).toContain("Play");
    expect(railComponent).toContain("gridTemplateColumns: `repeat(${gallery.length}, 100%)`");
    expect(railComponent).toContain('role="region"');
    expect(railComponent).toContain("aria-pressed={controlPaused}");
    expect(railComponent).toContain("const controlPaused = manualPaused || (reduceMotion && !playbackOverride);");
    expect(railComponent).toContain("setPlaybackOverride(true)");
    expect(railComponent).toContain("onWheel={() => {");
    expect(railComponent).toContain("onKeyDown={() => {");
    expect(railComponent).toContain("onTouchStart={pauseForInteraction}");
    expect(railComponent).toContain("onTouchEnd={resumeAfterInteraction}");
    expect(railComponent).toContain("prefers-reduced-motion");
    expect(railComponent).toContain("IntersectionObserver");
    expect(railComponent).toContain('document.addEventListener("visibilitychange", syncVisibility)');
    expect(globalStyles).toContain("overflow-x: auto;");
    expect(globalStyles).toContain("scroll-snap-type: x mandatory;");
    expect(globalStyles).toContain("scroll-snap-align: start;");
    expect(globalStyles).toContain("touch-action: pan-x;");
  });

  it("keeps the right copy column and responsive single-column layout", () => {
    expect(globalStyles).toContain(".service-film-rail {");
    expect(globalStyles).toContain("grid-template-columns: minmax(0, 1.35fr) minmax(18rem, .65fr);");
    expect(globalStyles).toContain(".service-film-rail-copy {");
    expect(globalStyles).toContain("border-left: 1px solid var(--line-dark);");
    expect(globalStyles).toContain(".service-film-rail {\n    grid-template-columns: 1fr;\n  }");
    expect(globalStyles).toContain("prefers-reduced-motion");
    expect(globalStyles).toContain("scroll-behavior: auto;");
  });
});
