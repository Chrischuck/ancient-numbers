import type { Rational, RenderToken, SystemDefinition } from './types';
import type { ArithmeticEvidenceProfile, ArithmeticOperation } from './arithmetic-evidence';
import { evidenceLabels } from './arithmetic-evidence';
import type { OperationLesson, OperationPart } from './operation-lessons';
import { arithmeticColumns } from './operation-lessons';
import { baseDigits, calculate, rational } from './numbers';
import { represent } from './format';
import { yorubaConstruction } from './spoken';
import type { CalculationWorkspace } from './arithmetic-workspace';

const names = {
  add: 'Addition',
  subtract: 'Subtraction',
  multiply: 'Multiplication',
  divide: 'Division',
};
const signs = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
type Calculation = { first: Rational; second: Rational; operation: ArithmeticOperation };
type Group = { amount: bigint; count: bigint; unit: bigint };
const small = (n: bigint) => {
  const value = n.toString();
  return value.length < 80
    ? value
    : `${value.slice(0, 32)}…${value.slice(-18)} (${value.replace('-', '').length} digits)`;
};
const exact = (n: Rational) =>
  n.denominator === 1n ? small(n.numerator) : `${small(n.numerator)}/${small(n.denominator)}`;

function picture(system: SystemDefinition, value: bigint): RenderToken[] | undefined {
  if (value < BigInt(system.min) || value > BigInt(system.max) || (!value && !system.zero)) return;
  const result = represent(rational(value), system);
  return result.tokens.length && result.tokens.length <= 32 ? result.tokens : undefined;
}
function part(
  system: SystemDefinition,
  text: string,
  value?: bigint,
  previous?: bigint,
): OperationPart {
  const kind: CalculationWorkspace['kind'] | undefined =
    system.id === 'suzhou'
      ? 'suanpan'
      : system.id === 'kaktovik'
        ? 'inupiaq-abacus'
        : system.id === 'khipu'
          ? 'yupana'
          : ['roman', 'greek-attic', 'greek-alphabetic', 'cistercian'].includes(system.id)
            ? 'counter-board'
            : ['rumi', 'sinhala', 'ottoman-siyaq', 'cherokee'].includes(system.id)
              ? 'written'
              : undefined;
  return {
    text,
    tokens: value === undefined ? undefined : picture(system, value),
    workspace:
      kind && value !== undefined && value >= 0n
        ? {
            kind,
            value: String(value),
            previous: previous !== undefined && previous >= 0n ? String(previous) : undefined,
            caption:
              system.id === 'kaktovik'
                ? 'Use the source-based three-five/four-unit Iñupiaq abacus; the numeral shows the same twenty-place quantity.'
                : system.id === 'suzhou'
                  ? 'Move the abacus beads; the Suzhou signs below record the same quantity.'
                  : system.id === 'khipu'
                    ? 'Move the kernels on this explicitly reconstructed decimal workspace; the knots below record the quantity.'
                    : system.id === 'cistercian'
                      ? 'Illustrative counter arithmetic; the cipher below records the quantity. No Cistercian stroke algorithm is claimed.'
                      : 'The working quantity changes as shown; the selected numeral below records it.',
          }
        : undefined,
  };
}
function words(system: SystemDefinition, value: bigint): string {
  const result = picture(system, value);
  const text = result
    ?.filter((token) => token.text !== undefined)
    .map((token) => token.text)
    .join(' ');
  return text ? `${text} (${value})` : String(value);
}
function radix(system: SystemDefinition): number {
  return ['yoruba', 'mexica'].includes(system.id) ? 20 : (system.radix ?? 10);
}
function groups(system: SystemDefinition, value: bigint): Group[] {
  if (!value) return [];
  if (system.id === 'mangarevan') {
    let rest = value;
    return [80n, 40n, 20n, 10n, 1n].flatMap((unit) => {
      const count = rest / unit;
      rest %= unit;
      return count ? [{ unit, count, amount: unit * count }] : [];
    });
  }
  if (
    system.values?.length &&
    !['roman', 'cistercian', 'gestures', 'khipu', 'rods', 'suzhou'].includes(system.engine)
  ) {
    let rest = value;
    const result: Group[] = [];
    for (const unit of [...new Set(system.values.map((entry) => BigInt(entry.value)))].sort(
      (a, b) => (a > b ? -1 : 1),
    )) {
      if (unit < 1n) continue;
      const count = rest / unit;
      rest %= unit;
      if (count) result.push({ unit, count, amount: unit * count });
    }
    if (!rest) return result;
  }
  const base = BigInt(radix(system));
  return baseDigits(value, Number(base)).flatMap((digit, i, digits) => {
    const unit = base ** BigInt(digits.length - i - 1);
    return digit ? [{ count: BigInt(digit), unit, amount: BigInt(digit) * unit }] : [];
  });
}
function groupName(system: SystemDefinition, group: Group): string {
  if (system.id === 'mangarevan')
    return `${group.count} ${({ '80': 'varu', '40': 'tataua', '20': 'paua', '10': 'takau', '1': 'single counting unit' } as Record<string, string>)[String(group.unit)] ?? `group worth ${group.unit}`} (${group.amount})`;
  if (system.structure === 'Spoken' || system.id === 'yoruba') return words(system, group.amount);
  if (system.engine === 'khipu')
    return `${group.count} in the knot cluster worth ${group.unit} each (${group.amount})`;
  if (system.id === 'cistercian')
    return `${group.count} in the ${({ '1': 'upper-right units', '10': 'upper-left tens', '100': 'lower-right hundreds', '1000': 'lower-left thousands' } as Record<string, string>)[String(group.unit)] ?? `group worth ${group.unit}`} quadrant (${group.amount})`;
  if (system.id === 'medieval-finger-counting')
    return `the hand position for ${group.amount} (${group.count} groups of ${group.unit})`;
  if (system.id === 'cistercian-gestures') return `${group.amount} hours`;
  if (system.engine === 'positional' || system.engine === 'suzhou' || system.engine === 'rods')
    return `digit ${group.count} at value ${group.unit} (${group.amount})`;
  return `${group.count} ${group.count === 1n ? 'sign' : 'signs'} worth ${group.unit} each (${group.amount})`;
}
function finish(system: SystemDefinition, value: bigint, action = 'The answer'): OperationPart {
  const available = picture(system, value);
  const description = system.id === 'cistercian-gestures' ? ' hours' : '';
  return {
    text: `${action} is ${words(system, value)}${description}.${available ? ' The picture shows this quantity in the selected notation.' : value === 0n && !system.zero ? ' Nothing remains; this notation has no zero sign to draw.' : ' The complete result is outside this entry’s supported artwork or word range; no extra sign or word is invented.'}`,
    tokens: available,
  };
}

