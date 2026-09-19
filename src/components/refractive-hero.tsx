"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import type { MouseEvent } from "react";

export function RefractiveHero() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 80, damping: 18, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 80, damping: 18, mass: 0.7 });
  const markX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const markY = useTransform(smoothY, [-1, 1], [-12, 12]);
  const shardX = useTransform(smoothX, [-1, 1], [24, -24]);
  const shardY = useTransform(smoothY, [-1, 1], [10, -10]);

  function handleMove(event: MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1);
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
  }

  return (
    <section className="refractive-hero" onMouseMove={handleMove} onMouseLeave={() => {
      pointerX.set(0);
      pointerY.set(0);
    }}>
      <div className="hero-calibration" aria-hidden="true">
        <span>QW / OPTICAL FIELD</span>
        <span>30.2741° N</span>
        <span>FRAME 001</span>
      </div>

      <div className="hero-copy">
        <h1>
          一眼所见
          <span>从此不同</span>
        </h1>
        <p>
          晴蛙视觉以空间、影像与智能内容，
          <br />
          为每一次看见建立独特的视角。
        </p>
        <Link className="hero-action" href="/work">
          查看作品
          <ArrowDownRight aria-hidden="true" />
        </Link>
      </div>

      <div className="hero-optics" aria-hidden="true">
        <motion.div className="spectrum-shard spectrum-shard-coral" style={{ x: shardX, y: shardY }} />
        <motion.div className="spectrum-shard spectrum-shard-teal" style={{ x: markX, y: shardY }} />
        <motion.div className="spectrum-shard spectrum-shard-white" style={{ x: shardX, y: markY }} />
        <motion.div className="hero-mark" style={{ x: reduceMotion ? 0 : markX, y: reduceMotion ? 0 : markY }}>
          <Image src="/brand/qingwa-mark.webp" alt="" fill sizes="(max-width: 900px) 80vw, 52vw" priority />
        </motion.div>
        <div className="hero-lens" />
      </div>

      <a className="scroll-cue" href="#selected-work">
        向下观看
        <span aria-hidden="true" />
      </a>
    </section>
  );
}
