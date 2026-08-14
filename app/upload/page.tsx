import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UploadFileForm } from "./upload-file-form";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { PublicPagePreview } from "@/components/seo/public-page-preview";
import { listVehicleTypes } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { isKnownCrawlerRequest } from "@/lib/seo/crawler";
import { UPLOAD_PUBLIC_PREVIEW } from "@/lib/seo/public-page-copy";
import { getAccessToken } from "@/lib/auth/session";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Upload ECU File Online | Tuning File Request | ECUFilePortal",
  description:
    "Upload your ECU or gearbox BIN file online, select the vehicle and tuning options, and manage the complete tuning request securely through ECUFilePortal.",
  path: "/upload",
  absoluteTitle: true,
});

export default async function UploadPage() {
  const user = await getSessionUser();
  if (!user) {
    if (await isKnownCrawlerRequest()) {
      return <PublicPagePreview copy={UPLOAD_PUBLIC_PREVIEW} />;
    }
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
        kicker="Tuning file request"
        title="Upload Your ECU or TCU File"
        description="Choose ECU or gearbox and select the vehicle details, then continue to pick tuning options and upload your .bin file."
      />
      <UploadFileForm
        initialVehicleTypes={initialVehicleTypes}
        catalogLoadFailed={catalogLoadFailed}
      />
    </PageShell>
  );
}
