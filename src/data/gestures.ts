import type { SystemDefinition } from '../lib/types';

export const bedeSource = 'https://www.fingercounting.com/texts/bede';
export const loccumSource = 'https://digitale-sammlungen.gwlb.de/resolve?PPN=730901130';
export const trappistSource = 'https://books.google.com/books?id=rS1MAAAAYAAJ';

// Anatomical names, rather than the sometimes inconsistent names in translations.
// Bede's medicus is the ring finger; his impudicus is the middle finger.
export const bedeUnitRules = [
  'Leave the little, ring, and middle fingers extended; this group contributes nothing.',
  'Fold the little finger so its tip touches the middle of the palm.',
  'Fold the little and ring fingers to the middle of the palm.',
  'Fold the little, ring, and middle fingers to the middle of the palm.',
  'Raise the little finger; keep the ring and middle fingers folded to the middle of the palm.',
  'Keep only the middle finger folded to the middle of the palm.',
  'Keep only the ring finger folded to the middle of the palm.',
  'Fold only the little finger farther down, to the base of the palm.',
  'Fold the little and ring fingers to the base of the palm.',
  'Fold the little, ring, and middle fingers to the base of the palm.',
];

export const bedeTensRules = [
  'Leave the thumb and index extended; this group contributes nothing.',
  'Touch the index fingernail to the middle joint of the thumb.',
  'Insert the thumb tip between the middle joints of the index and middle fingers.',
  'Join the tips of the thumb and index finger in a rounded embrace.',
  'Pass the inside of the thumb across the side or back of the upright index finger.',
  'Bend the outer thumb joint into an angle and incline the thumb toward the palm.',
  'Curve the index finger around the bent thumb.',
  'Place the thumb inside the curved index finger, with the thumbnail projecting across its middle joint.',
  'Stretch the thumb inside the curved index, pressing its tip to the index finger’s middle joint.',
  'Press the bent index fingernail against the base of the upright thumb.',
];

