import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/content/site";
import type { CSSProperties } from "react";

type HomeServiceShowcaseProps = {
  services: Service[];
};

const serviceBackgrounds: Record<string, string> = {
  "digital-space": "/home/service-backgrounds/digital-space.png",
  "digital-tourism": "/home/service-backgrounds/digital-tourism.png",
  "digital-film": "/home/service-backgrounds/digital-film.png",
  "digital-animation": "/home/service-backgrounds/digital-animation.png",
  "digital-twin": "/services/digital-twin/gallery/01.png",
  aigc: "/home/service-backgrounds/aigc.png",
};

function HomeServiceCard({ service }: { service: Service }) {
  const titleId = `home-service-${service.slug}`;
  const backgroundImage = serviceBackgrounds[service.slug];

  return (
    <article
      className="home-service-card"
      data-service={service.slug}
      aria-labelledby={titleId}
      style={{ "--home-service-image": `url(${backgroundImage})` } as CSSProperties}
    >
      <h3 id={titleId}>
        <Link href={`/services/${service.slug}`}>
          <span>{service.title}</span>
          <small lang="en">{service.englishTitle}</small>
        </Link>
      </h3>
      <p className="home-service-card-description">{service.description}</p>
      <nav className="home-service-card-subnav" aria-label={`${service.title}子业务`}>
        {service.items.map((item) => (
          <Link key={item.slug} href={`/services/${service.slug}/${item.slug}`}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        className="home-service-card-action"
        href={`/services/${service.slug}`}
        aria-label={`查看${service.title}详情`}
        title={`查看${service.title}详情`}
      >
        <ArrowRight aria-hidden="true" />
      </Link>
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
