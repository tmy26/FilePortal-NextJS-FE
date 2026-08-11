import { cookies, headers } from "next/headers";
import {
  ACCESS_EXPIRES_AT_COOKIE,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESHED_ACCESS_HEADER,
} from "@/lib/auth/constants";
import {
  AUTH_COOKIE_BASE,
  accessCookieOptions,
  accessExpiresAtCookieOptions,
  refreshCookieOptions,
} from "@/lib/auth/cookie-options";
import type { AuthTokens } from "@/lib/types/user";

export async function setAuthTokens(tokens: AuthTokens): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.access, accessCookieOptions());
  cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refresh, refreshCookieOptions());
  cookieStore.set(
    ACCESS_EXPIRES_AT_COOKIE,
    String(tokens.access_expires_at),
    accessExpiresAtCookieOptions(),
  );
}

export async function clearAuthTokens(): Promise<void> {
  const cookieStore = await cookies();

  for (const name of [
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    ACCESS_EXPIRES_AT_COOKIE,
  ]) {
    cookieStore.set(name, "", {
      ...AUTH_COOKIE_BASE,
      maxAge: 0,
      expires: new Date(0),
    });
    cookieStore.delete({
      name,
      path: "/",
    });
  }
}

/**
 * Prefer the access token the proxy just refreshed on this request.
 * The request cookie can still be the expired value until the browser
 * stores Set-Cookie from the response — API routes must not use that.
 */
export async function getAccessToken(): Promise<string | null> {
  const headerStore = await headers();
  const refreshed = headerStore.get(REFRESHED_ACCESS_HEADER);
  if (refreshed) return refreshed;

  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}
