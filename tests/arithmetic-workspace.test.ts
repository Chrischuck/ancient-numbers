import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderArithmeticWorkspace } from '../src/lib/arithmetic-workspace';

test('suanpan keeps two upper and five lower beads with normalized five/one values', () => {
  const html = renderArithmeticWorkspace({
    kind: 'suanpan',
    value: '579',
    caption: 'Use the beam.',
  });
  assert.equal((html.match(/data-part="upper"/g) ?? []).length, 6);
  assert.equal((html.match(/data-part="lower"/g) ?? []).length, 15);
  assert.equal((html.match(/is-active" data-part="upper"/g) ?? []).length, 3);
  assert.equal((html.match(/is-active" data-part="lower"/g) ?? []).length, 6);
  assert.match(html, /hundreds: 5, 1 active upper five-bead and 0 active lower one-beads/);
  assert.match(html, /ones: 9, 1 active upper five-bead and 4 active lower one-beads/);
  assert.match(html, /role="img" aria-label=/);
  assert.match(html, /touching the middle beam/);
});

test('before and after identify exactly the changed places across a decimal carry', () => {
  const html = renderArithmeticWorkspace({
    kind: 'suanpan',
    previous: '49',
    value: '50',
    caption: 'Carry a ten.',
  });
  assert.match(html, /data-state="before"/);
  assert.match(html, /data-state="after"/);
  assert.equal((html.match(/data-changed="true"/g) ?? []).length, 4);
  assert.equal((html.match(/data-changed="false"/g) ?? []).length, 2);
  assert.match(html, /Before: Chinese suanpan showing 49/);
  assert.match(html, /After: Chinese suanpan showing 50/);
});

test('Iñupiaq abacus has three upper and four lower beads in base-twenty places', () => {
  const html = renderArithmeticWorkspace({
    kind: 'inupiaq-abacus',
    value: '399',
    caption: 'Nineteen scores and nineteen ones.',
    radix: 20,
  });
  assert.equal((html.match(/data-part="upper"/g) ?? []).length, 9);
  assert.equal((html.match(/data-part="lower"/g) ?? []).length, 12);
  assert.equal((html.match(/is-active" data-part="upper"/g) ?? []).length, 6);
  assert.equal((html.match(/is-active" data-part="lower"/g) ?? []).length, 8);
  assert.match(html, /data-radix="20"/);
  assert.match(
    html,
    /twenties: digit 19, 3 active upper beads worth 100 each and 4 active lower beads worth 20 each/,
  );
  assert.match(
    html,
    /ones: digit 19, 3 active upper beads worth 5 each and 4 active lower beads worth 1 each/,
  );
  assert.match(html, />400<\/text>/);
  assert.match(html, />20<\/text>/);
  assert.match(html, /documented three-upper, four-lower bead arrangement/);
  assert.doesNotMatch(html, /Chinese suanpan|Two upper beads and five lower/);
  const carry = renderArithmeticWorkspace({
    kind: 'inupiaq-abacus',
    previous: '399',
    value: '400',
    caption: 'Carry one four-hundred.',
  });
  assert.equal((carry.match(/data-changed="true"/g) ?? []).length, 6);
  assert.match(carry, /four-hundreds: digit 1/);
});

test('counter and kernel workspaces identify their reconstruction scope', () => {
  const counters = renderArithmeticWorkspace({
    kind: 'counter-board',
    value: '68',
    caption: 'Move counters.',
  });
  assert.match(counters, /Teaching reconstruction/);
  assert.equal((counters.match(/is-active" data-part="five-counter"/g) ?? []).length, 2);
  assert.equal((counters.match(/is-active" data-part="one-counter"/g) ?? []).length, 4);
  const kernels = renderArithmeticWorkspace({
    kind: 'yupana',
    value: '9',
    caption: 'Count kernels.',
  });
  assert.match(kernels, /does not assert an original yupana layout or historical cell weights/);
  assert.equal((kernels.match(/data-part="kernel"/g) ?? []).length, 30);
  assert.equal((kernels.match(/is-active" data-part="kernel"/g) ?? []).length, 9);
});

test('written workspace uses digits and place labels without drawing an abacus', () => {
  const html = renderArithmeticWorkspace({
    kind: 'written',
    previous: '9',
    value: '10',
    caption: 'Write the quantity.',
  });
  assert.match(html, /Each box holds a working digit at its labeled place value/);
  assert.match(html, /workspace-written-digit/);
  assert.doesNotMatch(html, /workspace-rod|data-part="upper"|data-part="kernel"/);
  assert.match(html, />100<\/text>/);
  assert.match(html, />10<\/text>/);
  assert.match(html, />1<\/text>/);
});

test('captions are escaped and invalid or oversized values remain bounded', () => {
  const caption = '<img src=x onerror="alert(1)">&';
  const html = renderArithmeticWorkspace({ kind: 'suanpan', value: '7', caption });
  assert.match(html, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;&amp;/);
  assert.doesNotMatch(html, /<img/);
  for (const value of ['', '-1', '1/2', 'NaN', '1'.repeat(19), '<svg>']) {
    const invalid = renderArithmeticWorkspace({ kind: 'suanpan', value, caption });
    assert.match(invalid, /up to 18 digits/);
    assert.doesNotMatch(invalid, /<svg/);
  }
  const valid = renderArithmeticWorkspace({
    kind: 'suanpan',
    value: '999999999999999999',
    caption: 'Large exact value.',
  });
  assert.match(valid, /999,999,999,999,999,999/);
  assert.equal((valid.match(/data-place=/g) ?? []).length, 18);
  assert.ok(valid.length < 50_000);
  const invalidPrevious = renderArithmeticWorkspace({
    kind: 'written',
    previous: '-1',
    value: '10',
    caption: 'Keep the current state.',
  });
  assert.match(invalidPrevious, /earlier state is outside/);
  assert.match(invalidPrevious, /data-state="state"/);
  assert.doesNotMatch(invalidPrevious, /data-state="before"/);
  assert.match(
    renderArithmeticWorkspace({ kind: 'suanpan', value: '10', caption: '', radix: 60 }),
    /up to 18 digits/,
  );
});
