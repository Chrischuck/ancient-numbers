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
  assert.match(addition, /five-shell batches/);
  assert.match(addition, /Combine the singles: 4 \+ 1 = 5/);
  assert.match(addition, /3 twenties, 0 fives, and 0 singles/);
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
  assert.match(multiplication, /Multiplication · doubling and selecting/);
  assert.match(multiplication, /class="math-table"/);
  assert.match(multiplication, /Selected copy counts: 1 \+ 4 \+ 8 = 13/);
  assert.match(multiplication, /Selected amounts: 12 \+ 48 \+ 96 = 156/);
  assert.match(multiplication, /papyrus itself uses hieratic/);
  const division = worked('egyptian', 156n, 12n, 'divide');
  assert.match(division, /Division · finding the missing multiplier/);
  assert.match(division, /Selected copy counts: 1 \+ 4 \+ 8 = 13/);
  assert.match(division, /Selected amounts: 12 \+ 48 \+ 96 = 156/);
  const fractional = worked('egyptian', 5n, 3n, 'divide');
  assert.match(fractional, /unit fractions/);
  assert.match(fractional, /5 ÷ 3 = 5\/3/);
});

test('each operator renders only its operation lesson and translate retains numeral formation', () => {
  const names = {
    add: 'Addition',
    subtract: 'Subtraction',
    multiply: 'Multiplication',
    divide: 'Division',
  };
  for (const entry of systems) {
    for (const [operation, name] of Object.entries(names)) {
      const html = worked(entry.id, 58n, 7n, operation);
      assert.match(html, new RegExp(`<h3>${name}`), `${entry.id}: ${operation}`);
      assert.match(html, new RegExp(`data-operation="${operation}"`), `${entry.id}: ${operation}`);
      assert.match(html, /class="math-evidence"/, `${entry.id}: ${operation}`);
      assert.doesNotMatch(
        html,
        /formation-steps|<h3>(Write|Read|Show) |Perform the operation, then express|Split the second factor into place-value groups/,
        `${entry.id}: ${operation}`,
      );
      assert.doesNotMatch(html, /undefined|NaN|Infinity/, `${entry.id}: ${operation}`);
      assert.ok(stepCount(html, 'math-steps') <= 14, `${entry.id}: ${operation}`);
    }
  }
  assert.match(renderMathReasoning(system('egyptian'), rational(58n)), /formation-steps/);
});

test('Egyptian addition combines actual signs and subtraction completes the deficit', async () => {
  const entry = system('egyptian');
  const glyphs = await loadGlyphs(entry.region);
  const addition = renderMathReasoning(
    entry,
    rational(125n),
    {
      first: rational(58n),
      second: rational(67n),
      operation: 'add',
    },
    glyphs,
  );
  assert.match(addition, /8 \+ 7 = 15/);
  assert.match(addition, /Exchange ten for one ten sign \(hobble\); leave 5/);
  assert.match(addition, /5 \+ 6 \+ 1 exchanged from below = 12/);
  assert.match(addition, /math-step-signs/);
  assert.match(addition, /<svg/);
  assert.match(addition, /Teaching reconstruction:.*hieratic writing/);
  assert.doesNotMatch(addition, /doubling|reciprocal|class="math-table"/);
  const subtraction = worked('egyptian', 100n, 1n, 'subtract');
  assert.match(subtraction, /1 \+ 9 = 10/);
  assert.match(subtraction, /10 \+ 90 = 100/);
  assert.match(subtraction, /9 \+ 90 = 99/);
  assert.match(subtraction, /100 − 1 = 99/);
  assert.doesNotMatch(subtraction, /doubling|reciprocal/);
  // A carry beyond the repertoire is explained without referring to missing artwork.
  const overflow = renderMathReasoning(
    entry,
    rational(19_999_998n),
    {
      first: rational(9_999_999n),
      second: rational(9_999_999n),
      operation: 'add',
    },
    glyphs,
  );
  assert.match(overflow, /19999998/);
  assert.doesNotMatch(overflow, /undefined|NaN/);
});

test('doubling table renders Egyptian signs and selected amounts for the user example', async () => {
  const entry = system('egyptian');
  const html = renderMathReasoning(
    entry,
    rational(312n),
    {
      first: rational(13n),
      second: rational(24n),
      operation: 'multiply',
    },
    await loadGlyphs(entry.region),
  );
  assert.match(html, /<table role="table">/);
  assert.match(html, /<th scope="col" role="columnheader">Copies<\/th>/);
  assert.match(html, /<th scope="col" role="columnheader">Amount<\/th>/);
  assert.equal((html.match(/<tr role="row" class="selected">/g) ?? []).length, 3);
  assert.match(html, /Selected amounts: 24 \+ 96 \+ 192 = 312/);
  assert.match(html, /<svg/);
  assert.doesNotMatch(html, /Subtraction|Division ·|formation-steps/);
});

