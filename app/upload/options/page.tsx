import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TuningOptionsForm } from "./tuning-options-form";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import { listTuningOptions } from "@/lib/api";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";
import { getAccessToken } from "@/lib/auth/session";
import type { TuningOptionRead } from "@/lib/types/tuning";

export const metadata: Metadata = pageMetadata({
  title: "Tuning options",
  description: "Review vehicle details and choose tuning options.",
  path: "/upload/options",
  index: false,
});

export default async function UploadOptionsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/sign-in");
  }

  let initialOptions: TuningOptionRead[] = [];
  let optionsLoadFailed = false;

  const accessToken = await getAccessToken();
  if (accessToken) {
    try {
      initialOptions = await listTuningOptions(accessToken);
    } catch {
      optionsLoadFailed = true;
    }
  } else {
    optionsLoadFailed = true;
  }

  return (
    <PageShell>
      <AppPageHeader
        kicker="File Portal"
        title="Tuning options"
        description="Review your vehicle details, pick the tuning options you need, then upload your .bin file."
      />
      <TuningOptionsForm
        currentPoints={user.tuning_points}
        initialOptions={initialOptions}
        optionsLoadFailed={optionsLoadFailed}
      />
    </PageShell>
  );
}
