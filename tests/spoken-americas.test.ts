import test from 'node:test';
import assert from 'node:assert/strict';
import { getSystem } from '../src/data/systems';
import { americanWordDictionary, representAmericanWords } from '../src/lib/spoken-americas';

test('Choctaw compounds preserve the Nation’s chart and lesson specimens', () => {
  const system = getSystem('choctaw')!;
  // 1–31: October 2018 Biskinik counting chart, with v rendered as the
  // teaching alphabet's ʋ. 90: Choctaw 2 ch. 10 lesson 2. 100: official
  // bilingual year-end report (tahlepa achvffa).
  const specimens = new Map<number, string>([
    [1, 'achʋffa'],
    [10, 'pokkoli'],
    [12, 'awah tuklo'],
    [19, 'awah chakkali'],
    [20, 'pokoli tuklo'],
    [21, 'pokoli tuklo akocha achʋffa'],
    [26, 'pokoli tuklo akocha hannali'],
    [31, 'pokoli tuchina akocha achʋffa'],
    [50, 'pokoli tahlapi'],
    [90, 'pokoli chakkali'],
    [100, 'tahlepa achʋffa'],
  ]);
  for (const [number, words] of specimens)
    assert.equal(representAmericanWords(BigInt(number), system).tokens[0].text, words);
  assert.equal(representAmericanWords(56n, system).tokens[0].text, 'pokoli tahlapi akocha hannali');
  assert.match(representAmericanWords(56n, system).explanation, /10 × 5 \+ 6 = 56/);
  assert.match(representAmericanWords(12n, system).explanation, /10 \+ 2 = 12/);
});

test('Diné College’s chart governs special ones, nasal vowels, tens and linkers', () => {
  const system = getSystem('navajo')!;
  // Independently transcribed from the complete 1–100 source chart.
  const specimens = new Map<number, string>([
    [1, 't’ááłá’í'],
    [4, 'dį́į́’'],
    [6, 'hastą́ą́'],
    [11, 'ła’ ts’áadah'],
    [12, 'naaki ts’áadah'],
    [19, 'náhást’éí ts’áadah'],
    [20, 'naadiin'],
    [21, 'naadiin ła’'],
    [22, 'naadiin naaki'],
    [26, 'naadiin hastą́ą́'],
    [30, 'tádiin'],
    [31, 'tádiin dóó bi’aan t’ááłá’í'],
    [42, 'dízdiin dóó bi’aan naaki'],
    [56, 'ashdladiin dóó bi’aan hastą́ą́'],
    [60, 'hastą́diin'],
    [61, 'hastą́diin dóó bi’aan t’ááłá’í'],
    [70, 'tsoosts’idiin'],
    [80, 'tseebíídiin'],
    [90, 'náhást’édiin'],
    [99, 'náhást’édiin dóó bi’aan náhást’éí'],
    [100, 't’ááłá’ídi neeznádiin'],
  ]);
  for (const [number, words] of specimens)
    assert.equal(representAmericanWords(BigInt(number), system).tokens[0].text, words);
  assert.match(representAmericanWords(56n, system).explanation, /50 \+ 6 = 56/);
  assert.match(representAmericanWords(12n, system).explanation, /2 \+ 10 = 12/);
});

test('both American spoken converters cover every integer from 1 through 100', () => {
  for (const id of ['choctaw', 'navajo']) {
    const system = getSystem(id)!;
    assert.equal(system.engine, 'spoken');
    assert.equal(system.min, '1');
    assert.equal(system.max, '100');
    for (let number = 1n; number <= 100n; number++) {
      const result = representAmericanWords(number, system);
      assert.equal(result.status, 'ok', `${id}: ${number}`);
      assert.equal(result.layout, 'words');
      assert.equal(result.tokens.length, 1);
      assert.ok(result.tokens[0].text);
      assert.ok(!result.tokens[0].text!.includes('undefined'));
      assert.equal(result.tokens[0].lang, id === 'choctaw' ? 'cho' : 'nv');
      assert.equal(result.unicode, result.tokens[0].text);
    }
    for (const example of system.examples)
      assert.equal(
        representAmericanWords(BigInt(example.value), system).tokens[0].text,
        example.words,
      );
    for (const number of [-1n, 0n, 101n, 10n ** 100n]) {
      const result = representAmericanWords(number, system);
      assert.equal(result.status, 'unsupported');
      assert.deepEqual(result.tokens, []);
      assert.match(result.reason!, /app limit/);
    }
  }
});

test('dictionaries describe the actual converter forms and reject unrelated systems', () => {
  const choctaw = americanWordDictionary(getSystem('choctaw')!);
  const navajo = americanWordDictionary(getSystem('navajo')!);
  for (const words of [choctaw, navajo])
    assert.ok(words.every((entry) => entry.word && entry.meaning));
  assert.ok(choctaw.some((entry) => entry.word === 'awah'));
  assert.ok(choctaw.some((entry) => entry.word === 'akocha'));
  assert.ok(choctaw.some((entry) => entry.word === 'pokoli tahlapi'));
  assert.ok(navajo.some((entry) => entry.word === 'dį́į́’'));
  assert.ok(navajo.some((entry) => entry.word === 'hastą́ą́'));
  assert.ok(navajo.some((entry) => entry.word === 'hastą́diin'));
  assert.ok(navajo.some((entry) => entry.word === 'ła’'));
  assert.ok(navajo.some((entry) => entry.word === 'dóó bi’aan'));
  assert.deepEqual(americanWordDictionary(getSystem('roman')!), []);
  assert.deepEqual(americanWordDictionary(getSystem('cherokee')!), []);
  assert.equal(representAmericanWords(56n, getSystem('roman')!).status, 'unsupported');
});
