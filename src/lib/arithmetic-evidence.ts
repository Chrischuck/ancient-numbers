import type { Source } from './types';

export type ArithmeticOperation = 'add' | 'subtract' | 'multiply' | 'divide';
export type EvidenceKind = 'documented' | 'reconstruction' | 'modern' | 'recording';

/** Research applies to an operation and notation variant, not an entire culture. */
export interface ArithmeticEvidenceProfile {
  summary: string;
  tool: string;
  notationRole: string;
  evidence: Record<ArithmeticOperation, EvidenceKind>;
  operationNotes: Record<ArithmeticOperation, string>;
  sources: Source[];
}

export const arithmeticOperations: ArithmeticOperation[] = [
  'add',
  'subtract',
  'multiply',
  'divide',
];
export const evidenceLabels: Record<EvidenceKind, string> = {
  documented: 'Documented practice · worked application',
  reconstruction: 'Teaching reconstruction · historical procedure not established',
  modern: 'Modern arithmetic · worked in the selected notation',
  recording: 'Calculation and recording · the notation records the quantity',
};
