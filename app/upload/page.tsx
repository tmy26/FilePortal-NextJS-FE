import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UploadFileForm } from "./upload-file-form";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { listVehicleTypes } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";
import { getAccessToken } from "@/lib/auth/session";

export const metadata: Metadata = pageMetadata({
  title: "New File Request",
  description: "Request ECU or gearbox file tuning through File Portal.",
  path: "/upload",
});

export default async function UploadPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  let initialVehicleTypes: Awaited<ReturnType<typeof listVehicleTypes>> = [];
  let catalogLoadFailed = false;

  const accessToken = await getAccessToken();
  if (accessToken) {
    try {
      initialVehicleTypes = await listVehicleTypes(accessToken);
    } catch {
      catalogLoadFailed = true;
    }
  }

  return (
    <PageShell>
      <AppPageHeader
        kicker="File Portal"
        title="New File Request"
        description="Choose ECU or gearbox and select the vehicle details, then continue to pick tuning options and upload your .bin file."
      />
      <UploadFileForm
        initialVehicleTypes={initialVehicleTypes}
        catalogLoadFailed={catalogLoadFailed}
      />
    </PageShell>
  );
}
