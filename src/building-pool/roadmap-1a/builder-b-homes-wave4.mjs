// Builder B 1A downstream Wave4. New source-only original mountain family, no historical reauthoring.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const BUILDER_B_HOMES_WAVE4_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "mountain",
    "size": "small",
    "index": 20,
    "title": "Granitebell Ridge-Survey Split-Cottage",
    "w": 35,
    "d": 34,
    "plan": "mountain lookout C-terrace with offset weather vestibule, survey room, workshop, guest bedroom and sheltered ridge balcony",
    "roof": "steep",
    "skin": "pack1:006",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        10,
        9
      ],
      [
        27,
        22,
        34,
        33
      ],
      [
        0,
        26,
        8,
        33
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        27
      ],
      [
        27,
        10,
        27,
        21
      ],
      [
        2,
        16,
        33,
        16
      ],
      [
        9,
        26,
        26,
        26
      ],
      [
        11,
        10,
        25,
        10
      ]
    ],
    "entry": [
      24,
      1,
      "north-weather-entry"
    ],
    "rooms": [
      {
        "id": "north-weather-entry",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          34,
          4,
          16
        ]
      },
      {
        "id": "west-surveyor-table",
        "min": [
          2,
          1,
          11
        ],
        "max": [
          17,
          4,
          16
        ]
      },
      {
        "id": "east-signal-workshop",
        "min": [
          28,
          1,
          11
        ],
        "max": [
          34,
          4,
          16
        ]
      },
      {
        "id": "central-slate-hearth",
        "min": [
          18,
          1,
          17
        ],
        "max": [
          27,
          4,
          26
        ]
      },
      {
        "id": "south-guest-bedroom",
        "min": [
          9,
          1,
          27
        ],
        "max": [
          26,
          4,
          33
        ]
      },
      {
        "id": "west-storm-storage",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          17,
          4,
          25
        ]
      },
      {
        "id": "east-protected-ridge-porch",
        "min": [
          28,
          1,
          17
        ],
        "max": [
          34,
          4,
          22
        ]
      }
    ],
    "doors": [
      {
        "at": [
          17,
          1,
          8
        ],
        "from": "north-weather-entry",
        "to": "west-surveyor-table"
      },
      {
        "at": [
          27,
          1,
          13
        ],
        "from": "north-weather-entry",
        "to": "east-signal-workshop"
      },
      {
        "at": [
          22,
          1,
          16
        ],
        "from": "north-weather-entry",
        "to": "central-slate-hearth"
      },
      {
        "at": [
          9,
          1,
          16
        ],
        "from": "west-surveyor-table",
        "to": "west-storm-storage"
      },
      {
        "at": [
          17,
          1,
          21
        ],
        "from": "west-storm-storage",
        "to": "central-slate-hearth"
      },
      {
        "at": [
          20,
          1,
          26
        ],
        "from": "central-slate-hearth",
        "to": "south-guest-bedroom"
      },
      {
        "at": [
          31,
          1,
          16
        ],
        "from": "east-signal-workshop",
        "to": "east-protected-ridge-porch"
      },
      {
        "at": [
          27,
          1,
          20
        ],
        "from": "east-protected-ridge-porch",
        "to": "central-slate-hearth"
      }
    ],
    "windows": [
      [
        13,
        1,
        "north"
      ],
      [
        25,
        1,
        "north"
      ],
      [
        33,
        14,
        "east"
      ],
      [
        1,
        18,
        "west"
      ],
      [
        9,
        32,
        "south"
      ],
      [
        21,
        32,
        "south"
      ],
      [
        1,
        23,
        "west"
      ],
      [
        33,
        19,
        "east"
      ]
    ],
    "fixtures": [
      {
        "x": 22,
        "z": 7,
        "room": "north-weather-entry",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 13,
        "room": "west-surveyor-table",
        "asset": "pack5:084"
      },
      {
        "x": 31,
        "z": 13,
        "room": "east-signal-workshop",
        "asset": "pack4:058"
      },
      {
        "x": 21,
        "z": 21,
        "room": "central-slate-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 15,
        "z": 29,
        "room": "south-guest-bedroom",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 8,
        "z": 21,
        "room": "west-storm-storage",
        "asset": "pack4:059"
      },
      {
        "x": 31,
        "z": 19,
        "room": "east-protected-ridge-porch",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "north-high-snow-cleaver",
        "rect": [
          11,
          0,
          34,
          10
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-low-survey-awning",
        "rect": [
          0,
          10,
          17,
          25
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "east-short-stone-monitor",
        "rect": [
          18,
          11,
          34,
          21
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "south-inward-ridge",
        "rect": [
          9,
          26,
          26,
          33
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "middle-hearth-crosswing",
        "rect": [
          11,
          22,
          26,
          29
        ],
        "style": "long-gable",
        "raise": 1
      }
    ],
    "posts": [
      12,
      23
    ],
    "detail": "Actual supported alpine split-cottage with three genuine snow-shed voids, seven connected original rooms, windward survey table, internal guest sleeping reservation and staggered defensive terraces"
  }
]);
export const BUILDER_B_HOMES_WAVE4_IDS=Object.freeze(BUILDER_B_HOMES_WAVE4_SPECS.map(s=>
 ['r1',s.category,s.biome,s.size,String(s.index).padStart(3,'0')].join(':')));
export function getBuilderBHomesWave4(){return BUILDER_B_HOMES_WAVE4_SPECS.map(compileM2ArchitecturalSpec);}
