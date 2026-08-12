"use client";

import { useState, useTransition } from "react";
import { toggleCategoryVisibility } from "@/lib/pepbackend-actions";
import type { CategoryMeta } from "@/lib/types";
import { ToggleSwitch } from "./ToggleSwitch";

export function CategoriesPanel({ categories }: { categories: CategoryMeta[] }) {
  const [state, setState] = useState(
    Object.fromEntries(categories.map((c) => [c.slug, c.visible]))
  );
  const [, startTransition] = useTransition();

  return (
    <div className="divide-y divide-wood/10 rounded-2xl border border-wood/15 bg-cream-soft">
      {categories.map((category) => (
        <div key={category.slug} className="flex items-center justify-between gap-4 p-4">
          <p className="font-medium text-wood-dark">{category.title}</p>
          <ToggleSwitch
            checked={state[category.slug]}
            onChange={(next) => {
              setState((s) => ({ ...s, [category.slug]: next }));
              startTransition(() => {
                toggleCategoryVisibility(category.slug, next);
              });
            }}
            label={`Toon ${category.title}`}
          />
        </div>
      ))}
    </div>
  );
}
