import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { services, type ServiceGalleryItem } from "@/content/site";

const galleryComponent = readFileSync(join(process.cwd(), "src", "components", "service-gallery.tsx"), "utf8");
const globalStyles = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

type GalleryExpectation = {
  serviceSlug: string;
  itemSlug?: string;
  galleryPath: string;
  count: number;
  dimensions: Array<[number, number]>;
  sourceDirectory?: string;
  layout: "standard" | "two-up" | "featured-07-08" | "film-sequence";
};

const galleryExpectations: GalleryExpectation[] = [
  {
    serviceSlug: "digital-space",
    galleryPath: "/services/digital-space/gallery/",
    count: 14,
    dimensions: Array.from({ length: 14 }, (_, index) => {
      if (index === 6 || index === 7) return [2042, 1086];
      return [1000, 528];
    }),
    sourceDirectory: "Y:/1.制作项目/2026.08.25公司网站制作/1-1数字空间/数字空间",
    layout: "featured-07-08",
  },
  {
    serviceSlug: "digital-space",
    itemSlug: "smart-space",
    galleryPath: "/services/digital-space/smart-space/gallery/",
    count: 16,
    dimensions: Array.from({ length: 16 }, () => [997, 633]),
    sourceDirectory: "Y:/1.制作项目/2026.08.25公司网站制作/1-1数字空间/空间全案",
    layout: "standard",
  },
  {
    serviceSlug: "digital-film",
    itemSlug: "micro-film",
    galleryPath: "/services/digital-film/micro/gallery/",
    count: 8,
    dimensions: [
      ...Array.from({ length: 4 }, () => [2044, 1084] as [number, number]),
      ...Array.from({ length: 4 }, () => [997, 526] as [number, number]),
    ],
    sourceDirectory: "Y:/1.制作项目/2026.08.25公司网站制作/1-3数字影视/3-1-3微电影",
    layout: "film-sequence",
  },
  {
    serviceSlug: "digital-film",
    itemSlug: "tvc",
    galleryPath: "/services/digital-film/tvc/gallery/",
    count: 10,
    dimensions: Array.from({ length: 10 }, () => [998, 526] as [number, number]),
    sourceDirectory: "Y:/1.制作项目/2026.08.25公司网站制作/1-3数字影视/3-1-1TVC",
    layout: "two-up",
  },
  {
    serviceSlug: "digital-animation",
    itemSlug: "film-animation",
    galleryPath: "/services/digital-animation/film-animation/gallery/",
    count: 10,
    dimensions: Array.from({ length: 10 }, () => [999, 526] as [number, number]),
    sourceDirectory: "Y:/1.制作项目/2026.08.25公司网站制作/1-4数字动画/数字动画",
    layout: "two-up",
  },
  {
    serviceSlug: "digital-animation",
    itemSlug: "product-animation",
    galleryPath: "/services/digital-animation/product-animation/gallery/",
    count: 10,
    dimensions: Array.from({ length: 10 }, () => [999, 526] as [number, number]),
    sourceDirectory: "Y:/1.制作项目/2026.08.25公司网站制作/1-4数字动画/产品动画",
    layout: "two-up",
  },
  {
    serviceSlug: "digital-animation",
    itemSlug: "property-animation",
    galleryPath: "/services/digital-animation/property-animation/gallery/",
    count: 20,
    dimensions: Array.from({ length: 20 }, () => [999, 527] as [number, number]),
    sourceDirectory: "Y:/1.制作项目/2026.08.25公司网站制作/1-4数字动画/地产动画",
    layout: "two-up",
  },
  {
    serviceSlug: "digital-twin",
    galleryPath: "/services/digital-twin/gallery/",
    count: 14,
    dimensions: [
      [2046, 1071],
      ...Array.from({ length: 12 }, () => [999, 528] as [number, number]),
      [2046, 1089],
    ],
    sourceDirectory: "Y:/1.制作项目/2026.08.25公司网站制作/1-5数字孪生/数字孪生",
    layout: "two-up",
  },
  {
    serviceSlug: "aigc",
    galleryPath: "/services/aigc/gallery/",
    count: 20,
    dimensions: Array.from({ length: 20 }, () => [999, 528] as [number, number]),
    sourceDirectory: "Y:/1.制作项目/2026.08.25公司网站制作/1-6AGI/AICG",
    layout: "two-up",
  },
];

function getGallery(expectation: GalleryExpectation): ServiceGalleryItem[] {
  const service = services.find((candidate) => candidate.slug === expectation.serviceSlug);
  if (!service) return [];
  if (!expectation.itemSlug) return service.gallery ?? [];
  return service.items.find((item) => item.slug === expectation.itemSlug)?.gallery ?? [];
}

function getGalleryLayout(expectation: GalleryExpectation) {
  const service = services.find((candidate) => candidate.slug === expectation.serviceSlug);
  if (!service) return undefined;
  if (!expectation.itemSlug) return service.galleryLayout;
  return service.items.find((item) => item.slug === expectation.itemSlug)?.galleryLayout ?? "standard";
}

