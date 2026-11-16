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
    "id": "r4:civic-hall:temperate:small:04",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "small",
    "variant": 4,
    "bounds": [
      43,
      12,
      39
    ],
    "wings": [
      [
        15,
        7,
        26,
        20
      ],
      [
        6,
        17,
        14,
        28
      ],
      [
        28,
        16,
        38,
        27
      ],
      [
        17,
        29,
        26,
        35
      ],
      [
        12,
        21,
        31,
        25
      ]
    ],
    "octagons": [
      [
        22,
        22,
        10,
        15
      ]
    ],
    "notches": [],
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
        "to": 25,
        "door": 21,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 28,
        "from": 18,
        "to": 25,
        "door": 22,
        "facing": "east"
      }
    ],
    "windows": [
      [
        6,
        21,
        "west"
      ],
      [
        38,
        22,
        "east"
      ],
      [
        21,
        35,
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
        15,
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
        22,
        27
      ],
      [
        9,
        22
      ],
      [
        34,
        22
      ],
      [
        21,
        33
      ]
    ],
    "ridges": [
      [
        19,
        17,
        24,
        22
      ]
    ],
    "rooms": [
      {
        "id": "octagonal-council-trading-room",
        "kind": "meeting",
        "rect": [
          16,
          15,
          27,
          29
        ]
      },
      {
        "id": "west-charter-dispute-desk",
        "kind": "administration",
        "rect": [
          7,
          19,
          13,
          27
        ]
      },
      {
        "id": "east-ward-public-appeals",
        "kind": "public-hearing",
        "rect": [
          30,
          18,
          37,
          26
        ]
      },
      {
        "id": "north-register-witness-room",
        "kind": "public-registry",
        "rect": [
          18,
          30,
          25,
          34
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          15,
          8,
          27,
          23
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          7,
          18,
          14,
          27
        ],
        "profile": "shed",
        "axis": "x",
        "high": 7,
        "period": 4
      },
      {
        "rect": [
          29,
          17,
          37,
          26
        ],
        "profile": "hip",
        "axis": "x",
        "high": 8,
        "period": 5
      },
      {
        "rect": [
          18,
          30,
          25,
          34
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "borough-octagonal-fan-hall",
      43,
      39,
      "west-charter-apse",
      "east-public-witness",
      "hipped-north-register"
    ],
    "profile": "borough-octagonal-fan-hall",
    "skyline": []
  },
  {
    "id": "r4:civic-hall:desert:medium:04",
    "type": "civic-hall",
    "biome": "desert",
    "size": "medium",
    "variant": 4,
    "bounds": [
      49,
      12,
      46
    ],
    "wings": [
      [
        10,
        8,
        38,
        38
      ],
      [
        5,
        18,
        11,
        32
      ],
      [
        37,
        14,
        45,
        30
      ],
      [
        15,
        38,
        34,
        43
      ]
    ],
    "octagons": [],
    "notches": [
      [
        19,
        21,
        29,
        29
      ]
    ],
    "entry": [
      24,
      8
    ],
    "porch": [
      21,
      4,
      27,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 12,
        "from": 19,
        "to": 32,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 36,
        "from": 17,
        "to": 33,
        "door": 25,
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
        45,
        21,
        "east"
      ],
      [
        24,
        43,
        "north"
      ],
      [
        20,
        8,
        "south"
      ],
      [
        29,
        8,
        "south"
      ],
      [
        10,
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
        16,
        31
      ],
      [
        33,
        31
      ],
      [
        8,
        26
      ],
      [
        42,
        23
      ],
      [
        25,
        41
      ]
    ],
    "ridges": [
      [
        22,
        11,
        27,
        16
      ],
      [
        23,
        34,
        28,
        38
      ]
    ],
    "rooms": [
      {
        "id": "shaded-south-legal-senate",
        "kind": "meeting",
        "rect": [
          15,
          11,
          34,
          19
        ]
      },
      {
        "id": "western-appeal-cloister",
        "kind": "administration",
        "rect": [
          11,
          22,
          18,
          34
        ]
      },
      {
        "id": "eastern-land-registrar",
        "kind": "public-records",
        "rect": [
          31,
          20,
          37,
          34
        ]
      },
      {
        "id": "northern-sun-shield-archive",
        "kind": "archive-vault",
        "rect": [
          17,
          37,
          32,
          42
        ]
      },
      {
        "id": "east-desert-tax-service",
        "kind": "tax-records",
        "rect": [
          39,
          17,
          44,
          29
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          11,
          9,
          36,
          19
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          11,
          30,
          20,
          37
        ],
        "profile": "gable",
        "axis": "z",
        "high": 8,
        "period": 5
      },
      {
        "rect": [
          30,
          30,
          37,
          37
        ],
        "profile": "gable",
        "axis": "z",
        "high": 8,
        "period": 5
      },
      {
        "rect": [
          16,
          39,
          33,
          42
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          39,
          16,
          44,
          29
        ],
        "profile": "saw",
        "axis": "z",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "desert-open-air-courtyard-civic",
      49,
      46,
      "true-central-open-courtyard",
      "twin-west-east-cloisters",
      "northern-wind-shelter"
    ],
    "profile": "desert-open-air-courtyard-civic",
    "skyline": []
  },
  {
    "id": "r4:civic-hall:snow:medium:03",
    "type": "civic-hall",
    "biome": "snow",
    "size": "medium",
    "variant": 3,
    "bounds": [
      48,
      12,
      43
    ],
    "wings": [
      [
        19,
        7,
        29,
        23
      ],
      [
        5,
        17,
        18,
        30
      ],
      [
        31,
        14,
        44,
        30
      ],
      [
        20,
        30,
        29,
        39
      ],
      [
        16,
        21,
        34,
        27
      ],
      [
        20,
        26,
        28,
        32
      ]
    ],
    "octagons": [
      [
        24,
        22,
        11,
        16
      ]
    ],
    "notches": [],
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
        "from": 18,
        "to": 29,
        "door": 23,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 30,
        "from": 17,
        "to": 29,
        "door": 23,
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
        44,
        21,
        "east"
      ],
      [
        24,
        39,
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
        19,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        24,
        15
      ],
      [
        25,
        27
      ],
      [
        9,
        23
      ],
      [
        39,
        22
      ],
      [
        24,
        36
      ]
    ],
    "ridges": [
      [
        22,
        14,
        26,
        22
      ],
      [
        21,
        33,
        27,
        36
      ]
    ],
    "rooms": [
      {
        "id": "winter-rotunda-assembly",
        "kind": "meeting",
        "rect": [
          19,
          12,
          29,
          29
        ]
      },
      {
        "id": "western-ration-dispute",
        "kind": "administration",
        "rect": [
          7,
          19,
          17,
          29
        ]
      },
      {
        "id": "eastern-drift-records",
        "kind": "public-ledger",
        "rect": [
          33,
          16,
          43,
          29
        ]
      },
      {
        "id": "north-ice-lock-hearing",
        "kind": "hearing-gallery",
        "rect": [
          21,
          33,
          28,
          38
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          20,
          8,
          28,
          20
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          6,
          18,
          17,
          29
        ],
        "profile": "saw",
        "axis": "z",
        "high": 8,
        "period": 5
      },
      {
        "rect": [
          32,
          15,
          43,
          29
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          21,
          31,
          28,
          38
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "snow-faceted-rotunda-crosshall",
      48,
      43,
      "octagonal-snow-assembly",
      "west-ration-bay",
      "split-eaves-east-drift"
    ],
    "profile": "snow-faceted-rotunda-crosshall",
    "skyline": []
  },
  {
    "id": "r4:civic-hall:mountain:small:03",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "small",
    "variant": 3,
    "bounds": [
      42,
      12,
      43
    ],
    "wings": [
      [
        14,
        7,
        27,
        20
      ],
      [
        6,
        17,
        15,
        36
      ],
      [
        26,
        14,
        37,
        36
      ],
      [
        11,
        35,
        32,
        40
      ]
    ],
    "octagons": [],
    "notches": [
      [
        17,
        22,
        24,
        31
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
        "fixed": 15,
        "from": 15,
        "to": 19,
        "door": 17,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 27,
        "from": 15,
        "to": 19,
        "door": 17,
        "facing": "east"
      }
    ],
    "windows": [
      [
        6,
        25,
        "west"
      ],
      [
        37,
        23,
        "east"
      ],
      [
        21,
        40,
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
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        20,
        15
      ],
      [
        10,
        27
      ],
      [
        32,
        25
      ],
      [
        21,
        38
      ]
    ],
    "ridges": [
      [
        18,
        11,
        24,
        17
      ],
      [
        18,
        36,
        24,
        39
      ]
    ],
    "rooms": [
      {
        "id": "stone-public-petition-foyer",
        "kind": "meeting",
        "rect": [
          16,
          11,
          25,
          19
        ]
      },
      {
        "id": "west-cliff-ownership-review",
        "kind": "administration",
        "rect": [
          7,
          20,
          14,
          33
        ]
      },
      {
        "id": "east-ore-transit-charters",
        "kind": "public-office",
        "rect": [
          28,
          17,
          36,
          34
        ]
      },
      {
        "id": "north-ridge-map-library",
        "kind": "survey-archive",
        "rect": [
          13,
          36,
          30,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          15,
          8,
          26,
          19
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          18,
          14,
          35
        ],
        "profile": "shed",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          27,
          15,
          36,
          34
        ],
        "profile": "saw",
        "axis": "x",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          12,
          36,
          31,
          39
        ],
        "profile": "gable",
        "axis": "z",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "mountain-open-courtyard-u-council",
      42,
      43,
      "south-vestibule",
      "two-ridge-arms",
      "roofless-terrace-court"
    ],
    "profile": "mountain-open-courtyard-u-council",
    "skyline": []
  },
  {
    "id": "r4:guildhall:temperate:medium:02",
    "type": "guildhall",
    "biome": "temperate",
    "size": "medium",
    "variant": 2,
    "bounds": [
      51,
      12,
      44
    ],
    "wings": [
      [
        20,
        7,
        30,
        24
      ],
      [
        5,
        19,
        18,
        33
      ],
      [
        33,
        17,
        47,
        32
      ],
      [
        20,
        31,
        34,
        40
      ],
      [
        15,
        21,
        38,
        27
      ],
      [
        19,
        27,
        34,
        33
      ]
    ],
    "octagons": [
      [
        26,
        24,
        10,
        14
      ]
    ],
    "notches": [],
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
        "from": 21,
        "to": 32,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 33,
        "from": 19,
        "to": 31,
        "door": 24,
        "facing": "east"
      }
    ],
    "windows": [
      [
        5,
        25,
        "west"
      ],
      [
        47,
        24,
        "east"
      ],
      [
        26,
        40,
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
        20,
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
        26,
        29
      ],
      [
        10,
        26
      ],
      [
        41,
        26
      ],
      [
        27,
        37
      ]
    ],
    "ridges": [
      [
        22,
        13,
        29,
        19
      ],
      [
        22,
        34,
        31,
        37
      ]
    ],
    "rooms": [
      {
        "id": "joiners-rotunda-master-assembly",
        "kind": "gathering-hall",
        "rect": [
          20,
          13,
          31,
          29
        ]
      },
      {
        "id": "west-sawmill-timber-measure",
        "kind": "shared-facility",
        "rect": [
          7,
          21,
          17,
          32
        ]
      },
      {
        "id": "east-cabinet-joinery-workshop",
        "kind": "workshop",
        "rect": [
          35,
          19,
          45,
          31
        ]
      },
      {
        "id": "northern-tool-records-archive",
        "kind": "guild-ledger",
        "rect": [
          22,
          34,
          33,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          20,
          8,
          30,
          23
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          6,
          20,
          17,
          32
        ],
        "profile": "saw",
        "axis": "x",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          34,
          18,
          46,
          31
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          22,
          32,
          33,
          39
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 5
      }
    ],
    "signature": [
      "joiners-gear-wheel-rotunda",
      51,
      44,
      "octagon-members-center",
      "western-sawtooth-production",
      "eastern-cabinet-shop"
    ],
    "profile": "joiners-gear-wheel-rotunda",
    "skyline": []
  },
  {
    "id": "r4:guildhall:desert:medium:02",
    "type": "guildhall",
    "biome": "desert",
    "size": "medium",
    "variant": 2,
    "bounds": [
      48,
      12,
      44
    ],
    "wings": [
      [
        12,
        7,
        29,
        24
      ],
      [
        5,
        18,
        13,
        34
      ],
      [
        28,
        14,
        44,
        32
      ],
      [
        18,
        31,
        35,
        40
      ],
      [
        12,
        24,
        33,
        29
      ]
    ],
    "octagons": [],
    "notches": [
      [
        22,
        26,
        26,
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
        "fixed": 13,
        "from": 19,
        "to": 29,
        "door": 23,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 29,
        "from": 16,
        "to": 30,
        "door": 23,
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
        44,
        24,
        "east"
      ],
      [
        24,
        40,
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
        12,
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
        9,
        26
      ],
      [
        37,
        23
      ],
      [
        25,
        36
      ],
      [
        33,
        18
      ]
    ],
    "ridges": [
      [
        19,
        13,
        24,
        22
      ],
      [
        21,
        34,
        30,
        37
      ]
    ],
    "rooms": [
      {
        "id": "caravan-exchange-common-hall",
        "kind": "gathering-hall",
        "rect": [
          14,
          12,
          27,
          23
        ]
      },
      {
        "id": "west-dyed-fabric-escrow",
        "kind": "shared-facility",
        "rect": [
          6,
          20,
          12,
          32
        ]
      },
      {
        "id": "east-court-dye-workers",
        "kind": "covered-workroom",
        "rect": [
          31,
          16,
          43,
          30
        ]
      },
      {
        "id": "north-tally-archive",
        "kind": "guild-ledger",
        "rect": [
          19,
          33,
          34,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          13,
          8,
          28,
          23
        ],
        "profile": "gable",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          6,
          19,
          12,
          33
        ],
        "profile": "shed",
        "axis": "z",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          30,
          15,
          43,
          30
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          19,
          33,
          34,
          39
        ],
        "profile": "hip",
        "axis": "x",
        "high": 8,
        "period": 5
      }
    ],
    "signature": [
      "desert-zigzag-escrow-exchange",
      48,
      44,
      "western-fabric-bay",
      "eastern-dye-sawtooth",
      "rear-numbered-ledgers"
    ],
    "profile": "desert-zigzag-escrow-exchange",
    "skyline": []
  },
  {
    "id": "r4:guildhall:snow:large:02",
    "type": "guildhall",
    "biome": "snow",
    "size": "large",
    "variant": 2,
    "bounds": [
      63,
      12,
      52
    ],
    "wings": [
      [
        22,
        7,
        41,
        43
      ],
      [
        5,
        15,
        23,
        31
      ],
      [
        40,
        17,
        57,
        34
      ],
      [
        12,
        36,
        51,
        48
      ],
      [
        18,
        30,
        46,
        40
      ]
    ],
    "octagons": [],
    "notches": [
      [
        27,
        26,
        36,
        33
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
        "fixed": 23,
        "from": 18,
        "to": 37,
        "door": 30,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 40,
        "from": 19,
        "to": 34,
        "door": 28,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 38,
        "from": 24,
        "to": 39,
        "door": 31,
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
        57,
        24,
        "east"
      ],
      [
        30,
        48,
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
        22,
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
        16,
        23
      ],
      [
        47,
        25
      ],
      [
        31,
        37
      ],
      [
        28,
        45
      ],
      [
        40,
        43
      ]
    ],
    "ridges": [
      [
        27,
        12,
        35,
        20
      ],
      [
        20,
        40,
        43,
        44
      ]
    ],
    "rooms": [
      {
        "id": "winter-longhouse-juried-guild",
        "kind": "gathering-hall",
        "rect": [
          25,
          11,
          38,
          24
        ]
      },
      {
        "id": "west-sled-wheelwright-shop",
        "kind": "shared-facility",
        "rect": [
          7,
          18,
          21,
          29
        ]
      },
      {
        "id": "east-ice-tool-and-joinery",
        "kind": "artisan-study",
        "rect": [
          42,
          20,
          55,
          33
        ]
      },
      {
        "id": "north-contract-galleries",
        "kind": "guild-ledger",
        "rect": [
          15,
          40,
          49,
          47
        ]
      },
      {
        "id": "public-courtyard-warm-passage",
        "kind": "member-passage",
        "rect": [
          25,
          35,
          38,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          23,
          8,
          40,
          24
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          6,
          16,
          21,
          30
        ],
        "profile": "saw",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          42,
          18,
          56,
          33
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          14,
          39,
          50,
          47
        ],
        "profile": "hip",
        "axis": "x",
        "high": 9,
        "period": 5
      }
    ],
    "signature": [
      "snow-hollow-longhouse-double-trade",
      63,
      52,
      "open-internal-snowcourt",
      "west-sled-hall",
      "east-tool-works",
      "north-charter-hall"
    ],
    "profile": "snow-hollow-longhouse-double-trade",
    "skyline": []
  },
  {
    "id": "r4:guildhall:mountain:large:02",
    "type": "guildhall",
    "biome": "mountain",
    "size": "large",
    "variant": 2,
    "bounds": [
      65,
      12,
      56
    ],
    "wings": [
      [
        25,
        7,
        39,
        30
      ],
      [
        6,
        16,
        25,
        36
      ],
      [
        38,
        14,
        59,
        32
      ],
      [
        17,
        35,
        50,
        51
      ],
      [
        18,
        25,
        47,
        34
      ]
    ],
    "octagons": [
      [
        33,
        28,
        13,
        19
      ]
    ],
    "notches": [
      [
        28,
        34,
        35,
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
        "fixed": 24,
        "from": 19,
        "to": 33,
        "door": 28,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 40,
        "from": 16,
        "to": 32,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 41,
        "from": 22,
        "to": 42,
        "door": 32,
        "facing": "north"
      }
    ],
    "windows": [
      [
        6,
        23,
        "west"
      ],
      [
        59,
        23,
        "east"
      ],
      [
        33,
        51,
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
        25,
        13,
        "west"
      ]
    ],
    "fixtures": [
      [
        32,
        15
      ],
      [
        13,
        24
      ],
      [
        51,
        22
      ],
      [
        33,
        47
      ],
      [
        20,
        39
      ],
      [
        47,
        39
      ]
    ],
    "ridges": [
      [
        28,
        14,
        37,
        22
      ],
      [
        22,
        41,
        43,
        47
      ]
    ],
    "rooms": [
      {
        "id": "quarry-octagonal-trade-council",
        "kind": "gathering-hall",
        "rect": [
          26,
          12,
          39,
          29
        ]
      },
      {
        "id": "west-stone-engravers-floor",
        "kind": "shared-facility",
        "rect": [
          8,
          18,
          23,
          34
        ]
      },
      {
        "id": "east-copper-inlay-bays",
        "kind": "artisan-study",
        "rect": [
          41,
          16,
          57,
          30
        ]
      },
      {
        "id": "north-guild-charter-vaults",
        "kind": "guild-ledger",
        "rect": [
          20,
          41,
          48,
          50
        ]
      },
      {
        "id": "west-tower-survey-work",
        "kind": "survey-office",
        "rect": [
          19,
          36,
          27,
          40
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          26,
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
          7,
          18,
          23,
          35
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          40,
          16,
          57,
          31
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          19,
          40,
          49,
          50
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 5
      }
    ],
    "signature": [
      "mountain-octagonal-quarry-citadel",
      65,
      56,
      "faceted-central-quarry-court",
      "western-trade-platform",
      "offset-north-charter-hall"
    ],
    "profile": "mountain-octagonal-quarry-citadel",
    "skyline": []
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
export function buildM2Profiles(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2Profiles(){return PLANS.map(author);}
export const M2_PROFILE_IDS=Object.freeze(PLANS.map(p=>p.id));
