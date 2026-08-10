"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { FormBanner } from "@/components/form-banner";
import { TextField } from "@/components/forms/text-field";

const initialState: LoginState = { ok: false };

export function SignInForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

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
          error={state.fieldErrors?.email}
        />
        <TextField
          className="field-span"
          id="password"
          name="password"
          label="Password *"
          type="password"
          autoComplete="current-password"
          required
          error={state.fieldErrors?.password}
        />
      </div>

      <button type="submit" className="submit-btn" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>

      <p className="auth-footer muted">
        Didn&apos;t get your activation email?{" "}
        <Link href="/resend-verification" className="text-link">
          Resend it
        </Link>
      </p>
    </form>
  );
}
