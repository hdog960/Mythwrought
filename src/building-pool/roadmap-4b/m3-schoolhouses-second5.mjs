// Roadmap C — Builder 4B, M3 schoolhouse Wave 2: five newly source-authored original plans.
// Geometries use distinct original measured rects, rounded cloisters, courtyard voids,
// regional roof peaks, real navigable education-room coordinates and physical-source cells.
// Candidate-only, original M3 143 sources unchanged, no world registration or saves.
import {M3_143_ALL} from './m3-schoolhouses-first5.mjs';
import {buildDistinctive4B} from './m2-distinctive.mjs';
import {validateBlueprint,validateCollection,geometrySignature} from './schema.mjs';
const PLANS=Object.freeze([
  {
    "t": "schoolhouse",
    "b": "temperate",
    "s": "small",
    "variant": 1,
    "title": "Willowmere Fieldcraft Four-Wing School",
    "dim": [
      37,
      15,
      36
    ],
    "r": [
      [
        15,
        22,
        1,
        33
      ],
      [
        3,
        16,
        8,
        21
      ],
      [
        22,
        33,
        18,
        30
      ],
      [
        10,
        27,
        29,
        34
      ]
    ],
    "e": [
      19,
      1
    ],
    "rooms": [
      [
        "classroom",
        9,
        14
      ],
      [
        "shared-study",
        28,
        24
      ],
      [
        "teacher-area",
        19,
        7
      ],
      [
        "fieldcraft-workshop",
        16,
        31
      ]
    ],
    "div": [
      [
        "x",
        22,
        18,
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
        28,
        24
      ],
      [
        19,
        7
      ],
      [
        16,
        31
      ]
    ],
    "roof": "willowmere-displaced-fieldcraft-cross-gables"
  },
  {
    "t": "schoolhouse",
    "b": "desert",
    "s": "medium",
    "variant": 1,
    "title": "Saffrongate Caravan Astronomy School",
    "dim": [
      50,
      17,
      48
    ],
    "r": [
      [
        19,
        28,
        1,
        44
      ],
      [
        3,
        20,
        16,
        34
      ],
      [
        27,
        45,
        4,
        14
      ],
      [
        12,
        42,
        39,
        45
      ],
      [
        33,
        41,
        34,
        40
      ]
    ],
    "discs": [
      [
        37,
        30,
        7,
        7
      ]
    ],
    "holes": [
      [
        40,
        22,
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
        "classroom",
        9,
        25
      ],
      [
        "shared-study",
        37,
        30
      ],
      [
        "teacher-area",
        23,
        7
      ],
      [
        "astronomy-library",
        25,
        42
      ],
      [
        "caravan-mathematics",
        37,
        9
      ]
    ],
    "div": [
      [
        "x",
        20,
        19,
        31,
        25
      ]
    ],
    "peak": [
      [
        9,
        25
      ],
      [
        37,
        30
      ],
      [
        23,
        7
      ],
      [
        37,
        9
      ]
    ],
    "roof": "saffrongate-offset-terraced-starwells"
  },
  {
    "t": "schoolhouse",
    "b": "snow",
    "s": "medium",
    "variant": 1,
    "title": "Frostbridge Winter Rescue Academy Annex",
    "dim": [
      49,
      17,
      47
    ],
    "r": [
      [
        18,
        27,
        1,
        44
      ],
      [
        4,
        19,
        8,
        24
      ],
      [
        26,
        43,
        18,
        35
      ],
      [
        11,
        36,
        38,
        45
      ]
    ],
    "e": [
      23,
      1
    ],
    "rooms": [
      [
        "classroom",
        10,
        16
      ],
      [
        "shared-study",
        36,
        27
      ],
      [
        "teacher-area",
        22,
        7
      ],
      [
        "winter-reading-room",
        20,
        41
      ],
      [
        "rescue-training-hall",
        22,
        29
      ]
    ],
    "div": [
      [
        "x",
        26,
        18,
        34,
        27
      ]
    ],
    "peak": [
      [
        10,
        16
      ],
      [
        36,
        27
      ],
      [
        20,
        41
      ],
      [
        23,
        8
      ]
    ],
    "roof": "frostbridge-multiple-snow-shed-lantern-pitches"
  },
  {
    "t": "schoolhouse",
    "b": "enchanted-forest",
    "s": "medium",
    "variant": 1,
    "title": "Mosslight Three-Grove Living School",
    "dim": [
      49,
      17,
      46
    ],
    "r": [
      [
        19,
        28,
        1,
        42
      ],
      [
        11,
        39,
        24,
        28
      ]
    ],
    "discs": [
      [
        23,
        10,
        8,
        8
      ],
      [
        9,
        30,
        7,
        7
      ],
      [
        39,
        30,
        8,
        8
      ]
    ],
    "holes": [
      [
        23,
        30,
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
        "classroom",
        23,
        10
      ],
      [
        "shared-study",
        9,
        30
      ],
      [
        "teacher-area",
        23,
        20
      ],
      [
        "botanical-studio",
        39,
        30
      ],
      [
        "story-lantern-hall",
        23,
        37
      ]
    ],
    "div": [
      [
        "z",
        26,
        18,
        35,
        23
      ]
    ],
    "peak": [
      [
        23,
        10
      ],
      [
        9,
        30
      ],
      [
        39,
        30
      ],
      [
        23,
        37
      ]
    ],
    "roof": "mosslight-three-petal-crowned-study-naves"
  },
  {
    "t": "schoolhouse",
    "b": "mountain",
    "s": "large",
    "variant": 1,
    "title": "Stonehaven Surveyors Six-Hall College",
    "dim": [
      68,
      20,
      66
    ],
    "r": [
      [
        27,
        37,
        1,
        63
      ],
      [
        4,
        28,
        7,
        26
      ],
      [
        36,
        61,
        24,
        45
      ],
      [
        12,
        29,
        42,
        61
      ],
      [
        41,
        63,
        49,
        62
      ],
      [
        34,
        45,
        53,
        57
      ]
    ],
    "holes": [
      [
        48,
        41,
        3,
        3
      ]
    ],
    "e": [
      32,
      1
    ],
    "rooms": [
      [
        "classroom",
        12,
        16
      ],
      [
        "shared-study",
        50,
        33
      ],
      [
        "teacher-area",
        32,
        7
      ],
      [
        "cartography-room",
        20,
        52
      ],
      [
        "ridge-survey-studio",
        53,
        56
      ],
      [
        "geology-class",
        32,
        33
      ]
    ],
    "div": [
      [
        "x",
        37,
        28,
        41,
        34
      ]
    ],
    "peak": [
      [
        13,
        16
      ],
      [
        50,
        33
      ],
      [
        20,
        52
      ],
      [
        53,
        56
      ],
      [
        32,
        7
      ]
    ],
    "roof": "stonehaven-six-hall-ascending-quarry-gables"
  }
]);
export const M3_SCHOOLHOUSES_SECOND5=Object.freeze(PLANS.map(p=>{
 const base=buildDistinctive4B(p);
 const result={...base,provenance:{...base.provenance,milestone:'M3',source:'Roadmap C M3 schoolhouses Wave 2 original source-coordinate architecture',method:'individually authored nonrectangular wings, daylight voids, regional roof peaks, functional classrooms, full original producer candidate ABI'}};
 validateBlueprint(result);return Object.freeze(result);
}));
export const M3_148_ALL=Object.freeze([...M3_143_ALL,...M3_SCHOOLHOUSES_SECOND5]);
export const M3_148_CENSUS=Object.freeze({newModels:5,authored:M3_148_ALL.length,remaining:285-M3_148_ALL.length,schoolhouses:M3_148_ALL.filter(b=>b.type==='schoolhouse').length,fingerprints:new Set(M3_148_ALL.map(geometrySignature)).size,creatorApproved:0,integrated:0,worldPlaced:0});
validateCollection(M3_148_ALL);
if(M3_148_CENSUS.authored!==148||M3_148_CENSUS.schoolhouses!==11||M3_148_CENSUS.fingerprints!==148)throw Error('Roadmap C Wave2 school source census/uniqueness contract failed');
export const M3_SCHOOLHOUSES_SECOND5_NAMES=Object.freeze(PLANS.map(p=>p.title));
