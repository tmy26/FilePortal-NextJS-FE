export type MoneyPageFaq = {
  question: string;
  answer: string;
};

export type MoneyPageSection = {
  heading: string;
  paragraphs: string[];
};

export type MoneyPageCta = {
  href: string;
  label: string;
};

export type MoneyPageDef = {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  lead: string;
  kicker: string;
  navLabel: string;
  navGroup: "files" | "process" | "company";
  schema: "service" | "webPage";
  priority: number;
  fileKind?: "ecu" | "gearbox";
  primaryCta: MoneyPageCta;
  secondaryCta: MoneyPageCta;
  sections: MoneyPageSection[];
  faq: MoneyPageFaq[];
  faqHeading?: string;
  related: { href: string; label: string }[];
  /** Parent crumb after Home. Only real pages — never invented ECU-family URLs. */
  breadcrumbParent?: { name: string; path: string };
};

const uploadCta: MoneyPageCta = { href: "/upload", label: "Upload File" };
const registerCta: MoneyPageCta = { href: "/register", label: "Create Account" };
const shopCta: MoneyPageCta = { href: "/shop", label: "Buy TuningPoints" };
const contactCta: MoneyPageCta = {
  href: "mailto:ecufileportal.support@gmail.com",
  label: "Email Support",
};

