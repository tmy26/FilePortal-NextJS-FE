import { NextResponse } from "next/server";
import { listEnginesByGeneration } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

type RouteContext = {
  params: Promise<{ generationId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const { generationId } = await context.params;

  try {
    const engines = await listEnginesByGeneration(auth, generationId);
    return NextResponse.json(engines);
  } catch (error) {
    return toErrorResponse(error, "Could not load engines.");
  }
}
