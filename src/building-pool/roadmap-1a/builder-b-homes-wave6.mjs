// Builder B Roadmap B downstream Wave6 original temperate village cottage. Source-only and unregistered.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const BUILDER_B_HOMES_WAVE6_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "temperate",
    "size": "small",
    "index": 20,
    "title": "Willowmere Four-Notch Orchard Cottage",
    "w": 35,
    "d": 33,
    "plan": "open west orchard court, sheltered asymmetric front entry, tool workshop, social hearth, east cooking bay, two private rear rooms, and true detached roof massing",
    "roof": "mixed",
    "skin": "live:wood",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        0,
        7,
        12
      ],
      [
        27,
        0,
        34,
        8
      ],
      [
        0,
        24,
        8,
        32
      ],
      [
        26,
        26,
        34,
        32
      ]
    ],
    "segments": [
      [
        18,
        2,
        18,
        14
      ],
      [
        8,
        14,
        26,
        14
      ],
      [
        18,
        15,
        18,
        22
      ],
      [
        9,
        23,
        25,
        23
      ],
      [
        18,
        24,
        18,
        31
      ],
      [
        12,
        8,
        25,
        8
      ]
    ],
    "entry": [
      22,
      1,
      "east-arrival-foyer"
    ],
    "rooms": [
      {
        "id": "west-orchard-workroom",
        "min": [
          9,
          1,
          2
        ],
        "max": [
          18,
          4,
          14
        ]
      },
      {
        "id": "east-arrival-foyer",
        "min": [
          19,
          1,
          2
        ],
        "max": [
          26,
          4,
          14
        ]
      },
      {
        "id": "west-hearth-family-room",
        "min": [
          1,
          1,
          15
        ],
        "max": [
          18,
          4,
          22
        ]
      },
      {
        "id": "east-kitchen-and-pantry",
        "min": [
          19,
          1,
          15
        ],
        "max": [
          33,
          4,
          22
        ]
      },
      {
        "id": "south-sleeping-chamber",
        "min": [
          9,
          1,
          24
        ],
        "max": [
          18,
          4,
          31
        ]
      },
      {
        "id": "south-map-reading-room",
        "min": [
          19,
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
          18,
          1,
          7
        ],
        "from": "east-arrival-foyer",
        "to": "west-orchard-workroom"
      },
      {
        "at": [
          23,
          1,
          14
        ],
        "from": "east-arrival-foyer",
        "to": "east-kitchen-and-pantry"
      },
      {
        "at": [
          13,
          1,
          14
        ],
        "from": "west-orchard-workroom",
        "to": "west-hearth-family-room"
      },
      {
        "at": [
          18,
          1,
          18
        ],
        "from": "west-hearth-family-room",
        "to": "east-kitchen-and-pantry"
      },
      {
        "at": [
          14,
          1,
          23
        ],
        "from": "west-hearth-family-room",
        "to": "south-sleeping-chamber"
      },
      {
        "at": [
          22,
          1,
          23
        ],
        "from": "east-kitchen-and-pantry",
        "to": "south-map-reading-room"
      },
      {
        "at": [
          18,
          1,
          27
        ],
        "from": "south-sleeping-chamber",
        "to": "south-map-reading-room"
      }
    ],
    "windows": [
      [
        10,
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
        18,
        "west"
      ],
      [
        34,
        18,
        "east"
      ],
      [
        13,
        32,
        "south"
      ],
      [
        22,
        32,
        "south"
      ],
      [
        34,
        21,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 12,
        "z": 7,
        "room": "west-orchard-workroom",
        "asset": "pack4:058"
      },
      {
        "x": 23,
        "z": 5,
        "room": "east-arrival-foyer",
        "asset": "pack4:059"
      },
      {
        "x": 13,
        "z": 19,
        "room": "west-hearth-family-room",
        "asset": "pack4:064"
      },
      {
        "x": 28,
        "z": 19,
        "room": "east-kitchen-and-pantry",
        "asset": "pack4:057"
      },
      {
        "x": 12,
        "z": 27,
        "room": "south-sleeping-chamber",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 23,
        "z": 27,
        "room": "south-map-reading-room",
        "asset": "pack5:084"
      }
    ],
    "roofWings": [
      {
        "name": "north-cross-window-gable",
        "rect": [
          8,
          0,
          26,
          13
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "west-ivy-low-porch",
        "rect": [
          0,
          13,
          18,
          22
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "east-sheltered-dormer",
        "rect": [
          19,
          9,
          34,
          23
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "south-dual-sleeping-roof",
        "rect": [
          9,
          23,
          25,
          32
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "central-hearth-crossroof",
        "rect": [
          12,
          15,
          27,
          24
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "posts": [
      11,
      24
    ],
    "detail": "Four distinct genuine sky-open absent-ground porch/orchard recesses, separate western workshop and eastern foyer, connecting central family hearth, working pantry, one two-cell guest bed and nontrivial five-wing timber roof support"
  }
]);
export const BUILDER_B_HOMES_WAVE6_IDS=Object.freeze(BUILDER_B_HOMES_WAVE6_SPECS.map(s=>
 ['r1',s.category,s.biome,s.size,String(s.index).padStart(3,'0')].join(':')));
export function getBuilderBHomesWave6(){return BUILDER_B_HOMES_WAVE6_SPECS.map(compileM2ArchitecturalSpec);}
