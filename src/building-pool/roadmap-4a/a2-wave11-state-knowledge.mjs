// Roadmap A2 Wave11: twelve independent court, ring, switchback and lightwell programs.
// The 284 already source-accepted historical records remain in protected older modules.
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
    "id": "r4:embassy:temperate:medium:01",
    "type": "embassy",
    "biome": "temperate",
    "size": "medium",
    "variant": 1,
    "bounds": [
      127,
      22,
      153
    ],
    "wings": [
      [
        58,
        7,
        74,
        146
      ],
      [
        5,
        17,
        29,
        35
      ],
      [
        27,
        24,
        60,
        28
      ],
      [
        90,
        39,
        119,
        59
      ],
      [
        72,
        46,
        92,
        52
      ],
      [
        7,
        80,
        41,
        102
      ],
      [
        39,
        87,
        60,
        95
      ],
      [
        94,
        108,
        120,
        132
      ],
      [
        72,
        118,
        96,
        122
      ],
      [
        9,
        35,
        50,
        102
      ],
      [
        83,
        61,
        115,
        110
      ],
      [
        53,
        139,
        97,
        145
      ]
    ],
    "notches": [
      [
        63,
        70,
        68,
        76
      ]
    ],
    "octagons": [
      [
        17,
        26,
        4,
        7
      ],
      [
        107,
        120,
        6,
        8
      ],
      [
        78,
        130,
        5,
        8
      ]
    ],
    "skyline": [
      [
        63,
        13,
        69,
        19,
        12
      ],
      [
        14,
        23,
        20,
        29,
        14
      ],
      [
        101,
        46,
        107,
        52,
        16
      ],
      [
        21,
        88,
        27,
        94,
        12
      ],
      [
        104,
        117,
        110,
        123,
        14
      ],
      [
        62,
        134,
        69,
        140,
        13
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
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 59,
        "to": 73,
        "door": 66,
        "facing": "north"
      }
    ],
    "windows": [
      [
        59,
        7,
        "south"
      ],
      [
        73,
        7,
        "south"
      ],
      [
        5,
        26,
        "west"
      ],
      [
        119,
        49,
        "east"
      ],
      [
        7,
        91,
        "west"
      ],
      [
        120,
        120,
        "east"
      ]
    ],
    "fixtures": [
      [
        66,
        17
      ],
      [
        17,
        27
      ],
      [
        104,
        50
      ],
      [
        24,
        92
      ],
      [
        107,
        121
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "arcaded-four-quays-entry-forum",
        "kind": "formal-chamber",
        "rect": [
          60,
          10,
          72,
          21
        ]
      },
      {
        "id": "arcaded-four-quays-room-1",
        "kind": "guest-area",
        "rect": [
          11,
          21,
          23,
          31
        ]
      },
      {
        "id": "arcaded-four-quays-room-2",
        "kind": "consular-office",
        "rect": [
          98,
          44,
          110,
          54
        ]
      },
      {
        "id": "arcaded-four-quays-room-3",
        "kind": "treaty-archive",
        "rect": [
          18,
          86,
          30,
          96
        ]
      },
      {
        "id": "arcaded-four-quays-room-4",
        "kind": "hospitality",
        "rect": [
          101,
          115,
          113,
          125
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          59,
          10,
          73,
          22
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          10,
          20,
          24,
          32
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          97,
          43,
          111,
          55
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          17,
          85,
          31,
          97
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          100,
          114,
          114,
          126
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "arcaded-four-quays",
      127,
      153,
      26,
      49,
      91,
      120,
      "gallery-variant-0",
      1000
    ],
    "profile": "arcaded-four-quays",
    "sourceAuthoredName": "Bellbridge Waterside Accord"
  },
  {
    "id": "r4:embassy:desert:large:03",
    "type": "embassy",
    "biome": "desert",
    "size": "large",
    "variant": 3,
    "bounds": [
      163,
      22,
      177
    ],
    "wings": [
      [
        65,
        7,
        83,
        170
      ],
      [
        6,
        18,
        33,
        37
      ],
      [
        31,
        24,
        67,
        30
      ],
      [
        122,
        44,
        154,
        65
      ],
      [
        81,
        50,
        124,
        58
      ],
      [
        8,
        83,
        32,
        106
      ],
      [
        30,
        92,
        67,
        96
      ],
      [
        126,
        125,
        155,
        150
      ],
      [
        81,
        134,
        128,
        140
      ],
      [
        12,
        39,
        53,
        97
      ],
      [
        94,
        63,
        148,
        133
      ],
      [
        86,
        145,
        139,
        167
      ],
      [
        43,
        97,
        54,
        125
      ]
    ],
    "notches": [
      [
        72,
        48,
        76,
        51
      ]
    ],
    "octagons": [
      [
        19,
        27,
        5,
        8
      ],
      [
        140,
        137,
        7,
        9
      ],
      [
        64,
        70,
        4,
        7
      ]
    ],
    "skyline": [
      [
        71,
        13,
        77,
        19,
        13
      ],
      [
        16,
        24,
        22,
        30,
        15
      ],
      [
        135,
        51,
        141,
        57,
        17
      ],
      [
        17,
        91,
        23,
        97,
        13
      ],
      [
        137,
        134,
        143,
        140,
        15
      ]
    ],
    "entry": [
      74,
      7
    ],
    "porch": [
      70,
      3,
      78,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 67,
        "to": 81,
        "door": 74,
        "facing": "north"
      }
    ],
    "windows": [
      [
        67,
        7,
        "south"
      ],
      [
        81,
        7,
        "south"
      ],
      [
        6,
        27,
        "west"
      ],
      [
        154,
        54,
        "east"
      ],
      [
        8,
        94,
        "west"
      ],
      [
        155,
        137,
        "east"
      ]
    ],
    "fixtures": [
      [
        74,
        17
      ],
      [
        19,
        28
      ],
      [
        138,
        55
      ],
      [
        20,
        95
      ],
      [
        140,
        138
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "dune-crescent-bridges-entry-forum",
        "kind": "formal-chamber",
        "rect": [
          68,
          10,
          80,
          21
        ]
      },
      {
        "id": "dune-crescent-bridges-room-1",
        "kind": "guest-area",
        "rect": [
          13,
          22,
          25,
          32
        ]
      },
      {
        "id": "dune-crescent-bridges-room-2",
        "kind": "consular-office",
        "rect": [
          132,
          49,
          144,
          59
        ]
      },
      {
        "id": "dune-crescent-bridges-room-3",
        "kind": "treaty-archive",
        "rect": [
          14,
          89,
          26,
          99
        ]
      },
      {
        "id": "dune-crescent-bridges-room-4",
        "kind": "hospitality",
        "rect": [
          134,
          132,
          146,
          142
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          67,
          10,
          81,
          22
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          12,
          21,
          26,
          33
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          131,
          48,
          145,
          60
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          13,
          88,
          27,
          100
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 8
      },
      {
        "rect": [
          133,
          131,
          147,
          143
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "dune-crescent-bridges",
      163,
      177,
      27,
      54,
      94,
      137,
      "gallery-variant-1",
      1001
    ],
    "profile": "dune-crescent-bridges",
    "sourceAuthoredName": "Sirocco Crescent Embassy"
  },
  {
    "id": "r4:embassy:enchanted-forest:small:02",
    "type": "embassy",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 2,
    "bounds": [
      103,
      22,
      133
    ],
    "wings": [
      [
        44,
        7,
        64,
        126
      ],
      [
        7,
        14,
        37,
        34
      ],
      [
        35,
        20,
        46,
        28
      ],
      [
        58,
        31,
        93,
        53
      ],
      [
        62,
        40,
        60,
        44
      ],
      [
        9,
        61,
        36,
        85
      ],
      [
        34,
        70,
        46,
        76
      ],
      [
        62,
        91,
        94,
        109
      ],
      [
        62,
        96,
        64,
        104
      ],
      [
        32,
        32,
        40,
        51
      ],
      [
        67,
        47,
        68,
        95
      ],
      [
        18,
        109,
        70,
        121
      ]
    ],
    "notches": [
      [
        51,
        57,
        56,
        63
      ]
    ],
    "octagons": [
      [
        22,
        24,
        6,
        9
      ],
      [
        78,
        100,
        8,
        10
      ]
    ],
    "skyline": [
      [
        51,
        13,
        57,
        19,
        14
      ],
      [
        19,
        21,
        25,
        27,
        16
      ],
      [
        72,
        39,
        78,
        45,
        12
      ],
      [
        19,
        70,
        25,
        76,
        14
      ],
      [
        75,
        97,
        81,
        103,
        16
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
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 47,
        "to": 61,
        "door": 54,
        "facing": "north"
      }
    ],
    "windows": [
      [
        47,
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
        24,
        "west"
      ],
      [
        93,
        42,
        "east"
      ],
      [
        9,
        73,
        "west"
      ],
      [
        94,
        100,
        "east"
      ]
    ],
    "fixtures": [
      [
        54,
        17
      ],
      [
        22,
        25
      ],
      [
        75,
        43
      ],
      [
        22,
        74
      ],
      [
        78,
        101
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "loomed-forest-galleries-entry-forum",
        "kind": "formal-chamber",
        "rect": [
          48,
          10,
          60,
          21
        ]
      },
      {
        "id": "loomed-forest-galleries-room-1",
        "kind": "guest-area",
        "rect": [
          16,
          19,
          28,
          29
        ]
      },
      {
        "id": "loomed-forest-galleries-room-2",
        "kind": "consular-office",
        "rect": [
          69,
          37,
          81,
          47
        ]
      },
      {
        "id": "loomed-forest-galleries-room-3",
        "kind": "treaty-archive",
        "rect": [
          16,
          68,
          28,
          78
        ]
      },
      {
        "id": "loomed-forest-galleries-room-4",
        "kind": "hospitality",
        "rect": [
          72,
          95,
          84,
          105
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          47,
          10,
          61,
          22
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          15,
          18,
          29,
          30
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          68,
          36,
          82,
          48
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          15,
          67,
          29,
          79
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          71,
          94,
          85,
          106
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "loomed-forest-galleries",
      103,
      133,
      24,
      42,
      73,
      100,
      "gallery-variant-2",
      1002
    ],
    "profile": "loomed-forest-galleries",
    "sourceAuthoredName": "Verdant Loom Legation"
  },
  {
    "id": "r4:embassy:mountain:medium:02",
    "type": "embassy",
    "biome": "mountain",
    "size": "medium",
    "variant": 2,
    "bounds": [
      131,
      22,
      161
    ],
    "wings": [
      [
        49,
        7,
        71,
        154
      ],
      [
        8,
        21,
        41,
        42
      ],
      [
        39,
        29,
        51,
        33
      ],
      [
        100,
        46,
        125,
        69
      ],
      [
        69,
        54,
        102,
        60
      ],
      [
        10,
        84,
        40,
        109
      ],
      [
        38,
        92,
        51,
        100
      ],
      [
        86,
        117,
        121,
        136
      ],
      [
        69,
        124,
        88,
        128
      ],
      [
        15,
        41,
        45,
        67
      ],
      [
        73,
        64,
        112,
        108
      ],
      [
        20,
        103,
        46,
        134
      ],
      [
        71,
        138,
        98,
        151
      ]
    ],
    "notches": [
      [
        58,
        52,
        62,
        55
      ]
    ],
    "octagons": [
      [
        24,
        31,
        4,
        10
      ],
      [
        103,
        126,
        5,
        11
      ],
      [
        72,
        136,
        5,
        8
      ]
    ],
    "skyline": [
      [
        57,
        13,
        63,
        19,
        15
      ],
      [
        21,
        28,
        27,
        34,
        17
      ],
      [
        109,
        54,
        115,
        60,
        13
      ],
      [
        22,
        93,
        28,
        99,
        15
      ],
      [
        100,
        123,
        106,
        129,
        17
      ],
      [
        56,
        142,
        63,
        148,
        16
      ]
    ],
    "entry": [
      60,
      7
    ],
    "porch": [
      56,
      3,
      64,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 53,
        "to": 67,
        "door": 60,
        "facing": "north"
      }
    ],
    "windows": [
      [
        53,
        7,
        "south"
      ],
      [
        67,
        7,
        "south"
      ],
      [
        8,
        31,
        "west"
      ],
      [
        125,
        57,
        "east"
      ],
      [
        10,
        96,
        "west"
      ],
      [
        121,
        126,
        "east"
      ]
    ],
    "fixtures": [
      [
        60,
        17
      ],
      [
        24,
        32
      ],
      [
        112,
        58
      ],
      [
        25,
        97
      ],
      [
        103,
        127
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "ridge-switchback-courts-entry-forum",
        "kind": "formal-chamber",
        "rect": [
          54,
          10,
          66,
          21
        ]
      },
      {
        "id": "ridge-switchback-courts-room-1",
        "kind": "guest-area",
        "rect": [
          18,
          26,
          30,
          36
        ]
      },
      {
        "id": "ridge-switchback-courts-room-2",
        "kind": "consular-office",
        "rect": [
          106,
          52,
          118,
          62
        ]
      },
      {
        "id": "ridge-switchback-courts-room-3",
        "kind": "treaty-archive",
        "rect": [
          19,
          91,
          31,
          101
        ]
      },
      {
        "id": "ridge-switchback-courts-room-4",
        "kind": "hospitality",
        "rect": [
          97,
          121,
          109,
          131
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          53,
          10,
          67,
          22
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          17,
          25,
          31,
          37
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 8
      },
      {
        "rect": [
          105,
          51,
          119,
          63
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          18,
          90,
          32,
          102
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          96,
          120,
          110,
          132
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 5
      }
    ],
    "signature": [
      "ridge-switchback-courts",
      131,
      161,
      31,
      57,
      96,
      126,
      "gallery-variant-3",
      1003
    ],
    "profile": "ridge-switchback-courts",
    "sourceAuthoredName": "Ridgewake Switchback Embassy"
  },
  {
    "id": "r4:grand-archive:temperate:small:01",
    "type": "grand-archive",
    "biome": "temperate",
    "size": "small",
    "variant": 1,
    "bounds": [
      107,
      22,
      139
    ],
    "wings": [
      [
        48,
        7,
        64,
        132
      ],
      [
        9,
        13,
        45,
        35
      ],
      [
        43,
        21,
        50,
        27
      ],
      [
        72,
        36,
        100,
        60
      ],
      [
        62,
        44,
        74,
        52
      ],
      [
        5,
        67,
        38,
        85
      ],
      [
        36,
        74,
        50,
        78
      ],
      [
        76,
        97,
        101,
        117
      ],
      [
        62,
        104,
        78,
        110
      ],
      [
        15,
        31,
        39,
        68
      ],
      [
        70,
        58,
        95,
        95
      ],
      [
        36,
        125,
        72,
        129
      ]
    ],
    "notches": [
      [
        53,
        62,
        58,
        68
      ]
    ],
    "octagons": [
      [
        27,
        24,
        5,
        7
      ],
      [
        88,
        107,
        6,
        12
      ]
    ],
    "skyline": [
      [
        53,
        13,
        59,
        19,
        16
      ],
      [
        24,
        21,
        30,
        27,
        12
      ],
      [
        83,
        45,
        89,
        51,
        14
      ],
      [
        18,
        73,
        24,
        79,
        16
      ],
      [
        85,
        104,
        91,
        110,
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
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 49,
        "to": 63,
        "door": 56,
        "facing": "north"
      }
    ],
    "windows": [
      [
        49,
        7,
        "south"
      ],
      [
        63,
        7,
        "south"
      ],
      [
        9,
        24,
        "west"
      ],
      [
        100,
        48,
        "east"
      ],
      [
        5,
        76,
        "west"
      ],
      [
        101,
        107,
        "east"
      ]
    ],
    "fixtures": [
      [
        56,
        17
      ],
      [
        27,
        25
      ],
      [
        86,
        49
      ],
      [
        21,
        77
      ],
      [
        88,
        108
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "bellwater-ring-library-entry-forum",
        "kind": "consultation-room",
        "rect": [
          50,
          10,
          62,
          21
        ]
      },
      {
        "id": "bellwater-ring-library-room-1",
        "kind": "scriptorium",
        "rect": [
          21,
          19,
          33,
          29
        ]
      },
      {
        "id": "bellwater-ring-library-room-2",
        "kind": "cataloguing",
        "rect": [
          80,
          43,
          92,
          53
        ]
      },
      {
        "id": "bellwater-ring-library-room-3",
        "kind": "records-vault",
        "rect": [
          15,
          71,
          27,
          81
        ]
      },
      {
        "id": "bellwater-ring-library-room-4",
        "kind": "copying-gallery",
        "rect": [
          82,
          102,
          94,
          112
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          49,
          10,
          63,
          22
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          20,
          18,
          34,
          30
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          79,
          42,
          93,
          54
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          14,
          70,
          28,
          82
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          81,
          101,
          95,
          113
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "bellwater-ring-library",
      107,
      139,
      24,
      48,
      76,
      107,
      "gallery-variant-4",
      1004
    ],
    "profile": "bellwater-ring-library",
    "sourceAuthoredName": "Bellwater Octagonal Ledger"
  },
  {
    "id": "r4:grand-archive:snow:large:03",
    "type": "grand-archive",
    "biome": "snow",
    "size": "large",
    "variant": 3,
    "bounds": [
      165,
      22,
      179
    ],
    "wings": [
      [
        67,
        7,
        85,
        172
      ],
      [
        10,
        21,
        36,
        44
      ],
      [
        34,
        28,
        69,
        36
      ],
      [
        126,
        44,
        157,
        69
      ],
      [
        83,
        54,
        128,
        58
      ],
      [
        6,
        95,
        42,
        114
      ],
      [
        40,
        101,
        69,
        107
      ],
      [
        130,
        129,
        158,
        150
      ],
      [
        83,
        135,
        132,
        143
      ],
      [
        19,
        44,
        54,
        121
      ],
      [
        97,
        64,
        150,
        127
      ],
      [
        63,
        153,
        112,
        169
      ],
      [
        18,
        113,
        51,
        147
      ]
    ],
    "notches": [
      [
        74,
        52,
        78,
        55
      ]
    ],
    "octagons": [
      [
        23,
        32,
        6,
        8
      ],
      [
        144,
        139,
        7,
        8
      ],
      [
        66,
        72,
        4,
        7
      ]
    ],
    "skyline": [
      [
        73,
        13,
        79,
        19,
        17
      ],
      [
        20,
        29,
        26,
        35,
        13
      ],
      [
        138,
        53,
        144,
        59,
        15
      ],
      [
        21,
        101,
        27,
        107,
        17
      ],
      [
        141,
        136,
        147,
        142,
        13
      ]
    ],
    "entry": [
      76,
      7
    ],
    "porch": [
      72,
      3,
      80,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 69,
        "to": 83,
        "door": 76,
        "facing": "north"
      }
    ],
    "windows": [
      [
        69,
        7,
        "south"
      ],
      [
        83,
        7,
        "south"
      ],
      [
        10,
        32,
        "west"
      ],
      [
        157,
        56,
        "east"
      ],
      [
        6,
        104,
        "west"
      ],
      [
        158,
        139,
        "east"
      ]
    ],
    "fixtures": [
      [
        76,
        17
      ],
      [
        23,
        33
      ],
      [
        141,
        57
      ],
      [
        24,
        105
      ],
      [
        144,
        140
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "glacier-triptych-vaults-entry-forum",
        "kind": "consultation-room",
        "rect": [
          70,
          10,
          82,
          21
        ]
      },
      {
        "id": "glacier-triptych-vaults-room-1",
        "kind": "scriptorium",
        "rect": [
          17,
          27,
          29,
          37
        ]
      },
      {
        "id": "glacier-triptych-vaults-room-2",
        "kind": "cataloguing",
        "rect": [
          135,
          51,
          147,
          61
        ]
      },
      {
        "id": "glacier-triptych-vaults-room-3",
        "kind": "records-vault",
        "rect": [
          18,
          99,
          30,
          109
        ]
      },
      {
        "id": "glacier-triptych-vaults-room-4",
        "kind": "copying-gallery",
        "rect": [
          138,
          134,
          150,
          144
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          69,
          10,
          83,
          22
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          16,
          26,
          30,
          38
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          134,
          50,
          148,
          62
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          17,
          98,
          31,
          110
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 8
      },
      {
        "rect": [
          137,
          133,
          151,
          145
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "glacier-triptych-vaults",
      165,
      179,
      32,
      56,
      104,
      139,
      "gallery-variant-5",
      1005
    ],
    "profile": "glacier-triptych-vaults",
    "sourceAuthoredName": "Polar Crown Grand Archive"
  },
  {
    "id": "r4:grand-archive:enchanted-forest:medium:02",
    "type": "grand-archive",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 2,
    "bounds": [
      129,
      22,
      159
    ],
    "wings": [
      [
        59,
        7,
        79,
        152
      ],
      [
        5,
        17,
        34,
        41
      ],
      [
        32,
        27,
        61,
        31
      ],
      [
        86,
        45,
        120,
        63
      ],
      [
        77,
        51,
        88,
        57
      ],
      [
        7,
        80,
        33,
        100
      ],
      [
        31,
        86,
        61,
        94
      ],
      [
        90,
        113,
        121,
        135
      ],
      [
        77,
        122,
        92,
        126
      ],
      [
        13,
        42,
        52,
        101
      ],
      [
        83,
        65,
        114,
        116
      ],
      [
        58,
        135,
        106,
        150
      ]
    ],
    "notches": [
      [
        66,
        72,
        71,
        78
      ]
    ],
    "octagons": [
      [
        19,
        29,
        4,
        9
      ],
      [
        105,
        124,
        8,
        9
      ],
      [
        81,
        134,
        5,
        8
      ]
    ],
    "skyline": [
      [
        66,
        13,
        72,
        19,
        12
      ],
      [
        16,
        26,
        22,
        32,
        14
      ],
      [
        100,
        51,
        106,
        57,
        16
      ],
      [
        17,
        87,
        23,
        93,
        12
      ],
      [
        102,
        121,
        108,
        127,
        14
      ],
      [
        65,
        140,
        72,
        146,
        14
      ]
    ],
    "entry": [
      69,
      7
    ],
    "porch": [
      65,
      3,
      73,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 62,
        "to": 76,
        "door": 69,
        "facing": "north"
      }
    ],
    "windows": [
      [
        62,
        7,
        "south"
      ],
      [
        76,
        7,
        "south"
      ],
      [
        5,
        29,
        "west"
      ],
      [
        120,
        54,
        "east"
      ],
      [
        7,
        90,
        "west"
      ],
      [
        121,
        124,
        "east"
      ]
    ],
    "fixtures": [
      [
        69,
        17
      ],
      [
        19,
        30
      ],
      [
        103,
        55
      ],
      [
        20,
        91
      ],
      [
        105,
        125
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "root-mirror-rotunda-entry-forum",
        "kind": "consultation-room",
        "rect": [
          63,
          10,
          75,
          21
        ]
      },
      {
        "id": "root-mirror-rotunda-room-1",
        "kind": "scriptorium",
        "rect": [
          13,
          24,
          25,
          34
        ]
      },
      {
        "id": "root-mirror-rotunda-room-2",
        "kind": "cataloguing",
        "rect": [
          97,
          49,
          109,
          59
        ]
      },
      {
        "id": "root-mirror-rotunda-room-3",
        "kind": "records-vault",
        "rect": [
          14,
          85,
          26,
          95
        ]
      },
      {
        "id": "root-mirror-rotunda-room-4",
        "kind": "copying-gallery",
        "rect": [
          99,
          119,
          111,
          129
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          62,
          10,
          76,
          22
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          12,
          23,
          26,
          35
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          96,
          48,
          110,
          60
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          13,
          84,
          27,
          96
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          98,
          118,
          112,
          130
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "root-mirror-rotunda",
      129,
      159,
      29,
      54,
      90,
      124,
      "gallery-variant-6",
      1006
    ],
    "profile": "root-mirror-rotunda",
    "sourceAuthoredName": "Rootweave Mirror Library"
  },
  {
    "id": "r4:grand-archive:mountain:small:01",
    "type": "grand-archive",
    "biome": "mountain",
    "size": "small",
    "variant": 1,
    "bounds": [
      109,
      22,
      143
    ],
    "wings": [
      [
        39,
        7,
        61,
        136
      ],
      [
        6,
        14,
        38,
        39
      ],
      [
        36,
        23,
        41,
        29
      ],
      [
        75,
        36,
        99,
        55
      ],
      [
        59,
        41,
        77,
        49
      ],
      [
        8,
        72,
        37,
        93
      ],
      [
        35,
        80,
        41,
        84
      ],
      [
        66,
        101,
        100,
        124
      ],
      [
        59,
        109,
        68,
        115
      ],
      [
        12,
        36,
        34,
        73
      ],
      [
        66,
        52,
        93,
        104
      ],
      [
        14,
        121,
        58,
        135
      ],
      [
        65,
        92,
        79,
        119
      ]
    ],
    "notches": [
      [
        48,
        43,
        52,
        46
      ]
    ],
    "octagons": [
      [
        22,
        26,
        5,
        10
      ],
      [
        83,
        112,
        5,
        10
      ]
    ],
    "skyline": [
      [
        47,
        13,
        53,
        19,
        13
      ],
      [
        19,
        23,
        25,
        29,
        15
      ],
      [
        84,
        42,
        90,
        48,
        17
      ],
      [
        19,
        79,
        25,
        85,
        13
      ],
      [
        80,
        109,
        86,
        115,
        15
      ]
    ],
    "entry": [
      50,
      7
    ],
    "porch": [
      46,
      3,
      54,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 43,
        "to": 57,
        "door": 50,
        "facing": "north"
      }
    ],
    "windows": [
      [
        43,
        7,
        "south"
      ],
      [
        57,
        7,
        "south"
      ],
      [
        6,
        26,
        "west"
      ],
      [
        99,
        45,
        "east"
      ],
      [
        8,
        82,
        "west"
      ],
      [
        100,
        112,
        "east"
      ]
    ],
    "fixtures": [
      [
        50,
        17
      ],
      [
        22,
        27
      ],
      [
        87,
        46
      ],
      [
        22,
        83
      ],
      [
        83,
        113
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "basalt-spiral-halls-entry-forum",
        "kind": "consultation-room",
        "rect": [
          44,
          10,
          56,
          21
        ]
      },
      {
        "id": "basalt-spiral-halls-room-1",
        "kind": "scriptorium",
        "rect": [
          16,
          21,
          28,
          31
        ]
      },
      {
        "id": "basalt-spiral-halls-room-2",
        "kind": "cataloguing",
        "rect": [
          81,
          40,
          93,
          50
        ]
      },
      {
        "id": "basalt-spiral-halls-room-3",
        "kind": "records-vault",
        "rect": [
          16,
          77,
          28,
          87
        ]
      },
      {
        "id": "basalt-spiral-halls-room-4",
        "kind": "copying-gallery",
        "rect": [
          77,
          107,
          89,
          117
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          43,
          10,
          57,
          22
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          15,
          20,
          29,
          32
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 8
      },
      {
        "rect": [
          80,
          39,
          94,
          51
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          15,
          76,
          29,
          88
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          76,
          106,
          90,
          118
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 5
      }
    ],
    "signature": [
      "basalt-spiral-halls",
      109,
      143,
      26,
      45,
      82,
      112,
      "gallery-variant-7",
      1007
    ],
    "profile": "basalt-spiral-halls",
    "sourceAuthoredName": "Basalt Spiral Scriptorium"
  },
  {
    "id": "r4:observatory:temperate:medium:02",
    "type": "observatory",
    "biome": "temperate",
    "size": "medium",
    "variant": 2,
    "bounds": [
      133,
      22,
      163
    ],
    "wings": [
      [
        63,
        7,
        79,
        156
      ],
      [
        7,
        22,
        42,
        40
      ],
      [
        40,
        27,
        65,
        35
      ],
      [
        100,
        42,
        127,
        62
      ],
      [
        77,
        50,
        102,
        54
      ],
      [
        9,
        82,
        41,
        104
      ],
      [
        39,
        90,
        65,
        96
      ],
      [
        99,
        118,
        123,
        142
      ],
      [
        77,
        126,
        101,
        134
      ],
      [
        19,
        36,
        54,
        85
      ],
      [
        88,
        63,
        109,
        120
      ],
      [
        56,
        145,
        90,
        153
      ],
      [
        90,
        103,
        108,
        124
      ]
    ],
    "notches": [
      [
        68,
        72,
        73,
        78
      ]
    ],
    "octagons": [
      [
        24,
        31,
        6,
        7
      ],
      [
        111,
        130,
        6,
        11
      ]
    ],
    "skyline": [
      [
        68,
        13,
        74,
        19,
        14
      ],
      [
        21,
        28,
        27,
        34,
        16
      ],
      [
        110,
        49,
        116,
        55,
        12
      ],
      [
        22,
        90,
        28,
        96,
        14
      ],
      [
        108,
        127,
        114,
        133,
        16
      ]
    ],
    "entry": [
      71,
      7
    ],
    "porch": [
      67,
      3,
      75,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 64,
        "to": 78,
        "door": 71,
        "facing": "north"
      }
    ],
    "windows": [
      [
        64,
        7,
        "south"
      ],
      [
        78,
        7,
        "south"
      ],
      [
        7,
        31,
        "west"
      ],
      [
        127,
        52,
        "east"
      ],
      [
        9,
        93,
        "west"
      ],
      [
        123,
        130,
        "east"
      ]
    ],
    "fixtures": [
      [
        71,
        17
      ],
      [
        24,
        32
      ],
      [
        113,
        53
      ],
      [
        25,
        94
      ],
      [
        111,
        131
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "parallax-compass-ring-entry-forum",
        "kind": "instrument-room",
        "rect": [
          65,
          10,
          77,
          21
        ]
      },
      {
        "id": "parallax-compass-ring-room-1",
        "kind": "star-charts",
        "rect": [
          18,
          26,
          30,
          36
        ]
      },
      {
        "id": "parallax-compass-ring-room-2",
        "kind": "lens-workshop",
        "rect": [
          107,
          47,
          119,
          57
        ]
      },
      {
        "id": "parallax-compass-ring-room-3",
        "kind": "observation-deck",
        "rect": [
          19,
          88,
          31,
          98
        ]
      },
      {
        "id": "parallax-compass-ring-room-4",
        "kind": "public-lecture",
        "rect": [
          105,
          125,
          117,
          135
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          64,
          10,
          78,
          22
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          17,
          25,
          31,
          37
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          106,
          46,
          120,
          58
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          18,
          87,
          32,
          99
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          104,
          124,
          118,
          136
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "parallax-compass-ring",
      133,
      163,
      31,
      52,
      93,
      130,
      "gallery-variant-8",
      1008
    ],
    "profile": "parallax-compass-ring",
    "sourceAuthoredName": "Windrose Parallax Court"
  },
  {
    "id": "r4:observatory:desert:small:03",
    "type": "observatory",
    "biome": "desert",
    "size": "small",
    "variant": 3,
    "bounds": [
      111,
      22,
      147
    ],
    "wings": [
      [
        43,
        7,
        61,
        140
      ],
      [
        8,
        16,
        33,
        35
      ],
      [
        31,
        23,
        45,
        27
      ],
      [
        74,
        38,
        104,
        59
      ],
      [
        59,
        45,
        76,
        51
      ],
      [
        10,
        75,
        45,
        98
      ],
      [
        43,
        82,
        45,
        90
      ],
      [
        78,
        102,
        105,
        127
      ],
      [
        59,
        112,
        80,
        116
      ],
      [
        13,
        38,
        37,
        80
      ],
      [
        67,
        55,
        100,
        103
      ],
      [
        62,
        126,
        98,
        138
      ]
    ],
    "notches": [
      [
        50,
        44,
        54,
        47
      ]
    ],
    "octagons": [
      [
        20,
        25,
        4,
        8
      ],
      [
        91,
        114,
        7,
        12
      ],
      [
        64,
        124,
        5,
        8
      ],
      [
        42,
        64,
        4,
        7
      ]
    ],
    "skyline": [
      [
        49,
        13,
        55,
        19,
        15
      ],
      [
        17,
        22,
        23,
        28,
        17
      ],
      [
        86,
        45,
        92,
        51,
        13
      ],
      [
        24,
        83,
        30,
        89,
        15
      ],
      [
        88,
        111,
        94,
        117,
        17
      ],
      [
        48,
        128,
        55,
        134,
        17
      ]
    ],
    "entry": [
      52,
      7
    ],
    "porch": [
      48,
      3,
      56,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 45,
        "to": 59,
        "door": 52,
        "facing": "north"
      }
    ],
    "windows": [
      [
        45,
        7,
        "south"
      ],
      [
        59,
        7,
        "south"
      ],
      [
        8,
        25,
        "west"
      ],
      [
        104,
        48,
        "east"
      ],
      [
        10,
        86,
        "west"
      ],
      [
        105,
        114,
        "east"
      ]
    ],
    "fixtures": [
      [
        52,
        17
      ],
      [
        20,
        26
      ],
      [
        89,
        49
      ],
      [
        27,
        87
      ],
      [
        91,
        115
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "eclipse-sawtooth-stair-entry-forum",
        "kind": "instrument-room",
        "rect": [
          46,
          10,
          58,
          21
        ]
      },
      {
        "id": "eclipse-sawtooth-stair-room-1",
        "kind": "star-charts",
        "rect": [
          14,
          20,
          26,
          30
        ]
      },
      {
        "id": "eclipse-sawtooth-stair-room-2",
        "kind": "lens-workshop",
        "rect": [
          83,
          43,
          95,
          53
        ]
      },
      {
        "id": "eclipse-sawtooth-stair-room-3",
        "kind": "observation-deck",
        "rect": [
          21,
          81,
          33,
          91
        ]
      },
      {
        "id": "eclipse-sawtooth-stair-room-4",
        "kind": "public-lecture",
        "rect": [
          85,
          109,
          97,
          119
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          45,
          10,
          59,
          22
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          13,
          19,
          27,
          31
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          82,
          42,
          96,
          54
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          20,
          80,
          34,
          92
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 8
      },
      {
        "rect": [
          84,
          108,
          98,
          120
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "eclipse-sawtooth-stair",
      111,
      147,
      25,
      48,
      86,
      114,
      "gallery-variant-9",
      1009
    ],
    "profile": "eclipse-sawtooth-stair",
    "sourceAuthoredName": "Saffron Eclipse Needle"
  },
  {
    "id": "r4:observatory:snow:medium:03",
    "type": "observatory",
    "biome": "snow",
    "size": "medium",
    "variant": 3,
    "bounds": [
      137,
      22,
      167
    ],
    "wings": [
      [
        52,
        7,
        72,
        160
      ],
      [
        9,
        24,
        37,
        44
      ],
      [
        35,
        31,
        54,
        37
      ],
      [
        96,
        44,
        129,
        66
      ],
      [
        70,
        51,
        98,
        59
      ],
      [
        5,
        83,
        30,
        107
      ],
      [
        28,
        93,
        54,
        97
      ],
      [
        100,
        119,
        130,
        137
      ],
      [
        70,
        125,
        102,
        131
      ],
      [
        19,
        44,
        44,
        109
      ],
      [
        80,
        67,
        118,
        142
      ],
      [
        14,
        141,
        116,
        155
      ]
    ],
    "notches": [
      [
        59,
        75,
        64,
        81
      ]
    ],
    "octagons": [
      [
        23,
        34,
        5,
        9
      ],
      [
        115,
        128,
        8,
        8
      ]
    ],
    "skyline": [
      [
        59,
        13,
        65,
        19,
        16
      ],
      [
        20,
        31,
        26,
        37,
        12
      ],
      [
        109,
        52,
        115,
        58,
        14
      ],
      [
        14,
        92,
        20,
        98,
        16
      ],
      [
        112,
        125,
        118,
        131,
        12
      ]
    ],
    "entry": [
      62,
      7
    ],
    "porch": [
      58,
      3,
      66,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 55,
        "to": 69,
        "door": 62,
        "facing": "north"
      }
    ],
    "windows": [
      [
        55,
        7,
        "south"
      ],
      [
        69,
        7,
        "south"
      ],
      [
        9,
        34,
        "west"
      ],
      [
        129,
        55,
        "east"
      ],
      [
        5,
        95,
        "west"
      ],
      [
        130,
        128,
        "east"
      ]
    ],
    "fixtures": [
      [
        62,
        17
      ],
      [
        23,
        35
      ],
      [
        112,
        56
      ],
      [
        17,
        96
      ],
      [
        115,
        129
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "halo-horseshoe-array-entry-forum",
        "kind": "instrument-room",
        "rect": [
          56,
          10,
          68,
          21
        ]
      },
      {
        "id": "halo-horseshoe-array-room-1",
        "kind": "star-charts",
        "rect": [
          17,
          29,
          29,
          39
        ]
      },
      {
        "id": "halo-horseshoe-array-room-2",
        "kind": "lens-workshop",
        "rect": [
          106,
          50,
          118,
          60
        ]
      },
      {
        "id": "halo-horseshoe-array-room-3",
        "kind": "observation-deck",
        "rect": [
          11,
          90,
          23,
          100
        ]
      },
      {
        "id": "halo-horseshoe-array-room-4",
        "kind": "public-lecture",
        "rect": [
          109,
          123,
          121,
          133
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          55,
          10,
          69,
          22
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          16,
          28,
          30,
          40
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 7
      },
      {
        "rect": [
          105,
          49,
          119,
          61
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          10,
          89,
          24,
          101
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          108,
          122,
          122,
          134
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "halo-horseshoe-array",
      137,
      167,
      34,
      55,
      95,
      128,
      "gallery-variant-10",
      1010
    ],
    "profile": "halo-horseshoe-array",
    "sourceAuthoredName": "Glacier Halo Array"
  },
  {
    "id": "r4:observatory:mountain:large:02",
    "type": "observatory",
    "biome": "mountain",
    "size": "large",
    "variant": 2,
    "bounds": [
      169,
      22,
      181
    ],
    "wings": [
      [
        78,
        7,
        100,
        174
      ],
      [
        10,
        23,
        41,
        44
      ],
      [
        39,
        29,
        80,
        37
      ],
      [
        124,
        54,
        160,
        77
      ],
      [
        98,
        63,
        126,
        67
      ],
      [
        6,
        99,
        34,
        124
      ],
      [
        32,
        108,
        80,
        114
      ],
      [
        128,
        137,
        161,
        156
      ],
      [
        98,
        142,
        130,
        150
      ],
      [
        19,
        45,
        66,
        119
      ],
      [
        106,
        73,
        148,
        137
      ],
      [
        96,
        151,
        145,
        173
      ],
      [
        19,
        123,
        62,
        157
      ]
    ],
    "notches": [
      [
        87,
        57,
        91,
        60
      ]
    ],
    "octagons": [
      [
        25,
        33,
        6,
        10
      ],
      [
        144,
        146,
        5,
        9
      ]
    ],
    "skyline": [
      [
        86,
        13,
        92,
        19,
        17
      ],
      [
        22,
        30,
        28,
        36,
        13
      ],
      [
        139,
        62,
        145,
        68,
        15
      ],
      [
        17,
        108,
        23,
        114,
        17
      ],
      [
        141,
        143,
        147,
        149,
        13
      ]
    ],
    "entry": [
      89,
      7
    ],
    "porch": [
      85,
      3,
      93,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 82,
        "to": 96,
        "door": 89,
        "facing": "north"
      }
    ],
    "windows": [
      [
        82,
        7,
        "south"
      ],
      [
        96,
        7,
        "south"
      ],
      [
        10,
        33,
        "west"
      ],
      [
        160,
        65,
        "east"
      ],
      [
        6,
        111,
        "west"
      ],
      [
        161,
        146,
        "east"
      ]
    ],
    "fixtures": [
      [
        89,
        17
      ],
      [
        25,
        34
      ],
      [
        142,
        66
      ],
      [
        20,
        112
      ],
      [
        144,
        147
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "skyneedle-cliff-dais-entry-forum",
        "kind": "instrument-room",
        "rect": [
          83,
          10,
          95,
          21
        ]
      },
      {
        "id": "skyneedle-cliff-dais-room-1",
        "kind": "star-charts",
        "rect": [
          19,
          28,
          31,
          38
        ]
      },
      {
        "id": "skyneedle-cliff-dais-room-2",
        "kind": "lens-workshop",
        "rect": [
          136,
          60,
          148,
          70
        ]
      },
      {
        "id": "skyneedle-cliff-dais-room-3",
        "kind": "observation-deck",
        "rect": [
          14,
          106,
          26,
          116
        ]
      },
      {
        "id": "skyneedle-cliff-dais-room-4",
        "kind": "public-lecture",
        "rect": [
          138,
          141,
          150,
          151
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          82,
          10,
          96,
          22
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 5
      },
      {
        "rect": [
          18,
          27,
          32,
          39
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 8
      },
      {
        "rect": [
          135,
          59,
          149,
          71
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 7
      },
      {
        "rect": [
          13,
          105,
          27,
          117
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          137,
          140,
          151,
          152
        ],
        "profile": "saw",
        "axis": "x",
        "high": 15,
        "period": 5
      }
    ],
    "signature": [
      "skyneedle-cliff-dais",
      169,
      181,
      33,
      65,
      111,
      146,
      "gallery-variant-11",
      1011
    ],
    "profile": "skyneedle-cliff-dais",
    "sourceAuthoredName": "High Veil Skyneedle"
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
export function buildA2Wave11StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave11StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE11_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
