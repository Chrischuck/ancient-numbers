# Numerical hand diagrams: source and scope

Bede's hand illustrations are exact extractions from the public-domain vector chart [Finger numerals 1520–Bedan system](https://commons.wikimedia.org/wiki/File:Finger_numerals_1520-Bedan_system.svg), based on a woodcut printed in 1520 and reproduced by Tobias Dantzig in _Number, the Language of Science_ (1954). The complete downloaded SVG is retained without changes in `public/reference/hands/finger-numerals-1520.svg` (SHA-256 `37d0e253dd9a08011b04ba4806e7b1589489e7b9d799f0b5f7a353e15082fad0`). `scripts/extract-bede-woodcut.py` groups the existing 2,418 paths into 36 panels. Every path, fill color, hatch, and printed numeral is preserved; view boxes crop the individual figures. No hand is redrawn, mirrored, recolored, or assembled into an invented combined pose. A regression check compares all extracted paths and fills with the original source.

The chart provides a separate drawing for each nonzero decimal-place group. The converter therefore shows 54 using the original 50 and 4 figures, and 1,254 using 50, 4, 200, and 1,000. These are separate views of the groups to combine on two hands. Printed numbers remain part of the original artwork. The signer’s left and right are taken from the chart’s labeled rows, rather than inferred from palm direction. The full original chart is also available on the system page.

The separate La Trappe and Loccum illustrations remain modern teaching diagrams with their own source labels; they are not attributed to the 1520 chart.

## Bede, 725

The implementation follows the primary Latin in _De temporum ratione_, chapter 1, edited by C. W. Jones, CCSL 123B (1977), pp. 268–273. The Latin is accessible through [Miguel C. Fernandes’s DIGITAL project](https://www.fingercounting.com/texts/bede). Descriptions in this repository are original English paraphrases of the public-domain Latin, rather than reproductions of the website’s modern translation.

Left outer fingers encode units. Left thumb and index encode tens. The right thumb and index repeat the left tens shapes for hundreds; the right outer fingers repeat the left units shapes for thousands. The crucial primary passage is: “Centum vero in dextera, quomodo decem in laeua facies” followed by “Item mille in dextera, quomodo unum in laeua.” Fibonacci’s later exchange of the two right-hand places is not used.

The finger called _medicus_ is the ring finger; _impudicus_ is the middle finger. Thus 5 folds the middle finger, while 6 folds the ring finger. The latter resets the ring finger after the successive unfolding instructions for 4 and 5. Source translations sometimes contain confusing anatomical names, so labels use modern anatomical terms. [Sanford’s 1928 study](https://penelope.uchicago.edu/Thayer/E/Journals/CJ/23/8/De_Loquela_Digitorum%2A.html) discusses the historical vocabulary.

The converter stops at 9,999 because Bede’s higher values use positions at the chest, navel, thigh, and hip. A relaxed group merely contributes nothing; the site does not assign a historical independent zero glyph. Labels identify the signer’s own left and right. No Unicode character is supplied because these are physical gestures.

## La Trappe: the 1824 witness

Louis Du Bois, _Histoire civile, religieuse et littéraire de l’abbaye de La Trappe_ (1824), pp. 248–258, includes the sign-vocabulary entry _Heure_. The [original book](https://books.google.com/books?id=rS1MAAAAYAAJ) is the cited witness; the French entry is also reproduced on PDF page 4 of [Rebecca Lucas’s bilingual transcription](https://www.medieval-baltic.us/trappe.pdf).

The primary French instructs the respondent to show as many fingers as hours, half of a finger for a half-hour, and a joint for a quarter-hour. The implemented numerical examples are bounded to 1–10 hours. The text does not prescribe which fingers, hand order, or palm direction; the site explicitly labels its index-first diagram choices as illustrative. It does not invent sequences for 11 or 12. Small brackets on the fractional diagrams explain the indicated portion and are not claimed as components of the historical gestures.

The vocabulary is a witness of the Cistercian Strict Observance/Trappist tradition, printed in 1824. The site does not project those exact forms onto all medieval Cistercians, claim they are the written Cistercian ciphers, or treat time replies as a complete cardinal arithmetic notation.

## Loccum comparison

Leibniz’s _Collectanea etymologica_, part II (1717), preserves a Latin list and a Low German list from Loccum. The [GWLB digitization](https://digitale-sammlungen.gwlb.de/resolve?PPN=730901130) marks the volume public domain. The source scans were read directly:

- [Scan 647](https://digitale-sammlungen.gwlb.de/content/730901130/pdf/00000647.pdf): Latin entry 88, _Numerare_, “quasi numerare summitates digitorum,” indicating fingertips as if counting, printed p. 389.
- [Scan 660](https://digitale-sammlungen.gwlb.de/content/730901130/pdf/00000660.pdf): Low German entry 139, _halff_, passing an edgewise hand along the other hand’s length, printed p. 402.
- Scan 651: the Low German introduction recalls the author’s novitiate in 1577 and 1578.

These two glossary illustrations are dated and labelled separately. COUNT is an action, not a cardinal-number conversion; HALF is a fractional concept and is distinct from La Trappe’s half-finger time reply. Printed list entry numbers are catalogue numbers, not values conveyed by the gestures.
