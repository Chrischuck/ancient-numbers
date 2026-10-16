import type { Representation, SystemDefinition } from './types';

// Bender & Beller (2013), Table 1 and the construction immediately above it.
// These are counting units (tauga), whose object quantity depends on the goods.
const mangarevanUnits = ['ta’i', 'rua', 'toru', '’a', 'rima', 'ono', '’itu', 'varu', 'iva'];

export interface OksapminPosition {
  value: number;
  part: string;
  x: number;
  y: number;
}

// Saxe & Esmonde (2004), Figure 1. Both hands proceed thumb → little finger;
// the second hand is not a mirror-reversal of the first hand's count order.
// Coordinates are an original illustration choice, not traditional notation.
export const oksapminPositions: OksapminPosition[] = [
  { value: 1, part: 'thumb · first side', x: 18, y: 29 },
  { value: 2, part: 'index finger · first side', x: 13, y: 22 },
  { value: 3, part: 'middle finger · first side', x: 9, y: 19 },
  { value: 4, part: 'ring finger · first side', x: 5, y: 22 },
  { value: 5, part: 'little finger · first side', x: 4, y: 28 },
  { value: 6, part: 'wrist · first side', x: 12, y: 43 },
  { value: 7, part: 'forearm · first side', x: 17, y: 52 },
  { value: 8, part: 'inner elbow · first side', x: 22, y: 61 },
  { value: 9, part: 'upper arm · first side', x: 28, y: 51 },
  { value: 10, part: 'shoulder · first side', x: 33, y: 43 },
  { value: 11, part: 'side of neck · first side', x: 42, y: 36 },
  { value: 12, part: 'ear · first side', x: 35, y: 22 },
  { value: 13, part: 'eye · first side', x: 41, y: 19 },
  { value: 14, part: 'nose · center', x: 47, y: 25 },
  { value: 15, part: 'eye · other side', x: 59, y: 19 },
  { value: 16, part: 'ear · other side', x: 65, y: 22 },
  { value: 17, part: 'side of neck · other side', x: 58, y: 36 },
  { value: 18, part: 'shoulder · other side', x: 67, y: 43 },
  { value: 19, part: 'upper arm · other side', x: 72, y: 51 },
  { value: 20, part: 'inner elbow · other side', x: 78, y: 61 },
  { value: 21, part: 'forearm · other side', x: 83, y: 52 },
  { value: 22, part: 'wrist · other side', x: 88, y: 43 },
  { value: 23, part: 'thumb · other side', x: 82, y: 29 },
  { value: 24, part: 'index finger · other side', x: 87, y: 22 },
  { value: 25, part: 'middle finger · other side', x: 91, y: 19 },
  { value: 26, part: 'ring finger · other side', x: 95, y: 22 },
  { value: 27, part: 'little finger · other side', x: 96, y: 28 },
];

const unsupported = (reason: string): Representation => ({
  status: 'unsupported',
  layout: 'words',
  tokens: [],
  explanation: '',
  reason,
});

function representMangarevan(n: bigint): Representation {
  if (n < 1n || n > 799n)
    return unsupported(
      'This Mangarevan converter supports 1–799 counting units in the documented mixed system.',
    );
  let rest = Number(n);
  const words: string[] = [];
  const terms: string[] = [];
  const eighties = Math.floor(rest / 80);
  if (eighties) {
    words.push(eighties === 1 ? 'varu' : `${mangarevanUnits[eighties - 1]} varu`);
    terms.push(eighties === 1 ? '80' : `${eighties} × 80`);
    rest %= 80;
  }
  // Each binary power is present once or absent. Only varu takes a multiplier.
  for (const [value, word] of [
    [40, 'tataua'],
    [20, 'paua'],
    [10, 'takau'],
  ] as const) {
    if (rest >= value) {
      words.push(word);
      terms.push(String(value));
      rest -= value;
    }
  }
  if (rest) {
    words.push(mangarevanUnits[rest - 1]);
    terms.push(String(rest));
  }
  const text = words.join(' ');
  return {
    status: 'ok',
    layout: 'words',
    tokens: [{ text, lang: 'mrv', label: `${text}: ${n} counting units` }],
    explanation: `${terms.join(' + ')} = ${n} counting units. One unit can contain 1 turtle, 2 fish, 4 coconuts, or 8 octopuses.`,
  };
}

function representOksapmin(n: bigint): Representation {
  if (n < 1n || n > 27n)
    return unsupported(
      'This Oksapmin converter illustrates every position from 1–27 in the first traversal. Larger counts need further context and conventions.',
    );
  const position = oksapminPositions[Number(n) - 1];
  const previous = oksapminPositions[Number(n) - 2];
  const next = oksapminPositions[Number(n)];
  return {
    status: 'ok',
    layout: 'row',
    tokens: [{ glyph: `oksapmin-${n}`, label: `${n}: ${position.part}` }],
    explanation: `Position ${n}: ${position.part}. ${previous ? `Continue from ${previous.part} (${previous.value}).` : 'Begin at either thumb.'}${next ? ` Next is ${next.part} (${next.value}).` : ' This completes the first traversal.'}`,
  };
}

export function representPacificCount(n: bigint, system: SystemDefinition): Representation {
  if (system.id === 'mangarevan') return representMangarevan(n);
  if (system.id === 'oksapmin') return representOksapmin(n);
  return unsupported('This counting tradition is not handled by the Pacific counting converter.');
}

export function pacificWordDictionary(
  system: SystemDefinition,
): { word: string; meaning: string }[] {
  if (system.id !== 'mangarevan') return [];
  return [
    ...mangarevanUnits.map((word, index) => ({ word, meaning: String(index + 1) })),
    { word: 'takau', meaning: '10 counting units' },
    { word: 'paua', meaning: '20 counting units' },
    { word: 'tataua', meaning: '40 counting units' },
    { word: 'varu', meaning: '80 counting units in the grouping context' },
    { word: 'tauga', meaning: 'counting unit; its object quantity depends on the goods' },
  ];
}

export function pacificSymbolDictionary(
  system: SystemDefinition,
): { glyph: string; meaning: string }[] {
  return system.id === 'oksapmin'
    ? oksapminPositions.map(({ value, part }) => ({
        glyph: `oksapmin-${value}`,
        meaning: `${value} · ${part}`,
      }))
    : [];
}
