/** MYTHWROUGHT Roadmap A Wave11: twelve original source-only commerce plans; no approved physical Manual Pack material variant/yaw, structure, player save, world placement, PWA or production registration. */
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const ROADMAP_A_WAVE11_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "desert",
    "size": "small",
    "variation": 2,
    "name": "Sunveil Crooked Spice Exchange",
    "w": 50,
    "d": 58,
    "h": 12,
    "entry": 23,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        12,
        35,
        0,
        15
      ],
      [
        1,
        17,
        12,
        47
      ],
      [
        31,
        49,
        17,
        43
      ],
      [
        5,
        43,
        47,
        57
      ],
      [
        18,
        32,
        12,
        52
      ],
      [
        0,
        11,
        35,
        54
      ]
    ],
    "cuts": [
      [
        22,
        29,
        27,
        37
      ],
      [
        36,
        43,
        31,
        38
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        9,
        29
      ],
      [
        42,
        24
      ],
      [
        15,
        53
      ]
    ],
    "fixtures": [
      [
        27,
        6,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        11,
        31,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        42,
        26,
        "pack5:087",
        null,
        "source-trading-display"
      ],
      [
        16,
        54,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "roofs": [
      [
        [
          12,
          35,
          0,
          15
        ],
        "x",
        7,
        "Sunveil Crooked Spice Exchange front-astral-roof",
        "tower"
      ],
      [
        [
          1,
          17,
          12,
          47
        ],
        "z",
        5,
        "Sunveil Crooked Spice Exchange western-covered-walk",
        "gable"
      ],
      [
        [
          31,
          49,
          17,
          43
        ],
        "x",
        6,
        "Sunveil Crooked Spice Exchange east-service-tower",
        "saw"
      ],
      [
        [
          5,
          43,
          47,
          57
        ],
        "z",
        4,
        "Sunveil Crooked Spice Exchange rear-court-terrace",
        "terrace"
      ]
    ]
  },
  {
    "category": "general-store",
    "biome": "snow",
    "size": "medium",
    "variation": 4,
    "name": "Pineglass Thawproof Trading House",
    "w": 67,
    "d": 59,
    "h": 14,
    "entry": 32,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        17,
        48,
        0,
        17
      ],
      [
        0,
        23,
        12,
        47
      ],
      [
        45,
        66,
        20,
        52
      ],
      [
        12,
        61,
        49,
        58
      ],
      [
        25,
        47,
        14,
        52
      ],
      [
        0,
        14,
        40,
        55
      ]
    ],
    "cuts": [
      [
        31,
        39,
        25,
        38
      ],
      [
        52,
        60,
        34,
        43
      ]
    ],
    "anchors": [
      [
        32,
        7
      ],
      [
        11,
        30
      ],
      [
        56,
        28
      ],
      [
        23,
        55
      ]
    ],
    "fixtures": [
      [
        36,
        7,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        13,
        32,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        57,
        30,
        "pack5:087",
        null,
        "source-trading-display"
      ],
      [
        24,
        56,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "roofs": [
      [
        [
          17,
          48,
          0,
          17
        ],
        "x",
        5,
        "Pineglass Thawproof Trading House front-astral-roof",
        "gable"
      ],
      [
        [
          0,
          23,
          12,
          47
        ],
        "z",
        6,
        "Pineglass Thawproof Trading House western-covered-walk",
        "terrace"
      ],
      [
        [
          45,
          66,
          20,
          52
        ],
        "x",
        4,
        "Pineglass Thawproof Trading House east-service-tower",
        "tower"
      ],
      [
        [
          12,
          61,
          49,
          58
        ],
        "z",
        7,
        "Pineglass Thawproof Trading House rear-court-terrace",
        "saw"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "mountain",
    "size": "large",
    "variation": 2,
    "name": "Highridge Twin-Aerie Empty Pen Hall",
    "w": 83,
    "d": 71,
    "h": 15,
    "entry": 41,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        23,
        60,
        0,
        18
      ],
      [
        0,
        30,
        15,
        56
      ],
      [
        58,
        82,
        16,
        54
      ],
      [
        15,
        72,
        56,
        70
      ],
      [
        30,
        58,
        15,
        60
      ],
      [
        0,
        18,
        48,
        65
      ]
    ],
    "cuts": [
      [
        36,
        48,
        29,
        43
      ],
      [
        65,
        73,
        35,
        45
      ]
    ],
    "anchors": [
      [
        41,
        7
      ],
      [
        14,
        34
      ],
      [
        71,
        27
      ],
      [
        27,
        65
      ]
    ],
    "fixtures": [
      [
        45,
        7,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        16,
        36,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        72,
        29,
        "pack5:087",
        null,
        "empty-perch-source"
      ],
      [
        28,
        66,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "roofs": [
      [
        [
          23,
          60,
          0,
          18
        ],
        "x",
        6,
        "Highridge Twin-Aerie Empty Pen Hall front-astral-roof",
        "saw"
      ],
      [
        [
          0,
          30,
          15,
          56
        ],
        "z",
        4,
        "Highridge Twin-Aerie Empty Pen Hall western-covered-walk",
        "tower"
      ],
      [
        [
          58,
          82,
          16,
          54
        ],
        "x",
        7,
        "Highridge Twin-Aerie Empty Pen Hall east-service-tower",
        "terrace"
      ],
      [
        [
          15,
          72,
          56,
          70
        ],
        "z",
        5,
        "Highridge Twin-Aerie Empty Pen Hall rear-court-terrace",
        "gable"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 4,
    "name": "Glowmoth Long-Canopy Reed Sanctuary",
    "w": 58,
    "d": 73,
    "h": 14,
    "entry": 28,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        16,
        42,
        0,
        15
      ],
      [
        0,
        13,
        10,
        57
      ],
      [
        39,
        57,
        23,
        46
      ],
      [
        6,
        53,
        60,
        72
      ],
      [
        12,
        40,
        13,
        64
      ],
      [
        0,
        10,
        48,
        68
      ]
    ],
    "cuts": [
      [
        21,
        29,
        29,
        42
      ],
      [
        45,
        52,
        33,
        45
      ]
    ],
    "anchors": [
      [
        28,
        7
      ],
      [
        8,
        33
      ],
      [
        50,
        29
      ],
      [
        20,
        67
      ]
    ],
    "fixtures": [
      [
        32,
        7,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        10,
        35,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        51,
        31,
        "pack5:087",
        null,
        "empty-perch-source"
      ],
      [
        21,
        68,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "roofs": [
      [
        [
          16,
          42,
          0,
          15
        ],
        "x",
        4,
        "Glowmoth Long-Canopy Reed Sanctuary western-canopy",
        "terrace"
      ],
      [
        [
          0,
          13,
          10,
          57
        ],
        "z",
        7,
        "Glowmoth Long-Canopy Reed Sanctuary rear-corridor",
        "saw"
      ],
      [
        [
          39,
          57,
          23,
          46
        ],
        "x",
        5,
        "Glowmoth Long-Canopy Reed Sanctuary east-gallery",
        "gable"
      ],
      [
        [
          6,
          53,
          60,
          72
        ],
        "z",
        6,
        "Glowmoth Long-Canopy Reed Sanctuary source-weather-roof",
        "tower"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "snow",
    "size": "small",
    "variation": 4,
    "name": "Aurorafold Frost-Rune Atelier",
    "w": 54,
    "d": 61,
    "h": 16,
    "entry": 26,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        14,
        39,
        0,
        16
      ],
      [
        0,
        19,
        13,
        52
      ],
      [
        35,
        53,
        20,
        45
      ],
      [
        9,
        49,
        50,
        60
      ],
      [
        20,
        37,
        15,
        54
      ],
      [
        0,
        12,
        41,
        58
      ]
    ],
    "cuts": [
      [
        24,
        31,
        28,
        40
      ],
      [
        39,
        46,
        34,
        42
      ]
    ],
    "anchors": [
      [
        26,
        7
      ],
      [
        9,
        31
      ],
      [
        46,
        27
      ],
      [
        17,
        55
      ]
    ],
    "fixtures": [
      [
        30,
        7,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        11,
        33,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        47,
        29,
        "pack5:093",
        null,
        "inert-relic-source"
      ],
      [
        18,
        56,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "roofs": [
      [
        [
          14,
          39,
          0,
          16
        ],
        "x",
        7,
        "Aurorafold Frost-Rune Atelier front-astral-roof",
        "tower"
      ],
      [
        [
          0,
          19,
          13,
          52
        ],
        "z",
        5,
        "Aurorafold Frost-Rune Atelier western-covered-walk",
        "gable"
      ],
      [
        [
          35,
          53,
          20,
          45
        ],
        "x",
        6,
        "Aurorafold Frost-Rune Atelier east-service-tower",
        "saw"
      ],
      [
        [
          9,
          49,
          50,
          60
        ],
        "z",
        4,
        "Aurorafold Frost-Rune Atelier rear-court-terrace",
        "terrace"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "desert",
    "size": "large",
    "variation": 4,
    "name": "Embermirage Star-Chart Bazaar",
    "w": 88,
    "d": 71,
    "h": 17,
    "entry": 43,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        25,
        62,
        0,
        20
      ],
      [
        0,
        31,
        16,
        55
      ],
      [
        60,
        87,
        20,
        58
      ],
      [
        13,
        77,
        59,
        70
      ],
      [
        31,
        61,
        17,
        63
      ],
      [
        0,
        19,
        47,
        64
      ]
    ],
    "cuts": [
      [
        40,
        52,
        31,
        46
      ],
      [
        69,
        78,
        40,
        51
      ]
    ],
    "anchors": [
      [
        43,
        8
      ],
      [
        14,
        35
      ],
      [
        76,
        30
      ],
      [
        26,
        65
      ]
    ],
    "fixtures": [
      [
        47,
        8,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        16,
        37,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        77,
        32,
        "pack5:093",
        null,
        "inert-relic-source"
      ],
      [
        27,
        66,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "roofs": [
      [
        [
          25,
          62,
          0,
          20
        ],
        "x",
        5,
        "Embermirage Star-Chart Bazaar front-astral-roof",
        "gable"
      ],
      [
        [
          0,
          31,
          16,
          55
        ],
        "z",
        6,
        "Embermirage Star-Chart Bazaar western-covered-walk",
        "terrace"
      ],
      [
        [
          60,
          87,
          20,
          58
        ],
        "x",
        4,
        "Embermirage Star-Chart Bazaar east-service-tower",
        "tower"
      ],
      [
        [
          13,
          77,
          59,
          70
        ],
        "z",
        7,
        "Embermirage Star-Chart Bazaar rear-court-terrace",
        "saw"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "mountain",
    "size": "medium",
    "variation": 4,
    "name": "Shalebloom Switchback Distillery",
    "w": 68,
    "d": 68,
    "h": 15,
    "entry": 33,
    "wall": "pack1:005",
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
        25,
        13,
        55
      ],
      [
        47,
        67,
        20,
        52
      ],
      [
        10,
        60,
        57,
        67
      ],
      [
        24,
        46,
        15,
        60
      ],
      [
        0,
        15,
        45,
        62
      ]
    ],
    "cuts": [
      [
        30,
        39,
        26,
        39
      ],
      [
        53,
        61,
        36,
        47
      ]
    ],
    "anchors": [
      [
        33,
        7
      ],
      [
        12,
        34
      ],
      [
        58,
        29
      ],
      [
        22,
        63
      ]
    ],
    "fixtures": [
      [
        37,
        7,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        14,
        36,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        59,
        31,
        "pack5:089",
        null,
        "unlit-distillery-source"
      ],
      [
        23,
        64,
        "pack4:057",
        null,
        "archive-shelf-source"
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
        6,
        "Shalebloom Switchback Distillery front-astral-roof",
        "saw"
      ],
      [
        [
          0,
          25,
          13,
          55
        ],
        "z",
        4,
        "Shalebloom Switchback Distillery western-covered-walk",
        "tower"
      ],
      [
        [
          47,
          67,
          20,
          52
        ],
        "x",
        7,
        "Shalebloom Switchback Distillery east-service-tower",
        "terrace"
      ],
      [
        [
          10,
          60,
          57,
          67
        ],
        "z",
        5,
        "Shalebloom Switchback Distillery rear-court-terrace",
        "gable"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "temperate",
    "size": "large",
    "variation": 4,
    "name": "Sablebrook Four-Chimney Herb Guild",
    "w": 89,
    "d": 76,
    "h": 15,
    "entry": 44,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        26,
        63,
        0,
        19
      ],
      [
        0,
        33,
        15,
        58
      ],
      [
        63,
        88,
        20,
        61
      ],
      [
        14,
        78,
        64,
        75
      ],
      [
        30,
        62,
        17,
        67
      ],
      [
        2,
        19,
        51,
        70
      ]
    ],
    "cuts": [
      [
        39,
        53,
        33,
        47
      ],
      [
        70,
        78,
        38,
        49
      ]
    ],
    "anchors": [
      [
        44,
        8
      ],
      [
        15,
        36
      ],
      [
        76,
        30
      ],
      [
        26,
        70
      ]
    ],
    "fixtures": [
      [
        48,
        8,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        17,
        38,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        77,
        32,
        "pack5:089",
        null,
        "unlit-distillery-source"
      ],
      [
        27,
        71,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "roofs": [
      [
        [
          26,
          63,
          0,
          19
        ],
        "x",
        4,
        "Sablebrook Four-Chimney Herb Guild front-astral-roof",
        "terrace"
      ],
      [
        [
          0,
          33,
          15,
          58
        ],
        "z",
        7,
        "Sablebrook Four-Chimney Herb Guild western-covered-walk",
        "saw"
      ],
      [
        [
          63,
          88,
          20,
          61
        ],
        "x",
        5,
        "Sablebrook Four-Chimney Herb Guild east-service-tower",
        "gable"
      ],
      [
        [
          14,
          78,
          64,
          75
        ],
        "z",
        6,
        "Sablebrook Four-Chimney Herb Guild rear-court-terrace",
        "tower"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "snow",
    "size": "small",
    "variation": 4,
    "name": "Rimewhorl Long-Rear Oven Corridor",
    "w": 46,
    "d": 69,
    "h": 12,
    "entry": 22,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        11,
        34,
        0,
        13
      ],
      [
        0,
        13,
        10,
        57
      ],
      [
        31,
        45,
        21,
        45
      ],
      [
        6,
        41,
        59,
        68
      ],
      [
        14,
        33,
        12,
        63
      ],
      [
        0,
        9,
        47,
        65
      ]
    ],
    "cuts": [
      [
        19,
        25,
        30,
        41
      ],
      [
        34,
        40,
        33,
        43
      ]
    ],
    "anchors": [
      [
        22,
        7
      ],
      [
        7,
        30
      ],
      [
        38,
        25
      ],
      [
        17,
        64
      ]
    ],
    "fixtures": [
      [
        26,
        7,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        9,
        32,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        39,
        27,
        "pack5:090",
        null,
        "cold-oven-source"
      ],
      [
        18,
        65,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "roofs": [
      [
        [
          11,
          34,
          0,
          13
        ],
        "x",
        7,
        "Rimewhorl Long-Rear Oven Corridor western-canopy",
        "tower"
      ],
      [
        [
          0,
          13,
          10,
          57
        ],
        "z",
        5,
        "Rimewhorl Long-Rear Oven Corridor rear-corridor",
        "gable"
      ],
      [
        [
          31,
          45,
          21,
          45
        ],
        "x",
        6,
        "Rimewhorl Long-Rear Oven Corridor east-gallery",
        "saw"
      ],
      [
        [
          6,
          41,
          59,
          68
        ],
        "z",
        4,
        "Rimewhorl Long-Rear Oven Corridor source-weather-roof",
        "terrace"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 4,
    "name": "Moonpollen Two-Oven Gallery",
    "w": 68,
    "d": 69,
    "h": 13,
    "entry": 34,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        18,
        50,
        0,
        17
      ],
      [
        0,
        25,
        14,
        55
      ],
      [
        45,
        67,
        20,
        52
      ],
      [
        11,
        61,
        56,
        68
      ],
      [
        23,
        50,
        15,
        60
      ],
      [
        0,
        15,
        45,
        63
      ]
    ],
    "cuts": [
      [
        32,
        40,
        27,
        40
      ],
      [
        54,
        61,
        35,
        44
      ]
    ],
    "anchors": [
      [
        34,
        7
      ],
      [
        12,
        35
      ],
      [
        57,
        29
      ],
      [
        23,
        64
      ]
    ],
    "fixtures": [
      [
        38,
        7,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        14,
        37,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        58,
        31,
        "pack5:090",
        null,
        "cold-oven-source"
      ],
      [
        24,
        65,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "roofs": [
      [
        [
          18,
          50,
          0,
          17
        ],
        "x",
        5,
        "Moonpollen Two-Oven Gallery front-astral-roof",
        "gable"
      ],
      [
        [
          0,
          25,
          14,
          55
        ],
        "z",
        6,
        "Moonpollen Two-Oven Gallery western-covered-walk",
        "terrace"
      ],
      [
        [
          45,
          67,
          20,
          52
        ],
        "x",
        4,
        "Moonpollen Two-Oven Gallery east-service-tower",
        "tower"
      ],
      [
        [
          11,
          61,
          56,
          68
        ],
        "z",
        7,
        "Moonpollen Two-Oven Gallery rear-court-terrace",
        "saw"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "desert",
    "size": "small",
    "variation": 1,
    "name": "Copperhollow Crescent Counting Bank",
    "w": 55,
    "d": 61,
    "h": 15,
    "entry": 26,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        14,
        40,
        0,
        19
      ],
      [
        0,
        19,
        15,
        48
      ],
      [
        36,
        54,
        21,
        48
      ],
      [
        9,
        49,
        49,
        60
      ],
      [
        20,
        39,
        16,
        52
      ],
      [
        0,
        12,
        39,
        56
      ]
    ],
    "cuts": [
      [
        24,
        31,
        24,
        33
      ],
      [
        4,
        10,
        32,
        38
      ]
    ],
    "anchors": [
      [
        26,
        7
      ],
      [
        13,
        26
      ],
      [
        45,
        38
      ],
      [
        18,
        55
      ]
    ],
    "fixtures": [
      [
        30,
        7,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        15,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        46,
        40,
        "pack5:086",
        "ledger-service",
        "second-teller-source"
      ],
      [
        19,
        56,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "vault": [
      38,
      51,
      29,
      46,
      35,
      36
    ],
    "roofs": [
      [
        [
          14,
          40,
          0,
          19
        ],
        "x",
        6,
        "Copperhollow Crescent Counting Bank front-astral-roof",
        "saw"
      ],
      [
        [
          0,
          19,
          15,
          48
        ],
        "z",
        4,
        "Copperhollow Crescent Counting Bank western-covered-walk",
        "tower"
      ],
      [
        [
          36,
          54,
          21,
          48
        ],
        "x",
        7,
        "Copperhollow Crescent Counting Bank east-service-tower",
        "terrace"
      ],
      [
        [
          9,
          49,
          49,
          60
        ],
        "z",
        5,
        "Copperhollow Crescent Counting Bank rear-court-terrace",
        "gable"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "snow",
    "size": "medium",
    "variation": 2,
    "name": "Iceharbor Bridged-West Ledger Fortress",
    "w": 77,
    "d": 72,
    "h": 16,
    "entry": 38,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        22,
        54,
        0,
        18
      ],
      [
        0,
        27,
        15,
        60
      ],
      [
        52,
        76,
        21,
        55
      ],
      [
        11,
        68,
        61,
        71
      ],
      [
        24,
        50,
        15,
        63
      ],
      [
        0,
        16,
        50,
        66
      ],
      [
        48,
        60,
        17,
        30
      ]
    ],
    "cuts": [
      [
        32,
        43,
        30,
        43
      ],
      [
        4,
        12,
        37,
        46
      ]
    ],
    "anchors": [
      [
        38,
        8
      ],
      [
        12,
        33
      ],
      [
        64,
        38
      ],
      [
        23,
        67
      ]
    ],
    "fixtures": [
      [
        42,
        8,
        "pack5:086",
        "ledger-service",
        "real-source-service-counter"
      ],
      [
        17,
        31,
        "pack5:091",
        "cartographers-oak-desk",
        "source-inventory-records"
      ],
      [
        65,
        40,
        "pack5:086",
        "ledger-service",
        "second-teller-source"
      ],
      [
        24,
        68,
        "pack4:057",
        null,
        "archive-shelf-source"
      ]
    ],
    "vault": [
      57,
      72,
      28,
      50,
      34,
      35
    ],
    "roofs": [
      [
        [
          22,
          54,
          0,
          18
        ],
        "x",
        4,
        "Iceharbor Bridged-West Ledger Fortress winter-entry-gable",
        "terrace"
      ],
      [
        [
          0,
          27,
          15,
          60
        ],
        "z",
        7,
        "Iceharbor Bridged-West Ledger Fortress west-library-longspan",
        "saw"
      ],
      [
        [
          52,
          76,
          21,
          55
        ],
        "x",
        5,
        "Iceharbor Bridged-West Ledger Fortress vault-bridge-upper-bay",
        "gable"
      ],
      [
        [
          11,
          68,
          61,
          71
        ],
        "z",
        6,
        "Iceharbor Bridged-West Ledger Fortress rear-ledger-gallery",
        "tower"
      ]
    ]
  }
]);
export const ROADMAP_A_WAVE11_SHOPS=Object.freeze(ROADMAP_A_WAVE11_SPECS.map(s=>{const bp=author2ALandmark(s);validateBlueprint(bp);return bp;}));
export const ROADMAP_A_WAVE11_IDS=Object.freeze(ROADMAP_A_WAVE11_SHOPS.map(b=>b.id));
