# African arithmetic source audit

Audit performed 15–16 October 2026 for the eleven entries in `src/data/africa.ts`. The implementation data are in `src/data/arithmetic-africa.ts`.

This audit asks three separate questions: what does the notation represent, what calculating practice is documented, and how far can that practice be applied to a new pair of calculator inputs? A numeral chart alone answers only the first question. A reconstruction remains a complete worked operation in the selected notation, but its label must not claim historical testimony. A lack of an identified algorithm is a limit of this source audit, not proof that users of a script could not calculate.

## Operation evidence matrix

`D` = documented practice applied to a new example; `R` = explicitly labeled teaching reconstruction; `M` = modern arithmetic taught in the script; `C` = calculating workspace plus recorded notation.

| Entry         | +   | −   | ×   | ÷   | Decisive boundary                                                                                                   |
| ------------- | --- | --- | --- | --- | ------------------------------------------------------------------------------------------------------------------- |
| Medefaidrin   | R   | R   | R   | R   | Community specimens establish base twenty; inspected sources give no procedure.                                     |
| Mende Kikakui | R   | R   | R   | R   | Magnitude subscripts are not positional digits; preserve verified combinations.                                     |
| Bamum         | R   | R   | D   | R   | Actual palace multiplication-table manuscripts; other written procedures not established.                           |
| Ethiopic      | R   | R   | D   | R   | Geʽez halving/doubling appears in a contemporary Ethiopian study.                                                   |
| Coptic epact  | R   | R   | D   | D*  | Surviving decadic multiplication tables and division tables specifically for 12, 24, 48.                            |
| N’Ko          | M   | M   | M   | M   | Community institute explicitly teaches familiar decimal operations.                                                 |
| Vai           | R   | R   | R   | R   | Script-specific historical digits were unpopular; modern literature uses European digits.                           |
| Osmanya       | R   | R   | R   | R   | Decimal repertoire established; no separate written arithmetic algorithm identified.                                |
| Yorùbá        | D   | R   | R   | R   | Observed addition/combining of cowry heaps; number-name grammar alone does not prove algorithms.                    |
| Egyptian      | R   | D   | D   | D   | Addition by glyph regrouping is illustrative; completion and tables are attested in hieratic working.               |
| Rumi          | C   | D   | D   | C   | Direct Rumi references for complementary subtraction and order-based products; positional ciphers used for working. |

_For Coptic division by a divisor other than 12, 24, or 48, the generator must explain that the new general grouping or division algorithm is a reconstruction. The manuscript does not justify labeling arbitrary long division as documented. Similarly, using known multiplication facts for an arbitrary large Bamum example is a worked extension, not a facsimile of the catalogue’s tables._

## Source and search trail

The searches below are representative actual queries from the audit. General search results were used to locate evidence; sources cited to users prioritize manuscripts, source editions, community resources, and original specialist research. Broad internet summaries and social-media posts were not accepted as proof of a historical algorithm.

### Medefaidrin

Queries: `"Medefaidrin" "arithmetic"`; `"Medefaidrin" "multiplication"`; `Medefaidrin arithmetic addition multiplication mathematics`; `"Medefaidrin" arithmetic numerals calculation multiplication school`.

