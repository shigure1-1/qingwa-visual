import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AboutHonorsGallery } from "@/components/about-honors-gallery";
import { AboutHistoryTimeline } from "@/components/about-history-timeline";
import { AboutLocalNav } from "@/components/about-local-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company, services } from "@/content/site";

export const metadata: Metadata = {
  title: "关于",
  description: "认识晴蛙视觉的品牌视角与工作方式。",
};

export default function AboutPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <main className="inner-main" id="main-content">
        <AboutLocalNav />
        <div id="about-overview">
          <section className="page-intro about-intro" data-team-photo="/about/personnel/team-photo.png">
            <div className="about-intro-copy">
              <span>ABOUT / QINGWA VISUAL</span>
              <h1>先看见不同，<br />再让不同被看见。</h1>
            </div>
            <p>{company.summary} {company.englishName} 成立于 {company.established} 年，持续服务企业、政府、学校和文旅项目。</p>
          </section>
        </div>

        <section className="company-profile" aria-labelledby="company-profile-heading">
          <header className="company-profile-heading">
            <div>
              <h2 id="company-profile-heading">企业简介</h2>
              <p>{company.slogan}</p>
            </div>
            <p>{company.profile.overview}</p>
          </header>

          <dl className="company-profile-record" aria-label="公司概览">
            <div className="company-profile-history-record" id="about-history">
              <div className="company-profile-history-label">
                <span className="company-profile-history-kicker">HISTORY / RECORDED</span>
                <dt>发展历程</dt>
              </div>
              <div className="company-profile-history-content">
                <AboutHistoryTimeline />
              </div>
            </div>
            <div>
              <dt>项目案例</dt>
              <dd>{company.projectCount}</dd>
            </div>
            <div>
              <dt>服务覆盖</dt>
              <dd>{company.provinceCount} 省 / {company.cityCount} 城市及行政区</dd>
            </div>
          </dl>

          <div className="company-profile-entities">
            {company.profile.entities.map((entity) => (
              <article className="company-profile-entity" data-tone={entity.tone} key={entity.name}>
                <div className="company-profile-entity-heading">
                  <h3>{entity.name}</h3>
                  <p>{entity.qualification}</p>
                </div>
                <div className="company-profile-entity-content">
                  <p>{entity.description}</p>
                  <dl>
                    {entity.details.map((detail) => (
                      <div key={detail.title}>
                        <dt>{detail.title}</dt>
                        <dd>{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-belief page-second-band" data-page-section="second">
          <p>视觉不是最后才加上的一层包装。</p>
          <h2>它决定信息如何被理解，品牌如何被记住，以及一次观看能否留下变化。</h2>
        </section>

        <section className="about-personnel-band" id="about-personnel" aria-labelledby="about-personnel-heading">
          <div>
            <span>PEOPLE / IN PROGRESS</span>
            <h2 id="about-personnel-heading">人员介绍</h2>
          </div>
        </section>

        <section className="about-honors" id="about-honors" aria-labelledby="about-honors-heading">
          <div className="about-section-heading">
            <span>RECOGNITION / TO VERIFY</span>
            <h2 id="about-honors-heading">企业荣誉</h2>
          </div>
          <div className="about-honors-content">
            <p>以下图片按用户提供的文件夹名称与编号归档，不等同于已独立核验的奖项清单；准确名称、所属主体、颁发机构、年份与证明文件需逐项确认。</p>
            <ul>
              {company.credentials.map((credential) => <li key={credential}>{credential}</li>)}
            </ul>
          </div>
          <AboutHonorsGallery />
        </section>

        <section className="about-services" aria-labelledby="about-services-heading">
          <h2 id="about-services-heading">工作范围</h2>
          <div>
            {services.map((service) => (
              <article key={service.title}>
                <h3><Link href={`/services/${service.slug}`}>{service.title}</Link></h3>
                <p>{service.description}</p>
                <ul aria-label={`${service.title}服务项目`}>
                  {service.items.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/services/${service.slug}/${item.slug}`}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="about-close">
          <h2>带着一个问题来，<br />我们一起找到它的视角。</h2>
          <Link href="/contact">
            准备合作简报
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
