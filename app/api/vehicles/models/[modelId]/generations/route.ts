import { NextResponse } from "next/server";
import { listGenerationsByModel } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

type RouteContext = {
  params: Promise<{ modelId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const { modelId } = await context.params;

  try {
    const generations = await listGenerationsByModel(auth, modelId);
    return NextResponse.json(generations);
  } catch (error) {
    return toErrorResponse(error, "Could not load generations.");
  }
}
