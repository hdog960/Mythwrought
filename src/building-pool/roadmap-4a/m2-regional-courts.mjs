// Builder 4A M2 regional architecture — eight authored region-specific public halls and craft districts.
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
    "id": "r4:civic-hall:temperate:medium:05",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "medium",
    "variant": 5,
    "bounds": [
      65,
      12,
      55
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
        18,
        24,
        33
      ],
      [
        41,
        19,
        59,
        38
      ],
      [
        15,
        40,
        47,
        50
      ],
      [
        19,
        21,
        49,
        29
      ],
      [
        20,
        30,
        29,
        42
      ],
      [
        39,
        28,
        48,
        42
      ],
      [
        27,
        28,
        40,
        39
      ],
      [
        51,
        34,
        62,
        48
      ]
    ],
    "notches": [
      [
        30,
        32,
        35,
        37
      ]
    ],
    "octagons": [],
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
        "fixed": 25,
        "from": 21,
        "to": 27,
        "door": 23,
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
        "fixed": 43,
        "from": 21,
        "to": 28,
        "door": 24,
        "facing": "north"
      }
    ],
    "windows": [
      [
        6,
        26,
        "west"
      ],
      [
        59,
        29,
        "east"
      ],
      [
        30,
        50,
        "north"
      ],
      [
        29,
        7,
        "south"
      ],
      [
        35,
        7,
        "south"
      ],
      [
        25,
        13,
        "west"
      ],
      [
        62,
        42,
        "east"
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
        52,
        28
      ],
      [
        29,
        46
      ],
      [
        44,
        36
      ],
      [
        57,
        43
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "levee-hearing",
        "kind": "meeting",
        "rect": [
          27,
          10,
          39,
          20
        ]
      },
      {
        "id": "reed-marsh-petitions",
        "kind": "administration",
        "rect": [
          8,
          21,
          22,
          30
        ]
      },
      {
        "id": "river-crossing-charters",
        "kind": "registry",
        "rect": [
          45,
          23,
          57,
          35
        ]
      },
      {
        "id": "north-drainage-council",
        "kind": "public-hearing",
        "rect": [
          18,
          44,
          45,
          49
        ]
      },
      {
        "id": "estuary-records",
        "kind": "civic-archive",
        "rect": [
          22,
          35,
          28,
          40
        ]
      },
      {
        "id": "eastern-levee-arbitration",
        "kind": "public-hearing",
        "rect": [
          54,
          40,
          60,
          47
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          27,
          9,
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
          21,
          22,
          30
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          45,
          23,
          57,
          35
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          18,
          44,
          45,
          49
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          54,
          40,
          60,
          47
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "temperate-reedmarsh-levee-council",
      65,
      12,
      55
    ],
    "profile": "temperate-reedmarsh-levee-council"
  },
  {
    "id": "r4:civic-hall:desert:large:04",
    "type": "civic-hall",
    "biome": "desert",
    "size": "large",
    "variant": 4,
    "bounds": [
      77,
      12,
      63
    ],
    "wings": [
      [
        28,
        7,
        44,
        25
      ],
      [
        5,
        18,
        27,
        45
      ],
      [
        46,
        16,
        69,
        36
      ],
      [
        17,
        46,
        57,
        56
      ],
      [
        22,
        24,
        54,
        32
      ],
      [
        21,
        31,
        31,
        47
      ],
      [
        41,
        31,
        51,
        46
      ],
      [
        31,
        29,
        44,
        42
      ],
      [
        63,
        34,
        73,
        49
      ]
    ],
    "notches": [
      [
        34,
        33,
        39,
        39
      ]
    ],
    "octagons": [],
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
        "axis": "x",
        "fixed": 28,
        "from": 21,
        "to": 27,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "z",
        "fixed": 46,
        "from": 22,
        "to": 30,
        "door": 25,
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
        27,
        "east"
      ],
      [
        36,
        56,
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
        73,
        42,
        "east"
      ]
    ],
    "fixtures": [
      [
        36,
        14
      ],
      [
        14,
        29
      ],
      [
        59,
        26
      ],
      [
        35,
        53
      ],
      [
        68,
        43
      ],
      [
        24,
        37
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "sun-ordinance-assembly",
        "kind": "meeting",
        "rect": [
          30,
          10,
          42,
          21
        ]
      },
      {
        "id": "western-oasis-claims",
        "kind": "administration",
        "rect": [
          8,
          22,
          24,
          41
        ]
      },
      {
        "id": "eastern-caravan-office",
        "kind": "registry",
        "rect": [
          50,
          20,
          66,
          33
        ]
      },
      {
        "id": "north-witness-court",
        "kind": "public-hearing",
        "rect": [
          20,
          50,
          55,
          55
        ]
      },
      {
        "id": "water-vault",
        "kind": "civic-archive",
        "rect": [
          66,
          38,
          71,
          47
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          30,
          9,
          42,
          21
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          8,
          22,
          24,
          41
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
          49,
          55,
          55
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          66,
          38,
          71,
          46
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "desert-twin-oasis-witness-court",
      77,
      12,
      63
    ],
    "profile": "desert-twin-oasis-witness-court"
  },
  {
    "id": "r4:civic-hall:snow:medium:05",
    "type": "civic-hall",
    "biome": "snow",
    "size": "medium",
    "variant": 5,
    "bounds": [
      62,
      12,
      55
    ],
    "wings": [
      [
        24,
        7,
        39,
        24
      ],
      [
        4,
        22,
        24,
        43
      ],
      [
        40,
        17,
        57,
        35
      ],
      [
        14,
        40,
        50,
        50
      ],
      [
        20,
        23,
        49,
        31
      ],
      [
        20,
        30,
        30,
        41
      ],
      [
        37,
        30,
        44,
        43
      ],
      [
        11,
        32,
        18,
        47
      ]
    ],
    "notches": [
      [
        31,
        34,
        36,
        38
      ]
    ],
    "octagons": [],
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
        "axis": "x",
        "fixed": 24,
        "from": 23,
        "to": 27,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 40,
        "from": 22,
        "to": 27,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 41,
        "from": 21,
        "to": 29,
        "door": 25,
        "facing": "north"
      }
    ],
    "windows": [
      [
        4,
        31,
        "west"
      ],
      [
        57,
        25,
        "east"
      ],
      [
        30,
        50,
        "north"
      ],
      [
        28,
        7,
        "south"
      ],
      [
        35,
        7,
        "south"
      ],
      [
        4,
        39,
        "west"
      ]
    ],
    "fixtures": [
      [
        31,
        14
      ],
      [
        11,
        29
      ],
      [
        50,
        25
      ],
      [
        30,
        47
      ],
      [
        14,
        41
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "windward-voting-chamber",
        "kind": "meeting",
        "rect": [
          26,
          10,
          37,
          20
        ]
      },
      {
        "id": "warming-petitions",
        "kind": "administration",
        "rect": [
          7,
          26,
          22,
          32
        ]
      },
      {
        "id": "east-pass-office",
        "kind": "registry",
        "rect": [
          44,
          20,
          54,
          32
        ]
      },
      {
        "id": "winter-council",
        "kind": "public-hearing",
        "rect": [
          18,
          44,
          47,
          49
        ]
      },
      {
        "id": "drift-relief",
        "kind": "civic-archive",
        "rect": [
          12,
          36,
          16,
          44
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
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          26,
          21,
          38
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          44,
          20,
          55,
          32
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          18,
          44,
          47,
          49
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          12,
          36,
          16,
          44
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "snow-windward-relief-council",
      62,
      12,
      55
    ],
    "profile": "snow-windward-relief-council"
  },
  {
    "id": "r4:civic-hall:enchanted-forest:small:04",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 4,
    "bounds": [
      50,
      12,
      45
    ],
    "wings": [
      [
        18,
        7,
        31,
        22
      ],
      [
        5,
        17,
        18,
        34
      ],
      [
        31,
        20,
        45,
        32
      ],
      [
        14,
        33,
        39,
        41
      ],
      [
        16,
        22,
        36,
        29
      ],
      [
        21,
        28,
        28,
        35
      ],
      [
        37,
        30,
        44,
        39
      ]
    ],
    "notches": [],
    "octagons": [],
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
    "partitions": [
      {
        "axis": "x",
        "fixed": 18,
        "from": 21,
        "to": 26,
        "door": 23,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 31,
        "from": 21,
        "to": 27,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 34,
        "from": 21,
        "to": 27,
        "door": 24,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        25,
        "west"
      ],
      [
        45,
        26,
        "east"
      ],
      [
        25,
        41,
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
        44,
        35,
        "east"
      ]
    ],
    "fixtures": [
      [
        24,
        14
      ],
      [
        10,
        25
      ],
      [
        38,
        26
      ],
      [
        25,
        38
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "root-hearing",
        "kind": "meeting",
        "rect": [
          20,
          10,
          29,
          19
        ]
      },
      {
        "id": "moss-jury",
        "kind": "administration",
        "rect": [
          7,
          20,
          16,
          32
        ]
      },
      {
        "id": "bough-recorder",
        "kind": "registry",
        "rect": [
          34,
          23,
          43,
          30
        ]
      },
      {
        "id": "covenant-witnesses",
        "kind": "public-hearing",
        "rect": [
          17,
          36,
          37,
          40
        ]
      },
      {
        "id": "fern-disputes",
        "kind": "records",
        "rect": [
          38,
          34,
          43,
          38
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
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          20,
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
          34,
          23,
          43,
          30
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          17,
          36,
          37,
          40
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "forest-lantern-root-civic-court",
      50,
      12,
      45
    ],
    "profile": "forest-lantern-root-civic-court"
  },
  {
    "id": "r4:guildhall:temperate:small:04",
    "type": "guildhall",
    "biome": "temperate",
    "size": "small",
    "variant": 4,
    "bounds": [
      49,
      12,
      47
    ],
    "wings": [
      [
        17,
        7,
        30,
        22
      ],
      [
        5,
        18,
        17,
        38
      ],
      [
        30,
        18,
        44,
        31
      ],
      [
        15,
        35,
        38,
        43
      ],
      [
        14,
        22,
        37,
        29
      ],
      [
        20,
        28,
        27,
        36
      ],
      [
        37,
        29,
        46,
        39
      ],
      [
        3,
        31,
        13,
        44
      ]
    ],
    "notches": [
      [
        22,
        30,
        24,
        33
      ]
    ],
    "octagons": [],
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
    "partitions": [
      {
        "axis": "x",
        "fixed": 17,
        "from": 21,
        "to": 27,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 30,
        "from": 21,
        "to": 27,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 36,
        "from": 21,
        "to": 26,
        "door": 23,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        25,
        "west"
      ],
      [
        44,
        25,
        "east"
      ],
      [
        25,
        43,
        "north"
      ],
      [
        21,
        7,
        "south"
      ],
      [
        28,
        7,
        "south"
      ],
      [
        46,
        35,
        "east"
      ],
      [
        3,
        39,
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
        24
      ],
      [
        24,
        40
      ],
      [
        42,
        35
      ],
      [
        8,
        39
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "canal-netmakers",
        "kind": "gathering-hall",
        "rect": [
          19,
          10,
          28,
          19
        ]
      },
      {
        "id": "sail-sewing-yard",
        "kind": "shared-facility",
        "rect": [
          7,
          21,
          15,
          35
        ]
      },
      {
        "id": "knotmakers-bay",
        "kind": "workshop",
        "rect": [
          33,
          21,
          42,
          29
        ]
      },
      {
        "id": "waterway-ledgers",
        "kind": "guild-ledger",
        "rect": [
          17,
          38,
          36,
          42
        ]
      },
      {
        "id": "trap-fabrication",
        "kind": "artisan-study",
        "rect": [
          40,
          33,
          45,
          38
        ]
      },
      {
        "id": "west-levee-fish-trap-maker",
        "kind": "workshop",
        "rect": [
          5,
          37,
          12,
          42
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          19,
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
          7,
          21,
          16,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          33,
          21,
          43,
          29
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          17,
          38,
          36,
          42
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          37,
          12,
          42
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "temperate-netmakers-outer-slip",
      49,
      12,
      47
    ],
    "profile": "temperate-netmakers-outer-slip"
  },
  {
    "id": "r4:guildhall:desert:large:04",
    "type": "guildhall",
    "biome": "desert",
    "size": "large",
    "variant": 4,
    "bounds": [
      78,
      12,
      64
    ],
    "wings": [
      [
        29,
        7,
        47,
        26
      ],
      [
        6,
        18,
        28,
        43
      ],
      [
        47,
        18,
        70,
        40
      ],
      [
        18,
        46,
        58,
        57
      ],
      [
        23,
        25,
        55,
        32
      ],
      [
        20,
        31,
        30,
        47
      ],
      [
        45,
        30,
        54,
        47
      ],
      [
        31,
        31,
        45,
        42
      ],
      [
        9,
        40,
        22,
        56
      ],
      [
        68,
        34,
        76,
        54
      ],
      [
        3,
        42,
        12,
        60
      ]
    ],
    "notches": [
      [
        35,
        34,
        42,
        41
      ]
    ],
    "octagons": [],
    "entry": [
      38,
      7
    ],
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
        "from": 22,
        "to": 28,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 47,
        "from": 22,
        "to": 28,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 47,
        "from": 23,
        "to": 30,
        "door": 25,
        "facing": "north"
      }
    ],
    "windows": [
      [
        6,
        28,
        "west"
      ],
      [
        70,
        27,
        "east"
      ],
      [
        37,
        57,
        "north"
      ],
      [
        33,
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
        48,
        "west"
      ],
      [
        76,
        47,
        "east"
      ],
      [
        3,
        53,
        "west"
      ]
    ],
    "fixtures": [
      [
        38,
        14
      ],
      [
        15,
        27
      ],
      [
        60,
        27
      ],
      [
        36,
        53
      ],
      [
        15,
        49
      ],
      [
        49,
        37
      ],
      [
        73,
        47
      ],
      [
        7,
        54
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "clay-charter",
        "kind": "gathering-hall",
        "rect": [
          32,
          10,
          45,
          22
        ]
      },
      {
        "id": "wheel-kilns",
        "kind": "shared-facility",
        "rect": [
          8,
          22,
          25,
          38
        ]
      },
      {
        "id": "glazed-ceramics",
        "kind": "workshop",
        "rect": [
          50,
          22,
          67,
          36
        ]
      },
      {
        "id": "potters-ledgers",
        "kind": "guild-ledger",
        "rect": [
          20,
          50,
          56,
          56
        ]
      },
      {
        "id": "sandstone-moulds",
        "kind": "artisan-study",
        "rect": [
          11,
          44,
          19,
          54
        ]
      },
      {
        "id": "outer-east-ceramic-kilns",
        "kind": "kiln-annex",
        "rect": [
          70,
          43,
          75,
          53
        ]
      },
      {
        "id": "western-sandglass-shaping",
        "kind": "artisan-study",
        "rect": [
          5,
          49,
          10,
          58
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          32,
          9,
          45,
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
          38
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
          67,
          36
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
          56,
          56
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          11,
          44,
          19,
          54
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          70,
          43,
          75,
          52
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          49,
          10,
          58
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "desert-potters-kiln-forum",
      78,
      12,
      64
    ],
    "profile": "desert-potters-kiln-forum"
  },
  {
    "id": "r4:guildhall:mountain:small:04",
    "type": "guildhall",
    "biome": "mountain",
    "size": "small",
    "variant": 4,
    "bounds": [
      50,
      12,
      50
    ],
    "wings": [
      [
        19,
        7,
        32,
        22
      ],
      [
        4,
        20,
        19,
        35
      ],
      [
        32,
        17,
        46,
        40
      ],
      [
        14,
        36,
        41,
        46
      ],
      [
        17,
        22,
        40,
        30
      ],
      [
        17,
        30,
        24,
        39
      ],
      [
        33,
        34,
        42,
        43
      ],
      [
        6,
        33,
        15,
        46
      ]
    ],
    "notches": [
      [
        25,
        32,
        30,
        36
      ]
    ],
    "octagons": [],
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
        "fixed": 19,
        "from": 22,
        "to": 27,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 32,
        "from": 20,
        "to": 28,
        "door": 24,
        "facing": "east"
      }
    ],
    "windows": [
      [
        4,
        27,
        "west"
      ],
      [
        46,
        26,
        "east"
      ],
      [
        27,
        46,
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
        6,
        40,
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
        26
      ],
      [
        40,
        25
      ],
      [
        27,
        43
      ],
      [
        9,
        39
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "cliff-hoist-masters",
        "kind": "gathering-hall",
        "rect": [
          21,
          10,
          30,
          19
        ]
      },
      {
        "id": "lift-rigging",
        "kind": "shared-facility",
        "rect": [
          6,
          23,
          17,
          32
        ]
      },
      {
        "id": "ridge-crane",
        "kind": "workshop",
        "rect": [
          35,
          20,
          44,
          37
        ]
      },
      {
        "id": "stone-chisel-ledgers",
        "kind": "guild-ledger",
        "rect": [
          17,
          40,
          39,
          45
        ]
      },
      {
        "id": "suspension-gallery",
        "kind": "artisan-study",
        "rect": [
          8,
          37,
          13,
          44
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          21,
          9,
          31,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          6,
          23,
          17,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          35,
          20,
          44,
          37
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          17,
          40,
          39,
          45
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          8,
          37,
          13,
          44
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "mountain-quarry-elevator-angled-spur",
      50,
      12,
      50
    ],
    "profile": "mountain-quarry-elevator-angled-spur"
  },
  {
    "id": "r4:guildhall:enchanted-forest:medium:04",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 4,
    "bounds": [
      64,
      12,
      58
    ],
    "wings": [
      [
        26,
        7,
        40,
        23
      ],
      [
        6,
        16,
        26,
        42
      ],
      [
        40,
        22,
        59,
        35
      ],
      [
        16,
        43,
        49,
        53
      ],
      [
        20,
        22,
        53,
        30
      ],
      [
        18,
        30,
        28,
        45
      ],
      [
        38,
        30,
        47,
        44
      ],
      [
        44,
        33,
        57,
        48
      ],
      [
        10,
        40,
        19,
        52
      ]
    ],
    "notches": [
      [
        30,
        33,
        35,
        39
      ]
    ],
    "octagons": [],
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
        "axis": "x",
        "fixed": 26,
        "from": 20,
        "to": 27,
        "door": 23,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 40,
        "from": 22,
        "to": 27,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 43,
        "from": 20,
        "to": 27,
        "door": 24,
        "facing": "north"
      }
    ],
    "windows": [
      [
        6,
        25,
        "west"
      ],
      [
        59,
        28,
        "east"
      ],
      [
        31,
        53,
        "north"
      ],
      [
        29,
        7,
        "south"
      ],
      [
        36,
        7,
        "south"
      ],
      [
        10,
        46,
        "west"
      ]
    ],
    "fixtures": [
      [
        33,
        14
      ],
      [
        12,
        26
      ],
      [
        51,
        28
      ],
      [
        33,
        49
      ],
      [
        51,
        42
      ],
      [
        15,
        46
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "moonbark-guild",
        "kind": "gathering-hall",
        "rect": [
          28,
          10,
          39,
          20
        ]
      },
      {
        "id": "spore-luminary",
        "kind": "shared-facility",
        "rect": [
          8,
          20,
          23,
          37
        ]
      },
      {
        "id": "sap-printery",
        "kind": "workshop",
        "rect": [
          44,
          25,
          57,
          33
        ]
      },
      {
        "id": "grove-license-gallery",
        "kind": "guild-ledger",
        "rect": [
          19,
          47,
          47,
          52
        ]
      },
      {
        "id": "petal-scriptorium",
        "kind": "artisan-study",
        "rect": [
          48,
          37,
          55,
          46
        ]
      },
      {
        "id": "amber-root-records",
        "kind": "artisan-study",
        "rect": [
          12,
          44,
          17,
          50
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          28,
          9,
          39,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          20,
          23,
          37
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          44,
          25,
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
          47,
          47,
          52
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          48,
          37,
          55,
          46
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "forest-moonbark-guild-scriptorium",
      64,
      12,
      58
    ],
    "profile": "forest-moonbark-guild-scriptorium"
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
export function buildM2RegionalCourts(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2RegionalCourts(){return PLANS.map(author);}
export const M2_REGIONAL_COURTS_IDS=Object.freeze(PLANS.map(p=>p.id));
