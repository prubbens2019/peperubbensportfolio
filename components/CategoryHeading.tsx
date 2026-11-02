"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocalized } from "@/lib/locale-context";
import type { CategoryMeta } from "@/lib/types";

export function CategoryHeading({ category }: { category: CategoryMeta }) {
  const router = useRouter();
  const title = useLocalized(category.title, category.title_en);
  const subtitle = useLocalized(category.subtitle, category.subtitle_en);
  const back = useLocalized("← Terug naar overzicht", "← Back to overview");
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    if (
      new URLSearchParams(window.location.search).get("back") === "1" &&
      window.history.length > 1
    ) {
      setHasHistory(true);
    }
  }, []);

  return (
    <div>
      {hasHistory ? (
        <button
          type="button"
          onClick={() => router.back()}
          className="label-mono text-wood/60 hover:text-terracotta"
        >
          {back}
        </button>
      ) : (
        <Link href="/" className="label-mono text-wood/60 hover:text-terracotta">
          {back}
        </Link>
      )}
      <p className="label-mono mt-4 text-terracotta">
        {String(category.order).padStart(2, "0")} / Categorie
      </p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-wood-dark/70">{subtitle}</p>}
    </div>
  );
}
