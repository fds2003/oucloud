export type ToolStatus = 'draft' | 'published';

export type ToolIntent =
  | 'converter'
  | 'generator'
  | 'calculator'
  | 'checker'
  | 'formatter'
  | 'picker';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolSEO {
  title: string;
  description: string;
  h1: string;
  intro: string;
  howTo: string[];
  explanation?: string;
  faq: FAQItem[];
}

export interface ToolMeta {
  id: string;
  slug: string;

  name: string;
  shortName?: string;

  category: string;
  topic: string;

  intent: ToolIntent;
  status: ToolStatus;

  keywords: string[];

  component: string;

  seo: ToolSEO;

  featured?: boolean;

  relatedTools?: string[];
}
