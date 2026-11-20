// MYTHWROUGHT Roadmap A commerce Wave02: nine new independent coordinate-authored candidates.
// SOURCE ONLY, NO PRODUCTION USE. Original 128, Wave01 10, and current catalog are read-only.
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const ROADMAP_A_WAVE02_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "desert",
    "size": "medium",
    "variation": 5,
    "name": "Ochrebank Four-Gate Trading Court",
    "w": 48,
    "d": 43,
    "h": 11,
    "entry": 23,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        4,
        43,
        0,
        14
      ],
      [
        0,
        18,
        11,
        36
      ],
      [
        31,
        47,
        13,
        39
      ],
      [
        6,
        39,
        35,
        42
      ],
      [
        13,
        35,
        16,
        35
      ]
    ],
    "cuts": [
      [
        21,
        27,
        21,
        28
      ]
    ],
    "anchors": [
      [
        23,
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
        17,
        39
      ]
    ],
    "fixtures": [
      [
        27,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        10,
        23,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        37,
        27,
        "pack5:087",
        null,
        "specialist-space"
      ],
      [
        18,
        40,
        "pack4:057",
        null,
        "stock-crate"
      ]
    ],
    "roofs": [
      [
        [
          4,
          43,
          0,
          14
        ],
        "x",
        7,
        "wave02-general-store-roof-1",
        "saw"
      ],
      [
        [
          0,
          18,
          11,
          36
        ],
        "z",
        5,
        "wave02-general-store-roof-2",
        "gable"
      ],
      [
        [
          6,
          39,
          35,
          42
        ],
        "x",
        4,
        "wave02-general-store-roof-3",
        "terrace"
      ],
      [
        [
          31,
          47,
          13,
          39
        ],
        "z",
        6,
        "wave02-general-store-roof-4",
        "tower"
      ]
    ]
  },
  {
    "category": "general-store",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 5,
    "name": "Sablefern Hanging-Arcade Market",
    "w": 46,
    "d": 45,
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
        17,
        9,
        38
      ],
      [
        29,
        45,
        16,
        41
      ],
      [
        9,
        36,
        34,
        44
      ],
      [
        10,
        35,
        14,
        37
      ]
    ],
    "cuts": [
      [
        17,
        28,
        16,
        30
      ]
    ],
    "anchors": [
      [
        22,
        5
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
        40
      ]
    ],
    "fixtures": [
      [
        26,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        9,
        23,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        35,
        26,
        "pack5:087",
        null,
        "specialist-space"
      ],
      [
        20,
        41,
        "pack4:057",
        null,
        "stock-crate"
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
        7,
        "wave02-general-store-roof-1",
        "terrace"
      ],
      [
        [
          0,
          17,
          9,
          38
        ],
        "z",
        5,
        "wave02-general-store-roof-2",
        "saw"
      ],
      [
        [
          9,
          36,
          34,
          44
        ],
        "x",
        4,
        "wave02-general-store-roof-3",
        "tower"
      ],
      [
        [
          29,
          45,
          16,
          41
        ],
        "z",
        6,
        "wave02-general-store-roof-4",
        "gable"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "mountain",
    "size": "small",
    "variation": 5,
    "name": "Granitebrook Sheltered Aviary",
    "w": 43,
    "d": 40,
    "h": 10,
    "entry": 20,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        4,
        38,
        0,
        12
      ],
      [
        0,
        16,
        10,
        34
      ],
      [
        26,
        42,
        12,
        37
      ],
      [
        7,
        33,
        32,
        39
      ],
      [
        15,
        30,
        12,
        30
      ]
    ],
    "cuts": [
      [
        16,
        27,
        16,
        27
      ]
    ],
    "anchors": [
      [
        20,
        5
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
        17,
        35
      ]
    ],
    "fixtures": [
      [
        24,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        9,
        22,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        32,
        25,
        "pack5:087",
        null,
        "specialist-space"
      ],
      [
        18,
        36,
        "pack4:057",
        null,
        "stock-crate"
      ]
    ],
    "roofs": [
      [
        [
          4,
          38,
          0,
          12
        ],
        "x",
        7,
        "wave02-pet-shop-roof-1",
        "gable"
      ],
      [
        [
          0,
          16,
          10,
          34
        ],
        "z",
        5,
        "wave02-pet-shop-roof-2",
        "terrace"
      ],
      [
        [
          7,
          33,
          32,
          39
        ],
        "x",
        4,
        "wave02-pet-shop-roof-3",
        "saw"
      ],
      [
        [
          26,
          42,
          12,
          37
        ],
        "z",
        6,
        "wave02-pet-shop-roof-4",
        "tower"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 5,
    "name": "Glowbranch Companion Sanctuary",
    "w": 53,
    "d": 47,
    "h": 12,
    "entry": 25,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        5,
        48,
        0,
        14
      ],
      [
        0,
        20,
        10,
        42
      ],
      [
        34,
        52,
        14,
        44
      ],
      [
        11,
        43,
        39,
        46
      ],
      [
        14,
        39,
        12,
        38
      ]
    ],
    "cuts": [
      [
        23,
        29,
        22,
        30
      ]
    ],
    "anchors": [
      [
        25,
        6
      ],
      [
        9,
        26
      ],
      [
        44,
        30
      ],
      [
        21,
        42
      ]
    ],
    "fixtures": [
      [
        29,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        11,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        42,
        32,
        "pack5:087",
        null,
        "specialist-space"
      ],
      [
        22,
        43,
        "pack4:057",
        null,
        "stock-crate"
      ]
    ],
    "roofs": [
      [
        [
          5,
          48,
          0,
          14
        ],
        "x",
        7,
        "wave02-pet-shop-roof-1",
        "tower"
      ],
      [
        [
          0,
          20,
          10,
          42
        ],
        "z",
        5,
        "wave02-pet-shop-roof-2",
        "saw"
      ],
      [
        [
          11,
          43,
          39,
          46
        ],
        "x",
        4,
        "wave02-pet-shop-roof-3",
        "gable"
      ],
      [
        [
          34,
          52,
          14,
          44
        ],
        "z",
        6,
        "wave02-pet-shop-roof-4",
        "terrace"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "enchanted-forest",
    "size": "small",
    "variation": 5,
    "name": "Lunarthorn Veiled Enchantery",
    "w": 41,
    "d": 39,
    "h": 11,
    "entry": 19,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        4,
        36,
        0,
        12
      ],
      [
        0,
        16,
        10,
        35
      ],
      [
        26,
        40,
        12,
        36
      ],
      [
        9,
        32,
        31,
        38
      ],
      [
        13,
        31,
        14,
        31
      ]
    ],
    "cuts": [
      [
        19,
        23,
        20,
        25
      ]
    ],
    "anchors": [
      [
        19,
        6
      ],
      [
        8,
        22
      ],
      [
        33,
        22
      ],
      [
        19,
        35
      ]
    ],
    "fixtures": [
      [
        23,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        10,
        23,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        31,
        24,
        "pack5:093",
        null,
        "specialist-space"
      ],
      [
        20,
        36,
        "pack4:057",
        null,
        "stock-crate"
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
        7,
        "wave02-magic-shop-roof-1",
        "saw"
      ],
      [
        [
          0,
          16,
          10,
          35
        ],
        "z",
        5,
        "wave02-magic-shop-roof-2",
        "terrace"
      ],
      [
        [
          9,
          32,
          31,
          38
        ],
        "x",
        4,
        "wave02-magic-shop-roof-3",
        "gable"
      ],
      [
        [
          26,
          40,
          12,
          36
        ],
        "z",
        6,
        "wave02-magic-shop-roof-4",
        "tower"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "snow",
    "size": "large",
    "variation": 5,
    "name": "Frostmere Double-Drying Apothecary",
    "w": 52,
    "d": 46,
    "h": 12,
    "entry": 25,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        4,
        47,
        0,
        15
      ],
      [
        0,
        21,
        12,
        43
      ],
      [
        34,
        51,
        15,
        42
      ],
      [
        12,
        43,
        39,
        45
      ],
      [
        14,
        37,
        16,
        39
      ]
    ],
    "cuts": [
      [
        25,
        30,
        24,
        30
      ]
    ],
    "anchors": [
      [
        25,
        7
      ],
      [
        9,
        26
      ],
      [
        44,
        27
      ],
      [
        20,
        42
      ]
    ],
    "fixtures": [
      [
        29,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        11,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        42,
        29,
        "pack5:089",
        null,
        "specialist-space"
      ],
      [
        21,
        43,
        "pack4:057",
        null,
        "stock-crate"
      ]
    ],
    "roofs": [
      [
        [
          4,
          47,
          0,
          15
        ],
        "x",
        7,
        "wave02-potion-shop-roof-1",
        "tower"
      ],
      [
        [
          0,
          21,
          12,
          43
        ],
        "z",
        5,
        "wave02-potion-shop-roof-2",
        "terrace"
      ],
      [
        [
          12,
          43,
          39,
          45
        ],
        "x",
        4,
        "wave02-potion-shop-roof-3",
        "gable"
      ],
      [
        [
          34,
          51,
          15,
          42
        ],
        "z",
        6,
        "wave02-potion-shop-roof-4",
        "saw"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "desert",
    "size": "large",
    "variation": 5,
    "name": "Amberkiln Grand Bread Pavilion",
    "w": 54,
    "d": 47,
    "h": 11,
    "entry": 26,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        4,
        49,
        0,
        13
      ],
      [
        0,
        22,
        10,
        43
      ],
      [
        35,
        53,
        13,
        45
      ],
      [
        14,
        44,
        40,
        46
      ],
      [
        15,
        37,
        13,
        41
      ]
    ],
    "cuts": [
      [
        24,
        31,
        22,
        28
      ]
    ],
    "anchors": [
      [
        26,
        6
      ],
      [
        9,
        27
      ],
      [
        44,
        30
      ],
      [
        21,
        43
      ]
    ],
    "fixtures": [
      [
        30,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        11,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        42,
        32,
        "pack5:085",
        null,
        "specialist-space"
      ],
      [
        22,
        44,
        "pack4:057",
        null,
        "stock-crate"
      ]
    ],
    "roofs": [
      [
        [
          4,
          49,
          0,
          13
        ],
        "x",
        7,
        "wave02-bakery-roof-1",
        "terrace"
      ],
      [
        [
          0,
          22,
          10,
          43
        ],
        "z",
        5,
        "wave02-bakery-roof-2",
        "tower"
      ],
      [
        [
          14,
          44,
          40,
          46
        ],
        "x",
        4,
        "wave02-bakery-roof-3",
        "gable"
      ],
      [
        [
          35,
          53,
          13,
          45
        ],
        "z",
        6,
        "wave02-bakery-roof-4",
        "saw"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "mountain",
    "size": "medium",
    "variation": 3,
    "name": "Ironridge Switchback Treasury",
    "w": 51,
    "d": 47,
    "h": 12,
    "entry": 24,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        4,
        46,
        0,
        13
      ],
      [
        0,
        19,
        10,
        42
      ],
      [
        33,
        50,
        14,
        44
      ],
      [
        11,
        45,
        41,
        46
      ],
      [
        15,
        42,
        15,
        40
      ]
    ],
    "cuts": [
      [
        22,
        28,
        21,
        27
      ]
    ],
    "anchors": [
      [
        24,
        6
      ],
      [
        9,
        26
      ],
      [
        44,
        33
      ],
      [
        21,
        43
      ]
    ],
    "fixtures": [
      [
        28,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        11,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        42,
        35,
        "pack5:094",
        "citadel-ironbound-leaves",
        "vault-reservation"
      ],
      [
        22,
        44,
        "pack4:057",
        null,
        "stock-crate"
      ]
    ],
    "roofs": [
      [
        [
          4,
          46,
          0,
          13
        ],
        "x",
        7,
        "wave02-bank-roof-1",
        "saw"
      ],
      [
        [
          0,
          19,
          10,
          42
        ],
        "z",
        5,
        "wave02-bank-roof-2",
        "tower"
      ],
      [
        [
          11,
          45,
          41,
          46
        ],
        "x",
        4,
        "wave02-bank-roof-3",
        "terrace"
      ],
      [
        [
          33,
          50,
          14,
          44
        ],
        "z",
        6,
        "wave02-bank-roof-4",
        "gable"
      ]
    ],
    "vault": [
      38,
      48,
      31,
      42,
      34,
      35
    ]
  },
  {
    "category": "bank",
    "biome": "snow",
    "size": "large",
    "variation": 3,
    "name": "Rimecrest Provincial Vault",
    "w": 55,
    "d": 49,
    "h": 12,
    "entry": 26,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        4,
        50,
        0,
        15
      ],
      [
        0,
        22,
        13,
        45
      ],
      [
        36,
        54,
        15,
        46
      ],
      [
        9,
        47,
        43,
        48
      ],
      [
        13,
        44,
        16,
        42
      ]
    ],
    "cuts": [
      [
        22,
        35,
        19,
        33
      ]
    ],
    "anchors": [
      [
        26,
        7
      ],
      [
        10,
        28
      ],
      [
        46,
        36
      ],
      [
        20,
        45
      ]
    ],
    "fixtures": [
      [
        30,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        12,
        29,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        44,
        38,
        "pack5:094",
        "citadel-ironbound-leaves",
        "vault-reservation"
      ],
      [
        21,
        46,
        "pack4:057",
        null,
        "stock-crate"
      ]
    ],
    "roofs": [
      [
        [
          4,
          50,
          0,
          15
        ],
        "x",
        7,
        "wave02-bank-roof-1",
        "tower"
      ],
      [
        [
          0,
          22,
          13,
          45
        ],
        "z",
        5,
        "wave02-bank-roof-2",
        "gable"
      ],
      [
        [
          9,
          47,
          43,
          48
        ],
        "x",
        4,
        "wave02-bank-roof-3",
        "saw"
      ],
      [
        [
          36,
          54,
          15,
          46
        ],
        "z",
        6,
        "wave02-bank-roof-4",
        "terrace"
      ]
    ],
    "vault": [
      41,
      52,
      34,
      45,
      38,
      39
    ]
  }
]);
export const ROADMAP_A_WAVE02_SHOPS=Object.freeze(ROADMAP_A_WAVE02_SPECS.map(s=>{const bp=author2ALandmark(s);validateBlueprint(bp);return bp;}));
export const ROADMAP_A_WAVE02_IDS=Object.freeze(ROADMAP_A_WAVE02_SHOPS.map(b=>b.id));
