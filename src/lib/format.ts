import type { Rational, Representation, RenderToken, SystemDefinition } from './types';
import { baseDigits } from './numbers';
import { representGesture } from './gestures';
import { representYoruba, spokenLanguage } from './spoken';
import { representAmericanWords } from './spoken-americas';
import { representPolynesianWords } from './spoken-polynesian';
import { representPacificCount } from './pacific-counts';
import { representWrittenExpansion } from './written-expansions';
const unsupported = (reason: string): Representation => ({
  status: 'unsupported',
  tokens: [],
  layout: 'row',
  explanation: '',
  reason,
});
export function represent(value: Rational, system: SystemDefinition): Representation {
  const n = value.numerator;
  if (value.denominator !== 1n)
    return unsupported('This converter currently supports whole numbers only.');
  if (n < 0n)
    return unsupported(
      'Negative results use familiar digits. No minus sign is added to this notation.',
    );
  if (system.engine === 'explainer') {
    const example = system.examples.find((e) => e.value === n.toString());
    if (!example)
      return {
        status: 'explainer',
        tokens: [],
        layout: 'words',
        explanation: system.howItWorks,
        reason: `This entry currently displays documented specimens only. A general conversion rule has not been implemented for ${system.name}; choose one of its examples.`,
      };
    return {
      status: 'explainer',
      tokens: example.glyphs?.map((glyph) => ({ glyph })) ?? [
        { text: example.words ?? example.value, lang: spokenLanguage(system) },
      ],
      layout: example.glyphs ? 'row' : 'words',
      explanation: example.explanation,
    };
  }
  if (n === 0n && !system.zero) return unsupported('The selected notation has no zero sign.');
  if (n < BigInt(system.min) || n > BigInt(system.max))
    return unsupported(
      `This renderer supports ${system.min}–${system.max.length > 18 ? `whole numbers of up to ${system.max.length} digits` : Number(system.max).toLocaleString('en-US')}. This is an app limit.`,
    );
  let tokens: RenderToken[] = [];
  let layout: Representation['layout'] = 'row';
  let explanation = '';
  const push = (glyph: string, place?: string) => tokens.push({ glyph, place });
  const additive = (input: bigint, values = system.values ?? []) => {
    let rest = input;
    for (const { value, glyph } of values) {
      const count = rest / BigInt(value);
      if (count > 256n)
        throw new Error('This value would require too many repeated signs. Try a smaller number.');
      for (let i = 0n; i < count; i++) push(glyph, `${value}`);
      rest %= BigInt(value);
    }
    if (rest) throw new Error('This value is outside the supported notation rules.');
  };
  try {
    switch (system.engine) {
      case 'gestures':
        return representGesture(n, system);
      case 'yoruba':
        return representYoruba(n);
      case 'spoken':
        return system.region === 'Americas'
          ? representAmericanWords(n, system)
          : representPolynesianWords(n, system);
      case 'pacific':
        return representPacificCount(n, system);
      case 'written':
        return representWrittenExpansion(n, system);
      case 'positional': {
        const base = system.radix ?? 10;
        const digits = baseDigits(n, base);
        tokens = digits.map((d, i) => ({
          glyph: system.digits![d],
          place: (BigInt(base) ** BigInt(digits.length - i - 1)).toString(),
          label: `Digit ${d}`,
        }));
        explanation =
          digits
            .map(
              (d, i) =>
                `${d} × ${(BigInt(base) ** BigInt(digits.length - i - 1)).toLocaleString('en-US')}`,
            )
            .join(' + ') + ` = ${n.toLocaleString('en-US')}`;
        if (system.id === 'maya') layout = 'stack';
        if (system.id === 'nko') tokens.reverse();
        break;
      }
      case 'additive':
        additive(n);
        let remainder = n;
        const groups: string[] = [];
        for (const { value } of system.values ?? []) {
          const count = remainder / BigInt(value);
          if (count) groups.push(`${count} × ${value.toLocaleString('en-US')}`);
          remainder %= BigInt(value);
        }
        explanation = `${groups.join(' + ')} = ${n.toLocaleString('en-US')}. Repeat each sign the indicated number of times, then add their values.`;
        if (system.id === 'phoenician') tokens.reverse();
        break;
      case 'greek':
        additive(n);
        push('greek-mark');
        explanation =
          'Hundreds, tens, and units have their own letters. The final mark identifies a number.';
        break;
      case 'roman': {
        let rest = Number(n);
        const roman: [number, string][] = [
          [1000, 'M'],
          [900, 'CM'],
          [500, 'D'],
          [400, 'CD'],
          [100, 'C'],
          [90, 'XC'],
          [50, 'L'],
          [40, 'XL'],
          [10, 'X'],
          [9, 'IX'],
          [5, 'V'],
          [4, 'IV'],
          [1, 'I'],
        ];
        const groups: string[] = [];
        for (const [v, s] of roman)
          while (rest >= v) {
            groups.push(`${s} (${v})`);
            for (const c of s) push(`roman-${c}`);
            rest -= v;
          }
        explanation = `${groups.join(' + ')} = ${n.toLocaleString('en-US')}. In a subtractive pair, subtract the smaller sign from the larger (for example, IV = 5 − 1). Add the resulting groups.`;
        break;
      }
      case 'cistercian':
        push(`cistercian-${n}`);
        explanation = `${String(n)
          .padStart(4, '0')
          .split('')
          .map((d, i) => `${d} ${['thousands', 'hundreds', 'tens', 'units'][i]}`)
          .join(' · ')}. Four places share one staff.`;
        break;
      case 'ethiopic': {
        const digits = (v: bigint) => {
          const t = Number(v / 10n) * 10,
            u = Number(v % 10n);
          if (t) push(`ethiopic-${t}`);
          if (u) push(`ethiopic-${u}`);
        };
        const pair = (v: bigint) => {
          const h = v / 100n,
            l = v % 100n;
          if (h) {
            if (h !== 1n) digits(h);
            push('ethiopic-100');
          }
          if (l) digits(l);
        };
        const rec = (v: bigint) => {
          if (v >= 10000n) {
            const high = v / 10000n;
            if (high !== 1n) rec(high);
            push('ethiopic-10000');
            const low = v % 10000n;
            if (low) pair(low);
          } else pair(v);
        };
        rec(n);
        explanation =
          'Coefficients combine with hundred and ten-thousand signs. Empty groups are omitted.';
        break;
      }
      case 'sinhala': {
        let rest = n;
        const terms: string[] = [];
        // SLSI N3888 p. 4: 101, 222, 999, 1987, and 2010.
        // Hundreds/thousands take a unit multiplier; a multiplier of one is implicit.
        for (const power of [1000n, 100n]) {
          const coefficient = rest / power;
          if (coefficient) {
            if (coefficient !== 1n) push(`sinhala-${coefficient}`);
            push(`sinhala-${power}`);
            const magnitude = power.toLocaleString('en-US');
            terms.push(coefficient === 1n ? magnitude : `${coefficient} × ${magnitude}`);
          }
          rest %= power;
        }
        const tens = (rest / 10n) * 10n;
        if (tens) {
          push(`sinhala-${tens}`);
          terms.push(tens.toString());
        }
        const units = rest % 10n;
        if (units) {
          push(`sinhala-${units}`);
          terms.push(units.toString());
        }
        explanation = `${terms.join(' + ')} = ${n.toLocaleString('en-US')}`;
        break;
      }
      case 'tamil': {
        let rest = n;
        for (const power of [1000, 100, 10]) {
          const c = rest / BigInt(power);
          if (c) {
            if (c !== 1n) push(`tamil-${c}`);
            push(`tamil-${power}`);
          }
          rest %= BigInt(power);
        }
        if (rest) push(`tamil-${rest}`);
        explanation =
          'A coefficient before a tens, hundreds, or thousands sign multiplies its value; a coefficient of one is omitted.';
        break;
      }
      case 'kharoshthi': {
        let rest = n;
        while (rest >= 1000n) {
          push('kharoshthi-1000');
          rest -= 1000n;
        }
        const hundreds = rest / 100n;
        if (hundreds) {
          let coefficient = hundreds;
          if (coefficient !== 1n) {
            for (const unit of [4, 3, 2, 1])
              while (coefficient >= BigInt(unit)) {
                push(`kharoshthi-${unit}`);
                coefficient -= BigInt(unit);
              }
          }
          push('kharoshthi-100');
          rest %= 100n;
        }
        for (const v of [20, 10, 4, 3, 2, 1])
          while (rest >= BigInt(v)) {
            push(`kharoshthi-${v}`);
            rest -= BigInt(v);
          }
        tokens.reverse();
        explanation =
          'Read from right to left. Repeated twenties, a ten, and the remaining units add together.';
        break;
      }
      case 'rods':
      case 'suzhou': {
        const ds = n.toString().split('').map(Number);
        let lastVertical = false;
        ds.forEach((d, i) => {
          const place = ds.length - i - 1;
          if (system.engine === 'rods')
            push(
              d === 0 ? 'rods-zero' : `rods-${place % 2 ? 'tens' : 'unit'}-${d}`,
              (10n ** BigInt(place)).toString(),
            );
          else {
            let id = `suzhou-${d}`;
            if (d >= 1 && d <= 3) {
              if (lastVertical) id = `suzhou-horizontal-${d}`;
              lastVertical = !lastVertical;
            } else lastVertical = false;
            push(id, (10n ** BigInt(place)).toString());
          }
        });
        explanation =
          system.engine === 'rods'
            ? 'Positions alternate between unit and tens orientations. An empty cell is zero; the grid is a modern reading aid.'
            : 'The first three signs alternate with horizontal forms when adjacent. This is the integer row without a price or unit label.';
        break;
      }
      case 'babylonian': {
        const ds = baseDigits(n, 60);
        tokens = ds.map((d, i) => ({
          glyph: `babylonian-${d}`,
          place: (60n ** BigInt(ds.length - i - 1)).toString(),
          label: d === 0 ? 'Empty place' : `${d}`,
        }));
        explanation =
          ds
            .map((d, i) => `${d} × ${(60n ** BigInt(ds.length - i - 1)).toLocaleString('en-US')}`)
            .join(' + ') +
          '. Blank places and cell boundaries are explained by the modern reading grid.';
        break;
      }
      case 'khipu': {
        const ds = n.toString().split('').map(Number);
        tokens = ds.map((d, i) => ({
          glyph: `khipu-${i === ds.length - 1 ? 'units' : 'knots'}-${d}`,
          place: (10n ** BigInt(ds.length - i - 1)).toString(),
          label: i === ds.length - 1 ? 'Units' : `${10n ** BigInt(ds.length - i - 1)}s`,
        }));
        layout = 'cord';
        explanation =
          'One schematic pendant cord, read downward by decimal place. The empty positions contain no knots.';
        break;
      }
      default:
        return unsupported('This notation is available as an illustrated reference.');
    }
  } catch (e) {
    return unsupported(e instanceof Error ? e.message : 'Unable to represent this value.');
  }
  if (tokens.length > 256)
    return unsupported('This number would need more than 256 signs. Try a smaller value.');
  return { status: 'ok', tokens, layout, explanation };
}
