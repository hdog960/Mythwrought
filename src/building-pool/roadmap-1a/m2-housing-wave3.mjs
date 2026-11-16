// Builder 1A: third set of 15 distinct one-floor coordinate-authored houses across all biome/size combinations.
// Room nodes, physical wall partitions, true open passage cells, annotated family dependencies.
// No gameplay side effects, random generation, live block placement, or runtime/save modifications.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "temperate",
    "size": "small",
    "index": 4,
    "title": "Willowbridge Side-Gallery Home",
    "w": 20,
    "d": 18,
    "plan": "west-east-gallery-with-private-cooking-and-sleeping-two-bay-wing",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "segments": [
      [
        9,
        2,
        9,
        15
      ],
      [
        10,
        9,
        17,
        9
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
          5
        ],
        "from": "gallery",
        "to": "cook"
      },
      {
        "at": [
          13,
          1,
          9
        ],
        "from": "cook",
        "to": "sleep"
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
          16
        ]
      },
      {
        "id": "cook",
        "min": [
          10,
          1,
          2
        ],
        "max": [
          18,
          4,
          9
        ]
      },
      {
        "id": "sleep",
        "min": [
          10,
          1,
          10
        ],
        "max": [
          18,
          4,
          16
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
        10,
        "west"
      ],
      [
        18,
        8,
        "east"
      ],
      [
        12,
        16,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 5,
        "z": 4,
        "room": "gallery",
        "asset": "pack4:064"
      },
      {
        "x": 14,
        "z": 5,
        "room": "cook",
        "asset": "pack4:057"
      },
      {
        "x": 11,
        "z": 11,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 4,
        "z": 13,
        "room": "gallery",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      3,
      16
    ],
    "detail": "riverfront-gallery-and-deep-staggered-bedroom"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "medium",
    "index": 5,
    "title": "Rivermead Three-Wing House",
    "w": 26,
    "d": 21,
    "plan": "festival-front-room-with-three-different-private-rear-wings",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        9,
        23,
        9
      ],
      [
        9,
        10,
        9,
        18
      ],
      [
        17,
        10,
        17,
        18
      ]
    ],
    "entry": [
      13,
      1,
      "great"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          9
        ],
        "from": "great",
        "to": "pantry"
      },
      {
        "at": [
          13,
          1,
          9
        ],
        "from": "great",
        "to": "bedroom"
      },
      {
        "at": [
          21,
          1,
          9
        ],
        "from": "great",
        "to": "library"
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
          24,
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
          9,
          4,
          19
        ]
      },
      {
        "id": "bedroom",
        "min": [
          10,
          1,
          10
        ],
        "max": [
          17,
          4,
          19
        ]
      },
      {
        "id": "library",
        "min": [
          18,
          1,
          10
        ],
        "max": [
          24,
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
        21,
        1,
        "north"
      ],
      [
        1,
        12,
        "west"
      ],
      [
        24,
        13,
        "east"
      ],
      [
        4,
        19,
        "south"
      ],
      [
        21,
        19,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 13,
        "z": 5,
        "room": "great",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 13,
        "room": "pantry",
        "asset": "pack4:057"
      },
      {
        "x": 12,
        "z": 12,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 20,
        "z": 15,
        "room": "library",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      4,
      22
    ],
    "detail": "three-distinct-service-bays-behind-deep-timber-great-room"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "large",
    "index": 5,
    "title": "Coppice Watchlight Hall",
    "w": 31,
    "d": 27,
    "plan": "two-sided-cross-gallery-and-four-private-flanking-chambers",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "segments": [
      [
        10,
        2,
        10,
        24
      ],
      [
        20,
        2,
        20,
        24
      ],
      [
        11,
        13,
        19,
        13
      ],
      [
        2,
        17,
        9,
        17
      ],
      [
        21,
        17,
        28,
        17
      ]
    ],
    "entry": [
      15,
      1,
      "front-gallery"
    ],
    "doors": [
      {
        "at": [
          10,
          1,
          6
        ],
        "from": "front-gallery",
        "to": "family"
      },
      {
        "at": [
          20,
          1,
          7
        ],
        "from": "front-gallery",
        "to": "kitchen"
      },
      {
        "at": [
          15,
          1,
          13
        ],
        "from": "front-gallery",
        "to": "back-gallery"
      },
      {
        "at": [
          6,
          1,
          17
        ],
        "from": "family",
        "to": "study"
      },
      {
        "at": [
          25,
          1,
          17
        ],
        "from": "kitchen",
        "to": "larder"
      }
    ],
    "rooms": [
      {
        "id": "front-gallery",
        "min": [
          11,
          1,
          2
        ],
        "max": [
          20,
          4,
          13
        ]
      },
      {
        "id": "back-gallery",
        "min": [
          11,
          1,
          14
        ],
        "max": [
          20,
          4,
          25
        ]
      },
      {
        "id": "family",
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
        "id": "study",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          10,
          4,
          25
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
          17
        ]
      },
      {
        "id": "larder",
        "min": [
          21,
          1,
          18
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
        10,
        "west"
      ],
      [
        29,
        9,
        "east"
      ],
      [
        5,
        25,
        "south"
      ],
      [
        25,
        25,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 15,
        "z": 5,
        "room": "front-gallery",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 11,
        "room": "family",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 10,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 15,
        "z": 20,
        "room": "back-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 6,
        "z": 21,
        "room": "study",
        "asset": "pack4:059"
      },
      {
        "x": 25,
        "z": 22,
        "room": "larder",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      6,
      24
    ],
    "detail": "cross-axial-watchlight-longhouse-with-split-gallery-massing"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "small",
    "index": 5,
    "title": "Mirage Saltcourt Adobe Home",
    "w": 18,
    "d": 19,
    "plan": "front-sunroom-with-rear-bedroom-and-lateral-kitchen-niche",
    "roof": "terrace",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "segments": [
      [
        2,
        9,
        15,
        9
      ],
      [
        9,
        10,
        9,
        16
      ]
    ],
    "entry": [
      7,
      1,
      "sunroom"
    ],
    "doors": [
      {
        "at": [
          4,
          1,
          9
        ],
        "from": "sunroom",
        "to": "bed"
      },
      {
        "at": [
          9,
          1,
          13
        ],
        "from": "bed",
        "to": "cooking"
      }
    ],
    "rooms": [
      {
        "id": "sunroom",
        "min": [
          2,
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
        "id": "bed",
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
        "id": "cooking",
        "min": [
          10,
          1,
          10
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
        14,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        16,
        11,
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
        "x": 6,
        "z": 4,
        "room": "sunroom",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 12,
        "room": "bed",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 13,
        "room": "cooking",
        "asset": "pack4:057"
      },
      {
        "x": 13,
        "z": 5,
        "room": "sunroom",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      3,
      14
    ],
    "detail": "salt-stained-adobe-and-lateral-cooking-loggia"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "medium",
    "index": 5,
    "title": "Hajar Screened Windcourt",
    "w": 22,
    "d": 23,
    "plan": "west-breezeway-giving-side-kitchen-and-a-rear-sleeping-niche",
    "roof": "butterfly",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "segments": [
      [
        8,
        2,
        8,
        20
      ],
      [
        9,
        12,
        19,
        12
      ],
      [
        2,
        16,
        7,
        16
      ]
    ],
    "entry": [
      5,
      1,
      "breezeway"
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          6
        ],
        "from": "breezeway",
        "to": "cooking"
      },
      {
        "at": [
          14,
          1,
          12
        ],
        "from": "cooking",
        "to": "sleep"
      },
      {
        "at": [
          5,
          1,
          16
        ],
        "from": "breezeway",
        "to": "storage"
      }
    ],
    "rooms": [
      {
        "id": "breezeway",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          8,
          4,
          16
        ]
      },
      {
        "id": "storage",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          8,
          4,
          21
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
          20,
          4,
          12
        ]
      },
      {
        "id": "sleep",
        "min": [
          9,
          1,
          13
        ],
        "max": [
          20,
          4,
          21
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
        18,
        1,
        "north"
      ],
      [
        1,
        10,
        "west"
      ],
      [
        20,
        7,
        "east"
      ],
      [
        15,
        21,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 5,
        "z": 5,
        "room": "breezeway",
        "asset": "pack4:064"
      },
      {
        "x": 15,
        "z": 6,
        "room": "cooking",
        "asset": "pack4:057"
      },
      {
        "x": 11,
        "z": 15,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 4,
        "z": 18,
        "room": "storage",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      4,
      18
    ],
    "detail": "screened-crosswind-gallery-with-hidden-sleep-and-storage"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "large",
    "index": 5,
    "title": "Sirocco Six-Court Residence",
    "w": 30,
    "d": 28,
    "plan": "deep-great-room-to-open-sunwell-and-four-private-bays",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "segments": [
      [
        2,
        10,
        27,
        10
      ],
      [
        10,
        11,
        10,
        25
      ],
      [
        20,
        11,
        20,
        25
      ],
      [
        2,
        19,
        9,
        19
      ],
      [
        21,
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
    "doors": [
      {
        "at": [
          15,
          1,
          10
        ],
        "from": "great",
        "to": "court"
      },
      {
        "at": [
          10,
          1,
          14
        ],
        "from": "court",
        "to": "sleeping"
      },
      {
        "at": [
          20,
          1,
          14
        ],
        "from": "court",
        "to": "kitchen"
      },
      {
        "at": [
          5,
          1,
          10
        ],
        "from": "great",
        "to": "sleeping"
      },
      {
        "at": [
          5,
          1,
          19
        ],
        "from": "sleeping",
        "to": "archive"
      },
      {
        "at": [
          24,
          1,
          19
        ],
        "from": "kitchen",
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
          28,
          4,
          10
        ]
      },
      {
        "id": "court",
        "min": [
          11,
          1,
          11
        ],
        "max": [
          20,
          4,
          26
        ]
      },
      {
        "id": "sleeping",
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
        "id": "kitchen",
        "min": [
          21,
          1,
          11
        ],
        "max": [
          28,
          4,
          19
        ]
      },
      {
        "id": "archive",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          10,
          4,
          26
        ]
      },
      {
        "id": "store",
        "min": [
          21,
          1,
          20
        ],
        "max": [
          28,
          4,
          26
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
        25,
        1,
        "north"
      ],
      [
        1,
        15,
        "west"
      ],
      [
        28,
        13,
        "east"
      ],
      [
        5,
        26,
        "south"
      ],
      [
        25,
        26,
        "south"
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
        "x": 3,
        "z": 13,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 13,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 15,
        "z": 23,
        "room": "court",
        "asset": "pack4:059"
      },
      {
        "x": 5,
        "z": 23,
        "room": "archive",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 23,
        "room": "store",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      6,
      24
    ],
    "detail": "open-desert-well-under-stepped-terraces-and-split-room-wings",
    "courtyard": [
      13,
      14,
      17,
      18
    ],
    "courtRoofMassing": "ascending-terraces"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "small",
    "index": 4,
    "title": "Snowmelt Triple-Screen Cabin",
    "w": 19,
    "d": 22,
    "plan": "three-threshold-snowhouse-from-front-vestibule-to-fire-and-sleep",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        2,
        7,
        16,
        7
      ],
      [
        2,
        14,
        16,
        14
      ]
    ],
    "entry": [
      9,
      1,
      "vestibule"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          7
        ],
        "from": "vestibule",
        "to": "hearth"
      },
      {
        "at": [
          12,
          1,
          14
        ],
        "from": "hearth",
        "to": "bedroom"
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
          17,
          4,
          7
        ]
      },
      {
        "id": "hearth",
        "min": [
          2,
          1,
          8
        ],
        "max": [
          17,
          4,
          14
        ]
      },
      {
        "id": "bedroom",
        "min": [
          2,
          1,
          15
        ],
        "max": [
          17,
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
        16,
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
        12,
        20,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 9,
        "z": 4,
        "room": "vestibule",
        "asset": "pack4:059"
      },
      {
        "x": 6,
        "z": 10,
        "room": "hearth",
        "asset": "pack4:064"
      },
      {
        "x": 13,
        "z": 10,
        "room": "hearth",
        "asset": "pack4:057"
      },
      {
        "x": 4,
        "z": 17,
        "room": "bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "posts": [
      4,
      15
    ],
    "detail": "three-warmth-baffles-with-snowcap-protection"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "medium",
    "index": 6,
    "title": "Pinefrost Central-Bastion House",
    "w": 25,
    "d": 23,
    "plan": "center-hearth-leading-to-two-wide-side-wings-and-rear-workshop",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        10,
        2,
        10,
        20
      ],
      [
        15,
        2,
        15,
        20
      ],
      [
        11,
        13,
        14,
        13
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
          10,
          1,
          6
        ],
        "from": "hearth",
        "to": "sleep"
      },
      {
        "at": [
          15,
          1,
          7
        ],
        "from": "hearth",
        "to": "kitchen"
      },
      {
        "at": [
          12,
          1,
          13
        ],
        "from": "hearth",
        "to": "work"
      }
    ],
    "rooms": [
      {
        "id": "hearth",
        "min": [
          11,
          1,
          2
        ],
        "max": [
          15,
          4,
          13
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
          10,
          4,
          21
        ]
      },
      {
        "id": "kitchen",
        "min": [
          16,
          1,
          2
        ],
        "max": [
          23,
          4,
          21
        ]
      },
      {
        "id": "work",
        "min": [
          11,
          1,
          14
        ],
        "max": [
          15,
          4,
          21
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
        21,
        1,
        "north"
      ],
      [
        1,
        9,
        "west"
      ],
      [
        23,
        9,
        "east"
      ],
      [
        12,
        21,
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
        "x": 3,
        "z": 11,
        "room": "sleep",
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
        "x": 12,
        "z": 16,
        "room": "work",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      5,
      20
    ],
    "detail": "central-bastion-with-side-thermal-service-wings"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "large",
    "index": 5,
    "title": "Icereach Starlit Longhouse",
    "w": 31,
    "d": 29,
    "plan": "snow-longhouse-with-axial-observatory-and-four-private-wing-chambers",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "segments": [
      [
        11,
        2,
        11,
        26
      ],
      [
        20,
        2,
        20,
        26
      ],
      [
        12,
        10,
        19,
        10
      ],
      [
        2,
        18,
        10,
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
      15,
      1,
      "front"
    ],
    "doors": [
      {
        "at": [
          11,
          1,
          7
        ],
        "from": "front",
        "to": "west-family"
      },
      {
        "at": [
          20,
          1,
          7
        ],
        "from": "front",
        "to": "east-service"
      },
      {
        "at": [
          15,
          1,
          10
        ],
        "from": "front",
        "to": "observatory"
      },
      {
        "at": [
          6,
          1,
          18
        ],
        "from": "west-family",
        "to": "sleeping"
      },
      {
        "at": [
          25,
          1,
          18
        ],
        "from": "east-service",
        "to": "storage"
      }
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
          20,
          4,
          10
        ]
      },
      {
        "id": "observatory",
        "min": [
          12,
          1,
          11
        ],
        "max": [
          20,
          4,
          27
        ]
      },
      {
        "id": "west-family",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          11,
          4,
          18
        ]
      },
      {
        "id": "sleeping",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          11,
          4,
          27
        ]
      },
      {
        "id": "east-service",
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
        "id": "storage",
        "min": [
          21,
          1,
          19
        ],
        "max": [
          29,
          4,
          27
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
        11,
        "west"
      ],
      [
        29,
        12,
        "east"
      ],
      [
        4,
        27,
        "south"
      ],
      [
        27,
        27,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 15,
        "z": 4,
        "room": "front",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 11,
        "room": "west-family",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 5,
        "z": 22,
        "room": "sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 12,
        "room": "east-service",
        "asset": "pack4:057"
      },
      {
        "x": 15,
        "z": 22,
        "room": "observatory",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 24,
        "room": "storage",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      5,
      25
    ],
    "detail": "star-watching-central-axis-with-winter-walled-bedrooms"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 4,
    "title": "Thistleglow Side-Bower Cottage",
    "w": 20,
    "d": 19,
    "plan": "front-forest-bower-leading-to-split-cooking-and-nursery-wing",
    "roof": "butterfly",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        8,
        2,
        8,
        16
      ],
      [
        9,
        10,
        17,
        10
      ]
    ],
    "entry": [
      5,
      1,
      "bower"
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          5
        ],
        "from": "bower",
        "to": "kitchen"
      },
      {
        "at": [
          13,
          1,
          10
        ],
        "from": "kitchen",
        "to": "nursery"
      }
    ],
    "rooms": [
      {
        "id": "bower",
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
          9,
          1,
          2
        ],
        "max": [
          18,
          4,
          10
        ]
      },
      {
        "id": "nursery",
        "min": [
          9,
          1,
          11
        ],
        "max": [
          18,
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
        16,
        1,
        "north"
      ],
      [
        1,
        9,
        "west"
      ],
      [
        18,
        6,
        "east"
      ],
      [
        15,
        17,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 5,
        "z": 4,
        "room": "bower",
        "asset": "pack4:064"
      },
      {
        "x": 13,
        "z": 6,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 11,
        "z": 12,
        "room": "nursery",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 4,
        "z": 14,
        "room": "bower",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      4,
      16
    ],
    "detail": "arcane-bower-with-offset-nursery-and-lantern-lintel"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 5,
    "title": "Elderfern Triple-Garden Home",
    "w": 24,
    "d": 24,
    "plan": "woodland-banqueting-front-with-three-standalone-bower-wings",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        10,
        21,
        10
      ],
      [
        9,
        11,
        9,
        21
      ],
      [
        16,
        11,
        16,
        21
      ]
    ],
    "entry": [
      12,
      1,
      "banquet"
    ],
    "doors": [
      {
        "at": [
          5,
          1,
          10
        ],
        "from": "banquet",
        "to": "sleep"
      },
      {
        "at": [
          12,
          1,
          10
        ],
        "from": "banquet",
        "to": "atrium"
      },
      {
        "at": [
          19,
          1,
          10
        ],
        "from": "banquet",
        "to": "work"
      }
    ],
    "rooms": [
      {
        "id": "banquet",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          22,
          4,
          10
        ]
      },
      {
        "id": "sleep",
        "min": [
          2,
          1,
          11
        ],
        "max": [
          9,
          4,
          22
        ]
      },
      {
        "id": "atrium",
        "min": [
          10,
          1,
          11
        ],
        "max": [
          16,
          4,
          22
        ]
      },
      {
        "id": "work",
        "min": [
          17,
          1,
          11
        ],
        "max": [
          22,
          4,
          22
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
        12,
        "west"
      ],
      [
        22,
        12,
        "east"
      ],
      [
        5,
        22,
        "south"
      ],
      [
        19,
        22,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 12,
        "z": 5,
        "room": "banquet",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 13,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 18,
        "z": 14,
        "room": "work",
        "asset": "pack5:084"
      },
      {
        "x": 12,
        "z": 19,
        "room": "atrium",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      4,
      20
    ],
    "detail": "three-branch-garden-house-and-open-greenhouse",
    "courtyard": [
      11,
      14,
      14,
      18
    ],
    "courtRoofMassing": "hip-ring"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 5,
    "title": "Starmoss Family Cloister",
    "w": 30,
    "d": 28,
    "plan": "open-moonwell-cloister-between-family-music-kitchen-and-library",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "segments": [
      [
        2,
        9,
        27,
        9
      ],
      [
        10,
        10,
        10,
        25
      ],
      [
        20,
        10,
        20,
        25
      ],
      [
        2,
        18,
        9,
        18
      ],
      [
        21,
        18,
        27,
        18
      ]
    ],
    "entry": [
      14,
      1,
      "hall"
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          9
        ],
        "from": "hall",
        "to": "courtyard"
      },
      {
        "at": [
          10,
          1,
          14
        ],
        "from": "courtyard",
        "to": "sleep"
      },
      {
        "at": [
          20,
          1,
          14
        ],
        "from": "courtyard",
        "to": "kitchen"
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
          24,
          1,
          18
        ],
        "from": "kitchen",
        "to": "music"
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
          28,
          4,
          9
        ]
      },
      {
        "id": "courtyard",
        "min": [
          11,
          1,
          10
        ],
        "max": [
          20,
          4,
          26
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
          10,
          4,
          18
        ]
      },
      {
        "id": "kitchen",
        "min": [
          21,
          1,
          10
        ],
        "max": [
          28,
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
          10,
          4,
          26
        ]
      },
      {
        "id": "music",
        "min": [
          21,
          1,
          19
        ],
        "max": [
          28,
          4,
          26
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
        14,
        "west"
      ],
      [
        28,
        13,
        "east"
      ],
      [
        5,
        26,
        "south"
      ],
      [
        25,
        26,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 14,
        "z": 5,
        "room": "hall",
        "asset": "pack4:064"
      },
      {
        "x": 3,
        "z": 13,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 13,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 14,
        "z": 22,
        "room": "courtyard",
        "asset": "pack4:059"
      },
      {
        "x": 5,
        "z": 22,
        "room": "library",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 23,
        "room": "music",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      6,
      25
    ],
    "detail": "six-room-cloister-under-open-moonwell-ribbed-roof",
    "courtyard": [
      13,
      13,
      17,
      18
    ],
    "courtRoofMassing": "lantern-ribs"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "small",
    "index": 4,
    "title": "Highstone Back-Niche House",
    "w": 17,
    "d": 21,
    "plan": "three-stage-stone-dwelling-with-front-hearth-and-rear-service",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "segments": [
      [
        2,
        8,
        14,
        8
      ],
      [
        2,
        15,
        14,
        15
      ]
    ],
    "entry": [
      7,
      1,
      "hearth"
    ],
    "doors": [
      {
        "at": [
          4,
          1,
          8
        ],
        "from": "hearth",
        "to": "sleep"
      },
      {
        "at": [
          11,
          1,
          15
        ],
        "from": "sleep",
        "to": "store"
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
          8
        ]
      },
      {
        "id": "sleep",
        "min": [
          2,
          1,
          9
        ],
        "max": [
          15,
          4,
          15
        ]
      },
      {
        "id": "store",
        "min": [
          2,
          1,
          16
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
        10,
        "west"
      ],
      [
        15,
        11,
        "east"
      ],
      [
        12,
        19,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "hearth",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 11,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 17,
        "room": "store",
        "asset": "pack4:057"
      },
      {
        "x": 12,
        "z": 5,
        "room": "hearth",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      3,
      13
    ],
    "detail": "rear-niche-stone-privacy-chamber-under-sawtooth-gable"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "medium",
    "index": 5,
    "title": "Stonewake Four-Quarter Residence",
    "w": 26,
    "d": 23,
    "plan": "stone-side-gallery-to-cross-wing-kitchen-bedroom-and-studio",
    "roof": "hip",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "segments": [
      [
        11,
        2,
        11,
        20
      ],
      [
        12,
        12,
        23,
        12
      ],
      [
        2,
        16,
        10,
        16
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
          11,
          1,
          6
        ],
        "from": "gallery",
        "to": "cook"
      },
      {
        "at": [
          17,
          1,
          12
        ],
        "from": "cook",
        "to": "sleep"
      },
      {
        "at": [
          6,
          1,
          16
        ],
        "from": "gallery",
        "to": "study"
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
          11,
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
          11,
          4,
          21
        ]
      },
      {
        "id": "cook",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          24,
          4,
          12
        ]
      },
      {
        "id": "sleep",
        "min": [
          12,
          1,
          13
        ],
        "max": [
          24,
          4,
          21
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
        24,
        12,
        "east"
      ],
      [
        17,
        21,
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
        "x": 17,
        "z": 6,
        "room": "cook",
        "asset": "pack4:057"
      },
      {
        "x": 14,
        "z": 15,
        "room": "sleep",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 5,
        "z": 18,
        "room": "study",
        "asset": "pack5:084"
      }
    ],
    "posts": [
      4,
      22
    ],
    "detail": "broad-valley-walled-gallery-and-rear-apprentice-bay"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 6,
    "title": "Skyforge Split-Gallery Residence",
    "w": 33,
    "d": 27,
    "plan": "split-mountain-ridge-home-with-private-side-wings-and-gallery",
    "roof": "hip",
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
        21,
        2,
        21,
        24
      ],
      [
        13,
        15,
        20,
        15
      ],
      [
        2,
        18,
        11,
        18
      ],
      [
        22,
        18,
        30,
        18
      ]
    ],
    "entry": [
      16,
      1,
      "main"
    ],
    "doors": [
      {
        "at": [
          12,
          1,
          8
        ],
        "from": "main",
        "to": "sleep"
      },
      {
        "at": [
          21,
          1,
          8
        ],
        "from": "main",
        "to": "kitchen"
      },
      {
        "at": [
          16,
          1,
          15
        ],
        "from": "main",
        "to": "view"
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
          26,
          1,
          18
        ],
        "from": "kitchen",
        "to": "store"
      }
    ],
    "rooms": [
      {
        "id": "main",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          21,
          4,
          15
        ]
      },
      {
        "id": "view",
        "min": [
          13,
          1,
          16
        ],
        "max": [
          21,
          4,
          25
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
        "id": "kitchen",
        "min": [
          22,
          1,
          2
        ],
        "max": [
          31,
          4,
          18
        ]
      },
      {
        "id": "store",
        "min": [
          22,
          1,
          19
        ],
        "max": [
          31,
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
        28,
        1,
        "north"
      ],
      [
        1,
        12,
        "west"
      ],
      [
        31,
        12,
        "east"
      ],
      [
        5,
        25,
        "south"
      ],
      [
        28,
        25,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 16,
        "z": 5,
        "room": "main",
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
        "x": 26,
        "z": 12,
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 16,
        "z": 20,
        "room": "view",
        "asset": "pack5:084"
      },
      {
        "x": 5,
        "z": 22,
        "room": "library",
        "asset": "pack4:059"
      },
      {
        "x": 28,
        "z": 22,
        "room": "store",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      6,
      25
    ],
    "detail": "deep-slate-ridge-viewing-gallery-and-east-west-study-wings"
  }
]);
export const M2_HOUSING_WAVE3_IDS=Object.freeze(SPECS.map(s=>'r1:house:'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getM2HousingWave3(){return SPECS.map(compileM2ArchitecturalSpec);}
