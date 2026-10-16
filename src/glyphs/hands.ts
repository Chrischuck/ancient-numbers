import type { GlyphDefinition, GlyphSet } from '../lib/types';
import { hourFigures, fingerDetail, countingPaths } from './cistercian-illustrations';
import { woodcutCells } from './bede-woodcut';

export const woodcutSource =
  'https://commons.wikimedia.org/wiki/File:Finger_numerals_1520-Bedan_system.svg';

export function bedeHandGlyph(hand: 'left' | 'right', groupValue: number): GlyphDefinition {
  if (!Number.isInteger(groupValue) || groupValue < 0 || groupValue > 99)
    throw new RangeError('A Bede hand group must be an integer from 0 to 99.');
  const value = hand === 'left' ? groupValue : groupValue * 100;
  const placeValues =
    hand === 'left'
      ? [Math.floor(groupValue / 10) * 10, groupValue % 10]
      : [(groupValue % 10) * 100, Math.floor(groupValue / 10) * 1000];
  const panels = placeValues.filter(Boolean).map((v) => woodcutCells[v]);
  // The woodcut supplies individual place-value poses, not 200 combined
  // configurations. Multiple groups remain separate, unchanged illustrations.
  const paths =
    panels.length < 2
      ? (panels[0]?.paths ?? [])
      : panels.flatMap((panel, i) => {
          const [x, y] = panel.viewBox.split(' ').map(Number);
          return panel.paths.map((path) => {
            let coordinate = 0;
            return {
              ...path,
              d: path.d.replace(/-?\d+(?:\.\d+)?/g, (number) => {
                const offset = coordinate++ % 2 === 0 ? i * 160 - x : -y;
                return String(Number((Number(number) + offset).toFixed(2)));
              }),
            };
          });
        });
  return {
    label: `Bede, signer’s ${hand} hand: ${value === 0 ? 'no contribution' : value.toLocaleString('en-US')}; original 1520 woodcut illustration`,
    paths,
    viewBox: panels.length < 2 ? (panels[0]?.viewBox ?? '0 0 100 100') : '0 0 320 180',
    source: woodcutSource,
    provenance: 'adapted',
    license: 'public-domain',
  };
}

export const handGlyphs: GlyphSet = {};
for (const hand of ['left', 'right'] as const) {
  for (let n = 0; n <= 99; n++) handGlyphs[`hand-bede-${hand}-${n}`] = bedeHandGlyph(hand, n);
}

// These existing engravings illustrate finger totals. They are not claimed
// to be historical depictions of Cistercian practice or its prescribed poses.
export const hourArtworkSource =
  'https://archive.org/details/encyclopaediabrit07chisrich/page/n917';
export const countArtworkSource = 'https://openclipart.org/detail/322626/counting-fingers-on-hand';
for (const hand of ['left', 'right'] as const) {
  for (let n = 1; n <= 5; n++) {
    const image = hourFigures[n];
    handGlyphs[`hand-trappist-${hand}-${n}`] = {
      label: `La Trappe hour rule: ${n} extended ${n === 1 ? 'finger' : 'fingers'}; existing 1911 engraving illustrates the total, hand choice illustrative`,
      paths: [],
      images: [image],
      viewBox: `0 0 ${image.width} ${image.height}`,
      source: hourArtworkSource,
      provenance: 'adapted',
      license: 'public-domain',
    };
  }
}

for (const part of ['half', 'quarter'] as const) {
  const end = part === 'half' ? 63 : 45;
  handGlyphs[`hand-trappist-${part}`] = {
    label: `La Trappe ${part === 'half' ? 'half-hour: half a finger' : 'quarter-hour: one finger joint'}; original engraved digit with a modern measuring bracket, not an attested pose`,
    paths: [{ d: `M-3 20L-11 20L-11 ${end}L-3 ${end}`, weight: 1.5 }],
    images: [fingerDetail],
    viewBox: '-18 -3 120 139',
    source: hourArtworkSource,
    provenance: 'adapted',
    license: 'public-domain',
  };
}

handGlyphs['hand-cistercian-count'] = {
  label:
    'Loccum COUNT: one hand indicates the other hand’s fingertips; existing public-domain counting illustration, not a historical Cistercian image',
  source: countArtworkSource,
  provenance: 'adapted',
  license: 'public-domain',
  // Undo the original SVG group translation through the viewBox. The path
  // itself remains byte-for-byte identical to the downloaded source.
  viewBox: '-975.06933 161.73201 956.69292 956.69291',
  paths: countingPaths,
};
