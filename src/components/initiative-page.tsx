import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { InitiativeLocalNav } from "@/components/initiative-local-nav";
import { PartnerNetworkMap } from "@/components/partners/partner-network-map";
import { PartnerWall } from "@/components/partners/partner-wall";
import { ProjectArt } from "@/components/project-art";
import { ServiceGallery } from "@/components/service-gallery";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { locations, type Initiative, type InitiativeItem } from "@/content/site";

type InitiativePageProps = {
  initiative: Initiative;
  item?: InitiativeItem;
};

export function InitiativePage({ initiative, item }: InitiativePageProps) {
  const isItemPage = Boolean(item);
  const title = item?.label ?? initiative.label;
  const description = item?.description ?? initiative.description;

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

        {!item && initiative.slug === "partners" ? (
          <>
            <PartnerWall />
            <PartnerNetworkMap locations={locations} />
          </>
        ) : null}

        <section className="initiative-note">
          <p>COLLABORATION NOTE</p>
          <h2>
            <span>这是一个独立的合作方向。具体内容</span>
            <span>与交付方式，需要在项目沟通后共同确认。</span>
          </h2>
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
