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
}

// These limits bound the *teaching explanation*, not the calculator's exact arithmetic.
const FORMATION_LIMIT = 999_999_999_999n;
const WORKED_LIMIT = 999_999_999n;
const MAX_STEPS = 14;
const SIGNS: Record<string, string> = { add: '+', subtract: '−', multiply: '×', divide: '÷' };

const egyptianSource: Source = {
  title: 'Rhind Mathematical Papyrus · Chace translation, Egyptian arithmetic',
  url: 'https://en.wikisource.org/wiki/Page:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf/20',
};
const egyptianContext: Source = {
  title: 'Open University · Egyptian calculation',
  url: 'https://www.open.edu/openlearn/science-maths-technology/mathematics-statistics/egyptian-mathematics/content-section-1.1.2',
};
const rodSource: Source = {
  title: 'University of St Andrews · Chinese numerals and counting-board arithmetic',
  url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Chinese_numerals/',
};
const babylonianSource: Source = {
  title: 'Open University · Babylonian mathematics and reciprocal tables',
  url: 'https://www.open.edu/openlearn/mod/oucontent/view.php?id=1976&printable=1',
};
const romanSource: Source = {
  title: 'Oxford Classical Dictionary · Abacus',
  url: 'https://doi.org/10.1093/acrefore/9780199381135.013.1',
};
const mayaSource: Source = {
  title: 'Rojo-Garibaldi et al. · Mesoamerican positional number representation (2021)',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8022160/',
};
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

function positionalSteps(a: bigint, b: bigint, base: number, subtract = false): string[] {
  const steps: string[] = [];
  const radix = BigInt(base);
  let left = a;
  let right = b;
  let carry = 0n;
  let place = 1n;
  do {
    const x = left % radix;
    const y = right % radix;
    if (subtract) {
      const raw = x - carry - y;
      const borrowed = raw < 0n;
      steps.push(
        `Place worth ${place}: ${x}${carry ? ' − 1 already borrowed' : ''} − ${y}${borrowed ? ` is negative; exchange one group from the next place for ${base} here` : ''}. Leave ${borrowed ? raw + radix : raw} in this place.`,
      );
      carry = borrowed ? 1n : 0n;
    } else {
      const sum = x + y + carry;
      steps.push(
        `Place worth ${place}: ${x} + ${y}${carry ? ` + ${carry} carried` : ''} = ${sum}. Leave ${sum % radix}${sum >= radix ? ` and carry ${sum / radix} to the next place (${base} of this place make one next-place group)` : '; no carry'}.`,
      );
      carry = sum / radix;
    }
    left /= radix;
    right /= radix;
    place *= radix;
  } while ((left || right || (!subtract && carry)) && steps.length < MAX_STEPS - 1);
  return steps;
}

function groupedSteps(calculation: ReasoningCalculation, base: number): string[] {
  const a = calculation.first.numerator;
  const b = calculation.second.numerator;
  const result = calculate(calculation.first, calculation.second, calculation.operation);
  if (calculation.operation === 'add') return positionalSteps(a, b, base);
  if (calculation.operation === 'subtract' && a >= b) return positionalSteps(a, b, base, true);
  if (calculation.operation === 'multiply') {
    const steps = [
      `Split the second factor into place-value groups: ${b} = ${placeTerms(b, base).join(' + ')}.`,
    ];
    let rest = b;
    let place = 1n;
    while (rest && steps.length < MAX_STEPS - 2) {
      const digit = rest % BigInt(base);
      if (digit) steps.push(`${a} × (${digit} × ${place}) = ${a * digit * place}.`);
      rest /= BigInt(base);
      place *= BigInt(base);
    }
    steps.push(
      `Add the partial products to get ${valueText(result)}${b === 0n ? ' (there are no groups to add)' : ''}.`,
    );
    return steps;
  }
  if (calculation.operation === 'divide' && b > 0n) {
    const q = a / b;
    const remainder = a % b;
    return [
      `Find how many whole groups of ${b} fit in ${a}: ${q} groups, since ${q} × ${b} = ${q * b}.`,
      `The amount left is ${a} − ${q * b} = ${remainder}.`,
      remainder
        ? `The exact modern result is ${q} + ${remainder}/${b} = ${valueText(result)}. This entry’s sign renderer covers whole numbers.`
        : `No remainder: ${a} ÷ ${b} = ${q}.`,
    ];
  }
  return [
    `${valueText(calculation.first)} ${SIGNS[calculation.operation]} ${valueText(calculation.second)} = ${valueText(result)} in familiar signed arithmetic.`,
  ];
}

