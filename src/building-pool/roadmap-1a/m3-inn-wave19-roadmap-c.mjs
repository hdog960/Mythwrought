// MYTHWROUGHT Roadmap C Builder 1A Wave19: original Sunveil Windcourt Caravanserai.
// Source-only isolated architecture candidate, no settlement placements, live registration,
// production saves or changes to schema-1. Dedicated desert LARGE inn slot #005.
// 14 source-authored rooms, 22 honest internal thresholds and independent exterior entrance;
// 3 physically absent sand patio voids, 64-column roof-open windcourt, 14 original
// supported roof wings and 5 original Pack5 two-cell guest-bed reservations.
// The original source constructor validates physical placements. Full historical 274-source
// uniqueness/D4 and original Chrome source physical AABB acceptance remain outstanding.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE19_INN_SPECS=Object.freeze([
  {
    "category": "inn",
    "biome": "desert",
    "size": "large",
    "index": 5,
    "title": "Sunveil Windcourt Caravanserai",
    "w": 60,
    "d": 52,
    "plan": "sunveil-interlocking-west-spice-suites-eastern-windcatcher-and-open-air-caravan-court-original",
    "roof": "terrace",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        0,
        13,
        13
      ],
      [
        47,
        20,
        59,
        34
      ],
      [
        0,
        40,
        13,
        51
      ]
    ],
    "segments": [
      [
        20,
        14,
        20,
        49
      ],
      [
        38,
        2,
        38,
        49
      ],
      [
        21,
        14,
        38,
        14
      ],
      [
        21,
        34,
        38,
        34
      ],
      [
        21,
        42,
        38,
        42
      ],
      [
        2,
        21,
        19,
        21
      ],
      [
        2,
        27,
        19,
        27
      ],
      [
        2,
        33,
        19,
        33
      ],
      [
        39,
        10,
        58,
        10
      ],
      [
        39,
        19,
        46,
        19
      ],
      [
        39,
        34,
        46,
        34
      ],
      [
        39,
        43,
        58,
        43
      ],
      [
        14,
        39,
        19,
        39
      ]
    ],
    "entry": [
      29,
      1,
      "arrival-gallery"
    ],
    "rooms": [
      {
        "id": "arrival-gallery",
        "min": [
          21,
          1,
          2
        ],
        "max": [
          38,
          4,
          14
        ]
      },
      {
        "id": "skywatch-traveler-bay",
        "min": [
          39,
          1,
          2
        ],
        "max": [
          58,
          4,
          10
        ]
      },
      {
        "id": "eastern-route-chartroom",
        "min": [
          39,
          1,
          11
        ],
        "max": [
          58,
          4,
          19
        ]
      },
      {
        "id": "west-date-kitchen",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          20,
          4,
          21
        ]
      },
      {
        "id": "west-provision-larder",
        "min": [
          2,
          1,
          22
        ],
        "max": [
          20,
          4,
          27
        ]
      },
      {
        "id": "west-saffron-storeroom",
        "min": [
          2,
          1,
          28
        ],
        "max": [
          20,
          4,
          33
        ]
      },
      {
        "id": "west-quiet-bunks",
        "min": [
          2,
          1,
          34
        ],
        "max": [
          20,
          4,
          39
        ]
      },
      {
        "id": "southwest-sandview-guest-alcove",
        "min": [
          14,
          1,
          40
        ],
        "max": [
          20,
          4,
          50
        ]
      },
      {
        "id": "windcourt-arcade",
        "min": [
          21,
          1,
          15
        ],
        "max": [
          38,
          4,
          34
        ]
      },
      {
        "id": "southern-caravan-commons",
        "min": [
          21,
          1,
          35
        ],
        "max": [
          38,
          4,
          42
        ]
      },
      {
        "id": "south-traveler-suites",
        "min": [
          21,
          1,
          43
        ],
        "max": [
          38,
          4,
          50
        ]
      },
      {
        "id": "eastern-windcatcher-passage",
        "min": [
          39,
          1,
          20
        ],
        "max": [
          46,
          4,
          34
        ]
      },
      {
        "id": "eastern-bath-and-rest-gallery",
        "min": [
          39,
          1,
          35
        ],
        "max": [
          58,
          4,
          43
        ]
      },
      {
        "id": "eastern-evening-bunks",
        "min": [
          39,
          1,
          44
        ],
        "max": [
          58,
          4,
          50
        ]
      }
    ],
    "doors": [
      {
        "at": [
          29,
          1,
          14
        ],
        "from": "arrival-gallery",
        "to": "windcourt-arcade"
      },
      {
        "at": [
          38,
          1,
          6
        ],
        "from": "arrival-gallery",
        "to": "skywatch-traveler-bay"
      },
      {
        "at": [
          38,
          1,
          13
        ],
        "from": "arrival-gallery",
        "to": "eastern-route-chartroom"
      },
      {
        "at": [
          46,
          1,
          10
        ],
        "from": "skywatch-traveler-bay",
        "to": "eastern-route-chartroom"
      },
      {
        "at": [
          42,
          1,
          19
        ],
        "from": "eastern-route-chartroom",
        "to": "eastern-windcatcher-passage"
      },
      {
        "at": [
          38,
          1,
          17
        ],
        "from": "eastern-route-chartroom",
        "to": "windcourt-arcade"
      },
      {
        "at": [
          38,
          1,
          25
        ],
        "from": "windcourt-arcade",
        "to": "eastern-windcatcher-passage"
      },
      {
        "at": [
          42,
          1,
          34
        ],
        "from": "eastern-windcatcher-passage",
        "to": "eastern-bath-and-rest-gallery"
      },
      {
        "at": [
          29,
          1,
          34
        ],
        "from": "windcourt-arcade",
        "to": "southern-caravan-commons"
      },
      {
        "at": [
          29,
          1,
          42
        ],
        "from": "southern-caravan-commons",
        "to": "south-traveler-suites"
      },
      {
        "at": [
          47,
          1,
          43
        ],
        "from": "eastern-bath-and-rest-gallery",
        "to": "eastern-evening-bunks"
      },
      {
        "at": [
          20,
          1,
          17
        ],
        "from": "windcourt-arcade",
        "to": "west-date-kitchen"
      },
      {
        "at": [
          20,
          1,
          24
        ],
        "from": "windcourt-arcade",
        "to": "west-provision-larder"
      },
      {
        "at": [
          20,
          1,
          30
        ],
        "from": "windcourt-arcade",
        "to": "west-saffron-storeroom"
      },
      {
        "at": [
          20,
          1,
          37
        ],
        "from": "southern-caravan-commons",
        "to": "west-quiet-bunks"
      },
      {
        "at": [
          20,
          1,
          45
        ],
        "from": "south-traveler-suites",
        "to": "southwest-sandview-guest-alcove"
      },
      {
        "at": [
          38,
          1,
          38
        ],
        "from": "southern-caravan-commons",
        "to": "eastern-bath-and-rest-gallery"
      },
      {
        "at": [
          38,
          1,
          46
        ],
        "from": "south-traveler-suites",
        "to": "eastern-evening-bunks"
      },
      {
        "at": [
          10,
          1,
          21
        ],
        "from": "west-date-kitchen",
        "to": "west-provision-larder"
      },
      {
        "at": [
          10,
          1,
          27
        ],
        "from": "west-provision-larder",
        "to": "west-saffron-storeroom"
      },
      {
        "at": [
          10,
          1,
          33
        ],
        "from": "west-saffron-storeroom",
        "to": "west-quiet-bunks"
      },
      {
        "at": [
          17,
          1,
          39
        ],
        "from": "west-quiet-bunks",
        "to": "southwest-sandview-guest-alcove"
      }
    ],
    "windows": [
      [
        23,
        1,
        "north"
      ],
      [
        35,
        1,
        "north"
      ],
      [
        53,
        1,
        "north"
      ],
      [
        1,
        17,
        "west"
      ],
      [
        1,
        30,
        "west"
      ],
      [
        14,
        45,
        "west"
      ],
      [
        58,
        6,
        "east"
      ],
      [
        58,
        15,
        "east"
      ],
      [
        46,
        26,
        "east"
      ],
      [
        58,
        39,
        "east"
      ],
      [
        58,
        46,
        "east"
      ],
      [
        27,
        50,
        "south"
      ],
      [
        53,
        50,
        "south"
      ],
      [
        16,
        50,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 25,
        "z": 6,
        "room": "arrival-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 46,
        "z": 5,
        "room": "skywatch-traveler-bay",
        "asset": "pack5:084"
      },
      {
        "x": 47,
        "z": 14,
        "room": "eastern-route-chartroom",
        "asset": "pack4:058"
      },
      {
        "x": 7,
        "z": 17,
        "room": "west-date-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 24,
        "room": "west-provision-larder",
        "asset": "pack4:058"
      },
      {
        "x": 7,
        "z": 30,
        "room": "west-saffron-storeroom",
        "asset": "pack5:084"
      },
      {
        "x": 7,
        "z": 36,
        "room": "west-quiet-bunks",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 13,
        "z": 36,
        "room": "west-quiet-bunks",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 16,
        "z": 44,
        "room": "southwest-sandview-guest-alcove",
        "asset": "pack4:059"
      },
      {
        "x": 23,
        "z": 25,
        "room": "windcourt-arcade",
        "asset": "pack4:059"
      },
      {
        "x": 24,
        "z": 39,
        "room": "southern-caravan-commons",
        "asset": "pack4:064"
      },
      {
        "x": 25,
        "z": 46,
        "room": "south-traveler-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 32,
        "z": 46,
        "room": "south-traveler-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 41,
        "z": 25,
        "room": "eastern-windcatcher-passage",
        "asset": "pack4:058"
      },
      {
        "x": 47,
        "z": 39,
        "room": "eastern-bath-and-rest-gallery",
        "asset": "pack4:064"
      },
      {
        "x": 45,
        "z": 47,
        "room": "eastern-evening-bunks",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "date-kitchen-terrace",
        "rect": [
          0,
          14,
          20,
          21
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "saffron-larder-shed",
        "rect": [
          0,
          22,
          20,
          27
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "shaded-storeroom-crosspitch",
        "rect": [
          0,
          28,
          20,
          33
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "western-bunks-vault",
        "rect": [
          0,
          34,
          20,
          39
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "sandview-guest-canopy",
        "rect": [
          14,
          40,
          20,
          51
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "northern-caravan-entry-beacon",
        "rect": [
          14,
          0,
          38,
          14
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-skywatch-gallery",
        "rect": [
          39,
          0,
          59,
          10
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "east-route-maps-butterfly",
        "rect": [
          39,
          11,
          59,
          19
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "court-inward-shaded-arcades",
        "rect": [
          21,
          15,
          38,
          34
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "windcatcher-lane-ridge",
        "rect": [
          39,
          20,
          46,
          34
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "south-caravan-commons-veranda",
        "rect": [
          21,
          35,
          38,
          42
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "south-sleeping-suite-canopy",
        "rect": [
          21,
          43,
          38,
          51
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "east-rest-gallery-hip",
        "rect": [
          39,
          35,
          59,
          43
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "east-night-bunk-pitched-roof",
        "rect": [
          39,
          44,
          59,
          51
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "courtyard": [
      26,
      21,
      33,
      28
    ],
    "posts": [
      18,
      40
    ],
    "detail": "Original desert caravanserai inn with fourteen independently connected physically partitioned rooms, five west spice-and-rest functions, east stone windcatcher lane adjoining a real 195-cell dune courtyard cutout, 64-column roof-open shaded arcaded court, fourteen individual roof masses, five double-cell reserved guest beds, three actual exterior missing sand terraces, fourteen Pack4 glazed source openings, and 22 interior door thresholds. Source-only, no settlements or world edits."
  }
]);
export const ROADMAP_C_1A_WAVE19_INN_IDS=Object.freeze(
 ROADMAP_C_1A_WAVE19_INN_SPECS.map(x=>'r1:'+x.category+':'+x.biome+':'+x.size+':'+String(x.index).padStart(3,'0'))
);
export function getRoadmapC1AInnWave19(){return ROADMAP_C_1A_WAVE19_INN_SPECS.map(compileM2ArchitecturalSpec);}
