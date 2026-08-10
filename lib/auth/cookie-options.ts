import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth/constants";

export const AUTH_COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function accessCookieOptions() {
  return {
    ...AUTH_COOKIE_BASE,
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  };
}

export function refreshCookieOptions() {
  return {
    ...AUTH_COOKIE_BASE,
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
  };
}

export type AccessTokenState =
  | "missing"
  | "valid"
  | "expiring"
  | "expired"
  | "unknown";

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

/**
 * Classify access JWT lifetime.
 * - `expiring`: within skew of expiry (proactive refresh window)
 * - `unknown`: not a decodable JWT — do NOT treat as expired (avoids refresh storms)
 */
export function getAccessTokenState(
  token: string | null | undefined,
  skewMs = 15_000,
): AccessTokenState {
  if (!token) return "missing";

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return "unknown";

  const expiresAt = payload.exp * 1000;
  const now = Date.now();
  if (expiresAt <= now) return "expired";
  if (expiresAt <= now + skewMs) return "expiring";
  return "valid";
}

/** True when the JWT is missing, malformed, or past `exp` (with a small skew). */
export function isAccessTokenExpired(token: string, skewMs = 15_000): boolean {
  const state = getAccessTokenState(token, skewMs);
  return state === "missing" || state === "expired" || state === "expiring";
}
