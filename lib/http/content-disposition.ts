/** Chars that could terminate or inject a header line, plus quoting specials. */
const UNSAFE_HEADER_CHARS = /[\r\n\0"\\]/g;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

/**
 * Builds a safe `Content-Disposition` value for an attachment.
 * Filenames reach us from uploads and path params, so never interpolate raw.
 */
export function attachmentDisposition(
  filename: string,
  fallback = "download.bin",
): string {
  const cleaned = filename
    .replace(CONTROL_CHARS, "")
    .replace(UNSAFE_HEADER_CHARS, "_")
    .trim()
    .slice(0, 180);
  const ascii = cleaned || fallback;
  const encoded = encodeURIComponent(cleaned || fallback);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
