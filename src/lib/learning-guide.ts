import type { GlyphSet, SystemDefinition } from './types';
import { escapeHTML, findGlyph, glyphSVG } from './glyphs';
import { represent } from './format';
import { renderRepresentation } from './render';
import { gestureDictionary } from './gestures';
import { spokenDictionary, spokenLanguage } from './spoken';
import { pacificSymbolDictionary, oksapminPositions } from './pacific-counts';

type SymbolEntry = { glyph: string; meaning: string };
const decimalValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90];
const entries = (prefix: string, values: number[]): SymbolEntry[] =>
  values.map((value) => ({ glyph: `${prefix}-${value}`, meaning: value.toLocaleString('en-US') }));

export function symbolEntries(system: SystemDefinition): SymbolEntry[] {
  const physicalCount = pacificSymbolDictionary(system);
  if (physicalCount.length) return physicalCount;
  const gestures = gestureDictionary(system);
  if (gestures.length) return gestures;
  switch (system.engine) {
    case 'roman':
      return ['I', 'V', 'X', 'L', 'C', 'D', 'M'].map((letter, i) => ({
        glyph: `roman-${letter}`,
        meaning: `${letter} = ${[1, 5, 10, 50, 100, 500, 1000][i].toLocaleString('en-US')}`,
      }));
    case 'cistercian':
      return [1, 10, 100, 1000].flatMap((place, i) =>
        Array.from({ length: 9 }, (_, j) => ({
          glyph: `cistercian-${(j + 1) * place}`,
          meaning: `${((j + 1) * place).toLocaleString('en-US')} · ${['upper right', 'upper left', 'lower right', 'lower left'][i]}`,
        })),
      );
    case 'ethiopic':
      return entries('ethiopic', [...decimalValues, 100, 10000]);
    case 'sinhala':
      return entries('sinhala', [...decimalValues, 100, 1000]);
    case 'rods':
      return [
        { glyph: 'rods-zero', meaning: '0 · empty place' },
        ...['unit', 'tens'].flatMap((orientation) =>
          Array.from({ length: 9 }, (_, i) => ({
            glyph: `rods-${orientation}-${i + 1}`,
            meaning: `${i + 1} · ${orientation === 'unit' ? 'ones / hundreds form' : 'tens / thousands form'}`,
          })),
        ),
      ];
    case 'khipu':
      return ['units', 'knots'].flatMap((kind) =>
        Array.from({ length: 10 }, (_, i) => ({
          glyph: `khipu-${kind}-${i}`,
          meaning: `${i} · ${kind === 'units' ? 'ones position' : 'knots in a higher place'}`,
        })),
      );
    case 'explainer':
      return system.examples
        .filter((example) => example.glyphs?.length === 1)
        .map((example) => ({ glyph: example.glyphs![0], meaning: example.value }));
    default: {
      const signs = system.digits
        ? system.digits.map((glyph, digit) => ({ glyph, meaning: String(digit) }))
        : [...(system.values ?? [])]
            .sort((a, b) => a.value - b.value)
            .map(({ glyph, value }) => ({ glyph, meaning: value.toLocaleString('en-US') }));
      if (system.engine === 'greek')
        signs.push({ glyph: 'greek-mark', meaning: 'Numeral mark · no value' });
      if (system.engine === 'suzhou')
        signs.push(
          ...[1, 2, 3].map((n) => ({
            glyph: `suzhou-horizontal-${n}`,
            meaning: `${n} · alternate form`,
          })),
        );
      return signs;
    }
  }
}

