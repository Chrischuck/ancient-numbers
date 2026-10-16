import { represent } from './format';
import { baseDigits } from './numbers';
import type { RenderToken, SystemDefinition } from './types';

export interface NumeralLesson {
  text: string;
  equation: string;
  steps: { text: string; tokens?: RenderToken[] }[];
  notes?: string[];
}

type Step = NumeralLesson['steps'][number];
const number = (n: bigint | number) => n.toLocaleString('en-US');
const sign = (glyph: string, place?: bigint): RenderToken => ({
  glyph,
  ...(place === undefined ? {} : { place: place.toString() }),
});
const count = (n: number, singular: string, plural = `${singular}s`) =>
  `${n} ${n === 1 ? singular : plural}`;
const addTerms = (terms: string[]) => terms.join(' + ');
const product = (digit: number | bigint, place: bigint) =>
  place === 1n ? number(digit) : `${number(digit)} × ${number(place)}`;
const check = (terms: string[], n: bigint) => `${addTerms(terms)} = ${number(n)}`;
const decimalPlace = (place: bigint) => {
  const names: Record<string, string> = {
    '1': 'ones',
    '10': 'tens',
    '100': 'hundreds',
    '1000': 'thousands',
  };
  return names[place.toString()] ?? `${number(place)}s`;
};

function localDigitExpression(system: SystemDefinition, digit: number): string {
  const group = system.engine === 'babylonian' ? 10 : 5;
  const large = Math.floor(digit / group);
  const small = digit % group;
  return addTerms([
    ...(large ? [`${large} × ${group}`] : []),
    ...(small || !large ? [String(small)] : []),
  ]);
}

function digitDescription(system: SystemDefinition, digit: number): string {
  if (system.id === 'maya') {
    if (digit === 0) return 'The shell sign means zero.';
    const bars = Math.floor(digit / 5);
    const dots = digit % 5;
    const parts = [bars ? count(bars, 'bar') : '', dots ? count(dots, 'dot') : ''].filter(Boolean);
    return `${parts.join(' and ')} ${bars + dots === 1 ? 'gives' : 'give'} ${bars ? `${bars} × 5${dots ? ` + ${dots}` : ''} = ` : ''}${digit}.`;
  }
  if (system.id === 'kaktovik') {
    if (digit === 0) return 'The zero sign means zero.';
    const fives = Math.floor(digit / 5);
    const ones = digit % 5;
    const parts = [
      fives ? `${count(fives, 'horizontal stroke')} worth five each` : '',
      ones ? `${count(ones, 'downward stroke')} worth one each` : '',
    ].filter(Boolean);
    return `${parts.join(' and ')} ${fives + ones === 1 ? 'gives' : 'give'} ${fives ? `${fives} × 5${ones ? ` + ${ones}` : ''} = ` : ''}${digit}.`;
  }
  if (system.engine === 'babylonian') {
    if (digit === 0) return 'Leave this group blank: its value is zero.';
    const tens = Math.floor(digit / 10);
    const ones = digit % 10;
    const parts = [
      tens ? `${count(tens, 'ten-wedge')} (${tens === 1 ? 'corner wedge' : 'corner wedges'})` : '',
      ones
        ? `${count(ones, 'one-wedge')} (${ones === 1 ? 'vertical wedge' : 'vertical wedges'})`
        : '',
    ].filter(Boolean);
    return `${parts.join(' and ')} ${tens + ones === 1 ? 'gives' : 'give'} ${tens ? `${tens} × 10${ones ? ` + ${ones}` : ''} = ` : ''}${digit}.`;
  }
  return `This sign is the digit ${digit}.`;
}

