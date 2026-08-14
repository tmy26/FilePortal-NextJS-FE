import type { NextConfig } from "next";
import { CANONICAL_HOST, CANONICAL_ORIGIN, CANONICAL_WWW_HOST } from "./lib/seo/canonical-host";
import { MONEY_PAGE_REDIRECTS } from "./lib/seo/money-pages";
import { NOINDEX_PATH_PREFIXES } from "./lib/seo/site";

const apiBase = (process.env.API_BASE_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);

const noindexHeaders = [{ key: "X-Robots-Tag", value: "noindex" }];

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: CANONICAL_WWW_HOST }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          { type: "host", value: CANONICAL_HOST },
          { type: "header", key: "x-forwarded-proto", value: "http" },
        ],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      },
      ...MONEY_PAGE_REDIRECTS.map((rule) => ({
        source: rule.source,
        destination: rule.destination,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return NOINDEX_PATH_PREFIXES.flatMap((prefix) => [
      { source: prefix, headers: noindexHeaders },
      { source: `${prefix}/:path*`, headers: noindexHeaders },
    ]);
  },
  async rewrites() {
    return [
      {
        source: "/ws/:path*",
        destination: `${apiBase}/ws/:path*`,
      },
    ];
  },
};

export default nextConfig;
