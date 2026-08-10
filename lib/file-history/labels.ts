import type {
  TuningRequestRead,
  TuningRequestStatus,
} from "@/lib/types/file-history";

export function vehicleLabel(request: {
  vehicle_type: { name: string } | null;
  brand: { name: string } | null;
  model: { name: string } | null;
  generation: { name: string } | null;
  engine: { name: string } | null;
  ecu: { name: string } | null;
}): string {
  const parts = [
    request.vehicle_type?.name,
    request.brand?.name,
    request.model?.name,
    request.generation?.name,
    request.engine?.name,
    request.ecu?.name,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Unknown vehicle";
}

export function statusLabel(status: TuningRequestStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_progress":
      return "In progress";
    case "ready":
      return "Ready";
    default:
      return status;
  }
}

export type { TuningRequestRead };
