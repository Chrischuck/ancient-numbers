import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSystem } from '../src/data/systems';
import { mangarevanOperationLesson } from '../src/lib/mangarevan-operation-lesson';
import { represent } from '../src/lib/format';
import { rational } from '../src/lib/numbers';
import type { ArithmeticOperation } from '../src/lib/arithmetic-evidence';
import type { OperationLesson } from '../src/lib/operation-lessons';
import type { SystemDefinition } from '../src/lib/types';

const selected = getSystem('mangarevan');
assert.ok(selected);
const system: SystemDefinition = selected;
const working = (lesson: OperationLesson) => lesson.parts!.map((part) => part.text).join(' ');

test('273 plus 219 carries through the actual decimal and binary group levels', () => {
  const lesson = mangarevanOperationLesson(system, 273n, 219n, 'add');
  assert.equal(lesson.equation, '273 + 219 = 492');
  const steps = working(lesson);
  assert.match(steps, /3 \+ 9 = 12.*group of 10 ordinary units for 1 takau/);
  assert.match(
    steps,
    /1 \+ 1 \+ 1 carried from below = 3.*group of 2 takau for 1 paua; leave 1 takau/,
  );
  assert.match(steps, /1 \+ 0 \+ 1 carried from below = 2.*group of 2 paua for 1 tataua/);
  assert.match(steps, /0 \+ 1 \+ 1 carried from below = 2.*group of 2 tataua for 1 varu/);
  assert.match(steps, /3 \+ 2 \+ 1 carried from tataua = 6 varu/);
  assert.equal(lesson.parts!.at(-1)!.tokens![0].text, 'ono varu takau rua');
});

test('80 minus 1 opens every empty intermediate group before removal', () => {
  const lesson = mangarevanOperationLesson(system, 80n, 1n, 'subtract');
  assert.equal(lesson.equation, '80 − 1 = 79');
  const steps = working(lesson);
  assert.match(
    steps,
    /Open one varu into 2 tataua.*Open one tataua into 2 paua.*Open one paua into 2 takau.*Open one takau into 10 ordinary units/,
  );
  assert.match(steps, /remove 1 from 10, leaving 9/);
  assert.equal(lesson.parts!.at(-1)!.tokens![0].text, 'tataua paua takau iva');
});

test('13 by 24 doubles named groups and selects exactly 1, 4 and 8 copies', () => {
  const lesson = mangarevanOperationLesson(system, 13n, 24n, 'multiply');
  assert.equal(lesson.equation, '13 × 24 = 312');
  assert.deepEqual(
    lesson.table!.rows.filter((row) => row.selected).map((row) => row.cells[1].text),
    ['1', '4', '8'],
  );
  assert.match(
    lesson.table!.rows[1].cells[2].text,
    /Double 4 ordinary units to 8.*Shift paua to tataua/,
  );
  assert.match(working(lesson), /1 \+ 4 \+ 8 = 13/);
  assert.match(working(lesson), /teaching aid.*not a historical written binary notation/);
  assert.equal(lesson.parts!.at(-1)!.tokens![0].text, 'toru varu tataua paua takau rua');
  assert.match(lesson.notes!.join(' '), /tauga.*two fish.*four coconuts.*eight octopuses/);
});

test('56 divided by 2 shows reverse group exchanges and yields 28', () => {
  const lesson = mangarevanOperationLesson(system, 56n, 2n, 'divide');
  assert.equal(lesson.equation, '56 ÷ 2 = 28');
  const steps = working(lesson);
  assert.match(steps, /Open one tataua into 2 paua.*Give each half 1 of the 2 paua/);
  assert.match(
    steps,
    /Open one takau into 10 ordinary units.*Split 16 ordinary units into 8 per half/,
  );
  assert.equal(lesson.parts!.at(-1)!.tokens![0].text, 'paua varu');
});

