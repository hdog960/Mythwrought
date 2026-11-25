// MYTHWROUGHT Builder 1A Roadmap C #657 Wave34: Stormcrown Horseshoe Lantern Inn.
// Independent literal source candidate: high north crown, deep southern horseshoe ravine and lodging arms.
// No live registration, settlement placement, schema/saves or old source changes.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE34_INN_SPECS=Object.freeze([
  {
    "category": "inn",
    "biome": "mountain",
    "size": "large",
    "index": 5,
    "title": "Stormcrown Horseshoe Lantern Inn",
    "w": 84,
    "d": 82,
    "plan": "high-north-crown-double-upper-cliff-recesses-southern-horseshoe-sheltered-ravine-and-separate-lodging-arms",
    "roof": "hip",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        15,
        24
      ],
      [
        29,
        57,
        55,
        81
      ],
      [
        65,
        0,
        83,
        15
      ]
    ],
    "segments": [
      [
        16,
        25,
        16,
        26
      ],
      [
        31,
        2,
        31,
        26
      ],
      [
        48,
        2,
        48,
        26
      ],
      [
        64,
        16,
        64,
        26
      ],
      [
        2,
        26,
        81,
        26
      ],
      [
        27,
        27,
        27,
        56
      ],
      [
        56,
        27,
        56,
        56
      ],
      [
        2,
        40,
        81,
        40
      ],
      [
        2,
        56,
        28,
        56
      ],
      [
        56,
        56,
        81,
        56
      ],
      [
        2,
        68,
        27,
        68
      ],
      [
        57,
        68,
        81,
        68
      ]
    ],
    "entry": [
      40,
      1,
      "crown-arrival-nave"
    ],
    "doors": [
      {
        "at": [
          31,
          1,
          10
        ],
        "from": "northwest-gale-library",
        "to": "crown-arrival-nave"
      },
      {
        "at": [
          48,
          1,
          10
        ],
        "from": "crown-arrival-nave",
        "to": "north-horizon-dining"
      },
      {
        "at": [
          64,
          1,
          20
        ],
        "from": "north-horizon-dining",
        "to": "east-ridge-guide-room"
      },
      {
        "at": [
          23,
          1,
          26
        ],
        "from": "northwest-gale-library",
        "to": "western-caravan-gallery"
      },
      {
        "at": [
          40,
          1,
          26
        ],
        "from": "crown-arrival-nave",
        "to": "central-hearth-hall"
      },
      {
        "at": [
          60,
          1,
          26
        ],
        "from": "north-horizon-dining",
        "to": "eastern-music-gallery"
      },
      {
        "at": [
          73,
          1,
          26
        ],
        "from": "east-ridge-guide-room",
        "to": "eastern-music-gallery"
      },
      {
        "at": [
          27,
          1,
          33
        ],
        "from": "western-caravan-gallery",
        "to": "central-hearth-hall"
      },
      {
        "at": [
          56,
          1,
          33
        ],
        "from": "central-hearth-hall",
        "to": "eastern-music-gallery"
      },
      {
        "at": [
          14,
          1,
          40
        ],
        "from": "western-caravan-gallery",
        "to": "west-stone-kitchen"
      },
      {
        "at": [
          40,
          1,
          40
        ],
        "from": "central-hearth-hall",
        "to": "lantern-skycourt"
      },
      {
        "at": [
          70,
          1,
          40
        ],
        "from": "eastern-music-gallery",
        "to": "east-feast-hall"
      },
      {
        "at": [
          27,
          1,
          47
        ],
        "from": "west-stone-kitchen",
        "to": "lantern-skycourt"
      },
      {
        "at": [
          56,
          1,
          47
        ],
        "from": "lantern-skycourt",
        "to": "east-feast-hall"
      },
      {
        "at": [
          14,
          1,
          56
        ],
        "from": "west-stone-kitchen",
        "to": "west-cliffside-lodging"
      },
      {
        "at": [
          70,
          1,
          56
        ],
        "from": "east-feast-hall",
        "to": "east-cliffside-lodging"
      },
      {
        "at": [
          14,
          1,
          68
        ],
        "from": "west-cliffside-lodging",
        "to": "west-end-bunkhouse"
      },
      {
        "at": [
          70,
          1,
          68
        ],
        "from": "east-cliffside-lodging",
        "to": "east-end-bunkhouse"
      }
    ],
    "rooms": [
      {
        "id": "northwest-gale-library",
        "min": [
          17,
          1,
          2
        ],
        "max": [
          31,
          4,
          26
        ]
      },
      {
        "id": "crown-arrival-nave",
        "min": [
          32,
          1,
          2
        ],
        "max": [
          48,
          4,
          26
        ]
      },
      {
        "id": "north-horizon-dining",
        "min": [
          49,
          1,
          2
        ],
        "max": [
          64,
          4,
          26
        ]
      },
      {
        "id": "east-ridge-guide-room",
        "min": [
          65,
          1,
          17
        ],
        "max": [
          82,
          4,
          26
        ]
      },
      {
        "id": "western-caravan-gallery",
        "min": [
          2,
          1,
          27
        ],
        "max": [
          27,
          4,
          40
        ]
      },
      {
        "id": "central-hearth-hall",
        "min": [
          28,
          1,
          27
        ],
        "max": [
          56,
          4,
          40
        ]
      },
      {
        "id": "eastern-music-gallery",
        "min": [
          57,
          1,
          27
        ],
        "max": [
          82,
          4,
          40
        ]
      },
      {
        "id": "west-stone-kitchen",
        "min": [
          2,
          1,
          41
        ],
        "max": [
          27,
          4,
          56
        ]
      },
      {
        "id": "lantern-skycourt",
        "min": [
          28,
          1,
          41
        ],
        "max": [
          56,
          4,
          56
        ]
      },
      {
        "id": "east-feast-hall",
        "min": [
          57,
          1,
          41
        ],
        "max": [
          82,
          4,
          56
        ]
      },
      {
        "id": "west-cliffside-lodging",
        "min": [
          2,
          1,
          57
        ],
        "max": [
          28,
          4,
          68
        ]
      },
      {
        "id": "west-end-bunkhouse",
        "min": [
          2,
          1,
          69
        ],
        "max": [
          28,
          4,
          80
        ]
      },
      {
        "id": "east-cliffside-lodging",
        "min": [
          57,
          1,
          57
        ],
        "max": [
          82,
          4,
          68
        ]
      },
      {
        "id": "east-end-bunkhouse",
        "min": [
          57,
          1,
          69
        ],
        "max": [
          82,
          4,
          80
        ]
      }
    ],
    "windows": [
      [
        21,
        1,
        "north"
      ],
      [
        27,
        1,
        "north"
      ],
      [
        35,
        1,
        "north"
      ],
      [
        45,
        1,
        "north"
      ],
      [
        53,
        1,
        "north"
      ],
      [
        60,
        1,
        "north"
      ],
      [
        16,
        8,
        "west"
      ],
      [
        16,
        19,
        "west"
      ],
      [
        64,
        7,
        "east"
      ],
      [
        64,
        12,
        "east"
      ],
      [
        70,
        16,
        "north"
      ],
      [
        77,
        16,
        "north"
      ],
      [
        82,
        20,
        "east"
      ],
      [
        16,
        5,
        "west"
      ],
      [
        16,
        22,
        "west"
      ],
      [
        1,
        31,
        "west"
      ],
      [
        1,
        36,
        "west"
      ],
      [
        82,
        31,
        "east"
      ],
      [
        82,
        36,
        "east"
      ],
      [
        1,
        46,
        "west"
      ],
      [
        1,
        52,
        "west"
      ],
      [
        82,
        46,
        "east"
      ],
      [
        82,
        52,
        "east"
      ],
      [
        34,
        56,
        "south"
      ],
      [
        42,
        56,
        "south"
      ],
      [
        50,
        56,
        "south"
      ],
      [
        28,
        60,
        "east"
      ],
      [
        28,
        65,
        "east"
      ],
      [
        28,
        72,
        "east"
      ],
      [
        28,
        77,
        "east"
      ],
      [
        56,
        60,
        "west"
      ],
      [
        56,
        65,
        "west"
      ],
      [
        56,
        72,
        "west"
      ],
      [
        56,
        77,
        "west"
      ],
      [
        1,
        61,
        "west"
      ],
      [
        1,
        74,
        "west"
      ],
      [
        82,
        61,
        "east"
      ],
      [
        82,
        74,
        "east"
      ],
      [
        8,
        80,
        "south"
      ],
      [
        21,
        80,
        "south"
      ],
      [
        63,
        80,
        "south"
      ],
      [
        76,
        80,
        "south"
      ]
    ],
    "courtyard": [
      36,
      44,
      46,
      50
    ],
    "roofWings": [
      {
        "name": "northwest-gale-library-roof",
        "rect": [
          17,
          2,
          30,
          25
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "crown-arrival-nave-roof",
        "rect": [
          32,
          2,
          47,
          25
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "north-horizon-dining-roof",
        "rect": [
          49,
          2,
          63,
          25
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "east-ridge-guide-room-roof",
        "rect": [
          65,
          17,
          81,
          25
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "western-caravan-gallery-roof",
        "rect": [
          2,
          27,
          26,
          39
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "central-hearth-hall-roof",
        "rect": [
          28,
          27,
          55,
          39
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "eastern-music-gallery-roof",
        "rect": [
          57,
          27,
          81,
          39
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "west-stone-kitchen-roof",
        "rect": [
          2,
          41,
          26,
          55
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "lantern-skycourt-roof",
        "rect": [
          28,
          41,
          55,
          55
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-feast-hall-roof",
        "rect": [
          57,
          41,
          81,
          55
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "west-cliffside-lodging-roof",
        "rect": [
          2,
          57,
          27,
          67
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-end-bunkhouse-roof",
        "rect": [
          2,
          69,
          27,
          79
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-cliffside-lodging-roof",
        "rect": [
          57,
          57,
          81,
          67
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-end-bunkhouse-roof",
        "rect": [
          57,
          69,
          81,
          79
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "fixtures": [
      {
        "x": 21,
        "z": 5,
        "room": "northwest-gale-library",
        "asset": "pack5:084"
      },
      {
        "x": 26,
        "z": 22,
        "room": "northwest-gale-library",
        "asset": "pack4:058"
      },
      {
        "x": 35,
        "z": 5,
        "room": "crown-arrival-nave",
        "asset": "pack4:059"
      },
      {
        "x": 45,
        "z": 22,
        "room": "crown-arrival-nave",
        "asset": "pack4:064"
      },
      {
        "x": 52,
        "z": 5,
        "room": "north-horizon-dining",
        "asset": "pack4:064"
      },
      {
        "x": 61,
        "z": 22,
        "room": "north-horizon-dining",
        "asset": "pack4:058"
      },
      {
        "x": 68,
        "z": 19,
        "room": "east-ridge-guide-room",
        "asset": "pack4:059"
      },
      {
        "x": 78,
        "z": 23,
        "room": "east-ridge-guide-room",
        "asset": "pack4:057"
      },
      {
        "x": 6,
        "z": 30,
        "room": "western-caravan-gallery",
        "asset": "pack4:058"
      },
      {
        "x": 22,
        "z": 36,
        "room": "western-caravan-gallery",
        "asset": "pack4:064"
      },
      {
        "x": 32,
        "z": 30,
        "room": "central-hearth-hall",
        "asset": "pack4:059"
      },
      {
        "x": 51,
        "z": 37,
        "room": "central-hearth-hall",
        "asset": "pack4:058"
      },
      {
        "x": 60,
        "z": 30,
        "room": "eastern-music-gallery",
        "asset": "pack4:064"
      },
      {
        "x": 78,
        "z": 37,
        "room": "eastern-music-gallery",
        "asset": "pack4:058"
      },
      {
        "x": 5,
        "z": 44,
        "room": "west-stone-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 22,
        "z": 52,
        "room": "west-stone-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 31,
        "z": 44,
        "room": "lantern-skycourt",
        "asset": "pack5:084"
      },
      {
        "x": 52,
        "z": 53,
        "room": "lantern-skycourt",
        "asset": "pack4:058"
      },
      {
        "x": 60,
        "z": 44,
        "room": "east-feast-hall",
        "asset": "pack4:064"
      },
      {
        "x": 78,
        "z": 52,
        "room": "east-feast-hall",
        "asset": "pack4:058"
      },
      {
        "x": 5,
        "z": 59,
        "room": "west-cliffside-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 65,
        "room": "west-cliffside-lodging",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 71,
        "room": "west-end-bunkhouse",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 77,
        "room": "west-end-bunkhouse",
        "asset": "pack4:058"
      },
      {
        "x": 60,
        "z": 59,
        "room": "east-cliffside-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 78,
        "z": 65,
        "room": "east-cliffside-lodging",
        "asset": "pack4:057"
      },
      {
        "x": 60,
        "z": 71,
        "room": "east-end-bunkhouse",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 78,
        "z": 77,
        "room": "east-end-bunkhouse",
        "asset": "pack4:058"
      }
    ],
    "posts": [
      37,
      43
    ],
    "detail": "Independent mountain inn with two north cliff cuts and a deeply recessed south horseshoe ravine, connected common hearth galleries, a physically roof-open lantern skycourt, and two independently walkable south lodging arms. Source-only candidate; no runtime, world placement, settlement, save, structural, collision, weather or final art approval."
  }
]);
export const ROADMAP_C_1A_WAVE34_INN_IDS=Object.freeze(ROADMAP_C_1A_WAVE34_INN_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AInnWave34(){return ROADMAP_C_1A_WAVE34_INN_SPECS.map(compileM2ArchitecturalSpec);}
