"use client";

import Link from "next/link";
import { useLocalized } from "@/lib/locale-context";
import type { CategoryMeta } from "@/lib/types";

export function CategoryHeading({ category }: { category: CategoryMeta }) {
  const title = useLocalized(category.title, category.title_en);
  const subtitle = useLocalized(category.subtitle, category.subtitle_en);
  const back = useLocalized("← Terug naar overzicht", "← Back to overview");

  return (
    <div>
      <Link href="/" className="label-mono text-wood/60 hover:text-terracotta">
        {back}
      </Link>
      <p className="label-mono mt-4 text-terracotta">
        {String(category.order).padStart(2, "0")} / Categorie
      </p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-wood-dark/70">{subtitle}</p>}
    </div>
  );
}
