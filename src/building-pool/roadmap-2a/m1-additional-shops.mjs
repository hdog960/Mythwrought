// Original 2A-owned coordinate-authored merchant designs. No production placement.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
export const M1_NEW_DESIGN_PROFILES=Object.freeze([
  {
    "category": "general-store",
    "variation": 2,
    "biome": "desert",
    "size": "medium",
    "w": 18,
    "d": 17,
    "h": 7,
    "entry": 8,
    "foundation": "pack1:005",
    "floor": "pack5:081",
    "wall": "pack5:079",
    "roof": "pack5:080",
    "partZ": [
      [
        11,
        8
      ]
    ],
    "partX": [
      [
        13,
        4,
        9,
        7
      ]
    ],
    "caps": [
      [
        3,
        14,
        16
      ],
      [
        10,
        14,
        16
      ]
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        14,
        0
      ],
      [
        0,
        6
      ],
      [
        17,
        7
      ]
    ],
    "fixtures": [
      [
        10,
        3,
        "pack5:086",
        "service",
        "ledger-service"
      ],
      [
        3,
        5,
        "pack5:087",
        "dry-goods",
        "stepped-market-tray"
      ],
      [
        5,
        7,
        "pack5:087",
        "spice-shelves",
        "curio-arcade"
      ],
      [
        15,
        6,
        "pack5:091",
        "ledger",
        "cartographers-oak-desk"
      ],
      [
        4,
        14,
        "pack4:057",
        "crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Market hall",
        "bounds": {
          "x0": 1,
          "x1": 12,
          "z0": 1,
          "z1": 10
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "display-shelves"
        ],
        "access": [
          8,
          5
        ]
      },
      {
        "name": "East accounting office",
        "bounds": {
          "x0": 14,
          "x1": 16,
          "z0": 4,
          "z1": 9
        },
        "uses": [
          "ledger-work"
        ],
        "access": [
          15,
          7
        ]
      },
      {
        "name": "Rear goods room",
        "bounds": {
          "x0": 1,
          "x1": 16,
          "z0": 12,
          "z1": 15
        },
        "uses": [
          "storage"
        ],
        "access": [
          8,
          13
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "south arch"
      ],
      [
        "sales-floor",
        "ledger-work",
        "east counting room doorway"
      ],
      [
        "sales-floor",
        "storage",
        "rear goods passage"
      ]
    ],
    "towers": [
      [
        3,
        3,
        3
      ],
      [
        14,
        12,
        4
      ]
    ],
    "lamp": [
      8,
      6,
      2
    ],
    "title": "Dunewake Ledger & General Goods",
    "roofForm": "authored supported roof plate with asymmetric coordinate towers; actual family ABI unverified",
    "signature": "distinct enclosed east merchant office, rear goods room and desert shade porch"
  },
  {
    "category": "pet-shop",
    "biome": "mountain",
    "size": "medium",
    "w": 20,
    "d": 19,
    "h": 8,
    "entry": 10,
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack1:005",
    "roof": "pack3:025",
    "partZ": [
      [
        13,
        11
      ]
    ],
    "partX": [],
    "caps": [],
    "windows": [
      [
        4,
        0
      ],
      [
        16,
        0
      ],
      [
        0,
        6
      ],
      [
        19,
        8
      ]
    ],
    "fixtures": [
      [
        14,
        4,
        "pack5:086",
        "counter",
        "festival-fascia"
      ],
      [
        2,
        4,
        "pack5:096",
        "empty-pen",
        "oak-stall-divider"
      ],
      [
        3,
        4,
        "pack5:096",
        "empty-pen",
        "oak-stall-divider"
      ],
      [
        2,
        5,
        "pack5:096",
        "empty-pen",
        "oak-stall-divider"
      ],
      [
        5,
        8,
        "pack5:096",
        "waterless-trough",
        "stone-feed-trough"
      ],
      [
        15,
        8,
        "pack5:087",
        "supply-shelves",
        "curio-arcade"
      ],
      [
        3,
        16,
        "pack4:057",
        "crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Cliff showroom with split empty pens",
        "bounds": {
          "x0": 1,
          "x1": 18,
          "z0": 1,
          "z1": 12
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "empty-animal-display"
        ],
        "access": [
          10,
          6
        ]
      },
      {
        "name": "Equipment cellar",
        "bounds": {
          "x0": 1,
          "x1": 18,
          "z0": 14,
          "z1": 17
        },
        "uses": [
          "storage"
        ],
        "access": [
          11,
          15
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "windbreak entry"
      ],
      [
        "sales-floor",
        "storage",
        "rear offset passage"
      ]
    ],
    "towers": [
      [
        3,
        5,
        4
      ],
      [
        4,
        5,
        4
      ],
      [
        15,
        11,
        3
      ]
    ],
    "lamp": [
      10,
      8,
      3
    ],
    "title": "Crag Hollow Empty-Pen Provisions",
    "roofForm": "authored supported roof plate with asymmetric coordinate towers; actual family ABI unverified",
    "signature": "cliff pet supply with partitioned real empty rails, off-center stockroom and twin high roof piers"
  },
  {
    "category": "magic-shop",
    "biome": "snow",
    "size": "large",
    "w": 23,
    "d": 22,
    "h": 9,
    "entry": 11,
    "foundation": "pack1:004",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:025",
    "partZ": [
      [
        15,
        12
      ]
    ],
    "partX": [
      [
        5,
        4,
        13,
        9
      ]
    ],
    "caps": [
      [
        3,
        1,
        4
      ],
      [
        14,
        1,
        4
      ]
    ],
    "windows": [
      [
        4,
        0
      ],
      [
        18,
        0
      ],
      [
        22,
        8
      ],
      [
        0,
        8
      ]
    ],
    "fixtures": [
      [
        16,
        4,
        "pack5:086",
        "relic-ledger",
        "ledger-service"
      ],
      [
        10,
        6,
        "pack5:093",
        "unpowered-star-plinth",
        "sunspire-reliquary-plinth"
      ],
      [
        13,
        9,
        "pack5:093",
        "relic-display",
        "runesworn-stone-altar"
      ],
      [
        3,
        7,
        "pack5:091",
        "consultation",
        "cartographers-oak-desk"
      ],
      [
        4,
        18,
        "pack4:057",
        "backroom-archival-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Tall relic retail",
        "bounds": {
          "x0": 6,
          "x1": 21,
          "z0": 1,
          "z1": 14
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "arcane-display"
        ],
        "access": [
          11,
          6
        ]
      },
      {
        "name": "Enclosed west consulting room",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 4,
          "z1": 13
        },
        "uses": [
          "secure-handling"
        ],
        "access": [
          3,
          9
        ]
      },
      {
        "name": "Rear relic archive",
        "bounds": {
          "x0": 1,
          "x1": 21,
          "z0": 16,
          "z1": 20
        },
        "uses": [
          "storage"
        ],
        "access": [
          12,
          18
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "snow vestibule"
      ],
      [
        "sales-floor",
        "secure-handling",
        "private west doorway"
      ],
      [
        "sales-floor",
        "storage",
        "rear threshold"
      ]
    ],
    "towers": [
      [
        3,
        5,
        4
      ],
      [
        4,
        5,
        4
      ],
      [
        18,
        18,
        5
      ],
      [
        19,
        18,
        5
      ]
    ],
    "lamp": [
      11,
      9,
      3
    ],
    "title": "Snowspire Relics & Unpowered Sigils",
    "roofForm": "authored supported roof plate with asymmetric coordinate towers; actual family ABI unverified",
    "signature": "large snow relic shop with private west consultation and asymmetrically raised rear skylight"
  },
  {
    "category": "potion-shop",
    "biome": "desert",
    "size": "small",
    "w": 17,
    "d": 16,
    "h": 6,
    "entry": 8,
    "foundation": "pack1:005",
    "floor": "pack5:081",
    "wall": "pack5:079",
    "roof": "pack5:080",
    "partZ": [
      [
        11,
        8
      ]
    ],
    "partX": [
      [
        12,
        4,
        9,
        7
      ]
    ],
    "caps": [
      [
        3,
        13,
        15
      ],
      [
        10,
        13,
        15
      ]
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        14,
        0
      ],
      [
        0,
        6
      ],
      [
        16,
        8
      ]
    ],
    "fixtures": [
      [
        5,
        4,
        "pack5:086",
        "front-counter",
        "festival-fascia"
      ],
      [
        6,
        7,
        "pack5:087",
        "sealed-vials",
        "curio-arcade"
      ],
      [
        14,
        6,
        "pack5:089",
        "unlit-cauldron",
        "iron-tripod-cauldron"
      ],
      [
        13,
        13,
        "pack4:057",
        "ingredients",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Dry pharmacy",
        "bounds": {
          "x0": 1,
          "x1": 11,
          "z0": 1,
          "z1": 10
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          8,
          5
        ]
      },
      {
        "name": "Enclosed mixing alcove",
        "bounds": {
          "x0": 13,
          "x1": 15,
          "z0": 4,
          "z1": 9
        },
        "uses": [
          "alchemy-workspace"
        ],
        "access": [
          14,
          7
        ]
      },
      {
        "name": "Rear ingredients",
        "bounds": {
          "x0": 1,
          "x1": 15,
          "z0": 12,
          "z1": 14
        },
        "uses": [
          "storage"
        ],
        "access": [
          8,
          13
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "dry front arch"
      ],
      [
        "sales-floor",
        "alchemy-workspace",
        "east preparation door"
      ],
      [
        "sales-floor",
        "storage",
        "rear ingredients door"
      ]
    ],
    "towers": [
      [
        3,
        3,
        3
      ],
      [
        14,
        12,
        4
      ]
    ],
    "lamp": [
      8,
      6,
      3
    ],
    "title": "Sundried Apothecary",
    "roofForm": "authored supported roof plate with asymmetric coordinate towers; actual family ABI unverified",
    "signature": "desert corner alchemy room and rear ingredients corridor under low parapet"
  },
  {
    "category": "bakery",
    "biome": "temperate",
    "size": "large",
    "w": 24,
    "d": 22,
    "h": 9,
    "entry": 12,
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack2:013",
    "roof": "pack3:023",
    "partZ": [
      [
        15,
        14
      ]
    ],
    "partX": [
      [
        6,
        4,
        13,
        9
      ]
    ],
    "caps": [
      [
        3,
        1,
        5
      ],
      [
        14,
        1,
        5
      ]
    ],
    "windows": [
      [
        4,
        0
      ],
      [
        19,
        0
      ],
      [
        0,
        8
      ],
      [
        23,
        8
      ]
    ],
    "fixtures": [
      [
        16,
        4,
        "pack5:086",
        "service-counter",
        "festival-fascia"
      ],
      [
        3,
        7,
        "pack5:091",
        "flour-ledger",
        "cartographers-oak-desk"
      ],
      [
        17,
        17,
        "pack5:090",
        "unlit-bake-oven",
        "ashstone-bake-oven"
      ],
      [
        12,
        18,
        "pack5:091",
        "cold-prep-table",
        "cartographers-oak-desk"
      ],
      [
        4,
        18,
        "pack4:057",
        "grain-supply",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Bread sales market",
        "bounds": {
          "x0": 7,
          "x1": 22,
          "z0": 1,
          "z1": 14
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          12,
          6
        ]
      },
      {
        "name": "West flour records",
        "bounds": {
          "x0": 1,
          "x1": 5,
          "z0": 4,
          "z1": 13
        },
        "uses": [
          "storage"
        ],
        "access": [
          3,
          9
        ]
      },
      {
        "name": "Rear unlit kitchen",
        "bounds": {
          "x0": 1,
          "x1": 22,
          "z0": 16,
          "z1": 20
        },
        "uses": [
          "oven",
          "food-preparation"
        ],
        "access": [
          14,
          18
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "market entry"
      ],
      [
        "sales-floor",
        "storage",
        "west grain room"
      ],
      [
        "sales-floor",
        "oven",
        "rear production entrance"
      ],
      [
        "oven",
        "food-preparation",
        "shared oven and prep circulation"
      ]
    ],
    "towers": [
      [
        3,
        16,
        4
      ],
      [
        4,
        16,
        4
      ],
      [
        18,
        18,
        5
      ]
    ],
    "lamp": [
      12,
      9,
      3
    ],
    "title": "Hearthrise Breadworks",
    "roofForm": "authored supported roof plate with asymmetric coordinate towers; actual family ABI unverified",
    "signature": "large bakery with three genuinely distinct spatial programs, ovenhouse and grain records"
  },
  {
    "category": "bank",
    "biome": "enchanted-forest",
    "size": "medium",
    "w": 20,
    "d": 19,
    "h": 8,
    "entry": 9,
    "foundation": "pack1:005",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:026",
    "partZ": [
      [
        12,
        13
      ]
    ],
    "partX": [
      [
        5,
        4,
        10,
        7
      ]
    ],
    "caps": [
      [
        3,
        1,
        4
      ],
      [
        11,
        1,
        4
      ]
    ],
    "windows": [
      [
        4,
        0
      ],
      [
        16,
        0
      ],
      [
        19,
        8
      ],
      [
        0,
        7
      ]
    ],
    "fixtures": [
      [
        12,
        4,
        "pack5:086",
        "public-teller",
        "ledger-service"
      ],
      [
        15,
        5,
        "pack5:086",
        "second-teller",
        "festival-fascia"
      ],
      [
        3,
        8,
        "pack5:091",
        "ledger-office",
        "cartographers-oak-desk"
      ],
      [
        7,
        15,
        "pack5:093",
        "inactive-vault-plinth",
        "sunspire-reliquary-plinth"
      ]
    ],
    "rooms": [
      {
        "name": "Two-teller public hall",
        "bounds": {
          "x0": 6,
          "x1": 18,
          "z0": 1,
          "z1": 11
        },
        "uses": [
          "public-hall",
          "teller-service"
        ],
        "access": [
          9,
          5
        ]
      },
      {
        "name": "West records office",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 4,
          "z1": 10
        },
        "uses": [
          "administrative-office"
        ],
        "access": [
          3,
          7
        ]
      },
      {
        "name": "Rear secured vault",
        "bounds": {
          "x0": 1,
          "x1": 18,
          "z0": 13,
          "z1": 17
        },
        "uses": [
          "vault"
        ],
        "access": [
          13,
          15
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "public-hall",
        "front hall"
      ],
      [
        "public-hall",
        "administrative-office",
        "west office"
      ],
      [
        "public-hall",
        "vault",
        "rear secured threshold"
      ]
    ],
    "towers": [
      [
        2,
        14,
        4
      ],
      [
        3,
        14,
        4
      ],
      [
        16,
        14,
        3
      ]
    ],
    "lamp": [
      9,
      8,
      3
    ],
    "title": "Wispbank Ledger House",
    "roofForm": "authored supported roof plate with asymmetric coordinate towers; actual family ABI unverified",
    "signature": "enchanted two-counter bank with separate west office and genuinely enclosed rear vault",
    "vaultDoor": [
      13,
      12
    ]
  }
]);
export const M1_NEW_MERCHANTS=Object.freeze(M1_NEW_DESIGN_PROFILES.map(assembleSpecialistProfile));
export const M1_NEW_COUNTS=Object.freeze({newThisBatch:M1_NEW_MERCHANTS.length,generalStores:1,petShops:1,magicShops:1,potionShops:1,bakeries:1,banks:1});
