export type PublicPagePreviewCopy = {
  kicker: string;
  title: string;
  description: string;
  path: string;
  paragraphs: string[];
  bullets: string[];
  related?: { href: string; label: string }[];
};

export const UPLOAD_RELATED_LINKS = [
  { href: "/ecu-tuning-files", label: "ECU Tuning Files" },
  { href: "/tcu-tuning-files", label: "TCU Tuning Files" },
  { href: "/pricing", label: "Pricing" },
  { href: "/stage-1-tuning-files", label: "Stage 1" },
] as const;

export const UPLOAD_PUBLIC_PREVIEW: PublicPagePreviewCopy = {
  kicker: "Tuning file request",
  title: "Upload Your ECU or TCU File",
  path: "/upload",
  description:
    "Upload your ECU or gearbox BIN file online, select the vehicle and tuning options, and manage the complete tuning request securely through ECUFilePortal.",
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
  related: [...UPLOAD_RELATED_LINKS],
};

export const SHOP_PUBLIC_PREVIEW: PublicPagePreviewCopy = {
  kicker: "File Portal",
  title: "Buy TuningPoints",
  path: "/shop",
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
  pageLinks: { href: string; label: string }[];
  faqHeading: string;
  faq: HomeFaqItem[];
};

export type HomeCard = {
  title: string;
  body: string;
};

export type HomeStep = {
  title: string;
  body: string;
};

export const HOME_PAGE_COPY = {
  title: "ECU File Service | Online ECU Tuning Files | ECUFilePortal",
  description:
    "Online ECU and TCU file service by TMY Tuned. Create an account, upload the original BIN, pay with TuningPoints, and track each request until the processed file is Ready.",
  h1: "Professional ECU & TCU Tuning File Service",
  hero:
    "Online ECU and TCU file service for tuners, workshops and vehicle specialists. Create an account, send the original file, choose the required work, pay with TuningPoints and track the request from upload to Ready.",
  slogan: "Send files. Stay in control.",
  primaryCta: "Upload ECU File",
  signedInSecondaryCta: "Buy TuningPoints",
} as const;

/** Only facts the live product can prove. No invented SLA, coverage lists, or customer counts. */
export const HOME_TRUST_FACTS = [
  {
    label: "File types",
    value: "ECU and gearbox BIN uploads",
  },
  {
    label: "Request status",
    value: "Pending, In progress, Ready",
  },
  {
    label: "Pricing",
    value: "1 TuningPoint = €10",
  },
  {
    label: "Support",
    value: "Per-request chat and email",
  },
  {
    label: "Operator",
    value: "TMY Tuned, Plovdiv",
  },
] as const;

export const HOME_ECU_FILES = {
  heading: "What the service covers",
  lead: "The portal accepts ECU and gearbox BIN requests. Detail for custom remap files, Stage 1, Stage 2, and TCU jobs lives on those pages — not repeated here.",
  items: [
    {
      title: "ECU files",
      body: "Custom ECU tuning files and remap files are ordered from the original engine BIN. See Custom ECU Tuning Files for that intent.",
    },
    {
      title: "TCU files",
      body: "Transmission binaries use the Gearbox file kind, including dual-clutch / DSG reads. See TCU & gearbox tuning files.",
    },
    {
      title: "Stage 1 and Stage 2",
      body: "Stock-hardware vs supporting-hardware calibrations are separate pages, so they do not compete with this service overview.",
    },
  ] satisfies HomeCard[],
};

export const HOME_TCU_FILES = {
  heading: "Gearbox requests in the same portal",
  lead: "TCU work uses the same account and statuses as ECU work. The dedicated TCU page holds gearbox-specific intent.",
  items: [
    {
      title: "One account",
      body: "ECU and gearbox jobs share TuningPoints, File History, and request chat. Start a New File Request and choose Gearbox.",
    },
    {
      title: "Not a DSG shop",
      body: "Dual-clutch reads are gearbox requests. There is no separate DSG catalog on the homepage.",
    },
    {
      title: "Same delivery",
      body: "Pending, In progress, Ready — then download the processed BIN from that request.",
    },
  ] satisfies HomeCard[],
};

export const HOME_HOW_IT_WORKS = {
  heading: "How the online file service works",
  lead: "This homepage explains the service loop. The dedicated How it works page is the step-by-step URL for that search.",
  steps: [
    {
      title: "Create an account",
      body: "Register, verify, and sign in. Upload, Shop, and File History are account features.",
    },
    {
      title: "Send the original file",
      body: "Choose ECU or gearbox, complete the vehicle fields, attach the .bin.",
    },
    {
      title: "Pay with TuningPoints",
      body: "1 TuningPoint = €10. Option costs are shown before submit. Pricing detail is on the pricing page.",
    },
    {
      title: "Track until Ready",
      body: "Pending, In progress, Ready. TMY Tuned attaches the processed file to the same request — the portal does not auto-generate maps.",
    },
  ] satisfies HomeStep[],
};

export const HOME_COVERAGE = {
  heading: "Our specialty",
  lead: "Honda Stage 1, sensor off and IMMO off — primarily Keihin and Matsushita ECUs. The main file work is ecology offs: DPF off, EGR off and AdBlue off.",
  items: [
    {
      title: "Honda Stage 1",
      body: "Honda Stage 1 is a core calibration for Honda Keihin and Matsushita ECUs. Order it as an ECU request and select Stage 1 when that option is listed.",
    },
    {
      title: "Sensors off and IMMO off",
      body: "Sensor-off and IMMO-off files are part of the specialty for Honda Keihin and Matsushita ECUs. Choose those options on the request when they apply to the original BIN you upload.",
    },
    {
      title: "DPF, EGR and AdBlue off",
      body: "Ecology offs are the main service: DPF off, EGR off and AdBlue off. They are selected on the file request, not downloaded as a generic pack.",
    },
  ] satisfies HomeCard[],
};

