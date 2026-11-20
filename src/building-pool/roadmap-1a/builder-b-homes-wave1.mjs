// MYTHWROUGHT Builder B residential/hospitality Wave1. New original coordinate-authored plans only.
// Parent freeze PR #270 source-only accepted 271/450. No previous source object changed.
// These specifications are literal architectural floorplans, not seeded palettes or scaled clones.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const BUILDER_B_HOMES_WAVE1_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "desert",
    "size": "medium",
    "index": 20,
    "title": "Ambercross Two-Court Saltwind Residence",
    "w": 35,
    "d": 30,
    "plan": "east-reaching atrium, protected sun court and low western sleeping wing",
    "roof": "terrace",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        0,
        9,
        12
      ],
      [
        26,
        17,
        34,
        29
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        26
      ],
      [
        11,
        16,
        32,
        16
      ]
    ],
    "entry": [
      23,
      1,
      "sheltered-front-arcade"
    ],
    "rooms": [
      {
        "id": "sheltered-front-arcade",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          33,
          4,
          16
        ]
      },
      {
        "id": "west-wind-library",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          18,
          4,
          16
        ]
      },
      {
        "id": "lower-shade-bedchamber",
        "min": [
          10,
          1,
          17
        ],
        "max": [
          18,
          4,
          28
        ]
      },
      {
        "id": "inner-salt-courtyard-gallery",
        "min": [
          19,
          1,
          17
        ],
        "max": [
          26,
          4,
          28
        ]
      }
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          8
        ],
        "from": "sheltered-front-arcade",
        "to": "west-wind-library"
      },
      {
        "at": [
          23,
          1,
          16
        ],
        "from": "sheltered-front-arcade",
        "to": "inner-salt-courtyard-gallery"
      },
      {
        "at": [
          14,
          1,
          16
        ],
        "from": "west-wind-library",
        "to": "lower-shade-bedchamber"
      },
      {
        "at": [
          18,
          1,
          22
        ],
        "from": "lower-shade-bedchamber",
        "to": "inner-salt-courtyard-gallery"
      }
    ],
    "windows": [
      [
        15,
        1,
        "north"
      ],
      [
        29,
        1,
        "north"
      ],
      [
        10,
        6,
        "west"
      ],
      [
        33,
        9,
        "east"
      ],
      [
        1,
        20,
        "west"
      ],
      [
        20,
        28,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 13,
        "z": 7,
        "room": "west-wind-library",
        "asset": "pack5:084"
      },
      {
        "x": 27,
        "z": 7,
        "room": "sheltered-front-arcade",
        "asset": "pack4:059"
      },
      {
        "x": 12,
        "z": 21,
        "room": "lower-shade-bedchamber",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 22,
        "z": 22,
        "room": "inner-salt-courtyard-gallery",
        "asset": "pack4:064"
      }
    ],
    "roofWings": [
      {
        "name": "front-high-windcatcher",
        "rect": [
          10,
          0,
          34,
          15
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "west-sandshade-slope",
        "rect": [
          0,
          13,
          18,
          29
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "rear-covered-arcade",
        "rect": [
          19,
          16,
          25,
          29
        ],
        "style": "double-hill",
        "raise": 1
      }
    ],
    "posts": [
      14,
      30
    ],
    "detail": "Different-length windcatcher arcade, two genuine open terrain recesses, shaded guest sleeping space and high rear court"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "small",
    "index": 20,
    "title": "Winterbrook Staggered Six-Room Hearthhouse",
    "w": 26,
    "d": 27,
    "plan": "split fireplace hall with staggered cold break rooms and rear bed alcoves",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        7,
        8
      ],
      [
        19,
        18,
        25,
        26
      ]
    ],
    "segments": [
      [
        12,
        2,
        12,
        23
      ],
      [
        8,
        13,
        19,
        13
      ],
      [
        2,
        18,
        18,
        18
      ]
    ],
    "entry": [
      17,
      1,
      "warming-hall"
    ],
    "rooms": [
      {
        "id": "warming-hall",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          24,
          4,
          13
        ]
      },
      {
        "id": "left-snow-mudroom",
        "min": [
          8,
          1,
          2
        ],
        "max": [
          12,
          4,
          13
        ]
      },
      {
        "id": "west-cookhouse",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          12,
          4,
          18
        ]
      },
      {
        "id": "east-fireside-study",
        "min": [
          13,
          1,
          14
        ],
        "max": [
          19,
          4,
          18
        ]
      },
      {
        "id": "rear-sheltered-workshop",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          12,
          4,
          25
        ]
      },
      {
        "id": "rear-quiet-bedroom",
        "min": [
          13,
          1,
          19
        ],
        "max": [
          19,
          4,
          25
        ]
      }
    ],
    "doors": [
      {
        "at": [
          12,
          1,
          7
        ],
        "from": "warming-hall",
        "to": "left-snow-mudroom"
      },
      {
        "at": [
          9,
          1,
          13
        ],
        "from": "left-snow-mudroom",
        "to": "west-cookhouse"
      },
      {
        "at": [
          16,
          1,
          13
        ],
        "from": "warming-hall",
        "to": "east-fireside-study"
      },
      {
        "at": [
          6,
          1,
          18
        ],
        "from": "west-cookhouse",
        "to": "rear-sheltered-workshop"
      },
      {
        "at": [
          16,
          1,
          18
        ],
        "from": "east-fireside-study",
        "to": "rear-quiet-bedroom"
      },
      {
        "at": [
          12,
          1,
          21
        ],
        "from": "rear-sheltered-workshop",
        "to": "rear-quiet-bedroom"
      }
    ],
    "windows": [
      [
        10,
        1,
        "north"
      ],
      [
        23,
        1,
        "north"
      ],
      [
        8,
        5,
        "west"
      ],
      [
        24,
        10,
        "east"
      ],
      [
        1,
        16,
        "west"
      ],
      [
        15,
        25,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 17,
        "z": 7,
        "room": "warming-hall",
        "asset": "pack4:064"
      },
      {
        "x": 10,
        "z": 6,
        "room": "left-snow-mudroom",
        "asset": "pack4:059"
      },
      {
        "x": 6,
        "z": 15,
        "room": "west-cookhouse",
        "asset": "pack4:057"
      },
      {
        "x": 16,
        "z": 15,
        "room": "east-fireside-study",
        "asset": "pack5:084"
      },
      {
        "x": 4,
        "z": 20,
        "room": "rear-sheltered-workshop",
        "asset": "pack4:059"
      },
      {
        "x": 15,
        "z": 20,
        "room": "rear-quiet-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "north-windbreak-high-pitch",
        "rect": [
          8,
          0,
          25,
          12
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-stacked-storehouse",
        "rect": [
          0,
          9,
          12,
          26
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "back-hearth-ridge",
        "rect": [
          13,
          13,
          18,
          26
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      10,
      17
    ],
    "detail": "Real asymmetric frozen porch, six connected winter rooms, two stepped roof ridges and rear quiet sleeping room"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 20,
    "title": "Moonmoss Three-Garden Lantern Longhouse",
    "w": 31,
    "d": 33,
    "plan": "narrow moonlit front cross-court feeding three independent fern galleries",
    "roof": "butterfly",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        0,
        9,
        10
      ],
      [
        22,
        0,
        30,
        8
      ],
      [
        0,
        25,
        8,
        32
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        28
      ],
      [
        10,
        15,
        26,
        15
      ],
      [
        21,
        16,
        21,
        28
      ],
      [
        9,
        24,
        20,
        24
      ]
    ],
    "entry": [
      17,
      1,
      "moonlit-front-gallery"
    ],
    "rooms": [
      {
        "id": "moonlit-front-gallery",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          21,
          4,
          15
        ]
      },
      {
        "id": "fern-morning-study",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          14,
          4,
          15
        ]
      },
      {
        "id": "east-glow-library",
        "min": [
          22,
          1,
          9
        ],
        "max": [
          29,
          4,
          15
        ]
      },
      {
        "id": "west-moss-parlor",
        "min": [
          9,
          1,
          16
        ],
        "max": [
          14,
          4,
          24
        ]
      },
      {
        "id": "heartwood-banquet-gallery",
        "min": [
          15,
          1,
          16
        ],
        "max": [
          21,
          4,
          24
        ]
      },
      {
        "id": "east-sleeping-nook",
        "min": [
          22,
          1,
          16
        ],
        "max": [
          30,
          4,
          29
        ]
      },
      {
        "id": "rear-springwalk",
        "min": [
          9,
          1,
          25
        ],
        "max": [
          21,
          4,
          31
        ]
      }
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          9
        ],
        "from": "moonlit-front-gallery",
        "to": "fern-morning-study"
      },
      {
        "at": [
          18,
          1,
          15
        ],
        "from": "moonlit-front-gallery",
        "to": "heartwood-banquet-gallery"
      },
      {
        "at": [
          12,
          1,
          15
        ],
        "from": "fern-morning-study",
        "to": "west-moss-parlor"
      },
      {
        "at": [
          21,
          1,
          19
        ],
        "from": "heartwood-banquet-gallery",
        "to": "east-sleeping-nook"
      },
      {
        "at": [
          18,
          1,
          24
        ],
        "from": "heartwood-banquet-gallery",
        "to": "rear-springwalk"
      },
      {
        "at": [
          12,
          1,
          24
        ],
        "from": "west-moss-parlor",
        "to": "rear-springwalk"
      },
      {
        "at": [
          25,
          1,
          15
        ],
        "from": "east-glow-library",
        "to": "east-sleeping-nook"
      },
      {
        "at": [
          21,
          1,
          11
        ],
        "from": "moonlit-front-gallery",
        "to": "east-glow-library"
      }
    ],
    "windows": [
      [
        12,
        1,
        "north"
      ],
      [
        19,
        1,
        "north"
      ],
      [
        10,
        6,
        "west"
      ],
      [
        21,
        5,
        "east"
      ],
      [
        29,
        18,
        "east"
      ],
      [
        20,
        31,
        "south"
      ],
      [
        9,
        28,
        "west"
      ]
    ],
    "fixtures": [
      {
        "x": 17,
        "z": 7,
        "room": "moonlit-front-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 11,
        "z": 7,
        "room": "fern-morning-study",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 11,
        "room": "east-glow-library",
        "asset": "pack4:058"
      },
      {
        "x": 11,
        "z": 20,
        "room": "west-moss-parlor",
        "asset": "pack4:064"
      },
      {
        "x": 17,
        "z": 19,
        "room": "heartwood-banquet-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 25,
        "z": 22,
        "room": "east-sleeping-nook",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 16,
        "z": 27,
        "room": "rear-springwalk",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "northern-lantern-spine",
        "rect": [
          10,
          0,
          21,
          15
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-moss-ridge",
        "rect": [
          0,
          11,
          14,
          24
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "eastern-glow-crossroof",
        "rect": [
          22,
          9,
          30,
          29
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "heartwood-clearing-arc",
        "rect": [
          15,
          16,
          21,
          24
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "rear-moongarden-lean",
        "rect": [
          9,
          25,
          30,
          32
        ],
        "style": "long-gable",
        "raise": 1
      }
    ],
    "posts": [
      12,
      19
    ],
    "detail": "Three real absent-ground glades, seven independent connected rooms and off-axis lantern roof geometry"
  }
]);
export const BUILDER_B_HOMES_WAVE1_IDS=Object.freeze(BUILDER_B_HOMES_WAVE1_SPECS.map(s=>
 ['r1',s.category,s.biome,s.size,String(s.index).padStart(3,'0')].join(':')));
export function getBuilderBHomesWave1(){return BUILDER_B_HOMES_WAVE1_SPECS.map(compileM2ArchitecturalSpec);}
