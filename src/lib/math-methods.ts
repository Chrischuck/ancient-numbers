import type { GlyphSet, Rational, RenderToken, Source, SystemDefinition } from './types';
import { escapeHTML } from './glyphs';
import { baseDigits, calculate, rational } from './numbers';
import { represent } from './format';
import { spokenDictionary, yorubaConstruction } from './spoken';
import { bedeTensRules, bedeUnitRules } from '../data/gestures';
import { numeralLesson } from './numeral-lesson';
import { renderRepresentation } from './render';
import { spokenNumberLesson } from './spoken-lesson';
import { spokenLesson } from './worked-spoken-lesson';
import { operationLesson } from './operation-lessons';

export interface ReasoningCalculation {
  first: Rational;
  second: Rational;
  operation: string;
}

interface Explanation {
  text: string;
  equation?: string;
  notes?: string[];
  sources?: Source[];
  parts?: { text: string; tokens?: RenderToken[] }[];
}

interface Method extends Explanation {
  title: string;
  steps?: string[];
  evidence?: string;
  table?: {
    caption: string;
    headings: string[];
    rows: { selected?: boolean; cells: { text: string; tokens?: RenderToken[] }[] }[];
  };
}

// These limits bound the *teaching explanation*, not the calculator's exact arithmetic.
const FORMATION_LIMIT = 999_999_999_999n;
const WORKED_LIMIT = 999_999_999n;
const MAX_STEPS = 14;
const SIGNS: Record<string, string> = { add: '+', subtract: '−', multiply: '×', divide: '÷' };

const yorubaSource: Source = {
  title: 'Ajibade · A construction morphology approach to Yoruba numerals (2023)',
  url: 'https://constructions.journals.hhu.de/article/download/549/585/2271',
};
const mangarevanSource: Source = {
  title: 'Bender & Beller · Mangarevan binary steps (2013)',
  url: 'https://math.hawaii.edu/~tom/ethnomathematics/PNAS-2013.pdf',
};

const absolute = (n: bigint) => (n < 0n ? -n : n);
const whole = (n: Rational) => n.denominator === 1n && n.numerator >= 0n;
const integerText = (n: bigint): string => {
  const text = n.toString();
  return text.length <= 80
    ? text
    : `${text.slice(0, 32)}…${text.slice(-18)} (${absolute(n).toString().length} digits)`;
};
const valueText = (n: Rational): string =>
  n.denominator === 1n
    ? integerText(n.numerator)
    : `${integerText(n.numerator)}/${integerText(n.denominator)}`;

function normalize(value: Rational): Rational | undefined {
  try {
    return rational(value.numerator, value.denominator);
  } catch {
    return undefined;
  }
}

function inRange(n: bigint, system: SystemDefinition): boolean {
  return n >= BigInt(system.min) && n <= BigInt(system.max) && (n !== 0n || system.zero);
}

function placeTerms(n: bigint, base: number): string[] {
  const digits = baseDigits(n, base);
  return digits.flatMap((digit, i) => {
    if (!digit && n !== 0n) return [];
    const place = BigInt(base) ** BigInt(digits.length - i - 1);
    return [place === 1n ? String(digit) : `${digit} × ${place}`];
  });
}

function additiveTerms(n: bigint, values: number[]): string[] {
  const terms: string[] = [];
  let rest = n;
  for (const value of [...new Set(values)].sort((a, b) => b - a)) {
    if (!Number.isSafeInteger(value) || value <= 0) continue;
    const count = rest / BigInt(value);
    if (count) terms.push(count === 1n ? String(value) : `${count} × ${value}`);
    rest %= BigInt(value);
  }
  if (rest) terms.push(`${rest} (unrepresented remainder)`);
  return terms;
}

