import type { ArithmeticOperation } from './arithmetic-evidence';
import type { OperationLesson, OperationPart } from './operation-lessons';
import type { RenderToken, SystemDefinition } from './types';
import { oksapminPositions } from './pacific-counts';
import { rational } from './numbers';
import { represent } from './format';

type GroupOperation = Extract<ArithmeticOperation, 'multiply' | 'divide'>;

function small(n: bigint): string {
  const value = String(n);
  return value.length <= 24
    ? value
    : `${value.slice(0, 10)}…${value.slice(-6)} (${value[0] === '-' ? value.length - 1 : value.length} digits)`;
}

function bodyTokens(system: SystemDefinition, n: bigint): RenderToken[] | undefined {
  if (n < 1n || n > 27n || n < BigInt(system.min) || n > BigInt(system.max)) return;
  const represented = represent(rational(n), system);
  return represented.status === 'ok' ? represented.tokens : undefined;
}

function position(n: bigint): string {
  return `${oksapminPositions[Number(n) - 1].part} (${n})`;
}

function part(system: SystemDefinition, text: string, endpoint?: bigint): OperationPart {
  return { text, tokens: endpoint === undefined ? undefined : bodyTokens(system, endpoint) };
}

/** Explicit block-counting extensions; neither operation is claimed as observed traditional practice. */
export function oksapminOperationLesson(
  system: SystemDefinition,
  a: bigint,
  b: bigint,
  operation: GroupOperation,
): OperationLesson {
  const multiply = operation === 'multiply';
  const lesson: OperationLesson = {
    title: `${multiply ? 'Multiplication' : 'Division'} · counting body-path blocks`,
    text: 'Use the ordered body path to count the quantity in complete equal blocks. Keep a separate tally of completed blocks so a body position is not confused with the number of groups.',
    evidence:
      'Teaching reconstruction: Saxe documents the body sequence and its later addition/subtraction adaptations. This block-counting multiplication/division is an explicit extension, not an observed traditional algorithm.',
    equation: '',
    sources: [
      {
        title: 'Geoffrey Saxe · Oksapmin counting and extension to arithmetic, 1978–2014',
        url: 'https://culturecognition.com/counting-and-extension-to-arithmetic-1978-2014',
        detail:
          'Primary field-research commentary documents coordinated counts for addition/subtraction. Multiplication and division here are labeled teaching extensions.',
      },
      {
        title: 'Geoffrey Saxe · Oksapmin Counting System',
        url: 'https://culturecognition.com/new-page-3',
        detail:
          'The researcher verifies the body-path order and arbitrary counting direction; this app illustrates only positions 1–27.',
      },
    ],
    notes: [
      'The 27 body positions are an ordered sequence, not positional base-27 digits. No zero position, negative position or unimplemented later traversal is drawn.',
    ],
  };
  if (!multiply && b === 0n) {
    lesson.equation = `${small(a)} ÷ 0 is undefined`;
    lesson.parts = [{ text: 'A group size of zero cannot define a numerical quotient.' }];
    return lesson;
  }
  const result = multiply ? rational(a * b) : rational(a, b);
  const resultText = `${small(result.numerator)}${result.denominator === 1n ? '' : `/${small(result.denominator)}`}`;
  lesson.equation = `${small(a)} ${multiply ? '×' : '÷'} ${small(b)} = ${resultText}`;
  if (
    system.id !== 'oksapmin' ||
    system.engine !== 'pacific' ||
    a < 0n ||
    b < 0n ||
    a > 27n ||
    b > 27n
  ) {
    lesson.parts = [
      {
        text: `The first-traversal exhibit boundary is positions 1–27. These operands require a different or extended representation; the exact modern result ${resultText} is retained without inventing body positions.`,
      },
    ];
    return lesson;
  }
  if (multiply) {
    const count = a < b ? a : b;
    const amount = a < b ? b : a;
    if (!count) {
      lesson.parts = [
        part(
          system,
          'Zero complete blocks contain no objects. There is no body position for zero to draw.',
        ),
        part(system, 'The product is 0; no body position is supplied.'),
      ];
      return lesson;
    }
    const completeWithinPath = 27n / amount;
    const shown = count < completeWithinPath ? count : completeWithinPath;
    const parts = [
      part(
        system,
        `Make ${count} blocks of ${amount} positions each. Begin counting with the first thumb; the separate block tally starts before the first completed block.`,
      ),
    ];
    for (let block = 1n; block <= shown; block++) {
      const start = (block - 1n) * amount + 1n;
      const end = block * amount;
      parts.push(
        part(
          system,
          `Block ${block}: count positions ${start}–${end}, from ${position(start)} through ${position(end)}. These ${amount} forward counts bring the running quantity to ${end}; the separate tally records ${block} complete blocks.`,
          end,
        ),
      );
    }
    if (shown < count)
      parts.push(
        part(
          system,
          `After ${shown} complete blocks, ${shown * amount} positions have been counted. Completing the next block would pass the first-traversal exhibit boundary at 27. The remaining ${count - shown} blocks are included in the exact product, but no later body positions or cycles are invented.`,
        ),
      );
    parts.push(
      part(
        system,
        `${count} blocks of ${amount} contain ${a * b}: ${lesson.equation}.${a * b <= 27n ? ` The final position is ${position(a * b)}.` : ' The product exceeds the illustrated first traversal; its quantity is shown in familiar digits.'}`,
        a * b,
      ),
    );
    lesson.parts = parts;
    return lesson;
  }

  const quotient = a / b;
  const remainder = a % b;
  const shown = quotient < 10n ? quotient : 10n;
  const parts = [
    part(
      system,
      `The dividend reaches ${a ? position(a) : 'no counted positions'}. Form complete blocks of ${b} positions from the start of the path, keeping their count on a separate tally.`,
      a,
    ),
  ];
  for (let block = 1n; block <= shown; block++) {
    const start = (block - 1n) * b + 1n;
    const end = block * b;
    parts.push(
      part(
        system,
        `Complete group ${block}: count positions ${start}–${end}, from ${position(start)} through ${position(end)}. The separate tally now records ${block} groups; ${a - end} of the dividend’s positions remain unallocated.`,
        end,
      ),
    );
  }
  if (shown < quotient)
    parts.push(
      part(
        system,
        `Continue the remaining ${quotient - shown} blocks with the same ${b}-position length. The last complete block reaches ${position(quotient * b)}; these repeated intermediate diagrams are abbreviated.`,
      ),
    );
  parts.push(
    part(
      system,
      `${quotient} complete groups use ${quotient * b} positions. The separate group count is ${quotient}${quotient ? `, represented by ${position(quotient)}` : '; no zero body position is drawn'}. Check: ${b} × ${quotient} + ${remainder} = ${a}.`,
      quotient,
    ),
  );
  parts.push(
    remainder
      ? part(
          system,
          `Positions ${quotient * b + 1n}–${a} remain after the complete blocks. Recount those ${remainder} positions on a separate count: the remainder reaches ${position(remainder)}. The exact modern result is ${quotient} + ${remainder}/${b} = ${resultText}; no fractional body position is invented.`,
          remainder,
        )
      : part(
          system,
          `No positions remain unallocated. The quotient is ${quotient}; no zero remainder position is drawn.`,
          quotient,
        ),
  );
  lesson.parts = parts;
  return lesson;
}
