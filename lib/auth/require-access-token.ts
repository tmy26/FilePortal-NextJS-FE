import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/session";
import { formatApiErrorDetail } from "@/lib/http/api-error";

export async function requireAccessToken(
  unauthorizedDetail = "Sign in required.",
): Promise<string | NextResponse> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ detail: unauthorizedDetail }, { status: 401 });
  }
  return accessToken;
}

export function isNextResponse(
  value: string | NextResponse,
): value is NextResponse {
  return typeof value !== "string";
}

/** Map a thrown Error (often from lib/api) to a JSON BFF response. */
export function toErrorResponse(
  error: unknown,
  fallback = "Request failed.",
  defaultStatus = 502,
): NextResponse {
  const message = error instanceof Error ? error.message : fallback;
  const lower = message.toLowerCase();
  let status = defaultStatus;
  if (lower.includes("not found")) status = 404;
  else if (lower.includes("sign in") || lower.includes("unauthorized")) {
    status = 401;
  }
  return NextResponse.json(
    { detail: formatApiErrorDetail(status, { detail: message }, message) },
    { status },
  );
}
