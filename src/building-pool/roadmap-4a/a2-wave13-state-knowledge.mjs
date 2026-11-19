// Roadmap A2 Wave13: seven independently specified crescent, lattice, ridge and astral hall programs.
// The 308 accepted historical records remain in protected older modules.
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
    "id": "r4:embassy:enchanted-forest:large:02",
    "type": "embassy",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 2,
    "bounds": [
      177,
      22,
      203
    ],
    "wings": [
      [
        82,
        7,
        94,
        193
      ],
      [
        77,
        11,
        99,
        30
      ],
      [
        8,
        28,
        27,
        73
      ],
      [
        145,
        59,
        168,
        115
      ],
      [
        8,
        110,
        29,
        134
      ],
      [
        144,
        120,
        168,
        167
      ],
      [
        27,
        48,
        83,
        52
      ],
      [
        93,
        85,
        145,
        89
      ],
      [
        29,
        120,
        83,
        124
      ],
      [
        93,
        141,
        144,
        145
      ]
    ],
    "notches": [],
    "octagons": [],
    "skyline": [
      [
        15,
        48,
        19,
        52,
        12
      ],
      [
        154,
        85,
        158,
        89,
        13
      ],
      [
        16,
        120,
        20,
        124,
        14
      ],
      [
        154,
        141,
        158,
        145,
        15
      ]
    ],
    "entry": [
      88,
      7
    ],
    "porch": [
      84,
      3,
      92,
      6
    ],
    "partitions": [],
    "windows": [
      [
        79,
        11,
        "south"
      ],
      [
        97,
        11,
        "south"
      ],
      [
        8,
        35,
        "west"
      ],
      [
        168,
        66,
        "east"
      ],
      [
        8,
        117,
        "west"
      ],
      [
        168,
        127,
        "east"
      ]
    ],
    "fixtures": [
      [
        88,
        20
      ],
      [
        17,
        50
      ],
      [
        156,
        87
      ],
      [
        18,
        122
      ],
      [
        156,
        143
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave13-1-treaty-hall",
        "kind": "treaty-hall",
        "rect": [
          80,
          14,
          96,
          27
        ]
      },
      {
        "id": "wave13-1-consular-library",
        "kind": "consular-library",
        "rect": [
          11,
          31,
          24,
          70
        ]
      },
      {
        "id": "wave13-1-ambassadorial-suite",
        "kind": "ambassadorial-suite",
        "rect": [
          148,
          62,
          165,
          112
        ]
      },
      {
        "id": "wave13-1-arbitration-chamber",
        "kind": "arbitration-chamber",
        "rect": [
          11,
          113,
          26,
          131
        ]
      },
      {
        "id": "wave13-1-guest-lodge",
        "kind": "guest-lodge",
        "rect": [
          147,
          123,
          165,
          164
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          78,
          12,
          98,
          29
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          9,
          29,
          26,
          72
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          146,
          60,
          167,
          114
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          9,
          111,
          28,
          133
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          145,
          121,
          167,
          166
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "wave13",
      "Moonbough Treaty Crescent",
      177,
      203,
      28,
      73,
      37,
      134,
      59,
      115,
      120,
      167,
      3100
    ],
    "profile": "wave13-moonbough-treaty-crescent",
    "sourceAuthoredName": "Moonbough Treaty Crescent"
  },
  {
    "id": "r4:grand-archive:enchanted-forest:medium:03",
    "type": "grand-archive",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 3,
    "bounds": [
      139,
      22,
      177
    ],
    "wings": [
      [
        60,
        7,
        72,
        167
      ],
      [
        55,
        11,
        77,
        30
      ],
      [
        8,
        22,
        28,
        58
      ],
      [
        106,
        78,
        130,
        111
      ],
      [
        8,
        81,
        30,
        121
      ],
      [
        105,
        116,
        130,
        145
      ],
      [
        28,
        38,
        61,
        42
      ],
      [
        71,
        92,
        106,
        96
      ],
      [
        30,
        99,
        61,
        103
      ],
      [
        71,
        128,
        105,
        132
      ]
    ],
    "notches": [],
    "octagons": [],
    "skyline": [
      [
        16,
        38,
        20,
        42,
        13
      ],
      [
        116,
        92,
        120,
        96,
        14
      ],
      [
        17,
        99,
        21,
        103,
        15
      ],
      [
        115,
        128,
        119,
        132,
        16
      ]
    ],
    "entry": [
      66,
      7
    ],
    "porch": [
      62,
      3,
      70,
      6
    ],
    "partitions": [],
    "windows": [
      [
        57,
        11,
        "south"
      ],
      [
        75,
        11,
        "south"
      ],
      [
        8,
        29,
        "west"
      ],
      [
        130,
        85,
        "east"
      ],
      [
        8,
        88,
        "west"
      ],
      [
        130,
        123,
        "east"
      ]
    ],
    "fixtures": [
      [
        66,
        20
      ],
      [
        18,
        40
      ],
      [
        118,
        94
      ],
      [
        19,
        101
      ],
      [
        117,
        130
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave13-2-reading-hall",
        "kind": "reading-hall",
        "rect": [
          58,
          14,
          74,
          27
        ]
      },
      {
        "id": "wave13-2-vaulted-catalogue",
        "kind": "vaulted-catalogue",
        "rect": [
          11,
          25,
          25,
          55
        ]
      },
      {
        "id": "wave13-2-illuminated-manuscripts",
        "kind": "illuminated-manuscripts",
        "rect": [
          109,
          81,
          127,
          108
        ]
      },
      {
        "id": "wave13-2-conservators-workshop",
        "kind": "conservators-workshop",
        "rect": [
          11,
          84,
          27,
          118
        ]
      },
      {
        "id": "wave13-2-sealed-records",
        "kind": "sealed-records",
        "rect": [
          108,
          119,
          127,
          142
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          56,
          12,
          76,
          29
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          9,
          23,
          27,
          57
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          107,
          79,
          129,
          110
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          9,
          82,
          29,
          120
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          106,
          117,
          129,
          144
        ],
        "profile": "gable",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "wave13",
      "Whisperroot Five-Stair Archive",
      139,
      177,
      22,
      58,
      23,
      121,
      78,
      111,
      116,
      145,
      3101
    ],
    "profile": "wave13-whisperroot-five-stair-archive",
    "sourceAuthoredName": "Whisperroot Five-Stair Archive"
  },
  {
    "id": "r4:grand-archive:mountain:medium:01",
    "type": "grand-archive",
    "biome": "mountain",
    "size": "medium",
    "variant": 1,
    "bounds": [
      145,
      22,
      163
    ],
    "wings": [
      [
        62,
        7,
        74,
        153
      ],
      [
        57,
        11,
        79,
        30
      ],
      [
        8,
        34,
        29,
        85
      ],
      [
        111,
        64,
        136,
        104
      ],
      [
        8,
        95,
        31,
        112
      ],
      [
        112,
        103,
        136,
        138
      ],
      [
        29,
        57,
        63,
        61
      ],
      [
        73,
        82,
        111,
        86
      ],
      [
        31,
        101,
        63,
        105
      ],
      [
        73,
        118,
        112,
        122
      ]
    ],
    "notches": [],
    "octagons": [],
    "skyline": [
      [
        16,
        57,
        20,
        61,
        14
      ],
      [
        121,
        82,
        125,
        86,
        15
      ],
      [
        17,
        101,
        21,
        105,
        16
      ],
      [
        122,
        118,
        126,
        122,
        12
      ]
    ],
    "entry": [
      68,
      7
    ],
    "porch": [
      64,
      3,
      72,
      6
    ],
    "partitions": [],
    "windows": [
      [
        59,
        11,
        "south"
      ],
      [
        77,
        11,
        "south"
      ],
      [
        8,
        41,
        "west"
      ],
      [
        136,
        71,
        "east"
      ],
      [
        8,
        102,
        "west"
      ],
      [
        136,
        110,
        "east"
      ]
    ],
    "fixtures": [
      [
        68,
        20
      ],
      [
        18,
        59
      ],
      [
        123,
        84
      ],
      [
        19,
        103
      ],
      [
        124,
        120
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave13-3-reading-hall",
        "kind": "reading-hall",
        "rect": [
          60,
          14,
          76,
          27
        ]
      },
      {
        "id": "wave13-3-vaulted-catalogue",
        "kind": "vaulted-catalogue",
        "rect": [
          11,
          37,
          26,
          82
        ]
      },
      {
        "id": "wave13-3-illuminated-manuscripts",
        "kind": "illuminated-manuscripts",
        "rect": [
          114,
          67,
          133,
          101
        ]
      },
      {
        "id": "wave13-3-conservators-workshop",
        "kind": "conservators-workshop",
        "rect": [
          11,
          98,
          28,
          109
        ]
      },
      {
        "id": "wave13-3-sealed-records",
        "kind": "sealed-records",
        "rect": [
          115,
          106,
          133,
          135
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          58,
          12,
          78,
          29
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          9,
          35,
          28,
          84
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          112,
          65,
          135,
          103
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          9,
          96,
          30,
          111
        ],
        "profile": "gable",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          113,
          104,
          135,
          137
        ],
        "profile": "hip",
        "axis": "z",
        "high": 14,
        "period": 6
      }
    ],
    "signature": [
      "wave13",
      "Stoneglass Ridge Archive",
      145,
      163,
      34,
      85,
      10,
      112,
      64,
      104,
      103,
      138,
      3102
    ],
    "profile": "wave13-stoneglass-ridge-archive",
    "sourceAuthoredName": "Stoneglass Ridge Archive"
  },
  {
    "id": "r4:observatory:desert:small:02",
    "type": "observatory",
    "biome": "desert",
    "size": "small",
    "variant": 2,
    "bounds": [
      113,
      22,
      141
    ],
    "wings": [
      [
        45,
        7,
        57,
        131
      ],
      [
        40,
        11,
        62,
        30
      ],
      [
        8,
        24,
        27,
        65
      ],
      [
        78,
        50,
        104,
        86
      ],
      [
        8,
        70,
        29,
        92
      ],
      [
        79,
        88,
        104,
        113
      ],
      [
        27,
        42,
        46,
        46
      ],
      [
        56,
        66,
        78,
        70
      ],
      [
        29,
        79,
        46,
        83
      ],
      [
        56,
        98,
        79,
        102
      ]
    ],
    "notches": [],
    "octagons": [],
    "skyline": [
      [
        15,
        42,
        19,
        46,
        15
      ],
      [
        89,
        66,
        93,
        70,
        16
      ],
      [
        16,
        79,
        20,
        83,
        12
      ],
      [
        89,
        98,
        93,
        102,
        13
      ]
    ],
    "entry": [
      51,
      7
    ],
    "porch": [
      47,
      3,
      55,
      6
    ],
    "partitions": [],
    "windows": [
      [
        42,
        11,
        "south"
      ],
      [
        60,
        11,
        "south"
      ],
      [
        8,
        31,
        "west"
      ],
      [
        104,
        57,
        "east"
      ],
      [
        8,
        77,
        "west"
      ],
      [
        104,
        95,
        "east"
      ]
    ],
    "fixtures": [
      [
        51,
        20
      ],
      [
        17,
        44
      ],
      [
        91,
        68
      ],
      [
        18,
        81
      ],
      [
        91,
        100
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave13-4-lens-gallery",
        "kind": "lens-gallery",
        "rect": [
          43,
          14,
          59,
          27
        ]
      },
      {
        "id": "wave13-4-star-chart-library",
        "kind": "star-chart-library",
        "rect": [
          11,
          27,
          24,
          62
        ]
      },
      {
        "id": "wave13-4-orbital-calibration",
        "kind": "orbital-calibration",
        "rect": [
          81,
          53,
          101,
          83
        ]
      },
      {
        "id": "wave13-4-astral-observation",
        "kind": "astral-observation",
        "rect": [
          11,
          73,
          26,
          89
        ]
      },
      {
        "id": "wave13-4-instrument-workshop",
        "kind": "instrument-workshop",
        "rect": [
          82,
          91,
          101,
          110
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          41,
          12,
          61,
          29
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          9,
          25,
          26,
          64
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          79,
          51,
          103,
          85
        ],
        "profile": "gable",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          9,
          71,
          28,
          91
        ],
        "profile": "hip",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          80,
          89,
          103,
          112
        ],
        "profile": "shed",
        "axis": "x",
        "high": 15,
        "period": 7
      }
    ],
    "signature": [
      "wave13",
      "Sunneedle Meridian Observatory",
      113,
      141,
      24,
      65,
      5,
      92,
      50,
      86,
      88,
      113,
      3103
    ],
    "profile": "wave13-sunneedle-meridian-observatory",
    "sourceAuthoredName": "Sunneedle Meridian Observatory"
  },
  {
    "id": "r4:observatory:enchanted-forest:small:02",
    "type": "observatory",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 2,
    "bounds": [
      109,
      22,
      149
    ],
    "wings": [
      [
        45,
        7,
        57,
        139
      ],
      [
        40,
        11,
        62,
        30
      ],
      [
        8,
        30,
        28,
        69
      ],
      [
        77,
        57,
        100,
        92
      ],
      [
        8,
        92,
        30,
        106
      ],
      [
        76,
        95,
        100,
        120
      ],
      [
        28,
        47,
        46,
        51
      ],
      [
        56,
        72,
        77,
        76
      ],
      [
        30,
        97,
        46,
        101
      ],
      [
        56,
        105,
        76,
        109
      ]
    ],
    "notches": [],
    "octagons": [],
    "skyline": [
      [
        16,
        47,
        20,
        51,
        16
      ],
      [
        86,
        72,
        90,
        76,
        12
      ],
      [
        17,
        97,
        21,
        101,
        13
      ],
      [
        86,
        105,
        90,
        109,
        14
      ]
    ],
    "entry": [
      51,
      7
    ],
    "porch": [
      47,
      3,
      55,
      6
    ],
    "partitions": [],
    "windows": [
      [
        42,
        11,
        "south"
      ],
      [
        60,
        11,
        "south"
      ],
      [
        8,
        37,
        "west"
      ],
      [
        100,
        64,
        "east"
      ],
      [
        8,
        99,
        "west"
      ],
      [
        100,
        102,
        "east"
      ]
    ],
    "fixtures": [
      [
        51,
        20
      ],
      [
        18,
        49
      ],
      [
        88,
        74
      ],
      [
        19,
        99
      ],
      [
        88,
        107
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave13-5-lens-gallery",
        "kind": "lens-gallery",
        "rect": [
          43,
          14,
          59,
          27
        ]
      },
      {
        "id": "wave13-5-star-chart-library",
        "kind": "star-chart-library",
        "rect": [
          11,
          33,
          25,
          66
        ]
      },
      {
        "id": "wave13-5-orbital-calibration",
        "kind": "orbital-calibration",
        "rect": [
          80,
          60,
          97,
          89
        ]
      },
      {
        "id": "wave13-5-astral-observation",
        "kind": "astral-observation",
        "rect": [
          11,
          95,
          27,
          103
        ]
      },
      {
        "id": "wave13-5-instrument-workshop",
        "kind": "instrument-workshop",
        "rect": [
          79,
          98,
          97,
          117
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          41,
          12,
          61,
          29
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          9,
          31,
          27,
          68
        ],
        "profile": "gable",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          78,
          58,
          99,
          91
        ],
        "profile": "hip",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          9,
          93,
          29,
          105
        ],
        "profile": "shed",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          77,
          96,
          99,
          119
        ],
        "profile": "saw",
        "axis": "z",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "wave13",
      "Evershade Moonwell Observatory",
      109,
      149,
      30,
      69,
      23,
      106,
      57,
      92,
      95,
      120,
      3104
    ],
    "profile": "wave13-evershade-moonwell-observatory",
    "sourceAuthoredName": "Evershade Moonwell Observatory"
  },
  {
    "id": "r4:observatory:enchanted-forest:large:01",
    "type": "observatory",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 1,
    "bounds": [
      181,
      22,
      207
    ],
    "wings": [
      [
        82,
        7,
        94,
        197
      ],
      [
        77,
        11,
        99,
        30
      ],
      [
        8,
        39,
        29,
        85
      ],
      [
        148,
        87,
        172,
        129
      ],
      [
        8,
        127,
        31,
        150
      ],
      [
        147,
        132,
        172,
        170
      ],
      [
        29,
        60,
        83,
        64
      ],
      [
        93,
        106,
        148,
        110
      ],
      [
        31,
        136,
        83,
        140
      ],
      [
        93,
        149,
        147,
        153
      ]
    ],
    "notches": [],
    "octagons": [],
    "skyline": [
      [
        16,
        60,
        20,
        64,
        12
      ],
      [
        158,
        106,
        162,
        110,
        13
      ],
      [
        17,
        136,
        21,
        140,
        14
      ],
      [
        157,
        149,
        161,
        153,
        15
      ]
    ],
    "entry": [
      88,
      7
    ],
    "porch": [
      84,
      3,
      92,
      6
    ],
    "partitions": [],
    "windows": [
      [
        79,
        11,
        "south"
      ],
      [
        97,
        11,
        "south"
      ],
      [
        8,
        46,
        "west"
      ],
      [
        172,
        94,
        "east"
      ],
      [
        8,
        134,
        "west"
      ],
      [
        172,
        139,
        "east"
      ]
    ],
    "fixtures": [
      [
        88,
        20
      ],
      [
        18,
        62
      ],
      [
        160,
        108
      ],
      [
        19,
        138
      ],
      [
        159,
        151
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave13-6-lens-gallery",
        "kind": "lens-gallery",
        "rect": [
          80,
          14,
          96,
          27
        ]
      },
      {
        "id": "wave13-6-star-chart-library",
        "kind": "star-chart-library",
        "rect": [
          11,
          42,
          26,
          82
        ]
      },
      {
        "id": "wave13-6-orbital-calibration",
        "kind": "orbital-calibration",
        "rect": [
          151,
          90,
          169,
          126
        ]
      },
      {
        "id": "wave13-6-astral-observation",
        "kind": "astral-observation",
        "rect": [
          11,
          130,
          28,
          147
        ]
      },
      {
        "id": "wave13-6-instrument-workshop",
        "kind": "instrument-workshop",
        "rect": [
          150,
          135,
          169,
          167
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          78,
          12,
          98,
          29
        ],
        "profile": "gable",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          9,
          40,
          28,
          84
        ],
        "profile": "hip",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          149,
          88,
          171,
          128
        ],
        "profile": "shed",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          9,
          128,
          30,
          149
        ],
        "profile": "saw",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          148,
          133,
          171,
          169
        ],
        "profile": "gable",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "wave13",
      "Thornhalo Tri-Moon Observatory",
      181,
      207,
      39,
      85,
      42,
      150,
      87,
      129,
      132,
      170,
      3105
    ],
    "profile": "wave13-thornhalo-tri-moon-observatory",
    "sourceAuthoredName": "Thornhalo Tri-Moon Observatory"
  },
  {
    "id": "r4:observatory:mountain:medium:03",
    "type": "observatory",
    "biome": "mountain",
    "size": "medium",
    "variant": 3,
    "bounds": [
      151,
      22,
      179
    ],
    "wings": [
      [
        66,
        7,
        78,
        169
      ],
      [
        61,
        11,
        83,
        30
      ],
      [
        8,
        27,
        27,
        77
      ],
      [
        117,
        67,
        142,
        111
      ],
      [
        8,
        112,
        29,
        126
      ],
      [
        118,
        115,
        142,
        148
      ],
      [
        27,
        50,
        67,
        54
      ],
      [
        77,
        87,
        117,
        91
      ],
      [
        29,
        117,
        67,
        121
      ],
      [
        77,
        129,
        118,
        133
      ]
    ],
    "notches": [],
    "octagons": [],
    "skyline": [
      [
        15,
        50,
        19,
        54,
        13
      ],
      [
        127,
        87,
        131,
        91,
        14
      ],
      [
        16,
        117,
        20,
        121,
        15
      ],
      [
        128,
        129,
        132,
        133,
        16
      ]
    ],
    "entry": [
      72,
      7
    ],
    "porch": [
      68,
      3,
      76,
      6
    ],
    "partitions": [],
    "windows": [
      [
        63,
        11,
        "south"
      ],
      [
        81,
        11,
        "south"
      ],
      [
        8,
        34,
        "west"
      ],
      [
        142,
        74,
        "east"
      ],
      [
        8,
        119,
        "west"
      ],
      [
        142,
        122,
        "east"
      ]
    ],
    "fixtures": [
      [
        72,
        20
      ],
      [
        17,
        52
      ],
      [
        129,
        89
      ],
      [
        18,
        119
      ],
      [
        130,
        131
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave13-7-lens-gallery",
        "kind": "lens-gallery",
        "rect": [
          64,
          14,
          80,
          27
        ]
      },
      {
        "id": "wave13-7-star-chart-library",
        "kind": "star-chart-library",
        "rect": [
          11,
          30,
          24,
          74
        ]
      },
      {
        "id": "wave13-7-orbital-calibration",
        "kind": "orbital-calibration",
        "rect": [
          120,
          70,
          139,
          108
        ]
      },
      {
        "id": "wave13-7-astral-observation",
        "kind": "astral-observation",
        "rect": [
          11,
          115,
          26,
          123
        ]
      },
      {
        "id": "wave13-7-instrument-workshop",
        "kind": "instrument-workshop",
        "rect": [
          121,
          118,
          139,
          145
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          62,
          12,
          82,
          29
        ],
        "profile": "hip",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          9,
          28,
          26,
          76
        ],
        "profile": "shed",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          118,
          68,
          141,
          110
        ],
        "profile": "saw",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          9,
          113,
          28,
          125
        ],
        "profile": "gable",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          119,
          116,
          141,
          147
        ],
        "profile": "gable",
        "axis": "z",
        "high": 14,
        "period": 6
      }
    ],
    "signature": [
      "wave13",
      "Highcrag Astral Meridian",
      151,
      179,
      27,
      77,
      35,
      126,
      67,
      111,
      115,
      148,
      3106
    ],
    "profile": "wave13-highcrag-astral-meridian",
    "sourceAuthoredName": "Highcrag Astral Meridian"
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
export function buildA2Wave13StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave13StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE13_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
