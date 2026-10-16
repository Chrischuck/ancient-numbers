import type { Rational, RenderToken, Source, SystemDefinition } from './types';
import { baseDigits, calculate, rational } from './numbers';
import { represent } from './format';
import { oksapminPositions } from './pacific-counts';
import type { CalculationWorkspace } from './arithmetic-workspace';
import type { EvidenceKind } from './arithmetic-evidence';
import { babylonianNativeLesson } from './babylonian-arithmetic';
import { nativePositionalLesson } from './native-arithmetic';

export interface OperationPart {
  text: string;
  hint?: string;
  tokens?: RenderToken[];
  workspace?: CalculationWorkspace;
}
export interface OperationTable {
  caption: string;
  headings: string[];
  rows: {
    selected?: boolean;
    cells: { text: string; hint?: string; tokens?: RenderToken[] }[];
  }[];
  fullLabel?: string;
}
export interface OperationLesson {
  title: string;
  text: string;
  evidence: string;
  evidenceKind?: EvidenceKind;
  equation: string;
  parts?: OperationPart[];
  notes?: string[];
  sources: Source[];
  table?: OperationTable;
  referenceTables?: OperationTable[];
}
interface Calculation {
  first: Rational;
  second: Rational;
  operation: string;
}
const names: Record<string, string> = {
  add: 'Addition',
  subtract: 'Subtraction',
  multiply: 'Multiplication',
  divide: 'Division',
};
const signs: Record<string, string> = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
const egyptianSources: Source[] = [
  {
    title: 'Rhind Mathematical Papyrus · Chace translation',
    url: 'https://en.wikisource.org/wiki/Page:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf/20',
  },
  {
    title: 'Open University · Egyptian calculation',
    url: 'https://www.open.edu/openlearn/science-maths-technology/mathematics-statistics/egyptian-mathematics/content-section-1.1.2',
  },
];
const egyptianEvidence: Source = {
  title: 'Katz · History of Mathematics, §1.3: Egyptian arithmetic evidence',
  url: 'https://bpb-us-e1.wpmucdn.com/sites.tufts.edu/dist/8/3572/files/2015/11/katz-ancient-arith.pdf',
};
const rodSource: Source = {
  title: 'University of St Andrews · Chinese counting-board numerals',
  url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Chinese_numerals/',
};
const rodAlgorithm = (division: boolean): Source => ({
  title: `Sunzi Suanjing I §${division ? 9 : 8} · ${division ? 'division' : 'multiplication'}, translated by Conway`,
  url: `https://yawnoc.github.io/sun-tzu/i/${division ? 9 : 8}`,
});
const romanSources: Source[] = [
  {
    title: 'Oxford Classical Dictionary · Abacus',
    url: 'https://doi.org/10.1093/acrefore/9780199381135.013.1',
  },
  {
    title: 'University of Reading · Experimental reconstruction of Roman arithmetic',
    url: 'https://blogs.reading.ac.uk/classics-at-reading/2025/09/19/roman-arithmetic-for-all/',
  },
];
const kaktovikSource: Source = {
  title: 'Marín Silva, Miller & Strand · Kaktovik classroom arithmetic, pp. 1–2',
  url: 'https://www.unicode.org/L2/L2021/21058-kaktovik-numerals.pdf',
};
const mayaSource: Source = {
  title: 'Rojo-Garibaldi et al. · Mesoamerican positional number representation',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8022160/',
};

const textValue = (n: Rational): string =>
  n.denominator === 1n ? String(n.numerator) : `${n.numerator}/${n.denominator}`;

// Do not flood the page with repeated glyphs for a large teaching example.
function tokens(system: SystemDefinition, n: bigint): RenderToken[] | undefined {
  if (n < 0n || n > BigInt(system.max) || (n === 0n && !system.zero)) return;
  const result = represent(rational(n), system);
  return result.status === 'ok' && result.tokens.length <= 24 ? result.tokens : undefined;
}
function repeated(glyph: string, count: bigint, label: string): RenderToken[] | undefined {
  if (count > 24n) return;
  return Array.from({ length: Number(count) }, () => ({ glyph, label }));
}

