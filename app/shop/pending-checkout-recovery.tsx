"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  clearPendingCheckoutSessionId,
  readPendingCheckoutSessionId,
} from "@/lib/billing/pending-checkout";

type Props = {
  /** True when the URL already has session_id / credited / error. */
  hasOutcome: boolean;
};

/**
 * If Stripe returned without session_id in the URL (or cookies were missing and
 * the user bounced), recover the pending Checkout session from localStorage.
 */
export function PendingCheckoutRecovery({ hasOutcome }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (hasOutcome) {
      clearPendingCheckoutSessionId();
      return;
    }
    const pending = readPendingCheckoutSessionId();
    if (!pending) return;
    router.replace(
      `/shop/success?session_id=${encodeURIComponent(pending)}`,
    );
  }, [hasOutcome, router]);

  return null;
}
