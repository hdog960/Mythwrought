// Builder 4B M2 fourth-variant cohort — 10 original coordinate-authored healer/library buildings.
// Strictly theoretical, source-generated integer voxels; no live world registration or saves.
import {M2_93_ALL} from './m2-variant03-final10.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
  {
    "t": "healers-house",
    "b": "temperate",
    "s": "small",
    "variant": 4,
    "title": "Crescent Harbor Herbal Hospice",
    "dim": [
      33,
      13,
      31
    ],
    "r": [
      [
        13,
        19,
        1,
        28
      ],
      [
        3,
        14,
        7,
        15
      ],
      [
        19,
        30,
        17,
        26
      ],
      [
        9,
        25,
        27,
        29
      ]
    ],
    "discs": [
      [
        8,
        11,
        6,
        6
      ]
    ],
    "e": [
      16,
      1
    ],
    "rooms": [
      [
        "welcome",
        16,
        5
      ],
      [
        "treatment",
        7,
        11
      ],
      [
        "recovery",
        24,
        21
      ],
      [
        "herb-storage",
        16,
        26
      ]
    ],
    "div": [
      [
        "z",
        17,
        13,
        20,
        15
      ]
    ],
    "peak": [
      [
        8,
        11
      ],
      [
        24,
        21
      ],
      [
        16,
        26
      ]
    ],
    "roof": "crescent-cantilever-free-multiridge"
  },
  {
    "t": "library",
    "b": "temperate",
    "s": "medium",
    "variant": 4,
    "title": "Bellwether Spindle Archive",
    "dim": [
      42,
      14,
      39
    ],
    "r": [
      [
        17,
        24,
        1,
        35
      ],
      [
        3,
        18,
        8,
        15
      ],
      [
        23,
        38,
        20,
        31
      ],
      [
        10,
        32,
        33,
        37
      ]
    ],
    "discs": [
      [
        32,
        24,
        6,
        6
      ]
    ],
    "e": [
      20,
      1
    ],
    "rooms": [
      [
        "catalogue",
        20,
        5
      ],
      [
        "collections",
        9,
        12
      ],
      [
        "reading-room",
        34,
        26
      ],
      [
        "archive",
        20,
        34
      ],
      [
        "scribe-hall",
        20,
        23
      ]
    ],
    "div": [
      [
        "x",
        23,
        14,
        22,
        18
      ]
    ],
    "peak": [
      [
        9,
        12
      ],
      [
        34,
        26
      ],
      [
        20,
        34
      ]
    ],
    "roof": "bellwether-courtyard-rotunda-and-spindle"
  },
  {
    "t": "healers-house",
    "b": "desert",
    "s": "large",
    "variant": 4,
    "title": "Saffron Gorge Recovery Cloister",
    "dim": [
      49,
      16,
      44
    ],
    "r": [
      [
        21,
        29,
        1,
        40
      ],
      [
        3,
        23,
        8,
        19
      ],
      [
        29,
        46,
        16,
        28
      ],
      [
        10,
        39,
        35,
        41
      ]
    ],
    "discs": [
      [
        10,
        13,
        7,
        6
      ]
    ],
    "e": [
      25,
      1
    ],
    "rooms": [
      [
        "reception",
        25,
        5
      ],
      [
        "treatment",
        11,
        13
      ],
      [
        "recovery",
        38,
        21
      ],
      [
        "remedy-kitchen",
        18,
        37
      ],
      [
        "sanctuary",
        34,
        37
      ],
      [
        "physician-study",
        25,
        25
      ]
    ],
    "div": [
      [
        "x",
        28,
        17,
        25,
        21
      ]
    ],
    "peak": [
      [
        11,
        13
      ],
      [
        38,
        21
      ],
      [
        18,
        37
      ]
    ],
    "roof": "saffron-two-wings-braided-sunshade"
  },
  {
    "t": "library",
    "b": "desert",
    "s": "large",
    "variant": 4,
    "title": "Sunvault Open-Court Chronicle",
    "dim": [
      50,
      16,
      46
    ],
    "r": [
      [
        20,
        28,
        1,
        42
      ],
      [
        4,
        21,
        9,
        23
      ],
      [
        28,
        46,
        17,
        32
      ],
      [
        11,
        37,
        37,
        43
      ]
    ],
    "discs": [
      [
        11,
        14,
        7,
        7
      ],
      [
        39,
        24,
        7,
        6
      ]
    ],
    "holes": [
      [
        34,
        20,
        1,
        1
      ]
    ],
    "e": [
      24,
      1
    ],
    "rooms": [
      [
        "catalogue",
        24,
        5
      ],
      [
        "collections",
        10,
        14
      ],
      [
        "reading-room",
        40,
        26
      ],
      [
        "archive",
        17,
        39
      ],
      [
        "restricted-scriptorium",
        30,
        39
      ],
      [
        "oral-records",
        24,
        26
      ]
    ],
    "div": [
      [
        "z",
        19,
        20,
        28,
        24
      ]
    ],
    "peak": [
      [
        11,
        14
      ],
      [
        39,
        24
      ],
      [
        17,
        39
      ]
    ],
    "roof": "sunvault-asymmetric-shade-wing-and-court"
  },
  {
    "t": "healers-house",
    "b": "snow",
    "s": "medium",
    "variant": 4,
    "title": "Snowmelt Double-Chimney Recuperatory",
    "dim": [
      40,
      14,
      36
    ],
    "r": [
      [
        15,
        23,
        1,
        33
      ],
      [
        2,
        16,
        9,
        20
      ],
      [
        23,
        38,
        13,
        26
      ],
      [
        8,
        30,
        31,
        34
      ]
    ],
    "e": [
      19,
      1
    ],
    "rooms": [
      [
        "waiting",
        19,
        5
      ],
      [
        "treatment",
        8,
        14
      ],
      [
        "recovery",
        32,
        19
      ],
      [
        "drug-store",
        19,
        31
      ],
      [
        "isolation-cell",
        19,
        23
      ]
    ],
    "div": [
      [
        "x",
        22,
        14,
        23,
        18
      ]
    ],
    "peak": [
      [
        8,
        14
      ],
      [
        32,
        19
      ],
      [
        18,
        31
      ]
    ],
    "roof": "snowmelt-chimney-paired-warm-roofs"
  },
  {
    "t": "library",
    "b": "snow",
    "s": "small",
    "variant": 4,
    "title": "Frostwhistle Split-Stack Reading Hall",
    "dim": [
      30,
      13,
      30
    ],
    "r": [
      [
        11,
        18,
        1,
        27
      ],
      [
        2,
        13,
        7,
        15
      ],
      [
        18,
        27,
        16,
        26
      ],
      [
        6,
        21,
        25,
        28
      ]
    ],
    "e": [
      15,
      1
    ],
    "rooms": [
      [
        "catalogue",
        15,
        5
      ],
      [
        "collections",
        6,
        12
      ],
      [
        "reading-room",
        23,
        21
      ],
      [
        "archive",
        13,
        26
      ]
    ],
    "div": [
      [
        "z",
        16,
        11,
        19,
        15
      ]
    ],
    "peak": [
      [
        6,
        12
      ],
      [
        23,
        21
      ],
      [
        13,
        26
      ]
    ],
    "roof": "frostwhistle-skewed-ice-stack-hips"
  },
  {
    "t": "healers-house",
    "b": "enchanted-forest",
    "s": "large",
    "variant": 4,
    "title": "Orchid Triad Moonwell Ward",
    "dim": [
      48,
      16,
      45
    ],
    "r": [
      [
        19,
        27,
        1,
        42
      ],
      [
        12,
        37,
        24,
        29
      ]
    ],
    "discs": [
      [
        12,
        14,
        10,
        9
      ],
      [
        36,
        19,
        9,
        8
      ],
      [
        13,
        35,
        8,
        7
      ],
      [
        35,
        35,
        8,
        7
      ]
    ],
    "holes": [
      [
        13,
        14,
        2,
        2
      ]
    ],
    "e": [
      23,
      1
    ],
    "rooms": [
      [
        "reception",
        23,
        5
      ],
      [
        "treatment",
        8,
        11
      ],
      [
        "recovery",
        36,
        19
      ],
      [
        "quarantine",
        13,
        35
      ],
      [
        "alchemy",
        35,
        35
      ],
      [
        "community-hall",
        23,
        26
      ]
    ],
    "div": [
      [
        "x",
        25,
        18,
        23,
        20
      ]
    ],
    "peak": [
      [
        11,
        13
      ],
      [
        36,
        19
      ],
      [
        13,
        35
      ],
      [
        35,
        35
      ]
    ],
    "roof": "orchid-four-leaf-moonwell-canopies"
  },
  {
    "t": "library",
    "b": "enchanted-forest",
    "s": "medium",
    "variant": 4,
    "title": "Firefly Serpentine Scriptorium",
    "dim": [
      42,
      15,
      39
    ],
    "r": [
      [
        18,
        25,
        1,
        36
      ],
      [
        9,
        34,
        22,
        25
      ],
      [
        12,
        20,
        10,
        14
      ]
    ],
    "discs": [
      [
        10,
        12,
        7,
        8
      ],
      [
        32,
        17,
        8,
        7
      ],
      [
        12,
        29,
        7,
        7
      ]
    ],
    "e": [
      21,
      1
    ],
    "rooms": [
      [
        "catalogue",
        21,
        5
      ],
      [
        "collections",
        10,
        12
      ],
      [
        "reading-room",
        32,
        17
      ],
      [
        "rare-writings",
        12,
        29
      ],
      [
        "transcription",
        22,
        32
      ]
    ],
    "div": [
      [
        "z",
        24,
        18,
        26,
        22
      ]
    ],
    "peak": [
      [
        10,
        12
      ],
      [
        32,
        17
      ],
      [
        12,
        29
      ]
    ],
    "roof": "firefly-three-lens-serpentine-crown"
  },
  {
    "t": "healers-house",
    "b": "mountain",
    "s": "large",
    "variant": 4,
    "title": "Granite Step Ridge Infirmary",
    "dim": [
      50,
      17,
      46
    ],
    "r": [
      [
        21,
        29,
        1,
        43
      ],
      [
        3,
        22,
        6,
        20
      ],
      [
        28,
        47,
        17,
        31
      ],
      [
        7,
        42,
        36,
        43
      ]
    ],
    "discs": [
      [
        9,
        12,
        7,
        6
      ],
      [
        39,
        25,
        7,
        6
      ]
    ],
    "e": [
      25,
      1
    ],
    "rooms": [
      [
        "reception",
        25,
        5
      ],
      [
        "treatment",
        10,
        12
      ],
      [
        "recovery",
        40,
        24
      ],
      [
        "herbal-ward",
        14,
        39
      ],
      [
        "long-rest-ward",
        36,
        39
      ],
      [
        "physician-council",
        25,
        27
      ]
    ],
    "div": [
      [
        "x",
        28,
        20,
        26,
        23
      ]
    ],
    "peak": [
      [
        10,
        12
      ],
      [
        40,
        25
      ],
      [
        15,
        39
      ],
      [
        36,
        39
      ]
    ],
    "roof": "granite-four-supported-crag-steps"
  },
  {
    "t": "library",
    "b": "mountain",
    "s": "large",
    "variant": 4,
    "title": "Cliffglass Terrace Archive",
    "dim": [
      50,
      16,
      45
    ],
    "r": [
      [
        19,
        28,
        1,
        42
      ],
      [
        2,
        22,
        10,
        23
      ],
      [
        27,
        47,
        16,
        31
      ],
      [
        8,
        43,
        37,
        43
      ]
    ],
    "discs": [
      [
        9,
        15,
        7,
        6
      ],
      [
        40,
        24,
        7,
        6
      ]
    ],
    "holes": [
      [
        11,
        17,
        1,
        1
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
        8,
        14
      ],
      [
        "reading-room",
        40,
        25
      ],
      [
        "archive",
        14,
        39
      ],
      [
        "chronicler-vault",
        35,
        39
      ],
      [
        "lookout-study",
        23,
        27
      ]
    ],
    "div": [
      [
        "x",
        27,
        20,
        29,
        24
      ]
    ],
    "peak": [
      [
        9,
        14
      ],
      [
        40,
        25
      ],
      [
        14,
        39
      ],
      [
        36,
        39
      ]
    ],
    "roof": "cliffglass-double-bastion-terrace"
  }
]);
export const M2_VARIANT04_FIRST10=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_103_ALL=Object.freeze([...M2_93_ALL,...M2_VARIANT04_FIRST10]);
export const M2_103_CENSUS=Object.freeze({newModels:M2_VARIANT04_FIRST10.length,authored:M2_103_ALL.length,remaining:285-M2_103_ALL.length,
 healers:M2_103_ALL.filter(x=>x.type==='healers-house').length,libraries:M2_103_ALL.filter(x=>x.type==='library').length,
 fingerprints:new Set(M2_103_ALL.map(geometrySignature)).size,creatorApproved:0,integrated:0});
validateCollection(M2_103_ALL);
if(M2_103_CENSUS.newModels!==10||M2_103_CENSUS.authored!==103||M2_103_CENSUS.healers!==50||M2_103_CENSUS.libraries!==50||M2_103_CENSUS.fingerprints!==103)
 throw Error('Builder 4B M2 fourth-variant source census/geometry uniqueness invalid');
export const M2_VARIANT04_FIRST10_NAMES=Object.freeze(PLANS.map(p=>p.title));
