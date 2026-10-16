# Asian arithmetic: research decisions and implementation boundaries

Research checked 16 October 2026. This audit covers all four operators for the ten Asian entries. A written numeral system is not automatically a written calculating algorithm. The calculation surface, manuscript period, and selected notation variant must agree before a procedure is described as historical practice.

The profiles are in `src/data/arithmetic-asia.ts`. `documented` identifies a supported operation or calculation practice; worked operands and illustrations are new teaching examples. `reconstruction` identifies an explicit calculation built from the documented notation. `recording` means that the selected notation records quantities while the evidence for the exact illustrated computing sequence is separate or incomplete. None of these classifications means the people could not perform the operation.

## Babylonian

Inspected [Melville’s analysis of Old Babylonian multiplication tablets](https://myslu.stlawu.edu/~dmel/mesomath/multiply.html) and the [Open University’s treatment of reciprocal tables](https://www.open.edu/openlearn/mod/oucontent/view.php?id=1976&printable=1). Melville identifies school-table patterns rather than a universal table for all sixty digits.

- **Addition:** the implementation can align the same sexagesimal places, show the individual wedge amounts combined, and carry at sixty. The actual sequence of carry illustrations remains a reconstruction, not a quotation from an addition manual.
- **Subtraction:** the illustration should show the specific place receiving sixty units when one higher unit is exchanged, then the quantity removed. This borrowing sequence is reconstructed.
- **Multiplication:** documented tables supply 1–20, 30, 40, and 50 multiples for selected principal numbers. A new input can be split into those entries, with explicit place shifts and running totals. Do not claim every principal number had a standard table.
- **Division:** the documented strategy is reciprocal multiplication. Separate a finite reciprocal from an approximation, particularly for an irregular divisor. A terminating six-place preview must not be advertised as an exact reciprocal. The exact rational result remains available.

The empty-position artwork and explicit scale labels are teaching conventions. Do not conflate them with a modern standalone zero or mix administrative measurement systems into the selected Old Babylonian integer notation.

## Brahmi

Inspected [Unicode 17 §14.1](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-14/), including the distinction between the early additive-multiplicative signs and late positional digits. Also searched for arithmetic explicitly tied to early Brahmi, rather than accepting a generic “ancient Indian mathematics” result. The selected adapter uses the early signs and stops at 99.

- **Addition:** reconstruct a combination of represented units and dedicated tens amounts, normalize, and choose the final dedicated tens sign.
- **Subtraction:** reconstruct an exchange of one ten into units before removal when required. Show the actual interim numeral quantity, not only a modern decimal column.
- **Multiplication:** a repeated-quantity/partial-product walkthrough can use the actual signs, with the reconstruction label visible.
- **Division:** a divisor-grouping walkthrough can show accumulated groups and a remainder, again reconstructed.

No inspected source tied these specific early signs to a complete four-operation manuscript algorithm. This is a bounded research result, not a claim of historical absence. Later zero-bearing Indian arithmetic must not be backdated into this entry. It is equally wrong to infer a historical ceiling of 99 from the app’s artwork range.

## Kharoshthi

Inspected [Unicode 17 §14.2 and its 1996 example](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-14/). The numeral structure is verified; a complete calculating recipe tied to this notation was not identified. Searches included spelling variants Kharosthi/Kharoṣṭhī, early Indian calculation surfaces, and documentary use.

- **Addition:** reconstructed exchanges should use the real ten/twenty groups and units 1–4.
- **Subtraction:** reconstructed splitting must distinguish a twenty from its component tens and a hundred from its attached multiplier.
- **Multiplication:** a sign’s numeric role matters: a unit multiplier attached to a hundred must not become a separate added unit in the product.
- **Division:** reconstructed equal groups and a remainder can be recorded right-to-left; the writing direction does not prove a historical direction for division.

Do not invent signs for 5–9 or zero. Do not call the selected compound system base 20 merely because it has a twenty sign, and do not transfer medieval positional Indian algorithms without evidence of their use with this variant.

## Sinhala Illakkam

Inspected the original local research in [Sri Lanka Standards Institution N3888, pp. 1–4](https://www.unicode.org/L2/L2010/10337-n3888-sinhala.pdf) and the clarifying [L2/10-433](https://www.unicode.org/L2/L2010/10433-sinhala.pdf). These distinguish archaic court-record Illakkam from zero-bearing Lith Illakkam used in astrological calculations. Searches for “Sinhala arithmetic” must keep those entries apart.

- **Addition:** work through the represented order quantities and record the normalized sum in archaic Illakkam. The specific combining sequence is reconstructed.
- **Subtraction:** illustrate a required exchange, the amount removed, and the balance in archaic signs. Do not cite Lith calculation as proof of this exact borrow method.
- **Multiplication:** use hundred/thousand multiplier groups and dedicated tens amounts in the worked recording example.
- **Division:** make quotient groups and a remainder visible before recording the result. This is a reconstruction using a historical recording notation.

These lessons should explicitly identify the selected archaic variant. They must not replace its signs with the different Lith digits to make an algorithm appear historically attested.

## Traditional Tamil

Inspected [Senthil Babu’s original research on practitioners and Eṇcuvaṭi](https://pmc.ncbi.nlm.nih.gov/articles/PMC10100452/) through the [EuropePMC full-text XML](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC10100452/fullTextXML), plus [Wagner and Ashokan’s manuscript study](https://journals.library.ualberta.ca/hssa/index.php/hssa/article/view/103) and [Unicode Technical Note 21](https://www.unicode.org/notes/tn21/tamil_numbers.pdf). The manuscript study chiefly treats Malayalam variants and cannot stand as direct proof for every Tamil detail.

Documented practice includes memorization, recitation/writing, and Eṇcuvaṭi tables of whole numbers, fractions, and measures. The Kaṇakkatikāram genre was studied after elementary training; the inspected manuscript research explicitly distinguishes explained multiplication material from basic operations assumed by the text. A contents list naming addition and division is not a surviving step-by-step rule for them.

- **Addition:** reconstruct combining coefficients at each explicitly named magnitude.
- **Subtraction:** reconstruct exchanging a magnitude for ten smaller magnitudes before removal.
- **Multiplication:** teach the documented table-and-memory practice with input-specific products and explicit magnitude signs; label the separated display a teaching application.
- **Division:** inverse table lookup/grouping is a useful input-specific reconstruction, not a directly quoted basic division rule from Kaṇakkatikāram.

The app’s traditional representation has ten/hundred/thousand signs rather than implicit zero-bearing places. Show that distinction throughout the calculation. Distinguish supported knowledge of multiplication tables from a claim about the exact layout of a multi-digit written algorithm.

Research trail also included surviving manuscripts in the [French Institute of Pondicherry collection](https://digitalcollections.ifpindia.org/s/manuscripts/item/359789) and the [Archive of Mathematical Practices](https://exhibits.cooponscitech.in/s/shmp_landing/document/KKM_GOML_CHN_TR_1194_R_6174), plus the ETH draft edition. Manuscript catalogue presence establishes a source to pursue, not an unread algorithm. The ETH download was unavailable to the fetch tools; the published manuscript study was inspected through its full-text copy.

## Chinese counting rods

Inspected original Chinese and translated text in [Sunzi I §8](https://yawnoc.github.io/sun-tzu/i/8) and [I §9](https://yawnoc.github.io/sun-tzu/i/9), and checked surface conventions against [St Andrews](https://mathshistory.st-andrews.ac.uk/HistTopics/Chinese_numerals/).

- **Addition and subtraction:** the app’s place-by-place combine/remove and ten-for-one exchange illustrations are reconstructions of board mechanics. Do not describe their displayed order as a verbatim Sunzi instruction.
- **Multiplication:** three rows: upper factor, middle product, lower factor. Place alignment, accumulation, carrying, erasure, and rightward retreat of the lower row are supported by §8.
- **Division:** middle dividend, lower divisor, upper quotient; align places, subtract a quotient multiple, and move the divisor row right. Preserve the final remainder.

The selected Song-style rod orientations are later than Sunzi’s convention. The teaching application may keep the selected artwork, but it must say so. A rod board is not a bead abacus. Negative-rod conventions are historically real, though this adapter’s signed artwork is limited.

## Suzhou: abacus calculation and written recording

Inspected the original archival research in [LSE Working Paper 220, pp. 18–19 and Appendix II](https://www.lse.ac.uk/asset-library/information/wp220.pdf). It distinguishes abacus calculation outside the books from Suzhou recording. The scholar’s reconstructed examples of book entries should not be called direct transcriptions of every merchant’s workflow.

For actual moves, inspected Kwa Tak Ming’s contemporaneous [The Fundamental Operations in Bead Arithmetic (1922)](https://hdl.handle.net/2027/uc1.$b448675), printed pp. 6–38. A complete PDF was fetched and its OCR inspected. [Tsinghua’s surviving late-Ming suanpan](https://tsm.tsinghua.edu.cn/?p=2769) independently corroborates the physical device.

- **Addition:** Kwa pp. 10–13: work left-to-right; direct moves or complements of five/ten.
- **Subtraction:** Kwa pp. 14–16: left-to-right inverse complement moves.
- **Multiplication:** Kwa pp. 17–25: table products; one-digit in-place calculation proceeds right-to-left and erases finished operand digits. Other variants exist; do not claim a universal multiplication direction.
- **Division:** Kwa pp. 26–38: single-digit division rules; longer divisors combine a provisional quotient with multiplication/subtraction and correction. A separated quotient/remainder illustration is an adaptation.

The icon should have two upper and five lower beads per column; active beads touch the middle beam. Normalized decimal digits use one five-bead and up to four one-beads; the other beads remain visibly inactive. Label columns and explain each changed bead quantity. Suzhou numeral rows record the same quantities. The illustration must not show static Suzhou marks moving as if they were rods.

## Old Persian

Inspected [Everson’s final Old Persian proposal](https://www.unicode.org/L2/L2003/03149-n2583-old-persian.pdf), not merely an unsupported modern converter. Checked the administrative distinction against [Persepolis Elamite Tablets](https://www.iranicaonline.org/articles/persepolis-elamite-tablets/). The latter records actual administrative calculation contexts, but its language/notation are not automatically those of Old Persian royal inscriptions.

All four selected-notation procedures remain explicit reconstructions. Addition collects equivalent 100/20/10/2/1 quantities; subtraction splits those denominations before removal; multiplication repeats the represented groups; division makes equal groups and preserves a remainder. Every step should display the relevant Old Persian quantity. No inspected source established a general four-operation manual using these exact royal-inscription signs.

Do not use Babylonian reciprocal arithmetic or sexagesimal carrying simply because both scripts use wedges. Do not silently substitute Elamite or Aramaic numerals.

## Phoenician

Inspected [Everson N3284](https://www.unicode.org/L2/L2007/07206-n3284-phoenician.pdf), which researches inscription-based tally clumps and numeral strings. Searches also considered commercial documents and supposed abacus connections. No specific Phoenician calculating tool or complete four-operation algorithm was established by the inspected sources.

All four lessons therefore show explicit notation-based reconstructions: merge and normalize tally quantities for addition; split denominations and cancel for subtraction; repeat actual groups for multiplication; make equal groups and a remainder for division. Preserve right-to-left output and 1/2/3 tally clumps. The dedicated twenty is a denomination, not proof of a positional base-20 algorithm. Contact with Egypt or Greece does not prove use of Egyptian doubling or a particular Greek counter board.

The present adapter stops below 100; the source’s hundred-multiplier convention should not be generalized through repeated hundred signs without implementation work.

## Ottoman Siyaq

Inspected [Pandey’s proposal and reproduced records](https://www.unicode.org/L2/L2017/17348-ottoman-siyaq.pdf), [Fazlıoğlu’s original survey of accountant manuscripts](https://dergipark.org.tr/tr/download/article-file/651470), and [Örten, Kurt, and Torun’s Kitab-us Siyakat study](https://dergipark.org.tr/en/download/article-file/319992). The latter’s accounting-system argument does not supply a bead/column arithmetic algorithm. Searches included Turkish operation names, Hacı Atmaca’s Mecmaʿ al-Kavāʿid, Nasuh’s Umdetü’l-Hisāb, and manuals of accounting mathematics.

The sources support actual accountant education in the four operations, multiple multiplication methods, and Hindu digits alongside Siyaq. They do not establish that the specific illustrated arithmetic sequence was performed directly on the recorded Siyaq signs. Classify these as calculation-and-recording lessons: add order quantities, subtract an expense with any needed exchange, accumulate partial products, or form quotient groups/remainder; then render the result in Siyaq. Explain this distinction at the selected operator, rather than withholding a numerical walkthrough.

Use dedicated order signs and the correct compound ordering. Siyaq’s specialized multiplier signs and fraction conventions must not be confused with ordinary positional digits. An abacus is not warranted by the inspected evidence for this entry.