export interface ColumnChange {
  place: bigint;
  x: bigint;
  y: bigint;
  carry: bigint;
  raw: bigint;
  digit: bigint;
  board: bigint;
  exchanges: { from: bigint; to: bigint }[];
}

/** Actual exchanges across empty columns, rather than an unexplained negative carry. */
export function arithmeticColumns(
  a: bigint,
  b: bigint,
  base: number,
  subtract: boolean,
): ColumnChange[] {
  const radix = BigInt(base);
  const changes: ColumnChange[] = [];
  if (!subtract) {
    let left = a;
    let right = b;
    let carry = 0n;
    let place = 1n;
    let board = a;
    do {
      const x = left % radix;
      const y = right % radix;
      const raw = x + y + carry;
      board += y * place;
      changes.push({ place, x, y, carry, raw, digit: raw % radix, board, exchanges: [] });
      carry = raw / radix;
      left /= radix;
      right /= radix;
      place *= radix;
    } while (left || right || carry);
    return changes;
  }
  if (a < b) return changes;
  const digits = baseDigits(a, base).reverse().map(BigInt);
  const removed = baseDigits(b, base).reverse().map(BigInt);
  let board = a;
  for (let i = 0; i < digits.length; i++) {
    const place = radix ** BigInt(i);
    const y = removed[i] ?? 0n;
    if (!y && !digits[i]) continue;
    const exchanges: ColumnChange['exchanges'] = [];
    if (digits[i] < y) {
      let donor = i + 1;
      while (digits[donor] === 0n) donor++;
      // a >= b guarantees that a donor exists whenever this column needs one.
      for (let j = donor; j > i; j--) {
        digits[j] -= 1n;
        digits[j - 1] += radix;
        exchanges.push({ from: radix ** BigInt(j), to: radix ** BigInt(j - 1) });
      }
    }
    const x = digits[i];
    digits[i] -= y;
    board -= y * place;
    changes.push({ place, x, y, carry: 0n, raw: x - y, digit: x - y, board, exchanges });
  }
  return changes;
}
const columns = arithmeticColumns;

const egyptianSign = (place: bigint): string =>
  ({
    '1': 'unit stroke',
    '10': 'ten sign (hobble)',
    '100': 'hundred sign (rope coil)',
    '1000': 'thousand sign (lotus)',
    '10000': 'ten-thousand sign (finger)',
    '100000': 'hundred-thousand sign',
    '1000000': 'million sign',
  })[String(place)] ?? `sign worth ${place}`;

