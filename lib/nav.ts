export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

/** Primary signed-in navigation (sidebar). */
export const SIGNED_IN_NAV_LINKS: NavLink[] = [
  { href: "/upload", label: "New File Request", description: "ECU or gearbox file" },
  { href: "/shop", label: "Shop", description: "Buy TuningPoints" },
  { href: "/file-history", label: "File history", description: "Past requests" },
];

/** Compact account-menu shortcuts (subset + profile). */
export const ACCOUNT_MENU_LINKS: NavLink[] = [
  { href: "/upload", label: "New File Request", description: "ECU or gearbox file" },
  { href: "/shop", label: "Shop", description: "Buy TuningPoints" },
];
