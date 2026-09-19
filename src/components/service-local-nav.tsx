"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Service } from "@/content/site";

type ServiceLocalNavProps = {
  service: Service;
  currentItem?: string;
};

export function ServiceLocalNav({ service, currentItem }: ServiceLocalNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <nav
      className="service-local-nav"
      data-scrolled={scrolled}
      aria-label={`${service.title}子业务导航`}
    >
      <span>{service.title} / SERVICES</span>
      <div>
        {service.items.map((serviceItem, index) => {
          const selected = currentItem === serviceItem.slug;
          return (
            <Link
              key={serviceItem.slug}
              href={`/services/${service.slug}/${serviceItem.slug}`}
              aria-current={selected ? "page" : undefined}
            >
              <small>{String(index + 1).padStart(2, "0")}</small>
              {serviceItem.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
