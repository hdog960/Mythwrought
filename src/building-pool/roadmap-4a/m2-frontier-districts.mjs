// Builder 4A M2 regional architecture — eight uniquely authored trade and council districts.
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
    "id": "r4:civic-hall:desert:large:05",
    "type": "civic-hall",
    "biome": "desert",
    "size": "large",
    "variant": 5,
    "bounds": [
      85,
      12,
      67
    ],
    "wings": [
      [
        33,
        7,
        51,
        26
      ],
      [
        7,
        19,
        32,
        40
      ],
      [
        52,
        17,
        75,
        38
      ],
      [
        22,
        49,
        61,
        60
      ],
      [
        24,
        25,
        62,
        34
      ],
      [
        21,
        33,
        33,
        50
      ],
      [
        48,
        33,
        59,
        50
      ],
      [
        33,
        32,
        47,
        48
      ],
      [
        73,
        35,
        82,
        55
      ],
      [
        4,
        37,
        17,
        55
      ]
    ],
    "notches": [
      [
        36,
        37,
        42,
        43
      ]
    ],
    "octagons": [],
    "entry": [
      42,
      7
    ],
    "porch": [
      39,
      3,
      45,
      6
    ],
    "partitions": [],
    "windows": [
      [
        7,
        28,
        "west"
      ],
      [
        75,
        25,
        "east"
      ],
      [
        41,
        60,
        "north"
      ],
      [
        38,
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
        45,
        "east"
      ],
      [
        4,
        46,
        "west"
      ]
    ],
    "fixtures": [
      [
        42,
        14
      ],
      [
        15,
        27
      ],
      [
        64,
        25
      ],
      [
        40,
        56
      ],
      [
        77,
        47
      ],
      [
        10,
        46
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
        "id": "sunken-meridian-assembly",
        "kind": "meeting",
        "rect": [
          35,
          10,
          49,
          22
        ]
      },
      {
        "id": "west-oasis-title-jury",
        "kind": "administration",
        "rect": [
          10,
          23,
          29,
          37
        ]
      },
      {
        "id": "east-salt-caravan-duties",
        "kind": "registry",
        "rect": [
          55,
          20,
          73,
          35
        ]
      },
      {
        "id": "north-mirage-truce-library",
        "kind": "public-hearing",
        "rect": [
          26,
          53,
          59,
          59
        ]
      },
      {
        "id": "outer-east-date-palm-permits",
        "kind": "records",
        "rect": [
          75,
          40,
          80,
          53
        ]
      },
      {
        "id": "west-sandstorm-petitions",
        "kind": "civic-archive",
        "rect": [
          6,
          41,
          15,
          53
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          35,
          9,
          49,
          22
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          10,
          23,
          29,
          37
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          55,
          20,
          73,
          35
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          26,
          53,
          59,
          59
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          75,
          40,
          80,
          53
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          6,
          41,
          15,
          53
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "desert-meridian-six-court-forum",
    "signature": [
      "desert-meridian-six-court-forum",
      85,
      12,
      67
    ]
  },
  {
    "id": "r4:civic-hall:snow:small:05",
    "type": "civic-hall",
    "biome": "snow",
    "size": "small",
    "variant": 5,
    "bounds": [
      55,
      12,
      51
    ],
    "wings": [
      [
        19,
        7,
        35,
        23
      ],
      [
        5,
        17,
        20,
        35
      ],
      [
        36,
        19,
        50,
        37
      ],
      [
        13,
        38,
        43,
        46
      ],
      [
        15,
        22,
        41,
        31
      ],
      [
        14,
        30,
        24,
        42
      ],
      [
        31,
        30,
        41,
        42
      ],
      [
        3,
        31,
        14,
        46
      ]
    ],
    "notches": [
      [
        26,
        34,
        28,
        36
      ]
    ],
    "octagons": [],
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
        25,
        "west"
      ],
      [
        50,
        26,
        "east"
      ],
      [
        28,
        46,
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
        3,
        39,
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
        26
      ],
      [
        43,
        27
      ],
      [
        28,
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
        "id": "snow-flood-relief-council",
        "kind": "meeting",
        "rect": [
          21,
          10,
          33,
          20
        ]
      },
      {
        "id": "west-warmth-rights",
        "kind": "administration",
        "rect": [
          7,
          21,
          17,
          33
        ]
      },
      {
        "id": "east-iceway-travel-license",
        "kind": "registry",
        "rect": [
          39,
          23,
          48,
          34
        ]
      },
      {
        "id": "north-cold-harbor-hearing",
        "kind": "public-hearing",
        "rect": [
          16,
          41,
          41,
          45
        ]
      },
      {
        "id": "outer-west-blanket-register",
        "kind": "records",
        "rect": [
          5,
          36,
          12,
          44
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
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          7,
          21,
          17,
          33
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          39,
          23,
          48,
          34
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          16,
          41,
          41,
          45
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          36,
          12,
          44
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "snow-harbor-relief-council-offset-west",
    "signature": [
      "snow-harbor-relief-council-offset-west",
      55,
      12,
      51
    ]
  },
  {
    "id": "r4:civic-hall:enchanted-forest:large:04",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 4,
    "bounds": [
      84,
      12,
      70
    ],
    "wings": [
      [
        32,
        7,
        51,
        27
      ],
      [
        5,
        20,
        31,
        45
      ],
      [
        52,
        17,
        77,
        39
      ],
      [
        19,
        51,
        64,
        63
      ],
      [
        22,
        25,
        64,
        35
      ],
      [
        20,
        34,
        34,
        52
      ],
      [
        48,
        33,
        60,
        53
      ],
      [
        34,
        33,
        49,
        49
      ],
      [
        70,
        35,
        82,
        60
      ],
      [
        4,
        41,
        18,
        59
      ],
      [
        73,
        58,
        78,
        65
      ],
      [
        68,
        63,
        82,
        68
      ]
    ],
    "notches": [
      [
        37,
        38,
        43,
        44
      ]
    ],
    "octagons": [],
    "entry": [
      42,
      7
    ],
    "porch": [
      39,
      3,
      45,
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
        77,
        27,
        "east"
      ],
      [
        41,
        63,
        "north"
      ],
      [
        38,
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
        48,
        "east"
      ],
      [
        4,
        50,
        "west"
      ],
      [
        82,
        66,
        "east"
      ]
    ],
    "fixtures": [
      [
        42,
        15
      ],
      [
        14,
        28
      ],
      [
        65,
        27
      ],
      [
        42,
        58
      ],
      [
        75,
        48
      ],
      [
        10,
        48
      ],
      [
        28,
        41
      ],
      [
        75,
        66
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "greatbough-charter-chamber",
        "kind": "meeting",
        "rect": [
          35,
          10,
          49,
          24
        ]
      },
      {
        "id": "western-lantern-covenant",
        "kind": "administration",
        "rect": [
          9,
          24,
          28,
          41
        ]
      },
      {
        "id": "eastern-spore-trade-accord",
        "kind": "registry",
        "rect": [
          56,
          22,
          74,
          35
        ]
      },
      {
        "id": "northern-moonroot-jury",
        "kind": "public-hearing",
        "rect": [
          22,
          55,
          62,
          62
        ]
      },
      {
        "id": "outboard-petal-inspection",
        "kind": "records",
        "rect": [
          73,
          41,
          80,
          57
        ]
      },
      {
        "id": "western-mushroom-medial",
        "kind": "civic-archive",
        "rect": [
          7,
          46,
          16,
          57
        ]
      },
      {
        "id": "upper-root-treaty-hearing",
        "kind": "public-hearing",
        "rect": [
          70,
          64,
          80,
          67
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          35,
          9,
          49,
          24
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          9,
          24,
          28,
          41
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          56,
          22,
          74,
          35
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          22,
          55,
          62,
          62
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          73,
          41,
          80,
          57
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          46,
          16,
          57
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          70,
          64,
          81,
          67
        ],
        "profile": "saw",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "enchanted-forest-greatbough-sixwing-high-court",
    "signature": [
      "enchanted-forest-greatbough-sixwing-high-court",
      84,
      12,
      70
    ]
  },
  {
    "id": "r4:civic-hall:mountain:medium:05",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "medium",
    "variant": 5,
    "bounds": [
      72,
      12,
      62
    ],
    "wings": [
      [
        27,
        7,
        45,
        26
      ],
      [
        6,
        21,
        27,
        43
      ],
      [
        45,
        18,
        66,
        40
      ],
      [
        18,
        46,
        54,
        56
      ],
      [
        20,
        25,
        56,
        34
      ],
      [
        19,
        34,
        31,
        48
      ],
      [
        42,
        33,
        53,
        48
      ],
      [
        31,
        32,
        43,
        45
      ],
      [
        62,
        37,
        70,
        54
      ],
      [
        4,
        42,
        17,
        57
      ]
    ],
    "notches": [
      [
        34,
        36,
        39,
        41
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
    "partitions": [],
    "windows": [
      [
        6,
        28,
        "west"
      ],
      [
        66,
        27,
        "east"
      ],
      [
        35,
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
        70,
        46,
        "east"
      ],
      [
        4,
        50,
        "west"
      ]
    ],
    "fixtures": [
      [
        36,
        14
      ],
      [
        14,
        30
      ],
      [
        56,
        26
      ],
      [
        36,
        52
      ],
      [
        66,
        46
      ],
      [
        10,
        51
      ],
      [
        25,
        40
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "stone-pass-treaty-council",
        "kind": "meeting",
        "rect": [
          29,
          10,
          43,
          23
        ]
      },
      {
        "id": "western-avalanche-claims",
        "kind": "administration",
        "rect": [
          9,
          25,
          24,
          39
        ]
      },
      {
        "id": "eastern-quarry-survey",
        "kind": "registry",
        "rect": [
          49,
          22,
          63,
          37
        ]
      },
      {
        "id": "northern-bridge-ordinance",
        "kind": "public-hearing",
        "rect": [
          21,
          49,
          52,
          55
        ]
      },
      {
        "id": "east-toll-weight-judges",
        "kind": "records",
        "rect": [
          64,
          42,
          69,
          52
        ]
      },
      {
        "id": "west-cairn-relief",
        "kind": "records",
        "rect": [
          6,
          46,
          15,
          55
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          29,
          9,
          43,
          23
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          9,
          25,
          24,
          39
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          49,
          22,
          63,
          37
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          21,
          49,
          52,
          55
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          64,
          42,
          69,
          52
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          6,
          46,
          15,
          55
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "mountain-saddle-road-adjudication-fan",
    "signature": [
      "mountain-saddle-road-adjudication-fan",
      72,
      12,
      62
    ]
  },
  {
    "id": "r4:guildhall:temperate:large:04",
    "type": "guildhall",
    "biome": "temperate",
    "size": "large",
    "variant": 4,
    "bounds": [
      83,
      12,
      69
    ],
    "wings": [
      [
        31,
        7,
        51,
        27
      ],
      [
        5,
        17,
        31,
        45
      ],
      [
        51,
        21,
        74,
        42
      ],
      [
        18,
        48,
        61,
        61
      ],
      [
        22,
        25,
        61,
        34
      ],
      [
        20,
        32,
        33,
        50
      ],
      [
        47,
        33,
        57,
        50
      ],
      [
        33,
        33,
        48,
        46
      ],
      [
        72,
        37,
        81,
        59
      ],
      [
        4,
        43,
        18,
        60
      ],
      [
        6,
        59,
        16,
        64
      ],
      [
        3,
        62,
        21,
        68
      ]
    ],
    "notches": [
      [
        38,
        36,
        44,
        43
      ]
    ],
    "octagons": [],
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
    "partitions": [],
    "windows": [
      [
        5,
        29,
        "west"
      ],
      [
        74,
        29,
        "east"
      ],
      [
        42,
        61,
        "north"
      ],
      [
        37,
        7,
        "south"
      ],
      [
        46,
        7,
        "south"
      ],
      [
        81,
        46,
        "east"
      ],
      [
        4,
        51,
        "west"
      ],
      [
        12,
        68,
        "north"
      ]
    ],
    "fixtures": [
      [
        41,
        15
      ],
      [
        14,
        28
      ],
      [
        63,
        29
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
        10,
        50
      ],
      [
        28,
        39
      ],
      [
        10,
        65
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "river-barge-masters-congress",
        "kind": "gathering-hall",
        "rect": [
          34,
          10,
          49,
          23
        ]
      },
      {
        "id": "west-net-loomworks",
        "kind": "shared-facility",
        "rect": [
          9,
          22,
          28,
          40
        ]
      },
      {
        "id": "east-sluice-gate-forge",
        "kind": "workshop",
        "rect": [
          54,
          24,
          71,
          38
        ]
      },
      {
        "id": "north-sail-contracts",
        "kind": "guild-ledger",
        "rect": [
          22,
          52,
          58,
          60
        ]
      },
      {
        "id": "outer-east-rudder-calibration",
        "kind": "artisan-study",
        "rect": [
          74,
          42,
          79,
          57
        ]
      },
      {
        "id": "west-canalside-wheelwright",
        "kind": "artisan-study",
        "rect": [
          7,
          48,
          16,
          58
        ]
      },
      {
        "id": "southern-canalside-oar-woodshop",
        "kind": "workshop",
        "rect": [
          5,
          64,
          19,
          67
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          34,
          9,
          49,
          23
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          9,
          22,
          28,
          40
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          54,
          24,
          71,
          38
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          22,
          52,
          58,
          60
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          74,
          42,
          79,
          57
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          48,
          16,
          58
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          64,
          19,
          67
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "temperate-river-barge-master-forked-shipyard",
    "signature": [
      "temperate-river-barge-master-forked-shipyard",
      83,
      12,
      69
    ]
  },
  {
    "id": "r4:guildhall:desert:medium:04",
    "type": "guildhall",
    "biome": "desert",
    "size": "medium",
    "variant": 4,
    "bounds": [
      69,
      12,
      62
    ],
    "wings": [
      [
        25,
        7,
        43,
        26
      ],
      [
        6,
        19,
        25,
        42
      ],
      [
        43,
        21,
        62,
        40
      ],
      [
        16,
        46,
        52,
        55
      ],
      [
        20,
        24,
        55,
        33
      ],
      [
        19,
        32,
        30,
        47
      ],
      [
        41,
        31,
        52,
        48
      ],
      [
        30,
        32,
        42,
        45
      ],
      [
        58,
        37,
        67,
        54
      ],
      [
        3,
        40,
        16,
        57
      ],
      [
        61,
        52,
        65,
        57
      ],
      [
        53,
        55,
        68,
        60
      ]
    ],
    "notches": [
      [
        33,
        35,
        38,
        41
      ]
    ],
    "octagons": [],
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
        6,
        28,
        "west"
      ],
      [
        62,
        30,
        "east"
      ],
      [
        34,
        55,
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
        67,
        47,
        "east"
      ],
      [
        3,
        49,
        "west"
      ],
      [
        68,
        58,
        "east"
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
        54,
        30
      ],
      [
        34,
        51
      ],
      [
        63,
        47
      ],
      [
        10,
        50
      ],
      [
        25,
        38
      ],
      [
        62,
        58
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "indigo-caravan-dyers-council",
        "kind": "gathering-hall",
        "rect": [
          28,
          10,
          41,
          22
        ]
      },
      {
        "id": "west-loom-tension-gallery",
        "kind": "shared-facility",
        "rect": [
          9,
          22,
          23,
          39
        ]
      },
      {
        "id": "east-ceramic-dye-pots",
        "kind": "workshop",
        "rect": [
          47,
          24,
          59,
          37
        ]
      },
      {
        "id": "north-thread-licensing-ledger",
        "kind": "guild-ledger",
        "rect": [
          19,
          49,
          49,
          54
        ]
      },
      {
        "id": "outer-east-aroma-stillhouse",
        "kind": "artisan-study",
        "rect": [
          60,
          41,
          66,
          52
        ]
      },
      {
        "id": "west-dune-mordant-storage",
        "kind": "artisan-study",
        "rect": [
          5,
          45,
          14,
          55
        ]
      },
      {
        "id": "southern-citron-dye-filter-shop",
        "kind": "workshop",
        "rect": [
          56,
          57,
          66,
          59
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          28,
          9,
          41,
          22
        ],
        "profile": "shed",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          9,
          22,
          23,
          39
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          47,
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
          19,
          49,
          49,
          54
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          60,
          41,
          66,
          52
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          45,
          14,
          55
        ],
        "profile": "saw",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          56,
          57,
          66,
          59
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "desert-indigo-double-mordant-sun-cloister",
    "signature": [
      "desert-indigo-double-mordant-sun-cloister",
      69,
      12,
      62
    ]
  },
  {
    "id": "r4:guildhall:snow:large:04",
    "type": "guildhall",
    "biome": "snow",
    "size": "large",
    "variant": 4,
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
        27
      ],
      [
        5,
        18,
        31,
        46
      ],
      [
        51,
        17,
        76,
        40
      ],
      [
        20,
        48,
        64,
        61
      ],
      [
        22,
        26,
        64,
        34
      ],
      [
        20,
        34,
        32,
        50
      ],
      [
        49,
        33,
        60,
        50
      ],
      [
        33,
        32,
        49,
        47
      ],
      [
        72,
        36,
        83,
        57
      ],
      [
        5,
        44,
        19,
        62
      ],
      [
        73,
        55,
        78,
        62
      ],
      [
        63,
        60,
        81,
        66
      ]
    ],
    "notches": [
      [
        37,
        38,
        43,
        44
      ]
    ],
    "octagons": [],
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
    "partitions": [],
    "windows": [
      [
        5,
        29,
        "west"
      ],
      [
        76,
        27,
        "east"
      ],
      [
        42,
        61,
        "north"
      ],
      [
        37,
        7,
        "south"
      ],
      [
        46,
        7,
        "south"
      ],
      [
        83,
        46,
        "east"
      ],
      [
        5,
        53,
        "west"
      ],
      [
        81,
        64,
        "east"
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
        64,
        28
      ],
      [
        42,
        57
      ],
      [
        77,
        47
      ],
      [
        12,
        53
      ],
      [
        27,
        40
      ],
      [
        74,
        63
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "glacier-bridge-builders-senate",
        "kind": "gathering-hall",
        "rect": [
          34,
          10,
          49,
          23
        ]
      },
      {
        "id": "western-sled-spar-tuning",
        "kind": "shared-facility",
        "rect": [
          8,
          22,
          28,
          42
        ]
      },
      {
        "id": "east-ice-cable-braiding",
        "kind": "workshop",
        "rect": [
          55,
          21,
          73,
          37
        ]
      },
      {
        "id": "northern-snowroad-contracts",
        "kind": "guild-ledger",
        "rect": [
          23,
          52,
          61,
          60
        ]
      },
      {
        "id": "outer-east-snowglass-housing",
        "kind": "artisan-study",
        "rect": [
          75,
          42,
          81,
          55
        ]
      },
      {
        "id": "outer-west-lantern-engineering",
        "kind": "artisan-study",
        "rect": [
          7,
          49,
          17,
          60
        ]
      },
      {
        "id": "northeast-ice-bridge-iceforge",
        "kind": "shared-facility",
        "rect": [
          66,
          62,
          79,
          65
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          34,
          9,
          49,
          23
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
          28,
          42
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          55,
          21,
          73,
          37
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          23,
          52,
          61,
          60
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          75,
          42,
          81,
          55
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          49,
          17,
          60
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          66,
          62,
          79,
          65
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "snow-glacier-bridge-builders-split-stair-guild",
    "signature": [
      "snow-glacier-bridge-builders-split-stair-guild",
      85,
      12,
      68
    ]
  },
  {
    "id": "r4:guildhall:mountain:large:04",
    "type": "guildhall",
    "biome": "mountain",
    "size": "large",
    "variant": 4,
    "bounds": [
      89,
      12,
      72
    ],
    "wings": [
      [
        34,
        7,
        54,
        27
      ],
      [
        5,
        22,
        34,
        46
      ],
      [
        54,
        17,
        80,
        43
      ],
      [
        20,
        52,
        67,
        65
      ],
      [
        23,
        26,
        68,
        35
      ],
      [
        21,
        34,
        35,
        53
      ],
      [
        51,
        34,
        64,
        54
      ],
      [
        35,
        33,
        51,
        49
      ],
      [
        77,
        38,
        87,
        63
      ],
      [
        4,
        44,
        20,
        63
      ]
    ],
    "notches": [
      [
        41,
        38,
        47,
        45
      ]
    ],
    "octagons": [],
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
        80,
        28,
        "east"
      ],
      [
        44,
        65,
        "north"
      ],
      [
        40,
        7,
        "south"
      ],
      [
        48,
        7,
        "south"
      ],
      [
        87,
        49,
        "east"
      ],
      [
        4,
        53,
        "west"
      ]
    ],
    "fixtures": [
      [
        44,
        15
      ],
      [
        14,
        31
      ],
      [
        68,
        29
      ],
      [
        44,
        61
      ],
      [
        81,
        51
      ],
      [
        11,
        54
      ],
      [
        29,
        41
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "cliffside-rivet-works-congress",
        "kind": "gathering-hall",
        "rect": [
          37,
          10,
          52,
          23
        ]
      },
      {
        "id": "western-stone-hoist-fabrication",
        "kind": "shared-facility",
        "rect": [
          9,
          26,
          31,
          42
        ]
      },
      {
        "id": "eastern-bridge-joint-assembly",
        "kind": "workshop",
        "rect": [
          58,
          21,
          77,
          39
        ]
      },
      {
        "id": "north-mountain-works-charters",
        "kind": "guild-ledger",
        "rect": [
          24,
          56,
          65,
          64
        ]
      },
      {
        "id": "outboard-east-rope-winch-platform",
        "kind": "artisan-study",
        "rect": [
          79,
          44,
          85,
          61
        ]
      },
      {
        "id": "west-ore-dragline-office",
        "kind": "artisan-study",
        "rect": [
          7,
          49,
          18,
          61
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          37,
          9,
          52,
          23
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          9,
          26,
          31,
          42
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          58,
          21,
          77,
          39
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          24,
          56,
          65,
          64
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          79,
          44,
          85,
          61
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          49,
          18,
          61
        ],
        "profile": "saw",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "profile": "mountain-high-fort-rivet-six-wing-causeway",
    "signature": [
      "mountain-high-fort-rivet-six-wing-causeway",
      89,
      12,
      72
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
export function buildM2FrontierDistricts(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2FrontierDistricts(){return PLANS.map(author);}
export const M2_FRONTIER_DISTRICTS_IDS=Object.freeze(PLANS.map(p=>p.id));
