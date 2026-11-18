// Builder 4B M3: five original coordinate-authored schoolhouses, one per biome; theoretical source only.
// No live registration, save writes, world placement or numeric-asset allocation.
import {M2_138_ALL} from './m2-variant05-final15.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateCollection,validateBlueprint,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
  {
    "t": "schoolhouse",
    "b": "temperate",
    "s": "medium",
    "variant": 1,
    "title": "Cloverbridge Two-Wing Commons School",
    "dim": [
      43,
      15,
      40
    ],
    "r": [
      [
        16,
        24,
        1,
        37
      ],
      [
        3,
        17,
        9,
        21
      ],
      [
        23,
        39,
        18,
        31
      ],
      [
        9,
        34,
        35,
        38
      ]
    ],
    "discs": [
      [
        9,
        15,
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
        "classroom",
        9,
        15
      ],
      [
        "shared-study",
        34,
        25
      ],
      [
        "teacher-area",
        20,
        6
      ],
      [
        "reading-gallery",
        18,
        36
      ],
      [
        "woodcraft-class",
        20,
        23
      ]
    ],
    "div": [
      [
        "x",
        24,
        17,
        25,
        20
      ]
    ],
    "peak": [
      [
        9,
        15
      ],
      [
        34,
        25
      ],
      [
        20,
        34
      ]
    ],
    "roof": "cloverbridge-two-wing-offset-timber-roofs"
  },
  {
    "t": "schoolhouse",
    "b": "desert",
    "s": "large",
    "variant": 1,
    "title": "Sunspire Open-Sky Mosaic School",
    "dim": [
      55,
      17,
      49
    ],
    "r": [
      [
        6,
        49,
        8,
        45
      ],
      [
        22,
        31,
        1,
        15
      ],
      [
        1,
        9,
        18,
        34
      ],
      [
        33,
        51,
        1,
        12
      ]
    ],
    "holes": [
      [
        27,
        27,
        6,
        6
      ]
    ],
    "discs": [
      [
        12,
        15,
        6,
        6
      ],
      [
        44,
        38,
        6,
        6
      ]
    ],
    "e": [
      26,
      1
    ],
    "rooms": [
      [
        "classroom",
        13,
        17
      ],
      [
        "shared-study",
        42,
        17
      ],
      [
        "teacher-area",
        26,
        6
      ],
      [
        "shaded-artroom",
        13,
        40
      ],
      [
        "history-hall",
        42,
        39
      ],
      [
        "reading-arcade",
        26,
        41
      ]
    ],
    "div": [
      [
        "z",
        15,
        10,
        45,
        12
      ]
    ],
    "peak": [
      [
        12,
        15
      ],
      [
        42,
        17
      ],
      [
        13,
        40
      ],
      [
        42,
        39
      ]
    ],
    "roof": "sunspire-courtyard-shade-fan-gables"
  },
  {
    "t": "schoolhouse",
    "b": "snow",
    "s": "small",
    "variant": 1,
    "title": "Snowbell Hearth-and-Study House",
    "dim": [
      35,
      13,
      34
    ],
    "r": [
      [
        13,
        21,
        1,
        31
      ],
      [
        3,
        14,
        8,
        19
      ],
      [
        20,
        31,
        17,
        28
      ],
      [
        6,
        19,
        27,
        32
      ]
    ],
    "e": [
      17,
      1
    ],
    "rooms": [
      [
        "classroom",
        8,
        13
      ],
      [
        "shared-study",
        26,
        23
      ],
      [
        "teacher-area",
        17,
        6
      ],
      [
        "warming-library",
        10,
        29
      ]
    ],
    "div": [
      [
        "x",
        21,
        17,
        26,
        20
      ]
    ],
    "peak": [
      [
        8,
        13
      ],
      [
        26,
        23
      ],
      [
        11,
        29
      ]
    ],
    "roof": "snowbell-crosswind-hipped-warming-roofs"
  },
  {
    "t": "schoolhouse",
    "b": "enchanted-forest",
    "s": "large",
    "variant": 1,
    "title": "Fireleaf Four-Grove Learning Conservatory",
    "dim": [
      57,
      18,
      52
    ],
    "r": [
      [
        24,
        33,
        1,
        49
      ],
      [
        12,
        45,
        22,
        29
      ],
      [
        17,
        28,
        11,
        22
      ],
      [
        30,
        41,
        11,
        22
      ],
      [
        17,
        28,
        33,
        45
      ],
      [
        30,
        42,
        33,
        46
      ]
    ],
    "discs": [
      [
        13,
        16,
        9,
        9
      ],
      [
        44,
        17,
        8,
        8
      ],
      [
        14,
        42,
        8,
        8
      ],
      [
        43,
        42,
        8,
        8
      ]
    ],
    "holes": [
      [
        13,
        16,
        2,
        2
      ]
    ],
    "e": [
      28,
      1
    ],
    "rooms": [
      [
        "classroom",
        10,
        13
      ],
      [
        "shared-study",
        44,
        17
      ],
      [
        "teacher-area",
        28,
        6
      ],
      [
        "ecology-hall",
        14,
        42
      ],
      [
        "leaf-print-studio",
        43,
        42
      ],
      [
        "story-gallery",
        28,
        26
      ]
    ],
    "div": [
      [
        "x",
        33,
        18,
        29,
        20
      ]
    ],
    "peak": [
      [
        13,
        16
      ],
      [
        44,
        17
      ],
      [
        14,
        42
      ],
      [
        43,
        42
      ]
    ],
    "roof": "fireleaf-four-independent-canopy-shafts"
  },
  {
    "t": "schoolhouse",
    "b": "mountain",
    "s": "medium",
    "variant": 1,
    "title": "Granitepath Split-Level Lecture School",
    "dim": [
      44,
      16,
      42
    ],
    "r": [
      [
        17,
        25,
        1,
        39
      ],
      [
        3,
        18,
        9,
        21
      ],
      [
        24,
        41,
        19,
        33
      ],
      [
        9,
        33,
        35,
        40
      ]
    ],
    "discs": [
      [
        10,
        15,
        6,
        6
      ]
    ],
    "e": [
      21,
      1
    ],
    "rooms": [
      [
        "classroom",
        10,
        15
      ],
      [
        "shared-study",
        35,
        26
      ],
      [
        "teacher-area",
        21,
        6
      ],
      [
        "mapmaking-room",
        19,
        37
      ],
      [
        "stonecraft-class",
        22,
        24
      ]
    ],
    "div": [
      [
        "x",
        25,
        17,
        27,
        20
      ]
    ],
    "peak": [
      [
        10,
        15
      ],
      [
        35,
        26
      ],
      [
        21,
        36
      ]
    ],
    "roof": "granitepath-asymmetric-cliff-terrace-ridges"
  }
]);
export const M3_SCHOOLHOUSES_FIRST5=Object.freeze(PLANS.map(plan=>{
 const base=buildDistinctive4B(plan);
 const candidate={...base,provenance:{...base.provenance,milestone:'M3',source:'M3 source-authored independent schoolhouse coordinate plans',method:'unique biome architecture, accessible classroom and shared study, original supported roof tiers and producer-provisional furnishings'}};
 validateBlueprint(candidate);return Object.freeze(candidate);
}));
export const M3_143_ALL=Object.freeze([...M2_138_ALL,...M3_SCHOOLHOUSES_FIRST5]);
export const M3_143_CENSUS=Object.freeze({newModels:M3_SCHOOLHOUSES_FIRST5.length,authored:M3_143_ALL.length,remaining:285-M3_143_ALL.length,schoolhouses:M3_143_ALL.filter(b=>b.type==='schoolhouse').length,fingerprints:new Set(M3_143_ALL.map(geometrySignature)).size,creatorApproved:0,integrated:0});
validateCollection(M3_143_ALL);
if(M3_143_CENSUS.newModels!==5||M3_143_CENSUS.authored!==143||M3_143_CENSUS.schoolhouses!==6||M3_143_CENSUS.fingerprints!==143)throw Error('4B M3 schoolhouse source identity/uniqueness contract failed');
export const M3_SCHOOLHOUSES_FIRST5_NAMES=Object.freeze(PLANS.map(p=>p.title));
