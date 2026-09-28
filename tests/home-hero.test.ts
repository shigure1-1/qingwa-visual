import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getHomeSlideIndex, homeSlides } from "@/content/home-slides";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const hero = read("src/components/home-hero-slideshow.tsx");
const intro = read("src/components/home-logo-intro.tsx");
const styles = read("src/app/home-hero.css");

describe("homepage slideshow and logo introduction", () => {
  it("shows the five supplied banners in file-number order", () => {
    expect(homeSlides.map((slide) => slide.title)).toEqual([
      "影视广告", "数字展厅", "数字文旅", "影视动画", "智能数字研究院",
    ]);
    expect(homeSlides.map((slide) => slide.src.match(/\/(\d{2})-/)?.[1])).toEqual(["01", "02", "03", "04", "05"]);
    const hashes = homeSlides.map((slide) => createHash("sha256")
      .update(readFileSync(join(process.cwd(), "public", slide.src))).digest("hex"));
    expect(new Set(hashes).size).toBe(5);
  });

  it("wraps correctly in both directions", () => {
    expect(getHomeSlideIndex(5)).toBe(0);
    expect(getHomeSlideIndex(-1)).toBe(4);
    expect(getHomeSlideIndex(-6)).toBe(4);
    expect(getHomeSlideIndex(12)).toBe(2);
  });

  it("only replaces the first homepage section", () => {
    const home = read("src/app/page.tsx");
    expect(home).toContain("<HomeHeroSlideshow />");
    expect(home).not.toContain("<RefractiveHero />");
    expect(home.indexOf("<HomeHeroSlideshow />")).toBeLessThan(home.indexOf('aria-label="公司概览"'));
    expect(home).toContain("<CompanyFilm />");
    expect(home).toContain("<HomeRecognition />");
  });

  it("keeps full banner composition with manual controls and bounded autoplay", () => {
    expect(styles).toContain("aspect-ratio: 1920 / 520");
    expect(styles).toContain("object-fit: contain");
    expect(hero).toContain("SLIDE_INTERVAL = 5000");
    expect(hero).toContain("window.clearTimeout(timer)");
    expect(hero).toContain("IntersectionObserver");
    expect(hero).toContain("visibilitychange");
    expect(hero).toContain("prefers-reduced-motion");
    expect(hero).toContain('aria-roledescription="carousel"');
    expect(hero).toContain("onPointerCancel");
    expect(hero).toContain('event.key !== "ArrowLeft"');
  });

  it("reuses the original frog with session-only playback and fail-open dismissal", () => {
    expect(intro).toContain('src="/brand/qingwa-mark.webp"');
    expect(intro).toContain("sessionStorage");
    expect(intro).toContain("INTRO_FALLBACK_MS = 4900");
    expect(intro).toContain("home-logo-intro-plane--teal");
    expect(intro).toContain("home-logo-intro-plane--coral");
    expect(intro).toContain("home-logo-intro-plane--acid");
    expect(intro).toContain("onClick={finish}");
    expect(intro).toContain('event.key === "Escape"');
    expect(intro).not.toContain("overflow");
    expect(styles).toContain("home-intro-exit 4.4s");
  });
});
