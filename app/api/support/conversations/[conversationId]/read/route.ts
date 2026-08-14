import { NextResponse } from "next/server";
import { markSupportConversationRead } from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ conversationId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const { conversationId } = await context.params;
  if (!conversationId) {
    return NextResponse.json({ detail: "Missing conversation id." }, { status: 400 });
  }

  try {
    const result = await markSupportConversationRead(auth, conversationId);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error, "Could not mark messages as read.");
  }
}
