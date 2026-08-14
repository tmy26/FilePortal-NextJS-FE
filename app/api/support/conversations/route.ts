import { NextResponse } from "next/server";
import {
  listSupportConversations,
  openSupportConversation,
} from "@/lib/api";
import {
  isNextResponse,
  requireAccessToken,
  toErrorResponse,
} from "@/lib/auth/require-access-token";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  const { searchParams } = new URL(request.url);
  const tuningRequestId = searchParams.get("tuning_request_id") ?? undefined;

  try {
    const conversations = await listSupportConversations(auth, tuningRequestId);
    return NextResponse.json(conversations);
  } catch (error) {
    return toErrorResponse(error, "Could not load support conversations.");
  }
}

export async function POST(request: Request) {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  let body: { tuning_request_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body." }, { status: 422 });
  }

  const tuningRequestId = body.tuning_request_id?.trim();
  if (!tuningRequestId) {
    return NextResponse.json(
      { detail: "tuning_request_id is required." },
      { status: 422 },
    );
  }

  try {
    const conversation = await openSupportConversation(auth, tuningRequestId);
    return NextResponse.json(conversation);
  } catch (error) {
    return toErrorResponse(error, "Could not open support chat.");
  }
}