function positionalLesson(
  system: SystemDefinition,
  n: bigint,
  tokens: RenderToken[],
): NumeralLesson {
  const base = system.engine === 'babylonian' ? 60 : (system.radix ?? 10);
  const digits = baseDigits(n, base);
  const readingTokens = system.id === 'nko' ? [...tokens].reverse() : tokens;
  const highest = BigInt(base) ** BigInt(digits.length - 1);
  const maya = system.id === 'maya';
  const direction = maya
    ? 'The bottom level counts ones; each level above is worth 20 times the level below.'
    : system.id === 'nko'
      ? 'Read from right to left. The ones place is at the left; larger places extend to the right.'
      : `Read from left to right. The rightmost place counts ones; each place to its left is worth ${base} times as much.`;
  const steps: Step[] = [];
  if (highest > 1n) {
    const quotient = n / highest;
    const remainder = n % highest;
    steps.push({
      text: `${number(n)} ÷ ${number(highest)} = ${quotient}, remainder ${number(remainder)}. Start with ${quotient} in the ${number(highest)}s ${maya ? 'level' : 'place'}, then write the remainder in the lower ${maya ? 'levels' : 'places'}.`,
    });
  } else if (base !== 10) {
    steps.push({
      text: `${number(n)} is less than ${base}, so it fits in one ${maya ? 'level' : 'group'} in the ones place.`,
    });
  }
  let remainder = n;
  digits.forEach((digit, index) => {
    const place = BigInt(base) ** BigInt(digits.length - index - 1);
    const contribution = BigInt(digit) * place;
    const zero = digit === 0;
    const position = maya
      ? `${place === 1n ? 'bottom' : `${number(place)}s`} level`
      : `${place === 1n ? 'ones' : `${number(place)}s`} place`;
    const division =
      index > 0 && place > 1n && !zero
        ? `${number(remainder)} ÷ ${number(place)} = ${digit}, remainder ${number(remainder % place)}. `
        : '';
    const meaning = zero
      ? system.engine === 'babylonian'
        ? `Keep this empty ${position} between the other groups so they retain their place values.`
        : `Keep zero in the ${position}; this position contributes nothing.`
      : place === 1n
        ? `At the ${position}, it contributes ${digit}.`
        : `In the ${position}, it contributes ${product(digit, place)} = ${number(contribution)}.`;
    steps.push({
      text: `${division}${digitDescription(system, digit)} ${meaning}`,
      tokens: [readingTokens[index]],
    });
    remainder %= place;
  });
  return {
    text: direction,
    steps,
    equation:
      digits.length === 1 &&
      (system.engine === 'babylonian' || system.id === 'maya' || system.id === 'kaktovik')
        ? `${localDigitExpression(system, digits[0])} = ${number(n)}`
        : check(
            digits.map((digit, index) =>
              product(digit, BigInt(base) ** BigInt(digits.length - index - 1)),
            ),
            n,
          ),
    ...(system.engine === 'babylonian'
      ? { notes: ['The separated cells fix the integer place values used in this example.'] }
      : maya
        ? {
            notes: [
              'These levels use powers of 20. The Long Count calendar instead uses 360 in the third place.',
            ],
          }
        : {}),
  };
}

const signNames: Record<string, string> = {
  'egyptian-1': 'unit stroke',
  'egyptian-10': 'ten sign',
  'egyptian-100': 'rope-coil sign',
  'egyptian-1000': 'lotus sign',
  'mexica-1': 'dot',
  'mexica-20': 'flag',
  'mexica-400': 'feather sign',
  'mexica-8000': 'bag sign',
};

function additiveLesson(system: SystemDefinition, n: bigint, tokens: RenderToken[]): NumeralLesson {
  const groups = (system.values ?? []).flatMap(({ glyph, value }) => {
    const matching = tokens.filter((token) => token.glyph === glyph);
    return matching.length ? [{ glyph, value, tokens: matching }] : [];
  });
  const steps = groups.map(({ glyph, value, tokens: group }): Step => ({
    text:
      group.length === 1
        ? `Write this ${signNames[glyph] ?? 'sign'} for ${number(value)}. Its value is ${number(value)} by itself.`
        : `Write ${count(group.length, signNames[glyph] ?? 'sign')} worth ${number(value)} each: ${group.length} × ${number(value)} = ${number(group.length * value)}.`,
    tokens: group,
  }));
  if (system.engine === 'greek')
    steps.push({
      text: 'Put the numeral mark after the letters. It identifies a number and adds no value.',
      tokens: [sign('greek-mark')],
    });
  return {
    text:
      system.id === 'phoenician'
        ? 'Start at the right and move left, writing the larger values first in reading order. Add the values of the signs.'
        : 'Write the larger values first, from left to right. Each sign carries its own value; add the groups.',
    equation: check(
      groups.map(({ value, tokens: group }) =>
        group.length === 1 ? number(value) : `${group.length} × ${number(value)}`,
      ),
      n,
    ),
    steps,
  };
}

