// MYTHWROUGHT Roadmap C Builder 1A #648 / Wave25: Rimeglass Three-Snowbreak Lanternhall.
// Original unregistered snow large house #020, direct child of formally accepted #647.
// Three genuine full-height absent snowbreak court cuts, thirteen individually reachable
// connected family rooms, nineteen 2-high source portals, thirteen independently backed
// original source roof wings, twenty-two physically oriented exterior Pack4 glazing cuts,
// and four exact original Pack5 two-cell bed reservations. No live gameplay, settlement,
// saves/schema, previous source history, CI workflow or production edits.
import {compileM2ArchitecturalSpec} from './m2-originals.mjs';
export const ROADMAP_C_1A_WAVE25_HOUSE_SPECS=Object.freeze([
  {
    "category": "house",
    "biome": "snow",
    "size": "large",
    "index": 20,
    "title": "Rimeglass Three-Snowbreak Lanternhall",
    "w": 68,
    "d": 64,
    "plan": "rimeglass-three-snowbreak-voids-cross-gallery-crystal-aurora-skycourt-thirteen-family-rooms-original",
    "roof": "steep",
    "skin": "pack2:014",
    "roofAsset": "pack3:025",
    "exteriorNotches": [
      [
        56,
        0,
        67,
        22
      ],
      [
        0,
        40,
        23,
        63
      ],
      [
        51,
        48,
        67,
        63
      ]
    ],
    "segments": [
      [
        24,
        2,
        24,
        39
      ],
      [
        44,
        2,
        44,
        61
      ],
      [
        25,
        18,
        43,
        18
      ],
      [
        25,
        31,
        43,
        31
      ],
      [
        25,
        42,
        43,
        42
      ],
      [
        25,
        50,
        43,
        50
      ],
      [
        34,
        51,
        34,
        61
      ],
      [
        2,
        18,
        23,
        18
      ],
      [
        2,
        30,
        23,
        30
      ],
      [
        45,
        22,
        55,
        22
      ],
      [
        45,
        37,
        65,
        37
      ],
      [
        45,
        47,
        50,
        47
      ]
    ],
    "entry": [
      32,
      1,
      "frostgate-entry"
    ],
    "doors": [
      {
        "at": [
          24,
          1,
          10
        ],
        "from": "frostgate-entry",
        "to": "west-cedar-warmhouse"
      },
      {
        "at": [
          44,
          1,
          10
        ],
        "from": "frostgate-entry",
        "to": "east-starwatch-oriel"
      },
      {
        "at": [
          32,
          1,
          18
        ],
        "from": "frostgate-entry",
        "to": "silverwind-cross-gallery"
      },
      {
        "at": [
          12,
          1,
          18
        ],
        "from": "west-cedar-warmhouse",
        "to": "west-thermal-kitchen"
      },
      {
        "at": [
          12,
          1,
          30
        ],
        "from": "west-thermal-kitchen",
        "to": "west-iceflower-apothecary"
      },
      {
        "at": [
          24,
          1,
          24
        ],
        "from": "silverwind-cross-gallery",
        "to": "west-thermal-kitchen"
      },
      {
        "at": [
          24,
          1,
          36
        ],
        "from": "aurora-mirror-skycourt",
        "to": "west-iceflower-apothecary"
      },
      {
        "at": [
          44,
          1,
          24
        ],
        "from": "silverwind-cross-gallery",
        "to": "east-iceglass-conservatory"
      },
      {
        "at": [
          44,
          1,
          35
        ],
        "from": "aurora-mirror-skycourt",
        "to": "east-iceglass-conservatory"
      },
      {
        "at": [
          32,
          1,
          31
        ],
        "from": "silverwind-cross-gallery",
        "to": "aurora-mirror-skycourt"
      },
      {
        "at": [
          32,
          1,
          42
        ],
        "from": "aurora-mirror-skycourt",
        "to": "northstar-family-hearth"
      },
      {
        "at": [
          44,
          1,
          45
        ],
        "from": "northstar-family-hearth",
        "to": "east-runeweave-library"
      },
      {
        "at": [
          29,
          1,
          50
        ],
        "from": "northstar-family-hearth",
        "to": "west-lantern-sleep-bay"
      },
      {
        "at": [
          39,
          1,
          50
        ],
        "from": "northstar-family-hearth",
        "to": "east-lantern-sleep-bay"
      },
      {
        "at": [
          44,
          1,
          55
        ],
        "from": "east-lantern-sleep-bay",
        "to": "east-glacier-guest-room"
      },
      {
        "at": [
          50,
          1,
          22
        ],
        "from": "east-starwatch-oriel",
        "to": "east-iceglass-conservatory"
      },
      {
        "at": [
          60,
          1,
          37
        ],
        "from": "east-iceglass-conservatory",
        "to": "east-runeweave-library"
      },
      {
        "at": [
          47,
          1,
          47
        ],
        "from": "east-runeweave-library",
        "to": "east-glacier-guest-room"
      }
    ],
    "rooms": [
      {
        "id": "frostgate-entry",
        "min": [
          25,
          1,
          2
        ],
        "max": [
          44,
          4,
          18
        ]
      },
      {
        "id": "silverwind-cross-gallery",
        "min": [
          25,
          1,
          19
        ],
        "max": [
          44,
          4,
          31
        ]
      },
      {
        "id": "aurora-mirror-skycourt",
        "min": [
          25,
          1,
          32
        ],
        "max": [
          44,
          4,
          42
        ]
      },
      {
        "id": "northstar-family-hearth",
        "min": [
          25,
          1,
          43
        ],
        "max": [
          44,
          4,
          50
        ]
      },
      {
        "id": "west-lantern-sleep-bay",
        "min": [
          25,
          1,
          51
        ],
        "max": [
          34,
          4,
          62
        ]
      },
      {
        "id": "east-lantern-sleep-bay",
        "min": [
          35,
          1,
          51
        ],
        "max": [
          44,
          4,
          62
        ]
      },
      {
        "id": "west-cedar-warmhouse",
        "min": [
          2,
          1,
          2
        ],
        "max": [
          24,
          4,
          18
        ]
      },
      {
        "id": "west-thermal-kitchen",
        "min": [
          2,
          1,
          19
        ],
        "max": [
          24,
          4,
          30
        ]
      },
      {
        "id": "west-iceflower-apothecary",
        "min": [
          2,
          1,
          31
        ],
        "max": [
          24,
          4,
          39
        ]
      },
      {
        "id": "east-starwatch-oriel",
        "min": [
          45,
          1,
          2
        ],
        "max": [
          55,
          4,
          22
        ]
      },
      {
        "id": "east-iceglass-conservatory",
        "min": [
          45,
          1,
          23
        ],
        "max": [
          66,
          4,
          37
        ]
      },
      {
        "id": "east-runeweave-library",
        "min": [
          45,
          1,
          38
        ],
        "max": [
          66,
          4,
          47
        ]
      },
      {
        "id": "east-glacier-guest-room",
        "min": [
          45,
          1,
          48
        ],
        "max": [
          51,
          4,
          62
        ]
      }
    ],
    "windows": [
      [
        20,
        1,
        "north"
      ],
      [
        28,
        1,
        "north"
      ],
      [
        39,
        1,
        "north"
      ],
      [
        1,
        7,
        "west"
      ],
      [
        1,
        14,
        "west"
      ],
      [
        1,
        24,
        "west"
      ],
      [
        1,
        35,
        "west"
      ],
      [
        55,
        7,
        "east"
      ],
      [
        55,
        14,
        "east"
      ],
      [
        55,
        19,
        "east"
      ],
      [
        66,
        26,
        "east"
      ],
      [
        66,
        33,
        "east"
      ],
      [
        66,
        42,
        "east"
      ],
      [
        66,
        45,
        "east"
      ],
      [
        50,
        54,
        "east"
      ],
      [
        50,
        59,
        "east"
      ],
      [
        24,
        47,
        "west"
      ],
      [
        24,
        55,
        "west"
      ],
      [
        24,
        59,
        "west"
      ],
      [
        28,
        62,
        "south"
      ],
      [
        39,
        62,
        "south"
      ],
      [
        47,
        62,
        "south"
      ]
    ],
    "courtyard": [
      29,
      35,
      38,
      40
    ],
    "roofWings": [
      {
        "name": "west-northern-snowward-gable",
        "rect": [
          0,
          0,
          23,
          17
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "west-mid-thermal-sheath",
        "rect": [
          0,
          18,
          23,
          29
        ],
        "style": "edge-rise",
        "raise": 1
      },
      {
        "name": "west-southern-iceflower-vault",
        "rect": [
          0,
          30,
          23,
          39
        ],
        "style": "step-front",
        "raise": 2
      },
      {
        "name": "central-frostgate-crest",
        "rect": [
          24,
          0,
          43,
          17
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "north-silverwind-roof-ribs",
        "rect": [
          24,
          18,
          43,
          30
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "aurora-open-court-ring",
        "rect": [
          24,
          31,
          43,
          41
        ],
        "style": "step-front",
        "raise": 1
      },
      {
        "name": "central-hearth-shield",
        "rect": [
          24,
          42,
          43,
          49
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "west-lantern-sleep-gable",
        "rect": [
          24,
          50,
          34,
          63
        ],
        "style": "long-gable",
        "raise": 1
      },
      {
        "name": "east-lantern-sleep-crest",
        "rect": [
          35,
          50,
          43,
          63
        ],
        "style": "double-hill",
        "raise": 2
      },
      {
        "name": "east-starwatch-oriel-rake",
        "rect": [
          44,
          0,
          55,
          21
        ],
        "style": "edge-rise",
        "raise": 2
      },
      {
        "name": "east-iceglass-conservatory-fan",
        "rect": [
          44,
          22,
          67,
          36
        ],
        "style": "double-hill",
        "raise": 1
      },
      {
        "name": "east-runeweave-belfry",
        "rect": [
          44,
          37,
          67,
          47
        ],
        "style": "long-gable",
        "raise": 2
      },
      {
        "name": "east-glacier-guest-snowcap",
        "rect": [
          44,
          48,
          50,
          63
        ],
        "style": "step-front",
        "raise": 2
      }
    ],
    "fixtures": [
      {
        "x": 29,
        "z": 6,
        "room": "frostgate-entry",
        "asset": "pack4:059"
      },
      {
        "x": 37,
        "z": 11,
        "room": "frostgate-entry",
        "asset": "pack4:058"
      },
      {
        "x": 28,
        "z": 23,
        "room": "silverwind-cross-gallery",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 27,
        "room": "silverwind-cross-gallery",
        "asset": "pack4:059"
      },
      {
        "x": 27,
        "z": 35,
        "room": "aurora-mirror-skycourt",
        "asset": "pack4:059"
      },
      {
        "x": 41,
        "z": 39,
        "room": "aurora-mirror-skycourt",
        "asset": "pack4:058"
      },
      {
        "x": 29,
        "z": 45,
        "room": "northstar-family-hearth",
        "asset": "pack4:064"
      },
      {
        "x": 39,
        "z": 47,
        "room": "northstar-family-hearth",
        "asset": "pack4:058"
      },
      {
        "x": 28,
        "z": 54,
        "room": "west-lantern-sleep-bay",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 31,
        "z": 59,
        "room": "west-lantern-sleep-bay",
        "asset": "pack4:057"
      },
      {
        "x": 38,
        "z": 54,
        "room": "east-lantern-sleep-bay",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 40,
        "z": 59,
        "room": "east-lantern-sleep-bay",
        "asset": "pack4:059"
      },
      {
        "x": 5,
        "z": 7,
        "room": "west-cedar-warmhouse",
        "asset": "pack4:064"
      },
      {
        "x": 11,
        "z": 11,
        "room": "west-cedar-warmhouse",
        "asset": "pack4:058"
      },
      {
        "x": 17,
        "z": 11,
        "room": "west-cedar-warmhouse",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 5,
        "z": 23,
        "room": "west-thermal-kitchen",
        "asset": "pack4:057"
      },
      {
        "x": 17,
        "z": 26,
        "room": "west-thermal-kitchen",
        "asset": "pack4:064"
      },
      {
        "x": 6,
        "z": 34,
        "room": "west-iceflower-apothecary",
        "asset": "pack5:084"
      },
      {
        "x": 17,
        "z": 36,
        "room": "west-iceflower-apothecary",
        "asset": "pack4:059"
      },
      {
        "x": 47,
        "z": 7,
        "room": "east-starwatch-oriel",
        "asset": "pack4:059"
      },
      {
        "x": 52,
        "z": 17,
        "room": "east-starwatch-oriel",
        "asset": "pack4:058"
      },
      {
        "x": 48,
        "z": 26,
        "room": "east-iceglass-conservatory",
        "asset": "pack4:064"
      },
      {
        "x": 58,
        "z": 29,
        "room": "east-iceglass-conservatory",
        "asset": "pack4:057"
      },
      {
        "x": 49,
        "z": 41,
        "room": "east-runeweave-library",
        "asset": "pack5:084"
      },
      {
        "x": 61,
        "z": 43,
        "room": "east-runeweave-library",
        "asset": "pack4:058"
      },
      {
        "x": 47,
        "z": 54,
        "room": "east-glacier-guest-room",
        "asset": "pack5:082",
        "variant": "wanderer-quilt"
      },
      {
        "x": 48,
        "z": 59,
        "room": "east-glacier-guest-room",
        "asset": "pack4:059"
      }
    ],
    "posts": [
      30,
      37
    ],
    "detail": "Original snow biome large thirteen-room starlattice family winterhall with asymmetric north-east and south-east snowbreak courts and fully missing south-west windward cliff, insulated Pack2:014 source walls and Pack3:025 backed snow roofs, real aurora lantern open skycourt, two windbreak and thermal family galleries, winter kitchen, iceflower medicine room, crystal observatory and conservatory, rune library, three independently reserved family sleeping beds plus an east guest bed. Twenty-two genuine oriented Pack4 exterior glazing cuts, eleven outward-facing view corridors into actual missing source snow court air, thirteen individually physically backed roof wings and eighteen two-high source entrances/portals; only isolated author-source candidate, no live registration, weather loads, game collider or save ABI claims."
  }
]);
export const ROADMAP_C_1A_WAVE25_HOUSE_IDS=Object.freeze(ROADMAP_C_1A_WAVE25_HOUSE_SPECS.map(x=>'r1:'+x.category+':'+x.biome+':'+x.size+':'+String(x.index).padStart(3,'0')));
export function getRoadmapC1AHousesWave25(){return ROADMAP_C_1A_WAVE25_HOUSE_SPECS.map(compileM2ArchitecturalSpec);}
