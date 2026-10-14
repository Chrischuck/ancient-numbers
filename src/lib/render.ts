import { ORIGINAL_ARTWORK_LICENSE, ADAPTED_ARTWORK_LICENSE } from './artwork-license';
import type { GlyphSet, Representation, SystemDefinition } from './types';
import { findGlyph, glyphSVG, escapeHTML } from './glyphs';
export function renderRepresentation(result: Representation, set: GlyphSet): string {
  if (!result.tokens.length) return '';
  return `<div class="specimen layout-${result.layout}" role="img" aria-label="${escapeHTML(result.tokens.map((t) => t.label ?? (t.glyph ? findGlyph(t.glyph, set)?.label : t.text) ?? '').join(', '))}">${result.tokens
    .map((t) => {
      if (t.glyph) {
        const g = findGlyph(t.glyph, set);
        if (!g) throw new Error(`Missing artwork: ${t.glyph}`);
        return `<span class="glyph-cell">${glyphSVG(g)}${t.place ? `<span class="place-label">× ${escapeHTML(t.place)}</span>` : ''}</span>`;
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
    ...new Set(usedGlyphs.map((g) => `${g.label}: ${g.source} (${g.provenance ?? 'original'})`)),
  ].join('\n');
  const hasAdaptation = usedGlyphs.some((g) => g.provenance === 'adapted');
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
      return `<svg x="${column ? 50 : i * 100 + 40}" y="${column ? i * 100 + 40 : 50}" width="100" height="100" viewBox="${g.viewBox ?? '0 0 100 100'}">${g.paths.map((p) => `<path d="${p.d}"${p.fill ? ' fill="#263d34" stroke="none"' : ''}${p.weight ? ` stroke-width="${p.weight}"` : ''}/>`).join('')}</svg>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none" stroke="#263d34" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" role="img"><title>${escapeHTML(label)}</title><desc>Ancient Numbers. Educational representation; see the system page for notation variant, sources, and limitations.</desc>${paths}<metadata>${metadata}</metadata></svg>`;
}
