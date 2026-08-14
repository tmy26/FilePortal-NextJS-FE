import { NextResponse } from "next/server";
import {
  isNextResponse,
  requireAccessToken,
} from "@/lib/auth/require-access-token";

export const runtime = "nodejs";

/** Expose the access token for browser WebSocket connections (httpOnly cookie). */
export async function GET() {
  const auth = await requireAccessToken();
  if (isNextResponse(auth)) return auth;

  return NextResponse.json({ token: auth });
}
