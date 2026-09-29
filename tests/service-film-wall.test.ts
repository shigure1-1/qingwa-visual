import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { services } from "@/content/site";

const pageComponent = readFileSync(join(process.cwd(), "src", "components", "service-page.tsx"), "utf8");
const wallComponent = readFileSync(join(process.cwd(), "src", "components", "service-film-wall.tsx"), "utf8");
const globalStyles = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

describe("digital film and animation service walls", () => {
  it("renders each digital film gallery after the overview and before subnavigation", () => {
    const digitalFilm = services.find((service) => service.slug === "digital-film");
    expect(digitalFilm?.items.map((item) => item.slug)).toEqual(["tvc", "promo-film", "micro-film"]);
    expect(digitalFilm?.items.map((item) => item.gallery?.length)).toEqual([10, 10, 8]);
    expect(pageComponent.indexOf('className="proof-band page-second-band"')).toBeLessThan(pageComponent.indexOf("<ServiceFilmWall service={service} />"));
    expect(pageComponent.indexOf("<ServiceFilmWall service={service} />")).toBeLessThan(pageComponent.indexOf("service-subnav"));
  });

  it("renders all three digital animation child galleries", () => {
    const digitalAnimation = services.find((service) => service.slug === "digital-animation");
    const galleryItems = digitalAnimation?.items.filter((item) => (item.gallery?.length ?? 0) > 0);
    expect(galleryItems?.map((item) => item.slug)).toEqual(["film-animation", "product-animation", "property-animation"]);
    expect(galleryItems?.map((item) => item.gallery?.length)).toEqual([10, 10, 20]);
    expect(wallComponent).toContain("galleryItems.map");
    expect(wallComponent).toContain("gallery.map");
    expect(wallComponent).toContain("`/services/${service.slug}/${item.slug}`");
  });

  it("uses a four-column image wall with two featured images and responsive layout", () => {
    expect(wallComponent).toContain('className="service-gallery-grid"');
    expect(wallComponent).toContain('data-gallery-layout="featured-07-08"');
    expect(globalStyles).toContain(".service-film-wall-group .service-gallery-grid {");
    expect(globalStyles).toContain(".service-film-wall-group .service-gallery-tile:nth-child(7),");
    expect(globalStyles).toContain(".service-film-wall-group .service-gallery-tile:nth-child(8) {");
    expect(globalStyles).toContain("@media (max-width: 900px)");
    expect(globalStyles).toContain("@media (max-width: 580px)");
  });
});
