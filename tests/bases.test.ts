import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASE_OPTIONS,
  MAX_BASE_PLACES,
  binaryHexGroups,
  convertBase,
  numeralBase,
  parseBaseNumeral,
  renderBaseLesson,
} from '../src/lib/bases';

test('converts the same quantity across all supported bases', () => {
  for (const [source, expected] of [
    ['2', '101010'],
    ['10', '42'],
    ['16', '2A'],
    ['20', '2,2'],
    ['60', '42'],
  ]) {
    const base = numeralBase(source);
    assert.equal(convertBase('42', 10, base).output, expected);
    assert.equal(convertBase(expected, base, 10).output, '42');
  }
});

test('place-value expansion and remainder steps explain each conversion', () => {
  const lesson = convertBase('2a', 16, 2);
  assert.equal(lesson.source, '2A');
  assert.equal(lesson.decimal, 42n);
  assert.deepEqual(lesson.expansion, [
    { digit: 2, exponent: 1, power: 16n, contribution: 32n },
    { digit: 10, exponent: 0, power: 1n, contribution: 10n },
  ]);
  assert.deepEqual(
    lesson.divisions.map((step) => step.remainder),
    [0, 1, 0, 1, 0, 1],
  );
  for (const step of lesson.divisions) {
    assert.equal(step.dividend, step.quotient * 2n + BigInt(step.remainder));
  }
  assert.equal(lesson.divisions.at(-1)?.quotient, 0n);
});

test('base 20 and 60 preserve explicit zero places and use comma-separated decimal digits', () => {
  assert.equal(convertBase('1,0,1', 60, 10).output, '3601');
  assert.equal(convertBase('3601', 10, 60).output, '1,0,1');
  assert.equal(convertBase('1, 0, 1', 20, 10).output, '401');
  assert.equal(convertBase('400', 10, 20).output, '1,0,0');
  assert.equal(convertBase('1,12', 60, 10).output, '72');
  assert.equal(convertBase('12', 60, 10).output, '12');
  for (const input of ['1 12', '1:12', '1;12', '1,,12', ',1', '1,', '1,2.5']) {
    assert.throws(() => parseBaseNumeral(input, 60), /commas/);
  }
  assert.throws(() => parseBaseNumeral('1,60', 60), /less than 60/);
  assert.throws(() => parseBaseNumeral('20', 20), /less than 20/);
  assert.throws(() => parseBaseNumeral('1000', 60), /between 0 and 59/);
});

test('zero and leading zeroes have canonical output in every base', () => {
  for (const option of BASE_OPTIONS) {
    const input = option.value > 16 ? '0,0' : '000';
    const lesson = convertBase(input, option.value, option.value);
    assert.equal(lesson.source, '0');
    assert.equal(lesson.output, '0');
    assert.deepEqual(lesson.divisions, [{ dividend: 0n, quotient: 0n, remainder: 0 }]);
  }
});

test('conversions remain exact beyond JavaScript number precision', () => {
  assert.equal(convertBase('9007199254740993', 10, 16).output, '20000000000001');
  assert.equal(convertBase('20000000000001', 16, 10).output, '9007199254740993');
  const largest = Array(MAX_BASE_PLACES).fill('59').join(',');
  const result = convertBase(largest, 60, 2);
  assert.equal(result.decimal, 60n ** BigInt(MAX_BASE_PLACES) - 1n);
  assert.equal(BigInt(`0b${result.output}`), result.decimal);
});

test('rejects invalid digits, unsupported notation, bases, and excessive input', () => {
  assert.throws(() => parseBaseNumeral('102', 2), /Digit 2.*base 2/);
  assert.throws(() => parseBaseNumeral('A', 10), /Digit A.*base 10/);
  for (const input of ['', '-1', '1.5', '1/2', '0x2A', '0b10', '1 0', '<script>']) {
    assert.throws(() => parseBaseNumeral(input, 16));
  }
  assert.throws(() => parseBaseNumeral('1'.repeat(MAX_BASE_PLACES + 1), 2), /16 place digits/);
  assert.throws(() => parseBaseNumeral(Array(17).fill('1').join(','), 60), /16 place digits/);
  for (const base of [0, 1, 3, 36, 'nope']) assert.throws(() => numeralBase(base), /Choose base/);
});

test('every hex digit maps to exactly four binary bits, including leading zeroes', () => {
  assert.deepEqual(binaryHexGroups(173n), [
    { hex: 'A', binary: '1010' },
    { hex: 'D', binary: '1101' },
  ]);
  assert.deepEqual(binaryHexGroups(0n), [{ hex: '0', binary: '0000' }]);
  assert.deepEqual(binaryHexGroups(1n), [{ hex: '1', binary: '0001' }]);
  assert.equal(
    binaryHexGroups(0x0123456789abcdefn)
      .map((group) => group.binary)
      .join(''),
    '000100100011010001010110011110001001101010111100110111101111',
  );
  assert.throws(() => binaryHexGroups(-1n), /nonnegative/);
});

test('the server-rendered lesson contains readable steps and hexadecimal digit mapping', () => {
  const html = renderBaseLesson(convertBase('42', 10, 16));
  assert.match(html, /Read the source number/);
  assert.match(html, /Write the target number/);
  assert.match(html, /From base 10 to decimal/);
  assert.match(html, /From decimal to base 16/);
  assert.match(html, /10 → A/);
  assert.match(html, /remainders from bottom to top/);
  assert.match(html, /2A in base 16/);
});
