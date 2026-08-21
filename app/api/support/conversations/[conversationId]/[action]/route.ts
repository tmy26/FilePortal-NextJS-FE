import { NextResponse } from "next/server";
import {
  closeSupportConversation,
  markSupportConversationRead,
  reopenSupportConversation,
} from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

export const runtime = "nodejs";

const ACTIONS = {
  close: {
    run: closeSupportConversation,
    error: "Could not close support chat.",
  },
  reopen: {
    run: reopenSupportConversation,
    error: "Could not reopen support chat.",
  },
  read: {
    run: markSupportConversationRead,
    error: "Could not mark messages as read.",
  },
} as const;

type ConversationAction = keyof typeof ACTIONS;

type RouteContext = {
  params: Promise<{ conversationId: string; action: string }>;
};

function isConversationAction(value: string): value is ConversationAction {
  return value in ACTIONS;
}

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const { conversationId, action } = await context.params;
  if (!conversationId) {
    return NextResponse.json({ detail: "Missing conversation id." }, { status: 400 });
  }
  if (!isConversationAction(action)) {
    return NextResponse.json({ detail: "Unknown action." }, { status: 404 });
  }

  try {
    const result = await ACTIONS[action].run(auth, conversationId);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error, ACTIONS[action].error);
  }
}
