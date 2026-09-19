"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Service, ServiceItem } from "@/content/site";

type ServiceFilmRailsProps = {
  service: Service;
};

function FilmRail({ item, index, service }: { item: ServiceItem; index: number; service: Service }) {
  const gallery = item.gallery ?? [];
  const railRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const programmaticScrollTimerRef = useRef<number | null>(null);
  const programmaticScrollRef = useRef(false);
  const [frame, setFrame] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [playbackOverride, setPlaybackOverride] = useState(false);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [offscreenPaused, setOffscreenPaused] = useState(true);
  const [documentPaused, setDocumentPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const interactionPause = pointerPaused || focusPaused || interactionPaused || reduceMotion;
  const environmentalPause = offscreenPaused || documentPaused;
  const paused = manualPaused || environmentalPause || (!playbackOverride && interactionPause);
  const controlPaused = manualPaused || (reduceMotion && !playbackOverride);

  const scrollToFrame = useCallback((nextFrame: number, behavior: ScrollBehavior = "smooth") => {
    if (gallery.length === 0) return;
    const next = (nextFrame + gallery.length) % gallery.length;
    frameRef.current = next;
    setFrame(next);
    const scroll = scrollRef.current;
    if (scroll) {
      programmaticScrollRef.current = true;
      if (programmaticScrollTimerRef.current !== null) window.clearTimeout(programmaticScrollTimerRef.current);
      scroll.scrollTo({
        left: next * scroll.clientWidth,
        behavior: reduceMotion ? "auto" : behavior,
      });
      programmaticScrollTimerRef.current = window.setTimeout(() => {
        programmaticScrollRef.current = false;
        programmaticScrollTimerRef.current = null;
      }, reduceMotion ? 0 : 600);
    }
  }, [gallery.length, reduceMotion]);

  const resumeAfterInteraction = useCallback(() => {
    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      setInteractionPaused(false);
      resumeTimerRef.current = null;
    }, 1000);
  }, []);

  const pauseForInteraction = useCallback(() => {
    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
    setInteractionPaused(true);
  }, []);

  const move = (direction: -1 | 1) => {
    if (gallery.length < 2) return;
    setPlaybackOverride(false);
    pauseForInteraction();
    scrollToFrame(frameRef.current + direction);
    resumeAfterInteraction();
  };

  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReduceMotion(motionQuery.matches);
    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);
    return () => motionQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOffscreenPaused(!entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(rail);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncVisibility = () => setDocumentPaused(document.visibilityState !== "visible");
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    if (gallery.length < 2 || paused) return;
    const timer = window.setInterval(() => {
      scrollToFrame(frameRef.current + 1);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [gallery.length, paused, scrollToFrame]);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const resizeObserver = new ResizeObserver(() => {
      scroll.scrollTo({ left: frameRef.current * scroll.clientWidth, behavior: "auto" });
    });
    resizeObserver.observe(scroll);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => () => {
    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
    if (programmaticScrollTimerRef.current !== null) window.clearTimeout(programmaticScrollTimerRef.current);
  }, []);

  const togglePlayback = () => {
    if (controlPaused) {
      setManualPaused(false);
      setPlaybackOverride(true);
      return;
    }

    setManualPaused(true);
    setPlaybackOverride(false);
  };

  const handleScroll = () => {
    const scroll = scrollRef.current;
    if (!scroll || scroll.clientWidth === 0 || gallery.length === 0) return;
    if (!programmaticScrollRef.current) {
      setPlaybackOverride(false);
      pauseForInteraction();
      resumeAfterInteraction();
    }
    const next = Math.min(gallery.length - 1, Math.max(0, Math.round(scroll.scrollLeft / scroll.clientWidth)));
    if (next !== frameRef.current) {
      frameRef.current = next;
      setFrame(next);
    }
  };

  const railId = `service-film-rail-${item.slug}`;
  const label = `${String(index + 1).padStart(2, "0")} / ${item.label}`;

  return (
    <article ref={railRef} className="service-film-rail" data-has-gallery={gallery.length > 0} aria-labelledby={railId}>
      <div
        className="service-film-rail-media"
        onPointerEnter={() => setPointerPaused(true)}
        onPointerLeave={() => setPointerPaused(false)}
        onFocus={(event) => setFocusPaused(event.target === scrollRef.current)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocusPaused(false);
        }}
      >
        {gallery.length > 0 ? (
          <div
            className="service-film-rail-media-window"
            ref={scrollRef}
            tabIndex={0}
            role="region"
            aria-label={`${item.label}单窗图片展示，可横向滑动`}
            aria-roledescription="carousel"
            onScroll={handleScroll}
            onWheel={() => {
              pauseForInteraction();
              resumeAfterInteraction();
            }}
            onKeyDown={() => {
              pauseForInteraction();
              resumeAfterInteraction();
            }}
            onPointerDown={(event) => {
              if (event.pointerType !== "mouse") pauseForInteraction();
            }}
            onPointerUp={resumeAfterInteraction}
            onPointerCancel={resumeAfterInteraction}
            onTouchStart={pauseForInteraction}
            onTouchEnd={resumeAfterInteraction}
            onTouchCancel={resumeAfterInteraction}
          >
            <div className="service-film-rail-track" style={{ gridTemplateColumns: `repeat(${gallery.length}, 100%)` }}>
              {gallery.map((image, imageIndex) => (
                <figure
                  className="service-film-rail-slide"
                  data-active={imageIndex === frame}
                  aria-hidden={imageIndex !== frame}
                  key={image.src}
                >
                  <Image
                    src={image.src}
                    alt={imageIndex === frame ? image.alt : ""}
                    width={image.width}
                    height={image.height}
                    quality={75}
                    sizes="(max-width: 580px) 100vw, (max-width: 900px) 62vw, 58vw"
                  />
                </figure>
              ))}
            </div>
          </div>
        ) : (
          <div className="service-film-rail-media-window">
            <div className="service-film-rail-empty">
              <span>MEDIA / PENDING</span>
              <strong>暂无图册</strong>
            </div>
          </div>
        )}
        <div className="service-film-rail-media-meta">
          <span>{gallery.length > 0 ? `${String(frame + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}` : "-- / --"}</span>
          <span>{paused && gallery.length > 1 ? "PAUSED" : "IMAGE WINDOW"}</span>
          {gallery.length > 1 && (
            <div className="service-film-rail-controls" aria-label={`${item.label}图集控制`}>
              <button type="button" onClick={() => move(-1)} aria-label={`上一张${item.label}图片`}>
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={controlPaused ? `播放${item.label}图集` : `暂停${item.label}图集`}
                aria-pressed={controlPaused}
              >
                {controlPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              </button>
              <button type="button" onClick={() => move(1)} aria-label={`下一张${item.label}图片`}>
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="service-film-rail-copy">
        <span>{service.englishTitle} / {label}</span>
        <h3 id={railId}>{item.label}</h3>
        <p>{item.description}</p>
        <Link href={`/services/${service.slug}/${item.slug}`}>
          查看{item.label}
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ServiceFilmRails({ service }: ServiceFilmRailsProps) {
  const galleryItems = service.items.filter((item) => (item.gallery?.length ?? 0) > 0);
  const isAnimation = service.slug === "digital-animation";
  const headingId = `service-film-rails-${service.slug}-heading`;

  return (
    <section className="service-film-rails" data-service={service.slug} aria-labelledby={headingId}>
      <div className="service-film-rails-heading">
        <div>
          <span>{service.englishTitle} / SERVICE ARCHIVES</span>
          <h2 id={headingId}>
            {isAnimation ? "从一帧开始，进入三种动画表达。" : "从一帧开始，分别进入三种影像叙事。"}
          </h2>
        </div>
        <p>{isAnimation ? "影视、产品与地产动画作品节选。" : "每个方向独立展示，图册随素材逐步补齐。"}</p>
      </div>
      <div className="service-film-rails-list">
        {galleryItems.map((item, index) => (
          <FilmRail item={item} index={index} key={item.slug} service={service} />
        ))}
      </div>
    </section>
  );
}
