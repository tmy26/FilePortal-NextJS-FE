"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { clearClientSignedIn } from "@/lib/auth/client-session";
import { ACCOUNT_MENU_LINKS } from "@/lib/nav";
import type { UserRead } from "@/lib/types/user";

type SiteNavProps = {
  user: UserRead | null;
  onOpenSidebar?: () => void;
};

export function SiteNav({ user, onOpenSidebar }: SiteNavProps) {
  const menuId = useId();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const isSignedIn = Boolean(user?.uuid);
  const [isOpen, setIsOpen] = useState(false);
  const [menuScope, setMenuScope] = useState(`${pathname}:${isSignedIn}`);
  const [isLoggingOut, startLogout] = useTransition();

  // Close the account menu when the route or auth state changes (adjust state during render).
  const nextMenuScope = `${pathname}:${isSignedIn}`;
  if (menuScope !== nextMenuScope) {
    setMenuScope(nextMenuScope);
    if (isOpen) setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen || isLoggingOut) return;

    function handlePointerDown(event: MouseEvent | PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isLoggingOut]);

  const displayName =
    user?.username ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    null;

  function handleSignOut() {
    clearClientSignedIn();
    startLogout(() => {
      logoutAction();
    });
  }

  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        {onOpenSidebar ? (
          <button
            type="button"
            className="site-nav-menu-btn"
            aria-label="Open menu"
            onClick={onOpenSidebar}
          >
            <span className="site-nav-menu-icon" aria-hidden="true" />
          </button>
        ) : null}

        <Link href="/" className="site-nav-brand">
          ECU<span className="site-nav-brand-accent">FilePortal</span>
        </Link>

        <div className="site-nav-actions">
          {isSignedIn && user ? (
            <div ref={rootRef} className="account-menu">
              <Link
                href="/shop"
                className="tuning-points"
                title="Buy TuningPoints"
                aria-label={`${user.tuning_points} TuningPoints. Open shop`}
              >
                <span className="tuning-points-value">{user.tuning_points}</span>
                <span className="tuning-points-unit">TuningPoints</span>
              </Link>

              <button
                type="button"
                className="account-avatar-btn"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={menuId}
                aria-label={
                  displayName
                    ? `Account menu for ${displayName}`
                    : "Account menu"
                }
                onClick={() => setIsOpen((open) => !open)}
                disabled={isLoggingOut}
              >
                <UserAvatar label={displayName} />
              </button>

              {isOpen ? (
                <div id={menuId} role="menu" className="account-menu-panel">
                  <Link
                    href="/profile"
                    role="menuitem"
                    className="account-menu-user account-menu-user-link"
                    onClick={() => setIsOpen(false)}
                  >
                    <p className="account-menu-user-name">{displayName}</p>
                    <p className="account-menu-user-email">{user.email}</p>
                    <span className="account-menu-user-hint">View profile</span>
                  </Link>
                  {ACCOUNT_MENU_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className="account-menu-item"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="account-menu-item-label">
                        {link.label}
                      </span>
                      {link.description ? (
                        <span className="account-menu-item-desc">
                          {link.description}
                        </span>
                      ) : null}
                    </Link>
                  ))}
                  <button
                    type="button"
                    role="menuitem"
                    className="account-menu-item account-menu-button"
                    disabled={isLoggingOut}
                    onClick={handleSignOut}
                  >
                    <span className="account-menu-item-label">
                      {isLoggingOut ? "Signing out…" : "Sign out"}
                    </span>
                    <span className="account-menu-item-desc">
                      End your session
                    </span>
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="site-nav-guest">
              <Link href="/sign-in" className="site-nav-guest-link">
                Sign in
              </Link>
              <Link href="/register" className="site-nav-guest-cta">
                Create account
              </Link>
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function UserAvatar({ label }: { label: string | null }) {
  const initials = label
    ? label
        .split(/[\s@_.-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : null;

  if (initials) {
    return (
      <span
        className="account-avatar account-avatar-initials"
        aria-hidden="true"
      >
        {initials}
      </span>
    );
  }

  return (
    <svg
      className="account-avatar"
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="20" cy="20" r="20" className="account-avatar-bg" />
      <circle cx="20" cy="15" r="7" className="account-avatar-head" />
      <path
        className="account-avatar-body"
        d="M8 34.5c1.8-6.2 6.4-9.5 12-9.5s10.2 3.3 12 9.5"
      />
    </svg>
  );
}
