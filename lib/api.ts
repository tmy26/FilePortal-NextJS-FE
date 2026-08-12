import { getApiBaseUrl } from "@/lib/config";
import { formatApiErrorDetail } from "@/lib/http/api-error";
import { refreshAccessTokenPair } from "@/lib/auth/refresh-tokens";
import { getRefreshToken, setAuthTokens } from "@/lib/auth/session";
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

/**
 * Authenticated fetch with one refresh+retry on 401 (BE opaque access expiry).
 * Stream bodies are not retried (cannot rewind).
 */
async function authorizedFetch(
  path: string,
  accessToken: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = API_FETCH_TIMEOUT_MS, headers, ...rest } = init;

  const doFetch = (token: string) =>
    fetch(`${getApiBaseUrl()}${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(headers as Record<string, string> | undefined),
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: apiSignal(timeoutMs),
    });

  const response = await doFetch(accessToken);
  if (response.status !== 401) {
    return response;
  }

  const body = rest.body;
  const isReplayableBody =
    body == null || typeof body === "string" || body instanceof URLSearchParams;

  if (!isReplayableBody) {
    return response;
  }

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return response;
  }

  const refreshed = await refreshAccessTokenPair(refreshToken);
  if (!refreshed.ok) {
    return response;
  }

  try {
    await setAuthTokens(refreshed.tokens);
  } catch {
    // Cookie mutation can fail in RSC; still retry this call with the new access.
  }

  return doFetch(refreshed.tokens.access);
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
  if (!accessToken) {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: apiSignal(),
    });
    return parseJsonResponse<T>(response);
  }

  const response = await authorizedFetch(path, accessToken, { method: "GET" });
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

export async function loginWithGoogle(
  idToken: string,
): Promise<LoginResponse> {
  return postJson<LoginResponse>("/auth/google", { id_token: idToken });
}

/** Authenticated `GET /user/` — requires a Bearer access token. */
export async function getCurrentUser(accessToken: string): Promise<UserRead> {
  const response = await authorizedFetch("/user/", accessToken, {
    method: "GET",
  });
  return parseJsonResponse<UserRead>(response);
}

/** Authenticated `POST /auth/logout` — revokes refresh tokens on the BE. */
export async function logoutUser(accessToken: string): Promise<void> {
  const response = await authorizedFetch("/auth/logout", accessToken, {
    method: "POST",
  });
  await parseJsonResponse<{ detail?: string }>(response);
}

/** Authenticated `DELETE /user/delete` — permanently removes the current user. */
export async function deleteUser(
  accessToken: string,
): Promise<{ detail: string }> {
  const response = await authorizedFetch("/user/delete", accessToken, {
    method: "DELETE",
  });
  return parseJsonResponse<{ detail: string }>(response);
}

/** Stream `POST /files/upload` — forwards multipart body to the BE. */
export async function proxyFileUpload(
  accessToken: string,
  body: ReadableStream<Uint8Array>,
  contentType: string,
): Promise<Response> {
  return authorizedFetch("/files/upload", accessToken, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
    },
    body,
    timeoutMs: API_UPLOAD_TIMEOUT_MS,
    // Required by Node/undici when the request body is a stream.
    duplex: "half",
  } as RequestInit & { timeoutMs: number });
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
  return authorizedFetch("/transfers", accessToken, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
    },
    body,
    timeoutMs: API_UPLOAD_TIMEOUT_MS,
    duplex: "half",
  } as RequestInit & { timeoutMs: number });
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
  return authorizedFetch(
    `/transfers/${encodeURIComponent(jobId)}/download`,
    accessToken,
    {
      method: "GET",
      timeoutMs: API_UPLOAD_TIMEOUT_MS,
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
  const response = await authorizedFetch(
    "/billing/create-checkout-session",
    accessToken,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    },
  );

  return parseJsonResponse<CheckoutSessionResponse>(response);
}

/** Authenticated `POST /billing/confirm-checkout` — fulfill after Stripe redirect. */
export async function confirmCheckoutSession(
  accessToken: string,
  sessionId: string,
): Promise<ConfirmCheckoutResponse> {
  const response = await authorizedFetch(
    "/billing/confirm-checkout",
    accessToken,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    },
  );

  return parseJsonResponse<ConfirmCheckoutResponse>(response);
}
