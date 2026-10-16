import test from 'node:test';
import assert from 'node:assert/strict';
import { getSystem, regionLabel } from '../src/data/systems';
import { represent } from '../src/lib/format';
import { findGlyph, loadGlyphs } from '../src/lib/glyphs';
import { renderMathReasoning } from '../src/lib/math-methods';
import { calculate, parseNumber, rational } from '../src/lib/numbers';
import { copyText, exportSVG, renderRepresentation } from '../src/lib/render';

for (const id of ['binary', 'hexadecimal']) {
  const system = getSystem(id)!;
  test(`${id} is a modern global positional system with copyable vector artwork`, async () => {
    assert.equal(system.era, 'Modern');
    assert.equal(system.region, 'Global');
    assert.equal(regionLabel(system.region), 'Modern');
    assert.equal(system.structure, 'Positional');
    assert.equal(system.radix, id === 'binary' ? 2 : 16);
    const glyphs = await loadGlyphs(system.region);
    for (const glyph of system.digits!) {
      const sign = findGlyph(glyph, glyphs)!;
      assert.ok(sign.paths.length);
      assert.equal(sign.provenance, 'original');
      assert.match(sign.unicode!, /^[0-9A-F]$/);
    }
    const result = represent(rational(42n), system);
    assert.equal(copyText(result, glyphs, system), id === 'binary' ? '101010' : '2A');
    const svg = exportSVG(result, glyphs, `${system.name}: 42`)!;
    assert.match(svg, /<path/);
    assert.doesNotMatch(svg, /<text|<use|href=/);
  });

  test(`${id} preserves zero, empty places, and integers beyond Number precision`, async () => {
    const fixtures =
      id === 'binary'
        ? [
            ['0', '0'],
            ['1', '1'],
            ['2', '10'],
            ['42', '101010'],
            ['181', '10110101'],
            ['255', '11111111'],
            ['256', '100000000'],
            ['9007199254740993', `1${'0'.repeat(52)}1`],
          ]
        : [
            ['0', '0'],
            ['10', 'A'],
            ['11', 'B'],
            ['12', 'C'],
            ['13', 'D'],
            ['14', 'E'],
            ['15', 'F'],
            ['16', '10'],
            ['42', '2A'],
            ['255', 'FF'],
            ['256', '100'],
            ['39321', '9999'],
            ['9007199254740993', '20000000000001'],
          ];
    const glyphs = await loadGlyphs(system.region);
    for (const [decimal, expected] of fixtures) {
      const result = represent(parseNumber(decimal), system);
      assert.equal(result.status, 'ok', decimal);
      assert.equal(copyText(result, glyphs, system), expected, decimal);
    }
    const withZero = represent(rational(BigInt(system.radix!) ** 2n), system);
    assert.deepEqual(
      withZero.tokens.map((token) => token.place),
      [String(system.radix! ** 2), String(system.radix!), '1'],
    );
  });

  test(`${id} documents and enforces its whole-number and size limits`, async () => {
    const glyphs = await loadGlyphs(system.region);
    const maximum = represent(parseNumber(system.max), system);
    assert.equal(maximum.status, 'ok');
    if (id === 'binary') assert.equal(copyText(maximum, glyphs, system), '1'.repeat(256));
    assert.equal(represent(rational(BigInt(system.max) + 1n), system).status, 'unsupported');
    for (const input of ['-1', '0.5', '1/3']) {
      const result = represent(parseNumber(input), system);
      assert.equal(result.status, 'unsupported', input);
      assert.match(result.reason!, /whole numbers/);
      const lesson = renderMathReasoning(system, parseNumber(input));
      assert.match(lesson, /nonnegative whole numbers only/);
      assert.doesNotMatch(lesson, /historical/);
    }
  });

  test(`${id} calculator lessons work directly in their own radix with decimal hints`, async () => {
    const calculation = { first: rational(40n), second: rational(2n), operation: 'add' };
    const glyphs = await loadGlyphs(system.region);
    const result = calculate(calculation.first, calculation.second, calculation.operation);
    const lesson = renderMathReasoning(system, result, calculation, glyphs);
    assert.match(lesson, id === 'binary' ? /101000 \+ 10 = 101010/ : /28 \+ 2 = 2A/);
    assert.match(lesson, /class="math-decimal-hint"/);
    assert.match(lesson, new RegExp(`base ${system.radix}`));
    assert.match(lesson, /class="math-steps"/);
    assert.doesNotMatch(lesson, /Evidence limit|historical demonstration/);
  });
}

test('hexadecimal identifies A–F by both letter and value in accessible output and lessons', async () => {
  const system = getSystem('hexadecimal')!;
  const glyphs = await loadGlyphs(system.region);
  const result = represent(rational(42n), system);
  assert.match(renderRepresentation(result, glyphs), /Digit A \(10\)/);
  assert.match(
    renderMathReasoning(system, rational(42n), undefined, glyphs),
    /letter A is the digit 10/,
  );
});

test('long binary expansions keep the worked lesson bounded while preserving the numeral', async () => {
  const system = getSystem('binary')!;
  const glyphs = await loadGlyphs(system.region);
  const value = rational(8192n);
  assert.equal(copyText(represent(value, system), glyphs, system), `1${'0'.repeat(13)}`);
  const lesson = renderMathReasoning(system, value, undefined, glyphs);
  assert.match(lesson, /longer than the teaching panel allows/);
  assert.doesNotMatch(lesson, /class="formation-steps"/);
});
