// Roadmap A2: 12 independently source-authored plans. No runtime integration, no writes to any protected 164 candidates.
// Builder 4A M3/M4 state knowledge — twelve new independent Roadmap A2 castle, embassy, archive and observatory plans.
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
    "id": "r4:castle-palace:mountain:large:03",
    "type": "castle-palace",
    "biome": "mountain",
    "size": "large",
    "variant": 3,
    "bounds": [
      108,
      14,
      91
    ],
    "wings": [
      [
        44,
        7,
        64,
        27
      ],
      [
        3,
        17,
        46,
        57
      ],
      [
        62,
        21,
        104,
        62
      ],
      [
        48,
        23,
        60,
        54
      ],
      [
        36,
        50,
        72,
        86
      ],
      [
        2,
        54,
        40,
        81
      ],
      [
        68,
        59,
        105,
        79
      ]
    ],
    "notches": [
      [
        47,
        73,
        61,
        86
      ]
    ],
    "octagons": [
      [
        9,
        52,
        5,
        8
      ]
    ],
    "skyline": [
      [
        50,
        12,
        58,
        17,
        11
      ],
      [
        38,
        24,
        42,
        28,
        10
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
        "fixed": 24,
        "from": 48,
        "to": 60,
        "door": 54,
        "facing": "north"
      }
    ],
    "windows": [
      [
        47,
        7,
        "north"
      ],
      [
        61,
        7,
        "north"
      ],
      [
        3,
        25,
        "west"
      ],
      [
        104,
        29,
        "east"
      ],
      [
        40,
        86,
        "south"
      ],
      [
        68,
        86,
        "south"
      ]
    ],
    "fixtures": [
      [
        54,
        15
      ],
      [
        9,
        28
      ],
      [
        98,
        32
      ],
      [
        42,
        56
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "offset-six-court-stoneward-mountain-seat-arrival",
        "kind": "entrance-hall",
        "rect": [
          48,
          10,
          60,
          20
        ]
      },
      {
        "id": "offset-six-court-stoneward-mountain-seat-west",
        "kind": "tower-or-wing",
        "rect": [
          7,
          23,
          41,
          31
        ]
      },
      {
        "id": "offset-six-court-stoneward-mountain-seat-east",
        "kind": "council",
        "rect": [
          67,
          27,
          99,
          35
        ]
      },
      {
        "id": "offset-six-court-stoneward-mountain-seat-vault",
        "kind": "grand-chamber",
        "rect": [
          38,
          53,
          44,
          80
        ]
      },
      {
        "id": "offset-six-court-stoneward-mountain-seat-chamber",
        "kind": "tower-or-wing",
        "rect": [
          64,
          53,
          70,
          80
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
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          22,
          41,
          31
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          67,
          26,
          99,
          35
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          38,
          53,
          44,
          80
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          64,
          53,
          70,
          80
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "offset-six-court-stoneward-mountain-seat",
      108,
      14,
      91
    ],
    "profile": "offset-six-court-stoneward-mountain-seat",
    "artName": "Stonewake High Pass Parliament Fortress"
  },
  {
    "id": "r4:castle-palace:enchanted-forest:medium:03",
    "type": "castle-palace",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 3,
    "bounds": [
      81,
      14,
      80
    ],
    "wings": [
      [
        30,
        7,
        50,
        27
      ],
      [
        3,
        20,
        32,
        47
      ],
      [
        48,
        17,
        77,
        53
      ],
      [
        34,
        23,
        46,
        49
      ],
      [
        22,
        45,
        58,
        75
      ],
      [
        2,
        44,
        26,
        70
      ]
    ],
    "notches": [
      [
        36,
        64,
        44,
        75
      ]
    ],
    "octagons": [
      [
        9,
        42,
        5,
        8
      ]
    ],
    "skyline": [
      [
        36,
        12,
        44,
        17,
        11
      ],
      [
        24,
        27,
        28,
        31,
        10
      ]
    ],
    "entry": [
      40,
      7
    ],
    "porch": [
      37,
      3,
      43,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 34,
        "to": 46,
        "door": 40,
        "facing": "north"
      }
    ],
    "windows": [
      [
        33,
        7,
        "north"
      ],
      [
        47,
        7,
        "north"
      ],
      [
        3,
        28,
        "west"
      ],
      [
        77,
        25,
        "east"
      ],
      [
        26,
        75,
        "south"
      ],
      [
        54,
        75,
        "south"
      ]
    ],
    "fixtures": [
      [
        40,
        15
      ],
      [
        9,
        31
      ],
      [
        71,
        28
      ],
      [
        28,
        51
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "moonlit-petal-court-overgrown-regent-house-arrival",
        "kind": "entrance-hall",
        "rect": [
          34,
          10,
          46,
          20
        ]
      },
      {
        "id": "moonlit-petal-court-overgrown-regent-house-west",
        "kind": "tower-or-wing",
        "rect": [
          7,
          26,
          27,
          34
        ]
      },
      {
        "id": "moonlit-petal-court-overgrown-regent-house-east",
        "kind": "council",
        "rect": [
          53,
          23,
          72,
          31
        ]
      },
      {
        "id": "moonlit-petal-court-overgrown-regent-house-vault",
        "kind": "grand-chamber",
        "rect": [
          24,
          48,
          30,
          69
        ]
      },
      {
        "id": "moonlit-petal-court-overgrown-regent-house-chamber",
        "kind": "tower-or-wing",
        "rect": [
          50,
          48,
          56,
          69
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
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          25,
          27,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          53,
          22,
          72,
          31
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          24,
          48,
          30,
          69
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          50,
          48,
          56,
          69
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "moonlit-petal-court-overgrown-regent-house",
      81,
      14,
      80
    ],
    "profile": "moonlit-petal-court-overgrown-regent-house",
    "artName": "Greenbough Mooncourt Regent Palace"
  },
  {
    "id": "r4:castle-palace:desert:small:03",
    "type": "castle-palace",
    "biome": "desert",
    "size": "small",
    "variant": 3,
    "bounds": [
      59,
      14,
      69
    ],
    "wings": [
      [
        19,
        7,
        39,
        27
      ],
      [
        3,
        17,
        21,
        45
      ],
      [
        37,
        24,
        55,
        48
      ],
      [
        23,
        23,
        35,
        46
      ],
      [
        11,
        42,
        47,
        64
      ],
      [
        43,
        45,
        56,
        57
      ]
    ],
    "notches": [
      [
        24,
        54,
        34,
        64
      ]
    ],
    "octagons": [
      [
        9,
        40,
        5,
        8
      ]
    ],
    "skyline": [
      [
        25,
        12,
        33,
        17,
        11
      ],
      [
        13,
        24,
        17,
        28,
        10
      ]
    ],
    "entry": [
      29,
      7
    ],
    "porch": [
      26,
      3,
      32,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 23,
        "to": 35,
        "door": 29,
        "facing": "north"
      }
    ],
    "windows": [
      [
        22,
        7,
        "north"
      ],
      [
        36,
        7,
        "north"
      ],
      [
        3,
        25,
        "west"
      ],
      [
        55,
        32,
        "east"
      ],
      [
        15,
        64,
        "south"
      ],
      [
        43,
        64,
        "south"
      ]
    ],
    "fixtures": [
      [
        29,
        15
      ],
      [
        9,
        28
      ],
      [
        49,
        35
      ],
      [
        17,
        48
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "oasis-staggered-water-keep-twin-courts-arrival",
        "kind": "entrance-hall",
        "rect": [
          23,
          10,
          35,
          20
        ]
      },
      {
        "id": "oasis-staggered-water-keep-twin-courts-west",
        "kind": "tower-or-wing",
        "rect": [
          7,
          23,
          16,
          31
        ]
      },
      {
        "id": "oasis-staggered-water-keep-twin-courts-east",
        "kind": "council",
        "rect": [
          42,
          30,
          50,
          38
        ]
      },
      {
        "id": "oasis-staggered-water-keep-twin-courts-vault",
        "kind": "grand-chamber",
        "rect": [
          13,
          45,
          19,
          58
        ]
      },
      {
        "id": "oasis-staggered-water-keep-twin-courts-chamber",
        "kind": "tower-or-wing",
        "rect": [
          39,
          45,
          45,
          58
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          22,
          10,
          36,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          22,
          16,
          31
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          42,
          29,
          50,
          38
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          13,
          45,
          19,
          58
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          39,
          45,
          45,
          58
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "oasis-staggered-water-keep-twin-courts",
      59,
      14,
      69
    ],
    "profile": "oasis-staggered-water-keep-twin-courts",
    "artName": "Saffron Ramparts Water Ledger Keep"
  },
  {
    "id": "r4:embassy:temperate:large:03",
    "type": "embassy",
    "biome": "temperate",
    "size": "large",
    "variant": 3,
    "bounds": [
      91,
      14,
      78
    ],
    "wings": [
      [
        35,
        7,
        55,
        27
      ],
      [
        3,
        23,
        37,
        58
      ],
      [
        53,
        18,
        87,
        56
      ],
      [
        39,
        23,
        51,
        47
      ],
      [
        27,
        43,
        63,
        73
      ],
      [
        2,
        55,
        31,
        68
      ],
      [
        59,
        53,
        88,
        66
      ]
    ],
    "notches": [
      [
        40,
        63,
        50,
        73
      ]
    ],
    "octagons": [
      [
        9,
        53,
        5,
        8
      ]
    ],
    "skyline": [
      [
        41,
        12,
        49,
        17,
        11
      ],
      [
        29,
        30,
        33,
        34,
        10
      ]
    ],
    "entry": [
      45,
      7
    ],
    "porch": [
      42,
      3,
      48,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 39,
        "to": 51,
        "door": 45,
        "facing": "north"
      }
    ],
    "windows": [
      [
        38,
        7,
        "north"
      ],
      [
        52,
        7,
        "north"
      ],
      [
        3,
        31,
        "west"
      ],
      [
        87,
        26,
        "east"
      ],
      [
        31,
        73,
        "south"
      ],
      [
        59,
        73,
        "south"
      ]
    ],
    "fixtures": [
      [
        45,
        15
      ],
      [
        9,
        34
      ],
      [
        81,
        29
      ],
      [
        33,
        49
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "cross-river-ambassador-bridge-galleries-arrival",
        "kind": "formal-chamber",
        "rect": [
          39,
          10,
          51,
          20
        ]
      },
      {
        "id": "cross-river-ambassador-bridge-galleries-west",
        "kind": "guest-area",
        "rect": [
          7,
          29,
          32,
          37
        ]
      },
      {
        "id": "cross-river-ambassador-bridge-galleries-east",
        "kind": "consular-office",
        "rect": [
          58,
          24,
          82,
          32
        ]
      },
      {
        "id": "cross-river-ambassador-bridge-galleries-vault",
        "kind": "treaty-archive",
        "rect": [
          29,
          46,
          35,
          67
        ]
      },
      {
        "id": "cross-river-ambassador-bridge-galleries-chamber",
        "kind": "hospitality",
        "rect": [
          55,
          46,
          61,
          67
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          38,
          10,
          52,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          28,
          32,
          37
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          58,
          23,
          82,
          32
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          29,
          46,
          35,
          67
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          55,
          46,
          61,
          67
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "cross-river-ambassador-bridge-galleries",
      91,
      14,
      78
    ],
    "profile": "cross-river-ambassador-bridge-galleries",
    "artName": "River Concord Double Consulate"
  },
  {
    "id": "r4:embassy:snow:medium:03",
    "type": "embassy",
    "biome": "snow",
    "size": "medium",
    "variant": 3,
    "bounds": [
      69,
      14,
      90
    ],
    "wings": [
      [
        24,
        7,
        44,
        27
      ],
      [
        3,
        18,
        26,
        49
      ],
      [
        42,
        25,
        65,
        60
      ],
      [
        28,
        23,
        40,
        51
      ],
      [
        16,
        47,
        52,
        85
      ],
      [
        2,
        46,
        20,
        80
      ]
    ],
    "notches": [
      [
        28,
        70,
        40,
        85
      ]
    ],
    "octagons": [
      [
        9,
        44,
        5,
        8
      ]
    ],
    "skyline": [
      [
        30,
        12,
        38,
        17,
        11
      ],
      [
        18,
        25,
        22,
        29,
        10
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
        "fixed": 24,
        "from": 28,
        "to": 40,
        "door": 34,
        "facing": "north"
      }
    ],
    "windows": [
      [
        27,
        7,
        "north"
      ],
      [
        41,
        7,
        "north"
      ],
      [
        3,
        26,
        "west"
      ],
      [
        65,
        33,
        "east"
      ],
      [
        20,
        85,
        "south"
      ],
      [
        48,
        85,
        "south"
      ]
    ],
    "fixtures": [
      [
        34,
        15
      ],
      [
        9,
        29
      ],
      [
        59,
        36
      ],
      [
        22,
        53
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "wind-shadow-snow-delegation-spur-arrival",
        "kind": "formal-chamber",
        "rect": [
          28,
          10,
          40,
          20
        ]
      },
      {
        "id": "wind-shadow-snow-delegation-spur-west",
        "kind": "guest-area",
        "rect": [
          7,
          24,
          21,
          32
        ]
      },
      {
        "id": "wind-shadow-snow-delegation-spur-east",
        "kind": "consular-office",
        "rect": [
          47,
          31,
          60,
          39
        ]
      },
      {
        "id": "wind-shadow-snow-delegation-spur-vault",
        "kind": "treaty-archive",
        "rect": [
          18,
          50,
          24,
          79
        ]
      },
      {
        "id": "wind-shadow-snow-delegation-spur-chamber",
        "kind": "hospitality",
        "rect": [
          44,
          50,
          50,
          79
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
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          23,
          21,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          47,
          30,
          60,
          39
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          18,
          50,
          24,
          79
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          44,
          50,
          50,
          79
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "wind-shadow-snow-delegation-spur",
      69,
      14,
      90
    ],
    "profile": "wind-shadow-snow-delegation-spur",
    "artName": "Winterglass Delegation Lodge"
  },
  {
    "id": "r4:embassy:mountain:small:03",
    "type": "embassy",
    "biome": "mountain",
    "size": "small",
    "variant": 3,
    "bounds": [
      57,
      14,
      70
    ],
    "wings": [
      [
        18,
        7,
        38,
        27
      ],
      [
        3,
        20,
        20,
        47
      ],
      [
        36,
        16,
        53,
        49
      ],
      [
        22,
        23,
        34,
        45
      ],
      [
        10,
        41,
        46,
        65
      ]
    ],
    "notches": [
      [
        24,
        56,
        32,
        65
      ]
    ],
    "octagons": [
      [
        9,
        42,
        5,
        8
      ]
    ],
    "skyline": [
      [
        24,
        12,
        32,
        17,
        11
      ],
      [
        12,
        27,
        16,
        31,
        10
      ]
    ],
    "entry": [
      28,
      7
    ],
    "porch": [
      25,
      3,
      31,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 22,
        "to": 34,
        "door": 28,
        "facing": "north"
      }
    ],
    "windows": [
      [
        21,
        7,
        "north"
      ],
      [
        35,
        7,
        "north"
      ],
      [
        3,
        28,
        "west"
      ],
      [
        53,
        24,
        "east"
      ],
      [
        14,
        65,
        "south"
      ],
      [
        42,
        65,
        "south"
      ]
    ],
    "fixtures": [
      [
        28,
        15
      ],
      [
        9,
        31
      ],
      [
        47,
        27
      ],
      [
        16,
        47
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "switchback-mountain-compact-consulate-arrival",
        "kind": "formal-chamber",
        "rect": [
          22,
          10,
          34,
          20
        ]
      },
      {
        "id": "switchback-mountain-compact-consulate-west",
        "kind": "guest-area",
        "rect": [
          7,
          26,
          15,
          34
        ]
      },
      {
        "id": "switchback-mountain-compact-consulate-east",
        "kind": "consular-office",
        "rect": [
          41,
          22,
          48,
          30
        ]
      },
      {
        "id": "switchback-mountain-compact-consulate-vault",
        "kind": "treaty-archive",
        "rect": [
          12,
          44,
          18,
          59
        ]
      },
      {
        "id": "switchback-mountain-compact-consulate-chamber",
        "kind": "hospitality",
        "rect": [
          38,
          44,
          44,
          59
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          21,
          10,
          35,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          25,
          15,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          41,
          21,
          48,
          30
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          12,
          44,
          18,
          59
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          38,
          44,
          44,
          59
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "switchback-mountain-compact-consulate",
      57,
      14,
      70
    ],
    "profile": "switchback-mountain-compact-consulate",
    "artName": "Thornpass Compact Summit Legation"
  },
  {
    "id": "r4:grand-archive:enchanted-forest:large:03",
    "type": "grand-archive",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 3,
    "bounds": [
      97,
      14,
      88
    ],
    "wings": [
      [
        38,
        7,
        58,
        27
      ],
      [
        3,
        16,
        40,
        62
      ],
      [
        56,
        23,
        93,
        58
      ],
      [
        42,
        23,
        54,
        51
      ],
      [
        30,
        47,
        66,
        83
      ],
      [
        2,
        59,
        34,
        78
      ],
      [
        62,
        55,
        94,
        76
      ]
    ],
    "notches": [
      [
        41,
        69,
        55,
        83
      ]
    ],
    "octagons": [
      [
        9,
        57,
        5,
        8
      ]
    ],
    "skyline": [
      [
        44,
        12,
        52,
        17,
        11
      ],
      [
        32,
        23,
        36,
        27,
        10
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
        "fixed": 24,
        "from": 42,
        "to": 54,
        "door": 48,
        "facing": "north"
      }
    ],
    "windows": [
      [
        41,
        7,
        "north"
      ],
      [
        55,
        7,
        "north"
      ],
      [
        3,
        24,
        "west"
      ],
      [
        93,
        31,
        "east"
      ],
      [
        34,
        83,
        "south"
      ],
      [
        62,
        83,
        "south"
      ]
    ],
    "fixtures": [
      [
        48,
        15
      ],
      [
        9,
        27
      ],
      [
        87,
        34
      ],
      [
        36,
        53
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "branching-forest-two-vault-index-chamber-arrival",
        "kind": "consultation-room",
        "rect": [
          42,
          10,
          54,
          20
        ]
      },
      {
        "id": "branching-forest-two-vault-index-chamber-west",
        "kind": "scriptorium",
        "rect": [
          7,
          22,
          35,
          30
        ]
      },
      {
        "id": "branching-forest-two-vault-index-chamber-east",
        "kind": "cataloguing",
        "rect": [
          61,
          29,
          88,
          37
        ]
      },
      {
        "id": "branching-forest-two-vault-index-chamber-vault",
        "kind": "records-vault",
        "rect": [
          32,
          50,
          38,
          77
        ]
      },
      {
        "id": "branching-forest-two-vault-index-chamber-chamber",
        "kind": "copying-gallery",
        "rect": [
          58,
          50,
          64,
          77
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
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          21,
          35,
          30
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          61,
          28,
          88,
          37
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          32,
          50,
          38,
          77
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          58,
          50,
          64,
          77
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "branching-forest-two-vault-index-chamber",
      97,
      14,
      88
    ],
    "profile": "branching-forest-two-vault-index-chamber",
    "artName": "Wyrdroot Twin Scriptorium Sanctum"
  },
  {
    "id": "r4:grand-archive:mountain:medium:03",
    "type": "grand-archive",
    "biome": "mountain",
    "size": "medium",
    "variant": 3,
    "bounds": [
      75,
      14,
      77
    ],
    "wings": [
      [
        27,
        7,
        47,
        27
      ],
      [
        3,
        23,
        29,
        53
      ],
      [
        45,
        17,
        71,
        51
      ],
      [
        31,
        23,
        43,
        48
      ],
      [
        19,
        44,
        55,
        72
      ],
      [
        51,
        48,
        72,
        65
      ]
    ],
    "notches": [
      [
        32,
        61,
        42,
        72
      ]
    ],
    "octagons": [
      [
        9,
        48,
        5,
        8
      ]
    ],
    "skyline": [
      [
        33,
        12,
        41,
        17,
        11
      ],
      [
        21,
        30,
        25,
        34,
        10
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
        "fixed": 24,
        "from": 31,
        "to": 43,
        "door": 37,
        "facing": "north"
      }
    ],
    "windows": [
      [
        30,
        7,
        "north"
      ],
      [
        44,
        7,
        "north"
      ],
      [
        3,
        31,
        "west"
      ],
      [
        71,
        25,
        "east"
      ],
      [
        23,
        72,
        "south"
      ],
      [
        51,
        72,
        "south"
      ]
    ],
    "fixtures": [
      [
        37,
        15
      ],
      [
        9,
        34
      ],
      [
        65,
        28
      ],
      [
        25,
        50
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "carved-pass-granite-index-gallery-arrival",
        "kind": "consultation-room",
        "rect": [
          31,
          10,
          43,
          20
        ]
      },
      {
        "id": "carved-pass-granite-index-gallery-west",
        "kind": "scriptorium",
        "rect": [
          7,
          29,
          24,
          37
        ]
      },
      {
        "id": "carved-pass-granite-index-gallery-east",
        "kind": "cataloguing",
        "rect": [
          50,
          23,
          66,
          31
        ]
      },
      {
        "id": "carved-pass-granite-index-gallery-vault",
        "kind": "records-vault",
        "rect": [
          21,
          47,
          27,
          66
        ]
      },
      {
        "id": "carved-pass-granite-index-gallery-chamber",
        "kind": "copying-gallery",
        "rect": [
          47,
          47,
          53,
          66
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
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          28,
          24,
          37
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          50,
          22,
          66,
          31
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          21,
          47,
          27,
          66
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          47,
          47,
          53,
          66
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "carved-pass-granite-index-gallery",
      75,
      14,
      77
    ],
    "profile": "carved-pass-granite-index-gallery",
    "artName": "Granite Echo Split Records Repository"
  },
  {
    "id": "r4:grand-archive:desert:small:03",
    "type": "grand-archive",
    "biome": "desert",
    "size": "small",
    "variant": 3,
    "bounds": [
      61,
      14,
      76
    ],
    "wings": [
      [
        20,
        7,
        40,
        27
      ],
      [
        3,
        18,
        22,
        49
      ],
      [
        38,
        22,
        57,
        51
      ],
      [
        24,
        23,
        36,
        48
      ],
      [
        12,
        44,
        48,
        71
      ],
      [
        2,
        46,
        16,
        66
      ]
    ],
    "notches": [
      [
        24,
        61,
        36,
        71
      ]
    ],
    "octagons": [
      [
        9,
        44,
        5,
        8
      ]
    ],
    "skyline": [
      [
        26,
        12,
        34,
        17,
        11
      ],
      [
        14,
        25,
        18,
        29,
        10
      ]
    ],
    "entry": [
      30,
      7
    ],
    "porch": [
      27,
      3,
      33,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 24,
        "to": 36,
        "door": 30,
        "facing": "north"
      }
    ],
    "windows": [
      [
        23,
        7,
        "north"
      ],
      [
        37,
        7,
        "north"
      ],
      [
        3,
        26,
        "west"
      ],
      [
        57,
        30,
        "east"
      ],
      [
        16,
        71,
        "south"
      ],
      [
        44,
        71,
        "south"
      ]
    ],
    "fixtures": [
      [
        30,
        15
      ],
      [
        9,
        29
      ],
      [
        51,
        33
      ],
      [
        18,
        50
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "sand-dune-open-court-scriptorium-arrival",
        "kind": "consultation-room",
        "rect": [
          24,
          10,
          36,
          20
        ]
      },
      {
        "id": "sand-dune-open-court-scriptorium-west",
        "kind": "scriptorium",
        "rect": [
          7,
          24,
          17,
          32
        ]
      },
      {
        "id": "sand-dune-open-court-scriptorium-east",
        "kind": "cataloguing",
        "rect": [
          43,
          28,
          52,
          36
        ]
      },
      {
        "id": "sand-dune-open-court-scriptorium-vault",
        "kind": "records-vault",
        "rect": [
          14,
          47,
          20,
          65
        ]
      },
      {
        "id": "sand-dune-open-court-scriptorium-chamber",
        "kind": "copying-gallery",
        "rect": [
          40,
          47,
          46,
          65
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          23,
          10,
          37,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          23,
          17,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          43,
          27,
          52,
          36
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          14,
          47,
          20,
          65
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          40,
          47,
          46,
          65
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "sand-dune-open-court-scriptorium",
      61,
      14,
      76
    ],
    "profile": "sand-dune-open-court-scriptorium",
    "artName": "Duneveil Seal and Scroll House"
  },
  {
    "id": "r4:observatory:snow:large:03",
    "type": "observatory",
    "biome": "snow",
    "size": "large",
    "variant": 3,
    "bounds": [
      102,
      14,
      85
    ],
    "wings": [
      [
        41,
        7,
        61,
        27
      ],
      [
        3,
        18,
        43,
        61
      ],
      [
        59,
        24,
        98,
        56
      ],
      [
        45,
        23,
        57,
        50
      ],
      [
        33,
        46,
        69,
        80
      ],
      [
        2,
        58,
        37,
        75
      ],
      [
        65,
        53,
        99,
        73
      ]
    ],
    "notches": [
      [
        44,
        67,
        58,
        80
      ]
    ],
    "octagons": [
      [
        9,
        56,
        5,
        8
      ]
    ],
    "skyline": [
      [
        47,
        12,
        55,
        17,
        11
      ],
      [
        35,
        25,
        39,
        29,
        10
      ]
    ],
    "entry": [
      51,
      7
    ],
    "porch": [
      48,
      3,
      54,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 45,
        "to": 57,
        "door": 51,
        "facing": "north"
      }
    ],
    "windows": [
      [
        44,
        7,
        "north"
      ],
      [
        58,
        7,
        "north"
      ],
      [
        3,
        26,
        "west"
      ],
      [
        98,
        32,
        "east"
      ],
      [
        37,
        80,
        "south"
      ],
      [
        65,
        80,
        "south"
      ]
    ],
    "fixtures": [
      [
        51,
        15
      ],
      [
        9,
        29
      ],
      [
        92,
        35
      ],
      [
        39,
        52
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "frost-double-dome-open-sky-north-deck-arrival",
        "kind": "instrument-room",
        "rect": [
          45,
          10,
          57,
          20
        ]
      },
      {
        "id": "frost-double-dome-open-sky-north-deck-west",
        "kind": "star-charts",
        "rect": [
          7,
          24,
          38,
          32
        ]
      },
      {
        "id": "frost-double-dome-open-sky-north-deck-east",
        "kind": "lens-workshop",
        "rect": [
          64,
          30,
          93,
          38
        ]
      },
      {
        "id": "frost-double-dome-open-sky-north-deck-vault",
        "kind": "observation-deck",
        "rect": [
          35,
          49,
          41,
          74
        ]
      },
      {
        "id": "frost-double-dome-open-sky-north-deck-chamber",
        "kind": "public-lecture",
        "rect": [
          61,
          49,
          67,
          74
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          44,
          10,
          58,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          23,
          38,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          64,
          29,
          93,
          38
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          35,
          49,
          41,
          74
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          61,
          49,
          67,
          74
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "frost-double-dome-open-sky-north-deck",
      102,
      14,
      85
    ],
    "profile": "frost-double-dome-open-sky-north-deck",
    "artName": "Aurora Crown Snowline Observatory"
  },
  {
    "id": "r4:observatory:temperate:medium:03",
    "type": "observatory",
    "biome": "temperate",
    "size": "medium",
    "variant": 3,
    "bounds": [
      73,
      14,
      87
    ],
    "wings": [
      [
        26,
        7,
        46,
        27
      ],
      [
        3,
        22,
        28,
        57
      ],
      [
        44,
        18,
        69,
        53
      ],
      [
        30,
        23,
        42,
        53
      ],
      [
        18,
        49,
        54,
        82
      ],
      [
        2,
        54,
        22,
        77
      ]
    ],
    "notches": [
      [
        31,
        71,
        41,
        82
      ]
    ],
    "octagons": [
      [
        9,
        52,
        5,
        8
      ]
    ],
    "skyline": [
      [
        32,
        12,
        40,
        17,
        11
      ],
      [
        20,
        29,
        24,
        33,
        10
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
        "fixed": 24,
        "from": 30,
        "to": 42,
        "door": 36,
        "facing": "north"
      }
    ],
    "windows": [
      [
        29,
        7,
        "north"
      ],
      [
        43,
        7,
        "north"
      ],
      [
        3,
        30,
        "west"
      ],
      [
        69,
        26,
        "east"
      ],
      [
        22,
        82,
        "south"
      ],
      [
        50,
        82,
        "south"
      ]
    ],
    "fixtures": [
      [
        36,
        15
      ],
      [
        9,
        33
      ],
      [
        63,
        29
      ],
      [
        24,
        55
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "river-meridian-split-faceted-lens-wing-arrival",
        "kind": "instrument-room",
        "rect": [
          30,
          10,
          42,
          20
        ]
      },
      {
        "id": "river-meridian-split-faceted-lens-wing-west",
        "kind": "star-charts",
        "rect": [
          7,
          28,
          23,
          36
        ]
      },
      {
        "id": "river-meridian-split-faceted-lens-wing-east",
        "kind": "lens-workshop",
        "rect": [
          49,
          24,
          64,
          32
        ]
      },
      {
        "id": "river-meridian-split-faceted-lens-wing-vault",
        "kind": "observation-deck",
        "rect": [
          20,
          52,
          26,
          76
        ]
      },
      {
        "id": "river-meridian-split-faceted-lens-wing-chamber",
        "kind": "public-lecture",
        "rect": [
          46,
          52,
          52,
          76
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
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          27,
          23,
          36
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          49,
          23,
          64,
          32
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          20,
          52,
          26,
          76
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          46,
          52,
          52,
          76
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "river-meridian-split-faceted-lens-wing",
      73,
      14,
      87
    ],
    "profile": "river-meridian-split-faceted-lens-wing",
    "artName": "Starglass Meridian Research Gallery"
  },
  {
    "id": "r4:observatory:enchanted-forest:small:03",
    "type": "observatory",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 3,
    "bounds": [
      58,
      14,
      72
    ],
    "wings": [
      [
        19,
        7,
        39,
        27
      ],
      [
        3,
        17,
        21,
        48
      ],
      [
        37,
        24,
        54,
        47
      ],
      [
        23,
        23,
        35,
        47
      ],
      [
        11,
        43,
        47,
        67
      ],
      [
        43,
        44,
        55,
        60
      ]
    ],
    "notches": [
      [
        25,
        58,
        33,
        67
      ]
    ],
    "octagons": [
      [
        9,
        43,
        5,
        8
      ]
    ],
    "skyline": [
      [
        25,
        12,
        33,
        17,
        11
      ],
      [
        13,
        24,
        17,
        28,
        10
      ]
    ],
    "entry": [
      29,
      7
    ],
    "porch": [
      26,
      3,
      32,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 24,
        "from": 23,
        "to": 35,
        "door": 29,
        "facing": "north"
      }
    ],
    "windows": [
      [
        22,
        7,
        "north"
      ],
      [
        36,
        7,
        "north"
      ],
      [
        3,
        25,
        "west"
      ],
      [
        54,
        32,
        "east"
      ],
      [
        15,
        67,
        "south"
      ],
      [
        43,
        67,
        "south"
      ]
    ],
    "fixtures": [
      [
        29,
        15
      ],
      [
        9,
        28
      ],
      [
        48,
        35
      ],
      [
        17,
        49
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "canopy-footbridge-open-star-observation-arrival",
        "kind": "instrument-room",
        "rect": [
          23,
          10,
          35,
          20
        ]
      },
      {
        "id": "canopy-footbridge-open-star-observation-west",
        "kind": "star-charts",
        "rect": [
          7,
          23,
          16,
          31
        ]
      },
      {
        "id": "canopy-footbridge-open-star-observation-east",
        "kind": "lens-workshop",
        "rect": [
          42,
          30,
          49,
          38
        ]
      },
      {
        "id": "canopy-footbridge-open-star-observation-vault",
        "kind": "observation-deck",
        "rect": [
          13,
          46,
          19,
          61
        ]
      },
      {
        "id": "canopy-footbridge-open-star-observation-chamber",
        "kind": "public-lecture",
        "rect": [
          39,
          46,
          45,
          61
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          22,
          10,
          36,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          22,
          16,
          31
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          42,
          29,
          49,
          38
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          13,
          46,
          19,
          61
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          39,
          46,
          45,
          61
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "canopy-footbridge-open-star-observation",
      58,
      14,
      72
    ],
    "profile": "canopy-footbridge-open-star-observation",
    "artName": "Bramblemoon Canopy Skywatch"
  }
];;
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
export function buildA2OriginalStateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2OriginalStateKnowledge(){return PLANS.map(author);}
export const A2_ORIGINAL_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
