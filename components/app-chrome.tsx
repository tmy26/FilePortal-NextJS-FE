"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteSidebar } from "@/components/site-sidebar";
import {
  clearClientSignedIn,
  setClientSignedIn,
} from "@/lib/auth/client-session";
import { useClientSignedIn } from "@/lib/auth/use-client-signed-in";
import type { UserRead } from "@/lib/types/user";

type AppChromeProps = {
  user: UserRead | null;
  children: ReactNode;
};

/**
 * Client island for nav + sidebar state. Footer stays in the server layout.
 *
 * Signed-in chrome (email, TuningPoints, New File Request, etc.) only shows when
 * the server session user is present and localStorage says signed-in.
 */
export function AppChrome({ user, children }: AppChromeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const clientSignedIn = useClientSignedIn();
  const hasServerUser = Boolean(user?.uuid);

  useEffect(() => {
    queueMicrotask(() => setStorageReady(true));
  }, []);

  // Keep localStorage aligned with the server session.
  useEffect(() => {
    if (hasServerUser) {
      setClientSignedIn();
    } else {
      clearClientSignedIn();
    }
  }, [hasServerUser]);

  // Before storage is ready, trust the server user to avoid a guest flash.
  // After that, both the session and localStorage flag are required.
  const isSignedIn =
    hasServerUser && (!storageReady || clientSignedIn);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      <SiteNav
        key={isSignedIn ? (user?.uuid ?? "signed-in") : "guest"}
        user={isSignedIn ? user : null}
        onOpenSidebar={isSignedIn ? () => setSidebarOpen(true) : undefined}
      />
      <div className={["site-body", isSignedIn ? "has-sidebar" : ""].join(" ")}>
        {isSignedIn ? (
          <SiteSidebar open={sidebarOpen} onClose={closeSidebar} />
        ) : null}
        <div className="site-main">{children}</div>
      </div>
    </>
  );
}
