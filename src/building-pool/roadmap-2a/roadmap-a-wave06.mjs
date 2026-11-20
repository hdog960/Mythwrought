// Roadmap A commerce Wave06 source-only original plans. Every 2A historical and Wave01–05 source stays read-only.
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const ROADMAP_A_WAVE06_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "temperate",
    "size": "large",
    "variation": 5,
    "name": "Willow Quay Great Arcade",
    "w": 68,
    "d": 55,
    "h": 12,
    "entry": 35,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        21,
        49,
        0,
        11
      ],
      [
        0,
        24,
        8,
        49
      ],
      [
        44,
        67,
        10,
        45
      ],
      [
        7,
        64,
        45,
        54
      ],
      [
        25,
        46,
        10,
        47
      ]
    ],
    "cuts": [
      [
        32,
        39,
        16,
        30
      ],
      [
        57,
        63,
        33,
        40
      ]
    ],
    "anchors": [
      [
        35,
        6
      ],
      [
        11,
        30
      ],
      [
        57,
        30
      ],
      [
        29,
        51
      ]
    ],
    "fixtures": [
      [
        39,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        13,
        31,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        55,
        32,
        "pack5:087",
        null,
        "specialist-stand"
      ],
      [
        30,
        52,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          21,
          49,
          0,
          11
        ],
        "x",
        7,
        "Willow Quay Great Arcade original entry-roof",
        "saw"
      ],
      [
        [
          0,
          24,
          8,
          49
        ],
        "z",
        5,
        "Willow Quay Great Arcade original west-workshop",
        "gable"
      ],
      [
        [
          7,
          64,
          45,
          54
        ],
        "x",
        6,
        "Willow Quay Great Arcade original rear-gallery",
        "tower"
      ],
      [
        [
          44,
          67,
          10,
          45
        ],
        "z",
        4,
        "Willow Quay Great Arcade original east-tower",
        "terrace"
      ]
    ]
  },
  {
    "category": "general-store",
    "biome": "mountain",
    "size": "small",
    "variation": 5,
    "name": "Granite Shelf Spiral Market",
    "w": 43,
    "d": 45,
    "h": 10,
    "entry": 23,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        9,
        37,
        0,
        17
      ],
      [
        0,
        22,
        14,
        35
      ],
      [
        21,
        42,
        16,
        38
      ],
      [
        14,
        34,
        34,
        44
      ],
      [
        17,
        31,
        16,
        36
      ]
    ],
    "cuts": [
      [
        15,
        30,
        21,
        27
      ],
      [
        3,
        7,
        22,
        28
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        11,
        26
      ],
      [
        32,
        29
      ],
      [
        18,
        41
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
        13,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        30,
        31,
        "pack5:087",
        null,
        "specialist-stand"
      ],
      [
        19,
        42,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          9,
          37,
          0,
          17
        ],
        "x",
        7,
        "Granite Shelf Spiral Market original entry-roof",
        "terrace"
      ],
      [
        [
          0,
          22,
          14,
          35
        ],
        "z",
        5,
        "Granite Shelf Spiral Market original west-workshop",
        "tower"
      ],
      [
        [
          14,
          34,
          34,
          44
        ],
        "x",
        6,
        "Granite Shelf Spiral Market original rear-gallery",
        "saw"
      ],
      [
        [
          21,
          42,
          16,
          38
        ],
        "z",
        4,
        "Granite Shelf Spiral Market original east-tower",
        "gable"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "snow",
    "size": "small",
    "variation": 5,
    "name": "Frostfoot Pocket Aviary",
    "w": 45,
    "d": 43,
    "h": 10,
    "entry": 21,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        6,
        36,
        0,
        11
      ],
      [
        0,
        23,
        8,
        36
      ],
      [
        30,
        44,
        10,
        38
      ],
      [
        7,
        41,
        35,
        42
      ],
      [
        11,
        28,
        10,
        37
      ]
    ],
    "cuts": [
      [
        15,
        29,
        15,
        27
      ],
      [
        4,
        10,
        19,
        25
      ]
    ],
    "anchors": [
      [
        21,
        6
      ],
      [
        11,
        23
      ],
      [
        34,
        26
      ],
      [
        20,
        39
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
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        32,
        28,
        "pack5:087",
        null,
        "specialist-stand"
      ],
      [
        21,
        40,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          6,
          36,
          0,
          11
        ],
        "x",
        7,
        "Frostfoot Pocket Aviary original entry-roof",
        "saw"
      ],
      [
        [
          0,
          23,
          8,
          36
        ],
        "z",
        5,
        "Frostfoot Pocket Aviary original west-workshop",
        "tower"
      ],
      [
        [
          7,
          41,
          35,
          42
        ],
        "x",
        6,
        "Frostfoot Pocket Aviary original rear-gallery",
        "terrace"
      ],
      [
        [
          30,
          44,
          10,
          38
        ],
        "z",
        4,
        "Frostfoot Pocket Aviary original east-tower",
        "gable"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "desert",
    "size": "medium",
    "variation": 5,
    "name": "Sandshade Caravan Kennels",
    "w": 57,
    "d": 44,
    "h": 11,
    "entry": 29,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        16,
        42,
        0,
        11
      ],
      [
        0,
        21,
        8,
        39
      ],
      [
        39,
        56,
        10,
        35
      ],
      [
        12,
        50,
        35,
        43
      ],
      [
        23,
        38,
        10,
        37
      ]
    ],
    "cuts": [
      [
        26,
        37,
        16,
        24
      ],
      [
        45,
        54,
        28,
        35
      ]
    ],
    "anchors": [
      [
        29,
        6
      ],
      [
        11,
        25
      ],
      [
        46,
        25
      ],
      [
        26,
        40
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
        26,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        44,
        27,
        "pack5:087",
        null,
        "specialist-stand"
      ],
      [
        27,
        41,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          16,
          42,
          0,
          11
        ],
        "x",
        7,
        "Sandshade Caravan Kennels original entry-roof",
        "gable"
      ],
      [
        [
          0,
          21,
          8,
          39
        ],
        "z",
        5,
        "Sandshade Caravan Kennels original west-workshop",
        "saw"
      ],
      [
        [
          12,
          50,
          35,
          43
        ],
        "x",
        6,
        "Sandshade Caravan Kennels original rear-gallery",
        "terrace"
      ],
      [
        [
          39,
          56,
          10,
          35
        ],
        "z",
        4,
        "Sandshade Caravan Kennels original east-tower",
        "tower"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 5,
    "name": "Nightbloom Runic Skycourt",
    "w": 67,
    "d": 55,
    "h": 12,
    "entry": 32,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        16,
        48,
        0,
        11
      ],
      [
        0,
        20,
        8,
        47
      ],
      [
        45,
        66,
        10,
        46
      ],
      [
        11,
        61,
        46,
        54
      ],
      [
        20,
        42,
        10,
        48
      ]
    ],
    "cuts": [
      [
        26,
        38,
        14,
        19
      ],
      [
        4,
        8,
        42,
        46
      ]
    ],
    "anchors": [
      [
        32,
        6
      ],
      [
        11,
        29
      ],
      [
        56,
        30
      ],
      [
        27,
        51
      ]
    ],
    "fixtures": [
      [
        36,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        13,
        30,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        54,
        32,
        "pack5:093",
        null,
        "specialist-stand"
      ],
      [
        28,
        52,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          16,
          48,
          0,
          11
        ],
        "x",
        7,
        "Nightbloom Runic Skycourt original entry-roof",
        "terrace"
      ],
      [
        [
          0,
          20,
          8,
          47
        ],
        "z",
        5,
        "Nightbloom Runic Skycourt original west-workshop",
        "saw"
      ],
      [
        [
          11,
          61,
          46,
          54
        ],
        "x",
        6,
        "Nightbloom Runic Skycourt original rear-gallery",
        "gable"
      ],
      [
        [
          45,
          66,
          10,
          46
        ],
        "z",
        4,
        "Nightbloom Runic Skycourt original east-tower",
        "tower"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "temperate",
    "size": "small",
    "variation": 5,
    "name": "Rainstone Alchemical Star Hall",
    "w": 43,
    "d": 44,
    "h": 10,
    "entry": 23,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        10,
        36,
        0,
        15
      ],
      [
        0,
        18,
        12,
        35
      ],
      [
        22,
        42,
        14,
        36
      ],
      [
        13,
        34,
        33,
        43
      ],
      [
        12,
        30,
        14,
        35
      ]
    ],
    "cuts": [
      [
        18,
        28,
        18,
        25
      ],
      [
        3,
        11,
        27,
        34
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        11,
        25
      ],
      [
        32,
        27
      ],
      [
        22,
        40
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
        13,
        26,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        30,
        29,
        "pack5:093",
        null,
        "specialist-stand"
      ],
      [
        23,
        41,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          10,
          36,
          0,
          15
        ],
        "x",
        7,
        "Rainstone Alchemical Star Hall original entry-roof",
        "gable"
      ],
      [
        [
          0,
          18,
          12,
          35
        ],
        "z",
        5,
        "Rainstone Alchemical Star Hall original west-workshop",
        "terrace"
      ],
      [
        [
          13,
          34,
          33,
          43
        ],
        "x",
        6,
        "Rainstone Alchemical Star Hall original rear-gallery",
        "tower"
      ],
      [
        [
          22,
          42,
          14,
          36
        ],
        "z",
        4,
        "Rainstone Alchemical Star Hall original east-tower",
        "saw"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "mountain",
    "size": "medium",
    "variation": 5,
    "name": "Mountainmist Hollow Garden",
    "w": 57,
    "d": 52,
    "h": 11,
    "entry": 28,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        14,
        42,
        0,
        15
      ],
      [
        0,
        19,
        12,
        41
      ],
      [
        38,
        56,
        14,
        48
      ],
      [
        10,
        50,
        44,
        51
      ],
      [
        18,
        37,
        14,
        46
      ]
    ],
    "cuts": [
      [
        20,
        34,
        20,
        32
      ],
      [
        43,
        53,
        24,
        32
      ]
    ],
    "anchors": [
      [
        28,
        6
      ],
      [
        11,
        28
      ],
      [
        46,
        33
      ],
      [
        26,
        48
      ]
    ],
    "fixtures": [
      [
        32,
        6,
        "pack5:086",
        "ledger-service",
        "public-counter"
      ],
      [
        13,
        29,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        44,
        35,
        "pack5:089",
        null,
        "specialist-stand"
      ],
      [
        27,
        49,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          14,
          42,
          0,
          15
        ],
        "x",
        7,
        "Mountainmist Hollow Garden original entry-roof",
        "tower"
      ],
      [
        [
          0,
          19,
          12,
          41
        ],
        "z",
        5,
        "Mountainmist Hollow Garden original west-workshop",
        "gable"
      ],
      [
        [
          10,
          50,
          44,
          51
        ],
        "x",
        6,
        "Mountainmist Hollow Garden original rear-gallery",
        "terrace"
      ],
      [
        [
          38,
          56,
          14,
          48
        ],
        "z",
        4,
        "Mountainmist Hollow Garden original east-tower",
        "saw"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "desert",
    "size": "small",
    "variation": 5,
    "name": "Oasis Bloom Infusion Loft",
    "w": 42,
    "d": 48,
    "h": 10,
    "entry": 20,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        5,
        35,
        0,
        13
      ],
      [
        0,
        20,
        10,
        42
      ],
      [
        26,
        41,
        12,
        44
      ],
      [
        11,
        37,
        39,
        47
      ],
      [
        11,
        26,
        12,
        41
      ]
    ],
    "cuts": [
      [
        15,
        27,
        15,
        27
      ],
      [
        28,
        37,
        22,
        28
      ]
    ],
    "anchors": [
      [
        20,
        6
      ],
      [
        11,
        27
      ],
      [
        31,
        30
      ],
      [
        19,
        44
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
        13,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        29,
        32,
        "pack5:089",
        null,
        "specialist-stand"
      ],
      [
        20,
        45,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          35,
          0,
          13
        ],
        "x",
        7,
        "Oasis Bloom Infusion Loft original entry-roof",
        "saw"
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
        "Oasis Bloom Infusion Loft original west-workshop",
        "tower"
      ],
      [
        [
          11,
          37,
          39,
          47
        ],
        "x",
        6,
        "Oasis Bloom Infusion Loft original rear-gallery",
        "terrace"
      ],
      [
        [
          26,
          41,
          12,
          44
        ],
        "z",
        4,
        "Oasis Bloom Infusion Loft original east-tower",
        "gable"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "snow",
    "size": "large",
    "variation": 5,
    "name": "Winterlight Confection Observatory",
    "w": 69,
    "d": 56,
    "h": 12,
    "entry": 34,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        19,
        49,
        0,
        16
      ],
      [
        0,
        22,
        13,
        47
      ],
      [
        45,
        68,
        15,
        51
      ],
      [
        14,
        65,
        48,
        55
      ],
      [
        24,
        43,
        15,
        50
      ]
    ],
    "cuts": [
      [
        29,
        43,
        18,
        23
      ],
      [
        1,
        7,
        35,
        42
      ]
    ],
    "anchors": [
      [
        34,
        6
      ],
      [
        11,
        31
      ],
      [
        58,
        35
      ],
      [
        29,
        52
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
        32,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        56,
        37,
        "pack5:085",
        null,
        "specialist-stand"
      ],
      [
        30,
        53,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          19,
          49,
          0,
          16
        ],
        "x",
        7,
        "Winterlight Confection Observatory original entry-roof",
        "tower"
      ],
      [
        [
          0,
          22,
          13,
          47
        ],
        "z",
        5,
        "Winterlight Confection Observatory original west-workshop",
        "saw"
      ],
      [
        [
          14,
          65,
          48,
          55
        ],
        "x",
        6,
        "Winterlight Confection Observatory original rear-gallery",
        "gable"
      ],
      [
        [
          45,
          68,
          15,
          51
        ],
        "z",
        4,
        "Winterlight Confection Observatory original east-tower",
        "terrace"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 5,
    "name": "Dewroot Mooncrust Hall",
    "w": 57,
    "d": 50,
    "h": 11,
    "entry": 26,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        10,
        42,
        0,
        11
      ],
      [
        0,
        20,
        8,
        43
      ],
      [
        39,
        56,
        10,
        46
      ],
      [
        8,
        54,
        38,
        49
      ],
      [
        16,
        33,
        10,
        40
      ]
    ],
    "cuts": [
      [
        21,
        31,
        13,
        25
      ],
      [
        3,
        6,
        18,
        25
      ]
    ],
    "anchors": [
      [
        26,
        6
      ],
      [
        11,
        27
      ],
      [
        46,
        30
      ],
      [
        25,
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
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        44,
        32,
        "pack5:085",
        null,
        "specialist-stand"
      ],
      [
        26,
        47,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          10,
          42,
          0,
          11
        ],
        "x",
        7,
        "Dewroot Mooncrust Hall original entry-roof",
        "saw"
      ],
      [
        [
          0,
          20,
          8,
          43
        ],
        "z",
        5,
        "Dewroot Mooncrust Hall original west-workshop",
        "tower"
      ],
      [
        [
          8,
          54,
          38,
          49
        ],
        "x",
        6,
        "Dewroot Mooncrust Hall original rear-gallery",
        "terrace"
      ],
      [
        [
          39,
          56,
          10,
          46
        ],
        "z",
        4,
        "Dewroot Mooncrust Hall original east-tower",
        "gable"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "temperate",
    "size": "medium",
    "variation": 3,
    "name": "Bridgeward Longhall Treasury",
    "w": 52,
    "d": 51,
    "h": 11,
    "entry": 24,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        11,
        37,
        0,
        13
      ],
      [
        0,
        20,
        10,
        45
      ],
      [
        34,
        51,
        12,
        42
      ],
      [
        14,
        49,
        40,
        50
      ],
      [
        16,
        32,
        12,
        42
      ]
    ],
    "cuts": [
      [
        15,
        27,
        18,
        23
      ],
      [
        4,
        11,
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
        11,
        29
      ],
      [
        41,
        29
      ],
      [
        23,
        47
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
        30,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        39,
        31,
        "pack5:094",
        "citadel-ironbound-leaves",
        "vault-floor-intent"
      ],
      [
        24,
        48,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          11,
          37,
          0,
          13
        ],
        "x",
        7,
        "Bridgeward Longhall Treasury original entry-roof",
        "saw"
      ],
      [
        [
          0,
          20,
          10,
          45
        ],
        "z",
        5,
        "Bridgeward Longhall Treasury original west-workshop",
        "tower"
      ],
      [
        [
          14,
          49,
          40,
          50
        ],
        "x",
        6,
        "Bridgeward Longhall Treasury original rear-gallery",
        "terrace"
      ],
      [
        [
          34,
          51,
          12,
          42
        ],
        "z",
        4,
        "Bridgeward Longhall Treasury original east-tower",
        "gable"
      ]
    ],
    "vault": [
      36,
      50,
      26,
      34,
      28,
      29
    ]
  },
  {
    "category": "bank",
    "biome": "mountain",
    "size": "small",
    "variation": 3,
    "name": "Citadel Pass Twin-Vault Bank",
    "w": 48,
    "d": 44,
    "h": 10,
    "entry": 22,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        8,
        36,
        0,
        15
      ],
      [
        0,
        18,
        12,
        35
      ],
      [
        33,
        47,
        14,
        39
      ],
      [
        12,
        39,
        32,
        43
      ],
      [
        10,
        28,
        14,
        34
      ]
    ],
    "cuts": [
      [
        21,
        30,
        19,
        29
      ],
      [
        34,
        43,
        21,
        27
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        11,
        25
      ],
      [
        37,
        29
      ],
      [
        17,
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
        13,
        26,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        35,
        31,
        "pack5:094",
        "citadel-ironbound-leaves",
        "vault-floor-intent"
      ],
      [
        18,
        41,
        "pack4:057",
        null,
        "dry-storage"
      ]
    ],
    "roofs": [
      [
        [
          8,
          36,
          0,
          15
        ],
        "x",
        7,
        "Citadel Pass Twin-Vault Bank original entry-roof",
        "terrace"
      ],
      [
        [
          0,
          18,
          12,
          35
        ],
        "z",
        5,
        "Citadel Pass Twin-Vault Bank original west-workshop",
        "tower"
      ],
      [
        [
          12,
          39,
          32,
          43
        ],
        "x",
        6,
        "Citadel Pass Twin-Vault Bank original rear-gallery",
        "saw"
      ],
      [
        [
          33,
          47,
          14,
          39
        ],
        "z",
        4,
        "Citadel Pass Twin-Vault Bank original east-tower",
        "gable"
      ]
    ],
    "vault": [
      37,
      45,
      32,
      36,
      34,
      35
    ]
  }
]);
export const ROADMAP_A_WAVE06_SHOPS=Object.freeze(ROADMAP_A_WAVE06_SPECS.map(s=>{const blueprint=author2ALandmark(s);validateBlueprint(blueprint);return blueprint;}));
export const ROADMAP_A_WAVE06_IDS=Object.freeze(ROADMAP_A_WAVE06_SHOPS.map(b=>b.id));
