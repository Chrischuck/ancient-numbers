# Māori and Hawaiian productive counting

These converters replace selected-example restrictions with documented word-building rules. They use contemporary isolated counting variants; historical grouping vocabularies and grammar for counting people or things remain explicitly distinguished.

## Māori: 0–9,999

[Native Council’s Māori Made Easy lesson](https://www.maorilanguage.net/maori-made-easy/week-2-monday/) prints zero, units, teens, tens, `kotahi rau`, `rua rau`, `kotahi mano`, and the expanded examples 1,988, 2,001, and 2,011. [New Zealand Ministry of Education’s Ngā Tau resource](https://kauwhatareo.tahurangi.education.govt.nz/ng-tau/5637248083.p) teaches grouping through thousands and distinguishes e/toko- sentence forms. [Manatū Taonga’s vocabulary](https://nzhistory.govt.nz/culture/maori-language-week/365-maori-words), compiled by Martin Wikaira, independently lists 99, 100, 900 and 1,000.

The adapter composes thousands and hundreds with `kotahi` for a coefficient of one; a single ten is `tekau`. Extra units use `mā`. Bare one is `tahi`. Optional punctuation between groups is omitted. The 0–9,999 bound keeps a four-place teaching scope; it is not a claim about the language’s limits. The 56 and 9,999 outputs are worked applications of documented productive rules, not falsely attributed printed specimens.

## Hawaiian: 0–100

[Kaliko Trapp’s ʻŌlelo Online lesson](https://oleloonline.com/hawaiian-number-basics-1-to-100-0502v/) supplies the whole 11–99 rule in publicly readable prose, the full 20–29 table, and the `kana-` tens. It explicitly identifies `iwakālua` as an irregular whole name. This implementation preserves bare roots and uses teaching hyphens at `-kūmā-`; the outer `kana-` is joined in the familiar complete tens forms. Hyphens do not claim a unique standard orthography.

[ʻŌiwi Parker Jones’s primary linguistic dataset](https://lingweb.eva.mpg.de/channumerals/Hawaiian.htm), provided in 2006, corroborates the compounds and documents `hoʻokahi haneli` for 100. Its phonetic transcription is converted to the spelling used by the teacher. [The teacher’s zero/one lesson](https://oleloonline.com/0504v-zero-and-one-quantity-and-question/) confirms `ʻole`, bare `kahi`, and the quantity distinction. The converter does not silently add quantity prefixes.

The earlier [group-word lesson](https://oleloonline.com/0503v-traditional-hawaiian-number-groups/) remains represented in the dictionary: `kāuna`, `kaʻau`, `lau`, and `mano` are labeled traditional object-group terms. They are not used as interchangeable default ordinary decimal number names. For example, 40 now converts as `kanahā`, while `kaʻau` stays in the glossary with its original context.

`tests/spoken-polynesian.test.ts` checks published examples, independently expected rule applications, the full bounded domains, zero, invalid bounds, and preservation of the separate grouping glossary.
