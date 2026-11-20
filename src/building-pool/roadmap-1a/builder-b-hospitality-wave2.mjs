// Builder B residential/hospitality Wave2 — true winter tavern with source-validated six-room plan.
// Hand-authored 3D coordinate specification; no gameplay tavern systems, economy or deployment.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const BUILDER_B_HOSPITALITY_WAVE2_SPECS=Object.freeze([
  {
    "category": "tavern",
    "biome": "snow",
    "size": "small",
    "index": 5,
    "title": "Whitecedar Split-Loft Lantern Taproom",
    "w": 39,
    "d": 36,
    "plan": "six-room staggered snow tavern, separate guest hearth, windbreak and working kitchen with river snow courts",
    "roof": "steep",
    "skin": "live:wood",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        0,
        0,
        11,
        14
      ],
      [
        30,
        0,
        38,
        8
      ],
      [
        0,
        27,
        12,
        35
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
        12,
        18,
        34,
        18
      ],
      [
        28,
        19,
        28,
        31
      ],
      [
        13,
        27,
        27,
        27
      ],
      [
        29,
        31,
        37,
        31
      ]
    ],
    "entry": [
      25,
      1,
      "front-weatherbreak"
    ],
    "rooms": [
      {
        "id": "front-weatherbreak",
        "min": [
          22,
          1,
          2
        ],
        "max": [
          37,
          4,
          18
        ]
      },
      {
        "id": "west-social-taproom",
        "min": [
          12,
          1,
          2
        ],
        "max": [
          21,
          4,
          18
        ]
      },
      {
        "id": "rear-hearth-gathering",
        "min": [
          13,
          1,
          19
        ],
        "max": [
          28,
          4,
          27
        ]
      },
      {
        "id": "east-serving-kitchen",
        "min": [
          29,
          1,
          19
        ],
        "max": [
          37,
          4,
          31
        ]
      },
      {
        "id": "south-cider-cellar",
        "min": [
          13,
          1,
          28
        ],
        "max": [
          28,
          4,
          34
        ]
      },
      {
        "id": "snow-gear-service-closet",
        "min": [
          29,
          1,
          32
        ],
        "max": [
          37,
          4,
          34
        ]
      }
    ],
    "doors": [
      {
        "at": [
          21,
          1,
          11
        ],
        "from": "front-weatherbreak",
        "to": "west-social-taproom"
      },
      {
        "at": [
          32,
          1,
          18
        ],
        "from": "front-weatherbreak",
        "to": "east-serving-kitchen"
      },
      {
        "at": [
          17,
          1,
          18
        ],
        "from": "west-social-taproom",
        "to": "rear-hearth-gathering"
      },
      {
        "at": [
          28,
          1,
          23
        ],
        "from": "rear-hearth-gathering",
        "to": "east-serving-kitchen"
      },
      {
        "at": [
          19,
          1,
          27
        ],
        "from": "rear-hearth-gathering",
        "to": "south-cider-cellar"
      },
      {
        "at": [
          32,
          1,
          31
        ],
        "from": "east-serving-kitchen",
        "to": "snow-gear-service-closet"
      }
    ],
    "windows": [
      [
        15,
        1,
        "north"
      ],
      [
        26,
        1,
        "north"
      ],
      [
        12,
        7,
        "west"
      ],
      [
        37,
        15,
        "east"
      ],
      [
        37,
        27,
        "east"
      ],
      [
        19,
        34,
        "south"
      ],
      [
        33,
        34,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 25,
        "z": 6,
        "room": "front-weatherbreak",
        "asset": "pack4:058"
      },
      {
        "x": 16,
        "z": 7,
        "room": "west-social-taproom",
        "asset": "pack4:059"
      },
      {
        "x": 18,
        "z": 22,
        "room": "rear-hearth-gathering",
        "asset": "pack4:064"
      },
      {
        "x": 33,
        "z": 24,
        "room": "east-serving-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 17,
        "z": 31,
        "room": "south-cider-cellar",
        "asset": "pack4:057"
      },
      {
        "x": 34,
        "z": 33,
        "room": "snow-gear-service-closet",
        "asset": "pack4:059"
      }
    ],
    "roofWings": [
      {
        "name": "front-low-icebreaker",
        "rect": [
          12,
          0,
          29,
          17
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-angled-kitchen-flue",
        "rect": [
          30,
          9,
          38,
          31
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "west-broken-cider-tile",
        "rect": [
          0,
          15,
          20,
          26
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "southern-cellar-sweep",
        "rect": [
          13,
          28,
          38,
          35
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "central-fireplace-crossroof",
        "rect": [
          21,
          18,
          29,
          31
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-storm-shed",
        "rect": [
          0,
          16,
          11,
          26
        ],
        "style": "double-hill",
        "raise": 0
      }
    ],
    "posts": [
      15,
      22
    ],
    "detail": "Genuinely asymmetric windbreak service hall, wide guest seating, protected kitchen, separate cellar and storage, varied snowproof six-wing gables"
  }
]);
export const BUILDER_B_HOSPITALITY_WAVE2_IDS=Object.freeze(BUILDER_B_HOSPITALITY_WAVE2_SPECS.map(s=>
 ['r1',s.category,s.biome,s.size,String(s.index).padStart(3,'0')].join(':')));
export function getBuilderBHospitalityWave2(){return BUILDER_B_HOSPITALITY_WAVE2_SPECS.map(compileM2ArchitecturalSpec);}
