import { getApiBaseUrl } from "@/lib/config";
import { formatApiErrorDetail } from "@/lib/http/api-error";
import type {
  LoginRequest,
  LoginResponse,
  UserCreate,
  UserRead,
} from "@/lib/types/user";
import type {
  BrandRead,
  Gearbox,
  VehicleEcuRead,
  VehicleEngineRead,
  VehicleGenerationRead,
  VehicleModelRead,
  VehicleTypeRead,
} from "@/lib/types/vehicle";
import type { TuningOptionRead } from "@/lib/types/tuning";
import type { TransferJobRead } from "@/lib/types/transfer";
import type {
  FileDownloadResponse,
  TuningRequestDetailRead,
  TuningRequestRead,
} from "@/lib/types/file-history";
import { withVehicleTypeIdQuery } from "@/lib/vehicles/query";

/** Default API timeout — prevents hung SSR / soft-nav when the BE is unreachable. */
const API_FETCH_TIMEOUT_MS = 15_000;
const API_UPLOAD_TIMEOUT_MS = 300_000;

function apiSignal(timeoutMs = API_FETCH_TIMEOUT_MS): AbortSignal {
  return AbortSignal.timeout(timeoutMs);
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new Error(formatApiErrorDetail(response.status, body));
  }

  return body as T;
}

async function postJson<T>(path: string, data: unknown): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
    signal: apiSignal(),
  });

  return parseJsonResponse<T>(response);
}

async function getJson<T>(path: string, accessToken?: string): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "GET",
    headers,
    cache: "no-store",
    signal: apiSignal(),
  });

  return parseJsonResponse<T>(response);
}

export async function listVehicleTypes(
  accessToken: string,
): Promise<VehicleTypeRead[]> {
  return getJson<VehicleTypeRead[]>("/vehicles/types", accessToken);
}

export async function listBrands(
  accessToken: string,
  vehicleTypeId?: string,
): Promise<BrandRead[]> {
  return getJson<BrandRead[]>(
    withVehicleTypeIdQuery("/vehicles/brands", vehicleTypeId),
    accessToken,
  );
}

export async function listModelsByBrand(
  accessToken: string,
  brandId: string,
  vehicleTypeId?: string,
): Promise<VehicleModelRead[]> {
  return getJson<VehicleModelRead[]>(
    withVehicleTypeIdQuery(
      `/vehicles/brands/${encodeURIComponent(brandId)}/models`,
      vehicleTypeId,
    ),
    accessToken,
  );
}

export async function listGenerationsByModel(
  accessToken: string,
  modelId: string,
): Promise<VehicleGenerationRead[]> {
  return getJson<VehicleGenerationRead[]>(
    `/vehicles/models/${encodeURIComponent(modelId)}/generations`,
    accessToken,
  );
}

export async function listEnginesByGeneration(
  accessToken: string,
  generationId: string,
): Promise<VehicleEngineRead[]> {
  return getJson<VehicleEngineRead[]>(
    `/vehicles/generations/${encodeURIComponent(generationId)}/engines`,
    accessToken,
  );
}

export async function listEcusByEngine(
  accessToken: string,
  engineId: string,
): Promise<VehicleEcuRead[]> {
  return getJson<VehicleEcuRead[]>(
    `/vehicles/engines/${encodeURIComponent(engineId)}/ecus`,
    accessToken,
  );
}

export async function listGearboxes(accessToken: string): Promise<Gearbox[]> {
  return getJson<Gearbox[]>("/vehicles/gearboxes", accessToken);
}

export async function listTuningOptions(
  accessToken: string,
): Promise<TuningOptionRead[]> {
  return getJson<TuningOptionRead[]>("/tuning-options", accessToken);
}

export async function createUser(data: UserCreate): Promise<UserRead> {
  return postJson<UserRead>("/user/create", data);
}

export async function verifyEmail(token: string): Promise<UserRead> {
  return postJson<UserRead>("/user/verify-email", { token });
}

export async function resendVerificationEmail(
  email: string,
): Promise<{ detail: string }> {
  return postJson<{ detail: string }>("/user/resend-verification", { email });
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return postJson<LoginResponse>("/auth/login", data);
}

