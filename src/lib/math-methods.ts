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
import type { OperationPart, OperationLesson } from './operation-lessons';
import { completeOperationLesson } from './complete-operation-lessons';
import { arithmeticProfiles } from '../data/arithmetic-profiles';
import type { ArithmeticOperation, EvidenceKind } from './arithmetic-evidence';
import { renderArithmeticWorkspace } from './arithmetic-workspace';
import { mayaProductLesson } from './maya-product-lesson';
import { mangarevanOperationLesson } from './mangarevan-operation-lesson';
import { oksapminOperationLesson } from './oksapmin-operation-lesson';
import { nativePositionalLesson, nativeRationalLesson } from './native-arithmetic';
import { babylonianNativeLesson } from './babylonian-arithmetic';

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
  parts?: OperationPart[];
}

interface Method extends Explanation {
  title: string;
  steps?: string[];
  evidence?: string;
  evidenceKind?: EvidenceKind;
  table?: OperationLesson['table'];
  referenceTables?: OperationLesson['referenceTables'];
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
    if (system.region === 'Global')
      return {
        text: `The exact result is ${valueText(value)}. This converter currently illustrates nonnegative whole numbers only.`,
        notes: [system.caveat],
      };
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
  if (
    n > FORMATION_LIMIT ||
    (system.engine === 'positional' && baseDigits(n, system.radix ?? 10).length >= MAX_STEPS)
  ) {
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

function method(system: SystemDefinition, calculation: ReasoningCalculation): Method {
  const operation = calculation.operation as ArithmeticOperation;
  const profile = arithmeticProfiles[system.id];
  if (!profile) throw new Error(`Missing researched arithmetic profile: ${system.id}`);
  const withinWorkedRange =
    whole(calculation.first) &&
    whole(calculation.second) &&
    calculation.first.numerator <= WORKED_LIMIT &&
    calculation.second.numerator <= WORKED_LIMIT &&
    calculate(calculation.first, calculation.second, operation).numerator >= 0n;
  if (withinWorkedRange) {
    if (system.id === 'babylonian')
      return operation === 'multiply' || operation === 'divide'
        ? babylonianNativeLesson(
            system,
            calculation.first.numerator,
            calculation.second.numerator,
            operation,
          )
        : nativePositionalLesson(
            system,
            calculation.first.numerator,
            calculation.second.numerator,
            operation,
          );
    if (
      ['binary', 'hexadecimal', 'medefaidrin', 'kaktovik'].includes(system.id) ||
      (system.id === 'maya' && operation !== 'multiply')
    )
      return nativePositionalLesson(
        system,
        calculation.first.numerator,
        calculation.second.numerator,
        operation,
      );
    if (system.id === 'oksapmin' && (operation === 'multiply' || operation === 'divide'))
      return {
        ...oksapminOperationLesson(
          system,
          calculation.first.numerator,
          calculation.second.numerator,
          operation,
        ),
        evidenceKind: 'reconstruction',
      };
    if (system.id === 'mangarevan')
      return {
        ...mangarevanOperationLesson(
          system,
          calculation.first.numerator,
          calculation.second.numerator,
          operation,
        ),
        evidenceKind: 'reconstruction',
      };
    if (system.id === 'maya' && operation === 'multiply')
      return {
        ...mayaProductLesson(system, calculation.first.numerator, calculation.second.numerator),
        evidenceKind: 'reconstruction',
      };
    if (
      !['roman', 'mangarevan', 'yoruba'].includes(system.id) &&
      !(system.id === 'egyptian' && operation === 'subtract')
    ) {
      const specialized = operationLesson(system, calculation);
      if (specialized) {
        if (specialized.parts?.length) {
          const initial = represent(calculation.first, system);
          if (!specialized.parts.some((part) => part.tokens?.length) && initial.tokens.length <= 32)
            specialized.parts[0].tokens = initial.tokens;
          const result = calculate(calculation.first, calculation.second, operation);
          const final = represent(result, system);
          if (final.tokens.length && final.tokens.length <= 32)
            specialized.parts[specialized.parts.length - 1].tokens = final.tokens;
        }
        return { ...specialized, evidenceKind: profile.evidence[operation] };
      }
    }
  }
  if (
    !withinWorkedRange &&
    ((system.radix && system.radix !== 10) ||
      ['mexica', 'yoruba', 'mangarevan', 'ethiopic'].includes(system.id))
  )
    return nativeRationalLesson(system, calculation.first, calculation.second, operation);
  return completeOperationLesson(system, { ...calculation, operation }, profile);
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
      ? `<div class="math-step-signs formation-sign${tokens.some((token) => token.glyph?.startsWith('oksapmin-')) ? ' formation-body' : ''}">${renderRepresentation({ status: 'ok', layout: tokens[0].text !== undefined ? 'words' : tokens.some((token) => token.glyph?.startsWith('maya-')) ? 'stack' : tokens.some((token) => token.glyph?.startsWith('khipu-')) ? 'cord' : 'row', tokens, explanation: text }, glyphs)}</div>`
      : '';
  const parts: Explanation['parts'] = worked.parts ?? worked.steps?.map((text) => ({ text }));
  const steps = parts?.length
    ? `<ol class="math-steps">${parts
        .slice(0, MAX_STEPS)
        .map(
          (part) =>
            `<li>${part.workspace ? renderArithmeticWorkspace(part.workspace) : ''}${illustration(part.tokens, part.text)}${part.text
              .split('\n')
              .map((line) => `<p>${escapeHTML(line)}</p>`)
              .join(
                '',
              )}${part.hint ? `<small class="math-decimal-hint">${escapeHTML(part.hint)}</small>` : ''}</li>`,
        )
        .join('')}</ol>`
    : '';
  const renderTable = (table: NonNullable<Method['table']>, reference = false): string =>
    `<div class="math-table${reference ? ' math-reference-table' : ''}" data-columns="${table.headings.length}" role="region" aria-label="${escapeHTML(table.caption)}" tabindex="0"><table role="table"><caption>${escapeHTML(table.caption)}</caption><thead><tr role="row">${table.headings.map((heading) => `<th scope="col" role="columnheader">${escapeHTML(heading)}</th>`).join('')}</tr></thead><tbody>${table.rows
      .map(
        (row) =>
          `<tr role="row"${row.selected ? ' class="selected"' : ''}>${row.cells
            .map(
              (cell, index) =>
                `<td role="cell"><span class="math-cell-label" aria-hidden="true">${escapeHTML(table.headings[index] ?? '')}</span><div class="math-cell-content">${illustration(cell.tokens, cell.text)}${cell.text
                  .split('\n')
                  .map((line) => `<span class="math-cell-line">${escapeHTML(line)}</span>`)
                  .join(
                    '',
                  )}${cell.hint ? `<small class="math-decimal-hint">${escapeHTML(cell.hint)}</small>` : ''}</div></td>`,
            )
            .join('')}</tr>`,
      )
      .join('')}</tbody></table></div>`;
  const table = worked.table ? renderTable(worked.table) : '';
  const references = (worked.referenceTables ?? [])
    .map((reference) => {
      const used = reference.rows.filter((row) => row.selected);
      return `<div class="math-table-reference">${renderTable({ ...reference, rows: used.length ? used : reference.rows.slice(0, 3) }, true)}<details class="math-table-more"><summary>${escapeHTML(reference.fullLabel ?? 'Full table')}</summary>${renderTable(reference, true)}</details></div>`;
    })
    .join('');
  return `<h3>${escapeHTML(worked.title)}</h3><p>${escapeHTML(worked.text)}</p>${worked.evidence ? `<p class="math-evidence"${worked.evidenceKind ? ` data-evidence="${worked.evidenceKind}"` : ''}>${escapeHTML(worked.evidence)}</p>` : ''}${references}${table}${steps}${worked.equation ? `<p class="math-equation">${escapeHTML(worked.equation)}</p>` : ''}`;
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
  return `<div class="math-reasoning"${worked && calculation ? ` data-operation="${escapeHTML(calculation.operation)}"` : ''}>${lesson}<details class="math-references"><summary>Sources and notation notes</summary>${context.map((note) => `<p class="math-context">${escapeHTML(note)}</p>`).join('')}${sources.length ? `<p class="${worked ? 'math-method-sources' : 'math-sources'}">${sources.map((source) => `<a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)}</a>`).join(' · ')}</p>` : ''}</details></div>`;
}