function notationAddition(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  subtract: boolean,
): OperationPart[] {
  const base = radix(system);
  const nativePlaces = ['positional', 'suzhou', 'rods', 'babylonian'].includes(system.engine);
  if (system.id !== 'cistercian-gestures' && a >= (subtract ? b : 0n)) {
    const parts = [
      part(
        system,
        `Set out ${words(system, a)}. Work with corresponding ${system.engine === 'khipu' ? 'decimal knot clusters on a separate counter workspace' : system.engine === 'cistercian' ? 'quantities in the four quadrants; redraw each affected quadrant' : system.engine === 'gestures' ? 'amounts on the hands, replacing the pose as the running quantity changes' : nativePlaces ? 'places in the selected notation' : `${base === 20 ? 'twenty-value' : 'decimal'} quantity orders in a teaching workspace; these working columns are distinct from the written signs’ positions`}.${nativePlaces ? '' : ' Recompose the supported signs or words after each change, keeping whole-value signs and their modifiers together.'}`,
        a,
      ),
    ];
    let previous = a;
    const allChanges = arithmeticColumns(a, b, base, subtract);
    const changes =
      allChanges.length > 10 ? [...allChanges.slice(0, 5), ...allChanges.slice(-5)] : allChanges;
    for (let index = 0; index < changes.length; index++) {
      const change = changes[index];
      if (allChanges.length > 10 && index === 5)
        parts.push(
          part(
            system,
            `The ${allChanges.length - 10} intermediate places follow the same ${subtract ? 'exchange-and-remove' : 'combine-and-carry'} rule. Their drawings are abbreviated; the final five places and completed result are retained.`,
          ),
        );
      const exchange = change.exchanges
        .map(({ from, to }) => `Exchange one group worth ${from} for ${base} worth ${to}.`)
        .join(' ');
      parts.push(
        part(
          system,
          subtract
            ? `${exchange}${exchange ? ' ' : ''}At value ${change.place}, remove ${change.y} from ${change.x}: ${change.x} − ${change.y} = ${change.digit}. The running quantity is ${change.board}.`
            : `At value ${change.place}, combine ${change.x} and ${change.y}${change.carry ? ` and the ${change.carry} carried group` : ''}: ${change.raw}. ${change.raw >= BigInt(base) ? `Exchange ${base} here for one in the next place; keep ${change.digit} here.` : `Keep ${change.digit} here.`} The running quantity is ${change.board}.`,
          change.board,
          previous,
        ),
      );
      previous = change.board;
    }
    parts.push(finish(system, a + (subtract ? -b : b)));
    return parts;
  }
  const changes = groups(system, b);
  let running = a;
  const parts = [
    part(
      system,
      `Begin with ${words(system, a)}. ${subtract ? 'Remove' : 'Combine'} quantities represented by the second number’s actual ${system.structure === 'Spoken' ? 'number-word groups' : 'sign groups'}, rather than treating its signs as positional decimal digits.`,
      a,
    ),
  ];
  for (const group of changes.slice(0, 10)) {
    const before = running;
    running += subtract ? -group.amount : group.amount;
    parts.push(
      part(
        system,
        `${subtract ? 'Remove' : 'Add'} ${groupName(system, group)}: ${before} ${subtract ? '−' : '+'} ${group.amount} = ${running}. ${system.engine === 'written' && system.id === 'mende-kikakui' ? 'Replace the coefficient-and-subscript groups; use the separate additive teens form if needed.' : system.id === 'cherokee' ? 'Replace the quantity with the chart’s dedicated sign or attested tens-and-units pair; a teen is a whole sign.' : system.id === 'ottoman-siyaq' ? 'Record the remaining whole-value signs in right-to-left order, with units before tens in reading order.' : 'Replace the collected quantity with the supported signs or words for that amount.'}`,
        running,
      ),
    );
  }
  if (changes.length > 10)
    parts.push(
      part(
        system,
        'The remaining sign groups are processed in the same way; their intermediate drawings are abbreviated.',
      ),
    );
  parts.push(finish(system, a + (subtract ? -b : b)));
  return parts;
}

