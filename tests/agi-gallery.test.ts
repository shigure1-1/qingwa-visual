import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { initiatives } from "@/content/site";

describe("AGI main gallery", () => {
  const initiative = initiatives.find((candidate) => candidate.slug === "agi");
  const gallery = initiative?.gallery ?? [];

  it("contains the 17 ordered source images with original dimensions", () => {
    expect(gallery).toHaveLength(17);
    expect(gallery.map((image) => image.src)).toEqual(
      Array.from({ length: 17 }, (_, index) => `/agi/gallery/${String(index + 1).padStart(2, "0")}.png`),
    );
    expect(gallery.map((image) => [image.width, image.height])).toEqual([
      [2042, 1064],
      ...Array.from({ length: 16 }, () => [1000, 527]),
    ]);
    expect(initiative?.galleryLayout).toBe("two-up");
  });

  it("keeps verified provenance next to every image", () => {
    for (const image of gallery) {
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
      expect(sidecar.source).toBe(`Y:/1.制作项目/2026.08.25公司网站制作/1-6AGI/AGI/${image.src.split("/").pop()}`);
      expect(sidecar.alt).toBe(image.alt);
    }
  });
});
