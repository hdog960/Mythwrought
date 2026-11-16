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
    "id": "r4:civic-hall:temperate:medium:03",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "medium",
    "variant": 3,
    "bounds": [
      48,
      12,
      44
    ],
    "wings": [
      [
        13,
        7,
        31,
        31
      ],
      [
        3,
        17,
        14,
        29
      ],
      [
        30,
        13,
        44,
        28
      ],
      [
        17,
        30,
        38,
        40
      ]
    ],
    "octagons": [],
    "notches": [
      [
        20,
        21,
        25,
        26
      ]
    ],
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
    "partitions": [
      {
        "axis": "x",
        "fixed": 14,
        "from": 18,
        "to": 27,
        "door": 22,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 30,
        "from": 16,
        "to": 27,
        "door": 22,
        "facing": "east"
      }
    ],
    "windows": [
      [
        3,
        21,
        "west"
      ],
      [
        44,
        20,
        "east"
      ],
      [
        23,
        40,
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
        13,
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
        17,
        29
      ],
      [
        28,
        29
      ],
      [
        7,
        24
      ],
      [
        38,
        22
      ],
      [
        28,
        37
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "south-council-floor",
        "kind": "meeting",
        "rect": [
          16,
          11,
          29,
          19
        ]
      },
      {
        "id": "western-petition-cloister",
        "kind": "administration",
        "rect": [
          5,
          19,
          13,
          28
        ]
      },
      {
        "id": "east-civic-seal-office",
        "kind": "charter-office",
        "rect": [
          33,
          15,
          43,
          27
        ]
      },
      {
        "id": "northern-house-of-registers",
        "kind": "public-registry",
        "rect": [
          19,
          32,
          37,
          39
        ]
      },
      {
        "id": "east-appeals-gallery",
        "kind": "public-hearing",
        "rect": [
          26,
          28,
          30,
          30
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          15,
          8,
          30,
          19
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          4,
          18,
          13,
          28
        ],
        "profile": "shed",
        "axis": "z",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          32,
          15,
          43,
          27
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          18,
          32,
          37,
          39
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      }
    ],
    "signature": [
      "temperate-ring-council-open-hex-court",
      48,
      44,
      "southern-assembly",
      "west-petition",
      "east-registry",
      "open-air-hexagon"
    ],
    "profile": "temperate-ring-council-open-hex-court"
  },
  {
    "id": "r4:civic-hall:desert:small:03",
    "type": "civic-hall",
    "biome": "desert",
    "size": "small",
    "variant": 3,
    "bounds": [
      40,
      12,
      37
    ],
    "wings": [
      [
        13,
        7,
        24,
        16
      ],
      [
        5,
        15,
        13,
        28
      ],
      [
        25,
        14,
        35,
        27
      ],
      [
        16,
        26,
        29,
        33
      ]
    ],
    "octagons": [
      [
        20,
        21,
        11,
        16
      ]
    ],
    "notches": [],
    "entry": [
      18,
      7
    ],
    "porch": [
      15,
      3,
      21,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 12,
        "from": 17,
        "to": 24,
        "door": 21,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 26,
        "from": 17,
        "to": 25,
        "door": 20,
        "facing": "east"
      }
    ],
    "windows": [
      [
        5,
        20,
        "west"
      ],
      [
        35,
        20,
        "east"
      ],
      [
        22,
        33,
        "north"
      ],
      [
        15,
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
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        18,
        13
      ],
      [
        20,
        22
      ],
      [
        9,
        24
      ],
      [
        30,
        22
      ],
      [
        22,
        31
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "sun-spoke-council-hall",
        "kind": "meeting",
        "rect": [
          15,
          12,
          25,
          26
        ]
      },
      {
        "id": "west-merchant-petition",
        "kind": "administration",
        "rect": [
          6,
          17,
          12,
          27
        ]
      },
      {
        "id": "east-dune-tax-docket",
        "kind": "registry",
        "rect": [
          27,
          16,
          34,
          26
        ]
      },
      {
        "id": "north-public-stamp-office",
        "kind": "records",
        "rect": [
          17,
          28,
          28,
          32
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          14,
          8,
          24,
          15
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          6,
          17,
          12,
          27
        ],
        "profile": "shed",
        "axis": "z",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          26,
          16,
          34,
          26
        ],
        "profile": "saw",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          17,
          27,
          28,
          32
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "desert-faceted-sun-spoke-court",
      40,
      37,
      "radiating-tax-east",
      "petition-west",
      "northern-registrar"
    ],
    "profile": "desert-faceted-sun-spoke-court"
  },
  {
    "id": "r4:civic-hall:snow:large:03",
    "type": "civic-hall",
    "biome": "snow",
    "size": "large",
    "variant": 3,
    "bounds": [
      67,
      12,
      58
    ],
    "wings": [
      [
        22,
        8,
        43,
        44
      ],
      [
        4,
        17,
        23,
        37
      ],
      [
        42,
        14,
        62,
        39
      ],
      [
        16,
        43,
        51,
        53
      ],
      [
        15,
        31,
        52,
        44
      ]
    ],
    "octagons": [],
    "notches": [
      [
        28,
        25,
        36,
        33
      ]
    ],
    "entry": [
      32,
      8
    ],
    "porch": [
      29,
      4,
      35,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 23,
        "from": 19,
        "to": 36,
        "door": 27,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 42,
        "from": 18,
        "to": 36,
        "door": 26,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 43,
        "from": 26,
        "to": 47,
        "door": 33,
        "facing": "north"
      }
    ],
    "windows": [
      [
        4,
        23,
        "west"
      ],
      [
        62,
        25,
        "east"
      ],
      [
        33,
        53,
        "north"
      ],
      [
        28,
        8,
        "south"
      ],
      [
        37,
        8,
        "south"
      ],
      [
        22,
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
        32,
        41
      ],
      [
        11,
        25
      ],
      [
        54,
        25
      ],
      [
        33,
        50
      ],
      [
        46,
        45
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "winter-general-senate",
        "kind": "meeting",
        "rect": [
          24,
          12,
          41,
          23
        ]
      },
      {
        "id": "west-public-ration-court",
        "kind": "administration",
        "rect": [
          6,
          20,
          22,
          35
        ]
      },
      {
        "id": "east-snow-audit-tribunal",
        "kind": "public-hearing",
        "rect": [
          45,
          17,
          60,
          37
        ]
      },
      {
        "id": "north-ice-seal-archives",
        "kind": "registry",
        "rect": [
          19,
          45,
          49,
          52
        ]
      },
      {
        "id": "upper-senate-record-crossbar",
        "kind": "archive-crossbar",
        "rect": [
          24,
          35,
          40,
          41
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          23,
          9,
          42,
          23
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          5,
          18,
          21,
          36
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          44,
          16,
          61,
          37
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          18,
          45,
          50,
          52
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "snow-H-fortress-senate-inner-court",
      67,
      58,
      "west-public-nave",
      "east-tribunal",
      "hollow-lower-courtyard",
      "north-ice-register"
    ],
    "profile": "snow-H-fortress-senate-inner-court"
  },
  {
    "id": "r4:civic-hall:enchanted-forest:small:03",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 3,
    "bounds": [
      43,
      12,
      40
    ],
    "wings": [
      [
        12,
        7,
        25,
        25
      ],
      [
        4,
        14,
        13,
        29
      ],
      [
        25,
        17,
        37,
        29
      ],
      [
        17,
        28,
        31,
        36
      ]
    ],
    "octagons": [
      [
        21,
        23,
        8,
        11
      ]
    ],
    "notches": [
      [
        15,
        24,
        18,
        27
      ]
    ],
    "entry": [
      18,
      7
    ],
    "porch": [
      15,
      3,
      21,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 13,
        "from": 17,
        "to": 25,
        "door": 21,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 25,
        "from": 18,
        "to": 26,
        "door": 22,
        "facing": "east"
      }
    ],
    "windows": [
      [
        4,
        20,
        "west"
      ],
      [
        37,
        24,
        "east"
      ],
      [
        23,
        36,
        "north"
      ],
      [
        15,
        7,
        "south"
      ],
      [
        23,
        7,
        "south"
      ],
      [
        12,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        18,
        15
      ],
      [
        23,
        22
      ],
      [
        7,
        23
      ],
      [
        31,
        22
      ],
      [
        23,
        33
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "elder-leaf-judicial-glade",
        "kind": "meeting",
        "rect": [
          15,
          12,
          24,
          25
        ]
      },
      {
        "id": "west-witness-bough",
        "kind": "administration",
        "rect": [
          6,
          17,
          12,
          27
        ]
      },
      {
        "id": "east-lichen-register",
        "kind": "archives",
        "rect": [
          27,
          19,
          36,
          28
        ]
      },
      {
        "id": "north-oath-veranda",
        "kind": "public-oath",
        "rect": [
          19,
          30,
          29,
          35
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          13,
          8,
          24,
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
          16,
          12,
          28
        ],
        "profile": "gable",
        "axis": "z",
        "high": 8,
        "period": 5
      },
      {
        "rect": [
          27,
          18,
          36,
          28
        ],
        "profile": "saw",
        "axis": "x",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          19,
          30,
          30,
          35
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 5
      }
    ],
    "signature": [
      "enchanted-leaf-fan-with-notched-apse",
      43,
      40,
      "witness-bough-west",
      "east-lichen-records",
      "northern-oath-veranda"
    ],
    "profile": "enchanted-leaf-fan-with-notched-apse"
  },
  {
    "id": "r4:guildhall:temperate:large:02",
    "type": "guildhall",
    "biome": "temperate",
    "size": "large",
    "variant": 2,
    "bounds": [
      68,
      12,
      58
    ],
    "wings": [
      [
        22,
        7,
        45,
        43
      ],
      [
        5,
        16,
        23,
        37
      ],
      [
        44,
        13,
        63,
        36
      ],
      [
        15,
        42,
        53,
        53
      ],
      [
        19,
        37,
        50,
        45
      ]
    ],
    "octagons": [],
    "notches": [
      [
        28,
        26,
        38,
        34
      ]
    ],
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
        "fixed": 23,
        "from": 19,
        "to": 35,
        "door": 29,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 44,
        "from": 17,
        "to": 36,
        "door": 26,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 42,
        "from": 26,
        "to": 47,
        "door": 32,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        23,
        "west"
      ],
      [
        63,
        23,
        "east"
      ],
      [
        32,
        53,
        "north"
      ],
      [
        29,
        7,
        "south"
      ],
      [
        38,
        7,
        "south"
      ],
      [
        22,
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
        31,
        39
      ],
      [
        11,
        25
      ],
      [
        55,
        24
      ],
      [
        30,
        48
      ],
      [
        45,
        47
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "temperate-trade-parliament",
        "kind": "gathering-hall",
        "rect": [
          25,
          12,
          42,
          24
        ]
      },
      {
        "id": "west-wheelwright-inspection",
        "kind": "shared-facility",
        "rect": [
          7,
          18,
          21,
          35
        ]
      },
      {
        "id": "east-cabinetmakers-forge",
        "kind": "covered-workroom",
        "rect": [
          47,
          15,
          61,
          34
        ]
      },
      {
        "id": "north-members-register",
        "kind": "guild-ledger",
        "rect": [
          18,
          45,
          51,
          52
        ]
      },
      {
        "id": "central-procession-gallery",
        "kind": "guild-passage",
        "rect": [
          24,
          36,
          43,
          41
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          24,
          8,
          44,
          24
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          6,
          17,
          22,
          35
        ],
        "profile": "saw",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          46,
          15,
          62,
          34
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          17,
          44,
          52,
          52
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      }
    ],
    "signature": [
      "temperate-trade-H-procession-court",
      68,
      58,
      "south-master-guild",
      "western-farriers",
      "east-cabinetmakers",
      "north-members-vault"
    ],
    "profile": "temperate-trade-H-procession-court"
  },
  {
    "id": "r4:guildhall:desert:large:02",
    "type": "guildhall",
    "biome": "desert",
    "size": "large",
    "variant": 2,
    "bounds": [
      64,
      12,
      55
    ],
    "wings": [
      [
        21,
        7,
        43,
        40
      ],
      [
        5,
        18,
        22,
        38
      ],
      [
        42,
        14,
        59,
        35
      ],
      [
        19,
        39,
        51,
        50
      ]
    ],
    "octagons": [
      [
        33,
        28,
        14,
        20
      ]
    ],
    "notches": [
      [
        28,
        25,
        36,
        32
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
        "axis": "x",
        "fixed": 22,
        "from": 19,
        "to": 35,
        "door": 28,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 42,
        "from": 17,
        "to": 34,
        "door": 26,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 41,
        "from": 25,
        "to": 43,
        "door": 31,
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
        24,
        "east"
      ],
      [
        32,
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
        21,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        31,
        15
      ],
      [
        14,
        25
      ],
      [
        51,
        23
      ],
      [
        31,
        47
      ],
      [
        45,
        42
      ],
      [
        23,
        43
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "desert-merchants-concord",
        "kind": "gathering-hall",
        "rect": [
          24,
          12,
          40,
          23
        ]
      },
      {
        "id": "western-weavers-copperwork",
        "kind": "shared-facility",
        "rect": [
          7,
          20,
          20,
          35
        ]
      },
      {
        "id": "east-tintworks-exchange",
        "kind": "covered-workroom",
        "rect": [
          44,
          16,
          57,
          33
        ]
      },
      {
        "id": "northern-shaded-tally",
        "kind": "guild-ledger",
        "rect": [
          21,
          42,
          49,
          49
        ]
      },
      {
        "id": "western-contract-corridor",
        "kind": "ledger-arcade",
        "rect": [
          22,
          34,
          28,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          22,
          8,
          42,
          23
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          6,
          19,
          21,
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
          16,
          58,
          34
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          21,
          41,
          50,
          49
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "desert-crescent-merchant-court",
      64,
      55,
      "octagonal-inner-exchange",
      "west-weavers",
      "east-tintwork",
      "open-roof-courtyard"
    ],
    "profile": "desert-crescent-merchant-court"
  },
  {
    "id": "r4:guildhall:enchanted-forest:large:02",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 2,
    "bounds": [
      65,
      12,
      56
    ],
    "wings": [
      [
        23,
        8,
        41,
        43
      ],
      [
        5,
        16,
        24,
        35
      ],
      [
        41,
        14,
        60,
        37
      ],
      [
        17,
        41,
        50,
        51
      ],
      [
        18,
        34,
        48,
        44
      ]
    ],
    "octagons": [
      [
        33,
        26,
        14,
        20
      ]
    ],
    "notches": [
      [
        28,
        25,
        36,
        32
      ]
    ],
    "entry": [
      32,
      8
    ],
    "porch": [
      29,
      4,
      35,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 24,
        "from": 19,
        "to": 35,
        "door": 27,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 40,
        "from": 18,
        "to": 36,
        "door": 28,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 41,
        "from": 24,
        "to": 44,
        "door": 32,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        22,
        "west"
      ],
      [
        60,
        24,
        "east"
      ],
      [
        34,
        51,
        "north"
      ],
      [
        29,
        8,
        "south"
      ],
      [
        37,
        8,
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
        32,
        16
      ],
      [
        12,
        25
      ],
      [
        53,
        24
      ],
      [
        32,
        48
      ],
      [
        20,
        41
      ],
      [
        45,
        44
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "canopy-elders-alliance",
        "kind": "gathering-hall",
        "rect": [
          25,
          12,
          39,
          23
        ]
      },
      {
        "id": "western-sap-weavers",
        "kind": "shared-facility",
        "rect": [
          7,
          19,
          22,
          34
        ]
      },
      {
        "id": "eastern-bark-stain-artisans",
        "kind": "artisan-study",
        "rect": [
          43,
          17,
          58,
          35
        ]
      },
      {
        "id": "north-glyph-ledger-arcade",
        "kind": "guild-ledger",
        "rect": [
          19,
          44,
          48,
          50
        ]
      },
      {
        "id": "east-wood-kiln-veranda",
        "kind": "artisan-veranda",
        "rect": [
          41,
          38,
          48,
          42
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          23,
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
          6,
          17,
          23,
          34
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          43,
          16,
          59,
          35
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          19,
          43,
          49,
          50
        ],
        "profile": "shed",
        "axis": "x",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "forest-radial-canopy-guild-open-star",
      65,
      56,
      "western-sap-arcade",
      "eastern-bark-atelier",
      "north-glyph-hall"
    ],
    "profile": "forest-radial-canopy-guild-open-star"
  },
  {
    "id": "r4:guildhall:mountain:medium:02",
    "type": "guildhall",
    "biome": "mountain",
    "size": "medium",
    "variant": 2,
    "bounds": [
      52,
      12,
      47
    ],
    "wings": [
      [
        15,
        7,
        31,
        27
      ],
      [
        4,
        16,
        16,
        34
      ],
      [
        31,
        13,
        47,
        33
      ],
      [
        19,
        30,
        43,
        42
      ],
      [
        16,
        26,
        36,
        32
      ]
    ],
    "octagons": [],
    "notches": [
      [
        21,
        27,
        27,
        32
      ]
    ],
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
    "partitions": [
      {
        "axis": "x",
        "fixed": 16,
        "from": 17,
        "to": 30,
        "door": 22,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 31,
        "from": 18,
        "to": 32,
        "door": 23,
        "facing": "east"
      }
    ],
    "windows": [
      [
        4,
        22,
        "west"
      ],
      [
        47,
        24,
        "east"
      ],
      [
        28,
        42,
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
        15,
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
        25
      ],
      [
        40,
        25
      ],
      [
        30,
        39
      ],
      [
        36,
        34
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "mountain-rock-cutters-charter",
        "kind": "gathering-hall",
        "rect": [
          18,
          11,
          29,
          25
        ]
      },
      {
        "id": "western-stone-tally-workshop",
        "kind": "shared-facility",
        "rect": [
          6,
          19,
          15,
          32
        ]
      },
      {
        "id": "east-ore-wheel-grinding",
        "kind": "workshop",
        "rect": [
          33,
          16,
          46,
          31
        ]
      },
      {
        "id": "northern-ore-route-maproom",
        "kind": "guild-ledger",
        "rect": [
          21,
          34,
          41,
          41
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          16,
          8,
          30,
          24
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          5,
          18,
          15,
          33
        ],
        "profile": "saw",
        "axis": "z",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          33,
          15,
          46,
          32
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          21,
          33,
          42,
          41
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "mountain-split-quarry-tally-Z",
      52,
      47,
      "two-stepped-quarry-terraces",
      "east-grindstone",
      "north-ore-ledgers"
    ],
    "profile": "mountain-split-quarry-tally-Z"
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
export function buildM2Courtyards(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2Courtyards(){return PLANS.map(author);}
export const M2_COURTYARD_IDS=Object.freeze(PLANS.map(p=>p.id));
