import { test } from 'node:test';
import assert from 'node:assert/strict';
import { systems, getSystem } from '../src/data/systems';
import { calculate, rational } from '../src/lib/numbers';
import { renderMathReasoning } from '../src/lib/math-methods';
import { loadGlyphs } from '../src/lib/glyphs';
import type { SystemDefinition } from '../src/lib/types';

const system = (id: string) => {
  const found = getSystem(id);
  assert.ok(found, `Missing system ${id}`);
  return found;
};
function worked(id: string, first: bigint, second: bigint, operation: string) {
  const calculation = { first: rational(first), second: rational(second), operation };
  return renderMathReasoning(
    system(id),
    calculate(calculation.first, calculation.second, operation),
    calculation,
  );
}
function stepCount(html: string, className: 'formation-steps' | 'math-steps') {
  const list = html.match(new RegExp(`<ol class="${className}">([\\s\\S]*?)</ol>`));
  return (list?.[1].match(/<li>/g) ?? []).length;
}

test('every tradition has a bounded, source-linked lesson without the generic decimal walkthrough', async () => {
  for (const entry of systems) {
    const html = renderMathReasoning(
      entry,
      rational(BigInt(entry.specimen)),
      undefined,
      await loadGlyphs(entry.region),
    );
    assert.match(html, /<h3>/, entry.id);
    assert.match(html, /href="https?:\/\//, entry.id);
    assert.doesNotMatch(
      html,
      /undefined|NaN|Infinity|Familiar decimal comparison|Reasoning about numbers|Building the number|Start with the value|The value stays the same when its notation changes/,
      entry.id,
    );
    assert.ok(html.length < 100_000, `${entry.id}: oversized lesson (${html.length})`);
    assert.ok(stepCount(html, 'formation-steps') <= 14, `${entry.id}: too many formation steps`);
  }
});

test('Yorùbá explains the words in its subtractive number name', () => {
  const html = renderMathReasoning(system('yoruba'), rational(56n));
  assert.doesNotMatch(html, /50 \+ 6|Familiar decimal comparison/);
  assert.match(html, /60 − 4 = 56/);
  assert.match(html, /ẹ̀rin/i);
  assert.match(html, /dín/i);
  assert.match(html, /ọgọ́ta/i);
  assert.match(html, /four|4/);
  assert.match(html, /sixty|60/);
  assert.match(html, /formation-steps/);
  const fiftyFour = renderMathReasoning(system('yoruba'), rational(54n));
  assert.match(fiftyFour, /\(3 × 20 − 10\) \+ 4 = 54/);
  const addition = worked('yoruba', 54n, 6n, 'add');
  assert.match(addition, /54 = 60 − 6/);
  assert.match(addition, /modern mathematical illustration/);
  assert.match(addition, /60 \+ 0 = 60/);
});

test('Babylonian lessons count the two wedge types and preserve an empty internal place', async () => {
  const entry = system('babylonian');
  const glyphs = await loadGlyphs(entry.region);
  const fiftySix = renderMathReasoning(entry, rational(56n), undefined, glyphs);
  assert.match(fiftySix, /5 × 10 \+ 6 = 56/);
  assert.match(fiftySix, /wedge/);
  assert.match(fiftySix, /formation-sign/);
  assert.match(fiftySix, /<svg/);
  const withEmptyPlace = renderMathReasoning(entry, rational(3656n), undefined, glyphs);
  assert.match(withEmptyPlace, /1 × 3,600 \+ 0 × 60 \+ 56 = 3,656/);
  assert.match(withEmptyPlace, /empty|placeholder|gap/);
});

test('Maya lessons explain the place stack, bars and dots, and an internal shell zero', async () => {
  const entry = system('maya');
  const glyphs = await loadGlyphs(entry.region);
  const fiftySix = renderMathReasoning(entry, rational(56n), undefined, glyphs);
  assert.match(fiftySix, /2 × 20 \+ 16 = 56/);
  assert.match(fiftySix, /bar/);
  assert.match(fiftySix, /dot/);
  assert.match(fiftySix, /formation-sign/);
  const withZero = renderMathReasoning(entry, rational(416n), undefined, glyphs);
  assert.match(withZero, /1 × 400 \+ 0 × 20 \+ 16 = 416/);
  assert.match(withZero, /shell/);
});

test('Egyptian lessons use counted ten and unit signs', async () => {
  const entry = system('egyptian');
  const html = renderMathReasoning(entry, rational(56n), undefined, await loadGlyphs(entry.region));
  assert.match(html, /5 × 10 \+ 6 × 1 = 56/);
  assert.match(html, /five|5/);
  assert.match(html, /six|6/);
  assert.match(html, /heel|hobble|ten-sign|tens sign|arch/i);
  assert.match(html, /stroke|unit/i);
  assert.match(html, /formation-sign/);
});

test('Roman lessons show the subtractive pair as part of the written numeral', async () => {
  const entry = system('roman');
  const html = renderMathReasoning(entry, rational(54n), undefined, await loadGlyphs(entry.region));
  assert.match(html, /LIV/);
  assert.match(html, /50 \+ \(5 − 1\) = 54/);
  assert.match(html, /IV/);
  assert.match(html, /before|left/);
  assert.match(html, /formation-sign/);
});

test('Tamil lessons put the multiplier before the ten sign', async () => {
  const entry = system('tamil');
  const html = renderMathReasoning(entry, rational(56n), undefined, await loadGlyphs(entry.region));
  assert.match(html, /5 × 10 \+ 6 = 56/);
  assert.match(html, /before|followed by/);
  assert.match(html, /multipl|coefficient/);
  assert.match(html, /formation-sign/);
});

test('Cistercian lessons attach each place to its staff quadrant', async () => {
  const entry = system('cistercian');
  const html = renderMathReasoning(
    entry,
    rational(1234n),
    undefined,
    await loadGlyphs(entry.region),
  );
  assert.match(html, /upper right/i);
  assert.match(html, /upper left/i);
  assert.match(html, /lower right/i);
  assert.match(html, /lower left/i);
  assert.match(html, /staff/);
  assert.match(html, /formation-sign/);
});

test('Mende lessons distinguish the additive teens subscript from a tens multiplier', () => {
  const entry = system('mende-kikakui');
  const sixteen = renderMathReasoning(entry, rational(16n));
  assert.match(sixteen, /teens subscript below the 6 digit/);
  assert.match(sixteen, /adds ten: 10 \+ 6 = 16/);
  assert.equal(stepCount(sixteen, 'formation-steps'), 1);
  const fiftySix = renderMathReasoning(entry, rational(56n));
  assert.match(fiftySix, /10s subscript below the 5 digit/);
  assert.match(fiftySix, /5 × 10 \+ 6 = 56/);
  assert.match(fiftySix, /right to left/);
  assert.equal(stepCount(fiftySix, 'formation-steps'), 2);
});

test('Cherokee lessons use a whole teens sign and distinct tens and units signs', () => {
  const entry = system('cherokee');
  const sixteen = renderMathReasoning(entry, rational(16n));
  assert.match(sixteen, /single sign for 16/);
  assert.doesNotMatch(sixteen, /10 \+ 6/);
  assert.equal(stepCount(sixteen, 'formation-steps'), 1);
  const fiftySix = renderMathReasoning(entry, rational(56n));
  assert.match(fiftySix, /dedicated 50 sign first/);
  assert.match(fiftySix, /Follow it with the 6 sign/);
  assert.match(fiftySix, /50 \+ 6 = 56/);
  assert.equal(stepCount(fiftySix, 'formation-steps'), 2);
});

test('Ottoman Siyaq lessons read a compound unit before its tens sign from right to left', () => {
  const entry = system('ottoman-siyaq');
  const html = renderMathReasoning(entry, rational(56n));
  assert.match(html, /right to left/);
  assert.match(html, /6 unit sign before the tens sign/);
  assert.match(html, /Continue left to the 50 sign/);
  assert.match(html, /6 \+ 50 = 56/);
  assert.ok(html.indexOf('6 unit sign') < html.indexOf('Continue left to the 50 sign'));
});

test('Choctaw lessons explain the teen prefix and the coefficient after the ten word', () => {
  const entry = system('choctaw');
  const sixteen = renderMathReasoning(entry, rational(16n));
  assert.match(sixteen, /awah/i);
  assert.match(sixteen, /hannali/i);
  assert.match(sixteen, /10 \+ 6 = 16/);
  const fiftySix = renderMathReasoning(entry, rational(56n));
  assert.match(fiftySix, /pokoli tahlapi/i);
  assert.match(fiftySix, /Akocha joins hannali/i);
  assert.match(fiftySix, /after pokoli/);
  assert.match(fiftySix, /10 × 5 \+ 6 = 56/);
});

test('Diné lessons distinguish the spoken order of teens and the twenty and fifty compounds', () => {
  const entry = system('navajo');
  const sixteen = renderMathReasoning(entry, rational(16n));
  assert.match(sixteen, /hastą́ą́/);
  assert.match(sixteen, /ts’áadah/);
  assert.match(sixteen, /6 \+ 10 = 16/);
  const twentySix = renderMathReasoning(entry, rational(26n));
  assert.match(twentySix, /naadiin/i);
  assert.match(twentySix, /directly to twenty/);
  assert.match(twentySix, /20 \+ 6 = 26/);
  const fiftySix = renderMathReasoning(entry, rational(56n));
  assert.match(fiftySix, /ashdladiin/i);
  assert.match(fiftySix, /dóó bi’aan/i);
  assert.match(fiftySix, /50 \+ 6 = 56/);
});

test('Māori lessons name each nonempty magnitude and join the final units', () => {
  const html = renderMathReasoning(system('maori'), rational(2056n));
  assert.match(html, /rua mano/);
  assert.match(html, /rima tekau/);
  assert.match(html, /mā/i);
  assert.match(html, /ono/);
  assert.match(html, /2 × 1,000 \+ 5 × 10 \+ 6 = 2,056/);
  assert.doesNotMatch(html, /undefined|Familiar decimal comparison/);
});

test('Hawaiian lessons explain the decimal tens and kūmā connection', () => {
  const html = renderMathReasoning(system('hawaiian'), rational(56n));
  assert.match(html, /kanalima/);
  assert.match(html, /kūmā/i);
  assert.match(html, /ono/);
  assert.match(html, /50 \+ 6 = 56/);
  assert.match(html, /kana-/);
});

test('productive Pacific counts explain arbitrary supported values without example lookups', async () => {
  const mangarevanEntry = system('mangarevan');
  const fiftySix = renderMathReasoning(mangarevanEntry, rational(56n));
  assert.match(fiftySix, /tataua names 40; takau names 10/);
  assert.match(fiftySix, /ono supplies the remaining 6/);
  assert.match(fiftySix, /40 \+ 10 \+ 6 = 56/);
  const mangarevan = renderMathReasoning(mangarevanEntry, rational(799n));
  assert.match(mangarevan, /9 × 80 \+ 40 \+ 20 \+ 10 \+ 9 = 799/);
  assert.match(mangarevan, /counting units/);
  assert.match(mangarevan, /2 fish|two fish/);
  const entry = system('oksapmin');
  const bodyCount = renderMathReasoning(
    entry,
    rational(23n),
    undefined,
    await loadGlyphs(entry.region),
  );
  assert.match(bodyCount, /thumb · other side/);
  assert.match(bodyCount, /wrist · other side, which counts 22/);
  assert.match(bodyCount, /index finger · other side, position 24/);
  assert.match(bodyCount, /22 \+ 1 = 23/);
  assert.equal(stepCount(bodyCount, 'formation-steps'), 3);
  assert.match(bodyCount, /formation-sign/);
  assert.doesNotMatch(bodyCount, /20 \+ 3/);
});

test('Egyptian multiplication selects doubling rows and division reverses the task', () => {
  const multiplication = worked('egyptian', 13n, 12n, 'multiply');
  assert.match(multiplication, /Doubling and selecting/);
  assert.match(multiplication, /Keep: 4 copies → 52/);
  assert.match(multiplication, /Keep: 8 copies → 104/);
  assert.match(multiplication, /Selected amounts: 52 \+ 104 = 156/);
  assert.match(multiplication, /hieratic writing/);
  const division = worked('egyptian', 156n, 12n, 'divide');
  assert.match(division, /Division through multiplication/);
  assert.match(division, /Selected copy counts: 1 \+ 4 \+ 8 = 13/);
  assert.match(division, /Selected amounts: 12 \+ 48 \+ 96 = 156/);
  const fractional = worked('egyptian', 5n, 3n, 'divide');
  assert.match(fractional, /unit fractions/);
  assert.match(fractional, /5 ÷ 3 = 5\/3/);
});

test('rod-board examples explain carries and borrowing in actual operands', () => {
  const addition = worked('rods', 58n, 67n, 'add');
  assert.match(addition, /8 \+ 7 = 15/);
  assert.match(addition, /5 \+ 6 \+ 1 carried = 12/);
  assert.match(addition, /58 \+ 67 = 125/);
  const subtraction = worked('rods', 100n, 1n, 'subtract');
  assert.match(subtraction, /exchange one group from the next place for 10 here/);
  assert.match(subtraction, /100 − 1 = 99/);
  assert.ok(stepCount(subtraction, 'math-steps') <= 14);
});

test('Babylonian division uses exact reciprocals and labels truncated sexagesimal expansions', () => {
  const regular = worked('babylonian', 54n, 6n, 'divide');
  assert.match(regular, /1\/6 = 0; 10/);
  assert.match(regular, /54 × \(1\/6\) = 9/);
  assert.match(regular, /terminating base-60 expansion/);
  const irregular = worked('babylonian', 1n, 7n, 'divide');
  assert.match(irregular, /0; 8, 34, 17, 8, 34, 17, …/);
  assert.match(irregular, /does not terminate in base 60/);
  assert.match(irregular, /fraction result here stays exact/);
  assert.match(irregular, /not an exact finite reciprocal/);
});

test('Maya exercises carry twenty while Roman writing exposes subtractive groups', () => {
  const maya = worked('maya', 58n, 7n, 'add');
  assert.match(maya, /18 \+ 7 = 25/);
  assert.match(maya, /20 of this place make one next-place group/);
  assert.match(maya, /3 × 20 \+ 5 = 65/);
  assert.match(maya, /modern regrouping exercise/i);
  assert.match(maya, /Long Count’s 360-day third position/);
  const roman = renderMathReasoning(system('roman'), rational(54n));
  assert.match(roman, /50 \+ \(5 − 1\) = 54/);
  assert.match(worked('roman', 54n, 6n, 'add'), /five-counter/);
});

test('Mangarevan reasoning preserves counting units and marks reconstructed algorithms', () => {
  const html = worked('mangarevan', 273n, 219n, 'add');
  assert.match(html, /6 × 80 \+ 10 \+ 2/);
  assert.match(html, /object-dependent counting unit/);
  assert.match(html, /analytical reconstruction/);
  assert.match(html, /two takau form one paua/);
  assert.match(
    worked('mangarevan', 1000n, 2n, 'multiply'),
    /beyond the illustrated vocabulary range/,
  );
});

test('gesture reasoning distinguishes decimal communication, hours, and written ciphers', () => {
  const bede = getSystem('medieval-finger-counting');
  const trappist = getSystem('cistercian-gestures');
  assert.ok(bede);
  assert.ok(trappist);
  assert.match(renderMathReasoning(bede, rational(54n)), /left hand/);
  assert.match(renderMathReasoning(bede, rational(54n)), /5 × 10 \+ 4 = 54/);
  assert.match(renderMathReasoning(trappist, rational(3n, 2n)), /1 hour \+ 1\/2 hour = 3\/2 hours/);
  assert.match(
    worked('cistercian', 27n, 15n, 'add'),
    /does not supply a general arithmetic algorithm/,
  );
});

test('signed, fractional, zero, malformed, and huge inputs stay safe and bounded', () => {
  const maya = system('maya');
  assert.match(renderMathReasoning(maya, rational(-54n)), /exact modern result is -54/);
  assert.match(renderMathReasoning(maya, rational(7n, 3n)), /exact modern result is 7\/3/);
  assert.match(renderMathReasoning(maya, { numerator: -7n, denominator: -3n }), /7\/3/);
  assert.match(renderMathReasoning(maya, rational(0n)), /0 = 0/);
  assert.match(renderMathReasoning(maya, { numerator: 1n, denominator: 0n }), /Division by zero/);
  const huge = 10n ** 2000n;
  const html = renderMathReasoning(maya, rational(huge), {
    first: rational(huge),
    second: rational(3n),
    operation: 'multiply',
  });
  assert.ok(html.length < 6000, `Oversized teaching panel: ${html.length}`);
  assert.match(html, /2001 digits/);
  assert.doesNotMatch(html, /undefined|NaN|Infinity/);
  assert.ok(stepCount(worked('egyptian', 1023n, 999999999n, 'multiply'), 'math-steps') <= 14);
});

test('example-only dictionaries and injected source content are not silently extended', () => {
  const referenceOnly: SystemDefinition = {
    ...system('cherokee'),
    engine: 'explainer',
    examples: [{ value: '3', glyphs: ['cherokee-3'], explanation: 'A charted sign for three.' }],
  };
  const cherokee = renderMathReasoning(referenceOnly, rational(54n));
  assert.match(cherokee, /no word or sign is invented/);
  const injected: SystemDefinition = {
    ...referenceOnly,
    name: '<script>alert(1)</script>',
    howItWorks: '<script>alert(1)</script>',
    sources: [
      { title: '<bad>', url: 'https://example.org/lesson' },
      { title: 'Unsafe source', url: 'javascript:alert(1)' },
    ],
  };
  const html = renderMathReasoning(injected, rational(54n));
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;bad&gt;/);
  assert.doesNotMatch(html, /<script>|href="javascript:/);
});
