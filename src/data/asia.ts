import type { SystemDefinition } from '../lib/types';

const unicode = (chapter: number, detail: string) => ({
  title: `The Unicode Standard 17.0, chapter ${chapter}`,
  url: `https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-${chapter}/`,
  detail,
});
const descending = (prefix: string, values: number[]) =>
  [...values].sort((a, b) => b - a).map((value) => ({ value, glyph: `${prefix}-${value}` }));

export const asiaSystems: SystemDefinition[] = [
  {
    id: 'babylonian',
    name: 'Babylonian sexagesimal',
    region: 'Asia',
    location: 'Mesopotamia · present-day Iraq',
    period: 'Old Babylonian · c. 1800–1600 BCE',
    era: 'Ancient',
    structure: 'Positional',
    baseLabel: 'Base 60',
    summary: 'Base-60 place values, with wedge signs for units and tens.',
    history:
      'Old Babylonian scribes pressed reed styluses into clay. Their mathematical tablets combine a base-sixty place system with additive groups of tens and ones. The square-root tablet YBC 7289 is an extraordinary surviving example.',
    howItWorks:
      'Count the wedges inside each group first. Then read the groups using positions worth sixty times one another.',
    readingSteps: [
      'Inside one group, a vertical wedge means 1 and a corner wedge means 10. Four ten-wedges and two one-wedges make 40 + 2 = 42.',
      'One position can hold a value from 0 to 59. Once you reach sixty, you need another position.',
      'For 61, the left group has one wedge in the sixties position. That means one group of sixty: 60.',
      'The right group has one wedge in the ones position. Add 60 + 1 = 61. Our separated cells and labels show which place is which; historical readings also depended on context.',
    ],
    caveat:
      'This is an educational transcription of Old Babylonian notation. Empty places are blank cells, not a historical zero sign. The cells and integer scale labels are modern aids: historical notation could leave the scale ambiguous. Later placeholder conventions are not mixed into this earlier variant.',
    engine: 'babylonian',
    min: '1',
    max: '999999999999999999999999999999',
    zero: false,
    radix: 60,
    digits: Array.from({ length: 60 }, (_, n) => `babylonian-${n}`),
    specimen: 42,
    examples: [
      {
        value: '30',
        glyphs: ['babylonian-30'],
        explanation:
          'Three ten-wedges. The side of YBC 7289 is marked 30; its scale is determined by context.',
      },
      {
        value: '42',
        glyphs: ['babylonian-42'],
        explanation: 'Four tens and two ones in a single sexagesimal place.',
      },
      {
        value: '61',
        glyphs: ['babylonian-1', 'babylonian-1'],
        explanation: '1 × 60 + 1. The same one-wedge occupies two places.',
      },
    ],
    sources: [
      {
        title: 'Bill Casselman, Analysis of YBC 7289 · University of British Columbia',
        url: 'https://personal.math.ubc.ca/~cass/Euclid/ybc/analysis.html',
        detail: 'Photographic analysis of the one- and ten-wedges and conventional clusters.',
      },
      {
        title: 'Bill Casselman, Mathematical commentary on YBC 7289',
        url: 'https://personal.math.ubc.ca/~cass/euclid/ybc/comments.html',
        detail: 'Base sixty, decimal groups within each place, absent zero, and floating scale.',
      },
    ],
    featured: true,
  },
  {
    id: 'brahmi',
    name: 'Brahmi',
    region: 'Asia',
    location: 'Indian subcontinent',
    period: 'Early additive numerals · from the 3rd century BCE',
    era: 'Ancient',
    structure: 'Additive',
    baseLabel: 'Decimal sign values',
    summary: 'Additive signs for units and multiples of ten.',
    history:
      'Brahmi was used across the Indian subcontinent and developed many regional forms. Its earlier numeral repertoire uses separate signs for ones and tens; a later positional digit set belongs to a different stage of the tradition.',
    howItWorks:
      'In the supported range of 1–99, a tens sign names the whole tens amount. Add the ones sign after it.',
    readingSteps: [
      'For 42, separate the number into forty and two.',
      'Write the dedicated forty sign first. This one sign contributes all 40.',
      'Write the two sign next. Add the values: 40 + 2 = 42.',
      'For 90, use just the ninety sign. You do not add a zero after it, because the sign itself already means ninety.',
    ],
    caveat:
      'This converter covers the verified unligated range 1–99. Historical hundreds and thousands use multiplicative ligatures and regional variants; those forms need a separate drawing and rules study. The range limit is an app limit, not the historical limit of Brahmi.',
    engine: 'additive',
    min: '1',
    max: '99',
    zero: false,
    values: descending('brahmi', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90]),
    specimen: 42,
    examples: [
      {
        value: '10',
        glyphs: ['brahmi-10'],
        explanation: 'A dedicated ten sign, rather than one followed by zero.',
      },
      {
        value: '42',
        glyphs: ['brahmi-40', 'brahmi-2'],
        explanation: '40 + 2: the larger value precedes the smaller.',
      },
      {
        value: '99',
        glyphs: ['brahmi-90', 'brahmi-9'],
        explanation: '90 + 9, using two distinct additive signs.',
      },
    ],
    sources: [
      unicode(
        14,
        'Section 14.1: distinguishes old additive-multiplicative numerals from later positional digits and specifies descending additive order.',
      ),
      {
        title: 'Unicode Brahmi character chart',
        url: 'https://www.unicode.org/charts/PDF/U11000.pdf',
        detail: 'U+11052–U+11063 identify the one-to-nine and ten-to-ninety signs.',
      },
    ],
  },
  {
    id: 'kharoshthi',
    name: 'Kharoshthi',
    localName: 'Kharoṣṭhī',
    region: 'Asia',
    location: 'Gandhāra · northern Pakistan and eastern Afghanistan',
    period: 'Manuscript forms · c. 1st century CE',
    era: 'Ancient',
    structure: 'Mixed',
    baseLabel: 'Decimal, with groups of 20',
    summary:
      'Right-to-left notation with signs for one, two, three, four, ten, twenty, and one hundred.',
    history:
      'Kharoshthi accompanied Gāndhārī manuscripts and inscriptions in the northwest of the Indian subcontinent. The numeral shapes here follow the first-century manuscript tradition documented by Unicode.',
    howItWorks:
      'Begin at the right-hand end. Read small groups of signs, then add the amounts those groups represent.',
    readingSteps: [
      'For 42, start on the right with a twenty sign, then another twenty sign: 20 + 20 = 40.',
      'Continue left to the two sign. Add 40 + 2 = 42.',
      'Units use signs for 1–4. For six, combine a four sign and a two sign: 4 + 2 = 6. Tens use repeated twenties and, when needed, a ten.',
      'For hundreds, first read the small-number group that comes before the hundred sign in reading order, then multiply that amount by 100. Thousands use repeated thousand signs. Add these larger groups to the rest; there is no zero sign.',
    ],
    caveat:
      'There is no zero sign and no separate five-to-nine signs. The app supports positive integers through 9,999; fractional and later regional practices are outside this implementation. Display order follows the script rather than reversing the arithmetic explanation.',
    engine: 'kharoshthi',
    min: '1',
    max: '9999',
    zero: false,
    values: descending('kharoshthi', [1, 2, 3, 4, 10, 20, 100, 1000]),
    specimen: 1996,
    examples: [
      {
        value: '6',
        glyphs: ['kharoshthi-2', 'kharoshthi-4'],
        explanation: 'Read right to left: 4 + 2.',
      },
      {
        value: '42',
        glyphs: ['kharoshthi-2', 'kharoshthi-20', 'kharoshthi-20'],
        explanation: 'Read right to left: 20 + 20 + 2.',
      },
      {
        value: '1996',
        glyphs: [
          'kharoshthi-2',
          'kharoshthi-4',
          'kharoshthi-10',
          'kharoshthi-20',
          'kharoshthi-20',
          'kharoshthi-20',
          'kharoshthi-20',
          'kharoshthi-100',
          'kharoshthi-1',
          'kharoshthi-4',
          'kharoshthi-4',
          'kharoshthi-1000',
        ],
        explanation:
          'Unicode’s worked example: 1000 + (4 + 4 + 1) × 100 + 20 + 20 + 20 + 20 + 10 + 4 + 2, read right to left.',
      },
    ],
    sources: [
      unicode(
        14,
        'Section 14.2 and Figure 14-3: manuscript shapes, right-to-left order, repertoire, and complete 1996 example.',
      ),
      {
        title: 'Unicode Kharoshthi character chart',
        url: 'https://www.unicode.org/charts/PDF/U10A00.pdf',
        detail: 'U+10A40–U+10A47: one, two, three, four, ten, twenty, hundred, thousand.',
      },
    ],
  },
  {
    id: 'sinhala',
    name: 'Sinhala Illakkam',
    region: 'Asia',
    location: 'Sri Lanka',
    period: 'Archaic numerals · in use before 1815',
    era: 'Historical',
    structure: 'Multiplicative',
    baseLabel: 'Decimal with multipliers',
    summary: 'Unit and tens signs combine with hundred and thousand multipliers.',
    history:
      'Sinhala Illakkam survives in royal documents and artifacts, including material from the Kandyan period. Sri Lankan research distinguished this non-positional set from the zero-bearing astrological numerals called Lith Illakkam.',
    howItWorks:
      'Read left to right. A small number before a hundred or thousand sign tells you how many hundreds or thousands to count.',
    readingSteps: [
      'For 1,987, the thousand sign alone contributes 1,000. The leading one is understood, so it is not written.',
      'Next, nine before the hundred sign means nine hundreds: 9 × 100 = 900.',
      'The eighty sign contributes 80, and the seven sign contributes 7.',
      'Add 1,000 + 900 + 80 + 7 = 1,987. Missing amounts are omitted: 2,010 uses two × thousand, then ten, with no zero placeholders.',
    ],
    caveat:
      'There is no zero sign: empty groups are omitted. This converter supports 1–9,999 using the composition shown in the Sri Lankan standards proposal. Larger forms are not implemented. Sinhala Lith Illakkam is a separate, positional system.',
    engine: 'sinhala',
    min: '1',
    max: '9999',
    zero: false,
    specimen: 42,
    examples: [
      { value: '10', glyphs: ['sinhala-10'], explanation: 'The distinct archaic ten sign.' },
      {
        value: '42',
        glyphs: ['sinhala-40', 'sinhala-2'],
        explanation: '40 + 2, combining a tens sign and a unit sign.',
      },
      { value: '90', glyphs: ['sinhala-90'], explanation: 'A single sign stands for ninety.' },
      {
        value: '101',
        glyphs: ['sinhala-100', 'sinhala-1'],
        explanation: '100 + 1. The leading one before hundred is omitted, as in the source chart.',
      },
      {
        value: '222',
        glyphs: ['sinhala-2', 'sinhala-100', 'sinhala-20', 'sinhala-2'],
        explanation: '2 × 100 + 20 + 2; shown in the Sri Lankan standards proposal.',
      },
      {
        value: '1987',
        glyphs: ['sinhala-1000', 'sinhala-9', 'sinhala-100', 'sinhala-80', 'sinhala-7'],
        explanation: '1,000 + 9 × 100 + 80 + 7; shown in the source chart without a leading one.',
      },
      {
        value: '2010',
        glyphs: ['sinhala-2', 'sinhala-1000', 'sinhala-10'],
        explanation: '2 × 1,000 + 10. No zero placeholders; shown in the source chart.',
      },
    ],
    sources: [
      {
        title: 'Sri Lanka Standards Institution · Sinhala numeral proposal',
        url: 'https://www.unicode.org/L2/L2010/10337-n3888-sinhala.pdf',
        detail:
          'Page 4: compound examples 101–111, repeated-digit hundreds (222–999), 1,000, 1,987, and 2,010. The leading one before hundred/thousand is omitted. Pages 9–10: encoded repertoire.',
      },
      {
        title: 'Proposal to Encode Sinhala Archaic Numerals and Numbers (L2/10-312)',
        url: 'https://www.unicode.org/L2/L2010/10312-sinhala-num.pdf',
        detail: 'Page 4: one hundred, multiples 200–900, and one thousand.',
      },
      unicode(
        13,
        'Section 13.2.2: Sinhala Illakkam is non-positional and distinct from Lith Illakkam.',
      ),
    ],
  },
  {
    id: 'tamil',
    name: 'Traditional Tamil',
    localName: 'தமிழ் எண்கள்',
    region: 'Asia',
    location: 'Tamil-speaking South India and Sri Lanka',
    period: 'Traditional non-positional notation',
    era: 'Historical',
    structure: 'Multiplicative',
    baseLabel: 'Decimal, named powers',
    summary: 'Digits combine with signs for ten, one hundred, and one thousand.',
    history:
      'Traditional Tamil numerals retain distinct signs for ten, hundred, and thousand. This additive-multiplicative notation differs from modern positional writing with Tamil digits and a zero.',
    howItWorks:
      'Read left to right. A number before a ten, hundred, or thousand sign tells you how many of that amount to count.',
    readingSteps: [
      'For 156, start with the hundred sign. Written alone, it means one hundred; the one is understood.',
      'Next read five followed by the ten sign. This means five tens: 5 × 10 = 50.',
      'The final six sign contributes six ones.',
      'Add 100 + 50 + 6 = 156. The same pattern builds 3,782: three thousands, seven hundreds, eight tens, and two ones. Leave out groups with no value.',
    ],
    caveat:
      'The app supports the traditional whole-number notation through 9,999. Larger forms, specialized fractions, measures, and accounting signs exist but need additional adapters. A modern Tamil zero is not inserted into the traditional notation.',
    engine: 'tamil',
    min: '1',
    max: '9999',
    zero: false,
    values: descending('tamil', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 1000]),
    specimen: 3782,
    examples: [
      {
        value: '20',
        glyphs: ['tamil-2', 'tamil-10'],
        explanation: 'Two × ten, as listed in Unicode Technical Note 21.',
      },
      {
        value: '156',
        glyphs: ['tamil-100', 'tamil-5', 'tamil-10', 'tamil-6'],
        explanation: 'Hundred + five × ten + six; an explicit source example.',
      },
      {
        value: '3782',
        glyphs: ['tamil-3', 'tamil-1000', 'tamil-7', 'tamil-100', 'tamil-8', 'tamil-10', 'tamil-2'],
        explanation: 'Three thousands, seven hundreds, eight tens, two.',
      },
    ],
    sources: [
      {
        title: 'Michael Kaplan · Unicode Technical Note 21: Tamil Numbers',
        url: 'https://www.unicode.org/notes/tn21/tamil_numbers.pdf',
        detail: 'Worked traditional forms including 20, 156, 1001, 1040, and 3782.',
      },
      {
        title: 'Unicode Tamil character chart',
        url: 'https://www.unicode.org/charts/PDF/U0B80.pdf',
        detail: 'U+0BE7–U+0BF2: unit numerals and historical ten, hundred, thousand signs.',
      },
    ],
  },
  {
    id: 'rods',
    name: 'Chinese counting rods',
    localName: '算筹',
    region: 'Asia',
    location: 'China · later used across East Asia',
    period: 'Song-dynasty orientation convention · 960–1279 CE',
    era: 'Historical',
    structure: 'Physical',
    baseLabel: 'Base 10',
    summary:
      'Decimal place values represented by counting rods. Rod orientation alternates between adjacent positions.',
    history:
      'Counting rods were arranged on a board to perform mathematics. The app adopts the Song-period forms used in Unicode’s chart; earlier Han texts can exchange the orientations.',
    howItWorks:
      'Read the rod groups by their positions. Alternating rod directions helps keep neighboring digits separate.',
    readingSteps: [
      'First read a digit’s shape: the five-bar contributes five, and the extra rods add ones. A five-bar with two extra rods is 7.',
      'The rightmost position counts ones, then tens, hundreds, and thousands as you move left. Ones and hundreds use one rod orientation; tens and thousands use the other.',
      'For 42, the 4 in the tens position means 40. The 2 in the ones position means 2. Add 40 + 2 = 42.',
      'For 6,708, read six thousands, seven hundreds, a blank tens position, and eight ones: 6,000 + 700 + 0 + 8. The blank represents zero; the cells and labels are teaching aids.',
    ],
    caveat:
      'A blank cell is intentional. Our separated cells and place labels are a modern teaching aid, not additional historical signs. The overall zero is shown as an empty board cell. Negative-rod color conventions and fractional board layouts are outside this adapter.',
    engine: 'rods',
    min: '0',
    max: '999999999999999999999999999999',
    zero: true,
    radix: 10,
    specimen: 6708,
    examples: [
      {
        value: '7',
        glyphs: ['rods-unit-7'],
        explanation: 'The unit-form seven combines a five-bar and two unit rods.',
      },
      {
        value: '42',
        glyphs: ['rods-tens-4', 'rods-unit-2'],
        explanation: 'Four in the tens orientation, then two in the units orientation.',
      },
      {
        value: '6708',
        glyphs: ['rods-tens-6', 'rods-unit-7', 'rods-zero', 'rods-unit-8'],
        explanation:
          '6 × 1000 + 7 × 100 + an empty tens cell + 8. Alternating forms distinguish places.',
      },
    ],
    sources: [
      unicode(
        22,
        'Section 22.3.8: two alternating sets, Song-period chart convention, and an empty square for zero.',
      ),
      {
        title: 'Unicode Counting Rod Numerals character chart',
        url: 'https://www.unicode.org/charts/PDF/U1D360.pdf',
        detail: 'Unit digits U+1D360–U+1D368 and tens digits U+1D369–U+1D371.',
      },
    ],
  },
  {
    id: 'suzhou',
    name: 'Suzhou',
    localName: '蘇州碼子',
    region: 'Asia',
    location: 'China · commercial traditions including Hong Kong and Macau',
    period: 'Ming–Qing commerce and later survivals',
    era: 'Historical',
    structure: 'Positional',
    baseLabel: 'Base 10',
    summary:
      'Decimal merchant numerals with alternating stroke orientations for one, two, and three.',
    history:
      'Suzhou numerals appear extensively in surviving Chinese merchant account books. Related to counting-rod notation, they became a compact companion to abacus bookkeeping and persisted in some later commercial settings.',
    howItWorks:
      'Read the digits from left to right using decimal place value. Some digits change orientation to keep adjacent strokes readable.',
    readingSteps: [
      'For 123, begin with the three digit values: 1, 2, and 3.',
      'In a consecutive run of ones, twos, and threes, start with a vertical form, then alternate horizontal and vertical forms. Here the signs are 〡, 二, 〣.',
      'Read their positions: the first digit means one hundred, the next two tens, and the last three ones.',
      'Add 100 + 20 + 3 = 123. A different digit breaks the alternating run, so in 42 the two uses the vertical form.',
    ],
    caveat:
      'This converter renders the integer digit row. Full commercial labels may include a separate scale and unit line; those are not generated here. The horizontal-first alternative is also documented, but the app consistently uses vertical-first. Glyph variants occur in handwritten sources.',
    engine: 'suzhou',
    min: '0',
    max: '999999999999999999999999999999',
    zero: true,
    radix: 10,
    digits: Array.from({ length: 10 }, (_, n) => `suzhou-${n}`),
    specimen: 123,
    examples: [
      {
        value: '123',
        glyphs: ['suzhou-1', 'suzhou-horizontal-2', 'suzhou-3'],
        explanation: 'The explicitly documented vertical–horizontal–vertical spelling: 〡二〣.',
      },
      {
        value: '312',
        glyphs: ['suzhou-3', 'suzhou-horizontal-1', 'suzhou-2'],
        explanation: 'Another explicit archival-study example: 〣一〢.',
      },
      {
        value: '42',
        glyphs: ['suzhou-4', 'suzhou-2'],
        explanation: 'The four sign followed by a vertical two; four breaks an alternating run.',
      },
    ],
    sources: [
      {
        title: 'LSE Economic History Working Paper 220 · Appendix II',
        url: 'https://www.lse.ac.uk/asset-library/information/wp220.pdf',
        detail:
          'Page 30 studies 18th–19th century Tong Taisheng account books; gives alternating 123 and 312 forms and commercial context.',
      },
      unicode(
        22,
        'Section 22.3.8 distinguishes Suzhou commercial forms from anti-fraud accounting numerals.',
      ),
      {
        title: 'Unicode Suzhou glyph review',
        url: 'https://www.unicode.org/L2/L2023/23281-cjk-symbols-github-update.pdf',
        detail:
          'Historical glyph variants and bibliographic specimens; drawing reference for forms four through nine.',
      },
    ],
  },
  {
    id: 'old-persian',
    name: 'Old Persian',
    region: 'Asia',
    location: 'Achaemenid Persia · present-day Iran',
    period: 'Achaemenid inscriptions · from c. 525 BCE',
    era: 'Ancient',
    structure: 'Additive',
    baseLabel: 'Decimal sign values',
    summary: 'Additive cuneiform signs for units, ten, twenty, and one hundred.',
    history:
      'Old Persian script was developed for royal monumental inscriptions associated with Darius I. Its wedge-shaped signs are a distinct writing system, not simply Babylonian cuneiform with the same mathematical rules.',
    howItWorks:
      'Read left to right and add the signs. Repeated signs each contribute their full value.',
    readingSteps: [
      'The signs used here mean 100, 20, 10, 2, and 1.',
      'For 42, read the first twenty sign, then the second: 20 + 20 = 40.',
      'Read the two sign next. Add 40 + 2 = 42.',
      'For 120, use a hundred sign and a twenty sign: 100 + 20 = 120. These signs already carry their amounts, so no zero placeholder is needed.',
    ],
    caveat:
      'The app supports additive whole numbers through 999; this is an implementation bound. It uses the five encoded numeral values and does not invent a positional zero or transfer Babylonian base-sixty rules into Old Persian.',
    engine: 'additive',
    min: '1',
    max: '999',
    zero: false,
    values: descending('old-persian', [1, 2, 10, 20, 100]),
    specimen: 42,
    examples: [
      { value: '2', glyphs: ['old-persian-2'], explanation: 'The dedicated two sign.' },
      {
        value: '42',
        glyphs: ['old-persian-20', 'old-persian-20', 'old-persian-2'],
        explanation: '20 + 20 + 2, read left to right.',
      },
      {
        value: '120',
        glyphs: ['old-persian-100', 'old-persian-20'],
        explanation: '100 + 20; no positional digit is needed.',
      },
    ],
    sources: [
      unicode(
        11,
        'Section 11.3: Achaemenid context, left-to-right direction, and attested numeral sequences from 1, 2, 10, 20, 100.',
      ),
      {
        title: 'Michael Everson · Old Persian encoding proposal',
        url: 'https://www.unicode.org/wg2/docs/n2545.pdf',
        detail: 'Numeral inventory and chart of Old Persian forms.',
      },
    ],
  },
  {
    id: 'phoenician',
    name: 'Phoenician',
    region: 'Asia',
    location: 'Levant and Mediterranean trading networks',
    period: 'Phoenician and Punic traditions · 1st millennium BCE onward',
    era: 'Ancient',
    structure: 'Additive',
    baseLabel: 'Decimal tallies',
    summary: 'Right-to-left additive notation with signs for units, ten, twenty, and one hundred.',
    history:
      'Phoenician writing spread across Mediterranean networks and continued in Punic forms. Its numerical notation uses repeated signs, with dedicated marks for ten, twenty, and hundred alongside small tally groups.',
    howItWorks: 'Begin at the right-hand end and add the sign values as you move left.',
    readingSteps: [
      'For 55, start with two twenty signs: 20 + 20 = 40.',
      'Continue to the ten sign. The running total becomes 40 + 10 = 50.',
      'The remaining three and two signs add five: 50 + 3 + 2 = 55.',
      'For 42, use two twenties and a two: 20 + 20 + 2. The converter groups unit tallies into the fewest available signs.',
    ],
    caveat:
      'The app supports the straightforward additive range 1–99. Larger inscriptions can involve additional conventions, so the hundred sign is documented without extrapolating a general hundreds algorithm. There is no zero digit.',
    engine: 'additive',
    min: '1',
    max: '99',
    zero: false,
    values: descending('phoenician', [1, 2, 3, 10, 20]),
    specimen: 55,
    examples: [
      { value: '3', glyphs: ['phoenician-3'], explanation: 'The three-tally group.' },
      {
        value: '42',
        glyphs: ['phoenician-2', 'phoenician-20', 'phoenician-20'],
        explanation: 'Read right to left: 20 + 20 + 2.',
      },
      {
        value: '55',
        glyphs: ['phoenician-2', 'phoenician-3', 'phoenician-10', 'phoenician-20', 'phoenician-20'],
        explanation: 'Read right to left: 20 + 20 + 10 + 3 + 2.',
      },
    ],
    sources: [
      unicode(
        10,
        'Section 10.3: six numeral elements, repetition, and right-to-left numeral direction.',
      ),
      {
        title: 'Unicode Phoenician character chart',
        url: 'https://www.unicode.org/charts/PDF/U10900.pdf',
        detail: 'Numeric forms U+10916–U+1091B; units include one, two, and three.',
      },
    ],
  },
  {
    id: 'ottoman-siyaq',
    name: 'Ottoman Siyaq',
    localName: 'Siyakat',
    region: 'Asia',
    location: 'Ottoman administrative world',
    period: 'Ottoman-era accounting notation',
    era: 'Historical',
    structure: 'Mixed',
    baseLabel: 'Decimal orders',
    summary: 'Specialized number signs used in Ottoman accounting records.',
    history:
      'Ottoman Siyaq belonged to specialized accounting and administrative practice. Its numeral repertoire has primary units, tens, hundreds, larger orders, alternate historical forms, and selected fractions.',
    howItWorks:
      'Start with the individual examples shown here. A single sign can stand for a complete amount such as forty or one thousand.',
    readingSteps: [
      'Choose the example for 1: the displayed sign means one by itself.',
      'Choose 40: this is a different sign whose whole value is forty. You do not need to combine a four digit with a zero.',
      'Choose 1,000: the single thousand sign contributes the whole amount.',
      'Longer numbers use special right-to-left ordering, joined shapes, and rules for large amounts. This exhibit provides selected signs rather than a general conversion rule. One-half and one-sixth also have their own signs.',
    ],
    caveat:
      'This is a sourced specimen explorer, not a general converter. Standalone signs below are securely identified, but full compound layout, alternate forms, and financial context need additional specialist review before arbitrary values can be rendered accurately.',
    engine: 'explainer',
    min: '1',
    max: '1000',
    zero: false,
    specimen: 40,
    examples: [
      { value: '1', glyphs: ['ottoman-siyaq-1'], explanation: 'The primary one sign, U+1ED01.' },
      {
        value: '40',
        glyphs: ['ottoman-siyaq-40'],
        explanation: 'The distinct forty sign, U+1ED0D; not four positional digits.',
      },
      {
        value: '1000',
        glyphs: ['ottoman-siyaq-1000'],
        explanation:
          'The primary thousand sign, U+1ED1C; the repertoire also has higher orders and variants.',
      },
    ],
    sources: [
      {
        title: 'Anshuman Pandey · Proposal to encode Ottoman Siyaq Numbers',
        url: 'https://www.unicode.org/L2/L2017/17348-ottoman-siyaq.pdf',
        detail:
          'Specialist repertoire, sample records, alternates, compound formation, and fractions.',
      },
      {
        title: 'Unicode Ottoman Siyaq Numbers chart',
        url: 'https://www.unicode.org/charts/PDF/U1ED00.pdf',
        detail: 'Primary numbers and explicit values, including one, forty, and thousand.',
      },
    ],
  },
];
