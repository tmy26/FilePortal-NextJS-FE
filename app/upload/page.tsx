import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UploadFileForm } from "./upload-file-form";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { listVehicleTypes } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";
import { getAccessToken } from "@/lib/auth/session";
import { UPLOAD_EDIT_QUERY, UPLOAD_EDIT_VALUE } from "@/lib/upload/draft";

export const metadata: Metadata = pageMetadata({
  title: "New File Request",
  description: "Request ECU or gearbox file tuning through File Portal.",
  path: "/upload",
  index: false,
});

type UploadPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const restoreDraft = params[UPLOAD_EDIT_QUERY] === UPLOAD_EDIT_VALUE;

  let initialVehicleTypes: Awaited<ReturnType<typeof listVehicleTypes>> = [];
  let catalogLoadFailed = false;

  if (user.tuning_points > 0) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      try {
        initialVehicleTypes = await listVehicleTypes(accessToken);
      } catch {
        catalogLoadFailed = true;
      }
    }
  }

  return (
    <PageShell>
      <AppPageHeader
        kicker="File Portal"
        title="New File Request"
        description="Choose ECU or gearbox and select the vehicle details, then continue to pick tuning options and upload your .bin file. You need at least one TuningPoint to continue."
      />
      <UploadFileForm
        currentPoints={user.tuning_points}
        initialVehicleTypes={initialVehicleTypes}
        catalogLoadFailed={catalogLoadFailed}
        restoreDraft={restoreDraft}
      />
    </PageShell>
  );
}
