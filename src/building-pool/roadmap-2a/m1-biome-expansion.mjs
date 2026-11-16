// Source-exact second set of six genuine author-planned Builder 2A architecture candidates.
// Theoretical geometry only, no runtime placement or crafting/economy.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
export const M1_BIOME_EXPANSION_PROFILES=Object.freeze([
  {
    "floor": "pack2:013",
    "foundation": "pack1:005",
    "wall": "pack1:005",
    "roof": "pack3:025",
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
        14,
        10
      ]
    ],
    "caps": [
      [
        3,
        1,
        6
      ],
      [
        16,
        17,
        24
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
        22,
        18,
        6
      ]
    ],
    "category": "general-store",
    "biome": "mountain",
    "size": "large",
    "variation": 2,
    "w": 26,
    "d": 23,
    "h": 9,
    "entry": 12,
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
        "counter",
        "ledger-service"
      ],
      [
        12,
        7,
        "pack5:087",
        "shelves",
        "curio-arcade"
      ],
      [
        19,
        11,
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
        19,
        "pack4:057",
        "goods-crate",
        null
      ],
      [
        20,
        19,
        "pack4:057",
        "goods-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Mountain trading gallery",
        "bounds": {
          "x0": 8,
          "x1": 24,
          "z0": 1,
          "z1": 14
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "display-shelves"
        ],
        "access": [
          13,
          7
        ]
      },
      {
        "name": "West customs chamber",
        "bounds": {
          "x0": 1,
          "x1": 6,
          "z0": 4,
          "z1": 14
        },
        "uses": [
          "ledger-work"
        ],
        "access": [
          3,
          10
        ]
      },
      {
        "name": "Northern caravan freight supply",
        "bounds": {
          "x0": 1,
          "x1": 24,
          "z0": 16,
          "z1": 21
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
        "covered mountain trading entrance"
      ],
      [
        "sales-floor",
        "ledger-work",
        "rockside customs doorway"
      ],
      [
        "sales-floor",
        "storage",
        "wide rear freight arch"
      ]
    ],
    "roofMassing": [
      [
        4,
        9,
        6,
        17,
        5,
        "freight-loft-ridge"
      ],
      [
        15,
        21,
        14,
        20,
        4,
        "separate-caravan-stores-roof"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        6,
        18,
        6
      ],
      [
        "front",
        7,
        19,
        4
      ]
    ],
    "title": "Highcrag Stone Caravan Exchange",
    "roofForm": "split mountain saddleback and elevated freight loft",
    "signature": "large three-zone mountain trade lodge with enclosed customs office, broad storehouse and raised freight loft",
    "lamp": [
      12,
      9,
      3
    ]
  },
  {
    "floor": "pack2:013",
    "foundation": "pack1:001",
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
        8,
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
        19,
        18,
        5
      ]
    ],
    "category": "pet-shop",
    "biome": "enchanted-forest",
    "size": "large",
    "w": 24,
    "d": 22,
    "h": 9,
    "entry": 12,
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
        9
      ],
      [
        23,
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
        19,
        11,
        "pack5:087",
        "shelves",
        "curio-arcade"
      ],
      [
        2,
        5,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        5,
        5,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "west"
      ],
      [
        2,
        9,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "west"
      ],
      [
        5,
        10,
        "pack5:096",
        "empty-display-stall",
        "oak-stall-divider",
        "north"
      ],
      [
        5,
        18,
        "pack4:057",
        "goods-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Large dry pet-supply market",
        "bounds": {
          "x0": 9,
          "x1": 22,
          "z0": 1,
          "z1": 14
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          13,
          7
        ]
      },
      {
        "name": "Empty side display enclosure",
        "bounds": {
          "x0": 1,
          "x1": 7,
          "z0": 4,
          "z1": 13
        },
        "uses": [
          "empty-animal-display"
        ],
        "access": [
          3,
          9
        ]
      },
      {
        "name": "Rear equipment and empty-feed store",
        "bounds": {
          "x0": 1,
          "x1": 22,
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
        "livingwood arcade front"
      ],
      [
        "sales-floor",
        "empty-animal-display",
        "west empty enclosure entrance"
      ],
      [
        "sales-floor",
        "storage",
        "rear enclosed feed store"
      ]
    ],
    "roofMassing": [
      [
        2,
        7,
        5,
        12,
        4,
        "covered-empty-stall-loft"
      ],
      [
        14,
        19,
        7,
        16,
        3,
        "forest-supply-arcade-overstory"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        3,
        11,
        5
      ]
    ],
    "title": "Thornbark Empty-Stall Conservatory",
    "roofForm": "paired livingwood canopy over empty exhibition pens and retail arcade",
    "signature": "large enchanted pet supplier with separate never-occupied stall wing and protected rear dry store",
    "lamp": [
      12,
      9,
      3
    ]
  },
  {
    "floor": "pack2:013",
    "foundation": "pack1:001",
    "wall": "pack2:013",
    "roof": "pack3:023",
    "partZ": [
      [
        16,
        11
      ]
    ],
    "partX": [
      [
        6,
        4,
        14,
        9
      ]
    ],
    "caps": [
      [
        3,
        1,
        5
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
        19,
        17,
        5
      ]
    ],
    "category": "magic-shop",
    "biome": "temperate",
    "size": "large",
    "w": 23,
    "d": 23,
    "h": 9,
    "entry": 11,
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
        0,
        10
      ],
      [
        22,
        9
      ]
    ],
    "fixtures": [
      [
        16,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        12,
        7,
        "pack5:093",
        "unpowered-curio",
        "sunspire-reliquary-plinth"
      ],
      [
        17,
        11,
        "pack5:093",
        "unpowered-curio",
        "sunspire-reliquary-plinth"
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
        19,
        "pack4:057",
        "goods-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Unpowered curio galleries",
        "bounds": {
          "x0": 7,
          "x1": 21,
          "z0": 1,
          "z1": 15
        },
        "uses": [
          "sales-floor",
          "service-counter",
          "arcane-display"
        ],
        "access": [
          11,
          7
        ]
      },
      {
        "name": "West private valuation desk",
        "bounds": {
          "x0": 1,
          "x1": 5,
          "z0": 4,
          "z1": 14
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
        "name": "Deep safe relic backroom",
        "bounds": {
          "x0": 1,
          "x1": 21,
          "z0": 17,
          "z1": 21
        },
        "uses": [
          "storage"
        ],
        "access": [
          11,
          19
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "temperate wide storefront"
      ],
      [
        "sales-floor",
        "secure-handling",
        "west enclosed evaluation room"
      ],
      [
        "sales-floor",
        "storage",
        "sealed rear archive door"
      ]
    ],
    "roofMassing": [
      [
        10,
        14,
        5,
        17,
        5,
        "urban-relic-clerestory"
      ],
      [
        2,
        5,
        6,
        12,
        3,
        "private-appraisal-porch"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        7,
        17,
        5
      ],
      [
        "front",
        10,
        14,
        5
      ]
    ],
    "title": "Silverleaf Unpowered Curio Galleries",
    "roofForm": "wide temperate merchant clerestory and detached appraisal roof",
    "signature": "large temperate magical trading hall with vaulted central display, west private evaluation and rear store",
    "lamp": [
      11,
      9,
      3
    ]
  },
  {
    "floor": "pack2:013",
    "foundation": "pack1:004",
    "wall": "pack5:079",
    "roof": "pack3:025",
    "partZ": [
      [
        11,
        9
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
        16
      ]
    ],
    "towers": [
      [
        3,
        13,
        4
      ],
      [
        4,
        13,
        4
      ],
      [
        15,
        12,
        5
      ]
    ],
    "category": "potion-shop",
    "biome": "snow",
    "size": "small",
    "w": 18,
    "d": 17,
    "h": 7,
    "entry": 9,
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
        7
      ],
      [
        17,
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
        6,
        "pack5:089",
        "unlit-mixing-station",
        "iron-tripod-cauldron"
      ],
      [
        4,
        14,
        "pack4:057",
        "goods-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Snowbound remedy counter",
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
          9,
          6
        ]
      },
      {
        "name": "East unlit tincture alcove",
        "bounds": {
          "x0": 13,
          "x1": 16,
          "z0": 4,
          "z1": 9
        },
        "uses": [
          "alchemy-workspace"
        ],
        "access": [
          15,
          7
        ]
      },
      {
        "name": "Rear dried winter roots",
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
        "heated-looking snow canopy only"
      ],
      [
        "sales-floor",
        "alchemy-workspace",
        "east cold preparation doorway"
      ],
      [
        "sales-floor",
        "storage",
        "rear medicinal herb store"
      ]
    ],
    "roofMassing": [
      [
        4,
        10,
        7,
        12,
        5,
        "snow-shedding-remedy-ridge"
      ],
      [
        13,
        15,
        5,
        8,
        4,
        "sealed-cold-tincture-roof-vent"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        5,
        13,
        6
      ]
    ],
    "title": "Whitecap Winter Remedies",
    "roofForm": "steep capped snow ridge and separate cold-workshop roof vent",
    "signature": "small snowbound apothecary with distinct eastern formula room and back winter root supplies",
    "lamp": [
      9,
      7,
      3
    ]
  },
  {
    "floor": "pack2:013",
    "foundation": "pack1:001",
    "wall": "pack5:079",
    "roof": "pack3:026",
    "partZ": [
      [
        13,
        11
      ]
    ],
    "partX": [
      [
        14,
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
    "towers": [
      [
        2,
        15,
        4
      ],
      [
        3,
        15,
        4
      ],
      [
        17,
        17,
        5
      ]
    ],
    "category": "bakery",
    "biome": "enchanted-forest",
    "size": "medium",
    "w": 20,
    "d": 20,
    "h": 8,
    "entry": 10,
    "windows": [
      [
        3,
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
        8,
        "pack5:087",
        "shelves",
        "curio-arcade"
      ],
      [
        16,
        7,
        "pack5:090",
        "unlit-oven",
        "ashstone-bake-oven"
      ],
      [
        17,
        9,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        5,
        16,
        "pack4:057",
        "goods-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Rootbread market counter",
        "bounds": {
          "x0": 1,
          "x1": 13,
          "z0": 1,
          "z1": 12
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
        "name": "East insulated unlit bakehouse",
        "bounds": {
          "x0": 15,
          "x1": 18,
          "z0": 4,
          "z1": 11
        },
        "uses": [
          "oven",
          "food-preparation"
        ],
        "access": [
          16,
          8
        ]
      },
      {
        "name": "Rear flour root cellar",
        "bounds": {
          "x0": 1,
          "x1": 18,
          "z0": 14,
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
        "ancient timber front"
      ],
      [
        "sales-floor",
        "oven",
        "separate cold bake room"
      ],
      [
        "oven",
        "food-preparation",
        "unlit preparation bench"
      ],
      [
        "sales-floor",
        "storage",
        "rear flour stock door"
      ]
    ],
    "roofMassing": [
      [
        3,
        8,
        6,
        14,
        3,
        "livingwood-bread-loft"
      ],
      [
        16,
        18,
        6,
        8,
        6,
        "inactive-ovenhouse-flue"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        5,
        13,
        5
      ],
      [
        "front",
        5,
        12,
        4
      ]
    ],
    "title": "Briarwood Rootbread Bakery",
    "roofForm": "enchanted double-gabled bread canopy and inactive chimney",
    "signature": "medium enchanted bakery with east enclosed physical oven preparation and rear distinct flour cellar",
    "lamp": [
      10,
      8,
      3
    ]
  },
  {
    "floor": "pack2:013",
    "foundation": "pack1:004",
    "wall": "pack1:005",
    "roof": "pack3:025",
    "partZ": [
      [
        14,
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
    "caps": [
      [
        3,
        1,
        5
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
    "category": "bank",
    "biome": "snow",
    "size": "medium",
    "w": 21,
    "d": 20,
    "h": 8,
    "entry": 10,
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
        7
      ],
      [
        20,
        8
      ]
    ],
    "fixtures": [
      [
        12,
        4,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        16,
        6,
        "pack5:086",
        "counter",
        "ledger-service"
      ],
      [
        3,
        9,
        "pack5:091",
        "desk",
        "cartographers-oak-desk"
      ],
      [
        14,
        17,
        "pack5:093",
        "unpowered-curio",
        "sunspire-reliquary-plinth"
      ],
      [
        5,
        17,
        "pack4:057",
        "goods-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Frozen merchant public teller hall",
        "bounds": {
          "x0": 7,
          "x1": 19,
          "z0": 1,
          "z1": 13
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
        "name": "West private account records",
        "bounds": {
          "x0": 1,
          "x1": 5,
          "z0": 4,
          "z1": 12
        },
        "uses": [
          "administrative-office"
        ],
        "access": [
          3,
          8
        ]
      },
      {
        "name": "North stored treasury",
        "bounds": {
          "x0": 1,
          "x1": 19,
          "z0": 15,
          "z1": 18
        },
        "uses": [
          "vault"
        ],
        "access": [
          11,
          17
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "public-hall",
        "northern cold-entry threshold"
      ],
      [
        "public-hall",
        "administrative-office",
        "private western records doorway"
      ],
      [
        "public-hall",
        "vault",
        "two-wide nonfunctional metal vault gate"
      ]
    ],
    "roofMassing": [
      [
        11,
        17,
        15,
        17,
        5,
        "cold-treasury-guard-roof"
      ],
      [
        7,
        12,
        5,
        9,
        3,
        "covered-public-teller-clerestory"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        6,
        16,
        5
      ],
      [
        "front",
        7,
        14,
        4
      ]
    ],
    "vaultDoor": [
      11,
      14
    ],
    "vaultDoorOrientation": "north",
    "vaultDoorVariant": "citadel-ironbound-leaves",
    "title": "Icevein Public Treasury",
    "roofForm": "frostproof split archive treasury roof with two-level clerestory",
    "signature": "medium snow bank with separated private records, full two-cell protected rear vault and dual counter",
    "lamp": [
      10,
      8,
      3
    ]
  }
]);
export const M1_BIOME_EXPANSION=Object.freeze(M1_BIOME_EXPANSION_PROFILES.map(assembleSpecialistProfile));