Inspected [Rovenchak et al.’s 2016 proposal](https://www.unicode.org/L2/L2016/16101-medefaidrin.pdf), especially section 6 and the community numeral specimen, plus [Urua and Gibbon’s field-based linguistic study](https://wwwhomes.uni-bielefeld.de/gibbon/Dafydd_Gibbon_Publication_PDFs/2012_Urua_Gibbon_Medefaidrin_Spirit_Language_urua-gibbon-ACAL.pdf). The latter records operation vocabulary, which is evidence for concepts but not for a carrying, multiplication, or division routine. No algorithm was established. The teaching procedures must work directly with twenty-valued places, including digits above nine; ordinary decimal carrying would misrepresent this notation.

Follow-up lead: the proposal cites Hau’s 1961 account and Adams’s 1947 material. Their numeral charts are reproduced, but this audit did not obtain a complete independent arithmetic lesson from either work. Rovenchak’s 2012 Afrikanistik article was sought; its original URL did not return readable content during the audit.

### Mende Kikakui

Queries: `"Mende" "Kikakui" "arithmetic"`; `"Kikakui" calculation numerals Tuchscherer`; `"Mende Kikakui" "addition" "subtraction"`; `"Mende Kikakui" "comptabilité"`.

Inspected the specialist [Everson–Tuchscherer proposal](https://escholarship.org/uc/item/2387g2gr) and [Unicode section 19.8](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/). They establish attached magnitude marks and a separate teens formation. The renderer must preserve validated sign-and-subscript combinations rather than create an unattested combined mark simply to show a calculation. Teach the quantity groups and retain an explicit artwork limit when a complete numeral is unavailable.

Search results included accounts of accounting and school use, and references to Tuchscherer’s dissertation. These do not supply an inspected sequence of arithmetic manipulations. Do not equate the word “multiplicative” in a classification of numeral formation with evidence for a multiplication algorithm.

### Bamum

Queries: `Bamum mathematics multiplication arithmetic manuscript Njoya school`; `Bamum "multiplication" manuscript`; `site:searcharchives.bl.uk Bamum "multiplication"`; `site:eap.bl.uk Bamum "arithmetic"`; `"Bamum" "soustraction" "multiplication"`.

Found two independent primary catalogue records: [EAP051/1/2/31](https://searcharchives.bl.uk/catalog/040-002761353) and [EAP051/1/2/157](https://searcharchives.bl.uk/catalog/040-002761479). Both identify multiplication tables in Akauku Mfemfe numerals. The former explicitly identifies the beginning of the numerical sequence. A further search result identified EAP051/1/2/172 as another multiplication table.

This is positive evidence for multiplication-table use, not a generic digit chart. It does not establish subtraction borrowing or division. [Unicode’s digit discussion](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/) establishes the modern mapping. Explain why the modern zero cannot automatically be read into older manuscripts, and qualify long-multiplication layout as the lesson’s extension of attested table practice.

### Ethiopic

Queries: `Ethiopic numerals arithmetic multiplication division manuscripts calculations`; `"Ethiopic" "abacus"`; `"hasab" Ethiopic arithmetic manuscripts`; `Ethiopian Orthodox "computation" "fingers"`; `"Halving" "doubling" "Ethiopic" Neugebauer`; `"Ethiopian multiplication" "Ethiopia" evidence Gerdes`.

The most concrete procedure found is [Ayalew and Areaya’s 2021 original study](https://journalofmathematicsandculture.wordpress.com/wp-content/uploads/2021/06/sociocultural-mathematics-in-ethiopia-final-1.pdf), printed pp. 68–69, Figure 1. It presents Geʽez notation in a halving/doubling example. The procedure halves one factor with fractional halves dropped, doubles the other, removes even first-column rows, and adds retained second-column amounts. Its illustration is attributed to a 2018 video; it establishes a contemporary documented presentation, not a dated medieval origin.

The [Ethiopian Orthodox manuscript catalogue](https://www.ethiopianorthodox.org/amharic/holybooks/microfilmed%20manuscripts_aug2019.pdf) identifies Baḥra ḥasab works. These establish a real computus tradition, but a catalogue does not establish the mechanics of every elementary operation. Further bibliographic leads include Otto Neugebauer’s “Halving and doubling in Ethiopic computus treatises,” _Orientalia_ 51 (1982), pp. 409–410, and _Ethiopic Astronomy and Computus_. The former was identified through a specialist manuscript catalogue, but its complete text was not inspected, so it is not used as proof of a specific algorithm.

Rejected a 2023 paper’s claim that arithmetic is impossible without an Ethiopic zero. The claim is mathematically false: nonpositional notation and external calculating practices do not require a positional zero. Also rejected unsupported attribution of every so-called “Ethiopian multiplication” example on programming websites to ancient Ethiopia.

### Coptic epact

Queries: `Coptic epact numerals arithmetic calculation multiplication`; `"Coptic" "multiplication" "tables"`; `"Coptic epact" arithmetic`.

Inspected [T-S Ar.39.380’s primary manuscript transcription and translation](https://geniza.princeton.edu/en/documents/20917/) and [Pandey’s epact proposal](https://www.unicode.org/L2/L2011/11062r-coptic-epact.pdf). The manuscript uses the epact sign family, with letterform variants explicitly described. Its products are organized by decimal order. Division is a collection of entries for specified commercial divisors, with fractional answers. This gives a stronger lesson than generic conversion: show the consulted product or quotient entries and their composition.

The edition demonstrates specific entries such as 80 × 4 = 320 and 60 ÷ 12 = 5. For the app’s sample 13 × 24, a generated decimal-component table would be a worked extension of the attested format, not a claim that those exact entries survive in this fragment. The converter’s limited repertoire does not represent the manuscript’s higher orders or historical fractions; distinguish this display limitation from historical ability.

### N’Ko

Queries: `"N’Ko" mathematics addition subtraction textbook`; `"N'Ko" "mathématiques" calcul`; `Nko Institute mathematics calculator`; `Nko calculatrice chiffres Kanté application`.

Found the [N’Ko Institute’s own numeral tutorial](https://www.fakoli.net/pages/learn/numerals.html). It explicitly presents the four familiar operations in the script, so “modern arithmetic” is supported and a claim of a separate ancient N’Ko algorithm is unnecessary. [Unicode](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/) supplies the directionality authority. An [N’Ko calculator’s developer listing](https://apps.apple.com/cd/app/nko-jateb%C9%94lan-african-ed/id1552279686) independently documents contemporary use.

Implementation consequence: units are visually leftmost; carry/borrow toward the right. A long-division demonstration begins with the largest place, on the visual right. Do not simply reverse all mathematical text or operator order with unisolated bidi text. The Institute’s web examples themselves can display awkwardly; use its arithmetic description together with Unicode’s directionality rules.

### Vai

Queries: `"Vai" "numerals" arithmetic 1920`; `"Vai numerals" "Massaquoi"`; `"Vai" "numerals" "arithmetic"`.

Inspected the [Unicode Vai discussion](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-19/) and [2006 additional-character proposal](https://www.unicode.org/L2/L2006/06120-n3081-vai-additions.pdf). Their account corrects a misleading inference in the old exhibit: encoding a set of script-specific decimal digits does not establish that people commonly calculated with those forms. Use a clear teaching-reconstruction label for the Vai-glyph calculations. It remains useful to carry out each operator visibly in those digits, provided its provenance is stated accurately.

### Osmanya

Queries: `"Osmanya" arithmetic numerals multiplication`; `"Osmanya" mathematics Kenadid numerals`; `"Osmanya" "calculation"`; `"Osmanya" "arithmetic" "division"`.

Inspected [Everson’s primary encoding proposal](https://www.unicode.org/wg2/docs/n2361.pdf) and [the digit chart](https://www.unicode.org/charts/PDF/U10480.pdf). Both establish decimal digits and direction, not a named special arithmetic algorithm. The [2021 Asia-Pacific Linguistics Olympiad](https://aplo.asia/wp-content/uploads/2021/04/aplo-2021-prob.en_.pdf) supplies modern arithmetic equalities in the script, but a constructed contest exercise does not establish historical practice and is not cited as such.

The useful lesson is ordinary decimal work in Osmanya shapes, with the historical-algorithm claim withheld. It must show carries, exchanges, partial products, and quotient decisions, not stop at replacing the answer’s glyphs.

### Yorùbá

Queries: `Yoruba traditional arithmetic cowries multiplication division counting`; `"Adolphus Mann" "Numeral" Yoruba 1887`; `"Notes on the Numeral System of the Yoruba Nation" pdf`; `"Yoruba" "19 × 17" Mann`; `"Accounting Mathematics in West Africa" Verran full text`.

Inspected [Mann’s original observational account](https://aiatsis.gov.au/sites/default/files/catalogue_resources/m0043995v16s1.pdf), especially printed p. 62, through its digitized/indexed edition; direct PDF retrieval was intermittently blocked. [Verran’s author-provided field-based chapter](https://www.researchgate.net/publication/266282017_Accounting_Mathematics_in_West_Africa_Some_Stories_of_Yoruba_Number) was inspected for number grouping and its warning against treating a formal numeral taxonomy as a complete account of lived calculation. [Ajibade’s original linguistic analysis](https://constructions.journals.hhu.de/article/download/549/585/2271) supports number-name structure.

Mann’s grouping observation supports a worked combining-heaps addition lesson. It is not sufficient to infer all algorithms from words. The familiar 17 × 19 calculation found in Joseph’s and Huylebrouck’s histories is an illuminating pedagogical shell manipulation; its exact observation/provenance was not established from an inspected primary report, so the dynamic implementation should call its generalization reconstructed. Physical sharing and named fractions establish division concepts but not one historical long-division routine.

### Egyptian hieroglyphic

Queries: `Rhind mathematical papyrus addition subtraction complementary addition problem 21 22`; `ancient Egyptian addition subtraction papyrus carrying borrowing source`; `site:ucl.ac.uk "Egyptian" "subtraction" mathematics`; `Rhind papyrus addition subtraction "completion"`.

Inspected Chace’s edition of the Rhind Papyrus for [completion](https://en.wikisource.org/wiki/Page:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf/29) and [division as finding a multiplier](https://en.wikisource.org/wiki/Page:The_Rhind_Mathematical_Papyrus,_Volume_I.pdf/21), plus [Open University’s reproduced calculation](https://www.open.edu/openlearn/science-maths-technology/mathematics-statistics/egyptian-mathematics/content-section-1.1.2). These establish actual computational moves. The original papyrus uses hieratic, so explicitly identify the app’s hieroglyphs as illustrative quantity renderings.

Do not claim scribes literally crossed monumental hieroglyphs out on their calculation papyri. Combining ten identical signs and exchanging them for the next power is a useful addition model, but details of elementary addition/subtraction are sparse; it is labeled reconstructed. Completion is the stronger direct historical support for subtraction. Egyptian division can produce fractions, even when the app displays only a whole quotient and remainder.

### Rumi / Fasi

Queries: `Rumi numerals arithmetic addition multiplication ghubar finger reckoning`; `"rūmī" "addition" numerals`; `"Rūmī signs" division`; `"Rumi" "arithmetic" Ibn al Banna`; `"Arabic, Rūmī, Coptic" author`.

Inspected [al-Hawārī’s 1305 translated primary text](https://edition-open-sources.org/media/sources/14/sources14.pdf), especially translation §§85.16 and 104.1; [Rosa Comes’s original manuscript study](https://www.ub.edu/arab/suhayl/volums/volum3/paper%202.pdf), p. 167; and [Lazrek’s proposal containing primary manuscript specimens](https://www.unicode.org/L2/L2006/06291-rumi-rev.pdf). A local text extraction of the source edition was used because the complete PDF exceeds the browsing tool’s fetch limit.

Two direct findings support specific helpers: subtraction by finding a complementary addend starting at units, and multiplication by numerical orders. Comes documents a relationship between the Rumi signs and positional calculating ciphers. Thus the user’s desire for real historical calculation does not require pretending that every operation was performed directly on the final recording signs: a transparent calculating workspace is historically meaningful. A display of modern numeral conversion alone would still be insufficient.

## Implementation review points

1. Generate a complete operator-specific walkthrough for every combination, including reconstruction-labeled cases. Do not substitute a static evidence notice for arithmetic steps.
2. Show actual input-dependent quantities in native notation where supported; use values with an explicit display-boundary explanation where a native specimen or fraction is unavailable.
3. Select the method, evidence label, and source together. In particular, Egyptian completion and Ethiopic halving/doubling cannot use a generic unrelated subtraction or multiplication routine beneath a documented label.
4. Do not conflate distinct zero conventions: Medefaidrin/N’Ko/Vai/Osmanya positional zeros, modern Bamum Koghom, and omitted orders in epact/Rumi/Kikakui/Geʽez need different explanations.
5. Historical documenting and a modern worked application are compatible; clearly state which is being shown. Do not convert uncertainty about one algorithm into a claim about a people’s mathematical ability.
