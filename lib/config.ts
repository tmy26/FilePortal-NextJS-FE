/** Backend API origin (no trailing slash). Throws if unset. */
export function getApiBaseUrl(): string {
  const base = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error(
      "Missing API_BASE_URL. Set it in .env.local (e.g. http://localhost:8000).",
    );
  }
  return base.replace(/\/$/, "");
}

/** Same as `getApiBaseUrl` but returns null when unset (proxy soft-fail). */
export function getApiBaseUrlOrNull(): string | null {
  const base = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return null;
  return base.replace(/\/$/, "");
}

/** Browser-visible API origin for WebSocket connections. */
export function getPublicApiBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) {
    throw new Error(
      "Missing NEXT_PUBLIC_API_BASE_URL. Set it in .env.local (e.g. http://localhost:8000).",
    );
  }
  return base.replace(/\/$/, "");
}

/** WebSocket origin derived from the public API base URL. */
export function getPublicWsBaseUrl(): string {
  return getPublicApiBaseUrl().replace(/^http/i, "ws");
}
