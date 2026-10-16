import { africanArithmeticProfiles } from './arithmetic-africa';
import { asianArithmeticProfiles } from './arithmetic-asia';
import { americanPacificArithmeticProfiles } from './arithmetic-americas-pacific';
import { europeanArithmeticProfiles } from './arithmetic-europe';
import type { ArithmeticEvidenceProfile } from '../lib/arithmetic-evidence';

export const arithmeticProfiles: Record<string, ArithmeticEvidenceProfile> = {
  ...africanArithmeticProfiles,
  ...asianArithmeticProfiles,
  ...americanPacificArithmeticProfiles,
  ...europeanArithmeticProfiles,
  binary: {
    summary: 'Unsigned binary arithmetic works directly with bits and carries at two.',
    tool: 'binary place operations',
    notationRole:
      'The worked places are base 2. The explanation is a modern arithmetic algorithm, not a claim about one particular processor circuit.',
    evidence: { add: 'modern', subtract: 'modern', multiply: 'modern', divide: 'modern' },
    operationNotes: {
      add: 'Add matching bits and the carry; two ones become one in the next place.',
      subtract: 'Borrow one higher bit as two lower units, then remove the requested bits.',
      multiply:
        'A multiplier bit of one selects a shifted copy of the other factor; zero selects nothing. Add the selected copies.',
      divide:
        'Compare shifted copies of the divisor with the remaining dividend, subtract a fitting copy, and set the corresponding quotient bit.',
    },
    sources: [
      {
        title: 'NASA Space Place · binary place values',
        url: 'https://spaceplace.nasa.gov/binary-code2/en/',
      },
      {
        title: 'Leibniz (1703) · Explanation of Binary Arithmetic',
        url: 'https://doi.org/10.7551/mitpress/14123.003.0036',
      },
    ],
  },
  hexadecimal: {
    summary:
      'Hexadecimal arithmetic carries at sixteen; A through F are the digit values ten through fifteen.',
    tool: 'hexadecimal place operations',
    notationRole:
      'The worked places are base 16. Hex is a readable representation of binary data, rather than a claim that computer circuitry has sixteen stable states.',
    evidence: { add: 'modern', subtract: 'modern', multiply: 'modern', divide: 'modern' },
    operationNotes: {
      add: 'Combine matching hex digits and carry one when the sum reaches sixteen.',
      subtract:
        'Borrow one higher hex place as sixteen in the current place before removing the requested digit.',
      multiply:
        'Multiply digit values, carry at sixteen, shift partial products by hex places, and add them.',
      divide:
        'Take the largest fitting shifted divisor, subtract its multiple, and retain the hex quotient digit and remainder.',
    },
    sources: [
      {
        title: 'NASA Space Place · hexadecimal digits and four-bit groups',
        url: 'https://spaceplace.nasa.gov/binary-code3/en/',
      },
    ],
  },
};
