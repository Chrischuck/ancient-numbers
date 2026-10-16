import { test } from 'node:test';
import assert from 'node:assert/strict';
import { systems, getSystem } from '../src/data/systems';
import { arithmeticProfiles } from '../src/data/arithmetic-profiles';
import { arithmeticOperations, evidenceLabels } from '../src/lib/arithmetic-evidence';
import type { ArithmeticOperation } from '../src/lib/arithmetic-evidence';
import { completeOperationLesson } from '../src/lib/complete-operation-lessons';
import type { OperationLesson } from '../src/lib/operation-lessons';
import { renderMathReasoning } from '../src/lib/math-methods';
import { calculate, rational } from '../src/lib/numbers';
import { loadGlyphs } from '../src/lib/glyphs';

const operatorNames: Record<ArithmeticOperation, string> = {
  add: 'Addition',
  subtract: 'Subtraction',
  multiply: 'Multiplication',
  divide: 'Division',
};

function system(id: string) {
  const entry = getSystem(id);
  assert.ok(entry, `Missing actual system: ${id}`);
  return entry;
}

function lesson(id: string, a: bigint, b: bigint, operation: ArithmeticOperation) {
  const profile = arithmeticProfiles[id];
  assert.ok(profile, `Missing research profile: ${id}`);
  return completeOperationLesson(
    system(id),
    { first: rational(a), second: rational(b), operation },
    profile,
  );
}

function narrative(value: OperationLesson) {
  return [
    ...(value.parts?.map((part) => part.text) ?? []),
    ...(value.table?.rows.flatMap((row) => row.cells.map((cell) => cell.text)) ?? []),
  ].join('\n');
}

async function rendered(id: string, a: bigint, b: bigint, operation: ArithmeticOperation) {
  const entry = system(id);
  const calculation = { first: rational(a), second: rational(b), operation };
  return renderMathReasoning(
    entry,
    calculate(calculation.first, calculation.second, operation),
    calculation,
    await loadGlyphs(entry.region),
  );
}

