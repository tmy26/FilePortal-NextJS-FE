"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { googleLoginAction } from "@/app/actions/auth";
import { FormBanner } from "@/components/form-banner";
import { setClientSignedIn } from "@/lib/auth/client-session";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: "popup" | "redirect";
            auto_select?: boolean;
            locale?: string;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "continue_with" | "signup_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

type Props = {
  clientId: string;
  /** Google button label: sign in vs sign up. */
  variant?: "signin" | "signup";
};

function googleButtonWidth(host: HTMLElement): number {
  const measured = host.clientWidth;
  return Math.min(400, Math.max(200, Math.floor(measured || 280)));
}

export function GoogleSignInButton({
  clientId,
  variant = "signin",
}: Props) {
  const router = useRouter();
  const buttonHost = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onCredential = useCallback(
    async (credential: string) => {
      setError(null);
      setPending(true);
      try {
        const result = await googleLoginAction(credential);
        if (!result.ok) {
          setError(
            result.error ??
              (variant === "signup"
                ? "Google sign-up failed."
                : "Google sign-in failed."),
          );
          return;
        }
        setClientSignedIn();
        router.replace("/");
        router.refresh();
      } finally {
        setPending(false);
      }
    },
    [router, variant],
  );

  const buttonText = variant === "signup" ? "signup_with" : "signin_with";
  const pendingLabel =
    variant === "signup" ? "Creating account…" : "Signing in…";

  useEffect(() => {
    if (!clientId || !buttonHost.current) return;

    let cancelled = false;
    let observer: ResizeObserver | null = null;

    const mount = () => {
      if (cancelled || !buttonHost.current || !window.google?.accounts?.id) {
        return;
      }

      const width = googleButtonWidth(buttonHost.current);

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            void onCredential(response.credential);
          } else {
            setError("Google did not return a credential.");
          }
        },
        ux_mode: "popup",
        auto_select: false,
        locale: "en",
      });

      buttonHost.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonHost.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: buttonText,
        shape: "rectangular",
        width,
      });
    };

    const existing = document.getElementById("google-gsi-script");
    if (window.google?.accounts?.id) {
      mount();
      observer = new ResizeObserver(mount);
      observer.observe(buttonHost.current);
      return () => {
        cancelled = true;
        observer?.disconnect();
      };
    }

    const script =
      existing instanceof HTMLScriptElement
        ? existing
        : (() => {
            const el = document.createElement("script");
            el.id = "google-gsi-script";
            el.src = "https://accounts.google.com/gsi/client";
            el.async = true;
            el.defer = true;
            document.head.appendChild(el);
            return el;
          })();

    const handleLoad = () => mount();
    script.addEventListener("load", handleLoad);
    if (window.google?.accounts?.id) {
      mount();
    }

    observer = new ResizeObserver(mount);
    observer.observe(buttonHost.current);

    return () => {
      cancelled = true;
      script.removeEventListener("load", handleLoad);
      observer?.disconnect();
    };
  }, [clientId, onCredential, buttonText]);

  return (
    <div className="google-sign-in">
      {error ? <FormBanner tone="error">{error}</FormBanner> : null}
      <div
        ref={buttonHost}
        className="google-sign-in-button"
        aria-busy={pending}
      />
      {pending ? (
        <p className="muted google-sign-in-status">{pendingLabel}</p>
      ) : null}
    </div>
  );
}
