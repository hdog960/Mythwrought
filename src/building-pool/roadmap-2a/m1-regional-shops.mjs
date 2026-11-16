// Six independent coordinate-authored 2A merchant and banking regional examples.
// No gameplay, production registration, world placement, or schema-1 modification.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
export const M1_REGIONAL_PROFILES=Object.freeze([
  {
    "category": "general-store",
    "biome": "temperate",
    "size": "medium",
    "w": 19,
    "d": 18,
    "h": 7,
    "entry": 9,
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack2:013",
    "roof": "pack3:023",
    "partZ": [
      [
        12,
        10
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
      ]
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        15,
        0
      ],
      [
        0,
        7
      ],
      [
        18,
        8
      ]
    ],
    "fixtures": [
      [
        13,
        3,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        8,
        5,
        "pack5:087",
        "shelves",
        "curio-arcade"
      ],
      [
        14,
        9,
        "pack5:087",
        "shelves",
        "curio-arcade"
      ],
      [
        3,
        8,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        5,
        15,
        "pack4:057",
        "crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Riverside public shop",
        "bounds": {
          "x0": 6,
          "x1": 17,
          "z0": 1,
          "z1": 11
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "display-shelves"
        ],
        "access": [
          9,
          6
        ]
      },
      {
        "name": "West ledger room",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 4,
          "z1": 10
        },
        "uses": [
          "ledger-work"
        ],
        "access": [
          3,
          7
        ]
      },
      {
        "name": "Rear cargo room",
        "bounds": {
          "x0": 1,
          "x1": 17,
          "z0": 13,
          "z1": 16
        },
        "uses": [
          "storage"
        ],
        "access": [
          10,
          14
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "river arcade"
      ],
      [
        "sales-floor",
        "ledger-work",
        "side counting door"
      ],
      [
        "sales-floor",
        "storage",
        "rear cargo opening"
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
        14,
        4
      ]
    ],
    "lamp": [
      9,
      7,
      3
    ],
    "title": "Brookmere Twin-Aisle Merchant Exchange",
    "roofForm": "two stepped timber merchant gables over market aisle and rear loading monitor",
    "signature": "temperate twin-aisle merchant gallery with isolated west ledger and real rear cargo space",
    "variation": 2,
    "roofMassing": [
      [
        6,
        12,
        5,
        5,
        4,
        "merchant-double-gable-ridge"
      ],
      [
        14,
        16,
        12,
        14,
        3,
        "enclosed-stockroom-monitor"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        6,
        12,
        5
      ],
      [
        "front",
        5,
        13,
        4
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "desert",
    "size": "medium",
    "w": 19,
    "d": 18,
    "h": 7,
    "entry": 9,
    "foundation": "pack1:005",
    "floor": "pack5:081",
    "wall": "pack5:079",
    "roof": "pack5:080",
    "partZ": [
      [
        12,
        9
      ]
    ],
    "partX": [],
    "caps": [],
    "windows": [
      [
        3,
        0
      ],
      [
        15,
        0
      ],
      [
        0,
        6
      ],
      [
        18,
        7
      ]
    ],
    "fixtures": [
      [
        14,
        3,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        2,
        4,
        "pack5:096",
        "empty-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        5,
        4,
        "pack5:096",
        "empty-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        2,
        8,
        "pack5:096",
        "empty-stall",
        "oak-stall-divider",
        "west"
      ],
      [
        5,
        8,
        "pack5:096",
        "empty-stall",
        "oak-stall-divider",
        "west"
      ],
      [
        3,
        7,
        "pack5:096",
        "empty-trough",
        "stone-feed-trough"
      ],
      [
        15,
        9,
        "pack5:087",
        "shelves",
        "curio-arcade"
      ],
      [
        4,
        15,
        "pack4:057",
        "crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Empty animal supply retail",
        "bounds": {
          "x0": 1,
          "x1": 17,
          "z0": 1,
          "z1": 11
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "empty-animal-display"
        ],
        "access": [
          9,
          6
        ]
      },
      {
        "name": "Dry stockroom",
        "bounds": {
          "x0": 1,
          "x1": 17,
          "z0": 13,
          "z1": 16
        },
        "uses": [
          "storage"
        ],
        "access": [
          9,
          14
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "desert shop threshold"
      ],
      [
        "sales-floor",
        "storage",
        "rear dry goods passage"
      ]
    ],
    "towers": [
      [
        3,
        4,
        3
      ],
      [
        5,
        4,
        3
      ],
      [
        15,
        14,
        4
      ]
    ],
    "lamp": [
      9,
      7,
      3
    ],
    "title": "Saltcrest Empty-Pen Trading House",
    "roofForm": "low twin desert sunshades with one raised south-court windward turret",
    "signature": "desert medium pet supplies with four independent nonoverlapping directional two-cell stall modules",
    "roofMassing": [
      [
        2,
        6,
        4,
        6,
        3,
        "shade-terrace-over-pen-court"
      ],
      [
        12,
        16,
        9,
        12,
        4,
        "sandstone-crosswind-vent-stack"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        12,
        16,
        4
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "mountain",
    "size": "medium",
    "w": 21,
    "d": 19,
    "h": 8,
    "entry": 10,
    "foundation": "pack1:005",
    "floor": "pack2:013",
    "wall": "pack1:005",
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
        11,
        8
      ]
    ],
    "caps": [
      [
        3,
        1,
        5
      ]
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        17,
        0
      ],
      [
        0,
        6
      ],
      [
        20,
        7
      ]
    ],
    "fixtures": [
      [
        15,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        10,
        6,
        "pack5:093",
        "inactive-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        16,
        9,
        "pack5:093",
        "inactive-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        7,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        4,
        16,
        "pack4:057",
        "crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Sigil sales hall",
        "bounds": {
          "x0": 7,
          "x1": 19,
          "z0": 1,
          "z1": 12
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "arcane-display"
        ],
        "access": [
          10,
          7
        ]
      },
      {
        "name": "West sealed appraisal",
        "bounds": {
          "x0": 1,
          "x1": 5,
          "z0": 4,
          "z1": 11
        },
        "uses": [
          "secure-handling"
        ],
        "access": [
          3,
          8
        ]
      },
      {
        "name": "Cliffside back records",
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
        "cliff front"
      ],
      [
        "sales-floor",
        "secure-handling",
        "sealed west aperture"
      ],
      [
        "sales-floor",
        "storage",
        "rear rock store"
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
        18,
        15,
        5
      ]
    ],
    "lamp": [
      10,
      8,
      3
    ],
    "title": "Stonewhisper Sealkeepers",
    "roofForm": "narrow tall mountain ridge crest with broken rear rockside appraisal gable",
    "signature": "mountain sigil dealer with physically enclosed west secure inspection chamber and deep rock repository",
    "roofMassing": [
      [
        8,
        11,
        4,
        13,
        5,
        "high-cliff-ridge-observation"
      ],
      [
        15,
        17,
        14,
        16,
        3,
        "rock-cairn-back-archive"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        8,
        15,
        5
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "enchanted-forest",
    "size": "large",
    "w": 25,
    "d": 22,
    "h": 9,
    "entry": 12,
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:026",
    "partZ": [
      [
        15,
        13
      ]
    ],
    "partX": [
      [
        7,
        4,
        13,
        9
      ]
    ],
    "caps": [
      [
        3,
        1,
        6
      ]
    ],
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
        9
      ]
    ],
    "fixtures": [
      [
        17,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        10,
        6,
        "pack5:087",
        "shelves",
        "curio-arcade"
      ],
      [
        17,
        11,
        "pack5:087",
        "shelves",
        "curio-arcade"
      ],
      [
        3,
        8,
        "pack5:089",
        "unlit-cauldron",
        "iron-tripod-cauldron"
      ],
      [
        4,
        10,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        6,
        18,
        "pack4:057",
        "crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Moonmoss sales hall",
        "bounds": {
          "x0": 8,
          "x1": 23,
          "z0": 1,
          "z1": 14
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          12,
          7
        ]
      },
      {
        "name": "West contained formula room",
        "bounds": {
          "x0": 1,
          "x1": 6,
          "z0": 4,
          "z1": 13
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
        "name": "Rear dried herb repository",
        "bounds": {
          "x0": 1,
          "x1": 23,
          "z0": 16,
          "z1": 20
        },
        "uses": [
          "storage"
        ],
        "access": [
          13,
          18
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "enchanted woodland front"
      ],
      [
        "sales-floor",
        "alchemy-workspace",
        "isolation doorway"
      ],
      [
        "sales-floor",
        "storage",
        "rear herb room"
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
        20,
        18,
        5
      ]
    ],
    "lamp": [
      12,
      9,
      3
    ],
    "title": "Moonmoss Sealed Alchemy Galleries",
    "roofForm": "two offset elevated enclosed formula and herbal drying roofs under livingwood gable",
    "signature": "large enchanted apothecary with distinct west contained formula space and rear aromatic dry store",
    "roofMassing": [
      [
        2,
        6,
        5,
        11,
        4,
        "contained-formula-vent-roof"
      ],
      [
        14,
        19,
        17,
        19,
        3,
        "herb-drying-roof-monitor"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        3,
        9,
        5
      ],
      [
        "front",
        12,
        20,
        4
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "snow",
    "size": "medium",
    "w": 19,
    "d": 18,
    "h": 8,
    "entry": 9,
    "foundation": "pack1:004",
    "floor": "pack2:013",
    "wall": "pack5:079",
    "roof": "pack3:025",
    "partZ": [
      [
        12,
        10
      ]
    ],
    "partX": [
      [
        13,
        4,
        10,
        7
      ]
    ],
    "caps": [
      [
        3,
        1,
        5
      ]
    ],
    "windows": [
      [
        3,
        0
      ],
      [
        15,
        0
      ],
      [
        0,
        6
      ],
      [
        18,
        8
      ]
    ],
    "fixtures": [
      [
        5,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        7,
        7,
        "pack5:087",
        "shelves",
        "curio-arcade"
      ],
      [
        15,
        7,
        "pack5:090",
        "unlit-oven",
        "ashstone-bake-oven"
      ],
      [
        15,
        9,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        5,
        15,
        "pack4:057",
        "crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Frost baking sales hall",
        "bounds": {
          "x0": 1,
          "x1": 12,
          "z0": 1,
          "z1": 11
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          9,
          6
        ]
      },
      {
        "name": "Insulated unlit oven cell",
        "bounds": {
          "x0": 14,
          "x1": 17,
          "z0": 4,
          "z1": 10
        },
        "uses": [
          "oven",
          "food-preparation"
        ],
        "access": [
          15,
          8
        ]
      },
      {
        "name": "Rear flour gallery",
        "bounds": {
          "x0": 1,
          "x1": 17,
          "z0": 13,
          "z1": 16
        },
        "uses": [
          "storage"
        ],
        "access": [
          10,
          14
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "snow street entry"
      ],
      [
        "sales-floor",
        "oven",
        "east oven threshold"
      ],
      [
        "oven",
        "food-preparation",
        "nonfunctional prep space"
      ],
      [
        "sales-floor",
        "storage",
        "rear flour room"
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
        15,
        5
      ]
    ],
    "lamp": [
      9,
      8,
      3
    ],
    "title": "Snowcrust Hearth Hall",
    "roofForm": "tall unlit snow ovenhouse chimney beside stepped broad hearth ridge and rear gable",
    "signature": "mid snowy bakery with genuinely enclosed insulated east oven and cold north flour inventory",
    "roofMassing": [
      [
        14,
        16,
        6,
        8,
        6,
        "unlit-ovenhouse-chimney-masonry"
      ],
      [
        4,
        10,
        9,
        10,
        4,
        "snow-shedding-main-bakery-ridge"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        5,
        13,
        5
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "desert",
    "size": "large",
    "w": 24,
    "d": 22,
    "h": 9,
    "entry": 11,
    "foundation": "pack1:005",
    "floor": "pack5:081",
    "wall": "pack5:079",
    "roof": "pack5:080",
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
        8
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
        19,
        0
      ],
      [
        0,
        7
      ],
      [
        23,
        8
      ]
    ],
    "fixtures": [
      [
        10,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        13,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        16,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        3,
        8,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        7,
        18,
        "pack5:093",
        "inactive-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        19,
        18,
        "pack4:057",
        "crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Sandstone public tellers",
        "bounds": {
          "x0": 6,
          "x1": 22,
          "z0": 1,
          "z1": 14
        },
        "uses": [
          "public-hall",
          "teller-service"
        ],
        "access": [
          11,
          7
        ]
      },
      {
        "name": "West ledger office",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 4,
          "z1": 13
        },
        "uses": [
          "administrative-office"
        ],
        "access": [
          3,
          9
        ]
      },
      {
        "name": "Rear secured vault",
        "bounds": {
          "x0": 1,
          "x1": 22,
          "z0": 16,
          "z1": 20
        },
        "uses": [
          "vault"
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
        "public-hall",
        "desert avenue"
      ],
      [
        "public-hall",
        "administrative-office",
        "west bookkeeping door"
      ],
      [
        "public-hall",
        "vault",
        "two-wide northern security portal"
      ]
    ],
    "towers": [
      [
        3,
        17,
        4
      ],
      [
        4,
        17,
        4
      ],
      [
        20,
        17,
        5
      ]
    ],
    "lamp": [
      11,
      9,
      3
    ],
    "title": "Sandscript Treasury Archive",
    "roofForm": "double parapet treasury with central clerestory and broad guarded rear crest",
    "signature": "large desert financial hall with three counters, west separate ledgers and full two-cell wide secure treasury doorway",
    "vaultDoor": [
      12,
      15
    ],
    "vaultDoorOrientation": "north",
    "vaultDoorVariant": "citadel-ironbound-leaves",
    "roofMassing": [
      [
        8,
        14,
        7,
        11,
        5,
        "raised-secure-teller-clerestory"
      ],
      [
        10,
        16,
        17,
        19,
        3,
        "treasury-roofed-watch-gallery"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        7,
        18,
        5
      ],
      [
        "front",
        8,
        16,
        5
      ]
    ]
  }
]);
export const M1_REGIONAL_SHOPS=Object.freeze(M1_REGIONAL_PROFILES.map(assembleSpecialistProfile));
