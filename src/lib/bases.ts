import { escapeHTML } from './glyphs';

export const BASE_OPTIONS = [
  { value: 2, name: 'Binary · base 2', digits: '0 and 1', example: '101010' },
  { value: 10, name: 'Decimal · base 10', digits: '0–9', example: '42' },
  { value: 16, name: 'Hexadecimal · base 16', digits: '0–9 and A–F', example: '2A' },
  { value: 20, name: 'Vigesimal · base 20', digits: '0–19, separated by commas', example: '2,2' },
  {
    value: 60,
    name: 'Sexagesimal · base 60',
    digits: '0–59, separated by commas',
    example: '1,12',
  },
] as const;

export type NumeralBase = (typeof BASE_OPTIONS)[number]['value'];
export const MAX_BASE_PLACES = 16;
const alphabet = '0123456789ABCDEF';

export interface BaseConversion {
  sourceBase: NumeralBase;
  targetBase: NumeralBase;
  source: string;
  sourceDigits: number[];
  decimal: bigint;
  output: string;
  targetDigits: number[];
  expansion: { digit: number; exponent: number; power: bigint; contribution: bigint }[];
  divisions: { dividend: bigint; quotient: bigint; remainder: number }[];
}

export function numeralBase(value: number | string): NumeralBase {
  const parsed = Number(value);
  if (!BASE_OPTIONS.some((option) => option.value === parsed)) {
    throw new Error('Choose base 2, 10, 16, 20, or 60.');
  }
  return parsed as NumeralBase;
}

export function baseDigit(digit: number, base: NumeralBase): string {
  return base <= 16 ? alphabet[digit] : String(digit);
}

function joinDigits(digits: number[], base: NumeralBase): string {
  return digits.map((digit) => baseDigit(digit, base)).join(base > 16 ? ',' : '');
}

export function parseBaseNumeral(input: string, base: NumeralBase) {
  numeralBase(base);
  const text = input.trim().toUpperCase();
  if (!text) throw new Error('Enter a whole number to convert.');
  if (text.length > 128) throw new Error(`Use at most ${MAX_BASE_PLACES} place digits.`);
  if (/^0[BXO]/.test(text)) {
    throw new Error(
      'Enter digits without a 0b, 0x, or 0o prefix; the From base field sets the base. For a hexadecimal number beginning with B, write B10 rather than 0B10.',
    );
  }
  let digits: number[];
  if (base > 16) {
    if (!/^\d+(?:\s*,\s*\d+)*$/.test(text)) {
      throw new Error(
        `In base ${base}, separate whole-number place digits with commas, such as ${base === 20 ? '2,2' : '1,12'}. Spaces alone, colons, and semicolons are not separators here.`,
      );
    }
    const groups = text.split(',').map((group) => group.trim());
    if (groups.some((group) => group.length > 2)) {
      throw new Error(`Each base-${base} place digit must be between 0 and ${base - 1}.`);
    }
    digits = groups.map(Number);
  } else {
    if (!/^[0-9A-F]+$/.test(text)) {
      throw new Error(
        `Use ${base === 16 ? '0–9 and A–F' : base === 2 ? 'only 0 and 1' : 'only 0–9'} without prefixes, signs, spaces, or a decimal point.`,
      );
    }
    digits = [...text].map((character) => alphabet.indexOf(character));
  }
  if (digits.length > MAX_BASE_PLACES) {
    throw new Error(`Use at most ${MAX_BASE_PLACES} place digits.`);
  }
  const invalid = digits.findIndex((digit) => digit >= base);
  if (invalid !== -1) {
    throw new Error(
      `Digit ${baseDigit(digits[invalid], base)} in place ${invalid + 1} is not valid in base ${base}. Each digit must be less than ${base}.`,
    );
  }
  // Leading zeroes are valid, but do not create additional places in the worked lesson.
  while (digits.length > 1 && digits[0] === 0) digits.shift();
  const value = digits.reduce((total, digit) => total * BigInt(base) + BigInt(digit), 0n);
  return { digits, value, normalized: joinDigits(digits, base) };
}

export function convertBase(
  input: string,
  sourceBase: NumeralBase,
  targetBase: NumeralBase,
): BaseConversion {
  numeralBase(targetBase);
  const parsed = parseBaseNumeral(input, sourceBase);
  const expansion = parsed.digits.map((digit, index) => {
    const exponent = parsed.digits.length - 1 - index;
    const power = BigInt(sourceBase) ** BigInt(exponent);
    return { digit, exponent, power, contribution: BigInt(digit) * power };
  });
  const divisions: BaseConversion['divisions'] = [];
  let dividend = parsed.value;
  do {
    const quotient = dividend / BigInt(targetBase);
    const remainder = Number(dividend % BigInt(targetBase));
    divisions.push({ dividend, quotient, remainder });
    dividend = quotient;
  } while (dividend > 0n);
  const targetDigits = divisions.map((step) => step.remainder).reverse();
  return {
    sourceBase,
    targetBase,
    source: parsed.normalized,
    sourceDigits: parsed.digits,
    decimal: parsed.value,
    output: joinDigits(targetDigits, targetBase),
    targetDigits,
    expansion,
    divisions,
  };
}

