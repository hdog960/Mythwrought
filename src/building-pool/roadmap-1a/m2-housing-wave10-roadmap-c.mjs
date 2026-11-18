// Roadmap C 1A Wave10: source-authored original additional house, strictly isolated nonproduction.
// Historical 265 blueprint objects remain byte-for-byte immutable; this file adds only a new ID.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE10_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "temperate",
    "size": "small",
    "index": 15,
    "title": "Reedbank Bridged Garden Cottage",
    "w": 30,
    "d": 29,
    "plan": "reedbank-forked-garden-concave-stem-four-room-original",
    "roof": "courtyard",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        17,
        10,
        28
      ],
      [
        22,
        21,
        29,
        28
      ]
    ],
    "segments": [
      [
        14,
        2,
        14,
        12
      ],
      [
        12,
        13,
        21,
        13
      ],
      [
        12,
        20,
        21,
        20
      ]
    ],
    "entry": [
      20,
      1,
      "hearth-hall"
    ],
    "rooms": [
      {
        "id": "workroom",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          14,
          4,
          13
        ]
      },
      {
        "id": "hearth-hall",
        "min": [
          15,
          1,
          2
        ],
        "max": [
          28,
          4,
          13
        ]
      },
      {
        "id": "garden-gallery",
        "min": [
          12,
          1,
          14
        ],
        "max": [
          21,
          4,
          20
        ]
      },
      {
        "id": "sleeping-room",
        "min": [
          12,
          1,
          21
        ],
        "max": [
          21,
          4,
          27
        ]
      }
    ],
    "doors": [
      {
        "at": [
          14,
          1,
          6
        ],
        "from": "hearth-hall",
        "to": "workroom"
      },
      {
        "at": [
          17,
          1,
          13
        ],
        "from": "hearth-hall",
        "to": "garden-gallery"
      },
      {
        "at": [
          17,
          1,
          20
        ],
        "from": "garden-gallery",
        "to": "sleeping-room"
      }
    ],
    "windows": [
      [
        3,
        1,
        "north"
      ],
      [
        26,
        1,
        "north"
      ],
      [
        1,
        8,
        "west"
      ],
      [
        28,
        8,
        "east"
      ],
      [
        16,
        27,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 4,
        "z": 6,
        "room": "workroom",
        "asset": "pack5:084"
      },
      {
        "x": 22,
        "z": 6,
        "room": "hearth-hall",
        "asset": "pack4:064"
      },
      {
        "x": 14,
        "z": 16,
        "room": "garden-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 16,
        "z": 23,
        "room": "sleeping-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "northwest-studio-gable",
        "rect": [
          0,
          0,
          14,
          13
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "river-facing-hearth-roof",
        "rect": [
          15,
          0,
          29,
          13
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "bridged-rear-garden-hip",
        "rect": [
          11,
          14,
          21,
          28
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      3,
      26
    ],
    "detail": "Literal T-fork U-notched source perimeter with original bridged garden and privately connected sleeping quarters; Pack5 bed-foot reservation"
  }
]);
export const ROADMAP_C_1A_WAVE10_IDS=Object.freeze(ROADMAP_C_1A_WAVE10_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave10(){return ROADMAP_C_1A_WAVE10_SPECS.map(compileM2ArchitecturalSpec);}
