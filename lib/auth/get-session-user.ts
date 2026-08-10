import { getCurrentUser } from "@/lib/api";
import { getAccessToken } from "@/lib/auth/session";
import type { UserRead } from "@/lib/types/user";

/**
 * Loads the signed-in user via BE `GET /user/` using the stored access JWT.
 * Called from the root layout on every request / page refresh.
 *
 * Uses the proxy-refreshed token when present (same request), otherwise the
 * access cookie. Read-only in Server Components — do not clear cookies here.
 */
export async function getSessionUser(): Promise<UserRead | null> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return null;
  }

  try {
    return await getCurrentUser(accessToken);
  } catch {
    return null;
  }
}
