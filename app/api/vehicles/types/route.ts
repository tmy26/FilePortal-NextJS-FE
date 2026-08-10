import { NextResponse } from "next/server";
import { listVehicleTypes } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

export async function GET() {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  try {
    const types = await listVehicleTypes(auth);
    return NextResponse.json(types);
  } catch (error) {
    return toErrorResponse(error, "Could not load vehicle types.");
  }
}
