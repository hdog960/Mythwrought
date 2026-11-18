// Roadmap C 1A Wave13 — new original Coppersand medium desert U-court residence.
// No change to any of 268 previously accepted source-authored objects.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE13_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "desert",
    "size": "medium",
    "index": 16,
    "title": "Coppersand Windcatcher Court House",
    "w": 39,
    "d": 38,
    "plan": "coppersand-twin-limestone-windcatchers-deep-terraced-u-shape-with-six-functional-rooms",
    "roof": "terrace",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        24,
        11,
        37
      ],
      [
        27,
        0,
        38,
        8
      ],
      [
        32,
        31,
        38,
        37
      ]
    ],
    "segments": [
      [
        13,
        2,
        13,
        24
      ],
      [
        26,
        9,
        26,
        25
      ],
      [
        14,
        13,
        25,
        13
      ],
      [
        14,
        26,
        25,
        26
      ]
    ],
    "entry": [
      18,
      1,
      "north-arrival-foyer"
    ],
    "rooms": [
      {
        "id": "north-arrival-foyer",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          26,
          4,
          13
        ]
      },
      {
        "id": "indoor-trade-arcade",
        "min": [
          14,
          1,
          14
        ],
        "max": [
          26,
          4,
          26
        ]
      },
      {
        "id": "ceramic-kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          13,
          4,
          13
        ]
      },
      {
        "id": "lampmakers-workshop",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          13,
          4,
          24
        ]
      },
      {
        "id": "windcatcher-guest-quarters",
        "min": [
          27,
          1,
          10
        ],
        "max": [
          37,
          4,
          25
        ]
      },
      {
        "id": "protected-sleeping-loggia",
        "min": [
          14,
          1,
          27
        ],
        "max": [
          26,
          4,
          36
        ]
      }
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          8
        ],
        "from": "north-arrival-foyer",
        "to": "ceramic-kitchen"
      },
      {
        "at": [
          13,
          1,
          19
        ],
        "from": "indoor-trade-arcade",
        "to": "lampmakers-workshop"
      },
      {
        "at": [
          26,
          1,
          18
        ],
        "from": "indoor-trade-arcade",
        "to": "windcatcher-guest-quarters"
      },
      {
        "at": [
          20,
          1,
          13
        ],
        "from": "north-arrival-foyer",
        "to": "indoor-trade-arcade"
      },
      {
        "at": [
          20,
          1,
          26
        ],
        "from": "indoor-trade-arcade",
        "to": "protected-sleeping-loggia"
      }
    ],
    "windows": [
      [
        4,
        1,
        "north"
      ],
      [
        24,
        1,
        "north"
      ],
      [
        1,
        10,
        "west"
      ],
      [
        37,
        17,
        "east"
      ],
      [
        22,
        36,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 7,
        "room": "ceramic-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 19,
        "room": "lampmakers-workshop",
        "asset": "pack5:084"
      },
      {
        "x": 17,
        "z": 6,
        "room": "north-arrival-foyer",
        "asset": "pack4:059"
      },
      {
        "x": 19,
        "z": 20,
        "room": "indoor-trade-arcade",
        "asset": "pack4:058"
      },
      {
        "x": 30,
        "z": 15,
        "room": "windcatcher-guest-quarters",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 18,
        "z": 30,
        "room": "protected-sleeping-loggia",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "north-dry-kitchen-hip",
        "rect": [
          0,
          0,
          13,
          13
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "arrival-windcatcher-stepped-peak",
        "rect": [
          14,
          0,
          26,
          12
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "west-makers-shade",
        "rect": [
          0,
          14,
          13,
          23
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "east-guest-court-shed",
        "rect": [
          27,
          9,
          38,
          25
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "inner-circulation-court",
        "rect": [
          14,
          13,
          26,
          26
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "southern-sleeping-terrace",
        "rect": [
          12,
          27,
          31,
          37
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      5,
      23
    ],
    "detail": "Source-authored limestone U-plan with three true concave light courts, active six-room trade/sleep circulations, two real Pack5 adjacent physical bed foot reserves and offset windcatcher roofs"
  }
]);
export const ROADMAP_C_1A_WAVE13_IDS=Object.freeze(ROADMAP_C_1A_WAVE13_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave13(){return ROADMAP_C_1A_WAVE13_SPECS.map(compileM2ArchitecturalSpec);}
