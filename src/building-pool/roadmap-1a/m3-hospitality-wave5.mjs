// Builder 1A M3 hospitality Wave5: 8 completely original literal 3D tavern/inn coordinate programs.
// Separate source-defined structural walls, open-air concave notches, accessible room networks, supported roofs and Pack1-5 producer fixtures.
// Candidate only: no runtime integration, saved-state modifications, world placement or production approval.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
const SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "small",
    "index": 5,
    "title": "Thornwell Ember Orchard Ale Room",
    "w": 43,
    "d": 39,
    "plan": "thornwell-ember-orchard-ale-room-u-original-architectural-plan",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        12,
        18,
        30,
        38
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
        2,
        17,
        10,
        17
      ],
      [
        32,
        17,
        40,
        17
      ],
      [
        2,
        30,
        10,
        30
      ],
      [
        32,
        31,
        40,
        31
      ]
    ],
    "entry": [
      22,
      1,
      "great-feast-taproom"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "great-feast-taproom",
        "to": "keg-store"
      },
      {
        "at": [
          7,
          1,
          17
        ],
        "from": "keg-store",
        "to": "west-brewers-kitchen"
      },
      {
        "at": [
          7,
          1,
          30
        ],
        "from": "west-brewers-kitchen",
        "to": "west-private-bunk"
      },
      {
        "at": [
          35,
          1,
          17
        ],
        "from": "great-feast-taproom",
        "to": "east-lantern-stage"
      },
      {
        "at": [
          35,
          1,
          31
        ],
        "from": "east-lantern-stage",
        "to": "east-quiet-seating"
      }
    ],
    "rooms": [
      {
        "id": "keg-store",
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
        "id": "great-feast-taproom",
        "min": [
          19,
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
        "id": "west-brewers-kitchen",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          11,
          4,
          30
        ]
      },
      {
        "id": "west-private-bunk",
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
        "id": "east-lantern-stage",
        "min": [
          32,
          1,
          18
        ],
        "max": [
          41,
          4,
          31
        ]
      },
      {
        "id": "east-quiet-seating",
        "min": [
          32,
          1,
          32
        ],
        "max": [
          41,
          4,
          38
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
        "room": "keg-store",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 5,
        "room": "great-feast-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 21,
        "room": "west-brewers-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 7,
        "z": 32,
        "room": "west-private-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 35,
        "z": 21,
        "room": "east-lantern-stage",
        "asset": "pack4:059"
      },
      {
        "x": 35,
        "z": 33,
        "room": "east-quiet-seating",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "street-front-public-gable",
        "rect": [
          0,
          0,
          42,
          17
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "west-courtyard-terrace",
        "rect": [
          0,
          18,
          11,
          38
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-courtyard-high-gable",
        "rect": [
          31,
          18,
          42,
          38
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      4,
      38
    ],
    "detail": "Wave5 independently detailed original temperate tavern guest and serving floorplan with actual supporting geometry"
  },
  {
    "category": "tavern",
    "biome": "temperate",
    "size": "medium",
    "index": 5,
    "title": "Willowford Three Bridges Tavern",
    "w": 54,
    "d": 48,
    "plan": "willowford-three-bridges-tavern-t-original-architectural-plan",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        25,
        18,
        47
      ],
      [
        36,
        25,
        53,
        47
      ],
      [
        0,
        11,
        4,
        23
      ]
    ],
    "segments": [
      [
        20,
        2,
        20,
        23
      ],
      [
        34,
        2,
        34,
        23
      ],
      [
        20,
        24,
        34,
        24
      ],
      [
        20,
        40,
        34,
        40
      ]
    ],
    "entry": [
      27,
      1,
      "public-hearth-bar"
    ],
    "doors": [
      {
        "at": [
          20,
          1,
          6
        ],
        "from": "public-hearth-bar",
        "to": "west-mead-hall"
      },
      {
        "at": [
          34,
          1,
          7
        ],
        "from": "public-hearth-bar",
        "to": "east-cookhouse"
      },
      {
        "at": [
          27,
          1,
          24
        ],
        "from": "public-hearth-bar",
        "to": "dry-barrel-passage"
      },
      {
        "at": [
          27,
          1,
          40
        ],
        "from": "dry-barrel-passage",
        "to": "staff-night-cabin"
      }
    ],
    "rooms": [
      {
        "id": "west-mead-hall",
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
        "id": "public-hearth-bar",
        "min": [
          21,
          1,
          2
        ],
        "max": [
          34,
          4,
          24
        ]
      },
      {
        "id": "east-cookhouse",
        "min": [
          35,
          1,
          2
        ],
        "max": [
          52,
          4,
          24
        ]
      },
      {
        "id": "dry-barrel-passage",
        "min": [
          20,
          1,
          25
        ],
        "max": [
          35,
          4,
          40
        ]
      },
      {
        "id": "staff-night-cabin",
        "min": [
          20,
          1,
          41
        ],
        "max": [
          35,
          4,
          47
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
        50,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        52,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-mead-hall",
        "asset": "pack4:058"
      },
      {
        "x": 27,
        "z": 5,
        "room": "public-hearth-bar",
        "asset": "pack4:064"
      },
      {
        "x": 48,
        "z": 5,
        "room": "east-cookhouse",
        "asset": "pack4:057"
      },
      {
        "x": 25,
        "z": 28,
        "room": "dry-barrel-passage",
        "asset": "pack5:084"
      },
      {
        "x": 25,
        "z": 42,
        "room": "staff-night-cabin",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-mezzanine-mass",
        "rect": [
          0,
          0,
          20,
          24
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-cross-gable",
        "rect": [
          21,
          0,
          53,
          24
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "long-stem-timber-rafters",
        "rect": [
          19,
          25,
          35,
          47
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      49
    ],
    "detail": "Wave5 independently detailed original temperate tavern guest and serving floorplan with actual supporting geometry"
  },
  {
    "category": "tavern",
    "biome": "enchanted-forest",
    "size": "small",
    "index": 5,
    "title": "Glowmoth Singing Fern Pub",
    "w": 45,
    "d": 41,
    "plan": "glowmoth-singing-fern-pub-t-original-architectural-plan",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        21,
        14,
        40
      ],
      [
        29,
        21,
        44,
        40
      ],
      [
        35,
        9,
        44,
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
        27,
        2,
        27,
        19
      ],
      [
        16,
        20,
        27,
        20
      ],
      [
        16,
        34,
        27,
        34
      ]
    ],
    "entry": [
      21,
      1,
      "public-hearth-bar"
    ],
    "doors": [
      {
        "at": [
          16,
          1,
          6
        ],
        "from": "public-hearth-bar",
        "to": "west-mead-hall"
      },
      {
        "at": [
          27,
          1,
          7
        ],
        "from": "public-hearth-bar",
        "to": "east-cookhouse"
      },
      {
        "at": [
          21,
          1,
          20
        ],
        "from": "public-hearth-bar",
        "to": "dry-barrel-passage"
      },
      {
        "at": [
          21,
          1,
          34
        ],
        "from": "dry-barrel-passage",
        "to": "staff-night-cabin"
      }
    ],
    "rooms": [
      {
        "id": "west-mead-hall",
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
        "id": "public-hearth-bar",
        "min": [
          17,
          1,
          2
        ],
        "max": [
          27,
          4,
          20
        ]
      },
      {
        "id": "east-cookhouse",
        "min": [
          28,
          1,
          2
        ],
        "max": [
          43,
          4,
          20
        ]
      },
      {
        "id": "dry-barrel-passage",
        "min": [
          16,
          1,
          21
        ],
        "max": [
          28,
          4,
          34
        ]
      },
      {
        "id": "staff-night-cabin",
        "min": [
          16,
          1,
          35
        ],
        "max": [
          28,
          4,
          40
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
        "room": "west-mead-hall",
        "asset": "pack4:058"
      },
      {
        "x": 21,
        "z": 5,
        "room": "public-hearth-bar",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "east-cookhouse",
        "asset": "pack4:057"
      },
      {
        "x": 19,
        "z": 24,
        "room": "dry-barrel-passage",
        "asset": "pack5:084"
      },
      {
        "x": 19,
        "z": 36,
        "room": "staff-night-cabin",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-mezzanine-mass",
        "rect": [
          0,
          0,
          16,
          20
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-cross-gable",
        "rect": [
          17,
          0,
          44,
          20
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "long-stem-timber-rafters",
        "rect": [
          15,
          21,
          28,
          40
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      4,
      40
    ],
    "detail": "Wave5 independently detailed original enchanted-forest tavern guest and serving floorplan with actual supporting geometry"
  },
  {
    "category": "tavern",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 5,
    "title": "Starshade Nightbloom Dance Tavern",
    "w": 66,
    "d": 58,
    "plan": "starshade-nightbloom-dance-tavern-t-original-architectural-plan",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        29,
        24,
        57
      ],
      [
        43,
        29,
        65,
        57
      ]
    ],
    "segments": [
      [
        26,
        2,
        26,
        27
      ],
      [
        41,
        2,
        41,
        27
      ],
      [
        26,
        28,
        41,
        28
      ],
      [
        26,
        48,
        41,
        48
      ]
    ],
    "entry": [
      33,
      1,
      "public-hearth-bar"
    ],
    "doors": [
      {
        "at": [
          26,
          1,
          6
        ],
        "from": "public-hearth-bar",
        "to": "west-mead-hall"
      },
      {
        "at": [
          41,
          1,
          7
        ],
        "from": "public-hearth-bar",
        "to": "east-cookhouse"
      },
      {
        "at": [
          33,
          1,
          28
        ],
        "from": "public-hearth-bar",
        "to": "dry-barrel-passage"
      },
      {
        "at": [
          33,
          1,
          48
        ],
        "from": "dry-barrel-passage",
        "to": "staff-night-cabin"
      }
    ],
    "rooms": [
      {
        "id": "west-mead-hall",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          26,
          4,
          28
        ]
      },
      {
        "id": "public-hearth-bar",
        "min": [
          27,
          1,
          2
        ],
        "max": [
          41,
          4,
          28
        ]
      },
      {
        "id": "east-cookhouse",
        "min": [
          42,
          1,
          2
        ],
        "max": [
          64,
          4,
          28
        ]
      },
      {
        "id": "dry-barrel-passage",
        "min": [
          26,
          1,
          29
        ],
        "max": [
          42,
          4,
          48
        ]
      },
      {
        "id": "staff-night-cabin",
        "min": [
          26,
          1,
          49
        ],
        "max": [
          42,
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
        62,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        64,
        8,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 7,
        "z": 5,
        "room": "west-mead-hall",
        "asset": "pack4:058"
      },
      {
        "x": 33,
        "z": 5,
        "room": "public-hearth-bar",
        "asset": "pack4:064"
      },
      {
        "x": 60,
        "z": 5,
        "room": "east-cookhouse",
        "asset": "pack4:057"
      },
      {
        "x": 31,
        "z": 32,
        "room": "dry-barrel-passage",
        "asset": "pack5:084"
      },
      {
        "x": 31,
        "z": 50,
        "room": "staff-night-cabin",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-mezzanine-mass",
        "rect": [
          0,
          0,
          26,
          28
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-cross-gable",
        "rect": [
          27,
          0,
          65,
          28
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "long-stem-timber-rafters",
        "rect": [
          25,
          29,
          42,
          57
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      4,
      61
    ],
    "detail": "Wave5 independently detailed original enchanted-forest tavern guest and serving floorplan with actual supporting geometry"
  },
  {
    "category": "tavern",
    "biome": "mountain",
    "size": "small",
    "index": 2,
    "title": "Cairnstep Dragon Copper Pub",
    "w": 46,
    "d": 42,
    "plan": "cairnstep-dragon-copper-pub-u-original-architectural-plan",
    "roof": "courtyard",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        12,
        21,
        33,
        41
      ],
      [
        0,
        8,
        4,
        19
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
        2,
        20,
        10,
        20
      ],
      [
        35,
        20,
        43,
        20
      ],
      [
        2,
        32,
        10,
        32
      ],
      [
        35,
        33,
        43,
        33
      ]
    ],
    "entry": [
      21,
      1,
      "great-feast-taproom"
    ],
    "doors": [
      {
        "at": [
          17,
          1,
          6
        ],
        "from": "great-feast-taproom",
        "to": "keg-store"
      },
      {
        "at": [
          7,
          1,
          20
        ],
        "from": "keg-store",
        "to": "west-brewers-kitchen"
      },
      {
        "at": [
          7,
          1,
          32
        ],
        "from": "west-brewers-kitchen",
        "to": "west-private-bunk"
      },
      {
        "at": [
          38,
          1,
          20
        ],
        "from": "great-feast-taproom",
        "to": "east-lantern-stage"
      },
      {
        "at": [
          38,
          1,
          33
        ],
        "from": "east-lantern-stage",
        "to": "east-quiet-seating"
      }
    ],
    "rooms": [
      {
        "id": "keg-store",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          17,
          4,
          20
        ]
      },
      {
        "id": "great-feast-taproom",
        "min": [
          18,
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
        "id": "west-brewers-kitchen",
        "min": [
          2,
          1,
          21
        ],
        "max": [
          11,
          4,
          32
        ]
      },
      {
        "id": "west-private-bunk",
        "min": [
          2,
          1,
          33
        ],
        "max": [
          11,
          4,
          41
        ]
      },
      {
        "id": "east-lantern-stage",
        "min": [
          35,
          1,
          21
        ],
        "max": [
          44,
          4,
          33
        ]
      },
      {
        "id": "east-quiet-seating",
        "min": [
          35,
          1,
          34
        ],
        "max": [
          44,
          4,
          41
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
        "room": "keg-store",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 5,
        "room": "great-feast-taproom",
        "asset": "pack4:064"
      },
      {
        "x": 7,
        "z": 24,
        "room": "west-brewers-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 7,
        "z": 34,
        "room": "west-private-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 38,
        "z": 24,
        "room": "east-lantern-stage",
        "asset": "pack4:059"
      },
      {
        "x": 38,
        "z": 35,
        "room": "east-quiet-seating",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "street-front-public-gable",
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
        "name": "west-courtyard-terrace",
        "rect": [
          0,
          21,
          11,
          41
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "east-courtyard-high-gable",
        "rect": [
          34,
          21,
          45,
          41
        ],
        "style": "edge-rise",
        "raise": 2
      }
    ],
    "posts": [
      4,
      41
    ],
    "detail": "Wave5 independently detailed original mountain tavern guest and serving floorplan with actual supporting geometry"
  },
  {
    "category": "inn",
    "biome": "temperate",
    "size": "small",
    "index": 4,
    "title": "Dapplebrook Silver Birch Inn",
    "w": 45,
    "d": 42,
    "plan": "dapplebrook-silver-birch-inn-t-original-architectural-plan",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        21,
        12,
        41
      ],
      [
        30,
        21,
        44,
        41
      ],
      [
        35,
        9,
        44,
        19
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
        28,
        2,
        28,
        19
      ],
      [
        14,
        20,
        28,
        20
      ],
      [
        14,
        36,
        28,
        36
      ]
    ],
    "entry": [
      21,
      1,
      "guest-lobby"
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          6
        ],
        "from": "guest-lobby",
        "to": "west-lodging"
      },
      {
        "at": [
          28,
          1,
          7
        ],
        "from": "guest-lobby",
        "to": "east-lodging"
      },
      {
        "at": [
          21,
          1,
          20
        ],
        "from": "guest-lobby",
        "to": "stairless-linen-store"
      },
      {
        "at": [
          21,
          1,
          36
        ],
        "from": "stairless-linen-store",
        "to": "rear-sleeping-suite"
      }
    ],
    "rooms": [
      {
        "id": "west-lodging",
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
        "id": "guest-lobby",
        "min": [
          15,
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
        "id": "east-lodging",
        "min": [
          29,
          1,
          2
        ],
        "max": [
          43,
          4,
          20
        ]
      },
      {
        "id": "stairless-linen-store",
        "min": [
          14,
          1,
          21
        ],
        "max": [
          29,
          4,
          36
        ]
      },
      {
        "id": "rear-sleeping-suite",
        "min": [
          14,
          1,
          37
        ],
        "max": [
          29,
          4,
          41
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
        "room": "west-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 5,
        "room": "guest-lobby",
        "asset": "pack4:064"
      },
      {
        "x": 38,
        "z": 5,
        "room": "east-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 24,
        "room": "stairless-linen-store",
        "asset": "pack5:084"
      },
      {
        "x": 19,
        "z": 38,
        "room": "rear-sleeping-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-mezzanine-mass",
        "rect": [
          0,
          0,
          14,
          20
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-cross-gable",
        "rect": [
          15,
          0,
          44,
          20
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "long-stem-timber-rafters",
        "rect": [
          13,
          21,
          29,
          41
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      40
    ],
    "detail": "Wave5 independently detailed original temperate inn guest and serving floorplan with actual supporting geometry"
  },
  {
    "category": "inn",
    "biome": "snow",
    "size": "small",
    "index": 5,
    "title": "Frostfall Sleigh Lantern Inn",
    "w": 46,
    "d": 42,
    "plan": "frostfall-sleigh-lantern-inn-t-original-architectural-plan",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        22,
        16,
        41
      ],
      [
        30,
        22,
        45,
        41
      ],
      [
        0,
        12,
        7,
        20
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
        28,
        2,
        28,
        20
      ],
      [
        18,
        21,
        28,
        21
      ],
      [
        18,
        34,
        28,
        34
      ]
    ],
    "entry": [
      23,
      1,
      "guest-lobby"
    ],
    "doors": [
      {
        "at": [
          18,
          1,
          6
        ],
        "from": "guest-lobby",
        "to": "west-lodging"
      },
      {
        "at": [
          28,
          1,
          7
        ],
        "from": "guest-lobby",
        "to": "east-lodging"
      },
      {
        "at": [
          23,
          1,
          21
        ],
        "from": "guest-lobby",
        "to": "stairless-linen-store"
      },
      {
        "at": [
          23,
          1,
          34
        ],
        "from": "stairless-linen-store",
        "to": "rear-sleeping-suite"
      }
    ],
    "rooms": [
      {
        "id": "west-lodging",
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
        "id": "guest-lobby",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          28,
          4,
          21
        ]
      },
      {
        "id": "east-lodging",
        "min": [
          29,
          1,
          2
        ],
        "max": [
          44,
          4,
          21
        ]
      },
      {
        "id": "stairless-linen-store",
        "min": [
          18,
          1,
          22
        ],
        "max": [
          29,
          4,
          34
        ]
      },
      {
        "id": "rear-sleeping-suite",
        "min": [
          18,
          1,
          35
        ],
        "max": [
          29,
          4,
          41
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
        "room": "west-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "guest-lobby",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "east-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 25,
        "room": "stairless-linen-store",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 36,
        "room": "rear-sleeping-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-mezzanine-mass",
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
        "name": "east-cross-gable",
        "rect": [
          19,
          0,
          45,
          21
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "long-stem-timber-rafters",
        "rect": [
          17,
          22,
          29,
          41
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "posts": [
      4,
      41
    ],
    "detail": "Wave5 independently detailed original snow inn guest and serving floorplan with actual supporting geometry"
  },
  {
    "category": "inn",
    "biome": "mountain",
    "size": "small",
    "index": 4,
    "title": "Ridgewood Echoes Traveler House",
    "w": 46,
    "d": 43,
    "plan": "ridgewood-echoes-traveler-house-t-original-architectural-plan",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        21,
        12,
        42
      ],
      [
        34,
        21,
        45,
        42
      ],
      [
        41,
        13,
        45,
        19
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
        32,
        2,
        32,
        19
      ],
      [
        14,
        20,
        32,
        20
      ],
      [
        14,
        33,
        32,
        33
      ]
    ],
    "entry": [
      23,
      1,
      "guest-lobby"
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          6
        ],
        "from": "guest-lobby",
        "to": "west-lodging"
      },
      {
        "at": [
          32,
          1,
          7
        ],
        "from": "guest-lobby",
        "to": "east-lodging"
      },
      {
        "at": [
          23,
          1,
          20
        ],
        "from": "guest-lobby",
        "to": "stairless-linen-store"
      },
      {
        "at": [
          23,
          1,
          33
        ],
        "from": "stairless-linen-store",
        "to": "rear-sleeping-suite"
      }
    ],
    "rooms": [
      {
        "id": "west-lodging",
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
        "id": "guest-lobby",
        "min": [
          15,
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
        "id": "east-lodging",
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
        "id": "stairless-linen-store",
        "min": [
          14,
          1,
          21
        ],
        "max": [
          33,
          4,
          33
        ]
      },
      {
        "id": "rear-sleeping-suite",
        "min": [
          14,
          1,
          34
        ],
        "max": [
          33,
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
        "room": "west-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 5,
        "room": "guest-lobby",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 5,
        "room": "east-lodging",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 24,
        "room": "stairless-linen-store",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 35,
        "room": "rear-sleeping-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-mezzanine-mass",
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
        "name": "east-cross-gable",
        "rect": [
          15,
          0,
          45,
          20
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "long-stem-timber-rafters",
        "rect": [
          13,
          21,
          33,
          42
        ],
        "style": "long-gable",
        "raise": 1
      }
    ],
    "posts": [
      4,
      41
    ],
    "detail": "Wave5 independently detailed original mountain inn guest and serving floorplan with actual supporting geometry"
  }
]);
export const HOSPITALITY_WAVE5_IDS=Object.freeze(SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getHospitalityWave5(){return SPECS.map(compileM2ArchitecturalSpec);}
