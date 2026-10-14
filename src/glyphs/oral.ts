import type { GlyphDefinition, GlyphSet } from '../lib/types';

const cherokeeSource =
  'https://language.cherokee.gov/media/541f3lhk/sequoyah_original_numbers_updated.pdf';
const oksapminSource = 'https://culturecognition.com/new-page-3';

// Original vector geometry; defining forms checked against the community chart.
// These are dedicated numeric signs, not characters from the Cherokee syllabary.
const cherokee = (label: string, d: string): GlyphDefinition => ({
  label,
  paths: [{ d }],
  source: cherokeeSource,
  provenance: 'original',
});

// Modern explanatory outline: not a claimed traditional graphic numeral.
// First and other side are relative; Saxe documents either direction of counting.
const body =
  'M42 39 L42 32 C33 29 32 15 39 10 C45 5 55 5 61 10 C68 16 67 29 58 32 L58 39 M42 39 L33 43 L22 61 L12 43 M58 39 L67 43 L78 61 L88 43 M33 53 L33 88 M67 53 L67 88 M33 88 L67 88 M47 20 L46 26 L50 26 M40 19 L42 19 M58 19 L60 19';
const hands =
  'M12 43 L7 37 L4 28 M7 37 L5 22 M9 36 L9 19 M12 36 L13 22 M15 38 L18 29 M88 43 L93 37 L96 28 M93 37 L95 22 M91 36 L91 19 M88 36 L87 22 M85 38 L82 29';
const diagram = (label: string, x: number, y: number): GlyphDefinition => ({
  label,
  paths: [
    { d: body, weight: 2.2 },
    { d: hands, weight: 2.2 },
    { d: `M${x - 3.5} ${y} a3.5 3.5 0 1 0 7 0 a3.5 3.5 0 1 0 -7 0`, fill: true },
  ],
  source: oksapminSource,
  provenance: 'original',
});

export const oralGlyphs: GlyphSet = {
  'cherokee-1': cherokee(
    'Sequoyah’s numerical sign for one',
    'M66 12 C61 33 48 61 29 88 M60 29 Q49 40 38 45',
  ),
  'cherokee-2': cherokee('Sequoyah’s numerical sign for two', 'M73 12 L26 88 L57 62 M73 12 L52 33'),
  'cherokee-3': cherokee(
    'Sequoyah’s numerical sign for three',
    'M65 12 L30 88 C39 65 50 43 57 49 C62 54 49 72 43 81 L68 51',
  ),
  'cherokee-40': cherokee(
    'Sequoyah’s numerical sign for forty',
    'M31 42 L56 14 C46 40 30 69 45 85 C59 98 82 83 74 70 C65 58 43 60 36 68',
  ),
  'oksapmin-1': diagram('Modern diagram: first thumb, position one', 18, 29),
  'oksapmin-14': diagram('Modern diagram: nose, position fourteen', 47, 25),
  'oksapmin-27': diagram('Modern diagram: other little finger, position twenty-seven', 96, 28),
};
