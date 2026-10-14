# Contributing to Ancient Numbers

Start with a documented tradition and a specific notation variant. Community publications, primary manuscripts, museum collections, specialist research, and Unicode specifications are useful sources. Provide inspectable links and page or section references.

## Adding or correcting a system

1. Add a `SystemDefinition` in the relevant regional data file. State the period, location, mathematical structure, and whether it is ancient, historical, living, or modern.
2. Provide at least three source-verified examples, including a boundary or distinctive composition rule. Distinguish source-published examples from worked applications of the source's rules.
3. Implement a formatting adapter only when its rules are sufficiently documented. Otherwise use `explainer` with authentic words or verified visual specimens.
4. Draw or adapt SVG paths in the matching glyph module. Record every glyph's source and provenance. Keep numerical interpretation separate from drawing.
5. Preserve reading direction and combining marks. Do not invent a zero, minus sign, fraction convention, or numeral alphabet to fill a documentation gap. Distinguish implementation limits from historical limits.
6. Add independent expected-value fixtures and meaningful boundary tests. Run `npm run verify` and `npm run test:browser`.

## Artwork

Follow the master drawing guide in the README. Compare the finished artwork with the reference at large and small sizes. Match optical weight and spacing while retaining all features that identify the sign. Historical variants should be named, not silently mixed.

Licensed outlines must be marked `adapted` and accompanied by the original license and attribution. Avoid external font dependencies in exported SVGs. Do not introduce raster or generative-image approximations of numeral signs.

## Accessibility and performance

Use semantic controls, keyboard navigation, visible focus, text descriptions, and reduced-motion support. Keep every URL compatible with `/ancient-numbers/`. Regional artwork should stay lazy-loaded. The build check enforces an initial JavaScript graph below60 KB compressed and an estimated initial transfer below250 KB.

A correction report is most useful when it identifies a concrete number, the current output, the expected output, the notation variant, and a supporting source. No community endorsement or specialist verification should be claimed unless it actually occurred.
