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
    "id": "r4:castle-palace:desert:medium:02",
    "type": "castle-palace",
    "biome": "desert",
    "size": "medium",
    "variant": 2,
    "bounds": [
      101,
      22,
      121
    ],
    "wings": [
      [
        42,
        7,
        62,
        114
      ],
      [
        4,
        28,
        48,
        45
      ],
      [
        56,
        50,
        96,
        68
      ],
      [
        5,
        79,
        47,
        98
      ],
      [
        57,
        99,
        95,
        116
      ],
      [
        9,
        59,
        45,
        85
      ],
      [
        59,
        82,
        88,
        105
      ]
    ],
    "notches": [
      [
        49,
        64,
        54,
        71
      ],
      [
        43,
        109,
        45,
        113
      ]
    ],
    "octagons": [
      [
        11,
        42,
        5,
        8
      ],
      [
        88,
        113,
        6,
        9
      ],
      [
        [
          53,
          73,
          5,
          7
        ]
      ]
    ],
    "skyline": [
      [
        49,
        11,
        55,
        17,
        15
      ],
      [
        24,
        33,
        28,
        37,
        12
      ],
      [
        74,
        55,
        78,
        59,
        14
      ],
      [
        24,
        84,
        28,
        88,
        14
      ],
      [
        74,
        104,
        78,
        108,
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
        "fixed": 24,
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
        4,
        32,
        "west"
      ],
      [
        96,
        54,
        "east"
      ],
      [
        5,
        83,
        "west"
      ],
      [
        95,
        103,
        "east"
      ]
    ],
    "fixtures": [
      [
        52,
        16
      ],
      [
        26,
        36
      ],
      [
        76,
        58
      ],
      [
        26,
        87
      ],
      [
        76,
        107
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "sandstone-staggered-reservoir-forum",
        "kind": "entrance-hall",
        "rect": [
          46,
          10,
          58,
          20
        ]
      },
      {
        "id": "sandstone-staggered-reservoir-west-early",
        "kind": "tower-or-wing",
        "rect": [
          21,
          31,
          31,
          40
        ]
      },
      {
        "id": "sandstone-staggered-reservoir-east-early",
        "kind": "council",
        "rect": [
          71,
          53,
          81,
          62
        ]
      },
      {
        "id": "sandstone-staggered-reservoir-west-rear",
        "kind": "grand-chamber",
        "rect": [
          21,
          82,
          31,
          91
        ]
      },
      {
        "id": "sandstone-staggered-reservoir-east-rear",
        "kind": "watch-library",
        "rect": [
          71,
          102,
          81,
          111
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          45,
          10,
          59,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          21,
          31,
          31,
          41
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          71,
          53,
          81,
          63
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          21,
          82,
          31,
          92
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          71,
          102,
          81,
          112
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "sandstone-staggered-reservoir",
      1,
      101,
      22,
      121,
      71
    ],
    "profile": "sandstone-staggered-reservoir",
    "sourceAuthoredName": "Oasis Bastion of Nine Courtyards"
  },
  {
    "id": "r4:castle-palace:snow:small:03",
    "type": "castle-palace",
    "biome": "snow",
    "size": "small",
    "variant": 3,
    "bounds": [
      81,
      22,
      109
    ],
    "wings": [
      [
        26,
        7,
        46,
        102
      ],
      [
        5,
        27,
        32,
        44
      ],
      [
        40,
        45,
        75,
        63
      ],
      [
        6,
        73,
        31,
        92
      ],
      [
        41,
        89,
        74,
        106
      ],
      [
        10,
        37,
        21,
        71
      ],
      [
        52,
        54,
        62,
        86
      ]
    ],
    "notches": [
      [
        33,
        59,
        38,
        66
      ],
      [
        27,
        99,
        29,
        103
      ]
    ],
    "octagons": [
      [
        12,
        41,
        5,
        8
      ],
      [
        67,
        103,
        6,
        9
      ],
      []
    ],
    "skyline": [
      [
        33,
        11,
        39,
        17,
        16
      ],
      [
        16,
        32,
        20,
        36,
        13
      ],
      [
        55,
        50,
        59,
        54,
        15
      ],
      [
        16,
        78,
        20,
        82,
        15
      ],
      [
        55,
        94,
        59,
        98,
        13
      ]
    ],
    "entry": [
      36,
      7
    ],
    "porch": [
      32,
      3,
      40,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 29,
        "to": 43,
        "door": 36,
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
        43,
        7,
        "south"
      ],
      [
        5,
        31,
        "west"
      ],
      [
        75,
        49,
        "east"
      ],
      [
        6,
        77,
        "west"
      ],
      [
        74,
        93,
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
        57,
        53
      ],
      [
        18,
        81
      ],
      [
        57,
        97
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "staggered-snow-horn-forum",
        "kind": "entrance-hall",
        "rect": [
          30,
          10,
          42,
          20
        ]
      },
      {
        "id": "staggered-snow-horn-west-early",
        "kind": "tower-or-wing",
        "rect": [
          13,
          30,
          23,
          39
        ]
      },
      {
        "id": "staggered-snow-horn-east-early",
        "kind": "council",
        "rect": [
          52,
          48,
          62,
          57
        ]
      },
      {
        "id": "staggered-snow-horn-west-rear",
        "kind": "grand-chamber",
        "rect": [
          13,
          76,
          23,
          85
        ]
      },
      {
        "id": "staggered-snow-horn-east-rear",
        "kind": "watch-library",
        "rect": [
          52,
          92,
          62,
          101
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
        "period": 5
      },
      {
        "rect": [
          13,
          30,
          23,
          40
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          52,
          48,
          62,
          58
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          13,
          76,
          23,
          86
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          52,
          92,
          62,
          102
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "staggered-snow-horn",
      2,
      81,
      22,
      109,
      62
    ],
    "profile": "staggered-snow-horn",
    "sourceAuthoredName": "Frostglass Antler Crown"
  },
  {
    "id": "r4:castle-palace:mountain:large:02",
    "type": "castle-palace",
    "biome": "mountain",
    "size": "large",
    "variant": 2,
    "bounds": [
      139,
      22,
      141
    ],
    "wings": [
      [
        59,
        7,
        79,
        134
      ],
      [
        6,
        33,
        65,
        50
      ],
      [
        73,
        57,
        132,
        75
      ],
      [
        7,
        96,
        64,
        115
      ],
      [
        74,
        118,
        131,
        135
      ],
      [
        39,
        67,
        52,
        105
      ],
      [
        87,
        43,
        98,
        116
      ]
    ],
    "notches": [
      [
        66,
        76,
        71,
        83
      ],
      [
        60,
        128,
        62,
        132
      ]
    ],
    "octagons": [
      [
        13,
        47,
        5,
        8
      ],
      [
        124,
        132,
        6,
        9
      ],
      []
    ],
    "skyline": [
      [
        66,
        11,
        72,
        17,
        17
      ],
      [
        33,
        38,
        37,
        42,
        14
      ],
      [
        100,
        62,
        104,
        66,
        13
      ],
      [
        33,
        101,
        37,
        105,
        12
      ],
      [
        100,
        123,
        104,
        127,
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
        "fixed": 24,
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
        6,
        37,
        "west"
      ],
      [
        132,
        61,
        "east"
      ],
      [
        7,
        100,
        "west"
      ],
      [
        131,
        122,
        "east"
      ]
    ],
    "fixtures": [
      [
        69,
        16
      ],
      [
        35,
        41
      ],
      [
        102,
        65
      ],
      [
        35,
        104
      ],
      [
        102,
        126
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "cliff-counterweight-buttress-forum",
        "kind": "entrance-hall",
        "rect": [
          63,
          10,
          75,
          20
        ]
      },
      {
        "id": "cliff-counterweight-buttress-west-early",
        "kind": "tower-or-wing",
        "rect": [
          30,
          36,
          40,
          45
        ]
      },
      {
        "id": "cliff-counterweight-buttress-east-early",
        "kind": "council",
        "rect": [
          97,
          60,
          107,
          69
        ]
      },
      {
        "id": "cliff-counterweight-buttress-west-rear",
        "kind": "grand-chamber",
        "rect": [
          30,
          99,
          40,
          108
        ]
      },
      {
        "id": "cliff-counterweight-buttress-east-rear",
        "kind": "watch-library",
        "rect": [
          97,
          121,
          107,
          130
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          62,
          10,
          76,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          30,
          36,
          40,
          46
        ],
        "profile": "hip",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          97,
          60,
          107,
          70
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          30,
          99,
          40,
          109
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          97,
          121,
          107,
          131
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "cliff-counterweight-buttress",
      3,
      139,
      22,
      141,
      85
    ],
    "profile": "cliff-counterweight-buttress",
    "sourceAuthoredName": "Thundershelf Stone Regent"
  },
  {
    "id": "r4:embassy:temperate:small:01",
    "type": "embassy",
    "biome": "temperate",
    "size": "small",
    "variant": 1,
    "bounds": [
      83,
      22,
      105
    ],
    "wings": [
      [
        30,
        7,
        50,
        98
      ],
      [
        4,
        28,
        36,
        45
      ],
      [
        44,
        44,
        78,
        62
      ],
      [
        5,
        72,
        35,
        91
      ],
      [
        45,
        86,
        77,
        103
      ],
      [
        11,
        44,
        34,
        77
      ],
      [
        46,
        60,
        69,
        91
      ]
    ],
    "notches": [
      [
        37,
        58,
        42,
        65
      ],
      [
        31,
        96,
        33,
        100
      ]
    ],
    "octagons": [
      [
        11,
        42,
        5,
        8
      ],
      [
        70,
        100,
        6,
        9
      ],
      [
        [
          41,
          67,
          5,
          7
        ]
      ]
    ],
    "skyline": [
      [
        37,
        11,
        43,
        17,
        15
      ],
      [
        18,
        33,
        22,
        37,
        15
      ],
      [
        59,
        49,
        63,
        53,
        14
      ],
      [
        18,
        77,
        22,
        81,
        13
      ],
      [
        59,
        91,
        63,
        95,
        15
      ]
    ],
    "entry": [
      40,
      7
    ],
    "porch": [
      36,
      3,
      44,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 33,
        "to": 47,
        "door": 40,
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
        47,
        7,
        "south"
      ],
      [
        4,
        32,
        "west"
      ],
      [
        78,
        48,
        "east"
      ],
      [
        5,
        76,
        "west"
      ],
      [
        77,
        90,
        "east"
      ]
    ],
    "fixtures": [
      [
        40,
        16
      ],
      [
        20,
        36
      ],
      [
        61,
        52
      ],
      [
        20,
        80
      ],
      [
        61,
        94
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "river-span-crossing-forum",
        "kind": "formal-chamber",
        "rect": [
          34,
          10,
          46,
          20
        ]
      },
      {
        "id": "river-span-crossing-west-early",
        "kind": "guest-area",
        "rect": [
          15,
          31,
          25,
          40
        ]
      },
      {
        "id": "river-span-crossing-east-early",
        "kind": "consular-office",
        "rect": [
          56,
          47,
          66,
          56
        ]
      },
      {
        "id": "river-span-crossing-west-rear",
        "kind": "treaty-chamber",
        "rect": [
          15,
          75,
          25,
          84
        ]
      },
      {
        "id": "river-span-crossing-east-rear",
        "kind": "translation-office",
        "rect": [
          56,
          89,
          66,
          98
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          33,
          10,
          47,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          15,
          31,
          25,
          41
        ],
        "profile": "saw",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          56,
          47,
          66,
          57
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          15,
          75,
          25,
          85
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          56,
          89,
          66,
          99
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "river-span-crossing",
      4,
      83,
      22,
      105,
      58
    ],
    "profile": "river-span-crossing",
    "sourceAuthoredName": "Larkspur Embassy of the Five Bridges"
  },
  {
    "id": "r4:embassy:snow:medium:01",
    "type": "embassy",
    "biome": "snow",
    "size": "medium",
    "variant": 1,
    "bounds": [
      108,
      22,
      127
    ],
    "wings": [
      [
        44,
        7,
        64,
        120
      ],
      [
        5,
        31,
        50,
        48
      ],
      [
        58,
        52,
        102,
        70
      ],
      [
        6,
        86,
        49,
        105
      ],
      [
        59,
        106,
        101,
        123
      ],
      [
        10,
        61,
        47,
        92
      ],
      [
        61,
        89,
        94,
        112
      ]
    ],
    "notches": [
      [
        51,
        69,
        56,
        76
      ],
      [
        45,
        116,
        47,
        120
      ]
    ],
    "octagons": [
      [
        12,
        45,
        5,
        8
      ],
      [
        94,
        120,
        6,
        9
      ],
      []
    ],
    "skyline": [
      [
        51,
        11,
        57,
        17,
        16
      ],
      [
        25,
        36,
        29,
        40,
        12
      ],
      [
        78,
        57,
        82,
        61,
        15
      ],
      [
        25,
        91,
        29,
        95,
        14
      ],
      [
        78,
        111,
        82,
        115,
        13
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
        "fixed": 24,
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
        35,
        "west"
      ],
      [
        102,
        56,
        "east"
      ],
      [
        6,
        90,
        "west"
      ],
      [
        101,
        110,
        "east"
      ]
    ],
    "fixtures": [
      [
        54,
        16
      ],
      [
        27,
        39
      ],
      [
        80,
        60
      ],
      [
        27,
        94
      ],
      [
        80,
        114
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "windbreak-cascade-forum",
        "kind": "formal-chamber",
        "rect": [
          48,
          10,
          60,
          20
        ]
      },
      {
        "id": "windbreak-cascade-west-early",
        "kind": "guest-area",
        "rect": [
          22,
          34,
          32,
          43
        ]
      },
      {
        "id": "windbreak-cascade-east-early",
        "kind": "consular-office",
        "rect": [
          75,
          55,
          85,
          64
        ]
      },
      {
        "id": "windbreak-cascade-west-rear",
        "kind": "treaty-chamber",
        "rect": [
          22,
          89,
          32,
          98
        ]
      },
      {
        "id": "windbreak-cascade-east-rear",
        "kind": "translation-office",
        "rect": [
          75,
          109,
          85,
          118
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          47,
          10,
          61,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          22,
          34,
          32,
          44
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          75,
          55,
          85,
          65
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          22,
          89,
          32,
          99
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          75,
          109,
          85,
          119
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "windbreak-cascade",
      5,
      108,
      22,
      127,
      75
    ],
    "profile": "windbreak-cascade",
    "sourceAuthoredName": "Whitehorn Consular Ramp"
  },
  {
    "id": "r4:embassy:mountain:large:01",
    "type": "embassy",
    "biome": "mountain",
    "size": "large",
    "variant": 1,
    "bounds": [
      134,
      22,
      144
    ],
    "wings": [
      [
        55,
        7,
        75,
        137
      ],
      [
        6,
        38,
        61,
        55
      ],
      [
        69,
        62,
        127,
        80
      ],
      [
        7,
        102,
        60,
        121
      ],
      [
        70,
        123,
        126,
        140
      ],
      [
        39,
        48,
        50,
        100
      ],
      [
        81,
        71,
        91,
        120
      ]
    ],
    "notches": [
      [
        62,
        82,
        67,
        89
      ],
      [
        56,
        133,
        58,
        137
      ]
    ],
    "octagons": [
      [
        13,
        52,
        5,
        8
      ],
      [
        119,
        137,
        6,
        9
      ],
      []
    ],
    "skyline": [
      [
        62,
        11,
        68,
        17,
        17
      ],
      [
        31,
        43,
        35,
        47,
        13
      ],
      [
        96,
        67,
        100,
        71,
        13
      ],
      [
        31,
        107,
        35,
        111,
        15
      ],
      [
        96,
        128,
        100,
        132,
        14
      ]
    ],
    "entry": [
      65,
      7
    ],
    "porch": [
      61,
      3,
      69,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 58,
        "to": 72,
        "door": 65,
        "facing": "north"
      }
    ],
    "windows": [
      [
        58,
        7,
        "south"
      ],
      [
        72,
        7,
        "south"
      ],
      [
        6,
        42,
        "west"
      ],
      [
        127,
        66,
        "east"
      ],
      [
        7,
        106,
        "west"
      ],
      [
        126,
        127,
        "east"
      ]
    ],
    "fixtures": [
      [
        65,
        16
      ],
      [
        33,
        46
      ],
      [
        98,
        70
      ],
      [
        33,
        110
      ],
      [
        98,
        131
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "tiered-diplomatic-skywalk-forum",
        "kind": "formal-chamber",
        "rect": [
          59,
          10,
          71,
          20
        ]
      },
      {
        "id": "tiered-diplomatic-skywalk-west-early",
        "kind": "guest-area",
        "rect": [
          28,
          41,
          38,
          50
        ]
      },
      {
        "id": "tiered-diplomatic-skywalk-east-early",
        "kind": "consular-office",
        "rect": [
          93,
          65,
          103,
          74
        ]
      },
      {
        "id": "tiered-diplomatic-skywalk-west-rear",
        "kind": "treaty-chamber",
        "rect": [
          28,
          105,
          38,
          114
        ]
      },
      {
        "id": "tiered-diplomatic-skywalk-east-rear",
        "kind": "translation-office",
        "rect": [
          93,
          126,
          103,
          135
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          58,
          10,
          72,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          28,
          41,
          38,
          51
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          93,
          65,
          103,
          75
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          28,
          105,
          38,
          115
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          93,
          126,
          103,
          136
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "tiered-diplomatic-skywalk",
      6,
      134,
      22,
      144,
      85
    ],
    "profile": "tiered-diplomatic-skywalk",
    "sourceAuthoredName": "Highpass Treaty Terrace"
  },
  {
    "id": "r4:grand-archive:desert:large:03",
    "type": "grand-archive",
    "biome": "desert",
    "size": "large",
    "variant": 3,
    "bounds": [
      132,
      22,
      149
    ],
    "wings": [
      [
        56,
        7,
        76,
        142
      ],
      [
        4,
        35,
        62,
        52
      ],
      [
        70,
        65,
        127,
        83
      ],
      [
        5,
        101,
        61,
        120
      ],
      [
        71,
        129,
        126,
        146
      ],
      [
        36,
        75,
        49,
        110
      ],
      [
        84,
        45,
        95,
        127
      ]
    ],
    "notches": [
      [
        63,
        83,
        68,
        90
      ],
      [
        57,
        139,
        59,
        143
      ]
    ],
    "octagons": [
      [
        11,
        49,
        5,
        8
      ],
      [
        119,
        143,
        6,
        9
      ],
      [
        [
          67,
          88,
          5,
          7
        ]
      ]
    ],
    "skyline": [
      [
        63,
        11,
        69,
        17,
        15
      ],
      [
        31,
        40,
        35,
        44,
        14
      ],
      [
        96,
        70,
        100,
        74,
        14
      ],
      [
        31,
        106,
        35,
        110,
        12
      ],
      [
        96,
        134,
        100,
        138,
        15
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
        "fixed": 24,
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
        4,
        39,
        "west"
      ],
      [
        127,
        69,
        "east"
      ],
      [
        5,
        105,
        "west"
      ],
      [
        126,
        133,
        "east"
      ]
    ],
    "fixtures": [
      [
        66,
        16
      ],
      [
        33,
        43
      ],
      [
        98,
        73
      ],
      [
        33,
        109
      ],
      [
        98,
        137
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "aqueduct-alcove-horseshoe-forum",
        "kind": "consultation-room",
        "rect": [
          60,
          10,
          72,
          20
        ]
      },
      {
        "id": "aqueduct-alcove-horseshoe-west-early",
        "kind": "scriptorium",
        "rect": [
          28,
          38,
          38,
          47
        ]
      },
      {
        "id": "aqueduct-alcove-horseshoe-east-early",
        "kind": "catalog-room",
        "rect": [
          93,
          68,
          103,
          77
        ]
      },
      {
        "id": "aqueduct-alcove-horseshoe-west-rear",
        "kind": "records-vault",
        "rect": [
          28,
          104,
          38,
          113
        ]
      },
      {
        "id": "aqueduct-alcove-horseshoe-east-rear",
        "kind": "manuscript-gallery",
        "rect": [
          93,
          132,
          103,
          141
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          59,
          10,
          73,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          28,
          38,
          38,
          48
        ],
        "profile": "hip",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          93,
          68,
          103,
          78
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          28,
          104,
          38,
          114
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          93,
          132,
          103,
          142
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "aqueduct-alcove-horseshoe",
      7,
      132,
      22,
      149,
      94
    ],
    "profile": "aqueduct-alcove-horseshoe",
    "sourceAuthoredName": "Mirage Bibliotheca and Aqueduct"
  },
  {
    "id": "r4:grand-archive:enchanted-forest:small:02",
    "type": "grand-archive",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 2,
    "bounds": [
      89,
      22,
      118
    ],
    "wings": [
      [
        33,
        7,
        53,
        111
      ],
      [
        5,
        30,
        39,
        47
      ],
      [
        47,
        49,
        83,
        67
      ],
      [
        6,
        81,
        38,
        100
      ],
      [
        48,
        98,
        82,
        115
      ],
      [
        12,
        46,
        37,
        86
      ],
      [
        49,
        65,
        74,
        103
      ]
    ],
    "notches": [
      [
        40,
        65,
        45,
        72
      ],
      [
        34,
        108,
        36,
        112
      ]
    ],
    "octagons": [
      [
        12,
        44,
        5,
        8
      ],
      [
        75,
        112,
        6,
        9
      ],
      []
    ],
    "skyline": [
      [
        40,
        11,
        46,
        17,
        16
      ],
      [
        20,
        35,
        24,
        39,
        15
      ],
      [
        63,
        54,
        67,
        58,
        15
      ],
      [
        20,
        86,
        24,
        90,
        13
      ],
      [
        63,
        103,
        67,
        107,
        13
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
        "fixed": 24,
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
        5,
        34,
        "west"
      ],
      [
        83,
        53,
        "east"
      ],
      [
        6,
        85,
        "west"
      ],
      [
        82,
        102,
        "east"
      ]
    ],
    "fixtures": [
      [
        43,
        16
      ],
      [
        22,
        38
      ],
      [
        65,
        57
      ],
      [
        22,
        89
      ],
      [
        65,
        106
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "tree-ring-scriptoria-forum",
        "kind": "consultation-room",
        "rect": [
          37,
          10,
          49,
          20
        ]
      },
      {
        "id": "tree-ring-scriptoria-west-early",
        "kind": "scriptorium",
        "rect": [
          17,
          33,
          27,
          42
        ]
      },
      {
        "id": "tree-ring-scriptoria-east-early",
        "kind": "catalog-room",
        "rect": [
          60,
          52,
          70,
          61
        ]
      },
      {
        "id": "tree-ring-scriptoria-west-rear",
        "kind": "records-vault",
        "rect": [
          17,
          84,
          27,
          93
        ]
      },
      {
        "id": "tree-ring-scriptoria-east-rear",
        "kind": "manuscript-gallery",
        "rect": [
          60,
          101,
          70,
          110
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          36,
          10,
          50,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          17,
          33,
          27,
          43
        ],
        "profile": "saw",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          60,
          52,
          70,
          62
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          17,
          84,
          27,
          94
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          60,
          101,
          70,
          111
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "tree-ring-scriptoria",
      8,
      89,
      22,
      118,
      68
    ],
    "profile": "tree-ring-scriptoria",
    "sourceAuthoredName": "Greenfall Spiral Scriptorium"
  },
  {
    "id": "r4:grand-archive:temperate:large:01",
    "type": "grand-archive",
    "biome": "temperate",
    "size": "large",
    "variant": 1,
    "bounds": [
      125,
      22,
      134
    ],
    "wings": [
      [
        51,
        7,
        71,
        127
      ],
      [
        6,
        33,
        57,
        50
      ],
      [
        65,
        54,
        118,
        72
      ],
      [
        7,
        94,
        56,
        113
      ],
      [
        66,
        113,
        117,
        130
      ],
      [
        11,
        63,
        54,
        100
      ],
      [
        68,
        97,
        110,
        119
      ]
    ],
    "notches": [
      [
        58,
        74,
        63,
        81
      ],
      [
        52,
        123,
        54,
        127
      ]
    ],
    "octagons": [
      [
        13,
        47,
        5,
        8
      ],
      [
        110,
        127,
        6,
        9
      ],
      []
    ],
    "skyline": [
      [
        58,
        11,
        64,
        17,
        17
      ],
      [
        29,
        38,
        33,
        42,
        12
      ],
      [
        89,
        59,
        93,
        63,
        13
      ],
      [
        29,
        99,
        33,
        103,
        14
      ],
      [
        89,
        118,
        93,
        122,
        14
      ]
    ],
    "entry": [
      61,
      7
    ],
    "porch": [
      57,
      3,
      65,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 54,
        "to": 68,
        "door": 61,
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
        68,
        7,
        "south"
      ],
      [
        6,
        37,
        "west"
      ],
      [
        118,
        58,
        "east"
      ],
      [
        7,
        98,
        "west"
      ],
      [
        117,
        117,
        "east"
      ]
    ],
    "fixtures": [
      [
        61,
        16
      ],
      [
        31,
        41
      ],
      [
        91,
        62
      ],
      [
        31,
        102
      ],
      [
        91,
        121
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "ink-river-wing-forum",
        "kind": "consultation-room",
        "rect": [
          55,
          10,
          67,
          20
        ]
      },
      {
        "id": "ink-river-wing-west-early",
        "kind": "scriptorium",
        "rect": [
          26,
          36,
          36,
          45
        ]
      },
      {
        "id": "ink-river-wing-east-early",
        "kind": "catalog-room",
        "rect": [
          86,
          57,
          96,
          66
        ]
      },
      {
        "id": "ink-river-wing-west-rear",
        "kind": "records-vault",
        "rect": [
          26,
          97,
          36,
          106
        ]
      },
      {
        "id": "ink-river-wing-east-rear",
        "kind": "manuscript-gallery",
        "rect": [
          86,
          116,
          96,
          125
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
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          26,
          36,
          36,
          46
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          86,
          57,
          96,
          67
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          26,
          97,
          36,
          107
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          86,
          116,
          96,
          126
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "ink-river-wing",
      9,
      125,
      22,
      134,
      80
    ],
    "profile": "ink-river-wing",
    "sourceAuthoredName": "Dunvale Staggered Granary of Knowledge"
  },
  {
    "id": "r4:observatory:snow:medium:01",
    "type": "observatory",
    "biome": "snow",
    "size": "medium",
    "variant": 1,
    "bounds": [
      105,
      22,
      133
    ],
    "wings": [
      [
        43,
        7,
        63,
        126
      ],
      [
        4,
        30,
        49,
        47
      ],
      [
        57,
        55,
        100,
        73
      ],
      [
        5,
        92,
        48,
        111
      ],
      [
        58,
        112,
        99,
        129
      ],
      [
        27,
        40,
        38,
        90
      ],
      [
        69,
        64,
        79,
        109
      ]
    ],
    "notches": [
      [
        50,
        73,
        55,
        80
      ],
      [
        44,
        122,
        46,
        126
      ]
    ],
    "octagons": [
      [
        11,
        44,
        5,
        8
      ],
      [
        92,
        126,
        6,
        9
      ],
      [
        [
          54,
          78,
          5,
          7
        ]
      ]
    ],
    "skyline": [
      [
        50,
        11,
        56,
        17,
        15
      ],
      [
        24,
        35,
        28,
        39,
        13
      ],
      [
        76,
        60,
        80,
        64,
        14
      ],
      [
        24,
        97,
        28,
        101,
        15
      ],
      [
        76,
        117,
        80,
        121,
        15
      ]
    ],
    "entry": [
      53,
      7
    ],
    "porch": [
      49,
      3,
      57,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 46,
        "to": 60,
        "door": 53,
        "facing": "north"
      }
    ],
    "windows": [
      [
        46,
        7,
        "south"
      ],
      [
        60,
        7,
        "south"
      ],
      [
        4,
        34,
        "west"
      ],
      [
        100,
        59,
        "east"
      ],
      [
        5,
        96,
        "west"
      ],
      [
        99,
        116,
        "east"
      ]
    ],
    "fixtures": [
      [
        53,
        16
      ],
      [
        26,
        38
      ],
      [
        78,
        63
      ],
      [
        26,
        100
      ],
      [
        78,
        120
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "polar-meridian-pergola-forum",
        "kind": "instrument-room",
        "rect": [
          47,
          10,
          59,
          20
        ]
      },
      {
        "id": "polar-meridian-pergola-west-early",
        "kind": "star-cartography",
        "rect": [
          21,
          33,
          31,
          42
        ]
      },
      {
        "id": "polar-meridian-pergola-east-early",
        "kind": "lens-workshop",
        "rect": [
          73,
          58,
          83,
          67
        ]
      },
      {
        "id": "polar-meridian-pergola-west-rear",
        "kind": "observation-deck",
        "rect": [
          21,
          95,
          31,
          104
        ]
      },
      {
        "id": "polar-meridian-pergola-east-rear",
        "kind": "public-lecture",
        "rect": [
          73,
          115,
          83,
          124
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          46,
          10,
          60,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          21,
          33,
          31,
          43
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          73,
          58,
          83,
          68
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          21,
          95,
          31,
          105
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          73,
          115,
          83,
          125
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "polar-meridian-pergola",
      10,
      105,
      22,
      133,
      82
    ],
    "profile": "polar-meridian-pergola",
    "sourceAuthoredName": "Aurora Lantern Meridian"
  },
  {
    "id": "r4:observatory:enchanted-forest:medium:02",
    "type": "observatory",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 2,
    "bounds": [
      113,
      22,
      130
    ],
    "wings": [
      [
        46,
        7,
        66,
        123
      ],
      [
        5,
        31,
        52,
        48
      ],
      [
        60,
        56,
        107,
        74
      ],
      [
        6,
        85,
        51,
        104
      ],
      [
        61,
        106,
        106,
        123
      ],
      [
        26,
        66,
        39,
        94
      ],
      [
        74,
        41,
        85,
        104
      ]
    ],
    "notches": [
      [
        53,
        70,
        58,
        77
      ],
      [
        47,
        116,
        49,
        120
      ]
    ],
    "octagons": [
      [
        12,
        45,
        5,
        8
      ],
      [
        99,
        120,
        6,
        9
      ],
      []
    ],
    "skyline": [
      [
        53,
        11,
        59,
        17,
        16
      ],
      [
        26,
        36,
        30,
        40,
        14
      ],
      [
        81,
        61,
        85,
        65,
        15
      ],
      [
        26,
        90,
        30,
        94,
        12
      ],
      [
        81,
        111,
        85,
        115,
        13
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
        "fixed": 24,
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
        5,
        35,
        "west"
      ],
      [
        107,
        60,
        "east"
      ],
      [
        6,
        89,
        "west"
      ],
      [
        106,
        110,
        "east"
      ]
    ],
    "fixtures": [
      [
        56,
        16
      ],
      [
        28,
        39
      ],
      [
        83,
        64
      ],
      [
        28,
        93
      ],
      [
        83,
        114
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "lunar-crescent-diagonal-forum",
        "kind": "instrument-room",
        "rect": [
          50,
          10,
          62,
          20
        ]
      },
      {
        "id": "lunar-crescent-diagonal-west-early",
        "kind": "star-cartography",
        "rect": [
          23,
          34,
          33,
          43
        ]
      },
      {
        "id": "lunar-crescent-diagonal-east-early",
        "kind": "lens-workshop",
        "rect": [
          78,
          59,
          88,
          68
        ]
      },
      {
        "id": "lunar-crescent-diagonal-west-rear",
        "kind": "observation-deck",
        "rect": [
          23,
          88,
          33,
          97
        ]
      },
      {
        "id": "lunar-crescent-diagonal-east-rear",
        "kind": "public-lecture",
        "rect": [
          78,
          109,
          88,
          118
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          49,
          10,
          63,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          23,
          34,
          33,
          44
        ],
        "profile": "hip",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          78,
          59,
          88,
          69
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          23,
          88,
          33,
          98
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          78,
          109,
          88,
          119
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "lunar-crescent-diagonal",
      11,
      113,
      22,
      130,
      75
    ],
    "profile": "lunar-crescent-diagonal",
    "sourceAuthoredName": "Moonshade Crystalline Orrery"
  },
  {
    "id": "r4:observatory:mountain:small:03",
    "type": "observatory",
    "biome": "mountain",
    "size": "small",
    "variant": 3,
    "bounds": [
      83,
      22,
      115
    ],
    "wings": [
      [
        30,
        7,
        50,
        108
      ],
      [
        6,
        29,
        36,
        46
      ],
      [
        44,
        48,
        76,
        66
      ],
      [
        7,
        77,
        35,
        96
      ],
      [
        45,
        95,
        75,
        112
      ],
      [
        13,
        45,
        34,
        82
      ],
      [
        46,
        64,
        67,
        100
      ]
    ],
    "notches": [
      [
        37,
        62,
        42,
        69
      ],
      [
        31,
        105,
        33,
        109
      ]
    ],
    "octagons": [
      [
        13,
        43,
        5,
        8
      ],
      [
        68,
        109,
        6,
        9
      ],
      []
    ],
    "skyline": [
      [
        37,
        11,
        43,
        17,
        17
      ],
      [
        19,
        34,
        23,
        38,
        15
      ],
      [
        58,
        53,
        62,
        57,
        13
      ],
      [
        19,
        82,
        23,
        86,
        13
      ],
      [
        58,
        100,
        62,
        104,
        14
      ]
    ],
    "entry": [
      40,
      7
    ],
    "porch": [
      36,
      3,
      44,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 33,
        "to": 47,
        "door": 40,
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
        47,
        7,
        "south"
      ],
      [
        6,
        33,
        "west"
      ],
      [
        76,
        52,
        "east"
      ],
      [
        7,
        81,
        "west"
      ],
      [
        75,
        99,
        "east"
      ]
    ],
    "fixtures": [
      [
        40,
        16
      ],
      [
        21,
        37
      ],
      [
        60,
        56
      ],
      [
        21,
        85
      ],
      [
        60,
        103
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "split-ridge-horizon-forum",
        "kind": "instrument-room",
        "rect": [
          34,
          10,
          46,
          20
        ]
      },
      {
        "id": "split-ridge-horizon-west-early",
        "kind": "star-cartography",
        "rect": [
          16,
          32,
          26,
          41
        ]
      },
      {
        "id": "split-ridge-horizon-east-early",
        "kind": "lens-workshop",
        "rect": [
          55,
          51,
          65,
          60
        ]
      },
      {
        "id": "split-ridge-horizon-west-rear",
        "kind": "observation-deck",
        "rect": [
          16,
          80,
          26,
          89
        ]
      },
      {
        "id": "split-ridge-horizon-east-rear",
        "kind": "public-lecture",
        "rect": [
          55,
          98,
          65,
          107
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          33,
          10,
          47,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          16,
          32,
          26,
          42
        ],
        "profile": "saw",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          55,
          51,
          65,
          61
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          16,
          80,
          26,
          90
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          55,
          98,
          65,
          108
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      }
    ],
    "signature": [
      "split-ridge-horizon",
      12,
      83,
      22,
      115,
      66
    ],
    "profile": "split-ridge-horizon",
    "sourceAuthoredName": "Starfall Split-Ridge Tower"
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
export function buildA2Wave6StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave6StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE6_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
