import type { GlyphDefinition, GlyphSet, GlyphPath } from '../lib/types';
const kaktovikSource = 'https://www.unicode.org/L2/L2021/21058-kaktovik-numerals.pdf';
const mayaSource = 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-22/';
const greekSource = 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-22/';
export const coreGlyphs: GlyphSet = {};
const add = (
  id: string,
  label: string,
  d: string,
  source: string,
  unicode?: string,
  fill = false,
) => {
  coreGlyphs[id] = { label, paths: [{ d, fill }], source, unicode, provenance: 'original' };
};
const circle = (x: number, y: number, r: number) =>
  `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 -${r * 2} 0`;
for (let n = 0; n < 20; n++) {
  const f = Math.floor(n / 5),
    u = n % 5;
  const top = ['', 'M75 32L25 44', 'M25 20L75 32L25 44', 'M75 8L25 20L75 32L25 44'][f];
  const bottom = [
    '',
    'M25 44L45 88',
    'M25 44L50 88L75 44',
    'M25 44L42 88L50 52L72 88',
    'M25 44L40 88L55 49L70 88L85 44',
  ][u];
  const zero = 'M40 52L61 66C74 80 41 89 42 72C42 61 57 60 64 52';
  add(
    `kaktovik-${n}`,
    `Kaktovik ${n}`,
    n === 0 ? zero : top + bottom,
    kaktovikSource,
    String.fromCodePoint(0x1d2c0 + n),
  );
  const bars = Math.floor(n / 5),
    dots = n % 5;
  const paths: GlyphPath[] = [];
  if (n === 0)
    paths.push({
      d: 'M21 53C24 32 76 32 79 53C76 76 24 76 21 53ZM22 53C38 46 62 46 78 53M37 54L33 64M50 52V68M63 54L67 64',
    });
  else {
    const barTop = bars ? 70 - (bars - 1) * 13 : 58;
    for (let b = 0; b < bars; b++) paths.push({ d: `M25 ${70 - b * 13}H75`, weight: 5 });
    for (let d = 0; d < dots; d++)
      paths.push({
        d: circle(50 + (d - (dots - 1) / 2) * 14, barTop - (bars ? 16 : 0), 3.8),
        fill: true,
      });
  }
  coreGlyphs[`maya-${n}`] = {
    label: `Maya ${n}`,
    paths,
    source: mayaSource,
    unicode: String.fromCodePoint(0x1d2e0 + n),
    provenance: 'original',
  };
}
const latin: Record<string, string> = {
  I: 'M50 18V82M37 18H63M37 82H63',
  V: 'M22 18L50 82L78 18',
  X: 'M24 18L76 82M76 18L24 82',
  L: 'M29 18V82H77',
  C: 'M78 26C62 10 23 17 23 50S62 90 78 74',
  D: 'M25 18V82H45C85 82 85 18 45 18Z',
  M: 'M17 82V18L50 63L83 18V82',
};
for (const [letter, d] of Object.entries(latin))
  add(`roman-${letter}`, `Roman ${letter}`, d, greekSource, letter);
