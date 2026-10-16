import type { ArithmeticEvidenceProfile } from '../lib/arithmetic-evidence';

/** Operation evidence is scoped to the exact notation and period displayed by the app. */
export const americanPacificArithmeticProfiles: Record<string, ArithmeticEvidenceProfile> = {
  kaktovik: {
    summary:
      'Kaktovik school students developed graphical arithmetic with their new numerals in the 1990s. The worked examples apply their five-and-twenty structure; this is contemporary Indigenous mathematics.',
    tool: 'Kaktovik strokes and the Iñupiaq abacus: four unit beads and three five-beads per place.',
    notationRole:
      'The written digit and the abacus column have matching unit and five components. Each place to the left is worth twenty times as much.',
    evidence: {
      add: 'documented',
      subtract: 'documented',
      multiply: 'modern',
      divide: 'documented',
    },
    operationNotes: {
      add: 'Combine the lower unit strokes and upper five-strokes in matching places. Exchange five unit strokes for one five-stroke, then four five-strokes for one unit stroke in the next place. These are the same exchanges on the classroom abacus.',
      subtract:
        'Remove the subtrahend’s strokes from matching places. If there are too few units, open a five-stroke into five units; if there are too few fives, open one unit in the next place into four five-strokes. The remaining strokes form the difference.',
      multiply:
        'In this modern worked application, split each digit into its upper five-strokes and lower unit strokes. Make the requested copies of those components, combine their partial products in the appropriate twenty-place, and exchange five units and four fives as needed. The consulted proposal documents graphical arithmetic but does not specify a complete multiplication algorithm.',
      divide:
        'Use the students’ chunking approach: fit copies of the divisor into the dividend’s strokes, beginning with the largest aligned place. Record the number of copies in that quotient place, remove their strokes, and shift to the next place. Exchange a twenty for four fives, or a five for five units, whenever a group needs opening; retain any remainder.',
    },
    sources: [
      {
        title: 'Marín Silva, Miller & Strand · Unicode request for Kaktovik numerals (2021)',
        url: 'https://www.unicode.org/L2/L2021/21058-kaktovik-numerals.pdf',
        detail:
          'Pages 1–2 explain the stroke exchanges, contemporary classroom use, graphical addition/subtraction and partial-quotient division; figures 9–12 show the abacus and worked division. Multiplication here is a modern application of those representations.',
      },
      {
        title: 'William Clark Bartley · Making the Old Way Count (1997)',
        url: 'https://ankn.uaf.edu/sop/SOPv2i1.pdf',
        detail:
          'Teacher’s original account, reproduced as figure 13 in the 2021 Unicode proposal. The source’s modern date matters.',
      },
    ],
  },
  maya: {
    summary:
      'Maya inscriptions and manuscripts establish sophisticated numerical and calendrical work. The ordinary base-20 dot-and-bar procedures below are teaching reconstructions, rather than surviving instructions for every operator.',
    tool: 'Rows of dots and bars: a dot is one, a bar five; the next row is worth twenty of the current row.',
    notationRole:
      'The app uses ordinary powers of twenty. Calendar Long Count rows instead include a 360-day third place and need different exchanges.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Align the rows and collect their dots and bars. Replace five dots by a bar and four bars by one dot in the row above, repeating upward. Keep a shell in an empty row. This dot-and-bar calculation is a reconstruction of how the representation can be manipulated.',
      subtract:
        'Cancel matching dots and bars in each row. When a row lacks enough dots, exchange a bar for five dots; when it lacks bars, exchange one dot from the next row for four bars. Re-form the remaining rows, retaining shells for empty places. The consulted sources do not preserve this as an ancient general subtraction recipe.',
      multiply:
        'Use a reconstructed dot-and-bar product grid. Put one factor’s rows beside the grid and the other factor’s rows across it. A dot times a dot gives a dot; a dot times a bar gives a bar; a bar times a bar gives twenty-five, or a dot one place higher plus a bar here. Collect products with the same place value and regroup five dots and four bars.',
      divide:
        'In this reconstructed grouping procedure, match the largest possible place-shifted group of divisor rows against the dividend. Remove that group, record its count in the quotient, and continue to smaller places. Open an upper dot into four lower bars, and a bar into five dots, when necessary. Stop with a remainder smaller than the divisor; the shell marks empty quotient rows.',
    },
    sources: [
      {
        title: 'Ramírez Alfonsín & Testard · The Maya and the Conception of Mixbaal (1995)',
        url: 'https://imag.umontpellier.fr/~ramirez/Article-maya.pdf',
        detail:
          'Mathematics in School, November 1995, pp. 8–9: visible addition and multiplication grids. These are pedagogical procedures relying partly on Sánchez’s 1961 Arithmetic in Maya, not newly recovered ancient working instructions.',
      },
      {
        title: 'W. French Anderson · Arithmetic in Maya Numerals (1971)',
        url: 'https://www.cambridge.org/core/journals/american-antiquity/article/abs/arithmetic-in-maya-numerals/01B4A1933FE7F1D4391872EE80B6FDC9',
        detail:
          'Research article demonstrates all four operations. The accessible abstract establishes the existence of the reconstruction; it does not establish that surviving Maya scribes followed each demonstrated algorithm.',
      },
      {
        title: 'Rojo-Garibaldi et al. · Mesoamerican positional notation and zero (2021)',
        url: 'https://doi.org/10.1016/j.heliyon.2021.e06580',
        detail:
          'Distinguishes the Long Count’s non-power places from ordinary vigesimal teaching layouts, including the limits of evidence for ordinary positional use.',
      },
    ],
  },
  mexica: {
    summary:
      'Nahua tribute records preserve additive quantity signs, while Acolhua land records support reconstructions of area calculations. The app’s flag-and-feather arithmetic is a transparent reconstruction using its tribute notation.',
    tool: 'Quantity groups: dots for ones, flags for twenties, feathers for four hundreds, bags for eight thousands.',
    notationRole:
      'Tribute signs label quantities of particular goods. Acolhua land-register line-and-dot notation is a distinct variant and is not silently substituted for these signs.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Join like tribute signs, then exchange twenty dots for a flag, twenty flags for a feather, and twenty feathers for a bag. Each exchanged bundle keeps the same quantity. This is a worked reconstruction from the additive sign values, not a preserved scribe’s addition instruction.',
      subtract:
        'Remove the requested number of each sign. If a group is too small, open a flag into twenty dots, a feather into twenty flags, or a bag into twenty feathers. Collect the signs left over. The exchanges are a teaching reconstruction using the recorded values.',
      multiply:
        'Treat the first quantity as a bundle of tribute signs and make the requested number of equal bundles. Combine their dots, flags, feathers and bags, replacing twenty of any lower kind by the next kind. Land-area research independently establishes multiplication-related numerical relationships, but does not establish this flag-copying procedure as an attested general algorithm.',
      divide:
        'Form bundles equal to the divisor from the dividend’s signs, taking the largest signs first. Open a sign into twenty of the next smaller kind whenever needed to complete a bundle. Count the complete bundles and leave unallocated signs as the remainder. This is an explicit reconstruction; the land-register evidence does not preserve a general division algorithm for tribute flags.',
    },
    sources: [
      {
        title: 'University of Oregon · Nahua Glyphs: Numbers',
        url: 'https://blogs.uoregon.edu/nahuaglyphs/numbers/',
        detail:
          'Manuscript-based values and uses of the tribute number signs. Representation evidence is distinguished from arithmetic working instructions.',
      },
      {
        title: 'Williams & Jorge y Jorge · Aztec arithmetic revisited (2008)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/18388287/',
        detail:
          'Primary research abstract: reconstructs Acolhua field-area calculations and congruence arithmetic from land records. It concerns a different numerical/metrological context from the tribute-sign renderer.',
      },
      {
        title: 'Jorge, Williams, Garza-Hume & Olvera · Accuracy of Aztec land surveys (2011)',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3174618/',
        detail:
          'Primary mathematical analysis of Codex Vergara side lengths and areas; supports the mathematical validity of the historical records, not a universal flag-and-feather calculation recipe.',
      },
    ],
  },
  khipu: {
    summary:
      'Early chroniclers explicitly describe Andean arithmetic using knots, maize and pebbles. The worked decimal counter procedures are scholarly teaching reconstructions; the exact operation of historical yupanas remains disputed.',
    tool: 'Movable maize kernels or pebbles on a counting surface, followed by decimal knots on a khipu cord.',
    notationRole:
      'The cord records the quantities and totals. A numerical knot is not treated as a movable abacus bead; the worked counter state is recorded with the appropriate knot type afterward.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Read each cord’s decimal knot groups into counter rows for units, tens, hundreds and higher values. Merge matching counter rows, exchanging ten counters for one in the row above. Record the total on a cord: single knots in higher places, a long knot for units 2–9, a figure-eight for unit 1, and an empty place for zero. The counter layout is reconstructed.',
      subtract:
        'Transfer the starting cord to decimal counter rows and remove the second quantity row by row. Exchange one higher counter for ten lower counters whenever the lower row is short. Tie the remaining amount using the khipu knot convention. Chroniclers attest subtraction; these exact counter movements are a reconstruction.',
      multiply:
        'In the scholarly decimal yupana reconstruction, place one factor’s digits down the board and the other’s across its top. Put each digit-pair product at their intersection, accumulate equal-place diagonal totals, and exchange ten counters upward. Record the resulting decimal rows as knots. This grid method is a modern reconstruction, not a demonstrated decipherment of an ancient board.',
      divide:
        'In Catepillán and Szymanski’s reconstruction, fit the divisor into the leading decimal counter rows, record that partial quotient, remove its product and bring in the next lower row. Repeat, trading counters as necessary. Record the quotient and any remainder separately on cords. Their division procedure is explicitly their own reconstruction; the historical use of kernels and pebbles is independently attested.',
    },
    sources: [
      {
        title: 'Catepillán & Szymanski · Counting and Arithmetic of the Inca (2012)',
        url: 'https://www.revista.etnomatematica.org/index.php/RevLatEm/article/download/45/373/1633',
        detail:
          'Printed pp. 54–55 reproduce Acosta and Garcilaso’s accounts; pp. 57–64 work all four operations. The authors identify competing yupana interpretations and explicitly identify the division method as their own.',
      },
      {
        title: 'Dr. Sarahh Scher · The Inka khipu',
        url: 'https://smarthistory.org/inka-khipu/',
        detail:
          'Numerical cord reading, decimal positions and unit versus higher-place knot types.',
      },
      {
        title: 'Cinzia Florio · The Mathematical Enigma of Guamán Poma’s Yupana (2025)',
        url: 'https://link.springer.com/book/10.1007/978-3-031-92662-4',
        detail:
          'Recent primary research proposes a materially different interpretation. Its existence reinforces that the board’s exact historical algorithm is unresolved; the app does not declare any one reconstruction deciphered.',
      },
    ],
  },
  cherokee: {
    summary:
      'Sequoyah’s original signs survive in a limited manuscript record and the Cherokee Nation’s chart. They can express arithmetic quantities, but no operator-specific working method in those signs was established by the consulted evidence.',
    tool: 'A modern grouping surface for the quantities represented by Sequoyah’s distinct decade and unit signs.',
    notationRole:
      'Original numerical signs are distinct from both Cherokee syllabary number words and the Hindu-Arabic numerals used in later Cherokee-language arithmetic books.',
    evidence: {
      add: 'recording',
      subtract: 'recording',
      multiply: 'recording',
      divide: 'recording',
    },
    operationNotes: {
      add: 'For this modern reconstruction, expand each whole-value sign into its quantity of tens and units, combine those groups, and choose the chart’s sign for the resulting decade plus its unit sign. A forty sign represents forty, not the positional digit four. This explains addition with the original signs without claiming a surviving historical addition algorithm.',
      subtract:
        'In this modern reconstruction, unpack the starting whole-value signs into tens and units, remove the second quantity, exchanging one ten for ten units if necessary, then rewrite the difference with the chart’s appropriate whole-value signs. The manuscript evidence does not establish that Sequoyah performed subtraction by these steps.',
      multiply:
        'Use a modern equal-groups reconstruction: unpack the multiplicand’s decade and unit signs into quantities, make the multiplier’s number of identical groups, then collect tens and units and select the resulting signs from the chart. Do not multiply the sign shapes as if they were Arabic positional digits; a forty sign already means forty.',
      divide:
        'For this modern reconstruction, unpack the dividend’s whole-value signs into groups, form as many divisor-sized groups as possible, and record their count using the chart’s signs. Keep any remaining quantity separate. The 1870 Cherokee-English arithmetic book supplies decimal school algorithms in Hindu-Arabic digits, not evidence for this procedure in Sequoyah’s original signs.',
    },
    sources: [
      {
        title: 'Cherokee Nation · Sequoyah’s Original Numbers 0–100',
        url: 'https://language.cherokee.gov/media/541f3lhk/sequoyah_original_numbers_updated.pdf',
        detail:
          'Primary community chart supplies the numerical signs; its coverage is not evidence for a historical four-operator procedure.',
      },
      {
        title:
          'Stephen Chrisomalis · Sequoyah and the Almost-Forgotten History of Cherokee Numerals',
        url: 'https://thereader.mitpress.mit.edu/sequoyah-and-the-almost-forgotten-history-of-cherokee-numerals/',
        detail:
          'The numerical-notation researcher describes the 1839 Payne manuscript and scarcity of direct use evidence. Decade signs are ciphered additive; larger forms have multiplicative features.',
      },
      {
        title: '1870 · Elementary arithmetic in Cherokee and English, multiplication page',
        url: 'https://wikisource.org/wiki/Page:Elementary_arithmetic_in_Cherokee_and_English.pdf/83',
        detail:
          'Primary historical school text uses Hindu-Arabic figures. It must not be used as proof of an algorithm with Sequoyah’s numerical signs.',
      },
    ],
  },
  choctaw: {
    summary:
      'These examples perform modern arithmetic with quantities named in Choctaw Nation teaching forms. A documented number-word construction does not establish a uniquely traditional mental algorithm.',
    tool: 'Modern counters grouped in tens, with Choctaw names for the amounts at each stage.',
    notationRole:
      'These are spoken decimal quantity names, not written positional digits. The calculator applies familiar grouping operations and names their results in the selected community forms.',
    evidence: { add: 'modern', subtract: 'modern', multiply: 'modern', divide: 'modern' },
    operationNotes: {
      add: 'Name each amount, join its ten-groups and unit counters, and regroup ten units into another ten-group. Name the new total with the attested awah teen pattern or pokoli multiplied tens plus akocha and the remaining units. This is a modern language-based worked example, not an ancestral algorithm inferred from the connector.',
      subtract:
        'Take the second amount’s ten-groups and units away from the first. If the units are insufficient, exchange a ten-group for ten units before removing them. Re-name the groups left using the Nation’s number words; zero remains an empty group in this bounded display. The sources verify the words, not a distinctive traditional borrowing procedure.',
      multiply:
        'Make the requested number of equal groups of the named amount. Collect the units into ten-groups, combine the tens, and say the resulting number with the Nation’s teaching forms. Pokoli followed by its coefficient names a number of tens, but that word order alone does not prove how every speaker calculates products.',
      divide:
        'Form groups of the divisor’s size from the named dividend, exchanging a ten-group into ten units when needed to finish a group. Count and name the complete groups; name the ungrouped remainder separately. This is a modern concrete calculation using the selected Choctaw words, not a claim about a single historical division algorithm.',
    },
    sources: [
      {
        title: 'Choctaw Nation · Biskinik, October 2018 counting chart',
        url: 'https://www.choctawnation.com/wp-content/uploads/2022/06/oct-2018-biskinik.pdf',
        detail:
          'Primary community chart documents the teen and tens-and-units forms used in intermediate and final quantity labels.',
      },
      {
        title: 'Choctaw Nation · Choctaw 2, Chapter Ten, Lesson 2',
        url: 'https://www.choctawnation.com/lessons/choctaw-2/chapter-10/lesson-2/',
        detail: 'Documents ninety as pokoli chakkali in a money sentence.',
      },
      {
        title: 'Alfred Wright · Chahta na-holhtina, or Choctaw arithmetic (1835), catalog',
        url: 'https://catalog.hathitrust.org/Record/100783607',
        detail:
          'Historical 72-page Choctaw arithmetic textbook located through a Choctaw researcher’s resource list. Full-text access was blocked during this audit, so no uninspected algorithm is attributed to it.',
      },
      {
        title: 'Jacqueline Brixey · Choctaw resources',
        url: 'https://www.jacqueline-brixey.com/choctaw-resources.html',
        detail:
          'Choctaw Nation member and language researcher’s resource list identifies Wright’s arithmetic book and contemporary community sources.',
      },
    ],
  },
  navajo: {
    summary:
      'Modern mathematics teaching for Navajo children explicitly develops joining, separating, equal groups and partial quotients. The app works these concrete methods while labeling quantities with Diné College’s number words.',
    tool: 'Modern bundles of ten and unit counters, equal sets and arrays.',
    notationRole:
      'The Diné College chart supplies the spoken quantity names. The arithmetic pedagogy is documented separately; number-word morphology is not substituted for an algorithm.',
    evidence: { add: 'modern', subtract: 'modern', multiply: 'modern', divide: 'modern' },
    operationNotes: {
      add: 'Join both amounts’ ten-bundles and loose units. When ten loose units collect, bundle them into one ten and combine the ten-bundles. Navajo Area Mathematics Guidelines objective 42-J demonstrates this with 42 plus 19, giving six tens and one unit. Here the corresponding quantities receive the Diné College number names.',
      subtract:
        'Build the starting amount with hundred-groups, ten-bundles and units. Separate out the requested quantity, opening a ten-bundle into ten units or a hundred into ten tens when necessary. Read and name the remainder. Objectives 81-S through 83-S document this modern concrete regrouping pedagogy for Navajo children.',
      multiply:
        'Build equal sets or a rectangular array: the multiplier counts sets and the multiplicand tells how many objects are in each. Collect the products of the tens and units into larger bundles and name the total. Objectives 62-J, 65-J and 71-J explicitly develop this modern approach, including two-place products.',
      divide:
        'Separate groups of the divisor’s size from the dividend and record how many groups were removed. Remove convenient multiples at a time, combine those partial quotients, and retain the objects left over. Objectives 87-S through 89-S explicitly develop equal-group division and the partial-quotient algorithm; quantity names here follow Diné College.',
    },
    sources: [
      {
        title: 'Bureau of Indian Affairs, Navajo Area · Mathematics Guidelines (1975/1977)',
        url: 'https://files.eric.ed.gov/fulltext/ED164157.pdf',
        detail:
          'Primary curriculum for Navajo children. Objectives 42-J, 62-J, 65-J, 71-J, 81-S–83-S and 87-S–89-S give concrete algorithms; the modern English-language curriculum does not claim a pre-contact Diné algorithm.',
      },
      {
        title: 'Diné College Learning Center · Navajo Numbering System',
        url: 'https://warriorweb.dinecollege.edu/ICS/Portlets/ICS/Portlet.Resources/ViewHandler.ashx?id=082af43e-c530-4f62-832f-369283e05afc',
        detail:
          'Primary community reference gives all number names from 1 through 100 in the orthography used by this calculator.',
      },
    ],
  },
  maori: {
    summary:
      'The default converter uses contemporary decimal Māori words. Māori-medium resources teach concrete grouping and decomposition for all four operators; historical counting in pairs is a separate documented counting context.',
    tool: 'Modern decimal groups and counters, named in te reo Māori.',
    notationRole:
      'Tekau, rau and mano name ten-, hundred- and thousand-groups. Historical pair counts change what one counting unit contains; they are not binary positional digits.',
    evidence: { add: 'modern', subtract: 'modern', multiply: 'modern', divide: 'modern' },
    operationNotes: {
      add: 'Combine the units and the tekau, rau and mano groups. Exchange ten groups of one size for a group of the next size, then name the total. This applies the regrouping and number-decomposition approaches in modern Māori-medium teaching; it does not read a prehistoric algorithm from the joining word mā.',
      subtract:
        'Remove the requested units and tekau, rau or mano groups. If one group is too small, open the next larger group into ten of it before removing anything. Name the groups left over. Modern Māori-medium resources explicitly teach counting back, making ten and breaking numbers apart for this operation.',
      multiply:
        'Break the named amount into its decimal groups, make the requested number of copies of each group, and combine equal-place products. Exchange ten units for tekau and ten tekau for rau as needed, then name the total. The selected method follows modern decomposition teaching, rather than claiming all historical Māori used one multiplication recipe.',
      divide:
        'Break the dividend into tekau, rau and other groups and form convenient multiples of the divisor. Remove those multiples, count their shares and continue with the remaining units. Modern Māori-medium teaching connects multiplication and division through decomposition. In a historical pair-counting context, a share of one counting unit would instead contain two objects.',
    },
    sources: [
      {
        title: 'Ministry of Education · Tihei Pāngarau, Te Tau me te Taurangi, Tūārere 3',
        url: 'https://kauwhatareo.tahurangi.education.govt.nz/mi/tihei-p-ngarau---te-tau-me-te-taurangi---t-rere-3/5637202408.p',
        detail:
          'Primary modern Māori-medium teaching material explicitly covers number-decomposition strategies for addition/subtraction and multiplication/division, their relationships, and fractions.',
      },
      {
        title: 'Ministry of Education · He Kōwae Ako Pāngarau',
        url: 'https://tahurangi.education.govt.nz/kauwhata-reo-online/he-k-wae-ako-p-ngarau/5637208347.p?domain=kauwhatareo.tahurangi.education.govt.nz',
        detail:
          'Modern concrete teaching units include making tens, number lines, equal combinations and multiplication arrays.',
      },
      {
        title: 'Te Koha & Masouleh · Ngā Inenga Māori (2019)',
        url: 'https://www.measurement.govt.nz/assets/Uploads/Nga-Inenga-Maori-A-Preliminary-Study-on-Maori-Measurement.pdf',
        detail:
          'Pages 11–15 distinguish traditional and contemporary counting, explain pairs as counting units, and caution against calling pair counting binary positional notation.',
      },
    ],
  },
  hawaiian: {
    summary:
      'The calculator uses contemporary decimal Hawaiian names. Traditional markets also counted goods in named groups of four and forty; the worked operations below state explicitly which counting units are being used.',
    tool: 'Modern decimal counters for the default number words; optional kāuna and kaʻau bundles provide the historical grouping comparison.',
    notationRole:
      'Ordinary decimal numbers and object-group names are distinct conventions. A kāuna contains four individual objects; ten kāuna make one kaʻau of forty.',
    evidence: { add: 'modern', subtract: 'modern', multiply: 'modern', divide: 'modern' },
    operationNotes: {
      add: 'For the default decimal words, combine the tens and units and exchange ten units into a ten. In a traditional grouped-object comparison, combine the kāuna bundles and loose objects, exchanging four loose objects for one kāuna and ten kāuna for one kaʻau. Name the result in the chosen convention; do not silently call forty kanahā and kaʻau interchangeable counting units.',
      subtract:
        'Remove the requested quantity from decimal groups, opening a ten into ten units when necessary, and name the difference. For historical object groups, an opened kāuna gives four individual objects and an opened kaʻau gives ten kāuna. The exchanges are a transparent teaching application of documented group sizes, not a surviving universal subtraction instruction.',
      multiply:
        'Make equal sets of the named quantity, gather their tens and units, and regroup before naming the product. If using traditional object units, keep four objects per kāuna through the multiplication and convert to individual objects only when required. Kanepuu’s 1867 account connects group tables with school multiplication tables; it does not specify one ancient multiplication algorithm.',
      divide:
        'Form divisor-sized groups from the dividend, using the chosen unit consistently. A kāuna can be opened into four objects and a kaʻau into ten kāuna when a share needs smaller units. Count complete groups and keep any remainder. This is a modern worked grouping method; the historical market account establishes group quantities, not a general long-division recipe.',
    },
    sources: [
      {
        title: 'Kaliko Trapp · Hawaiian Number Basics 1 to 100',
        url: 'https://oleloonline.com/hawaiian-number-basics-1-to-100-0502v/',
        detail: 'Primary teaching resource for the ordinary decimal forms used by the converter.',
      },
      {
        title: 'Kaliko Trapp · Traditional Hawaiian Number Groups',
        url: 'https://oleloonline.com/0503v-traditional-hawaiian-number-groups/',
        detail:
          'Community teacher distinguishes kāuna, kaʻau, lau and mano group vocabulary from ordinary counting.',
      },
      {
        title: 'J. H. Kanepuu · Hawaiian Counting (1867), Bishop Museum translation',
        url: 'https://blog.bishopmuseum.org/nupepa/j-h-kanepuu-on-traditional-counting/',
        detail:
          'Primary Hawaiian-language newspaper account preserves market grouping, 760 fish as one lau plus nine kaʻau, and 1,300 taro tops as three lau plus two kaʻau plus five kāuna. It also discusses arithmetic-school tables.',
      },
    ],
  },
  mangarevan: {
    summary:
      'Bender and Beller reconstruct arithmetic possibilities from historical Mangarevan grouping words. Their concrete algorithms exploit the 10–20–40–80 steps; direct observations of traditional calculation are unavailable.',
    tool: 'Named counting-unit groups: takau 10, paua 20, tataua 40 and varu 80.',
    notationRole:
      'Inputs count tauga, whose object size depends on the goods: for example, two fish or four coconuts per unit. Keep the same unit throughout an operation.',
    evidence: {
      add: 'reconstruction',
      subtract: 'reconstruction',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Join like terms. Ten ordinary units make takau; two takau make paua; two paua make tataua; two tataua make varu. Add the coefficients of varu in the ordinary decimal way. Bender and Beller demonstrate 273 plus 219 this way, giving six varu, one takau and two units, or 492 tauga.',
      subtract:
        'Remove matching group terms. If the needed term is absent, open one varu into two tataua, one tataua into two paua, one paua into two takau, or one takau into ten units. Continue removing terms and reassemble the remaining name. This reverses the paper’s proposed joining-and-regrouping procedure; it is a reconstruction, not observed historical performance.',
      multiply:
        'Use the binary steps of the group vocabulary: doubling takau gives paua, doubling paua gives tataua, and doubling tataua gives varu. Factors four and eight apply two or three such shifts; other factors combine shifted terms with the original, such as three copies equals double plus one copy. Unit and varu coefficients use decimal arithmetic. This is the authors’ conceptual reconstruction.',
      divide:
        'For divisors two, four or eight, reverse one, two or three group shifts, opening a higher term when needed: varu divided by two is tataua. Bender and Beller explicitly treat these preferred divisors as assumptions. For other divisors, this lesson uses a general grouping extension, counting divisor-sized bundles and retaining a remainder; it is not attributed to recorded Mangarevan performance.',
    },
    sources: [
      {
        title:
          'Bender & Beller · Mangarevan invention of binary steps for easier calculation (2013)',
        url: 'https://math.hawaii.edu/~tom/ethnomathematics/PNAS-2013.pdf',
        detail:
          'Pages 3–5 give group construction, actual proposed addition/multiplication/division procedures and the division assumptions. Page 2 explains why the analysis is conceptual rather than observation of historical arithmetic performance.',
      },
      {
        title: 'Bender & Beller · The Power of 2 (2017)',
        url: 'https://doi.org/10.1111/cogs.12337',
        detail:
          'Follow-up primary cognitive analysis examines how compact object-specific counting and binary group levels can facilitate mental arithmetic.',
      },
    ],
  },
  oksapmin: {
    summary:
      'Ethnography documents Oksapmin people adapting their body sequence to addition and subtraction in trade and schooling. Multiplication and division below are explicitly reconstructed extensions of that counting tool.',
    tool: 'Two coordinated counts along the ordered 27-position body path: one records the changing total, the other tracks moves or complete groups.',
    notationRole:
      'A body position names a quantity in a sequence. It is not a digit in positional base 27; the app illustrates only the first traversal.',
    evidence: {
      add: 'documented',
      subtract: 'documented',
      multiply: 'reconstruction',
      divide: 'reconstruction',
    },
    operationNotes: {
      add: 'Locate the first amount on the body path. Advance one position per added unit while a second count tracks how many moves have been made. Stop when that second count reaches the addend; the position reached records the sum. This is an application of the contemporary body-arithmetic adaptations documented in trade and school contexts.',
      subtract:
        'Begin at the minuend’s position and pair each position removed with one step of a second count. For the documented 16 minus 7 example, positions 16 through 10 are the seven removed positions, leaving biceps at 9. Track removals rather than merely stopping at the body part named by the subtrahend.',
      multiply:
        'In this teaching extension, repeat an equal block of forward body-path moves once for each multiplier unit. Track completed blocks separately from the current total position. The final position gives the product within the first traversal. The consulted ethnography documents the arithmetic adaptations but does not establish this as an observed traditional multiplication procedure.',
      divide:
        'In this teaching extension, mark the dividend and count complete blocks of the divisor’s length along the body path. Track each finished block on a separate count; stop before a block would pass the dividend. The number of blocks is the quotient and the remaining positions are the remainder. This is a reconstruction, not a reported historical division algorithm.',
    },
    sources: [
      {
        title: 'Geoffrey Saxe · Counting and extension to arithmetic, 1978–2014',
        url: 'https://culturecognition.com/counting-and-extension-to-arithmetic-1978-2014',
        detail:
          'Primary field-research companion explains the filmed 16−7 double-enumeration strategy and the tradestore owner’s distinct halved-body currency strategy.',
      },
      {
        title:
          'Geoffrey Saxe · Studying culture-cognition relations in collective practices of daily life (2015)',
        url: 'https://journals.sagepub.com/doi/10.1080/02103702.2015.1054669',
        detail:
          'Primary ethnographic analysis distinguishes traditional enumeration from later addition/subtraction adaptations and shows the coordinated counting procedure.',
      },
      {
        title: 'Geoffrey Saxe · Oksapmin Counting System',
        url: 'https://culturecognition.com/new-page-3',
        detail:
          'First-person research account verifies body-path order, arbitrary starting side, the nose at 14 and historical extensions beyond the app’s first traversal.',
      },
    ],
  },
};
