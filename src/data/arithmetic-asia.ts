import type { ArithmeticEvidenceProfile } from '../lib/arithmetic-evidence';
import type { Source } from '../lib/types';

const ancientIndianNumerals: Source = {
  title: 'Unicode 17 · Brahmi and Kharoshthi numeral structures',
  url: 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-14/',
  detail:
    'Sections 14.1–14.2 distinguish early additive numerals from later positional digits; these are notation rules, not an arithmetic manual.',
};
const reconstruction = {
  add: 'reconstruction',
  subtract: 'reconstruction',
  multiply: 'reconstruction',
  divide: 'reconstruction',
} as const;

/** Scope is the selected notation, including its period and role in calculation. */
export const asianArithmeticProfiles: Record<string, ArithmeticEvidenceProfile> = {
  babylonian: {
    summary:
      'Old Babylonian scribes calculated with sexagesimal place values and learned numerical tables on clay tablets.',
    tool: 'Clay tablets, stylus, multiplication tables, and reciprocal tables.',
    notationRole:
      'The wedge groups are the numbers used in the calculation. Separators and explicit integer place labels are modern teaching aids.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'documented',
      divide: 'documented',
    },
    operationNotes: {
      add: 'Align sexagesimal places, combine their wedge quantities, and exchange sixty units of a place for one in the next. The illustrated carry sequence reconstructs the mechanics; it is not a transcription of a surviving addition instruction.',
      subtract:
        'Remove the matching quantities in each sexagesimal place. Where a place is short, exchange one of the next place for sixty of this place. The worked borrowing sequence is a teaching reconstruction.',
      multiply:
        'Use the tablet-table structure: multiples 1–20 and then 30, 40, 50. Split a multiplier such as 47 into 40 and 7, combine the corresponding products, and shift for sexagesimal places.',
      divide:
        'Multiply by the divisor’s reciprocal, as in the table tradition. A finite sexagesimal reciprocal exists only for a reduced denominator with prime factors 2, 3, and 5. Mark other reciprocal previews approximate, and preserve the exact quotient separately.',
    },
    sources: [
      {
        title: 'Duncan Melville · Old Babylonian multiplication tables',
        url: 'https://myslu.stlawu.edu/~dmel/mesomath/multiply.html',
        detail:
          'Analysis of school tablets, their principal numbers and table entries; multiplication-based division.',
      },
      {
        title: 'Open University · Babylonian mathematical tables',
        url: 'https://www.open.edu/openlearn/mod/oucontent/view.php?id=1976&printable=1',
        detail:
          'Reciprocal division and the difference between terminating and nonterminating sexagesimal reciprocals.',
      },
    ],
  },
  brahmi: {
    summary:
      'This exhibit selects early Brahmi’s separate unit and tens signs, not the later zero-bearing positional digits.',
    tool: 'Written numeral components; the specific calculating surface for these early forms is not established by the inspected sources.',
    notationRole:
      'The selected signs record amounts. Later Indian dust-board algorithms cannot be attributed automatically to early additive Brahmi.',
    evidence: reconstruction,
    operationNotes: {
      add: 'Combine the quantities represented by the unit signs and the dedicated tens signs, exchanging a completed ten for the appropriate tens amount. Re-encode with one dedicated tens sign, rather than displaying repeated ten signs as the final Brahmi numeral.',
      subtract:
        'Separate the tens amount and unit amount; exchange a ten for ten units when needed, remove the subtrahend, then choose the Brahmi signs for the remaining tens and units. This is an explicit reconstruction, not a quoted early algorithm.',
      multiply:
        'Expand the operand into the quantities of its actual Brahmi signs, find each repeated quantity, and combine the partial products. This is a notation-based reconstruction; do not label medieval Indian long multiplication an early Brahmi method.',
      divide:
        'Form whole groups of the divisor from the quantities represented by the Brahmi signs and retain any remainder. This grouping demonstration is reconstructed; the app’s 1–99 artwork range is not a historical limit on Indian arithmetic.',
    },
    sources: [ancientIndianNumerals],
  },
  kharoshthi: {
    summary:
      'Kharoshthi combines small tally groups, tens, twenties, and multiplied hundreds in right-to-left numeral strings.',
    tool: 'Written tally and denomination groups; a specific surviving four-operation calculating recipe was not identified in the inspected sources.',
    notationRole:
      'Its grouped quantity notation supplies the worked reconstruction. Writing direction does not by itself establish the direction of calculation.',
    evidence: reconstruction,
    operationNotes: {
      add: 'Combine small groups, regroup ten units as a ten and two tens as a twenty, then rewrite the result with Kharoshthi’s available 1–4 groups. Keep a hundred’s multiplier attached to its hundred sign; it is not an extra additive unit.',
      subtract:
        'Split a twenty into two tens or a ten into units as needed, remove the requested quantities, and rewrite the remainder right-to-left. The exchanges are a teaching reconstruction of the notation, not an attested Kharoshthi subtraction manual.',
      multiply:
        'Multiply the values of the actual tally, ten, twenty, and hundred groups, then recombine the products. A coefficient before a hundred belongs to that hundred group and must not be multiplied as an independent added tally.',
      divide:
        'Make equal divisor-sized groups from the represented quantities, splitting denomination groups where necessary, and record the quotient and remainder in the selected right-to-left notation. This is a reconstruction; do not import later positional Indian division.',
    },
    sources: [ancientIndianNumerals],
  },
  sinhala: {
    summary:
      'Sinhala Illakkam is the historical court-record notation. The separate Lith Illakkam system was used for astrological calculations.',
    tool: 'Written court and manuscript records; Lith Illakkam is a distinct calculation notation.',
    notationRole:
      'The app shows archaic Illakkam, which has dedicated tens and hundred/thousand multipliers. It must not silently switch to positional Lith digits.',
    evidence: {
      add: 'recording',
      subtract: 'recording',
      multiply: 'recording',
      divide: 'recording',
    },
    operationNotes: {
      add: 'Work with the quantities of the dedicated tens signs and the multiplied hundred/thousand groups, regroup the sum, and write its Illakkam signs. The recording rules are documented; this particular addition sequence is a teaching reconstruction.',
      subtract:
        'Exchange a hundred for tens or a ten for units where required, remove the requested quantity, and record the remaining amount in archaic Illakkam. Lith Illakkam’s documented calculation use does not establish this exact archaic subtraction procedure.',
      multiply:
        'Take products of the operand’s hundred/thousand groups, tens amount, and units, then write the total using Illakkam’s multiplier conventions. This is a worked recording reconstruction rather than a claimed court-scribe multiplication algorithm.',
      divide:
        'Partition the represented amount into whole divisor-sized groups, preserve the remainder, and write the quotient using archaic Illakkam. General astrological calculation belongs to Lith Illakkam and is not evidence for this exact division layout.',
    },
    sources: [
      {
        title: 'Sri Lanka Standards Institution · Sinhala numeral research, N3888',
        url: 'https://www.unicode.org/L2/L2010/10337-n3888-sinhala.pdf',
        detail:
          'Pages 1–4: original local research distinguishes court-record Illakkam from calculation-oriented Lith Illakkam and illustrates compound archaic numerals.',
      },
    ],
  },
  tamil: {
    summary:
      'Traditional Tamil arithmetic teaching used memorized Eṇcuvaṭi tables, including whole numbers, fractions, and measures, alongside written numerals.',
    tool: 'Recitation, memory, writing practice, and palm-leaf table books in the tiṇṇai school tradition.',
    notationRole:
      'The selected Tamil notation uses explicit ten, hundred, and thousand signs. The worked steps retain those quantity groups instead of changing to zero-bearing positional Tamil digits.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'documented',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Combine coefficients of like ten, hundred, and thousand signs; regroup a completed ten into the next named magnitude and rewrite the Tamil numeral. This particular sequence reconstructs the notation rather than quoting a surviving basic addition rule.',
      subtract:
        'Break a larger magnitude into ten of the next smaller magnitude when necessary, remove the subtrahend’s coefficients, and rewrite the remaining Tamil groups. The borrow demonstration is reconstructed, not a claim that every Tamil accountant used this sequence.',
      multiply:
        'Use the documented table-and-memory practice: find products for the unit coefficients, attach the explicit magnitudes, and accumulate partial quantities. The display is a modern worked application of the table tradition, not a facsimile of one manuscript’s layout.',
      divide:
        'Find how many divisor-sized quantities fit, using known table products as a modern teaching aid, then keep the remainder. The table tradition is documented, but the inspected Kaṇakkatikāram research says basic division is assumed rather than supplying this exact elementary recipe.',
    },
    sources: [
      {
        title: 'Senthil Babu · Texts, Practice and Practitioners (2022)',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10100452/',
        detail:
          'Original research on Eṇcuvaṭi table books, memorization, simultaneous recitation/writing, and accountant training in early modern Tamil society.',
      },
      {
        title: 'Wagner and Ashokan · Kaṇakkatikāram manuscript research (2024)',
        url: 'https://journals.library.ualberta.ca/hssa/index.php/hssa/article/view/103',
        detail:
          'Calculation Methods and the school context distinguish documented multiplication instruction from elementary operations assumed by the texts; the study primarily concerns Malayalam variants.',
      },
      {
        title: 'Unicode Technical Note 21 · Traditional Tamil quantities',
        url: 'https://www.unicode.org/notes/tn21/tamil_numbers.pdf',
        detail: 'Explicit powers 10, 100 and 1000, unlike modern positional Tamil writing.',
      },
    ],
  },
  rods: {
    summary:
      'Chinese counting rods are a calculating tool: digits can be removed, replaced, shifted, and regrouped on the working surface.',
    tool: 'A decimal rod board with separate working rows.',
    notationRole:
      'The rods hold intermediate quantities. Empty positions preserve place value; the app’s Song-period orientations differ from the older Sunzi convention.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'documented',
      divide: 'documented',
    },
    operationNotes: {
      add: 'Combine the rod quantities of equal places and exchange ten for one in the next position. The specific illustrated carry sequence is a teaching reconstruction from the rod-board representation.',
      subtract:
        'Remove equal-place quantities, exchanging one higher-place unit for ten lower-place units where needed. The illustration reconstructs a positive-integer board calculation; it does not erase the historical tradition’s separate signed-rod rules.',
      multiply:
        'Sunzi I §8 places the factors above and below a middle result row. Align the lower units with the upper leading digit, accumulate products in the middle, carry tens, remove each finished upper digit, and shift the lower row right.',
      divide:
        'Sunzi I §9 places the dividend in the middle, the divisor below, and quotient above. Align leading places, choose a quotient digit, subtract its divisor multiple from the middle row, and retreat the lower row right. Keep any remaining dividend as the remainder.',
    },
    sources: [
      {
        title: 'Sunzi Suanjing I §8 · Original multiplication rule and translation',
        url: 'https://yawnoc.github.io/sun-tzu/i/8',
        detail:
          'Chinese source text, edition links, English translation, and a worked explanation of the three-row procedure.',
      },
      {
        title: 'Sunzi Suanjing I §9 · Original division rule and translation',
        url: 'https://yawnoc.github.io/sun-tzu/i/9',
        detail:
          'The middle dividend, lower divisor, upper quotient, place alignment, and row shifts.',
      },
      {
        title: 'University of St Andrews · Chinese numerals and calculating surfaces',
        url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Chinese_numerals/',
        detail:
          'Decimal rod places, physical numeral conventions, and the transition to abacus calculation.',
      },
    ],
  },
  suzhou: {
    summary:
      'Merchants wrote Suzhou numerals in their books and used the abacus to compute prices, quantities, and balances.',
    tool: 'Chinese suanpan: lower beads count one, upper beads count five, with decimal columns.',
    notationRole:
      'Suzhou signs record operands and answers; calculation happens through bead movements. The intermediate display is a modern teaching layout.',
    evidence: {
      add: 'documented',
      subtract: 'documented',
      multiply: 'documented',
      divide: 'documented',
    },
    operationNotes: {
      add: 'Kwa’s 1922 manual adds from left to right. Move beads directly when possible; otherwise use complements: adding 3 can mean add 5 and remove 2, or adding 8 can mean carry 10 and remove 2. Record the final amount in Suzhou numerals.',
      subtract:
        'Kwa subtracts from left to right using inverse bead rules. Subtracting 3 from a five-bead means remove 5 and restore 2; a shortage across a column means remove 10 in the next column and restore the complement. Record the balance in Suzhou signs.',
      multiply:
        'Kwa documents a times table and in-place digit products. His one-digit method works right to left, cancels each finished multiplicand digit, and replaces it with product/carry beads. A separated partial-product display teaches the calculation without claiming to reproduce his exact frame layout.',
      divide:
        'Kwa documents division-table rules for single-digit divisors and subtracting division for longer divisors: take a provisional quotient from the leading divisor digit, subtract products of the remaining digits, and reduce an oversized quotient. The walkthrough may use a separated quotient/remainder layout and then record the answer in Suzhou.',
    },
    sources: [
      {
        title: 'Kwa Tak Ming · The Fundamental Operations in Bead Arithmetic (1922)',
        url: 'https://hdl.handle.net/2027/uc1.$b448675',
        detail:
          'Contemporaneous manual: pp. 10–13 addition, 14–16 subtraction, 17–25 multiplication, 26–38 division. The primary text supplies the calculation procedures.',
      },
      {
        title: 'LSE Working Paper 220 · Chinese merchant account books',
        url: 'https://www.lse.ac.uk/asset-library/information/wp220.pdf',
        detail:
          'Original archival research, pp. 18–19 and Appendix II: Suzhou recording plus off-book abacus calculations; the shape of the notation does not imply page algorithms.',
      },
      {
        title: 'Tsinghua University Science Museum · Ming Chinese abacus',
        url: 'https://tsm.tsinghua.edu.cn/?p=2769',
        detail:
          'A surviving late-Ming instrument and its one/five bead values and decimal carrying principle.',
      },
    ],
  },
  'old-persian': {
    summary:
      'Old Persian’s royal-inscription numerals are additive decimal amounts, distinct from Babylonian sexagesimal calculation.',
    tool: 'Inscribed numeral signs; the inspected Old Persian sources do not give a four-operation computing manual.',
    notationRole:
      'Achaemenid administration also used Elamite and Aramaic records. Their arithmetic evidence cannot automatically be relabeled an Old Persian numeral algorithm.',
    evidence: reconstruction,
    operationNotes: {
      add: 'Combine the actual 100, 20, 10, 2, and 1 sign quantities, then exchange equivalent groups such as two tens for a twenty. This is a notation-based reconstruction; it does not claim a sexagesimal carry because the shapes are wedge-like.',
      subtract:
        'Exchange a twenty for two tens, a ten for five twos, or a two for two ones as needed, remove the requested quantities, and rewrite the remainder. This reconstructs the selected additive signs rather than quoting an Achaemenid algorithm.',
      multiply:
        'Repeat the quantities of the operand’s actual sign groups and collect equivalent values into the product’s Old Persian signs. The repeated-group illustration is reconstructed and is not Babylonian table multiplication.',
      divide:
        'Partition the represented amount into divisor-sized groups, splitting 20/10/2/1 groups where necessary, and preserve the remainder. This is a reconstruction; no general Old Persian written division procedure was established in the inspected sources.',
    },
    sources: [
      {
        title: 'Everson · Old Persian numeral evidence and inventory, N2583',
        url: 'https://www.unicode.org/L2/L2003/03149-n2583-old-persian.pdf',
        detail:
          'Monumental context, left-to-right writing, cumulative 1/2/10/20/100 sign examples; notation evidence rather than an arithmetic manual.',
      },
      {
        title: 'Encyclopaedia Iranica · Persepolis Elamite Tablets',
        url: 'https://www.iranicaonline.org/articles/persepolis-elamite-tablets/',
        detail:
          'The language and administrative role of Achaemenid accounting records; cautions against conflating them with Old Persian royal inscriptions.',
      },
    ],
  },
  phoenician: {
    summary:
      'Phoenician amount notation groups unit tallies and uses dedicated ten and twenty signs, written right-to-left.',
    tool: 'Written tally and denomination groups. A specific abacus or four-operation recipe is not established by the inspected Phoenician sources.',
    notationRole:
      'The marks record quantities; rearranging or exchanging them in the lesson is an explicit teaching reconstruction.',
    evidence: reconstruction,
    operationNotes: {
      add: 'Merge unit tally groups, exchange ten units for a ten sign and two tens for a twenty, then clump remaining units in groups of three, two, and one. Write the result right-to-left; this is reconstructed arithmetic on documented sign values.',
      subtract:
        'Open a twenty into two tens or a ten into unit tallies when needed, cancel the requested quantities, and reclump the surviving unit marks. The source documents the tally notation, not this exact cancellation sequence.',
      multiply:
        'Repeat the quantities of the actual twenty, ten, and unit-tally groups, collect their products, then write the answer with Phoenician groups. Do not infer use of Egyptian doubling or Greek counters merely from trading contact.',
      divide:
        'Make equal divisor-sized groups from the represented tally quantities, exchange denominations where needed, and retain the remainder. This is a teaching reconstruction; right-to-left writing alone does not establish a historical division direction.',
    },
    sources: [
      {
        title: 'Everson · Phoenician number research, N3284',
        url: 'https://www.unicode.org/L2/L2007/07206-n3284-phoenician.pdf',
        detail:
          'Inscription-based one/two/three tally clumps, ten and twenty signs, right-to-left numerical examples, and the separate multiplicative hundred convention.',
      },
    ],
  },
  'ottoman-siyaq': {
    summary:
      'Ottoman accountants learned calculation and Siyaq record-writing together. Their manuals also teach Hindu digits and decimal arithmetic.',
    tool: 'Accountant manuals and financial registers; calculation and specialized Siyaq recording are distinct parts of the practice.',
    notationRole:
      'The selected Siyaq signs denote complete amounts in each decimal order. The illustrated arithmetic does not turn them into positional Hindu digits.',
    evidence: {
      add: 'recording',
      subtract: 'recording',
      multiply: 'recording',
      divide: 'recording',
    },
    operationNotes: {
      add: 'Total equal decimal-order quantities, normalize the sum, and write it with the appropriate Siyaq order signs. Ottoman manuals document addition training; this displayed order-by-order route is a teaching reconstruction, not a transcribed Siyaq column-addition rule.',
      subtract:
        'Determine the balance by exchanging amounts between decimal orders and removing the expense, then write the result with Siyaq’s compound order. The source-backed accounting context does not establish the exact illustrated borrowing layout.',
      multiply:
        'Accountant manuals include times tables, decimal-order products, and several multiplication methods. The walkthrough multiplies the operand’s represented order quantities and writes the total in Siyaq; it must not claim that the recorded Siyaq signs prove one exclusive multiplication algorithm.',
      divide:
        'Accountant manuals teach division and proportional distribution, while Siyaq records amounts. The walkthrough uses whole quotient groups and a remainder before Siyaq recording; the inspected sources do not establish this as a unique Siyaq division recipe.',
    },
    sources: [
      {
        title: 'İhsan Fazlıoğlu · Ottoman classical accounting mathematics (2003)',
        url: 'https://dergipark.org.tr/tr/download/article-file/651470',
        detail:
          'Original manuscript survey: accountant training, Hindu notation, four operations, and the multiple calculation traditions behind Siyaq financial records.',
      },
      {
        title: 'Pandey · Ottoman Siyaq number proposal (2017)',
        url: 'https://www.unicode.org/L2/L2017/17348-ottoman-siyaq.pdf',
        detail:
          'Order signs, right-to-left compound ordering, historical register examples, and specialized multiplier/fraction conventions.',
      },
    ],
  },
};
