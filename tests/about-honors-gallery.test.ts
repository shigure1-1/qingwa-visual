import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { honorGroups } from "@/content/about-honors";

const honorsGallery = readFileSync(join(process.cwd(), "src", "components", "about-honors-gallery.tsx"), "utf8");
const globalStyles = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

const sourceRoot = "Y:/1.制作项目/2026.08.25公司网站制作/0-3企业荣誉";
const expectedCounts = {
  enterprise: 9,
  visual: 12,
  design: 12,
};

describe("about honors gallery", () => {
  it("groups all 33 unique images by the supplied folder names", () => {
    expect(honorGroups.map((group) => group.label)).toEqual([
      "企业荣誉",
      "视觉荣誉",
      "设计荣誉",
    ]);

    for (const group of honorGroups) {
      expect(group.images).toHaveLength(expectedCounts[group.slug]);
    }

    const images = honorGroups.flatMap((group) => group.images);
    expect(images).toHaveLength(33);
    expect(new Set(images.map((image) => image.src)).size).toBe(33);
    expect(images.every((image) => image.alt.length > 0)).toBe(true);
    expect(images.every((image) => image.width > 0 && image.height > 0)).toBe(true);
  });

  it("keeps the enterprise archive in one ordered track", () => {
    const enterprise = honorGroups.find((group) => group.slug === "enterprise");
    expect(enterprise?.images.map((image) => image.src)).toEqual([
      "/about/honors/enterprise/plaque-01.png",
      "/about/honors/enterprise/plaque-05.png",
      "/about/honors/enterprise/plaque-02.png",
      "/about/honors/enterprise/plaque-03.png",
      "/about/honors/enterprise/plaque-04.png",
      "/about/honors/enterprise/trophy-01.png",
      "/about/honors/enterprise/trophy-02.png",
      "/about/honors/enterprise/trophy-03.png",
      "/about/honors/enterprise/trophy-04.png",
    ]);

    expect(enterprise?.images.slice(0, 2).map((image) => image.label)).toEqual([
      "挂牌资料 01",
      "挂牌资料 05",
    ]);
    expect(enterprise?.images.slice(0, 5).every((image) => [image.width, image.height].toString() === "1015,763")).toBe(true);
    expect(honorsGallery).toContain("function EnterpriseHonorTrack");
    expect(honorsGallery).toContain("aspectRatio: `${image.width} / ${image.height}`");
    expect(honorsGallery).toContain("requestAnimationFrame(tick)");
    expect(honorsGallery).toContain("prefers-reduced-motion");
    expect(globalStyles).toContain(".honor-grid-enterprise .honor-item {");
    expect(globalStyles).toContain("gap: 0;");
    expect(globalStyles).toContain("height: clamp(12rem, 18vw, 16rem);");
    expect(globalStyles).toContain("width: auto;");
    expect(globalStyles).toContain("object-fit: contain;");
    expect(globalStyles).toContain("background: transparent;");
    expect(globalStyles).toContain("scrollbar-width: none;");
    expect(globalStyles).toContain(".honor-enterprise-scroll::-webkit-scrollbar {");
  });

  it("keeps verified provenance beside every published image", () => {
    const hashes = new Set<string>();

    for (const group of honorGroups) {
      for (const image of group.images) {
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
          group?: string;
          verificationStatus?: string;
        };
        const actualHash = createHash("sha256").update(readFileSync(imagePath)).digest("hex");
        expect(sidecar.source).toContain(sourceRoot);
        expect(sidecar.sourceSha256).toMatch(/^[a-f0-9]{64}$/);
        expect(sidecar.sourceSha256).toBe(actualHash);
        expect([sidecar.width, sidecar.height]).toEqual([image.width, image.height]);
        expect(sidecar.alt).toBe(image.alt);
        expect(sidecar.group).toBe(group.label);
        expect(sidecar.verificationStatus).toBe("source-provided-unverified");
        expect(hashes.has(actualHash)).toBe(false);
        hashes.add(actualHash);
      }
    }

    expect(hashes.size).toBe(33);
  });

  it("does not publish duplicate source folders or thumbnail caches", () => {
    const publicRoot = join(process.cwd(), "public", "about", "honors");
    expect(existsSync(join(publicRoot, "Thumbs.db"))).toBe(false);
    expect(existsSync(join(publicRoot, "design", "挂牌"))).toBe(false);
    expect(existsSync(join(publicRoot, "design", "奖杯"))).toBe(false);
  });
});