function tableProducts(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
): Pick<OperationLesson, 'parts' | 'table'> {
  const left = groups(system, a),
    right = groups(system, b);
  const products = left.flatMap((x) => right.map((y) => ({ x, y, value: x.amount * y.amount })));
  const rows = products.slice(0, 10).map(({ x, y, value }) => ({
    cells: [
      { text: groupName(system, x), tokens: picture(system, x.amount) },
      { text: groupName(system, y), tokens: picture(system, y.amount) },
      { text: `${x.amount} × ${y.amount} = ${value}`, tokens: picture(system, value) },
    ],
  }));
  let accumulator = 0n;
  const accumulation = products.slice(0, 8).map(({ value }) => {
    const before = accumulator;
    accumulator += value;
    return part(
      system,
      `Collect this product in the ${system.id === 'khipu' ? 'kernel' : 'working'} total: ${before} + ${value} = ${accumulator}. ${system.id === 'mexica' ? 'Exchange twenty dots for a flag worth 20, twenty flags for a feather worth 400, and twenty feathers for a bag worth 8,000 when needed.' : ['positional', 'suzhou', 'rods', 'babylonian'].includes(system.engine) ? `Exchange ${radix(system)} of one place for one of the next when needed.` : 'Regroup complete decimal quantity orders in the workspace, then recompose the selected whole-value signs or records; the written signs are not positional working digits.'}`,
      accumulator,
      before,
    );
  });
  return {
    table: {
      caption: `Multiply the quantities carried by each sign or group.${products.length > 10 ? ` First 10 of ${products.length} products shown.` : ''}`,
      headings: ['First quantity group', 'Second quantity group', 'Product'],
      rows,
    },
    parts: [
      part(
        system,
        `Use the factor groups shown in the table.${system.id === 'greek-alphabetic' ? ' Each letter is a whole units, tens, or hundreds value. Eutocius’ multiplication of 265 by 265 likewise pairs the hundreds, tens, and units.' : system.id === 'tamil' ? ' The whole-value ten/hundred/thousand signs supply the scale for the memorized multiples.' : system.id === 'coptic-epact' ? ' The surviving tables supply multiples at unit, ten, hundred, and thousand scales; combining entries for new operands is a worked extension.' : system.id === 'bamum' ? ' The surviving school manuscript establishes multiplication-table learning; the combination of entries here is a worked extension.' : ''}`,
      ),
      ...accumulation,
      part(
        system,
        `${products.length <= 10 ? `Collect the products: ${products.map(({ value }) => value).join(' + ') || '0'} = ${a * b}.` : `Collect all ${products.length} products, including the abbreviated rows: the total is ${a * b}.`}`,
        a * b,
      ),
      finish(system, a * b),
    ],
  };
}

