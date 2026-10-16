# Spoken number dictionaries and Yorùbá construction

The dictionaries in `src/lib/spoken.ts` describe the selected spoken counting
traditions. They are vocabulary keys, not invented alphabets. Language spelling
and the counting context matter.

## Yorùbá

- [LedeYoruba, number words and counting contexts](https://www.ledeyoruba.com/learn/yoruba-numbers/): the isolated counting forms 1–20 and tens through 100, and the distinction between these forms and object-counting words.
- [Matthew Ajibade, _A construction morphology approach to Yoruba numerals_ (2023)](https://constructions.journals.hhu.de/article/download/549/585/2271): original linguistic analysis by a native speaker. Tables 3, 4, 7 and 10 support the roots, multiples of twenty, tens formed by subtracting ten, and productive addition of 1–4 or subtraction of 1–5. Thirty is a lexical basic number in this account.
- [Kelvin Obareti / CreatedbyKelz, _Yoruba Number System_ (2022)](https://www.createdbykelz.com/2022/01/yoruba-number-system-yoruba-numerals.html): complete attested expressions for 54 and 56, with source spacing and tones retained.

The bounded 1–100 converter preserves those attested forms. Other compounds are
deliberately **expanded morphological teaching forms**: a root, `lé` or `dín`,
the full linking preposition `ní`, and a named anchor are separated by dots.
Ajibade shows the contracted preposition as `l-` in segmented examples, and
discusses its full form in `lé ní ẹ̀wá`. The teaching display does not predict
contractions or tones of a standard complete compound. Its explanation labels
this distinction on every generated example.

The numeric expression for 54 is `50 + 4`, expanded as
`(3 × 20 − 10) + 4`. Direct `60 − 6` is mathematically equivalent but does not
describe the usual word formation. By contrast, 56 is formed by subtracting
four from sixty. Number-name structure is not evidence that all speakers
perform everyday arithmetic by a particular algorithm.

## Other dictionaries

- [Choctaw Nation of Oklahoma, Choctaw 1, Chapter Two, Lesson 1](https://www.choctawnation.com/lessons/choctaw-1/chapter-2/lesson-1/) and [Lesson 2](https://www.choctawnation.com/lessons/choctaw-1/chapter-2/lesson-2/): all ten isolated counting words, preserving `ʋ`.
- [Diné College Learning Center, Navajo Numbering System](https://warriorweb.dinecollege.edu/ICS/Portlets/ICS/Portlet.Resources/ViewHandler.ashx?id=082af43e-c530-4f62-832f-369283e05afc): all ten units and tens through ninety, teen and tens elements, and the different compound linking conventions for twenty and thirty upward. The dictionary preserves this particular guide’s orthography, including nasal vowels in `dį́į́’` and `hastą́ą́`, alongside `tseebíí`; it does not silently replace them with forms from other sources. The same guide is searchable at its [direct archived reference path](https://warriorweb.dinecollege.edu/ICS/icsfs/Reference_Guide_-_Navajo_Numbering_System.pdf%3Ftarget%3D877c9878-48f3-4a69-87f7-dfb9cf51dfeb). The complete chart now supports every integer from 1 through 100; see [American converter evidence](american-conversion-sources.md).
- [Manatū Taonga, A Māori word a day](https://nzhistory.govt.nz/culture/maori-language-week/365-maori-words): contemporary 1–10 vocabulary and multiples of ten. [Te Aka, tekau](https://maoridictionary.co.nz/search?keywords=tekau) documents `mā` compounds and the historical change in `tekau`'s meaning.
- [ʻŌlelo Online, Traditional Hawaiian Number Groups](https://oleloonline.com/0503v-traditional-hawaiian-number-groups/): object-grouping terms. Larger terms can express abundance; group names are not positional digits.
- [Bender and Beller, Mangarevan invention of binary steps for easier calculation (2013)](https://math.hawaii.edu/~tom/ethnomathematics/PNAS-2013.pdf): Table 1 supplies the unit vocabulary, grouping terms, and `tauga`. `varu` is listed twice deliberately: eight in the unit context and eighty as a grouping term. Object quantities per counting unit vary.

## Productive converter expansions

The original vocabulary-only entries now have bounded full converters: Māori 0–9,999, Hawaiian 0–100, Choctaw and Diné/Navajo 1–100, and Mangarevan 1–799 counting units. See [Polynesian converter evidence](polynesian-conversion-sources.md), [American converter evidence](american-conversion-sources.md), and [Pacific count evidence](pacific-conversion-sources.md). Hawaiian ordinary decimal counting and traditional object-group names remain explicitly distinguished.