function romanLesson(n: bigint, tokens: RenderToken[]): NumeralLesson {
  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const letters = tokens.map((token) => token.glyph!.replace('roman-', ''));
  const steps: Step[] = [];
  const terms: string[] = [];
  for (let index = 0; index < letters.length;) {
    const letter = letters[index];
    const next = letters[index + 1];
    const value = values[letter];
    if (next && value < values[next]) {
      const larger = values[next];
      steps.push({
        text: `Read ${letter}${next} together: ${letter} = ${number(value)} comes before the larger ${next} = ${number(larger)}. This allowed subtraction pair means ${number(larger)} − ${number(value)} = ${number(larger - value)}.`,
        tokens: tokens.slice(index, index + 2),
      });
      terms.push(`(${number(larger)} − ${number(value)})`);
      index += 2;
    } else {
      let end = index + 1;
      while (letters[end] === letter) end++;
      const repetitions = end - index;
      steps.push({
        text:
          repetitions === 1
            ? `Read ${letter} as ${number(value)}. Add ${number(value)} to the total.`
            : `${letter} means ${number(value)}. ${letters.slice(index, end).join('')} repeats it ${repetitions} times: ${Array(repetitions).fill(number(value)).join(' + ')} = ${number(value * repetitions)}.`,
        tokens: tokens.slice(index, end),
      });
      terms.push(...Array(repetitions).fill(number(value)));
      index = end;
    }
  }
  return {
    text: 'Read from left to right. Treat an allowed subtraction pair as one group, then add the groups.',
    equation: `${letters.join('')} = ${addTerms(terms)} = ${number(n)}`,
    steps,
  };
}

function namedPowersLesson(system: SystemDefinition, n: bigint): NumeralLesson {
  let remainder = n;
  const steps: Step[] = [];
  const terms: string[] = [];
  const powers = system.engine === 'tamil' ? [1000n, 100n, 10n] : [1000n, 100n];
  for (const power of powers) {
    const coefficient = remainder / power;
    if (coefficient) {
      const tokens = [
        ...(coefficient === 1n ? [] : [sign(`${system.engine}-${coefficient}`)]),
        sign(`${system.engine}-${power}`),
      ];
      steps.push({
        text:
          coefficient === 1n
            ? `Write the ${number(power)} sign alone. The multiplier one is understood: it contributes ${number(power)}.`
            : `Write the coefficient ${coefficient} before the ${number(power)} sign. In this order they mean ${coefficient} × ${number(power)} = ${number(coefficient * power)}.`,
        tokens,
      });
      terms.push(coefficient === 1n ? number(power) : product(coefficient, power));
    }
    remainder %= power;
  }
  if (system.engine === 'sinhala') {
    const tens = (remainder / 10n) * 10n;
    if (tens) {
      steps.push({
        text: `Write the dedicated ${tens} sign. It contributes ${tens}; no multiplier or zero is needed.`,
        tokens: [sign(`sinhala-${tens}`)],
      });
      terms.push(number(tens));
    }
    remainder %= 10n;
  }
  if (remainder) {
    steps.push({
      text: `Finish with the ${remainder} sign for the remaining ${remainder} ${remainder === 1n ? 'one' : 'ones'}.`,
      tokens: [sign(`${system.engine}-${remainder}`)],
    });
    terms.push(number(remainder));
  }
  return {
    text: 'Read from left to right. A coefficient before a power sign multiplies that sign; groups with no value are left out.',
    equation: check(terms, n),
    steps,
  };
}

