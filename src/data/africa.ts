import type { SystemDefinition } from '../lib/types';

const unicodeAfrica = 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/';
const unicodeNumerals = 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-22/';
const digits = (id: string, count = 10) => Array.from({ length: count }, (_, i) => `${id}-${i}`);
const orders = [
  ...Array.from({ length: 9 }, (_, i) => i + 1),
  ...Array.from({ length: 9 }, (_, i) => (i + 1) * 10),
  ...Array.from({ length: 9 }, (_, i) => (i + 1) * 100),
];
const values = (id: string) =>
  orders.map((value) => ({ value, glyph: `${id}-${value}` })).reverse();
const boundedIntegerMax = '9'.repeat(100);

export const africaSystems: SystemDefinition[] = [
  {
    id: 'medefaidrin',
    name: 'Medefaidrin',
    region: 'Africa',
    location: 'Cross River, Nigeria',
    period: '1930s onward',
    era: 'Modern',
    structure: 'Positional',
    baseLabel: 'Base 20',
    summary: 'Twenty digits used in Medefaidrin, a language and script developed in Nigeria.',
    history:
      'Medefaidrin belongs to the Oberi Okaime community in southeastern Nigeria. Its script developed alongside a spiritual language during the early twentieth century. The encoding proposal includes handwritten numerals supplied by Reverend Richmael Ekit in 2016.',
    howItWorks:
      'Use groups of twenty instead of groups of ten. Each digit has its own sign, from zero through nineteen.',
    readingSteps: [
      'Read the positions from the right: ones, twenties, then four hundreds. Moving one position left makes its value twenty times larger.',
      'For 42, the left sign is 2 in the twenties position. Two twenties make 40.',
      'The right sign is 2 in the ones position. Add 40 + 2 = 42.',
      'For 400, use 1 in the four-hundreds position, then two zero signs. The zeros keep the empty twenties and ones positions visible.',
    ],
    caveat:
      'Ordinary digit shapes are used here. Simplified forms of one, two, and three also occur in compound numbers, but community examples establish that they are optional. The 100-digit input limit belongs to this app.',
    engine: 'positional',
    radix: 20,
    min: '0',
    max: boundedIntegerMax,
    zero: true,
    digits: digits('medefaidrin', 20),
    specimen: 42,
    featured: true,
    examples: [
      {
        value: '42',
        explanation: '2 × 20 + 2; documented in the encoding proposal.',
        glyphs: ['medefaidrin-2', 'medefaidrin-2'],
      },
      {
        value: '100',
        explanation: '5 × 20 + 0; documented in the encoding proposal.',
        glyphs: ['medefaidrin-5', 'medefaidrin-0'],
      },
      {
        value: '400',
        explanation: '1 × 20² + 0 × 20 + 0; documented in the encoding proposal.',
        glyphs: ['medefaidrin-1', 'medefaidrin-0', 'medefaidrin-0'],
      },
    ],
    sources: [
      {
        title: 'Rovenchak et al.: Medefaidrin encoding proposal',
        url: 'https://www.unicode.org/L2/L2016/16101-medefaidrin.pdf',
        detail:
          'Section 6; Figures 3–5 and 10. Contemporary community specimens and explicit positional examples.',
      },
    ],
  },
  {
    id: 'mende-kikakui',
    name: 'Mende Kikakui',
    region: 'Africa',
    location: 'Sierra Leone',
    period: 'Early twentieth century',
    era: 'Historical',
    structure: 'Multiplicative',
    baseLabel: 'Decimal units & multipliers',
    summary: 'Right-to-left numerals with subscripts indicating powers of ten.',
    history:
      'Kikakui is an indigenous script for the Mende language. Its numerical repertoire combines nine unit signs with marks for decimal magnitudes and a separate mark for the teens. The numeral arrangement follows the script’s right-to-left reading direction.',
    howItWorks:
      'Read a digit together with the small mark beneath it. That mark changes how much the digit is worth.',
    readingSteps: [
      'A small mark below a digit is called a subscript. The teens mark turns four into fourteen; the tens mark turns two into twenty.',
      'For 27, start with the larger group on the right: two with the tens mark means 20.',
      'The other group contributes seven. Add 20 + 7 = 27.',
      'For 206, the groups mean two hundreds and six ones: 200 + 6 = 206. No zero is inserted for the missing tens. The examples preserve the complete sign combinations.',
    ],
    caveat:
      'This entry offers verified whole-number specimens rather than a general converter. Combining marks must attach to their numeral; displaying a separate multiplier beside it would misrepresent the writing.',
    engine: 'explainer',
    min: '1',
    max: '9999999',
    zero: false,
    specimen: 27,
    examples: [
      { value: '10', explanation: 'One with the tens subscript.', glyphs: ['mende-example-10'] },
      {
        value: '14',
        explanation: 'Four with the distinct teens subscript.',
        glyphs: ['mende-example-14'],
      },
      {
        value: '27',
        explanation: 'Two tens and seven units; the largest unit is on the right.',
        glyphs: ['mende-example-27'],
      },
      {
        value: '206',
        explanation: 'Two hundreds and six units; no zero placeholder is inserted.',
        glyphs: ['mende-example-206'],
      },
      {
        value: '417',
        explanation: 'Four hundreds with seven in the teens, giving 400 + 17.',
        glyphs: ['mende-example-417'],
      },
    ],
    sources: [
      {
        title: 'Unicode: Mende Kikakui number formation',
        url: unicodeAfrica,
        detail: 'Section 19.8, Table 19-6: 10, 14, 27, 206, 417, and 784.',
      },
      {
        title: 'Mende Kikakui character chart',
        url: 'https://www.unicode.org/charts/PDF/U1E800.pdf',
        detail: 'Digits U+1E8C7–U+1E8CF and combining numeral bases U+1E8D0–U+1E8D6.',
      },
    ],
  },
  {
    id: 'bamum',
    name: 'Bamum',
    localName: 'A-ka-u-ku',
    region: 'Africa',
    location: 'Western Cameroon',
    period: 'Modern Phase G forms',
    era: 'Living',
    structure: 'Positional',
    baseLabel: 'Base 10',
    summary: 'Ten signs shared with the Bamum syllabary, used here as decimal digits.',
    history:
      'King Ibrahim Njoya developed Bamum writing through a succession of forms beginning in the late nineteenth century. This collection uses the final, A-ka-u-ku repertoire. Its last ten letters also serve as numerals.',
    howItWorks:
      'In the modern convention shown here, Bamum signs work as decimal digits. Read their positions like familiar groups of ten.',
    readingSteps: [
      'Each sign represents a digit from zero to nine. Read the number from left to right.',
      'For 42, the left digit 4 sits in the tens position. It means four tens, or 40.',
      'The right digit 2 sits in the ones position. Add 40 + 2 = 42.',
      'For 10, use the digit 1 followed by the zero digit. The zero keeps the empty ones position visible. These examples use the modern decimal convention.',
    ],
    caveat:
      'This is the modern decimal convention. Koghom, used here for zero, formerly meant ten. It should not be read as zero when interpreting an earlier Bamum document.',
    engine: 'positional',
    radix: 10,
    min: '0',
    max: boundedIntegerMax,
    zero: true,
    digits: digits('bamum'),
    specimen: 42,
    examples: [
      { value: '9', explanation: 'Kovuu is the modern digit nine.', glyphs: ['bamum-9'] },
      {
        value: '10',
        explanation: 'Modern decimal rendering: one ten and zero units.',
        glyphs: ['bamum-1', 'bamum-0'],
      },
      {
        value: '42',
        explanation: 'Four tens and two units, derived from the documented decimal mapping.',
        glyphs: ['bamum-4', 'bamum-2'],
      },
    ],
    sources: [
      {
        title: 'Unicode: Bamum script and decimal convention',
        url: unicodeAfrica,
        detail: 'Section 19.6, Digits.',
      },
      {
        title: 'Bamum numeral character identities',
        url: 'https://www.unicode.org/charts/PDF/UA6A0.pdf',
        detail: 'U+A6E6–U+A6EF; Koghom’s changed numerical value is explicitly noted.',
      },
    ],
  },
  {
    id: 'ethiopic',
    name: 'Ethiopic',
    localName: 'Geʽez numerals',
    region: 'Africa',
    location: 'Ethiopia & Eritrea',
    period: 'Historical tradition; continuing use',
    era: 'Living',
    structure: 'Multiplicative',
    baseLabel: 'Groups of 100',
    summary: 'Signs for units and tens combine with markers for one hundred and ten thousand.',
    history:
      'The numeral signs form part of the Ethiopic writing tradition. Their barred, letter-like forms are related to Greek and Coptic numeral traditions. They survive alongside familiar decimal digits and have their own rules for composing larger quantities.',
    howItWorks:
      'Think of 2,345 as “23 hundreds, plus 45.” Ethiopic writes how many hundreds there are, then the amount left over.',
    readingSteps: [
      'Learn the building blocks: there are separate signs for 1–9 and for 10, 20, 30, through 90. The hundred marker ፻ means “multiply the amount before me by 100.”',
      'Start with 2,345. Set aside the last two digits, 45. The remaining 23 tells you how many hundreds you have: 23 hundreds make 2,300.',
      'Write 23 with the twenty sign ፳ and the three sign ፫. Together they mean 20 + 3 = 23.',
      'Put the hundred marker after them: ፳፫፻. It applies to the whole 23, so this group means 23 × 100 = 2,300.',
      'Write the leftover 45 with the forty sign ፵ and the five sign ፭. These add 40 + 5 = 45.',
      'Now read the whole numeral ፳፫፻፵፭ as 2,300 + 45 = 2,345.',
      'For 100, write just ፻: the one before it is understood. The separate marker ፼ means 10,000. There is no zero sign; for 105, write ፻፭, meaning 100 + 5, with nothing for the missing tens.',
    ],
    caveat:
      'This converter uses the numeral-only convention, without Amharic words or Geʽez conjunctions. The app supports positive integers through 99,999,999; that limit is not a historical ceiling.',
    engine: 'ethiopic',
    min: '1',
    max: '99999999',
    zero: false,
    specimen: 2345,
    examples: [
      {
        value: '100',
        explanation: 'The hundred marker stands alone; its leading one is implicit.',
        glyphs: ['ethiopic-100'],
      },
      {
        value: '10000',
        explanation: 'Ten-thousand is a distinct marker, equivalent to hundred × hundred.',
        glyphs: ['ethiopic-10000'],
      },
      {
        value: '2345',
        explanation: '(20 + 3) × 100 + 40 + 5; Unicode’s worked example.',
        glyphs: ['ethiopic-20', 'ethiopic-3', 'ethiopic-100', 'ethiopic-40', 'ethiopic-5'],
      },
    ],
    sources: [
      {
        title: 'Geʽez.org: A look at Ethiopic numerals',
        url: 'https://www.geez.org/Numerals/index.html',
        detail: 'Traditional grouping, implicit one, omitted zero, and conversion examples.',
      },
      {
        title: 'Unicode: Ethiopic numbers',
        url: unicodeAfrica,
        detail: 'Section 19.1, Numbers: the worked example 2,345.',
      },
    ],
  },
  {
    id: 'coptic-epact',
    name: 'Coptic epact',
    region: 'Africa',
    location: 'Egypt',
    period: 'Tenth century onward',
    era: 'Historical',
    structure: 'Additive',
    baseLabel: 'Decimal sign-values',
    summary: 'Cursive number signs from Coptic-Arabic manuscripts.',
    history:
      'Epact numerals developed in the Coptic-Arabic community and appear in astronomical and administrative manuscripts. Their forms derive from cursive Coptic letters, but constitute a distinct number repertoire rather than the ordinary Coptic alphabetic numeral convention.',
    howItWorks:
      'Each sign names a whole amount, such as five, twenty, or two hundred. Add the signs to get the number.',
    readingSteps: [
      'There are separate signs for 1–9, 10–90, and 100–900. A two-hundred sign already means 200.',
      'For 205, read the two-hundred sign first: it contributes 200.',
      'Read the five sign next: it contributes 5. Add 200 + 5 = 205.',
      'There are no tens to add, so no tens sign is written. No zero placeholder is needed. Read the signs from left to right, largest first.',
    ],
    caveat:
      'The converter covers 1–999. Larger quantities use a sublinear thousands mark, and manuscripts can add a wavy number mark above the sequence. Those extensions and historical fraction forms are not implemented here.',
    engine: 'additive',
    min: '1',
    max: '999',
    zero: false,
    values: values('coptic-epact'),
    specimen: 205,
    examples: [
      {
        value: '25',
        explanation: 'Twenty followed by five; an explicit proposal example.',
        glyphs: ['coptic-epact-20', 'coptic-epact-5'],
      },
      {
        value: '205',
        explanation: 'Two hundred followed by five; an explicit proposal example.',
        glyphs: ['coptic-epact-200', 'coptic-epact-5'],
      },
      {
        value: '250',
        explanation: 'Two hundred followed by fifty; an explicit proposal example.',
        glyphs: ['coptic-epact-200', 'coptic-epact-50'],
      },
    ],
    sources: [
      {
        title: 'Pandey: Coptic epact encoding proposal',
        url: 'https://www.unicode.org/L2/L2011/11062r-coptic-epact.pdf',
        detail: 'Sections 2 and 4; composite examples 25, 205, 250 and manuscript specimens.',
      },
    ],
  },
  {
    id: 'nko',
    name: 'N’Ko',
    region: 'Africa',
    location: 'Manding communities, West Africa',
    period: '1949 onward',
    era: 'Living',
    structure: 'Positional',
    baseLabel: 'Base 10 · right to left',
    summary: 'Decimal digits written from right to left.',
    history:
      'N’Ko writing was created by Solomana Kanté for Manding languages. Unlike Arabic numbers embedded in Arabic prose, N’Ko numerals follow the right-to-left direction of the surrounding script.',
    howItWorks: 'Use familiar groups of ten, but begin reading the number at the right-hand end.',
    readingSteps: [
      'Each sign is a digit from zero to nine. In this layout, the rightmost digit has the largest place value.',
      'For 42, begin with the 4 on the right. It is in the tens position, so it means four tens: 40.',
      'Move left to the 2 in the ones position. Add 40 + 2 = 42.',
      'A zero keeps an empty position visible. In 100, the rightmost 1 means one hundred, and the two zeros to its left mean no tens and no ones.',
    ],
    caveat:
      'The artwork is arranged in visual reading order; copied Unicode retains most-significant-first logical order. This entry covers cardinal whole numbers, without ordinal diacritics or locale-specific grouping punctuation.',
    engine: 'positional',
    radix: 10,
    min: '0',
    max: boundedIntegerMax,
    zero: true,
    digits: digits('nko'),
    specimen: 144,
    examples: [
      { value: '0', explanation: 'The script has a distinct decimal zero.', glyphs: ['nko-0'] },
      {
        value: '42',
        explanation: 'Four tens at the right, two units at the left.',
        glyphs: ['nko-2', 'nko-4'],
      },
      {
        value: '144',
        explanation: 'One hundred at the right; this value illustrates directionality in Unicode.',
        glyphs: ['nko-4', 'nko-4', 'nko-1'],
      },
    ],
    sources: [
      {
        title: 'N’Ko Institute: script encoding proposal',
        url: 'https://www.nkoinstitute.com/unicode/NKo%20Unicode%20Proposal.htm',
        detail: 'Community-hosted proposal and numeral repertoire.',
      },
      {
        title: 'Unicode: N’Ko digits and directionality',
        url: unicodeAfrica,
        detail: 'Section 19.4, Digits and Figure 19-3.',
      },
    ],
  },
  {
    id: 'vai',
    name: 'Vai',
    region: 'Africa',
    location: 'Liberia & Sierra Leone',
    period: 'Numerals devised in the 1920s',
    era: 'Modern',
    structure: 'Positional',
    baseLabel: 'Base 10',
    summary: 'Decimal digits from the Vai writing system.',
    history:
      'The Vai syllabary is an indigenous West African writing system. A set of ten numeral signs was devised in the 1920s, giving European decimal digits forms compatible with Vai writing. Script-specific numeral identity does not imply a different numerical base.',
    howItWorks: 'The digit shapes are Vai, and the positions work like familiar decimal numbers.',
    readingSteps: [
      'Read from left to right. For a two-digit number, the left digit counts tens and the right digit counts ones.',
      'For 42, the Vai digit 4 on the left means four tens, or 40.',
      'The Vai digit 2 on the right means two ones. Add 40 + 2 = 42.',
      'For 100, write the digit 1 followed by two zero signs. The zeros hold the empty tens and ones positions.',
    ],
    caveat:
      'This entry demonstrates the encoded Vai digit repertoire. Its existence should not be taken to mean that these digits are preferred in every contemporary Vai context; familiar decimal digits are also used.',
    engine: 'positional',
    radix: 10,
    min: '0',
    max: boundedIntegerMax,
    zero: true,
    digits: digits('vai'),
    specimen: 42,
    examples: [
      { value: '0', explanation: 'Vai has an encoded decimal zero.', glyphs: ['vai-0'] },
      {
        value: '42',
        explanation: 'Four tens and two units using the documented decimal digit mapping.',
        glyphs: ['vai-4', 'vai-2'],
      },
      {
        value: '100',
        explanation: 'One hundred and two empty positions.',
        glyphs: ['vai-1', 'vai-0', 'vai-0'],
      },
    ],
    sources: [
      {
        title: 'Everson, Riley and Rivera: Vai encoding proposal',
        url: 'https://www.unicode.org/L2/L2005/05159-n2948-vai.pdf',
        detail: 'Script history and the numeral repertoire.',
      },
      {
        title: 'Vai digit chart',
        url: 'https://www.unicode.org/charts/PDF/UA500.pdf',
        detail: 'U+A620–U+A629, Vai digits zero through nine.',
      },
    ],
  },
  {
    id: 'osmanya',
    name: 'Osmanya',
    region: 'Africa',
    location: 'Somalia',
    period: 'Twentieth century',
    era: 'Modern',
    structure: 'Positional',
    baseLabel: 'Base 10',
    summary: 'Decimal digits from Osman Yusuf Kenadid’s Somali script.',
    history:
      'Osmanya is a writing system devised for Somali in the twentieth century by Osman Yusuf Kenadid. Its character repertoire includes ten decimal digits. The forms preserve the visual identity of this writing tradition while expressing familiar decimal mathematics.',
    howItWorks:
      'Read the Osmanya digits from left to right. Their positions count hundreds, tens, and ones just as in familiar decimal notation.',
    readingSteps: [
      'For 105, identify the three digits: 1, 0, and 5, written with Osmanya signs.',
      'The left digit is in the hundreds position. One hundred contributes 100.',
      'The middle digit is in the tens position. Zero means there are no tens to add.',
      'The right digit contributes five ones. Add 100 + 0 + 5 = 105. Keep the zero: without it, the digits would mean 15.',
    ],
    caveat:
      'This converter uses the encoded Osmanya digits for nonnegative whole numbers. It demonstrates a script-specific decimal repertoire rather than claiming that Somali counting has a different base.',
    engine: 'positional',
    radix: 10,
    min: '0',
    max: boundedIntegerMax,
    zero: true,
    digits: digits('osmanya'),
    specimen: 105,
    examples: [
      { value: '0', explanation: 'Osmanya digit zero, U+104A0.', glyphs: ['osmanya-0'] },
      { value: '42', explanation: 'Four tens and two units.', glyphs: ['osmanya-4', 'osmanya-2'] },
      {
        value: '105',
        explanation: 'One hundred, no tens, and five units.',
        glyphs: ['osmanya-1', 'osmanya-0', 'osmanya-5'],
      },
    ],
    sources: [
      {
        title: 'Osmanya numeral repertoire',
        url: 'https://www.unicode.org/charts/PDF/U10480.pdf',
        detail: 'U+104A0–U+104A9: the decimal digits.',
      },
      {
        title: 'Everson: Osmanya encoding proposal',
        url: 'https://www.unicode.org/wg2/docs/n2361.pdf',
        detail: 'Script history and structure.',
      },
    ],
  },
  {
    id: 'yoruba',
    name: 'Yorùbá',
    region: 'Africa',
    location: 'Nigeria, Benin & diaspora',
    period: 'Continuing spoken tradition',
    era: 'Living',
    structure: 'Spoken',
    baseLabel: 'Twenties · addition & subtraction',
    summary:
      'Number words built around twenties, including subtraction: fifteen is twenty minus five.',
    history:
      'Yorùbá numeration is a spoken language tradition, not an extinct set of written numeral glyphs. Its number names carry mathematical relationships, including multiples of twenty and subtraction from a nearby larger value. Tone marks and underdots belong to the spelling.',
    howItWorks:
      'Some Yorùbá number expressions build on groups of twenty. Work out whether the expression adds to a group or takes away from it.',
    readingSteps: [
      'Begin with Ogún, meaning twenty.',
      'The example for fifteen describes taking five away from twenty. Start at 20 and take away 5: 20 − 5 = 15.',
      'Ogójì means forty: think of two groups of twenty, 20 + 20 = 40.',
      'These are selected language examples. The words used for counting in sequence can differ from those used for counting objects, so keep the example’s wording and context together.',
    ],
    caveat:
      'These are selected language examples with source orthography preserved, not a general translator. Pronunciation, dialect, tone marking, and noun context matter; abstract number names are shown here.',
    engine: 'explainer',
    min: '1',
    max: '100',
    zero: false,
    specimen: 15,
    examples: [
      {
        value: '2',
        words: 'Èjì',
        explanation: 'Abstract counting form for two; counting objects uses Méjì.',
      },
      {
        value: '3',
        words: 'Ẹ̀ta',
        explanation: 'Abstract counting form for three; counting objects uses Mẹ́ta.',
      },
      {
        value: '15',
        words: 'Ẹ́ẹ̀dógún',
        explanation: 'Five taken from twenty, 20 − 5; source spelling retained.',
      },
      { value: '20', words: 'Ogún', explanation: 'Twenty, the important score-sized grouping.' },
      { value: '40', words: 'Ogójì', explanation: 'Two twenties: 20 × 2.' },
    ],
    sources: [
      {
        title: 'LedeYoruba: number words and counting contexts',
        url: 'https://www.ledeyoruba.com/learn/yoruba-numbers/',
        detail:
          'Community language teaching resource: words, tone marks, counting-object forms, and additive/subtractive explanations.',
      },
    ],
  },
  {
    id: 'egyptian',
    name: 'Egyptian hieroglyphic',
    region: 'Africa',
    location: 'Nile Valley, Egypt',
    period: 'Ancient Egyptian monumental tradition',
    era: 'Ancient',
    structure: 'Additive',
    baseLabel: 'Powers of 10',
    summary: 'Repeated signs represent units, tens, and higher powers of ten.',
    history:
      'Egyptian hieroglyphic notation represents quantities with dedicated signs for powers of ten. The forms include a stroke, a heel-bone shape, a coil of rope, and a lotus. This entry follows the monumental hieroglyphic tradition rather than the separate cursive hieratic numeral repertoire.',
    howItWorks:
      'Each kind of sign has a fixed value. Count the signs of each kind, then add the totals.',
    readingSteps: [
      'A unit stroke means 1, a ten sign means 10, and a lotus sign means 1,000. Each kind can be repeated up to nine times in this layout.',
      'For 42, count the four ten signs: four tens make 40.',
      'Count the two unit strokes: two ones make 2.',
      'Add 40 + 2 = 42. A lotus alone means 1,000. Because the signs carry their own values, missing amounts need no zero placeholder.',
    ],
    caveat:
      'The display uses a consistent descending row for comparison. Historical inscriptions also arrange signs in compact groups and can reverse their direction. Fractions and the different hieratic notation are outside this converter.',
    engine: 'additive',
    min: '1',
    max: '9999999',
    zero: false,
    values: [1000000, 100000, 10000, 1000, 100, 10, 1].map((value) => ({
      value,
      glyph: `egyptian-${value}`,
    })),
    specimen: 42,
    examples: [
      {
        value: '7',
        explanation: 'Seven repeated unit strokes.',
        glyphs: Array(7).fill('egyptian-1'),
      },
      {
        value: '42',
        explanation: 'Four tens and two units.',
        glyphs: [...Array(4).fill('egyptian-10'), ...Array(2).fill('egyptian-1')],
      },
      {
        value: '1000',
        explanation: 'One lotus sign represents one thousand.',
        glyphs: ['egyptian-1000'],
      },
    ],
    sources: [
      {
        title: 'UCL Researchers in Museums: Egyptian mathematics',
        url: 'https://blogs.ucl.ac.uk/researchers-in-museums/2017/10/',
        detail: 'Additive notation and repeated unit strokes; distinction from hieratic digits.',
      },
      {
        title: 'Unicode: Egyptian hieroglyph identities',
        url: 'https://www.unicode.org/charts/PDF/U13000.pdf',
        detail: 'Gardiner Z1, V20, V1, M12, D50, I8 and C11.',
      },
    ],
  },
  {
    id: 'rumi',
    name: 'Rumi',
    localName: 'Fasi numerals',
    region: 'Africa',
    location: 'Maghreb, Egypt & al-Andalus',
    period: 'Tenth–seventeenth centuries',
    era: 'Historical',
    structure: 'Additive',
    baseLabel: 'Decimal sign-values',
    summary: 'Manuscript signs for units, tens, and hundreds.',
    history:
      'Rumi numerals, also called Fasi, belong to a manuscript tradition spanning North Africa and al-Andalus. They appear in accounting, astronomy, and manuscript numbering. Their historical shapes vary; this collection follows the variant represented in the Unicode Rumi repertoire.',
    howItWorks:
      'Read each sign as a complete amount, then add. A sign for forty already contributes forty.',
    readingSteps: [
      'Choose signs for the hundreds, tens, and ones that are present in the number.',
      'For 42, the forty sign contributes 40 and the two sign contributes 2. Add 40 + 2 = 42.',
      'For 205, the two-hundred sign contributes 200 and the five sign contributes 5.',
      'Add 200 + 5 = 205. There are no tens, so leave out the tens sign; there is no zero sign between the other two.',
    ],
    caveat:
      'This converter covers positive integers from 1 to 999 in descending sign-value order. The broader tradition includes fractional signs and manuscript-specific conventions that this app does not yet render.',
    engine: 'additive',
    min: '1',
    max: '999',
    zero: false,
    values: values('rumi'),
    specimen: 42,
    examples: [
      {
        value: '42',
        explanation: 'The sign valued forty plus the sign valued two.',
        glyphs: ['rumi-40', 'rumi-2'],
      },
      {
        value: '205',
        explanation: 'Two hundred plus five; no sign for zero is needed.',
        glyphs: ['rumi-200', 'rumi-5'],
      },
      {
        value: '999',
        explanation: 'Nine hundred plus ninety plus nine.',
        glyphs: ['rumi-900', 'rumi-90', 'rumi-9'],
      },
    ],
    sources: [
      {
        title: 'Unicode: Rumi numeral symbols',
        url: unicodeNumerals,
        detail: 'Section 22.3.6: historical range, manuscript uses, and the chosen variant.',
      },
      {
        title: 'Rumi numeral chart',
        url: 'https://www.unicode.org/charts/PDF/U10E60.pdf',
        detail: 'Signs for 1–9, 10–90, 100–900 and four fractions.',
      },
    ],
  },
];
