import type { ArithmeticOperation } from './arithmetic-evidence';
import type { OperationLesson, OperationPart } from './operation-lessons';
import type { RenderToken, Source, SystemDefinition } from './types';
import { rational } from './numbers';
import { represent } from './format';

const units = [1n, 10n, 20n, 40n, 80n] as const;
const capacities = [10n, 2n, 2n, 2n] as const;
const terms = ['ordinary units', 'takau', 'paua', 'tataua', 'varu'] as const;
const names: Record<ArithmeticOperation, string> = {
  add: 'Addition',
  subtract: 'Subtraction',
  multiply: 'Multiplication',
  divide: 'Division',
};
const signs: Record<ArithmeticOperation, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};
const source: Source = {
  title: 'Bender & Beller · Mangarevan binary group arithmetic (2013), pp. 3–5',
  url: 'https://math.hawaii.edu/~tom/ethnomathematics/PNAS-2013.pdf',
  detail:
    'The paper gives conceptual addition, multiplication and division procedures; historical performance was not observed. Subtraction reverses the grouping exchanges. Division by preferred powers of two is explicitly hypothetical.',
};

function small(n: bigint): string {
  const value = String(n);
  return value.length <= 24
    ? value
    : `${value.slice(0, 10)}…${value.slice(-6)} (${value[0] === '-' ? value.length - 1 : value.length} digits)`;
}

function mixed(n: bigint): bigint[] {
  const result = Array<bigint>(5).fill(0n);
  let remaining = n;
  for (let i = 4; i >= 0; i--) {
    result[i] = remaining / units[i];
    remaining %= units[i];
  }
  return result;
}

function groupReading(n: bigint): string {
  if (!n) return 'no counting units';
  return mixed(n)
    .flatMap((count, i) => (count ? [`${count} ${terms[i]}`] : []))
    .reverse()
    .join(' + ');
}

function wordTokens(system: SystemDefinition, n: bigint): RenderToken[] | undefined {
  if (n < 1n || n > 799n || n < BigInt(system.min) || n > BigInt(system.max)) return;
  const representation = represent(rational(n), system);
  return representation.status === 'ok' ? representation.tokens : undefined;
}

function part(system: SystemDefinition, text: string, n?: bigint): OperationPart {
  return { text, tokens: n === undefined ? undefined : wordTokens(system, n) };
}

function completed(system: SystemDefinition, n: bigint, prefix = 'The answer'): OperationPart {
  const tokens = wordTokens(system, n);
  return {
    text: `${prefix} is ${n}: ${n >= 0n ? groupReading(n) : 'a negative quantity'}.${n === 0n ? ' No zero word is supplied by this bounded dictionary.' : !tokens ? ' This is beyond the illustrated vocabulary range of 1–799 counting units; the exact quantity is retained without inventing a full Mangarevan number word.' : ' The displayed words name this count in the selected mixed system.'}`,
    tokens,
  };
}

function exchangeDown(i: number): string {
  return `Open one ${terms[i]} into ${capacities[i - 1]} ${terms[i - 1]}`;
}

function addition(system: SystemDefinition, a: bigint, b: bigint): OperationPart[] {
  const left = mixed(a),
    right = mixed(b);
  const parts = [
    part(
      system,
      `Join ${a} (${groupReading(a)}) and ${b} (${groupReading(b)}), keeping the named group levels separate.`,
      a,
    ),
  ];
  let carry = 0n;
  let collected = 0n;
  for (let i = 0; i < units.length; i++) {
    const incoming = carry;
    const raw = left[i] + right[i] + incoming;
    if (i < 4) {
      const capacity = capacities[i];
      const kept = raw % capacity;
      carry = raw / capacity;
      collected += kept * units[i];
      parts.push(
        part(
          system,
          `At ${terms[i]}: ${left[i]} + ${right[i]}${incoming ? ` + ${incoming} carried from below` : ''} = ${raw}. ${carry ? `Exchange ${carry} group${carry === 1n ? '' : 's'} of ${capacity} ${terms[i]} for ${carry} ${terms[i + 1]}; leave ${kept} ${terms[i]} here.` : `Leave ${kept} ${terms[i]} here.`}`,
          raw * units[i],
        ),
      );
    } else {
      collected += raw * units[i];
      parts.push(
        part(
          system,
          `At varu: ${left[i]} + ${right[i]}${incoming ? ` + ${incoming} carried from tataua` : ''} = ${raw} varu. This coefficient uses ordinary decimal counting; no further binary group level is introduced.`,
          raw * units[i],
        ),
      );
    }
  }
  parts.push(completed(system, collected));
  return parts;
}