function ethiopicLesson(system: SystemDefinition, n: bigint): NumeralLesson {
  const signs = (value: bigint) => represent({ numerator: value, denominator: 1n }, system).tokens;
  const belowHundred = (value: bigint): string[] =>
    [(value / 10n) * 10n, value % 10n].filter((part) => part > 0n).map(number);
  const belowTenThousand = (value: bigint): string[] => {
    const hundreds = value / 100n;
    return [
      ...(hundreds
        ? [hundreds === 1n ? '100' : `(${addTerms(belowHundred(hundreds))}) × 100`]
        : []),
      ...belowHundred(value % 100n),
    ];
  };
  const steps: Step[] = [];
  const terms: string[] = [];
  const high = n / 10000n;
  let low = n % 10000n;
  if (high) {
    const coefficient = addTerms(belowTenThousand(high));
    steps.push({
      text:
        high === 1n
          ? 'Write the ten-thousand marker alone. Its multiplier one is understood, so it contributes 10,000.'
          : `The signs before the ten-thousand marker give ${coefficient} = ${number(high)}. The marker multiplies that whole amount by 10,000, giving ${number(high * 10000n)}.`,
      tokens: [...(high === 1n ? [] : signs(high)), sign('ethiopic-10000')],
    });
    terms.push(high === 1n ? '10,000' : `(${coefficient}) × 10,000`);
  }
  const hundreds = low / 100n;
  if (hundreds) {
    const coefficient = addTerms(belowHundred(hundreds));
    steps.push({
      text:
        hundreds === 1n
          ? 'Write the hundred marker alone: its multiplier one is understood, giving 100.'
          : `Write ${coefficient} = ${hundreds} before the hundred marker. The marker multiplies the entire preceding group: (${coefficient}) × 100 = ${number(hundreds * 100n)}.`,
      tokens: [...(hundreds === 1n ? [] : signs(hundreds)), sign('ethiopic-100')],
    });
    terms.push(hundreds === 1n ? '100' : `(${coefficient}) × 100`);
  }
  low %= 100n;
  if (low) {
    const parts = belowHundred(low);
    steps.push({
      text: `Finish with ${parts.length === 1 ? `the ${low} sign` : `the ${parts[0]} sign and the ${parts[1]} sign`}: ${addTerms(parts)}${parts.length > 1 ? ` = ${low}` : ''}. ${high || hundreds ? 'Add this amount after the multiplied groups.' : 'Each sign contributes its own value.'}`,
      tokens: signs(low),
    });
    terms.push(...parts);
  }
  return {
    text: 'Read left to right. Unit and tens signs add; the hundred and ten-thousand markers multiply the group before them.',
    equation: check(terms, n),
    steps,
  };
}

function kharoshthiLesson(n: bigint): NumeralLesson {
  const steps: Step[] = [];
  const terms: string[] = [];
  let remainder = n;
  const thousands = Number(remainder / 1000n);
  if (thousands) {
    steps.push({
      text: `Start at the right with ${count(thousands, 'thousand sign')}: ${thousands} × 1,000 = ${number(thousands * 1000)}.`,
      tokens: Array.from({ length: thousands }, () => sign('kharoshthi-1000')),
    });
    terms.push(thousands === 1 ? '1,000' : `${thousands} × 1,000`);
  }
  remainder %= 1000n;
  const hundreds = Number(remainder / 100n);
  if (hundreds) {
    let coefficient = hundreds;
    const units: number[] = [];
    if (hundreds !== 1)
      for (const value of [4, 3, 2, 1])
        while (coefficient >= value) {
          units.push(value);
          coefficient -= value;
        }
    const expression = addTerms(units.map(String));
    steps.push({
      text:
        hundreds === 1
          ? 'Continue left to the hundred sign. With no coefficient, it contributes 100.'
          : `In reading order, ${expression} comes before the hundred sign. Multiply that whole group by 100: (${expression}) × 100 = ${number(hundreds * 100)}.`,
      tokens: [
        sign('kharoshthi-100'),
        ...units.toReversed().map((value) => sign(`kharoshthi-${value}`)),
      ],
    });
    terms.push(hundreds === 1 ? '100' : `(${expression}) × 100`);
  }
  remainder %= 100n;
  for (const value of [20, 10, 4, 3, 2, 1]) {
    const repetitions = Number(remainder / BigInt(value));
    if (repetitions) {
      steps.push({
        text: `Continue left through ${count(repetitions, `${value} sign`)}. Add ${repetitions === 1 ? value : `${repetitions} × ${value} = ${repetitions * value}`}.`,
        tokens: Array.from({ length: repetitions }, () => sign(`kharoshthi-${value}`)),
      });
      terms.push(repetitions === 1 ? String(value) : `${repetitions} × ${value}`);
    }
    remainder %= BigInt(value);
  }
  return {
    text: 'Read from right to left. Hundreds use a coefficient; the remaining signs add their own values.',
    equation: check(terms, n),
    steps,
  };
}

