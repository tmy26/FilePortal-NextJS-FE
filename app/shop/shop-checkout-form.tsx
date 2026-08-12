"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, type FormEvent } from "react";
import {
  startCheckoutAction,
  type CheckoutState,
} from "@/app/actions/billing";
import { FormBanner } from "@/components/form-banner";
import { savePendingCheckoutSessionId } from "@/lib/billing/pending-checkout";

/** 1 TuningPoint = €10 */
const EURO_PER_POINT = 10;
const DEFAULT_QUANTITY = 1;
const MAX_QUANTITY = 10_000;

function formatEuros(amount: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseQuantityInput(value: string): number | null {
  if (value === "") return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

const initialState: CheckoutState = { ok: false, quantity: DEFAULT_QUANTITY };

type ShopCheckoutFormProps = {
  currentPoints: number;
};

export function ShopCheckoutForm({ currentPoints }: ShopCheckoutFormProps) {
  const [state, formAction, pending] = useActionState(
    startCheckoutAction,
    initialState,
  );
  const [quantityInput, setQuantityInput] = useState(
    String(state.quantity ?? DEFAULT_QUANTITY),
  );
  const [syncedQuantity, setSyncedQuantity] = useState(state.quantity);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);

  // Keep the text field in sync when the server action returns a quantity.
  if (state.quantity != null && state.quantity !== syncedQuantity) {
    setSyncedQuantity(state.quantity);
    setQuantityInput(String(state.quantity));
  }

  // Persist session id, then leave for Stripe (survives cookie-less returns).
  useEffect(() => {
    if (!state.ok || !state.paymentUrl) return;
    if (state.sessionId) {
      savePendingCheckoutSessionId(state.sessionId);
    }
    window.location.assign(state.paymentUrl);
  }, [state.ok, state.paymentUrl, state.sessionId]);

  const parsedQuantity = parseQuantityInput(quantityInput);
  const quantityOk =
    parsedQuantity != null &&
    parsedQuantity >= 1 &&
    parsedQuantity <= MAX_QUANTITY;
  const safeQuantity = quantityOk ? parsedQuantity : 0;
  const totalEuros = safeQuantity * EURO_PER_POINT;
  const canSubmit = quantityOk;
  const redirecting = Boolean(state.ok && state.paymentUrl);

  function handleQuantityChange(raw: string) {
    if (raw === "" || /^\d{1,5}$/.test(raw)) {
      setQuantityInput(raw);
    }
  }

  function normalizeQuantityInput() {
    const parsed = parseQuantityInput(quantityInput);
    if (parsed == null || parsed < 1) {
      setQuantityInput(String(DEFAULT_QUANTITY));
      return;
    }
    if (parsed > MAX_QUANTITY) {
      setQuantityInput(String(MAX_QUANTITY));
      return;
    }
    setQuantityInput(String(parsed));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!acceptedTerms) {
      event.preventDefault();
      setTermsError("Please accept the Terms of Service to continue.");
      return;
    }
    if (!quantityOk) {
      event.preventDefault();
      normalizeQuantityInput();
    }
  }

  return (
    <form
      action={formAction}
      className="shop-panel"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="shop-balance">
        <span className="shop-balance-label">Your balance</span>
        <span className="shop-balance-value">
          {currentPoints}
          <span className="shop-balance-unit">TuningPoints</span>
        </span>
      </div>

      {state.error ? (
        <FormBanner tone="error">{state.error}</FormBanner>
      ) : null}

      <div className="shop-quantity">
        <p className="shop-section-lead muted">
          1 TuningPoint = €10. Pay securely with Stripe.
        </p>
        <label className="field" htmlFor="quantity">
          <span className="field-label">How many TuningPoints?</span>
          <input
            id="quantity"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-invalid={quantityInput !== "" && !quantityOk}
            value={quantityInput}
            onChange={(event) => handleQuantityChange(event.target.value)}
            onBlur={normalizeQuantityInput}
          />
          <input
            type="hidden"
            name="quantity"
            value={quantityOk ? parsedQuantity : ""}
          />
        </label>
      </div>

      <div className="shop-order">
        <div className="shop-order-row">
          <span>Purchasing</span>
          <strong>
            {quantityOk ? `${safeQuantity} TuningPoints` : "—"}
          </strong>
        </div>
        <div className="shop-order-row">
          <span>Total</span>
          <strong>{quantityOk ? formatEuros(totalEuros) : "—"}</strong>
        </div>
      </div>

      <p className="shop-nonrefundable" role="note">
        TuningPoints purchases are final and <strong>non-refundable</strong>.
      </p>

      <div className="shop-terms">
        <label className="shop-terms-label" htmlFor="accept-terms">
          <input
            id="accept-terms"
            name="accept_terms"
            type="checkbox"
            checked={acceptedTerms}
            required
            onChange={(event) => {
              setAcceptedTerms(event.target.checked);
              if (termsError) setTermsError(null);
            }}
          />
          <span>
            I accept the{" "}
            <Link href="/terms" className="shop-terms-link">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="shop-terms-link">
              Privacy Policy
            </Link>{" "}
            /{" "}
            <Link href="/cookies" className="shop-terms-link">
              Cookie Policy
            </Link>
            , and I understand that TuningPoints are non-refundable.
          </span>
        </label>
        {termsError ? (
          <p className="field-error" role="alert">
            {termsError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={pending || redirecting || !canSubmit}
      >
        {pending || redirecting
          ? "Redirecting to Stripe…"
          : quantityOk
            ? `Buy ${safeQuantity} TuningPoints · ${formatEuros(totalEuros)}`
            : "Enter a quantity"}
      </button>
    </form>
  );
}
