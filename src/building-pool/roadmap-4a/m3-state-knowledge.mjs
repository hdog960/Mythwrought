// Builder 4A M3/M4 state knowledge — eight original castle, embassy, archive and observatory architectural plans.
// Separate authored coordinate envelopes; shared deterministic compilation is NOT a random
// world generator. All source materials remain symbolic until physical family acceptance.
import {SCHEMA,validateBlueprint} from './schema.mjs';
const cell=(x,y,z)=>[x,y,z].join(',');
const tile=(x,z)=>x+','+z;
const pointIn=([x0,z0,x1,z1],x,z)=>x>=x0&&x<=x1&&z>=z0&&z<=z1;
const ROOF={'temperate':'pack3:023','snow':'pack3:025','enchanted-forest':'pack3:026','desert':'pack3:024','mountain':'pack3:025'};
const FAMILY=Object.freeze({
 'pack1:002':{state:'candidate',intendedShape:'single-cell',orientation:'fixed',attachment:'none',
   unresolved:['physical masonry load/neighbor-face joinery','real candidate collision/selection in game']},
 'pack2:015':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'floor',
   unresolved:['real furniture occupied volume and mounting','schema-1 saved orientation compatibility']},
 'pack3:023':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
 unresolved:['temperate roof support, physical yaw and overhang fitting']},
 'pack3:024':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['wind/debris roof tile attachment and pitch/joinery']},
 'pack3:025':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['snow/drift loading, ridge joints and roof pitch orientation']},
 'pack3:026':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'adjacent',
   unresolved:['forest canopy moisture/weather seal and architectural timber mounting']},
 'pack4:030':{state:'candidate',intendedShape:'partial',orientation:'rotatable',attachment:'wall',
   unresolved:['real glass pane wall offset, translucency sorting and yaw save']},
});
const PLANS=[
  {
    "id": "r4:castle-palace:temperate:medium:02",
    "type": "castle-palace",
    "biome": "temperate",
    "size": "medium",
    "variant": 2,
    "bounds": [
      76,
      12,
      66
    ],
    "wings": [
      [
        29,
        7,
        48,
        27
      ],
      [
        7,
        19,
        28,
        48
      ],
      [
        49,
        19,
        70,
        48
      ],
      [
        24,
        49,
        52,
        60
      ],
      [
        20,
        25,
        57,
        33
      ],
      [
        20,
        33,
        32,
        51
      ],
      [
        45,
        33,
        55,
        51
      ],
      [
        32,
        34,
        45,
        47
      ],
      [
        3,
        39,
        15,
        58
      ]
    ],
    "notches": [
      [
        35,
        37,
        41,
        42
      ]
    ],
    "octagons": [
      [
        13,
        34,
        6,
        9
      ]
    ],
    "skyline": [
      [
        36,
        12,
        42,
        18,
        10
      ],
      [
        59,
        27,
        63,
        32,
        10
      ]
    ],
    "entry": [
      38,
      7
    ],
    "porch": [
      35,
      3,
      41,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 29,
        "from": 24,
        "to": 30,
        "door": 27,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 49,
        "from": 24,
        "to": 30,
        "door": 27,
        "facing": "east"
      }
    ],
    "windows": [
      [
        33,
        7,
        "south"
      ],
      [
        44,
        7,
        "south"
      ],
      [
        7,
        27,
        "west"
      ],
      [
        70,
        29,
        "east"
      ],
      [
        38,
        60,
        "north"
      ],
      [
        3,
        50,
        "west"
      ]
    ],
    "fixtures": [
      [
        38,
        15
      ],
      [
        16,
        26
      ],
      [
        60,
        26
      ],
      [
        38,
        54
      ],
      [
        11,
        48
      ],
      [
        53,
        37
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "royal-vaulted-arrival",
        "kind": "entrance-hall",
        "rect": [
          31,
          10,
          46,
          22
        ]
      },
      {
        "id": "long-river-throne-chamber",
        "kind": "grand-chamber",
        "rect": [
          27,
          53,
          50,
          58
        ]
      },
      {
        "id": "west-turret-guard-gallery",
        "kind": "tower-or-wing",
        "rect": [
          9,
          25,
          25,
          38
        ]
      },
      {
        "id": "eastern-chart-room",
        "kind": "council",
        "rect": [
          53,
          23,
          67,
          41
        ]
      },
      {
        "id": "south-canal-office",
        "kind": "registry",
        "rect": [
          33,
          27,
          44,
          32
        ]
      },
      {
        "id": "outer-ferry-watchtower",
        "kind": "tower-or-wing",
        "rect": [
          5,
          45,
          13,
          55
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          31,
          9,
          46,
          22
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          9,
          23,
          26,
          38
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          53,
          23,
          67,
          41
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          27,
          52,
          50,
          58
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          5,
          45,
          13,
          55
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "river-citadel-offset-bastion-courtyard",
      76,
      12,
      66
    ],
    "profile": "river-citadel-offset-bastion-courtyard"
  },
  {
    "id": "r4:castle-palace:snow:large:02",
    "type": "castle-palace",
    "biome": "snow",
    "size": "large",
    "variant": 2,
    "bounds": [
      91,
      12,
      76
    ],
    "wings": [
      [
        40,
        7,
        58,
        24
      ],
      [
        5,
        18,
        38,
        53
      ],
      [
        60,
        25,
        83,
        56
      ],
      [
        26,
        56,
        71,
        68
      ],
      [
        30,
        23,
        64,
        34
      ],
      [
        33,
        33,
        43,
        59
      ],
      [
        52,
        33,
        62,
        60
      ],
      [
        43,
        35,
        53,
        53
      ],
      [
        4,
        49,
        17,
        66
      ],
      [
        78,
        51,
        88,
        68
      ]
    ],
    "notches": [
      [
        46,
        39,
        50,
        45
      ]
    ],
    "octagons": [
      [
        77,
        58,
        7,
        10
      ]
    ],
    "skyline": [
      [
        45,
        12,
        52,
        18,
        11
      ],
      [
        11,
        30,
        16,
        35,
        10
      ],
      [
        81,
        56,
        85,
        61,
        10
      ]
    ],
    "entry": [
      49,
      7
    ],
    "porch": [
      46,
      3,
      52,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 38,
        "from": 24,
        "to": 30,
        "door": 27,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 60,
        "from": 26,
        "to": 33,
        "door": 30,
        "facing": "east"
      }
    ],
    "windows": [
      [
        44,
        7,
        "south"
      ],
      [
        56,
        7,
        "south"
      ],
      [
        5,
        27,
        "west"
      ],
      [
        83,
        33,
        "east"
      ],
      [
        49,
        68,
        "north"
      ],
      [
        4,
        60,
        "west"
      ],
      [
        88,
        63,
        "east"
      ]
    ],
    "fixtures": [
      [
        48,
        15
      ],
      [
        15,
        29
      ],
      [
        74,
        34
      ],
      [
        48,
        63
      ],
      [
        11,
        59
      ],
      [
        83,
        60
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "frost-bridge-vestibule",
        "kind": "entrance-hall",
        "rect": [
          43,
          10,
          56,
          21
        ]
      },
      {
        "id": "great-aurora-state-hall",
        "kind": "grand-chamber",
        "rect": [
          29,
          59,
          67,
          66
        ]
      },
      {
        "id": "west-ice-breaker-bastion",
        "kind": "tower-or-wing",
        "rect": [
          9,
          23,
          33,
          44
        ]
      },
      {
        "id": "east-glacier-council-wing",
        "kind": "council",
        "rect": [
          65,
          29,
          79,
          49
        ]
      },
      {
        "id": "far-west-storm-shelter",
        "kind": "tower-or-wing",
        "rect": [
          7,
          55,
          15,
          64
        ]
      },
      {
        "id": "far-east-snowglass-tower",
        "kind": "tower-or-wing",
        "rect": [
          80,
          56,
          86,
          66
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          43,
          9,
          56,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          9,
          23,
          33,
          44
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          65,
          29,
          79,
          49
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          29,
          59,
          67,
          66
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          80,
          56,
          86,
          66
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "glacier-two-bastion-horseshoe-palace",
      91,
      12,
      76
    ],
    "profile": "glacier-two-bastion-horseshoe-palace"
  },
  {
    "id": "r4:embassy:desert:medium:01",
    "type": "embassy",
    "biome": "desert",
    "size": "medium",
    "variant": 1,
    "bounds": [
      62,
      12,
      54
    ],
    "wings": [
      [
        22,
        7,
        39,
        24
      ],
      [
        4,
        20,
        22,
        37
      ],
      [
        40,
        17,
        56,
        33
      ],
      [
        17,
        37,
        46,
        49
      ],
      [
        19,
        23,
        44,
        31
      ],
      [
        19,
        30,
        29,
        41
      ],
      [
        36,
        29,
        44,
        41
      ],
      [
        45,
        33,
        58,
        44
      ]
    ],
    "notches": [
      [
        30,
        34,
        34,
        37
      ]
    ],
    "octagons": [
      [
        49,
        38,
        6,
        9
      ]
    ],
    "skyline": [
      [
        27,
        11,
        34,
        17,
        10
      ],
      [
        48,
        36,
        53,
        41,
        9
      ]
    ],
    "entry": [
      31,
      7
    ],
    "porch": [
      28,
      3,
      34,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 22,
        "from": 23,
        "to": 29,
        "door": 26,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 40,
        "from": 23,
        "to": 30,
        "door": 27,
        "facing": "east"
      }
    ],
    "windows": [
      [
        26,
        7,
        "south"
      ],
      [
        36,
        7,
        "south"
      ],
      [
        4,
        27,
        "west"
      ],
      [
        56,
        24,
        "east"
      ],
      [
        32,
        49,
        "north"
      ],
      [
        58,
        40,
        "east"
      ]
    ],
    "fixtures": [
      [
        31,
        15
      ],
      [
        10,
        27
      ],
      [
        49,
        24
      ],
      [
        30,
        45
      ],
      [
        51,
        39
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "caravan-ambassadors-formal-court",
        "kind": "formal-chamber",
        "rect": [
          24,
          10,
          37,
          21
        ]
      },
      {
        "id": "western-guest-suite",
        "kind": "guest-area",
        "rect": [
          7,
          23,
          19,
          34
        ]
      },
      {
        "id": "eastern-translation-suite",
        "kind": "consular-office",
        "rect": [
          43,
          20,
          54,
          31
        ]
      },
      {
        "id": "northern-treaty-gallery",
        "kind": "treaty-archive",
        "rect": [
          20,
          40,
          43,
          48
        ]
      },
      {
        "id": "eastern-sand-rite-annex",
        "kind": "hospitality",
        "rect": [
          48,
          37,
          56,
          42
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          24,
          9,
          37,
          21
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          23,
          19,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          43,
          20,
          54,
          31
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          20,
          40,
          43,
          48
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "desert-oasis-consulate-faceted-oratory",
      62,
      12,
      54
    ],
    "profile": "desert-oasis-consulate-faceted-oratory"
  },
  {
    "id": "r4:embassy:enchanted-forest:small:01",
    "type": "embassy",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 1,
    "bounds": [
      54,
      12,
      49
    ],
    "wings": [
      [
        20,
        7,
        34,
        23
      ],
      [
        5,
        15,
        20,
        37
      ],
      [
        35,
        22,
        48,
        35
      ],
      [
        15,
        35,
        41,
        45
      ],
      [
        17,
        23,
        40,
        29
      ],
      [
        18,
        29,
        27,
        37
      ],
      [
        33,
        29,
        41,
        38
      ]
    ],
    "notches": [
      [
        26,
        32,
        29,
        35
      ]
    ],
    "octagons": [
      [
        12,
        29,
        7,
        10
      ]
    ],
    "skyline": [
      [
        24,
        12,
        29,
        17,
        10
      ],
      [
        40,
        29,
        44,
        33,
        9
      ]
    ],
    "entry": [
      27,
      7
    ],
    "porch": [
      24,
      3,
      30,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 20,
        "from": 23,
        "to": 28,
        "door": 26,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 35,
        "from": 23,
        "to": 29,
        "door": 26,
        "facing": "east"
      }
    ],
    "windows": [
      [
        23,
        7,
        "south"
      ],
      [
        31,
        7,
        "south"
      ],
      [
        5,
        22,
        "west"
      ],
      [
        48,
        27,
        "east"
      ],
      [
        27,
        45,
        "north"
      ]
    ],
    "fixtures": [
      [
        27,
        14
      ],
      [
        11,
        21
      ],
      [
        42,
        28
      ],
      [
        28,
        42
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "starlight-visiting-chancellery",
        "kind": "formal-chamber",
        "rect": [
          22,
          10,
          33,
          20
        ]
      },
      {
        "id": "moss-lantern-guest-lounge",
        "kind": "guest-area",
        "rect": [
          8,
          19,
          17,
          31
        ]
      },
      {
        "id": "starwood-interpreter-room",
        "kind": "consular-office",
        "rect": [
          38,
          25,
          46,
          33
        ]
      },
      {
        "id": "north-root-gift-registrar",
        "kind": "registry",
        "rect": [
          18,
          39,
          39,
          44
        ]
      },
      {
        "id": "enchanted-guest-sap-library",
        "kind": "hospitality",
        "rect": [
          19,
          31,
          25,
          36
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          22,
          9,
          33,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          19,
          17,
          31
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          38,
          25,
          46,
          33
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          18,
          39,
          39,
          44
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "enchanted-root-consulate-octagonal-leaf-porch",
      54,
      12,
      49
    ],
    "profile": "enchanted-root-consulate-octagonal-leaf-porch"
  },
  {
    "id": "r4:grand-archive:mountain:large:01",
    "type": "grand-archive",
    "biome": "mountain",
    "size": "large",
    "variant": 1,
    "bounds": [
      85,
      12,
      72
    ],
    "wings": [
      [
        34,
        7,
        51,
        24
      ],
      [
        5,
        18,
        34,
        47
      ],
      [
        52,
        22,
        75,
        45
      ],
      [
        24,
        52,
        65,
        64
      ],
      [
        24,
        24,
        64,
        32
      ],
      [
        23,
        31,
        36,
        54
      ],
      [
        50,
        31,
        63,
        53
      ],
      [
        35,
        33,
        52,
        48
      ],
      [
        3,
        42,
        21,
        62
      ],
      [
        72,
        42,
        81,
        61
      ]
    ],
    "notches": [
      [
        41,
        35,
        46,
        43
      ]
    ],
    "octagons": [
      [
        15,
        53,
        7,
        10
      ]
    ],
    "skyline": [
      [
        38,
        12,
        46,
        19,
        11
      ],
      [
        60,
        29,
        66,
        36,
        10
      ],
      [
        10,
        49,
        14,
        55,
        9
      ]
    ],
    "entry": [
      42,
      7
    ],
    "porch": [
      39,
      3,
      45,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 34,
        "from": 24,
        "to": 31,
        "door": 28,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 52,
        "from": 24,
        "to": 31,
        "door": 28,
        "facing": "east"
      }
    ],
    "windows": [
      [
        37,
        7,
        "south"
      ],
      [
        47,
        7,
        "south"
      ],
      [
        5,
        26,
        "west"
      ],
      [
        75,
        28,
        "east"
      ],
      [
        43,
        64,
        "north"
      ],
      [
        3,
        53,
        "west"
      ],
      [
        81,
        50,
        "east"
      ]
    ],
    "fixtures": [
      [
        42,
        14
      ],
      [
        13,
        27
      ],
      [
        66,
        30
      ],
      [
        43,
        59
      ],
      [
        12,
        53
      ],
      [
        77,
        51
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "summit-metal-scroll-vault",
        "kind": "records-vault",
        "rect": [
          36,
          10,
          49,
          21
        ]
      },
      {
        "id": "west-stone-reading-chamber",
        "kind": "consultation-room",
        "rect": [
          9,
          23,
          30,
          41
        ]
      },
      {
        "id": "east-cliff-index-laboratory",
        "kind": "cataloguing",
        "rect": [
          56,
          26,
          72,
          42
        ]
      },
      {
        "id": "north-astronomer-chronicles",
        "kind": "historic-ledger",
        "rect": [
          27,
          55,
          62,
          63
        ]
      },
      {
        "id": "far-west-sealed-cairn-records",
        "kind": "records-vault",
        "rect": [
          6,
          48,
          19,
          60
        ]
      },
      {
        "id": "east-cliff-fireproof-wing",
        "kind": "conservation",
        "rect": [
          74,
          47,
          80,
          58
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          36,
          9,
          49,
          21
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          9,
          23,
          30,
          41
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          56,
          26,
          72,
          42
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          27,
          55,
          62,
          63
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          6,
          48,
          19,
          60
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "mountain-cairn-archive-open-court-ridge-library",
      85,
      12,
      72
    ],
    "profile": "mountain-cairn-archive-open-court-ridge-library"
  },
  {
    "id": "r4:grand-archive:temperate:medium:01",
    "type": "grand-archive",
    "biome": "temperate",
    "size": "medium",
    "variant": 1,
    "bounds": [
      69,
      12,
      60
    ],
    "wings": [
      [
        25,
        7,
        43,
        24
      ],
      [
        5,
        19,
        24,
        40
      ],
      [
        45,
        16,
        62,
        38
      ],
      [
        18,
        44,
        51,
        53
      ],
      [
        20,
        24,
        52,
        32
      ],
      [
        18,
        31,
        30,
        46
      ],
      [
        40,
        31,
        50,
        46
      ],
      [
        30,
        32,
        41,
        44
      ],
      [
        3,
        36,
        14,
        53
      ]
    ],
    "notches": [
      [
        33,
        34,
        37,
        38
      ]
    ],
    "octagons": [
      [
        52,
        39,
        7,
        11
      ]
    ],
    "skyline": [
      [
        29,
        12,
        35,
        18,
        10
      ],
      [
        9,
        28,
        14,
        33,
        9
      ]
    ],
    "entry": [
      34,
      7
    ],
    "porch": [
      31,
      3,
      37,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 24,
        "from": 24,
        "to": 31,
        "door": 27,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 45,
        "from": 24,
        "to": 30,
        "door": 27,
        "facing": "east"
      }
    ],
    "windows": [
      [
        29,
        7,
        "south"
      ],
      [
        39,
        7,
        "south"
      ],
      [
        5,
        28,
        "west"
      ],
      [
        62,
        25,
        "east"
      ],
      [
        33,
        53,
        "north"
      ],
      [
        3,
        44,
        "west"
      ]
    ],
    "fixtures": [
      [
        34,
        14
      ],
      [
        12,
        27
      ],
      [
        54,
        26
      ],
      [
        33,
        50
      ],
      [
        10,
        46
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "capital-canal-ledger-vault",
        "kind": "records-vault",
        "rect": [
          27,
          10,
          41,
          21
        ]
      },
      {
        "id": "western-public-research-room",
        "kind": "consultation-room",
        "rect": [
          8,
          23,
          22,
          37
        ]
      },
      {
        "id": "east-watershed-data-annex",
        "kind": "cataloguing",
        "rect": [
          48,
          20,
          60,
          33
        ]
      },
      {
        "id": "north-charters-reading-gallery",
        "kind": "consultation-room",
        "rect": [
          21,
          47,
          49,
          52
        ]
      },
      {
        "id": "western-ferry-map-store",
        "kind": "records-vault",
        "rect": [
          5,
          41,
          12,
          51
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          27,
          9,
          41,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          23,
          22,
          37
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          48,
          20,
          60,
          33
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          21,
          47,
          49,
          52
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      }
    ],
    "signature": [
      "temperate-channel-record-vault-double-arc",
      69,
      12,
      60
    ],
    "profile": "temperate-channel-record-vault-double-arc"
  },
  {
    "id": "r4:observatory:snow:small:01",
    "type": "observatory",
    "biome": "snow",
    "size": "small",
    "variant": 1,
    "bounds": [
      55,
      12,
      56
    ],
    "wings": [
      [
        21,
        7,
        36,
        25
      ],
      [
        5,
        18,
        20,
        36
      ],
      [
        36,
        20,
        50,
        38
      ],
      [
        15,
        38,
        42,
        48
      ],
      [
        18,
        24,
        43,
        32
      ],
      [
        16,
        31,
        27,
        40
      ],
      [
        34,
        30,
        43,
        42
      ],
      [
        3,
        34,
        13,
        48
      ]
    ],
    "notches": [
      [
        27,
        33,
        31,
        36
      ]
    ],
    "octagons": [
      [
        42,
        30,
        7,
        11
      ]
    ],
    "skyline": [
      [
        25,
        13,
        32,
        20,
        11
      ],
      [
        41,
        30,
        45,
        34,
        10
      ]
    ],
    "entry": [
      28,
      7
    ],
    "porch": [
      25,
      3,
      31,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 20,
        "from": 24,
        "to": 30,
        "door": 27,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 36,
        "from": 24,
        "to": 30,
        "door": 27,
        "facing": "east"
      }
    ],
    "windows": [
      [
        23,
        7,
        "south"
      ],
      [
        33,
        7,
        "south"
      ],
      [
        5,
        26,
        "west"
      ],
      [
        50,
        27,
        "east"
      ],
      [
        29,
        48,
        "north"
      ],
      [
        3,
        41,
        "west"
      ]
    ],
    "fixtures": [
      [
        28,
        15
      ],
      [
        11,
        27
      ],
      [
        44,
        27
      ],
      [
        29,
        45
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "ice-lens-ground-deck",
        "kind": "observation-deck",
        "rect": [
          23,
          10,
          34,
          21
        ]
      },
      {
        "id": "west-sky-instrument-workshop",
        "kind": "instrument-room",
        "rect": [
          8,
          23,
          18,
          33
        ]
      },
      {
        "id": "east-winter-star-compass",
        "kind": "astronomy-chart-room",
        "rect": [
          39,
          24,
          48,
          35
        ]
      },
      {
        "id": "north-celestial-logbook",
        "kind": "records-vault",
        "rect": [
          18,
          42,
          40,
          47
        ]
      },
      {
        "id": "western-calibration-gearbox",
        "kind": "instrument-room",
        "rect": [
          5,
          38,
          11,
          46
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          23,
          9,
          34,
          21
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          8,
          23,
          18,
          33
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          39,
          24,
          48,
          35
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          18,
          42,
          40,
          47
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "snow-aurora-lens-dome-open-ground-deck",
      55,
      12,
      56
    ],
    "profile": "snow-aurora-lens-dome-open-ground-deck"
  },
  {
    "id": "r4:observatory:desert:large:01",
    "type": "observatory",
    "biome": "desert",
    "size": "large",
    "variant": 1,
    "bounds": [
      89,
      12,
      75
    ],
    "wings": [
      [
        37,
        7,
        56,
        26
      ],
      [
        5,
        19,
        35,
        47
      ],
      [
        58,
        17,
        80,
        48
      ],
      [
        24,
        53,
        67,
        66
      ],
      [
        25,
        25,
        67,
        34
      ],
      [
        22,
        33,
        39,
        55
      ],
      [
        52,
        33,
        66,
        55
      ],
      [
        38,
        34,
        53,
        51
      ],
      [
        4,
        45,
        20,
        64
      ],
      [
        76,
        45,
        87,
        67
      ]
    ],
    "notches": [
      [
        44,
        38,
        49,
        44
      ]
    ],
    "octagons": [
      [
        16,
        33,
        8,
        12
      ],
      [
        69,
        41,
        7,
        10
      ]
    ],
    "skyline": [
      [
        42,
        12,
        50,
        19,
        11
      ],
      [
        62,
        26,
        69,
        33,
        10
      ],
      [
        12,
        50,
        17,
        56,
        9
      ]
    ],
    "entry": [
      46,
      7
    ],
    "porch": [
      43,
      3,
      49,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 35,
        "from": 25,
        "to": 32,
        "door": 28,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 58,
        "from": 25,
        "to": 33,
        "door": 29,
        "facing": "east"
      }
    ],
    "windows": [
      [
        41,
        7,
        "south"
      ],
      [
        52,
        7,
        "south"
      ],
      [
        5,
        27,
        "west"
      ],
      [
        80,
        26,
        "east"
      ],
      [
        44,
        66,
        "north"
      ],
      [
        4,
        54,
        "west"
      ],
      [
        87,
        56,
        "east"
      ]
    ],
    "fixtures": [
      [
        46,
        15
      ],
      [
        14,
        27
      ],
      [
        70,
        27
      ],
      [
        44,
        61
      ],
      [
        12,
        54
      ],
      [
        82,
        55
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "solstice-meridian-ground-observation",
        "kind": "observation-deck",
        "rect": [
          39,
          10,
          54,
          23
        ]
      },
      {
        "id": "west-astrolabe-foundry",
        "kind": "instrument-room",
        "rect": [
          9,
          23,
          31,
          41
        ]
      },
      {
        "id": "eastern-light-shadow-tracing",
        "kind": "solar-lab",
        "rect": [
          62,
          22,
          77,
          44
        ]
      },
      {
        "id": "north-orbit-calendar-vault",
        "kind": "celestial-register",
        "rect": [
          27,
          57,
          64,
          65
        ]
      },
      {
        "id": "west-heatglass-disk-chamber",
        "kind": "instrument-room",
        "rect": [
          7,
          49,
          18,
          62
        ]
      },
      {
        "id": "outer-east-equinox-plates",
        "kind": "solar-lab",
        "rect": [
          78,
          49,
          86,
          64
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          39,
          9,
          54,
          23
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          9,
          23,
          31,
          41
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          62,
          22,
          77,
          44
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          27,
          57,
          64,
          65
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          78,
          49,
          86,
          64
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "desert-solstice-two-faceted-sundial-observatory",
      89,
      12,
      75
    ],
    "profile": "desert-solstice-two-faceted-sundial-observatory"
  }
,
{
  "id": "r4:castle-palace:temperate:large:03",
  "type": "castle-palace",
  "biome": "temperate",
  "size": "large",
  "variant": 3,
  "bounds": [
    96,
    14,
    82
  ],
  "wings": [
    [
      36,
      7,
      59,
      27
    ],
    [
      8,
      24,
      35,
      55
    ],
    [
      60,
      20,
      86,
      54
    ],
    [
      27,
      53,
      72,
      73
    ],
    [
      25,
      27,
      74,
      38
    ],
    [
      25,
      36,
      38,
      56
    ],
    [
      60,
      36,
      74,
      56
    ],
    [
      37,
      36,
      62,
      53
    ]
  ],
  "notches": [
    [
      44,
      42,
      51,
      47
    ]
  ],
  "octagons": [
    [
      15,
      49,
      8,
      11
    ],
    [
      80,
      46,
      7,
      10
    ]
  ],
  "skyline": [
    [
      43,
      12,
      51,
      19,
      12
    ],
    [
      12,
      32,
      18,
      38,
      11
    ],
    [
      75,
      28,
      80,
      34,
      10
    ]
  ],
  "entry": [
    47,
    7
  ],
  "porch": [
    44,
    3,
    50,
    6
  ],
  "partitions": [
    {
      "axis": "x",
      "fixed": 30,
      "from": 28,
      "to": 34,
      "door": 31,
      "facing": "west"
    }
  ],
  "windows": [
    [
      42,
      7,
      "south"
    ],
    [
      54,
      7,
      "south"
    ],
    [
      8,
      33,
      "west"
    ],
    [
      86,
      31,
      "east"
    ],
    [
      46,
      73,
      "north"
    ],
    [
      8,
      43,
      "west"
    ]
  ],
  "fixtures": [
    [
      47,
      16
    ],
    [
      17,
      32
    ],
    [
      74,
      30
    ],
    [
      46,
      65
    ],
    [
      32,
      32
    ],
    [
      66,
      43
    ]
  ],
  "ridges": [],
  "rooms": [
    {
      "id": "marble-river-oath-hall",
      "kind": "throne-hall",
      "rect": [
        39,
        11,
        56,
        23
      ]
    },
    {
      "id": "western-guard-court",
      "kind": "guard-gallery",
      "rect": [
        12,
        29,
        30,
        45
      ]
    },
    {
      "id": "eastern-treaty-chambers",
      "kind": "council",
      "rect": [
        65,
        25,
        81,
        43
      ]
    },
    {
      "id": "rear-royal-chancery",
      "kind": "state-archive",
      "rect": [
        32,
        58,
        67,
        69
      ]
    },
    {
      "id": "middle-envoy-crossing",
      "kind": "public-circulation",
      "rect": [
        41,
        29,
        56,
        34
      ]
    }
  ],
  "roofBands": [
    {
      "rect": [
        38,
        9,
        57,
        25
      ],
      "profile": "gable",
      "axis": "x",
      "high": 11,
      "period": 4
    },
    {
      "rect": [
        12,
        28,
        31,
        45
      ],
      "profile": "saw",
      "axis": "z",
      "high": 10,
      "period": 5
    },
    {
      "rect": [
        65,
        24,
        82,
        43
      ],
      "profile": "hip",
      "axis": "z",
      "high": 11,
      "period": 4
    },
    {
      "rect": [
        32,
        57,
        67,
        70
      ],
      "profile": "shed",
      "axis": "x",
      "high": 10,
      "period": 5
    }
  ],
  "signature": [
    "twin-faceted-outer-bastions-offset-river-palace",
    96,
    14,
    82
  ],
  "profile": "twin-faceted-outer-bastions-offset-river-palace"
},
{
  "id": "r4:embassy:mountain:medium:01",
  "type": "embassy",
  "biome": "mountain",
  "size": "medium",
  "variant": 1,
  "bounds": [
    71,
    13,
    60
  ],
  "wings": [
    [
      28,
      7,
      44,
      23
    ],
    [
      8,
      21,
      28,
      43
    ],
    [
      45,
      23,
      62,
      47
    ],
    [
      20,
      43,
      54,
      55
    ],
    [
      23,
      23,
      49,
      33
    ],
    [
      22,
      32,
      33,
      45
    ],
    [
      42,
      32,
      51,
      46
    ]
  ],
  "notches": [
    [
      35,
      36,
      39,
      39
    ]
  ],
  "octagons": [
    [
      58,
      42,
      6,
      9
    ]
  ],
  "skyline": [
    [
      33,
      11,
      39,
      16,
      11
    ],
    [
      55,
      31,
      60,
      35,
      10
    ]
  ],
  "entry": [
    36,
    7
  ],
  "porch": [
    33,
    3,
    39,
    6
  ],
  "partitions": [
    {
      "axis": "x",
      "fixed": 27,
      "from": 24,
      "to": 29,
      "door": 27,
      "facing": "west"
    }
  ],
  "windows": [
    [
      32,
      7,
      "south"
    ],
    [
      41,
      7,
      "south"
    ],
    [
      8,
      30,
      "west"
    ],
    [
      62,
      28,
      "east"
    ],
    [
      36,
      55,
      "north"
    ],
    [
      8,
      37,
      "west"
    ]
  ],
  "fixtures": [
    [
      36,
      16
    ],
    [
      13,
      31
    ],
    [
      53,
      29
    ],
    [
      35,
      50
    ],
    [
      47,
      40
    ]
  ],
  "ridges": [],
  "rooms": [
    {
      "id": "summit-safe-passage-chamber",
      "kind": "formal-reception",
      "rect": [
        30,
        10,
        42,
        20
      ]
    },
    {
      "id": "western-mountain-guest-court",
      "kind": "hospitality",
      "rect": [
        11,
        25,
        25,
        39
      ]
    },
    {
      "id": "eastern-diplomatic-cartography",
      "kind": "consular-office",
      "rect": [
        49,
        27,
        59,
        38
      ]
    },
    {
      "id": "upper-treaty-terrace-library",
      "kind": "treaty-archive",
      "rect": [
        25,
        46,
        49,
        53
      ]
    }
  ],
  "roofBands": [
    {
      "rect": [
        30,
        9,
        42,
        21
      ],
      "profile": "gable",
      "axis": "x",
      "high": 11,
      "period": 4
    },
    {
      "rect": [
        11,
        25,
        25,
        39
      ],
      "profile": "saw",
      "axis": "z",
      "high": 10,
      "period": 4
    },
    {
      "rect": [
        49,
        27,
        59,
        40
      ],
      "profile": "hip",
      "axis": "z",
      "high": 10,
      "period": 4
    },
    {
      "rect": [
        25,
        46,
        49,
        53
      ],
      "profile": "shed",
      "axis": "x",
      "high": 9,
      "period": 4
    }
  ],
  "signature": [
    "mountain-pass-switchback-consulate-butterfly-court",
    71,
    13,
    60
  ],
  "profile": "mountain-pass-switchback-consulate-butterfly-court"
},
{
  "id": "r4:grand-archive:snow:medium:01",
  "type": "grand-archive",
  "biome": "snow",
  "size": "medium",
  "variant": 1,
  "bounds": [
    78,
    13,
    65
  ],
  "wings": [
    [
      26,
      7,
      47,
      23
    ],
    [
      6,
      18,
      25,
      45
    ],
    [
      48,
      21,
      70,
      46
    ],
    [
      20,
      44,
      59,
      59
    ],
    [
      20,
      21,
      53,
      34
    ],
    [
      21,
      33,
      33,
      47
    ],
    [
      46,
      33,
      58,
      48
    ]
  ],
  "notches": [
    [
      37,
      38,
      42,
      41
    ]
  ],
  "octagons": [
    [
      13,
      39,
      6,
      9
    ]
  ],
  "skyline": [
    [
      32,
      11,
      39,
      16,
      11
    ],
    [
      63,
      29,
      67,
      33,
      10
    ]
  ],
  "entry": [
    36,
    7
  ],
  "porch": [
    33,
    3,
    39,
    6
  ],
  "partitions": [
    {
      "axis": "x",
      "fixed": 24,
      "from": 24,
      "to": 30,
      "door": 27,
      "facing": "west"
    }
  ],
  "windows": [
    [
      30,
      7,
      "south"
    ],
    [
      43,
      7,
      "south"
    ],
    [
      6,
      28,
      "west"
    ],
    [
      70,
      30,
      "east"
    ],
    [
      39,
      59,
      "north"
    ],
    [
      6,
      35,
      "west"
    ]
  ],
  "fixtures": [
    [
      36,
      16
    ],
    [
      14,
      29
    ],
    [
      61,
      32
    ],
    [
      36,
      53
    ],
    [
      49,
      40
    ]
  ],
  "ridges": [],
  "rooms": [
    {
      "id": "frostbound-public-index",
      "kind": "reading-room",
      "rect": [
        29,
        10,
        44,
        21
      ]
    },
    {
      "id": "west-sealed-scroll-vault",
      "kind": "preservation-vault",
      "rect": [
        9,
        23,
        23,
        39
      ]
    },
    {
      "id": "east-northern-map-scriptorium",
      "kind": "cartography",
      "rect": [
        52,
        25,
        66,
        42
      ]
    },
    {
      "id": "rear-aurora-memory-hall",
      "kind": "great-archive",
      "rect": [
        25,
        49,
        54,
        56
      ]
    }
  ],
  "roofBands": [
    {
      "rect": [
        29,
        9,
        44,
        21
      ],
      "profile": "hip",
      "axis": "x",
      "high": 11,
      "period": 4
    },
    {
      "rect": [
        9,
        23,
        23,
        39
      ],
      "profile": "saw",
      "axis": "z",
      "high": 10,
      "period": 5
    },
    {
      "rect": [
        52,
        25,
        66,
        42
      ],
      "profile": "gable",
      "axis": "z",
      "high": 10,
      "period": 4
    },
    {
      "rect": [
        25,
        49,
        54,
        56
      ],
      "profile": "shed",
      "axis": "x",
      "high": 9,
      "period": 5
    }
  ],
  "signature": [
    "snow-horseshoe-memory-vault-faceted-index-wing",
    78,
    13,
    65
  ],
  "profile": "snow-horseshoe-memory-vault-faceted-index-wing"
}
];
const VALID_IDS=new Set(PLANS.map(p=>p.id));
function author(spec){
 const [width,height,depth]=spec.bounds;
 const ground=new Set();
 const within=(r,x,z)=>pointIn(r,x,z);
 for(let z=0;z<depth;z++)for(let x=0;x<width;x++){
  const regular=spec.wings.some(r=>within(r,x,z));
  const faceted=(spec.octagons??[]).some(([cx,cz,radius,diagonal])=>
   Math.abs(x-cx)<=radius&&Math.abs(z-cz)<=radius&&Math.abs(x-cx)+Math.abs(z-cz)<=diagonal);
  if((regular||faceted||(spec.bridge&&within(spec.bridge,x,z)))&&
     !spec.notches.some(r=>within(r,x,z)))ground.add(tile(x,z));
 }
 const occupied=new Map(),openings=[];
 const has=(x,z)=>ground.has(tile(x,z));
 function set(x,y,z,role,asset='base:stone',facing='north',replace=false){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=width||y<0||y>=height||z<0||z>=depth)
   throw Error('Invalid authored '+spec.id+' coordinate '+cell(x,y,z));
  const k=cell(x,y,z);
  if(occupied.has(k)&&!replace)throw Error('M2 overlapping occupied source cell '+spec.id+' '+k);
  occupied.set(k,{at:[x,y,z],role,asset,facing});
 }
 const erase=(x,y,z)=>occupied.delete(cell(x,y,z));
 const baseMaterial=spec.type==='guildhall'?'base:wood':'base:stone';
 const regionalRoof=ROOF[spec.biome];
 for(const key of ground){
  const [x,z]=key.split(',').map(Number);
  set(x,0,z,'floor',baseMaterial);
  set(x,5,z,'roof',regionalRoof);
  const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dz])=>!has(x+dx,z+dz));
  if(edge)for(let y=1;y<=4;y++)set(x,y,z,'wall',spec.type==='guildhall'?'base:wood':'pack1:002');
 }
 // Distinct, reserved exterior approach: no duplicate wing/porch occupation.
 const [left,front,right,back]=spec.porch;
 for(let z=front;z<=back;z++)for(let x=left;x<=right;x++){
  if(has(x,z))throw Error('Authored porch intersects existing building '+spec.id+' '+tile(x,z));
  set(x,0,z,'floor','base:stone');
  set(x,5,z,'roof',regionalRoof);
  if(x===left||x===right||z===front||z===back)set(x,4,z,'beam','base:wood');
 }
 for(const x of [left,right])for(const z of [front,back])
  for(let y=1;y<=3;y++)set(x,y,z,'column','base:wood');
 // Face-integral purlin lattice: open 2-high rooms, all normal roof tiles
 // within at most 1 orthogonal step of an actual timber beam / wall below.
 for(const key of ground){
  const [x,z]=key.split(',').map(Number);
  if(!occupied.has(cell(x,4,z))&&(x%3===0||z%3===0))set(x,4,z,'beam','base:wood');
 }
 for(const [x0,z0,x1,z1] of spec.ridges)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
  if(!has(x,z))throw Error('Raised authored regional ridge extends outside floor '+spec.id+' '+tile(x,z));
  if(occupied.get(cell(x,5,z))?.role!=='roof')throw Error('Raised ridge missing base roof');
  set(x,5,z,'beam','base:wood','north',true);
  if(!occupied.has(cell(x,4,z)))set(x,4,z,'beam','base:wood');
  set(x,6,z,'roof',regionalRoof);
 }

 // Explicit, source-authored raised architectural roof lanterns, smoke cupolas
 // and regional roof terraces. These are inaccessible upper roof forms only:
 // no invented public stair route or claim of a new habitable story.
 for(const [x0,z0,x1,z1,top] of spec.skyline){
  if(top<8||top>=height)throw Error('Roof skyline rises outside 4A owned plan '+spec.id);
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!has(x,z))throw Error('Source roof feature unsupported outside occupied footprint '+spec.id+' '+tile(x,z));
   const at5=occupied.get(cell(x,5,z));
   if(!at5||!['roof','beam'].includes(at5.role))
    throw Error('Roof lantern incorrectly shares wall or fixture '+spec.id+' '+cell(x,5,z));
   set(x,5,z,'beam','base:wood','north',true);
   // Piers rise from real timber roof base; each intermediate cross-beam
   // rests on its pier/lower beam. Visible lancet gaps remain between piers.
   for(let y=6;y<top;y++){
    const existing=occupied.get(cell(x,y,z));
    const piers=(x-x0)%2===0&&(z-z0)%2===0;
    if(y===top-1){
     set(x,y,z,'beam','base:wood','north',!!existing);
    }else if(piers){
     set(x,y,z,'column','base:wood','north',!!existing);
    }else if(existing?.role==='roof'){
     // Prevent trapped solid roofs inside the raised turret volume.
     occupied.delete(cell(x,y,z));
    }
   }
   set(x,top,z,'roof',regionalRoof);
  }
 }


 // ROOF PROFILE ASSEMBLY. Each source band is coordinate-authored; the height
 // cross-section is a true stepped gable, hip, shed or sawtooth. Beneath each
 // raised roofing face is explicit load-bearing timber and intermediate piers;
 // no new occupied/public upper storey is inferred from this geometry.
 const roofProfileTiles=new Set();
 const sourceRoofProfiles=[];
 for(const band of spec.roofBands){
  const [x0,z0,x1,z1]=band.rect;
  const accepted=[];
  for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){
   if(!has(x,z)||roofProfileTiles.has(tile(x,z)))continue;
   // Skyline lanterns reserve their own beam-backed roof footprint; prevent
   // lower roof profiles from being layered beneath elevated lantern caps.
   if(spec.skyline.some(([sx0,sz0,sx1,sz1])=>x>=sx0&&x<=sx1&&z>=sz0&&z<=sz1))continue;
   roofProfileTiles.add(tile(x,z));
   const transverse=band.axis==='x' ? Math.min(z-z0,z1-z):Math.min(x-x0,x1-x);
   const breadth=Math.min(x-x0,x1-x,z-z0,z1-z);
   const forward=band.axis==='x' ? z-z0 : x-x0;
   let rise;
   if(band.profile==='gable')rise=Math.min(band.high-5,1+Math.floor(transverse/2));
   else if(band.profile==='hip')rise=Math.min(band.high-5,1+Math.floor(breadth/2));
   else if(band.profile==='shed')rise=Math.min(band.high-5,1+Math.floor(forward/Math.max(2,band.period)));
   else if(band.profile==='saw')rise=Math.min(band.high-5,1+Math.floor((forward%Math.max(4,band.period))/2));
   else throw Error('Unrecognized authored regional pitched roof profile '+spec.id);
   if(rise<=0)continue;
   const top=5+rise;
   if(occupied.get(cell(x,5,z))?.role!=='roof'&&occupied.get(cell(x,5,z))?.role!=='beam')
     throw Error('Roof slope not supported on authored structure '+spec.id+' '+tile(x,z));
   set(x,5,z,'beam','base:wood','north',true);
   // Raised ridges may already have one roof tile at 6. Replace it with
   // the correct stepped roof or its engineered bearing pier.
   for(let y=6;y<top;y++){
    const existing=occupied.get(cell(x,y,z));
    if(y===top-1){
     set(x,y,z,'beam','base:wood','north',!!existing);
    }else if((x+z)%3===0){
     set(x,y,z,'column','base:wood','north',!!existing);
    }else if(existing?.role==='roof'){
     occupied.delete(cell(x,y,z));
    }
   }
   set(x,top,z,'roof',regionalRoof,band.axis==='x'?'east':'north',
       occupied.has(cell(x,top,z)));
   accepted.push([x,z,top]);
  }
  if(accepted.length<12)throw Error('Under-authored roof silhouette '+spec.id+' '+band.profile);
  sourceRoofProfiles.push({profile:band.profile,axis:band.axis,designRect:band.rect,
     high:band.high,period:band.period,count:accepted.length});
 }

 for(const wall of spec.partitions){
  for(let i=wall.from;i<=wall.to;i++){
   const x=wall.axis==='x'?wall.fixed:i,z=wall.axis==='z'?wall.fixed:i;
   if(!has(x,z))throw Error('Source partition outside occupancy '+spec.id+' '+tile(x,z));
   const edge=occupied.get(cell(x,1,z));
   if(edge)throw Error('Source partition overlaps external masonry '+spec.id+' '+tile(x,z));
   if(i===wall.door){set(x,3,z,'beam','base:wood');continue;}
   for(let y=1;y<=3;y++)set(x,y,z,'partition',spec.type==='guildhall'?'base:wood':'pack1:002',wall.facing);
  }
  openings.push({at:wall.axis==='x'?[wall.fixed,1,wall.door]:[wall.door,1,wall.fixed],
    kind:'door',facing:wall.facing});
 }
 const [entryX,entryZ]=spec.entry;
 if(entryZ!==back+1)throw Error('Portico does not directly connect to actual entrance');
 for(let x=entryX-1;x<=entryX+1;x++)for(let y=1;y<=2;y++){
  if(occupied.get(cell(x,y,entryZ))?.role!=='wall')
   throw Error('Formal entry does not pierce a real exterior wall '+spec.id+' '+tile(x,entryZ));
  erase(x,y,entryZ);
 }
 openings.push({at:[entryX,1,entryZ],kind:'entrance',facing:'south'});
 for(const [x,z,facing] of spec.windows){
  if(occupied.get(cell(x,2,z))?.role!=='wall')
   throw Error('Window not in exterior load-bearing wall '+spec.id+' '+tile(x,z));
  set(x,2,z,'window','pack4:030',facing,true);
  openings.push({at:[x,2,z],kind:'window',facing});
 }
 for(const [x,z] of spec.fixtures){
  if(!has(x,z)||occupied.has(cell(x,1,z)))throw Error('Authored fixture lacks usable floor '+spec.id+' '+tile(x,z));
  set(x,1,z,'fixture','pack2:015');
 }
 const navigation=new Map();
 for(const c of occupied.values())if(c.role==='floor'&&c.at[1]===0){
  const [x,,z]=c.at;
  if(!occupied.has(cell(x,1,z))&&!occupied.has(cell(x,2,z)))
   navigation.set(cell(x,1,z),{at:[x,1,z],mode:'walk'});
 }
 const spaces=[];const seenSpaceTiles=new Set();
 for(const r of spec.rooms){
  const floor=[...navigation.values()].filter(n=>within(r.rect,n.at[0],n.at[2])).map(n=>[n.at[0],n.at[2]]);
  if(floor.length<12)throw Error('Under-authored room '+spec.id+' '+r.id);
  const present=new Set(floor.map(([x,z])=>tile(x,z))),visited=new Set([tile(...floor[0])]),q=[floor[0]];
  for(let i=0;i<q.length;i++){
   const [x,z]=q[i];
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const k=tile(x+dx,z+dz);
    if(present.has(k)&&!visited.has(k)){visited.add(k);q.push([x+dx,z+dz]);}
   }
  }
  if(visited.size!==present.size)throw Error('Authored room has disconnected floor islands '+spec.id+' '+r.id);
  for(const point of floor){
   const k=tile(...point);
   if(seenSpaceTiles.has(k))throw Error('Two authored public rooms overlap '+spec.id+' '+k);
   seenSpaceTiles.add(k);
  }
  const [accessX,accessZ]=floor[Math.floor(floor.length/2)];
  spaces.push({id:r.id,kind:r.kind,level:1,access:[accessX,1,accessZ],footprint:floor});
 }
 const cells=[...occupied.values()];
 const references=[...new Set(cells.map(c=>c.asset).filter(s=>s.startsWith('pack')))].sort();
 const dependencies=references.map(ref=>{
  if(!FAMILY[ref])throw Error('Unknown material family '+ref);
  return {ref,...FAMILY[ref]};
 });
 const result={schema:SCHEMA,id:spec.id,type:spec.type,biome:spec.biome,size:spec.size,
  variant:spec.variant,bounds:spec.bounds,cells,navigation:[...navigation.values()],spaces,openings,dependencies,
  architecturalNotes:{style:spec.profile,storyCount:1,structuralSignature:spec.signature,
   roof:'source-authored gable/hip/shed/sawtooth stepped roof cross-sections on real beam/pier cells; exact partial-family joints remain unverified',
   roofProfiles:sourceRoofProfiles,
   skyline:spec.skyline,
   circulation:'source occupied-cell navigation graph, not path tags',
   creatorAccepted:false,liveIntegrated:false,worldPlacement:false,physicalIphoneTested:false}
 };
 validateBlueprint(result);
 return result;
}
export function buildM3StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM3StateKnowledge(){return PLANS.map(author);}
export const M3_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
