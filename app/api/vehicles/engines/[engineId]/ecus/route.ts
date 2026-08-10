import { NextResponse } from "next/server";
import { listEcusByEngine } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

type RouteContext = {
  params: Promise<{ engineId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const { engineId } = await context.params;

  try {
    const ecus = await listEcusByEngine(auth, engineId);
    return NextResponse.json(ecus);
  } catch (error) {
    return toErrorResponse(error, "Could not load ECUs.");
  }
}
