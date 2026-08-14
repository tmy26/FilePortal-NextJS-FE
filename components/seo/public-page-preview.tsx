import Link from "next/link";
import type { PublicPagePreviewCopy } from "@/lib/seo/public-page-copy";
import { AppPageHeader, PageShell } from "@/components/page-shell";
import {
  buildBreadcrumbListJsonLd,
  homeBreadcrumb,
} from "@/lib/seo/json-ld";

type RelatedLink = {
  href: string;
  label: string;
};

type PublicPagePreviewProps = {
  copy: PublicPagePreviewCopy;
};

export function RelatedPageLinks({
  links,
  heading,
}: {
  links: readonly RelatedLink[];
  heading?: string;
}) {
  return (
    <nav className="related-page-links" aria-label={heading ?? "Related pages"}>
      {heading ? <p className="related-page-links-label">{heading}</p> : null}
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Server-rendered public summary for crawlers on auth-gated product pages. */
export function PublicPagePreview({ copy }: PublicPagePreviewProps) {
  const breadcrumb = buildBreadcrumbListJsonLd([
    homeBreadcrumb(),
    { name: copy.title, path: copy.path },
  ]);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [breadcrumb],
          }),
        }}
      />
      <nav className="money-page-crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span>{copy.title}</span>
      </nav>
      <AppPageHeader
        kicker={copy.kicker}
        title={copy.title}
        description={copy.description}
      />
      <article className="public-page-preview">
        {copy.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
        <ul>
          {copy.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {copy.related?.length ? (
          <RelatedPageLinks links={copy.related} heading="Related pages" />
        ) : null}
        <p className="public-page-preview-cta">
          <Link href="/sign-in">Sign in</Link>
          {" or "}
          <Link href="/register">create an account</Link>
          {" to use this feature."}
        </p>
      </article>
    </PageShell>
  );
}
