// Roadmap A2 Wave 4: twelve distinctive original asymmetrical arcade, ring and cliffside source plans.
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
    "id": "r4:castle-palace:temperate:medium:03",
    "type": "castle-palace",
    "biome": "temperate",
    "size": "medium",
    "variant": 3,
    "bounds": [
      87,
      16,
      99
    ],
    "wings": [
      [
        31,
        7,
        55,
        29
      ],
      [
        32,
        25,
        54,
        72
      ],
      [
        4,
        16,
        35,
        80
      ],
      [
        51,
        36,
        82,
        69
      ],
      [
        59,
        45,
        84,
        56
      ],
      [
        12,
        56,
        32,
        67
      ]
    ],
    "notches": [
      [
        38,
        53,
        46,
        62
      ],
      [
        25,
        49,
        30,
        58
      ]
    ],
    "octagons": [
      [
        10,
        72,
        5,
        7
      ],
      [
        79,
        62,
        8,
        11
      ]
    ],
    "skyline": [
      [
        39,
        11,
        47,
        18,
        13
      ],
      [
        21,
        24,
        24,
        28,
        10
      ],
      [
        62,
        44,
        65,
        48,
        11
      ],
      [
        62,
        54,
        65,
        57,
        12
      ]
    ],
    "entry": [
      43,
      7
    ],
    "porch": [
      40,
      3,
      46,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 35,
        "to": 51,
        "door": 43,
        "facing": "north"
      }
    ],
    "windows": [
      [
        34,
        7,
        "south"
      ],
      [
        52,
        7,
        "south"
      ],
      [
        4,
        28,
        "west"
      ],
      [
        84,
        48,
        "east"
      ],
      [
        4,
        68,
        "west"
      ],
      [
        85,
        57,
        "east"
      ]
    ],
    "fixtures": [
      [
        43,
        14
      ],
      [
        23,
        28
      ],
      [
        63,
        48
      ],
      [
        23,
        68
      ],
      [
        63,
        57
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "river-hook-regent-veranda-arrival",
        "kind": "entrance-hall",
        "rect": [
          35,
          10,
          51,
          19
        ]
      },
      {
        "id": "river-hook-regent-veranda-west-public",
        "kind": "tower-or-wing",
        "rect": [
          18,
          21,
          26,
          30
        ]
      },
      {
        "id": "river-hook-regent-veranda-east-public",
        "kind": "council",
        "rect": [
          60,
          41,
          68,
          50
        ]
      },
      {
        "id": "river-hook-regent-veranda-west-private",
        "kind": "grand-chamber",
        "rect": [
          18,
          63,
          26,
          72
        ]
      },
      {
        "id": "river-hook-regent-veranda-east-private",
        "kind": "tower-or-wing",
        "rect": [
          60,
          52,
          68,
          61
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          35,
          10,
          51,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          18,
          21,
          27,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          59,
          41,
          68,
          52
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          19,
          62,
          27,
          72
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          59,
          51,
          67,
          61
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "river-hook-regent-veranda",
      87,
      16,
      99
    ],
    "profile": "river-hook-regent-veranda",
    "sourceAuthoredName": "river-hook-regent-veranda"
  },
  {
    "id": "r4:castle-palace:snow:small:02",
    "type": "castle-palace",
    "biome": "snow",
    "size": "small",
    "variant": 2,
    "bounds": [
      68,
      16,
      77
    ],
    "wings": [
      [
        22,
        7,
        46,
        29
      ],
      [
        23,
        25,
        45,
        58
      ],
      [
        4,
        25,
        26,
        61
      ],
      [
        42,
        13,
        63,
        54
      ],
      [
        2,
        36,
        18,
        46
      ],
      [
        45,
        30,
        65,
        41
      ],
      [
        51,
        45,
        65,
        56
      ]
    ],
    "notches": [
      [
        31,
        37,
        40,
        45
      ]
    ],
    "octagons": [
      [
        7,
        51,
        7,
        10
      ],
      [
        57,
        47,
        6,
        8
      ]
    ],
    "skyline": [
      [
        30,
        11,
        38,
        18,
        14
      ],
      [
        12,
        33,
        15,
        37,
        11
      ],
      [
        53,
        21,
        56,
        25,
        12
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
        "axis": "z",
        "fixed": 25,
        "from": 26,
        "to": 42,
        "door": 34,
        "facing": "north"
      }
    ],
    "windows": [
      [
        25,
        7,
        "south"
      ],
      [
        43,
        7,
        "south"
      ],
      [
        2,
        37,
        "west"
      ],
      [
        63,
        25,
        "east"
      ],
      [
        0,
        49,
        "west"
      ],
      [
        63,
        42,
        "east"
      ]
    ],
    "fixtures": [
      [
        34,
        14
      ],
      [
        14,
        37
      ],
      [
        54,
        25
      ],
      [
        14,
        49
      ],
      [
        54,
        42
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "snow-pass-pinwheel-rampart-arrival",
        "kind": "entrance-hall",
        "rect": [
          26,
          10,
          42,
          19
        ]
      },
      {
        "id": "snow-pass-pinwheel-rampart-west-public",
        "kind": "tower-or-wing",
        "rect": [
          9,
          30,
          17,
          39
        ]
      },
      {
        "id": "snow-pass-pinwheel-rampart-east-public",
        "kind": "council",
        "rect": [
          51,
          18,
          59,
          27
        ]
      },
      {
        "id": "snow-pass-pinwheel-rampart-west-private",
        "kind": "grand-chamber",
        "rect": [
          9,
          44,
          17,
          53
        ]
      },
      {
        "id": "snow-pass-pinwheel-rampart-east-private",
        "kind": "tower-or-wing",
        "rect": [
          51,
          37,
          59,
          46
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          26,
          10,
          42,
          21
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          9,
          30,
          18,
          41
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          50,
          18,
          59,
          29
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          10,
          43,
          18,
          53
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          50,
          36,
          58,
          46
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "snow-pass-pinwheel-rampart",
      68,
      16,
      77
    ],
    "profile": "snow-pass-pinwheel-rampart",
    "sourceAuthoredName": "snow-pass-pinwheel-rampart"
  },
  {
    "id": "r4:castle-palace:desert:large:02",
    "type": "castle-palace",
    "biome": "desert",
    "size": "large",
    "variant": 2,
    "bounds": [
      120,
      16,
      115
    ],
    "wings": [
      [
        48,
        7,
        72,
        29
      ],
      [
        49,
        25,
        71,
        85
      ],
      [
        4,
        33,
        52,
        94
      ],
      [
        68,
        17,
        115,
        73
      ],
      [
        76,
        49,
        117,
        60
      ],
      [
        54,
        83,
        67,
        106
      ]
    ],
    "notches": [
      [
        55,
        66,
        63,
        75
      ],
      [
        42,
        63,
        47,
        72
      ]
    ],
    "octagons": [
      [
        8,
        88,
        7,
        9
      ],
      [
        111,
        65,
        5,
        7
      ]
    ],
    "skyline": [
      [
        56,
        11,
        64,
        18,
        12
      ],
      [
        38,
        41,
        41,
        45,
        12
      ],
      [
        79,
        25,
        82,
        29,
        10
      ],
      [
        38,
        79,
        41,
        82,
        11
      ]
    ],
    "entry": [
      60,
      7
    ],
    "porch": [
      57,
      3,
      63,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 52,
        "to": 68,
        "door": 60,
        "facing": "north"
      }
    ],
    "windows": [
      [
        51,
        7,
        "south"
      ],
      [
        69,
        7,
        "south"
      ],
      [
        4,
        45,
        "west"
      ],
      [
        115,
        29,
        "east"
      ],
      [
        4,
        82,
        "west"
      ],
      [
        115,
        61,
        "east"
      ]
    ],
    "fixtures": [
      [
        60,
        14
      ],
      [
        40,
        45
      ],
      [
        80,
        29
      ],
      [
        40,
        82
      ],
      [
        80,
        61
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "sun-court-crenellated-crescent-arrival",
        "kind": "entrance-hall",
        "rect": [
          52,
          10,
          68,
          19
        ]
      },
      {
        "id": "sun-court-crenellated-crescent-west-public",
        "kind": "tower-or-wing",
        "rect": [
          35,
          38,
          43,
          47
        ]
      },
      {
        "id": "sun-court-crenellated-crescent-east-public",
        "kind": "council",
        "rect": [
          77,
          22,
          85,
          31
        ]
      },
      {
        "id": "sun-court-crenellated-crescent-west-private",
        "kind": "grand-chamber",
        "rect": [
          35,
          77,
          43,
          86
        ]
      },
      {
        "id": "sun-court-crenellated-crescent-east-private",
        "kind": "tower-or-wing",
        "rect": [
          77,
          56,
          85,
          65
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          52,
          10,
          68,
          21
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          35,
          38,
          44,
          49
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          76,
          22,
          85,
          33
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          36,
          76,
          44,
          86
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          76,
          55,
          84,
          65
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "sun-court-crenellated-crescent",
      120,
      16,
      115
    ],
    "profile": "sun-court-crenellated-crescent",
    "sourceAuthoredName": "sun-court-crenellated-crescent"
  },
  {
    "id": "r4:embassy:temperate:medium:02",
    "type": "embassy",
    "biome": "temperate",
    "size": "medium",
    "variant": 2,
    "bounds": [
      88,
      16,
      98
    ],
    "wings": [
      [
        32,
        7,
        56,
        29
      ],
      [
        33,
        25,
        55,
        78
      ],
      [
        4,
        32,
        36,
        83
      ],
      [
        52,
        14,
        83,
        65
      ],
      [
        2,
        58,
        28,
        68
      ],
      [
        13,
        59,
        33,
        70
      ],
      [
        11,
        73,
        27,
        86
      ]
    ],
    "notches": [
      [
        41,
        58,
        50,
        66
      ],
      [
        26,
        52,
        31,
        61
      ]
    ],
    "octagons": [
      [
        10,
        75,
        5,
        7
      ],
      [
        80,
        58,
        8,
        11
      ]
    ],
    "skyline": [
      [
        40,
        11,
        48,
        18,
        13
      ],
      [
        22,
        40,
        25,
        44,
        9
      ],
      [
        63,
        22,
        66,
        26,
        11
      ],
      [
        63,
        50,
        66,
        53,
        12
      ]
    ],
    "entry": [
      44,
      7
    ],
    "porch": [
      41,
      3,
      47,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 36,
        "to": 52,
        "door": 44,
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
        53,
        7,
        "south"
      ],
      [
        4,
        44,
        "west"
      ],
      [
        83,
        26,
        "east"
      ],
      [
        4,
        71,
        "west"
      ],
      [
        86,
        53,
        "east"
      ]
    ],
    "fixtures": [
      [
        44,
        14
      ],
      [
        24,
        44
      ],
      [
        64,
        26
      ],
      [
        24,
        71
      ],
      [
        64,
        53
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "waterfall-switchback-diplomatic-court-arrival",
        "kind": "formal-chamber",
        "rect": [
          36,
          10,
          52,
          19
        ]
      },
      {
        "id": "waterfall-switchback-diplomatic-court-west-public",
        "kind": "guest-area",
        "rect": [
          19,
          37,
          27,
          46
        ]
      },
      {
        "id": "waterfall-switchback-diplomatic-court-east-public",
        "kind": "consular-office",
        "rect": [
          61,
          19,
          69,
          28
        ]
      },
      {
        "id": "waterfall-switchback-diplomatic-court-west-private",
        "kind": "treaty-archive",
        "rect": [
          19,
          66,
          27,
          75
        ]
      },
      {
        "id": "waterfall-switchback-diplomatic-court-east-private",
        "kind": "hospitality",
        "rect": [
          61,
          48,
          69,
          57
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          36,
          10,
          52,
          21
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          19,
          37,
          28,
          48
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          60,
          19,
          69,
          30
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          20,
          65,
          28,
          75
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          60,
          47,
          68,
          57
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "waterfall-switchback-diplomatic-court",
      88,
      16,
      98
    ],
    "profile": "waterfall-switchback-diplomatic-court",
    "sourceAuthoredName": "waterfall-switchback-diplomatic-court"
  },
  {
    "id": "r4:embassy:mountain:large:02",
    "type": "embassy",
    "biome": "mountain",
    "size": "large",
    "variant": 2,
    "bounds": [
      114,
      16,
      106
    ],
    "wings": [
      [
        45,
        7,
        69,
        29
      ],
      [
        46,
        25,
        68,
        87
      ],
      [
        4,
        19,
        49,
        75
      ],
      [
        65,
        40,
        109,
        94
      ],
      [
        73,
        70,
        111,
        81
      ],
      [
        68,
        70,
        88,
        81
      ]
    ],
    "notches": [
      [
        52,
        66,
        60,
        75
      ],
      [
        70,
        64,
        76,
        73
      ]
    ],
    "octagons": [
      [
        7,
        65,
        7,
        10
      ],
      [
        103,
        87,
        6,
        8
      ]
    ],
    "skyline": [
      [
        53,
        11,
        61,
        18,
        14
      ],
      [
        35,
        27,
        38,
        31,
        10
      ],
      [
        76,
        48,
        79,
        52,
        12
      ]
    ],
    "entry": [
      57,
      7
    ],
    "porch": [
      54,
      3,
      60,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 49,
        "to": 65,
        "door": 57,
        "facing": "north"
      }
    ],
    "windows": [
      [
        48,
        7,
        "south"
      ],
      [
        66,
        7,
        "south"
      ],
      [
        4,
        31,
        "west"
      ],
      [
        109,
        52,
        "east"
      ],
      [
        0,
        63,
        "west"
      ],
      [
        109,
        82,
        "east"
      ]
    ],
    "fixtures": [
      [
        57,
        14
      ],
      [
        37,
        31
      ],
      [
        77,
        52
      ],
      [
        37,
        63
      ],
      [
        77,
        82
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "highland-rear-double-consulate-arrival",
        "kind": "formal-chamber",
        "rect": [
          49,
          10,
          65,
          19
        ]
      },
      {
        "id": "highland-rear-double-consulate-west-public",
        "kind": "guest-area",
        "rect": [
          32,
          24,
          40,
          33
        ]
      },
      {
        "id": "highland-rear-double-consulate-east-public",
        "kind": "consular-office",
        "rect": [
          74,
          45,
          82,
          54
        ]
      },
      {
        "id": "highland-rear-double-consulate-west-private",
        "kind": "treaty-archive",
        "rect": [
          32,
          58,
          40,
          67
        ]
      },
      {
        "id": "highland-rear-double-consulate-east-private",
        "kind": "hospitality",
        "rect": [
          74,
          77,
          82,
          86
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          49,
          10,
          65,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          32,
          24,
          41,
          35
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          73,
          45,
          82,
          56
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          33,
          57,
          41,
          67
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          73,
          76,
          81,
          86
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "highland-rear-double-consulate",
      114,
      16,
      106
    ],
    "profile": "highland-rear-double-consulate",
    "sourceAuthoredName": "highland-rear-double-consulate"
  },
  {
    "id": "r4:embassy:enchanted-forest:medium:02",
    "type": "embassy",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 2,
    "bounds": [
      83,
      16,
      90
    ],
    "wings": [
      [
        29,
        7,
        53,
        29
      ],
      [
        30,
        25,
        52,
        68
      ],
      [
        4,
        14,
        33,
        64
      ],
      [
        49,
        30,
        78,
        78
      ],
      [
        2,
        39,
        25,
        49
      ],
      [
        35,
        66,
        48,
        81
      ],
      [
        58,
        69,
        72,
        80
      ]
    ],
    "notches": [
      [
        38,
        49,
        47,
        57
      ],
      [
        23,
        33,
        28,
        42
      ]
    ],
    "octagons": [
      [
        8,
        58,
        7,
        9
      ],
      [
        74,
        70,
        5,
        7
      ]
    ],
    "skyline": [
      [
        37,
        11,
        45,
        18,
        12
      ],
      [
        19,
        22,
        22,
        26,
        11
      ],
      [
        60,
        38,
        63,
        42,
        10
      ],
      [
        19,
        49,
        22,
        52,
        11
      ]
    ],
    "entry": [
      41,
      7
    ],
    "porch": [
      38,
      3,
      44,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 33,
        "to": 49,
        "door": 41,
        "facing": "north"
      }
    ],
    "windows": [
      [
        32,
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
        26,
        "west"
      ],
      [
        78,
        42,
        "east"
      ],
      [
        4,
        52,
        "west"
      ],
      [
        78,
        66,
        "east"
      ]
    ],
    "fixtures": [
      [
        41,
        14
      ],
      [
        21,
        26
      ],
      [
        61,
        42
      ],
      [
        21,
        52
      ],
      [
        61,
        66
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "woodland-broken-circular-passage-arrival",
        "kind": "formal-chamber",
        "rect": [
          33,
          10,
          49,
          19
        ]
      },
      {
        "id": "woodland-broken-circular-passage-west-public",
        "kind": "guest-area",
        "rect": [
          16,
          19,
          24,
          28
        ]
      },
      {
        "id": "woodland-broken-circular-passage-east-public",
        "kind": "consular-office",
        "rect": [
          58,
          35,
          66,
          44
        ]
      },
      {
        "id": "woodland-broken-circular-passage-west-private",
        "kind": "treaty-archive",
        "rect": [
          16,
          47,
          24,
          56
        ]
      },
      {
        "id": "woodland-broken-circular-passage-east-private",
        "kind": "hospitality",
        "rect": [
          58,
          61,
          66,
          70
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          33,
          10,
          49,
          21
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          16,
          19,
          25,
          30
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          57,
          35,
          66,
          46
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          17,
          46,
          25,
          56
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          57,
          60,
          65,
          70
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "woodland-broken-circular-passage",
      83,
      16,
      90
    ],
    "profile": "woodland-broken-circular-passage",
    "sourceAuthoredName": "woodland-broken-circular-passage"
  },
  {
    "id": "r4:grand-archive:temperate:small:02",
    "type": "grand-archive",
    "biome": "temperate",
    "size": "small",
    "variant": 2,
    "bounds": [
      70,
      16,
      85
    ],
    "wings": [
      [
        23,
        7,
        47,
        29
      ],
      [
        24,
        25,
        46,
        62
      ],
      [
        4,
        28,
        27,
        71
      ],
      [
        43,
        14,
        65,
        58
      ],
      [
        51,
        34,
        67,
        45
      ],
      [
        4,
        47,
        24,
        58
      ]
    ],
    "notches": [
      [
        30,
        43,
        38,
        52
      ],
      [
        17,
        40,
        22,
        49
      ]
    ],
    "octagons": [
      [
        10,
        63,
        5,
        7
      ],
      [
        62,
        51,
        8,
        11
      ]
    ],
    "skyline": [
      [
        31,
        11,
        39,
        18,
        13
      ],
      [
        13,
        36,
        16,
        40,
        12
      ],
      [
        54,
        22,
        57,
        26,
        11
      ],
      [
        54,
        43,
        57,
        46,
        12
      ]
    ],
    "entry": [
      35,
      7
    ],
    "porch": [
      32,
      3,
      38,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 27,
        "to": 43,
        "door": 35,
        "facing": "north"
      }
    ],
    "windows": [
      [
        26,
        7,
        "south"
      ],
      [
        44,
        7,
        "south"
      ],
      [
        4,
        40,
        "west"
      ],
      [
        65,
        26,
        "east"
      ],
      [
        4,
        59,
        "west"
      ],
      [
        68,
        46,
        "east"
      ]
    ],
    "fixtures": [
      [
        35,
        14
      ],
      [
        15,
        40
      ],
      [
        55,
        26
      ],
      [
        15,
        59
      ],
      [
        55,
        46
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "brookside-long-catalogue-arcade-arrival",
        "kind": "consultation-room",
        "rect": [
          27,
          10,
          43,
          19
        ]
      },
      {
        "id": "brookside-long-catalogue-arcade-west-public",
        "kind": "scriptorium",
        "rect": [
          10,
          33,
          18,
          42
        ]
      },
      {
        "id": "brookside-long-catalogue-arcade-east-public",
        "kind": "cataloguing",
        "rect": [
          52,
          19,
          60,
          28
        ]
      },
      {
        "id": "brookside-long-catalogue-arcade-west-private",
        "kind": "records-vault",
        "rect": [
          10,
          54,
          18,
          63
        ]
      },
      {
        "id": "brookside-long-catalogue-arcade-east-private",
        "kind": "copying-gallery",
        "rect": [
          52,
          41,
          60,
          50
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          27,
          10,
          43,
          21
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          10,
          33,
          19,
          44
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          51,
          19,
          60,
          30
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          11,
          53,
          19,
          63
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          51,
          40,
          59,
          50
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "brookside-long-catalogue-arcade",
      70,
      16,
      85
    ],
    "profile": "brookside-long-catalogue-arcade",
    "sourceAuthoredName": "brookside-long-catalogue-arcade"
  },
  {
    "id": "r4:grand-archive:desert:medium:02",
    "type": "grand-archive",
    "biome": "desert",
    "size": "medium",
    "variant": 2,
    "bounds": [
      92,
      16,
      100
    ],
    "wings": [
      [
        34,
        7,
        58,
        29
      ],
      [
        35,
        25,
        57,
        81
      ],
      [
        4,
        38,
        38,
        84
      ],
      [
        54,
        17,
        87,
        71
      ],
      [
        2,
        59,
        30,
        69
      ],
      [
        57,
        47,
        77,
        58
      ],
      [
        13,
        74,
        29,
        87
      ]
    ],
    "notches": [
      [
        43,
        60,
        52,
        68
      ],
      [
        59,
        41,
        65,
        50
      ]
    ],
    "octagons": [
      [
        7,
        74,
        7,
        10
      ],
      [
        81,
        64,
        6,
        8
      ]
    ],
    "skyline": [
      [
        42,
        11,
        50,
        18,
        14
      ],
      [
        24,
        46,
        27,
        50,
        9
      ],
      [
        65,
        25,
        68,
        29,
        12
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
        "axis": "z",
        "fixed": 25,
        "from": 38,
        "to": 54,
        "door": 46,
        "facing": "north"
      }
    ],
    "windows": [
      [
        37,
        7,
        "south"
      ],
      [
        55,
        7,
        "south"
      ],
      [
        4,
        50,
        "west"
      ],
      [
        87,
        29,
        "east"
      ],
      [
        0,
        72,
        "west"
      ],
      [
        87,
        59,
        "east"
      ]
    ],
    "fixtures": [
      [
        46,
        14
      ],
      [
        26,
        50
      ],
      [
        66,
        29
      ],
      [
        26,
        72
      ],
      [
        66,
        59
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "desert-canal-courtyard-scriptorium-arrival",
        "kind": "consultation-room",
        "rect": [
          38,
          10,
          54,
          19
        ]
      },
      {
        "id": "desert-canal-courtyard-scriptorium-west-public",
        "kind": "scriptorium",
        "rect": [
          21,
          43,
          29,
          52
        ]
      },
      {
        "id": "desert-canal-courtyard-scriptorium-east-public",
        "kind": "cataloguing",
        "rect": [
          63,
          22,
          71,
          31
        ]
      },
      {
        "id": "desert-canal-courtyard-scriptorium-west-private",
        "kind": "records-vault",
        "rect": [
          21,
          67,
          29,
          76
        ]
      },
      {
        "id": "desert-canal-courtyard-scriptorium-east-private",
        "kind": "copying-gallery",
        "rect": [
          63,
          54,
          71,
          63
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          38,
          10,
          54,
          21
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          21,
          43,
          30,
          54
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          62,
          22,
          71,
          33
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          22,
          66,
          30,
          76
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          62,
          53,
          70,
          63
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "desert-canal-courtyard-scriptorium",
      92,
      16,
      100
    ],
    "profile": "desert-canal-courtyard-scriptorium",
    "sourceAuthoredName": "desert-canal-courtyard-scriptorium"
  },
  {
    "id": "r4:grand-archive:snow:large:02",
    "type": "grand-archive",
    "biome": "snow",
    "size": "large",
    "variant": 2,
    "bounds": [
      116,
      16,
      110
    ],
    "wings": [
      [
        46,
        7,
        70,
        29
      ],
      [
        47,
        25,
        69,
        90
      ],
      [
        4,
        16,
        50,
        88
      ],
      [
        66,
        39,
        111,
        94
      ],
      [
        74,
        70,
        113,
        81
      ],
      [
        52,
        88,
        65,
        101
      ]
    ],
    "notches": [
      [
        53,
        70,
        61,
        79
      ],
      [
        40,
        57,
        45,
        66
      ]
    ],
    "octagons": [
      [
        8,
        82,
        7,
        9
      ],
      [
        107,
        86,
        5,
        7
      ]
    ],
    "skyline": [
      [
        54,
        11,
        62,
        18,
        12
      ],
      [
        36,
        24,
        39,
        28,
        10
      ],
      [
        77,
        47,
        80,
        51,
        10
      ],
      [
        36,
        73,
        39,
        76,
        11
      ]
    ],
    "entry": [
      58,
      7
    ],
    "porch": [
      55,
      3,
      61,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 50,
        "to": 66,
        "door": 58,
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
        67,
        7,
        "south"
      ],
      [
        4,
        28,
        "west"
      ],
      [
        111,
        51,
        "east"
      ],
      [
        4,
        76,
        "west"
      ],
      [
        111,
        82,
        "east"
      ]
    ],
    "fixtures": [
      [
        58,
        14
      ],
      [
        38,
        28
      ],
      [
        78,
        51
      ],
      [
        38,
        76
      ],
      [
        78,
        82
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "ice-split-cloister-record-vault-arrival",
        "kind": "consultation-room",
        "rect": [
          50,
          10,
          66,
          19
        ]
      },
      {
        "id": "ice-split-cloister-record-vault-west-public",
        "kind": "scriptorium",
        "rect": [
          33,
          21,
          41,
          30
        ]
      },
      {
        "id": "ice-split-cloister-record-vault-east-public",
        "kind": "cataloguing",
        "rect": [
          75,
          44,
          83,
          53
        ]
      },
      {
        "id": "ice-split-cloister-record-vault-west-private",
        "kind": "records-vault",
        "rect": [
          33,
          71,
          41,
          80
        ]
      },
      {
        "id": "ice-split-cloister-record-vault-east-private",
        "kind": "copying-gallery",
        "rect": [
          75,
          77,
          83,
          86
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          50,
          10,
          66,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          33,
          21,
          42,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          74,
          44,
          83,
          55
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          34,
          70,
          42,
          80
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          74,
          76,
          82,
          86
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "ice-split-cloister-record-vault",
      116,
      16,
      110
    ],
    "profile": "ice-split-cloister-record-vault",
    "sourceAuthoredName": "ice-split-cloister-record-vault"
  },
  {
    "id": "r4:observatory:mountain:small:02",
    "type": "observatory",
    "biome": "mountain",
    "size": "small",
    "variant": 2,
    "bounds": [
      68,
      16,
      88
    ],
    "wings": [
      [
        22,
        7,
        46,
        29
      ],
      [
        23,
        25,
        45,
        65
      ],
      [
        4,
        31,
        26,
        74
      ],
      [
        42,
        13,
        63,
        57
      ],
      [
        2,
        49,
        18,
        59
      ],
      [
        3,
        50,
        23,
        61
      ],
      [
        51,
        48,
        65,
        59
      ]
    ],
    "notches": [
      [
        31,
        46,
        40,
        54
      ],
      [
        16,
        43,
        21,
        52
      ]
    ],
    "octagons": [
      [
        10,
        66,
        5,
        7
      ],
      [
        60,
        50,
        8,
        11
      ]
    ],
    "skyline": [
      [
        30,
        11,
        38,
        18,
        13
      ],
      [
        12,
        39,
        15,
        43,
        11
      ],
      [
        53,
        21,
        56,
        25,
        11
      ],
      [
        53,
        42,
        56,
        45,
        12
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
        "axis": "z",
        "fixed": 25,
        "from": 26,
        "to": 42,
        "door": 34,
        "facing": "north"
      }
    ],
    "windows": [
      [
        25,
        7,
        "south"
      ],
      [
        43,
        7,
        "south"
      ],
      [
        4,
        43,
        "west"
      ],
      [
        63,
        25,
        "east"
      ],
      [
        4,
        62,
        "west"
      ],
      [
        66,
        45,
        "east"
      ]
    ],
    "fixtures": [
      [
        34,
        14
      ],
      [
        14,
        43
      ],
      [
        54,
        25
      ],
      [
        14,
        62
      ],
      [
        54,
        45
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "steep-crest-sky-lens-fort-arrival",
        "kind": "instrument-room",
        "rect": [
          26,
          10,
          42,
          19
        ]
      },
      {
        "id": "steep-crest-sky-lens-fort-west-public",
        "kind": "star-charts",
        "rect": [
          9,
          36,
          17,
          45
        ]
      },
      {
        "id": "steep-crest-sky-lens-fort-east-public",
        "kind": "lens-workshop",
        "rect": [
          51,
          18,
          59,
          27
        ]
      },
      {
        "id": "steep-crest-sky-lens-fort-west-private",
        "kind": "observation-deck",
        "rect": [
          9,
          57,
          17,
          66
        ]
      },
      {
        "id": "steep-crest-sky-lens-fort-east-private",
        "kind": "public-lecture",
        "rect": [
          51,
          40,
          59,
          49
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          26,
          10,
          42,
          21
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          9,
          36,
          18,
          47
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          50,
          18,
          59,
          29
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          10,
          56,
          18,
          66
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          50,
          39,
          58,
          49
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "steep-crest-sky-lens-fort",
      68,
      16,
      88
    ],
    "profile": "steep-crest-sky-lens-fort",
    "sourceAuthoredName": "steep-crest-sky-lens-fort"
  },
  {
    "id": "r4:observatory:snow:medium:02",
    "type": "observatory",
    "biome": "snow",
    "size": "medium",
    "variant": 2,
    "bounds": [
      86,
      16,
      104
    ],
    "wings": [
      [
        31,
        7,
        55,
        29
      ],
      [
        32,
        25,
        54,
        76
      ],
      [
        4,
        16,
        35,
        88
      ],
      [
        51,
        35,
        81,
        73
      ],
      [
        59,
        49,
        83,
        60
      ],
      [
        54,
        49,
        74,
        60
      ]
    ],
    "notches": [
      [
        38,
        57,
        46,
        66
      ]
    ],
    "octagons": [
      [
        7,
        78,
        7,
        10
      ],
      [
        75,
        66,
        6,
        8
      ]
    ],
    "skyline": [
      [
        39,
        11,
        47,
        18,
        14
      ],
      [
        21,
        24,
        24,
        28,
        12
      ],
      [
        62,
        43,
        65,
        47,
        12
      ]
    ],
    "entry": [
      43,
      7
    ],
    "porch": [
      40,
      3,
      46,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 35,
        "to": 51,
        "door": 43,
        "facing": "north"
      }
    ],
    "windows": [
      [
        34,
        7,
        "south"
      ],
      [
        52,
        7,
        "south"
      ],
      [
        4,
        28,
        "west"
      ],
      [
        81,
        47,
        "east"
      ],
      [
        0,
        76,
        "west"
      ],
      [
        81,
        61,
        "east"
      ]
    ],
    "fixtures": [
      [
        43,
        14
      ],
      [
        23,
        28
      ],
      [
        63,
        47
      ],
      [
        23,
        76
      ],
      [
        63,
        61
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "frost-zenith-long-spire-deck-arrival",
        "kind": "instrument-room",
        "rect": [
          35,
          10,
          51,
          19
        ]
      },
      {
        "id": "frost-zenith-long-spire-deck-west-public",
        "kind": "star-charts",
        "rect": [
          18,
          21,
          26,
          30
        ]
      },
      {
        "id": "frost-zenith-long-spire-deck-east-public",
        "kind": "lens-workshop",
        "rect": [
          60,
          40,
          68,
          49
        ]
      },
      {
        "id": "frost-zenith-long-spire-deck-west-private",
        "kind": "observation-deck",
        "rect": [
          18,
          71,
          26,
          80
        ]
      },
      {
        "id": "frost-zenith-long-spire-deck-east-private",
        "kind": "public-lecture",
        "rect": [
          60,
          56,
          68,
          65
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          35,
          10,
          51,
          21
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          18,
          21,
          27,
          32
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          59,
          40,
          68,
          51
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          19,
          70,
          27,
          80
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          59,
          55,
          67,
          65
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "frost-zenith-long-spire-deck",
      86,
      16,
      104
    ],
    "profile": "frost-zenith-long-spire-deck",
    "sourceAuthoredName": "frost-zenith-long-spire-deck"
  },
  {
    "id": "r4:observatory:enchanted-forest:large:02",
    "type": "observatory",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 2,
    "bounds": [
      119,
      16,
      115
    ],
    "wings": [
      [
        47,
        7,
        71,
        29
      ],
      [
        48,
        25,
        70,
        90
      ],
      [
        4,
        41,
        51,
        102
      ],
      [
        67,
        18,
        114,
        78
      ],
      [
        2,
        77,
        43,
        87
      ],
      [
        53,
        88,
        66,
        106
      ],
      [
        26,
        92,
        42,
        105
      ]
    ],
    "notches": [
      [
        56,
        71,
        65,
        79
      ],
      [
        41,
        71,
        46,
        80
      ]
    ],
    "octagons": [
      [
        8,
        96,
        7,
        9
      ],
      [
        110,
        70,
        5,
        7
      ]
    ],
    "skyline": [
      [
        55,
        11,
        63,
        18,
        12
      ],
      [
        37,
        49,
        40,
        53,
        9
      ],
      [
        78,
        26,
        81,
        30,
        10
      ],
      [
        37,
        87,
        40,
        90,
        11
      ]
    ],
    "entry": [
      59,
      7
    ],
    "porch": [
      56,
      3,
      62,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 51,
        "to": 67,
        "door": 59,
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
        68,
        7,
        "south"
      ],
      [
        4,
        53,
        "west"
      ],
      [
        114,
        30,
        "east"
      ],
      [
        4,
        90,
        "west"
      ],
      [
        114,
        66,
        "east"
      ]
    ],
    "fixtures": [
      [
        59,
        14
      ],
      [
        39,
        53
      ],
      [
        79,
        30
      ],
      [
        39,
        90
      ],
      [
        79,
        66
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "canopy-ringborne-moon-measurer-arrival",
        "kind": "instrument-room",
        "rect": [
          51,
          10,
          67,
          19
        ]
      },
      {
        "id": "canopy-ringborne-moon-measurer-west-public",
        "kind": "star-charts",
        "rect": [
          34,
          46,
          42,
          55
        ]
      },
      {
        "id": "canopy-ringborne-moon-measurer-east-public",
        "kind": "lens-workshop",
        "rect": [
          76,
          23,
          84,
          32
        ]
      },
      {
        "id": "canopy-ringborne-moon-measurer-west-private",
        "kind": "observation-deck",
        "rect": [
          34,
          85,
          42,
          94
        ]
      },
      {
        "id": "canopy-ringborne-moon-measurer-east-private",
        "kind": "public-lecture",
        "rect": [
          76,
          61,
          84,
          70
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          51,
          10,
          67,
          21
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          34,
          46,
          43,
          57
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          75,
          23,
          84,
          34
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          35,
          84,
          43,
          94
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          75,
          60,
          83,
          70
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "canopy-ringborne-moon-measurer",
      119,
      16,
      115
    ],
    "profile": "canopy-ringborne-moon-measurer",
    "sourceAuthoredName": "canopy-ringborne-moon-measurer"
  }
];
 Roadmap A2 Wave 3: twelve distinctly authored fork/crescent/terrace courtyard silhouette candidates.
// Immutable 188 historical source plans remain in separate staging modules, unmodified.
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
    "id": "r4:castle-palace:temperate:large:02",
    "type": "castle-palace",
    "biome": "temperate",
    "size": "large",
    "variant": 2,
    "bounds": [
      117,
      16,
      98
    ],
    "wings": [
      [
        47,
        7,
        69,
        28
      ],
      [
        48,
        25,
        68,
        73
      ],
      [
        4,
        16,
        50,
        80
      ],
      [
        66,
        33,
        112,
        62
      ],
      [
        103,
        36,
        114,
        49
      ],
      [
        27,
        66,
        47,
        77
      ]
    ],
    "notches": [
      [
        56,
        54,
        62,
        61
      ]
    ],
    "octagons": [
      [
        4,
        74,
        7,
        10
      ],
      [
        112,
        54,
        8,
        11
      ]
    ],
    "skyline": [
      [
        54,
        11,
        62,
        18,
        13
      ],
      [
        36,
        23,
        40,
        28,
        11
      ],
      [
        76,
        41,
        80,
        45,
        12
      ]
    ],
    "entry": [
      58,
      7
    ],
    "porch": [
      55,
      3,
      61,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 51,
        "to": 65,
        "door": 58,
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
        67,
        7,
        "south"
      ],
      [
        4,
        27,
        "west"
      ],
      [
        114,
        43,
        "east"
      ],
      [
        0,
        69,
        "west"
      ],
      [
        116,
        51,
        "east"
      ]
    ],
    "fixtures": [
      [
        58,
        13
      ],
      [
        39,
        29
      ],
      [
        77,
        46
      ],
      [
        39,
        68
      ],
      [
        77,
        50
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "river-hook-palace-southern-arc-entry",
        "kind": "entrance-hall",
        "rect": [
          51,
          10,
          65,
          19
        ]
      },
      {
        "id": "river-hook-palace-southern-arc-western",
        "kind": "tower-or-wing",
        "rect": [
          33,
          21,
          41,
          31
        ]
      },
      {
        "id": "river-hook-palace-southern-arc-eastern",
        "kind": "council",
        "rect": [
          75,
          38,
          83,
          48
        ]
      },
      {
        "id": "river-hook-palace-southern-arc-west-scriptorium",
        "kind": "grand-chamber",
        "rect": [
          33,
          63,
          41,
          72
        ]
      },
      {
        "id": "river-hook-palace-southern-arc-east-annex",
        "kind": "tower-or-wing",
        "rect": [
          75,
          49,
          83,
          55
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          50,
          10,
          66,
          22
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          34,
          22,
          42,
          31
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          74,
          39,
          82,
          48
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          34,
          63,
          42,
          72
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          74,
          49,
          82,
          55
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "river-hook-palace-southern-arc",
      117,
      16,
      98
    ],
    "profile": "river-hook-palace-southern-arc",
    "sourceAuthoredName": "river-hook-palace-southern-arc"
  },
  {
    "id": "r4:castle-palace:desert:medium:03",
    "type": "castle-palace",
    "biome": "desert",
    "size": "medium",
    "variant": 3,
    "bounds": [
      85,
      16,
      91
    ],
    "wings": [
      [
        31,
        7,
        53,
        28
      ],
      [
        32,
        25,
        52,
        55
      ],
      [
        4,
        28,
        34,
        64
      ],
      [
        50,
        13,
        80,
        78
      ],
      [
        2,
        30,
        13,
        45
      ],
      [
        52,
        64,
        73,
        75
      ]
    ],
    "notches": [
      [
        38,
        33,
        45,
        40
      ]
    ],
    "octagons": [
      [
        4,
        58,
        7,
        10
      ],
      [
        80,
        70,
        8,
        11
      ]
    ],
    "skyline": [
      [
        38,
        11,
        46,
        18,
        13
      ],
      [
        20,
        35,
        24,
        40,
        12
      ],
      [
        60,
        21,
        64,
        25,
        13
      ],
      [
        62,
        62,
        65,
        65,
        12
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
        "axis": "z",
        "fixed": 25,
        "from": 35,
        "to": 49,
        "door": 42,
        "facing": "north"
      }
    ],
    "windows": [
      [
        33,
        7,
        "south"
      ],
      [
        51,
        7,
        "south"
      ],
      [
        2,
        39,
        "west"
      ],
      [
        80,
        23,
        "east"
      ],
      [
        0,
        53,
        "west"
      ],
      [
        84,
        67,
        "east"
      ]
    ],
    "fixtures": [
      [
        42,
        13
      ],
      [
        23,
        41
      ],
      [
        61,
        26
      ],
      [
        23,
        52
      ],
      [
        61,
        66
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "terraced-desert-zigzag-courtyard-entry",
        "kind": "entrance-hall",
        "rect": [
          35,
          10,
          49,
          19
        ]
      },
      {
        "id": "terraced-desert-zigzag-courtyard-western",
        "kind": "tower-or-wing",
        "rect": [
          17,
          33,
          25,
          43
        ]
      },
      {
        "id": "terraced-desert-zigzag-courtyard-eastern",
        "kind": "council",
        "rect": [
          59,
          18,
          67,
          28
        ]
      },
      {
        "id": "terraced-desert-zigzag-courtyard-west-scriptorium",
        "kind": "grand-chamber",
        "rect": [
          17,
          47,
          25,
          56
        ]
      },
      {
        "id": "terraced-desert-zigzag-courtyard-east-annex",
        "kind": "tower-or-wing",
        "rect": [
          59,
          61,
          67,
          70
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          34,
          10,
          50,
          22
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          18,
          34,
          26,
          43
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          58,
          19,
          66,
          28
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          18,
          47,
          26,
          56
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          58,
          61,
          66,
          70
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "terraced-desert-zigzag-courtyard",
      85,
      16,
      91
    ],
    "profile": "terraced-desert-zigzag-courtyard",
    "sourceAuthoredName": "terraced-desert-zigzag-courtyard"
  },
  {
    "id": "r4:castle-palace:mountain:small:03",
    "type": "castle-palace",
    "biome": "mountain",
    "size": "small",
    "variant": 3,
    "bounds": [
      67,
      16,
      77
    ],
    "wings": [
      [
        22,
        7,
        44,
        28
      ],
      [
        23,
        25,
        43,
        48
      ],
      [
        4,
        14,
        25,
        66
      ],
      [
        41,
        31,
        62,
        55
      ],
      [
        27,
        47,
        39,
        68
      ],
      [
        53,
        34,
        64,
        47
      ]
    ],
    "notches": [
      [
        28,
        27,
        38,
        37
      ]
    ],
    "octagons": [
      [
        4,
        60,
        7,
        10
      ],
      [
        62,
        47,
        8,
        11
      ]
    ],
    "skyline": [
      [
        29,
        11,
        37,
        18,
        13
      ],
      [
        11,
        21,
        15,
        26,
        10
      ],
      [
        51,
        39,
        55,
        43,
        11
      ]
    ],
    "entry": [
      33,
      7
    ],
    "porch": [
      30,
      3,
      36,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 26,
        "to": 40,
        "door": 33,
        "facing": "north"
      }
    ],
    "windows": [
      [
        24,
        7,
        "south"
      ],
      [
        42,
        7,
        "south"
      ],
      [
        4,
        25,
        "west"
      ],
      [
        66,
        41,
        "east"
      ],
      [
        0,
        55,
        "west"
      ],
      [
        66,
        44,
        "east"
      ]
    ],
    "fixtures": [
      [
        33,
        13
      ],
      [
        14,
        27
      ],
      [
        52,
        44
      ],
      [
        14,
        54
      ],
      [
        52,
        43
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "highpass-cliff-L-wall-entry",
        "kind": "entrance-hall",
        "rect": [
          26,
          10,
          40,
          19
        ]
      },
      {
        "id": "highpass-cliff-L-wall-western",
        "kind": "tower-or-wing",
        "rect": [
          8,
          19,
          16,
          29
        ]
      },
      {
        "id": "highpass-cliff-L-wall-eastern",
        "kind": "council",
        "rect": [
          50,
          36,
          58,
          46
        ]
      },
      {
        "id": "highpass-cliff-L-wall-west-scriptorium",
        "kind": "grand-chamber",
        "rect": [
          8,
          49,
          16,
          58
        ]
      },
      {
        "id": "highpass-cliff-L-wall-east-annex",
        "kind": "tower-or-wing",
        "rect": [
          50,
          47,
          58,
          53
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          25,
          10,
          41,
          22
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          9,
          20,
          17,
          29
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          49,
          37,
          57,
          46
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          9,
          49,
          17,
          58
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          49,
          47,
          57,
          53
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "highpass-cliff-L-wall",
      67,
      16,
      77
    ],
    "profile": "highpass-cliff-L-wall",
    "sourceAuthoredName": "highpass-cliff-L-wall"
  },
  {
    "id": "r4:embassy:snow:large:03",
    "type": "embassy",
    "biome": "snow",
    "size": "large",
    "variant": 3,
    "bounds": [
      109,
      16,
      106
    ],
    "wings": [
      [
        43,
        7,
        65,
        28
      ],
      [
        44,
        25,
        64,
        76
      ],
      [
        4,
        34,
        46,
        92
      ],
      [
        62,
        14,
        104,
        70
      ],
      [
        30,
        80,
        47,
        91
      ],
      [
        2,
        36,
        13,
        51
      ]
    ],
    "notches": [
      [
        52,
        57,
        58,
        64
      ],
      [
        5,
        63,
        15,
        72
      ]
    ],
    "octagons": [
      [
        4,
        86,
        7,
        10
      ],
      [
        104,
        62,
        8,
        11
      ]
    ],
    "skyline": [
      [
        50,
        11,
        58,
        18,
        13
      ],
      [
        32,
        41,
        36,
        46,
        11
      ],
      [
        72,
        22,
        76,
        26,
        12
      ],
      [
        31,
        76,
        34,
        79,
        12
      ]
    ],
    "entry": [
      54,
      7
    ],
    "porch": [
      51,
      3,
      57,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 47,
        "to": 61,
        "door": 54,
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
        63,
        7,
        "south"
      ],
      [
        2,
        45,
        "west"
      ],
      [
        104,
        24,
        "east"
      ],
      [
        0,
        81,
        "west"
      ],
      [
        108,
        59,
        "east"
      ]
    ],
    "fixtures": [
      [
        54,
        13
      ],
      [
        35,
        47
      ],
      [
        73,
        27
      ],
      [
        35,
        80
      ],
      [
        73,
        58
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "snow-horseshoe-consular-garden-entry",
        "kind": "formal-chamber",
        "rect": [
          47,
          10,
          61,
          19
        ]
      },
      {
        "id": "snow-horseshoe-consular-garden-western",
        "kind": "guest-area",
        "rect": [
          29,
          39,
          37,
          49
        ]
      },
      {
        "id": "snow-horseshoe-consular-garden-eastern",
        "kind": "consular-office",
        "rect": [
          71,
          19,
          79,
          29
        ]
      },
      {
        "id": "snow-horseshoe-consular-garden-west-scriptorium",
        "kind": "treaty-archive",
        "rect": [
          29,
          75,
          37,
          84
        ]
      },
      {
        "id": "snow-horseshoe-consular-garden-east-annex",
        "kind": "hospitality",
        "rect": [
          71,
          53,
          79,
          62
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          46,
          10,
          62,
          22
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          30,
          40,
          38,
          49
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          70,
          20,
          78,
          29
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          30,
          75,
          38,
          84
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          70,
          53,
          78,
          62
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "snow-horseshoe-consular-garden",
      109,
      16,
      106
    ],
    "profile": "snow-horseshoe-consular-garden",
    "sourceAuthoredName": "snow-horseshoe-consular-garden"
  },
  {
    "id": "r4:embassy:temperate:small:03",
    "type": "embassy",
    "biome": "temperate",
    "size": "small",
    "variant": 3,
    "bounds": [
      66,
      16,
      75
    ],
    "wings": [
      [
        22,
        7,
        44,
        28
      ],
      [
        23,
        25,
        43,
        50
      ],
      [
        4,
        14,
        25,
        51
      ],
      [
        41,
        28,
        61,
        62
      ],
      [
        40,
        50,
        60,
        62
      ],
      [
        52,
        31,
        63,
        44
      ],
      [
        2,
        37,
        22,
        48
      ]
    ],
    "notches": [
      [
        29,
        28,
        36,
        35
      ]
    ],
    "octagons": [
      [
        4,
        45,
        7,
        10
      ],
      [
        61,
        54,
        8,
        11
      ]
    ],
    "skyline": [
      [
        29,
        11,
        37,
        18,
        13
      ],
      [
        11,
        21,
        15,
        26,
        12
      ],
      [
        51,
        36,
        55,
        40,
        13
      ]
    ],
    "entry": [
      33,
      7
    ],
    "porch": [
      30,
      3,
      36,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 26,
        "to": 40,
        "door": 33,
        "facing": "north"
      }
    ],
    "windows": [
      [
        24,
        7,
        "south"
      ],
      [
        42,
        7,
        "south"
      ],
      [
        4,
        25,
        "west"
      ],
      [
        63,
        38,
        "east"
      ],
      [
        0,
        40,
        "west"
      ],
      [
        65,
        51,
        "east"
      ]
    ],
    "fixtures": [
      [
        33,
        13
      ],
      [
        14,
        27
      ],
      [
        52,
        41
      ],
      [
        14,
        39
      ],
      [
        52,
        50
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "river-bent-T-diplomacy-entry",
        "kind": "formal-chamber",
        "rect": [
          26,
          10,
          40,
          19
        ]
      },
      {
        "id": "river-bent-T-diplomacy-western",
        "kind": "guest-area",
        "rect": [
          8,
          19,
          16,
          29
        ]
      },
      {
        "id": "river-bent-T-diplomacy-eastern",
        "kind": "consular-office",
        "rect": [
          50,
          33,
          58,
          43
        ]
      },
      {
        "id": "river-bent-T-diplomacy-west-scriptorium",
        "kind": "treaty-archive",
        "rect": [
          8,
          34,
          16,
          43
        ]
      },
      {
        "id": "river-bent-T-diplomacy-east-annex",
        "kind": "hospitality",
        "rect": [
          50,
          45,
          58,
          54
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          25,
          10,
          41,
          22
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          9,
          20,
          17,
          29
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          49,
          34,
          57,
          43
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          9,
          34,
          17,
          43
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          49,
          45,
          57,
          54
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "river-bent-T-diplomacy",
      66,
      16,
      75
    ],
    "profile": "river-bent-T-diplomacy",
    "sourceAuthoredName": "river-bent-T-diplomacy"
  },
  {
    "id": "r4:embassy:desert:medium:03",
    "type": "embassy",
    "biome": "desert",
    "size": "medium",
    "variant": 3,
    "bounds": [
      87,
      16,
      97
    ],
    "wings": [
      [
        32,
        7,
        54,
        28
      ],
      [
        33,
        25,
        53,
        67
      ],
      [
        4,
        32,
        35,
        74
      ],
      [
        51,
        15,
        82,
        81
      ],
      [
        37,
        66,
        49,
        88
      ],
      [
        2,
        34,
        13,
        49
      ],
      [
        53,
        67,
        74,
        78
      ]
    ],
    "notches": [
      [
        38,
        46,
        48,
        56
      ]
    ],
    "octagons": [
      [
        4,
        68,
        7,
        10
      ],
      [
        82,
        73,
        8,
        11
      ]
    ],
    "skyline": [
      [
        39,
        11,
        47,
        18,
        13
      ],
      [
        21,
        39,
        25,
        44,
        10
      ],
      [
        61,
        23,
        65,
        27,
        11
      ],
      [
        63,
        65,
        66,
        68,
        12
      ]
    ],
    "entry": [
      43,
      7
    ],
    "porch": [
      40,
      3,
      46,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 36,
        "to": 50,
        "door": 43,
        "facing": "north"
      }
    ],
    "windows": [
      [
        34,
        7,
        "south"
      ],
      [
        52,
        7,
        "south"
      ],
      [
        2,
        43,
        "west"
      ],
      [
        82,
        25,
        "east"
      ],
      [
        0,
        63,
        "west"
      ],
      [
        86,
        70,
        "east"
      ]
    ],
    "fixtures": [
      [
        43,
        13
      ],
      [
        24,
        45
      ],
      [
        62,
        28
      ],
      [
        24,
        62
      ],
      [
        62,
        69
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "fan-shaped-desert-trade-house-entry",
        "kind": "formal-chamber",
        "rect": [
          36,
          10,
          50,
          19
        ]
      },
      {
        "id": "fan-shaped-desert-trade-house-western",
        "kind": "guest-area",
        "rect": [
          18,
          37,
          26,
          47
        ]
      },
      {
        "id": "fan-shaped-desert-trade-house-eastern",
        "kind": "consular-office",
        "rect": [
          60,
          20,
          68,
          30
        ]
      },
      {
        "id": "fan-shaped-desert-trade-house-west-scriptorium",
        "kind": "treaty-archive",
        "rect": [
          18,
          57,
          26,
          66
        ]
      },
      {
        "id": "fan-shaped-desert-trade-house-east-annex",
        "kind": "hospitality",
        "rect": [
          60,
          64,
          68,
          73
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          35,
          10,
          51,
          22
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          19,
          38,
          27,
          47
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          59,
          21,
          67,
          30
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          19,
          57,
          27,
          66
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          59,
          64,
          67,
          73
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "fan-shaped-desert-trade-house",
      87,
      16,
      97
    ],
    "profile": "fan-shaped-desert-trade-house",
    "sourceAuthoredName": "fan-shaped-desert-trade-house"
  },
  {
    "id": "r4:grand-archive:snow:medium:03",
    "type": "grand-archive",
    "biome": "snow",
    "size": "medium",
    "variant": 3,
    "bounds": [
      89,
      16,
      96
    ],
    "wings": [
      [
        33,
        7,
        55,
        28
      ],
      [
        34,
        25,
        54,
        77
      ],
      [
        4,
        18,
        36,
        77
      ],
      [
        52,
        37,
        84,
        69
      ],
      [
        75,
        40,
        86,
        53
      ]
    ],
    "notches": [
      [
        42,
        58,
        48,
        65
      ]
    ],
    "octagons": [
      [
        4,
        71,
        7,
        10
      ],
      [
        84,
        61,
        8,
        11
      ]
    ],
    "skyline": [
      [
        40,
        11,
        48,
        18,
        13
      ],
      [
        22,
        25,
        26,
        30,
        11
      ],
      [
        62,
        45,
        66,
        49,
        12
      ]
    ],
    "entry": [
      44,
      7
    ],
    "porch": [
      41,
      3,
      47,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 37,
        "to": 51,
        "door": 44,
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
        53,
        7,
        "south"
      ],
      [
        4,
        29,
        "west"
      ],
      [
        86,
        47,
        "east"
      ],
      [
        0,
        66,
        "west"
      ],
      [
        88,
        58,
        "east"
      ]
    ],
    "fixtures": [
      [
        44,
        13
      ],
      [
        25,
        31
      ],
      [
        63,
        50
      ],
      [
        25,
        65
      ],
      [
        63,
        57
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "stepped-snow-vault-long-galleries-entry",
        "kind": "consultation-room",
        "rect": [
          37,
          10,
          51,
          19
        ]
      },
      {
        "id": "stepped-snow-vault-long-galleries-western",
        "kind": "scriptorium",
        "rect": [
          19,
          23,
          27,
          33
        ]
      },
      {
        "id": "stepped-snow-vault-long-galleries-eastern",
        "kind": "cataloguing",
        "rect": [
          61,
          42,
          69,
          52
        ]
      },
      {
        "id": "stepped-snow-vault-long-galleries-west-scriptorium",
        "kind": "records-vault",
        "rect": [
          19,
          60,
          27,
          69
        ]
      },
      {
        "id": "stepped-snow-vault-long-galleries-east-annex",
        "kind": "copying-gallery",
        "rect": [
          61,
          53,
          69,
          61
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          36,
          10,
          52,
          22
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          20,
          24,
          28,
          33
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          60,
          43,
          68,
          52
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          20,
          60,
          28,
          69
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          60,
          53,
          68,
          61
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "stepped-snow-vault-long-galleries",
      89,
      16,
      96
    ],
    "profile": "stepped-snow-vault-long-galleries",
    "sourceAuthoredName": "stepped-snow-vault-long-galleries"
  },
  {
    "id": "r4:grand-archive:enchanted-forest:small:03",
    "type": "grand-archive",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 3,
    "bounds": [
      71,
      16,
      82
    ],
    "wings": [
      [
        24,
        7,
        46,
        28
      ],
      [
        25,
        25,
        45,
        58
      ],
      [
        4,
        29,
        27,
        69
      ],
      [
        43,
        16,
        66,
        57
      ],
      [
        11,
        56,
        28,
        67
      ],
      [
        2,
        31,
        13,
        46
      ]
    ],
    "notches": [
      [
        31,
        36,
        38,
        43
      ]
    ],
    "octagons": [
      [
        4,
        63,
        7,
        10
      ],
      [
        66,
        49,
        8,
        11
      ]
    ],
    "skyline": [
      [
        31,
        11,
        39,
        18,
        13
      ],
      [
        13,
        36,
        17,
        41,
        12
      ],
      [
        53,
        24,
        57,
        28,
        13
      ],
      [
        12,
        53,
        15,
        56,
        12
      ]
    ],
    "entry": [
      35,
      7
    ],
    "porch": [
      32,
      3,
      38,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 28,
        "to": 42,
        "door": 35,
        "facing": "north"
      }
    ],
    "windows": [
      [
        26,
        7,
        "south"
      ],
      [
        44,
        7,
        "south"
      ],
      [
        2,
        40,
        "west"
      ],
      [
        66,
        26,
        "east"
      ],
      [
        0,
        58,
        "west"
      ],
      [
        70,
        46,
        "east"
      ]
    ],
    "fixtures": [
      [
        35,
        13
      ],
      [
        16,
        42
      ],
      [
        54,
        29
      ],
      [
        16,
        57
      ],
      [
        54,
        45
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "moss-ring-scriptorium-canopy-entry",
        "kind": "consultation-room",
        "rect": [
          28,
          10,
          42,
          19
        ]
      },
      {
        "id": "moss-ring-scriptorium-canopy-western",
        "kind": "scriptorium",
        "rect": [
          10,
          34,
          18,
          44
        ]
      },
      {
        "id": "moss-ring-scriptorium-canopy-eastern",
        "kind": "cataloguing",
        "rect": [
          52,
          21,
          60,
          31
        ]
      },
      {
        "id": "moss-ring-scriptorium-canopy-west-scriptorium",
        "kind": "records-vault",
        "rect": [
          10,
          52,
          18,
          61
        ]
      },
      {
        "id": "moss-ring-scriptorium-canopy-east-annex",
        "kind": "copying-gallery",
        "rect": [
          52,
          40,
          60,
          49
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          27,
          10,
          43,
          22
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          11,
          35,
          19,
          44
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          51,
          22,
          59,
          31
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          11,
          52,
          19,
          61
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          51,
          40,
          59,
          49
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "moss-ring-scriptorium-canopy",
      71,
      16,
      82
    ],
    "profile": "moss-ring-scriptorium-canopy",
    "sourceAuthoredName": "moss-ring-scriptorium-canopy"
  },
  {
    "id": "r4:grand-archive:mountain:large:03",
    "type": "grand-archive",
    "biome": "mountain",
    "size": "large",
    "variant": 3,
    "bounds": [
      119,
      16,
      110
    ],
    "wings": [
      [
        48,
        7,
        70,
        28
      ],
      [
        49,
        25,
        69,
        73
      ],
      [
        4,
        19,
        51,
        95
      ],
      [
        67,
        40,
        114,
        80
      ],
      [
        53,
        72,
        65,
        101
      ],
      [
        105,
        43,
        116,
        56
      ],
      [
        28,
        81,
        48,
        92
      ]
    ],
    "notches": [
      [
        54,
        52,
        64,
        62
      ]
    ],
    "octagons": [
      [
        4,
        89,
        7,
        10
      ],
      [
        114,
        72,
        8,
        11
      ]
    ],
    "skyline": [
      [
        55,
        11,
        63,
        18,
        13
      ],
      [
        37,
        26,
        41,
        31,
        10
      ],
      [
        77,
        48,
        81,
        52,
        11
      ]
    ],
    "entry": [
      59,
      7
    ],
    "porch": [
      56,
      3,
      62,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 52,
        "to": 66,
        "door": 59,
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
        68,
        7,
        "south"
      ],
      [
        4,
        30,
        "west"
      ],
      [
        116,
        50,
        "east"
      ],
      [
        0,
        84,
        "west"
      ],
      [
        118,
        69,
        "east"
      ]
    ],
    "fixtures": [
      [
        59,
        13
      ],
      [
        40,
        32
      ],
      [
        78,
        53
      ],
      [
        40,
        83
      ],
      [
        78,
        68
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "mountain-dual-cliff-vaults-entry",
        "kind": "consultation-room",
        "rect": [
          52,
          10,
          66,
          19
        ]
      },
      {
        "id": "mountain-dual-cliff-vaults-western",
        "kind": "scriptorium",
        "rect": [
          34,
          24,
          42,
          34
        ]
      },
      {
        "id": "mountain-dual-cliff-vaults-eastern",
        "kind": "cataloguing",
        "rect": [
          76,
          45,
          84,
          55
        ]
      },
      {
        "id": "mountain-dual-cliff-vaults-west-scriptorium",
        "kind": "records-vault",
        "rect": [
          34,
          78,
          42,
          87
        ]
      },
      {
        "id": "mountain-dual-cliff-vaults-east-annex",
        "kind": "copying-gallery",
        "rect": [
          76,
          63,
          84,
          72
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          51,
          10,
          67,
          22
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          35,
          25,
          43,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          75,
          46,
          83,
          55
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          35,
          78,
          43,
          87
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          75,
          63,
          83,
          72
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "mountain-dual-cliff-vaults",
      119,
      16,
      110
    ],
    "profile": "mountain-dual-cliff-vaults",
    "sourceAuthoredName": "mountain-dual-cliff-vaults"
  },
  {
    "id": "r4:observatory:enchanted-forest:medium:03",
    "type": "observatory",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 3,
    "bounds": [
      92,
      16,
      103
    ],
    "wings": [
      [
        35,
        7,
        57,
        28
      ],
      [
        36,
        25,
        56,
        72
      ],
      [
        4,
        35,
        38,
        78
      ],
      [
        54,
        17,
        87,
        89
      ],
      [
        53,
        78,
        73,
        90
      ],
      [
        2,
        37,
        13,
        52
      ],
      [
        56,
        75,
        77,
        86
      ]
    ],
    "notches": [
      [
        44,
        53,
        50,
        60
      ]
    ],
    "octagons": [
      [
        4,
        72,
        7,
        10
      ],
      [
        87,
        81,
        8,
        11
      ]
    ],
    "skyline": [
      [
        42,
        11,
        50,
        18,
        13
      ],
      [
        24,
        42,
        28,
        47,
        11
      ],
      [
        64,
        25,
        68,
        29,
        12
      ],
      [
        66,
        73,
        69,
        76,
        12
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
        "axis": "z",
        "fixed": 25,
        "from": 39,
        "to": 53,
        "door": 46,
        "facing": "north"
      }
    ],
    "windows": [
      [
        37,
        7,
        "south"
      ],
      [
        55,
        7,
        "south"
      ],
      [
        2,
        46,
        "west"
      ],
      [
        87,
        27,
        "east"
      ],
      [
        0,
        67,
        "west"
      ],
      [
        91,
        78,
        "east"
      ]
    ],
    "fixtures": [
      [
        46,
        13
      ],
      [
        27,
        48
      ],
      [
        65,
        30
      ],
      [
        27,
        66
      ],
      [
        65,
        77
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "spiral-roots-tower-triptych-entry",
        "kind": "instrument-room",
        "rect": [
          39,
          10,
          53,
          19
        ]
      },
      {
        "id": "spiral-roots-tower-triptych-western",
        "kind": "star-charts",
        "rect": [
          21,
          40,
          29,
          50
        ]
      },
      {
        "id": "spiral-roots-tower-triptych-eastern",
        "kind": "lens-workshop",
        "rect": [
          63,
          22,
          71,
          32
        ]
      },
      {
        "id": "spiral-roots-tower-triptych-west-scriptorium",
        "kind": "observation-deck",
        "rect": [
          21,
          61,
          29,
          70
        ]
      },
      {
        "id": "spiral-roots-tower-triptych-east-annex",
        "kind": "public-lecture",
        "rect": [
          63,
          72,
          71,
          81
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          38,
          10,
          54,
          22
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          22,
          41,
          30,
          50
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          62,
          23,
          70,
          32
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          22,
          61,
          30,
          70
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          62,
          72,
          70,
          81
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "spiral-roots-tower-triptych",
      92,
      16,
      103
    ],
    "profile": "spiral-roots-tower-triptych",
    "sourceAuthoredName": "spiral-roots-tower-triptych"
  },
  {
    "id": "r4:observatory:desert:large:03",
    "type": "observatory",
    "biome": "desert",
    "size": "large",
    "variant": 3,
    "bounds": [
      121,
      16,
      114
    ],
    "wings": [
      [
        49,
        7,
        71,
        28
      ],
      [
        50,
        25,
        70,
        84
      ],
      [
        4,
        22,
        52,
        100
      ],
      [
        68,
        40,
        116,
        75
      ],
      [
        107,
        43,
        118,
        56
      ]
    ],
    "notches": [
      [
        56,
        62,
        63,
        69
      ]
    ],
    "octagons": [
      [
        4,
        94,
        7,
        10
      ],
      [
        116,
        67,
        8,
        11
      ]
    ],
    "skyline": [
      [
        56,
        11,
        64,
        18,
        13
      ],
      [
        38,
        29,
        42,
        34,
        12
      ],
      [
        78,
        48,
        82,
        52,
        13
      ]
    ],
    "entry": [
      60,
      7
    ],
    "porch": [
      57,
      3,
      63,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 53,
        "to": 67,
        "door": 60,
        "facing": "north"
      }
    ],
    "windows": [
      [
        51,
        7,
        "south"
      ],
      [
        69,
        7,
        "south"
      ],
      [
        4,
        33,
        "west"
      ],
      [
        118,
        50,
        "east"
      ],
      [
        0,
        89,
        "west"
      ],
      [
        120,
        64,
        "east"
      ]
    ],
    "fixtures": [
      [
        60,
        13
      ],
      [
        41,
        35
      ],
      [
        79,
        53
      ],
      [
        41,
        88
      ],
      [
        79,
        63
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "desert-starburst-radial-platforms-entry",
        "kind": "instrument-room",
        "rect": [
          53,
          10,
          67,
          19
        ]
      },
      {
        "id": "desert-starburst-radial-platforms-western",
        "kind": "star-charts",
        "rect": [
          35,
          27,
          43,
          37
        ]
      },
      {
        "id": "desert-starburst-radial-platforms-eastern",
        "kind": "lens-workshop",
        "rect": [
          77,
          45,
          85,
          55
        ]
      },
      {
        "id": "desert-starburst-radial-platforms-west-scriptorium",
        "kind": "observation-deck",
        "rect": [
          35,
          83,
          43,
          92
        ]
      },
      {
        "id": "desert-starburst-radial-platforms-east-annex",
        "kind": "public-lecture",
        "rect": [
          77,
          58,
          85,
          67
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          52,
          10,
          68,
          22
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          36,
          28,
          44,
          37
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          76,
          46,
          84,
          55
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          36,
          83,
          44,
          92
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          76,
          58,
          84,
          67
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "desert-starburst-radial-platforms",
      121,
      16,
      114
    ],
    "profile": "desert-starburst-radial-platforms",
    "sourceAuthoredName": "desert-starburst-radial-platforms"
  },
  {
    "id": "r4:observatory:snow:small:03",
    "type": "observatory",
    "biome": "snow",
    "size": "small",
    "variant": 3,
    "bounds": [
      70,
      16,
      84
    ],
    "wings": [
      [
        24,
        7,
        46,
        28
      ],
      [
        25,
        25,
        45,
        57
      ],
      [
        4,
        15,
        27,
        70
      ],
      [
        43,
        29,
        65,
        58
      ],
      [
        29,
        56,
        41,
        75
      ],
      [
        11,
        58,
        28,
        69
      ],
      [
        2,
        17,
        13,
        32
      ]
    ],
    "notches": [
      [
        30,
        36,
        40,
        46
      ],
      [
        5,
        41,
        15,
        50
      ]
    ],
    "octagons": [
      [
        4,
        64,
        7,
        10
      ],
      [
        65,
        50,
        8,
        11
      ]
    ],
    "skyline": [
      [
        31,
        11,
        39,
        18,
        13
      ],
      [
        13,
        22,
        17,
        27,
        10
      ],
      [
        53,
        37,
        57,
        41,
        11
      ],
      [
        12,
        54,
        15,
        57,
        12
      ]
    ],
    "entry": [
      35,
      7
    ],
    "porch": [
      32,
      3,
      38,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 28,
        "to": 42,
        "door": 35,
        "facing": "north"
      }
    ],
    "windows": [
      [
        26,
        7,
        "south"
      ],
      [
        44,
        7,
        "south"
      ],
      [
        2,
        26,
        "west"
      ],
      [
        65,
        39,
        "east"
      ],
      [
        0,
        59,
        "west"
      ],
      [
        69,
        47,
        "east"
      ]
    ],
    "fixtures": [
      [
        35,
        13
      ],
      [
        16,
        28
      ],
      [
        54,
        42
      ],
      [
        16,
        58
      ],
      [
        54,
        46
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "snow-crescent-lens-gallery-entry",
        "kind": "instrument-room",
        "rect": [
          28,
          10,
          42,
          19
        ]
      },
      {
        "id": "snow-crescent-lens-gallery-western",
        "kind": "star-charts",
        "rect": [
          10,
          20,
          18,
          30
        ]
      },
      {
        "id": "snow-crescent-lens-gallery-eastern",
        "kind": "lens-workshop",
        "rect": [
          52,
          34,
          60,
          44
        ]
      },
      {
        "id": "snow-crescent-lens-gallery-west-scriptorium",
        "kind": "observation-deck",
        "rect": [
          10,
          53,
          18,
          62
        ]
      },
      {
        "id": "snow-crescent-lens-gallery-east-annex",
        "kind": "public-lecture",
        "rect": [
          52,
          45,
          60,
          51
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          27,
          10,
          43,
          22
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          11,
          21,
          19,
          30
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          51,
          35,
          59,
          44
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          11,
          53,
          19,
          62
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          51,
          45,
          59,
          51
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "snow-crescent-lens-gallery",
      70,
      16,
      84
    ],
    "profile": "snow-crescent-lens-gallery",
    "sourceAuthoredName": "snow-crescent-lens-gallery"
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
export function buildA2Wave4StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave4StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE4_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
