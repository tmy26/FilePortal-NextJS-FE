import { NextResponse } from "next/server";
import { getTransferJob } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ jobId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const { jobId } = await context.params;
  if (!jobId) {
    return NextResponse.json({ detail: "Missing job id." }, { status: 400 });
  }

  try {
    const job = await getTransferJob(auth, jobId);
    return NextResponse.json(job);
  } catch (error) {
    return toErrorResponse(error, "Could not load transfer.");
  }
}
