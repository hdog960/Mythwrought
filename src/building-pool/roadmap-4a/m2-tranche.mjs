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
    "id": "r4:civic-hall:desert:small:02",
    "type": "civic-hall",
    "biome": "desert",
    "size": "small",
    "variant": 2,
    "bounds": [
      32,
      9,
      29
    ],
    "wings": [
      [
        9,
        7,
        22,
        23
      ],
      [
        4,
        12,
        10,
        19
      ],
      [
        21,
        13,
        27,
        22
      ],
      [
        12,
        23,
        19,
        26
      ]
    ],
    "notches": [
      [
        9,
        7,
        10,
        9
      ],
      [
        21,
        7,
        22,
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
        "to": 19,
        "door": 17,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 20,
        "from": 14,
        "to": 20,
        "door": 17,
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
        27,
        18,
        "east"
      ],
      [
        16,
        26,
        "north"
      ],
      [
        13,
        7,
        "south"
      ],
      [
        19,
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
        14
      ],
      [
        17,
        20
      ],
      [
        6,
        16
      ],
      [
        24,
        18
      ],
      [
        16,
        24
      ]
    ],
    "ridges": [
      [
        14,
        12,
        18,
        18
      ],
      [
        14,
        23,
        17,
        25
      ]
    ],
    "rooms": [
      {
        "id": "sun-court-civic-assembly",
        "kind": "meeting",
        "rect": [
          12,
          11,
          19,
          22
        ]
      },
      {
        "id": "west-judicial-petition-room",
        "kind": "administration",
        "rect": [
          5,
          13,
          10,
          18
        ]
      },
      {
        "id": "dune-tax-records-chamber",
        "kind": "public-ledger",
        "rect": [
          22,
          14,
          26,
          21
        ]
      }
    ],
    "signature": [
      "desert-judicial-triptych",
      32,
      29,
      "sun-court",
      "tax-east",
      "tall-shadow-porch"
    ],
    "profile": "desert-judicial-triptych"
  },
  {
    "id": "r4:civic-hall:snow:large:02",
    "type": "civic-hall",
    "biome": "snow",
    "size": "large",
    "variant": 2,
    "bounds": [
      54,
      10,
      46
    ],
    "wings": [
      [
        15,
        8,
        38,
        36
      ],
      [
        5,
        16,
        16,
        31
      ],
      [
        37,
        13,
        48,
        29
      ],
      [
        19,
        36,
        34,
        41
      ]
    ],
    "notches": [
      [
        15,
        8,
        17,
        10
      ],
      [
        36,
        8,
        38,
        10
      ]
    ],
    "entry": [
      26,
      8
    ],
    "porch": [
      22,
      3,
      30,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 18,
        "from": 18,
        "to": 30,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 35,
        "from": 15,
        "to": 28,
        "door": 22,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 37,
        "from": 21,
        "to": 32,
        "door": 27,
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
        48,
        18,
        "east"
      ],
      [
        26,
        41,
        "north"
      ],
      [
        20,
        8,
        "south"
      ],
      [
        32,
        8,
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
        26,
        15
      ],
      [
        28,
        25
      ],
      [
        9,
        23
      ],
      [
        42,
        19
      ],
      [
        27,
        39
      ]
    ],
    "ridges": [
      [
        24,
        12,
        29,
        29
      ],
      [
        22,
        37,
        31,
        39
      ],
      [
        40,
        18,
        44,
        23
      ]
    ],
    "rooms": [
      {
        "id": "winter-senate-chamber",
        "kind": "meeting",
        "rect": [
          20,
          13,
          33,
          34
        ]
      },
      {
        "id": "snow-hearth-welfare-desk",
        "kind": "administration",
        "rect": [
          7,
          19,
          16,
          30
        ]
      },
      {
        "id": "north-crier-hearing-wing",
        "kind": "public-hearing",
        "rect": [
          39,
          16,
          47,
          27
        ]
      },
      {
        "id": "drift-protected-records-vault",
        "kind": "public-records",
        "rect": [
          21,
          37,
          32,
          40
        ]
      }
    ],
    "signature": [
      "snow-hearth-senate-four-wing",
      54,
      46,
      "drift-dais",
      "north-vault",
      "two-petition-corridors"
    ],
    "profile": "snow-hearth-senate-four-wing"
  },
  {
    "id": "r4:civic-hall:enchanted-forest:medium:02",
    "type": "civic-hall",
    "biome": "enchanted-forest",
    "size": "medium",
    "variant": 2,
    "bounds": [
      44,
      10,
      38
    ],
    "wings": [
      [
        10,
        8,
        25,
        29
      ],
      [
        4,
        13,
        11,
        23
      ],
      [
        25,
        15,
        36,
        25
      ],
      [
        14,
        28,
        24,
        34
      ]
    ],
    "notches": [
      [
        10,
        8,
        12,
        10
      ],
      [
        23,
        8,
        25,
        10
      ]
    ],
    "entry": [
      18,
      8
    ],
    "porch": [
      15,
      4,
      21,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 13,
        "from": 14,
        "to": 23,
        "door": 18,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 26,
        "from": 16,
        "to": 24,
        "door": 20,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 29,
        "from": 16,
        "to": 23,
        "door": 19,
        "facing": "north"
      }
    ],
    "windows": [
      [
        4,
        18,
        "west"
      ],
      [
        36,
        20,
        "east"
      ],
      [
        18,
        34,
        "north"
      ],
      [
        15,
        8,
        "south"
      ],
      [
        21,
        8,
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
        17,
        15
      ],
      [
        20,
        25
      ],
      [
        7,
        18
      ],
      [
        29,
        21
      ],
      [
        19,
        32
      ]
    ],
    "ridges": [
      [
        17,
        13,
        21,
        25
      ],
      [
        17,
        30,
        22,
        32
      ],
      [
        28,
        19,
        31,
        22
      ]
    ],
    "rooms": [
      {
        "id": "forest-treaty-circle",
        "kind": "meeting",
        "rect": [
          15,
          12,
          23,
          26
        ]
      },
      {
        "id": "western-witness-deposition",
        "kind": "administration",
        "rect": [
          5,
          15,
          11,
          22
        ]
      },
      {
        "id": "east-ancient-records-annex",
        "kind": "hearing-archive",
        "rect": [
          27,
          16,
          35,
          24
        ]
      },
      {
        "id": "northern-oath-apse",
        "kind": "public-oath-room",
        "rect": [
          15,
          30,
          23,
          33
        ]
      }
    ],
    "signature": [
      "enchanted-pavilion-bridge",
      44,
      38,
      "forest-west-witness",
      "east-glyph-depot",
      "north-apse"
    ],
    "profile": "enchanted-pavilion-bridge"
  },
  {
    "id": "r4:civic-hall:mountain:large:02",
    "type": "civic-hall",
    "biome": "mountain",
    "size": "large",
    "variant": 2,
    "bounds": [
      55,
      10,
      48
    ],
    "wings": [
      [
        18,
        6,
        35,
        40
      ],
      [
        6,
        17,
        19,
        31
      ],
      [
        34,
        13,
        49,
        28
      ],
      [
        13,
        38,
        43,
        44
      ],
      [
        38,
        28,
        45,
        36
      ]
    ],
    "notches": [
      [
        18,
        6,
        20,
        9
      ],
      [
        33,
        6,
        35,
        9
      ]
    ],
    "entry": [
      26,
      6
    ],
    "porch": [
      23,
      2,
      29,
      5
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 20,
        "from": 17,
        "to": 31,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 33,
        "from": 15,
        "to": 27,
        "door": 22,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 39,
        "from": 21,
        "to": 33,
        "door": 27,
        "facing": "north"
      }
    ],
    "windows": [
      [
        6,
        24,
        "west"
      ],
      [
        49,
        20,
        "east"
      ],
      [
        28,
        44,
        "north"
      ],
      [
        24,
        6,
        "south"
      ],
      [
        31,
        6,
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
        27,
        16
      ],
      [
        29,
        32
      ],
      [
        10,
        24
      ],
      [
        41,
        20
      ],
      [
        28,
        42
      ],
      [
        41,
        33
      ]
    ],
    "ridges": [
      [
        23,
        13,
        30,
        31
      ],
      [
        21,
        39,
        35,
        42
      ],
      [
        39,
        18,
        43,
        25
      ]
    ],
    "rooms": [
      {
        "id": "mountain-clan-council-hall",
        "kind": "meeting",
        "rect": [
          22,
          12,
          32,
          36
        ]
      },
      {
        "id": "western-quarry-licensing",
        "kind": "administration",
        "rect": [
          7,
          19,
          18,
          30
        ]
      },
      {
        "id": "eastern-ridge-public-audit",
        "kind": "public-audit",
        "rect": [
          37,
          16,
          48,
          27
        ]
      },
      {
        "id": "northern-mountain-charters",
        "kind": "charter-vault",
        "rect": [
          17,
          40,
          40,
          43
        ]
      },
      {
        "id": "eastern-archivist-tower-foot",
        "kind": "sealed-office",
        "rect": [
          39,
          30,
          44,
          35
        ]
      }
    ],
    "signature": [
      "mountain-clan-double-terrace",
      55,
      48,
      "eastern-tower",
      "north-charter-bow",
      "west-quarry-hall"
    ],
    "profile": "mountain-clan-double-terrace"
  },
  {
    "id": "r4:guildhall:temperate:large:01",
    "type": "guildhall",
    "biome": "temperate",
    "size": "large",
    "variant": 1,
    "bounds": [
      53,
      10,
      45
    ],
    "wings": [
      [
        10,
        8,
        35,
        32
      ],
      [
        4,
        16,
        11,
        28
      ],
      [
        35,
        17,
        47,
        34
      ],
      [
        17,
        32,
        38,
        41
      ]
    ],
    "notches": [
      [
        10,
        8,
        12,
        11
      ],
      [
        33,
        8,
        35,
        11
      ],
      [
        20,
        20,
        24,
        24
      ]
    ],
    "entry": [
      23,
      8
    ],
    "porch": [
      19,
      4,
      27,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 34,
        "from": 18,
        "to": 29,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 33,
        "from": 20,
        "to": 34,
        "door": 28,
        "facing": "north"
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
        25,
        "east"
      ],
      [
        28,
        41,
        "north"
      ],
      [
        15,
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
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        15,
        15
      ],
      [
        30,
        17
      ],
      [
        7,
        21
      ],
      [
        42,
        23
      ],
      [
        23,
        36
      ],
      [
        32,
        37
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
        28,
        13,
        33,
        19
      ],
      [
        24,
        34,
        31,
        37
      ]
    ],
    "rooms": [
      {
        "id": "three-guild-oaths-main-assembly",
        "kind": "gathering-hall",
        "rect": [
          14,
          12,
          32,
          30
        ]
      },
      {
        "id": "western-grain-weight-inspection",
        "kind": "shared-facility",
        "rect": [
          5,
          18,
          10,
          27
        ]
      },
      {
        "id": "eastern-carpenter-workyard",
        "kind": "covered-workyard",
        "rect": [
          37,
          20,
          45,
          32
        ]
      },
      {
        "id": "north-master-ledger-loft",
        "kind": "guild-ledger",
        "rect": [
          20,
          34,
          35,
          40
        ]
      }
    ],
    "signature": [
      "temperate-guild-open-court",
      53,
      45,
      "open-center-court",
      "weight-west",
      "carpentry-east"
    ],
    "profile": "temperate-guild-open-court"
  },
  {
    "id": "r4:guildhall:desert:medium:01",
    "type": "guildhall",
    "biome": "desert",
    "size": "medium",
    "variant": 1,
    "bounds": [
      45,
      10,
      38
    ],
    "wings": [
      [
        8,
        8,
        26,
        27
      ],
      [
        3,
        16,
        9,
        30
      ],
      [
        26,
        17,
        39,
        31
      ],
      [
        13,
        27,
        27,
        34
      ]
    ],
    "notches": [
      [
        8,
        8,
        11,
        10
      ],
      [
        23,
        8,
        26,
        10
      ],
      [
        31,
        22,
        34,
        25
      ]
    ],
    "entry": [
      17,
      8
    ],
    "porch": [
      14,
      4,
      20,
      7
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 24,
        "from": 13,
        "to": 25,
        "door": 20,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 27,
        "from": 15,
        "to": 24,
        "door": 20,
        "facing": "north"
      }
    ],
    "windows": [
      [
        3,
        19,
        "west"
      ],
      [
        39,
        20,
        "east"
      ],
      [
        19,
        34,
        "north"
      ],
      [
        14,
        8,
        "south"
      ],
      [
        21,
        8,
        "south"
      ],
      [
        8,
        12,
        "west"
      ]
    ],
    "fixtures": [
      [
        15,
        16
      ],
      [
        22,
        20
      ],
      [
        6,
        20
      ],
      [
        28,
        19
      ],
      [
        23,
        31
      ],
      [
        37,
        29
      ]
    ],
    "ridges": [
      [
        13,
        12,
        17,
        20
      ],
      [
        20,
        29,
        24,
        32
      ],
      [
        27,
        18,
        30,
        21
      ]
    ],
    "rooms": [
      {
        "id": "caravan-dyers-mutual-hall",
        "kind": "gathering-hall",
        "rect": [
          11,
          12,
          23,
          24
        ]
      },
      {
        "id": "western-merchant-escrow",
        "kind": "shared-facility",
        "rect": [
          4,
          18,
          9,
          29
        ]
      },
      {
        "id": "dune-dyers-work-courtyard",
        "kind": "dyers-workshop",
        "rect": [
          28,
          18,
          37,
          30
        ]
      },
      {
        "id": "caravan-road-tally-galleria",
        "kind": "guild-ledger",
        "rect": [
          15,
          29,
          25,
          33
        ]
      }
    ],
    "signature": [
      "desert-caravan-escrow-split",
      45,
      38,
      "west-escrow-arm",
      "east-dyers-court",
      "northern-tally"
    ],
    "profile": "desert-caravan-escrow-split"
  },
  {
    "id": "r4:guildhall:enchanted-forest:large:01",
    "type": "guildhall",
    "biome": "enchanted-forest",
    "size": "large",
    "variant": 1,
    "bounds": [
      58,
      10,
      47
    ],
    "wings": [
      [
        17,
        9,
        36,
        29
      ],
      [
        5,
        17,
        18,
        31
      ],
      [
        35,
        12,
        51,
        27
      ],
      [
        23,
        28,
        43,
        41
      ],
      [
        10,
        30,
        23,
        39
      ],
      [
        43,
        24,
        54,
        36
      ]
    ],
    "notches": [
      [
        17,
        9,
        19,
        12
      ],
      [
        34,
        9,
        36,
        12
      ],
      [
        48,
        30,
        51,
        33
      ]
    ],
    "entry": [
      27,
      9
    ],
    "porch": [
      24,
      5,
      31,
      8
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 19,
        "from": 19,
        "to": 29,
        "door": 24,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 37,
        "from": 16,
        "to": 27,
        "door": 22,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 30,
        "from": 25,
        "to": 40,
        "door": 33,
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
        54,
        30,
        "east"
      ],
      [
        30,
        41,
        "north"
      ],
      [
        25,
        9,
        "south"
      ],
      [
        33,
        9,
        "south"
      ],
      [
        17,
        13,
        "west"
      ]
    ],
    "fixtures": [
      [
        26,
        16
      ],
      [
        29,
        25
      ],
      [
        9,
        23
      ],
      [
        45,
        19
      ],
      [
        32,
        36
      ],
      [
        47,
        29
      ],
      [
        15,
        35
      ]
    ],
    "ridges": [
      [
        23,
        14,
        30,
        23
      ],
      [
        26,
        32,
        33,
        38
      ],
      [
        43,
        18,
        47,
        23
      ]
    ],
    "rooms": [
      {
        "id": "canopy-concord-main-guild",
        "kind": "gathering-hall",
        "rect": [
          20,
          13,
          34,
          27
        ]
      },
      {
        "id": "west-mosswood-member-shrine",
        "kind": "shared-facility",
        "rect": [
          7,
          19,
          17,
          30
        ]
      },
      {
        "id": "east-fae-artisan-bazaar",
        "kind": "artisan-stalls",
        "rect": [
          38,
          15,
          50,
          26
        ]
      },
      {
        "id": "northern-leaf-archive-walk",
        "kind": "guild-ledger",
        "rect": [
          25,
          31,
          42,
          40
        ]
      },
      {
        "id": "west-lantern-weavers-room",
        "kind": "weavers-hall",
        "rect": [
          12,
          32,
          21,
          38
        ]
      },
      {
        "id": "east-spore-workroom",
        "kind": "noncombat-workroom",
        "rect": [
          44,
          30,
          47,
          35
        ]
      }
    ],
    "signature": [
      "forest-multi-finger-guild",
      58,
      47,
      "six-distinct-arms",
      "canopy-ledger",
      "weavers-bridge"
    ],
    "profile": "forest-multi-finger-guild"
  },
  {
    "id": "r4:guildhall:mountain:large:01",
    "type": "guildhall",
    "biome": "mountain",
    "size": "large",
    "variant": 1,
    "bounds": [
      59,
      10,
      49
    ],
    "wings": [
      [
        20,
        6,
        38,
        42
      ],
      [
        6,
        17,
        21,
        33
      ],
      [
        37,
        14,
        53,
        29
      ],
      [
        13,
        39,
        46,
        46
      ],
      [
        42,
        28,
        49,
        40
      ]
    ],
    "notches": [
      [
        20,
        6,
        23,
        9
      ],
      [
        35,
        6,
        38,
        9
      ],
      [
        13,
        44,
        16,
        46
      ]
    ],
    "entry": [
      29,
      6
    ],
    "porch": [
      26,
      2,
      32,
      5
    ],
    "partitions": [
      {
        "axis": "x",
        "fixed": 22,
        "from": 19,
        "to": 33,
        "door": 25,
        "facing": "west"
      },
      {
        "axis": "x",
        "fixed": 36,
        "from": 17,
        "to": 28,
        "door": 23,
        "facing": "east"
      },
      {
        "axis": "z",
        "fixed": 40,
        "from": 24,
        "to": 36,
        "door": 29,
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
        53,
        20,
        "east"
      ],
      [
        28,
        46,
        "north"
      ],
      [
        27,
        6,
        "south"
      ],
      [
        34,
        6,
        "south"
      ],
      [
        20,
        13,
        "west"
      ]
    ],
    "fixtures": [
      [
        29,
        18
      ],
      [
        30,
        31
      ],
      [
        10,
        23
      ],
      [
        45,
        20
      ],
      [
        29,
        43
      ],
      [
        45,
        35
      ]
    ],
    "ridges": [
      [
        26,
        12,
        32,
        28
      ],
      [
        22,
        40,
        36,
        43
      ],
      [
        42,
        16,
        46,
        23
      ]
    ],
    "rooms": [
      {
        "id": "mountain-masons-general-guild",
        "kind": "gathering-hall",
        "rect": [
          24,
          12,
          35,
          36
        ]
      },
      {
        "id": "western-stonecutters-bench",
        "kind": "shared-facility",
        "rect": [
          8,
          19,
          20,
          31
        ]
      },
      {
        "id": "eastern-metal-inlay-gallery",
        "kind": "artisan-study",
        "rect": [
          39,
          16,
          51,
          27
        ]
      },
      {
        "id": "north-stone-charter-hall",
        "kind": "guild-ledger",
        "rect": [
          16,
          40,
          42,
          45
        ]
      },
      {
        "id": "high-ridge-survey-room",
        "kind": "survey-hall",
        "rect": [
          43,
          31,
          48,
          38
        ]
      }
    ],
    "signature": [
      "mountain-asymmetric-stoneworks",
      59,
      49,
      "west-masonry-bay",
      "east-metal-gallery",
      "north-register-arch"
    ],
    "profile": "mountain-asymmetric-stoneworks"
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
export function buildM2Tranche(id){
 if(!VALID_IDS.has(id))throw RangeError('Unknown distinctly authored 4A regional plan '+id);
 return author(PLANS.find(p=>p.id===id));
}
export function allM2Tranche(){return PLANS.map(author);}
export const M2_TRANCHE_IDS=Object.freeze(PLANS.map(p=>p.id));
