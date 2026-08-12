"use client";

import { useLocalized } from "@/lib/locale-context";
import type { Project } from "@/lib/types";

export function ProjectHeader({ project }: { project: Project }) {
  const title = useLocalized(project.title, project.title_en);
  const subtitle = useLocalized(project.subtitle, project.subtitle_en);

  const metaItems = [project.role, project.year, project.tools.join(", ")].filter(Boolean);

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-wood-dark/70">{subtitle}</p>}
      {metaItems.length > 0 && (
        <p className="mt-3 text-sm uppercase tracking-wide text-wood/60">
          {metaItems.join(" · ")}
        </p>
      )}
    </div>
  );
}