export const gestureSystems: SystemDefinition[] = [
  {
    id: 'medieval-finger-counting',
    name: 'Medieval European Finger Counting',
    localName: 'Computus digitorum · Bede’s arrangement',
    region: 'Europe',
    location: 'Northumbria, England; wider Latin manuscript tradition',
    period: '725 CE; ancient precedents and later medieval variants',
    era: 'Historical',
    structure: 'Physical',
    baseLabel: 'Decimal · four finger groups',
    summary:
      'Human hands become a compact number display: the left carries units and tens, the right hundreds and thousands.',
    history:
      'Bede opened De temporum ratione in 725 with instructions for numerical hand positions before explaining calendars and the computation of Easter. His account preserves an older Mediterranean tradition. Medieval authors transmitted and modified these positions; Fibonacci’s later placement of hundreds and thousands differs from Bede’s.',
    howItWorks:
      'The little, ring, and middle fingers on the left encode 1–9; its thumb and index encode 10–90. On the right, the thumb and index repeat the tens shapes for 100–900, while the other three fingers repeat the units shapes for 1,000–9,000. Combine the groups simultaneously. The 1520 woodcut shows each place-value group separately. Left and right refer to the signer; combine the groups on each hand.',
    readingSteps: [
      'Identify the signer’s left hand: its three outer fingers supply units, and its thumb/index supply tens.',
      'Distinguish fingertips touching the middle of the palm (1–6) from the base of the palm (7–9).',
      'Read the right thumb/index as hundreds and the right outer fingers as thousands. This is Bede’s ordering.',
      'Add the four contributions. For 1,254: right hand 1,000 + 200, left hand 50 + 4.',
    ],
    caveat:
      'The illustrations are copied from a public-domain chart based on a 1520 woodcut, including its original printed numbers. Each drawing isolates one place-value group; it does not show the complete combined pose for a multi-place number. Absent places are omitted; no independent historical zero sign is supplied. The converter covers 1–9,999: Bede’s larger values require hand positions on the torso and thighs. Later diagrams and Fibonacci’s arrangement should not be silently mixed with this variant.',
    engine: 'gestures',
    min: '1',
    max: '9999',
    zero: false,
    specimen: 54,
    examples: [
      {
        value: '6',
        explanation:
          'The left ring finger alone touches the middle of the palm; six is a learned configuration, not six extended fingers.',
      },
      {
        value: '54',
        explanation: 'Left thumb angled inward for 50, with ring and middle fingers folded for 4.',
      },
      { value: '100', explanation: 'Use the left-hand shape for 10 on the right thumb and index.' },
      { value: '1254', explanation: 'Right: 1,000 + 200. Left: 50 + 4. Hold both hands together.' },
    ],
    sources: [
      {
        title: 'Finger numerals — 1520 woodcut chart',
        url: 'https://commons.wikimedia.org/wiki/File:Finger_numerals_1520-Bedan_system.svg',
        detail:
          'Public-domain vector reproduction of a woodcut printed in 1520, reproduced by Tobias Dantzig. Original paths, fills, hatching, and printed labels retained; individual figures extracted without redrawing.',
      },
      {
        title: 'Bede — De temporum ratione, chapter 1 (725)',
        url: bedeSource,
        detail:
          'Primary Latin text, as edited by C. W. Jones, CCSL 123B (1977), pp. 268–273. The anatomical identifications and diagrams here are original interpretations.',
      },
      {
        title: 'DIGITAL — Medieval texts and their variants',
        url: 'https://www.fingercounting.com/texts',
        detail:
          'Miguel C. Fernandes’s research project, University of Chicago; distinguishes Bede’s right-hand places from Fibonacci’s.',
      },
      {
        title: 'E. M. Sanford — De Loquela Digitorum (1928)',
        url: 'https://penelope.uchicago.edu/Thayer/E/Journals/CJ/23/8/De_Loquela_Digitorum%2A.html',
        detail:
          'Classical Journal 23, pp. 588–593; discussion of historical terminology and finger positions.',
      },
    ],
  },
  {
    id: 'cistercian-gestures',
    name: 'Cistercian Numerical Gestures',
    localName: 'La Trappe hour signals · 1824 witness',
    region: 'Europe',
    location: 'La Trappe Abbey, Normandy, France; Loccum comparison',
    period: '1824 witness of Trappist signs; earlier monastic tradition',
    era: 'Historical',
    structure: 'Physical',
    baseLabel: 'Finger totals · hours 1–10',
    summary:
      'A documented La Trappe rule answers the time by showing one finger for each hour, with parts of a finger for half and quarter hours.',
    history:
      'Louis Du Bois printed a vocabulary of La Trappe signs in 1824, attributing its renewal to the Trappist reform of de Rancé. Its entry Heure describes numerical replies about time. This dated Cistercian Strict Observance witness is used here, without assigning its exact gestures to the medieval order as a whole. Earlier Loccum lists, printed by Leibniz in 1717, independently document COUNT and HALF.',
    howItWorks:
      'In the La Trappe time signal, show as many fingers as the number of hours. The converter illustrates 1–10 using the thumb-first sequence in the sourced engraving, with a second hand after five. Du Bois does not prescribe which fingers or hand to choose. His entry also specifies half of a finger for a half-hour and one joint for a quarter-hour. These fractional time signals are described in the dictionary.',
    readingSteps: [
      'Count the extended fingers across the displayed hands: one finger represents one hour.',
      'For 6–10, combine an open hand with the remaining fingers on the other hand. The choice and order of fingers here are illustrative.',
      'A half finger represents half an hour; a single finger joint represents a quarter-hour. Read these in their time context.',
      'Distinguish this 1824 La Trappe witness, the earlier Loccum glossary, Bede’s code, and the written Cistercian stave numerals.',
    ],
    caveat:
      'This converter implements the documented hour-counting rule only for 1–10. It does not claim a universal medieval Cistercian cardinal-number code or invent a rule for 11 and 12. Existing public-domain engravings illustrate the finger totals. They come from a 1911 number-sign plate and a separate counting illustration, not Cistercian sources; finger selection and palm orientation remain illustrative. Loccum COUNT and HALF are separately dated vocabulary items, not arbitrary cardinal numerals.',
    engine: 'gestures',
    min: '1',
    max: '10',
    zero: false,
    specimen: 7,
    examples: [
      {
        value: '1',
        explanation:
          'One extended finger answers one hour. The thumb shown is an illustrative choice.',
      },
      {
        value: '4',
        explanation:
          'Four extended fingers answer four hours; finger selection follows the illustrative engraving.',
      },
      {
        value: '7',
        explanation: 'Five fingers on one hand and two on the other answer seven hours.',
      },
      {
        value: '10',
        explanation: 'Both open hands display ten fingers in total, answering ten hours.',
      },
    ],
    sources: [
      {
        title: 'Illustration source — Encyclopaedia Britannica (1911), number-sign engraving',
        url: 'https://archive.org/details/encyclopaediabrit07chisrich/page/n917',
        detail:
          'Volume 7, printed p. 885, figure 1. Only the one-to-five figures illustrate finger totals here; this is not evidence for Cistercian poses. Public-domain source scans are retained, with a monochrome display filter.',
      },
      {
        title: 'Illustration source — Counting Fingers on Hand, j4p4n',
        url: 'https://openclipart.org/detail/322626/counting-fingers-on-hand',
        detail:
          'Existing CC0/public-domain vector illustration of indicating another hand’s fingers, used for the COUNT action. Original path retained without redrawing. Not a historical Cistercian image.',
      },
      {
        title: 'Louis Du Bois — Histoire de l’abbaye de La Trappe (1824)',
        url: trappistSource,
        detail:
          'Primary French sign vocabulary, pp. 248–258, entry Heure. The hour rule specifies finger totals, half a finger, and a joint; no canonical finger-selection sequence is supplied.',
      },
      {
        title: 'La Trappe vocabulary — French transcription with translation',
        url: 'https://www.medieval-baltic.us/trappe.pdf',
        detail:
          'French entry Heure on PDF page 4. Diagrams and English descriptions here interpret the public-domain French text rather than copying the modern translation.',
      },
      {
        title: 'Leibniz — Collectanea etymologica, part II (1717)',
        url: loccumSource,
        detail:
          'Public-domain primary witness: Latin list entry 88, Numerare (printed p. 389; scan 647); Low German list entry 139, halff (printed p. 402; scan 660). Introduction recalls Loccum in 1577–1578.',
      },
      {
        title: 'Loccum Latin counting entry — source scan',
        url: 'https://digitale-sammlungen.gwlb.de/content/730901130/pdf/00000647.pdf',
        detail:
          'Entry 88: indicating fingertips as if counting. This is an action sign, not a cardinal numeral chart.',
      },
      {
        title: 'Loccum HALF entry — source scan',
        url: 'https://digitale-sammlungen.gwlb.de/content/730901130/pdf/00000660.pdf',
        detail: 'Low German entry 139; the cutting/dividing movement is along the hand’s length.',
      },
    ],
  },
];
