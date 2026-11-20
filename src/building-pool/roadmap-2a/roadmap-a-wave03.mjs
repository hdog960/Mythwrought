// Roadmap A Builder 2A commerce Wave03: twelve separately specified original occupied-cell plans.
// Historical 128 and Wave01/02 remain unmodified; proposals only, no world registration.
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const ROADMAP_A_WAVE03_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "snow",
    "size": "small",
    "variation": 5,
    "name": "Frostcross Switchyard Merchant Hall",
    "w": 47,
    "d": 42,
    "h": 11,
    "entry": 23,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        9,
        38,
        0,
        13
      ],
      [
        0,
        18,
        10,
        32
      ],
      [
        10,
        40,
        31,
        41
      ],
      [
        32,
        46,
        14,
        35
      ],
      [
        12,
        37,
        20,
        34
      ]
    ],
    "cuts": [
      [
        21,
        28,
        17,
        25
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        7,
        22
      ],
      [
        39,
        22
      ],
      [
        25,
        37
      ]
    ],
    "fixtures": [
      [
        27,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        9,
        23,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        37,
        24,
        "pack5:087",
        null,
        "specialist-display"
      ],
      [
        26,
        38,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          9,
          38,
          0,
          13
        ],
        "x",
        7,
        "Frostcross Switchyard Merchant Hall bespoke primary ridge",
        "gable"
      ],
      [
        [
          0,
          18,
          10,
          32
        ],
        "z",
        5,
        "Frostcross Switchyard Merchant Hall bespoke west arcade",
        "terrace"
      ],
      [
        [
          32,
          46,
          14,
          35
        ],
        "x",
        5,
        "Frostcross Switchyard Merchant Hall bespoke east specialist roof",
        "saw"
      ],
      [
        [
          10,
          40,
          31,
          41
        ],
        "z",
        6,
        "Frostcross Switchyard Merchant Hall bespoke rear storage canopy",
        "tower"
      ]
    ]
  },
  {
    "category": "general-store",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 5,
    "name": "Thornline Fern Canal Exchange",
    "w": 60,
    "d": 54,
    "h": 12,
    "entry": 29,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        14,
        46,
        0,
        13
      ],
      [
        0,
        22,
        11,
        45
      ],
      [
        13,
        48,
        43,
        53
      ],
      [
        38,
        59,
        13,
        49
      ],
      [
        19,
        43,
        20,
        46
      ]
    ],
    "cuts": [
      [
        23,
        35,
        22,
        35
      ]
    ],
    "anchors": [
      [
        29,
        6
      ],
      [
        9,
        26
      ],
      [
        50,
        28
      ],
      [
        18,
        49
      ]
    ],
    "fixtures": [
      [
        33,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        11,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        48,
        30,
        "pack5:087",
        null,
        "specialist-display"
      ],
      [
        19,
        50,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          14,
          46,
          0,
          13
        ],
        "x",
        7,
        "Thornline Fern Canal Exchange bespoke primary ridge",
        "saw"
      ],
      [
        [
          0,
          22,
          11,
          45
        ],
        "z",
        5,
        "Thornline Fern Canal Exchange bespoke west arcade",
        "terrace"
      ],
      [
        [
          38,
          59,
          13,
          49
        ],
        "x",
        5,
        "Thornline Fern Canal Exchange bespoke east specialist roof",
        "gable"
      ],
      [
        [
          13,
          48,
          43,
          53
        ],
        "z",
        6,
        "Thornline Fern Canal Exchange bespoke rear storage canopy",
        "tower"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "desert",
    "size": "large",
    "variation": 5,
    "name": "Saltwind Covered Caravan Stables",
    "w": 59,
    "d": 49,
    "h": 12,
    "entry": 28,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        11,
        47,
        0,
        15
      ],
      [
        0,
        20,
        13,
        43
      ],
      [
        39,
        58,
        17,
        45
      ],
      [
        10,
        50,
        42,
        48
      ],
      [
        15,
        44,
        22,
        42
      ]
    ],
    "cuts": [
      [
        22,
        36,
        24,
        37
      ]
    ],
    "anchors": [
      [
        28,
        7
      ],
      [
        8,
        28
      ],
      [
        49,
        29
      ],
      [
        18,
        45
      ]
    ],
    "fixtures": [
      [
        32,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        10,
        29,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        47,
        31,
        "pack5:087",
        null,
        "empty-pen-reservation"
      ],
      [
        19,
        46,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          11,
          47,
          0,
          15
        ],
        "x",
        7,
        "Saltwind Covered Caravan Stables bespoke primary ridge",
        "tower"
      ],
      [
        [
          0,
          20,
          13,
          43
        ],
        "z",
        5,
        "Saltwind Covered Caravan Stables bespoke west arcade",
        "gable"
      ],
      [
        [
          10,
          50,
          42,
          48
        ],
        "x",
        5,
        "Saltwind Covered Caravan Stables bespoke east specialist roof",
        "saw"
      ],
      [
        [
          39,
          58,
          17,
          45
        ],
        "z",
        6,
        "Saltwind Covered Caravan Stables bespoke rear storage canopy",
        "terrace"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "temperate",
    "size": "medium",
    "variation": 5,
    "name": "Meadowbrook Stone Aviary",
    "w": 50,
    "d": 43,
    "h": 11,
    "entry": 24,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        9,
        41,
        0,
        11
      ],
      [
        0,
        19,
        9,
        38
      ],
      [
        31,
        49,
        15,
        41
      ],
      [
        8,
        44,
        37,
        42
      ],
      [
        16,
        35,
        16,
        35
      ]
    ],
    "cuts": [
      [
        22,
        29,
        20,
        29
      ]
    ],
    "anchors": [
      [
        24,
        5
      ],
      [
        8,
        23
      ],
      [
        40,
        26
      ],
      [
        18,
        39
      ]
    ],
    "fixtures": [
      [
        28,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        10,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        38,
        28,
        "pack5:087",
        null,
        "empty-pen-reservation"
      ],
      [
        19,
        40,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          9,
          41,
          0,
          11
        ],
        "x",
        7,
        "Meadowbrook Stone Aviary bespoke primary ridge",
        "terrace"
      ],
      [
        [
          0,
          19,
          9,
          38
        ],
        "z",
        5,
        "Meadowbrook Stone Aviary bespoke west arcade",
        "saw"
      ],
      [
        [
          8,
          44,
          37,
          42
        ],
        "x",
        5,
        "Meadowbrook Stone Aviary bespoke east specialist roof",
        "gable"
      ],
      [
        [
          31,
          49,
          15,
          41
        ],
        "z",
        6,
        "Meadowbrook Stone Aviary bespoke rear storage canopy",
        "tower"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "temperate",
    "size": "large",
    "variation": 5,
    "name": "Halcyon Clockwork Curio Court",
    "w": 56,
    "d": 50,
    "h": 12,
    "entry": 27,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        10,
        46,
        0,
        14
      ],
      [
        0,
        19,
        11,
        43
      ],
      [
        39,
        55,
        15,
        47
      ],
      [
        13,
        48,
        43,
        49
      ],
      [
        15,
        41,
        24,
        43
      ]
    ],
    "cuts": [
      [
        23,
        35,
        20,
        35
      ]
    ],
    "anchors": [
      [
        27,
        6
      ],
      [
        8,
        26
      ],
      [
        47,
        29
      ],
      [
        20,
        46
      ]
    ],
    "fixtures": [
      [
        31,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        10,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        45,
        31,
        "pack5:093",
        null,
        "specialist-display"
      ],
      [
        21,
        47,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          10,
          46,
          0,
          14
        ],
        "x",
        7,
        "Halcyon Clockwork Curio Court bespoke primary ridge",
        "gable"
      ],
      [
        [
          0,
          19,
          11,
          43
        ],
        "z",
        5,
        "Halcyon Clockwork Curio Court bespoke west arcade",
        "saw"
      ],
      [
        [
          13,
          48,
          43,
          49
        ],
        "x",
        5,
        "Halcyon Clockwork Curio Court bespoke east specialist roof",
        "terrace"
      ],
      [
        [
          39,
          55,
          15,
          47
        ],
        "z",
        6,
        "Halcyon Clockwork Curio Court bespoke rear storage canopy",
        "tower"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "desert",
    "size": "large",
    "variation": 5,
    "name": "Sunspire Broken-Ring Reliquary",
    "w": 62,
    "d": 51,
    "h": 12,
    "entry": 30,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        13,
        49,
        0,
        13
      ],
      [
        0,
        19,
        10,
        47
      ],
      [
        43,
        61,
        15,
        45
      ],
      [
        7,
        54,
        43,
        50
      ],
      [
        18,
        46,
        28,
        44
      ]
    ],
    "cuts": [
      [
        24,
        38,
        22,
        38
      ]
    ],
    "anchors": [
      [
        30,
        6
      ],
      [
        8,
        29
      ],
      [
        51,
        27
      ],
      [
        22,
        47
      ]
    ],
    "fixtures": [
      [
        34,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        10,
        30,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        49,
        29,
        "pack5:093",
        null,
        "specialist-display"
      ],
      [
        23,
        48,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          13,
          49,
          0,
          13
        ],
        "x",
        7,
        "Sunspire Broken-Ring Reliquary bespoke primary ridge",
        "saw"
      ],
      [
        [
          0,
          19,
          10,
          47
        ],
        "z",
        5,
        "Sunspire Broken-Ring Reliquary bespoke west arcade",
        "tower"
      ],
      [
        [
          7,
          54,
          43,
          50
        ],
        "x",
        5,
        "Sunspire Broken-Ring Reliquary bespoke east specialist roof",
        "gable"
      ],
      [
        [
          43,
          61,
          15,
          45
        ],
        "z",
        6,
        "Sunspire Broken-Ring Reliquary bespoke rear storage canopy",
        "terrace"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "mountain",
    "size": "small",
    "variation": 5,
    "name": "Cragmist Cold Herbal Terraces",
    "w": 45,
    "d": 46,
    "h": 11,
    "entry": 22,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        7,
        36,
        0,
        12
      ],
      [
        0,
        16,
        10,
        38
      ],
      [
        30,
        44,
        17,
        42
      ],
      [
        5,
        37,
        37,
        45
      ],
      [
        15,
        31,
        23,
        38
      ]
    ],
    "cuts": [
      [
        20,
        27,
        17,
        29
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        8,
        24
      ],
      [
        37,
        27
      ],
      [
        13,
        42
      ]
    ],
    "fixtures": [
      [
        26,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        10,
        25,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        35,
        29,
        "pack5:089",
        null,
        "specialist-display"
      ],
      [
        14,
        43,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          7,
          36,
          0,
          12
        ],
        "x",
        7,
        "Cragmist Cold Herbal Terraces bespoke primary ridge",
        "terrace"
      ],
      [
        [
          0,
          16,
          10,
          38
        ],
        "z",
        5,
        "Cragmist Cold Herbal Terraces bespoke west arcade",
        "gable"
      ],
      [
        [
          5,
          37,
          37,
          45
        ],
        "x",
        5,
        "Cragmist Cold Herbal Terraces bespoke east specialist roof",
        "saw"
      ],
      [
        [
          30,
          44,
          17,
          42
        ],
        "z",
        6,
        "Cragmist Cold Herbal Terraces bespoke rear storage canopy",
        "tower"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "desert",
    "size": "large",
    "variation": 5,
    "name": "Sunflume Waterless Distilling Bazaar",
    "w": 65,
    "d": 54,
    "h": 12,
    "entry": 32,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        14,
        51,
        0,
        15
      ],
      [
        0,
        21,
        13,
        47
      ],
      [
        44,
        64,
        16,
        49
      ],
      [
        10,
        56,
        47,
        53
      ],
      [
        18,
        49,
        23,
        47
      ]
    ],
    "cuts": [
      [
        25,
        40,
        26,
        39
      ]
    ],
    "anchors": [
      [
        32,
        7
      ],
      [
        9,
        30
      ],
      [
        54,
        30
      ],
      [
        20,
        50
      ]
    ],
    "fixtures": [
      [
        36,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        11,
        31,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        52,
        32,
        "pack5:089",
        null,
        "specialist-display"
      ],
      [
        21,
        51,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          14,
          51,
          0,
          15
        ],
        "x",
        7,
        "Sunflume Waterless Distilling Bazaar bespoke primary ridge",
        "tower"
      ],
      [
        [
          0,
          21,
          13,
          47
        ],
        "z",
        5,
        "Sunflume Waterless Distilling Bazaar bespoke west arcade",
        "terrace"
      ],
      [
        [
          10,
          56,
          47,
          53
        ],
        "x",
        5,
        "Sunflume Waterless Distilling Bazaar bespoke east specialist roof",
        "saw"
      ],
      [
        [
          44,
          64,
          16,
          49
        ],
        "z",
        6,
        "Sunflume Waterless Distilling Bazaar bespoke rear storage canopy",
        "gable"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "snow",
    "size": "medium",
    "variation": 5,
    "name": "Glaciermelt Four-Hearth Hall",
    "w": 52,
    "d": 46,
    "h": 11,
    "entry": 25,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        9,
        43,
        0,
        14
      ],
      [
        0,
        19,
        12,
        42
      ],
      [
        35,
        51,
        14,
        44
      ],
      [
        10,
        48,
        40,
        45
      ],
      [
        15,
        39,
        21,
        39
      ]
    ],
    "cuts": [
      [
        21,
        31,
        23,
        32
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
        43,
        28
      ],
      [
        19,
        42
      ]
    ],
    "fixtures": [
      [
        29,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        11,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        41,
        30,
        "pack5:085",
        null,
        "specialist-display"
      ],
      [
        20,
        43,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          9,
          43,
          0,
          14
        ],
        "x",
        7,
        "Glaciermelt Four-Hearth Hall bespoke primary ridge",
        "gable"
      ],
      [
        [
          0,
          19,
          12,
          42
        ],
        "z",
        5,
        "Glaciermelt Four-Hearth Hall bespoke west arcade",
        "tower"
      ],
      [
        [
          10,
          48,
          40,
          45
        ],
        "x",
        5,
        "Glaciermelt Four-Hearth Hall bespoke east specialist roof",
        "terrace"
      ],
      [
        [
          35,
          51,
          14,
          44
        ],
        "z",
        6,
        "Glaciermelt Four-Hearth Hall bespoke rear storage canopy",
        "saw"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "enchanted-forest",
    "size": "small",
    "variation": 5,
    "name": "Mycelium Honey Hearth",
    "w": 44,
    "d": 41,
    "h": 10,
    "entry": 21,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        5,
        37,
        0,
        13
      ],
      [
        0,
        15,
        11,
        34
      ],
      [
        28,
        43,
        16,
        39
      ],
      [
        7,
        36,
        34,
        40
      ],
      [
        13,
        33,
        21,
        35
      ]
    ],
    "cuts": [
      [
        19,
        25,
        17,
        28
      ]
    ],
    "anchors": [
      [
        21,
        6
      ],
      [
        8,
        24
      ],
      [
        35,
        27
      ],
      [
        17,
        37
      ]
    ],
    "fixtures": [
      [
        25,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        10,
        25,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        33,
        29,
        "pack5:085",
        null,
        "specialist-display"
      ],
      [
        18,
        38,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          37,
          0,
          13
        ],
        "x",
        7,
        "Mycelium Honey Hearth bespoke primary ridge",
        "terrace"
      ],
      [
        [
          0,
          15,
          11,
          34
        ],
        "z",
        5,
        "Mycelium Honey Hearth bespoke west arcade",
        "saw"
      ],
      [
        [
          7,
          36,
          34,
          40
        ],
        "x",
        5,
        "Mycelium Honey Hearth bespoke east specialist roof",
        "tower"
      ],
      [
        [
          28,
          43,
          16,
          39
        ],
        "z",
        6,
        "Mycelium Honey Hearth bespoke rear storage canopy",
        "gable"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "temperate",
    "size": "small",
    "variation": 3,
    "name": "Oldwater Compact Counting Vault",
    "w": 56,
    "d": 48,
    "h": 12,
    "entry": 27,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        11,
        45,
        0,
        14
      ],
      [
        0,
        18,
        12,
        44
      ],
      [
        38,
        55,
        14,
        46
      ],
      [
        12,
        45,
        42,
        47
      ],
      [
        15,
        44,
        22,
        44
      ]
    ],
    "cuts": [
      [
        22,
        32,
        21,
        33
      ]
    ],
    "anchors": [
      [
        27,
        6
      ],
      [
        8,
        28
      ],
      [
        47,
        28
      ],
      [
        19,
        45
      ]
    ],
    "fixtures": [
      [
        31,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        10,
        29,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        45,
        30,
        "pack5:094",
        "citadel-ironbound-leaves",
        "vault-queue"
      ],
      [
        20,
        46,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          11,
          45,
          0,
          14
        ],
        "x",
        7,
        "Oldwater Compact Counting Vault bespoke primary ridge",
        "saw"
      ],
      [
        [
          0,
          18,
          12,
          44
        ],
        "z",
        5,
        "Oldwater Compact Counting Vault bespoke west arcade",
        "terrace"
      ],
      [
        [
          12,
          45,
          42,
          47
        ],
        "x",
        5,
        "Oldwater Compact Counting Vault bespoke east specialist roof",
        "tower"
      ],
      [
        [
          38,
          55,
          14,
          46
        ],
        "z",
        6,
        "Oldwater Compact Counting Vault bespoke rear storage canopy",
        "gable"
      ]
    ],
    "vault": [
      42,
      52,
      31,
      43,
      35,
      36
    ]
  },
  {
    "category": "bank",
    "biome": "desert",
    "size": "small",
    "variation": 3,
    "name": "Dunefold Merchant Reserve",
    "w": 58,
    "d": 48,
    "h": 12,
    "entry": 28,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        10,
        47,
        0,
        14
      ],
      [
        0,
        17,
        13,
        35
      ],
      [
        40,
        57,
        14,
        46
      ],
      [
        20,
        51,
        43,
        47
      ],
      [
        18,
        43,
        22,
        43
      ]
    ],
    "cuts": [
      [
        22,
        36,
        19,
        32
      ]
    ],
    "anchors": [
      [
        28,
        6
      ],
      [
        8,
        27
      ],
      [
        48,
        25
      ],
      [
        20,
        45
      ]
    ],
    "fixtures": [
      [
        32,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller-counter"
      ],
      [
        10,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "real-service-records"
      ],
      [
        46,
        27,
        "pack5:094",
        "citadel-ironbound-leaves",
        "vault-queue"
      ],
      [
        21,
        46,
        "pack4:057",
        null,
        "stock-storage"
      ]
    ],
    "roofs": [
      [
        [
          10,
          47,
          0,
          14
        ],
        "x",
        7,
        "Dunefold Merchant Reserve bespoke primary ridge",
        "terrace"
      ],
      [
        [
          0,
          17,
          13,
          35
        ],
        "z",
        5,
        "Dunefold Merchant Reserve bespoke west arcade",
        "tower"
      ],
      [
        [
          20,
          51,
          43,
          47
        ],
        "x",
        5,
        "Dunefold Merchant Reserve bespoke east specialist roof",
        "saw"
      ],
      [
        [
          40,
          57,
          14,
          46
        ],
        "z",
        6,
        "Dunefold Merchant Reserve bespoke rear storage canopy",
        "gable"
      ]
    ],
    "vault": [
      43,
      55,
      32,
      43,
      36,
      37
    ]
  }
]);
export const ROADMAP_A_WAVE03_SHOPS=Object.freeze(ROADMAP_A_WAVE03_SPECS.map(s=>{const bp=author2ALandmark(s);validateBlueprint(bp);return bp;}));
export const ROADMAP_A_WAVE03_IDS=Object.freeze(ROADMAP_A_WAVE03_SHOPS.map(b=>b.id));
