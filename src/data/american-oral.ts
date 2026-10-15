import type { SystemDefinition } from '../lib/types';

export const americanOralSystems: SystemDefinition[] = [
  {
    id: 'cherokee',
    name: 'Sequoyah’s Cherokee numerals',
    region: 'Americas',
    location: 'Cherokee Nation, southeastern North America',
    period: 'Proposed by Sequoyah in the late 1820s',
    era: 'Historical',
    structure: 'Additive',
    baseLabel: 'Distinct numerical signs',
    summary:
      'Number signs proposed by Sequoyah in the late 1820s, separate from the Cherokee syllabary.',
    history:
      'The numeral proposal did not enter general use. The Cherokee Nation preserves its forms in an educational poster covering zero to one hundred, while Unicode notes that Sequoyah’s numerical signs are not encoded in the standard.',
    howItWorks:
      'Read the selected original numeral signs using the Cherokee Nation chart. For forty-two, combine two signs and add their values.',
    readingSteps: [
      'First identify the dedicated forty sign. It represents all forty, rather than just the digit four.',
      'Next identify the separate two sign.',
      'Put forty followed by two: add 40 + 2 = 42.',
      'The examples for 1, 2, and 3 each use a single original numeral sign. These selected chart examples do not supply a general rule for every number.',
    ],
    caveat:
      'This is a bounded specimen exhibit, not a full reconstruction of every arithmetic convention. The signs have no Unicode copy equivalent. Their historical status does not describe contemporary Cherokee language vitality or contemporary number-writing practice.',
    engine: 'explainer',
    min: '0',
    max: '100',
    zero: true,
    specimen: 42,
    examples: [
      {
        value: '1',
        glyphs: ['cherokee-1'],
        explanation:
          'Sequoyah’s original sign for one, following the Cherokee Nation’s original-numbers chart.',
      },
      {
        value: '2',
        glyphs: ['cherokee-2'],
        explanation:
          'The original sign for two; this is a numerical sign, not a Cherokee syllabary letter.',
      },
      {
        value: '3',
        glyphs: ['cherokee-3'],
        explanation:
          'The original sign for three preserves a long diagonal and a distinctive curved branch.',
      },
      {
        value: '40',
        glyphs: ['cherokee-40'],
        explanation: 'The separate sign for forty shown in the Cherokee Nation chart.',
      },
      {
        value: '42',
        glyphs: ['cherokee-40', 'cherokee-2'],
        explanation:
          'Forty followed by two, matching the composition shown for forty-two in the original-numbers chart.',
      },
    ],
    sources: [
      {
        title: 'Cherokee Nation · Sequoyah’s Original Numbers 0–100',
        url: 'https://language.cherokee.gov/media/541f3lhk/sequoyah_original_numbers_updated.pdf',
        detail:
          'Primary community educational chart used to verify the selected numerical forms and forty-two composition.',
      },
      {
        title: 'Unicode Standard · Cherokee',
        url: 'https://unicode.org/versions/Unicode17.0.0/core-spec/chapter-20/',
        detail:
          'Distinguishes the unadopted, unencoded numerical invention from the encoded Cherokee syllabary.',
      },
    ],
  },
  {
    id: 'choctaw',
    name: 'Choctaw',
    localName: 'Chahta',
    region: 'Americas',
    location: 'Choctaw communities, southeastern North America and Oklahoma',
    period: 'Contemporary Choctaw Nation teaching orthography',
    era: 'Living',
    structure: 'Spoken',
    baseLabel: 'Decimal number words',
    summary:
      'The first five counting words, using the Choctaw Nation of Oklahoma’s teaching spelling.',
    history:
      'The examples use the counting words taught in the Choctaw Nation of Oklahoma’s language lessons.',
    howItWorks:
      'Learn each counting word as the name of a whole quantity, just as “two” names a quantity in English.',
    readingSteps: [
      'Achʋffa means one, and tuklo means two. Each complete word names its amount.',
      'Tuchina means three, ushta means four, and tahlapi means five.',
      'To read tuklo, recognize the whole word and match it to 2. You do not add the individual letters.',
      'This introductory set covers one through five using the community teaching source’s spelling, including ʋ. It does not provide a rule for translating larger numbers.',
    ],
    caveat:
      'The interactive specimens cover five verified words, not the full productive Choctaw number system. Spelling varies across sources and communities. The selected forms follow the named community source rather than blending alternative spellings into a new standardized form.',
    engine: 'explainer',
    min: '1',
    max: '5',
    zero: false,
    specimen: 3,
    examples: [
      {
        value: '1',
        words: 'achʋffa',
        explanation: 'One, using the Choctaw Nation of Oklahoma’s teaching spelling.',
      },
      {
        value: '2',
        words: 'tuklo',
        explanation: 'Two. This is a number word, not an additive pair of symbols.',
      },
      { value: '3', words: 'tuchina', explanation: 'Three, as listed in the community lesson.' },
      { value: '4', words: 'ushta', explanation: 'Four, an independent counting word.' },
      {
        value: '5',
        words: 'tahlapi',
        explanation: 'Five, completing the selected community-sourced introductory set.',
      },
    ],
    sources: [
      {
        title: 'Choctaw Nation of Oklahoma · Choctaw 1, Chapter Two, Lesson 1',
        url: 'https://www.choctawnation.com/lessons/choctaw-1/chapter-2/lesson-1/',
        detail: 'Community lesson explicitly lists one through five.',
      },
      {
        title: 'Choctaw Nation Dictionary · The Choctaw Alphabet',
        url: 'https://dictionary.choctawnation.com/alphabet/',
        detail: 'Explains the letter ʋ and the existence of spelling variation.',
      },
    ],
  },
  {
    id: 'navajo',
    name: 'Diné / Navajo',
    localName: 'Diné bizaad',
    region: 'Americas',
    location: 'Navajo Nation, southwestern North America',
    period: 'Contemporary Diné College learning forms',
    era: 'Living',
    structure: 'Spoken',
    baseLabel: 'Decimal number words',
    summary: 'Decimal number words, using forms documented by Diné College.',
    history:
      'The examples follow the number words and spelling in the reference guide published by Diné College’s Learning Center.',
    howItWorks:
      'Read the complete number expression, then identify its tens and ones. These examples preserve the Diné College guide’s wording.',
    readingSteps: [
      'Begin with naaki, meaning two, and naadiin, meaning twenty.',
      'For naadiin naaki, read twenty followed by two: 20 + 2 = 22.',
      'For dízdiin dóó bi’aan naaki, read dízdiin as forty. The linking expression dóó bi’aan connects it to the final naaki, or two.',
      'Add 40 + 2 = 42. The guide uses this linking expression from thirty upward; its twenty-two example joins the words without it. Keep the documented phrases rather than assembling unfamiliar forms yourself.',
    ],
    caveat:
      'These are authentic written number words, not an invented Navajo numeral script. Accent marks, ł and apostrophes matter. The exhibit offers selected verified examples rather than claiming complete coverage of the language’s grammatical or spelling variation.',
    engine: 'explainer',
    min: '1',
    max: '100',
    zero: false,
    specimen: 42,
    examples: [
      {
        value: '1',
        words: 't’ááłá’í',
        explanation: 'One, in the Diné College reference guide’s spelling.',
      },
      { value: '2', words: 'naaki', explanation: 'Two, a basic counting word.' },
      {
        value: '3',
        words: 'táá’',
        explanation: 'Three, preserving the guide’s vowel accents and apostrophe.',
      },
      {
        value: '22',
        words: 'naadiin naaki',
        explanation: 'Twenty and two. The guide gives this form without dóó bi’aan.',
      },
      {
        value: '42',
        words: 'dízdiin dóó bi’aan naaki',
        explanation:
          'Forty followed by the linking expression and two, exactly as documented by Diné College.',
      },
      {
        value: '100',
        words: 't’ááłá’ídi neeznádiin',
        explanation: 'One hundred, using the guide’s documented compound.',
      },
    ],
    sources: [
      {
        title: 'Diné College Learning Center · Navajo Numbering System',
        url: 'https://warriorweb.dinecollege.edu/ICS/Portlets/ICS/Portlet.Resources/ViewHandler.ashx?id=082af43e-c530-4f62-832f-369283e05afc',
        detail:
          'Community educational reference with unit forms, tens, compounds and an explicit list from one to one hundred.',
      },
    ],
  },
];
