/** Preferred public origin — sitemap, canonical, JSON-LD, and host redirects. */
export const CANONICAL_ORIGIN = "https://ecufileportal.com";
export const CANONICAL_HOST = "ecufileportal.com";
export const CANONICAL_WWW_HOST = "www.ecufileportal.com";

function isLocalHostname(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

/**
 * 301 target for http and/or www. One hop to https://ecufileportal.com + path.
 * Localhost is never redirected.
 */
export function getCanonicalRedirectUrl(input: {
  hostname: string;
  protocol: string;
  pathname: string;
  search: string;
}): string | null {
  const hostname = input.hostname.trim().toLowerCase();
  if (!hostname || isLocalHostname(hostname)) return null;

  const protocol = input.protocol.split(",")[0]?.trim().toLowerCase() ?? "";
  const isWww = hostname === CANONICAL_WWW_HOST;
  const isApex = hostname === CANONICAL_HOST;
  if (!isWww && !isApex) return null;

  const needsHttps = protocol === "http";
  if (!isWww && !needsHttps) return null;

  const path = input.pathname.startsWith("/") ? input.pathname : `/${input.pathname}`;
  const search = input.search.startsWith("?") || input.search === ""
    ? input.search
    : `?${input.search}`;
  return `${CANONICAL_ORIGIN}${path}${search}`;
}
