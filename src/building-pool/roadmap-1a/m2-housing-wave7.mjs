// Builder 1A M2 wave7: Fifteen unique coordinate-authored nonrectangular domestic architecture specimens.
// Every wall, door, room, roof wing, literal exterior void, and physical fixture is an authored local-grid source object.
// Candidate-only; do not register, integrate, merge or world-place.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "temperate",
    "size": "small",
    "index": 8,
    "title": "Brackenford Offset Trestle House",
    "w": 27,
    "d": 25,
    "plan": "T-rested-willow-foyer-and-deep-single-bed-aisle",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        15,
        7,
        24
      ],
      [
        20,
        12,
        26,
        24
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
        9,
        11,
        19,
        11
      ],
      [
        9,
        18,
        19,
        18
      ]
    ],
    "entry": [
      15,
      1,
      "foyer"
    ],
    "rooms": [
      {
        "id": "foyer",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          25,
          4,
          11
        ]
      },
      {
        "id": "workshop",
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
        "id": "commons",
        "min": [
          9,
          1,
          12
        ],
        "max": [
          20,
          4,
          18
        ]
      },
      {
        "id": "bedchamber",
        "min": [
          9,
          1,
          19
        ],
        "max": [
          20,
          4,
          23
        ]
      }
    ],
    "doors": [
      {
        "at": [
          9,
          1,
          6
        ],
        "from": "foyer",
        "to": "workshop"
      },
      {
        "at": [
          14,
          1,
          11
        ],
        "from": "foyer",
        "to": "commons"
      },
      {
        "at": [
          15,
          1,
          18
        ],
        "from": "commons",
        "to": "bedchamber"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        23,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        25,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 15,
        "z": 5,
        "room": "foyer",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "workshop",
        "asset": "pack5:084"
      },
      {
        "x": 11,
        "z": 15,
        "room": "commons",
        "asset": "pack4:057"
      },
      {
        "x": 12,
        "z": 20,
        "room": "bedchamber",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "trestle-front",
        "rect": [
          0,
          0,
          26,
          11
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "narrow-back-spine",
        "rect": [
          8,
          12,
          19,
          24
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      22
    ],
    "detail": "T-rested-willow-foyer-and-deep-single-bed-aisle"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "medium",
    "index": 9,
    "title": "Wynfield Split Orchard Residence",
    "w": 32,
    "d": 29,
    "plan": "orchard-hall-split-west-guest-and-sunrise-pantry-U",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        13,
        14,
        19,
        28
      ]
    ],
    "segments": [
      [
        10,
        2,
        10,
        12
      ],
      [
        2,
        13,
        12,
        13
      ],
      [
        20,
        13,
        29,
        13
      ],
      [
        2,
        21,
        12,
        21
      ],
      [
        20,
        19,
        29,
        19
      ]
    ],
    "entry": [
      16,
      1,
      "grandhall"
    ],
    "rooms": [
      {
        "id": "grandhall",
        "min": [
          11,
          1,
          2
        ],
        "max": [
          30,
          4,
          13
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
          10,
          4,
          13
        ]
      },
      {
        "id": "western",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          13,
          4,
          21
        ]
      },
      {
        "id": "guest",
        "min": [
          2,
          1,
          22
        ],
        "max": [
          13,
          4,
          27
        ]
      },
      {
        "id": "kitchen",
        "min": [
          21,
          1,
          14
        ],
        "max": [
          30,
          4,
          19
        ]
      },
      {
        "id": "pantry",
        "min": [
          21,
          1,
          20
        ],
        "max": [
          30,
          4,
          27
        ]
      }
    ],
    "doors": [
      {
        "at": [
          10,
          1,
          6
        ],
        "from": "grandhall",
        "to": "studio"
      },
      {
        "at": [
          6,
          1,
          13
        ],
        "from": "studio",
        "to": "western"
      },
      {
        "at": [
          25,
          1,
          13
        ],
        "from": "grandhall",
        "to": "kitchen"
      },
      {
        "at": [
          6,
          1,
          21
        ],
        "from": "western",
        "to": "guest"
      },
      {
        "at": [
          25,
          1,
          19
        ],
        "from": "kitchen",
        "to": "pantry"
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
        6,
        "west"
      ],
      [
        30,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 16,
        "z": 6,
        "room": "grandhall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 6,
        "room": "studio",
        "asset": "pack5:084"
      },
      {
        "x": 4,
        "z": 17,
        "room": "western",
        "asset": "pack4:059"
      },
      {
        "x": 4,
        "z": 24,
        "room": "guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 25,
        "z": 16,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 25,
        "z": 22,
        "room": "pantry",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "front-gable",
        "rect": [
          0,
          0,
          31,
          13
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "west-apple-wing",
        "rect": [
          0,
          14,
          12,
          28
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-orchard-wing",
        "rect": [
          20,
          14,
          31,
          28
        ],
        "style": "double-hill",
        "raise": 1
      }
    ],
    "posts": [
      4,
      27
    ],
    "detail": "orchard-hall-split-west-guest-and-sunrise-pantry-U"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "large",
    "index": 9,
    "title": "Oldwater Ledgerhall Manor",
    "w": 41,
    "d": 35,
    "plan": "riverwide-front-ledger-and-split-rear-manor-open-west-escarpment",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        16,
        16,
        34
      ]
    ],
    "segments": [
      [
        10,
        2,
        10,
        14
      ],
      [
        17,
        15,
        38,
        15
      ],
      [
        28,
        16,
        28,
        32
      ],
      [
        17,
        25,
        27,
        25
      ],
      [
        29,
        23,
        38,
        23
      ]
    ],
    "entry": [
      19,
      1,
      "front"
    ],
    "rooms": [
      {
        "id": "front",
        "min": [
          11,
          1,
          2
        ],
        "max": [
          39,
          4,
          15
        ]
      },
      {
        "id": "ledger",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          10,
          4,
          15
        ]
      },
      {
        "id": "west",
        "min": [
          17,
          1,
          16
        ],
        "max": [
          28,
          4,
          25
        ]
      },
      {
        "id": "bedroom",
        "min": [
          17,
          1,
          26
        ],
        "max": [
          28,
          4,
          33
        ]
      },
      {
        "id": "service",
        "min": [
          29,
          1,
          16
        ],
        "max": [
          39,
          4,
          23
        ]
      },
      {
        "id": "library",
        "min": [
          29,
          1,
          24
        ],
        "max": [
          39,
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
        "from": "front",
        "to": "ledger"
      },
      {
        "at": [
          22,
          1,
          15
        ],
        "from": "front",
        "to": "west"
      },
      {
        "at": [
          33,
          1,
          15
        ],
        "from": "front",
        "to": "service"
      },
      {
        "at": [
          22,
          1,
          25
        ],
        "from": "west",
        "to": "bedroom"
      },
      {
        "at": [
          33,
          1,
          23
        ],
        "from": "service",
        "to": "library"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        37,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        39,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 19,
        "z": 5,
        "room": "front",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 6,
        "room": "ledger",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 18,
        "room": "west",
        "asset": "pack4:058"
      },
      {
        "x": 20,
        "z": 28,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 32,
        "z": 19,
        "room": "service",
        "asset": "pack4:057"
      },
      {
        "x": 32,
        "z": 28,
        "room": "library",
        "asset": "pack5:084"
      }
    ],
    "roofWings": [
      {
        "name": "oldwater-longhouse",
        "rect": [
          0,
          0,
          40,
          15
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "garden-left",
        "rect": [
          17,
          16,
          28,
          34
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "archive-right",
        "rect": [
          29,
          16,
          40,
          34
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      4,
      36
    ],
    "detail": "riverwide-front-ledger-and-split-rear-manor-open-west-escarpment"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "small",
    "index": 9,
    "title": "Dunebloom Eastern Shade Court",
    "w": 23,
    "d": 23,
    "plan": "desert-eastwest-garden-court-with-staggered-private-sleeping-wing",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        9,
        13,
        13,
        22
      ]
    ],
    "segments": [
      [
        2,
        12,
        8,
        12
      ],
      [
        14,
        12,
        20,
        12
      ],
      [
        2,
        17,
        8,
        17
      ]
    ],
    "entry": [
      11,
      1,
      "sunsalon"
    ],
    "rooms": [
      {
        "id": "sunsalon",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          21,
          4,
          12
        ]
      },
      {
        "id": "westcook",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          9,
          4,
          17
        ]
      },
      {
        "id": "rest",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          9,
          4,
          21
        ]
      },
      {
        "id": "eaststore",
        "min": [
          14,
          1,
          13
        ],
        "max": [
          21,
          4,
          21
        ]
      }
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          12
        ],
        "from": "sunsalon",
        "to": "westcook"
      },
      {
        "at": [
          17,
          1,
          12
        ],
        "from": "sunsalon",
        "to": "eaststore"
      },
      {
        "at": [
          5,
          1,
          17
        ],
        "from": "westcook",
        "to": "rest"
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
        6,
        "west"
      ],
      [
        21,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 11,
        "z": 5,
        "room": "sunsalon",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 14,
        "room": "westcook",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 19,
        "room": "rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 17,
        "z": 16,
        "room": "eaststore",
        "asset": "pack5:084"
      }
    ],
    "roofWings": [
      {
        "name": "sun-baffle",
        "rect": [
          0,
          0,
          22,
          12
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "western-arcade",
        "rect": [
          0,
          13,
          9,
          22
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "eastern-pavilion",
        "rect": [
          14,
          13,
          22,
          22
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      18
    ],
    "detail": "desert-eastwest-garden-court-with-staggered-private-sleeping-wing"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "medium",
    "index": 9,
    "title": "Qara Passage Caravan House",
    "w": 31,
    "d": 28,
    "plan": "sand-caravan-dual-rear-vacancies-with-split-post-road-sleeping-gallery",
    "roof": "sawtooth",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        13,
        8,
        27
      ],
      [
        24,
        19,
        30,
        27
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
        9,
        12,
        23,
        12
      ],
      [
        17,
        13,
        17,
        25
      ],
      [
        9,
        20,
        16,
        20
      ]
    ],
    "entry": [
      17,
      1,
      "front"
    ],
    "rooms": [
      {
        "id": "front",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          29,
          4,
          12
        ]
      },
      {
        "id": "merchant",
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
        "id": "supply",
        "min": [
          9,
          1,
          13
        ],
        "max": [
          17,
          4,
          20
        ]
      },
      {
        "id": "rest",
        "min": [
          9,
          1,
          21
        ],
        "max": [
          17,
          4,
          26
        ]
      },
      {
        "id": "courier",
        "min": [
          18,
          1,
          13
        ],
        "max": [
          24,
          4,
          26
        ]
      }
    ],
    "doors": [
      {
        "at": [
          9,
          1,
          6
        ],
        "from": "front",
        "to": "merchant"
      },
      {
        "at": [
          13,
          1,
          12
        ],
        "from": "front",
        "to": "supply"
      },
      {
        "at": [
          21,
          1,
          12
        ],
        "from": "front",
        "to": "courier"
      },
      {
        "at": [
          13,
          1,
          20
        ],
        "from": "supply",
        "to": "rest"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        27,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        29,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 17,
        "z": 5,
        "room": "front",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 6,
        "room": "merchant",
        "asset": "pack5:084"
      },
      {
        "x": 12,
        "z": 16,
        "room": "supply",
        "asset": "pack4:057"
      },
      {
        "x": 11,
        "z": 23,
        "room": "rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 20,
        "z": 16,
        "room": "courier",
        "asset": "pack4:059"
      }
    ],
    "roofWings": [
      {
        "name": "caravan-front",
        "rect": [
          0,
          0,
          30,
          12
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-supply-vault",
        "rect": [
          9,
          13,
          23,
          27
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      26
    ],
    "detail": "sand-caravan-dual-rear-vacancies-with-split-post-road-sleeping-gallery"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "large",
    "index": 9,
    "title": "Tamarind Reflecting Court Palace",
    "w": 42,
    "d": 35,
    "plan": "sunken-tamarind-court-with-ledger-front-and-west-family-lodgings",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        17,
        15,
        25,
        34
      ]
    ],
    "segments": [
      [
        12,
        2,
        12,
        13
      ],
      [
        2,
        14,
        16,
        14
      ],
      [
        26,
        14,
        39,
        14
      ],
      [
        2,
        23,
        16,
        23
      ],
      [
        26,
        22,
        39,
        22
      ]
    ],
    "entry": [
      20,
      1,
      "reception"
    ],
    "rooms": [
      {
        "id": "reception",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          40,
          4,
          14
        ]
      },
      {
        "id": "recordroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          12,
          4,
          14
        ]
      },
      {
        "id": "westhearth",
        "min": [
          2,
          1,
          15
        ],
        "max": [
          17,
          4,
          23
        ]
      },
      {
        "id": "westbed",
        "min": [
          2,
          1,
          24
        ],
        "max": [
          17,
          4,
          33
        ]
      },
      {
        "id": "eastsalon",
        "min": [
          26,
          1,
          15
        ],
        "max": [
          40,
          4,
          22
        ]
      },
      {
        "id": "eaststore",
        "min": [
          26,
          1,
          23
        ],
        "max": [
          40,
          4,
          33
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
        "from": "reception",
        "to": "recordroom"
      },
      {
        "at": [
          6,
          1,
          14
        ],
        "from": "recordroom",
        "to": "westhearth"
      },
      {
        "at": [
          32,
          1,
          14
        ],
        "from": "reception",
        "to": "eastsalon"
      },
      {
        "at": [
          6,
          1,
          23
        ],
        "from": "westhearth",
        "to": "westbed"
      },
      {
        "at": [
          32,
          1,
          22
        ],
        "from": "eastsalon",
        "to": "eaststore"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        38,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        40,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 20,
        "z": 5,
        "room": "reception",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 6,
        "room": "recordroom",
        "asset": "pack5:084"
      },
      {
        "x": 5,
        "z": 17,
        "room": "westhearth",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 26,
        "room": "westbed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 32,
        "z": 17,
        "room": "eastsalon",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 26,
        "room": "eaststore",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "solar-front-gate",
        "rect": [
          0,
          0,
          41,
          14
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "western-palatial-rooms",
        "rect": [
          0,
          15,
          16,
          34
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "eastern-trellis",
        "rect": [
          26,
          15,
          41,
          34
        ],
        "style": "double-hill",
        "raise": 1
      }
    ],
    "posts": [
      4,
      37
    ],
    "detail": "sunken-tamarind-court-with-ledger-front-and-west-family-lodgings"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "small",
    "index": 8,
    "title": "Hailpine Gear-Chimney Home",
    "w": 26,
    "d": 24,
    "plan": "four-room-snow-gearchamber-with-private-deep-left-sleep-and-store",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        17,
        14,
        25,
        23
      ]
    ],
    "segments": [
      [
        9,
        2,
        9,
        12
      ],
      [
        2,
        13,
        16,
        13
      ],
      [
        9,
        14,
        9,
        21
      ]
    ],
    "entry": [
      13,
      1,
      "warm"
    ],
    "rooms": [
      {
        "id": "warm",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          24,
          4,
          13
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
          9,
          4,
          13
        ]
      },
      {
        "id": "rest",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          9,
          4,
          22
        ]
      },
      {
        "id": "store",
        "min": [
          10,
          1,
          14
        ],
        "max": [
          17,
          4,
          22
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
        "from": "warm",
        "to": "gear"
      },
      {
        "at": [
          5,
          1,
          13
        ],
        "from": "gear",
        "to": "rest"
      },
      {
        "at": [
          13,
          1,
          13
        ],
        "from": "warm",
        "to": "store"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        22,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        24,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 13,
        "z": 5,
        "room": "warm",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "gear",
        "asset": "pack4:058"
      },
      {
        "x": 4,
        "z": 17,
        "room": "rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 13,
        "z": 18,
        "room": "store",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "north-cold-barrier",
        "rect": [
          0,
          0,
          25,
          13
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-fire-shoulder",
        "rect": [
          0,
          14,
          16,
          23
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      21
    ],
    "detail": "four-room-snow-gearchamber-with-private-deep-left-sleep-and-store"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "medium",
    "index": 10,
    "title": "Snowhaven Two-Wing Smokehouse",
    "w": 33,
    "d": 29,
    "plan": "double-thermal-wing-courtyard-under-wide-snowguard-ridge",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        13,
        16,
        20,
        28
      ]
    ],
    "segments": [
      [
        11,
        2,
        11,
        14
      ],
      [
        2,
        15,
        12,
        15
      ],
      [
        21,
        15,
        30,
        15
      ],
      [
        2,
        22,
        12,
        22
      ],
      [
        21,
        21,
        30,
        21
      ]
    ],
    "entry": [
      17,
      1,
      "hearth"
    ],
    "rooms": [
      {
        "id": "hearth",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          31,
          4,
          15
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
          11,
          4,
          15
        ]
      },
      {
        "id": "westwork",
        "min": [
          2,
          1,
          16
        ],
        "max": [
          13,
          4,
          22
        ]
      },
      {
        "id": "westbed",
        "min": [
          2,
          1,
          23
        ],
        "max": [
          13,
          4,
          27
        ]
      },
      {
        "id": "eastcook",
        "min": [
          21,
          1,
          16
        ],
        "max": [
          31,
          4,
          21
        ]
      },
      {
        "id": "eastbed",
        "min": [
          21,
          1,
          22
        ],
        "max": [
          31,
          4,
          27
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
        "from": "hearth",
        "to": "gear"
      },
      {
        "at": [
          6,
          1,
          15
        ],
        "from": "gear",
        "to": "westwork"
      },
      {
        "at": [
          26,
          1,
          15
        ],
        "from": "hearth",
        "to": "eastcook"
      },
      {
        "at": [
          6,
          1,
          22
        ],
        "from": "westwork",
        "to": "westbed"
      },
      {
        "at": [
          26,
          1,
          21
        ],
        "from": "eastcook",
        "to": "eastbed"
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
        6,
        "west"
      ],
      [
        31,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 17,
        "z": 5,
        "room": "hearth",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 6,
        "room": "gear",
        "asset": "pack4:058"
      },
      {
        "x": 5,
        "z": 18,
        "room": "westwork",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 24,
        "room": "westbed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 25,
        "z": 18,
        "room": "eastcook",
        "asset": "pack4:057"
      },
      {
        "x": 24,
        "z": 24,
        "room": "eastbed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "snowguard-front",
        "rect": [
          0,
          0,
          32,
          15
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "western-sleep-arcade",
        "rect": [
          0,
          16,
          12,
          28
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "eastern-flue",
        "rect": [
          21,
          16,
          32,
          28
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      28
    ],
    "detail": "double-thermal-wing-courtyard-under-wide-snowguard-ridge"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "large",
    "index": 9,
    "title": "Wintermere Bastion Hearth",
    "w": 43,
    "d": 37,
    "plan": "north-snow-gate-with-deep-two-part-bastion-private-bed-arms",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        16,
        14,
        36
      ],
      [
        31,
        20,
        42,
        36
      ]
    ],
    "segments": [
      [
        12,
        2,
        12,
        14
      ],
      [
        15,
        15,
        30,
        15
      ],
      [
        22,
        16,
        22,
        34
      ],
      [
        15,
        25,
        21,
        25
      ],
      [
        23,
        25,
        30,
        25
      ]
    ],
    "entry": [
      20,
      1,
      "grand"
    ],
    "rooms": [
      {
        "id": "grand",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          41,
          4,
          15
        ]
      },
      {
        "id": "wetgear",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          12,
          4,
          15
        ]
      },
      {
        "id": "westhall",
        "min": [
          15,
          1,
          16
        ],
        "max": [
          22,
          4,
          25
        ]
      },
      {
        "id": "westbed",
        "min": [
          15,
          1,
          26
        ],
        "max": [
          22,
          4,
          35
        ]
      },
      {
        "id": "easthall",
        "min": [
          23,
          1,
          16
        ],
        "max": [
          31,
          4,
          25
        ]
      },
      {
        "id": "eastbed",
        "min": [
          23,
          1,
          26
        ],
        "max": [
          31,
          4,
          35
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
        "from": "grand",
        "to": "wetgear"
      },
      {
        "at": [
          18,
          1,
          15
        ],
        "from": "grand",
        "to": "westhall"
      },
      {
        "at": [
          26,
          1,
          15
        ],
        "from": "grand",
        "to": "easthall"
      },
      {
        "at": [
          18,
          1,
          25
        ],
        "from": "westhall",
        "to": "westbed"
      },
      {
        "at": [
          26,
          1,
          25
        ],
        "from": "easthall",
        "to": "eastbed"
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
        6,
        "west"
      ],
      [
        41,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 20,
        "z": 6,
        "room": "grand",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 6,
        "room": "wetgear",
        "asset": "pack4:058"
      },
      {
        "x": 18,
        "z": 20,
        "room": "westhall",
        "asset": "pack4:057"
      },
      {
        "x": 17,
        "z": 29,
        "room": "westbed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 26,
        "z": 20,
        "room": "easthall",
        "asset": "pack4:059"
      },
      {
        "x": 25,
        "z": 29,
        "room": "eastbed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "winter-front-barbican",
        "rect": [
          0,
          0,
          42,
          15
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "inner-furnace-spine",
        "rect": [
          15,
          16,
          30,
          36
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      38
    ],
    "detail": "north-snow-gate-with-deep-two-part-bastion-private-bed-arms"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 8,
    "title": "Lanternbark Hollow Court Cottage",
    "w": 25,
    "d": 27,
    "plan": "arcane-plant-court-and-opposing-craft-bower-with-branching-sleep",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        10,
        13,
        15,
        26
      ]
    ],
    "segments": [
      [
        2,
        12,
        9,
        12
      ],
      [
        16,
        12,
        22,
        12
      ],
      [
        2,
        19,
        9,
        19
      ]
    ],
    "entry": [
      12,
      1,
      "front"
    ],
    "rooms": [
      {
        "id": "front",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          23,
          4,
          12
        ]
      },
      {
        "id": "herbal",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          10,
          4,
          19
        ]
      },
      {
        "id": "bedroom",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          10,
          4,
          25
        ]
      },
      {
        "id": "woven",
        "min": [
          16,
          1,
          13
        ],
        "max": [
          23,
          4,
          25
        ]
      }
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          12
        ],
        "from": "front",
        "to": "herbal"
      },
      {
        "at": [
          19,
          1,
          12
        ],
        "from": "front",
        "to": "woven"
      },
      {
        "at": [
          5,
          1,
          19
        ],
        "from": "herbal",
        "to": "bedroom"
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
        6,
        "west"
      ],
      [
        23,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 12,
        "z": 5,
        "room": "front",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 16,
        "room": "herbal",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 22,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 17,
        "room": "woven",
        "asset": "pack5:084"
      }
    ],
    "roofWings": [
      {
        "name": "glowwood-front",
        "rect": [
          0,
          0,
          24,
          12
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "mossy-west-arch",
        "rect": [
          0,
          13,
          9,
          26
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "dream-east-bower",
        "rect": [
          16,
          13,
          24,
          26
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      20
    ],
    "detail": "arcane-plant-court-and-opposing-craft-bower-with-branching-sleep"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 9,
    "title": "Feybrook Staggered Arbour",
    "w": 34,
    "d": 30,
    "plan": "split-fern-lodges-between-festival-hall-and-open-west-slope",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        15,
        13,
        29
      ]
    ],
    "segments": [
      [
        11,
        2,
        11,
        13
      ],
      [
        14,
        14,
        31,
        14
      ],
      [
        23,
        15,
        23,
        27
      ],
      [
        14,
        22,
        22,
        22
      ]
    ],
    "entry": [
      18,
      1,
      "hall"
    ],
    "rooms": [
      {
        "id": "hall",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          32,
          4,
          14
        ]
      },
      {
        "id": "frontwork",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          11,
          4,
          14
        ]
      },
      {
        "id": "herbs",
        "min": [
          14,
          1,
          15
        ],
        "max": [
          23,
          4,
          22
        ]
      },
      {
        "id": "rest",
        "min": [
          14,
          1,
          23
        ],
        "max": [
          23,
          4,
          28
        ]
      },
      {
        "id": "library",
        "min": [
          24,
          1,
          15
        ],
        "max": [
          32,
          4,
          28
        ]
      }
    ],
    "doors": [
      {
        "at": [
          11,
          1,
          6
        ],
        "from": "hall",
        "to": "frontwork"
      },
      {
        "at": [
          18,
          1,
          14
        ],
        "from": "hall",
        "to": "herbs"
      },
      {
        "at": [
          28,
          1,
          14
        ],
        "from": "hall",
        "to": "library"
      },
      {
        "at": [
          18,
          1,
          22
        ],
        "from": "herbs",
        "to": "rest"
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
        6,
        "west"
      ],
      [
        32,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 18,
        "z": 5,
        "room": "hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 5,
        "room": "frontwork",
        "asset": "pack5:084"
      },
      {
        "x": 18,
        "z": 17,
        "room": "herbs",
        "asset": "pack4:057"
      },
      {
        "x": 17,
        "z": 25,
        "room": "rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 20,
        "room": "library",
        "asset": "pack5:084"
      }
    ],
    "roofWings": [
      {
        "name": "northern-bower",
        "rect": [
          0,
          0,
          33,
          14
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "herbal-rear-arch",
        "rect": [
          14,
          15,
          23,
          29
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "eastern-starlight-library",
        "rect": [
          24,
          15,
          33,
          29
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      29
    ],
    "detail": "split-fern-lodges-between-festival-hall-and-open-west-slope"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 9,
    "title": "Evershade Moonwell Conservatory",
    "w": 44,
    "d": 38,
    "plan": "seven-region-everforest-greenhouse-surrounding-open-northern-moonwell",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        17,
        16,
        27,
        37
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        14
      ],
      [
        2,
        15,
        16,
        15
      ],
      [
        28,
        15,
        41,
        15
      ],
      [
        2,
        23,
        16,
        23
      ],
      [
        2,
        30,
        16,
        30
      ],
      [
        28,
        25,
        41,
        25
      ]
    ],
    "entry": [
      21,
      1,
      "great"
    ],
    "rooms": [
      {
        "id": "great",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          42,
          4,
          15
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
          14,
          4,
          15
        ]
      },
      {
        "id": "westherbs",
        "min": [
          2,
          1,
          16
        ],
        "max": [
          17,
          4,
          23
        ]
      },
      {
        "id": "westbed",
        "min": [
          2,
          1,
          24
        ],
        "max": [
          17,
          4,
          30
        ]
      },
      {
        "id": "weststore",
        "min": [
          2,
          1,
          31
        ],
        "max": [
          17,
          4,
          36
        ]
      },
      {
        "id": "eastcook",
        "min": [
          28,
          1,
          16
        ],
        "max": [
          42,
          4,
          25
        ]
      },
      {
        "id": "eastart",
        "min": [
          28,
          1,
          26
        ],
        "max": [
          42,
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
        "from": "great",
        "to": "study"
      },
      {
        "at": [
          5,
          1,
          15
        ],
        "from": "study",
        "to": "westherbs"
      },
      {
        "at": [
          34,
          1,
          15
        ],
        "from": "great",
        "to": "eastcook"
      },
      {
        "at": [
          5,
          1,
          23
        ],
        "from": "westherbs",
        "to": "westbed"
      },
      {
        "at": [
          5,
          1,
          30
        ],
        "from": "westbed",
        "to": "weststore"
      },
      {
        "at": [
          34,
          1,
          25
        ],
        "from": "eastcook",
        "to": "eastart"
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
        6,
        "west"
      ],
      [
        42,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 21,
        "z": 5,
        "room": "great",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 6,
        "room": "study",
        "asset": "pack5:084"
      },
      {
        "x": 6,
        "z": 18,
        "room": "westherbs",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 26,
        "room": "westbed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 5,
        "z": 33,
        "room": "weststore",
        "asset": "pack4:058"
      },
      {
        "x": 34,
        "z": 19,
        "room": "eastcook",
        "asset": "pack4:057"
      },
      {
        "x": 35,
        "z": 29,
        "room": "eastart",
        "asset": "pack5:084"
      }
    ],
    "roofWings": [
      {
        "name": "great-glow-pavilion",
        "rect": [
          0,
          0,
          43,
          15
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "west-fern-porch",
        "rect": [
          0,
          16,
          16,
          37
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-moon-lights",
        "rect": [
          28,
          16,
          43,
          37
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      4,
      39
    ],
    "detail": "seven-region-everforest-greenhouse-surrounding-open-northern-moonwell"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "small",
    "index": 8,
    "title": "Cindercrag Anvil-Bower Home",
    "w": 27,
    "d": 25,
    "plan": "crag-side-anvil-forge-front-with-narrow-private-central-bed-aisle",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        14,
        9,
        24
      ],
      [
        21,
        17,
        26,
        24
      ]
    ],
    "segments": [
      [
        9,
        2,
        9,
        12
      ],
      [
        10,
        13,
        20,
        13
      ],
      [
        10,
        19,
        20,
        19
      ]
    ],
    "entry": [
      16,
      1,
      "hearth"
    ],
    "rooms": [
      {
        "id": "hearth",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          25,
          4,
          13
        ]
      },
      {
        "id": "forge",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          9,
          4,
          13
        ]
      },
      {
        "id": "stonework",
        "min": [
          10,
          1,
          14
        ],
        "max": [
          21,
          4,
          19
        ]
      },
      {
        "id": "sleep",
        "min": [
          10,
          1,
          20
        ],
        "max": [
          21,
          4,
          23
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
        "from": "hearth",
        "to": "forge"
      },
      {
        "at": [
          15,
          1,
          13
        ],
        "from": "hearth",
        "to": "stonework"
      },
      {
        "at": [
          15,
          1,
          19
        ],
        "from": "stonework",
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
        23,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        25,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 16,
        "z": 5,
        "room": "hearth",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 5,
        "room": "forge",
        "asset": "pack4:058"
      },
      {
        "x": 15,
        "z": 16,
        "room": "stonework",
        "asset": "pack4:057"
      },
      {
        "x": 14,
        "z": 21,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-slate-pavilion",
        "rect": [
          0,
          0,
          26,
          13
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-scree-ridge",
        "rect": [
          10,
          14,
          20,
          24
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      22
    ],
    "detail": "crag-side-anvil-forge-front-with-narrow-private-central-bed-aisle"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "medium",
    "index": 9,
    "title": "Ridgewell Quarrygarden Dwelling",
    "w": 35,
    "d": 31,
    "plan": "stone-quarry-face-archipelago-with-south-open-right-gardens",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        24,
        14,
        34,
        30
      ]
    ],
    "segments": [
      [
        11,
        2,
        11,
        12
      ],
      [
        2,
        13,
        23,
        13
      ],
      [
        13,
        14,
        13,
        28
      ],
      [
        2,
        23,
        12,
        23
      ]
    ],
    "entry": [
      18,
      1,
      "front"
    ],
    "rooms": [
      {
        "id": "front",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          33,
          4,
          13
        ]
      },
      {
        "id": "archive",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          11,
          4,
          13
        ]
      },
      {
        "id": "larder",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          13,
          4,
          23
        ]
      },
      {
        "id": "bedroom",
        "min": [
          2,
          1,
          24
        ],
        "max": [
          13,
          4,
          29
        ]
      },
      {
        "id": "kitchen",
        "min": [
          14,
          1,
          14
        ],
        "max": [
          24,
          4,
          29
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
        "from": "front",
        "to": "archive"
      },
      {
        "at": [
          7,
          1,
          13
        ],
        "from": "archive",
        "to": "larder"
      },
      {
        "at": [
          19,
          1,
          13
        ],
        "from": "front",
        "to": "kitchen"
      },
      {
        "at": [
          7,
          1,
          23
        ],
        "from": "larder",
        "to": "bedroom"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        31,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        33,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 18,
        "z": 5,
        "room": "front",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 6,
        "room": "archive",
        "asset": "pack5:084"
      },
      {
        "x": 6,
        "z": 16,
        "room": "larder",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 26,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 17,
        "room": "kitchen",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "front-stone-ridge",
        "rect": [
          0,
          0,
          34,
          13
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "left-granite-bower",
        "rect": [
          0,
          14,
          13,
          30
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "right-stepped-garden",
        "rect": [
          14,
          14,
          23,
          30
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      4,
      30
    ],
    "detail": "stone-quarry-face-archipelago-with-south-open-right-gardens"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 10,
    "title": "Arbiter's Highcrest Stonecourt",
    "w": 45,
    "d": 39,
    "plan": "peakside-seven-chamber-stonecourt-with-offset-west-innhouse-wing",
    "roof": "courtyard",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        17,
        17,
        26,
        38
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
        2,
        16,
        16,
        16
      ],
      [
        27,
        16,
        42,
        16
      ],
      [
        2,
        25,
        16,
        25
      ],
      [
        27,
        23,
        42,
        23
      ],
      [
        27,
        31,
        42,
        31
      ]
    ],
    "entry": [
      21,
      1,
      "great"
    ],
    "rooms": [
      {
        "id": "great",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          43,
          4,
          16
        ]
      },
      {
        "id": "archive",
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
        "id": "westhearth",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          17,
          4,
          25
        ]
      },
      {
        "id": "westbed",
        "min": [
          2,
          1,
          26
        ],
        "max": [
          17,
          4,
          37
        ]
      },
      {
        "id": "eastwork",
        "min": [
          27,
          1,
          17
        ],
        "max": [
          43,
          4,
          23
        ]
      },
      {
        "id": "eastguest",
        "min": [
          27,
          1,
          24
        ],
        "max": [
          43,
          4,
          31
        ]
      },
      {
        "id": "eaststore",
        "min": [
          27,
          1,
          32
        ],
        "max": [
          43,
          4,
          37
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
        "from": "great",
        "to": "archive"
      },
      {
        "at": [
          6,
          1,
          16
        ],
        "from": "archive",
        "to": "westhearth"
      },
      {
        "at": [
          35,
          1,
          16
        ],
        "from": "great",
        "to": "eastwork"
      },
      {
        "at": [
          6,
          1,
          25
        ],
        "from": "westhearth",
        "to": "westbed"
      },
      {
        "at": [
          35,
          1,
          23
        ],
        "from": "eastwork",
        "to": "eastguest"
      },
      {
        "at": [
          35,
          1,
          31
        ],
        "from": "eastguest",
        "to": "eaststore"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        41,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        43,
        7,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 21,
        "z": 5,
        "room": "great",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 6,
        "room": "archive",
        "asset": "pack5:084"
      },
      {
        "x": 6,
        "z": 19,
        "room": "westhearth",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 28,
        "room": "westbed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 35,
        "z": 20,
        "room": "eastwork",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 26,
        "room": "eastguest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 34,
        "z": 34,
        "room": "eaststore",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "great-stone-front",
        "rect": [
          0,
          0,
          44,
          16
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "western-slate-hearth",
        "rect": [
          0,
          17,
          16,
          38
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "eastern-terrace-bastion",
        "rect": [
          27,
          17,
          44,
          38
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      40
    ],
    "detail": "peakside-seven-chamber-stonecourt-with-offset-west-innhouse-wing"
  }
]);
export const M2_HOUSING_WAVE7_IDS=Object.freeze(SPECS.map(s=>'r1:house:'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getM2HousingWave7(){return SPECS.map(compileM2ArchitecturalSpec);}
