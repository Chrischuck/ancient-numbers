import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSystem } from '../src/data/systems';
import { babylonianProductTrace, babylonianNativeLesson } from '../src/lib/babylonian-arithmetic';
import { babylonianTables, babylonianReciprocals } from '../src/data/babylonian-tables';
import { nativePositionalLesson, nativeRationalLesson } from '../src/lib/native-arithmetic';
import { baseDigits, rational } from '../src/lib/numbers';
import type { ArithmeticOperation } from '../src/lib/arithmetic-evidence';
const value = (digits: readonly number[]) => digits.reduce((n, d) => n * 60n + BigInt(d), 0n);
const system = (id: string) => {
  const s = getSystem(id);
  assert.ok(s);
  return s;
};

test('regenerated Babylonian table facts have the documented row repertoire and valid sexagesimal digits', () => {
  const rows = [...Array.from({ length: 20 }, (_, i) => i + 1), 30, 40, 50];
  for (const [p, table] of Object.entries(babylonianTables)) {
    assert.deepEqual(Object.keys(table).map(Number), rows);
    for (const [r, digits] of Object.entries(table)) {
      assert.equal(value(digits), BigInt(p) * BigInt(r));
      assert.ok(digits.every((d) => d >= 0 && d < 60));
    }
  }
});
test('every pair of sexagesimal digits multiplies through table facts and native carries', () => {
  for (let a = 0; a < 60; a++)
    for (let b = 0; b < 60; b++) {
      const trace = babylonianProductTrace([a], [b]);
      assert.equal(value(trace.digits), BigInt(a * b), `${a} times ${b}`);
      assert.ok(trace.digits.every((d) => d >= 0 && d < 60));
    }
});
test('multi-place Babylonian products preserve shifts, empty places and all carry contributions', () => {
  for (const a of [60n, 72n, 91n, 3600n, 999999999n])
    for (const b of [8n, 59n, 64n, 12345n, 999999999n]) {
      const trace = babylonianProductTrace(baseDigits(a, 60), baseDigits(b, 60));
      assert.equal(value(trace.digits), a * b);
      const lesson = babylonianNativeLesson(system('babylonian'), a, b, 'multiply');
      assert.ok(lesson.parts!.length <= 14);
    }
});
test('42 times 8 stays sexagesimal in the working and confines decimal equivalents to hints', () => {
  const lesson = babylonianNativeLesson(system('babylonian'), 42n, 8n, 'multiply');
  const working = lesson.parts!.map((p) => p.text).join('\n');
  assert.match(working, /Look up \[40\] × \[8\] = \[5, 20\]/);
  assert.match(working, /Look up \[2\] × \[8\] = \[16\]/);
  assert.match(working, /\[20\] \+ \[16\] = \[36\]/);
  assert.equal(lesson.equation, '[42] × [8] = [5, 36]');
  assert.doesNotMatch(working, /320|336|decimal|convert/i);
  assert.ok(lesson.parts!.some((p) => p.hint === '320'));
  assert.equal(lesson.parts!.at(-1)!.hint, '336');
});
test('standard reciprocal pairs are exact at the supplied whole-divisor scale', () => {
  for (const [divisor, digits] of Object.entries(babylonianReciprocals))
    assert.equal(value(digits) * BigInt(divisor), 60n ** BigInt(digits.length));
  const lesson = babylonianNativeLesson(system('babylonian'), 54n, 6n, 'divide');
  assert.equal(lesson.equation, '[54] ÷ [6] = [9]');
  assert.match(lesson.parts!.map((p) => p.text).join('\n'), /\[6\] ↔ \[0; 10\]/);
  assert.match(lesson.parts!.map((p) => p.text).join('\n'), /Exchange sixty units/);
  assert.equal(
    babylonianNativeLesson(system('babylonian'), 7n, 1n, 'divide').equation,
    '[7] ÷ [1] = [7]',
  );
});
test('irregular reciprocal previews remain explicitly approximate and do not replace the exact hint', () => {
  const lesson = babylonianNativeLesson(system('babylonian'), 1n, 7n, 'divide');
  assert.match(lesson.equation, /≈.*8, 34, 17, 8, 34, 17, …/);
  assert.equal(lesson.parts!.at(-1)!.hint, '1/7');
  assert.equal(lesson.evidenceKind, 'reconstruction');
  const longFinite = babylonianNativeLesson(system('babylonian'), 1n, 536870912n, 'divide');
  assert.match(longFinite.parts!.at(-1)!.text, /terminates, but needs more places/);
  assert.doesNotMatch(longFinite.parts!.at(-1)!.text, /does not terminate/);
});
test('positional native lessons keep the selected radix for digits, carries, products and quotients', () => {
  for (const id of ['binary', 'hexadecimal', 'medefaidrin', 'kaktovik', 'maya']) {
    const s = system(id);
    for (const a of [0n, 1n, 19n, 31n, 255n, 1023n])
      for (const b of [1n, 2n, 8n, 19n, 31n])
        for (const op of ['add', 'subtract', 'multiply', 'divide'] as ArithmeticOperation[]) {
          if (op === 'subtract' && a < b) continue;
          const expected =
            op === 'add' ? a + b : op === 'subtract' ? a - b : op === 'multiply' ? a * b : a / b;
          const lesson = nativePositionalLesson(s, a, b, op);
          assert.equal(lesson.parts!.at(-1)!.hint, String(expected), `${id}/${a}/${op}/${b}`);
          assert.ok(lesson.parts!.length <= 14);
          assert.doesNotMatch(
            lesson.parts!.map((p) => p.text).join('\n'),
            /convert|decimal result/i,
          );
        }
  }
  const hex = nativePositionalLesson(system('hexadecimal'), 42n, 8n, 'multiply');
  assert.equal(hex.equation, '2A × 8 = 150');
  assert.match(hex.parts!.map((p) => p.text).join('\n'), /A × 8 = 50/);
  const binary = nativePositionalLesson(system('binary'), 7n, 1n, 'add');
  assert.equal(binary.equation, '111 + 1 = 1000');
});
test('signed and fractional continuations retain the selected radix and small exact decimal hints', () => {
  const result = nativeRationalLesson(
    system('binary'),
    rational(3n, 2n),
    rational(3n, 7n),
    'multiply',
  );
  assert.equal(result.equation, '11/10 × 11/111 = 1001/1110');
  assert.match(result.parts!.at(-1)!.hint!, /9\/14/);
  const large = nativeRationalLesson(
    system('maya'),
    rational(10n ** 2000n),
    rational(3n),
    'multiply',
  );
  assert.ok(JSON.stringify(large).length < 4000);
});