function cistercianLesson(n: bigint): NumeralLesson {
  const places = [1000n, 100n, 10n, 1n];
  const corners = ['lower left', 'lower right', 'upper left', 'upper right'];
  const terms: string[] = [];
  const steps: Step[] = [];
  const empty: string[] = [];
  places.forEach((place, index) => {
    const digit = Number((n / place) % 10n);
    if (!digit) {
      empty.push(`${corners[index]} (${decimalPlace(place)})`);
      return;
    }
    const value = BigInt(digit) * place;
    steps.push({
      text: `The ${corners[index]} corner is the ${decimalPlace(place)} place. Its digit-${digit} strokes contribute ${product(digit, place)}${place === 1n ? '' : ` = ${number(value)}`}. Add these strokes to the shared staff.`,
      tokens: [sign(`cistercian-${value}`)],
    });
    terms.push(product(digit, place));
  });
  if (empty.length)
    steps.push({
      text: `Leave ${empty.join(' and ')} without digit strokes. Each empty corner contributes zero.`,
      tokens: [sign(`cistercian-${n}`)],
    });
  return {
    text: 'Build one numeral on a shared vertical staff. Each corner supplies a different decimal place.',
    equation: check(terms, n),
    steps,
  };
}

function physicalDecimalLesson(
  system: SystemDefinition,
  n: bigint,
  tokens: RenderToken[],
): NumeralLesson {
  const digits = n.toString().split('').map(Number);
  const steps = digits.map((digit, index): Step => {
    const place = 10n ** BigInt(digits.length - index - 1);
    const token = tokens[index];
    let description: string;
    if (system.engine === 'khipu') {
      description =
        digit === 0
          ? 'No knot is tied here, so the digit is zero.'
          : place > 1n
            ? `${count(digit, 'single knot')} ${digit === 1 ? 'gives' : 'give'} the digit ${digit}.`
            : digit === 1
              ? 'A figure-eight knot gives one in the ones place.'
              : `A long knot with ${digit} turns gives ${digit} in the ones place.`;
    } else if (system.engine === 'rods') {
      const vertical = (digits.length - index - 1) % 2 !== 0;
      const unitDirection = vertical ? 'vertical' : 'horizontal';
      const fiveDirection = vertical ? 'horizontal' : 'vertical';
      description =
        digit === 0
          ? 'Leave this board cell empty for zero.'
          : digit <= 5
            ? `${count(digit, `${unitDirection} rod`)} ${digit === 1 ? 'gives' : 'give'} ${digit}.`
            : `A ${fiveDirection} five-bar and ${count(digit - 5, `${unitDirection} unit rod`)} give 5 + ${digit - 5} = ${digit}.`;
    } else {
      const alternate = token.glyph?.startsWith('suzhou-horizontal-');
      description =
        digit >= 1 && digit <= 3
          ? `Write ${digit} with the ${alternate ? 'horizontal' : 'vertical'} form${alternate ? ' to separate it from the preceding vertical digit' : ''}.`
          : `Write the ${digit} sign${index < digits.length - 1 ? '; it ends any alternating run of 1, 2, and 3' : ''}.`;
    }
    return {
      text: `${description} ${digit === 0 ? `Keep ${system.engine === 'suzhou' ? 'zero in the' : 'the empty'} ${decimalPlace(place)} place so the other groups retain their values.` : place === 1n ? `In the ones place, it contributes ${digit}.` : `In the ${decimalPlace(place)} place, ${product(digit, place)} = ${number(BigInt(digit) * place)}.`}`,
      tokens: [token],
    };
  });
  return {
    text:
      system.engine === 'khipu'
        ? 'Read down the pendant cord from the highest decimal place to the ones position. Position gives each knot group its value.'
        : system.engine === 'rods'
          ? 'Place the rod groups in decimal columns. From right to left the columns count ones, tens, hundreds, and so on; adjacent columns alternate orientations.'
          : 'Write decimal digits from left to right. Within a run of 1, 2, and 3, alternate vertical and horizontal forms, starting with vertical.',
    equation: check(
      digits.map((digit, index) => product(digit, 10n ** BigInt(digits.length - index - 1))),
      n,
    ),
    steps,
  };
}

