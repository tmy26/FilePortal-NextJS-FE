import { getApiBaseUrl } from "@/lib/config";
import type { AuthTokens } from "@/lib/types/user";

type RefreshAttempt =
  | { ok: true; tokens: AuthTokens }
  | { ok: false; status: number | null };

/** Collapse parallel refreshes that share the same refresh token. */
const inflightRefresh = new Map<string, Promise<RefreshAttempt>>();

/**
 * Call BE ``POST /auth/refresh`` and return the rotated opaque pair + access expiry.
 * Single-flight per refresh token string.
 */
export async function refreshAccessTokenPair(
  refreshToken: string,
  apiBase: string = getApiBaseUrl(),
): Promise<RefreshAttempt> {
  const existing = inflightRefresh.get(refreshToken);
  if (existing) return existing;

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

    const body = (await refreshResponse.json()) as {
      access?: string;
      refresh?: string;
      access_expires_at?: number;
    };

    if (
      !body?.access ||
      typeof body.access_expires_at !== "number" ||
      !Number.isFinite(body.access_expires_at)
    ) {
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
        access: body.access,
        refresh: body.refresh || refreshToken,
        access_expires_at: body.access_expires_at,
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
