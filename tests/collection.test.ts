import test from 'node:test';
import assert from 'node:assert/strict';
import { systems, converters } from '../src/data/systems';
import { represent } from '../src/lib/format';
import { parseNumber } from '../src/lib/numbers';
import { loadGlyphs, findGlyph } from '../src/lib/glyphs';
import { copyText, exportSVG } from '../src/lib/render';
test('collection is sourced, unique, broad, and above promised converter minimum', () => {
  assert.equal(systems.length, 36);
  assert.ok(converters.length >= 24);
  assert.equal(new Set(systems.map((s) => s.id)).size, 36);
  assert.equal(new Set(systems.map((s) => s.region)).size, 5);
  for (const s of systems) {
    assert.ok(s.sources.length > 0, s.id);
    assert.ok(s.examples.length >= 3, s.id);
    for (const source of s.sources) assert.match(source.url, /^https:\/\//);
  }
});
for (const s of systems) {
  test(`${s.name}: sourceexamples and boundary values have complete artwork`, async () => {
    const set = await loadGlyphs(s.region);
    const fixtures = [...s.examples];
    if (s.engine !== 'explainer')
      fixtures.push(
        { value: s.min, explanation: 'lower bound' },
        { value: s.max, explanation: 'upper bound' },
      );
    for (const example of fixtures) {
      const r = represent(parseNumber(example.value), s);
      assert.ok(r.tokens.length > 0, `${s.id}:${example.value}: ${r.reason}`);
      for (const t of r.tokens) {
        if (t.glyph) {
          const g = findGlyph(t.glyph, set);
          assert.ok(g, `${s.id}:${t.glyph}`);
          assert.ok(g.source);
          assert.ok(g.paths.every((p) => !p.d.includes('NaN')));
        }
      }
      if (example.glyphs)
        assert.deepEqual(
          r.tokens.map((t) => t.glyph),
          example.glyphs,
          `${s.id}:${example.value}`,
        );
    }
  });
}
test('Unicodecopy uses logical order forRTL and does not invent text for pictograms', async () => {
  const s = systems.find((s) => s.id === 'nko')!,
    set = await loadGlyphs(s.region);
  assert.equal(copyText(represent(parseNumber('42'), s), set, s), '߄߂');
  const k = systems.find((s) => s.id === 'khipu')!;
  assert.equal(copyText(represent(parseNumber('42'), k), await loadGlyphs(k.region), k), undefined);
});
test('SVGexports are selfcontained drawings and reject word-only specimens', async () => {
  for (const id of ['kaktovik', 'khipu', 'mende-kikakui', 'cistercian']) {
    const s = systems.find((s) => s.id === id)!;
    const svg = exportSVG(
      represent(parseNumber(String(s.specimen)), s),
      await loadGlyphs(s.region),
      s.name,
    )!;
    assert.ok(svg.includes('<path'));
    assert.ok(!svg.includes('<text'));
    assert.ok(!svg.includes('<use'));
    assert.ok(!svg.includes('href='));
  }
  const m = systems.find((s) => s.id === 'mangarevan')!;
  assert.equal(
    exportSVG(represent(parseNumber('40'), m), await loadGlyphs(m.region), m.name),
    undefined,
  );
});

test('adapted artwork exports retain source attribution and full OFL license', async () => {
  const s = systems.find((s) => s.id === 'sinhala')!;
  const glyphs = await loadGlyphs(s.region);
  const result = represent(parseNumber('1987'), s);
  assert.equal(copyText(result, glyphs, s), '𑇴𑇩𑇳𑇱𑇧');
  const svg = exportSVG(result, glyphs, s.name)!;
  assert.ok(svg.includes('SIL OPEN FONT LICENSE'));
  assert.ok(svg.includes('Copyright 2016-2022 Google Inc.'));
  assert.ok(svg.includes('<metadata>'));
  assert.ok(svg.includes('U+111F3'));
  assert.ok(svg.includes('U+111F4'));
});
