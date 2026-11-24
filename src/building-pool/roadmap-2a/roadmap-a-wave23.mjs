/** Wave23 original source-only commerce: independent ridge, bridge and corridor footprints; no physical or production approval. */
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const ROADMAP_A_WAVE23_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 4,
    "name": "Wispquay Long Three-Gate Supply Gallery",
    "w": 62,
    "d": 123,
    "h": 14,
    "entry": 30,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack5:080",
    "rects": [
      [
        9,
        51,
        0,
        22
      ],
      [
        0,
        21,
        18,
        58
      ],
      [
        40,
        61,
        73,
        99
      ],
      [
        9,
        52,
        104,
        122
      ],
      [
        18,
        39,
        19,
        77
      ],
      [
        31,
        45,
        67,
        108
      ],
      [
        0,
        14,
        61,
        80
      ],
      [
        43,
        61,
        40,
        53
      ]
    ],
    "cuts": [
      [
        23,
        30,
        29,
        45
      ],
      [
        32,
        38,
        80,
        91
      ],
      [
        20,
        28,
        111,
        116
      ]
    ],
    "anchors": [
      [
        30,
        7
      ],
      [
        10,
        38
      ],
      [
        50,
        86
      ],
      [
        30,
        113
      ]
    ],
    "fixtures": [
      [
        32,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        12,
        39,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        52,
        87,
        "pack5:087",
        null,
        "specialist-display"
      ],
      [
        32,
        114,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          9,
          51,
          0,
          22
        ],
        "x",
        5,
        "Wispquay Long Three-Gate Supply Gallery front canopy",
        "gable"
      ],
      [
        [
          0,
          21,
          18,
          58
        ],
        "z",
        6,
        "Wispquay Long Three-Gate Supply Gallery west workshop",
        "saw"
      ],
      [
        [
          40,
          61,
          73,
          99
        ],
        "x",
        7,
        "Wispquay Long Three-Gate Supply Gallery east gallery",
        "terrace"
      ],
      [
        [
          9,
          52,
          104,
          122
        ],
        "z",
        8,
        "Wispquay Long Three-Gate Supply Gallery rear store",
        "tower"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "temperate",
    "size": "small",
    "variation": 4,
    "name": "Hazelfox Crosswood Resting Lodge",
    "w": 89,
    "d": 61,
    "h": 12,
    "entry": 24,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        4,
        46,
        0,
        17
      ],
      [
        0,
        20,
        14,
        40
      ],
      [
        68,
        88,
        32,
        54
      ],
      [
        28,
        71,
        47,
        60
      ],
      [
        15,
        47,
        30,
        43
      ],
      [
        32,
        49,
        15,
        34
      ],
      [
        42,
        73,
        37,
        49
      ],
      [
        53,
        75,
        45,
        54
      ]
    ],
    "cuts": [
      [
        35,
        41,
        22,
        27
      ],
      [
        22,
        29,
        32,
        37
      ],
      [
        7,
        13,
        24,
        30
      ]
    ],
    "anchors": [
      [
        24,
        7
      ],
      [
        10,
        32
      ],
      [
        78,
        43
      ],
      [
        49,
        53
      ]
    ],
    "fixtures": [
      [
        26,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        12,
        33,
        "pack5:091",
        "cartographers-oak-desk",
        "empty-stall-ledger"
      ],
      [
        80,
        44,
        "pack5:087",
        null,
        "unoccupied-animal-display"
      ],
      [
        51,
        54,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          46,
          0,
          17
        ],
        "x",
        5,
        "Hazelfox Crosswood Resting Lodge front canopy",
        "gable"
      ],
      [
        [
          0,
          20,
          14,
          40
        ],
        "z",
        6,
        "Hazelfox Crosswood Resting Lodge west workshop",
        "saw"
      ],
      [
        [
          68,
          88,
          32,
          54
        ],
        "x",
        7,
        "Hazelfox Crosswood Resting Lodge east gallery",
        "terrace"
      ],
      [
        [
          28,
          71,
          47,
          60
        ],
        "z",
        8,
        "Hazelfox Crosswood Resting Lodge rear store",
        "tower"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "snow",
    "size": "medium",
    "variation": 4,
    "name": "Frostowl Twin-Corridor Habitat Gallery",
    "w": 49,
    "d": 124,
    "h": 14,
    "entry": 24,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        5,
        42,
        0,
        22
      ],
      [
        0,
        17,
        18,
        62
      ],
      [
        32,
        48,
        72,
        104
      ],
      [
        6,
        41,
        107,
        123
      ],
      [
        15,
        34,
        19,
        113
      ],
      [
        0,
        12,
        66,
        84
      ],
      [
        35,
        48,
        36,
        48
      ],
      [
        24,
        40,
        94,
        110
      ]
    ],
    "cuts": [
      [
        20,
        26,
        32,
        49
      ],
      [
        21,
        27,
        77,
        90
      ],
      [
        15,
        22,
        113,
        117
      ]
    ],
    "anchors": [
      [
        24,
        7
      ],
      [
        8,
        40
      ],
      [
        40,
        88
      ],
      [
        24,
        115
      ]
    ],
    "fixtures": [
      [
        26,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        10,
        41,
        "pack5:091",
        "cartographers-oak-desk",
        "empty-stall-ledger"
      ],
      [
        42,
        89,
        "pack5:087",
        null,
        "unoccupied-animal-display"
      ],
      [
        26,
        116,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          42,
          0,
          22
        ],
        "x",
        5,
        "Frostowl Twin-Corridor Habitat Gallery front canopy",
        "gable"
      ],
      [
        [
          0,
          17,
          18,
          62
        ],
        "z",
        6,
        "Frostowl Twin-Corridor Habitat Gallery west workshop",
        "saw"
      ],
      [
        [
          32,
          48,
          72,
          104
        ],
        "x",
        7,
        "Frostowl Twin-Corridor Habitat Gallery east gallery",
        "terrace"
      ],
      [
        [
          6,
          41,
          107,
          123
        ],
        "z",
        8,
        "Frostowl Twin-Corridor Habitat Gallery rear store",
        "tower"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "desert",
    "size": "large",
    "variation": 1,
    "name": "Oasisstag Distant Shade Pavilion Sanctuary",
    "w": 138,
    "d": 100,
    "h": 16,
    "entry": 28,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        5,
        53,
        0,
        23
      ],
      [
        0,
        27,
        19,
        61
      ],
      [
        110,
        137,
        43,
        79
      ],
      [
        45,
        119,
        82,
        99
      ],
      [
        18,
        58,
        44,
        58
      ],
      [
        39,
        58,
        19,
        46
      ],
      [
        53,
        114,
        49,
        64
      ],
      [
        96,
        120,
        61,
        86
      ],
      [
        20,
        44,
        58,
        83
      ]
    ],
    "cuts": [
      [
        42,
        49,
        28,
        34
      ],
      [
        65,
        80,
        52,
        58
      ],
      [
        59,
        73,
        88,
        93
      ]
    ],
    "anchors": [
      [
        28,
        7
      ],
      [
        13,
        40
      ],
      [
        123,
        61
      ],
      [
        82,
        90
      ]
    ],
    "fixtures": [
      [
        30,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        15,
        41,
        "pack5:091",
        "cartographers-oak-desk",
        "empty-stall-ledger"
      ],
      [
        125,
        62,
        "pack5:087",
        null,
        "unoccupied-animal-display"
      ],
      [
        84,
        91,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          53,
          0,
          23
        ],
        "x",
        6,
        "Oasisstag Distant Shade Pavilion Sanctuary front canopy",
        "saw"
      ],
      [
        [
          0,
          27,
          19,
          61
        ],
        "z",
        7,
        "Oasisstag Distant Shade Pavilion Sanctuary west workshop",
        "terrace"
      ],
      [
        [
          110,
          137,
          43,
          79
        ],
        "x",
        8,
        "Oasisstag Distant Shade Pavilion Sanctuary east gallery",
        "tower"
      ],
      [
        [
          45,
          119,
          82,
          99
        ],
        "z",
        5,
        "Oasisstag Distant Shade Pavilion Sanctuary rear store",
        "gable"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "mountain",
    "size": "small",
    "variation": 4,
    "name": "Slateglyph Long Bent Rune Cottage",
    "w": 44,
    "d": 97,
    "h": 12,
    "entry": 21,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        3,
        38,
        0,
        19
      ],
      [
        0,
        15,
        15,
        50
      ],
      [
        29,
        43,
        56,
        79
      ],
      [
        5,
        36,
        81,
        96
      ],
      [
        13,
        31,
        16,
        87
      ],
      [
        0,
        11,
        55,
        70
      ],
      [
        32,
        43,
        30,
        41
      ]
    ],
    "cuts": [
      [
        18,
        23,
        27,
        46
      ],
      [
        12,
        19,
        88,
        92
      ]
    ],
    "anchors": [
      [
        21,
        7
      ],
      [
        7,
        32
      ],
      [
        36,
        67
      ],
      [
        20,
        87
      ]
    ],
    "fixtures": [
      [
        23,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        9,
        33,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        38,
        68,
        "pack5:093",
        null,
        "specialist-display"
      ],
      [
        22,
        88,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          3,
          38,
          0,
          19
        ],
        "x",
        5,
        "Slateglyph Long Bent Rune Cottage front canopy",
        "gable"
      ],
      [
        [
          0,
          15,
          15,
          50
        ],
        "z",
        6,
        "Slateglyph Long Bent Rune Cottage west workshop",
        "saw"
      ],
      [
        [
          29,
          43,
          56,
          79
        ],
        "x",
        7,
        "Slateglyph Long Bent Rune Cottage east gallery",
        "terrace"
      ],
      [
        [
          5,
          36,
          81,
          96
        ],
        "z",
        8,
        "Slateglyph Long Bent Rune Cottage rear store",
        "tower"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "temperate",
    "size": "medium",
    "variation": 2,
    "name": "Birchstar Far-Arm Rune Gallery",
    "w": 119,
    "d": 76,
    "h": 14,
    "entry": 26,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        5,
        49,
        0,
        21
      ],
      [
        0,
        24,
        17,
        51
      ],
      [
        96,
        118,
        34,
        60
      ],
      [
        39,
        103,
        58,
        75
      ],
      [
        17,
        52,
        36,
        49
      ],
      [
        38,
        57,
        18,
        41
      ],
      [
        49,
        101,
        42,
        55
      ],
      [
        82,
        104,
        53,
        63
      ]
    ],
    "cuts": [
      [
        42,
        49,
        26,
        32
      ],
      [
        64,
        77,
        45,
        49
      ],
      [
        53,
        65,
        64,
        69
      ]
    ],
    "anchors": [
      [
        26,
        7
      ],
      [
        12,
        34
      ],
      [
        107,
        47
      ],
      [
        71,
        66
      ]
    ],
    "fixtures": [
      [
        28,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        14,
        35,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        109,
        48,
        "pack5:093",
        null,
        "specialist-display"
      ],
      [
        73,
        67,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          49,
          0,
          21
        ],
        "x",
        7,
        "Birchstar Far-Arm Rune Gallery front canopy",
        "terrace"
      ],
      [
        [
          0,
          24,
          17,
          51
        ],
        "z",
        8,
        "Birchstar Far-Arm Rune Gallery west workshop",
        "tower"
      ],
      [
        [
          96,
          118,
          34,
          60
        ],
        "x",
        5,
        "Birchstar Far-Arm Rune Gallery east gallery",
        "gable"
      ],
      [
        [
          39,
          103,
          58,
          75
        ],
        "z",
        6,
        "Birchstar Far-Arm Rune Gallery rear store",
        "saw"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "mountain",
    "size": "large",
    "variation": 4,
    "name": "Highprism Three-Bridge Astral Archive",
    "w": 89,
    "d": 151,
    "h": 16,
    "entry": 44,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        12,
        76,
        0,
        27
      ],
      [
        0,
        32,
        23,
        75
      ],
      [
        61,
        88,
        87,
        121
      ],
      [
        14,
        76,
        124,
        150
      ],
      [
        30,
        63,
        23,
        134
      ],
      [
        0,
        22,
        79,
        106
      ],
      [
        63,
        88,
        43,
        62
      ],
      [
        47,
        74,
        114,
        132
      ]
    ],
    "cuts": [
      [
        37,
        48,
        36,
        55
      ],
      [
        38,
        48,
        84,
        101
      ],
      [
        27,
        38,
        136,
        143
      ]
    ],
    "anchors": [
      [
        44,
        7
      ],
      [
        16,
        49
      ],
      [
        74,
        104
      ],
      [
        45,
        137
      ]
    ],
    "fixtures": [
      [
        46,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        18,
        50,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        76,
        105,
        "pack5:093",
        null,
        "specialist-display"
      ],
      [
        47,
        138,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          12,
          76,
          0,
          27
        ],
        "x",
        5,
        "Highprism Three-Bridge Astral Archive front canopy",
        "gable"
      ],
      [
        [
          0,
          32,
          23,
          75
        ],
        "z",
        6,
        "Highprism Three-Bridge Astral Archive west workshop",
        "saw"
      ],
      [
        [
          61,
          88,
          87,
          121
        ],
        "x",
        7,
        "Highprism Three-Bridge Astral Archive east gallery",
        "terrace"
      ],
      [
        [
          14,
          76,
          124,
          150
        ],
        "z",
        8,
        "Highprism Three-Bridge Astral Archive rear store",
        "tower"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "temperate",
    "size": "small",
    "variation": 2,
    "name": "Meadowbalm Bent Root Infusion Lodge",
    "w": 95,
    "d": 58,
    "h": 12,
    "entry": 24,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        4,
        45,
        0,
        18
      ],
      [
        0,
        20,
        15,
        41
      ],
      [
        73,
        94,
        29,
        51
      ],
      [
        27,
        75,
        45,
        57
      ],
      [
        14,
        47,
        30,
        44
      ],
      [
        32,
        49,
        16,
        34
      ],
      [
        43,
        78,
        37,
        48
      ],
      [
        57,
        80,
        44,
        53
      ]
    ],
    "cuts": [
      [
        35,
        41,
        23,
        29
      ],
      [
        22,
        30,
        34,
        38
      ],
      [
        7,
        13,
        25,
        31
      ]
    ],
    "anchors": [
      [
        24,
        7
      ],
      [
        10,
        33
      ],
      [
        83,
        40
      ],
      [
        51,
        51
      ]
    ],
    "fixtures": [
      [
        26,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        12,
        34,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        85,
        41,
        "pack5:089",
        null,
        "specialist-display"
      ],
      [
        53,
        52,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          45,
          0,
          18
        ],
        "x",
        7,
        "Meadowbalm Bent Root Infusion Lodge front canopy",
        "terrace"
      ],
      [
        [
          0,
          20,
          15,
          41
        ],
        "z",
        8,
        "Meadowbalm Bent Root Infusion Lodge west workshop",
        "tower"
      ],
      [
        [
          73,
          94,
          29,
          51
        ],
        "x",
        5,
        "Meadowbalm Bent Root Infusion Lodge east gallery",
        "gable"
      ],
      [
        [
          27,
          75,
          45,
          57
        ],
        "z",
        6,
        "Meadowbalm Bent Root Infusion Lodge rear store",
        "saw"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "temperate",
    "size": "medium",
    "variation": 4,
    "name": "Oakthyme Long Split-Basin Stillhouse",
    "w": 51,
    "d": 126,
    "h": 14,
    "entry": 25,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        5,
        44,
        0,
        23
      ],
      [
        0,
        18,
        19,
        63
      ],
      [
        34,
        50,
        74,
        105
      ],
      [
        6,
        43,
        109,
        125
      ],
      [
        16,
        36,
        20,
        115
      ],
      [
        0,
        13,
        67,
        86
      ],
      [
        37,
        50,
        36,
        49
      ],
      [
        25,
        42,
        96,
        113
      ]
    ],
    "cuts": [
      [
        21,
        28,
        32,
        50
      ],
      [
        22,
        29,
        78,
        92
      ],
      [
        15,
        23,
        115,
        120
      ]
    ],
    "anchors": [
      [
        25,
        7
      ],
      [
        9,
        41
      ],
      [
        42,
        89
      ],
      [
        25,
        117
      ]
    ],
    "fixtures": [
      [
        27,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        11,
        42,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        44,
        90,
        "pack5:089",
        null,
        "specialist-display"
      ],
      [
        27,
        118,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          44,
          0,
          23
        ],
        "x",
        5,
        "Oakthyme Long Split-Basin Stillhouse front canopy",
        "gable"
      ],
      [
        [
          0,
          18,
          19,
          63
        ],
        "z",
        6,
        "Oakthyme Long Split-Basin Stillhouse west workshop",
        "saw"
      ],
      [
        [
          34,
          50,
          74,
          105
        ],
        "x",
        7,
        "Oakthyme Long Split-Basin Stillhouse east gallery",
        "terrace"
      ],
      [
        [
          6,
          43,
          109,
          125
        ],
        "z",
        8,
        "Oakthyme Long Split-Basin Stillhouse rear store",
        "tower"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "snow",
    "size": "small",
    "variation": 5,
    "name": "Rimeyeast Three-Corner Hearth Lodge",
    "w": 85,
    "d": 68,
    "h": 12,
    "entry": 23,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        4,
        45,
        0,
        18
      ],
      [
        0,
        19,
        15,
        43
      ],
      [
        64,
        84,
        38,
        59
      ],
      [
        27,
        68,
        52,
        67
      ],
      [
        13,
        45,
        32,
        46
      ],
      [
        32,
        48,
        16,
        37
      ],
      [
        42,
        70,
        42,
        54
      ],
      [
        52,
        73,
        50,
        58
      ]
    ],
    "cuts": [
      [
        35,
        42,
        24,
        29
      ],
      [
        22,
        29,
        35,
        40
      ],
      [
        7,
        13,
        27,
        33
      ]
    ],
    "anchors": [
      [
        23,
        7
      ],
      [
        9,
        24
      ],
      [
        74,
        48
      ],
      [
        47,
        59
      ]
    ],
    "fixtures": [
      [
        25,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        11,
        25,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        76,
        49,
        "pack5:085",
        null,
        "specialist-display"
      ],
      [
        49,
        60,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          4,
          45,
          0,
          18
        ],
        "x",
        6,
        "Rimeyeast Three-Corner Hearth Lodge front canopy",
        "saw"
      ],
      [
        [
          0,
          19,
          15,
          43
        ],
        "z",
        7,
        "Rimeyeast Three-Corner Hearth Lodge west workshop",
        "terrace"
      ],
      [
        [
          64,
          84,
          38,
          59
        ],
        "x",
        8,
        "Rimeyeast Three-Corner Hearth Lodge east gallery",
        "tower"
      ],
      [
        [
          27,
          68,
          52,
          67
        ],
        "z",
        5,
        "Rimeyeast Three-Corner Hearth Lodge rear store",
        "gable"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "desert",
    "size": "medium",
    "variation": 2,
    "name": "Duneflour Long Three-Spur Oven Gallery",
    "w": 63,
    "d": 130,
    "h": 14,
    "entry": 31,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        8,
        53,
        0,
        23
      ],
      [
        0,
        22,
        19,
        61
      ],
      [
        41,
        62,
        77,
        103
      ],
      [
        9,
        54,
        110,
        129
      ],
      [
        19,
        40,
        20,
        81
      ],
      [
        32,
        46,
        71,
        114
      ],
      [
        0,
        15,
        65,
        85
      ],
      [
        44,
        62,
        42,
        56
      ]
    ],
    "cuts": [
      [
        24,
        31,
        31,
        48
      ],
      [
        33,
        39,
        84,
        96
      ],
      [
        21,
        29,
        117,
        122
      ]
    ],
    "anchors": [
      [
        31,
        7
      ],
      [
        11,
        40
      ],
      [
        51,
        90
      ],
      [
        31,
        119
      ]
    ],
    "fixtures": [
      [
        33,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        13,
        41,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        53,
        91,
        "pack5:085",
        null,
        "specialist-display"
      ],
      [
        33,
        120,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          8,
          53,
          0,
          23
        ],
        "x",
        7,
        "Duneflour Long Three-Spur Oven Gallery front canopy",
        "terrace"
      ],
      [
        [
          0,
          22,
          19,
          61
        ],
        "z",
        8,
        "Duneflour Long Three-Spur Oven Gallery west workshop",
        "tower"
      ],
      [
        [
          41,
          62,
          77,
          103
        ],
        "x",
        5,
        "Duneflour Long Three-Spur Oven Gallery east gallery",
        "gable"
      ],
      [
        [
          9,
          54,
          110,
          129
        ],
        "z",
        6,
        "Duneflour Long Three-Spur Oven Gallery rear store",
        "saw"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "snow",
    "size": "large",
    "variation": 2,
    "name": "Frostbarley Far-Ridge Hearth Exchange",
    "w": 145,
    "d": 105,
    "h": 16,
    "entry": 29,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        5,
        55,
        0,
        24
      ],
      [
        0,
        28,
        20,
        64
      ],
      [
        116,
        144,
        45,
        82
      ],
      [
        44,
        125,
        86,
        104
      ],
      [
        18,
        61,
        46,
        61
      ],
      [
        40,
        61,
        20,
        49
      ],
      [
        54,
        120,
        52,
        67
      ],
      [
        101,
        126,
        65,
        90
      ],
      [
        20,
        45,
        61,
        87
      ]
    ],
    "cuts": [
      [
        43,
        51,
        29,
        35
      ],
      [
        66,
        82,
        55,
        61
      ],
      [
        60,
        75,
        93,
        98
      ]
    ],
    "anchors": [
      [
        29,
        7
      ],
      [
        14,
        42
      ],
      [
        130,
        63
      ],
      [
        84,
        95
      ]
    ],
    "fixtures": [
      [
        31,
        8,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        16,
        43,
        "pack5:091",
        "cartographers-oak-desk",
        "specialist-workspace"
      ],
      [
        132,
        64,
        "pack5:085",
        null,
        "specialist-display"
      ],
      [
        86,
        96,
        "pack4:057",
        null,
        "reserve-storage"
      ]
    ],
    "roofs": [
      [
        [
          5,
          55,
          0,
          24
        ],
        "x",
        7,
        "Frostbarley Far-Ridge Hearth Exchange front canopy",
        "terrace"
      ],
      [
        [
          0,
          28,
          20,
          64
        ],
        "z",
        8,
        "Frostbarley Far-Ridge Hearth Exchange west workshop",
        "tower"
      ],
      [
        [
          116,
          144,
          45,
          82
        ],
        "x",
        5,
        "Frostbarley Far-Ridge Hearth Exchange east gallery",
        "gable"
      ],
      [
        [
          44,
          125,
          86,
          104
        ],
        "z",
        6,
        "Frostbarley Far-Ridge Hearth Exchange rear store",
        "saw"
      ]
    ]
  }
]);
export const ROADMAP_A_WAVE23_SHOPS=Object.freeze(ROADMAP_A_WAVE23_SPECS.map(s=>{const bp=author2ALandmark(s);validateBlueprint(bp);return bp;}));
export const ROADMAP_A_WAVE23_IDS=Object.freeze(ROADMAP_A_WAVE23_SHOPS.map(b=>b.id));