function formation(system: SystemDefinition, value: Rational): Explanation {
  if (
    system.id === 'cistercian-gestures' &&
    value.numerator > 0n &&
    value.numerator <= 10n * value.denominator &&
    (value.numerator * 4n) % value.denominator === 0n &&
    value.denominator !== 1n
  ) {
    const quarters = (value.numerator * 4n) / value.denominator;
    const hours = quarters / 4n;
    const fraction = quarters % 4n;
    return {
      text: 'The time context supplies a unit: whole fingers count hours; the recorded vocabulary uses half a finger for half an hour and a joint for a quarter.',
      equation: `${hours ? `${hours} ${hours === 1n ? 'hour' : 'hours'} + ` : ''}${fraction === 2n ? '1/2 hour' : `${fraction}/4 hour`} = ${valueText(value)} hours`,
      notes: [
        'This explains the documented fractional time meanings. The hand artwork currently illustrates whole hours.',
      ],
    };
  }
  if (!whole(value)) {
    return {
      text: `The exact modern result is ${valueText(value)}. This exhibit does not supply historical ${value.numerator < 0n ? 'negative-number' : 'fractional'} notation for this entry.`,
      notes: [
        'A display limit does not establish what a community could calculate. Egyptian fractions, Babylonian fractional places, and Chinese signed rod arithmetic, for example, have their own documented histories.',
      ],
    };
  }
  const n = value.numerator;
  if (!inRange(n, system)) {
    return {
      text: `The result ${integerText(n)} is outside this entry’s illustrated range. ${system.howItWorks}`,
      notes: [
        'The calculation remains exact in familiar digits. The notation range is an exhibit limit.',
      ],
    };
  }
  if (n > FORMATION_LIMIT) {
    return {
      text: system.howItWorks,
      notes: [
        'This number’s full decomposition is longer than the teaching panel allows. The representation above still follows the entry’s supported notation rules.',
      ],
    };
  }
  const specimen = represent(value, system);
  const wordTokens = (text: string, lang?: string): RenderToken[] => [{ text, lang }];
  if (!specimen.tokens.length) {
    return {
      text: specimen.reason ?? 'No documented example is available for this value.',
      notes: [
        'The dictionary contains selected attested examples; no word or sign is invented for this input.',
      ],
    };
  }
  if (system.engine === 'spoken') return spokenNumberLesson(system, n, specimen);
  const countingLesson = spokenLesson(system, n, specimen);
  if (countingLesson) return countingLesson;
  if (system.id === 'yoruba') {
    const construction = yorubaConstruction(n)!;
    const vocabulary = spokenDictionary(system);
    const word = (amount: bigint) =>
      vocabulary.find((entry) => entry.meaning === String(amount))!.word;
    if (n <= 10n || n === 20n || n === 30n) {
      return {
        text: 'This value has a basic counting name.',
        parts: [{ text: `${word(n)} means ${n}.`, tokens: specimen.tokens }],
        sources: [yorubaSource],
      };
    }
    if (n < 20n) {
      const adds = n < 15n;
      const anchor = adds ? 10n : 20n;
      const amount = adds ? n - anchor : anchor - n;
      return {
        text: `This name expresses ${adds ? 'addition to ten' : 'subtraction from twenty'}.`,
        parts: [
          {
            text: `Start with ${word(anchor)}: ${anchor}.`,
            tokens: wordTokens(word(anchor), 'yo'),
          },
          {
            text: `${adds ? 'Add' : 'Take away'} ${amount}: ${construction}.`,
            tokens: specimen.tokens,
          },
        ],
        equation: construction,
        sources: [yorubaSource],
      };
    }
    if (n % 10n === 0n) {
      return {
        text:
          n % 20n === 0n
            ? 'The name counts groups of twenty.'
            : 'The name takes ten from the next multiple of twenty.',
        parts: [{ text: `${word(n)}: ${construction}.`, tokens: specimen.tokens }],
        equation: construction,
        sources: [yorubaSource],
      };
    }
    const remainder = n % 10n;
    const adds = remainder <= 4n;
    const amount = adds ? remainder : 10n - remainder;
    const anchor = adds ? n - remainder : n + 10n - remainder;
    const anchorExpansion = yorubaConstruction(anchor)!;
    return {
      text: `The name puts the ${adds ? 'added' : 'subtracted'} amount first, then the operation and the larger number.`,
      parts: [
        { text: `${word(amount)} supplies ${amount}.`, tokens: wordTokens(word(amount), 'yo') },
        {
          text: `${adds ? 'Lé means add' : 'Dín means subtract'}. The linking word ní joins it to the larger number; these words contract in a complete name.`,
          tokens: wordTokens(adds ? 'lé' : 'dín', 'yo'),
        },
        {
          text: `${word(anchor)} means ${anchor}${anchor > 30n ? `: ${anchorExpansion}` : ''}. ${adds ? `Add ${amount} to` : `Subtract ${amount} from`} ${anchor}: ${anchor} ${adds ? '+' : '−'} ${amount} = ${n}.`,
          tokens: wordTokens(word(anchor), 'yo'),
        },
      ],
      equation: construction,
      notes: [
        'These steps explain number-name formation. Counting-object forms, contractions, and dialects vary.',
      ],
      sources: [yorubaSource],
    };
  }
  if (system.id === 'mangarevan') {
    return {
      text: 'The words count groups of counting units. First fix what one unit contains.',
      parts:
        n === 273n
          ? [
              {
                text: 'Toru means three; varu names a group of 80 here: 3 × 80 = 240.',
                tokens: wordTokens('toru varu', 'mrv'),
              },
              {
                text: 'Add paua (20) and takau (10): 240 + 20 + 10 = 270.',
                tokens: wordTokens('paua takau', 'mrv'),
              },
              {
                text: 'The final toru adds three units: 270 + 3 = 273.',
                tokens: wordTokens('toru', 'mrv'),
              },
            ]
          : [
              {
                text:
                  system.examples.find((entry) => entry.value === String(n))?.explanation ??
                  specimen.explanation,
                tokens: specimen.tokens,
              },
            ],
      equation: `${additiveTerms(n, [80, 40, 20, 10, 1]).join(' + ')} = ${n} counting units`,
      notes: [
        'One counting unit can mean one turtle, two fish, four coconuts, or eight octopuses. For fish in pairs, multiply the unit total by two.',
      ],
      sources: [mangarevanSource],
    };
  }
  if (system.id === 'oksapmin') {
    return {
      text: 'Touch one body position for each object counted.',
      parts: [
        { text: 'Begin at the thumb: the first position counts 1.' },
        {
          text:
            system.examples.find((entry) => entry.value === String(n))?.explanation ??
            specimen.explanation,
          tokens: specimen.tokens,
        },
      ],
      notes: ['The 27 positions form an ordered counting path; they are not positional digits.'],
    };
  }
  if (system.id === 'cistercian-gestures') {
    const first = n > 5n ? 5n : n;
    const second = n - first;
    return {
      text: 'One extended finger represents one hour.',
      parts: [
        {
          text: `Show ${first} ${first === 1n ? 'finger' : 'fingers'} on one hand: ${first} ${first === 1n ? 'hour' : 'hours'}.`,
          tokens: [specimen.tokens[0]],
        },
        ...(second
          ? [
              {
                text: `Show ${second} more on the other hand: ${first} + ${second} = ${n} hours.`,
                tokens: [specimen.tokens[1]],
              },
            ]
          : []),
      ],
      equation: second ? `${first} + ${second} = ${n} hours` : undefined,
      notes: [
        'La Trappe’s 1824 vocabulary specifies finger totals, not which fingers or hand to use. Half a finger means half an hour; a joint means a quarter-hour.',
      ],
    };
  }
  if (system.id === 'medieval-finger-counting') {
    const units = Number(n % 10n);
    const tens = Number((n / 10n) % 10n);
    const hundreds = Number((n / 100n) % 10n);
    const thousands = Number(n / 1000n);
    return {
      text: 'Bede assigns a separate finger group to each decimal place. The original woodcut illustrates those groups separately; combine them on the signer’s left and right hands.',
      parts: [
        ...(n % 100n
          ? [
              {
                text: `On the left hand, make ${tens * 10} with thumb and index: ${bedeTensRules[tens]} Make ${units} with the outer fingers: ${bedeUnitRules[units]}`,
                tokens: specimen.tokens.filter((token) =>
                  token.glyph?.startsWith('hand-bede-left-'),
                ),
              },
            ]
          : []),
        ...(n / 100n
          ? [
              {
                text: `On the right hand, repeat the left-hand ${hundreds * 10} shape on thumb and index for ${hundreds * 100}, and the left-hand ${thousands} outer-finger shape for ${thousands * 1000}.`,
                tokens: specimen.tokens.filter((token) =>
                  token.glyph?.startsWith('hand-bede-right-'),
                ),
              },
            ]
          : []),
        { text: 'Hold the finger groups together and add their contributions.' },
      ],
      equation: `${placeTerms(n, 10).join(' + ')} = ${n}`,
    };
  }
  if (system.engine === 'explainer') {
    const example = system.examples.find((entry) => entry.value === String(n))!;
    let parts: Explanation['parts'];
    let equation: string | undefined;
    if (system.id === 'maori') {
      const units = n % 10n;
      parts =
        n === 20n
          ? [
              {
                text: 'Rua means two; tekau means ten. Rua before tekau counts two tens.',
                tokens: specimen.tokens,
              },
            ]
          : [
              { text: 'Tekau means ten.', tokens: wordTokens('tekau', 'mi') },
              {
                text: `Mā joins the extra ${units}: ${example.words!.split(' ').at(-1)}.`,
                tokens: wordTokens(example.words!.split(' ').slice(1).join(' '), 'mi'),
              },
            ];
      equation = n === 20n ? '2 × 10 = 20' : `10 + ${units} = ${n}`;
    } else if (system.id === 'navajo' && [12n, 22n, 42n].includes(n)) {
      parts =
        n === 12n
          ? [
              {
                text: 'Naaki means two. The following teen element ts’áadah makes this ten plus two.',
                tokens: specimen.tokens,
              },
            ]
          : [
              {
                text:
                  n === 42n
                    ? 'Dízdiin names forty. Dóó bi’aan links it to the final naaki, two.'
                    : 'Naadiin names twenty. The following naaki adds two.',
                tokens: specimen.tokens,
              },
            ];
      equation = `${n - (n % 10n)} + ${n % 10n} = ${n}`;
    } else {
      parts = [{ text: example.explanation, tokens: specimen.tokens }];
    }
    return {
      text:
        system.structure === 'Spoken'
          ? 'Read the documented number expression.'
          : 'Read the documented signs.',
      parts,
      equation,
    };
  }
  const lesson = numeralLesson(system, n);
  if (lesson) {
    const { steps, ...explanation } = lesson;
    return { ...explanation, parts: steps };
  }
  return { text: specimen.explanation || system.howItWorks };
}

