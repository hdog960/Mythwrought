// Roadmap C Builder 1A Wave15: original enchanted forest seven-room Amberlily canopy manor, exclusively source candidate.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE15_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "enchanted-forest",
    "size": "large",
    "index": 17,
    "title": "Amberlily Canopy Lantern Manor",
    "w": 51,
    "d": 48,
    "plan": "amberlily-three-opening-canopy-living-galleries-new-original-twin-fork",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        0,
        13,
        16
      ],
      [
        39,
        0,
        50,
        9
      ],
      [
        40,
        30,
        50,
        47
      ]
    ],
    "segments": [
      [
        19,
        17,
        19,
        35
      ],
      [
        38,
        10,
        38,
        34
      ],
      [
        20,
        20,
        37,
        20
      ],
      [
        11,
        35,
        39,
        35
      ],
      [
        2,
        25,
        18,
        25
      ],
      [
        39,
        20,
        49,
        20
      ],
      [
        20,
        11,
        37,
        11
      ]
    ],
    "entry": [
      25,
      1,
      "entry-lantern-vault"
    ],
    "rooms": [
      {
        "id": "entry-lantern-vault",
        "min": [
          20,
          1,
          2
        ],
        "max": [
          37,
          4,
          20
        ]
      },
      {
        "id": "west-herb-kitchen",
        "min": [
          2,
          1,
          17
        ],
        "max": [
          19,
          4,
          25
        ]
      },
      {
        "id": "west-glade-parlor",
        "min": [
          2,
          1,
          26
        ],
        "max": [
          19,
          4,
          35
        ]
      },
      {
        "id": "east-bloom-gallery",
        "min": [
          39,
          1,
          10
        ],
        "max": [
          50,
          4,
          20
        ]
      },
      {
        "id": "east-map-study",
        "min": [
          39,
          1,
          21
        ],
        "max": [
          50,
          4,
          29
        ]
      },
      {
        "id": "forest-banquet-hall",
        "min": [
          20,
          1,
          21
        ],
        "max": [
          38,
          4,
          34
        ]
      },
      {
        "id": "rear-sleeping-gallery",
        "min": [
          12,
          1,
          36
        ],
        "max": [
          39,
          4,
          47
        ]
      }
    ],
    "doors": [
      {
        "at": [
          19,
          1,
          19
        ],
        "from": "entry-lantern-vault",
        "to": "west-herb-kitchen"
      },
      {
        "at": [
          19,
          1,
          29
        ],
        "from": "forest-banquet-hall",
        "to": "west-glade-parlor"
      },
      {
        "at": [
          38,
          1,
          15
        ],
        "from": "entry-lantern-vault",
        "to": "east-bloom-gallery"
      },
      {
        "at": [
          38,
          1,
          26
        ],
        "from": "forest-banquet-hall",
        "to": "east-map-study"
      },
      {
        "at": [
          25,
          1,
          20
        ],
        "from": "entry-lantern-vault",
        "to": "forest-banquet-hall"
      },
      {
        "at": [
          26,
          1,
          35
        ],
        "from": "forest-banquet-hall",
        "to": "rear-sleeping-gallery"
      },
      {
        "at": [
          9,
          1,
          25
        ],
        "from": "west-herb-kitchen",
        "to": "west-glade-parlor"
      },
      {
        "at": [
          44,
          1,
          20
        ],
        "from": "east-bloom-gallery",
        "to": "east-map-study"
      }
    ],
    "windows": [
      [
        23,
        1,
        "north"
      ],
      [
        34,
        1,
        "north"
      ],
      [
        1,
        19,
        "west"
      ],
      [
        23,
        46,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 8,
        "z": 20,
        "room": "west-herb-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 8,
        "z": 29,
        "room": "west-glade-parlor",
        "asset": "pack4:058"
      },
      {
        "x": 25,
        "z": 7,
        "room": "entry-lantern-vault",
        "asset": "pack4:059"
      },
      {
        "x": 45,
        "z": 15,
        "room": "east-bloom-gallery",
        "asset": "pack4:058"
      },
      {
        "x": 45,
        "z": 25,
        "room": "east-map-study",
        "asset": "pack5:084"
      },
      {
        "x": 27,
        "z": 27,
        "room": "forest-banquet-hall",
        "asset": "pack4:059"
      },
      {
        "x": 18,
        "z": 40,
        "room": "rear-sleeping-gallery",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 26,
        "z": 40,
        "room": "rear-sleeping-gallery",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-herb-vault",
        "rect": [
          0,
          17,
          19,
          25
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-lantern-truss",
        "rect": [
          0,
          26,
          19,
          35
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "entry-tree-bough",
        "rect": [
          14,
          0,
          38,
          20
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-bloom-turret",
        "rect": [
          39,
          10,
          50,
          20
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "east-astrolabe-shed",
        "rect": [
          39,
          21,
          50,
          29
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "central-banquet-canopy",
        "rect": [
          19,
          21,
          39,
          34
        ],
        "style": "step-front",
        "raise": 0
      },
      {
        "name": "sleeping-rear-crest",
        "rect": [
          11,
          35,
          39,
          47
        ],
        "style": "long-gable",
        "raise": 2
      }
    ],
    "posts": [
      16,
      28
    ],
    "detail": "Original seventh room forest manor, three true open garden terraces, varied 7 region genuine source roofs, two Pack5 bed reservations"
  }
]);
export const ROADMAP_C_1A_WAVE15_IDS=Object.freeze(ROADMAP_C_1A_WAVE15_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave15(){return ROADMAP_C_1A_WAVE15_SPECS.map(compileM2ArchitecturalSpec);}
