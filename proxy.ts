import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GATE_COOKIE, gateToken } from "@/lib/site-gate";

function pepbackendAuth(request: NextRequest) {
  const password = process.env.PEPBACKEND_PASSWORD;

  if (!password) {
    return new NextResponse(
      "PEPBACKEND_PASSWORD is niet ingesteld. Zet 'm in .env.local om de pepbackend te gebruiken.",
      { status: 500 }
    );
  }

  const username = process.env.PEPBACKEND_USERNAME || "pep";
  const auth = request.headers.get("authorization");

  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [user, pass] = Buffer.from(encoded, "base64").toString().split(":");
      if (user === username && pass === password) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authenticatie vereist.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="pepbackend"' },
  });
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The admin tool has its own login.
  if (pathname.startsWith("/pepbackend")) return pepbackendAuth(request);

  // The code entry page itself must stay reachable.
  if (pathname === "/toegang" || pathname.startsWith("/api/toegang")) {
    return NextResponse.next();
  }

  if (request.cookies.get(GATE_COOKIE)?.value === gateToken()) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/toegang";
  url.search = "";
  url.searchParams.set("next", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  // Image files stay open: next/image fetches them internally without the cookie.
  matcher: ["/((?!_next/static|_next/image|content/|profielfoto.jpg|favicon.ico|icon.svg).*)"],
};