function egyptian(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: string,
  equation: string,
): OperationLesson {
  const subtract = operation === 'subtract';
  if (operation === 'add' || subtract) {
    const evidence =
      'Teaching reconstruction: the repeated hieroglyphic signs support these exchanges. Surviving mathematical papyri usually give addition and subtraction answers without recording the procedure; they use hieratic writing.';
    if (subtract && a < b)
      return {
        title: 'Subtraction · removing like signs',
        text: 'Removing the second quantity would exhaust the first. This sign-removal demonstration covers nonnegative differences; the signed answer below uses modern arithmetic.',
        evidence,
        equation,
        sources: [egyptianEvidence, ...egyptianSources],
      };
    if (
      a > BigInt(system.max) ||
      b > BigInt(system.max) ||
      (!subtract && a + b > BigInt(system.max))
    )
      return {
        title: `${names[operation]} · ${subtract ? 'removing' : 'combining'} like signs`,
        text: 'Combine signs of the same value to add; remove them to subtract. Exchanges use ten signs for one of the next value. An operand or the resulting total exceeds the hieroglyph repertoire illustrated here, so no extra signs are invented.',
        evidence,
        equation,
        sources: [egyptianEvidence, ...egyptianSources],
      };
    const parts: OperationPart[] = columns(a, b, 10, subtract).map((change) => {
      const sign = egyptianSign(change.place);
      const exchanges = change.exchanges
        .map(({ from, to }) => `Exchange one ${egyptianSign(from)} for ten ${egyptianSign(to)}s.`)
        .join(' ');
      return {
        text: subtract
          ? `${exchanges}${exchanges ? ' ' : ''}At value ${change.place}, remove ${change.y} ${sign}s from ${change.x}: ${change.x} − ${change.y} = ${change.digit} remain.`
          : `Gather the ${sign}s: ${change.x} + ${change.y}${change.carry ? ` + ${change.carry} exchanged from below` : ''} = ${change.raw}.${change.raw >= 10n ? ` Exchange ten for one ${egyptianSign(change.place * 10n)}; leave ${change.digit} here.` : ` Keep ${change.digit} here.`}`,
        tokens: system.values?.some((entry) => BigInt(entry.value) === change.place)
          ? repeated(
              `egyptian-${change.place}`,
              subtract ? change.digit : change.raw,
              `${sign}, worth ${change.place}`,
            )
          : undefined,
      };
    });
    parts.push({
      text: `${subtract ? 'The signs left' : 'The regrouped signs'} total ${a + (subtract ? -b : b)}.`,
      tokens: tokens(system, a + (subtract ? -b : b)),
    });
    return {
      title: `${names[operation]} · ${subtract ? 'removing' : 'combining'} like signs`,
      text: subtract
        ? 'Remove the second number’s signs from the first. If there are too few of a kind, exchange one higher sign for ten lower signs before removing.'
        : 'Gather signs of equal value. Replace each group of ten identical signs with one sign worth ten times as much.',
      evidence,
      equation,
      parts,
      sources: [egyptianEvidence, ...egyptianSources],
      notes: [
        'The pictures are hieroglyphic teaching transcriptions, not facsimiles of a scribe’s hieratic working. A zero total means no signs remain; this repertoire has no zero sign.',
      ],
    };
  }
  const multiplying = operation === 'multiply';
  const count = multiplying ? a : b ? a / b : 0n;
  const amount = b;
  const remainder = multiplying ? 0n : a % b;
  const evidence =
    'Documented method: the Rhind papyrus uses selected multiples, often built by doubling. The table below applies that method to your operands in hieroglyphic transcription; the papyrus itself uses hieratic.';
  const keptCounts: bigint[] = [];
  const keptAmounts: bigint[] = [];
  const rows: NonNullable<OperationLesson['table']>['rows'] = [];
  for (let copies = 1n; copies <= count || (!multiplying && copies === 1n); copies *= 2n) {
    const selected = Boolean(count & copies);
    const value = copies * amount;
    if (selected) {
      keptCounts.push(copies);
      keptAmounts.push(value);
    }
    rows.push({
      selected,
      cells: [
        { text: selected ? 'Keep' : 'Skip' },
        { text: String(copies), tokens: tokens(system, copies) },
        { text: String(value), tokens: tokens(system, value) },
      ],
    });
  }
  const displayedRows = rows.length > 10 ? [...rows.slice(0, 5), ...rows.slice(-5)] : rows;
  const parts: OperationPart[] = [
    { text: `Selected copy counts: ${keptCounts.join(' + ') || '0'} = ${count}.` },
    {
      text: `Selected amounts: ${keptAmounts.join(' + ') || '0'} = ${count * amount}.`,
      tokens: tokens(system, count * amount),
    },
  ];
  if (!multiplying && remainder)
    parts.push(
      {
        text: `Complete the whole-number stage: ${a} − ${count * amount} = ${remainder} remains. Another whole copy of ${b} is larger than this remainder, so ${count} is the whole-number quotient.`,
        tokens: tokens(system, remainder),
      },
      {
        text: `The exact modern annotation is ${count} + ${remainder}/${b} = ${textValue(rational(a, b))}. The signs show only the ${count} whole copies. Egyptian scribes could continue with unit fractions; this exhibit does not reconstruct their fractional completion procedure or invent its signs.`,
        tokens: tokens(system, count),
      },
    );
  return {
    title: multiplying
      ? 'Multiplication · doubling and selecting'
      : 'Division · finding the missing multiplier',
    text: multiplying
      ? `Make ${a} copies of ${b}. Begin with one copy; double both columns, then keep the rows whose copy counts total ${a}.`
      : `Double the divisor ${b}. ${remainder ? `Keep the largest combination of whole multiples that does not exceed the dividend ${a}; then identify the remainder.` : `Keep rows whose amounts total the dividend ${a}.`} The sum of the kept copy counts is the whole-number quotient.`,
    evidence,
    equation,
    sources: egyptianSources,
    table: {
      caption: `Each successive row doubles both columns.${rows.length > 10 ? ` The middle ${rows.length - 10} rows are abbreviated; all selected amounts are included below.` : ''} Keep marks are modern teaching aids.`,
      headings: ['Use', 'Copies', 'Amount'],
      rows: displayedRows,
    },
    parts,
    notes: ['Tables beyond ten rows and dense sign groups are abbreviated.'],
  };
}

