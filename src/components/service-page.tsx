import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ProjectArt } from "@/components/project-art";
import { ProjectStrip } from "@/components/project-strip";
import { ServiceGallery } from "@/components/service-gallery";
import { ServiceFilmRails } from "@/components/service-film-rails";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ServiceLocalNav } from "@/components/service-local-nav";
import { ServiceHeroVideo } from "@/components/tourism-hero-video";
import { projects, type Service, type ServiceItem } from "@/content/site";
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
};

export function ServicePage({ service, item }: ServicePageProps) {
  const relatedProjects = projects.filter((project) => project.category === service.category).slice(0, 3);
  const currentIndex = item ? service.items.findIndex((candidate) => candidate.slug === item.slug) : -1;
  const nextItem = item ? service.items[(currentIndex + 1) % service.items.length] : service.items[0];
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
        <section className="service-hero">
          <div className="service-hero-copy">
            {item && (
              <Link className="service-back" href={`/services/${service.slug}`}>
                <ArrowLeft aria-hidden="true" />
                返回{service.title}
              </Link>
            )}
            <span className="service-eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p className="service-english">{item ? service.englishTitle : service.englishTitle}</p>
            <p className="service-summary">{description}</p>
            <Link className="service-action" href={`/contact?topic=${encodeURIComponent(service.title)}`}>
              讨论一个项目
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className={`service-hero-art${heroVideo ? " service-hero-art-tourism" : ""}`}>
            {heroVideo ? (
              <>
                <ProjectArt
                  type={service.art}
                  accent={service.accent}
                  secondary={service.secondary}
                />
                <ServiceHeroVideo {...heroVideo} />
              </>
            ) : (
              <ProjectArt
                type={service.art}
                accent={service.accent}
                secondary={service.secondary}
                title={title}
              />
            )}
          </div>
        </section>

        <section className="service-statement page-second-band" data-page-section="second">
          <div>
            <span>{item ? "SERVICE ITEM" : "SERVICE SYSTEM"}</span>
            <h2>{item ? service.heroDescription : service.description}</h2>
          </div>
          <p>以下内容是晴蛙视觉对服务方向的工作定义，具体范围、媒介和交付节点以项目沟通后的确认文件为准。</p>
        </section>

        {gallery && (
          <ServiceGallery
            eyebrow={galleryEyebrow}
            gallery={gallery}
            headingId={galleryHeadingId}
            layout={galleryLayout}
            title={title}
          />
        )}

        {!item && (service.slug === "digital-film" || service.slug === "digital-animation") && (
          <ServiceFilmRails service={service} />
        )}

        {!item && (
          <section className="service-capabilities" aria-labelledby="service-capabilities-heading">
            <div className="service-section-heading">
              <span>CAPABILITY / FRAME</span>
              <h2 id="service-capabilities-heading">从问题到现场，建立一套完整视角。</h2>
            </div>
            <ol>
              {service.capabilities.map((capability, index) => (
                <li key={capability}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{capability}</h3>
                </li>
              ))}
            </ol>
          </section>
        )}

        {item ? (
          <section className="service-item-detail page-second-band" data-page-section="second" aria-labelledby="service-item-detail-heading">
            <div>
              <span>{service.title} / {item.label}</span>
              <h2 id="service-item-detail-heading">把这个方向变成可观看、可沟通、可落地的内容。</h2>
            </div>
            <p>{item.description}</p>
          </section>
        ) : (
          <section
            className={`service-subnav${subnavBanner ? " service-subnav-with-banner" : ""}`}
            aria-labelledby="service-subnav-heading"
          >
            {subnavBanner ? (
              <div className="service-subnav-banner" data-service={service.slug}>
                <h2 className="visually-hidden" id="service-subnav-heading">{service.title}服务方向</h2>
                <Image
                  src={subnavBanner.src}
                  alt={subnavBanner.alt}
                  width={1920}
                  height={520}
                  sizes="calc(100vw - 2 * var(--page-pad))"
                  unoptimized
                />
              </div>
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

        {relatedProjects.length > 0 && (
          <section className="service-projects" aria-labelledby="service-projects-heading">
            <div className="service-section-heading split-heading">
              <div>
                <span>WORK / ARCHIVE</span>
                <h2 id="service-projects-heading">相关代表项目</h2>
              </div>
              <p>这些项目按业务大类整理自晴蛙视觉画册。它们展示方向参考，不代表每个子服务均有对应的客户成果。</p>
            </div>
            <div className="project-list">
              {relatedProjects.map((project, index) => (
                <ProjectStrip key={project.slug} project={project} index={index} />
              ))}
            </div>
            <Link className="text-link" href={`/work?category=${encodeURIComponent(service.category)}`}>
              查看该类全部项目
              <ArrowRight aria-hidden="true" />
            </Link>
          </section>
        )}

        <Link className="service-next" href={`/services/${service.slug}/${item ? nextItem.slug : service.items[0].slug}`}>
          <span>{item ? "下一个服务方向" : "先从一个具体方向开始"}</span>
          <strong>{item ? nextItem.label : service.items[0].label}</strong>
          <ArrowRight aria-hidden="true" />
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
