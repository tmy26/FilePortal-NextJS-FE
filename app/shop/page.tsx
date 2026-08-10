import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShopCheckoutForm } from "./shop-checkout-form";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Shop",
  description: "Buy TuningPoints for File Portal.",
  path: "/shop",
  index: false,
});

export default async function ShopPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <PageShell>
      <AppPageHeader
        kicker="File Portal"
        title="Buy TuningPoints"
        description="1 TuningPoint = €10. Enter how many you need and checkout with Stripe. Points are added to your account after payment confirms."
      />
      <ShopCheckoutForm currentPoints={user.tuning_points} />
    </PageShell>
  );
}
