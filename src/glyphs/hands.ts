import type { GlyphDefinition, GlyphPath, GlyphSet } from '../lib/types';
import { loccumSource, trappistSource } from '../data/gestures';
import { woodcutCells } from './bede-woodcut';

export const woodcutSource =
  'https://commons.wikimedia.org/wiki/File:Finger_numerals_1520-Bedan_system.svg';

type FingerState = 'up' | 'middle' | 'base';
// All paths use absolute M/L/Q/C coordinates. Mirroring changes geometry,
// rather than relying on an SVG transform, to preserve path-only exports.
const mirror = (d: string) => {
  let coordinate = 0;
  return d.replace(/-?\d+(?:\.\d+)?/g, (number) => {
    const n = Number(number);
    return String(coordinate++ % 2 === 0 ? 100 - n : n);
  });
};

// Palm-facing anatomical studies. Each finger has its own taper, splay and
// webbing; folded fingers show the returning fingertip and its nail.
const contour = 1.65;
const crease = 0.85;
const fine = 0.65;
const outerFingers = [
  {
    up: 'C17 48 13 40 12 35C10 29 12 26 15 27C19 27 20 30 21 34L25 48Q26 54 28 51',
    knuckle: 'C16 50 17 45 21 45C25 44 28 47 28 51',
    x: 18,
    y: 53,
    tip: 67,
    joints: 'M14 38Q17 36 20 37M17 46Q20 44 23 45M20 54Q23 52 26 53',
  },
  {
    up: 'L27 20C26 13 28 10 32 10C36 10 38 13 38 18L40 47Q41 53 43 50',
    knuckle: 'C27 46 28 42 34 42C39 41 43 45 43 50',
    x: 29,
    y: 51,
    tip: 70,
    joints: 'M29 24Q33 22 37 23M30 37Q34 35 38 36M32 51Q36 49 40 50',
  },
  {
    up: 'L43 13C42 6 45 3 49 4C53 4 55 7 55 13L55 46Q56 53 58 50',
    knuckle: 'C42 45 44 40 49 40C55 40 58 44 58 50',
    x: 44,
    y: 50,
    tip: 71,
    joints: 'M45 20Q49 18 53 20M45 34Q49 32 54 34M46 49Q50 47 55 49',
  },
];

function finger(i: number, state: FingerState): { edge: string; details: GlyphPath[] } {
  const anatomy = outerFingers[i];
  if (state === 'up') return { edge: anatomy.up, details: [{ d: anatomy.joints, weight: crease }] };
  const { x, y } = anatomy;
  const tip = state === 'middle' ? anatomy.tip : anatomy.tip + 13;
  return {
    edge: anatomy.knuckle,
    details: [
      {
        d: `M${x} ${y}C${x - 1} ${y + 6} ${x} ${tip - 5} ${x + 2} ${tip - 1}C${x + 4} ${tip + 3} ${x + 8} ${tip + 2} ${x + 9} ${tip - 3}C${x + 11} ${tip - 8} ${x + 10} ${y + 7} ${x + 10} ${y + 1}`,
        weight: contour,
      },
      {
        d: `M${x + 3} ${tip - 6}Q${x + 5} ${tip - 8} ${x + 8} ${tip - 6}L${x + 8} ${tip - 2}Q${x + 5} ${tip} ${x + 3} ${tip - 2}Z`,
        weight: fine,
      },
      { d: `M${x + 2} ${y - 3}Q${x + 5} ${y - 5} ${x + 8} ${y - 2}`, weight: crease },
    ],
  };
}

const uprightIndex = 'L59 24C59 18 61 15 65 16C69 17 70 20 70 25L71 49';
const indexJoints = 'M61 29Q65 27 68 29M61 42Q65 40 69 42';
const openThumb = 'Q72 57 76 52L84 42C87 38 91 38 93 41C96 44 93 48 90 52L82 65';
const palmEnd = 'C79 72 77 78 69 83C65 86 65 91 66 96';

// Open-thumb study used only for the separate La Trappe hour illustrations.
const radialPoses: { edge: string; details: string[]; indexUp?: boolean }[] = [
  {
    edge: uprightIndex + openThumb,
    details: ['M79 53Q83 52 86 55M73 58C62 60 57 70 60 80'],
    indexUp: true,
  },
];

function handPaths(states: FingerState[], radial: (typeof radialPoses)[number]): GlyphPath[] {
  const fingers = states.map((state, i) => finger(i, state));
  return [
    {
      d:
        'M33 96C34 88 31 84 27 79C20 72 17 65 18 55' +
        fingers.map((f) => f.edge).join('') +
        radial.edge +
        palmEnd,
      weight: contour,
    },
    ...fingers.flatMap((f) => f.details),
    ...(radial.indexUp ? [{ d: indexJoints, weight: crease }] : []),
    ...radial.details.map((d) => ({ d, weight: crease })),
    // The palm creases shorten beneath flexed fingers, rather than drawing
    // across them. Wrist folds follow the narrowing heel of the hand.
    {
      d: states.includes('base')
        ? 'M35 89C43 87 54 87 63 89M39 93Q49 91 58 93'
        : 'M29 77C36 73 44 75 50 78M35 88C43 86 55 86 63 88M39 92Q49 90 58 92',
      weight: crease,
    },
  ];
}

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

