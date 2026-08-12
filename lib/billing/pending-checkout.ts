/**
 * Pending Stripe Checkout session id — survives cross-site return when cookies
 * are missing (SameSite) so we can still confirm after re-login.
 */

export const PENDING_CHECKOUT_SESSION_KEY = "file-portal-pending-checkout";

export function savePendingCheckoutSessionId(sessionId: string): void {
  if (typeof window === "undefined") return;
  const trimmed = sessionId.trim();
  if (!trimmed) return;
  try {
    window.localStorage.setItem(PENDING_CHECKOUT_SESSION_KEY, trimmed);
  } catch {
    // ignore quota / private mode
  }
}

export function readPendingCheckoutSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(PENDING_CHECKOUT_SESSION_KEY);
  } catch {
    return null;
  }
}

export function clearPendingCheckoutSessionId(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PENDING_CHECKOUT_SESSION_KEY);
  } catch {
    // ignore
  }
}
