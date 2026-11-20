// Builder 4A M2 regional architecture — eight independently designed regional chambers and crafts halls.
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
    "id": "r4:civic-hall:temperate:large:05",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "large",
    "variant": 5,
    "bounds": [
      82,
      12,
      66
    ],
    "wings": [
      [
        30,
        7,
        48,
        27
      ],
      [
        5,
        20,
        29,
        40
      ],
      [
        47,
        15,
        69,
        35
      ],
      [
        19,
        46,
        58,
        59
      ],
      [
        21,
        26,
        53,
        34
      ],
      [
        20,
        34,
        32,
        49
      ],
      [
        43,
        33,
        53,
        47
      ],
      [
        32,
        33,
        44,
        45
      ],
      [
        67,
        33,
        78,
        54
      ],
      [
        8,
        39,
        19,
        56
      ]
    ],
    "octagons": [],
    "notches": [
      [
        36,
        36,
        41,
        42
      ]
    ],
    "entry": [
      39,
      7
    ],
    "porch": [
      36,
      3,
      42,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 30,
        "from": 24,
        "to": 28,
        "door": 26,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 47,
        "from": 21,
        "to": 28,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 46,
        "from": 23,
        "to": 31,
        "door": 26,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        29,
        "west"
      ],
      [
        69,
        23,
        "east"
      ],
      [
        38,
        59,
        "north"
      ],
      [
        35,
        7,
        "south"
      ],
      [
        43,
        7,
        "south"
      ],
      [
        78,
        44,
        "east"
      ],
      [
        8,
        47,
        "west"
      ]
    ],
    "fixtures": [
      [
        39,
        14
      ],
      [
        13,
        30
      ],
      [
        60,
        24
      ],
      [
        38,
        55
      ],
      [
        72,
        45
      ],
      [
        13,
        47
      ],
      [
        28,
        38
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "confluence-legislature",
        "kind": "meeting",
        "rect": [
          32,
          10,
          46,
          23
        ]
      },
      {
        "id": "western-millwater-grievances",
        "kind": "administration",
        "rect": [
          8,
          23,
          26,
          36
        ]
      },
      {
        "id": "eastern-floodplain-lease-office",
        "kind": "registry",
        "rect": [
          51,
          18,
          67,
          32
        ]
      },
      {
        "id": "northern-causeway-hearings",
        "kind": "public-hearing",
        "rect": [
          22,
          50,
          56,
          58
        ]
      },
      {
        "id": "eastern-lockkeepers-chamber",
        "kind": "records",
        "rect": [
          70,
          37,
          77,
          52
        ]
      },
      {
        "id": "western-drainage-archive",
        "kind": "civic-archive",
        "rect": [
          10,
          44,
          17,
          54
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          32,
          9,
          47,
          23
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          23,
          27,
          37
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          51,
          18,
          67,
          33
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          22,
          49,
          56,
          58
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          70,
          37,
          77,
          53
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          10,
          43,
          17,
          55
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "temperate-confluence-star-shaped-council",
      82,
      12,
      66
    ],
    "profile": "temperate-confluence-star-shaped-council"
  },
  {
    "id": "r4:civic-hall:desert:small:05",
    "type": "civic-hall",
    "biome": "desert",
    "size": "small",
    "variant": 5,
    "bounds": [
      51,
      12,
      47
    ],
    "wings": [
      [
        18,
        7,
        32,
        22
      ],
      [
        5,
        16,
        17,
        35
      ],
      [
        31,
        22,
        47,
        38
      ],
      [
        13,
        36,
        40,
        43
      ],
      [
        15,
        21,
        39,
        30
      ],
      [
        19,
        29,
        27,
        38
      ],
      [
        34,
        29,
        41,
        39
      ],
      [
        3,
        33,
        12,
        44
      ]
    ],
    "octagons": [],
    "notches": [
      [
        24,
        25,
        27,
        29
      ]
    ],
    "entry": [
      25,
      7
    ],
    "porch": [
      22,
      3,
      28,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 17,
        "from": 22,
        "to": 26,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 31,
        "from": 22,
        "to": 28,
        "door": 25,
        "facing": "east"
      }
    ],
    "windows": [
      [
        5,
        24,
        "west"
      ],
      [
        47,
        28,
        "east"
      ],
      [
        26,
        43,
        "north"
      ],
      [
        21,
        7,
        "south"
      ],
      [
        29,
        7,
        "south"
      ],
      [
        3,
        39,
        "west"
      ]
    ],
    "fixtures": [
      [
        25,
        14
      ],
      [
        10,
        24
      ],
      [
        41,
        28
      ],
      [
        25,
        40
      ],
      [
        7,
        39
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "well-rights-hearing",
        "kind": "meeting",
        "rect": [
          20,
          10,
          30,
          20
        ]
      },
      {
        "id": "salt-district-appeals",
        "kind": "administration",
        "rect": [
          7,
          19,
          15,
          33
        ]
      },
      {
        "id": "east-mirage-toll-office",
        "kind": "registry",
        "rect": [
          34,
          25,
          45,
          35
        ]
      },
      {
        "id": "north-oasis-treaty-room",
        "kind": "public-hearing",
        "rect": [
          16,
          39,
          38,
          42
        ]
      },
      {
        "id": "west-date-palm-court",
        "kind": "records",
        "rect": [
          5,
          37,
          10,
          42
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          20,
          9,
          30,
          21
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          19,
          15,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          34,
          25,
          45,
          35
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          16,
          39,
          38,
          42
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          37,
          10,
          42
        ],
        "profile": "shed",
        "axis": "z",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "desert-west-oasis-escutcheon-court",
      51,
      12,
      47
    ],
    "profile": "desert-west-oasis-escutcheon-court"
  },
  {
    "id": "r4:civic-hall:snow:large:05",
    "type": "civic-hall",
    "biome": "snow",
    "size": "large",
    "variant": 5,
    "bounds": [
      85,
      12,
      68
    ],
    "wings": [
      [
        31,
        7,
        51,
        26
      ],
      [
        5,
        16,
        29,
        43
      ],
      [
        51,
        20,
        76,
        41
      ],
      [
        17,
        47,
        62,
        61
      ],
      [
        23,
        26,
        61,
        34
      ],
      [
        20,
        34,
        32,
        49
      ],
      [
        48,
        34,
        58,
        49
      ],
      [
        33,
        32,
        49,
        46
      ],
      [
        72,
        40,
        82,
        57
      ],
      [
        7,
        41,
        19,
        58
      ]
    ],
    "octagons": [],
    "notches": [
      [
        37,
        36,
        43,
        42
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
        "axis": "x",
        "fixed": 51,
        "from": 22,
        "to": 28,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 47,
        "from": 24,
        "to": 31,
        "door": 26,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        28,
        "west"
      ],
      [
        76,
        27,
        "east"
      ],
      [
        40,
        61,
        "north"
      ],
      [
        36,
        7,
        "south"
      ],
      [
        46,
        7,
        "south"
      ],
      [
        82,
        47,
        "east"
      ],
      [
        7,
        50,
        "west"
      ]
    ],
    "fixtures": [
      [
        41,
        14
      ],
      [
        15,
        28
      ],
      [
        65,
        28
      ],
      [
        40,
        57
      ],
      [
        77,
        48
      ],
      [
        13,
        50
      ],
      [
        53,
        41
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "frostgate-principal-council",
        "kind": "meeting",
        "rect": [
          33,
          10,
          49,
          23
        ]
      },
      {
        "id": "western-icebreak-claims",
        "kind": "administration",
        "rect": [
          8,
          20,
          26,
          39
        ]
      },
      {
        "id": "eastern-snowway-registry",
        "kind": "registry",
        "rect": [
          55,
          24,
          72,
          38
        ]
      },
      {
        "id": "northern-winter-assembly",
        "kind": "public-hearing",
        "rect": [
          20,
          51,
          60,
          60
        ]
      },
      {
        "id": "outer-east-lantern-survey",
        "kind": "records",
        "rect": [
          74,
          44,
          80,
          56
        ]
      },
      {
        "id": "western-storm-chronicle",
        "kind": "civic-archive",
        "rect": [
          9,
          47,
          17,
          56
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          33,
          9,
          49,
          22
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          8,
          20,
          26,
          39
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          55,
          24,
          72,
          38
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          20,
          51,
          60,
          60
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          74,
          44,
          80,
          56
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          9,
          47,
          17,
          56
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "snow-long-stormgate-assembly-with-east-spire",
      85,
      12,
      68
    ],
    "profile": "snow-long-stormgate-assembly-with-east-spire"
  },
  {
    "id": "r4:civic-hall:enchanted-forest:medium:05",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 5,
    "bounds": [
      68,
      12,
      57
    ],
    "wings": [
      [
        27,
        7,
        42,
        25
      ],
      [
        7,
        19,
        26,
        42
      ],
      [
        43,
        16,
        61,
        34
      ],
      [
        19,
        42,
        49,
        52
      ],
      [
        21,
        24,
        55,
        31
      ],
      [
        19,
        31,
        30,
        45
      ],
      [
        42,
        31,
        51,
        46
      ],
      [
        30,
        30,
        42,
        43
      ],
      [
        55,
        34,
        65,
        50
      ],
      [
        4,
        38,
        15,
        49
      ]
    ],
    "octagons": [],
    "notches": [
      [
        33,
        34,
        39,
        40
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
        "axis": "x",
        "fixed": 26,
        "from": 23,
        "to": 27,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 43,
        "from": 22,
        "to": 28,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 42,
        "from": 22,
        "to": 29,
        "door": 25,
        "facing": "north"
      }
    ],
    "windows": [
      [
        7,
        28,
        "west"
      ],
      [
        61,
        25,
        "east"
      ],
      [
        32,
        52,
        "north"
      ],
      [
        30,
        7,
        "south"
      ],
      [
        39,
        7,
        "south"
      ],
      [
        65,
        43,
        "east"
      ],
      [
        4,
        44,
        "west"
      ]
    ],
    "fixtures": [
      [
        34,
        14
      ],
      [
        13,
        28
      ],
      [
        53,
        26
      ],
      [
        33,
        49
      ],
      [
        60,
        43
      ],
      [
        10,
        44
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "bough-compact-assembly",
        "kind": "meeting",
        "rect": [
          29,
          10,
          40,
          21
        ]
      },
      {
        "id": "west-spore-witness",
        "kind": "administration",
        "rect": [
          9,
          22,
          24,
          38
        ]
      },
      {
        "id": "east-nightbloom-statutes",
        "kind": "registry",
        "rect": [
          46,
          20,
          59,
          31
        ]
      },
      {
        "id": "north-glade-bond-court",
        "kind": "public-hearing",
        "rect": [
          22,
          46,
          47,
          51
        ]
      },
      {
        "id": "eastern-fairyland-inspector",
        "kind": "records",
        "rect": [
          58,
          38,
          63,
          49
        ]
      },
      {
        "id": "western-pollen-archive",
        "kind": "civic-archive",
        "rect": [
          6,
          42,
          13,
          48
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          29,
          9,
          40,
          22
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          9,
          22,
          24,
          38
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          46,
          20,
          59,
          31
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          22,
          46,
          47,
          51
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          58,
          38,
          63,
          49
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "forest-nightbloom-double-witnessed-hall",
      68,
      12,
      57
    ],
    "profile": "forest-nightbloom-double-witnessed-hall"
  },
  {
    "id": "r4:guildhall:temperate:medium:04",
    "type": "guildhall",
    "biome": "temperate",
    "size": "medium",
    "variant": 4,
    "bounds": [
      66,
      12,
      57
    ],
    "wings": [
      [
        24,
        7,
        40,
        25
      ],
      [
        5,
        19,
        23,
        38
      ],
      [
        41,
        17,
        60,
        33
      ],
      [
        17,
        44,
        50,
        53
      ],
      [
        20,
        24,
        48,
        31
      ],
      [
        20,
        30,
        30,
        45
      ],
      [
        39,
        30,
        48,
        46
      ],
      [
        29,
        32,
        40,
        42
      ],
      [
        53,
        32,
        64,
        49
      ],
      [
        3,
        34,
        14,
        50
      ]
    ],
    "octagons": [],
    "notches": [
      [
        33,
        34,
        37,
        39
      ]
    ],
    "entry": [
      32,
      7
    ],
    "porch": [
      29,
      3,
      35,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 23,
        "from": 23,
        "to": 28,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 41,
        "from": 22,
        "to": 27,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 44,
        "from": 22,
        "to": 29,
        "door": 25,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        28,
        "west"
      ],
      [
        60,
        24,
        "east"
      ],
      [
        32,
        53,
        "north"
      ],
      [
        28,
        7,
        "south"
      ],
      [
        36,
        7,
        "south"
      ],
      [
        64,
        40,
        "east"
      ],
      [
        3,
        45,
        "west"
      ]
    ],
    "fixtures": [
      [
        32,
        14
      ],
      [
        10,
        28
      ],
      [
        52,
        25
      ],
      [
        33,
        49
      ],
      [
        60,
        40
      ],
      [
        25,
        35
      ],
      [
        9,
        46
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "canal-millers-conclave",
        "kind": "gathering-hall",
        "rect": [
          26,
          10,
          38,
          21
        ]
      },
      {
        "id": "western-waterwheel-carpentry",
        "kind": "shared-facility",
        "rect": [
          8,
          22,
          20,
          35
        ]
      },
      {
        "id": "eastern-barge-machinery",
        "kind": "workshop",
        "rect": [
          44,
          20,
          58,
          31
        ]
      },
      {
        "id": "north-guild-permits",
        "kind": "guild-ledger",
        "rect": [
          20,
          47,
          47,
          52
        ]
      },
      {
        "id": "eastern-waterclock-workshop",
        "kind": "artisan-study",
        "rect": [
          56,
          36,
          62,
          47
        ]
      },
      {
        "id": "west-lock-waterclock-calibration",
        "kind": "artisan-study",
        "rect": [
          5,
          42,
          12,
          48
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          26,
          9,
          38,
          21
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          22,
          20,
          35
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          44,
          20,
          58,
          31
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          20,
          47,
          47,
          52
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          56,
          36,
          62,
          47
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          42,
          12,
          48
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "temperate-branching-river-millwrights-guild",
      66,
      12,
      57
    ],
    "profile": "temperate-branching-river-millwrights-guild"
  },
  {
    "id": "r4:guildhall:snow:medium:04",
    "type": "guildhall",
    "biome": "snow",
    "size": "medium",
    "variant": 4,
    "bounds": [
      67,
      12,
      58
    ],
    "wings": [
      [
        27,
        7,
        41,
        24
      ],
      [
        5,
        16,
        26,
        40
      ],
      [
        42,
        21,
        61,
        40
      ],
      [
        18,
        43,
        52,
        54
      ],
      [
        21,
        24,
        52,
        32
      ],
      [
        20,
        31,
        30,
        45
      ],
      [
        40,
        30,
        50,
        45
      ],
      [
        30,
        31,
        41,
        42
      ],
      [
        3,
        36,
        16,
        51
      ],
      [
        56,
        35,
        65,
        54
      ]
    ],
    "octagons": [],
    "notches": [
      [
        32,
        34,
        38,
        40
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
        "axis": "x",
        "fixed": 26,
        "from": 23,
        "to": 27,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 42,
        "from": 23,
        "to": 28,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 43,
        "from": 22,
        "to": 29,
        "door": 25,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        27,
        "west"
      ],
      [
        61,
        29,
        "east"
      ],
      [
        33,
        54,
        "north"
      ],
      [
        30,
        7,
        "south"
      ],
      [
        38,
        7,
        "south"
      ],
      [
        3,
        44,
        "west"
      ],
      [
        65,
        46,
        "east"
      ]
    ],
    "fixtures": [
      [
        34,
        14
      ],
      [
        12,
        25
      ],
      [
        54,
        30
      ],
      [
        33,
        51
      ],
      [
        10,
        45
      ],
      [
        46,
        36
      ],
      [
        62,
        48
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "winter-glassmakers-council",
        "kind": "gathering-hall",
        "rect": [
          29,
          10,
          39,
          21
        ]
      },
      {
        "id": "western-frost-tube-forge",
        "kind": "shared-facility",
        "rect": [
          8,
          19,
          23,
          36
        ]
      },
      {
        "id": "eastern-snow-lens-workshop",
        "kind": "workshop",
        "rect": [
          46,
          24,
          59,
          37
        ]
      },
      {
        "id": "north-snow-transport-tallies",
        "kind": "guild-ledger",
        "rect": [
          21,
          47,
          50,
          53
        ]
      },
      {
        "id": "outboard-west-ice-measures",
        "kind": "artisan-study",
        "rect": [
          5,
          41,
          14,
          49
        ]
      },
      {
        "id": "outer-east-iceglass-polishing",
        "kind": "artisan-study",
        "rect": [
          59,
          43,
          64,
          52
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          29,
          9,
          39,
          20
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          19,
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
          46,
          24,
          59,
          37
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          21,
          47,
          50,
          53
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          41,
          14,
          49
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          59,
          43,
          64,
          52
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "snow-windlass-frostglass-suspended-workshop",
      67,
      12,
      58
    ],
    "profile": "snow-windlass-frostglass-suspended-workshop"
  },
  {
    "id": "r4:guildhall:mountain:medium:04",
    "type": "guildhall",
    "biome": "mountain",
    "size": "medium",
    "variant": 4,
    "bounds": [
      70,
      12,
      62
    ],
    "wings": [
      [
        27,
        7,
        43,
        24
      ],
      [
        5,
        21,
        26,
        42
      ],
      [
        43,
        17,
        62,
        36
      ],
      [
        17,
        45,
        53,
        55
      ],
      [
        21,
        23,
        53,
        32
      ],
      [
        20,
        31,
        32,
        47
      ],
      [
        40,
        31,
        50,
        46
      ],
      [
        31,
        32,
        41,
        44
      ],
      [
        58,
        34,
        68,
        53
      ],
      [
        6,
        41,
        16,
        57
      ]
    ],
    "octagons": [],
    "notches": [
      [
        34,
        35,
        39,
        41
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
        "axis": "x",
        "fixed": 26,
        "from": 22,
        "to": 28,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 43,
        "from": 21,
        "to": 27,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 45,
        "from": 22,
        "to": 29,
        "door": 26,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        29,
        "west"
      ],
      [
        62,
        26,
        "east"
      ],
      [
        34,
        55,
        "north"
      ],
      [
        31,
        7,
        "south"
      ],
      [
        39,
        7,
        "south"
      ],
      [
        68,
        43,
        "east"
      ],
      [
        6,
        49,
        "west"
      ]
    ],
    "fixtures": [
      [
        35,
        14
      ],
      [
        11,
        29
      ],
      [
        55,
        25
      ],
      [
        34,
        50
      ],
      [
        63,
        43
      ],
      [
        11,
        50
      ],
      [
        43,
        38
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "ridge-rivet-master-forum",
        "kind": "gathering-hall",
        "rect": [
          29,
          10,
          41,
          21
        ]
      },
      {
        "id": "west-quarry-hoist-shop",
        "kind": "shared-facility",
        "rect": [
          8,
          24,
          24,
          38
        ]
      },
      {
        "id": "east-granite-cutting",
        "kind": "workshop",
        "rect": [
          47,
          20,
          60,
          33
        ]
      },
      {
        "id": "north-cliff-guild-register",
        "kind": "guild-ledger",
        "rect": [
          20,
          49,
          51,
          54
        ]
      },
      {
        "id": "outboard-east-forge-bridge",
        "kind": "artisan-study",
        "rect": [
          61,
          38,
          67,
          51
        ]
      },
      {
        "id": "west-slope-rigging-store",
        "kind": "artisan-study",
        "rect": [
          8,
          46,
          15,
          56
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          29,
          9,
          41,
          21
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          8,
          24,
          24,
          38
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          47,
          20,
          60,
          33
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          20,
          49,
          51,
          54
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          61,
          38,
          67,
          51
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          8,
          46,
          15,
          56
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "mountain-twin-crane-quarry-bridge-guild",
      70,
      12,
      62
    ],
    "profile": "mountain-twin-crane-quarry-bridge-guild"
  },
  {
    "id": "r4:guildhall:enchanted-forest:small:03",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 3,
    "bounds": [
      52,
      12,
      49
    ],
    "wings": [
      [
        18,
        7,
        32,
        24
      ],
      [
        5,
        19,
        18,
        35
      ],
      [
        33,
        16,
        46,
        32
      ],
      [
        14,
        37,
        42,
        45
      ],
      [
        15,
        23,
        39,
        30
      ],
      [
        19,
        29,
        27,
        38
      ],
      [
        35,
        30,
        43,
        40
      ],
      [
        3,
        33,
        13,
        46
      ],
      [
        43,
        31,
        50,
        46
      ]
    ],
    "octagons": [],
    "notches": [
      [
        23,
        32,
        27,
        35
      ]
    ],
    "entry": [
      25,
      7
    ],
    "porch": [
      22,
      3,
      28,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 18,
        "from": 22,
        "to": 26,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 33,
        "from": 22,
        "to": 27,
        "door": 25,
        "facing": "east"
      }
    ],
    "windows": [
      [
        5,
        26,
        "west"
      ],
      [
        46,
        23,
        "east"
      ],
      [
        25,
        45,
        "north"
      ],
      [
        21,
        7,
        "south"
      ],
      [
        29,
        7,
        "south"
      ],
      [
        3,
        40,
        "west"
      ],
      [
        50,
        40,
        "east"
      ]
    ],
    "fixtures": [
      [
        25,
        14
      ],
      [
        11,
        27
      ],
      [
        40,
        24
      ],
      [
        26,
        42
      ],
      [
        9,
        40
      ],
      [
        47,
        40
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "elderleaf-menders-conclave",
        "kind": "gathering-hall",
        "rect": [
          20,
          10,
          30,
          20
        ]
      },
      {
        "id": "western-luminous-fungi-study",
        "kind": "shared-facility",
        "rect": [
          8,
          22,
          16,
          32
        ]
      },
      {
        "id": "east-bough-restoration",
        "kind": "workshop",
        "rect": [
          36,
          19,
          44,
          29
        ]
      },
      {
        "id": "north-glade-craft-licenses",
        "kind": "guild-ledger",
        "rect": [
          17,
          40,
          40,
          44
        ]
      },
      {
        "id": "west-root-paint-making",
        "kind": "artisan-study",
        "rect": [
          5,
          37,
          12,
          44
        ]
      },
      {
        "id": "outer-east-spirit-ink-press",
        "kind": "workshop",
        "rect": [
          45,
          37,
          49,
          44
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          20,
          9,
          31,
          21
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          8,
          22,
          16,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          36,
          19,
          44,
          29
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          17,
          40,
          40,
          44
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          37,
          12,
          44
        ],
        "profile": "hip",
        "axis": "z",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          45,
          37,
          49,
          44
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "forest-elderleaf-rootworks-eight-spoke",
      52,
      12,
      49
    ],
    "profile": "forest-elderleaf-rootworks-eight-spoke"
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
export function buildM2ChambersCrafts(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2ChambersCrafts(){return PLANS.map(author);}
export const M2_CHAMBERS_CRAFTS_IDS=Object.freeze(PLANS.map(p=>p.id));