function subtraction(system: SystemDefinition, a: bigint, b: bigint): OperationPart[] {
  if (a < b)
    return [
      part(
        system,
        `Removing ${b} counting units exhausts the ${a} available. The mixed-group removal demonstration has no negative count to name.`,
      ),
      part(
        system,
        `The exact modern difference is ${a - b}; no negative Mangarevan word is invented.`,
      ),
    ];
  const available = mixed(a),
    removed = mixed(b);
  const parts = [
    part(
      system,
      `Set out ${a}: ${groupReading(a)}. Remove the second quantity’s named groups, opening a larger group when a required level is empty.`,
      a,
    ),
  ];
  let remaining = a;
  for (let i = 0; i < units.length; i++) {
    const exchanges: string[] = [];
    if (available[i] < removed[i]) {
      let donor = i + 1;
      while (available[donor] === 0n) donor++;
      for (let j = donor; j > i; j--) {
        available[j] -= 1n;
        available[j - 1] += capacities[j - 1];
        exchanges.push(`${exchangeDown(j)}.`);
      }
    }
    const before = available[i];
    available[i] -= removed[i];
    remaining -= removed[i] * units[i];
    if (before || removed[i] || exchanges.length)
      parts.push(
        part(
          system,
          `${exchanges.join(' ')}${exchanges.length ? ' ' : ''}At ${terms[i]}, remove ${removed[i]} from ${before}, leaving ${available[i]}. The remaining quantity is ${remaining}.`,
          remaining,
        ),
      );
  }
  parts.push(completed(system, remaining, 'The difference'));
  return parts;
}

function doubling(n: bigint): string {
  const groups = mixed(n);
  const moves: string[] = [];
  if (groups[0]) {
    const doubled = groups[0] * 2n;
    moves.push(
      `Double ${groups[0]} ordinary units to ${doubled}${doubled >= 10n ? `; exchange ten for takau and leave ${doubled % 10n} ordinary units` : ''}`,
    );
  }
  for (let i = 1; i < 4; i++) if (groups[i]) moves.push(`Shift ${terms[i]} to ${terms[i + 1]}`);
  if (groups[4]) moves.push(`Double the varu coefficient ${groups[4]} to ${groups[4] * 2n}`);
  moves.push(`Regroup as ${groupReading(n * 2n)}`);
  return `${moves.join('. ')}.`;
}

function joinDescription(a: bigint, b: bigint): string {
  const left = mixed(a),
    right = mixed(b);
  const exchanges: string[] = [];
  let carry = 0n;
  for (let i = 0; i < 4; i++) {
    const raw = left[i] + right[i] + carry;
    carry = raw / capacities[i];
    if (carry)
      exchanges.push(
        `${raw} ${terms[i]} give ${carry} ${terms[i + 1]} and ${raw % capacities[i]} ${terms[i]}`,
      );
  }
  return exchanges.length
    ? `Regroup: ${exchanges.join('; ')}.`
    : 'Join unlike terms without an exchange.';
}

