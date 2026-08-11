/**
 * Client-only “signed in” flag for chrome UI (nav / sidebar).
 * Cookies remain the real auth source; this controls what the shell shows.
 */

export const CLIENT_SIGNED_IN_KEY = "file-portal-signed-in";

const CHANGE_EVENT = "file-portal-signed-in-change";

export function isClientSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CLIENT_SIGNED_IN_KEY) === "1";
  } catch {
    return false;
  }
}

export function setClientSignedIn(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLIENT_SIGNED_IN_KEY, "1");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore quota / private mode
  }
}

export function clearClientSignedIn(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CLIENT_SIGNED_IN_KEY);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  function handleStorage(event: StorageEvent) {
    if (event.key === CLIENT_SIGNED_IN_KEY || event.key === null) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

/** Subscribe to the client signed-in flag (SSR snapshot is always false). */
export function getClientSignedInSnapshot(): boolean {
  return isClientSignedIn();
}

export function getClientSignedInServerSnapshot(): boolean {
  return false;
}

export { subscribe as subscribeClientSignedIn };
