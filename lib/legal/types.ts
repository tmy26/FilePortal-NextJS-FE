export type LegalSection = {
  heading: string;
  paragraphs: string[];
  /** Optional bullet list rendered after paragraphs. */
  bullets?: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};
