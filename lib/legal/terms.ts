import type { LegalDocument } from "./types";
import { SITE_SEO } from "@/lib/seo/site";

const lastUpdated = "10.08.2026";
const supportEmail = SITE_SEO.contactEmail;

export const termsOfService: LegalDocument = {
  title: "Terms of Service",
  lastUpdated: `Last updated: ${lastUpdated}`,
  intro:
    "By using File Portal (the “Site”) and by creating an account, purchasing TuningPoints, or placing any order with us (“we”, “us”), you accept these Terms of Service. If you do not agree, do not use the Site and do not make purchases.",
  sections: [
    {
      heading: "1. About File Portal",
      paragraphs: [
        "File Portal provides an account-based portal for purchasing TuningPoints and related file / tuning workflows. We operate from Plovdiv, Bulgaria.",
        `Contact for account and purchase questions: ${supportEmail}.`,
      ],
    },
    {
      heading: "2. Eligibility and account",
      paragraphs: [
        "You must be at least 16 years old (or the higher age of digital consent in your country, if applicable) and able to enter a binding contract.",
        "You must provide accurate registration details for required fields (username, email, password) and keep your login credentials secure. Optional fields (name, phone, country) may be left blank.",
        "You are responsible for activity under your account. Notify us promptly if you suspect unauthorised access.",
        "We may suspend or terminate accounts that violate these Terms, attempt payment fraud, abuse the service, or create security risk.",
      ],
    },
    {
      heading: "3. TuningPoints and payment",
      paragraphs: [
        "TuningPoints are prepaid digital credits on your File Portal account. One TuningPoint costs €10 unless we publish a different rate on the Site.",
        "Purchases are processed through Stripe Checkout. An order is accepted once payment is confirmed (via Stripe webhook and/or session confirmation).",
        "We may refuse or cancel a purchase due to pricing errors, suspected abuse, fraud risk, or other reasonable grounds. If payment was taken and we cancel, we will reverse the charge where practicable.",
      ],
    },
    {
      heading: "4. Non-refundable — all sales are final",
      paragraphs: [
        "ALL TUNINGPOINTS PURCHASES ARE FINAL AND NON-REFUNDABLE. This applies to every paid TuningPoints purchase via the Site.",
        "Once payment is confirmed, you have no right to cancel, return, exchange, or obtain a refund — including because you changed your mind, bought the wrong quantity, or no longer need the credits.",
        "By completing checkout and accepting these Terms, you expressly acknowledge that TuningPoints are digital goods delivered immediately to your account balance and that all sales are final.",
        "Nothing in these Terms limits mandatory consumer rights that cannot be waived under applicable law. Where EU consumer withdrawal rules apply to digital content, by starting delivery (crediting TuningPoints immediately after payment) and giving express consent / acknowledgement at checkout, you request immediate performance and acknowledge that you lose the right of withdrawal once performance has begun.",
      ],
    },
    {
      heading: "5. Service use and files",
      paragraphs: [
        "You may use the Site only for lawful purposes. You must not upload malware, attempt to breach security, reverse-engineer the service beyond what the law allows, or infringe others’ rights.",
        "You confirm you have the right to upload and process the files you submit. You remain responsible for how you use any files or outputs obtained through the portal.",
      ],
    },
    {
      heading: "6. Personal data",
      paragraphs: [
        "We process personal data as described in our Privacy Policy and Cookie Policy. By creating an account you acknowledge that you have read the Privacy Policy.",
        "You may delete your account from the Profile page or by contacting us. Deletion ends access to unused TuningPoints associated with that account unless we are legally required to retain specific records.",
      ],
    },
    {
      heading: "7. Limitation of liability",
      paragraphs: [
        "TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE to you or any third party for any direct, indirect, incidental, consequential, special, or punitive damages arising from use of the Site, TuningPoints, files, or related services.",
        "You assume full responsibility and risk for how you use TuningPoints and any files or services obtained through the portal.",
        "If liability is nevertheless established, it is limited to the amount you actually paid for the specific purchase at issue.",
        "Nothing in these Terms excludes liability that cannot be excluded under Bulgarian or mandatory EU law (for example for death or personal injury caused by negligence, or for fraud).",
      ],
    },
    {
      heading: "8. Intellectual property",
      paragraphs: [
        "Site content (text, logos, design, materials) is protected. Copying or commercial use without our prior written consent is prohibited.",
      ],
    },
    {
      heading: "9. Changes",
      paragraphs: [
        "We may update these Terms. The current version is always published on this page with the “Last updated” date. Material changes affecting existing accounts may also be communicated by email or an in-product notice where appropriate. Continued use after the effective date constitutes acceptance of the updated Terms, except where mandatory law requires a different process.",
      ],
    },
    {
      heading: "10. Governing law",
      paragraphs: [
        "These terms are governed by the laws of the Republic of Bulgaria. Disputes are resolved by the competent courts in Bulgaria, unless mandatory consumer rules require otherwise.",
        "If any clause is invalid, the rest remain in force.",
      ],
    },
  ],
};
