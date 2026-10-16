# European arithmetic: sources, tools, and notation boundaries

Research checked 16 October 2026. All six European entries have an operation-level profile in `src/data/arithmetic-europe.ts` and a numerical walkthrough for all four operations.

## Greek and Roman calculation

Inspected [J. Hilton Turner’s specialist reconstruction and quoted ancient examples](https://penelope.uchicago.edu/Thayer/E/Journals/CJ/47/2/Roman_Elementary_Mathematics%2A.html), [the Oxford Classical Dictionary’s abacus entry](https://doi.org/10.1093/acrefore/9780199381135.013.1), [the Salamis tablet museum record](https://www.computerhistory.org/revolution/artifact/1/128), and [University of Reading’s experimental Roman arithmetic](https://blogs.reading.ac.uk/classics-at-reading/2025/09/19/roman-arithmetic-for-all/). Targeted searches covered Attic abacus addition, subtraction and division; Greek alphabetic multiplication; Eutocius; and the distinction between surviving tools and reconstructed moves.

- **Greek alphabetic multiplication:** Turner reproduces Eutocius’ full 265 × 265 calculation. Pair 200, 60, and 5 against the same three values and collect nine products to obtain 70,225. The calculator uses whole letter-values, with new operands. The current letter renderer stops at 999; that artwork limit must not erase the calculation or create unimplemented thousands notation.
- **Greek alphabetic addition, subtraction and division:** the counter tool is historically supported, while the particular arbitrary-input moves are a reconstruction. Turner explicitly treats simple division more conjecturally than the surviving multiplication example. The calculator therefore shows actual counter states and labels their evidential status.
- **Greek Attic:** the signs can label a line abacus, but Eutocius’ later alphabetic example is not direct evidence for the earlier Attic script. All four particular walkthroughs are transparent counter-board reconstructions. The final Attic numeral records the quantity.
- **Roman:** the evidence supports counter-based calculation. Combine and remove one/five counters, exchange across decimal places, accumulate products, or count removed groups. These pictures are a simplified reconstructed counter board, not a facsimile or a claim that one recovered algorithm governed every Roman calculation. Written subtractive pairs are recording conventions, not the counter movements.

The workspace renderer draws active counters, empty positions, and changed columns. Before/after quantities remain visible together. It does not identify the arbitrary color, spacing, or frame with a surviving artifact.

## Cistercian written cipher

Inspected [David A. King’s author-posted research and manuscript survey](https://uni-frankfurt.academia.edu/DavidAKing/CIPHERS%20OF%20THE%20MONKS), the author-posted 1995 paper, and the notation proposals already used by the exhibit. Searches explicitly included arithmetic and calculation, rather than taking the cipher’s decimal decomposition as an algorithm.

The survey establishes compact quantity recording: manuscript numbering, indexes, scales and related applications. A general four-operator procedure that manipulates the cipher’s strokes was not established. Each calculator operation consequently shows a separate **illustrative** counter workspace, then redraws the cipher for its running quantity. Addition must not overlay two staffs; subtraction must not blindly erase shared strokes; multiplication and division must not treat a quadrant’s geometry as an operator. Classify these as calculation-and-recording examples, with that boundary visible, rather than leaving a blank lesson or inventing medieval algorithms.

## Bede’s finger positions

Inspected the primary chapter-1 pose instructions reproduced in [Bede’s Latin finger system](https://medieval-baltic.us/latinbede.pdf), the publisher record for Faith Wallis’s translation of _The Reckoning of Time_, and the exhibit’s exact woodcut source. Searches covered finger reckoning, multiplication, division and the chapter title _De computo vel loquela digitorum_.

The selected source establishes the hand positions for decimal quantities. It does not establish that a modern finger multiplication trick is Bede’s algorithm. All four examples therefore use the attested hand positions as quantity states in explicitly reconstructed combining, removing, equal-group and quotient-group procedures. The count of groups remains distinct from the amount held on the hands. The final supported hand pose is always retained.

## La Trappe / Cistercian gestures

Inspected the primary _Heure_ entry in [Du Bois’s 1824 sign list](https://www.medieval-baltic.us/trappe.pdf) and the distinct Loccum counting action in the original [1717 printed list](https://digitale-sammlungen.gwlb.de/content/730901130/pdf/00000647.pdf).

This exhibit’s gestures communicate hours, including documented fractional time meanings. They are not a general written numeral alphabet. Addition joins durations, subtraction removes an interval, multiplication accumulates equal intervals, and division partitions a duration. The numerical work is illustrated separately from the time signal, with **recording** status. A whole-hour signal outside the supported 1–10 vocabulary is not invented. No recipe for manipulating fingers as a four-operator calculator is attributed to the sign list.

## Classification is not a historical-capability verdict

The reconstruction and recording labels state what the inspected sources support for this particular notation and display. They do not say that a community could not calculate, that a culture used only one method, or that the research establishes universal historical absence.
