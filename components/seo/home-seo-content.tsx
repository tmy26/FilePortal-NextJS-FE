import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  HOME_COVERAGE,
  HOME_ECU_FILES,
  HOME_HOW_IT_WORKS,
  HOME_PRICING,
  HOME_SEO_CONTENT,
  HOME_TCU_FILES,
  HOME_TRUST_FACTS,
  HOME_WHO,
  HOME_WHY,
  type HomeCard,
} from "@/lib/seo/public-page-copy";
import { MONEY_NAV_GROUPS, MONEY_PAGES } from "@/lib/seo/money-pages";
import { HomeScrollReveal } from "@/components/seo/home-scroll-reveal";

function revealStyle(index: number): CSSProperties {
  return { "--reveal-delay": `${index * 80}ms` } as CSSProperties;
}

function CardGrid({ items }: { items: readonly HomeCard[] }) {
  return (
    <div className="home-seo-grid">
      {items.map((item, index) => (
        <article
          key={item.title}
          className="home-seo-card"
          data-reveal=""
          style={revealStyle(index)}
        >
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function HomeSection({
  id,
  heading,
  lead,
  children,
}: {
  id: string;
  heading: string;
  lead: string;
  children: ReactNode;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} className="home-section" aria-labelledby={headingId}>
      <div className="home-section-inner">
        <div className="home-section-intro" data-reveal="">
          <h2 id={headingId} className="home-seo-heading">
            {heading}
          </h2>
          <p className="home-seo-lead">{lead}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Server-rendered SEO body — visible in HTML for crawlers and no-JS clients. */
export function HomeSeoContent() {
  const content = HOME_SEO_CONTENT;

  return (
    <HomeScrollReveal>
      <HomeSection
        id="how-it-works"
        heading={HOME_HOW_IT_WORKS.heading}
        lead={HOME_HOW_IT_WORKS.lead}
      >
        <ol className="home-steps">
          {HOME_HOW_IT_WORKS.steps.map((step, index) => (
            <li
              key={step.title}
              className="home-seo-card"
              data-reveal=""
              style={revealStyle(index)}
            >
              <span className="home-step-index">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="home-section-note" data-reveal="">
          <Link href="/how-it-works">How our ECU file service works</Link>
        </p>
      </HomeSection>

      <div className="home-trust" aria-label="What this portal actually provides">
        <ul className="home-trust-list">
          {HOME_TRUST_FACTS.map((fact, index) => (
            <li key={fact.label} data-reveal="" style={revealStyle(index)}>
              <span className="home-trust-label">{fact.label}</span>
              <span className="home-trust-value">{fact.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <nav className="home-section" aria-label="Tuning file services">
        <div className="home-section-inner">
          <div className="home-section-intro" data-reveal="">
            <h2 className="home-seo-heading">Tuning file services</h2>
            <p className="home-seo-lead">
              Public pages for the searches people use — ECU files, TCU files,
              Stage 1 / Stage 2, pricing, and how the service works.
            </p>
          </div>
          {MONEY_NAV_GROUPS.map((group, index) => (
            <div
              key={group.id}
              className="home-nav-group"
              data-reveal=""
              style={revealStyle(index)}
            >
              <p className="home-nav-group-label">{group.label}</p>
              <ul className="home-seo-links">
                {MONEY_PAGES.filter(
                  (page) =>
                    page.navGroup === group.id &&
                    page.slug !== "supported-ecus" &&
                    page.slug !== "supported-tools",
                ).map((page) => (
                  <li key={page.slug}>
                    <Link href={`/${page.slug}`}>{page.navLabel}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <HomeSection
        id="overview-ecu"
        heading={HOME_ECU_FILES.heading}
        lead={HOME_ECU_FILES.lead}
      >
        <CardGrid items={HOME_ECU_FILES.items} />
        <p className="home-section-note" data-reveal="">
          <Link href="/ecu-tuning-files">Custom ECU tuning files</Link>
          {" · "}
          <Link href="/stage-1-tuning-files">Stage 1</Link>
          {" · "}
          <Link href="/stage-2-tuning-files">Stage 2</Link>
          {" · "}
          <Link href="/tcu-tuning-files">TCU files</Link>
        </p>
      </HomeSection>

      <HomeSection
        id="tcu-gearbox-files"
        heading={HOME_TCU_FILES.heading}
        lead={HOME_TCU_FILES.lead}
      >
        <CardGrid items={HOME_TCU_FILES.items} />
        <p className="home-section-note" data-reveal="">
          <Link href="/tcu-tuning-files">TCU & gearbox tuning files</Link>
        </p>
      </HomeSection>

      <HomeSection
        id="coverage"
        heading={HOME_COVERAGE.heading}
        lead={HOME_COVERAGE.lead}
      >
        <CardGrid items={HOME_COVERAGE.items} />
        <p className="home-section-note" data-reveal="">
          <Link href="/stage-1-tuning-files">Stage 1</Link>
          {" · "}
          <Link href="/ecu-tuning-files">Custom ECU tuning files</Link>
        </p>
      </HomeSection>

      <HomeSection
        id="pricing"
        heading={HOME_PRICING.heading}
        lead={HOME_PRICING.lead}
      >
        <CardGrid items={HOME_PRICING.items} />
        <p className="home-section-note" data-reveal="">
          <Link href="/pricing">ECU tuning file pricing</Link>
          {" · "}
          <Link href="/shop">Buy TuningPoints</Link>
          {" · "}
          <Link href="/terms">Terms of Service</Link>
        </p>
      </HomeSection>

      <HomeSection id="why" heading={HOME_WHY.heading} lead={HOME_WHY.lead}>
        <div className="home-seo-grid home-seo-grid-2">
          {HOME_WHY.items.map((item, index) => (
            <article
              key={item.title}
              className="home-seo-card"
              data-reveal=""
              style={revealStyle(index)}
            >
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </HomeSection>

      <HomeSection id="who" heading={HOME_WHO.heading} lead={HOME_WHO.lead}>
        <CardGrid items={HOME_WHO.items} />
      </HomeSection>

      <section
        id="faq"
        className="home-section"
        aria-labelledby="home-faq-heading"
      >
        <div className="home-section-inner home-section-inner-narrow">
          <div className="home-section-intro" data-reveal="">
            <h2 id="home-faq-heading" className="home-seo-heading">
              {content.faqHeading}
            </h2>
          </div>
          <dl className="home-seo-faq-list">
            {content.faq.map((item, index) => (
              <div
                key={item.question}
                className="home-seo-faq-item"
                data-reveal=""
                style={revealStyle(Math.min(index, 6))}
              >
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </HomeScrollReveal>
  );
}
