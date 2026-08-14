import type { Metadata } from "next";
import { HomeActions } from "@/components/home-actions";
import { HomeFaqJsonLd } from "@/components/seo/home-faq-json-ld";
import { HomeSeoContent } from "@/components/seo/home-seo-content";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "ECU & gearbox file portal",
  description:
    "File Portal by TMY Tuned — upload ECU and gearbox tuning files, buy TuningPoints, and manage requests online.",
  path: "/",
});

export default async function Home() {
  const user = await getSessionUser();

  return (
    <>
      <HomeFaqJsonLd />
      <main className="page-shell">
        <div className="home-layout">
          <h1 className="brand-mark home-brand">
            File <span className="brand-mark-accent">Portal</span>
          </h1>
          <p className="home-lead">Send files. Stay in control.</p>
          <HomeActions hasServerUser={Boolean(user)} />
        </div>
      </main>
      <HomeSeoContent />
    </>
  );
}
