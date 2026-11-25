import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { bricolage, instrumentSans, dmMono } from "@/lib/fonts";
import { LocaleProvider } from "@/lib/locale-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pepe Rubbens",
  description: "Portfolio van Pepe Rubbens",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${bricolage.variable} ${instrumentSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
