import type { SystemDefinition } from '../lib/types';

const binarySource = {
  title: 'NASA Space Place — How do we talk to machines?',
  url: 'https://spaceplace.nasa.gov/binary-code2/en/',
  detail: 'Binary digits, powers of two, and the worked example 10110101 = 181.',
};
const hexSource = {
  title: 'NASA Space Place — Why is sixteen so sweet?',
  url: 'https://spaceplace.nasa.gov/binary-code3/en/',
  detail: 'The 0–9/A–F alphabet, four-bit groups, and the worked example 9999 = 39,321.',
};
export const binaryHistorySource = {
  title: 'Leibniz — Explanation of Binary Arithmetic (1703), translated in Leibniz on Binary',
  url: 'https://doi.org/10.7551/mitpress/14123.003.0036',
};

export const modernSystems: SystemDefinition[] = [
  {
    id: 'binary',
    name: 'Binary',
    region: 'Global',
    location: 'Worldwide · digital computing',
    period: 'Modern computing; earlier mathematical roots',
    era: 'Modern',
    structure: 'Positional',
    baseLabel: 'Base 2',
    summary: 'Two digits, 0 and 1, count powers of two. Decimal 42 becomes 101010 in binary.',
    history:
      'Leibniz described arithmetic with only 0 and 1 in a 1703 account. Binary place value later became central to digital computing, where each bit has two possible values. This entry presents the modern computing notation rather than assigning binary a single place or date of invention.',
    howItWorks:
      'Read from left to right, using only 0 and 1. From the right, the places are worth 1, 2, 4, 8, 16, 32, and so on. Add the places that contain a 1.',
    readingSteps: [
      'There are two digits: 0 and 1. Each position to the left is worth twice as much as the previous one.',
      'For 101010, label the places from left to right: 32, 16, 8, 4, 2, 1.',
      'The 1 digits contribute 32, 8, and 2. The 0 digits keep the other positions empty.',
      'Add 32 + 8 + 2 = 42. Moving a digit one position left multiplies its value by two.',
    ],
    caveat:
      'Enter a nonnegative whole number in decimal. Output uses at most 256 binary digits and omits the optional 0b prefix and leading zeros. Signed, fractional, and fixed-width machine encodings are outside this converter.',
    engine: 'positional',
    radix: 2,
    digits: ['modern-0', 'modern-1'],
    min: '0',
    max: (2n ** 256n - 1n).toString(),
    zero: true,
    specimen: 42,
    examples: [
      { value: '0', explanation: 'Zero is written as a single 0.' },
      { value: '2', explanation: '10: one two and zero ones.' },
      { value: '42', explanation: '101010: 32 + 8 + 2 = 42.' },
      { value: '181', explanation: 'NASA’s example: 10110101 = 128 + 32 + 16 + 4 + 1.' },
      { value: '255', explanation: '11111111: eight 1 bits add up to 255.' },
    ],
    sources: [binarySource, binaryHistorySource],
  },
  {
    id: 'hexadecimal',
    name: 'Hexadecimal',
    localName: 'Hex',
    region: 'Global',
    location: 'Worldwide · digital computing',
    period: 'Modern computing',
    era: 'Modern',
    structure: 'Positional',
    baseLabel: 'Base 16',
    summary:
      'Digits 0–9 and letters A–F count powers of sixteen. Decimal 42 becomes 2A in hexadecimal.',
    history:
      'Hexadecimal makes binary data compact enough to read easily: one hexadecimal digit represents four bits. Modern computing uses the digits 0–9 followed by A–F for the values ten through fifteen. The notation is used internationally to display computer data.',
    howItWorks:
      'Read from left to right. A, B, C, D, E, and F stand for 10, 11, 12, 13, 14, and 15. From the right, positions are worth 1, 16, 256, 4,096, and higher powers of sixteen.',
    readingSteps: [
      'Learn the sixteen digits: 0–9, then A = 10, B = 11, C = 12, D = 13, E = 14, and F = 15.',
      'For 2A, the left digit 2 is in the sixteens position: 2 × 16 = 32.',
      'The right digit A is worth ten ones. Add 32 + 10 = 42.',
      'Each hexadecimal digit also matches four binary bits: 2A is 0010 1010 in binary. A zero holds an empty place; 100 in hexadecimal is decimal 256.',
    ],
    caveat:
      'Enter a nonnegative whole number in decimal, using at most 100 decimal digits. Output uses uppercase A–F and omits the optional 0x prefix and leading zeros. Signed, fractional, and fixed-width machine encodings are outside this converter.',
    engine: 'positional',
    radix: 16,
    digits: Array.from({ length: 16 }, (_, i) => `modern-${i}`),
    min: '0',
    max: '9'.repeat(100),
    zero: true,
    specimen: 42,
    examples: [
      { value: '15', explanation: 'F is the single digit for fifteen.' },
      { value: '16', explanation: '10: one sixteen and zero ones.' },
      { value: '42', explanation: '2A: 2 × 16 + 10 = 42.' },
      { value: '255', explanation: 'FF: 15 × 16 + 15 = 255.' },
      { value: '256', explanation: '100: one 256, zero sixteens, and zero ones.' },
      { value: '39321', explanation: 'NASA’s example: 9999 in hexadecimal equals decimal 39,321.' },
    ],
    sources: [hexSource, binarySource],
  },
];
