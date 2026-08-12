"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  resendVerificationAction,
  type ResendVerificationState,
} from "@/app/actions/users";
import { FormBanner } from "@/components/form-banner";
import { TextField } from "@/components/forms/text-field";
import { EMAIL_VERIFICATION_SPAM_HINT } from "@/lib/auth/email-verification-copy";

const initialState: ResendVerificationState = { ok: false };

export function ResendVerificationForm({
  initialEmail = "",
}: {
  initialEmail?: string;
}) {
  const [state, formAction, pending] = useActionState(
    resendVerificationAction,
    { ...initialState, email: initialEmail },
  );

  if (state.ok) {
    return (
      <div className="success-panel" role="status">
        <h2>Check your inbox</h2>
        <p>{state.detail}</p>
        <p className="muted">{EMAIL_VERIFICATION_SPAM_HINT}</p>
        <p className="muted">
          After you confirm, you can{" "}
          <Link href="/sign-in" className="text-link">
            sign in
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="create-user-form" noValidate>
      {state.error ? <FormBanner tone="error">{state.error}</FormBanner> : null}

      <div className="field-grid">
        <TextField
          className="field-span"
          id="email"
          name="email"
          label="Email *"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.email ?? initialEmail}
          error={state.fieldErrors?.email}
        />
      </div>

      <button type="submit" className="submit-btn" disabled={pending}>
        {pending ? "Sending…" : "Resend verification email"}
      </button>
    </form>
  );
}
