import type { Representation, RenderToken, SystemDefinition } from './types';

const unsupported = (reason: string): Representation => ({
  status: 'unsupported',
  tokens: [],
  layout: 'row',
  explanation: '',
  reason,
});

export function representWrittenExpansion(n: bigint, system: SystemDefinition): Representation {
  if (n < BigInt(system.min) || n > BigInt(system.max))
    return unsupported(
      `This converter supports ${system.min}–${Number(system.max).toLocaleString('en-US')}. This is the app’s verified range.`,
    );

  if (system.id === 'mende-kikakui') {
    const logical: RenderToken[] = [];
    const sequences: string[] = [];
    const terms: string[] = [];
    const group = (digit: number, power: number | 'teens') => {
      const amount = power === 'teens' ? digit + 10 : digit * 10 ** power;
      logical.push({
        glyph: power === 0 ? `mende-${digit}` : `mende-group-${power}-${digit}`,
        label: `${amount.toLocaleString('en-US')}`,
      });
      const mark =
        power === 0 ? '' : String.fromCodePoint(power === 'teens' ? 0x1e8d0 : 0x1e8d0 + power);
      sequences.push(String.fromCodePoint(0x1e8c6 + digit) + mark);
      terms.push(
        power === 'teens'
          ? `10 + ${digit}`
          : power === 0
            ? `${digit}`
            : `${digit} × ${(10 ** power).toLocaleString('en-US')}`,
      );
    };
    let rest = n;
    for (let power = 6; power >= 2; power--) {
      const magnitude = 10n ** BigInt(power);
      const coefficient = Number(rest / magnitude);
      if (coefficient) group(coefficient, power);
      rest %= magnitude;
    }
    if (rest >= 11n && rest <= 19n) group(Number(rest - 10n), 'teens');
    else {
      const tens = Number(rest / 10n);
      if (tens) group(tens, 1);
      const units = Number(rest % 10n);
      if (units) group(units, 0);
    }
    return {
      status: 'ok',
      tokens: logical.reverse(),
      layout: 'row',
      unicode: sequences.join(''),
      explanation: `${terms.join(' + ')} = ${n.toLocaleString('en-US')}. Read from right to left, starting with the largest group. Each subscript stays attached beneath its digit. The teens subscript adds ten; other subscripts multiply by a power of ten. Empty groups are omitted.`,
    };
  }

  if (system.id === 'cherokee') {
    const amount = Number(n);
    const values =
      amount <= 20 || amount === 100 || amount % 10 === 0
        ? [amount]
        : [Math.floor(amount / 10) * 10, amount % 10];
    return {
      status: 'ok',
      tokens: values.map((value) => ({ glyph: `cherokee-${value}`, label: `${value}` })),
      layout: 'row',
      explanation: `${values.join(' + ')} = ${amount}. ${values.length === 1 ? 'The chart gives this amount its own numerical sign.' : 'Read the tens sign, then the separate units sign; add their whole values.'} This follows the Cherokee Nation’s complete 0–100 chart of Sequoyah’s proposed numerals.`,
    };
  }

  if (system.id === 'ottoman-siyaq') {
    let rest = Number(n);
    const logical: number[] = [];
    const terms: number[] = [];
    for (const magnitude of [1000, 100]) {
      const value = Math.floor(rest / magnitude) * magnitude;
      if (value) {
        logical.push(value);
        terms.push(value);
      }
      rest %= magnitude;
    }
    const tens = Math.floor(rest / 10) * 10;
    const units = rest % 10;
    // Unicode §22.3.7 / Pandey §4: compound tens and primary units are
    // transposed in logical RTL order: unit first, then the tens sign.
    if (units) logical.push(units);
    if (tens) logical.push(tens);
    if (tens) terms.push(tens);
    if (units) terms.push(units);
    const codepoint = (value: number) => {
      const power = Math.floor(Math.log10(value));
      return String.fromCodePoint(0x1ed00 + power * 9 + value / 10 ** power);
    };
    return {
      status: 'ok',
      tokens: [...logical]
        .reverse()
        .map((value) => ({
          glyph: `ottoman-siyaq-${value}`,
          label: `${value.toLocaleString('en-US')}`,
        })),
      layout: 'row',
      unicode: logical.map(codepoint).join(''),
      explanation: `${terms.map((term) => term.toLocaleString('en-US')).join(' + ')} = ${n.toLocaleString('en-US')}. Read right to left. Thousands and hundreds precede smaller groups, but a compound of units and tens puts the unit before the tens sign in reading order. These are primary character forms, spaced apart for teaching; manuscripts also use joined and alternate forms.`,
    };
  }

  return unsupported('This written tradition has no verified conversion rule in this adapter.');
}
