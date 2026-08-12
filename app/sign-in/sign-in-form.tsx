"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { FormBanner } from "@/components/form-banner";
import { TextField } from "@/components/forms/text-field";
import { setClientSignedIn } from "@/lib/auth/client-session";
import { EMAIL_VERIFICATION_SPAM_HINT } from "@/lib/auth/email-verification-copy";

const initialState: LoginState = { ok: false };

type Props = {
  googleClientId?: string;
  nextPath?: string;
};

export function SignInForm({ googleClientId = "", nextPath = "/" }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (!state.ok) return;
    setClientSignedIn();
    router.replace(nextPath);
    router.refresh();
  }, [state.ok, router, nextPath]);

  return (
    <div className="create-user-form auth-sign-in">
      <form action={formAction} noValidate>
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

        <button type="submit" className="submit-btn" disabled={pending || state.ok}>
          {pending || state.ok ? "Signing in…" : "Sign in"}
        </button>

        <p className="auth-footer muted">
          Didn&apos;t get your activation email?{" "}
          <Link href="/resend-verification" className="text-link">
            Resend it
          </Link>
          . {EMAIL_VERIFICATION_SPAM_HINT}
        </p>
      </form>

      {googleClientId ? (
        <>
          <p className="auth-divider muted" role="separator">
            or
          </p>
          <GoogleSignInButton clientId={googleClientId} nextPath={nextPath} />
        </>
      ) : null}
    </div>
  );
}
