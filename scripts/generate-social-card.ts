import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';
import { getSystem } from '../src/data/systems';
import { represent } from '../src/lib/format';
import { coreGlyphs } from '../src/glyphs/core';
import { findGlyph, escapeHTML } from '../src/lib/glyphs';
import { ORIGINAL_ARTWORK_LICENSE } from '../src/lib/artwork-license';

const root = new URL('../', import.meta.url);
async function font(path: string) {
  const bytes = await readFile(new URL(path, root));
  return opentype.parse(Uint8Array.from(bytes).buffer);
}
const serif = await font(
  'node_modules/@fontsource/newsreader/files/newsreader-latin-400-normal.woff',
);
const sans = await font('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff');
const ink = '#f5f3ed';
const accent = '#d69b7f';
function lettering(text: string, size: number, face = serif) {
  const glyphs = Array.from(text, (character) => face.charToGlyph(character));
  let advance = 0;
  return glyphs.map((glyph, index) => {
    const x = advance;
    advance +=
      (((glyph.advanceWidth ?? 0) +
        (glyphs[index + 1] ? face.getKerningValue(glyph, glyphs[index + 1]) : 0)) *
        size) /
      face.unitsPerEm;
    return { glyph, x, end: advance };
  });
}
const pathText = (text: string, x: number, y: number, size: number, face = serif, color = ink) =>
  lettering(text, size, face)
    .map(
      ({ glyph, x: offset }) =>
        `<path d="${glyph.getPath(x + offset, y, size).toPathData(2)}" fill="${color}"/>`,
    )
    .join('');
const label = (text: string, center: number) =>
  pathText(text, center - lettering(text, 16, sans).at(-1)!.end / 2, 545, 16, sans, '#c6cabe');

// All three representations encode 69. Reuse the converter's rules and original paths.
function numeral(id: string, x: number, y: number, width: number, height: number, color: string) {
  const result = represent({ numerator: 69n, denominator: 1n }, getSystem(id)!);
  const vertical = result.layout === 'stack';
  const viewWidth = vertical ? 100 : result.tokens.length * 100;
  const viewHeight = vertical ? result.tokens.length * 100 : 100;
  const paths = result.tokens
    .map((token, i) => {
      const glyph = findGlyph(token.glyph!, coreGlyphs)!;
      return `<svg x="${vertical ? 0 : i * 100}" y="${vertical ? i * 100 : 0}" width="100" height="100" viewBox="${glyph.viewBox ?? '0 0 100 100'}">${glyph.paths.map((p) => `<path d="${p.d}"${p.fill ? ` fill="${color}" stroke="none"` : ''}${p.weight ? ` stroke-width="${p.weight}"` : ''}/>`).join('')}</svg>`;
    })
    .join('');
  return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" fill="none" stroke="${color}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<title>Ancient Numbers</title>
<desc>The number 69 in Kaktovik, Maya, and Cistercian numerals.</desc>
<rect width="1200" height="630" fill="#263d34"/>
<rect x="28.5" y="28.5" width="1143" height="573" rx="2" fill="none" stroke="#617466"/>
${pathText('Ancient Numbers', 64, 137, 82)}
<g transform="translate(1077 83) scale(1.25)" fill="none" stroke="${accent}" stroke-width="1.4" stroke-linejoin="round"><path d="M19 4V34M5 10L19 4L33 10M5 28L19 34L33 28M5 10V28M33 10V28M5 19H33"/></g>
<path d="M64 184H1136M422 230V482M778 230V482" fill="none" stroke="#617466"/>
${numeral('kaktovik', 67, 259, 334, 167, ink)}
${numeral('maya', 518, 207, 164, 300, accent)}
${numeral('cistercian', 837, 237, 250, 250, ink)}
${label('Kaktovik', 244)}
${label('Maya', 600)}
${label('Cistercian', 958)}
<metadata>${escapeHTML(ORIGINAL_ARTWORK_LICENSE)}</metadata>
</svg>`;
await writeFile(new URL('public/social-card-v1.svg', root), svg);
await sharp(Buffer.from(svg))
  .png()
  .toFile(fileURLToPath(new URL('public/social-card-v1.png', root)));
console.log('Generated 1200 × 630 social preview.');
