"use client";

import { useLocalized } from "@/lib/locale-context";

export function EmptyState({ nl, en }: { nl: string; en: string }) {
  return <p className="text-wood/60">{useLocalized(nl, en)}</p>;
}
