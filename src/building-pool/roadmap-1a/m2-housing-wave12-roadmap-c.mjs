// Roadmap C Builder 1A Wave12: new original Highmoss Ridgehouse, prior 267 source objects immutable.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE12_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "mountain",
    "size": "large",
    "index": 15,
    "title": "Highmoss Three-Terrace Ridgehouse",
    "w": 43,
    "d": 42,
    "plan": "highmoss-triple-terra-fork-cross-sheltered-hall-coordinates-original",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        21,
        9,
        41
      ],
      [
        34,
        0,
        42,
        9
      ],
      [
        35,
        35,
        42,
        41
      ]
    ],
    "segments": [
      [
        17,
        2,
        17,
        20
      ],
      [
        26,
        10,
        26,
        34
      ],
      [
        17,
        25,
        26,
        25
      ],
      [
        17,
        34,
        26,
        34
      ]
    ],
    "entry": [
      21,
      1,
      "ridge-gallery"
    ],
    "rooms": [
      {
        "id": "ridge-gallery",
        "min": [
          18,
          1,
          2
        ],
        "max": [
          26,
          4,
          25
        ]
      },
      {
        "id": "stonecarver-workshop",
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
        "id": "sunroom",
        "min": [
          27,
          1,
          11
        ],
        "max": [
          40,
          4,
          23
        ]
      },
      {
        "id": "east-guest-room",
        "min": [
          27,
          1,
          24
        ],
        "max": [
          40,
          4,
          34
        ]
      },
      {
        "id": "rear-maproom",
        "min": [
          17,
          1,
          26
        ],
        "max": [
          26,
          4,
          34
        ]
      },
      {
        "id": "south-sleeping-terrace",
        "min": [
          11,
          1,
          35
        ],
        "max": [
          26,
          4,
          41
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
        "from": "ridge-gallery",
        "to": "stonecarver-workshop"
      },
      {
        "at": [
          26,
          1,
          15
        ],
        "from": "ridge-gallery",
        "to": "sunroom"
      },
      {
        "at": [
          26,
          1,
          29
        ],
        "from": "ridge-gallery",
        "to": "east-guest-room"
      },
      {
        "at": [
          21,
          1,
          25
        ],
        "from": "ridge-gallery",
        "to": "rear-maproom"
      },
      {
        "at": [
          21,
          1,
          34
        ],
        "from": "rear-maproom",
        "to": "south-sleeping-terrace"
      }
    ],
    "windows": [
      [
        4,
        1,
        "north"
      ],
      [
        24,
        1,
        "north"
      ],
      [
        1,
        9,
        "west"
      ],
      [
        41,
        16,
        "east"
      ],
      [
        41,
        29,
        "east"
      ],
      [
        23,
        40,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 8,
        "room": "stonecarver-workshop",
        "asset": "pack5:084"
      },
      {
        "x": 21,
        "z": 7,
        "room": "ridge-gallery",
        "asset": "pack4:058"
      },
      {
        "x": 32,
        "z": 16,
        "room": "sunroom",
        "asset": "pack4:059"
      },
      {
        "x": 32,
        "z": 28,
        "room": "east-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 20,
        "z": 29,
        "room": "rear-maproom",
        "asset": "pack4:064"
      },
      {
        "x": 15,
        "z": 37,
        "room": "south-sleeping-terrace",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "west-mason-slope",
        "rect": [
          0,
          0,
          17,
          20
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "north-traverse-spine",
        "rect": [
          18,
          0,
          26,
          25
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "morninglight-eastern-bay",
        "rect": [
          27,
          9,
          42,
          23
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "east-chimney-long-ridge",
        "rect": [
          26,
          24,
          42,
          34
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "southern-cartography-gable",
        "rect": [
          13,
          25,
          26,
          34
        ],
        "style": "long-gable",
        "raise": 0
      },
      {
        "name": "south-private-sleeping-pitch",
        "rect": [
          10,
          35,
          34,
          41
        ],
        "style": "double-hill",
        "raise": 2
      }
    ],
    "posts": [
      6,
      36
    ],
    "detail": "Two missing mountainside patios plus a third snowbreak terrace; six walled rooms, five interior doors, six source-borne supported pitched roofs and two Pack5 bed-foot reserved cells"
  }
]);
export const ROADMAP_C_1A_WAVE12_IDS=Object.freeze(ROADMAP_C_1A_WAVE12_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave12(){return ROADMAP_C_1A_WAVE12_SPECS.map(compileM2ArchitecturalSpec);}
