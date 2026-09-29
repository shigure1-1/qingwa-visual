import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHeroSlideshow } from "@/components/home-hero-slideshow";
import { ProjectStrip } from "@/components/project-strip";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CompanyFilm } from "@/components/company-film";
import { HomeRecognition } from "@/components/home-recognition";
import { HomeServiceShowcase } from "@/components/home-service-showcase";
import { CountUp } from "@/components/count-up";
import { company, projects, services } from "@/content/site";
import "./home-hero.css";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader home />
      <main id="main-content">
        <HomeHeroSlideshow />

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
              深耕行业<CountUp value={company.years.replace("+", "")} />年，服务项目超<CountUp value={company.projectCount.replace("+", "")} suffix="+" />
            </p>
            <p>
              案例遍布全国：<CountUp value={company.provinceCount} />个省<CountUp value={company.cityCount} />个城市
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

        <section className="services-section" id="services" aria-labelledby="services-heading">
          <h2 className="visually-hidden" id="services-heading">服务体系</h2>
          <HomeServiceShowcase services={services} />
        </section>

        <HomeRecognition />

        <section className="manifesto-section">
          <p>从武汉出发，服务项目覆盖全国 19 个省、54 个城市及行政区。</p>
          <h2>品质第一，用心服务；专注客户，稳健发展。</h2>
          <Link href="/about">
            关于晴蛙
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
