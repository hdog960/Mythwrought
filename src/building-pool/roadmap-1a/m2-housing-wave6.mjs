// Builder 1A M2 wave 6: distinct coordinate-authored L, U and dual-notch T houses.
// Exact authored rooms, partition segments, entrances, visible walls and regional material descriptors.
// Unintegrated draft only. No shared runtime, saves or sibling changes.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "temperate",
    "size": "small",
    "index": 7,
    "title": "Foxmarsh Trestle Cottage",
    "w": 24,
    "d": 23,
    "plan": "temperate-lateral-west-open-trestle-and-private-east-garden-rooms",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        13,
        9,
        22
      ]
    ],
    "segments": [
      [
        8,
        2,
        8,
        10
      ],
      [
        11,
        11,
        21,
        11
      ],
      [
        15,
        12,
        15,
        20
      ]
    ],
    "entry": [
      12,
      1,
      "hearth"
    ],
    "rooms": [
      {
        "id": "hearth",
        "min": [
          9,
          1,
          2
        ],
        "max": [
          22,
          4,
          11
        ]
      },
      {
        "id": "study",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          8,
          4,
          11
        ]
      },
      {
        "id": "pantry",
        "min": [
          11,
          1,
          12
        ],
        "max": [
          15,
          4,
          21
        ]
      },
      {
        "id": "sleep",
        "min": [
          16,
          1,
          12
        ],
        "max": [
          22,
          4,
          21
        ]
      }
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          5
        ],
        "from": "hearth",
        "to": "study"
      },
      {
        "at": [
          12,
          1,
          11
        ],
        "from": "hearth",
        "to": "pantry"
      },
      {
        "at": [
          18,
          1,
          11
        ],
        "from": "hearth",
        "to": "sleep"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        20,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        22,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 15,
        "z": 5,
        "room": "hearth",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "study",
        "asset": "pack5:084"
      },
      {
        "x": 12,
        "z": 14,
        "room": "pantry",
        "asset": "pack4:057"
      },
      {
        "x": 18,
        "z": 15,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "north-timber-hall",
        "rect": [
          0,
          0,
          23,
          11
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-wing",
        "rect": [
          10,
          12,
          23,
          22
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      19
    ],
    "detail": "temperate-lateral-west-open-trestle-and-private-east-garden-rooms"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "medium",
    "index": 8,
    "title": "Thornwater Twin-Orchard House",
    "w": 30,
    "d": 26,
    "plan": "two-offset-orchard-wing-house-with-front-independent-studio",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        12,
        13,
        19,
        25
      ]
    ],
    "segments": [
      [
        9,
        2,
        9,
        11
      ],
      [
        2,
        12,
        10,
        12
      ],
      [
        20,
        12,
        27,
        12
      ],
      [
        2,
        19,
        10,
        19
      ],
      [
        20,
        19,
        27,
        19
      ]
    ],
    "entry": [
      15,
      1,
      "great"
    ],
    "rooms": [
      {
        "id": "great",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          28,
          4,
          12
        ]
      },
      {
        "id": "studio",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          9,
          4,
          12
        ]
      },
      {
        "id": "west-guest",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          11,
          4,
          19
        ]
      },
      {
        "id": "west-sleep",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          11,
          4,
          24
        ]
      },
      {
        "id": "east-cook",
        "min": [
          21,
          1,
          13
        ],
        "max": [
          28,
          4,
          19
        ]
      },
      {
        "id": "east-store",
        "min": [
          21,
          1,
          20
        ],
        "max": [
          28,
          4,
          24
        ]
      }
    ],
    "doors": [
      {
        "at": [
          9,
          1,
          5
        ],
        "from": "great",
        "to": "studio"
      },
      {
        "at": [
          5,
          1,
          12
        ],
        "from": "studio",
        "to": "west-guest"
      },
      {
        "at": [
          5,
          1,
          19
        ],
        "from": "west-guest",
        "to": "west-sleep"
      },
      {
        "at": [
          24,
          1,
          12
        ],
        "from": "great",
        "to": "east-cook"
      },
      {
        "at": [
          24,
          1,
          19
        ],
        "from": "east-cook",
        "to": "east-store"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        26,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        28,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 15,
        "z": 5,
        "room": "great",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "studio",
        "asset": "pack5:084"
      },
      {
        "x": 4,
        "z": 16,
        "room": "west-guest",
        "asset": "pack4:059"
      },
      {
        "x": 4,
        "z": 21,
        "room": "west-sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 15,
        "room": "east-cook",
        "asset": "pack4:057"
      },
      {
        "x": 24,
        "z": 21,
        "room": "east-store",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "orchard-porch",
        "rect": [
          0,
          0,
          29,
          12
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "western-truss",
        "rect": [
          0,
          13,
          11,
          25
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "eastern-dormers",
        "rect": [
          20,
          13,
          29,
          25
        ],
        "style": "double-hill",
        "raise": 1
      }
    ],
    "posts": [
      4,
      25
    ],
    "detail": "two-offset-orchard-wing-house-with-front-independent-studio"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "large",
    "index": 8,
    "title": "Elmharbor Double-Notch Manor",
    "w": 38,
    "d": 32,
    "plan": "two-open-courtyard-shoulders-with-central-rear-narrow-archive",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        15,
        12,
        31
      ],
      [
        27,
        12,
        37,
        31
      ]
    ],
    "segments": [
      [
        11,
        2,
        11,
        10
      ],
      [
        13,
        11,
        26,
        11
      ],
      [
        13,
        21,
        26,
        21
      ],
      [
        20,
        22,
        20,
        29
      ]
    ],
    "entry": [
      18,
      1,
      "feast"
    ],
    "rooms": [
      {
        "id": "feast",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          36,
          4,
          11
        ]
      },
      {
        "id": "guest",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          11,
          4,
          11
        ]
      },
      {
        "id": "gallery",
        "min": [
          13,
          1,
          12
        ],
        "max": [
          27,
          4,
          21
        ]
      },
      {
        "id": "sleep",
        "min": [
          13,
          1,
          22
        ],
        "max": [
          20,
          4,
          30
        ]
      },
      {
        "id": "archive",
        "min": [
          21,
          1,
          22
        ],
        "max": [
          27,
          4,
          30
        ]
      }
    ],
    "doors": [
      {
        "at": [
          11,
          1,
          5
        ],
        "from": "feast",
        "to": "guest"
      },
      {
        "at": [
          18,
          1,
          11
        ],
        "from": "feast",
        "to": "gallery"
      },
      {
        "at": [
          17,
          1,
          21
        ],
        "from": "gallery",
        "to": "sleep"
      },
      {
        "at": [
          20,
          1,
          25
        ],
        "from": "sleep",
        "to": "archive"
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
        5,
        "west"
      ],
      [
        36,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 18,
        "z": 5,
        "room": "feast",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "guest",
        "asset": "pack4:058"
      },
      {
        "x": 17,
        "z": 16,
        "room": "gallery",
        "asset": "pack5:084"
      },
      {
        "x": 15,
        "z": 24,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 25,
        "room": "archive",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "front-hall",
        "rect": [
          0,
          0,
          37,
          11
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "double-rear-crest",
        "rect": [
          13,
          12,
          26,
          31
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      33
    ],
    "detail": "two-open-courtyard-shoulders-with-central-rear-narrow-archive"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "small",
    "index": 8,
    "title": "Sundune Back-Aisle Adobe",
    "w": 22,
    "d": 24,
    "plan": "desert-open-right-corner-and-deep-triple-serial-privacy-aisle",
    "roof": "hip",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        14,
        12,
        21,
        23
      ]
    ],
    "segments": [
      [
        2,
        11,
        13,
        11
      ],
      [
        2,
        17,
        13,
        17
      ]
    ],
    "entry": [
      10,
      1,
      "sunhall"
    ],
    "rooms": [
      {
        "id": "sunhall",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          20,
          4,
          11
        ]
      },
      {
        "id": "kitchen",
        "min": [
          2,
          1,
          12
        ],
        "max": [
          13,
          4,
          17
        ]
      },
      {
        "id": "sleep",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          13,
          4,
          22
        ]
      }
    ],
    "doors": [
      {
        "at": [
          6,
          1,
          11
        ],
        "from": "sunhall",
        "to": "kitchen"
      },
      {
        "at": [
          6,
          1,
          17
        ],
        "from": "kitchen",
        "to": "sleep"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        18,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        20,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 10,
        "z": 5,
        "room": "sunhall",
        "asset": "pack4:064"
      },
      {
        "x": 6,
        "z": 14,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 19,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "north-adobe-screen",
        "rect": [
          0,
          0,
          21,
          11
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "west-deep-terrace",
        "rect": [
          0,
          12,
          13,
          23
        ],
        "style": "double-hill",
        "raise": 1
      }
    ],
    "posts": [
      4,
      17
    ],
    "detail": "desert-open-right-corner-and-deep-triple-serial-privacy-aisle"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "medium",
    "index": 8,
    "title": "Amberwind Offset Spicehouse",
    "w": 29,
    "d": 25,
    "plan": "desert-angled-spice-bay-with-independent-rear-two-room-aisles",
    "roof": "hip",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        17,
        11,
        28,
        24
      ]
    ],
    "segments": [
      [
        2,
        10,
        15,
        10
      ],
      [
        8,
        11,
        8,
        22
      ],
      [
        2,
        18,
        7,
        18
      ],
      [
        9,
        18,
        15,
        18
      ]
    ],
    "entry": [
      14,
      1,
      "salon"
    ],
    "rooms": [
      {
        "id": "salon",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          27,
          4,
          10
        ]
      },
      {
        "id": "guest",
        "min": [
          2,
          1,
          11
        ],
        "max": [
          8,
          4,
          18
        ]
      },
      {
        "id": "pantry",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          8,
          4,
          23
        ]
      },
      {
        "id": "work",
        "min": [
          9,
          1,
          11
        ],
        "max": [
          16,
          4,
          18
        ]
      },
      {
        "id": "sleep",
        "min": [
          9,
          1,
          19
        ],
        "max": [
          16,
          4,
          23
        ]
      }
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          10
        ],
        "from": "salon",
        "to": "guest"
      },
      {
        "at": [
          12,
          1,
          10
        ],
        "from": "salon",
        "to": "work"
      },
      {
        "at": [
          5,
          1,
          18
        ],
        "from": "guest",
        "to": "pantry"
      },
      {
        "at": [
          12,
          1,
          18
        ],
        "from": "work",
        "to": "sleep"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        25,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        27,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 15,
        "z": 5,
        "room": "salon",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 14,
        "room": "guest",
        "asset": "pack4:059"
      },
      {
        "x": 4,
        "z": 20,
        "room": "pantry",
        "asset": "pack4:057"
      },
      {
        "x": 13,
        "z": 14,
        "room": "work",
        "asset": "pack5:084"
      },
      {
        "x": 11,
        "z": 20,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "spice-mercantile-porch",
        "rect": [
          0,
          0,
          28,
          10
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-shelter",
        "rect": [
          0,
          11,
          16,
          24
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      24
    ],
    "detail": "desert-angled-spice-bay-with-independent-rear-two-room-aisles"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "large",
    "index": 8,
    "title": "Qamar Sunwell U-Palace",
    "w": 38,
    "d": 34,
    "plan": "desert-six-suite-deep-sunwell-with-offset-kitchen-and-guest-ridges",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        15,
        13,
        22,
        33
      ]
    ],
    "segments": [
      [
        2,
        12,
        14,
        12
      ],
      [
        23,
        12,
        35,
        12
      ],
      [
        2,
        19,
        14,
        19
      ],
      [
        2,
        26,
        14,
        26
      ],
      [
        23,
        21,
        35,
        21
      ]
    ],
    "entry": [
      18,
      1,
      "reception"
    ],
    "rooms": [
      {
        "id": "reception",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          36,
          4,
          12
        ]
      },
      {
        "id": "west-kitchen",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          14,
          4,
          19
        ]
      },
      {
        "id": "west-sleep",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          14,
          4,
          26
        ]
      },
      {
        "id": "west-library",
        "min": [
          2,
          1,
          27
        ],
        "max": [
          14,
          4,
          32
        ]
      },
      {
        "id": "east-hall",
        "min": [
          24,
          1,
          13
        ],
        "max": [
          36,
          4,
          21
        ]
      },
      {
        "id": "east-guest",
        "min": [
          24,
          1,
          22
        ],
        "max": [
          36,
          4,
          32
        ]
      }
    ],
    "doors": [
      {
        "at": [
          6,
          1,
          12
        ],
        "from": "reception",
        "to": "west-kitchen"
      },
      {
        "at": [
          30,
          1,
          12
        ],
        "from": "reception",
        "to": "east-hall"
      },
      {
        "at": [
          6,
          1,
          19
        ],
        "from": "west-kitchen",
        "to": "west-sleep"
      },
      {
        "at": [
          6,
          1,
          26
        ],
        "from": "west-sleep",
        "to": "west-library"
      },
      {
        "at": [
          30,
          1,
          21
        ],
        "from": "east-hall",
        "to": "east-guest"
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
        5,
        "west"
      ],
      [
        36,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 18,
        "z": 6,
        "room": "reception",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 15,
        "room": "west-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 23,
        "room": "west-sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 5,
        "z": 29,
        "room": "west-library",
        "asset": "pack5:084"
      },
      {
        "x": 30,
        "z": 17,
        "room": "east-hall",
        "asset": "pack4:058"
      },
      {
        "x": 27,
        "z": 26,
        "room": "east-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "grand-sun-gate",
        "rect": [
          0,
          0,
          37,
          12
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "left-shade-court",
        "rect": [
          0,
          13,
          14,
          33
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "east-desert-garden",
        "rect": [
          23,
          13,
          37,
          33
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      4,
      33
    ],
    "detail": "desert-six-suite-deep-sunwell-with-offset-kitchen-and-guest-ridges"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "small",
    "index": 7,
    "title": "Whitecap Side-Store Winterhome",
    "w": 24,
    "d": 23,
    "plan": "snow-lodge-with-private-gear-buffer-before-back-cabins",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        14,
        12,
        23,
        22
      ]
    ],
    "segments": [
      [
        8,
        2,
        8,
        10
      ],
      [
        2,
        11,
        13,
        11
      ],
      [
        2,
        16,
        13,
        16
      ]
    ],
    "entry": [
      13,
      1,
      "main"
    ],
    "rooms": [
      {
        "id": "main",
        "min": [
          9,
          1,
          2
        ],
        "max": [
          22,
          4,
          11
        ]
      },
      {
        "id": "gear",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          8,
          4,
          11
        ]
      },
      {
        "id": "store",
        "min": [
          2,
          1,
          12
        ],
        "max": [
          13,
          4,
          16
        ]
      },
      {
        "id": "sleep",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          13,
          4,
          21
        ]
      }
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          5
        ],
        "from": "main",
        "to": "gear"
      },
      {
        "at": [
          5,
          1,
          11
        ],
        "from": "gear",
        "to": "store"
      },
      {
        "at": [
          6,
          1,
          16
        ],
        "from": "store",
        "to": "sleep"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        20,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        22,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 13,
        "z": 5,
        "room": "main",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "gear",
        "asset": "pack4:058"
      },
      {
        "x": 5,
        "z": 14,
        "room": "store",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 18,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-winter-hall",
        "rect": [
          0,
          0,
          23,
          11
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-snow-nook",
        "rect": [
          0,
          12,
          13,
          22
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      19
    ],
    "detail": "snow-lodge-with-private-gear-buffer-before-back-cabins"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "medium",
    "index": 9,
    "title": "Icefern Split-Notch Timberhall",
    "w": 30,
    "d": 29,
    "plan": "snow-central-longhouse-with-opposing-bent-cavities-and-dual-homes",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        14,
        10,
        28
      ],
      [
        24,
        20,
        29,
        28
      ]
    ],
    "segments": [
      [
        12,
        11,
        27,
        11
      ],
      [
        18,
        12,
        18,
        26
      ],
      [
        12,
        19,
        17,
        19
      ],
      [
        19,
        19,
        23,
        19
      ]
    ],
    "entry": [
      16,
      1,
      "great"
    ],
    "rooms": [
      {
        "id": "great",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          28,
          4,
          11
        ]
      },
      {
        "id": "west",
        "min": [
          12,
          1,
          12
        ],
        "max": [
          18,
          4,
          19
        ]
      },
      {
        "id": "west-bed",
        "min": [
          12,
          1,
          20
        ],
        "max": [
          18,
          4,
          27
        ]
      },
      {
        "id": "east",
        "min": [
          19,
          1,
          12
        ],
        "max": [
          24,
          4,
          19
        ]
      },
      {
        "id": "east-bed",
        "min": [
          19,
          1,
          20
        ],
        "max": [
          24,
          4,
          27
        ]
      }
    ],
    "doors": [
      {
        "at": [
          15,
          1,
          11
        ],
        "from": "great",
        "to": "west"
      },
      {
        "at": [
          21,
          1,
          11
        ],
        "from": "great",
        "to": "east"
      },
      {
        "at": [
          15,
          1,
          19
        ],
        "from": "west",
        "to": "west-bed"
      },
      {
        "at": [
          21,
          1,
          19
        ],
        "from": "east",
        "to": "east-bed"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        26,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        28,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 16,
        "z": 5,
        "room": "great",
        "asset": "pack4:064"
      },
      {
        "x": 15,
        "z": 15,
        "room": "west",
        "asset": "pack4:057"
      },
      {
        "x": 14,
        "z": 22,
        "room": "west-bed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 16,
        "room": "east",
        "asset": "pack4:058"
      },
      {
        "x": 20,
        "z": 22,
        "room": "east-bed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "snowframed-lodge",
        "rect": [
          0,
          0,
          29,
          11
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "split-gables",
        "rect": [
          11,
          12,
          24,
          28
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      25
    ],
    "detail": "snow-central-longhouse-with-opposing-bent-cavities-and-dual-homes"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "large",
    "index": 8,
    "title": "Northstar Seven-Buffer Winterhold",
    "w": 39,
    "d": 34,
    "plan": "seven-room-snow-u-bastion-with-stove-vestibule-and-icecourt",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        15,
        12,
        25,
        33
      ]
    ],
    "segments": [
      [
        8,
        2,
        8,
        10
      ],
      [
        2,
        11,
        14,
        11
      ],
      [
        26,
        11,
        36,
        11
      ],
      [
        2,
        20,
        14,
        20
      ],
      [
        26,
        18,
        36,
        18
      ],
      [
        26,
        26,
        36,
        26
      ]
    ],
    "entry": [
      19,
      1,
      "great"
    ],
    "rooms": [
      {
        "id": "great",
        "min": [
          9,
          1,
          2
        ],
        "max": [
          37,
          4,
          11
        ]
      },
      {
        "id": "gear",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          8,
          4,
          11
        ]
      },
      {
        "id": "west-guest",
        "min": [
          2,
          1,
          12
        ],
        "max": [
          14,
          4,
          20
        ]
      },
      {
        "id": "west-bed",
        "min": [
          2,
          1,
          21
        ],
        "max": [
          14,
          4,
          32
        ]
      },
      {
        "id": "east-kitchen",
        "min": [
          27,
          1,
          12
        ],
        "max": [
          37,
          4,
          18
        ]
      },
      {
        "id": "east-dining",
        "min": [
          27,
          1,
          19
        ],
        "max": [
          37,
          4,
          26
        ]
      },
      {
        "id": "east-bed",
        "min": [
          27,
          1,
          27
        ],
        "max": [
          37,
          4,
          32
        ]
      }
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          5
        ],
        "from": "great",
        "to": "gear"
      },
      {
        "at": [
          5,
          1,
          11
        ],
        "from": "gear",
        "to": "west-guest"
      },
      {
        "at": [
          32,
          1,
          11
        ],
        "from": "great",
        "to": "east-kitchen"
      },
      {
        "at": [
          5,
          1,
          20
        ],
        "from": "west-guest",
        "to": "west-bed"
      },
      {
        "at": [
          32,
          1,
          18
        ],
        "from": "east-kitchen",
        "to": "east-dining"
      },
      {
        "at": [
          32,
          1,
          26
        ],
        "from": "east-dining",
        "to": "east-bed"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        35,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        37,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 19,
        "z": 5,
        "room": "great",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "gear",
        "asset": "pack4:058"
      },
      {
        "x": 5,
        "z": 15,
        "room": "west-guest",
        "asset": "pack4:059"
      },
      {
        "x": 4,
        "z": 25,
        "room": "west-bed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 31,
        "z": 15,
        "room": "east-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 31,
        "z": 22,
        "room": "east-dining",
        "asset": "pack5:084"
      },
      {
        "x": 30,
        "z": 28,
        "room": "east-bed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "grand-winter-bastion",
        "rect": [
          0,
          0,
          38,
          11
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "west-windbreak",
        "rect": [
          0,
          12,
          14,
          33
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "east-icelight",
        "rect": [
          26,
          12,
          38,
          33
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      4,
      34
    ],
    "detail": "seven-room-snow-u-bastion-with-stove-vestibule-and-icecourt"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 7,
    "title": "Glowmoss Twin-Void Bower",
    "w": 23,
    "d": 25,
    "plan": "forest-bower-with-dual-open-forest-niches-and-narrow-center-rooms",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        12,
        7,
        24
      ],
      [
        16,
        15,
        22,
        24
      ]
    ],
    "segments": [
      [
        6,
        2,
        6,
        9
      ],
      [
        8,
        10,
        15,
        10
      ],
      [
        8,
        17,
        15,
        17
      ]
    ],
    "entry": [
      11,
      1,
      "bower"
    ],
    "rooms": [
      {
        "id": "bower",
        "min": [
          7,
          1,
          2
        ],
        "max": [
          21,
          4,
          10
        ]
      },
      {
        "id": "study",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          6,
          4,
          10
        ]
      },
      {
        "id": "herbal",
        "min": [
          8,
          1,
          11
        ],
        "max": [
          16,
          4,
          17
        ]
      },
      {
        "id": "sleep",
        "min": [
          8,
          1,
          18
        ],
        "max": [
          16,
          4,
          23
        ]
      }
    ],
    "doors": [
      {
        "at": [
          6,
          1,
          5
        ],
        "from": "bower",
        "to": "study"
      },
      {
        "at": [
          11,
          1,
          10
        ],
        "from": "bower",
        "to": "herbal"
      },
      {
        "at": [
          11,
          1,
          17
        ],
        "from": "herbal",
        "to": "sleep"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        19,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        21,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 11,
        "z": 5,
        "room": "bower",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 6,
        "room": "study",
        "asset": "pack5:084"
      },
      {
        "x": 11,
        "z": 13,
        "room": "herbal",
        "asset": "pack4:057"
      },
      {
        "x": 10,
        "z": 19,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "forest-lantern-porch",
        "rect": [
          0,
          0,
          22,
          10
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "rear-tree-spine",
        "rect": [
          8,
          11,
          15,
          24
        ],
        "style": "double-hill",
        "raise": 1
      }
    ],
    "posts": [
      4,
      18
    ],
    "detail": "forest-bower-with-dual-open-forest-niches-and-narrow-center-rooms"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 8,
    "title": "Moonfern Angled Herb Conservatory",
    "w": 30,
    "d": 28,
    "plan": "enchanted-fernhouse-with-rotated-herb-wings-and-east-open-garden",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        20,
        13,
        29,
        27
      ]
    ],
    "segments": [
      [
        2,
        10,
        19,
        10
      ],
      [
        9,
        11,
        9,
        25
      ],
      [
        2,
        19,
        8,
        19
      ],
      [
        10,
        18,
        19,
        18
      ]
    ],
    "entry": [
      15,
      1,
      "gathering"
    ],
    "rooms": [
      {
        "id": "gathering",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          28,
          4,
          10
        ]
      },
      {
        "id": "west-herbal",
        "min": [
          2,
          1,
          11
        ],
        "max": [
          9,
          4,
          19
        ]
      },
      {
        "id": "west-bed",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          9,
          4,
          26
        ]
      },
      {
        "id": "center-bower",
        "min": [
          10,
          1,
          11
        ],
        "max": [
          20,
          4,
          18
        ]
      },
      {
        "id": "center-library",
        "min": [
          10,
          1,
          19
        ],
        "max": [
          20,
          4,
          26
        ]
      }
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          10
        ],
        "from": "gathering",
        "to": "west-herbal"
      },
      {
        "at": [
          14,
          1,
          10
        ],
        "from": "gathering",
        "to": "center-bower"
      },
      {
        "at": [
          5,
          1,
          19
        ],
        "from": "west-herbal",
        "to": "west-bed"
      },
      {
        "at": [
          14,
          1,
          18
        ],
        "from": "center-bower",
        "to": "center-library"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        26,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        28,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 15,
        "z": 5,
        "room": "gathering",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 14,
        "room": "west-herbal",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 22,
        "room": "west-bed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 14,
        "z": 14,
        "room": "center-bower",
        "asset": "pack4:058"
      },
      {
        "x": 14,
        "z": 22,
        "room": "center-library",
        "asset": "pack5:084"
      }
    ],
    "roofWings": [
      {
        "name": "front-lantern-beams",
        "rect": [
          0,
          0,
          29,
          10
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "west-moss-nook",
        "rect": [
          0,
          11,
          9,
          27
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "center-herb-ridge",
        "rect": [
          10,
          11,
          20,
          27
        ],
        "style": "long-gable",
        "raise": 1
      }
    ],
    "posts": [
      4,
      25
    ],
    "detail": "enchanted-fernhouse-with-rotated-herb-wings-and-east-open-garden"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 8,
    "title": "Starlace Eight-Branch Moonhall",
    "w": 39,
    "d": 35,
    "plan": "enchanted-eight-room-forest-cloister-structured-around-open-starlight-garden",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        15,
        13,
        24,
        34
      ]
    ],
    "segments": [
      [
        10,
        2,
        10,
        11
      ],
      [
        2,
        12,
        14,
        12
      ],
      [
        25,
        12,
        36,
        12
      ],
      [
        2,
        20,
        14,
        20
      ],
      [
        2,
        27,
        14,
        27
      ],
      [
        25,
        19,
        36,
        19
      ],
      [
        25,
        28,
        36,
        28
      ]
    ],
    "entry": [
      19,
      1,
      "hall"
    ],
    "rooms": [
      {
        "id": "hall",
        "min": [
          11,
          1,
          2
        ],
        "max": [
          37,
          4,
          12
        ]
      },
      {
        "id": "front-studio",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          10,
          4,
          12
        ]
      },
      {
        "id": "west-bower",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          15,
          4,
          20
        ]
      },
      {
        "id": "west-sleep",
        "min": [
          2,
          1,
          21
        ],
        "max": [
          15,
          4,
          27
        ]
      },
      {
        "id": "west-archive",
        "min": [
          2,
          1,
          28
        ],
        "max": [
          15,
          4,
          33
        ]
      },
      {
        "id": "east-kitchen",
        "min": [
          26,
          1,
          13
        ],
        "max": [
          37,
          4,
          19
        ]
      },
      {
        "id": "east-music",
        "min": [
          26,
          1,
          20
        ],
        "max": [
          37,
          4,
          28
        ]
      },
      {
        "id": "east-sleep",
        "min": [
          26,
          1,
          29
        ],
        "max": [
          37,
          4,
          33
        ]
      }
    ],
    "doors": [
      {
        "at": [
          10,
          1,
          5
        ],
        "from": "hall",
        "to": "front-studio"
      },
      {
        "at": [
          5,
          1,
          12
        ],
        "from": "front-studio",
        "to": "west-bower"
      },
      {
        "at": [
          31,
          1,
          12
        ],
        "from": "hall",
        "to": "east-kitchen"
      },
      {
        "at": [
          6,
          1,
          20
        ],
        "from": "west-bower",
        "to": "west-sleep"
      },
      {
        "at": [
          6,
          1,
          27
        ],
        "from": "west-sleep",
        "to": "west-archive"
      },
      {
        "at": [
          31,
          1,
          19
        ],
        "from": "east-kitchen",
        "to": "east-music"
      },
      {
        "at": [
          31,
          1,
          28
        ],
        "from": "east-music",
        "to": "east-sleep"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        35,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        37,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 19,
        "z": 5,
        "room": "hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "front-studio",
        "asset": "pack5:084"
      },
      {
        "x": 5,
        "z": 15,
        "room": "west-bower",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 23,
        "room": "west-sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 5,
        "z": 30,
        "room": "west-archive",
        "asset": "pack5:084"
      },
      {
        "x": 31,
        "z": 16,
        "room": "east-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 30,
        "z": 23,
        "room": "east-music",
        "asset": "pack4:059"
      },
      {
        "x": 29,
        "z": 30,
        "room": "east-sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "north-moonbeam",
        "rect": [
          0,
          0,
          38,
          12
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "western-canopy-arches",
        "rect": [
          0,
          13,
          14,
          34
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-arcane-cloister",
        "rect": [
          25,
          13,
          38,
          34
        ],
        "style": "long-gable",
        "raise": 1
      }
    ],
    "posts": [
      4,
      34
    ],
    "detail": "enchanted-eight-room-forest-cloister-structured-around-open-starlight-garden"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "small",
    "index": 7,
    "title": "Cairnfox Split-Ridge Hut",
    "w": 25,
    "d": 24,
    "plan": "mountain-rockhouse-with-open-west-ledge-and-east-warm-bed-branch",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        12,
        10,
        23
      ]
    ],
    "segments": [
      [
        7,
        2,
        7,
        10
      ],
      [
        11,
        11,
        22,
        11
      ],
      [
        16,
        12,
        16,
        21
      ]
    ],
    "entry": [
      13,
      1,
      "main"
    ],
    "rooms": [
      {
        "id": "main",
        "min": [
          8,
          1,
          2
        ],
        "max": [
          23,
          4,
          11
        ]
      },
      {
        "id": "stone-studio",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          7,
          4,
          11
        ]
      },
      {
        "id": "cook",
        "min": [
          11,
          1,
          12
        ],
        "max": [
          16,
          4,
          22
        ]
      },
      {
        "id": "sleep",
        "min": [
          17,
          1,
          12
        ],
        "max": [
          23,
          4,
          22
        ]
      }
    ],
    "doors": [
      {
        "at": [
          7,
          1,
          5
        ],
        "from": "main",
        "to": "stone-studio"
      },
      {
        "at": [
          13,
          1,
          11
        ],
        "from": "main",
        "to": "cook"
      },
      {
        "at": [
          19,
          1,
          11
        ],
        "from": "main",
        "to": "sleep"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        21,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        23,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 13,
        "z": 5,
        "room": "main",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 6,
        "room": "stone-studio",
        "asset": "pack5:084"
      },
      {
        "x": 12,
        "z": 17,
        "room": "cook",
        "asset": "pack4:057"
      },
      {
        "x": 19,
        "z": 17,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-slate-shoulder",
        "rect": [
          0,
          0,
          24,
          11
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-eastern-ridge",
        "rect": [
          11,
          12,
          24,
          23
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      20
    ],
    "detail": "mountain-rockhouse-with-open-west-ledge-and-east-warm-bed-branch"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "medium",
    "index": 8,
    "title": "Basalt Double-Gorge Residence",
    "w": 32,
    "d": 29,
    "plan": "mountain-broken-basalt-gorge-with-central-sleep-and-rear-service-halls",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        12,
        11,
        28
      ],
      [
        25,
        16,
        31,
        28
      ]
    ],
    "segments": [
      [
        8,
        2,
        8,
        10
      ],
      [
        12,
        11,
        24,
        11
      ],
      [
        18,
        12,
        18,
        26
      ],
      [
        12,
        20,
        17,
        20
      ],
      [
        19,
        20,
        24,
        20
      ]
    ],
    "entry": [
      17,
      1,
      "great"
    ],
    "rooms": [
      {
        "id": "great",
        "min": [
          9,
          1,
          2
        ],
        "max": [
          30,
          4,
          11
        ]
      },
      {
        "id": "smith",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          8,
          4,
          11
        ]
      },
      {
        "id": "west-hearth",
        "min": [
          12,
          1,
          12
        ],
        "max": [
          18,
          4,
          20
        ]
      },
      {
        "id": "west-sleep",
        "min": [
          12,
          1,
          21
        ],
        "max": [
          18,
          4,
          27
        ]
      },
      {
        "id": "east-service",
        "min": [
          19,
          1,
          12
        ],
        "max": [
          25,
          4,
          20
        ]
      },
      {
        "id": "east-store",
        "min": [
          19,
          1,
          21
        ],
        "max": [
          25,
          4,
          27
        ]
      }
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          5
        ],
        "from": "great",
        "to": "smith"
      },
      {
        "at": [
          15,
          1,
          11
        ],
        "from": "great",
        "to": "west-hearth"
      },
      {
        "at": [
          22,
          1,
          11
        ],
        "from": "great",
        "to": "east-service"
      },
      {
        "at": [
          15,
          1,
          20
        ],
        "from": "west-hearth",
        "to": "west-sleep"
      },
      {
        "at": [
          22,
          1,
          20
        ],
        "from": "east-service",
        "to": "east-store"
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
        5,
        "west"
      ],
      [
        30,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 17,
        "z": 5,
        "room": "great",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "smith",
        "asset": "pack4:058"
      },
      {
        "x": 15,
        "z": 15,
        "room": "west-hearth",
        "asset": "pack4:057"
      },
      {
        "x": 13,
        "z": 23,
        "room": "west-sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 22,
        "z": 16,
        "room": "east-service",
        "asset": "pack4:059"
      },
      {
        "x": 22,
        "z": 23,
        "room": "east-store",
        "asset": "pack5:084"
      }
    ],
    "roofWings": [
      {
        "name": "front-granite-gate",
        "rect": [
          0,
          0,
          31,
          11
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "twin-rear-stone-crests",
        "rect": [
          12,
          12,
          24,
          28
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      27
    ],
    "detail": "mountain-broken-basalt-gorge-with-central-sleep-and-rear-service-halls"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 9,
    "title": "Skycairn Twin-Crest Bastionhome",
    "w": 40,
    "d": 36,
    "plan": "mountain-two-shoulder-absent-bastion-with-central-rear-archive",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        16,
        12,
        35
      ],
      [
        28,
        12,
        39,
        35
      ]
    ],
    "segments": [
      [
        9,
        2,
        9,
        10
      ],
      [
        13,
        11,
        27,
        11
      ],
      [
        20,
        12,
        20,
        33
      ],
      [
        13,
        21,
        19,
        21
      ],
      [
        21,
        23,
        27,
        23
      ]
    ],
    "entry": [
      19,
      1,
      "great"
    ],
    "rooms": [
      {
        "id": "great",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          38,
          4,
          11
        ]
      },
      {
        "id": "front-store",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          9,
          4,
          11
        ]
      },
      {
        "id": "west-gallery",
        "min": [
          13,
          1,
          12
        ],
        "max": [
          20,
          4,
          21
        ]
      },
      {
        "id": "west-sleep",
        "min": [
          13,
          1,
          22
        ],
        "max": [
          20,
          4,
          34
        ]
      },
      {
        "id": "east-work",
        "min": [
          21,
          1,
          12
        ],
        "max": [
          28,
          4,
          23
        ]
      },
      {
        "id": "east-archive",
        "min": [
          21,
          1,
          24
        ],
        "max": [
          28,
          4,
          34
        ]
      }
    ],
    "doors": [
      {
        "at": [
          9,
          1,
          5
        ],
        "from": "great",
        "to": "front-store"
      },
      {
        "at": [
          16,
          1,
          11
        ],
        "from": "great",
        "to": "west-gallery"
      },
      {
        "at": [
          24,
          1,
          11
        ],
        "from": "great",
        "to": "east-work"
      },
      {
        "at": [
          16,
          1,
          21
        ],
        "from": "west-gallery",
        "to": "west-sleep"
      },
      {
        "at": [
          24,
          1,
          23
        ],
        "from": "east-work",
        "to": "east-archive"
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
        5,
        "west"
      ],
      [
        38,
        6,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 19,
        "z": 5,
        "room": "great",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "front-store",
        "asset": "pack4:058"
      },
      {
        "x": 16,
        "z": 16,
        "room": "west-gallery",
        "asset": "pack4:057"
      },
      {
        "x": 15,
        "z": 25,
        "room": "west-sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 17,
        "room": "east-work",
        "asset": "pack4:059"
      },
      {
        "x": 24,
        "z": 28,
        "room": "east-archive",
        "asset": "pack5:084"
      }
    ],
    "roofWings": [
      {
        "name": "northern-cairn-longhouse",
        "rect": [
          0,
          0,
          39,
          11
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "split-mountain-pinnacles",
        "rect": [
          13,
          12,
          27,
          35
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      35
    ],
    "detail": "mountain-two-shoulder-absent-bastion-with-central-rear-archive"
  }
]);
export const M2_HOUSING_WAVE6_IDS=Object.freeze(SPECS.map(x=>'r1:house:'+x.biome+':'+x.size+':'+String(x.index).padStart(3,'0')));
export function getM2HousingWave6(){return SPECS.map(compileM2ArchitecturalSpec);}
