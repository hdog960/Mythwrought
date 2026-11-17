// Builder 3B independent watchtower variant 2 — fifteen independently authored fifth-variation segmented central keeps and differently elevated source roofs.
// This file never places or registers a structure in-game; PR #122's originals unchanged.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const N=(id,x,y,z,kind='passage')=>({id,x,y,z,kind,width:2,headroom:2});
const E=(from,to,kind='level')=>({from,to,kind});
const key=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;
const plans=[
 {
  "biome": "temperate",
  "size": "small",
  "w": 34,
  "d": 45,
  "steps": 14,
  "aisle": 12,
  "mask": [
   [
    3,
    20,
    0,
    44
   ],
   [
    0,
    9,
    2,
    13
   ],
   [
    0,
    10,
    33,
    42
   ],
   [
    22,
    26,
    20,
    30
   ],
   [
    26,
    31,
    1,
    6
   ],
   [
    19,
    25,
    6,
    10
   ],
   [
    19,
    24,
    22,
    24
   ],
   [
    20,
    22,
    25,
    27
   ],
   [
    20,
    26,
    3,
    5
   ]
  ],
  "cuts": [
   [
    18,
    20,
    20,
    26
   ],
   [
    3,
    6,
    26,
    31
   ],
   [
    19,
    20,
    28,
    31
   ]
  ],
  "roofType": "gable",
  "northHeight": 5,
  "southHeight": 7,
  "title": "Alderford river loop watch with staggered west porch and crooked high bridge",
  "canopy": [
   7,
   12,
   6,
   13
  ],
  "cargo": [
   8,
   18
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079",
  "symbol": "",
  "roofRibs": [
   [
    0,
    9,
    2,
    13,
    "x",
    3
   ],
   [
    22,
    26,
    20,
    30,
    "z",
    3
   ]
  ],
  "lofts": [
   [
    15,
    18,
    9,
    15,
    5,
    "x"
   ],
   [
    15,
    18,
    27,
    31,
    6,
    "z"
   ]
  ],
  "wallCycle": 2,
  "coreCap": 20,
  "outerWallBands": [
   13,
   6,
   10
  ],
  "bridgePaths": [
   [
    20,
    22,
    25,
    27
   ],
   [
    20,
    26,
    3,
    5
   ]
  ]
 },
 {
  "biome": "desert",
  "size": "small",
  "w": 38,
  "d": 44,
  "steps": 13,
  "aisle": 12,
  "mask": [
   [
    3,
    22,
    0,
    43
   ],
   [
    3,
    9,
    17,
    38
   ],
   [
    0,
    8,
    0,
    8
   ],
   [
    27,
    36,
    1,
    13
   ],
   [
    26,
    34,
    30,
    36
   ],
   [
    19,
    26,
    10,
    13
   ],
   [
    20,
    28,
    32,
    36
   ],
   [
    22,
    27,
    7,
    9
   ],
   [
    22,
    26,
    33,
    35
   ]
  ],
  "cuts": [
   [
    20,
    22,
    22,
    25
   ],
   [
    3,
    6,
    25,
    30
   ],
   [
    21,
    22,
    27,
    30
   ]
  ],
  "roofType": "terrace",
  "northHeight": 6,
  "southHeight": 8,
  "title": "Sundial crooked desert beacon with recessed passage and offset bell shed",
  "canopy": [
   7,
   12,
   6,
   13
  ],
  "cargo": [
   8,
   17
  ],
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "",
  "roofRibs": [
   [
    3,
    9,
    17,
    38,
    "z",
    4
   ],
   [
    27,
    36,
    1,
    13,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    15,
    18,
    9,
    15,
    6,
    "x"
   ],
   [
    15,
    18,
    26,
    30,
    7,
    "z"
   ]
  ],
  "wallCycle": 1,
  "coreCap": 22,
  "outerWallBands": [
   12,
   7,
   8
  ],
  "bridgePaths": [
   [
    22,
    27,
    7,
    9
   ],
   [
    22,
    26,
    33,
    35
   ]
  ]
 },
 {
  "biome": "snow",
  "size": "small",
  "w": 38,
  "d": 49,
  "steps": 14,
  "aisle": 12,
  "mask": [
   [
    3,
    19,
    0,
    48
   ],
   [
    0,
    10,
    2,
    20
   ],
   [
    2,
    7,
    34,
    44
   ],
   [
    21,
    28,
    26,
    41
   ],
   [
    25,
    33,
    4,
    7
   ],
   [
    18,
    26,
    9,
    13
   ],
   [
    19,
    26,
    32,
    35
   ],
   [
    19,
    21,
    33,
    35
   ],
   [
    19,
    25,
    5,
    7
   ]
  ],
  "cuts": [
   [
    17,
    19,
    20,
    29
   ],
   [
    3,
    6,
    30,
    35
   ],
   [
    18,
    19,
    31,
    34
   ]
  ],
  "roofType": "cross",
  "northHeight": 7,
  "southHeight": 9,
  "title": "Rimeglass split-peak white watch with low snowbreak and raised northeast cap",
  "canopy": [
   7,
   12,
   6,
   13
  ],
  "cargo": [
   8,
   18
  ],
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081",
  "symbol": "biome130:094",
  "roofRibs": [
   [
    0,
    10,
    2,
    20,
    "x",
    3
   ],
   [
    21,
    28,
    26,
    41,
    "z",
    5
   ]
  ],
  "lofts": [
   [
    15,
    18,
    9,
    15,
    7,
    "x"
   ],
   [
    15,
    18,
    31,
    35,
    8,
    "z"
   ]
  ],
  "wallCycle": 2,
  "coreCap": 19,
  "outerWallBands": [
   13,
   8,
   8
  ],
  "bridgePaths": [
   [
    19,
    21,
    33,
    35
   ],
   [
    19,
    25,
    5,
    7
   ]
  ]
 },
 {
  "biome": "enchanted-forest",
  "size": "small",
  "w": 38,
  "d": 49,
  "steps": 15,
  "aisle": 13,
  "mask": [
   [
    3,
    22,
    0,
    48
   ],
   [
    0,
    10,
    24,
    35
   ],
   [
    0,
    8,
    2,
    10
   ],
   [
    35,
    37,
    6,
    24
   ],
   [
    29,
    35,
    35,
    41
   ],
   [
    20,
    28,
    17,
    21
   ],
   [
    20,
    30,
    35,
    39
   ],
   [
    22,
    35,
    15,
    17
   ],
   [
    22,
    29,
    38,
    40
   ]
  ],
  "cuts": [
   [
    20,
    22,
    23,
    30
   ],
   [
    3,
    6,
    30,
    35
   ],
   [
    21,
    22,
    32,
    35
   ]
  ],
  "roofType": "saw",
  "northHeight": 8,
  "southHeight": 10,
  "title": "Mothfen crescent moonwatch with slanted root loft and split glade",
  "canopy": [
   7,
   13,
   6,
   13
  ],
  "cargo": [
   8,
   19
  ],
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079",
  "symbol": "biome130:096",
  "roofRibs": [
   [
    0,
    10,
    24,
    35,
    "z",
    4
   ],
   [
    35,
    37,
    6,
    24,
    "x",
    3
   ]
  ],
  "lofts": [
   [
    16,
    19,
    9,
    15,
    5,
    "x"
   ],
   [
    16,
    19,
    31,
    35,
    9,
    "z"
   ]
  ],
  "wallCycle": 4,
  "coreCap": 22,
  "outerWallBands": [
   14,
   6,
   11
  ],
  "bridgePaths": [
   [
    22,
    35,
    15,
    17
   ],
   [
    22,
    29,
    38,
    40
   ]
  ]
 },
 {
  "biome": "mountain",
  "size": "small",
  "w": 40,
  "d": 49,
  "steps": 15,
  "aisle": 13,
  "mask": [
   [
    3,
    19,
    0,
    48
   ],
   [
    2,
    10,
    20,
    33
   ],
   [
    0,
    7,
    2,
    9
   ],
   [
    24,
    34,
    11,
    26
   ],
   [
    27,
    36,
    30,
    37
   ],
   [
    20,
    29,
    12,
    15
   ],
   [
    20,
    30,
    36,
    40
   ],
   [
    19,
    24,
    18,
    20
   ],
   [
    19,
    27,
    33,
    35
   ]
  ],
  "cuts": [
   [
    17,
    19,
    21,
    29
   ],
   [
    3,
    6,
    30,
    35
   ],
   [
    18,
    19,
    31,
    34
   ]
  ],
  "roofType": "slope",
  "northHeight": 5,
  "southHeight": 7,
  "title": "Stonevein folded cliff beacon with a diagonally staggered ore balcony",
  "canopy": [
   7,
   13,
   6,
   13
  ],
  "cargo": [
   8,
   19
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "biome130:098",
  "roofRibs": [
   [
    2,
    10,
    20,
    33,
    "x",
    3
   ],
   [
    24,
    34,
    11,
    26,
    "z",
    4
   ]
  ],
  "lofts": [
   [
    16,
    19,
    9,
    15,
    6,
    "x"
   ],
   [
    16,
    19,
    31,
    35,
    6,
    "z"
   ]
  ],
  "wallCycle": 3,
  "coreCap": 19,
  "outerWallBands": [
   14,
   7,
   10
  ],
  "bridgePaths": [
   [
    19,
    24,
    18,
    20
   ],
   [
    19,
    27,
    33,
    35
   ]
  ]
 },
 {
  "biome": "temperate",
  "size": "medium",
  "w": 51,
  "d": 59,
  "steps": 18,
  "aisle": 15,
  "mask": [
   [
    3,
    23,
    0,
    58
   ],
   [
    0,
    13,
    3,
    20
   ],
   [
    0,
    10,
    40,
    55
   ],
   [
    32,
    48,
    10,
    23
   ],
   [
    28,
    42,
    42,
    57
   ],
   [
    23,
    34,
    19,
    23
   ],
   [
    24,
    36,
    43,
    47
   ],
   [
    23,
    32,
    16,
    18
   ],
   [
    23,
    28,
    49,
    51
   ]
  ],
  "cuts": [
   [
    21,
    23,
    29,
    38
   ],
   [
    3,
    6,
    40,
    45
   ],
   [
    22,
    23,
    40,
    43
   ]
  ],
  "roofType": "cross",
  "northHeight": 6,
  "southHeight": 8,
  "title": "Greenmeadow forked marsh sentry with lowered central parapet and sunset deck",
  "canopy": [
   7,
   15,
   6,
   13
  ],
  "cargo": [
   8,
   18
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079",
  "symbol": "",
  "roofRibs": [
   [
    0,
    13,
    3,
    20,
    "z",
    4
   ],
   [
    32,
    48,
    10,
    23,
    "x",
    5
   ]
  ],
  "lofts": [
   [
    18,
    21,
    9,
    15,
    7,
    "x"
   ],
   [
    18,
    21,
    41,
    45,
    7,
    "z"
   ]
  ],
  "wallCycle": 3,
  "coreCap": 23,
  "outerWallBands": [
   17,
   8,
   12
  ],
  "bridgePaths": [
   [
    23,
    32,
    16,
    18
   ],
   [
    23,
    28,
    49,
    51
   ]
  ]
 },
 {
  "biome": "desert",
  "size": "medium",
  "w": 48,
  "d": 58,
  "steps": 18,
  "aisle": 16,
  "mask": [
   [
    3,
    23,
    0,
    57
   ],
   [
    0,
    12,
    23,
    48
   ],
   [
    0,
    8,
    2,
    6
   ],
   [
    25,
    33,
    9,
    28
   ],
   [
    33,
    38,
    27,
    41
   ],
   [
    24,
    35,
    10,
    15
   ],
   [
    24,
    38,
    39,
    42
   ],
   [
    23,
    25,
    18,
    20
   ],
   [
    23,
    33,
    34,
    36
   ]
  ],
  "cuts": [
   [
    21,
    23,
    24,
    31
   ],
   [
    3,
    6,
    39,
    44
   ],
   [
    22,
    23,
    33,
    36
   ]
  ],
  "roofType": "terrace",
  "northHeight": 7,
  "southHeight": 9,
  "title": "Red-sand broken arc observatory with divergent roof massing",
  "canopy": [
   7,
   16,
   6,
   13
  ],
  "cargo": [
   8,
   18
  ],
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "",
  "roofRibs": [
   [
    0,
    12,
    23,
    48,
    "x",
    3
   ],
   [
    25,
    33,
    9,
    28,
    "z",
    3
   ]
  ],
  "lofts": [
   [
    19,
    22,
    9,
    15,
    5,
    "x"
   ],
   [
    19,
    22,
    40,
    44,
    8,
    "z"
   ]
  ],
  "wallCycle": 1,
  "coreCap": 23,
  "outerWallBands": [
   17,
   6,
   14
  ],
  "bridgePaths": [
   [
    23,
    25,
    18,
    20
   ],
   [
    23,
    33,
    34,
    36
   ]
  ]
 },
 {
  "biome": "snow",
  "size": "medium",
  "w": 51,
  "d": 63,
  "steps": 19,
  "aisle": 16,
  "mask": [
   [
    3,
    26,
    0,
    62
   ],
   [
    0,
    14,
    12,
    20
   ],
   [
    0,
    8,
    52,
    57
   ],
   [
    38,
    48,
    21,
    51
   ],
   [
    33,
    47,
    6,
    19
   ],
   [
    24,
    36,
    12,
    15
   ],
   [
    24,
    37,
    43,
    48
   ],
   [
    26,
    38,
    36,
    38
   ],
   [
    26,
    33,
    12,
    14
   ]
  ],
  "cuts": [
   [
    24,
    26,
    29,
    37
   ],
   [
    3,
    6,
    44,
    49
   ],
   [
    25,
    26,
    39,
    42
   ]
  ],
  "roofType": "gable",
  "northHeight": 8,
  "southHeight": 10,
  "title": "Whitehorn avalanche observatory with stepped twin stone arches",
  "canopy": [
   7,
   16,
   6,
   13
  ],
  "cargo": [
   8,
   19
  ],
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081",
  "symbol": "biome130:094",
  "roofRibs": [
   [
    0,
    14,
    12,
    20,
    "z",
    4
   ],
   [
    38,
    48,
    21,
    51,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    19,
    22,
    9,
    15,
    6,
    "x"
   ],
   [
    19,
    22,
    45,
    49,
    9,
    "z"
   ]
  ],
  "wallCycle": 3,
  "coreCap": 26,
  "outerWallBands": [
   18,
   7,
   14
  ],
  "bridgePaths": [
   [
    26,
    38,
    36,
    38
   ],
   [
    26,
    33,
    12,
    14
   ]
  ]
 },
 {
  "biome": "enchanted-forest",
  "size": "medium",
  "w": 54,
  "d": 59,
  "steps": 19,
  "aisle": 17,
  "mask": [
   [
    3,
    23,
    0,
    58
   ],
   [
    0,
    14,
    20,
    49
   ],
   [
    3,
    9,
    8,
    10
   ],
   [
    32,
    44,
    12,
    40
   ],
   [
    29,
    49,
    36,
    48
   ],
   [
    25,
    38,
    16,
    20
   ],
   [
    25,
    40,
    44,
    54
   ],
   [
    23,
    32,
    26,
    28
   ],
   [
    23,
    29,
    42,
    44
   ],
   [
    23,
    25,
    18,
    20
   ],
   [
    23,
    25,
    49,
    51
   ]
  ],
  "cuts": [
   [
    21,
    23,
    28,
    37
   ],
   [
    3,
    6,
    40,
    45
   ],
   [
    22,
    23,
    39,
    42
   ]
  ],
  "roofType": "saw",
  "northHeight": 5,
  "southHeight": 7,
  "title": "Nightbloom branching moonwatch with asymmetric lantern colonnades",
  "canopy": [
   7,
   17,
   6,
   13
  ],
  "cargo": [
   8,
   19
  ],
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079",
  "symbol": "biome130:096",
  "roofRibs": [
   [
    0,
    14,
    20,
    49,
    "x",
    3
   ],
   [
    32,
    44,
    12,
    40,
    "z",
    5
   ]
  ],
  "lofts": [
   [
    20,
    23,
    9,
    15,
    7,
    "x"
   ],
   [
    20,
    23,
    41,
    45,
    6,
    "z"
   ]
  ],
  "wallCycle": 4,
  "coreCap": 23,
  "outerWallBands": [
   18,
   8,
   13
  ],
  "bridgePaths": [
   [
    23,
    32,
    26,
    28
   ],
   [
    23,
    29,
    42,
    44
   ],
   [
    23,
    25,
    18,
    20
   ],
   [
    23,
    25,
    49,
    51
   ]
  ]
 },
 {
  "biome": "mountain",
  "size": "medium",
  "w": 53,
  "d": 64,
  "steps": 20,
  "aisle": 17,
  "mask": [
   [
    3,
    26,
    0,
    63
   ],
   [
    0,
    15,
    41,
    53
   ],
   [
    0,
    10,
    5,
    14
   ],
   [
    45,
    52,
    1,
    14
   ],
   [
    39,
    45,
    54,
    62
   ],
   [
    25,
    40,
    14,
    19
   ],
   [
    25,
    42,
    49,
    54
   ],
   [
    26,
    45,
    7,
    9
   ],
   [
    26,
    39,
    58,
    60
   ]
  ],
  "cuts": [
   [
    24,
    26,
    26,
    33
   ],
   [
    3,
    6,
    45,
    50
   ],
   [
    25,
    26,
    35,
    38
   ]
  ],
  "roofType": "slope",
  "northHeight": 6,
  "southHeight": 8,
  "title": "Riftwall folded alpine stronghold with low north battery and raised southern mast",
  "canopy": [
   7,
   17,
   6,
   13
  ],
  "cargo": [
   8,
   16
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "biome130:098",
  "roofRibs": [
   [
    0,
    15,
    41,
    53,
    "z",
    4
   ],
   [
    45,
    52,
    1,
    14,
    "x",
    3
   ]
  ],
  "lofts": [
   [
    20,
    23,
    9,
    15,
    5,
    "x"
   ],
   [
    20,
    23,
    46,
    50,
    7,
    "z"
   ]
  ],
  "wallCycle": 2,
  "coreCap": 26,
  "outerWallBands": [
   19,
   6,
   16
  ],
  "bridgePaths": [
   [
    26,
    45,
    7,
    9
   ],
   [
    26,
    39,
    58,
    60
   ]
  ]
 },
 {
  "biome": "temperate",
  "size": "large",
  "w": 66,
  "d": 78,
  "steps": 24,
  "aisle": 20,
  "mask": [
   [
    3,
    29,
    0,
    77
   ],
   [
    0,
    17,
    9,
    18
   ],
   [
    6,
    14,
    53,
    72
   ],
   [
    35,
    56,
    18,
    37
   ],
   [
    39,
    62,
    40,
    60
   ],
   [
    29,
    46,
    18,
    23
   ],
   [
    29,
    47,
    58,
    61
   ],
   [
    29,
    35,
    27,
    29
   ],
   [
    29,
    39,
    50,
    52
   ]
  ],
  "cuts": [
   [
    27,
    29,
    37,
    45
   ],
   [
    3,
    6,
    59,
    64
   ],
   [
    28,
    29,
    47,
    50
   ]
  ],
  "roofType": "gable",
  "northHeight": 7,
  "southHeight": 9,
  "title": "Willowfork divided signal fortress with broken main wall and tall south donjon",
  "canopy": [
   7,
   20,
   6,
   13
  ],
  "cargo": [
   8,
   16
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079",
  "symbol": "",
  "roofRibs": [
   [
    0,
    17,
    9,
    18,
    "x",
    3
   ],
   [
    35,
    56,
    18,
    37,
    "z",
    4
   ]
  ],
  "lofts": [
   [
    23,
    26,
    9,
    15,
    6,
    "x"
   ],
   [
    23,
    26,
    60,
    64,
    8,
    "z"
   ]
  ],
  "wallCycle": 4,
  "coreCap": 29,
  "outerWallBands": [
   23,
   7,
   19
  ],
  "bridgePaths": [
   [
    29,
    35,
    27,
    29
   ],
   [
    29,
    39,
    50,
    52
   ]
  ]
 },
 {
  "biome": "desert",
  "size": "large",
  "w": 69,
  "d": 77,
  "steps": 24,
  "aisle": 21,
  "mask": [
   [
    3,
    27,
    0,
    76
   ],
   [
    2,
    17,
    31,
    58
   ],
   [
    0,
    10,
    2,
    14
   ],
   [
    42,
    68,
    1,
    18
   ],
   [
    43,
    51,
    43,
    74
   ],
   [
    30,
    42,
    18,
    31
   ],
   [
    30,
    51,
    54,
    60
   ],
   [
    27,
    42,
    9,
    11
   ],
   [
    27,
    43,
    58,
    60
   ],
   [
    27,
    30,
    24,
    26
   ],
   [
    27,
    30,
    57,
    59
   ]
  ],
  "cuts": [
   [
    25,
    27,
    34,
    43
   ],
   [
    3,
    6,
    58,
    63
   ],
   [
    26,
    27,
    45,
    48
   ]
  ],
  "roofType": "terrace",
  "northHeight": 8,
  "southHeight": 10,
  "title": "Goldrift dune crescent keep with two offset observation ramparts",
  "canopy": [
   7,
   21,
   6,
   13
  ],
  "cargo": [
   8,
   16
  ],
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "",
  "roofRibs": [
   [
    2,
    17,
    31,
    58,
    "z",
    4
   ],
   [
    42,
    68,
    1,
    18,
    "x",
    5
   ]
  ],
  "lofts": [
   [
    24,
    27,
    9,
    15,
    7,
    "x"
   ],
   [
    24,
    27,
    59,
    63,
    9,
    "z"
   ]
  ],
  "wallCycle": 2,
  "coreCap": 27,
  "outerWallBands": [
   23,
   8,
   18
  ],
  "bridgePaths": [
   [
    27,
    42,
    9,
    11
   ],
   [
    27,
    43,
    58,
    60
   ],
   [
    27,
    30,
    24,
    26
   ],
   [
    27,
    30,
    57,
    59
   ]
  ]
 },
 {
  "biome": "snow",
  "size": "large",
  "w": 68,
  "d": 78,
  "steps": 25,
  "aisle": 21,
  "mask": [
   [
    3,
    31,
    0,
    77
   ],
   [
    0,
    18,
    2,
    35
   ],
   [
    0,
    14,
    53,
    74
   ],
   [
    33,
    59,
    32,
    61
   ],
   [
    50,
    65,
    1,
    19
   ],
   [
    31,
    50,
    12,
    17
   ],
   [
    31,
    47,
    57,
    61
   ],
   [
    31,
    33,
    46,
    48
   ],
   [
    31,
    50,
    10,
    12
   ]
  ],
  "cuts": [
   [
    29,
    31,
    38,
    45
   ],
   [
    3,
    6,
    59,
    64
   ],
   [
    30,
    31,
    47,
    50
   ]
  ],
  "roofType": "cross",
  "northHeight": 5,
  "southHeight": 7,
  "title": "Snowmantle irregular double-ridge citadel with open wind-sheltered courtyard",
  "canopy": [
   7,
   21,
   6,
   13
  ],
  "cargo": [
   8,
   17
  ],
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081",
  "symbol": "biome130:094",
  "roofRibs": [
   [
    0,
    18,
    2,
    35,
    "x",
    3
   ],
   [
    33,
    59,
    32,
    61,
    "z",
    3
   ]
  ],
  "lofts": [
   [
    24,
    27,
    9,
    15,
    5,
    "x"
   ],
   [
    24,
    27,
    60,
    64,
    6,
    "z"
   ]
  ],
  "wallCycle": 3,
  "coreCap": 31,
  "outerWallBands": [
   24,
   6,
   21
  ],
  "bridgePaths": [
   [
    31,
    33,
    46,
    48
   ],
   [
    31,
    50,
    10,
    12
   ]
  ]
 },
 {
  "biome": "enchanted-forest",
  "size": "large",
  "w": 71,
  "d": 79,
  "steps": 25,
  "aisle": 22,
  "mask": [
   [
    3,
    29,
    0,
    78
   ],
   [
    6,
    17,
    29,
    64
   ],
   [
    0,
    12,
    2,
    23
   ],
   [
    56,
    70,
    8,
    33
   ],
   [
    47,
    67,
    62,
    77
   ],
   [
    32,
    53,
    19,
    24
   ],
   [
    32,
    54,
    66,
    68
   ],
   [
    29,
    56,
    20,
    22
   ],
   [
    29,
    47,
    69,
    71
   ],
   [
    29,
    32,
    21,
    23
   ],
   [
    29,
    32,
    67,
    69
   ]
  ],
  "cuts": [
   [
    27,
    29,
    32,
    40
   ],
   [
    3,
    6,
    60,
    65
   ],
   [
    28,
    29,
    42,
    45
   ]
  ],
  "roofType": "saw",
  "northHeight": 6,
  "southHeight": 8,
  "title": "Fungalhollow canopy fortress with bifurcated arch spines and lantern roofs",
  "canopy": [
   7,
   22,
   6,
   13
  ],
  "cargo": [
   8,
   17
  ],
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079",
  "symbol": "biome130:096",
  "roofRibs": [
   [
    6,
    17,
    29,
    64,
    "z",
    4
   ],
   [
    56,
    70,
    8,
    33,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    25,
    28,
    9,
    15,
    6,
    "x"
   ],
   [
    25,
    28,
    61,
    65,
    7,
    "z"
   ]
  ],
  "wallCycle": 4,
  "coreCap": 29,
  "outerWallBands": [
   24,
   7,
   20
  ],
  "bridgePaths": [
   [
    29,
    56,
    20,
    22
   ],
   [
    29,
    47,
    69,
    71
   ],
   [
    29,
    32,
    21,
    23
   ],
   [
    29,
    32,
    67,
    69
   ]
  ]
 },
 {
  "biome": "mountain",
  "size": "large",
  "w": 73,
  "d": 82,
  "steps": 26,
  "aisle": 22,
  "mask": [
   [
    3,
    30,
    0,
    81
   ],
   [
    0,
    19,
    23,
    58
   ],
   [
    6,
    12,
    2,
    14
   ],
   [
    47,
    64,
    11,
    37
   ],
   [
    48,
    68,
    40,
    67
   ],
   [
    32,
    55,
    21,
    27
   ],
   [
    32,
    57,
    63,
    70
   ],
   [
    30,
    47,
    24,
    26
   ],
   [
    30,
    48,
    53,
    55
   ],
   [
    30,
    32,
    24,
    26
   ],
   [
    30,
    32,
    66,
    68
   ]
  ],
  "cuts": [
   [
    28,
    30,
    38,
    47
   ],
   [
    3,
    6,
    63,
    68
   ],
   [
    29,
    30,
    49,
    52
   ]
  ],
  "roofType": "slope",
  "northHeight": 7,
  "southHeight": 9,
  "title": "Cloudspire stair-stepped crag command with an open central cleft",
  "canopy": [
   7,
   22,
   6,
   13
  ],
  "cargo": [
   8,
   18
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "biome130:098",
  "roofRibs": [
   [
    0,
    19,
    23,
    58,
    "x",
    3
   ],
   [
    47,
    64,
    11,
    37,
    "z",
    5
   ]
  ],
  "lofts": [
   [
    25,
    28,
    9,
    15,
    7,
    "x"
   ],
   [
    25,
    28,
    64,
    68,
    8,
    "z"
   ]
  ],
  "wallCycle": 3,
  "coreCap": 30,
  "outerWallBands": [
   25,
   8,
   20
  ],
  "bridgePaths": [
   [
    30,
    47,
    24,
    26
   ],
   [
    30,
    48,
    53,
    55
   ],
   [
    30,
    32,
    24,
    26
   ],
   [
    30,
    32,
    66,
    68
   ]
  ]
 }
];

function create(p){
 const {w,d,steps,aisle}=p,sx=4,sz=5,deckY=steps,lastZ=sz+steps-1;
 const id=assertSlot('watchtower',p.biome,p.size,5);
 const mask=new Set();
 for(const [x0,x1,z0,z1] of p.mask)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)mask.add(flat(x,z));
 // Prove every literal structural keep cut actually excises ground, wall and roof source occupancy.
 // Fail closed on inverted/out-of-envelope cuts or decorative-only no-op removals.
 let removedKeepCells=0;
 for(const [a,b,c,e] of p.cuts){
  if(![a,b,c,e].every(Number.isSafeInteger)||a<0||c<0||a>b||c>e||b>=w||e>=d)
   throw Error(id+' invalid authored keep-cut rectangle '+[a,b,c,e]);
  let removed=0;
  for(let x=a;x<=b;x++)for(let z=c;z<=e;z++)if(mask.delete(flat(x,z)))removed++;
  if(removed<3)throw Error(id+' visually claimed but structurally empty keep cut '+[a,b,c,e]);
  removedKeepCells+=removed;
 }

 const core=p.mask[0],isCore=(x,z)=>mask.has(flat(x,z))&&x>=core[0]&&x<=core[1]&&z>=core[2]&&z<=core[3];
 const halls=[
  B(aisle,2,0,2,3,d),B(sx,2,4,aisle-sx+2,3,1),
  ...Array.from({length:steps},(_,i)=>B(sx,2+i,sz+i,2,2,1)),
  B(sx+2,deckY+1,lastZ,aisle-sx,2,2),
  B(aisle,deckY+1,3,2,2,lastZ-1)
 ];
 const reserved=(x,y,z)=>halls.some(b=>x>=b.x&&x<b.x+b.width&&y>=b.y&&y<b.y+b.height&&z>=b.z&&z<b.z+b.depth);
 const blocks=new Map(),mods=new Map();
 function write(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=steps+21||z<0||z>=d)
   throw Error(id+' local voxel outside envelope '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' missing source family '+ref);
  if(!mask.has(flat(x,z)))return false;
  if(role!=='foundation'&&role!=='floor'&&reserved(x,y,z))return false;
  const k=key(x,y,z);if(blocks.has(k))return false;
  blocks.set(k,role);if(!mods.has(role))mods.set(role,[]);
  mods.get(role).push([x,y,z,ref]);return true;
 }
 const stair=(x,z)=>x>=sx&&x<sx+2&&z>=sz&&z<=lastZ;
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  write('foundation',x,0,z,'builtin:stone');
  if(!stair(x,z))write('floor',x,1,z,p.floor);
 }
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  const boundary=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,b])=>!mask.has(flat(a,b)));
  if(boundary){
   // A vertically tiered, deliberately discontinuous central keep wall, not a long flat bar.
   const band=z<p.d/3?0:z<2*p.d/3?1:2;
   const maxY=isCore(x,z)?Math.min(deckY-1,p.outerWallBands[band]):6;
   for(let y=2;y<=maxY;y++)write('wall',x,y,z,p.wall);
   // Real source-connected seam piers support the high observation walkway where side walls recess.
   if(isCore(x,z)&&(z+p.wallCycle)%7===0)
    for(let y=maxY+1;y<deckY;y++)write('wall-seam-bearing',x,y,z,p.post);
  }
 }
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  if(isCore(x,z)){if(!stair(x,z))write('roof',x,deckY,z,p.floor);}
  else write('roof',x,7,z,p.roof);
 }
 for(let i=0;i<steps;i++)for(let x=sx;x<sx+2;x++){
  const z=sz+i;
  for(let y=1;y<=i;y++)write('stair-support',x,y,z,p.post);
  write('stair',x,1+i,z,'pack1:008');
 }
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  if(!isCore(x,z))continue;
  const edge=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,b])=>!isCore(a,b));
  if(edge&&(x+z+steps)%4!==0)write('battlement',x,deckY+1,z,'pack3:070');
 }
 const [cx0,cx1,cz0,cz1]=p.canopy,top=(x,z)=>{
  if(p.roofType==='gable')return deckY+6+Math.floor(Math.min(x-cx0,cx1-x)/3);
  if(p.roofType==='cross')return deckY+6+Math.floor(Math.min(z-cz0,cz1-z)/3);
  if(p.roofType==='terrace')return deckY+6+(x<=(cx0+cx1)/2?2:0);
  if(p.roofType==='saw')return deckY+6+(Math.floor((x-cx0)/3)%2);
  return deckY+6+Math.floor((x-cx0)/4);
 };
 for(const [x,z] of [[cx0,cz0],[cx1,cz0],[cx0,cz1],[cx1,cz1]]){
  if(!isCore(x,z)||stair(x,z))throw Error(id+' unsupported canopy bearer');
  for(let y=deckY+1;y<top(x,z);y++)write('canopy-bearing',x,y,z,p.post);
 }
 for(let x=cx0;x<=cx1;x++)for(let z=cz0;z<=cz1;z++)write('canopy-roof',x,top(x,z),z,p.roof);
 for(let x=cx0+1;x<=cx1;x++)for(let z=cz0;z<=cz1;z++){
  const prev=top(x-1,z),next=top(x,z);
  for(let y=Math.min(prev,next);y<Math.max(prev,next);y++)write('canopy-x-brace',prev<next?x:x-1,y,z,p.post);
 }
 for(let z=cz0+1;z<=cz1;z++)for(let x=cx0;x<=cx1;x++){
  const prev=top(x,z-1),next=top(x,z);
  for(let y=Math.min(prev,next);y<Math.max(prev,next);y++)write('canopy-z-brace',x,y,prev<next?z:z-1,p.post);
 }
 // Explicit source-cell-supported pitched annex rooflines, unlike identical flat box roofs.
 // These extra authored roof ridges sit on existing y=7 bearing roofs, are not cosmetic SVG assets.
 for(const [x0,x1,z0,z1,axis,rise] of p.roofRibs){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(isCore(x,z)||!mask.has(flat(x,z)))continue;
   const inset=axis==='x'?Math.min(x-x0,x1-x):Math.min(z-z0,z1-z);
   const height=8+Math.min(rise,Math.floor(inset/3));
   for(let y=8;y<=height;y++)write('bearing-pitched-annex',x,y,z,p.roof);
  }
 }
 // Grounded tiered east-upper keep source masses, no gallery obstruction or floating roofs.
 for(const [x0,x1,z0,z1,rise,axis] of p.lofts){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!isCore(x,z)||x<aisle+3)continue;
   const slope=axis==='x'?Math.floor((x-x0)/2):Math.floor((z-z0)/2);
   const upper=deckY+4+Math.min(rise,slope+Math.abs(Math.floor((z-z0)/3)%3));
   for(let y=deckY+1;y<upper;y++)write('stepped-upper-keep-bearing',x,y,z,p.wall);
   write('stepped-upper-keep-roof',x,upper,z,p.roof);
  }
 }
 // Physically supported visible elevated links. Previous v5 annexes were connected
 // at ground level yet appeared as detached islands in true Chromium exterior shots.
 // Enforce source-real continuous 3-cell roof/deck and regularly borne support piers.
 for(const [x0,x1,z0,z1] of p.bridgePaths){
  if(z1-z0<2||x1<x0+2)throw Error(id+' source bridge corridor has insufficient occupied span');
  let delivered=0;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!mask.has(flat(x,z)))throw Error(id+' skybridge hangs outside source footprint '+[x,z]);
   if((x===x0||x===x1||(x-x0)%4===0)&&z===z0+1)
    for(let y=1;y<=7;y++)write('skybridge-load-bearing-pier',x,y,z,p.post);
   if(write('skybridge-elevated-deck',x,8,z,p.floor))delivered++;
   if((z===z0||z===z1)&&(x-x0)%3===0)
    write('skybridge-source-parapet',x,9,z,p.trim);
  }
  if(delivered<6)throw Error(id+' empty elevated skybridge despite named remote wing');
 }
 // New M3 construction: two source-real, load-path-bearing staggered signal turrets.
 // The turret crowns are independent of the observation deck path and do not obstruct it.
 const towers=[{name:'upwind',z0:2,z1:8,rise:p.northHeight},{name:'downwind',z0:d-12,z1:d-6,rise:p.southHeight}];
 for(const t of towers){
  const tx0=aisle+3,tx1=aisle+6,midZ=Math.floor((t.z0+t.z1)/2);
  for(let x=tx0;x<=tx1;x++)for(let z=t.z0;z<=t.z1;z++){
   if(!isCore(x,z))throw Error(id+' turret outside actual high-keep foundation');
   const edge=x===tx0||x===tx1||z===t.z0||z===t.z1;
   const corner=(x===tx0||x===tx1)&&(z===t.z0||z===t.z1);
   // Real four load-bearing continuous columns from y=1 foundation to rooftop.
   if(corner)for(let y=1;y<=deckY;y++)write('turret-ground-bearing',x,y,z,p.post);
   if(edge)for(let y=deckY+1;y<=deckY+t.rise;y++)write('turret-high-wall',x,y,z,p.wall);
   const centerFold=Math.min(x-tx0,tx1-x,z-t.z0,t.z1-z);
   const taper=p.roofType==='terrace'?Math.min(2,Math.floor((z-t.z0)/3))
    :p.roofType==='saw'?(x+z+t.rise)%2
    :p.roofType==='cross'?Math.min(2,Math.floor(centerFold))
    :p.roofType==='gable'?Math.min(2,Math.floor(Math.min(x-tx0,tx1-x)))
    :Math.min(2,Math.floor((x-tx0)/2));
   for(let y=deckY+t.rise+1;y<=deckY+t.rise+1+taper;y++)
    write('turret-tiered-cap',x,y,z,p.roof);
   if(edge&&(x+z)%3===0)write('turret-crest',x,deckY+t.rise+2+taper,z,p.post);
  }
  // The signal finial is structurally attached to actual source roof cells.
  const spireX=aisle+4,spireY=deckY+t.rise+2;
  for(let y=spireY;y<spireY+Math.min(3,Math.max(2,Math.ceil(t.rise/2)));y++)
   write('turret-signal-finial',spireX,y,midZ,p.post);
 }
 for(let y=2;y<=4;y++){
  write('cargo',p.cargo[0],y,p.cargo[1],'pack4:057');
  write('regional-inset',p.cargo[0]+1,y,p.cargo[1],p.trim);
 }
 const nodes=[N('entry',aisle,2,d-1,'entry'),N('base',aisle,2,4)];
 const edges=[E('entry','base')];
 for(let i=0;i<steps;i++){
  nodes.push(N('step-'+i,sx,2+i,sz+i,'stairs'));
  edges.push(E(i===0?'base':'step-'+(i-1),'step-'+i,i===0?'level':'stair'));
 }
 nodes.push(N('landing',sx+2,deckY+1,lastZ,'observation'));
 nodes.push(N('lookout',aisle,deckY+1,3,'observation'));
 edges.push(E('step-'+(steps-1),'landing'));edges.push(E('landing','lookout'));
 const bp={
  id,type:'watchtower',biome:p.biome,size:p.size,variant:5,status:'theoretical',activated:false,
  envelope:B(0,0,0,w,steps+21,d),
  modules:[...mods].map(([role,cells])=>({id:role+'-01',role,cells})),
  clearances:halls,openings:[{id:'guard-door',facing:'south',x:aisle,y:2,z:d-1,width:2,height:3}],
  spaces:[
   {id:'ground-guard',kind:'guard-access',bounds:B(aisle-1,2,1,4,4,d-2),accessNode:'base'},
   {id:'stair-chamber',kind:'upper-circulation',bounds:B(sx,2,4,aisle-sx+2,steps+1,lastZ-2),accessNode:'step-0'},
   {id:'upper-terrace',kind:'observation',bounds:B(sx+2,deckY+1,2,aisle-sx+3,2,lastZ),accessNode:'lookout'}
  ],
  navigation:{entry:'entry',nodes,edges},
  features:[
   {name:'two-wide physical stair',position:[sx,2,sz],assetRef:'pack1:008',unresolvedDependency:null},
   {name:'source-real upper-bearing',position:[cx0,deckY+1,cz0],assetRef:p.post,unresolvedDependency:null},
   {name:'real cargo source',position:[p.cargo[0],2,p.cargo[1]],assetRef:'pack4:057',unresolvedDependency:null},
   {name:'unbuilt smoke warning',position:[aisle,deckY+1,3],assetRef:null,unresolvedDependency:'Signal and fire not implemented'}
  ],
  architecture:{kind:p.title,sourceIrregularMaskedFoundation:true,structurallyTieredCentralWalls:true,centralKeepSpineCap:p.coreCap,sourceSkybridgeCount:p.bridgePaths.length,centralWallBands:[...p.outerWallBands],actualKeepVoids:p.cuts.length,realRemovedKeepCells:removedKeepCells,authoredCutVolumes:p.cuts.map(c=>[...c]),independentSteppedLofts:p.lofts.length,footprintCells:mask.size,stairSteps:steps,
   observationAccess:true,observationY:deckY+1,roofProfile:p.roofType,
   realRoofBearingColumns:4,occupiedCoordinates:blocks.size,worldPlaced:false,creatorApproved:false,
   perCellVariantResolved:false,perCellYawResolved:false},
  dependencies:[p.wall,p.floor,p.roof,p.post,p.trim,'pack1:008','pack3:070','pack4:057',p.symbol,
   'Physical stair collider, per-cell numeric variants and yaw, multi-cell reservation unresolved'],
  implementation:'THEORETICAL_3B_WATCHTOWER_VARIANT5_ONLY: no gameplay placement, saves or runtime changes'
 };
 validateBlueprint(bp,ASSET_CATALOG);return bp;
}
const byBiomeSize=new Map(plans.map(p=>[p.biome+':'+p.size,p]));
export function createWatchtowerVariant5FinalBlueprint(type,biome,size,variant=5){
 if(type!=='watchtower'||!['small','medium','large'].includes(size)||variant!==5)
  throw new RangeError('Only specifically authored fifth-variation watchtower source plans belong to this batch');
 const p=byBiomeSize.get(biome+':'+size);if(!p)throw new RangeError('Unwritten fifth-variation tower slot');
 return create(p);
}
export function createWatchtowerVariant5FinalPool(){return plans.map(create);}
