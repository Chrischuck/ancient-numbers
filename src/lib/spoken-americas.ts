import type { Representation, SystemDefinition } from './types';

interface AmericanWordEntry {
  word: string;
  meaning: string;
}

// Choctaw Nation lessons supply the ten isolated words. Its October 2018
// Biskinik counting chart supplies awah, pokoli and akocha compounds. The
// chart's achvffa is displayed as achʋffa in the Nation's teaching alphabet.
const choctawUnits = [
  'achʋffa',
  'tuklo',
  'tuchina',
  'ushta',
  'tahlapi',
  'hannali',
  'untuklo',
  'untuchina',
  'chakkali',
  'pokkoli',
];

// Transcribed visually from the Diné College Learning Center's one-page
// Navajo Numbering System guide. Nasal vowels in dį́į́’ and hastą́ą́ must not
// be lost when reading the scanned PDF. Ninety has one é in this source.
const navajoUnits = [
  't’ááłá’í',
  'naaki',
  'táá’',
  'dį́į́’',
  'ashdla’',
  'hastą́ą́',
  'tsoosts’id',
  'tseebíí',
  'náhást’éí',
  'neeznáá',
];
const navajoTens: Record<number, string> = {
  20: 'naadiin',
  30: 'tádiin',
  40: 'dízdiin',
  50: 'ashdladiin',
  60: 'hastą́diin',
  70: 'tsoosts’idiin',
  80: 'tseebíídiin',
  90: 'náhást’édiin',
};

const numbered = (words: string[]): AmericanWordEntry[] =>
  words.map((word, i) => ({ word, meaning: String(i + 1) }));

/** The selected community sources' vocabulary and number-building elements. */
export function americanWordDictionary(system: SystemDefinition): AmericanWordEntry[] {
  if (system.id === 'choctaw')
    return [
      ...numbered(choctawUnits),
      ...choctawUnits.slice(1, 9).map((word, i) => ({
        word: `pokoli ${word}`,
        meaning: `${(i + 2) * 10} = 10 × ${i + 2}`,
      })),
      { word: 'awah', meaning: 'ten plus · followed by a unit for 11–19' },
      { word: 'pokoli', meaning: 'ten in the multiplied tens expressions 20–90' },
      { word: 'akocha', meaning: 'joins the remaining units after the tens · 2018 chart spelling' },
      { word: 'tahlepa achʋffa', meaning: '100 = one hundred' },
    ];
  if (system.id === 'navajo')
    return [
      ...numbered(navajoUnits),
      ...Object.entries(navajoTens).map(([meaning, word]) => ({ word, meaning })),
      { word: 'ła’', meaning: 'one in the guide’s 11 and 21 compounds' },
      { word: 'ts’áadah', meaning: 'teen element · follows the unit in 11–19' },
      { word: '-diin', meaning: 'tens element; learn the complete tens forms' },
      { word: 'dóó bi’aan', meaning: 'links the tens and units in the guide’s 30–99 compounds' },
      { word: 't’ááłá’ídi neeznádiin', meaning: '100 · complete documented compound' },
    ];
  return [];
}

function choctawWords(value: number): { words: string; construction: string } {
  if (value <= 10)
    return {
      words: choctawUnits[value - 1],
      construction: `A whole counting word names ${value}.`,
    };
  if (value < 20)
    return {
      words: `awah ${choctawUnits[value - 11]}`,
      construction: `Awah followed by the unit gives 10 + ${value - 10} = ${value}.`,
    };
  if (value === 100)
    return {
      words: 'tahlepa achʋffa',
      construction: 'Tahlepa followed by one names one hundred: 100 × 1 = 100.',
    };
  const tens = Math.floor(value / 10);
  const unit = value % 10;
  const words = `pokoli ${choctawUnits[tens - 1]}`;
  return {
    words: unit ? `${words} akocha ${choctawUnits[unit - 1]}` : words,
    construction: unit
      ? `Read ten times ${tens}, then akocha and the remaining ${unit}: 10 × ${tens} + ${unit} = ${value}.`
      : `Pokoli followed by ${choctawUnits[tens - 1]} names ${tens} tens: 10 × ${tens} = ${value}.`,
  };
}

function navajoWords(value: number): { words: string; construction: string } {
  if (value <= 10)
    return { words: navajoUnits[value - 1], construction: `A whole counting word names ${value}.` };
  if (value < 20)
    return {
      words: `${value === 11 ? 'ła’' : navajoUnits[value - 11]} ts’áadah`,
      construction: `The unit comes before the teen element ts’áadah: ${value - 10} + 10 = ${value}.${value === 11 ? ' Eleven uses the short one form ła’.' : ''}`,
    };
  if (value === 100)
    return {
      words: 't’ááłá’ídi neeznádiin',
      construction: 'The guide’s complete expression names one hundred.',
    };
  const tens = Math.floor(value / 10) * 10;
  const unit = value % 10;
  if (!unit)
    return {
      words: navajoTens[tens],
      construction: `The complete tens form names ${tens}: ${tens / 10} × 10 = ${tens}.`,
    };
  const unitWord = value === 21 ? 'ła’' : navajoUnits[unit - 1];
  return {
    words: `${navajoTens[tens]}${tens === 20 ? ' ' : ' dóó bi’aan '}${unitWord}`,
    construction:
      tens === 20
        ? `Twenty followed directly by the unit gives 20 + ${unit} = ${value}.${unit === 1 ? ' Twenty-one uses the short one form ła’.' : ''}`
        : `The tens form, dóó bi’aan, and the unit give ${tens} + ${unit} = ${value}.`,
  };
}

/** Full 1–100 converters for the selected Choctaw and Diné teaching forms. */
export function representAmericanWords(n: bigint, system: SystemDefinition): Representation {
  if (system.id !== 'choctaw' && system.id !== 'navajo')
    return {
      status: 'unsupported',
      tokens: [],
      layout: 'words',
      explanation: '',
      reason: 'No American spoken-number converter is defined for this system.',
    };
  if (n < 1n || n > 100n)
    return {
      status: 'unsupported',
      tokens: [],
      layout: 'words',
      explanation: '',
      reason: `The ${system.name} learning converter supports whole numbers from 1 through 100. This is an app limit.`,
    };
  const { words, construction } =
    system.id === 'choctaw' ? choctawWords(Number(n)) : navajoWords(Number(n));
  return {
    status: 'ok',
    tokens: [
      {
        text: words,
        label: `${system.name} number ${n}: ${words}`,
        lang: system.id === 'choctaw' ? 'cho' : 'nv',
      },
    ],
    layout: 'words',
    explanation: `${construction} ${system.id === 'choctaw' ? 'The words follow Choctaw Nation teaching forms and the 2018 counting chart’s akocha spelling.' : 'The words and compound spacing follow the Diné College reference guide.'} This explains number naming; it does not establish an arithmetic algorithm used by every speaker.`,
    unicode: words,
  };
}
