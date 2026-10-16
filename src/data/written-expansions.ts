import type { SystemDefinition } from '../lib/types';

const examples = (items: [number, string, string[]][]) =>
  items.map(([value, explanation, glyphs]) => ({ value: String(value), explanation, glyphs }));

export const writtenSystemUpdates: Record<string, Partial<SystemDefinition>> = {
  'mende-kikakui': {
    engine: 'written',
    min: '1',
    max: '9999999',
    zero: false,
    summary:
      'Right-to-left digit groups with attached subscripts for teens and decimal magnitudes.',
    howItWorks:
      'Read from right to left. A digit and its subscript form one group. Add the groups: the teens subscript adds ten, while the other subscripts multiply a digit by ten, one hundred, and larger powers of ten.',
    readingSteps: [
      'Unmarked digits represent one through nine. There is no zero digit or empty-place sign.',
      'For 11–19, attach the special teens subscript beneath the units digit: four with this mark means 10 + 4 = 14.',
      'For a multiple of ten, hundred, thousand, ten thousand, hundred thousand, or million, attach that magnitude’s subscript beneath its coefficient digit.',
      'Write the largest group at the right. Continue toward the left with smaller groups; omit groups with a coefficient of zero.',
      'For 417, the right group is four hundreds and the left group is seven with the teens mark: 400 + 17. For 56, combine five with the tens mark and an unmarked six.',
    ],
    caveat:
      'The converter follows Unicode’s documented digit-and-subscript formation through the million mark, supporting 1–9,999,999. Each attached group is a modern vector drawing. This is not positional notation: gaps do not require a zero. The supported ceiling is an app bound, not a claim about the language’s ability to count.',
    values: [
      ...Array.from({ length: 9 }, (_, i) => ({ value: i + 1, glyph: `mende-${i + 1}` })),
      ...Array.from({ length: 9 }, (_, i) => ({
        value: i + 11,
        glyph: `mende-group-teens-${i + 1}`,
      })),
      ...Array.from({ length: 9 }, (_, i) => ({
        value: (i + 1) * 10,
        glyph: `mende-group-1-${i + 1}`,
      })),
      ...[2, 3, 4, 5, 6].map((power) => ({ value: 10 ** power, glyph: `mende-group-${power}-1` })),
    ],
    examples: examples([
      [10, 'One with the tens subscript: 1 × 10.', ['mende-group-1-1']],
      [14, 'Four with the distinct teens subscript: 10 + 4.', ['mende-group-teens-4']],
      [
        27,
        'Read from right: two tens, then seven ones. Add 20 + 7.',
        ['mende-7', 'mende-group-1-2'],
      ],
      [
        206,
        'Read from right: two hundreds and six ones. The absent tens need no placeholder.',
        ['mende-6', 'mende-group-2-2'],
      ],
      [
        417,
        'Read from right: four hundreds followed by seven with the teens mark. Add 400 + 17.',
        ['mende-group-teens-7', 'mende-group-2-4'],
      ],
      [
        784,
        'Read from right: seven hundreds, eight tens, four ones.',
        ['mende-4', 'mende-group-1-8', 'mende-group-2-7'],
      ],
    ]),
  },
  cherokee: {
    engine: 'written',
    min: '0',
    max: '100',
    zero: true,
    baseLabel: 'Distinct signs & additive tens',
    summary:
      'Every amount from zero to one hundred in the Cherokee Nation chart of Sequoyah’s proposed numerals.',
    howItWorks:
      'The chart gives zero through twenty distinct signs. Above twenty, read a tens sign followed by a units sign and add their values; one hundred has its own sign.',
    readingSteps: [
      'Learn the individual numerical forms for 0–19. The teens are distinct signs: do not construct them by joining the ten sign with a units sign.',
      'The multiples 20, 30, 40, 50, 60, 70, 80, and 90 also have their own signs.',
      'For 56, write the fifty sign followed by the six sign. Add 50 + 6 = 56.',
      'For 42, combine the forty sign with the two sign. The Cherokee Nation chart explicitly illustrates each combination from 21–99.',
      'The final chart entry, 100, uses a separate numerical sign. This converter covers the entire chart and stops there.',
    ],
    caveat:
      'The bounded 0–100 converter follows the Cherokee Nation’s educational chart of Sequoyah’s proposed numerals. The original numerical invention did not enter general use and is not encoded in Unicode. These original vector interpretations do not imply that historical Cherokee arithmetic was limited to one hundred or describe contemporary number-writing practice.',
    values: [
      ...Array.from({ length: 21 }, (_, value) => value),
      30,
      40,
      50,
      60,
      70,
      80,
      90,
      100,
    ].map((value) => ({ value, glyph: `cherokee-${value}` })),
    examples: examples([
      [
        0,
        'The original numerical sign for zero appears at the start of the community chart.',
        ['cherokee-0'],
      ],
      [
        14,
        'Fourteen uses its own charted form, rather than ten followed by four.',
        ['cherokee-14'],
      ],
      [42, 'Forty followed by two: 40 + 2.', ['cherokee-40', 'cherokee-2']],
      [56, 'Fifty followed by six: 50 + 6.', ['cherokee-50', 'cherokee-6']],
      [100, 'One hundred uses the dedicated final sign in the chart.', ['cherokee-100']],
    ]),
  },
  'ottoman-siyaq': {
    engine: 'written',
    min: '1',
    max: '9999',
    zero: false,
    howItWorks:
      'Each sign has a whole value, such as fifty or six hundred. Read right to left and add the signs. The units and tens in the final group have a special order: the unit precedes the tens sign in reading order.',
    readingSteps: [
      'Use dedicated signs for the nine units, nine tens, nine hundreds, and nine thousands. A fifty sign already means fifty; no zero is added.',
      'Read the largest groups first from the right: thousands, then hundreds. Omit absent groups.',
      'A compound of tens and units is transposed: the unit is read before the tens sign. In 56, six precedes fifty in right-to-left reading order, although their values still add to 56.',
      'For 555, read five hundred, then five, then fifty. This is the documented sequence for 500 + 5 + 50.',
      'The display uses the primary character forms with teaching spaces. Manuscripts also have joined forms, alternate characters, fraction signs, and rules for higher magnitudes.',
    ],
    caveat:
      'This converter supports whole numbers 1–9,999 in the documented primary-character convention. Spacing separates the signs for teaching; it does not reproduce all manuscript joining or alternate forms. Larger financial quantities and fractions have additional rules and are outside this app’s current range.',
    values: [1, 10, 100, 1000].flatMap((magnitude) =>
      Array.from({ length: 9 }, (_, i) => ({
        value: (i + 1) * magnitude,
        glyph: `ottoman-siyaq-${(i + 1) * magnitude}`,
      })),
    ),
    examples: examples([
      [1, 'The primary one sign, U+1ED01.', ['ottoman-siyaq-1']],
      [40, 'The distinct forty sign, U+1ED0D.', ['ottoman-siyaq-40']],
      [
        56,
        'Read right to left: six, then fifty. Compounds of units and tens are transposed.',
        ['ottoman-siyaq-50', 'ottoman-siyaq-6'],
      ],
      [
        555,
        'Read right to left: five hundred, five, fifty. Add 500 + 5 + 50.',
        ['ottoman-siyaq-50', 'ottoman-siyaq-5', 'ottoman-siyaq-500'],
      ],
      [1000, 'The primary thousand sign, U+1ED1C.', ['ottoman-siyaq-1000']],
      [
        5005,
        'Read right to left: five thousand followed by five. No zero placeholders.',
        ['ottoman-siyaq-5', 'ottoman-siyaq-5000'],
      ],
    ]),
    sources: [
      {
        title: 'Unicode Standard · Siyaq numerical notation',
        url: 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-22/',
        detail: 'Section 22.3.7: additive values, right-to-left order, and transposed units/tens.',
      },
      {
        title: 'Anshuman Pandey · Proposal to encode Ottoman Siyaq Numbers',
        url: 'https://www.unicode.org/L2/L2017/17348-ottoman-siyaq.pdf',
        detail:
          'Section 4, PDF pages 8–10: exact character sequences for 55, 505, 550, 555, 5,005, 5,500, and teens; Figures 14–20 provide supporting charts.',
      },
      {
        title: 'Unicode Ottoman Siyaq Numbers chart',
        url: 'https://www.unicode.org/charts/PDF/U1ED00.pdf',
        detail:
          'U+1ED01–U+1ED24: primary units through nine thousands. Higher forms and fractions remain outside this converter.',
      },
    ],
  },
};
