import { readErrorDetail } from "@/lib/http/api-error";
import type {
  CreateSupportConversationRequest,
  MarkSupportReadResponse,
  SupportConversationRead,
  SupportMessageRead,
  SupportWsTokenResponse,
} from "@/lib/types/support";

async function parseResponse<T>(response: Response): Promise<T> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  if (!response.ok) {
    throw new Error(readErrorDetail(body, response.status));
  }
  return body as T;
}

async function supportFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  return fetch(`/api/support${path}`, {
    ...init,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export async function openSupportConversation(
  tuningRequestId: string,
): Promise<SupportConversationRead> {
  const body: CreateSupportConversationRequest = {
    tuning_request_id: tuningRequestId,
  };
  const response = await supportFetch("/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}

export async function listSupportConversations(
  tuningRequestId?: string,
): Promise<SupportConversationRead[]> {
  const query = tuningRequestId
    ? `?tuning_request_id=${encodeURIComponent(tuningRequestId)}`
    : "";
  const response = await supportFetch(`/conversations${query}`);
  return parseResponse(response);
}

export async function listSupportMessages(
  conversationId: string,
  options?: { before?: string; limit?: number },
): Promise<SupportMessageRead[]> {
  const params = new URLSearchParams();
  if (options?.before) params.set("before", options.before);
  if (options?.limit) params.set("limit", String(options.limit));
  const query = params.size ? `?${params.toString()}` : "";
  const response = await supportFetch(
    `/conversations/${encodeURIComponent(conversationId)}/messages${query}`,
  );
  return parseResponse(response);
}

export async function markSupportConversationRead(
  conversationId: string,
): Promise<MarkSupportReadResponse> {
  const response = await supportFetch(
    `/conversations/${encodeURIComponent(conversationId)}/read`,
    { method: "POST" },
  );
  return parseResponse(response);
}

export async function getSupportWsToken(): Promise<string> {
  const response = await supportFetch("/ws-token");
  const payload = await parseResponse<SupportWsTokenResponse>(response);
  return payload.token;
}
