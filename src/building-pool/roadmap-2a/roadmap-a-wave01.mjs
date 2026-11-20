// MYTHWROUGHT Roadmap A — commerce Wave 01: ten independently specified source designs.
// Staged proposals only: no production registration, save changes or creature/economy mechanics.
// Protected historical 128 building geometries are consumed read-only.
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const ROADMAP_A_WAVE01_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "temperate",
    "size": "small",
    "variation": 5,
    "name": "Willowbank Switchback Trading Post",
    "w": 40,
    "d": 36,
    "h": 10,
    "entry": 19,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        5,
        34,
        0,
        12
      ],
      [
        0,
        15,
        10,
        30
      ],
      [
        12,
        29,
        20,
        35
      ],
      [
        26,
        39,
        14,
        29
      ],
      [
        17,
        24,
        12,
        23
      ]
    ],
    "cuts": [
      [
        17,
        22,
        15,
        17
      ]
    ],
    "anchors": [
      [
        19,
        5
      ],
      [
        8,
        19
      ],
      [
        34,
        22
      ],
      [
        21,
        30
      ]
    ],
    "fixtures": [
      [
        23,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        9,
        21,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        32,
        24,
        "pack5:087",
        null,
        "specialist-display"
      ],
      [
        22,
        32,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          34,
          0,
          12
        ],
        "x",
        6,
        "front-roof",
        "gable"
      ],
      [
        [
          0,
          15,
          10,
          30
        ],
        "z",
        5,
        "western-arcade",
        "saw"
      ],
      [
        [
          26,
          39,
          14,
          29
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "terrace"
      ],
      [
        [
          12,
          29,
          20,
          35
        ],
        "z",
        5,
        "rear-utility-roof",
        "tower"
      ]
    ]
  },
  {
    "category": "general-store",
    "biome": "mountain",
    "size": "medium",
    "variation": 5,
    "name": "Stonepass Terraced Exchange",
    "w": 43,
    "d": 39,
    "h": 11,
    "entry": 21,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        4,
        38,
        0,
        13
      ],
      [
        0,
        18,
        9,
        30
      ],
      [
        12,
        35,
        25,
        38
      ],
      [
        30,
        42,
        12,
        35
      ],
      [
        14,
        32,
        14,
        30
      ]
    ],
    "cuts": [
      [
        20,
        25,
        18,
        22
      ]
    ],
    "anchors": [
      [
        21,
        5
      ],
      [
        8,
        20
      ],
      [
        36,
        23
      ],
      [
        24,
        34
      ]
    ],
    "fixtures": [
      [
        25,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        9,
        22,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        34,
        25,
        "pack5:087",
        null,
        "specialist-display"
      ],
      [
        25,
        36,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          38,
          0,
          13
        ],
        "x",
        6,
        "front-roof",
        "terrace"
      ],
      [
        [
          0,
          18,
          9,
          30
        ],
        "z",
        5,
        "western-arcade",
        "gable"
      ],
      [
        [
          30,
          42,
          12,
          35
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "tower"
      ],
      [
        [
          12,
          35,
          25,
          38
        ],
        "z",
        5,
        "rear-utility-roof",
        "saw"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "snow",
    "size": "medium",
    "variation": 5,
    "name": "Snowbell Sheltered Stallhouse",
    "w": 42,
    "d": 40,
    "h": 11,
    "entry": 20,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        5,
        36,
        0,
        11
      ],
      [
        0,
        17,
        10,
        33
      ],
      [
        10,
        30,
        27,
        39
      ],
      [
        26,
        41,
        15,
        36
      ],
      [
        12,
        29,
        11,
        32
      ]
    ],
    "cuts": [
      [
        19,
        23,
        19,
        23
      ]
    ],
    "anchors": [
      [
        20,
        5
      ],
      [
        7,
        22
      ],
      [
        34,
        24
      ],
      [
        18,
        34
      ]
    ],
    "fixtures": [
      [
        24,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        8,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "empty-stall-ledger"
      ],
      [
        32,
        26,
        "pack5:087",
        null,
        "unoccupied-animal-display"
      ],
      [
        19,
        36,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          36,
          0,
          11
        ],
        "x",
        6,
        "front-roof",
        "saw"
      ],
      [
        [
          0,
          17,
          10,
          33
        ],
        "z",
        5,
        "western-arcade",
        "gable"
      ],
      [
        [
          26,
          41,
          15,
          36
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "tower"
      ],
      [
        [
          10,
          30,
          27,
          39
        ],
        "z",
        5,
        "rear-utility-roof",
        "terrace"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "temperate",
    "size": "large",
    "variation": 5,
    "name": "Brindleford Garden Companion House",
    "w": 48,
    "d": 45,
    "h": 11,
    "entry": 23,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        4,
        43,
        0,
        12
      ],
      [
        0,
        18,
        8,
        39
      ],
      [
        8,
        39,
        33,
        44
      ],
      [
        32,
        47,
        14,
        40
      ],
      [
        14,
        37,
        12,
        36
      ]
    ],
    "cuts": [
      [
        22,
        28,
        20,
        27
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        8,
        24
      ],
      [
        40,
        27
      ],
      [
        17,
        40
      ]
    ],
    "fixtures": [
      [
        27,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        9,
        26,
        "pack5:091",
        "cartographers-oak-desk",
        "empty-stall-ledger"
      ],
      [
        38,
        29,
        "pack5:087",
        null,
        "unoccupied-animal-display"
      ],
      [
        18,
        42,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          43,
          0,
          12
        ],
        "x",
        6,
        "front-roof",
        "gable"
      ],
      [
        [
          0,
          18,
          8,
          39
        ],
        "z",
        5,
        "western-arcade",
        "tower"
      ],
      [
        [
          32,
          47,
          14,
          40
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "terrace"
      ],
      [
        [
          8,
          39,
          33,
          44
        ],
        "z",
        5,
        "rear-utility-roof",
        "saw"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "desert",
    "size": "small",
    "variation": 5,
    "name": "Sundial Arcane Courtyard",
    "w": 39,
    "d": 38,
    "h": 10,
    "entry": 18,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        4,
        34,
        0,
        11
      ],
      [
        0,
        16,
        10,
        28
      ],
      [
        11,
        29,
        27,
        37
      ],
      [
        25,
        38,
        11,
        32
      ],
      [
        12,
        30,
        17,
        30
      ]
    ],
    "cuts": [
      [
        19,
        22,
        22,
        24
      ]
    ],
    "anchors": [
      [
        18,
        6
      ],
      [
        7,
        19
      ],
      [
        32,
        20
      ],
      [
        19,
        33
      ]
    ],
    "fixtures": [
      [
        22,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        8,
        21,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        30,
        22,
        "pack5:093",
        null,
        "specialist-display"
      ],
      [
        20,
        35,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          34,
          0,
          11
        ],
        "x",
        6,
        "front-roof",
        "terrace"
      ],
      [
        [
          0,
          16,
          10,
          28
        ],
        "z",
        5,
        "western-arcade",
        "saw"
      ],
      [
        [
          25,
          38,
          11,
          32
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "gable"
      ],
      [
        [
          11,
          29,
          27,
          37
        ],
        "z",
        5,
        "rear-utility-roof",
        "tower"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "mountain",
    "size": "medium",
    "variation": 5,
    "name": "Glasspeak Astral Gallery",
    "w": 46,
    "d": 42,
    "h": 12,
    "entry": 22,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        4,
        41,
        0,
        13
      ],
      [
        0,
        21,
        11,
        37
      ],
      [
        13,
        35,
        29,
        41
      ],
      [
        33,
        45,
        14,
        38
      ],
      [
        16,
        38,
        13,
        34
      ]
    ],
    "cuts": [
      [
        24,
        29,
        19,
        26
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        8,
        22
      ],
      [
        39,
        25
      ],
      [
        22,
        37
      ]
    ],
    "fixtures": [
      [
        26,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        9,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        37,
        27,
        "pack5:093",
        null,
        "specialist-display"
      ],
      [
        23,
        39,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          41,
          0,
          13
        ],
        "x",
        6,
        "front-roof",
        "tower"
      ],
      [
        [
          0,
          21,
          11,
          37
        ],
        "z",
        5,
        "western-arcade",
        "terrace"
      ],
      [
        [
          33,
          45,
          14,
          38
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "saw"
      ],
      [
        [
          13,
          35,
          29,
          41
        ],
        "z",
        5,
        "rear-utility-roof",
        "gable"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "temperate",
    "size": "small",
    "variation": 5,
    "name": "Reedlight Herbworks",
    "w": 41,
    "d": 37,
    "h": 10,
    "entry": 19,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        4,
        36,
        0,
        12
      ],
      [
        0,
        15,
        9,
        29
      ],
      [
        12,
        33,
        24,
        36
      ],
      [
        29,
        40,
        12,
        31
      ],
      [
        11,
        31,
        13,
        28
      ]
    ],
    "cuts": [
      [
        20,
        24,
        18,
        21
      ]
    ],
    "anchors": [
      [
        19,
        6
      ],
      [
        7,
        21
      ],
      [
        34,
        23
      ],
      [
        21,
        32
      ]
    ],
    "fixtures": [
      [
        23,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        8,
        23,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        32,
        25,
        "pack5:089",
        null,
        "specialist-display"
      ],
      [
        22,
        34,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          36,
          0,
          12
        ],
        "x",
        6,
        "front-roof",
        "saw"
      ],
      [
        [
          0,
          15,
          9,
          29
        ],
        "z",
        5,
        "western-arcade",
        "terrace"
      ],
      [
        [
          29,
          40,
          12,
          31
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "gable"
      ],
      [
        [
          12,
          33,
          24,
          36
        ],
        "z",
        5,
        "rear-utility-roof",
        "tower"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 5,
    "name": "Moonroot Tiered Apothecary",
    "w": 45,
    "d": 44,
    "h": 11,
    "entry": 22,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        5,
        40,
        0,
        12
      ],
      [
        0,
        18,
        11,
        38
      ],
      [
        10,
        37,
        31,
        43
      ],
      [
        30,
        44,
        14,
        40
      ],
      [
        13,
        35,
        13,
        35
      ]
    ],
    "cuts": [
      [
        19,
        25,
        22,
        28
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        7,
        24
      ],
      [
        37,
        26
      ],
      [
        20,
        39
      ]
    ],
    "fixtures": [
      [
        26,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        8,
        26,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        35,
        28,
        "pack5:089",
        null,
        "specialist-display"
      ],
      [
        21,
        41,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          40,
          0,
          12
        ],
        "x",
        6,
        "front-roof",
        "gable"
      ],
      [
        [
          0,
          18,
          11,
          38
        ],
        "z",
        5,
        "western-arcade",
        "saw"
      ],
      [
        [
          30,
          44,
          14,
          40
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "tower"
      ],
      [
        [
          10,
          37,
          31,
          43
        ],
        "z",
        5,
        "rear-utility-roof",
        "terrace"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "mountain",
    "size": "medium",
    "variation": 5,
    "name": "Highridge Hearth and Flour Hall",
    "w": 44,
    "d": 41,
    "h": 11,
    "entry": 21,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        4,
        39,
        0,
        12
      ],
      [
        0,
        19,
        10,
        35
      ],
      [
        11,
        34,
        29,
        40
      ],
      [
        31,
        43,
        13,
        37
      ],
      [
        12,
        33,
        13,
        32
      ]
    ],
    "cuts": [
      [
        22,
        27,
        20,
        25
      ]
    ],
    "anchors": [
      [
        21,
        6
      ],
      [
        7,
        22
      ],
      [
        37,
        24
      ],
      [
        19,
        35
      ]
    ],
    "fixtures": [
      [
        25,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        8,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        35,
        26,
        "pack5:085",
        null,
        "specialist-display"
      ],
      [
        20,
        37,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          39,
          0,
          12
        ],
        "x",
        6,
        "front-roof",
        "tower"
      ],
      [
        [
          0,
          19,
          10,
          35
        ],
        "z",
        5,
        "western-arcade",
        "gable"
      ],
      [
        [
          31,
          43,
          13,
          37
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "terrace"
      ],
      [
        [
          11,
          34,
          29,
          40
        ],
        "z",
        5,
        "rear-utility-roof",
        "saw"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "desert",
    "size": "medium",
    "variation": 3,
    "name": "Sunvault Canal Counting House",
    "w": 49,
    "d": 43,
    "h": 12,
    "entry": 24,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        4,
        44,
        0,
        13
      ],
      [
        0,
        19,
        11,
        38
      ],
      [
        9,
        40,
        31,
        42
      ],
      [
        32,
        48,
        13,
        40
      ],
      [
        13,
        39,
        13,
        35
      ]
    ],
    "cuts": [
      [
        21,
        27,
        18,
        25
      ]
    ],
    "anchors": [
      [
        24,
        6
      ],
      [
        8,
        24
      ],
      [
        42,
        33
      ],
      [
        20,
        38
      ]
    ],
    "fixtures": [
      [
        28,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        9,
        26,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        40,
        35,
        "pack5:094",
        "citadel-ironbound-leaves",
        "specialist-display"
      ],
      [
        21,
        40,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          44,
          0,
          13
        ],
        "x",
        6,
        "front-roof",
        "terrace"
      ],
      [
        [
          0,
          19,
          11,
          38
        ],
        "z",
        5,
        "western-arcade",
        "tower"
      ],
      [
        [
          32,
          48,
          13,
          40
        ],
        "x",
        4,
        "eastern-specialist-terrace",
        "saw"
      ],
      [
        [
          9,
          40,
          31,
          42
        ],
        "z",
        5,
        "rear-utility-roof",
        "gable"
      ]
    ],
    "vault": [
      36,
      46,
      28,
      39,
      31,
      32
    ]
  }
]);
export const ROADMAP_A_WAVE01_SHOPS=Object.freeze(ROADMAP_A_WAVE01_SPECS.map(s=>{
 const b=author2ALandmark(s);
 validateBlueprint(b);
 return b;
}));
export const ROADMAP_A_WAVE01_IDS=Object.freeze(ROADMAP_A_WAVE01_SHOPS.map(b=>b.id));