const greek: Record<string, string> = {
  Α: 'M18 82L50 18L82 82M31 59H69',
  Β: 'M27 18V82H54C82 82 82 51 54 51H27M27 18H52C79 18 79 51 52 51',
  Γ: 'M28 82V18H78',
  Δ: 'M18 82L50 18L82 82Z',
  Ε: 'M76 18H26V82H76M26 49H65',
  Ϛ: 'M74 24C62 12 28 16 28 39C28 57 59 43 59 64C59 79 44 82 35 79',
  Ζ: 'M24 18H77L24 82H77',
  Η: 'M25 18V82M75 18V82M25 50H75',
  Θ: 'M50 18C13 18 13 82 50 82S87 18 50 18ZM28 50H72',
  Ι: 'M50 18V82M36 18H64M36 82H64',
  Κ: 'M26 18V82M77 18L28 53L77 82',
  Λ: 'M19 82L50 18L81 82',
  Μ: 'M17 82V18L50 63L83 18V82',
  Ν: 'M25 82V18L75 82V18',
  Ξ: 'M24 18H76M30 50H70M24 82H76',
  Ο: 'M50 18C13 18 13 82 50 82S87 18 50 18Z',
  Π: 'M25 82V18H75V82',
  Ϟ: 'M64 18L36 47H62L42 82',
  Ρ: 'M27 82V18H53C85 18 85 52 53 52H27',
  Σ: 'M77 18H24L51 50L24 82H77',
  Τ: 'M19 18H81M50 18V82',
  Υ: 'M20 18L50 49L80 18M50 49V82',
  Φ: 'M50 13V87M50 27C12 27 12 73 50 73S88 27 50 27Z',
  Χ: 'M23 18L77 82M77 18L23 82',
  Ψ: 'M50 15V85M20 22V39C20 64 80 64 80 39V22',
  Ω: 'M20 82H40V72C8 61 19 18 50 18S92 61 60 72V82H80',
  Ϡ: 'M18 28C40 7 79 29 79 60C79 75 75 84 69 90M36 21V51M59 80V55C59 42 65 35 73 35',
};
const letters = [
  'Α',
  'Β',
  'Γ',
  'Δ',
  'Ε',
  'Ϛ',
  'Ζ',
  'Η',
  'Θ',
  'Ι',
  'Κ',
  'Λ',
  'Μ',
  'Ν',
  'Ξ',
  'Ο',
  'Π',
  'Ϟ',
  'Ρ',
  'Σ',
  'Τ',
  'Υ',
  'Φ',
  'Χ',
  'Ψ',
  'Ω',
  'Ϡ',
];
letters.forEach((letter, i) =>
  add(
    `greek-${i < 9 ? i + 1 : i < 18 ? (i - 8) * 10 : (i - 17) * 100}`,
    `Greek ${letter}`,
    greek[letter],
    greekSource,
    letter,
  ),
);
add('greek-mark', 'Greek numeral sign', 'M52 17L46 31', greekSource, 'ʹ');
const attic: Record<number, string> = {
  1: latin.I,
  5: 'M28 82V18H73V39',
  10: greek.Δ,
  100: greek.Η,
  1000: greek.Χ,
  10000: greek.Μ,
};
for (const [v, d] of Object.entries(attic))
  add(
    `attic-${v}`,
    `Attic ${v}`,
    d,
    greekSource,
    { 1: 'Ι', 5: '𐅃', 10: 'Δ', 100: 'Η', 1000: 'Χ', 10000: 'Μ' }[Number(v)],
  );
for (const [value, inner, cp] of [
  [50, 'M40 64L51 37L64 64Z', 0x10144],
  [500, 'M40 36V65M63 36V65M40 50H63', 0x10145],
  [5000, 'M40 36L63 65M63 36L40 65', 0x10146],
  [50000, 'M36 65V36L51 57L66 36V65', 0x10147],
] as const)
  add(
    `attic-${value}`,
    `Attic ${value}`,
    'M24 82V18H78V38' + inner,
    greekSource,
    String.fromCodePoint(cp),
  );
