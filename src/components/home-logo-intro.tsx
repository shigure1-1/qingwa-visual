"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect } from "react";

const INTRO_KEY = "qingwa-home-intro-seen";
const INTRO_FALLBACK_MS = 4900;

export function HomeLogoIntro({ onComplete }: { onComplete: () => void }) {
  const finish = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_KEY, "true");
    } catch {
      // The intro still finishes when browser storage is unavailable.
    }
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(INTRO_KEY) === "true";
    } catch {
      // Storage is optional; animation never gates access to the page.
    }
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const skip = alreadySeen || motionQuery.matches || window.scrollY > 80 || Boolean(window.location.hash);
    const frame = skip ? window.requestAnimationFrame(finish) : null;
    const timeout = window.setTimeout(finish, INTRO_FALLBACK_MS);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Tab") finish();
    };
    const handleMotionChange = () => { if (motionQuery.matches) finish(); };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("wheel", finish, { passive: true });
    window.addEventListener("touchstart", finish, { passive: true });
    motionQuery.addEventListener("change", handleMotionChange);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("wheel", finish);
      window.removeEventListener("touchstart", finish);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [finish]);

  return (
    <div
      className="home-logo-intro"
      aria-label="晴蛙视觉开屏"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === "home-intro-exit") finish();
      }}
    >
      <div className="home-logo-intro-spectrum" aria-hidden="true">
        <span className="home-logo-intro-plane home-logo-intro-plane--teal" />
        <span className="home-logo-intro-plane home-logo-intro-plane--coral" />
        <span className="home-logo-intro-plane home-logo-intro-plane--acid" />
        <span className="home-logo-intro-axis home-logo-intro-axis--horizontal" />
        <span className="home-logo-intro-axis home-logo-intro-axis--vertical" />
        <span className="home-logo-intro-orbit" />
      </div>
      <div className="home-logo-intro-brand">
        <Image
          className="home-logo-intro-mark"
          src="/brand/qingwa-mark.webp"
          alt="晴蛙视觉折面青蛙标志"
          width={480}
          height={480}
          sizes="(max-width: 580px) 56vw, 320px"
          loading="eager"
        />
        <p>晴蛙视觉</p>
        <span>一眼所见，从此不同</span>
      </div>
      <button type="button" className="home-logo-intro-skip" onClick={finish}>
        跳过 <ArrowRight aria-hidden="true" size={18} />
      </button>
    </div>
  );
}
