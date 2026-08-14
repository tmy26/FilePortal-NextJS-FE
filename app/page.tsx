import type { Metadata } from "next";
import { HomeActions } from "@/components/home-actions";
import { HomeFaqJsonLd } from "@/components/seo/home-faq-json-ld";
import { HomeSeoContent } from "@/components/seo/home-seo-content";
import { SiteJsonLd } from "@/components/seo/site-json-ld";
import { getSessionUser } from "@/lib/auth/get-session-user";
import { HOME_PAGE_COPY } from "@/lib/seo/public-page-copy";
import { pageMetadata } from "@/lib/seo/site";

const homeMeta = pageMetadata({
  title: HOME_PAGE_COPY.title,
  description: HOME_PAGE_COPY.description,
  path: "/",
});

export const metadata: Metadata = {
  ...homeMeta,
  title: {
    absolute: HOME_PAGE_COPY.title,
  },
  openGraph: {
    ...homeMeta.openGraph,
    title: HOME_PAGE_COPY.title,
  },
  twitter: {
    ...homeMeta.twitter,
    title: HOME_PAGE_COPY.title,
  },
  alternates: {
    ...homeMeta.alternates,
    types: {
      "text/plain": [
        { url: "/llm.txt", title: "llm.txt" },
        { url: "/llms.txt", title: "llms.txt" },
      ],
    },
  },
};

export default async function Home() {
  const user = await getSessionUser();
  const isSignedIn = Boolean(user);

  return (
    <>
      {!isSignedIn ? (
        <>
          <SiteJsonLd />
          <HomeFaqJsonLd />
        </>
      ) : null}
      <main
        className={
          isSignedIn
            ? "home-hero-shell home-hero-shell-app"
            : "home-hero-shell home-hero-shell-guest"
        }
      >
        <div className="home-layout">
          <h1 className="home-heading">{HOME_PAGE_COPY.h1}</h1>
          <p className="home-hero">{HOME_PAGE_COPY.hero}</p>
          <p className="home-lead">{HOME_PAGE_COPY.slogan}</p>
          <HomeActions hasServerUser={isSignedIn} />
        </div>
      </main>
      {!isSignedIn ? <HomeSeoContent /> : null}
    </>
  );
}
