import { NextResponse } from "next/server";
import { proxyTransferDownload } from "@/lib/api";
import { getAccessToken } from "@/lib/auth/session";
import { attachmentDisposition } from "@/lib/http/content-disposition";

export const runtime = "nodejs";
export const maxDuration = 300;

type RouteContext = {
  params: Promise<{ jobId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  }

  const { jobId } = await context.params;
  if (!jobId) {
    return NextResponse.json({ detail: "Missing job id." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await proxyTransferDownload(accessToken, jobId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not download transfer.";
    return NextResponse.json({ detail: message }, { status: 502 });
  }

  if (!upstream.ok) {
    let detail = `Download failed (${upstream.status})`;
    try {
      const body = (await upstream.json()) as { detail?: unknown };
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      // keep status fallback
    }
    return NextResponse.json({ detail }, { status: upstream.status });
  }

  const headers = new Headers();
  headers.set("Content-Type", "application/octet-stream");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set(
    "Content-Disposition",
    attachmentDisposition(`transferred_${jobId}.bin`),
  );
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  });
}
