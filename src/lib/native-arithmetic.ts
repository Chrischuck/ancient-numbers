import type { SystemDefinition, RenderToken } from './types';
import type { OperationLesson, OperationPart } from './operation-lessons';
import type { ArithmeticOperation } from './arithmetic-evidence';
import { arithmeticProfiles } from '../data/arithmetic-profiles';
import { evidenceLabels } from './arithmetic-evidence';
import { arithmeticColumns } from './operation-lessons';
import { baseDigits, rational, formatNumber } from './numbers';
import { represent } from './format';

export function nativeRadix(system: SystemDefinition): number {
  return system.id === 'babylonian' ? 60 : (system.radix ?? 10);
}
export function nativeDigits(digits: readonly number[], radix: number): string {
  if (digits.length > 48)
    return `${nativeDigits(digits.slice(0, 12), radix)}…${nativeDigits(digits.slice(-12), radix)} (${digits.length} base-${radix} places; abbreviated)`;
  if (radix <= 16) return digits.map((d) => d.toString(radix).toUpperCase()).join('');
  return `[${digits.join(', ')}]`;
}
export function nativeQuantity(system: SystemDefinition, value: bigint): string {
  const sign = value < 0n ? '−' : '';
  const magnitude = value < 0n ? -value : value;
  if (
    ['yoruba', 'mangarevan', 'ethiopic'].includes(system.id) &&
    magnitude >= BigInt(system.min) &&
    magnitude <= BigInt(system.max)
  ) {
    const shown = represent(rational(magnitude), system);
    if (shown.status === 'ok') {
      if (shown.tokens.every((token) => token.text !== undefined))
        return sign + shown.tokens.map((token) => token.text).join(' ');
      if (system.id === 'ethiopic')
        return (
          sign +
          shown.tokens
            .map((token) => {
              const unit = Number(token.glyph?.replace('ethiopic-', ''));
              return unit === 10000
                ? '፼'
                : unit === 100
                  ? '፻'
                  : unit >= 10
                    ? String.fromCodePoint(0x1372 + unit / 10 - 1)
                    : String.fromCodePoint(0x1369 + unit - 1);
            })
            .join('')
        );
    }
  }
  if (['mexica', 'yoruba', 'mangarevan'].includes(system.id)) {
    const groups: [bigint, string][] =
      system.id === 'mexica'
        ? [
            [8000n, 'bags'],
            [400n, 'feathers'],
            [20n, 'flags'],
            [1n, 'dots'],
          ]
        : system.id === 'mangarevan'
          ? [
              [80n, 'varu'],
              [40n, 'tataua'],
              [20n, 'paua'],
              [10n, 'takau'],
              [1n, 'ordinary units'],
            ]
          : [
              [20n, 'twenty-groups'],
              [1n, 'singles'],
            ];
    let remaining = magnitude;
    return (
      sign +
      (groups
        .flatMap(([unit, name]) => {
          const count = remaining / unit;
          remaining %= unit;
          const text = String(count);
          return count
            ? [
                `${text.length > 48 ? `${text.slice(0, 16)}…${text.slice(-12)} (${text.length} digits)` : text} ${name}`,
              ]
            : [];
        })
        .join(' + ') || 'no groups')
    );
  }
  return (
    sign +
    nativeDigits(baseDigits(value < 0n ? -value : value, nativeRadix(system)), nativeRadix(system))
  );
}
export function nativePicture(system: SystemDefinition, value: bigint): RenderToken[] | undefined {
  if (value < BigInt(system.min) || value > BigInt(system.max) || (!value && !system.zero)) return;
  const picture = represent(rational(value), system);
  return picture.status === 'ok' && picture.tokens.length <= 32 ? picture.tokens : undefined;
}
export function boundNativeParts(parts: OperationPart[]): OperationPart[] {
  return parts.length <= 14
    ? parts
    : [
        ...parts.slice(0, 6),
        {
          text: `${parts.length - 13} repeated intermediate steps are abbreviated; all groups are included in the completed answer.`,
        },
        ...parts.slice(-7),
      ];
}

