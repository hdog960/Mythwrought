// MYTHWROUGHT Roadmap C Builder 1A Wave17 original Gloamfen Mooncourt House.
// New original source-only draft; does not register, place or approve a structure.
// Authored asymmetrical three-notch footprint, seven connected rooms, literal open
// mooncourt skylight, seven differentiated supported roof wings, two two-cell beds.
// No changes to existing building pools, schemas, historical tests, PWA or saves.
// Native exact-source history/D4/physical Pack AABBs and true Chromium screenshots
// remain required before any formal source acceptance (current total 639/1095).
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE17_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 19,
    "title": "Gloamfen Seven-Gallery Mooncourt House",
    "w": 52,
    "d": 46,
    "plan": "offset-north-arrival-arc-west-willow-guest-and-east-craft-arm-open-mooncourt",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        0,
        11,
        11
      ],
      [
        42,
        0,
        51,
        15
      ],
      [
        0,
        31,
        9,
        45
      ]
    ],
    "segments": [
      [
        18,
        12,
        18,
        33
      ],
      [
        40,
        15,
        40,
        40
      ],
      [
        19,
        15,
        40,
        15
      ],
      [
        19,
        30,
        40,
        30
      ],
      [
        2,
        24,
        18,
        24
      ],
      [
        41,
        26,
        50,
        26
      ]
    ],
    "entry": [
      26,
      1,
      "northern-lantern-gallery"
    ],
    "rooms": [
      {
        "id": "northern-lantern-gallery",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          39,
          4,
          14
        ]
      },
      {
        "id": "western-ferment-kitchen",
        "min": [
          2,
          1,
          12
        ],
        "max": [
          17,
          4,
          24
        ]
      },
      {
        "id": "western-guest-sleepers",
        "min": [
          2,
          1,
          25
        ],
        "max": [
          17,
          4,
          30
        ]
      },
      {
        "id": "bough-gathering-hall",
        "min": [
          19,
          1,
          16
        ],
        "max": [
          39,
          4,
          30
        ]
      },
      {
        "id": "east-moonlit-cartography",
        "min": [
          41,
          1,
          16
        ],
        "max": [
          49,
          4,
          26
        ]
      },
      {
        "id": "east-honeyglass-workroom",
        "min": [
          41,
          1,
          27
        ],
        "max": [
          49,
          4,
          43
        ]
      },
      {
        "id": "rear-mooncourt-gallery",
        "min": [
          11,
          1,
          31
        ],
        "max": [
          39,
          4,
          44
        ]
      }
    ],
    "doors": [
      {
        "at": [
          26,
          1,
          15
        ],
        "from": "northern-lantern-gallery",
        "to": "bough-gathering-hall"
      },
      {
        "at": [
          18,
          1,
          20
        ],
        "from": "bough-gathering-hall",
        "to": "western-ferment-kitchen"
      },
      {
        "at": [
          10,
          1,
          24
        ],
        "from": "western-ferment-kitchen",
        "to": "western-guest-sleepers"
      },
      {
        "at": [
          40,
          1,
          22
        ],
        "from": "bough-gathering-hall",
        "to": "east-moonlit-cartography"
      },
      {
        "at": [
          46,
          1,
          26
        ],
        "from": "east-moonlit-cartography",
        "to": "east-honeyglass-workroom"
      },
      {
        "at": [
          26,
          1,
          30
        ],
        "from": "bough-gathering-hall",
        "to": "rear-mooncourt-gallery"
      },
      {
        "at": [
          18,
          1,
          28
        ],
        "from": "bough-gathering-hall",
        "to": "western-guest-sleepers"
      },
      {
        "at": [
          40,
          1,
          35
        ],
        "from": "rear-mooncourt-gallery",
        "to": "east-honeyglass-workroom"
      }
    ],
    "windows": [
      [
        21,
        1,
        "north"
      ],
      [
        36,
        1,
        "north"
      ],
      [
        1,
        19,
        "west"
      ],
      [
        50,
        20,
        "east"
      ],
      [
        50,
        37,
        "east"
      ],
      [
        25,
        44,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 27,
        "z": 6,
        "room": "northern-lantern-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 17,
        "room": "western-ferment-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 6,
        "z": 27,
        "room": "western-guest-sleepers",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 27,
        "room": "western-guest-sleepers",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 23,
        "room": "bough-gathering-hall",
        "asset": "pack4:058"
      },
      {
        "x": 45,
        "z": 20,
        "room": "east-moonlit-cartography",
        "asset": "pack5:084"
      },
      {
        "x": 45,
        "z": 32,
        "room": "east-honeyglass-workroom",
        "asset": "pack4:064"
      },
      {
        "x": 36,
        "z": 38,
        "room": "rear-mooncourt-gallery",
        "asset": "pack4:059"
      }
    ],
    "roofWings": [
      {
        "name": "western-willow-kitchen-vault",
        "rect": [
          0,
          12,
          18,
          24
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "western-guest-sleeper-crosspitch",
        "rect": [
          0,
          25,
          18,
          30
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "north-arrival-lantern-ridge",
        "rect": [
          12,
          0,
          41,
          15
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "central-bough-crossed-gable",
        "rect": [
          18,
          16,
          40,
          30
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "east-cartography-vault",
        "rect": [
          41,
          16,
          51,
          26
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-honeyglass-ridge",
        "rect": [
          41,
          27,
          51,
          45
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-mooncourt-cloister",
        "rect": [
          10,
          31,
          40,
          45
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "courtyard": [
      24,
      35,
      32,
      41
    ],
    "posts": [
      20,
      34
    ],
    "detail": "Seven connected independent rooms, truly absent asymmetrical exterior courts, an open-roof lantern mooncourt, eight hinged internal thresholds, seven differently pitched roof wings, and two physical reserved two-cell guest beds; symbolic source only."
  }
]);
export const ROADMAP_C_1A_WAVE17_IDS=Object.freeze(
 ROADMAP_C_1A_WAVE17_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0'))
);
export function getRoadmapC1AHousesWave17(){return ROADMAP_C_1A_WAVE17_SPECS.map(compileM2ArchitecturalSpec);}
