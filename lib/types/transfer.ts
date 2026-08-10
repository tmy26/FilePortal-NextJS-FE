export type TransferJobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed";

export type TransferSummary = {
  logical_patches: number;
  ordinary_resolved_full: number;
  dynamic_mapped_slots: number;
  dynamic_object_count: number;
  template_substitution_count: number;
  source_changed_bytes_total: number;
  accounted_patch_changed_bytes: number;
  accounted_patch_coverage: number;
  output_changed_bytes_from_target: number;
};

export type TransferJobRead = {
  uuid: string;
  status: TransferJobStatus;
  created: string;
  started_at: string | null;
  finished_at: string | null;
  original_filename: string;
  tuned_filename: string;
  target_filename: string;
  firmware_size_bytes: number;
  output_filename: string | null;
  output_size_bytes: number | null;
  output_sha256: string | null;
  download_available: boolean;
  tuning_points_spent: number;
  tuning_points_refunded: number;
  summary: TransferSummary | null;
  warnings: string[];
  error_detail: string | null;
};

export function isTransferTerminal(status: TransferJobStatus): boolean {
  return status === "succeeded" || status === "failed";
}
