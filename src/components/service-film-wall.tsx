import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/content/site";

type ServiceFilmWallProps = {
  service: Service;
};

export function ServiceFilmWall({ service }: ServiceFilmWallProps) {
  const galleryItems = service.items.filter((item) => item.gallery?.length);
  const headingId = `service-film-wall-${service.slug}-heading`;

  return (
    <section className="service-film-wall" aria-labelledby={headingId}>
      <div className="service-film-wall-heading">
        <span>{service.englishTitle} / SERVICE ARCHIVES</span>
        <h2 id={headingId}>{service.title}</h2>
      </div>
      {galleryItems.map((item, index) => {
        const gallery = item.gallery ?? [];
        const itemId = `service-film-wall-${service.slug}-${item.slug}`;

        return (
          <article className="service-film-wall-group" data-gallery-layout="featured-07-08" key={item.slug} aria-labelledby={itemId}>
            <div className="service-film-wall-group-heading">
              <div>
                <span>{String(index + 1).padStart(2, "0")} / {service.englishTitle}</span>
                <h3 id={itemId}>{item.label}</h3>
              </div>
              <p>{item.description}</p>
              <Link href={`/services/${service.slug}/${item.slug}`} aria-label={`查看${item.label}详情`}>
                查看{item.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="service-gallery-grid">
              {gallery.map((image, imageIndex) => (
                <figure className="service-gallery-tile" key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    quality={75}
                    sizes={imageIndex === 6 || imageIndex === 7
                      ? "(max-width: 580px) 100vw, (max-width: 900px) 100vw, 50vw"
                      : "(max-width: 580px) 100vw, (max-width: 900px) 50vw, 25vw"}
                  />
                </figure>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