function canWork(calculation: ReasoningCalculation): boolean {
  return (
    whole(calculation.first) &&
    whole(calculation.second) &&
    calculation.first.numerator <= WORKED_LIMIT &&
    calculation.second.numerator <= WORKED_LIMIT
  );
}

function method(system: SystemDefinition, calculation: ReasoningCalculation): Method {
  const { first, second, operation } = calculation;
  const result = calculate(first, second, operation);
  const equation = `${valueText(first)} ${SIGNS[operation]} ${valueText(second)} = ${valueText(result)}`;
  const operationNames: Record<string, string> = {
    add: 'Addition',
    subtract: 'Subtraction',
    multiply: 'Multiplication',
    divide: 'Division',
  };
  const name = operationNames[operation];
  const general: Method = {
    title: `${name} in ${system.name}`,
    text: `The cited sources for this entry describe the notation but do not establish a specific ${name.toLowerCase()} procedure using these signs. The equation below is the calculator’s exact modern result.`,
    evidence:
      'Evidence limit: a way of writing or naming numbers does not by itself tell us how its users performed an operation. This does not imply that the community could not calculate.',
    equation,
  };
  if (!canWork(calculation))
    return {
      ...general,
      text: `The worked ${name.toLowerCase()} examples here cover nonnegative whole-number operands of at most nine digits. Your exact modern result is retained below; these inputs do not extend the historical demonstration.`,
    };
  const historical = operationLesson(system, calculation);
  if (historical) return historical;
  const a = first.numerator;
  const b = second.numerator;

  if (system.id === 'yoruba') {
    const anchor = ((a + 19n) / 20n) * 20n;
    const gap = anchor - a;
    const steps: string[] = [];
    if (a > 0n && gap && operation === 'add') {
      steps.push(
        `Use a nearby multiple of twenty: ${a} = ${anchor} − ${gap}. Then ${a} + ${b} = ${anchor} + ${b} − ${gap} = ${valueText(result)}.`,
      );
    } else if (a > 0n && gap && operation === 'subtract') {
      steps.push(
        `Use a nearby multiple of twenty: ${a} = ${anchor} − ${gap}. Then ${a} − ${b} = ${anchor} − (${gap} + ${b}) = ${valueText(result)}.`,
      );
    } else if (a > 0n && gap && operation === 'multiply') {
      steps.push(
        `A complement simplifies this multiplication: (${anchor} − ${gap}) × ${b} = ${anchor * b} − ${gap * b} = ${valueText(result)}.`,
      );
    } else return { ...general, sources: [yorubaSource] };
    return {
      title: `${name} · using a complement of twenty`,
      text: 'Yorùbá number names often use a nearby multiple of twenty. That structure can suggest a convenient complement for this calculation.',
      evidence:
        'Modern mathematical illustration: the name constructions are documented linguistic patterns. They do not establish this as a historical arithmetic procedure or every speaker’s mental method.',
      equation,
      steps,
      sources: [yorubaSource],
    };
  }

  if (system.id === 'mangarevan') {
    if (a > 799n || b > 799n)
      return {
        ...general,
        title: `${name} · regrouping through binary steps`,
        text: 'The verified mixed-system illustration covers counts through 799 counting units. Its special groups double through 10, 20, 40, and 80; this input is beyond the illustrated vocabulary range.',
        sources: [mangarevanSource],
      };
    const steps = [
      `Keep the object-dependent counting unit fixed. First count: ${additiveTerms(a, [80, 40, 20, 10, 1]).join(' + ') || '0'}; second count: ${additiveTerms(b, [80, 40, 20, 10, 1]).join(' + ') || '0'}.`,
    ];
    if (operation === 'add' || operation === 'subtract') {
      steps.push(
        operation === 'add'
          ? 'Combine like groups. Ten units form one takau; two takau form one paua; two paua form one tataua; two tataua form one varu.'
          : 'Remove like groups. When needed, split a varu into two tataua, a tataua into two paua, or a paua into two takau.',
      );
    } else if (operation === 'multiply') {
      steps.push(
        'Doubling shifts takau (10) to paua (20), paua to tataua (40), and tataua to varu (80). Other factors can combine doubling and addition.',
      );
    } else {
      steps.push(
        'Halving reverses the binary grouping steps: varu to tataua, tataua to paua, and paua to takau. Other divisors need further grouping or arithmetic.',
      );
    }
    steps.push(
      `The modern exact result is ${valueText(result)}${whole(result) && result.numerator <= 799n ? ` counting units = ${additiveTerms(result.numerator, [80, 40, 20, 10, 1]).join(' + ') || '0'}` : ''}.`,
    );
    return {
      title: `${name} · regrouping through binary steps`,
      text: 'Work with the groups of 10, 20, 40, and 80, keeping the counting unit fixed.',
      equation,
      steps,
      evidence:
        'Analytical reconstruction: these operations follow Bender and Beller’s analysis of the recorded vocabulary. Historical performance of these calculations was not observed.',
      sources: [mangarevanSource],
    };
  }

  return general;
}

