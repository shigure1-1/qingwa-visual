import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InitiativeLocalNav } from "@/components/initiative-local-nav";
import { PartnerWall } from "@/components/partners/partner-wall";
import { ProjectArt } from "@/components/project-art";
import { ServiceGallery } from "@/components/service-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Initiative, InitiativeItem } from "@/content/site";

type InitiativePageProps = {
  initiative: Initiative;
  item?: InitiativeItem;
};

export function InitiativePage({ initiative, item }: InitiativePageProps) {
  const isItemPage = Boolean(item);
  const currentIndex = item ? initiative.items?.findIndex((candidate) => candidate.slug === item.slug) ?? -1 : -1;
  const nextItem = item && initiative.items?.length
    ? initiative.items[(currentIndex + 1) % initiative.items.length]
    : undefined;
  const title = item?.label ?? initiative.label;
  const description = item?.description ?? initiative.description;
  const directionSection = !item ? (
    <section className="initiative-directions page-second-band" data-page-section="second" aria-labelledby="initiative-directions-heading">
      <div className="service-section-heading">
        <span>OPEN / DIRECTIONS</span>
        <h2 id="initiative-directions-heading">把新的可能，整理成可以开始的合作。</h2>
      </div>
      <div className="initiative-direction-list">
        {initiative.directions.map((direction, index) => (
          <article key={direction}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{direction}</h3>
            <p>从目标、场景与参与方式开始确认，再决定适合的内容、技术和协作节奏。</p>
          </article>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <main className={`initiative-page ${isItemPage ? "initiative-item-page" : ""}`} id="main-content">
        {initiative.items?.length ? (
          <InitiativeLocalNav initiative={initiative} currentItem={item?.slug} />
        ) : null}

        <section className="service-hero initiative-hero">
          <div className="service-hero-copy">
            <Link className="service-back" href={isItemPage ? `/${initiative.slug}` : "/"}>
              <ArrowLeft aria-hidden="true" />
              {isItemPage ? `返回${initiative.label}` : "返回首页"}
            </Link>
            <span className="service-eyebrow">
              {isItemPage ? `${initiative.label} / AGI ITEM` : `${initiative.label} / INITIATIVE`}
            </span>
            <h1>{title}</h1>
            <p className="service-english">{initiative.englishTitle}</p>
            <p className="service-summary">{description}</p>
            <Link className="service-action" href={`/contact?topic=${encodeURIComponent(item?.label ?? initiative.topic)}`}>
              讨论合作方式
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="service-hero-art">
            <ProjectArt
              type={initiative.art}
              accent={initiative.accent}
              secondary={initiative.secondary}
              title={title}
            />
          </div>
        </section>

        {!item && initiative.gallery ? (
          <ServiceGallery
            eyebrow={`${initiative.label} / ARCHIVE`}
            gallery={initiative.gallery}
            headingId={`initiative-gallery-${initiative.slug}-heading`}
            layout={initiative.galleryLayout ?? "standard"}
            title={initiative.label}
          />
        ) : null}

        {item ? (
          <section className="service-item-detail page-second-band" data-page-section="second" aria-labelledby="initiative-item-detail-heading">
            <div>
              <span>{initiative.label} / {item.label}</span>
              <h2 id="initiative-item-detail-heading">把这个方向整理成可以开始确认的工作路径。</h2>
            </div>
            <p>{item.description}</p>
          </section>
        ) : initiative.slug !== "partners" ? directionSection : null}

        {!item && initiative.slug === "partners" && <PartnerWall />}

        {initiative.slug === "partners" ? directionSection : null}

        {nextItem ? (
          <Link className="service-next" href={`/${initiative.slug}/${nextItem.slug}`}>
            <span>下一个 AGI 子业务</span>
            <strong>{nextItem.label}</strong>
            <ArrowRight aria-hidden="true" />
          </Link>
        ) : null}

        <section className="initiative-note">
          <p>COLLABORATION NOTE</p>
          <h2>这是一个独立的合作方向。具体内容与交付方式，需要在项目沟通后共同确认。</h2>
          <Link className="text-link" href={`/contact?topic=${encodeURIComponent(item?.label ?? initiative.topic)}`}>
            生成合作简报
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
