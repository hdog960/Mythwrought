// Builder 4B M2 fourth-variant independently coordinate-authored healer/library cohort II.
// Fully original voxel source; candidate-only, no live game/saves/merge.
import {M2_103_ALL} from './m2-variant04-first10.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
  {
    "t": "healers-house",
    "b": "temperate",
    "s": "medium",
    "variant": 4,
    "title": "Willowcross Estuary Recovery House",
    "dim": [
      41,
      14,
      38
    ],
    "r": [
      [
        16,
        24,
        1,
        35
      ],
      [
        3,
        18,
        9,
        21
      ],
      [
        23,
        37,
        19,
        30
      ],
      [
        9,
        28,
        33,
        36
      ]
    ],
    "discs": [
      [
        9,
        15,
        6,
        6
      ],
      [
        32,
        25,
        5,
        5
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
        9,
        15
      ],
      [
        "recovery",
        32,
        25
      ],
      [
        "consultation",
        20,
        19
      ],
      [
        "herb-storage",
        20,
        34
      ]
    ],
    "div": [
      [
        "x",
        23,
        15,
        22,
        25
      ]
    ],
    "peak": [
      [
        9,
        15
      ],
      [
        32,
        25
      ],
      [
        20,
        31
      ]
    ],
    "roof": "willowcross-estuary-asymmetric-galleries"
  },
  {
    "t": "library",
    "b": "temperate",
    "s": "small",
    "variant": 4,
    "title": "Glenward Lantern Lending House",
    "dim": [
      30,
      13,
      29
    ],
    "r": [
      [
        11,
        18,
        1,
        26
      ],
      [
        2,
        12,
        8,
        17
      ],
      [
        17,
        27,
        15,
        25
      ]
    ],
    "discs": [
      [
        7,
        12,
        5,
        5
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
        6,
        12
      ],
      [
        "reading-room",
        23,
        20
      ],
      [
        "archive",
        14,
        23
      ]
    ],
    "div": [
      [
        "z",
        16,
        12,
        21,
        17
      ]
    ],
    "peak": [
      [
        7,
        12
      ],
      [
        23,
        20
      ],
      [
        14,
        23
      ]
    ],
    "roof": "glenward-vaulted-three-court-gables"
  },
  {
    "t": "healers-house",
    "b": "desert",
    "s": "small",
    "variant": 4,
    "title": "Red Sirocco Travellers Clinic",
    "dim": [
      31,
      13,
      29
    ],
    "r": [
      [
        11,
        18,
        1,
        26
      ],
      [
        3,
        12,
        9,
        17
      ],
      [
        17,
        28,
        12,
        23
      ]
    ],
    "discs": [
      [
        7,
        12,
        5,
        6
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
        7,
        12
      ],
      [
        "recovery",
        24,
        18
      ],
      [
        "remedy-room",
        14,
        24
      ]
    ],
    "div": [
      [
        "x",
        17,
        16,
        17,
        19
      ]
    ],
    "peak": [
      [
        7,
        12
      ],
      [
        24,
        18
      ],
      [
        14,
        23
      ]
    ],
    "roof": "red-sirocco-twisted-sunportico"
  },
  {
    "t": "library",
    "b": "desert",
    "s": "medium",
    "variant": 4,
    "title": "Sunstill Open-Sky Mosaic Library",
    "dim": [
      43,
      14,
      40
    ],
    "r": [
      [
        4,
        38,
        8,
        35
      ],
      [
        17,
        24,
        1,
        12
      ]
    ],
    "holes": [
      [
        21,
        21,
        6,
        7
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
        10,
        14
      ],
      [
        "reading-room",
        33,
        15
      ],
      [
        "archive",
        10,
        30
      ],
      [
        "scribe-gallery",
        32,
        30
      ]
    ],
    "div": [
      [
        "z",
        13,
        9,
        20,
        15
      ]
    ],
    "peak": [
      [
        10,
        13
      ],
      [
        33,
        15
      ],
      [
        10,
        30
      ],
      [
        32,
        30
      ]
    ],
    "roof": "sunstill-interlocking-court-pergolas"
  },
  {
    "t": "healers-house",
    "b": "snow",
    "s": "large",
    "variant": 4,
    "title": "Hoarfrost Compass Ward",
    "dim": [
      51,
      17,
      47
    ],
    "r": [
      [
        21,
        29,
        1,
        44
      ],
      [
        4,
        23,
        9,
        21
      ],
      [
        28,
        47,
        7,
        20
      ],
      [
        7,
        22,
        31,
        43
      ],
      [
        29,
        46,
        32,
        44
      ]
    ],
    "discs": [
      [
        10,
        16,
        6,
        6
      ],
      [
        41,
        14,
        6,
        5
      ]
    ],
    "e": [
      25,
      1
    ],
    "rooms": [
      [
        "waiting",
        25,
        5
      ],
      [
        "treatment",
        11,
        15
      ],
      [
        "recovery",
        40,
        15
      ],
      [
        "isolation",
        13,
        37
      ],
      [
        "warming-ward",
        40,
        38
      ],
      [
        "consultation",
        25,
        25
      ]
    ],
    "div": [
      [
        "x",
        28,
        18,
        24,
        27
      ]
    ],
    "peak": [
      [
        10,
        15
      ],
      [
        40,
        15
      ],
      [
        13,
        38
      ],
      [
        39,
        38
      ]
    ],
    "roof": "hoarfrost-five-point-ward-bastions"
  },
  {
    "t": "library",
    "b": "snow",
    "s": "medium",
    "variant": 4,
    "title": "Iceshelf Zigzag Codex Hall",
    "dim": [
      40,
      15,
      37
    ],
    "r": [
      [
        14,
        23,
        1,
        34
      ],
      [
        3,
        16,
        7,
        19
      ],
      [
        22,
        37,
        18,
        30
      ],
      [
        9,
        31,
        32,
        35
      ]
    ],
    "discs": [
      [
        8,
        13,
        6,
        6
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
        8,
        13
      ],
      [
        "reading-room",
        32,
        25
      ],
      [
        "archive",
        18,
        32
      ],
      [
        "book-repair",
        18,
        20
      ]
    ],
    "div": [
      [
        "x",
        22,
        16,
        22,
        25
      ]
    ],
    "peak": [
      [
        8,
        13
      ],
      [
        32,
        25
      ],
      [
        18,
        32
      ]
    ],
    "roof": "iceshelf-offset-zigzag-crowns"
  },
  {
    "t": "healers-house",
    "b": "enchanted-forest",
    "s": "small",
    "variant": 4,
    "title": "Mossstar Three-Grove Hospice",
    "dim": [
      33,
      13,
      33
    ],
    "r": [
      [
        12,
        19,
        1,
        30
      ]
    ],
    "discs": [
      [
        8,
        12,
        6,
        6
      ],
      [
        25,
        16,
        6,
        7
      ],
      [
        13,
        26,
        7,
        5
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
        25,
        16
      ],
      [
        "herbal-study",
        13,
        26
      ]
    ],
    "div": [
      [
        "x",
        18,
        15,
        17,
        19
      ]
    ],
    "peak": [
      [
        8,
        12
      ],
      [
        25,
        16
      ],
      [
        13,
        26
      ]
    ],
    "roof": "mossstar-three-leaf-twisting-spires"
  },
  {
    "t": "library",
    "b": "enchanted-forest",
    "s": "small",
    "variant": 4,
    "title": "Glowring Hollow Reading Atrium",
    "dim": [
      34,
      13,
      34
    ],
    "discs": [
      [
        16,
        16,
        13,
        13
      ]
    ],
    "holes": [
      [
        16,
        16,
        5,
        5
      ]
    ],
    "r": [
      [
        13,
        19,
        1,
        9
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
        7,
        15
      ],
      [
        "reading-room",
        25,
        16
      ],
      [
        "archive",
        16,
        26
      ]
    ],
    "div": [
      [
        "x",
        12,
        13,
        18,
        21
      ]
    ],
    "peak": [
      [
        8,
        13
      ],
      [
        25,
        16
      ],
      [
        16,
        26
      ]
    ],
    "roof": "glowring-open-air-hollow-canopy"
  },
  {
    "t": "healers-house",
    "b": "mountain",
    "s": "medium",
    "variant": 4,
    "title": "Shardback Twin-Ledge Clinic",
    "dim": [
      41,
      15,
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
        3,
        17,
        10,
        21
      ],
      [
        22,
        38,
        19,
        31
      ],
      [
        9,
        31,
        33,
        37
      ]
    ],
    "discs": [
      [
        8,
        16,
        5,
        6
      ],
      [
        33,
        25,
        5,
        5
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
        16
      ],
      [
        "recovery",
        33,
        25
      ],
      [
        "herbal-ward",
        19,
        34
      ],
      [
        "rehabilitation",
        19,
        21
      ]
    ],
    "div": [
      [
        "z",
        18,
        15,
        23,
        19
      ]
    ],
    "peak": [
      [
        8,
        16
      ],
      [
        33,
        25
      ],
      [
        19,
        33
      ]
    ],
    "roof": "shardback-lateral-rockface-stepped-ridge"
  },
  {
    "t": "library",
    "b": "mountain",
    "s": "small",
    "variant": 4,
    "title": "Screeveil Switch-Court Library",
    "dim": [
      32,
      13,
      32
    ],
    "r": [
      [
        12,
        19,
        1,
        29
      ],
      [
        3,
        13,
        8,
        17
      ],
      [
        18,
        29,
        14,
        25
      ],
      [
        4,
        13,
        23,
        29
      ]
    ],
    "discs": [
      [
        7,
        12,
        5,
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
        7,
        12
      ],
      [
        "reading-room",
        24,
        20
      ],
      [
        "archive",
        16,
        27
      ]
    ],
    "div": [
      [
        "z",
        15,
        12,
        22,
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
        27
      ]
    ],
    "roof": "screeveil-dogleg-stone-shelf-roofs"
  }
]);
export const M2_VARIANT04_SECOND10=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_113_ALL=Object.freeze([...M2_103_ALL,...M2_VARIANT04_SECOND10]);
export const M2_113_CENSUS=Object.freeze({newModels:M2_VARIANT04_SECOND10.length,authored:M2_113_ALL.length,remaining:285-M2_113_ALL.length,
 healers:M2_113_ALL.filter(b=>b.type==='healers-house').length,libraries:M2_113_ALL.filter(b=>b.type==='library').length,
 fingerprints:new Set(M2_113_ALL.map(geometrySignature)).size,creatorApproved:0,integrated:0});
validateCollection(M2_113_ALL);
if(M2_113_CENSUS.newModels!==10||M2_113_CENSUS.authored!==113||M2_113_CENSUS.healers!==55||M2_113_CENSUS.libraries!==55||M2_113_CENSUS.fingerprints!==113)
 throw Error('4B M2 second fourth-variant source authoring did not pass integrity gate');
export const M2_VARIANT04_SECOND10_NAMES=Object.freeze(PLANS.map(p=>p.title));