function stripMarkup(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

test('every actual calculator has an operation-level research profile and cited boundaries', () => {
  const ids = systems.map((entry) => entry.id);
  assert.equal(new Set(ids).size, ids.length, 'System identifiers must be unique');
  for (const id of ['binary', 'hexadecimal']) assert.ok(ids.includes(id), `${id} is missing`);
  for (const entry of systems) {
    const profile = arithmeticProfiles[entry.id];
    assert.ok(profile, `${entry.id} lacks an arithmetic source audit`);
    assert.ok(profile.summary.trim(), `${entry.id} lacks a source summary`);
    assert.ok(profile.tool.trim(), `${entry.id} lacks a calculation medium`);
    assert.ok(profile.notationRole.trim(), `${entry.id} lacks the notation’s role`);
    assert.ok(profile.sources.length, `${entry.id} lacks arithmetic sources`);
    for (const source of profile.sources) {
      assert.match(source.url, /^https?:\/\//, `${entry.id}: invalid source URL`);
      assert.ok(source.title.trim(), `${entry.id}: unnamed source`);
    }
    for (const operation of arithmeticOperations) {
      assert.ok(
        evidenceLabels[profile.evidence[operation]],
        `${entry.id}/${operation}: missing evidence classification`,
      );
      assert.ok(
        profile.operationNotes[operation]?.trim().length > 30,
        `${entry.id}/${operation}: missing procedure or evidence boundary`,
      );
    }
  }
});

test('all actual systems and all four operators render a worked trace with native illustrations', async () => {
  for (const entry of systems) {
    // Three hours is within the limited Cistercian gesture repertoire; the other
    // fixtures keep every result within a small, supported positive range.
    const [a, b] = entry.id === 'cistercian-gestures' ? [2n, 1n] : [6n, 3n];
    for (const operation of arithmeticOperations) {
      const context = `${entry.id}/${operation}`;
      const html = await rendered(entry.id, a, b, operation);
      assert.match(html, new RegExp(`data-operation="${operation}"`), context);
      assert.match(html, new RegExp(`<h3>${operatorNames[operation]}`), context);
      const steps = html.match(/<ol class="math-steps">([\s\S]*?)<\/ol>/)?.[1] ?? '';
      const rows = html.match(/<tbody>([\s\S]*?)<\/tbody>/)?.[1] ?? '';
      assert.ok(
        (steps.match(/<li>/g)?.length ?? 0) >= 2 || (rows.match(/<tr/g)?.length ?? 0) >= 1,
        `${context}: a source notice and answer alone are not a walkthrough`,
      );
      const workedText = stripMarkup(`${steps} ${rows}`);
      assert.ok(workedText.length > 60, `${context}: empty operation trace`);
      const result = calculate(rational(a), rational(b), operation).numerator;
      assert.match(workedText, new RegExp(`\\b${result}\\b`), `${context}: no worked result`);
      assert.match(html, /class="math-step-signs/, `${context}: no native intermediate or result`);
      assert.match(html, /class="math-method-sources"/, `${context}: no method citations`);
      assert.doesNotMatch(
        html,
        /undefined|NaN|Infinity|Missing artwork|Evidence limit:|do not establish a specific (?:addition|subtraction|multiplication|division) procedure using these signs/,
        context,
      );
      assert.doesNotMatch(
        html,
        /formation-steps/,
        `${context}: shows translation instead of operation`,
      );
      assert.ok((steps.match(/<li>/g)?.length ?? 0) <= 14, `${context}: unbounded step display`);
    }
  }
});

test('Coptic division distinguishes attested table divisors from a new divisor', () => {
  for (const divisor of [12n, 24n, 48n]) {
    const documented = lesson('coptic-epact', divisor * 5n, divisor, 'divide');
    assert.match(documented.evidence, /^Documented practice/, `divisor ${divisor}`);
    assert.match(narrative(documented), /5/);
    assert.ok(documented.table?.rows.length, `divisor ${divisor}: no consulted table entries`);
  }
  const extension = lesson('coptic-epact', 95n, 7n, 'divide');
  assert.match(extension.evidence, /^Teaching reconstruction/);
  assert.match(narrative(extension), /95\/7/);
});

test('Coptic division can compose surviving fractional table entries without inventing fraction artwork', () => {
  // T-S Ar.39.380 directly preserves 90/12 = 7 1/2 and
  // 5/12 = 1/3 + 1/12. Together they give 95/12.
  const worked = lesson('coptic-epact', 95n, 12n, 'divide');
  assert.equal(worked.equation, '95 ÷ 12 = 95/12');
  const text = narrative(worked);
  assert.match(text, /90/);
  assert.match(text, /5/);
  assert.match(text, /1\/2/);
  assert.match(text, /1\/3/);
  assert.match(text, /1\/12/);
  assert.match(text, /95\/12/);
  assert.ok(worked.table?.rows.length, 'Attested table practice needs a table-entry trace');
  const nativeTokens = worked.table.rows.flatMap((row) =>
    row.cells.flatMap((cell) => cell.tokens ?? []),
  );
  assert.ok(nativeTokens.some((token) => token.glyph?.startsWith('coptic-epact-')));
  assert.ok(
    nativeTokens.every((token) => !token.glyph || !/fraction|half|third/.test(token.glyph)),
    'The exhibit does not have historical epact fraction artwork to invent',
  );
});

test('Egyptian subtraction completes the smaller quantity to the larger', async () => {
  const worked = lesson('egyptian', 84n, 37n, 'subtract');
  assert.match(worked.evidence, /^Documented practice/);
  assert.equal(worked.equation, '84 − 37 = 47');
  assert.match(narrative(worked), /complete|completion/i);
  assert.match(narrative(worked), /37 \+ 7 = 44/);
  assert.match(narrative(worked), /44 \+ 40 = 84/);
  const html = await rendered('egyptian', 84n, 37n, 'subtract');
  assert.match(stripMarkup(html), /complete|completion/i);
  assert.doesNotMatch(html, /Subtraction · removing and exchanging hieroglyphic signs/);
});

test('Egyptian fractional division still works through doubled whole multiples and the remainder', async () => {
  for (const fixture of [
    {
      dividend: 95n,
      divisor: 12n,
      selectedRows: 3,
      counts: 'Selected copy counts: 1 + 2 + 4 = 7.',
      amounts: 'Selected amounts: 12 + 24 + 48 = 84.',
      remainder: '95 − 84 = 11',
      result: '7 + 11/12 = 95/12',
    },
    {
      dividend: 100n,
      divisor: 6n,
      selectedRows: 1,
      counts: 'Selected copy counts: 16 = 16.',
      amounts: 'Selected amounts: 96 = 96.',
      remainder: '100 − 96 = 4',
      result: '16 + 4/6 = 50/3',
    },
  ]) {
    const html = await rendered('egyptian', fixture.dividend, fixture.divisor, 'divide');
    const text = stripMarkup(html);
    assert.match(html, /class="math-table"/);
    assert.equal((html.match(/<tr class="selected">/g) ?? []).length, fixture.selectedRows);
    for (const expected of [fixture.counts, fixture.amounts, fixture.remainder, fixture.result])
      assert.ok(text.includes(expected), `Missing numerical division step: ${expected}`);
    assert.match(text, /Another whole copy.*larger than this remainder/);
    assert.match(text, /unit fractions/);
    assert.match(html, /class="math-step-signs/);
    assert.doesNotMatch(text, /whole copies.*exact modern answer.*95\/12 = 95\/12/);
  }
});

test('Ethiopic multiplication retains odd halving rows for eleven times fifteen', () => {
  const worked = lesson('ethiopic', 11n, 15n, 'multiply');
  assert.match(worked.evidence, /^Documented practice/);
  assert.equal(worked.equation, '11 × 15 = 165');
  assert.deepEqual(
    worked.table?.rows.map((row) => [
      Number(row.cells[0].text.match(/^\d+/)?.[0]),
      Number(row.cells[1].text),
      Boolean(row.selected),
    ]),
    [
      [11, 15, true],
      [5, 30, true],
      [2, 60, false],
      [1, 120, true],
    ],
  );
  assert.match(narrative(worked), /15 \+ 30 \+ 120 = 165/);
  assert.ok(worked.table?.rows.every((row) => row.cells.every((cell) => cell.tokens?.length)));
});

test('Rumi subtraction uses a low-order deficit tally and obtains forty-seven', () => {
  const worked = lesson('rumi', 84n, 37n, 'subtract');
  assert.match(worked.evidence, /^Documented practice/);
  assert.equal(worked.equation, '84 − 37 = 47');
  assert.match(narrative(worked), /37 \+ 7 = 44/);
  assert.match(narrative(worked), /44 \+ 40 = 84/);
  assert.match(narrative(worked), /7 \+ 40 = 47/);
});

test('Greek alphabetic multiplication pairs letter values and respects the artwork range', () => {
  const worked = lesson('greek-alphabetic', 265n, 265n, 'multiply');
  assert.equal(worked.equation, '265 × 265 = 70225');
  assert.equal(worked.table?.rows.length, 9);
  const products = worked.table.rows.map((row) => Number(row.cells[2].text.match(/= (\d+)$/)?.[1]));
  assert.deepEqual(products, [40000, 12000, 1000, 12000, 3600, 300, 1000, 300, 25]);
  assert.equal(
    products.reduce((sum, value) => sum + value, 0),
    70225,
  );
  assert.match(narrative(worked), /outside.*(?:artwork|range)/);
  assert.ok(
    worked.table.rows.every((row) => row.cells[0].tokens?.length && row.cells[1].tokens?.length),
  );
});

test('Suzhou addition changes the abacus before recording each new quantity', () => {
  const worked = lesson('suzhou', 13n, 24n, 'add');
  assert.equal(worked.equation, '13 + 24 = 37');
  assert.match(narrative(worked), /13 to 33/);
  assert.match(narrative(worked), /33 to 37/);
  assert.match(narrative(worked), /abacus/);
  assert.match(narrative(worked), /record.*Suzhou/);
  assert.ok((worked.parts?.filter((part) => part.tokens?.length).length ?? 0) >= 3);
});

test('Suzhou subtraction carries the exchange through an empty tens rod', () => {
  const worked = lesson('suzhou', 100n, 1n, 'subtract');
  assert.equal(worked.equation, '100 − 1 = 99');
  const text = narrative(worked);
  assert.match(text, /empty|zero/i);
  assert.match(text, /hundred|100/);
  assert.match(text, /ten tens|ten groups worth 10|10 groups worth 10|100.*10.*10/);
  assert.match(text, /ten units|ten ones|ten worth 1|10 worth 1|10.*1/);
  assert.match(text, /99/);
});

test('signed and fractional continuations remain explicit and retain exact arithmetic', () => {
  const id = 'medefaidrin';
  const worked = completeOperationLesson(
    system(id),
    { first: rational(1n, 2n), second: rational(1n, 3n), operation: 'add' },
    arithmeticProfiles[id],
  );
  assert.equal(worked.equation, '1/2 + 1/3 = 5/6');
  assert.match(worked.evidence, /^Exact modern continuation/);
  assert.match(narrative(worked), /\(3 \+ 2\)\/6 = 5\/6/);
  assert.ok(worked.parts?.every((part) => !part.tokens?.length));
});

test('a long binary carry keeps its completed native result inside the bounded step display', async () => {
  // Twenty trailing one bits plus one must become one followed by twenty zeros.
  const html = await rendered('binary', 1_048_575n, 1n, 'add');
  const steps = html.match(/<ol class="math-steps">([\s\S]*?)<\/ol>/)?.[1] ?? '';
  assert.match(stripMarkup(steps), /(?:answer|result|total).*1048576/i);
  assert.match(steps, /class="math-step-signs/);
  assert.ok((steps.match(/<li>/g)?.length ?? 0) <= 14);
});
