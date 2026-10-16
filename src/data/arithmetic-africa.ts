import type { ArithmeticEvidenceProfile } from '../lib/arithmetic-evidence';

const unicodeAfrica = 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/';
const rhindCompletion =
  'https://en.wikisource.org/wiki/Page:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf/29';
const egyptianCalculation =
  'https://www.open.edu/openlearn/science-maths-technology/mathematics-statistics/egyptian-mathematics/content-section-1.1.2';
const egyptianDivision =
  'https://en.wikisource.org/wiki/Page:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf/21';
const copticTables = 'https://geniza.princeton.edu/en/documents/20917/';
const hawari = 'https://edition-open-sources.org/media/sources/14/sources14.pdf';

/** Sources establish an operation, a tool, and a notation variant separately. */
export const africanArithmeticProfiles: Record<string, ArithmeticEvidenceProfile> = {
  medefaidrin: {
    summary:
      'Oberi Okaime community specimens establish twenty positional digits. The inspected language and script studies do not describe a community arithmetic algorithm.',
    tool: 'Written base-20 digits; the worked calculation is a teaching reconstruction.',
    notationRole:
      'A digit is a whole value from zero through nineteen. Positions carry twenties and four hundreds, with a real zero for empty places.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Align the Medefaidrin places and combine equal places. Exchange twenty units for one twenty and twenty twenties for one four-hundred. This demonstrates addition in the attested notation; it is not a recorded Oberi Okaime lesson.',
      subtract:
        'Work through the Medefaidrin places, exchanging one higher-place unit for twenty of the next smaller place when necessary. The source verifies the digits and place values, not this borrowing procedure.',
      multiply:
        'Multiply by each Medefaidrin digit of the multiplier, carrying at twenty; move a partial product one place for each factor of twenty, then combine the partial products. This is a notation-specific teaching algorithm, not an attested community multiplication method.',
      divide:
        'Take the dividend a Medefaidrin place at a time. Find how many divisors fit, subtract that multiple, and carry the remainder into the next place as twenty smaller units. This worked division is a reconstruction; no community division procedure was established by the inspected sources.',
    },
    sources: [
      {
        title: 'Rovenchak, Gibbon, Ekpenyong and Urua · Medefaidrin proposal (2016)',
        url: 'https://www.unicode.org/L2/L2016/16101-medefaidrin.pdf',
        detail:
          'Section 6 and Figure 10: base-20 formation and Reverend Richmael Ekit’s numeral specimens; no arithmetic procedure is described.',
      },
      {
        title: 'Urua and Gibbon · Medefaidrin Spirit Language (2012)',
        url: 'https://wwwhomes.uni-bielefeld.de/gibbon/Dafydd_Gibbon_Publication_PDFs/2012_Urua_Gibbon_Medefaidrin_Spirit_Language_urua-gibbon-ACAL.pdf',
        detail:
          'Field-based linguistic study includes words for addition and multiplication, but does not specify their algorithms.',
      },
    ],
  },
  'mende-kikakui': {
    summary:
      'Kikakui writes the decimal magnitude beneath its unit sign. Sources establish numeral formation and accounting use, but the inspected sources do not explain a written calculation procedure.',
    tool: 'Magnitude groups with attached subscripts; the arithmetic demonstration is reconstructed.',
    notationRole:
      'Highest magnitudes occur at the right. An omitted magnitude is empty, rather than a written zero; teens use their own mark.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Collect contributions with the same subscripted magnitude, combine their coefficients, and exchange ten of a magnitude for one of the next. Recompose only attested sign combinations. This is a teaching reconstruction, not a transcribed Kikakui calculation.',
      subtract:
        'Compare matching magnitude groups, exchange one larger group for ten smaller groups when needed, and remove the requested quantity. Empty groups disappear. The source does not establish this as the historical Kikakui subtraction procedure.',
      multiply:
        'Treat a sign together with its subscript as a complete magnitude: two tens multiplied by three units contributes six tens. Form and combine the partial products without turning the subscripts into positional digits. This is a reconstructed example.',
      divide:
        'Build multiples of the divisor in magnitude groups, remove complete multiples from the dividend, and count the groups removed. Retain any remainder separately. This illustrates division with the notation; the inspected documents do not establish a historical algorithm.',
    },
    sources: [
      {
        title: 'Everson and Tuchscherer · Mende Kikakui encoding proposal (2012)',
        url: 'https://escholarship.org/uc/item/2387g2gr',
        detail:
          'Specialist and community evidence for script history and numeral repertoire; it does not supply an arithmetic manual.',
      },
      {
        title: 'Unicode · Mende Kikakui number formation',
        url: unicodeAfrica,
        detail:
          'Section 19.8, Table 19-6: attached subscripts, right-to-left magnitude order, distinct teens formation, and specimen numbers.',
      },
    ],
  },
  bamum: {
    summary:
      'Surviving palace manuscripts contain multiplication tables written in Akauku numerals. The calculator uses the modern decimal convention; an earlier Koghom sign can mean ten rather than zero.',
    tool: 'Written multiplication tables; modern decimal place-value demonstrations for other operations.',
    notationRole:
      'The modern ten Bamum digit signs express decimal places. The worked layout is not a facsimile of an earlier manuscript.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'documented',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Combine equal decimal places written with Bamum digits; exchange ten units for one ten and continue carrying. The digit convention is documented, but this exact addition layout is a teaching reconstruction.',
      subtract:
        'Subtract matching Bamum decimal places and exchange a higher-place unit for ten lower-place units when required. The inspected multiplication manuscripts do not document a subtraction layout; this one is a modern teaching reconstruction.',
      multiply:
        'A Bamum palace manuscript explicitly lists successive multiplication facts in Akauku numerals, starting with one times one and one times two. Use the matching facts to obtain products; combining digit products for a larger input is a worked extension of table use, not a claim that the catalogue documents this exact long-multiplication layout.',
      divide:
        'Find how many groups of the divisor fit, record the quotient in Bamum decimal digits, and subtract the used groups at each place. This inverse use of multiplication facts is a teaching demonstration; the inspected Bamum sources establish multiplication tables, not a historical division algorithm.',
    },
    sources: [
      {
        title: 'Bamum Palace / British Library · Multiplication table, EAP051/1/2/31',
        url: 'https://searcharchives.bl.uk/catalog/040-002761353',
        detail:
          'Primary manuscript catalogue identifies Akauku numeral multiplication facts explicitly, including 1 × 1 and 1 × 2.',
      },
      {
        title: 'Bamum Palace / British Library · Multiplication tables, EAP051/1/2/157',
        url: 'https://searcharchives.bl.uk/catalog/040-002761479',
        detail: 'Independent palace manuscript of multiplication tables in Akauku Mfemfe numerals.',
      },
      {
        title: 'Unicode · Bamum decimal convention',
        url: unicodeAfrica,
        detail:
          'Section 19.6, Digits: modern decimal use and the changed interpretation of Koghom.',
      },
    ],
  },
  ethiopic: {
    summary:
      'Geʽez numerals record arithmetic in Ethiopia’s scholarly traditions. A contemporary Ethiopian study illustrates halving and doubling with Geʽez numerals; this does not establish the age or universal use of that algorithm.',
    tool: 'Written Geʽez quantities, including an attested halving-and-doubling multiplication table.',
    notationRole:
      'Units and tens combine into amounts below one hundred, with hundred and ten-thousand multipliers. There is no numeral zero; empty groups can be omitted.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'documented',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Combine like units, tens, and hundred groups; exchange ten units for a ten and ten tens for a hundred, then recompose the Geʽez numeral. This is a teaching reconstruction using documented sign values, not an attested manuscript algorithm.',
      subtract:
        'Remove like quantities, exchanging a hundred for ten tens or a ten for ten units when required, and recompose the result without inventing a zero sign. The inspected sources do not establish this borrowing procedure as a traditional Geʽez algorithm.',
      multiply:
        'Write two columns. Repeatedly halve the first factor, dropping the fractional half, and double the other; discard rows whose first number is even and add the retained second numbers. Ayalew and Areaya illustrate this with Geʽez numerals for eleven times fifteen. The documented example is contemporary; an ancient Ethiopian origin is not established here.',
      divide:
        'Build complete multiples of the divisor from the dividend’s Geʽez quantities, subtract them, and accumulate the quotient; keep any remainder separately. Traditional computus uses quotient-and-remainder calculations, but the inspected sources do not establish this general manual division procedure, so the walkthrough is reconstructed.',
    },
    sources: [
      {
        title: 'Ayalew and Areaya · Sociocultural Mathematics in Ethiopia (2021)',
        url: 'https://journalofmathematicsandculture.wordpress.com/wp-content/uploads/2021/06/sociocultural-mathematics-in-ethiopia-final-1.pdf',
        detail:
          'Journal of Mathematics and Culture 15(3), pp. 68–69, Figure 1: halving, doubling, eliminating even rows, and adding retained products, with Geʽez numerals.',
      },
      {
        title: 'Geʽez.org · Ethiopic numerals',
        url: 'https://www.geez.org/Numerals/index.html',
        detail:
          'Sign values, composition, implicit one, and no numeral zero; numeral formation is distinct from a documented calculation algorithm.',
      },
      {
        title: 'Ethiopian Orthodox Church · Microfilmed manuscript catalogue',
        url: 'https://www.ethiopianorthodox.org/amharic/holybooks/microfilmed%20manuscripts_aug2019.pdf',
        detail:
          'Documents Baḥra ḥasab computus manuscripts; catalogue descriptions alone do not reveal their elementary arithmetic algorithms.',
      },
    ],
  },
  'coptic-epact': {
    summary:
      'A surviving Geniza booklet writes multiplication and division tables in Coptic epact forms. It gives direct evidence for table-based arithmetic, including division into unit fractions for particular commercial divisors.',
    tool: 'Ruled manuscript tables containing epact operands and results.',
    notationRole:
      'Epact signs have separate unit, ten, and hundred values. The manuscript also uses thousands, myriads, and fractions beyond this converter’s 1–999 repertoire.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'documented',
      divide: 'documented',
    },
    operationNotes: {
      add: 'Combine quantities of equal decimal order and replace their sum with the corresponding epact sign or higher-order group. The inspected epact sources establish the notation and tables, not this addition procedure; the walkthrough is reconstructed.',
      subtract:
        'Subtract matching sign-values, exchanging a larger amount for smaller decimal amounts when needed, then write the remainder with epact signs. This is a teaching reconstruction; a distinct epact borrowing algorithm was not established.',
      multiply:
        'The surviving decadic table lists a multiplicand times one through nine, and those same multiples at tens, hundreds, and thousands. Look up the relevant product for each nonzero decimal component and combine it with the others. The table format is attested; an arbitrary new combination of entries is a worked application.',
      divide:
        'The booklet supplies division tables for twelve, twenty-four, and forty-eight, including unit-fraction quotients. For those divisors, match the dividend’s decimal components to table entries and combine the quotients. For another divisor, the worked grouping procedure is a teaching extension; this manuscript does not establish a general epact long-division algorithm.',
    },
    sources: [
      {
        title:
          'Princeton Geniza Project · Coptic multiplication and division tables, T-S Ar.39.380',
        url: copticTables,
        detail:
          'Primary manuscript, epact transcription and translation: decadic multiplication; division by 12, 24, 48 with unit fractions; palaeographic variants are noted.',
      },
      {
        title: 'Pandey · Coptic epact encoding proposal (2011)',
        url: 'https://www.unicode.org/L2/L2011/11062r-coptic-epact.pdf',
        detail:
          'Distinct epact repertoire, composite quantities, thousands marks, and historical manuscript evidence.',
      },
    ],
  },
  nko: {
    summary:
      'The N’Ko Institute teaches all four familiar arithmetic operations with N’Ko digits. These are modern decimal calculations in a living script, with the numerical reading direction running right to left.',
    tool: 'Modern written arithmetic with N’Ko decimal digits; N’Ko calculators are also used.',
    notationRole:
      'Largest places are at the right and units at the left in visual order. Work by place value; a change of reading direction does not change a number’s value.',
    evidence: { add: 'modern', subtract: 'modern', multiply: 'modern', divide: 'modern' },
    operationNotes: {
      add: 'Align N’Ko units with units and tens with tens. Add the smallest places first and carry ten units to the next larger place, visually toward the right.',
      subtract:
        'Begin with the smallest N’Ko places, visually at the left. If a place is too small, exchange one unit from the next larger place for ten units here, then subtract.',
      multiply:
        'Multiply by each N’Ko multiplier digit, carrying at ten. Scale each partial product by its decimal place and add the partial products. The Institute identifies this as familiar decimal arithmetic; the expanded layout is this lesson’s worked example.',
      divide:
        'Begin with the largest N’Ko places, visually at the right. Choose a quotient digit, subtract its multiple of the divisor, and include the next smaller place. Preserve zero places and any remainder.',
    },
    sources: [
      {
        title: 'N’Ko Institute · Numerals and mathematical operations',
        url: 'https://www.fakoli.net/pages/learn/numerals.html',
        detail:
          'Community tutorial explicitly identifies ordinary decimal arithmetic and illustrates addition, subtraction, multiplication, and division.',
      },
      {
        title: 'Unicode · N’Ko digits and directionality',
        url: unicodeAfrica,
        detail: 'Section 19.4, Digits and Figure 19-3: right-to-left numerals.',
      },
      {
        title: 'N’ko Jatebɔlan · Everyday arithmetic calculator',
        url: 'https://apps.apple.com/cd/app/nko-jateb%C9%94lan-african-ed/id1552279686',
        detail:
          'Developer’s description documents contemporary arithmetic with N’Ko numeral display.',
      },
    ],
  },
  vai: {
    summary:
      'Vai-style decimal digits were devised in the 1920s but did not become popular. Unicode states that modern Vai literature uses European digits; the encoded Vai forms are preserved for historical study.',
    tool: 'A teaching display of decimal arithmetic using the historical Vai-style digit repertoire.',
    notationRole:
      'These signs are decimal digit variants, including zero. Their existence does not establish a separate Vai algorithm or widespread arithmetic use of these shapes.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Add matching decimal places written in the Vai-style digits, carrying one ten for every ten units. This is a modern worked demonstration with the historical repertoire, not evidence of a distinctive or widely used Vai procedure.',
      subtract:
        'Exchange one higher-place decimal unit for ten smaller units when needed and subtract matching places. The arithmetic is a teaching demonstration; the inspected Vai sources establish the digit designs, not this written subtraction practice.',
      multiply:
        'Use the Vai-style digits for decimal digit products, carries, and shifted partial products, then sum the products. This modern teaching reconstruction should not be described as an indigenous historical Vai multiplication algorithm.',
      divide:
        'Work through decimal places, finding complete divisor groups and subtracting their products; record quotient digits in Vai-style forms. This is a teaching reconstruction, not a documented historical Vai long-division method.',
    },
    sources: [
      {
        title: 'Unicode · Vai digit history and actual modern use',
        url: unicodeAfrica,
        detail:
          'Section 19.5, Digits: 1920s Vai-style forms were unpopular and are encoded for historical purposes; modern literature uses European digits.',
      },
      {
        title: 'Everson and Riley · Additional Vai characters (2006)',
        url: 'https://www.unicode.org/L2/L2006/06120-n3081-vai-additions.pdf',
        detail:
          'Historical sources and specimen glyphs for the numeral repertoire; no arithmetic algorithm is described.',
      },
    ],
  },
  osmanya: {
    summary:
      'Osmanya has ten decimal digits in a twentieth-century Somali script. The inspected primary encoding documents establish the notation, but do not supply a distinct historical calculation procedure.',
    tool: 'Modern decimal calculation displayed with Osmanya digits; the manual layout is a teaching reconstruction.',
    notationRole:
      'Digits run left to right and include zero. The notation is decimal even though Somali number words have their own ordering conventions.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Combine matching Osmanya decimal places and carry at ten, starting with the units on the right. This is a modern worked application of the documented decimal notation, not a separately attested Osmanya historical algorithm.',
      subtract:
        'Take away the matching decimal amounts, borrowing ten smaller units from a larger place if required. Preserve zero in an emptied interior place. This manual procedure is a teaching reconstruction with Osmanya digits.',
      multiply:
        'Form decimal digit products in Osmanya signs, scale them by each multiplier place, and combine the partial products. The notation is documented; the inspected historical sources do not establish this exact multiplication layout.',
      divide:
        'Begin at the largest decimal place, determine the next quotient digit, subtract its product, and bring in the next digit. Write Osmanya zero for an empty quotient place. This is a teaching reconstruction of decimal division in the script.',
    },
    sources: [
      {
        title: 'Everson · Osmanya encoding proposal (2001)',
        url: 'https://www.unicode.org/wg2/docs/n2361.pdf',
        detail:
          'Primary encoding proposal, script history and decimal numeral specimens; it does not describe an arithmetic algorithm.',
      },
      {
        title: 'Unicode · Osmanya numeral repertoire',
        url: 'https://www.unicode.org/charts/PDF/U10480.pdf',
        detail: 'U+104A0–U+104A9: decimal digits zero through nine.',
      },
    ],
  },
  yoruba: {
    summary:
      'Yorùbá numerical practice includes spoken relationships and physical cowry grouping. Observed shell-counting is stronger evidence than assuming every arithmetic operation follows the grammar of number names.',
    tool: 'Cowry heaps and spoken counts organized around fives, tens, twenties, and larger named groups.',
    notationRole:
      'This entry represents spoken numbers, not an invented numeral alphabet. The word for a result can include subtraction even when the selected operation is addition.',
    evidence: {
      add: 'documented',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Combine the counted cowry heaps and recount complete groups. Mann’s observed practice collects shells five at a time, joins two heaps of one hundred into two hundred, and joins subsequent counted heaps. The worked example applies that combining practice to the selected quantities; a name’s internal arithmetic is explained separately.',
      subtract:
        'Use a rounded twenty-group reference for the first quantity and track its deficit. Removing the second quantity increases that deficit; the reference minus the new deficit gives the difference. Spoken dín constructions establish complements in number naming, not this general calculation procedure, so the walkthrough is explicitly reconstructed.',
      multiply:
        'Round the first factor up to a complete twenty-group and form the requested number of those groups. Remove the extra units contributed by each rounded group to obtain the product. This is a worked complement reconstruction using twenty-group quantities; no unique ancestral multiplication method is attributed to the number-name grammar.',
      divide:
        'Distribute the cowries into equal shares or count equal-size heaps until the requested groups are formed, then identify any remainder. Attested cowry units and fraction words establish grouping and sharing concepts, but the sources do not establish one general traditional division algorithm. This walkthrough is reconstructed.',
    },
    sources: [
      {
        title: 'Mann · Notes on the Numeral System of the Yoruba Nation (1887)',
        url: 'https://aiatsis.gov.au/sites/default/files/catalogue_resources/m0043995v16s1.pdf',
        detail:
          'Journal of the Anthropological Institute 16, pp. 59–64, especially p. 62: actual counting in fives and joining heaps of hundreds and two hundreds.',
      },
      {
        title: 'Verran · Accounting Mathematics in West Africa (2000)',
        url: 'https://www.researchgate.net/publication/266282017_Accounting_Mathematics_in_West_Africa_Some_Stories_of_Yoruba_Number',
        detail:
          'Author-provided field-based analysis, pp. 346–351: grouping and number names; distinguishes observed practice from a purely formal account.',
      },
      {
        title: 'Ajibade · Construction morphology of Yoruba numerals (2023)',
        url: 'https://constructions.journals.hhu.de/article/download/549/585/2271',
        detail:
          'Native-speaker analysis establishes the additive, subtractive, and multiplicative structure of spoken numbers; it is not a manual for all four calculations.',
      },
    ],
  },
  egyptian: {
    summary:
      'Egyptian mathematical papyri document doubling, completion, and division as finding a multiplier. Their working notation is hieratic; this calculator uses hieroglyphic signs to make quantities visible.',
    tool: 'Scribal written working, especially tables of doubled quantities and selected rows.',
    notationRole:
      'Repeated hieroglyphs are a teaching rendering of the quantities. They must not be mistaken for a facsimile of the hieratic Rhind Papyrus.',
    evidence: {
      add: 'reconstruction',
      subtract: 'documented',
      multiply: 'documented',
      divide: 'documented',
    },
    operationNotes: {
      add: 'Collect equal hieroglyphic signs, count their combined quantities, and replace ten equal signs by the next power-of-ten sign. This makes addition visible in the notation. The exact act of physically regrouping these glyphs is a teaching reconstruction; surviving scribal sums do not describe every elementary carrying step.',
      subtract:
        'Use completion: find what must be added to the smaller amount to reach the larger. Rhind Problems 21–23 explicitly complete a given quantity to a target. The integer walkthrough applies that attested idea to the selected quantities; literal crossing-out and borrowing of monumental signs would be a separate reconstruction.',
      multiply:
        'Build a table beginning with one copy of a factor and successively double it. Select rows whose copy counts total the other factor, then combine their products. Egyptian scribes also used convenient tenfold rows; the displayed table applies a documented method with hieroglyphic quantity illustrations.',
      divide:
        'Ask which multiplier of the divisor produces the dividend. Build suitable multiples, select those whose quantities complete the dividend, and combine their copy counts. If whole multiples leave a remainder, the historical procedure can continue with fractions; this whole-number exhibit identifies the remainder separately.',
    },
    sources: [
      {
        title: 'Rhind Mathematical Papyrus · Completion, Problems 21–23',
        url: rhindCompletion,
        detail:
          'Chace’s primary-source edition, p. 13: completing a given quantity to a target by finding the missing amount.',
      },
      {
        title: 'Open University · Egyptian calculation',
        url: egyptianCalculation,
        detail:
          'Reproduces Egyptian multiplication working and explains selected doubled and tenfold rows, including eighty times fourteen.',
      },
      {
        title: 'Rhind Mathematical Papyrus · Finding a multiplier',
        url: egyptianDivision,
        detail:
          'Chace’s primary-source edition, p. 5: division by selecting multiples, finding a remainder, and completing the target.',
      },
    ],
  },
  rumi: {
    summary:
      'Rumi accounting signs coexist with calculation in positional ciphers. Al-Hawārī explicitly links Rumi subtraction to complementary addition and Rumi multiplication to the orders of the partial products.',
    tool: 'Written accounting quantities, complementary addition, and a calculating workspace using decimal ranks.',
    notationRole:
      'Rumi’s distinct signs already mean a unit, ten, or hundred amount. Empty orders need no zero sign in the recorded result; a positional calculating workspace can still use zero.',
    evidence: {
      add: 'recording',
      subtract: 'documented',
      multiply: 'documented',
      divide: 'recording',
    },
    operationNotes: {
      add: 'Separate the Rumi signs into decimal orders, combine matching orders in a calculating workspace, and record the total with the Rumi sign for each nonempty order. Comes documents teaching Rumi calculations through ghubārī positional ciphers; the displayed workspace is a worked illustration of that calculation-and-recording relationship.',
      subtract:
        'Find the missing addend which completes the smaller quantity to the larger, beginning with the units rank. Al-Hawārī §85.16 explicitly attributes this complementary-addition practice to workers using Rumi signs. Record the missing amount with its unit, ten, and hundred signs.',
      multiply:
        'Multiply the separate numerical orders and combine their partial products: units times tens gives tens, tens times tens gives hundreds, and hundreds times tens gives thousands. Al-Hawārī §104.1 explicitly presents these rank rules as useful for Rumi multiplication. Recompose the result with the supported Rumi signs.',
      divide:
        'Use the decimal calculating workspace to determine complete divisor multiples and the remainder, then record the quotient with Rumi sign-values. The scholarly source documents positional ciphers used to explain Rumi division; the exact displayed layout is an illustration, not a claim that the surviving record contains this input or layout.',
    },
    sources: [
      {
        title: 'Al-Hawārī · Essential Commentary (1305), translated primary text',
        url: hawari,
        detail:
          'Translation §85.16 (p. 51), complementary addition for Rumi subtraction; §104.1 (p. 62), multiplication of Rumi numerical orders.',
      },
      {
        title: 'Rosa Comes · Arabic, Rumi, Coptic, or Greek notation? (2003)',
        url: 'https://www.ub.edu/arab/suhayl/volums/volum3/paper%202.pdf',
        detail:
          'Suhayl 3, p. 167: Maghribi treatises explain Rumi addition, subtraction, multiplication, and division through ghubārī calculating ciphers.',
      },
      {
        title: 'Lazrek · Rumi numeral proposal and primary manuscript specimens (2006)',
        url: 'https://www.unicode.org/L2/L2006/06291-rumi-rev.pdf',
        detail:
          'Figures reproduce Ibn al-Bannā’s Rumi manuscript and its numeral repertoire; the converter follows that variant.',
      },
    ],
  },
};
