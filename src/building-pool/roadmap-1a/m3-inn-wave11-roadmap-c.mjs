// Roadmap C 1A Wave11: first original newly authored inn after accepted 266; NO earlier source changes.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE11_SPECS=Object.freeze([
  {
    "category": "inn",
    "biome": "temperate",
    "size": "small",
    "index": 5,
    "title": "Fablebend Twin-Court Travelers Inn",
    "w": 34,
    "d": 32,
    "plan": "fablebend-twin-forked-guest-pavilions-with-four-lodging-wings-original",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        20,
        10,
        31
      ],
      [
        25,
        24,
        33,
        31
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
        20,
        2,
        20,
        19
      ],
      [
        11,
        20,
        24,
        20
      ],
      [
        2,
        12,
        12,
        12
      ],
      [
        21,
        12,
        31,
        12
      ]
    ],
    "entry": [
      16,
      1,
      "entry-gallery"
    ],
    "doors": [
      {
        "at": [
          13,
          1,
          6
        ],
        "from": "entry-gallery",
        "to": "west-guest"
      },
      {
        "at": [
          13,
          1,
          16
        ],
        "from": "entry-gallery",
        "to": "west-bunk"
      },
      {
        "at": [
          20,
          1,
          6
        ],
        "from": "entry-gallery",
        "to": "kitchen"
      },
      {
        "at": [
          20,
          1,
          16
        ],
        "from": "entry-gallery",
        "to": "east-guest"
      },
      {
        "at": [
          16,
          1,
          20
        ],
        "from": "entry-gallery",
        "to": "rear-hearth"
      },
      {
        "at": [
          8,
          1,
          12
        ],
        "from": "west-guest",
        "to": "west-bunk"
      },
      {
        "at": [
          26,
          1,
          12
        ],
        "from": "kitchen",
        "to": "east-guest"
      }
    ],
    "rooms": [
      {
        "id": "entry-gallery",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          20,
          4,
          20
        ]
      },
      {
        "id": "west-guest",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          13,
          4,
          12
        ]
      },
      {
        "id": "west-bunk",
        "min": [
          2,
          1,
          13
        ],
        "max": [
          13,
          4,
          20
        ]
      },
      {
        "id": "kitchen",
        "min": [
          21,
          1,
          2
        ],
        "max": [
          32,
          4,
          12
        ]
      },
      {
        "id": "east-guest",
        "min": [
          21,
          1,
          13
        ],
        "max": [
          32,
          4,
          20
        ]
      },
      {
        "id": "rear-hearth",
        "min": [
          11,
          1,
          21
        ],
        "max": [
          25,
          4,
          30
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
        28,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        32,
        7,
        "east"
      ],
      [
        16,
        30,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 16,
        "z": 7,
        "room": "entry-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 4,
        "z": 6,
        "room": "west-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 6,
        "z": 16,
        "room": "west-bunk",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 24,
        "z": 6,
        "room": "kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 28,
        "z": 16,
        "room": "east-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 13,
        "z": 25,
        "room": "rear-hearth",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 19,
        "z": 25,
        "room": "rear-hearth",
        "asset": "pack4:058"
      }
    ],
    "roofWings": [
      {
        "name": "west-guest-mountain-lite",
        "rect": [
          0,
          0,
          13,
          12
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "east-kitchen-terrace",
        "rect": [
          20,
          0,
          33,
          12
        ],
        "style": "edge-rise",
        "raise": 0
      },
      {
        "name": "great-entrance-steep-ridge",
        "rect": [
          14,
          0,
          19,
          20
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-back-sleeping-pitch",
        "rect": [
          0,
          13,
          13,
          19
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "east-back-moss-lantern",
        "rect": [
          20,
          13,
          33,
          23
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "rear-hearth-deck-gable",
        "rect": [
          11,
          20,
          24,
          31
        ],
        "style": "edge-rise",
        "raise": 0
      }
    ],
    "posts": [
      5,
      28
    ],
    "detail": "Two truly missing rear garden courts, six physically independent rooms and beds with reserved Pack5 foot tiles under six pitched roofs"
  }
]);
export const ROADMAP_C_1A_WAVE11_IDS=Object.freeze(ROADMAP_C_1A_WAVE11_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AInnWave11(){return ROADMAP_C_1A_WAVE11_SPECS.map(compileM2ArchitecturalSpec);}
