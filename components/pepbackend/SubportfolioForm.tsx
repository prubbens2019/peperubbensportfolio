"use client";

import { useMemo, useState } from "react";
import { saveSubportfolio, type SubportfolioInput } from "@/lib/pepbackend-actions";
import { slugify } from "@/lib/slugify";
import type { CategoryMeta, Project, Subportfolio } from "@/lib/types";

export function SubportfolioForm({
  categories,
  projects,
  existing,
  onDone,
  onCancel,
}: {
  categories: CategoryMeta[];
  projects: Project[];
  existing: Subportfolio | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(existing ? existing.title.replace(/^Relevante projecten voor /, "") : "");
  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(existing?.categories ?? [])
  );
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set(existing?.projects ?? [])
  );
  const [saving, setSaving] = useState(false);

  const isNew = !existing;

  const projectsByCategory = useMemo(() => {
    const map = new Map<string, Project[]>();
    for (const category of categories) {
      map.set(
        category.slug,
        projects.filter((p) => p.category === category.slug)
      );
    }
    return map;
  }, [categories, projects]);

  function handleNameChange(value: string) {
    setName(value);
    if (isNew) {
      setSlug(slugify(value));
      setTitle(value ? `Relevante projecten voor ${value}` : "");
    }
  }

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function toggleProject(slug: string) {
    setSelectedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function handleSubmit() {
    if (!slug || !title) return;
    setSaving(true);

    const input: SubportfolioInput = {
      title,
      titleEn: existing?.title_en ?? (name ? `Relevant projects for ${name}` : ""),
      categories: Array.from(selectedCategories),
      projects: Array.from(selectedProjects),
    };

    await saveSubportfolio(slug, input, existing?.slug);
    setSaving(false);
    onDone();
  }

  return (
    <div className="mt-4 space-y-5 rounded-2xl border border-wood/15 bg-cream-soft p-5">
      {isNew && (
        <div>
          <label className="text-sm font-medium text-wood-dark">Naam (bijv. klantnaam)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Vitra"
            className="mt-1 w-full rounded-lg border border-wood/25 bg-cream-soft px-3 py-2 text-sm"
          />
          {slug && <p className="mt-1 text-xs text-wood/50">peperubbens.nl/{slug}</p>}
        </div>
      )}

      {!isNew && <p className="text-xs text-wood/50">peperubbens.nl/{slug}</p>}

      <div>
        <label className="text-sm font-medium text-wood-dark">Titel</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-wood/25 bg-cream-soft px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-wood-dark">Categorieën &amp; projecten</p>
        <div className="mt-2 space-y-3">
          {categories.map((category) => (
            <div key={category.slug}>
              <label className="flex items-center gap-2 text-sm text-wood-dark">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(category.slug)}
                  onChange={() => toggleCategory(category.slug)}
                />
                {category.title}
              </label>
              {selectedCategories.has(category.slug) && (
                <div className="ml-6 mt-1 space-y-1">
                  {(projectsByCategory.get(category.slug) ?? []).map((project) => (
                    <label key={project.slug} className="flex items-center gap-2 text-sm text-wood/70">
                      <input
                        type="checkbox"
                        checked={selectedProjects.has(project.slug)}
                        onChange={() => toggleProject(project.slug)}
                      />
                      {project.title}
                    </label>
                  ))}
                  {(projectsByCategory.get(category.slug) ?? []).length === 0 && (
                    <p className="text-xs text-wood/40">Geen projecten in deze categorie.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !slug || !title}
          className="rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-cream-soft hover:bg-terracotta-dark disabled:opacity-50"
        >
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-wood/25 px-4 py-2 text-sm text-wood-dark hover:bg-sand/60"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}
