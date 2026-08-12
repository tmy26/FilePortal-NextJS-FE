"use client";

import Link from "next/link";
import { useEffect } from "react";
import { setClientSignedIn } from "@/lib/auth/client-session";

type HomeActionsProps = {
  hasServerUser: boolean;
};

/**
 * Home CTAs follow the server session (same source of truth as AppChrome).
 */
export function HomeActions({ hasServerUser }: HomeActionsProps) {
  useEffect(() => {
    if (hasServerUser) {
      setClientSignedIn();
    }
  }, [hasServerUser]);

  const isSignedIn = hasServerUser;

  return (
    <>
      <p>
        {isSignedIn
          ? "Buy TuningPoints from the shop, then upload ECU or gearbox files through the portal."
          : "Use the account icon to sign in or create an account, then upload and manage files through the portal."}
      </p>
      <div className="home-actions">
        {isSignedIn ? (
          <>
            <Link href="/upload" className="cta">
              New File Request
            </Link>
            <Link href="/shop" className="cta cta-secondary">
              Buy TuningPoints
            </Link>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="cta">
              Sign in
            </Link>
            <Link href="/register" className="cta cta-secondary">
              Create account
            </Link>
          </>
        )}
      </div>
    </>
  );
}
