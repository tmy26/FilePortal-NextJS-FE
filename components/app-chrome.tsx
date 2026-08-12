"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteSidebar } from "@/components/site-sidebar";
import { setClientSignedIn } from "@/lib/auth/client-session";
import type { UserRead } from "@/lib/types/user";

type AppChromeProps = {
  user: UserRead | null;
  children: ReactNode;
};

/**
 * Client island for nav + sidebar state. Footer stays in the server layout.
 *
 * Signed-in chrome follows the server session. localStorage is updated when
 * the session is present, but never cleared here — clearing on a temporary
 * cookie miss (e.g. Stripe Checkout return) caused false logouts.
 */
export function AppChrome({ user, children }: AppChromeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSignedIn = Boolean(user?.uuid);

  useEffect(() => {
    if (isSignedIn) {
      setClientSignedIn();
    }
  }, [isSignedIn]);

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