test('Babylonian add and subtract operate on wedges and sixty-place exchanges', async () => {
  const entry = system('babylonian');
  const html = renderMathReasoning(
    entry,
    rational(71n),
    {
      first: rational(23n),
      second: rational(48n),
      operation: 'add',
    },
    await loadGlyphs(entry.region),
  );
  assert.match(html, /23 \+ 48 = 71/);
  assert.match(html, /Pool 6 ten-wedges and 11 one-wedges/);
  assert.match(html, /Exchange ten one-wedges for a ten-wedge/);
  assert.match(html, /Exchange six ten-wedges for one one-wedge in the next place/);
  assert.match(html, /result is 1, 11 in sexagesimal/);
  assert.match(html, /<svg/);
  assert.doesNotMatch(html, /reciprocal|Multiplication tables/);
  const subtraction = worked('babylonian', 3600n, 1n, 'subtract');
  assert.match(subtraction, /Exchange one group worth 3600 for sixty groups worth 60/);
  assert.match(subtraction, /Exchange one group worth 60 for sixty groups worth 1/);
  assert.match(subtraction, /result is 59, 59 in sexagesimal/);
});

test('Babylonian multiplication builds a missing product from table multiples, without division instructions', () => {
  const html = worked('babylonian', 47n, 7n, 'multiply');
  assert.match(html, /Multiplication tables supplied/);
  assert.match(html, /47 = 40 \+ 7/);
  assert.match(html, /40 × 7 = 280 \(base 60: \[4, 40\] = 4 × 60 \+ 40\)/);
  assert.match(html, /7 × 7 = 49/);
  assert.match(html, /47 × 7 = 329 \(base 60: \[5, 29\] = 5 × 60 \+ 29\)/);
  assert.match(html, /47 × 7 = 329/);
  assert.match(html, /Documented tools, reconstructed working/);
  assert.doesNotMatch(html, /reciprocal|Division ·|formation-steps/);
});

test('Babylonian products cannot be mistaken for decimal values separated by a comma', () => {
  const html = worked('babylonian', 42n, 8n, 'multiply');
  assert.match(html, /40 × 8 = 320 \(base 60: \[5, 20\] = 5 × 60 \+ 20\)/);
  assert.match(html, /320 \+ 16 = 336/);
  assert.match(html, /42 × 8 = 336 \(base 60: \[5, 36\] = 5 × 60 \+ 36\)/);
  assert.doesNotMatch(html, /40 × 8 = 5, 20|42 × 8 = 5, 36/);
});

test('rod multiplication follows Sunzi’s rows, while division shifts a divisor and retains its remainder', async () => {
  const entry = system('rods');
  const multiplication = renderMathReasoning(
    entry,
    rational(312n),
    {
      first: rational(13n),
      second: rational(24n),
      operation: 'multiply',
    },
    await loadGlyphs(entry.region),
  );
  assert.match(multiplication, /upper row.*lower row.*middle row/);
  assert.match(multiplication, /left to right/);
  assert.match(multiplication, /1 × 24 × 10 = 240/);
  assert.match(multiplication, /3 × 24 × 1 = 72/);
  assert.match(
    multiplication,
    /Remove the finished upper digit and shift the lower row one place right/,
  );
  assert.match(multiplication, /middle row, carrying tens immediately: 312/);
  assert.match(multiplication, /<svg/);
  assert.match(multiplication, /sun-tzu\/i\/8/);
  const division = worked('rods', 100n, 6n, 'divide');
  assert.match(division, /At quotient place 10, 1 copies of the shifted divisor 60 fit/);
  assert.match(division, /At quotient place 1, 6 copies of the shifted divisor 6 fit/);
  assert.match(division, /16 \+ 4\/6 = 50\/3/);
  assert.match(division, /sun-tzu\/i\/9/);
});

test('Kaktovik lessons use documented classroom strokes and graphical quotient chunks', () => {
  const addition = worked('kaktovik', 19n, 2n, 'add');
  assert.match(
    addition,
    /five unit strokes make one five-stroke, and four five-strokes make one in the next place/,
  );
  assert.match(addition, /Documented classroom practice/);
  const subtraction = worked('kaktovik', 20n, 1n, 'subtract');
  assert.match(subtraction, /Open one group worth 20 into twenty at place 1/);
  assert.match(subtraction, /20 − 1 = 19/);
  const division = worked('kaktovik', 30561n, 61n, 'divide');
  assert.match(division, /Division · graphical chunking/);
  assert.match(division, /At place 400, trace 1 copies/);
  assert.match(division, /At place 20, trace 5 copies/);
  assert.match(division, /501 whole copies fit/);
  const multiplication = worked('kaktovik', 13n, 24n, 'multiply');
  assert.match(multiplication, /13 × 20 = 260/);
  assert.match(multiplication, /13 × 4 = 52/);
  assert.match(multiplication, /13 × 24 = 312/);
  assert.match(multiplication, /data-evidence="modern"/);
});

