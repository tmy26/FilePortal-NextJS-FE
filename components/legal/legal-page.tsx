import Link from "next/link";
import type { LegalDocument } from "@/lib/legal/types";

type LegalPageProps = {
  document: LegalDocument;
};

export function LegalPage({ document }: LegalPageProps) {
  return (
    <main className="page-shell">
      <article className="legal-layout">
        <header className="auth-header">
          <h1>{document.title}</h1>
          <p className="muted">{document.lastUpdated}</p>
          <p>{document.intro}</p>
        </header>

        <div className="legal-sections">
          {document.sections.map((section) => (
            <section key={section.heading} className="legal-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 80)}>{paragraph}</p>
              ))}
              {section.bullets && section.bullets.length > 0 ? (
                <ul className="legal-bullets">
                  {section.bullets.map((item) => (
                    <li key={item.slice(0, 80)}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <p className="muted legal-footnote">
          These documents apply to File Portal. See also the{" "}
          <Link href="/privacy">Privacy Policy</Link>,{" "}
          <Link href="/cookies">Cookie Policy</Link>, and{" "}
          <Link href="/terms">Terms of Service</Link>. TuningPoints purchases
          are digital and non-refundable as stated in the Terms.
        </p>
      </article>
    </main>
  );
}
