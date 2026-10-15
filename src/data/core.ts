import type { SystemDefinition } from '../lib/types';
const unicode = {
  title: 'Unicode 17 — Numerals',
  url: 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-22/',
};
const kaktovik = {
  title: 'Kaktovik numeral proposal (Marín Silva, Miller & Strand, 2021)',
  url: 'https://www.unicode.org/L2/L2021/21058-kaktovik-numerals.pdf',
  detail: 'Design, community history, digit chart, and place-value examples, pp. 1–4.',
};
const mexica = {
  title: 'University of Oregon — Nahua Glyphs: Numbers',
  url: 'https://blogs.uoregon.edu/nahuaglyphs/numbers/',
  detail: 'Numerical signs in the Codex Mendoza and Matrícula de Tributos.',
};
const khipu = {
  title: 'Smarthistory — The Inka khipu (Dr. Sarahh Scher)',
  url: 'https://smarthistory.org/inka-khipu/',
  detail: 'Documented decimal knot types and the worked example 135.',
};
const king = {
  title: 'David A. King — The Ciphers of the Monks (2001)',
  url: 'https://books.google.com/books?id=PapljPXaSbwC',
  detail: 'Comparative historical study of monastic numeral variants.',
};
export const coreSystems: SystemDefinition[] = [
  {
    id: 'kaktovik',
    name: 'Kaktovik Iñupiaq',
    localName: 'Kaktovik',
    region: 'Americas',
    location: 'Kaktovik, Alaska',
    period: '1994–present',
    era: 'Modern',
    structure: 'Positional',
    baseLabel: 'Base 20 · groups of 5',
    summary:
      'A base-20 system created by students in Kaktovik, Alaska, in 1994. Digit strokes group units and fives.',
    history:
      'In 1994, students at Harold Kaveolook School in Kaktovik developed numeral signs that fit their language’s groups of five and twenty. The signs became part of local teaching and received the endorsement of the Inuit Circumpolar Council in 1998. They are a modern Indigenous invention, rather than an ancient script.',
    howItWorks:
      'Think in groups of twenty. A sign’s shape gives its digit, and its position tells you how much that digit is worth.',
    readingSteps: [
      'First read one digit: each horizontal stroke adds five, and each downward stroke adds one. Three fives and four ones make the digit 19.',
      'Look at the positions from the right: ones, then twenties, then four hundreds. Each position is worth twenty times the previous one.',
      'To read 42, start with the left digit 2 in the twenties position: two groups of twenty make 40.',
      'The right digit 2 adds two ones. Add 40 + 2 = 42. A zero sign holds any empty position; 20 is one twenty followed by zero ones.',
    ],
    caveat:
      'These are Kaktovik numerals, not a universal Inuit writing system. This converter currently renders whole numbers; the documented fractional notation is not implemented.',
    engine: 'positional',
    radix: 20,
    digits: Array.from({ length: 20 }, (_, i) => `kaktovik-${i}`),
    min: '0',
    max: '9'.repeat(100),
    zero: true,
    specimen: 42,
    featured: true,
    examples: [
      { value: '19', explanation: 'Three fives and four units form a single digit.' },
      { value: '20', explanation: 'One twenty and zero units: the first two-position number.' },
      { value: '42', explanation: '2 × 20 + 2 = 42.' },
      { value: '400', explanation: '1 × 20² + 0 × 20 + 0.' },
    ],
    sources: [kaktovik, unicode],
  },
  {
    id: 'maya',
    name: 'Maya',
    region: 'Americas',
    location: 'Mesoamerica',
    period: 'Pre-Columbian; living mathematical heritage',
    era: 'Ancient',
    structure: 'Positional',
    baseLabel: 'Base 20',
    summary:
      'Dots represent one, bars five, and a shell-shaped sign zero. Vertical positions count powers of twenty.',
    history:
      'Maya scribes recorded numbers in monuments and manuscripts using dots for units, bars for fives, and several forms of zero. Numbers were used in astronomical and calendar records. This display uses the familiar dot-and-bar forms rather than the elaborate head variants.',
    howItWorks:
      'Read a stack of number signs. First count the dots and bars on each level, then use the level’s value.',
    readingSteps: [
      'A dot means one and a bar means five. Three bars and four dots on the same level make 15 + 4 = 19.',
      'Start at the bottom of this base-20 teaching layout: the bottom level counts ones, the next counts twenties, and the next counts four hundreds.',
      'For 42, the upper level has two dots. Those mean two twenties, giving 40.',
      'The bottom level has two dots, giving two ones. Add 40 + 2 = 42. A zero sign keeps an empty level in place.',
    ],
    caveat:
      'This is ordinary vigesimal notation. The Long Count calendar uses a modified third position worth 360, which this converter does not use. The shell is one of several attested zero forms.',
    engine: 'positional',
    radix: 20,
    digits: Array.from({ length: 20 }, (_, i) => `maya-${i}`),
    min: '0',
    max: '9'.repeat(100),
    zero: true,
    specimen: 42,
    featured: true,
    examples: [
      { value: '5', explanation: 'A single bar represents five.' },
      { value: '19', explanation: 'Three bars and four dots.' },
      { value: '42', explanation: 'Two twenties above two units.' },
      { value: '400', explanation: 'One in the third level, with zero in the lower two.' },
    ],
    sources: [
      unicode,
      {
        title: 'Unicode — Maya numeral structure and encoding',
        url: 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-22/',
      },
    ],
  },
  {
    id: 'mexica',
    name: 'Mexica / Aztec',
    region: 'Americas',
    location: 'Central Mexico',
    period: '15th–16th-century manuscript tradition',
    era: 'Historical',
    structure: 'Additive',
    baseLabel: 'Groups of 20',
    summary:
      'Dots count units; flags represent twenty, feathers four hundred, and bags eight thousand.',
    history:
      'Nahua scribes used numerical signs alongside images of objects and tribute goods. The Codex Mendoza and Matrícula de Tributos preserve examples of flags, feather signs, and bags marking large quantities. Their composition is connected to the records in which they occur; it is not simply a replacement font.',
    howItWorks:
      'Count how many of each kind of sign you see, then add their values. This exhibit uses a simplified additive layout.',
    readingSteps: [
      'Learn the values: a dot is 1, a flag is 20, a feather is 400, and a bag is 8,000.',
      'For 42, count the two flags first: 20 + 20 = 40.',
      'Count the two dots next: 1 + 1 = 2.',
      'Add the groups: 40 + 2 = 42. Each sign already carries its value, so you do not need a zero to hold an empty place.',
    ],
    caveat:
      'A linear arrangement is used for comparison here. Manuscripts arrange signs in relation to counted objects and use additional conventions. No zero sign is supplied.',
    engine: 'additive',
    values: [
      { value: 8000, glyph: 'mexica-8000' },
      { value: 400, glyph: 'mexica-400' },
      { value: 20, glyph: 'mexica-20' },
      { value: 1, glyph: 'mexica-1' },
    ],
    min: '1',
    max: '159999',
    zero: false,
    specimen: 42,
    examples: [
      { value: '20', explanation: 'One flag.' },
      { value: '400', explanation: 'One feather sign.' },
      { value: '8000', explanation: 'One bag sign.' },
      { value: '42', explanation: 'Two flags and two dots: 20 + 20 + 1 + 1.' },
    ],
    sources: [mexica],
  },
  {
    id: 'khipu',
    name: 'Inka khipu',
    localName: 'Khipu',
    region: 'Americas',
    location: 'Andes, South America',
    period: 'Inka period; continuing Andean traditions',
    era: 'Historical',
    structure: 'Physical',
    baseLabel: 'Decimal knot positions',
    summary: 'Decimal place values recorded with knots on cords.',
    history:
      'Khipus are arrangements of cords and knots used for record keeping in the Andes. A well-understood class of numerical khipus records decimal values through the positions and types of knots. Cord color, attachment, and other features carry additional information that cannot be inferred from a number alone.',
    howItWorks:
      'Read the knots on one hanging cord. Where a knot sits tells you whether it counts hundreds, tens, or ones.',
    readingSteps: [
      'In this schematic, read from the higher positions down toward the ones position. Groups of single knots count hundreds, tens, and other higher places.',
      'For 135, one single knot in the hundreds position means 100.',
      'Three single knots in the tens position mean three tens, or 30.',
      'At the bottom, a long knot with five turns means 5. Add 100 + 30 + 5 = 135. A figure-eight knot means one in the ones position; an empty position means zero.',
    ],
    caveat:
      'This is a labeled schematic of the common numerical convention, not a reconstruction of a complete historical khipu. Other knot conventions and non-numerical records exist.',
    engine: 'khipu',
    min: '0',
    max: '9999999',
    zero: true,
    specimen: 135,
    featured: true,
    examples: [
      { value: '1', explanation: 'A figure-eight knot in the units position.' },
      {
        value: '20',
        explanation: 'Two single knots in the tens position; the units remain empty.',
      },
      {
        value: '135',
        explanation: 'One hundred knot, three tens knots, and a five-turn long knot.',
      },
    ],
    sources: [
      khipu,
      {
        title: 'Smithsonian — What is a khipu?',
        url: 'https://americanindian.si.edu/inkaroad/pdf/inka-teachers-guide.pdf',
      },
    ],
  },
  {
    id: 'roman',
    name: 'Roman',
    region: 'Europe',
    location: 'Ancient Rome; international use',
    period: 'Antiquity–present',
    era: 'Ancient',
    structure: 'Additive',
    baseLabel: 'Additive · subtractive',
    summary: 'Letters represent values that are added or subtracted: XLII = 50 − 10 + 2.',
    history:
      'Roman numeral conventions developed over centuries and varied in inscriptions, manuscripts, and later printing. They remain visible on clocks, monuments, and numbered volumes. This converter uses the common modern subtractive convention, a standardized selection from that wider historical practice.',
    howItWorks:
      'Read Roman numerals in small groups. Most signs add, but a few specific pairs mean subtraction.',
    readingSteps: [
      'Learn the sign values: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, and M = 1,000.',
      'Look for these pairs first: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, and CM = 900. In each pair, take the smaller value away from the larger.',
      'For XLII, read XL together: L is 50 and X is 10, so this pair means 50 − 10 = 40.',
      'The two remaining I signs add one each. Add 40 + 1 + 1 = 42. For MCMXCIV, the groups are M, CM, XC, IV: 1,000 + 900 + 90 + 4 = 1,994.',
    ],
    caveat:
      'The supported modern convention is 1–3,999. Additive inscriptional variants such as IIII and large-number overbars are outside this renderer. There is no zero sign.',
    engine: 'roman',
    min: '1',
    max: '3999',
    zero: false,
    specimen: 42,
    examples: [
      { value: '4', explanation: 'IV: five minus one.' },
      { value: '42', explanation: 'XLII: fifty minus ten, plus two.' },
      { value: '1994', explanation: 'MCMXCIV: 1,000 + 900 + 90 + 4.' },
    ],
    sources: [unicode],
  },
  {
    id: 'greek-alphabetic',
    name: 'Greek alphabetic',
    region: 'Europe',
    location: 'Greek-speaking Mediterranean',
    period: 'Classical period onward',
    era: 'Historical',
    structure: 'Alphabetic',
    baseLabel: 'Letter values',
    summary: 'Greek letters represent units, tens, and hundreds.',
    history:
      'The alphabetic system, also called Milesian or Ionic, assigns numerical values to twenty-seven letters. Three additional signs retain places in the sequence beyond the standard twenty-four-letter Greek alphabet. Its forms evolved in manuscripts and printing, and Greek numerical letters are still used in particular contexts.',
    howItWorks:
      'Certain Greek letters also have number values. Read each letter’s value and add them.',
    readingSteps: [
      'The numerical letters come in three sets: nine for 1–9, nine for 10–90, and nine for 100–900. A tens letter already means a whole amount such as forty.',
      'For 42, the first letter is mu, worth 40.',
      'The next letter is beta, worth 2. Add 40 + 2 = 42.',
      'The numeral mark after the letters tells you to read them as a number. It adds no value. Missing amounts are simply left out.',
    ],
    caveat:
      'This uses an uppercase typographic convention through 999, including stigma, koppa, and sampi. Thousands markers and manuscript overlines are not implemented; the range limit belongs to this app.',
    engine: 'greek',
    min: '1',
    max: '999',
    zero: false,
    specimen: 42,
    values: Array.from({ length: 27 }, (_, i) => ({
      value: i < 9 ? i + 1 : i < 18 ? (i - 8) * 10 : (i - 17) * 100,
      glyph: `greek-${i < 9 ? i + 1 : i < 18 ? (i - 8) * 10 : (i - 17) * 100}`,
    })).reverse(),
    examples: [
      { value: '6', explanation: 'Stigma has the value six.' },
      { value: '42', explanation: 'Mu (40) and beta (2), followed by the numeral sign.' },
      { value: '999', explanation: 'Sampi (900), koppa (90), and theta (9).' },
    ],
    sources: [unicode],
  },
  {
    id: 'greek-attic',
    name: 'Greek Attic',
    region: 'Europe',
    location: 'Attica, ancient Greece',
    period: 'Classical inscriptions',
    era: 'Ancient',
    structure: 'Additive',
    baseLabel: 'Acrophonic · groups of 5',
    summary: 'Number signs based on the initial letters of Greek number names.',
    history:
      'The Attic acrophonic system appears in ancient inscriptions, including financial records. Several of its signs derive from initial letters of Greek number words. Regional acrophonic systems also existed; the shapes and values shown here belong to the Attic numerical repertoire.',
    howItWorks:
      'Each sign has a fixed value. Count repeated signs and add them, starting with the largest.',
    readingSteps: [
      'The basic signs mean 1, 5, 10, 100, 1,000, and 10,000. Special combined signs mean 50, 500, 5,000, and 50,000.',
      'For 42, count four ten signs: 10 + 10 + 10 + 10 = 40.',
      'Count two one signs: 1 + 1 = 2.',
      'Add 40 + 2 = 42. A combined five-hundred sign is worth 500 by itself. These signs carry their own values; empty amounts need no zero placeholder.',
    ],
    caveat:
      'This renders abstract integer quantities, not the specialized signs for currency, weight, or fractions also found in inscriptions. There is no zero sign.',
    engine: 'additive',
    min: '1',
    max: '99999',
    zero: false,
    specimen: 42,
    values: [50000, 10000, 5000, 1000, 500, 100, 50, 10, 5, 1].map((value) => ({
      value,
      glyph: `attic-${value}`,
    })),
    examples: [
      { value: '5', explanation: 'The acrophonic sign for five.' },
      { value: '42', explanation: 'Four tens and two ones.' },
      { value: '500', explanation: 'A compound five-hundred sign.' },
    ],
    sources: [
      unicode,
      {
        title: 'Greek acrophonic encoding proposal and inscription references',
        url: 'https://www.unicode.org/wg2/docs/n2612-3.pdf',
      },
    ],
  },
  {
    id: 'cistercian',
    name: 'Cistercian',
    region: 'Europe',
    location: 'Medieval European monasteries',
    period: '13th–16th centuries',
    era: 'Historical',
    structure: 'Mixed',
    baseLabel: 'Four decimal quadrants',
    summary: 'Marks in four quadrants combine units, tens, hundreds, and thousands in one sign.',
    history:
      'Medieval monastic number ciphers combine marks around a common staff. Surviving examples occur in manuscripts and on instruments, with considerable regional variation. Historian David A. King documented these traditions in The Ciphers of the Monks. The familiar vertical-staff arrangement is the variant used here.',
    howItWorks:
      'One sign holds up to four digits around a central upright line. Read each corner separately.',
    readingSteps: [
      'Locate the four places: upper right = ones, upper left = tens, lower right = hundreds, lower left = thousands.',
      'For 42, read the digit shape at the upper left as 4. Because it sits in the tens corner, it contributes 40.',
      'Read the digit shape at the upper right as 2. In the ones corner, it contributes 2.',
      'Add the corners: 40 + 2 = 42. The lower corners have no digit strokes, so there are no hundreds or thousands to add.',
    ],
    caveat:
      'This is one documented family of variants, not a uniform standard used by every monastery. The whole number zero is not supplied. These signs were primarily notation, rather than a historical algorithm for arithmetic.',
    engine: 'cistercian',
    min: '1',
    max: '9999',
    zero: false,
    specimen: 2026,
    featured: true,
    examples: [
      { value: '1', explanation: 'A mark at the upper right of the staff.' },
      { value: '42', explanation: 'Four tens at upper left and two units at upper right.' },
      { value: '9999', explanation: 'Nine in each of the four quadrants.' },
    ],
    sources: [king],
  },
];
