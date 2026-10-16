import { babylonianTables, babylonianReciprocals } from '../data/babylonian-tables';
import type { OperationLesson, OperationPart } from './operation-lessons';
import type { SystemDefinition, RenderToken, Source } from './types';
import { baseDigits, rational, formatNumber } from './numbers';
import { boundNativeParts, nativePicture } from './native-arithmetic';

const sources: Source[] = [
  {
    title: 'Eleanor Robson · edited school tablets and standard table series (2004), pp. 10–11',
    url: 'https://sciamvs.org/files/SCIAMVS_05_003-065_Robson.pdf',
  },
  {
    title: 'Duncan Melville · Old Babylonian multiplication table entries',
    url: 'https://myslu.stlawu.edu/~dmel/mesomath/multiply.html',
  },
  {
    title: 'Alexander Jones / ISAW · sexagesimal working on clay tablets',
    url: 'https://isaw.nyu.edu/exhibitions/before-pythagoras/pamphlet.pdf',
  },
];
const reading = (digits: readonly number[]) => `[${digits.join(', ')}]`;
const valueOf = (digits: readonly number[]) => digits.reduce((n, d) => n * 60n + BigInt(d), 0n);
const normalize = (digits: number[]) => {
  while (digits.length > 1 && !digits[0]) digits.shift();
  return digits;
};
function pictures(digits: readonly number[], scale = 0): RenderToken[] {
  return digits.map((digit, i) => {
    const exponent = digits.length - i - 1 - scale;
    return {
      glyph: `babylonian-${digit}`,
      place: exponent >= 0 ? String(60n ** BigInt(exponent)) : `1/${60n ** BigInt(-exponent)}`,
      label: digit
        ? `${digit} in sexagesimal place ${exponent}`
        : 'Empty sexagesimal place; no Old Babylonian zero sign',
    };
  });
}
function fixedReading(digits: readonly number[], scale: number, approximate = false): string {
  const padded = [...Array(Math.max(0, scale + 1 - digits.length)).fill(0), ...digits];
  const point = padded.length - scale;
  const fraction = padded.slice(point);
  if (!approximate) while (fraction.length && fraction.at(-1) === 0) fraction.pop();
  return `[${padded.slice(0, point).join(', ')}${fraction.length ? `; ${fraction.join(', ')}` : ''}${approximate ? ', …' : ''}]`;
}
export interface BabylonianProductTrace {
  digits: number[];
  parts: OperationPart[];
}
function rowParts(digit: number): number[] {
  return digit <= 20 || digit % 10 === 0 ? [digit] : [Math.floor(digit / 10) * 10, digit % 10];
}
function tableFacts(
  x: number,
  y: number,
): { row: number; principal: number; digits: number[]; identity?: boolean }[] {
  if (x === 1 || y === 1) return [{ row: x, principal: y, digits: [x * y], identity: true }];
  if (babylonianTables[y])
    return rowParts(x).map((row) => ({ row, principal: y, digits: babylonianTables[y][row] }));
  if (babylonianTables[x])
    return rowParts(y).map((row) => ({ row, principal: x, digits: babylonianTables[x][row] }));
  return [Math.floor(y / 10) * 10, y % 10]
    .filter(Boolean)
    .flatMap((principal) =>
      rowParts(x).map((row) =>
        principal === 1
          ? { row, principal, digits: [row], identity: true }
          : { row, principal, digits: babylonianTables[principal][row] },
      ),
    );
}

