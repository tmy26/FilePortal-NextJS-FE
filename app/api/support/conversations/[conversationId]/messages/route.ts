import { NextResponse } from "next/server";
import { listSupportMessages } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ conversationId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const { conversationId } = await context.params;
  if (!conversationId) {
    return NextResponse.json({ detail: "Missing conversation id." }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const before = searchParams.get("before") ?? undefined;
  const limitRaw = searchParams.get("limit");
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : undefined;

  try {
    const messages = await listSupportMessages(auth, conversationId, {
      before,
      limit: Number.isFinite(limit) ? limit : undefined,
    });
    return NextResponse.json(messages);
  } catch (error) {
    return toErrorResponse(error, "Could not load messages.");
  }
}
