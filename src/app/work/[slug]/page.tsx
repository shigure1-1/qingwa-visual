import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectArt } from "@/components/project-art";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { projects } from "@/content/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project
    ? { title: project.title, description: project.summary }
    : { title: "未找到项目" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <SiteHeader />
      <main className="project-page" id="main-content">
        <section className="case-hero">
          <div className="case-hero-copy">
            <div className="case-meta">
              <span>{project.category}</span>
              <span>{project.year}</span>
              {project.concept && <span>视觉探索</span>}
            </div>
            <h1>{project.title}</h1>
            <p className="case-english">{project.englishTitle}</p>
            <p className="case-summary">{project.summary}</p>
            {project.sourceLabel && <p className="case-source">{project.sourceLabel}</p>}
          </div>
          <div className="case-hero-art">
            <ProjectArt
              type={project.art}
              accent={project.accent}
              secondary={project.secondary}
              title={project.title}
              image={project.image}
            />
          </div>
        </section>

        <section className={`case-statement page-second-band${project.concept ? " case-statement-concept" : ""}`} data-page-section="second">
          <p>{project.concept ? "视觉探索" : "画册案例"}</p>
          <h2>{project.concept ? "这是一组为展示晴蛙视觉官网结构与设计能力制作的概念内容，不代表已完成的客户项目。" : "以下内容整理自晴蛙视觉公司画册，用于展示业务方向与代表性项目。具体交付范围和项目合作信息以最终确认文件为准。"}</h2>
        </section>

        <section className="case-details">
          <article>
            <h2>问题</h2>
            <p>{project.challenge}</p>
          </article>
          <article>
            <h2>视角</h2>
            <p>{project.approach}</p>
          </article>
          <article>
            <h2>形成</h2>
            <p>{project.result}</p>
          </article>
        </section>

        <section className={`case-expansion expansion-${project.art}`}>
          <div className="expansion-mark" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
          <div>
            <span>{project.category} / VISUAL SYSTEM</span>
            <h2>{project.englishTitle}</h2>
          </div>
        </section>

        <Link className="next-case" href={`/work/${nextProject.slug}`}>
          <span>下一个代表项目</span>
          <strong>{nextProject.title}</strong>
          <ArrowRight aria-hidden="true" />
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
