// Builder B Roadmap B 1A Wave8 original enchanted-forest hospitality. Source-only, zero runtime registration.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const BUILDER_B_HOSPITALITY_WAVE8_SPECS=Object.freeze([
  {
    "category": "inn",
    "biome": "enchanted-forest",
    "size": "medium",
    "index": 5,
    "title": "Moonweave Lanternbridge Canopy Inn",
    "w": 58,
    "d": 53,
    "plan": "nine-room two-branch canopy travelers inn with an offset reception lantern bridge, sheltered herb-tea west gallery, tall east observatory, genuinely split guest cloisters and staggered roof ridges",
    "roof": "butterfly",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        0,
        13,
        15
      ],
      [
        44,
        0,
        57,
        9
      ],
      [
        0,
        37,
        10,
        52
      ]
    ],
    "segments": [
      [
        25,
        2,
        25,
        16
      ],
      [
        14,
        17,
        56,
        17
      ],
      [
        39,
        10,
        39,
        38
      ],
      [
        17,
        34,
        56,
        34
      ],
      [
        34,
        18,
        34,
        51
      ],
      [
        21,
        35,
        21,
        51
      ],
      [
        15,
        28,
        34,
        28
      ],
      [
        44,
        35,
        44,
        51
      ]
    ],
    "entry": [
      31,
      1,
      "north-lantern-arrival"
    ],
    "rooms": [
      {
        "id": "north-lantern-arrival",
        "min": [
          26,
          1,
          2
        ],
        "max": [
          39,
          4,
          17
        ]
      },
      {
        "id": "west-herb-tea-parlour",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          25,
          4,
          17
        ]
      },
      {
        "id": "east-forest-observatory",
        "min": [
          40,
          1,
          10
        ],
        "max": [
          56,
          4,
          17
        ]
      },
      {
        "id": "west-stonebridge-kitchen",
        "min": [
          15,
          1,
          18
        ],
        "max": [
          34,
          4,
          28
        ]
      },
      {
        "id": "mid-canopy-glass-lantern-gallery",
        "min": [
          17,
          1,
          29
        ],
        "max": [
          34,
          4,
          34
        ]
      },
      {
        "id": "east-supper-and-lantern-hall",
        "min": [
          40,
          1,
          18
        ],
        "max": [
          56,
          4,
          34
        ]
      },
      {
        "id": "south-west-moss-guest-room",
        "min": [
          11,
          1,
          35
        ],
        "max": [
          21,
          4,
          51
        ]
      },
      {
        "id": "south-middle-bellflower-guest-room",
        "min": [
          22,
          1,
          35
        ],
        "max": [
          34,
          4,
          51
        ]
      },
      {
        "id": "south-east-starwell-guest-room",
        "min": [
          45,
          1,
          35
        ],
        "max": [
          56,
          4,
          51
        ]
      }
    ],
    "doors": [
      {
        "at": [
          25,
          1,
          9
        ],
        "from": "north-lantern-arrival",
        "to": "west-herb-tea-parlour"
      },
      {
        "at": [
          30,
          1,
          17
        ],
        "from": "north-lantern-arrival",
        "to": "west-stonebridge-kitchen"
      },
      {
        "at": [
          39,
          1,
          13
        ],
        "from": "north-lantern-arrival",
        "to": "east-forest-observatory"
      },
      {
        "at": [
          44,
          1,
          17
        ],
        "from": "east-forest-observatory",
        "to": "east-supper-and-lantern-hall"
      },
      {
        "at": [
          34,
          1,
          22
        ],
        "from": "west-stonebridge-kitchen",
        "to": "east-supper-and-lantern-hall"
      },
      {
        "at": [
          27,
          1,
          28
        ],
        "from": "west-stonebridge-kitchen",
        "to": "mid-canopy-glass-lantern-gallery"
      },
      {
        "at": [
          39,
          1,
          29
        ],
        "from": "mid-canopy-glass-lantern-gallery",
        "to": "east-supper-and-lantern-hall"
      },
      {
        "at": [
          18,
          1,
          34
        ],
        "from": "mid-canopy-glass-lantern-gallery",
        "to": "south-west-moss-guest-room"
      },
      {
        "at": [
          29,
          1,
          34
        ],
        "from": "mid-canopy-glass-lantern-gallery",
        "to": "south-middle-bellflower-guest-room"
      },
      {
        "at": [
          49,
          1,
          34
        ],
        "from": "east-supper-and-lantern-hall",
        "to": "south-east-starwell-guest-room"
      },
      {
        "at": [
          21,
          1,
          42
        ],
        "from": "south-west-moss-guest-room",
        "to": "south-middle-bellflower-guest-room"
      },
      {
        "at": [
          44,
          1,
          45
        ],
        "from": "south-middle-bellflower-guest-room",
        "to": "south-east-starwell-guest-room"
      }
    ],
    "windows": [
      [
        18,
        1,
        "north"
      ],
      [
        30,
        1,
        "north"
      ],
      [
        14,
        12,
        "west"
      ],
      [
        56,
        14,
        "east"
      ],
      [
        1,
        24,
        "west"
      ],
      [
        56,
        27,
        "east"
      ],
      [
        15,
        51,
        "south"
      ],
      [
        30,
        51,
        "south"
      ],
      [
        49,
        51,
        "south"
      ],
      [
        56,
        44,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 31,
        "z": 7,
        "room": "north-lantern-arrival",
        "asset": "pack4:059"
      },
      {
        "x": 19,
        "z": 8,
        "room": "west-herb-tea-parlour",
        "asset": "pack4:064"
      },
      {
        "x": 47,
        "z": 13,
        "room": "east-forest-observatory",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 23,
        "room": "west-stonebridge-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 27,
        "z": 31,
        "room": "mid-canopy-glass-lantern-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 48,
        "z": 27,
        "room": "east-supper-and-lantern-hall",
        "asset": "pack4:058"
      },
      {
        "x": 16,
        "z": 41,
        "room": "south-west-moss-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 28,
        "z": 41,
        "room": "south-middle-bellflower-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 49,
        "z": 42,
        "room": "south-east-starwell-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "lantern-bridge-high-gable",
        "rect": [
          14,
          0,
          40,
          16
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-moss-tea-swept-eaves",
        "rect": [
          13,
          11,
          34,
          28
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-canopy-starglass-monitor",
        "rect": [
          39,
          10,
          57,
          33
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "center-mushroom-court-leaf-canopy",
        "rect": [
          17,
          28,
          39,
          36
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-bellflower-guest-deep-hollow",
        "rect": [
          11,
          34,
          34,
          52
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "south-east-starwell-long-eave",
        "rect": [
          35,
          34,
          57,
          52
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      17,
      35
    ],
    "detail": "Distinct enchanted forest inn with nine connected travel/guest rooms, triple reserved two-cell Pack5 beds, a long projecting tea-house, east observatory monitor, three physical absence notches and six genuinely pitched roof islands; no NPCs, save writes or settlement integration"
  }
]);
export const BUILDER_B_HOSPITALITY_WAVE8_IDS=Object.freeze(BUILDER_B_HOSPITALITY_WAVE8_SPECS.map(s=>
 ['r1',s.category,s.biome,s.size,String(s.index).padStart(3,'0')].join(':')));
export function getBuilderBHospitalityWave8(){return BUILDER_B_HOSPITALITY_WAVE8_SPECS.map(compileM2ArchitecturalSpec);}
