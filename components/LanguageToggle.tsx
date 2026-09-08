"use client";

import { useLocale } from "@/lib/locale-context";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-3">
      <div className="label-mono flex overflow-hidden border border-wood/25">
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
          className={`border-l border-wood/25 px-3 py-1.5 transition-colors ${
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
          className="label-mono flex items-center gap-1 text-terracotta"
        >
          <span className="h-1.5 w-1.5 bg-terracotta" />
          AI
        </span>
      )}
    </div>
  );
}
