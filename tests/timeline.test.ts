import test from 'node:test';
import assert from 'node:assert/strict';
import { timeline } from '../src/data/timeline';
import { systems, getSystem } from '../src/data/systems';

test('timeline has sourced, ordered events and explicit period semantics', () => {
  assert.ok(timeline.length >= 40);
  assert.equal(new Set(timeline.map((entry) => entry.id)).size, timeline.length);
  for (const [index, entry] of timeline.entries()) {
    if (entry.year === null) {
      assert.equal(entry.kind, 'numerals');
      assert.equal(entry.date, 'Origin unknown');
      assert.equal(entry.end, undefined);
    } else {
      assert.ok(Number.isInteger(entry.year) && entry.year !== 0, entry.id);
      assert.ok(entry.year >= -3000 && entry.year <= 2026, entry.id);
      if (index) assert.ok((timeline[index - 1].year ?? Infinity) <= entry.year, entry.id);
    }
    assert.ok(entry.sources.length > 0, entry.id);
    for (const source of entry.sources) assert.equal(new URL(source.url).protocol, 'https:');
    if (entry.system) assert.ok(getSystem(entry.system), entry.id);
    if (entry.end !== undefined) {
      assert.ok(entry.year !== null && entry.end > entry.year, entry.id);
      assert.equal(entry.status, 'historical', entry.id);
      assert.match(entry.detail, /period|span|window/, entry.id);
    }
    if (entry.kind === 'milestone') assert.equal(entry.status, 'event', entry.id);
  }
});

test('every supported system has exactly one linked timeline entry', () => {
  for (const system of systems) {
    const entries = timeline.filter((entry) => entry.system === system.id);
    assert.equal(entries.length, 1, system.id);
    assert.equal(entries[0].kind, 'numerals', system.id);
  }
});
