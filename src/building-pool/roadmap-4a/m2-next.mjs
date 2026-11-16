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
    "id": "r4:civic-hall:temperate:large:02",
    "type": "civic-hall",
    "biome": "temperate",
    "size": "large",
    "variant": 2,
    "bounds": [
      60,
      10,
      52
    ],
    "wings": [
      [
        18,
        8,
        39,
        43
      ],
      [
        5,
        17,
        19,
        32
      ],
      [
        38,
        13,
        54,
        30
      ],
      [
        12,
        41,
        46,
        48
      ],
      [
        45,
        29,
        55,
        38
      ]
    ],
    "notches": [
      [
        18,
        8,
        20,
        11
      ],
      [
        37,
        8,
        39,
        11
      ]
    ],
    "entry": [
      28,
      8
    ],
    "porch": [
      25,
      4,
      31,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 21,
        "from": 17,
        "to": 31,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 37,
        "from": 15,
        "to": 29,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 42,
        "from": 25,
        "to": 34,
        "door": 29,
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
        54,
        19,
        "east"
      ],
      [
        28,
        48,
        "north"
      ],
      [
        23,
        8,
        "south"
      ],
      [
        34,
        8,
        "south"
      ],
      [
        12,
        48,
        "north"
      ]
    ],
    "fixtures": [
      [
        10,
        24
      ],
      [
        48,
        21
      ],
      [
        29,
        27
      ],
      [
        26,
        45
      ],
      [
        30,
        15
      ],
      [
        50,
        34
      ]
    ],
    "ridges": [
      [
        25,
        14,
        31,
        32
      ],
      [
        22,
        44,
        37,
        46
      ],
      [
        45,
        20,
        48,
        26
      ]
    ],
    "rooms": [
      {
        "id": "council-senate-main-chamber",
        "kind": "meeting",
        "rect": [
          23,
          14,
          36,
          39
        ]
      },
      {
        "id": "west-petition-tribunal",
        "kind": "administration",
        "rect": [
          7,
          19,
          18,
          30
        ]
      },
      {
        "id": "east-representative-records",
        "kind": "public-records",
        "rect": [
          41,
          15,
          52,
          28
        ]
      },
      {
        "id": "northern-seal-gallery",
        "kind": "state-archive",
        "rect": [
          16,
          43,
          44,
          47
        ]
      },
      {
        "id": "annex-clerks-court",
        "kind": "civic-offices",
        "rect": [
          47,
          31,
          53,
          37
        ]
      }
    ],
    "signature": [
      "temperate-senate-east-annex",
      60,
      52,
      "five-wing-staggered-state",
      "east-registers",
      "north-seal-galleria"
    ],
    "profile": "temperate-senate-east-annex"
  },
  {
    "id": "r4:civic-hall:desert:medium:03",
    "type": "civic-hall",
    "biome": "desert",
    "size": "medium",
    "variant": 3,
    "bounds": [
      45,
      10,
      38
    ],
    "wings": [
      [
        12,
        7,
        29,
        29
      ],
      [
        4,
        15,
        13,
        25
      ],
      [
        28,
        13,
        40,
        27
      ],
      [
        16,
        28,
        34,
        35
      ]
    ],
    "notches": [
      [
        12,
        7,
        15,
        9
      ],
      [
        26,
        7,
        29,
        9
      ]
    ],
    "entry": [
      21,
      7
    ],
    "porch": [
      18,
      3,
      24,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 14,
        "from": 16,
        "to": 25,
        "door": 20,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 28,
        "from": 15,
        "to": 26,
        "door": 21,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 29,
        "from": 18,
        "to": 29,
        "door": 24,
        "facing": "north"
      }
    ],
    "windows": [
      [
        4,
        20,
        "west"
      ],
      [
        40,
        20,
        "east"
      ],
      [
        24,
        35,
        "north"
      ],
      [
        18,
        7,
        "south"
      ],
      [
        25,
        7,
        "south"
      ],
      [
        16,
        35,
        "north"
      ]
    ],
    "fixtures": [
      [
        20,
        18
      ],
      [
        23,
        25
      ],
      [
        7,
        19
      ],
      [
        35,
        18
      ],
      [
        25,
        33
      ]
    ],
    "ridges": [
      [
        19,
        13,
        24,
        26
      ],
      [
        19,
        30,
        28,
        32
      ]
    ],
    "rooms": [
      {
        "id": "sunlit-ordinance-public-floor",
        "kind": "meeting",
        "rect": [
          16,
          12,
          26,
          27
        ]
      },
      {
        "id": "western-tax-appeals-office",
        "kind": "administration",
        "rect": [
          6,
          17,
          12,
          24
        ]
      },
      {
        "id": "eastern-sand-records-room",
        "kind": "public-ledger",
        "rect": [
          31,
          16,
          39,
          25
        ]
      },
      {
        "id": "rear-courtyard-oath-archive",
        "kind": "registry",
        "rect": [
          18,
          30,
          33,
          34
        ]
      }
    ],
    "signature": [
      "desert-municipal-registry-gallery",
      45,
      38,
      "side-tax-offices",
      "eastern-ordinance-block",
      "back-oath-vault"
    ],
    "profile": "desert-municipal-registry-gallery"
  },
  {
    "id": "r4:civic-hall:enchanted-forest:large:02",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 2,
    "bounds": [
      58,
      10,
      48
    ],
    "wings": [
      [
        18,
        8,
        36,
        35
      ],
      [
        5,
        17,
        19,
        33
      ],
      [
        35,
        14,
        51,
        28
      ],
      [
        13,
        34,
        43,
        44
      ],
      [
        43,
        26,
        54,
        39
      ],
      [
        10,
        30,
        21,
        39
      ]
    ],
    "notches": [
      [
        18,
        8,
        21,
        10
      ],
      [
        34,
        8,
        36,
        10
      ]
    ],
    "entry": [
      27,
      8
    ],
    "porch": [
      24,
      3,
      30,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 20,
        "from": 17,
        "to": 32,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 35,
        "from": 15,
        "to": 27,
        "door": 22,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 35,
        "from": 23,
        "to": 34,
        "door": 28,
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
        51,
        18,
        "east"
      ],
      [
        29,
        44,
        "north"
      ],
      [
        23,
        8,
        "south"
      ],
      [
        32,
        8,
        "south"
      ],
      [
        54,
        32,
        "east"
      ]
    ],
    "fixtures": [
      [
        27,
        15
      ],
      [
        29,
        28
      ],
      [
        10,
        23
      ],
      [
        44,
        20
      ],
      [
        29,
        40
      ],
      [
        50,
        34
      ]
    ],
    "ridges": [
      [
        24,
        14,
        30,
        29
      ],
      [
        21,
        36,
        36,
        41
      ],
      [
        45,
        29,
        50,
        36
      ]
    ],
    "rooms": [
      {
        "id": "elder-oak-council-assembly",
        "kind": "meeting",
        "rect": [
          22,
          13,
          33,
          32
        ]
      },
      {
        "id": "western-witness-pavilion",
        "kind": "administration",
        "rect": [
          7,
          19,
          18,
          32
        ]
      },
      {
        "id": "eastern-treaty-records-wing",
        "kind": "treaty-archive",
        "rect": [
          38,
          16,
          49,
          26
        ]
      },
      {
        "id": "northern-leaf-rune-hall",
        "kind": "public-hearing",
        "rect": [
          16,
          36,
          40,
          43
        ]
      },
      {
        "id": "eastern-woodland-clerks-wing",
        "kind": "staff-offices",
        "rect": [
          45,
          29,
          52,
          37
        ]
      }
    ],
    "signature": [
      "forest-unequal-hex-wing-registry",
      58,
      48,
      "west-witness-hall",
      "east-glyph-records",
      "northern-oath-canopy"
    ],
    "profile": "forest-unequal-hex-wing-registry"
  },
  {
    "id": "r4:civic-hall:mountain:small:02",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "small",
    "variant": 2,
    "bounds": [
      35,
      9,
      32
    ],
    "wings": [
      [
        11,
        6,
        22,
        25
      ],
      [
        5,
        13,
        12,
        23
      ],
      [
        21,
        12,
        31,
        21
      ],
      [
        14,
        24,
        26,
        29
      ]
    ],
    "notches": [
      [
        11,
        6,
        12,
        8
      ],
      [
        21,
        6,
        22,
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
        "from": 14,
        "to": 23,
        "door": 19,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 21,
        "from": 13,
        "to": 21,
        "door": 17,
        "facing": "east"
      }
    ],
    "windows": [
      [
        5,
        17,
        "west"
      ],
      [
        31,
        16,
        "east"
      ],
      [
        20,
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
        26,
        29,
        "north"
      ]
    ],
    "fixtures": [
      [
        16,
        14
      ],
      [
        18,
        21
      ],
      [
        8,
        18
      ],
      [
        27,
        16
      ],
      [
        20,
        27
      ]
    ],
    "ridges": [
      [
        16,
        10,
        19,
        21
      ],
      [
        17,
        25,
        22,
        27
      ]
    ],
    "rooms": [
      {
        "id": "highland-civic-petition-floor",
        "kind": "meeting",
        "rect": [
          14,
          10,
          20,
          23
        ]
      },
      {
        "id": "mountain-land-rights-office",
        "kind": "administration",
        "rect": [
          6,
          15,
          12,
          22
        ]
      },
      {
        "id": "eastern-tax-records",
        "kind": "ledger",
        "rect": [
          23,
          13,
          29,
          20
        ]
      },
      {
        "id": "north-ridge-hearing-nave",
        "kind": "hearing-gallery",
        "rect": [
          16,
          26,
          25,
          28
        ]
      }
    ],
    "signature": [
      "mountain-fortified-surveyor-court",
      35,
      32,
      "highland-west-tax-apse",
      "ridge-archive",
      "low-entrance"
    ],
    "profile": "mountain-fortified-surveyor-court"
  },
  {
    "id": "r4:guildhall:temperate:small:02",
    "type": "guildhall",
    "biome": "temperate",
    "size": "small",
    "variant": 2,
    "bounds": [
      34,
      9,
      31
    ],
    "wings": [
      [
        9,
        7,
        23,
        22
      ],
      [
        4,
        13,
        10,
        24
      ],
      [
        22,
        15,
        30,
        25
      ],
      [
        13,
        22,
        22,
        28
      ]
    ],
    "notches": [
      [
        9,
        7,
        11,
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
      16,
      7
    ],
    "porch": [
      13,
      3,
      19,
      6
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 11,
        "from": 14,
        "to": 21,
        "door": 18,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 23,
        "from": 16,
        "to": 24,
        "door": 19,
        "facing": "east"
      }
    ],
    "windows": [
      [
        4,
        17,
        "west"
      ],
      [
        30,
        19,
        "east"
      ],
      [
        18,
        28,
        "north"
      ],
      [
        13,
        7,
        "south"
      ],
      [
        20,
        7,
        "south"
      ],
      [
        9,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        15,
        15
      ],
      [
        18,
        20
      ],
      [
        7,
        18
      ],
      [
        27,
        19
      ],
      [
        17,
        26
      ]
    ],
    "ridges": [
      [
        14,
        13,
        19,
        18
      ],
      [
        16,
        23,
        20,
        26
      ]
    ],
    "rooms": [
      {
        "id": "market-guild-assembly",
        "kind": "gathering-hall",
        "rect": [
          12,
          11,
          21,
          21
        ]
      },
      {
        "id": "western-skill-records",
        "kind": "shared-facility",
        "rect": [
          5,
          15,
          10,
          23
        ]
      },
      {
        "id": "east-joiners-workbench",
        "kind": "workshop",
        "rect": [
          25,
          17,
          29,
          24
        ]
      },
      {
        "id": "rear-journeymen-ledgers",
        "kind": "guild-ledger",
        "rect": [
          14,
          23,
          21,
          27
        ]
      }
    ],
    "signature": [
      "temperate-joiners-offset-t",
      34,
      31,
      "west-skill-study",
      "east-joinery-workshop",
      "rear-ledger"
    ],
    "profile": "temperate-joiners-offset-t"
  },
  {
    "id": "r4:guildhall:snow:small:01",
    "type": "guildhall",
    "biome": "snow",
    "size": "small",
    "variant": 1,
    "bounds": [
      32,
      9,
      30
    ],
    "wings": [
      [
        10,
        6,
        22,
        23
      ],
      [
        4,
        12,
        11,
        20
      ],
      [
        21,
        11,
        28,
        22
      ],
      [
        13,
        23,
        19,
        27
      ]
    ],
    "notches": [
      [
        10,
        6,
        12,
        8
      ],
      [
        20,
        6,
        22,
        8
      ]
    ],
    "entry": [
      16,
      6
    ],
    "porch": [
      13,
      2,
      19,
      5
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 12,
        "from": 13,
        "to": 20,
        "door": 17,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 20,
        "from": 13,
        "to": 21,
        "door": 18,
        "facing": "east"
      }
    ],
    "windows": [
      [
        4,
        16,
        "west"
      ],
      [
        28,
        17,
        "east"
      ],
      [
        16,
        27,
        "north"
      ],
      [
        13,
        6,
        "south"
      ],
      [
        19,
        6,
        "south"
      ],
      [
        10,
        10,
        "west"
      ]
    ],
    "fixtures": [
      [
        16,
        13
      ],
      [
        17,
        21
      ],
      [
        6,
        16
      ],
      [
        25,
        17
      ],
      [
        16,
        25
      ]
    ],
    "ridges": [
      [
        15,
        11,
        18,
        20
      ]
    ],
    "rooms": [
      {
        "id": "snow-guild-timber-hearth",
        "kind": "gathering-hall",
        "rect": [
          13,
          11,
          19,
          22
        ]
      },
      {
        "id": "west-woodcraft-registration",
        "kind": "shared-facility",
        "rect": [
          5,
          14,
          11,
          19
        ]
      },
      {
        "id": "eastern-repair-bench",
        "kind": "artisan-study",
        "rect": [
          22,
          13,
          27,
          21
        ]
      },
      {
        "id": "northern-winter-membership",
        "kind": "guild-ledger",
        "rect": [
          14,
          24,
          18,
          26
        ]
      }
    ],
    "signature": [
      "snow-two-hearth-wings",
      32,
      30,
      "woodcraft-west",
      "repair-east",
      "winter-ledgers"
    ],
    "profile": "snow-two-hearth-wings"
  },
  {
    "id": "r4:guildhall:desert:large:01",
    "type": "guildhall",
    "biome": "desert",
    "size": "large",
    "variant": 1,
    "bounds": [
      59,
      10,
      49
    ],
    "wings": [
      [
        16,
        8,
        37,
        34
      ],
      [
        5,
        18,
        17,
        32
      ],
      [
        36,
        14,
        53,
        33
      ],
      [
        12,
        33,
        45,
        44
      ],
      [
        45,
        32,
        55,
        41
      ]
    ],
    "notches": [
      [
        16,
        8,
        19,
        10
      ],
      [
        34,
        8,
        37,
        10
      ]
    ],
    "entry": [
      27,
      8
    ],
    "porch": [
      24,
      4,
      30,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 18,
        "from": 19,
        "to": 32,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 35,
        "from": 15,
        "to": 31,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 34,
        "from": 20,
        "to": 33,
        "door": 27,
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
        53,
        20,
        "east"
      ],
      [
        30,
        44,
        "north"
      ],
      [
        22,
        8,
        "south"
      ],
      [
        32,
        8,
        "south"
      ],
      [
        55,
        36,
        "east"
      ]
    ],
    "fixtures": [
      [
        25,
        16
      ],
      [
        30,
        29
      ],
      [
        10,
        23
      ],
      [
        45,
        22
      ],
      [
        26,
        41
      ],
      [
        51,
        37
      ]
    ],
    "ridges": [
      [
        23,
        14,
        30,
        28
      ],
      [
        22,
        36,
        38,
        41
      ],
      [
        45,
        34,
        51,
        38
      ]
    ],
    "rooms": [
      {
        "id": "desert-dyers-council-of-trade",
        "kind": "gathering-hall",
        "rect": [
          20,
          13,
          34,
          32
        ]
      },
      {
        "id": "west-weight-measures-vault",
        "kind": "shared-facility",
        "rect": [
          7,
          20,
          16,
          30
        ]
      },
      {
        "id": "eastern-dyers-covered-yard",
        "kind": "artisan-workyard",
        "rect": [
          38,
          16,
          52,
          31
        ]
      },
      {
        "id": "rear-caravan-account-house",
        "kind": "guild-ledger",
        "rect": [
          17,
          36,
          44,
          43
        ]
      },
      {
        "id": "eastern-escrow-depot",
        "kind": "escrow-office",
        "rect": [
          47,
          34,
          54,
          40
        ]
      }
    ],
    "signature": [
      "desert-caravan-grand-exchange",
      59,
      49,
      "west-calibration",
      "east-color-yard",
      "rear-fiscal-vault"
    ],
    "profile": "desert-caravan-grand-exchange"
  },
  {
    "id": "r4:guildhall:enchanted-forest:small:01",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "small",
    "variant": 1,
    "bounds": [
      37,
      9,
      35
    ],
    "wings": [
      [
        11,
        7,
        24,
        24
      ],
      [
        4,
        13,
        12,
        25
      ],
      [
        23,
        15,
        32,
        27
      ],
      [
        15,
        24,
        28,
        31
      ]
    ],
    "notches": [
      [
        11,
        7,
        13,
        9
      ],
      [
        22,
        7,
        24,
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
        "fixed": 13,
        "from": 15,
        "to": 23,
        "door": 19,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 23,
        "from": 16,
        "to": 24,
        "door": 20,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 25,
        "from": 17,
        "to": 23,
        "door": 19,
        "facing": "north"
      }
    ],
    "windows": [
      [
        4,
        19,
        "west"
      ],
      [
        32,
        21,
        "east"
      ],
      [
        22,
        31,
        "north"
      ],
      [
        15,
        7,
        "south"
      ],
      [
        21,
        7,
        "south"
      ],
      [
        11,
        11,
        "west"
      ]
    ],
    "fixtures": [
      [
        17,
        15
      ],
      [
        20,
        22
      ],
      [
        7,
        19
      ],
      [
        28,
        21
      ],
      [
        22,
        29
      ]
    ],
    "ridges": [
      [
        16,
        13,
        20,
        21
      ],
      [
        18,
        26,
        24,
        29
      ]
    ],
    "rooms": [
      {
        "id": "canopy-carvers-conclave",
        "kind": "gathering-hall",
        "rect": [
          14,
          12,
          22,
          23
        ]
      },
      {
        "id": "western-shared-loom",
        "kind": "shared-facility",
        "rect": [
          6,
          15,
          12,
          23
        ]
      },
      {
        "id": "eastern-glyph-carving-workshop",
        "kind": "carving-room",
        "rect": [
          25,
          17,
          31,
          26
        ]
      },
      {
        "id": "northern-leaf-ledger",
        "kind": "guild-ledger",
        "rect": [
          16,
          26,
          27,
          30
        ]
      }
    ],
    "signature": [
      "forest-rotated-four-arm-woodworkers",
      37,
      35,
      "west-weavers",
      "east-glyph-carvers",
      "north-leaf-records"
    ],
    "profile": "forest-rotated-four-arm-woodworkers"
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
   roof:'actual exposed partial-family roof candidate with direct raised-ridge beams and timber purlin lattice',
   circulation:'source occupied-cell navigation graph, not path tags',
   creatorAccepted:false,liveIntegrated:false,worldPlacement:false,physicalIphoneTested:false}
 };
 validateBlueprint(result);
 return result;
}
export function buildM2Next(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2Next(){return PLANS.map(author);}
export const M2_NEXT_IDS=Object.freeze(PLANS.map(p=>p.id));
