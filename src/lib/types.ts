export type Region = 'Africa' | 'Americas' | 'Oceania' | 'Asia' | 'Europe';
export interface Source {
  title: string;
  url: string;
  detail?: string;
}
export interface GlyphPath {
  d: string;
  fill?: boolean;
  weight?: number;
}
export interface GlyphDefinition {
  label: string;
  paths: GlyphPath[];
  unicode?: string;
  viewBox?: string;
  source: string;
  provenance?: 'original' | 'adapted';
}
export type GlyphSet = Record<string, GlyphDefinition>;
export type Engine =
  | 'positional'
  | 'additive'
  | 'ethiopic'
  | 'roman'
  | 'cistercian'
  | 'tamil'
  | 'kharoshthi'
  | 'mende'
  | 'sinhala'
  | 'greek'
  | 'attic'
  | 'rods'
  | 'suzhou'
  | 'babylonian'
  | 'khipu'
  | 'mexica'
  | 'explainer';
export interface SystemDefinition {
  id: string;
  name: string;
  localName?: string;
  region: Region;
  location: string;
  period: string;
  era: 'Ancient' | 'Historical' | 'Living' | 'Modern';
  structure:
    'Positional' | 'Additive' | 'Multiplicative' | 'Alphabetic' | 'Spoken' | 'Physical' | 'Mixed';
  baseLabel: string;
  summary: string;
  history: string;
  howItWorks: string;
  readingSteps: string[];
  caveat: string;
  engine: Engine;
  min: string;
  max: string;
  zero: boolean;
  digits?: string[];
  values?: { value: number; glyph: string }[];
  radix?: number;
  specimen: number;
  examples: { value: string; explanation: string; glyphs?: string[]; words?: string }[];
  sources: Source[];
  featured?: boolean;
}
export interface Rational {
  numerator: bigint;
  denominator: bigint;
}
export interface RenderToken {
  glyph?: string;
  text?: string;
  label?: string;
  place?: string;
}
export interface Representation {
  status: 'ok' | 'unsupported' | 'explainer';
  tokens: RenderToken[];
  layout: 'row' | 'stack' | 'cord' | 'words';
  explanation: string;
  unicode?: string;
  reason?: string;
}