// The 1824 source gives the finger total, not a prescribed finger sequence.
// These index-first diagrams are deliberately labelled as illustration choices.
for (const hand of ['left', 'right'] as const) {
  for (let n = 1; n <= 5; n++) {
    const states: FingerState[] = [4, 3, 2].map((threshold) => (n >= threshold ? 'up' : 'middle'));
    const radial =
      n === 5
        ? radialPoses[0]
        : {
            edge: uprightIndex + 'Q76 48 81 52C85 56 85 61 82 65',
            details: [
              'M81 57C72 58 65 55 60 55C56 54 54 57 57 60C62 65 70 68 77 66',
              'M57 57Q59 56 61 58L63 61Q60 62 58 60M68 59L67 63M75 68C65 70 61 76 63 81',
            ],
            indexUp: true,
          };
    const paths = handPaths(states, radial);
    if (hand === 'right')
      paths.forEach((p) => {
        p.d = mirror(p.d);
      });
    handGlyphs[`hand-trappist-${hand}-${n}`] = {
      label: `La Trappe hour rule: ${n} extended ${n === 1 ? 'finger' : 'fingers'}, signer’s ${hand} hand; finger choice illustrative`,
      paths,
      source: trappistSource,
      provenance: 'original',
    };
  }
}

for (const part of ['half', 'quarter'] as const) {
  const paths = handGlyphs['hand-trappist-left-1'].paths.map((p) => ({ ...p }));
  const end = part === 'half' ? 35 : 29;
  // A small measuring bracket explains the finger portion specified by the
  // source. It is a diagram annotation, not a claim about an attested movement.
  paths.push({ d: `M75 17L79 17L79 ${end}L75 ${end}`, weight: 1.2 });
  handGlyphs[`hand-trappist-${part}`] = {
    label: `La Trappe ${part === 'half' ? 'half-hour: half a finger' : 'quarter-hour: one finger joint'}; bracket is an explanatory annotation`,
    paths,
    source: trappistSource,
    provenance: 'original',
  };
}

// Coordinate scaling keeps these two-hand studies path-only in SVG exports.
function studyPaths(scale: number, x: number, y: number): GlyphPath[] {
  return handPaths(['up', 'up', 'up'], radialPoses[0]).map((path) => {
    let coordinate = 0;
    return {
      ...path,
      weight: (path.weight ?? contour) * scale,
      d: path.d.replace(/-?\d+(?:\.\d+)?/g, (number) => {
        const offset = coordinate++ % 2 === 0 ? x : y;
        return String(Number((Number(number) * scale + offset).toFixed(2)));
      }),
    };
  });
}

handGlyphs['hand-cistercian-count'] = {
  label:
    'Loccum COUNT: one hand indicates the other hand’s fingertips; action illustration, not a cardinal numeral',
  source: loccumSource,
  provenance: 'original',
  paths: [
    ...studyPaths(0.64, 1, 6),
    {
      d: 'M80 96L77 85C72 82 68 77 67 72L53 65C48 64 47 60 50 57C53 55 56 59 60 59L65 61L40 21C37 16 39 12 43 14C46 16 47 20 49 23L72 52C76 48 81 51 81 57C85 54 89 57 89 62C93 62 96 67 96 74C98 82 93 86 94 92L96 96',
      weight: contour,
    },
    {
      d: 'M72 53C69 56 71 62 76 66C79 69 83 66 81 61L78 56M81 58L85 69C87 73 91 71 90 67L88 62M91 65L93 74C94 78 90 80 88 77M65 61C67 65 71 67 75 68M73 73Q79 71 84 75M79 87Q85 85 91 88',
      weight: crease,
    },
    { d: 'M47 27Q44 30 42 30M55 39Q52 42 50 42M52 59L54 62M74 61L77 63', weight: fine },
    { d: 'M33 14L36 17M35 9L38 12', weight: crease },
  ],
};

handGlyphs['hand-cistercian-half'] = {
  label:
    'Loccum HALF: pass an edgewise hand along the length of the other hand; motion illustration',
  source: loccumSource,
  provenance: 'original',
  paths: [
    {
      // Receiving palm, with slightly spread fingers and a low thumb.
      d: 'M21 95C24 85 22 82 18 75C14 69 10 61 8 55C6 50 8 46 11 47C14 47 16 53 20 57L18 29C17 24 19 21 22 22C25 22 26 25 26 30L28 49L29 18C29 12 32 10 35 12C38 13 39 16 39 21L39 48L43 20C44 15 46 13 49 15C52 16 52 20 51 24M57 64C55 75 49 81 43 85L43 95',
      weight: contour,
    },
    {
      d: 'M21 35Q23 34 25 35M30 25Q34 24 37 25M27 60C31 55 40 54 47 57M25 68C30 65 38 67 42 70M25 86Q32 83 40 86M19 59C25 65 28 72 27 78',
      weight: crease,
    },
    {
      // The moving hand is seen edgewise: fingers together, thumb below.
      d: 'M84 96L82 83C74 78 68 71 62 63L51 49L42 33C39 28 39 24 42 23C45 22 48 27 51 31L67 51L55 29C52 24 52 20 55 19C58 18 61 22 63 26L79 51C87 60 93 70 94 81L96 94',
      weight: contour,
    },
    {
      d: 'M45 27L59 48M58 25L73 51M67 51C70 56 72 61 75 64M56 47C62 51 66 55 67 60M78 76Q83 73 89 77M84 87L92 85M48 33L51 31M61 34L65 32',
      weight: crease,
    },
    { d: 'M35 41L34 60M31 55L34 60L38 56', weight: 1.1 },
  ],
};
