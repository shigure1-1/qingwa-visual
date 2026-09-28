"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getHomeSlideIndex, homeSlides } from "@/content/home-slides";
import { HomeLogoIntro } from "@/components/home-logo-intro";

const SLIDE_INTERVAL = 5000;

export function HomeHeroSlideshow() {
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  const [introFinished, setIntroFinished] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [offscreenPaused, setOffscreenPaused] = useState(true);
  const [documentPaused, setDocumentPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [playbackOverride, setPlaybackOverride] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const controlPaused = manualPaused || (reduceMotion && !playbackOverride);
  const paused = !introFinished || manualPaused || offscreenPaused || documentPaused
    || (!playbackOverride && (pointerPaused || focusPaused || reduceMotion));
  const finishIntro = useCallback(() => setIntroFinished(true), []);

  const selectSlide = useCallback((index: number) => {
    setActive(getHomeSlideIndex(index));
    setPlaybackOverride(false);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOffscreenPaused(!entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setReduceMotion(motionQuery.matches);
      setPlaybackOverride(false);
    };
    const syncVisibility = () => setDocumentPaused(document.visibilityState !== "visible");
    const frame = window.requestAnimationFrame(() => { syncMotion(); syncVisibility(); });
    motionQuery.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      window.cancelAnimationFrame(frame);
      motionQuery.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => setActive(getHomeSlideIndex(active + 1)), SLIDE_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [active, paused]);

  const togglePlayback = () => {
    if (controlPaused) {
      setManualPaused(false);
      setPlaybackOverride(true);
    } else {
      setManualPaused(true);
      setPlaybackOverride(false);
    }
  };

  return (
    <>
      {!introFinished && <HomeLogoIntro onComplete={finishIntro} />}
      <section
        ref={sectionRef}
        className="home-hero-slideshow"
        aria-label="晴蛙视觉业务展示"
        aria-roledescription="carousel"
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setPointerPaused(true); }}
        onPointerLeave={() => setPointerPaused(false)}
        onFocus={() => setFocusPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocusPaused(false);
            setPlaybackOverride(false);
          }
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          selectSlide(active + (event.key === "ArrowRight" ? 1 : -1));
        }}
      >
        <h1 className="visually-hidden">晴蛙视觉，一眼所见，从此不同</h1>
        <div
          className="home-hero-slides"
          id="home-hero-slides"
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse") touchStartRef.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            const start = touchStartRef.current;
            touchStartRef.current = null;
            if (!start) return;
            const distance = event.clientX - start.x;
            if (Math.abs(distance) > 40 && Math.abs(distance) > Math.abs(event.clientY - start.y)) {
              selectSlide(active + (distance < 0 ? 1 : -1));
            }
          }}
          onPointerCancel={() => { touchStartRef.current = null; }}
        >
          {homeSlides.map((image, index) => (
            <div
              className="home-hero-slide"
              data-active={index === active}
              key={image.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${homeSlides.length}，${image.title}`}
              aria-hidden={index !== active}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={1920}
                height={520}
                sizes="100vw"
                loading={index < 2 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                onError={() => setFailedImages((current) => current.includes(image.src) ? current : [...current, image.src])}
              />
              {failedImages.includes(image.src) && (
                <div className="home-hero-image-fallback">
                  <p>{image.title}</p>
                  <Link href={image.href}>查看业务 <ArrowRight aria-hidden="true" size={18} /></Link>
                </div>
              )}
            </div>
          ))}
          <button
            className="home-hero-edge-button home-hero-edge-button--prev"
            type="button"
            title="上一张"
            aria-label="上一张首页图片"
            onClick={() => selectSlide(active - 1)}
          >
            <ChevronLeft aria-hidden="true" size={24} />
          </button>
          <button
            className="home-hero-edge-button home-hero-edge-button--next"
            type="button"
            title="下一张"
            aria-label="下一张首页图片"
            onClick={() => selectSlide(active + 1)}
          >
            <ChevronRight aria-hidden="true" size={24} />
          </button>
          <div className="home-hero-toolbar">
            <div className="home-hero-pagination" aria-label="选择展示图片">
              {homeSlides.map((image, index) => (
                <button
                  type="button"
                  key={image.src}
                  title={`第 ${index + 1} 张：${image.title}`}
                  aria-label={`第 ${index + 1} 张：${image.title}`}
                  aria-pressed={index === active}
                  aria-controls="home-hero-slides"
                  onClick={() => selectSlide(index)}
                ><span /></button>
              ))}
            </div>
            <div className="home-hero-controls">
              <span className="home-hero-counter" aria-live={paused ? "polite" : "off"} aria-atomic="true">
                {String(active + 1).padStart(2, "0")}<span> / 05</span>
              </span>
              <button
                type="button"
                title={controlPaused ? "播放" : "暂停"}
                aria-label={controlPaused ? "播放首页幻灯片" : "暂停首页幻灯片"}
                aria-pressed={controlPaused}
                onClick={togglePlayback}
              >
                {controlPaused ? <Play aria-hidden="true" size={17} /> : <Pause aria-hidden="true" size={17} />}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