// Vertical-staff variant: one upper-right quadrant, reflected for other places.
export const cistercianSegments: Record<number, string> = {
  1: 'M50 16H81',
  2: 'M50 39H81',
  3: 'M50 16L81 39',
  4: 'M50 39L81 16',
  5: 'M50 16H81L50 39',
  6: 'M81 16V39',
  7: 'M50 16H81V39',
  8: 'M50 39H81V16',
  9: 'M50 16H81V39H50',
};
export function cistercianGlyph(n: number): GlyphDefinition {
  const parts: GlyphPath[] = [{ d: 'M50 16V84' }];
  const digits = String(n).padStart(4, '0').split('').reverse().map(Number);
  digits.forEach((d, i) => {
    if (!d) return;
    // H and V require reflecting their scalar coordinate too, handled using explicit lines below.
    const coords: Record<number, number[][][]> = {
      1: [
        [
          [50, 16],
          [81, 16],
        ],
      ],
      2: [
        [
          [50, 39],
          [81, 39],
        ],
      ],
      3: [
        [
          [50, 16],
          [81, 39],
        ],
      ],
      4: [
        [
          [50, 39],
          [81, 16],
        ],
      ],
      5: [
        [
          [50, 16],
          [81, 16],
          [50, 39],
        ],
      ],
      6: [
        [
          [81, 16],
          [81, 39],
        ],
      ],
      7: [
        [
          [50, 16],
          [81, 16],
          [81, 39],
        ],
      ],
      8: [
        [
          [50, 39],
          [81, 39],
          [81, 16],
        ],
      ],
      9: [
        [
          [50, 16],
          [81, 16],
          [81, 39],
          [50, 39],
        ],
      ],
    };
    parts.push({
      d: coords[d]
        .map((line) =>
          line
            .map(([x, y], j) => `${j ? 'L' : 'M'}${i % 2 ? 100 - x : x} ${i >= 2 ? 100 - y : y}`)
            .join(''),
        )
        .join(''),
    });
  });
  return {
    label: `Cistercian ${n}`,
    paths: parts,
    source: 'https://books.google.com/books?id=PapljPXaSbwC',
    provenance: 'original',
  };
}
const mexicaSource = 'https://blogs.uoregon.edu/nahuaglyphs/numbers/';
add('mexica-1', 'Mexica unit dot', circle(50, 52, 6), mexicaSource, undefined, true);
add(
  'mexica-20',
  'Mexica flag, twenty',
  'M29 85V16H76V53H29M39 19V50M48 19V50M57 19V50M66 19V50',
  mexicaSource,
);
add(
  'mexica-400',
  'Mexica feather, four hundred',
  'M46 88L57 17M51 68C24 64 25 23 57 14C85 29 83 58 51 68M52 57L37 39M55 43L66 33M48 76L37 74',
  mexicaSource,
);
add(
  'mexica-8000',
  'Mexica bag, eight thousand',
  'M34 37C28 50 21 70 32 80C42 91 68 90 78 76C86 61 72 45 65 37ZM35 37L31 25L44 29L48 17L56 29L71 24L65 37M35 43H65M36 53L65 75M63 52L38 76',
  mexicaSource,
);
const knotSource = 'https://smarthistory.org/inka-khipu/';
for (let n = 0; n <= 9; n++) {
  const higher: GlyphPath[] = [{ d: 'M50 6V94', weight: 2.5 }];
  for (let i = 0; i < n; i++) {
    const y = 15 + (n > 1 ? (i * 68) / (n - 1) : 35);
    higher.push({
      d: `M48 ${y - 3}C30 ${y - 8} 34 ${y + 8} 52 ${y + 3}C68 ${y - 1} 56 ${y - 9} 48 ${y - 3}`,
      weight: 3.2,
    });
  }
  coreGlyphs[`khipu-knots-${n}`] = {
    label: `${n} single overhand knots`,
    paths: higher,
    source: knotSource,
    provenance: 'original',
  };
  const units: GlyphPath[] = [{ d: 'M50 6V94', weight: 2.5 }];
  if (n === 1)
    units.push({ d: 'M50 35C25 18 24 57 50 51C75 45 74 83 50 67C26 49 74 53 50 35', weight: 3.2 });
  else if (n > 1)
    for (let i = 0; i < n; i++) {
      const y = 27 + i * 5.5;
      units.push({
        d: `M45 ${y}C30 ${y - 4} 30 ${y + 5} 48 ${y + 5}C68 ${y + 5} 68 ${y - 4} 52 ${y - 2}`,
        weight: 2.7,
      });
    }
  coreGlyphs[`khipu-units-${n}`] = {
    label:
      n === 0
        ? 'Empty units position'
        : n === 1
          ? 'Figure-eight knot, one'
          : `Long knot with ${n} turns`,
    paths: units,
    source: knotSource,
    provenance: 'original',
  };
}
