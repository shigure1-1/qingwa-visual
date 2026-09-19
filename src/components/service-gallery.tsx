import Image from "next/image";
import type { ServiceGalleryItem, ServiceGalleryLayout } from "@/content/site";

type ServiceGalleryProps = {
  gallery: ServiceGalleryItem[];
  eyebrow: string;
  headingId: string;
  layout?: ServiceGalleryLayout;
  title: string;
};

export function ServiceGallery({ gallery, eyebrow, headingId, layout = "standard", title }: ServiceGalleryProps) {
  return (
    <section className="service-gallery" data-gallery-layout={layout} aria-labelledby={headingId}>
      <div className="service-gallery-heading">
        <div>
          <span>{eyebrow}</span>
          <h2 id={headingId}>{title}</h2>
        </div>
        <p>{gallery.length} / IMAGES</p>
      </div>
      <div className="service-gallery-body">
        <div className="service-gallery-grid">
          {gallery.map((image, index) => {
            const isFeaturedTile = (layout === "digital-twin-spread"
              && (index === 0 || index === gallery.length - 1))
              || (layout === "agi-spread" && index === 0);
            const sizes = isFeaturedTile
              ? "(max-width: 580px) 100vw, 100vw"
              : layout === "film-sequence"
              ? index < 4
                ? "(max-width: 580px) 100vw, 50vw"
                : "(max-width: 580px) 100vw, (max-width: 900px) 50vw, 25vw"
              : layout === "two-up"
                ? "(max-width: 580px) 100vw, 50vw"
                : "(max-width: 580px) 100vw, (max-width: 900px) 50vw, 25vw";

            return (
              <figure className="service-gallery-tile" key={image.src}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  quality={75}
                  sizes={sizes}
                />
              </figure>
            );
          })}
        </div>
        <aside className="service-gallery-note" aria-label="图集备注">
          <p>以上仅为部分项目，排名不分先后，期待与您的相遇...</p>
        </aside>
      </div>
    </section>
  );
}
