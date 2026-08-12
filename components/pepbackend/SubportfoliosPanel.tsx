"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSubportfolio } from "@/lib/pepbackend-actions";
import type { CategoryMeta, Project, Subportfolio } from "@/lib/types";
import { SubportfolioForm } from "./SubportfolioForm";

export function SubportfoliosPanel({
  categories,
  projects,
  subportfolios,
}: {
  categories: CategoryMeta[];
  projects: Project[];
  subportfolios: Record<string, Omit<Subportfolio, "slug">>;
}) {
  const router = useRouter();
  const [editingSlug, setEditingSlug] = useState<string | null | "new">(null);

  const list: Subportfolio[] = Object.entries(subportfolios).map(([slug, data]) => ({
    slug,
    ...data,
  }));

  function handleDone() {
    setEditingSlug(null);
    router.refresh();
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Sub-portfolio "${slug}" verwijderen?`)) return;
    await deleteSubportfolio(slug);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-wood/10 rounded-2xl border border-wood/15 bg-cream-soft">
        {list.length === 0 && (
          <p className="p-5 text-sm text-wood/60">Nog geen sub-portfolio&apos;s.</p>
        )}
        {list.map((sub) => (
          <div key={sub.slug} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-wood-dark">{sub.title}</p>
              <p className="text-xs text-wood/50">peperubbens.nl/{sub.slug}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingSlug(sub.slug)}
                className="rounded-full border border-wood/25 px-3 py-1.5 text-xs text-wood-dark hover:bg-sand/60"
              >
                Bewerken
              </button>
              <button
                type="button"
                onClick={() => handleDelete(sub.slug)}
                className="rounded-full border border-wood/25 px-3 py-1.5 text-xs text-terracotta-dark hover:bg-sand/60"
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingSlug === null && (
        <button
          type="button"
          onClick={() => setEditingSlug("new")}
          className="rounded-full bg-wood-dark px-4 py-2 text-sm font-medium text-cream-soft hover:opacity-90"
        >
          + Nieuwe sub-portfolio
        </button>
      )}

      {editingSlug === "new" && (
        <SubportfolioForm
          categories={categories}
          projects={projects}
          existing={null}
          onDone={handleDone}
          onCancel={() => setEditingSlug(null)}
        />
      )}

      {editingSlug && editingSlug !== "new" && (
        <SubportfolioForm
          categories={categories}
          projects={projects}
          existing={list.find((s) => s.slug === editingSlug) ?? null}
          onDone={handleDone}
          onCancel={() => setEditingSlug(null)}
        />
      )}
    </div>
  );
}
