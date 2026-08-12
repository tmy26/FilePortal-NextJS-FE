/**
 * Allow only same-origin relative paths for post-login redirects.
 * Rejects protocol-relative (`//evil`), backslash tricks, and encoded variants.
 */
export function safeInternalPath(value: string | null | undefined): string | null {
  if (!value) return null;

  let candidate = value.trim();
  if (!candidate) return null;

  // Decode once so /%2f%2fevil.com cannot bypass the // check.
  try {
    candidate = decodeURIComponent(candidate);
  } catch {
    return null;
  }

  candidate = candidate.trim();
  if (!candidate.startsWith("/")) return null;
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) return null;
  if (candidate.includes("\\") || candidate.includes("\0")) return null;
  if (candidate.includes("://")) return null;

  return candidate;
}
