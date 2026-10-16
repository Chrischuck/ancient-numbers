import test from 'node:test';
import assert from 'node:assert/strict';
import { representPolynesianWords, polynesianWordDictionary } from '../src/lib/spoken-polynesian';
import { getSystem } from '../src/data/systems';

const text = (id: string, value: number) =>
  representPolynesianWords(BigInt(value), getSystem(id)!).tokens[0]?.text;

test('Māori productive counting follows published tens and expanded date examples', () => {
  const examples = new Map([
    [0, 'kore'],
    [1, 'tahi'],
    [11, 'tekau mā tahi'],
    [20, 'rua tekau'],
    [21, 'rua tekau mā tahi'],
    [56, 'rima tekau mā ono'],
    [99, 'iwa tekau mā iwa'],
    [100, 'kotahi rau'],
    [101, 'kotahi rau mā tahi'],
    [200, 'rua rau'],
    [1000, 'kotahi mano'],
    [1988, 'kotahi mano iwa rau waru tekau mā waru'],
    [2001, 'rua mano mā tahi'],
    [2011, 'rua mano tekau mā tahi'],
    [6007, 'ono mano mā whitu'],
  ]);
  for (const [value, word] of examples) assert.equal(text('maori', value), word);
  for (let value = 0; value <= 9999; value++) assert.ok(text('maori', value), String(value));
  assert.equal(representPolynesianWords(10000n, getSystem('maori')!).status, 'unsupported');
});

test('Hawaiian uses the documented decimal formula and distinguishes object groups', () => {
  const examples = new Map([
    [0, 'ʻole'],
    [1, 'kahi'],
    [4, 'hā'],
    [10, 'ʻumi'],
    [11, 'ʻumi-kūmā-kahi'],
    [20, 'iwakālua'],
    [21, 'iwakālua-kūmā-kahi'],
    [29, 'iwakālua-kūmā-iwa'],
    [30, 'kanakolu'],
    [40, 'kanahā'],
    [56, 'kanalima-kūmā-ono'],
    [80, 'kanawalu'],
    [99, 'kanaiwa-kūmā-iwa'],
    [100, 'hoʻokahi haneli'],
  ]);
  for (const [value, word] of examples) assert.equal(text('hawaiian', value), word);
  for (let value = 0; value <= 100; value++) assert.ok(text('hawaiian', value), String(value));
  for (const value of [-1n, 101n, 10n ** 100n])
    assert.equal(representPolynesianWords(value, getSystem('hawaiian')!).status, 'unsupported');
  assert.match(representPolynesianWords(56n, getSystem('hawaiian')!).explanation, /50 \+ 6 = 56/);
  const groups = polynesianWordDictionary(getSystem('hawaiian')!).filter((entry) =>
    ['kāuna', 'kaʻau', 'lau', 'mano'].includes(entry.word),
  );
  assert.equal(groups.length, 4);
  assert.ok(groups.every((entry) => entry.meaning.includes('traditional')));
});
