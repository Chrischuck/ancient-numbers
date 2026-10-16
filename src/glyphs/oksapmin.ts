import type { GlyphSet } from '../lib/types';
import { oksapminPositions } from '../lib/pacific-counts';

export const oksapminSource = 'https://culturecognition.com/new-page-3';

// Original modern teaching outline. The highlighted anatomical point follows
// the researcher's sequence; neither the outline nor the dot is a written numeral.
// First/other side are relative: either direction is possible in the practice.
const body =
  'M42 39 L42 32 C33 29 32 15 39 10 C45 5 55 5 61 10 C68 16 67 29 58 32 L58 39 M42 39 L33 43 L22 61 L12 43 M58 39 L67 43 L78 61 L88 43 M33 53 L33 88 M67 53 L67 88 M33 88 L67 88 M47 20 L46 26 L50 26 M40 19 L42 19 M58 19 L60 19';
const hands =
  'M12 43 L7 37 L4 28 M7 37 L5 22 M9 36 L9 19 M12 36 L13 22 M15 38 L18 29 M88 43 L93 37 L96 28 M93 37 L95 22 M91 36 L91 19 M88 36 L87 22 M85 38 L82 29';

export const oksapminGlyphs: GlyphSet = Object.fromEntries(
  oksapminPositions.map(({ value, part, x, y }) => [
    `oksapmin-${value}`,
    {
      label: `Modern Oksapmin body-count diagram: ${part}, position ${value}`,
      paths: [
        { d: body, weight: 2.2 },
        { d: hands, weight: 2.2 },
        { d: `M${x - 3.5} ${y} a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0`, fill: true },
      ],
      source: oksapminSource,
      provenance: 'original' as const,
    },
  ]),
);
