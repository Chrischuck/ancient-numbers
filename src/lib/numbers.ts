import type { Rational } from './types';
export function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}
export function rational(numerator: bigint, denominator = 1n): Rational {
  if (denominator === 0n) throw new Error('Division by zero is undefined.');
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  const divisor = gcd(numerator, denominator);
  return { numerator: numerator / divisor, denominator: denominator / divisor };
}
export function parseNumber(input: string): Rational {
  const text = input.trim();
  if (!text) throw new Error('Enter a number to begin.');
  if (text.replace(/\D/g, '').length > 100) throw new Error('Please use no more than 100 digits.');
  if (text.includes('/')) {
    if (!/^[+-]?\d+\s*\/\s*[+-]?\d+$/.test(text))
      throw new Error('Write a fraction as 3/2, with whole numbers above and below.');
    const [a, b] = text.split('/').map((s) => BigInt(s.trim()));
    return rational(a, b);
  }
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text))
    throw new Error('Use ordinary digits, a decimal like 1.5, or a fraction like 3/2.');
  const negative = text.startsWith('-');
  const unsigned = text.replace(/^[+-]/, '');
  const [whole, decimal = ''] = unsigned.split('.');
  return rational(
    BigInt((whole || '0') + decimal) * (negative ? -1n : 1n),
    10n ** BigInt(decimal.length),
  );
}
export function calculate(a: Rational, b: Rational, op: string): Rational {
  switch (op) {
    case 'add':
      return rational(
        a.numerator * b.denominator + b.numerator * a.denominator,
        a.denominator * b.denominator,
      );
    case 'subtract':
      return rational(
        a.numerator * b.denominator - b.numerator * a.denominator,
        a.denominator * b.denominator,
      );
    case 'multiply':
      return rational(a.numerator * b.numerator, a.denominator * b.denominator);
    case 'divide':
      return rational(a.numerator * b.denominator, a.denominator * b.numerator);
    default:
      throw new Error('Choose an arithmetic operation.');
  }
}
export function formatNumber(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  let d = value.denominator;
  while (d % 2n === 0n) d /= 2n;
  while (d % 5n === 0n) d /= 5n;
  if (d !== 1n) return `${value.numerator}/${value.denominator}`;
  const sign = value.numerator < 0n ? '-' : '';
  const n = value.numerator < 0n ? -value.numerator : value.numerator;
  let remainder = n % value.denominator;
  let digits = '';
  while (remainder && digits.length < 200) {
    remainder *= 10n;
    digits += (remainder / value.denominator).toString();
    remainder %= value.denominator;
  }
  return `${sign}${n / value.denominator}.${digits}`;
}
export function baseDigits(n: bigint, base: number): number[] {
  if (n === 0n) return [0];
  const digits: number[] = [];
  const b = BigInt(base);
  while (n) {
    digits.unshift(Number(n % b));
    n /= b;
  }
  return digits;
}