function multiplication(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
): Pick<OperationLesson, 'parts' | 'table'> {
  const count = a < b ? a : b;
  const amount = a < b ? b : a;
  if (!count)
    return {
      parts: [
        part(system, 'Zero equal groups contribute no counting units.'),
        completed(system, 0n, 'The product'),
      ],
    };
  const rows: NonNullable<OperationLesson['table']>['rows'] = [];
  const kept: { copies: bigint; amount: bigint }[] = [];
  for (let copies = 1n, quantity = amount; copies <= count; copies *= 2n, quantity *= 2n) {
    const selected = Boolean(count & copies);
    if (selected) kept.push({ copies, amount: quantity });
    rows.push({
      selected,
      cells: [
        { text: selected ? 'Keep' : 'Skip' },
        { text: String(copies), tokens: wordTokens(system, copies) },
        { text: copies === 1n ? `One copy: ${groupReading(quantity)}.` : doubling(quantity / 2n) },
        { text: `${quantity} counting units`, tokens: wordTokens(system, quantity) },
      ],
    });
  }
  const parts = [
    part(
      system,
      `Make ${count} copies of ${amount} counting units. Doubling shifts takau → paua → tataua → varu; ordinary unit and varu coefficients are regrouped separately.`,
      amount,
    ),
  ];
  parts.push(
    part(
      system,
      `Keep copy counts ${kept.map((entry) => entry.copies).join(' + ')} = ${count}. These powers-of-two row labels are a teaching aid for selecting doubles, not a historical written binary notation.`,
    ),
  );
  let collected = 0n;
  for (const entry of kept) {
    const before = collected;
    collected += entry.amount;
    parts.push(
      part(
        system,
        `Keep ${entry.copies} copies, contributing ${entry.amount}. ${joinDescription(before, entry.amount)} The collected quantity becomes ${collected}: ${groupReading(collected)}.`,
        collected,
      ),
    );
  }
  parts.push(completed(system, collected, 'The product'));
  return {
    table: {
      caption:
        'Double named groups, then select and join the required copies. Complete words are displayed only within the attested 1–799 teaching vocabulary.',
      headings: ['Use', 'Copies', 'Group changes from the preceding row', 'Quantity'],
      rows,
    },
    parts,
  };
}

function halve(n: bigint): { quotient: bigint; remainder: bigint; details: string } {
  const groups = mixed(n);
  let quotient = 0n;
  const actions: string[] = [];
  for (let i = 4; i > 0; i--) {
    if (!groups[i]) continue;
    const evenCount = groups[i] - (groups[i] % 2n);
    if (evenCount) {
      quotient += (evenCount / 2n) * units[i];
      actions.push(`Give each half ${evenCount / 2n} of the ${evenCount} ${terms[i]}`);
    }
    if (groups[i] % 2n) {
      groups[i - 1] += capacities[i - 1];
      actions.push(exchangeDown(i));
    }
  }
  quotient += groups[0] / 2n;
  const remainder = groups[0] % 2n;
  if (groups[0])
    actions.push(
      `Split ${groups[0]} ordinary units into ${groups[0] / 2n} per half${remainder ? ', with one unit left over' : ''}`,
    );
  return {
    quotient,
    remainder,
    details: `${actions.join('. ') || 'There are no groups to halve'}.`,
  };
}

function division(system: SystemDefinition, a: bigint, b: bigint): OperationPart[] {
  const parts = [
    part(
      system,
      `Begin with ${a} counting units: ${groupReading(a)}. Keep the object size of one tauga fixed while forming shares.`,
      a,
    ),
  ];
  if ([2n, 4n, 8n].includes(b)) {
    const stages = b === 2n ? 1 : b === 4n ? 2 : 3;
    let quantity = a;
    let remainder = 0n;
    for (let stage = 0; stage < stages; stage++) {
      const half = halve(quantity);
      const scale = 2n ** BigInt(stage);
      remainder += half.remainder * scale;
      parts.push(
        part(
          system,
          `Halving ${stage + 1} of ${stages}: ${half.details} ${quantity} gives ${half.quotient} per half.${half.remainder ? ` This stage’s leftover counts as ${scale} of the original counting units.` : ''}`,
          half.quotient,
        ),
      );
      quantity = half.quotient;
    }
    parts.push(
      part(
        system,
        `After ${stages} halving${stages === 1 ? '' : 's'}, each of the ${b} shares contains ${quantity} whole counting units; the original-unit remainder is ${remainder}. Check: ${b} × ${quantity} + ${remainder} = ${a}.`,
        quantity,
      ),
    );
  } else {
    parts.push(
      part(
        system,
        `This divisor is not one of the paper’s proposed preferred divisors 2, 4 or 8. The following grouping extension is a general teaching reconstruction, not observed historical Mangarevan division.`,
      ),
    );
    const quotientGroups = mixed(a / b);
    let remaining = a;
    let copies = 0n;
    for (let i = 4; i >= 0; i--) {
      if (!quotientGroups[i]) continue;
      const chunk = quotientGroups[i] * units[i];
      const quantity = chunk * b;
      copies += chunk;
      const before = remaining;
      remaining -= quantity;
      parts.push(
        part(
          system,
          `Form ${chunk} complete groups of ${b}, using ${quantity}: ${before} − ${quantity} = ${remaining}. ${joinDescription(copies - chunk, chunk)} The count is now ${copies} complete groups.`,
          remaining,
        ),
      );
    }
    parts.push(
      part(
        system,
        `${a / b} complete groups use ${(a / b) * b} counting units, leaving ${a % b}. Check: ${b} × ${a / b} + ${a % b} = ${a}.`,
        a / b,
      ),
    );
  }
  const remainder = a % b;
  if (remainder) {
    const exact = rational(a, b);
    parts.push(
      part(
        system,
        `The exact modern result is ${a / b} + ${remainder}/${b} = ${exact.numerator}/${exact.denominator}. The paper does not establish a historical fraction-word procedure; the fraction is a reading annotation, and no fractional Mangarevan word is invented.`,
      ),
    );
  } else {
    parts.push(completed(system, a / b, 'The quotient'));
  }
  return parts;
}

