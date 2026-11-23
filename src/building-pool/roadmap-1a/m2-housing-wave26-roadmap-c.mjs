// MYTHWROUGHT Roadmap C Builder 1A #649 / Wave26: Skyrift Three-Void Lantern Manor.
// Genuine new original mountain LARGE house index 018; AUTHOR SOURCE ONLY / UNREGISTERED.
// Literal original mountain source: 15 rooms, 22 2-high portals, three physically absent
// cliffside court cuts, a 64-cell grounded roof-open mosaic courtyard, fifteen
// physically backed roof wings, valid original Pack1 stone and Pack3 roofing,
// 25 true exterior Pack4 glazing openings and four two-cell original Pack5 beds.
// No settlement placement, main/other developer edits, saves/schema/live gameplay/CI changes.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE26_HOUSE_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 18,
    "title": "Skyrift Three-Void Lantern Manor",
    "w": 74,
    "d": 68,
    "plan": "mountain-three-unequal-edge-voids-separated-two-lantern-fronts-fifteen-linked-ore-glass-skycourt-family-rooms",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        18,
        25
      ],
      [
        57,
        18,
        73,
        39
      ],
      [
        0,
        49,
        25,
        67
      ]
    ],
    "segments": [
      [
        26,
        2,
        26,
        47
      ],
      [
        40,
        2,
        40,
        65
      ],
      [
        56,
        2,
        56,
        16
      ],
      [
        27,
        18,
        55,
        18
      ],
      [
        27,
        37,
        55,
        37
      ],
      [
        27,
        53,
        55,
        53
      ],
      [
        20,
        14,
        25,
        14
      ],
      [
        2,
        26,
        25,
        26
      ],
      [
        2,
        37,
        25,
        37
      ],
      [
        56,
        40,
        56,
        65
      ],
      [
        57,
        53,
        72,
        53
      ]
    ],
    "entry": [
      38,
      1,
      "north-sentinel-entry"
    ],
    "doors": [
      {
        "at": [
          40,
          1,
          9
        ],
        "from": "north-sentinel-entry",
        "to": "east-dawn-bell-hall"
      },
      {
        "at": [
          26,
          1,
          8
        ],
        "from": "north-sentinel-entry",
        "to": "west-front-survey"
      },
      {
        "at": [
          22,
          1,
          14
        ],
        "from": "west-front-survey",
        "to": "west-front-tea"
      },
      {
        "at": [
          21,
          1,
          26
        ],
        "from": "west-front-tea",
        "to": "west-bridge-forge"
      },
      {
        "at": [
          26,
          1,
          21
        ],
        "from": "west-front-tea",
        "to": "central-rune-bridge"
      },
      {
        "at": [
          56,
          1,
          9
        ],
        "from": "east-dawn-bell-hall",
        "to": "east-glass-horizon-atelier"
      },
      {
        "at": [
          32,
          1,
          18
        ],
        "from": "north-sentinel-entry",
        "to": "central-rune-bridge"
      },
      {
        "at": [
          48,
          1,
          18
        ],
        "from": "east-dawn-bell-hall",
        "to": "central-beacon-kitchen"
      },
      {
        "at": [
          40,
          1,
          28
        ],
        "from": "central-rune-bridge",
        "to": "central-beacon-kitchen"
      },
      {
        "at": [
          26,
          1,
          31
        ],
        "from": "central-rune-bridge",
        "to": "west-bridge-forge"
      },
      {
        "at": [
          13,
          1,
          37
        ],
        "from": "west-bridge-forge",
        "to": "west-ore-mill-gallery"
      },
      {
        "at": [
          26,
          1,
          43
        ],
        "from": "west-ore-mill-gallery",
        "to": "west-sky-mosaic-court"
      },
      {
        "at": [
          33,
          1,
          37
        ],
        "from": "central-rune-bridge",
        "to": "west-sky-mosaic-court"
      },
      {
        "at": [
          48,
          1,
          37
        ],
        "from": "central-beacon-kitchen",
        "to": "east-basalt-hearth"
      },
      {
        "at": [
          40,
          1,
          44
        ],
        "from": "west-sky-mosaic-court",
        "to": "east-basalt-hearth"
      },
      {
        "at": [
          33,
          1,
          53
        ],
        "from": "west-sky-mosaic-court",
        "to": "northpeak-sleeping"
      },
      {
        "at": [
          48,
          1,
          53
        ],
        "from": "east-basalt-hearth",
        "to": "easthearth-sleeping"
      },
      {
        "at": [
          40,
          1,
          59
        ],
        "from": "northpeak-sleeping",
        "to": "easthearth-sleeping"
      },
      {
        "at": [
          56,
          1,
          45
        ],
        "from": "east-basalt-hearth",
        "to": "east-windrose-lenswork"
      },
      {
        "at": [
          56,
          1,
          60
        ],
        "from": "easthearth-sleeping",
        "to": "east-ridge-guest-room"
      },
      {
        "at": [
          64,
          1,
          53
        ],
        "from": "east-windrose-lenswork",
        "to": "east-ridge-guest-room"
      }
    ],
    "rooms": [
      {
        "id": "north-sentinel-entry",
        "min": [
          27,
          1,
          2
        ],
        "max": [
          40,
          4,
          18
        ]
      },
      {
        "id": "east-dawn-bell-hall",
        "min": [
          41,
          1,
          2
        ],
        "max": [
          56,
          4,
          18
        ]
      },
      {
        "id": "west-front-survey",
        "min": [
          20,
          1,
          2
        ],
        "max": [
          26,
          4,
          14
        ]
      },
      {
        "id": "west-front-tea",
        "min": [
          20,
          1,
          15
        ],
        "max": [
          26,
          4,
          26
        ]
      },
      {
        "id": "east-glass-horizon-atelier",
        "min": [
          57,
          1,
          2
        ],
        "max": [
          72,
          4,
          17
        ]
      },
      {
        "id": "west-bridge-forge",
        "min": [
          2,
          1,
          27
        ],
        "max": [
          26,
          4,
          37
        ]
      },
      {
        "id": "west-ore-mill-gallery",
        "min": [
          2,
          1,
          38
        ],
        "max": [
          26,
          4,
          48
        ]
      },
      {
        "id": "central-rune-bridge",
        "min": [
          27,
          1,
          19
        ],
        "max": [
          40,
          4,
          37
        ]
      },
      {
        "id": "central-beacon-kitchen",
        "min": [
          41,
          1,
          19
        ],
        "max": [
          56,
          4,
          37
        ]
      },
      {
        "id": "west-sky-mosaic-court",
        "min": [
          27,
          1,
          38
        ],
        "max": [
          40,
          4,
          53
        ]
      },
      {
        "id": "east-basalt-hearth",
        "min": [
          41,
          1,
          38
        ],
        "max": [
          56,
          4,
          53
        ]
      },
      {
        "id": "northpeak-sleeping",
        "min": [
          27,
          1,
          54
        ],
        "max": [
          40,
          4,
          66
        ]
      },
      {
        "id": "easthearth-sleeping",
        "min": [
          41,
          1,
          54
        ],
        "max": [
          56,
          4,
          66
        ]
      },
      {
        "id": "east-windrose-lenswork",
        "min": [
          57,
          1,
          41
        ],
        "max": [
          72,
          4,
          53
        ]
      },
      {
        "id": "east-ridge-guest-room",
        "min": [
          57,
          1,
          54
        ],
        "max": [
          72,
          4,
          66
        ]
      }
    ],
    "windows": [
      [
        33,
        1,
        "north"
      ],
      [
        48,
        1,
        "north"
      ],
      [
        22,
        1,
        "north"
      ],
      [
        64,
        1,
        "north"
      ],
      [
        19,
        8,
        "west"
      ],
      [
        19,
        20,
        "west"
      ],
      [
        72,
        8,
        "east"
      ],
      [
        72,
        14,
        "east"
      ],
      [
        1,
        33,
        "west"
      ],
      [
        1,
        44,
        "west"
      ],
      [
        5,
        26,
        "north"
      ],
      [
        11,
        26,
        "north"
      ],
      [
        56,
        22,
        "east"
      ],
      [
        56,
        33,
        "east"
      ],
      [
        26,
        56,
        "west"
      ],
      [
        26,
        63,
        "west"
      ],
      [
        28,
        66,
        "south"
      ],
      [
        38,
        66,
        "south"
      ],
      [
        48,
        66,
        "south"
      ],
      [
        60,
        66,
        "south"
      ],
      [
        70,
        66,
        "south"
      ],
      [
        62,
        40,
        "north"
      ],
      [
        69,
        40,
        "north"
      ],
      [
        72,
        46,
        "east"
      ],
      [
        72,
        59,
        "east"
      ]
    ],
    "courtyard": [
      30,
      41,
      37,
      48
    ],
    "roofWings": [
      {
        "name": "western-sentinel-surveyor-oriel",
        "rect": [
          19,
          0,
          26,
          13
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "western-terrace-tea-gallery",
        "rect": [
          19,
          14,
          26,
          25
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "western-basalt-forge-hall",
        "rect": [
          0,
          26,
          25,
          36
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "western-ore-conduit-vault",
        "rect": [
          0,
          37,
          25,
          48
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "northern-entrance-stone-lantern",
        "rect": [
          26,
          0,
          40,
          17
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "eastern-dawn-bell-skyroof",
        "rect": [
          41,
          0,
          56,
          17
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "eastern-cliff-glass-atelier",
        "rect": [
          57,
          0,
          73,
          17
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "rune-bridge-central-gable",
        "rect": [
          26,
          18,
          40,
          36
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "high-hearth-kitchen-slate",
        "rect": [
          41,
          18,
          56,
          36
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "true-open-mosaic-court-ring",
        "rect": [
          26,
          37,
          40,
          52
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "eastern-basalt-hearth-overhang",
        "rect": [
          41,
          37,
          56,
          52
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "northern-sleeping-slate-rib",
        "rect": [
          26,
          53,
          40,
          67
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "eastern-sleeping-roof",
        "rect": [
          41,
          53,
          56,
          67
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "windrose-optical-terrace",
        "rect": [
          57,
          40,
          73,
          52
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "eastern-guest-platform-gable",
        "rect": [
          57,
          53,
          73,
          67
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "fixtures": [
      {
        "x": 29,
        "z": 7,
        "room": "north-sentinel-entry",
        "asset": "pack4:059"
      },
      {
        "x": 36,
        "z": 12,
        "room": "north-sentinel-entry",
        "asset": "pack4:064"
      },
      {
        "x": 44,
        "z": 7,
        "room": "east-dawn-bell-hall",
        "asset": "pack4:058"
      },
      {
        "x": 52,
        "z": 14,
        "room": "east-dawn-bell-hall",
        "asset": "pack4:059"
      },
      {
        "x": 22,
        "z": 6,
        "room": "west-front-survey",
        "asset": "pack5:084"
      },
      {
        "x": 23,
        "z": 11,
        "room": "west-front-survey",
        "asset": "pack4:058"
      },
      {
        "x": 21,
        "z": 17,
        "room": "west-front-tea",
        "asset": "pack4:064"
      },
      {
        "x": 22,
        "z": 23,
        "room": "west-front-tea",
        "asset": "pack4:059"
      },
      {
        "x": 60,
        "z": 7,
        "room": "east-glass-horizon-atelier",
        "asset": "pack4:058"
      },
      {
        "x": 67,
        "z": 12,
        "room": "east-glass-horizon-atelier",
        "asset": "pack5:084"
      },
      {
        "x": 5,
        "z": 30,
        "room": "west-bridge-forge",
        "asset": "pack4:064"
      },
      {
        "x": 17,
        "z": 34,
        "room": "west-bridge-forge",
        "asset": "pack4:057"
      },
      {
        "x": 6,
        "z": 41,
        "room": "west-ore-mill-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 18,
        "z": 44,
        "room": "west-ore-mill-gallery",
        "asset": "pack4:058"
      },
      {
        "x": 30,
        "z": 22,
        "room": "central-rune-bridge",
        "asset": "pack4:059"
      },
      {
        "x": 37,
        "z": 33,
        "room": "central-rune-bridge",
        "asset": "pack5:084"
      },
      {
        "x": 44,
        "z": 23,
        "room": "central-beacon-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 51,
        "z": 34,
        "room": "central-beacon-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 28,
        "z": 39,
        "room": "west-sky-mosaic-court",
        "asset": "pack4:059"
      },
      {
        "x": 38,
        "z": 51,
        "room": "west-sky-mosaic-court",
        "asset": "pack4:058"
      },
      {
        "x": 44,
        "z": 42,
        "room": "east-basalt-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 51,
        "z": 49,
        "room": "east-basalt-hearth",
        "asset": "pack4:059"
      },
      {
        "x": 29,
        "z": 57,
        "room": "northpeak-sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 35,
        "z": 63,
        "room": "northpeak-sleeping",
        "asset": "pack4:058"
      },
      {
        "x": 44,
        "z": 58,
        "room": "easthearth-sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 51,
        "z": 63,
        "room": "easthearth-sleeping",
        "asset": "pack4:059"
      },
      {
        "x": 60,
        "z": 43,
        "room": "east-windrose-lenswork",
        "asset": "pack5:084"
      },
      {
        "x": 67,
        "z": 49,
        "room": "east-windrose-lenswork",
        "asset": "pack4:058"
      },
      {
        "x": 61,
        "z": 56,
        "room": "east-ridge-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 67,
        "z": 62,
        "room": "east-ridge-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "posts": [
      34,
      45
    ],
    "detail": "Original mountain-stone large manor linked around three wholly absent exterior cliffside voids, double bell entrance, accessible survey and ore galleries, stone-kitchen and ridge lantern family halls, 15 named connected interior rooms and a separately grounded but completely roof-open 64-cell mosaic courtyard. Genuine source-authored Pack1:006 stone walls, Pack3:025 roofs, Pack4:030 glazing voids and four physically reserved original Pack5:082 beds. No approval of bridge structural spans/weather proofing, live world, settlements, iPhone gameplay, collision or schema-1 saves."
  }
]);
export const ROADMAP_C_1A_WAVE26_HOUSE_IDS=Object.freeze(ROADMAP_C_1A_WAVE26_HOUSE_SPECS.map(x=>'r1:'+x.category+':'+x.biome+':'+x.size+':'+String(x.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave26(){return ROADMAP_C_1A_WAVE26_HOUSE_SPECS.map(compileM2ArchitecturalSpec);}
