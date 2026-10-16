import type { GlyphDefinition, GlyphSet } from '../lib/types';

const cherokeeSource =
  'https://language.cherokee.gov/media/541f3lhk/sequoyah_original_numbers_updated.pdf';

// Original vector geometry; defining forms checked against the community chart.
// These are dedicated numeric signs, not characters from the Cherokee syllabary.
const cherokee = (label: string, d: string): GlyphDefinition => ({
  label,
  paths: [{ d }],
  source: cherokeeSource,
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
};
