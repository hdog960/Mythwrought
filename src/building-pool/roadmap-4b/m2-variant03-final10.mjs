// Builder 4B — ten independently authored, third-variant healer/library structures.
// Genuine source-coordinate footprints/rooms/partitions/raised supported roof tiers.
// Isolated candidate-only. Preserve the 83 original blueprints and their source identities.
import {M2_83_ALL} from './m2-variant03-second10.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
  {
    "t": "healers-house",
    "b": "temperate",
    "s": "medium",
    "variant": 3,
    "title": "Riverbend Two-Court Physic House",
    "dim": [
      38,
      14,
      35
    ],
    "r": [
      [
        15,
        22,
        1,
        31
      ],
      [
        3,
        17,
        6,
        17
      ],
      [
        21,
        34,
        18,
        28
      ],
      [
        9,
        27,
        29,
        32
      ]
    ],
    "e": [
      18,
      1
    ],
    "rooms": [
      [
        "waiting",
        18,
        5
      ],
      [
        "treatment",
        8,
        12
      ],
      [
        "recovery",
        28,
        23
      ],
      [
        "herb-storage",
        18,
        30
      ],
      [
        "consultation",
        19,
        16
      ]
    ],
    "div": [
      [
        "x",
        21,
        12,
        18,
        15
      ]
    ],
    "peak": [
      [
        8,
        12
      ],
      [
        28,
        23
      ],
      [
        18,
        28
      ]
    ],
    "roof": "riverbend-staggered-ward-saddles"
  },
  {
    "t": "library",
    "b": "temperate",
    "s": "large",
    "variant": 3,
    "title": "Linden Arcade Grand Library",
    "dim": [
      47,
      16,
      43
    ],
    "r": [
      [
        18,
        27,
        1,
        39
      ],
      [
        4,
        20,
        7,
        20
      ],
      [
        25,
        42,
        12,
        27
      ],
      [
        7,
        19,
        29,
        39
      ]
    ],
    "discs": [
      [
        10,
        14,
        7,
        6
      ],
      [
        37,
        20,
        6,
        7
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
        11,
        14
      ],
      [
        "reading-room",
        36,
        21
      ],
      [
        "archive",
        12,
        34
      ],
      [
        "rare-book-vault",
        23,
        33
      ],
      [
        "illumination-gallery",
        23,
        19
      ]
    ],
    "div": [
      [
        "x",
        22,
        16,
        24,
        19
      ]
    ],
    "peak": [
      [
        11,
        14
      ],
      [
        36,
        21
      ],
      [
        12,
        34
      ],
      [
        23,
        32
      ]
    ],
    "roof": "linden-asymmetric-arcaded-vaults"
  },
  {
    "t": "healers-house",
    "b": "desert",
    "s": "small",
    "variant": 3,
    "title": "Dustglass Oasis Dispensary",
    "dim": [
      29,
      12,
      27
    ],
    "r": [
      [
        11,
        17,
        1,
        24
      ],
      [
        3,
        13,
        6,
        17
      ],
      [
        16,
        25,
        11,
        22
      ]
    ],
    "discs": [
      [
        8,
        11,
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
        11
      ],
      [
        "recovery",
        21,
        17
      ],
      [
        "apothecary",
        14,
        23
      ]
    ],
    "div": [
      [
        "z",
        16,
        14,
        20,
        17
      ]
    ],
    "peak": [
      [
        7,
        11
      ],
      [
        21,
        17
      ],
      [
        14,
        22
      ]
    ],
    "roof": "dustglass-misaligned-cooling-awnings"
  },
  {
    "t": "library",
    "b": "desert",
    "s": "medium",
    "variant": 3,
    "title": "Nacre Shade Caravan Archives",
    "dim": [
      39,
      14,
      35
    ],
    "r": [
      [
        13,
        22,
        1,
        32
      ],
      [
        2,
        14,
        7,
        16
      ],
      [
        21,
        36,
        14,
        24
      ],
      [
        7,
        30,
        29,
        33
      ]
    ],
    "discs": [
      [
        28,
        19,
        7,
        6
      ]
    ],
    "holes": [
      [
        28,
        20,
        1,
        1
      ]
    ],
    "e": [
      17,
      1
    ],
    "rooms": [
      [
        "catalogue",
        17,
        5
      ],
      [
        "collections",
        7,
        12
      ],
      [
        "reading-room",
        33,
        17
      ],
      [
        "archive",
        14,
        30
      ],
      [
        "manuscript-terrace",
        22,
        30
      ]
    ],
    "div": [
      [
        "x",
        20,
        14,
        22,
        19
      ]
    ],
    "peak": [
      [
        7,
        12
      ],
      [
        33,
        17
      ],
      [
        14,
        30
      ]
    ],
    "roof": "nacre-desert-offset-mashrabiya-sheds"
  },
  {
    "t": "healers-house",
    "b": "snow",
    "s": "large",
    "variant": 3,
    "title": "Frostbreak Stepped Wardhouse",
    "dim": [
      48,
      16,
      44
    ],
    "r": [
      [
        19,
        28,
        1,
        40
      ],
      [
        3,
        22,
        8,
        18
      ],
      [
        26,
        45,
        10,
        21
      ],
      [
        6,
        21,
        28,
        40
      ],
      [
        28,
        43,
        29,
        40
      ]
    ],
    "e": [
      24,
      1
    ],
    "rooms": [
      [
        "waiting",
        24,
        5
      ],
      [
        "treatment",
        10,
        12
      ],
      [
        "recovery",
        37,
        14
      ],
      [
        "isolation-ward",
        12,
        34
      ],
      [
        "dispensary",
        37,
        34
      ],
      [
        "rehabilitation",
        24,
        23
      ]
    ],
    "div": [
      [
        "x",
        21,
        18,
        23,
        20
      ]
    ],
    "peak": [
      [
        10,
        12
      ],
      [
        37,
        14
      ],
      [
        12,
        34
      ],
      [
        37,
        34
      ]
    ],
    "roof": "frostbreak-four-crag-icebreak-roofs"
  },
  {
    "t": "library",
    "b": "snow",
    "s": "small",
    "variant": 3,
    "title": "Bluefen Husk Lantern Library",
    "dim": [
      30,
      12,
      29
    ],
    "r": [
      [
        11,
        19,
        1,
        26
      ],
      [
        3,
        13,
        5,
        13
      ],
      [
        18,
        28,
        11,
        22
      ],
      [
        5,
        15,
        22,
        27
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
        9
      ],
      [
        "reading-room",
        24,
        16
      ],
      [
        "archive",
        11,
        25
      ]
    ],
    "div": [
      [
        "x",
        18,
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
        24,
        16
      ],
      [
        11,
        25
      ]
    ],
    "roof": "bluefen-three-offset-lantern-roofs"
  },
  {
    "t": "healers-house",
    "b": "enchanted-forest",
    "s": "medium",
    "variant": 3,
    "title": "Petalwheel Grove Sanatorium",
    "dim": [
      38,
      14,
      36
    ],
    "discs": [
      [
        10,
        13,
        8,
        7
      ],
      [
        28,
        15,
        7,
        8
      ],
      [
        18,
        27,
        9,
        7
      ]
    ],
    "r": [
      [
        15,
        22,
        1,
        30
      ]
    ],
    "holes": [
      [
        11,
        15,
        2,
        2
      ]
    ],
    "e": [
      18,
      1
    ],
    "rooms": [
      [
        "waiting",
        18,
        5
      ],
      [
        "treatment",
        8,
        11
      ],
      [
        "recovery",
        29,
        15
      ],
      [
        "herbal-study",
        18,
        28
      ],
      [
        "rest-garden",
        18,
        17
      ]
    ],
    "div": [
      [
        "x",
        20,
        15,
        20,
        17
      ]
    ],
    "peak": [
      [
        10,
        13
      ],
      [
        28,
        15
      ],
      [
        18,
        27
      ]
    ],
    "roof": "petalwheel-tri-crown-leaf-rotunda"
  },
  {
    "t": "library",
    "b": "enchanted-forest",
    "s": "large",
    "variant": 3,
    "title": "Moongrove Root-Bridge Archive",
    "dim": [
      47,
      16,
      44
    ],
    "discs": [
      [
        12,
        14,
        9,
        9
      ],
      [
        34,
        13,
        8,
        8
      ],
      [
        13,
        33,
        8,
        7
      ],
      [
        34,
        33,
        8,
        7
      ]
    ],
    "r": [
      [
        19,
        27,
        1,
        40
      ],
      [
        12,
        35,
        18,
        25
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
        12,
        12
      ],
      [
        "reading-room",
        35,
        12
      ],
      [
        "archive",
        13,
        33
      ],
      [
        "scriptorium",
        34,
        33
      ],
      [
        "oral-history",
        23,
        22
      ]
    ],
    "div": [
      [
        "x",
        25,
        17,
        23,
        20
      ]
    ],
    "peak": [
      [
        12,
        14
      ],
      [
        34,
        13
      ],
      [
        13,
        33
      ],
      [
        34,
        33
      ]
    ],
    "roof": "moongrove-four-lens-canopy-bridge"
  },
  {
    "t": "healers-house",
    "b": "mountain",
    "s": "small",
    "variant": 3,
    "title": "Spur Hollow Clinic",
    "dim": [
      30,
      12,
      28
    ],
    "r": [
      [
        10,
        17,
        1,
        25
      ],
      [
        3,
        12,
        8,
        14
      ],
      [
        17,
        28,
        15,
        23
      ]
    ],
    "e": [
      13,
      1
    ],
    "rooms": [
      [
        "waiting",
        13,
        5
      ],
      [
        "treatment",
        6,
        10
      ],
      [
        "recovery",
        23,
        19
      ],
      [
        "dispensary",
        13,
        23
      ]
    ],
    "div": [
      [
        "z",
        15,
        11,
        19,
        14
      ]
    ],
    "peak": [
      [
        6,
        10
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
    "roof": "spur-hollow-staggered-ledge-roofs"
  },
  {
    "t": "library",
    "b": "mountain",
    "s": "medium",
    "variant": 3,
    "title": "Stonewind Twin-Shelf Library",
    "dim": [
      38,
      14,
      36
    ],
    "r": [
      [
        14,
        22,
        1,
        34
      ],
      [
        4,
        15,
        5,
        17
      ],
      [
        21,
        35,
        17,
        28
      ],
      [
        7,
        32,
        30,
        34
      ]
    ],
    "discs": [
      [
        8,
        10,
        6,
        6
      ],
      [
        29,
        23,
        7,
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
        9,
        10
      ],
      [
        "reading-room",
        29,
        23
      ],
      [
        "archive",
        18,
        30
      ],
      [
        "map-study",
        18,
        18
      ]
    ],
    "div": [
      [
        "x",
        21,
        16,
        22,
        19
      ]
    ],
    "peak": [
      [
        9,
        10
      ],
      [
        29,
        23
      ],
      [
        18,
        31
      ]
    ],
    "roof": "stonewind-bent-ridge-shelf-towers"
  }
]);
export const M2_VARIANT03_FINAL10=Object.freeze(PLANS.map(buildDistinctive4B));
export const M2_93_ALL=Object.freeze([...M2_83_ALL,...M2_VARIANT03_FINAL10]);
export const M2_93_CENSUS=Object.freeze({newModels:M2_VARIANT03_FINAL10.length,authored:M2_93_ALL.length,
 remaining:285-M2_93_ALL.length,healers:M2_93_ALL.filter(x=>x.type==='healers-house').length,
 libraries:M2_93_ALL.filter(x=>x.type==='library').length,
 fingerprints:new Set(M2_93_ALL.map(geometrySignature)).size,creatorApproved:0,integrated:0});
validateCollection(M2_93_ALL);
if(M2_93_CENSUS.newModels!==10||M2_93_CENSUS.authored!==93||M2_93_CENSUS.healers!==45||
 M2_93_CENSUS.libraries!==45||M2_93_CENSUS.fingerprints!==93)
 throw Error('4B M2 final third-variant census/uniqueness gate failed');
export const M2_VARIANT03_FINAL_NAMES=Object.freeze(PLANS.map(p=>p.title));