export const MONEY_PAGES: MoneyPageDef[] = [
  {
    slug: "ecu-tuning-files",
    title: "Custom ECU Tuning Files | ECU Remap Files | ECUFilePortal",
    metaDescription:
      "Custom ECU tuning files and ECU remap files from TMY Tuned. Upload the original ECU file, select the calibration, and receive the modified file in your ECUFilePortal account.",
    h1: "Custom ECU Tuning Files",
    kicker: "ECU remap files",
    navLabel: "ECU files",
    navGroup: "files",
    schema: "service",
    lead: "Professional online ECU tuning file service for tuners, workshops and vehicle specialists. Upload the original ECU file, select the required calibration and receive the modified file through your ECUFilePortal account.",
    priority: 0.88,
    fileKind: "ecu",
    primaryCta: { href: "/upload", label: "Upload Your ECU File" },
    secondaryCta: registerCta,
    faqHeading: "Frequently asked questions",
    sections: [
      {
        heading: "What ECU tuning files do we provide?",
        paragraphs: [
          "An ECU tuning file on this portal is a modified engine binary produced from the original read you upload. It is an ECU remap file for that vehicle request — not a shared download for “any Bosch EDC17”.",
          "You choose ECU as the file kind, identify the vehicle in the catalog, select the calibration options offered for that request, and attach the original .bin. When the request is Ready, the processed file is on the same job.",
          "There is no public map pack. Without an original read, there is nothing to remap.",
        ],
      },
      {
        heading: "Stage 1, Stage 2 and custom calibrations",
        paragraphs: [
          "Stage 1 ECU tuning files are stock-hardware calibrations. That intent has its own page so it does not compete with this remap overview.",
          "Stage 2 ECU tuning files are for vehicles with supporting hardware such as intake, exhaust, or intercooler. Order Stage 2 only when the hardware matches.",
          "Custom calibrations are the other options shown on the request. Labels such as DPF, EGR, or AdBlue appear only if they exist in the catalog for that file. They are not separate landing pages.",
        ],
      },
      {
        heading: "Supported ECU manufacturers and families",
        paragraphs: [
          "Coverage is the live catalog on the request: vehicle type, brand, model, generation, engine, and ECU. Type and brand are required. Later fields can be marked unknown if they are not listed.",
          "Names such as Bosch, Continental, Delphi, or Denso appear only as catalog ECU rows when those rows exist. This page does not publish a fake manufacturer matrix. The full catalog rule is on Supported ECU types & families.",
        ],
      },
      {
        heading: "Compatible ECU reading and flashing tools",
        paragraphs: [
          "You read the original file and write the modified file with your own tool. If that tool saves a .bin — including tools people often use such as KESS3, FLEX, or Autotuner — that file can be uploaded.",
          "ECUFilePortal does not run those tools, sell them, or certify slave protocols. Tool-level notes live on Supported ECU tuning tools.",
        ],
      },
      {
        heading: "How the ECU file service works",
        paragraphs: [
          "For this remap intent the loop is: original ECU BIN → vehicle and calibration on the request → TuningPoints at submit → processed BIN on File History when Ready.",
          "Account creation, statuses, and gearbox jobs are documented on How our ECU file service works. This page stays on the ECU file itself.",
        ],
      },
      {
        heading: "File checking and quality process",
        paragraphs: [
          "Who does the work: TMY Tuned. The portal is not an instant generator and does not apply a remap in the browser. A tuner pulls the original BIN from your request, prepares the modified file offline, and uploads a processed version. Status becomes Ready when that file is attached. The uploader on processed files is the admin/tuner account — not an automated pipeline in the app.",
          "What is checked in the portal: the original file is stored on the request with the vehicle fields and selected options, so the job is not an anonymous email attachment. Every processed delivery is kept as its own version on that same request. You download with a time-limited link for files that belong to your account.",
          "What this page does not claim: WinOLS, a slave solution database, automatic checksum patching, or dyno testing are not product features of ECUFilePortal. If the tuner uses those methods, they sit in the calibration workflow — not as a self-serve checkbox here. We will not invent them for ranking.",
        ],
      },
      {
        heading: "Pricing and TuningPoints",
        paragraphs: [
          "The public rate is 1 TuningPoint = €10. The cost of a custom ECU file is the sum of the options you select, shown before upload. There is no static “remap pack” price on this page because those numbers live on the catalog options.",
          "Credits are checked when you submit the BIN. Buy TuningPoints in the Shop. Full credit rules: ECU tuning file pricing.",
        ],
      },
      {
        heading: "File revisions and technical support",
        paragraphs: [
          "If a later processed file is uploaded, it is stored as the next version on the same request. You keep the earlier deliveries; the list is not overwritten.",
          "Technical questions about a job belong on that request’s chat in File History, or email ecufileportal.support@gmail.com with the request in context.",
        ],
      },
    ],
    faq: [
      {
        question: "Is a custom ECU tuning file a generic download?",
        answer:
          "No. It is a remap of the original ECU BIN you upload for that vehicle request.",
      },
      {
        question: "Who prepares the modified file?",
        answer:
          "TMY Tuned. A tuner downloads the original from the request and uploads the processed file. The website does not auto-generate maps.",
      },
      {
        question: "Do you use WinOLS or checksum automation?",
        answer:
          "Those are not documented features of this portal. The product records original and processed files, versions, and status. Calibration tools used offline are not a checkbox in ECUFilePortal.",
      },
      {
        question: "How do I order Stage 1 or Stage 2?",
        answer:
          "Same ECU upload flow, then select that option if it is listed. Stage 1 and Stage 2 also have their own pages for those searches.",
      },
      {
        question: "What if my ECU family is not listed?",
        answer:
          "Select type and brand, then mark later fields unknown. Do not invent a catalog row.",
      },
    ],
    related: [
      { href: "/stage-1-tuning-files", label: "Stage 1" },
      { href: "/stage-2-tuning-files", label: "Stage 2" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/supported-ecus", label: "Supported ECUs" },
      { href: "/supported-tools", label: "Supported tools" },
    ],
  },
  {
    slug: "tcu-tuning-files",
    title: "TCU & Gearbox Tuning Files | ECUFilePortal",
    metaDescription:
      "Professional TCU and gearbox tuning files. Upload a transmission BIN, set manual or automatic, select options, and track the request like an ECU file.",
    h1: "Professional TCU & Gearbox Tuning Files",
    kicker: "Gearbox / TCU",
    navLabel: "TCU files",
    navGroup: "files",
    schema: "service",
    lead: "TCU and gearbox files use the Gearbox file kind on ECUFilePortal — same account, TuningPoints, statuses, and downloads as ECU requests. Dual-clutch / DSG reads are ordered here, not as a separate shop.",
    priority: 0.86,
    fileKind: "gearbox",
    primaryCta: uploadCta,
    secondaryCta: registerCta,
    sections: [
      {
        heading: "ECU vs gearbox on this portal",
        paragraphs: [
          "A New File Request starts with ECU or Gearbox. Gearbox is the TCU path. After that, the vehicle cascade and option list work the same way.",
          "Each request records gearbox type as manual or automatic. That is the live product field. This page does not publish a DSG, ZF, or TCU part-number matrix.",
        ],
      },
      {
        heading: "DSG and other dual-clutch files",
        paragraphs: [
          "If you have a dual-clutch read, submit it as a Gearbox request with the correct vehicle details. There is no dedicated DSG button. If a later catalog field is missing, mark it unknown rather than inventing a row.",
        ],
      },
      {
        heading: "Delivery and billing",
        paragraphs: [
          "When status is Ready, download the processed gearbox file from File History. Option costs are shown before upload. One TuningPoint is €10.",
        ],
      },
    ],
    faq: [
      {
        question: "How do I send a TCU file?",
        answer:
          "Choose Gearbox as the file kind, complete the vehicle details, then attach the transmission BIN.",
      },
      {
        question: "Do you list DQ200, DQ250, or ZF coverage?",
        answer:
          "Not as a public family list. Identity comes from the catalog fields on the request, or unknown when a field is missing.",
      },
      {
        question: "Can I order ECU and TCU together?",
        answer:
          "As two requests if you have two original files. Each job has its own options, points, and processed file.",
      },
    ],
    related: [
      { href: "/ecu-tuning-files", label: "ECU files" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/supported-tools", label: "Supported tools" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    slug: "stage-1-tuning-files",
    title: "Stage 1 ECU Tuning Files | ECUFilePortal",
    metaDescription:
      "Stage 1 ECU tuning files for stock hardware. Upload your original BIN, select Stage 1 if it is offered for the request, and download the processed file from your account.",
    h1: "Stage 1 ECU Tuning Files",
    kicker: "Stock hardware",
    navLabel: "Stage 1",
    navGroup: "files",
    schema: "service",
    lead: "Stage 1 is a software calibration intended for an unchanged engine, turbo (if fitted), and exhaust. Order it as an ECU request and select the Stage 1 option when that option is in the catalog.",
    priority: 0.86,
    fileKind: "ecu",
    primaryCta: uploadCta,
    secondaryCta: registerCta,
    breadcrumbParent: {
      name: "Custom ECU Tuning Files",
      path: "/ecu-tuning-files",
    },
    sections: [
      {
        heading: "When Stage 1 applies",
        paragraphs: [
          "Use Stage 1 when the hardware is stock. Turbo engines and naturally aspirated engines both go through the same request flow; the option still has to match the vehicle you actually have.",
          "This page does not publish horsepower gains. Outcome depends on the engine, the original file, fuel, and the selected option.",
        ],
      },
      {
        heading: "Stage 1 vs Stage 2",
        paragraphs: [
          "Stage 2 is for vehicles with supporting hardware such as intake, exhaust, or intercooler. If those parts are already fitted, the Stage 2 page is the matching intent — do not order Stage 1 as a workaround.",
        ],
      },
      {
        heading: "How to order",
        paragraphs: [
          "Start an ECU request, complete the vehicle cascade, and select Stage 1 if it is listed. If it is not listed, do not assume a hidden Stage 1 map. The TuningPoints cost is the number shown next to that option. One point is €10.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I need hardware modifications for Stage 1?",
        answer:
          "No. Stage 1 is specified for stock hardware. Supporting mods usually mean Stage 2 instead.",
      },
      {
        question: "Will every ECU show Stage 1?",
        answer:
          "Only if that option exists in the catalog for the request. This page does not invent a Stage 1 SKU for every file.",
      },
      {
        question: "How much is Stage 1?",
        answer:
          "Whatever TuningPoints cost is shown on the option at upload. The only public rate is 1 TuningPoint = €10.",
      },
    ],
    related: [
      { href: "/stage-2-tuning-files", label: "Stage 2" },
      { href: "/ecu-tuning-files", label: "ECU files" },
      { href: "/pricing", label: "Pricing" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    slug: "stage-2-tuning-files",
    title: "Stage 2 ECU Tuning Files | ECUFilePortal",
    metaDescription:
      "Stage 2 ECU tuning files for vehicles with supporting hardware. Upload the original BIN, select Stage 2 if offered, and track the processed file in your account.",
    h1: "Stage 2 ECU Tuning Files",
    kicker: "Supporting hardware",
    navLabel: "Stage 2",
    navGroup: "files",
    schema: "service",
    lead: "Stage 2 is a software calibration written for vehicles that already have supporting hardware — typically intake, exhaust, and/or intercooler. It is not a louder Stage 1.",
    priority: 0.85,
    fileKind: "ecu",
    primaryCta: uploadCta,
    secondaryCta: registerCta,
    breadcrumbParent: {
      name: "Custom ECU Tuning Files",
      path: "/ecu-tuning-files",
    },
    sections: [
      {
        heading: "When Stage 2 applies",
        paragraphs: [
          "Order Stage 2 when the hardware on the car matches a Stage 2 request. A stock vehicle should use Stage 1 instead.",
          "We do not list required part numbers on this page. You are responsible for describing the vehicle and selecting the option that matches it.",
        ],
      },
      {
        heading: "Same portal flow",
        paragraphs: [
          "Stage 2 is still an ECU .bin request: catalog vehicle, option list, TuningPoints, then File History. Status is Pending, In progress, or Ready.",
        ],
      },
      {
        heading: "What we do not claim",
        paragraphs: [
          "No published power figures, dyno claims, or a fixed turnaround SLA. If Stage 2 is not in the catalog for that request, it is not offered for that file.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I use Stage 2 on a stock car?",
        answer:
          "Stage 2 is specified for supporting hardware. Stock hardware is Stage 1.",
      },
      {
        question: "Is Stage 2 a separate upload form?",
        answer:
          "No. It is an ECU request with the Stage 2 option selected when that option is listed.",
      },
      {
        question: "How is Stage 2 billed?",
        answer:
          "By the TuningPoints cost shown on the option. 1 TuningPoint = €10.",
      },
    ],
    related: [
      { href: "/stage-1-tuning-files", label: "Stage 1" },
      { href: "/ecu-tuning-files", label: "ECU files" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    slug: "pricing",
    title: "ECU Tuning File Pricing | TuningPoints | ECUFilePortal",
    metaDescription:
      "ECU tuning file pricing on ECUFilePortal: 1 TuningPoint = €10. Option costs are shown before upload. Pay with Stripe and credit the same account that sends the file.",
    h1: "ECU Tuning File Pricing",
    kicker: "TuningPoints",
    navLabel: "Pricing",
    navGroup: "process",
    schema: "service",
    lead: "The only public price is the credit: one TuningPoint costs €10. File totals are the sum of the options you select, shown in the portal before the BIN is submitted.",
    priority: 0.87,
    primaryCta: shopCta,
    secondaryCta: uploadCta,
    sections: [
      {
        heading: "How TuningPoints work",
        paragraphs: [
          "Buy any whole number of TuningPoints in the Shop with Stripe. Points land on the signed-in account after payment confirms.",
          "You can build a vehicle selection without credits. The balance is required when you upload. If it is too low, buy more points and continue.",
        ],
      },
      {
        heading: "Why this page has no Stage 1 pack price",
        paragraphs: [
          "Option costs live in the live catalog, not on a static marketing table. Publishing a fake “Stage 1 = €X” would be invented. Open the request to see the number next to each option.",
        ],
      },
      {
        heading: "Refunds",
        paragraphs: [
          "TuningPoints purchases are final and non-refundable under the Terms of Service, except where mandatory consumer law says otherwise.",
        ],
      },
    ],
    faq: [
      {
        question: "How much is one TuningPoint?",
        answer: "€10, unless a different rate is published on the Shop page.",
      },
      {
        question: "When are points deducted?",
        answer: "When the file request is submitted, not when you browse these pages.",
      },
      {
        question: "Can I get a refund if I buy too many points?",
        answer:
          "Purchases are final. See the Terms of Service. Mandatory consumer rights are not waived where the law forbids it.",
      },
    ],
    related: [
      { href: "/shop", label: "Shop" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/ecu-tuning-files", label: "ECU files" },
      { href: "/terms", label: "Terms" },
    ],
  },
  {
    slug: "how-it-works",
    title: "How Our ECU File Service Works | ECUFilePortal",
    metaDescription:
      "How the online ECU file service works: create an account, upload the original BIN, select solutions, pay with TuningPoints, and download the processed file when the request is Ready.",
    h1: "How Our ECU File Service Works",
    kicker: "Online file service",
    navLabel: "How it works",
    navGroup: "process",
    schema: "service",
    lead: "ECUFilePortal is an online file service. You read and write the vehicle locally. The portal is where you order, pay, track, and download.",
    priority: 0.86,
    fileKind: "ecu",
    primaryCta: uploadCta,
    secondaryCta: registerCta,
    sections: [
      {
        heading: "1. Create an account",
        paragraphs: [
          "Register with email or Google and verify the account. Sign-in is required for upload, Shop, file history, and request chat.",
        ],
      },
      {
        heading: "2. Upload the original file",
        paragraphs: [
          "Choose ECU or Gearbox, complete the vehicle catalog, and attach the .bin. Type and brand must be selected. Later fields can be unknown if they are not listed.",
        ],
      },
      {
        heading: "3. Select the solution",
        paragraphs: [
          "Pick the options shown for that request. Each line has a TuningPoints cost. Credits are checked at submit. One TuningPoint is €10.",
        ],
      },
      {
        heading: "4. Receive the file",
        paragraphs: [
          "Track Pending, In progress, and Ready. Typical turnaround is about 30 minutes; there is no guaranteed SLA. Download original and processed files from that request.",
        ],
      },
    ],
    faq: [
      {
        question: "How long does a file take?",
        answer:
          "Typical turnaround is about 30 minutes. There is no guaranteed SLA. Watch File History, or use request chat / ecufileportal.support@gmail.com for an update.",
      },
      {
        question: "Do I visit the workshop to use the portal?",
        answer:
          "No. Ordering is online. You still need a tool to read and write the BIN.",
      },
      {
        question: "What statuses exist?",
        answer: "Pending, In progress, and Ready.",
      },
      {
        question: "Where do I ask a question about a job?",
        answer:
          "Use chat on that request in File History, or email ecufileportal.support@gmail.com.",
      },
    ],
    related: [
      { href: "/ecu-tuning-files", label: "ECU files" },
      { href: "/pricing", label: "Pricing" },
      { href: "/supported-tools", label: "Supported tools" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    slug: "supported-ecus",
    title: "Supported ECU Types & Families | ECUFilePortal",
    metaDescription:
      "Supported ECU types on ECUFilePortal come from the live vehicle catalog — type, brand, model, generation, engine, and ECU. Unknown is allowed when a later field is not listed.",
    h1: "Supported ECU Types & Families",
    kicker: "Live catalog",
    navLabel: "Supported ECUs",
    navGroup: "process",
    schema: "webPage",
    lead: "Support is whatever exists in the live catalog on the request — not a marketing list of chip families. Bosch, Continental, Delphi, Denso, and similar names appear only if they are catalog ECU rows.",
    priority: 0.8,
    fileKind: "ecu",
    primaryCta: uploadCta,
    secondaryCta: registerCta,
    breadcrumbParent: {
      name: "Custom ECU Tuning Files",
      path: "/ecu-tuning-files",
    },
    sections: [
      {
        heading: "How coverage is defined",
        paragraphs: [
          "A request collects vehicle type, brand, model, generation, engine, and ECU. Type and brand must be chosen from the catalog. If a later field is missing, mark it unknown so the job can still be sent.",
          "This page does not inventory every ECU family TMY Tuned has ever seen. Inventing a Bosch / Continental / Delphi / Denso tick-list would be keyword coverage, not a product fact.",
        ],
      },
      {
        heading: "What to do if the ECU is missing",
        paragraphs: [
          "Do not invent a catalog row. Use unknown on the fields that are absent and complete the rest accurately. Support can see the original file on the request.",
        ],
      },
      {
        heading: "Gearbox / TCU",
        paragraphs: [
          "Transmission files use the Gearbox kind. ECU family names on this page do not describe TCU coverage. See TCU & gearbox tuning files.",
        ],
      },
    ],
    faq: [
      {
        question: "Do you publish a full ECU family list?",
        answer:
          "No. Coverage is the catalog you see when building a request, plus unknown for missing later fields.",
      },
      {
        question: "Are Bosch or Denso “officially supported”?",
        answer:
          "Only as names that may exist as ECU entries in the catalog. This page does not certify families.",
      },
      {
        question: "Can I still send a file if the ECU field is empty?",
        answer:
          "If the ECU is not listed, mark it unknown after the earlier required fields are set.",
      },
    ],
    related: [
      { href: "/supported-tools", label: "Supported tools" },
      { href: "/ecu-tuning-files", label: "ECU files" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/tcu-tuning-files", label: "TCU files" },
    ],
  },
  {
    slug: "supported-tools",
    title: "Supported ECU Tuning Tools | KESS3, FLEX, Autotuner | ECUFilePortal",
    metaDescription:
      "ECUFilePortal accepts original BIN files. If your tool can read and write a BIN — including tools such as KESS3, FLEX, or Autotuner — you can upload that file. We do not sell or certify the tools.",
    h1: "Supported ECU Tuning Tools",
    kicker: "BIN read / write",
    navLabel: "Supported tools",
    navGroup: "process",
    schema: "webPage",
    lead: "This is a file service. We process the original BIN you upload. We do not flash the car, sell KESS3 / FLEX / Autotuner, or publish a certified-tool matrix.",
    priority: 0.8,
    primaryCta: uploadCta,
    secondaryCta: registerCta,
    breadcrumbParent: {
      name: "Custom ECU Tuning Files",
      path: "/ecu-tuning-files",
    },
    sections: [
      {
        heading: "What “supported” means here",
        paragraphs: [
          "If the tool can produce an original .bin read and write a processed .bin back, that file can be submitted on a request. People commonly use bench and OBD tools such as KESS3, Autotuner, FLEX, or CMD for that read/write step.",
          "Naming those tools does not mean partnership, slave protocol support, or that every protocol/protocol version will work. Compatibility is at the file layer, not a bench-tool driver we ship.",
        ],
      },
      {
        heading: "What you still do locally",
        paragraphs: [
          "Reading the vehicle, checksum handling in the tool, and writing the processed file stay on your side. The portal stores original and processed versions and gives time-limited download links.",
        ],
      },
      {
        heading: "What we will not claim",
        paragraphs: [
          "No “works with every KESS3 clone”, no guaranteed Autotuner slave list, no FLEX protocol chart. If a read is rejected, that shows up on the request — not as a logo wall on this page.",
        ],
      },
    ],
    faq: [
      {
        question: "Can I upload a file read with KESS3, FLEX, or Autotuner?",
        answer:
          "If that tool saved an original BIN, upload it on a request. The portal does not run those tools.",
      },
      {
        question: "Do you provide the flashing tool?",
        answer: "No. Bring your own read/write hardware and software.",
      },
      {
        question: "Do you support CMD or other tools not named in the title?",
        answer:
          "Same rule: BIN in, processed BIN out. We do not maintain a certified-vendor list.",
      },
    ],
    related: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/supported-ecus", label: "Supported ECUs" },
      { href: "/ecu-tuning-files", label: "ECU files" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    slug: "about",
    title: "About ECUFilePortal | TMY Tuned",
    metaDescription:
      "ECUFilePortal is TMY Tuned’s online ECU and TCU file portal. Based in Plovdiv, Bulgaria — account-based BIN upload, TuningPoints, request tracking, and support on each job.",
    h1: "About ECUFilePortal",
    kicker: "TMY Tuned",
    navLabel: "About",
    navGroup: "company",
    schema: "webPage",
    lead: "ECUFilePortal is the customer file portal for TMY Tuned (TMYTuned), an automotive tuning brand in Plovdiv, Bulgaria. It is the upload, billing, and delivery channel for ECU and gearbox files — not the workshop booking site.",
    priority: 0.72,
    primaryCta: uploadCta,
    secondaryCta: { href: "/contact", label: "Contact" },
    sections: [
      {
        heading: "What the portal is",
        paragraphs: [
          "Registered users submit ECU or gearbox binaries, select tuning options, pay with TuningPoints, and download processed files from File History. Request chat stays on that job.",
          "Workshop services, Honda pages, and parts remain on tmytuned.com. This domain is the file portal.",
        ],
      },
      {
        heading: "Official profiles",
        paragraphs: [
          "TMY Tuned on Instagram and Facebook. Workshop and parts remain on tmytuned.com. This domain is the file portal.",
        ],
      },
      {
        heading: "What we do not put on this page",
        paragraphs: [
          "No invented customer counts, dyno slogans, or “10,000 files a month”. Trust comes from a real operator, a real payment rate (1 TuningPoint = €10), and a tracked request — not from fake badges.",
        ],
      },
    ],
    faq: [
      {
        question: "Who operates ECUFilePortal?",
        answer: "TMY Tuned in Plovdiv, Bulgaria. Support: ecufileportal.support@gmail.com.",
      },
      {
        question: "Is this the same as tmytuned.com?",
        answer:
          "Same brand, different site. tmytuned.com is the workshop and parts site. ECUFilePortal is the file request portal.",
      },
    ],
    related: [
      { href: "/contact", label: "Contact" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    slug: "contact",
    title: "Contact ECUFilePortal | Support",
    metaDescription:
      "Contact ECUFilePortal support at ecufileportal.support@gmail.com. Signed-in users can also chat on a file request. Operated by TMY Tuned in Plovdiv, Bulgaria.",
    h1: "Contact ECUFilePortal",
    kicker: "Support",
    navLabel: "Contact",
    navGroup: "company",
    schema: "webPage",
    lead: "For portal, billing, and file-request questions use the support email. If you already have a request, chat on that job in File History so the original file and status are in context.",
    priority: 0.7,
    primaryCta: contactCta,
    secondaryCta: { href: "/about", label: "About" },
    sections: [
      {
        heading: "Email",
        paragraphs: [
          "ecufileportal.support@gmail.com — account, TuningPoints, and file requests on this portal.",
        ],
      },
      {
        heading: "Request chat",
        paragraphs: [
          "After sign-in, open the request in File History. Chat there is tied to that job. Prefer that over a generic inbox when you already uploaded a file.",
        ],
      },
      {
        heading: "Operator",
        paragraphs: [
          "TMY Tuned, Plovdiv, Bulgaria. Workshop and parts enquiries that are not about this portal belong on tmytuned.com.",
        ],
      },
    ],
    faq: [
      {
        question: "Is there a phone number on this page?",
        answer:
          "This page publishes the portal support email. Use email or request chat. We do not invent a phone line here.",
      },
      {
        question: "Where do I ask about a paid file?",
        answer:
          "Open that request in File History and use chat, and include the request in any email.",
      },
    ],
    related: [
      { href: "/about", label: "About" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/pricing", label: "Pricing" },
      { href: "/register", label: "Create account" },
    ],
  },
  {
    slug: "resources",
    title: "ECU Tuning Resources | ECUFilePortal",
    metaDescription:
      "ECU tuning resources from ECUFilePortal: how the file service works, Stage 1 vs Stage 2, TCU files, pricing, supported ECUs, and tools — without fake blog posts.",
    h1: "ECU Tuning Resources",
    kicker: "Guides on this site",
    navLabel: "Resources",
    navGroup: "company",
    schema: "webPage",
    lead: "This is an index of the public guides on ECUFilePortal. There is no separate blog with invented articles. Each link is a real page on this domain.",
    priority: 0.68,
    primaryCta: { href: "/how-it-works", label: "How it works" },
    secondaryCta: uploadCta,
    sections: [
      {
        heading: "Ordering a file",
        paragraphs: [
          "How our ECU file service works — account, upload, options, Ready status. Custom ECU tuning files — what a BIN request is. TCU & gearbox tuning files — transmission reads, including dual-clutch / DSG as gearbox jobs.",
        ],
      },
      {
        heading: "Stage 1 and Stage 2",
        paragraphs: [
          "Stage 1 ECU tuning files are for stock hardware. Stage 2 ECU tuning files are for supporting hardware. Neither page publishes horsepower charts.",
        ],
      },
      {
        heading: "Coverage, tools, and price",
        paragraphs: [
          "Supported ECU types & families explains the live catalog. Supported ECU tuning tools explains BIN-level use of tools such as KESS3, FLEX, and Autotuner. ECU tuning file pricing is TuningPoints at €10 each.",
        ],
      },
      {
        heading: "What is not here yet",
        paragraphs: [
          "Separate landing pages for DTC, DPF/FAP, EGR, AdBlue/SCR, Vmax, or IMMO are not published. Those labels may appear as catalog options on a request. They are not keyword pages until the offer and legal position are explicit.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this a blog?",
        answer:
          "No. It is a hub of the public service pages on this site.",
      },
      {
        question: "Where is DPF or AdBlue explained?",
        answer:
          "Those solutions are requested as options on a file job when the catalog lists them. There is no dedicated DPF landing page.",
      },
    ],
    related: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/ecu-tuning-files", label: "ECU files" },
      { href: "/stage-1-tuning-files", label: "Stage 1" },
      { href: "/supported-tools", label: "Supported tools" },
    ],
  },
];

export function getMoneyPage(slug: string): MoneyPageDef | undefined {
  return MONEY_PAGES.find((page) => page.slug === slug);
}

export const MONEY_PAGE_SLUGS = MONEY_PAGES.map((page) => page.slug);

export const MONEY_NAV_GROUPS = [
  { id: "files", label: "Files" },
  { id: "process", label: "Process" },
  { id: "company", label: "Company" },
] as const;

/** Old commercial URLs → current architecture. */
export const MONEY_PAGE_REDIRECTS = [
  { source: "/ecu-file-service", destination: "/how-it-works" },
  { source: "/online-tuning-file-service", destination: "/how-it-works" },
  { source: "/dsg-tuning-files", destination: "/tcu-tuning-files" },
  { source: "/stage-1-tuning-file", destination: "/stage-1-tuning-files" },
] as const;
