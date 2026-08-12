import type { ReactNode } from "react";
import { Header } from "@/components/Header";

export default function SubportfolioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header linkHome={false} />
      <main className="flex-1 pb-24">{children}</main>
    </>
  );
}
