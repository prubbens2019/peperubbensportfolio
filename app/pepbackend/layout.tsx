import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "pepbackend",
  robots: { index: false, follow: false },
};

export default function PepbackendLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-cream px-6 py-10">
      <div className="mx-auto max-w-4xl">{children}</div>
    </main>
  );
}
