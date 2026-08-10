import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { privacyPolicy } from "@/lib/legal/privacy";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How File Portal processes personal data under GDPR (EU / Bulgaria).",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalPage document={privacyPolicy} />;
}
