"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocalized } from "@/lib/locale-context";
import type { CategoryMeta } from "@/lib/types";

export function CategoryCard({ category }: { category: CategoryMeta }) {
  const title = useLocalized(category.title, category.title_en);
  const subtitle = useLocalized(category.subtitle, category.subtitle_en);

  return (
    <Link
      href={`/categorie/${category.slug}`}
      className="group block overflow-hidden rounded-2xl border border-wood/15 bg-cream-soft transition-shadow duration-200 hover:shadow-lg hover:shadow-wood/10"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        {category.cover ? (
          <Image
            src={category.cover}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-wood/40">
            <span className="font-display text-3xl">{title.slice(0, 1)}</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-wood/70">{subtitle}</p>}
      </div>
    </Link>
  );
}
