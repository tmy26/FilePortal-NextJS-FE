import { NextResponse } from "next/server";
import { listBrands } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

function readVehicleTypeId(request: Request): string | undefined {
  const raw = new URL(request.url).searchParams.get("vehicle_type_id");
  return raw?.trim() || undefined;
}

export async function GET(request: Request) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const vehicleTypeId = readVehicleTypeId(request);

  try {
    const brands = await listBrands(auth, vehicleTypeId);
    return NextResponse.json(brands);
  } catch (error) {
    return toErrorResponse(error, "Could not load brands.");
  }
}
