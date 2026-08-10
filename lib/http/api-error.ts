type FastApiDetail =
  | string
  | Array<{ msg?: string; loc?: Array<string | number> }>;

/**
 * Parse a FastAPI-style error body into a single user-facing string.
 * Used by the BE client, BFF routes, and browser forms.
 */
export function formatApiErrorDetail(
  status: number,
  body: unknown,
  fallback = `Request failed (${status})`,
): string {
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: FastApiDetail }).detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item) =>
          item && typeof item === "object" && "msg" in item
            ? String((item as { msg: unknown }).msg)
            : "Validation error",
        )
        .filter(Boolean)
        .join(" ");
    }
  }
  return fallback;
}

/** Client-form helper: read `detail` from a JSON error body. */
export function readErrorDetail(body: unknown, status: number): string {
  return formatApiErrorDetail(status, body);
}
