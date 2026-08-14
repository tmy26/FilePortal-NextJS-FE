/**
 * Japanese-spam / hack-SEO cleanup.
 *
 * Unknown URLs must stay 404 or 410 — never rewrite to the homepage.
 * Known junk prefixes return 410 so Google drops them from the index.
 * Random subdomains must not serve the app even if DNS is misconfigured.
 */

import { CANONICAL_HOST, CANONICAL_WWW_HOST } from "./canonical-host";

/** Prefixes seen on hacked JP shop spam. Do not match real routes like /cookies or /verify-email. */
const GONE_PATH_ROOTS = [
  "/product",
  "/item",
  "/category",
  "/tag",
  "/wp-admin",
  "/wp-content",
  "/wp-includes",
  "/v",
  "/c",
] as const;

export function normalizeHostname(hostHeader: string): string {
  const trimmed = hostHeader.trim().toLowerCase().replace(/\.$/, "");
  if (trimmed.startsWith("[")) {
    const end = trimmed.indexOf("]");
    return end === -1 ? trimmed : trimmed.slice(1, end);
  }
  const colon = trimmed.lastIndexOf(":");
  if (colon !== -1 && /^\d+$/.test(trimmed.slice(colon + 1))) {
    return trimmed.slice(0, colon);
  }
  return trimmed;
}

function canonicalSiteHostnames(siteUrl: string): Set<string> {
  const hosts = new Set<string>();
  try {
    const hostname = new URL(siteUrl).hostname.toLowerCase();
    hosts.add(hostname);
    if (hostname.startsWith("www.")) {
      hosts.add(hostname.slice(4));
    } else if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      hosts.add(`www.${hostname}`);
    }
  } catch {
    /* ignore invalid SITE_URL */
  }
  return hosts;
}

export function isAllowedPublicHost(
  hostHeader: string | null | undefined,
  siteUrl: string,
): boolean {
  if (!hostHeader) return false;
  const hostname = normalizeHostname(hostHeader);
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  ) {
    return true;
  }
  if (hostname === CANONICAL_HOST || hostname === CANONICAL_WWW_HOST) {
    return true;
  }
  return canonicalSiteHostnames(siteUrl).has(hostname);
}

function normalizePathname(pathname: string): string {
  let path = pathname.split("?")[0] || "/";
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep raw path */
  }
  path = path.toLowerCase();
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
}

export function isGoneSpamPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return GONE_PATH_ROOTS.some(
    (root) => path === root || path.startsWith(`${root}/`),
  );
}
