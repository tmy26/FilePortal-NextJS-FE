import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteAccountSection } from "./delete-account-section";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Profile",
  description: "Your File Portal profile.",
  path: "/profile",
  index: false,
});

function formatJoined(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  const rows = [
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "First name", value: user.first_name || "—" },
    { label: "Last name", value: user.last_name || "—" },
    { label: "Phone", value: user.telephone_number || "—" },
    { label: "Country", value: user.country || "—" },
    {
      label: "Account status",
      value: user.is_active ? "Active" : "Inactive",
    },
    { label: "Member since", value: formatJoined(user.created) },
  ] as const;

  return (
    <PageShell>
      <AppPageHeader
        kicker="Account"
        title="Your profile"
        description={
          fullName ? `${fullName} · @${user.username}` : `@${user.username}`
        }
      />

      <div className="shop-panel">
        <div className="shop-balance">
          <span className="shop-balance-label">TuningPoints balance</span>
          <span className="shop-balance-value">
            {user.tuning_points}
            <span className="shop-balance-unit">TuningPoints</span>
          </span>
        </div>

        <dl className="profile-list">
          {rows.map((row) => (
            <div key={row.label} className="profile-row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="shop-result-actions">
          <Link href="/shop" className="cta">
            Buy TuningPoints
          </Link>
          <Link href="/file-history" className="cta cta-secondary">
            File history
          </Link>
          <Link href="/" className="cta cta-secondary">
            Home
          </Link>
        </div>
      </div>

      <DeleteAccountSection />
    </PageShell>
  );
}