function babylonian(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: string,
  _equation: string,
): OperationLesson {
  return operation === 'multiply' || operation === 'divide'
    ? babylonianNativeLesson(system, a, b, operation)
    : nativePositionalLesson(system, a, b, operation as 'add' | 'subtract');
}

function rodBoard(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: string,
  equation: string,
): OperationLesson {
  if (operation === 'multiply') {
    let product = 0n;
    const digits = a.toString().split('').map(BigInt);
    const parts: OperationPart[] = [
      {
        text: `Put ${a} in the upper row and ${b} in the lower row. Leave the middle row for the product. Shift the lower row so its units lie beneath the upper row’s leading digit.`,
        tokens: tokens(system, a),
      },
    ];
    digits.forEach((digit, i) => {
      const place = 10n ** BigInt(digits.length - i - 1);
      const amount = digit * b * place;
      product += amount;
      parts.push({
        text: `Upper digit ${digit}, worth ${digit * place}: operate on the shifted lower row, ${digit} × ${b} × ${place} = ${amount}. Add this to the middle row, carrying tens immediately: ${product}. Remove the finished upper digit${i < digits.length - 1 ? ' and shift the lower row one place right' : ''}.`,
        tokens: tokens(system, product),
      });
    });
    return {
      title: 'Multiplication · Sunzi’s three-row rod method',
      text: 'Work through the upper number from left to right. Products accumulate in the middle row; rods can be removed, replaced, and carried as the calculation proceeds.',
      evidence:
        'Documented algorithm: Sunzi Suanjing I §8 describes the rows, carrying, removal, and shifts. The board values below are a worked application; the displayed rod orientations follow this exhibit’s later convention.',
      equation,
      parts,
      sources: [rodAlgorithm(false), rodSource],
    };
  }
  if (operation === 'divide') {
    const parts: OperationPart[] = [
      {
        text: `Put dividend ${a} in the middle row, divisor ${b} below it, and leave the top row for the quotient. Shift the divisor left to test the largest possible place.`,
        tokens: tokens(system, a),
      },
    ];
    let place = 1n;
    while (b * place * 10n <= a) place *= 10n;
    let remainder = a;
    let quotient = 0n;
    do {
      const shifted = b * place;
      const digit = remainder / shifted;
      const amount = digit * shifted;
      remainder -= amount;
      quotient += digit * place;
      parts.push({
        text: `At quotient place ${place}, ${digit} copies of the shifted divisor ${shifted} fit. Put ${digit} in that top-row place; remove ${amount} from the middle row, leaving ${remainder}.${place > 1n ? ' Shift the divisor one place right.' : ''}`,
        tokens: tokens(system, remainder),
      });
      place /= 10n;
    } while (place);
    parts.push({
      text: remainder
        ? `The quotient row reads ${quotient}. Sunzi names the remainder with the divisor as denominator: ${quotient} + ${remainder}/${b} = ${textValue(rational(a, b))}.`
        : `The middle row is empty. The quotient row reads ${quotient}.`,
      tokens: tokens(system, quotient),
    });
    return {
      title: 'Division · shifting and removing on the rod board',
      text: 'Align the divisor, choose each quotient digit, and remove its product from the dividend row. Moving the divisor right determines the next quotient place.',
      evidence:
        'Documented algorithm: Sunzi Suanjing I §9 places the quotient above the working dividend and treats a remainder as a fraction. This example applies those instructions to your operands.',
      equation,
      parts,
      sources: [rodAlgorithm(true), rodSource],
    };
  }
  const subtract = operation === 'subtract';
  const evidence =
    'Historical tool, teaching reconstruction: rod-board arithmetic is documented. These combine/remove moves illustrate the board’s decimal places rather than transcribing a specific ancient problem.';
  if (subtract && a < b)
    return {
      title: 'Subtraction · removing rods from the board',
      text: 'This example covers nonnegative differences. Chinese rod mathematics also had signed-number procedures, which this panel does not reconstruct.',
      evidence,
      equation,
      sources: [rodSource],
    };
  const parts: OperationPart[] = [
    {
      text: `Set out ${a} on the board. Align ${b} by the units square. Empty squares mean no amount in that place.`,
      tokens: tokens(system, a),
    },
  ];
  for (const c of columns(a, b, 10, subtract))
    parts.push({
      text: subtract
        ? `${c.exchanges.map(({ from, to }) => `Replace one group worth ${from} with ten worth ${to}.`).join(' ')}${c.exchanges.length ? ' ' : ''}At place ${c.place}, remove ${c.y} from ${c.x}: ${c.x} − ${c.y} = ${c.digit}. Replace the rod digit with ${c.digit}; the board now totals ${c.board}.`
        : `At place ${c.place}, ${c.x} + ${c.y}${c.carry ? ` + ${c.carry} carried` : ''} = ${c.raw}. Replace the digit’s rods with the form for ${c.digit}${c.raw >= 10n ? ' and add one to the next square' : ''}. The board now totals ${c.board}.`,
      tokens: tokens(system, c.board),
    });
  return {
    title: `${names[operation]} · ${subtract ? 'removing rods' : 'combining rods'} on the board`,
    text: subtract
      ? 'Change the rod digits in matching squares. When a square is short, exchange one group from the left for ten in the square to its right.'
      : 'Add the quantities in matching board squares. Replace each rod digit with the new shape; ten in a square becomes one in the next square to the left.',
    evidence,
    equation,
    parts,
    sources: [rodSource],
  };
}

