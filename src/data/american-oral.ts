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
    summary: 'Build number words from one through one hundred using Choctaw Nation teaching forms.',
    history:
      'The counting words follow Choctaw Nation of Oklahoma language lessons. Its October 2018 Biskinik teaching chart documents the teens and compounds through thirty-one; additional Nation lessons and translated reports document the multiplied tens and hundred expression.',
    howItWorks:
      'Name 1–10 with whole counting words. For 11–19, put awah before the unit. For 20–90, put pokoli before the number of tens, then add akocha and a unit when needed. Tahlepa achʋffa names one hundred.',
    readingSteps: [
      'Achʋffa means one, and tuklo means two. Each complete word names its amount.',
      'Tuchina means three, ushta means four, and tahlapi means five.',
      'Continue with hannali (six), untuklo (seven), untuchina (eight), chakkali (nine), and pokkoli (ten).',
      'For twelve, put awah before tuklo: awah tuklo names 10 + 2. Unlike the larger tens compounds, the teens do not use akocha.',
      'Pokoli tuklo means two tens, or 10 × 2 = 20. The ten word is pokoli in these compounds, with one k, rather than the isolated pokkoli.',
      'To name twenty-six, append akocha hannali: pokoli tuklo akocha hannali gives 10 × 2 + 6 = 26. The same tens-and-units pattern generates the remaining numbers through ninety-nine.',
      'Tahlepa achʋffa names one hundred. The converter accepts every whole number from 1 through 100.',
    ],
    caveat:
      'This bounded converter follows Choctaw Nation teaching words and the 2018 chart’s akocha spelling; contemporary Nation publications also use akucha. The chart’s v in achvffa is shown as ʋ, following the Nation’s teaching alphabet. These are living-language counting forms, not an ancient numeral script. The range 1–100 is an app limit; other spelling, dialect, object-counting and larger-number conventions are outside this display.',
    engine: 'spoken',
    min: '1',
    max: '100',
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
        explanation: 'Five, an independent counting word in the community lesson.',
      },
      { value: '6', words: 'hannali', explanation: 'Six, from Chapter Two, Lesson 2.' },
      { value: '7', words: 'untuklo', explanation: 'Seven, from the same community lesson.' },
      { value: '8', words: 'untuchina', explanation: 'Eight, preserving the teaching spelling.' },
      { value: '9', words: 'chakkali', explanation: 'Nine, as given in the community lesson.' },
      {
        value: '10',
        words: 'pokkoli',
        explanation: 'Ten as an isolated counting word; multiplied tens use pokoli.',
      },
      {
        value: '12',
        words: 'awah tuklo',
        explanation: 'The teen form puts awah before two: 10 + 2 = 12.',
      },
      {
        value: '26',
        words: 'pokoli tuklo akocha hannali',
        explanation:
          'Ten times two, plus six: 10 × 2 + 6 = 26, as in the Nation’s 2018 counting chart.',
      },
      {
        value: '56',
        words: 'pokoli tahlapi akocha hannali',
        explanation: 'Ten times five, followed by akocha and six: 10 × 5 + 6 = 56.',
      },
      {
        value: '90',
        words: 'pokoli chakkali',
        explanation: 'Nine tens, documented in Choctaw 2, Chapter Ten, Lesson 2.',
      },
      {
        value: '100',
        words: 'tahlepa achʋffa',
        explanation:
          'One hundred, using the Nation’s documented hundred expression and teaching alphabet.',
      },
    ],
    sources: [
      {
        title: 'Choctaw Nation of Oklahoma · Choctaw 1, Chapter Two, Lesson 1',
        url: 'https://www.choctawnation.com/lessons/choctaw-1/chapter-2/lesson-1/',
        detail: 'Community lesson explicitly lists one through five.',
      },
      {
        title: 'Choctaw Nation of Oklahoma · Choctaw 1, Chapter Two, Lesson 2',
        url: 'https://www.choctawnation.com/lessons/choctaw-1/chapter-2/lesson-2/',
        detail: 'Community lesson explicitly lists six through ten.',
      },
      {
        title: 'Choctaw Nation Dictionary · The Choctaw Alphabet',
        url: 'https://dictionary.choctawnation.com/alphabet/',
        detail: 'Explains the letter ʋ and the existence of spelling variation.',
      },
      {
        title: 'Choctaw Nation · Biskinik, October 2018, counting chart',
        url: 'https://www.choctawnation.com/wp-content/uploads/2022/06/oct-2018-biskinik.pdf',
        detail:
          'Community teaching chart explicitly lists 1–31, including awah teens, pokoli multiplied tens and akocha compounds.',
      },
      {
        title: 'Choctaw Nation · Choctaw 2, Chapter Ten, Lesson 2',
        url: 'https://www.choctawnation.com/lessons/choctaw-2/chapter-10/lesson-2/',
        detail: 'Documents pokoli chakkali as ninety in a translated teaching sentence.',
      },
      {
        title: 'Choctaw Nation · 2025 year-end report in English and Choctaw',
        url: 'https://www.choctawnation.com/news/chiefs-blog/choctaw-nation-bids-a-fond-chi-pisa-la-chike-to-2025/',
        detail:
          'Community parallel text documents tens and tahlepa achvffa for one hundred; its connector variant is akucha.',
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
      'The converter covers every whole number from 1 through 100 in the Diné College guide’s wording. Teens put the unit before ts’áadah. Twenty compounds join a unit directly; compounds from thirty upward use dóó bi’aan between the tens and units.',
    readingSteps: [
      'Learn the ten unit names in the dictionary, preserving accents, nasal vowels such as į́ and ą́, ł, and apostrophes.',
      'Begin with naaki, meaning two, and naadiin, meaning twenty.',
      'The teens use the unit followed by ts’áadah: naaki ts’áadah gives 12. Eleven uses the short unit form ła’: ła’ ts’áadah.',
      'For naadiin naaki, read twenty followed by two: 20 + 2 = 22.',
      'Twenty-one uses the same short one form as eleven: naadiin ła’. The guide uses t’ááłá’í for the added one from thirty-one onward.',
      'For dízdiin dóó bi’aan naaki, read dízdiin as forty. The linking expression dóó bi’aan connects it to the final naaki, or two.',
      'Add 40 + 2 = 42. Follow this tens-linker-units pattern through ninety-nine, using the complete tens forms in the dictionary rather than attaching a suffix to an unchanged unit word.',
      'T’ááłá’ídi neeznádiin is the guide’s documented expression for one hundred.',
    ],
    caveat:
      'These are living-language counting words. This converter follows the Diné College guide’s complete 1–100 list, including its separate-word spacing and linking conventions; other sources can write contracted forms or use different conventions. Nasal vowels, accents, ł and apostrophes matter. The range 1–100 is an app limit and does not claim complete coverage of grammatical or spelling variation.',
    engine: 'spoken',
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
      { value: '10', words: 'neeznáá', explanation: 'Ten, in the Diné College guide’s spelling.' },
      {
        value: '11',
        words: 'ła’ ts’áadah',
        explanation: 'The short one form followed by the teen element: 1 + 10 = 11.',
      },
      {
        value: '12',
        words: 'naaki ts’áadah',
        explanation: 'Two followed by the teen element: 10 + 2 = 12.',
      },
      { value: '20', words: 'naadiin', explanation: 'Twenty, the guide’s complete tens form.' },
      {
        value: '21',
        words: 'naadiin ła’',
        explanation: 'Twenty plus the short one form, preserving the guide’s wording.',
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
        value: '56',
        words: 'ashdladiin dóó bi’aan hastą́ą́',
        explanation:
          'Fifty followed by the linking expression and six: 50 + 6 = 56. Preserve the nasal vowels in hastą́ą́.',
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
