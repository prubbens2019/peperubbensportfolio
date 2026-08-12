"use client";

import { useState, useTransition } from "react";
import { toggleProjectVisibility } from "@/lib/pepbackend-actions";
import type { CategoryMeta, Project } from "@/lib/types";
import { ToggleSwitch } from "./ToggleSwitch";

export function ProjectsPanel({
  projects,
  categories,
}: {
  projects: Project[];
  categories: CategoryMeta[];
}) {
  const [state, setState] = useState(
    Object.fromEntries(projects.map((p) => [p.slug, p.visible]))
  );
  const [, startTransition] = useTransition();

  const categoryTitle = (slug: string) =>
    categories.find((c) => c.slug === slug)?.title ?? slug;

  return (
    <div className="divide-y divide-wood/10 rounded-2xl border border-wood/15 bg-cream-soft">
      {projects.length === 0 && (
        <p className="p-5 text-sm text-wood/60">Nog geen projecten.</p>
      )}
      {projects.map((project) => (
        <div key={project.slug} className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="font-medium text-wood-dark">{project.title}</p>
            <p className="text-xs text-wood/50">{categoryTitle(project.category)}</p>
          </div>
          <ToggleSwitch
            checked={state[project.slug]}
            onChange={(next) => {
              setState((s) => ({ ...s, [project.slug]: next }));
              startTransition(() => {
                toggleProjectVisibility(project.slug, next);
              });
            }}
            label={`Toon ${project.title}`}
          />
        </div>
      ))}
    </div>
  );
}
