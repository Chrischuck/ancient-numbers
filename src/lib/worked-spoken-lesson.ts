import { oksapminPositions, pacificSymbolDictionary } from './pacific-counts';
import type { Representation, RenderToken, SystemDefinition } from './types';

export interface SpokenLesson {
  text: string;
  parts: { text: string; tokens?: RenderToken[] }[];
  equation?: string;
  notes?: string[];
}

type Part = SpokenLesson['parts'][number];
const showWords = (text: string): RenderToken[] => [{ text, lang: 'mrv' }];

function mangarevanLesson(n: bigint, specimen: Representation): SpokenLesson | undefined {
  if (n < 1n || n > 799n) return undefined;
  const name = specimen.tokens
    .map((entry) => entry.text ?? '')
    .join(' ')
    .trim();
  if (!name) return undefined;
  const words = name.split(' ');
  const parts: Part[] = [];
  const terms: string[] = [];
  let cursor = 0;
  let rest = n;
  const eighties = rest / 80n;
  if (eighties) {
    const length = eighties === 1n ? 1 : 2;
    const chunk = words.slice(cursor, cursor + length).join(' ');
    cursor += length;
    if (!chunk.endsWith('varu')) return undefined;
    parts.push({
      text:
        eighties === 1n
          ? 'Varu names a group of 80 counting units here.'
          : `The ${words[0]} before varu counts ${eighties} groups of 80: ${eighties} × 80 = ${eighties * 80n}.`,
      tokens: showWords(chunk),
    });
    terms.push(eighties === 1n ? '80' : `${eighties} × 80`);
    rest %= 80n;
  }
  const binary: { value: bigint; word: string }[] = [];
  for (const [value, word] of [
    [40n, 'tataua'],
    [20n, 'paua'],
    [10n, 'takau'],
  ] as const) {
    if (rest < value) continue;
    if (words[cursor] !== word) return undefined;
    binary.push({ value, word: words[cursor] });
    cursor++;
    terms.push(String(value));
    rest -= value;
  }
  if (binary.length) {
    const amounts = binary.map(({ value }) => String(value));
    const subtotal = binary.reduce((sum, { value }) => sum + value, 0n);
    parts.push({
      text: `${binary.map(({ value, word }) => `${word} names ${value}`).join('; ')}. ${binary.length > 1 ? `These groups add ${amounts.join(' + ')} = ${subtotal} counting units.` : 'Count this group once.'}`,
      tokens: showWords(binary.map(({ word }) => word).join(' ')),
    });
  }
  if (rest) {
    const unitWord = words[cursor];
    if (!unitWord) return undefined;
    parts.push({
      text: `${unitWord} supplies the remaining ${rest} counting unit${rest === 1n ? '' : 's'}${rest === 8n ? '; varu means eight in this unit position, rather than a group of eighty' : ''}.${n !== rest ? ` Add ${n - rest} + ${rest} = ${n}.` : ''}`,
      tokens: showWords(unitWord),
    });
    cursor++;
    terms.push(String(rest));
  }
  if (cursor !== words.length) return undefined;
  return {
    text: 'First choose the counting unit. Then read any groups of 80, 40, 20, and 10, followed by the remaining units.',
    parts,
    equation: `${terms.join(' + ')} = ${n} counting units`,
    notes: [
      'One unit can contain one turtle, two fish, four coconuts, or eight octopuses. Multiply the counting-unit total by that quantity to find the number of objects.',
    ],
  };
}

function oksapminLesson(
  system: SystemDefinition,
  n: bigint,
  specimen: Representation,
): SpokenLesson | undefined {
  if (n < 1n || n > 27n) return undefined;
  const position = oksapminPositions[Number(n) - 1];
  if (!position) return undefined;
  const previous = oksapminPositions[Number(n) - 2];
  const next = oksapminPositions[Number(n)];
  const dictionary = pacificSymbolDictionary(system);
  const positionTokens = (value: number): RenderToken[] | undefined => {
    const entry = dictionary.find(({ glyph }) => glyph === `oksapmin-${value}`);
    return entry ? [{ glyph: entry.glyph, label: entry.meaning }] : undefined;
  };
  const parts: Part[] = [];
  if (previous)
    parts.push({
      text: `The preceding position is ${previous.part}, which counts ${previous.value}.`,
      tokens: positionTokens(previous.value),
    });
  parts.push({
    text: previous
      ? `Move to ${position.part} for one more object: ${previous.value} + 1 = ${n}. This highlighted position is the requested total.`
      : 'Begin at either thumb. This first position counts one object.',
    tokens: specimen.tokens,
  });
  parts.push(
    next
      ? {
          text: `To count one more, continue to ${next.part}, position ${next.value}.`,
          tokens: positionTokens(next.value),
        }
      : { text: 'The little finger completes the first traversal: 27 counted positions.' },
  );
  return {
    text: 'Touch one body position for each object, following the ordered path.',
    parts,
    ...(previous ? { equation: `${previous.value} + 1 = ${n}` } : {}),
    notes: ['These are positions on a counting path. They do not act as digits with place values.'],
  };
}

/** Work from the productive Pacific adapter's actual words and position dictionary. */
export function spokenLesson(
  system: SystemDefinition,
  n: bigint,
  specimen: Representation,
): SpokenLesson | undefined {
  if (system.engine !== 'pacific' || specimen.status !== 'ok' || !specimen.tokens.length)
    return undefined;
  if (system.id === 'mangarevan') return mangarevanLesson(n, specimen);
  if (system.id === 'oksapmin') return oksapminLesson(system, n, specimen);
  return undefined;
}
