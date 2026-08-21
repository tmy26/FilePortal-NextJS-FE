"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { FormBanner } from "@/components/form-banner";
import {
  closeSupportConversation,
  getSupportWsToken,
  listSupportConversations,
  listSupportMessages,
  markSupportConversationRead,
  openSupportConversation,
  reopenSupportConversation,
} from "@/lib/support/client";
import { buildSupportWsUrl } from "@/lib/support/ws-url";
import type {
  ConversationStatus,
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

function formatChatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const sameDay = date.toDateString() === new Date().toDateString();
  return new Intl.DateTimeFormat("en-GB", {
    day: sameDay ? undefined : "numeric",
    month: sameDay ? undefined : "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function ChatIcon() {
  return (
    <svg
      className="support-widget-icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M4.5 5.75A2.75 2.75 0 0 1 7.25 3h9.5A2.75 2.75 0 0 1 19.5 5.75v8.5A2.75 2.75 0 0 1 16.75 17H12.3l-3.86 3.22A.9.9 0 0 1 7 19.55V17H7.25A2.75 2.75 0 0 1 4.5 14.25z"
      />
    </svg>
  );
}

function subscribeNoop() {
  return () => {};
}

function getClientMountedSnapshot() {
  return true;
}

function getServerMountedSnapshot() {
  return false;
}

function getWidgetHost(): HTMLElement {
  return document.getElementById("site-body") ?? document.body;
}

export function SupportChat({ tuningRequestId, currentUserId }: SupportChatProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [status, setStatus] = useState<ConversationStatus>("open");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientMountedSnapshot,
    getServerMountedSnapshot,
  );

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    const end = messagesEndRef.current;
    const list = end?.parentElement;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    scrollToBottom();
  }, [isOpen, messages, scrollToBottom]);

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
        const existing = await listSupportConversations(tuningRequestId);
        if (cancelled) return;

        const conversation = existing[0];
        if (!conversation) {
          return;
        }

        setConversationId(conversation.id);
        setStatus(conversation.status);
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

          if (payload.type === "conversation.updated") {
            setStatus(payload.data.status);
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
    if (!content || !conversationId || sending || status === "closed") return;

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
  }, [conversationId, currentUserId, draft, sending, status]);

  const conversationClosed = status === "closed";

  const connectionLabel = useMemo(() => {
    if (loading) return "Loading chat…";
    if (conversationClosed) return "Closed";
    if (connected) return "Connected";
    return "Reconnecting…";
  }, [connected, conversationClosed, loading]);

  const handleOpen = useCallback(async () => {
    setIsOpen(true);
    setError(null);

    if (!conversationId) {
      setLoading(true);
      try {
        const conversation = await openSupportConversation(tuningRequestId);
        setConversationId(conversation.id);
        setStatus(conversation.status);
        const history = await listSupportMessages(conversation.id, { limit: 50 });
        setMessages(sortMessages(history));
        await markRead(conversation.id);
      } catch (openError) {
        setError(
          openError instanceof Error
            ? openError.message
            : "Could not open support chat.",
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    if (status !== "closed") return;

    try {
      const conversation = await reopenSupportConversation(conversationId);
      setStatus(conversation.status);
    } catch (reopenError) {
      setError(
        reopenError instanceof Error
          ? reopenError.message
          : "Could not reopen support chat.",
      );
    }
  }, [conversationId, markRead, status, tuningRequestId]);

  const handleClose = useCallback(async () => {
    if (!conversationId || status === "closed") {
      setIsOpen(false);
      return;
    }

    setClosing(true);
    setError(null);
    try {
      const conversation = await closeSupportConversation(conversationId);
      setStatus(conversation.status);
      setIsOpen(false);
    } catch (closeError) {
      setError(
        closeError instanceof Error
          ? closeError.message
          : "Could not close support chat.",
      );
    } finally {
      setClosing(false);
    }
  }, [conversationId, status]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  const widget = (
    <div className="support-widget">
      {isOpen ? (
        <section
          className="support-widget-window"
          aria-label="Support messages"
        >
          <div className="support-widget-header">
            <div className="support-widget-heading">
              <h2 className="support-widget-title">TMYTuned</h2>
            </div>
            <div className="support-widget-header-actions">
              <p
                className={`support-chat-status${connected && !conversationClosed ? " is-live" : ""}`}
              >
                {connectionLabel}
              </p>
              <button
                type="button"
                className="support-widget-close"
                onClick={() => void handleClose()}
                disabled={closing || loading}
                aria-label="Close support chat"
              >
                ×
              </button>
            </div>
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
                    <p className="support-chat-time">
                      {formatChatTime(message.created_at)}
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
              rows={1}
              maxLength={4000}
              placeholder="Write your message…"
              value={draft}
              disabled={loading || !conversationId || conversationClosed}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
            />
            <button
              type="submit"
              className="support-chat-send"
              disabled={
                loading ||
                !conversationId ||
                sending ||
                conversationClosed ||
                !draft.trim()
              }
            >
              Send
            </button>
          </form>
        </section>
      ) : (
        <button
          type="button"
          className="support-widget-teaser"
          onClick={() => void handleOpen()}
        >
          <span className="support-widget-teaser-icon">
            <ChatIcon />
          </span>
          <span className="support-widget-teaser-copy">
            <span className="support-widget-kicker">Looking for support?</span>
            <span className="support-widget-teaser-cta">Send us a message</span>
          </span>
        </button>
      )}
    </div>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(widget, getWidgetHost());
}
