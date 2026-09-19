"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const desktopPoster = "/home/qingwa-company-showreel-poster.jpg";
const mobilePoster = "/home/qingwa-company-showreel-poster-mobile.jpg";

export function CompanyFilm() {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasSnappedRef = useRef(false);
  const [posterSrc, setPosterSrc] = useState(desktopPoster);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 900px)");
    const syncPoster = () => setPosterSrc(mobileQuery.matches ? mobilePoster : desktopPoster);

    syncPoster();
    mobileQuery.addEventListener("change", syncPoster);
    return () => mobileQuery.removeEventListener("change", syncPoster);
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    const video = videoRef.current;
    if (!player || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastScrollY = window.scrollY;
    let scrollingDown = true;
    let playerVisible = false;

    const trackScrollDirection = () => {
      const nextScrollY = window.scrollY;
      if (Math.abs(nextScrollY - lastScrollY) > 2) {
        scrollingDown = nextScrollY > lastScrollY;
      }
      lastScrollY = nextScrollY;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        playerVisible = entry.isIntersecting && entry.intersectionRatio >= 0.18;

        if (playerVisible) {
          video.muted = true;
          void video.play().catch(() => undefined);

          if (!hasSnappedRef.current && scrollingDown) {
            hasSnappedRef.current = true;
            player.scrollIntoView({
              behavior: reducedMotion ? "auto" : "smooth",
              block: "start",
            });
          }
          return;
        }

        if (!entry.isIntersecting) video.pause();
      },
      {
        rootMargin: "0px 0px -18% 0px",
        threshold: [0, 0.18],
      },
    );

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else if (playerVisible) {
        void video.play().catch(() => undefined);
      }
    };

    window.addEventListener("scroll", trackScrollDirection, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    observer.observe(player);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", trackScrollDirection);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section className="company-film" aria-labelledby="company-film-heading">
      <div className="company-film-copy">
        <div className="company-film-heading-row">
          <div className="company-film-heading-copy">
            <span className="company-film-eyebrow">QINGWA VISUAL / SHOWREEL</span>
            <h2 id="company-film-heading">服务当下，影响未来。</h2>
          </div>
          <div className="company-film-brand-meta">
            <Image
              className="company-film-logo"
              src="/brand/qingwa-lockup-2026-cropped.webp"
              alt="晴蛙视觉企业标识"
              width={1304}
              height={292}
              sizes="(max-width: 580px) 28vw, (max-width: 900px) 22vw, 13rem"
            />
            <time dateTime="2026">2026</time>
          </div>
        </div>
        <p>晴蛙视觉企业宣传片，记录我们从空间、影像到数字内容的观看方式。</p>
      </div>
      <div className="company-film-player" ref={playerRef}>
        <video
          ref={videoRef}
          controls
          muted
          playsInline
          preload="metadata"
          poster={posterSrc}
          aria-label="晴蛙视觉企业宣传片"
        >
          <source
            media="(max-width: 900px)"
            src="/home/qingwa-company-showreel-2024-mobile.mp4"
            type="video/mp4"
          />
          <source src="/home/qingwa-company-showreel-2024.mp4" type="video/mp4" />
          您的浏览器不支持 HTML 视频播放。
        </video>
      </div>
    </section>
  );
}
