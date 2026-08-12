import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth/constants";

/**
 * Secure cookies only work over HTTPS. On plain HTTP (e.g. VPS IP smoke test)
 * set AUTH_COOKIE_SECURE=false. Production with TLS should leave this unset
 * (defaults to secure when NODE_ENV=production).
 *
 * SameSite=strict — cookies are never sent on cross-site requests (strongest CSRF
 * protection). If a third-party redirect back to the portal (e.g. Stripe) must
 * arrive with the session on the first GET, set AUTH_COOKIE_SAME_SITE=lax.
 */
function authCookieSecure(): boolean {
  const override = process.env.AUTH_COOKIE_SECURE;
  if (override === "true") return true;
  if (override === "false") return false;
  return process.env.NODE_ENV === "production";
}

type SameSitePolicy = "strict" | "lax" | "none";

function authCookieSameSite(): SameSitePolicy {
  const override = process.env.AUTH_COOKIE_SAME_SITE?.trim().toLowerCase();
  if (override === "lax" || override === "none") return override;
  return "strict";
}

export const AUTH_COOKIE_BASE = {
  httpOnly: true,
  get secure() {
    return authCookieSecure();
  },
  get sameSite() {
    return authCookieSameSite();
  },
  path: "/",
};

function baseCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: authCookieSecure(),
    sameSite: authCookieSameSite(),
    path: "/",
    maxAge,
  };
}

export function accessCookieOptions() {
  return baseCookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS);
}

export function refreshCookieOptions() {
  return baseCookieOptions(REFRESH_TOKEN_MAX_AGE_SECONDS);
}

export function accessExpiresAtCookieOptions() {
  return baseCookieOptions(ACCESS_TOKEN_MAX_AGE_SECONDS);
}

export type AccessTokenState =
  | "missing"
  | "valid"
  | "expiring"
  | "expired"
  | "unknown";

/**
 * Classify access lifetime using BE-advertised unix expiry (``fp_access_exp``).
 * Opaque access tokens are not JWTs — do not decode them.
 *
 * - `expiring`: within skew of expiry (proactive refresh window)
 * - missing exp with a present token: treat as `expiring` so we refresh once and
 *   populate ``fp_access_exp`` (legacy sessions)
 */
export function getAccessTokenState(
  token: string | null | undefined,
  expiresAtUnix?: number | null,
  skewMs = 15_000,
): AccessTokenState {
  if (!token) return "missing";

  if (expiresAtUnix == null || !Number.isFinite(expiresAtUnix)) {
    return "expiring";
  }

  const expiresAt = expiresAtUnix * 1000;
  const now = Date.now();
  if (expiresAt <= now) return "expired";
  if (expiresAt <= now + skewMs) return "expiring";
  return "valid";
}

/** True when the access token is missing or past / near ``exp`` (with a small skew). */
export function isAccessTokenExpired(
  token: string | null | undefined,
  expiresAtUnix?: number | null,
  skewMs = 15_000,
): boolean {
  const state = getAccessTokenState(token, expiresAtUnix, skewMs);
  return state === "missing" || state === "expired" || state === "expiring";
}

export function parseAccessExpiresAtCookie(
  value: string | null | undefined,
): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
