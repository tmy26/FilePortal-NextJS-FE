import type { Metadata } from "next";

export type SitemapChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type IndexableRoute = {
  path: string;
  changeFrequency: SitemapChangeFrequency;
  priority: number;
  lastModified?: string | Date;
};

/** Canonical absolute URL — homepage always ends with `/`. */
export function absoluteUrl(path: string): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const pathname = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${pathname}`;
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const SITE_NAME = "File Portal";
export const SITE_TITLE_BRAND = "File Portal";
export const SITE_NAME_ALT = "TMY Tuned File Portal";

export const SITE_SEO = {
  name: SITE_NAME,
  alternateName: SITE_NAME_ALT,
  alternateNames: [SITE_NAME_ALT, "TMY Tuned Portal", "FilePortal"],
  legalName: "TMY Tuned",
  shortName: SITE_NAME,
  locale: "en_GB",
  language: "en",
  title: {
    default: `${SITE_TITLE_BRAND} – ECU & gearbox file portal by TMY Tuned`,
    template: `%s · ${SITE_TITLE_BRAND}`,
  },
  description:
    "File Portal by TMY Tuned — upload ECU and gearbox files, buy TuningPoints, track requests, and transfer mods securely.",
  keywords: [
    "File Portal",
    "TMY Tuned",
    "TMYTuned",
    "ECU files",
    "gearbox files",
    "chip tuning files",
    "TuningPoints",
    "file upload portal",
    "ECU remap files",
    "Plovdiv",
  ],
  category: "automotive",
  ogTitle: `${SITE_TITLE_BRAND} – ECU & gearbox file portal`,
  ogDescription:
    "Upload ECU and gearbox files, purchase TuningPoints, and manage tuning requests with File Portal by TMY Tuned.",
  twitterTitle: `${SITE_TITLE_BRAND} – ECU & gearbox file portal`,
  twitterDescription:
    "Secure file portal for ECU/gearbox uploads, TuningPoints, and request history — by TMY Tuned.",
  creator: "TMY Tuned",
  publisher: "TMY Tuned",
  contactEmail: "tmytuned@gmail.com",
  geo: {
    region: "BG-PD",
    placename: "Plovdiv",
  },
} as const;

/** Bump when public page content changes — keeps sitemap lastmod stable. */
const SITEMAP_LAST_MODIFIED = {
  core: "2026-08-10",
  legal: "2026-08-10",
} as const;

/** Public routes that should appear in sitemap.xml. */
export const INDEXABLE_ROUTES: IndexableRoute[] = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1,
    lastModified: SITEMAP_LAST_MODIFIED.core,
  },
  {
    path: "/terms",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: SITEMAP_LAST_MODIFIED.legal,
  },
  {
    path: "/privacy",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: SITEMAP_LAST_MODIFIED.legal,
  },
  {
    path: "/cookies",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: SITEMAP_LAST_MODIFIED.legal,
  },
];

/** Private / account paths — blocked in robots.txt and meta robots. */
export const NOINDEX_PATH_PREFIXES = [
  "/sign-in",
  "/register",
  "/verify-email",
  "/resend-verification",
  "/profile",
  "/upload",
  "/shop",
  "/file-history",
  "/mod-transfer",
  "/api",
] as const;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  /** Defaults to true. Set false for auth/account pages. */
  index?: boolean;
};

/** Shared per-route metadata: title, description, canonical, OG, robots. */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetadataOptions): Metadata {
  const url = path.startsWith("/") ? path : `/${path}`;
  const absolute = absoluteUrl(url);
  const fullTitle = `${title} · ${SITE_TITLE_BRAND}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: absolute,
      siteName: SITE_TITLE_BRAND,
      locale: SITE_SEO.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: index
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
  };
}
