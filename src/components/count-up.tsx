"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: string;
  suffix?: string;
};

export function CountUp({ value, suffix = "" }: CountUpProps) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLElement>(null);
  const startOnHoverRef = useRef<(() => void) | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const target = Number(value);
    const duration = 1100;
    let hasEnteredViewport = false;
    let start = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frameRef.current = requestAnimationFrame(() => setDisplay(value));
      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      };
    }

    const tick = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(String(Math.round(target * eased)));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else frameRef.current = null;
    };

    const animate = (restart: boolean) => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      start = 0;
      if (restart) setDisplay("0");
      frameRef.current = requestAnimationFrame(tick);
    };

    startOnHoverRef.current = () => animate(true);

    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) {
      animate(false);
      return () => {
        startOnHoverRef.current = null;
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasEnteredViewport) {
        hasEnteredViewport = true;
        animate(false);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      startOnHoverRef.current = null;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return (
    <strong
      ref={ref}
      style={{ width: `${value.length + suffix.length}ch` }}
      onPointerEnter={() => startOnHoverRef.current?.()}
    >
      {display}{suffix}
    </strong>
  );
}
