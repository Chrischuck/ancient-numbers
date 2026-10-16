import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSystem } from '../src/data/systems';
import { oksapminOperationLesson } from '../src/lib/oksapmin-operation-lesson';
import type { SystemDefinition } from '../src/lib/types';

const selected = getSystem('oksapmin');
assert.ok(selected);
const system: SystemDefinition = selected;

test('multiplication counts actual four-position blocks and keeps the block tally separate', () => {
  const lesson = oksapminOperationLesson(system, 4n, 3n, 'multiply');
  assert.equal(lesson.equation, '4 × 3 = 12');
  assert.match(
    lesson.parts![1].text,
    /positions 1–4.*ring finger.*running quantity to 4.*1 complete blocks/,
  );
  assert.match(
    lesson.parts![2].text,
    /positions 5–8.*inner elbow.*running quantity to 8.*2 complete blocks/,
  );
  assert.match(
    lesson.parts![3].text,
    /positions 9–12.*ear.*running quantity to 12.*3 complete blocks/,
  );
  assert.deepEqual(
    lesson.parts!.filter((part) => part.tokens).map((part) => part.tokens![0].glyph),
    ['oksapmin-4', 'oksapmin-8', 'oksapmin-12', 'oksapmin-12'],
  );
  assert.match(lesson.evidence, /Teaching reconstruction.*not an observed traditional algorithm/);
});

test('27 divided by 3 illustrates all nine body-path groups', () => {
  const lesson = oksapminOperationLesson(system, 27n, 3n, 'divide');
  assert.equal(lesson.equation, '27 ÷ 3 = 9');
  const blocks = lesson.parts!.filter((part) => part.text.startsWith('Complete group'));
  assert.equal(blocks.length, 9);
  assert.deepEqual(
    blocks.map((part) => part.tokens![0].glyph),
    [3, 6, 9, 12, 15, 18, 21, 24, 27].map((n) => `oksapmin-${n}`),
  );
  assert.match(blocks[8].text, /positions 25–27.*9 groups; 0.*remain unallocated/);
  assert.match(lesson.parts!.at(-2)!.text, /group count is 9.*upper arm.*3 × 9 \+ 0 = 27/);
});

test('fractional division recounts only the remaining positions', () => {
  const lesson = oksapminOperationLesson(system, 5n, 2n, 'divide');
  assert.equal(lesson.equation, '5 ÷ 2 = 5/2');
  assert.match(
    lesson.parts!.at(-1)!.text,
    /Positions 5–5 remain.*remainder reaches thumb.*2 \+ 1\/2 = 5\/2/,
  );
  assert.equal(lesson.parts!.at(-1)!.tokens![0].glyph, 'oksapmin-1');
  const noWholeGroup = oksapminOperationLesson(system, 2n, 3n, 'divide');
  assert.equal(
    noWholeGroup.parts!.filter((part) => part.text.startsWith('Complete group')).length,
    0,
  );
  assert.match(
    noWholeGroup.parts!.at(-1)!.text,
    /Positions 1–2 remain.*remainder reaches index finger.*0 \+ 2\/3 = 2\/3/,
  );
});

test('a product beyond the first traversal draws only complete supported endpoints', () => {
  const lesson = oksapminOperationLesson(system, 10n, 3n, 'multiply');
  assert.equal(lesson.equation, '10 × 3 = 30');
  assert.deepEqual(
    lesson.parts!.filter((part) => part.tokens).map((part) => part.tokens![0].glyph),
    ['oksapmin-10', 'oksapmin-20'],
  );
  assert.match(lesson.parts!.at(-2)!.text, /next block would pass.*boundary at 27/);
  assert.equal(lesson.parts!.at(-1)!.tokens, undefined);
});

test('bounded division retains the final group count and remainder after abbreviated working', () => {
  const lesson = oksapminOperationLesson(system, 27n, 2n, 'divide');
  assert.equal(lesson.parts!.length, 14);
  assert.match(lesson.parts![11].text, /remaining 3 blocks.*ring finger.*26/);
  assert.match(lesson.parts![12].text, /group count is 13.*2 × 13 \+ 1 = 27/);
  assert.match(lesson.parts![13].text, /Positions 27–27 remain.*13 \+ 1\/2 = 27\/2/);
});

test('all supported input pairs have exact equations and only real first-traversal body tokens', () => {
  for (let a = 1n; a <= 27n; a++)
    for (let b = 1n; b <= 27n; b++) {
      for (const operation of ['multiply', 'divide'] as const) {
        const lesson = oksapminOperationLesson(system, a, b, operation);
        assert.ok(lesson.parts!.length <= 14);
        for (const part of lesson.parts!)
          for (const token of part.tokens ?? []) {
            const n = Number(token.glyph!.slice('oksapmin-'.length));
            assert.ok(n >= 1 && n <= 27, `Invented position ${n}`);
          }
        assert.doesNotMatch(JSON.stringify(lesson), /undefined|NaN|Infinity/);
      }
    }
});

test('zero and unsupported operands never invent zero or extended body positions', () => {
  const zero = oksapminOperationLesson(system, 0n, 7n, 'multiply');
  assert.ok(zero.parts!.every((part) => !part.tokens));
  assert.match(zero.parts![0].text, /no body position for zero/);
  for (const a of [-1n, 28n, 10n ** 2000n]) {
    const lesson = oksapminOperationLesson(system, a, 3n, 'multiply');
    assert.ok(lesson.parts!.every((part) => !part.tokens));
    assert.ok(JSON.stringify(lesson).length < 2500);
    assert.match(lesson.parts![0].text, /first-traversal exhibit boundary/);
  }
  assert.match(
    oksapminOperationLesson(system, 7n, 0n, 'divide').parts![0].text,
    /group size of zero/,
  );
});
