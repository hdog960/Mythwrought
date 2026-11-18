// Mythwrought Builder 1A M3 hospitality wave 2: 14 independently drafted and verified source 3D plans (7 taverns, 7 inns).
// Original literal coordinates: partitions/doors/rooms, genuine void footprint, unsupported-free roofs and physical Pack1–5 fixtures.
// Candidate-only; no runtime placement, saves, shared code, production art or integration.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "medium",
    "index": 4,
    "title": "Riverwheel Orchard Tap House",
    "w": 45,
    "d": 40,
    "plan": "riverwheel-orchard-tap-house-t-original-pavilion-layout",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        18,
        16,
        39
      ],
      [
        29,
        18,
        44,
        39
      ],
      [
        37,
        12,
        44,
        16
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
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
        27,
        17
      ],
      [
        18,
        28,
        27,
        28
      ]
    ],
    "entry": [
      22,
      1,
      "hearth-taproom"
    ],
    "rooms": [
      {
        "id": "west-seating",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          17
        ]
      },
      {
        "id": "hearth-taproom",
        "min": [
          19,
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
        "id": "east-kitchen",
        "min": [
          28,
          1,
          2
        ],
        "max": [
          43,
          4,
          17
        ]
      },
      {
        "id": "rear-cask-gallery",
        "min": [
          18,
          1,
          18
        ],
        "max": [
          28,
          4,
          28
        ]
      },
      {
        "id": "staff-bunk",
        "min": [
          18,
          1,
          29
        ],
        "max": [
          28,
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
        "from": "hearth-taproom",
        "to": "west-seating"
      },
      {
        "at": [
          27,
          1,
          7
        ],
        "from": "hearth-taproom",
        "to": "east-kitchen"
      },
      {
        "at": [
          22,
          1,
          17
        ],
        "from": "hearth-taproom",
        "to": "rear-cask-gallery"
      },
      {
        "at": [
          22,
          1,
          28
        ],
        "from": "rear-cask-gallery",
        "to": "staff-bunk"
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
        7,
        "west"
      ],
      [
        43,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-seating",
        "asset": "pack4:058"
      },
      {
        "x": 22,
        "z": 5,
        "room": "hearth-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "east-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 20,
        "z": 21,
        "room": "rear-cask-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 20,
        "z": 30,
        "room": "staff-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-front-veranda",
        "rect": [
          0,
          0,
          18,
          17
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "eastern-front-main",
        "rect": [
          19,
          0,
          44,
          17
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-guest-spine",
        "rect": [
          17,
          18,
          28,
          39
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      40
    ],
    "detail": "M3 original tavern temperate medium literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "tavern",
    "biome": "desert",
    "size": "medium",
    "index": 3,
    "title": "Duskwell Shaded Brewers Retreat",
    "w": 44,
    "d": 38,
    "plan": "duskwell-shaded-brewers-retreat-lw-original-pavilion-layout",
    "roof": "hip",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        21,
        12,
        37
      ],
      [
        37,
        34,
        43,
        37
      ]
    ],
    "segments": [
      [
        11,
        2,
        11,
        19
      ],
      [
        31,
        2,
        31,
        19
      ],
      [
        14,
        20,
        41,
        20
      ],
      [
        14,
        32,
        41,
        32
      ]
    ],
    "entry": [
      15,
      1,
      "public-hall"
    ],
    "rooms": [
      {
        "id": "kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          11,
          4,
          20
        ]
      },
      {
        "id": "public-hall",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          31,
          4,
          20
        ]
      },
      {
        "id": "storytelling-nook",
        "min": [
          32,
          1,
          2
        ],
        "max": [
          42,
          4,
          20
        ]
      },
      {
        "id": "cask-gallery",
        "min": [
          14,
          1,
          21
        ],
        "max": [
          42,
          4,
          32
        ]
      },
      {
        "id": "staff-bunk",
        "min": [
          14,
          1,
          33
        ],
        "max": [
          42,
          4,
          37
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
        "from": "public-hall",
        "to": "kitchen"
      },
      {
        "at": [
          31,
          1,
          7
        ],
        "from": "public-hall",
        "to": "storytelling-nook"
      },
      {
        "at": [
          36,
          1,
          20
        ],
        "from": "storytelling-nook",
        "to": "cask-gallery"
      },
      {
        "at": [
          36,
          1,
          32
        ],
        "from": "cask-gallery",
        "to": "staff-bunk"
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
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 16,
        "z": 5,
        "room": "public-hall",
        "asset": "pack4:064"
      },
      {
        "x": 37,
        "z": 5,
        "room": "storytelling-nook",
        "asset": "pack4:059"
      },
      {
        "x": 18,
        "z": 24,
        "room": "cask-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 18,
        "z": 34,
        "room": "staff-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-townside-feast-gable",
        "rect": [
          0,
          0,
          43,
          20
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-return-lodging-hall",
        "rect": [
          13,
          21,
          43,
          37
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      39
    ],
    "detail": "M3 original tavern desert medium literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "tavern",
    "biome": "snow",
    "size": "small",
    "index": 2,
    "title": "Tinderpine Meltwater Alehouse",
    "w": 35,
    "d": 33,
    "plan": "tinderpine-meltwater-alehouse-le-original-pavilion-layout",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        22,
        18,
        34,
        32
      ],
      [
        0,
        29,
        5,
        32
      ]
    ],
    "segments": [
      [
        10,
        2,
        10,
        16
      ],
      [
        25,
        2,
        25,
        16
      ],
      [
        2,
        17,
        20,
        17
      ],
      [
        2,
        27,
        20,
        27
      ]
    ],
    "entry": [
      14,
      1,
      "public-hall"
    ],
    "rooms": [
      {
        "id": "kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          10,
          4,
          17
        ]
      },
      {
        "id": "public-hall",
        "min": [
          11,
          1,
          2
        ],
        "max": [
          25,
          4,
          17
        ]
      },
      {
        "id": "storytelling-nook",
        "min": [
          26,
          1,
          2
        ],
        "max": [
          33,
          4,
          17
        ]
      },
      {
        "id": "cask-gallery",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          21,
          4,
          27
        ]
      },
      {
        "id": "staff-bunk",
        "min": [
          2,
          1,
          28
        ],
        "max": [
          21,
          4,
          32
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
        "from": "public-hall",
        "to": "kitchen"
      },
      {
        "at": [
          25,
          1,
          7
        ],
        "from": "public-hall",
        "to": "storytelling-nook"
      },
      {
        "at": [
          8,
          1,
          17
        ],
        "from": "kitchen",
        "to": "cask-gallery"
      },
      {
        "at": [
          8,
          1,
          27
        ],
        "from": "cask-gallery",
        "to": "staff-bunk"
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
        7,
        "west"
      ],
      [
        33,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 15,
        "z": 5,
        "room": "public-hall",
        "asset": "pack4:064"
      },
      {
        "x": 28,
        "z": 5,
        "room": "storytelling-nook",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 21,
        "room": "cask-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 29,
        "room": "staff-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-townside-feast-gable",
        "rect": [
          0,
          0,
          34,
          17
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-return-lodging-hall",
        "rect": [
          0,
          18,
          21,
          32
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      30
    ],
    "detail": "M3 original tavern snow small literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "tavern",
    "biome": "snow",
    "size": "medium",
    "index": 4,
    "title": "Embercrag Alpine Hearth Hall",
    "w": 45,
    "d": 41,
    "plan": "embercrag-alpine-hearth-hall-t-original-pavilion-layout",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        19,
        13,
        40
      ],
      [
        29,
        19,
        44,
        40
      ],
      [
        0,
        8,
        7,
        17
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
        27,
        2,
        27,
        17
      ],
      [
        15,
        18,
        27,
        18
      ],
      [
        15,
        33,
        27,
        33
      ]
    ],
    "entry": [
      21,
      1,
      "hearth-taproom"
    ],
    "rooms": [
      {
        "id": "west-seating",
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
        "id": "hearth-taproom",
        "min": [
          16,
          1,
          2
        ],
        "max": [
          27,
          4,
          18
        ]
      },
      {
        "id": "east-kitchen",
        "min": [
          28,
          1,
          2
        ],
        "max": [
          43,
          4,
          18
        ]
      },
      {
        "id": "rear-cask-gallery",
        "min": [
          15,
          1,
          19
        ],
        "max": [
          28,
          4,
          33
        ]
      },
      {
        "id": "staff-bunk",
        "min": [
          15,
          1,
          34
        ],
        "max": [
          28,
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
        "from": "hearth-taproom",
        "to": "west-seating"
      },
      {
        "at": [
          27,
          1,
          7
        ],
        "from": "hearth-taproom",
        "to": "east-kitchen"
      },
      {
        "at": [
          21,
          1,
          18
        ],
        "from": "hearth-taproom",
        "to": "rear-cask-gallery"
      },
      {
        "at": [
          21,
          1,
          33
        ],
        "from": "rear-cask-gallery",
        "to": "staff-bunk"
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
        7,
        "west"
      ],
      [
        43,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-seating",
        "asset": "pack4:058"
      },
      {
        "x": 21,
        "z": 5,
        "room": "hearth-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "east-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 19,
        "z": 22,
        "room": "rear-cask-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 19,
        "z": 35,
        "room": "staff-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-front-veranda",
        "rect": [
          0,
          0,
          15,
          18
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "eastern-front-main",
        "rect": [
          16,
          0,
          44,
          18
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-guest-spine",
        "rect": [
          14,
          19,
          28,
          40
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      4,
      40
    ],
    "detail": "M3 original tavern snow medium literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "tavern",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 3,
    "title": "Thistledusk Firefly Brew Room",
    "w": 34,
    "d": 32,
    "plan": "thistledusk-firefly-brew-room-u-original-pavilion-layout",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        12,
        17,
        21,
        31
      ],
      [
        28,
        9,
        33,
        15
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
        2,
        16,
        10,
        16
      ],
      [
        23,
        16,
        31,
        16
      ],
      [
        2,
        25,
        10,
        25
      ],
      [
        23,
        26,
        31,
        26
      ]
    ],
    "entry": [
      16,
      1,
      "public-gallery"
    ],
    "rooms": [
      {
        "id": "bar-storage",
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
        "id": "public-gallery",
        "min": [
          13,
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
        "id": "west-kitchen",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          11,
          4,
          25
        ]
      },
      {
        "id": "west-sleeping-quarters",
        "min": [
          2,
          1,
          26
        ],
        "max": [
          11,
          4,
          31
        ]
      },
      {
        "id": "east-performance",
        "min": [
          23,
          1,
          17
        ],
        "max": [
          32,
          4,
          26
        ]
      },
      {
        "id": "east-private-seating",
        "min": [
          23,
          1,
          27
        ],
        "max": [
          32,
          4,
          31
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
        "from": "public-gallery",
        "to": "bar-storage"
      },
      {
        "at": [
          7,
          1,
          16
        ],
        "from": "bar-storage",
        "to": "west-kitchen"
      },
      {
        "at": [
          7,
          1,
          25
        ],
        "from": "west-kitchen",
        "to": "west-sleeping-quarters"
      },
      {
        "at": [
          26,
          1,
          16
        ],
        "from": "public-gallery",
        "to": "east-performance"
      },
      {
        "at": [
          26,
          1,
          26
        ],
        "from": "east-performance",
        "to": "east-private-seating"
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
        "room": "bar-storage",
        "asset": "pack5:084"
      },
      {
        "x": 16,
        "z": 5,
        "room": "public-gallery",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 20,
        "room": "west-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 7,
        "z": 27,
        "room": "west-sleeping-quarters",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 26,
        "z": 20,
        "room": "east-performance",
        "asset": "pack4:059"
      },
      {
        "x": 26,
        "z": 28,
        "room": "east-private-seating",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "public-front-cross-gable",
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
        "name": "western-return-wing",
        "rect": [
          0,
          17,
          11,
          31
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "eastern-return-wing",
        "rect": [
          22,
          17,
          33,
          31
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      29
    ],
    "detail": "M3 original tavern enchanted-forest small literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "tavern",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 4,
    "title": "Starbough Festival Mead Hall",
    "w": 56,
    "d": 50,
    "plan": "starbough-festival-mead-hall-lw-original-pavilion-layout",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        24,
        20,
        49
      ],
      [
        47,
        41,
        55,
        49
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
        22,
        23,
        53,
        23
      ],
      [
        22,
        38,
        53,
        38
      ]
    ],
    "entry": [
      22,
      1,
      "public-hall"
    ],
    "rooms": [
      {
        "id": "kitchen",
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
        "id": "public-hall",
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
        "id": "storytelling-nook",
        "min": [
          37,
          1,
          2
        ],
        "max": [
          54,
          4,
          23
        ]
      },
      {
        "id": "cask-gallery",
        "min": [
          22,
          1,
          24
        ],
        "max": [
          54,
          4,
          38
        ]
      },
      {
        "id": "staff-bunk",
        "min": [
          22,
          1,
          39
        ],
        "max": [
          54,
          4,
          49
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
        "from": "public-hall",
        "to": "kitchen"
      },
      {
        "at": [
          36,
          1,
          7
        ],
        "from": "public-hall",
        "to": "storytelling-nook"
      },
      {
        "at": [
          48,
          1,
          23
        ],
        "from": "storytelling-nook",
        "to": "cask-gallery"
      },
      {
        "at": [
          48,
          1,
          38
        ],
        "from": "cask-gallery",
        "to": "staff-bunk"
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
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 23,
        "z": 5,
        "room": "public-hall",
        "asset": "pack4:064"
      },
      {
        "x": 49,
        "z": 5,
        "room": "storytelling-nook",
        "asset": "pack4:059"
      },
      {
        "x": 26,
        "z": 27,
        "room": "cask-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 26,
        "z": 40,
        "room": "staff-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-townside-feast-gable",
        "rect": [
          0,
          0,
          55,
          23
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "rear-return-lodging-hall",
        "rect": [
          21,
          24,
          55,
          49
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      51
    ],
    "detail": "M3 original tavern enchanted-forest large literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "large",
    "index": 5,
    "title": "Highforge Cairn Festival House",
    "w": 58,
    "d": 52,
    "plan": "highforge-cairn-festival-house-le-original-pavilion-layout",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        42,
        24,
        57,
        51
      ],
      [
        0,
        44,
        5,
        51
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
        2,
        23,
        40,
        23
      ],
      [
        2,
        40,
        40,
        40
      ]
    ],
    "entry": [
      22,
      1,
      "public-hall"
    ],
    "rooms": [
      {
        "id": "kitchen",
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
        "id": "public-hall",
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
        "id": "storytelling-nook",
        "min": [
          37,
          1,
          2
        ],
        "max": [
          56,
          4,
          23
        ]
      },
      {
        "id": "cask-gallery",
        "min": [
          2,
          1,
          24
        ],
        "max": [
          41,
          4,
          40
        ]
      },
      {
        "id": "staff-bunk",
        "min": [
          2,
          1,
          41
        ],
        "max": [
          41,
          4,
          51
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
        "from": "public-hall",
        "to": "kitchen"
      },
      {
        "at": [
          36,
          1,
          7
        ],
        "from": "public-hall",
        "to": "storytelling-nook"
      },
      {
        "at": [
          8,
          1,
          23
        ],
        "from": "kitchen",
        "to": "cask-gallery"
      },
      {
        "at": [
          8,
          1,
          40
        ],
        "from": "cask-gallery",
        "to": "staff-bunk"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        54,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        56,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 23,
        "z": 5,
        "room": "public-hall",
        "asset": "pack4:064"
      },
      {
        "x": 51,
        "z": 5,
        "room": "storytelling-nook",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 27,
        "room": "cask-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 42,
        "room": "staff-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-townside-feast-gable",
        "rect": [
          0,
          0,
          57,
          23
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-return-lodging-hall",
        "rect": [
          0,
          24,
          41,
          51
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      53
    ],
    "detail": "M3 original tavern mountain large literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "medium",
    "index": 1,
    "title": "Foxglove Brook Traveler Lodge",
    "w": 46,
    "d": 43,
    "plan": "foxglove-brook-traveler-lodge-le-original-pavilion-layout",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        30,
        21,
        45,
        42
      ],
      [
        0,
        36,
        7,
        42
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
        28,
        20
      ],
      [
        2,
        32,
        28,
        32
      ]
    ],
    "entry": [
      19,
      1,
      "reception-lounge"
    ],
    "rooms": [
      {
        "id": "western-bedroom",
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
        "id": "reception-lounge",
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
        "id": "eastern-bedroom",
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
        "id": "linen-gallery",
        "min": [
          2,
          1,
          21
        ],
        "max": [
          29,
          4,
          32
        ]
      },
      {
        "id": "rear-suite",
        "min": [
          2,
          1,
          33
        ],
        "max": [
          29,
          4,
          42
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
        "from": "reception-lounge",
        "to": "western-bedroom"
      },
      {
        "at": [
          32,
          1,
          7
        ],
        "from": "reception-lounge",
        "to": "eastern-bedroom"
      },
      {
        "at": [
          8,
          1,
          20
        ],
        "from": "western-bedroom",
        "to": "linen-gallery"
      },
      {
        "at": [
          8,
          1,
          32
        ],
        "from": "linen-gallery",
        "to": "rear-suite"
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
        "room": "western-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 20,
        "z": 5,
        "room": "reception-lounge",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "eastern-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 24,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 34,
        "room": "rear-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-townside-feast-gable",
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
        "name": "rear-return-lodging-hall",
        "rect": [
          0,
          21,
          29,
          42
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      41
    ],
    "detail": "M3 original inn temperate medium literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "small",
    "index": 1,
    "title": "Saffron Passway Caravan Shelter",
    "w": 37,
    "d": 34,
    "plan": "saffron-passway-caravan-shelter-u-original-pavilion-layout",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        14,
        16,
        26,
        33
      ],
      [
        0,
        8,
        5,
        14
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
        2,
        15,
        12,
        15
      ],
      [
        28,
        15,
        34,
        15
      ],
      [
        2,
        27,
        12,
        27
      ],
      [
        28,
        28,
        34,
        28
      ]
    ],
    "entry": [
      16,
      1,
      "common-room"
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
          12,
          4,
          15
        ]
      },
      {
        "id": "common-room",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          35,
          4,
          15
        ]
      },
      {
        "id": "western-guest",
        "min": [
          2,
          1,
          16
        ],
        "max": [
          13,
          4,
          27
        ]
      },
      {
        "id": "western-suite",
        "min": [
          2,
          1,
          28
        ],
        "max": [
          13,
          4,
          33
        ]
      },
      {
        "id": "eastern-guest",
        "min": [
          28,
          1,
          16
        ],
        "max": [
          35,
          4,
          28
        ]
      },
      {
        "id": "eastern-suite",
        "min": [
          28,
          1,
          29
        ],
        "max": [
          35,
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
        "from": "common-room",
        "to": "reception"
      },
      {
        "at": [
          7,
          1,
          15
        ],
        "from": "reception",
        "to": "western-guest"
      },
      {
        "at": [
          7,
          1,
          27
        ],
        "from": "western-guest",
        "to": "western-suite"
      },
      {
        "at": [
          29,
          1,
          15
        ],
        "from": "common-room",
        "to": "eastern-guest"
      },
      {
        "at": [
          29,
          1,
          28
        ],
        "from": "eastern-guest",
        "to": "eastern-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        33,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        35,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "reception",
        "asset": "pack4:064"
      },
      {
        "x": 16,
        "z": 5,
        "room": "common-room",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 19,
        "room": "western-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 7,
        "z": 29,
        "room": "western-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 29,
        "z": 19,
        "room": "eastern-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 29,
        "z": 30,
        "room": "eastern-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "public-front-cross-gable",
        "rect": [
          0,
          0,
          36,
          15
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "western-return-wing",
        "rect": [
          0,
          16,
          13,
          33
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "eastern-return-wing",
        "rect": [
          27,
          16,
          36,
          33
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      4,
      32
    ],
    "detail": "M3 original inn desert small literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "medium",
    "index": 3,
    "title": "Ocher Dune Starwatch Inn",
    "w": 47,
    "d": 43,
    "plan": "ocher-dune-starwatch-inn-t-original-pavilion-layout",
    "roof": "steep",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        21,
        17,
        42
      ],
      [
        30,
        21,
        46,
        42
      ],
      [
        39,
        9,
        46,
        19
      ]
    ],
    "segments": [
      [
        19,
        2,
        19,
        19
      ],
      [
        28,
        2,
        28,
        19
      ],
      [
        19,
        20,
        28,
        20
      ],
      [
        19,
        33,
        28,
        33
      ]
    ],
    "entry": [
      23,
      1,
      "lobby"
    ],
    "rooms": [
      {
        "id": "western-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          19,
          4,
          20
        ]
      },
      {
        "id": "lobby",
        "min": [
          20,
          1,
          2
        ],
        "max": [
          28,
          4,
          20
        ]
      },
      {
        "id": "eastern-bedroom",
        "min": [
          29,
          1,
          2
        ],
        "max": [
          45,
          4,
          20
        ]
      },
      {
        "id": "rear-service",
        "min": [
          19,
          1,
          21
        ],
        "max": [
          29,
          4,
          33
        ]
      },
      {
        "id": "garden-suite",
        "min": [
          19,
          1,
          34
        ],
        "max": [
          29,
          4,
          42
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
        "from": "lobby",
        "to": "western-bedroom"
      },
      {
        "at": [
          28,
          1,
          7
        ],
        "from": "lobby",
        "to": "eastern-bedroom"
      },
      {
        "at": [
          23,
          1,
          20
        ],
        "from": "lobby",
        "to": "rear-service"
      },
      {
        "at": [
          23,
          1,
          33
        ],
        "from": "rear-service",
        "to": "garden-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        43,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        45,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "lobby",
        "asset": "pack4:064"
      },
      {
        "x": 40,
        "z": 5,
        "room": "eastern-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 24,
        "room": "rear-service",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 35,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-front-veranda",
        "rect": [
          0,
          0,
          19,
          20
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "eastern-front-main",
        "rect": [
          20,
          0,
          46,
          20
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-guest-spine",
        "rect": [
          18,
          21,
          29,
          42
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      42
    ],
    "detail": "M3 original inn desert medium literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "medium",
    "index": 2,
    "title": "Icemeadow Wayfarer Hearth Lodge",
    "w": 47,
    "d": 44,
    "plan": "icemeadow-wayfarer-hearth-lodge-lw-original-pavilion-layout",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        22,
        19,
        43
      ],
      [
        39,
        39,
        46,
        43
      ]
    ],
    "segments": [
      [
        13,
        2,
        13,
        20
      ],
      [
        33,
        2,
        33,
        20
      ],
      [
        21,
        21,
        44,
        21
      ],
      [
        21,
        36,
        44,
        36
      ]
    ],
    "entry": [
      17,
      1,
      "reception-lounge"
    ],
    "rooms": [
      {
        "id": "western-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          13,
          4,
          21
        ]
      },
      {
        "id": "reception-lounge",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          33,
          4,
          21
        ]
      },
      {
        "id": "eastern-bedroom",
        "min": [
          34,
          1,
          2
        ],
        "max": [
          45,
          4,
          21
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          21,
          1,
          22
        ],
        "max": [
          45,
          4,
          36
        ]
      },
      {
        "id": "rear-suite",
        "min": [
          21,
          1,
          37
        ],
        "max": [
          45,
          4,
          43
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
        "from": "reception-lounge",
        "to": "western-bedroom"
      },
      {
        "at": [
          33,
          1,
          7
        ],
        "from": "reception-lounge",
        "to": "eastern-bedroom"
      },
      {
        "at": [
          39,
          1,
          21
        ],
        "from": "eastern-bedroom",
        "to": "linen-gallery"
      },
      {
        "at": [
          39,
          1,
          36
        ],
        "from": "linen-gallery",
        "to": "rear-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        43,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        45,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 18,
        "z": 5,
        "room": "reception-lounge",
        "asset": "pack4:064"
      },
      {
        "x": 40,
        "z": 5,
        "room": "eastern-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 25,
        "z": 25,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 38,
        "room": "rear-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-townside-feast-gable",
        "rect": [
          0,
          0,
          46,
          21
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-return-lodging-hall",
        "rect": [
          20,
          22,
          46,
          43
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      42
    ],
    "detail": "M3 original inn snow medium literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 1,
    "title": "Glowcap Elderroot Guesthouse",
    "w": 38,
    "d": 35,
    "plan": "glowcap-elderroot-guesthouse-le-original-pavilion-layout",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        27,
        16,
        37,
        34
      ],
      [
        0,
        28,
        5,
        34
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
        25,
        2,
        25,
        14
      ],
      [
        2,
        15,
        25,
        15
      ],
      [
        2,
        26,
        25,
        26
      ]
    ],
    "entry": [
      18,
      1,
      "reception-lounge"
    ],
    "rooms": [
      {
        "id": "western-bedroom",
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
        "id": "reception-lounge",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          25,
          4,
          15
        ]
      },
      {
        "id": "eastern-bedroom",
        "min": [
          26,
          1,
          2
        ],
        "max": [
          36,
          4,
          15
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          2,
          1,
          16
        ],
        "max": [
          26,
          4,
          26
        ]
      },
      {
        "id": "rear-suite",
        "min": [
          2,
          1,
          27
        ],
        "max": [
          26,
          4,
          34
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
        "from": "reception-lounge",
        "to": "western-bedroom"
      },
      {
        "at": [
          25,
          1,
          7
        ],
        "from": "reception-lounge",
        "to": "eastern-bedroom"
      },
      {
        "at": [
          8,
          1,
          15
        ],
        "from": "western-bedroom",
        "to": "linen-gallery"
      },
      {
        "at": [
          8,
          1,
          26
        ],
        "from": "linen-gallery",
        "to": "rear-suite"
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
        "room": "western-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 5,
        "room": "reception-lounge",
        "asset": "pack4:064"
      },
      {
        "x": 31,
        "z": 5,
        "room": "eastern-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 19,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 28,
        "room": "rear-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-townside-feast-gable",
        "rect": [
          0,
          0,
          37,
          15
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-return-lodging-hall",
        "rect": [
          0,
          16,
          26,
          34
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      33
    ],
    "detail": "M3 original inn enchanted-forest small literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 2,
    "title": "Moonspire Lantern Guest Court",
    "w": 60,
    "d": 53,
    "plan": "moonspire-lantern-guest-court-t-original-pavilion-layout",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        26,
        20,
        52
      ],
      [
        45,
        26,
        59,
        52
      ],
      [
        0,
        8,
        5,
        24
      ]
    ],
    "segments": [
      [
        22,
        2,
        22,
        24
      ],
      [
        43,
        2,
        43,
        24
      ],
      [
        22,
        25,
        43,
        25
      ],
      [
        22,
        42,
        43,
        42
      ]
    ],
    "entry": [
      32,
      1,
      "lobby"
    ],
    "rooms": [
      {
        "id": "western-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          22,
          4,
          25
        ]
      },
      {
        "id": "lobby",
        "min": [
          23,
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
        "id": "eastern-bedroom",
        "min": [
          44,
          1,
          2
        ],
        "max": [
          58,
          4,
          25
        ]
      },
      {
        "id": "rear-service",
        "min": [
          22,
          1,
          26
        ],
        "max": [
          44,
          4,
          42
        ]
      },
      {
        "id": "garden-suite",
        "min": [
          22,
          1,
          43
        ],
        "max": [
          44,
          4,
          52
        ]
      }
    ],
    "doors": [
      {
        "at": [
          22,
          1,
          6
        ],
        "from": "lobby",
        "to": "western-bedroom"
      },
      {
        "at": [
          43,
          1,
          7
        ],
        "from": "lobby",
        "to": "eastern-bedroom"
      },
      {
        "at": [
          32,
          1,
          25
        ],
        "from": "lobby",
        "to": "rear-service"
      },
      {
        "at": [
          32,
          1,
          42
        ],
        "from": "rear-service",
        "to": "garden-suite"
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
        "room": "western-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 32,
        "z": 5,
        "room": "lobby",
        "asset": "pack4:064"
      },
      {
        "x": 53,
        "z": 5,
        "room": "eastern-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 30,
        "z": 29,
        "room": "rear-service",
        "asset": "pack5:084"
      },
      {
        "x": 30,
        "z": 44,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-front-veranda",
        "rect": [
          0,
          0,
          22,
          25
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "eastern-front-main",
        "rect": [
          23,
          0,
          59,
          25
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "rear-guest-spine",
        "rect": [
          21,
          26,
          44,
          52
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      55
    ],
    "detail": "M3 original inn enchanted-forest large literal room, portal, physically supported roof and outdoor notch"
  },
  {
    "category": "inn",
    "biome": "mountain",
    "size": "small",
    "index": 2,
    "title": "Stonepath Summit Waystation",
    "w": 39,
    "d": 36,
    "plan": "stonepath-summit-waystation-lw-original-pavilion-layout",
    "roof": "hip",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        18,
        16,
        35
      ],
      [
        32,
        28,
        38,
        35
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
        36,
        17
      ],
      [
        18,
        26,
        36,
        26
      ]
    ],
    "entry": [
      18,
      1,
      "reception-lounge"
    ],
    "rooms": [
      {
        "id": "western-bedroom",
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
        "id": "reception-lounge",
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
        "id": "eastern-bedroom",
        "min": [
          28,
          1,
          2
        ],
        "max": [
          37,
          4,
          17
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          18,
          1,
          18
        ],
        "max": [
          37,
          4,
          26
        ]
      },
      {
        "id": "rear-suite",
        "min": [
          18,
          1,
          27
        ],
        "max": [
          37,
          4,
          35
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
        "from": "reception-lounge",
        "to": "western-bedroom"
      },
      {
        "at": [
          27,
          1,
          7
        ],
        "from": "reception-lounge",
        "to": "eastern-bedroom"
      },
      {
        "at": [
          31,
          1,
          17
        ],
        "from": "eastern-bedroom",
        "to": "linen-gallery"
      },
      {
        "at": [
          31,
          1,
          26
        ],
        "from": "linen-gallery",
        "to": "rear-suite"
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
        7,
        "west"
      ],
      [
        37,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 5,
        "room": "reception-lounge",
        "asset": "pack4:064"
      },
      {
        "x": 32,
        "z": 5,
        "room": "eastern-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 22,
        "z": 21,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 28,
        "room": "rear-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-townside-feast-gable",
        "rect": [
          0,
          0,
          38,
          17
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-return-lodging-hall",
        "rect": [
          17,
          18,
          38,
          35
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      34
    ],
    "detail": "M3 original inn mountain small literal room, portal, physically supported roof and outdoor notch"
  }
]);
export const HOSPITALITY_WAVE2_IDS=Object.freeze(SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getHospitalityWave2(){return SPECS.map(compileM2ArchitecturalSpec);}
