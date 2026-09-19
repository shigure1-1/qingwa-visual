"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { creativeCategories } from "@/content/creative";

export function CreativeNav() {
  const pathname = usePathname();

  return (
    <nav className="creative-nav" aria-label="晴蛙文创导航">
      <Link
        className="creative-nav-brand"
        href="/creative"
        aria-current={pathname === "/creative" ? "page" : undefined}
      >
        <strong>晴蛙文创</strong>
        <span>CREATIVE</span>
      </Link>
      <div className="creative-nav-categories">
        {creativeCategories.map((category) => {
          const href = `/creative/${category.slug}`;
          const current = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link key={category.slug} href={href} aria-current={current ? "page" : undefined}>
              {category.title}
            </Link>
          );
        })}
      </div>
      <Link
        className="creative-nav-cart"
        href="/creative/cart"
        aria-label="查看文创购物车"
        aria-current={pathname === "/creative/cart" ? "page" : undefined}
      >
        <ShoppingBag aria-hidden="true" />
        <span>购物车</span>
      </Link>
    </nav>
  );
}
