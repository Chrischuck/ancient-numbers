import { bedeTensRules, bedeUnitRules } from '../data/gestures';
import type { Representation, SystemDefinition } from './types';

const unsupported = (reason: string): Representation => ({
  status: 'unsupported',
  tokens: [],
  layout: 'row',
  explanation: reason,
  reason,
});

export function representGesture(n: bigint, system: SystemDefinition): Representation {
  if (system.id === 'medieval-finger-counting') {
    if (n < 1n || n > 9999n)
      return unsupported(
        'Bede’s hand-only display here covers whole numbers from 1 to 9,999. Larger values in his text involve the body; no zero sign is supplied.',
      );
    const left = Number(n % 100n);
    const right = Number(n / 100n);
    const u = left % 10;
    const t = Math.floor(left / 10);
    const h = right % 10;
    const k = Math.floor(right / 10);
    const contributions = [k * 1000, h * 100, t * 10, u].filter(Boolean);
    const tokens = [
      ...(t
        ? [
            {
              glyph: `hand-bede-left-${t * 10}`,
              label: `Signer’s left thumb/index: ${t * 10}; ${bedeTensRules[t]}`,
            },
          ]
        : []),
      ...(u
        ? [
            {
              glyph: `hand-bede-left-${u}`,
              label: `Signer’s left outer fingers: ${u}; ${bedeUnitRules[u]}`,
            },
          ]
        : []),
      ...(h
        ? [
            {
              glyph: `hand-bede-right-${h}`,
              label: `Signer’s right thumb/index: ${h * 100}; repeat the ${h * 10} shape.`,
            },
          ]
        : []),
      ...(k
        ? [
            {
              glyph: `hand-bede-right-${k * 10}`,
              label: `Signer’s right outer fingers: ${k * 1000}; repeat the ${k} shape.`,
            },
          ]
        : []),
    ];
    return {
      status: 'ok',
      tokens,
      layout: 'row',
      explanation: `${n} = ${contributions.join(' + ')}. ${left ? `Left hand: ${t * 10} + ${u}. ` : ''}${right ? `Right hand: ${k * 1000} + ${h * 100}. ` : ''}The woodcut shows each place-value group separately; combine the groups on each hand. In Bede’s arrangement, right thumb/index means hundreds and the other three right fingers mean thousands.`,
    };
  }
  if (system.id === 'cistercian-gestures') {
    if (n < 1n || n > 10n)
      return unsupported(
        'The selected La Trappe witness describes showing one finger per hour. This converter illustrates 1–10 only; it supplies no invented rule for larger values or an independent zero sign.',
      );
    const first = Number(n > 5n ? 5n : n);
    const second = Number(n > 5n ? n - 5n : 0n);
    return {
      status: 'ok',
      layout: 'row',
      tokens: [
        {
          glyph: `hand-trappist-left-${first}`,
          label: `${first} extended fingers on the first hand`,
        },
        ...(second
          ? [
              {
                glyph: `hand-trappist-right-${second}`,
                label: `${second} extended fingers on the second hand`,
              },
            ]
          : []),
      ],
      explanation: `${n} ${n === 1n ? 'hour' : 'hours'}: show ${n} ${n === 1n ? 'finger' : 'fingers'}${second ? ` (${first} + ${second})` : ''}. Du Bois’s 1824 La Trappe vocabulary gives the total, without specifying which fingers. The thumb-first engraved poses and hand order in these diagrams are illustrative. This is a time signal from a dated Trappist witness.`,
    };
  }
  return unsupported('No gesture converter is supplied for this system.');
}

export function gestureDictionary(system: SystemDefinition): { glyph: string; meaning: string }[] {
  if (system.id === 'medieval-finger-counting') {
    const entries: { glyph: string; meaning: string }[] = [];
    for (let n = 1; n <= 9; n++)
      entries.push({
        glyph: `hand-bede-left-${n}`,
        meaning: `${n} · left outer fingers. ${bedeUnitRules[n]}`,
      });
    for (let n = 1; n <= 9; n++)
      entries.push({
        glyph: `hand-bede-left-${n * 10}`,
        meaning: `${n * 10} · left thumb/index. ${bedeTensRules[n]}`,
      });
    for (let n = 1; n <= 9; n++)
      entries.push({
        glyph: `hand-bede-right-${n}`,
        meaning: `${n * 100} · right thumb/index: repeat the left-hand ${n * 10} shape.`,
      });
    for (let n = 1; n <= 9; n++)
      entries.push({
        glyph: `hand-bede-right-${n * 10}`,
        meaning: `${n * 1000} · right outer fingers: repeat the left-hand ${n} shape.`,
      });
    return entries;
  }
  if (system.id === 'cistercian-gestures')
    return [
      ...Array.from({ length: 5 }, (_, i) => ({
        glyph: `hand-trappist-left-${i + 1}`,
        meaning: `${i + 1} ${i === 0 ? 'hour' : 'hours'} · ${i + 1} extended ${i === 0 ? 'finger' : 'fingers'}. Finger selection is illustrative (La Trappe, 1824).`,
      })),
      {
        glyph: 'hand-trappist-right-5',
        meaning:
          '6–10 hours · add the needed fingers of a second hand. Ten uses both open hands. The source does not prescribe hand order.',
      },
      {
        glyph: 'hand-trappist-half',
        meaning:
          '½ hour · show half a finger (La Trappe, 1824). The bracket marks the portion for teaching; it is not a historical gesture component.',
      },
      {
        glyph: 'hand-trappist-quarter',
        meaning:
          '¼ hour · show one finger joint (La Trappe, 1824). The bracket marks the portion for teaching; it is not a historical gesture component.',
      },
      {
        glyph: 'hand-cistercian-count',
        meaning:
          'COUNT · indicate fingertips as if enumerating them. Loccum Latin list, entry 88, printed 1717; an action sign, not a cardinal numeral.',
      },
    ];
  return [];
}
