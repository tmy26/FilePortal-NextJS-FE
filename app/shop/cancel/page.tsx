import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Checkout canceled",
  description: "TuningPoints checkout was canceled.",
  path: "/shop/cancel",
  index: false,
});

export default async function ShopCancelPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <PageShell>
      <AppPageHeader
        kicker="Payment"
        title="Checkout canceled"
        description="No charge was made. Enter an amount whenever you are ready."
      />
      <div className="shop-panel">
        <div className="shop-result-actions">
          <Link href="/shop" className="cta">
            Return to shop
          </Link>
          <Link href="/" className="cta cta-secondary">
            Home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
