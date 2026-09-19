import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { RefractiveHero } from "@/components/refractive-hero";
import { ProjectStrip } from "@/components/project-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CompanyFilm } from "@/components/company-film";
import { HomeRecognition } from "@/components/home-recognition";
import { HomeServiceShowcase } from "@/components/home-service-showcase";
import { company, projects, services } from "@/content/site";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader home />
      <main id="main-content">
        <RefractiveHero />

        <section className="proof-band page-second-band" data-page-section="second" aria-label="公司概览">
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
              深耕行业<strong>{company.years.replace("+", "")}年</strong>，服务项目超<strong>{company.projectCount}</strong>
            </p>
            <p>
              案例遍布全国：<strong>{company.provinceCount}</strong>个省<strong>{company.cityCount}</strong>个城市
            </p>
          </div>
        </section>

        <CompanyFilm />

        <section className="selected-work" id="selected-work" aria-labelledby="selected-heading">
          <div className="section-heading split-heading">
            <h2 id="selected-heading">代表项目</h2>
            <p>从数字空间、数字文旅到数字影视、数字孪生和 AIGC，以下内容整理自晴蛙视觉科技画册。</p>
          </div>
          <div className="project-list">
            {projects.slice(0, 4).map((project, index) => (
              <ProjectStrip key={project.slug} project={project} index={index} />
            ))}
          </div>
          <Link className="text-link" href="/work">
            查看全部项目
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <section className="services-section" aria-labelledby="services-heading">
          <div className="services-banner">
            <h2 className="visually-hidden" id="services-heading">服务当下，影响未来</h2>
            <Image
              src="/home/mana.jpg"
              alt="晴蛙视觉服务横幅：服务当下，影响未来；影视动画、影视广告、数字文旅、数字展厅、智能数字研究院"
              width={1920}
              height={333}
              sizes="calc(100vw - 2 * var(--page-pad))"
              unoptimized
            />
          </div>
          <HomeServiceShowcase services={services} />
        </section>

        <HomeRecognition />

        <section className="manifesto-section">
          <p>从武汉出发，服务项目覆盖全国 19 个省、54 个城市及行政区。</p>
          <h2>品质第一，用心服务；专注客户，稳健发展。</h2>
          <Link href="/about">
            认识晴蛙视觉
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
