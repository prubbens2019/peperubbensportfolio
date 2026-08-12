"use client";

import { useLocalized } from "@/lib/locale-context";
import type { CategoryMeta, Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function CategorySection({ category, projects }: { category: CategoryMeta; projects: Project[] }) {
  const title = useLocalized(category.title, category.title_en);

  return (
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
