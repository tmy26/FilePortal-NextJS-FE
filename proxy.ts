import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REFRESHED_ACCESS_HEADER,
} from "@/lib/auth/constants";
import {
  accessCookieOptions,
  getAccessTokenState,
  refreshCookieOptions,
  type AccessTokenState,
} from "@/lib/auth/cookie-options";
import { getApiBaseUrlOrNull } from "@/lib/config";

type TokenPair = { access: string; refresh: string };

type RefreshAttempt =
  | { ok: true; tokens: TokenPair }
  | { ok: false; status: number | null };

/** Collapse parallel RSC refreshes that share the same refresh token. */
const inflightRefresh = new Map<string, Promise<RefreshAttempt>>();

/**
 * Only this proxy may set the refreshed-token header. A client could otherwise
 * send it and have server code trust an attacker-supplied JWT instead of the
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
  return response;
}

function shouldAttemptRefresh(state: AccessTokenState): boolean {
  // `unknown` = non-JWT / undecodable — keep using it; do not spam refresh.
  return state === "missing" || state === "expired" || state === "expiring";
}

async function refreshAccessToken(
  apiBase: string,
  refreshToken: string,
): Promise<RefreshAttempt> {
  const existing = inflightRefresh.get(refreshToken);
  if (existing) return existing;

  // Register the promise synchronously before any await so parallel RSC
  // requests share one refresh call instead of racing token rotation.
  let settle!: (result: RefreshAttempt) => void;
  const shared = new Promise<RefreshAttempt>((resolve) => {
    settle = resolve;
  });
  inflightRefresh.set(refreshToken, shared);

  try {
    const refreshResponse = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
      cache: "no-store",
    });

    if (!refreshResponse.ok) {
      const result: RefreshAttempt = {
        ok: false,
        status: refreshResponse.status,
      };
      settle(result);
      return result;
    }

    const tokens = (await refreshResponse.json()) as {
      access?: string;
      refresh?: string;
    };
    if (!tokens?.access) {
      const result: RefreshAttempt = {
        ok: false,
        status: refreshResponse.status,
      };
      settle(result);
      return result;
    }

    const result: RefreshAttempt = {
      ok: true,
      tokens: {
        access: tokens.access,
        // Rotation optional — reuse current refresh when BE omits a new one.
        refresh: tokens.refresh || refreshToken,
      },
    };
    settle(result);
    return result;
  } catch {
    const result: RefreshAttempt = { ok: false, status: null };
    settle(result);
    return result;
  } finally {
    inflightRefresh.delete(refreshToken);
  }
}

/**
 * Refresh access JWT before the page/API handler runs.
 *
 * On hard refresh auth failure (401/403) we clear the dead refresh cookie so
 * subsequent requests stop hammering the API. Soft failures (network/5xx /
 * races) keep cookies.
 */
export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
  const accessState = getAccessTokenState(accessToken);

  // Expired access and nothing to refresh with — drop the stale cookie.
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

  const result = await refreshAccessToken(apiBase, refreshToken);

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
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