export function binaryHexGroups(value: bigint) {
  if (value < 0n) throw new Error('Use a nonnegative whole number.');
  return [...value.toString(16).toUpperCase()].map((hex) => ({
    hex,
    binary: alphabet.indexOf(hex).toString(2).padStart(4, '0'),
  }));
}

const decimal = (value: bigint) => value.toString();
const numeral = (value: string, base: NumeralBase) =>
  `<span class="base-numeral" aria-label="${escapeHTML(value)} in base ${base}">${escapeHTML(value)}<sub aria-hidden="true">${base}</sub></span>`;

/** Shared by the initial server-rendered lesson and the interactive converter. */
export function renderBaseLesson(lesson: BaseConversion): string {
  const { sourceBase, targetBase } = lesson;
  const result = `${lesson.source} in base ${sourceBase} equals ${lesson.output} in base ${targetBase}`;
  const remainder = (digit: number) =>
    targetBase === 16 && digit >= 10 ? `${digit} → ${baseDigit(digit, targetBase)}` : String(digit);
  return `<div class="base-result-summary">
    <span class="eyebrow">THE SAME QUANTITY, WRITTEN TWO WAYS</span>
    <p class="base-result-equation">${numeral(lesson.source, sourceBase)} <span aria-hidden="true">=</span> ${numeral(lesson.output, targetBase)}</p>
    <p>Decimal value: <strong>${decimal(lesson.decimal)}</strong>. The small subscript names the base; it is not part of the number.</p>
  </div>
  <div class="base-worked-grid">
    <section class="base-worked-step" aria-labelledby="base-read-heading">
      <span class="base-step-number" aria-hidden="true">01</span>
      <h3 id="base-read-heading">Read the source number</h3>
      <p>Start with 1 at the right. Multiply each place value by ${sourceBase} as you move left, then add each digit’s contribution.</p>
      <div class="base-table-scroll" tabindex="0" role="region" aria-label="Source place-value expansion">
        <table class="base-work-table">
          <caption>From base ${sourceBase} to decimal</caption>
          <thead><tr><th scope="col">Digit</th><th scope="col">Place value</th><th scope="col">Contribution</th></tr></thead>
          <tbody>${lesson.expansion
            .map(
              (step) =>
                `<tr><th scope="row">${baseDigit(step.digit, sourceBase)}${sourceBase === 16 && step.digit >= 10 ? ` <small>(${step.digit})</small>` : ''}</th><td>${sourceBase}<sup>${step.exponent}</sup> = ${decimal(step.power)}</td><td>${step.digit} × ${decimal(step.power)} = <strong>${decimal(step.contribution)}</strong></td></tr>`,
            )
            .join('')}</tbody>
        </table>
      </div>
      <p class="base-step-answer">${lesson.expansion.map((step) => decimal(step.contribution)).join(' + ')} = <strong>${decimal(lesson.decimal)}</strong></p>
    </section>
    <section class="base-worked-step" aria-labelledby="base-write-heading">
      <span class="base-step-number" aria-hidden="true">02</span>
      <h3 id="base-write-heading">Write the target number</h3>
      <p>Divide the decimal value by ${targetBase}. Keep the remainder, divide the quotient again, and stop when the quotient is 0.</p>
      <div class="base-table-scroll" tabindex="0" role="region" aria-label="Repeated division into target base">
        <table class="base-work-table">
          <caption>From decimal to base ${targetBase}</caption>
          <thead><tr><th scope="col">Divide by ${targetBase}</th><th scope="col">Quotient</th><th scope="col">Remainder</th></tr></thead>
          <tbody>${lesson.divisions
            .map(
              (step) =>
                `<tr><th scope="row">${decimal(step.dividend)} ÷ ${targetBase}</th><td>${decimal(step.quotient)}</td><td class="base-remainder">${remainder(step.remainder)}</td></tr>`,
            )
            .join('')}</tbody>
        </table>
      </div>
      <p class="base-read-up">↑ Read the remainders from bottom to top.${targetBase > 16 ? ' Commas separate the place digits.' : ''}</p>
      <p class="base-step-answer">${numeral(lesson.output, targetBase)}${lesson.decimal === 0n ? ' — zero is written 0 in every base here.' : ''}</p>
    </section>
  </div>
  <p class="sr-only" id="base-conversion-description">${escapeHTML(result)}</p>`;
}
