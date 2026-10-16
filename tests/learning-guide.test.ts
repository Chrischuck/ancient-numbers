import { test } from 'node:test';
import assert from 'node:assert/strict';
import { systems, getSystem } from '../src/data/systems';
import { loadGlyphs, findGlyph } from '../src/lib/glyphs';
import { renderLearningGuide, symbolEntries } from '../src/lib/learning-guide';

test('every system has a renderable guide and every chart sign has artwork', async () => {
  for (const system of systems) {
    const glyphs = await loadGlyphs(system.region);
    for (const entry of symbolEntries(system)) {
      assert.ok(findGlyph(entry.glyph, glyphs), `${system.id}: ${entry.glyph}`);
      assert.ok(entry.meaning);
    }
    const guide = renderLearningGuide(system, glyphs);
    assert.match(guide, /How the (symbols|words|gestures) fit together/, system.id);
    assert.ok(guide.includes('class="rule-card"'), system.id);
    assert.ok(!guide.includes('undefined'), system.id);
  }
});

test('digit alphabets are complete and positional variants stay labeled', () => {
  for (const system of systems.filter((s) => s.digits)) {
    const entries = symbolEntries(system);
    for (const [digit, glyph] of system.digits!.entries())
      assert.ok(entries.some((entry) => entry.glyph === glyph && entry.meaning === String(digit)));
  }
  assert.equal(symbolEntries(getSystem('cistercian')!).length, 36);
  assert.equal(symbolEntries(getSystem('rods')!).length, 19);
  assert.equal(symbolEntries(getSystem('khipu')!).length, 20);
});

test('Roman rules show order, valid subtractive pairs, and repetition limits', async () => {
  const roman = getSystem('roman')!;
  const guide = renderLearningGuide(roman, await loadGlyphs(roman.region));
  assert.match(guide, /5 \+ 1 = 6/);
  assert.match(guide, /5 − 1 = 4/);
  assert.match(guide, /IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900/);
  assert.match(guide, /at most three times/);
  assert.equal(symbolEntries(roman).length, 7);
});

test('example-only charts do not assign a whole numeral value to its individual signs', () => {
  const entries = symbolEntries(getSystem('cherokee')!);
  assert.ok(entries.some((entry) => entry.glyph === 'cherokee-40' && entry.meaning === '40'));
  assert.ok(!entries.some((entry) => entry.meaning === '42'));
});
