"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { honorGroups } from "@/content/about-honors";
import type { HonorImage } from "@/content/about-honors";

function HonorImageTile({ image }: { image: HonorImage }) {
  return (
    <figure
      className="honor-item service-gallery-tile"
      data-honor-kind={image.kind}
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={image.kind === "trophy"
          ? "(max-width: 580px) 50vw, (max-width: 900px) 25vw, 24vw"
          : "(max-width: 580px) 50vw, (max-width: 900px) 33vw, 16vw"}
      />
    </figure>
  );
}

type HonorTrackProps = {
  images: HonorImage[];
  ariaLabel: string;
  variant?: "enterprise" | "archive";
};

export function HonorTrack({ images, ariaLabel, variant = "enterprise" }: HonorTrackProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let direction = 1;
    let position = scroll.scrollLeft;
    let frame = 0;
    let lastTime = performance.now();
    let paused = false;

    const setPaused = (nextPaused: boolean) => {
      position = scroll.scrollLeft;
      paused = nextPaused;
      if (!paused) lastTime = performance.now();
    };

    const handlePointerEnter = () => setPaused(true);
    const handlePointerLeave = () => setPaused(false);
    const handleFocusIn = () => setPaused(true);
    const handleFocusOut = () => setPaused(false);

    const tick = (time: number) => {
      const delta = Math.min(time - lastTime, 48);
      lastTime = time;
      const maxScroll = scroll.scrollWidth - scroll.clientWidth;

      if (!paused && maxScroll > 0) {
        position += direction * delta * 0.018;
        if (position >= maxScroll) {
          position = maxScroll;
          direction = -1;
        } else if (position <= 0) {
          position = 0;
          direction = 1;
        }
        scroll.scrollLeft = position;
      }

      frame = window.requestAnimationFrame(tick);
    };

    scroll.addEventListener("pointerenter", handlePointerEnter);
    scroll.addEventListener("pointerleave", handlePointerLeave);
    scroll.addEventListener("focusin", handleFocusIn);
    scroll.addEventListener("focusout", handleFocusOut);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      scroll.removeEventListener("pointerenter", handlePointerEnter);
      scroll.removeEventListener("pointerleave", handlePointerLeave);
      scroll.removeEventListener("focusin", handleFocusIn);
      scroll.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <div
      className="honor-enterprise-scroll"
      data-honor-track={variant}
      ref={scrollRef}
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <div className="honor-grid honor-grid-enterprise">
        {images.map((image) => <HonorImageTile image={image} key={image.src} />)}
      </div>
    </div>
  );
}

export function EnterpriseHonorTrack({ images }: { images: HonorImage[] }) {
  return <HonorTrack images={images} ariaLabel="企业荣誉横向图片列表，自动滚动" />;
}

export function AboutHonorsGallery() {
  return (
    <div className="about-honors-gallery" aria-label="企业荣誉图片档案">
      {honorGroups.map((group) => {
        const isEnterprise = group.slug === "enterprise";

        return (
          <section
            className="honor-group"
            data-honor-group={group.slug}
            key={group.slug}
            aria-label={isEnterprise ? `${group.label}图片` : undefined}
            aria-labelledby={isEnterprise ? undefined : `honor-group-${group.slug}`}
          >
            {!isEnterprise && (
              <div className="honor-group-heading">
                <div>
                  <h3 id={`honor-group-${group.slug}`}>{group.label}</h3>
                </div>
                <strong>{String(group.images.length).padStart(2, "0")} / IMAGES</strong>
              </div>
            )}

            {isEnterprise ? (
              <EnterpriseHonorTrack images={group.images} />
            ) : (
              <div className="honor-grid">
                {group.images.map((image) => <HonorImageTile image={image} key={image.src} />)}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
