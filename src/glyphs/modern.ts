import type { GlyphSet } from '../lib/types';

// Original geometric drawings of the modern 0–9/A–F alphabet.
const paths = [
  'M50 18C20 18 20 82 50 82S80 18 50 18Z',
  'M34 31L50 18V82M34 82H66',
  'M25 32C27 12 74 12 75 33C76 49 54 60 25 82H76',
  'M26 26C44 11 75 17 75 34C75 45 64 50 48 50M48 50C66 50 77 56 77 68C77 85 44 91 25 76',
  'M65 82V18L23 62H79',
  'M74 18H29L26 49C45 38 76 45 76 64C76 86 44 91 26 77',
  'M72 23C47 7 25 30 25 59C25 90 76 91 76 63C76 39 42 36 26 57',
  'M24 18H78L39 82',
  'M50 18C19 18 19 49 50 49S81 18 50 18ZM50 49C16 49 16 82 50 82S84 49 50 49Z',
  'M74 43C57 66 24 60 24 37C24 10 75 10 75 41C75 70 53 93 28 77',
  'M18 82L50 18L82 82M31 59H69',
  'M27 18V82H54C82 82 82 51 54 51H27M27 18H52C79 18 79 51 52 51',
  'M78 26C62 10 23 17 23 50S62 90 78 74',
  'M25 18V82H45C85 82 85 18 45 18Z',
  'M76 18H26V82H76M26 49H65',
  'M76 18H26V82M26 49H65',
];

export const modernGlyphs: GlyphSet = Object.fromEntries(
  paths.map((d, value) => {
    const character = value.toString(16).toUpperCase();
    return [
      `modern-${value}`,
      {
        label: `Modern digit ${character}${value >= 10 ? ` (${value})` : ''}`,
        paths: [{ d }],
        unicode: character,
        source: 'https://spaceplace.nasa.gov/binary-code3/en/',
        provenance: 'original' as const,
      },
    ];
  }),
);
