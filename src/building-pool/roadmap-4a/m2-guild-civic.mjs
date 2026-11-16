// Builder 4A M2 regional architecture — eight coordinate-authored next-generation municipal and guild architectures.
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
    "id": "r4:civic-hall:temperate:small:05",
    "bounds": [
      48,
      12,
      45
    ],
    "wings": [
      [
        16,
        7,
        30,
        23
      ],
      [
        6,
        17,
        17,
        32
      ],
      [
        30,
        16,
        43,
        27
      ],
      [
        19,
        29,
        37,
        40
      ],
      [
        14,
        22,
        37,
        30
      ]
    ],
    "notches": [
      [
        22,
        25,
        26,
        27
      ]
    ],
    "windows": [
      [
        6,
        23,
        "west"
      ],
      [
        43,
        22,
        "east"
      ],
      [
        25,
        40,
        "north"
      ],
      [
        20,
        7,
        "south"
      ],
      [
        27,
        7,
        "south"
      ],
      [
        16,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        23,
        14
      ],
      [
        10,
        25
      ],
      [
        38,
        23
      ],
      [
        28,
        36
      ]
    ],
    "profile": "temperate-canal-levee-jury",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "small",
    "variant": 5,
    "entry": [
      23,
      7
    ],
    "porch": [
      20,
      3,
      26,
      6
    ],
    "octagons": [],
    "partitions": [],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "waterside-council",
        "kind": "meeting",
        "rect": [
          18,
          10,
          28,
          20
        ]
      },
      {
        "id": "west-canal-petitions",
        "kind": "administration",
        "rect": [
          8,
          20,
          15,
          30
        ]
      },
      {
        "id": "east-trade-ordinances",
        "kind": "registry",
        "rect": [
          33,
          19,
          41,
          25
        ]
      },
      {
        "id": "north-ferry-records",
        "kind": "public-hearing",
        "rect": [
          21,
          33,
          35,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          18,
          9,
          29,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          19,
          15,
          30
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          33,
          18,
          41,
          25
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          20,
          33,
          35,
          39
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "temperate-canal-levee-jury",
      "south-arcade",
      "west-petition-bay",
      "east-trade-nook",
      "north-record-gallery",
      48,
      12,
      45
    ]
  },
  {
    "id": "r4:civic-hall:desert:medium:05",
    "bounds": [
      61,
      12,
      54
    ],
    "wings": [
      [
        23,
        7,
        39,
        22
      ],
      [
        5,
        23,
        21,
        41
      ],
      [
        39,
        15,
        55,
        38
      ],
      [
        16,
        42,
        43,
        49
      ],
      [
        18,
        19,
        45,
        26
      ],
      [
        19,
        26,
        28,
        43
      ],
      [
        36,
        27,
        43,
        44
      ]
    ],
    "notches": [
      [
        29,
        30,
        35,
        37
      ]
    ],
    "windows": [
      [
        5,
        30,
        "west"
      ],
      [
        55,
        27,
        "east"
      ],
      [
        29,
        49,
        "north"
      ],
      [
        27,
        7,
        "south"
      ],
      [
        35,
        7,
        "south"
      ],
      [
        23,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        31,
        14
      ],
      [
        12,
        29
      ],
      [
        48,
        24
      ],
      [
        28,
        46
      ],
      [
        24,
        35
      ]
    ],
    "profile": "desert-oasis-basin-municipal-cloister",
    "type": "civic-hall",
    "biome": "desert",
    "size": "medium",
    "variant": 5,
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
    "octagons": [],
    "partitions": [],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "suncourt-assembly",
        "kind": "meeting",
        "rect": [
          25,
          10,
          37,
          19
        ]
      },
      {
        "id": "west-well-allotments",
        "kind": "administration",
        "rect": [
          7,
          26,
          19,
          39
        ]
      },
      {
        "id": "eastern-caravan-tax",
        "kind": "registry",
        "rect": [
          43,
          19,
          53,
          35
        ]
      },
      {
        "id": "north-truce-scrolls",
        "kind": "public-hearing",
        "rect": [
          19,
          44,
          41,
          48
        ]
      },
      {
        "id": "windward-petition-counter",
        "kind": "records",
        "rect": [
          21,
          32,
          26,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          25,
          9,
          37,
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
          26,
          19,
          39
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          42,
          19,
          53,
          35
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          19,
          44,
          41,
          48
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "desert-oasis-basin-municipal-cloister",
      "open-water-courtyard",
      "long-west-allocation-arm",
      "east-duty-spine",
      "northern-palm-archive",
      61,
      12,
      54
    ]
  },
  {
    "id": "r4:civic-hall:snow:small:04",
    "bounds": [
      46,
      12,
      45
    ],
    "wings": [
      [
        16,
        7,
        28,
        22
      ],
      [
        4,
        20,
        16,
        33
      ],
      [
        28,
        16,
        40,
        34
      ],
      [
        11,
        32,
        37,
        40
      ],
      [
        12,
        22,
        34,
        29
      ],
      [
        20,
        28,
        27,
        35
      ]
    ],
    "notches": [
      [
        19,
        25,
        21,
        28
      ]
    ],
    "windows": [
      [
        4,
        26,
        "west"
      ],
      [
        40,
        24,
        "east"
      ],
      [
        22,
        40,
        "north"
      ],
      [
        19,
        7,
        "south"
      ],
      [
        26,
        7,
        "south"
      ],
      [
        16,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        22,
        14
      ],
      [
        9,
        26
      ],
      [
        34,
        25
      ],
      [
        24,
        37
      ]
    ],
    "profile": "snow-narrow-valley-warden-council",
    "type": "civic-hall",
    "biome": "snow",
    "size": "small",
    "variant": 4,
    "entry": [
      22,
      7
    ],
    "porch": [
      19,
      3,
      25,
      6
    ],
    "octagons": [],
    "partitions": [],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "frostline-council",
        "kind": "meeting",
        "rect": [
          18,
          10,
          26,
          19
        ]
      },
      {
        "id": "west-ration-office",
        "kind": "administration",
        "rect": [
          6,
          23,
          14,
          31
        ]
      },
      {
        "id": "east-sled-permits",
        "kind": "registry",
        "rect": [
          31,
          20,
          38,
          32
        ]
      },
      {
        "id": "rear-blizzard-hearings",
        "kind": "public-hearing",
        "rect": [
          13,
          35,
          35,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          18,
          9,
          27,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          6,
          23,
          15,
          31
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          31,
          20,
          39,
          32
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          13,
          35,
          35,
          39
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      }
    ],
    "signature": [
      "snow-narrow-valley-warden-council",
      "short-snow-porch",
      "long-eastern-licensing-branch",
      "winter-ration-backstop",
      46,
      12,
      45
    ]
  },
  {
    "id": "r4:civic-hall:mountain:large:04",
    "bounds": [
      79,
      12,
      65
    ],
    "wings": [
      [
        30,
        7,
        50,
        24
      ],
      [
        5,
        21,
        29,
        38
      ],
      [
        9,
        39,
        21,
        53
      ],
      [
        50,
        15,
        73,
        42
      ],
      [
        22,
        46,
        59,
        58
      ],
      [
        23,
        23,
        60,
        32
      ],
      [
        21,
        32,
        31,
        47
      ],
      [
        47,
        33,
        56,
        47
      ],
      [
        30,
        31,
        48,
        45
      ]
    ],
    "notches": [
      [
        36,
        34,
        43,
        40
      ]
    ],
    "windows": [
      [
        5,
        29,
        "west"
      ],
      [
        73,
        26,
        "east"
      ],
      [
        40,
        58,
        "north"
      ],
      [
        36,
        7,
        "south"
      ],
      [
        44,
        7,
        "south"
      ],
      [
        9,
        47,
        "west"
      ]
    ],
    "fixtures": [
      [
        40,
        14
      ],
      [
        15,
        28
      ],
      [
        63,
        26
      ],
      [
        40,
        53
      ],
      [
        15,
        46
      ],
      [
        54,
        38
      ]
    ],
    "profile": "mountain-terrace-double-register",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "large",
    "variant": 4,
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
    "octagons": [],
    "partitions": [],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "summit-gate-senate",
        "kind": "meeting",
        "rect": [
          32,
          10,
          48,
          20
        ]
      },
      {
        "id": "western-quarry-claims",
        "kind": "administration",
        "rect": [
          7,
          24,
          26,
          35
        ]
      },
      {
        "id": "eastern-passage-tithes",
        "kind": "registry",
        "rect": [
          53,
          18,
          70,
          38
        ]
      },
      {
        "id": "north-high-pass-chancellery",
        "kind": "public-hearing",
        "rect": [
          25,
          49,
          56,
          57
        ]
      },
      {
        "id": "low-valley-land-title",
        "kind": "records",
        "rect": [
          11,
          43,
          19,
          51
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          33,
          9,
          48,
          21
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          8,
          24,
          27,
          36
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          52,
          18,
          70,
          38
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          25,
          49,
          55,
          57
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          11,
          43,
          19,
          50
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "mountain-terrace-double-register",
      "divided-passage-claims",
      "perched-west-survey-wing",
      "northern-plateau-archive",
      "long-east-toll-arm",
      79,
      12,
      65
    ]
  },
  {
    "id": "r4:guildhall:temperate:large:03",
    "bounds": [
      74,
      12,
      60
    ],
    "wings": [
      [
        28,
        7,
        45,
        25
      ],
      [
        5,
        18,
        27,
        36
      ],
      [
        45,
        20,
        68,
        40
      ],
      [
        17,
        43,
        58,
        54
      ],
      [
        20,
        24,
        55,
        32
      ],
      [
        19,
        32,
        30,
        45
      ],
      [
        41,
        32,
        51,
        44
      ],
      [
        28,
        30,
        44,
        42
      ],
      [
        58,
        39,
        70,
        51
      ]
    ],
    "notches": [
      [
        34,
        34,
        40,
        39
      ]
    ],
    "windows": [
      [
        5,
        27,
        "west"
      ],
      [
        68,
        27,
        "east"
      ],
      [
        36,
        54,
        "north"
      ],
      [
        32,
        7,
        "south"
      ],
      [
        40,
        7,
        "south"
      ],
      [
        70,
        45,
        "east"
      ]
    ],
    "fixtures": [
      [
        36,
        14
      ],
      [
        12,
        27
      ],
      [
        60,
        27
      ],
      [
        39,
        50
      ],
      [
        64,
        45
      ],
      [
        25,
        37
      ]
    ],
    "profile": "temperate-riverboat-guild-with-outboard-dock",
    "type": "guildhall",
    "biome": "temperate",
    "size": "large",
    "variant": 3,
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
    "octagons": [],
    "partitions": [],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "river-timber-cooperative",
        "kind": "gathering-hall",
        "rect": [
          30,
          10,
          43,
          21
        ]
      },
      {
        "id": "west-barrel-stave-works",
        "kind": "shared-facility",
        "rect": [
          7,
          22,
          24,
          33
        ]
      },
      {
        "id": "eastern-rope-loft",
        "kind": "workshop",
        "rect": [
          49,
          24,
          65,
          35
        ]
      },
      {
        "id": "north-barge-contracts",
        "kind": "guild-ledger",
        "rect": [
          20,
          47,
          55,
          53
        ]
      },
      {
        "id": "outer-east-shipwright-platform",
        "kind": "artisan-study",
        "rect": [
          60,
          43,
          68,
          49
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          30,
          9,
          44,
          22
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          22,
          25,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          48,
          24,
          66,
          35
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          19,
          46,
          55,
          53
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          60,
          43,
          68,
          50
        ],
        "profile": "saw",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "temperate-riverboat-guild-with-outboard-dock",
      "outer-east-dock-house",
      "northern-barge-license",
      "west-stave-yard",
      74,
      12,
      60
    ]
  },
  {
    "id": "r4:guildhall:enchanted-forest:medium:03",
    "bounds": [
      63,
      12,
      57
    ],
    "wings": [
      [
        25,
        7,
        40,
        22
      ],
      [
        6,
        17,
        24,
        39
      ],
      [
        41,
        21,
        59,
        34
      ],
      [
        17,
        40,
        45,
        52
      ],
      [
        20,
        21,
        53,
        29
      ],
      [
        19,
        29,
        28,
        43
      ],
      [
        36,
        29,
        44,
        43
      ],
      [
        4,
        37,
        15,
        49
      ]
    ],
    "notches": [
      [
        29,
        31,
        36,
        38
      ]
    ],
    "windows": [
      [
        6,
        25,
        "west"
      ],
      [
        59,
        26,
        "east"
      ],
      [
        29,
        52,
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
        4,
        43,
        "west"
      ]
    ],
    "fixtures": [
      [
        32,
        14
      ],
      [
        12,
        25
      ],
      [
        50,
        27
      ],
      [
        31,
        48
      ],
      [
        9,
        42
      ]
    ],
    "profile": "enchanted-forest-rootloom-guild",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 3,
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
    "octagons": [],
    "partitions": [],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "glade-master-council",
        "kind": "gathering-hall",
        "rect": [
          27,
          10,
          38,
          19
        ]
      },
      {
        "id": "west-amber-resin-workshop",
        "kind": "shared-facility",
        "rect": [
          8,
          21,
          22,
          35
        ]
      },
      {
        "id": "eastern-starwood-filigree",
        "kind": "workshop",
        "rect": [
          44,
          23,
          57,
          32
        ]
      },
      {
        "id": "north-woodland-charters",
        "kind": "guild-ledger",
        "rect": [
          19,
          44,
          43,
          51
        ]
      },
      {
        "id": "western-root-loom",
        "kind": "artisan-study",
        "rect": [
          6,
          40,
          13,
          47
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          27,
          9,
          38,
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
          22,
          22,
          36
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          44,
          23,
          57,
          33
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          19,
          44,
          43,
          51
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          6,
          41,
          13,
          47
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "enchanted-forest-rootloom-guild",
      "western-root-loom-cliff",
      "starwood-east-shelf",
      "central-silent-glade",
      "north-charter",
      63,
      12,
      57
    ]
  },
  {
    "id": "r4:guildhall:desert:small:04",
    "bounds": [
      49,
      12,
      45
    ],
    "wings": [
      [
        18,
        7,
        30,
        23
      ],
      [
        4,
        16,
        18,
        32
      ],
      [
        30,
        22,
        44,
        38
      ],
      [
        16,
        33,
        39,
        41
      ],
      [
        15,
        21,
        36,
        30
      ],
      [
        18,
        29,
        25,
        36
      ],
      [
        30,
        31,
        37,
        35
      ]
    ],
    "notches": [
      [
        24,
        25,
        27,
        28
      ]
    ],
    "windows": [
      [
        4,
        23,
        "west"
      ],
      [
        44,
        28,
        "east"
      ],
      [
        28,
        41,
        "north"
      ],
      [
        21,
        7,
        "south"
      ],
      [
        27,
        7,
        "south"
      ],
      [
        18,
        13,
        "west"
      ]
    ],
    "fixtures": [
      [
        24,
        14
      ],
      [
        9,
        23
      ],
      [
        37,
        28
      ],
      [
        28,
        38
      ]
    ],
    "profile": "desert-saddle-makers-hooked-courtyard",
    "type": "guildhall",
    "biome": "desert",
    "size": "small",
    "variant": 4,
    "entry": [
      24,
      7
    ],
    "porch": [
      21,
      3,
      27,
      6
    ],
    "octagons": [],
    "partitions": [],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "caravan-craft-symposium",
        "kind": "gathering-hall",
        "rect": [
          20,
          10,
          28,
          20
        ]
      },
      {
        "id": "west-camel-saddle-works",
        "kind": "shared-facility",
        "rect": [
          6,
          19,
          16,
          29
        ]
      },
      {
        "id": "east-copper-engraving",
        "kind": "workshop",
        "rect": [
          33,
          25,
          42,
          35
        ]
      },
      {
        "id": "northern-dye-warrant-vault",
        "kind": "guild-ledger",
        "rect": [
          18,
          36,
          37,
          40
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          20,
          9,
          29,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          6,
          19,
          16,
          30
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          33,
          25,
          42,
          35
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          19,
          36,
          37,
          40
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 5
      }
    ],
    "signature": [
      "desert-saddle-makers-hooked-courtyard",
      "camel-saddle-west-cloister",
      "east-copper-arm",
      "north-dye-vault",
      49,
      12,
      45
    ]
  },
  {
    "id": "r4:guildhall:snow:large:03",
    "bounds": [
      80,
      12,
      63
    ],
    "wings": [
      [
        31,
        7,
        49,
        24
      ],
      [
        7,
        16,
        31,
        41
      ],
      [
        49,
        21,
        72,
        42
      ],
      [
        19,
        46,
        61,
        57
      ],
      [
        21,
        23,
        58,
        31
      ],
      [
        21,
        30,
        32,
        48
      ],
      [
        43,
        31,
        54,
        47
      ],
      [
        29,
        33,
        47,
        46
      ],
      [
        70,
        32,
        77,
        52
      ]
    ],
    "notches": [
      [
        35,
        35,
        41,
        40
      ]
    ],
    "windows": [
      [
        7,
        27,
        "west"
      ],
      [
        72,
        26,
        "east"
      ],
      [
        40,
        57,
        "north"
      ],
      [
        36,
        7,
        "south"
      ],
      [
        44,
        7,
        "south"
      ],
      [
        77,
        43,
        "east"
      ]
    ],
    "fixtures": [
      [
        40,
        14
      ],
      [
        15,
        27
      ],
      [
        63,
        27
      ],
      [
        40,
        52
      ],
      [
        74,
        43
      ],
      [
        25,
        38
      ]
    ],
    "profile": "snow-ice-lantern-roadwright-complex",
    "type": "guildhall",
    "biome": "snow",
    "size": "large",
    "variant": 3,
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
    "octagons": [],
    "partitions": [],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "snow-roadwright-council",
        "kind": "gathering-hall",
        "rect": [
          33,
          10,
          47,
          20
        ]
      },
      {
        "id": "west-sled-spar-lathe",
        "kind": "shared-facility",
        "rect": [
          10,
          19,
          28,
          37
        ]
      },
      {
        "id": "east-frostglass-assembly",
        "kind": "workshop",
        "rect": [
          53,
          24,
          69,
          39
        ]
      },
      {
        "id": "north-road-charter-vault",
        "kind": "guild-ledger",
        "rect": [
          21,
          49,
          59,
          56
        ]
      },
      {
        "id": "outer-ice-lantern-loft",
        "kind": "artisan-study",
        "rect": [
          72,
          37,
          76,
          50
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          33,
          9,
          47,
          22
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          10,
          19,
          28,
          38
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          52,
          24,
          70,
          39
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
          59,
          56
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          72,
          37,
          76,
          50
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "snow-ice-lantern-roadwright-complex",
      "far-eastern-lantern-shaft",
      "long-west-sled-workshop",
      "north-road-depot",
      80,
      12,
      63
    ]
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
export function buildM2GuildAndCivic(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2GuildAndCivic(){return PLANS.map(author);}
export const M2_GUILD_CIVIC_IDS=Object.freeze(PLANS.map(p=>p.id));
