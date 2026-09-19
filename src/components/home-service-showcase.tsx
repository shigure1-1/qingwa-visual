"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Service, ServiceGalleryItem } from "@/content/site";

type HomeServiceShowcaseProps = {
  services: Service[];
};

type HomeServiceSlide = ServiceGalleryItem & {
  label: string;
  description: string;
  href: string;
};

function getServiceSlides(service: Service): HomeServiceSlide[] {
  if (service.gallery?.length) {
    return service.gallery.map((image) => ({
      ...image,
      label: service.title,
      description: service.heroDescription,
      href: `/services/${service.slug}`,
    }));
  }

  return service.items.flatMap((item) =>
    (item.gallery ?? []).map((image) => ({
      ...image,
      label: item.label,
      description: item.description,
      href: `/services/${service.slug}/${item.slug}`,
    })),
  );
}

function HomeServiceCard({ service }: { service: Service }) {
  const slides = getServiceSlides(service);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const titleId = `home-service-${service.slug}`;

  const move = (direction: -1 | 1) => {
    if (slides.length < 2) return;
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <article className="home-service-card" aria-labelledby={titleId}>
      <header className="home-service-card-header">
        <h3 id={titleId}>
          <Link href={`/services/${service.slug}`}>{service.title}</Link>
        </h3>
        <div className="home-service-card-details">
          <ul aria-label={`${service.title}子业务`}>
            {service.items.map((item) => (
              <li key={item.slug}>
                <Link href={`/services/${service.slug}/${item.slug}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <p>{service.description}</p>
        </div>
      </header>

      <div className="home-service-card-showcase">
        <div className="home-service-card-media">
          {activeSlide ? (
            <Link href={activeSlide.href} aria-label={`查看${activeSlide.label}`}>
              <Image
                key={activeSlide.src}
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                quality={82}
                sizes="(max-width: 580px) calc(100vw - 2.5rem), (max-width: 900px) 62vw, 31vw"
              />
            </Link>
          ) : (
            <div className="home-service-card-empty">
              <span>影像资料整理中</span>
            </div>
          )}
        </div>

        <div className="home-service-card-caption" aria-live="polite">
          <div>
            <h4>{activeSlide?.label ?? service.title}</h4>
            <p>{activeSlide?.description ?? service.heroDescription}</p>
          </div>
          <div className="home-service-card-footer">
            <span>
              {slides.length > 0
                ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`
                : "-- / --"}
            </span>
            <div className="home-service-card-controls" aria-label={`${service.title}幻灯片控制`}>
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label={`上一张${service.title}图片`}
                title="上一张"
                disabled={slides.length < 2}
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label={`下一张${service.title}图片`}
                title="下一张"
                disabled={slides.length < 2}
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function HomeServiceShowcase({ services }: HomeServiceShowcaseProps) {
  return (
    <div className="home-service-grid">
      {services.map((service) => (
        <HomeServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}
