import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_EXPIRES_AT_COOKIE,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESHED_ACCESS_HEADER,
} from "@/lib/auth/constants";
import {
  accessCookieOptions,
  accessExpiresAtCookieOptions,
  getAccessTokenState,
  parseAccessExpiresAtCookie,
  refreshCookieOptions,
  type AccessTokenState,
} from "@/lib/auth/cookie-options";
import { refreshAccessTokenPair } from "@/lib/auth/refresh-tokens";
import { getApiBaseUrlOrNull } from "@/lib/config";
import {
  isAllowedPublicHost,
  isGoneSpamPath,
  normalizeHostname,
} from "@/lib/seo/spam-cleanup";
import { getCanonicalRedirectUrl } from "@/lib/seo/canonical-host";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Only this proxy may set the refreshed-token header. A client could otherwise
 * send it and have server code trust an attacker-supplied token instead of the
 * httpOnly cookie, so drop any inbound copy before the handler runs.
 */
function sanitizedRequestHeaders(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(REFRESHED_ACCESS_HEADER);
  return requestHeaders;
}

function passThrough(request: NextRequest): NextResponse {
  return NextResponse.next({
    request: { headers: sanitizedRequestHeaders(request) },
  });
}

function clearCookie(
  response: NextResponse,
  name: string,
  options: ReturnType<typeof accessCookieOptions>,
) {
  response.cookies.set(name, "", {
    ...options,
    maxAge: 0,
    expires: new Date(0),
  });
}

function clearAuthCookies(response: NextResponse): NextResponse {
  clearCookie(response, ACCESS_TOKEN_COOKIE, accessCookieOptions());
  clearCookie(response, REFRESH_TOKEN_COOKIE, refreshCookieOptions());
  clearCookie(response, ACCESS_EXPIRES_AT_COOKIE, accessExpiresAtCookieOptions());
  return response;
}

function shouldAttemptRefresh(state: AccessTokenState): boolean {
  return state === "missing" || state === "expired" || state === "expiring";
}

function goneResponse(): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>410 Gone</title></head><body><h1>410 Gone</h1><p>This URL does not exist.</p></body></html>`,
    {
      status: 410,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}

/**
 * Refresh access before the page/API handler runs using BE ``access_expires_at``.
 *
 * On hard refresh auth failure (401/403) we clear the dead refresh cookie so
 * subsequent requests stop hammering the API. Soft failures (network/5xx /
 * races) keep cookies.
 *
 * Spam / unknown-host requests return 410 first so they never inherit homepage
 * metadata (canonical, keywords, JSON-LD).
 */
export async function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  if (host && !isAllowedPublicHost(host, SITE_URL)) {
    return goneResponse();
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const protocol = (
    forwardedProto?.split(",")[0]?.trim() ||
    request.nextUrl.protocol.replace(":", "")
  ).toLowerCase();
  const canonicalUrl = getCanonicalRedirectUrl({
    hostname: normalizeHostname(host ?? ""),
    protocol,
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
  });
  if (canonicalUrl) {
    return NextResponse.redirect(canonicalUrl, 301);
  }

  if (isGoneSpamPath(request.nextUrl.pathname)) {
    return goneResponse();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
  const expiresAt = parseAccessExpiresAtCookie(
    request.cookies.get(ACCESS_EXPIRES_AT_COOKIE)?.value,
  );
  const accessState = getAccessTokenState(accessToken, expiresAt);

  // Expired access and nothing to refresh with — drop the stale cookies.
  if (
    (accessState === "expired" || accessState === "expiring") &&
    !refreshToken
  ) {
    return clearAuthCookies(passThrough(request));
  }

  if (!refreshToken || !shouldAttemptRefresh(accessState)) {
    return passThrough(request);
  }

  const apiBase = getApiBaseUrlOrNull();
  if (!apiBase) {
    return passThrough(request);
  }

  const result = await refreshAccessTokenPair(refreshToken, apiBase);

  if (!result.ok) {
    const response = passThrough(request);
    // Only clear when access is already unusable. Do not clear on "expiring"
    // failures — a parallel request may have rotated the refresh token.
    if (
      (result.status === 401 || result.status === 403) &&
      (accessState === "missing" || accessState === "expired")
    ) {
      clearAuthCookies(response);
    }
    return response;
  }

  const requestHeaders = sanitizedRequestHeaders(request);
  requestHeaders.set(REFRESHED_ACCESS_HEADER, result.tokens.access);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    result.tokens.access,
    accessCookieOptions(),
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    result.tokens.refresh,
    refreshCookieOptions(),
  );
  response.cookies.set(
    ACCESS_EXPIRES_AT_COOKIE,
    String(result.tokens.access_expires_at),
    accessExpiresAtCookieOptions(),
  );
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
