// Builder 1A wave9: 22 standalone coordinate-authored 3D home candidates, not placed or registered.
// Per house: literal footprint void masks, room coordinates, partition endpoints, door throats, source fixtures and roof-bearing wings.
// All historical 149 candidates preserved; no sibling builder or shared-engine imports.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "temperate",
    "size": "small",
    "index": 13,
    "title": "Briarford Riverfork Cottage",
    "w": 26,
    "d": 25,
    "plan": "briarford-riverfork-cottage-u-original-room-massing",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        7,
        13,
        17,
        24
      ],
      [
        21,
        17,
        25,
        24
      ]
    ],
    "segments": [
      [
        13,
        2,
        13,
        10
      ],
      [
        2,
        11,
        7,
        11
      ],
      [
        19,
        11,
        23,
        11
      ]
    ],
    "entry": [
      17,
      1,
      "hearth-hall"
    ],
    "rooms": [
      {
        "id": "workroom",
        "min": [
          2,
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
        "id": "hearth-hall",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          24,
          4,
          11
        ]
      },
      {
        "id": "garden-suite",
        "min": [
          2,
          1,
          12
        ],
        "max": [
          8,
          4,
          24
        ]
      },
      {
        "id": "lantern-kitchen",
        "min": [
          19,
          1,
          12
        ],
        "max": [
          24,
          4,
          24
        ]
      }
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          5
        ],
        "from": "hearth-hall",
        "to": "workroom"
      },
      {
        "at": [
          5,
          1,
          11
        ],
        "from": "workroom",
        "to": "garden-suite"
      },
      {
        "at": [
          21,
          1,
          11
        ],
        "from": "hearth-hall",
        "to": "lantern-kitchen"
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
        7,
        "west"
      ],
      [
        24,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 5,
        "room": "workroom",
        "asset": "pack5:084"
      },
      {
        "x": 17,
        "z": 5,
        "room": "hearth-hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 15,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 15,
        "room": "lantern-kitchen",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "cross-front-bearing-beam",
        "rect": [
          0,
          0,
          25,
          11
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "west-sleeping-slope",
        "rect": [
          0,
          12,
          8,
          24
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "east-cook-bay",
        "rect": [
          18,
          12,
          25,
          24
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      3,
      22
    ],
    "detail": "U original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "medium",
    "index": 10,
    "title": "Bellhollow West Orchard Hall",
    "w": 33,
    "d": 31,
    "plan": "bellhollow-west-orchard-hall-lw-original-room-massing",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        14,
        11,
        30
      ],
      [
        28,
        24,
        32,
        30
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        12
      ],
      [
        13,
        13,
        30,
        13
      ],
      [
        13,
        21,
        30,
        21
      ]
    ],
    "entry": [
      22,
      1,
      "gathering-room"
    ],
    "rooms": [
      {
        "id": "front-workshop",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          13
        ]
      },
      {
        "id": "gathering-room",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          31,
          4,
          13
        ]
      },
      {
        "id": "rear-gallery",
        "min": [
          13,
          1,
          14
        ],
        "max": [
          31,
          4,
          21
        ]
      },
      {
        "id": "sleeping-suite",
        "min": [
          13,
          1,
          22
        ],
        "max": [
          31,
          4,
          30
        ]
      }
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          5
        ],
        "from": "gathering-room",
        "to": "front-workshop"
      },
      {
        "at": [
          28,
          1,
          13
        ],
        "from": "gathering-room",
        "to": "rear-gallery"
      },
      {
        "at": [
          28,
          1,
          21
        ],
        "from": "rear-gallery",
        "to": "sleeping-suite"
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
        "x": 4,
        "z": 5,
        "room": "front-workshop",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 5,
        "room": "gathering-room",
        "asset": "pack4:064"
      },
      {
        "x": 16,
        "z": 16,
        "room": "rear-gallery",
        "asset": "pack4:057"
      },
      {
        "x": 16,
        "z": 23,
        "room": "sleeping-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-gable",
        "rect": [
          0,
          0,
          32,
          13
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "lean-into-ridge",
        "rect": [
          12,
          14,
          32,
          30
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      3,
      29
    ],
    "detail": "LW original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "large",
    "index": 10,
    "title": "Highmere Three-Bell Homestead",
    "w": 43,
    "d": 39,
    "plan": "highmere-three-bell-homestead-t-original-room-massing",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        18,
        11,
        38
      ],
      [
        30,
        18,
        42,
        38
      ],
      [
        0,
        9,
        6,
        16
      ]
    ],
    "segments": [
      [
        15,
        2,
        15,
        15
      ],
      [
        28,
        2,
        28,
        15
      ],
      [
        15,
        16,
        28,
        16
      ],
      [
        15,
        31,
        28,
        31
      ]
    ],
    "entry": [
      21,
      1,
      "central-hall"
    ],
    "rooms": [
      {
        "id": "western-atelier",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          16
        ]
      },
      {
        "id": "central-hall",
        "min": [
          16,
          1,
          2
        ],
        "max": [
          28,
          4,
          16
        ]
      },
      {
        "id": "eastern-pantry",
        "min": [
          29,
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
        "id": "spine-gallery",
        "min": [
          15,
          1,
          17
        ],
        "max": [
          29,
          4,
          31
        ]
      },
      {
        "id": "private-rest",
        "min": [
          15,
          1,
          32
        ],
        "max": [
          29,
          4,
          38
        ]
      }
    ],
    "doors": [
      {
        "at": [
          15,
          1,
          5
        ],
        "from": "central-hall",
        "to": "western-atelier"
      },
      {
        "at": [
          28,
          1,
          5
        ],
        "from": "central-hall",
        "to": "eastern-pantry"
      },
      {
        "at": [
          21,
          1,
          16
        ],
        "from": "central-hall",
        "to": "spine-gallery"
      },
      {
        "at": [
          21,
          1,
          31
        ],
        "from": "spine-gallery",
        "to": "private-rest"
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
        "x": 4,
        "z": 5,
        "room": "western-atelier",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 5,
        "room": "central-hall",
        "asset": "pack4:064"
      },
      {
        "x": 38,
        "z": 5,
        "room": "eastern-pantry",
        "asset": "pack4:057"
      },
      {
        "x": 20,
        "z": 19,
        "room": "spine-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 20,
        "z": 33,
        "room": "private-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-front-hall-roof",
        "rect": [
          0,
          0,
          15,
          16
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "east-front-house-roof",
        "rect": [
          16,
          0,
          42,
          16
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "back-arterial-spine-roof",
        "rect": [
          14,
          17,
          29,
          38
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      3,
      39
    ],
    "detail": "T original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "small",
    "index": 10,
    "title": "Suncleft Masons' Dwelling",
    "w": 27,
    "d": 26,
    "plan": "suncleft-masons-dwelling-le-original-room-massing",
    "roof": "sawtooth",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        19,
        15,
        26,
        25
      ],
      [
        0,
        21,
        6,
        25
      ]
    ],
    "segments": [
      [
        12,
        2,
        12,
        11
      ],
      [
        2,
        12,
        15,
        12
      ],
      [
        2,
        20,
        15,
        20
      ]
    ],
    "entry": [
      16,
      1,
      "main-hearth"
    ],
    "rooms": [
      {
        "id": "front-studio",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          12,
          4,
          12
        ]
      },
      {
        "id": "main-hearth",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          25,
          4,
          12
        ]
      },
      {
        "id": "left-shelter",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          16,
          4,
          20
        ]
      },
      {
        "id": "bedchamber",
        "min": [
          2,
          1,
          21
        ],
        "max": [
          16,
          4,
          25
        ]
      }
    ],
    "doors": [
      {
        "at": [
          12,
          1,
          5
        ],
        "from": "main-hearth",
        "to": "front-studio"
      },
      {
        "at": [
          5,
          1,
          12
        ],
        "from": "front-studio",
        "to": "left-shelter"
      },
      {
        "at": [
          5,
          1,
          20
        ],
        "from": "left-shelter",
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
        7,
        "west"
      ],
      [
        25,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 5,
        "room": "front-studio",
        "asset": "pack5:084"
      },
      {
        "x": 16,
        "z": 5,
        "room": "main-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 15,
        "room": "left-shelter",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 22,
        "room": "bedchamber",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-courtyard-front",
        "rect": [
          0,
          0,
          26,
          12
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "left-return-roof",
        "rect": [
          0,
          13,
          16,
          25
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      3,
      23
    ],
    "detail": "LE original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "medium",
    "index": 13,
    "title": "Namarra Twin-Mirage Family House",
    "w": 35,
    "d": 30,
    "plan": "namarra-twin-mirage-family-house-u-original-room-massing",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        12,
        14,
        22,
        29
      ],
      [
        0,
        21,
        8,
        29
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        12
      ],
      [
        2,
        13,
        10,
        13
      ],
      [
        24,
        13,
        32,
        13
      ]
    ],
    "entry": [
      22,
      1,
      "hearth-hall"
    ],
    "rooms": [
      {
        "id": "workroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          13
        ]
      },
      {
        "id": "hearth-hall",
        "min": [
          19,
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
        "id": "garden-suite",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          11,
          4,
          29
        ]
      },
      {
        "id": "lantern-kitchen",
        "min": [
          24,
          1,
          14
        ],
        "max": [
          33,
          4,
          29
        ]
      }
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          5
        ],
        "from": "hearth-hall",
        "to": "workroom"
      },
      {
        "at": [
          5,
          1,
          13
        ],
        "from": "workroom",
        "to": "garden-suite"
      },
      {
        "at": [
          30,
          1,
          13
        ],
        "from": "hearth-hall",
        "to": "lantern-kitchen"
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
        "x": 4,
        "z": 5,
        "room": "workroom",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 5,
        "room": "hearth-hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 17,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 26,
        "z": 17,
        "room": "lantern-kitchen",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "cross-front-bearing-beam",
        "rect": [
          0,
          0,
          34,
          13
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-sleeping-slope",
        "rect": [
          0,
          14,
          11,
          29
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "east-cook-bay",
        "rect": [
          23,
          14,
          34,
          29
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      3,
      31
    ],
    "detail": "U original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "large",
    "index": 10,
    "title": "Saffrondune Caravan Family Hall",
    "w": 42,
    "d": 39,
    "plan": "saffrondune-caravan-family-hall-lw-original-room-massing",
    "roof": "hip",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        16,
        13,
        38
      ],
      [
        35,
        29,
        41,
        38
      ]
    ],
    "segments": [
      [
        23,
        2,
        23,
        14
      ],
      [
        16,
        15,
        39,
        15
      ],
      [
        16,
        28,
        39,
        28
      ]
    ],
    "entry": [
      27,
      1,
      "gathering-room"
    ],
    "rooms": [
      {
        "id": "front-workshop",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          23,
          4,
          15
        ]
      },
      {
        "id": "gathering-room",
        "min": [
          24,
          1,
          2
        ],
        "max": [
          40,
          4,
          15
        ]
      },
      {
        "id": "rear-gallery",
        "min": [
          16,
          1,
          16
        ],
        "max": [
          40,
          4,
          28
        ]
      },
      {
        "id": "sleeping-suite",
        "min": [
          16,
          1,
          29
        ],
        "max": [
          40,
          4,
          38
        ]
      }
    ],
    "doors": [
      {
        "at": [
          23,
          1,
          5
        ],
        "from": "gathering-room",
        "to": "front-workshop"
      },
      {
        "at": [
          37,
          1,
          15
        ],
        "from": "gathering-room",
        "to": "rear-gallery"
      },
      {
        "at": [
          37,
          1,
          28
        ],
        "from": "rear-gallery",
        "to": "sleeping-suite"
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
        7,
        "west"
      ],
      [
        40,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 5,
        "room": "front-workshop",
        "asset": "pack5:084"
      },
      {
        "x": 27,
        "z": 5,
        "room": "gathering-room",
        "asset": "pack4:064"
      },
      {
        "x": 19,
        "z": 18,
        "room": "rear-gallery",
        "asset": "pack4:057"
      },
      {
        "x": 19,
        "z": 30,
        "room": "sleeping-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-gable",
        "rect": [
          0,
          0,
          41,
          15
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "lean-into-ridge",
        "rect": [
          15,
          16,
          41,
          38
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      3,
      38
    ],
    "detail": "LW original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "small",
    "index": 9,
    "title": "Winterhook Heated Porch Hut",
    "w": 26,
    "d": 26,
    "plan": "winterhook-heated-porch-hut-lw-original-room-massing",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        14,
        6,
        25
      ],
      [
        17,
        21,
        25,
        25
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        11
      ],
      [
        10,
        12,
        23,
        12
      ],
      [
        10,
        20,
        23,
        20
      ]
    ],
    "entry": [
      18,
      1,
      "gathering-room"
    ],
    "rooms": [
      {
        "id": "front-workshop",
        "min": [
          2,
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
        "id": "gathering-room",
        "min": [
          15,
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
        "id": "rear-gallery",
        "min": [
          10,
          1,
          13
        ],
        "max": [
          24,
          4,
          20
        ]
      },
      {
        "id": "sleeping-suite",
        "min": [
          10,
          1,
          21
        ],
        "max": [
          24,
          4,
          25
        ]
      }
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          5
        ],
        "from": "gathering-room",
        "to": "front-workshop"
      },
      {
        "at": [
          21,
          1,
          12
        ],
        "from": "gathering-room",
        "to": "rear-gallery"
      },
      {
        "at": [
          21,
          1,
          20
        ],
        "from": "rear-gallery",
        "to": "sleeping-suite"
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
        7,
        "west"
      ],
      [
        24,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 5,
        "room": "front-workshop",
        "asset": "pack5:084"
      },
      {
        "x": 18,
        "z": 5,
        "room": "gathering-room",
        "asset": "pack4:064"
      },
      {
        "x": 13,
        "z": 15,
        "room": "rear-gallery",
        "asset": "pack4:057"
      },
      {
        "x": 13,
        "z": 22,
        "room": "sleeping-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-gable",
        "rect": [
          0,
          0,
          25,
          12
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "lean-into-ridge",
        "rect": [
          9,
          13,
          25,
          25
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      3,
      22
    ],
    "detail": "LW original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "medium",
    "index": 11,
    "title": "Whitepine Three-Gable Resthouse",
    "w": 36,
    "d": 32,
    "plan": "whitepine-three-gable-resthouse-t-original-room-massing",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        16,
        9,
        31
      ],
      [
        28,
        16,
        35,
        31
      ],
      [
        30,
        9,
        35,
        13
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
        24,
        2,
        24,
        12
      ],
      [
        11,
        13,
        24,
        13
      ],
      [
        11,
        23,
        24,
        23
      ]
    ],
    "entry": [
      17,
      1,
      "central-hall"
    ],
    "rooms": [
      {
        "id": "western-atelier",
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
        "id": "central-hall",
        "min": [
          12,
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
        "id": "eastern-pantry",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          34,
          4,
          13
        ]
      },
      {
        "id": "spine-gallery",
        "min": [
          11,
          1,
          14
        ],
        "max": [
          25,
          4,
          23
        ]
      },
      {
        "id": "private-rest",
        "min": [
          11,
          1,
          24
        ],
        "max": [
          25,
          4,
          31
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
        "from": "central-hall",
        "to": "western-atelier"
      },
      {
        "at": [
          24,
          1,
          5
        ],
        "from": "central-hall",
        "to": "eastern-pantry"
      },
      {
        "at": [
          17,
          1,
          13
        ],
        "from": "central-hall",
        "to": "spine-gallery"
      },
      {
        "at": [
          17,
          1,
          23
        ],
        "from": "spine-gallery",
        "to": "private-rest"
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
        "x": 4,
        "z": 5,
        "room": "western-atelier",
        "asset": "pack5:084"
      },
      {
        "x": 17,
        "z": 5,
        "room": "central-hall",
        "asset": "pack4:064"
      },
      {
        "x": 31,
        "z": 5,
        "room": "eastern-pantry",
        "asset": "pack4:057"
      },
      {
        "x": 16,
        "z": 16,
        "room": "spine-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 16,
        "z": 25,
        "room": "private-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-front-hall-roof",
        "rect": [
          0,
          0,
          11,
          13
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "east-front-house-roof",
        "rect": [
          12,
          0,
          35,
          13
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "back-arterial-spine-roof",
        "rect": [
          10,
          14,
          25,
          31
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      3,
      32
    ],
    "detail": "T original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "large",
    "index": 13,
    "title": "Frostglass Narrow-Court Lodge",
    "w": 45,
    "d": 40,
    "plan": "frostglass-narrow-court-lodge-u-original-room-massing",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        15,
        19,
        28,
        39
      ],
      [
        40,
        24,
        44,
        39
      ]
    ],
    "segments": [
      [
        22,
        2,
        22,
        17
      ],
      [
        2,
        18,
        13,
        18
      ],
      [
        30,
        18,
        42,
        18
      ]
    ],
    "entry": [
      26,
      1,
      "hearth-hall"
    ],
    "rooms": [
      {
        "id": "workroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          22,
          4,
          18
        ]
      },
      {
        "id": "hearth-hall",
        "min": [
          23,
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
        "id": "garden-suite",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          14,
          4,
          39
        ]
      },
      {
        "id": "lantern-kitchen",
        "min": [
          30,
          1,
          19
        ],
        "max": [
          43,
          4,
          39
        ]
      }
    ],
    "doors": [
      {
        "at": [
          22,
          1,
          5
        ],
        "from": "hearth-hall",
        "to": "workroom"
      },
      {
        "at": [
          5,
          1,
          18
        ],
        "from": "workroom",
        "to": "garden-suite"
      },
      {
        "at": [
          40,
          1,
          18
        ],
        "from": "hearth-hall",
        "to": "lantern-kitchen"
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
        "x": 4,
        "z": 5,
        "room": "workroom",
        "asset": "pack5:084"
      },
      {
        "x": 26,
        "z": 5,
        "room": "hearth-hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 22,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 32,
        "z": 22,
        "room": "lantern-kitchen",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "cross-front-bearing-beam",
        "rect": [
          0,
          0,
          44,
          18
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "west-sleeping-slope",
        "rect": [
          0,
          19,
          14,
          39
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-cook-bay",
        "rect": [
          29,
          19,
          44,
          39
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      3,
      41
    ],
    "detail": "U original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 13,
    "title": "Twilighthollow Wishingwell Croft",
    "w": 27,
    "d": 27,
    "plan": "twilighthollow-wishingwell-croft-u-original-room-massing",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        10,
        15,
        20,
        26
      ],
      [
        0,
        20,
        6,
        26
      ]
    ],
    "segments": [
      [
        12,
        2,
        12,
        11
      ],
      [
        2,
        12,
        8,
        12
      ],
      [
        20,
        12,
        24,
        12
      ]
    ],
    "entry": [
      16,
      1,
      "hearth-hall"
    ],
    "rooms": [
      {
        "id": "workroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          12,
          4,
          12
        ]
      },
      {
        "id": "hearth-hall",
        "min": [
          13,
          1,
          2
        ],
        "max": [
          25,
          4,
          12
        ]
      },
      {
        "id": "garden-suite",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          9,
          4,
          26
        ]
      },
      {
        "id": "lantern-kitchen",
        "min": [
          20,
          1,
          13
        ],
        "max": [
          25,
          4,
          26
        ]
      }
    ],
    "doors": [
      {
        "at": [
          12,
          1,
          5
        ],
        "from": "hearth-hall",
        "to": "workroom"
      },
      {
        "at": [
          5,
          1,
          12
        ],
        "from": "workroom",
        "to": "garden-suite"
      },
      {
        "at": [
          22,
          1,
          12
        ],
        "from": "hearth-hall",
        "to": "lantern-kitchen"
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
        7,
        "west"
      ],
      [
        25,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 5,
        "room": "workroom",
        "asset": "pack5:084"
      },
      {
        "x": 16,
        "z": 5,
        "room": "hearth-hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 16,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 22,
        "z": 16,
        "room": "lantern-kitchen",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "cross-front-bearing-beam",
        "rect": [
          0,
          0,
          26,
          12
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "west-sleeping-slope",
        "rect": [
          0,
          13,
          9,
          26
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-cook-bay",
        "rect": [
          19,
          13,
          26,
          26
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      3,
      23
    ],
    "detail": "U original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 10,
    "title": "Mirthroot Woodland Study Home",
    "w": 34,
    "d": 33,
    "plan": "mirthroot-woodland-study-home-le-original-room-massing",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        25,
        17,
        33,
        32
      ],
      [
        0,
        25,
        6,
        32
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        13
      ],
      [
        2,
        14,
        21,
        14
      ],
      [
        2,
        24,
        21,
        24
      ]
    ],
    "entry": [
      21,
      1,
      "main-hearth"
    ],
    "rooms": [
      {
        "id": "front-studio",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          14
        ]
      },
      {
        "id": "main-hearth",
        "min": [
          18,
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
        "id": "left-shelter",
        "min": [
          2,
          1,
          15
        ],
        "max": [
          22,
          4,
          24
        ]
      },
      {
        "id": "bedchamber",
        "min": [
          2,
          1,
          25
        ],
        "max": [
          22,
          4,
          32
        ]
      }
    ],
    "doors": [
      {
        "at": [
          17,
          1,
          5
        ],
        "from": "main-hearth",
        "to": "front-studio"
      },
      {
        "at": [
          5,
          1,
          14
        ],
        "from": "front-studio",
        "to": "left-shelter"
      },
      {
        "at": [
          5,
          1,
          24
        ],
        "from": "left-shelter",
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
        "x": 4,
        "z": 5,
        "room": "front-studio",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 5,
        "room": "main-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 17,
        "room": "left-shelter",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 26,
        "room": "bedchamber",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-courtyard-front",
        "rect": [
          0,
          0,
          33,
          14
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "left-return-roof",
        "rect": [
          0,
          15,
          22,
          32
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      3,
      30
    ],
    "detail": "LE original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 10,
    "title": "Sylvanspire Moonwatch Hall",
    "w": 44,
    "d": 41,
    "plan": "sylvanspire-moonwatch-hall-t-original-room-massing",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        20,
        14,
        40
      ],
      [
        33,
        20,
        43,
        40
      ],
      [
        0,
        9,
        6,
        17
      ]
    ],
    "segments": [
      [
        16,
        2,
        16,
        16
      ],
      [
        29,
        2,
        29,
        16
      ],
      [
        16,
        17,
        29,
        17
      ],
      [
        16,
        28,
        29,
        28
      ]
    ],
    "entry": [
      22,
      1,
      "central-hall"
    ],
    "rooms": [
      {
        "id": "western-atelier",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          16,
          4,
          17
        ]
      },
      {
        "id": "central-hall",
        "min": [
          17,
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
        "id": "eastern-pantry",
        "min": [
          30,
          1,
          2
        ],
        "max": [
          42,
          4,
          17
        ]
      },
      {
        "id": "spine-gallery",
        "min": [
          16,
          1,
          18
        ],
        "max": [
          30,
          4,
          28
        ]
      },
      {
        "id": "private-rest",
        "min": [
          16,
          1,
          29
        ],
        "max": [
          30,
          4,
          40
        ]
      }
    ],
    "doors": [
      {
        "at": [
          16,
          1,
          5
        ],
        "from": "central-hall",
        "to": "western-atelier"
      },
      {
        "at": [
          29,
          1,
          5
        ],
        "from": "central-hall",
        "to": "eastern-pantry"
      },
      {
        "at": [
          22,
          1,
          17
        ],
        "from": "central-hall",
        "to": "spine-gallery"
      },
      {
        "at": [
          22,
          1,
          28
        ],
        "from": "spine-gallery",
        "to": "private-rest"
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
        "x": 4,
        "z": 5,
        "room": "western-atelier",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 5,
        "room": "central-hall",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "eastern-pantry",
        "asset": "pack4:057"
      },
      {
        "x": 21,
        "z": 20,
        "room": "spine-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 21,
        "z": 30,
        "room": "private-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-front-hall-roof",
        "rect": [
          0,
          0,
          16,
          17
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-front-house-roof",
        "rect": [
          17,
          0,
          43,
          17
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "back-arterial-spine-roof",
        "rect": [
          15,
          18,
          30,
          40
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      3,
      40
    ],
    "detail": "T original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "small",
    "index": 9,
    "title": "Stonewhistle Switchback Cabin",
    "w": 26,
    "d": 26,
    "plan": "stonewhistle-switchback-cabin-le-original-room-massing",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        17,
        12,
        25,
        25
      ],
      [
        0,
        21,
        6,
        25
      ]
    ],
    "segments": [
      [
        13,
        2,
        13,
        10
      ],
      [
        2,
        11,
        15,
        11
      ],
      [
        2,
        18,
        15,
        18
      ]
    ],
    "entry": [
      17,
      1,
      "main-hearth"
    ],
    "rooms": [
      {
        "id": "front-studio",
        "min": [
          2,
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
        "id": "main-hearth",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          24,
          4,
          11
        ]
      },
      {
        "id": "left-shelter",
        "min": [
          2,
          1,
          12
        ],
        "max": [
          16,
          4,
          18
        ]
      },
      {
        "id": "bedchamber",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          16,
          4,
          25
        ]
      }
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          5
        ],
        "from": "main-hearth",
        "to": "front-studio"
      },
      {
        "at": [
          5,
          1,
          11
        ],
        "from": "front-studio",
        "to": "left-shelter"
      },
      {
        "at": [
          5,
          1,
          18
        ],
        "from": "left-shelter",
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
        24,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 5,
        "room": "front-studio",
        "asset": "pack5:084"
      },
      {
        "x": 17,
        "z": 5,
        "room": "main-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 14,
        "room": "left-shelter",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 20,
        "room": "bedchamber",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-courtyard-front",
        "rect": [
          0,
          0,
          25,
          11
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "left-return-roof",
        "rect": [
          0,
          12,
          16,
          25
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      3,
      22
    ],
    "detail": "LE original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "medium",
    "index": 13,
    "title": "Ironroost Lower Terrace Villa",
    "w": 35,
    "d": 32,
    "plan": "ironroost-lower-terrace-villa-lw-original-room-massing",
    "roof": "hip",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        16,
        10,
        31
      ],
      [
        26,
        27,
        34,
        31
      ]
    ],
    "segments": [
      [
        20,
        2,
        20,
        13
      ],
      [
        14,
        14,
        32,
        14
      ],
      [
        14,
        24,
        32,
        24
      ]
    ],
    "entry": [
      24,
      1,
      "gathering-room"
    ],
    "rooms": [
      {
        "id": "front-workshop",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          20,
          4,
          14
        ]
      },
      {
        "id": "gathering-room",
        "min": [
          21,
          1,
          2
        ],
        "max": [
          33,
          4,
          14
        ]
      },
      {
        "id": "rear-gallery",
        "min": [
          14,
          1,
          15
        ],
        "max": [
          33,
          4,
          24
        ]
      },
      {
        "id": "sleeping-suite",
        "min": [
          14,
          1,
          25
        ],
        "max": [
          33,
          4,
          31
        ]
      }
    ],
    "doors": [
      {
        "at": [
          20,
          1,
          5
        ],
        "from": "gathering-room",
        "to": "front-workshop"
      },
      {
        "at": [
          30,
          1,
          14
        ],
        "from": "gathering-room",
        "to": "rear-gallery"
      },
      {
        "at": [
          30,
          1,
          24
        ],
        "from": "rear-gallery",
        "to": "sleeping-suite"
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
        "x": 4,
        "z": 5,
        "room": "front-workshop",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 5,
        "room": "gathering-room",
        "asset": "pack4:064"
      },
      {
        "x": 17,
        "z": 17,
        "room": "rear-gallery",
        "asset": "pack4:057"
      },
      {
        "x": 17,
        "z": 26,
        "room": "sleeping-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-gable",
        "rect": [
          0,
          0,
          34,
          14
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "lean-into-ridge",
        "rect": [
          13,
          15,
          34,
          31
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      3,
      31
    ],
    "detail": "LW original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 11,
    "title": "Cairnspire High Pass Residence",
    "w": 45,
    "d": 39,
    "plan": "cairnspire-high-pass-residence-t-original-room-massing",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        19,
        12,
        38
      ],
      [
        31,
        19,
        44,
        38
      ],
      [
        40,
        9,
        44,
        17
      ]
    ],
    "segments": [
      [
        16,
        2,
        16,
        16
      ],
      [
        29,
        2,
        29,
        16
      ],
      [
        16,
        17,
        29,
        17
      ],
      [
        16,
        32,
        29,
        32
      ]
    ],
    "entry": [
      22,
      1,
      "central-hall"
    ],
    "rooms": [
      {
        "id": "western-atelier",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          16,
          4,
          17
        ]
      },
      {
        "id": "central-hall",
        "min": [
          17,
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
        "id": "eastern-pantry",
        "min": [
          30,
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
        "id": "spine-gallery",
        "min": [
          16,
          1,
          18
        ],
        "max": [
          30,
          4,
          32
        ]
      },
      {
        "id": "private-rest",
        "min": [
          16,
          1,
          33
        ],
        "max": [
          30,
          4,
          38
        ]
      }
    ],
    "doors": [
      {
        "at": [
          16,
          1,
          5
        ],
        "from": "central-hall",
        "to": "western-atelier"
      },
      {
        "at": [
          29,
          1,
          5
        ],
        "from": "central-hall",
        "to": "eastern-pantry"
      },
      {
        "at": [
          22,
          1,
          17
        ],
        "from": "central-hall",
        "to": "spine-gallery"
      },
      {
        "at": [
          22,
          1,
          32
        ],
        "from": "spine-gallery",
        "to": "private-rest"
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
        "x": 4,
        "z": 5,
        "room": "western-atelier",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 5,
        "room": "central-hall",
        "asset": "pack4:064"
      },
      {
        "x": 40,
        "z": 5,
        "room": "eastern-pantry",
        "asset": "pack4:057"
      },
      {
        "x": 21,
        "z": 20,
        "room": "spine-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 21,
        "z": 34,
        "room": "private-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-front-hall-roof",
        "rect": [
          0,
          0,
          16,
          17
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "east-front-house-roof",
        "rect": [
          17,
          0,
          44,
          17
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "back-arterial-spine-roof",
        "rect": [
          15,
          18,
          30,
          38
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      3,
      41
    ],
    "detail": "T original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "small",
    "index": 14,
    "title": "Oakglass Lantern Corner House",
    "w": 28,
    "d": 27,
    "plan": "oakglass-lantern-corner-house-le-original-room-massing",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        22,
        15,
        27,
        26
      ],
      [
        0,
        22,
        6,
        26
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        11
      ],
      [
        2,
        12,
        18,
        12
      ],
      [
        2,
        21,
        18,
        21
      ]
    ],
    "entry": [
      18,
      1,
      "main-hearth"
    ],
    "rooms": [
      {
        "id": "front-studio",
        "min": [
          2,
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
        "id": "main-hearth",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          26,
          4,
          12
        ]
      },
      {
        "id": "left-shelter",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          19,
          4,
          21
        ]
      },
      {
        "id": "bedchamber",
        "min": [
          2,
          1,
          22
        ],
        "max": [
          19,
          4,
          26
        ]
      }
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          5
        ],
        "from": "main-hearth",
        "to": "front-studio"
      },
      {
        "at": [
          5,
          1,
          12
        ],
        "from": "front-studio",
        "to": "left-shelter"
      },
      {
        "at": [
          5,
          1,
          21
        ],
        "from": "left-shelter",
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
        24,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        26,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 5,
        "room": "front-studio",
        "asset": "pack5:084"
      },
      {
        "x": 18,
        "z": 5,
        "room": "main-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 15,
        "room": "left-shelter",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 23,
        "room": "bedchamber",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-courtyard-front",
        "rect": [
          0,
          0,
          27,
          12
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "left-return-roof",
        "rect": [
          0,
          13,
          19,
          26
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      3,
      24
    ],
    "detail": "LE original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "desert",
    "size": "large",
    "index": 11,
    "title": "Dunescar Twin-Pylon Manor",
    "w": 44,
    "d": 40,
    "plan": "dunescar-twin-pylon-manor-t-original-room-massing",
    "roof": "steep",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        16,
        11,
        39
      ],
      [
        32,
        16,
        43,
        39
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
        29,
        2,
        29,
        14
      ],
      [
        14,
        15,
        29,
        15
      ],
      [
        14,
        29,
        29,
        29
      ]
    ],
    "entry": [
      21,
      1,
      "central-hall"
    ],
    "rooms": [
      {
        "id": "western-atelier",
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
        "id": "central-hall",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          29,
          4,
          15
        ]
      },
      {
        "id": "eastern-pantry",
        "min": [
          30,
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
        "id": "spine-gallery",
        "min": [
          14,
          1,
          16
        ],
        "max": [
          30,
          4,
          29
        ]
      },
      {
        "id": "private-rest",
        "min": [
          14,
          1,
          30
        ],
        "max": [
          30,
          4,
          39
        ]
      }
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          5
        ],
        "from": "central-hall",
        "to": "western-atelier"
      },
      {
        "at": [
          29,
          1,
          5
        ],
        "from": "central-hall",
        "to": "eastern-pantry"
      },
      {
        "at": [
          21,
          1,
          15
        ],
        "from": "central-hall",
        "to": "spine-gallery"
      },
      {
        "at": [
          21,
          1,
          29
        ],
        "from": "spine-gallery",
        "to": "private-rest"
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
        "x": 4,
        "z": 5,
        "room": "western-atelier",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 5,
        "room": "central-hall",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "eastern-pantry",
        "asset": "pack4:057"
      },
      {
        "x": 20,
        "z": 18,
        "room": "spine-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 20,
        "z": 31,
        "room": "private-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-front-hall-roof",
        "rect": [
          0,
          0,
          14,
          15
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "east-front-house-roof",
        "rect": [
          15,
          0,
          43,
          15
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "back-arterial-spine-roof",
        "rect": [
          13,
          16,
          30,
          39
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      3,
      40
    ],
    "detail": "T original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "snow",
    "size": "small",
    "index": 10,
    "title": "Icemere Snowcourt Family Cabin",
    "w": 28,
    "d": 27,
    "plan": "icemere-snowcourt-family-cabin-u-original-room-massing",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        7,
        13,
        20,
        26
      ],
      [
        0,
        18,
        3,
        26
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        11
      ],
      [
        2,
        12,
        6,
        12
      ],
      [
        21,
        12,
        25,
        12
      ]
    ],
    "entry": [
      18,
      1,
      "hearth-hall"
    ],
    "rooms": [
      {
        "id": "workroom",
        "min": [
          2,
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
        "id": "hearth-hall",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          26,
          4,
          12
        ]
      },
      {
        "id": "garden-suite",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          7,
          4,
          26
        ]
      },
      {
        "id": "lantern-kitchen",
        "min": [
          21,
          1,
          13
        ],
        "max": [
          26,
          4,
          26
        ]
      }
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          5
        ],
        "from": "hearth-hall",
        "to": "workroom"
      },
      {
        "at": [
          5,
          1,
          12
        ],
        "from": "workroom",
        "to": "garden-suite"
      },
      {
        "at": [
          23,
          1,
          12
        ],
        "from": "hearth-hall",
        "to": "lantern-kitchen"
      }
    ],
    "windows": [
      [
        3,
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
        7,
        "west"
      ],
      [
        26,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 5,
        "room": "workroom",
        "asset": "pack5:084"
      },
      {
        "x": 18,
        "z": 5,
        "room": "hearth-hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 16,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 16,
        "room": "lantern-kitchen",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "cross-front-bearing-beam",
        "rect": [
          0,
          0,
          27,
          12
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "west-sleeping-slope",
        "rect": [
          0,
          13,
          7,
          26
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "east-cook-bay",
        "rect": [
          20,
          13,
          27,
          26
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      3,
      24
    ],
    "detail": "U original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 11,
    "title": "Whisperfern Crescent Glade House",
    "w": 35,
    "d": 34,
    "plan": "whisperfern-crescent-glade-house-u-original-room-massing",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        12,
        19,
        25,
        33
      ],
      [
        29,
        22,
        34,
        33
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
        2,
        16,
        10,
        16
      ],
      [
        25,
        16,
        32,
        16
      ]
    ],
    "entry": [
      22,
      1,
      "hearth-hall"
    ],
    "rooms": [
      {
        "id": "workroom",
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
        "id": "hearth-hall",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          33,
          4,
          16
        ]
      },
      {
        "id": "garden-suite",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          11,
          4,
          33
        ]
      },
      {
        "id": "lantern-kitchen",
        "min": [
          25,
          1,
          17
        ],
        "max": [
          33,
          4,
          33
        ]
      }
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          5
        ],
        "from": "hearth-hall",
        "to": "workroom"
      },
      {
        "at": [
          5,
          1,
          16
        ],
        "from": "workroom",
        "to": "garden-suite"
      },
      {
        "at": [
          30,
          1,
          16
        ],
        "from": "hearth-hall",
        "to": "lantern-kitchen"
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
        "x": 4,
        "z": 5,
        "room": "workroom",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 5,
        "room": "hearth-hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 20,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 27,
        "z": 20,
        "room": "lantern-kitchen",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "cross-front-bearing-beam",
        "rect": [
          0,
          0,
          34,
          16
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-sleeping-slope",
        "rect": [
          0,
          17,
          11,
          33
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "east-cook-bay",
        "rect": [
          24,
          17,
          34,
          33
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      3,
      31
    ],
    "detail": "U original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "small",
    "index": 10,
    "title": "Redstone Splitridge Refuge",
    "w": 29,
    "d": 26,
    "plan": "redstone-splitridge-refuge-u-original-room-massing",
    "roof": "courtyard",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        11,
        12,
        18,
        25
      ],
      [
        22,
        17,
        28,
        25
      ]
    ],
    "segments": [
      [
        15,
        2,
        15,
        10
      ],
      [
        2,
        11,
        7,
        11
      ],
      [
        21,
        11,
        26,
        11
      ]
    ],
    "entry": [
      19,
      1,
      "hearth-hall"
    ],
    "rooms": [
      {
        "id": "workroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          11
        ]
      },
      {
        "id": "hearth-hall",
        "min": [
          16,
          1,
          2
        ],
        "max": [
          27,
          4,
          11
        ]
      },
      {
        "id": "garden-suite",
        "min": [
          2,
          1,
          12
        ],
        "max": [
          8,
          4,
          25
        ]
      },
      {
        "id": "lantern-kitchen",
        "min": [
          21,
          1,
          12
        ],
        "max": [
          27,
          4,
          25
        ]
      }
    ],
    "doors": [
      {
        "at": [
          15,
          1,
          5
        ],
        "from": "hearth-hall",
        "to": "workroom"
      },
      {
        "at": [
          5,
          1,
          11
        ],
        "from": "workroom",
        "to": "garden-suite"
      },
      {
        "at": [
          24,
          1,
          11
        ],
        "from": "hearth-hall",
        "to": "lantern-kitchen"
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
        7,
        "west"
      ],
      [
        27,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 5,
        "room": "workroom",
        "asset": "pack5:084"
      },
      {
        "x": 19,
        "z": 5,
        "room": "hearth-hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 15,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 15,
        "room": "lantern-kitchen",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "cross-front-bearing-beam",
        "rect": [
          0,
          0,
          28,
          11
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "west-sleeping-slope",
        "rect": [
          0,
          12,
          8,
          25
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "east-cook-bay",
        "rect": [
          20,
          12,
          28,
          25
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      3,
      25
    ],
    "detail": "U original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "temperate",
    "size": "large",
    "index": 11,
    "title": "Wrenwater Canal Merchant House",
    "w": 44,
    "d": 40,
    "plan": "wrenwater-canal-merchant-house-lw-original-room-massing",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        18,
        15,
        39
      ]
    ],
    "segments": [
      [
        24,
        2,
        24,
        15
      ],
      [
        16,
        16,
        41,
        16
      ],
      [
        16,
        27,
        41,
        27
      ]
    ],
    "entry": [
      28,
      1,
      "gathering-room"
    ],
    "rooms": [
      {
        "id": "front-workshop",
        "min": [
          2,
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
        "id": "gathering-room",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          42,
          4,
          16
        ]
      },
      {
        "id": "rear-gallery",
        "min": [
          16,
          1,
          17
        ],
        "max": [
          42,
          4,
          27
        ]
      },
      {
        "id": "sleeping-suite",
        "min": [
          16,
          1,
          28
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
          24,
          1,
          5
        ],
        "from": "gathering-room",
        "to": "front-workshop"
      },
      {
        "at": [
          39,
          1,
          16
        ],
        "from": "gathering-room",
        "to": "rear-gallery"
      },
      {
        "at": [
          39,
          1,
          27
        ],
        "from": "rear-gallery",
        "to": "sleeping-suite"
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
        "x": 4,
        "z": 5,
        "room": "front-workshop",
        "asset": "pack5:084"
      },
      {
        "x": 28,
        "z": 5,
        "room": "gathering-room",
        "asset": "pack4:064"
      },
      {
        "x": 19,
        "z": 19,
        "room": "rear-gallery",
        "asset": "pack4:057"
      },
      {
        "x": 19,
        "z": 29,
        "room": "sleeping-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "long-front-gable",
        "rect": [
          0,
          0,
          43,
          16
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "lean-into-ridge",
        "rect": [
          15,
          17,
          43,
          39
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      3,
      40
    ],
    "detail": "LW original region-tuned fully reserved multiroom house"
  },
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 12,
    "title": "Thornpeak Hanging Court Manor",
    "w": 46,
    "d": 42,
    "plan": "thornpeak-hanging-court-manor-u-original-room-massing",
    "roof": "courtyard",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        14,
        20,
        32,
        41
      ],
      [
        0,
        27,
        4,
        41
      ]
    ],
    "segments": [
      [
        20,
        2,
        20,
        18
      ],
      [
        2,
        19,
        12,
        19
      ],
      [
        34,
        19,
        43,
        19
      ]
    ],
    "entry": [
      24,
      1,
      "hearth-hall"
    ],
    "rooms": [
      {
        "id": "workroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          20,
          4,
          19
        ]
      },
      {
        "id": "hearth-hall",
        "min": [
          21,
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
        "id": "garden-suite",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          13,
          4,
          41
        ]
      },
      {
        "id": "lantern-kitchen",
        "min": [
          34,
          1,
          20
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
          20,
          1,
          5
        ],
        "from": "hearth-hall",
        "to": "workroom"
      },
      {
        "at": [
          5,
          1,
          19
        ],
        "from": "workroom",
        "to": "garden-suite"
      },
      {
        "at": [
          41,
          1,
          19
        ],
        "from": "hearth-hall",
        "to": "lantern-kitchen"
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
        "x": 4,
        "z": 5,
        "room": "workroom",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 5,
        "room": "hearth-hall",
        "asset": "pack4:064"
      },
      {
        "x": 4,
        "z": 23,
        "room": "garden-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 36,
        "z": 23,
        "room": "lantern-kitchen",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "cross-front-bearing-beam",
        "rect": [
          0,
          0,
          45,
          19
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "west-sleeping-slope",
        "rect": [
          0,
          20,
          13,
          41
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "east-cook-bay",
        "rect": [
          33,
          20,
          45,
          41
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      3,
      42
    ],
    "detail": "U original region-tuned fully reserved multiroom house"
  }
]);
export const M2_HOUSING_WAVE9_IDS=Object.freeze(SPECS.map(s=>'r1:house:'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getM2HousingWave9(){return SPECS.map(compileM2ArchitecturalSpec);}
