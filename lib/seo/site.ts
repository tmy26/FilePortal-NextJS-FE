import type { Metadata } from "next";
import { CANONICAL_ORIGIN } from "./canonical-host";

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

export const SITE_URL = resolveSiteUrl();

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  if (!raw) {
    return process.env.NODE_ENV === "production"
      ? CANONICAL_ORIGIN
      : "http://localhost:3000";
  }
  try {
    const hostname = new URL(raw).hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      return raw;
    }
  } catch {
    return CANONICAL_ORIGIN;
  }
  return CANONICAL_ORIGIN;
}

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
    default: "ECU File Service | Online ECU Tuning Files | ECUFilePortal",
    template: `%s · ${SITE_TITLE_BRAND}`,
  },
  description:
    "Online ECU and TCU file service by TMY Tuned. Create an account, upload the original BIN, pay with TuningPoints, and track each request until the processed file is Ready.",
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
  ogTitle: "ECU File Service | Online ECU Tuning Files | ECUFilePortal",
  ogDescription:
    "Online ECU and TCU file service by TMY Tuned. Create an account, upload the original BIN, pay with TuningPoints, and track each request until the processed file is Ready.",
  twitterTitle: "ECU File Service | Online ECU Tuning Files | ECUFilePortal",
  twitterDescription:
    "Online ECU and TCU file service by TMY Tuned. Create an account, upload the original BIN, pay with TuningPoints, and track each request until the processed file is Ready.",
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
  core: "2026-08-14",
  product: "2026-08-14",
} as const;

/**
 * Canonical URLs submitted in sitemap.xml — only pages we want in Search.
 * Auth, account, checkout, API, legal, redirects, and spam URLs stay out.
 */
export const SITEMAP_CORE_ROUTES: IndexableRoute[] = [
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
];

/** Money-page slugs allowed in sitemap.xml, in preferred order. */
export const SITEMAP_PAGE_SLUGS = [
  "ecu-tuning-files",
  "tcu-tuning-files",
  "stage-1-tuning-files",
  "stage-2-tuning-files",
  "pricing",
  "how-it-works",
  "supported-ecus",
  "supported-tools",
  "about",
  "contact",
  "resources",
] as const;

/**
 * HTML routes that must send noindex. Do not Disallow these in robots.txt —
 * Google has to recrawl them to see the robots meta / X-Robots-Tag.
 * /upload, /shop, /pricing, and other commercial landings stay indexable.
 */
export const NOINDEX_PATH_PREFIXES = [
  "/sign-in",
  "/register",
  "/resend-verification",
  "/verify-email",
  "/forgot-password",
  "/activate",
  "/profile",
  "/account",
  "/history",
  "/file-history",
  "/upload/options",
  "/shop/success",
  "/shop/cancel",
  "/mod-transfer",
] as const;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  /** Defaults to true. Set false for auth/account pages. */
  index?: boolean;
  /** When true, `title` is used as-is (already includes the brand). */
  absoluteTitle?: boolean;
};

/** Shared per-route metadata: title, description, canonical, OG, robots. */
export function pageMetadata({
  title,
  description,
  path,
  index = true,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const url = path.startsWith("/") ? path : `/${path}`;
  const absolute = absoluteUrl(url);
  const fullTitle = absoluteTitle ? title : `${title} · ${SITE_TITLE_BRAND}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(index
      ? {
          keywords: [...SITE_SEO.keywords],
        }
      : {}),
    alternates: {
      canonical: absolute,
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
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        },
  };
}
