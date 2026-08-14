import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FileHistoryList } from "@/components/file-history";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { listTuningRequests } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";
import { getAccessToken } from "@/lib/auth/session";
import type { TuningRequestRead } from "@/lib/types/file-history";

export const metadata: Metadata = pageMetadata({
  title: "File history",
  description: "Your File Portal file requests.",
  path: "/file-history",
  index: false,
});

export default async function FileHistoryPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  let requests: TuningRequestRead[] = [];
  let loadFailed = false;
  const accessToken = await getAccessToken();
  if (accessToken) {
    try {
      requests = await listTuningRequests(accessToken);
    } catch {
      loadFailed = true;
    }
  } else {
    loadFailed = true;
  }

  return (
    <PageShell className="file-history-index">
      <AppPageHeader title="File history" />
      <FileHistoryList requests={requests} loadFailed={loadFailed} />
    </PageShell>
  );
}