export const HOME_PRICING = {
  heading: "Credits, not a file menu",
  lead: "The service price unit is TuningPoints. File-level pricing copy lives on ECU tuning file pricing.",
  items: [
    {
      title: "1 TuningPoint = €10",
      body: "Buy points in the Shop with Stripe. They credit the signed-in account after payment confirms.",
    },
    {
      title: "Charged on upload",
      body: "Browse these pages freely. The option total is due when the BIN is submitted.",
    },
    {
      title: "No Stage pack table here",
      body: "Stage 1 and Stage 2 costs are the catalog numbers on the request, not homepage prices.",
    },
  ] satisfies HomeCard[],
};

export const HOME_WHY = {
  heading: "Why ECUFilePortal",
  lead: "The product is a tracked file request — not a public map download and not a workshop appointment page.",
  items: [
    {
      title: "Defined process",
      body: "Every job is a request with vehicle data, selected options, an original BIN, and a status. Work is not handled as an unstructured email attachment.",
    },
    {
      title: "Support on the request",
      body: "Open chat on the file-history page for that job, or email ecufileportal.support@gmail.com.",
    },
    {
      title: "Revisions on the same job",
      body: "Processed files are versioned on the request. When a later processed file is added, it appears on the same history entry.",
    },
    {
      title: "Account-scoped files",
      body: "Downloads use time-limited links for files that belong to your request. Public URLs are not used as a file dump.",
    },
  ] satisfies HomeCard[],
};

export const HOME_WHO = {
  heading: "Who it is for",
  lead: "Anyone with an account can submit a request. The workflow assumes you can read and write a BIN.",
  items: [
    {
      title: "Tuners",
      body: "Send original files, select the required options, and pull the processed file from the same account.",
    },
    {
      title: "Garages and workshops",
      body: "Keep jobs in file history instead of mixing customer files across inboxes.",
    },
    {
      title: "Professionals with a flashing tool",
      body: "If you already read ECU or TCU files, this portal is the order and delivery channel. It does not replace the tool on the vehicle.",
    },
  ] satisfies HomeCard[],
};

export const HOME_SEO_CONTENT: HomeSeoContent = {
  introHeading: "How ECUFilePortal works",
  introLead:
    "ECUFilePortal is the online ECU and TCU file service by TMY Tuned — upload a BIN file, choose tuning options, pay with TuningPoints, and track each request from your account.",
  pageLinks: [
    { href: "/upload", label: "Upload ECU File" },
    { href: "/shop", label: "Buy TuningPoints" },
    { href: "/register", label: "Create Free Account" },
    { href: "/sign-in", label: "Sign in" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
  faqHeading: "Frequently asked questions",
  faq: [
    {
      question: "What is ECUFilePortal?",
      answer:
        "ECUFilePortal is TMY Tuned’s online portal for ECU and gearbox tuning file requests. You upload an original BIN, select vehicle details and tuning options, pay with TuningPoints, and download the processed file from the same request when it is Ready.",
    },
    {
      question: "Do I need an account?",
      answer:
        "Yes. Create a free account or sign in. Upload, Shop, file history, and profile require a signed-in user.",
    },
    {
      question: "Where do I order a custom ECU remap file?",
      answer:
        "On Custom ECU Tuning Files (/ecu-tuning-files). This homepage is the online ECU file service overview, not the remap landing.",
    },
    {
      question: "How do TuningPoints work?",
      answer:
        "TuningPoints are prepaid credits. One TuningPoint costs €10. Buy them in the Shop with Stripe. The cost of a request is the sum of the selected tuning options, shown before upload.",
    },
    {
      question: "Are TuningPoints refundable?",
      answer:
        "No. TuningPoints purchases are final and non-refundable under the Terms of Service, except where mandatory consumer law says otherwise.",
    },
    {
      question: "How does a request move from upload to a finished file?",
      answer:
        "A new request starts as Pending, can move to In progress, then Ready when a processed file is attached. You download original and processed files from that request’s history page.",
    },
    {
      question: "What is the difference between Stage 1 and Stage 2?",
      answer:
        "Stage 1 is stock hardware (/stage-1-tuning-files). Stage 2 is supporting hardware (/stage-2-tuning-files). This homepage stays on the file-service overview.",
    },
    {
      question: "Can I request DPF, EGR, or AdBlue solutions?",
      answer:
        "Yes. Ecology offs — DPF off, EGR off and AdBlue off — are the main service. Honda Stage 1, sensor off and IMMO off are the specialty, primarily on Keihin and Matsushita ECUs. Select the options shown for the file you upload.",
    },
    {
      question: "What if my ECU is not in the catalog?",
      answer:
        "Vehicle type and brand must be selected. Later fields (model, generation, engine, ECU) can be marked unknown if they are not listed. Do not invent a catalog row — use unknown and describe the job through the request.",
    },
    {
      question: "Which flashing tools do you support?",
      answer:
        "The portal accepts the BIN you upload. It does not certify named tools. Use the tool you already have to read the original file and to write the processed file.",
    },
    {
      question: "How long does a file take?",
      answer:
        "Typical turnaround is about 30 minutes. There is no guaranteed SLA. Watch the request status in File History. Use the request chat or email ecufileportal.support@gmail.com if you need an update.",
    },
    {
      question: "Who operates ECUFilePortal?",
      answer:
        "TMY Tuned (TMYTuned) in Plovdiv, Bulgaria. Workshop and parts content lives on tmytuned.com. Support for this portal: ecufileportal.support@gmail.com.",
    },
  ],
};
