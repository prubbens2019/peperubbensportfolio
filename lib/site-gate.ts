import { createHash } from "crypto";

export const GATE_COOKIE = "site_access";

/** Code to enter the site. Override with SITE_PASSWORD (e.g. in Vercel). */
export function gatePin(): string {
  return process.env.SITE_PASSWORD || "5407";
}

export function gateToken(pin: string = gatePin()): string {
  return createHash("sha256").update(`peperubbens-gate:${pin}`).digest("hex");
}

/** Only allow redirects to paths on this site. */
export function safeNext(next: string | null | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}
