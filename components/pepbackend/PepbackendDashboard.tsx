"use client";

import { useState } from "react";
import type { CategoryMeta, Project, Subportfolio } from "@/lib/types";
import { CategoriesPanel } from "./CategoriesPanel";
import { ProjectsPanel } from "./ProjectsPanel";
import { SubportfoliosPanel } from "./SubportfoliosPanel";
import { TranslatePanel } from "./TranslatePanel";

type Tab = "projects" | "categories" | "subportfolios" | "translate";

const TABS: { id: Tab; label: string }[] = [
  { id: "projects", label: "Projecten" },
  { id: "categories", label: "Categorieën" },
  { id: "subportfolios", label: "Sub-portfolio's" },
  { id: "translate", label: "Vertalen" },
];

export function PepbackendDashboard({
  categories,
  projects,
  subportfolios,
}: {
  categories: CategoryMeta[];
  projects: Project[];
  subportfolios: Record<string, Omit<Subportfolio, "slug">>;
}) {
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-wood-dark">pepbackend</h1>
      <p className="mt-1 text-sm text-wood/60">
        Alleen lokaal. Wijzigingen schrijven direct naar /content — commit en push zelf om
        ze live te zetten.
      </p>

      <div className="mt-6 flex gap-1 rounded-full border border-wood/15 bg-cream-soft p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-wood-dark text-cream-soft" : "text-wood-dark hover:bg-sand/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "projects" && <ProjectsPanel projects={projects} categories={categories} />}
        {tab === "categories" && <CategoriesPanel categories={categories} />}
        {tab === "subportfolios" && (
          <SubportfoliosPanel
            categories={categories}
            projects={projects}
            subportfolios={subportfolios}
          />
        )}
        {tab === "translate" && <TranslatePanel />}
      </div>
    </div>
  );
}
