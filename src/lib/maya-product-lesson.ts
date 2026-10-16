import type { OperationLesson, OperationPart } from './operation-lessons';
import type { RenderToken, Source, SystemDefinition } from './types';
import { baseDigits, rational } from './numbers';
import { represent } from './format';
import { nativeQuantity } from './native-arithmetic';

const MAX_OPERAND = 999_999_999n;
const MAX_TABLE_ROWS = 10;
const MAX_ACCUMULATION_ROWS = 9;
const sources: Source[] = [
  {
    title: 'Ramírez Alfonsín & Testard · Maya dot-and-bar product grid (1995), p. 9',
    url: 'https://imag.umontpellier.fr/~ramirez/Article-maya.pdf',
    detail:
      'The teaching demonstration places factors around a grid, multiplies digit pairs and collects equal-place diagonals. It is not surviving ancient working instructions.',
  },
];

function short(n: bigint): string {
  const value = String(n);
  return value.length <= 24
    ? value
    : `${value.slice(0, 10)}…${value.slice(-6)} (${value[0] === '-' ? value.length - 1 : value.length} digits)`;
}

function numeralTokens(system: SystemDefinition, n: bigint): RenderToken[] | undefined {
  // Check the illustrated repertoire before asking the representation engine for artwork.
  if (n < 0n || n < BigInt(system.min) || n > BigInt(system.max)) return;
  if (n === 0n && !system.zero) return;
  const result = represent(rational(n), system);
  return result.status === 'ok' && result.tokens.length <= 24 ? result.tokens : undefined;
}

function rowName(exponent: number): string {
  return exponent === 0 ? 'Units row' : `Row ${exponent + 1}`;
}

function components(n: number): string {
  const bars = Math.floor(n / 5);
  const dots = n % 5;
  return `${bars} ${bars === 1 ? 'bar' : 'bars'} and ${dots} ${dots === 1 ? 'dot' : 'dots'}`;
}