/** Actual base-sixty accumulation of regenerated table entries; no full decimal product supplies the trace. */
export function babylonianProductTrace(
  left: readonly number[],
  right: readonly number[],
): BabylonianProductTrace {
  if (![...left, ...right].every((digit) => Number.isInteger(digit) && digit >= 0 && digit < 60))
    throw new RangeError('A sexagesimal digit must be between zero and fifty-nine.');
  let accumulator = [0];
  const parts: OperationPart[] = [];
  const l = [...left].reverse(),
    r = [...right].reverse();
  for (let i = 0; i < l.length; i++)
    for (let j = 0; j < r.length; j++) {
      if (!l[i] || !r[j]) continue;
      const facts = tableFacts(l[i], r[j]);
      if (facts.length > 1) {
        const principal = facts[0].principal;
        parts.push({
          text:
            babylonianTables[r[j]] || babylonianTables[l[i]]
              ? `Use ${facts.map((f) => reading([f.row])).join(' and ')} rows of the ${reading([principal])} table for this digit product.`
              : `Neither digit has a listed standard single-place table here. Separate their ten-wedges and unit-wedges, then use the listed component tables.`,
        });
      }
      for (const fact of facts) {
        const product = [...fact.digits];
        parts.push({
          text: fact.identity
            ? `${reading([fact.row])} × ${reading([fact.principal])} = ${reading(product)}. Multiplying by one keeps the same wedge group.`
            : `Look up ${reading([fact.row])} × ${reading([fact.principal])} = ${reading(product)}.`,
          tokens: pictures(product),
          hint: String(valueOf(product)),
        });
        const shifted = [...product, ...Array(i + j).fill(0)];
        if (i + j)
          parts.push({
            text: `Move this product ${i + j === 1 ? 'one place' : `${i + j} places`} left to match the factors’ places: ${reading(shifted)}. Empty places stay open.`,
            tokens: pictures(shifted),
            hint: String(valueOf(shifted)),
          });
        if (valueOf(accumulator) === 0n) {
          accumulator = shifted;
          continue;
        }
        const a = [...accumulator].reverse(),
          b = [...shifted].reverse(),
          sum: number[] = [];
        let carry = 0;
        for (let k = 0; k < Math.max(a.length, b.length) || carry; k++) {
          const incoming = carry,
            x = a[k] ?? 0,
            y = b[k] ?? 0,
            raw = x + y + incoming;
          const digit = raw % 60;
          carry = Math.floor(raw / 60);
          sum.push(digit);
          const place = k === 0 ? 'units' : k === 1 ? 'sixties' : `sexagesimal place ${k + 1}`;
          parts.push({
            text: `In ${place}: ${reading([x])} + ${reading([y])}${incoming ? ` + ${reading([incoming])} carried` : ''} = ${reading(carry ? [carry, digit] : [digit])}.\n${carry ? 'Exchange sixty units for one in the next place. ' : ''}Keep ${reading([digit])} here${carry ? ` and carry ${reading([carry])} left` : ''}.`,
            tokens: [
              {
                glyph: `babylonian-${digit}`,
                place: String(60n ** BigInt(k)),
                label: `${digit} in the ${place} place`,
              },
            ],
            hint: String(raw),
          });
        }
        accumulator = normalize(sum.reverse());
        parts.push({
          text: `The collected groups are ${reading(accumulator)}.`,
          tokens: pictures(accumulator),
          hint: String(valueOf(accumulator)),
        });
      }
    }
  return { digits: accumulator, parts };
}