function equalGroups(system: SystemDefinition, a: bigint, b: bigint): OperationPart[] {
  const count = a < b ? a : b,
    amount = a < b ? b : a;
  const unit =
    system.id === 'cistercian-gestures'
      ? 'hours per interval'
      : system.structure === 'Physical'
        ? 'units per group, represented with the body or hands'
        : 'units in each equal group';
  const parts = [
    part(
      system,
      `Make ${count} equal groups, each containing ${words(system, amount)} ${unit}. Keep the number of groups separate from the quantity in a group.`,
      amount,
    ),
  ];
  const shown = count < 8n ? count : 8n;
  for (let group = 1n; group <= shown; group++)
    parts.push(
      part(
        system,
        `Group ${group}: ${group - 1n} groups contain ${(group - 1n) * amount}; combine one more group of ${amount} to make ${words(system, group * amount)}.`,
        group * amount,
      ),
    );
  if (count > shown)
    parts.push(
      part(
        system,
        `Continue for the remaining ${count - shown} groups; each contributes ${amount}. All ${count} groups contain ${count * amount}.`,
      ),
    );
  parts.push(finish(system, a * b));
  return parts;
}

function quotientGroups(system: SystemDefinition, a: bigint, b: bigint): OperationPart[] {
  const base = BigInt(radix(system));
  const quotient = a / b;
  let remaining = a;
  const quotientTerms = groups(system, quotient);
  const parts = [
    part(
      system,
      `Set aside ${words(system, a)}. One complete group contains ${words(system, b)}. Track both the quantity still unallocated and the count of complete groups.`,
      a,
    ),
  ];
  let totalGroups = 0n;
  for (const group of quotientTerms.slice(0, 10)) {
    const removed = group.amount * b;
    const before = remaining;
    remaining -= removed;
    totalGroups += group.amount;
    parts.push(
      part(
        system,
        `${group.amount} groups of ${b} contain ${removed}. Remove that quantity: ${before} − ${removed} = ${remaining}; the group count becomes ${words(system, totalGroups)}.${system.id === 'khipu' ? ' Move the kernels on the reconstructed yupana workspace; update the quotient’s knot-record quantity separately.' : system.id === 'mangarevan' && [2n, 4n, 8n].includes(b) ? ' Reverse the doubling groups, splitting varu, tataua, paua, or takau as needed.' : ''}`,
        remaining,
        before,
      ),
    );
  }
  if (quotientTerms.length > 10)
    parts.push(
      part(
        system,
        'Further group counts are processed in the same way; intermediate drawings are abbreviated.',
      ),
    );
  const remainder = a % b;
  parts.push(
    part(
      system,
      `${quotient} complete groups use ${quotient * b}, leaving ${remainder}. Check: ${b} × ${quotient} + ${remainder} = ${a}.`,
      quotient,
    ),
  );
  parts.push(
    remainder
      ? part(
          system,
          `Share the remaining ${remainder} among ${b}: the exact result is ${quotient} + ${remainder}/${b} = ${exact(rational(a, b))}. Fractional signs are not invented for this exhibit.${base === 20n ? ' The counting groups remain twenties; the fraction is a modern exact annotation.' : ''}`,
        )
      : finish(system, quotient, 'The quotient'),
  );
  return parts;
}

