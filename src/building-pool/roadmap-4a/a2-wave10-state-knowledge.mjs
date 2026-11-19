// Roadmap A2 Wave10: twelve source-authored embassies, grand archives and observatories.
// The 272 accepted historical designs remain isolated in protected prior modules.
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
    "id": "r4:embassy:temperate:large:01",
    "type": "embassy",
    "biome": "temperate",
    "size": "large",
    "variant": 1,
    "bounds": [
      155,
      22,
      171
    ],
    "wings": [
      [
        67,
        7,
        93,
        163
      ],
      [
        3,
        29,
        70,
        48
      ],
      [
        90,
        51,
        151,
        70
      ],
      [
        4,
        91,
        70,
        109
      ],
      [
        90,
        129,
        150,
        148
      ],
      [
        8,
        42,
        73,
        110
      ],
      [
        87,
        63,
        144,
        142
      ],
      [
        13,
        142,
        138,
        158
      ],
      [
        48,
        97,
        62,
        146
      ],
      [
        88,
        16,
        143,
        34
      ],
      [
        10,
        142,
        69,
        154
      ],
      [
        101,
        34,
        137,
        43
      ]
    ],
    "notches": [
      [
        77,
        71,
        82,
        76
      ],
      [
        62,
        137,
        65,
        141
      ],
      [
        100,
        24,
        105,
        28
      ]
    ],
    "octagons": [
      [
        11,
        39,
        5,
        8
      ],
      [
        143,
        141,
        6,
        9
      ],
      [
        136,
        58,
        4,
        7
      ]
    ],
    "skyline": [
      [
        77,
        12,
        83,
        18,
        13
      ],
      [
        34,
        36,
        38,
        40,
        12
      ],
      [
        118,
        58,
        122,
        62,
        14
      ],
      [
        35,
        98,
        39,
        102,
        16
      ],
      [
        118,
        136,
        122,
        140,
        13
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
        3,
        38,
        "west"
      ],
      [
        151,
        60,
        "east"
      ],
      [
        4,
        100,
        "west"
      ],
      [
        150,
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
        36,
        39
      ],
      [
        120,
        61
      ],
      [
        37,
        101
      ],
      [
        120,
        139
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "tidal-ring-causeway-forum",
        "kind": "formal-chamber",
        "rect": [
          74,
          10,
          86,
          21
        ]
      },
      {
        "id": "tidal-ring-causeway-wing-1",
        "kind": "guest-area",
        "rect": [
          30,
          33,
          42,
          43
        ]
      },
      {
        "id": "tidal-ring-causeway-wing-2",
        "kind": "consular-office",
        "rect": [
          114,
          55,
          126,
          65
        ]
      },
      {
        "id": "tidal-ring-causeway-wing-3",
        "kind": "treaty-archive",
        "rect": [
          31,
          95,
          43,
          105
        ]
      },
      {
        "id": "tidal-ring-causeway-wing-4",
        "kind": "hospitality",
        "rect": [
          114,
          133,
          126,
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
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          30,
          33,
          42,
          43
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          114,
          55,
          126,
          65
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          31,
          95,
          43,
          105
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          114,
          133,
          126,
          143
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "tidal-ring-causeway",
      155,
      171,
      29,
      51,
      91,
      129,
      290,
      "treaty-forward-forecourt",
      "asymmetrical-north-waterside"
    ],
    "profile": "tidal-ring-causeway",
    "sourceAuthoredName": "Marshlight Five-Bridge Embassy"
  },
  {
    "id": "r4:embassy:desert:small:02",
    "type": "embassy",
    "biome": "desert",
    "size": "small",
    "variant": 2,
    "bounds": [
      97,
      22,
      127
    ],
    "wings": [
      [
        34,
        7,
        52,
        119
      ],
      [
        4,
        22,
        37,
        43
      ],
      [
        49,
        39,
        92,
        60
      ],
      [
        5,
        68,
        37,
        88
      ],
      [
        49,
        93,
        91,
        114
      ],
      [
        6,
        36,
        38,
        78
      ],
      [
        48,
        55,
        89,
        110
      ],
      [
        52,
        108,
        86,
        119
      ],
      [
        10,
        78,
        30,
        112
      ]
    ],
    "notches": [
      [
        40,
        53,
        45,
        58
      ],
      [
        58,
        79,
        61,
        83
      ]
    ],
    "octagons": [
      [
        12,
        32,
        6,
        9
      ],
      [
        84,
        105,
        7,
        10
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
        30,
        22,
        34,
        13
      ],
      [
        68,
        47,
        72,
        51,
        15
      ],
      [
        19,
        76,
        23,
        80,
        12
      ],
      [
        68,
        101,
        72,
        105,
        14
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
        32,
        "west"
      ],
      [
        92,
        49,
        "east"
      ],
      [
        5,
        78,
        "west"
      ],
      [
        91,
        103,
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
        33
      ],
      [
        70,
        50
      ],
      [
        21,
        79
      ],
      [
        70,
        104
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "sand-radial-fan-forum",
        "kind": "formal-chamber",
        "rect": [
          37,
          10,
          49,
          21
        ]
      },
      {
        "id": "sand-radial-fan-wing-1",
        "kind": "guest-area",
        "rect": [
          14,
          27,
          26,
          37
        ]
      },
      {
        "id": "sand-radial-fan-wing-2",
        "kind": "consular-office",
        "rect": [
          64,
          44,
          76,
          54
        ]
      },
      {
        "id": "sand-radial-fan-wing-3",
        "kind": "treaty-archive",
        "rect": [
          15,
          73,
          27,
          83
        ]
      },
      {
        "id": "sand-radial-fan-wing-4",
        "kind": "hospitality",
        "rect": [
          64,
          98,
          76,
          108
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
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          14,
          27,
          26,
          37
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          64,
          44,
          76,
          54
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          15,
          73,
          27,
          83
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          64,
          98,
          76,
          108
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "sand-radial-fan",
      97,
      127,
      22,
      39,
      68,
      93,
      291
    ],
    "profile": "sand-radial-fan",
    "sourceAuthoredName": "Serewind Caravan Treaty House"
  },
  {
    "id": "r4:embassy:snow:medium:02",
    "type": "embassy",
    "biome": "snow",
    "size": "medium",
    "variant": 2,
    "bounds": [
      129,
      22,
      151
    ],
    "wings": [
      [
        53,
        7,
        83,
        143
      ],
      [
        5,
        25,
        56,
        48
      ],
      [
        80,
        48,
        123,
        71
      ],
      [
        6,
        84,
        56,
        106
      ],
      [
        80,
        114,
        122,
        137
      ],
      [
        9,
        42,
        59,
        98
      ],
      [
        78,
        59,
        116,
        130
      ],
      [
        17,
        131,
        112,
        136
      ],
      [
        86,
        100,
        108,
        125
      ]
    ],
    "notches": [
      [
        65,
        66,
        70,
        71
      ],
      [
        50,
        122,
        53,
        126
      ]
    ],
    "octagons": [
      [
        13,
        35,
        7,
        10
      ],
      [
        115,
        126,
        5,
        11
      ]
    ],
    "skyline": [
      [
        65,
        12,
        71,
        18,
        15
      ],
      [
        28,
        34,
        32,
        38,
        14
      ],
      [
        99,
        57,
        103,
        61,
        16
      ],
      [
        29,
        93,
        33,
        97,
        13
      ],
      [
        99,
        123,
        103,
        127,
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
        5,
        36,
        "west"
      ],
      [
        123,
        59,
        "east"
      ],
      [
        6,
        95,
        "west"
      ],
      [
        122,
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
        30,
        37
      ],
      [
        101,
        60
      ],
      [
        31,
        96
      ],
      [
        101,
        126
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "ice-ship-crossbar-forum",
        "kind": "formal-chamber",
        "rect": [
          62,
          10,
          74,
          21
        ]
      },
      {
        "id": "ice-ship-crossbar-wing-1",
        "kind": "guest-area",
        "rect": [
          24,
          31,
          36,
          41
        ]
      },
      {
        "id": "ice-ship-crossbar-wing-2",
        "kind": "consular-office",
        "rect": [
          95,
          54,
          107,
          64
        ]
      },
      {
        "id": "ice-ship-crossbar-wing-3",
        "kind": "treaty-archive",
        "rect": [
          25,
          90,
          37,
          100
        ]
      },
      {
        "id": "ice-ship-crossbar-wing-4",
        "kind": "hospitality",
        "rect": [
          95,
          120,
          107,
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
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          24,
          31,
          36,
          41
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          95,
          54,
          107,
          64
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          25,
          90,
          37,
          100
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          95,
          120,
          107,
          130
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "ice-ship-crossbar",
      129,
      151,
      25,
      48,
      84,
      114,
      292
    ],
    "profile": "ice-ship-crossbar",
    "sourceAuthoredName": "Frostbarge Northern Accord"
  },
  {
    "id": "r4:embassy:mountain:large:03",
    "type": "embassy",
    "biome": "mountain",
    "size": "large",
    "variant": 3,
    "bounds": [
      161,
      22,
      173
    ],
    "wings": [
      [
        62,
        7,
        84,
        165
      ],
      [
        6,
        32,
        65,
        57
      ],
      [
        81,
        49,
        154,
        68
      ],
      [
        7,
        93,
        65,
        111
      ],
      [
        81,
        134,
        153,
        159
      ],
      [
        10,
        44,
        67,
        108
      ],
      [
        78,
        63,
        148,
        147
      ],
      [
        11,
        148,
        90,
        161
      ],
      [
        89,
        103,
        142,
        154
      ]
    ],
    "notches": [
      [
        70,
        71,
        75,
        76
      ],
      [
        88,
        104,
        91,
        108
      ]
    ],
    "octagons": [
      [
        14,
        42,
        8,
        8
      ],
      [
        146,
        146,
        6,
        12
      ]
    ],
    "skyline": [
      [
        70,
        12,
        76,
        18,
        16
      ],
      [
        33,
        42,
        37,
        46,
        15
      ],
      [
        115,
        56,
        119,
        60,
        12
      ],
      [
        34,
        100,
        38,
        104,
        14
      ],
      [
        115,
        144,
        119,
        148,
        16
      ]
    ],
    "entry": [
      73,
      7
    ],
    "porch": [
      69,
      3,
      77,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 66,
        "to": 80,
        "door": 73,
        "facing": "north"
      }
    ],
    "windows": [
      [
        66,
        7,
        "south"
      ],
      [
        80,
        7,
        "south"
      ],
      [
        6,
        44,
        "west"
      ],
      [
        154,
        58,
        "east"
      ],
      [
        7,
        102,
        "west"
      ],
      [
        153,
        146,
        "east"
      ]
    ],
    "fixtures": [
      [
        73,
        17
      ],
      [
        35,
        45
      ],
      [
        117,
        59
      ],
      [
        36,
        103
      ],
      [
        117,
        147
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "switchback-hanging-terraces-forum",
        "kind": "formal-chamber",
        "rect": [
          67,
          10,
          79,
          21
        ]
      },
      {
        "id": "switchback-hanging-terraces-wing-1",
        "kind": "guest-area",
        "rect": [
          29,
          39,
          41,
          49
        ]
      },
      {
        "id": "switchback-hanging-terraces-wing-2",
        "kind": "consular-office",
        "rect": [
          111,
          53,
          123,
          63
        ]
      },
      {
        "id": "switchback-hanging-terraces-wing-3",
        "kind": "treaty-archive",
        "rect": [
          30,
          97,
          42,
          107
        ]
      },
      {
        "id": "switchback-hanging-terraces-wing-4",
        "kind": "hospitality",
        "rect": [
          111,
          141,
          123,
          151
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          67,
          11,
          79,
          21
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          29,
          39,
          41,
          49
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          111,
          53,
          123,
          63
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          30,
          97,
          42,
          107
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          111,
          141,
          123,
          151
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "switchback-hanging-terraces",
      161,
      173,
      32,
      49,
      93,
      134,
      293
    ],
    "profile": "switchback-hanging-terraces",
    "sourceAuthoredName": "Cloudpass Cliff Consulate"
  },
  {
    "id": "r4:grand-archive:temperate:small:03",
    "type": "grand-archive",
    "biome": "temperate",
    "size": "small",
    "variant": 3,
    "bounds": [
      97,
      22,
      125
    ],
    "wings": [
      [
        39,
        7,
        63,
        117
      ],
      [
        3,
        19,
        42,
        38
      ],
      [
        60,
        37,
        89,
        58
      ],
      [
        4,
        65,
        42,
        85
      ],
      [
        60,
        92,
        88,
        111
      ],
      [
        7,
        37,
        44,
        78
      ],
      [
        59,
        52,
        83,
        104
      ],
      [
        31,
        106,
        79,
        113
      ],
      [
        9,
        74,
        36,
        111
      ]
    ],
    "notches": [
      [
        48,
        51,
        53,
        56
      ],
      [
        33,
        100,
        36,
        104
      ]
    ],
    "octagons": [
      [
        11,
        29,
        5,
        9
      ],
      [
        81,
        104,
        7,
        9
      ],
      [
        74,
        44,
        4,
        7
      ]
    ],
    "skyline": [
      [
        48,
        12,
        54,
        18,
        17
      ],
      [
        20,
        26,
        24,
        30,
        16
      ],
      [
        72,
        45,
        76,
        49,
        13
      ],
      [
        21,
        73,
        25,
        77,
        15
      ],
      [
        72,
        99,
        76,
        103,
        12
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
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 44,
        "to": 58,
        "door": 51,
        "facing": "north"
      }
    ],
    "windows": [
      [
        44,
        7,
        "south"
      ],
      [
        58,
        7,
        "south"
      ],
      [
        3,
        28,
        "west"
      ],
      [
        89,
        47,
        "east"
      ],
      [
        4,
        75,
        "west"
      ],
      [
        88,
        101,
        "east"
      ]
    ],
    "fixtures": [
      [
        51,
        17
      ],
      [
        22,
        29
      ],
      [
        74,
        48
      ],
      [
        23,
        76
      ],
      [
        74,
        102
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "ringed-water-vault-forum",
        "kind": "consultation-room",
        "rect": [
          45,
          10,
          57,
          21
        ]
      },
      {
        "id": "ringed-water-vault-wing-1",
        "kind": "scriptorium",
        "rect": [
          16,
          23,
          28,
          33
        ]
      },
      {
        "id": "ringed-water-vault-wing-2",
        "kind": "cataloguing",
        "rect": [
          68,
          42,
          80,
          52
        ]
      },
      {
        "id": "ringed-water-vault-wing-3",
        "kind": "records-vault",
        "rect": [
          17,
          70,
          29,
          80
        ]
      },
      {
        "id": "ringed-water-vault-wing-4",
        "kind": "copying-gallery",
        "rect": [
          68,
          96,
          80,
          106
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          45,
          11,
          57,
          21
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          16,
          23,
          28,
          33
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          68,
          42,
          80,
          52
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          17,
          70,
          29,
          80
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          68,
          96,
          80,
          106
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "ringed-water-vault",
      97,
      125,
      19,
      37,
      65,
      92,
      294
    ],
    "profile": "ringed-water-vault",
    "sourceAuthoredName": "Aldermere Circular Cartulary"
  },
  {
    "id": "r4:grand-archive:desert:large:02",
    "type": "grand-archive",
    "biome": "desert",
    "size": "large",
    "variant": 2,
    "bounds": [
      153,
      22,
      173
    ],
    "wings": [
      [
        57,
        7,
        89,
        165
      ],
      [
        4,
        27,
        60,
        48
      ],
      [
        86,
        51,
        149,
        74
      ],
      [
        5,
        92,
        60,
        114
      ],
      [
        86,
        134,
        148,
        155
      ],
      [
        7,
        36,
        62,
        108
      ],
      [
        84,
        70,
        141,
        145
      ],
      [
        12,
        147,
        140,
        160
      ],
      [
        93,
        97,
        112,
        149
      ]
    ],
    "notches": [
      [
        70,
        71,
        75,
        76
      ],
      [
        88,
        103,
        91,
        107
      ]
    ],
    "octagons": [
      [
        12,
        37,
        6,
        10
      ],
      [
        141,
        146,
        5,
        10
      ]
    ],
    "skyline": [
      [
        70,
        12,
        76,
        18,
        13
      ],
      [
        30,
        35,
        34,
        39,
        12
      ],
      [
        115,
        60,
        119,
        64,
        14
      ],
      [
        30,
        101,
        34,
        105,
        16
      ],
      [
        115,
        142,
        119,
        146,
        13
      ]
    ],
    "entry": [
      73,
      7
    ],
    "porch": [
      69,
      3,
      77,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 66,
        "to": 80,
        "door": 73,
        "facing": "north"
      }
    ],
    "windows": [
      [
        66,
        7,
        "south"
      ],
      [
        80,
        7,
        "south"
      ],
      [
        4,
        37,
        "west"
      ],
      [
        149,
        62,
        "east"
      ],
      [
        5,
        103,
        "west"
      ],
      [
        148,
        144,
        "east"
      ]
    ],
    "fixtures": [
      [
        73,
        17
      ],
      [
        32,
        38
      ],
      [
        117,
        63
      ],
      [
        32,
        104
      ],
      [
        117,
        145
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "hourglass-archive-courts-forum",
        "kind": "consultation-room",
        "rect": [
          67,
          10,
          79,
          21
        ]
      },
      {
        "id": "hourglass-archive-courts-wing-1",
        "kind": "scriptorium",
        "rect": [
          26,
          32,
          38,
          42
        ]
      },
      {
        "id": "hourglass-archive-courts-wing-2",
        "kind": "cataloguing",
        "rect": [
          111,
          57,
          123,
          67
        ]
      },
      {
        "id": "hourglass-archive-courts-wing-3",
        "kind": "records-vault",
        "rect": [
          26,
          98,
          38,
          108
        ]
      },
      {
        "id": "hourglass-archive-courts-wing-4",
        "kind": "copying-gallery",
        "rect": [
          111,
          139,
          123,
          149
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          67,
          11,
          79,
          21
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          26,
          32,
          38,
          42
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          111,
          57,
          123,
          67
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          26,
          98,
          38,
          108
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          111,
          139,
          123,
          149
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "hourglass-archive-courts",
      153,
      173,
      27,
      51,
      92,
      134,
      295
    ],
    "profile": "hourglass-archive-courts",
    "sourceAuthoredName": "Tessar Sandclock Grand Archive"
  },
  {
    "id": "r4:grand-archive:snow:medium:02",
    "type": "grand-archive",
    "biome": "snow",
    "size": "medium",
    "variant": 2,
    "bounds": [
      131,
      22,
      147
    ],
    "wings": [
      [
        60,
        7,
        82,
        139
      ],
      [
        5,
        26,
        63,
        49
      ],
      [
        79,
        45,
        126,
        64
      ],
      [
        6,
        82,
        63,
        100
      ],
      [
        79,
        112,
        125,
        135
      ],
      [
        8,
        41,
        65,
        93
      ],
      [
        78,
        58,
        119,
        125
      ],
      [
        41,
        125,
        86,
        134
      ],
      [
        15,
        66,
        54,
        122
      ]
    ],
    "notches": [
      [
        68,
        63,
        73,
        68
      ],
      [
        53,
        120,
        56,
        124
      ]
    ],
    "octagons": [
      [
        13,
        36,
        7,
        8
      ],
      [
        118,
        124,
        6,
        11
      ]
    ],
    "skyline": [
      [
        68,
        12,
        74,
        18,
        14
      ],
      [
        32,
        35,
        36,
        39,
        13
      ],
      [
        100,
        52,
        104,
        56,
        15
      ],
      [
        32,
        89,
        36,
        93,
        12
      ],
      [
        100,
        121,
        104,
        125,
        14
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
        5,
        37,
        "west"
      ],
      [
        126,
        54,
        "east"
      ],
      [
        6,
        91,
        "west"
      ],
      [
        125,
        123,
        "east"
      ]
    ],
    "fixtures": [
      [
        71,
        17
      ],
      [
        34,
        38
      ],
      [
        102,
        55
      ],
      [
        34,
        92
      ],
      [
        102,
        124
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "snow-pier-stagger-forum",
        "kind": "consultation-room",
        "rect": [
          65,
          10,
          77,
          21
        ]
      },
      {
        "id": "snow-pier-stagger-wing-1",
        "kind": "scriptorium",
        "rect": [
          28,
          32,
          40,
          42
        ]
      },
      {
        "id": "snow-pier-stagger-wing-2",
        "kind": "cataloguing",
        "rect": [
          96,
          49,
          108,
          59
        ]
      },
      {
        "id": "snow-pier-stagger-wing-3",
        "kind": "records-vault",
        "rect": [
          28,
          86,
          40,
          96
        ]
      },
      {
        "id": "snow-pier-stagger-wing-4",
        "kind": "copying-gallery",
        "rect": [
          96,
          118,
          108,
          128
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          65,
          11,
          77,
          21
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          28,
          32,
          40,
          42
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          96,
          49,
          108,
          59
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          28,
          86,
          40,
          96
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          96,
          118,
          108,
          128
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "snow-pier-stagger",
      131,
      147,
      26,
      45,
      82,
      112,
      296
    ],
    "profile": "snow-pier-stagger",
    "sourceAuthoredName": "Whiteglass Crown Repository"
  },
  {
    "id": "r4:grand-archive:enchanted-forest:medium:01",
    "type": "grand-archive",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 1,
    "bounds": [
      125,
      22,
      151
    ],
    "wings": [
      [
        42,
        7,
        72,
        143
      ],
      [
        6,
        24,
        45,
        49
      ],
      [
        69,
        47,
        119,
        68
      ],
      [
        7,
        87,
        45,
        107
      ],
      [
        69,
        116,
        118,
        141
      ],
      [
        11,
        42,
        47,
        104
      ],
      [
        68,
        60,
        111,
        134
      ],
      [
        13,
        134,
        106,
        139
      ],
      [
        68,
        100,
        86,
        134
      ]
    ],
    "notches": [
      [
        54,
        67,
        59,
        72
      ],
      [
        72,
        98,
        75,
        102
      ]
    ],
    "octagons": [
      [
        14,
        34,
        8,
        9
      ],
      [
        111,
        128,
        7,
        12
      ]
    ],
    "skyline": [
      [
        54,
        12,
        60,
        18,
        15
      ],
      [
        23,
        34,
        27,
        38,
        14
      ],
      [
        92,
        55,
        96,
        59,
        16
      ],
      [
        24,
        95,
        28,
        99,
        13
      ],
      [
        91,
        126,
        95,
        130,
        15
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
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 50,
        "to": 64,
        "door": 57,
        "facing": "north"
      }
    ],
    "windows": [
      [
        50,
        7,
        "south"
      ],
      [
        64,
        7,
        "south"
      ],
      [
        6,
        36,
        "west"
      ],
      [
        119,
        57,
        "east"
      ],
      [
        7,
        97,
        "west"
      ],
      [
        118,
        128,
        "east"
      ]
    ],
    "fixtures": [
      [
        57,
        17
      ],
      [
        25,
        37
      ],
      [
        94,
        58
      ],
      [
        26,
        98
      ],
      [
        93,
        129
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "rootflower-triskelion-forum",
        "kind": "consultation-room",
        "rect": [
          51,
          10,
          63,
          21
        ]
      },
      {
        "id": "rootflower-triskelion-wing-1",
        "kind": "scriptorium",
        "rect": [
          19,
          31,
          31,
          41
        ]
      },
      {
        "id": "rootflower-triskelion-wing-2",
        "kind": "cataloguing",
        "rect": [
          88,
          52,
          100,
          62
        ]
      },
      {
        "id": "rootflower-triskelion-wing-3",
        "kind": "records-vault",
        "rect": [
          20,
          92,
          32,
          102
        ]
      },
      {
        "id": "rootflower-triskelion-wing-4",
        "kind": "copying-gallery",
        "rect": [
          87,
          123,
          99,
          133
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          51,
          11,
          63,
          21
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          19,
          31,
          31,
          41
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          88,
          52,
          100,
          62
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          20,
          92,
          32,
          102
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          87,
          123,
          99,
          133
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "rootflower-triskelion",
      125,
      151,
      24,
      47,
      87,
      116,
      297
    ],
    "profile": "rootflower-triskelion",
    "sourceAuthoredName": "Glimmerroot Petal Library"
  },
  {
    "id": "r4:observatory:temperate:large:02",
    "type": "observatory",
    "biome": "temperate",
    "size": "large",
    "variant": 2,
    "bounds": [
      157,
      22,
      177
    ],
    "wings": [
      [
        73,
        7,
        99,
        169
      ],
      [
        3,
        29,
        76,
        48
      ],
      [
        96,
        55,
        150,
        78
      ],
      [
        4,
        99,
        76,
        121
      ],
      [
        96,
        139,
        149,
        158
      ],
      [
        7,
        44,
        79,
        116
      ],
      [
        93,
        75,
        144,
        152
      ],
      [
        15,
        157,
        140,
        167
      ],
      [
        64,
        109,
        73,
        161
      ]
    ],
    "notches": [
      [
        83,
        77,
        88,
        82
      ],
      [
        68,
        147,
        71,
        151
      ]
    ],
    "octagons": [
      [
        11,
        39,
        5,
        10
      ],
      [
        142,
        151,
        5,
        9
      ],
      [
        135,
        62,
        4,
        7
      ]
    ],
    "skyline": [
      [
        83,
        12,
        89,
        18,
        16
      ],
      [
        37,
        36,
        41,
        40,
        15
      ],
      [
        121,
        64,
        125,
        68,
        12
      ],
      [
        38,
        108,
        42,
        112,
        14
      ],
      [
        120,
        146,
        124,
        150,
        16
      ]
    ],
    "entry": [
      86,
      7
    ],
    "porch": [
      82,
      3,
      90,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 79,
        "to": 93,
        "door": 86,
        "facing": "north"
      }
    ],
    "windows": [
      [
        79,
        7,
        "south"
      ],
      [
        93,
        7,
        "south"
      ],
      [
        3,
        38,
        "west"
      ],
      [
        150,
        66,
        "east"
      ],
      [
        4,
        110,
        "west"
      ],
      [
        149,
        148,
        "east"
      ]
    ],
    "fixtures": [
      [
        86,
        17
      ],
      [
        39,
        39
      ],
      [
        123,
        67
      ],
      [
        40,
        111
      ],
      [
        122,
        149
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "meridian-quadrant-cross-forum",
        "kind": "instrument-room",
        "rect": [
          80,
          10,
          92,
          21
        ]
      },
      {
        "id": "meridian-quadrant-cross-wing-1",
        "kind": "star-charts",
        "rect": [
          33,
          33,
          45,
          43
        ]
      },
      {
        "id": "meridian-quadrant-cross-wing-2",
        "kind": "lens-workshop",
        "rect": [
          117,
          61,
          129,
          71
        ]
      },
      {
        "id": "meridian-quadrant-cross-wing-3",
        "kind": "observation-deck",
        "rect": [
          34,
          105,
          46,
          115
        ]
      },
      {
        "id": "meridian-quadrant-cross-wing-4",
        "kind": "public-lecture",
        "rect": [
          116,
          143,
          128,
          153
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          80,
          11,
          92,
          21
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          33,
          33,
          45,
          43
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          117,
          61,
          129,
          71
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          34,
          105,
          46,
          115
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          116,
          143,
          128,
          153
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "meridian-quadrant-cross",
      157,
      177,
      29,
      55,
      99,
      139,
      298
    ],
    "profile": "meridian-quadrant-cross",
    "sourceAuthoredName": "Starford Parallax Rotunda"
  },
  {
    "id": "r4:observatory:desert:medium:02",
    "type": "observatory",
    "biome": "desert",
    "size": "medium",
    "variant": 2,
    "bounds": [
      123,
      22,
      149
    ],
    "wings": [
      [
        47,
        7,
        67,
        141
      ],
      [
        4,
        25,
        50,
        46
      ],
      [
        64,
        44,
        115,
        63
      ],
      [
        5,
        77,
        50,
        95
      ],
      [
        64,
        113,
        114,
        134
      ],
      [
        8,
        37,
        52,
        91
      ],
      [
        61,
        62,
        109,
        125
      ],
      [
        43,
        127,
        104,
        140
      ],
      [
        12,
        93,
        46,
        135
      ]
    ],
    "notches": [
      [
        54,
        60,
        59,
        65
      ],
      [
        72,
        88,
        75,
        92
      ]
    ],
    "octagons": [
      [
        12,
        35,
        6,
        8
      ],
      [
        107,
        125,
        6,
        10
      ]
    ],
    "skyline": [
      [
        54,
        12,
        60,
        18,
        17
      ],
      [
        25,
        33,
        29,
        37,
        16
      ],
      [
        87,
        51,
        91,
        55,
        13
      ],
      [
        25,
        84,
        29,
        88,
        15
      ],
      [
        87,
        121,
        91,
        125,
        12
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
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 50,
        "to": 64,
        "door": 57,
        "facing": "north"
      }
    ],
    "windows": [
      [
        50,
        7,
        "south"
      ],
      [
        64,
        7,
        "south"
      ],
      [
        4,
        35,
        "west"
      ],
      [
        115,
        53,
        "east"
      ],
      [
        5,
        86,
        "west"
      ],
      [
        114,
        123,
        "east"
      ]
    ],
    "fixtures": [
      [
        57,
        17
      ],
      [
        27,
        36
      ],
      [
        89,
        54
      ],
      [
        27,
        87
      ],
      [
        89,
        124
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "solar-terrace-forks-forum",
        "kind": "instrument-room",
        "rect": [
          51,
          10,
          63,
          21
        ]
      },
      {
        "id": "solar-terrace-forks-wing-1",
        "kind": "star-charts",
        "rect": [
          21,
          30,
          33,
          40
        ]
      },
      {
        "id": "solar-terrace-forks-wing-2",
        "kind": "lens-workshop",
        "rect": [
          83,
          48,
          95,
          58
        ]
      },
      {
        "id": "solar-terrace-forks-wing-3",
        "kind": "observation-deck",
        "rect": [
          21,
          81,
          33,
          91
        ]
      },
      {
        "id": "solar-terrace-forks-wing-4",
        "kind": "public-lecture",
        "rect": [
          83,
          118,
          95,
          128
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          51,
          11,
          63,
          21
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          21,
          30,
          33,
          40
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          83,
          48,
          95,
          58
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          21,
          81,
          33,
          91
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          83,
          118,
          95,
          128
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "solar-terrace-forks",
      123,
      149,
      25,
      44,
      77,
      113,
      299
    ],
    "profile": "solar-terrace-forks",
    "sourceAuthoredName": "Solstice Cleft Orrery"
  },
  {
    "id": "r4:observatory:snow:large:01",
    "type": "observatory",
    "biome": "snow",
    "size": "large",
    "variant": 1,
    "bounds": [
      163,
      22,
      177
    ],
    "wings": [
      [
        58,
        7,
        92,
        169
      ],
      [
        5,
        32,
        61,
        55
      ],
      [
        89,
        55,
        159,
        76
      ],
      [
        6,
        98,
        61,
        118
      ],
      [
        89,
        139,
        158,
        162
      ],
      [
        11,
        48,
        63,
        111
      ],
      [
        86,
        70,
        154,
        152
      ],
      [
        14,
        155,
        146,
        164
      ],
      [
        88,
        113,
        110,
        158
      ]
    ],
    "notches": [
      [
        72,
        76,
        77,
        81
      ],
      [
        57,
        147,
        60,
        151
      ]
    ],
    "octagons": [
      [
        13,
        42,
        7,
        9
      ],
      [
        151,
        151,
        7,
        11
      ]
    ],
    "skyline": [
      [
        72,
        12,
        78,
        18,
        13
      ],
      [
        31,
        41,
        35,
        45,
        12
      ],
      [
        122,
        63,
        126,
        67,
        14
      ],
      [
        31,
        106,
        35,
        110,
        16
      ],
      [
        121,
        148,
        125,
        152,
        13
      ]
    ],
    "entry": [
      75,
      7
    ],
    "porch": [
      71,
      3,
      79,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 68,
        "to": 82,
        "door": 75,
        "facing": "north"
      }
    ],
    "windows": [
      [
        68,
        7,
        "south"
      ],
      [
        82,
        7,
        "south"
      ],
      [
        5,
        43,
        "west"
      ],
      [
        159,
        65,
        "east"
      ],
      [
        6,
        108,
        "west"
      ],
      [
        158,
        150,
        "east"
      ]
    ],
    "fixtures": [
      [
        75,
        17
      ],
      [
        33,
        44
      ],
      [
        124,
        66
      ],
      [
        33,
        109
      ],
      [
        123,
        151
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "northern-three-prisms-forum",
        "kind": "instrument-room",
        "rect": [
          69,
          10,
          81,
          21
        ]
      },
      {
        "id": "northern-three-prisms-wing-1",
        "kind": "star-charts",
        "rect": [
          27,
          38,
          39,
          48
        ]
      },
      {
        "id": "northern-three-prisms-wing-2",
        "kind": "lens-workshop",
        "rect": [
          118,
          60,
          130,
          70
        ]
      },
      {
        "id": "northern-three-prisms-wing-3",
        "kind": "observation-deck",
        "rect": [
          27,
          103,
          39,
          113
        ]
      },
      {
        "id": "northern-three-prisms-wing-4",
        "kind": "public-lecture",
        "rect": [
          117,
          145,
          129,
          155
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          69,
          11,
          81,
          21
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          27,
          38,
          39,
          48
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          118,
          60,
          130,
          70
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          27,
          103,
          39,
          113
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          117,
          145,
          129,
          155
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "northern-three-prisms",
      163,
      177,
      32,
      55,
      98,
      139,
      300
    ],
    "profile": "northern-three-prisms",
    "sourceAuthoredName": "Aurorawatch Triple-Prism"
  },
  {
    "id": "r4:observatory:enchanted-forest:small:01",
    "type": "observatory",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 1,
    "bounds": [
      95,
      22,
      129
    ],
    "wings": [
      [
        42,
        7,
        60,
        121
      ],
      [
        6,
        21,
        45,
        46
      ],
      [
        57,
        38,
        90,
        61
      ],
      [
        7,
        70,
        45,
        92
      ],
      [
        57,
        96,
        89,
        121
      ],
      [
        11,
        36,
        47,
        84
      ],
      [
        55,
        51,
        85,
        110
      ],
      [
        36,
        111,
        81,
        121
      ],
      [
        12,
        86,
        38,
        117
      ]
    ],
    "notches": [
      [
        48,
        54,
        53,
        59
      ],
      [
        66,
        81,
        69,
        85
      ]
    ],
    "octagons": [
      [
        14,
        31,
        8,
        10
      ],
      [
        82,
        108,
        5,
        12
      ]
    ],
    "skyline": [
      [
        48,
        12,
        54,
        18,
        14
      ],
      [
        23,
        31,
        27,
        35,
        13
      ],
      [
        71,
        47,
        75,
        51,
        15
      ],
      [
        24,
        79,
        28,
        83,
        12
      ],
      [
        71,
        106,
        75,
        110,
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
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 44,
        "to": 58,
        "door": 51,
        "facing": "north"
      }
    ],
    "windows": [
      [
        44,
        7,
        "south"
      ],
      [
        58,
        7,
        "south"
      ],
      [
        6,
        33,
        "west"
      ],
      [
        90,
        49,
        "east"
      ],
      [
        7,
        81,
        "west"
      ],
      [
        89,
        108,
        "east"
      ]
    ],
    "fixtures": [
      [
        51,
        17
      ],
      [
        25,
        34
      ],
      [
        73,
        50
      ],
      [
        26,
        82
      ],
      [
        73,
        109
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "crescent-moon-arbor-forum",
        "kind": "instrument-room",
        "rect": [
          45,
          10,
          57,
          21
        ]
      },
      {
        "id": "crescent-moon-arbor-wing-1",
        "kind": "star-charts",
        "rect": [
          19,
          28,
          31,
          38
        ]
      },
      {
        "id": "crescent-moon-arbor-wing-2",
        "kind": "lens-workshop",
        "rect": [
          67,
          44,
          79,
          54
        ]
      },
      {
        "id": "crescent-moon-arbor-wing-3",
        "kind": "observation-deck",
        "rect": [
          20,
          76,
          32,
          86
        ]
      },
      {
        "id": "crescent-moon-arbor-wing-4",
        "kind": "public-lecture",
        "rect": [
          67,
          103,
          79,
          113
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          45,
          11,
          57,
          21
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          19,
          28,
          31,
          38
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          67,
          44,
          79,
          54
        ],
        "profile": "hip",
        "axis": "z",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          20,
          76,
          32,
          86
        ],
        "profile": "shed",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          67,
          103,
          79,
          113
        ],
        "profile": "saw",
        "axis": "z",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "crescent-moon-arbor",
      95,
      129,
      21,
      38,
      70,
      96,
      301
    ],
    "profile": "crescent-moon-arbor",
    "sourceAuthoredName": "Moonfern Mirror Nest"
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
export function buildA2Wave10StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave10StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE10_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
