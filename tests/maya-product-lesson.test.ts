import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSystem } from '../src/data/systems';
import { mayaProductLesson } from '../src/lib/maya-product-lesson';
import type { RenderToken, SystemDefinition } from '../src/lib/types';

const selected = getSystem('maya');
assert.ok(selected);
const maya: SystemDefinition = selected;

function readTokens(tokens: RenderToken[] | undefined): bigint | undefined {
  if (!tokens?.length) return undefined;
  return tokens.reduce((total, token) => {
    assert.match(token.glyph ?? '', /^maya-\d+$/);
    const digit = BigInt(token.glyph!.slice(5));
    assert.ok(digit >= 0n && digit < 20n);
    return total + digit * BigInt(token.place ?? '1');
  }, 0n);
}

test('Maya bar times bar visibly exchanges twenty and preserves the remaining bar', () => {
  const lesson = mayaProductLesson(maya, 5n, 5n);
  assert.equal(lesson.equation, '5 × 5 = 25');
  assert.match(lesson.evidence, /Teaching reconstruction/);
  assert.match(lesson.evidence, /does not establish.*ancient/);
  const row = lesson.table!.rows[0];
  assert.equal(readTokens(row.cells[0].tokens), 5n);
  assert.equal(readTokens(row.cells[1].tokens), 5n);
  assert.match(row.cells[2].text, /\(1 × 1\) × 25 \+ 0 × 5 \+ \(0 × 0\) × 1 = 25/);
  assert.match(lesson.parts![1].text, /25 at weight 1 becomes 1 in the next row and 5 here/);
  assert.equal(readTokens(row.cells[2].tokens), 25n);
  assert.equal(readTokens(lesson.parts!.at(-1)!.tokens), 25n);
  assert.deepEqual(
    lesson.parts!.at(-1)!.tokens!.map((token) => token.glyph),
    ['maya-1', 'maya-5'],
  );
});

test('Maya mixed dot and bar products combine the correct component types', () => {
  const lesson = mayaProductLesson(maya, 7n, 13n);
  const cell = lesson.table!.rows[0].cells[2];
  assert.match(cell.text, /7 has 1 bar and 2 dots; 13 has 2 bars and 3 dots/);
  assert.match(cell.text, /\(1 × 2\) × 25 \+ 7 × 5 \+ \(2 × 3\) × 1 = 91/);
  assert.equal(readTokens(cell.tokens), 91n);
  assert.equal(readTokens(lesson.parts!.at(-1)!.tokens), 91n);
});

test('the published 925 by 407 grid includes all weighted cells and yields 376475', () => {
  const lesson = mayaProductLesson(maya, 925n, 407n);
  assert.equal(lesson.equation, '925 × 407 = 376475');
  const weighted = lesson.table!.rows.reduce(
    (sum, row) => sum + readTokens(row.cells[3].tokens)!,
    0n,
  );
  assert.equal(weighted, 376475n);
  assert.equal(readTokens(lesson.parts!.at(-1)!.tokens), 376475n);
  assert.deepEqual(
    lesson.parts!.at(-1)!.tokens!.map((token) => token.glyph),
    ['maya-2', 'maya-7', 'maya-1', 'maya-3', 'maya-15'],
  );
  assert.ok(
    lesson.sources.some(
      (source) => source.url === 'https://imag.umontpellier.fr/~ramirez/Article-maya.pdf',
    ),
  );
  assert.match(lesson.notes!.join(' '), /Long Count.*360-day/);
});

test('base-twenty products preserve empty rows and reconstruct exact varied operands', () => {
  const values = [0n, 1n, 5n, 19n, 20n, 99n, 407n, 925n, 999_999_999n];
  for (const a of values) {
    for (const b of values) {
      const lesson = mayaProductLesson(maya, a, b);
      assert.equal(readTokens(lesson.parts!.at(-1)!.tokens), a * b, `${a} × ${b}`);
      assert.ok(lesson.parts!.length <= 13, `${a} × ${b}: too many parts`);
      assert.ok((lesson.table?.rows.length ?? 0) <= 10);
      for (const row of lesson.table?.rows ?? []) {
        assert.equal(
          readTokens(row.cells[2].tokens),
          readTokens(row.cells[0].tokens)! * readTokens(row.cells[1].tokens)!,
        );
      }
    }
  }
  const empty = mayaProductLesson(maya, 20n, 20n);
  assert.deepEqual(
    empty.parts!.at(-1)!.tokens!.map((token) => token.glyph),
    ['maya-1', 'maya-0', 'maya-0'],
  );
});

test('large products show a bounded table while including omitted cells in the answer', () => {
  const lesson = mayaProductLesson(maya, 999_999_999n, 999_999_999n);
  assert.equal(lesson.table!.rows.length, 10);
  assert.match(lesson.table!.caption, /first 10.*every cell is included/);
  assert.equal(readTokens(lesson.parts!.at(-1)!.tokens), 999_999_998_000_000_001n);
  assert.match(
    lesson.parts!.map((part) => part.text).join(' '),
    /intermediate diagonals.*abbreviated/,
  );
});

test('zero uses a shell and invalid or huge inputs never manufacture glyphs', () => {
  const zero = mayaProductLesson(maya, 0n, 925n);
  assert.equal(zero.table, undefined);
  assert.equal(readTokens(zero.parts!.at(-1)!.tokens), 0n);
  const enormous = 10n ** 2000n;
  for (const a of [-5n, enormous]) {
    const lesson = mayaProductLesson(maya, a, 7n);
    assert.equal(lesson.table, undefined);
    assert.ok(lesson.parts!.every((part) => !part.tokens));
    assert.ok(JSON.stringify(lesson).length < 3000);
  }
  assert.match(mayaProductLesson(maya, enormous, 7n).equation, /2001 digits/);
  const restricted: SystemDefinition = { ...maya, max: '24' };
  const restrictedLesson = mayaProductLesson(restricted, 5n, 5n);
  assert.equal(restrictedLesson.parts!.at(-1)!.tokens, undefined);
  assert.match(restrictedLesson.parts!.at(-1)!.text, /exceeds.*renderer.*range/);
  const other = getSystem('kaktovik');
  assert.ok(other);
  assert.equal(mayaProductLesson(other, 5n, 5n).table, undefined);
});
