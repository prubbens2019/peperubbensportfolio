"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [state, setState] = useState(
    Object.fromEntries(projects.map((p) => [p.slug, p.visible]))
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setState(Object.fromEntries(projects.map((p) => [p.slug, p.visible])));
  }, [projects]);

  const categoryTitle = (slug: string) =>
    categories.find((c) => c.slug === slug)?.title ?? slug;

  async function handleToggle(slug: string, next: boolean) {
    setError(null);
    setState((s) => ({ ...s, [slug]: next }));
    try {
      await toggleProjectVisibility(slug, next);
      router.refresh();
    } catch (err) {
      setState((s) => ({ ...s, [slug]: !next }));
      setError(err instanceof Error ? err.message : "Opslaan is mislukt.");
    }
  }

  return (
    <div>
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
              onChange={(next) => handleToggle(project.slug, next)}
              label={`Toon ${project.title}`}
            />
          </div>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-terracotta-dark">{error}</p>}
    </div>
  );
}
