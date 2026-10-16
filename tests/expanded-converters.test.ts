import test from 'node:test';
import assert from 'node:assert/strict';
import { getSystem, systems } from '../src/data/systems';
import { represent } from '../src/lib/format';
import { rational } from '../src/lib/numbers';
import { loadGlyphs } from '../src/lib/glyphs';
import { copyText, exportSVG } from '../src/lib/render';
import { renderMathReasoning } from '../src/lib/math-methods';

test('all nine formerly specimen-only entries have full bounded adapters and honest limits', () => {
  for (const id of [
    'maori',
    'hawaiian',
    'choctaw',
    'navajo',
    'mangarevan',
    'oksapmin',
    'mende-kikakui',
    'cherokee',
    'ottoman-siyaq',
  ]) {
    const system = getSystem(id)!;
    assert.notEqual(system.engine, 'explainer', id);
    for (const value of [BigInt(system.min), BigInt(system.max), id === 'oksapmin' ? 23n : 56n]) {
      const result = represent(rational(value), system);
      assert.equal(result.status, 'ok', `${id}:${value}`);
      assert.ok(result.tokens.length);
    }
    assert.equal(represent(rational(BigInt(system.max) + 1n), system).status, 'unsupported', id);
    assert.equal(represent(rational(1n, 2n), system).status, 'unsupported', id);
    assert.equal(represent(rational(-1n), system).status, 'unsupported', id);
  }
  assert.ok(systems.every((system) => system.engine !== 'explainer'));
});

test('RTL copies use logical Unicode sequences while exported paths retain artwork licenses', async () => {
  for (const id of ['mende-kikakui', 'ottoman-siyaq']) {
    const system = getSystem(id)!;
    const result = represent(rational(56n), system);
    const glyphs = await loadGlyphs(system.region);
    assert.equal(copyText(result, glyphs, system), result.unicode);
    const svg = exportSVG(result, glyphs, `${system.name}: 56`)!;
    assert.ok(svg.includes('<path'));
    assert.ok(!svg.includes('<text'));
    if (id === 'ottoman-siyaq') {
      assert.ok(svg.includes('SIL OPEN FONT LICENSE'));
      assert.ok(svg.includes('Copyright 2022 Google LLC'));
    }
  }
});

test('word lessons explain productive composition and link its evidence', () => {
  for (const [id, element] of [
    ['hawaiian', 'Kūmā'],
    ['maori', 'mā'],
    ['choctaw', 'Akocha'],
    ['navajo', 'Dóó bi’aan'],
  ]) {
    const system = getSystem(id)!;
    const lesson = renderMathReasoning(system, rational(56n));
    assert.match(lesson, /formation-steps/, id);
    assert.ok(lesson.includes(element), id);
    if (id === 'choctaw')
      assert.match(lesson, /oct-2018-biskinik\.pdf/, 'compound evidence remains linked');
  }
});
