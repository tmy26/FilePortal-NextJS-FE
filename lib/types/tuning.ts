export type TuningOptionRead = {
  uuid: string;
  name: string;
  tuning_points_cost: number;
};

export function totalTuningPoints(
  options: TuningOptionRead[],
  selectedIds: string[],
): number {
  const byId = new Map(options.map((option) => [option.uuid, option]));
  return selectedIds.reduce(
    (sum, id) => sum + (byId.get(id)?.tuning_points_cost ?? 0),
    0,
  );
}
