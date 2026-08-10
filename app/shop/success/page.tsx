import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { confirmCheckoutAction } from "@/app/actions/billing";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Purchase complete",
  description: "TuningPoints purchase confirmation.",
  path: "/shop/success",
  index: false,
});

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
    credited?: string;
    already?: string;
    error?: string;
  }>;
};

export default async function ShopSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const sessionId = params.session_id?.trim();

  // Confirm with Stripe session id server-side, then drop it from the URL
  // so it is never shown in the page or left in the address bar.
  if (sessionId) {
    const result = await confirmCheckoutAction(sessionId);
    if (result.ok) {
      const qs = new URLSearchParams();
      qs.set("credited", String(result.pointsCredited));
      if (result.detail.toLowerCase().includes("already")) {
        qs.set("already", "1");
      }
      redirect(`/shop/success?${qs.toString()}`);
    }
    redirect("/shop/success?error=1");
  }

  const pointsCredited = Number.parseInt(params.credited ?? "", 10);
  const alreadyProcessed = params.already === "1";
  const confirmError =
    params.error === "1"
      ? "We could not credit your TuningPoints yet. If you were charged, contact support and we will sort it out."
      : params.credited === undefined && params.already === undefined
        ? "Payment confirmation is incomplete. If you were charged, contact support."
        : null;

  const refreshedUser = await getSessionUser();
  const balance = refreshedUser?.tuning_points ?? user.tuning_points;

  const description = confirmError
    ? "Checkout finished, but we could not update your balance yet."
    : alreadyProcessed
      ? "This payment was already credited to your account."
      : Number.isFinite(pointsCredited) && pointsCredited > 0
        ? `Added ${pointsCredited} TuningPoints to your account.`
        : "Your payment is confirmed.";

  return (
    <PageShell>
      <AppPageHeader
        kicker="Payment"
        title="Purchase complete"
        description={description}
      />
      <div className="shop-panel">
        {confirmError ? (
          <p className="form-banner" role="alert">
            {confirmError}
          </p>
        ) : null}
        <div className="shop-balance">
          <span className="shop-balance-label">Current balance</span>
          <span className="shop-balance-value">
            {balance}
            <span className="shop-balance-unit">TuningPoints</span>
          </span>
        </div>
        <div className="shop-result-actions">
          <Link href="/shop" className="cta">
            Buy more
          </Link>
          <Link href="/" className="cta cta-secondary">
            Home
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
