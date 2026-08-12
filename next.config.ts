import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder graphics for projects/categories without real photos are
    // locally generated SVGs (see scripts/generate-placeholders.mjs) — safe to allow.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