/** Authenticated `GET /user/` — requires a Bearer access JWT. */
export async function getCurrentUser(accessToken: string): Promise<UserRead> {
  const response = await fetch(`${getApiBaseUrl()}/user/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
    signal: apiSignal(),
  });

  return parseJsonResponse<UserRead>(response);
}

/** Authenticated `POST /auth/logout` — revokes refresh tokens on the BE. */
export async function logoutUser(accessToken: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/auth/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
    signal: apiSignal(),
  });

  await parseJsonResponse<{ detail?: string }>(response);
}

/** Authenticated `DELETE /user/delete` — permanently removes the current user. */
export async function deleteUser(
  accessToken: string,
): Promise<{ detail: string }> {
  const response = await fetch(`${getApiBaseUrl()}/user/delete`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
    signal: apiSignal(),
  });

  return parseJsonResponse<{ detail: string }>(response);
}

/** Stream `POST /files/upload` — forwards multipart body to the BE. */
export async function proxyFileUpload(
  accessToken: string,
  body: ReadableStream<Uint8Array>,
  contentType: string,
): Promise<Response> {
  return fetch(`${getApiBaseUrl()}/files/upload`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": contentType,
    },
    body,
    cache: "no-store",
    signal: apiSignal(API_UPLOAD_TIMEOUT_MS),
    // Required by Node/undici when the request body is a stream.
    duplex: "half",
  } as RequestInit);
}

/** Authenticated `GET /files` — status/vehicle only; no file payloads. */
export async function listTuningRequests(
  accessToken: string,
  limit = 50,
  offset = 0,
): Promise<TuningRequestRead[]> {
  return getJson(
    `/files?limit=${limit}&offset=${offset}`,
    accessToken,
  );
}

/** Authenticated `GET /files/{id}` — includes original and processed files. */
export async function getTuningRequest(
  accessToken: string,
  requestId: string,
): Promise<TuningRequestDetailRead> {
  return getJson(`/files/${encodeURIComponent(requestId)}`, accessToken);
}

/**
 * Authenticated `GET /files/{requestId}/files/{fileId}/download`.
 * Both ids come from the detail response — never invent paths from role/version.
 */
export async function getTuningFileDownloadUrl(
  accessToken: string,
  requestId: string,
  fileId: string,
): Promise<FileDownloadResponse> {
  return getJson(
    `/files/${encodeURIComponent(requestId)}/files/${encodeURIComponent(fileId)}/download`,
    accessToken,
  );
}

/** Stream `POST /transfers` — forwards multipart body to the BE. */
export async function proxyTransferCreate(
  accessToken: string,
  body: ReadableStream<Uint8Array>,
  contentType: string,
): Promise<Response> {
  return fetch(`${getApiBaseUrl()}/transfers`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": contentType,
    },
    body,
    cache: "no-store",
    signal: apiSignal(API_UPLOAD_TIMEOUT_MS),
    duplex: "half",
  } as RequestInit);
}

/** Authenticated `GET /transfers/{id}`. */
export async function getTransferJob(
  accessToken: string,
  jobId: string,
): Promise<TransferJobRead> {
  return getJson(`/transfers/${encodeURIComponent(jobId)}`, accessToken);
}

/** Authenticated `GET /transfers/{id}/download` — streams the patched binary. */
export async function proxyTransferDownload(
  accessToken: string,
  jobId: string,
): Promise<Response> {
  return fetch(
    `${getApiBaseUrl()}/transfers/${encodeURIComponent(jobId)}/download`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: apiSignal(API_UPLOAD_TIMEOUT_MS),
    },
  );
}

type CheckoutSessionResponse = {
  payment_url: string;
};

export type ConfirmCheckoutResponse = {
  detail: string;
  user_id?: string;
  points_credited?: number;
  stripe_session_id?: string;
};

/** Authenticated `POST /billing/create-checkout-session`. */
export async function createCheckoutSession(
  accessToken: string,
  quantity: number,
): Promise<CheckoutSessionResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/billing/create-checkout-session`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ quantity }),
      cache: "no-store",
      signal: apiSignal(),
    },
  );

  return parseJsonResponse<CheckoutSessionResponse>(response);
}

/** Authenticated `POST /billing/confirm-checkout` — fulfill after Stripe redirect. */
export async function confirmCheckoutSession(
  accessToken: string,
  sessionId: string,
): Promise<ConfirmCheckoutResponse> {
  const response = await fetch(`${getApiBaseUrl()}/billing/confirm-checkout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ session_id: sessionId }),
    cache: "no-store",
    signal: apiSignal(),
  });

  return parseJsonResponse<ConfirmCheckoutResponse>(response);
}
