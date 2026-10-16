import type { SystemDefinition } from '../lib/types';

export const pacificSystemUpdates: Record<string, Partial<SystemDefinition>> = {
  mangarevan: {
    engine: 'pacific',
    min: '1',
    max: '799',
    howItWorks:
      'Express the count as multiples of 80, followed by at most one 40, one 20, one 10, and the remaining ones. The input counts tauga; choose how many objects each tauga contains before converting it to objects.',
    readingSteps: [
      'Choose the counting unit: a turtle, a pair of fish, four coconuts, or eight octopuses.',
      'Read the largest part first: a number before varu multiplies 80. A single varu names 80.',
      'Then add any tataua (40), paua (20), and takau (10), each used once at most. Finish with the remaining 1–9 units.',
      'For example, toru varu paua takau toru is 3 × 80 + 20 + 10 + 3 = 273 counting units.',
    ],
    caveat:
      'Supports 1–799 counting units using Bender and Beller’s documented construction. These spoken forms do not automatically count individual objects. The language also has an ordinary decimal system; historical accounts of specialized counting vary.',
  },
  oksapmin: {
    engine: 'pacific',
    min: '1',
    max: '27',
    values: Array.from({ length: 27 }, (_, i) => ({ value: i + 1, glyph: `oksapmin-${i + 1}` })),
    readingSteps: [
      'Begin at either thumb, then count the index, middle, ring, and little fingers: 1–5.',
      'Continue through wrist, forearm, inner elbow, upper arm, shoulder, neck, ear, and eye: 6–13. The nose is 14.',
      'Continue down the other side from eye to wrist: 15–22. Count the other thumb as 23, then index, middle, ring, and little fingers: 24–27.',
      'The highlighted point marks the total reached. Follow the path to count onward; its positions are not place-value digits.',
    ],
    caveat:
      'The converter covers all 27 positions of the first traversal. Diagrams are modern teaching illustrations. Further counts need context; a 27-position path is not positional base 27.',
    sources: [
      {
        title: 'Geoffrey Saxe · Oksapmin Counting System',
        url: 'https://culturecognition.com/new-page-3',
        detail:
          'Researcher’s diagram, field video, either direction of counting, and the distinction between enumeration and later arithmetic.',
      },
      {
        title: 'Saxe & Esmonde · Making Change in Oksapmin Tradestores (2004)',
        url: 'https://doi.org/10.1017/S0257543400000134',
        detail:
          'Figure 1 and page 12 document the complete 27-point sequence, including thumb 23 and little finger 27.',
      },
    ],
  },
};
