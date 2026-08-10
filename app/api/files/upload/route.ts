import { NextResponse } from "next/server";
import { getCurrentUser, proxyFileUpload } from "@/lib/api";
import { getAccessToken } from "@/lib/auth/session";
import { formatApiErrorDetail } from "@/lib/http/api-error";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_UPLOAD_BYTES = 200 * 1024 * 1024; // 200 MB

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ detail: "Sign in to upload." }, { status: 401 });
  }

  try {
    const user = await getCurrentUser(accessToken);
    if (user.tuning_points <= 0) {
      return NextResponse.json(
        {
          detail:
            "You need TuningPoints to upload a file. Buy some in the shop.",
        },
        { status: 403 },
      );
    }
  } catch {
    return NextResponse.json({ detail: "Sign in to upload." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { detail: "Expected multipart form data." },
      { status: 400 },
    );
  }

  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { detail: "File is too large (max 200 MB)." },
        { status: 413 },
      );
    }
  }

  if (!request.body) {
    return NextResponse.json(
      { detail: "Missing upload body." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await proxyFileUpload(accessToken, request.body, contentType);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not reach upload API.";
    return NextResponse.json({ detail: message }, { status: 502 });
  }

  let body: unknown = null;
  const responseText = await upstream.text();
  if (responseText) {
    try {
      body = JSON.parse(responseText) as unknown;
    } catch {
      body = null;
    }
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        detail: formatApiErrorDetail(
          upstream.status,
          body,
          `Upload failed (${upstream.status})`,
        ),
      },
      { status: upstream.status },
    );
  }

  if (body === null) {
    return new NextResponse(null, { status: upstream.status });
  }

  return NextResponse.json(body, { status: upstream.status });
}
