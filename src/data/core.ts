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
      'Read from left to right. Each position is worth twenty times the position to its right. Within a digit, up to three horizontal strokes count fives and up to four downward strokes count the remaining units.',
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
      'Read the vertical stack from top to bottom. Each level is a base-20 position: ones at the bottom, twenties above, then four hundreds. A dot is one and a bar is five.',
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
      'This educational additive transcription repeats each sign as needed: dots for ones, flags for twenties, feathers for four hundreds, and bags for eight thousands. Add their values to read the result.',
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
      'Read one schematic pendant from top to bottom. Higher positions use groups of single overhand knots. In the units position, a figure-eight knot represents one and a long knot has two to nine turns. An empty position represents zero.',
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
      'I, V, X, L, C, D, and M represent 1, 5, 10, 50, 100, 500, and 1,000. Most symbols add. The pairs IV, IX, XL, XC, CD, and CM subtract the smaller value from the larger.',
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
      'The first nine numerical letters represent 1–9, the next nine 10–90, and the last nine 100–900. Add them from largest to smallest. A following numeral sign distinguishes the sequence from an ordinary word.',
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
      'Signs represent one, five, ten, one hundred, one thousand, and ten thousand. Compound five signs represent fifty, five hundred, five thousand, and fifty thousand. Add the signs, largest first.',
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
      'The upper right records units, upper left tens, lower right hundreds, and lower left thousands. Reflecting a digit’s strokes into these quadrants combines four decimal places in one composite sign.',
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
