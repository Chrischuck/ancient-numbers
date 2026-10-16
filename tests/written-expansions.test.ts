import test from 'node:test';
import assert from 'node:assert/strict';
import { getSystem } from '../src/data/systems';
import { representWrittenExpansion } from '../src/lib/written-expansions';
import { writtenExpansionGlyphs } from '../src/glyphs/written-expansions';

const system = (id: string) => getSystem(id)!;
const render = (id: string, n: bigint) => representWrittenExpansion(n, system(id));
const ids = (id: string, n: bigint) => render(id, n).tokens.map((token) => token.glyph);

test('Mende uses attached groups and matches all six Unicode formation examples', () => {
  const fixtures: [bigint, string][] = [
    [10n, '\u{1E8C7}\u{1E8D1}'],
    [14n, '\u{1E8CA}\u{1E8D0}'],
    [27n, '\u{1E8C8}\u{1E8D1}\u{1E8CD}'],
    [206n, '\u{1E8C8}\u{1E8D2}\u{1E8CC}'],
    [417n, '\u{1E8CA}\u{1E8D2}\u{1E8CD}\u{1E8D0}'],
    [784n, '\u{1E8CD}\u{1E8D2}\u{1E8CE}\u{1E8D1}\u{1E8CA}'],
  ];
  for (const [n, unicode] of fixtures) {
    const result = render('mende-kikakui', n);
    assert.equal(result.status, 'ok');
    assert.equal(result.unicode, unicode, `${n}: logical RTL character sequence`);
    assert.equal(
      result.tokens
        .map((token) => writtenExpansionGlyphs[token.glyph!].unicode)
        .reverse()
        .join(''),
      unicode,
    );
  }
  assert.deepEqual(ids('mende-kikakui', 56n), ['mende-6', 'mende-group-1-5']);
  assert.deepEqual(ids('mende-kikakui', 1000011n), ['mende-group-teens-1', 'mende-group-6-1']);
  assert.equal(render('mende-kikakui', 9999999n).tokens.length, 7);
  assert.equal(render('mende-kikakui', 0n).status, 'unsupported');
  assert.equal(render('mende-kikakui', 10000000n).status, 'unsupported');
});

test('Cherokee covers the entire community chart without treating teens as tens-plus-units', () => {
  for (let n = 0; n <= 100; n++) {
    const result = render('cherokee', BigInt(n));
    assert.equal(result.status, 'ok', String(n));
    assert.equal(
      result.tokens.reduce((sum, token) => sum + Number(token.glyph!.split('-')[1]), 0),
      n,
    );
    assert.ok(
      result.tokens.every((token) => writtenExpansionGlyphs[token.glyph!]),
      `artwork for ${n}`,
    );
    assert.equal(result.unicode, undefined, 'these numerical signs have no Unicode equivalent');
  }
  assert.deepEqual(ids('cherokee', 14n), ['cherokee-14']);
  assert.deepEqual(ids('cherokee', 42n), ['cherokee-40', 'cherokee-2']);
  assert.deepEqual(ids('cherokee', 56n), ['cherokee-50', 'cherokee-6']);
  assert.deepEqual(ids('cherokee', 100n), ['cherokee-100']);
  assert.equal(render('cherokee', 101n).status, 'unsupported');
});

test('Ottoman primary signs follow the specialist source’s transposed tens/units order', () => {
  const fixtures: [bigint, number[]][] = [
    [55n, [5, 50]],
    [505n, [500, 5]],
    [550n, [500, 50]],
    [555n, [500, 5, 50]],
    [5005n, [5000, 5]],
    [5500n, [5000, 500]],
  ];
  for (const [n, logicalValues] of fixtures) {
    const result = render('ottoman-siyaq', n);
    assert.deepEqual(
      result.tokens.map((token) => Number(token.glyph!.split('-')[2])).reverse(),
      logicalValues,
    );
    assert.equal(
      result.unicode,
      result.tokens
        .map((token) => writtenExpansionGlyphs[token.glyph!].unicode)
        .reverse()
        .join(''),
    );
  }
  assert.deepEqual(ids('ottoman-siyaq', 56n), ['ottoman-siyaq-50', 'ottoman-siyaq-6']);
  assert.equal(render('ottoman-siyaq', 0n).status, 'unsupported');
  assert.equal(render('ottoman-siyaq', 10000n).status, 'unsupported');
  assert.match(
    render('ottoman-siyaq', 555n).explanation,
    /primary character forms, spaced apart for teaching/,
  );
});

test('written expansions have complete artwork across their bounded converters', () => {
  for (const id of ['mende-kikakui', 'cherokee', 'ottoman-siyaq']) {
    const definition = system(id);
    for (const n of [
      BigInt(definition.min),
      BigInt(definition.max),
      56n,
      ...definition.examples.map((example) => BigInt(example.value)),
    ]) {
      const result = render(id, n);
      assert.equal(result.status, 'ok', `${id}:${n}`);
      for (const token of result.tokens) {
        const glyph = writtenExpansionGlyphs[token.glyph!];
        assert.ok(glyph, `${id}:${n}:${token.glyph}`);
        assert.ok(glyph.paths.length);
        assert.ok(glyph.paths.every((path) => !/NaN|undefined|Infinity/.test(path.d)));
        assert.match(glyph.source, /^https:\/\//);
      }
    }
  }
});
