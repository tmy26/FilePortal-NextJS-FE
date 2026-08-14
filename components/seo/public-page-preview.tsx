import Link from "next/link";
import type { PublicPagePreviewCopy } from "@/lib/seo/public-page-copy";
import { AppPageHeader, PageShell } from "@/components/page-shell";

type PublicPagePreviewProps = {
  copy: PublicPagePreviewCopy;
};

/** Server-rendered public summary for crawlers on auth-gated product pages. */
export function PublicPagePreview({ copy }: PublicPagePreviewProps) {
  return (
    <PageShell>
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
