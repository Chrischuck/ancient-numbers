# Written converter expansion audit

The application now implements three formerly example-only written entries. These are bounded converters for identified notation conventions, rather than claims about a culture’s full arithmetic or counting range.

| Entry                        | Supported whole numbers | Formation evidence                                                                                                  | Artwork                                                              |
| ---------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Mende Kikakui                | 1–9,999,999             | Nine digits; special teens subscript; six magnitude subscripts through a million; add groups in right-to-left order | Original attached-group vector drawings                              |
| Sequoyah’s Cherokee numerals | 0–100                   | Complete Cherokee Nation chart for each amount                                                                      | Original vector interpretations of its dedicated numerical signs     |
| Ottoman Siyaq                | 1–9,999                 | Primary signs for units, tens, hundreds, thousands; documented RTL ordering and transposed units/tens               | Adapted, openly licensed Noto primary-sign outlines; teaching spaces |

## Mende Kikakui

[Unicode 17, §19.8 and Table 19-6](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/) identifies digits 1–9, multiplier subscripts from 10 to 1,000,000, and a distinct teens subscript. It specifies that 11–19 use the units digit with the teens mark, while other marked digits multiply by their magnitude. Complete numbers add groups, largest first in right-to-left reading order. Its exact examples are 10, 14, 27, 206, 417, and 784; tests assert the literal Unicode sequences for all six.

The [Mende Kikakui character chart](https://www.unicode.org/charts/PDF/U1E800.pdf) identifies U+1E8C7–U+1E8CF and U+1E8D0–U+1E8D6. The hundreds-through-millions marks have two through six short bars over the curved lower component. Original geometry follows these defining features. The digit and mark are drawn inside one SVG so the mark is never rendered as a detached arithmetic sign. Character groups are reversed for the visual display; `Representation.unicode` preserves logical order for copying.

The upper bound follows the largest verified multiplier with a single coefficient digit. No invented ten-million mark or zero placeholder is introduced. Values such as 417 use the teens mark on seven for the final group, rather than appending separate ten and seven groups. This is a sign-value construction based on powers of ten, not positional decimal writing.

## Sequoyah’s proposed Cherokee numerals

The primary source is the [Cherokee Nation Language Technology chart, “Sequoyah’s Original Numbers 0–100”](https://language.cherokee.gov/media/541f3lhk/sequoyah_original_numbers_updated.pdf). The complete one-page chart was visually inspected from the previously downloaded source PDF. The live endpoint failed in the research browser during this audit; the inspected local source matches the source already used for this project’s original four numerical forms.

The chart explicitly supplies all 101 amounts. Zero through nineteen have dedicated forms; twenty and the higher tens through ninety also have distinct signs. For 21–99, every non-round amount is shown as its tens sign followed by its units sign. One hundred has a separate final sign. The app implements only that complete bounded chart: no extrapolation above 100. Tests cover every chart amount and explicitly distinguish the fourteen sign from a ten-plus-four construction.

The artwork consists of original centerline interpretations, not extracted PDF outlines or substitutions with Cherokee syllabary characters. The [Unicode 17 Cherokee section](https://unicode.org/versions/Unicode17.0.0/core-spec/chapter-20/) distinguishes the proposed numerical repertoire from the encoded syllabary. No invented Unicode copy equivalent is returned. The proposed numerals’ limited historical adoption says nothing about contemporary Cherokee language vitality or its capacity to express larger amounts.

## Ottoman Siyaq

[Unicode 17 §22.3.7](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-22/) establishes whole sign values, addition, omitted zero groups, and right-to-left reading. It specifically distinguishes transposed compound units/tens from descending order at other magnitudes.

[Anshuman Pandey, L2/17-348, “Proposal to encode Ottoman Siyaq Numbers”](https://www.unicode.org/L2/L2017/17348-ottoman-siyaq.pdf), §4 (PDF pages 8–10), gives explicit character sequences for 55, 505, 550, 555, 5,005, and 5,500. For 55, the logical sequence is five then fifty; for 555, it is five hundred, five, fifty. These source fixtures protect against an incorrect generic descending-additive implementation. The proposal contains a codepoint typo in the textual sequence for fifty in its 555 row; the represented character, name, adjacent examples, and Unicode repertoire identify U+1ED0E as fifty. Tests use the confirmed value, not that typo.

The primary repertoire is U+1ED01–U+1ED24, as identified by the [Unicode chart](https://www.unicode.org/charts/PDF/U1ED00.pdf). Thirty-six primary signs are drawn from the same Noto Serif Ottoman Siyaq Version 1.006 font already used for the app’s three original specimens. Existing optical normalization is preserved; source, adaptation provenance, full SIL OFL 1.1, and Copyright 2022 Google LLC notices already exist in `public/reference/asia/Ottoman-OFL.txt`, `FONT-NOTICES.txt`, and exported SVG metadata. No modified font binary is distributed.

Manuscripts also use joined forms, alternate signs, quantity labels, fractions, and higher-order conventions. The converter explicitly uses primary characters with spaces for teaching. It stops at 9,999, avoiding unimplemented higher-order multiplication and ten-thousand transposition. This range is an app choice. Fractions remain unsupported by the whole-number renderer; existing fraction repertoire descriptions are retained as context, not a promise of conversion.
