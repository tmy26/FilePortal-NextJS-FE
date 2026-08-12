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
    "chip tuning online",
    "online chip tuning",
    "chip tuning file service",
    "tuning file service",
    "ECU tuning file service",
    "ECU tuning files",
    "remap file service",
    "online ECU tuning",
    "online ECU remapping",
    "ECU file tuning",
    "ECU remap file",
    "custom ECU tuning files",
    "ECU tuning online",
    "professional tuning files",
    "modified ECU files",
    "ECU calibration service",
    "ECU remapping service",
    "tuning files for dealers",
    "ECU tuning files for tuners",
    "tuning file service for workshops",
    "remap files for garages",
    "chip tuning files for professionals",
    "ECU file service for dealers",
    "professional ECU file service",
    "custom remap files online",
    "buy ECU tuning files",
    "buy remap files",
    "ECU tuning file provider",
    "chip tuning file supplier",
    "Stage 1 tuning file",
    "Stage 2 tuning file",
    "Stage 3 tuning file",
    "custom Stage 1 remap",
    "custom Stage 2 remap",
    "DPF solution file",
    "EGR solution file",
    "AdBlue solution file",
    "SCR solution file",
    "speed limiter calibration",
    "torque limiter calibration",
    "gearbox tuning files",
    "TCU tuning files",
    "DSG tuning files",
    "ECU DTC solutions",
    "online ECU tuning file service",
    "custom ECU remap file online",
    "professional chip tuning file service",
    "upload ECU file for tuning",
    "send ECU file for remapping",
    "ECU tuning files for car tuning shops",
    "custom tuning files for ECU programmers",
    "fast online ECU file service",
    "ECU remapping files for professionals",
    "Stage 1 ECU tuning file online",
    "Stage 2 ECU tuning file online",
    "diesel ECU tuning file service",
    "petrol ECU tuning file service",
    "tuning file service for automotive workshops",
    "ECU calibration files for tuning professionals",
    "DPF off",
    "DPF delete",
    "DPF removal",
    "DPF disable",
    "DPF deactivation",
    "DPF solution",
    "DPF off file",
    "DPF delete file",
    "DPF removal file",
    "DPF software solution",
    "DPF ECU solution",
    "DPF tuning file",
    "DPF delete tuning file",
    "DPF off ECU file",
    "DPF fault solution",
    "DPF error fix",
    "DPF calibration",
    "DPF regeneration solution",
    "AdBlue off",
    "AdBlue delete",
    "AdBlue removal",
    "AdBlue disable",
    "AdBlue deactivation",
    "AdBlue solution",
    "AdBlue off file",
    "AdBlue delete file",
    "AdBlue removal file",
    "AdBlue software solution",
    "AdBlue ECU solution",
    "AdBlue tuning file",
    "AdBlue fault solution",
    "AdBlue ECU file",
    "SCR off",
    "SCR delete",
    "SCR removal",
    "SCR disable",
    "SCR deactivation",
    "SCR solution",
    "SCR off file",
    "SCR delete file",
    "SCR software solution",
    "SCR ECU solution",
    "SCR fault solution",
    "DEF off",
    "DEF delete",
    "DEF removal",
    "DEF disable",
    "DEF solution",
    "DEF delete file",
    "EGR off",
    "EGR delete",
    "EGR removal",
    "EGR disable",
    "EGR deactivation",
    "EGR solution",
    "EGR off file",
    "EGR delete file",
    "EGR removal file",
    "EGR software solution",
    "EGR ECU solution",
    "EGR tuning file",
    "EGR fault solution",
    "EGR calibration",
    "ecology off",
    "ecology delete",
    "ecology removal",
    "ecology solution",
    "eco off",
    "eco delete",
    "emissions off",
    "emissions delete",
    "emissions solution",
    "emission system solution",
    "emissions ECU solution",
    "emissions calibration",
    "emission fault solution",
    "exhaust aftertreatment solution",
    "aftertreatment solution",
    "aftertreatment calibration",
    "DPF EGR off",
    "DPF EGR delete",
    "DPF AdBlue off",
    "DPF AdBlue delete",
    "EGR AdBlue off",
    "EGR AdBlue delete",
    "DPF SCR off",
    "DPF SCR delete",
    "EGR SCR off",
    "DPF EGR AdBlue",
    "DPF EGR AdBlue solution",
    "DPF EGR SCR solution",
    "ecology off ECU file",
    "ecology solution ECU file",
    "emissions solution file",
    "diesel emissions ECU file",
    "ECU aftertreatment solution",
    "ECU emissions solution",
    "IMMO off",
    "IMMO delete",
    "IMMO removal",
    "IMMO disable",
    "IMMO deactivation",
    "IMMO solution",
    "IMMO off file",
    "IMMO delete file",
    "IMMO removal file",
    "IMMO software solution",
    "IMMO ECU solution",
    "IMMO tuning file",
    "IMMO fault solution",
    "immobilizer off",
    "immobilizer delete",
    "immobilizer removal",
    "immobilizer disable",
    "immobilizer deactivation",
    "immobilizer solution",
    "immobilizer off file",
    "immobilizer delete file",
    "immobilizer ECU solution",
    "immobiliser off",
    "immobiliser delete",
    "immobiliser removal",
    "immobiliser disable",
    "immobiliser solution",
    "SWIRL off",
    "SWIRL delete",
    "SWIRL removal",
    "SWIRL disable",
    "SWIRL deactivation",
    "SWIRL solution",
    "SWIRL off file",
    "SWIRL delete file",
    "SWIRL removal file",
    "SWIRL software solution",
    "SWIRL ECU solution",
    "SWIRL flap off",
    "SWIRL flap delete",
    "SWIRL flap removal",
    "SWIRL flap disable",
    "SWIRL flaps off",
    "SWIRL flaps delete",
    "intake flap off",
    "intake flap delete",
    "intake manifold flap off",
    "intake manifold flap delete",
    "FAP off",
    "FAP delete",
    "FAP removal",
    "FAP disable",
    "FAP deactivation",
    "FAP solution",
    "FAP off file",
    "FAP delete file",
    "FAP removal file",
    "FAP software solution",
    "FAP ECU solution",
    "FAP tuning file",
    "FAP fault solution",
    "FAP error solution",
    "FAP ECU file",
    "NOx off",
    "NOx delete",
    "NOx removal",
    "NOx disable",
    "NOx deactivation",
    "NOx solution",
    "NOx off file",
    "NOx delete file",
    "NOx software solution",
    "NOx ECU solution",
    "NOx sensor off",
    "NOx sensor delete",
    "NOx sensor disable",
    "NOx sensor deactivation",
    "NOx sensor solution",
    "NOx sensor off file",
    "NOx sensor fault solution",
    "NOx sensor error solution",
    "NOx ECU file",
    "NOx system solution",
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
  contactEmail: "ecufileportal.support@gmail.com",
  geo: {
    region: "BG-PD",
    placename: "Plovdiv",
  },
} as const;

