import Link from "next/link";
import type { Service } from "@/content/site";

type HomeServiceShowcaseProps = {
  services: Service[];
};

function HomeServiceCard({ service }: { service: Service }) {
  const titleId = `home-service-${service.slug}`;

  return (
    <article className="home-service-card" aria-labelledby={titleId}>
      <h3 id={titleId}>
        <Link href={`/services/${service.slug}`}>{service.title}</Link>
      </h3>
      <p className="home-service-card-description">{service.description}</p>
      <nav className="home-service-card-subnav" aria-label={`${service.title}子业务`}>
        {service.items.map((item) => (
          <Link key={item.slug} href={`/services/${service.slug}/${item.slug}`}>
            {item.label}
          </Link>
        ))}
      </nav>
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
