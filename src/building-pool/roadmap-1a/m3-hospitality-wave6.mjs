// Mythwrought Builder 1A M3 hospitality Wave6: 13 original independently coordinate-authored stepped-S courtyard taverns and inns.
// Five articulated differentiated, producer-supported roof regions per original source, preserved room connectivity and no shared runtime edits.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "desert",
    "size": "small",
    "index": 4,
    "title": "Sunbriar Lantern Dyehouse Tavern",
    "w": 47,
    "d": 44,
    "plan": "sunbriar-lantern-dyehouse-tavern-sl-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        34,
        20,
        46,
        43
      ],
      [
        0,
        34,
        13,
        43
      ]
    ],
    "segments": [
      [
        15,
        2,
        15,
        18
      ],
      [
        31,
        2,
        31,
        18
      ],
      [
        2,
        19,
        32,
        19
      ],
      [
        15,
        34,
        32,
        34
      ]
    ],
    "entry": [
      19,
      1,
      "main-lantern-taproom"
    ],
    "doors": [
      {
        "at": [
          15,
          1,
          6
        ],
        "from": "main-lantern-taproom",
        "to": "western-brewers-kitchen"
      },
      {
        "at": [
          31,
          1,
          7
        ],
        "from": "main-lantern-taproom",
        "to": "eastern-music-gallery"
      },
      {
        "at": [
          8,
          1,
          19
        ],
        "from": "western-brewers-kitchen",
        "to": "stepped-barrel-service-corridor"
      },
      {
        "at": [
          23,
          1,
          34
        ],
        "from": "stepped-barrel-service-corridor",
        "to": "rear-staff-rest"
      }
    ],
    "rooms": [
      {
        "id": "western-brewers-kitchen",
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
        "id": "main-lantern-taproom",
        "min": [
          16,
          1,
          2
        ],
        "max": [
          31,
          4,
          19
        ]
      },
      {
        "id": "eastern-music-gallery",
        "min": [
          32,
          1,
          2
        ],
        "max": [
          45,
          4,
          19
        ]
      },
      {
        "id": "stepped-barrel-service-corridor",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          33,
          4,
          34
        ]
      },
      {
        "id": "rear-staff-rest",
        "min": [
          15,
          1,
          35
        ],
        "max": [
          33,
          4,
          43
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
        "room": "western-brewers-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 20,
        "z": 5,
        "room": "main-lantern-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 40,
        "z": 5,
        "room": "eastern-music-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 23,
        "room": "stepped-barrel-service-corridor",
        "asset": "pack5:084"
      },
      {
        "x": 23,
        "z": 36,
        "room": "rear-staff-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          15,
          19
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          16,
          0,
          31,
          19
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          32,
          0,
          46,
          19
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          0,
          20,
          33,
          33
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          14,
          34,
          33,
          43
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      42
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "desert",
    "size": "medium",
    "index": 4,
    "title": "Golden Wadi Caravan Exchange Pub",
    "w": 57,
    "d": 53,
    "plan": "golden-wadi-caravan-exchange-pub-sr-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        23,
        21,
        52
      ],
      [
        38,
        41,
        56,
        52
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
        38,
        2,
        38,
        21
      ],
      [
        23,
        22,
        54,
        22
      ],
      [
        23,
        41,
        36,
        41
      ]
    ],
    "entry": [
      25,
      1,
      "main-lantern-taproom"
    ],
    "doors": [
      {
        "at": [
          21,
          1,
          6
        ],
        "from": "main-lantern-taproom",
        "to": "western-brewers-kitchen"
      },
      {
        "at": [
          38,
          1,
          7
        ],
        "from": "main-lantern-taproom",
        "to": "eastern-music-gallery"
      },
      {
        "at": [
          49,
          1,
          22
        ],
        "from": "eastern-music-gallery",
        "to": "stepped-barrel-service-corridor"
      },
      {
        "at": [
          29,
          1,
          41
        ],
        "from": "stepped-barrel-service-corridor",
        "to": "rear-staff-rest"
      }
    ],
    "rooms": [
      {
        "id": "western-brewers-kitchen",
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
        "id": "main-lantern-taproom",
        "min": [
          22,
          1,
          2
        ],
        "max": [
          38,
          4,
          22
        ]
      },
      {
        "id": "eastern-music-gallery",
        "min": [
          39,
          1,
          2
        ],
        "max": [
          55,
          4,
          22
        ]
      },
      {
        "id": "stepped-barrel-service-corridor",
        "min": [
          23,
          1,
          23
        ],
        "max": [
          55,
          4,
          41
        ]
      },
      {
        "id": "rear-staff-rest",
        "min": [
          23,
          1,
          42
        ],
        "max": [
          37,
          4,
          52
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
        "room": "western-brewers-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 26,
        "z": 5,
        "room": "main-lantern-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 50,
        "z": 5,
        "room": "eastern-music-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 49,
        "z": 26,
        "room": "stepped-barrel-service-corridor",
        "asset": "pack5:084"
      },
      {
        "x": 29,
        "z": 43,
        "room": "rear-staff-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          21,
          22
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          22,
          0,
          38,
          22
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          39,
          0,
          56,
          22
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          22,
          23,
          56,
          40
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          22,
          41,
          37,
          52
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      52
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "snow",
    "size": "small",
    "index": 4,
    "title": "Snowfen Orchard Firelight Tavern",
    "w": 48,
    "d": 44,
    "plan": "snowfen-orchard-firelight-tavern-sr-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        21,
        12,
        43
      ],
      [
        32,
        37,
        47,
        43
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        19
      ],
      [
        34,
        2,
        34,
        19
      ],
      [
        14,
        20,
        45,
        20
      ],
      [
        14,
        37,
        30,
        37
      ]
    ],
    "entry": [
      18,
      1,
      "main-lantern-taproom"
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          6
        ],
        "from": "main-lantern-taproom",
        "to": "western-brewers-kitchen"
      },
      {
        "at": [
          34,
          1,
          7
        ],
        "from": "main-lantern-taproom",
        "to": "eastern-music-gallery"
      },
      {
        "at": [
          40,
          1,
          20
        ],
        "from": "eastern-music-gallery",
        "to": "stepped-barrel-service-corridor"
      },
      {
        "at": [
          22,
          1,
          37
        ],
        "from": "stepped-barrel-service-corridor",
        "to": "rear-staff-rest"
      }
    ],
    "rooms": [
      {
        "id": "western-brewers-kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          14,
          4,
          20
        ]
      },
      {
        "id": "main-lantern-taproom",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          34,
          4,
          20
        ]
      },
      {
        "id": "eastern-music-gallery",
        "min": [
          35,
          1,
          2
        ],
        "max": [
          46,
          4,
          20
        ]
      },
      {
        "id": "stepped-barrel-service-corridor",
        "min": [
          14,
          1,
          21
        ],
        "max": [
          46,
          4,
          37
        ]
      },
      {
        "id": "rear-staff-rest",
        "min": [
          14,
          1,
          38
        ],
        "max": [
          31,
          4,
          43
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
        44,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        46,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-brewers-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 19,
        "z": 5,
        "room": "main-lantern-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 41,
        "z": 5,
        "room": "eastern-music-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 40,
        "z": 24,
        "room": "stepped-barrel-service-corridor",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 39,
        "room": "rear-staff-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          14,
          20
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          15,
          0,
          34,
          20
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          35,
          0,
          47,
          20
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          13,
          21,
          47,
          36
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          13,
          37,
          31,
          43
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      43
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "snow",
    "size": "medium",
    "index": 5,
    "title": "Cedarhorn Winter Carvers Pub",
    "w": 57,
    "d": 53,
    "plan": "cedarhorn-winter-carvers-pub-sl-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        39,
        23,
        56,
        52
      ],
      [
        0,
        41,
        21,
        52
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
        40,
        2,
        40,
        21
      ],
      [
        2,
        22,
        37,
        22
      ],
      [
        23,
        41,
        37,
        41
      ]
    ],
    "entry": [
      25,
      1,
      "main-lantern-taproom"
    ],
    "doors": [
      {
        "at": [
          21,
          1,
          6
        ],
        "from": "main-lantern-taproom",
        "to": "western-brewers-kitchen"
      },
      {
        "at": [
          40,
          1,
          7
        ],
        "from": "main-lantern-taproom",
        "to": "eastern-music-gallery"
      },
      {
        "at": [
          8,
          1,
          22
        ],
        "from": "western-brewers-kitchen",
        "to": "stepped-barrel-service-corridor"
      },
      {
        "at": [
          30,
          1,
          41
        ],
        "from": "stepped-barrel-service-corridor",
        "to": "rear-staff-rest"
      }
    ],
    "rooms": [
      {
        "id": "western-brewers-kitchen",
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
        "id": "main-lantern-taproom",
        "min": [
          22,
          1,
          2
        ],
        "max": [
          40,
          4,
          22
        ]
      },
      {
        "id": "eastern-music-gallery",
        "min": [
          41,
          1,
          2
        ],
        "max": [
          55,
          4,
          22
        ]
      },
      {
        "id": "stepped-barrel-service-corridor",
        "min": [
          2,
          1,
          23
        ],
        "max": [
          38,
          4,
          41
        ]
      },
      {
        "id": "rear-staff-rest",
        "min": [
          23,
          1,
          42
        ],
        "max": [
          38,
          4,
          52
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
        "room": "western-brewers-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 26,
        "z": 5,
        "room": "main-lantern-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 50,
        "z": 5,
        "room": "eastern-music-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 26,
        "room": "stepped-barrel-service-corridor",
        "asset": "pack5:084"
      },
      {
        "x": 30,
        "z": 43,
        "room": "rear-staff-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          21,
          22
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          22,
          0,
          40,
          22
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          41,
          0,
          56,
          22
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          0,
          23,
          38,
          40
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          22,
          41,
          38,
          52
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      52
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "small",
    "index": 3,
    "title": "Ridgethorn Miners Lantern Tavern",
    "w": 49,
    "d": 45,
    "plan": "ridgethorn-miners-lantern-tavern-sl-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        33,
        22,
        48,
        44
      ],
      [
        0,
        37,
        16,
        44
      ]
    ],
    "segments": [
      [
        15,
        2,
        15,
        20
      ],
      [
        33,
        2,
        33,
        20
      ],
      [
        2,
        21,
        31,
        21
      ],
      [
        18,
        37,
        31,
        37
      ]
    ],
    "entry": [
      19,
      1,
      "main-lantern-taproom"
    ],
    "doors": [
      {
        "at": [
          15,
          1,
          6
        ],
        "from": "main-lantern-taproom",
        "to": "western-brewers-kitchen"
      },
      {
        "at": [
          33,
          1,
          7
        ],
        "from": "main-lantern-taproom",
        "to": "eastern-music-gallery"
      },
      {
        "at": [
          8,
          1,
          21
        ],
        "from": "western-brewers-kitchen",
        "to": "stepped-barrel-service-corridor"
      },
      {
        "at": [
          24,
          1,
          37
        ],
        "from": "stepped-barrel-service-corridor",
        "to": "rear-staff-rest"
      }
    ],
    "rooms": [
      {
        "id": "western-brewers-kitchen",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          21
        ]
      },
      {
        "id": "main-lantern-taproom",
        "min": [
          16,
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
        "id": "eastern-music-gallery",
        "min": [
          34,
          1,
          2
        ],
        "max": [
          47,
          4,
          21
        ]
      },
      {
        "id": "stepped-barrel-service-corridor",
        "min": [
          2,
          1,
          22
        ],
        "max": [
          32,
          4,
          37
        ]
      },
      {
        "id": "rear-staff-rest",
        "min": [
          18,
          1,
          38
        ],
        "max": [
          32,
          4,
          44
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
        45,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        47,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-brewers-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 20,
        "z": 5,
        "room": "main-lantern-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 42,
        "z": 5,
        "room": "eastern-music-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 25,
        "room": "stepped-barrel-service-corridor",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 39,
        "room": "rear-staff-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          15,
          21
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          16,
          0,
          33,
          21
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          34,
          0,
          48,
          21
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          0,
          22,
          32,
          36
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          17,
          37,
          32,
          44
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      44
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "medium",
    "index": 5,
    "title": "Stonebriar Summit Switchback Pub",
    "w": 59,
    "d": 55,
    "plan": "stonebriar-summit-switchback-pub-sr-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        24,
        19,
        54
      ],
      [
        42,
        45,
        58,
        54
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
        42,
        2,
        42,
        22
      ],
      [
        21,
        23,
        56,
        23
      ],
      [
        21,
        45,
        40,
        45
      ]
    ],
    "entry": [
      22,
      1,
      "main-lantern-taproom"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "main-lantern-taproom",
        "to": "western-brewers-kitchen"
      },
      {
        "at": [
          42,
          1,
          7
        ],
        "from": "main-lantern-taproom",
        "to": "eastern-music-gallery"
      },
      {
        "at": [
          51,
          1,
          23
        ],
        "from": "eastern-music-gallery",
        "to": "stepped-barrel-service-corridor"
      },
      {
        "at": [
          30,
          1,
          45
        ],
        "from": "stepped-barrel-service-corridor",
        "to": "rear-staff-rest"
      }
    ],
    "rooms": [
      {
        "id": "western-brewers-kitchen",
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
        "id": "main-lantern-taproom",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          42,
          4,
          23
        ]
      },
      {
        "id": "eastern-music-gallery",
        "min": [
          43,
          1,
          2
        ],
        "max": [
          57,
          4,
          23
        ]
      },
      {
        "id": "stepped-barrel-service-corridor",
        "min": [
          21,
          1,
          24
        ],
        "max": [
          57,
          4,
          45
        ]
      },
      {
        "id": "rear-staff-rest",
        "min": [
          21,
          1,
          46
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
        55,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        57,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-brewers-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 23,
        "z": 5,
        "room": "main-lantern-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 52,
        "z": 5,
        "room": "eastern-music-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 51,
        "z": 27,
        "room": "stepped-barrel-service-corridor",
        "asset": "pack5:084"
      },
      {
        "x": 30,
        "z": 47,
        "room": "rear-staff-rest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          18,
          23
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          19,
          0,
          42,
          23
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          43,
          0,
          58,
          23
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          20,
          24,
          58,
          44
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          20,
          45,
          41,
          54
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      54
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "medium",
    "index": 2,
    "title": "Windwheel Long Orchard Guesthouse",
    "w": 59,
    "d": 54,
    "plan": "windwheel-long-orchard-guesthouse-sr-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        25,
        21,
        53
      ],
      [
        40,
        45,
        58,
        53
      ]
    ],
    "segments": [
      [
        21,
        2,
        21,
        23
      ],
      [
        39,
        2,
        39,
        23
      ],
      [
        23,
        24,
        56,
        24
      ],
      [
        23,
        45,
        38,
        45
      ]
    ],
    "entry": [
      25,
      1,
      "stone-hearth-reception"
    ],
    "doors": [
      {
        "at": [
          21,
          1,
          6
        ],
        "from": "stone-hearth-reception",
        "to": "western-traveler-bedroom"
      },
      {
        "at": [
          39,
          1,
          7
        ],
        "from": "stone-hearth-reception",
        "to": "eastern-traveler-bedroom"
      },
      {
        "at": [
          51,
          1,
          24
        ],
        "from": "eastern-traveler-bedroom",
        "to": "offset-linen-and-wash-gallery"
      },
      {
        "at": [
          30,
          1,
          45
        ],
        "from": "offset-linen-and-wash-gallery",
        "to": "rear-family-lodging"
      }
    ],
    "rooms": [
      {
        "id": "western-traveler-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          21,
          4,
          24
        ]
      },
      {
        "id": "stone-hearth-reception",
        "min": [
          22,
          1,
          2
        ],
        "max": [
          39,
          4,
          24
        ]
      },
      {
        "id": "eastern-traveler-bedroom",
        "min": [
          40,
          1,
          2
        ],
        "max": [
          57,
          4,
          24
        ]
      },
      {
        "id": "offset-linen-and-wash-gallery",
        "min": [
          23,
          1,
          25
        ],
        "max": [
          57,
          4,
          45
        ]
      },
      {
        "id": "rear-family-lodging",
        "min": [
          23,
          1,
          46
        ],
        "max": [
          39,
          4,
          53
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
        55,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        57,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 26,
        "z": 5,
        "room": "stone-hearth-reception",
        "asset": "pack4:064"
      },
      {
        "x": 52,
        "z": 5,
        "room": "eastern-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 51,
        "z": 28,
        "room": "offset-linen-and-wash-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 30,
        "z": 47,
        "room": "rear-family-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          21,
          24
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          22,
          0,
          39,
          24
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          40,
          0,
          58,
          24
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          22,
          25,
          58,
          44
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          22,
          45,
          39,
          53
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      54
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "small",
    "index": 2,
    "title": "Ochre Willow Wellspring Inn",
    "w": 49,
    "d": 45,
    "plan": "ochre-willow-wellspring-inn-sr-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        22,
        17,
        44
      ],
      [
        32,
        36,
        48,
        44
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        20
      ],
      [
        32,
        2,
        32,
        20
      ],
      [
        19,
        21,
        46,
        21
      ],
      [
        19,
        36,
        30,
        36
      ]
    ],
    "entry": [
      21,
      1,
      "stone-hearth-reception"
    ],
    "doors": [
      {
        "at": [
          17,
          1,
          6
        ],
        "from": "stone-hearth-reception",
        "to": "western-traveler-bedroom"
      },
      {
        "at": [
          32,
          1,
          7
        ],
        "from": "stone-hearth-reception",
        "to": "eastern-traveler-bedroom"
      },
      {
        "at": [
          41,
          1,
          21
        ],
        "from": "eastern-traveler-bedroom",
        "to": "offset-linen-and-wash-gallery"
      },
      {
        "at": [
          24,
          1,
          36
        ],
        "from": "offset-linen-and-wash-gallery",
        "to": "rear-family-lodging"
      }
    ],
    "rooms": [
      {
        "id": "western-traveler-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          21
        ]
      },
      {
        "id": "stone-hearth-reception",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          32,
          4,
          21
        ]
      },
      {
        "id": "eastern-traveler-bedroom",
        "min": [
          33,
          1,
          2
        ],
        "max": [
          47,
          4,
          21
        ]
      },
      {
        "id": "offset-linen-and-wash-gallery",
        "min": [
          19,
          1,
          22
        ],
        "max": [
          47,
          4,
          36
        ]
      },
      {
        "id": "rear-family-lodging",
        "min": [
          19,
          1,
          37
        ],
        "max": [
          31,
          4,
          44
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
        45,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        47,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 22,
        "z": 5,
        "room": "stone-hearth-reception",
        "asset": "pack4:064"
      },
      {
        "x": 42,
        "z": 5,
        "room": "eastern-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 41,
        "z": 25,
        "room": "offset-linen-and-wash-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 38,
        "room": "rear-family-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          17,
          21
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          18,
          0,
          32,
          21
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          33,
          0,
          48,
          21
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          18,
          22,
          48,
          35
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          18,
          36,
          31,
          44
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      44
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "medium",
    "index": 4,
    "title": "Saffronstar Caravan Courtyard Inn",
    "w": 59,
    "d": 55,
    "plan": "saffronstar-caravan-courtyard-inn-sl-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        43,
        23,
        58,
        54
      ],
      [
        0,
        46,
        22,
        54
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        21
      ],
      [
        40,
        2,
        40,
        21
      ],
      [
        2,
        22,
        41,
        22
      ],
      [
        24,
        46,
        41,
        46
      ]
    ],
    "entry": [
      22,
      1,
      "stone-hearth-reception"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "stone-hearth-reception",
        "to": "western-traveler-bedroom"
      },
      {
        "at": [
          40,
          1,
          7
        ],
        "from": "stone-hearth-reception",
        "to": "eastern-traveler-bedroom"
      },
      {
        "at": [
          8,
          1,
          22
        ],
        "from": "western-traveler-bedroom",
        "to": "offset-linen-and-wash-gallery"
      },
      {
        "at": [
          32,
          1,
          46
        ],
        "from": "offset-linen-and-wash-gallery",
        "to": "rear-family-lodging"
      }
    ],
    "rooms": [
      {
        "id": "western-traveler-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          22
        ]
      },
      {
        "id": "stone-hearth-reception",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          40,
          4,
          22
        ]
      },
      {
        "id": "eastern-traveler-bedroom",
        "min": [
          41,
          1,
          2
        ],
        "max": [
          57,
          4,
          22
        ]
      },
      {
        "id": "offset-linen-and-wash-gallery",
        "min": [
          2,
          1,
          23
        ],
        "max": [
          42,
          4,
          46
        ]
      },
      {
        "id": "rear-family-lodging",
        "min": [
          24,
          1,
          47
        ],
        "max": [
          42,
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
        55,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        57,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "stone-hearth-reception",
        "asset": "pack4:064"
      },
      {
        "x": 52,
        "z": 5,
        "room": "eastern-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 26,
        "room": "offset-linen-and-wash-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 32,
        "z": 48,
        "room": "rear-family-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          18,
          22
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          19,
          0,
          40,
          22
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          41,
          0,
          58,
          22
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          0,
          23,
          42,
          45
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          23,
          46,
          42,
          54
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      54
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "medium",
    "index": 3,
    "title": "Frostbarrow Alpine Guest Retreat",
    "w": 59,
    "d": 55,
    "plan": "frostbarrow-alpine-guest-retreat-sl-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        42,
        25,
        58,
        54
      ],
      [
        0,
        47,
        18,
        54
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
        43,
        2,
        43,
        23
      ],
      [
        2,
        24,
        40,
        24
      ],
      [
        20,
        47,
        40,
        47
      ]
    ],
    "entry": [
      23,
      1,
      "stone-hearth-reception"
    ],
    "doors": [
      {
        "at": [
          19,
          1,
          6
        ],
        "from": "stone-hearth-reception",
        "to": "western-traveler-bedroom"
      },
      {
        "at": [
          43,
          1,
          7
        ],
        "from": "stone-hearth-reception",
        "to": "eastern-traveler-bedroom"
      },
      {
        "at": [
          8,
          1,
          24
        ],
        "from": "western-traveler-bedroom",
        "to": "offset-linen-and-wash-gallery"
      },
      {
        "at": [
          30,
          1,
          47
        ],
        "from": "offset-linen-and-wash-gallery",
        "to": "rear-family-lodging"
      }
    ],
    "rooms": [
      {
        "id": "western-traveler-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          19,
          4,
          24
        ]
      },
      {
        "id": "stone-hearth-reception",
        "min": [
          20,
          1,
          2
        ],
        "max": [
          43,
          4,
          24
        ]
      },
      {
        "id": "eastern-traveler-bedroom",
        "min": [
          44,
          1,
          2
        ],
        "max": [
          57,
          4,
          24
        ]
      },
      {
        "id": "offset-linen-and-wash-gallery",
        "min": [
          2,
          1,
          25
        ],
        "max": [
          41,
          4,
          47
        ]
      },
      {
        "id": "rear-family-lodging",
        "min": [
          20,
          1,
          48
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
        55,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        57,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 5,
        "room": "stone-hearth-reception",
        "asset": "pack4:064"
      },
      {
        "x": 52,
        "z": 5,
        "room": "eastern-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 28,
        "room": "offset-linen-and-wash-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 30,
        "z": 49,
        "room": "rear-family-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          19,
          24
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          20,
          0,
          43,
          24
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          44,
          0,
          58,
          24
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          0,
          25,
          41,
          46
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          19,
          47,
          41,
          54
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      54
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "large",
    "index": 1,
    "title": "Wintersong Auroral Lodge",
    "w": 71,
    "d": 66,
    "plan": "wintersong-auroral-lodge-sr-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        31,
        26,
        65
      ],
      [
        50,
        56,
        70,
        65
      ]
    ],
    "segments": [
      [
        24,
        2,
        24,
        29
      ],
      [
        51,
        2,
        51,
        29
      ],
      [
        28,
        30,
        68,
        30
      ],
      [
        28,
        56,
        48,
        56
      ]
    ],
    "entry": [
      28,
      1,
      "stone-hearth-reception"
    ],
    "doors": [
      {
        "at": [
          24,
          1,
          6
        ],
        "from": "stone-hearth-reception",
        "to": "western-traveler-bedroom"
      },
      {
        "at": [
          51,
          1,
          7
        ],
        "from": "stone-hearth-reception",
        "to": "eastern-traveler-bedroom"
      },
      {
        "at": [
          63,
          1,
          30
        ],
        "from": "eastern-traveler-bedroom",
        "to": "offset-linen-and-wash-gallery"
      },
      {
        "at": [
          38,
          1,
          56
        ],
        "from": "offset-linen-and-wash-gallery",
        "to": "rear-family-lodging"
      }
    ],
    "rooms": [
      {
        "id": "western-traveler-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          24,
          4,
          30
        ]
      },
      {
        "id": "stone-hearth-reception",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          51,
          4,
          30
        ]
      },
      {
        "id": "eastern-traveler-bedroom",
        "min": [
          52,
          1,
          2
        ],
        "max": [
          69,
          4,
          30
        ]
      },
      {
        "id": "offset-linen-and-wash-gallery",
        "min": [
          28,
          1,
          31
        ],
        "max": [
          69,
          4,
          56
        ]
      },
      {
        "id": "rear-family-lodging",
        "min": [
          28,
          1,
          57
        ],
        "max": [
          49,
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
        67,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        69,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 29,
        "z": 5,
        "room": "stone-hearth-reception",
        "asset": "pack4:064"
      },
      {
        "x": 64,
        "z": 5,
        "room": "eastern-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 63,
        "z": 34,
        "room": "offset-linen-and-wash-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 38,
        "z": 58,
        "room": "rear-family-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          24,
          30
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          25,
          0,
          51,
          30
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          52,
          0,
          70,
          30
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          27,
          31,
          70,
          55
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          27,
          56,
          49,
          65
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      4,
      66
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 3,
    "title": "Candlefern Elderwood Night Inn",
    "w": 49,
    "d": 46,
    "plan": "candlefern-elderwood-night-inn-sl-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        37,
        22,
        48,
        45
      ],
      [
        0,
        37,
        15,
        45
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        20
      ],
      [
        35,
        2,
        35,
        20
      ],
      [
        2,
        21,
        35,
        21
      ],
      [
        17,
        37,
        35,
        37
      ]
    ],
    "entry": [
      22,
      1,
      "stone-hearth-reception"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "stone-hearth-reception",
        "to": "western-traveler-bedroom"
      },
      {
        "at": [
          35,
          1,
          7
        ],
        "from": "stone-hearth-reception",
        "to": "eastern-traveler-bedroom"
      },
      {
        "at": [
          8,
          1,
          21
        ],
        "from": "western-traveler-bedroom",
        "to": "offset-linen-and-wash-gallery"
      },
      {
        "at": [
          26,
          1,
          37
        ],
        "from": "offset-linen-and-wash-gallery",
        "to": "rear-family-lodging"
      }
    ],
    "rooms": [
      {
        "id": "western-traveler-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          21
        ]
      },
      {
        "id": "stone-hearth-reception",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          35,
          4,
          21
        ]
      },
      {
        "id": "eastern-traveler-bedroom",
        "min": [
          36,
          1,
          2
        ],
        "max": [
          47,
          4,
          21
        ]
      },
      {
        "id": "offset-linen-and-wash-gallery",
        "min": [
          2,
          1,
          22
        ],
        "max": [
          36,
          4,
          37
        ]
      },
      {
        "id": "rear-family-lodging",
        "min": [
          17,
          1,
          38
        ],
        "max": [
          36,
          4,
          45
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
        45,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        47,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "stone-hearth-reception",
        "asset": "pack4:064"
      },
      {
        "x": 42,
        "z": 5,
        "room": "eastern-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 25,
        "room": "offset-linen-and-wash-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 26,
        "z": 39,
        "room": "rear-family-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          18,
          21
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          19,
          0,
          35,
          21
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          36,
          0,
          48,
          21
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          0,
          22,
          36,
          36
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          16,
          37,
          36,
          45
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      44
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  },
  {
    "category": "inn",
    "biome": "mountain",
    "size": "medium",
    "index": 1,
    "title": "Silverpass Highridge Guest Inn",
    "w": 62,
    "d": 56,
    "plan": "silverpass-highridge-guest-inn-sl-offset-double-staggered-court",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        44,
        25,
        61,
        55
      ],
      [
        0,
        47,
        21,
        55
      ]
    ],
    "segments": [
      [
        21,
        2,
        21,
        23
      ],
      [
        42,
        2,
        42,
        23
      ],
      [
        2,
        24,
        42,
        24
      ],
      [
        23,
        47,
        42,
        47
      ]
    ],
    "entry": [
      25,
      1,
      "stone-hearth-reception"
    ],
    "doors": [
      {
        "at": [
          21,
          1,
          6
        ],
        "from": "stone-hearth-reception",
        "to": "western-traveler-bedroom"
      },
      {
        "at": [
          42,
          1,
          7
        ],
        "from": "stone-hearth-reception",
        "to": "eastern-traveler-bedroom"
      },
      {
        "at": [
          8,
          1,
          24
        ],
        "from": "western-traveler-bedroom",
        "to": "offset-linen-and-wash-gallery"
      },
      {
        "at": [
          32,
          1,
          47
        ],
        "from": "offset-linen-and-wash-gallery",
        "to": "rear-family-lodging"
      }
    ],
    "rooms": [
      {
        "id": "western-traveler-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          21,
          4,
          24
        ]
      },
      {
        "id": "stone-hearth-reception",
        "min": [
          22,
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
        "id": "eastern-traveler-bedroom",
        "min": [
          43,
          1,
          2
        ],
        "max": [
          60,
          4,
          24
        ]
      },
      {
        "id": "offset-linen-and-wash-gallery",
        "min": [
          2,
          1,
          25
        ],
        "max": [
          43,
          4,
          47
        ]
      },
      {
        "id": "rear-family-lodging",
        "min": [
          23,
          1,
          48
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
        "room": "western-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 26,
        "z": 5,
        "room": "stone-hearth-reception",
        "asset": "pack4:064"
      },
      {
        "x": 55,
        "z": 5,
        "room": "eastern-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 28,
        "room": "offset-linen-and-wash-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 32,
        "z": 49,
        "room": "rear-family-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "western-pitched-entry-porch",
        "rect": [
          0,
          0,
          21,
          24
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "raised-central-cross-gable",
        "rect": [
          22,
          0,
          42,
          24
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "eastern-tiled-spire",
        "rect": [
          43,
          0,
          61,
          24
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "mid-level-angled-serving-pavilion",
        "rect": [
          0,
          25,
          43,
          46
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "rear-lodging-lookout-roof",
        "rect": [
          22,
          47,
          43,
          55
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      57
    ],
    "detail": "Original stepped half-court five-wing pitched silhouette, reachable rooms, supported roofs and producer physical fixtures"
  }
]);
export const HOSPITALITY_WAVE6_IDS=Object.freeze(SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getHospitalityWave6(){return SPECS.map(compileM2ArchitecturalSpec);}