export function babylonianNativeLesson(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: 'multiply' | 'divide',
): OperationLesson {
  if (operation === 'divide' && b === 0n) throw new Error('Division by zero is undefined.');
  const left = baseDigits(a, 60),
    right = baseDigits(b, 60);
  const notes = [
    'Bracketed place groups, commas, semicolons and explicit scale are modern reading aids. They identify the Babylonian wedge groups used at every stage.',
    'An empty place is a gap, not an invented Old Babylonian zero sign. Decimal hints label a quantity only; they are not steps in the calculation.',
  ];
  if (operation === 'multiply') {
    const trace = babylonianProductTrace(left, right);
    const parts: OperationPart[] = [
      {
        text: `Work with ${reading(left)} and ${reading(right)}. Use learned multiplication table entries, then collect the wedge groups in matching places.`,
        tokens: nativePicture(system, a),
        hint: `${a} × ${b}`,
      },
      ...trace.parts,
      {
        text: `The product is ${reading(trace.digits)}.`,
        tokens: pictures(trace.digits),
        hint: String(valueOf(trace.digits)),
      },
    ];
    return {
      title: 'Multiplication · Babylonian table entries and wedge groups',
      text: 'Keep the calculation in sexagesimal places. A table supplies each small product; combine its wedge groups and carry sixty of a place into the next.',
      evidence:
        'Documented table practice, new worked example: school tablets list multiples one through twenty, then thirty, forty and fifty. The displayed facts regenerate that table format; this is not a facsimile of a particular tablet.',
      evidenceKind: 'documented',
      equation: `${reading(left)} × ${reading(right)} = ${reading(trace.digits)}`,
      sources,
      notes,
      parts: boundNativeParts(parts),
    };
  }
  if (b === 1n)
    return {
      title: 'Division · multiplying by a reciprocal',
      text: 'The reciprocal of one is one; its wedge quantity stays unchanged.',
      evidence: 'Worked application of reciprocal multiplication.',
      evidenceKind: 'documented',
      equation: `${reading(left)} ÷ [1] = ${reading(left)}`,
      sources,
      notes,
      parts: [
        { text: `Use reciprocal [1].`, tokens: pictures([1]), hint: '1' },
        {
          text: `${reading(left)} × [1] = ${reading(left)}.`,
          tokens: pictures(left),
          hint: String(a),
        },
      ],
    };
  const known = babylonianReciprocals[String(b)];
  let reciprocal = known ? [...known] : [];
  let remainder = 1n;
  if (!known)
    for (let i = 0; i < 6 && remainder; i++) {
      remainder *= 60n;
      reciprocal.push(Number(remainder / b));
      remainder %= b;
    }
  const approximate = !known && remainder !== 0n;
  let regular = b;
  for (const factor of [2n, 3n, 5n]) while (regular % factor === 0n) regular /= factor;
  const scale = reciprocal.length;
  const reciprocalDigits = normalize([...reciprocal]);
  const trace = babylonianProductTrace(left, reciprocalDigits);
  const outcome = fixedReading(trace.digits, scale, approximate);
  const parts: OperationPart[] = [
    {
      text: `Find the reciprocal paired with ${reading(right)}. ${known ? 'Read the standard reciprocal-table pair' : 'This divisor is outside the selected standard pairs; the following worked reciprocal is a teaching extension'}: ${reading(right)} ↔ ${fixedReading(reciprocalDigits, scale, approximate)}.`,
      tokens: pictures([0, ...reciprocal], scale),
      hint: `1/${b}`,
    },
    {
      text: `Division becomes multiplication by that reciprocal:\n${reading(left)} × ${fixedReading(reciprocalDigits, scale, approximate)}.\nKeep its fractional places while using the multiplication tables.`,
      tokens: nativePicture(system, a),
    },
    ...trace.parts,
    {
      text: `The table products have ${scale === 1 ? 'one fractional place' : `${scale} fractional places`}. Read the collected groups at that fractional scale: ${approximate ? 'approximately ' : ''}${outcome}.`,
      tokens: pictures(
        [...Array(Math.max(0, scale + 1 - trace.digits.length)).fill(0), ...trace.digits],
        scale,
      ),
      hint: formatNumber(rational(a, b)),
    },
    {
      text: approximate
        ? `${regular === 1n ? 'This reciprocal terminates, but needs more places than this six-place preview.' : 'This reciprocal does not terminate in base 60.'} The ellipsis marks an approximation, not an exact finite reciprocal. The exact fraction result here stays exact in the small hint.`
        : 'The reciprocal has a terminating base-60 expansion. The sexagesimal result above is exact.',
      hint: formatNumber(rational(a, b)),
    },
  ];
  return {
    title: 'Division · multiplying by a reciprocal',
    text: 'Read the reciprocal table, multiply the wedge groups in sexagesimal places, and keep their fractional scale.',
    evidence: known
      ? 'Documented practice: reciprocal pairs and multiplication tables survive. The placement of the fractional boundary is a modern aid to make the problem’s scale explicit.'
      : 'Worked extension of reciprocal-table arithmetic: this generated reciprocal is not claimed as a surviving entry. Babylonian tablets attest approximate reciprocals as well as exact pairs.',
    evidenceKind: known ? 'documented' : 'reconstruction',
    equation: `${reading(left)} ÷ ${reading(right)} ${approximate ? '≈' : '='} ${outcome}`,
    sources: [
      ...sources,
      {
        title: 'Duncan Melville · standard reciprocal pairs (MCT p. 11)',
        url: 'https://myslu.stlawu.edu/~dmel/mesomath/reciprocal.html',
      },
    ],
    notes,
    parts: boundNativeParts(parts),
  };
}
