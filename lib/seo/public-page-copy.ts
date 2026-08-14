export type PublicPagePreviewCopy = {
  kicker: string;
  title: string;
  description: string;
  paragraphs: string[];
  bullets: string[];
};

export const UPLOAD_PUBLIC_PREVIEW: PublicPagePreviewCopy = {
  kicker: "File Portal",
  title: "New File Request",
  description:
    "Upload ECU or gearbox files for professional tuning — vehicle selection, tuning options, and secure .bin upload.",
  paragraphs: [
    "File Portal by TMY Tuned lets registered customers submit ECU and gearbox tuning file requests online. Choose vehicle type, brand, model, engine, and ECU details, then select tuning options and upload your binary file.",
    "Each completed request uses TuningPoints from your account balance. You can track status and history after sign-in.",
  ],
  bullets: [
    "ECU and gearbox file uploads",
    "Vehicle catalog with make, model, engine, and ECU selection",
    "Tuning options including Stage 1/2/3 and ecology solutions",
    "Secure account-based request tracking",
  ],
};

export const SHOP_PUBLIC_PREVIEW: PublicPagePreviewCopy = {
  kicker: "File Portal",
  title: "Buy TuningPoints",
  description:
    "Purchase TuningPoints with Stripe to pay for ECU and gearbox file requests on File Portal.",
  paragraphs: [
    "TuningPoints are the credit used for File Portal file requests. One TuningPoint equals €10. After Stripe checkout completes, points are added to your account automatically.",
    "Create a free account or sign in before checkout. Points are tied to your profile and used when you submit new file requests.",
  ],
  bullets: [
    "1 TuningPoint = €10",
    "Stripe Checkout for card payments",
    "Points credited after successful payment",
    "Balance shown in your account after sign-in",
  ],
};

export type HomeFaqItem = { question: string; answer: string };

export type HomeSeoContent = {
  introHeading: string;
  introLead: string;
  sections: {
    id: string;
    heading: string;
    paragraphs: string[];
  }[];
  faqHeading: string;
  faq: HomeFaqItem[];
  pageLinks: { href: string; label: string }[];
};

export const HOME_SEO_CONTENT: HomeSeoContent = {
  introHeading: "ECU & gearbox file portal",
  introLead:
    "File Portal by TMY Tuned — upload tuning files, buy TuningPoints, and manage ECU and gearbox requests securely online.",
  pageLinks: [
    { href: "/upload", label: "New File Request" },
    { href: "/shop", label: "Buy TuningPoints" },
    { href: "/register", label: "Create account" },
    { href: "/sign-in", label: "Sign in" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
  sections: [
    {
      id: "what-is-file-portal",
      heading: "What is File Portal?",
      paragraphs: [
        "File Portal is the online customer portal for TMY Tuned (TMYTuned), an automotive tuning brand based in Plovdiv, Bulgaria. Registered users upload ECU or gearbox binary files, choose tuning options, and track request history from one account.",
        "The portal supports professional chip tuning workflows: vehicle identification, tuning option selection, TuningPoints billing, and secure file transfer — without email back-and-forth.",
      ],
    },
    {
      id: "ecu-gearbox-files",
      heading: "ECU and gearbox file requests",
      paragraphs: [
        "Submit ECU files for remap and calibration work, or gearbox / TCU / DSG files for transmission tuning. The upload flow guides you through vehicle type, brand, model, engine, and ECU details before you pick tuning options and attach your .bin file.",
        "Common tuning categories include Stage 1, Stage 2, and Stage 3 maps, plus ecology-related solutions such as DPF, EGR, AdBlue, SCR, SWIRL, FAP, NOx, and IMMO-related requests where applicable.",
      ],
    },
    {
      id: "tuningpoints",
      heading: "TuningPoints and billing",
      paragraphs: [
        "File Portal uses TuningPoints as account credit. One TuningPoint costs €10 and is consumed when you complete a file request. Buy points in the Shop via Stripe Checkout; after payment confirms, the balance updates on your account.",
        "Sign in is required to upload files, purchase points, and view file history. Public pages describe the product; account features stay private.",
      ],
    },
    {
      id: "operator",
      heading: "Operated by TMY Tuned",
      paragraphs: [
        "File Portal is operated by TMY Tuned in Plovdiv, Bulgaria. For product support contact ecufileportal.support@gmail.com.",
        "The main TMY Tuned website at tmytuned.com covers chip tuning services, Honda tuning, workshop appointments, and automotive parts. File Portal is the dedicated upload and billing portal for tuning file customers.",
      ],
    },
  ],
  faqHeading: "Frequently asked questions",
  faq: [
    {
      question: "Do I need an account to use File Portal?",
      answer:
        "Yes. Create a free account at /register or sign in at /sign-in. Upload, shop checkout, file history, and profile features require authentication.",
    },
    {
      question: "What are TuningPoints?",
      answer:
        "TuningPoints are prepaid credits on your account. Each point equals €10 and pays for completed file requests. Buy them at /shop after signing in.",
    },
    {
      question: "What file types can I upload?",
      answer:
        "The portal accepts ECU and gearbox binary files (.bin) through the New File Request flow at /upload after you select vehicle and tuning options.",
    },
    {
      question: "Who runs File Portal?",
      answer:
        "File Portal is operated by TMY Tuned (TMYTuned), an automotive tuning brand in Plovdiv, Bulgaria. Support: ecufileportal.support@gmail.com.",
    },
  ],
};
