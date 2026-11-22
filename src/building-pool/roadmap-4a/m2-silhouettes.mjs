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
    "id": "r4:civic-hall:temperate:small:03",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "small",
    "variant": 3,
    "bounds": [
      37,
      12,
      34
    ],
    "wings": [
      [
        12,
        7,
        25,
        24
      ],
      [
        5,
        13,
        12,
        22
      ],
      [
        25,
        12,
        31,
        24
      ],
      [
        16,
        23,
        23,
        30
      ]
    ],
    "notches": [
      [
        12,
        7,
        14,
        9
      ],
      [
        23,
        7,
        25,
        9
      ],
      [
        5,
        13,
        7,
        15
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
        "from": 14,
        "to": 22,
        "door": 18,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 24,
        "from": 13,
        "to": 22,
        "door": 18,
        "facing": "east"
      }
    ],
    "windows": [
      [
        5,
        18,
        "west"
      ],
      [
        31,
        19,
        "east"
      ],
      [
        19,
        30,
        "north"
      ],
      [
        15,
        7,
        "south"
      ],
      [
        22,
        7,
        "south"
      ],
      [
        25,
        10,
        "east"
      ]
    ],
    "fixtures": [
      [
        16,
        15
      ],
      [
        20,
        20
      ],
      [
        8,
        19
      ],
      [
        28,
        18
      ],
      [
        19,
        28
      ]
    ],
    "ridges": [
      [
        16,
        13,
        21,
        18
      ]
    ],
    "rooms": [
      {
        "id": "borough-council-meeting",
        "kind": "meeting",
        "rect": [
          14,
          12,
          23,
          22
        ]
      },
      {
        "id": "western-charter-counter",
        "kind": "administration",
        "rect": [
          7,
          16,
          11,
          21
        ]
      },
      {
        "id": "east-petition-gallery",
        "kind": "public-gallery",
        "rect": [
          26,
          14,
          30,
          23
        ]
      },
      {
        "id": "northern-charter-niche",
        "kind": "records-bay",
        "rect": [
          17,
          24,
          22,
          29
        ]
      }
    ],
    "skyline": [
      [
        17,
        14,
        20,
        17,
        9
      ],
      [
        18,
        25,
        21,
        27,
        8
      ]
    ],
    "signature": [
      "temperate-borough-offset-lantern",
      37,
      34,
      "square-bell-lantern",
      "north-seal-cupola",
      "two-asymmetric-wings"
    ],
    "profile": "temperate-borough-offset-lantern"
  },
  {
    "id": "r4:civic-hall:desert:large:02",
    "type": "civic-hall",
    "biome": "desert",
    "size": "large",
    "variant": 2,
    "bounds": [
      62,
      12,
      52
    ],
    "wings": [
      [
        20,
        7,
        40,
        41
      ],
      [
        6,
        15,
        20,
        33
      ],
      [
        39,
        12,
        55,
        31
      ],
      [
        16,
        39,
        46,
        48
      ],
      [
        45,
        31,
        58,
        41
      ]
    ],
    "notches": [
      [
        20,
        7,
        23,
        10
      ],
      [
        37,
        7,
        40,
        10
      ],
      [
        16,
        46,
        19,
        48
      ]
    ],
    "entry": [
      30,
      7
    ],
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
        "from": 17,
        "to": 32,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 38,
        "from": 14,
        "to": 31,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 40,
        "from": 22,
        "to": 38,
        "door": 29,
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
        55,
        20,
        "east"
      ],
      [
        30,
        48,
        "north"
      ],
      [
        26,
        7,
        "south"
      ],
      [
        35,
        7,
        "south"
      ],
      [
        58,
        35,
        "east"
      ]
    ],
    "fixtures": [
      [
        30,
        17
      ],
      [
        31,
        31
      ],
      [
        10,
        25
      ],
      [
        47,
        22
      ],
      [
        28,
        44
      ],
      [
        52,
        36
      ]
    ],
    "ridges": [
      [
        26,
        13,
        34,
        29
      ],
      [
        22,
        41,
        38,
        44
      ],
      [
        46,
        17,
        51,
        23
      ]
    ],
    "rooms": [
      {
        "id": "desert-judicial-senate",
        "kind": "meeting",
        "rect": [
          24,
          12,
          37,
          37
        ]
      },
      {
        "id": "western-public-oath-court",
        "kind": "administration",
        "rect": [
          8,
          18,
          19,
          31
        ]
      },
      {
        "id": "eastern-land-tax-vault",
        "kind": "records-office",
        "rect": [
          42,
          15,
          53,
          29
        ]
      },
      {
        "id": "rear-sun-sealed-register",
        "kind": "archives",
        "rect": [
          20,
          41,
          44,
          47
        ]
      },
      {
        "id": "eastern-petition-hall",
        "kind": "hearing-room",
        "rect": [
          46,
          33,
          57,
          40
        ]
      }
    ],
    "skyline": [
      [
        27,
        14,
        33,
        20,
        9
      ],
      [
        47,
        18,
        50,
        23,
        8
      ],
      [
        24,
        42,
        28,
        45,
        8
      ]
    ],
    "signature": [
      "desert-terraced-senate",
      62,
      52,
      "high-sun-dais-lantern",
      "east-triple-dome",
      "north-shaded-archives"
    ],
    "profile": "desert-terraced-senate"
  },
  {
    "id": "r4:civic-hall:snow:small:03",
    "type": "civic-hall",
    "biome": "snow",
    "size": "small",
    "variant": 3,
    "bounds": [
      34,
      12,
      33
    ],
    "wings": [
      [
        11,
        6,
        23,
        25
      ],
      [
        4,
        14,
        12,
        22
      ],
      [
        22,
        11,
        30,
        22
      ],
      [
        14,
        24,
        20,
        29
      ]
    ],
    "notches": [
      [
        11,
        6,
        13,
        8
      ],
      [
        21,
        6,
        23,
        8
      ]
    ],
    "entry": [
      17,
      6
    ],
    "porch": [
      14,
      2,
      20,
      5
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 13,
        "from": 15,
        "to": 22,
        "door": 18,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 22,
        "from": 13,
        "to": 22,
        "door": 17,
        "facing": "east"
      }
    ],
    "windows": [
      [
        4,
        19,
        "west"
      ],
      [
        30,
        17,
        "east"
      ],
      [
        17,
        29,
        "north"
      ],
      [
        14,
        6,
        "south"
      ],
      [
        20,
        6,
        "south"
      ],
      [
        11,
        10,
        "west"
      ]
    ],
    "fixtures": [
      [
        16,
        14
      ],
      [
        18,
        20
      ],
      [
        7,
        17
      ],
      [
        27,
        16
      ],
      [
        17,
        27
      ]
    ],
    "ridges": [
      [
        15,
        12,
        20,
        19
      ]
    ],
    "rooms": [
      {
        "id": "winter-dispute-public-hall",
        "kind": "meeting",
        "rect": [
          14,
          11,
          21,
          23
        ]
      },
      {
        "id": "western-snow-court",
        "kind": "administration",
        "rect": [
          5,
          16,
          11,
          21
        ]
      },
      {
        "id": "east-ration-certificates",
        "kind": "public-office",
        "rect": [
          24,
          13,
          29,
          21
        ]
      },
      {
        "id": "north-drift-welfare-office",
        "kind": "welfare-bay",
        "rect": [
          15,
          25,
          19,
          28
        ]
      }
    ],
    "skyline": [
      [
        15,
        14,
        19,
        18,
        9
      ],
      [
        25,
        15,
        27,
        18,
        8
      ]
    ],
    "signature": [
      "snow-double-frost-belfry",
      34,
      33,
      "east-flue-lantern",
      "tall-main-watch",
      "windward-short-porch"
    ],
    "profile": "snow-double-frost-belfry"
  },
  {
    "id": "r4:civic-hall:mountain:medium:03",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "medium",
    "variant": 3,
    "bounds": [
      46,
      12,
      40
    ],
    "wings": [
      [
        15,
        6,
        29,
        32
      ],
      [
        5,
        15,
        16,
        27
      ],
      [
        29,
        12,
        41,
        25
      ],
      [
        13,
        31,
        37,
        37
      ]
    ],
    "notches": [
      [
        15,
        6,
        18,
        9
      ],
      [
        26,
        6,
        29,
        9
      ]
    ],
    "entry": [
      22,
      6
    ],
    "porch": [
      19,
      2,
      25,
      5
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 17,
        "from": 17,
        "to": 28,
        "door": 22,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 28,
        "from": 14,
        "to": 24,
        "door": 19,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 32,
        "from": 18,
        "to": 28,
        "door": 22,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        20,
        "west"
      ],
      [
        41,
        20,
        "east"
      ],
      [
        24,
        37,
        "north"
      ],
      [
        19,
        6,
        "south"
      ],
      [
        25,
        6,
        "south"
      ],
      [
        37,
        37,
        "north"
      ]
    ],
    "fixtures": [
      [
        22,
        13
      ],
      [
        25,
        26
      ],
      [
        9,
        20
      ],
      [
        34,
        19
      ],
      [
        24,
        35
      ]
    ],
    "ridges": [
      [
        20,
        12,
        25,
        27
      ],
      [
        17,
        33,
        30,
        35
      ]
    ],
    "rooms": [
      {
        "id": "mountain-public-survey-hall",
        "kind": "meeting",
        "rect": [
          18,
          11,
          27,
          30
        ]
      },
      {
        "id": "western-charter-land-office",
        "kind": "administration",
        "rect": [
          7,
          17,
          15,
          26
        ]
      },
      {
        "id": "east-ridge-transit-licensing",
        "kind": "public-office",
        "rect": [
          31,
          14,
          40,
          24
        ]
      },
      {
        "id": "north-cartography-archive",
        "kind": "map-archive",
        "rect": [
          16,
          33,
          35,
          36
        ]
      }
    ],
    "skyline": [
      [
        20,
        14,
        25,
        20,
        9
      ],
      [
        31,
        17,
        35,
        20,
        8
      ],
      [
        20,
        33,
        23,
        35,
        8
      ]
    ],
    "signature": [
      "mountain-cross-gabled-survey",
      46,
      40,
      "survey-tower-over-main",
      "side-slate-belfry",
      "tiered-map-gallery"
    ],
    "profile": "mountain-cross-gabled-survey"
  },
  {
    "id": "r4:guildhall:desert:small:02",
    "type": "guildhall",
    "biome": "desert",
    "size": "small",
    "variant": 2,
    "bounds": [
      35,
      12,
      34
    ],
    "wings": [
      [
        10,
        7,
        23,
        24
      ],
      [
        4,
        14,
        11,
        25
      ],
      [
        23,
        12,
        31,
        22
      ],
      [
        15,
        24,
        25,
        30
      ]
    ],
    "notches": [
      [
        10,
        7,
        12,
        9
      ],
      [
        21,
        7,
        23,
        9
      ]
    ],
    "entry": [
      17,
      7
    ],
    "porch": [
      14,
      3,
      20,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 12,
        "from": 15,
        "to": 23,
        "door": 18,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 23,
        "from": 13,
        "to": 22,
        "door": 18,
        "facing": "east"
      }
    ],
    "windows": [
      [
        4,
        19,
        "west"
      ],
      [
        31,
        17,
        "east"
      ],
      [
        20,
        30,
        "north"
      ],
      [
        14,
        7,
        "south"
      ],
      [
        20,
        7,
        "south"
      ],
      [
        10,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        16,
        15
      ],
      [
        20,
        20
      ],
      [
        7,
        19
      ],
      [
        28,
        17
      ],
      [
        21,
        28
      ]
    ],
    "ridges": [
      [
        15,
        13,
        19,
        19
      ]
    ],
    "rooms": [
      {
        "id": "caravan-shade-members-assembly",
        "kind": "gathering-hall",
        "rect": [
          13,
          12,
          22,
          22
        ]
      },
      {
        "id": "western-dyers-registration",
        "kind": "shared-facility",
        "rect": [
          5,
          16,
          11,
          23
        ]
      },
      {
        "id": "east-weaving-bench",
        "kind": "covered-workroom",
        "rect": [
          25,
          14,
          30,
          21
        ]
      },
      {
        "id": "rear-merchant-ledger",
        "kind": "guild-ledger",
        "rect": [
          16,
          25,
          23,
          29
        ]
      }
    ],
    "skyline": [
      [
        16,
        14,
        19,
        18,
        8
      ],
      [
        25,
        15,
        29,
        18,
        9
      ]
    ],
    "signature": [
      "desert-dyers-double-sunshade",
      35,
      34,
      "lofted-cloth-awning",
      "east-air-chimney",
      "west-tally"
    ],
    "profile": "desert-dyers-double-sunshade"
  },
  {
    "id": "r4:guildhall:snow:large:01",
    "type": "guildhall",
    "biome": "snow",
    "size": "large",
    "variant": 1,
    "bounds": [
      60,
      12,
      53
    ],
    "wings": [
      [
        19,
        8,
        39,
        43
      ],
      [
        6,
        18,
        20,
        34
      ],
      [
        38,
        13,
        54,
        32
      ],
      [
        15,
        40,
        47,
        48
      ],
      [
        46,
        32,
        57,
        42
      ]
    ],
    "notches": [
      [
        19,
        8,
        22,
        11
      ],
      [
        36,
        8,
        39,
        11
      ],
      [
        15,
        46,
        18,
        48
      ]
    ],
    "entry": [
      29,
      8
    ],
    "porch": [
      26,
      4,
      32,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 21,
        "from": 19,
        "to": 34,
        "door": 27,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 38,
        "from": 15,
        "to": 31,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 42,
        "from": 23,
        "to": 38,
        "door": 30,
        "facing": "north"
      }
    ],
    "windows": [
      [
        6,
        22,
        "west"
      ],
      [
        54,
        18,
        "east"
      ],
      [
        31,
        48,
        "north"
      ],
      [
        24,
        8,
        "south"
      ],
      [
        34,
        8,
        "south"
      ],
      [
        57,
        37,
        "east"
      ]
    ],
    "fixtures": [
      [
        28,
        16
      ],
      [
        31,
        31
      ],
      [
        10,
        25
      ],
      [
        47,
        22
      ],
      [
        27,
        46
      ],
      [
        51,
        37
      ]
    ],
    "ridges": [
      [
        25,
        13,
        34,
        30
      ],
      [
        20,
        42,
        39,
        45
      ],
      [
        44,
        18,
        50,
        25
      ]
    ],
    "rooms": [
      {
        "id": "alpine-guild-shared-hearth",
        "kind": "gathering-hall",
        "rect": [
          23,
          13,
          36,
          38
        ]
      },
      {
        "id": "western-woodcraft-workshop",
        "kind": "shared-facility",
        "rect": [
          8,
          20,
          19,
          32
        ]
      },
      {
        "id": "eastern-sled-carpentry",
        "kind": "workshop",
        "rect": [
          41,
          15,
          53,
          30
        ]
      },
      {
        "id": "northern-work-orders",
        "kind": "guild-ledger",
        "rect": [
          18,
          42,
          43,
          47
        ]
      },
      {
        "id": "east-ice-tool-repairs",
        "kind": "artisan-study",
        "rect": [
          48,
          34,
          56,
          41
        ]
      }
    ],
    "skyline": [
      [
        25,
        15,
        33,
        20,
        9
      ],
      [
        44,
        18,
        49,
        23,
        8
      ],
      [
        23,
        43,
        27,
        46,
        8
      ]
    ],
    "signature": [
      "snow-longhouse-three-sawtooth",
      60,
      53,
      "central-hearth-smoke-tower",
      "east-ice-dormer",
      "north-registered-lantern"
    ],
    "profile": "snow-longhouse-three-sawtooth"
  },
  {
    "id": "r4:guildhall:enchanted-forest:medium:02",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 2,
    "bounds": [
      47,
      12,
      41
    ],
    "wings": [
      [
        14,
        7,
        30,
        32
      ],
      [
        5,
        13,
        15,
        26
      ],
      [
        30,
        15,
        41,
        29
      ],
      [
        18,
        31,
        35,
        38
      ]
    ],
    "notches": [
      [
        14,
        7,
        17,
        10
      ],
      [
        27,
        7,
        30,
        10
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
        "from": 15,
        "to": 27,
        "door": 21,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 29,
        "from": 17,
        "to": 28,
        "door": 22,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 32,
        "from": 20,
        "to": 29,
        "door": 24,
        "facing": "north"
      }
    ],
    "windows": [
      [
        5,
        18,
        "west"
      ],
      [
        41,
        20,
        "east"
      ],
      [
        27,
        38,
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
        14,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        21,
        15
      ],
      [
        24,
        27
      ],
      [
        9,
        21
      ],
      [
        35,
        20
      ],
      [
        27,
        36
      ]
    ],
    "ridges": [
      [
        19,
        13,
        25,
        25
      ],
      [
        22,
        33,
        31,
        36
      ]
    ],
    "rooms": [
      {
        "id": "forest-members-bow-assembly",
        "kind": "gathering-hall",
        "rect": [
          18,
          12,
          28,
          30
        ]
      },
      {
        "id": "western-wood-inlay-studio",
        "kind": "shared-facility",
        "rect": [
          7,
          15,
          14,
          25
        ]
      },
      {
        "id": "east-carvers-glyph-work",
        "kind": "craft-study",
        "rect": [
          32,
          17,
          40,
          28
        ]
      },
      {
        "id": "northern-leaf-ledger-vault",
        "kind": "guild-ledger",
        "rect": [
          20,
          33,
          34,
          37
        ]
      }
    ],
    "skyline": [
      [
        20,
        16,
        25,
        21,
        8
      ],
      [
        34,
        18,
        38,
        23,
        9
      ],
      [
        23,
        33,
        27,
        36,
        8
      ]
    ],
    "signature": [
      "forest-twin-staggered-canopy-hall",
      47,
      41,
      "west-woodweaving",
      "east-oak-cupola",
      "north-lantern-bridge"
    ],
    "profile": "forest-twin-staggered-canopy-hall"
  },
  {
    "id": "r4:guildhall:mountain:small:02",
    "type": "guildhall",
    "biome": "mountain",
    "size": "small",
    "variant": 2,
    "bounds": [
      37,
      12,
      36
    ],
    "wings": [
      [
        12,
        7,
        25,
        27
      ],
      [
        4,
        13,
        13,
        25
      ],
      [
        25,
        12,
        34,
        23
      ],
      [
        16,
        26,
        28,
        32
      ]
    ],
    "notches": [
      [
        12,
        7,
        14,
        9
      ],
      [
        23,
        7,
        25,
        9
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
        "fixed": 14,
        "from": 14,
        "to": 25,
        "door": 19,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 25,
        "from": 14,
        "to": 23,
        "door": 19,
        "facing": "east"
      }
    ],
    "windows": [
      [
        4,
        19,
        "west"
      ],
      [
        34,
        18,
        "east"
      ],
      [
        23,
        32,
        "north"
      ],
      [
        15,
        7,
        "south"
      ],
      [
        22,
        7,
        "south"
      ],
      [
        12,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        17,
        17
      ],
      [
        21,
        24
      ],
      [
        7,
        19
      ],
      [
        30,
        17
      ],
      [
        24,
        30
      ]
    ],
    "ridges": [
      [
        16,
        13,
        22,
        23
      ]
    ],
    "rooms": [
      {
        "id": "ridge-rock-carvers-common-room",
        "kind": "gathering-hall",
        "rect": [
          15,
          12,
          24,
          24
        ]
      },
      {
        "id": "western-quarry-ledger",
        "kind": "shared-facility",
        "rect": [
          6,
          15,
          12,
          23
        ]
      },
      {
        "id": "east-slate-inlay-bench",
        "kind": "workshop",
        "rect": [
          27,
          14,
          33,
          22
        ]
      },
      {
        "id": "north-clan-charter-store",
        "kind": "guild-ledger",
        "rect": [
          17,
          28,
          27,
          31
        ]
      }
    ],
    "skyline": [
      [
        17,
        16,
        21,
        21,
        9
      ],
      [
        29,
        15,
        32,
        19,
        8
      ]
    ],
    "signature": [
      "mountain-cliffside-counter-roofs",
      37,
      36,
      "stonecutter-main-lantern",
      "east-wetstone-loft",
      "north-ridge-plan"
    ],
    "profile": "mountain-cliffside-counter-roofs"
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
   roof:'source-shaped stepped skyline with raised cupolas on independent timber roof beams; partial-family roof tiles still require true physical joint ABI',
   skyline:spec.skyline,
   circulation:'source occupied-cell navigation graph, not path tags',
   creatorAccepted:false,liveIntegrated:false,worldPlacement:false,physicalIphoneTested:false}
 };
 validateBlueprint(result);
 return result;
}
export function buildM2Silhouette(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2Silhouettes(){return PLANS.map(author);}
export const M2_SILHOUETTE_IDS=Object.freeze(PLANS.map(p=>p.id));
