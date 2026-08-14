import { headers } from "next/headers";

/**
 * Known search, preview, and AI browsing user agents.
 * Used to serve public HTML on auth-gated marketing routes instead of redirecting.
 */
const KNOWN_CRAWLER_PATTERN =
  /GPTBot|ChatGPT-User|OAI-SearchBot|Google-Extended|Googlebot|Google-InspectionTool|Bingbot|Slurp|DuckDuckBot|BraveBot|ClaudeBot|anthropic-ai|PerplexityBot|Applebot|CCBot|facebookexternalhit|LinkedInBot|Twitterbot|Slackbot|Discordbot|Bytespider|SemrushBot|AhrefsBot|MJ12bot|DotBot|PetalBot|Amazonbot|meta-externalagent/i;

export function isKnownCrawlerUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return KNOWN_CRAWLER_PATTERN.test(userAgent);
}

/** Read the incoming request User-Agent in a Server Component or Route Handler. */
export async function isKnownCrawlerRequest(): Promise<boolean> {
  const headerStore = await headers();
  return isKnownCrawlerUserAgent(headerStore.get("user-agent"));
}
