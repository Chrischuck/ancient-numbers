import type { Representation, SystemDefinition } from './types';
import { americanWordDictionary } from './spoken-americas';
import { polynesianWordDictionary } from './spoken-polynesian';
import { pacificWordDictionary } from './pacific-counts';

export interface SpokenEntry {
  word: string;
  meaning: string;
}

export function spokenLanguage(system: SystemDefinition): string | undefined {
  return (
    {
      yoruba: 'yo',
      navajo: 'nv',
      choctaw: 'cho',
      maori: 'mi',
      hawaiian: 'haw',
      mangarevan: 'mrv',
    } as Record<string, string>
  )[system.id];
}

const entries = (words: string[], first = 1): SpokenEntry[] =>
  words.map((word, i) => ({ word, meaning: String(i + first) }));

// LedeYoruba's isolated counting forms. They are not the adjectival forms
// used to count objects. Existing specimens retain that source's spelling.
const yorubaSmall = [
  'Oókan',
  'Èjì',
  'Ẹ̀ta',
  'Ẹ̀rin',
  'Àrún',
  'Ẹ̀fà',
  'Èje',
  'Ẹ̀jọ',
  'Ẹ̀sán',
  'Ẹ̀wá',
  'Oókànlá',
  'Èjìlá',
  'Ẹ̀tàlá',
  'Ẹ́rìnlá',
  'Ẹ́ẹ̀dógún',
  'Ẹ́rìndínlógún',
  'Ẹ́tadínlógún',
  'Èjìdínlógún',
  'Oókàndínlógún',
  'Ogún',
];
const yorubaTens: Record<number, string> = {
  20: 'Ogún',
  30: 'Ọgbọ̀n',
  40: 'Ogójì',
  50: 'Àádọ́ta',
  60: 'Ọgọ́ta',
  70: 'Àádọ́rin',
  80: 'Ọgọ́rin',
  90: 'Àádọ́rùn-ún',
  100: 'Ọgọ́rùn-ún',
};
// These complete expressions are explicitly printed in Kelvin Obareti's
// community table; keep the displayed spacing and tones from that source.
const yorubaAttested: Record<number, string> = {
  54: 'ẹ̀rin leládọ́ta',
  56: 'ẹ̀rin dílọgọ́ta',
};

/** Source-backed vocabulary, including operators as well as whole number names. */
export function spokenDictionary(system: SystemDefinition): SpokenEntry[] {
  const expanded = [
    americanWordDictionary,
    polynesianWordDictionary,
    pacificWordDictionary,
  ].flatMap((dictionary) => dictionary(system));
  if (expanded.length) return expanded;
  switch (system.id) {
    case 'yoruba':
      return [
        ...entries(yorubaSmall.slice(0, 10)),
        ...Object.entries(yorubaTens).map(([value, word]) => ({ word, meaning: value })),
        { word: 'lé', meaning: 'add / increase by' },
        { word: 'dín', meaning: 'subtract / reduce by' },
        { word: 'ní', meaning: 'linking preposition; often contracts in compounds' },
        { word: 'Ẹ́ẹ̀dógún', meaning: '15 = 20 − 5' },
      ];
    default:
      return system.structure === 'Spoken'
        ? system.examples
            .filter((example) => example.words)
            .map((example) => ({
              word: example.words!,
              meaning: `${example.value} · ${example.explanation}`,
            }))
        : [];
  }
}

// Ajibade (2023), Tables 3, 4, 7, and 10. Thirty is lexical in that account;
// fifty, seventy, and ninety subtract ten from the next multiple of twenty.
function anchorConstruction(n: number): string {
  if (n <= 30) return String(n);
  if (n % 20 === 0) return `${n / 20} × 20`;
  return `${(n + 10) / 20} × 20 − 10`;
}

/** Mathematical structure of Standard Yorùbá number naming, not an arithmetic algorithm. */
export function yorubaConstruction(n: bigint): string | undefined {
  if (n < 1n || n > 100n) return undefined;
  const value = Number(n);
  if (value <= 10 || value === 20 || value === 30) return `${value}`;
  let expression: string;
  if (value < 15) expression = `10 + ${value - 10}`;
  else if (value < 20) expression = `20 − ${20 - value}`;
  else if (value % 10 === 0) expression = anchorConstruction(value);
  else {
    const remainder = value % 10;
    const anchor = remainder <= 4 ? value - remainder : value + 10 - remainder;
    let base = anchorConstruction(anchor);
    if (anchor > 30 && anchor % 20 !== 0) base = `(${base})`;
    expression = remainder <= 4 ? `${base} + ${remainder}` : `${base} − ${10 - remainder}`;
  }
  return `${expression} = ${value}`;
}

/**
 * A bounded learning converter. Conventional words are retained where attested;
 * other productive compounds show the source's morphemes separately rather
 * than guessing vowel contraction or the surface tone of a complete word.
 */
export function representYoruba(n: bigint): Representation {
  const construction = yorubaConstruction(n);
  if (!construction)
    return {
      status: 'unsupported',
      tokens: [],
      layout: 'words',
      explanation: '',
      reason: 'This Yorùbá learning display supports whole numbers from 1 through 100.',
    };
  const value = Number(n);
  const attested = yorubaSmall[value - 1] ?? yorubaTens[value] ?? yorubaAttested[value];
  if (attested)
    return {
      status: 'ok',
      layout: 'words',
      tokens: [{ text: attested, label: `${attested}: ${value}`, lang: 'yo' }],
      explanation: `${construction}. Documented number form; wording can change when counting objects.`,
    };
  const remainder = value % 10;
  const adds = remainder <= 4;
  const amount = adds ? remainder : 10 - remainder;
  const anchor = adds ? value - remainder : value + 10 - remainder;
  // ní is shown in its full lexical form. It corresponds to the contracted
  // prepositional l- in Ajibade's segmented examples (e.g. èjì-lé-l-ógọ́ta).
  const words = `${yorubaSmall[amount - 1]} · ${adds ? 'lé' : 'dín'} · ní · ${yorubaTens[anchor]}`;
  return {
    status: 'ok',
    layout: 'words',
    tokens: [
      { text: words, label: `Expanded Yorùbá teaching form for ${value}: ${words}`, lang: 'yo' },
    ],
    explanation: `${construction}. Expanded teaching form: the dots separate a number root, ${adds ? 'addition' : 'subtraction'}, the linking preposition, and the anchor. Ordinary speech contracts these parts; this is a morphological explanation, not a standard written compound.`,
  };
}
