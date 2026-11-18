// Roadmap A2 Wave 6: twelve distinctive original asymmetrical arcade, ring and cliffside source plans.
// Immutable 200 previously accepted building blueprints remain in separate protected modules.
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
    "id": "r4:castle-palace:enchanted-forest:small:03",
    "type": "castle-palace",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 3,
    "bounds": [
      97,
      22,
      121
    ],
    "wings": [
      [
        39,
        7,
        57,
        110
      ],
      [
        3,
        18,
        42,
        37
      ],
      [
        54,
        39,
        93,
        56
      ],
      [
        4,
        69,
        42,
        86
      ],
      [
        54,
        91,
        92,
        109
      ],
      [
        6,
        30,
        43,
        83
      ],
      [
        53,
        52,
        88,
        102
      ],
      [
        32,
        104,
        68,
        113
      ],
      [
        25,
        79,
        32,
        108
      ]
    ],
    "notches": [
      [
        45,
        54,
        50,
        59
      ],
      [
        29,
        100,
        32,
        104
      ]
    ],
    "octagons": [
      [
        10,
        27,
        5,
        8
      ],
      [
        85,
        100,
        6,
        9
      ],
      [
        80,
        50,
        5,
        8
      ]
    ],
    "skyline": [
      [
        45,
        12,
        51,
        18,
        13
      ],
      [
        20,
        25,
        24,
        29,
        12
      ],
      [
        71,
        45,
        75,
        49,
        14
      ],
      [
        21,
        75,
        25,
        79,
        16
      ],
      [
        71,
        98,
        75,
        102,
        13
      ]
    ],
    "entry": [
      48,
      7
    ],
    "porch": [
      44,
      3,
      52,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 41,
        "to": 55,
        "door": 48,
        "facing": "north"
      }
    ],
    "windows": [
      [
        41,
        7,
        "south"
      ],
      [
        55,
        7,
        "south"
      ],
      [
        3,
        27,
        "west"
      ],
      [
        93,
        47,
        "east"
      ],
      [
        4,
        77,
        "west"
      ],
      [
        92,
        100,
        "east"
      ]
    ],
    "fixtures": [
      [
        48,
        17
      ],
      [
        22,
        28
      ],
      [
        73,
        48
      ],
      [
        23,
        78
      ],
      [
        73,
        101
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "petal-ring-keep-forum",
        "kind": "entrance-hall",
        "rect": [
          42,
          10,
          54,
          21
        ]
      },
      {
        "id": "petal-ring-keep-room-1",
        "kind": "tower-or-wing",
        "rect": [
          16,
          22,
          28,
          32
        ]
      },
      {
        "id": "petal-ring-keep-room-2",
        "kind": "council",
        "rect": [
          67,
          42,
          79,
          52
        ]
      },
      {
        "id": "petal-ring-keep-room-3",
        "kind": "grand-chamber",
        "rect": [
          17,
          72,
          29,
          82
        ]
      },
      {
        "id": "petal-ring-keep-room-4",
        "kind": "tower-or-wing",
        "rect": [
          67,
          95,
          79,
          105
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          42,
          11,
          54,
          21
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          16,
          22,
          28,
          32
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          67,
          42,
          79,
          52
        ],
        "profile": "shed",
        "axis": "z",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          17,
          72,
          29,
          82
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          67,
          95,
          79,
          105
        ],
        "profile": "gable",
        "axis": "z",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "petal-ring-keep",
      97,
      121,
      18,
      39,
      69,
      91,
      8,
      120
    ],
    "profile": "petal-ring-keep",
    "sourceAuthoredName": "Thornwake Petal Throne"
  },
  {
    "id": "r4:castle-palace:mountain:medium:02",
    "type": "castle-palace",
    "biome": "mountain",
    "size": "medium",
    "variant": 2,
    "bounds": [
      129,
      22,
      143
    ],
    "wings": [
      [
        55,
        7,
        83,
        132
      ],
      [
        4,
        29,
        58,
        49
      ],
      [
        80,
        44,
        124,
        62
      ],
      [
        5,
        82,
        58,
        100
      ],
      [
        80,
        109,
        123,
        128
      ],
      [
        6,
        37,
        58,
        98
      ],
      [
        79,
        61,
        119,
        125
      ],
      [
        39,
        93,
        51,
        128
      ],
      [
        81,
        119,
        96,
        128
      ]
    ],
    "notches": [
      [
        66,
        63,
        71,
        68
      ],
      [
        85,
        94,
        88,
        98
      ]
    ],
    "octagons": [
      [
        11,
        38,
        6,
        9
      ],
      [
        116,
        118,
        7,
        10
      ]
    ],
    "skyline": [
      [
        66,
        12,
        72,
        18,
        14
      ],
      [
        29,
        37,
        33,
        41,
        13
      ],
      [
        100,
        51,
        104,
        55,
        15
      ],
      [
        29,
        89,
        33,
        93,
        12
      ],
      [
        99,
        116,
        103,
        120,
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
        4,
        39,
        "west"
      ],
      [
        124,
        53,
        "east"
      ],
      [
        5,
        91,
        "west"
      ],
      [
        123,
        118,
        "east"
      ]
    ],
    "fixtures": [
      [
        69,
        17
      ],
      [
        31,
        40
      ],
      [
        102,
        54
      ],
      [
        31,
        92
      ],
      [
        101,
        119
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "counterfort-terraces-forum",
        "kind": "entrance-hall",
        "rect": [
          63,
          10,
          75,
          21
        ]
      },
      {
        "id": "counterfort-terraces-room-1",
        "kind": "tower-or-wing",
        "rect": [
          25,
          34,
          37,
          44
        ]
      },
      {
        "id": "counterfort-terraces-room-2",
        "kind": "council",
        "rect": [
          96,
          48,
          108,
          58
        ]
      },
      {
        "id": "counterfort-terraces-room-3",
        "kind": "grand-chamber",
        "rect": [
          25,
          86,
          37,
          96
        ]
      },
      {
        "id": "counterfort-terraces-room-4",
        "kind": "tower-or-wing",
        "rect": [
          95,
          113,
          107,
          123
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          63,
          11,
          75,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          25,
          34,
          37,
          44
        ],
        "profile": "shed",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          96,
          48,
          108,
          58
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          25,
          86,
          37,
          96
        ],
        "profile": "gable",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          95,
          113,
          107,
          123
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      }
    ],
    "signature": [
      "counterfort-terraces",
      129,
      143,
      29,
      44,
      82,
      109,
      9,
      121
    ],
    "profile": "counterfort-terraces",
    "sourceAuthoredName": "Skybreak Counterfort Palace"
  },
  {
    "id": "r4:embassy:temperate:medium:03",
    "type": "embassy",
    "biome": "temperate",
    "size": "medium",
    "variant": 3,
    "bounds": [
      115,
      22,
      139
    ],
    "wings": [
      [
        40,
        7,
        64,
        128
      ],
      [
        5,
        21,
        43,
        42
      ],
      [
        61,
        41,
        109,
        60
      ],
      [
        6,
        77,
        43,
        96
      ],
      [
        61,
        103,
        108,
        123
      ],
      [
        7,
        37,
        44,
        95
      ],
      [
        60,
        53,
        103,
        119
      ],
      [
        12,
        118,
        100,
        123
      ],
      [
        64,
        27,
        83,
        45
      ]
    ],
    "notches": [
      [
        49,
        59,
        54,
        64
      ],
      [
        33,
        112,
        36,
        116
      ]
    ],
    "octagons": [
      [
        12,
        30,
        7,
        10
      ],
      [
        101,
        112,
        8,
        11
      ]
    ],
    "skyline": [
      [
        49,
        12,
        55,
        18,
        15
      ],
      [
        22,
        29,
        26,
        33,
        14
      ],
      [
        83,
        48,
        87,
        52,
        16
      ],
      [
        22,
        84,
        26,
        88,
        13
      ],
      [
        82,
        111,
        86,
        115,
        15
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
        5,
        31,
        "west"
      ],
      [
        109,
        50,
        "east"
      ],
      [
        6,
        86,
        "west"
      ],
      [
        109,
        113,
        "east"
      ]
    ],
    "fixtures": [
      [
        52,
        17
      ],
      [
        24,
        32
      ],
      [
        85,
        51
      ],
      [
        24,
        87
      ],
      [
        84,
        114
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "six-bridges-gallery-forum",
        "kind": "formal-chamber",
        "rect": [
          46,
          10,
          58,
          21
        ]
      },
      {
        "id": "six-bridges-gallery-room-1",
        "kind": "guest-area",
        "rect": [
          18,
          26,
          30,
          36
        ]
      },
      {
        "id": "six-bridges-gallery-room-2",
        "kind": "consular-office",
        "rect": [
          79,
          45,
          91,
          55
        ]
      },
      {
        "id": "six-bridges-gallery-room-3",
        "kind": "treaty-archive",
        "rect": [
          18,
          81,
          30,
          91
        ]
      },
      {
        "id": "six-bridges-gallery-room-4",
        "kind": "hospitality",
        "rect": [
          78,
          108,
          90,
          118
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          46,
          11,
          58,
          21
        ],
        "profile": "shed",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          18,
          26,
          30,
          36
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          79,
          45,
          91,
          55
        ],
        "profile": "gable",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          18,
          81,
          30,
          91
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          78,
          108,
          90,
          118
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "six-bridges-gallery",
      115,
      139,
      21,
      41,
      77,
      103,
      10,
      122
    ],
    "profile": "six-bridges-gallery",
    "sourceAuthoredName": "Willowglass Treaty Bridges"
  },
  {
    "id": "r4:embassy:desert:large:02",
    "type": "embassy",
    "biome": "desert",
    "size": "large",
    "variant": 2,
    "bounds": [
      151,
      22,
      165
    ],
    "wings": [
      [
        65,
        7,
        95,
        154
      ],
      [
        6,
        24,
        68,
        46
      ],
      [
        92,
        49,
        147,
        69
      ],
      [
        7,
        89,
        68,
        106
      ],
      [
        92,
        128,
        146,
        149
      ],
      [
        10,
        38,
        69,
        106
      ],
      [
        91,
        67,
        140,
        141
      ],
      [
        16,
        143,
        137,
        150
      ],
      [
        53,
        54,
        63,
        102
      ]
    ],
    "notches": [
      [
        77,
        69,
        82,
        74
      ],
      [
        96,
        101,
        99,
        105
      ]
    ],
    "octagons": [
      [
        13,
        33,
        8,
        11
      ],
      [
        139,
        137,
        6,
        12
      ],
      [
        134,
        60,
        5,
        8
      ]
    ],
    "skyline": [
      [
        77,
        12,
        83,
        18,
        16
      ],
      [
        35,
        33,
        39,
        37,
        15
      ],
      [
        117,
        57,
        121,
        61,
        12
      ],
      [
        35,
        95,
        39,
        99,
        14
      ],
      [
        117,
        136,
        121,
        140,
        16
      ]
    ],
    "entry": [
      80,
      7
    ],
    "porch": [
      76,
      3,
      84,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 73,
        "to": 87,
        "door": 80,
        "facing": "north"
      }
    ],
    "windows": [
      [
        73,
        7,
        "south"
      ],
      [
        87,
        7,
        "south"
      ],
      [
        5,
        35,
        "west"
      ],
      [
        147,
        59,
        "east"
      ],
      [
        7,
        97,
        "west"
      ],
      [
        146,
        138,
        "east"
      ]
    ],
    "fixtures": [
      [
        80,
        17
      ],
      [
        37,
        36
      ],
      [
        119,
        60
      ],
      [
        37,
        98
      ],
      [
        119,
        139
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "crescent-dune-courts-forum",
        "kind": "formal-chamber",
        "rect": [
          74,
          10,
          86,
          21
        ]
      },
      {
        "id": "crescent-dune-courts-room-1",
        "kind": "guest-area",
        "rect": [
          31,
          30,
          43,
          40
        ]
      },
      {
        "id": "crescent-dune-courts-room-2",
        "kind": "consular-office",
        "rect": [
          113,
          54,
          125,
          64
        ]
      },
      {
        "id": "crescent-dune-courts-room-3",
        "kind": "treaty-archive",
        "rect": [
          31,
          92,
          43,
          102
        ]
      },
      {
        "id": "crescent-dune-courts-room-4",
        "kind": "hospitality",
        "rect": [
          113,
          133,
          125,
          143
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          74,
          11,
          86,
          21
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          31,
          30,
          43,
          40
        ],
        "profile": "gable",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          113,
          54,
          125,
          64
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 6
      },
      {
        "rect": [
          31,
          92,
          43,
          102
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          113,
          133,
          125,
          143
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "crescent-dune-courts",
      151,
      165,
      24,
      49,
      89,
      128,
      11,
      123
    ],
    "profile": "crescent-dune-courts",
    "sourceAuthoredName": "Saffron Sun-Court Consulate"
  },
  {
    "id": "r4:embassy:snow:small:02",
    "type": "embassy",
    "biome": "snow",
    "size": "small",
    "variant": 2,
    "bounds": [
      91,
      22,
      117
    ],
    "wings": [
      [
        32,
        7,
        52,
        106
      ],
      [
        3,
        17,
        35,
        36
      ],
      [
        49,
        34,
        86,
        55
      ],
      [
        4,
        61,
        35,
        79
      ],
      [
        49,
        87,
        85,
        105
      ],
      [
        7,
        28,
        37,
        75
      ],
      [
        48,
        49,
        79,
        97
      ],
      [
        20,
        100,
        56,
        106
      ],
      [
        9,
        69,
        23,
        95
      ]
    ],
    "notches": [
      [
        39,
        47,
        44,
        52
      ],
      [
        23,
        96,
        26,
        100
      ]
    ],
    "octagons": [
      [
        10,
        26,
        5,
        8
      ],
      [
        78,
        96,
        7,
        9
      ]
    ],
    "skyline": [
      [
        39,
        12,
        45,
        18,
        13
      ],
      [
        17,
        24,
        21,
        28,
        16
      ],
      [
        65,
        42,
        69,
        46,
        13
      ],
      [
        17,
        68,
        21,
        72,
        15
      ],
      [
        65,
        94,
        69,
        98,
        12
      ]
    ],
    "entry": [
      42,
      7
    ],
    "porch": [
      38,
      3,
      46,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 35,
        "to": 49,
        "door": 42,
        "facing": "north"
      }
    ],
    "windows": [
      [
        35,
        7,
        "south"
      ],
      [
        49,
        7,
        "south"
      ],
      [
        3,
        26,
        "west"
      ],
      [
        86,
        44,
        "east"
      ],
      [
        4,
        70,
        "west"
      ],
      [
        85,
        96,
        "east"
      ]
    ],
    "fixtures": [
      [
        42,
        17
      ],
      [
        19,
        27
      ],
      [
        67,
        45
      ],
      [
        19,
        71
      ],
      [
        67,
        97
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "ice-prow-accord-forum",
        "kind": "formal-chamber",
        "rect": [
          36,
          10,
          48,
          21
        ]
      },
      {
        "id": "ice-prow-accord-room-1",
        "kind": "guest-area",
        "rect": [
          13,
          21,
          25,
          31
        ]
      },
      {
        "id": "ice-prow-accord-room-2",
        "kind": "consular-office",
        "rect": [
          61,
          39,
          73,
          49
        ]
      },
      {
        "id": "ice-prow-accord-room-3",
        "kind": "treaty-archive",
        "rect": [
          13,
          65,
          25,
          75
        ]
      },
      {
        "id": "ice-prow-accord-room-4",
        "kind": "hospitality",
        "rect": [
          61,
          91,
          73,
          101
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          36,
          11,
          48,
          21
        ],
        "profile": "gable",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          13,
          21,
          25,
          31
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          61,
          39,
          73,
          49
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          13,
          65,
          25,
          75
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          61,
          91,
          73,
          101
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "ice-prow-accord",
      91,
      117,
      17,
      34,
      61,
      87,
      12,
      124
    ],
    "profile": "ice-prow-accord",
    "sourceAuthoredName": "Frostwhistle Bannerhouse"
  },
  {
    "id": "r4:embassy:mountain:medium:03",
    "type": "embassy",
    "biome": "mountain",
    "size": "medium",
    "variant": 3,
    "bounds": [
      125,
      22,
      149
    ],
    "wings": [
      [
        57,
        7,
        79,
        138
      ],
      [
        4,
        28,
        60,
        48
      ],
      [
        76,
        55,
        119,
        72
      ],
      [
        5,
        85,
        60,
        104
      ],
      [
        76,
        116,
        118,
        135
      ],
      [
        7,
        44,
        60,
        95
      ],
      [
        76,
        66,
        113,
        131
      ],
      [
        58,
        129,
        105,
        141
      ],
      [
        9,
        97,
        46,
        132
      ]
    ],
    "notches": [
      [
        65,
        70,
        70,
        75
      ],
      [
        84,
        97,
        87,
        101
      ]
    ],
    "octagons": [
      [
        11,
        37,
        6,
        9
      ],
      [
        111,
        125,
        8,
        10
      ]
    ],
    "skyline": [
      [
        65,
        12,
        71,
        18,
        14
      ],
      [
        30,
        36,
        34,
        40,
        12
      ],
      [
        95,
        61,
        99,
        65,
        14
      ],
      [
        30,
        92,
        34,
        96,
        16
      ],
      [
        95,
        123,
        99,
        127,
        13
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
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 61,
        "to": 75,
        "door": 68,
        "facing": "north"
      }
    ],
    "windows": [
      [
        61,
        7,
        "south"
      ],
      [
        75,
        7,
        "south"
      ],
      [
        4,
        38,
        "west"
      ],
      [
        119,
        63,
        "east"
      ],
      [
        5,
        94,
        "west"
      ],
      [
        119,
        125,
        "east"
      ]
    ],
    "fixtures": [
      [
        68,
        17
      ],
      [
        32,
        39
      ],
      [
        97,
        64
      ],
      [
        32,
        95
      ],
      [
        97,
        126
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "switchback-embassy-forum",
        "kind": "formal-chamber",
        "rect": [
          62,
          10,
          74,
          21
        ]
      },
      {
        "id": "switchback-embassy-room-1",
        "kind": "guest-area",
        "rect": [
          26,
          33,
          38,
          43
        ]
      },
      {
        "id": "switchback-embassy-room-2",
        "kind": "consular-office",
        "rect": [
          91,
          58,
          103,
          68
        ]
      },
      {
        "id": "switchback-embassy-room-3",
        "kind": "treaty-archive",
        "rect": [
          26,
          89,
          38,
          99
        ]
      },
      {
        "id": "switchback-embassy-room-4",
        "kind": "hospitality",
        "rect": [
          91,
          120,
          103,
          130
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          62,
          11,
          74,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          26,
          33,
          38,
          43
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          91,
          58,
          103,
          68
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          26,
          89,
          38,
          99
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          91,
          120,
          103,
          130
        ],
        "profile": "hip",
        "axis": "x",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "switchback-embassy",
      125,
      149,
      28,
      55,
      85,
      116,
      13,
      125
    ],
    "profile": "switchback-embassy",
    "sourceAuthoredName": "Summit Accord Switchback"
  },
  {
    "id": "r4:grand-archive:temperate:large:02",
    "type": "grand-archive",
    "biome": "temperate",
    "size": "large",
    "variant": 2,
    "bounds": [
      147,
      22,
      163
    ],
    "wings": [
      [
        58,
        7,
        90,
        152
      ],
      [
        5,
        23,
        61,
        44
      ],
      [
        87,
        46,
        143,
        64
      ],
      [
        6,
        91,
        61,
        108
      ],
      [
        87,
        127,
        142,
        147
      ],
      [
        8,
        35,
        62,
        105
      ],
      [
        86,
        59,
        138,
        138
      ],
      [
        58,
        140,
        94,
        149
      ],
      [
        51,
        101,
        58,
        144
      ]
    ],
    "notches": [
      [
        71,
        68,
        76,
        73
      ],
      [
        55,
        136,
        58,
        140
      ]
    ],
    "octagons": [
      [
        12,
        32,
        7,
        10
      ],
      [
        135,
        136,
        6,
        11
      ],
      [
        130,
        57,
        5,
        8
      ]
    ],
    "skyline": [
      [
        71,
        12,
        77,
        18,
        15
      ],
      [
        31,
        31,
        35,
        35,
        13
      ],
      [
        113,
        53,
        117,
        57,
        15
      ],
      [
        31,
        97,
        35,
        101,
        12
      ],
      [
        112,
        135,
        116,
        139,
        14
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
        5,
        33,
        "west"
      ],
      [
        143,
        55,
        "east"
      ],
      [
        6,
        99,
        "west"
      ],
      [
        142,
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
        33,
        34
      ],
      [
        115,
        56
      ],
      [
        33,
        100
      ],
      [
        114,
        138
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "seven-bridges-vault-forum",
        "kind": "consultation-room",
        "rect": [
          68,
          10,
          80,
          21
        ]
      },
      {
        "id": "seven-bridges-vault-room-1",
        "kind": "scriptorium",
        "rect": [
          27,
          28,
          39,
          38
        ]
      },
      {
        "id": "seven-bridges-vault-room-2",
        "kind": "cataloguing",
        "rect": [
          109,
          50,
          121,
          60
        ]
      },
      {
        "id": "seven-bridges-vault-room-3",
        "kind": "records-vault",
        "rect": [
          27,
          94,
          39,
          104
        ]
      },
      {
        "id": "seven-bridges-vault-room-4",
        "kind": "copying-gallery",
        "rect": [
          108,
          132,
          120,
          142
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          68,
          11,
          80,
          21
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          27,
          28,
          39,
          38
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          109,
          50,
          121,
          60
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          27,
          94,
          39,
          104
        ],
        "profile": "hip",
        "axis": "x",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          108,
          132,
          120,
          142
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      }
    ],
    "signature": [
      "seven-bridges-vault",
      147,
      163,
      23,
      46,
      91,
      127,
      8,
      126
    ],
    "profile": "seven-bridges-vault",
    "sourceAuthoredName": "Seven Quays Grand Archive"
  },
  {
    "id": "r4:grand-archive:desert:medium:03",
    "type": "grand-archive",
    "biome": "desert",
    "size": "medium",
    "variant": 3,
    "bounds": [
      119,
      22,
      143
    ],
    "wings": [
      [
        42,
        7,
        66,
        132
      ],
      [
        6,
        28,
        45,
        50
      ],
      [
        63,
        45,
        114,
        64
      ],
      [
        7,
        75,
        45,
        93
      ],
      [
        63,
        109,
        113,
        130
      ],
      [
        8,
        36,
        45,
        91
      ],
      [
        62,
        62,
        109,
        125
      ],
      [
        24,
        86,
        36,
        128
      ],
      [
        66,
        119,
        81,
        128
      ]
    ],
    "notches": [
      [
        51,
        60,
        56,
        65
      ],
      [
        70,
        87,
        73,
        91
      ]
    ],
    "octagons": [
      [
        13,
        37,
        8,
        11
      ],
      [
        106,
        118,
        7,
        12
      ]
    ],
    "skyline": [
      [
        51,
        12,
        57,
        18,
        16
      ],
      [
        23,
        37,
        27,
        41,
        14
      ],
      [
        86,
        52,
        90,
        56,
        16
      ],
      [
        24,
        82,
        28,
        86,
        13
      ],
      [
        86,
        117,
        90,
        121,
        15
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
        5,
        39,
        "west"
      ],
      [
        114,
        54,
        "east"
      ],
      [
        7,
        84,
        "west"
      ],
      [
        113,
        119,
        "east"
      ]
    ],
    "fixtures": [
      [
        54,
        17
      ],
      [
        25,
        40
      ],
      [
        88,
        55
      ],
      [
        26,
        85
      ],
      [
        88,
        120
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "compass-quadrants-forum",
        "kind": "consultation-room",
        "rect": [
          48,
          10,
          60,
          21
        ]
      },
      {
        "id": "compass-quadrants-room-1",
        "kind": "scriptorium",
        "rect": [
          19,
          34,
          31,
          44
        ]
      },
      {
        "id": "compass-quadrants-room-2",
        "kind": "cataloguing",
        "rect": [
          82,
          49,
          94,
          59
        ]
      },
      {
        "id": "compass-quadrants-room-3",
        "kind": "records-vault",
        "rect": [
          20,
          79,
          32,
          89
        ]
      },
      {
        "id": "compass-quadrants-room-4",
        "kind": "copying-gallery",
        "rect": [
          82,
          114,
          94,
          124
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          48,
          11,
          60,
          21
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          19,
          34,
          31,
          44
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          82,
          49,
          94,
          59
        ],
        "profile": "hip",
        "axis": "x",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          20,
          79,
          32,
          89
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          82,
          114,
          94,
          124
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "compass-quadrants",
      119,
      143,
      28,
      45,
      75,
      109,
      9,
      127
    ],
    "profile": "compass-quadrants",
    "sourceAuthoredName": "Amber Compass Scriptorium"
  },
  {
    "id": "r4:grand-archive:snow:small:02",
    "type": "grand-archive",
    "biome": "snow",
    "size": "small",
    "variant": 2,
    "bounds": [
      95,
      22,
      125
    ],
    "wings": [
      [
        40,
        7,
        58,
        114
      ],
      [
        3,
        18,
        43,
        37
      ],
      [
        55,
        39,
        89,
        59
      ],
      [
        4,
        68,
        43,
        87
      ],
      [
        55,
        91,
        88,
        109
      ],
      [
        5,
        34,
        44,
        86
      ],
      [
        54,
        51,
        83,
        107
      ],
      [
        10,
        106,
        80,
        111
      ],
      [
        61,
        24,
        80,
        43
      ]
    ],
    "notches": [
      [
        46,
        53,
        51,
        58
      ],
      [
        30,
        100,
        33,
        104
      ]
    ],
    "octagons": [
      [
        10,
        27,
        5,
        8
      ],
      [
        81,
        100,
        8,
        9
      ]
    ],
    "skyline": [
      [
        46,
        12,
        52,
        18,
        13
      ],
      [
        21,
        25,
        25,
        29,
        15
      ],
      [
        70,
        47,
        74,
        51,
        12
      ],
      [
        21,
        75,
        25,
        79,
        14
      ],
      [
        69,
        98,
        73,
        102,
        16
      ]
    ],
    "entry": [
      49,
      7
    ],
    "porch": [
      45,
      3,
      53,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 42,
        "to": 56,
        "door": 49,
        "facing": "north"
      }
    ],
    "windows": [
      [
        42,
        7,
        "south"
      ],
      [
        56,
        7,
        "south"
      ],
      [
        3,
        27,
        "west"
      ],
      [
        89,
        49,
        "east"
      ],
      [
        4,
        77,
        "west"
      ],
      [
        89,
        100,
        "east"
      ]
    ],
    "fixtures": [
      [
        49,
        17
      ],
      [
        23,
        28
      ],
      [
        72,
        50
      ],
      [
        23,
        78
      ],
      [
        71,
        101
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "glacier-bastion-steps-forum",
        "kind": "consultation-room",
        "rect": [
          43,
          10,
          55,
          21
        ]
      },
      {
        "id": "glacier-bastion-steps-room-1",
        "kind": "scriptorium",
        "rect": [
          17,
          22,
          29,
          32
        ]
      },
      {
        "id": "glacier-bastion-steps-room-2",
        "kind": "cataloguing",
        "rect": [
          66,
          44,
          78,
          54
        ]
      },
      {
        "id": "glacier-bastion-steps-room-3",
        "kind": "records-vault",
        "rect": [
          17,
          72,
          29,
          82
        ]
      },
      {
        "id": "glacier-bastion-steps-room-4",
        "kind": "copying-gallery",
        "rect": [
          65,
          95,
          77,
          105
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          43,
          11,
          55,
          21
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          17,
          22,
          29,
          32
        ],
        "profile": "hip",
        "axis": "x",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          66,
          44,
          78,
          54
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 6
      },
      {
        "rect": [
          17,
          72,
          29,
          82
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          65,
          95,
          77,
          105
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "glacier-bastion-steps",
      95,
      125,
      18,
      39,
      68,
      91,
      10,
      128
    ],
    "profile": "glacier-bastion-steps",
    "sourceAuthoredName": "Snowlume Vault of Echoes"
  },
  {
    "id": "r4:observatory:temperate:small:02",
    "type": "observatory",
    "biome": "temperate",
    "size": "small",
    "variant": 2,
    "bounds": [
      91,
      22,
      121
    ],
    "wings": [
      [
        33,
        7,
        53,
        110
      ],
      [
        4,
        21,
        36,
        41
      ],
      [
        50,
        34,
        87,
        55
      ],
      [
        5,
        66,
        36,
        83
      ],
      [
        50,
        92,
        86,
        111
      ],
      [
        8,
        35,
        37,
        83
      ],
      [
        49,
        52,
        80,
        105
      ],
      [
        14,
        107,
        77,
        114
      ],
      [
        16,
        39,
        26,
        79
      ],
      [
        50,
        17,
        82,
        30
      ],
      [
        4,
        108,
        21,
        117
      ],
      [
        53,
        72,
        83,
        90
      ]
    ],
    "notches": [
      [
        40,
        50,
        45,
        55
      ],
      [
        59,
        78,
        62,
        82
      ],
      [
        65,
        22,
        70,
        26
      ]
    ],
    "octagons": [
      [
        11,
        30,
        6,
        9
      ],
      [
        79,
        101,
        6,
        10
      ],
      [
        74,
        45,
        5,
        8
      ],
      [
        73,
        24,
        6,
        9
      ]
    ],
    "skyline": [
      [
        40,
        12,
        46,
        18,
        14
      ],
      [
        18,
        29,
        22,
        33,
        16
      ],
      [
        66,
        42,
        70,
        46,
        13
      ],
      [
        18,
        72,
        22,
        76,
        15
      ],
      [
        66,
        99,
        70,
        103,
        12
      ]
    ],
    "entry": [
      43,
      7
    ],
    "porch": [
      39,
      3,
      47,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 36,
        "to": 50,
        "door": 43,
        "facing": "north"
      }
    ],
    "windows": [
      [
        36,
        7,
        "south"
      ],
      [
        50,
        7,
        "south"
      ],
      [
        4,
        31,
        "west"
      ],
      [
        87,
        44,
        "east"
      ],
      [
        5,
        74,
        "west"
      ],
      [
        86,
        101,
        "east"
      ]
    ],
    "fixtures": [
      [
        43,
        17
      ],
      [
        20,
        32
      ],
      [
        68,
        45
      ],
      [
        20,
        75
      ],
      [
        68,
        102
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "windneedle-cross-forum",
        "kind": "instrument-room",
        "rect": [
          37,
          10,
          49,
          21
        ]
      },
      {
        "id": "windneedle-cross-room-1",
        "kind": "star-charts",
        "rect": [
          14,
          26,
          26,
          36
        ]
      },
      {
        "id": "windneedle-cross-room-2",
        "kind": "lens-workshop",
        "rect": [
          62,
          39,
          74,
          49
        ]
      },
      {
        "id": "windneedle-cross-room-3",
        "kind": "observation-deck",
        "rect": [
          14,
          69,
          26,
          79
        ]
      },
      {
        "id": "windneedle-cross-room-4",
        "kind": "public-lecture",
        "rect": [
          62,
          96,
          74,
          106
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          37,
          11,
          49,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          14,
          26,
          26,
          36
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          62,
          39,
          74,
          49
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          14,
          69,
          26,
          79
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          62,
          96,
          74,
          106
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "windneedle-cross",
      91,
      121,
      21,
      34,
      66,
      92,
      11,
      129,
      "forward-solar-lens",
      "lateral-equinox-bridge",
      "asymmetric-rear-stair"
    ],
    "profile": "windneedle-cross",
    "sourceAuthoredName": "Peregrine Sundial Needle"
  },
  {
    "id": "r4:observatory:enchanted-forest:medium:01",
    "type": "observatory",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 1,
    "bounds": [
      131,
      22,
      147
    ],
    "wings": [
      [
        56,
        7,
        82,
        136
      ],
      [
        5,
        26,
        59,
        47
      ],
      [
        79,
        47,
        126,
        64
      ],
      [
        6,
        83,
        59,
        101
      ],
      [
        79,
        112,
        125,
        132
      ],
      [
        9,
        37,
        61,
        97
      ],
      [
        78,
        62,
        119,
        122
      ],
      [
        47,
        125,
        83,
        131
      ],
      [
        11,
        91,
        50,
        120
      ]
    ],
    "notches": [
      [
        66,
        65,
        71,
        70
      ],
      [
        50,
        121,
        53,
        125
      ]
    ],
    "octagons": [
      [
        12,
        35,
        7,
        10
      ],
      [
        118,
        121,
        7,
        11
      ]
    ],
    "skyline": [
      [
        66,
        12,
        72,
        18,
        15
      ],
      [
        30,
        34,
        34,
        38,
        12
      ],
      [
        100,
        53,
        104,
        57,
        14
      ],
      [
        30,
        90,
        34,
        94,
        16
      ],
      [
        100,
        120,
        104,
        124,
        13
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
        36,
        "west"
      ],
      [
        126,
        55,
        "east"
      ],
      [
        6,
        92,
        "west"
      ],
      [
        125,
        122,
        "east"
      ]
    ],
    "fixtures": [
      [
        69,
        17
      ],
      [
        32,
        37
      ],
      [
        102,
        56
      ],
      [
        32,
        93
      ],
      [
        102,
        123
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "moon-grove-ring-forum",
        "kind": "instrument-room",
        "rect": [
          63,
          10,
          75,
          21
        ]
      },
      {
        "id": "moon-grove-ring-room-1",
        "kind": "star-charts",
        "rect": [
          26,
          31,
          38,
          41
        ]
      },
      {
        "id": "moon-grove-ring-room-2",
        "kind": "lens-workshop",
        "rect": [
          96,
          50,
          108,
          60
        ]
      },
      {
        "id": "moon-grove-ring-room-3",
        "kind": "observation-deck",
        "rect": [
          26,
          87,
          38,
          97
        ]
      },
      {
        "id": "moon-grove-ring-room-4",
        "kind": "public-lecture",
        "rect": [
          96,
          117,
          108,
          127
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          63,
          11,
          75,
          21
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          26,
          31,
          38,
          41
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          96,
          50,
          108,
          60
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          26,
          87,
          38,
          97
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          96,
          117,
          108,
          127
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "moon-grove-ring",
      131,
      147,
      26,
      47,
      83,
      112,
      12,
      130
    ],
    "profile": "moon-grove-ring",
    "sourceAuthoredName": "Moonorchard Lens Crescent"
  },
  {
    "id": "r4:observatory:mountain:large:01",
    "type": "observatory",
    "biome": "mountain",
    "size": "large",
    "variant": 1,
    "bounds": [
      163,
      22,
      175
    ],
    "wings": [
      [
        59,
        7,
        93,
        164
      ],
      [
        6,
        30,
        62,
        52
      ],
      [
        90,
        52,
        157,
        70
      ],
      [
        7,
        92,
        62,
        111
      ],
      [
        90,
        135,
        156,
        156
      ],
      [
        9,
        46,
        62,
        102
      ],
      [
        90,
        63,
        151,
        150
      ],
      [
        66,
        148,
        143,
        160
      ],
      [
        11,
        104,
        54,
        151
      ]
    ],
    "notches": [
      [
        73,
        72,
        78,
        77
      ],
      [
        92,
        104,
        95,
        108
      ]
    ],
    "octagons": [
      [
        13,
        39,
        8,
        11
      ],
      [
        149,
        144,
        8,
        12
      ]
    ],
    "skyline": [
      [
        73,
        12,
        79,
        18,
        16
      ],
      [
        32,
        39,
        36,
        43,
        13
      ],
      [
        121,
        59,
        125,
        63,
        15
      ],
      [
        32,
        99,
        36,
        103,
        12
      ],
      [
        121,
        143,
        125,
        147,
        14
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
        5,
        41,
        "west"
      ],
      [
        157,
        61,
        "east"
      ],
      [
        7,
        101,
        "west"
      ],
      [
        157,
        145,
        "east"
      ]
    ],
    "fixtures": [
      [
        76,
        17
      ],
      [
        34,
        42
      ],
      [
        123,
        62
      ],
      [
        34,
        102
      ],
      [
        123,
        146
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "cliff-star-terraces-forum",
        "kind": "instrument-room",
        "rect": [
          70,
          10,
          82,
          21
        ]
      },
      {
        "id": "cliff-star-terraces-room-1",
        "kind": "star-charts",
        "rect": [
          28,
          36,
          40,
          46
        ]
      },
      {
        "id": "cliff-star-terraces-room-2",
        "kind": "lens-workshop",
        "rect": [
          117,
          56,
          129,
          66
        ]
      },
      {
        "id": "cliff-star-terraces-room-3",
        "kind": "observation-deck",
        "rect": [
          28,
          96,
          40,
          106
        ]
      },
      {
        "id": "cliff-star-terraces-room-4",
        "kind": "public-lecture",
        "rect": [
          117,
          140,
          129,
          150
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          70,
          11,
          82,
          21
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          28,
          36,
          40,
          46
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          117,
          56,
          129,
          66
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          28,
          96,
          40,
          106
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          117,
          140,
          129,
          150
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 5
      }
    ],
    "signature": [
      "cliff-star-terraces",
      163,
      175,
      30,
      52,
      92,
      135,
      13,
      131
    ],
    "profile": "cliff-star-terraces",
    "sourceAuthoredName": "Vesper Peak Star Stair"
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
export function buildA2Wave9StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave9StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE9_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
