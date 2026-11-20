// Roadmap A Commerce Wave07 source-only: 12 original irregular multiwing plans, no game installation.
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const ROADMAP_A_WAVE07_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "desert",
    "size": "large",
    "variation": 5,
    "name": "Ambercaravan Crosswind Bazaar",
    "w": 72,
    "d": 55,
    "h": 13,
    "entry": 35,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        13,
        61,
        0,
        14
      ],
      [
        0,
        24,
        10,
        50
      ],
      [
        48,
        71,
        12,
        48
      ],
      [
        10,
        63,
        48,
        54
      ],
      [
        19,
        52,
        14,
        44
      ]
    ],
    "cuts": [
      [
        27,
        41,
        21,
        36
      ]
    ],
    "anchors": [
      [
        35,
        6
      ],
      [
        12,
        30
      ],
      [
        60,
        27
      ],
      [
        24,
        51
      ]
    ],
    "fixtures": [
      [
        39,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        14,
        31,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        58,
        29,
        "pack5:087",
        null,
        "specialist-display"
      ],
      [
        25,
        52,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          13,
          61,
          0,
          14
        ],
        "x",
        9,
        "Ambercaravan Crosswind Bazaar independent roof 1",
        "terrace"
      ],
      [
        [
          0,
          24,
          10,
          50
        ],
        "z",
        7,
        "Ambercaravan Crosswind Bazaar independent roof 2",
        "tower"
      ],
      [
        [
          10,
          63,
          48,
          54
        ],
        "x",
        5,
        "Ambercaravan Crosswind Bazaar independent roof 3",
        "saw"
      ],
      [
        [
          48,
          71,
          12,
          48
        ],
        "z",
        6,
        "Ambercaravan Crosswind Bazaar independent roof 4",
        "gable"
      ]
    ]
  },
  {
    "category": "general-store",
    "biome": "snow",
    "size": "medium",
    "variation": 5,
    "name": "Snowbridge Narrow Tradehouse",
    "w": 55,
    "d": 52,
    "h": 15,
    "entry": 28,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        12,
        44,
        0,
        12
      ],
      [
        0,
        20,
        10,
        45
      ],
      [
        34,
        54,
        14,
        50
      ],
      [
        8,
        48,
        45,
        51
      ],
      [
        18,
        43,
        12,
        44
      ]
    ],
    "cuts": [
      [
        23,
        32,
        20,
        33
      ]
    ],
    "anchors": [
      [
        28,
        6
      ],
      [
        10,
        29
      ],
      [
        43,
        29
      ],
      [
        22,
        48
      ]
    ],
    "fixtures": [
      [
        32,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        12,
        30,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        41,
        31,
        "pack5:087",
        null,
        "specialist-display"
      ],
      [
        23,
        49,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          12,
          44,
          0,
          12
        ],
        "x",
        9,
        "Snowbridge Narrow Tradehouse independent roof 1",
        "tower"
      ],
      [
        [
          0,
          20,
          10,
          45
        ],
        "z",
        7,
        "Snowbridge Narrow Tradehouse independent roof 2",
        "gable"
      ],
      [
        [
          8,
          48,
          45,
          51
        ],
        "x",
        5,
        "Snowbridge Narrow Tradehouse independent roof 3",
        "terrace"
      ],
      [
        [
          34,
          54,
          14,
          50
        ],
        "z",
        6,
        "Snowbridge Narrow Tradehouse independent roof 4",
        "saw"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "temperate",
    "size": "small",
    "variation": 5,
    "name": "Whistlemere Companion Stalls",
    "w": 54,
    "d": 37,
    "h": 11,
    "entry": 26,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        12,
        44,
        0,
        11
      ],
      [
        0,
        18,
        8,
        31
      ],
      [
        39,
        53,
        10,
        33
      ],
      [
        11,
        47,
        31,
        36
      ],
      [
        17,
        44,
        10,
        32
      ]
    ],
    "cuts": [
      [
        23,
        36,
        16,
        25
      ]
    ],
    "anchors": [
      [
        26,
        6
      ],
      [
        10,
        23
      ],
      [
        44,
        24
      ],
      [
        20,
        33
      ]
    ],
    "fixtures": [
      [
        30,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        12,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        42,
        26,
        "pack5:087",
        null,
        "specialist-display"
      ],
      [
        21,
        34,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          12,
          44,
          0,
          11
        ],
        "x",
        9,
        "Whistlemere Companion Stalls independent roof 1",
        "saw"
      ],
      [
        [
          0,
          18,
          8,
          31
        ],
        "z",
        7,
        "Whistlemere Companion Stalls independent roof 2",
        "terrace"
      ],
      [
        [
          11,
          47,
          31,
          36
        ],
        "x",
        5,
        "Whistlemere Companion Stalls independent roof 3",
        "gable"
      ],
      [
        [
          39,
          53,
          10,
          33
        ],
        "z",
        6,
        "Whistlemere Companion Stalls independent roof 4",
        "tower"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 5,
    "name": "Lanternroot Open Aviary Courts",
    "w": 61,
    "d": 57,
    "h": 13,
    "entry": 30,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        14,
        48,
        0,
        13
      ],
      [
        0,
        25,
        11,
        51
      ],
      [
        39,
        60,
        14,
        50
      ],
      [
        13,
        52,
        50,
        56
      ],
      [
        22,
        45,
        12,
        49
      ]
    ],
    "cuts": [
      [
        29,
        37,
        24,
        40
      ]
    ],
    "anchors": [
      [
        30,
        6
      ],
      [
        11,
        32
      ],
      [
        51,
        32
      ],
      [
        25,
        53
      ]
    ],
    "fixtures": [
      [
        34,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        13,
        33,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        49,
        34,
        "pack5:087",
        null,
        "specialist-display"
      ],
      [
        26,
        54,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          14,
          48,
          0,
          13
        ],
        "x",
        9,
        "Lanternroot Open Aviary Courts independent roof 1",
        "terrace"
      ],
      [
        [
          0,
          25,
          11,
          51
        ],
        "z",
        7,
        "Lanternroot Open Aviary Courts independent roof 2",
        "saw"
      ],
      [
        [
          13,
          52,
          50,
          56
        ],
        "x",
        5,
        "Lanternroot Open Aviary Courts independent roof 3",
        "tower"
      ],
      [
        [
          39,
          60,
          14,
          50
        ],
        "z",
        6,
        "Lanternroot Open Aviary Courts independent roof 4",
        "gable"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "snow",
    "size": "small",
    "variation": 5,
    "name": "Frostcall Narrow Observatory",
    "w": 47,
    "d": 45,
    "h": 16,
    "entry": 24,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        9,
        39,
        0,
        13
      ],
      [
        0,
        18,
        12,
        40
      ],
      [
        31,
        46,
        14,
        38
      ],
      [
        9,
        38,
        38,
        44
      ],
      [
        14,
        37,
        12,
        39
      ]
    ],
    "cuts": [
      [
        20,
        28,
        22,
        31
      ]
    ],
    "anchors": [
      [
        24,
        6
      ],
      [
        10,
        27
      ],
      [
        39,
        28
      ],
      [
        22,
        41
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
        12,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        37,
        30,
        "pack5:093",
        null,
        "specialist-display"
      ],
      [
        23,
        42,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          9,
          39,
          0,
          13
        ],
        "x",
        9,
        "Frostcall Narrow Observatory independent roof 1",
        "tower"
      ],
      [
        [
          0,
          18,
          12,
          40
        ],
        "z",
        7,
        "Frostcall Narrow Observatory independent roof 2",
        "terrace"
      ],
      [
        [
          9,
          38,
          38,
          44
        ],
        "x",
        5,
        "Frostcall Narrow Observatory independent roof 3",
        "saw"
      ],
      [
        [
          31,
          46,
          14,
          38
        ],
        "z",
        6,
        "Frostcall Narrow Observatory independent roof 4",
        "gable"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "snow",
    "size": "medium",
    "variation": 5,
    "name": "Glacierweave Mystic Arcade",
    "w": 66,
    "d": 43,
    "h": 13,
    "entry": 34,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        15,
        53,
        0,
        15
      ],
      [
        0,
        19,
        12,
        36
      ],
      [
        48,
        65,
        13,
        39
      ],
      [
        11,
        59,
        38,
        42
      ],
      [
        17,
        51,
        12,
        38
      ]
    ],
    "cuts": [
      [
        28,
        43,
        18,
        27
      ]
    ],
    "anchors": [
      [
        34,
        6
      ],
      [
        10,
        26
      ],
      [
        55,
        26
      ],
      [
        23,
        40
      ]
    ],
    "fixtures": [
      [
        38,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        12,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        53,
        28,
        "pack5:093",
        null,
        "specialist-display"
      ],
      [
        24,
        41,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          15,
          53,
          0,
          15
        ],
        "x",
        9,
        "Glacierweave Mystic Arcade independent roof 1",
        "saw"
      ],
      [
        [
          0,
          19,
          12,
          36
        ],
        "z",
        7,
        "Glacierweave Mystic Arcade independent roof 2",
        "tower"
      ],
      [
        [
          11,
          59,
          38,
          42
        ],
        "x",
        5,
        "Glacierweave Mystic Arcade independent roof 3",
        "gable"
      ],
      [
        [
          48,
          65,
          13,
          39
        ],
        "z",
        6,
        "Glacierweave Mystic Arcade independent roof 4",
        "terrace"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "desert",
    "size": "medium",
    "variation": 5,
    "name": "Dunefern High-Flue Apothecary",
    "w": 58,
    "d": 53,
    "h": 12,
    "entry": 29,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        12,
        46,
        0,
        12
      ],
      [
        0,
        20,
        10,
        47
      ],
      [
        39,
        57,
        15,
        46
      ],
      [
        10,
        51,
        45,
        52
      ],
      [
        19,
        43,
        13,
        45
      ]
    ],
    "cuts": [
      [
        23,
        35,
        23,
        35
      ]
    ],
    "anchors": [
      [
        29,
        6
      ],
      [
        10,
        31
      ],
      [
        48,
        31
      ],
      [
        24,
        49
      ]
    ],
    "fixtures": [
      [
        33,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        12,
        32,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        46,
        33,
        "pack5:089",
        null,
        "specialist-display"
      ],
      [
        25,
        50,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          12,
          46,
          0,
          12
        ],
        "x",
        9,
        "Dunefern High-Flue Apothecary independent roof 1",
        "gable"
      ],
      [
        [
          0,
          20,
          10,
          47
        ],
        "z",
        7,
        "Dunefern High-Flue Apothecary independent roof 2",
        "terrace"
      ],
      [
        [
          10,
          51,
          45,
          52
        ],
        "x",
        5,
        "Dunefern High-Flue Apothecary independent roof 3",
        "tower"
      ],
      [
        [
          39,
          57,
          15,
          46
        ],
        "z",
        6,
        "Dunefern High-Flue Apothecary independent roof 4",
        "saw"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "enchanted-forest",
    "size": "small",
    "variation": 5,
    "name": "Thornbrook Petal Laboratory",
    "w": 46,
    "d": 47,
    "h": 14,
    "entry": 23,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        8,
        37,
        0,
        13
      ],
      [
        0,
        18,
        11,
        41
      ],
      [
        30,
        45,
        14,
        41
      ],
      [
        10,
        39,
        40,
        46
      ],
      [
        14,
        36,
        13,
        40
      ]
    ],
    "cuts": [
      [
        18,
        28,
        22,
        32
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        10,
        29
      ],
      [
        37,
        28
      ],
      [
        20,
        44
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
        12,
        30,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        35,
        30,
        "pack5:089",
        null,
        "specialist-display"
      ],
      [
        21,
        45,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          8,
          37,
          0,
          13
        ],
        "x",
        9,
        "Thornbrook Petal Laboratory independent roof 1",
        "tower"
      ],
      [
        [
          0,
          18,
          11,
          41
        ],
        "z",
        7,
        "Thornbrook Petal Laboratory independent roof 2",
        "gable"
      ],
      [
        [
          10,
          39,
          40,
          46
        ],
        "x",
        5,
        "Thornbrook Petal Laboratory independent roof 3",
        "saw"
      ],
      [
        [
          30,
          45,
          14,
          41
        ],
        "z",
        6,
        "Thornbrook Petal Laboratory independent roof 4",
        "terrace"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "temperate",
    "size": "small",
    "variation": 5,
    "name": "Cypress Canal Bakehouse",
    "w": 44,
    "d": 44,
    "h": 12,
    "entry": 22,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        8,
        37,
        0,
        12
      ],
      [
        0,
        16,
        10,
        39
      ],
      [
        29,
        43,
        12,
        38
      ],
      [
        9,
        39,
        37,
        43
      ],
      [
        15,
        32,
        12,
        36
      ]
    ],
    "cuts": [
      [
        19,
        27,
        17,
        28
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        9,
        26
      ],
      [
        36,
        26
      ],
      [
        20,
        41
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
        11,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        34,
        28,
        "pack5:085",
        null,
        "specialist-display"
      ],
      [
        21,
        42,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          8,
          37,
          0,
          12
        ],
        "x",
        9,
        "Cypress Canal Bakehouse independent roof 1",
        "gable"
      ],
      [
        [
          0,
          16,
          10,
          39
        ],
        "z",
        7,
        "Cypress Canal Bakehouse independent roof 2",
        "saw"
      ],
      [
        [
          9,
          39,
          37,
          43
        ],
        "x",
        5,
        "Cypress Canal Bakehouse independent roof 3",
        "terrace"
      ],
      [
        [
          29,
          43,
          12,
          38
        ],
        "z",
        6,
        "Cypress Canal Bakehouse independent roof 4",
        "tower"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "desert",
    "size": "small",
    "variation": 5,
    "name": "Copper Canopy Ovens",
    "w": 48,
    "d": 46,
    "h": 14,
    "entry": 24,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        10,
        39,
        0,
        12
      ],
      [
        0,
        20,
        10,
        40
      ],
      [
        32,
        47,
        12,
        42
      ],
      [
        12,
        40,
        40,
        45
      ],
      [
        17,
        36,
        12,
        40
      ]
    ],
    "cuts": [
      [
        23,
        30,
        21,
        32
      ]
    ],
    "anchors": [
      [
        24,
        6
      ],
      [
        10,
        27
      ],
      [
        40,
        28
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
        "service-counter"
      ],
      [
        12,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        38,
        30,
        "pack5:085",
        null,
        "specialist-display"
      ],
      [
        22,
        44,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          10,
          39,
          0,
          12
        ],
        "x",
        9,
        "Copper Canopy Ovens independent roof 1",
        "terrace"
      ],
      [
        [
          0,
          20,
          10,
          40
        ],
        "z",
        7,
        "Copper Canopy Ovens independent roof 2",
        "tower"
      ],
      [
        [
          12,
          40,
          40,
          45
        ],
        "x",
        5,
        "Copper Canopy Ovens independent roof 3",
        "gable"
      ],
      [
        [
          32,
          47,
          12,
          42
        ],
        "z",
        6,
        "Copper Canopy Ovens independent roof 4",
        "saw"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "snow",
    "size": "medium",
    "variation": 3,
    "name": "Rimehaven Twin-Corridor Bank",
    "w": 62,
    "d": 55,
    "h": 15,
    "entry": 31,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        15,
        49,
        0,
        14
      ],
      [
        0,
        24,
        11,
        48
      ],
      [
        42,
        61,
        15,
        51
      ],
      [
        13,
        55,
        50,
        54
      ],
      [
        20,
        51,
        13,
        49
      ]
    ],
    "cuts": [
      [
        28,
        39,
        22,
        33
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
        54,
        34
      ],
      [
        25,
        52
      ]
    ],
    "fixtures": [
      [
        35,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        13,
        33,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        52,
        36,
        "pack5:094",
        "citadel-ironbound-leaves",
        "secure-vault-foyer"
      ],
      [
        26,
        53,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          15,
          49,
          0,
          14
        ],
        "x",
        9,
        "Rimehaven Twin-Corridor Bank independent roof 1",
        "tower"
      ],
      [
        [
          0,
          24,
          11,
          48
        ],
        "z",
        7,
        "Rimehaven Twin-Corridor Bank independent roof 2",
        "saw"
      ],
      [
        [
          13,
          55,
          50,
          54
        ],
        "x",
        5,
        "Rimehaven Twin-Corridor Bank independent roof 3",
        "gable"
      ],
      [
        [
          42,
          61,
          15,
          51
        ],
        "z",
        6,
        "Rimehaven Twin-Corridor Bank independent roof 4",
        "terrace"
      ]
    ],
    "vault": [
      45,
      59,
      34,
      45,
      36,
      37
    ]
  },
  {
    "category": "bank",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 3,
    "name": "Elderbranch Grand Ledger Court",
    "w": 72,
    "d": 42,
    "h": 13,
    "entry": 36,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        18,
        60,
        0,
        13
      ],
      [
        0,
        22,
        11,
        34
      ],
      [
        48,
        71,
        10,
        39
      ],
      [
        9,
        63,
        39,
        41
      ],
      [
        17,
        55,
        12,
        39
      ]
    ],
    "cuts": [
      [
        25,
        45,
        18,
        27
      ]
    ],
    "anchors": [
      [
        36,
        6
      ],
      [
        10,
        27
      ],
      [
        61,
        26
      ],
      [
        24,
        39
      ]
    ],
    "fixtures": [
      [
        40,
        6,
        "pack5:086",
        "ledger-service",
        "service-counter"
      ],
      [
        12,
        28,
        "pack5:091",
        "cartographers-oak-desk",
        "records"
      ],
      [
        59,
        28,
        "pack5:094",
        "citadel-ironbound-leaves",
        "secure-vault-foyer"
      ],
      [
        25,
        40,
        "pack4:057",
        null,
        "stockroom"
      ]
    ],
    "roofs": [
      [
        [
          18,
          60,
          0,
          13
        ],
        "x",
        9,
        "Elderbranch Grand Ledger Court independent roof 1",
        "saw"
      ],
      [
        [
          0,
          22,
          11,
          34
        ],
        "z",
        7,
        "Elderbranch Grand Ledger Court independent roof 2",
        "terrace"
      ],
      [
        [
          9,
          63,
          39,
          41
        ],
        "x",
        5,
        "Elderbranch Grand Ledger Court independent roof 3",
        "tower"
      ],
      [
        [
          48,
          71,
          10,
          39
        ],
        "z",
        6,
        "Elderbranch Grand Ledger Court independent roof 4",
        "gable"
      ]
    ],
    "vault": [
      54,
      70,
      27,
      37,
      29,
      30
    ]
  }
]);
export const ROADMAP_A_WAVE07_SHOPS=Object.freeze(ROADMAP_A_WAVE07_SPECS.map(s=>{const b=author2ALandmark(s);validateBlueprint(b);return b;}));
export const ROADMAP_A_WAVE07_IDS=Object.freeze(ROADMAP_A_WAVE07_SHOPS.map(b=>b.id));
