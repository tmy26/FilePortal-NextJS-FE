import { NextResponse } from "next/server";
import { listModelsByBrand } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

type RouteContext = {
  params: Promise<{ brandId: string }>;
};

function readVehicleTypeId(request: Request): string | undefined {
  const raw = new URL(request.url).searchParams.get("vehicle_type_id");
  return raw?.trim() || undefined;
}

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const { brandId } = await context.params;
  const vehicleTypeId = readVehicleTypeId(request);

  try {
    const models = await listModelsByBrand(auth, brandId, vehicleTypeId);
    return NextResponse.json(models);
  } catch (error) {
    return toErrorResponse(error, "Could not load models.");
  }
}
