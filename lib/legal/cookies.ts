import type { LegalDocument } from "./types";
import { SITE_SEO } from "@/lib/seo/site";

const lastUpdated = "10.08.2026";
const supportEmail = SITE_SEO.contactEmail;

/**
 * Cookie / ePrivacy notice. Auth cookies are strictly necessary —
 * no consent banner required for those alone under typical EU guidance.
 */
export const cookiePolicy: LegalDocument = {
  title: "Cookie Policy",
  lastUpdated: `Last updated: ${lastUpdated}`,
  intro:
    "This Cookie Policy explains how File Portal (“we”) uses cookies and similar technologies on the Site. It should be read together with our Privacy Policy.",
  sections: [
    {
      heading: "1. What are cookies?",
      paragraphs: [
        "Cookies are small text files stored on your device when you visit a website. They help the site function (for example keeping you signed in) or remember preferences.",
      ],
    },
    {
      heading: "2. Cookies we use",
      paragraphs: [
        "We use only strictly necessary cookies for authentication and security. We do not set advertising, social-media, or marketing-analytics cookies.",
      ],
      bullets: [
        "fp_access — httpOnly session cookie holding the access token so we can authenticate API requests while you use the Site. Validity follows the token expiry (refreshed while you stay signed in); the cookie itself may be retained up to 24 hours. SameSite=Strict.",
        "fp_refresh — httpOnly cookie holding a refresh token used to obtain a new access token. Typical lifetime: up to 24 hours. SameSite=Strict.",
      ],
    },
    {
      heading: "3. Legal basis",
      paragraphs: [
        "These cookies are strictly necessary to provide the service you request (signing in and staying authenticated). They are set on the basis of our contract with you and/or our legitimate interest in securing the service, and under the ePrivacy rules exemption for cookies that are essential to provide an information society service explicitly requested by the user.",
        "Because we do not use non-essential tracking or advertising cookies, we do not show a cookie consent banner for optional cookies. If we introduce non-essential cookies in the future, we will ask for consent first and update this policy.",
      ],
    },
    {
      heading: "4. Managing cookies",
      paragraphs: [
        "You can delete or block cookies in your browser settings. If you block the authentication cookies, you will not be able to stay signed in or use account features that require login.",
        "Signing out clears our auth cookies from your browser for this Site.",
      ],
    },
    {
      heading: "5. Third parties",
      paragraphs: [
        "When you pay with Stripe Checkout you leave our Site (or use Stripe-hosted pages). Stripe may set its own cookies under Stripe’s policies. We do not control those cookies.",
      ],
    },
    {
      heading: "6. More information",
      paragraphs: [
        `For how we process personal data more generally, see our Privacy Policy. Questions: ${supportEmail}.`,
      ],
    },
  ],
};
