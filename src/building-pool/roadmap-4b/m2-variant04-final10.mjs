// Builder 4B: ten independently authored fourth-variant healer/library buildings.
// Entirely theoretical source voxels, never world-placed or runtime-registered.
import {M2_113_ALL} from './m2-variant04-second10.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
  {
    "t": "healers-house",
    "b": "temperate",
    "s": "large",
    "variant": 4,
    "title": "Marshlight Split-Canal Infirmary",
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
        3,
        20,
        7,
        18
      ],
      [
        28,
        46,
        18,
        30
      ],
      [
        6,
        21,
        33,
        42
      ],
      [
        30,
        45,
        34,
        42
      ],
      [
        27,
        33,
        36,
        40
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
        10,
        13
      ],
      [
        "recovery",
        39,
        23
      ],
      [
        "isolation",
        12,
        38
      ],
      [
        "herb-storage",
        38,
        38
      ],
      [
        "consultation",
        23,
        25
      ]
    ],
    "div": [
      [
        "x",
        28,
        18,
        23,
        21
      ]
    ],
    "peak": [
      [
        10,
        13
      ],
      [
        39,
        23
      ],
      [
        13,
        38
      ],
      [
        38,
        38
      ]
    ],
    "roof": "marshlight-six-staggered-waterfront-ridges"
  },
  {
    "t": "library",
    "b": "temperate",
    "s": "large",
    "variant": 4,
    "title": "Briarwick Open-Cloister Archive",
    "dim": [
      49,
      16,
      47
    ],
    "r": [
      [
        6,
        43,
        8,
        43
      ],
      [
        19,
        28,
        1,
        14
      ]
    ],
    "holes": [
      [
        23,
        25,
        6,
        7
      ]
    ],
    "discs": [
      [
        11,
        15,
        6,
        6
      ],
      [
        37,
        34,
        6,
        6
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
        11,
        13
      ],
      [
        "reading-room",
        37,
        18
      ],
      [
        "archive",
        13,
        37
      ],
      [
        "rare-scriptorium",
        36,
        37
      ],
      [
        "map-vault",
        24,
        12
      ]
    ],
    "div": [
      [
        "z",
        14,
        8,
        35,
        22
      ]
    ],
    "peak": [
      [
        11,
        15
      ],
      [
        37,
        18
      ],
      [
        13,
        37
      ],
      [
        36,
        37
      ]
    ],
    "roof": "briarwick-open-court-archive-towers"
  },
  {
    "t": "healers-house",
    "b": "desert",
    "s": "medium",
    "variant": 4,
    "title": "Copperwind Triage Courtyard",
    "dim": [
      42,
      14,
      39
    ],
    "r": [
      [
        15,
        23,
        1,
        36
      ],
      [
        2,
        17,
        9,
        20
      ],
      [
        22,
        38,
        17,
        30
      ],
      [
        10,
        31,
        33,
        37
      ]
    ],
    "discs": [
      [
        32,
        23,
        5,
        5
      ]
    ],
    "holes": [
      [
        31,
        25,
        1,
        1
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
        33,
        23
      ],
      [
        "remedies",
        18,
        34
      ],
      [
        "cooling-hall",
        19,
        24
      ]
    ],
    "div": [
      [
        "x",
        22,
        15,
        17,
        16
      ]
    ],
    "peak": [
      [
        8,
        14
      ],
      [
        33,
        23
      ],
      [
        18,
        33
      ]
    ],
    "roof": "copperwind-offset-shade-domes"
  },
  {
    "t": "library",
    "b": "desert",
    "s": "small",
    "variant": 4,
    "title": "Sundial Petal Reading Booth",
    "dim": [
      32,
      13,
      31
    ],
    "r": [
      [
        11,
        19,
        1,
        28
      ],
      [
        3,
        14,
        10,
        17
      ],
      [
        18,
        29,
        15,
        26
      ]
    ],
    "discs": [
      [
        8,
        13,
        5,
        5
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
        7,
        13
      ],
      [
        "reading-room",
        24,
        20
      ],
      [
        "archive",
        15,
        25
      ]
    ],
    "div": [
      [
        "x",
        18,
        14,
        17,
        15
      ]
    ],
    "peak": [
      [
        7,
        13
      ],
      [
        24,
        20
      ],
      [
        15,
        25
      ]
    ],
    "roof": "sundial-fan-terrace-roofs"
  },
  {
    "t": "healers-house",
    "b": "snow",
    "s": "small",
    "variant": 4,
    "title": "Rimewatch Frostline Rest House",
    "dim": [
      32,
      13,
      31
    ],
    "r": [
      [
        12,
        19,
        1,
        28
      ],
      [
        3,
        14,
        8,
        17
      ],
      [
        19,
        29,
        16,
        26
      ],
      [
        3,
        14,
        22,
        29
      ],
      [
        19,
        29,
        5,
        13
      ]
    ],
    "e": [
      16,
      1
    ],
    "rooms": [
      [
        "waiting",
        16,
        5
      ],
      [
        "treatment",
        7,
        12
      ],
      [
        "recovery",
        24,
        20
      ],
      [
        "healing-stores",
        16,
        25
      ]
    ],
    "div": [
      [
        "z",
        17,
        12,
        23,
        17
      ]
    ],
    "peak": [
      [
        7,
        12
      ],
      [
        24,
        20
      ],
      [
        16,
        24
      ]
    ],
    "roof": "rimewatch-three-radial-ice-roofs"
  },
  {
    "t": "library",
    "b": "snow",
    "s": "large",
    "variant": 4,
    "title": "Avalanche Triple-Aisle Codex",
    "dim": [
      51,
      16,
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
        9,
        21
      ],
      [
        28,
        48,
        10,
        23
      ],
      [
        6,
        20,
        32,
        43
      ],
      [
        31,
        47,
        32,
        43
      ],
      [
        27,
        35,
        36,
        40
      ]
    ],
    "discs": [
      [
        40,
        16,
        6,
        6
      ]
    ],
    "e": [
      25,
      1
    ],
    "rooms": [
      [
        "catalogue",
        25,
        5
      ],
      [
        "collections",
        12,
        14
      ],
      [
        "reading-room",
        40,
        16
      ],
      [
        "archive",
        13,
        38
      ],
      [
        "restricted-stacks",
        40,
        38
      ],
      [
        "bindery",
        25,
        26
      ]
    ],
    "div": [
      [
        "x",
        28,
        17,
        25,
        19
      ]
    ],
    "peak": [
      [
        12,
        14
      ],
      [
        40,
        16
      ],
      [
        13,
        38
      ],
      [
        40,
        38
      ]
    ],
    "roof": "avalanche-separate-four-aisle-snowfields"
  },
  {
    "t": "healers-house",
    "b": "enchanted-forest",
    "s": "medium",
    "variant": 4,
    "title": "Rootcoil Five-Petal Clinic",
    "dim": [
      42,
      15,
      40
    ],
    "discs": [
      [
        10,
        12,
        8,
        8
      ],
      [
        32,
        15,
        7,
        7
      ],
      [
        12,
        31,
        7,
        7
      ],
      [
        31,
        30,
        6,
        7
      ]
    ],
    "r": [
      [
        17,
        24,
        1,
        36
      ],
      [
        10,
        34,
        20,
        25
      ]
    ],
    "e": [
      20,
      1
    ],
    "rooms": [
      [
        "waiting",
        20,
        5
      ],
      [
        "treatment",
        10,
        12
      ],
      [
        "recovery",
        32,
        15
      ],
      [
        "herb-lab",
        12,
        31
      ],
      [
        "healing-garden",
        31,
        30
      ],
      [
        "consultation",
        20,
        22
      ]
    ],
    "div": [
      [
        "z",
        20,
        16,
        25,
        21
      ]
    ],
    "peak": [
      [
        10,
        12
      ],
      [
        32,
        15
      ],
      [
        12,
        31
      ],
      [
        31,
        30
      ]
    ],
    "roof": "rootcoil-four-leaf-terrace-crowns"
  },
  {
    "t": "library",
    "b": "enchanted-forest",
    "s": "large",
    "variant": 4,
    "title": "Luminroot Grotto Codex",
    "dim": [
      51,
      17,
      47
    ],
    "discs": [
      [
        12,
        14,
        9,
        9
      ],
      [
        39,
        15,
        8,
        8
      ],
      [
        13,
        35,
        8,
        8
      ],
      [
        39,
        35,
        8,
        8
      ]
    ],
    "r": [
      [
        20,
        29,
        1,
        44
      ],
      [
        13,
        39,
        20,
        27
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
        8,
        12
      ],
      [
        "reading-room",
        39,
        15
      ],
      [
        "archive",
        13,
        35
      ],
      [
        "mythology-scriptorium",
        39,
        35
      ],
      [
        "bridge-study",
        24,
        23
      ]
    ],
    "div": [
      [
        "x",
        28,
        17,
        25,
        20
      ]
    ],
    "peak": [
      [
        12,
        14
      ],
      [
        39,
        15
      ],
      [
        13,
        35
      ],
      [
        39,
        35
      ]
    ],
    "roof": "luminroot-four-vault-crystal-canopies"
  },
  {
    "t": "healers-house",
    "b": "mountain",
    "s": "small",
    "variant": 4,
    "title": "Slatehook Switchback Clinic",
    "dim": [
      32,
      13,
      31
    ],
    "r": [
      [
        12,
        19,
        1,
        28
      ],
      [
        3,
        14,
        7,
        16
      ],
      [
        18,
        29,
        14,
        25
      ],
      [
        5,
        15,
        24,
        29
      ]
    ],
    "e": [
      16,
      1
    ],
    "rooms": [
      [
        "waiting",
        16,
        5
      ],
      [
        "treatment",
        8,
        12
      ],
      [
        "recovery",
        24,
        20
      ],
      [
        "herbal-cell",
        11,
        26
      ]
    ],
    "div": [
      [
        "z",
        14,
        12,
        23,
        17
      ]
    ],
    "peak": [
      [
        8,
        12
      ],
      [
        24,
        20
      ],
      [
        11,
        26
      ]
    ],
    "roof": "slatehook-switchback-cliff-sheds"
  },
  {
    "t": "library",
    "b": "mountain",
    "s": "medium",
    "variant": 4,
    "title": "Basalt Spur Switchback Archive",
    "dim": [
      43,
      15,
      39
    ],
    "r": [
      [
        16,
        24,
        1,
        36
      ],
      [
        3,
        17,
        8,
        19
      ],
      [
        23,
        39,
        20,
        32
      ],
      [
        9,
        31,
        34,
        37
      ]
    ],
    "discs": [
      [
        34,
        26,
        5,
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
        14
      ],
      [
        "reading-room",
        34,
        26
      ],
      [
        "archive",
        18,
        35
      ],
      [
        "chronicle-workshop",
        20,
        22
      ]
    ],
    "div": [
      [
        "x",
        23,
        16,
        22,
        19
      ]
    ],
    "peak": [
      [
        9,
        14
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
    "roof": "basalt-high-low-shelf-spur-roofs"
  }
]);
export const M2_VARIANT04_FINAL10=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_123_ALL=Object.freeze([...M2_113_ALL,...M2_VARIANT04_FINAL10]);
export const M2_123_CENSUS=Object.freeze({newModels:M2_VARIANT04_FINAL10.length,authored:M2_123_ALL.length,remaining:285-M2_123_ALL.length,healers:M2_123_ALL.filter(x=>x.type==='healers-house').length,libraries:M2_123_ALL.filter(x=>x.type==='library').length,fingerprints:new Set(M2_123_ALL.map(geometrySignature)).size,creatorApproved:0,integrated:0});
validateCollection(M2_123_ALL);
if(M2_123_CENSUS.newModels!==10||M2_123_CENSUS.authored!==123||M2_123_CENSUS.healers!==60||M2_123_CENSUS.libraries!==60||M2_123_CENSUS.fingerprints!==123)throw Error('4B M2 fourth-variant final cohort census failed');
export const M2_VARIANT04_FINAL_NAMES=Object.freeze(PLANS.map(x=>x.title));
