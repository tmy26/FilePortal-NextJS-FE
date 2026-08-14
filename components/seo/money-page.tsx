import Link from "next/link";
import { MoneyPageJsonLd } from "@/components/seo/money-page-json-ld";
import { ORGANIZATION_SOCIAL_LINKS } from "@/lib/seo/json-ld";
import type { MoneyPageDef } from "@/lib/seo/money-pages";

type MoneyPageProps = {
  page: MoneyPageDef;
};

function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: string;
}) {
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function MoneyPage({ page }: MoneyPageProps) {
  const uploadHint =
    page.fileKind === "gearbox"
      ? "Start a request and choose Gearbox as the file kind."
      : page.fileKind === "ecu"
        ? "Start a request and choose ECU as the file kind."
        : null;

  return (
    <article className="money-page">
      <MoneyPageJsonLd page={page} />
      <header className="money-page-header">
        <nav className="money-page-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {page.breadcrumbParent ? (
            <>
              <span aria-hidden="true">/</span>
              <Link href={page.breadcrumbParent.path}>
                {page.breadcrumbParent.name}
              </Link>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span>{page.h1}</span>
        </nav>
        <p className="money-page-kicker">{page.kicker}</p>
        <h1 className="home-heading">{page.h1}</h1>
        <p className="money-page-lead">{page.lead}</p>
        <div className="home-actions">
          <CtaLink href={page.primaryCta.href} className="cta">
            {page.primaryCta.label}
          </CtaLink>
          <CtaLink href={page.secondaryCta.href} className="cta cta-secondary">
            {page.secondaryCta.label}
          </CtaLink>
        </div>
        {uploadHint ? <p className="money-page-hint">{uploadHint}</p> : null}
      </header>

      {page.sections.map((section) => (
        <section key={section.heading} className="money-page-section">
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 56)}>{paragraph}</p>
          ))}
          {page.slug === "about" && section.heading === "Official profiles" ? (
            <nav
              className="related-page-links"
              aria-label="Official TMY Tuned profiles"
            >
              <ul>
                {ORGANIZATION_SOCIAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} rel="me noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </section>
      ))}

      <section
        className="money-page-section"
        aria-labelledby="money-faq-heading"
      >
        <h2 id="money-faq-heading">
          {page.faqHeading ?? "Frequently asked questions"}
        </h2>
        <dl className="home-seo-faq-list">
          {page.faq.map((item) => (
            <div key={item.question} className="home-seo-faq-item">
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav className="money-page-related" aria-label="Related pages">
        <h2>Related</h2>
        <ul>
          {page.related.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="money-page-final">
        <h2>{page.primaryCta.label}</h2>
        <div className="home-actions">
          <CtaLink href={page.primaryCta.href} className="cta">
            {page.primaryCta.label}
          </CtaLink>
          <CtaLink href={page.secondaryCta.href} className="cta cta-secondary">
            {page.secondaryCta.label}
          </CtaLink>
        </div>
      </section>
    </article>
  );
}
