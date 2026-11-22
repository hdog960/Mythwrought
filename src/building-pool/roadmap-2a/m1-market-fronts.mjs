// Six new 2A-owned genuine coordinate-authored market and bank buildings.
// Empty pens and shops are nonfunctional source candidates; no world edits or saves.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
export const M1_MARKET_FRONT_PROFILES=Object.freeze([
  {
    "category": "general-store",
    "biome": "snow",
    "size": "medium",
    "w": 21,
    "d": 19,
    "h": 8,
    "entry": 10,
    "foundation": "pack1:004",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:025",
    "partZ": [
      [
        13,
        11
      ]
    ],
    "partX": [
      [
        6,
        4,
        12,
        8
      ]
    ],
    "caps": [],
    "windows": [
      [
        4,
        0
      ],
      [
        17,
        0
      ],
      [
        0,
        8
      ],
      [
        20,
        8
      ]
    ],
    "fixtures": [
      [
        16,
        4,
        "pack5:086",
        "inactive-counter",
        "ledger-service"
      ],
      [
        12,
        8,
        "pack5:087",
        "stock",
        "curio-arcade"
      ],
      [
        16,
        11,
        "pack5:087",
        "stock",
        "curio-arcade"
      ],
      [
        3,
        10,
        "pack5:091",
        "ledger",
        "cartographers-oak-desk"
      ],
      [
        18,
        16,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Trading gallery",
        "bounds": {
          "x0": 7,
          "x1": 19,
          "z0": 1,
          "z1": 12
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "display-shelves"
        ],
        "access": [
          11,
          7
        ]
      },
      {
        "name": "West ledger room",
        "bounds": {
          "x0": 1,
          "x1": 5,
          "z0": 4,
          "z1": 12
        },
        "uses": [
          "ledger-work"
        ],
        "access": [
          3,
          8
        ]
      },
      {
        "name": "Rear sled freight",
        "bounds": {
          "x0": 1,
          "x1": 19,
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
        "snow caravan foyer"
      ],
      [
        "sales-floor",
        "ledger-work",
        "west books"
      ],
      [
        "sales-floor",
        "storage",
        "freight arch"
      ]
    ],
    "towers": [
      [
        3,
        15,
        4
      ],
      [
        4,
        15,
        4
      ],
      [
        17,
        16,
        5
      ]
    ],
    "lamp": [
      10,
      8,
      3
    ],
    "roofMassing": [
      [
        3,
        7,
        6,
        12,
        4,
        "ledger-roof"
      ],
      [
        12,
        18,
        14,
        15,
        5,
        "sledway-monitor"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        5,
        14,
        6
      ]
    ],
    "facadeRecesses": [
      [
        4,
        8,
        18,
        "rear-sled-alcove"
      ],
      [
        14,
        18,
        18,
        "caravan-pickup"
      ]
    ],
    "frontPorticoes": [
      [
        7,
        14,
        2,
        "north-sled-vestibule"
      ]
    ],
    "roofForm": "split cliff-high freight gable and snow depot monitor",
    "signature": "snow medium general store with separate west ledgers, rear freight depot and two-wide protected front",
    "title": "Northgate Sledway Merchant House",
    "variation": 2
  },
  {
    "category": "pet-shop",
    "biome": "temperate",
    "size": "medium",
    "w": 20,
    "d": 20,
    "h": 8,
    "entry": 9,
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:023",
    "partZ": [
      [
        14,
        11
      ]
    ],
    "partX": [
      [
        7,
        4,
        13,
        8
      ]
    ],
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
        8
      ],
      [
        19,
        9
      ]
    ],
    "fixtures": [
      [
        14,
        4,
        "pack5:086",
        "inactive-counter",
        "ledger-service"
      ],
      [
        16,
        10,
        "pack5:087",
        "stock",
        "curio-arcade"
      ],
      [
        2,
        5,
        "pack5:096",
        "empty-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        2,
        9,
        "pack5:096",
        "empty-stall",
        "oak-stall-divider",
        "west"
      ],
      [
        5,
        10,
        "pack5:096",
        "empty-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        4,
        7,
        "pack5:096",
        "unused-trough",
        "stone-feed-trough"
      ],
      [
        4,
        17,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Supply gallery",
        "bounds": {
          "x0": 8,
          "x1": 18,
          "z0": 1,
          "z1": 13
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          11,
          7
        ]
      },
      {
        "name": "Empty west display stalls",
        "bounds": {
          "x0": 1,
          "x1": 6,
          "z0": 4,
          "z1": 13
        },
        "uses": [
          "empty-animal-display"
        ],
        "access": [
          3,
          8
        ]
      },
      {
        "name": "Rear tack supply",
        "bounds": {
          "x0": 1,
          "x1": 18,
          "z0": 15,
          "z1": 18
        },
        "uses": [
          "storage"
        ],
        "access": [
          11,
          16
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "oak entrance"
      ],
      [
        "sales-floor",
        "empty-animal-display",
        "west pen threshold"
      ],
      [
        "sales-floor",
        "storage",
        "rear feed cabinet"
      ]
    ],
    "towers": [
      [
        3,
        15,
        4
      ],
      [
        4,
        15,
        4
      ],
      [
        16,
        15,
        5
      ]
    ],
    "lamp": [
      9,
      8,
      3
    ],
    "roofMassing": [
      [
        2,
        6,
        4,
        10,
        4,
        "side-empty-pen-canopy"
      ],
      [
        10,
        17,
        15,
        17,
        3,
        "dry-tack-loft"
      ]
    ],
    "facadeGables": [
      [
        "front",
        6,
        13,
        5
      ]
    ],
    "facadeRecesses": [
      [
        4,
        8,
        19,
        "tack-service-bay"
      ],
      [
        13,
        17,
        19,
        "feed-deposit-nook"
      ]
    ],
    "frontPorticoes": [
      [
        6,
        13,
        2,
        "oak-pet-porch"
      ]
    ],
    "roofForm": "long wooden west pen canopy and raised rear supplies loft",
    "signature": "temperate medium pet supply market, separate open empty pen wing and rear tack storage",
    "title": "Foxglove Empty-Stall & Tack"
  },
  {
    "category": "magic-shop",
    "biome": "enchanted-forest",
    "size": "small",
    "w": 18,
    "d": 17,
    "h": 7,
    "entry": 8,
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:026",
    "partZ": [
      [
        11,
        9
      ]
    ],
    "partX": [
      [
        5,
        3,
        10,
        7
      ]
    ],
    "caps": [],
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
        12,
        4,
        "pack5:086",
        "inactive-counter",
        "ledger-service"
      ],
      [
        11,
        8,
        "pack5:093",
        "inactive-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        5,
        "pack5:091",
        "ledger",
        "cartographers-oak-desk"
      ],
      [
        3,
        14,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Unpowered relic gallery",
        "bounds": {
          "x0": 6,
          "x1": 16,
          "z0": 1,
          "z1": 10
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "arcane-display"
        ],
        "access": [
          9,
          6
        ]
      },
      {
        "name": "Enclosed west valuation",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 3,
          "z1": 10
        },
        "uses": [
          "secure-handling"
        ],
        "access": [
          3,
          7
        ]
      },
      {
        "name": "Rear relic stock",
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
          9,
          13
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "woodland relic vestibule"
      ],
      [
        "sales-floor",
        "secure-handling",
        "west private assessment"
      ],
      [
        "sales-floor",
        "storage",
        "rear sealed cabinet"
      ]
    ],
    "towers": [
      [
        3,
        13,
        4
      ],
      [
        14,
        13,
        5
      ]
    ],
    "lamp": [
      8,
      7,
      3
    ],
    "roofMassing": [
      [
        3,
        6,
        5,
        10,
        5,
        "inspection-ridge"
      ],
      [
        11,
        15,
        12,
        13,
        3,
        "reliquary-hood"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        4,
        12,
        5
      ]
    ],
    "facadeRecesses": [
      [
        11,
        14,
        16,
        "rear-relic-alcove"
      ]
    ],
    "frontPorticoes": [
      [
        5,
        12,
        3,
        "forest-reliquary-foyer"
      ]
    ],
    "roofForm": "tall enchanted narrow relic tower and off-center inspection hood",
    "signature": "enchanted small magic shop with separate western valuation and rear inert artifact cupboard",
    "title": "Starbark Unpowered Reliquary"
  },
  {
    "category": "potion-shop",
    "biome": "desert",
    "size": "large",
    "w": 25,
    "d": 23,
    "h": 9,
    "entry": 12,
    "foundation": "pack1:005",
    "floor": "pack5:081",
    "wall": "pack5:079",
    "roof": "pack5:080",
    "partZ": [
      [
        16,
        13
      ]
    ],
    "partX": [
      [
        7,
        4,
        15,
        9
      ]
    ],
    "caps": [],
    "windows": [
      [
        4,
        0
      ],
      [
        20,
        0
      ],
      [
        0,
        8
      ],
      [
        24,
        8
      ]
    ],
    "fixtures": [
      [
        18,
        4,
        "pack5:086",
        "inactive-counter",
        "ledger-service"
      ],
      [
        16,
        9,
        "pack5:087",
        "stock",
        "curio-arcade"
      ],
      [
        18,
        12,
        "pack5:087",
        "stock",
        "curio-arcade"
      ],
      [
        3,
        6,
        "pack5:089",
        "unlit-stand",
        "iron-tripod-cauldron"
      ],
      [
        4,
        12,
        "pack5:091",
        "ledger",
        "cartographers-oak-desk"
      ],
      [
        20,
        19,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Desert tincture gallery",
        "bounds": {
          "x0": 8,
          "x1": 23,
          "z0": 1,
          "z1": 15
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          13,
          8
        ]
      },
      {
        "name": "West inactive cold study",
        "bounds": {
          "x0": 1,
          "x1": 6,
          "z0": 4,
          "z1": 15
        },
        "uses": [
          "alchemy-workspace"
        ],
        "access": [
          3,
          9
        ]
      },
      {
        "name": "Rear secured mineral store",
        "bounds": {
          "x0": 1,
          "x1": 23,
          "z0": 17,
          "z1": 21
        },
        "uses": [
          "storage"
        ],
        "access": [
          13,
          19
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "sandstone arcade"
      ],
      [
        "sales-floor",
        "alchemy-workspace",
        "west inactive formula"
      ],
      [
        "sales-floor",
        "storage",
        "rear mineral gallery"
      ]
    ],
    "towers": [
      [
        3,
        18,
        4
      ],
      [
        4,
        18,
        4
      ],
      [
        21,
        18,
        5
      ]
    ],
    "lamp": [
      12,
      9,
      3
    ],
    "roofMassing": [
      [
        2,
        6,
        6,
        14,
        5,
        "sealed-retort-tower"
      ],
      [
        14,
        22,
        17,
        19,
        3,
        "drying-pavilion"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        7,
        17,
        5
      ]
    ],
    "facadeRecesses": [
      [
        4,
        9,
        22,
        "mineral-pickup"
      ],
      [
        16,
        21,
        22,
        "herbal-market-nook"
      ]
    ],
    "frontPorticoes": [
      [
        9,
        16,
        3,
        "desert-arcade-entry"
      ]
    ],
    "roofForm": "split plateau retort study and raised sun-drying roof pavilion",
    "signature": "large desert potion shop with separate west cold research, rear mineral storage and fully recessed public porch",
    "title": "Copperglass Desert Apothecary"
  },
  {
    "category": "bakery",
    "biome": "mountain",
    "size": "medium",
    "w": 21,
    "d": 20,
    "h": 8,
    "entry": 10,
    "foundation": "pack1:005",
    "floor": "pack2:013",
    "wall": "pack1:005",
    "roof": "pack3:025",
    "partZ": [
      [
        14,
        10
      ]
    ],
    "partX": [
      [
        15,
        4,
        13,
        8
      ]
    ],
    "caps": [],
    "windows": [
      [
        4,
        0
      ],
      [
        17,
        0
      ],
      [
        0,
        8
      ],
      [
        20,
        8
      ]
    ],
    "fixtures": [
      [
        6,
        4,
        "pack5:086",
        "inactive-counter",
        "ledger-service"
      ],
      [
        9,
        8,
        "pack5:087",
        "stock",
        "curio-arcade"
      ],
      [
        17,
        6,
        "pack5:090",
        "cold-oven",
        "ashstone-bake-oven"
      ],
      [
        18,
        10,
        "pack5:091",
        "ledger",
        "cartographers-oak-desk"
      ],
      [
        5,
        17,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Cliff bread hall",
        "bounds": {
          "x0": 1,
          "x1": 14,
          "z0": 1,
          "z1": 13
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          10,
          7
        ]
      },
      {
        "name": "East insulated stone oven",
        "bounds": {
          "x0": 16,
          "x1": 19,
          "z0": 4,
          "z1": 13
        },
        "uses": [
          "oven",
          "food-preparation"
        ],
        "access": [
          17,
          8
        ]
      },
      {
        "name": "Rear grain vault",
        "bounds": {
          "x0": 1,
          "x1": 19,
          "z0": 15,
          "z1": 18
        },
        "uses": [
          "storage"
        ],
        "access": [
          10,
          16
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "cliff baker's entry"
      ],
      [
        "sales-floor",
        "oven",
        "separate inactive stone oven"
      ],
      [
        "oven",
        "food-preparation",
        "chilled bake room"
      ],
      [
        "sales-floor",
        "storage",
        "rear dry grain"
      ]
    ],
    "towers": [
      [
        3,
        15,
        4
      ],
      [
        4,
        15,
        4
      ],
      [
        17,
        16,
        5
      ]
    ],
    "lamp": [
      10,
      8,
      3
    ],
    "roofMassing": [
      [
        4,
        11,
        10,
        12,
        4,
        "overhanging-cliff-bread-ridge"
      ],
      [
        17,
        18,
        5,
        8,
        6,
        "unlit-oven-flue"
      ]
    ],
    "facadeGables": [
      [
        "front",
        5,
        14,
        5
      ]
    ],
    "facadeRecesses": [
      [
        4,
        8,
        19,
        "bread-collection-bay"
      ],
      [
        15,
        18,
        19,
        "cold-oven-service"
      ]
    ],
    "frontPorticoes": [
      [
        7,
        14,
        2,
        "alpine-bread-entrance"
      ]
    ],
    "roofForm": "wide steep alpine bread gable and separate tall inactive chimney",
    "signature": "medium mountain bakery with full enclosed eastern oven room, central bread hall and far rear dry grain storage",
    "title": "Bouldercrumb Stone Breadworks"
  },
  {
    "category": "bank",
    "biome": "enchanted-forest",
    "size": "large",
    "w": 26,
    "d": 24,
    "h": 9,
    "entry": 12,
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:026",
    "partZ": [
      [
        17,
        13
      ]
    ],
    "partX": [
      [
        6,
        4,
        16,
        10
      ]
    ],
    "caps": [],
    "windows": [
      [
        4,
        0
      ],
      [
        21,
        0
      ],
      [
        0,
        8
      ],
      [
        25,
        9
      ]
    ],
    "fixtures": [
      [
        18,
        4,
        "pack5:086",
        "inactive-counter",
        "ledger-service"
      ],
      [
        20,
        8,
        "pack5:086",
        "inactive-counter",
        "ledger-service"
      ],
      [
        3,
        8,
        "pack5:091",
        "ledger",
        "cartographers-oak-desk"
      ],
      [
        17,
        20,
        "pack5:093",
        "inactive-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        22,
        21,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Protected public tellers",
        "bounds": {
          "x0": 7,
          "x1": 24,
          "z0": 1,
          "z1": 16
        },
        "uses": [
          "public-hall",
          "teller-service"
        ],
        "access": [
          13,
          8
        ]
      },
      {
        "name": "West ledger records wing",
        "bounds": {
          "x0": 1,
          "x1": 5,
          "z0": 4,
          "z1": 16
        },
        "uses": [
          "administrative-office"
        ],
        "access": [
          3,
          10
        ]
      },
      {
        "name": "Rear guarded grove vault",
        "bounds": {
          "x0": 1,
          "x1": 24,
          "z0": 18,
          "z1": 22
        },
        "uses": [
          "vault"
        ],
        "access": [
          13,
          20
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "public-hall",
        "broad forest bank arcade"
      ],
      [
        "public-hall",
        "administrative-office",
        "west records threshold"
      ],
      [
        "public-hall",
        "vault",
        "two-wide northern iron gate"
      ]
    ],
    "towers": [
      [
        3,
        19,
        4
      ],
      [
        4,
        19,
        4
      ],
      [
        21,
        19,
        6
      ]
    ],
    "lamp": [
      12,
      9,
      3
    ],
    "roofMassing": [
      [
        3,
        6,
        7,
        14,
        5,
        "ledgers-observatory"
      ],
      [
        14,
        21,
        18,
        21,
        6,
        "treasury-watchtower"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        8,
        19,
        5
      ]
    ],
    "facadeRecesses": [
      [
        5,
        9,
        23,
        "ledger-deposit"
      ],
      [
        17,
        21,
        23,
        "rear-buttress"
      ]
    ],
    "frontPorticoes": [
      [
        9,
        16,
        3,
        "teller-grove-arcade"
      ]
    ],
    "roofForm": "forest split protected banking observatory and broad rear treasury watch-roof",
    "signature": "large enchanted bank with side ledger wing, full public lobby, guarded rear two-wide vault and distinct tall observatory",
    "title": "Moonroot Grove Reserve Hall",
    "vaultDoor": [
      13,
      17
    ],
    "vaultDoorOrientation": "north",
    "vaultDoorVariant": "citadel-ironbound-leaves"
  }
]);
export const M1_MARKET_FRONTS=Object.freeze(M1_MARKET_FRONT_PROFILES.map(assembleSpecialistProfile));
