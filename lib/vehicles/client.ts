import { formatApiErrorDetail } from "@/lib/http/api-error";
import type {
  BrandRead,
  Gearbox,
  VehicleEcuRead,
  VehicleEngineRead,
  VehicleGenerationRead,
  VehicleModelRead,
  VehicleTypeRead,
} from "@/lib/types/vehicle";
import { withVehicleTypeIdQuery } from "@/lib/vehicles/query";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    throw new Error(formatApiErrorDetail(response.status, body));
  }

  return response.json() as Promise<T>;
}

export function listVehicleTypes(): Promise<VehicleTypeRead[]> {
  return fetchJson<VehicleTypeRead[]>("/api/vehicles/types");
}

export function listBrands(vehicleTypeId?: string): Promise<BrandRead[]> {
  return fetchJson<BrandRead[]>(
    withVehicleTypeIdQuery("/api/vehicles/brands", vehicleTypeId),
  );
}

export function listModelsByBrand(
  brandId: string,
  vehicleTypeId?: string,
): Promise<VehicleModelRead[]> {
  return fetchJson<VehicleModelRead[]>(
    withVehicleTypeIdQuery(
      `/api/vehicles/brands/${encodeURIComponent(brandId)}/models`,
      vehicleTypeId,
    ),
  );
}

export function listGenerationsByModel(
  modelId: string,
): Promise<VehicleGenerationRead[]> {
  return fetchJson<VehicleGenerationRead[]>(
    `/api/vehicles/models/${encodeURIComponent(modelId)}/generations`,
  );
}

export function listEnginesByGeneration(
  generationId: string,
): Promise<VehicleEngineRead[]> {
  return fetchJson<VehicleEngineRead[]>(
    `/api/vehicles/generations/${encodeURIComponent(generationId)}/engines`,
  );
}

export function listEcusByEngine(engineId: string): Promise<VehicleEcuRead[]> {
  return fetchJson<VehicleEcuRead[]>(
    `/api/vehicles/engines/${encodeURIComponent(engineId)}/ecus`,
  );
}

export function listGearboxes(): Promise<Gearbox[]> {
  return fetchJson<Gearbox[]>("/api/vehicles/gearboxes");
}

export function formatGearboxLabel(value: Gearbox): string {
  return value === "manual" ? "Manual" : "Automatic";
}
