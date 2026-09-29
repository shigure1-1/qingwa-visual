import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { ProjectArt } from "@/components/project-art";
import { ServiceGallery } from "@/components/service-gallery";
import { ServiceFilmWall } from "@/components/service-film-wall";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ServiceLocalNav } from "@/components/service-local-nav";
import { ServiceHeroVideo } from "@/components/tourism-hero-video";
import { company, type Service, type ServiceItem } from "@/content/site";
import { mediaUrl } from "@/lib/media-url";

type ServicePageProps = {
  service: Service;
  item?: ServiceItem;
};

const serviceHeroVideos: Record<string, {
  ariaLabel: string;
  metaLabel: string;
  posterAlt: string;
  posterSrc: string;
  videoSrc: string;
}> = {
  "digital-tourism": {
    ariaLabel: "晴蛙视觉数字文旅作品影片",
    metaLabel: "DIGITAL TOURISM / SHOWREEL",
    posterAlt: "数字文旅项目影片画面",
    posterSrc: "/services/digital-tourism/media/digital-tourism-showreel-poster.jpg",
    videoSrc: mediaUrl("/services/digital-tourism/media/digital-tourism-showreel.mp4"),
  },
  "digital-film": {
    ariaLabel: "晴蛙视觉数字影视作品影片",
    metaLabel: "DIGITAL FILM / SHOWREEL",
    posterAlt: "数字影视广告作品影片画面",
    posterSrc: "/services/digital-film/media/digital-film-showreel-poster.jpg",
    videoSrc: mediaUrl("/services/digital-film/media/digital-film-showreel.mp4"),
  },
};

const serviceSubnavBanners: Record<string, { src: string; alt: string }> = {
  "digital-space": {
    src: "/services/digital-space/detail-services-banner.jpg",
    alt: "数字展厅服务横幅：助力中国视觉影响世界文化，展示数字展厅服务与 2023 中国农民春晚项目画面",
  },
  "digital-tourism": {
    src: "/services/digital-tourism/detail-services-banner.jpg",
    alt: "数字文旅服务横幅：用数字定义文旅未来，展示 2023 年 QQ 飞车手游亚洲杯总决赛现场",
  },
  "digital-film": {
    src: "/services/digital-film/detail-services-banner.jpg",
    alt: "影视广告服务横幅：服务当下，影响未来，展示梵天都市半城伴山唯美篇画面",
  },
  "digital-animation": {
    src: "/services/digital-animation/detail-services-banner.jpg",
    alt: "影视动画服务横幅：一眼所见，从此不同，展示月夜水景中的动画场景",
  },
  aigc: {
    src: "/services/aigc/detail-services-banner.jpg",
    alt: "AIGC 服务横幅：青蛙造型角色驾驶飞行器穿行于未来城市",
  },
};

export function ServicePage({ service, item }: ServicePageProps) {
  const title = item?.label ?? service.title;
  const description = item?.description ?? service.heroDescription;
  const eyebrow = item ? `${service.title} / SERVICE ITEM` : `${service.title} / SERVICE`;
  const galleryEyebrow = `${service.englishTitle.replace(/^DIGITAL\s+/, "")} / ARCHIVE`;
  const galleryHeadingId = `service-gallery-${service.slug}${item ? `-${item.slug}` : ""}-heading`;
  const gallery = item ? item.gallery : service.gallery;
  const galleryLayout = item ? item.galleryLayout ?? "standard" : service.galleryLayout ?? "standard";
  const subnavBanner = serviceSubnavBanners[service.slug];
  const heroVideo = item ? undefined : serviceHeroVideos[service.slug];

  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <main
        className={`service-page ${item ? "service-item-page" : "service-parent-page"}`}
        data-service={service.slug}
        id="main-content"
      >
        <ServiceLocalNav service={service} currentItem={item?.slug} />
        {!item && subnavBanner ? (
          <section
            className="service-hero service-hero-banner"
            data-service={service.slug}
            aria-labelledby="service-hero-heading"
          >
            <h1 className="visually-hidden" id="service-hero-heading">{title}</h1>
            <Image
              src={subnavBanner.src}
              alt={subnavBanner.alt}
              fill
              priority
              sizes="100vw"
              unoptimized
            />
          </section>
        ) : (
          <section className={`service-hero${!item ? " service-hero-static-art" : ""}`}>
            <div className="service-hero-copy">
              {item && (
                <Link className="service-back" href={`/services/${service.slug}`}>
                  <ArrowLeft aria-hidden="true" />
                  返回{service.title}
                </Link>
              )}
              <span className="service-eyebrow">{eyebrow}</span>
              <h1>{title}</h1>
              <p className="service-english">{service.englishTitle}</p>
              <p className="service-summary">{description}</p>
              <Link className="service-action" href={`/contact?topic=${encodeURIComponent(service.title)}`}>
                讨论一个项目
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="service-hero-art">
              <ProjectArt
                type={service.art}
                accent={service.accent}
                secondary={service.secondary}
                title={title}
              />
            </div>
          </section>
        )}

        <section className="proof-band page-second-band" data-page-section="second" aria-label={`${service.title}服务概览`}>
          <div className="proof-band-intro">
            <p className="proof-band-credentials">
              <span>创新代数字化视觉服务商</span>
              <span>综合数字影像全案供应商</span>
              <span>百强地产优质视觉制作商</span>
            </p>
            <p className="proof-band-promise">持续多年为全球盛荟提供视觉服务</p>
          </div>
          <div className="proof-band-results">
            <p>
              深耕行业<CountUp value={company.years.replace("+", "")} />年，服务项目超<CountUp value={company.projectCount.replace("+", "")} suffix="+" />
            </p>
            <p>
              案例遍布全国：<CountUp value={company.provinceCount} />个省<CountUp value={company.cityCount} />个城市
            </p>
          </div>
        </section>

        {heroVideo && (
          <section
            className="service-showreel"
            data-video-host
            aria-label={heroVideo.ariaLabel}
          >
            <ServiceHeroVideo {...heroVideo} />
          </section>
        )}

        {gallery && (
          <ServiceGallery
            browserVariant={item && service.slug === "digital-film" ? "four-up-disclosure" : undefined}
            eyebrow={galleryEyebrow}
            gallery={gallery}
            headingId={galleryHeadingId}
            layout={galleryLayout}
            title={title}
          />
        )}

        {!item && (service.slug === "digital-film" || service.slug === "digital-animation") && (
          <ServiceFilmWall service={service} />
        )}

        {!item && (
          <section
            className={`service-subnav${subnavBanner ? " service-subnav-compact" : ""}`}
            aria-labelledby="service-subnav-heading"
          >
            {subnavBanner ? (
              <h2 className="visually-hidden" id="service-subnav-heading">{service.title}服务方向</h2>
            ) : (
              <div className="service-section-heading">
                <span>DETAIL / SERVICES</span>
                <h2 id="service-subnav-heading">选择一个具体方向继续查看。</h2>
              </div>
            )}
            <div className="service-subnav-list">
              {service.items.map((serviceItem, index) => (
                <Link key={serviceItem.slug} href={`/services/${service.slug}/${serviceItem.slug}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{serviceItem.label}</strong>
                  <p>{serviceItem.description}</p>
                  <ArrowRight aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
      <SiteFooter />
    </>
  );
}
