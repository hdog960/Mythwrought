// Builder 1A M3 Wave7: 10 original U-courtyard, cross-gabled T and offset-L hospitality source designs.
// Roof masses and source rooms/portals/Pack producer dependencies physically expressed. Creator candidate-only.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "medium",
    "index": 1,
    "title": "Willowbank Bellflower Tavern",
    "w": 55,
    "d": 51,
    "plan": "willowbank-bellflower-tavern-c-independent-roof-family",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        15,
        20,
        38,
        50
      ]
    ],
    "segments": [
      [
        21,
        2,
        21,
        18
      ],
      [
        2,
        19,
        13,
        19
      ],
      [
        40,
        19,
        52,
        19
      ],
      [
        2,
        38,
        13,
        38
      ],
      [
        40,
        38,
        52,
        38
      ]
    ],
    "entry": [
      25,
      1,
      "taproom"
    ],
    "doors": [
      {
        "at": [
          21,
          1,
          6
        ],
        "from": "taproom",
        "to": "barrel-storage"
      },
      {
        "at": [
          7,
          1,
          19
        ],
        "from": "barrel-storage",
        "to": "west-brewers"
      },
      {
        "at": [
          7,
          1,
          38
        ],
        "from": "west-brewers",
        "to": "west-staff"
      },
      {
        "at": [
          47,
          1,
          19
        ],
        "from": "taproom",
        "to": "east-stage"
      },
      {
        "at": [
          47,
          1,
          38
        ],
        "from": "east-stage",
        "to": "east-private"
      }
    ],
    "rooms": [
      {
        "id": "barrel-storage",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          21,
          4,
          19
        ]
      },
      {
        "id": "taproom",
        "min": [
          22,
          1,
          2
        ],
        "max": [
          53,
          4,
          19
        ]
      },
      {
        "id": "west-brewers",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          14,
          4,
          38
        ]
      },
      {
        "id": "west-staff",
        "min": [
          2,
          1,
          39
        ],
        "max": [
          14,
          4,
          50
        ]
      },
      {
        "id": "east-stage",
        "min": [
          40,
          1,
          20
        ],
        "max": [
          53,
          4,
          38
        ]
      },
      {
        "id": "east-private",
        "min": [
          40,
          1,
          39
        ],
        "max": [
          53,
          4,
          50
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
        51,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        53,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "barrel-storage",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 5,
        "room": "taproom",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 23,
        "room": "west-brewers",
        "asset": "pack4:057"
      },
      {
        "x": 7,
        "z": 40,
        "room": "west-staff",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 47,
        "z": 23,
        "room": "east-stage",
        "asset": "pack4:059"
      },
      {
        "x": 47,
        "z": 40,
        "room": "east-private",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "west-front-pavilion",
        "rect": [
          0,
          0,
          21,
          19
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "east-front-gabled-hall",
        "rect": [
          22,
          0,
          54,
          19
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "west-inner-terrace",
        "rect": [
          0,
          20,
          14,
          38
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "west-back-chamber",
        "rect": [
          0,
          39,
          14,
          50
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "east-inner-clock",
        "rect": [
          39,
          20,
          54,
          38
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "east-rear-mezzanine",
        "rect": [
          39,
          39,
          54,
          50
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      50
    ],
    "detail": "Independently massed temperate tavern with original source roof and room footprint, physically supported cross-wings"
  },
  {
    "category": "tavern",
    "biome": "desert",
    "size": "medium",
    "index": 5,
    "title": "Amber Basin Dyehouse Retreat",
    "w": 56,
    "d": 52,
    "plan": "amber-basin-dyehouse-retreat-t-independent-roof-family",
    "roof": "steep",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        23,
        20,
        51
      ],
      [
        41,
        23,
        55,
        51
      ]
    ],
    "segments": [
      [
        22,
        2,
        22,
        21
      ],
      [
        39,
        2,
        39,
        21
      ],
      [
        22,
        22,
        39,
        22
      ],
      [
        22,
        44,
        39,
        44
      ]
    ],
    "entry": [
      30,
      1,
      "great-hearth"
    ],
    "doors": [
      {
        "at": [
          22,
          1,
          6
        ],
        "from": "great-hearth",
        "to": "west-feast"
      },
      {
        "at": [
          39,
          1,
          7
        ],
        "from": "great-hearth",
        "to": "east-kitchen"
      },
      {
        "at": [
          30,
          1,
          22
        ],
        "from": "great-hearth",
        "to": "casks"
      },
      {
        "at": [
          30,
          1,
          44
        ],
        "from": "casks",
        "to": "staff-bedroom"
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
          22,
          4,
          22
        ]
      },
      {
        "id": "great-hearth",
        "min": [
          23,
          1,
          2
        ],
        "max": [
          39,
          4,
          22
        ]
      },
      {
        "id": "east-kitchen",
        "min": [
          40,
          1,
          2
        ],
        "max": [
          54,
          4,
          22
        ]
      },
      {
        "id": "casks",
        "min": [
          22,
          1,
          23
        ],
        "max": [
          40,
          4,
          44
        ]
      },
      {
        "id": "staff-bedroom",
        "min": [
          22,
          1,
          45
        ],
        "max": [
          40,
          4,
          51
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
        "room": "west-feast",
        "asset": "pack4:058"
      },
      {
        "x": 30,
        "z": 5,
        "room": "great-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 50,
        "z": 5,
        "room": "east-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 28,
        "z": 26,
        "room": "casks",
        "asset": "pack5:084"
      },
      {
        "x": 28,
        "z": 46,
        "room": "staff-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-hipped-hall",
        "rect": [
          0,
          0,
          22,
          22
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "central-rising-belfry",
        "rect": [
          23,
          0,
          39,
          22
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "east-long-brewhouse",
        "rect": [
          40,
          0,
          55,
          22
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-crossing",
        "rect": [
          21,
          23,
          40,
          44
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "end-guest-lantern",
        "rect": [
          21,
          45,
          40,
          51
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      51
    ],
    "detail": "Independently massed desert tavern with original source roof and room footprint, physically supported cross-wings"
  },
  {
    "category": "tavern",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 3,
    "title": "Wispwillow Mushroom Watering Hole",
    "w": 58,
    "d": 53,
    "plan": "wispwillow-mushroom-watering-hole-l-independent-roof-family",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        25,
        19,
        52
      ],
      [
        0,
        9,
        5,
        23
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        23
      ],
      [
        39,
        2,
        39,
        23
      ],
      [
        21,
        24,
        55,
        24
      ],
      [
        21,
        44,
        55,
        44
      ]
    ],
    "entry": [
      21,
      1,
      "taproom"
    ],
    "doors": [
      {
        "at": [
          17,
          1,
          6
        ],
        "from": "taproom",
        "to": "kitchen"
      },
      {
        "at": [
          39,
          1,
          7
        ],
        "from": "taproom",
        "to": "stage"
      },
      {
        "at": [
          50,
          1,
          24
        ],
        "from": "stage",
        "to": "barrel-gallery"
      },
      {
        "at": [
          50,
          1,
          44
        ],
        "from": "barrel-gallery",
        "to": "staff-room"
      }
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
          17,
          4,
          24
        ]
      },
      {
        "id": "taproom",
        "min": [
          18,
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
        "id": "stage",
        "min": [
          40,
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
        "id": "barrel-gallery",
        "min": [
          21,
          1,
          25
        ],
        "max": [
          56,
          4,
          44
        ]
      },
      {
        "id": "staff-room",
        "min": [
          21,
          1,
          45
        ],
        "max": [
          56,
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
        "x": 22,
        "z": 5,
        "room": "taproom",
        "asset": "pack4:064"
      },
      {
        "x": 51,
        "z": 5,
        "room": "stage",
        "asset": "pack4:059"
      },
      {
        "x": 25,
        "z": 28,
        "room": "barrel-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 46,
        "room": "staff-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-gable",
        "rect": [
          0,
          0,
          17,
          24
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "ridged-grand-entry",
        "rect": [
          18,
          0,
          39,
          24
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "street-east-hip",
        "rect": [
          40,
          0,
          57,
          24
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "lateral-rear-wing",
        "rect": [
          20,
          25,
          57,
          44
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "rear-guest-attic",
        "rect": [
          20,
          45,
          57,
          52
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      53
    ],
    "detail": "Independently massed enchanted-forest tavern with original source roof and room footprint, physically supported cross-wings"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "large",
    "index": 2,
    "title": "Basaltbridge Grand Miners Taproom",
    "w": 70,
    "d": 64,
    "plan": "basaltbridge-grand-miners-taproom-t-independent-roof-family",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        27,
        25,
        63
      ],
      [
        49,
        27,
        69,
        63
      ]
    ],
    "segments": [
      [
        27,
        2,
        27,
        25
      ],
      [
        47,
        2,
        47,
        25
      ],
      [
        27,
        26,
        47,
        26
      ],
      [
        27,
        53,
        47,
        53
      ]
    ],
    "entry": [
      37,
      1,
      "great-hearth"
    ],
    "doors": [
      {
        "at": [
          27,
          1,
          6
        ],
        "from": "great-hearth",
        "to": "west-feast"
      },
      {
        "at": [
          47,
          1,
          7
        ],
        "from": "great-hearth",
        "to": "east-kitchen"
      },
      {
        "at": [
          37,
          1,
          26
        ],
        "from": "great-hearth",
        "to": "casks"
      },
      {
        "at": [
          37,
          1,
          53
        ],
        "from": "casks",
        "to": "staff-bedroom"
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
          27,
          4,
          26
        ]
      },
      {
        "id": "great-hearth",
        "min": [
          28,
          1,
          2
        ],
        "max": [
          47,
          4,
          26
        ]
      },
      {
        "id": "east-kitchen",
        "min": [
          48,
          1,
          2
        ],
        "max": [
          68,
          4,
          26
        ]
      },
      {
        "id": "casks",
        "min": [
          27,
          1,
          27
        ],
        "max": [
          48,
          4,
          53
        ]
      },
      {
        "id": "staff-bedroom",
        "min": [
          27,
          1,
          54
        ],
        "max": [
          48,
          4,
          63
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
        66,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        68,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-feast",
        "asset": "pack4:058"
      },
      {
        "x": 37,
        "z": 5,
        "room": "great-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 64,
        "z": 5,
        "room": "east-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 35,
        "z": 30,
        "room": "casks",
        "asset": "pack5:084"
      },
      {
        "x": 35,
        "z": 55,
        "room": "staff-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-hipped-hall",
        "rect": [
          0,
          0,
          27,
          26
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "central-rising-belfry",
        "rect": [
          28,
          0,
          47,
          26
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "east-long-brewhouse",
        "rect": [
          48,
          0,
          69,
          26
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "rear-crossing",
        "rect": [
          26,
          27,
          48,
          53
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "end-guest-lantern",
        "rect": [
          26,
          54,
          48,
          63
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      65
    ],
    "detail": "Independently massed mountain tavern with original source roof and room footprint, physically supported cross-wings"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "small",
    "index": 4,
    "title": "Stonecrop Alpine Lantern Bar",
    "w": 47,
    "d": 44,
    "plan": "stonecrop-alpine-lantern-bar-l-independent-roof-family",
    "roof": "hip",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        21,
        16,
        43
      ],
      [
        42,
        9,
        46,
        19
      ]
    ],
    "segments": [
      [
        13,
        2,
        13,
        19
      ],
      [
        32,
        2,
        32,
        19
      ],
      [
        18,
        20,
        44,
        20
      ],
      [
        18,
        36,
        44,
        36
      ]
    ],
    "entry": [
      17,
      1,
      "taproom"
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          6
        ],
        "from": "taproom",
        "to": "kitchen"
      },
      {
        "at": [
          32,
          1,
          7
        ],
        "from": "taproom",
        "to": "stage"
      },
      {
        "at": [
          39,
          1,
          20
        ],
        "from": "stage",
        "to": "barrel-gallery"
      },
      {
        "at": [
          39,
          1,
          36
        ],
        "from": "barrel-gallery",
        "to": "staff-room"
      }
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
          13,
          4,
          20
        ]
      },
      {
        "id": "taproom",
        "min": [
          14,
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
        "id": "stage",
        "min": [
          33,
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
        "id": "barrel-gallery",
        "min": [
          18,
          1,
          21
        ],
        "max": [
          45,
          4,
          36
        ]
      },
      {
        "id": "staff-room",
        "min": [
          18,
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
        "room": "kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 18,
        "z": 5,
        "room": "taproom",
        "asset": "pack4:064"
      },
      {
        "x": 40,
        "z": 5,
        "room": "stage",
        "asset": "pack4:059"
      },
      {
        "x": 22,
        "z": 24,
        "room": "barrel-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 38,
        "room": "staff-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-gable",
        "rect": [
          0,
          0,
          13,
          20
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "ridged-grand-entry",
        "rect": [
          14,
          0,
          32,
          20
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "street-east-hip",
        "rect": [
          33,
          0,
          46,
          20
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "lateral-rear-wing",
        "rect": [
          17,
          21,
          46,
          36
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "rear-guest-attic",
        "rect": [
          17,
          37,
          46,
          43
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      42
    ],
    "detail": "Independently massed mountain tavern with original source roof and room footprint, physically supported cross-wings"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "large",
    "index": 4,
    "title": "Cloverfield Longbridge Guest Court",
    "w": 69,
    "d": 63,
    "plan": "cloverfield-longbridge-guest-court-t-independent-roof-family",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        28,
        24,
        62
      ],
      [
        45,
        28,
        68,
        62
      ],
      [
        0,
        9,
        4,
        26
      ]
    ],
    "segments": [
      [
        26,
        2,
        26,
        26
      ],
      [
        43,
        2,
        43,
        26
      ],
      [
        26,
        27,
        43,
        27
      ],
      [
        26,
        50,
        43,
        50
      ]
    ],
    "entry": [
      34,
      1,
      "reception"
    ],
    "doors": [
      {
        "at": [
          26,
          1,
          6
        ],
        "from": "reception",
        "to": "west-guest"
      },
      {
        "at": [
          43,
          1,
          7
        ],
        "from": "reception",
        "to": "east-guest"
      },
      {
        "at": [
          34,
          1,
          27
        ],
        "from": "reception",
        "to": "linens"
      },
      {
        "at": [
          34,
          1,
          50
        ],
        "from": "linens",
        "to": "family-suite"
      }
    ],
    "rooms": [
      {
        "id": "west-guest",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          26,
          4,
          27
        ]
      },
      {
        "id": "reception",
        "min": [
          27,
          1,
          2
        ],
        "max": [
          43,
          4,
          27
        ]
      },
      {
        "id": "east-guest",
        "min": [
          44,
          1,
          2
        ],
        "max": [
          67,
          4,
          27
        ]
      },
      {
        "id": "linens",
        "min": [
          26,
          1,
          28
        ],
        "max": [
          44,
          4,
          50
        ]
      },
      {
        "id": "family-suite",
        "min": [
          26,
          1,
          51
        ],
        "max": [
          44,
          4,
          62
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
        7,
        "west"
      ],
      [
        67,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 34,
        "z": 5,
        "room": "reception",
        "asset": "pack4:064"
      },
      {
        "x": 62,
        "z": 5,
        "room": "east-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 32,
        "z": 31,
        "room": "linens",
        "asset": "pack5:084"
      },
      {
        "x": 32,
        "z": 52,
        "room": "family-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-hipped-hall",
        "rect": [
          0,
          0,
          26,
          27
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "central-rising-belfry",
        "rect": [
          27,
          0,
          43,
          27
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-long-brewhouse",
        "rect": [
          44,
          0,
          68,
          27
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "rear-crossing",
        "rect": [
          25,
          28,
          44,
          50
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "end-guest-lantern",
        "rect": [
          25,
          51,
          44,
          62
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      64
    ],
    "detail": "Independently massed temperate inn with original source roof and room footprint, physically supported cross-wings"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "medium",
    "index": 5,
    "title": "Sunspire Jewel Arch Inn",
    "w": 59,
    "d": 54,
    "plan": "sunspire-jewel-arch-inn-l-independent-roof-family",
    "roof": "hip",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        41,
        24,
        58,
        53
      ],
      [
        0,
        9,
        5,
        22
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
        39,
        2,
        39,
        22
      ],
      [
        2,
        23,
        39,
        23
      ],
      [
        2,
        44,
        39,
        44
      ]
    ],
    "entry": [
      22,
      1,
      "reception"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "reception",
        "to": "west-guest"
      },
      {
        "at": [
          39,
          1,
          7
        ],
        "from": "reception",
        "to": "east-guest"
      },
      {
        "at": [
          8,
          1,
          23
        ],
        "from": "west-guest",
        "to": "linen-gallery"
      },
      {
        "at": [
          8,
          1,
          44
        ],
        "from": "linen-gallery",
        "to": "family-suite"
      }
    ],
    "rooms": [
      {
        "id": "west-guest",
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
        "id": "reception",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          39,
          4,
          23
        ]
      },
      {
        "id": "east-guest",
        "min": [
          40,
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
        "id": "linen-gallery",
        "min": [
          2,
          1,
          24
        ],
        "max": [
          40,
          4,
          44
        ]
      },
      {
        "id": "family-suite",
        "min": [
          2,
          1,
          45
        ],
        "max": [
          40,
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
        "room": "west-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "reception",
        "asset": "pack4:064"
      },
      {
        "x": 52,
        "z": 5,
        "room": "east-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 27,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 46,
        "room": "family-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-gable",
        "rect": [
          0,
          0,
          18,
          23
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "ridged-grand-entry",
        "rect": [
          19,
          0,
          39,
          23
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "street-east-hip",
        "rect": [
          40,
          0,
          58,
          23
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "lateral-rear-wing",
        "rect": [
          0,
          24,
          40,
          44
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "rear-guest-attic",
        "rect": [
          0,
          45,
          40,
          53
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      54
    ],
    "detail": "Independently massed desert inn with original source roof and room footprint, physically supported cross-wings"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "medium",
    "index": 4,
    "title": "Aurorawick Sled Lantern Lodge",
    "w": 60,
    "d": 55,
    "plan": "aurorawick-sled-lantern-lodge-l-independent-roof-family",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        25,
        18,
        54
      ],
      [
        0,
        9,
        5,
        23
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        23
      ],
      [
        42,
        2,
        42,
        23
      ],
      [
        20,
        24,
        57,
        24
      ],
      [
        20,
        48,
        57,
        48
      ]
    ],
    "entry": [
      22,
      1,
      "reception"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "reception",
        "to": "west-guest"
      },
      {
        "at": [
          42,
          1,
          7
        ],
        "from": "reception",
        "to": "east-guest"
      },
      {
        "at": [
          52,
          1,
          24
        ],
        "from": "east-guest",
        "to": "linen-gallery"
      },
      {
        "at": [
          52,
          1,
          48
        ],
        "from": "linen-gallery",
        "to": "family-suite"
      }
    ],
    "rooms": [
      {
        "id": "west-guest",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          18,
          4,
          24
        ]
      },
      {
        "id": "reception",
        "min": [
          19,
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
        "id": "east-guest",
        "min": [
          43,
          1,
          2
        ],
        "max": [
          58,
          4,
          24
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          20,
          1,
          25
        ],
        "max": [
          58,
          4,
          48
        ]
      },
      {
        "id": "family-suite",
        "min": [
          20,
          1,
          49
        ],
        "max": [
          58,
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
        "room": "west-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "reception",
        "asset": "pack4:064"
      },
      {
        "x": 53,
        "z": 5,
        "room": "east-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 28,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 50,
        "room": "family-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-gable",
        "rect": [
          0,
          0,
          18,
          24
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "ridged-grand-entry",
        "rect": [
          19,
          0,
          42,
          24
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "street-east-hip",
        "rect": [
          43,
          0,
          59,
          24
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "lateral-rear-wing",
        "rect": [
          19,
          25,
          59,
          48
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "rear-guest-attic",
        "rect": [
          19,
          49,
          59,
          54
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      55
    ],
    "detail": "Independently massed snow inn with original source roof and room footprint, physically supported cross-wings"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 4,
    "title": "Silverfern Starwatch Inn",
    "w": 70,
    "d": 64,
    "plan": "silverfern-starwatch-inn-l-independent-roof-family",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        29,
        24,
        63
      ],
      [
        0,
        9,
        6,
        27
      ]
    ],
    "segments": [
      [
        23,
        2,
        23,
        27
      ],
      [
        47,
        2,
        47,
        27
      ],
      [
        26,
        28,
        67,
        28
      ],
      [
        26,
        53,
        67,
        53
      ]
    ],
    "entry": [
      27,
      1,
      "reception"
    ],
    "doors": [
      {
        "at": [
          23,
          1,
          6
        ],
        "from": "reception",
        "to": "west-guest"
      },
      {
        "at": [
          47,
          1,
          7
        ],
        "from": "reception",
        "to": "east-guest"
      },
      {
        "at": [
          62,
          1,
          28
        ],
        "from": "east-guest",
        "to": "linen-gallery"
      },
      {
        "at": [
          62,
          1,
          53
        ],
        "from": "linen-gallery",
        "to": "family-suite"
      }
    ],
    "rooms": [
      {
        "id": "west-guest",
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
        "id": "reception",
        "min": [
          24,
          1,
          2
        ],
        "max": [
          47,
          4,
          28
        ]
      },
      {
        "id": "east-guest",
        "min": [
          48,
          1,
          2
        ],
        "max": [
          68,
          4,
          28
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          26,
          1,
          29
        ],
        "max": [
          68,
          4,
          53
        ]
      },
      {
        "id": "family-suite",
        "min": [
          26,
          1,
          54
        ],
        "max": [
          68,
          4,
          63
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
        66,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        68,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 5,
        "room": "reception",
        "asset": "pack4:064"
      },
      {
        "x": 63,
        "z": 5,
        "room": "east-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 30,
        "z": 32,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 30,
        "z": 55,
        "room": "family-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-gable",
        "rect": [
          0,
          0,
          23,
          28
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "ridged-grand-entry",
        "rect": [
          24,
          0,
          47,
          28
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "street-east-hip",
        "rect": [
          48,
          0,
          69,
          28
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "lateral-rear-wing",
        "rect": [
          25,
          29,
          69,
          53
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "rear-guest-attic",
        "rect": [
          25,
          54,
          69,
          63
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      65
    ],
    "detail": "Independently massed enchanted-forest inn with original source roof and room footprint, physically supported cross-wings"
  },
  {
    "category": "inn",
    "biome": "mountain",
    "size": "small",
    "index": 5,
    "title": "Granitebirch Wayfarer Refuge",
    "w": 49,
    "d": 45,
    "plan": "granitebirch-wayfarer-refuge-l-independent-roof-family",
    "roof": "hip",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        34,
        20,
        48,
        44
      ],
      [
        44,
        9,
        48,
        18
      ]
    ],
    "segments": [
      [
        16,
        2,
        16,
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
        2,
        36,
        32,
        36
      ]
    ],
    "entry": [
      20,
      1,
      "reception"
    ],
    "doors": [
      {
        "at": [
          16,
          1,
          6
        ],
        "from": "reception",
        "to": "west-guest"
      },
      {
        "at": [
          31,
          1,
          7
        ],
        "from": "reception",
        "to": "east-guest"
      },
      {
        "at": [
          8,
          1,
          19
        ],
        "from": "west-guest",
        "to": "linen-gallery"
      },
      {
        "at": [
          8,
          1,
          36
        ],
        "from": "linen-gallery",
        "to": "family-suite"
      }
    ],
    "rooms": [
      {
        "id": "west-guest",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          16,
          4,
          19
        ]
      },
      {
        "id": "reception",
        "min": [
          17,
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
        "id": "east-guest",
        "min": [
          32,
          1,
          2
        ],
        "max": [
          47,
          4,
          19
        ]
      },
      {
        "id": "linen-gallery",
        "min": [
          2,
          1,
          20
        ],
        "max": [
          33,
          4,
          36
        ]
      },
      {
        "id": "family-suite",
        "min": [
          2,
          1,
          37
        ],
        "max": [
          33,
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
        "room": "west-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 5,
        "room": "reception",
        "asset": "pack4:064"
      },
      {
        "x": 42,
        "z": 5,
        "room": "east-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 23,
        "room": "linen-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 38,
        "room": "family-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "street-west-gable",
        "rect": [
          0,
          0,
          16,
          19
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "ridged-grand-entry",
        "rect": [
          17,
          0,
          31,
          19
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "street-east-hip",
        "rect": [
          32,
          0,
          48,
          19
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "lateral-rear-wing",
        "rect": [
          0,
          20,
          33,
          36
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "rear-guest-attic",
        "rect": [
          0,
          37,
          33,
          44
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      44
    ],
    "detail": "Independently massed mountain inn with original source roof and room footprint, physically supported cross-wings"
  }
]);
export const HOSPITALITY_WAVE7_IDS=Object.freeze(SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getHospitalityWave7(){return SPECS.map(compileM2ArchitecturalSpec);}
