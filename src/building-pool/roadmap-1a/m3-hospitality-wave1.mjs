// Builder 1A: 20 original coordinate-authored tavern/inn candidates, ten of each across all five biomes.
// Literal source coordinates for real exterior voids, partitions, rooms, portal routes, backed roofs and Pack 1-5 fixtures.
// Candidate-only; no live runtime, world placement, save updates or game integration.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "small",
    "index": 3,
    "title": "Briarbridge Hearth & Cider Tavern",
    "w": 32,
    "d": 30,
    "plan": "briarbridge-hearth-cider-tavern-u-distinct-floorplan",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        11,
        16,
        21,
        29
      ],
      [
        0,
        9,
        5,
        14
      ]
    ],
    "segments": [
      [
        13,
        2,
        13,
        14
      ],
      [
        2,
        15,
        9,
        15
      ],
      [
        23,
        15,
        29,
        15
      ],
      [
        2,
        22,
        9,
        22
      ],
      [
        23,
        23,
        29,
        23
      ]
    ],
    "entry": [
      17,
      1,
      "common-taproom"
    ],
    "rooms": [
      {
        "id": "brewery-workroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          13,
          4,
          15
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
          30,
          4,
          15
        ]
      },
      {
        "id": "hearth-kitchen",
        "min": [
          2,
          1,
          16
        ],
        "max": [
          10,
          4,
          22
        ]
      },
      {
        "id": "staff-bedroom",
        "min": [
          2,
          1,
          23
        ],
        "max": [
          10,
          4,
          29
        ]
      },
      {
        "id": "performance-nook",
        "min": [
          23,
          1,
          16
        ],
        "max": [
          30,
          4,
          23
        ]
      },
      {
        "id": "private-booth",
        "min": [
          23,
          1,
          24
        ],
        "max": [
          30,
          4,
          29
        ]
      }
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          6
        ],
        "from": "common-taproom",
        "to": "brewery-workroom"
      },
      {
        "at": [
          7,
          1,
          15
        ],
        "from": "brewery-workroom",
        "to": "hearth-kitchen"
      },
      {
        "at": [
          7,
          1,
          22
        ],
        "from": "hearth-kitchen",
        "to": "staff-bedroom"
      },
      {
        "at": [
          24,
          1,
          15
        ],
        "from": "common-taproom",
        "to": "performance-nook"
      },
      {
        "at": [
          24,
          1,
          23
        ],
        "from": "performance-nook",
        "to": "private-booth"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        28,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        30,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "brewery-workroom",
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
        "z": 19,
        "room": "hearth-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 7,
        "z": 24,
        "room": "staff-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 19,
        "room": "performance-nook",
        "asset": "pack4:059"
      },
      {
        "x": 24,
        "z": 25,
        "room": "private-booth",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "front-communal-gable",
        "rect": [
          0,
          0,
          31,
          15
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "left-guest-wing",
        "rect": [
          0,
          16,
          10,
          29
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "right-guest-wing",
        "rect": [
          22,
          16,
          31,
          29
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      27
    ],
    "detail": "original tavern functional U bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "medium",
    "index": 3,
    "title": "Mistford Canalside Ale Hall",
    "w": 40,
    "d": 37,
    "plan": "mistford-canalside-ale-hall-lw-distinct-floorplan",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        18,
        16,
        36
      ],
      [
        31,
        29,
        39,
        36
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        16
      ],
      [
        27,
        2,
        27,
        16
      ],
      [
        18,
        17,
        37,
        17
      ],
      [
        18,
        26,
        37,
        26
      ]
    ],
    "entry": [
      18,
      1,
      "public-feasting-hall"
    ],
    "rooms": [
      {
        "id": "scullery-kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          14,
          4,
          17
        ]
      },
      {
        "id": "public-feasting-hall",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          27,
          4,
          17
        ]
      },
      {
        "id": "performance-aisle",
        "min": [
          28,
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
        "id": "cask-service-gallery",
        "min": [
          18,
          1,
          18
        ],
        "max": [
          38,
          4,
          26
        ]
      },
      {
        "id": "staff-bunk-room",
        "min": [
          18,
          1,
          27
        ],
        "max": [
          38,
          4,
          36
        ]
      }
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          6
        ],
        "from": "public-feasting-hall",
        "to": "scullery-kitchen"
      },
      {
        "at": [
          27,
          1,
          7
        ],
        "from": "public-feasting-hall",
        "to": "performance-aisle"
      },
      {
        "at": [
          32,
          1,
          17
        ],
        "from": "performance-aisle",
        "to": "cask-service-gallery"
      },
      {
        "at": [
          32,
          1,
          26
        ],
        "from": "cask-service-gallery",
        "to": "staff-bunk-room"
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
        "room": "scullery-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 19,
        "z": 5,
        "room": "public-feasting-hall",
        "asset": "pack4:064"
      },
      {
        "x": 33,
        "z": 5,
        "room": "performance-aisle",
        "asset": "pack4:059"
      },
      {
        "x": 22,
        "z": 21,
        "room": "cask-service-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 28,
        "room": "staff-bunk-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-tavern-roof",
        "rect": [
          0,
          0,
          39,
          17
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "east-return-lodging-roof",
        "rect": [
          17,
          18,
          39,
          36
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      35
    ],
    "detail": "original tavern functional LW bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "desert",
    "size": "small",
    "index": 2,
    "title": "Copper Dune Shaded Tea House",
    "w": 33,
    "d": 31,
    "plan": "copper-dune-shaded-tea-house-le-distinct-floorplan",
    "roof": "sawtooth",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        24,
        17,
        32,
        30
      ],
      [
        0,
        29,
        9,
        30
      ]
    ],
    "segments": [
      [
        12,
        2,
        12,
        15
      ],
      [
        24,
        2,
        24,
        15
      ],
      [
        2,
        16,
        22,
        16
      ],
      [
        2,
        24,
        22,
        24
      ]
    ],
    "entry": [
      16,
      1,
      "public-feasting-hall"
    ],
    "rooms": [
      {
        "id": "scullery-kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          12,
          4,
          16
        ]
      },
      {
        "id": "public-feasting-hall",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          24,
          4,
          16
        ]
      },
      {
        "id": "performance-aisle",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          31,
          4,
          16
        ]
      },
      {
        "id": "cask-service-gallery",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          23,
          4,
          24
        ]
      },
      {
        "id": "staff-bunk-room",
        "min": [
          2,
          1,
          25
        ],
        "max": [
          23,
          4,
          30
        ]
      }
    ],
    "doors": [
      {
        "at": [
          12,
          1,
          6
        ],
        "from": "public-feasting-hall",
        "to": "scullery-kitchen"
      },
      {
        "at": [
          24,
          1,
          7
        ],
        "from": "public-feasting-hall",
        "to": "performance-aisle"
      },
      {
        "at": [
          8,
          1,
          16
        ],
        "from": "scullery-kitchen",
        "to": "cask-service-gallery"
      },
      {
        "at": [
          8,
          1,
          24
        ],
        "from": "cask-service-gallery",
        "to": "staff-bunk-room"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        29,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        31,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "scullery-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 17,
        "z": 5,
        "room": "public-feasting-hall",
        "asset": "pack4:064"
      },
      {
        "x": 26,
        "z": 5,
        "room": "performance-aisle",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 20,
        "room": "cask-service-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 26,
        "room": "staff-bunk-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-tavern-roof",
        "rect": [
          0,
          0,
          32,
          16
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "west-return-lodging-roof",
        "rect": [
          0,
          17,
          23,
          30
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      28
    ],
    "detail": "original tavern functional LE bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "desert",
    "size": "large",
    "index": 4,
    "title": "Sunhammer Caravan Brewers Hall",
    "w": 51,
    "d": 45,
    "plan": "sunhammer-caravan-brewers-hall-t-distinct-floorplan",
    "roof": "steep",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        21,
        18,
        44
      ],
      [
        35,
        21,
        50,
        44
      ],
      [
        0,
        9,
        4,
        19
      ]
    ],
    "segments": [
      [
        20,
        2,
        20,
        19
      ],
      [
        33,
        2,
        33,
        19
      ],
      [
        20,
        20,
        33,
        20
      ],
      [
        20,
        35,
        33,
        35
      ]
    ],
    "entry": [
      26,
      1,
      "public-taproom"
    ],
    "rooms": [
      {
        "id": "corner-seating",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          20,
          4,
          20
        ]
      },
      {
        "id": "public-taproom",
        "min": [
          21,
          1,
          2
        ],
        "max": [
          33,
          4,
          20
        ]
      },
      {
        "id": "hearth-kitchen",
        "min": [
          34,
          1,
          2
        ],
        "max": [
          49,
          4,
          20
        ]
      },
      {
        "id": "brewers-gallery",
        "min": [
          20,
          1,
          21
        ],
        "max": [
          34,
          4,
          35
        ]
      },
      {
        "id": "staff-bedroom",
        "min": [
          20,
          1,
          36
        ],
        "max": [
          34,
          4,
          44
        ]
      }
    ],
    "doors": [
      {
        "at": [
          20,
          1,
          6
        ],
        "from": "public-taproom",
        "to": "corner-seating"
      },
      {
        "at": [
          33,
          1,
          7
        ],
        "from": "public-taproom",
        "to": "hearth-kitchen"
      },
      {
        "at": [
          26,
          1,
          20
        ],
        "from": "public-taproom",
        "to": "brewers-gallery"
      },
      {
        "at": [
          26,
          1,
          35
        ],
        "from": "brewers-gallery",
        "to": "staff-bedroom"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        47,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        49,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "corner-seating",
        "asset": "pack4:059"
      },
      {
        "x": 26,
        "z": 5,
        "room": "public-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 45,
        "z": 5,
        "room": "hearth-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 24,
        "z": 24,
        "room": "brewers-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 37,
        "room": "staff-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "left-public-gable",
        "rect": [
          0,
          0,
          20,
          20
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "right-public-roof",
        "rect": [
          21,
          0,
          50,
          20
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "back-lodging-spine",
        "rect": [
          19,
          21,
          34,
          44
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      46
    ],
    "detail": "original tavern functional T bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "snow",
    "size": "medium",
    "index": 3,
    "title": "Frostpine Winterfire Public House",
    "w": 43,
    "d": 38,
    "plan": "frostpine-winterfire-public-house-t-distinct-floorplan",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        17,
        16,
        37
      ],
      [
        32,
        17,
        42,
        37
      ],
      [
        36,
        9,
        42,
        15
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        15
      ],
      [
        30,
        2,
        30,
        15
      ],
      [
        18,
        16,
        30,
        16
      ],
      [
        18,
        30,
        30,
        30
      ]
    ],
    "entry": [
      24,
      1,
      "public-taproom"
    ],
    "rooms": [
      {
        "id": "corner-seating",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          16
        ]
      },
      {
        "id": "public-taproom",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          30,
          4,
          16
        ]
      },
      {
        "id": "hearth-kitchen",
        "min": [
          31,
          1,
          2
        ],
        "max": [
          41,
          4,
          16
        ]
      },
      {
        "id": "brewers-gallery",
        "min": [
          18,
          1,
          17
        ],
        "max": [
          31,
          4,
          30
        ]
      },
      {
        "id": "staff-bedroom",
        "min": [
          18,
          1,
          31
        ],
        "max": [
          31,
          4,
          37
        ]
      }
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "public-taproom",
        "to": "corner-seating"
      },
      {
        "at": [
          30,
          1,
          7
        ],
        "from": "public-taproom",
        "to": "hearth-kitchen"
      },
      {
        "at": [
          24,
          1,
          16
        ],
        "from": "public-taproom",
        "to": "brewers-gallery"
      },
      {
        "at": [
          24,
          1,
          30
        ],
        "from": "brewers-gallery",
        "to": "staff-bedroom"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        39,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        41,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "corner-seating",
        "asset": "pack4:059"
      },
      {
        "x": 24,
        "z": 5,
        "room": "public-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 37,
        "z": 5,
        "room": "hearth-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 22,
        "z": 20,
        "room": "brewers-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 32,
        "room": "staff-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "left-public-gable",
        "rect": [
          0,
          0,
          18,
          16
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "right-public-roof",
        "rect": [
          19,
          0,
          42,
          16
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "back-lodging-spine",
        "rect": [
          17,
          17,
          31,
          37
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      38
    ],
    "detail": "original tavern functional T bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "snow",
    "size": "large",
    "index": 4,
    "title": "Whitecairn Glacier Festival Hall",
    "w": 52,
    "d": 46,
    "plan": "whitecairn-glacier-festival-hall-le-distinct-floorplan",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        33,
        20,
        51,
        45
      ],
      [
        0,
        38,
        4,
        45
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        18
      ],
      [
        33,
        2,
        33,
        18
      ],
      [
        2,
        19,
        31,
        19
      ],
      [
        2,
        36,
        31,
        36
      ]
    ],
    "entry": [
      18,
      1,
      "public-feasting-hall"
    ],
    "rooms": [
      {
        "id": "scullery-kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          14,
          4,
          19
        ]
      },
      {
        "id": "public-feasting-hall",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          33,
          4,
          19
        ]
      },
      {
        "id": "performance-aisle",
        "min": [
          34,
          1,
          2
        ],
        "max": [
          50,
          4,
          19
        ]
      },
      {
        "id": "cask-service-gallery",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          32,
          4,
          36
        ]
      },
      {
        "id": "staff-bunk-room",
        "min": [
          2,
          1,
          37
        ],
        "max": [
          32,
          4,
          45
        ]
      }
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          6
        ],
        "from": "public-feasting-hall",
        "to": "scullery-kitchen"
      },
      {
        "at": [
          33,
          1,
          7
        ],
        "from": "public-feasting-hall",
        "to": "performance-aisle"
      },
      {
        "at": [
          8,
          1,
          19
        ],
        "from": "scullery-kitchen",
        "to": "cask-service-gallery"
      },
      {
        "at": [
          8,
          1,
          36
        ],
        "from": "cask-service-gallery",
        "to": "staff-bunk-room"
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
        "room": "scullery-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 19,
        "z": 5,
        "room": "public-feasting-hall",
        "asset": "pack4:064"
      },
      {
        "x": 45,
        "z": 5,
        "room": "performance-aisle",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 23,
        "room": "cask-service-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 38,
        "room": "staff-bunk-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-tavern-roof",
        "rect": [
          0,
          0,
          51,
          19
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "west-return-lodging-roof",
        "rect": [
          0,
          20,
          32,
          45
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      47
    ],
    "detail": "original tavern functional LE bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 2,
    "title": "Firefly Fernwood Gathering Hut",
    "w": 34,
    "d": 31,
    "plan": "firefly-fernwood-gathering-hut-lw-distinct-floorplan",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        17,
        12,
        30
      ],
      [
        24,
        27,
        33,
        30
      ]
    ],
    "segments": [
      [
        12,
        2,
        12,
        15
      ],
      [
        24,
        2,
        24,
        15
      ],
      [
        14,
        16,
        31,
        16
      ],
      [
        14,
        24,
        31,
        24
      ]
    ],
    "entry": [
      16,
      1,
      "public-feasting-hall"
    ],
    "rooms": [
      {
        "id": "scullery-kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          12,
          4,
          16
        ]
      },
      {
        "id": "public-feasting-hall",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          24,
          4,
          16
        ]
      },
      {
        "id": "performance-aisle",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          32,
          4,
          16
        ]
      },
      {
        "id": "cask-service-gallery",
        "min": [
          14,
          1,
          17
        ],
        "max": [
          32,
          4,
          24
        ]
      },
      {
        "id": "staff-bunk-room",
        "min": [
          14,
          1,
          25
        ],
        "max": [
          32,
          4,
          30
        ]
      }
    ],
    "doors": [
      {
        "at": [
          12,
          1,
          6
        ],
        "from": "public-feasting-hall",
        "to": "scullery-kitchen"
      },
      {
        "at": [
          24,
          1,
          7
        ],
        "from": "public-feasting-hall",
        "to": "performance-aisle"
      },
      {
        "at": [
          26,
          1,
          16
        ],
        "from": "performance-aisle",
        "to": "cask-service-gallery"
      },
      {
        "at": [
          26,
          1,
          24
        ],
        "from": "cask-service-gallery",
        "to": "staff-bunk-room"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        30,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        32,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "scullery-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 17,
        "z": 5,
        "room": "public-feasting-hall",
        "asset": "pack4:064"
      },
      {
        "x": 27,
        "z": 5,
        "room": "performance-aisle",
        "asset": "pack4:059"
      },
      {
        "x": 18,
        "z": 20,
        "room": "cask-service-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 18,
        "z": 26,
        "room": "staff-bunk-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-tavern-roof",
        "rect": [
          0,
          0,
          33,
          16
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "east-return-lodging-roof",
        "rect": [
          13,
          17,
          33,
          30
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      29
    ],
    "detail": "original tavern functional LW bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 5,
    "title": "Moonwillow Storysong Tavern",
    "w": 44,
    "d": 40,
    "plan": "moonwillow-storysong-tavern-u-distinct-floorplan",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        14,
        19,
        31,
        39
      ],
      [
        39,
        9,
        43,
        17
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        17
      ],
      [
        2,
        18,
        12,
        18
      ],
      [
        33,
        18,
        41,
        18
      ],
      [
        2,
        27,
        12,
        27
      ],
      [
        33,
        28,
        41,
        28
      ]
    ],
    "entry": [
      22,
      1,
      "common-taproom"
    ],
    "rooms": [
      {
        "id": "brewery-workroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          18
        ]
      },
      {
        "id": "common-taproom",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          42,
          4,
          18
        ]
      },
      {
        "id": "hearth-kitchen",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          13,
          4,
          27
        ]
      },
      {
        "id": "staff-bedroom",
        "min": [
          2,
          1,
          28
        ],
        "max": [
          13,
          4,
          39
        ]
      },
      {
        "id": "performance-nook",
        "min": [
          33,
          1,
          19
        ],
        "max": [
          42,
          4,
          28
        ]
      },
      {
        "id": "private-booth",
        "min": [
          33,
          1,
          29
        ],
        "max": [
          42,
          4,
          39
        ]
      }
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "common-taproom",
        "to": "brewery-workroom"
      },
      {
        "at": [
          7,
          1,
          18
        ],
        "from": "brewery-workroom",
        "to": "hearth-kitchen"
      },
      {
        "at": [
          7,
          1,
          27
        ],
        "from": "hearth-kitchen",
        "to": "staff-bedroom"
      },
      {
        "at": [
          36,
          1,
          18
        ],
        "from": "common-taproom",
        "to": "performance-nook"
      },
      {
        "at": [
          36,
          1,
          28
        ],
        "from": "performance-nook",
        "to": "private-booth"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        40,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        42,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "brewery-workroom",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 5,
        "room": "common-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 22,
        "room": "hearth-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 7,
        "z": 29,
        "room": "staff-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 36,
        "z": 22,
        "room": "performance-nook",
        "asset": "pack4:059"
      },
      {
        "x": 36,
        "z": 30,
        "room": "private-booth",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "front-communal-gable",
        "rect": [
          0,
          0,
          43,
          18
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "left-guest-wing",
        "rect": [
          0,
          19,
          13,
          39
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "right-guest-wing",
        "rect": [
          32,
          19,
          43,
          39
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      4,
      39
    ],
    "detail": "original tavern functional U bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "medium",
    "index": 3,
    "title": "Stoneforge Pass Alehouse",
    "w": 44,
    "d": 41,
    "plan": "stoneforge-pass-alehouse-le-distinct-floorplan",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        26,
        19,
        43,
        40
      ],
      [
        0,
        31,
        6,
        40
      ]
    ],
    "segments": [
      [
        15,
        2,
        15,
        17
      ],
      [
        29,
        2,
        29,
        17
      ],
      [
        2,
        18,
        24,
        18
      ],
      [
        2,
        29,
        24,
        29
      ]
    ],
    "entry": [
      19,
      1,
      "public-feasting-hall"
    ],
    "rooms": [
      {
        "id": "scullery-kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          18
        ]
      },
      {
        "id": "public-feasting-hall",
        "min": [
          16,
          1,
          2
        ],
        "max": [
          29,
          4,
          18
        ]
      },
      {
        "id": "performance-aisle",
        "min": [
          30,
          1,
          2
        ],
        "max": [
          42,
          4,
          18
        ]
      },
      {
        "id": "cask-service-gallery",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          25,
          4,
          29
        ]
      },
      {
        "id": "staff-bunk-room",
        "min": [
          2,
          1,
          30
        ],
        "max": [
          25,
          4,
          40
        ]
      }
    ],
    "doors": [
      {
        "at": [
          15,
          1,
          6
        ],
        "from": "public-feasting-hall",
        "to": "scullery-kitchen"
      },
      {
        "at": [
          29,
          1,
          7
        ],
        "from": "public-feasting-hall",
        "to": "performance-aisle"
      },
      {
        "at": [
          8,
          1,
          18
        ],
        "from": "scullery-kitchen",
        "to": "cask-service-gallery"
      },
      {
        "at": [
          8,
          1,
          29
        ],
        "from": "cask-service-gallery",
        "to": "staff-bunk-room"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        40,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        42,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "scullery-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 20,
        "z": 5,
        "room": "public-feasting-hall",
        "asset": "pack4:064"
      },
      {
        "x": 37,
        "z": 5,
        "room": "performance-aisle",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 22,
        "room": "cask-service-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 31,
        "room": "staff-bunk-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-tavern-roof",
        "rect": [
          0,
          0,
          43,
          18
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "west-return-lodging-roof",
        "rect": [
          0,
          19,
          25,
          40
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      39
    ],
    "detail": "original tavern functional LE bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "large",
    "index": 4,
    "title": "Ironbell Summit Feast Hall",
    "w": 53,
    "d": 47,
    "plan": "ironbell-summit-feast-hall-t-distinct-floorplan",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        20,
        19,
        46
      ],
      [
        38,
        20,
        52,
        46
      ],
      [
        44,
        9,
        52,
        18
      ]
    ],
    "segments": [
      [
        21,
        2,
        21,
        18
      ],
      [
        36,
        2,
        36,
        18
      ],
      [
        21,
        19,
        36,
        19
      ],
      [
        21,
        37,
        36,
        37
      ]
    ],
    "entry": [
      28,
      1,
      "public-taproom"
    ],
    "rooms": [
      {
        "id": "corner-seating",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          21,
          4,
          19
        ]
      },
      {
        "id": "public-taproom",
        "min": [
          22,
          1,
          2
        ],
        "max": [
          36,
          4,
          19
        ]
      },
      {
        "id": "hearth-kitchen",
        "min": [
          37,
          1,
          2
        ],
        "max": [
          51,
          4,
          19
        ]
      },
      {
        "id": "brewers-gallery",
        "min": [
          21,
          1,
          20
        ],
        "max": [
          37,
          4,
          37
        ]
      },
      {
        "id": "staff-bedroom",
        "min": [
          21,
          1,
          38
        ],
        "max": [
          37,
          4,
          46
        ]
      }
    ],
    "doors": [
      {
        "at": [
          21,
          1,
          6
        ],
        "from": "public-taproom",
        "to": "corner-seating"
      },
      {
        "at": [
          36,
          1,
          7
        ],
        "from": "public-taproom",
        "to": "hearth-kitchen"
      },
      {
        "at": [
          28,
          1,
          19
        ],
        "from": "public-taproom",
        "to": "brewers-gallery"
      },
      {
        "at": [
          28,
          1,
          37
        ],
        "from": "brewers-gallery",
        "to": "staff-bedroom"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        49,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        51,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "corner-seating",
        "asset": "pack4:059"
      },
      {
        "x": 28,
        "z": 5,
        "room": "public-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 47,
        "z": 5,
        "room": "hearth-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 26,
        "z": 23,
        "room": "brewers-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 26,
        "z": 39,
        "room": "staff-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "left-public-gable",
        "rect": [
          0,
          0,
          21,
          19
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "right-public-roof",
        "rect": [
          22,
          0,
          52,
          19
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "back-lodging-spine",
        "rect": [
          20,
          20,
          37,
          46
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      48
    ],
    "detail": "original tavern functional T bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "small",
    "index": 2,
    "title": "Rillgate Pilgrims Rest",
    "w": 36,
    "d": 33,
    "plan": "rillgate-pilgrims-rest-t-distinct-floorplan",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        17,
        11,
        32
      ],
      [
        24,
        17,
        35,
        32
      ],
      [
        0,
        10,
        7,
        15
      ]
    ],
    "segments": [
      [
        13,
        2,
        13,
        15
      ],
      [
        22,
        2,
        22,
        15
      ],
      [
        13,
        16,
        22,
        16
      ],
      [
        13,
        25,
        22,
        25
      ]
    ],
    "entry": [
      17,
      1,
      "lobby-reception"
    ],
    "rooms": [
      {
        "id": "western-guest-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          13,
          4,
          16
        ]
      },
      {
        "id": "lobby-reception",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          22,
          4,
          16
        ]
      },
      {
        "id": "eastern-guest-room",
        "min": [
          23,
          1,
          2
        ],
        "max": [
          34,
          4,
          16
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          13,
          1,
          17
        ],
        "max": [
          23,
          4,
          25
        ]
      },
      {
        "id": "rear-guest-suite",
        "min": [
          13,
          1,
          26
        ],
        "max": [
          23,
          4,
          32
        ]
      }
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          6
        ],
        "from": "lobby-reception",
        "to": "western-guest-room"
      },
      {
        "at": [
          22,
          1,
          7
        ],
        "from": "lobby-reception",
        "to": "eastern-guest-room"
      },
      {
        "at": [
          17,
          1,
          16
        ],
        "from": "lobby-reception",
        "to": "linen-gallery"
      },
      {
        "at": [
          17,
          1,
          25
        ],
        "from": "linen-gallery",
        "to": "rear-guest-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        32,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        34,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 17,
        "z": 5,
        "room": "lobby-reception",
        "asset": "pack4:064"
      },
      {
        "x": 29,
        "z": 5,
        "room": "eastern-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 15,
        "z": 20,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 15,
        "z": 27,
        "room": "rear-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "left-public-gable",
        "rect": [
          0,
          0,
          13,
          16
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "right-public-roof",
        "rect": [
          14,
          0,
          35,
          16
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "back-lodging-spine",
        "rect": [
          12,
          17,
          23,
          32
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      31
    ],
    "detail": "original inn functional T bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "large",
    "index": 1,
    "title": "Willowbrook Grand Lodging Court",
    "w": 54,
    "d": 48,
    "plan": "willowbrook-grand-lodging-court-u-distinct-floorplan",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        17,
        21,
        38,
        47
      ],
      [
        0,
        9,
        5,
        19
      ]
    ],
    "segments": [
      [
        20,
        2,
        20,
        19
      ],
      [
        2,
        20,
        15,
        20
      ],
      [
        40,
        20,
        51,
        20
      ],
      [
        2,
        34,
        15,
        34
      ],
      [
        40,
        35,
        51,
        35
      ]
    ],
    "entry": [
      24,
      1,
      "common-hearth"
    ],
    "rooms": [
      {
        "id": "traveler-reception",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          20,
          4,
          20
        ]
      },
      {
        "id": "common-hearth",
        "min": [
          21,
          1,
          2
        ],
        "max": [
          52,
          4,
          20
        ]
      },
      {
        "id": "west-guest-one",
        "min": [
          2,
          1,
          21
        ],
        "max": [
          16,
          4,
          34
        ]
      },
      {
        "id": "west-guest-two",
        "min": [
          2,
          1,
          35
        ],
        "max": [
          16,
          4,
          47
        ]
      },
      {
        "id": "east-guest-one",
        "min": [
          40,
          1,
          21
        ],
        "max": [
          52,
          4,
          35
        ]
      },
      {
        "id": "east-guest-two",
        "min": [
          40,
          1,
          36
        ],
        "max": [
          52,
          4,
          47
        ]
      }
    ],
    "doors": [
      {
        "at": [
          20,
          1,
          6
        ],
        "from": "common-hearth",
        "to": "traveler-reception"
      },
      {
        "at": [
          7,
          1,
          20
        ],
        "from": "traveler-reception",
        "to": "west-guest-one"
      },
      {
        "at": [
          7,
          1,
          34
        ],
        "from": "west-guest-one",
        "to": "west-guest-two"
      },
      {
        "at": [
          46,
          1,
          20
        ],
        "from": "common-hearth",
        "to": "east-guest-one"
      },
      {
        "at": [
          46,
          1,
          35
        ],
        "from": "east-guest-one",
        "to": "east-guest-two"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        50,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        52,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "traveler-reception",
        "asset": "pack4:064"
      },
      {
        "x": 24,
        "z": 5,
        "room": "common-hearth",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 24,
        "room": "west-guest-one",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 7,
        "z": 36,
        "room": "west-guest-two",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 46,
        "z": 24,
        "room": "east-guest-one",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 46,
        "z": 37,
        "room": "east-guest-two",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-communal-gable",
        "rect": [
          0,
          0,
          53,
          20
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "left-guest-wing",
        "rect": [
          0,
          21,
          16,
          47
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "right-guest-wing",
        "rect": [
          39,
          21,
          53,
          47
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      49
    ],
    "detail": "original inn functional U bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "medium",
    "index": 2,
    "title": "Amber Oasis Caravanserai",
    "w": 46,
    "d": 42,
    "plan": "amber-oasis-caravanserai-t-distinct-floorplan",
    "roof": "steep",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        20,
        17,
        41
      ],
      [
        30,
        20,
        45,
        41
      ],
      [
        0,
        9,
        7,
        18
      ]
    ],
    "segments": [
      [
        19,
        2,
        19,
        18
      ],
      [
        28,
        2,
        28,
        18
      ],
      [
        19,
        19,
        28,
        19
      ],
      [
        19,
        30,
        28,
        30
      ]
    ],
    "entry": [
      23,
      1,
      "lobby-reception"
    ],
    "rooms": [
      {
        "id": "western-guest-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          19,
          4,
          19
        ]
      },
      {
        "id": "lobby-reception",
        "min": [
          20,
          1,
          2
        ],
        "max": [
          28,
          4,
          19
        ]
      },
      {
        "id": "eastern-guest-room",
        "min": [
          29,
          1,
          2
        ],
        "max": [
          44,
          4,
          19
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          19,
          1,
          20
        ],
        "max": [
          29,
          4,
          30
        ]
      },
      {
        "id": "rear-guest-suite",
        "min": [
          19,
          1,
          31
        ],
        "max": [
          29,
          4,
          41
        ]
      }
    ],
    "doors": [
      {
        "at": [
          19,
          1,
          6
        ],
        "from": "lobby-reception",
        "to": "western-guest-room"
      },
      {
        "at": [
          28,
          1,
          7
        ],
        "from": "lobby-reception",
        "to": "eastern-guest-room"
      },
      {
        "at": [
          23,
          1,
          19
        ],
        "from": "lobby-reception",
        "to": "linen-gallery"
      },
      {
        "at": [
          23,
          1,
          30
        ],
        "from": "linen-gallery",
        "to": "rear-guest-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        42,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        44,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "lobby-reception",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "eastern-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 23,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 32,
        "room": "rear-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "left-public-gable",
        "rect": [
          0,
          0,
          19,
          19
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "right-public-roof",
        "rect": [
          20,
          0,
          45,
          19
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "back-lodging-spine",
        "rect": [
          18,
          20,
          29,
          41
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      4,
      41
    ],
    "detail": "original inn functional T bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "large",
    "index": 1,
    "title": "Solhaven Merchant Caravan Inn",
    "w": 55,
    "d": 49,
    "plan": "solhaven-merchant-caravan-inn-lw-distinct-floorplan",
    "roof": "hip",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        21,
        22,
        48
      ],
      [
        46,
        39,
        54,
        48
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        19
      ],
      [
        37,
        2,
        37,
        19
      ],
      [
        24,
        20,
        52,
        20
      ],
      [
        24,
        36,
        52,
        36
      ]
    ],
    "entry": [
      22,
      1,
      "reception-hall"
    ],
    "rooms": [
      {
        "id": "west-guest-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          20
        ]
      },
      {
        "id": "reception-hall",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          37,
          4,
          20
        ]
      },
      {
        "id": "east-guest-room",
        "min": [
          38,
          1,
          2
        ],
        "max": [
          53,
          4,
          20
        ]
      },
      {
        "id": "luggage-gallery",
        "min": [
          24,
          1,
          21
        ],
        "max": [
          53,
          4,
          36
        ]
      },
      {
        "id": "family-guest-suite",
        "min": [
          24,
          1,
          37
        ],
        "max": [
          53,
          4,
          48
        ]
      }
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "reception-hall",
        "to": "west-guest-room"
      },
      {
        "at": [
          37,
          1,
          7
        ],
        "from": "reception-hall",
        "to": "east-guest-room"
      },
      {
        "at": [
          47,
          1,
          20
        ],
        "from": "east-guest-room",
        "to": "luggage-gallery"
      },
      {
        "at": [
          47,
          1,
          36
        ],
        "from": "luggage-gallery",
        "to": "family-guest-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        51,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        53,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "reception-hall",
        "asset": "pack4:064"
      },
      {
        "x": 48,
        "z": 5,
        "room": "east-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 24,
        "room": "luggage-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 28,
        "z": 38,
        "room": "family-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-tavern-roof",
        "rect": [
          0,
          0,
          54,
          20
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "east-return-lodging-roof",
        "rect": [
          23,
          21,
          54,
          48
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      50
    ],
    "detail": "original inn functional LW bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "small",
    "index": 2,
    "title": "Snowdrop Hearthstone Inn",
    "w": 36,
    "d": 33,
    "plan": "snowdrop-hearthstone-inn-lw-distinct-floorplan",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        17,
        16,
        32
      ],
      [
        31,
        26,
        35,
        32
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        15
      ],
      [
        25,
        2,
        25,
        15
      ],
      [
        18,
        16,
        33,
        16
      ],
      [
        18,
        24,
        33,
        24
      ]
    ],
    "entry": [
      18,
      1,
      "reception-hall"
    ],
    "rooms": [
      {
        "id": "west-guest-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          14,
          4,
          16
        ]
      },
      {
        "id": "reception-hall",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          25,
          4,
          16
        ]
      },
      {
        "id": "east-guest-room",
        "min": [
          26,
          1,
          2
        ],
        "max": [
          34,
          4,
          16
        ]
      },
      {
        "id": "luggage-gallery",
        "min": [
          18,
          1,
          17
        ],
        "max": [
          34,
          4,
          24
        ]
      },
      {
        "id": "family-guest-suite",
        "min": [
          18,
          1,
          25
        ],
        "max": [
          34,
          4,
          32
        ]
      }
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          6
        ],
        "from": "reception-hall",
        "to": "west-guest-room"
      },
      {
        "at": [
          25,
          1,
          7
        ],
        "from": "reception-hall",
        "to": "east-guest-room"
      },
      {
        "at": [
          28,
          1,
          16
        ],
        "from": "east-guest-room",
        "to": "luggage-gallery"
      },
      {
        "at": [
          28,
          1,
          24
        ],
        "from": "luggage-gallery",
        "to": "family-guest-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        32,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        34,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 5,
        "room": "reception-hall",
        "asset": "pack4:064"
      },
      {
        "x": 29,
        "z": 5,
        "room": "east-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 22,
        "z": 20,
        "room": "luggage-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 26,
        "room": "family-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-tavern-roof",
        "rect": [
          0,
          0,
          35,
          16
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "east-return-lodging-roof",
        "rect": [
          17,
          17,
          35,
          32
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      31
    ],
    "detail": "original inn functional LW bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "medium",
    "index": 1,
    "title": "Frostwick Sledders Lodge",
    "w": 46,
    "d": 42,
    "plan": "frostwick-sledders-lodge-u-distinct-floorplan",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        15,
        21,
        29,
        41
      ],
      [
        41,
        9,
        45,
        19
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        19
      ],
      [
        2,
        20,
        13,
        20
      ],
      [
        31,
        20,
        43,
        20
      ],
      [
        2,
        34,
        13,
        34
      ],
      [
        31,
        35,
        43,
        35
      ]
    ],
    "entry": [
      21,
      1,
      "common-hearth"
    ],
    "rooms": [
      {
        "id": "traveler-reception",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          20
        ]
      },
      {
        "id": "common-hearth",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          44,
          4,
          20
        ]
      },
      {
        "id": "west-guest-one",
        "min": [
          2,
          1,
          21
        ],
        "max": [
          14,
          4,
          34
        ]
      },
      {
        "id": "west-guest-two",
        "min": [
          2,
          1,
          35
        ],
        "max": [
          14,
          4,
          41
        ]
      },
      {
        "id": "east-guest-one",
        "min": [
          31,
          1,
          21
        ],
        "max": [
          44,
          4,
          35
        ]
      },
      {
        "id": "east-guest-two",
        "min": [
          31,
          1,
          36
        ],
        "max": [
          44,
          4,
          41
        ]
      }
    ],
    "doors": [
      {
        "at": [
          17,
          1,
          6
        ],
        "from": "common-hearth",
        "to": "traveler-reception"
      },
      {
        "at": [
          7,
          1,
          20
        ],
        "from": "traveler-reception",
        "to": "west-guest-one"
      },
      {
        "at": [
          7,
          1,
          34
        ],
        "from": "west-guest-one",
        "to": "west-guest-two"
      },
      {
        "at": [
          38,
          1,
          20
        ],
        "from": "common-hearth",
        "to": "east-guest-one"
      },
      {
        "at": [
          38,
          1,
          35
        ],
        "from": "east-guest-one",
        "to": "east-guest-two"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        42,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        44,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "traveler-reception",
        "asset": "pack4:064"
      },
      {
        "x": 21,
        "z": 5,
        "room": "common-hearth",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 24,
        "room": "west-guest-one",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 7,
        "z": 36,
        "room": "west-guest-two",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 38,
        "z": 24,
        "room": "east-guest-one",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 38,
        "z": 37,
        "room": "east-guest-two",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-communal-gable",
        "rect": [
          0,
          0,
          45,
          20
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "left-guest-wing",
        "rect": [
          0,
          21,
          14,
          41
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "right-guest-wing",
        "rect": [
          30,
          21,
          45,
          41
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      41
    ],
    "detail": "original inn functional U bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 1,
    "title": "Starlace Nightbloom Guesthouse",
    "w": 46,
    "d": 42,
    "plan": "starlace-nightbloom-guesthouse-le-distinct-floorplan",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        32,
        21,
        45,
        41
      ],
      [
        0,
        34,
        4,
        41
      ]
    ],
    "segments": [
      [
        15,
        2,
        15,
        19
      ],
      [
        32,
        2,
        32,
        19
      ],
      [
        2,
        20,
        30,
        20
      ],
      [
        2,
        32,
        30,
        32
      ]
    ],
    "entry": [
      19,
      1,
      "reception-hall"
    ],
    "rooms": [
      {
        "id": "west-guest-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          20
        ]
      },
      {
        "id": "reception-hall",
        "min": [
          16,
          1,
          2
        ],
        "max": [
          32,
          4,
          20
        ]
      },
      {
        "id": "east-guest-room",
        "min": [
          33,
          1,
          2
        ],
        "max": [
          44,
          4,
          20
        ]
      },
      {
        "id": "luggage-gallery",
        "min": [
          2,
          1,
          21
        ],
        "max": [
          31,
          4,
          32
        ]
      },
      {
        "id": "family-guest-suite",
        "min": [
          2,
          1,
          33
        ],
        "max": [
          31,
          4,
          41
        ]
      }
    ],
    "doors": [
      {
        "at": [
          15,
          1,
          6
        ],
        "from": "reception-hall",
        "to": "west-guest-room"
      },
      {
        "at": [
          32,
          1,
          7
        ],
        "from": "reception-hall",
        "to": "east-guest-room"
      },
      {
        "at": [
          8,
          1,
          20
        ],
        "from": "west-guest-room",
        "to": "luggage-gallery"
      },
      {
        "at": [
          8,
          1,
          32
        ],
        "from": "luggage-gallery",
        "to": "family-guest-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        42,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        44,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 20,
        "z": 5,
        "room": "reception-hall",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "east-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 24,
        "room": "luggage-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 34,
        "room": "family-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-tavern-roof",
        "rect": [
          0,
          0,
          45,
          20
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "west-return-lodging-roof",
        "rect": [
          0,
          21,
          31,
          41
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      41
    ],
    "detail": "original inn functional LE bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 1,
    "title": "Lunawood Starlight Inn",
    "w": 56,
    "d": 49,
    "plan": "lunawood-starlight-inn-t-distinct-floorplan",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        23,
        19,
        48
      ],
      [
        41,
        23,
        55,
        48
      ],
      [
        50,
        9,
        55,
        21
      ]
    ],
    "segments": [
      [
        21,
        2,
        21,
        21
      ],
      [
        39,
        2,
        39,
        21
      ],
      [
        21,
        22,
        39,
        22
      ],
      [
        21,
        38,
        39,
        38
      ]
    ],
    "entry": [
      30,
      1,
      "lobby-reception"
    ],
    "rooms": [
      {
        "id": "western-guest-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          21,
          4,
          22
        ]
      },
      {
        "id": "lobby-reception",
        "min": [
          22,
          1,
          2
        ],
        "max": [
          39,
          4,
          22
        ]
      },
      {
        "id": "eastern-guest-room",
        "min": [
          40,
          1,
          2
        ],
        "max": [
          54,
          4,
          22
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          21,
          1,
          23
        ],
        "max": [
          40,
          4,
          38
        ]
      },
      {
        "id": "rear-guest-suite",
        "min": [
          21,
          1,
          39
        ],
        "max": [
          40,
          4,
          48
        ]
      }
    ],
    "doors": [
      {
        "at": [
          21,
          1,
          6
        ],
        "from": "lobby-reception",
        "to": "western-guest-room"
      },
      {
        "at": [
          39,
          1,
          7
        ],
        "from": "lobby-reception",
        "to": "eastern-guest-room"
      },
      {
        "at": [
          30,
          1,
          22
        ],
        "from": "lobby-reception",
        "to": "linen-gallery"
      },
      {
        "at": [
          30,
          1,
          38
        ],
        "from": "linen-gallery",
        "to": "rear-guest-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        52,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        54,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 30,
        "z": 5,
        "room": "lobby-reception",
        "asset": "pack4:064"
      },
      {
        "x": 49,
        "z": 5,
        "room": "eastern-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 26,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 28,
        "z": 40,
        "room": "rear-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "left-public-gable",
        "rect": [
          0,
          0,
          21,
          22
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "right-public-roof",
        "rect": [
          22,
          0,
          55,
          22
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "back-lodging-spine",
        "rect": [
          20,
          23,
          40,
          48
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      51
    ],
    "detail": "original inn functional T bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "mountain",
    "size": "small",
    "index": 1,
    "title": "Peakstone Wayfarers Cabin Inn",
    "w": 36,
    "d": 33,
    "plan": "peakstone-wayfarers-cabin-inn-u-distinct-floorplan",
    "roof": "courtyard",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        15,
        17,
        22,
        32
      ],
      [
        0,
        9,
        5,
        15
      ]
    ],
    "segments": [
      [
        16,
        2,
        16,
        15
      ],
      [
        2,
        16,
        13,
        16
      ],
      [
        24,
        16,
        33,
        16
      ],
      [
        2,
        23,
        13,
        23
      ],
      [
        24,
        24,
        33,
        24
      ]
    ],
    "entry": [
      20,
      1,
      "common-hearth"
    ],
    "rooms": [
      {
        "id": "traveler-reception",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          16,
          4,
          16
        ]
      },
      {
        "id": "common-hearth",
        "min": [
          17,
          1,
          2
        ],
        "max": [
          34,
          4,
          16
        ]
      },
      {
        "id": "west-guest-one",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          14,
          4,
          23
        ]
      },
      {
        "id": "west-guest-two",
        "min": [
          2,
          1,
          24
        ],
        "max": [
          14,
          4,
          32
        ]
      },
      {
        "id": "east-guest-one",
        "min": [
          24,
          1,
          17
        ],
        "max": [
          34,
          4,
          24
        ]
      },
      {
        "id": "east-guest-two",
        "min": [
          24,
          1,
          25
        ],
        "max": [
          34,
          4,
          32
        ]
      }
    ],
    "doors": [
      {
        "at": [
          16,
          1,
          6
        ],
        "from": "common-hearth",
        "to": "traveler-reception"
      },
      {
        "at": [
          7,
          1,
          16
        ],
        "from": "traveler-reception",
        "to": "west-guest-one"
      },
      {
        "at": [
          7,
          1,
          23
        ],
        "from": "west-guest-one",
        "to": "west-guest-two"
      },
      {
        "at": [
          28,
          1,
          16
        ],
        "from": "common-hearth",
        "to": "east-guest-one"
      },
      {
        "at": [
          28,
          1,
          24
        ],
        "from": "east-guest-one",
        "to": "east-guest-two"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        32,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        34,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "traveler-reception",
        "asset": "pack4:064"
      },
      {
        "x": 20,
        "z": 5,
        "room": "common-hearth",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 20,
        "room": "west-guest-one",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 7,
        "z": 25,
        "room": "west-guest-two",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 20,
        "room": "east-guest-one",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 26,
        "room": "east-guest-two",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-communal-gable",
        "rect": [
          0,
          0,
          35,
          16
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "left-guest-wing",
        "rect": [
          0,
          17,
          14,
          32
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "right-guest-wing",
        "rect": [
          23,
          17,
          35,
          32
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      31
    ],
    "detail": "original inn functional U bioregional rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "mountain",
    "size": "large",
    "index": 2,
    "title": "Highcairn Skybridge Lodging Hall",
    "w": 57,
    "d": 51,
    "plan": "highcairn-skybridge-lodging-hall-t-distinct-floorplan",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        24,
        18,
        50
      ],
      [
        39,
        24,
        56,
        50
      ],
      [
        0,
        9,
        5,
        22
      ]
    ],
    "segments": [
      [
        20,
        2,
        20,
        22
      ],
      [
        37,
        2,
        37,
        22
      ],
      [
        20,
        23,
        37,
        23
      ],
      [
        20,
        41,
        37,
        41
      ]
    ],
    "entry": [
      28,
      1,
      "lobby-reception"
    ],
    "rooms": [
      {
        "id": "western-guest-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          20,
          4,
          23
        ]
      },
      {
        "id": "lobby-reception",
        "min": [
          21,
          1,
          2
        ],
        "max": [
          37,
          4,
          23
        ]
      },
      {
        "id": "eastern-guest-room",
        "min": [
          38,
          1,
          2
        ],
        "max": [
          55,
          4,
          23
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          20,
          1,
          24
        ],
        "max": [
          38,
          4,
          41
        ]
      },
      {
        "id": "rear-guest-suite",
        "min": [
          20,
          1,
          42
        ],
        "max": [
          38,
          4,
          50
        ]
      }
    ],
    "doors": [
      {
        "at": [
          20,
          1,
          6
        ],
        "from": "lobby-reception",
        "to": "western-guest-room"
      },
      {
        "at": [
          37,
          1,
          7
        ],
        "from": "lobby-reception",
        "to": "eastern-guest-room"
      },
      {
        "at": [
          28,
          1,
          23
        ],
        "from": "lobby-reception",
        "to": "linen-gallery"
      },
      {
        "at": [
          28,
          1,
          41
        ],
        "from": "linen-gallery",
        "to": "rear-guest-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        53,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        55,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 5,
        "room": "lobby-reception",
        "asset": "pack4:064"
      },
      {
        "x": 50,
        "z": 5,
        "room": "eastern-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 26,
        "z": 27,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 26,
        "z": 43,
        "room": "rear-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "left-public-gable",
        "rect": [
          0,
          0,
          20,
          23
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "right-public-roof",
        "rect": [
          21,
          0,
          56,
          23
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "back-lodging-spine",
        "rect": [
          19,
          24,
          38,
          50
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      52
    ],
    "detail": "original inn functional T bioregional rooms, supported roofs and producer physical fixtures"
  }
]);
export const HOSPITALITY_WAVE1_IDS=Object.freeze(SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getHospitalityWave1(){return SPECS.map(compileM2ArchitecturalSpec);}
