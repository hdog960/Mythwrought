// Roadmap A2 Wave2: twelve new independently authored source-coordinate state/knowledge designs.
// Merges/deployment prohibited; protected prior 176 source fingerprints unchanged.
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
    "id": "r4:castle-palace:snow:medium:03",
    "type": "castle-palace",
    "biome": "snow",
    "size": "medium",
    "variant": 3,
    "bounds": [
      86,
      15,
      94
    ],
    "wings": [
      [
        31,
        7,
        55,
        28
      ],
      [
        3,
        17,
        34,
        64
      ],
      [
        52,
        27,
        82,
        59
      ],
      [
        35,
        23,
        51,
        64
      ],
      [
        21,
        57,
        65,
        89
      ],
      [
        31,
        17,
        38,
        29
      ],
      [
        48,
        27,
        55,
        39
      ],
      [
        2,
        59,
        28,
        84
      ]
    ],
    "notches": [
      [
        37,
        74,
        49,
        89
      ]
    ],
    "octagons": [
      [
        9,
        60,
        7,
        10
      ],
      [
        76,
        54,
        7,
        10
      ]
    ],
    "skyline": [
      [
        38,
        12,
        48,
        18,
        12
      ],
      [
        9,
        26,
        13,
        30,
        10
      ],
      [
        70,
        36,
        74,
        40,
        13
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
        "north"
      ],
      [
        52,
        7,
        "north"
      ],
      [
        3,
        26,
        "west"
      ],
      [
        82,
        36,
        "east"
      ],
      [
        25,
        89,
        "south"
      ],
      [
        61,
        89,
        "south"
      ]
    ],
    "fixtures": [
      [
        43,
        15
      ],
      [
        9,
        29
      ],
      [
        76,
        39
      ],
      [
        28,
        65
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "glacial-spiral-east-bastion-rear-open-court-entry",
        "kind": "entrance-hall",
        "rect": [
          36,
          10,
          50,
          18
        ]
      },
      {
        "id": "glacial-spiral-east-bastion-rear-open-court-western",
        "kind": "tower-or-wing",
        "rect": [
          7,
          24,
          28,
          32
        ]
      },
      {
        "id": "glacial-spiral-east-bastion-rear-open-court-eastern",
        "kind": "council",
        "rect": [
          58,
          34,
          77,
          42
        ]
      },
      {
        "id": "glacial-spiral-east-bastion-rear-open-court-northwest",
        "kind": "grand-chamber",
        "rect": [
          24,
          60,
          31,
          82
        ]
      },
      {
        "id": "glacial-spiral-east-bastion-rear-open-court-northeast",
        "kind": "tower-or-wing",
        "rect": [
          55,
          60,
          62,
          82
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          35,
          10,
          51,
          23
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          24,
          29,
          34
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          57,
          34,
          77,
          44
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          25,
          61,
          31,
          82
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          55,
          61,
          61,
          82
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "glacial-spiral-east-bastion-rear-open-court",
      86,
      15,
      94
    ],
    "profile": "glacial-spiral-east-bastion-rear-open-court",
    "sourceAuthoredName": "Northglass Crown Spiral Bastion"
  },
  {
    "id": "r4:castle-palace:temperate:small:03",
    "type": "castle-palace",
    "biome": "temperate",
    "size": "small",
    "variant": 3,
    "bounds": [
      62,
      15,
      75
    ],
    "wings": [
      [
        19,
        7,
        43,
        28
      ],
      [
        3,
        26,
        22,
        54
      ],
      [
        40,
        16,
        58,
        53
      ],
      [
        23,
        23,
        39,
        55
      ],
      [
        9,
        48,
        53,
        70
      ],
      [
        19,
        26,
        26,
        38
      ],
      [
        36,
        16,
        43,
        28
      ],
      [
        46,
        48,
        59,
        64
      ]
    ],
    "notches": [
      [
        25,
        59,
        37,
        70
      ]
    ],
    "octagons": [
      [
        9,
        50,
        7,
        10
      ],
      [
        52,
        48,
        7,
        10
      ]
    ],
    "skyline": [
      [
        26,
        12,
        36,
        18,
        10
      ],
      [
        9,
        35,
        13,
        39,
        13
      ],
      [
        46,
        25,
        50,
        29,
        11
      ]
    ],
    "entry": [
      31,
      7
    ],
    "porch": [
      28,
      3,
      34,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 23,
        "to": 39,
        "door": 31,
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
        40,
        7,
        "north"
      ],
      [
        3,
        35,
        "west"
      ],
      [
        58,
        25,
        "east"
      ],
      [
        13,
        70,
        "south"
      ],
      [
        49,
        70,
        "south"
      ]
    ],
    "fixtures": [
      [
        31,
        15
      ],
      [
        9,
        38
      ],
      [
        52,
        28
      ],
      [
        16,
        56
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "riverbend-eastern-cross-court-belfry-entry",
        "kind": "entrance-hall",
        "rect": [
          24,
          10,
          38,
          18
        ]
      },
      {
        "id": "riverbend-eastern-cross-court-belfry-western",
        "kind": "tower-or-wing",
        "rect": [
          7,
          33,
          16,
          41
        ]
      },
      {
        "id": "riverbend-eastern-cross-court-belfry-eastern",
        "kind": "council",
        "rect": [
          46,
          23,
          53,
          31
        ]
      },
      {
        "id": "riverbend-eastern-cross-court-belfry-northwest",
        "kind": "grand-chamber",
        "rect": [
          12,
          51,
          19,
          63
        ]
      },
      {
        "id": "riverbend-eastern-cross-court-belfry-northeast",
        "kind": "tower-or-wing",
        "rect": [
          43,
          51,
          50,
          63
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          23,
          10,
          39,
          23
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          33,
          17,
          43
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          45,
          23,
          53,
          33
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          13,
          52,
          19,
          63
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          43,
          52,
          49,
          63
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "riverbend-eastern-cross-court-belfry",
      62,
      15,
      75
    ],
    "profile": "riverbend-eastern-cross-court-belfry",
    "sourceAuthoredName": "Brackenford Cross-Court Citadel"
  },
  {
    "id": "r4:castle-palace:enchanted-forest:large:02",
    "type": "castle-palace",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 2,
    "bounds": [
      110,
      15,
      96
    ],
    "wings": [
      [
        43,
        7,
        67,
        28
      ],
      [
        3,
        18,
        46,
        66
      ],
      [
        64,
        26,
        106,
        70
      ],
      [
        47,
        23,
        63,
        68
      ],
      [
        33,
        61,
        77,
        91
      ],
      [
        43,
        18,
        50,
        30
      ],
      [
        60,
        26,
        67,
        38
      ],
      [
        2,
        61,
        40,
        86
      ],
      [
        70,
        65,
        107,
        85
      ]
    ],
    "notches": [
      [
        49,
        74,
        61,
        91
      ],
      [
        43,
        32,
        67,
        57
      ]
    ],
    "octagons": [
      [
        9,
        62,
        7,
        10
      ],
      [
        100,
        65,
        7,
        10
      ]
    ],
    "skyline": [
      [
        50,
        12,
        60,
        18,
        13
      ],
      [
        9,
        27,
        13,
        31,
        12
      ],
      [
        94,
        35,
        98,
        39,
        10
      ]
    ],
    "entry": [
      55,
      7
    ],
    "porch": [
      52,
      3,
      58,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 47,
        "to": 63,
        "door": 55,
        "facing": "north"
      }
    ],
    "windows": [
      [
        46,
        7,
        "north"
      ],
      [
        64,
        7,
        "north"
      ],
      [
        3,
        27,
        "west"
      ],
      [
        106,
        35,
        "east"
      ],
      [
        37,
        91,
        "south"
      ],
      [
        73,
        91,
        "south"
      ]
    ],
    "fixtures": [
      [
        55,
        15
      ],
      [
        9,
        30
      ],
      [
        100,
        38
      ],
      [
        40,
        69
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "moonleaf-double-watchtowers-open-royal-arcade-entry",
        "kind": "entrance-hall",
        "rect": [
          48,
          10,
          62,
          18
        ]
      },
      {
        "id": "moonleaf-double-watchtowers-open-royal-arcade-western",
        "kind": "tower-or-wing",
        "rect": [
          7,
          25,
          40,
          33
        ]
      },
      {
        "id": "moonleaf-double-watchtowers-open-royal-arcade-eastern",
        "kind": "council",
        "rect": [
          70,
          33,
          101,
          41
        ]
      },
      {
        "id": "moonleaf-double-watchtowers-open-royal-arcade-northwest",
        "kind": "grand-chamber",
        "rect": [
          36,
          64,
          43,
          84
        ]
      },
      {
        "id": "moonleaf-double-watchtowers-open-royal-arcade-northeast",
        "kind": "tower-or-wing",
        "rect": [
          67,
          64,
          74,
          84
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          47,
          10,
          63,
          23
        ],
        "profile": "gable",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          25,
          41,
          35
        ],
        "profile": "hip",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          69,
          33,
          101,
          43
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          37,
          65,
          43,
          84
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          67,
          65,
          73,
          84
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "moonleaf-double-watchtowers-open-royal-arcade",
      110,
      15,
      96
    ],
    "profile": "moonleaf-double-watchtowers-open-royal-arcade",
    "sourceAuthoredName": "Elderbough Moonleaf Crown Palace"
  },
  {
    "id": "r4:embassy:enchanted-forest:large:03",
    "type": "embassy",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 3,
    "bounds": [
      99,
      15,
      84
    ],
    "wings": [
      [
        37,
        7,
        61,
        28
      ],
      [
        3,
        15,
        40,
        60
      ],
      [
        58,
        24,
        95,
        56
      ],
      [
        41,
        23,
        57,
        60
      ],
      [
        27,
        53,
        71,
        79
      ],
      [
        37,
        15,
        44,
        27
      ],
      [
        54,
        24,
        61,
        36
      ],
      [
        2,
        55,
        34,
        74
      ]
    ],
    "notches": [
      [
        43,
        69,
        55,
        79
      ]
    ],
    "octagons": [
      [
        9,
        56,
        7,
        10
      ],
      [
        89,
        51,
        7,
        10
      ]
    ],
    "skyline": [
      [
        44,
        12,
        54,
        18,
        11
      ],
      [
        9,
        24,
        13,
        28,
        13
      ]
    ],
    "entry": [
      49,
      7
    ],
    "porch": [
      46,
      3,
      52,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 41,
        "to": 57,
        "door": 49,
        "facing": "north"
      }
    ],
    "windows": [
      [
        40,
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
        24,
        "west"
      ],
      [
        95,
        33,
        "east"
      ],
      [
        31,
        79,
        "south"
      ],
      [
        67,
        79,
        "south"
      ]
    ],
    "fixtures": [
      [
        49,
        15
      ],
      [
        9,
        27
      ],
      [
        89,
        36
      ],
      [
        34,
        61
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "twin-covenant-botanical-foreign-delegation-entry",
        "kind": "formal-chamber",
        "rect": [
          42,
          10,
          56,
          18
        ]
      },
      {
        "id": "twin-covenant-botanical-foreign-delegation-western",
        "kind": "guest-area",
        "rect": [
          7,
          22,
          34,
          30
        ]
      },
      {
        "id": "twin-covenant-botanical-foreign-delegation-eastern",
        "kind": "consular-office",
        "rect": [
          64,
          31,
          90,
          39
        ]
      },
      {
        "id": "twin-covenant-botanical-foreign-delegation-northwest",
        "kind": "treaty-archive",
        "rect": [
          30,
          56,
          37,
          72
        ]
      },
      {
        "id": "twin-covenant-botanical-foreign-delegation-northeast",
        "kind": "hospitality",
        "rect": [
          61,
          56,
          68,
          72
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          41,
          10,
          57,
          23
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          22,
          35,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          63,
          31,
          90,
          41
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          31,
          57,
          37,
          72
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          61,
          57,
          67,
          72
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "twin-covenant-botanical-foreign-delegation",
      99,
      15,
      84
    ],
    "profile": "twin-covenant-botanical-foreign-delegation",
    "sourceAuthoredName": "Ivyshore Covenant House"
  },
  {
    "id": "r4:embassy:desert:small:03",
    "type": "embassy",
    "biome": "desert",
    "size": "small",
    "variant": 3,
    "bounds": [
      60,
      15,
      72
    ],
    "wings": [
      [
        18,
        7,
        42,
        28
      ],
      [
        3,
        23,
        21,
        49
      ],
      [
        39,
        16,
        56,
        48
      ],
      [
        22,
        23,
        38,
        52
      ],
      [
        8,
        45,
        52,
        67
      ],
      [
        18,
        23,
        25,
        35
      ],
      [
        35,
        16,
        42,
        28
      ],
      [
        45,
        43,
        57,
        61
      ]
    ],
    "notches": [
      [
        24,
        54,
        36,
        67
      ],
      [
        20,
        49,
        40,
        67
      ]
    ],
    "octagons": [
      [
        9,
        45,
        7,
        10
      ],
      [
        50,
        43,
        7,
        10
      ]
    ],
    "skyline": [
      [
        25,
        12,
        35,
        18,
        12
      ],
      [
        9,
        32,
        13,
        36,
        10
      ],
      [
        44,
        25,
        48,
        29,
        11
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
        "fixed": 25,
        "from": 22,
        "to": 38,
        "door": 30,
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
        39,
        7,
        "north"
      ],
      [
        3,
        32,
        "west"
      ],
      [
        56,
        25,
        "east"
      ],
      [
        12,
        67,
        "south"
      ],
      [
        48,
        67,
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
        35
      ],
      [
        50,
        28
      ],
      [
        15,
        53
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "zigzag-dune-trade-embassy-sun-court-entry",
        "kind": "formal-chamber",
        "rect": [
          23,
          10,
          37,
          18
        ]
      },
      {
        "id": "zigzag-dune-trade-embassy-sun-court-western",
        "kind": "guest-area",
        "rect": [
          7,
          30,
          15,
          38
        ]
      },
      {
        "id": "zigzag-dune-trade-embassy-sun-court-eastern",
        "kind": "consular-office",
        "rect": [
          45,
          23,
          51,
          31
        ]
      },
      {
        "id": "zigzag-dune-trade-embassy-sun-court-northwest",
        "kind": "treaty-archive",
        "rect": [
          11,
          48,
          18,
          60
        ]
      },
      {
        "id": "zigzag-dune-trade-embassy-sun-court-northeast",
        "kind": "hospitality",
        "rect": [
          42,
          48,
          49,
          60
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          22,
          10,
          38,
          23
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          30,
          16,
          40
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          44,
          23,
          51,
          33
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          12,
          49,
          18,
          60
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          42,
          49,
          48,
          60
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "zigzag-dune-trade-embassy-sun-court",
      60,
      15,
      72
    ],
    "profile": "zigzag-dune-trade-embassy-sun-court",
    "sourceAuthoredName": "Sunstep Trade Consulate"
  },
  {
    "id": "r4:embassy:snow:small:03",
    "type": "embassy",
    "biome": "snow",
    "size": "small",
    "variant": 3,
    "bounds": [
      58,
      15,
      79
    ],
    "wings": [
      [
        17,
        7,
        41,
        28
      ],
      [
        3,
        17,
        20,
        55
      ],
      [
        38,
        26,
        54,
        55
      ],
      [
        21,
        23,
        37,
        58
      ],
      [
        7,
        51,
        51,
        74
      ],
      [
        17,
        17,
        24,
        29
      ],
      [
        34,
        26,
        41,
        38
      ],
      [
        2,
        50,
        14,
        69
      ]
    ],
    "notches": [
      [
        23,
        63,
        35,
        74
      ]
    ],
    "octagons": [
      [
        9,
        51,
        7,
        10
      ],
      [
        48,
        50,
        7,
        10
      ]
    ],
    "skyline": [
      [
        24,
        12,
        34,
        18,
        11
      ],
      [
        9,
        26,
        13,
        30,
        12
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
        "fixed": 25,
        "from": 21,
        "to": 37,
        "door": 29,
        "facing": "north"
      }
    ],
    "windows": [
      [
        20,
        7,
        "north"
      ],
      [
        38,
        7,
        "north"
      ],
      [
        3,
        26,
        "west"
      ],
      [
        54,
        35,
        "east"
      ],
      [
        11,
        74,
        "south"
      ],
      [
        47,
        74,
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
        29
      ],
      [
        48,
        38
      ],
      [
        14,
        59
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "frost-recessed-west-guest-hall-entry",
        "kind": "formal-chamber",
        "rect": [
          22,
          10,
          36,
          18
        ]
      },
      {
        "id": "frost-recessed-west-guest-hall-western",
        "kind": "guest-area",
        "rect": [
          7,
          24,
          14,
          32
        ]
      },
      {
        "id": "frost-recessed-west-guest-hall-eastern",
        "kind": "consular-office",
        "rect": [
          44,
          33,
          49,
          41
        ]
      },
      {
        "id": "frost-recessed-west-guest-hall-northwest",
        "kind": "treaty-archive",
        "rect": [
          10,
          54,
          17,
          67
        ]
      },
      {
        "id": "frost-recessed-west-guest-hall-northeast",
        "kind": "hospitality",
        "rect": [
          41,
          54,
          48,
          67
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          21,
          10,
          37,
          23
        ],
        "profile": "shed",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          24,
          15,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          43,
          33,
          49,
          43
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          11,
          55,
          17,
          67
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          41,
          55,
          47,
          67
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "frost-recessed-west-guest-hall",
      58,
      15,
      79
    ],
    "profile": "frost-recessed-west-guest-hall",
    "sourceAuthoredName": "Frostpine Northern Delegation"
  },
  {
    "id": "r4:grand-archive:temperate:large:03",
    "type": "grand-archive",
    "biome": "temperate",
    "size": "large",
    "variant": 3,
    "bounds": [
      98,
      15,
      101
    ],
    "wings": [
      [
        37,
        7,
        61,
        28
      ],
      [
        3,
        22,
        40,
        75
      ],
      [
        58,
        31,
        94,
        67
      ],
      [
        41,
        23,
        57,
        71
      ],
      [
        27,
        64,
        71,
        96
      ],
      [
        37,
        22,
        44,
        34
      ],
      [
        54,
        31,
        61,
        43
      ],
      [
        2,
        70,
        34,
        91
      ]
    ],
    "notches": [
      [
        43,
        78,
        55,
        96
      ]
    ],
    "octagons": [
      [
        9,
        71,
        7,
        10
      ],
      [
        88,
        62,
        7,
        10
      ]
    ],
    "skyline": [
      [
        44,
        12,
        54,
        18,
        12
      ],
      [
        9,
        31,
        13,
        35,
        11
      ]
    ],
    "entry": [
      49,
      7
    ],
    "porch": [
      46,
      3,
      52,
      6
    ],
    "partitions": [
      {
        "axis": "z",
        "fixed": 25,
        "from": 41,
        "to": 57,
        "door": 49,
        "facing": "north"
      }
    ],
    "windows": [
      [
        40,
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
        31,
        "west"
      ],
      [
        94,
        40,
        "east"
      ],
      [
        31,
        96,
        "south"
      ],
      [
        67,
        96,
        "south"
      ]
    ],
    "fixtures": [
      [
        49,
        15
      ],
      [
        9,
        34
      ],
      [
        88,
        43
      ],
      [
        34,
        72
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "three-register-wings-wide-public-research-courtyard-entry",
        "kind": "consultation-room",
        "rect": [
          42,
          10,
          56,
          18
        ]
      },
      {
        "id": "three-register-wings-wide-public-research-courtyard-western",
        "kind": "scriptorium",
        "rect": [
          7,
          29,
          34,
          37
        ]
      },
      {
        "id": "three-register-wings-wide-public-research-courtyard-eastern",
        "kind": "cataloguing",
        "rect": [
          64,
          38,
          89,
          46
        ]
      },
      {
        "id": "three-register-wings-wide-public-research-courtyard-northwest",
        "kind": "records-vault",
        "rect": [
          30,
          67,
          37,
          89
        ]
      },
      {
        "id": "three-register-wings-wide-public-research-courtyard-northeast",
        "kind": "copying-gallery",
        "rect": [
          61,
          67,
          68,
          89
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          41,
          10,
          57,
          23
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          29,
          35,
          39
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          63,
          38,
          89,
          48
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          31,
          68,
          37,
          89
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          61,
          68,
          67,
          89
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "three-register-wings-wide-public-research-courtyard",
      98,
      15,
      101
    ],
    "profile": "three-register-wings-wide-public-research-courtyard",
    "sourceAuthoredName": "Highwater Three Register Archive"
  },
  {
    "id": "r4:grand-archive:snow:small:03",
    "type": "grand-archive",
    "biome": "snow",
    "size": "small",
    "variant": 3,
    "bounds": [
      60,
      15,
      74
    ],
    "wings": [
      [
        18,
        7,
        42,
        28
      ],
      [
        3,
        14,
        21,
        47
      ],
      [
        39,
        25,
        56,
        52
      ],
      [
        22,
        23,
        38,
        52
      ],
      [
        8,
        45,
        52,
        69
      ],
      [
        18,
        14,
        25,
        26
      ],
      [
        35,
        25,
        42,
        37
      ],
      [
        45,
        47,
        57,
        63
      ]
    ],
    "notches": [
      [
        24,
        58,
        36,
        69
      ],
      [
        21,
        54,
        39,
        69
      ]
    ],
    "octagons": [
      [
        9,
        43,
        7,
        10
      ],
      [
        50,
        47,
        7,
        10
      ]
    ],
    "skyline": [
      [
        25,
        12,
        35,
        18,
        11
      ],
      [
        9,
        23,
        13,
        27,
        13
      ],
      [
        44,
        34,
        48,
        38,
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
        "fixed": 25,
        "from": 22,
        "to": 38,
        "door": 30,
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
        39,
        7,
        "north"
      ],
      [
        3,
        23,
        "west"
      ],
      [
        56,
        34,
        "east"
      ],
      [
        12,
        69,
        "south"
      ],
      [
        48,
        69,
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
        26
      ],
      [
        50,
        37
      ],
      [
        15,
        53
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "snowbelt-asymmetric-ink-vault-and-library-entry",
        "kind": "consultation-room",
        "rect": [
          23,
          10,
          37,
          18
        ]
      },
      {
        "id": "snowbelt-asymmetric-ink-vault-and-library-western",
        "kind": "scriptorium",
        "rect": [
          7,
          21,
          15,
          29
        ]
      },
      {
        "id": "snowbelt-asymmetric-ink-vault-and-library-eastern",
        "kind": "cataloguing",
        "rect": [
          45,
          32,
          51,
          40
        ]
      },
      {
        "id": "snowbelt-asymmetric-ink-vault-and-library-northwest",
        "kind": "records-vault",
        "rect": [
          11,
          48,
          18,
          62
        ]
      },
      {
        "id": "snowbelt-asymmetric-ink-vault-and-library-northeast",
        "kind": "copying-gallery",
        "rect": [
          42,
          48,
          49,
          62
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          22,
          10,
          38,
          23
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          21,
          16,
          31
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          44,
          32,
          51,
          42
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          12,
          49,
          18,
          62
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          42,
          49,
          48,
          62
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "snowbelt-asymmetric-ink-vault-and-library",
      60,
      15,
      74
    ],
    "profile": "snowbelt-asymmetric-ink-vault-and-library",
    "sourceAuthoredName": "Whiteshade Sealed Scroll Vault"
  },
  {
    "id": "r4:grand-archive:mountain:small:03",
    "type": "grand-archive",
    "biome": "mountain",
    "size": "small",
    "variant": 3,
    "bounds": [
      61,
      15,
      82
    ],
    "wings": [
      [
        18,
        7,
        42,
        28
      ],
      [
        3,
        25,
        21,
        61
      ],
      [
        39,
        17,
        57,
        56
      ],
      [
        22,
        23,
        38,
        63
      ],
      [
        8,
        56,
        52,
        77
      ],
      [
        18,
        25,
        25,
        37
      ],
      [
        35,
        17,
        42,
        29
      ],
      [
        2,
        56,
        15,
        72
      ]
    ],
    "notches": [
      [
        24,
        63,
        36,
        77
      ]
    ],
    "octagons": [
      [
        9,
        57,
        7,
        10
      ],
      [
        51,
        51,
        7,
        10
      ]
    ],
    "skyline": [
      [
        25,
        12,
        35,
        18,
        13
      ],
      [
        9,
        34,
        13,
        38,
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
        "fixed": 25,
        "from": 22,
        "to": 38,
        "door": 30,
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
        39,
        7,
        "north"
      ],
      [
        3,
        34,
        "west"
      ],
      [
        57,
        26,
        "east"
      ],
      [
        12,
        77,
        "south"
      ],
      [
        48,
        77,
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
        37
      ],
      [
        51,
        29
      ],
      [
        15,
        64
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "cliffside-split-index-two-tall-witness-piers-entry",
        "kind": "consultation-room",
        "rect": [
          23,
          10,
          37,
          18
        ]
      },
      {
        "id": "cliffside-split-index-two-tall-witness-piers-western",
        "kind": "scriptorium",
        "rect": [
          7,
          32,
          15,
          40
        ]
      },
      {
        "id": "cliffside-split-index-two-tall-witness-piers-eastern",
        "kind": "cataloguing",
        "rect": [
          45,
          24,
          52,
          32
        ]
      },
      {
        "id": "cliffside-split-index-two-tall-witness-piers-northwest",
        "kind": "records-vault",
        "rect": [
          11,
          59,
          18,
          70
        ]
      },
      {
        "id": "cliffside-split-index-two-tall-witness-piers-northeast",
        "kind": "copying-gallery",
        "rect": [
          42,
          59,
          49,
          70
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          22,
          10,
          38,
          23
        ],
        "profile": "saw",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          32,
          16,
          42
        ],
        "profile": "gable",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          44,
          24,
          52,
          34
        ],
        "profile": "shed",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          12,
          60,
          18,
          70
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          42,
          60,
          48,
          70
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "cliffside-split-index-two-tall-witness-piers",
      61,
      15,
      82
    ],
    "profile": "cliffside-split-index-two-tall-witness-piers",
    "sourceAuthoredName": "Stonevein Split Ledger Repository"
  },
  {
    "id": "r4:observatory:desert:medium:03",
    "type": "observatory",
    "biome": "desert",
    "size": "medium",
    "variant": 3,
    "bounds": [
      82,
      15,
      91
    ],
    "wings": [
      [
        29,
        7,
        53,
        28
      ],
      [
        3,
        17,
        32,
        66
      ],
      [
        50,
        31,
        78,
        60
      ],
      [
        33,
        23,
        49,
        63
      ],
      [
        19,
        56,
        63,
        86
      ],
      [
        29,
        17,
        36,
        29
      ],
      [
        46,
        31,
        53,
        43
      ],
      [
        2,
        61,
        26,
        81
      ],
      [
        56,
        55,
        79,
        80
      ]
    ],
    "notches": [
      [
        35,
        70,
        47,
        86
      ]
    ],
    "octagons": [
      [
        9,
        62,
        7,
        10
      ],
      [
        72,
        55,
        7,
        10
      ]
    ],
    "skyline": [
      [
        36,
        12,
        46,
        18,
        13
      ],
      [
        9,
        26,
        13,
        30,
        11
      ],
      [
        66,
        40,
        70,
        44,
        12
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
        "north"
      ],
      [
        50,
        7,
        "north"
      ],
      [
        3,
        26,
        "west"
      ],
      [
        78,
        40,
        "east"
      ],
      [
        23,
        86,
        "south"
      ],
      [
        59,
        86,
        "south"
      ]
    ],
    "fixtures": [
      [
        41,
        15
      ],
      [
        9,
        29
      ],
      [
        72,
        43
      ],
      [
        26,
        64
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "sunspire-asymmetric-zenith-terraces-entry",
        "kind": "instrument-room",
        "rect": [
          34,
          10,
          48,
          18
        ]
      },
      {
        "id": "sunspire-asymmetric-zenith-terraces-western",
        "kind": "star-charts",
        "rect": [
          7,
          24,
          26,
          32
        ]
      },
      {
        "id": "sunspire-asymmetric-zenith-terraces-eastern",
        "kind": "lens-workshop",
        "rect": [
          56,
          38,
          73,
          46
        ]
      },
      {
        "id": "sunspire-asymmetric-zenith-terraces-northwest",
        "kind": "observation-deck",
        "rect": [
          22,
          59,
          29,
          79
        ]
      },
      {
        "id": "sunspire-asymmetric-zenith-terraces-northeast",
        "kind": "public-lecture",
        "rect": [
          53,
          59,
          60,
          79
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          33,
          10,
          49,
          23
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          24,
          27,
          34
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          55,
          38,
          73,
          48
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          23,
          60,
          29,
          79
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          53,
          60,
          59,
          79
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "sunspire-asymmetric-zenith-terraces",
      82,
      15,
      91
    ],
    "profile": "sunspire-asymmetric-zenith-terraces",
    "sourceAuthoredName": "Asterdune Zenith Spire Observatory"
  },
  {
    "id": "r4:observatory:mountain:large:03",
    "type": "observatory",
    "biome": "mountain",
    "size": "large",
    "variant": 3,
    "bounds": [
      108,
      15,
      102
    ],
    "wings": [
      [
        42,
        7,
        66,
        28
      ],
      [
        3,
        27,
        45,
        73
      ],
      [
        63,
        19,
        104,
        71
      ],
      [
        46,
        23,
        62,
        74
      ],
      [
        32,
        67,
        76,
        97
      ],
      [
        42,
        27,
        49,
        39
      ],
      [
        59,
        19,
        66,
        31
      ],
      [
        2,
        68,
        39,
        92
      ],
      [
        69,
        66,
        105,
        91
      ]
    ],
    "notches": [
      [
        48,
        79,
        60,
        97
      ]
    ],
    "octagons": [
      [
        9,
        69,
        7,
        10
      ],
      [
        98,
        66,
        7,
        10
      ]
    ],
    "skyline": [
      [
        49,
        12,
        59,
        18,
        12
      ],
      [
        9,
        36,
        13,
        40,
        13
      ],
      [
        92,
        28,
        96,
        32,
        11
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
        "from": 46,
        "to": 62,
        "door": 54,
        "facing": "north"
      }
    ],
    "windows": [
      [
        45,
        7,
        "north"
      ],
      [
        63,
        7,
        "north"
      ],
      [
        3,
        36,
        "west"
      ],
      [
        104,
        28,
        "east"
      ],
      [
        36,
        97,
        "south"
      ],
      [
        72,
        97,
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
        39
      ],
      [
        98,
        31
      ],
      [
        39,
        75
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "split-peaks-mountain-observing-deck-twin-wings-entry",
        "kind": "instrument-room",
        "rect": [
          47,
          10,
          61,
          18
        ]
      },
      {
        "id": "split-peaks-mountain-observing-deck-twin-wings-western",
        "kind": "star-charts",
        "rect": [
          7,
          34,
          39,
          42
        ]
      },
      {
        "id": "split-peaks-mountain-observing-deck-twin-wings-eastern",
        "kind": "lens-workshop",
        "rect": [
          69,
          26,
          99,
          34
        ]
      },
      {
        "id": "split-peaks-mountain-observing-deck-twin-wings-northwest",
        "kind": "observation-deck",
        "rect": [
          35,
          70,
          42,
          90
        ]
      },
      {
        "id": "split-peaks-mountain-observing-deck-twin-wings-northeast",
        "kind": "public-lecture",
        "rect": [
          66,
          70,
          73,
          90
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          46,
          10,
          62,
          23
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          34,
          40,
          44
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          68,
          26,
          99,
          36
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          36,
          71,
          42,
          90
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          66,
          71,
          72,
          90
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "split-peaks-mountain-observing-deck-twin-wings",
      108,
      15,
      102
    ],
    "profile": "split-peaks-mountain-observing-deck-twin-wings",
    "sourceAuthoredName": "Cloudbreak Split Peaks Observatory"
  },
  {
    "id": "r4:observatory:temperate:small:03",
    "type": "observatory",
    "biome": "temperate",
    "size": "small",
    "variant": 3,
    "bounds": [
      61,
      15,
      69
    ],
    "wings": [
      [
        18,
        7,
        42,
        28
      ],
      [
        3,
        14,
        21,
        47
      ],
      [
        39,
        23,
        57,
        51
      ],
      [
        22,
        23,
        38,
        50
      ],
      [
        8,
        43,
        52,
        64
      ],
      [
        18,
        14,
        25,
        26
      ],
      [
        35,
        23,
        42,
        35
      ],
      [
        45,
        46,
        58,
        58
      ]
    ],
    "notches": [
      [
        24,
        54,
        36,
        64
      ]
    ],
    "octagons": [
      [
        9,
        43,
        7,
        10
      ],
      [
        51,
        46,
        7,
        10
      ]
    ],
    "skyline": [
      [
        25,
        12,
        35,
        18,
        11
      ],
      [
        9,
        23,
        13,
        27,
        10
      ],
      [
        45,
        32,
        49,
        36,
        13
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
        "fixed": 25,
        "from": 22,
        "to": 38,
        "door": 30,
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
        39,
        7,
        "north"
      ],
      [
        3,
        23,
        "west"
      ],
      [
        57,
        32,
        "east"
      ],
      [
        12,
        64,
        "south"
      ],
      [
        48,
        64,
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
        26
      ],
      [
        51,
        35
      ],
      [
        15,
        51
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "lakeside-stepback-star-mirror-tower-entry",
        "kind": "instrument-room",
        "rect": [
          23,
          10,
          37,
          18
        ]
      },
      {
        "id": "lakeside-stepback-star-mirror-tower-western",
        "kind": "star-charts",
        "rect": [
          7,
          21,
          15,
          29
        ]
      },
      {
        "id": "lakeside-stepback-star-mirror-tower-eastern",
        "kind": "lens-workshop",
        "rect": [
          45,
          30,
          52,
          38
        ]
      },
      {
        "id": "lakeside-stepback-star-mirror-tower-northwest",
        "kind": "observation-deck",
        "rect": [
          11,
          46,
          18,
          57
        ]
      },
      {
        "id": "lakeside-stepback-star-mirror-tower-northeast",
        "kind": "public-lecture",
        "rect": [
          42,
          46,
          49,
          57
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          22,
          10,
          38,
          23
        ],
        "profile": "hip",
        "axis": "x",
        "high": 12,
        "period": 4
      },
      {
        "rect": [
          6,
          21,
          16,
          31
        ],
        "profile": "shed",
        "axis": "z",
        "high": 11,
        "period": 5
      },
      {
        "rect": [
          44,
          30,
          52,
          40
        ],
        "profile": "saw",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          12,
          47,
          18,
          57
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          42,
          47,
          48,
          57
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "lakeside-stepback-star-mirror-tower",
      61,
      15,
      69
    ],
    "profile": "lakeside-stepback-star-mirror-tower",
    "sourceAuthoredName": "Mirrorlake Starwatch House"
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
export function buildA2Wave2StateKnowledge(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown Roadmap A2 source-authored state-knowledge plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allA2Wave2StateKnowledge(){return PLANS.map(author);}
export const A2_WAVE2_STATE_KNOWLEDGE_IDS=Object.freeze(PLANS.map(p=>p.id));