/** A transparent pure-vigesimal teaching reconstruction, with exact bounded working. */
export function mayaProductLesson(system: SystemDefinition, a: bigint, b: bigint): OperationLesson {
  const product = a * b;
  const q = (value: bigint | number) => nativeQuantity(system, BigInt(value));
  const lesson: OperationLesson = {
    title: 'Multiplication · a dot-and-bar product grid',
    text: 'Place one factor’s dot-and-bar rows down the side of a grid and the other’s across the top. Multiply the components in each cell, then collect the diagonals that have the same place value.',
    evidence:
      'Teaching reconstruction: the grid demonstrates multiplication with Maya signs. The consulted evidence does not establish these steps as surviving ancient general multiplication instructions.',
    equation: `${q(a)} × ${q(b)} = ${q(product)}`,
    sources,
    notes: [
      'This lesson uses ordinary powers of twenty: 1, 20, 400 and so on. The Long Count calendar’s 360-day third position requires different exchanges.',
      'The dots, bars and shell use the selected Maya repertoire. Bracketed values and the grid use base twenty.',
    ],
  };

  if (
    system.id !== 'maya' ||
    system.engine !== 'positional' ||
    system.radix !== 20 ||
    system.digits?.length !== 20
  ) {
    lesson.text =
      'This product grid requires the selected Maya dot-and-bar repertoire with ordinary twenty-place rows. No substitute numerical signs are invented.';
    lesson.parts = [{ text: `The exact product is ${short(product)}.` }];
    return lesson;
  }
  if (a < 0n || b < 0n || a > MAX_OPERAND || b > MAX_OPERAND) {
    lesson.text =
      'Multiply dot and bar components, place each cell in its correct twenty-place diagonal, and regroup. The illustrated grid accepts nonnegative operands through 999999999; this larger or signed input keeps its exact modern product with an abbreviated reading.';
    lesson.parts = [
      {
        text: `The product is ${short(product)}. The grid is bounded so an oversized input cannot create an unbounded set of signs.`,
      },
    ];
    return lesson;
  }

  const parts: OperationPart[] = [
    {
      text: 'Use three component rules: dot × dot = one dot; dot × bar = one bar; bar × bar = one dot in the row above and one bar in this row. A shell contributes no product.',
    },
  ];
  if (a === 0n || b === 0n) {
    parts.push({
      text: 'One factor is the shell for zero, so there are no nonzero component pairs to place in the grid.',
      tokens: numeralTokens(system, 0n),
    });
    parts.push({
      text: 'The completed product is 0: every row is empty, represented by the shell.',
      tokens: numeralTokens(system, 0n),
    });
    lesson.parts = parts;
    return lesson;
  }

  const left = baseDigits(a, 20).reverse();
  const right = baseDigits(b, 20).reverse();
  const coefficients = Array<bigint>(left.length + right.length - 1).fill(0n);
  const rows: NonNullable<OperationLesson['table']>['rows'] = [];
  let cellCount = 0;
  let firstExchange: { x: number; y: number; digitProduct: bigint; weight: bigint } | undefined;

  for (let i = 0; i < left.length; i++) {
    for (let j = 0; j < right.length; j++) {
      const x = left[i];
      const y = right[j];
      if (!x || !y) continue;
      const digitProduct = BigInt(x * y);
      const weight = 20n ** BigInt(i + j);
      const barsA = Math.floor(x / 5);
      const barsB = Math.floor(y / 5);
      const dotsA = x % 5;
      const dotsB = y % 5;
      const crossProducts = barsA * dotsB + dotsA * barsB;
      coefficients[i + j] += digitProduct;
      cellCount++;
      if (!firstExchange && digitProduct >= 20n) firstExchange = { x, y, digitProduct, weight };
      if (rows.length >= MAX_TABLE_ROWS) continue;
      const primitive = [
        `${q(x)} has ${components(x)}; ${q(y)} has ${components(y)}.`,
        `${q(barsA * barsB)} bar-by-bar pairs give an upper-row dot and a current-row bar each.`,
        `${q(crossProducts)} dot-by-bar pairs give one bar each.`,
        `${q(dotsA * dotsB)} dot-by-dot pairs give one dot each.`,
        digitProduct >= 20n
          ? `Exchange four bars for one dot in the next row, and five dots for a bar. Keep ${q(digitProduct % 20n)} here and carry ${q(digitProduct / 20n)} upward.`
          : 'Keep these signs in their current row.',
        `The cell product is ${q(digitProduct)}.`,
      ].join('\n');
      rows.push({
        cells: [
          {
            text: `${q(x)} in ${rowName(i).toLowerCase()}`,
            tokens: numeralTokens(system, BigInt(x)),
          },
          {
            text: `${q(y)} in ${rowName(j).toLowerCase()}`,
            tokens: numeralTokens(system, BigInt(y)),
          },
          {
            text: primitive,
            hint: `${x} × ${y} = ${digitProduct}`,
            tokens: numeralTokens(system, digitProduct),
          },
          {
            text: `Move this cell ${i + j} rows upward: ${q(digitProduct * weight)}.`,
            hint: String(digitProduct * weight),
            tokens: numeralTokens(system, digitProduct * weight),
          },
        ],
      });
    }
  }
  lesson.table = {
    caption: `Each cell multiplies actual dot and bar components. A factor from row i and another from row j contribute to row i + j − 1.${cellCount > MAX_TABLE_ROWS ? ` The first ${MAX_TABLE_ROWS} of ${cellCount} nonzero cells are shown; every cell is included in the accumulation below.` : ''}`,
    headings: [
      'Factor down the side',
      'Factor across the top',
      'Component product',
      'Weighted partial product',
    ],
    rows,
  };

  if (firstExchange) {
    const { x, y, digitProduct, weight } = firstExchange;
    parts.push({
      text: `For the ${q(x)} × ${q(y)} cell, keep ${q(digitProduct % 20n)} here and carry ${q(digitProduct / 20n)} to the next row. Each group of four bars is exchanged for one upper-row dot; five dots become one bar.`,
      tokens: numeralTokens(system, digitProduct * weight),
    });
  }

  const accumulation: OperationPart[] = [];
  let carry = 0n;
  let normalizedTotal = 0n;
  for (let exponent = 0; exponent < coefficients.length || carry; exponent++) {
    const incoming = carry;
    const coefficient = coefficients[exponent] ?? 0n;
    const raw = coefficient + incoming;
    const digit = raw % 20n;
    carry = raw / 20n;
    const weight = 20n ** BigInt(exponent);
    normalizedTotal += digit * weight;
    const digitTokens = numeralTokens(system, digit)?.map((token) => ({
      ...token,
      place: String(weight),
      label: `${digit} at weight ${weight}`,
    }));
    accumulation.push({
      text:
        `${rowName(exponent)}: collect ${q(coefficient)} from its product diagonal${incoming ? ` + ${q(incoming)} carried from below` : ''} = ${q(raw)}.\n` +
        (carry
          ? `Exchange complete groups for ${q(carry)} in the row above; leave ${q(digit)} here`
          : `Leave ${q(digit)} here`) +
        `, shown as ${digit ? components(Number(digit)) : 'the shell for an empty row'}.`,
      tokens: digitTokens,
      hint: String(raw),
    });
  }
  // Seven-place inputs can yield fourteen output rows. Preserve both ends of the
  // working without filling the panel with more than a dozen list items.
  if (accumulation.length > MAX_ACCUMULATION_ROWS) {
    parts.push(...accumulation.slice(0, 5));
    parts.push({
      text: `Continue collecting the ${accumulation.length - MAX_ACCUMULATION_ROWS} intermediate diagonals with the same twenty-for-one exchanges. These rows are included in the completed product; their repeated working is abbreviated.`,
    });
    parts.push(...accumulation.slice(-4));
  } else {
    parts.push(...accumulation);
  }
  const resultTokens = numeralTokens(system, normalizedTotal);
  parts.push({
    text: `The regrouped rows give ${q(normalizedTotal)}.${resultTokens ? '' : ' The result exceeds this selected renderer’s range, so its quantity is retained without inventing further signs.'}`,
    tokens: resultTokens,
    hint: String(normalizedTotal),
  });
  lesson.parts = parts;
  return lesson;
}
