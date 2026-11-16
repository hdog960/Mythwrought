// Builder 4A M2 regional architecture — eight independently authored municipal and craft designs.
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
    "id": "r4:civic-hall:enchanted-forest:large:03",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 3,
    "bounds": [
      68,
      12,
      59
    ],
    "wings": [
      [
        25,
        7,
        43,
        22
      ],
      [
        17,
        20,
        50,
        29
      ],
      [
        5,
        22,
        17,
        45
      ],
      [
        48,
        17,
        64,
        46
      ],
      [
        18,
        39,
        49,
        53
      ],
      [
        25,
        29,
        33,
        40
      ],
      [
        42,
        29,
        49,
        41
      ]
    ],
    "octagons": [],
    "notches": [
      [
        34,
        31,
        41,
        38
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
        "fixed": 24,
        "from": 22,
        "to": 27,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 48,
        "from": 20,
        "to": 27,
        "door": 24,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 43,
        "from": 23,
        "to": 42,
        "door": 32,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        31,
        "west"
      ],
      [
        64,
        29,
        "east"
      ],
      [
        31,
        53,
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
        25,
        13,
        "west"
      ]
    ],
    "fixtures": [
      [
        33,
        14
      ],
      [
        11,
        29
      ],
      [
        57,
        26
      ],
      [
        32,
        48
      ],
      [
        29,
        33
      ],
      [
        45,
        34
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "elder-grove-witness-assembly",
        "kind": "meeting",
        "rect": [
          27,
          10,
          41,
          19
        ]
      },
      {
        "id": "west-root-charter-chambers",
        "kind": "administration",
        "rect": [
          7,
          25,
          16,
          43
        ]
      },
      {
        "id": "bough-treaty-panel",
        "kind": "public-hearing",
        "rect": [
          52,
          23,
          62,
          43
        ]
      },
      {
        "id": "north-canopy-library",
        "kind": "registry",
        "rect": [
          21,
          45,
          47,
          52
        ]
      },
      {
        "id": "west-lantern-vestibule",
        "kind": "appeals",
        "rect": [
          26,
          32,
          32,
          38
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          26,
          8,
          42,
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
          24,
          16,
          43
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          50,
          19,
          63,
          44
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          20,
          44,
          47,
          52
        ],
        "profile": "hip",
        "axis": "z",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "elder-grove-bough-treaty-courtyard",
      68,
      12,
      59
    ],
    "profile": "elder-grove-bough-treaty-courtyard"
  },
  {
    "id": "r4:civic-hall:mountain:large:03",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "large",
    "variant": 3,
    "bounds": [
      73,
      12,
      62
    ],
    "wings": [
      [
        31,
        7,
        47,
        26
      ],
      [
        7,
        21,
        30,
        34
      ],
      [
        9,
        32,
        24,
        52
      ],
      [
        47,
        16,
        65,
        39
      ],
      [
        25,
        42,
        55,
        56
      ],
      [
        35,
        24,
        43,
        46
      ],
      [
        21,
        30,
        34,
        36
      ],
      [
        43,
        35,
        51,
        43
      ],
      [
        26,
        23,
        33,
        28
      ]
    ],
    "octagons": [],
    "notches": [
      [
        30,
        33,
        34,
        39
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
        "fixed": 31,
        "from": 22,
        "to": 26,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 47,
        "from": 19,
        "to": 25,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 45,
        "from": 31,
        "to": 48,
        "door": 38,
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
        65,
        28,
        "east"
      ],
      [
        40,
        56,
        "north"
      ],
      [
        36,
        7,
        "south"
      ],
      [
        43,
        7,
        "south"
      ],
      [
        9,
        42,
        "west"
      ]
    ],
    "fixtures": [
      [
        39,
        15
      ],
      [
        15,
        28
      ],
      [
        55,
        23
      ],
      [
        38,
        50
      ],
      [
        28,
        32
      ],
      [
        48,
        37
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "summit-survey-conclave",
        "kind": "meeting",
        "rect": [
          33,
          10,
          45,
          21
        ]
      },
      {
        "id": "western-pass-rights-court",
        "kind": "administration",
        "rect": [
          11,
          24,
          24,
          31
        ]
      },
      {
        "id": "ridge-toll-registry",
        "kind": "tax-records",
        "rect": [
          51,
          19,
          63,
          35
        ]
      },
      {
        "id": "north-high-charter-chamber",
        "kind": "public-hearing",
        "rect": [
          28,
          47,
          52,
          55
        ]
      },
      {
        "id": "landslide-reparation-files",
        "kind": "civic-archive",
        "rect": [
          11,
          37,
          22,
          50
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          33,
          8,
          45,
          22
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          10,
          23,
          24,
          31
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          49,
          18,
          64,
          37
        ],
        "profile": "saw",
        "axis": "x",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          27,
          46,
          53,
          54
        ],
        "profile": "gable",
        "axis": "z",
        "high": 10,
        "period": 4
      }
    ],
    "signature": [
      "mountain-cliff-pass-tribunal",
      73,
      12,
      62
    ],
    "profile": "mountain-cliff-pass-tribunal"
  },
  {
    "id": "r4:civic-hall:snow:large:04",
    "type": "civic-hall",
    "biome": "snow",
    "size": "large",
    "variant": 4,
    "bounds": [
      70,
      12,
      58
    ],
    "wings": [
      [
        23,
        7,
        41,
        24
      ],
      [
        5,
        19,
        23,
        47
      ],
      [
        41,
        16,
        65,
        33
      ],
      [
        18,
        38,
        52,
        54
      ],
      [
        20,
        24,
        30,
        39
      ],
      [
        38,
        31,
        48,
        42
      ],
      [
        22,
        20,
        46,
        28
      ],
      [
        29,
        27,
        40,
        42
      ]
    ],
    "octagons": [],
    "notches": [
      [
        32,
        31,
        37,
        37
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
        "fixed": 22,
        "from": 22,
        "to": 28,
        "door": 26,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 41,
        "from": 19,
        "to": 26,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 41,
        "from": 23,
        "to": 45,
        "door": 30,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        30,
        "west"
      ],
      [
        65,
        25,
        "east"
      ],
      [
        35,
        54,
        "north"
      ],
      [
        27,
        7,
        "south"
      ],
      [
        38,
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
        32,
        14
      ],
      [
        12,
        30
      ],
      [
        56,
        24
      ],
      [
        35,
        49
      ],
      [
        25,
        34
      ],
      [
        42,
        36
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "icebound-council-dais",
        "kind": "meeting",
        "rect": [
          25,
          10,
          39,
          19
        ]
      },
      {
        "id": "ration-and-shelter-tribunal",
        "kind": "administration",
        "rect": [
          7,
          23,
          20,
          45
        ]
      },
      {
        "id": "winter-transport-registry",
        "kind": "registry",
        "rect": [
          45,
          19,
          63,
          30
        ]
      },
      {
        "id": "north-thaw-charter-hearing",
        "kind": "public-hearing",
        "rect": [
          21,
          44,
          49,
          53
        ]
      },
      {
        "id": "left-drift-intake",
        "kind": "intake",
        "rect": [
          23,
          31,
          29,
          37
        ]
      },
      {
        "id": "east-wind-shelter",
        "kind": "records",
        "rect": [
          39,
          31,
          45,
          36
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          24,
          8,
          40,
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
          22,
          21,
          44
        ],
        "profile": "saw",
        "axis": "z",
        "high": 10,
        "period": 5
      },
      {
        "rect": [
          43,
          18,
          63,
          31
        ],
        "profile": "hip",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          20,
          42,
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
      "snow-frostwall-courts-and-windward-arms",
      70,
      12,
      58
    ],
    "profile": "snow-frostwall-courts-and-windward-arms"
  },
  {
    "id": "r4:civic-hall:temperate:medium:04",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "medium",
    "variant": 4,
    "bounds": [
      56,
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
        16,
        19,
        34
      ],
      [
        34,
        22,
        51,
        42
      ],
      [
        14,
        35,
        40,
        46
      ],
      [
        18,
        22,
        37,
        28
      ],
      [
        26,
        27,
        33,
        38
      ],
      [
        33,
        35,
        39,
        41
      ]
    ],
    "octagons": [],
    "notches": [
      [
        21,
        30,
        25,
        34
      ]
    ],
    "entry": [
      26,
      7
    ],
    "porch": [
      23,
      3,
      29,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 19,
        "from": 17,
        "to": 24,
        "door": 22,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 34,
        "from": 23,
        "to": 27,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 37,
        "from": 27,
        "to": 37,
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
        51,
        30,
        "east"
      ],
      [
        25,
        46,
        "north"
      ],
      [
        22,
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
        13,
        "west"
      ]
    ],
    "fixtures": [
      [
        26,
        14
      ],
      [
        11,
        24
      ],
      [
        45,
        29
      ],
      [
        27,
        42
      ],
      [
        30,
        32
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "town-trade-assembly",
        "kind": "meeting",
        "rect": [
          21,
          10,
          32,
          20
        ]
      },
      {
        "id": "west-public-petition-desk",
        "kind": "administration",
        "rect": [
          7,
          19,
          17,
          32
        ]
      },
      {
        "id": "river-duty-register",
        "kind": "registry",
        "rect": [
          38,
          26,
          49,
          39
        ]
      },
      {
        "id": "north-civic-treaty-room",
        "kind": "public-hearing",
        "rect": [
          17,
          40,
          38,
          45
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          20,
          8,
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
          18,
          17,
          32
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          36,
          25,
          49,
          39
        ],
        "profile": "saw",
        "axis": "x",
        "high": 9,
        "period": 5
      },
      {
        "rect": [
          16,
          39,
          38,
          44
        ],
        "profile": "shed",
        "axis": "x",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "temperate-crooked-river-four-bay-council",
      56,
      12,
      50
    ],
    "profile": "temperate-crooked-river-four-bay-council"
  },
  {
    "id": "r4:guildhall:enchanted-forest:small:02",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 2,
    "bounds": [
      45,
      12,
      43
    ],
    "wings": [
      [
        17,
        7,
        28,
        19
      ],
      [
        5,
        16,
        17,
        35
      ],
      [
        28,
        18,
        41,
        29
      ],
      [
        13,
        31,
        35,
        39
      ],
      [
        14,
        18,
        32,
        23
      ],
      [
        19,
        23,
        26,
        33
      ],
      [
        26,
        28,
        32,
        34
      ]
    ],
    "octagons": [],
    "notches": [
      [
        20,
        25,
        21,
        28
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
    "partitions": [
      {
        "axis": "x",
        "fixed": 17,
        "from": 18,
        "to": 22,
        "door": 20,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 28,
        "from": 19,
        "to": 22,
        "door": 21,
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
        41,
        24,
        "east"
      ],
      [
        20,
        39,
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
        17,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        23,
        13
      ],
      [
        11,
        26
      ],
      [
        35,
        24
      ],
      [
        23,
        35
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "canopy-carvers-hall",
        "kind": "gathering-hall",
        "rect": [
          19,
          10,
          27,
          17
        ]
      },
      {
        "id": "western-livingwood-workshop",
        "kind": "shared-facility",
        "rect": [
          7,
          20,
          15,
          32
        ]
      },
      {
        "id": "eastern-sap-ink-atelier",
        "kind": "artisan-study",
        "rect": [
          31,
          21,
          39,
          28
        ]
      },
      {
        "id": "northern-guild-seal-archive",
        "kind": "guild-ledger",
        "rect": [
          15,
          34,
          33,
          38
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          18,
          8,
          27,
          18
        ],
        "profile": "gable",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          7,
          18,
          16,
          32
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          30,
          20,
          40,
          27
        ],
        "profile": "shed",
        "axis": "x",
        "high": 8,
        "period": 4
      },
      {
        "rect": [
          15,
          34,
          33,
          38
        ],
        "profile": "hip",
        "axis": "x",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "enchanted-hollowroot-carvers-bent-hall",
      45,
      12,
      43
    ],
    "profile": "enchanted-hollowroot-carvers-bent-hall"
  },
  {
    "id": "r4:guildhall:snow:small:02",
    "type": "guildhall",
    "biome": "snow",
    "size": "small",
    "variant": 2,
    "bounds": [
      44,
      12,
      43
    ],
    "wings": [
      [
        15,
        7,
        29,
        22
      ],
      [
        4,
        21,
        16,
        36
      ],
      [
        29,
        13,
        39,
        33
      ],
      [
        14,
        33,
        35,
        39
      ],
      [
        12,
        21,
        34,
        27
      ],
      [
        19,
        27,
        26,
        34
      ]
    ],
    "octagons": [],
    "notches": [
      [
        16,
        28,
        18,
        31
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
        "from": 22,
        "to": 27,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 29,
        "from": 20,
        "to": 25,
        "door": 23,
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
        39,
        22,
        "east"
      ],
      [
        23,
        39,
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
        13,
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
        28
      ],
      [
        34,
        20
      ],
      [
        23,
        36
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "sled-and-keel-masters",
        "kind": "gathering-hall",
        "rect": [
          17,
          10,
          28,
          19
        ]
      },
      {
        "id": "heated-ashwood-lathe",
        "kind": "shared-facility",
        "rect": [
          6,
          24,
          14,
          34
        ]
      },
      {
        "id": "harness-ice-joint-bay",
        "kind": "workshop",
        "rect": [
          31,
          16,
          38,
          31
        ]
      },
      {
        "id": "winter-charter-desk",
        "kind": "guild-ledger",
        "rect": [
          16,
          35,
          33,
          38
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          16,
          8,
          28,
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
          14,
          34
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          31,
          17,
          38,
          31
        ],
        "profile": "shed",
        "axis": "x",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          16,
          35,
          33,
          38
        ],
        "profile": "hip",
        "axis": "z",
        "high": 8,
        "period": 4
      }
    ],
    "signature": [
      "snow-forked-keelwrights-warming-hall",
      44,
      12,
      43
    ],
    "profile": "snow-forked-keelwrights-warming-hall"
  },
  {
    "id": "r4:guildhall:desert:large:03",
    "type": "guildhall",
    "biome": "desert",
    "size": "large",
    "variant": 3,
    "bounds": [
      69,
      12,
      58
    ],
    "wings": [
      [
        28,
        7,
        44,
        22
      ],
      [
        6,
        17,
        28,
        44
      ],
      [
        44,
        22,
        63,
        35
      ],
      [
        15,
        43,
        54,
        54
      ],
      [
        20,
        22,
        54,
        29
      ],
      [
        20,
        28,
        29,
        44
      ],
      [
        43,
        31,
        51,
        45
      ],
      [
        28,
        30,
        44,
        43
      ]
    ],
    "octagons": [],
    "notches": [
      [
        32,
        33,
        39,
        40
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
    "partitions": [
      {
        "axis": "x",
        "fixed": 28,
        "from": 19,
        "to": 26,
        "door": 23,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 44,
        "from": 23,
        "to": 27,
        "door": 25,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 44,
        "from": 23,
        "to": 48,
        "door": 30,
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
        63,
        28,
        "east"
      ],
      [
        35,
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
        28,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        36,
        14
      ],
      [
        12,
        28
      ],
      [
        54,
        27
      ],
      [
        34,
        50
      ],
      [
        30,
        32
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
        "id": "dune-textile-charter-hall",
        "kind": "gathering-hall",
        "rect": [
          30,
          10,
          42,
          20
        ]
      },
      {
        "id": "west-saffron-and-loom-market",
        "kind": "shared-facility",
        "rect": [
          8,
          21,
          25,
          41
        ]
      },
      {
        "id": "east-caravan-dyes-foundry",
        "kind": "workshop",
        "rect": [
          47,
          25,
          61,
          33
        ]
      },
      {
        "id": "northern-ledger-arcade",
        "kind": "guild-ledger",
        "rect": [
          18,
          46,
          51,
          53
        ]
      },
      {
        "id": "southern-court-niche",
        "kind": "artisan-study",
        "rect": [
          29,
          33,
          31,
          39
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          29,
          8,
          43,
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
          20,
          26,
          42
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
          62,
          33
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          18,
          46,
          52,
          53
        ],
        "profile": "hip",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "desert-dyers-caravan-cloister",
      69,
      12,
      58
    ],
    "profile": "desert-dyers-caravan-cloister"
  },
  {
    "id": "r4:guildhall:mountain:medium:03",
    "type": "guildhall",
    "biome": "mountain",
    "size": "medium",
    "variant": 3,
    "bounds": [
      57,
      12,
      52
    ],
    "wings": [
      [
        22,
        7,
        36,
        22
      ],
      [
        5,
        18,
        22,
        33
      ],
      [
        36,
        15,
        51,
        42
      ],
      [
        17,
        35,
        46,
        48
      ],
      [
        17,
        21,
        40,
        29
      ],
      [
        15,
        29,
        25,
        39
      ],
      [
        27,
        27,
        35,
        39
      ]
    ],
    "octagons": [],
    "notches": [
      [
        26,
        30,
        28,
        34
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
        "axis": "x",
        "fixed": 22,
        "from": 20,
        "to": 26,
        "door": 23,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 36,
        "from": 18,
        "to": 27,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 36,
        "from": 19,
        "to": 41,
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
        51,
        25,
        "east"
      ],
      [
        30,
        48,
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
        22,
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
        11,
        25
      ],
      [
        44,
        25
      ],
      [
        30,
        43
      ],
      [
        20,
        34
      ],
      [
        33,
        33
      ]
    ],
    "ridges": [],
    "skyline": [],
    "rooms": [
      {
        "id": "stonewright-masters-bench",
        "kind": "gathering-hall",
        "rect": [
          24,
          10,
          34,
          19
        ]
      },
      {
        "id": "west-hoist-sledge-room",
        "kind": "shared-facility",
        "rect": [
          7,
          20,
          20,
          30
        ]
      },
      {
        "id": "east-chisel-fabrication",
        "kind": "workshop",
        "rect": [
          40,
          19,
          49,
          39
        ]
      },
      {
        "id": "north-mining-guild-ledgers",
        "kind": "guild-ledger",
        "rect": [
          19,
          39,
          44,
          47
        ]
      },
      {
        "id": "left-ridge-tools",
        "kind": "artisan-study",
        "rect": [
          18,
          31,
          24,
          37
        ]
      }
    ],
    "roofBands": [
      {
        "rect": [
          23,
          8,
          35,
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
          20,
          20,
          31
        ],
        "profile": "saw",
        "axis": "z",
        "high": 9,
        "period": 4
      },
      {
        "rect": [
          38,
          17,
          49,
          39
        ],
        "profile": "gable",
        "axis": "x",
        "high": 10,
        "period": 4
      },
      {
        "rect": [
          20,
          40,
          44,
          46
        ],
        "profile": "shed",
        "axis": "z",
        "high": 9,
        "period": 4
      }
    ],
    "signature": [
      "mountain-ledger-spur-quarry-hall",
      57,
      12,
      52
    ],
    "profile": "mountain-ledger-spur-quarry-hall"
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
export function buildM2CivicWorks(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2CivicWorks(){return PLANS.map(author);}
export const M2_CIVIC_WORKS_IDS=Object.freeze(PLANS.map(p=>p.id));
