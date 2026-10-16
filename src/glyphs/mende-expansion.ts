import type { GlyphPath, GlyphSet } from '../lib/types';

const mendeSource = 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/';

// Original centerline geometry, checked against the numeral chart. The compact
// form leaves room for an attached subscript; each group remains one SVG cell.
const mendeStrokes: Record<number, string[]> = {
  1: ['M50 18V82'],
  2: ['M77 23L18 73H79'],
  3: ['M20 82V18M20 44C20 70 49 70 50 44V18M50 44C50 70 79 70 79 44V18'],
  4: ['M22 30V44H79L23 81', 'M52 26C52 30 46 30 46 26C46 22 52 22 52 26Z'],
  5: ['M67 35C67 12 34 12 34 35C34 58 67 58 67 35ZM67 66C67 43 34 43 34 66C34 89 67 89 67 66Z'],
  6: ['M24 18C52 21 76 50 73 68C70 90 38 84 38 65C38 42 74 45 73 68'],
  7: ['M24 18C52 21 76 50 73 68C70 90 38 84 38 65C38 42 74 45 73 68M31 40L67 18'],
  8: [
    'M25 18C53 22 78 49 72 68C65 90 27 80 37 62C42 49 63 54 63 66',
    'M45 45C45 49 39 49 39 45C39 41 45 41 45 45Z',
  ],
  9: ['M37 82V33C37 9 66 10 66 32', 'M52 50C52 54 46 54 46 50C46 46 52 46 52 50Z'],
};

// These locally authored paths use only absolute M/L/H/V/C/Q/Z commands.
// Apply the same uniform coordinate change to all strokes, including dots.
function compactPath(d: string): string {
  let command = '',
    coordinate = 0;
  return d.replace(/[MLHVCQZ]|-?\d+(?:\.\d+)?/g, (part) => {
    if (/^[A-Z]$/.test(part)) {
      command = part;
      coordinate = 0;
      return part;
    }
    const x = command === 'H' || (command !== 'V' && coordinate++ % 2 === 0);
    return ` ${Number((Number(part) * 0.56 + (x ? 22 : 3)).toFixed(2))} `;
  });
}

export const mendeExpansionGlyphs: GlyphSet = {};
for (let digit = 1; digit <= 9; digit++) {
  const basePaths: GlyphPath[] = mendeStrokes[digit].map((d, i) => ({
    d,
    ...(i ? { fill: true } : {}),
  }));
  const character = String.fromCodePoint(0x1e8c6 + digit);
  mendeExpansionGlyphs[`mende-${digit}`] = {
    label: `Mende Kikakui ${digit}`,
    paths: basePaths,
    unicode: character,
    source: mendeSource,
    provenance: 'original',
  };
  for (const power of ['teens', 1, 2, 3, 4, 5, 6] as const) {
    const amount = power === 'teens' ? digit + 10 : digit * 10 ** power;
    let subscript: string;
    if (power === 'teens') subscript = 'M26 87L76 57';
    else if (power === 1) subscript = 'M57 57V89M57 58C30 53 29 75 57 72M74 56L39 90';
    else {
      const bars = Array.from(
        { length: power },
        (_, i) => `M${50 - (power - 1) * 5 + i * 10} 57V66`,
      ).join('');
      subscript = `${bars}M55 72V80C55 94 36 93 36 81V78`;
    }
    mendeExpansionGlyphs[`mende-group-${power}-${digit}`] = {
      label: `Mende Kikakui ${amount.toLocaleString('en-US')} · ${digit} with ${power === 'teens' ? 'teens' : (10 ** power).toLocaleString('en-US')} subscript`,
      paths: [
        ...basePaths.map((p) => ({ ...p, d: compactPath(p.d) })),
        { d: subscript, weight: 3.5 },
      ],
      unicode: character + String.fromCodePoint(power === 'teens' ? 0x1e8d0 : 0x1e8d0 + power),
      source: mendeSource,
      provenance: 'original',
    };
  }
}
