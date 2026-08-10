"use client";

import { useCallback, useState, type ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteSidebar } from "@/components/site-sidebar";
import type { UserRead } from "@/lib/types/user";

type AppChromeProps = {
  user: UserRead | null;
  children: ReactNode;
};

/** Client island for nav + sidebar state. Footer stays in the server layout. */
export function AppChrome({ user, children }: AppChromeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSignedIn = Boolean(user?.uuid);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      <SiteNav
        key={user?.uuid ?? "guest"}
        user={user}
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
