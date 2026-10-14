# Ancient Numbers

A world of ways to count. A free, static exploration of 36 written, spoken, and physical counting traditions, with 26 whole-number converters and ten sourced specimen explorers.

![Ancient Numbers converter preview](docs/preview.png)

**Deployment target:** https://cumputersluts.github.io/ancient-numbers/

## Explore

- Translate familiar digits into documented numeral variants.
- Calculate with exact rational arithmetic: addition, subtraction, multiplication, and division.
- Compare three traditions, share a calculation, copy encoded numerals, or save self-contained vector artwork.
- Search the collection by name, location, region, or mathematical structure.
- Read the source references, notation limits, and selected period on each system page.

The collection includes modern and living traditions as well as ancient ones. Spoken number words are not given invented written glyphs. Physical representations are labeled as modern teaching diagrams.

## Run locally

Requires Node.js 22.12 or later; CI uses Node.js 24.

```sh
npm ci
npm run dev
```

Open the printed URL with `/ancient-numbers/` appended. The repository base path is intentional and used in development, preview, and production.

```sh
npm run verify       # Type checks, unit/data tests, static build, link/payload checks
npm run test:browser # Browser, interaction, layout, and accessibility checks
npm run preview     # Inspect the production build
```

Browser tests use system Google Chrome on macOS when present. Elsewhere, install the test browser with `npx playwright install chromium`. GitHub Actions installs its Linux browser dependencies automatically. A small static preview server is used only for tests; it is not part of the deployed app.

## GitHub Pages

The repository contains `.github/workflows/pages.yml`. Pull requests run verification. Successful pushes to `main` upload and deploy the static `dist/` artifact through the official GitHub Pages actions.

A repository owner or maintainer must select **Settings → Pages → Build and deployment → Source → GitHub Actions** once. The connected development account has push access, but cannot change that administration setting. After enabling Pages, rerun the workflow or use its **Run workflow** button. No custom domain, secrets, runtime functions, or paid services are required.

Astro is configured with `site: 'https://cumputersluts.github.io'`, `base: '/ancient-numbers'`, and static output. Every internal link, asset, and share URL respects this base.

## Architecture

- `src/data/`: typed, source-backed system descriptions and example fixtures.
- `src/glyphs/`: vector paths, Unicode metadata, provenance, and artwork references.
- `src/lib/numbers.ts`: exact `BigInt` rational arithmetic and input parsing.
- `src/lib/format.ts`: notation adapters, independent of SVG drawing.
- `src/lib/render.ts`: accessible rendering, logical-order text copying, and path-only SVG exports.
- `src/pages/`: prerendered collection, system, and editorial pages.

There is no framework runtime in the browser. Content is generated as HTML; small TypeScript modules handle interactions. Regional glyph chunks load only when needed. Fonts are hosted locally. Inputs allow at most 100 digits, and representations at most 256 elements.

## Link previews

Open Graph and Twitter metadata use `public/social-card-v1.png`, a 1200 × 630 image. The three examples encode 69 in Kaktovik, Maya, and Cistercian numerals. Regenerate the PNG and path-only SVG with `npm run generate:preview`; the script reuses the converter rules, glyphs, and local interface fonts. The preview adds no image download to normal page loads.

## Accuracy and limits

Conversion follows named variants with explicit ranges. Some systems currently support a narrow interval (for example, Brahmi below 100). Sinhala Illakkam supports 1–9,999 using documented hundred and thousand multipliers. Those are app limits, not historical claims. Ten entries intentionally offer individually verified specimens rather than an arbitrary-number converter.

A modern cell grid fixes the integer scale for Old Babylonian notation and makes empty counting-rod positions visible. Ordinary Maya base-20 notation is kept separate from Long Count calendar notation. The calculator does not claim to reproduce historical arithmetic procedures. Fractional and negative answers remain exact even when their historical rendering is unavailable.

Each system contains formation references and at least three worked examples. Tests compare source examples and important boundaries; they do not substitute for specialist or community review. Corrections with inspectable references are welcome.

## Drawing approach

The original geometric artwork uses a 100-unit canvas, an optical center near `(50, 50)`, approximately 64-unit principal height, 4.2-unit strokes, round joins/caps, and inherited color. Preserve script-specific proportions, meaningful stroke intersections, wedges, and combining-mark placement. Several variants intentionally reserve blank space or use different proportions.

Intricate cursive forms use optically harmonized, openly licensed outlines with explicit `adapted` provenance. All original and adapted paths use the same renderer and presentation. Sources and adaptation notes are in `docs/africa-sources.md`, `docs/asia-sources.md`, `docs/core-sources.md`, and the per-glyph metadata. Do not relabel adaptations as original artwork.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Original code, writing, and original vector artwork use MIT; third-party adapted artwork and fonts retain their licenses. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
