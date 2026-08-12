"use client";

import Link from "next/link";
import { useLocalized } from "@/lib/locale-context";

export function BackLink({ href }: { href: string }) {
  const label = useLocalized("← Terug", "← Back");

  return (
    <Link href={href} className="text-sm text-wood/60 hover:text-terracotta">
      {label}
    </Link>
  );
}
