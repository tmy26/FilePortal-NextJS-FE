import Link from "next/link";
import { HOME_SEO_CONTENT } from "@/lib/seo/public-page-copy";

/** Server-rendered SEO body copy — visible in HTML for crawlers and no-JS clients. */
export function HomeSeoContent() {
  const content = HOME_SEO_CONTENT;

  return (
    <div className="home-seo">
      <section aria-labelledby="home-seo-intro" className="page-shell home-seo-section">
        <h2 id="home-seo-intro" className="home-seo-heading">
          {content.introHeading}
        </h2>
        <p className="home-seo-lead">{content.introLead}</p>
        <ul className="home-seo-links">
          {content.pageLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="page-shell home-seo-section">
        <div className="home-seo-grid">
          {content.sections.map((section) => (
            <article key={section.id} id={section.id} className="home-seo-card">
              <h3>{section.heading}</h3>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="home-faq-heading"
        className="page-shell home-seo-section home-seo-faq"
      >
        <h2 id="home-faq-heading" className="home-seo-heading">
          {content.faqHeading}
        </h2>
        <dl className="home-seo-faq-list">
          {content.faq.map((item) => (
            <div key={item.question} className="home-seo-faq-item">
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
