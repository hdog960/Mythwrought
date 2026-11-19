// Roadmap A2 Wave12: twelve independent court, ring, switchback and lightwell programs.
// The 296 accepted historical records remain in protected older modules.
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
    "id": "r4:embassy:snow:small:01",
    "type": "embassy",
    "biome": "snow",
    "size": "small",
    "variant": 1,
    "bounds": [
      105,
      22,
      141
    ],
    "wings": [
      [
        44,
        7,
        58,
        132
      ],
      [
        39,
        10,
        63,
        27
      ],
      [
        6,
        31,
        30,
        53
      ],
      [
        72,
        48,
        97,
        72
      ],
      [
        6,
        89,
        33,
        112
      ],
      [
        71,
        107,
        97,
        129
      ],
      [
        29,
        40,
        45,
        44
      ],
      [
        57,
        57,
        73,
        61
      ],
      [
        32,
        98,
        45,
        102
      ],
      [
        57,
        116,
        72,
        120
      ],
      [
        35,
        83,
        45,
        111
      ]
    ],
    "notches": [
      [
        18,
        34,
        21,
        37
      ]
    ],
    "octagons": [
      [
        39,
        88,
        5,
        8
      ]
    ],
    "skyline": [
      [
        45,
        16,
        49,
        20,
        12
      ],
      [
        12,
        37,
        16,
        41,
        13
      ],
      [
        78,
        54,
        82,
        58,
        14
      ],
      [
        12,
        95,
        16,
        99,
        15
      ],
      [
        77,
        113,
        81,
        117,
        16
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
        46,
        7,
        "south"
      ],
      [
        56,
        7,
        "south"
      ],
      [
        6,
        37,
        "west"
      ],
      [
        97,
        54,
        "east"
      ],
      [
        6,
        96,
        "west"
      ],
      [
        97,
        114,
        "east"
      ]
    ],
    "fixtures": [
      [
        51,
        18
      ],
      [
        18,
        42
      ],
      [
        84,
        60
      ],
      [
        19,
        100
      ],
      [
        84,
        118
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-1-formal-chamber",
        "kind": "formal-chamber",
        "rect": [
          43,
          14,
          59,
          23
        ]
      },
      {
        "id": "wave12-1-guest-area",
        "kind": "guest-area",
        "rect": [
          10,
          35,
          26,
          49
        ]
      },
      {
        "id": "wave12-1-consular-office",
        "kind": "consular-office",
        "rect": [
          76,
          52,
          93,
          68
        ]
      },
      {
        "id": "wave12-1-treaty-archive",
        "kind": "treaty-archive",
        "rect": [
          10,
          93,
          29,
          108
        ]
      },
      {
        "id": "wave12-1-hospitality",
        "kind": "hospitality",
        "rect": [
          75,
          111,
          93,
          125
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          40,
          11,
          62,
          26
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          7,
          32,
          29,
          52
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          73,
          49,
          96,
          71
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          7,
          90,
          32,
          111
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 7
      },
      {
        "rect": [
          72,
          108,
          96,
          128
        ],
        "profile": "gable",
        "axis": "z",
        "high": 15,
        "period": 4
      }
    ],
    "signature": [
      "wave12-frostglass-concord-house",
      105,
      141,
      31,
      48,
      89,
      107,
      2900
    ],
    "profile": "wave12-frostglass-concord-house",
    "sourceAuthoredName": "Frostglass Concord House"
  },
  {
    "id": "r4:embassy:enchanted-forest:small:03",
    "type": "embassy",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 3,
    "bounds": [
      113,
      22,
      149
    ],
    "wings": [
      [
        49,
        7,
        63,
        140
      ],
      [
        44,
        10,
        68,
        27
      ],
      [
        7,
        34,
        34,
        57
      ],
      [
        76,
        54,
        104,
        79
      ],
      [
        7,
        93,
        37,
        117
      ],
      [
        75,
        116,
        104,
        139
      ],
      [
        33,
        43,
        50,
        47
      ],
      [
        62,
        63,
        77,
        67
      ],
      [
        36,
        102,
        50,
        106
      ],
      [
        62,
        125,
        76,
        129
      ],
      [
        62,
        73,
        76,
        98
      ]
    ],
    "notches": [
      [
        19,
        37,
        22,
        40
      ]
    ],
    "octagons": [
      [
        68,
        93,
        6,
        9
      ]
    ],
    "skyline": [
      [
        50,
        16,
        54,
        20,
        13
      ],
      [
        13,
        40,
        17,
        44,
        14
      ],
      [
        82,
        60,
        86,
        64,
        15
      ],
      [
        13,
        99,
        17,
        103,
        16
      ],
      [
        81,
        122,
        85,
        126,
        12
      ]
    ],
    "entry": [
      56,
      7
    ],
    "porch": [
      52,
      3,
      60,
      6
    ],
    "partitions": [],
    "windows": [
      [
        51,
        7,
        "south"
      ],
      [
        61,
        7,
        "south"
      ],
      [
        7,
        40,
        "west"
      ],
      [
        104,
        60,
        "east"
      ],
      [
        7,
        100,
        "west"
      ],
      [
        104,
        123,
        "east"
      ]
    ],
    "fixtures": [
      [
        56,
        18
      ],
      [
        20,
        45
      ],
      [
        90,
        66
      ],
      [
        22,
        105
      ],
      [
        89,
        127
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-2-formal-chamber",
        "kind": "formal-chamber",
        "rect": [
          48,
          14,
          64,
          23
        ]
      },
      {
        "id": "wave12-2-guest-area",
        "kind": "guest-area",
        "rect": [
          11,
          38,
          30,
          53
        ]
      },
      {
        "id": "wave12-2-consular-office",
        "kind": "consular-office",
        "rect": [
          80,
          58,
          100,
          75
        ]
      },
      {
        "id": "wave12-2-treaty-archive",
        "kind": "treaty-archive",
        "rect": [
          11,
          97,
          33,
          113
        ]
      },
      {
        "id": "wave12-2-hospitality",
        "kind": "hospitality",
        "rect": [
          79,
          120,
          100,
          135
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          45,
          11,
          67,
          26
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          8,
          35,
          33,
          56
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          77,
          55,
          103,
          78
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 7
      },
      {
        "rect": [
          8,
          94,
          36,
          116
        ],
        "profile": "gable",
        "axis": "z",
        "high": 15,
        "period": 4
      },
      {
        "rect": [
          76,
          117,
          103,
          138
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "wave12-mosswake-five-court-legation",
      113,
      149,
      34,
      54,
      93,
      116,
      2901
    ],
    "profile": "wave12-mosswake-five-court-legation",
    "sourceAuthoredName": "Mosswake Five-Court Legation"
  },
  {
    "id": "r4:embassy:enchanted-forest:large:01",
    "type": "embassy",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 1,
    "bounds": [
      167,
      22,
      193
    ],
    "wings": [
      [
        77,
        7,
        91,
        184
      ],
      [
        72,
        10,
        96,
        27
      ],
      [
        8,
        44,
        42,
        69
      ],
      [
        122,
        71,
        157,
        98
      ],
      [
        8,
        133,
        45,
        159
      ],
      [
        121,
        154,
        157,
        179
      ],
      [
        41,
        54,
        78,
        58
      ],
      [
        90,
        81,
        123,
        85
      ],
      [
        44,
        143,
        78,
        147
      ],
      [
        90,
        164,
        122,
        168
      ],
      [
        66,
        84,
        102,
        90
      ]
    ],
    "notches": [
      [
        20,
        47,
        23,
        50
      ]
    ],
    "octagons": [
      [
        72,
        121,
        7,
        10
      ]
    ],
    "skyline": [
      [
        78,
        16,
        82,
        20,
        14
      ],
      [
        14,
        50,
        18,
        54,
        15
      ],
      [
        128,
        77,
        132,
        81,
        16
      ],
      [
        14,
        139,
        18,
        143,
        12
      ],
      [
        127,
        160,
        131,
        164,
        13
      ]
    ],
    "entry": [
      84,
      7
    ],
    "porch": [
      80,
      3,
      88,
      6
    ],
    "partitions": [],
    "windows": [
      [
        79,
        7,
        "south"
      ],
      [
        89,
        7,
        "south"
      ],
      [
        8,
        50,
        "west"
      ],
      [
        157,
        77,
        "east"
      ],
      [
        8,
        140,
        "west"
      ],
      [
        157,
        161,
        "east"
      ]
    ],
    "fixtures": [
      [
        84,
        18
      ],
      [
        25,
        56
      ],
      [
        139,
        84
      ],
      [
        26,
        146
      ],
      [
        139,
        166
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-3-formal-chamber",
        "kind": "formal-chamber",
        "rect": [
          76,
          14,
          92,
          23
        ]
      },
      {
        "id": "wave12-3-guest-area",
        "kind": "guest-area",
        "rect": [
          12,
          48,
          38,
          65
        ]
      },
      {
        "id": "wave12-3-consular-office",
        "kind": "consular-office",
        "rect": [
          126,
          75,
          153,
          94
        ]
      },
      {
        "id": "wave12-3-treaty-archive",
        "kind": "treaty-archive",
        "rect": [
          12,
          137,
          41,
          155
        ]
      },
      {
        "id": "wave12-3-hospitality",
        "kind": "hospitality",
        "rect": [
          125,
          158,
          153,
          175
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          73,
          11,
          95,
          26
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          9,
          45,
          41,
          68
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 7
      },
      {
        "rect": [
          123,
          72,
          156,
          97
        ],
        "profile": "gable",
        "axis": "z",
        "high": 15,
        "period": 4
      },
      {
        "rect": [
          9,
          134,
          44,
          158
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          122,
          155,
          156,
          178
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 6
      }
    ],
    "signature": [
      "wave12-thornspire-verdant-embassy",
      167,
      193,
      44,
      71,
      133,
      154,
      2902
    ],
    "profile": "wave12-thornspire-verdant-embassy",
    "sourceAuthoredName": "Thornspire Verdant Embassy"
  },
  {
    "id": "r4:embassy:mountain:small:02",
    "type": "embassy",
    "biome": "mountain",
    "size": "small",
    "variant": 2,
    "bounds": [
      111,
      22,
      147
    ],
    "wings": [
      [
        47,
        7,
        61,
        138
      ],
      [
        42,
        10,
        66,
        27
      ],
      [
        9,
        36,
        35,
        57
      ],
      [
        76,
        53,
        103,
        76
      ],
      [
        9,
        91,
        38,
        113
      ],
      [
        75,
        115,
        103,
        136
      ],
      [
        34,
        44,
        48,
        48
      ],
      [
        60,
        61,
        77,
        65
      ],
      [
        37,
        99,
        48,
        103
      ],
      [
        60,
        123,
        76,
        127
      ],
      [
        38,
        86,
        48,
        114
      ]
    ],
    "notches": [
      [
        21,
        39,
        24,
        42
      ]
    ],
    "octagons": [
      [
        66,
        92,
        5,
        8
      ]
    ],
    "skyline": [
      [
        48,
        16,
        52,
        20,
        15
      ],
      [
        15,
        42,
        19,
        46,
        16
      ],
      [
        82,
        59,
        86,
        63,
        12
      ],
      [
        15,
        97,
        19,
        101,
        13
      ],
      [
        81,
        121,
        85,
        125,
        14
      ]
    ],
    "entry": [
      54,
      7
    ],
    "porch": [
      50,
      3,
      58,
      6
    ],
    "partitions": [],
    "windows": [
      [
        49,
        7,
        "south"
      ],
      [
        59,
        7,
        "south"
      ],
      [
        9,
        42,
        "west"
      ],
      [
        103,
        59,
        "east"
      ],
      [
        9,
        98,
        "west"
      ],
      [
        103,
        122,
        "east"
      ]
    ],
    "fixtures": [
      [
        54,
        18
      ],
      [
        22,
        46
      ],
      [
        89,
        64
      ],
      [
        23,
        102
      ],
      [
        89,
        125
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-4-formal-chamber",
        "kind": "formal-chamber",
        "rect": [
          46,
          14,
          62,
          23
        ]
      },
      {
        "id": "wave12-4-guest-area",
        "kind": "guest-area",
        "rect": [
          13,
          40,
          31,
          53
        ]
      },
      {
        "id": "wave12-4-consular-office",
        "kind": "consular-office",
        "rect": [
          80,
          57,
          99,
          72
        ]
      },
      {
        "id": "wave12-4-treaty-archive",
        "kind": "treaty-archive",
        "rect": [
          13,
          95,
          34,
          109
        ]
      },
      {
        "id": "wave12-4-hospitality",
        "kind": "hospitality",
        "rect": [
          79,
          119,
          99,
          132
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          43,
          11,
          65,
          26
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 7
      },
      {
        "rect": [
          10,
          37,
          34,
          56
        ],
        "profile": "gable",
        "axis": "z",
        "high": 15,
        "period": 4
      },
      {
        "rect": [
          77,
          54,
          102,
          75
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          10,
          92,
          37,
          112
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          76,
          116,
          102,
          135
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 7
      }
    ],
    "signature": [
      "wave12-ironwind-ridge-consulate",
      111,
      147,
      36,
      53,
      91,
      115,
      2903
    ],
    "profile": "wave12-ironwind-ridge-consulate",
    "sourceAuthoredName": "Ironwind Ridge Consulate"
  },
  {
    "id": "r4:grand-archive:temperate:medium:03",
    "type": "grand-archive",
    "biome": "temperate",
    "size": "medium",
    "variant": 3,
    "bounds": [
      137,
      22,
      161
    ],
    "wings": [
      [
        61,
        7,
        75,
        152
      ],
      [
        56,
        10,
        80,
        27
      ],
      [
        6,
        38,
        35,
        59
      ],
      [
        98,
        59,
        128,
        82
      ],
      [
        6,
        107,
        38,
        129
      ],
      [
        97,
        131,
        128,
        152
      ],
      [
        34,
        46,
        62,
        50
      ],
      [
        74,
        67,
        99,
        71
      ],
      [
        37,
        115,
        62,
        119
      ],
      [
        74,
        139,
        98,
        143
      ],
      [
        74,
        78,
        88,
        103
      ]
    ],
    "notches": [
      [
        18,
        41,
        21,
        44
      ]
    ],
    "octagons": [
      [
        56,
        101,
        6,
        9
      ]
    ],
    "skyline": [
      [
        62,
        16,
        66,
        20,
        16
      ],
      [
        12,
        44,
        16,
        48,
        12
      ],
      [
        104,
        65,
        108,
        69,
        13
      ],
      [
        12,
        113,
        16,
        117,
        14
      ],
      [
        103,
        137,
        107,
        141,
        15
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
        63,
        7,
        "south"
      ],
      [
        73,
        7,
        "south"
      ],
      [
        6,
        44,
        "west"
      ],
      [
        128,
        65,
        "east"
      ],
      [
        6,
        114,
        "west"
      ],
      [
        128,
        138,
        "east"
      ]
    ],
    "fixtures": [
      [
        68,
        18
      ],
      [
        20,
        48
      ],
      [
        113,
        70
      ],
      [
        22,
        118
      ],
      [
        112,
        141
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-5-records-vault",
        "kind": "records-vault",
        "rect": [
          60,
          14,
          76,
          23
        ]
      },
      {
        "id": "wave12-5-consultation-room",
        "kind": "consultation-room",
        "rect": [
          10,
          42,
          31,
          55
        ]
      },
      {
        "id": "wave12-5-catalogue-hall",
        "kind": "catalogue-hall",
        "rect": [
          102,
          63,
          124,
          78
        ]
      },
      {
        "id": "wave12-5-restoration-lab",
        "kind": "restoration-lab",
        "rect": [
          10,
          111,
          34,
          125
        ]
      },
      {
        "id": "wave12-5-scribe-chamber",
        "kind": "scribe-chamber",
        "rect": [
          101,
          135,
          124,
          148
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          57,
          11,
          79,
          26
        ],
        "profile": "gable",
        "axis": "z",
        "high": 15,
        "period": 4
      },
      {
        "rect": [
          7,
          39,
          34,
          58
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          99,
          60,
          127,
          81
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          7,
          108,
          37,
          128
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          98,
          132,
          127,
          151
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      }
    ],
    "signature": [
      "wave12-sevenlight-ledger-conservatory",
      137,
      161,
      38,
      59,
      107,
      131,
      2904
    ],
    "profile": "wave12-sevenlight-ledger-conservatory",
    "sourceAuthoredName": "Sevenlight Ledger Conservatory"
  },
  {
    "id": "r4:grand-archive:desert:small:01",
    "type": "grand-archive",
    "biome": "desert",
    "size": "small",
    "variant": 1,
    "bounds": [
      109,
      22,
      145
    ],
    "wings": [
      [
        48,
        7,
        62,
        136
      ],
      [
        43,
        10,
        67,
        27
      ],
      [
        7,
        32,
        31,
        52
      ],
      [
        74,
        56,
        99,
        78
      ],
      [
        7,
        94,
        34,
        115
      ],
      [
        73,
        115,
        99,
        135
      ],
      [
        30,
        40,
        49,
        44
      ],
      [
        61,
        64,
        75,
        68
      ],
      [
        33,
        102,
        49,
        106
      ],
      [
        61,
        123,
        74,
        127
      ],
      [
        37,
        63,
        73,
        69
      ]
    ],
    "notches": [
      [
        19,
        35,
        22,
        38
      ]
    ],
    "octagons": [
      [
        67,
        91,
        7,
        10
      ]
    ],
    "skyline": [
      [
        49,
        16,
        53,
        20,
        12
      ],
      [
        13,
        38,
        17,
        42,
        13
      ],
      [
        80,
        62,
        84,
        66,
        14
      ],
      [
        13,
        100,
        17,
        104,
        15
      ],
      [
        79,
        121,
        83,
        125,
        16
      ]
    ],
    "entry": [
      55,
      7
    ],
    "porch": [
      51,
      3,
      59,
      6
    ],
    "partitions": [],
    "windows": [
      [
        50,
        7,
        "south"
      ],
      [
        60,
        7,
        "south"
      ],
      [
        7,
        38,
        "west"
      ],
      [
        99,
        62,
        "east"
      ],
      [
        7,
        101,
        "west"
      ],
      [
        99,
        122,
        "east"
      ]
    ],
    "fixtures": [
      [
        55,
        18
      ],
      [
        19,
        42
      ],
      [
        86,
        67
      ],
      [
        20,
        104
      ],
      [
        86,
        125
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-6-records-vault",
        "kind": "records-vault",
        "rect": [
          47,
          14,
          63,
          23
        ]
      },
      {
        "id": "wave12-6-consultation-room",
        "kind": "consultation-room",
        "rect": [
          11,
          36,
          27,
          48
        ]
      },
      {
        "id": "wave12-6-catalogue-hall",
        "kind": "catalogue-hall",
        "rect": [
          78,
          60,
          95,
          74
        ]
      },
      {
        "id": "wave12-6-restoration-lab",
        "kind": "restoration-lab",
        "rect": [
          11,
          98,
          30,
          111
        ]
      },
      {
        "id": "wave12-6-scribe-chamber",
        "kind": "scribe-chamber",
        "rect": [
          77,
          119,
          95,
          131
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          44,
          11,
          66,
          26
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          8,
          33,
          30,
          51
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          75,
          57,
          98,
          77
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          8,
          95,
          33,
          114
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          74,
          116,
          98,
          134
        ],
        "profile": "gable",
        "axis": "x",
        "high": 15,
        "period": 5
      }
    ],
    "signature": [
      "wave12-sundust-mosaic-repository",
      109,
      145,
      32,
      56,
      94,
      115,
      2905
    ],
    "profile": "wave12-sundust-mosaic-repository",
    "sourceAuthoredName": "Sundust Mosaic Repository"
  },
  {
    "id": "r4:grand-archive:enchanted-forest:large:02",
    "type": "grand-archive",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 2,
    "bounds": [
      173,
      22,
      197
    ],
    "wings": [
      [
        78,
        7,
        92,
        188
      ],
      [
        73,
        10,
        97,
        27
      ],
      [
        8,
        45,
        44,
        70
      ],
      [
        128,
        73,
        165,
        100
      ],
      [
        8,
        139,
        47,
        165
      ],
      [
        127,
        161,
        165,
        186
      ],
      [
        43,
        55,
        79,
        59
      ],
      [
        91,
        83,
        129,
        87
      ],
      [
        46,
        149,
        79,
        153
      ],
      [
        91,
        171,
        128,
        175
      ],
      [
        69,
        116,
        79,
        144
      ]
    ],
    "notches": [
      [
        20,
        48,
        23,
        51
      ]
    ],
    "octagons": [
      [
        73,
        124,
        5,
        8
      ]
    ],
    "skyline": [
      [
        79,
        16,
        83,
        20,
        13
      ],
      [
        14,
        51,
        18,
        55,
        14
      ],
      [
        134,
        79,
        138,
        83,
        15
      ],
      [
        14,
        145,
        18,
        149,
        16
      ],
      [
        133,
        167,
        137,
        171,
        12
      ]
    ],
    "entry": [
      85,
      7
    ],
    "porch": [
      81,
      3,
      89,
      6
    ],
    "partitions": [],
    "windows": [
      [
        80,
        7,
        "south"
      ],
      [
        90,
        7,
        "south"
      ],
      [
        8,
        51,
        "west"
      ],
      [
        165,
        79,
        "east"
      ],
      [
        8,
        146,
        "west"
      ],
      [
        165,
        168,
        "east"
      ]
    ],
    "fixtures": [
      [
        85,
        18
      ],
      [
        26,
        57
      ],
      [
        146,
        86
      ],
      [
        27,
        152
      ],
      [
        146,
        173
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-7-records-vault",
        "kind": "records-vault",
        "rect": [
          77,
          14,
          93,
          23
        ]
      },
      {
        "id": "wave12-7-consultation-room",
        "kind": "consultation-room",
        "rect": [
          12,
          49,
          40,
          66
        ]
      },
      {
        "id": "wave12-7-catalogue-hall",
        "kind": "catalogue-hall",
        "rect": [
          132,
          77,
          161,
          96
        ]
      },
      {
        "id": "wave12-7-restoration-lab",
        "kind": "restoration-lab",
        "rect": [
          12,
          143,
          43,
          161
        ]
      },
      {
        "id": "wave12-7-scribe-chamber",
        "kind": "scribe-chamber",
        "rect": [
          131,
          165,
          161,
          182
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          74,
          11,
          96,
          26
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          9,
          46,
          43,
          69
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          129,
          74,
          164,
          99
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          9,
          140,
          46,
          164
        ],
        "profile": "gable",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          128,
          162,
          164,
          185
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 6
      }
    ],
    "signature": [
      "wave12-elderroot-lattice-archive",
      173,
      197,
      45,
      73,
      139,
      161,
      2906
    ],
    "profile": "wave12-elderroot-lattice-archive",
    "sourceAuthoredName": "Elderroot Lattice Archive"
  },
  {
    "id": "r4:grand-archive:mountain:small:02",
    "type": "grand-archive",
    "biome": "mountain",
    "size": "small",
    "variant": 2,
    "bounds": [
      115,
      22,
      153
    ],
    "wings": [
      [
        50,
        7,
        64,
        144
      ],
      [
        45,
        10,
        69,
        27
      ],
      [
        9,
        35,
        35,
        57
      ],
      [
        79,
        58,
        106,
        82
      ],
      [
        9,
        98,
        38,
        121
      ],
      [
        78,
        124,
        106,
        146
      ],
      [
        34,
        44,
        51,
        48
      ],
      [
        63,
        67,
        80,
        71
      ],
      [
        37,
        107,
        51,
        111
      ],
      [
        63,
        133,
        79,
        137
      ],
      [
        63,
        74,
        77,
        99
      ]
    ],
    "notches": [
      [
        21,
        38,
        24,
        41
      ]
    ],
    "octagons": [
      [
        69,
        96,
        6,
        9
      ]
    ],
    "skyline": [
      [
        51,
        16,
        55,
        20,
        14
      ],
      [
        15,
        41,
        19,
        45,
        15
      ],
      [
        85,
        64,
        89,
        68,
        16
      ],
      [
        15,
        104,
        19,
        108,
        12
      ],
      [
        84,
        130,
        88,
        134,
        13
      ]
    ],
    "entry": [
      57,
      7
    ],
    "porch": [
      53,
      3,
      61,
      6
    ],
    "partitions": [],
    "windows": [
      [
        52,
        7,
        "south"
      ],
      [
        62,
        7,
        "south"
      ],
      [
        9,
        41,
        "west"
      ],
      [
        106,
        64,
        "east"
      ],
      [
        9,
        105,
        "west"
      ],
      [
        106,
        131,
        "east"
      ]
    ],
    "fixtures": [
      [
        57,
        18
      ],
      [
        22,
        46
      ],
      [
        92,
        70
      ],
      [
        23,
        109
      ],
      [
        92,
        135
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-8-records-vault",
        "kind": "records-vault",
        "rect": [
          49,
          14,
          65,
          23
        ]
      },
      {
        "id": "wave12-8-consultation-room",
        "kind": "consultation-room",
        "rect": [
          13,
          39,
          31,
          53
        ]
      },
      {
        "id": "wave12-8-catalogue-hall",
        "kind": "catalogue-hall",
        "rect": [
          83,
          62,
          102,
          78
        ]
      },
      {
        "id": "wave12-8-restoration-lab",
        "kind": "restoration-lab",
        "rect": [
          13,
          102,
          34,
          117
        ]
      },
      {
        "id": "wave12-8-scribe-chamber",
        "kind": "scribe-chamber",
        "rect": [
          82,
          128,
          102,
          142
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          46,
          11,
          68,
          26
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          10,
          36,
          34,
          56
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          80,
          59,
          105,
          81
        ],
        "profile": "gable",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          10,
          99,
          37,
          120
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          79,
          125,
          105,
          145
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 7
      }
    ],
    "signature": [
      "wave12-slatehollow-record-citadel",
      115,
      153,
      35,
      58,
      98,
      124,
      2907
    ],
    "profile": "wave12-slatehollow-record-citadel",
    "sourceAuthoredName": "Slatehollow Record Citadel"
  },
  {
    "id": "r4:observatory:temperate:small:01",
    "type": "observatory",
    "biome": "temperate",
    "size": "small",
    "variant": 1,
    "bounds": [
      107,
      22,
      143
    ],
    "wings": [
      [
        47,
        7,
        61,
        134
      ],
      [
        42,
        10,
        66,
        27
      ],
      [
        6,
        30,
        31,
        50
      ],
      [
        71,
        50,
        97,
        72
      ],
      [
        6,
        91,
        34,
        112
      ],
      [
        70,
        111,
        97,
        131
      ],
      [
        30,
        38,
        48,
        42
      ],
      [
        60,
        58,
        72,
        62
      ],
      [
        33,
        99,
        48,
        103
      ],
      [
        60,
        119,
        71,
        123
      ],
      [
        36,
        62,
        72,
        68
      ]
    ],
    "notches": [
      [
        18,
        33,
        21,
        36
      ]
    ],
    "octagons": [
      [
        42,
        90,
        7,
        10
      ]
    ],
    "skyline": [
      [
        48,
        16,
        52,
        20,
        15
      ],
      [
        12,
        36,
        16,
        40,
        16
      ],
      [
        77,
        56,
        81,
        60,
        12
      ],
      [
        12,
        97,
        16,
        101,
        13
      ],
      [
        76,
        117,
        80,
        121,
        14
      ]
    ],
    "entry": [
      54,
      7
    ],
    "porch": [
      50,
      3,
      58,
      6
    ],
    "partitions": [],
    "windows": [
      [
        49,
        7,
        "south"
      ],
      [
        59,
        7,
        "south"
      ],
      [
        6,
        36,
        "west"
      ],
      [
        97,
        56,
        "east"
      ],
      [
        6,
        98,
        "west"
      ],
      [
        97,
        118,
        "east"
      ]
    ],
    "fixtures": [
      [
        54,
        18
      ],
      [
        18,
        40
      ],
      [
        84,
        61
      ],
      [
        20,
        101
      ],
      [
        83,
        121
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-9-observation-deck",
        "kind": "observation-deck",
        "rect": [
          46,
          14,
          62,
          23
        ]
      },
      {
        "id": "wave12-9-instrument-room",
        "kind": "instrument-room",
        "rect": [
          10,
          34,
          27,
          46
        ]
      },
      {
        "id": "wave12-9-chart-library",
        "kind": "chart-library",
        "rect": [
          75,
          54,
          93,
          68
        ]
      },
      {
        "id": "wave12-9-lens-workshop",
        "kind": "lens-workshop",
        "rect": [
          10,
          95,
          30,
          108
        ]
      },
      {
        "id": "wave12-9-astronomer-lodge",
        "kind": "astronomer-lodge",
        "rect": [
          74,
          115,
          93,
          127
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          43,
          11,
          65,
          26
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          7,
          31,
          30,
          49
        ],
        "profile": "gable",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          72,
          51,
          96,
          71
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          7,
          92,
          33,
          111
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 7
      },
      {
        "rect": [
          71,
          112,
          96,
          130
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 4
      }
    ],
    "signature": [
      "wave12-goldmere-orrery-lodge",
      107,
      143,
      30,
      50,
      91,
      111,
      2908
    ],
    "profile": "wave12-goldmere-orrery-lodge",
    "sourceAuthoredName": "Goldmere Orrery Lodge"
  },
  {
    "id": "r4:observatory:desert:large:02",
    "type": "observatory",
    "biome": "desert",
    "size": "large",
    "variant": 2,
    "bounds": [
      171,
      22,
      195
    ],
    "wings": [
      [
        77,
        7,
        91,
        186
      ],
      [
        72,
        10,
        96,
        27
      ],
      [
        7,
        43,
        42,
        68
      ],
      [
        127,
        70,
        163,
        97
      ],
      [
        7,
        137,
        45,
        163
      ],
      [
        126,
        157,
        163,
        182
      ],
      [
        41,
        53,
        78,
        57
      ],
      [
        90,
        80,
        128,
        84
      ],
      [
        44,
        147,
        78,
        151
      ],
      [
        90,
        167,
        127,
        171
      ],
      [
        68,
        115,
        78,
        143
      ]
    ],
    "notches": [
      [
        19,
        46,
        22,
        49
      ]
    ],
    "octagons": [
      [
        96,
        122,
        5,
        8
      ]
    ],
    "skyline": [
      [
        78,
        16,
        82,
        20,
        16
      ],
      [
        13,
        49,
        17,
        53,
        12
      ],
      [
        133,
        76,
        137,
        80,
        13
      ],
      [
        13,
        143,
        17,
        147,
        14
      ],
      [
        132,
        163,
        136,
        167,
        15
      ]
    ],
    "entry": [
      84,
      7
    ],
    "porch": [
      80,
      3,
      88,
      6
    ],
    "partitions": [],
    "windows": [
      [
        79,
        7,
        "south"
      ],
      [
        89,
        7,
        "south"
      ],
      [
        7,
        49,
        "west"
      ],
      [
        163,
        76,
        "east"
      ],
      [
        7,
        144,
        "west"
      ],
      [
        163,
        164,
        "east"
      ]
    ],
    "fixtures": [
      [
        84,
        18
      ],
      [
        24,
        55
      ],
      [
        145,
        83
      ],
      [
        26,
        150
      ],
      [
        144,
        169
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-10-observation-deck",
        "kind": "observation-deck",
        "rect": [
          76,
          14,
          92,
          23
        ]
      },
      {
        "id": "wave12-10-instrument-room",
        "kind": "instrument-room",
        "rect": [
          11,
          47,
          38,
          64
        ]
      },
      {
        "id": "wave12-10-chart-library",
        "kind": "chart-library",
        "rect": [
          131,
          74,
          159,
          93
        ]
      },
      {
        "id": "wave12-10-lens-workshop",
        "kind": "lens-workshop",
        "rect": [
          11,
          141,
          41,
          159
        ]
      },
      {
        "id": "wave12-10-astronomer-lodge",
        "kind": "astronomer-lodge",
        "rect": [
          130,
          161,
          159,
          178
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          73,
          11,
          95,
          26
        ],
        "profile": "gable",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          8,
          44,
          41,
          67
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          128,
          71,
          162,
          96
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 7
      },
      {
        "rect": [
          8,
          138,
          44,
          162
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          127,
          158,
          162,
          181
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "wave12-mirage-meridian-array",
      171,
      195,
      43,
      70,
      137,
      157,
      2909
    ],
    "profile": "wave12-mirage-meridian-array",
    "sourceAuthoredName": "Mirage Meridian Array"
  },
  {
    "id": "r4:observatory:snow:large:02",
    "type": "observatory",
    "biome": "snow",
    "size": "large",
    "variant": 2,
    "bounds": [
      165,
      22,
      191
    ],
    "wings": [
      [
        75,
        7,
        89,
        182
      ],
      [
        70,
        10,
        94,
        27
      ],
      [
        8,
        42,
        42,
        68
      ],
      [
        121,
        67,
        156,
        95
      ],
      [
        8,
        132,
        45,
        159
      ],
      [
        120,
        153,
        156,
        179
      ],
      [
        41,
        53,
        76,
        57
      ],
      [
        88,
        78,
        122,
        82
      ],
      [
        44,
        143,
        76,
        147
      ],
      [
        88,
        164,
        121,
        168
      ],
      [
        88,
        93,
        102,
        118
      ]
    ],
    "notches": [
      [
        20,
        45,
        23,
        48
      ]
    ],
    "octagons": [
      [
        70,
        120,
        6,
        9
      ]
    ],
    "skyline": [
      [
        76,
        16,
        80,
        20,
        12
      ],
      [
        14,
        48,
        18,
        52,
        13
      ],
      [
        127,
        73,
        131,
        77,
        14
      ],
      [
        14,
        138,
        18,
        142,
        15
      ],
      [
        126,
        159,
        130,
        163,
        16
      ]
    ],
    "entry": [
      82,
      7
    ],
    "porch": [
      78,
      3,
      86,
      6
    ],
    "partitions": [],
    "windows": [
      [
        77,
        7,
        "south"
      ],
      [
        87,
        7,
        "south"
      ],
      [
        8,
        48,
        "west"
      ],
      [
        156,
        73,
        "east"
      ],
      [
        8,
        139,
        "west"
      ],
      [
        156,
        160,
        "east"
      ]
    ],
    "fixtures": [
      [
        82,
        18
      ],
      [
        25,
        55
      ],
      [
        138,
        81
      ],
      [
        26,
        145
      ],
      [
        138,
        166
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-11-observation-deck",
        "kind": "observation-deck",
        "rect": [
          74,
          14,
          90,
          23
        ]
      },
      {
        "id": "wave12-11-instrument-room",
        "kind": "instrument-room",
        "rect": [
          12,
          46,
          38,
          64
        ]
      },
      {
        "id": "wave12-11-chart-library",
        "kind": "chart-library",
        "rect": [
          125,
          71,
          152,
          91
        ]
      },
      {
        "id": "wave12-11-lens-workshop",
        "kind": "lens-workshop",
        "rect": [
          12,
          136,
          41,
          155
        ]
      },
      {
        "id": "wave12-11-astronomer-lodge",
        "kind": "astronomer-lodge",
        "rect": [
          124,
          157,
          152,
          175
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          71,
          11,
          93,
          26
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          9,
          43,
          41,
          67
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 7
      },
      {
        "rect": [
          122,
          68,
          155,
          94
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          9,
          133,
          44,
          158
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          121,
          154,
          155,
          178
        ],
        "profile": "gable",
        "axis": "z",
        "high": 15,
        "period": 6
      }
    ],
    "signature": [
      "wave12-aurorafell-polar-watch",
      165,
      191,
      42,
      67,
      132,
      153,
      2910
    ],
    "profile": "wave12-aurorafell-polar-watch",
    "sourceAuthoredName": "Aurorafell Polar Watch"
  },
  {
    "id": "r4:observatory:mountain:medium:02",
    "type": "observatory",
    "biome": "mountain",
    "size": "medium",
    "variant": 2,
    "bounds": [
      139,
      22,
      169
    ],
    "wings": [
      [
        63,
        7,
        77,
        160
      ],
      [
        58,
        10,
        82,
        27
      ],
      [
        9,
        39,
        39,
        62
      ],
      [
        98,
        62,
        129,
        87
      ],
      [
        9,
        115,
        42,
        139
      ],
      [
        97,
        137,
        129,
        160
      ],
      [
        38,
        48,
        64,
        52
      ],
      [
        76,
        71,
        99,
        75
      ],
      [
        41,
        124,
        64,
        128
      ],
      [
        76,
        146,
        98,
        150
      ],
      [
        52,
        74,
        88,
        80
      ]
    ],
    "notches": [
      [
        21,
        42,
        24,
        45
      ]
    ],
    "octagons": [
      [
        82,
        106,
        7,
        10
      ]
    ],
    "skyline": [
      [
        64,
        16,
        68,
        20,
        13
      ],
      [
        15,
        45,
        19,
        49,
        14
      ],
      [
        104,
        68,
        108,
        72,
        15
      ],
      [
        15,
        121,
        19,
        125,
        16
      ],
      [
        103,
        143,
        107,
        147,
        12
      ]
    ],
    "entry": [
      70,
      7
    ],
    "porch": [
      66,
      3,
      74,
      6
    ],
    "partitions": [],
    "windows": [
      [
        65,
        7,
        "south"
      ],
      [
        75,
        7,
        "south"
      ],
      [
        9,
        45,
        "west"
      ],
      [
        129,
        68,
        "east"
      ],
      [
        9,
        122,
        "west"
      ],
      [
        129,
        144,
        "east"
      ]
    ],
    "fixtures": [
      [
        70,
        18
      ],
      [
        24,
        50
      ],
      [
        113,
        74
      ],
      [
        25,
        127
      ],
      [
        113,
        148
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wave12-12-observation-deck",
        "kind": "observation-deck",
        "rect": [
          62,
          14,
          78,
          23
        ]
      },
      {
        "id": "wave12-12-instrument-room",
        "kind": "instrument-room",
        "rect": [
          13,
          43,
          35,
          58
        ]
      },
      {
        "id": "wave12-12-chart-library",
        "kind": "chart-library",
        "rect": [
          102,
          66,
          125,
          83
        ]
      },
      {
        "id": "wave12-12-lens-workshop",
        "kind": "lens-workshop",
        "rect": [
          13,
          119,
          38,
          135
        ]
      },
      {
        "id": "wave12-12-astronomer-lodge",
        "kind": "astronomer-lodge",
        "rect": [
          101,
          141,
          125,
          156
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          59,
          11,
          81,
          26
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 7
      },
      {
        "rect": [
          10,
          40,
          38,
          61
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          99,
          63,
          128,
          86
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          10,
          116,
          41,
          138
        ],
        "profile": "gable",
        "axis": "z",
        "high": 15,
        "period": 6
      },
      {
        "rect": [
          98,
          138,
          128,
          159
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 7
      }
    ],
    "signature": [
      "wave12-starpass-switchback-watch",
      139,
      169,
      39,
      62,
      115,
      137,
      2911
    ],
    "profile": "wave12-starpass-switchback-watch",
    "sourceAuthoredName": "Starpass Switchback Watch"
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
export function buildA2Wave12StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave12StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE12_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