/** Digits, carries and remainders stay in the selected radix throughout the worked algorithm. */
export function nativePositionalLesson(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: ArithmeticOperation,
): OperationLesson {
  const radix = nativeRadix(system),
    base = BigInt(radix);
  const n = (value: bigint | number) => nativeQuantity(system, BigInt(value));
  const profile = arithmeticProfiles[system.id];
  const names = {
    add: 'Addition',
    subtract: 'Subtraction',
    multiply: 'Multiplication',
    divide: 'Division',
  };
  const signs = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
  const parts: OperationPart[] = [];
  const part = (text: string, value?: bigint, hint?: string, previous?: bigint) => {
    parts.push({
      text,
      hint: hint ?? (value === undefined ? undefined : String(value)),
      tokens: value === undefined ? undefined : nativePicture(system, value),
      workspace:
        system.id === 'kaktovik' && value !== undefined && value >= 0n
          ? {
              kind: 'inupiaq-abacus',
              value: String(value),
              previous: previous === undefined ? undefined : String(previous),
              caption:
                'The bead changes perform the twenty-place calculation; the numeral records the new quantity.',
            }
          : undefined,
    });
  };
  let result = 0n;
  part(
    `Work with ${n(a)} and ${n(b)} in ${system.name}. Keep the same places throughout.`,
    a,
    `${a} ${signs[operation]} ${b}`,
  );
  if (operation === 'add' || operation === 'subtract') {
    let previous = a;
    for (const c of arithmeticColumns(a, b, radix, operation === 'subtract')) {
      for (const exchange of c.exchanges)
        part(
          `Exchange one unit in the ${n(exchange.from)} place for ${n(base)} units in the ${n(exchange.to)} place.`,
          undefined,
        );
      if (operation === 'add') {
        part(
          `In the ${n(c.place)} place: ${n(c.x)} + ${n(c.y)}${c.carry ? ` + ${n(c.carry)} carried` : ''} = ${n(c.raw)}.\nKeep ${n(c.digit)} here.${c.raw >= base ? ` Carry ${n(1)} to the next place.` : ''}${system.id === 'kaktovik' ? ' Five unit strokes make one five-stroke, and four five-strokes make one in the next place.' : system.id === 'maya' ? ' Five dots make one bar, and four bars make one in the next place.' : ''}`,
          c.board,
          `${c.x} + ${c.y}${c.carry ? ` + ${c.carry}` : ''} = ${c.raw}`,
          previous,
        );
      } else {
        part(
          `In the ${n(c.place)} place: ${n(c.x)} − ${n(c.y)} = ${n(c.digit)}.\nKeep the remaining digit; remove matching ${system.id === 'maya' ? 'dots and bars' : system.id === 'kaktovik' ? 'strokes' : 'digit quantities'}.`,
          c.board,
          `${c.x} − ${c.y} = ${c.digit}`,
          previous,
        );
      }
      previous = c.board;
    }
    result = a + (operation === 'subtract' ? -b : b);
  } else if (operation === 'multiply') {
    const left = baseDigits(a, radix).reverse(),
      right = baseDigits(b, radix).reverse();
    let accumulated = 0n;
    for (let j = 0; j < right.length; j++) {
      if (!right[j]) continue;
      let carry = 0n,
        partial = 0n;
      part(
        `Use multiplier digit ${n(right[j])} in the ${n(base ** BigInt(j))} place.`,
        BigInt(right[j]) * base ** BigInt(j),
      );
      for (let i = 0; i < left.length || carry; i++) {
        const x = BigInt(left[i] ?? 0),
          incoming = carry;
        const raw = x * BigInt(right[j]) + incoming;
        const digit = raw % base;
        carry = raw / base;
        partial += digit * base ** BigInt(i + j);
        part(
          `${n(x)} × ${n(right[j])}${incoming ? ` + ${n(incoming)} carried` : ''} = ${n(raw)}.\nWrite ${n(digit)} in the ${n(base ** BigInt(i + j))} place${carry ? `; carry ${n(carry)} to the next place` : ''}.`,
          partial,
          `${x} × ${right[j]}${incoming ? ` + ${incoming}` : ''} = ${raw}`,
        );
      }
      const before = accumulated;
      if (before)
        for (const c of arithmeticColumns(before, partial, radix, false)) {
          if (!c.y && !c.carry) continue;
          part(
            `Collect the partial products in the ${n(c.place)} place: ${n(c.x)} + ${n(c.y)}${c.carry ? ` + ${n(c.carry)} carried` : ''} = ${n(c.raw)}.\nKeep ${n(c.digit)}${c.raw >= base ? ` and carry ${n(1)}` : ''}.`,
            c.board,
            `${c.x} + ${c.y}${c.carry ? ` + ${c.carry}` : ''} = ${c.raw}`,
          );
        }
      accumulated += partial;
      part(`The collected partial product is ${n(accumulated)}.`, accumulated, undefined, before);
    }
    result = accumulated;
  } else {
    let remainder = 0n,
      quotient = 0n;
    for (const digit of baseDigits(a, radix)) {
      const before = remainder;
      remainder = remainder * base + BigInt(digit);
      part(
        `Bring down digit ${n(digit)} next to remainder ${n(before)}.\nThe working quantity is ${n(remainder)}.`,
        remainder,
      );
      const working = remainder;
      const q = remainder / b,
        used = q * b;
      remainder -= used;
      quotient = quotient * base + q;
      part(
        `${system.id === 'kaktovik' ? 'Match the divisor’s stroke groups: ' : ''}${n(b)} fits ${n(q)} times.\n${n(q)} × ${n(b)} = ${n(used)}.\nRemove that product and leave ${n(remainder)}.\nThe quotient so far is ${n(quotient)}.`,
        remainder,
        `${q} × ${b} = ${used}; remainder ${remainder}`,
        working,
      );
    }
    result = quotient;
    if (remainder)
      part(
        `The quotient is ${n(quotient)}, with remainder ${n(remainder)}.\nCheck: ${n(b)} × ${n(quotient)} + ${n(remainder)} = ${n(a)}.`,
        quotient,
        formatNumber(rational(a, b)),
      );
  }
  part(`The ${operation === 'divide' ? 'whole quotient' : 'answer'} is ${n(result)}.`, result);
  const quotientRemainder = operation === 'divide' ? a % b : 0n;
  return {
    title: `${names[operation]} · ${system.id === 'kaktovik' ? 'twenty-place strokes and beads' : system.id === 'maya' ? 'dot-and-bar places' : `${system.name} digit arithmetic`}`,
    text: 'Use the selected numerals and their place exchanges.',
    evidence: `${evidenceLabels[profile.evidence[operation]]}: ${profile.operationNotes[operation]}`,
    evidenceKind: profile.evidence[operation],
    sources: profile.sources,
    parts: boundNativeParts(parts),
    equation: `${n(a)} ${signs[operation]} ${n(b)} = ${n(result)}${quotientRemainder ? `, remainder ${n(quotientRemainder)}` : ''}`,
    notes: [
      profile.notationRole,
      `All working numerals are read in base ${radix}. English place descriptions and brackets are modern reading aids.`,
      ...(system.id === 'maya'
        ? [
            'This uses ordinary twenty-place rows, separate from the Long Count’s 360-day third position.',
          ]
        : []),
    ],
  };
}