test('Oksapmin addition and subtraction track the actual body path as a modern ethnographic adaptation', async () => {
  const entry = system('oksapmin');
  const glyphs = await loadGlyphs(entry.region);
  const addition = renderMathReasoning(
    entry,
    rational(16n),
    {
      first: rational(9n),
      second: rational(7n),
      operation: 'add',
    },
    glyphs,
  );
  assert.match(addition, /Addition · tracking forward on the body path/);
  assert.match(
    addition,
    /Count added step 1: move forward from upper arm · first side \(9\) to shoulder · first side \(10\)/,
  );
  assert.match(addition, /finish at ear · other side, position 16: 9 \+ 7 = 16/);
  assert.match(addition, /Observed modern adaptation:.*schooling and economic exchange/);
  assert.match(addition, /<svg/);
  assert.doesNotMatch(addition, /formation-steps|The subtraction example/);
  assert.match(addition, /not positional base-27 digits/);
  const subtraction = worked('oksapmin', 16n, 7n, 'subtract');
  assert.match(subtraction, /Subtraction · tracking backward on the body path/);
  assert.match(
    subtraction,
    /Count removal 1 at ear · other side \(16\), then move back to eye · other side \(15\)/,
  );
  assert.match(
    subtraction,
    /Count removal 7 at shoulder · first side \(10\), then move back to upper arm · first side \(9\)/,
  );
  assert.match(subtraction, /finish at upper arm · first side, position 9: 16 − 7 = 9/);
  assert.match(subtraction, /2015.*Oksapmin body arithmetic/);
  assert.ok(stepCount(worked('oksapmin', 26n, 25n, 'subtract'), 'math-steps') <= 13);
  for (const [a, b, operation] of [
    [27n, 1n, 'add'],
    [1n, 1n, 'subtract'],
    [2n, 3n, 'subtract'],
    [28n, 1n, 'subtract'],
  ] as const) {
    const html = worked('oksapmin', a, b, operation);
    assert.match(
      html,
      operation === 'subtract' && a < b
        ? /Exact modern continuation/
        : /first-traversal exhibit boundary/,
    );
    assert.doesNotMatch(html, /Count added step|Count removal|undefined|NaN/);
  }
  const multiplication = worked('oksapmin', 9n, 7n, 'multiply');
  assert.match(multiplication, /Make 7 blocks of 9 positions/);
  assert.match(multiplication, /positions 10–18/);
  assert.match(multiplication, /9 × 7 = 63/);
  assert.match(multiplication, /data-evidence="reconstruction"/);
});

test('rod-board examples explain carries and borrowing in actual operands', () => {
  const addition = worked('rods', 58n, 67n, 'add');
  assert.match(addition, /8 \+ 7 = 15/);
  assert.match(addition, /5 \+ 6 \+ 1 carried = 12/);
  assert.match(addition, /58 \+ 67 = 125/);
  const subtraction = worked('rods', 100n, 1n, 'subtract');
  assert.match(
    subtraction,
    /Replace one group worth 100 with ten worth 10\. Replace one group worth 10 with ten worth 1/,
  );
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
  assert.match(maya, /five dots make one bar, and four bars make one in the next place/);
  assert.match(maya, /At place 20: 2 \+ 0 \+ 1 carried = 3/);
  assert.match(maya, /Teaching reconstruction/);
  assert.match(maya, /Long Count’s 360-day third position/);
  const roman = renderMathReasoning(system('roman'), rational(54n));
  assert.match(roman, /50 \+ \(5 − 1\) = 54/);
  assert.match(worked('roman', 54n, 6n, 'add'), /five-counter/);
});

test('Mangarevan reasoning preserves counting units and marks reconstructed algorithms', () => {
  const html = worked('mangarevan', 273n, 219n, 'add');
  assert.match(html, /6 varu \+ 1 takau \+ 2 ordinary units/);
  assert.match(html, /object-dependent counting unit/);
  assert.match(html, /Analytical reconstruction/);
  assert.match(html, /takau.*paua/);
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
  const cipherAddition = worked('cistercian', 27n, 15n, 'add');
  assert.match(cipherAddition, /data-evidence="recording"/);
  assert.match(cipherAddition, /7 and 5: 12/);
  assert.match(cipherAddition, /27 \+ 15 = 42/);
  assert.match(cipherAddition, /workspace-svg/);
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

test('negative differences retain worked steps instead of stopping at a historical scope notice', () => {
  for (const id of ['egyptian', 'kaktovik', 'maya', 'rods', 'babylonian', 'mangarevan']) {
    const html = worked(id, 3n, 6n, 'subtract');
    assert.match(html, /Exact modern continuation/, id);
    assert.match(html, /3 − 6 = -3/, id);
    assert.ok(stepCount(html, 'math-steps') >= 3, id);
    assert.match(html, /data-evidence="modern"/, id);
  }
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
