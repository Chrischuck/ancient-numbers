import type { GlyphSet } from '../lib/types';
import { mendeExpansionGlyphs } from './mende-expansion';
import { cherokeeExpansionGlyphs } from './cherokee-expansion';
import { ottomanExpansionGlyphs } from './ottoman-expansion';

// Aggregator for validation; application code loads each regional module lazily.
export const writtenExpansionGlyphs: GlyphSet = {
  ...mendeExpansionGlyphs,
  ...cherokeeExpansionGlyphs,
  ...ottomanExpansionGlyphs,
};
