"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { translateAllContent, type TranslateSummary } from "@/lib/pepbackend-actions";

export function TranslatePanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<TranslateSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await translateAllContent();
      setSummary(result);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-wood/15 bg-cream-soft p-5">
      <p className="text-sm text-wood/70">
        Scant alle content op nieuwe of gewijzigde Nederlandse tekst en vertaalt die naar
        het Engels via de Anthropic API.
      </p>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="mt-4 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-cream-soft hover:bg-terracotta-dark disabled:opacity-50"
      >
        {loading ? "Bezig met vertalen..." : "Vertaal alle nieuwe content"}
      </button>

      {summary && (
        <p className="mt-3 text-sm text-wood-dark">
          {summary.translated} stuk{summary.translated === 1 ? "" : "ken"} tekst vertaald,{" "}
          {summary.upToDate} was{summary.upToDate === 1 ? "" : "en"} al actueel.
        </p>
      )}

      {error && <p className="mt-3 text-sm text-terracotta-dark">{error}</p>}
    </div>
  );
}