function roman(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: string,
  equation: string,
): OperationLesson {
  const evidence =
    'Teaching reconstruction: Roman abaci survive, but their complete operating instructions do not. These counter moves are a plausible demonstration of the tool, not a recovered universal Roman algorithm.';
  const counterText = (value: bigint) =>
    baseDigits(value, 10)
      .reverse()
      .flatMap((digit, i) =>
        digit
          ? [
              `place ${10n ** BigInt(i)}: ${Math.floor(digit / 5)} five-counter and ${digit % 5} unit counters`,
            ]
          : [],
      )
      .join('; ') || 'all columns empty';
  if (operation === 'add' || operation === 'subtract') {
    const subtract = operation === 'subtract';
    if (subtract && a < b)
      return {
        title: 'Subtraction · removing abacus counters',
        text: 'This counter-removal demonstration stops when no counters remain; the signed difference below uses modern arithmetic.',
        evidence,
        equation,
        sources: romanSources,
      };
    const parts: OperationPart[] = [{ text: `Set the abacus to ${a}: ${counterText(a)}.` }];
    for (const c of columns(a, b, 10, subtract))
      parts.push({
        text: subtract
          ? `${c.exchanges.map(({ from, to }) => `Exchange one counter worth ${from} for two five-counters worth ${5n * to}, then open a five-counter into five counters worth ${to} as needed.`).join(' ')}${c.exchanges.length ? ' ' : ''}At place ${c.place}, remove ${c.y} from ${c.x}, leaving ${c.digit}. The active counters represent ${c.board}.`
          : `At place ${c.place}, add ${c.y}${c.carry ? ` and ${c.carry} carried` : ''} to ${c.x}: ${c.raw}. Every five unit counters become one five-counter; two five-counters become one in the next column. Leave ${c.digit / 5n} five-counter and ${c.digit % 5n} unit counters here. The abacus totals ${c.board}.`,
      });
    parts.push({
      text: `Record the counter total ${a + (subtract ? -b : b)} in Roman numerals.`,
      tokens: tokens(system, a + (subtract ? -b : b)),
    });
    return {
      title: `${names[operation]} · ${subtract ? 'removing' : 'combining'} abacus counters`,
      text: subtract
        ? 'Remove counters in matching columns, opening higher counters into lower values when needed.'
        : 'Activate counters of the same value, exchanging five units for a five-counter and two fives for one ten.',
      evidence,
      equation,
      parts,
      sources: romanSources,
      notes: [
        'Counter language describes quantities and exchanges, not a claim that ten loose counters fit at once on a surviving pocket abacus. The Roman numeral records the answer after the counter calculation.',
      ],
    };
  }
  if (operation === 'multiply') {
    const count = a < b ? a : b;
    const amount = a < b ? b : a;
    const parts: OperationPart[] = [
      {
        text: `Set an accumulator to zero. Add ${amount} in counters for each of ${count} copies, exchanging five units and two fives as needed.`,
      },
    ];
    if (count <= 8n)
      for (let i = 1n; i <= count; i++)
        parts.push({
          text: `Copy ${i}: the accumulator is ${i * amount}. ${counterText(i * amount)}.`,
        });
    else
      parts.push({
        text: `After ${count} copies, the accumulator is ${count * amount}. The repeated moves are abbreviated here.`,
      });
    parts.push({ text: `Record ${a * b} in Roman numerals.`, tokens: tokens(system, a * b) });
    return {
      title: 'Multiplication · repeated groups on an abacus',
      text: 'A counter board can accumulate repeated copies of a quantity. This illustrates how multiplication can be performed with the counting tool alongside Roman writing.',
      evidence,
      equation,
      parts,
      sources: romanSources,
    };
  }
  const quotient = a / b;
  const remainder = a % b;
  const parts: OperationPart[] = [
    {
      text: `Set ${a} on the abacus. Remove groups of ${b}, exchanging higher counters into lower values when required; tally the groups removed.`,
    },
  ];
  if (quotient <= 8n)
    for (let i = 1n; i <= quotient; i++)
      parts.push({ text: `Remove group ${i}: ${a - (i - 1n) * b} − ${b} = ${a - i * b} remains.` });
  else
    parts.push({
      text: `${quotient} groups remove ${quotient * b}. The repeated moves are abbreviated here.`,
    });
  parts.push({
    text: `${quotient} whole groups have been removed; ${remainder} remains.${remainder ? ` The exact modern answer is ${quotient} + ${remainder}/${b} = ${textValue(rational(a, b))}; no Roman fraction notation is supplied here.` : ''}`,
    tokens: tokens(system, quotient),
  });
  return {
    title: 'Division · removing groups of counters',
    text: 'Use a tally to count how many equal groups can be removed from the dividend’s counters.',
    evidence,
    equation,
    parts,
    sources: romanSources,
  };
}

