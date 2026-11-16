// Builder 4A M2 regional architecture — eight genuinely distinct coordinate-authored civic/guild plans.
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
    "id": "r4:civic-hall:temperate:large:03",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "large",
    "variant": 3,
    "bounds": [
      64,
      12,
      56
    ],
    "wings": [
      [
        24,
        7,
        40,
        33
      ],
      [
        5,
        17,
        24,
        39
      ],
      [
        41,
        14,
        59,
        38
      ],
      [
        16,
        37,
        48,
        50
      ],
      [
        21,
        31,
        43,
        39
      ]
    ],
    "octagons": [],
    "notches": [
      [
        28,
        28,
        35,
        35
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
        "fixed": 24,
        "from": 19,
        "to": 32,
        "door": 26,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 40,
        "from": 17,
        "to": 32,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 39,
        "from": 24,
        "to": 44,
        "door": 32,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        24,
        "west"
      ],
      [
        59,
        25,
        "east"
      ],
      [
        31,
        50,
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
        24,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        32,
        16
      ],
      [
        10,
        25
      ],
      [
        54,
        25
      ],
      [
        32,
        46
      ],
      [
        23,
        43
      ],
      [
        44,
        42
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "river-fork-senate-audience",
        "kind": "meeting",
        "rect": [
          26,
          11,
          39,
          25
        ]
      },
      {
        "id": "western-petition-trades-court",
        "kind": "administration",
        "rect": [
          7,
          19,
          22,
          35
        ]
      },
      {
        "id": "east-merchant-civic-register",
        "kind": "registry",
        "rect": [
          43,
          16,
          57,
          35
        ]
      },
      {
        "id": "north-river-charter-chamber",
        "kind": "public-hearing",
        "rect": [
          18,
          41,
          46,
          49
        ]
      },
      {
        "id": "western-tally-depository",
        "kind": "civic-archive",
        "rect": [
          18,
          37,
          25,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          25,
          8,
          39,
          25
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          6,
          18,
          22,
          36
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          42,
          16,
          58,
          35
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          18,
          41,
          47,
          49
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "temperate-forked-river-senate",
      64,
      56,
      "west-petition-court",
      "east-merchant-registrar",
      "north-charter-bridge"
    ],
    "profile": "temperate-forked-river-senate"
  },
  {
    "id": "r4:civic-hall:desert:large:03",
    "type": "civic-hall",
    "biome": "desert",
    "size": "large",
    "variant": 3,
    "bounds": [
      66,
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
        14,
        25,
        40
      ],
      [
        41,
        21,
        63,
        31
      ],
      [
        18,
        37,
        51,
        51
      ],
      [
        21,
        28,
        39,
        41
      ]
    ],
    "octagons": [
      [
        31,
        27,
        10,
        15
      ]
    ],
    "notches": [
      [
        28,
        29,
        36,
        35
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
        "fixed": 25,
        "from": 17,
        "to": 30,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 41,
        "from": 21,
        "to": 31,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 39,
        "from": 23,
        "to": 40,
        "door": 32,
        "facing": "north"
      }
    ],
    "windows": [
      [
        7,
        24,
        "west"
      ],
      [
        63,
        25,
        "east"
      ],
      [
        32,
        51,
        "north"
      ],
      [
        29,
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
        15,
        "west"
      ]
    ],
    "fixtures": [
      [
        34,
        15
      ],
      [
        12,
        22
      ],
      [
        55,
        26
      ],
      [
        33,
        47
      ],
      [
        20,
        37
      ],
      [
        45,
        28
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "desert-lawgiver-court",
        "kind": "meeting",
        "rect": [
          29,
          11,
          40,
          23
        ]
      },
      {
        "id": "west-water-ration-docket",
        "kind": "administration",
        "rect": [
          9,
          16,
          23,
          36
        ]
      },
      {
        "id": "east-caravan-duty-records",
        "kind": "tax-records",
        "rect": [
          44,
          23,
          62,
          30
        ]
      },
      {
        "id": "north-oral-contract-archive",
        "kind": "archive",
        "rect": [
          21,
          42,
          50,
          50
        ]
      },
      {
        "id": "dune-appeals-cloister",
        "kind": "hearing-room",
        "rect": [
          23,
          36,
          31,
          40
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          29,
          8,
          41,
          24
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          15,
          24,
          38
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          43,
          22,
          62,
          30
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          20,
          42,
          50,
          50
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 5
      }
    ],
    "signature": [
      "desert-crescent-asymmetric-water-court",
      66,
      57,
      "western-elongated-water-wing",
      "east-low-tax-arm",
      "northern-contract-library"
    ],
    "profile": "desert-crescent-asymmetric-water-court"
  },
  {
    "id": "r4:civic-hall:snow:medium:04",
    "type": "civic-hall",
    "biome": "snow",
    "size": "medium",
    "variant": 4,
    "bounds": [
      50,
      12,
      48
    ],
    "wings": [
      [
        18,
        7,
        33,
        29
      ],
      [
        5,
        16,
        19,
        39
      ],
      [
        33,
        17,
        46,
        34
      ],
      [
        15,
        37,
        42,
        44
      ],
      [
        17,
        28,
        39,
        39
      ]
    ],
    "octagons": [],
    "notches": [
      [
        22,
        30,
        29,
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
        "fixed": 19,
        "from": 18,
        "to": 28,
        "door": 23,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 33,
        "from": 19,
        "to": 29,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 39,
        "from": 23,
        "to": 41,
        "door": 29,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        24,
        "west"
      ],
      [
        46,
        25,
        "east"
      ],
      [
        25,
        44,
        "north"
      ],
      [
        22,
        7,
        "south"
      ],
      [
        29,
        7,
        "south"
      ],
      [
        18,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        25,
        15
      ],
      [
        10,
        25
      ],
      [
        41,
        25
      ],
      [
        27,
        42
      ],
      [
        16,
        36
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "snow-trident-municipal-council",
        "kind": "meeting",
        "rect": [
          20,
          11,
          31,
          26
        ]
      },
      {
        "id": "western-ice-ration-hearing",
        "kind": "administration",
        "rect": [
          7,
          18,
          18,
          37
        ]
      },
      {
        "id": "east-snow-inspection-register",
        "kind": "records",
        "rect": [
          35,
          19,
          45,
          32
        ]
      },
      {
        "id": "north-winter-dispute-docket",
        "kind": "hearing-room",
        "rect": [
          18,
          39,
          40,
          43
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          19,
          8,
          32,
          27
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          6,
          18,
          18,
          37
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          35,
          19,
          45,
          33
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          17,
          39,
          40,
          43
        ],
        "profile": "shed",
        "axis": "x",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "snow-trident-cross-nave",
      50,
      48,
      "western-ration-ice-court",
      "eastern-surveyor-registration",
      "north-shelter"
    ],
    "profile": "snow-trident-cross-nave"
  },
  {
    "id": "r4:civic-hall:enchanted-forest:medium:03",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 3,
    "bounds": [
      53,
      12,
      49
    ],
    "wings": [
      [
        20,
        7,
        34,
        29
      ],
      [
        5,
        19,
        20,
        36
      ],
      [
        34,
        15,
        48,
        36
      ],
      [
        15,
        34,
        43,
        45
      ],
      [
        17,
        28,
        38,
        36
      ]
    ],
    "octagons": [
      [
        27,
        23,
        13,
        19
      ]
    ],
    "notches": [
      [
        24,
        32,
        29,
        37
      ]
    ],
    "entry": [
      27,
      7
    ],
    "porch": [
      24,
      3,
      30,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 20,
        "from": 20,
        "to": 31,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 34,
        "from": 18,
        "to": 32,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 36,
        "from": 31,
        "to": 38,
        "door": 32,
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
        48,
        24,
        "east"
      ],
      [
        26,
        45,
        "north"
      ],
      [
        24,
        7,
        "south"
      ],
      [
        30,
        7,
        "south"
      ],
      [
        20,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        27,
        15
      ],
      [
        11,
        26
      ],
      [
        42,
        26
      ],
      [
        25,
        42
      ],
      [
        17,
        37
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "forest-treaty-rotunda",
        "kind": "meeting",
        "rect": [
          21,
          12,
          34,
          27
        ]
      },
      {
        "id": "west-elder-petition-room",
        "kind": "administration",
        "rect": [
          7,
          21,
          19,
          35
        ]
      },
      {
        "id": "east-hollow-lichen-registry",
        "kind": "records",
        "rect": [
          36,
          17,
          47,
          34
        ]
      },
      {
        "id": "north-sapling-charter-archive",
        "kind": "public-archive",
        "rect": [
          17,
          38,
          41,
          44
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          21,
          8,
          33,
          26
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          6,
          20,
          19,
          34
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          36,
          17,
          47,
          35
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          17,
          39,
          42,
          44
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "forest-split-oak-rotunda-legal-arcade",
      53,
      49,
      "elder-west-appeal",
      "lichen-eastern-vault",
      "northern-sapling-witness"
    ],
    "profile": "forest-split-oak-rotunda-legal-arcade"
  },
  {
    "id": "r4:guildhall:temperate:small:03",
    "type": "guildhall",
    "biome": "temperate",
    "size": "small",
    "variant": 3,
    "bounds": [
      42,
      12,
      38
    ],
    "wings": [
      [
        14,
        7,
        27,
        25
      ],
      [
        4,
        15,
        14,
        29
      ],
      [
        27,
        14,
        38,
        29
      ],
      [
        18,
        28,
        30,
        34
      ]
    ],
    "octagons": [
      [
        22,
        22,
        8,
        12
      ]
    ],
    "notches": [
      [
        22,
        28,
        25,
        30
      ]
    ],
    "entry": [
      20,
      7
    ],
    "porch": [
      17,
      3,
      23,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 14,
        "from": 17,
        "to": 25,
        "door": 20,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 27,
        "from": 17,
        "to": 26,
        "door": 21,
        "facing": "east"
      }
    ],
    "windows": [
      [
        4,
        21,
        "west"
      ],
      [
        38,
        22,
        "east"
      ],
      [
        24,
        34,
        "north"
      ],
      [
        17,
        7,
        "south"
      ],
      [
        24,
        7,
        "south"
      ],
      [
        14,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        20,
        15
      ],
      [
        8,
        22
      ],
      [
        33,
        22
      ],
      [
        25,
        32
      ],
      [
        18,
        28
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "coopers-members-assembly",
        "kind": "gathering-hall",
        "rect": [
          16,
          11,
          26,
          24
        ]
      },
      {
        "id": "west-barrel-stave-bench",
        "kind": "shared-facility",
        "rect": [
          6,
          17,
          13,
          27
        ]
      },
      {
        "id": "east-hoop-fit-room",
        "kind": "workshop",
        "rect": [
          29,
          16,
          37,
          27
        ]
      },
      {
        "id": "north-seasoning-guild-records",
        "kind": "guild-ledger",
        "rect": [
          19,
          30,
          29,
          33
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          15,
          8,
          26,
          23
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          16,
          13,
          28
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          29,
          16,
          37,
          28
        ],
        "profile": "shed",
        "axis": "x",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          19,
          29,
          29,
          33
        ],
        "profile": "hip",
        "axis": "z",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "temperate-coopers-wheel-octagonal",
      42,
      38,
      "west-stave-gallery",
      "east-hoop-craft",
      "rear-seasoning"
    ],
    "profile": "temperate-coopers-wheel-octagonal"
  },
  {
    "id": "r4:guildhall:desert:small:03",
    "type": "guildhall",
    "biome": "desert",
    "size": "small",
    "variant": 3,
    "bounds": [
      41,
      12,
      40
    ],
    "wings": [
      [
        13,
        7,
        28,
        23
      ],
      [
        5,
        17,
        14,
        31
      ],
      [
        28,
        15,
        37,
        29
      ],
      [
        17,
        29,
        32,
        36
      ],
      [
        13,
        22,
        31,
        31
      ]
    ],
    "octagons": [],
    "notches": [
      [
        19,
        24,
        24,
        29
      ]
    ],
    "entry": [
      20,
      7
    ],
    "porch": [
      17,
      3,
      23,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 14,
        "from": 18,
        "to": 23,
        "door": 20,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 28,
        "from": 18,
        "to": 24,
        "door": 21,
        "facing": "east"
      }
    ],
    "windows": [
      [
        5,
        23,
        "west"
      ],
      [
        37,
        22,
        "east"
      ],
      [
        24,
        36,
        "north"
      ],
      [
        17,
        7,
        "south"
      ],
      [
        24,
        7,
        "south"
      ],
      [
        13,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        20,
        14
      ],
      [
        9,
        23
      ],
      [
        33,
        21
      ],
      [
        25,
        33
      ],
      [
        15,
        30
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "desert-shade-guild-assembly",
        "kind": "gathering-hall",
        "rect": [
          15,
          11,
          27,
          22
        ]
      },
      {
        "id": "western-twill-loom",
        "kind": "shared-facility",
        "rect": [
          7,
          19,
          13,
          29
        ]
      },
      {
        "id": "east-dyers-ore-room",
        "kind": "artisan-study",
        "rect": [
          30,
          17,
          36,
          28
        ]
      },
      {
        "id": "north-caravan-dye-ledger",
        "kind": "guild-ledger",
        "rect": [
          18,
          32,
          31,
          35
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          14,
          8,
          27,
          22
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          6,
          18,
          13,
          30
        ],
        "profile": "saw",
        "axis": "z",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          30,
          16,
          36,
          28
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          18,
          32,
          31,
          35
        ],
        "profile": "hip",
        "axis": "x",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "desert-dyers-u-forge-court",
      41,
      40,
      "western-loom",
      "east-sand-dye",
      "northern-caravan-account"
    ],
    "profile": "desert-dyers-u-forge-court"
  },
  {
    "id": "r4:guildhall:snow:medium:02",
    "type": "guildhall",
    "biome": "snow",
    "size": "medium",
    "variant": 2,
    "bounds": [
      54,
      12,
      49
    ],
    "wings": [
      [
        18,
        7,
        37,
        31
      ],
      [
        5,
        16,
        19,
        36
      ],
      [
        37,
        13,
        49,
        34
      ],
      [
        13,
        35,
        44,
        45
      ],
      [
        18,
        29,
        40,
        39
      ]
    ],
    "octagons": [
      [
        27,
        25,
        9,
        14
      ]
    ],
    "notches": [
      [
        22,
        31,
        31,
        36
      ]
    ],
    "entry": [
      27,
      7
    ],
    "porch": [
      24,
      3,
      30,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 19,
        "from": 18,
        "to": 31,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 37,
        "from": 17,
        "to": 30,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 40,
        "from": 23,
        "to": 43,
        "door": 28,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        24,
        "west"
      ],
      [
        49,
        22,
        "east"
      ],
      [
        28,
        45,
        "north"
      ],
      [
        24,
        7,
        "south"
      ],
      [
        31,
        7,
        "south"
      ],
      [
        18,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        26,
        15
      ],
      [
        12,
        25
      ],
      [
        44,
        23
      ],
      [
        29,
        43
      ],
      [
        18,
        39
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "winter-sledwright-master-floor",
        "kind": "gathering-hall",
        "rect": [
          20,
          11,
          35,
          25
        ]
      },
      {
        "id": "west-heated-runner-works",
        "kind": "shared-facility",
        "rect": [
          7,
          18,
          18,
          34
        ]
      },
      {
        "id": "east-harness-shed",
        "kind": "workshop",
        "rect": [
          39,
          15,
          48,
          32
        ]
      },
      {
        "id": "northern-repair-licenses",
        "kind": "guild-ledger",
        "rect": [
          16,
          39,
          42,
          44
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          19,
          8,
          35,
          25
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          6,
          18,
          18,
          35
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          39,
          15,
          48,
          33
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          16,
          39,
          43,
          44
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "snow-three-wing-runner-guild",
      54,
      49,
      "west-heated-works",
      "east-harness",
      "north-repair-license"
    ],
    "profile": "snow-three-wing-runner-guild"
  },
  {
    "id": "r4:guildhall:mountain:small:03",
    "type": "guildhall",
    "biome": "mountain",
    "size": "small",
    "variant": 3,
    "bounds": [
      43,
      12,
      46
    ],
    "wings": [
      [
        13,
        7,
        27,
        24
      ],
      [
        4,
        18,
        13,
        34
      ],
      [
        26,
        13,
        39,
        24
      ],
      [
        21,
        26,
        36,
        42
      ],
      [
        13,
        22,
        27,
        28
      ]
    ],
    "octagons": [
      [
        25,
        24,
        8,
        12
      ]
    ],
    "notches": [
      [
        15,
        25,
        19,
        30
      ]
    ],
    "entry": [
      20,
      7
    ],
    "porch": [
      17,
      3,
      23,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 13,
        "from": 18,
        "to": 25,
        "door": 22,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 26,
        "from": 14,
        "to": 24,
        "door": 19,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 28,
        "from": 23,
        "to": 35,
        "door": 27,
        "facing": "north"
      }
    ],
    "windows": [
      [
        4,
        24,
        "west"
      ],
      [
        39,
        19,
        "east"
      ],
      [
        27,
        42,
        "north"
      ],
      [
        17,
        7,
        "south"
      ],
      [
        23,
        7,
        "south"
      ],
      [
        13,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        19,
        14
      ],
      [
        8,
        26
      ],
      [
        34,
        19
      ],
      [
        28,
        38
      ],
      [
        22,
        32
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "quarry-kings-small-guild",
        "kind": "gathering-hall",
        "rect": [
          15,
          11,
          26,
          22
        ]
      },
      {
        "id": "west-dolomite-measure-shop",
        "kind": "shared-facility",
        "rect": [
          6,
          20,
          12,
          32
        ]
      },
      {
        "id": "east-ore-separation-labor",
        "kind": "workshop",
        "rect": [
          28,
          15,
          38,
          23
        ]
      },
      {
        "id": "north-survey-ledger-hall",
        "kind": "guild-ledger",
        "rect": [
          24,
          30,
          35,
          41
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          14,
          8,
          26,
          21
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          19,
          12,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          28,
          14,
          38,
          23
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          23,
          30,
          35,
          41
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "mountain-hook-hall-low-terrace",
      43,
      46,
      "north-east-survey-hook",
      "western-dolomite-longwing",
      "east-stone-grinding-loft"
    ],
    "profile": "mountain-hook-hall-low-terrace"
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
export function buildM2Districts(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2Districts(){return PLANS.map(author);}
export const M2_DISTRICT_IDS=Object.freeze(PLANS.map(p=>p.id));
