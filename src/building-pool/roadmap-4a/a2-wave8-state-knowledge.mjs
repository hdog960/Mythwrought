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
    "id": "r4:castle-palace:snow:large:03",
    "type": "castle-palace",
    "biome": "snow",
    "size": "large",
    "variant": 3,
    "bounds": [
      147,
      22,
      167
    ],
    "wings": [
      [
        68,
        7,
        86,
        158
      ],
      [
        4,
        29,
        70,
        45
      ],
      [
        84,
        47,
        142,
        64
      ],
      [
        5,
        85,
        70,
        102
      ],
      [
        84,
        119,
        141,
        135
      ],
      [
        7,
        40,
        71,
        92
      ],
      [
        83,
        56,
        133,
        134
      ],
      [
        62,
        150,
        88,
        155
      ]
    ],
    "notches": [
      [
        74,
        66,
        79,
        71
      ],
      [
        62,
        128,
        65,
        131
      ]
    ],
    "octagons": [
      [
        11,
        41,
        5,
        8
      ],
      [
        135,
        129,
        6,
        9
      ],
      [
        129,
        54,
        4,
        7
      ]
    ],
    "skyline": [
      [
        74,
        11,
        80,
        17,
        13
      ],
      [
        35,
        35,
        39,
        39,
        12
      ],
      [
        111,
        53,
        115,
        57,
        14
      ],
      [
        35,
        91,
        39,
        95,
        16
      ],
      [
        110,
        125,
        114,
        129,
        13
      ],
      [
        74,
        151,
        79,
        155,
        13
      ]
    ],
    "entry": [
      77,
      7
    ],
    "porch": [
      73,
      3,
      81,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 70,
        "to": 84,
        "door": 77,
        "facing": "north"
      }
    ],
    "windows": [
      [
        70,
        7,
        "south"
      ],
      [
        84,
        7,
        "south"
      ],
      [
        4,
        37,
        "west"
      ],
      [
        142,
        55,
        "east"
      ],
      [
        5,
        93,
        "west"
      ],
      [
        141,
        127,
        "east"
      ]
    ],
    "fixtures": [
      [
        77,
        16
      ],
      [
        37,
        38
      ],
      [
        113,
        56
      ],
      [
        37,
        94
      ],
      [
        112,
        128
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "glacial-crown-delta-forum",
        "kind": "entrance-hall",
        "rect": [
          71,
          10,
          83,
          21
        ]
      },
      {
        "id": "glacial-crown-delta-wing1",
        "kind": "tower-or-wing",
        "rect": [
          31,
          32,
          43,
          42
        ]
      },
      {
        "id": "glacial-crown-delta-wing2",
        "kind": "council",
        "rect": [
          107,
          50,
          119,
          60
        ]
      },
      {
        "id": "glacial-crown-delta-wing3",
        "kind": "grand-chamber",
        "rect": [
          31,
          88,
          43,
          98
        ]
      },
      {
        "id": "glacial-crown-delta-wing4",
        "kind": "tower-or-wing",
        "rect": [
          106,
          122,
          118,
          132
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          71,
          10,
          83,
          20
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          31,
          32,
          43,
          42
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          107,
          50,
          119,
          60
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          31,
          88,
          43,
          98
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          106,
          122,
          118,
          132
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "glacial-crown-delta",
      147,
      167,
      29,
      47,
      85,
      119,
      100
    ],
    "profile": "glacial-crown-delta",
    "sourceAuthoredName": "Frostbridge Throne Citadel"
  },
  {
    "id": "r4:castle-palace:enchanted-forest:medium:02",
    "type": "castle-palace",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 2,
    "bounds": [
      109,
      22,
      137
    ],
    "wings": [
      [
        38,
        7,
        58,
        128
      ],
      [
        5,
        23,
        40,
        42
      ],
      [
        56,
        43,
        103,
        64
      ],
      [
        6,
        71,
        40,
        93
      ],
      [
        56,
        99,
        102,
        118
      ],
      [
        9,
        38,
        42,
        84
      ],
      [
        55,
        55,
        100,
        105
      ],
      [
        36,
        119,
        65,
        125
      ]
    ],
    "notches": [
      [
        45,
        57,
        50,
        62
      ],
      [
        60,
        82,
        63,
        85
      ]
    ],
    "octagons": [
      [
        12,
        35,
        6,
        9
      ],
      [
        96,
        109,
        7,
        10
      ]
    ],
    "skyline": [
      [
        45,
        11,
        51,
        17,
        14
      ],
      [
        20,
        30,
        24,
        34,
        13
      ],
      [
        77,
        51,
        81,
        55,
        15
      ],
      [
        21,
        80,
        25,
        84,
        12
      ],
      [
        77,
        106,
        81,
        110,
        14
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
        5,
        32,
        "west"
      ],
      [
        103,
        53,
        "east"
      ],
      [
        6,
        82,
        "west"
      ],
      [
        103,
        108,
        "east"
      ]
    ],
    "fixtures": [
      [
        48,
        16
      ],
      [
        22,
        33
      ],
      [
        79,
        54
      ],
      [
        23,
        83
      ],
      [
        79,
        109
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "violet-branch-fan-forum",
        "kind": "entrance-hall",
        "rect": [
          42,
          10,
          54,
          21
        ]
      },
      {
        "id": "violet-branch-fan-wing1",
        "kind": "tower-or-wing",
        "rect": [
          16,
          27,
          28,
          37
        ]
      },
      {
        "id": "violet-branch-fan-wing2",
        "kind": "council",
        "rect": [
          73,
          48,
          85,
          58
        ]
      },
      {
        "id": "violet-branch-fan-wing3",
        "kind": "grand-chamber",
        "rect": [
          17,
          77,
          29,
          87
        ]
      },
      {
        "id": "violet-branch-fan-wing4",
        "kind": "tower-or-wing",
        "rect": [
          73,
          103,
          85,
          113
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          42,
          10,
          54,
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
          27,
          28,
          37
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          73,
          48,
          85,
          58
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          17,
          77,
          29,
          87
        ],
        "profile": "gable",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          73,
          103,
          85,
          113
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "violet-branch-fan",
      109,
      137,
      23,
      43,
      71,
      99,
      101
    ],
    "profile": "violet-branch-fan",
    "sourceAuthoredName": "Elderglow Council Arbor"
  },
  {
    "id": "r4:castle-palace:mountain:small:02",
    "type": "castle-palace",
    "biome": "mountain",
    "size": "small",
    "variant": 2,
    "bounds": [
      91,
      22,
      123
    ],
    "wings": [
      [
        37,
        7,
        59,
        114
      ],
      [
        6,
        21,
        39,
        43
      ],
      [
        57,
        32,
        84,
        57
      ],
      [
        7,
        62,
        39,
        89
      ],
      [
        57,
        91,
        83,
        113
      ],
      [
        9,
        32,
        40,
        69
      ],
      [
        55,
        49,
        79,
        100
      ],
      [
        31,
        106,
        61,
        111
      ]
    ],
    "notches": [
      [
        45,
        47,
        50,
        52
      ],
      [
        33,
        100,
        36,
        103
      ]
    ],
    "octagons": [
      [
        13,
        33,
        7,
        10
      ],
      [
        77,
        101,
        8,
        11
      ]
    ],
    "skyline": [
      [
        45,
        11,
        51,
        17,
        15
      ],
      [
        20,
        30,
        24,
        34,
        14
      ],
      [
        68,
        42,
        72,
        46,
        16
      ],
      [
        21,
        73,
        25,
        77,
        13
      ],
      [
        68,
        100,
        72,
        104,
        15
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
        6,
        32,
        "west"
      ],
      [
        84,
        44,
        "east"
      ],
      [
        7,
        75,
        "west"
      ],
      [
        85,
        102,
        "east"
      ]
    ],
    "fixtures": [
      [
        48,
        16
      ],
      [
        22,
        33
      ],
      [
        70,
        45
      ],
      [
        23,
        76
      ],
      [
        70,
        103
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "ridge-crest-steps-forum",
        "kind": "entrance-hall",
        "rect": [
          42,
          10,
          54,
          21
        ]
      },
      {
        "id": "ridge-crest-steps-wing1",
        "kind": "tower-or-wing",
        "rect": [
          16,
          27,
          28,
          37
        ]
      },
      {
        "id": "ridge-crest-steps-wing2",
        "kind": "council",
        "rect": [
          64,
          39,
          76,
          49
        ]
      },
      {
        "id": "ridge-crest-steps-wing3",
        "kind": "grand-chamber",
        "rect": [
          17,
          70,
          29,
          80
        ]
      },
      {
        "id": "ridge-crest-steps-wing4",
        "kind": "tower-or-wing",
        "rect": [
          64,
          97,
          76,
          107
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          42,
          10,
          54,
          20
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          16,
          27,
          28,
          37
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          64,
          39,
          76,
          49
        ],
        "profile": "gable",
        "axis": "z",
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
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          64,
          97,
          76,
          107
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "ridge-crest-steps",
      91,
      123,
      21,
      32,
      62,
      91,
      102
    ],
    "profile": "ridge-crest-steps",
    "sourceAuthoredName": "Rookspire Summit Palace"
  },
  {
    "id": "r4:embassy:temperate:small:02",
    "type": "embassy",
    "biome": "temperate",
    "size": "small",
    "variant": 2,
    "bounds": [
      83,
      22,
      115
    ],
    "wings": [
      [
        26,
        7,
        50,
        106
      ],
      [
        4,
        23,
        28,
        48
      ],
      [
        48,
        39,
        78,
        56
      ],
      [
        5,
        61,
        28,
        78
      ],
      [
        48,
        85,
        77,
        110
      ],
      [
        7,
        31,
        29,
        71
      ],
      [
        47,
        51,
        75,
        91
      ],
      [
        27,
        97,
        57,
        103
      ]
    ],
    "notches": [
      [
        35,
        50,
        40,
        55
      ],
      [
        50,
        72,
        53,
        75
      ]
    ],
    "octagons": [
      [
        11,
        35,
        8,
        8
      ],
      [
        71,
        95,
        6,
        12
      ],
      [
        65,
        46,
        4,
        7
      ]
    ],
    "skyline": [
      [
        35,
        11,
        41,
        17,
        16
      ],
      [
        14,
        33,
        18,
        37,
        15
      ],
      [
        61,
        45,
        65,
        49,
        12
      ],
      [
        14,
        67,
        18,
        71,
        14
      ],
      [
        60,
        95,
        64,
        99,
        16
      ]
    ],
    "entry": [
      38,
      7
    ],
    "porch": [
      34,
      3,
      42,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 31,
        "to": 45,
        "door": 38,
        "facing": "north"
      }
    ],
    "windows": [
      [
        31,
        7,
        "south"
      ],
      [
        45,
        7,
        "south"
      ],
      [
        3,
        35,
        "west"
      ],
      [
        78,
        47,
        "east"
      ],
      [
        5,
        69,
        "west"
      ],
      [
        77,
        97,
        "east"
      ]
    ],
    "fixtures": [
      [
        38,
        16
      ],
      [
        16,
        36
      ],
      [
        63,
        48
      ],
      [
        16,
        70
      ],
      [
        62,
        98
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "river-cross-step-forum",
        "kind": "formal-chamber",
        "rect": [
          32,
          10,
          44,
          21
        ]
      },
      {
        "id": "river-cross-step-wing1",
        "kind": "guest-area",
        "rect": [
          10,
          30,
          22,
          40
        ]
      },
      {
        "id": "river-cross-step-wing2",
        "kind": "consular-office",
        "rect": [
          57,
          42,
          69,
          52
        ]
      },
      {
        "id": "river-cross-step-wing3",
        "kind": "treaty-archive",
        "rect": [
          10,
          64,
          22,
          74
        ]
      },
      {
        "id": "river-cross-step-wing4",
        "kind": "hospitality",
        "rect": [
          56,
          92,
          68,
          102
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          32,
          10,
          44,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          10,
          30,
          22,
          40
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          57,
          42,
          69,
          52
        ],
        "profile": "hip",
        "axis": "x",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          10,
          64,
          22,
          74
        ],
        "profile": "shed",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          56,
          92,
          68,
          102
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "river-cross-step",
      83,
      115,
      23,
      39,
      61,
      85,
      103
    ],
    "profile": "river-cross-step",
    "sourceAuthoredName": "Willowford Tidal Embassy"
  },
  {
    "id": "r4:embassy:desert:medium:02",
    "type": "embassy",
    "biome": "desert",
    "size": "medium",
    "variant": 2,
    "bounds": [
      115,
      22,
      131
    ],
    "wings": [
      [
        55,
        7,
        73,
        122
      ],
      [
        5,
        22,
        57,
        38
      ],
      [
        71,
        48,
        109,
        69
      ],
      [
        6,
        73,
        57,
        95
      ],
      [
        71,
        96,
        108,
        112
      ],
      [
        8,
        33,
        58,
        80
      ],
      [
        70,
        60,
        103,
        108
      ],
      [
        49,
        114,
        76,
        119
      ],
      [
        4,
        34,
        43,
        95
      ]
    ],
    "notches": [
      [
        61,
        60,
        66,
        65
      ],
      [
        49,
        105,
        52,
        108
      ],
      [
        47,
        104,
        50,
        107
      ]
    ],
    "octagons": [
      [
        12,
        34,
        5,
        9
      ],
      [
        102,
        106,
        7,
        9
      ]
    ],
    "skyline": [
      [
        61,
        11,
        67,
        17,
        17
      ],
      [
        29,
        28,
        33,
        32,
        16
      ],
      [
        88,
        56,
        92,
        60,
        13
      ],
      [
        29,
        82,
        33,
        86,
        15
      ],
      [
        87,
        102,
        91,
        106,
        12
      ],
      [
        61,
        115,
        66,
        119,
        13
      ]
    ],
    "entry": [
      64,
      7
    ],
    "porch": [
      60,
      3,
      68,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 57,
        "to": 71,
        "door": 64,
        "facing": "north"
      }
    ],
    "windows": [
      [
        57,
        7,
        "south"
      ],
      [
        71,
        7,
        "south"
      ],
      [
        5,
        30,
        "west"
      ],
      [
        109,
        58,
        "east"
      ],
      [
        4,
        84,
        "west"
      ],
      [
        109,
        104,
        "east"
      ]
    ],
    "fixtures": [
      [
        64,
        16
      ],
      [
        31,
        31
      ],
      [
        90,
        59
      ],
      [
        31,
        85
      ],
      [
        89,
        105
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "dune-arc-braces-forum",
        "kind": "formal-chamber",
        "rect": [
          58,
          10,
          70,
          21
        ]
      },
      {
        "id": "dune-arc-braces-wing1",
        "kind": "guest-area",
        "rect": [
          25,
          25,
          37,
          35
        ]
      },
      {
        "id": "dune-arc-braces-wing2",
        "kind": "consular-office",
        "rect": [
          84,
          53,
          96,
          63
        ]
      },
      {
        "id": "dune-arc-braces-wing3",
        "kind": "treaty-archive",
        "rect": [
          25,
          79,
          37,
          89
        ]
      },
      {
        "id": "dune-arc-braces-wing4",
        "kind": "hospitality",
        "rect": [
          83,
          99,
          95,
          109
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          58,
          10,
          70,
          20
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          25,
          25,
          37,
          35
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          84,
          53,
          96,
          63
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          25,
          79,
          37,
          89
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          83,
          99,
          95,
          109
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "dune-arc-braces",
      115,
      131,
      22,
      48,
      73,
      96,
      104
    ],
    "profile": "dune-arc-braces",
    "sourceAuthoredName": "Sunveil Caravan Accord"
  },
  {
    "id": "r4:embassy:snow:large:02",
    "type": "embassy",
    "biome": "snow",
    "size": "large",
    "variant": 2,
    "bounds": [
      135,
      22,
      159
    ],
    "wings": [
      [
        52,
        7,
        72,
        150
      ],
      [
        6,
        27,
        54,
        46
      ],
      [
        70,
        46,
        128,
        71
      ],
      [
        7,
        87,
        54,
        114
      ],
      [
        70,
        119,
        127,
        138
      ],
      [
        10,
        45,
        55,
        93
      ],
      [
        69,
        58,
        125,
        125
      ],
      [
        49,
        141,
        79,
        147
      ]
    ],
    "notches": [
      [
        59,
        66,
        64,
        71
      ],
      [
        74,
        98,
        77,
        101
      ]
    ],
    "octagons": [
      [
        13,
        39,
        6,
        10
      ],
      [
        121,
        129,
        8,
        10
      ]
    ],
    "skyline": [
      [
        59,
        11,
        65,
        17,
        13
      ],
      [
        28,
        34,
        32,
        38,
        12
      ],
      [
        97,
        56,
        101,
        60,
        14
      ],
      [
        28,
        98,
        32,
        102,
        16
      ],
      [
        96,
        126,
        100,
        130,
        13
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
        6,
        36,
        "west"
      ],
      [
        128,
        58,
        "east"
      ],
      [
        7,
        100,
        "west"
      ],
      [
        129,
        128,
        "east"
      ]
    ],
    "fixtures": [
      [
        62,
        16
      ],
      [
        30,
        37
      ],
      [
        99,
        59
      ],
      [
        30,
        101
      ],
      [
        98,
        129
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "winter-mooring-ramp-forum",
        "kind": "formal-chamber",
        "rect": [
          56,
          10,
          68,
          21
        ]
      },
      {
        "id": "winter-mooring-ramp-wing1",
        "kind": "guest-area",
        "rect": [
          24,
          31,
          36,
          41
        ]
      },
      {
        "id": "winter-mooring-ramp-wing2",
        "kind": "consular-office",
        "rect": [
          93,
          53,
          105,
          63
        ]
      },
      {
        "id": "winter-mooring-ramp-wing3",
        "kind": "treaty-archive",
        "rect": [
          24,
          95,
          36,
          105
        ]
      },
      {
        "id": "winter-mooring-ramp-wing4",
        "kind": "hospitality",
        "rect": [
          92,
          123,
          104,
          133
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          56,
          10,
          68,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          24,
          31,
          36,
          41
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          93,
          53,
          105,
          63
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          24,
          95,
          36,
          105
        ],
        "profile": "gable",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          92,
          123,
          104,
          133
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "winter-mooring-ramp",
      135,
      159,
      27,
      46,
      87,
      119,
      105
    ],
    "profile": "winter-mooring-ramp",
    "sourceAuthoredName": "Icewake Treaty Arch"
  },
  {
    "id": "r4:grand-archive:temperate:medium:02",
    "type": "grand-archive",
    "biome": "temperate",
    "size": "medium",
    "variant": 2,
    "bounds": [
      113,
      22,
      139
    ],
    "wings": [
      [
        42,
        7,
        64,
        130
      ],
      [
        4,
        26,
        44,
        48
      ],
      [
        62,
        38,
        108,
        55
      ],
      [
        5,
        81,
        44,
        98
      ],
      [
        62,
        104,
        107,
        126
      ],
      [
        7,
        37,
        45,
        88
      ],
      [
        61,
        51,
        104,
        117
      ],
      [
        36,
        122,
        64,
        127
      ],
      [
        5,
        88,
        36,
        128
      ],
      [
        11,
        120,
        60,
        131
      ]
    ],
    "notches": [
      [
        50,
        59,
        55,
        64
      ],
      [
        38,
        113,
        41,
        116
      ],
      [
        67,
        117,
        71,
        122
      ]
    ],
    "octagons": [
      [
        11,
        38,
        7,
        8
      ],
      [
        101,
        114,
        6,
        11
      ],
      [
        95,
        45,
        4,
        7
      ],
      [
        100,
        53,
        9,
        13
      ]
    ],
    "skyline": [
      [
        50,
        11,
        56,
        17,
        14
      ],
      [
        22,
        35,
        26,
        39,
        13
      ],
      [
        83,
        44,
        87,
        48,
        15
      ],
      [
        22,
        87,
        26,
        91,
        12
      ],
      [
        82,
        113,
        86,
        117,
        14
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
        "fixed": 26,
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
        37,
        "west"
      ],
      [
        108,
        46,
        "east"
      ],
      [
        5,
        89,
        "west"
      ],
      [
        107,
        115,
        "east"
      ]
    ],
    "fixtures": [
      [
        53,
        16
      ],
      [
        24,
        38
      ],
      [
        85,
        47
      ],
      [
        24,
        90
      ],
      [
        84,
        116
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "long-bridge-skew-forum",
        "kind": "consultation-room",
        "rect": [
          47,
          10,
          59,
          21
        ]
      },
      {
        "id": "long-bridge-skew-wing1",
        "kind": "scriptorium",
        "rect": [
          18,
          32,
          30,
          42
        ]
      },
      {
        "id": "long-bridge-skew-wing2",
        "kind": "cataloguing",
        "rect": [
          79,
          41,
          91,
          51
        ]
      },
      {
        "id": "long-bridge-skew-wing3",
        "kind": "records-vault",
        "rect": [
          18,
          84,
          30,
          94
        ]
      },
      {
        "id": "long-bridge-skew-wing4",
        "kind": "copying-gallery",
        "rect": [
          78,
          110,
          90,
          120
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          47,
          10,
          59,
          20
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          18,
          32,
          30,
          42
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          79,
          41,
          91,
          51
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          18,
          84,
          30,
          94
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          78,
          110,
          90,
          120
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "long-bridge-skew",
      113,
      139,
      26,
      38,
      81,
      104,
      106
    ],
    "profile": "long-bridge-skew",
    "sourceAuthoredName": "Alderbank Book Quays"
  },
  {
    "id": "r4:grand-archive:desert:small:02",
    "type": "grand-archive",
    "biome": "desert",
    "size": "small",
    "variant": 2,
    "bounds": [
      87,
      22,
      117
    ],
    "wings": [
      [
        36,
        7,
        60,
        108
      ],
      [
        5,
        19,
        38,
        44
      ],
      [
        58,
        35,
        81,
        56
      ],
      [
        6,
        64,
        38,
        86
      ],
      [
        58,
        87,
        80,
        112
      ],
      [
        8,
        29,
        39,
        71
      ],
      [
        57,
        43,
        77,
        100
      ],
      [
        36,
        99,
        67,
        105
      ]
    ],
    "notches": [
      [
        45,
        49,
        50,
        54
      ],
      [
        60,
        75,
        63,
        78
      ]
    ],
    "octagons": [
      [
        12,
        31,
        8,
        9
      ],
      [
        74,
        97,
        7,
        12
      ]
    ],
    "skyline": [
      [
        45,
        11,
        51,
        17,
        15
      ],
      [
        19,
        29,
        23,
        33,
        14
      ],
      [
        67,
        43,
        71,
        47,
        16
      ],
      [
        20,
        73,
        24,
        77,
        13
      ],
      [
        67,
        97,
        71,
        101,
        15
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
        4,
        31,
        "west"
      ],
      [
        81,
        45,
        "east"
      ],
      [
        6,
        75,
        "west"
      ],
      [
        81,
        99,
        "east"
      ]
    ],
    "fixtures": [
      [
        48,
        16
      ],
      [
        21,
        32
      ],
      [
        69,
        46
      ],
      [
        22,
        76
      ],
      [
        69,
        100
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "hourglass-scroll-court-forum",
        "kind": "consultation-room",
        "rect": [
          42,
          10,
          54,
          21
        ]
      },
      {
        "id": "hourglass-scroll-court-wing1",
        "kind": "scriptorium",
        "rect": [
          15,
          26,
          27,
          36
        ]
      },
      {
        "id": "hourglass-scroll-court-wing2",
        "kind": "cataloguing",
        "rect": [
          63,
          40,
          75,
          50
        ]
      },
      {
        "id": "hourglass-scroll-court-wing3",
        "kind": "records-vault",
        "rect": [
          16,
          70,
          28,
          80
        ]
      },
      {
        "id": "hourglass-scroll-court-wing4",
        "kind": "copying-gallery",
        "rect": [
          63,
          94,
          75,
          104
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          42,
          10,
          54,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          15,
          26,
          27,
          36
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          63,
          40,
          75,
          50
        ],
        "profile": "hip",
        "axis": "x",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          16,
          70,
          28,
          80
        ],
        "profile": "shed",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          63,
          94,
          75,
          104
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "hourglass-scroll-court",
      87,
      117,
      19,
      35,
      64,
      87,
      107
    ],
    "profile": "hourglass-scroll-court",
    "sourceAuthoredName": "Zafran Sandglass Scriptorium"
  },
  {
    "id": "r4:grand-archive:enchanted-forest:large:01",
    "type": "grand-archive",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 1,
    "bounds": [
      143,
      22,
      161
    ],
    "wings": [
      [
        66,
        7,
        84,
        152
      ],
      [
        6,
        26,
        68,
        42
      ],
      [
        82,
        51,
        136,
        76
      ],
      [
        7,
        88,
        68,
        115
      ],
      [
        82,
        120,
        135,
        136
      ],
      [
        9,
        37,
        69,
        95
      ],
      [
        80,
        69,
        132,
        128
      ],
      [
        60,
        144,
        88,
        149
      ]
    ],
    "notches": [
      [
        72,
        69,
        77,
        74
      ],
      [
        60,
        129,
        63,
        132
      ]
    ],
    "octagons": [
      [
        13,
        38,
        5,
        10
      ],
      [
        129,
        130,
        8,
        9
      ]
    ],
    "skyline": [
      [
        72,
        11,
        78,
        17,
        16
      ],
      [
        35,
        32,
        39,
        36,
        15
      ],
      [
        107,
        61,
        111,
        65,
        12
      ],
      [
        35,
        99,
        39,
        103,
        14
      ],
      [
        106,
        126,
        110,
        130,
        16
      ],
      [
        72,
        145,
        77,
        149,
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
        6,
        34,
        "west"
      ],
      [
        136,
        63,
        "east"
      ],
      [
        7,
        101,
        "west"
      ],
      [
        136,
        128,
        "east"
      ]
    ],
    "fixtures": [
      [
        75,
        16
      ],
      [
        37,
        35
      ],
      [
        109,
        64
      ],
      [
        37,
        102
      ],
      [
        108,
        129
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "root-crescent-vaults-forum",
        "kind": "consultation-room",
        "rect": [
          69,
          10,
          81,
          21
        ]
      },
      {
        "id": "root-crescent-vaults-wing1",
        "kind": "scriptorium",
        "rect": [
          31,
          29,
          43,
          39
        ]
      },
      {
        "id": "root-crescent-vaults-wing2",
        "kind": "cataloguing",
        "rect": [
          103,
          58,
          115,
          68
        ]
      },
      {
        "id": "root-crescent-vaults-wing3",
        "kind": "records-vault",
        "rect": [
          31,
          96,
          43,
          106
        ]
      },
      {
        "id": "root-crescent-vaults-wing4",
        "kind": "copying-gallery",
        "rect": [
          102,
          123,
          114,
          133
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          69,
          10,
          81,
          20
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          31,
          29,
          43,
          39
        ],
        "profile": "hip",
        "axis": "x",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          103,
          58,
          115,
          68
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          31,
          96,
          43,
          106
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          102,
          123,
          114,
          133
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "root-crescent-vaults",
      143,
      161,
      26,
      51,
      88,
      120,
      108
    ],
    "profile": "root-crescent-vaults",
    "sourceAuthoredName": "Everroot Living Archive"
  },
  {
    "id": "r4:observatory:temperate:medium:01",
    "type": "observatory",
    "biome": "temperate",
    "size": "medium",
    "variant": 1,
    "bounds": [
      117,
      22,
      133
    ],
    "wings": [
      [
        50,
        7,
        70,
        124
      ],
      [
        4,
        25,
        52,
        44
      ],
      [
        68,
        40,
        112,
        57
      ],
      [
        5,
        78,
        52,
        95
      ],
      [
        68,
        100,
        111,
        119
      ],
      [
        8,
        37,
        53,
        92
      ],
      [
        67,
        52,
        109,
        106
      ],
      [
        49,
        115,
        77,
        121
      ]
    ],
    "notches": [
      [
        57,
        59,
        62,
        64
      ],
      [
        72,
        89,
        75,
        92
      ]
    ],
    "octagons": [
      [
        11,
        37,
        6,
        8
      ],
      [
        105,
        110,
        6,
        10
      ],
      [
        99,
        47,
        4,
        7
      ]
    ],
    "skyline": [
      [
        57,
        11,
        63,
        17,
        17
      ],
      [
        26,
        32,
        30,
        36,
        16
      ],
      [
        88,
        46,
        92,
        50,
        13
      ],
      [
        26,
        84,
        30,
        88,
        15
      ],
      [
        87,
        107,
        91,
        111,
        12
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
        4,
        34,
        "west"
      ],
      [
        112,
        48,
        "east"
      ],
      [
        5,
        86,
        "west"
      ],
      [
        111,
        109,
        "east"
      ]
    ],
    "fixtures": [
      [
        60,
        16
      ],
      [
        28,
        35
      ],
      [
        90,
        49
      ],
      [
        28,
        87
      ],
      [
        89,
        110
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "heliograph-spear-forum",
        "kind": "instrument-room",
        "rect": [
          54,
          10,
          66,
          21
        ]
      },
      {
        "id": "heliograph-spear-wing1",
        "kind": "star-charts",
        "rect": [
          22,
          29,
          34,
          39
        ]
      },
      {
        "id": "heliograph-spear-wing2",
        "kind": "lens-workshop",
        "rect": [
          84,
          43,
          96,
          53
        ]
      },
      {
        "id": "heliograph-spear-wing3",
        "kind": "observation-deck",
        "rect": [
          22,
          81,
          34,
          91
        ]
      },
      {
        "id": "heliograph-spear-wing4",
        "kind": "public-lecture",
        "rect": [
          83,
          104,
          95,
          114
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          54,
          10,
          66,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          22,
          29,
          34,
          39
        ],
        "profile": "shed",
        "axis": "z",
        "high": 14,
        "period": 5
      },
      {
        "rect": [
          84,
          43,
          96,
          53
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          22,
          81,
          34,
          91
        ],
        "profile": "gable",
        "axis": "z",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          83,
          104,
          95,
          114
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "heliograph-spear",
      117,
      133,
      25,
      40,
      78,
      100,
      109
    ],
    "profile": "heliograph-spear",
    "sourceAuthoredName": "Windglass Solar Meridian"
  },
  {
    "id": "r4:observatory:snow:small:02",
    "type": "observatory",
    "biome": "snow",
    "size": "small",
    "variant": 2,
    "bounds": [
      93,
      22,
      119
    ],
    "wings": [
      [
        31,
        7,
        53,
        110
      ],
      [
        5,
        18,
        33,
        40
      ],
      [
        51,
        38,
        87,
        59
      ],
      [
        6,
        66,
        33,
        88
      ],
      [
        51,
        86,
        86,
        108
      ],
      [
        8,
        29,
        34,
        73
      ],
      [
        49,
        50,
        80,
        94
      ],
      [
        25,
        102,
        54,
        107
      ]
    ],
    "notches": [
      [
        39,
        52,
        44,
        57
      ],
      [
        27,
        95,
        30,
        98
      ]
    ],
    "octagons": [
      [
        12,
        30,
        7,
        9
      ],
      [
        80,
        96,
        7,
        11
      ]
    ],
    "skyline": [
      [
        39,
        11,
        45,
        17,
        13
      ],
      [
        17,
        27,
        21,
        31,
        12
      ],
      [
        67,
        46,
        71,
        50,
        14
      ],
      [
        17,
        75,
        21,
        79,
        16
      ],
      [
        66,
        95,
        70,
        99,
        13
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
        5,
        29,
        "west"
      ],
      [
        87,
        48,
        "east"
      ],
      [
        6,
        77,
        "west"
      ],
      [
        87,
        97,
        "east"
      ]
    ],
    "fixtures": [
      [
        42,
        16
      ],
      [
        19,
        30
      ],
      [
        69,
        49
      ],
      [
        19,
        78
      ],
      [
        68,
        98
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "split-prism-valley-forum",
        "kind": "instrument-room",
        "rect": [
          36,
          10,
          48,
          21
        ]
      },
      {
        "id": "split-prism-valley-wing1",
        "kind": "star-charts",
        "rect": [
          13,
          24,
          25,
          34
        ]
      },
      {
        "id": "split-prism-valley-wing2",
        "kind": "lens-workshop",
        "rect": [
          63,
          43,
          75,
          53
        ]
      },
      {
        "id": "split-prism-valley-wing3",
        "kind": "observation-deck",
        "rect": [
          13,
          72,
          25,
          82
        ]
      },
      {
        "id": "split-prism-valley-wing4",
        "kind": "public-lecture",
        "rect": [
          62,
          92,
          74,
          102
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          36,
          10,
          48,
          20
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          13,
          24,
          25,
          34
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          63,
          43,
          75,
          53
        ],
        "profile": "gable",
        "axis": "z",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          13,
          72,
          25,
          82
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          62,
          92,
          74,
          102
        ],
        "profile": "shed",
        "axis": "z",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "split-prism-valley",
      93,
      119,
      18,
      38,
      66,
      86,
      110
    ],
    "profile": "split-prism-valley",
    "sourceAuthoredName": "Winterstar Prism Chapel"
  },
  {
    "id": "r4:observatory:enchanted-forest:large:03",
    "type": "observatory",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 3,
    "bounds": [
      153,
      22,
      171
    ],
    "wings": [
      [
        57,
        7,
        81,
        162
      ],
      [
        6,
        28,
        59,
        53
      ],
      [
        79,
        49,
        146,
        74
      ],
      [
        7,
        93,
        59,
        120
      ],
      [
        79,
        128,
        145,
        153
      ],
      [
        10,
        44,
        62,
        106
      ],
      [
        78,
        61,
        143,
        134
      ],
      [
        56,
        153,
        88,
        159
      ]
    ],
    "notches": [
      [
        66,
        71,
        71,
        76
      ],
      [
        81,
        104,
        84,
        107
      ]
    ],
    "octagons": [
      [
        13,
        40,
        8,
        10
      ],
      [
        139,
        138,
        8,
        12
      ]
    ],
    "skyline": [
      [
        66,
        11,
        72,
        17,
        14
      ],
      [
        30,
        38,
        34,
        42,
        13
      ],
      [
        110,
        59,
        114,
        63,
        15
      ],
      [
        31,
        104,
        35,
        108,
        12
      ],
      [
        110,
        138,
        114,
        142,
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
        40,
        "west"
      ],
      [
        146,
        61,
        "east"
      ],
      [
        7,
        106,
        "west"
      ],
      [
        147,
        140,
        "east"
      ]
    ],
    "fixtures": [
      [
        69,
        16
      ],
      [
        32,
        41
      ],
      [
        112,
        62
      ],
      [
        33,
        107
      ],
      [
        112,
        141
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "triple-lunar-orbit-forum",
        "kind": "instrument-room",
        "rect": [
          63,
          10,
          75,
          21
        ]
      },
      {
        "id": "triple-lunar-orbit-wing1",
        "kind": "star-charts",
        "rect": [
          26,
          35,
          38,
          45
        ]
      },
      {
        "id": "triple-lunar-orbit-wing2",
        "kind": "lens-workshop",
        "rect": [
          106,
          56,
          118,
          66
        ]
      },
      {
        "id": "triple-lunar-orbit-wing3",
        "kind": "observation-deck",
        "rect": [
          27,
          101,
          39,
          111
        ]
      },
      {
        "id": "triple-lunar-orbit-wing4",
        "kind": "public-lecture",
        "rect": [
          106,
          135,
          118,
          145
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          63,
          10,
          75,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 4
      },
      {
        "rect": [
          26,
          35,
          38,
          45
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          106,
          56,
          118,
          66
        ],
        "profile": "hip",
        "axis": "x",
        "high": 14,
        "period": 6
      },
      {
        "rect": [
          27,
          101,
          39,
          111
        ],
        "profile": "shed",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          106,
          135,
          118,
          145
        ],
        "profile": "saw",
        "axis": "x",
        "high": 14,
        "period": 5
      }
    ],
    "signature": [
      "triple-lunar-orbit",
      153,
      171,
      28,
      49,
      93,
      128,
      111
    ],
    "profile": "triple-lunar-orbit",
    "sourceAuthoredName": "Moondrift Sky Scriptorium"
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
export function buildA2Wave8StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave8StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE8_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