function twentyBased(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: string,
  equation: string,
): OperationLesson | undefined {
  const kaktovik = system.id === 'kaktovik';
  const sources = [kaktovik ? kaktovikSource : mayaSource];
  if (operation === 'multiply' || (!kaktovik && operation === 'divide')) return;
  if (operation === 'divide') {
    let place = 1n;
    while (b * place * 20n <= a) place *= 20n;
    let remainder = a;
    const parts: OperationPart[] = [
      {
        workspace: {
          kind: 'inupiaq-abacus',
          value: String(a),
          caption: 'The Iñupiaq abacus holds the dividend in twenties.',
        },
        text: `Look for copies of divisor ${b} in dividend ${a}. Begin with the divisor shifted to its largest fitting base-twenty place.`,
        tokens: tokens(system, a),
      },
    ];
    do {
      const before = remainder;
      const shifted = b * place;
      const count = remainder / shifted;
      remainder -= count * shifted;
      parts.push({
        workspace: {
          kind: 'inupiaq-abacus',
          value: String(remainder),
          previous: String(before),
          caption: 'Remove the selected divisor groups; this board tracks the dividend remaining.',
        },
        text: `At place ${place}, trace ${count} copies of the shifted divisor (${shifted}) and remove those strokes, regrouping if needed. This supplies ${count * place} to the quotient; ${remainder} remains.${place > 1n ? ' Move one place right.' : ''}`,
        tokens: tokens(system, remainder),
      });
      place /= 20n;
    } while (place);
    parts.push({
      text: `${a / b} whole copies fit.${remainder ? ` Remainder ${remainder}; the exact answer is ${textValue(rational(a, b))}.` : ' No strokes remain.'}`,
      tokens: tokens(system, a / b),
    });
    return {
      title: 'Division · graphical chunking',
      text: 'Match groups of the divisor’s strokes inside the dividend and count partial quotients. Shifted copies represent groups of twenty, four hundred, and larger places.',
      evidence:
        'Documented classroom method: the Kaktovik numerals proposal describes matching divisor shapes and partial quotients. These sign groups illustrate your calculation; no colored tracing animation is implied.',
      equation,
      parts,
      sources,
    };
  }
  const subtract = operation === 'subtract';
  const evidence = kaktovik
    ? 'Documented classroom practice: students combine or remove the digits’ strokes. This worked example applies the five-and-twenty exchanges described in the Kaktovik numerals proposal.'
    : 'Teaching reconstruction: Maya dot-and-bar numerals are attested, but the source does not document this as a general ancient arithmetic algorithm. This example applies combining and removal to the exhibit’s pure base-twenty layout.';
  if (subtract && a < b)
    return {
      title: 'Subtraction · removing matching marks',
      text: 'This demonstration removes marks only while the first quantity is sufficient. The signed difference below uses modern arithmetic.',
      evidence,
      equation,
      sources,
    };
  const unit = kaktovik ? 'unit stroke' : 'dot';
  const five = kaktovik ? 'five-stroke' : 'bar';
  let previousBoard = a;
  const parts = columns(a, b, 20, subtract).map((c, index): OperationPart => {
    const exchange = c.exchanges
      .map(
        ({ from, to }) =>
          `Open one group worth ${from} into twenty at place ${to}, represented by four ${five}s.`,
      )
      .join(' ');
    const before = previousBoard;
    previousBoard = c.board;
    return {
      workspace:
        kaktovik && (index === 0 || before !== c.board)
          ? {
              kind: 'inupiaq-abacus',
              value: String(c.board),
              previous: String(before),
              caption:
                'Exchange five unit beads for one five-bead, and four fives for one in the next twenty-place.',
            }
          : undefined,
      text: subtract
        ? `${exchange}${exchange ? ' ' : ''}At place ${c.place}, remove the shape for ${c.y} from ${c.x}.${c.x % 5n < c.y % 5n ? ` Exchange one ${five} for five ${unit}s first.` : ''} Leave ${c.digit / 5n} ${five}s and ${c.digit % 5n} ${unit}s: ${c.x} − ${c.y} = ${c.digit}.`
        : `At place ${c.place}: ${c.x} + ${c.y}${c.carry ? ` + ${c.carry} carried` : ''} = ${c.raw}. Join like marks; five ${unit}s make one ${five}, and four ${five}s make one in the next place. Leave ${c.digit / 5n} ${five}s and ${c.digit % 5n} ${unit}s here.`,
      tokens: [
        {
          glyph: `${system.id}-${c.digit}`,
          place: String(c.place),
          label: `${c.digit} in the place worth ${c.place}`,
        },
      ],
    };
  });
  parts.push({
    text: `The remaining place groups total ${a + (subtract ? -b : b)}.`,
    tokens: tokens(system, a + (subtract ? -b : b)),
  });
  return {
    title: `${names[operation]} · ${subtract ? 'removing' : 'combining'} ${kaktovik ? 'strokes' : 'dots and bars'}`,
    text: subtract
      ? `Remove matching ${unit}s and ${five}s, exchanging a higher group or a ${five} when needed.`
      : `Combine ${unit}s and ${five}s in matching places, exchanging five ones and twenty of a place as needed.`,
    evidence,
    equation,
    parts,
    sources,
    notes: kaktovik
      ? undefined
      : [
          'This example uses places 1, 20, 400, …; it does not use the Long Count’s 360-day third position.',
        ],
  };
}