test('halving stages retain remainders in original units and use exact fractions', () => {
  const half = mangarevanOperationLesson(system, 5n, 2n, 'divide');
  assert.equal(half.equation, '5 ÷ 2 = 5/2');
  assert.match(working(half), /Split 5 ordinary units into 2 per half, with one unit left over/);
  assert.match(working(half), /2 \+ 1\/2 = 5\/2/);
  assert.match(working(half), /no fractional Mangarevan word is invented/);
  const quarters = mangarevanOperationLesson(system, 11n, 4n, 'divide');
  assert.match(working(quarters), /leftover counts as 2 of the original counting units/);
  assert.match(working(quarters), /remainder is 3.*4 × 2 \+ 3 = 11/);
  const eighths = mangarevanOperationLesson(system, 15n, 8n, 'divide');
  assert.match(working(eighths), /remainder is 7.*8 × 1 \+ 7 = 15/);
});

test('other divisors supply concrete groups while labeling the extension', () => {
  const lesson = mangarevanOperationLesson(system, 56n, 3n, 'divide');
  assert.equal(lesson.equation, '56 ÷ 3 = 56/3');
  assert.match(
    working(lesson),
    /general teaching reconstruction, not observed historical Mangarevan division/,
  );
  assert.match(working(lesson), /Form 10 complete groups of 3, using 30: 56 − 30 = 26/);
  assert.match(working(lesson), /Form 8 complete groups of 3, using 24: 26 − 24 = 2/);
  assert.match(working(lesson), /18 complete groups.*leaving 2/);
});

test('all operators use only converter-attested words and bounded working for varied inputs', () => {
  const attested = new Set<string>();
  for (let n = 1n; n <= 799n; n++) attested.add(represent(rational(n), system).tokens[0].text!);
  const values = [0n, 1n, 2n, 5n, 13n, 24n, 56n, 80n, 219n, 273n, 799n];
  for (const a of values)
    for (const b of values)
      for (const operation of ['add', 'subtract', 'multiply', 'divide'] as ArithmeticOperation[]) {
        const lesson = mangarevanOperationLesson(system, a, b, operation);
        assert.match(lesson.evidence, /Analytical reconstruction/);
        assert.ok((lesson.parts?.length ?? 0) <= 14, `${a} ${operation} ${b}`);
        assert.ok((lesson.table?.rows.length ?? 0) <= 10);
        const tokenSets = [
          ...(lesson.parts ?? []).map((part) => part.tokens),
          ...(lesson.table?.rows ?? []).flatMap((row) => row.cells.map((cell) => cell.tokens)),
        ];
        for (const tokens of tokenSets)
          for (const token of tokens ?? []) {
            assert.ok(attested.has(token.text!), `Invented word: ${token.text}`);
            assert.equal(token.glyph, undefined);
          }
        assert.doesNotMatch(
          JSON.stringify(lesson),
          operation === 'divide' && b === 0n ? /NaN|Infinity/ : /undefined|NaN|Infinity/,
        );
      }
});

test('halving yields the exact integer quotient and original-unit remainder across the vocabulary', () => {
  for (let n = 0n; n <= 799n; n++)
    for (const divisor of [2n, 4n, 8n]) {
      const lesson = mangarevanOperationLesson(system, n, divisor, 'divide');
      assert.match(
        working(lesson),
        new RegExp(
          `shares contains ${n / divisor} whole counting units; the original-unit remainder is ${n % divisor}\\.`,
        ),
        `${n} ÷ ${divisor}`,
      );
    }
});

test('zero, dictionary overflow, negative results and huge operands avoid invented words', () => {
  assert.match(working(mangarevanOperationLesson(system, 5n, 0n, 'divide')), /divisor of zero/);
  const zero = mangarevanOperationLesson(system, 0n, 5n, 'multiply');
  assert.equal(zero.parts!.at(-1)!.tokens, undefined);
  assert.match(working(zero), /No zero word/);
  const outside = mangarevanOperationLesson(system, 799n, 799n, 'multiply');
  assert.equal(outside.equation, '799 × 799 = 638401');
  assert.equal(outside.parts!.at(-1)!.tokens, undefined);
  assert.match(outside.parts!.at(-1)!.text, /beyond the illustrated vocabulary range/);
  const negative = mangarevanOperationLesson(system, 1n, 80n, 'subtract');
  assert.equal(negative.equation, '1 − 80 = -79');
  assert.ok(negative.parts!.every((part) => !part.tokens));
  const huge = mangarevanOperationLesson(system, 10n ** 2000n, 8n, 'divide');
  assert.ok(JSON.stringify(huge).length < 2500);
  assert.match(huge.equation, /2001 digits/);
  assert.equal(huge.table, undefined);
});
