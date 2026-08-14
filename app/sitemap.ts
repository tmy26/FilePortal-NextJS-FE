import type { MetadataRoute } from "next";
import {
  getMoneyPage,
  MONEY_PAGE_REDIRECTS,
} from "@/lib/seo/money-pages";
import {
  absoluteUrl,
  NOINDEX_PATH_PREFIXES,
  SITEMAP_CORE_ROUTES,
  SITEMAP_PAGE_SLUGS,
} from "@/lib/seo/site";

function pathnameOf(url: string): string {
  try {
    return new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    return url;
  }
}

function isExcludedPath(path: string): boolean {
  if (MONEY_PAGE_REDIRECTS.some((rule) => rule.source === path)) {
    return true;
  }
  return NOINDEX_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

/**
 * Canonical commercial URLs only. No auth, profiles, checkout, API,
 * search/filter, redirects, or spam paths.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const core = SITEMAP_CORE_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...(route.lastModified ? { lastModified: route.lastModified } : {}),
  }));

  const pages = SITEMAP_PAGE_SLUGS.flatMap((slug) => {
    const page = getMoneyPage(slug);
    if (!page) return [];
    return [
      {
        url: absoluteUrl(`/${page.slug}`),
        changeFrequency: "weekly" as const,
        priority: page.priority,
        lastModified: "2026-08-14",
      },
    ];
  });

  const seen = new Set<string>();
  return [...core, ...pages]
    .filter((entry) => {
      const path = pathnameOf(entry.url);
      if (isExcludedPath(path)) return false;
      if (seen.has(path)) return false;
      seen.add(path);
      return true;
    })
    .sort((a, b) => b.priority - a.priority || a.url.localeCompare(b.url));
}
