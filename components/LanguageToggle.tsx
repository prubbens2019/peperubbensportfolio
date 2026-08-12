"use client";

import { useLocale } from "@/lib/locale-context";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <div className="flex overflow-hidden rounded-full border border-wood/25 text-xs font-medium">
        <button
          type="button"
          onClick={() => setLocale("nl")}
          className={`px-3 py-1.5 transition-colors ${
            locale === "nl" ? "bg-wood-dark text-cream-soft" : "text-wood-dark hover:bg-sand/60"
          }`}
          aria-pressed={locale === "nl"}
        >
          NL
        </button>
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={`px-3 py-1.5 transition-colors ${
            locale === "en" ? "bg-wood-dark text-cream-soft" : "text-wood-dark hover:bg-sand/60"
          }`}
          aria-pressed={locale === "en"}
        >
          EN
        </button>
      </div>
      {locale === "en" && (
        <span
          title="Automatisch vertaald"
          className="rounded-full bg-terracotta/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-terracotta-dark"
        >
          AI
        </span>
      )}
    </div>
  );
}
