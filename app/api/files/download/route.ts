import { NextResponse } from "next/server";
import { getTuningFileDownloadUrl } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

export const runtime = "nodejs";

/**
 * Returns the BE presigned URL as JSON.
 * Browser must navigate to `download_url` via `window.location.href`.
 */
export async function GET(request: Request) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const url = new URL(request.url);
  const requestId = url.searchParams.get("requestId")?.trim() ?? "";
  const fileId = url.searchParams.get("fileId")?.trim() ?? "";

  if (!requestId || !fileId) {
    return NextResponse.json(
      { detail: "Missing request or file id." },
      { status: 400 },
    );
  }

  try {
    const payload = await getTuningFileDownloadUrl(auth, requestId, fileId);
    return NextResponse.json(payload);
  } catch (error) {
    return toErrorResponse(error, "Could not download file.");
  }
}
