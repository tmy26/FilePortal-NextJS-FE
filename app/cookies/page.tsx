import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { cookiePolicy } from "@/lib/legal/cookies";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Cookie Policy",
  description: "How File Portal uses strictly necessary authentication cookies.",
  path: "/cookies",
});

export default function CookiesPage() {
  return <LegalPage document={cookiePolicy} />;
}