function suzhou(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  subtract: boolean,
): OperationPart[] {
  if (subtract && a < b) return notationAddition(system, a, b, true);
  let board = a;
  const parts = [
    part(
      system,
      `Set the abacus to ${a}. Each rod has unit beads worth one and upper beads worth five; engage beads toward the beam. Read ${words(system, a)} in the Suzhou record.`,
      a,
    ),
  ];
  for (const group of groups(system, b)) {
    const digit = (board / group.unit) % 10n;
    const before = board;
    board += subtract ? -group.amount : group.amount;
    const adjustment =
      subtract && digit < group.count
        ? `If an intervening rod is empty (zero), pass the exchange through it. ${arithmeticColumns(
            before,
            group.amount,
            10,
            true,
          )
            .flatMap((c) => c.exchanges)
            .map(({ from, to }) => `Exchange ${from} for ten groups worth ${to}.`)
            .join(
              ' ',
            )} Use the ten-complement: take a group from the higher rods and restore ${10n - group.count} here.`
        : !subtract && digit + group.count >= 10n
          ? `Use the ten-complement: add one group to the next rod and remove ${10n - group.count} here.`
          : `Move the matching one/five beads; exchange five unit values for a five-bead when needed.`;
    parts.push(
      part(
        system,
        `Work left to right. On the rod worth ${group.unit}, ${subtract ? 'subtract' : 'add'} ${group.count}. ${adjustment} The abacus changes from ${before} to ${board}; record the new quantity in Suzhou shorthand.`,
        board,
        before,
      ),
    );
  }
  parts.push(finish(system, board));
  return parts;
}

function ethiopicDoubling(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
): Pick<OperationLesson, 'parts' | 'table'> {
  let left = a,
    right = b;
  const rows: NonNullable<OperationLesson['table']>['rows'] = [];
  const chosen: bigint[] = [];
  while (left && rows.length < 10) {
    const keep = left % 2n === 1n;
    if (keep) chosen.push(right);
    rows.push({
      selected: keep,
      cells: [
        {
          text: `${left}${keep ? ' · odd, keep' : ' · even, pass'}`,
          tokens: picture(system, left),
        },
        { text: String(right), tokens: picture(system, right) },
      ],
    });
    left /= 2n;
    right *= 2n;
  }
  return {
    table: {
      caption: `Halve the first column, dropping a remainder; double the second. Keep the second-column values beside odd first-column values.${left ? ' Further rows are abbreviated.' : ''}`,
      headings: ['Halved count', 'Doubled quantity'],
      rows,
    },
    parts: [
      part(
        system,
        left
          ? `Continue halving and doubling until the first column reaches one; all kept quantities total ${a * b}.`
          : `Combine the kept quantities: ${chosen.join(' + ') || '0'} = ${a * b}.`,
        a * b,
      ),
      finish(system, a * b),
    ],
  };
}

