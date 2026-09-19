"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type MouseEvent } from "react";
import { navigation, type NavigationItem } from "@/content/site";
import { BrandLockup, LogoMark } from "./logo-mark";

function getNavigationPath(href: string) {
  return href.split(/[?#]/)[0] || "/";
}

function isNavigationItemCurrent(pathname: string, item: NavigationItem, child = false) {
  if (item.href.includes("?")) return false;

  const targetPath = getNavigationPath(item.href);
  if (targetPath === "/") return pathname === "/";
  if (child && item.variant === "all") return pathname === targetPath;

  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}

export function SiteHeader({ home = false }: { home?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const isTopLevelRoute =
      pathname.startsWith("/work/") ||
      pathname.startsWith("/services/") ||
      pathname === "/agi" ||
      pathname.startsWith("/agi/") ||
      pathname === "/education-training" ||
      pathname === "/partners" ||
      pathname === "/about" ||
      pathname === "/contact";

    if (isTopLevelRoute && !window.location.hash) {
      const frame = window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });

      return () => window.cancelAnimationFrame(frame);
    }

    if (pathname !== "/" || window.location.hash) return;

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    document.body.dataset.menuOpen = open ? "true" : "false";
    return () => {
      delete document.body.dataset.menuOpen;
    };
  }, [open]);

  useEffect(() => {
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, footer"));
    const previous = background.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));

    background.forEach((element) => {
      element.inert = open;
      if (open) {
        element.setAttribute("aria-hidden", "true");
      } else {
        element.removeAttribute("aria-hidden");
      }
    });

    return () => {
      previous.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute("aria-hidden", ariaHidden);
        }
      });
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      setMobileOpen(null);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function closeNavigation() {
    setOpen(false);
    setDesktopOpen(null);
    setMobileOpen(null);
  }

  function followNavigation(event: MouseEvent<HTMLAnchorElement>, item: NavigationItem) {
    closeNavigation();

    const targetPath = getNavigationPath(item.href);
    const canRepeatToTop = targetPath === "/" || targetPath === "/creative";
    if (!canRepeatToTop || pathname !== targetPath) return;

    event.preventDefault();
    window.history.replaceState(null, "", targetPath);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  function closeDesktopOnBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setDesktopOpen(null);
    }
  }

  function closeDesktopOnEscape(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Escape") return;
    setDesktopOpen(null);
    event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
  }

  return (
    <header className="site-header">
      <Link
        className="brand-link"
        href="/"
        aria-label="晴蛙视觉首页"
        onClick={(event) => followNavigation(event, navigation[0])}
      >
        {home ? (
          <BrandLockup className="brand-home-lockup" priority />
        ) : (
          <>
            <LogoMark className="brand-mark" size={44} priority />
            <span className="brand-wordmark">
              <strong>晴蛙视觉</strong>
              <span>QINGWA VISUAL</span>
            </span>
          </>
        )}
      </Link>

      <nav className="desktop-nav" aria-label="主导航">
        {navigation.map((item, index) => {
          const hasChildren = item.kind === "menu" && Boolean(item.children?.length);
          const expanded = desktopOpen === item.label;
          const current = isNavigationItemCurrent(pathname, item);

          if (!hasChildren) {
            return (
              <Link
                key={item.label}
                href={item.href}
                data-variant={item.variant}
                aria-current={current ? "page" : undefined}
                onClick={(event) => followNavigation(event, item)}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <div
              className="desktop-nav-group"
              key={item.label}
              data-align={item.align}
              data-open={expanded}
              onMouseEnter={() => setDesktopOpen(item.label)}
              onMouseLeave={() => setDesktopOpen(null)}
              onFocus={() => setDesktopOpen(item.label)}
              onBlur={closeDesktopOnBlur}
              onKeyDown={closeDesktopOnEscape}
            >
              <span className="desktop-nav-trigger">
                <Link
                  href={item.href}
                  data-variant={item.variant}
                  aria-current={current ? "page" : undefined}
                  onClick={(event) => followNavigation(event, item)}
                >
                  {item.label}
                </Link>
                <button
                  type="button"
                  aria-label={`${expanded ? "收起" : "展开"}${item.label}子菜单`}
                  aria-expanded={expanded}
                  aria-controls={`desktop-submenu-${index}`}
                  onClick={() => setDesktopOpen(expanded ? null : item.label)}
                >
                  <ChevronDown aria-hidden="true" />
                </button>
              </span>
              <div className="desktop-submenu" id={`desktop-submenu-${index}`}>
                <span>{item.sectionLabel}</span>
                {item.children?.map((child) => {
                  const childCurrent = isNavigationItemCurrent(pathname, child, true);
                  return (
                    <Link
                      key={child.href}
                      className={child.variant === "all" ? "desktop-submenu-all" : undefined}
                      href={child.href}
                      data-variant={child.variant}
                      aria-current={childCurrent ? "page" : undefined}
                      onClick={(event) => followNavigation(event, child)}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "关闭导航" : "打开导航"}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>

      <div
        className="mobile-nav"
        id="mobile-navigation"
        data-open={open}
        hidden={!open}
        aria-hidden={!open}
        inert={!open ? true : undefined}
      >
        <nav aria-label="移动端主导航">
          {navigation.map((item, index) => {
            const expanded = mobileOpen === item.label;
            const hasChildren = item.kind === "menu" && Boolean(item.children?.length);
            const current = isNavigationItemCurrent(pathname, item);

            if (!hasChildren) {
              return (
                <Link
                  className="mobile-nav-link"
                  key={item.label}
                  href={item.href}
                  data-variant={item.variant}
                  aria-current={current ? "page" : undefined}
                  onClick={(event) => followNavigation(event, item)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              );
            }

            return (
              <div className="mobile-nav-group" key={item.label} data-align={item.align} data-open={expanded}>
                <div className="mobile-nav-row">
                  <Link
                    href={item.href}
                    data-variant={item.variant}
                    aria-current={current ? "page" : undefined}
                    onClick={(event) => followNavigation(event, item)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-label={`${expanded ? "收起" : "展开"}${item.label}子菜单`}
                    aria-expanded={expanded}
                    aria-controls={`mobile-submenu-${index}`}
                    onClick={() => setMobileOpen(expanded ? null : item.label)}
                  >
                    <ChevronDown aria-hidden="true" />
                  </button>
                </div>
                <div
                  className="mobile-submenu"
                  id={`mobile-submenu-${index}`}
                  aria-hidden={!expanded}
                  inert={!expanded ? true : undefined}
                >
                  <div className="mobile-submenu-items">
                    {item.children?.map((child) => {
                      const childCurrent = isNavigationItemCurrent(pathname, child, true);
                      return (
                        <Link
                          key={child.href}
                          className={child.variant === "all" ? "mobile-submenu-all" : undefined}
                          href={child.href}
                          data-variant={child.variant}
                          aria-current={childCurrent ? "page" : undefined}
                          onClick={(event) => followNavigation(event, child)}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        <p>一眼所见，从此不同。</p>
      </div>
    </header>
  );
}