function writtenLesson(
  system: SystemDefinition,
  n: bigint,
  tokens: RenderToken[],
): NumeralLesson | undefined {
  if (system.id === 'mende-kikakui') {
    const terms: string[] = [];
    const steps: Step[] = [];
    for (const token of tokens.toReversed()) {
      const group = /^mende-group-(teens|\d+)-(\d+)$/.exec(token.glyph ?? '');
      const unit = /^mende-(\d+)$/.exec(token.glyph ?? '');
      if (group) {
        const digit = Number(group[2]);
        if (group[1] === 'teens') {
          terms.push(`(10 + ${digit})`);
          steps.push({
            text: `Attach the teens subscript below the ${digit} digit. This marker adds ten: 10 + ${digit} = ${10 + digit}. Keep the digit and its subscript together as one group.`,
            tokens: [token],
          });
        } else {
          const place = 10n ** BigInt(group[1]);
          terms.push(product(digit, place));
          steps.push({
            text: `Attach the ${number(place)}s subscript below the ${digit} digit. This marker multiplies: ${product(digit, place)} = ${number(BigInt(digit) * place)}.`,
            tokens: [token],
          });
        }
      } else if (unit) {
        terms.push(unit[1]);
        steps.push({
          text: `Write the ${unit[1]} digit on its own for the remaining ${unit[1]} ones.`,
          tokens: [token],
        });
      } else return undefined;
    }
    return {
      text: 'Read from right to left, starting with the largest group. A digit’s attached subscript gives the group its value; empty groups are omitted.',
      equation: check(terms, n),
      steps,
    };
  }
  if (system.id === 'cherokee' || system.id === 'ottoman-siyaq') {
    const readingTokens = system.id === 'ottoman-siyaq' ? tokens.toReversed() : tokens;
    const groups = readingTokens.map((token) => {
      const label = token.label?.replaceAll(',', '');
      const suffix = token.glyph?.match(/-(\d+)$/)?.[1];
      const value = label && /^\d+$/.test(label) ? label : suffix;
      return value === undefined ? undefined : { token, value: BigInt(value) };
    });
    if (groups.some((group) => group === undefined)) return undefined;
    const known = groups as { token: RenderToken; value: bigint }[];
    if (system.id === 'cherokee') {
      return {
        text:
          known.length === 1
            ? `The chart gives ${number(n)} its own numeral sign.`
            : 'Read from left to right. The tens sign and the units sign each carry a whole value; add them.',
        equation:
          known.length === 1
            ? number(n)
            : check(
                known.map(({ value }) => number(value)),
                n,
              ),
        steps: known.map(({ token, value }, index) => ({
          text:
            known.length === 1
              ? `Write this single sign for ${number(value)}. Its whole value is ${number(value)}.`
              : index === 0
                ? `Write the dedicated ${number(value)} sign first. It contributes all ${number(value)}.`
                : `Follow it with the ${number(value)} sign. Add ${number(value)} to the tens amount.`,
          tokens: [token],
        })),
      };
    }
    const hasTens = known.some(({ value }) => value >= 10n && value < 100n);
    const hasUnits = known.some(({ value }) => value < 10n);
    return {
      text: 'Read from right to left. Thousands and hundreds come first. In a compound of units and tens, read the unit before the tens sign.',
      equation:
        known.length === 1
          ? number(n)
          : check(
              known.map(({ value }) => number(value)),
              n,
            ),
      steps: known.map(({ token, value }, index) => ({
        text:
          value < 10n && hasTens
            ? `Read the ${value} unit sign before the tens sign. It contributes ${value}.`
            : value >= 10n && value < 100n && hasUnits
              ? `Continue left to the ${value} sign. It contributes all ${value}; add it after the unit value.`
              : `${index === 0 ? 'Start at the right with' : 'Continue left to'} the ${number(value)} sign. Its whole value is ${number(value)}.`,
        tokens: [token],
      })),
    };
  }
  return undefined;
}

export function numeralLesson(system: SystemDefinition, n: bigint): NumeralLesson | undefined {
  if (
    system.structure === 'Spoken' ||
    system.engine === 'explainer' ||
    system.engine === 'gestures' ||
    system.engine === 'yoruba'
  )
    return undefined;
  const representation = represent({ numerator: n, denominator: 1n }, system);
  if (representation.status !== 'ok') return undefined;
  switch (system.engine) {
    case 'positional':
    case 'babylonian':
      return positionalLesson(system, n, representation.tokens);
    case 'additive':
    case 'greek':
    case 'attic':
      return additiveLesson(system, n, representation.tokens);
    case 'roman':
      return romanLesson(n, representation.tokens);
    case 'tamil':
    case 'sinhala':
      return namedPowersLesson(system, n);
    case 'ethiopic':
      return ethiopicLesson(system, n);
    case 'kharoshthi':
      return kharoshthiLesson(n);
    case 'cistercian':
      return cistercianLesson(n);
    case 'rods':
    case 'suzhou':
    case 'khipu':
      return physicalDecimalLesson(system, n, representation.tokens);
    case 'written':
      return writtenLesson(system, n, representation.tokens);
    default:
      return undefined;
  }
}