function complementarySubtraction(system: SystemDefinition, a: bigint, b: bigint): OperationPart[] {
  if (a < b) return notationAddition(system, a, b, true);
  const difference = a - b;
  let running = b;
  const parts = [
    part(
      system,
      `Start from ${words(system, b)} and complete it to ${words(system, a)}. The amount required is the difference.`,
      b,
    ),
  ];
  const terms = groups(system, difference).reverse();
  for (const group of terms.slice(0, 10)) {
    const previous = running;
    running += group.amount;
    parts.push(
      part(
        system,
        `Supply ${groupName(system, group)}: ${previous} + ${group.amount} = ${running}. Keep ${group.amount} in the deficit tally.`,
        running,
      ),
    );
  }
  parts.push(
    part(
      system,
      `The supplied quantities total ${terms.map((g) => g.amount).join(' + ') || '0'} = ${difference}. Therefore ${a} − ${b} = ${difference}.`,
      difference,
    ),
  );
  return parts;
}

function copticDivision(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
): Pick<OperationLesson, 'parts' | 'table'> {
  const terms = groups(system, a);
  const entries = terms.map((group) => {
    const value = rational(group.amount, b);
    const whole = group.amount / b,
      remainder = group.amount % b;
    const fractional = rational(remainder, b);
    const extra =
      b === 12n && group.amount === 5n
        ? ' = 1/3 + 1/12'
        : remainder
          ? ` = ${whole ? `${whole} + ` : ''}${exact(fractional)}`
          : '';
    return { group, value, extra };
  });
  return {
    table: {
      caption: `Apply the documented division-table format for ${b}. These are worked entries; a damaged manuscript does not preserve every possible row.${a === 95n && b === 12n ? ' The entries for 90 and 5 used here both survive.' : ''} Familiar fraction symbols transcribe the quantities; no Coptic fraction glyph is invented.`,
      headings: ['Numeral quantity', 'Worked table entry'],
      rows: entries.map(({ group, value, extra }) => ({
        cells: [
          { text: String(group.amount), tokens: picture(system, group.amount) },
          { text: `${group.amount} ÷ ${b} = ${exact(value)}${extra}` },
        ],
      })),
    },
    parts: [
      part(
        system,
        `The dividend’s whole-value signs contribute ${terms.map((g) => g.amount).join(' + ') || '0'}. Take the corresponding worked entries in the table format for divisor ${b}.`,
        a,
      ),
      part(
        system,
        `Combine those quotient quantities: ${entries.map((e) => exact(e.value)).join(' + ') || '0'} = ${exact(rational(a, b))}.${a === 95n && b === 12n ? ' The entries 90/12 = 7 + 1/2 and 5/12 = 1/3 + 1/12 give 7 + 11/12 = 95/12.' : ''}`,
      ),
      part(
        system,
        `Check the exact quotient: (${exact(rational(a, b))}) × ${b} = ${a}. The table lookup performs division; the sign picture identifies the dividend quantities.`,
      ),
    ],
  };
}

function yoruba(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: ArithmeticOperation,
): OperationPart[] {
  const anchor = ((a + 19n) / 20n) * 20n,
    gap = anchor - a;
  const start = part(
    system,
    `Keep the counting units fixed. The first quantity is ${words(system, a)}${yorubaConstruction(a) ? `; its documented name structure is ${yorubaConstruction(a)}` : ''}. For this calculation use groups of twenty, with tens and fives when convenient.`,
    a,
  );
  if (operation === 'add') {
    const bundles = (value: bigint) =>
      `${value / 20n} twenties, ${(value % 20n) / 5n} five-shell batches, and ${value % 5n} singles`;
    const unitCount = (a % 5n) + (b % 5n);
    const fiveCount = (a % 20n) / 5n + (b % 20n) / 5n + unitCount / 5n;
    const twentyCount = a / 20n + b / 20n + fiveCount / 4n;
    return [
      part(
        system,
        `Keep the object or shell unit fixed. First quantity ${words(system, a)}: ${bundles(a)}. Second quantity ${words(system, b)}: ${bundles(b)}.`,
        a,
      ),
      part(
        system,
        `Combine the singles: ${a % 5n} + ${b % 5n} = ${unitCount}. ${unitCount >= 5n ? `Make ${unitCount / 5n} new five-shell batch and leave ${unitCount % 5n} singles.` : `Keep ${unitCount} singles.`}`,
      ),
      part(
        system,
        `Combine the five-shell batches, including the new batch: ${fiveCount}. Four batches make a twenty; keep ${fiveCount % 4n} batches and carry ${fiveCount / 4n} twenties. The total is ${twentyCount} twenties, ${fiveCount % 4n} fives, and ${unitCount % 5n} singles.`,
        a + b,
      ),
      finish(system, a + b),
    ];
  }
  if (operation === 'subtract' && a >= b)
    return [
      start,
      part(
        system,
        `Track the quantity removed: (${anchor} − ${gap}) − ${b} = ${anchor} − (${gap}+${b}) = ${a - b}. Keep the twenty-group reference fixed while increasing the deficit.`,
        a - b,
      ),
      finish(system, a - b),
    ];
  if (operation === 'multiply')
    return [
      start,
      part(
        system,
        `Use ${b} groups of the rounded quantity: ${anchor} × ${b} = ${anchor * b}. Each has ${gap} extra units, so remove ${gap} × ${b} = ${gap * b}.`,
        anchor * b,
      ),
      part(system, `The corrected total is ${anchor * b} − ${gap * b} = ${a * b}.`, a * b),
      finish(system, a * b),
    ];
  return [start, ...quotientGroups(system, a, b)];
}

