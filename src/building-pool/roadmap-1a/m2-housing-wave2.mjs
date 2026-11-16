// Builder 1A M2 continuation — 15 independent second wave house designs, one per biome and size.
// Literal rooms, walls, portals, beds, roof profiles and terrain-facing dependencies; no random seeds.
// One-storey only (stairs are NOT required); do not pass these into production placement without creator approval.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "temperate",
    "size": "small",
    "index": 3,
    "title": "Rowanbrook Side-Hearth Cottage",
    "w": 18,
    "d": 17,
    "plan": "two-bay-cross-passage-leading-to-offset-private-sleeping-court",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "segments": [
      [
        8,
        2,
        8,
        14
      ],
      [
        9,
        9,
        15,
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
        "to": "kitchen"
      },
      {
        "at": [
          12,
          1,
          9
        ],
        "from": "kitchen",
        "to": "bedroom"
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
          15
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
          16,
          4,
          9
        ]
      },
      {
        "id": "bedroom",
        "min": [
          9,
          1,
          10
        ],
        "max": [
          16,
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
        14,
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
        12,
        15,
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
        "x": 12,
        "z": 5,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 10,
        "z": 11,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 4,
        "z": 12,
        "room": "living",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      3,
      14
    ],
    "detail": "timbered-cross-passage-with-deep-private-rear-bay"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "medium",
    "index": 4,
    "title": "Larkspur Three-Wing Farmhouse",
    "w": 22,
    "d": 22,
    "plan": "front-common-room-distributing-to-three-separate-domestic-wings",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        9,
        19,
        9
      ],
      [
        7,
        10,
        7,
        19
      ],
      [
        14,
        10,
        14,
        19
      ]
    ],
    "entry": [
      10,
      1,
      "common"
    ],
    "doors": [
      {
        "at": [
          4,
          1,
          9
        ],
        "from": "common",
        "to": "pantry"
      },
      {
        "at": [
          10,
          1,
          9
        ],
        "from": "common",
        "to": "sleeping"
      },
      {
        "at": [
          17,
          1,
          9
        ],
        "from": "common",
        "to": "study"
      }
    ],
    "rooms": [
      {
        "id": "common",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          20,
          4,
          9
        ]
      },
      {
        "id": "pantry",
        "min": [
          2,
          1,
          10
        ],
        "max": [
          7,
          4,
          20
        ]
      },
      {
        "id": "sleeping",
        "min": [
          8,
          1,
          10
        ],
        "max": [
          14,
          4,
          20
        ]
      },
      {
        "id": "study",
        "min": [
          15,
          1,
          10
        ],
        "max": [
          20,
          4,
          20
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
        17,
        1,
        "north"
      ],
      [
        1,
        12,
        "west"
      ],
      [
        20,
        12,
        "east"
      ],
      [
        4,
        20,
        "south"
      ],
      [
        16,
        20,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 10,
        "z": 5,
        "room": "common",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 14,
        "room": "pantry",
        "asset": "pack4:057"
      },
      {
        "x": 9,
        "z": 12,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 16,
        "z": 15,
        "room": "study",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      5,
      17
    ],
    "detail": "sprawling-front-greatroom-with-three-unequal-service-wings"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "large",
    "index": 4,
    "title": "Wrenwood Six-Room Orchard Court",
    "w": 29,
    "d": 25,
    "plan": "deep-central-court-flanked-by-service-and-family-quarters",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        8,
        26,
        8
      ],
      [
        9,
        9,
        9,
        22
      ],
      [
        19,
        9,
        19,
        22
      ],
      [
        2,
        16,
        8,
        16
      ],
      [
        20,
        16,
        26,
        16
      ]
    ],
    "entry": [
      14,
      1,
      "vestibule"
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          8
        ],
        "from": "vestibule",
        "to": "court"
      },
      {
        "at": [
          9,
          1,
          12
        ],
        "from": "court",
        "to": "family"
      },
      {
        "at": [
          19,
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
        "from": "family",
        "to": "study"
      },
      {
        "at": [
          23,
          1,
          16
        ],
        "from": "kitchen",
        "to": "larder"
      }
    ],
    "rooms": [
      {
        "id": "vestibule",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          27,
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
          19,
          4,
          23
        ]
      },
      {
        "id": "family",
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
          20,
          1,
          9
        ],
        "max": [
          27,
          4,
          16
        ]
      },
      {
        "id": "study",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          9,
          4,
          23
        ]
      },
      {
        "id": "larder",
        "min": [
          20,
          1,
          17
        ],
        "max": [
          27,
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
        12,
        "west"
      ],
      [
        27,
        13,
        "east"
      ],
      [
        5,
        23,
        "south"
      ],
      [
        23,
        23,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 14,
        "z": 4,
        "room": "vestibule",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 12,
        "room": "family",
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
        "x": 4,
        "z": 19,
        "room": "study",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 19,
        "room": "larder",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      6,
      22
    ],
    "detail": "orchard-gabled-settlement-with-distant-court-and-two-independent-rear-rooms",
    "courtyard": [
      13,
      12,
      16,
      15
    ]
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "small",
    "index": 4,
    "title": "Sahra Bent-Wing Hearthhouse",
    "w": 19,
    "d": 17,
    "plan": "long-left-living-zone-with-right-split-cook-and-private-chamber",
    "roof": "terrace",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "segments": [
      [
        7,
        2,
        7,
        14
      ],
      [
        8,
        10,
        16,
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
        "to": "cooking"
      },
      {
        "at": [
          13,
          1,
          10
        ],
        "from": "cooking",
        "to": "bedroom"
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
          15
        ]
      },
      {
        "id": "cooking",
        "min": [
          8,
          1,
          2
        ],
        "max": [
          17,
          4,
          10
        ]
      },
      {
        "id": "bedroom",
        "min": [
          8,
          1,
          11
        ],
        "max": [
          17,
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
        17,
        6,
        "east"
      ],
      [
        14,
        15,
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
        "x": 12,
        "z": 6,
        "room": "cooking",
        "asset": "pack4:057"
      },
      {
        "x": 10,
        "z": 11,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 4,
        "z": 12,
        "room": "living",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      3,
      15
    ],
    "detail": "adobe-heat-well-with-lateral-sleeping-bay"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "medium",
    "index": 4,
    "title": "Dunewell Four-Bay Wind House",
    "w": 23,
    "d": 20,
    "plan": "public-forward-court-distributes-to-three-private-desert-wings",
    "roof": "terrace",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "segments": [
      [
        2,
        8,
        20,
        8
      ],
      [
        8,
        9,
        8,
        17
      ],
      [
        15,
        9,
        15,
        17
      ]
    ],
    "entry": [
      11,
      1,
      "entry-hall"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          8
        ],
        "from": "entry-hall",
        "to": "cookhouse"
      },
      {
        "at": [
          11,
          1,
          8
        ],
        "from": "entry-hall",
        "to": "sleeping"
      },
      {
        "at": [
          18,
          1,
          8
        ],
        "from": "entry-hall",
        "to": "workroom"
      }
    ],
    "rooms": [
      {
        "id": "entry-hall",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          21,
          4,
          8
        ]
      },
      {
        "id": "cookhouse",
        "min": [
          2,
          1,
          9
        ],
        "max": [
          8,
          4,
          18
        ]
      },
      {
        "id": "sleeping",
        "min": [
          9,
          1,
          9
        ],
        "max": [
          15,
          4,
          18
        ]
      },
      {
        "id": "workroom",
        "min": [
          16,
          1,
          9
        ],
        "max": [
          21,
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
        11,
        "west"
      ],
      [
        21,
        12,
        "east"
      ],
      [
        4,
        18,
        "south"
      ],
      [
        19,
        18,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 11,
        "z": 4,
        "room": "entry-hall",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 12,
        "room": "cookhouse",
        "asset": "pack4:057"
      },
      {
        "x": 10,
        "z": 11,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 18,
        "z": 12,
        "room": "workroom",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      5,
      18
    ],
    "detail": "wind-screen-great-room-and-three-private-bays"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "large",
    "index": 4,
    "title": "Qamar Caravan Innercourt Residence",
    "w": 29,
    "d": 26,
    "plan": "central-long-spine-with-side-domestic-wings-and-rear-lookout",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "segments": [
      [
        11,
        2,
        11,
        23
      ],
      [
        19,
        2,
        19,
        23
      ],
      [
        12,
        13,
        18,
        13
      ],
      [
        2,
        17,
        10,
        17
      ],
      [
        20,
        17,
        26,
        17
      ]
    ],
    "entry": [
      15,
      1,
      "spine"
    ],
    "doors": [
      {
        "at": [
          11,
          1,
          6
        ],
        "from": "spine",
        "to": "sleeping"
      },
      {
        "at": [
          19,
          1,
          6
        ],
        "from": "spine",
        "to": "kitchen"
      },
      {
        "at": [
          15,
          1,
          13
        ],
        "from": "spine",
        "to": "lookout"
      },
      {
        "at": [
          6,
          1,
          17
        ],
        "from": "sleeping",
        "to": "library"
      },
      {
        "at": [
          24,
          1,
          17
        ],
        "from": "kitchen",
        "to": "pantry"
      }
    ],
    "rooms": [
      {
        "id": "spine",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          19,
          4,
          13
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
          17
        ]
      },
      {
        "id": "kitchen",
        "min": [
          20,
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
        "id": "lookout",
        "min": [
          12,
          1,
          14
        ],
        "max": [
          19,
          4,
          24
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
          11,
          4,
          24
        ]
      },
      {
        "id": "pantry",
        "min": [
          20,
          1,
          18
        ],
        "max": [
          27,
          4,
          24
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
        11,
        "west"
      ],
      [
        27,
        12,
        "east"
      ],
      [
        4,
        24,
        "south"
      ],
      [
        24,
        24,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 15,
        "z": 4,
        "room": "spine",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 10,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 10,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 15,
        "z": 20,
        "room": "lookout",
        "asset": "pack5:084"
      },
      {
        "x": 5,
        "z": 21,
        "room": "library",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 21,
        "room": "pantry",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      6,
      24
    ],
    "detail": "long-desert-caravan-gallery-and-high-open-central-sun-shaft",
    "courtyard": [
      14,
      17,
      16,
      21
    ]
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "small",
    "index": 3,
    "title": "Hailstone Triple-Buffer Snowhouse",
    "w": 19,
    "d": 20,
    "plan": "front-vestibule-through-central-hearth-to-protected-rear-bed",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        2,
        6,
        16,
        6
      ],
      [
        2,
        12,
        16,
        12
      ]
    ],
    "entry": [
      9,
      1,
      "entry"
    ],
    "doors": [
      {
        "at": [
          6,
          1,
          6
        ],
        "from": "entry",
        "to": "hearth"
      },
      {
        "at": [
          12,
          1,
          12
        ],
        "from": "hearth",
        "to": "sleeping"
      }
    ],
    "rooms": [
      {
        "id": "entry",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          6
        ]
      },
      {
        "id": "hearth",
        "min": [
          2,
          1,
          7
        ],
        "max": [
          17,
          4,
          12
        ]
      },
      {
        "id": "sleeping",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          17,
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
        10,
        "west"
      ],
      [
        17,
        10,
        "east"
      ],
      [
        12,
        18,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 8,
        "z": 3,
        "room": "entry",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 9,
        "room": "hearth",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 9,
        "room": "hearth",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 14,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "posts": [
      4,
      15
    ],
    "detail": "three-successive-snow-breaks-with-front-anteroom"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "medium",
    "index": 5,
    "title": "Northglaze Crosswind Hallhouse",
    "w": 24,
    "d": 22,
    "plan": "wide-left-winter-gallery-linked-to-split-right-kitchen-and-sleeping-rooms",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        9,
        2,
        9,
        19
      ],
      [
        10,
        12,
        21,
        12
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
          9,
          1,
          6
        ],
        "from": "gallery",
        "to": "kitchen"
      },
      {
        "at": [
          16,
          1,
          12
        ],
        "from": "kitchen",
        "to": "sleeping"
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
          9,
          4,
          20
        ]
      },
      {
        "id": "kitchen",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          22,
          4,
          12
        ]
      },
      {
        "id": "sleeping",
        "min": [
          10,
          1,
          13
        ],
        "max": [
          22,
          4,
          20
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
        20,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        22,
        7,
        "east"
      ],
      [
        15,
        20,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 5,
        "z": 5,
        "room": "gallery",
        "asset": "pack4:064"
      },
      {
        "x": 16,
        "z": 5,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 12,
        "z": 15,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 5,
        "z": 16,
        "room": "gallery",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      4,
      20
    ],
    "detail": "snow-baffled-crosswind-side-gallery-and-protected-back-bed"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "large",
    "index": 4,
    "title": "Snowreach Stagwing Winterhouse",
    "w": 29,
    "d": 26,
    "plan": "deep-central-hall-linked-to-double-flank-bed-wings-and-observatory",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        10,
        2,
        10,
        23
      ],
      [
        18,
        2,
        18,
        23
      ],
      [
        11,
        14,
        17,
        14
      ]
    ],
    "entry": [
      14,
      1,
      "central"
    ],
    "doors": [
      {
        "at": [
          10,
          1,
          7
        ],
        "from": "central",
        "to": "west-rooms"
      },
      {
        "at": [
          18,
          1,
          8
        ],
        "from": "central",
        "to": "east-rooms"
      },
      {
        "at": [
          14,
          1,
          14
        ],
        "from": "central",
        "to": "observatory"
      }
    ],
    "rooms": [
      {
        "id": "central",
        "min": [
          11,
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
        "id": "west-rooms",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          10,
          4,
          24
        ]
      },
      {
        "id": "east-rooms",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          27,
          4,
          24
        ]
      },
      {
        "id": "observatory",
        "min": [
          11,
          1,
          15
        ],
        "max": [
          18,
          4,
          24
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
        10,
        "west"
      ],
      [
        27,
        10,
        "east"
      ],
      [
        5,
        24,
        "south"
      ],
      [
        24,
        24,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 14,
        "z": 5,
        "room": "central",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 14,
        "room": "west-rooms",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 22,
        "z": 15,
        "room": "east-rooms",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 14,
        "z": 20,
        "room": "observatory",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 8,
        "room": "east-rooms",
        "asset": "pack4:057"
      }
    ],
    "posts": [
      6,
      22
    ],
    "detail": "long-winter-axial-observatory-with-two-separate-sleeping-wings"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 3,
    "title": "Fernlume Split-Moss Cottage",
    "w": 17,
    "d": 20,
    "plan": "front-common-hall-into-paired-private-fern-bays",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        9,
        14,
        9
      ],
      [
        8,
        10,
        8,
        17
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
          4,
          1,
          9
        ],
        "from": "hearth",
        "to": "sleeping"
      },
      {
        "at": [
          8,
          1,
          13
        ],
        "from": "sleeping",
        "to": "cookery"
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
          8,
          4,
          18
        ]
      },
      {
        "id": "cookery",
        "min": [
          9,
          1,
          10
        ],
        "max": [
          15,
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
        13,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        15,
        13,
        "east"
      ],
      [
        12,
        18,
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
        "x": 3,
        "z": 12,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 12,
        "room": "cookery",
        "asset": "pack4:057"
      },
      {
        "x": 6,
        "z": 6,
        "room": "hearth",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      3,
      13
    ],
    "detail": "moss-roofed-fern-cottage-with-offset-private-rooms"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 4,
    "title": "Glimmerfern Inner-Bower Home",
    "w": 24,
    "d": 22,
    "plan": "front-festival-hall-distributing-to-three-asymmetric-rear-art-and-guest-wings",
    "roof": "butterfly",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        9,
        21,
        9
      ],
      [
        8,
        10,
        8,
        19
      ],
      [
        15,
        10,
        15,
        19
      ]
    ],
    "entry": [
      11,
      1,
      "front"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          9
        ],
        "from": "front",
        "to": "sleep"
      },
      {
        "at": [
          12,
          1,
          9
        ],
        "from": "front",
        "to": "bower"
      },
      {
        "at": [
          19,
          1,
          9
        ],
        "from": "front",
        "to": "work"
      }
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
          22,
          4,
          9
        ]
      },
      {
        "id": "sleep",
        "min": [
          2,
          1,
          10
        ],
        "max": [
          8,
          4,
          20
        ]
      },
      {
        "id": "bower",
        "min": [
          9,
          1,
          10
        ],
        "max": [
          15,
          4,
          20
        ]
      },
      {
        "id": "work",
        "min": [
          16,
          1,
          10
        ],
        "max": [
          22,
          4,
          20
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
        20,
        1,
        "north"
      ],
      [
        1,
        10,
        "west"
      ],
      [
        22,
        12,
        "east"
      ],
      [
        16,
        20,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 11,
        "z": 5,
        "room": "front",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 13,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 9,
        "z": 12,
        "room": "bower",
        "asset": "pack5:084"
      },
      {
        "x": 19,
        "z": 15,
        "room": "work",
        "asset": "pack4:057"
      }
    ],
    "posts": [
      5,
      20
    ],
    "detail": "tri-wing-festival-hall-with-open-greenhouse-court-and-butterfly-canopy",
    "courtyard": [
      11,
      13,
      13,
      16
    ]
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 4,
    "title": "Moonbloom Six-Branch Canopyhouse",
    "w": 29,
    "d": 27,
    "plan": "front-great-hall-to-open-court-and-four-rear-branches",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        9,
        26,
        9
      ],
      [
        11,
        10,
        11,
        24
      ],
      [
        19,
        10,
        19,
        24
      ],
      [
        2,
        18,
        10,
        18
      ],
      [
        20,
        18,
        26,
        18
      ]
    ],
    "entry": [
      14,
      1,
      "great"
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          9
        ],
        "from": "great",
        "to": "court"
      },
      {
        "at": [
          11,
          1,
          13
        ],
        "from": "court",
        "to": "sleep"
      },
      {
        "at": [
          19,
          1,
          14
        ],
        "from": "court",
        "to": "cook"
      },
      {
        "at": [
          5,
          1,
          18
        ],
        "from": "sleep",
        "to": "library"
      },
      {
        "at": [
          23,
          1,
          18
        ],
        "from": "cook",
        "to": "store"
      }
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
          27,
          4,
          9
        ]
      },
      {
        "id": "court",
        "min": [
          12,
          1,
          10
        ],
        "max": [
          19,
          4,
          25
        ]
      },
      {
        "id": "sleep",
        "min": [
          2,
          1,
          10
        ],
        "max": [
          11,
          4,
          18
        ]
      },
      {
        "id": "cook",
        "min": [
          20,
          1,
          10
        ],
        "max": [
          27,
          4,
          18
        ]
      },
      {
        "id": "library",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          11,
          4,
          25
        ]
      },
      {
        "id": "store",
        "min": [
          20,
          1,
          19
        ],
        "max": [
          27,
          4,
          25
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
        13,
        "west"
      ],
      [
        27,
        13,
        "east"
      ],
      [
        5,
        25,
        "south"
      ],
      [
        24,
        25,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 14,
        "z": 5,
        "room": "great",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 12,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 12,
        "room": "cook",
        "asset": "pack4:057"
      },
      {
        "x": 5,
        "z": 21,
        "room": "library",
        "asset": "pack5:084"
      },
      {
        "x": 23,
        "z": 21,
        "room": "store",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      6,
      23
    ],
    "detail": "canopyhouse-with-four-rear-branches-and-open-moonwell",
    "courtyard": [
      13,
      13,
      16,
      18
    ]
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "small",
    "index": 3,
    "title": "Slateford Backwall Hearth",
    "w": 19,
    "d": 18,
    "plan": "front-commons-with-unequal-rear-lodging-and-cooking-bays",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "segments": [
      [
        2,
        8,
        16,
        8
      ],
      [
        10,
        9,
        10,
        15
      ]
    ],
    "entry": [
      8,
      1,
      "commons"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          8
        ],
        "from": "commons",
        "to": "sleeping"
      },
      {
        "at": [
          10,
          1,
          11
        ],
        "from": "sleeping",
        "to": "kitchen"
      }
    ],
    "rooms": [
      {
        "id": "commons",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          8
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
          10,
          4,
          16
        ]
      },
      {
        "id": "kitchen",
        "min": [
          11,
          1,
          9
        ],
        "max": [
          17,
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
        15,
        1,
        "north"
      ],
      [
        1,
        11,
        "west"
      ],
      [
        17,
        9,
        "east"
      ],
      [
        13,
        16,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 8,
        "z": 4,
        "room": "commons",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 11,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 13,
        "z": 12,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 14,
        "z": 5,
        "room": "commons",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      4,
      15
    ],
    "detail": "ridge-stone-under-slate-with-offset-back-fire"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "medium",
    "index": 4,
    "title": "Cairnwick Valley Gallery House",
    "w": 24,
    "d": 22,
    "plan": "front-stone-hearth-rear-triple-branch-pantry-bed-and-atelier",
    "roof": "hip",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "segments": [
      [
        2,
        9,
        21,
        9
      ],
      [
        8,
        10,
        8,
        19
      ],
      [
        16,
        10,
        16,
        19
      ]
    ],
    "entry": [
      12,
      1,
      "hearth"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          9
        ],
        "from": "hearth",
        "to": "pantry"
      },
      {
        "at": [
          12,
          1,
          9
        ],
        "from": "hearth",
        "to": "sleep"
      },
      {
        "at": [
          19,
          1,
          9
        ],
        "from": "hearth",
        "to": "atelier"
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
          22,
          4,
          9
        ]
      },
      {
        "id": "pantry",
        "min": [
          2,
          1,
          10
        ],
        "max": [
          8,
          4,
          20
        ]
      },
      {
        "id": "sleep",
        "min": [
          9,
          1,
          10
        ],
        "max": [
          16,
          4,
          20
        ]
      },
      {
        "id": "atelier",
        "min": [
          17,
          1,
          10
        ],
        "max": [
          22,
          4,
          20
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
        20,
        1,
        "north"
      ],
      [
        1,
        10,
        "west"
      ],
      [
        22,
        11,
        "east"
      ],
      [
        17,
        20,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 12,
        "z": 4,
        "room": "hearth",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 14,
        "room": "pantry",
        "asset": "pack4:057"
      },
      {
        "x": 11,
        "z": 13,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 15,
        "room": "atelier",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      5,
      18
    ],
    "detail": "stone-crest-hearth-with-three-rear-service-wings-and-gallery-overhang"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 5,
    "title": "Highcairn Open-Atrium Ridgehome",
    "w": 31,
    "d": 27,
    "plan": "deep-stone-central-spine-flanked-by-double-wing-library-and-bedrooms",
    "roof": "courtyard",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "segments": [
      [
        12,
        2,
        12,
        24
      ],
      [
        20,
        2,
        20,
        24
      ],
      [
        13,
        15,
        19,
        15
      ],
      [
        2,
        18,
        11,
        18
      ],
      [
        21,
        18,
        28,
        18
      ]
    ],
    "entry": [
      16,
      1,
      "atrium"
    ],
    "doors": [
      {
        "at": [
          12,
          1,
          7
        ],
        "from": "atrium",
        "to": "sleep"
      },
      {
        "at": [
          20,
          1,
          8
        ],
        "from": "atrium",
        "to": "kitchen"
      },
      {
        "at": [
          16,
          1,
          15
        ],
        "from": "atrium",
        "to": "gallery"
      },
      {
        "at": [
          6,
          1,
          18
        ],
        "from": "sleep",
        "to": "library"
      },
      {
        "at": [
          25,
          1,
          18
        ],
        "from": "kitchen",
        "to": "larder"
      }
    ],
    "rooms": [
      {
        "id": "atrium",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          20,
          4,
          15
        ]
      },
      {
        "id": "sleep",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          12,
          4,
          18
        ]
      },
      {
        "id": "kitchen",
        "min": [
          21,
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
        "id": "gallery",
        "min": [
          13,
          1,
          16
        ],
        "max": [
          20,
          4,
          25
        ]
      },
      {
        "id": "library",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          12,
          4,
          25
        ]
      },
      {
        "id": "larder",
        "min": [
          21,
          1,
          19
        ],
        "max": [
          29,
          4,
          25
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
        26,
        1,
        "north"
      ],
      [
        1,
        13,
        "west"
      ],
      [
        29,
        13,
        "east"
      ],
      [
        5,
        25,
        "south"
      ],
      [
        26,
        25,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 16,
        "z": 4,
        "room": "atrium",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 12,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 11,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 16,
        "z": 21,
        "room": "gallery",
        "asset": "pack5:084"
      },
      {
        "x": 6,
        "z": 21,
        "room": "library",
        "asset": "pack5:084"
      },
      {
        "x": 26,
        "z": 21,
        "room": "larder",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      6,
      25
    ],
    "detail": "high-altitude-open-atrium-with-west-library-east-service-and-long-glassline",
    "courtyard": [
      15,
      9,
      18,
      13
    ]
  }
]);

export const M2_HOUSING_WAVE2_IDS=Object.freeze(SPECS.map(x=>'r1:house:'+x.biome+':'+x.size+':'+String(x.index).padStart(3,'0')));
export function getM2HousingWave2(){return SPECS.map(compileM2ArchitecturalSpec);}
