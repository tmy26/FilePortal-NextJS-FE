import type { LegalDocument } from "./types";
import { SITE_SEO } from "@/lib/seo/site";

const lastUpdated = "10.08.2026";
const supportEmail = SITE_SEO.contactEmail;

/**
 * GDPR Art. 13/14 information notice for File Portal (controller in Bulgaria).
 * Not legal advice — verify company identity details before production use.
 */
export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: `Last updated: ${lastUpdated}`,
  intro:
    "This Privacy Policy explains how File Portal (“we”, “us”, “our”) collects, uses, stores, and shares personal data when you visit the Site, create an account, upload or transfer files, or purchase TuningPoints. We process personal data in accordance with Regulation (EU) 2016/679 (GDPR) and the Bulgarian Personal Data Protection Act.",
  sections: [
    {
      heading: "1. Data controller",
      paragraphs: [
        "Controller: File Portal / TMY Tuned, Plovdiv, Republic of Bulgaria.",
        `Privacy contact email: ${supportEmail}.`,
        "If you have questions about this policy or want to exercise your rights, contact us at the email above. We aim to respond within one month as required by GDPR.",
      ],
    },
    {
      heading: "2. Scope",
      paragraphs: [
        "This policy applies to personal data processed through the File Portal website and related account, payment, upload, file-history, and support features.",
        "It does not cover third-party websites you may reach via links (for example Stripe’s hosted checkout pages), which have their own privacy notices.",
      ],
    },
    {
      heading: "3. Personal data we collect",
      paragraphs: [
        "We only collect data that is necessary for the purposes described below (data minimisation).",
      ],
      bullets: [
        "Account identifiers: username, email address, password (stored only as a one-way hash — we never store plaintext passwords).",
        "Optional profile data you choose to provide: first name, last name, telephone number, country of residence.",
        "Account status and credits: whether the account is active, TuningPoints balance, and timestamps for account creation/modification.",
        "Purchase / billing data: quantity purchased, amounts, Stripe Checkout Session identifiers and related payment status needed to confirm payment and credit your balance. Card details are collected and processed by Stripe — we do not store full card numbers on our servers.",
        "Service / file workflow data: vehicle and tuning selections you submit, uploaded files and related request/transfer metadata needed to provide the service and show file history.",
        "Technical / security data: session authentication cookies, approximate security logs (for example failed login or abuse signals), and standard server logs that may include IP address and user-agent for a limited time.",
        "Communications: messages you send us by email for support or privacy requests.",
      ],
    },
    {
      heading: "4. How we collect data",
      paragraphs: [
        "Directly from you when you register, sign in, update your profile, checkout, upload files, or contact us.",
        "Automatically when you use the Site (session cookies and security/technical logs).",
        "From payment providers (Stripe) when confirming that a checkout was completed successfully.",
      ],
    },
    {
      heading: "5. Purposes and legal bases (GDPR Art. 6)",
      paragraphs: [
        "We process personal data only where a legal basis applies:",
      ],
      bullets: [
        "Contract (Art. 6(1)(b)): creating and managing your account, authenticating you, providing file/upload/transfer features, processing TuningPoints purchases, crediting your balance, and providing related customer support.",
        "Legal obligation (Art. 6(1)(c)): retaining certain transaction records where Bulgarian or EU accounting, tax, or consumer rules require it.",
        "Legitimate interests (Art. 6(1)(f)): securing the service, preventing fraud and abuse, debugging reliability issues, and improving service integrity — balanced against your rights and freedoms.",
        "Consent (Art. 6(1)(a)): only where we ask for it separately (for example optional marketing emails, if we introduce them). You may withdraw consent at any time without affecting processing that relied on another basis.",
      ],
    },
    {
      heading: "6. Optional profile fields",
      paragraphs: [
        "First name, last name, telephone number, and country are optional at registration. You may leave them blank and still use the core service.",
        "If you provide them, we use them to identify you in support conversations and, where relevant, to contact you about an active file request. You can ask us to erase or update these fields at any time.",
      ],
    },
    {
      heading: "7. Who we share data with",
      paragraphs: [
        "We do not sell your personal data. We share data only with:",
      ],
      bullets: [
        "Stripe — payment processing. Stripe processes payment data under its own terms and privacy policy. See https://stripe.com/privacy.",
        "Infrastructure / hosting providers that host the Site, application servers, and databases, acting as processors under our instructions and appropriate contracts (including Art. 28 GDPR data processing terms where required).",
        "Professional advisers (for example accountants or lawyers) bound by confidentiality, where necessary.",
        "Competent public authorities when required by law or to protect our legal rights.",
      ],
    },
    {
      heading: "8. International transfers",
      paragraphs: [
        "Our primary operations are in the European Union (Bulgaria). Some providers (for example Stripe or hosting) may process data in or access it from countries outside the EEA.",
        "Where personal data is transferred outside the EEA, we rely on an adequacy decision and/or appropriate safeguards such as the European Commission’s Standard Contractual Clauses, plus any supplementary measures required.",
      ],
    },
    {
      heading: "9. Retention",
      paragraphs: [
        "We keep personal data no longer than necessary for the purposes above:",
      ],
      bullets: [
        "Account profile data: for as long as your account remains open, then deleted or anonymised after closure (subject to the exceptions below).",
        "File / request history needed for the service: while your account is active and for a limited period afterwards if needed to resolve disputes or security incidents, then deleted or anonymised.",
        "Purchase and invoicing records: retained as required by Bulgarian accounting and tax law (typically up to 5–10 years depending on the document type).",
        "Security and server logs: kept for a short period unless needed longer to investigate abuse or incidents.",
        "Privacy request correspondence: kept as needed to demonstrate that we responded to your request.",
      ],
    },
    {
      heading: "10. Your rights under GDPR",
      paragraphs: [
        "Subject to the conditions and exceptions in GDPR, you have the right to:",
      ],
      bullets: [
        "Access — obtain confirmation and a copy of your personal data.",
        "Rectification — correct inaccurate or incomplete data.",
        "Erasure (“right to be forgotten”) — request deletion where applicable (for example via account deletion in your profile, or by emailing us).",
        "Restriction — ask us to limit processing in certain cases.",
        "Portability — receive data you provided to us in a structured, commonly used, machine-readable format, where processing is based on contract or consent and carried out by automated means.",
        "Objection — object to processing based on legitimate interests, including profiling based on those interests.",
        "Withdraw consent — where processing is based on consent, without affecting prior lawful processing.",
        "Lodge a complaint — with the Commission for Personal Data Protection (CPDP / КЗЛД), Bulgaria: https://www.cpdp.bg, or with another EU supervisory authority where you live or work.",
      ],
    },
    {
      heading: "11. How to exercise your rights",
      paragraphs: [
        `Email ${supportEmail} with the subject “Privacy request” and describe what you need (access, correction, deletion, etc.). We may ask you to verify your identity before fulfilling the request.`,
        "You can also permanently delete your account from the Profile page (this removes account access and related service data we no longer need to keep). Some payment/accounting records may be retained where the law requires it, in anonymised or minimised form where possible.",
      ],
    },
    {
      heading: "12. Cookies and similar technologies",
      paragraphs: [
        "We use strictly necessary cookies to keep you signed in (authentication session). Details are in our Cookie Policy. We do not use advertising cookies or third-party tracking cookies for marketing analytics on the Site.",
      ],
    },
    {
      heading: "13. Security",
      paragraphs: [
        "We apply appropriate technical and organisational measures under GDPR Art. 32, including encrypted transport (HTTPS/TLS), hashed passwords, httpOnly session cookies, access controls to production systems, and least-privilege access to personal data.",
        "No method of transmission or storage is completely secure. If we become aware of a personal data breach that is likely to result in a high risk to your rights and freedoms, we will notify the CPDP and, where required, affected users without undue delay.",
      ],
    },
    {
      heading: "14. Children",
      paragraphs: [
        "File Portal is intended for adults and business users. We do not knowingly collect personal data from children under 16. If you believe a child has provided us data, contact us and we will delete it.",
      ],
    },
    {
      heading: "15. Automated decision-making",
      paragraphs: [
        "We do not use personal data for automated decision-making that produces legal or similarly significant effects about you (GDPR Art. 22), other than routine fraud/security checks that may temporarily block abusive activity.",
      ],
    },
    {
      heading: "16. Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The “Last updated” date at the top shows the current version. Material changes will be reflected on this page. Continued use of the Site after an update means you have been informed of the revised notice; where consent is required for a new purpose, we will ask for it.",
      ],
    },
  ],
};
