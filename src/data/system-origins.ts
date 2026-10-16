import type { TimelineSource, TimelineStatus } from './timeline';
import { binaryHistorySource } from './modern';

interface SystemOrigin {
  year: number | null;
  date: string;
  detail: string;
  status: TimelineStatus;
  sources?: TimelineSource[];
}
const unicodeAfrica = {
  title: 'Unicode — African script histories',
  url: 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/',
};
const unicodeNumbers = {
  title: 'Unicode — Numeral traditions',
  url: 'https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-22/',
};
const unknown = (detail: string, status: TimelineStatus = 'living'): SystemOrigin => ({
  year: null,
  date: 'Origin unknown',
  detail,
  status,
});
const dated = (
  year: number,
  date: string,
  detail: string,
  status: TimelineStatus,
  sources: TimelineSource[] = [],
): SystemOrigin => ({ year, date, detail, status, sources });

/** Dates describe the numeral repertoire or selected evidence, not automatically the parent script.
 * Null means the linked evidence does not establish an origin date; never invent a plotting year.
 */
export const systemOrigins: Record<string, SystemOrigin> = {
  binary: dated(
    1703,
    '1703 · Leibniz’s account',
    'Leibniz describes arithmetic using only 0 and 1 in this dated account. This is a documented mathematical milestone, not a claim that binary was invented in 1703 or that digital computing existed then.',
    'living',
    [binaryHistorySource],
  ),
  hexadecimal: unknown(
    'This entry uses the modern computing alphabet 0–9 and A–F. The linked references document its rules and use without establishing a single invention date.',
  ),
  'medieval-finger-counting': dated(
    725,
    '725 CE · Bede’s account',
    'Bede describes finger reckoning in De temporum ratione. This dates a surviving account of an older practice, rather than its invention.',
    'historical',
  ),
  'cistercian-gestures': dated(
    1824,
    '1824 · published La Trappe sign list',
    'Louis Du Bois publishes a Cistercian/Trappist sign vocabulary including gestures for hours, half-hours, and quarter-hours. This dates the selected documentation, not the beginning of monastic signing.',
    'historical',
  ),
  maya: dated(
    -300,
    'c. 300–200 BCE',
    'A San Bartolo mural preserves the calendar notation “7 Deer” in this date range. The timeline uses its earlier boundary as an evidence date, not the invention of the complete positional system or zero.',
    'historical',
    [
      {
        title: 'Stuart et al. — An early Maya calendar record from San Bartolo (2022)',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9007507/',
      },
    ],
  ),
  mexica: dated(
    1400,
    '15th–16th centuries',
    'This is the manuscript tradition represented in the collection. Its starting century is a browsing anchor, not a known invention date.',
    'historical',
  ),
  roman: dated(
    -500,
    'c. 500 BCE',
    'Roman numerals developed gradually from earlier Italic practices. This approximate origin does not date today’s standardized subtractive spellings.',
    'living',
    [
      {
        title: 'Florian Cajori — A History of Mathematical Notations, Roman numerals',
        url: 'https://www.maths.ed.ac.uk/~v1ranick/papers/cajorinot.pdf',
      },
    ],
  ),
  'greek-alphabetic': dated(
    -550,
    'c. 550 BCE',
    'Alphabetic numerical inscriptions are attested at the tunnel of Eupalinus on Samos around this date; the convention’s precise invention is unknown.',
    'living',
    [
      {
        title: 'Victor Katz — A History of Mathematics, Greek numeration',
        url: 'https://www.math.mcgill.ca/darmon/courses/history/katz.pdf',
      },
    ],
  ),
  'greek-attic': dated(
    -600,
    'c. 6th century BCE',
    'This approximate date locates the Attic acrophonic tradition within the first millennium BCE. Regional forms and earlier acrophonic practices vary.',
    'historical',
    [
      {
        title: 'MacTutor — Greek numbers',
        url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Greek_numbers/',
      },
    ],
  ),
  medefaidrin: dated(
    1930,
    '1930s',
    'The numeral repertoire belongs to the community’s early twentieth-century script tradition. The decade is approximate; 1930 is not a documented invention day or year.',
    'living',
    [unicodeAfrica],
  ),
  'mende-kikakui': dated(
    1900,
    'Early 20th century',
    'The script and its distinctive numeral repertoire developed in the early twentieth century. 1900 anchors that broad period rather than an exact invention year.',
    'historical',
    [unicodeAfrica],
  ),
  bamum: dated(
    1910,
    'c. 1910 · final script phase',
    'Bamum writing developed from 1896 to 1910. This entry places the final A-ka-u-ku repertoire near the end of that process; its modern zero convention must not be projected onto earlier signs.',
    'living',
    [unicodeAfrica],
  ),
  ethiopic: unknown(
    'The numeral signs derive from Greek or Coptic forms. The linked sources explain their ancestry and use but do not establish a secure date for the numeral repertoire.',
  ),
  'coptic-epact': dated(
    900,
    '10th century CE',
    'Unicode dates the development of these administrative numeral signs to the tenth century; 900 anchors the century, not an exact invention year.',
    'historical',
    [unicodeNumbers],
  ),
  nko: dated(
    1949,
    '1949',
    'Solomana Kanté devised N’Ko in 1949, including its right-to-left decimal numeral tradition.',
    'living',
    [unicodeAfrica],
  ),
  vai: dated(
    1920,
    '1920s',
    'The numeral signs were devised in the 1920s, later than the syllabary’s nineteenth-century origins. The decade is approximate.',
    'historical',
  ),
  osmanya: dated(
    1920,
    '1920–1922',
    'Osman Yusuf Kenadid devised Osmanya in 1920–1922. The timeline anchors its script and digit repertoire at the beginning of that interval.',
    'historical',
    [unicodeAfrica],
  ),
  yoruba: unknown(
    'This spoken counting tradition has no securely dated invention. Contemporary teaching examples document its structure, not its beginning.',
  ),
  rumi: dated(
    900,
    '10th century CE onward',
    'The documented period of use begins in the tenth century and extends through the seventeenth. This is an attested period, not a precise invention date.',
    'historical',
    [unicodeNumbers],
  ),
  kharoshthi: dated(
    1,
    'c. 1st century CE · selected forms',
    'The selected manuscript forms belong to the first century CE. Kharoshthi writing is older; this date identifies the represented evidence, not the invention of all Kharoshthi numerals.',
    'historical',
  ),
  sinhala: unknown(
    'Sinhala Illakkam was used before 1815 and appears in the Kandyan Convention of that year. That late witness and the decline in common use do not date its invention.',
    'historical',
  ),
  tamil: unknown(
    'Traditional Tamil numeration evolved from earlier South Asian traditions. The linked technical account documents its non-positional rules without establishing an exact origin for this repertoire.',
  ),
  suzhou: dated(
    1700,
    '18th–19th centuries · account books',
    'The cited Tong Taisheng account books document commercial numeral forms in the eighteenth and nineteenth centuries. This is an evidence window within an older tradition, not its origin.',
    'historical',
  ),
  'old-persian': dated(
    -525,
    'c. 525 BCE',
    'Achaemenid inscriptions attest the selected numeral tradition from around this period. The date is approximate.',
    'historical',
  ),
  phoenician: dated(
    -1000,
    '1st millennium BCE',
    'This broad period locates Phoenician and Punic numerical practice. Its first year is only a browsing anchor; the numeral repertoire has no precisely established invention date.',
    'historical',
  ),
  'ottoman-siyaq': unknown(
    'This specialized accounting repertoire belongs to the Ottoman period and derives from older Siyaq practices. The linked sources do not pin down a single invention date for the selected forms.',
    'historical',
  ),
  mangarevan: unknown(
    'The traditional counting practice is documented in nineteenth- and twentieth-century accounts. Its invention predates that documentation by an unknown interval.',
  ),
  maori: unknown(
    'A living spoken tradition with historical variation. Modern number words do not establish a dated invention of Māori counting.',
  ),
  hawaiian: unknown(
    'Traditional grouping words survive in a living language. The sources document vocabulary rather than a securely dated origin.',
  ),
  oksapmin: unknown(
    'Ethnographic studies from 1978 onward document body counting; 1978 is a research date, not the invention of the practice.',
  ),
  cherokee: dated(
    1828,
    'Late 1820s',
    'Sequoyah proposed this distinct numerical notation in the late 1820s. 1828 is an approximate browsing anchor within that period, separate from his syllabary.',
    'historical',
  ),
  choctaw: unknown(
    'The collection uses contemporary Choctaw Nation teaching forms. These living number words have no documented invention date.',
  ),
  navajo: unknown(
    'The collection uses contemporary Diné College learning forms. Their documentation does not establish when Diné counting originated.',
  ),
};
