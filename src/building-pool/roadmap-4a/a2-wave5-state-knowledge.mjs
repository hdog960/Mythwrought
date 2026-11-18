// Roadmap A2 Wave 5: twelve distinctive original asymmetrical arcade, ring and cliffside source plans.
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
    "id": "r4:castle-palace:temperate:small:01",
    "type": "castle-palace",
    "biome": "temperate",
    "size": "small",
    "variant": 1,
    "bounds": [
      71,
      17,
      88
    ],
    "wings": [
      [
        25,
        7,
        45,
        80
      ],
      [
        6,
        17,
        27,
        35
      ],
      [
        43,
        25,
        65,
        43
      ],
      [
        6,
        52,
        27,
        71
      ],
      [
        43,
        61,
        65,
        80
      ],
      [
        15,
        70,
        63,
        77
      ]
    ],
    "notches": [
      [
        29,
        34,
        34,
        41
      ]
    ],
    "octagons": [
      [
        8,
        31,
        6,
        9
      ],
      [
        62,
        69,
        8,
        11
      ]
    ],
    "skyline": [
      [
        32,
        12,
        38,
        18,
        15
      ],
      [
        16,
        25,
        19,
        28,
        13
      ],
      [
        51,
        33,
        54,
        36,
        13
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
        "fixed": 26,
        "from": 28,
        "to": 42,
        "door": 35,
        "facing": "north"
      }
    ],
    "windows": [
      [
        27,
        7,
        "south"
      ],
      [
        43,
        7,
        "south"
      ],
      [
        3,
        27,
        "west"
      ],
      [
        65,
        35,
        "east"
      ],
      [
        6,
        63,
        "west"
      ],
      [
        70,
        72,
        "east"
      ]
    ],
    "fixtures": [
      [
        35,
        16
      ],
      [
        17,
        27
      ],
      [
        53,
        35
      ],
      [
        17,
        63
      ],
      [
        53,
        72
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "hook-temperate-small-0",
        "kind": "entrance-hall",
        "rect": [
          29,
          10,
          41,
          20
        ]
      },
      {
        "id": "hook-temperate-small-1",
        "kind": "tower-or-wing",
        "rect": [
          10,
          22,
          20,
          30
        ]
      },
      {
        "id": "hook-temperate-small-2",
        "kind": "council",
        "rect": [
          50,
          30,
          61,
          38
        ]
      },
      {
        "id": "hook-temperate-small-3",
        "kind": "grand-chamber",
        "rect": [
          10,
          58,
          20,
          66
        ]
      },
      {
        "id": "hook-temperate-small-4",
        "kind": "tower-or-wing",
        "rect": [
          50,
          67,
          61,
          75
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          28,
          10,
          42,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          14,
          22,
          21,
          31
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          49,
          30,
          56,
          39
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          14,
          58,
          21,
          67
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          49,
          67,
          56,
          76
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "hook",
      1,
      71,
      17,
      88
    ],
    "profile": "hook",
    "sourceAuthoredName": "Stonebridge Hook Court"
  },
  {
    "id": "r4:castle-palace:snow:medium:01",
    "type": "castle-palace",
    "biome": "snow",
    "size": "medium",
    "variant": 1,
    "bounds": [
      93,
      17,
      103
    ],
    "wings": [
      [
        36,
        7,
        56,
        95
      ],
      [
        6,
        21,
        38,
        39
      ],
      [
        54,
        36,
        87,
        54
      ],
      [
        6,
        72,
        38,
        91
      ],
      [
        54,
        79,
        87,
        98
      ],
      [
        77,
        49,
        87,
        82
      ],
      [
        25,
        78,
        69,
        85
      ]
    ],
    "notches": [
      [
        40,
        46,
        45,
        53
      ]
    ],
    "octagons": [
      [
        8,
        35,
        7,
        10
      ],
      [
        84,
        87,
        6,
        9
      ]
    ],
    "skyline": [
      [
        43,
        12,
        49,
        18,
        16
      ],
      [
        27,
        29,
        30,
        32,
        14
      ],
      [
        62,
        44,
        65,
        47,
        14
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
        "fixed": 26,
        "from": 39,
        "to": 53,
        "door": 46,
        "facing": "north"
      }
    ],
    "windows": [
      [
        38,
        7,
        "south"
      ],
      [
        54,
        7,
        "south"
      ],
      [
        2,
        31,
        "west"
      ],
      [
        87,
        46,
        "east"
      ],
      [
        6,
        83,
        "west"
      ],
      [
        90,
        90,
        "east"
      ]
    ],
    "fixtures": [
      [
        46,
        16
      ],
      [
        28,
        31
      ],
      [
        64,
        46
      ],
      [
        28,
        83
      ],
      [
        64,
        90
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "fork-snow-medium-0",
        "kind": "entrance-hall",
        "rect": [
          40,
          10,
          52,
          20
        ]
      },
      {
        "id": "fork-snow-medium-1",
        "kind": "tower-or-wing",
        "rect": [
          10,
          26,
          31,
          34
        ]
      },
      {
        "id": "fork-snow-medium-2",
        "kind": "council",
        "rect": [
          61,
          41,
          83,
          49
        ]
      },
      {
        "id": "fork-snow-medium-3",
        "kind": "grand-chamber",
        "rect": [
          10,
          78,
          31,
          86
        ]
      },
      {
        "id": "fork-snow-medium-4",
        "kind": "tower-or-wing",
        "rect": [
          61,
          85,
          83,
          93
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          39,
          10,
          53,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          25,
          26,
          32,
          35
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          60,
          41,
          67,
          50
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          25,
          78,
          32,
          87
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          60,
          85,
          67,
          94
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "fork",
      2,
      93,
      17,
      103
    ],
    "profile": "fork",
    "sourceAuthoredName": "Frostspire Fork Palace"
  },
  {
    "id": "r4:castle-palace:enchanted-forest:large:01",
    "type": "castle-palace",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 1,
    "bounds": [
      123,
      17,
      116
    ],
    "wings": [
      [
        51,
        7,
        71,
        108
      ],
      [
        6,
        31,
        53,
        49
      ],
      [
        69,
        18,
        117,
        36
      ],
      [
        6,
        80,
        53,
        99
      ],
      [
        69,
        87,
        117,
        106
      ],
      [
        41,
        98,
        115,
        105
      ],
      [
        6,
        44,
        15,
        83
      ]
    ],
    "notches": [
      [
        55,
        55,
        60,
        62
      ],
      [
        63,
        52,
        68,
        61
      ]
    ],
    "octagons": [
      [
        8,
        45,
        8,
        11
      ],
      [
        114,
        95,
        7,
        10
      ],
      [
        61,
        97,
        9,
        13
      ]
    ],
    "skyline": [
      [
        58,
        12,
        64,
        18,
        14
      ],
      [
        42,
        39,
        45,
        42,
        11
      ],
      [
        77,
        26,
        80,
        29,
        15
      ],
      [
        58,
        92,
        64,
        96,
        14
      ]
    ],
    "entry": [
      61,
      7
    ],
    "porch": [
      58,
      3,
      64,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 54,
        "to": 68,
        "door": 61,
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
        69,
        7,
        "south"
      ],
      [
        1,
        41,
        "west"
      ],
      [
        117,
        28,
        "east"
      ],
      [
        6,
        91,
        "west"
      ],
      [
        121,
        98,
        "east"
      ]
    ],
    "fixtures": [
      [
        61,
        16
      ],
      [
        43,
        41
      ],
      [
        79,
        28
      ],
      [
        43,
        91
      ],
      [
        79,
        98
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "cloister-enchanted-forest-large-0",
        "kind": "entrance-hall",
        "rect": [
          55,
          10,
          67,
          20
        ]
      },
      {
        "id": "cloister-enchanted-forest-large-1",
        "kind": "tower-or-wing",
        "rect": [
          10,
          36,
          46,
          44
        ]
      },
      {
        "id": "cloister-enchanted-forest-large-2",
        "kind": "council",
        "rect": [
          76,
          23,
          113,
          31
        ]
      },
      {
        "id": "cloister-enchanted-forest-large-3",
        "kind": "grand-chamber",
        "rect": [
          10,
          86,
          46,
          94
        ]
      },
      {
        "id": "cloister-enchanted-forest-large-4",
        "kind": "tower-or-wing",
        "rect": [
          76,
          93,
          113,
          101
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          54,
          10,
          68,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          40,
          36,
          47,
          45
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          75,
          23,
          82,
          32
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          40,
          86,
          47,
          95
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          75,
          93,
          82,
          102
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "cloister",
      3,
      123,
      17,
      116
    ],
    "profile": "cloister",
    "sourceAuthoredName": "Moonroot Crown Cloister"
  },
  {
    "id": "r4:embassy:desert:large:01",
    "type": "embassy",
    "biome": "desert",
    "size": "large",
    "variant": 1,
    "bounds": [
      117,
      17,
      109
    ],
    "wings": [
      [
        48,
        7,
        68,
        101
      ],
      [
        6,
        38,
        50,
        56
      ],
      [
        66,
        22,
        111,
        40
      ],
      [
        6,
        83,
        50,
        102
      ],
      [
        66,
        76,
        111,
        95
      ],
      [
        38,
        91,
        109,
        98
      ],
      [
        6,
        51,
        15,
        86
      ]
    ],
    "notches": [
      [
        52,
        60,
        57,
        67
      ],
      [
        60,
        49,
        65,
        58
      ]
    ],
    "octagons": [
      [
        8,
        52,
        5,
        8
      ],
      [
        108,
        84,
        8,
        11
      ]
    ],
    "skyline": [
      [
        55,
        12,
        61,
        18,
        15
      ],
      [
        39,
        46,
        42,
        49,
        12
      ],
      [
        74,
        30,
        77,
        33,
        12
      ],
      [
        74,
        85,
        77,
        88,
        13
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
        "fixed": 26,
        "from": 51,
        "to": 65,
        "door": 58,
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
        66,
        7,
        "south"
      ],
      [
        4,
        48,
        "west"
      ],
      [
        111,
        32,
        "east"
      ],
      [
        6,
        94,
        "west"
      ],
      [
        116,
        87,
        "east"
      ]
    ],
    "fixtures": [
      [
        58,
        16
      ],
      [
        40,
        48
      ],
      [
        76,
        32
      ],
      [
        40,
        94
      ],
      [
        76,
        87
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "crescent-desert-large-0",
        "kind": "formal-chamber",
        "rect": [
          52,
          10,
          64,
          20
        ]
      },
      {
        "id": "crescent-desert-large-1",
        "kind": "guest-area",
        "rect": [
          10,
          43,
          43,
          51
        ]
      },
      {
        "id": "crescent-desert-large-2",
        "kind": "consular-office",
        "rect": [
          73,
          27,
          107,
          35
        ]
      },
      {
        "id": "crescent-desert-large-3",
        "kind": "treaty-archive",
        "rect": [
          10,
          89,
          43,
          97
        ]
      },
      {
        "id": "crescent-desert-large-4",
        "kind": "hospitality",
        "rect": [
          73,
          82,
          107,
          90
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          51,
          10,
          65,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          37,
          43,
          44,
          52
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          72,
          27,
          79,
          36
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          37,
          89,
          44,
          98
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          72,
          82,
          79,
          91
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "crescent",
      4,
      117,
      17,
      109
    ],
    "profile": "crescent",
    "sourceAuthoredName": "Sunglass Consular Crescent"
  },
  {
    "id": "r4:embassy:mountain:small:01",
    "type": "embassy",
    "biome": "mountain",
    "size": "small",
    "variant": 1,
    "bounds": [
      74,
      17,
      91
    ],
    "wings": [
      [
        27,
        7,
        47,
        83
      ],
      [
        6,
        16,
        29,
        34
      ],
      [
        45,
        33,
        68,
        51
      ],
      [
        6,
        65,
        29,
        84
      ],
      [
        45,
        77,
        68,
        96
      ],
      [
        2,
        25,
        15,
        40
      ],
      [
        59,
        84,
        71,
        96
      ]
    ],
    "notches": [
      [
        31,
        40,
        36,
        47
      ],
      [
        7,
        18,
        13,
        24
      ]
    ],
    "octagons": [
      [
        8,
        30,
        6,
        9
      ],
      [
        65,
        85,
        6,
        9
      ]
    ],
    "skyline": [
      [
        34,
        12,
        40,
        18,
        16
      ],
      [
        18,
        24,
        21,
        27,
        13
      ],
      [
        53,
        41,
        56,
        44,
        13
      ],
      [
        53,
        86,
        56,
        89,
        13
      ]
    ],
    "entry": [
      37,
      7
    ],
    "porch": [
      34,
      3,
      40,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 30,
        "to": 44,
        "door": 37,
        "facing": "north"
      }
    ],
    "windows": [
      [
        29,
        7,
        "south"
      ],
      [
        45,
        7,
        "south"
      ],
      [
        2,
        26,
        "west"
      ],
      [
        68,
        43,
        "east"
      ],
      [
        6,
        76,
        "west"
      ],
      [
        71,
        88,
        "east"
      ]
    ],
    "fixtures": [
      [
        37,
        16
      ],
      [
        19,
        26
      ],
      [
        55,
        43
      ],
      [
        19,
        76
      ],
      [
        55,
        88
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "terraces-mountain-small-0",
        "kind": "formal-chamber",
        "rect": [
          31,
          10,
          43,
          20
        ]
      },
      {
        "id": "terraces-mountain-small-1",
        "kind": "guest-area",
        "rect": [
          10,
          21,
          22,
          29
        ]
      },
      {
        "id": "terraces-mountain-small-2",
        "kind": "consular-office",
        "rect": [
          52,
          38,
          64,
          46
        ]
      },
      {
        "id": "terraces-mountain-small-3",
        "kind": "treaty-archive",
        "rect": [
          10,
          71,
          22,
          79
        ]
      },
      {
        "id": "terraces-mountain-small-4",
        "kind": "hospitality",
        "rect": [
          52,
          83,
          64,
          91
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          30,
          10,
          44,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          16,
          21,
          23,
          30
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          51,
          38,
          58,
          47
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          16,
          71,
          23,
          80
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          51,
          83,
          58,
          92
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "terraces",
      5,
      74,
      17,
      91
    ],
    "profile": "terraces",
    "sourceAuthoredName": "Peregrine Tiered Embassy"
  },
  {
    "id": "r4:embassy:enchanted-forest:medium:01",
    "type": "embassy",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 1,
    "bounds": [
      95,
      17,
      101
    ],
    "wings": [
      [
        37,
        7,
        57,
        93
      ],
      [
        6,
        28,
        39,
        46
      ],
      [
        55,
        17,
        89,
        35
      ],
      [
        6,
        79,
        39,
        98
      ],
      [
        55,
        70,
        89,
        89
      ],
      [
        79,
        30,
        89,
        73
      ],
      [
        2,
        37,
        25,
        52
      ],
      [
        69,
        77,
        92,
        89
      ]
    ],
    "notches": [
      [
        41,
        53,
        46,
        60
      ]
    ],
    "octagons": [
      [
        8,
        42,
        7,
        10
      ],
      [
        86,
        78,
        7,
        10
      ],
      [
        47,
        82,
        9,
        13
      ]
    ],
    "skyline": [
      [
        44,
        12,
        50,
        18,
        14
      ],
      [
        28,
        36,
        31,
        39,
        14
      ],
      [
        63,
        25,
        66,
        28,
        14
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
        "axis": "z",
        "fixed": 26,
        "from": 40,
        "to": 54,
        "door": 47,
        "facing": "north"
      }
    ],
    "windows": [
      [
        39,
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
        38,
        "west"
      ],
      [
        89,
        27,
        "east"
      ],
      [
        6,
        90,
        "west"
      ],
      [
        93,
        81,
        "east"
      ]
    ],
    "fixtures": [
      [
        47,
        16
      ],
      [
        29,
        38
      ],
      [
        65,
        27
      ],
      [
        29,
        90
      ],
      [
        65,
        81
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "spiral-enchanted-forest-medium-0",
        "kind": "formal-chamber",
        "rect": [
          41,
          10,
          53,
          20
        ]
      },
      {
        "id": "spiral-enchanted-forest-medium-1",
        "kind": "guest-area",
        "rect": [
          10,
          33,
          32,
          41
        ]
      },
      {
        "id": "spiral-enchanted-forest-medium-2",
        "kind": "consular-office",
        "rect": [
          62,
          22,
          85,
          30
        ]
      },
      {
        "id": "spiral-enchanted-forest-medium-3",
        "kind": "treaty-archive",
        "rect": [
          10,
          85,
          32,
          93
        ]
      },
      {
        "id": "spiral-enchanted-forest-medium-4",
        "kind": "hospitality",
        "rect": [
          62,
          76,
          85,
          84
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          40,
          10,
          54,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          26,
          33,
          33,
          42
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          61,
          22,
          68,
          31
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          26,
          85,
          33,
          94
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          61,
          76,
          68,
          85
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "spiral",
      6,
      95,
      17,
      101
    ],
    "profile": "spiral",
    "sourceAuthoredName": "Elderleaf Spiral Consulate"
  },
  {
    "id": "r4:grand-archive:desert:medium:01",
    "type": "grand-archive",
    "biome": "desert",
    "size": "medium",
    "variant": 1,
    "bounds": [
      94,
      17,
      105
    ],
    "wings": [
      [
        37,
        7,
        57,
        97
      ],
      [
        6,
        38,
        39,
        56
      ],
      [
        55,
        22,
        88,
        40
      ],
      [
        6,
        87,
        39,
        106
      ],
      [
        55,
        74,
        88,
        93
      ],
      [
        6,
        51,
        15,
        90
      ]
    ],
    "notches": [
      [
        41,
        62,
        46,
        69
      ],
      [
        49,
        48,
        54,
        57
      ]
    ],
    "octagons": [
      [
        8,
        52,
        8,
        11
      ],
      [
        85,
        82,
        8,
        11
      ]
    ],
    "skyline": [
      [
        44,
        12,
        50,
        18,
        15
      ],
      [
        28,
        46,
        31,
        49,
        11
      ],
      [
        63,
        30,
        66,
        33,
        15
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
        "axis": "z",
        "fixed": 26,
        "from": 40,
        "to": 54,
        "door": 47,
        "facing": "north"
      }
    ],
    "windows": [
      [
        39,
        7,
        "south"
      ],
      [
        55,
        7,
        "south"
      ],
      [
        1,
        48,
        "west"
      ],
      [
        88,
        32,
        "east"
      ],
      [
        6,
        98,
        "west"
      ],
      [
        93,
        85,
        "east"
      ]
    ],
    "fixtures": [
      [
        47,
        16
      ],
      [
        29,
        48
      ],
      [
        65,
        32
      ],
      [
        29,
        98
      ],
      [
        65,
        85
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "canal-desert-medium-0",
        "kind": "consultation-room",
        "rect": [
          41,
          10,
          53,
          20
        ]
      },
      {
        "id": "canal-desert-medium-1",
        "kind": "scriptorium",
        "rect": [
          10,
          43,
          32,
          51
        ]
      },
      {
        "id": "canal-desert-medium-2",
        "kind": "cataloguing",
        "rect": [
          62,
          27,
          84,
          35
        ]
      },
      {
        "id": "canal-desert-medium-3",
        "kind": "records-vault",
        "rect": [
          10,
          93,
          32,
          101
        ]
      },
      {
        "id": "canal-desert-medium-4",
        "kind": "copying-gallery",
        "rect": [
          62,
          80,
          84,
          88
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          40,
          10,
          54,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          26,
          43,
          33,
          52
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          61,
          27,
          68,
          36
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          26,
          93,
          33,
          102
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          61,
          80,
          68,
          89
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "canal",
      7,
      94,
      17,
      105
    ],
    "profile": "canal",
    "sourceAuthoredName": "Amber Canal Codex Yard"
  },
  {
    "id": "r4:grand-archive:mountain:large:02",
    "type": "grand-archive",
    "biome": "mountain",
    "size": "large",
    "variant": 2,
    "bounds": [
      125,
      17,
      118
    ],
    "wings": [
      [
        52,
        7,
        72,
        110
      ],
      [
        6,
        18,
        54,
        36
      ],
      [
        70,
        40,
        119,
        58
      ],
      [
        6,
        79,
        54,
        98
      ],
      [
        70,
        90,
        119,
        109
      ],
      [
        109,
        53,
        119,
        93
      ],
      [
        37,
        88,
        86,
        94
      ]
    ],
    "notches": [
      [
        56,
        48,
        61,
        55
      ]
    ],
    "octagons": [
      [
        8,
        32,
        5,
        8
      ],
      [
        116,
        98,
        6,
        9
      ]
    ],
    "skyline": [
      [
        59,
        12,
        65,
        18,
        16
      ],
      [
        43,
        26,
        46,
        29,
        12
      ],
      [
        78,
        48,
        81,
        51,
        12
      ],
      [
        59,
        94,
        65,
        98,
        14
      ]
    ],
    "entry": [
      62,
      7
    ],
    "porch": [
      59,
      3,
      65,
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
        54,
        7,
        "south"
      ],
      [
        70,
        7,
        "south"
      ],
      [
        4,
        28,
        "west"
      ],
      [
        119,
        50,
        "east"
      ],
      [
        6,
        90,
        "west"
      ],
      [
        122,
        101,
        "east"
      ]
    ],
    "fixtures": [
      [
        62,
        16
      ],
      [
        44,
        28
      ],
      [
        80,
        50
      ],
      [
        44,
        90
      ],
      [
        80,
        101
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "stack-mountain-large-0",
        "kind": "consultation-room",
        "rect": [
          56,
          10,
          68,
          20
        ]
      },
      {
        "id": "stack-mountain-large-1",
        "kind": "scriptorium",
        "rect": [
          10,
          23,
          47,
          31
        ]
      },
      {
        "id": "stack-mountain-large-2",
        "kind": "cataloguing",
        "rect": [
          77,
          45,
          115,
          53
        ]
      },
      {
        "id": "stack-mountain-large-3",
        "kind": "records-vault",
        "rect": [
          10,
          85,
          47,
          93
        ]
      },
      {
        "id": "stack-mountain-large-4",
        "kind": "copying-gallery",
        "rect": [
          77,
          96,
          115,
          104
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          55,
          10,
          69,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          41,
          23,
          48,
          32
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          76,
          45,
          83,
          54
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          41,
          85,
          48,
          94
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          76,
          96,
          83,
          105
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "stack",
      8,
      125,
      17,
      118
    ],
    "profile": "stack",
    "sourceAuthoredName": "Basalt T-Stack Repository"
  },
  {
    "id": "r4:grand-archive:snow:small:01",
    "type": "grand-archive",
    "biome": "snow",
    "size": "small",
    "variant": 1,
    "bounds": [
      73,
      17,
      87
    ],
    "wings": [
      [
        26,
        7,
        46,
        79
      ],
      [
        6,
        25,
        28,
        43
      ],
      [
        44,
        13,
        67,
        31
      ],
      [
        6,
        64,
        28,
        83
      ],
      [
        44,
        59,
        67,
        78
      ],
      [
        2,
        34,
        14,
        49
      ],
      [
        58,
        66,
        70,
        78
      ]
    ],
    "notches": [
      [
        30,
        44,
        35,
        51
      ],
      [
        7,
        27,
        13,
        33
      ]
    ],
    "octagons": [
      [
        8,
        39,
        6,
        9
      ],
      [
        64,
        67,
        7,
        10
      ]
    ],
    "skyline": [
      [
        33,
        12,
        39,
        18,
        14
      ],
      [
        17,
        33,
        20,
        36,
        13
      ],
      [
        52,
        21,
        55,
        24,
        13
      ],
      [
        52,
        68,
        55,
        71,
        13
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
        "axis": "z",
        "fixed": 26,
        "from": 29,
        "to": 43,
        "door": 36,
        "facing": "north"
      }
    ],
    "windows": [
      [
        28,
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
        35,
        "west"
      ],
      [
        67,
        23,
        "east"
      ],
      [
        6,
        75,
        "west"
      ],
      [
        71,
        70,
        "east"
      ]
    ],
    "fixtures": [
      [
        36,
        16
      ],
      [
        18,
        35
      ],
      [
        54,
        23
      ],
      [
        18,
        75
      ],
      [
        54,
        70
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "zigzag-snow-small-0",
        "kind": "consultation-room",
        "rect": [
          30,
          10,
          42,
          20
        ]
      },
      {
        "id": "zigzag-snow-small-1",
        "kind": "scriptorium",
        "rect": [
          10,
          30,
          21,
          38
        ]
      },
      {
        "id": "zigzag-snow-small-2",
        "kind": "cataloguing",
        "rect": [
          51,
          18,
          63,
          26
        ]
      },
      {
        "id": "zigzag-snow-small-3",
        "kind": "records-vault",
        "rect": [
          10,
          70,
          21,
          78
        ]
      },
      {
        "id": "zigzag-snow-small-4",
        "kind": "copying-gallery",
        "rect": [
          51,
          65,
          63,
          73
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          29,
          10,
          43,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          15,
          30,
          22,
          39
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          50,
          18,
          57,
          27
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          15,
          70,
          22,
          79
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          50,
          65,
          57,
          74
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "zigzag",
      9,
      73,
      17,
      87
    ],
    "profile": "zigzag",
    "sourceAuthoredName": "Whiteglyph Zigzag Scriptorium"
  },
  {
    "id": "r4:observatory:temperate:large:01",
    "type": "observatory",
    "biome": "temperate",
    "size": "large",
    "variant": 1,
    "bounds": [
      126,
      17,
      113
    ],
    "wings": [
      [
        53,
        7,
        73,
        105
      ],
      [
        6,
        33,
        55,
        51
      ],
      [
        71,
        16,
        120,
        34
      ],
      [
        6,
        84,
        55,
        103
      ],
      [
        71,
        77,
        120,
        96
      ],
      [
        43,
        95,
        118,
        102
      ],
      [
        6,
        46,
        15,
        87
      ],
      [
        32,
        71,
        95,
        78
      ]
    ],
    "notches": [
      [
        57,
        58,
        62,
        65
      ]
    ],
    "octagons": [
      [
        8,
        47,
        7,
        10
      ],
      [
        117,
        85,
        8,
        11
      ],
      [
        63,
        94,
        10,
        14
      ]
    ],
    "skyline": [
      [
        60,
        12,
        66,
        18,
        15
      ],
      [
        44,
        41,
        47,
        44,
        14
      ],
      [
        79,
        24,
        82,
        27,
        14
      ],
      [
        60,
        89,
        66,
        93,
        14
      ]
    ],
    "entry": [
      63,
      7
    ],
    "porch": [
      60,
      3,
      66,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 56,
        "to": 70,
        "door": 63,
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
        71,
        7,
        "south"
      ],
      [
        2,
        43,
        "west"
      ],
      [
        120,
        26,
        "east"
      ],
      [
        6,
        95,
        "west"
      ],
      [
        125,
        88,
        "east"
      ]
    ],
    "fixtures": [
      [
        63,
        16
      ],
      [
        45,
        43
      ],
      [
        81,
        26
      ],
      [
        45,
        95
      ],
      [
        81,
        88
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "radial-temperate-large-0",
        "kind": "instrument-room",
        "rect": [
          57,
          10,
          69,
          20
        ]
      },
      {
        "id": "radial-temperate-large-1",
        "kind": "star-charts",
        "rect": [
          10,
          38,
          48,
          46
        ]
      },
      {
        "id": "radial-temperate-large-2",
        "kind": "lens-workshop",
        "rect": [
          78,
          21,
          116,
          29
        ]
      },
      {
        "id": "radial-temperate-large-3",
        "kind": "observation-deck",
        "rect": [
          10,
          90,
          48,
          98
        ]
      },
      {
        "id": "radial-temperate-large-4",
        "kind": "public-lecture",
        "rect": [
          78,
          83,
          116,
          91
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          56,
          10,
          70,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          42,
          38,
          49,
          47
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          77,
          21,
          84,
          30
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          42,
          90,
          49,
          99
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          77,
          83,
          84,
          92
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "radial",
      10,
      126,
      17,
      113
    ],
    "profile": "radial",
    "sourceAuthoredName": "Meridian Radial Observatorium"
  },
  {
    "id": "r4:observatory:desert:small:01",
    "type": "observatory",
    "biome": "desert",
    "size": "small",
    "variant": 1,
    "bounds": [
      69,
      17,
      86
    ],
    "wings": [
      [
        24,
        7,
        44,
        78
      ],
      [
        6,
        16,
        26,
        34
      ],
      [
        42,
        29,
        63,
        47
      ],
      [
        6,
        62,
        26,
        81
      ],
      [
        42,
        69,
        63,
        88
      ],
      [
        2,
        25,
        12,
        40
      ],
      [
        56,
        76,
        66,
        88
      ]
    ],
    "notches": [
      [
        28,
        39,
        33,
        46
      ],
      [
        7,
        18,
        13,
        24
      ]
    ],
    "octagons": [
      [
        8,
        30,
        8,
        11
      ],
      [
        60,
        77,
        6,
        9
      ]
    ],
    "skyline": [
      [
        31,
        12,
        37,
        18,
        16
      ],
      [
        15,
        24,
        18,
        27,
        11
      ],
      [
        50,
        37,
        53,
        40,
        15
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
        "fixed": 26,
        "from": 27,
        "to": 41,
        "door": 34,
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
        42,
        7,
        "south"
      ],
      [
        1,
        26,
        "west"
      ],
      [
        63,
        39,
        "east"
      ],
      [
        6,
        73,
        "west"
      ],
      [
        66,
        80,
        "east"
      ]
    ],
    "fixtures": [
      [
        34,
        16
      ],
      [
        16,
        26
      ],
      [
        52,
        39
      ],
      [
        16,
        73
      ],
      [
        52,
        80
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "steps-desert-small-0",
        "kind": "instrument-room",
        "rect": [
          28,
          10,
          40,
          20
        ]
      },
      {
        "id": "steps-desert-small-1",
        "kind": "star-charts",
        "rect": [
          10,
          21,
          19,
          29
        ]
      },
      {
        "id": "steps-desert-small-2",
        "kind": "lens-workshop",
        "rect": [
          49,
          34,
          59,
          42
        ]
      },
      {
        "id": "steps-desert-small-3",
        "kind": "observation-deck",
        "rect": [
          10,
          68,
          19,
          76
        ]
      },
      {
        "id": "steps-desert-small-4",
        "kind": "public-lecture",
        "rect": [
          49,
          75,
          59,
          83
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          27,
          10,
          41,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          13,
          21,
          20,
          30
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          48,
          34,
          55,
          43
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          13,
          68,
          20,
          77
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          48,
          75,
          55,
          84
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "steps",
      11,
      69,
      17,
      86
    ],
    "profile": "steps",
    "sourceAuthoredName": "Dunelens South Steps"
  },
  {
    "id": "r4:observatory:mountain:medium:01",
    "type": "observatory",
    "biome": "mountain",
    "size": "medium",
    "variant": 1,
    "bounds": [
      97,
      17,
      109
    ],
    "wings": [
      [
        38,
        7,
        58,
        101
      ],
      [
        6,
        20,
        40,
        38
      ],
      [
        56,
        36,
        91,
        54
      ],
      [
        6,
        80,
        40,
        99
      ],
      [
        56,
        90,
        91,
        109
      ],
      [
        28,
        91,
        89,
        98
      ],
      [
        81,
        49,
        91,
        93
      ]
    ],
    "notches": [
      [
        42,
        50,
        47,
        57
      ],
      [
        50,
        63,
        55,
        72
      ]
    ],
    "octagons": [
      [
        8,
        34,
        5,
        8
      ],
      [
        88,
        98,
        7,
        10
      ]
    ],
    "skyline": [
      [
        45,
        12,
        51,
        18,
        14
      ],
      [
        29,
        28,
        32,
        31,
        12
      ],
      [
        64,
        44,
        67,
        47,
        12
      ],
      [
        45,
        85,
        51,
        89,
        14
      ]
    ],
    "entry": [
      48,
      7
    ],
    "porch": [
      45,
      3,
      51,
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
        40,
        7,
        "south"
      ],
      [
        56,
        7,
        "south"
      ],
      [
        4,
        30,
        "west"
      ],
      [
        91,
        46,
        "east"
      ],
      [
        6,
        91,
        "west"
      ],
      [
        95,
        101,
        "east"
      ]
    ],
    "fixtures": [
      [
        48,
        16
      ],
      [
        30,
        30
      ],
      [
        66,
        46
      ],
      [
        30,
        91
      ],
      [
        66,
        101
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "skybridge-mountain-medium-0",
        "kind": "instrument-room",
        "rect": [
          42,
          10,
          54,
          20
        ]
      },
      {
        "id": "skybridge-mountain-medium-1",
        "kind": "star-charts",
        "rect": [
          10,
          25,
          33,
          33
        ]
      },
      {
        "id": "skybridge-mountain-medium-2",
        "kind": "lens-workshop",
        "rect": [
          63,
          41,
          87,
          49
        ]
      },
      {
        "id": "skybridge-mountain-medium-3",
        "kind": "observation-deck",
        "rect": [
          10,
          86,
          33,
          94
        ]
      },
      {
        "id": "skybridge-mountain-medium-4",
        "kind": "public-lecture",
        "rect": [
          63,
          96,
          87,
          104
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          41,
          10,
          55,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          27,
          25,
          34,
          34
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          62,
          41,
          69,
          50
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          27,
          86,
          34,
          95
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          62,
          96,
          69,
          105
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      }
    ],
    "signature": [
      "skybridge",
      12,
      97,
      17,
      109
    ],
    "profile": "skybridge",
    "sourceAuthoredName": "Cloudcrest Skybridge Spire"
  }
]

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
export function buildA2Wave5StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave5StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE5_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
