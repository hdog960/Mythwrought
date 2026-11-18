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
    "id": "r4:castle-palace:desert:large:03",
    "type": "castle-palace",
    "biome": "desert",
    "size": "large",
    "variant": 3,
    "bounds": [
      131,
      21,
      151
    ],
    "wings": [
      [
        49,
        7,
        69,
        142
      ],
      [
        5,
        25,
        52,
        46
      ],
      [
        66,
        40,
        125,
        60
      ],
      [
        6,
        78,
        53,
        98
      ],
      [
        65,
        109,
        124,
        129
      ],
      [
        5,
        40,
        50,
        91
      ],
      [
        68,
        52,
        123,
        119
      ]
    ],
    "notches": [
      [
        56,
        59,
        62,
        64
      ],
      [
        42,
        120,
        45,
        124
      ]
    ],
    "octagons": [
      [
        12,
        37,
        6,
        9
      ],
      [
        117,
        120,
        6,
        9
      ],
      [
        46,
        84,
        5,
        7
      ]
    ],
    "skyline": [
      [
        56,
        12,
        62,
        18,
        13
      ],
      [
        26,
        33,
        30,
        37,
        12
      ],
      [
        93,
        48,
        97,
        52,
        15
      ],
      [
        27,
        86,
        31,
        90,
        13
      ],
      [
        92,
        117,
        96,
        121,
        16
      ]
    ],
    "entry": [
      59,
      7
    ],
    "porch": [
      55,
      3,
      63,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 52,
        "to": 66,
        "door": 59,
        "facing": "north"
      }
    ],
    "windows": [
      [
        52,
        7,
        "south"
      ],
      [
        66,
        7,
        "south"
      ],
      [
        5,
        35,
        "west"
      ],
      [
        125,
        50,
        "east"
      ],
      [
        5,
        88,
        "west"
      ],
      [
        124,
        119,
        "east"
      ]
    ],
    "fixtures": [
      [
        59,
        16
      ],
      [
        28,
        36
      ],
      [
        95,
        51
      ],
      [
        29,
        89
      ],
      [
        94,
        120
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "split-arc-citadel-atrium",
        "kind": "entrance-hall",
        "rect": [
          53,
          10,
          65,
          21
        ]
      },
      {
        "id": "split-arc-citadel-wing-1",
        "kind": "tower-or-wing",
        "rect": [
          22,
          30,
          34,
          40
        ]
      },
      {
        "id": "split-arc-citadel-wing-2",
        "kind": "council",
        "rect": [
          89,
          45,
          101,
          55
        ]
      },
      {
        "id": "split-arc-citadel-wing-3",
        "kind": "grand-chamber",
        "rect": [
          23,
          83,
          35,
          93
        ]
      },
      {
        "id": "split-arc-citadel-wing-4",
        "kind": "tower-or-wing",
        "rect": [
          88,
          114,
          100,
          124
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          53,
          10,
          65,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          22,
          30,
          34,
          40
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          89,
          45,
          101,
          55
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          23,
          83,
          35,
          93
        ],
        "profile": "saw",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          88,
          114,
          100,
          124
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      }
    ],
    "signature": [
      "split-arc-citadel",
      131,
      151,
      25,
      40,
      78,
      109,
      8,
      200
    ],
    "profile": "split-arc-citadel",
    "sourceAuthoredName": "Sundial Citadel of the Four Wells"
  },
  {
    "id": "r4:castle-palace:enchanted-forest:small:02",
    "type": "castle-palace",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 2,
    "bounds": [
      85,
      21,
      105
    ],
    "wings": [
      [
        34,
        7,
        56,
        96
      ],
      [
        5,
        21,
        37,
        44
      ],
      [
        53,
        29,
        79,
        50
      ],
      [
        6,
        54,
        38,
        77
      ],
      [
        52,
        72,
        78,
        95
      ],
      [
        8,
        33,
        35,
        64
      ],
      [
        55,
        43,
        74,
        77
      ],
      [
        30,
        60,
        35,
        81
      ]
    ],
    "notches": [
      [
        42,
        41,
        48,
        46
      ],
      [
        60,
        66,
        63,
        70
      ]
    ],
    "octagons": [
      [
        12,
        33,
        7,
        10
      ],
      [
        71,
        83,
        7,
        10
      ]
    ],
    "skyline": [
      [
        42,
        12,
        48,
        18,
        14
      ],
      [
        19,
        30,
        23,
        34,
        13
      ],
      [
        64,
        37,
        68,
        41,
        16
      ],
      [
        20,
        63,
        24,
        67,
        14
      ],
      [
        63,
        81,
        67,
        85,
        12
      ]
    ],
    "entry": [
      45,
      7
    ],
    "porch": [
      41,
      3,
      49,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 38,
        "to": 52,
        "door": 45,
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
        52,
        7,
        "south"
      ],
      [
        5,
        32,
        "west"
      ],
      [
        79,
        39,
        "east"
      ],
      [
        6,
        65,
        "west"
      ],
      [
        78,
        83,
        "east"
      ]
    ],
    "fixtures": [
      [
        45,
        16
      ],
      [
        21,
        33
      ],
      [
        66,
        40
      ],
      [
        22,
        66
      ],
      [
        65,
        84
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "thorn-crescent-atrium",
        "kind": "entrance-hall",
        "rect": [
          39,
          10,
          51,
          21
        ]
      },
      {
        "id": "thorn-crescent-wing-1",
        "kind": "tower-or-wing",
        "rect": [
          15,
          27,
          27,
          37
        ]
      },
      {
        "id": "thorn-crescent-wing-2",
        "kind": "council",
        "rect": [
          60,
          34,
          72,
          44
        ]
      },
      {
        "id": "thorn-crescent-wing-3",
        "kind": "grand-chamber",
        "rect": [
          16,
          60,
          28,
          70
        ]
      },
      {
        "id": "thorn-crescent-wing-4",
        "kind": "tower-or-wing",
        "rect": [
          59,
          78,
          71,
          88
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          39,
          10,
          51,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          15,
          27,
          27,
          37
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          60,
          34,
          72,
          44
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          16,
          60,
          28,
          70
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          59,
          78,
          71,
          88
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "thorn-crescent",
      85,
      105,
      21,
      29,
      54,
      72,
      8,
      201
    ],
    "profile": "thorn-crescent",
    "sourceAuthoredName": "Thorncrown Canopy Seat"
  },
  {
    "id": "r4:castle-palace:mountain:medium:03",
    "type": "castle-palace",
    "biome": "mountain",
    "size": "medium",
    "variant": 3,
    "bounds": [
      109,
      21,
      137
    ],
    "wings": [
      [
        48,
        7,
        72,
        128
      ],
      [
        5,
        26,
        51,
        51
      ],
      [
        69,
        46,
        103,
        68
      ],
      [
        6,
        71,
        52,
        91
      ],
      [
        68,
        101,
        102,
        127
      ],
      [
        70,
        56,
        101,
        115
      ],
      [
        8,
        42,
        50,
        76
      ],
      [
        9,
        84,
        52,
        89
      ]
    ],
    "notches": [
      [
        57,
        58,
        63,
        63
      ],
      [
        43,
        112,
        46,
        116
      ]
    ],
    "octagons": [
      [
        12,
        38,
        8,
        11
      ],
      [
        95,
        112,
        6,
        9
      ]
    ],
    "skyline": [
      [
        57,
        12,
        63,
        18,
        15
      ],
      [
        26,
        36,
        30,
        40,
        14
      ],
      [
        84,
        55,
        88,
        59,
        12
      ],
      [
        27,
        79,
        31,
        83,
        15
      ],
      [
        83,
        112,
        87,
        116,
        13
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
        38,
        "west"
      ],
      [
        103,
        57,
        "east"
      ],
      [
        6,
        81,
        "west"
      ],
      [
        102,
        114,
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
        39
      ],
      [
        86,
        58
      ],
      [
        29,
        82
      ],
      [
        85,
        115
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "faultline-spur-atrium",
        "kind": "entrance-hall",
        "rect": [
          54,
          10,
          66,
          21
        ]
      },
      {
        "id": "faultline-spur-wing-1",
        "kind": "tower-or-wing",
        "rect": [
          22,
          33,
          34,
          43
        ]
      },
      {
        "id": "faultline-spur-wing-2",
        "kind": "council",
        "rect": [
          80,
          52,
          92,
          62
        ]
      },
      {
        "id": "faultline-spur-wing-3",
        "kind": "grand-chamber",
        "rect": [
          23,
          76,
          35,
          86
        ]
      },
      {
        "id": "faultline-spur-wing-4",
        "kind": "tower-or-wing",
        "rect": [
          79,
          109,
          91,
          119
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
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          22,
          33,
          34,
          43
        ],
        "profile": "saw",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          80,
          52,
          92,
          62
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 6
      },
      {
        "rect": [
          23,
          76,
          35,
          86
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          79,
          109,
          91,
          119
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "faultline-spur",
      109,
      137,
      26,
      46,
      71,
      101,
      8,
      202
    ],
    "profile": "faultline-spur",
    "sourceAuthoredName": "Riftwall Dais and Falconry"
  },
  {
    "id": "r4:embassy:temperate:large:02",
    "type": "embassy",
    "biome": "temperate",
    "size": "large",
    "variant": 2,
    "bounds": [
      127,
      21,
      139
    ],
    "wings": [
      [
        56,
        7,
        76,
        130
      ],
      [
        5,
        29,
        59,
        50
      ],
      [
        73,
        43,
        121,
        66
      ],
      [
        6,
        79,
        60,
        102
      ],
      [
        72,
        104,
        120,
        124
      ],
      [
        6,
        41,
        58,
        91
      ],
      [
        74,
        53,
        118,
        109
      ],
      [
        7,
        95,
        119,
        98
      ]
    ],
    "notches": [
      [
        63,
        61,
        69,
        66
      ],
      [
        81,
        91,
        84,
        95
      ]
    ],
    "octagons": [
      [
        12,
        41,
        6,
        9
      ],
      [
        113,
        115,
        7,
        10
      ],
      [
        53,
        85,
        5,
        7
      ]
    ],
    "skyline": [
      [
        63,
        12,
        69,
        18,
        16
      ],
      [
        30,
        37,
        34,
        41,
        15
      ],
      [
        95,
        52,
        99,
        56,
        13
      ],
      [
        31,
        88,
        35,
        92,
        16
      ],
      [
        94,
        112,
        98,
        116,
        14
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
        39,
        "west"
      ],
      [
        121,
        54,
        "east"
      ],
      [
        6,
        90,
        "west"
      ],
      [
        120,
        114,
        "east"
      ]
    ],
    "fixtures": [
      [
        66,
        16
      ],
      [
        32,
        40
      ],
      [
        97,
        55
      ],
      [
        33,
        91
      ],
      [
        96,
        115
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "river-gate-arc-atrium",
        "kind": "formal-chamber",
        "rect": [
          60,
          10,
          72,
          21
        ]
      },
      {
        "id": "river-gate-arc-wing-1",
        "kind": "guest-area",
        "rect": [
          26,
          34,
          38,
          44
        ]
      },
      {
        "id": "river-gate-arc-wing-2",
        "kind": "consular-office",
        "rect": [
          91,
          49,
          103,
          59
        ]
      },
      {
        "id": "river-gate-arc-wing-3",
        "kind": "treaty-archive",
        "rect": [
          27,
          85,
          39,
          95
        ]
      },
      {
        "id": "river-gate-arc-wing-4",
        "kind": "hospitality",
        "rect": [
          90,
          109,
          102,
          119
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          60,
          10,
          72,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          26,
          34,
          38,
          44
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          91,
          49,
          103,
          59
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          27,
          85,
          39,
          95
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          90,
          109,
          102,
          119
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "river-gate-arc",
      127,
      139,
      29,
      43,
      79,
      104,
      8,
      203
    ],
    "profile": "river-gate-arc",
    "sourceAuthoredName": "Rivergate Chamber of Five Banners"
  },
  {
    "id": "r4:embassy:desert:small:01",
    "type": "embassy",
    "biome": "desert",
    "size": "small",
    "variant": 1,
    "bounds": [
      87,
      21,
      109
    ],
    "wings": [
      [
        28,
        7,
        50,
        100
      ],
      [
        5,
        24,
        31,
        47
      ],
      [
        47,
        39,
        81,
        59
      ],
      [
        6,
        65,
        32,
        85
      ],
      [
        46,
        80,
        80,
        103
      ],
      [
        48,
        53,
        78,
        89
      ],
      [
        8,
        36,
        29,
        73
      ],
      [
        4,
        78,
        20,
        99
      ]
    ],
    "notches": [
      [
        36,
        52,
        42,
        57
      ],
      [
        22,
        91,
        25,
        95
      ]
    ],
    "octagons": [
      [
        12,
        36,
        7,
        10
      ],
      [
        73,
        91,
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
        17
      ],
      [
        16,
        33,
        20,
        37,
        16
      ],
      [
        62,
        47,
        66,
        51,
        14
      ],
      [
        17,
        73,
        21,
        77,
        12
      ],
      [
        61,
        89,
        65,
        93,
        15
      ]
    ],
    "entry": [
      39,
      7
    ],
    "porch": [
      35,
      3,
      43,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 26,
        "from": 32,
        "to": 46,
        "door": 39,
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
        46,
        7,
        "south"
      ],
      [
        5,
        35,
        "west"
      ],
      [
        81,
        49,
        "east"
      ],
      [
        6,
        75,
        "west"
      ],
      [
        80,
        91,
        "east"
      ]
    ],
    "fixtures": [
      [
        39,
        16
      ],
      [
        18,
        36
      ],
      [
        64,
        50
      ],
      [
        19,
        76
      ],
      [
        63,
        92
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "suncourt-loop-atrium",
        "kind": "formal-chamber",
        "rect": [
          33,
          10,
          45,
          21
        ]
      },
      {
        "id": "suncourt-loop-wing-1",
        "kind": "guest-area",
        "rect": [
          12,
          30,
          24,
          40
        ]
      },
      {
        "id": "suncourt-loop-wing-2",
        "kind": "consular-office",
        "rect": [
          58,
          44,
          70,
          54
        ]
      },
      {
        "id": "suncourt-loop-wing-3",
        "kind": "treaty-archive",
        "rect": [
          13,
          70,
          25,
          80
        ]
      },
      {
        "id": "suncourt-loop-wing-4",
        "kind": "hospitality",
        "rect": [
          57,
          86,
          69,
          96
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          33,
          10,
          45,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          12,
          30,
          24,
          40
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          58,
          44,
          70,
          54
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          13,
          70,
          25,
          80
        ],
        "profile": "saw",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          57,
          86,
          69,
          96
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      }
    ],
    "signature": [
      "suncourt-loop",
      87,
      109,
      24,
      39,
      65,
      80,
      8,
      204
    ],
    "profile": "suncourt-loop",
    "sourceAuthoredName": "Oasis Accord Cloister"
  },
  {
    "id": "r4:embassy:enchanted-forest:medium:03",
    "type": "embassy",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 3,
    "bounds": [
      113,
      21,
      129
    ],
    "wings": [
      [
        49,
        7,
        73,
        120
      ],
      [
        5,
        24,
        52,
        49
      ],
      [
        70,
        38,
        107,
        59
      ],
      [
        6,
        69,
        53,
        92
      ],
      [
        69,
        91,
        106,
        117
      ],
      [
        8,
        37,
        50,
        85
      ],
      [
        71,
        51,
        105,
        100
      ],
      [
        41,
        82,
        47,
        105
      ]
    ],
    "notches": [
      [
        58,
        53,
        64,
        58
      ],
      [
        76,
        81,
        79,
        85
      ]
    ],
    "octagons": [
      [
        12,
        36,
        8,
        11
      ],
      [
        99,
        102,
        7,
        10
      ]
    ],
    "skyline": [
      [
        58,
        12,
        64,
        18,
        13
      ],
      [
        26,
        34,
        30,
        38,
        12
      ],
      [
        86,
        46,
        90,
        50,
        15
      ],
      [
        27,
        78,
        31,
        82,
        13
      ],
      [
        85,
        102,
        89,
        106,
        16
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
        "fixed": 26,
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
        4,
        36,
        "west"
      ],
      [
        107,
        48,
        "east"
      ],
      [
        6,
        80,
        "west"
      ],
      [
        106,
        104,
        "east"
      ]
    ],
    "fixtures": [
      [
        61,
        16
      ],
      [
        28,
        37
      ],
      [
        88,
        49
      ],
      [
        29,
        81
      ],
      [
        87,
        105
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "mycelial-skybridge-atrium",
        "kind": "formal-chamber",
        "rect": [
          55,
          10,
          67,
          21
        ]
      },
      {
        "id": "mycelial-skybridge-wing-1",
        "kind": "guest-area",
        "rect": [
          22,
          31,
          34,
          41
        ]
      },
      {
        "id": "mycelial-skybridge-wing-2",
        "kind": "consular-office",
        "rect": [
          82,
          43,
          94,
          53
        ]
      },
      {
        "id": "mycelial-skybridge-wing-3",
        "kind": "treaty-archive",
        "rect": [
          23,
          75,
          35,
          85
        ]
      },
      {
        "id": "mycelial-skybridge-wing-4",
        "kind": "hospitality",
        "rect": [
          81,
          99,
          93,
          109
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          55,
          10,
          67,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          22,
          31,
          34,
          41
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          82,
          43,
          94,
          53
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          23,
          75,
          35,
          85
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          81,
          99,
          93,
          109
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "mycelial-skybridge",
      113,
      129,
      24,
      38,
      69,
      91,
      8,
      205
    ],
    "profile": "mycelial-skybridge",
    "sourceAuthoredName": "Mossveil Embassy Crescent"
  },
  {
    "id": "r4:grand-archive:snow:large:01",
    "type": "grand-archive",
    "biome": "snow",
    "size": "large",
    "variant": 1,
    "bounds": [
      129,
      21,
      145
    ],
    "wings": [
      [
        51,
        7,
        71,
        136
      ],
      [
        5,
        24,
        54,
        45
      ],
      [
        68,
        43,
        123,
        65
      ],
      [
        6,
        83,
        55,
        103
      ],
      [
        67,
        109,
        122,
        129
      ],
      [
        8,
        42,
        53,
        95
      ],
      [
        69,
        56,
        119,
        122
      ]
    ],
    "notches": [
      [
        58,
        63,
        64,
        68
      ],
      [
        44,
        120,
        47,
        124
      ]
    ],
    "octagons": [
      [
        12,
        36,
        6,
        9
      ],
      [
        115,
        120,
        6,
        9
      ],
      [
        48,
        89,
        5,
        7
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
        27,
        32,
        31,
        36,
        13
      ],
      [
        93,
        52,
        97,
        56,
        16
      ],
      [
        28,
        91,
        32,
        95,
        14
      ],
      [
        92,
        117,
        96,
        121,
        12
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
        "fixed": 26,
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
        5,
        34,
        "west"
      ],
      [
        123,
        54,
        "east"
      ],
      [
        6,
        93,
        "west"
      ],
      [
        122,
        119,
        "east"
      ]
    ],
    "fixtures": [
      [
        61,
        16
      ],
      [
        29,
        35
      ],
      [
        95,
        55
      ],
      [
        30,
        94
      ],
      [
        94,
        120
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "cryo-bastion-atrium",
        "kind": "consultation-room",
        "rect": [
          55,
          10,
          67,
          21
        ]
      },
      {
        "id": "cryo-bastion-wing-1",
        "kind": "scriptorium",
        "rect": [
          23,
          29,
          35,
          39
        ]
      },
      {
        "id": "cryo-bastion-wing-2",
        "kind": "cataloguing",
        "rect": [
          89,
          49,
          101,
          59
        ]
      },
      {
        "id": "cryo-bastion-wing-3",
        "kind": "records-vault",
        "rect": [
          24,
          88,
          36,
          98
        ]
      },
      {
        "id": "cryo-bastion-wing-4",
        "kind": "copying-gallery",
        "rect": [
          88,
          114,
          100,
          124
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          55,
          10,
          67,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          23,
          29,
          35,
          39
        ],
        "profile": "saw",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          89,
          49,
          101,
          59
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 6
      },
      {
        "rect": [
          24,
          88,
          36,
          98
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          88,
          114,
          100,
          124
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "cryo-bastion",
      129,
      145,
      24,
      43,
      83,
      109,
      8,
      206
    ],
    "profile": "cryo-bastion",
    "sourceAuthoredName": "The Glacial Codex Vault"
  },
  {
    "id": "r4:grand-archive:enchanted-forest:small:01",
    "type": "grand-archive",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 1,
    "bounds": [
      91,
      21,
      107
    ],
    "wings": [
      [
        36,
        7,
        58,
        98
      ],
      [
        5,
        19,
        39,
        42
      ],
      [
        55,
        31,
        85,
        54
      ],
      [
        6,
        57,
        40,
        80
      ],
      [
        54,
        77,
        84,
        100
      ],
      [
        56,
        48,
        81,
        86
      ],
      [
        8,
        32,
        37,
        66
      ],
      [
        30,
        67,
        37,
        89
      ]
    ],
    "notches": [
      [
        44,
        44,
        50,
        49
      ],
      [
        62,
        69,
        65,
        73
      ]
    ],
    "octagons": [
      [
        12,
        31,
        7,
        10
      ],
      [
        77,
        88,
        7,
        10
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
        20,
        28,
        24,
        32,
        14
      ],
      [
        68,
        40,
        72,
        44,
        12
      ],
      [
        21,
        66,
        25,
        70,
        15
      ],
      [
        67,
        86,
        71,
        90,
        13
      ]
    ],
    "entry": [
      47,
      7
    ],
    "porch": [
      43,
      3,
      51,
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
        40,
        7,
        "south"
      ],
      [
        54,
        7,
        "south"
      ],
      [
        5,
        30,
        "west"
      ],
      [
        85,
        42,
        "east"
      ],
      [
        6,
        68,
        "west"
      ],
      [
        84,
        88,
        "east"
      ]
    ],
    "fixtures": [
      [
        47,
        16
      ],
      [
        22,
        31
      ],
      [
        70,
        43
      ],
      [
        23,
        69
      ],
      [
        69,
        89
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "spiral-grove-atrium",
        "kind": "consultation-room",
        "rect": [
          41,
          10,
          53,
          21
        ]
      },
      {
        "id": "spiral-grove-wing-1",
        "kind": "scriptorium",
        "rect": [
          16,
          25,
          28,
          35
        ]
      },
      {
        "id": "spiral-grove-wing-2",
        "kind": "cataloguing",
        "rect": [
          64,
          37,
          76,
          47
        ]
      },
      {
        "id": "spiral-grove-wing-3",
        "kind": "records-vault",
        "rect": [
          17,
          63,
          29,
          73
        ]
      },
      {
        "id": "spiral-grove-wing-4",
        "kind": "copying-gallery",
        "rect": [
          63,
          83,
          75,
          93
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          41,
          10,
          53,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          16,
          25,
          28,
          35
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          64,
          37,
          76,
          47
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          17,
          63,
          29,
          73
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          63,
          83,
          75,
          93
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "spiral-grove",
      91,
      107,
      19,
      31,
      57,
      77,
      8,
      207
    ],
    "profile": "spiral-grove",
    "sourceAuthoredName": "Whispergrove Bookmaze"
  },
  {
    "id": "r4:grand-archive:mountain:medium:02",
    "type": "grand-archive",
    "biome": "mountain",
    "size": "medium",
    "variant": 2,
    "bounds": [
      111,
      21,
      135
    ],
    "wings": [
      [
        38,
        7,
        62,
        126
      ],
      [
        5,
        25,
        41,
        50
      ],
      [
        59,
        39,
        105,
        59
      ],
      [
        6,
        70,
        42,
        90
      ],
      [
        58,
        101,
        104,
        127
      ],
      [
        5,
        43,
        40,
        86
      ],
      [
        60,
        51,
        102,
        106
      ],
      [
        8,
        115,
        41,
        119
      ]
    ],
    "notches": [
      [
        47,
        54,
        53,
        59
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
        37,
        8,
        11
      ],
      [
        97,
        112,
        6,
        9
      ]
    ],
    "skyline": [
      [
        47,
        12,
        53,
        18,
        16
      ],
      [
        21,
        35,
        25,
        39,
        15
      ],
      [
        80,
        47,
        84,
        51,
        13
      ],
      [
        22,
        78,
        26,
        82,
        16
      ],
      [
        79,
        112,
        83,
        116,
        14
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
        4,
        37,
        "west"
      ],
      [
        105,
        49,
        "east"
      ],
      [
        5,
        80,
        "west"
      ],
      [
        104,
        114,
        "east"
      ]
    ],
    "fixtures": [
      [
        50,
        16
      ],
      [
        23,
        38
      ],
      [
        82,
        50
      ],
      [
        24,
        81
      ],
      [
        81,
        115
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "hanging-scriptorium-atrium",
        "kind": "consultation-room",
        "rect": [
          44,
          10,
          56,
          21
        ]
      },
      {
        "id": "hanging-scriptorium-wing-1",
        "kind": "scriptorium",
        "rect": [
          17,
          32,
          29,
          42
        ]
      },
      {
        "id": "hanging-scriptorium-wing-2",
        "kind": "cataloguing",
        "rect": [
          76,
          44,
          88,
          54
        ]
      },
      {
        "id": "hanging-scriptorium-wing-3",
        "kind": "records-vault",
        "rect": [
          18,
          75,
          30,
          85
        ]
      },
      {
        "id": "hanging-scriptorium-wing-4",
        "kind": "copying-gallery",
        "rect": [
          75,
          109,
          87,
          119
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          44,
          10,
          56,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          17,
          32,
          29,
          42
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          76,
          44,
          88,
          54
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 6
      },
      {
        "rect": [
          18,
          75,
          30,
          85
        ],
        "profile": "saw",
        "axis": "z",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          75,
          109,
          87,
          119
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      }
    ],
    "signature": [
      "hanging-scriptorium",
      111,
      135,
      25,
      39,
      70,
      101,
      8,
      208
    ],
    "profile": "hanging-scriptorium",
    "sourceAuthoredName": "Thundershelf Stratified Library"
  },
  {
    "id": "r4:observatory:temperate:large:03",
    "type": "observatory",
    "biome": "temperate",
    "size": "large",
    "variant": 3,
    "bounds": [
      135,
      21,
      149
    ],
    "wings": [
      [
        55,
        7,
        75,
        140
      ],
      [
        5,
        23,
        58,
        44
      ],
      [
        72,
        46,
        129,
        67
      ],
      [
        6,
        84,
        59,
        107
      ],
      [
        71,
        117,
        128,
        137
      ],
      [
        73,
        63,
        128,
        128
      ],
      [
        9,
        37,
        56,
        90
      ],
      [
        10,
        129,
        122,
        134
      ]
    ],
    "notches": [
      [
        62,
        65,
        68,
        70
      ],
      [
        80,
        96,
        83,
        100
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
        121,
        128,
        7,
        10
      ],
      [
        52,
        90,
        5,
        7
      ]
    ],
    "skyline": [
      [
        62,
        12,
        68,
        18,
        17
      ],
      [
        29,
        31,
        33,
        35,
        16
      ],
      [
        98,
        54,
        102,
        58,
        14
      ],
      [
        30,
        93,
        34,
        97,
        12
      ],
      [
        97,
        125,
        101,
        129,
        15
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
        "fixed": 26,
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
        5,
        33,
        "west"
      ],
      [
        129,
        56,
        "east"
      ],
      [
        6,
        95,
        "west"
      ],
      [
        128,
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
        31,
        34
      ],
      [
        100,
        57
      ],
      [
        32,
        96
      ],
      [
        99,
        128
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "radial-meridian-atrium",
        "kind": "instrument-room",
        "rect": [
          59,
          10,
          71,
          21
        ]
      },
      {
        "id": "radial-meridian-wing-1",
        "kind": "star-charts",
        "rect": [
          25,
          28,
          37,
          38
        ]
      },
      {
        "id": "radial-meridian-wing-2",
        "kind": "lens-workshop",
        "rect": [
          94,
          51,
          106,
          61
        ]
      },
      {
        "id": "radial-meridian-wing-3",
        "kind": "observation-deck",
        "rect": [
          26,
          90,
          38,
          100
        ]
      },
      {
        "id": "radial-meridian-wing-4",
        "kind": "public-lecture",
        "rect": [
          93,
          122,
          105,
          132
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          59,
          10,
          71,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          25,
          28,
          37,
          38
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 5
      },
      {
        "rect": [
          94,
          51,
          106,
          61
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 6
      },
      {
        "rect": [
          26,
          90,
          38,
          100
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          93,
          122,
          105,
          132
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 5
      }
    ],
    "signature": [
      "radial-meridian",
      135,
      149,
      23,
      46,
      84,
      117,
      8,
      209
    ],
    "profile": "radial-meridian",
    "sourceAuthoredName": "Starbridge Meridian Academy"
  },
  {
    "id": "r4:observatory:desert:medium:01",
    "type": "observatory",
    "biome": "desert",
    "size": "medium",
    "variant": 1,
    "bounds": [
      109,
      21,
      125
    ],
    "wings": [
      [
        39,
        7,
        61,
        116
      ],
      [
        5,
        19,
        42,
        42
      ],
      [
        58,
        37,
        103,
        59
      ],
      [
        6,
        71,
        43,
        91
      ],
      [
        57,
        96,
        102,
        119
      ],
      [
        7,
        33,
        40,
        82
      ],
      [
        59,
        52,
        100,
        109
      ],
      [
        64,
        82,
        70,
        108
      ]
    ],
    "notches": [
      [
        47,
        54,
        53,
        59
      ],
      [
        33,
        107,
        36,
        111
      ]
    ],
    "octagons": [
      [
        12,
        31,
        7,
        10
      ],
      [
        95,
        107,
        6,
        9
      ]
    ],
    "skyline": [
      [
        47,
        12,
        53,
        18,
        13
      ],
      [
        21,
        28,
        25,
        32,
        12
      ],
      [
        78,
        46,
        82,
        50,
        15
      ],
      [
        22,
        79,
        26,
        83,
        13
      ],
      [
        77,
        105,
        81,
        109,
        16
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
        5,
        30,
        "west"
      ],
      [
        103,
        48,
        "east"
      ],
      [
        6,
        81,
        "west"
      ],
      [
        102,
        107,
        "east"
      ]
    ],
    "fixtures": [
      [
        50,
        16
      ],
      [
        23,
        31
      ],
      [
        80,
        49
      ],
      [
        24,
        82
      ],
      [
        79,
        108
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "sundial-forks-atrium",
        "kind": "instrument-room",
        "rect": [
          44,
          10,
          56,
          21
        ]
      },
      {
        "id": "sundial-forks-wing-1",
        "kind": "star-charts",
        "rect": [
          17,
          25,
          29,
          35
        ]
      },
      {
        "id": "sundial-forks-wing-2",
        "kind": "lens-workshop",
        "rect": [
          74,
          43,
          86,
          53
        ]
      },
      {
        "id": "sundial-forks-wing-3",
        "kind": "observation-deck",
        "rect": [
          18,
          76,
          30,
          86
        ]
      },
      {
        "id": "sundial-forks-wing-4",
        "kind": "public-lecture",
        "rect": [
          73,
          102,
          85,
          112
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          44,
          10,
          56,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          17,
          25,
          29,
          35
        ],
        "profile": "saw",
        "axis": "z",
        "high": 13,
        "period": 5
      },
      {
        "rect": [
          74,
          43,
          86,
          53
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 6
      },
      {
        "rect": [
          18,
          76,
          30,
          86
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          73,
          102,
          85,
          112
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 5
      }
    ],
    "signature": [
      "sundial-forks",
      109,
      125,
      19,
      37,
      71,
      96,
      8,
      210
    ],
    "profile": "sundial-forks",
    "sourceAuthoredName": "Sunscar Orrery Terraces"
  },
  {
    "id": "r4:observatory:mountain:small:01",
    "type": "observatory",
    "biome": "mountain",
    "size": "small",
    "variant": 1,
    "bounds": [
      91,
      21,
      115
    ],
    "wings": [
      [
        38,
        7,
        62,
        106
      ],
      [
        5,
        22,
        41,
        47
      ],
      [
        59,
        40,
        85,
        63
      ],
      [
        6,
        62,
        42,
        85
      ],
      [
        58,
        83,
        84,
        109
      ],
      [
        60,
        53,
        81,
        96
      ],
      [
        8,
        34,
        40,
        71
      ],
      [
        8,
        97,
        81,
        101
      ]
    ],
    "notches": [
      [
        47,
        51,
        53,
        56
      ],
      [
        65,
        74,
        68,
        78
      ]
    ],
    "octagons": [
      [
        12,
        34,
        8,
        11
      ],
      [
        77,
        94,
        7,
        10
      ]
    ],
    "skyline": [
      [
        47,
        12,
        53,
        18,
        14
      ],
      [
        21,
        32,
        25,
        36,
        13
      ],
      [
        70,
        49,
        74,
        53,
        16
      ],
      [
        22,
        71,
        26,
        75,
        14
      ],
      [
        69,
        94,
        73,
        98,
        12
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
        4,
        34,
        "west"
      ],
      [
        85,
        51,
        "east"
      ],
      [
        6,
        73,
        "west"
      ],
      [
        84,
        96,
        "east"
      ]
    ],
    "fixtures": [
      [
        50,
        16
      ],
      [
        23,
        35
      ],
      [
        72,
        52
      ],
      [
        24,
        74
      ],
      [
        71,
        97
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "split-spire-wind-atrium",
        "kind": "instrument-room",
        "rect": [
          44,
          10,
          56,
          21
        ]
      },
      {
        "id": "split-spire-wind-wing-1",
        "kind": "star-charts",
        "rect": [
          17,
          29,
          29,
          39
        ]
      },
      {
        "id": "split-spire-wind-wing-2",
        "kind": "lens-workshop",
        "rect": [
          66,
          46,
          78,
          56
        ]
      },
      {
        "id": "split-spire-wind-wing-3",
        "kind": "observation-deck",
        "rect": [
          18,
          68,
          30,
          78
        ]
      },
      {
        "id": "split-spire-wind-wing-4",
        "kind": "public-lecture",
        "rect": [
          65,
          91,
          77,
          101
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          44,
          10,
          56,
          20
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 4
      },
      {
        "rect": [
          17,
          29,
          29,
          39
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          66,
          46,
          78,
          56
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 6
      },
      {
        "rect": [
          18,
          68,
          30,
          78
        ],
        "profile": "gable",
        "axis": "z",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          65,
          91,
          77,
          101
        ],
        "profile": "saw",
        "axis": "x",
        "high": 13,
        "period": 5
      }
    ],
    "signature": [
      "split-spire-wind",
      91,
      115,
      22,
      40,
      62,
      83,
      8,
      211
    ],
    "profile": "split-spire-wind",
    "sourceAuthoredName": "Skyneedle Parallax House"
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
export function buildA2Wave7StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave7StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE7_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
