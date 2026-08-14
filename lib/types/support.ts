/** Support chat types mirroring BE `/support/*` responses. */

export type ConversationStatus = "open" | "closed";

export type SenderRole = "client" | "admin";

export type SupportConversationRead = {
  id: string;
  tuning_request_id: string;
  client_id: string;
  admin_id: string;
  status: ConversationStatus;
  created_at: string;
  updated_at: string | null;
  unread_count: number;
};

export type SupportMessageRead = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: SenderRole;
  client_message_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

export type CreateSupportConversationRequest = {
  tuning_request_id: string;
};

export type MarkSupportReadResponse = {
  conversation_id: string;
  read_at: string;
  updated_count: number;
};

export type SupportWsTokenResponse = {
  token: string;
};

export type SupportMessageCreatedEvent = {
  type: "message.created";
  data: {
    id: string;
    client_message_id: string;
    conversation_id: string;
    sender_id: string;
    sender_role: SenderRole;
    content: string;
    created_at: string;
  };
};

export type SupportWsErrorEvent = {
  type: "error";
  data: { detail: string };
};

export type SupportWsServerEvent =
  | SupportMessageCreatedEvent
  | SupportWsErrorEvent
  | { type: "messages.read"; data: Record<string, unknown> };

export type SupportWsClientEvent = {
  type: "message.send";
  data: {
    client_message_id: string;
    content: string;
  };
};
