"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export const aboutSections = [
  { href: "#about-overview", label: "关于我们" },
  { href: "#about-history", label: "发展历程" },
  { href: "#about-personnel", label: "人员介绍" },
  { href: "#about-honors", label: "企业荣誉" },
] as const;

export function AboutLocalNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setScrolled(window.scrollY > 24);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    function alignHashTarget() {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;

      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView({ block: "start" });
      root.style.scrollBehavior = previousBehavior;
    }

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(alignHashTarget);
    });
    void document.fonts?.ready.then(alignHashTarget);
    window.addEventListener("load", alignHashTarget, { once: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", alignHashTarget);
    };
  }, []);

  return (
    <nav
      className="about-local-nav service-local-nav"
      data-scrolled={scrolled ? "true" : undefined}
      aria-label="关于我们页内导航"
    >
      <span>ABOUT / SECTIONS</span>
      <div>
        {aboutSections.map((section) => (
          <Link href={section.href} key={section.href}>
            {section.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
