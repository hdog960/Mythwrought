// Roadmap A Builder 2A commerce Wave04 — 12 independently coordinate-specified buildings.
// Catalog/packs are consumed read-only; historical 128 and earlier Wave01–03 are unchanged.
// All records are source-only staging, not production registered or creator-approved.
import {author2ALandmark} from './m1-landmark-shops.mjs';
import {validateBlueprint} from './schema.mjs';
export const ROADMAP_A_WAVE04_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "temperate",
    "size": "medium",
    "variation": 5,
    "name": "Cloverbridge Lantern Quay",
    "w": 49,
    "d": 45,
    "h": 11,
    "entry": 24,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        8,
        42,
        0,
        14
      ],
      [
        0,
        19,
        11,
        35
      ],
      [
        32,
        48,
        13,
        39
      ],
      [
        12,
        42,
        36,
        44
      ],
      [
        15,
        37,
        20,
        38
      ]
    ],
    "cuts": [
      [
        18,
        33,
        20,
        34
      ]
    ],
    "anchors": [
      [
        24,
        6
      ],
      [
        8,
        23
      ],
      [
        41,
        26
      ],
      [
        20,
        41
      ]
    ],
    "fixtures": [
      [
        28,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        10,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        39,
        28,
        "pack5:087",
        null,
        "specialist-reserved-display"
      ],
      [
        21,
        42,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          8,
          42,
          0,
          14
        ],
        "x",
        7,
        "Cloverbridge Lantern Quay structural entry-ridge",
        "gable"
      ],
      [
        [
          0,
          19,
          11,
          35
        ],
        "z",
        5,
        "Cloverbridge Lantern Quay structural western-covered-arcade",
        "saw"
      ],
      [
        [
          12,
          42,
          36,
          44
        ],
        "x",
        4,
        "Cloverbridge Lantern Quay structural eastern-workshop-canopy",
        "terrace"
      ],
      [
        [
          32,
          48,
          13,
          39
        ],
        "z",
        6,
        "Cloverbridge Lantern Quay structural delivery-roof",
        "tower"
      ]
    ]
  },
  {
    "category": "general-store",
    "biome": "mountain",
    "size": "large",
    "variation": 5,
    "name": "Granite Slope Mercantile Terraces",
    "w": 64,
    "d": 52,
    "h": 12,
    "entry": 31,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        10,
        52,
        0,
        15
      ],
      [
        0,
        23,
        12,
        44
      ],
      [
        43,
        63,
        17,
        48
      ],
      [
        15,
        53,
        46,
        51
      ],
      [
        19,
        50,
        19,
        48
      ]
    ],
    "cuts": [
      [
        24,
        34,
        27,
        35
      ]
    ],
    "anchors": [
      [
        31,
        7
      ],
      [
        9,
        29
      ],
      [
        54,
        30
      ],
      [
        21,
        49
      ]
    ],
    "fixtures": [
      [
        35,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        11,
        30,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        52,
        32,
        "pack5:087",
        null,
        "specialist-reserved-display"
      ],
      [
        22,
        50,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          10,
          52,
          0,
          15
        ],
        "x",
        7,
        "Granite Slope Mercantile Terraces structural entry-ridge",
        "terrace"
      ],
      [
        [
          0,
          23,
          12,
          44
        ],
        "z",
        5,
        "Granite Slope Mercantile Terraces structural western-covered-arcade",
        "gable"
      ],
      [
        [
          15,
          53,
          46,
          51
        ],
        "x",
        4,
        "Granite Slope Mercantile Terraces structural eastern-workshop-canopy",
        "tower"
      ],
      [
        [
          43,
          63,
          17,
          48
        ],
        "z",
        6,
        "Granite Slope Mercantile Terraces structural delivery-roof",
        "saw"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "desert",
    "size": "small",
    "variation": 5,
    "name": "Saltglass Caravan Kennel Court",
    "w": 44,
    "d": 40,
    "h": 10,
    "entry": 21,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        6,
        38,
        0,
        11
      ],
      [
        0,
        17,
        10,
        35
      ],
      [
        29,
        43,
        13,
        38
      ],
      [
        10,
        37,
        34,
        39
      ],
      [
        14,
        31,
        17,
        35
      ]
    ],
    "cuts": [
      [
        18,
        31,
        17,
        31
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
        36,
        26
      ],
      [
        18,
        37
      ]
    ],
    "fixtures": [
      [
        25,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        10,
        25,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        34,
        28,
        "pack5:087",
        null,
        "empty-animal-space"
      ],
      [
        19,
        38,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          6,
          38,
          0,
          11
        ],
        "x",
        7,
        "Saltglass Caravan Kennel Court structural entry-ridge",
        "saw"
      ],
      [
        [
          0,
          17,
          10,
          35
        ],
        "z",
        5,
        "Saltglass Caravan Kennel Court structural western-covered-arcade",
        "terrace"
      ],
      [
        [
          10,
          37,
          34,
          39
        ],
        "x",
        4,
        "Saltglass Caravan Kennel Court structural eastern-workshop-canopy",
        "gable"
      ],
      [
        [
          29,
          43,
          13,
          38
        ],
        "z",
        6,
        "Saltglass Caravan Kennel Court structural delivery-roof",
        "tower"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "snow",
    "size": "large",
    "variation": 5,
    "name": "Rimewatch Covered Aviary",
    "w": 60,
    "d": 51,
    "h": 12,
    "entry": 29,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        9,
        52,
        0,
        15
      ],
      [
        0,
        23,
        14,
        46
      ],
      [
        40,
        59,
        17,
        49
      ],
      [
        11,
        51,
        46,
        50
      ],
      [
        20,
        47,
        19,
        45
      ]
    ],
    "cuts": [
      [
        27,
        36,
        25,
        35
      ]
    ],
    "anchors": [
      [
        29,
        7
      ],
      [
        10,
        29
      ],
      [
        49,
        32
      ],
      [
        21,
        48
      ]
    ],
    "fixtures": [
      [
        33,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        12,
        30,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        47,
        34,
        "pack5:087",
        null,
        "empty-animal-space"
      ],
      [
        22,
        49,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          9,
          52,
          0,
          15
        ],
        "x",
        7,
        "Rimewatch Covered Aviary structural entry-ridge",
        "gable"
      ],
      [
        [
          0,
          23,
          14,
          46
        ],
        "z",
        5,
        "Rimewatch Covered Aviary structural western-covered-arcade",
        "tower"
      ],
      [
        [
          11,
          51,
          46,
          50
        ],
        "x",
        4,
        "Rimewatch Covered Aviary structural eastern-workshop-canopy",
        "terrace"
      ],
      [
        [
          40,
          59,
          17,
          49
        ],
        "z",
        6,
        "Rimewatch Covered Aviary structural delivery-roof",
        "saw"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "mountain",
    "size": "small",
    "variation": 5,
    "name": "Cliffsong Hanging Reliquary",
    "w": 46,
    "d": 42,
    "h": 11,
    "entry": 22,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        7,
        40,
        0,
        12
      ],
      [
        0,
        19,
        11,
        37
      ],
      [
        31,
        45,
        14,
        40
      ],
      [
        10,
        38,
        36,
        41
      ],
      [
        15,
        37,
        19,
        37
      ]
    ],
    "cuts": [
      [
        17,
        31,
        20,
        34
      ]
    ],
    "anchors": [
      [
        22,
        6
      ],
      [
        9,
        24
      ],
      [
        39,
        27
      ],
      [
        17,
        38
      ]
    ],
    "fixtures": [
      [
        26,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        11,
        25,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        37,
        29,
        "pack5:093",
        null,
        "specialist-reserved-display"
      ],
      [
        18,
        39,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          7,
          40,
          0,
          12
        ],
        "x",
        7,
        "Cliffsong Hanging Reliquary structural entry-ridge",
        "saw"
      ],
      [
        [
          0,
          19,
          11,
          37
        ],
        "z",
        5,
        "Cliffsong Hanging Reliquary structural western-covered-arcade",
        "gable"
      ],
      [
        [
          10,
          38,
          36,
          41
        ],
        "x",
        4,
        "Cliffsong Hanging Reliquary structural eastern-workshop-canopy",
        "tower"
      ],
      [
        [
          31,
          45,
          14,
          40
        ],
        "z",
        6,
        "Cliffsong Hanging Reliquary structural delivery-roof",
        "terrace"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "snow",
    "size": "large",
    "variation": 5,
    "name": "Iceward Skyglass Archive Bazaar",
    "w": 58,
    "d": 52,
    "h": 12,
    "entry": 28,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        9,
        50,
        0,
        14
      ],
      [
        0,
        20,
        12,
        47
      ],
      [
        39,
        57,
        15,
        49
      ],
      [
        12,
        49,
        46,
        51
      ],
      [
        17,
        43,
        17,
        48
      ]
    ],
    "cuts": [
      [
        25,
        34,
        28,
        36
      ]
    ],
    "anchors": [
      [
        28,
        6
      ],
      [
        8,
        31
      ],
      [
        49,
        29
      ],
      [
        20,
        49
      ]
    ],
    "fixtures": [
      [
        32,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        10,
        32,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        47,
        31,
        "pack5:093",
        null,
        "specialist-reserved-display"
      ],
      [
        21,
        50,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          9,
          50,
          0,
          14
        ],
        "x",
        7,
        "Iceward Skyglass Archive Bazaar structural entry-ridge",
        "tower"
      ],
      [
        [
          0,
          20,
          12,
          47
        ],
        "z",
        5,
        "Iceward Skyglass Archive Bazaar structural western-covered-arcade",
        "saw"
      ],
      [
        [
          12,
          49,
          46,
          51
        ],
        "x",
        4,
        "Iceward Skyglass Archive Bazaar structural eastern-workshop-canopy",
        "gable"
      ],
      [
        [
          39,
          57,
          15,
          49
        ],
        "z",
        6,
        "Iceward Skyglass Archive Bazaar structural delivery-roof",
        "terrace"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "enchanted-forest",
    "size": "large",
    "variation": 5,
    "name": "Starpetal Moonroot Distillery",
    "w": 62,
    "d": 54,
    "h": 12,
    "entry": 30,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        11,
        50,
        0,
        15
      ],
      [
        0,
        22,
        12,
        48
      ],
      [
        43,
        61,
        17,
        51
      ],
      [
        13,
        53,
        48,
        53
      ],
      [
        18,
        48,
        19,
        49
      ]
    ],
    "cuts": [
      [
        24,
        33,
        30,
        39
      ]
    ],
    "anchors": [
      [
        30,
        7
      ],
      [
        9,
        30
      ],
      [
        51,
        33
      ],
      [
        22,
        51
      ]
    ],
    "fixtures": [
      [
        34,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        11,
        31,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        49,
        35,
        "pack5:089",
        null,
        "specialist-reserved-display"
      ],
      [
        23,
        52,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          11,
          50,
          0,
          15
        ],
        "x",
        7,
        "Starpetal Moonroot Distillery structural entry-ridge",
        "terrace"
      ],
      [
        [
          0,
          22,
          12,
          48
        ],
        "z",
        5,
        "Starpetal Moonroot Distillery structural western-covered-arcade",
        "tower"
      ],
      [
        [
          13,
          53,
          48,
          53
        ],
        "x",
        4,
        "Starpetal Moonroot Distillery structural eastern-workshop-canopy",
        "saw"
      ],
      [
        [
          43,
          61,
          17,
          51
        ],
        "z",
        6,
        "Starpetal Moonroot Distillery structural delivery-roof",
        "gable"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "temperate",
    "size": "medium",
    "variation": 5,
    "name": "Marshlight Botanical Walk",
    "w": 50,
    "d": 46,
    "h": 11,
    "entry": 24,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        7,
        43,
        0,
        13
      ],
      [
        0,
        19,
        10,
        40
      ],
      [
        32,
        49,
        14,
        42
      ],
      [
        12,
        41,
        40,
        45
      ],
      [
        17,
        38,
        18,
        42
      ]
    ],
    "cuts": [
      [
        18,
        33,
        20,
        35
      ]
    ],
    "anchors": [
      [
        24,
        6
      ],
      [
        8,
        26
      ],
      [
        41,
        28
      ],
      [
        20,
        43
      ]
    ],
    "fixtures": [
      [
        28,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        10,
        27,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        39,
        30,
        "pack5:089",
        null,
        "specialist-reserved-display"
      ],
      [
        21,
        44,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          7,
          43,
          0,
          13
        ],
        "x",
        7,
        "Marshlight Botanical Walk structural entry-ridge",
        "gable"
      ],
      [
        [
          0,
          19,
          10,
          40
        ],
        "z",
        5,
        "Marshlight Botanical Walk structural western-covered-arcade",
        "terrace"
      ],
      [
        [
          12,
          41,
          40,
          45
        ],
        "x",
        4,
        "Marshlight Botanical Walk structural eastern-workshop-canopy",
        "tower"
      ],
      [
        [
          32,
          49,
          14,
          42
        ],
        "z",
        6,
        "Marshlight Botanical Walk structural delivery-roof",
        "saw"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "temperate",
    "size": "medium",
    "variation": 5,
    "name": "Greenwater Bread Canal",
    "w": 52,
    "d": 47,
    "h": 11,
    "entry": 25,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        8,
        44,
        0,
        13
      ],
      [
        0,
        19,
        10,
        41
      ],
      [
        34,
        51,
        16,
        44
      ],
      [
        12,
        43,
        42,
        46
      ],
      [
        17,
        40,
        17,
        43
      ]
    ],
    "cuts": [
      [
        20,
        35,
        22,
        36
      ]
    ],
    "anchors": [
      [
        25,
        6
      ],
      [
        8,
        28
      ],
      [
        42,
        30
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
        "two-wide-public-counter"
      ],
      [
        10,
        29,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        40,
        32,
        "pack5:085",
        null,
        "specialist-reserved-display"
      ],
      [
        21,
        45,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          8,
          44,
          0,
          13
        ],
        "x",
        7,
        "Greenwater Bread Canal structural entry-ridge",
        "saw"
      ],
      [
        [
          0,
          19,
          10,
          41
        ],
        "z",
        5,
        "Greenwater Bread Canal structural western-covered-arcade",
        "tower"
      ],
      [
        [
          12,
          43,
          42,
          46
        ],
        "x",
        4,
        "Greenwater Bread Canal structural eastern-workshop-canopy",
        "gable"
      ],
      [
        [
          34,
          51,
          16,
          44
        ],
        "z",
        6,
        "Greenwater Bread Canal structural delivery-roof",
        "terrace"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "mountain",
    "size": "large",
    "variation": 5,
    "name": "Alpine Twin-Kiln Breadworks",
    "w": 63,
    "d": 54,
    "h": 12,
    "entry": 31,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        11,
        53,
        0,
        15
      ],
      [
        0,
        23,
        12,
        48
      ],
      [
        45,
        62,
        17,
        51
      ],
      [
        14,
        53,
        49,
        53
      ],
      [
        19,
        50,
        18,
        49
      ]
    ],
    "cuts": [
      [
        27,
        36,
        28,
        38
      ]
    ],
    "anchors": [
      [
        31,
        7
      ],
      [
        10,
        32
      ],
      [
        53,
        34
      ],
      [
        24,
        51
      ]
    ],
    "fixtures": [
      [
        35,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        12,
        33,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        51,
        36,
        "pack5:085",
        null,
        "specialist-reserved-display"
      ],
      [
        25,
        52,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          11,
          53,
          0,
          15
        ],
        "x",
        7,
        "Alpine Twin-Kiln Breadworks structural entry-ridge",
        "tower"
      ],
      [
        [
          0,
          23,
          12,
          48
        ],
        "z",
        5,
        "Alpine Twin-Kiln Breadworks structural western-covered-arcade",
        "gable"
      ],
      [
        [
          14,
          53,
          49,
          53
        ],
        "x",
        4,
        "Alpine Twin-Kiln Breadworks structural eastern-workshop-canopy",
        "saw"
      ],
      [
        [
          45,
          62,
          17,
          51
        ],
        "z",
        6,
        "Alpine Twin-Kiln Breadworks structural delivery-roof",
        "terrace"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "enchanted-forest",
    "size": "small",
    "variation": 3,
    "name": "Briarfall Rootbound Treasury",
    "w": 43,
    "d": 38,
    "h": 10,
    "entry": 21,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        7,
        36,
        0,
        11
      ],
      [
        0,
        13,
        9,
        33
      ],
      [
        30,
        42,
        13,
        36
      ],
      [
        9,
        36,
        33,
        37
      ],
      [
        14,
        33,
        17,
        33
      ]
    ],
    "cuts": [
      [
        21,
        25,
        19,
        26
      ]
    ],
    "anchors": [
      [
        21,
        6
      ],
      [
        7,
        21
      ],
      [
        35,
        25
      ],
      [
        16,
        35
      ]
    ],
    "fixtures": [
      [
        25,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        9,
        22,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        33,
        27,
        "pack5:094",
        "citadel-ironbound-leaves",
        "secure-vault-foyer"
      ],
      [
        17,
        36,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          7,
          36,
          0,
          11
        ],
        "x",
        7,
        "Briarfall Rootbound Treasury structural entry-ridge",
        "terrace"
      ],
      [
        [
          0,
          13,
          9,
          33
        ],
        "z",
        5,
        "Briarfall Rootbound Treasury structural western-covered-arcade",
        "gable"
      ],
      [
        [
          9,
          36,
          33,
          37
        ],
        "x",
        4,
        "Briarfall Rootbound Treasury structural eastern-workshop-canopy",
        "saw"
      ],
      [
        [
          30,
          42,
          13,
          36
        ],
        "z",
        6,
        "Briarfall Rootbound Treasury structural delivery-roof",
        "tower"
      ]
    ],
    "vault": [
      32,
      40,
      25,
      34,
      28,
      29
    ]
  },
  {
    "category": "bank",
    "biome": "mountain",
    "size": "large",
    "variation": 2,
    "name": "Stormcrag High-Fort Reserve",
    "w": 69,
    "d": 56,
    "h": 12,
    "entry": 33,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        12,
        55,
        0,
        16
      ],
      [
        0,
        25,
        13,
        49
      ],
      [
        47,
        68,
        15,
        52
      ],
      [
        16,
        59,
        50,
        55
      ],
      [
        19,
        54,
        22,
        50
      ]
    ],
    "cuts": [
      [
        29,
        39,
        28,
        39
      ]
    ],
    "anchors": [
      [
        33,
        7
      ],
      [
        11,
        33
      ],
      [
        57,
        30
      ],
      [
        24,
        52
      ]
    ],
    "fixtures": [
      [
        37,
        6,
        "pack5:086",
        "ledger-service",
        "two-wide-public-counter"
      ],
      [
        13,
        34,
        "pack5:091",
        "cartographers-oak-desk",
        "inventory-workspace"
      ],
      [
        55,
        32,
        "pack5:094",
        "citadel-ironbound-leaves",
        "secure-vault-foyer"
      ],
      [
        25,
        53,
        "pack4:057",
        null,
        "covered-back-storage"
      ]
    ],
    "roofs": [
      [
        [
          12,
          55,
          0,
          16
        ],
        "x",
        7,
        "Stormcrag High-Fort Reserve structural entry-ridge",
        "tower"
      ],
      [
        [
          0,
          25,
          13,
          49
        ],
        "z",
        5,
        "Stormcrag High-Fort Reserve structural western-covered-arcade",
        "saw"
      ],
      [
        [
          16,
          59,
          50,
          55
        ],
        "x",
        4,
        "Stormcrag High-Fort Reserve structural eastern-workshop-canopy",
        "terrace"
      ],
      [
        [
          47,
          68,
          15,
          52
        ],
        "z",
        6,
        "Stormcrag High-Fort Reserve structural delivery-roof",
        "gable"
      ]
    ],
    "vault": [
      51,
      65,
      35,
      48,
      37,
      38
    ]
  }
]);
export const ROADMAP_A_WAVE04_SHOPS=Object.freeze(ROADMAP_A_WAVE04_SPECS.map(s=>{
 const b=author2ALandmark(s);
 validateBlueprint(b);
 return b;
}));
export const ROADMAP_A_WAVE04_IDS=Object.freeze(ROADMAP_A_WAVE04_SHOPS.map(b=>b.id));
