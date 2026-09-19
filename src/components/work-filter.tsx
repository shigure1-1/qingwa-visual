"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProjectStrip } from "@/components/project-strip";
import { projectCategories, projects, type ProjectCategory } from "@/content/site";

type Filter = (typeof projectCategories)[number];

function isFilter(value: string | null): value is Filter {
  return value !== null && projectCategories.some((filter) => filter === value);
}

export function WorkFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const active: Filter = isFilter(category) ? category : "全部";

  const visible = active === "全部"
    ? projects
    : projects.filter((project) => project.category === active as ProjectCategory);

  function selectFilter(filter: Filter) {
    const query = filter === "全部" ? "" : `?category=${encodeURIComponent(filter)}`;
    router.replace(`/work${query}`, { scroll: false });
  }

  return (
    <>
      <div className="work-filters" role="group" aria-label="按项目类型筛选">
        {projectCategories.map((filter) => (
          <button
            key={filter}
            type="button"
            data-active={active === filter}
            aria-pressed={active === filter}
            onClick={() => selectFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="project-list" aria-live="polite">
        {visible.map((project) => (
          <ProjectStrip
            key={project.slug}
            project={project}
            index={projects.findIndex((item) => item.slug === project.slug)}
          />
        ))}
      </div>
    </>
  );
}