/** Modern continuation uses the same written radix even when historical artwork is unavailable. */
export function nativeRationalLesson(
  system: SystemDefinition,
  first: import('./types').Rational,
  second: import('./types').Rational,
  operation: ArithmeticOperation,
): OperationLesson {
  const { numerator: p, denominator: q } = first,
    { numerator: r, denominator: s } = second;
  const result =
    operation === 'add'
      ? rational(p * s + r * q, q * s)
      : operation === 'subtract'
        ? rational(p * s - r * q, q * s)
        : operation === 'multiply'
          ? rational(p * r, q * s)
          : rational(p * s, q * r);
  const n = (v: bigint) => nativeQuantity(system, v);
  const show = (v: import('./types').Rational) =>
    v.denominator === 1n ? n(v.numerator) : `${n(v.numerator)}/${n(v.denominator)}`;
  const decimal = (v: import('./types').Rational) => {
    const text = formatNumber(v);
    return text.length < 80
      ? text
      : `${text.slice(0, 32)}…${text.slice(-18)} (${v.numerator.toString().replace('-', '').length} digits)`;
  };
  const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' },
    names = {
      add: 'Addition',
      subtract: 'Subtraction',
      multiply: 'Multiplication',
      divide: 'Division',
    };
  const equation = `${show(first)} ${symbols[operation]} ${show(second)} = ${show(result)}`;
  const parts: OperationPart[] = [
    {
      text: `Keep the quantities ${show(first)} and ${show(second)} in the selected radix.`,
      hint: `${decimal(first)} ${symbols[operation]} ${decimal(second)}`,
    },
  ];
  if (operation === 'add' || operation === 'subtract')
    parts.push({
      text: `Use a common denominator ${n(q)} × ${n(s)} = ${n(q * s)}.\nThe numerators become ${n(p * s)} and ${n(r * q)}.\n${n(p * s)} ${symbols[operation]} ${n(r * q)} = ${n(operation === 'add' ? p * s + r * q : p * s - r * q)}.`,
      hint: decimal(result),
    });
  else if (operation === 'multiply')
    parts.push({
      text: `Multiply numerator groups: ${n(p)} × ${n(r)} = ${n(p * r)}.\nMultiply denominator groups: ${n(q)} × ${n(s)} = ${n(q * s)}.`,
      hint: decimal(result),
    });
  else
    parts.push({
      text: `Multiply by the reciprocal ${n(s)}/${n(r)}.\nThe numerator is ${n(p)} × ${n(s)} = ${n(p * s)}.\nThe denominator is ${n(q)} × ${n(r)} = ${n(q * r)}.`,
      hint: decimal(result),
    });
  parts.push({
    text: `The reduced result is ${show(result)}. No unavailable historical sign is invented.`,
    hint: `${decimal(first)} ${symbols[operation]} ${decimal(second)} = ${decimal(result)}`,
  });
  return {
    title: `${names[operation]} · same-base continuation`,
    text: 'The written working stays in the selected radix. Signed or fractional notation here is a modern teaching continuation.',
    evidence:
      'Exact modern continuation: the inputs exceed the selected historical diagram or integer-worked range.',
    evidenceKind: 'modern',
    equation,
    parts,
    sources: arithmeticProfiles[system.id].sources,
  };
}
