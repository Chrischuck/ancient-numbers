import test from 'node:test';
import assert from 'node:assert/strict';
import { systems, getSystem } from '../src/data/systems';
import { representYoruba, spokenDictionary, yorubaConstruction } from '../src/lib/spoken';

test('every spoken tradition has a vocabulary dictionary and preserves language spelling', () => {
  for (const system of systems.filter((s) => s.structure === 'Spoken' || s.id === 'mangarevan')) {
    const dictionary = spokenDictionary(system);
    assert.ok(dictionary.length >= 4, system.id);
    assert.ok(
      dictionary.every((entry) => entry.word && entry.meaning),
      system.id,
    );
  }
  assert.ok(spokenDictionary(getSystem('choctaw')!).some((e) => e.word === 'achʋffa'));
  assert.ok(spokenDictionary(getSystem('maori')!).some((e) => e.word === 'whā'));
  assert.ok(spokenDictionary(getSystem('hawaiian')!).some((e) => e.word === 'kaʻau'));
  const mangarevan = spokenDictionary(getSystem('mangarevan')!).filter((e) => e.word === 'varu');
  assert.equal(mangarevan.length, 2);
  assert.equal(mangarevan[0].meaning, '8');
  assert.match(mangarevan[1].meaning, /80/);
  assert.deepEqual(spokenDictionary(getSystem('roman')!), []);
});

test('Yorùbá names expose additive and subtractive boundaries including nested anchors', () => {
  const expected = new Map<number, string>([
    [1, '1'],
    [10, '10'],
    [11, '10 + 1 = 11'],
    [14, '10 + 4 = 14'],
    [15, '20 − 5 = 15'],
    [19, '20 − 1 = 19'],
    [20, '20'],
    [24, '20 + 4 = 24'],
    [25, '30 − 5 = 25'],
    [30, '30'],
    [35, '2 × 20 − 5 = 35'],
    [40, '2 × 20 = 40'],
    [45, '(3 × 20 − 10) − 5 = 45'],
    [50, '3 × 20 − 10 = 50'],
    [54, '(3 × 20 − 10) + 4 = 54'],
    [55, '3 × 20 − 5 = 55'],
    [56, '3 × 20 − 4 = 56'],
    [60, '3 × 20 = 60'],
    [70, '4 × 20 − 10 = 70'],
    [80, '4 × 20 = 80'],
    [90, '5 × 20 − 10 = 90'],
    [99, '5 × 20 − 1 = 99'],
    [100, '5 × 20 = 100'],
  ]);
  for (const [value, construction] of expected)
    assert.equal(yorubaConstruction(BigInt(value)), construction);
  // 54 is not conventionally named by directly subtracting six from sixty.
  assert.notEqual(yorubaConstruction(54n), '60 − 6 = 54');
});

test('bounded Yoruba display keeps attested words and labels expanded forms honestly', () => {
  assert.equal(representYoruba(15n).tokens[0].text, 'Ẹ́ẹ̀dógún');
  assert.equal(representYoruba(54n).tokens[0].text, 'ẹ̀rin leládọ́ta');
  assert.equal(representYoruba(56n).tokens[0].text, 'ẹ̀rin dílọgọ́ta');
  assert.equal(representYoruba(62n).tokens[0].text, 'Èjì · lé · ní · Ọgọ́ta');
  assert.match(representYoruba(62n).explanation, /not a standard written compound/);
  assert.equal(representYoruba(58n).tokens[0].text, 'Èjì · dín · ní · Ọgọ́ta');
  for (let value = 1n; value <= 100n; value++) {
    const representation = representYoruba(value);
    assert.equal(representation.status, 'ok', String(value));
    assert.ok(representation.tokens[0].text);
    assert.ok(!representation.tokens[0].text.includes('undefined'), String(value));
  }
  for (const value of [-1n, 0n, 101n, 10n ** 100n]) {
    assert.equal(yorubaConstruction(value), undefined);
    assert.equal(representYoruba(value).status, 'unsupported');
    assert.deepEqual(representYoruba(value).tokens, []);
  }
});
