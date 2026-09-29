"use client";

import Image from "next/image";
import { ChevronDown, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { ServiceGalleryItem } from "@/content/site";

type FilmGalleryBrowserProps = {
  gallery: ServiceGalleryItem[];
  title: string;
  variant?: "standard" | "four-up-disclosure";
};

const englishTitles: Record<string, string> = {
  "TVC": "TVC",
  "宣传片": "PROMOTIONAL FILM",
  "微电影": "MICRO FILM",
  "影视动画": "FILM ANIMATION",
  "产品动画": "PRODUCT ANIMATION",
  "地产动画": "PROPERTY ANIMATION",
};

export function FilmGalleryBrowser({ gallery, title, variant = "standard" }: FilmGalleryBrowserProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = activeIndex !== null;
  const englishTitle = englishTitles[title] ?? "ANIMATION ARCHIVE";
  const portalReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const move = useCallback((offset: number) => {
    setActiveIndex((current) => {
      if (current === null) return 0;
      return (current + offset + gallery.length) % gallery.length;
    });
  }, [gallery.length]);

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const controls = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"),
      );
      const firstControl = controls[0];
      const lastControl = controls.at(-1);

      if (event.shiftKey && document.activeElement === firstControl) {
        event.preventDefault();
        lastControl?.focus();
      } else if (!event.shiftKey && document.activeElement === lastControl) {
        event.preventDefault();
        firstControl?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      lastTriggerRef.current?.focus();
    };
  }, [close, isOpen, move]);

  if (gallery.length === 0) return null;

  const activeImage = activeIndex === null ? null : gallery[activeIndex];

  return (
    <div className="film-gallery-browser" data-layout={variant}>
      <div className="film-gallery-card-grid" aria-label={`${title}交互卡片图集`}>
        {gallery.map((image, index) => {
          const frame = String(index + 1).padStart(2, "0");

          return (
            <article className="film-gallery-card" key={image.src}>
              <button
                type="button"
                className="film-gallery-card-trigger"
                aria-label={`查看${title}镜头 ${frame} 大图`}
                onClick={(event) => {
                  lastTriggerRef.current = event.currentTarget;
                  setActiveIndex(index);
                }}
              >
                <span className="film-gallery-card-media">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    quality={82}
                    sizes={variant === "four-up-disclosure"
                      ? "(max-width: 580px) 100vw, (max-width: 900px) 50vw, 25vw"
                      : "(max-width: 580px) 100vw, 50vw"}
                  />
                  <span className="film-gallery-card-shade" aria-hidden="true" />
                  <span className="film-gallery-card-open" aria-hidden="true">
                    <Maximize2 />
                  </span>
                </span>
              </button>

              {variant === "four-up-disclosure" ? (
                <div className={`film-gallery-card-disclosure${expandedIndex === index ? " is-expanded" : ""}`}>
                  <button
                    className="film-gallery-card-disclosure-trigger"
                    type="button"
                    aria-expanded={expandedIndex === index}
                    aria-controls={`film-gallery-card-panel-${index}`}
                    onClick={() => setExpandedIndex((current) => current === index ? null : index)}
                  >
                    <span>FRAME {frame}</span>
                    <strong>作品信息</strong>
                    <ChevronDown aria-hidden="true" />
                  </button>
                  <div
                    className="film-gallery-card-disclosure-panel"
                    id={`film-gallery-card-panel-${index}`}
                    aria-hidden={expandedIndex !== index}
                  >
                    <div className="film-gallery-card-disclosure-content">
                      <div className="film-gallery-card-disclosure-copy">
                        <strong>{title} · 镜头 {frame}</strong>
                        <span>{englishTitle}</span>
                        <p>{image.alt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="film-gallery-card-meta">
                  <div>
                    <strong>{title} · 镜头 {frame}</strong>
                    <span>{englishTitle}</span>
                  </div>
                  <span>FRAME {frame}</span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {portalReady && activeImage && activeIndex !== null
        ? createPortal(
            <div
              className="film-gallery-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={`${title}大图查看`}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <div className="film-gallery-lightbox-panel" ref={dialogRef}>
                <header className="film-gallery-lightbox-header">
                  <div>
                    <strong>{title}</strong>
                    <span>
                      FRAME {String(activeIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
                    </span>
                  </div>
                  <button ref={closeButtonRef} type="button" onClick={close} aria-label="关闭大图">
                    <X aria-hidden="true" />
                  </button>
                </header>

                <div className="film-gallery-lightbox-stage">
                  <button type="button" onClick={() => move(-1)} aria-label="上一张图片">
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    width={activeImage.width}
                    height={activeImage.height}
                    quality={92}
                    sizes="95vw"
                    priority
                  />
                  <button type="button" onClick={() => move(1)} aria-label="下一张图片">
                    <ChevronRight aria-hidden="true" />
                  </button>
                </div>

                <footer className="film-gallery-lightbox-footer">
                  <span>{englishTitle}</span>
                  <span>{activeImage.alt}</span>
                </footer>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
