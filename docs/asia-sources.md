# Asian numeral artwork and adapters

All visible glyphs are path-only SVG assets on a 100 × 100 optical canvas. Original line drawings use the collection's 4.2-unit stroke, round caps, and round joins; wedge forms preserve taper. Color is inherited from the interface. These are designed specimens of identified numerical signs, not facsimiles of individual artifacts.

## Reusable artwork and licenses

`src/glyphs/asia.ts` identifies every sign's encoding, reference, and provenance.

- **Original geometric artwork:** Brahmi; Kharoshthi; Phoenician; Old Persian; Song/Unicode counting rods; Suzhou (including horizontal alternatives); schematic Babylonian wedge clusters. MIT license applies to our original drawings. Historical/Unicode references establish shape and value; no code-chart font outlines or museum images were extracted.
- **Adapted open font outlines:** Sinhala archaic, Tamil, and three Ottoman Siyaq specimens derive from Noto. These must retain SIL Open Font License 1.1 terms, even though the application code is MIT. Notices are at `public/reference/asia/Noto-OFL.txt` and `Ottoman-OFL.txt`; exact embedded copyright/version notices are retained in `FONT-NOTICES.txt`.
- Sources: [Noto archived font collection](https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf) families NotoSansBrahmi, NotoSansKharoshthi, NotoSansSinhala, NotoSansTamil, NotoSansOldPersian, and NotoSansPhoenician. Ottoman source: [Noto Serif Ottoman Siyaq distribution](https://github.com/notofonts/notofonts.github.io/tree/main/fonts/NotoSerifOttomanSiyaq) and [source project](https://github.com/notofonts/ottoman-siyaq-numbers).
- Adaptation: remove font metrics, hints, and character layout dependency; normalize each outline's optical center and proportional size to the collection canvas; preserve wide and short historical forms rather than stretch; apply a bounded light optical inset to non-cuneiform forms to approach the 4.2-unit line weight; simplify outlines within 0.07 canvas units. Cuneiform and calligraphic Siyaq retain their recognizable taper/contrast. Outline provenance is marked `adapted`, never `original`.
- SVG exports should retain attribution metadata for adapted shapes and link the OFL notices. The adapted artwork is named as part of Ancient Numbers; no modified font is distributed under a reserved Noto family name.

## Rules and range audit

**Brahmi:** old additive signs, not late positional digits. Below 100, larger sign then smaller sign. App supports 1–99 only. Higher hundred/thousand multipliers require the meaningful BRAHMI NUMBER JOINER and ligatures, which this adapter does not render. Do not extrapolate greedy repetition of hundreds. Reference: Unicode 17 chapter 14 §14.1.

**Kharoshthi:** logical order is high to low, visual direction right to left. Use thousand sign(s), unit multiplier (sum of fours etc.) before the hundred sign, repeated twenties then ten, then units as sums from four/three/two/one. Unicode chapter 14 gives exact logical 1996 sequence `1000 4 4 1 100 20 20 20 20 10 4 2`; the visible SVG-token sequence must reverse this. Range1–9999 is an app bound. No zero.

**Sinhala Illakkam:** distinct from positional zero-bearing Lith Illakkam. Archaic repertoire and numerical values confirmed by Sri Lanka Standards Institution N3888 (L2/10-337) pp9–10, chart pp8–9. App supports additive units/tens 1–99 only until compound higher-order forms receive a separate study. `sinhala-100` and `sinhala-1000` are authentic reference glyphs but are not a license to infer Tamil-like multipliers.

**Traditional Tamil:** multiplicative powers1000,100,10 in descending order; omit multiplier1. Ones at end. UTN21 independently gives20,156,3782 and many larger forms. This adapter stops at9999; larger historical forms are an app limit, not absent from the tradition. No inserted positional zero.

**Counting rods:** selected Song-period/Unicode convention: UNIT DIGIT ONE U+1D360 is a **horizontal line**; TENS DIGIT ONE U+1D369 is a **vertical line**. Units/hundreds use unit set; tens/thousands use tens set. Units6–9 have an upward vertical five-bar with1–4 horizontal rods below; tens6–9 have a horizontal five-bar above1–4 vertical rods. Confirmed visually against Unicode's U1D360 chart and against [2019 ISO draft chart](https://unicode.org/wg2/docs/n5100-Draft-6thEdition-CD-3-chart.pdf). Earlier Han conventions swap orientations. Zero is an empty cell (`rods-zero`, empty paths). Do not substitute a modern circular zero without describing a different written variant. The rendered grid and place labels are modern teaching aids.

**Suzhou:** LSE Working Paper220 AppendixII p30 examines merchant account archives and explicitly gives123→〡二〣 and312→〣一〢 (also horizontal-first alternatives). Runs of digits1–3 alternate vertical/horizontal, reset on0 or4–9; our deterministic choice begins vertical. Whole integers0–30 digits supported as an educational digit row, omitting unit/scale row used in complete price labels. Original four–nine drawings checked against Unicode L2/23-281 historical glyph review, especially loop-and-tail five, tall six/seven, and crossed nine. Horizontal alternatives IDs `suzhou-horizontal-1..3`.

**Old Persian:** five values1,2,10,20,100; descending additive left-to-right strings (Unicode17 chapter11 §11.3). App bound1–999. Do not reuse Babylonian sexagesimal rules simply because both look cuneiform.

**Phoenician:** six signs1,2,3,10,20,100, right-to-left. App handles additive1–99 only. For example55 logical20+20+10+3+2 appears in reversed SVG token order. Unicode chapter10 shows143, but larger conventions are not generalized here without more study.

**Babylonian:** Old Babylonian integer transcription, not an unqualified mixture of all Mesopotamian numerical systems. Within each sexagesimal digit, tens/ones add. Vertical wedge1, corner wedge10. Modern cell separation fixes the integer place scale. `babylonian-0` is empty paths to represent an empty position, not standalone historical zero; min1, zero:false. Wedge cluster positioning is schematic and count-faithful, not a claim about one particular scribe's arrangement. Source: Casselman's direct analysis of Yale tablet YBC7289 and accompanying commentary. No tablet photos redistributed.

**Ottoman Siyaq:** specimens only, because compound conventions, alternate forms, and financial layout need specialist verification. Secure specimen values1 U+1ED01,40 U+1ED0D,1000 U+1ED1C. Sources: Pandey L2/17-348 and Unicode Ottoman Siyaq chart. Primary Noto outlines match those encoded forms; do not describe this as arbitrary conversion.

## Examples

Each `SystemDefinition` has at least three examples. Exact source-published examples are identified as such; other examples are small worked applications of cited formation rules, not claims to reproduce a specific inscription. Fractions/negative values outside these chosen adapters must remain visible as exact modern results with an explicit unsupported-notation explanation.
