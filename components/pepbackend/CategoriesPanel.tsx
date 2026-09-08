"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleCategoryVisibility } from "@/lib/pepbackend-actions";
import type { CategoryMeta } from "@/lib/types";
import { ToggleSwitch } from "./ToggleSwitch";

export function CategoriesPanel({ categories }: { categories: CategoryMeta[] }) {
  const router = useRouter();
  const [state, setState] = useState(
    Object.fromEntries(categories.map((c) => [c.slug, c.visible]))
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setState(Object.fromEntries(categories.map((c) => [c.slug, c.visible])));
  }, [categories]);

  async function handleToggle(slug: string, next: boolean) {
    setError(null);
    setState((s) => ({ ...s, [slug]: next }));
    try {
      await toggleCategoryVisibility(slug, next);
      router.refresh();
    } catch (err) {
      setState((s) => ({ ...s, [slug]: !next }));
      setError(err instanceof Error ? err.message : "Opslaan is mislukt.");
    }
  }

  return (
    <div>
      <div className="divide-y divide-wood/10 rounded-2xl border border-wood/15 bg-cream-soft">
        {categories.map((category) => (
          <div key={category.slug} className="flex items-center justify-between gap-4 p-4">
            <p className="font-medium text-wood-dark">{category.title}</p>
            <ToggleSwitch
              checked={state[category.slug]}
              onChange={(next) => handleToggle(category.slug, next)}
              label={`Toon ${category.title}`}
            />
          </div>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-terracotta-dark">{error}</p>}
    </div>
  );
}
