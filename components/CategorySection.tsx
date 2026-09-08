"use client";

import { useLocalized } from "@/lib/locale-context";
import type { CategoryMeta, Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function CategorySection({
  category,
  projects,
  from,
}: {
  category: CategoryMeta;
  projects: Project[];
  from?: string;
}) {
  const title = useLocalized(category.title, category.title_en);

  return (
    <div className="border-t border-wood/15 pt-10">
      <h2 className="text-2xl">{title}</h2>
      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} from={from} />
        ))}
      </div>
    </div>
  );
}
