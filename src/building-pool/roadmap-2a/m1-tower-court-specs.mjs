// Builder 2A: independent coordinate-authored irregular tower/courtyard specs, no live registration.
export const M1_TOWER_COURT_SPECS=Object.freeze([
  {
    "category": "general-store",
    "biome": "desert",
    "size": "medium",
    "variation": 4,
    "name": "Windward Caravan Switchback",
    "w": 48,
    "d": 42,
    "h": 11,
    "entry": 23,
    "wall": "pack5:079",
    "floor": "pack5:081",
    "roof": "pack5:080",
    "rects": [
      [
        9,
        37,
        0,
        14
      ],
      [
        1,
        16,
        12,
        39
      ],
      [
        32,
        47,
        13,
        33
      ],
      [
        10,
        42,
        35,
        41
      ],
      [
        12,
        37,
        26,
        34
      ]
    ],
    "cuts": [
      [
        18,
        28,
        18,
        25
      ],
      [
        19,
        29,
        36,
        40
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        7,
        26
      ],
      [
        39,
        22
      ],
      [
        13,
        38
      ]
    ],
    "fixtures": [
      [
        27,
        6,
        "pack5:086",
        "ledger-service",
        "caravan-counter"
      ],
      [
        8,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "route-ledger"
      ],
      [
        40,
        23,
        "pack5:087",
        "curio-arcade",
        "dry-goods-rack"
      ],
      [
        13,
        37,
        "pack4:057",
        null,
        "sealed-inventory"
      ]
    ],
    "roofs": [
      [
        [
          9,
          37,
          0,
          14
        ],
        "x",
        6,
        "front-caravan-vault",
        "gable"
      ],
      [
        [
          1,
          16,
          12,
          39
        ],
        "z",
        4,
        "long-west-coachhouse",
        "saw"
      ],
      [
        [
          32,
          47,
          13,
          33
        ],
        "z",
        3,
        "eastern-toll-awning",
        "terrace"
      ],
      [
        [
          10,
          42,
          35,
          41
        ],
        "x",
        3,
        "rear-bridge-market",
        "gable"
      ]
    ],
    "masses": [
      {
        "name": "angular-wind-catcher",
        "rect": [
          11,
          18,
          3,
          10
        ],
        "height": 20,
        "roof": "pitched",
        "window": true
      },
      {
        "name": "east-toll-spire",
        "rect": [
          35,
          41,
          19,
          26
        ],
        "height": 14,
        "roof": "crenel",
        "window": true
      }
    ]
  },
  {
    "category": "pet-shop",
    "biome": "snow",
    "size": "small",
    "variation": 4,
    "name": "Icepine Split-Stall Lodge",
    "w": 43,
    "d": 43,
    "h": 10,
    "entry": 21,
    "wall": "pack1:004",
    "floor": "pack2:013",
    "roof": "pack3:025",
    "rects": [
      [
        8,
        34,
        0,
        14
      ],
      [
        0,
        15,
        11,
        37
      ],
      [
        30,
        42,
        13,
        41
      ],
      [
        10,
        35,
        31,
        42
      ],
      [
        12,
        31,
        23,
        31
      ]
    ],
    "cuts": [
      [
        17,
        28,
        16,
        22
      ],
      [
        17,
        26,
        34,
        40
      ],
      [
        5,
        9,
        30,
        34
      ]
    ],
    "anchors": [
      [
        21,
        6
      ],
      [
        7,
        25
      ],
      [
        36,
        27
      ],
      [
        12,
        37
      ]
    ],
    "fixtures": [
      [
        25,
        6,
        "pack5:086",
        "ledger-service",
        "supply-counter"
      ],
      [
        8,
        23,
        "pack5:091",
        "cartographers-oak-desk",
        "empty-stall-ledger"
      ],
      [
        36,
        23,
        "pack5:087",
        "curio-arcade",
        "unoccupied-saddle-stand"
      ],
      [
        13,
        37,
        "pack4:057",
        null,
        "hay-crate"
      ]
    ],
    "roofs": [
      [
        [
          8,
          34,
          0,
          14
        ],
        "x",
        6,
        "snow-front-gable",
        "gable"
      ],
      [
        [
          0,
          15,
          11,
          37
        ],
        "z",
        4,
        "west-boarding-kennel",
        "terrace"
      ],
      [
        [
          30,
          42,
          13,
          41
        ],
        "z",
        4,
        "east-feed-gallery",
        "saw"
      ],
      [
        [
          10,
          35,
          31,
          42
        ],
        "x",
        4,
        "frost-rear-hall",
        "gable"
      ]
    ],
    "masses": [
      {
        "name": "west-vented-kennel-tower",
        "rect": [
          3,
          10,
          18,
          25
        ],
        "height": 14,
        "roof": "crown",
        "window": true
      },
      {
        "name": "east-sled-loft",
        "rect": [
          33,
          39,
          19,
          27
        ],
        "height": 18,
        "roof": "pitched",
        "window": true
      }
    ]
  },
  {
    "category": "magic-shop",
    "biome": "mountain",
    "size": "small",
    "variation": 3,
    "name": "Ridgeglass Ascendant Observatory",
    "w": 45,
    "d": 39,
    "h": 12,
    "entry": 22,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        8,
        36,
        0,
        16
      ],
      [
        0,
        17,
        12,
        38
      ],
      [
        28,
        44,
        14,
        34
      ],
      [
        12,
        37,
        32,
        38
      ],
      [
        12,
        33,
        22,
        30
      ]
    ],
    "cuts": [
      [
        18,
        27,
        18,
        25
      ],
      [
        19,
        27,
        34,
        37
      ]
    ],
    "anchors": [
      [
        22,
        7
      ],
      [
        8,
        27
      ],
      [
        37,
        24
      ],
      [
        13,
        35
      ]
    ],
    "fixtures": [
      [
        26,
        6,
        "pack5:086",
        "ledger-service",
        "front-relic-desk"
      ],
      [
        8,
        25,
        "pack5:091",
        "cartographers-oak-desk",
        "star-ledger"
      ],
      [
        38,
        22,
        "pack5:093",
        "sunspire-reliquary-plinth",
        "inert-relic-display"
      ],
      [
        11,
        35,
        "pack4:057",
        null,
        "sealed-star-archive"
      ]
    ],
    "roofs": [
      [
        [
          8,
          36,
          0,
          16
        ],
        "x",
        6,
        "granite-star-front",
        "gable"
      ],
      [
        [
          0,
          17,
          12,
          38
        ],
        "z",
        5,
        "west-archive-ridge",
        "saw"
      ],
      [
        [
          28,
          44,
          14,
          34
        ],
        "z",
        4,
        "east-overlook",
        "terrace"
      ],
      [
        [
          12,
          37,
          32,
          38
        ],
        "x",
        3,
        "rear-telescope-aisle",
        "gable"
      ]
    ],
    "masses": [
      {
        "name": "grand-observatory-keep",
        "rect": [
          18,
          27,
          2,
          12
        ],
        "height": 24,
        "roof": "dome",
        "window": true
      },
      {
        "name": "lower-astral-tower",
        "rect": [
          32,
          40,
          20,
          28
        ],
        "height": 15,
        "roof": "pitched",
        "window": true
      }
    ]
  },
  {
    "category": "potion-shop",
    "biome": "temperate",
    "size": "large",
    "variation": 3,
    "name": "Bellflower Cloister Herbarium",
    "w": 53,
    "d": 46,
    "h": 11,
    "entry": 25,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:023",
    "rects": [
      [
        12,
        40,
        0,
        15
      ],
      [
        0,
        18,
        12,
        38
      ],
      [
        36,
        52,
        14,
        42
      ],
      [
        10,
        44,
        36,
        45
      ],
      [
        15,
        39,
        25,
        34
      ]
    ],
    "cuts": [
      [
        20,
        33,
        17,
        24
      ],
      [
        22,
        32,
        38,
        43
      ]
    ],
    "anchors": [
      [
        25,
        7
      ],
      [
        7,
        28
      ],
      [
        44,
        26
      ],
      [
        14,
        40
      ]
    ],
    "fixtures": [
      [
        29,
        6,
        "pack5:086",
        "ledger-service",
        "apothecary-register"
      ],
      [
        7,
        26,
        "pack5:091",
        "cartographers-oak-desk",
        "herb-ledger"
      ],
      [
        43,
        27,
        "pack5:089",
        "alchemists-spiral-stand",
        "unlit-herb-still"
      ],
      [
        12,
        41,
        "pack4:057",
        null,
        "dry-leaf-crate"
      ]
    ],
    "roofs": [
      [
        [
          12,
          40,
          0,
          15
        ],
        "x",
        5,
        "garden-entrance",
        "gable"
      ],
      [
        [
          0,
          18,
          12,
          38
        ],
        "z",
        5,
        "west-medicinal-gallery",
        "saw"
      ],
      [
        [
          36,
          52,
          14,
          42
        ],
        "z",
        4,
        "eastern-herbarium",
        "terrace"
      ],
      [
        [
          10,
          44,
          36,
          45
        ],
        "x",
        4,
        "rear-stone-drying-wing",
        "gable"
      ]
    ],
    "masses": [
      {
        "name": "herbarium-bell-tower",
        "rect": [
          5,
          13,
          19,
          27
        ],
        "height": 21,
        "roof": "octagon",
        "window": true
      },
      {
        "name": "cloister-lantern",
        "rect": [
          21,
          30,
          3,
          12
        ],
        "height": 12,
        "roof": "dome",
        "window": false
      }
    ]
  },
  {
    "category": "bakery",
    "biome": "enchanted-forest",
    "size": "medium",
    "variation": 3,
    "name": "Moonfern Cathedral Bakeworks",
    "w": 48,
    "d": 47,
    "h": 12,
    "entry": 23,
    "wall": "pack5:079",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        8,
        39,
        0,
        15
      ],
      [
        0,
        18,
        13,
        42
      ],
      [
        32,
        47,
        12,
        39
      ],
      [
        11,
        38,
        36,
        46
      ],
      [
        14,
        34,
        25,
        35
      ]
    ],
    "cuts": [
      [
        18,
        30,
        17,
        24
      ],
      [
        20,
        29,
        38,
        44
      ]
    ],
    "anchors": [
      [
        23,
        6
      ],
      [
        7,
        27
      ],
      [
        40,
        26
      ],
      [
        12,
        41
      ]
    ],
    "fixtures": [
      [
        27,
        6,
        "pack5:086",
        "ledger-service",
        "bakers-counter"
      ],
      [
        7,
        25,
        "pack5:091",
        "cartographers-oak-desk",
        "flour-ledger"
      ],
      [
        39,
        24,
        "pack5:090",
        "ashstone-bake-oven",
        "cold-oven"
      ],
      [
        13,
        41,
        "pack4:057",
        null,
        "flour-store"
      ]
    ],
    "roofs": [
      [
        [
          8,
          39,
          0,
          15
        ],
        "x",
        6,
        "cathedral-market-nave",
        "gable"
      ],
      [
        [
          0,
          18,
          13,
          42
        ],
        "z",
        3,
        "west-bread-cart-gallery",
        "terrace"
      ],
      [
        [
          32,
          47,
          12,
          39
        ],
        "z",
        5,
        "east-high-bake-kiln",
        "saw"
      ],
      [
        [
          11,
          38,
          36,
          46
        ],
        "x",
        3,
        "rear-cooling-crossing",
        "gable"
      ]
    ],
    "masses": [
      {
        "name": "tall-ashstone-kiln",
        "rect": [
          37,
          43,
          20,
          27
        ],
        "height": 23,
        "roof": "crown",
        "window": false
      },
      {
        "name": "market-bellhouse",
        "rect": [
          17,
          26,
          2,
          11
        ],
        "height": 15,
        "roof": "pitched",
        "window": true
      }
    ]
  },
  {
    "category": "bank",
    "biome": "mountain",
    "size": "medium",
    "variation": 2,
    "name": "Ironwake Bastion Bondhouse",
    "w": 48,
    "d": 44,
    "h": 13,
    "entry": 22,
    "wall": "pack1:005",
    "floor": "pack2:013",
    "roof": "pack3:026",
    "rects": [
      [
        9,
        38,
        0,
        16
      ],
      [
        0,
        18,
        13,
        42
      ],
      [
        31,
        47,
        12,
        43
      ],
      [
        14,
        37,
        34,
        43
      ],
      [
        14,
        37,
        24,
        32
      ]
    ],
    "cuts": [
      [
        19,
        30,
        18,
        23
      ],
      [
        21,
        30,
        37,
        41
      ]
    ],
    "anchors": [
      [
        22,
        7
      ],
      [
        8,
        26
      ],
      [
        40,
        28
      ],
      [
        16,
        39
      ]
    ],
    "fixtures": [
      [
        27,
        6,
        "pack5:086",
        "ledger-service",
        "public-teller"
      ],
      [
        8,
        24,
        "pack5:091",
        "cartographers-oak-desk",
        "bond-ledger"
      ],
      [
        39,
        19,
        "pack5:086",
        "ledger-service",
        "second-teller"
      ],
      [
        16,
        38,
        "pack4:057",
        null,
        "sealed-deeds"
      ]
    ],
    "roofs": [
      [
        [
          9,
          38,
          0,
          16
        ],
        "x",
        7,
        "front-bondhall",
        "gable"
      ],
      [
        [
          0,
          18,
          13,
          42
        ],
        "z",
        4,
        "west-bond-chambers",
        "saw"
      ],
      [
        [
          31,
          47,
          12,
          43
        ],
        "z",
        7,
        "vault-wing",
        "tower"
      ],
      [
        [
          14,
          37,
          34,
          43
        ],
        "x",
        3,
        "audit-terrace",
        "terrace"
      ]
    ],
    "masses": [
      {
        "name": "copperwatch-front-keep",
        "rect": [
          12,
          20,
          3,
          11
        ],
        "height": 21,
        "roof": "crenel",
        "window": true
      },
      {
        "name": "secured-vault-bastion",
        "rect": [
          34,
          44,
          15,
          22
        ],
        "height": 24,
        "roof": "octagon",
        "window": true
      }
    ],
    "vault": [
      37,
      45,
      24,
      33,
      27,
      28
    ]
  }
]);
