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
  const headline = vehicleHeadline(request);
  if (headline.typeName && headline.title !== "Unknown vehicle") {
    return `${headline.typeName} · ${headline.title}`;
  }
  return headline.typeName ?? headline.title;
}

export function vehicleHeadline(request: {
  vehicle_type: { name: string } | null;
  brand: { name: string } | null;
  model: { name: string } | null;
  generation: { name: string } | null;
  engine: { name: string } | null;
}): { typeName: string | null; title: string } {
  const typeName = request.vehicle_type?.name ?? null;
  const parts = [
    request.brand?.name,
    request.model?.name,
    request.generation?.name,
    request.engine?.name,
  ].filter(Boolean);
  return {
    typeName,
    title: parts.length > 0 ? parts.join(" · ") : "Unknown vehicle",
  };
}

export function formatTuningPoints(count: number): string {
  return `${count} TuningPoint${count === 1 ? "" : "s"}`;
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
