"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormBanner } from "@/components/form-banner";
import { formatDate } from "@/lib/format";
import {
  getSupportWsToken,
  listSupportMessages,
  markSupportConversationRead,
  openSupportConversation,
} from "@/lib/support/client";
import { buildSupportWsUrl } from "@/lib/support/ws-url";
import type {
  SupportMessageRead,
  SupportWsClientEvent,
  SupportWsServerEvent,
} from "@/lib/types/support";

type ChatMessage = SupportMessageRead & {
  pending?: boolean;
};

type SupportChatProps = {
  tuningRequestId: string;
  currentUserId: string;
};

function sortMessages(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
}

function mergeMessage(
  messages: ChatMessage[],
  incoming: SupportMessageRead,
): ChatMessage[] {
  const withoutPending = messages.filter(
    (message) =>
      message.client_message_id !== incoming.client_message_id || !message.pending,
  );
  const existingIndex = withoutPending.findIndex(
    (message) => message.id === incoming.id,
  );
  if (existingIndex >= 0) {
    const next = [...withoutPending];
    next[existingIndex] = { ...incoming, pending: false };
    return sortMessages(next);
  }
  return sortMessages([...withoutPending, { ...incoming, pending: false }]);
}

export function SupportChat({ tuningRequestId, currentUserId }: SupportChatProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const markRead = useCallback(async (id: string) => {
    try {
      await markSupportConversationRead(id);
    } catch {
      // Non-blocking — history still loads if read receipt fails.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoading(true);
      setError(null);
      try {
        const conversation = await openSupportConversation(tuningRequestId);
        if (cancelled) return;

        setConversationId(conversation.id);
        const history = await listSupportMessages(conversation.id, { limit: 50 });
        if (cancelled) return;

        setMessages(sortMessages(history));
        await markRead(conversation.id);
      } catch (loadError) {
        if (cancelled) return;
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Could not load support chat.";
        setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [markRead, tuningRequestId]);

  useEffect(() => {
    if (!conversationId) return;

    const activeConversationId = conversationId;
    let closed = false;

    async function connect() {
      if (closed) return;

      try {
        const token = await getSupportWsToken();
        if (closed) return;

        const wsUrl = buildSupportWsUrl(activeConversationId, token);
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (closed) return;
          setConnected(true);
          setError(null);
        };

        socket.onclose = (event) => {
          if (closed) return;
          setConnected(false);
          wsRef.current = null;
          if (event.code !== 1000) {
            const reason = event.reason?.trim();
            setError(
              reason ||
                `Chat disconnected (${event.code}). Retrying…`,
            );
          }
          reconnectTimerRef.current = window.setTimeout(() => {
            void connect();
          }, 2500);
        };

        socket.onerror = () => {
          if (closed) return;
          setConnected(false);
        };

        socket.onmessage = (event) => {
          if (closed) return;
          let payload: SupportWsServerEvent;
          try {
            payload = JSON.parse(String(event.data)) as SupportWsServerEvent;
          } catch {
            return;
          }

          if (payload.type === "message.created") {
            setMessages((current) =>
              mergeMessage(current, {
                ...payload.data,
                read_at: null,
              }),
            );
            const activeConversationId = conversationIdRef.current;
            if (
              activeConversationId &&
              payload.data.sender_id !== currentUserId
            ) {
              void markRead(activeConversationId);
            }
            return;
          }

          if (payload.type === "error") {
            setError(payload.data.detail ?? "Chat error.");
          }
        };
      } catch (connectError) {
        if (closed) return;
        const message =
          connectError instanceof Error
            ? connectError.message
            : "Could not connect to chat.";
        setError(message);
        reconnectTimerRef.current = window.setTimeout(() => {
          void connect();
        }, 4000);
      }
    }

    void connect();

    return () => {
      closed = true;
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      wsRef.current?.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, [conversationId, currentUserId, markRead]);

  const sendMessage = useCallback(async () => {
    const content = draft.trim();
    if (!content || !conversationId || sending) return;

    const clientMessageId = crypto.randomUUID();
    const optimistic: ChatMessage = {
      id: clientMessageId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      sender_role: "client",
      client_message_id: clientMessageId,
      content,
      created_at: new Date().toISOString(),
      read_at: null,
      pending: true,
    };

    setDraft("");
    setSending(true);
    setMessages((current) => sortMessages([...current, optimistic]));

    const payload: SupportWsClientEvent = {
      type: "message.send",
      data: {
        client_message_id: clientMessageId,
        content,
      },
    };

    try {
      const socket = wsRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error("Chat is reconnecting. Try again in a moment.");
      }
      socket.send(JSON.stringify(payload));
    } catch (sendError) {
      setMessages((current) =>
        current.filter((message) => message.id !== clientMessageId),
      );
      setDraft(content);
      setError(
        sendError instanceof Error ? sendError.message : "Could not send message.",
      );
    } finally {
      setSending(false);
    }
  }, [conversationId, currentUserId, draft, sending]);

  const connectionLabel = useMemo(() => {
    if (loading) return "Loading chat…";
    if (connected) return "Connected";
    return "Reconnecting…";
  }, [connected, loading]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <section className="shop-panel support-chat-panel" aria-label="Support messages">
      <div className="support-chat-header">
        <h2 className="support-chat-title">Message support</h2>
        <p className={`support-chat-status${connected ? " is-live" : ""}`}>
          {connectionLabel}
        </p>
      </div>

      {error ? <FormBanner tone="error">{error}</FormBanner> : null}

      <div className="support-chat-messages" role="log" aria-live="polite">
        {loading ? (
          <p className="muted support-chat-empty">Loading conversation…</p>
        ) : messages.length === 0 ? (
          <p className="muted support-chat-empty">
            Ask a question about this request. We&apos;ll reply here.
          </p>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === currentUserId;
            return (
              <article
                key={`${message.id}-${message.client_message_id}`}
                className={[
                  "support-chat-bubble",
                  isOwn ? "is-own" : "is-other",
                  message.pending ? "is-pending" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <p className="support-chat-content">{message.content}</p>
                <p className="support-chat-time muted">
                  {formatDate(message.created_at)}
                  {message.pending ? " · Sending…" : ""}
                </p>
              </article>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="support-chat-compose" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="support-chat-input">
          Message
        </label>
        <textarea
          id="support-chat-input"
          className="support-chat-input"
          rows={3}
          maxLength={4000}
          placeholder="Write your message…"
          value={draft}
          disabled={loading || !conversationId}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage();
            }
          }}
        />
        <div className="support-chat-actions">
          <button
            type="submit"
            className="cta"
            disabled={loading || !conversationId || sending || !draft.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
}
