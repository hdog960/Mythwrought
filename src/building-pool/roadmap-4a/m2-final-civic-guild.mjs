// Builder 4A M2 regional architecture — ten independently authored final civic and guild candidates.
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
    "id": "r4:civic-hall:enchanted-forest:small:05",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 5,
    "bounds": [
      53,
      12,
      51
    ],
    "wings": [
      [
        18,
        7,
        35,
        24
      ],
      [
        5,
        19,
        20,
        38
      ],
      [
        35,
        23,
        49,
        35
      ],
      [
        14,
        39,
        42,
        47
      ],
      [
        16,
        23,
        39,
        31
      ],
      [
        15,
        30,
        25,
        42
      ],
      [
        33,
        30,
        42,
        42
      ],
      [
        43,
        32,
        51,
        45
      ]
    ],
    "notches": [
      [
        27,
        33,
        31,
        36
      ]
    ],
    "octagons": [
      [
        12,
        41,
        6,
        9
      ]
    ],
    "skyline": [
      [
        22,
        12,
        26,
        17,
        9
      ],
      [
        37,
        41,
        41,
        44,
        10
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
    "partitions": [],
    "windows": [
      [
        5,
        27,
        "west"
      ],
      [
        49,
        29,
        "east"
      ],
      [
        29,
        47,
        "north"
      ],
      [
        22,
        7,
        "south"
      ],
      [
        32,
        7,
        "south"
      ],
      [
        51,
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
        28
      ],
      [
        42,
        27
      ],
      [
        29,
        44
      ],
      [
        19,
        37
      ],
      [
        47,
        41
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "moonroot-bell-hall",
        "kind": "meeting",
        "rect": [
          20,
          10,
          33,
          20
        ]
      },
      {
        "id": "western-fernbound-petitions",
        "kind": "administration",
        "rect": [
          7,
          23,
          17,
          34
        ]
      },
      {
        "id": "east-orchid-court",
        "kind": "registry",
        "rect": [
          38,
          27,
          47,
          33
        ]
      },
      {
        "id": "north-lantern-judges",
        "kind": "public-hearing",
        "rect": [
          18,
          42,
          40,
          46
        ]
      },
      {
        "id": "west-amber-vault",
        "kind": "records",
        "rect": [
          10,
          37,
          17,
          45
        ]
      },
      {
        "id": "outer-east-moonpetal-arbitration",
        "kind": "public-hearing",
        "rect": [
          45,
          38,
          50,
          44
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          20,
          9,
          33,
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
          23,
          17,
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
          27,
          47,
          33
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          18,
          42,
          40,
          46
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          10,
          37,
          17,
          45
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          45,
          38,
          50,
          44
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "moonroot-crescent-octagonal-judiciary",
      53,
      12,
      51
    ],
    "profile": "moonroot-crescent-octagonal-judiciary"
  },
  {
    "id": "r4:civic-hall:enchanted-forest:large:05",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 5,
    "bounds": [
      89,
      12,
      74
    ],
    "wings": [
      [
        35,
        7,
        54,
        28
      ],
      [
        5,
        21,
        34,
        48
      ],
      [
        55,
        18,
        78,
        43
      ],
      [
        20,
        53,
        69,
        66
      ],
      [
        25,
        26,
        65,
        35
      ],
      [
        24,
        34,
        36,
        55
      ],
      [
        51,
        34,
        64,
        55
      ],
      [
        36,
        35,
        51,
        50
      ],
      [
        6,
        47,
        20,
        63
      ],
      [
        75,
        40,
        85,
        66
      ]
    ],
    "notches": [
      [
        39,
        38,
        47,
        44
      ]
    ],
    "octagons": [
      [
        44,
        36,
        11,
        15
      ],
      [
        17,
        52,
        8,
        12
      ]
    ],
    "skyline": [
      [
        41,
        12,
        49,
        20,
        11
      ],
      [
        59,
        26,
        65,
        33,
        9
      ],
      [
        26,
        55,
        30,
        59,
        9
      ]
    ],
    "entry": [
      44,
      7
    ],
    "porch": [
      41,
      3,
      47,
      6
    ],
    "partitions": [],
    "windows": [
      [
        5,
        31,
        "west"
      ],
      [
        78,
        27,
        "east"
      ],
      [
        43,
        66,
        "north"
      ],
      [
        39,
        7,
        "south"
      ],
      [
        49,
        7,
        "south"
      ],
      [
        85,
        53,
        "east"
      ],
      [
        6,
        55,
        "west"
      ],
      [
        69,
        61,
        "north"
      ]
    ],
    "fixtures": [
      [
        44,
        15
      ],
      [
        15,
        29
      ],
      [
        68,
        27
      ],
      [
        44,
        62
      ],
      [
        79,
        51
      ],
      [
        12,
        55
      ],
      [
        30,
        44
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "great-root-covenant",
        "kind": "meeting",
        "rect": [
          38,
          10,
          52,
          24
        ]
      },
      {
        "id": "western-lantern-tribunal",
        "kind": "administration",
        "rect": [
          9,
          25,
          31,
          43
        ]
      },
      {
        "id": "eastern-spore-charter",
        "kind": "registry",
        "rect": [
          58,
          22,
          75,
          39
        ]
      },
      {
        "id": "north-moonbough-assembly",
        "kind": "public-hearing",
        "rect": [
          23,
          56,
          67,
          65
        ]
      },
      {
        "id": "outer-east-wisp-inspection",
        "kind": "records",
        "rect": [
          77,
          45,
          84,
          63
        ]
      },
      {
        "id": "west-fern-sanctuary-claims",
        "kind": "civic-archive",
        "rect": [
          8,
          51,
          18,
          62
        ]
      },
      {
        "id": "high-sap-notary",
        "kind": "public-hearing",
        "rect": [
          39,
          46,
          49,
          49
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          38,
          9,
          52,
          24
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          9,
          25,
          31,
          43
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          58,
          22,
          75,
          39
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          23,
          56,
          67,
          65
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          77,
          45,
          84,
          63
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          51,
          18,
          62
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "grand-root-triple-dome-faceted-high-court",
      89,
      12,
      74
    ],
    "profile": "grand-root-triple-dome-faceted-high-court"
  },
  {
    "id": "r4:civic-hall:mountain:small:04",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "small",
    "variant": 4,
    "bounds": [
      54,
      12,
      55
    ],
    "wings": [
      [
        16,
        7,
        31,
        25
      ],
      [
        4,
        24,
        16,
        39
      ],
      [
        31,
        16,
        49,
        34
      ],
      [
        21,
        38,
        44,
        50
      ],
      [
        13,
        22,
        35,
        30
      ],
      [
        13,
        29,
        24,
        42
      ],
      [
        32,
        30,
        39,
        43
      ],
      [
        3,
        36,
        16,
        49
      ]
    ],
    "notches": [
      [
        26,
        32,
        31,
        37
      ]
    ],
    "octagons": [
      [
        40,
        39,
        7,
        10
      ]
    ],
    "skyline": [
      [
        19,
        12,
        23,
        17,
        10
      ],
      [
        36,
        42,
        41,
        46,
        9
      ]
    ],
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
    "partitions": [],
    "windows": [
      [
        4,
        29,
        "west"
      ],
      [
        49,
        26,
        "east"
      ],
      [
        30,
        50,
        "north"
      ],
      [
        19,
        7,
        "south"
      ],
      [
        27,
        7,
        "south"
      ],
      [
        3,
        43,
        "west"
      ],
      [
        45,
        44,
        "east"
      ]
    ],
    "fixtures": [
      [
        23,
        14
      ],
      [
        9,
        30
      ],
      [
        40,
        26
      ],
      [
        30,
        46
      ],
      [
        9,
        43
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "upland-bridge-treaties",
        "kind": "meeting",
        "rect": [
          18,
          10,
          29,
          21
        ]
      },
      {
        "id": "west-mountain-cairns",
        "kind": "administration",
        "rect": [
          6,
          27,
          14,
          36
        ]
      },
      {
        "id": "east-pass-checkpoint",
        "kind": "registry",
        "rect": [
          35,
          19,
          47,
          30
        ]
      },
      {
        "id": "north-stone-justice",
        "kind": "public-hearing",
        "rect": [
          24,
          42,
          42,
          49
        ]
      },
      {
        "id": "far-west-slope-register",
        "kind": "records",
        "rect": [
          5,
          40,
          14,
          47
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          18,
          9,
          29,
          21
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          6,
          27,
          14,
          36
        ],
        "profile": "saw",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          35,
          19,
          47,
          30
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          24,
          42,
          42,
          49
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          40,
          14,
          47
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "mountain-bridge-treaty-cliff-trident",
      54,
      12,
      55
    ],
    "profile": "mountain-bridge-treaty-cliff-trident"
  },
  {
    "id": "r4:civic-hall:mountain:small:05",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "small",
    "variant": 5,
    "bounds": [
      58,
      12,
      55
    ],
    "wings": [
      [
        24,
        7,
        39,
        21
      ],
      [
        4,
        17,
        22,
        32
      ],
      [
        39,
        22,
        54,
        45
      ],
      [
        12,
        38,
        43,
        51
      ],
      [
        19,
        20,
        47,
        28
      ],
      [
        13,
        28,
        24,
        43
      ],
      [
        33,
        27,
        45,
        39
      ],
      [
        24,
        38,
        33,
        47
      ],
      [
        3,
        31,
        12,
        47
      ]
    ],
    "notches": [
      [
        26,
        30,
        30,
        35
      ]
    ],
    "octagons": [
      [
        14,
        42,
        8,
        12
      ]
    ],
    "skyline": [
      [
        33,
        10,
        37,
        15,
        10
      ],
      [
        44,
        32,
        48,
        36,
        9
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
    "partitions": [],
    "windows": [
      [
        4,
        25,
        "west"
      ],
      [
        54,
        29,
        "east"
      ],
      [
        28,
        51,
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
        3,
        40,
        "west"
      ],
      [
        54,
        40,
        "east"
      ]
    ],
    "fixtures": [
      [
        32,
        13
      ],
      [
        10,
        25
      ],
      [
        46,
        28
      ],
      [
        29,
        48
      ],
      [
        7,
        40
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "saddle-granite-arbitration",
        "kind": "meeting",
        "rect": [
          26,
          10,
          37,
          18
        ]
      },
      {
        "id": "west-rockslide-record",
        "kind": "administration",
        "rect": [
          7,
          20,
          20,
          30
        ]
      },
      {
        "id": "east-toll-sled-requests",
        "kind": "registry",
        "rect": [
          42,
          26,
          52,
          40
        ]
      },
      {
        "id": "north-mountaineer-council",
        "kind": "public-hearing",
        "rect": [
          15,
          42,
          40,
          50
        ]
      },
      {
        "id": "west-ore-escrow",
        "kind": "records",
        "rect": [
          5,
          35,
          11,
          44
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          26,
          9,
          37,
          18
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
          20,
          30
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          42,
          26,
          52,
          40
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          15,
          42,
          40,
          50
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          35,
          11,
          44
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "saddle-cliff-offset-trust-hall",
      58,
      12,
      55
    ],
    "profile": "saddle-cliff-offset-trust-hall"
  },
  {
    "id": "r4:civic-hall:mountain:large:05",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "large",
    "variant": 5,
    "bounds": [
      91,
      12,
      74
    ],
    "wings": [
      [
        38,
        7,
        55,
        24
      ],
      [
        5,
        16,
        34,
        43
      ],
      [
        58,
        21,
        82,
        51
      ],
      [
        27,
        53,
        65,
        68
      ],
      [
        26,
        22,
        67,
        31
      ],
      [
        27,
        30,
        41,
        56
      ],
      [
        53,
        29,
        66,
        55
      ],
      [
        39,
        31,
        53,
        49
      ],
      [
        78,
        45,
        88,
        65
      ],
      [
        5,
        41,
        21,
        61
      ]
    ],
    "notches": [
      [
        43,
        35,
        49,
        45
      ]
    ],
    "octagons": [
      [
        49,
        33,
        13,
        18
      ],
      [
        17,
        50,
        9,
        12
      ]
    ],
    "skyline": [
      [
        42,
        12,
        50,
        20,
        11
      ],
      [
        65,
        41,
        70,
        48,
        10
      ],
      [
        34,
        56,
        38,
        60,
        9
      ]
    ],
    "entry": [
      46,
      7
    ],
    "porch": [
      43,
      3,
      49,
      6
    ],
    "partitions": [],
    "windows": [
      [
        5,
        27,
        "west"
      ],
      [
        82,
        29,
        "east"
      ],
      [
        46,
        68,
        "north"
      ],
      [
        42,
        7,
        "south"
      ],
      [
        50,
        7,
        "south"
      ],
      [
        88,
        53,
        "east"
      ],
      [
        5,
        52,
        "west"
      ]
    ],
    "fixtures": [
      [
        46,
        14
      ],
      [
        16,
        25
      ],
      [
        72,
        30
      ],
      [
        47,
        63
      ],
      [
        82,
        54
      ],
      [
        13,
        51
      ],
      [
        36,
        38
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "high-cliff-treaty-senate",
        "kind": "meeting",
        "rect": [
          40,
          10,
          53,
          20
        ]
      },
      {
        "id": "west-avalanche-tax-court",
        "kind": "administration",
        "rect": [
          9,
          21,
          31,
          40
        ]
      },
      {
        "id": "east-ore-pass-registrar",
        "kind": "registry",
        "rect": [
          61,
          26,
          79,
          46
        ]
      },
      {
        "id": "north-old-bridge-convocation",
        "kind": "public-hearing",
        "rect": [
          30,
          58,
          63,
          67
        ]
      },
      {
        "id": "eastern-ridge-land-rights",
        "kind": "records",
        "rect": [
          80,
          48,
          87,
          63
        ]
      },
      {
        "id": "western-cairn-refuge-ledgers",
        "kind": "civic-archive",
        "rect": [
          8,
          46,
          19,
          59
        ]
      },
      {
        "id": "middle-elevator-vault",
        "kind": "records",
        "rect": [
          40,
          46,
          51,
          48
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          40,
          9,
          53,
          20
        ],
        "profile": "gable",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          9,
          21,
          31,
          40
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          61,
          26,
          79,
          46
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          30,
          58,
          63,
          67
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          80,
          48,
          87,
          63
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          46,
          19,
          59
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "mountain-double-cairn-rotunda-civic-palace",
      91,
      12,
      74
    ],
    "profile": "mountain-double-cairn-rotunda-civic-palace"
  },
  {
    "id": "r4:guildhall:temperate:medium:03",
    "type": "guildhall",
    "biome": "temperate",
    "size": "medium",
    "variant": 3,
    "bounds": [
      70,
      12,
      62
    ],
    "wings": [
      [
        25,
        7,
        43,
        24
      ],
      [
        5,
        21,
        24,
        50
      ],
      [
        44,
        15,
        64,
        37
      ],
      [
        20,
        49,
        53,
        58
      ],
      [
        19,
        23,
        51,
        31
      ],
      [
        19,
        29,
        29,
        51
      ],
      [
        42,
        29,
        53,
        51
      ],
      [
        3,
        45,
        14,
        57
      ],
      [
        60,
        34,
        68,
        51
      ]
    ],
    "notches": [
      [
        33,
        33,
        38,
        41
      ]
    ],
    "octagons": [
      [
        57,
        43,
        8,
        11
      ]
    ],
    "skyline": [
      [
        31,
        12,
        37,
        16,
        10
      ],
      [
        9,
        28,
        13,
        32,
        9
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
    "partitions": [],
    "windows": [
      [
        5,
        29,
        "west"
      ],
      [
        64,
        26,
        "east"
      ],
      [
        34,
        58,
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
        3,
        51,
        "west"
      ],
      [
        68,
        43,
        "east"
      ]
    ],
    "fixtures": [
      [
        34,
        14
      ],
      [
        11,
        28
      ],
      [
        53,
        23
      ],
      [
        34,
        54
      ],
      [
        65,
        43
      ],
      [
        9,
        51
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "riverlock-sailwrights-assembly",
        "kind": "gathering-hall",
        "rect": [
          27,
          10,
          41,
          20
        ]
      },
      {
        "id": "west-loom-timber-docks",
        "kind": "shared-facility",
        "rect": [
          9,
          25,
          21,
          45
        ]
      },
      {
        "id": "east-gears-and-capstans",
        "kind": "workshop",
        "rect": [
          48,
          19,
          62,
          34
        ]
      },
      {
        "id": "north-boatwright-charters",
        "kind": "guild-ledger",
        "rect": [
          23,
          52,
          51,
          57
        ]
      },
      {
        "id": "far-west-pole-warehouse",
        "kind": "artisan-study",
        "rect": [
          5,
          49,
          12,
          56
        ]
      },
      {
        "id": "far-east-semaphore-office",
        "kind": "artisan-study",
        "rect": [
          61,
          39,
          67,
          49
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          27,
          9,
          41,
          21
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          9,
          25,
          21,
          45
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          48,
          19,
          62,
          34
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          23,
          52,
          51,
          57
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          61,
          39,
          67,
          49
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "temperate-canal-woodwright-anchor-rotunda",
      70,
      12,
      62
    ],
    "profile": "temperate-canal-woodwright-anchor-rotunda"
  },
  {
    "id": "r4:guildhall:snow:small:04",
    "type": "guildhall",
    "biome": "snow",
    "size": "small",
    "variant": 4,
    "bounds": [
      54,
      12,
      50
    ],
    "wings": [
      [
        19,
        7,
        34,
        24
      ],
      [
        5,
        18,
        18,
        36
      ],
      [
        34,
        23,
        50,
        38
      ],
      [
        13,
        38,
        39,
        46
      ],
      [
        15,
        21,
        39,
        30
      ],
      [
        13,
        29,
        23,
        40
      ],
      [
        31,
        29,
        41,
        41
      ]
    ],
    "notches": [
      [
        25,
        31,
        29,
        35
      ]
    ],
    "octagons": [
      [
        43,
        39,
        7,
        10
      ]
    ],
    "skyline": [
      [
        23,
        10,
        29,
        17,
        10
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
    "partitions": [],
    "windows": [
      [
        5,
        26,
        "west"
      ],
      [
        50,
        27,
        "east"
      ],
      [
        27,
        46,
        "north"
      ],
      [
        23,
        7,
        "south"
      ],
      [
        31,
        7,
        "south"
      ],
      [
        19,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        27,
        14
      ],
      [
        10,
        25
      ],
      [
        43,
        29
      ],
      [
        26,
        43
      ],
      [
        39,
        41
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "winter-clockwrights-gathering",
        "kind": "gathering-hall",
        "rect": [
          21,
          10,
          32,
          20
        ]
      },
      {
        "id": "west-tin-windup-studio",
        "kind": "shared-facility",
        "rect": [
          7,
          22,
          16,
          34
        ]
      },
      {
        "id": "east-frost-bell-assembly",
        "kind": "workshop",
        "rect": [
          37,
          26,
          48,
          35
        ]
      },
      {
        "id": "north-sledtime-certificates",
        "kind": "guild-ledger",
        "rect": [
          17,
          40,
          37,
          45
        ]
      },
      {
        "id": "circular-chime-test-room",
        "kind": "artisan-study",
        "rect": [
          38,
          38,
          46,
          44
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          21,
          9,
          32,
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
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          37,
          26,
          48,
          35
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          17,
          40,
          37,
          45
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "snow-bellclock-elliptical-trade-hall",
      54,
      12,
      50
    ],
    "profile": "snow-bellclock-elliptical-trade-hall"
  },
  {
    "id": "r4:guildhall:snow:medium:03",
    "type": "guildhall",
    "biome": "snow",
    "size": "medium",
    "variant": 3,
    "bounds": [
      72,
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
        4,
        17,
        27,
        43
      ],
      [
        45,
        20,
        66,
        40
      ],
      [
        21,
        50,
        58,
        58
      ],
      [
        21,
        24,
        54,
        32
      ],
      [
        20,
        31,
        31,
        51
      ],
      [
        47,
        29,
        55,
        52
      ],
      [
        5,
        41,
        18,
        57
      ],
      [
        62,
        39,
        70,
        56
      ]
    ],
    "notches": [
      [
        33,
        35,
        42,
        43
      ]
    ],
    "octagons": [
      [
        59,
        43,
        8,
        12
      ]
    ],
    "skyline": [
      [
        31,
        12,
        40,
        18,
        10
      ],
      [
        10,
        42,
        15,
        47,
        9
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
    "partitions": [],
    "windows": [
      [
        4,
        28,
        "west"
      ],
      [
        66,
        27,
        "east"
      ],
      [
        36,
        58,
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
        5,
        50,
        "west"
      ],
      [
        70,
        49,
        "east"
      ]
    ],
    "fixtures": [
      [
        36,
        15
      ],
      [
        12,
        27
      ],
      [
        55,
        27
      ],
      [
        36,
        54
      ],
      [
        66,
        48
      ],
      [
        10,
        50
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "snowglass-furnace-master-court",
        "kind": "gathering-hall",
        "rect": [
          30,
          10,
          42,
          22
        ]
      },
      {
        "id": "west-prism-grinder-bays",
        "kind": "shared-facility",
        "rect": [
          8,
          22,
          24,
          40
        ]
      },
      {
        "id": "east-ice-tube-pouring",
        "kind": "workshop",
        "rect": [
          49,
          24,
          64,
          36
        ]
      },
      {
        "id": "north-frostbeam-licenses",
        "kind": "guild-ledger",
        "rect": [
          24,
          53,
          56,
          57
        ]
      },
      {
        "id": "outside-west-ice-smelt",
        "kind": "artisan-study",
        "rect": [
          7,
          44,
          16,
          55
        ]
      },
      {
        "id": "faceted-glass-testing",
        "kind": "artisan-study",
        "rect": [
          57,
          42,
          65,
          53
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          30,
          9,
          42,
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
          24,
          40
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          49,
          24,
          64,
          36
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          24,
          53,
          56,
          57
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          57,
          42,
          65,
          53
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "snow-frost-conduit-domed-glass-guild",
      72,
      12,
      63
    ],
    "profile": "snow-frost-conduit-domed-glass-guild"
  },
  {
    "id": "r4:guildhall:enchanted-forest:small:04",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 4,
    "bounds": [
      56,
      12,
      54
    ],
    "wings": [
      [
        19,
        7,
        35,
        24
      ],
      [
        4,
        20,
        19,
        41
      ],
      [
        35,
        16,
        50,
        34
      ],
      [
        18,
        39,
        43,
        49
      ],
      [
        17,
        22,
        41,
        30
      ],
      [
        16,
        29,
        27,
        41
      ],
      [
        34,
        29,
        43,
        41
      ],
      [
        4,
        39,
        14,
        51
      ]
    ],
    "notches": [
      [
        25,
        32,
        29,
        36
      ]
    ],
    "octagons": [
      [
        42,
        43,
        8,
        10
      ]
    ],
    "skyline": [
      [
        25,
        11,
        29,
        15,
        9
      ],
      [
        39,
        35,
        43,
        38,
        9
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
    "partitions": [],
    "windows": [
      [
        4,
        27,
        "west"
      ],
      [
        50,
        26,
        "east"
      ],
      [
        27,
        49,
        "north"
      ],
      [
        23,
        7,
        "south"
      ],
      [
        32,
        7,
        "south"
      ],
      [
        4,
        45,
        "west"
      ]
    ],
    "fixtures": [
      [
        28,
        14
      ],
      [
        10,
        27
      ],
      [
        44,
        24
      ],
      [
        28,
        46
      ],
      [
        9,
        45
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "lute-root-master-guild",
        "kind": "gathering-hall",
        "rect": [
          21,
          10,
          33,
          20
        ]
      },
      {
        "id": "west-mycelium-vat-laboratory",
        "kind": "shared-facility",
        "rect": [
          7,
          24,
          17,
          37
        ]
      },
      {
        "id": "east-starwood-tone-studio",
        "kind": "workshop",
        "rect": [
          38,
          19,
          48,
          30
        ]
      },
      {
        "id": "north-songwood-licenses",
        "kind": "guild-ledger",
        "rect": [
          22,
          43,
          41,
          48
        ]
      },
      {
        "id": "west-root-dye-atelier",
        "kind": "artisan-study",
        "rect": [
          6,
          44,
          13,
          49
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          21,
          9,
          33,
          20
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          24,
          17,
          37
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          38,
          19,
          48,
          30
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          22,
          43,
          41,
          48
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "forest-lute-sporering-hexagonal-workshop",
      56,
      12,
      54
    ],
    "profile": "forest-lute-sporering-hexagonal-workshop"
  },
  {
    "id": "r4:guildhall:enchanted-forest:large:04",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 4,
    "bounds": [
      91,
      12,
      75
    ],
    "wings": [
      [
        35,
        7,
        55,
        27
      ],
      [
        5,
        19,
        34,
        49
      ],
      [
        55,
        20,
        80,
        43
      ],
      [
        22,
        54,
        69,
        68
      ],
      [
        26,
        25,
        65,
        35
      ],
      [
        25,
        35,
        39,
        56
      ],
      [
        52,
        34,
        65,
        56
      ],
      [
        39,
        32,
        53,
        51
      ],
      [
        4,
        45,
        22,
        64
      ],
      [
        75,
        40,
        87,
        64
      ],
      [
        69,
        61,
        89,
        72
      ],
      [
        2,
        57,
        13,
        72
      ]
    ],
    "notches": [
      [
        43,
        38,
        49,
        45
      ]
    ],
    "octagons": [
      [
        45,
        34,
        12,
        18
      ],
      [
        18,
        53,
        8,
        12
      ]
    ],
    "skyline": [
      [
        40,
        11,
        49,
        19,
        11
      ],
      [
        67,
        36,
        72,
        42,
        10
      ],
      [
        26,
        57,
        32,
        61,
        9
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
    "partitions": [],
    "windows": [
      [
        5,
        28,
        "west"
      ],
      [
        80,
        28,
        "east"
      ],
      [
        45,
        68,
        "north"
      ],
      [
        41,
        7,
        "south"
      ],
      [
        49,
        7,
        "south"
      ],
      [
        87,
        52,
        "east"
      ],
      [
        4,
        55,
        "west"
      ],
      [
        89,
        69,
        "east"
      ],
      [
        2,
        67,
        "west"
      ]
    ],
    "fixtures": [
      [
        45,
        15
      ],
      [
        13,
        27
      ],
      [
        69,
        28
      ],
      [
        45,
        64
      ],
      [
        80,
        53
      ],
      [
        11,
        54
      ],
      [
        34,
        41
      ],
      [
        81,
        68
      ],
      [
        7,
        67
      ]
    ],
    "ridges": [],
    "rooms": [
      {
        "id": "luminant-rootmaster-congress",
        "kind": "gathering-hall",
        "rect": [
          38,
          10,
          53,
          23
        ]
      },
      {
        "id": "west-amber-glass-blowers",
        "kind": "shared-facility",
        "rect": [
          9,
          24,
          31,
          44
        ]
      },
      {
        "id": "east-hollowwood-joinery",
        "kind": "workshop",
        "rect": [
          60,
          24,
          77,
          39
        ]
      },
      {
        "id": "north-great-guild-charters",
        "kind": "guild-ledger",
        "rect": [
          25,
          58,
          67,
          67
        ]
      },
      {
        "id": "east-moonbough-cabinetry",
        "kind": "artisan-study",
        "rect": [
          78,
          45,
          85,
          61
        ]
      },
      {
        "id": "west-starlight-ink-vault",
        "kind": "artisan-study",
        "rect": [
          8,
          49,
          20,
          61
        ]
      },
      {
        "id": "great-grove-mediation-bay",
        "kind": "guild-ledger",
        "rect": [
          40,
          47,
          52,
          50
        ]
      },
      {
        "id": "far-northeast-sap-vault-study",
        "kind": "artisan-study",
        "rect": [
          73,
          66,
          87,
          71
        ]
      },
      {
        "id": "far-west-firefly-inkworks",
        "kind": "artisan-study",
        "rect": [
          4,
          65,
          11,
          71
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          38,
          9,
          53,
          23
        ],
        "profile": "hip",
        "axis": "x",
        "high": 11,
        "period": 4
      },
      {
        "rect": [
          9,
          24,
          31,
          44
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          60,
          24,
          77,
          39
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          25,
          58,
          67,
          67
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          78,
          45,
          85,
          61
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          8,
          49,
          20,
          61
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          73,
          66,
          87,
          71
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          4,
          65,
          11,
          71
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "forest-grand-mushroom-dome-craft-courtyard",
      91,
      12,
      75
    ],
    "profile": "forest-grand-mushroom-dome-craft-courtyard"
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
export function buildM2FinalCivicGuild(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2FinalCivicGuild(){return PLANS.map(author);}
export const M2_FINAL_CIVIC_GUILD_IDS=Object.freeze(PLANS.map(p=>p.id));
