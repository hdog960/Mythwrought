// MYTHWROUGHT Roadmap C Builder 1A Wave16: original new house source only, no registration or saves.
// True 3-notch concave footprint, seven connected rooms, roof wings, actual doors and reserved 2-cell beds.
// Acceptance not claimed until strict D4, physical Manual Pack source AABB and real Chromium previews.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE16_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 18,
    "title": "Thornwake Seven-Hall Willowcrest House",
    "w": 46,
    "d": 44,
    "plan": "true-concave-twin-front-notches-seven-differently-shaped-rooms-central-bridged-thresholds-original",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        0,
        9,
        13
      ],
      [
        36,
        0,
        45,
        12
      ],
      [
        36,
        30,
        45,
        43
      ]
    ],
    "segments": [
      [
        17,
        14,
        17,
        36
      ],
      [
        35,
        13,
        35,
        29
      ],
      [
        17,
        16,
        35,
        16
      ],
      [
        17,
        29,
        35,
        29
      ],
      [
        2,
        24,
        16,
        24
      ],
      [
        36,
        22,
        44,
        22
      ]
    ],
    "entry": [
      23,
      1,
      "entry-gallery"
    ],
    "rooms": [
      {
        "id": "entry-gallery",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          35,
          4,
          16
        ]
      },
      {
        "id": "root-kitchen",
        "min": [
          2,
          1,
          14
        ],
        "max": [
          17,
          4,
          24
        ]
      },
      {
        "id": "bough-sleeping-wing",
        "min": [
          2,
          1,
          25
        ],
        "max": [
          17,
          4,
          37
        ]
      },
      {
        "id": "middle-song-hall",
        "min": [
          18,
          1,
          17
        ],
        "max": [
          36,
          4,
          29
        ]
      },
      {
        "id": "mist-cartography",
        "min": [
          36,
          1,
          13
        ],
        "max": [
          45,
          4,
          22
        ]
      },
      {
        "id": "lantern-solar",
        "min": [
          36,
          1,
          23
        ],
        "max": [
          45,
          4,
          30
        ]
      },
      {
        "id": "rear-hearth-commons",
        "min": [
          18,
          1,
          30
        ],
        "max": [
          36,
          4,
          43
        ]
      }
    ],
    "doors": [
      {
        "at": [
          23,
          1,
          16
        ],
        "from": "entry-gallery",
        "to": "middle-song-hall"
      },
      {
        "at": [
          17,
          1,
          20
        ],
        "from": "middle-song-hall",
        "to": "root-kitchen"
      },
      {
        "at": [
          17,
          1,
          31
        ],
        "from": "rear-hearth-commons",
        "to": "bough-sleeping-wing"
      },
      {
        "at": [
          35,
          1,
          19
        ],
        "from": "middle-song-hall",
        "to": "mist-cartography"
      },
      {
        "at": [
          35,
          1,
          26
        ],
        "from": "middle-song-hall",
        "to": "lantern-solar"
      },
      {
        "at": [
          25,
          1,
          29
        ],
        "from": "middle-song-hall",
        "to": "rear-hearth-commons"
      },
      {
        "at": [
          9,
          1,
          24
        ],
        "from": "root-kitchen",
        "to": "bough-sleeping-wing"
      },
      {
        "at": [
          41,
          1,
          22
        ],
        "from": "mist-cartography",
        "to": "lantern-solar"
      }
    ],
    "windows": [
      [
        22,
        1,
        "north"
      ],
      [
        30,
        1,
        "north"
      ],
      [
        1,
        18,
        "west"
      ],
      [
        44,
        19,
        "east"
      ],
      [
        1,
        33,
        "west"
      ],
      [
        25,
        42,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 23,
        "z": 6,
        "room": "entry-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 8,
        "z": 19,
        "room": "root-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 5,
        "z": 29,
        "room": "bough-sleeping-wing",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 12,
        "z": 32,
        "room": "bough-sleeping-wing",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 27,
        "z": 24,
        "room": "middle-song-hall",
        "asset": "pack4:058"
      },
      {
        "x": 40,
        "z": 16,
        "room": "mist-cartography",
        "asset": "pack5:084"
      },
      {
        "x": 39,
        "z": 26,
        "room": "lantern-solar",
        "asset": "pack4:058"
      },
      {
        "x": 23,
        "z": 36,
        "room": "rear-hearth-commons",
        "asset": "pack4:059"
      }
    ],
    "roofWings": [
      {
        "name": "twisted-root-kitchen-slope",
        "rect": [
          0,
          14,
          17,
          24
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-sleeper-cross-pitch",
        "rect": [
          0,
          25,
          17,
          36
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "entrance-thornwake-gable",
        "rect": [
          10,
          0,
          35,
          16
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "heart-pavilion-bridge-roof",
        "rect": [
          17,
          17,
          35,
          29
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "east-archive-facets",
        "rect": [
          36,
          13,
          45,
          22
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "east-solar-shed",
        "rect": [
          36,
          23,
          45,
          29
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "rear-willowcrest-double-pitch",
        "rect": [
          17,
          30,
          35,
          43
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      12,
      32
    ],
    "detail": "Original seven physically partitioned halls, three genuine no-foundation concave exterior courts, seven differently pitched source roof wings, 8 accessible door thresholds and two reserved two-cell guest beds."
  }
]);
export const ROADMAP_C_1A_WAVE16_IDS=Object.freeze(ROADMAP_C_1A_WAVE16_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave16(){return ROADMAP_C_1A_WAVE16_SPECS.map(compileM2ArchitecturalSpec);}
