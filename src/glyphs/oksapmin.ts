import type { GlyphSet } from '../lib/types';
import { oksapminPositions } from '../lib/pacific-counts';

export const oksapminSource = 'https://culturecognition.com/new-page-3';

// Original modern teaching outline. The highlighted anatomical part follows
// the researcher's sequence; these close-ups are not written numerals.
// First/other side are relative: either direction is possible in the practice.
const body =
  'M42 39 L42 32 C33 29 32 15 39 10 C45 5 55 5 61 10 C68 16 67 29 58 32 L58 39 M42 39 L33 43 L22 61 L12 43 M58 39 L67 43 L78 61 L88 43 M33 53 L33 88 M67 53 L67 88 M33 88 L67 88 M47 20 L46 26 L50 26 M40 19 L42 19 M58 19 L60 19 M35 18 C30 16 31 27 36 27 M65 18 C70 16 69 27 64 27';
const hands =
  'M12 43 L7 37 L4 28 M7 37 L5 22 M9 36 L9 19 M12 36 L13 22 M15 38 L18 29 M88 43 L93 37 L96 28 M93 37 L95 22 M91 36 L91 19 M88 36 L87 22 M85 38 L82 29';

// Highlight a whole finger or anatomical segment, rather than relying on a
// nearly invisible dot on a miniature full-body outline.
const selectedParts = [
  'M15 38 L18 29',
  'M12 36 L13 22',
  'M9 36 L9 19',
  'M7 37 L5 22',
  'M7 37 L4 28',
  'M9 42 L15 44',
  'M12 43 L22 61',
  'M18 54 L22 61 L27 53',
  'M22 61 L33 43',
  'M29 49 L33 43 L39 40',
  'M42 32 L42 39',
  'M35 18 C30 16 31 27 36 27',
  'M40 19 L42 19',
  'M47 20 L46 26 L50 26',
  'M58 19 L60 19',
  'M65 18 C70 16 69 27 64 27',
  'M58 32 L58 39',
  'M61 40 L67 43 L71 49',
  'M67 43 L78 61',
  'M73 53 L78 61 L82 54',
  'M78 61 L88 43',
  'M85 44 L91 42',
  'M85 38 L82 29',
  'M88 36 L87 22',
  'M91 36 L91 19',
  'M93 37 L95 22',
  'M93 37 L96 28',
];

const focusBox = (value: number) => {
  if (value <= 5) return '-8 13 36 36';
  if (value <= 10) return '3 32 44 38';
  if (value <= 17) return '27 1 46 45';
  if (value <= 22) return '53 32 44 38';
  return '72 13 36 36';
};
const circle = (x: number, y: number, radius: number) =>
  `M${x - radius} ${y} a${radius} ${radius} 0 1 0 ${radius * 2} 0 a${radius} ${radius} 0 1 0 ${-radius * 2} 0`;
const highlight = 'var(--body-count-accent, #a84b34)';

export const oksapminGlyphs: GlyphSet = Object.fromEntries(
  oksapminPositions.map(({ value, part, x, y }) => [
    `oksapmin-${value}`,
    {
      label: `Modern Oksapmin body-count close-up: ${part}, position ${value}`,
      caption: `${value} · ${part}`,
      viewBox: focusBox(value),
      clip: true,
      paths: [
        { d: body, weight: 1.2, opacity: 0.4 },
        { d: hands, weight: 1.2, opacity: 0.4 },
        { d: selectedParts[value - 1], weight: 2.4, color: highlight },
        { d: circle(x, y, 3), weight: 0.7, color: highlight },
        { d: circle(x, y, 1.7), fill: true, color: highlight },
      ],
      source: oksapminSource,
      provenance: 'original' as const,
    },
  ]),
);
