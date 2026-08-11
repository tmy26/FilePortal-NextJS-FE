"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearClientSignedIn,
  setClientSignedIn,
} from "@/lib/auth/client-session";
import { useClientSignedIn } from "@/lib/auth/use-client-signed-in";

type HomeActionsProps = {
  hasServerUser: boolean;
};

/**
 * Home CTAs follow the same localStorage + session gate as AppChrome.
 */
export function HomeActions({ hasServerUser }: HomeActionsProps) {
  const [storageReady, setStorageReady] = useState(false);
  const clientSignedIn = useClientSignedIn();

  useEffect(() => {
    queueMicrotask(() => setStorageReady(true));
  }, []);

  useEffect(() => {
    if (hasServerUser) {
      setClientSignedIn();
    } else {
      clearClientSignedIn();
    }
  }, [hasServerUser]);

  const isSignedIn = hasServerUser && (!storageReady || clientSignedIn);

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
