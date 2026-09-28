import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { locations } from "@/content/site";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("contact page", () => {
  it("uses the compact contact introduction", () => {
    const styles = read("src/app/globals.css");

    expect(styles).toContain(".page-intro.contact-intro");
    expect(styles).toContain(".page-intro.contact-intro h1");
    expect(styles).toContain("max-width: none");
    expect(styles).toContain("min-height: clamp(31rem, 58svh, 40rem)");
    expect(styles).toContain("font-size: clamp(2.8rem, 5.2vw, 5.5rem)");
    expect(styles).toContain("font-size: clamp(2.2rem, 9.2vw, 3rem)");
  });

  it("does not publish the removed Beijing contact information", () => {
    const contactPage = read("src/app/contact/page.tsx");
    const footer = read("src/components/site-footer.tsx");

    expect(locations).toHaveLength(6);
    expect(locations.some((location) => location.city.includes("北京"))).toBe(false);
    expect(contactPage).not.toContain("北京");
    expect(contactPage).not.toContain("contact-board.jpg");
    expect(footer).not.toContain("北京");
  });
});
