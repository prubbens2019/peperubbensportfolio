"use client";

import { useState } from "react";
import { saveSubportfolio, type SubportfolioInput } from "@/lib/pepbackend-actions";
import { slugify } from "@/lib/slugify";
import { emptyAssignments, SUBPORTFOLIO_SECTIONS } from "@/lib/subportfolio-sections";
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
  const [assignments, setAssignments] = useState<Record<string, string[]>>(
    existing?.assignments ?? emptyAssignments()
  );
  const [saving, setSaving] = useState(false);
  const [dragSlug, setDragSlug] = useState<string | null>(null);

  const isNew = !existing;

  const sections = SUBPORTFOLIO_SECTIONS.map((sectionSlug) => ({
    slug: sectionSlug,
    title: categories.find((c) => c.slug === sectionSlug)?.title ?? sectionSlug,
  }));

  const categoryTitle = (categorySlug: string) =>
    categories.find((c) => c.slug === categorySlug)?.title ?? categorySlug;

  function handleNameChange(value: string) {
    setName(value);
    if (isNew) {
      setSlug(slugify(value));
      setTitle(value ? `Relevante projecten voor ${value}` : "");
    }
  }

  function isAssigned(sectionSlug: string, projectSlug: string) {
    return (assignments[sectionSlug] ?? []).includes(projectSlug);
  }

  function toggleAssignment(sectionSlug: string, projectSlug: string) {
    setAssignments((prev) => {
      const current = prev[sectionSlug] ?? [];
      const next = current.includes(projectSlug)
        ? current.filter((s) => s !== projectSlug)
        : [...current, projectSlug];
      return { ...prev, [sectionSlug]: next };
    });
  }

  function addAssignment(sectionSlug: string, projectSlug: string) {
    setAssignments((prev) => {
      const current = prev[sectionSlug] ?? [];
      if (current.includes(projectSlug)) return prev;
      return { ...prev, [sectionSlug]: [...current, projectSlug] };
    });
  }

  async function handleSubmit() {
    if (!slug || !title) return;
    setSaving(true);

    const input: SubportfolioInput = {
      title,
      titleEn: existing?.title_en ?? (name ? `Relevant projects for ${name}` : ""),
      assignments,
    };

    await saveSubportfolio(slug, input, existing?.slug);
    setSaving(false);
    onDone();
  }

  return (
    <div className="mt-4 space-y-5 rounded-2xl border border-wood/15 bg-cream-soft p-5">
      {isNew && (
        <div>
          <label className="text-sm font-medium text-wood-dark">Naam (bijv. bedrijfsnaam)</label>
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
        <p className="text-sm font-medium text-wood-dark">
          Sleep projecten naar de gewenste sectie(s), of klik op een label om toe te voegen. Eén
          project mag in meerdere secties staan.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-wood/15 bg-cream-soft/60 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wood/50">
              Alle projecten
            </p>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {projects.map((project) => (
                <div
                  key={project.slug}
                  draggable
                  onDragStart={() => setDragSlug(project.slug)}
                  onDragEnd={() => setDragSlug(null)}
                  className="cursor-grab rounded-lg border border-wood/15 bg-cream-soft p-2 text-sm active:cursor-grabbing"
                >
                  <p className="font-medium text-wood-dark">{project.title}</p>
                  <p className="text-xs text-wood/50">{categoryTitle(project.category)}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {sections.map((section) => (
                      <button
                        key={section.slug}
                        type="button"
                        onClick={() => toggleAssignment(section.slug, project.slug)}
                        className={`rounded-full px-2 py-0.5 text-[11px] ${
                          isAssigned(section.slug, project.slug)
                            ? "bg-terracotta text-cream-soft"
                            : "bg-sand/60 text-wood-dark hover:bg-sand"
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-xs text-wood/40">Nog geen projecten beschikbaar.</p>
              )}
            </div>
          </div>

          {sections.map((section) => (
            <div
              key={section.slug}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragSlug) addAssignment(section.slug, dragSlug);
                setDragSlug(null);
              }}
              className="min-h-[8rem] rounded-xl border-2 border-dashed border-wood/20 bg-cream-soft/40 p-3"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-wood/50">
                {section.title}
              </p>
              <div className="space-y-2">
                {(assignments[section.slug] ?? []).map((projectSlug) => {
                  const project = projects.find((p) => p.slug === projectSlug);
                  if (!project) return null;
                  return (
                    <div
                      key={projectSlug}
                      className="flex items-center justify-between gap-2 rounded-lg border border-wood/15 bg-cream-soft p-2 text-sm"
                    >
                      <span className="text-wood-dark">{project.title}</span>
                      <button
                        type="button"
                        onClick={() => toggleAssignment(section.slug, projectSlug)}
                        aria-label={`Verwijder ${project.title} uit ${section.title}`}
                        className="text-wood/40 hover:text-terracotta-dark"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                {(assignments[section.slug] ?? []).length === 0 && (
                  <p className="text-xs text-wood/40">Sleep hier een project naartoe.</p>
                )}
              </div>
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
