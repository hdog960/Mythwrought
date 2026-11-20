// Builder B source-only Roadmap B Wave7. Original seven-room medium Alpine survey house, no terrain or save side effects.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const BUILDER_B_HOMES_WAVE7_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "mountain",
    "size": "medium",
    "index": 20,
    "title": "Highglen Staggered-Terrace Survey House",
    "w": 47,
    "d": 43,
    "plan": "two unequal windward approach courts, offset split-ridge workshop, upper-lookout reading gallery, broad central guest hearth and staggered south timber sleeping porch",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        11,
        9
      ],
      [
        34,
        0,
        46,
        10
      ],
      [
        0,
        33,
        9,
        42
      ]
    ],
    "segments": [
      [
        22,
        2,
        22,
        13
      ],
      [
        12,
        14,
        45,
        14
      ],
      [
        27,
        15,
        27,
        30
      ],
      [
        10,
        31,
        45,
        31
      ],
      [
        17,
        32,
        17,
        41
      ],
      [
        12,
        25,
        27,
        25
      ]
    ],
    "entry": [
      24,
      1,
      "north-survey-arrival"
    ],
    "rooms": [
      {
        "id": "north-survey-arrival",
        "min": [
          23,
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
        "id": "west-windbreak-and-lantern",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          22,
          4,
          14
        ]
      },
      {
        "id": "west-stone-tool-workshop",
        "min": [
          10,
          1,
          15
        ],
        "max": [
          27,
          4,
          30
        ]
      },
      {
        "id": "east-ridge-chart-library",
        "min": [
          28,
          1,
          15
        ],
        "max": [
          45,
          4,
          30
        ]
      },
      {
        "id": "south-common-hearth-room",
        "min": [
          18,
          1,
          32
        ],
        "max": [
          33,
          4,
          41
        ]
      },
      {
        "id": "west-guest-sleeping-room",
        "min": [
          10,
          1,
          32
        ],
        "max": [
          17,
          4,
          41
        ]
      },
      {
        "id": "east-rainwatch-dining-bay",
        "min": [
          34,
          1,
          32
        ],
        "max": [
          45,
          4,
          41
        ]
      }
    ],
    "doors": [
      {
        "at": [
          22,
          1,
          9
        ],
        "from": "north-survey-arrival",
        "to": "west-windbreak-and-lantern"
      },
      {
        "at": [
          19,
          1,
          14
        ],
        "from": "west-windbreak-and-lantern",
        "to": "west-stone-tool-workshop"
      },
      {
        "at": [
          27,
          1,
          9
        ],
        "from": "north-survey-arrival",
        "to": "east-ridge-chart-library"
      },
      {
        "at": [
          30,
          1,
          14
        ],
        "from": "north-survey-arrival",
        "to": "east-ridge-chart-library"
      },
      {
        "at": [
          27,
          1,
          21
        ],
        "from": "west-stone-tool-workshop",
        "to": "east-ridge-chart-library"
      },
      {
        "at": [
          23,
          1,
          31
        ],
        "from": "west-stone-tool-workshop",
        "to": "south-common-hearth-room"
      },
      {
        "at": [
          38,
          1,
          31
        ],
        "from": "east-ridge-chart-library",
        "to": "east-rainwatch-dining-bay"
      },
      {
        "at": [
          17,
          1,
          37
        ],
        "from": "south-common-hearth-room",
        "to": "west-guest-sleeping-room"
      },
      {
        "at": [
          33,
          1,
          36
        ],
        "from": "south-common-hearth-room",
        "to": "east-rainwatch-dining-bay"
      }
    ],
    "windows": [
      [
        19,
        1,
        "north"
      ],
      [
        28,
        1,
        "north"
      ],
      [
        1,
        22,
        "west"
      ],
      [
        45,
        22,
        "east"
      ],
      [
        13,
        41,
        "south"
      ],
      [
        26,
        41,
        "south"
      ],
      [
        41,
        41,
        "south"
      ],
      [
        45,
        33,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 26,
        "z": 7,
        "room": "north-survey-arrival",
        "asset": "pack4:059"
      },
      {
        "x": 16,
        "z": 8,
        "room": "west-windbreak-and-lantern",
        "asset": "pack4:058"
      },
      {
        "x": 15,
        "z": 20,
        "room": "west-stone-tool-workshop",
        "asset": "pack4:059"
      },
      {
        "x": 37,
        "z": 22,
        "room": "east-ridge-chart-library",
        "asset": "pack5:084"
      },
      {
        "x": 27,
        "z": 37,
        "room": "south-common-hearth-room",
        "asset": "pack4:064"
      },
      {
        "x": 13,
        "z": 37,
        "room": "west-guest-sleeping-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 40,
        "z": 36,
        "room": "east-rainwatch-dining-bay",
        "asset": "pack4:057"
      }
    ],
    "roofWings": [
      {
        "name": "north-pass-high-two-ridges",
        "rect": [
          12,
          0,
          33,
          13
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-angled-workshop-snow-shed",
        "rect": [
          9,
          13,
          27,
          30
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "east-tall-chart-library-monitor",
        "rect": [
          28,
          12,
          46,
          30
        ],
        "style": "double-hill",
        "raise": 3
      },
      {
        "name": "south-hearth-double-eave",
        "rect": [
          18,
          30,
          33,
          42
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "west-guest-low-perched-roof",
        "rect": [
          10,
          32,
          17,
          42
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "east-rainwatch-gable",
        "rect": [
          34,
          32,
          46,
          42
        ],
        "style": "double-hill",
        "raise": 1
      }
    ],
    "posts": [
      15,
      39
    ],
    "detail": "Real wind-protected staggered mountain terrace source with three truly absent-ground notch courts, seven separately partitioned rooms, physical support beams, one two-cell Pack5 bed and six distinct roof pitch profiles"
  }
]);
export const BUILDER_B_HOMES_WAVE7_IDS=Object.freeze(BUILDER_B_HOMES_WAVE7_SPECS.map(s=>
 ['r1',s.category,s.biome,s.size,String(s.index).padStart(3,'0')].join(':')));
export function getBuilderBHomesWave7(){return BUILDER_B_HOMES_WAVE7_SPECS.map(compileM2ArchitecturalSpec);}
