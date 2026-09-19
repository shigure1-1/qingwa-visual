"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ServiceHeroVideoProps = {
  ariaLabel: string;
  metaLabel: string;
  posterAlt: string;
  posterSrc: string;
  videoSrc: string;
};

export function ServiceHeroVideo({
  ariaLabel,
  metaLabel,
  posterAlt,
  posterSrc,
  videoSrc,
}: ServiceHeroVideoProps) {
  const [open, setOpen] = useState(false);
  const [overlayHost, setOverlayHost] = useState<HTMLElement | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const openVideo = () => {
    const hero = triggerRef.current?.closest<HTMLElement>(".service-hero");
    if (!hero) return;

    previewRef.current?.pause();
    setOverlayHost(hero);
    setOpen(true);
  };

  const startPreview = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    void previewRef.current?.play().catch(() => undefined);
  };

  const stopPreview = () => {
    const preview = previewRef.current;
    if (!preview) return;

    preview.pause();
    preview.currentTime = 0;
  };

  const close = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    void videoRef.current?.play().catch(() => undefined);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="tourism-hero-video">
      <button
        ref={triggerRef}
        className="tourism-hero-video-trigger"
        type="button"
        onClick={openVideo}
        onPointerEnter={startPreview}
        onPointerLeave={stopPreview}
        aria-label={`在首栏播放${ariaLabel}`}
      >
        <Image
          className="tourism-hero-video-poster tourism-hero-video-poster-base"
          src={posterSrc}
          alt={posterAlt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 62vw"
        />
        <span className="tourism-hero-video-reveal" aria-hidden="true">
          <video
            ref={previewRef}
            className="tourism-hero-video-preview"
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </span>
        <span className="tourism-hero-video-lens" aria-hidden="true">
          <span className="tourism-lens-glare" />
          <span className="tourism-lens-panel tourism-lens-panel-a" />
          <span className="tourism-lens-panel tourism-lens-panel-b" />
          <span className="tourism-lens-panel tourism-lens-panel-c" />
        </span>
        <span className="tourism-hero-video-expand" aria-hidden="true">
          <Maximize2 aria-hidden="true" />
        </span>
      </button>

      {open && overlayHost && createPortal(
        <section
          className="tourism-video-overlay"
          aria-label={ariaLabel}
        >
          <div className="tourism-video-overlay-heading">
            <span>{metaLabel}</span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="关闭影片"
              title="关闭"
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <video
            ref={videoRef}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster={posterSrc}
            aria-label={ariaLabel}
          >
            <source src={videoSrc} type="video/mp4" />
            您的浏览器不支持 HTML 视频播放。
          </video>
        </section>,
        overlayHost,
      )}
    </div>
  );
}