/** Bump when public page content changes — keeps sitemap lastmod stable. */
const SITEMAP_LAST_MODIFIED = {
  core: "2026-08-12",
  product: "2026-08-12",
  auth: "2026-08-12",
  legal: "2026-08-12",
} as const;

/**
 * Public routes that should appear in sitemap.xml.
 * Keep in sync with robots allow-list — do not list private/noindex URLs here.
 */
export const INDEXABLE_ROUTES: IndexableRoute[] = [
  {
    path: "/",
    changeFrequency: "weekly",
    priority: 1,
    lastModified: SITEMAP_LAST_MODIFIED.core,
  },
  {
    path: "/upload",
    changeFrequency: "weekly",
    priority: 0.9,
    lastModified: SITEMAP_LAST_MODIFIED.product,
  },
  {
    path: "/shop",
    changeFrequency: "weekly",
    priority: 0.9,
    lastModified: SITEMAP_LAST_MODIFIED.product,
  },
  {
    path: "/sign-in",
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: SITEMAP_LAST_MODIFIED.auth,
  },
  {
    path: "/register",
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: SITEMAP_LAST_MODIFIED.auth,
  },
  {
    path: "/resend-verification",
    changeFrequency: "yearly",
    priority: 0.4,
    lastModified: SITEMAP_LAST_MODIFIED.auth,
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

/**
 * Private / transactional paths — blocked in robots.txt and meta robots.
 * Mid-flow and account-only URLs stay out of the sitemap.
 */
export const NOINDEX_PATH_PREFIXES = [
  "/verify-email",
  "/profile",
  "/upload/options",
  "/shop/success",
  "/shop/cancel",
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