export function renderLearningGuide(system: SystemDefinition, glyphs: GlyphSet): string {
  const symbols = symbolEntries(system);
  const words = spokenDictionary(system);
  const gestures = gestureDictionary(system).length > 0;
  const bodyCount = system.id === 'oksapmin';
  const illustrated = (value: string) =>
    renderRepresentation(represent({ numerator: BigInt(value), denominator: 1n }, system), glyphs);
  const chart = symbols
    .map(({ glyph, meaning }) => {
      const sign = findGlyph(glyph, glyphs);
      if (!sign) throw new Error(`Missing learning-guide artwork: ${glyph}`);
      if (bodyCount) {
        const position = oksapminPositions[Number(glyph.split('-')[1]) - 1];
        const [part, side] = position.part.split(' · ');
        return `<li class="symbol-tile body-count-tile"><span class="body-count-number">${position.value}</span>${glyphSVG(sign, true)}<span class="body-count-part">${escapeHTML(part)}</span><span class="body-count-side">${escapeHTML(side)}</span></li>`;
      }
      return `<li class="symbol-tile">${glyphSVG(sign, true)}<span>${escapeHTML(meaning)}</span></li>`;
    })
    .join('');
  let note = system.digits
    ? `Each tile shows one digit and its value. These are the ${system.digits.length} digits used by this display. Combine them using the rules below.`
    : 'Each tile shows a sign and what it means. A sign can stand for a whole amount, such as 10 or 100.';
  if (system.engine === 'babylonian')
    note =
      'Within one place, repeat the one wedge for units and the ten wedge for tens. Here are all the combinations from 1 to 59, plus an empty place labeled 0 in this teaching grid.';
  if (system.engine === 'cistercian')
    note =
      'Start with the central staff. These are the nine shapes in each of its four corners. To make a number, combine the needed corners on the same staff.';
  if (system.engine === 'khipu')
    note =
      'The ones position uses different knot shapes from the higher places. These tiles show both sets; the position tells you whether to count ones, tens, or hundreds.';
  if (system.engine === 'explainer')
    note =
      'These are the documented examples available here. This tradition does not have a complete digit alphabet in this exhibit.';
  if (gestures)
    note =
      system.id === 'medieval-finger-counting'
        ? 'These are the original illustrations and printed numbers from a public-domain chart based on a 1520 woodcut. Each pose shows one place-value group. Combine the groups on each hand; left and right refer to the signer.'
        : 'Existing public-domain engravings illustrate the documented finger totals and counting action. The artwork is illustrative and comes from separate sources; it is not a historical depiction of Cistercian practice. Brackets on the fractional examples are modern teaching annotations.';
  if (words.length)
    note =
      'Number words are the signs in this tradition. This dictionary shows the documented words and their meanings, preserving the spelling used by the sources. Some words name whole groups or connect parts of a number.';
  if (bodyCount)
    note =
      'Follow positions 1–27 in order. Each close-up highlights the body part to touch; the dot marks the counting point. Begin on either side, pass through the nose at 14, then continue down the other side.';
  const dictionary = words.length
    ? `<dl class="word-dictionary" aria-label="${escapeHTML(system.name)} number-word dictionary">${words.map(({ word, meaning }) => `<div class="word-entry"><dt${spokenLanguage(system) ? ` lang="${spokenLanguage(system)}"` : ''}>${escapeHTML(word)}</dt><dd>${escapeHTML(meaning)}</dd></div>`).join('')}</dl>`
    : '';
  const title = words.length
    ? 'Number-word dictionary'
    : bodyCount
      ? 'The 27 body positions'
      : gestures
        ? 'Hand gesture dictionary'
        : system.engine === 'explainer'
          ? 'Signs in the documented examples'
          : 'Meet the symbols';
  const bodyReference = bodyCount
    ? '<p class="body-count-reference"><a class="inline-link" href="https://culturecognition.com/new-page-3" target="_blank" rel="noopener noreferrer">Watch the count and see the full-body chart ↗</a><span>Geoffrey Saxe · field research</span></p>'
    : '';
  const symbolSection = `<h2 id="symbol-key-title">${title}</h2><p>${escapeHTML(note)}</p>${bodyReference}${chart ? `<ul class="symbol-grid${gestures ? ' gesture-grid' : ''}${system.id === 'cistercian-gestures' ? ' cistercian-gesture-grid' : ''}${bodyCount ? ' body-count-grid' : ''}" aria-label="${escapeHTML(system.name)} symbol key">${chart}</ul>` : ''}${dictionary}`;
  const woodcutReference =
    system.id === 'medieval-finger-counting'
      ? `<details class="woodcut-reference"><summary>View the complete original woodcut chart</summary><figure><img src="${import.meta.env?.BASE_URL ?? '/ancient-numbers/'}reference/hands/finger-numerals-1520.svg" width="1347" height="743" loading="lazy" alt="Original 1520 finger-counting woodcut chart, with illustrated poses for 1–9, 10–90, 100–900 and 1,000–9,000"><figcaption><a href="https://commons.wikimedia.org/wiki/File:Finger_numerals_1520-Bedan_system.svg" target="_blank" rel="noopener noreferrer">1520 woodcut chart · public domain · Wikimedia Commons</a></figcaption></figure></details>`
      : '';

  const loccumHalfNote =
    system.id === 'cistercian-gestures'
      ? '<aside class="gesture-source-note"><h3>Loccum HALF</h3><p>Pass an edgewise hand along the length of the other hand. The Low German list recalls Loccum practice in 1577–1578 (entry 139, printed in 1717). This is distinct from La Trappe’s half-finger time signal.</p><a class="inline-link" href="https://digitale-sammlungen.gwlb.de/content/730901130/pdf/00000660.pdf" target="_blank" rel="noopener noreferrer">Read the original HALF entry ↗</a></aside>'
      : '';

  const romanRules = [
    {
      title: 'Put a smaller sign after a larger one: add',
      text: 'V is 5 and I is 1. In VI, the I comes after the V: 5 + 1 = 6.',
      value: '6',
    },
    {
      title: 'Put an allowed smaller sign before a larger one: subtract',
      text: 'In IV, the I comes before the V: 5 − 1 = 4. Changing the order changes the number.',
      value: '4',
    },
    {
      title: 'Only these six pairs subtract',
      text: 'IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900. For example, use IX for 9; IL is not a valid way to write 49 in this convention.',
      value: '9',
    },
    {
      title: 'Repeat signs to add their values',
      text: 'III = 1 + 1 + 1 = 3. Repeat I, X, C, or M at most three times in a row. V, L, and D do not repeat in this convention.',
      value: '3',
    },
    {
      title: 'Read the pairs, then add the groups',
      text: 'XLII has XL = 50 − 10 = 40, then I + I = 2. Together: 40 + 2 = 42.',
      value: '42',
    },
  ];
  const rules =
    system.engine === 'roman'
      ? `<div class="rule-grid">${romanRules.map((rule) => `<article class="rule-card"><h3>${escapeHTML(rule.title)}</h3>${illustrated(rule.value)}<p>${escapeHTML(rule.text)}</p></article>`).join('')}</div>`
      : `<p>${escapeHTML(system.howItWorks)}</p><ol class="reading-steps">${system.readingSteps.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}</ol><div class="rule-grid">${system.examples.map((example) => `<article class="rule-card"><h3>${escapeHTML(example.value)} in ${escapeHTML(system.name)}</h3>${illustrated(example.value)}<p>${escapeHTML(example.explanation)}</p></article>`).join('')}</div>`;
  return `${symbolSection}${woodcutReference}${loccumHalfNote}<h2 class="rules-title">${words.length ? 'How the words fit together' : gestures ? 'How the gestures fit together' : 'How the symbols fit together'}</h2>${rules}<p class="learning-note">${escapeHTML(system.caveat)}</p>`;
}