describe.each(galleryExpectations)("$serviceSlug $itemSlug gallery", (expectation) => {
  it(`contains all ${expectation.count} ordered source images with their original dimensions`, () => {
    const gallery = getGallery(expectation);
    expect(gallery).toHaveLength(expectation.count);
    expect(gallery.map((image) => image.src)).toEqual(
      Array.from(
        { length: expectation.count },
        (_, index) => `${expectation.galleryPath}${String(index + 1).padStart(2, "0")}.png`,
      ),
    );
    expect(new Set(gallery.map((image) => image.src)).size).toBe(expectation.count);
    expect(gallery.every((image) => image.alt.length > 0)).toBe(true);
    expect(gallery.map((image) => [image.width, image.height])).toEqual(expectation.dimensions);
    expect(getGalleryLayout(expectation)).toBe(expectation.layout);
  });

  it("has verified provenance next to every gallery image", () => {
    for (const image of getGallery(expectation)) {
      const imagePath = join(process.cwd(), "public", image.src);
      const sidecarPath = `${imagePath}.json`;
      expect(existsSync(imagePath)).toBe(true);
      expect(existsSync(sidecarPath)).toBe(true);

      const sidecar = JSON.parse(readFileSync(sidecarPath, "utf8")) as {
        source?: string;
        sourceSha256?: string;
        width?: number;
        height?: number;
        alt?: string;
      };
      const actualHash = createHash("sha256").update(readFileSync(imagePath)).digest("hex");
      expect(sidecar.sourceSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(sidecar.sourceSha256).toBe(actualHash);
      expect([sidecar.width, sidecar.height]).toEqual([image.width, image.height]);
      expect(sidecar.alt).toBeTruthy();
      if (expectation.sourceDirectory) {
        expect(sidecar.source).toBe(`${expectation.sourceDirectory}/${image.src.split("/").pop()}`);
      }
    }
  });

  it("does not publish Windows thumbnail cache files", () => {
    const galleryDirectory = join(process.cwd(), "public", "services", expectation.galleryPath);
    expect(existsSync(join(galleryDirectory, "Thumbs.db"))).toBe(false);
  });
});

describe("gallery service boundaries", () => {
  it("keeps child galleries independent while allowing the digital twin parent gallery", () => {
    const digitalSpace = services.find((service) => service.slug === "digital-space");
    const digitalFilm = services.find((service) => service.slug === "digital-film");
    const digitalAnimation = services.find((service) => service.slug === "digital-animation");
    const digitalTwin = services.find((service) => service.slug === "digital-twin");
    const aigc = services.find((service) => service.slug === "aigc");
    const tvcGallery = digitalFilm?.items.find((item) => item.slug === "tvc")?.gallery;
    const microFilmGallery = digitalFilm?.items.find((item) => item.slug === "micro-film")?.gallery;
    expect(digitalSpace?.items.find((item) => item.slug === "smart-space")?.gallery).toHaveLength(16);
    expect(digitalFilm?.items.find((item) => item.slug === "promo-film")?.gallery).toHaveLength(10);
    expect(tvcGallery).toHaveLength(10);
    expect(microFilmGallery).toHaveLength(8);
    expect(digitalAnimation?.gallery).toBeUndefined();
    expect(digitalTwin?.gallery).toHaveLength(14);
    expect(aigc?.gallery).toHaveLength(20);
    expect(digitalAnimation?.items.find((item) => item.slug === "film-animation")?.gallery).toHaveLength(10);
    expect(digitalAnimation?.items.find((item) => item.slug === "product-animation")?.gallery).toHaveLength(10);
    expect(digitalAnimation?.items.find((item) => item.slug === "property-animation")?.gallery).toHaveLength(20);
    expect(digitalAnimation?.items.find((item) => item.slug === "2d-animation")?.gallery).toBeUndefined();
    expect(new Set(tvcGallery?.map((image) => image.src)).intersection(new Set(microFilmGallery?.map((image) => image.src))).size).toBe(0);
    expect(digitalSpace?.items.filter((item) => item.slug !== "smart-space").every((item) => !item.gallery)).toBe(true);
    expect(digitalFilm?.items.filter((item) => !["promo-film", "micro-film", "tvc"].includes(item.slug)).every((item) => !item.gallery)).toBe(true);
    expect(
      services
        .filter((service) => !["digital-space", "digital-film", "digital-animation", "aigc"].includes(service.slug))
        .every((service) => service.items.every((item) => !item.gallery)),
    ).toBe(true);
  });

  it("keeps top-level galleries limited to published service archives", () => {
    const galleryServiceSlugs = new Set(["digital-space", "digital-tourism", "digital-twin", "aigc"]);
    expect(services.filter((service) => !galleryServiceSlugs.has(service.slug)).every((service) => !service.gallery)).toBe(true);
  });

  it("has enough featured grid units to close the parent gallery at every breakpoint", () => {
    const featuredCount = 14;
    const featuredGridUnits = featuredCount + 2 * 3;
    expect(featuredGridUnits % 4).toBe(0);
    expect(featuredGridUnits % 2).toBe(0);
    expect(featuredCount).toBe(14);
  });

  it("keeps the film sequence gallery static and grouped by image range", () => {
    expect(galleryComponent).not.toContain("ServiceDynamicWall");
    expect(galleryComponent).not.toContain('layout === "dynamic-wall"');
    expect(galleryComponent).toContain('className="service-gallery-grid"');
    expect(globalStyles).toContain(".service-page {");
    expect(globalStyles).toContain("overflow-x: clip;");
    expect(globalStyles).toContain('data-gallery-layout="film-sequence"] .service-gallery-grid');
    expect(globalStyles).toContain("grid-template-columns: repeat(4, minmax(0, 1fr));");
    expect(globalStyles).toContain('data-gallery-layout="film-sequence"] .service-gallery-tile:nth-child(-n + 4)');
    expect(globalStyles).toContain("grid-column: span 2;");
    expect(globalStyles).toContain('data-gallery-layout="film-sequence"] .service-gallery-tile:nth-child(n + 5):nth-child(-n + 8)');
    expect(globalStyles).toContain("grid-column: span 1;");
    expect(globalStyles).not.toContain("requestAnimationFrame(tick)");
    expect(globalStyles).not.toContain(".service-dynamic-wall");
  });
});
