/** Append `vehicle_type_id` query param when present. */
export function withVehicleTypeIdQuery(
  path: string,
  vehicleTypeId?: string,
): string {
  if (!vehicleTypeId) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}vehicle_type_id=${encodeURIComponent(vehicleTypeId)}`;
}
