// Builder 2A M1: six distinct merchant and banking authored plans, one per category.
// Read-only theoretical structural coordinates with no live placement/IDs/gameplay.
import {assembleSpecialistProfile} from './m1-specialist-exemplars.mjs';
export const M1_CATEGORY_ARCADES_PROFILES=Object.freeze([
  {
    "category": "general-store",
    "biome": "desert",
    "size": "large",
    "w": 26,
    "d": 22,
    "h": 9,
    "entry": 12,
    "foundation": "pack1:005",
    "floor": "pack5:081",
    "wall": "pack5:079",
    "roof": "pack5:080",
    "partZ": [
      [
        14,
        12
      ]
    ],
    "partX": [
      [
        6,
        3,
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
        21,
        0
      ],
      [
        0,
        9
      ],
      [
        25,
        10
      ]
    ],
    "fixtures": [
      [
        17,
        4,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        20,
        7,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        12,
        8,
        "pack5:087",
        "unpowered-display",
        "curio-arcade"
      ],
      [
        18,
        11,
        "pack5:087",
        "unpowered-display",
        "curio-arcade"
      ],
      [
        3,
        6,
        "pack5:091",
        "work-desk",
        "cartographers-oak-desk"
      ],
      [
        5,
        18,
        "pack4:057",
        "stock-crate",
        null
      ],
      [
        21,
        18,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Sand caravan retail arcade",
        "bounds": {
          "x0": 7,
          "x1": 24,
          "z0": 1,
          "z1": 13
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
        "name": "West enclosed customs ledger",
        "bounds": {
          "x0": 1,
          "x1": 5,
          "z0": 3,
          "z1": 13
        },
        "uses": [
          "ledger-work"
        ],
        "access": [
          3,
          9
        ]
      },
      {
        "name": "Shaded rear freight store",
        "bounds": {
          "x0": 1,
          "x1": 24,
          "z0": 15,
          "z1": 20
        },
        "uses": [
          "storage"
        ],
        "access": [
          13,
          17
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "covered desert trader entrance"
      ],
      [
        "sales-floor",
        "ledger-work",
        "west customs wicket"
      ],
      [
        "sales-floor",
        "storage",
        "rear freight corridor"
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
        22,
        17,
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
        8,
        6,
        15,
        4,
        "desert-clothless-stone-shade"
      ],
      [
        15,
        21,
        15,
        19,
        5,
        "upper-caravan-freight-masjid"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        6,
        18,
        5
      ]
    ],
    "facadeRecesses": [
      [
        4,
        9,
        21,
        "sunken-caravan-loading"
      ],
      [
        17,
        21,
        21,
        "arched-merchant-receiving"
      ]
    ],
    "title": "Dunewatch Caravan Merchants",
    "roofForm": "large twin caravan court masonry arcades, rear load portico and stepped sun shelter",
    "signature": "desert large general store with wide front sales, west enclosed customs and two independent recessed rear supply court bays",
    "variation": 2,
    "frontPorticoes": [
      [
        9,
        16,
        2,
        "desert-general-store-portico"
      ]
    ]
  },
  {
    "category": "pet-shop",
    "biome": "mountain",
    "size": "small",
    "w": 17,
    "d": 17,
    "h": 7,
    "entry": 8,
    "foundation": "pack1:005",
    "floor": "pack2:013",
    "wall": "pack1:005",
    "roof": "pack3:025",
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
        13,
        0
      ],
      [
        0,
        6
      ],
      [
        16,
        7
      ]
    ],
    "fixtures": [
      [
        12,
        4,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        13,
        8,
        "pack5:087",
        "unpowered-display",
        "curio-arcade"
      ],
      [
        2,
        4,
        "pack5:096",
        "empty-display-pen",
        "oak-stall-divider",
        "north"
      ],
      [
        2,
        8,
        "pack5:096",
        "empty-display-pen",
        "oak-stall-divider",
        "north"
      ],
      [
        4,
        6,
        "pack5:096",
        "empty-feed-trough",
        "stone-feed-trough"
      ],
      [
        4,
        14,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Rockside mountain tack shop",
        "bounds": {
          "x0": 6,
          "x1": 15,
          "z0": 1,
          "z1": 10
        },
        "uses": [
          "sales-floor",
          "service-counter"
        ],
        "access": [
          10,
          5
        ]
      },
      {
        "name": "Separate empty hillside pens",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 3,
          "z1": 10
        },
        "uses": [
          "empty-animal-display"
        ],
        "access": [
          3,
          6
        ]
      },
      {
        "name": "Rear stored dry fodder",
        "bounds": {
          "x0": 1,
          "x1": 15,
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
        "cliff supply kiosk"
      ],
      [
        "sales-floor",
        "empty-animal-display",
        "west hillside divider"
      ],
      [
        "sales-floor",
        "storage",
        "deep stocked rock cave"
      ]
    ],
    "towers": [
      [
        3,
        13,
        4
      ],
      [
        12,
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
        2,
        5,
        4,
        9,
        4,
        "cliffside-raised-empty-pen-roof"
      ],
      [
        10,
        13,
        12,
        13,
        3,
        "mountain-feed-loft"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        5,
        11,
        5
      ]
    ],
    "facadeRecesses": [
      [
        11,
        14,
        16,
        "rock-tack-pickup"
      ]
    ],
    "title": "Cragsong Empty-Pen Outfitters",
    "roofForm": "narrow mountain stall canopy on high western flank and stone feed loft",
    "signature": "small mountain supplier with distinct west empty pens, east service and rear granary",
    "frontPorticoes": [
      [
        6,
        11,
        2,
        "mountain-pet-shop-portico"
      ]
    ]
  },
  {
    "category": "magic-shop",
    "biome": "desert",
    "size": "medium",
    "w": 20,
    "d": 19,
    "h": 8,
    "entry": 10,
    "foundation": "pack1:005",
    "floor": "pack5:081",
    "wall": "pack5:079",
    "roof": "pack5:080",
    "partZ": [
      [
        12,
        10
      ]
    ],
    "partX": [
      [
        5,
        3,
        11,
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
        16,
        0
      ],
      [
        0,
        7
      ],
      [
        19,
        8
      ]
    ],
    "fixtures": [
      [
        13,
        4,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        10,
        7,
        "pack5:093",
        "cold-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        15,
        9,
        "pack5:093",
        "cold-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        3,
        5,
        "pack5:091",
        "work-desk",
        "cartographers-oak-desk"
      ],
      [
        4,
        16,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Sunstone curio bazaar",
        "bounds": {
          "x0": 6,
          "x1": 18,
          "z0": 1,
          "z1": 11
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
        "name": "West sealed consultation",
        "bounds": {
          "x0": 1,
          "x1": 4,
          "z0": 3,
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
        "name": "Rear inert rune stock",
        "bounds": {
          "x0": 1,
          "x1": 18,
          "z0": 13,
          "z1": 17
        },
        "uses": [
          "storage"
        ],
        "access": [
          10,
          15
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "sunstone street entrance"
      ],
      [
        "sales-floor",
        "secure-handling",
        "west evaluation room"
      ],
      [
        "sales-floor",
        "storage",
        "northern enclosed artifact cupboard"
      ]
    ],
    "towers": [
      [
        3,
        14,
        4
      ],
      [
        15,
        14,
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
        8,
        11,
        4,
        13,
        5,
        "windscarred-curio-observation-ridge"
      ],
      [
        2,
        4,
        5,
        11,
        4,
        "sealed-consultation-masonry"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        7,
        15,
        5
      ]
    ],
    "facadeRecesses": [
      [
        7,
        11,
        18,
        "desert-sealed-relic-arcade"
      ],
      [
        14,
        17,
        18,
        "curio-market-inset"
      ]
    ],
    "title": "Sunscar Unpowered Relic Arcade",
    "roofForm": "desert parapet bazaar with tall unpowered relic tower and inset arched display bays",
    "signature": "medium desert curio hall with independent rear lockup, private west sealroom and high arched relief",
    "frontPorticoes": [
      [
        7,
        14,
        3,
        "desert-magic-shop-portico"
      ]
    ]
  },
  {
    "category": "potion-shop",
    "biome": "mountain",
    "size": "large",
    "w": 24,
    "d": 22,
    "h": 9,
    "entry": 12,
    "foundation": "pack1:005",
    "floor": "pack2:013",
    "wall": "pack1:005",
    "roof": "pack3:025",
    "partZ": [
      [
        15,
        12
      ]
    ],
    "partX": [
      [
        7,
        4,
        14,
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
        19,
        0
      ],
      [
        0,
        7
      ],
      [
        23,
        9
      ]
    ],
    "fixtures": [
      [
        18,
        4,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        12,
        7,
        "pack5:087",
        "unpowered-display",
        "curio-arcade"
      ],
      [
        18,
        10,
        "pack5:087",
        "unpowered-display",
        "curio-arcade"
      ],
      [
        3,
        7,
        "pack5:089",
        "cold-cauldron",
        "iron-tripod-cauldron"
      ],
      [
        4,
        11,
        "pack5:091",
        "work-desk",
        "cartographers-oak-desk"
      ],
      [
        5,
        18,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Alpine botanist retail hall",
        "bounds": {
          "x0": 8,
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
        "name": "West cold retort study",
        "bounds": {
          "x0": 1,
          "x1": 6,
          "z0": 4,
          "z1": 14
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
        "name": "Rear secured mineral stock",
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
        "alpine trader front"
      ],
      [
        "sales-floor",
        "alchemy-workspace",
        "rockside cold-stand doorway"
      ],
      [
        "sales-floor",
        "storage",
        "northern mineral cabinet passage"
      ]
    ],
    "towers": [
      [
        2,
        16,
        4
      ],
      [
        3,
        16,
        4
      ],
      [
        20,
        17,
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
        3,
        6,
        6,
        12,
        6,
        "mountain-contained-workshop-vent"
      ],
      [
        12,
        20,
        17,
        18,
        3,
        "raised-alpine-herb-drying-ridge"
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
        8,
        17,
        4
      ]
    ],
    "facadeRecesses": [
      [
        4,
        8,
        21,
        "mountain-mineral-pickup"
      ],
      [
        15,
        19,
        21,
        "alpine-herb-arcade"
      ]
    ],
    "title": "Ironpine Alpine Apothecary",
    "roofForm": "high eastern alpine shop and separate high vented west study under steep gabled source roof",
    "signature": "large mountain apothecary with independent cold cauldron study, two long herbal galleries and deep mineral store",
    "frontPorticoes": [
      [
        9,
        16,
        2,
        "mountain-potion-shop-portico"
      ]
    ]
  },
  {
    "category": "bakery",
    "biome": "snow",
    "size": "large",
    "w": 24,
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
        11
      ]
    ],
    "partX": [
      [
        17,
        3,
        14,
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
        7,
        4,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        10,
        8,
        "pack5:087",
        "unpowered-display",
        "curio-arcade"
      ],
      [
        19,
        6,
        "pack5:090",
        "unlit-oven",
        "ashstone-bake-oven"
      ],
      [
        20,
        10,
        "pack5:091",
        "work-desk",
        "cartographers-oak-desk"
      ],
      [
        5,
        19,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Long cold-weather bread hall",
        "bounds": {
          "x0": 1,
          "x1": 16,
          "z0": 1,
          "z1": 14
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
        "name": "Separate eastern unlit ovenhouse",
        "bounds": {
          "x0": 18,
          "x1": 22,
          "z0": 3,
          "z1": 14
        },
        "uses": [
          "oven",
          "food-preparation"
        ],
        "access": [
          19,
          8
        ]
      },
      {
        "name": "Deep north flour granary",
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
          11,
          18
        ]
      }
    ],
    "routes": [
      [
        "exterior",
        "sales-floor",
        "winter baking vestibule"
      ],
      [
        "sales-floor",
        "oven",
        "east protected hearth threshold"
      ],
      [
        "oven",
        "food-preparation",
        "unheated workstation"
      ],
      [
        "sales-floor",
        "storage",
        "northern flour gallery"
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
        6
      ]
    ],
    "lamp": [
      11,
      9,
      3
    ],
    "roofMassing": [
      [
        5,
        10,
        6,
        14,
        5,
        "snow-bread-ventilated-loft"
      ],
      [
        18,
        20,
        5,
        9,
        7,
        "tall-unlit-bakehouse-chimney"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        7,
        17,
        6
      ],
      [
        "front",
        7,
        14,
        4
      ]
    ],
    "facadeRecesses": [
      [
        5,
        9,
        21,
        "snow-bread-collection-recess"
      ],
      [
        17,
        21,
        21,
        "covered-ovenhouse-service"
      ]
    ],
    "title": "Frostmarch Hearth Kitchens",
    "roofForm": "snowy double-pitched broad bread hall, landmark chimney and protected bread collection porches",
    "signature": "large snow bakery with east separated unlit bakehouse, broad retail warmlooking floor and rear dedicated flour gallery",
    "frontPorticoes": [
      [
        8,
        15,
        2,
        "snow-bakery-portico"
      ]
    ]
  },
  {
    "category": "bank",
    "biome": "temperate",
    "size": "medium",
    "w": 22,
    "d": 20,
    "h": 8,
    "entry": 11,
    "foundation": "pack1:001",
    "floor": "pack2:013",
    "wall": "pack2:013",
    "roof": "pack3:023",
    "partZ": [
      [
        13,
        11
      ]
    ],
    "partX": [
      [
        6,
        3,
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
        7
      ],
      [
        21,
        7
      ]
    ],
    "fixtures": [
      [
        12,
        4,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        15,
        6,
        "pack5:086",
        "merchant-counter",
        "ledger-service"
      ],
      [
        3,
        6,
        "pack5:091",
        "work-desk",
        "cartographers-oak-desk"
      ],
      [
        15,
        16,
        "pack5:093",
        "cold-relic",
        "sunspire-reliquary-plinth"
      ],
      [
        4,
        16,
        "pack4:057",
        "stock-crate",
        null
      ]
    ],
    "rooms": [
      {
        "name": "Willow public counter court",
        "bounds": {
          "x0": 7,
          "x1": 20,
          "z0": 1,
          "z1": 12
        },
        "uses": [
          "public-hall",
          "teller-service"
        ],
        "access": [
          12,
          7
        ]
      },
      {
        "name": "West quiet record room",
        "bounds": {
          "x0": 1,
          "x1": 5,
          "z0": 3,
          "z1": 12
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
        "name": "Rear protected treasury",
        "bounds": {
          "x0": 1,
          "x1": 20,
          "z0": 14,
          "z1": 18
        },
        "uses": [
          "vault"
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
        "public-hall",
        "willow town stone front"
      ],
      [
        "public-hall",
        "administrative-office",
        "west protected count-room door"
      ],
      [
        "public-hall",
        "vault",
        "double-leaf nonfunctional rear threshold"
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
        18,
        15,
        5
      ]
    ],
    "lamp": [
      11,
      8,
      3
    ],
    "roofMassing": [
      [
        8,
        14,
        4,
        9,
        4,
        "quiet-banking-clerestory"
      ],
      [
        12,
        17,
        15,
        17,
        5,
        "rear-guardian-masonry"
      ]
    ],
    "facadeGables": [
      [
        "rear",
        6,
        16,
        5
      ]
    ],
    "facadeRecesses": [
      [
        4,
        8,
        19,
        "ledger-deposit-alcove"
      ],
      [
        14,
        18,
        19,
        "secure-bank-courtyard-inset"
      ]
    ],
    "title": "Willowmarch Savings Court",
    "roofForm": "low temperate stone bank, central wooden clerestory and reinforced protected rear stone wall",
    "signature": "medium temperate bank with isolated west records, two real teller fixtures and two-cell secure rear reserve",
    "vaultDoor": [
      11,
      13
    ],
    "vaultDoorOrientation": "north",
    "vaultDoorVariant": "citadel-ironbound-leaves",
    "frontPorticoes": [
      [
        8,
        15,
        3,
        "temperate-bank-portico"
      ]
    ]
  }
]);
export const M1_CATEGORY_ARCADES=Object.freeze(M1_CATEGORY_ARCADES_PROFILES.map(assembleSpecialistProfile));
