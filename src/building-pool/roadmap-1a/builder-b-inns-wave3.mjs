// Builder B 1A Wave3 — original seven-room desert caravan inn, not a recolored historic building.
// 4 physical Pack5 bed feet reserved by source compiler; no economy, world placement, save or spawn systems.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const BUILDER_B_INNS_WAVE3_SPECS=Object.freeze([
  {
    "category": "inn",
    "biome": "desert",
    "size": "small",
    "index": 5,
    "title": "Dustwillow Star Caravan Court Inn",
    "w": 42,
    "d": 39,
    "plan": "split-front caravan registration with four off-axis private sleeping suites, six-way interconnected service circulation, high shadow arcade and rear traveler garden",
    "roof": "terrace",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        0,
        13,
        12
      ],
      [
        31,
        0,
        41,
        9
      ],
      [
        0,
        28,
        11,
        38
      ]
    ],
    "segments": [
      [
        19,
        2,
        19,
        17
      ],
      [
        28,
        10,
        28,
        24
      ],
      [
        12,
        17,
        38,
        17
      ],
      [
        12,
        27,
        38,
        27
      ],
      [
        25,
        18,
        25,
        37
      ]
    ],
    "entry": [
      22,
      1,
      "reception-windbreak"
    ],
    "rooms": [
      {
        "id": "reception-windbreak",
        "min": [
          20,
          1,
          2
        ],
        "max": [
          28,
          4,
          17
        ]
      },
      {
        "id": "west-private-guest",
        "min": [
          14,
          1,
          2
        ],
        "max": [
          19,
          4,
          17
        ]
      },
      {
        "id": "east-private-guest",
        "min": [
          29,
          1,
          10
        ],
        "max": [
          40,
          4,
          17
        ]
      },
      {
        "id": "shaded-social-gallery",
        "min": [
          13,
          1,
          18
        ],
        "max": [
          25,
          4,
          27
        ]
      },
      {
        "id": "east-kitchen-and-trade",
        "min": [
          26,
          1,
          18
        ],
        "max": [
          40,
          4,
          27
        ]
      },
      {
        "id": "rear-west-guest-court",
        "min": [
          12,
          1,
          28
        ],
        "max": [
          25,
          4,
          38
        ]
      },
      {
        "id": "rear-east-guest-court",
        "min": [
          26,
          1,
          28
        ],
        "max": [
          40,
          4,
          38
        ]
      }
    ],
    "doors": [
      {
        "at": [
          19,
          1,
          9
        ],
        "from": "reception-windbreak",
        "to": "west-private-guest"
      },
      {
        "at": [
          28,
          1,
          12
        ],
        "from": "reception-windbreak",
        "to": "east-private-guest"
      },
      {
        "at": [
          22,
          1,
          17
        ],
        "from": "reception-windbreak",
        "to": "shaded-social-gallery"
      },
      {
        "at": [
          25,
          1,
          22
        ],
        "from": "shaded-social-gallery",
        "to": "east-kitchen-and-trade"
      },
      {
        "at": [
          17,
          1,
          27
        ],
        "from": "shaded-social-gallery",
        "to": "rear-west-guest-court"
      },
      {
        "at": [
          32,
          1,
          27
        ],
        "from": "east-kitchen-and-trade",
        "to": "rear-east-guest-court"
      },
      {
        "at": [
          25,
          1,
          32
        ],
        "from": "rear-west-guest-court",
        "to": "rear-east-guest-court"
      },
      {
        "at": [
          16,
          1,
          17
        ],
        "from": "west-private-guest",
        "to": "shaded-social-gallery"
      },
      {
        "at": [
          33,
          1,
          17
        ],
        "from": "east-private-guest",
        "to": "east-kitchen-and-trade"
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
        14,
        7,
        "west"
      ],
      [
        40,
        13,
        "east"
      ],
      [
        1,
        20,
        "west"
      ],
      [
        40,
        23,
        "east"
      ],
      [
        12,
        32,
        "west"
      ],
      [
        17,
        37,
        "south"
      ],
      [
        31,
        37,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 23,
        "z": 7,
        "room": "reception-windbreak",
        "asset": "pack4:059"
      },
      {
        "x": 16,
        "z": 6,
        "room": "west-private-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 35,
        "z": 12,
        "room": "east-private-guest",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 18,
        "z": 23,
        "room": "shaded-social-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 33,
        "z": 21,
        "room": "east-kitchen-and-trade",
        "asset": "pack4:057"
      },
      {
        "x": 17,
        "z": 33,
        "room": "rear-west-guest-court",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 32,
        "z": 31,
        "room": "rear-east-guest-court",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "north-reception-windcatcher",
        "rect": [
          14,
          0,
          30,
          17
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "east-upper-private-arcade",
        "rect": [
          31,
          10,
          41,
          26
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "west-deep-sunshade",
        "rect": [
          0,
          13,
          19,
          27
        ],
        "style": "double-hill",
        "raise": 0
      },
      {
        "name": "middle-courtyard-umbra",
        "rect": [
          20,
          18,
          30,
          27
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "twin-rear-private-ridge",
        "rect": [
          12,
          28,
          41,
          38
        ],
        "style": "step-front",
        "raise": 1
      }
    ],
    "posts": [
      16,
      27
    ],
    "detail": "Distinct 7-room caravan inn, four private guest-bed reservations with two-cell feet, three genuine sky-open ground recesses and five different sunshade roofs"
  }
]);
export const BUILDER_B_INNS_WAVE3_IDS=Object.freeze(BUILDER_B_INNS_WAVE3_SPECS.map(s=>
 ['r1',s.category,s.biome,s.size,String(s.index).padStart(3,'0')].join(':')));
export function getBuilderBInnsWave3(){return BUILDER_B_INNS_WAVE3_SPECS.map(compileM2ArchitecturalSpec);}
