import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/site";
import { ProjectArt } from "./project-art";

type ProjectStripProps = {
  project: Project;
  index: number;
};

export function ProjectStrip({ project, index }: ProjectStripProps) {
  return (
    <Link className="project-strip" href={`/work/${project.slug}`}>
      <div className="project-strip-art">
        <ProjectArt
          type={project.art}
          accent={project.accent}
          secondary={project.secondary}
          title={project.title}
          image={project.image}
        />
      </div>
      <div className="project-strip-copy">
        <div className="project-strip-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.englishTitle}</p>
        {project.sourceLabel && <small>{project.sourceLabel}</small>}
        <span className="project-open" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </div>
    </Link>
  );
}
