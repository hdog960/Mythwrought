// Builder 3B independent watchtower variant 2 — fifteen independent notched upper-keep variant-4 source architects.
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
  "w": 32,
  "d": 43,
  "steps": 14,
  "aisle": 12,
  "mask": [
   [
    3,
    20,
    0,
    42
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
    16,
    26
   ],
   [
    26,
    31,
    2,
    10
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
   ]
  ],
  "cuts": [
   [
    18,
    20,
    19,
    21
   ],
   [
    3,
    5,
    31,
    36
   ]
  ],
  "roofType": "gable",
  "northHeight": 7,
  "southHeight": 3,
  "title": "River-oxbow split-level beacon and cut west lookout",
  "canopy": [
   7,
   12,
   6,
   13
  ],
  "cargo": [
   8,
   22
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
    31,
    16,
    26,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    15,
    19,
    21,
    26,
    6,
    "x"
   ],
   [
    15,
    20,
    24,
    28,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "desert",
  "size": "small",
  "w": 35,
  "d": 41,
  "steps": 13,
  "aisle": 12,
  "mask": [
   [
    3,
    21,
    0,
    40
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
    23,
    32,
    2,
    15
   ],
   [
    26,
    34,
    28,
    34
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
   ]
  ],
  "cuts": [
   [
    14,
    21,
    19,
    26
   ],
   [
    3,
    5,
    27,
    33
   ]
  ],
  "roofType": "terrace",
  "northHeight": 4,
  "southHeight": 7,
  "title": "Suncrack keep around northeast split terrace",
  "canopy": [
   7,
   12,
   6,
   13
  ],
  "cargo": [
   8,
   21
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
    9,
    17,
    38,
    "x",
    3
   ],
   [
    23,
    34,
    2,
    15,
    "z",
    4
   ]
  ],
  "lofts": [
   [
    15,
    19,
    20,
    25,
    6,
    "x"
   ],
   [
    15,
    20,
    22,
    26,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "snow",
  "size": "small",
  "w": 34,
  "d": 45,
  "steps": 14,
  "aisle": 12,
  "mask": [
   [
    3,
    21,
    0,
    44
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
    23,
    33,
    20,
    35
   ],
   [
    25,
    33,
    10,
    12
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
   ]
  ],
  "cuts": [
   [
    19,
    21,
    17,
    23
   ],
   [
    3,
    5,
    33,
    39
   ]
  ],
  "roofType": "cross",
  "northHeight": 8,
  "southHeight": 4,
  "title": "Snowglass storm shelter with broken lookout spine",
  "canopy": [
   7,
   12,
   6,
   13
  ],
  "cargo": [
   8,
   22
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
    "z",
    3
   ],
   [
    23,
    33,
    20,
    40,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    15,
    19,
    21,
    26,
    6,
    "x"
   ],
   [
    15,
    20,
    26,
    30,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "enchanted-forest",
  "size": "small",
  "w": 36,
  "d": 44,
  "steps": 15,
  "aisle": 13,
  "mask": [
   [
    3,
    22,
    0,
    43
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
    29,
    35,
    9,
    27
   ],
   [
    29,
    35,
    32,
    38
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
   ]
  ],
  "cuts": [
   [
    20,
    22,
    23,
    29
   ],
   [
    1,
    6,
    26,
    38
   ]
  ],
  "roofType": "saw",
  "northHeight": 5,
  "southHeight": 8,
  "title": "Mycelium fork tower with open middle vault",
  "canopy": [
   7,
   13,
   6,
   13
  ],
  "cargo": [
   8,
   20
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
    22,
    40,
    "x",
    3
   ],
   [
    24,
    35,
    12,
    27,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    16,
    20,
    22,
    27,
    6,
    "x"
   ],
   [
    16,
    21,
    25,
    29,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "mountain",
  "size": "small",
  "w": 37,
  "d": 47,
  "steps": 15,
  "aisle": 13,
  "mask": [
   [
    3,
    22,
    0,
    46
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
    26,
    36,
    3,
    18
   ],
   [
    27,
    36,
    38,
    45
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
   ]
  ],
  "cuts": [
   [
    20,
    22,
    21,
    27
   ],
   [
    3,
    7,
    28,
    40
   ]
  ],
  "roofType": "slope",
  "northHeight": 9,
  "southHeight": 3,
  "title": "Cloudbreak crag sentry with gouged eastern spine",
  "canopy": [
   7,
   13,
   6,
   13
  ],
  "cargo": [
   8,
   20
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
    10,
    12,
    33,
    "x",
    3
   ],
   [
    24,
    36,
    3,
    18,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    16,
    20,
    22,
    27,
    6,
    "x"
   ],
   [
    16,
    21,
    28,
    32,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "temperate",
  "size": "medium",
  "w": 47,
  "d": 56,
  "steps": 18,
  "aisle": 15,
  "mask": [
   [
    3,
    25,
    0,
    55
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
    27,
    43,
    13,
    26
   ],
   [
    28,
    42,
    39,
    54
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
   ]
  ],
  "cuts": [
   [
    19,
    25,
    22,
    38
   ],
   [
    3,
    5,
    39,
    46
   ]
  ],
  "roofType": "cross",
  "northHeight": 6,
  "southHeight": 10,
  "title": "Alderway split highkeep with nested river court",
  "canopy": [
   7,
   15,
   6,
   13
  ],
  "cargo": [
   8,
   20
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
    "x",
    3
   ],
   [
    27,
    46,
    13,
    31,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    18,
    22,
    25,
    30,
    6,
    "x"
   ],
   [
    18,
    23,
    37,
    41,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "desert",
  "size": "medium",
  "w": 46,
  "d": 54,
  "steps": 18,
  "aisle": 16,
  "mask": [
   [
    3,
    26,
    0,
    53
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
    28,
    40,
    1,
    20
   ],
   [
    33,
    38,
    35,
    49
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
   ]
  ],
  "cuts": [
   [
    23,
    26,
    34,
    34
   ],
   [
    3,
    7,
    38,
    45
   ]
  ],
  "roofType": "terrace",
  "northHeight": 10,
  "southHeight": 5,
  "title": "Redmesa open keep with deliberate mid-keep void",
  "canopy": [
   7,
   16,
   6,
   13
  ],
  "cargo": [
   8,
   20
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
    28,
    45,
    1,
    20,
    "z",
    4
   ]
  ],
  "lofts": [
   [
    19,
    23,
    25,
    30,
    6,
    "x"
   ],
   [
    19,
    24,
    35,
    39,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "snow",
  "size": "medium",
  "w": 48,
  "d": 58,
  "steps": 19,
  "aisle": 16,
  "mask": [
   [
    3,
    26,
    0,
    57
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
    34,
    44,
    25,
    55
   ],
   [
    33,
    47,
    2,
    15
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
   ]
  ],
  "cuts": [
   [
    20,
    26,
    30,
    38
   ],
   [
    3,
    5,
    31,
    55
   ]
  ],
  "roofType": "gable",
  "northHeight": 9,
  "southHeight": 8,
  "title": "Glacierfork rescue command with cut upper spine",
  "canopy": [
   7,
   16,
   6,
   13
  ],
  "cargo": [
   8,
   21
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
    2,
    28,
    "z",
    3
   ],
   [
    28,
    47,
    25,
    55,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    19,
    23,
    26,
    31,
    6,
    "x"
   ],
   [
    19,
    24,
    39,
    43,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "enchanted-forest",
  "size": "medium",
  "w": 50,
  "d": 57,
  "steps": 19,
  "aisle": 17,
  "mask": [
   [
    3,
    27,
    0,
    56
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
    37,
    49,
    5,
    33
   ],
   [
    29,
    49,
    43,
    55
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
   ]
  ],
  "cuts": [
   [
    24,
    27,
    30,
    48
   ],
   [
    -5,
    5,
    40,
    52
   ]
  ],
  "roofType": "saw",
  "northHeight": 7,
  "southHeight": 11,
  "title": "Rootshadow cross-limbed moonkeep with jagged upper crowns",
  "canopy": [
   7,
   17,
   6,
   13
  ],
  "cargo": [
   8,
   21
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
    29,
    49,
    10,
    33,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    20,
    24,
    26,
    31,
    6,
    "x"
   ],
   [
    20,
    25,
    38,
    42,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "mountain",
  "size": "medium",
  "w": 51,
  "d": 61,
  "steps": 20,
  "aisle": 17,
  "mask": [
   [
    3,
    27,
    0,
    60
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
    37,
    50,
    2,
    20
   ],
   [
    39,
    45,
    48,
    56
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
   ]
  ],
  "cuts": [
   [
    24,
    27,
    33,
    37
   ],
   [
    3,
    5,
    45,
    53
   ]
  ],
  "roofType": "slope",
  "northHeight": 11,
  "southHeight": 7,
  "title": "Alpencross seam fortress with split tower ridges",
  "canopy": [
   7,
   17,
   6,
   13
  ],
  "cargo": [
   8,
   22
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
    32,
    58,
    "x",
    3
   ],
   [
    29,
    50,
    2,
    23,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    20,
    24,
    27,
    32,
    6,
    "x"
   ],
   [
    20,
    25,
    42,
    46,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "temperate",
  "size": "large",
  "w": 63,
  "d": 74,
  "steps": 24,
  "aisle": 20,
  "mask": [
   [
    3,
    31,
    0,
    73
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
    41,
    62,
    10,
    29
   ],
   [
    39,
    62,
    48,
    68
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
   ]
  ],
  "cuts": [
   [
    28,
    23,
    40,
    49
   ],
   [
    3,
    10,
    46,
    62
   ]
  ],
  "roofType": "gable",
  "northHeight": 9,
  "southHeight": 12,
  "title": "Greenwaters fortress with vaulted east cut",
  "canopy": [
   7,
   20,
   6,
   13
  ],
  "cargo": [
   8,
   20
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
    4,
    29,
    "x",
    3
   ],
   [
    33,
    62,
    10,
    35,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    23,
    27,
    31,
    36,
    6,
    "x"
   ],
   [
    23,
    28,
    55,
    59,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "desert",
  "size": "large",
  "w": 65,
  "d": 72,
  "steps": 24,
  "aisle": 21,
  "mask": [
   [
    3,
    32,
    0,
    71
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
    34,
    64,
    0,
    22
   ],
   [
    43,
    51,
    39,
    70
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
   ]
  ],
  "cuts": [
   [
    29,
    31,
    36,
    48
   ],
   [
    3,
    15,
    46,
    67
   ]
  ],
  "roofType": "terrace",
  "northHeight": 13,
  "southHeight": 7,
  "title": "Sunspoke bastions around negative inner canyon",
  "canopy": [
   7,
   21,
   6,
   13
  ],
  "cargo": [
   8,
   20
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
    17,
    28,
    64,
    "x",
    3
   ],
   [
    34,
    64,
    2,
    28,
    "z",
    4
   ]
  ],
  "lofts": [
   [
    24,
    28,
    31,
    36,
    6,
    "x"
   ],
   [
    24,
    29,
    53,
    57,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "snow",
  "size": "large",
  "w": 66,
  "d": 76,
  "steps": 25,
  "aisle": 21,
  "mask": [
   [
    3,
    33,
    0,
    75
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
    38,
    65,
    27,
    56
   ],
   [
    50,
    65,
    2,
    24
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
   ]
  ],
  "cuts": [
   [
    27,
    33,
    35,
    58
   ],
   [
    3,
    10,
    54,
    66
   ]
  ],
  "roofType": "cross",
  "northHeight": 12,
  "southHeight": 10,
  "title": "Frostburn stepped keep with alpine rescue lofts",
  "canopy": [
   7,
   21,
   6,
   13
  ],
  "cargo": [
   8,
   21
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
    "z",
    3
   ],
   [
    35,
    65,
    27,
    62,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    24,
    28,
    32,
    37,
    6,
    "x"
   ],
   [
    24,
    29,
    57,
    61,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "enchanted-forest",
  "size": "large",
  "w": 68,
  "d": 76,
  "steps": 25,
  "aisle": 22,
  "mask": [
   [
    3,
    34,
    0,
    75
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
    49,
    67,
    16,
    41
   ],
   [
    47,
    67,
    54,
    73
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
   ]
  ],
  "cuts": [
   [
    31,
    34,
    41,
    61
   ],
   [
    3,
    5,
    56,
    65
   ]
  ],
  "roofType": "saw",
  "northHeight": 10,
  "southHeight": 13,
  "title": "Moonleaf broken crown castle with supported roots",
  "canopy": [
   7,
   22,
   6,
   13
  ],
  "cargo": [
   8,
   21
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
    17,
    34,
    73,
    "x",
    3
   ],
   [
    36,
    67,
    10,
    39,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    25,
    29,
    32,
    37,
    6,
    "x"
   ],
   [
    25,
    30,
    57,
    61,
    8,
    "z"
   ]
  ]
 },
 {
  "biome": "mountain",
  "size": "large",
  "w": 69,
  "d": 78,
  "steps": 26,
  "aisle": 22,
  "mask": [
   [
    3,
    34,
    0,
    77
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
    51,
    68,
    2,
    28
   ],
   [
    48,
    68,
    49,
    76
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
   ]
  ],
  "cuts": [
   [
    29,
    34,
    45,
    55
   ],
   [
    3,
    5,
    56,
    71
   ]
  ],
  "roofType": "slope",
  "northHeight": 14,
  "southHeight": 8,
  "title": "Highspine notched mesa fortress with triple tier roof",
  "canopy": [
   7,
   22,
   6,
   13
  ],
  "cargo": [
   8,
   22
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
    67,
    "x",
    3
   ],
   [
    36,
    68,
    2,
    31,
    "x",
    4
   ]
  ],
  "lofts": [
   [
    25,
    29,
    33,
    38,
    6,
    "x"
   ],
   [
    25,
    30,
    59,
    63,
    8,
    "z"
   ]
  ]
 }
];

function create(p){
 const {w,d,steps,aisle}=p,sx=4,sz=5,deckY=steps,lastZ=sz+steps-1;
 const id=assertSlot('watchtower',p.biome,p.size,4);
 const mask=new Set();
 for(const [x0,x1,z0,z1] of p.mask)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)mask.add(flat(x,z));
 // Real structural voids erase source foundation, walls and roof over hand-authored keep recesses.
 for(const [a,b,c,d] of p.cuts)for(let x=a;x<=b;x++)for(let z=c;z<=d;z++)mask.delete(flat(x,z));
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
  if(boundary)for(let y=2;y<=(isCore(x,z)?deckY-1:6);y++)write('wall',x,y,z,p.wall);
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
  id,type:'watchtower',biome:p.biome,size:p.size,variant:4,status:'theoretical',activated:false,
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
  architecture:{kind:p.title,sourceIrregularMaskedFoundation:true,actualKeepVoids:p.cuts.length,independentSteppedLofts:p.lofts.length,footprintCells:mask.size,stairSteps:steps,
   observationAccess:true,observationY:deckY+1,roofProfile:p.roofType,
   realRoofBearingColumns:4,occupiedCoordinates:blocks.size,worldPlaced:false,creatorApproved:false,
   perCellVariantResolved:false,perCellYawResolved:false},
  dependencies:[p.wall,p.floor,p.roof,p.post,p.trim,'pack1:008','pack3:070','pack4:057',p.symbol,
   'Physical stair collider, per-cell numeric variants and yaw, multi-cell reservation unresolved'],
  implementation:'THEORETICAL_3B_WATCHTOWER_VARIANT4_ONLY: no gameplay placement, saves or runtime changes'
 };
 validateBlueprint(bp,ASSET_CATALOG);return bp;
}
const byBiomeSize=new Map(plans.map(p=>[p.biome+':'+p.size,p]));
export function createWatchtowerVariant4FirstBlueprint(type,biome,size,variant=4){
 if(type!=='watchtower'||!['small','medium','large'].includes(size)||variant!==4)
  throw new RangeError('Only specifically authored fourth-variation watchtower source plans belong to this batch');
 const p=byBiomeSize.get(biome+':'+size);if(!p)throw new RangeError('Unwritten fourth-variation tower slot');
 return create(p);
}
export function createWatchtowerVariant4FirstPool(){return plans.map(create);}
