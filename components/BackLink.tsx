"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocalized } from "@/lib/locale-context";

export function BackLink({ href }: { href: string }) {
  const router = useRouter();
  const label = useLocalized("← Terug", "← Back");
  const [target, setTarget] = useState(href);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("from");
    if (from && from.startsWith("/")) {
      setTarget(from);
      if (window.history.length <= 1) return;
      // We arrived here via an in-app link that pushed a fresh history entry,
      // so the previous entry is exactly that page — going back restores its
      // scroll position natively, where a plain Link would reset to the top.
      setHasHistory(true);
    }
  }, [href]);

  if (hasHistory) {
    return (
      <button
        type="button"
        onClick={() => router.back()}
        className="label-mono text-wood/60 hover:text-terracotta"
      >
        {label}
      </button>
    );
  }

  return (
    <Link href={target} className="label-mono text-wood/60 hover:text-terracotta">
      {label}
    </Link>
  );
}
