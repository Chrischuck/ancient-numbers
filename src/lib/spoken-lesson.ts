import type { RenderToken, Representation, SystemDefinition } from './types';
import { representAmericanWords } from './spoken-americas';
import { representPolynesianWords } from './spoken-polynesian';

/** Explain the actual word construction of the selected bounded counting variant. */
export function spokenNumberLesson(system: SystemDefinition, n: bigint, specimen: Representation) {
  const value = Number(n);
  const language = specimen.tokens[0]?.lang;
  const phrase = specimen.tokens[0]?.text ?? '';
  const parts: { text: string; tokens?: RenderToken[] }[] = [];
  const show = (words: string): RenderToken[] => [{ text: words, lang: language }];
  const wordsFor = (amount: number) =>
    (system.region === 'Americas'
      ? representAmericanWords(BigInt(amount), system)
      : representPolynesianWords(BigInt(amount), system)
    ).tokens[0]?.text ?? '';
  const tens = Math.floor(value / 10);
  const units = value % 10;
  let equation = String(value);

  if (system.id === 'maori') {
    const roots = ['kore', 'tahi', 'rua', 'toru', 'whā', 'rima', 'ono', 'whitu', 'waru', 'iwa'];
    const terms: string[] = [];
    for (const [magnitude, name] of [
      [1000, 'mano'],
      [100, 'rau'],
      [10, 'tekau'],
    ] as const) {
      const coefficient = Math.floor(value / magnitude) % 10;
      if (!coefficient) continue;
      const group =
        magnitude === 10 && coefficient === 1
          ? 'tekau'
          : `${coefficient === 1 ? 'kotahi' : roots[coefficient]} ${name}`;
      parts.push({
        text: `${group} counts ${coefficient} ${name === 'mano' ? 'thousand' : name === 'rau' ? 'hundred' : 'ten'}${coefficient === 1 ? '' : 's'}: ${coefficient} × ${magnitude.toLocaleString('en-US')} = ${(coefficient * magnitude).toLocaleString('en-US')}.`,
        tokens: show(group),
      });
      terms.push(`${coefficient} × ${magnitude.toLocaleString('en-US')}`);
    }
    if (units) {
      parts.push({
        text: `${parts.length ? 'Mā joins the additional units. ' : ''}${roots[units]} supplies ${units}.`,
        tokens: show(`${parts.length ? 'mā ' : ''}${roots[units]}`),
      });
      terms.push(String(units));
    }
    if (!value)
      parts.push({ text: 'Kore is the counting word for zero.', tokens: specimen.tokens });
    equation = `${terms.join(' + ') || '0'} = ${value.toLocaleString('en-US')}`;
  } else if (value <= 10 || value === 100) {
    parts.push({ text: specimen.explanation, tokens: specimen.tokens });
  } else if (system.id === 'hawaiian') {
    const tensWord = wordsFor(tens * 10);
    const unitWord = wordsFor(units);
    parts.push({
      text: `${tensWord} names ${tens * 10}${tens === 2 ? '; twenty has the irregular name iwakālua' : tens >= 3 ? ', formed with kana- and the corresponding root' : ''}.`,
      tokens: show(tensWord),
    });
    if (units) {
      parts.push({ text: 'Kūmā joins additional units to the ten.', tokens: show('kūmā') });
      parts.push({
        text: `${unitWord} supplies ${units}; combine the parts as ${phrase}.`,
        tokens: show(unitWord),
      });
    }
    equation = `${tens * 10}${units ? ` + ${units}` : ''} = ${value}`;
  } else if (system.id === 'choctaw') {
    if (value < 20) {
      parts.push({ text: 'Awah introduces a teen: start with ten.', tokens: show('awah') });
      parts.push({
        text: `${wordsFor(units)} supplies the additional ${units}.`,
        tokens: show(wordsFor(units)),
      });
      equation = `10 + ${units} = ${value}`;
    } else {
      const tensWord = wordsFor(tens * 10);
      parts.push({
        text: `${tensWord} places ${wordsFor(tens)} (${tens}) after pokoli (ten), giving 10 × ${tens} = ${tens * 10}.`,
        tokens: show(tensWord),
      });
      if (units)
        parts.push({
          text: `Akocha joins ${wordsFor(units)}, or ${units}, to the tens amount. This spelling follows the selected community chart.`,
          tokens: show(`akocha ${wordsFor(units)}`),
        });
      equation = `10 × ${tens}${units ? ` + ${units}` : ''} = ${value}`;
    }
  } else if (system.id === 'navajo') {
    if (value < 20) {
      const unitWord = phrase.split(' ts’áadah')[0];
      parts.push({
        text: `${unitWord} supplies ${units}${units === 1 ? '; eleven uses the short form ła’' : ''}.`,
        tokens: show(unitWord),
      });
      parts.push({
        text: 'The following ts’áadah is the teen element. The unit is spoken before this element.',
        tokens: show('ts’áadah'),
      });
      equation = `${units} + 10 = ${value}`;
    } else {
      const tensWord = wordsFor(tens * 10);
      parts.push({
        text: `${tensWord} is the complete word for ${tens * 10}, or ${tens} tens.`,
        tokens: show(tensWord),
      });
      if (units) {
        const connector = tens === 2 ? ' ' : ' dóó bi’aan ';
        const unitWord = phrase.slice(tensWord.length + connector.length);
        parts.push({
          text:
            tens === 2
              ? `The guide joins the unit directly to twenty${units === 1 ? ', using the short one form ła’' : ''}. ${unitWord} supplies ${units}.`
              : `Dóó bi’aan links the tens to ${unitWord}, or ${units}.`,
          tokens: show(`${tens === 2 ? '' : 'dóó bi’aan '}${unitWord}`),
        });
      }
      equation = `${tens * 10}${units ? ` + ${units}` : ''} = ${value}`;
    }
  }
  return { text: system.howItWorks, equation, parts, sources: system.sources };
}