function renderExplanation(explanation: Explanation, glyphs?: GlyphSet): string {
  const parts = explanation.parts?.length
    ? `<ol class="formation-steps">${explanation.parts
        .map((part) => {
          const illustration =
            glyphs && part.tokens?.length
              ? `<div class="formation-sign${part.tokens.some((token) => token.glyph?.startsWith('oksapmin-')) ? ' formation-body' : ''}">${renderRepresentation({ status: 'ok', layout: part.tokens[0].text !== undefined ? 'words' : 'row', tokens: part.tokens, explanation: part.text }, glyphs)}</div>`
              : '';
          return `<li>${illustration}<p>${escapeHTML(part.text)}</p></li>`;
        })
        .join('')}</ol>`
    : '';
  return `<p>${escapeHTML(explanation.text)}</p>${parts}${explanation.equation ? `<p class="math-check-label">Check</p><p class="math-equation">${escapeHTML(explanation.equation)}</p>` : ''}`;
}

function renderOperation(worked: Method, glyphs?: GlyphSet): string {
  const illustration = (tokens: RenderToken[] | undefined, text: string): string =>
    glyphs && tokens?.length
      ? `<div class="math-step-signs formation-sign${tokens.some((token) => token.glyph?.startsWith('oksapmin-')) ? ' formation-body' : ''}">${renderRepresentation({ status: 'ok', layout: tokens[0].text !== undefined ? 'words' : 'row', tokens, explanation: text }, glyphs)}</div>`
      : '';
  const parts: Explanation['parts'] = worked.parts ?? worked.steps?.map((text) => ({ text }));
  const steps = parts?.length
    ? `<ol class="math-steps">${parts
        .slice(0, MAX_STEPS)
        .map(
          (part) =>
            `<li>${illustration(part.tokens, part.text)}<p>${escapeHTML(part.text)}</p></li>`,
        )
        .join('')}</ol>`
    : '';
  const table = worked.table
    ? `<div class="math-table" role="region" aria-label="${escapeHTML(worked.table.caption)}" tabindex="0"><table><caption>${escapeHTML(worked.table.caption)}</caption><thead><tr>${worked.table.headings.map((heading) => `<th scope="col">${escapeHTML(heading)}</th>`).join('')}</tr></thead><tbody>${worked.table.rows.map((row) => `<tr${row.selected ? ' class="selected"' : ''}>${row.cells.map((cell) => `<td>${illustration(cell.tokens, cell.text)}<span>${escapeHTML(cell.text)}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div>`
    : '';
  const methodSources = (worked.sources ?? []).filter((source) => /^https?:\/\//.test(source.url));
  return `<h3>${escapeHTML(worked.title)}</h3><p>${escapeHTML(worked.text)}</p>${worked.evidence ? `<p class="math-evidence">${escapeHTML(worked.evidence)}</p>` : ''}${table}${steps}${worked.equation ? `<p class="math-equation">${escapeHTML(worked.equation)}</p>` : ''}${methodSources.length ? `<p class="math-method-sources">${methodSources.map((source) => `<a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)}</a>`).join(' · ')}</p>` : ''}`;
}

/** Render a bounded, source-linked worked example without changing calculator arithmetic. */
export function renderMathReasoning(
  system: SystemDefinition,
  value: Rational,
  calculation?: ReasoningCalculation,
  glyphs?: GlyphSet,
): string {
  const normalized = normalize(value);
  if (!normalized) {
    return '<div class="math-reasoning"><p>Division by zero has no defined numerical result.</p></div>';
  }
  const first = calculation && normalize(calculation.first);
  const second = calculation && normalize(calculation.second);
  let worked: Method | undefined;
  if (calculation && first && second && SIGNS[calculation.operation]) {
    try {
      worked = method(system, { first, second, operation: calculation.operation });
    } catch {
      worked = {
        title: `${({ add: 'Addition', subtract: 'Subtraction', multiply: 'Multiplication', divide: 'Division' } as Record<string, string>)[calculation.operation]} · undefined result`,
        text: 'Division by zero has no defined numerical result.',
      };
    }
  }
  const construction = worked ? undefined : formation(system, normalized);
  const sources = [
    ...new Map(
      [
        ...(construction?.sources ?? []),
        ...(worked?.sources ?? []),
        ...system.sources.slice(0, 2),
      ].map((source) => [source.url, source]),
    ).values(),
  ].filter((source) => /^https?:\/\//.test(source.url));
  const context = [...new Set([...(construction?.notes ?? []), ...(worked?.notes ?? [])])];
  const verb =
    system.structure === 'Spoken' || system.id === 'mangarevan'
      ? 'Read'
      : system.structure === 'Physical'
        ? 'Show'
        : 'Write';
  const lesson = worked
    ? renderOperation(worked, glyphs)
    : `<h3>${verb} ${escapeHTML(valueText(normalized))} in ${escapeHTML(system.name)}</h3>${renderExplanation(construction!, glyphs)}`;
  return `<div class="math-reasoning"${worked && calculation ? ` data-operation="${escapeHTML(calculation.operation)}"` : ''}>${lesson}<details class="math-references"><summary>Sources and notation notes</summary>${context.map((note) => `<p class="math-context">${escapeHTML(note)}</p>`).join('')}${sources.length ? `<p class="math-sources">${sources.map((source) => `<a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)}</a>`).join(' · ')}</p>` : ''}</details></div>`;
}
