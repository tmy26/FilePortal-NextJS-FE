import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FileHistoryDetail } from "@/components/file-history-detail";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { getTuningRequest } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";
import { getAccessToken } from "@/lib/auth/session";

export const metadata: Metadata = pageMetadata({
  title: "Request files",
  description: "Download original and processed files for a request.",
  path: "/file-history",
  index: false,
});

type FileHistoryDetailPageProps = {
  params: Promise<{ requestId: string }>;
};

export default async function FileHistoryDetailPage({
  params,
}: FileHistoryDetailPageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { requestId } = await params;
  if (!requestId) {
    notFound();
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/sign-in");
  }

  let detail;
  try {
    detail = await getTuningRequest(accessToken, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("not found")) {
      notFound();
    }
    return (
      <PageShell>
        <AppPageHeader kicker="Account" title="Request files" />
        <section className="shop-panel">
          <p className="form-banner" role="alert">
            Could not load this request.
          </p>
          <div className="shop-result-actions">
            <Link href="/file-history" className="cta cta-secondary">
              Back to history
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <AppPageHeader
        kicker="Account"
        title="Request files"
        description="Download the original upload and any processed files delivered for this request."
      />
      <FileHistoryDetail request={detail} currentUserId={user.uuid} />
    </PageShell>
  );
}
