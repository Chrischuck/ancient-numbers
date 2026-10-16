# Choctaw and Diné / Navajo number-word conversion

The converters in `src/lib/spoken-americas.ts` cover every whole number from 1
through 100. This is a bounded app range, not a limit of either language.
These are contemporary community educational counting forms. Neither entry
claims an ancient written numeral script, a unique dialect standard, an audio
pronunciation guide, or an arithmetic algorithm used by every speaker.

## Choctaw

Sources inspected on 2026-10-15:

- [Choctaw Nation of Oklahoma, Choctaw 1, Chapter Two, Lesson 1](https://www.choctawnation.com/lessons/choctaw-1/chapter-2/lesson-1/) and [Lesson 2](https://www.choctawnation.com/lessons/choctaw-1/chapter-2/lesson-2/) give the ten isolated counting words.
- [Choctaw Nation, Biskinik, October 2018](https://www.choctawnation.com/wp-content/uploads/2022/06/oct-2018-biskinik.pdf) has a language/calendar teaching table explicitly listing all values 1–31: `awah` precedes a unit in 11–19; 20 and 30 have `pokoli` followed by their multiplier; 21–29 and 31 insert `akocha` before the remainder.
- [Choctaw 2, Chapter Ten, Lesson 1](https://www.choctawnation.com/lessons/choctaw-2/chapter-10/lesson-1/) explicitly lists twenty and thirty. [Lesson 2](https://www.choctawnation.com/lessons/choctaw-2/chapter-10/lesson-2/) translates `pokoli chakkali` as ninety in a money sentence.
- [Choctaw Nation, 2025 year-end report](https://www.choctawnation.com/news/chiefs-blog/choctaw-nation-bids-a-fond-chi-pisa-la-chike-to-2025/) is a parallel English/Choctaw community text that attests the same decimal tens pattern at larger values: e.g. the 50 start-ups line uses `pokoli tahlapi`, the 570 students expression contains `tahlepa tahlapi, pokoli untuklo`, and the 100 LEAP homes line uses `tahlepa achvffa`.
- [Choctaw Nation, Lots of Progress in 2024](https://www.choctawnation.com/news/chiefs-blog/lots-of-progress-in-2024-for-the-choctaw-nation/) independently attests a forty-two compound (`pokoli ushta akucha tuklo`) for the forty-two foster homes in its parallel English/Choctaw passage. [Choctaw Nation Fights Poverty with Your Help](https://www.choctawnation.com/news/chiefs-blog/choctaw-nation-fights-poverty-with-your-help/) also uses forty-six, sixty-seven and ninety-nine compounds as portions of larger counts. These show that the chart's tens-and-units pattern continues above thirty-one.
- [The Choctaw Alphabet](https://dictionary.choctawnation.com/alphabet/) documents the Nation's teaching letter `ʋ` and spelling variation.

The converter extends the documented decimal pattern productively through 99,
then uses the attested hundred expression for 100. Ten is `pokkoli` alone, but
`pokoli` in multiplied tens. Teen `awah` goes before the unit; it does not take
the tens remainder connector. Larger compounds put the ten word before the
multiplier, then the connector and unit, so 56 is explained as `10 × 5 + 6`.

Spelling is explicit: the selected 2018 chart has `akocha`; more recent Nation
publications often have `akucha`. This app consistently selects the chart's
connector, and uses the teaching alphabet's `achʋffa` for the chart's `achvffa`.
This is an alphabetic rendering choice documented in the interface, not a claim
that the alternative spelling is wrong. Larger numbers, ordinal expressions,
and contextual counting forms are outside the implemented range.

## Diné / Navajo

Primary community source inspected visually on 2026-10-15:

- [Diné College Learning Center, Reference Guide: Navajo Numbering System](https://warriorweb.dinecollege.edu/ICS/Portlets/ICS/Portlet.Resources/ViewHandler.ashx?id=082af43e-c530-4f62-832f-369283e05afc), one-page scanned chart. It lists every integer 1–100 individually, followed by selected larger values and a suffix schematic.

The converter follows that entire 1–100 list, retaining separate-word spacing:

- 11–19 put the unit before `ts’áadah`. Eleven uses the short `ła’` form.
- 21–29 put the unit directly after `naadiin`; twenty-one also uses `ła’`.
- 31–99 put `dóó bi’aan` between the complete tens name and unit. The added
  one in 31, 41, etc. is the full `t’ááłá’í` form.
- 100 uses the chart's complete `t’ááłá’ídi neeznádiin` expression.

Visual inspection corrected earlier transcriptions: 4 has nasal vowels in
`dį́į́’`, 6 is `hastą́ą́`, 60 is `hastą́diin`, the short one form contains `ł`,
and the chart's ninety is `náhást’édiin` with one `é`. The exact forms are
covered by independent chart-specimen tests. The chart's conventions are not
claimed to exhaust all contemporary orthographic or compound variants.

Although the source also lists larger round numbers, it does not enumerate all
their combinations. This implementation stops at 100 instead of extrapolating
untested higher-number morphology. The mathematical explanations describe the
structure of names and distinguish it from evidence about arithmetic practice.
