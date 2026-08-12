import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
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

export const config = {
  matcher: "/pepbackend/:path*",
};
