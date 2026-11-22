// Builder 1A M2: Fifteen independently specified houses, one per biome x size.
// Complete physical-grid partitions, exact portals, rooms, fixtures, roofs and material ledgers;
// no random seeds, palette-only transforms, runtime writes, or child/sibling categories.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "temperate",
    "size": "small",
    "index": 2,
    "title": "Ashgrove Twin-Hearth Cottage",
    "w": 17,
    "d": 17,
    "plan": "front-parlor-rear-sleeping-niche-transverse-pantry",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        8,
        14,
        8
      ],
      [
        9,
        9,
        9,
        14
      ]
    ],
    "entry": [
      6,
      1,
      "parlor"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          8
        ],
        "from": "parlor",
        "to": "bedroom"
      },
      {
        "at": [
          9,
          1,
          12
        ],
        "from": "bedroom",
        "to": "pantry"
      }
    ],
    "rooms": [
      {
        "id": "parlor",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          8
        ]
      },
      {
        "id": "bedroom",
        "min": [
          2,
          1,
          9
        ],
        "max": [
          9,
          4,
          15
        ]
      },
      {
        "id": "pantry",
        "min": [
          10,
          1,
          9
        ],
        "max": [
          15,
          4,
          15
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
        13,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        15,
        10,
        "east"
      ],
      [
        5,
        15,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 4,
        "room": "parlor",
        "asset": "pack4:059"
      },
      {
        "x": 12,
        "z": 5,
        "room": "parlor",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 10,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 12,
        "room": "pantry",
        "asset": "pack4:057"
      }
    ],
    "posts": [
      4,
      12
    ],
    "detail": "oak-porch-with-offset-bedroom-bay"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "medium",
    "index": 3,
    "title": "Hillwood Cross-Wing House",
    "w": 21,
    "d": 19,
    "plan": "central-reception-spine-with-opposing-family-wings-and-back-study",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        8,
        2,
        8,
        16
      ],
      [
        13,
        2,
        13,
        16
      ],
      [
        9,
        11,
        12,
        11
      ]
    ],
    "entry": [
      10,
      1,
      "spine"
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          5
        ],
        "from": "spine",
        "to": "sleeping"
      },
      {
        "at": [
          13,
          1,
          6
        ],
        "from": "spine",
        "to": "kitchen"
      },
      {
        "at": [
          10,
          1,
          11
        ],
        "from": "spine",
        "to": "study"
      }
    ],
    "rooms": [
      {
        "id": "spine",
        "min": [
          9,
          1,
          2
        ],
        "max": [
          13,
          4,
          11
        ]
      },
      {
        "id": "sleeping",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          8,
          4,
          17
        ]
      },
      {
        "id": "kitchen",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          19,
          4,
          17
        ]
      },
      {
        "id": "study",
        "min": [
          9,
          1,
          12
        ],
        "max": [
          13,
          4,
          17
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
        17,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        19,
        7,
        "east"
      ],
      [
        10,
        17,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 10,
        "z": 4,
        "room": "spine",
        "asset": "pack4:059"
      },
      {
        "x": 3,
        "z": 11,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 16,
        "z": 11,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 10,
        "z": 14,
        "room": "study",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      5,
      15
    ],
    "detail": "deep-timber-double-wing-with-narrow-study"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "large",
    "index": 2,
    "title": "Brackenwold Walled Garden Home",
    "w": 25,
    "d": 23,
    "plan": "cross-court-home-with-private-side-wings-and-rear-art-room",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        8,
        22,
        8
      ],
      [
        9,
        9,
        9,
        20
      ],
      [
        16,
        9,
        16,
        20
      ],
      [
        2,
        16,
        8,
        16
      ],
      [
        17,
        16,
        22,
        16
      ]
    ],
    "entry": [
      12,
      1,
      "great-room"
    ],
    "doors": [
      {
        "at": [
          12,
          1,
          8
        ],
        "from": "great-room",
        "to": "court"
      },
      {
        "at": [
          9,
          1,
          12
        ],
        "from": "court",
        "to": "sleeping"
      },
      {
        "at": [
          16,
          1,
          12
        ],
        "from": "court",
        "to": "kitchen"
      },
      {
        "at": [
          5,
          1,
          16
        ],
        "from": "sleeping",
        "to": "studio"
      },
      {
        "at": [
          20,
          1,
          16
        ],
        "from": "kitchen",
        "to": "store"
      }
    ],
    "rooms": [
      {
        "id": "great-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          23,
          4,
          8
        ]
      },
      {
        "id": "court",
        "min": [
          10,
          1,
          9
        ],
        "max": [
          16,
          4,
          21
        ]
      },
      {
        "id": "sleeping",
        "min": [
          2,
          1,
          9
        ],
        "max": [
          9,
          4,
          16
        ]
      },
      {
        "id": "kitchen",
        "min": [
          17,
          1,
          9
        ],
        "max": [
          23,
          4,
          16
        ]
      },
      {
        "id": "studio",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          9,
          4,
          21
        ]
      },
      {
        "id": "store",
        "min": [
          17,
          1,
          17
        ],
        "max": [
          23,
          4,
          21
        ]
      }
    ],
    "windows": [
      [
        4,
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
        11,
        "west"
      ],
      [
        23,
        12,
        "east"
      ],
      [
        4,
        21,
        "south"
      ],
      [
        20,
        21,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 10,
        "z": 4,
        "room": "great-room",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 11,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 12,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 18,
        "room": "studio",
        "asset": "pack5:084"
      },
      {
        "x": 20,
        "z": 18,
        "room": "store",
        "asset": "pack4:057"
      }
    ],
    "posts": [
      6,
      18
    ],
    "detail": "airy-sun-court-and-separated-art-service-wings",
    "courtyard": [
      11,
      11,
      14,
      15
    ]
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "small",
    "index": 3,
    "title": "Sunstep Side-Court Dwelling",
    "w": 17,
    "d": 18,
    "plan": "front-room-to-rear-bedroom-with-kitchen-side-bay",
    "roof": "terrace",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "segments": [
      [
        2,
        9,
        14,
        9
      ],
      [
        9,
        10,
        9,
        15
      ]
    ],
    "entry": [
      7,
      1,
      "living"
    ],
    "doors": [
      {
        "at": [
          4,
          1,
          9
        ],
        "from": "living",
        "to": "bedroom"
      },
      {
        "at": [
          9,
          1,
          12
        ],
        "from": "bedroom",
        "to": "kitchen"
      }
    ],
    "rooms": [
      {
        "id": "living",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          9
        ]
      },
      {
        "id": "bedroom",
        "min": [
          2,
          1,
          10
        ],
        "max": [
          9,
          4,
          16
        ]
      },
      {
        "id": "kitchen",
        "min": [
          10,
          1,
          10
        ],
        "max": [
          15,
          4,
          16
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
        13,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        15,
        11,
        "east"
      ],
      [
        4,
        16,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 5,
        "z": 4,
        "room": "living",
        "asset": "pack4:059"
      },
      {
        "x": 12,
        "z": 6,
        "room": "living",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 11,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 13,
        "room": "kitchen",
        "asset": "pack4:057"
      }
    ],
    "posts": [
      3,
      13
    ],
    "detail": "sheltered-adobe-sunstep-and-cooking-bay"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "medium",
    "index": 3,
    "title": "Zalir Windcatcher Residence",
    "w": 21,
    "d": 20,
    "plan": "long-side-parlor-with-front-cookery-and-private-rear-room",
    "roof": "butterfly",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "segments": [
      [
        8,
        2,
        8,
        17
      ],
      [
        9,
        10,
        18,
        10
      ]
    ],
    "entry": [
      5,
      1,
      "gallery"
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          5
        ],
        "from": "gallery",
        "to": "kitchen"
      },
      {
        "at": [
          14,
          1,
          10
        ],
        "from": "kitchen",
        "to": "bedroom"
      }
    ],
    "rooms": [
      {
        "id": "gallery",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          8,
          4,
          18
        ]
      },
      {
        "id": "kitchen",
        "min": [
          9,
          1,
          2
        ],
        "max": [
          19,
          4,
          10
        ]
      },
      {
        "id": "bedroom",
        "min": [
          9,
          1,
          11
        ],
        "max": [
          19,
          4,
          18
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
        15,
        1,
        "north"
      ],
      [
        1,
        9,
        "west"
      ],
      [
        19,
        6,
        "east"
      ],
      [
        15,
        18,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 4,
        "room": "gallery",
        "asset": "pack4:064"
      },
      {
        "x": 15,
        "z": 6,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 11,
        "z": 13,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 5,
        "z": 15,
        "room": "gallery",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      4,
      16
    ],
    "detail": "long-breezeway-into-deep-private-sleeping-wing"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "large",
    "index": 2,
    "title": "Saltwind Four-Quadrant Courtyard Villa",
    "w": 27,
    "d": 23,
    "plan": "four-distinct-domestic-chambers-linked-across-transverse-crosshall",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "segments": [
      [
        11,
        2,
        11,
        20
      ],
      [
        2,
        11,
        24,
        11
      ]
    ],
    "entry": [
      6,
      1,
      "hall"
    ],
    "doors": [
      {
        "at": [
          11,
          1,
          5
        ],
        "from": "hall",
        "to": "kitchen"
      },
      {
        "at": [
          6,
          1,
          11
        ],
        "from": "hall",
        "to": "bedroom"
      },
      {
        "at": [
          19,
          1,
          11
        ],
        "from": "kitchen",
        "to": "study"
      }
    ],
    "rooms": [
      {
        "id": "hall",
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
        "id": "kitchen",
        "min": [
          12,
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
        "id": "bedroom",
        "min": [
          2,
          1,
          12
        ],
        "max": [
          11,
          4,
          21
        ]
      },
      {
        "id": "study",
        "min": [
          12,
          1,
          12
        ],
        "max": [
          25,
          4,
          21
        ]
      }
    ],
    "windows": [
      [
        4,
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
        7,
        "west"
      ],
      [
        25,
        8,
        "east"
      ],
      [
        4,
        21,
        "south"
      ],
      [
        22,
        21,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 5,
        "z": 5,
        "room": "hall",
        "asset": "pack4:064"
      },
      {
        "x": 20,
        "z": 6,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 15,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 20,
        "z": 19,
        "room": "study",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      5,
      21
    ],
    "detail": "reflecting-sun-shaft-with-massive-cross-bays",
    "courtyard": [
      15,
      14,
      20,
      18
    ]
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "small",
    "index": 2,
    "title": "Glacier Hearth Three-Room Cabin",
    "w": 17,
    "d": 21,
    "plan": "three-serial-chambers-with-front-heat-buffer",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        2,
        7,
        14,
        7
      ],
      [
        2,
        13,
        14,
        13
      ]
    ],
    "entry": [
      8,
      1,
      "hearth"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          7
        ],
        "from": "hearth",
        "to": "kitchen"
      },
      {
        "at": [
          11,
          1,
          13
        ],
        "from": "kitchen",
        "to": "sleeping"
      }
    ],
    "rooms": [
      {
        "id": "hearth",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          7
        ]
      },
      {
        "id": "kitchen",
        "min": [
          2,
          1,
          8
        ],
        "max": [
          15,
          4,
          13
        ]
      },
      {
        "id": "sleeping",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          15,
          4,
          19
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
        13,
        1,
        "north"
      ],
      [
        1,
        5,
        "west"
      ],
      [
        15,
        10,
        "east"
      ],
      [
        11,
        19,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 4,
        "room": "hearth",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 10,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 15,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 16,
        "room": "sleeping",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      3,
      13
    ],
    "detail": "triple-winter-buffer-with-narrow-end-fire"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "medium",
    "index": 3,
    "title": "Winterglass Twin-Study Residence",
    "w": 23,
    "d": 20,
    "plan": "thin-reception-with-opposing-warmth-wings-and-rear-nook",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        9,
        2,
        9,
        17
      ],
      [
        14,
        2,
        14,
        17
      ],
      [
        10,
        12,
        13,
        12
      ]
    ],
    "entry": [
      11,
      1,
      "reception"
    ],
    "doors": [
      {
        "at": [
          9,
          1,
          5
        ],
        "from": "reception",
        "to": "sleeping"
      },
      {
        "at": [
          14,
          1,
          7
        ],
        "from": "reception",
        "to": "pantry"
      },
      {
        "at": [
          11,
          1,
          12
        ],
        "from": "reception",
        "to": "study"
      }
    ],
    "rooms": [
      {
        "id": "reception",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          14,
          4,
          12
        ]
      },
      {
        "id": "sleeping",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          9,
          4,
          18
        ]
      },
      {
        "id": "pantry",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          21,
          4,
          18
        ]
      },
      {
        "id": "study",
        "min": [
          10,
          1,
          13
        ],
        "max": [
          14,
          4,
          18
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
        19,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        21,
        10,
        "east"
      ],
      [
        11,
        18,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 11,
        "z": 4,
        "room": "reception",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 9,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 18,
        "z": 10,
        "room": "pantry",
        "asset": "pack4:057"
      },
      {
        "x": 11,
        "z": 14,
        "room": "study",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      5,
      17
    ],
    "detail": "broad-dormer-asymmetry-and-ice-stopper-porch"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "large",
    "index": 2,
    "title": "Rimeglass Wintercourt Manor",
    "w": 27,
    "d": 24,
    "plan": "great-hall-into-inner-court-and-split-winter-service-wings",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        2,
        9,
        24,
        9
      ],
      [
        9,
        10,
        9,
        21
      ],
      [
        17,
        10,
        17,
        21
      ],
      [
        2,
        17,
        8,
        17
      ],
      [
        18,
        17,
        24,
        17
      ]
    ],
    "entry": [
      13,
      1,
      "hall"
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          9
        ],
        "from": "hall",
        "to": "court"
      },
      {
        "at": [
          9,
          1,
          13
        ],
        "from": "court",
        "to": "bedroom"
      },
      {
        "at": [
          17,
          1,
          13
        ],
        "from": "court",
        "to": "kitchen"
      },
      {
        "at": [
          5,
          1,
          17
        ],
        "from": "bedroom",
        "to": "library"
      },
      {
        "at": [
          21,
          1,
          17
        ],
        "from": "kitchen",
        "to": "store"
      }
    ],
    "rooms": [
      {
        "id": "hall",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          25,
          4,
          9
        ]
      },
      {
        "id": "court",
        "min": [
          10,
          1,
          10
        ],
        "max": [
          17,
          4,
          22
        ]
      },
      {
        "id": "bedroom",
        "min": [
          2,
          1,
          10
        ],
        "max": [
          9,
          4,
          17
        ]
      },
      {
        "id": "kitchen",
        "min": [
          18,
          1,
          10
        ],
        "max": [
          25,
          4,
          17
        ]
      },
      {
        "id": "library",
        "min": [
          2,
          1,
          18
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
          18,
          1,
          18
        ],
        "max": [
          25,
          4,
          22
        ]
      }
    ],
    "windows": [
      [
        4,
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
        12,
        "west"
      ],
      [
        25,
        12,
        "east"
      ],
      [
        4,
        22,
        "south"
      ],
      [
        22,
        22,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 13,
        "z": 4,
        "room": "hall",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 12,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 13,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 19,
        "room": "library",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 19,
        "room": "store",
        "asset": "pack4:057"
      }
    ],
    "posts": [
      6,
      20
    ],
    "detail": "winter-court-drift-exposure-dependency-and-double-wing-fabric",
    "courtyard": [
      12,
      12,
      15,
      16
    ]
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 2,
    "title": "Mosslight T-Branch Cottage",
    "w": 19,
    "d": 19,
    "plan": "bent-t-house-with-independent-living-cookery-sleeping-route",
    "roof": "butterfly",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        8,
        2,
        8,
        8
      ],
      [
        2,
        9,
        16,
        9
      ]
    ],
    "entry": [
      5,
      1,
      "living"
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          5
        ],
        "from": "living",
        "to": "cooking"
      },
      {
        "at": [
          12,
          1,
          9
        ],
        "from": "cooking",
        "to": "sleeping"
      }
    ],
    "rooms": [
      {
        "id": "living",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          8,
          4,
          9
        ]
      },
      {
        "id": "cooking",
        "min": [
          9,
          1,
          2
        ],
        "max": [
          17,
          4,
          9
        ]
      },
      {
        "id": "sleeping",
        "min": [
          2,
          1,
          10
        ],
        "max": [
          17,
          4,
          17
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
        15,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        17,
        5,
        "east"
      ],
      [
        12,
        17,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 4,
        "room": "living",
        "asset": "pack4:064"
      },
      {
        "x": 14,
        "z": 5,
        "room": "cooking",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 12,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 14,
        "z": 14,
        "room": "sleeping",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      4,
      14
    ],
    "detail": "tree-branch-shaped-wing-and-bent-overhang"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 3,
    "title": "Fernswell Conservatory Home",
    "w": 21,
    "d": 21,
    "plan": "wide-front-parlor-rear-bower-bedroom-and-open-workroom",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        9,
        18,
        9
      ],
      [
        11,
        10,
        11,
        18
      ]
    ],
    "entry": [
      8,
      1,
      "living"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          9
        ],
        "from": "living",
        "to": "bedroom"
      },
      {
        "at": [
          11,
          1,
          13
        ],
        "from": "bedroom",
        "to": "workroom"
      }
    ],
    "rooms": [
      {
        "id": "living",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          19,
          4,
          9
        ]
      },
      {
        "id": "bedroom",
        "min": [
          2,
          1,
          10
        ],
        "max": [
          11,
          4,
          19
        ]
      },
      {
        "id": "workroom",
        "min": [
          12,
          1,
          10
        ],
        "max": [
          19,
          4,
          19
        ]
      }
    ],
    "windows": [
      [
        4,
        1,
        "north"
      ],
      [
        16,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        19,
        7,
        "east"
      ],
      [
        5,
        19,
        "south"
      ],
      [
        16,
        19,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 8,
        "z": 4,
        "room": "living",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 12,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 14,
        "z": 12,
        "room": "workroom",
        "asset": "pack4:057"
      },
      {
        "x": 16,
        "z": 17,
        "room": "workroom",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      4,
      16
    ],
    "detail": "open-fern-terrarium-with-split-bower-bedroom",
    "courtyard": [
      14,
      14,
      16,
      16
    ]
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 2,
    "title": "Elderbloom Split-Gallery House",
    "w": 27,
    "d": 24,
    "plan": "lantern-front-gallery-to-six-room-arboreal-court",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        9,
        24,
        9
      ],
      [
        10,
        10,
        10,
        21
      ],
      [
        18,
        10,
        18,
        21
      ],
      [
        2,
        17,
        9,
        17
      ],
      [
        19,
        17,
        24,
        17
      ]
    ],
    "entry": [
      13,
      1,
      "gallery"
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          9
        ],
        "from": "gallery",
        "to": "court"
      },
      {
        "at": [
          10,
          1,
          12
        ],
        "from": "court",
        "to": "sleeping"
      },
      {
        "at": [
          18,
          1,
          12
        ],
        "from": "court",
        "to": "kitchen"
      },
      {
        "at": [
          5,
          1,
          17
        ],
        "from": "sleeping",
        "to": "library"
      },
      {
        "at": [
          22,
          1,
          17
        ],
        "from": "kitchen",
        "to": "nursery"
      }
    ],
    "rooms": [
      {
        "id": "gallery",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          25,
          4,
          9
        ]
      },
      {
        "id": "court",
        "min": [
          11,
          1,
          10
        ],
        "max": [
          18,
          4,
          22
        ]
      },
      {
        "id": "sleeping",
        "min": [
          2,
          1,
          10
        ],
        "max": [
          10,
          4,
          17
        ]
      },
      {
        "id": "kitchen",
        "min": [
          19,
          1,
          10
        ],
        "max": [
          25,
          4,
          17
        ]
      },
      {
        "id": "library",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          10,
          4,
          22
        ]
      },
      {
        "id": "nursery",
        "min": [
          19,
          1,
          18
        ],
        "max": [
          25,
          4,
          22
        ]
      }
    ],
    "windows": [
      [
        4,
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
        12,
        "west"
      ],
      [
        25,
        14,
        "east"
      ],
      [
        5,
        22,
        "south"
      ],
      [
        22,
        22,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 13,
        "z": 4,
        "room": "gallery",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 12,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 12,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 19,
        "room": "library",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 19,
        "room": "nursery",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      7,
      19
    ],
    "detail": "reed-canopy-over-open-court-and-art-library-wing",
    "courtyard": [
      13,
      12,
      15,
      16
    ]
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "small",
    "index": 2,
    "title": "Cragledge Split-Stone Hearth",
    "w": 18,
    "d": 19,
    "plan": "vertical-masonry-partition-to-front-hearth-and-rear-privacy",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "segments": [
      [
        7,
        2,
        7,
        16
      ],
      [
        8,
        10,
        15,
        10
      ]
    ],
    "entry": [
      4,
      1,
      "living"
    ],
    "doors": [
      {
        "at": [
          7,
          1,
          5
        ],
        "from": "living",
        "to": "kitchen"
      },
      {
        "at": [
          12,
          1,
          10
        ],
        "from": "kitchen",
        "to": "sleeping"
      }
    ],
    "rooms": [
      {
        "id": "living",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          7,
          4,
          17
        ]
      },
      {
        "id": "kitchen",
        "min": [
          8,
          1,
          2
        ],
        "max": [
          16,
          4,
          10
        ]
      },
      {
        "id": "sleeping",
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
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        13,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        16,
        7,
        "east"
      ],
      [
        13,
        17,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 4,
        "room": "living",
        "asset": "pack4:064"
      },
      {
        "x": 13,
        "z": 5,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 10,
        "z": 12,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 5,
        "z": 14,
        "room": "living",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      3,
      14
    ],
    "detail": "wedge-split-face-and-thick-stone-side"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "medium",
    "index": 3,
    "title": "Highpass Cross-Vault Residence",
    "w": 23,
    "d": 21,
    "plan": "four-zoned-stone-house-with-interlinked-kitchen-and-library",
    "roof": "hip",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "segments": [
      [
        10,
        2,
        10,
        18
      ],
      [
        2,
        10,
        20,
        10
      ]
    ],
    "entry": [
      6,
      1,
      "living"
    ],
    "doors": [
      {
        "at": [
          10,
          1,
          5
        ],
        "from": "living",
        "to": "cooking"
      },
      {
        "at": [
          6,
          1,
          10
        ],
        "from": "living",
        "to": "bedroom"
      },
      {
        "at": [
          17,
          1,
          10
        ],
        "from": "cooking",
        "to": "study"
      }
    ],
    "rooms": [
      {
        "id": "living",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          10,
          4,
          10
        ]
      },
      {
        "id": "cooking",
        "min": [
          11,
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
        "id": "bedroom",
        "min": [
          2,
          1,
          11
        ],
        "max": [
          10,
          4,
          19
        ]
      },
      {
        "id": "study",
        "min": [
          11,
          1,
          11
        ],
        "max": [
          21,
          4,
          19
        ]
      }
    ],
    "windows": [
      [
        4,
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
        7,
        "west"
      ],
      [
        21,
        7,
        "east"
      ],
      [
        4,
        19,
        "south"
      ],
      [
        19,
        19,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 5,
        "z": 5,
        "room": "living",
        "asset": "pack4:064"
      },
      {
        "x": 17,
        "z": 5,
        "room": "cooking",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 13,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 17,
        "z": 14,
        "room": "study",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      5,
      18
    ],
    "detail": "limestone-cross-vault-and-double-set-back-rooms"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 4,
    "title": "Skycrest Atrium Ridgehouse",
    "w": 29,
    "d": 25,
    "plan": "atrium-center-to-three-long-wings-and-rear-observation-room",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "segments": [
      [
        11,
        2,
        11,
        22
      ],
      [
        18,
        2,
        18,
        22
      ],
      [
        12,
        14,
        17,
        14
      ]
    ],
    "entry": [
      14,
      1,
      "atrium"
    ],
    "doors": [
      {
        "at": [
          11,
          1,
          6
        ],
        "from": "atrium",
        "to": "sleeping"
      },
      {
        "at": [
          18,
          1,
          7
        ],
        "from": "atrium",
        "to": "kitchen"
      },
      {
        "at": [
          14,
          1,
          14
        ],
        "from": "atrium",
        "to": "observatory"
      }
    ],
    "rooms": [
      {
        "id": "atrium",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          18,
          4,
          14
        ]
      },
      {
        "id": "sleeping",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          11,
          4,
          23
        ]
      },
      {
        "id": "kitchen",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          27,
          4,
          23
        ]
      },
      {
        "id": "observatory",
        "min": [
          12,
          1,
          15
        ],
        "max": [
          18,
          4,
          23
        ]
      }
    ],
    "windows": [
      [
        4,
        1,
        "north"
      ],
      [
        24,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        27,
        9,
        "east"
      ],
      [
        5,
        23,
        "south"
      ],
      [
        24,
        23,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 14,
        "z": 4,
        "room": "atrium",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 12,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 12,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 14,
        "z": 19,
        "room": "observatory",
        "asset": "pack5:084"
      },
      {
        "x": 16,
        "z": 8,
        "room": "atrium",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      7,
      21
    ],
    "detail": "deep-vertical-crest-atrial-axis-and-rear-view-room"
  }
]);
export const M2_HOUSING_IDS=Object.freeze(SPECS.map(x=>'r1:house:'+x.biome+':'+x.size+':'+String(x.index).padStart(3,'0')));
export function getM2HousingTranche(){return SPECS.map(compileM2ArchitecturalSpec);}
export function getM2HousingById(id){return getM2HousingTranche().find(b=>b.id===id)??null;}
