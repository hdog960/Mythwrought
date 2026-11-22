// MYTHWROUGHT Roadmap C Builder 1A Wave20: Rimehaven Northstar Crescent Inn.
// ORIGINAL SOURCE ONLY. No production registration, settlement generation, schema,
// save writes, biome automations, or modifications to accepted earlier sources.
// Unallocated expected snow-large inn slot #005; original explicit architectural coordinate tables.
// 15 literal rooms, 25 genuine interior portals + vestibule entry, 3 genuine concave
// snowy exterior voids, 72 fully open snowlight court columns, 15 supported source
// roof wings, 18 glazed external windows, 6 two-cell Pack5 guest beds.
// All source acceptance/full historical 275/ Chromium original physical proof remains
// pending. Do NOT add to active runtime catalog before separate approval.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE20_INN_SPECS=Object.freeze([
  {
    "category": "inn",
    "biome": "snow",
    "size": "large",
    "index": 5,
    "title": "Rimehaven Northstar Crescent Inn",
    "w": 64,
    "d": 56,
    "plan": "rimehaven-forked-northstar-observatory-crescent-thermal-snowcourt-three-open-cliffs-original",
    "roof": "steep",
    "skin": "pack2:013",
    "roofAsset": "pack3:023",
    "exteriorNotches": [
      [
        0,
        0,
        15,
        15
      ],
      [
        0,
        43,
        13,
        55
      ],
      [
        55,
        40,
        63,
        55
      ]
    ],
    "segments": [
      [
        23,
        18,
        23,
        55
      ],
      [
        40,
        2,
        40,
        55
      ],
      [
        24,
        17,
        40,
        17
      ],
      [
        24,
        37,
        40,
        37
      ],
      [
        24,
        45,
        40,
        45
      ],
      [
        2,
        27,
        23,
        27
      ],
      [
        2,
        34,
        23,
        34
      ],
      [
        12,
        28,
        12,
        34
      ],
      [
        14,
        42,
        23,
        42
      ],
      [
        41,
        10,
        62,
        10
      ],
      [
        41,
        22,
        62,
        22
      ],
      [
        41,
        31,
        62,
        31
      ],
      [
        41,
        39,
        54,
        39
      ],
      [
        41,
        47,
        54,
        47
      ]
    ],
    "entry": [
      28,
      1,
      "north-vestibule"
    ],
    "rooms": [
      {
        "id": "north-vestibule",
        "min": [
          16,
          1,
          2
        ],
        "max": [
          40,
          4,
          17
        ]
      },
      {
        "id": "aurora-watching-gallery",
        "min": [
          41,
          1,
          2
        ],
        "max": [
          63,
          4,
          10
        ]
      },
      {
        "id": "east-star-chart-library",
        "min": [
          41,
          1,
          11
        ],
        "max": [
          63,
          4,
          22
        ]
      },
      {
        "id": "west-steam-kitchen",
        "min": [
          2,
          1,
          18
        ],
        "max": [
          23,
          4,
          27
        ]
      },
      {
        "id": "west-winter-pantry",
        "min": [
          2,
          1,
          28
        ],
        "max": [
          12,
          4,
          34
        ]
      },
      {
        "id": "west-lantern-workshop",
        "min": [
          13,
          1,
          28
        ],
        "max": [
          23,
          4,
          34
        ]
      },
      {
        "id": "west-hearth-bunks",
        "min": [
          2,
          1,
          35
        ],
        "max": [
          23,
          4,
          42
        ]
      },
      {
        "id": "southwest-frost-porch",
        "min": [
          14,
          1,
          43
        ],
        "max": [
          23,
          4,
          55
        ]
      },
      {
        "id": "central-northstar-hearth",
        "min": [
          24,
          1,
          18
        ],
        "max": [
          40,
          4,
          37
        ]
      },
      {
        "id": "snowlight-court-arcade",
        "min": [
          24,
          1,
          38
        ],
        "max": [
          40,
          4,
          45
        ]
      },
      {
        "id": "south-guest-commons",
        "min": [
          24,
          1,
          46
        ],
        "max": [
          40,
          4,
          55
        ]
      },
      {
        "id": "east-skyglass-bathhouse",
        "min": [
          41,
          1,
          23
        ],
        "max": [
          63,
          4,
          31
        ]
      },
      {
        "id": "east-icefern-conservatory",
        "min": [
          41,
          1,
          32
        ],
        "max": [
          63,
          4,
          39
        ]
      },
      {
        "id": "southeast-rimeglass-suites",
        "min": [
          41,
          1,
          40
        ],
        "max": [
          54,
          4,
          47
        ]
      },
      {
        "id": "southeast-aurora-dormitory",
        "min": [
          41,
          1,
          48
        ],
        "max": [
          54,
          4,
          55
        ]
      }
    ],
    "doors": [
      {
        "at": [
          40,
          1,
          7
        ],
        "from": "north-vestibule",
        "to": "aurora-watching-gallery"
      },
      {
        "at": [
          40,
          1,
          15
        ],
        "from": "north-vestibule",
        "to": "east-star-chart-library"
      },
      {
        "at": [
          50,
          1,
          10
        ],
        "from": "aurora-watching-gallery",
        "to": "east-star-chart-library"
      },
      {
        "at": [
          30,
          1,
          17
        ],
        "from": "north-vestibule",
        "to": "central-northstar-hearth"
      },
      {
        "at": [
          23,
          1,
          22
        ],
        "from": "central-northstar-hearth",
        "to": "west-steam-kitchen"
      },
      {
        "at": [
          23,
          1,
          30
        ],
        "from": "central-northstar-hearth",
        "to": "west-lantern-workshop"
      },
      {
        "at": [
          23,
          1,
          36
        ],
        "from": "central-northstar-hearth",
        "to": "west-hearth-bunks"
      },
      {
        "at": [
          7,
          1,
          27
        ],
        "from": "west-steam-kitchen",
        "to": "west-winter-pantry"
      },
      {
        "at": [
          18,
          1,
          27
        ],
        "from": "west-steam-kitchen",
        "to": "west-lantern-workshop"
      },
      {
        "at": [
          12,
          1,
          31
        ],
        "from": "west-winter-pantry",
        "to": "west-lantern-workshop"
      },
      {
        "at": [
          7,
          1,
          34
        ],
        "from": "west-winter-pantry",
        "to": "west-hearth-bunks"
      },
      {
        "at": [
          17,
          1,
          34
        ],
        "from": "west-lantern-workshop",
        "to": "west-hearth-bunks"
      },
      {
        "at": [
          18,
          1,
          42
        ],
        "from": "west-hearth-bunks",
        "to": "southwest-frost-porch"
      },
      {
        "at": [
          23,
          1,
          49
        ],
        "from": "southwest-frost-porch",
        "to": "south-guest-commons"
      },
      {
        "at": [
          31,
          1,
          37
        ],
        "from": "central-northstar-hearth",
        "to": "snowlight-court-arcade"
      },
      {
        "at": [
          31,
          1,
          45
        ],
        "from": "snowlight-court-arcade",
        "to": "south-guest-commons"
      },
      {
        "at": [
          40,
          1,
          20
        ],
        "from": "central-northstar-hearth",
        "to": "east-star-chart-library"
      },
      {
        "at": [
          40,
          1,
          26
        ],
        "from": "central-northstar-hearth",
        "to": "east-skyglass-bathhouse"
      },
      {
        "at": [
          40,
          1,
          35
        ],
        "from": "central-northstar-hearth",
        "to": "east-icefern-conservatory"
      },
      {
        "at": [
          50,
          1,
          22
        ],
        "from": "east-star-chart-library",
        "to": "east-skyglass-bathhouse"
      },
      {
        "at": [
          50,
          1,
          31
        ],
        "from": "east-skyglass-bathhouse",
        "to": "east-icefern-conservatory"
      },
      {
        "at": [
          49,
          1,
          39
        ],
        "from": "east-icefern-conservatory",
        "to": "southeast-rimeglass-suites"
      },
      {
        "at": [
          49,
          1,
          47
        ],
        "from": "southeast-rimeglass-suites",
        "to": "southeast-aurora-dormitory"
      },
      {
        "at": [
          40,
          1,
          43
        ],
        "from": "snowlight-court-arcade",
        "to": "southeast-rimeglass-suites"
      },
      {
        "at": [
          40,
          1,
          50
        ],
        "from": "south-guest-commons",
        "to": "southeast-aurora-dormitory"
      }
    ],
    "windows": [
      [
        20,
        1,
        "north"
      ],
      [
        30,
        1,
        "north"
      ],
      [
        37,
        1,
        "north"
      ],
      [
        49,
        1,
        "north"
      ],
      [
        58,
        1,
        "north"
      ],
      [
        16,
        8,
        "west"
      ],
      [
        1,
        20,
        "west"
      ],
      [
        1,
        30,
        "west"
      ],
      [
        1,
        38,
        "west"
      ],
      [
        14,
        50,
        "west"
      ],
      [
        62,
        7,
        "east"
      ],
      [
        62,
        17,
        "east"
      ],
      [
        62,
        28,
        "east"
      ],
      [
        62,
        35,
        "east"
      ],
      [
        54,
        44,
        "east"
      ],
      [
        54,
        51,
        "east"
      ],
      [
        29,
        54,
        "south"
      ],
      [
        48,
        54,
        "south"
      ]
    ],
    "fixtures": [
      {
        "x": 27,
        "z": 7,
        "room": "north-vestibule",
        "asset": "pack4:059"
      },
      {
        "x": 34,
        "z": 7,
        "room": "north-vestibule",
        "asset": "pack4:058"
      },
      {
        "x": 49,
        "z": 6,
        "room": "aurora-watching-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 7,
        "z": 22,
        "room": "west-steam-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 6,
        "z": 31,
        "room": "west-winter-pantry",
        "asset": "pack5:084"
      },
      {
        "x": 17,
        "z": 31,
        "room": "west-lantern-workshop",
        "asset": "pack4:058"
      },
      {
        "x": 6,
        "z": 38,
        "room": "west-hearth-bunks",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 13,
        "z": 38,
        "room": "west-hearth-bunks",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 17,
        "z": 47,
        "room": "southwest-frost-porch",
        "asset": "pack4:059"
      },
      {
        "x": 26,
        "z": 21,
        "room": "central-northstar-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 38,
        "z": 22,
        "room": "central-northstar-hearth",
        "asset": "pack4:059"
      },
      {
        "x": 26,
        "z": 41,
        "room": "snowlight-court-arcade",
        "asset": "pack4:058"
      },
      {
        "x": 27,
        "z": 49,
        "room": "south-guest-commons",
        "asset": "pack4:064"
      },
      {
        "x": 47,
        "z": 15,
        "room": "east-star-chart-library",
        "asset": "pack5:084"
      },
      {
        "x": 48,
        "z": 27,
        "room": "east-skyglass-bathhouse",
        "asset": "pack4:057"
      },
      {
        "x": 47,
        "z": 35,
        "room": "east-icefern-conservatory",
        "asset": "pack4:059"
      },
      {
        "x": 45,
        "z": 43,
        "room": "southeast-rimeglass-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 50,
        "z": 43,
        "room": "southeast-rimeglass-suites",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 44,
        "z": 51,
        "room": "southeast-aurora-dormitory",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 50,
        "z": 51,
        "room": "southeast-aurora-dormitory",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      }
    ],
    "roofWings": [
      {
        "name": "northstar-vestibule-snowspire",
        "rect": [
          16,
          0,
          40,
          17
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "northern-aurora-gallery-vault",
        "rect": [
          41,
          0,
          63,
          10
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "star-chart-library-prism",
        "rect": [
          41,
          11,
          63,
          22
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "western-steam-kitchen-gable",
        "rect": [
          0,
          16,
          23,
          27
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "western-winter-pantry-shed",
        "rect": [
          0,
          28,
          12,
          34
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "western-lantern-workshop-ridge",
        "rect": [
          13,
          28,
          23,
          34
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "western-warm-bunk-crosspitch",
        "rect": [
          0,
          35,
          23,
          42
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "southwest-frost-porch-canopy",
        "rect": [
          14,
          43,
          23,
          55
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "heart-snowfall-shed-crescent",
        "rect": [
          24,
          18,
          40,
          37
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "open-court-ridge-gallery",
        "rect": [
          24,
          38,
          40,
          45
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "southern-commons-snowcloak",
        "rect": [
          24,
          46,
          40,
          55
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-skyglass-bathhouse-roof",
        "rect": [
          41,
          23,
          63,
          31
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "east-icefern-wintergarden-hip",
        "rect": [
          41,
          32,
          63,
          39
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "east-rimeglass-guest-arch",
        "rect": [
          41,
          40,
          54,
          47
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "east-aurora-dormitory-roof",
        "rect": [
          41,
          48,
          54,
          55
        ],
        "style": "long-gable",
        "raise": 1
      }
    ],
    "courtyard": [
      28,
      25,
      35,
      33
    ],
    "posts": [
      26,
      38
    ],
    "detail": "Original north-snow large hospitality crescent: fifteen genuinely connected rooms including skyglass bathhouse, fern conservatory, aurora gallery and six reserved Pack5 guest bunks, twenty-five interior portals plus northern windbreak entrance, three irregular physically absent external winter terraces, seventy-two physically open-to-sky snowlight columns inside a sheltered ring, fifteen independently massed physical snow-shedding roofs, eighteen true original Pack4 windows, and winter-toned unregistered source cells. No settlements, saves, registration, or gameplay edits."
  }
]);
export const ROADMAP_C_1A_WAVE20_INN_IDS=Object.freeze(ROADMAP_C_1A_WAVE20_INN_SPECS.map(s=>'r1:'+s.category+':'+s.biome+':'+s.size+':'+String(s.index).padStart(3,'0')));
export function getRoadmapC1AInnWave20(){return ROADMAP_C_1A_WAVE20_INN_SPECS.map(compileM2ArchitecturalSpec);}
