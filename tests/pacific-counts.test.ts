import test from 'node:test';
import assert from 'node:assert/strict';
import { oceaniaSystems } from '../src/data/oceania';
import { pacificSystemUpdates } from '../src/data/pacific-expansions';
import { oksapminGlyphs } from '../src/glyphs/oksapmin';
import {
  oksapminPositions,
  pacificSymbolDictionary,
  pacificWordDictionary,
  representPacificCount,
} from '../src/lib/pacific-counts';

const system = (id: string) => ({
  ...oceaniaSystems.find((item) => item.id === id)!,
  ...pacificSystemUpdates[id],
});

test('Mangarevan converter reproduces the two published worked operands and result', () => {
  const mangarevan = system('mangarevan');
  // Bender & Beller (2013), p. 4: 273 + 219 = 492, with 3VPK3 + 2VTK9 = 6VK2.
  assert.equal(representPacificCount(273n, mangarevan).tokens[0].text, 'toru varu paua takau toru');
  assert.equal(representPacificCount(219n, mangarevan).tokens[0].text, 'rua varu tataua takau iva');
  assert.equal(representPacificCount(492n, mangarevan).tokens[0].text, 'ono varu takau rua');
  assert.match(
    representPacificCount(273n, mangarevan).explanation,
    /3 × 80 \+ 20 \+ 10 \+ 3 = 273 counting units/,
  );
});

test('Mangarevan binary boundaries use powers once and keep units distinct from objects', () => {
  const mangarevan = system('mangarevan');
  const expected = new Map([
    [8n, 'varu'],
    [10n, 'takau'],
    [20n, 'paua'],
    [30n, 'paua takau'],
    [40n, 'tataua'],
    [56n, 'tataua takau ono'],
    [70n, 'tataua paua takau'],
    [79n, 'tataua paua takau iva'],
    [80n, 'varu'],
    [90n, 'varu takau'],
    [160n, 'rua varu'],
    [720n, 'iva varu'],
    [799n, 'iva varu tataua paua takau iva'],
  ]);
  for (const [value, word] of expected)
    assert.equal(representPacificCount(value, mangarevan).tokens[0].text, word);
  for (let n = 1n; n <= 799n; n++) {
    const result = representPacificCount(n, mangarevan);
    assert.equal(result.status, 'ok');
    assert.equal(result.tokens[0].lang, 'mrv');
    assert.match(result.explanation, /counting units/);
    assert.ok(!result.tokens[0].text?.includes('undefined'));
  }
  for (const n of [-1n, 0n, 800n, 10n ** 100n])
    assert.equal(representPacificCount(n, mangarevan).status, 'unsupported');
  const words = pacificWordDictionary(mangarevan);
  assert.equal(words.filter((entry) => entry.word === 'varu').length, 2);
});

test('Oksapmin enumerates the source sequence including non-mirrored second-hand fingers', () => {
  const oksapmin = system('oksapmin');
  const expected = new Map([
    [1, 'thumb · first side'],
    [5, 'little finger · first side'],
    [6, 'wrist · first side'],
    [8, 'inner elbow · first side'],
    [12, 'ear · first side'],
    [14, 'nose · center'],
    [18, 'shoulder · other side'],
    [20, 'inner elbow · other side'],
    [22, 'wrist · other side'],
    [23, 'thumb · other side'],
    [24, 'index finger · other side'],
    [27, 'little finger · other side'],
  ]);
  for (const [value, part] of expected) assert.equal(oksapminPositions[value - 1].part, part);
  assert.equal(new Set(oksapminPositions.map(({ x, y }) => `${x},${y}`)).size, 27);
  assert.equal(pacificSymbolDictionary(oksapmin).length, 27);
  for (let n = 1n; n <= 27n; n++) {
    const result = representPacificCount(n, oksapmin);
    assert.equal(result.status, 'ok');
    assert.equal(result.tokens[0].glyph, `oksapmin-${n}`);
    assert.ok(oksapminGlyphs[`oksapmin-${n}`].paths.length);
    assert.match(oksapminGlyphs[`oksapmin-${n}`].label, /Modern/);
  }
  for (const n of [-1n, 0n, 28n, 10n ** 100n])
    assert.equal(representPacificCount(n, oksapmin).status, 'unsupported');
});
