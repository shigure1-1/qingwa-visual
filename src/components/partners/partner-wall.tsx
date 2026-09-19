"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { partnerWallImages } from "@/content/partners";

const AUTOPLAY_DELAY = 3400;

export function HomePartnerWall() {
  return (
    <section className="home-partner-wall" aria-labelledby="home-partner-wall-heading">
      <div className="home-partner-wall-intro">
        <div className="home-partner-wall-intro-cn">
          <h2 id="home-partner-wall-heading">我们的客户</h2>
          <p>实现创新需求，赢得众多信任</p>
        </div>
        <div className="home-partner-wall-intro-en" lang="en">
          <strong>OUR CUSTOMERS</strong>
          <span>{"Realize  innovation  needs  and  win  numerous  trust"}</span>
        </div>
      </div>

      <div className="home-partner-wall-grid" role="list" aria-label="合作伙伴企业标志">
        {partnerWallImages.map((image) => (
          <figure className="home-partner-wall-item" role="listitem" key={image.id}>
            <Image
              src={image.src}
              alt={image.alt}
              width={449}
              height={195}
              sizes="(max-width: 580px) 24vw, (max-width: 900px) 16vw, 12vw"
            />
          </figure>
        ))}
      </div>

      <div className="home-partner-wall-note">
        <p>以上仅为部分，排名不分先后，期待与您的相遇……</p>
      </div>
      <div className="home-partner-wall-copy">
        <p>
          晴蛙视觉科技在核心价值观“品质第一、用心服务、专注客户、稳健发展”的引导下，
          不断创新，紧跟时代潮流。多元化的业务发展、行业内领先的
        </p>
        <p>
          技术支持，使公司创造了一个又一个令人激动的成功案例，收获了大批忠实客户与商业合作伙伴，
          开启了资源共享、合作共赢的新篇章……
        </p>
      </div>
    </section>
  );
}

export function PartnerWall() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const activeImage = partnerWallImages[activeIndex];

  const goTo = useCallback((nextIndex: number) => {
    setActiveIndex((nextIndex + partnerWallImages.length) % partnerWallImages.length);
    setHasImageError(false);
  }, []);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrevious = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setIsPlaying(!mediaQuery.matches);
    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);

    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (!isPlaying || partnerWallImages.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % partnerWallImages.length);
      setHasImageError(false);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    }
    if (event.key === " " || event.key === "Enter") {
      const target = event.target as HTMLElement;
      if (target.closest("button")) return;
      event.preventDefault();
      setIsPlaying((playing) => !playing);
    }
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
    setIsPlaying(false);
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (startX === null || endX === undefined) return;

    const distance = endX - startX;
    if (Math.abs(distance) < 42) return;
    if (distance < 0) goNext();
    else goPrevious();
  }

  return (
    <section className="partner-wall" aria-labelledby="partner-wall-heading">
      <div className="partner-wall-heading">
        <div>
          <p className="partner-wall-kicker">OPEN NETWORK / 64 IMAGES</p>
          <h2 id="partner-wall-heading">让合适的力量，在项目中相遇。</h2>
        </div>
        <p>
          这里展示来自合作网络的企业视觉素材。图片按编号保留原貌，不对合作关系、企业名称或项目成果做额外推断。
        </p>
      </div>

      <div
        className="partner-wall-stage"
        data-partner-wall
        tabIndex={0}
        role="group"
        aria-roledescription="图片轮播"
        aria-label="合作伙伴企业图片展示墙"
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="partner-wall-track"
          aria-live="polite"
          style={{ transform: `translate3d(-${activeIndex * (100 / partnerWallImages.length)}%, 0, 0)` }}
        >
          {partnerWallImages.map((image, index) => {
            const offset = (index - activeIndex + partnerWallImages.length) % partnerWallImages.length;
            const relativeOffset = offset > partnerWallImages.length / 2 ? offset - partnerWallImages.length : offset;
            const isActive = index === activeIndex;
            const isVisible = Math.abs(relativeOffset) <= 2;

            return (
              <div
                className="partner-wall-card"
                data-active={isActive}
                data-offset={relativeOffset}
                data-visible={isVisible}
                aria-hidden={!isActive}
                key={image.id}
              >
                {isActive && hasImageError ? (
                  <div className="partner-wall-error" role="img" aria-label={`${image.alt}加载失败`}>
                    <span>IMAGE {image.id}</span>
                    <strong>素材暂时无法显示</strong>
                  </div>
                ) : (
                  <Image
                    src={image.src}
                    alt={isActive ? image.alt : ""}
                    fill
                    sizes="(max-width: 580px) 100vw, 449px"
                    priority={index === 0}
                    onError={() => isActive && setHasImageError(true)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="partner-wall-controls" aria-label="展示墙控制">
          <button type="button" onClick={goPrevious} aria-label="上一张合作伙伴素材">
            <ArrowLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="partner-wall-play"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? "暂停自动播放" : "继续自动播放"}
            aria-pressed={!isPlaying}
          >
            {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>
          <button type="button" onClick={goNext} aria-label="下一张合作伙伴素材">
            <ArrowRight aria-hidden="true" />
          </button>
          <span className="partner-wall-counter" aria-live="off">
            {activeImage.id} / {String(partnerWallImages.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="partner-wall-index" aria-label="选择合作伙伴素材">
        {partnerWallImages.map((image, index) => (
          <button
            type="button"
            key={image.id}
            className="partner-wall-index-button"
            data-active={index === activeIndex}
            aria-label={`查看合作伙伴素材 ${image.id}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => {
              goTo(index);
              setIsPlaying(false);
            }}
          >
            <Image
              src={image.src}
              alt=""
              fill
              sizes="(max-width: 580px) 22vw, (max-width: 900px) 14vw, 10vw"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
