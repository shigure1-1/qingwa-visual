"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Initiative } from "@/content/site";

type InitiativeLocalNavProps = {
  initiative: Initiative;
  currentItem?: string;
};

export function InitiativeLocalNav({ initiative, currentItem }: InitiativeLocalNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const items = initiative.items ?? [];

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
      aria-label={`${initiative.label}子业务导航`}
    >
      <span>{initiative.label} / AGI</span>
      <div>
        {items.map((item, index) => (
          <Link
            key={item.slug}
            href={`/${initiative.slug}/${item.slug}`}
            aria-current={currentItem === item.slug ? "page" : undefined}
          >
            <small>{String(index + 1).padStart(2, "0")}</small>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
