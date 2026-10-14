import type { SystemDefinition } from '../lib/types';

export const oceaniaSystems: SystemDefinition[] = [
  {
    id: 'mangarevan',
    name: 'Mangarevan',
    region: 'Oceania',
    location: 'Mangareva, Gambier Islands, French Polynesia',
    period: 'Traditional object-specific counting, documented in the 19th–20th centuries',
    era: 'Historical',
    structure: 'Mixed',
    baseLabel: 'Decimal with binary steps',
    summary:
      'Spoken counting with groups of 10, 20, 40, and 80. The counting unit depends on the object.',
    history:
      'Bender and Beller’s 2013 analysis draws especially on Te Rangi Hiroa’s ethnography. The specialized system counted valued goods alongside an ordinary decimal system; it was not a universal replacement for decimal counting.',
    howItWorks:
      'Takau, paua, tataua and varu name 10, 20, 40 and 80 counting units. Two units at one of these levels regroup into the next. The basic unit, tauga, depends on the commodity: one turtle, two fish, four coconuts, or eight octopuses.',
    caveat:
      'Examples mean counting units, not automatically individual objects. The displayed words are verbal forms, not an ancient script. Historical accounts differ; this exhibit follows the variant analyzed by Bender and Beller.',
    engine: 'explainer',
    min: '1',
    max: '799',
    zero: false,
    specimen: 40,
    featured: true,
    examples: [
      {
        value: '10',
        words: 'takau',
        explanation: '10 counting units; for fish counted in pairs, this represents 20 fish.',
      },
      {
        value: '20',
        words: 'paua',
        explanation: '20 counting units = two takau. The basic unit still depends on the object.',
      },
      { value: '40', words: 'tataua', explanation: '40 counting units = two paua = four takau.' },
      {
        value: '80',
        words: 'varu',
        explanation:
          '80 counting units = two tataua. In the unit range, varu also means eight; context distinguishes the meanings.',
      },
      {
        value: '273',
        words: 'toru varu paua takau toru',
        explanation:
          '3 × 80 + 20 + 10 + 3 = 273 counting units; an example given in the research paper.',
      },
    ],
    sources: [
      {
        title:
          'Bender & Beller · Mangarevan invention of binary steps for easier calculation (2013)',
        url: 'https://math.hawaii.edu/~tom/ethnomathematics/PNAS-2013.pdf',
        detail:
          'Table 1, mixed-system construction and object-dependent tauga on page 3; worked 273 example on page 4. DOI: 10.1073/pnas.1309160110.',
      },
    ],
  },
  {
    id: 'maori',
    name: 'Māori',
    localName: 'Te reo Māori',
    region: 'Oceania',
    location: 'Aotearoa New Zealand',
    period: 'Contemporary number words, with historical counting variation',
    era: 'Living',
    structure: 'Spoken',
    baseLabel: 'Decimal number words',
    summary:
      'Contemporary Māori number words: rua tekau means two tens; mā joins additional units.',
    history:
      'Modern counting belongs to a living language. Earlier practices cannot simply be read back from today’s terminology: Te Aka records that tekau, now ten, originally denoted twenty, as related forms still do in other eastern Polynesian languages.',
    howItWorks:
      'The examples use contemporary cardinal forms. Tekau mā rua combines ten and two; rua tekau combines two and ten. Context can add particles or change how a number is used in a sentence, so isolated counting words are shown here.',
    caveat:
      'This exhibit does not claim a separate ancient Māori numeral alphabet. Historical pair counting and contemporary decimal counting should be distinguished. Macrons are part of the spelling.',
    engine: 'explainer',
    min: '1',
    max: '99',
    zero: false,
    specimen: 12,
    examples: [
      {
        value: '11',
        words: 'tekau mā tahi',
        explanation: 'Ten and one, a contemporary Māori counting form.',
      },
      {
        value: '12',
        words: 'tekau mā rua',
        explanation: 'Ten and two; this complete expression is documented in Te Aka.',
      },
      {
        value: '15',
        words: 'tekau mā rima',
        explanation: 'Ten and five, with mā joining the additional units.',
      },
      {
        value: '20',
        words: 'rua tekau',
        explanation:
          'Two tens in contemporary counting. This should not be confused with historical meanings of tekau.',
      },
    ],
    sources: [
      {
        title: 'Te Aka Māori Dictionary · tekau',
        url: 'https://maoridictionary.co.nz/search?keywords=tekau',
        detail:
          'Contemporary meaning, historical twenty meaning, and the documented compounds twelve and fifteen.',
      },
      {
        title: 'New Zealand History · A Māori word a day',
        url: 'https://nzhistory.govt.nz/culture/maori-language-week/365-maori-words',
        detail: 'Community-language learning list including eleven and twenty.',
      },
    ],
  },
  {
    id: 'hawaiian',
    name: 'Hawaiian',
    localName: 'ʻŌlelo Hawaiʻi',
    region: 'Oceania',
    location: 'Hawaiian Islands',
    period: 'Traditional grouping vocabulary in a living language',
    era: 'Living',
    structure: 'Spoken',
    baseLabel: 'Contextual grouping terms',
    summary: 'Grouping terms include kāuna (4), kaʻau (40), and lau (400).',
    history:
      'ʻŌlelo Online teaches these terms for grouping objects, distinguishing a group name from a number, much as English distinguishes a dozen from twelve.',
    howItWorks:
      'The exhibit presents the documented grouping values 4, 40, 400 and 4,000. A group label describes the collection being counted. Larger traditional expressions can also carry a sense of abundance rather than a strictly numerical value in every context.',
    caveat:
      'These are selected grouping terms, not general number translations or written numeral glyphs. The ʻokina and kahakō are meaningful parts of Hawaiian spelling.',
    engine: 'explainer',
    min: '4',
    max: '4000',
    zero: false,
    specimen: 40,
    examples: [
      { value: '4', words: 'kāuna', explanation: 'A grouping of four objects.' },
      {
        value: '40',
        words: 'kaʻau',
        explanation:
          'A grouping of forty; this is a traditional group name, not a positional digit.',
      },
      {
        value: '400',
        words: 'lau',
        explanation:
          'The conventional grouping value four hundred; usage can also evoke abundance.',
      },
      {
        value: '4000',
        words: 'mano',
        explanation:
          'The conventional grouping value four thousand; context matters for larger grouping terms.',
      },
    ],
    sources: [
      {
        title: 'ʻŌlelo Online · Traditional Hawaiian Number Groups',
        url: 'https://oleloonline.com/0503v-traditional-hawaiian-number-groups/',
        detail:
          'Teacher-led explanation of kāuna, kaʻau, lau, mano and the distinction between grouping and ordinary counting.',
      },
    ],
  },
  {
    id: 'oksapmin',
    name: 'Oksapmin body counting',
    region: 'Oceania',
    location: 'Oksapmin area, central New Guinea, Papua New Guinea',
    period: 'Traditional practice; ethnographic studies from 1978 onward',
    era: 'Living',
    structure: 'Physical',
    baseLabel: '27 body positions',
    summary: 'A 27-position body count, from one thumb to the opposite little finger.',
    history:
      'Geoffrey Saxe’s field research documents both the counting practice and its changes through trade, currency and schooling. Traditional enumeration and later arithmetic strategies are related but historically distinct uses of the same body sequence.',
    howItWorks:
      'The first thumb is position 1, the nose is 14, and the other little finger is 27. Either side can begin the count. Completion may be marked by raised fists and the expression tit fu!, while extensions beyond one traversal follow additional conventions.',
    caveat:
      'Twenty-seven positions do not make this a positional base-27 numeral notation. The diagrams are modern teaching illustrations of documented gestures, not historical written glyphs. This exhibit limits its interactive examples to the first traversal.',
    engine: 'explainer',
    min: '1',
    max: '27',
    zero: false,
    specimen: 14,
    examples: [
      {
        value: '1',
        words: 'thumb · first side',
        glyphs: ['oksapmin-1'],
        explanation: 'Begin at the thumb of either hand. The direction of travel is not fixed.',
      },
      {
        value: '14',
        words: 'nose · aruma',
        glyphs: ['oksapmin-14'],
        explanation:
          'The nose marks the midpoint, after the first eye and before the eye on the other side.',
      },
      {
        value: '27',
        words: 'little finger · other side',
        glyphs: ['oksapmin-27'],
        explanation:
          'Finish on the opposite little finger. A completed traversal may be acknowledged with raised fists and tit fu!',
      },
    ],
    sources: [
      {
        title: 'Geoffrey Saxe · Oksapmin Counting System',
        url: 'https://culturecognition.com/new-page-3',
        detail:
          'Researcher’s diagram and field video; direction, the 27 positions, completion gesture and extensions are explained.',
      },
    ],
  },
];
