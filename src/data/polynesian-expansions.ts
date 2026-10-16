import type { SystemDefinition } from '../lib/types';

export const polynesianSystemUpdates: Record<string, Partial<SystemDefinition>> = {
  maori: {
    period: 'Contemporary decimal counting; historical variants explained separately',
    summary:
      'Contemporary Māori decimal number words, composed from thousands, hundreds, tens, and additional units.',
    howItWorks:
      'Read the named groups from largest to smallest. A unit before mano, rau, or tekau multiplies that amount; mā joins remaining units. The converter uses isolated contemporary counting forms.',
    readingSteps: [
      'Use tahi through iwa for one through nine, kore for zero, and tekau for ten.',
      'A coefficient before tekau multiplies ten: rima tekau means 5 × 10 = 50. A single ten is simply tekau.',
      'Mā joins additional units: rima tekau mā ono is 50 + 6 = 56.',
      'Rau names hundreds and mano thousands. One hundred is kotahi rau and one thousand kotahi mano; larger coefficients use rua through iwa.',
      'Read the expanded groups in order: kotahi mano iwa rau waru tekau mā waru is 1,000 + 900 + 80 + 8 = 1,988. Rua mano mā tahi is 2,001.',
      'In sentences, counting people may take toko-, and counting other things may take e; this isolated-number converter does not add noun-dependent grammar.',
    ],
    caveat:
      'Supports contemporary isolated whole-number counting from 0 to 9,999. Historical meanings of tekau and pair counting are separate traditions. Macrons are part of the spelling. This display follows the cited teaching forms, omitting optional punctuation between large groups.',
    engine: 'spoken',
    min: '0',
    max: '9999',
    zero: true,
    specimen: 56,
    examples: [
      {
        value: '0',
        words: 'kore',
        explanation: 'Zero in contemporary counting, listed in the Native Council lesson.',
      },
      {
        value: '12',
        words: 'tekau mā rua',
        explanation: 'Ten plus two; a documented compound in Te Aka.',
      },
      {
        value: '20',
        words: 'rua tekau',
        explanation: 'Two tens, using the contemporary decimal meaning of tekau.',
      },
      {
        value: '56',
        words: 'rima tekau mā ono',
        explanation: 'Rule-derived example: five tens plus six, 5 × 10 + 6 = 56.',
      },
      {
        value: '1988',
        words: 'kotahi mano iwa rau waru tekau mā waru',
        explanation:
          'The Native Council lesson gives this expanded date example, with optional commas between groups.',
      },
      {
        value: '2001',
        words: 'rua mano mā tahi',
        explanation: 'Two thousand plus one, an example printed in the same lesson.',
      },
    ],
    sources: [
      {
        title: 'Native Council · Māori Made Easy: counting and expanded numbers',
        url: 'https://www.maorilanguage.net/maori-made-easy/week-2-monday/',
        detail:
          'Lists zero, 1–21, tens, hundred/thousand words, and expanded 1,988, 2,001, and 2,011 examples. The page heading calls this Week 6 despite the stable URL.',
      },
      {
        title: 'New Zealand Ministry of Education · Reomations: Ngā Tau',
        url: 'https://kauwhatareo.tahurangi.education.govt.nz/ng-tau/5637248083.p',
        detail:
          'Contemporary decimal composition through thousands, and the distinction between isolated numbers and e/toko- noun-counting forms.',
      },
      {
        title: 'Te Aka Māori Dictionary · tekau',
        url: 'https://maoridictionary.co.nz/search?keywords=tekau',
        detail: 'Contemporary compounds and historical twenty meaning.',
      },
      {
        title: 'Manatū Taonga · A Māori word a day',
        url: 'https://nzhistory.govt.nz/culture/maori-language-week/365-maori-words',
        detail:
          'Contemporary units, 99, hundred and thousand examples, compiled and recorded by Martin Wikaira.',
      },
    ],
  },
  hawaiian: {
    period: 'Contemporary decimal counting; traditional object-group vocabulary retained',
    baseLabel: 'Decimal words · named tens',
    summary:
      'Hawaiian decimal counting through one hundred: named tens join extra units with kūmā. Traditional group names are explained separately.',
    history:
      'The selected converter follows Kaliko Trapp’s contemporary number-building lesson. It uses the bare counting roots and the -kūmā- pattern. Hawaiian also has traditional terms for groups of objects, such as kāuna (four) and kaʻau (forty); these remain in the dictionary with their own context, like English dozen rather than a substitute for every ordinary number name.',
    howItWorks:
      'Use a named ten followed by -kūmā- and a unit root for amounts such as 56. Twenty has the special name iwakālua; tens from thirty through ninety use kana- with the appropriate root. This display uses bare counting forms, preserving the teacher’s explanatory hyphens.',
    readingSteps: [
      'Learn the bare counting roots: kahi, lua, kolu, hā, lima, ono, hiku, walu, iwa. Zero is ʻole and ten is ʻumi.',
      'Join a ten to extra units with -kūmā-: ʻumi-kūmā-kahi gives 10 + 1 = 11.',
      'Twenty is iwakālua. Iwakālua-kūmā-lua gives 20 + 2 = 22.',
      'Kana- with roots from three to nine forms the later tens: kanakolu (30), kanahā (40), kanalima (50), kanaono (60), kanahiku (70), kanawalu (80), kanaiwa (90).',
      'For 56, kanalima supplies 50 and ono supplies 6: kanalima-kūmā-ono = 50 + 6. One hundred is hoʻokahi haneli.',
      'Kāuna, kaʻau, lau, and mano are traditional object-group terms. They are labeled separately in the dictionary; sentence quantities can also take different prefixes from bare counting roots.',
    ],
    caveat:
      'Supports the documented decimal counting pattern from 0 through 100. Hyphens mark constituent parts as in the teaching lesson; joined spellings also occur. Bare counting roots differ from quantity forms such as ʻelua and hoʻokahi. Traditional grouping terms remain a separate glossary within this entry. The ʻokina and kahakō are meaningful parts of the spelling.',
    engine: 'spoken',
    min: '0',
    max: '100',
    zero: true,
    specimen: 56,
    examples: [
      {
        value: '0',
        words: 'ʻole',
        explanation: 'Zero as a number; ʻaʻohe is used for none in quantity contexts.',
      },
      {
        value: '4',
        words: 'hā',
        explanation:
          'The bare counting root for four. Kāuna separately names a group of four objects.',
      },
      {
        value: '22',
        words: 'iwakālua-kūmā-lua',
        explanation: 'Twenty plus two, explicitly printed in the ʻŌlelo Online lesson.',
      },
      {
        value: '40',
        words: 'kanahā',
        explanation:
          'Forty in decimal counting. Kaʻau is the separately documented object-group term.',
      },
      {
        value: '56',
        words: 'kanalima-kūmā-ono',
        explanation:
          'Rule-derived application of the teacher’s pattern: fifty joined to six gives 56.',
      },
      {
        value: '100',
        words: 'hoʻokahi haneli',
        explanation: 'One hundred, recorded in ʻŌiwi Parker Jones’s linguistic number survey.',
      },
    ],
    sources: [
      {
        title: 'Kaliko Trapp / ʻŌlelo Online · Hawaiian Number Basics: 1 to 100',
        url: 'https://oleloonline.com/hawaiian-number-basics-1-to-100-0502v/',
        detail:
          'Written lesson gives unit roots, zero, -kūmā- composition, all 20–29 forms, irregular twenty, and tens from 30 to 90.',
      },
      {
        title: 'ʻŌiwi Parker Jones · Hawaiian numeral data (2006)',
        url: 'https://lingweb.eva.mpg.de/channumerals/Hawaiian.htm',
        detail:
          'Linguist-provided primary data: decimal compounds, 100 hoʻokahi haneli, and the English-derived hundred/thousand terms.',
      },
      {
        title: 'ʻŌlelo Online · Zero and One, Quantity and Question',
        url: 'https://oleloonline.com/0504v-zero-and-one-quantity-and-question/',
        detail: 'Distinguishes bare counting roots from noun quantities, and ʻole from ʻaʻohe.',
      },
      {
        title: 'ʻŌlelo Online · Traditional Hawaiian Number Groups',
        url: 'https://oleloonline.com/0503v-traditional-hawaiian-number-groups/',
        detail: 'Separate group names kāuna, kaʻau, lau, mano and their object-counting context.',
      },
    ],
  },
};
