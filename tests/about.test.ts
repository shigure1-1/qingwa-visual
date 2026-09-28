import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { aboutSections } from "@/components/about-local-nav";
import { historyEvents } from "@/components/about-history-timeline";
import { historyBookletImages } from "@/content/about-history";
import { navigation } from "@/content/site";

const aboutPage = readFileSync(resolve(process.cwd(), "src/app/about/page.tsx"), "utf8");
const historyTimeline = readFileSync(resolve(process.cwd(), "src/components/about-history-timeline.tsx"), "utf8");
const globalStyles = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
const globalHeader = readFileSync(resolve(process.cwd(), "src/components/site-header.tsx"), "utf8");

describe("about page local navigation", () => {
  it("keeps the four section hashes stable", () => {
    expect(aboutSections).toEqual([
      { href: "#about-overview", label: "关于我们" },
      { href: "#about-history", label: "发展历程" },
      { href: "#about-honors", label: "企业荣誉" },
    ]);

    for (const section of aboutSections) {
      expect(aboutPage).toContain(`id="${section.href.slice(1)}"`);
    }
  });

  it("renders the local navigation only from the about page", () => {
    expect(aboutPage).toContain("<AboutLocalNav />");
    expect(globalHeader).not.toContain("AboutLocalNav");
    expect(navigation.find((item) => item.href === "/about")?.children).toBeUndefined();
  });

  it("keeps the history timeline as a horizontal nine-node archive", () => {
    expect(historyEvents).toHaveLength(9);
    expect(historyEvents.map((event) => event.year)).toEqual([
      "2010",
      "2014",
      "2016",
      "2021",
      "2022",
      "2023",
      "2023",
      "2024",
      "2025",
    ]);
    expect(historyEvents.filter((event) => event.year === "2023")).toHaveLength(2);
    expect(historyTimeline).toContain('role="region"');
    expect(historyTimeline).toContain('className="history-timeline-frame"');
    expect(historyTimeline).toContain('className="history-timeline-track"');
    expect(globalStyles).toContain(".history-timeline-frame");
    expect(globalStyles).not.toContain(".history-timeline-scroll");
    expect(globalStyles).not.toContain(".history-timeline-frame {\n  overflow-x");
    expect(aboutPage).toContain('className="page-intro about-intro"');
    expect(aboutPage).not.toContain('src="/brand/qingwa-lockup-dark.webp"');
    expect(aboutPage).toContain("<AboutHistoryTimeline />");
    expect(aboutPage).toContain('className="page-intro about-intro"');
  });

  it("keeps personnel content limited to the supplied team photo", () => {
    const photoPath = join(process.cwd(), "public", "about", "personnel", "team-photo.png");
    const sidecarPath = `${photoPath}.json`;
    const sidecar = JSON.parse(readFileSync(sidecarPath, "utf8")) as {
      source?: string;
      sourceSha256?: string;
      width?: number;
      height?: number;
      alt?: string;
      verificationStatus?: string;
    };
    const actualHash = createHash("sha256").update(readFileSync(photoPath)).digest("hex");

    expect(aboutPage).toContain('className="page-intro about-intro"');
    expect(aboutPage).not.toContain('className="about-intro-personnel"');
    expect(aboutPage).toContain('aria-label="晴蛙视觉团队合影"');
    expect(aboutPage).not.toContain('id="about-personnel"');
    expect(aboutPage).not.toContain('className="about-personnel-band"');
    expect(aboutPage.indexOf('className="company-profile"')).toBeLessThan(aboutPage.indexOf('id="about-honors"'));
    expect(aboutPage).not.toContain("团队资料待补充");
    expect(existsSync(photoPath)).toBe(true);
    expect(existsSync(sidecarPath)).toBe(true);
    expect(sidecar.source).toContain("D:/xwechat_files/Alfa302_a8cb/temp/RWTemp/2026-08/");
    expect(sidecar.sourceSha256).toBe(actualHash);
    expect(sidecar.sourceSha256).toBe("7a7dbaa85aa82d544a07cdb935386f69db72e131d247b9ce8684dab3be053e3d");
    expect([sidecar.width, sidecar.height]).toEqual([2016, 864]);
    expect(sidecar.alt).toBe("晴蛙视觉团队合照");
    expect(sidecar.verificationStatus).toBe("source-provided-unverified");
  });

  it("keeps the team photo as an unmasked about intro background", () => {
    expect(aboutPage).toContain('className="page-intro about-intro"');
    expect(aboutPage).not.toContain('className="about-intro-personnel"');
    expect(aboutPage).not.toContain('className="about-personnel-band"');
    expect(aboutPage).not.toContain('className="about-personnel"');
    expect(globalStyles).toContain(".about-intro {");
    expect(globalStyles).toContain('background-image: url("/about/personnel/team-photo.png");');
    expect(globalStyles).toContain("background-size: cover;");
    expect(globalStyles).toContain(".company-profile {");
    expect(globalStyles).toContain(".service-local-nav {");
    expect(globalStyles).toContain("top: var(--header-height);");
  });

  it("uses only existing company facts for pending content", () => {
    expect(aboutPage).toContain("company.profile.overview");
    expect(aboutPage).toContain("company.profile.entities.map");
    expect(aboutPage).toContain("company.credentials.map");
    expect(aboutPage).toContain("不等同于已独立核验的奖项清单");
  });

  it("keeps the honor image archive inside the about page", () => {
    expect(aboutPage).toContain("<AboutHonorsGallery />");
    expect(globalHeader).not.toContain("AboutHonorsGallery");
  });

  it("keeps booklet records archived while showing the history timeline in the company profile", () => {
    expect(historyBookletImages).toHaveLength(2);
    expect(historyBookletImages.map((image) => image.pageRange)).toEqual(["08-09", "10-11"]);
    expect(historyBookletImages.every((record) => record.title && record.lead && record.points.length > 0)).toBe(true);
    expect(new Set(historyBookletImages.map((image) => image.pageRange)).size).toBe(2);
    expect(aboutPage).toContain('className="company-profile-history-record"');
    expect(aboutPage.indexOf("<AboutHistoryTimeline />")).toBeLessThan(aboutPage.indexOf('id="about-honors"'));
    expect(aboutPage).not.toContain("<AboutHistoryArchive />");
    expect(historyBookletImages.every((image) => image.verificationNote.includes("尚未独立核验"))).toBe(true);
    expect(existsSync(join(process.cwd(), "public/about/history/wuhan-company-profiles.webp"))).toBe(false);
    expect(existsSync(join(process.cwd(), "public/about/history/guangzhou-company-profile.webp"))).toBe(false);
  });

  it("places the compact company profile immediately after the hero", () => {
    expect(aboutPage.indexOf('className="page-intro about-intro"')).toBeLessThan(aboutPage.indexOf('className="company-profile"'));
    expect(aboutPage).toContain('className="company-profile-heading"');
    expect(aboutPage).toContain('className="company-profile-history-label"');
    expect(globalStyles).toContain(".company-profile-history-record");
  });
});