/** Concrete arithmetic with the selected historical mixed-group vocabulary. */
export function mangarevanOperationLesson(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: ArithmeticOperation,
): OperationLesson {
  const title = `${names[operation]} · ${operation === 'add' ? 'joining mixed counting groups' : operation === 'subtract' ? 'opening and removing mixed groups' : operation === 'multiply' ? 'doubling named groups' : 'splitting mixed counting groups'}`;
  const lesson: OperationLesson = {
    title,
    text: 'Work with ordinary units, takau (10), paua (20), tataua (40), and varu (80). Ten units make takau; pairs of each following group make the next one. A varu coefficient uses ordinary decimal counting.',
    evidence:
      'Analytical reconstruction: Bender and Beller derive arithmetic possibilities from recorded vocabulary. Direct observations of historical performance are unavailable; the division preferences are explicit assumptions.',
    equation: '',
    sources: [source],
    notes: [
      'Keep the object-dependent counting unit tauga fixed: one turtle, two fish, four coconuts or eight octopuses. The input counts these units, not automatically individual objects.',
      'Full words are generated only for 1–799 counting units. Group terms in English working captions are structural annotations, not invented complete number names.',
    ],
  };
  if (operation === 'divide' && b === 0n) {
    lesson.equation = `${small(a)} ÷ 0 is undefined`;
    lesson.parts = [
      { text: 'A divisor of zero cannot define a group size or a numerical quotient.' },
    ];
    return lesson;
  }
  const result =
    operation === 'add'
      ? a + b
      : operation === 'subtract'
        ? a - b
        : operation === 'multiply'
          ? a * b
          : undefined;
  const fraction = result === undefined ? rational(a, b) : rational(result);
  lesson.equation = `${small(a)} ${signs[operation]} ${small(b)} = ${small(fraction.numerator)}${fraction.denominator === 1n ? '' : `/${small(fraction.denominator)}`}`;
  if (system.id !== 'mangarevan' || system.engine !== 'pacific') {
    lesson.parts = [
      {
        text: 'This mixed-group lesson requires the selected Mangarevan vocabulary. No substitute words are supplied.',
      },
    ];
    return lesson;
  }
  if (a < 0n || b < 0n || a > 799n || b > 799n) {
    lesson.parts = [
      {
        text: `These operands are beyond the illustrated vocabulary range of 0–799 counting units. The exact result is ${small(fraction.numerator)}${fraction.denominator === 1n ? '' : `/${small(fraction.denominator)}`}; no unsupported full number word is invented.`,
      },
    ];
    return lesson;
  }
  if (operation === 'add') lesson.parts = addition(system, a, b);
  else if (operation === 'subtract') lesson.parts = subtraction(system, a, b);
  else if (operation === 'multiply') Object.assign(lesson, multiplication(system, a, b));
  else lesson.parts = division(system, a, b);
  return lesson;
}
