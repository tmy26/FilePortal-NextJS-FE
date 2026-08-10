import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { termsOfService } from "@/lib/legal/terms";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "File Portal Terms of Service for accounts and TuningPoints.",
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPage document={termsOfService} />;
}
