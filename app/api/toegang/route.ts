import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GATE_COOKIE, gatePin, gateToken, safeNext } from "@/lib/site-gate";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const pin = String(form.get("pin") ?? "").trim();
  const next = safeNext(String(form.get("next") ?? ""));

  const url = request.nextUrl.clone();
  url.search = "";

  if (pin !== gatePin()) {
    url.pathname = "/toegang";
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, 303);
  }

  url.pathname = next.split("?")[0];
  url.search = next.includes("?") ? next.slice(next.indexOf("?")) : "";
  const response = NextResponse.redirect(url, 303);
  response.cookies.set(GATE_COOKIE, gateToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
