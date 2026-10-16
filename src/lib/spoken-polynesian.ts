import type { Representation, SystemDefinition } from './types';

export interface PolynesianWordEntry {
  word: string;
  meaning: string;
}
const maoriUnits = ['kore', 'tahi', 'rua', 'toru', 'whā', 'rima', 'ono', 'whitu', 'waru', 'iwa'];
// Bare counting roots from Kaliko Trapp's ʻŌlelo Online lesson. Quantity
// prefixes are context-dependent and do not belong on every compound part.
const hawaiianUnits = ['ʻole', 'kahi', 'lua', 'kolu', 'hā', 'lima', 'ono', 'hiku', 'walu', 'iwa'];
const hawaiianTens = [
  '',
  'ʻumi',
  'iwakālua',
  'kanakolu',
  'kanahā',
  'kanalima',
  'kanaono',
  'kanahiku',
  'kanawalu',
  'kanaiwa',
];

function unsupported(reason: string): Representation {
  return { status: 'unsupported', tokens: [], layout: 'words', explanation: '', reason };
}

export function polynesianWordDictionary(system: SystemDefinition): PolynesianWordEntry[] {
  if (system.id === 'maori')
    return [
      ...maoriUnits.map((word, value) => ({ word, meaning: String(value) })),
      { word: 'tekau', meaning: '10; a number before tekau counts tens, as in rua tekau (20)' },
      { word: 'rau', meaning: '100; kotahi rau (100), rua rau (200)' },
      { word: 'mano', meaning: '1,000; kotahi mano (1,000), rua mano (2,000)' },
      {
        word: 'kotahi',
        meaning: 'one in the hundred/thousand groups shown here; also used for one object',
      },
      { word: 'mā', meaning: 'joins the final additional units' },
    ];
  if (system.id === 'hawaiian')
    return [
      ...hawaiianUnits.map((word, value) => ({ word, meaning: `${value} · bare counting form` })),
      ...hawaiianTens.slice(1).map((word, i) => ({ word, meaning: String((i + 1) * 10) })),
      { word: 'hoʻokahi haneli', meaning: '100 · contemporary decimal form' },
      { word: 'kūmā', meaning: 'joins a ten to additional units: kanalima-kūmā-ono = 56' },
      { word: 'kana-', meaning: 'forms the tens from 30 through 90 with a number root' },
      { word: 'kāuna', meaning: 'traditional grouping term: a group of 4 objects' },
      { word: 'kaʻau', meaning: 'traditional grouping term: a group of 40 objects' },
      { word: 'lau', meaning: 'traditional grouping value 400; context may express abundance' },
      { word: 'mano', meaning: 'traditional grouping value 4,000; context matters' },
    ];
  return [];
}

export function representPolynesianWords(n: bigint, system: SystemDefinition): Representation {
  if (system.id === 'maori') {
    if (n < 0n || n > 9999n)
      return unsupported(
        'This contemporary Māori counting converter supports whole numbers from 0 to 9,999.',
      );
    const value = Number(n);
    const thousands = Math.floor(value / 1000);
    const hundreds = Math.floor(value / 100) % 10;
    const tens = Math.floor(value / 10) % 10;
    const units = value % 10;
    const groups: string[] = [];
    const parts: string[] = [];
    if (thousands) {
      groups.push(`${thousands === 1 ? 'kotahi' : maoriUnits[thousands]} mano`);
      parts.push(`${thousands} × 1,000`);
    }
    if (hundreds) {
      groups.push(`${hundreds === 1 ? 'kotahi' : maoriUnits[hundreds]} rau`);
      parts.push(`${hundreds} × 100`);
    }
    if (tens) {
      groups.push(tens === 1 ? 'tekau' : `${maoriUnits[tens]} tekau`);
      parts.push(`${tens} × 10`);
    }
    if (units) {
      groups.push(`${groups.length ? 'mā ' : ''}${maoriUnits[units]}`);
      parts.push(String(units));
    }
    const word = groups.join(' ') || 'kore';
    return {
      status: 'ok',
      layout: 'words',
      tokens: [{ text: word, lang: 'mi' }],
      explanation: `${parts.join(' + ') || '0'} = ${n}. Contemporary isolated counting: mano counts thousands, rau hundreds, tekau tens, and mā joins remaining units. Sentence context can require e or toko-.`,
    };
  }
  if (system.id === 'hawaiian') {
    if (n < 0n || n > 100n)
      return unsupported(
        'This Hawaiian decimal counting converter supports whole numbers from 0 through 100. Traditional group names are explained separately in the dictionary.',
      );
    const value = Number(n);
    const tens = Math.floor(value / 10);
    const units = value % 10;
    const word =
      value === 100
        ? 'hoʻokahi haneli'
        : value < 10
          ? hawaiianUnits[value]
          : `${hawaiianTens[tens]}${units ? `-kūmā-${hawaiianUnits[units]}` : ''}`;
    return {
      status: 'ok',
      layout: 'words',
      tokens: [{ text: word, lang: 'haw' }],
      explanation: `${value === 100 ? '1 × 100' : value < 10 ? value : `${tens * 10}${units ? ` + ${units}` : ''}`} = ${n}. The -kūmā- construction joins the ten and additional units. Hyphens expose the parts as in the teaching source. These are decimal counting words; kāuna, kaʻau, lau, and mano name traditional object groups separately.`,
    };
  }
  return unsupported('No Polynesian word converter is supplied for this entry.');
}
