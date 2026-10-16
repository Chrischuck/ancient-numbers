import type { GlyphPath, GlyphSet } from '../lib/types';
import { oksapminPositions } from '../lib/pacific-counts';

export const oksapminSource = 'https://culturecognition.com/new-page-3';

// Original SVG geometry following the user's arm/face references: plain,
// rounded outlines, no anatomical shading. These illustrate body positions,
// not written Oksapmin numerals. Either starting side is possible.
const fingers = [
  'M123 89 C117 85 115 79 114 74 L109 61 C107 56 108 52 112 52 C118 51 122 60 125 64',
  'M125 64 L135 30 C137 23 143 23 145 27 L137 56',
  'M145 27 C147 21 154 23 155 29 L147 57',
  'M155 29 C158 25 165 29 165 35 L156 61',
  'M165 35 C168 31 175 35 174 41 L166 78 C164 88 158 95 154 101',
];
const palm = 'M137 56 Q147 57 156 61 M125 64 C130 70 133 77 132 82';
const arm =
  'M18 36 C41 39 53 45 61 65 L94 144 L123 89 M154 101 L133 151 C124 173 109 185 95 182 C74 177 57 158 41 134 M41 108 L41 182';
const hand = `M114 111 L123 89 ${fingers.join(' ')} ${palm} M154 101 L149 111`;
const head =
  'M59 88 C54 76 52 65 54 48 C56 23 74 10 98 10 C126 10 146 28 147 52 C148 67 144 80 138 88 M60 85 C61 70 63 52 74 46 C82 41 91 43 99 36 C107 43 116 41 125 47 C136 54 137 73 139 85 M99 19 L99 36 M61 80 C60 100 64 119 74 130 C82 139 91 143 99 143 C110 143 122 136 130 123 C138 111 139 94 138 80 M60 79 C50 71 49 85 54 95 L62 102 M139 79 C149 71 150 85 145 95 L137 102 M78 134 L77 144 C75 152 66 158 50 161 C31 165 21 171 18 188 M121 134 L122 144 C124 152 134 158 150 161 C168 165 178 173 182 188';
const features =
  'M69 72 Q79 65 90 71 M108 71 Q119 65 130 72 M69 83 Q80 76 90 83 Q80 88 69 83 M108 83 Q119 76 130 83 Q119 88 108 83 M94 104 Q99 108 104 104 M85 118 Q95 110 100 114 Q105 110 114 118 Q100 122 85 118 M91 124 Q100 128 109 124';
const circle = (x: number, y: number, r: number) =>
  `M${x - r} ${y} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;
const mirror = (d: string) =>
  d.replace(/(-?\d*\.?\d+)[ ,]+(-?\d*\.?\d+)/g, (_, x, y) => `${200 - Number(x)} ${y}`);
const accent = 'var(--body-count-accent, #a84b34)';

const fingerPoints = [
  [113, 59],
  [140, 33],
  [150, 31],
  [160, 36],
  [169, 43],
] as const;
const armPoints = [
  [140, 96],
  [128, 128],
  [101, 155],
  [70, 107],
  [44, 49],
] as const;
const facePoints = [
  [77, 148],
  [56, 89],
  [80, 83],
  [99, 104],
  [119, 83],
  [143, 89],
  [122, 148],
] as const;

function artwork(value: number): { paths: GlyphPath[]; viewBox: string } {
  const isHand = value <= 5 || value >= 23;
  const isFace = value >= 11 && value <= 17;
  // The first hand/arm sits on the viewer's left of the complete counting path.
  const flipped = value <= 10;
  const width = isHand ? 1.9 : isFace ? 3.1 : 4.2;
  const index = isHand
    ? value <= 5
      ? value - 1
      : value - 23
    : value <= 10
      ? value - 6
      : 22 - value;
  const [baseX, y] = isHand
    ? fingerPoints[index]
    : isFace
      ? facePoints[value - 11]
      : armPoints[index];
  const x = flipped ? 200 - baseX : baseX;
  const outline = isHand ? hand : isFace ? head : `${arm} ${fingers.join(' ')} ${palm}`;
  const paths: GlyphPath[] = [{ d: flipped ? mirror(outline) : outline, weight: width }];
  if (isFace) {
    paths.push({ d: features, weight: 2.7 });
    paths.push({ d: `${circle(80, 82, 2)} ${circle(119, 82, 2)}`, fill: true });
  }
  if (isHand)
    paths.push({
      d: flipped ? mirror(fingers[index]) : fingers[index],
      weight: width,
      color: accent,
    });
  const radius = isHand ? 1.9 : 3.5;
  paths.push(
    { d: circle(x, y, radius * 2.4), fill: true, color: accent, opacity: 0.17 },
    { d: circle(x, y, radius * 1.5), color: accent, weight: radius * 0.23 },
    { d: circle(x, y, radius), fill: true, color: accent },
  );
  return {
    paths,
    viewBox: isHand ? `${flipped ? 11 : 99} 15 90 105` : '0 0 200 200',
  };
}

export const oksapminGlyphs: GlyphSet = Object.fromEntries(
  oksapminPositions.map(({ value, part }) => [
    `oksapmin-${value}`,
    {
      label: `Modern Oksapmin body-count close-up: ${part}, position ${value}`,
      caption: `${value} · ${part}`,
      ...artwork(value),
      source: oksapminSource,
      provenance: 'original' as const,
    },
  ]),
);
