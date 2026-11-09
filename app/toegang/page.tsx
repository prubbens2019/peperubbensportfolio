import type { Metadata } from "next";
import { safeNext } from "@/lib/site-gate";

export const metadata: Metadata = {
  title: "Pepe Rubbens",
  robots: { index: false, follow: false },
};

export default async function GatePage({ searchParams }: PageProps<"/toegang">) {
  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : "/");
  const hasError = params.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form method="POST" action="/api/toegang" className="w-full max-w-sm">
        <p className="label-mono flex items-center gap-2 text-terracotta">
          <span className="h-1.5 w-1.5 bg-terracotta" />
          Toegang
        </p>
        <h1 className="mt-3 text-4xl">Pepe Rubbens</h1>
        <p className="mt-3 text-wood-dark/70">Vul de code in om het portfolio te bekijken.</p>

        <input type="hidden" name="next" value={next} />
        <input
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          required
          aria-label="Code"
          className="mt-6 w-full border border-wood/25 bg-cream-soft px-4 py-3 font-mono text-lg tracking-[0.3em] outline-none focus:border-terracotta"
        />
        {hasError && (
          <p className="label-mono mt-3 text-terracotta-dark">Onjuiste code, probeer het opnieuw.</p>
        )}
        <button
          type="submit"
          className="mt-4 w-full bg-terracotta px-5 py-3 text-sm font-medium text-cream-soft transition-colors hover:bg-terracotta-dark"
        >
          Openen
        </button>
      </form>
    </main>
  );
}
