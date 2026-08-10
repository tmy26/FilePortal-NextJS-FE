export type VehicleCatalogRef = {
  uuid: string;
  name: string;
};

export type TuningRequestOptionRead = {
  name: string;
  tuning_points_cost: number;
};

export type TuningRequestStatus = "pending" | "in_progress" | "ready";

export type TuningFileRole = "original" | "processed";

export type TuningFileUploader = "user" | "admin";

/** List shape from `GET /files` — no file payloads. */
export type TuningRequestRead = {
  uuid: string;
  status: TuningRequestStatus;
  file_kind: string;
  gearbox: string;
  tuning_points_spent: number;
  vehicle_type: VehicleCatalogRef | null;
  brand: VehicleCatalogRef | null;
  model: VehicleCatalogRef | null;
  generation: VehicleCatalogRef | null;
  engine: VehicleCatalogRef | null;
  ecu: VehicleCatalogRef | null;
  tuning_options: TuningRequestOptionRead[];
  created: string;
};

/** One stored object on a request (`GET /files/{id}` → `files`). */
export type TuningFileRead = {
  uuid: string;
  role: TuningFileRole;
  version: number;
  original_filename: string;
  file_size_bytes: number;
  uploaded_by: TuningFileUploader;
  created: string;
};

/** Detail shape from `GET /files/{id}` — includes original + processed files. */
export type TuningRequestDetailRead = TuningRequestRead & {
  files: TuningFileRead[];
};

/** Presigned URL from `GET /files/{requestId}/files/{fileId}/download`. */
export type FileDownloadResponse = {
  download_url: string;
  expires_in: number;
};