/** A complete worked lesson. Reconstruction is an evidence label, never a missing lesson. */
export function completeOperationLesson(
  system: SystemDefinition,
  calculation: Calculation,
  profile: ArithmeticEvidenceProfile,
): OperationLesson {
  const { first, second, operation } = calculation;
  const result = calculate(first, second, operation);
  const a = first.numerator,
    b = second.numerator;
  const equation = `${exact(first)} ${signs[operation]} ${exact(second)} = ${exact(result)}`;
  const title = `${names[operation]} · ${system.id === 'suzhou' ? 'abacus work and Suzhou recording' : system.id === 'ethiopic' && operation === 'multiply' ? 'halving and doubling' : system.id === 'rumi' && operation === 'subtract' ? 'completing the difference' : system.id === 'greek-alphabetic' && operation === 'multiply' ? 'Eutocius’ letter-value products' : system.id === 'coptic-epact' ? 'Coptic table quantities' : system.id === 'bamum' && operation === 'multiply' ? 'Bamum school-table products' : system.id === 'mende-kikakui' ? 'subscripted magnitude groups' : system.id === 'khipu' ? 'kernel workspace and knot recording' : system.id === 'cistercian' ? 'counter quantities and staff quadrants' : system.id === 'medieval-finger-counting' ? 'changing the hand-position total' : system.id === 'cistercian-gestures' ? 'hour intervals and time signals' : `${system.name} quantity groups`}`;
  const evidence = `${evidenceLabels[profile.evidence[operation]]}: ${profile.operationNotes[operation]}`;
  const lesson: OperationLesson = {
    title,
    text: `${{ add: 'Combine matching quantity groups, exchange complete groups, and keep the running total.', subtract: 'Track the quantity removed or the deficit completed, then retain the difference.', multiply: 'Form the selected notation’s quantity products and collect them in their proper groups.', divide: 'Track complete divisor-sized groups and the quantity still unallocated.' }[operation]} ${system.id === 'suzhou' ? 'The abacus carries the calculation; Suzhou shorthand records its changing quantities.' : system.id === 'khipu' ? 'Use the explicitly reconstructed kernel workspace and record quantities with decimal knots.' : system.id === 'cistercian-gestures' ? 'The quantities are hour intervals; the selected gestures communicate the supported durations.' : `The illustrations use ${system.name} for the quantities at each stage.`}${system.engine === 'positional' ? ` Exchanges between adjacent places follow base ${radix(system)}.` : ''}`,
    evidence,
    evidenceKind: profile.evidence[operation],
    equation,
    sources: profile.sources,
    notes: [
      `Calculation medium: ${profile.tool.replace(/\.+$/, '')}.`,
      profile.notationRole,
      'The operator symbols and familiar-digit annotations are modern reading aids. The pictures retain the selected entry’s documented numeral or word forms.',
    ],
  };
  if (
    first.denominator !== 1n ||
    second.denominator !== 1n ||
    a < 0n ||
    b < 0n ||
    result.numerator < 0n
  ) {
    const p = first.numerator,
      q = first.denominator,
      r = second.numerator,
      s = second.denominator;
    lesson.evidence = `Exact modern continuation: these signed or fractional inputs exceed the selected historical demonstration. ${profile.operationNotes[operation]}`;
    lesson.evidenceKind = 'modern';
    lesson.parts = [
      part(
        system,
        `First quantity: ${exact(first)}; second quantity: ${exact(second)}. Numerators count units and denominators name their shared size.`,
      ),
    ];
    if (operation === 'add' || operation === 'subtract')
      lesson.parts.push(
        part(
          system,
          `Use common units of size 1/(${small(q)} × ${small(s)}). The numerators become ${small(p)} × ${small(s)} and ${small(r)} × ${small(q)}. ${operation === 'add' ? 'Combine' : 'Remove'} the second numerator: (${small(p * s)} ${signs[operation]} ${small(r * q)})/${small(q * s)} = ${exact(result)}.`,
        ),
      );
    if (operation === 'multiply')
      lesson.parts.push(
        part(
          system,
          `There are ${small(p)} × ${small(r)} numerator units of size 1/(${small(q)} × ${small(s)}). Their exact quantity is ${exact(result)}.`,
        ),
      );
    if (operation === 'divide')
      lesson.parts.push(
        part(
          system,
          `Find the multiplier of ${exact(second)} that supplies ${exact(first)}: (${small(p)} × ${small(s)})/(${small(q)} × ${small(r)}) = ${exact(result)}.`,
        ),
      );
    lesson.parts.push(
      part(
        system,
        `The reduced exact result is ${exact(result)}. This exhibit does not invent fractional signs or a minus sign for the selected historical notation.`,
      ),
    );
    return lesson;
  }
  if (a > 999_999_999n || b > 999_999_999n) {
    lesson.parts = [
      part(
        system,
        `Apply the same ${names[operation].toLowerCase()} procedure to the selected notation’s groups. This input exceeds the nine-digit worked-diagram limit, so the repeated intermediate groups are abbreviated.`,
      ),
      part(system, `Exact calculation: ${equation}. The limitation concerns the teaching display.`),
    ];
    return lesson;
  }
  if (system.id === 'yoruba') lesson.parts = yoruba(system, a, b, operation);
  else if (system.id === 'suzhou' && (operation === 'add' || operation === 'subtract'))
    lesson.parts = suzhou(system, a, b, operation === 'subtract');
  else if (system.id === 'ethiopic' && operation === 'multiply')
    Object.assign(lesson, ethiopicDoubling(system, a, b));
  else if (['rumi', 'egyptian'].includes(system.id) && operation === 'subtract')
    lesson.parts = complementarySubtraction(system, a, b);
  else if (system.id === 'coptic-epact' && operation === 'divide') {
    if ([12n, 24n, 48n].includes(b)) Object.assign(lesson, copticDivision(system, a, b));
    else {
      lesson.evidenceKind = 'reconstruction';
      lesson.evidence = `Teaching reconstruction: the inspected manuscript has division tables for 12, 24, and 48. The divisor ${b} is outside those attested tables; this equal-group walkthrough is a mathematical extension using the Coptic numeral quantities.`;
      lesson.parts = quotientGroups(system, a, b);
    }
  } else if (operation === 'add' || operation === 'subtract')
    lesson.parts = notationAddition(system, a, b, operation === 'subtract');
  else if (operation === 'multiply') {
    if (
      system.id !== 'khipu' &&
      (system.structure === 'Spoken' ||
        system.structure === 'Physical' ||
        system.id === 'yoruba' ||
        system.id === 'mangarevan')
    )
      lesson.parts = equalGroups(system, a, b);
    else Object.assign(lesson, tableProducts(system, a, b));
  } else lesson.parts = quotientGroups(system, a, b);
  return lesson;
}
