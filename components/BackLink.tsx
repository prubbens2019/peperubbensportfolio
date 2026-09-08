"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocalized } from "@/lib/locale-context";

export function BackLink({ href }: { href: string }) {
  const label = useLocalized("← Terug", "← Back");
  const [target, setTarget] = useState(href);

  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    if (from && from.startsWith("/")) setTarget(from);
  }, [href]);

  return (
    <Link href={target} className="label-mono text-wood/60 hover:text-terracotta">
      {label}
    </Link>
  );
}
