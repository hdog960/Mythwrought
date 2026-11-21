// Builder 1A M3 hospitality wave3: nine coordinate-frozen original 3D tavern/inn building candidates.
// Explicit per-building rooms, portals, partitions, full exterior voids, supported differentiated roof wings and Pack1–5 fixtures.
// Candidate-only; no gameplay registration, integration, world placement or saves.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "large",
    "index": 4,
    "title": "Mossfield Orchard Feast Barn",
    "w": 60,
    "d": 55,
    "plan": "mossfield-orchard-feast-barn-lw-independent-regional-massing",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        27,
        18,
        54
      ],
      [
        55,
        44,
        59,
        54
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        25
      ],
      [
        39,
        2,
        39,
        25
      ],
      [
        20,
        26,
        57,
        26
      ],
      [
        20,
        42,
        57,
        42
      ]
    ],
    "entry": [
      22,
      1,
      "great-mead-taproom"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "great-mead-taproom",
        "to": "rear-kitchen"
      },
      {
        "at": [
          39,
          1,
          7
        ],
        "from": "great-mead-taproom",
        "to": "music-aisle"
      },
      {
        "at": [
          52,
          1,
          26
        ],
        "from": "music-aisle",
        "to": "brewing-utility-hall"
      },
      {
        "at": [
          52,
          1,
          42
        ],
        "from": "brewing-utility-hall",
        "to": "staff-night-room"
      }
    ],
    "rooms": [
      {
        "id": "rear-kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          26
        ]
      },
      {
        "id": "great-mead-taproom",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          39,
          4,
          26
        ]
      },
      {
        "id": "music-aisle",
        "min": [
          40,
          1,
          2
        ],
        "max": [
          58,
          4,
          26
        ]
      },
      {
        "id": "brewing-utility-hall",
        "min": [
          20,
          1,
          27
        ],
        "max": [
          58,
          4,
          42
        ]
      },
      {
        "id": "staff-night-room",
        "min": [
          20,
          1,
          43
        ],
        "max": [
          58,
          4,
          54
        ]
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        56,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        58,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "rear-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 23,
        "z": 5,
        "room": "great-mead-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 53,
        "z": 5,
        "room": "music-aisle",
        "asset": "pack4:059"
      },
      {
        "x": 24,
        "z": 30,
        "room": "brewing-utility-hall",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 44,
        "room": "staff-night-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-cross-town-eaves",
        "rect": [
          0,
          0,
          59,
          26
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "rear-terraced-service-wing",
        "rect": [
          19,
          27,
          59,
          54
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      55
    ],
    "detail": "Original temperate tavern original full source coordinate physical 3D plan and connected lodging/public space"
  },
  {
    "category": "tavern",
    "biome": "desert",
    "size": "small",
    "index": 3,
    "title": "Copper Sun Sundial Tavern",
    "w": 38,
    "d": 35,
    "plan": "copper-sun-sundial-tavern-u-independent-regional-massing",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        13,
        19,
        25,
        34
      ],
      [
        32,
        10,
        37,
        17
      ]
    ],
    "segments": [
      [
        13,
        2,
        13,
        17
      ],
      [
        2,
        18,
        11,
        18
      ],
      [
        27,
        18,
        35,
        18
      ],
      [
        2,
        28,
        11,
        28
      ],
      [
        27,
        29,
        35,
        29
      ]
    ],
    "entry": [
      17,
      1,
      "common-taproom"
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          6
        ],
        "from": "common-taproom",
        "to": "wine-store"
      },
      {
        "at": [
          7,
          1,
          18
        ],
        "from": "wine-store",
        "to": "western-brewery"
      },
      {
        "at": [
          7,
          1,
          28
        ],
        "from": "western-brewery",
        "to": "western-staff-bunk"
      },
      {
        "at": [
          30,
          1,
          18
        ],
        "from": "common-taproom",
        "to": "eastern-stage"
      },
      {
        "at": [
          30,
          1,
          29
        ],
        "from": "eastern-stage",
        "to": "eastern-private-nook"
      }
    ],
    "rooms": [
      {
        "id": "wine-store",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          13,
          4,
          18
        ]
      },
      {
        "id": "common-taproom",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          36,
          4,
          18
        ]
      },
      {
        "id": "western-brewery",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          12,
          4,
          28
        ]
      },
      {
        "id": "western-staff-bunk",
        "min": [
          2,
          1,
          29
        ],
        "max": [
          12,
          4,
          34
        ]
      },
      {
        "id": "eastern-stage",
        "min": [
          27,
          1,
          19
        ],
        "max": [
          36,
          4,
          29
        ]
      },
      {
        "id": "eastern-private-nook",
        "min": [
          27,
          1,
          30
        ],
        "max": [
          36,
          4,
          34
        ]
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        34,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        36,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "wine-store",
        "asset": "pack5:084"
      },
      {
        "x": 17,
        "z": 5,
        "room": "common-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 22,
        "room": "western-brewery",
        "asset": "pack4:057"
      },
      {
        "x": 7,
        "z": 30,
        "room": "western-staff-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 30,
        "z": 22,
        "room": "eastern-stage",
        "asset": "pack4:059"
      },
      {
        "x": 30,
        "z": 31,
        "room": "eastern-private-nook",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "front-long-hall",
        "rect": [
          0,
          0,
          37,
          18
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "western-court-return",
        "rect": [
          0,
          19,
          12,
          34
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "eastern-court-return",
        "rect": [
          26,
          19,
          37,
          34
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      4,
      33
    ],
    "detail": "Original desert tavern original full source coordinate physical 3D plan and connected lodging/public space"
  },
  {
    "category": "tavern",
    "biome": "snow",
    "size": "large",
    "index": 5,
    "title": "Glacierhollow Firewatch Banquet",
    "w": 60,
    "d": 56,
    "plan": "glacierhollow-firewatch-banquet-t-independent-regional-massing",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        25,
        18,
        55
      ],
      [
        44,
        25,
        59,
        55
      ],
      [
        0,
        8,
        9,
        23
      ]
    ],
    "segments": [
      [
        20,
        2,
        20,
        23
      ],
      [
        42,
        2,
        42,
        23
      ],
      [
        20,
        24,
        42,
        24
      ],
      [
        20,
        45,
        42,
        45
      ]
    ],
    "entry": [
      31,
      1,
      "tasting-hall"
    ],
    "doors": [
      {
        "at": [
          20,
          1,
          6
        ],
        "from": "tasting-hall",
        "to": "west-public-seating"
      },
      {
        "at": [
          42,
          1,
          7
        ],
        "from": "tasting-hall",
        "to": "cooking-hearth"
      },
      {
        "at": [
          31,
          1,
          24
        ],
        "from": "tasting-hall",
        "to": "cask-aisle"
      },
      {
        "at": [
          31,
          1,
          45
        ],
        "from": "cask-aisle",
        "to": "staff-sleep"
      }
    ],
    "rooms": [
      {
        "id": "west-public-seating",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          20,
          4,
          24
        ]
      },
      {
        "id": "tasting-hall",
        "min": [
          21,
          1,
          2
        ],
        "max": [
          42,
          4,
          24
        ]
      },
      {
        "id": "cooking-hearth",
        "min": [
          43,
          1,
          2
        ],
        "max": [
          58,
          4,
          24
        ]
      },
      {
        "id": "cask-aisle",
        "min": [
          20,
          1,
          25
        ],
        "max": [
          43,
          4,
          45
        ]
      },
      {
        "id": "staff-sleep",
        "min": [
          20,
          1,
          46
        ],
        "max": [
          43,
          4,
          55
        ]
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        56,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        58,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-public-seating",
        "asset": "pack4:058"
      },
      {
        "x": 31,
        "z": 5,
        "room": "tasting-hall",
        "asset": "pack4:064"
      },
      {
        "x": 54,
        "z": 5,
        "room": "cooking-hearth",
        "asset": "pack4:057"
      },
      {
        "x": 29,
        "z": 28,
        "room": "cask-aisle",
        "asset": "pack5:084"
      },
      {
        "x": 29,
        "z": 47,
        "room": "staff-sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-thick-eave",
        "rect": [
          0,
          0,
          20,
          24
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "raised-eastern-gable",
        "rect": [
          21,
          0,
          59,
          24
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "high-rear-spine",
        "rect": [
          19,
          25,
          43,
          55
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      4,
      55
    ],
    "detail": "Original snow tavern original full source coordinate physical 3D plan and connected lodging/public space"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "medium",
    "index": 4,
    "title": "Cloudbreak Switchback Tavern",
    "w": 50,
    "d": 47,
    "plan": "cloudbreak-switchback-tavern-t-independent-regional-massing",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        22,
        18,
        46
      ],
      [
        36,
        22,
        49,
        46
      ],
      [
        0,
        11,
        7,
        20
      ]
    ],
    "segments": [
      [
        20,
        2,
        20,
        20
      ],
      [
        34,
        2,
        34,
        20
      ],
      [
        20,
        21,
        34,
        21
      ],
      [
        20,
        39,
        34,
        39
      ]
    ],
    "entry": [
      27,
      1,
      "tasting-hall"
    ],
    "doors": [
      {
        "at": [
          20,
          1,
          6
        ],
        "from": "tasting-hall",
        "to": "west-public-seating"
      },
      {
        "at": [
          34,
          1,
          7
        ],
        "from": "tasting-hall",
        "to": "cooking-hearth"
      },
      {
        "at": [
          27,
          1,
          21
        ],
        "from": "tasting-hall",
        "to": "cask-aisle"
      },
      {
        "at": [
          27,
          1,
          39
        ],
        "from": "cask-aisle",
        "to": "staff-sleep"
      }
    ],
    "rooms": [
      {
        "id": "west-public-seating",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          20,
          4,
          21
        ]
      },
      {
        "id": "tasting-hall",
        "min": [
          21,
          1,
          2
        ],
        "max": [
          34,
          4,
          21
        ]
      },
      {
        "id": "cooking-hearth",
        "min": [
          35,
          1,
          2
        ],
        "max": [
          48,
          4,
          21
        ]
      },
      {
        "id": "cask-aisle",
        "min": [
          20,
          1,
          22
        ],
        "max": [
          35,
          4,
          39
        ]
      },
      {
        "id": "staff-sleep",
        "min": [
          20,
          1,
          40
        ],
        "max": [
          35,
          4,
          46
        ]
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        46,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        48,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-public-seating",
        "asset": "pack4:058"
      },
      {
        "x": 27,
        "z": 5,
        "room": "tasting-hall",
        "asset": "pack4:064"
      },
      {
        "x": 44,
        "z": 5,
        "room": "cooking-hearth",
        "asset": "pack4:057"
      },
      {
        "x": 25,
        "z": 25,
        "room": "cask-aisle",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 41,
        "room": "staff-sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-thick-eave",
        "rect": [
          0,
          0,
          20,
          21
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "raised-eastern-gable",
        "rect": [
          21,
          0,
          49,
          21
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "high-rear-spine",
        "rect": [
          19,
          22,
          35,
          46
        ],
        "style": "long-gable",
        "raise": 1
      }
    ],
    "posts": [
      4,
      45
    ],
    "detail": "Original mountain tavern original full source coordinate physical 3D plan and connected lodging/public space"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "large",
    "index": 2,
    "title": "Rosewind Orchard Courtyard Inn",
    "w": 61,
    "d": 57,
    "plan": "rosewind-orchard-courtyard-inn-le-independent-regional-massing",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        44,
        27,
        60,
        56
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        25
      ],
      [
        41,
        2,
        41,
        25
      ],
      [
        2,
        26,
        42,
        26
      ],
      [
        2,
        46,
        42,
        46
      ]
    ],
    "entry": [
      22,
      1,
      "arrival-reception"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "arrival-reception",
        "to": "western-guest-nook"
      },
      {
        "at": [
          41,
          1,
          7
        ],
        "from": "arrival-reception",
        "to": "eastern-guest-suite"
      },
      {
        "at": [
          8,
          1,
          26
        ],
        "from": "western-guest-nook",
        "to": "shared-linen-gallery"
      },
      {
        "at": [
          8,
          1,
          46
        ],
        "from": "shared-linen-gallery",
        "to": "family-sleeping-hall"
      }
    ],
    "rooms": [
      {
        "id": "western-guest-nook",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          26
        ]
      },
      {
        "id": "arrival-reception",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          41,
          4,
          26
        ]
      },
      {
        "id": "eastern-guest-suite",
        "min": [
          42,
          1,
          2
        ],
        "max": [
          59,
          4,
          26
        ]
      },
      {
        "id": "shared-linen-gallery",
        "min": [
          2,
          1,
          27
        ],
        "max": [
          43,
          4,
          46
        ]
      },
      {
        "id": "family-sleeping-hall",
        "min": [
          2,
          1,
          47
        ],
        "max": [
          43,
          4,
          56
        ]
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        57,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        59,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-guest-nook",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "arrival-reception",
        "asset": "pack4:064"
      },
      {
        "x": 54,
        "z": 5,
        "room": "eastern-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 30,
        "room": "shared-linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 48,
        "room": "family-sleeping-hall",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-cross-town-eaves",
        "rect": [
          0,
          0,
          60,
          26
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "rear-terraced-service-wing",
        "rect": [
          0,
          27,
          43,
          56
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      56
    ],
    "detail": "Original temperate inn original full source coordinate physical 3D plan and connected lodging/public space"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "large",
    "index": 2,
    "title": "Amberglass Starfall Caravan Inn",
    "w": 61,
    "d": 56,
    "plan": "amberglass-starfall-caravan-inn-lw-independent-regional-massing",
    "roof": "hip",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        26,
        22,
        55
      ],
      [
        51,
        49,
        60,
        55
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        24
      ],
      [
        42,
        2,
        42,
        24
      ],
      [
        24,
        25,
        58,
        25
      ],
      [
        24,
        46,
        58,
        46
      ]
    ],
    "entry": [
      21,
      1,
      "arrival-reception"
    ],
    "doors": [
      {
        "at": [
          17,
          1,
          6
        ],
        "from": "arrival-reception",
        "to": "western-guest-nook"
      },
      {
        "at": [
          42,
          1,
          7
        ],
        "from": "arrival-reception",
        "to": "eastern-guest-suite"
      },
      {
        "at": [
          53,
          1,
          25
        ],
        "from": "eastern-guest-suite",
        "to": "shared-linen-gallery"
      },
      {
        "at": [
          53,
          1,
          46
        ],
        "from": "shared-linen-gallery",
        "to": "family-sleeping-hall"
      }
    ],
    "rooms": [
      {
        "id": "western-guest-nook",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          25
        ]
      },
      {
        "id": "arrival-reception",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          42,
          4,
          25
        ]
      },
      {
        "id": "eastern-guest-suite",
        "min": [
          43,
          1,
          2
        ],
        "max": [
          59,
          4,
          25
        ]
      },
      {
        "id": "shared-linen-gallery",
        "min": [
          24,
          1,
          26
        ],
        "max": [
          59,
          4,
          46
        ]
      },
      {
        "id": "family-sleeping-hall",
        "min": [
          24,
          1,
          47
        ],
        "max": [
          59,
          4,
          55
        ]
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        57,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        59,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-guest-nook",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 22,
        "z": 5,
        "room": "arrival-reception",
        "asset": "pack4:064"
      },
      {
        "x": 54,
        "z": 5,
        "room": "eastern-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 29,
        "room": "shared-linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 28,
        "z": 48,
        "room": "family-sleeping-hall",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-cross-town-eaves",
        "rect": [
          0,
          0,
          60,
          25
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "rear-terraced-service-wing",
        "rect": [
          23,
          26,
          60,
          55
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      56
    ],
    "detail": "Original desert inn original full source coordinate physical 3D plan and connected lodging/public space"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "small",
    "index": 3,
    "title": "Frostbirch Sled Trail Bunkhouse",
    "w": 40,
    "d": 38,
    "plan": "frostbirch-sled-trail-bunkhouse-le-independent-regional-massing",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        27,
        18,
        39,
        37
      ],
      [
        0,
        35,
        8,
        37
      ]
    ],
    "segments": [
      [
        12,
        2,
        12,
        16
      ],
      [
        29,
        2,
        29,
        16
      ],
      [
        2,
        17,
        25,
        17
      ],
      [
        2,
        30,
        25,
        30
      ]
    ],
    "entry": [
      16,
      1,
      "arrival-reception"
    ],
    "doors": [
      {
        "at": [
          12,
          1,
          6
        ],
        "from": "arrival-reception",
        "to": "western-guest-nook"
      },
      {
        "at": [
          29,
          1,
          7
        ],
        "from": "arrival-reception",
        "to": "eastern-guest-suite"
      },
      {
        "at": [
          8,
          1,
          17
        ],
        "from": "western-guest-nook",
        "to": "shared-linen-gallery"
      },
      {
        "at": [
          8,
          1,
          30
        ],
        "from": "shared-linen-gallery",
        "to": "family-sleeping-hall"
      }
    ],
    "rooms": [
      {
        "id": "western-guest-nook",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          12,
          4,
          17
        ]
      },
      {
        "id": "arrival-reception",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          29,
          4,
          17
        ]
      },
      {
        "id": "eastern-guest-suite",
        "min": [
          30,
          1,
          2
        ],
        "max": [
          38,
          4,
          17
        ]
      },
      {
        "id": "shared-linen-gallery",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          26,
          4,
          30
        ]
      },
      {
        "id": "family-sleeping-hall",
        "min": [
          2,
          1,
          31
        ],
        "max": [
          26,
          4,
          37
        ]
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        36,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        38,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-guest-nook",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 17,
        "z": 5,
        "room": "arrival-reception",
        "asset": "pack4:064"
      },
      {
        "x": 33,
        "z": 5,
        "room": "eastern-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 21,
        "room": "shared-linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 32,
        "room": "family-sleeping-hall",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-cross-town-eaves",
        "rect": [
          0,
          0,
          39,
          17
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "rear-terraced-service-wing",
        "rect": [
          0,
          18,
          26,
          37
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      35
    ],
    "detail": "Original snow inn original full source coordinate physical 3D plan and connected lodging/public space"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 2,
    "title": "Moonfern Woven Lantern Inn",
    "w": 52,
    "d": 48,
    "plan": "moonfern-woven-lantern-inn-t-independent-regional-massing",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        24,
        16,
        47
      ],
      [
        38,
        24,
        51,
        47
      ],
      [
        43,
        9,
        51,
        22
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        22
      ],
      [
        36,
        2,
        36,
        22
      ],
      [
        18,
        23,
        36,
        23
      ],
      [
        18,
        41,
        36,
        41
      ]
    ],
    "entry": [
      27,
      1,
      "traveler-lobby"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "traveler-lobby",
        "to": "west-suite"
      },
      {
        "at": [
          36,
          1,
          7
        ],
        "from": "traveler-lobby",
        "to": "east-suite"
      },
      {
        "at": [
          27,
          1,
          23
        ],
        "from": "traveler-lobby",
        "to": "linen-corridor"
      },
      {
        "at": [
          27,
          1,
          41
        ],
        "from": "linen-corridor",
        "to": "terrace-guest-room"
      }
    ],
    "rooms": [
      {
        "id": "west-suite",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          23
        ]
      },
      {
        "id": "traveler-lobby",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          36,
          4,
          23
        ]
      },
      {
        "id": "east-suite",
        "min": [
          37,
          1,
          2
        ],
        "max": [
          50,
          4,
          23
        ]
      },
      {
        "id": "linen-corridor",
        "min": [
          18,
          1,
          24
        ],
        "max": [
          37,
          4,
          41
        ]
      },
      {
        "id": "terrace-guest-room",
        "min": [
          18,
          1,
          42
        ],
        "max": [
          37,
          4,
          47
        ]
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        48,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        50,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 27,
        "z": 5,
        "room": "traveler-lobby",
        "asset": "pack4:064"
      },
      {
        "x": 45,
        "z": 5,
        "room": "east-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 25,
        "z": 27,
        "room": "linen-corridor",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 43,
        "room": "terrace-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-thick-eave",
        "rect": [
          0,
          0,
          18,
          23
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "raised-eastern-gable",
        "rect": [
          19,
          0,
          51,
          23
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "high-rear-spine",
        "rect": [
          17,
          24,
          37,
          47
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      47
    ],
    "detail": "Original enchanted-forest inn original full source coordinate physical 3D plan and connected lodging/public space"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 3,
    "title": "Elderstar Starlace Sanctuary Inn",
    "w": 62,
    "d": 58,
    "plan": "elderstar-starlace-sanctuary-inn-lw-independent-regional-massing",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        26,
        19,
        57
      ],
      [
        56,
        47,
        61,
        57
      ]
    ],
    "segments": [
      [
        19,
        2,
        19,
        24
      ],
      [
        43,
        2,
        43,
        24
      ],
      [
        21,
        25,
        59,
        25
      ],
      [
        21,
        45,
        59,
        45
      ]
    ],
    "entry": [
      23,
      1,
      "arrival-reception"
    ],
    "doors": [
      {
        "at": [
          19,
          1,
          6
        ],
        "from": "arrival-reception",
        "to": "western-guest-nook"
      },
      {
        "at": [
          43,
          1,
          7
        ],
        "from": "arrival-reception",
        "to": "eastern-guest-suite"
      },
      {
        "at": [
          54,
          1,
          25
        ],
        "from": "eastern-guest-suite",
        "to": "shared-linen-gallery"
      },
      {
        "at": [
          54,
          1,
          45
        ],
        "from": "shared-linen-gallery",
        "to": "family-sleeping-hall"
      }
    ],
    "rooms": [
      {
        "id": "western-guest-nook",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          19,
          4,
          25
        ]
      },
      {
        "id": "arrival-reception",
        "min": [
          20,
          1,
          2
        ],
        "max": [
          43,
          4,
          25
        ]
      },
      {
        "id": "eastern-guest-suite",
        "min": [
          44,
          1,
          2
        ],
        "max": [
          60,
          4,
          25
        ]
      },
      {
        "id": "shared-linen-gallery",
        "min": [
          21,
          1,
          26
        ],
        "max": [
          60,
          4,
          45
        ]
      },
      {
        "id": "family-sleeping-hall",
        "min": [
          21,
          1,
          46
        ],
        "max": [
          60,
          4,
          57
        ]
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        58,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        60,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-guest-nook",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 5,
        "room": "arrival-reception",
        "asset": "pack4:064"
      },
      {
        "x": 55,
        "z": 5,
        "room": "eastern-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 25,
        "z": 29,
        "room": "shared-linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 47,
        "room": "family-sleeping-hall",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-cross-town-eaves",
        "rect": [
          0,
          0,
          61,
          25
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "rear-terraced-service-wing",
        "rect": [
          20,
          26,
          61,
          57
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      57
    ],
    "detail": "Original enchanted-forest inn original full source coordinate physical 3D plan and connected lodging/public space"
  }
]);
export const HOSPITALITY_WAVE3_IDS=Object.freeze(SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getHospitalityWave3(){return SPECS.map(compileM2ArchitecturalSpec);}