function sexagesimalFraction(numerator: bigint, denominator: bigint): string {
  const parts: string[] = [];
  let remainder = numerator % denominator;
  for (let i = 0; remainder && i < 6; i++) {
    remainder *= 60n;
    parts.push(String(remainder / denominator));
    remainder %= denominator;
  }
  const integer = baseDigits(numerator / denominator, 60).join(', ');
  return `${integer}${parts.length ? `; ${parts.join(', ')}` : ''}${remainder ? ', …' : ''}`;
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
  const general: Method = {
    title: 'Calculate the result',
    text: `Perform the operation, then express the result in ${system.name}.`,
    equation,
    notes: [
      'This calculation uses exact modern arithmetic. The notation sources do not specify a historical method for this operation.',
    ],
  };
  const boundedNote =
    'Worked steps use nonnegative whole-number operands of at most nine digits. Larger, signed, or fractional calculations keep their exact modern result without extending this historical demonstration.';
  if (!canWork(calculation)) return { ...general, notes: [boundedNote] };
  const a = first.numerator;
  const b = second.numerator;

  if (system.id === 'egyptian' && (operation === 'multiply' || operation === 'divide')) {
    const multiplication = operation === 'multiply';
    const count = multiplication ? (a < b ? a : b) : b ? a / b : 0n;
    const amount = multiplication ? (a < b ? b : a) : b;
    if (!multiplication && (b === 0n || a % b !== 0n)) {
      return {
        title: 'Division through multiplication',
        text: 'Egyptian division looked for the multiplier that produces the dividend. Nonintegral answers could involve unit fractions, as documented in the Rhind papyrus. This panel does not reconstruct its fraction procedures.',
        equation,
        sources: [egyptianSource, egyptianContext],
      };
    }
    if (count > 1023n) {
      return {
        title: multiplication ? 'Doubling and selecting' : 'Division through multiplication',
        text: 'Double an amount repeatedly, then select and add the rows needed for the target. The doubling table here is limited to ten rows; the modern result remains exact.',
        equation,
        sources: [egyptianSource, egyptianContext],
      };
    }
    const rows: string[] = [
      multiplication
        ? `Build ${count} copies of ${amount} by doubling. Select rows whose copy counts add to ${count}.`
        : `Double the divisor ${b}; find rows whose amounts add to the dividend ${a}. Their copy counts give the quotient.`,
    ];
    const keptCounts: bigint[] = [];
    const keptAmounts: bigint[] = [];
    for (let copies = 1n; copies <= count; copies *= 2n) {
      const keep = Boolean(count & copies);
      rows.push(
        `${keep ? 'Keep' : 'Pass'}: ${copies} ${copies === 1n ? 'copy' : 'copies'} → ${copies * amount}.`,
      );
      if (keep) {
        keptCounts.push(copies);
        keptAmounts.push(copies * amount);
      }
    }
    rows.push(
      `Selected copy counts: ${keptCounts.join(' + ') || '0'} = ${count}. Selected amounts: ${keptAmounts.join(' + ') || '0'} = ${count * amount}.`,
    );
    return {
      title: multiplication ? 'Doubling and selecting' : 'Division through multiplication',
      text: 'Double both columns. Select the rows that make the required count, then add their amounts.',
      equation,
      steps: rows,
      notes: [
        'The Rhind papyrus uses hieratic writing. This example applies its doubling method; the hieroglyphs above use a different Egyptian numeral repertoire.',
      ],
      sources: [egyptianSource, egyptianContext],
    };
  }

  if (system.id === 'babylonian' && operation === 'divide' && b > 0n) {
    let regular = b;
    for (const factor of [2n, 3n, 5n]) while (regular % factor === 0n) regular /= factor;
    const reciprocal = sexagesimalFraction(1n, b);
    return {
      title: 'Multiply by a reciprocal',
      text: 'Babylonian mathematical tablets document reciprocal tables used for division. Here is a modern worked application with explicit place separators and scale.',
      equation,
      steps: [
        `Find the reciprocal of ${b}: 1/${b} = ${reciprocal} in modern sexagesimal transcription. The semicolon separates whole and fractional places.`,
        `Replace division by multiplication: ${a} ÷ ${b} = ${a} × (1/${b}) = ${valueText(result)}.`,
        regular === 1n
          ? 'The divisor has no prime factors other than 2, 3, and 5, so its reciprocal has a terminating base-60 expansion.'
          : 'This divisor’s reciprocal does not terminate in base 60. Historical computations could use approximations; the fraction result here stays exact.',
      ],
      notes: [
        'At most six fractional places are shown. An ellipsis marks omitted places, not an exact finite reciprocal. The punctuation is a modern reading aid; historical scale depended on context.',
      ],
      sources: [babylonianSource],
    };
  }

  if (system.id === 'yoruba') {
    const steps = [
      `First operand’s name construction: ${yorubaConstruction(a) ?? 'outside the verified 1–100 examples'}.`,
      `Second operand’s name construction: ${yorubaConstruction(b) ?? 'outside the verified 1–100 examples'}.`,
    ];
    const anchor = ((a + 19n) / 20n) * 20n;
    const gap = anchor - a;
    if (a > 0n && gap && operation === 'add' && b >= gap) {
      steps.push(
        `Choose a convenient multiple of twenty for this calculation: ${a} = ${anchor} − ${gap}. Then ${a} + ${b} = (${anchor} − ${gap}) + ${b} = ${anchor} + ${b - gap} = ${valueText(result)}.`,
      );
    } else if (a > 0n && gap && operation === 'multiply') {
      steps.push(
        `A complement can simplify this multiplication: (${anchor} − ${gap}) × ${b} = ${anchor * b} − ${gap * b} = ${valueText(result)}.`,
      );
    } else {
      steps.push(`Work the operation: ${equation}.`);
    }
    const construction = whole(result) ? yorubaConstruction(result.numerator) : undefined;
    if (construction)
      steps.push(`Express the result using its number-name construction: ${construction}.`);
    return {
      title: 'Number names and useful regrouping',
      text: 'Use a nearby multiple of twenty to regroup the calculation.',
      equation,
      steps,
      notes: [
        'The name constructions are documented linguistic patterns. The complement calculation is a modern mathematical illustration, not a claim about every speaker’s mental method.',
      ],
      sources: [yorubaSource],
    };
  }

  if (system.id === 'mangarevan') {
    if (a > 799n || b > 799n)
      return {
        ...general,
        title: 'Regrouping through binary steps',
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
      title: 'Regrouping through binary steps',
      text: 'Work with the groups of 10, 20, 40, and 80, keeping the counting unit fixed.',
      equation,
      steps,
      notes: [
        'These operations follow Bender and Beller’s analytical reconstruction from the recorded vocabulary. Historical performance of these calculations was not observed.',
      ],
      sources: [mangarevanSource],
    };
  }

  if (
    system.id === 'cistercian' ||
    system.id === 'cistercian-gestures' ||
    system.id === 'medieval-finger-counting'
  ) {
    return {
      title: 'A quantity to record or communicate',
      text: 'Calculate the quantity first, then express it with the signs or hand positions.',
      equation,
      notes: [
        'The cited description does not supply a general arithmetic algorithm for these signs or hand positions.',
      ],
      steps: [
        `Perform the operation in the calculator: ${equation}.`,
        whole(result) && inRange(result.numerator, system)
          ? `Read the result ${result.numerator} using the quantity’s documented place or gesture rules above.`
          : 'The result has no supported sign or gesture in this entry; keep the exact result in familiar digits.',
      ],
    };
  }

  if (
    system.id === 'rods' ||
    system.id === 'suzhou' ||
    system.id === 'roman' ||
    system.id === 'maya' ||
    system.id === 'kaktovik' ||
    system.id === 'babylonian' ||
    system.id === 'egyptian'
  ) {
    const base = system.radix ?? 10;
    const isRods = system.id === 'rods';
    const isRoman = system.id === 'roman';
    const context = isRods
      ? 'Chinese texts document decimal rod-board arithmetic. These steps are a modern teaching application, rather than a transcription of a historical problem.'
      : isRoman
        ? 'Roman-style abaci used counters in numerical columns. This is a modern illustration of that regrouping, followed by writing the result.'
        : `This modern regrouping exercise uses the ${base}-based number structure. It does not reconstruct a historical arithmetic procedure.`;
    return {
      title: isRods
        ? 'Regrouping on a counting board'
        : isRoman
          ? 'Regrouping counters'
          : `Working with groups of ${base}`,
      text: isRods
        ? 'Work in decimal columns. Ten in one column can be exchanged for one in the next.'
        : isRoman
          ? 'Exchange five unit counters for one five-counter, and two fives for one ten.'
          : `Work with groups of ${base}. ${base} in one place makes one in the next place.`,
      equation,
      steps: groupedSteps(calculation, base),
      notes: [
        context,
        ...(system.id === 'maya'
          ? [
              'The base-20 exercise uses the app’s ordinary vigesimal layout. It does not use the Long Count’s 360-day third position.',
            ]
          : []),
      ],
      sources: isRods
        ? [rodSource]
        : isRoman
          ? [romanSource]
          : system.id === 'maya'
            ? [mayaSource]
            : system.id === 'babylonian'
              ? [babylonianSource]
              : undefined,
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
  const construction = formation(system, normalized);
  const first = calculation && normalize(calculation.first);
  const second = calculation && normalize(calculation.second);
  let worked: Method | undefined;
  if (calculation && first && second && SIGNS[calculation.operation]) {
    try {
      worked = method(system, { first, second, operation: calculation.operation });
    } catch {
      worked = {
        title: 'Undefined operation',
        text: 'Division by zero has no defined numerical result.',
      };
    }
  }
  const sources = [
    ...new Map(
      [
        ...(construction.sources ?? []),
        ...(worked?.sources ?? []),
        ...system.sources.slice(0, 2),
      ].map((source) => [source.url, source]),
    ).values(),
  ].filter((source) => /^https?:\/\//.test(source.url));
  const context = [...new Set([...(construction.notes ?? []), ...(worked?.notes ?? [])])];
  const verb =
    system.structure === 'Spoken' || system.id === 'mangarevan'
      ? 'Read'
      : system.structure === 'Physical'
        ? 'Show'
        : 'Write';
  const operation = worked
    ? `<h3>${escapeHTML(worked.title)}</h3><p>${escapeHTML(worked.text)}</p>${
        worked.steps?.length
          ? `<ol class="math-steps">${worked.steps
              .slice(0, MAX_STEPS)
              .map((step) => `<li>${escapeHTML(step)}</li>`)
              .join('')}</ol>`
          : ''
      }${worked.equation ? `<p class="math-equation">${escapeHTML(worked.equation)}</p>` : ''}`
    : '';
  return `<div class="math-reasoning">${operation}<h3>${verb} ${escapeHTML(valueText(normalized))} in ${escapeHTML(system.name)}</h3>${renderExplanation(construction, glyphs)}<details class="math-references"><summary>Sources and notation notes</summary>${context.map((note) => `<p class="math-context">${escapeHTML(note)}</p>`).join('')}${sources.length ? `<p class="math-sources">${sources.map((source) => `<a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.title)}</a>`).join(' · ')}</p>` : ''}</details></div>`;
}
