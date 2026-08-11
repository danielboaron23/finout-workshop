import type { NextConfig } from "next";

// PAGES_BASE (e.g. "/finout-workshop-demo") switches on the static GitHub
// Pages export; local dev/build stays untouched when it's unset.
const base = process.env.PAGES_BASE;

const nextConfig: NextConfig = {
  ...(base
    ? {
        output: "export" as const,
        basePath: base,
        assetPrefix: base,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
