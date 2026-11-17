// Mythwrought Builder 1A M3 Wave8: five newly coordinate-authored H, U and T concave hospitality candidate sources.
// All room bounds, portals, voids, pitched roof rectangles and Pack fixtures are literal source coordinates.
// No runtime registration, saved-state mutation, producer change or production approval.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "snow",
    "size": "large",
    "index": 3,
    "title": "Snowglass Twin Court Feast House",
    "plan": "snowglass-double-court-h-crossed-snow-wing",
    "w": 75,
    "d": 67,
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        25,
        23,
        42
      ],
      [
        50,
        25,
        74,
        42
      ]
    ],
    "segments": [
      [
        19,
        2,
        19,
        23
      ],
      [
        55,
        2,
        55,
        23
      ],
      [
        24,
        24,
        49,
        24
      ],
      [
        24,
        43,
        49,
        43
      ],
      [
        22,
        44,
        22,
        64
      ],
      [
        52,
        44,
        52,
        64
      ]
    ],
    "entry": [
      37,
      1,
      "front-hall"
    ],
    "doors": [
      {
        "at": [
          19,
          1,
          6
        ],
        "from": "front-hall",
        "to": "west-public"
      },
      {
        "at": [
          55,
          1,
          7
        ],
        "from": "front-hall",
        "to": "east-public"
      },
      {
        "at": [
          36,
          1,
          24
        ],
        "from": "front-hall",
        "to": "glass-link"
      },
      {
        "at": [
          36,
          1,
          43
        ],
        "from": "glass-link",
        "to": "rear-hall"
      },
      {
        "at": [
          22,
          1,
          48
        ],
        "from": "rear-hall",
        "to": "west-rear"
      },
      {
        "at": [
          52,
          1,
          49
        ],
        "from": "rear-hall",
        "to": "east-rear"
      }
    ],
    "rooms": [
      {
        "id": "west-public",
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
        "id": "front-hall",
        "min": [
          20,
          1,
          2
        ],
        "max": [
          56,
          4,
          24
        ]
      },
      {
        "id": "east-public",
        "min": [
          56,
          1,
          2
        ],
        "max": [
          73,
          4,
          24
        ]
      },
      {
        "id": "glass-link",
        "min": [
          25,
          1,
          25
        ],
        "max": [
          49,
          4,
          43
        ]
      },
      {
        "id": "west-rear",
        "min": [
          2,
          1,
          44
        ],
        "max": [
          23,
          4,
          65
        ]
      },
      {
        "id": "rear-hall",
        "min": [
          23,
          1,
          44
        ],
        "max": [
          53,
          4,
          65
        ]
      },
      {
        "id": "east-rear",
        "min": [
          53,
          1,
          44
        ],
        "max": [
          73,
          4,
          65
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
        71,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        73,
        9,
        "east"
      ],
      [
        3,
        65,
        "south"
      ],
      [
        71,
        65,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 6,
        "z": 5,
        "room": "west-public",
        "asset": "pack4:059"
      },
      {
        "x": 37,
        "z": 5,
        "room": "front-hall",
        "asset": "pack4:064"
      },
      {
        "x": 68,
        "z": 5,
        "room": "east-public",
        "asset": "pack4:059"
      },
      {
        "x": 36,
        "z": 30,
        "room": "glass-link",
        "asset": "pack5:084"
      },
      {
        "x": 6,
        "z": 47,
        "room": "west-rear",
        "asset": "pack4:059"
      },
      {
        "x": 37,
        "z": 47,
        "room": "rear-hall",
        "asset": "pack4:059"
      },
      {
        "x": 68,
        "z": 47,
        "room": "east-rear",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-street-gable",
        "rect": [
          0,
          0,
          19,
          24
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "raised-central-ceremonial-ridge",
        "rect": [
          20,
          0,
          55,
          24
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-street-hip",
        "rect": [
          56,
          0,
          74,
          24
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "two-court-glass-link",
        "rect": [
          24,
          25,
          49,
          42
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-rear-guest-gable",
        "rect": [
          0,
          43,
          22,
          66
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "central-orchard-landing",
        "rect": [
          23,
          43,
          52,
          66
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "east-rear-guest-hip",
        "rect": [
          53,
          43,
          74,
          66
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      70
    ],
    "detail": "Two genuine open-air side courts with connected central covered gallery and seven individually pitched roof sections"
  },
  {
    "category": "tavern",
    "biome": "desert",
    "size": "large",
    "index": 5,
    "title": "Saffron Moonwater Caravan Tavern",
    "plan": "saffron-moonwater-deep-u-split-terraces",
    "w": 72,
    "d": 63,
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        21,
        29,
        51,
        62
      ],
      [
        0,
        12,
        5,
        17
      ]
    ],
    "segments": [
      [
        22,
        2,
        22,
        27
      ],
      [
        50,
        2,
        50,
        27
      ],
      [
        2,
        28,
        20,
        28
      ],
      [
        52,
        28,
        69,
        28
      ]
    ],
    "entry": [
      36,
      1,
      "grand-hall"
    ],
    "doors": [
      {
        "at": [
          22,
          1,
          6
        ],
        "from": "grand-hall",
        "to": "west-lounge"
      },
      {
        "at": [
          50,
          1,
          7
        ],
        "from": "grand-hall",
        "to": "east-lounge"
      },
      {
        "at": [
          10,
          1,
          28
        ],
        "from": "west-lounge",
        "to": "west-guest-wing"
      },
      {
        "at": [
          61,
          1,
          28
        ],
        "from": "east-lounge",
        "to": "east-guest-wing"
      }
    ],
    "rooms": [
      {
        "id": "west-lounge",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          23,
          4,
          28
        ]
      },
      {
        "id": "grand-hall",
        "min": [
          23,
          1,
          2
        ],
        "max": [
          51,
          4,
          28
        ]
      },
      {
        "id": "east-lounge",
        "min": [
          51,
          1,
          2
        ],
        "max": [
          70,
          4,
          28
        ]
      },
      {
        "id": "west-guest-wing",
        "min": [
          2,
          1,
          29
        ],
        "max": [
          21,
          4,
          61
        ]
      },
      {
        "id": "east-guest-wing",
        "min": [
          52,
          1,
          29
        ],
        "max": [
          70,
          4,
          61
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
        68,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        70,
        7,
        "east"
      ],
      [
        3,
        61,
        "south"
      ],
      [
        68,
        61,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-lounge",
        "asset": "pack4:059"
      },
      {
        "x": 36,
        "z": 5,
        "room": "grand-hall",
        "asset": "pack4:064"
      },
      {
        "x": 64,
        "z": 5,
        "room": "east-lounge",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 34,
        "room": "west-guest-wing",
        "asset": "pack4:059"
      },
      {
        "x": 64,
        "z": 34,
        "room": "east-guest-wing",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-bay",
        "rect": [
          0,
          0,
          22,
          28
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "central-elevated-guest-hall",
        "rect": [
          23,
          0,
          50,
          28
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "street-east-bay",
        "rect": [
          51,
          0,
          71,
          28
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "west-orchard-gallery",
        "rect": [
          0,
          29,
          20,
          45
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-deep-chambers",
        "rect": [
          0,
          46,
          20,
          62
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-orchard-gallery",
        "rect": [
          52,
          29,
          71,
          45
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "east-deep-chambers",
        "rect": [
          52,
          46,
          71,
          62
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      67
    ],
    "detail": "Deep asymmetric physically void garden court, two projecting guest arms and independent pitched roof transitions"
  },
  {
    "category": "tavern",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 4,
    "title": "Thornlumen Lantern Crosshouse",
    "plan": "thornlumen-mushroom-crosshall-t-loom",
    "w": 60,
    "d": 56,
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        21,
        22,
        55
      ],
      [
        42,
        21,
        59,
        55
      ],
      [
        0,
        9,
        6,
        14
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
        47,
        2,
        47,
        19
      ],
      [
        23,
        20,
        41,
        20
      ],
      [
        24,
        43,
        40,
        43
      ]
    ],
    "entry": [
      32,
      1,
      "great-taproom"
    ],
    "doors": [
      {
        "at": [
          17,
          1,
          6
        ],
        "from": "great-taproom",
        "to": "west-table"
      },
      {
        "at": [
          47,
          1,
          7
        ],
        "from": "great-taproom",
        "to": "east-stage"
      },
      {
        "at": [
          32,
          1,
          20
        ],
        "from": "great-taproom",
        "to": "rear-brew-gallery"
      },
      {
        "at": [
          32,
          1,
          43
        ],
        "from": "rear-brew-gallery",
        "to": "staff-lantern-room"
      }
    ],
    "rooms": [
      {
        "id": "west-table",
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
        "id": "great-taproom",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          48,
          4,
          20
        ]
      },
      {
        "id": "east-stage",
        "min": [
          48,
          1,
          2
        ],
        "max": [
          58,
          4,
          20
        ]
      },
      {
        "id": "rear-brew-gallery",
        "min": [
          24,
          1,
          21
        ],
        "max": [
          41,
          4,
          43
        ]
      },
      {
        "id": "staff-lantern-room",
        "min": [
          24,
          1,
          44
        ],
        "max": [
          41,
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
        6,
        "west"
      ],
      [
        58,
        7,
        "east"
      ],
      [
        32,
        54,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-table",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 5,
        "room": "great-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 53,
        "z": 5,
        "room": "east-stage",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 26,
        "room": "rear-brew-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 48,
        "room": "staff-lantern-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-feast-pitched-hall",
        "rect": [
          0,
          0,
          17,
          20
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "high-central-ridge",
        "rect": [
          18,
          0,
          47,
          20
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-assembly-hall",
        "rect": [
          48,
          0,
          59,
          20
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-brewery-spine",
        "rect": [
          23,
          21,
          41,
          43
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "private-tall-lantern",
        "rect": [
          23,
          44,
          41,
          55
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      55
    ],
    "detail": "Three-wing tavern cross hall and slender rear double-gallery with two physically missing side volumes"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "medium",
    "index": 5,
    "title": "Primrose Twin Orchard Guesthouse",
    "plan": "primrose-double-garden-h-split-lodgings",
    "w": 61,
    "d": 56,
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        20,
        16,
        37
      ],
      [
        41,
        20,
        60,
        37
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
        45,
        2,
        45,
        18
      ],
      [
        17,
        19,
        40,
        19
      ],
      [
        17,
        38,
        40,
        38
      ],
      [
        19,
        39,
        19,
        53
      ],
      [
        43,
        39,
        43,
        53
      ]
    ],
    "entry": [
      29,
      1,
      "front-hall"
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          6
        ],
        "from": "front-hall",
        "to": "west-public"
      },
      {
        "at": [
          45,
          1,
          7
        ],
        "from": "front-hall",
        "to": "east-public"
      },
      {
        "at": [
          28,
          1,
          19
        ],
        "from": "front-hall",
        "to": "glass-link"
      },
      {
        "at": [
          28,
          1,
          38
        ],
        "from": "glass-link",
        "to": "rear-hall"
      },
      {
        "at": [
          19,
          1,
          43
        ],
        "from": "rear-hall",
        "to": "west-rear"
      },
      {
        "at": [
          43,
          1,
          44
        ],
        "from": "rear-hall",
        "to": "east-rear"
      }
    ],
    "rooms": [
      {
        "id": "west-public",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          19
        ]
      },
      {
        "id": "front-hall",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          46,
          4,
          19
        ]
      },
      {
        "id": "east-public",
        "min": [
          46,
          1,
          2
        ],
        "max": [
          59,
          4,
          19
        ]
      },
      {
        "id": "glass-link",
        "min": [
          18,
          1,
          20
        ],
        "max": [
          40,
          4,
          38
        ]
      },
      {
        "id": "west-rear",
        "min": [
          2,
          1,
          39
        ],
        "max": [
          20,
          4,
          54
        ]
      },
      {
        "id": "rear-hall",
        "min": [
          20,
          1,
          39
        ],
        "max": [
          44,
          4,
          54
        ]
      },
      {
        "id": "east-rear",
        "min": [
          44,
          1,
          39
        ],
        "max": [
          59,
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
        57,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        59,
        9,
        "east"
      ],
      [
        3,
        54,
        "south"
      ],
      [
        57,
        54,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 6,
        "z": 5,
        "room": "west-public",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 29,
        "z": 5,
        "room": "front-hall",
        "asset": "pack4:064"
      },
      {
        "x": 54,
        "z": 5,
        "room": "east-public",
        "asset": "pack4:059"
      },
      {
        "x": 28,
        "z": 25,
        "room": "glass-link",
        "asset": "pack5:084"
      },
      {
        "x": 6,
        "z": 42,
        "room": "west-rear",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 31,
        "z": 42,
        "room": "rear-hall",
        "asset": "pack4:059"
      },
      {
        "x": 54,
        "z": 42,
        "room": "east-rear",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-street-gable",
        "rect": [
          0,
          0,
          14,
          19
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "raised-central-ceremonial-ridge",
        "rect": [
          15,
          0,
          45,
          19
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-street-hip",
        "rect": [
          46,
          0,
          60,
          19
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "two-court-glass-link",
        "rect": [
          17,
          20,
          40,
          37
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-rear-guest-gable",
        "rect": [
          0,
          38,
          19,
          55
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "central-orchard-landing",
        "rect": [
          20,
          38,
          43,
          55
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "east-rear-guest-hip",
        "rect": [
          44,
          38,
          60,
          55
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      56
    ],
    "detail": "Two genuine open-air side courts with connected central covered gallery and seven individually pitched roof sections"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "large",
    "index": 4,
    "title": "Rimegate Lantern Courtyard Lodge",
    "plan": "rimegate-long-arms-open-u-snow-court",
    "w": 69,
    "d": 66,
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        24,
        25,
        46,
        65
      ],
      [
        62,
        9,
        68,
        15
      ]
    ],
    "segments": [
      [
        25,
        2,
        25,
        23
      ],
      [
        45,
        2,
        45,
        23
      ],
      [
        2,
        24,
        23,
        24
      ],
      [
        47,
        24,
        66,
        24
      ]
    ],
    "entry": [
      35,
      1,
      "grand-hall"
    ],
    "doors": [
      {
        "at": [
          25,
          1,
          6
        ],
        "from": "grand-hall",
        "to": "west-lounge"
      },
      {
        "at": [
          45,
          1,
          7
        ],
        "from": "grand-hall",
        "to": "east-lounge"
      },
      {
        "at": [
          11,
          1,
          24
        ],
        "from": "west-lounge",
        "to": "west-guest-wing"
      },
      {
        "at": [
          57,
          1,
          24
        ],
        "from": "east-lounge",
        "to": "east-guest-wing"
      }
    ],
    "rooms": [
      {
        "id": "west-lounge",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          26,
          4,
          24
        ]
      },
      {
        "id": "grand-hall",
        "min": [
          26,
          1,
          2
        ],
        "max": [
          46,
          4,
          24
        ]
      },
      {
        "id": "east-lounge",
        "min": [
          46,
          1,
          2
        ],
        "max": [
          67,
          4,
          24
        ]
      },
      {
        "id": "west-guest-wing",
        "min": [
          2,
          1,
          25
        ],
        "max": [
          24,
          4,
          64
        ]
      },
      {
        "id": "east-guest-wing",
        "min": [
          47,
          1,
          25
        ],
        "max": [
          67,
          4,
          64
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
        65,
        1,
        "north"
      ],
      [
        1,
        6,
        "west"
      ],
      [
        67,
        7,
        "east"
      ],
      [
        3,
        64,
        "south"
      ],
      [
        65,
        64,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-lounge",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 35,
        "z": 5,
        "room": "grand-hall",
        "asset": "pack4:064"
      },
      {
        "x": 61,
        "z": 5,
        "room": "east-lounge",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 30,
        "room": "west-guest-wing",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 61,
        "z": 30,
        "room": "east-guest-wing",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-bay",
        "rect": [
          0,
          0,
          25,
          24
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "central-elevated-guest-hall",
        "rect": [
          26,
          0,
          45,
          24
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "street-east-bay",
        "rect": [
          46,
          0,
          68,
          24
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "west-orchard-gallery",
        "rect": [
          0,
          25,
          23,
          45
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-deep-chambers",
        "rect": [
          0,
          46,
          23,
          65
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-orchard-gallery",
        "rect": [
          47,
          25,
          68,
          45
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "east-deep-chambers",
        "rect": [
          47,
          46,
          68,
          65
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      64
    ],
    "detail": "Deep asymmetric physically void garden court, two projecting guest arms and independent pitched roof transitions"
  }
]);
export const HOSPITALITY_WAVE8_IDS=Object.freeze(SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getHospitalityWave8(){return SPECS.map(compileM2ArchitecturalSpec);}
