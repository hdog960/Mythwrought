// MYTHWROUGHT Roadmap C Builder 1A #646 / Wave23: Saffronwind Mirrorgarden Homestead.
// Independent original integer-coordinate desert LARGE house #019; SOURCE-ONLY, unregistered.
// Three real absent exterior terrace cuts; 14 partitioned accessible rooms, 20 authentic
// two-high portal openings, 14 independently supported roof wings, 19 true Pack4 windows
// and three physical Pack5 two-cell bed reservations. No runtime/settlement/save edits.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE23_HOUSE_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "desert",
    "size": "large",
    "index": 19,
    "title": "Saffronwind Mirrorgarden Homestead",
    "w": 64,
    "d": 56,
    "plan": "saffronwind-three-absent-dune-terraces-mirrorcourt-fourteen-room-sunspine-original",
    "roof": "terrace",
    "skin": "pack5:080",
    "roofAsset": "pack3:024",
    "exteriorNotches": [
      [
        0,
        0,
        15,
        15
      ],
      [
        51,
        21,
        63,
        37
      ],
      [
        0,
        44,
        13,
        55
      ]
    ],
    "segments": [
      [
        24,
        2,
        24,
        53
      ],
      [
        39,
        2,
        39,
        53
      ],
      [
        25,
        15,
        38,
        15
      ],
      [
        25,
        30,
        38,
        30
      ],
      [
        25,
        42,
        38,
        42
      ],
      [
        2,
        17,
        23,
        17
      ],
      [
        2,
        34,
        23,
        34
      ],
      [
        2,
        43,
        23,
        43
      ],
      [
        13,
        18,
        13,
        33
      ],
      [
        40,
        18,
        61,
        18
      ],
      [
        40,
        38,
        61,
        38
      ],
      [
        40,
        45,
        61,
        45
      ],
      [
        51,
        2,
        51,
        17
      ]
    ],
    "entry": [
      31,
      1,
      "sunrise-reception"
    ],
    "rooms": [
      {
        "id": "sunrise-reception",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          39,
          4,
          15
        ]
      },
      {
        "id": "long-oasis-gallery",
        "min": [
          25,
          1,
          16
        ],
        "max": [
          39,
          4,
          30
        ]
      },
      {
        "id": "open-mirrorgarden-court",
        "min": [
          25,
          1,
          31
        ],
        "max": [
          39,
          4,
          42
        ]
      },
      {
        "id": "moonlight-family-hall",
        "min": [
          25,
          1,
          43
        ],
        "max": [
          39,
          4,
          54
        ]
      },
      {
        "id": "west-windcatcher-lookout",
        "min": [
          17,
          1,
          2
        ],
        "max": [
          24,
          4,
          17
        ]
      },
      {
        "id": "west-copper-kitchen",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          13,
          4,
          34
        ]
      },
      {
        "id": "west-ceramic-pantry",
        "min": [
          14,
          1,
          18
        ],
        "max": [
          24,
          4,
          34
        ]
      },
      {
        "id": "west-loom-atelier",
        "min": [
          2,
          1,
          35
        ],
        "max": [
          24,
          4,
          43
        ]
      },
      {
        "id": "west-dune-guest-room",
        "min": [
          14,
          1,
          44
        ],
        "max": [
          24,
          4,
          54
        ]
      },
      {
        "id": "east-sunroom",
        "min": [
          40,
          1,
          2
        ],
        "max": [
          51,
          4,
          18
        ]
      },
      {
        "id": "east-shadow-study",
        "min": [
          52,
          1,
          2
        ],
        "max": [
          62,
          4,
          18
        ]
      },
      {
        "id": "east-mirage-loggia",
        "min": [
          40,
          1,
          19
        ],
        "max": [
          50,
          4,
          38
        ]
      },
      {
        "id": "east-sheltered-dining",
        "min": [
          40,
          1,
          39
        ],
        "max": [
          62,
          4,
          45
        ]
      },
      {
        "id": "east-family-sleeping",
        "min": [
          40,
          1,
          46
        ],
        "max": [
          62,
          4,
          54
        ]
      }
    ],
    "doors": [
      {
        "at": [
          31,
          1,
          15
        ],
        "from": "sunrise-reception",
        "to": "long-oasis-gallery"
      },
      {
        "at": [
          31,
          1,
          30
        ],
        "from": "long-oasis-gallery",
        "to": "open-mirrorgarden-court"
      },
      {
        "at": [
          31,
          1,
          42
        ],
        "from": "open-mirrorgarden-court",
        "to": "moonlight-family-hall"
      },
      {
        "at": [
          24,
          1,
          8
        ],
        "from": "sunrise-reception",
        "to": "west-windcatcher-lookout"
      },
      {
        "at": [
          24,
          1,
          24
        ],
        "from": "long-oasis-gallery",
        "to": "west-ceramic-pantry"
      },
      {
        "at": [
          13,
          1,
          26
        ],
        "from": "west-ceramic-pantry",
        "to": "west-copper-kitchen"
      },
      {
        "at": [
          18,
          1,
          34
        ],
        "from": "west-ceramic-pantry",
        "to": "west-loom-atelier"
      },
      {
        "at": [
          19,
          1,
          43
        ],
        "from": "west-loom-atelier",
        "to": "west-dune-guest-room"
      },
      {
        "at": [
          24,
          1,
          38
        ],
        "from": "open-mirrorgarden-court",
        "to": "west-loom-atelier"
      },
      {
        "at": [
          24,
          1,
          49
        ],
        "from": "moonlight-family-hall",
        "to": "west-dune-guest-room"
      },
      {
        "at": [
          39,
          1,
          8
        ],
        "from": "sunrise-reception",
        "to": "east-sunroom"
      },
      {
        "at": [
          51,
          1,
          10
        ],
        "from": "east-sunroom",
        "to": "east-shadow-study"
      },
      {
        "at": [
          39,
          1,
          24
        ],
        "from": "long-oasis-gallery",
        "to": "east-mirage-loggia"
      },
      {
        "at": [
          45,
          1,
          38
        ],
        "from": "east-mirage-loggia",
        "to": "east-sheltered-dining"
      },
      {
        "at": [
          39,
          1,
          44
        ],
        "from": "moonlight-family-hall",
        "to": "east-sheltered-dining"
      },
      {
        "at": [
          48,
          1,
          45
        ],
        "from": "east-sheltered-dining",
        "to": "east-family-sleeping"
      },
      {
        "at": [
          39,
          1,
          49
        ],
        "from": "moonlight-family-hall",
        "to": "east-family-sleeping"
      },
      {
        "at": [
          39,
          1,
          35
        ],
        "from": "open-mirrorgarden-court",
        "to": "east-mirage-loggia"
      },
      {
        "at": [
          19,
          1,
          17
        ],
        "from": "west-windcatcher-lookout",
        "to": "west-ceramic-pantry"
      }
    ],
    "windows": [
      [
        20,
        1,
        "north"
      ],
      [
        29,
        1,
        "north"
      ],
      [
        36,
        1,
        "north"
      ],
      [
        44,
        1,
        "north"
      ],
      [
        56,
        1,
        "north"
      ],
      [
        1,
        22,
        "west"
      ],
      [
        1,
        30,
        "west"
      ],
      [
        1,
        39,
        "west"
      ],
      [
        62,
        8,
        "east"
      ],
      [
        62,
        16,
        "east"
      ],
      [
        62,
        42,
        "east"
      ],
      [
        62,
        49,
        "east"
      ],
      [
        21,
        54,
        "south"
      ],
      [
        30,
        54,
        "south"
      ],
      [
        45,
        54,
        "south"
      ],
      [
        55,
        54,
        "south"
      ],
      [
        16,
        9,
        "west"
      ],
      [
        50,
        27,
        "east"
      ],
      [
        14,
        49,
        "west"
      ]
    ],
    "fixtures": [
      {
        "x": 28,
        "z": 6,
        "room": "sunrise-reception",
        "asset": "pack4:059"
      },
      {
        "x": 35,
        "z": 8,
        "room": "sunrise-reception",
        "asset": "pack4:058"
      },
      {
        "x": 29,
        "z": 22,
        "room": "long-oasis-gallery",
        "asset": "pack4:064"
      },
      {
        "x": 35,
        "z": 26,
        "room": "long-oasis-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 26,
        "z": 34,
        "room": "open-mirrorgarden-court",
        "asset": "pack4:057"
      },
      {
        "x": 28,
        "z": 47,
        "room": "moonlight-family-hall",
        "asset": "pack4:058"
      },
      {
        "x": 36,
        "z": 51,
        "room": "moonlight-family-hall",
        "asset": "pack4:059"
      },
      {
        "x": 19,
        "z": 7,
        "room": "west-windcatcher-lookout",
        "asset": "pack4:064"
      },
      {
        "x": 20,
        "z": 12,
        "room": "west-windcatcher-lookout",
        "asset": "pack4:058"
      },
      {
        "x": 5,
        "z": 22,
        "room": "west-copper-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 10,
        "z": 29,
        "room": "west-copper-kitchen",
        "asset": "pack4:059"
      },
      {
        "x": 17,
        "z": 22,
        "room": "west-ceramic-pantry",
        "asset": "pack4:057"
      },
      {
        "x": 21,
        "z": 29,
        "room": "west-ceramic-pantry",
        "asset": "pack4:058"
      },
      {
        "x": 5,
        "z": 37,
        "room": "west-loom-atelier",
        "asset": "pack4:064"
      },
      {
        "x": 10,
        "z": 39,
        "room": "west-loom-atelier",
        "asset": "pack4:058"
      },
      {
        "x": 16,
        "z": 48,
        "room": "west-dune-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 21,
        "z": 48,
        "room": "west-dune-guest-room",
        "asset": "pack4:059"
      },
      {
        "x": 43,
        "z": 5,
        "room": "east-sunroom",
        "asset": "pack4:064"
      },
      {
        "x": 47,
        "z": 13,
        "room": "east-sunroom",
        "asset": "pack4:059"
      },
      {
        "x": 55,
        "z": 7,
        "room": "east-shadow-study",
        "asset": "pack4:058"
      },
      {
        "x": 59,
        "z": 12,
        "room": "east-shadow-study",
        "asset": "pack4:057"
      },
      {
        "x": 43,
        "z": 22,
        "room": "east-mirage-loggia",
        "asset": "pack4:059"
      },
      {
        "x": 47,
        "z": 30,
        "room": "east-mirage-loggia",
        "asset": "pack4:058"
      },
      {
        "x": 43,
        "z": 41,
        "room": "east-sheltered-dining",
        "asset": "pack4:059"
      },
      {
        "x": 55,
        "z": 41,
        "room": "east-sheltered-dining",
        "asset": "pack4:064"
      },
      {
        "x": 43,
        "z": 49,
        "room": "east-family-sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 52,
        "z": 49,
        "room": "east-family-sleeping",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 59,
        "z": 49,
        "room": "east-family-sleeping",
        "asset": "pack4:059"
      }
    ],
    "roofWings": [
      {
        "name": "sunrise-four-taper-terraces",
        "rect": [
          25,
          2,
          38,
          14
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "long-mirrored-corridor",
        "rect": [
          25,
          16,
          38,
          29
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "oasis-well-shading-canopy",
        "rect": [
          25,
          31,
          38,
          41
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "moonlight-copper-dune-roof",
        "rect": [
          25,
          43,
          38,
          53
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "western-high-windcatcher",
        "rect": [
          16,
          2,
          23,
          16
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "copper-hearth-stepped-dune",
        "rect": [
          2,
          18,
          12,
          33
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "kiln-and-ceramic-loft",
        "rect": [
          14,
          18,
          23,
          33
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "long-western-loom-house",
        "rect": [
          2,
          35,
          23,
          42
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "guest-sandstone-terrace",
        "rect": [
          14,
          44,
          23,
          53
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "eastern-sunlit-atrium",
        "rect": [
          40,
          2,
          50,
          17
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "eastern-shadow-library",
        "rect": [
          52,
          2,
          61,
          17
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "eastern-inner-mirage-loggia",
        "rect": [
          40,
          19,
          50,
          37
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "sheltered-family-table",
        "rect": [
          40,
          39,
          61,
          44
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "southern-sleeping-bays",
        "rect": [
          40,
          46,
          61,
          53
        ],
        "style": "edge-rise",
        "raise": 1
      }
    ],
    "courtyard": [
      28,
      33,
      35,
      39
    ],
    "posts": [
      23,
      40
    ],
    "detail": "Original large desert home with fourteen individually accessible rooms along four consecutive family galleries, three fully absent cliffside-like dune terrace cuts, a fifty-six-cell grounded roof-open mirrorgarden, separate windcatcher, kitchen, ceramics, loom, sleeping and mirrored study wings, fourteen pitched/stepped source roof bodies, nineteen true Pack4 glazed window openings including three genuine notch-facing vistas, and three Pack5 two-cell physical bed reservations; no settlement placement, live-world installation, approved roof loads, weatherproofing or save ABI."
  }
]);
export const ROADMAP_C_1A_WAVE23_HOUSE_IDS=Object.freeze(ROADMAP_C_1A_WAVE23_HOUSE_SPECS.map(x=>'r1:'+x.category+':'+x.biome+':'+x.size+':'+String(x.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave23(){return ROADMAP_C_1A_WAVE23_HOUSE_SPECS.map(compileM2ArchitecturalSpec);}
