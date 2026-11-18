// Roadmap C original Builder 1A Wave14, seven-room mountain manor, previous 269 immutable.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE14_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 16,
    "title": "Cliffbell Lantern Hearth Mountain Manor",
    "w": 46,
    "d": 44,
    "plan": "cliffbell-split-terrace-lantern-manor-northfork-rooftop-hospitality",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        21,
        12,
        43
      ],
      [
        31,
        0,
        45,
        11
      ],
      [
        37,
        35,
        45,
        43
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        20
      ],
      [
        29,
        12,
        29,
        31
      ],
      [
        17,
        22,
        29,
        22
      ],
      [
        17,
        34,
        29,
        34
      ],
      [
        3,
        13,
        16,
        13
      ],
      [
        30,
        23,
        43,
        23
      ]
    ],
    "entry": [
      22,
      1,
      "upper-passage"
    ],
    "rooms": [
      {
        "id": "upper-passage",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          29,
          4,
          21
        ]
      },
      {
        "id": "stone-bar",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          13
        ]
      },
      {
        "id": "fireplace-hall",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          17,
          4,
          20
        ]
      },
      {
        "id": "alpine-kitchen",
        "min": [
          30,
          1,
          12
        ],
        "max": [
          44,
          4,
          23
        ]
      },
      {
        "id": "rear-food-cellar",
        "min": [
          30,
          1,
          24
        ],
        "max": [
          44,
          4,
          34
        ]
      },
      {
        "id": "rear-hearth-commons",
        "min": [
          17,
          1,
          23
        ],
        "max": [
          29,
          4,
          34
        ]
      },
      {
        "id": "traveler-bunkroom",
        "min": [
          17,
          1,
          35
        ],
        "max": [
          36,
          4,
          43
        ]
      }
    ],
    "doors": [
      {
        "at": [
          17,
          1,
          8
        ],
        "from": "upper-passage",
        "to": "stone-bar"
      },
      {
        "at": [
          17,
          1,
          17
        ],
        "from": "upper-passage",
        "to": "fireplace-hall"
      },
      {
        "at": [
          29,
          1,
          17
        ],
        "from": "upper-passage",
        "to": "alpine-kitchen"
      },
      {
        "at": [
          29,
          1,
          28
        ],
        "from": "rear-hearth-commons",
        "to": "rear-food-cellar"
      },
      {
        "at": [
          23,
          1,
          22
        ],
        "from": "upper-passage",
        "to": "rear-hearth-commons"
      },
      {
        "at": [
          23,
          1,
          34
        ],
        "from": "rear-hearth-commons",
        "to": "traveler-bunkroom"
      },
      {
        "at": [
          9,
          1,
          13
        ],
        "from": "stone-bar",
        "to": "fireplace-hall"
      },
      {
        "at": [
          36,
          1,
          23
        ],
        "from": "alpine-kitchen",
        "to": "rear-food-cellar"
      }
    ],
    "windows": [
      [
        6,
        1,
        "north"
      ],
      [
        25,
        1,
        "north"
      ],
      [
        1,
        10,
        "west"
      ],
      [
        44,
        17,
        "east"
      ],
      [
        44,
        29,
        "east"
      ],
      [
        25,
        42,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 6,
        "z": 7,
        "room": "stone-bar",
        "asset": "pack4:059"
      },
      {
        "x": 6,
        "z": 17,
        "room": "fireplace-hall",
        "asset": "pack4:064"
      },
      {
        "x": 22,
        "z": 7,
        "room": "upper-passage",
        "asset": "pack4:058"
      },
      {
        "x": 34,
        "z": 17,
        "room": "alpine-kitchen",
        "asset": "pack5:084"
      },
      {
        "x": 35,
        "z": 28,
        "room": "rear-food-cellar",
        "asset": "pack4:058"
      },
      {
        "x": 22,
        "z": 28,
        "room": "rear-hearth-commons",
        "asset": "pack4:064"
      },
      {
        "x": 20,
        "z": 38,
        "room": "traveler-bunkroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 25,
        "z": 38,
        "room": "traveler-bunkroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-front-lantern-hip",
        "rect": [
          0,
          0,
          17,
          13
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "main-hall-beacon-ridge",
        "rect": [
          18,
          0,
          30,
          21
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "western-inner-hearth",
        "rect": [
          0,
          14,
          16,
          20
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "east-stair-kitchen-roof",
        "rect": [
          30,
          11,
          45,
          23
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "eastern-storehouse-ridge",
        "rect": [
          30,
          24,
          45,
          34
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "heart-courtyard-sawtooth",
        "rect": [
          13,
          22,
          29,
          34
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "bunkhouse-upper-deck",
        "rect": [
          14,
          35,
          36,
          43
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      5,
      26
    ],
    "detail": "Seven genuinely partitioned mountain manor rooms, eight original internal portals, seven independent supported pitched roofs and two full Pack5 adjacent two-cell guest-bed reservations"
  }
]);
export const ROADMAP_C_1A_WAVE14_IDS=Object.freeze(ROADMAP_C_1A_WAVE14_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave14(){return ROADMAP_C_1A_WAVE14_SPECS.map(compileM2ArchitecturalSpec);}