function oksapmin(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: string,
  equation: string,
): OperationLesson | undefined {
  if (operation !== 'add' && operation !== 'subtract') return;
  const subtract = operation === 'subtract';
  const result = a + (subtract ? -b : b);
  const sources: Source[] = [
    {
      title: 'Geoffrey Saxe (2015) · Oksapmin body arithmetic in changing classrooms',
      url: 'https://journals.sagepub.com/doi/10.1080/02103702.2015.1054669',
    },
  ];
  const evidence =
    'Observed modern adaptation: Saxe documents arithmetic strategies developed amid changing schooling and economic exchange. Teachers coordinated English counts with body positions. This example applies that keeping-track strategy; it is not a timeless ancient algorithm.';
  const title = `${names[operation]} · tracking ${subtract ? 'backward' : 'forward'} on the body path`;
  if (a < 1n || a > 27n || b < 1n || b > 27n || result < 1n || result > 27n)
    return {
      title,
      text: 'This demonstration uses whole-number operands and an answer within positions 1–27. The calculation reaches beyond that first-traversal exhibit boundary; no zero position, negative position, or extended traversal is invented.',
      evidence,
      equation,
      sources,
    };
  const position = (value: bigint) => oksapminPositions[Number(value) - 1];
  const start = position(a);
  const parts: OperationPart[] = [
    {
      text: `Begin at ${start.part}, position ${a}. Keep a separate count of the ${b} ${subtract ? 'positions removed' : 'steps added'} so the starting amount and the amount of change are not confused.`,
      tokens: tokens(system, a),
    },
  ];
  const shown = b < 10n ? b : 10n;
  for (let i = 1n; i <= shown; i++) {
    const current = a + (subtract ? -(i - 1n) : i - 1n);
    const next = a + (subtract ? -i : i);
    parts.push({
      text: subtract
        ? `Count removal ${i} at ${position(current).part} (${current}), then move back to ${position(next).part} (${next}). The running amount is ${next}.`
        : `Count added step ${i}: move forward from ${position(current).part} (${current}) to ${position(next).part} (${next}). The running amount is ${next}.`,
      tokens: tokens(system, next),
    });
  }
  if (shown < b)
    parts.push({
      text: `Continue the same keeping-track procedure for the remaining ${b - shown} ${subtract ? 'removals' : 'added steps'}, stopping when the separate count reaches ${b}. These intermediate pictures are abbreviated.`,
    });
  parts.push({
    text: `After ${b} ${subtract ? 'removals' : 'added steps'}, finish at ${position(result).part}, position ${result}: ${equation}.`,
    tokens: tokens(system, result),
  });
  return {
    title,
    text: subtract
      ? 'Track the number being removed while moving backward along the ordered body path. Each removed position lowers the running amount by one.'
      : 'Track the added count while moving forward along the ordered body path. Each new position increases the running amount by one.',
    evidence,
    equation,
    parts,
    sources,
    notes: [
      'Body positions are an ordered count, not positional base-27 digits. Saxe distinguishes traditional enumeration from later arithmetic adaptations and reports changes across generations and classrooms.',
      ...(subtract
        ? [
            'The subtraction example in the ethnographic account counts the removed positions from 16 through 10 and leaves position 9. A separate count prevents losing track of how many positions have been removed.',
          ]
        : []),
    ],
  };
}

/** Nonnegative, bounded worked applications; exact arithmetic remains in numbers.ts. */
export function operationLesson(
  system: SystemDefinition,
  calculation: Calculation,
): OperationLesson | undefined {
  const { first, second, operation } = calculation;
  const a = first.numerator;
  const b = second.numerator;
  const result = calculate(first, second, operation);
  const equation = `${a} ${signs[operation]} ${b} = ${textValue(result)}`;
  if (system.id === 'egyptian') return egyptian(system, a, b, operation, equation);
  if (system.id === 'babylonian') return babylonian(system, a, b, operation, equation);
  if (system.id === 'rods') return rodBoard(system, a, b, operation, equation);
  if (system.id === 'roman') return roman(system, a, b, operation, equation);
  if (system.id === 'oksapmin') return oksapmin(system, a, b, operation, equation);
  if (system.id === 'maya' || system.id === 'kaktovik')
    return twentyBased(system, a, b, operation, equation);
}
