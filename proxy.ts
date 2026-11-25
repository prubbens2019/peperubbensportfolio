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

// First path segments that belong to the main site; any other single-segment
// path (/rvo, /picnic, /humanoids, ...) is a company sub-portfolio.
const RESERVED_SEGMENTS = new Set(["toegang", "pepbackend", "api", "categorie", "project"]);

function isSubportfolioPath(path: string | null): boolean {
  if (!path) return false;
  const match = /^\/([a-z0-9-]+)\/?$/i.exec(path);
  return Boolean(match) && !RESERVED_SEGMENTS.has(match![1].toLowerCase());
}

/** Company sub-portfolios are public: the page itself, and the project pages
 * opened from it (they carry ?from=/<subportfolio>). */
function isOpenToCompanies(request: NextRequest): boolean {
  const { pathname, searchParams } = request.nextUrl;
  if (isSubportfolioPath(pathname)) return true;
  return pathname.startsWith("/project/") && isSubportfolioPath(searchParams.get("from"));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The admin tool has its own login.
  if (pathname.startsWith("/pepbackend")) return pepbackendAuth(request);

  // The code entry page itself must stay reachable.
  if (pathname === "/toegang" || pathname.startsWith("/api/toegang")) {
    return NextResponse.next();
  }

  if (isOpenToCompanies(request)) return NextResponse.next();

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
  matcher: ["/((?!_next/static|_next/image|_vercel/|content/|profielfoto.jpg|logo.png|favicon.ico|icon.png|icon.svg).*)"],
};
