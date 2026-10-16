import test from 'node:test';
import assert from 'node:assert/strict';
import { gestureSystems } from '../src/data/gestures';
import {
  handGlyphs,
  bedeHandGlyph,
  hourArtworkSource,
  countArtworkSource,
} from '../src/glyphs/hands';
import { gestureDictionary, representGesture } from '../src/lib/gestures';
import { exportSVG } from '../src/lib/render';
import { woodcutCells } from '../src/glyphs/bede-woodcut';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const bede = gestureSystems.find((s) => s.id === 'medieval-finger-counting')!;
const trappist = gestureSystems.find((s) => s.id === 'cistercian-gestures')!;
const ids = (n: bigint) => representGesture(n, bede).tokens.map((t) => t.glyph);

test('Bede uses the original right-hand hundreds/thousands arrangement', () => {
  assert.deepEqual(ids(54n), ['hand-bede-left-50', 'hand-bede-left-4']);
  assert.deepEqual(ids(100n), ['hand-bede-right-1']);
  assert.deepEqual(ids(1000n), ['hand-bede-right-10']);
  assert.deepEqual(ids(1254n), [
    'hand-bede-left-50',
    'hand-bede-left-4',
    'hand-bede-right-2',
    'hand-bede-right-10',
  ]);
  assert.deepEqual(ids(9009n), ['hand-bede-left-9', 'hand-bede-right-90']);
  assert.deepEqual(ids(9999n), [
    'hand-bede-left-90',
    'hand-bede-left-9',
    'hand-bede-right-9',
    'hand-bede-right-90',
  ]);
  // The original chart prints separate right-hand 100 and 1000 drawings.
  assert.deepEqual(bedeHandGlyph('right', 1).paths, woodcutCells[100].paths);
  assert.deepEqual(bedeHandGlyph('right', 10).paths, woodcutCells[1000].paths);
});

test('woodcut source and every extracted path and fill remain exact', () => {
  const source = readFileSync(
    new URL('../public/reference/hands/finger-numerals-1520.svg', import.meta.url),
  );
  assert.equal(
    createHash('sha256').update(source).digest('hex'),
    '37d0e253dd9a08011b04ba4806e7b1589489e7b9d799f0b5f7a353e15082fad0',
  );
  const original = [...source.toString().matchAll(/<path\b[^>]*>/g)].map(([element]) => {
    const d = element.match(/\bd="([^"]+)"/)![1];
    const color = element.match(/\bfill="([^"]+)"/)![1];
    return JSON.stringify({ d, color });
  });
  const extracted = Object.values(woodcutCells).flatMap((cell) =>
    cell.paths.map(({ d, color }) => JSON.stringify({ d, color })),
  );
  assert.equal(original.length, 2418);
  assert.deepEqual(extracted.sort(), original.sort());
});

test('all Bede values use exact source panels with separate place contributions', () => {
  const checked = new Set<string>();
  for (let n = 1n; n <= 9999n; n++) {
    const result = representGesture(n, bede);
    assert.equal(result.status, 'ok');
    assert.ok(result.tokens.length >= 1 && result.tokens.length <= 4);
    const total = result.tokens.reduce((sum, token) => {
      const group = Number(token.glyph!.split('-').at(-1));
      return sum + group * (token.glyph!.includes('-right-') ? 100 : 1);
    }, 0);
    assert.equal(total, Number(n));
    for (const t of result.tokens) {
      const glyph = handGlyphs[t.glyph!];
      assert.ok(glyph, `Missing ${t.glyph}`);
      assert.equal(glyph.license, 'public-domain');
      if (!checked.has(t.glyph!)) {
        assert.ok(glyph.paths.every((p) => /^[MLQCZ\d.\s-]+$/.test(p.d)));
        checked.add(t.glyph!);
      }
    }
  }
  for (const n of [-1n, 0n, 10000n, 1000000n])
    assert.equal(representGesture(n, bede).status, 'unsupported');
  assert.throws(() => bedeHandGlyph('left', 100), RangeError);
});

test('La Trappe hour signals remain in their bounded documented context', () => {
  assert.deepEqual(
    representGesture(7n, trappist).tokens.map((t) => t.glyph),
    ['hand-trappist-left-5', 'hand-trappist-right-2'],
  );
  assert.deepEqual(
    representGesture(10n, trappist).tokens.map((t) => t.glyph),
    ['hand-trappist-left-5', 'hand-trappist-right-5'],
  );
  for (let n = 1n; n <= 10n; n++) {
    const result = representGesture(n, trappist);
    assert.equal(result.status, 'ok');
    assert.match(result.explanation, /1824/);
    assert.match(result.explanation, /illustrative/);
    assert.ok(result.tokens.every((t) => handGlyphs[t.glyph!]));
  }
  for (const n of [-1n, 0n, 11n, 54n])
    assert.equal(representGesture(n, trappist).status, 'unsupported');
});

test('Cistercian illustrations reuse original scan bytes and the published counting path', () => {
  for (let n = 1; n <= 5; n++) {
    const source = readFileSync(
      new URL(`../public/reference/hands/hour-count-${n}.jpg`, import.meta.url),
    );
    const glyph = handGlyphs[`hand-trappist-left-${n}`];
    assert.equal(glyph.license, 'public-domain');
    assert.equal(glyph.source, hourArtworkSource);
    assert.deepEqual(Buffer.from(glyph.images![0].href.split(',')[1], 'base64'), source);
    assert.deepEqual(handGlyphs[`hand-trappist-right-${n}`].images, glyph.images);
  }
  const original = readFileSync(
    new URL('../public/reference/hands/counting-fingers-on-hand.svg', import.meta.url),
    'utf8',
  );
  const path = original.match(/<path\b[^>]*\bd="([^"]+)"/)![1];
  assert.equal(handGlyphs['hand-cistercian-count'].paths[0].d, path);
  assert.equal(handGlyphs['hand-cistercian-count'].source, countArtworkSource);
  const svg = exportSVG(representGesture(7n, trappist), handGlyphs, trappist.name)!;
  assert.match(svg, /<image href="data:image\/jpeg;base64,/);
  assert.match(svg, /grayscale\(1\)/);
  assert.doesNotMatch(svg, /<image href="https?:/);
});

test('dictionaries preserve documented distinctions and export their hands', () => {
  assert.equal(gestureDictionary(bede).length, 36);
  assert.ok(gestureDictionary(trappist).some((e) => e.meaning.includes('½ hour')));
  assert.ok(gestureDictionary(trappist).some((e) => e.meaning.includes('¼ hour')));
  assert.ok(gestureDictionary(trappist).some((e) => e.meaning.includes('not a cardinal numeral')));
  for (const system of gestureSystems) {
    for (const entry of gestureDictionary(system)) assert.ok(handGlyphs[entry.glyph]);
    const svg = exportSVG(
      representGesture(BigInt(system.specimen), system),
      handGlyphs,
      system.name,
    )!;
    assert.doesNotMatch(svg, /<text|font-family/);
    if (system.id === bede.id) {
      assert.match(svg, /<path/);
      assert.doesNotMatch(svg, /<image/);
      assert.match(svg, /public-domain/);
      assert.match(svg, /fill="#ffffff"/);
      assert.doesNotMatch(svg, /SIL OPEN FONT LICENSE/);
    } else {
      assert.match(svg, /<image href="data:image\/jpeg;base64,/);
      assert.match(svg, /public-domain/);
    }
  }
  assert.deepEqual(gestureDictionary({ ...bede, id: 'roman', engine: 'roman' }), []);
});
