/** Same-origin WebSocket URL proxied to FastAPI via next.config rewrites. */
export function buildSupportWsUrl(conversationId: string, token: string): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws/conversations/${encodeURIComponent(conversationId)}?token=${encodeURIComponent(token)}`;
}
