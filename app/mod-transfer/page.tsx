import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ModTransferForm } from "./mod-transfer-form";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Transfer mod",
  description: "Transfer modifications between ECU or gearbox files.",
  path: "/mod-transfer",
  index: false,
});

export default async function ModTransferPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <PageShell>
      <AppPageHeader
        kicker="File Portal"
        title="Transfer mod"
        description="Upload the original, tuned, and target .bin files, then download the patched target when the transfer finishes."
      />
      <ModTransferForm />
    </PageShell>
  );
}
