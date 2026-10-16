import { ORIGINAL_ARTWORK_LICENSE, ADAPTED_ARTWORK_LICENSE } from './artwork-license';
import type { GlyphSet, RenderToken, Representation, SystemDefinition } from './types';
import { findGlyph, glyphSVG, glyphPathsSVG, escapeHTML } from './glyphs';

export function renderGlyphCell(token: RenderToken, set: GlyphSet): string {
  const id = token.glyph!;
  const glyph = findGlyph(id, set);
  if (!glyph) throw new Error(`Missing artwork: ${id}`);
  return `<span class="glyph-cell${id.startsWith('hand-') ? ' hand-glyph' : ''}${id.startsWith('oksapmin-') ? ' body-glyph' : ''}">${glyphSVG(glyph)}${glyph.caption ? `<span class="glyph-caption">${escapeHTML(glyph.caption)}</span>` : ''}${token.place ? `<span class="place-label">× ${escapeHTML(token.place)}</span>` : ''}</span>`;
}
export function renderRepresentation(result: Representation, set: GlyphSet): string {
  if (!result.tokens.length) return '';
  const language = result.layout === 'words' ? result.tokens[0]?.lang : undefined;
  return `<div class="specimen layout-${result.layout}"${language ? ` lang="${escapeHTML(language)}"` : ''} role="img" aria-label="${escapeHTML(result.tokens.map((t) => t.label ?? (t.glyph ? findGlyph(t.glyph, set)?.label : t.text) ?? '').join(', '))}">${result.tokens
    .map((t) => {
      if (t.glyph) {
        return renderGlyphCell(t, set);
      }
      return `<span class="word-specimen">${escapeHTML(t.text ?? '')}</span>`;
    })
    .join('')}</div>`;
}
export function copyText(
  result: Representation,
  set: GlyphSet,
  system: SystemDefinition,
): string | undefined {
  if (!result.tokens.length) return;
  if (result.unicode !== undefined) return result.unicode;
  if (result.tokens.every((t) => t.text !== undefined))
    return result.tokens.map((t) => t.text).join(' ');
  if (result.tokens.some((t) => !t.glyph || !findGlyph(t.glyph, set)?.unicode)) return;
  const tokens =
    system.id === 'nko' || system.id === 'phoenician' || system.id === 'kharoshthi'
      ? [...result.tokens].reverse()
      : result.tokens;
  const text = tokens
    .map((t) => findGlyph(t.glyph!, set)!.unicode)
    .join(result.layout === 'stack' ? '\n' : '');
  return text;
}
export function exportSVG(
  result: Representation,
  set: GlyphSet,
  label: string,
): string | undefined {
  if (!result.tokens.length || result.tokens.some((t) => !t.glyph)) return;
  const column = result.layout === 'stack' || result.layout === 'cord';
  const width = column ? 200 : Math.max(200, result.tokens.length * 100 + 80);
  const height = column ? result.tokens.length * 100 + 80 : 200;
  const usedGlyphs = result.tokens.map((t) => findGlyph(t.glyph!, set)!);
  const credits = [
    ...new Set(
      usedGlyphs.map(
        (g) =>
          `${g.label}: ${g.source} (${g.provenance ?? 'original'}${g.license ? `; ${g.license}` : ''})`,
      ),
    ),
  ].join('\n');
  const hasAdaptation = usedGlyphs.some(
    (g) => g.provenance === 'adapted' && g.license !== 'public-domain',
  );
  const metadata = escapeHTML(
    credits +
      '\n\n' +
      ORIGINAL_ARTWORK_LICENSE +
      (hasAdaptation ? '\n\n' + ADAPTED_ARTWORK_LICENSE : ''),
  );
  const paths = result.tokens
    .map((t, i) => {
      const g = findGlyph(t.glyph!, set)!;
      // Each glyph's own viewBox is retained in a nested SVG, requiring no font.
      return `<svg x="${column ? 50 : i * 100 + 40}" y="${column ? i * 100 + 40 : 50}" width="100" height="100" viewBox="${g.viewBox ?? '0 0 100 100'}">${glyphPathsSVG(g, '#263d34')}</svg>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none" stroke="#263d34" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" role="img"><title>${escapeHTML(label)}</title><desc>Ancient Numbers. Educational representation; see the system page for notation variant, sources, and limitations.</desc>${paths}<metadata>${metadata}</metadata></svg>`;
}
