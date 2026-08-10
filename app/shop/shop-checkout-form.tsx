"use client";

import Link from "next/link";
import { useActionState, useState, type FormEvent } from "react";
import {
  startCheckoutAction,
  type CheckoutState,
} from "@/app/actions/billing";
import { FormBanner } from "@/components/form-banner";

/** 1 TuningPoint = €10 */
const EURO_PER_POINT = 10;
const DEFAULT_QUANTITY = 1;

function formatEuros(amount: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
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
  const [quantity, setQuantity] = useState(state.quantity ?? DEFAULT_QUANTITY);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);

  const safeQuantity = Math.max(0, quantity);
  const totalEuros = safeQuantity * EURO_PER_POINT;
  const quantityOk = quantity >= 1 && quantity <= 10_000;
  const canSubmit = quantityOk;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!acceptedTerms) {
      event.preventDefault();
      setTermsError("Please accept the Terms of Service to continue.");
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
            name="quantity"
            type="number"
            min={1}
            max={10000}
            step={1}
            required
            value={quantity}
            onChange={(event) => {
              const next = Number.parseInt(event.target.value, 10);
              setQuantity(Number.isFinite(next) ? next : 1);
            }}
          />
        </label>
      </div>

      <div className="shop-order">
        <div className="shop-order-row">
          <span>Purchasing</span>
          <strong>{safeQuantity} TuningPoints</strong>
        </div>
        <div className="shop-order-row">
          <span>Total</span>
          <strong>{formatEuros(totalEuros)}</strong>
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
        disabled={pending || !canSubmit}
      >
        {pending
          ? "Redirecting to Stripe…"
          : `Buy ${safeQuantity} TuningPoints · ${formatEuros(totalEuros)}`}
      </button>
    </form>
  );
}
