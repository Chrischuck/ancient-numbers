# African numeral artwork and source ledger

The collection distinguishes a numeral notation from a language’s number words.
`src/data/africa.ts` records the variant, support range, and evidence for every entry.
A converter’s upper bound is an implementation limit unless explicitly stated otherwise.
Examples labeled as derived demonstrate published rules; they are not claimed as facsimiles
of particular manuscripts.

## Artwork construction

All 158 display assets are original geometric SVG reconstructions on a 100 × 100
coordinate grid, using the application’s 4.2-unit monoline, round terminals and round
joins. Dots remain filled circles. The same height, ink weight and spacing language
applies to every tradition while each sign’s topology, orientation, identifying curves,
component count and meaningful marks remain distinct.

The initial prototype used optically normalized Noto outlines for complex signs. A
complete redraw replaced every filled font contour with explicitly authored centerline
paths, checked against enlarged source forms. No font outlines remain in this module.
All metadata now marks these assets as `original`; IDs and Unicode encodings were
preserved across the redraw. No generated raster artwork was used.

Ethiopic upper/lower numeral bars are retained as structural components, including the
hundred and ten-thousand signs. Mende specimens are composed as single path-based
assets, keeping the subscript multipliers attached to their numeral and preserving
native right-to-left visual order. They must not be reversed a second time. N’Ko’s
separate digit tokens must be arranged right to left; copy text remains in logical,
most-significant-first order. Medefaidrin ordinary forms of 1–3 are valid in compounds;
optional alternate forms are also supplied.

## Reference font attribution

Noto Sans Medefaidrin, Mende Kikakui, Bamum, Ethiopic, NKo, Vai, Osmanya, Egyptian
Hieroglyphs, and Symbols 2 were used as secondary shape references while checking
encoded characters against their documented source identity. They are available at:

https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf

Copyright 2018 The Noto Project Authors (github.com/googlei18n/noto-fonts).
The fonts are licensed under SIL Open Font License 1.1. A copy is retained at
`public/reference/africa/NOTO-OFL.txt` for attribution to the reference collection.
No font file or extracted Noto contour is required or shipped by this glyph module.

## Primary references

- Medefaidrin: Rovenchak, Gibbon, Ekpenyong and Urua, 2016 proposal; community
  handwriting and numeral samples, section 6 and figures 3–5 and 10:
  https://www.unicode.org/L2/L2016/16101-medefaidrin.pdf
- Mende: Unicode 17, section 19.8, Table 19-6. Five complete examples are included as
  whole shaped specimens; the engine deliberately offers an explainer:
  https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/
- Bamum: Unicode 17 section 19.6 and code chart U+A6E6–U+A6EF. This entry uses modern
  Phase G decimal values; Koghom’s earlier value ten is explicitly distinguished:
  https://www.unicode.org/charts/PDF/UA6A0.pdf
- Ethiopic: Geʽez.org conversion explanation and Unicode 17 section 19.1. Omitting
  zero and suppressing one before magnitude signs is essential:
  https://www.geez.org/Numerals/index.html
- Coptic epact: Pandey 2011, sections 2 and 4. Examples 25, 205 and 250 are published
  examples; the implementation excludes thousands marks and number marks:
  https://www.unicode.org/L2/L2011/11062r-coptic-epact.pdf
- N’Ko: N’Ko Institute’s community-hosted proposal; Unicode 17 section 19.4 verifies
  that the most significant digit appears at the right:
  https://www.nkoinstitute.com/unicode/NKo%20Unicode%20Proposal.htm
- Vai: Unicode 17 section 19.5 and code chart U+A620–U+A629:
  https://www.unicode.org/charts/PDF/UA500.pdf
- Osmanya: Unicode 17 section 19.2 and code chart U+104A0–U+104A9:
  https://www.unicode.org/charts/PDF/U10480.pdf
- Yorùbá: LedeYoruba’s community teaching resource. Preserve exact source spelling
  in examples and distinguish abstract and object counting forms:
  https://www.ledeyoruba.com/learn/yoruba-numbers/
- Egyptian: UCL Researchers in Museums, October 2017; Unicode identities Gardiner
  Z1, V20, V1, M12, D50, I8, C11. The app uses a descending row rather than pretending
  to reproduce a particular inscription’s grouping:
  https://blogs.ucl.ac.uk/researchers-in-museums/2017/10/
  https://www.unicode.org/charts/PDF/U13000.pdf
- Rumi: Unicode 17 section 22.3.6 and the Rumi chart, using its encoded manuscript
  variant. This entry excludes historical fractional signs:
  https://www.unicode.org/charts/PDF/U10E60.pdf
