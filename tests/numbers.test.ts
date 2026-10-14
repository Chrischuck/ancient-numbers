import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNumber, calculate, formatNumber } from '../src/lib/numbers';
import { represent } from '../src/lib/format';
import { getSystem } from '../src/data/systems';
const rep = (id: string, n: string) => represent(parseNumber(n), getSystem(id)!);
const ids = (id: string, n: string) => rep(id, n).tokens.map((t) => t.glyph);
test('finite decimal arithmetic stays exact', () => {
  assert.equal(formatNumber(calculate(parseNumber('0.1'), parseNumber('0.2'), 'add')), '0.3');
  assert.equal(
    formatNumber(calculate(parseNumber('9007199254740993'), parseNumber('1'), 'add')),
    '9007199254740994',
  );
});
test('fractions normalize and remain exact through all four operations', () => {
  assert.equal(formatNumber(parseNumber('6/-8')), '-0.75');
  assert.equal(formatNumber(calculate(parseNumber('1/3'), parseNumber('1/6'), 'add')), '0.5');
  assert.equal(formatNumber(calculate(parseNumber('2/3'), parseNumber('1/3'), 'subtract')), '1/3');
  assert.equal(formatNumber(calculate(parseNumber('2/3'), parseNumber('3/5'), 'multiply')), '0.4');
  assert.equal(formatNumber(calculate(parseNumber('2/3'), parseNumber('4/3'), 'divide')), '0.5');
});
test('zero is canonical, and invalid numbers are rejected', () => {
  assert.equal(formatNumber(parseNumber('-0.00')), '0');
  assert.equal(formatNumber(parseNumber('.5')), '0.5');
  for (const n of [
    '',
    'Infinity',
    'NaN',
    '4e12',
    '1/0',
    '1.5/2',
    '1,00',
    '9'.repeat(101),
    '<script>',
  ])
    assert.throws(() => parseNumber(n));
  assert.throws(() => calculate(parseNumber('1'), parseNumber('0'), 'divide'), /zero/);
});
test('Kaktovik transitions preserve every place including internal zero', () => {
  assert.deepEqual(ids('kaktovik', '19'), ['kaktovik-19']);
  assert.deepEqual(ids('kaktovik', '20'), ['kaktovik-1', 'kaktovik-0']);
  assert.deepEqual(ids('kaktovik', '42'), ['kaktovik-2', 'kaktovik-2']);
  assert.deepEqual(ids('kaktovik', '401'), ['kaktovik-1', 'kaktovik-0', 'kaktovik-1']);
});
test('ordinary Maya positional values do not silently use calendar360', () => {
  assert.equal(rep('maya', '400').layout, 'stack');
  assert.deepEqual(ids('maya', '400'), ['maya-1', 'maya-0', 'maya-0']);
  assert.deepEqual(ids('maya', '360'), ['maya-18', 'maya-0']);
});
test('selected Roman modern convention includes subtractive pairs', () => {
  assert.deepEqual(
    ids('roman', '1994'),
    [...'MCMXCIV'].map((c) => `roman-${c}`),
  );
  assert.equal(rep('roman', '0').status, 'unsupported');
  assert.equal(rep('roman', '4000').status, 'unsupported');
});
test('right-to-left traditions keep historical visual reading order', () => {
  assert.deepEqual(ids('nko', '42'), ['nko-2', 'nko-4']);
  assert.deepEqual(ids('phoenician', '55'), [
    'phoenician-2',
    'phoenician-3',
    'phoenician-10',
    'phoenician-20',
    'phoenician-20',
  ]);
});
test('Kharoshthi reproduces Unicode worked example1996', () => {
  assert.deepEqual(ids('kharoshthi', '1996'), [
    'kharoshthi-2',
    'kharoshthi-4',
    'kharoshthi-10',
    'kharoshthi-20',
    'kharoshthi-20',
    'kharoshthi-20',
    'kharoshthi-20',
    'kharoshthi-100',
    'kharoshthi-1',
    'kharoshthi-4',
    'kharoshthi-4',
    'kharoshthi-1000',
  ]);
  assert.deepEqual(ids('kharoshthi', '100'), ['kharoshthi-100']);
});
test('Ethiopic source example2345 uses coefficient and hundred', () => {
  assert.deepEqual(ids('ethiopic', '2345'), [
    'ethiopic-20',
    'ethiopic-3',
    'ethiopic-100',
    'ethiopic-40',
    'ethiopic-5',
  ]);
  assert.deepEqual(ids('ethiopic', '10000'), ['ethiopic-10000']);
  assert.deepEqual(ids('ethiopic', '1000000'), ['ethiopic-100', 'ethiopic-10000']);
});
test('Tamil multiplicative source examples156 and3782', () => {
  assert.deepEqual(ids('tamil', '156'), ['tamil-100', 'tamil-5', 'tamil-10', 'tamil-6']);
  assert.deepEqual(ids('tamil', '3782'), [
    'tamil-3',
    'tamil-1000',
    'tamil-7',
    'tamil-100',
    'tamil-8',
    'tamil-10',
    'tamil-2',
  ]);
});
test('Sinhala reproduces the SLSI N3888 page 4 compound examples', () => {
  const fixtures: [string, number[]][] = [
    ['100', [100]],
    ['101', [100, 1]],
    ['102', [100, 2]],
    ['109', [100, 9]],
    ['110', [100, 10]],
    ['111', [100, 10, 1]],
    ['222', [2, 100, 20, 2]],
    ['333', [3, 100, 30, 3]],
    ['444', [4, 100, 40, 4]],
    ['555', [5, 100, 50, 5]],
    ['666', [6, 100, 60, 6]],
    ['777', [7, 100, 70, 7]],
    ['888', [8, 100, 80, 8]],
    ['999', [9, 100, 90, 9]],
    ['1000', [1000]],
    ['1987', [1000, 9, 100, 80, 7]],
    ['2010', [2, 1000, 10]],
  ];
  for (const [value, signs] of fixtures)
    assert.deepEqual(
      ids('sinhala', value),
      signs.map((sign) => `sinhala-${sign}`),
      value,
    );
  assert.equal(rep('sinhala', '1987').explanation, '1,000 + 9 × 100 + 80 + 7 = 1,987');
});
test('Sinhala omits empty groups and bounds the verified four-place composition', () => {
  // Rule-derived cases; these values are not claimed as printed source examples.
  for (const [value, signs] of [
    ['1001', [1000, 1]],
    ['1010', [1000, 10]],
    ['1100', [1000, 100]],
    ['2000', [2, 1000]],
    ['9009', [9, 1000, 9]],
    ['9999', [9, 1000, 9, 100, 90, 9]],
  ] as [string, number[]][])
    assert.deepEqual(
      ids('sinhala', value),
      signs.map((sign) => `sinhala-${sign}`),
      value,
    );
  for (const value of ['0', '-1', '1/2', '10000'])
    assert.equal(rep('sinhala', value).status, 'unsupported', value);
});
test('Suzhou archival examples alternate runs of firstthree', () => {
  assert.deepEqual(ids('suzhou', '123'), ['suzhou-1', 'suzhou-horizontal-2', 'suzhou-3']);
  assert.deepEqual(ids('suzhou', '312'), ['suzhou-3', 'suzhou-horizontal-1', 'suzhou-2']);
  assert.deepEqual(ids('suzhou', '1412'), [
    'suzhou-1',
    'suzhou-4',
    'suzhou-1',
    'suzhou-horizontal-2',
  ]);
});
test('rods retain blank cell and correct alternating Song orientation', () => {
  assert.deepEqual(ids('rods', '6708'), ['rods-tens-6', 'rods-unit-7', 'rods-zero', 'rods-unit-8']);
  assert.deepEqual(ids('rods', '0'), ['rods-zero']);
});
test('Babylonian integergrid preserves empty internal and trailing places', () => {
  assert.deepEqual(ids('babylonian', '3601'), ['babylonian-1', 'babylonian-0', 'babylonian-1']);
  assert.deepEqual(ids('babylonian', '60'), ['babylonian-1', 'babylonian-0']);
  assert.equal(rep('babylonian', '0').status, 'unsupported');
});
test('khipu selects knot types by decimal order', () => {
  assert.deepEqual(ids('khipu', '135'), ['khipu-knots-1', 'khipu-knots-3', 'khipu-units-5']);
  assert.deepEqual(ids('khipu', '101'), ['khipu-knots-1', 'khipu-knots-0', 'khipu-units-1']);
});
test('explorers show verified specimens without fabricating arbitrary translations', () => {
  assert.equal(rep('mangarevan', '40').tokens[0].text, 'tataua');
  assert.equal(rep('mangarevan', '42').tokens.length, 0);
  assert.equal(rep('oksapmin', '14').tokens[0].glyph, 'oksapmin-14');
  assert.equal(rep('cherokee', '42').status, 'explainer');
});
test('exactfractional and negative results stay honest across renderer capabilities', () => {
  assert.equal(rep('roman', '-1').status, 'unsupported');
  assert.match(rep('kaktovik', '1/3').reason!, /currently supports whole/);
  assert.equal(rep('brahmi', '100').status, 'unsupported');
  assert.equal(rep('cistercian', '10000').status, 'unsupported');
});
