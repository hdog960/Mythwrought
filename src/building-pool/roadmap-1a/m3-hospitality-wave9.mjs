// Mythwrought Builder 1A M3 Wave9: five independently source-coordinate-authored E-comb, forward-forked and side-C hospitality architectures.
// Literal interior portals, walkable rooms, true removed exterior columns, layered supported roofs and exact Pack1–5 symbolic assets.
// Candidate only: no runtime placement, world, saves, shared Pack producers or v0.11 changes.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "large",
    "index": 1,
    "title": "Riverspire Seven-Wing Ale Conservatory",
    "w": 75,
    "d": 68,
    "plan": "riverspire-seven-bay-e-comb-side-void-conservatory",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        22,
        20,
        39
      ],
      [
        0,
        52,
        22,
        67
      ],
      [
        59,
        40,
        74,
        67
      ]
    ],
    "segments": [
      [
        24,
        2,
        24,
        20
      ],
      [
        52,
        2,
        52,
        20
      ],
      [
        21,
        21,
        72,
        21
      ],
      [
        59,
        22,
        59,
        39
      ],
      [
        23,
        40,
        58,
        40
      ],
      [
        23,
        52,
        58,
        52
      ]
    ],
    "entry": [
      38,
      1,
      "front-hall"
    ],
    "doors": [
      {
        "at": [
          24,
          1,
          6
        ],
        "from": "front-hall",
        "to": "west-front"
      },
      {
        "at": [
          52,
          1,
          7
        ],
        "from": "front-hall",
        "to": "east-front"
      },
      {
        "at": [
          38,
          1,
          21
        ],
        "from": "front-hall",
        "to": "brew-gallery"
      },
      {
        "at": [
          59,
          1,
          28
        ],
        "from": "brew-gallery",
        "to": "east-platform"
      },
      {
        "at": [
          40,
          1,
          40
        ],
        "from": "brew-gallery",
        "to": "rear-archive"
      },
      {
        "at": [
          40,
          1,
          52
        ],
        "from": "rear-archive",
        "to": "rear-private"
      }
    ],
    "rooms": [
      {
        "id": "west-front",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          25,
          4,
          21
        ]
      },
      {
        "id": "front-hall",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          53,
          4,
          21
        ]
      },
      {
        "id": "east-front",
        "min": [
          53,
          1,
          2
        ],
        "max": [
          73,
          4,
          21
        ]
      },
      {
        "id": "brew-gallery",
        "min": [
          21,
          1,
          22
        ],
        "max": [
          59,
          4,
          40
        ]
      },
      {
        "id": "east-platform",
        "min": [
          59,
          1,
          22
        ],
        "max": [
          73,
          4,
          40
        ]
      },
      {
        "id": "rear-archive",
        "min": [
          23,
          1,
          41
        ],
        "max": [
          59,
          4,
          52
        ]
      },
      {
        "id": "rear-private",
        "min": [
          23,
          1,
          53
        ],
        "max": [
          59,
          4,
          66
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
        9,
        "west"
      ],
      [
        73,
        9,
        "east"
      ],
      [
        32,
        66,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-front",
        "asset": "pack4:059"
      },
      {
        "x": 38,
        "z": 5,
        "room": "front-hall",
        "asset": "pack4:064"
      },
      {
        "x": 68,
        "z": 5,
        "room": "east-front",
        "asset": "pack4:059"
      },
      {
        "x": 27,
        "z": 27,
        "room": "brew-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 68,
        "z": 27,
        "room": "east-platform",
        "asset": "pack4:059"
      },
      {
        "x": 30,
        "z": 45,
        "room": "rear-archive",
        "asset": "pack4:059"
      },
      {
        "x": 30,
        "z": 57,
        "room": "rear-private",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-barn",
        "rect": [
          0,
          0,
          24,
          21
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "elevated-street-hall",
        "rect": [
          25,
          0,
          52,
          21
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-merchants",
        "rect": [
          53,
          0,
          74,
          21
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "covered-gallery",
        "rect": [
          21,
          22,
          58,
          39
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "east-lantern",
        "rect": [
          59,
          22,
          74,
          39
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "deep-rear-archive",
        "rect": [
          23,
          40,
          58,
          52
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "high-private-guest",
        "rect": [
          23,
          53,
          58,
          67
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      70
    ],
    "detail": "Original triple-cut E-comb public architecture, exposed northwest side bays, long galleries and seven varied roof pitches"
  },
  {
    "category": "tavern",
    "biome": "desert",
    "size": "small",
    "index": 5,
    "title": "Copperglass Crescent Court Tavern",
    "w": 51,
    "d": 44,
    "plan": "copperglass-forward-forked-north-garden-bridge",
    "roof": "courtyard",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        17,
        0,
        33,
        15
      ]
    ],
    "segments": [
      [
        2,
        16,
        48,
        16
      ],
      [
        2,
        30,
        48,
        30
      ],
      [
        17,
        31,
        17,
        41
      ],
      [
        34,
        31,
        34,
        41
      ]
    ],
    "entry": [
      8,
      1,
      "left-front"
    ],
    "doors": [
      {
        "at": [
          8,
          1,
          16
        ],
        "from": "left-front",
        "to": "cross-commons"
      },
      {
        "at": [
          41,
          1,
          16
        ],
        "from": "right-front",
        "to": "cross-commons"
      },
      {
        "at": [
          8,
          1,
          30
        ],
        "from": "cross-commons",
        "to": "west-back"
      },
      {
        "at": [
          25,
          1,
          30
        ],
        "from": "cross-commons",
        "to": "central-back"
      },
      {
        "at": [
          41,
          1,
          30
        ],
        "from": "cross-commons",
        "to": "east-back"
      }
    ],
    "rooms": [
      {
        "id": "left-front",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          16
        ]
      },
      {
        "id": "right-front",
        "min": [
          34,
          1,
          2
        ],
        "max": [
          49,
          4,
          16
        ]
      },
      {
        "id": "cross-commons",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          49,
          4,
          30
        ]
      },
      {
        "id": "west-back",
        "min": [
          2,
          1,
          31
        ],
        "max": [
          18,
          4,
          42
        ]
      },
      {
        "id": "central-back",
        "min": [
          18,
          1,
          31
        ],
        "max": [
          35,
          4,
          42
        ]
      },
      {
        "id": "east-back",
        "min": [
          35,
          1,
          31
        ],
        "max": [
          49,
          4,
          42
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
        47,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        49,
        8,
        "east"
      ],
      [
        3,
        42,
        "south"
      ],
      [
        47,
        42,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "left-front",
        "asset": "pack5:084"
      },
      {
        "x": 43,
        "z": 5,
        "room": "right-front",
        "asset": "pack4:059"
      },
      {
        "x": 25,
        "z": 21,
        "room": "cross-commons",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 35,
        "room": "west-back",
        "asset": "pack4:059"
      },
      {
        "x": 25,
        "z": 35,
        "room": "central-back",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 43,
        "z": 35,
        "room": "east-back",
        "asset": "pack4:059"
      }
    ],
    "roofWings": [
      {
        "name": "left-forward-gabled-entry",
        "rect": [
          0,
          0,
          16,
          16
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "right-forward-guest-gable",
        "rect": [
          34,
          0,
          50,
          16
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "rear-crossing",
        "rect": [
          0,
          17,
          50,
          30
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-rear-sleeping",
        "rect": [
          0,
          31,
          17,
          43
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "central-chimney-rise",
        "rect": [
          18,
          31,
          34,
          43
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "east-private-room",
        "rect": [
          35,
          31,
          50,
          43
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      46
    ],
    "detail": "Independent forward-forked north garden, two disconnected front pavilions coupled behind by a broad commons and six supported roofs"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "medium",
    "index": 1,
    "title": "Driftrock Three-Arch Fireside Tavern",
    "w": 62,
    "d": 55,
    "plan": "driftrock-courtyard-c-side-void-arcade",
    "roof": "hip",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        20,
        22,
        36
      ],
      [
        56,
        9,
        61,
        17
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        18
      ],
      [
        41,
        2,
        41,
        18
      ],
      [
        23,
        19,
        59,
        19
      ],
      [
        47,
        20,
        47,
        36
      ],
      [
        23,
        37,
        59,
        37
      ],
      [
        22,
        38,
        22,
        52
      ],
      [
        46,
        38,
        46,
        52
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
          18,
          1,
          6
        ],
        "from": "front-hall",
        "to": "west-feast"
      },
      {
        "at": [
          41,
          1,
          7
        ],
        "from": "front-hall",
        "to": "east-front"
      },
      {
        "at": [
          29,
          1,
          19
        ],
        "from": "front-hall",
        "to": "garden-gallery"
      },
      {
        "at": [
          47,
          1,
          26
        ],
        "from": "garden-gallery",
        "to": "east-study"
      },
      {
        "at": [
          34,
          1,
          37
        ],
        "from": "garden-gallery",
        "to": "central-rear"
      },
      {
        "at": [
          22,
          1,
          43
        ],
        "from": "central-rear",
        "to": "west-rear"
      },
      {
        "at": [
          46,
          1,
          44
        ],
        "from": "central-rear",
        "to": "east-rear"
      }
    ],
    "rooms": [
      {
        "id": "west-feast",
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
        "id": "front-hall",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          42,
          4,
          19
        ]
      },
      {
        "id": "east-front",
        "min": [
          42,
          1,
          2
        ],
        "max": [
          60,
          4,
          19
        ]
      },
      {
        "id": "garden-gallery",
        "min": [
          23,
          1,
          20
        ],
        "max": [
          47,
          4,
          37
        ]
      },
      {
        "id": "east-study",
        "min": [
          47,
          1,
          20
        ],
        "max": [
          60,
          4,
          37
        ]
      },
      {
        "id": "west-rear",
        "min": [
          2,
          1,
          38
        ],
        "max": [
          23,
          4,
          53
        ]
      },
      {
        "id": "central-rear",
        "min": [
          23,
          1,
          38
        ],
        "max": [
          47,
          4,
          53
        ]
      },
      {
        "id": "east-rear",
        "min": [
          47,
          1,
          38
        ],
        "max": [
          60,
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
        7,
        "east"
      ],
      [
        3,
        53,
        "south"
      ],
      [
        60,
        47,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-feast",
        "asset": "pack4:059"
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
        "room": "east-front",
        "asset": "pack4:059"
      },
      {
        "x": 29,
        "z": 25,
        "room": "garden-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 54,
        "z": 25,
        "room": "east-study",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 43,
        "room": "west-rear",
        "asset": "pack4:059"
      },
      {
        "x": 34,
        "z": 43,
        "room": "central-rear",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 54,
        "z": 43,
        "room": "east-rear",
        "asset": "pack4:059"
      }
    ],
    "roofWings": [
      {
        "name": "stone-west-feast",
        "rect": [
          0,
          0,
          18,
          19
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "raised-cross-entry",
        "rect": [
          19,
          0,
          41,
          19
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "east-foyer-hip",
        "rect": [
          42,
          0,
          61,
          19
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "inward-arcade",
        "rect": [
          23,
          20,
          46,
          36
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "east-study-watch",
        "rect": [
          47,
          20,
          61,
          36
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "west-back-observatory",
        "rect": [
          0,
          37,
          22,
          54
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "central-brewing-ridge",
        "rect": [
          23,
          37,
          46,
          54
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-back-gallery",
        "rect": [
          47,
          37,
          61,
          54
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      57
    ],
    "detail": "Original side-void C courtyard crossed by long front public halls, deep east watch-gallery and three independently linked rear chambers"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "large",
    "index": 4,
    "title": "Sunspire Woven Gate Guest Villa",
    "w": 78,
    "d": 70,
    "plan": "sunspire-woven-market-e-triple-terrace",
    "roof": "steep",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        24,
        24,
        40
      ],
      [
        0,
        56,
        18,
        69
      ],
      [
        58,
        41,
        77,
        69
      ]
    ],
    "segments": [
      [
        21,
        2,
        21,
        22
      ],
      [
        52,
        2,
        52,
        22
      ],
      [
        25,
        23,
        75,
        23
      ],
      [
        58,
        24,
        58,
        40
      ],
      [
        19,
        41,
        57,
        41
      ],
      [
        19,
        56,
        57,
        56
      ]
    ],
    "entry": [
      36,
      1,
      "front-hall"
    ],
    "doors": [
      {
        "at": [
          21,
          1,
          6
        ],
        "from": "front-hall",
        "to": "west-front"
      },
      {
        "at": [
          52,
          1,
          7
        ],
        "from": "front-hall",
        "to": "east-front"
      },
      {
        "at": [
          36,
          1,
          23
        ],
        "from": "front-hall",
        "to": "brew-gallery"
      },
      {
        "at": [
          58,
          1,
          30
        ],
        "from": "brew-gallery",
        "to": "east-platform"
      },
      {
        "at": [
          37,
          1,
          41
        ],
        "from": "brew-gallery",
        "to": "rear-archive"
      },
      {
        "at": [
          37,
          1,
          56
        ],
        "from": "rear-archive",
        "to": "rear-private"
      }
    ],
    "rooms": [
      {
        "id": "west-front",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          22,
          4,
          23
        ]
      },
      {
        "id": "front-hall",
        "min": [
          22,
          1,
          2
        ],
        "max": [
          53,
          4,
          23
        ]
      },
      {
        "id": "east-front",
        "min": [
          53,
          1,
          2
        ],
        "max": [
          76,
          4,
          23
        ]
      },
      {
        "id": "brew-gallery",
        "min": [
          25,
          1,
          24
        ],
        "max": [
          58,
          4,
          41
        ]
      },
      {
        "id": "east-platform",
        "min": [
          58,
          1,
          24
        ],
        "max": [
          76,
          4,
          41
        ]
      },
      {
        "id": "rear-archive",
        "min": [
          19,
          1,
          42
        ],
        "max": [
          58,
          4,
          56
        ]
      },
      {
        "id": "rear-private",
        "min": [
          19,
          1,
          57
        ],
        "max": [
          58,
          4,
          68
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
        74,
        1,
        "north"
      ],
      [
        1,
        9,
        "west"
      ],
      [
        76,
        9,
        "east"
      ],
      [
        28,
        68,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-front",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 36,
        "z": 5,
        "room": "front-hall",
        "asset": "pack4:064"
      },
      {
        "x": 71,
        "z": 5,
        "room": "east-front",
        "asset": "pack4:059"
      },
      {
        "x": 31,
        "z": 29,
        "room": "brew-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 71,
        "z": 29,
        "room": "east-platform",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 26,
        "z": 46,
        "room": "rear-archive",
        "asset": "pack4:059"
      },
      {
        "x": 26,
        "z": 61,
        "room": "rear-private",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-barn",
        "rect": [
          0,
          0,
          21,
          23
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "elevated-street-hall",
        "rect": [
          22,
          0,
          52,
          23
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-merchants",
        "rect": [
          53,
          0,
          77,
          23
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "covered-gallery",
        "rect": [
          25,
          24,
          57,
          40
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "east-lantern",
        "rect": [
          58,
          24,
          77,
          40
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "deep-rear-archive",
        "rect": [
          19,
          41,
          57,
          56
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "high-private-guest",
        "rect": [
          19,
          57,
          57,
          69
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      73
    ],
    "detail": "Original triple-cut E-comb public architecture, exposed northwest side bays, long galleries and seven varied roof pitches"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 3,
    "title": "Moonmoss Foxfire Orchard Inn",
    "w": 65,
    "d": 59,
    "plan": "moonmoss-northern-forked-woodland-guest-court",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        21,
        0,
        42,
        19
      ],
      [
        52,
        24,
        64,
        37
      ]
    ],
    "segments": [
      [
        2,
        20,
        62,
        20
      ],
      [
        2,
        40,
        62,
        40
      ],
      [
        20,
        41,
        20,
        56
      ],
      [
        43,
        41,
        43,
        56
      ]
    ],
    "entry": [
      10,
      1,
      "left-front"
    ],
    "doors": [
      {
        "at": [
          10,
          1,
          20
        ],
        "from": "left-front",
        "to": "cross-commons"
      },
      {
        "at": [
          52,
          1,
          20
        ],
        "from": "right-front",
        "to": "cross-commons"
      },
      {
        "at": [
          10,
          1,
          40
        ],
        "from": "cross-commons",
        "to": "west-back"
      },
      {
        "at": [
          31,
          1,
          40
        ],
        "from": "cross-commons",
        "to": "central-back"
      },
      {
        "at": [
          53,
          1,
          40
        ],
        "from": "cross-commons",
        "to": "east-back"
      }
    ],
    "rooms": [
      {
        "id": "left-front",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          21,
          4,
          20
        ]
      },
      {
        "id": "right-front",
        "min": [
          43,
          1,
          2
        ],
        "max": [
          63,
          4,
          20
        ]
      },
      {
        "id": "cross-commons",
        "min": [
          2,
          1,
          21
        ],
        "max": [
          63,
          4,
          40
        ]
      },
      {
        "id": "west-back",
        "min": [
          2,
          1,
          41
        ],
        "max": [
          21,
          4,
          57
        ]
      },
      {
        "id": "central-back",
        "min": [
          21,
          1,
          41
        ],
        "max": [
          44,
          4,
          57
        ]
      },
      {
        "id": "east-back",
        "min": [
          44,
          1,
          41
        ],
        "max": [
          63,
          4,
          57
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
        61,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        63,
        8,
        "east"
      ],
      [
        3,
        57,
        "south"
      ],
      [
        61,
        57,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "left-front",
        "asset": "pack5:084"
      },
      {
        "x": 57,
        "z": 5,
        "room": "right-front",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 25,
        "room": "cross-commons",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 45,
        "room": "west-back",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 31,
        "z": 45,
        "room": "central-back",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 57,
        "z": 45,
        "room": "east-back",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "left-forward-gabled-entry",
        "rect": [
          0,
          0,
          20,
          20
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "right-forward-guest-gable",
        "rect": [
          43,
          0,
          64,
          20
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "rear-crossing",
        "rect": [
          0,
          21,
          64,
          40
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-rear-sleeping",
        "rect": [
          0,
          41,
          20,
          58
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "central-chimney-rise",
        "rect": [
          21,
          41,
          43,
          58
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "east-private-room",
        "rect": [
          44,
          41,
          64,
          58
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      60
    ],
    "detail": "Independent forward-forked north garden, two disconnected front pavilions coupled behind by a broad commons and six supported roofs"
  }
]);
export const HOSPITALITY_WAVE9_IDS=Object.freeze(SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getHospitalityWave9(){return SPECS.map(compileM2ArchitecturalSpec);}
