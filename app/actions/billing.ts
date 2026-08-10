"use server";

import { redirect } from "next/navigation";
import {
  confirmCheckoutSession,
  createCheckoutSession,
  type ConfirmCheckoutResponse,
} from "@/lib/api";
import { getAccessToken } from "@/lib/auth/session";

export type CheckoutState = {
  ok: boolean;
  error?: string;
  quantity?: number;
};

function readQuantity(formData: FormData): number {
  const raw = formData.get("quantity");
  const value =
    typeof raw === "string" ? Number.parseInt(raw, 10) : Number.NaN;
  return value;
}

function readAcceptedTerms(formData: FormData): boolean {
  const raw = formData.get("accept_terms");
  return raw === "on" || raw === "true" || raw === "1";
}

export async function startCheckoutAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const quantity = readQuantity(formData);

  if (!Number.isFinite(quantity) || quantity < 1) {
    return {
      ok: false,
      error: "Choose at least 1 TuningPoint.",
      quantity: Number.isFinite(quantity) ? quantity : 1,
    };
  }

  if (quantity > 10_000) {
    return {
      ok: false,
      error: "Quantity is too large.",
      quantity,
    };
  }

  if (!readAcceptedTerms(formData)) {
    return {
      ok: false,
      error: "Please accept the Terms of Service to continue.",
      quantity,
    };
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/sign-in");
  }

  let paymentUrl: string;
  try {
    const result = await createCheckoutSession(accessToken, quantity);
    paymentUrl = result.payment_url;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start checkout.";
    return { ok: false, error: message, quantity };
  }

  if (!paymentUrl) {
    return {
      ok: false,
      error: "Checkout did not return a payment URL.",
      quantity,
    };
  }

  redirect(paymentUrl);
}

export type ConfirmCheckoutResult =
  | { ok: true; pointsCredited: number; detail: string }
  | { ok: false; error: string };

/** Confirm a paid Stripe session and credit TuningPoints (idempotent). */
export async function confirmCheckoutAction(
  sessionId: string,
): Promise<ConfirmCheckoutResult> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/sign-in");
  }

  let result: ConfirmCheckoutResponse;
  try {
    result = await confirmCheckoutSession(accessToken, sessionId);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not confirm purchase.";
    return { ok: false, error: message };
  }

  return {
    ok: true,
    pointsCredited: result.points_credited ?? 0,
    detail: result.detail,
  };
}
