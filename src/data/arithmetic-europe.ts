import type { ArithmeticEvidenceProfile } from '../lib/arithmetic-evidence';
const abacus = {
  title:
    'Oxford Classical Dictionary · surviving Greek and Roman abaci and reconstructed procedures',
  url: 'https://doi.org/10.1093/acrefore/9780199381135.013.1',
};
const turner = {
  title:
    'J. Hilton Turner (1951) · Roman Elementary Mathematics, including Eutocius’ worked multiplication',
  url: 'https://penelope.uchicago.edu/Thayer/E/Journals/CJ/47/2/Roman_Elementary_Mathematics%2A.html',
};
const king = {
  title: 'David A. King · The Ciphers of the Monks, author’s research and manuscript survey',
  url: 'https://uni-frankfurt.academia.edu/DavidAKing/CIPHERS%20OF%20THE%20MONKS',
};

export const europeanArithmeticProfiles: Record<string, ArithmeticEvidenceProfile> = {
  roman: {
    summary:
      'Roman written numerals and the counter board serve different jobs: the counters carry the working quantity; the letters record it.',
    tool: 'Roman counter board',
    notationRole:
      'The board drawings are a reconstruction of counter exchanges; the final Roman numeral follows this exhibit’s named writing convention.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Surviving abaci establish the tool. The worked reconstruction combines counters of equal value and exchanges five units and two fives.',
      subtract:
        'Reverse the counter exchanges and remove equal quantities. Surviving complete Roman operating instructions are unavailable in the sources inspected.',
      multiply:
        'The counter board can accumulate groups or place products. The sequence here is an explicit reconstruction, not a claim that repeated addition was the only Roman method.',
      divide:
        'Remove divisor-sized groups while tracking their count. Turner explicitly distinguishes conjectural simple division from surviving examples of Greek astronomical division.',
    },
    sources: [
      abacus,
      turner,
      {
        title: 'University of Reading · experimental Roman arithmetic',
        url: 'https://blogs.reading.ac.uk/classics-at-reading/2025/09/19/roman-arithmetic-for-all/',
      },
    ],
  },
  'greek-alphabetic': {
    summary:
      'A Greek numerical letter has a whole units, tens, or hundreds value. Written multiplication could operate on those letter-values; counters supplied another calculating medium.',
    tool: 'Greek letter values and counter board',
    notationRole:
      'Keep the letter-values distinct from positional digits. The numeral mark identifies a number and is not an arithmetic operator.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'documented',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'A counter-board reconstruction combines equal amounts; each completed amount is recorded with its Greek numerical letters.',
      subtract:
        'The counter-board reconstruction opens a higher-value group into lower counters before removal, then records the difference in letters.',
      multiply:
        'Eutocius’ commentary contains the full expansion of 265 × 265 as products of 200, 60, and 5. This lesson applies the same whole-value pairing to the entered factors.',
      divide:
        'Use a clearly reconstructed counter-board grouping procedure. The inspected specialist source does not supply a general surviving simple-division recipe in these letters.',
    },
    sources: [
      turner,
      abacus,
      {
        title: 'Unicode · Greek numerical letters',
        url: 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-7/',
      },
    ],
  },
  'greek-attic': {
    summary:
      'Attic acrophonic signs also labeled quantities on counting boards. Counters move between value groups; the signs record the resulting amount.',
    tool: 'Attic line abacus',
    notationRole:
      'This is a reconstruction of a line counter board, not an assertion that the much later alphabetic multiplication example was written in Attic signs.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Combine counters on the same value lines and exchange five lower counters for the next five-value group.',
      subtract:
        'Remove matching counters, opening a higher group into lower counters as necessary.',
      multiply:
        'Accumulate place-group products on the counter board, then write the total in the attested Attic signs. The exact moves are reconstructed.',
      divide:
        'Remove equal groups from the board and tally the quotient. The tool is attested; this arbitrary-input division sequence is reconstructed.',
    },
    sources: [
      abacus,
      turner,
      {
        title: 'Computer History Museum · Salamis counting tablet',
        url: 'https://www.computerhistory.org/revolution/artifact/1/128',
      },
      {
        title: 'Unicode proposal · Attic acrophonic signs and inscriptions',
        url: 'https://www.unicode.org/wg2/docs/n2612-3.pdf',
      },
    ],
  },
  cistercian: {
    summary:
      'The Cistercian cipher records an integer compactly on one staff. The inspected manuscript survey does not establish a procedure that calculates by manipulating its strokes.',
    tool: 'separate counter workspace and one-staff record',
    notationRole:
      'The worked counter arithmetic is an explicitly illustrative workspace; redraw the cipher’s affected quadrants to record each quantity. Do not superimpose two ciphers to add them.',
    evidence: {
      add: 'recording',
      subtract: 'recording',
      multiply: 'recording',
      divide: 'recording',
    },
    operationNotes: {
      add: 'Combine quantities on a separate workspace and replace each affected quadrant with the resulting decimal digit, carrying when a place reaches ten.',
      subtract:
        'Remove quantities on a separate workspace, exchanging from the next place when needed; redraw the remaining quadrant values.',
      multiply:
        'Form the products of the quantities encoded in the quadrants, collect them on a separate workspace, and record the total as one staff where supported.',
      divide:
        'Track equal groups on a separate workspace and record the quotient as a new cipher; no undocumented stroke-division algorithm is asserted.',
    },
    sources: [
      king,
      {
        title: 'David A. King (1995) · author-posted Cistercian notation study',
        url: 'https://www.researchgate.net/publication/331650124_DAVID_KING_1995_-_A_forgotten_Cistercian_system_of_numerical_notation',
      },
    ],
  },
  'medieval-finger-counting': {
    summary:
      'Bede’s finger system holds decimal quantities in distinct hand positions. His opening chapter specifies the poses, rather than a full written recipe for each arbitrary operation.',
    tool: 'decimal hand-position accumulator',
    notationRole:
      'Change the displayed hand pose as the running quantity changes. These worked transitions are a reconstruction using the documented pose vocabulary.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Combine the decimal quantities and replace the units, tens, hundreds, or thousands pose; ten in one group changes the next pose.',
      subtract:
        'Remove a quantity, exchange a higher decimal group where needed, and change the hand positions to the remainder.',
      multiply:
        'Keep the group count separately and use the documented hand poses to hold successive accumulated amounts; this does not attribute a modern finger-multiplication trick to Bede.',
      divide:
        'Keep the number of removed groups separately and update the hand pose for the remaining amount; the pose inventory is documented, the arbitrary division sequence is reconstructed.',
    },
    sources: [
      {
        title: 'Bede · De temporum ratione, chapter 1: primary finger-position instructions',
        url: 'https://medieval-baltic.us/latinbede.pdf',
      },
      {
        title: 'Bede · The Reckoning of Time, Faith Wallis translation, publisher record',
        url: 'https://doi.org/10.3828/978-0-85323-693-1',
      },
      turner,
    ],
  },
  'cistercian-gestures': {
    summary:
      'The selected La Trappe gestures communicate hours. The primary sign list is a vocabulary, not a general-purpose cardinal arithmetic algorithm.',
    tool: 'hour-interval workspace and time signals',
    notationRole:
      'Calculate with hour intervals, then communicate a supported total using the documented signal. Multiplication counts equal intervals; division shares a duration. The demonstration never treats the hours gesture as a positional numeral alphabet.',
    evidence: {
      add: 'recording',
      subtract: 'recording',
      multiply: 'recording',
      divide: 'recording',
    },
    operationNotes: {
      add: 'Join hour intervals and signal the combined duration; this is an illustrated use of the vocabulary, not a claimed historical gesture-addition rule.',
      subtract:
        'Remove an hour interval from a duration and signal the time remaining; no invented gesture-borrowing rule is used.',
      multiply:
        'Accumulate equal hour intervals while keeping the number of intervals separately; signal the final duration only within the attested range.',
      divide:
        'Partition a duration into equal intervals and count the intervals; the sign list also documents half-hour and quarter-hour meanings, though this exhibit draws whole-hour signals.',
    },
    sources: [
      {
        title: 'Du Bois (1824) · La Trappe sign list, entry Heure, primary text with translation',
        url: 'https://www.medieval-baltic.us/trappe.pdf',
      },
      {
        title: 'Leibniz (1717) · Loccum counting action, distinct from La Trappe hour signals',
        url: 'https://digitale-sammlungen.gwlb.de/content/730901130/pdf/00000647.pdf',
      },
    ],
  },
};
