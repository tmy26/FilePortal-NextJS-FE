import { NextResponse } from "next/server";
import { listGearboxes } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

export async function GET() {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  try {
    const gearboxes = await listGearboxes(auth);
    return NextResponse.json(gearboxes);
  } catch (error) {
    return toErrorResponse(error, "Could not load gearboxes.");
  }
}
