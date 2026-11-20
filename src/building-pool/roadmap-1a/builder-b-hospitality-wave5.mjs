// Builder B source-only Roadmap B Wave5: original eight-room temperate inn with true courtyards, never a palette clone.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const BUILDER_B_HOSPITALITY_WAVE5_SPECS=Object.freeze([
  {
    "category": "inn",
    "biome": "temperate",
    "size": "medium",
    "index": 3,
    "title": "Foxglade Courtyard Travelers' Hearth Inn",
    "w": 53,
    "d": 49,
    "plan": "off-axis timber courtyard inn, broad public ale parlour, generous reception, separate pantry, upper guest corridors and south lodging suites",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        0,
        14,
        13
      ],
      [
        38,
        0,
        52,
        12
      ],
      [
        0,
        36,
        15,
        48
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
        38,
        13,
        38,
        37
      ],
      [
        16,
        21,
        51,
        21
      ],
      [
        35,
        22,
        35,
        37
      ],
      [
        16,
        37,
        51,
        37
      ],
      [
        15,
        15,
        38,
        15
      ]
    ],
    "entry": [
      30,
      1,
      "reception-and-guest-arrival"
    ],
    "rooms": [
      {
        "id": "reception-and-guest-arrival",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          38,
          4,
          21
        ]
      },
      {
        "id": "west-ale-parlour",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          24,
          4,
          15
        ]
      },
      {
        "id": "west-private-guest-room",
        "min": [
          16,
          1,
          16
        ],
        "max": [
          24,
          4,
          21
        ]
      },
      {
        "id": "east-kitchen-and-supplies",
        "min": [
          39,
          1,
          13
        ],
        "max": [
          51,
          4,
          21
        ]
      },
      {
        "id": "center-common-hearth-hall",
        "min": [
          16,
          1,
          22
        ],
        "max": [
          35,
          4,
          37
        ]
      },
      {
        "id": "east-guest-reading-gallery",
        "min": [
          36,
          1,
          22
        ],
        "max": [
          51,
          4,
          37
        ]
      },
      {
        "id": "south-west-guest-suite",
        "min": [
          16,
          1,
          38
        ],
        "max": [
          35,
          4,
          47
        ]
      },
      {
        "id": "south-east-guest-suite",
        "min": [
          36,
          1,
          38
        ],
        "max": [
          51,
          4,
          47
        ]
      }
    ],
    "doors": [
      {
        "at": [
          24,
          1,
          8
        ],
        "from": "reception-and-guest-arrival",
        "to": "west-ale-parlour"
      },
      {
        "at": [
          20,
          1,
          15
        ],
        "from": "west-ale-parlour",
        "to": "west-private-guest-room"
      },
      {
        "at": [
          30,
          1,
          21
        ],
        "from": "reception-and-guest-arrival",
        "to": "center-common-hearth-hall"
      },
      {
        "at": [
          38,
          1,
          18
        ],
        "from": "reception-and-guest-arrival",
        "to": "east-kitchen-and-supplies"
      },
      {
        "at": [
          20,
          1,
          21
        ],
        "from": "west-private-guest-room",
        "to": "center-common-hearth-hall"
      },
      {
        "at": [
          35,
          1,
          29
        ],
        "from": "center-common-hearth-hall",
        "to": "east-guest-reading-gallery"
      },
      {
        "at": [
          45,
          1,
          21
        ],
        "from": "east-kitchen-and-supplies",
        "to": "east-guest-reading-gallery"
      },
      {
        "at": [
          23,
          1,
          37
        ],
        "from": "center-common-hearth-hall",
        "to": "south-west-guest-suite"
      },
      {
        "at": [
          43,
          1,
          37
        ],
        "from": "east-guest-reading-gallery",
        "to": "south-east-guest-suite"
      },
      {
        "at": [
          35,
          1,
          43
        ],
        "from": "south-west-guest-suite",
        "to": "south-east-guest-suite"
      }
    ],
    "windows": [
      [
        20,
        1,
        "north"
      ],
      [
        31,
        1,
        "north"
      ],
      [
        16,
        10,
        "west"
      ],
      [
        51,
        17,
        "east"
      ],
      [
        1,
        26,
        "west"
      ],
      [
        51,
        28,
        "east"
      ],
      [
        20,
        47,
        "south"
      ],
      [
        42,
        47,
        "south"
      ],
      [
        51,
        43,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 29,
        "z": 8,
        "room": "reception-and-guest-arrival",
        "asset": "pack4:059"
      },
      {
        "x": 18,
        "z": 8,
        "room": "west-ale-parlour",
        "asset": "pack4:064"
      },
      {
        "x": 20,
        "z": 18,
        "room": "west-private-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 45,
        "z": 18,
        "room": "east-kitchen-and-supplies",
        "asset": "pack4:057"
      },
      {
        "x": 26,
        "z": 28,
        "room": "center-common-hearth-hall",
        "asset": "pack4:059"
      },
      {
        "x": 43,
        "z": 29,
        "room": "east-guest-reading-gallery",
        "asset": "pack5:084"
      },
      {
        "x": 24,
        "z": 42,
        "room": "south-west-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 43,
        "z": 41,
        "room": "south-east-guest-suite",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "north-guest-arrival-long-ridge",
        "rect": [
          15,
          0,
          37,
          14
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "west-low-parlour-lean",
        "rect": [
          0,
          14,
          24,
          22
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "east-high-kitchen-monitor",
        "rect": [
          38,
          13,
          52,
          32
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "common-hearth-split-roof",
        "rect": [
          16,
          22,
          35,
          36
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "east-quiet-reading-ridge",
        "rect": [
          36,
          23,
          52,
          37
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "rear-guest-suite-cloister",
        "rect": [
          16,
          38,
          52,
          48
        ],
        "style": "double-hill",
        "raise": 1
      }
    ],
    "posts": [
      18,
      30
    ],
    "detail": "Eight connected source-authored hospitality rooms, dedicated guest paths, service kitchen, weatherproof asymmetrical rooflines, three true terrain-empty gardens and three two-cell Pack5 bed reservations"
  }
]);
export const BUILDER_B_HOSPITALITY_WAVE5_IDS=Object.freeze(BUILDER_B_HOSPITALITY_WAVE5_SPECS.map(s=>
 ['r1',s.category,s.biome,s.size,String(s.index).padStart(3,'0')].join(':')));
export function getBuilderBHospitalityWave5(){return BUILDER_B_HOSPITALITY_WAVE5_SPECS.map(compileM2ArchitecturalSpec);}
