import { coreGlyphs, cistercianGlyph } from '../glyphs/core';
import type { GlyphDefinition, GlyphSet, Region } from './types';
const cache = new Map<string, Promise<GlyphSet>>();
let nextPrintFilterId = 0;
export async function loadGlyphs(region: Region): Promise<GlyphSet> {
  if (!cache.has(region))
    cache.set(
      region,
      (async () => {
        switch (region) {
          case 'Africa':
            return {
              ...coreGlyphs,
              ...(await import('../glyphs/africa')).africaGlyphs,
              ...(await import('../glyphs/mende-expansion')).mendeExpansionGlyphs,
            };
          case 'Asia':
            return {
              ...coreGlyphs,
              ...(await import('../glyphs/asia')).asiaGlyphs,
              ...(await import('../glyphs/ottoman-expansion')).ottomanExpansionGlyphs,
            };
          case 'Americas':
            return {
              ...coreGlyphs,
              ...(await import('../glyphs/oral')).oralGlyphs,
              ...(await import('../glyphs/cherokee-expansion')).cherokeeExpansionGlyphs,
            };
          case 'Oceania':
            return {
              ...coreGlyphs,
              ...(await import('../glyphs/oral')).oralGlyphs,
              ...(await import('../glyphs/oksapmin')).oksapminGlyphs,
            };
          case 'Europe':
            return { ...coreGlyphs, ...(await import('../glyphs/hands')).handGlyphs };
          case 'Global':
            return { ...coreGlyphs, ...(await import('../glyphs/modern')).modernGlyphs };
          default:
            return coreGlyphs;
        }
      })(),
    );
  return cache.get(region)!;
}
export function findGlyph(id: string, set: GlyphSet): GlyphDefinition | undefined {
  if (/^cistercian-\d+$/.test(id)) return cistercianGlyph(Number(id.split('-')[1]));
  return set[id];
}
export const escapeHTML = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
export function glyphPathsSVG(glyph: GlyphDefinition, fillColor = 'currentColor'): string {
  const printFilterId = glyph.images?.some((image) => image.print)
    ? `print-ink-${typeof window === 'undefined' ? 'static' : 'live'}-${nextPrintFilterId++}`
    : undefined;
  // Convert the scan's luminance to black ink with transparent paper. Native SVG
  // filters also work in Safari and standalone downloads without CSS blending.
  const printFilter = printFilterId
    ? `<defs><filter id="${printFilterId}" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.73335 -2.46744 -0.24921 0 2"/></filter></defs>`
    : '';
  const images = (glyph.images ?? [])
    .map(
      (image) =>
        `<image href="${escapeHTML(image.href)}" width="${image.width}" height="${image.height}"${image.print ? ` filter="url(#${printFilterId})"` : ''}/>`,
    )
    .join('');
  return (
    printFilter +
    images +
    glyph.paths
      .map(
        (p) =>
          `<path d="${p.d}"${p.fill ? ` fill="${escapeHTML(p.color ?? fillColor)}" stroke="none"` : p.color ? ` stroke="${escapeHTML(p.color)}"` : ''}${p.weight ? ` stroke-width="${p.weight}"` : ''}${p.opacity !== undefined ? ` opacity="${p.opacity}"` : ''}/>`,
      )
      .join('')
  );
}
export function glyphSVG(glyph: GlyphDefinition, accessible = false): string {
  const attrs = accessible
    ? `role="img" aria-label="${escapeHTML(glyph.label)}"`
    : 'aria-hidden="true"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${glyph.viewBox ?? '0 0 100 100'}" ${attrs} class="numeral-glyph"${glyph.clip ? ' style="overflow:hidden"' : ''} fill="none" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">${glyphPathsSVG(glyph)}</svg>`;
}
