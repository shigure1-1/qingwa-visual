---
version: 1
slug: "src-components-partners-partner-network-map-tsx"
primary_target: "src/components/partners/partner-network-map.tsx"
related_targets: ["src/components/partners/partner-network-map.module.css","src/components/initiative-page.tsx"]
---

# Partner network map extension

Scope: replace the static map idea below the partner wall with an interactive three-dimensional China network map. Preserve the partner wall, public contact truth, page order, and the incumbent Qingwa Visual identity. Experience mode: let prospective collaborators inspect regional contact points without leaving the page.

## Direction contract

THESIS: make the collaboration footprint explorable as a working spatial instrument, not a decorative map image or a repeated card grid.

OWN-WORLD: inherit observation black, Qingwa teal, Noto Sans SC and Archivo measurement labels. Provinces are teal extrusions with pale boundary edges; coral marks the active city and acid green carries restrained network pulses. Controls remain square, flat, and line-based.

STORY: after scanning the client wall, visitors see where the team connects across China, select Wuhan, Shenzhen, Shanghai, Guangzhou, or Kunming, and receive an actionable address, phone number, and available email.

FIRST VIEWPORT: a large unframed WebGL map occupies the left two-thirds and a synchronized contact panel occupies the right third. The map is immediately draggable and zoomable; city labels sit on their geographic points. On mobile, the title, map, horizontal city tabs, and detail panel stack in that order without horizontal overflow.

FORM: direct user-pinned narrow extension, ranked first because the request explicitly requires an interactive 3D map with informative markers. Seed key: direct-user-pinned-extension; the concept-seed roll is exempt under the narrow-request rule. The signature interaction couples DOM city labels to Three.js geometry while selection updates one accessible tab panel; reduced motion stops pulses and WebGL failure preserves contact access.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Constraints

No Beijing marker. No online map API. Existing partner assets and homepage customer wall remain unchanged. Contact details are existing project content and require publication verification under PRODUCT.md.
