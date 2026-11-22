// Builder 4B M2: second ten independent third-variant coordinate-authored architectures.
// Every silhouette, access and functional room is specified in this exclusive source.
// Unapproved candidates only; existing 73 prior objects are retained exactly.
import {M2_73_ALL} from './m2-variant03-first10.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
  {
    "t": "healers-house",
    "b": "temperate",
    "s": "small",
    "variant": 3,
    "title": "Cedar Bend Triage Hall",
    "dim": [
      27,
      12,
      26
    ],
    "r": [
      [
        9,
        16,
        1,
        23
      ],
      [
        3,
        10,
        6,
        14
      ],
      [
        15,
        24,
        15,
        21
      ],
      [
        6,
        20,
        20,
        24
      ]
    ],
    "e": [
      12,
      1
    ],
    "rooms": [
      [
        "waiting",
        12,
        5
      ],
      [
        "treatment",
        6,
        10
      ],
      [
        "recovery",
        20,
        18
      ],
      [
        "herb-storage",
        12,
        21
      ]
    ],
    "div": [
      [
        "z",
        12,
        9,
        17,
        13
      ]
    ],
    "peak": [
      [
        6,
        10
      ],
      [
        20,
        18
      ],
      [
        12,
        20
      ]
    ],
    "roof": "cedar-asymmetric-three-wing-hips"
  },
  {
    "t": "healers-house",
    "b": "desert",
    "s": "large",
    "variant": 3,
    "title": "Saffron Separated Ward Courts",
    "dim": [
      44,
      15,
      41
    ],
    "r": [
      [
        17,
        26,
        1,
        38
      ],
      [
        3,
        19,
        7,
        19
      ],
      [
        25,
        41,
        11,
        22
      ],
      [
        5,
        19,
        26,
        38
      ],
      [
        24,
        41,
        29,
        37
      ]
    ],
    "holes": [
      [
        12,
        14,
        3,
        3
      ],
      [
        34,
        16,
        3,
        3
      ]
    ],
    "e": [
      21,
      1
    ],
    "rooms": [
      [
        "waiting",
        21,
        5
      ],
      [
        "treatment",
        8,
        10
      ],
      [
        "recovery",
        37,
        13
      ],
      [
        "isolation-ward",
        9,
        32
      ],
      [
        "herbal-study",
        36,
        32
      ],
      [
        "consultation",
        21,
        24
      ]
    ],
    "div": [
      [
        "x",
        21,
        11,
        19,
        15
      ]
    ],
    "peak": [
      [
        8,
        10
      ],
      [
        37,
        13
      ],
      [
        9,
        32
      ],
      [
        36,
        32
      ]
    ],
    "roof": "saffron-offset-quadri-wing-sky-courts"
  },
  {
    "t": "healers-house",
    "b": "snow",
    "s": "medium",
    "variant": 3,
    "title": "Winterbridge Rehabilitation Annex",
    "dim": [
      35,
      13,
      33
    ],
    "r": [
      [
        11,
        19,
        1,
        30
      ],
      [
        3,
        13,
        6,
        16
      ],
      [
        18,
        31,
        13,
        23
      ],
      [
        7,
        17,
        25,
        30
      ]
    ],
    "e": [
      15,
      1
    ],
    "rooms": [
      [
        "waiting",
        15,
        5
      ],
      [
        "treatment",
        7,
        10
      ],
      [
        "recovery",
        26,
        18
      ],
      [
        "dispensary",
        11,
        28
      ],
      [
        "rehabilitation-gallery",
        15,
        20
      ]
    ],
    "div": [
      [
        "x",
        18,
        13,
        20,
        16
      ]
    ],
    "peak": [
      [
        7,
        10
      ],
      [
        26,
        18
      ],
      [
        11,
        28
      ]
    ],
    "roof": "winterbridge-offset-frost-sheds"
  },
  {
    "t": "healers-house",
    "b": "enchanted-forest",
    "s": "small",
    "variant": 3,
    "title": "Mothlight Crescent Apothecary",
    "dim": [
      28,
      12,
      28
    ],
    "discs": [
      [
        11,
        12,
        8,
        7
      ],
      [
        18,
        19,
        7,
        7
      ]
    ],
    "r": [
      [
        12,
        17,
        1,
        18
      ]
    ],
    "holes": [
      [
        10,
        12,
        2,
        2
      ]
    ],
    "e": [
      14,
      1
    ],
    "rooms": [
      [
        "waiting",
        14,
        5
      ],
      [
        "treatment",
        6,
        13
      ],
      [
        "recovery",
        21,
        20
      ],
      [
        "mycology",
        14,
        23
      ]
    ],
    "div": [
      [
        "z",
        17,
        12,
        20,
        15
      ]
    ],
    "peak": [
      [
        6,
        13
      ],
      [
        21,
        20
      ],
      [
        14,
        5
      ]
    ],
    "roof": "mothlight-interlocking-willow-lenses"
  },
  {
    "t": "healers-house",
    "b": "mountain",
    "s": "large",
    "variant": 3,
    "title": "Highpass Broken-Ridge Hospital",
    "dim": [
      47,
      15,
      43
    ],
    "r": [
      [
        19,
        27,
        1,
        40
      ],
      [
        3,
        21,
        7,
        17
      ],
      [
        25,
        44,
        13,
        24
      ],
      [
        4,
        21,
        29,
        39
      ]
    ],
    "discs": [
      [
        11,
        12,
        8,
        6
      ],
      [
        35,
        19,
        8,
        7
      ]
    ],
    "e": [
      23,
      1
    ],
    "rooms": [
      [
        "waiting",
        23,
        5
      ],
      [
        "treatment",
        11,
        12
      ],
      [
        "recovery",
        35,
        19
      ],
      [
        "isolation-ward",
        11,
        34
      ],
      [
        "dispensary",
        23,
        32
      ],
      [
        "rehabilitation-gallery",
        23,
        22
      ]
    ],
    "div": [
      [
        "z",
        23,
        19,
        27,
        22
      ]
    ],
    "peak": [
      [
        11,
        12
      ],
      [
        35,
        19
      ],
      [
        11,
        34
      ],
      [
        23,
        31
      ]
    ],
    "roof": "highpass-offset-crag-belvederes"
  },
  {
    "t": "library",
    "b": "temperate",
    "s": "medium",
    "variant": 3,
    "title": "Oakmeadow Crooked-Court Library",
    "dim": [
      34,
      13,
      32
    ],
    "r": [
      [
        12,
        20,
        1,
        29
      ],
      [
        4,
        14,
        5,
        15
      ],
      [
        19,
        30,
        14,
        25
      ]
    ],
    "discs": [
      [
        8,
        10,
        6,
        5
      ]
    ],
    "e": [
      16,
      1
    ],
    "rooms": [
      [
        "catalogue",
        16,
        5
      ],
      [
        "collections",
        8,
        10
      ],
      [
        "reading-room",
        25,
        19
      ],
      [
        "archive",
        16,
        27
      ],
      [
        "rare-book-vault",
        16,
        18
      ]
    ],
    "div": [
      [
        "x",
        18,
        14,
        21,
        17
      ]
    ],
    "peak": [
      [
        8,
        10
      ],
      [
        25,
        19
      ],
      [
        16,
        27
      ]
    ],
    "roof": "oakmeadow-crooked-gabled-gallery"
  },
  {
    "t": "library",
    "b": "desert",
    "s": "small",
    "variant": 3,
    "title": "Copperwind Triple-Stack Scriptorium",
    "dim": [
      28,
      12,
      26
    ],
    "r": [
      [
        8,
        16,
        1,
        23
      ],
      [
        2,
        10,
        6,
        14
      ],
      [
        15,
        25,
        13,
        20
      ]
    ],
    "e": [
      12,
      1
    ],
    "rooms": [
      [
        "catalogue",
        12,
        5
      ],
      [
        "collections",
        5,
        10
      ],
      [
        "reading-room",
        21,
        17
      ],
      [
        "archive",
        12,
        21
      ]
    ],
    "div": [
      [
        "z",
        12,
        10,
        16,
        13
      ]
    ],
    "peak": [
      [
        5,
        10
      ],
      [
        21,
        17
      ],
      [
        12,
        21
      ]
    ],
    "roof": "copperwind-misaligned-sun-shelves"
  },
  {
    "t": "library",
    "b": "snow",
    "s": "large",
    "variant": 3,
    "title": "Aurora Five-Lantern Knowledge Hall",
    "dim": [
      46,
      15,
      42
    ],
    "r": [
      [
        18,
        27,
        1,
        39
      ],
      [
        3,
        21,
        8,
        19
      ],
      [
        25,
        42,
        6,
        18
      ],
      [
        5,
        21,
        27,
        37
      ],
      [
        25,
        41,
        25,
        37
      ]
    ],
    "holes": [
      [
        11,
        14,
        3,
        2
      ],
      [
        35,
        12,
        3,
        2
      ]
    ],
    "e": [
      23,
      1
    ],
    "rooms": [
      [
        "catalogue",
        23,
        5
      ],
      [
        "collections",
        15,
        11
      ],
      [
        "reading-room",
        31,
        9
      ],
      [
        "archive",
        13,
        32
      ],
      [
        "manuscript-gallery",
        33,
        32
      ],
      [
        "star-charts",
        23,
        22
      ]
    ],
    "div": [
      [
        "x",
        23,
        14,
        20,
        17
      ]
    ],
    "peak": [
      [
        15,
        11
      ],
      [
        31,
        9
      ],
      [
        13,
        32
      ],
      [
        33,
        32
      ]
    ],
    "roof": "aurora-staggered-five-lantern-trusses"
  },
  {
    "t": "library",
    "b": "enchanted-forest",
    "s": "medium",
    "variant": 3,
    "title": "Iridescent Three-Lens Lorehouse",
    "dim": [
      37,
      13,
      35
    ],
    "discs": [
      [
        9,
        12,
        7,
        7
      ],
      [
        27,
        11,
        7,
        7
      ],
      [
        18,
        25,
        9,
        7
      ]
    ],
    "r": [
      [
        15,
        22,
        1,
        28
      ]
    ],
    "e": [
      18,
      1
    ],
    "rooms": [
      [
        "catalogue",
        18,
        5
      ],
      [
        "collections",
        9,
        11
      ],
      [
        "reading-room",
        27,
        11
      ],
      [
        "archive",
        18,
        25
      ],
      [
        "oral-history",
        18,
        18
      ]
    ],
    "div": [
      [
        "x",
        20,
        17,
        20,
        19
      ]
    ],
    "peak": [
      [
        9,
        12
      ],
      [
        27,
        11
      ],
      [
        18,
        25
      ]
    ],
    "roof": "iridescent-three-lens-canopy-ridge"
  },
  {
    "t": "library",
    "b": "mountain",
    "s": "small",
    "variant": 3,
    "title": "Cairnloop Cliffside Reading Cell",
    "dim": [
      30,
      13,
      28
    ],
    "r": [
      [
        11,
        18,
        1,
        25
      ],
      [
        3,
        13,
        6,
        13
      ],
      [
        17,
        27,
        15,
        22
      ],
      [
        5,
        17,
        21,
        25
      ]
    ],
    "e": [
      14,
      1
    ],
    "rooms": [
      [
        "catalogue",
        14,
        5
      ],
      [
        "collections",
        7,
        9
      ],
      [
        "reading-room",
        23,
        19
      ],
      [
        "archive",
        13,
        23
      ]
    ],
    "div": [
      [
        "z",
        15,
        12,
        18,
        15
      ]
    ],
    "peak": [
      [
        7,
        9
      ],
      [
        23,
        19
      ],
      [
        13,
        23
      ]
    ],
    "roof": "cairnloop-zigzag-ridge-ventilation"
  }
]);
export const M2_VARIANT03_SECOND10=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_83_ALL=Object.freeze([...M2_73_ALL,...M2_VARIANT03_SECOND10]);
export const M2_83_CENSUS=Object.freeze({newModels:M2_VARIANT03_SECOND10.length,authored:M2_83_ALL.length,
 remaining:285-M2_83_ALL.length,healers:M2_83_ALL.filter(x=>x.type==='healers-house').length,
 libraries:M2_83_ALL.filter(x=>x.type==='library').length,
 fingerprints:new Set(M2_83_ALL.map(geometrySignature)).size,creatorApproved:0,integrated:0});
validateCollection(M2_83_ALL);
if(M2_83_CENSUS.newModels!==10||M2_83_CENSUS.authored!==83||M2_83_CENSUS.healers!==40||
 M2_83_CENSUS.libraries!==40||M2_83_CENSUS.fingerprints!==83)throw Error('4B M2 third-variant source census/uniqueness failure');
export const M2_VARIANT03_SECOND_NAMES=Object.freeze(PLANS.map(p=>p.title));
