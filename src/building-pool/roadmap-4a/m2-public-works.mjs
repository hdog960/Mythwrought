// Builder 4A M2 regional architecture — eight coordinate-authored regional public works designs.
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
    "id": "r4:civic-hall:temperate:large:04",
    "bounds": [
      76,
      12,
      63
    ],
    "wings": [
      [
        29,
        7,
        48,
        27
      ],
      [
        5,
        19,
        26,
        38
      ],
      [
        49,
        22,
        69,
        43
      ],
      [
        16,
        43,
        53,
        55
      ],
      [
        24,
        24,
        52,
        32
      ],
      [
        20,
        33,
        30,
        47
      ],
      [
        45,
        34,
        53,
        48
      ],
      [
        30,
        31,
        45,
        42
      ]
    ],
    "notches": [
      [
        34,
        34,
        40,
        38
      ]
    ],
    "entry": [
      38,
      7
    ],
    "windows": [
      [
        5,
        27,
        "west"
      ],
      [
        69,
        31,
        "east"
      ],
      [
        35,
        55,
        "north"
      ],
      [
        33,
        7,
        "south"
      ],
      [
        44,
        7,
        "south"
      ],
      [
        29,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        38,
        14
      ],
      [
        11,
        27
      ],
      [
        60,
        30
      ],
      [
        35,
        50
      ],
      [
        25,
        39
      ]
    ],
    "rooms": [
      {
        "id": "river-assembly",
        "kind": "meeting",
        "rect": [
          31,
          10,
          46,
          21
        ]
      },
      {
        "id": "ferry-appeals",
        "kind": "administration",
        "rect": [
          7,
          22,
          24,
          35
        ]
      },
      {
        "id": "tax-charter-office",
        "kind": "registry",
        "rect": [
          53,
          25,
          67,
          39
        ]
      },
      {
        "id": "bridge-treaty-hall",
        "kind": "public-hearing",
        "rect": [
          18,
          47,
          51,
          53
        ]
      },
      {
        "id": "river-surveyor",
        "kind": "records",
        "rect": [
          22,
          37,
          28,
          42
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          30,
          8,
          47,
          23
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
          25,
          36
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          51,
          24,
          68,
          40
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          18,
          46,
          51,
          54
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      }
    ],
    "profile": "temperate-delta-long-voting-hall",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "large",
    "variant": 4,
    "octagons": [],
    "porch": [
      35,
      3,
      41,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 29,
        "from": 24,
        "to": 26,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 49,
        "from": 24,
        "to": 28,
        "door": 26,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 45,
        "from": 25,
        "to": 35,
        "door": 30,
        "facing": "north"
      }
    ],
    "ridges": [],
    "skyline": [],
    "signature": [
      "temperate-delta-long-voting-hall",
      76,
      12,
      63
    ]
  },
  {
    "id": "r4:civic-hall:desert:small:04",
    "bounds": [
      46,
      12,
      44
    ],
    "wings": [
      [
        17,
        7,
        29,
        23
      ],
      [
        5,
        18,
        16,
        36
      ],
      [
        29,
        19,
        42,
        31
      ],
      [
        17,
        33,
        37,
        40
      ],
      [
        14,
        22,
        32,
        29
      ],
      [
        22,
        28,
        29,
        35
      ],
      [
        27,
        30,
        37,
        34
      ]
    ],
    "notches": [
      [
        20,
        25,
        22,
        28
      ]
    ],
    "entry": [
      23,
      7
    ],
    "windows": [
      [
        5,
        25,
        "west"
      ],
      [
        42,
        25,
        "east"
      ],
      [
        28,
        40,
        "north"
      ],
      [
        20,
        7,
        "south"
      ],
      [
        26,
        7,
        "south"
      ],
      [
        17,
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
        9,
        27
      ],
      [
        36,
        26
      ],
      [
        30,
        37
      ]
    ],
    "rooms": [
      {
        "id": "water-rights-hall",
        "kind": "meeting",
        "rect": [
          19,
          10,
          27,
          19
        ]
      },
      {
        "id": "oasis-complaints",
        "kind": "administration",
        "rect": [
          7,
          21,
          14,
          33
        ]
      },
      {
        "id": "salt-tax-window",
        "kind": "registry",
        "rect": [
          33,
          22,
          40,
          29
        ]
      },
      {
        "id": "witness-scroll-chamber",
        "kind": "public-hearing",
        "rect": [
          19,
          36,
          35,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          18,
          8,
          28,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          21,
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
          32,
          21,
          41,
          29
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
          35,
          39
        ],
        "profile": "hip",
        "axis": "x",
        "high": 8,
        "period": 4
      }
    ],
    "profile": "desert-mirage-salt-law-court",
    "type": "civic-hall",
    "biome": "desert",
    "size": "small",
    "variant": 4,
    "octagons": [],
    "porch": [
      20,
      3,
      26,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 16,
        "from": 23,
        "to": 28,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 29,
        "from": 23,
        "to": 27,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 34,
        "from": 23,
        "to": 29,
        "door": 26,
        "facing": "north"
      }
    ],
    "ridges": [],
    "skyline": [],
    "signature": [
      "desert-mirage-salt-law-court",
      46,
      12,
      44
    ]
  },
  {
    "id": "r4:civic-hall:enchanted-forest:medium:04",
    "bounds": [
      61,
      12,
      55
    ],
    "wings": [
      [
        23,
        7,
        38,
        25
      ],
      [
        5,
        24,
        22,
        43
      ],
      [
        39,
        15,
        54,
        37
      ],
      [
        18,
        41,
        49,
        50
      ],
      [
        20,
        24,
        26,
        42
      ],
      [
        35,
        24,
        43,
        43
      ],
      [
        24,
        27,
        42,
        39
      ]
    ],
    "notches": [
      [
        29,
        32,
        34,
        37
      ]
    ],
    "entry": [
      30,
      7
    ],
    "windows": [
      [
        5,
        29,
        "west"
      ],
      [
        54,
        25,
        "east"
      ],
      [
        30,
        50,
        "north"
      ],
      [
        27,
        7,
        "south"
      ],
      [
        33,
        7,
        "south"
      ],
      [
        23,
        14,
        "west"
      ]
    ],
    "fixtures": [
      [
        30,
        14
      ],
      [
        11,
        30
      ],
      [
        48,
        26
      ],
      [
        30,
        47
      ],
      [
        25,
        33
      ]
    ],
    "rooms": [
      {
        "id": "bough-covenant",
        "kind": "meeting",
        "rect": [
          25,
          10,
          36,
          20
        ]
      },
      {
        "id": "moss-jury",
        "kind": "administration",
        "rect": [
          7,
          27,
          20,
          40
        ]
      },
      {
        "id": "witness-grove",
        "kind": "public-hearing",
        "rect": [
          42,
          19,
          52,
          34
        ]
      },
      {
        "id": "root-charter-vault",
        "kind": "registry",
        "rect": [
          20,
          45,
          47,
          49
        ]
      },
      {
        "id": "mediation-room",
        "kind": "records",
        "rect": [
          25,
          33,
          28,
          38
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          25,
          8,
          37,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          26,
          20,
          40
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          41,
          18,
          53,
          34
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          20,
          44,
          47,
          49
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "enchanted-covenant-tree-ring-court",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 4,
    "octagons": [],
    "porch": [
      27,
      3,
      33,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 22,
        "from": 25,
        "to": 28,
        "door": 26,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 39,
        "from": 20,
        "to": 25,
        "door": 22,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 42,
        "from": 20,
        "to": 25,
        "door": 23,
        "facing": "north"
      }
    ],
    "ridges": [],
    "skyline": [],
    "signature": [
      "enchanted-covenant-tree-ring-court",
      61,
      12,
      55
    ]
  },
  {
    "id": "r4:civic-hall:mountain:medium:04",
    "bounds": [
      62,
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
        19,
        24,
        33
      ],
      [
        9,
        31,
        21,
        47
      ],
      [
        41,
        16,
        56,
        37
      ],
      [
        19,
        43,
        49,
        52
      ],
      [
        21,
        22,
        46,
        29
      ],
      [
        22,
        30,
        30,
        45
      ],
      [
        36,
        28,
        47,
        45
      ],
      [
        28,
        27,
        38,
        32
      ]
    ],
    "notches": [
      [
        31,
        30,
        35,
        36
      ]
    ],
    "entry": [
      32,
      7
    ],
    "windows": [
      [
        6,
        25,
        "west"
      ],
      [
        56,
        26,
        "east"
      ],
      [
        34,
        52,
        "north"
      ],
      [
        28,
        7,
        "south"
      ],
      [
        37,
        7,
        "south"
      ],
      [
        9,
        39,
        "west"
      ]
    ],
    "fixtures": [
      [
        33,
        14
      ],
      [
        13,
        27
      ],
      [
        49,
        26
      ],
      [
        33,
        49
      ],
      [
        14,
        40
      ]
    ],
    "rooms": [
      {
        "id": "pass-reconciliation",
        "kind": "meeting",
        "rect": [
          27,
          10,
          39,
          20
        ]
      },
      {
        "id": "miners-appeals",
        "kind": "administration",
        "rect": [
          8,
          22,
          23,
          30
        ]
      },
      {
        "id": "stone-bond-office",
        "kind": "registry",
        "rect": [
          44,
          19,
          54,
          34
        ]
      },
      {
        "id": "ice-safety-senate",
        "kind": "public-hearing",
        "rect": [
          22,
          46,
          47,
          51
        ]
      },
      {
        "id": "avalanche-records",
        "kind": "civic-archive",
        "rect": [
          11,
          35,
          19,
          44
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          27,
          8,
          39,
          20
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
          23,
          30
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          43,
          18,
          54,
          34
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          22,
          45,
          47,
          51
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      }
    ],
    "profile": "mountain-terraced-pass-rights-court",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "medium",
    "variant": 4,
    "octagons": [],
    "porch": [
      29,
      3,
      35,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 24,
        "from": 22,
        "to": 28,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 41,
        "from": 21,
        "to": 27,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 44,
        "from": 23,
        "to": 30,
        "door": 27,
        "facing": "north"
      }
    ],
    "ridges": [],
    "skyline": [],
    "signature": [
      "mountain-terraced-pass-rights-court",
      62,
      12,
      57
    ]
  },
  {
    "id": "r4:guildhall:snow:small:03",
    "bounds": [
      47,
      12,
      47
    ],
    "wings": [
      [
        17,
        7,
        31,
        22
      ],
      [
        5,
        18,
        17,
        39
      ],
      [
        31,
        18,
        43,
        28
      ],
      [
        16,
        35,
        37,
        43
      ],
      [
        14,
        23,
        39,
        30
      ],
      [
        20,
        29,
        29,
        36
      ]
    ],
    "notches": [
      [
        22,
        32,
        25,
        34
      ]
    ],
    "entry": [
      24,
      7
    ],
    "windows": [
      [
        5,
        25,
        "west"
      ],
      [
        43,
        23,
        "east"
      ],
      [
        25,
        43,
        "north"
      ],
      [
        20,
        7,
        "south"
      ],
      [
        28,
        7,
        "south"
      ],
      [
        17,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        24,
        14
      ],
      [
        10,
        26
      ],
      [
        37,
        23
      ],
      [
        26,
        40
      ]
    ],
    "rooms": [
      {
        "id": "ice-keel-council",
        "kind": "gathering-hall",
        "rect": [
          19,
          10,
          29,
          19
        ]
      },
      {
        "id": "frost-seal-lathe",
        "kind": "shared-facility",
        "rect": [
          7,
          21,
          15,
          36
        ]
      },
      {
        "id": "runners-forge",
        "kind": "workshop",
        "rect": [
          34,
          20,
          41,
          26
        ]
      },
      {
        "id": "harbor-license",
        "kind": "guild-ledger",
        "rect": [
          18,
          38,
          36,
          42
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          18,
          8,
          30,
          21
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
          16,
          36
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          33,
          20,
          42,
          26
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          18,
          38,
          36,
          42
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "snow-ice-keel-sheltered-works",
    "type": "guildhall",
    "biome": "snow",
    "size": "small",
    "variant": 3,
    "octagons": [],
    "porch": [
      21,
      3,
      27,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 17,
        "from": 23,
        "to": 27,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 31,
        "from": 23,
        "to": 26,
        "door": 24,
        "facing": "east"
      }
    ],
    "ridges": [],
    "skyline": [],
    "signature": [
      "snow-ice-keel-sheltered-works",
      47,
      12,
      47
    ]
  },
  {
    "id": "r4:guildhall:desert:medium:03",
    "bounds": [
      58,
      12,
      50
    ],
    "wings": [
      [
        23,
        7,
        35,
        22
      ],
      [
        6,
        16,
        22,
        37
      ],
      [
        35,
        17,
        53,
        35
      ],
      [
        17,
        36,
        44,
        45
      ],
      [
        18,
        21,
        43,
        30
      ],
      [
        21,
        29,
        28,
        39
      ],
      [
        34,
        29,
        41,
        39
      ],
      [
        26,
        28,
        38,
        39
      ]
    ],
    "notches": [
      [
        29,
        31,
        33,
        35
      ]
    ],
    "entry": [
      29,
      7
    ],
    "windows": [
      [
        6,
        24,
        "west"
      ],
      [
        53,
        26,
        "east"
      ],
      [
        29,
        45,
        "north"
      ],
      [
        25,
        7,
        "south"
      ],
      [
        33,
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
        29,
        14
      ],
      [
        12,
        26
      ],
      [
        46,
        26
      ],
      [
        30,
        42
      ],
      [
        24,
        34
      ]
    ],
    "rooms": [
      {
        "id": "dye-traders-moot",
        "kind": "gathering-hall",
        "rect": [
          25,
          10,
          33,
          19
        ]
      },
      {
        "id": "indigo-loom",
        "kind": "shared-facility",
        "rect": [
          8,
          19,
          20,
          34
        ]
      },
      {
        "id": "perfume-drying",
        "kind": "workshop",
        "rect": [
          39,
          20,
          51,
          33
        ]
      },
      {
        "id": "scribes-license",
        "kind": "guild-ledger",
        "rect": [
          19,
          40,
          42,
          44
        ]
      },
      {
        "id": "cooling-court",
        "kind": "artisan-study",
        "rect": [
          23,
          32,
          27,
          38
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          24,
          8,
          34,
          20
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          8,
          19,
          20,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          38,
          20,
          51,
          33
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          20,
          40,
          41,
          44
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "desert-indigo-cloister-dyers",
    "type": "guildhall",
    "biome": "desert",
    "size": "medium",
    "variant": 3,
    "octagons": [],
    "porch": [
      26,
      3,
      32,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 22,
        "from": 21,
        "to": 28,
        "door": 23,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 35,
        "from": 21,
        "to": 27,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 39,
        "from": 22,
        "to": 28,
        "door": 25,
        "facing": "north"
      }
    ],
    "ridges": [],
    "skyline": [],
    "signature": [
      "desert-indigo-cloister-dyers",
      58,
      12,
      50
    ]
  },
  {
    "id": "r4:guildhall:enchanted-forest:large:03",
    "bounds": [
      71,
      12,
      60
    ],
    "wings": [
      [
        27,
        7,
        43,
        26
      ],
      [
        5,
        17,
        26,
        45
      ],
      [
        43,
        20,
        66,
        36
      ],
      [
        15,
        45,
        55,
        55
      ],
      [
        20,
        23,
        53,
        31
      ],
      [
        22,
        31,
        30,
        46
      ],
      [
        39,
        30,
        48,
        47
      ],
      [
        28,
        28,
        43,
        42
      ]
    ],
    "notches": [
      [
        33,
        33,
        38,
        39
      ]
    ],
    "entry": [
      35,
      7
    ],
    "windows": [
      [
        5,
        27,
        "west"
      ],
      [
        66,
        26,
        "east"
      ],
      [
        35,
        55,
        "north"
      ],
      [
        31,
        7,
        "south"
      ],
      [
        40,
        7,
        "south"
      ],
      [
        27,
        12,
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
        28
      ],
      [
        57,
        27
      ],
      [
        35,
        50
      ],
      [
        26,
        37
      ],
      [
        43,
        39
      ]
    ],
    "rooms": [
      {
        "id": "greenwood-moot",
        "kind": "gathering-hall",
        "rect": [
          29,
          10,
          41,
          21
        ]
      },
      {
        "id": "willow-carving",
        "kind": "shared-facility",
        "rect": [
          7,
          21,
          20,
          43
        ]
      },
      {
        "id": "luminous-spindle",
        "kind": "workshop",
        "rect": [
          47,
          23,
          64,
          34
        ]
      },
      {
        "id": "songwood-charter",
        "kind": "guild-ledger",
        "rect": [
          18,
          48,
          53,
          54
        ]
      },
      {
        "id": "canopy-joinery",
        "kind": "artisan-study",
        "rect": [
          23,
          34,
          29,
          42
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          29,
          8,
          42,
          22
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
          24,
          42
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          46,
          22,
          64,
          34
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          18,
          47,
          53,
          54
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "enchanted-willow-crafts-commons",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 3,
    "octagons": [],
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
        "from": 23,
        "to": 28,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 43,
        "from": 24,
        "to": 29,
        "door": 26,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 46,
        "from": 23,
        "to": 30,
        "door": 27,
        "facing": "north"
      }
    ],
    "ridges": [],
    "skyline": [],
    "signature": [
      "enchanted-willow-crafts-commons",
      71,
      12,
      60
    ]
  },
  {
    "id": "r4:guildhall:mountain:large:03",
    "bounds": [
      75,
      12,
      65
    ],
    "wings": [
      [
        31,
        7,
        47,
        26
      ],
      [
        6,
        20,
        30,
        40
      ],
      [
        48,
        16,
        69,
        45
      ],
      [
        16,
        47,
        59,
        58
      ],
      [
        10,
        38,
        23,
        55
      ],
      [
        22,
        36,
        35,
        49
      ],
      [
        43,
        35,
        55,
        49
      ],
      [
        27,
        23,
        54,
        33
      ],
      [
        29,
        31,
        50,
        44
      ]
    ],
    "notches": [
      [
        36,
        34,
        42,
        40
      ]
    ],
    "entry": [
      39,
      7
    ],
    "windows": [
      [
        6,
        30,
        "west"
      ],
      [
        69,
        26,
        "east"
      ],
      [
        39,
        58,
        "north"
      ],
      [
        35,
        7,
        "south"
      ],
      [
        44,
        7,
        "south"
      ],
      [
        10,
        45,
        "west"
      ]
    ],
    "fixtures": [
      [
        39,
        14
      ],
      [
        15,
        30
      ],
      [
        60,
        27
      ],
      [
        38,
        54
      ],
      [
        15,
        49
      ],
      [
        46,
        39
      ]
    ],
    "rooms": [
      {
        "id": "stonehaul-masters",
        "kind": "gathering-hall",
        "rect": [
          33,
          10,
          45,
          21
        ]
      },
      {
        "id": "iron-hoist",
        "kind": "shared-facility",
        "rect": [
          8,
          23,
          28,
          36
        ]
      },
      {
        "id": "slate-engraving",
        "kind": "workshop",
        "rect": [
          51,
          20,
          67,
          41
        ]
      },
      {
        "id": "high-pass-ledgers",
        "kind": "guild-ledger",
        "rect": [
          23,
          51,
          57,
          57
        ]
      },
      {
        "id": "granite-tests",
        "kind": "artisan-study",
        "rect": [
          12,
          43,
          21,
          53
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          32,
          8,
          46,
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
          28,
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
          19,
          67,
          40
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          20,
          50,
          57,
          57
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "profile": "mountain-cliff-forged-dual-terrace",
    "type": "guildhall",
    "biome": "mountain",
    "size": "large",
    "variant": 3,
    "octagons": [],
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
        "from": 23,
        "to": 29,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 48,
        "from": 22,
        "to": 28,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 48,
        "from": 25,
        "to": 35,
        "door": 29,
        "facing": "north"
      }
    ],
    "ridges": [],
    "skyline": [],
    "signature": [
      "mountain-cliff-forged-dual-terrace",
      75,
      12,
      65
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
export function buildM2PublicWorks(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2PublicWorks(){return PLANS.map(author);}
export const M2_PUBLIC_WORKS_IDS=Object.freeze(PLANS.map(p=>p.id));
