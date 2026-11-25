import { Bricolage_Grotesque, Instrument_Sans, DM_Mono } from "next/font/google";

export const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

export const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
