// Roadmap A commerce Wave05 — independent original source designs; no production install.
// Parent source 128 + 43 Wave01–04 remain untouched, all 12 candidates provisional.
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const ROADMAP_A_WAVE05_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "desert",
    "size": "small",
    "variation": 5,
    "name": "Scorchwind Canvas Trading Courtyard",
    "w": 47,
    "d": 48,
    "h": 10,
    "entry": 25,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        9,
        41,
        0,
        17
      ],
      [
        0,
        15,
        14,
        38
      ],
      [
        31,
        46,
        16,
        38
      ],
      [
        7,
        43,
        41,
        47
      ],
      [
        18,
        31,
        16,
        43
      ]
    ],
    "cuts": [
      [
        17,
        29,
        20,
        26
      ],
      [
        4,
        8,
        27,
        34
      ]
    ],
    "anchors": [
      [
        25,
        6
      ],
      [
        11,
        27
      ],
      [
        36,
        29
      ],
      [
        20,
        44
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
        13,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        34,
        31,
        "pack5:087",
        null,
        "category-specialty"
      ],
      [
        21,
        45,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          9,
          41,
          0,
          17
        ],
        "x",
        7,
        "Scorchwind Canvas Trading Courtyard main-roof",
        "terrace"
      ],
      [
        [
          0,
          15,
          14,
          38
        ],
        "z",
        5,
        "Scorchwind Canvas Trading Courtyard western-court",
        "saw"
      ],
      [
        [
          7,
          43,
          41,
          47
        ],
        "x",
        6,
        "Scorchwind Canvas Trading Courtyard rear-arcade",
        "tower"
      ],
      [
        [
          31,
          46,
          16,
          38
        ],
        "z",
        4,
        "Scorchwind Canvas Trading Courtyard eastern-gallery",
        "gable"
      ]
    ]
  },
  {
    "category": "general-store",
    "biome": "snow",
    "size": "large",
    "variation": 5,
    "name": "Whitepine Three-Court Guild Exchange",
    "w": 64,
    "d": 55,
    "h": 12,
    "entry": 30,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        17,
        43,
        0,
        17
      ],
      [
        0,
        24,
        14,
        45
      ],
      [
        40,
        63,
        16,
        46
      ],
      [
        11,
        61,
        43,
        54
      ],
      [
        23,
        37,
        16,
        45
      ]
    ],
    "cuts": [
      [
        22,
        33,
        20,
        33
      ],
      [
        1,
        7,
        42,
        48
      ]
    ],
    "anchors": [
      [
        30,
        6
      ],
      [
        11,
        31
      ],
      [
        53,
        33
      ],
      [
        27,
        51
      ]
    ],
    "fixtures": [
      [
        34,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        13,
        32,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        51,
        35,
        "pack5:087",
        null,
        "category-specialty"
      ],
      [
        28,
        52,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          17,
          43,
          0,
          17
        ],
        "x",
        7,
        "Whitepine Three-Court Guild Exchange main-roof",
        "terrace"
      ],
      [
        [
          0,
          24,
          14,
          45
        ],
        "z",
        5,
        "Whitepine Three-Court Guild Exchange western-court",
        "tower"
      ],
      [
        [
          11,
          61,
          43,
          54
        ],
        "x",
        6,
        "Whitepine Three-Court Guild Exchange rear-arcade",
        "saw"
      ],
      [
        [
          40,
          63,
          16,
          46
        ],
        "z",
        4,
        "Whitepine Three-Court Guild Exchange eastern-gallery",
        "gable"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "mountain",
    "size": "large",
    "variation": 5,
    "name": "Cliffhaven Tiered Creature Refuge",
    "w": 64,
    "d": 57,
    "h": 12,
    "entry": 34,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        19,
        49,
        0,
        14
      ],
      [
        0,
        22,
        11,
        52
      ],
      [
        40,
        63,
        13,
        49
      ],
      [
        11,
        59,
        46,
        56
      ],
      [
        25,
        45,
        13,
        48
      ]
    ],
    "cuts": [
      [
        30,
        43,
        19,
        24
      ],
      [
        2,
        9,
        39,
        45
      ]
    ],
    "anchors": [
      [
        34,
        6
      ],
      [
        11,
        33
      ],
      [
        53,
        33
      ],
      [
        32,
        53
      ]
    ],
    "fixtures": [
      [
        38,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        13,
        34,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        51,
        35,
        "pack5:087",
        null,
        "category-specialty"
      ],
      [
        33,
        54,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          19,
          49,
          0,
          14
        ],
        "x",
        7,
        "Cliffhaven Tiered Creature Refuge main-roof",
        "terrace"
      ],
      [
        [
          0,
          22,
          11,
          52
        ],
        "z",
        5,
        "Cliffhaven Tiered Creature Refuge western-court",
        "saw"
      ],
      [
        [
          11,
          59,
          46,
          56
        ],
        "x",
        6,
        "Cliffhaven Tiered Creature Refuge rear-arcade",
        "tower"
      ],
      [
        [
          40,
          63,
          13,
          49
        ],
        "z",
        4,
        "Cliffhaven Tiered Creature Refuge eastern-gallery",
        "gable"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "enchanted-forest",
    "size": "small",
    "variation": 5,
    "name": "Luminous Fern Companion Alcove",
    "w": 48,
    "d": 43,
    "h": 10,
    "entry": 24,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        11,
        37,
        0,
        17
      ],
      [
        0,
        18,
        14,
        37
      ],
      [
        32,
        47,
        16,
        33
      ],
      [
        8,
        41,
        33,
        42
      ],
      [
        18,
        30,
        16,
        35
      ]
    ],
    "cuts": [
      [
        20,
        31,
        20,
        30
      ],
      [
        2,
        9,
        24,
        28
      ]
    ],
    "anchors": [
      [
        24,
        6
      ],
      [
        11,
        27
      ],
      [
        37,
        27
      ],
      [
        20,
        39
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
        13,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        35,
        29,
        "pack5:087",
        null,
        "category-specialty"
      ],
      [
        21,
        40,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          11,
          37,
          0,
          17
        ],
        "x",
        7,
        "Luminous Fern Companion Alcove main-roof",
        "saw"
      ],
      [
        [
          0,
          18,
          14,
          37
        ],
        "z",
        5,
        "Luminous Fern Companion Alcove western-court",
        "tower"
      ],
      [
        [
          8,
          41,
          33,
          42
        ],
        "x",
        6,
        "Luminous Fern Companion Alcove rear-arcade",
        "terrace"
      ],
      [
        [
          32,
          47,
          16,
          33
        ],
        "z",
        4,
        "Luminous Fern Companion Alcove eastern-gallery",
        "gable"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "desert",
    "size": "medium",
    "variation": 5,
    "name": "Umber Sandglass Diviner Rotunda",
    "w": 51,
    "d": 50,
    "h": 11,
    "entry": 24,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        8,
        40,
        0,
        11
      ],
      [
        0,
        17,
        8,
        40
      ],
      [
        33,
        50,
        10,
        41
      ],
      [
        11,
        48,
        43,
        49
      ],
      [
        17,
        31,
        10,
        45
      ]
    ],
    "cuts": [
      [
        21,
        32,
        16,
        22
      ],
      [
        40,
        45,
        17,
        26
      ]
    ],
    "anchors": [
      [
        24,
        6
      ],
      [
        11,
        25
      ],
      [
        40,
        28
      ],
      [
        20,
        46
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
        13,
        26,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        38,
        30,
        "pack5:093",
        null,
        "category-specialty"
      ],
      [
        21,
        47,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          8,
          40,
          0,
          11
        ],
        "x",
        7,
        "Umber Sandglass Diviner Rotunda main-roof",
        "gable"
      ],
      [
        [
          0,
          17,
          8,
          40
        ],
        "z",
        5,
        "Umber Sandglass Diviner Rotunda western-court",
        "tower"
      ],
      [
        [
          11,
          48,
          43,
          49
        ],
        "x",
        6,
        "Umber Sandglass Diviner Rotunda rear-arcade",
        "terrace"
      ],
      [
        [
          33,
          50,
          10,
          41
        ],
        "z",
        4,
        "Umber Sandglass Diviner Rotunda eastern-gallery",
        "saw"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "temperate",
    "size": "medium",
    "variation": 5,
    "name": "Stillwater Arcane Promenade",
    "w": 49,
    "d": 53,
    "h": 11,
    "entry": 26,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        10,
        42,
        0,
        16
      ],
      [
        0,
        18,
        13,
        47
      ],
      [
        28,
        48,
        15,
        49
      ],
      [
        13,
        40,
        46,
        52
      ],
      [
        16,
        33,
        15,
        48
      ]
    ],
    "cuts": [
      [
        21,
        33,
        18,
        31
      ],
      [
        2,
        10,
        34,
        37
      ]
    ],
    "anchors": [
      [
        26,
        6
      ],
      [
        11,
        31
      ],
      [
        38,
        34
      ],
      [
        20,
        49
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
        13,
        32,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        36,
        36,
        "pack5:093",
        null,
        "category-specialty"
      ],
      [
        21,
        50,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          10,
          42,
          0,
          16
        ],
        "x",
        7,
        "Stillwater Arcane Promenade main-roof",
        "terrace"
      ],
      [
        [
          0,
          18,
          13,
          47
        ],
        "z",
        5,
        "Stillwater Arcane Promenade western-court",
        "gable"
      ],
      [
        [
          13,
          40,
          46,
          52
        ],
        "x",
        6,
        "Stillwater Arcane Promenade rear-arcade",
        "tower"
      ],
      [
        [
          28,
          48,
          15,
          49
        ],
        "z",
        4,
        "Stillwater Arcane Promenade eastern-gallery",
        "saw"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "mountain",
    "size": "large",
    "variation": 5,
    "name": "Cascadewick Herbal Slopes",
    "w": 71,
    "d": 60,
    "h": 12,
    "entry": 34,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        20,
        48,
        0,
        10
      ],
      [
        0,
        23,
        7,
        54
      ],
      [
        45,
        70,
        9,
        54
      ],
      [
        7,
        67,
        53,
        59
      ],
      [
        25,
        42,
        9,
        55
      ]
    ],
    "cuts": [
      [
        28,
        42,
        15,
        22
      ],
      [
        3,
        11,
        25,
        29
      ]
    ],
    "anchors": [
      [
        34,
        6
      ],
      [
        11,
        32
      ],
      [
        60,
        34
      ],
      [
        33,
        56
      ]
    ],
    "fixtures": [
      [
        38,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        13,
        33,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        58,
        36,
        "pack5:089",
        null,
        "category-specialty"
      ],
      [
        34,
        57,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          20,
          48,
          0,
          10
        ],
        "x",
        7,
        "Cascadewick Herbal Slopes main-roof",
        "terrace"
      ],
      [
        [
          0,
          23,
          7,
          54
        ],
        "z",
        5,
        "Cascadewick Herbal Slopes western-court",
        "gable"
      ],
      [
        [
          7,
          67,
          53,
          59
        ],
        "x",
        6,
        "Cascadewick Herbal Slopes rear-arcade",
        "saw"
      ],
      [
        [
          45,
          70,
          9,
          54
        ],
        "z",
        4,
        "Cascadewick Herbal Slopes eastern-gallery",
        "tower"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "snow",
    "size": "medium",
    "variation": 5,
    "name": "Boreal Frostwort Distillery",
    "w": 49,
    "d": 51,
    "h": 11,
    "entry": 22,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        6,
        38,
        0,
        15
      ],
      [
        0,
        20,
        12,
        40
      ],
      [
        27,
        48,
        14,
        41
      ],
      [
        13,
        47,
        43,
        50
      ],
      [
        14,
        32,
        14,
        45
      ]
    ],
    "cuts": [
      [
        20,
        29,
        19,
        31
      ],
      [
        36,
        46,
        36,
        42
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        11,
        27
      ],
      [
        38,
        30
      ],
      [
        21,
        47
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
        13,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        36,
        32,
        "pack5:089",
        null,
        "category-specialty"
      ],
      [
        22,
        48,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          6,
          38,
          0,
          15
        ],
        "x",
        7,
        "Boreal Frostwort Distillery main-roof",
        "terrace"
      ],
      [
        [
          0,
          20,
          12,
          40
        ],
        "z",
        5,
        "Boreal Frostwort Distillery western-court",
        "tower"
      ],
      [
        [
          13,
          47,
          43,
          50
        ],
        "x",
        6,
        "Boreal Frostwort Distillery rear-arcade",
        "saw"
      ],
      [
        [
          27,
          48,
          14,
          41
        ],
        "z",
        4,
        "Boreal Frostwort Distillery eastern-gallery",
        "gable"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 5,
    "name": "Moonrise Faerie Hearth Palace",
    "w": 57,
    "d": 51,
    "h": 12,
    "entry": 29,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        13,
        45,
        0,
        17
      ],
      [
        0,
        20,
        14,
        46
      ],
      [
        35,
        56,
        16,
        46
      ],
      [
        11,
        49,
        43,
        50
      ],
      [
        18,
        35,
        16,
        45
      ]
    ],
    "cuts": [
      [
        24,
        35,
        21,
        35
      ],
      [
        45,
        51,
        38,
        47
      ]
    ],
    "anchors": [
      [
        29,
        6
      ],
      [
        11,
        31
      ],
      [
        46,
        33
      ],
      [
        26,
        47
      ]
    ],
    "fixtures": [
      [
        33,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        13,
        32,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        44,
        35,
        "pack5:085",
        null,
        "category-specialty"
      ],
      [
        27,
        48,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          13,
          45,
          0,
          17
        ],
        "x",
        7,
        "Moonrise Faerie Hearth Palace main-roof",
        "gable"
      ],
      [
        [
          0,
          20,
          14,
          46
        ],
        "z",
        5,
        "Moonrise Faerie Hearth Palace western-court",
        "saw"
      ],
      [
        [
          11,
          49,
          43,
          50
        ],
        "x",
        6,
        "Moonrise Faerie Hearth Palace rear-arcade",
        "tower"
      ],
      [
        [
          35,
          56,
          16,
          46
        ],
        "z",
        4,
        "Moonrise Faerie Hearth Palace eastern-gallery",
        "terrace"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "desert",
    "size": "medium",
    "variation": 5,
    "name": "Copper Mesa Shaded Bread Market",
    "w": 51,
    "d": 50,
    "h": 11,
    "entry": 26,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        10,
        42,
        0,
        17
      ],
      [
        0,
        18,
        14,
        45
      ],
      [
        28,
        50,
        16,
        41
      ],
      [
        13,
        49,
        41,
        49
      ],
      [
        14,
        37,
        16,
        43
      ]
    ],
    "cuts": [
      [
        17,
        30,
        20,
        27
      ],
      [
        37,
        45,
        23,
        28
      ]
    ],
    "anchors": [
      [
        26,
        6
      ],
      [
        11,
        31
      ],
      [
        40,
        31
      ],
      [
        23,
        46
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
        13,
        32,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        38,
        33,
        "pack5:085",
        null,
        "category-specialty"
      ],
      [
        24,
        47,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          10,
          42,
          0,
          17
        ],
        "x",
        7,
        "Copper Mesa Shaded Bread Market main-roof",
        "tower"
      ],
      [
        [
          0,
          18,
          14,
          45
        ],
        "z",
        5,
        "Copper Mesa Shaded Bread Market western-court",
        "gable"
      ],
      [
        [
          13,
          49,
          41,
          49
        ],
        "x",
        6,
        "Copper Mesa Shaded Bread Market rear-arcade",
        "terrace"
      ],
      [
        [
          28,
          50,
          16,
          41
        ],
        "z",
        4,
        "Copper Mesa Shaded Bread Market eastern-gallery",
        "saw"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "snow",
    "size": "small",
    "variation": 3,
    "name": "Ironfrost Fiscal Anchorage",
    "w": 42,
    "d": 41,
    "h": 10,
    "entry": 21,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        5,
        37,
        0,
        10
      ],
      [
        0,
        18,
        7,
        31
      ],
      [
        21,
        41,
        9,
        35
      ],
      [
        7,
        37,
        29,
        40
      ],
      [
        11,
        30,
        9,
        31
      ]
    ],
    "cuts": [
      [
        16,
        31,
        15,
        22
      ],
      [
        4,
        9,
        25,
        32
      ]
    ],
    "anchors": [
      [
        21,
        6
      ],
      [
        11,
        20
      ],
      [
        31,
        24
      ],
      [
        15,
        37
      ]
    ],
    "fixtures": [
      [
        25,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        13,
        21,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        29,
        26,
        "pack5:094",
        "citadel-ironbound-leaves",
        "bank-vault-service"
      ],
      [
        16,
        38,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          37,
          0,
          10
        ],
        "x",
        7,
        "Ironfrost Fiscal Anchorage main-roof",
        "terrace"
      ],
      [
        [
          0,
          18,
          7,
          31
        ],
        "z",
        5,
        "Ironfrost Fiscal Anchorage western-court",
        "gable"
      ],
      [
        [
          7,
          37,
          29,
          40
        ],
        "x",
        6,
        "Ironfrost Fiscal Anchorage rear-arcade",
        "saw"
      ],
      [
        [
          21,
          41,
          9,
          35
        ],
        "z",
        4,
        "Ironfrost Fiscal Anchorage eastern-gallery",
        "tower"
      ]
    ],
    "vault": [
      24,
      40,
      25,
      32,
      27,
      28
    ]
  },
  {
    "category": "bank",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 3,
    "name": "Thistlethorn Vault Conservatory",
    "w": 66,
    "d": 59,
    "h": 12,
    "entry": 31,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        16,
        46,
        0,
        10
      ],
      [
        0,
        23,
        7,
        54
      ],
      [
        43,
        65,
        9,
        49
      ],
      [
        9,
        64,
        50,
        58
      ],
      [
        23,
        40,
        9,
        52
      ]
    ],
    "cuts": [
      [
        21,
        36,
        13,
        20
      ],
      [
        52,
        61,
        43,
        47
      ]
    ],
    "anchors": [
      [
        31,
        6
      ],
      [
        11,
        32
      ],
      [
        55,
        31
      ],
      [
        26,
        55
      ]
    ],
    "fixtures": [
      [
        35,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        13,
        33,
        "pack5:091",
        "cartographers-oak-desk",
        "room-workspace"
      ],
      [
        53,
        33,
        "pack5:094",
        "citadel-ironbound-leaves",
        "bank-vault-service"
      ],
      [
        27,
        56,
        "pack4:057",
        null,
        "rear-storage"
      ]
    ],
    "roofs": [
      [
        [
          16,
          46,
          0,
          10
        ],
        "x",
        7,
        "Thistlethorn Vault Conservatory main-roof",
        "saw"
      ],
      [
        [
          0,
          23,
          7,
          54
        ],
        "z",
        5,
        "Thistlethorn Vault Conservatory western-court",
        "tower"
      ],
      [
        [
          9,
          64,
          50,
          58
        ],
        "x",
        6,
        "Thistlethorn Vault Conservatory rear-arcade",
        "terrace"
      ],
      [
        [
          43,
          65,
          9,
          49
        ],
        "z",
        4,
        "Thistlethorn Vault Conservatory eastern-gallery",
        "gable"
      ]
    ],
    "vault": [
      45,
      64,
      23,
      34,
      25,
      26
    ]
  }
]);
export const ROADMAP_A_WAVE05_SHOPS=Object.freeze(ROADMAP_A_WAVE05_SPECS.map(s=>{const bp=author2ALandmark(s);validateBlueprint(bp);return bp;}));
export const ROADMAP_A_WAVE05_IDS=Object.freeze(ROADMAP_A_WAVE05_SHOPS.map(b=>b.id));
