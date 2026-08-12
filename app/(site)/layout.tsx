import type { ReactNode } from "react";
import { Header } from "@/components/Header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-24">{children}</main>
    </>
  );
}
