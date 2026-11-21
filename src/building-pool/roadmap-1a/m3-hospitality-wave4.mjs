// Builder 1A M3 Wave4: 10 individually fixed-source original regional tavern/inn structures.
// Literal coordinate authored rooms/doors, physical notched foundations, wall cells, differentiated supported roof wings, Pack 1–5 fixtures.
// No gameplay placement, runtime, saves, deployment or approval.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "small",
    "index": 4,
    "title": "Cedarwick Cider Lantern Tavern",
    "w": 40,
    "d": 38,
    "plan": "cedarwick-cider-lantern-tavern-le-original-multicourt-room-arrangement",
    "roof": "sawtooth",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        29,
        18,
        39,
        37
      ],
      [
        0,
        33,
        8,
        37
      ]
    ],
    "segments": [
      [
        11,
        2,
        11,
        16
      ],
      [
        30,
        2,
        30,
        16
      ],
      [
        2,
        17,
        27,
        17
      ],
      [
        2,
        28,
        27,
        28
      ]
    ],
    "entry": [
      15,
      1,
      "public-taproom"
    ],
    "rooms": [
      {
        "id": "brewhouse-kitchen",
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
        "id": "public-taproom",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          30,
          4,
          17
        ]
      },
      {
        "id": "stage-and-music",
        "min": [
          31,
          1,
          2
        ],
        "max": [
          38,
          4,
          17
        ]
      },
      {
        "id": "barrel-service-bay",
        "min": [
          2,
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
        "id": "staff-rest-room",
        "min": [
          2,
          1,
          29
        ],
        "max": [
          28,
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
        "from": "public-taproom",
        "to": "brewhouse-kitchen"
      },
      {
        "at": [
          30,
          1,
          7
        ],
        "from": "public-taproom",
        "to": "stage-and-music"
      },
      {
        "at": [
          8,
          1,
          17
        ],
        "from": "brewhouse-kitchen",
        "to": "barrel-service-bay"
      },
      {
        "at": [
          8,
          1,
          28
        ],
        "from": "barrel-service-bay",
        "to": "staff-rest-room"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        36,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        38,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "brewhouse-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 16,
        "z": 5,
        "room": "public-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 33,
        "z": 5,
        "room": "stage-and-music",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 21,
        "room": "barrel-service-bay",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 30,
        "room": "staff-rest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "grand-street-facing-crown",
        "rect": [
          0,
          0,
          39,
          17
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "rear-extended-guest-gallery",
        "rect": [
          0,
          18,
          28,
          37
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      35
    ],
    "detail": "Independent temperate tavern source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  },
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "large",
    "index": 5,
    "title": "Hearthwick Westgate Festival Hall",
    "w": 62,
    "d": 57,
    "plan": "hearthwick-westgate-festival-hall-t-original-multicourt-room-arrangement",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        28,
        21,
        56
      ],
      [
        44,
        28,
        61,
        56
      ],
      [
        0,
        8,
        9,
        26
      ]
    ],
    "segments": [
      [
        23,
        2,
        23,
        26
      ],
      [
        42,
        2,
        42,
        26
      ],
      [
        23,
        27,
        42,
        27
      ],
      [
        23,
        49,
        42,
        49
      ]
    ],
    "entry": [
      32,
      1,
      "ale-and-cider-gallery"
    ],
    "rooms": [
      {
        "id": "western-revel-hall",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          23,
          4,
          27
        ]
      },
      {
        "id": "ale-and-cider-gallery",
        "min": [
          24,
          1,
          2
        ],
        "max": [
          42,
          4,
          27
        ]
      },
      {
        "id": "kitchen-and-pantry",
        "min": [
          43,
          1,
          2
        ],
        "max": [
          60,
          4,
          27
        ]
      },
      {
        "id": "barrel-cellar-aisle",
        "min": [
          23,
          1,
          28
        ],
        "max": [
          43,
          4,
          49
        ]
      },
      {
        "id": "staff-night-room",
        "min": [
          23,
          1,
          50
        ],
        "max": [
          43,
          4,
          56
        ]
      }
    ],
    "doors": [
      {
        "at": [
          23,
          1,
          6
        ],
        "from": "ale-and-cider-gallery",
        "to": "western-revel-hall"
      },
      {
        "at": [
          42,
          1,
          7
        ],
        "from": "ale-and-cider-gallery",
        "to": "kitchen-and-pantry"
      },
      {
        "at": [
          32,
          1,
          27
        ],
        "from": "ale-and-cider-gallery",
        "to": "barrel-cellar-aisle"
      },
      {
        "at": [
          32,
          1,
          49
        ],
        "from": "barrel-cellar-aisle",
        "to": "staff-night-room"
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
        "room": "western-revel-hall",
        "asset": "pack4:058"
      },
      {
        "x": 32,
        "z": 5,
        "room": "ale-and-cider-gallery",
        "asset": "pack4:064"
      },
      {
        "x": 56,
        "z": 5,
        "room": "kitchen-and-pantry",
        "asset": "pack4:057"
      },
      {
        "x": 30,
        "z": 31,
        "room": "barrel-cellar-aisle",
        "asset": "pack5:084"
      },
      {
        "x": 30,
        "z": 51,
        "room": "staff-night-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-west-hipped-hall",
        "rect": [
          0,
          0,
          23,
          27
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "front-east-gable",
        "rect": [
          24,
          0,
          61,
          27
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "tall-rear-timber-spine",
        "rect": [
          22,
          28,
          43,
          56
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      57
    ],
    "detail": "Independent temperate tavern source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  },
  {
    "category": "tavern",
    "biome": "snow",
    "size": "small",
    "index": 3,
    "title": "Frostknoll Sledsong Tavern",
    "w": 41,
    "d": 38,
    "plan": "frostknoll-sledsong-tavern-t-original-multicourt-room-arrangement",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        21,
        14,
        37
      ],
      [
        27,
        21,
        40,
        37
      ],
      [
        32,
        9,
        40,
        19
      ]
    ],
    "segments": [
      [
        16,
        2,
        16,
        19
      ],
      [
        25,
        2,
        25,
        19
      ],
      [
        16,
        20,
        25,
        20
      ],
      [
        16,
        31,
        25,
        31
      ]
    ],
    "entry": [
      20,
      1,
      "ale-and-cider-gallery"
    ],
    "rooms": [
      {
        "id": "western-revel-hall",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          16,
          4,
          20
        ]
      },
      {
        "id": "ale-and-cider-gallery",
        "min": [
          17,
          1,
          2
        ],
        "max": [
          25,
          4,
          20
        ]
      },
      {
        "id": "kitchen-and-pantry",
        "min": [
          26,
          1,
          2
        ],
        "max": [
          39,
          4,
          20
        ]
      },
      {
        "id": "barrel-cellar-aisle",
        "min": [
          16,
          1,
          21
        ],
        "max": [
          26,
          4,
          31
        ]
      },
      {
        "id": "staff-night-room",
        "min": [
          16,
          1,
          32
        ],
        "max": [
          26,
          4,
          37
        ]
      }
    ],
    "doors": [
      {
        "at": [
          16,
          1,
          6
        ],
        "from": "ale-and-cider-gallery",
        "to": "western-revel-hall"
      },
      {
        "at": [
          25,
          1,
          7
        ],
        "from": "ale-and-cider-gallery",
        "to": "kitchen-and-pantry"
      },
      {
        "at": [
          20,
          1,
          20
        ],
        "from": "ale-and-cider-gallery",
        "to": "barrel-cellar-aisle"
      },
      {
        "at": [
          20,
          1,
          31
        ],
        "from": "barrel-cellar-aisle",
        "to": "staff-night-room"
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
        7,
        "west"
      ],
      [
        39,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "western-revel-hall",
        "asset": "pack4:058"
      },
      {
        "x": 20,
        "z": 5,
        "room": "ale-and-cider-gallery",
        "asset": "pack4:064"
      },
      {
        "x": 35,
        "z": 5,
        "room": "kitchen-and-pantry",
        "asset": "pack4:057"
      },
      {
        "x": 18,
        "z": 24,
        "room": "barrel-cellar-aisle",
        "asset": "pack5:084"
      },
      {
        "x": 18,
        "z": 33,
        "room": "staff-night-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-west-hipped-hall",
        "rect": [
          0,
          0,
          16,
          20
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "front-east-gable",
        "rect": [
          17,
          0,
          40,
          20
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "tall-rear-timber-spine",
        "rect": [
          15,
          21,
          26,
          37
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      4,
      36
    ],
    "detail": "Independent snow tavern source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  },
  {
    "category": "tavern",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 4,
    "title": "Dewfire Willowglow Brew Den",
    "w": 42,
    "d": 39,
    "plan": "dewfire-willowglow-brew-den-u-original-multicourt-room-arrangement",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        12,
        18,
        29,
        38
      ],
      [
        37,
        11,
        41,
        16
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        16
      ],
      [
        2,
        17,
        10,
        17
      ],
      [
        31,
        17,
        39,
        17
      ],
      [
        2,
        29,
        10,
        29
      ],
      [
        31,
        30,
        39,
        30
      ]
    ],
    "entry": [
      21,
      1,
      "great-central-taproom"
    ],
    "rooms": [
      {
        "id": "cellar-and-cask-storage",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          17
        ]
      },
      {
        "id": "great-central-taproom",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          40,
          4,
          17
        ]
      },
      {
        "id": "west-brewing-hall",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          11,
          4,
          29
        ]
      },
      {
        "id": "west-staff-bunk",
        "min": [
          2,
          1,
          30
        ],
        "max": [
          11,
          4,
          38
        ]
      },
      {
        "id": "east-entertainment",
        "min": [
          31,
          1,
          18
        ],
        "max": [
          40,
          4,
          30
        ]
      },
      {
        "id": "east-private-club",
        "min": [
          31,
          1,
          31
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
          17,
          1,
          6
        ],
        "from": "great-central-taproom",
        "to": "cellar-and-cask-storage"
      },
      {
        "at": [
          7,
          1,
          17
        ],
        "from": "cellar-and-cask-storage",
        "to": "west-brewing-hall"
      },
      {
        "at": [
          7,
          1,
          29
        ],
        "from": "west-brewing-hall",
        "to": "west-staff-bunk"
      },
      {
        "at": [
          34,
          1,
          17
        ],
        "from": "great-central-taproom",
        "to": "east-entertainment"
      },
      {
        "at": [
          34,
          1,
          30
        ],
        "from": "east-entertainment",
        "to": "east-private-club"
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
        "x": 7,
        "z": 5,
        "room": "cellar-and-cask-storage",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 5,
        "room": "great-central-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 21,
        "room": "west-brewing-hall",
        "asset": "pack4:057"
      },
      {
        "x": 7,
        "z": 31,
        "room": "west-staff-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 34,
        "z": 21,
        "room": "east-entertainment",
        "asset": "pack4:059"
      },
      {
        "x": 34,
        "z": 32,
        "room": "east-private-club",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "front-cross-feast-hall",
        "rect": [
          0,
          0,
          41,
          17
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "western-courtyard-return",
        "rect": [
          0,
          18,
          11,
          38
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "eastern-guest-return",
        "rect": [
          30,
          18,
          41,
          38
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      37
    ],
    "detail": "Independent enchanted-forest tavern source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "small",
    "index": 3,
    "title": "Dapplewood Four Bridges Guesthouse",
    "w": 42,
    "d": 39,
    "plan": "dapplewood-four-bridges-guesthouse-lw-original-multicourt-room-arrangement",
    "roof": "hip",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        18,
        17,
        38
      ],
      [
        32,
        33,
        41,
        38
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
        31,
        2,
        31,
        16
      ],
      [
        19,
        17,
        39,
        17
      ],
      [
        19,
        30,
        39,
        30
      ]
    ],
    "entry": [
      14,
      1,
      "public-check-in-lounge"
    ],
    "rooms": [
      {
        "id": "west-guest-room",
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
        "id": "public-check-in-lounge",
        "min": [
          11,
          1,
          2
        ],
        "max": [
          31,
          4,
          17
        ]
      },
      {
        "id": "east-guest-room",
        "min": [
          32,
          1,
          2
        ],
        "max": [
          40,
          4,
          17
        ]
      },
      {
        "id": "linens-and-bath",
        "min": [
          19,
          1,
          18
        ],
        "max": [
          40,
          4,
          30
        ]
      },
      {
        "id": "rear-traveler-bedroom",
        "min": [
          19,
          1,
          31
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
          10,
          1,
          6
        ],
        "from": "public-check-in-lounge",
        "to": "west-guest-room"
      },
      {
        "at": [
          31,
          1,
          7
        ],
        "from": "public-check-in-lounge",
        "to": "east-guest-room"
      },
      {
        "at": [
          34,
          1,
          17
        ],
        "from": "east-guest-room",
        "to": "linens-and-bath"
      },
      {
        "at": [
          34,
          1,
          30
        ],
        "from": "linens-and-bath",
        "to": "rear-traveler-bedroom"
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
        "x": 7,
        "z": 5,
        "room": "west-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 15,
        "z": 5,
        "room": "public-check-in-lounge",
        "asset": "pack4:064"
      },
      {
        "x": 35,
        "z": 5,
        "room": "east-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 21,
        "room": "linens-and-bath",
        "asset": "pack5:084"
      },
      {
        "x": 23,
        "z": 32,
        "room": "rear-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "grand-street-facing-crown",
        "rect": [
          0,
          0,
          41,
          17
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "rear-extended-guest-gallery",
        "rect": [
          18,
          18,
          41,
          38
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      4,
      37
    ],
    "detail": "Independent temperate inn source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "large",
    "index": 3,
    "title": "Whiteoak Harvest Crown Inn",
    "w": 64,
    "d": 59,
    "plan": "whiteoak-harvest-crown-inn-u-original-multicourt-room-arrangement",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        25,
        26,
        46,
        58
      ],
      [
        58,
        9,
        63,
        24
      ]
    ],
    "segments": [
      [
        19,
        2,
        19,
        24
      ],
      [
        2,
        25,
        23,
        25
      ],
      [
        48,
        25,
        61,
        25
      ],
      [
        2,
        47,
        23,
        47
      ],
      [
        48,
        48,
        61,
        48
      ]
    ],
    "entry": [
      23,
      1,
      "traveler-fire-common"
    ],
    "rooms": [
      {
        "id": "welcome-and-key-desk",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          19,
          4,
          25
        ]
      },
      {
        "id": "traveler-fire-common",
        "min": [
          20,
          1,
          2
        ],
        "max": [
          62,
          4,
          25
        ]
      },
      {
        "id": "west-court-suite",
        "min": [
          2,
          1,
          26
        ],
        "max": [
          24,
          4,
          47
        ]
      },
      {
        "id": "west-back-bedroom",
        "min": [
          2,
          1,
          48
        ],
        "max": [
          24,
          4,
          58
        ]
      },
      {
        "id": "east-court-suite",
        "min": [
          48,
          1,
          26
        ],
        "max": [
          62,
          4,
          48
        ]
      },
      {
        "id": "east-back-bedroom",
        "min": [
          48,
          1,
          49
        ],
        "max": [
          62,
          4,
          58
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
        "from": "traveler-fire-common",
        "to": "welcome-and-key-desk"
      },
      {
        "at": [
          7,
          1,
          25
        ],
        "from": "welcome-and-key-desk",
        "to": "west-court-suite"
      },
      {
        "at": [
          7,
          1,
          47
        ],
        "from": "west-court-suite",
        "to": "west-back-bedroom"
      },
      {
        "at": [
          56,
          1,
          25
        ],
        "from": "traveler-fire-common",
        "to": "east-court-suite"
      },
      {
        "at": [
          56,
          1,
          48
        ],
        "from": "east-court-suite",
        "to": "east-back-bedroom"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        60,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        62,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "welcome-and-key-desk",
        "asset": "pack4:064"
      },
      {
        "x": 23,
        "z": 5,
        "room": "traveler-fire-common",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 29,
        "room": "west-court-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 7,
        "z": 49,
        "room": "west-back-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 56,
        "z": 29,
        "room": "east-court-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 56,
        "z": 50,
        "room": "east-back-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-cross-feast-hall",
        "rect": [
          0,
          0,
          63,
          25
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "western-courtyard-return",
        "rect": [
          0,
          26,
          24,
          58
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "eastern-guest-return",
        "rect": [
          47,
          26,
          63,
          58
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      59
    ],
    "detail": "Independent temperate inn source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  },
  {
    "category": "inn",
    "biome": "desert",
    "size": "large",
    "index": 3,
    "title": "Cinnabar Starlight Crossing Inn",
    "w": 64,
    "d": 59,
    "plan": "cinnabar-starlight-crossing-inn-t-original-multicourt-room-arrangement",
    "roof": "steep",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        29,
        22,
        58
      ],
      [
        46,
        29,
        63,
        58
      ],
      [
        54,
        9,
        63,
        27
      ]
    ],
    "segments": [
      [
        24,
        2,
        24,
        27
      ],
      [
        44,
        2,
        44,
        27
      ],
      [
        24,
        28,
        44,
        28
      ],
      [
        24,
        50,
        44,
        50
      ]
    ],
    "entry": [
      34,
      1,
      "traveler-hearth-lobby"
    ],
    "rooms": [
      {
        "id": "west-guest-bedroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          24,
          4,
          28
        ]
      },
      {
        "id": "traveler-hearth-lobby",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          44,
          4,
          28
        ]
      },
      {
        "id": "east-guest-bedroom",
        "min": [
          45,
          1,
          2
        ],
        "max": [
          62,
          4,
          28
        ]
      },
      {
        "id": "laundry-and-linen",
        "min": [
          24,
          1,
          29
        ],
        "max": [
          45,
          4,
          50
        ]
      },
      {
        "id": "rear-family-suite",
        "min": [
          24,
          1,
          51
        ],
        "max": [
          45,
          4,
          58
        ]
      }
    ],
    "doors": [
      {
        "at": [
          24,
          1,
          6
        ],
        "from": "traveler-hearth-lobby",
        "to": "west-guest-bedroom"
      },
      {
        "at": [
          44,
          1,
          7
        ],
        "from": "traveler-hearth-lobby",
        "to": "east-guest-bedroom"
      },
      {
        "at": [
          34,
          1,
          28
        ],
        "from": "traveler-hearth-lobby",
        "to": "laundry-and-linen"
      },
      {
        "at": [
          34,
          1,
          50
        ],
        "from": "laundry-and-linen",
        "to": "rear-family-suite"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        60,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        62,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-guest-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 34,
        "z": 5,
        "room": "traveler-hearth-lobby",
        "asset": "pack4:064"
      },
      {
        "x": 57,
        "z": 5,
        "room": "east-guest-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 32,
        "z": 32,
        "room": "laundry-and-linen",
        "asset": "pack5:084"
      },
      {
        "x": 32,
        "z": 52,
        "room": "rear-family-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-west-hipped-hall",
        "rect": [
          0,
          0,
          24,
          28
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "front-east-gable",
        "rect": [
          25,
          0,
          63,
          28
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "tall-rear-timber-spine",
        "rect": [
          23,
          29,
          45,
          58
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      4,
      59
    ],
    "detail": "Independent desert inn source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "small",
    "index": 4,
    "title": "Snowcrest Hearthpine Waystation",
    "w": 42,
    "d": 39,
    "plan": "snowcrest-hearthpine-waystation-u-original-multicourt-room-arrangement",
    "roof": "courtyard",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        12,
        19,
        29,
        38
      ],
      [
        0,
        8,
        4,
        17
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        17
      ],
      [
        2,
        18,
        10,
        18
      ],
      [
        31,
        18,
        39,
        18
      ],
      [
        2,
        30,
        10,
        30
      ],
      [
        31,
        31,
        39,
        31
      ]
    ],
    "entry": [
      21,
      1,
      "traveler-fire-common"
    ],
    "rooms": [
      {
        "id": "welcome-and-key-desk",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          18
        ]
      },
      {
        "id": "traveler-fire-common",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          40,
          4,
          18
        ]
      },
      {
        "id": "west-court-suite",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          11,
          4,
          30
        ]
      },
      {
        "id": "west-back-bedroom",
        "min": [
          2,
          1,
          31
        ],
        "max": [
          11,
          4,
          38
        ]
      },
      {
        "id": "east-court-suite",
        "min": [
          31,
          1,
          19
        ],
        "max": [
          40,
          4,
          31
        ]
      },
      {
        "id": "east-back-bedroom",
        "min": [
          31,
          1,
          32
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
          17,
          1,
          6
        ],
        "from": "traveler-fire-common",
        "to": "welcome-and-key-desk"
      },
      {
        "at": [
          7,
          1,
          18
        ],
        "from": "welcome-and-key-desk",
        "to": "west-court-suite"
      },
      {
        "at": [
          7,
          1,
          30
        ],
        "from": "west-court-suite",
        "to": "west-back-bedroom"
      },
      {
        "at": [
          34,
          1,
          18
        ],
        "from": "traveler-fire-common",
        "to": "east-court-suite"
      },
      {
        "at": [
          34,
          1,
          31
        ],
        "from": "east-court-suite",
        "to": "east-back-bedroom"
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
        "x": 7,
        "z": 5,
        "room": "welcome-and-key-desk",
        "asset": "pack4:064"
      },
      {
        "x": 21,
        "z": 5,
        "room": "traveler-fire-common",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 22,
        "room": "west-court-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 7,
        "z": 32,
        "room": "west-back-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 34,
        "z": 22,
        "room": "east-court-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 34,
        "z": 33,
        "room": "east-back-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "front-cross-feast-hall",
        "rect": [
          0,
          0,
          41,
          18
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "western-courtyard-return",
        "rect": [
          0,
          19,
          11,
          38
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "eastern-guest-return",
        "rect": [
          30,
          19,
          41,
          38
        ],
        "style": "step-front",
        "raise": 0
      }
    ],
    "posts": [
      4,
      37
    ],
    "detail": "Independent snow inn source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  },
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 2,
    "title": "Glowroot Foxfire Guesthouse",
    "w": 43,
    "d": 40,
    "plan": "glowroot-foxfire-guesthouse-lw-original-multicourt-room-arrangement",
    "roof": "hip",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        18,
        13,
        39
      ],
      [
        33,
        35,
        42,
        39
      ]
    ],
    "segments": [
      [
        15,
        2,
        15,
        16
      ],
      [
        29,
        2,
        29,
        16
      ],
      [
        15,
        17,
        40,
        17
      ],
      [
        15,
        32,
        40,
        32
      ]
    ],
    "entry": [
      19,
      1,
      "public-check-in-lounge"
    ],
    "rooms": [
      {
        "id": "west-guest-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          15,
          4,
          17
        ]
      },
      {
        "id": "public-check-in-lounge",
        "min": [
          16,
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
        "id": "east-guest-room",
        "min": [
          30,
          1,
          2
        ],
        "max": [
          41,
          4,
          17
        ]
      },
      {
        "id": "linens-and-bath",
        "min": [
          15,
          1,
          18
        ],
        "max": [
          41,
          4,
          32
        ]
      },
      {
        "id": "rear-traveler-bedroom",
        "min": [
          15,
          1,
          33
        ],
        "max": [
          41,
          4,
          39
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
        "from": "public-check-in-lounge",
        "to": "west-guest-room"
      },
      {
        "at": [
          29,
          1,
          7
        ],
        "from": "public-check-in-lounge",
        "to": "east-guest-room"
      },
      {
        "at": [
          35,
          1,
          17
        ],
        "from": "east-guest-room",
        "to": "linens-and-bath"
      },
      {
        "at": [
          35,
          1,
          32
        ],
        "from": "linens-and-bath",
        "to": "rear-traveler-bedroom"
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
        "x": 7,
        "z": 5,
        "room": "west-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 20,
        "z": 5,
        "room": "public-check-in-lounge",
        "asset": "pack4:064"
      },
      {
        "x": 36,
        "z": 5,
        "room": "east-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 21,
        "room": "linens-and-bath",
        "asset": "pack5:084"
      },
      {
        "x": 19,
        "z": 34,
        "room": "rear-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "grand-street-facing-crown",
        "rect": [
          0,
          0,
          42,
          17
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "rear-extended-guest-gallery",
        "rect": [
          14,
          18,
          42,
          39
        ],
        "style": "long-gable",
        "raise": 0
      }
    ],
    "posts": [
      4,
      38
    ],
    "detail": "Independent enchanted-forest inn source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  },
  {
    "category": "inn",
    "biome": "mountain",
    "size": "small",
    "index": 3,
    "title": "Cobblestep Cloudvale Wayhouse",
    "w": 43,
    "d": 40,
    "plan": "cobblestep-cloudvale-wayhouse-le-original-multicourt-room-arrangement",
    "roof": "sawtooth",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        32,
        19,
        42,
        39
      ],
      [
        0,
        32,
        4,
        39
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        17
      ],
      [
        29,
        2,
        29,
        17
      ],
      [
        2,
        18,
        30,
        18
      ],
      [
        2,
        30,
        30,
        30
      ]
    ],
    "entry": [
      18,
      1,
      "public-check-in-lounge"
    ],
    "rooms": [
      {
        "id": "west-guest-room",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          14,
          4,
          18
        ]
      },
      {
        "id": "public-check-in-lounge",
        "min": [
          15,
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
        "id": "east-guest-room",
        "min": [
          30,
          1,
          2
        ],
        "max": [
          41,
          4,
          18
        ]
      },
      {
        "id": "linens-and-bath",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          31,
          4,
          30
        ]
      },
      {
        "id": "rear-traveler-bedroom",
        "min": [
          2,
          1,
          31
        ],
        "max": [
          31,
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
          6
        ],
        "from": "public-check-in-lounge",
        "to": "west-guest-room"
      },
      {
        "at": [
          29,
          1,
          7
        ],
        "from": "public-check-in-lounge",
        "to": "east-guest-room"
      },
      {
        "at": [
          8,
          1,
          18
        ],
        "from": "west-guest-room",
        "to": "linens-and-bath"
      },
      {
        "at": [
          8,
          1,
          30
        ],
        "from": "linens-and-bath",
        "to": "rear-traveler-bedroom"
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
        "x": 7,
        "z": 5,
        "room": "west-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 5,
        "room": "public-check-in-lounge",
        "asset": "pack4:064"
      },
      {
        "x": 36,
        "z": 5,
        "room": "east-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 22,
        "room": "linens-and-bath",
        "asset": "pack5:084"
      },
      {
        "x": 8,
        "z": 32,
        "room": "rear-traveler-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "grand-street-facing-crown",
        "rect": [
          0,
          0,
          42,
          18
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "rear-extended-guest-gallery",
        "rect": [
          0,
          19,
          31,
          39
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      4,
      38
    ],
    "detail": "Independent mountain inn source walls, physical recesses, service circulation, rooms, roof bearing and producer AABB footprints"
  }
]);
export const HOSPITALITY_WAVE4_IDS=Object.freeze(SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getHospitalityWave4(){return SPECS.map(compileM2ArchitecturalSpec);}
