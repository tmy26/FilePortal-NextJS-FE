"use client";

import Link from "next/link";
import { useEffect } from "react";
import { setClientSignedIn } from "@/lib/auth/client-session";
import { HOME_PAGE_COPY } from "@/lib/seo/public-page-copy";

type HomeActionsProps = {
  hasServerUser: boolean;
};

/**
 * Home CTAs follow the server session (same source of truth as AppChrome).
 * Guest register lives in the navbar — do not duplicate it here.
 */
export function HomeActions({ hasServerUser }: HomeActionsProps) {
  useEffect(() => {
    if (hasServerUser) {
      setClientSignedIn();
    }
  }, [hasServerUser]);

  return (
    <div className="home-actions">
      <Link href="/upload" className="cta">
        {HOME_PAGE_COPY.primaryCta}
      </Link>
      {hasServerUser ? (
        <Link href="/shop" className="cta cta-secondary">
          {HOME_PAGE_COPY.signedInSecondaryCta}
        </Link>
      ) : null}
    </div>
  );
}
