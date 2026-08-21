"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { WorkingHoursPanel } from "@/components/working-hours-panel";
import { SIGNED_IN_NAV_LINKS } from "@/lib/nav";

type SiteSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function SiteSidebar({ open, onClose }: SiteSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <>
      <button
        type="button"
        className={["site-sidebar-backdrop", open ? "is-open" : ""].join(" ")}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        className={["site-sidebar", open ? "is-open" : ""].join(" ")}
        aria-label="App"
      >
        <nav className="site-sidebar-nav" aria-label="Primary">
          {SIGNED_IN_NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "site-sidebar-link",
                  isActive ? "is-active" : "",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
                onClick={onClose}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <WorkingHoursPanel />
      </aside>
    </>
  );
}
