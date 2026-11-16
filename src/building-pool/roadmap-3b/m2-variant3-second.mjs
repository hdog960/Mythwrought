// Builder 3B M2 original third-variation source-only industry buildings.
// Ten distinct manually coordinate-authored work programs; no production placement.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const N=(id,x,z)=>({id,x,y:2,z,width:2,headroom:3});
const E=(from,to)=>({from,to,kind:'level'});
const room=(id,kind,bounds,accessNode)=>({id,kind,bounds,accessNode});
const item=(name,x,y,z,assetRef,unresolvedDependency=null)=>({name,position:[x,y,z],assetRef,unresolvedDependency});
const key=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;
const lumberPlans=[
 {
  "type": "lumberyard",
  "biome": "temperate",
  "size": "medium",
  "w": 40,
  "d": 37,
  "h": 36,
  "aisle": 19,
  "westX": 12,
  "westZ": 20,
  "eastX": 33,
  "eastZ": 11,
  "midZ": 17,
  "title": "canal fork timber foundry with southwest raft drydock, floating north gantry and two detached supply lofts",
  "west": "raft timber shaping boathall",
  "east": "upper sluice dispatch and boatframe shed",
  "yard": "canal fork lift-and-sort cart quay",
  "mask": [
   [
    17,
    24,
    0,
    36
   ],
   [
    2,
    17,
    12,
    29
   ],
   [
    27,
    38,
    3,
    19
   ],
   [
    30,
    39,
    26,
    35
   ],
   [
    0,
    8,
    0,
    9
   ],
   [
    1,
    10,
    31,
    36
   ],
   [
    32,
    39,
    0,
    3
   ]
  ],
  "roofs": [
   {
    "name": "river raft south crossframe",
    "r": [
     3,
     15,
     14,
     27
    ],
    "top": 17,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "north hoist double saw",
    "r": [
     28,
     37,
     5,
     17
    ],
    "top": 17,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east export gable",
    "r": [
     31,
     37,
     28,
     34
    ],
    "top": 14,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "riverboat inspector lodge",
    "r": [
     1,
     7,
     2,
     7
    ],
    "top": 11,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "raft-curved beam drying",
    [
     4,
     10,
     2,
     4,
     17,
     22
    ],
    "builtin:wood"
   ],
   [
    "northeast staged boatframes",
    [
     29,
     35,
     2,
     4,
     7,
     11
    ],
    "pack4:057"
   ],
   [
    "export jetty tools",
    [
     32,
     36,
     2,
     3,
     30,
     33
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "raftyard crossrib",
    [
     7,
     7,
     2,
     7,
     23,
     26
    ],
    "pack2:015"
   ],
   [
    "import quay barrier",
    [
     35,
     35,
     2,
     6,
     12,
     15
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    6,
    2,
    20,
    "raftwood bracing seat"
   ],
   [
    34,
    2,
    32,
    "river export bollard"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 8,
  "dependency": "Boat hauling, hull shaping, flowing river, live timber cargo and exact physical yaw/footprints remain unresolved"
 },
 {
  "type": "lumberyard",
  "biome": "desert",
  "size": "small",
  "w": 30,
  "d": 31,
  "h": 30,
  "aisle": 14,
  "westX": 8,
  "westZ": 11,
  "eastX": 24,
  "eastZ": 23,
  "midZ": 14,
  "title": "zigzag desert palmwood court with northwest clay cistern, southeast low cedar bay and separate east shade awning",
  "west": "wind baffled palmwood cut-room",
  "east": "sandproof caravan timber coffer",
  "yard": "sunken central cedar-trade exchange",
  "mask": [
   [
    12,
    19,
    0,
    30
   ],
   [
    1,
    12,
    2,
    17
   ],
   [
    21,
    28,
    16,
    29
   ],
   [
    23,
    29,
    0,
    9
   ],
   [
    0,
    7,
    23,
    29
   ],
   [
    2,
    9,
    19,
    24
   ]
  ],
  "roofs": [
   {
    "name": "northwest wind-dune cistern",
    "r": [
     2,
     10,
     3,
     15
    ],
    "top": 15,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "southern cedar hall",
    "r": [
     22,
     27,
     18,
     27
    ],
    "top": 13,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "palm shade firebreak",
    "r": [
     24,
     28,
     2,
     8
    ],
    "top": 12,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "west pack animal stand",
    "r": [
     1,
     6,
     24,
     28
    ],
    "top": 10,
    "shape": "flat",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "palmwood bundles",
    [
     4,
     7,
     2,
     4,
     5,
     9
    ],
    "builtin:wood"
   ],
   [
    "cedar export chests",
    [
     23,
     26,
     2,
     4,
     20,
     24
    ],
    "pack4:057"
   ],
   [
    "north caravan awning stores",
    [
     25,
     27,
     2,
     3,
     3,
     5
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "dune wind-break rib",
    [
     5,
     5,
     2,
     6,
     10,
     14
    ],
    "pack1:010"
   ],
   [
    "south packing baffle",
    [
     26,
     26,
     2,
     5,
     23,
     26
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    4,
    2,
    12,
    "dune timber loading chock"
   ],
   [
    25,
    2,
    26,
    "south cargo stand"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 7,
  "dependency": "biome130:006 desert sand profile remains unselected; palm harvesting, caravan animals and working shades not implemented"
 },
 {
  "type": "lumberyard",
  "biome": "snow",
  "size": "large",
  "w": 56,
  "d": 51,
  "h": 46,
  "aisle": 27,
  "westX": 18,
  "westZ": 24,
  "eastX": 45,
  "eastZ": 13,
  "midZ": 23,
  "title": "arctic logworks with western saw-glacier hangar, north double-cable viaduct and separated southeast thawing shed",
  "west": "thermal-free snowwood timber nave",
  "east": "windshield log freight crane",
  "yard": "blizzard split-track sled freight street",
  "mask": [
   [
    24,
    33,
    0,
    50
   ],
   [
    3,
    24,
    11,
    35
   ],
   [
    36,
    54,
    3,
    22
   ],
   [
    39,
    55,
    32,
    49
   ],
   [
    1,
    15,
    42,
    50
   ],
   [
    0,
    8,
    0,
    8
   ],
   [
    43,
    55,
    23,
    29
   ]
  ],
  "roofs": [
   {
    "name": "glacier saw cathedral",
    "r": [
     4,
     22,
     13,
     32
    ],
    "top": 22,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "northern ice-sling gallery",
    "r": [
     37,
     52,
     5,
     20
    ],
    "top": 24,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack2:022"
   },
   {
    "name": "southern snowkiln terrace",
    "r": [
     40,
     53,
     34,
     47
    ],
    "top": 18,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "west powder reserve canopy",
    "r": [
     2,
     13,
     44,
     49
    ],
    "top": 15,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "blizzard roofed pine stacks",
    [
     6,
     14,
     2,
     5,
     17,
     22
    ],
    "builtin:wood"
   ],
   [
    "northern icebeam crates",
    [
     39,
     48,
     2,
     5,
     8,
     13
    ],
    "pack4:057"
   ],
   [
    "rear sled landing timber",
    [
     43,
     51,
     2,
     3,
     37,
     42
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "ice-chute retention wall",
    [
     8,
     8,
     2,
     9,
     24,
     29
    ],
    "pack1:002"
   ],
   [
    "north wind protection",
    [
     49,
     49,
     2,
     8,
     12,
     18
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    9,
    2,
    27,
    "winter logshore beam"
   ],
   [
    51,
    2,
    41,
    "glacier retaining support"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "dependency": "biome130:094 insulation symbolic; no sled AI, blizzard simulation, rope dynamics, warming or felling"
 },
 {
  "type": "lumberyard",
  "biome": "enchanted-forest",
  "size": "large",
  "w": 54,
  "d": 50,
  "h": 45,
  "aisle": 26,
  "westX": 17,
  "westZ": 18,
  "eastX": 44,
  "eastZ": 36,
  "midZ": 25,
  "title": "livingwood canopy shipyard with western arched moon-tree nave, east slanted sporework and northern isolated root pier",
  "west": "livingwood growing-dock concept",
  "east": "mushroom cargo fermentation atelier",
  "yard": "double-lane fae wood exchange meadow",
  "mask": [
   [
    23,
    32,
    0,
    49
   ],
   [
    3,
    23,
    3,
    30
   ],
   [
    34,
    52,
    17,
    31
   ],
   [
    36,
    53,
    32,
    48
   ],
   [
    3,
    16,
    39,
    48
   ],
   [
    42,
    53,
    0,
    12
   ],
   [
    0,
    8,
    0,
    9
   ]
  ],
  "roofs": [
   {
    "name": "great moon-tree long arch",
    "r": [
     4,
     21,
     5,
     27
    ],
    "top": 23,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east spore machine saw",
    "r": [
     36,
     50,
     19,
     29
    ],
    "top": 20,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south glowing lumber bridge",
    "r": [
     38,
     51,
     34,
     46
    ],
    "top": 17,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "north fae nursery landing",
    "r": [
     44,
     51,
     2,
     10
    ],
    "top": 13,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "west lichen export bay",
    "r": [
     4,
     13,
     41,
     46
    ],
    "top": 12,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "moonroot separated trunks",
    [
     6,
     15,
     2,
     5,
     8,
     14
    ],
    "builtin:wood"
   ],
   [
    "spore board mixing vault",
    [
     39,
     46,
     2,
     4,
     21,
     25
    ],
    "pack4:057"
   ],
   [
    "glowing plank port",
    [
     41,
     48,
     2,
     3,
     37,
     41
    ],
    "pack2:013"
   ]
  ],
  "partitions": [
   [
    "fae rootwood frame",
    [
     9,
     9,
     2,
     8,
     17,
     25
    ],
    "pack2:015"
   ],
   [
    "spore-lodge brace",
    [
     48,
     48,
     2,
     7,
     22,
     27
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    9,
    2,
    21,
    "glowwood pier root"
   ],
   [
    48,
    2,
    42,
    "southern fungi landing"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 10,
  "dependency": "biome130:096 livingwood future family; no growth/holo-lantern dynamics, wood harvesting or per-cell shape rotation"
 },
 {
  "type": "lumberyard",
  "biome": "mountain",
  "size": "small",
  "w": 33,
  "d": 34,
  "h": 36,
  "aisle": 15,
  "westX": 9,
  "westZ": 20,
  "eastX": 27,
  "eastZ": 12,
  "midZ": 17,
  "title": "mountain notch log foundry with narrow west granite vault, southeast cliff-switch and isolated northwest rope lookout",
  "west": "mountain timber sorting notch",
  "east": "hanging highland cargo loft",
  "yard": "cliff path double-wide log stair street",
  "mask": [
   [
    13,
    20,
    0,
    33
   ],
   [
    2,
    13,
    12,
    28
   ],
   [
    23,
    31,
    3,
    20
   ],
   [
    24,
    32,
    27,
    33
   ],
   [
    0,
    7,
    0,
    8
   ],
   [
    0,
    9,
    29,
    33
   ]
  ],
  "roofs": [
   {
    "name": "west cutrock saddle",
    "r": [
     3,
     11,
     14,
     26
    ],
    "top": 19,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "northeast log cantilever",
    "r": [
     24,
     30,
     5,
     17
    ],
    "top": 17,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "southeast freight catcher",
    "r": [
     25,
     31,
     28,
     32
    ],
    "top": 13,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "northwest clip-rope annex",
    "r": [
     1,
     6,
     2,
     6
    ],
    "top": 12,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "dry cliff-cut pine",
    [
     4,
     8,
     2,
     4,
     16,
     21
    ],
    "builtin:wood"
   ],
   [
    "upper cliff freight logs",
    [
     26,
     29,
     2,
     4,
     7,
     11
    ],
    "pack4:057"
   ],
   [
    "southeast rail transfer",
    [
     26,
     29,
     2,
     3,
     29,
     31
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "granite cut saw shield",
    [
     5,
     5,
     2,
     6,
     22,
     26
    ],
    "pack1:002"
   ],
   [
    "cliff tie-out beam",
    [
     29,
     29,
     2,
     5,
     11,
     15
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    7,
    2,
    23,
    "cliff-shelf foot"
   ],
   [
    28,
    2,
    30,
    "rail-lift bollard"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 11,
  "dependency": "biome130:098 mountain anchors future; cliff support, cable lifts and any timber harvesting remain symbolic"
 }
];
const millPlans=[
 {
  "type": "mill",
  "biome": "temperate",
  "size": "small",
  "w": 32,
  "d": 34,
  "h": 32,
  "aisle": 15,
  "westX": 9,
  "westZ": 20,
  "eastX": 26,
  "eastZ": 11,
  "midZ": 18,
  "title": "three-lot waterside flour cooperative with south basin store, old eastern sluice-wheel shed and small upstream grain loft",
  "west": "streambank grain-handling room",
  "east": "manual stone-quern millhouse",
  "yard": "millstream footbridge grain transfer",
  "mask": [
   [
    13,
    20,
    0,
    33
   ],
   [
    2,
    13,
    13,
    28
   ],
   [
    22,
    30,
    2,
    17
   ],
   [
    23,
    31,
    26,
    33
   ],
   [
    0,
    7,
    0,
    8
   ],
   [
    0,
    9,
    29,
    33
   ]
  ],
  "roofs": [
   {
    "name": "west-grain pitched cross",
    "r": [
     3,
     11,
     15,
     26
    ],
    "top": 16,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "northeast sluice-wheel hall",
    "r": [
     23,
     29,
     3,
     16
    ],
    "top": 15,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "southstream flour porch",
    "r": [
     24,
     30,
     27,
     32
    ],
    "top": 12,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "northstream small granary",
    "r": [
     1,
     6,
     2,
     7
    ],
    "top": 11,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "covered seedgrain sacks",
    [
     4,
     9,
     2,
     4,
     18,
     22
    ],
    "pack4:057"
   ],
   [
    "old river quern spindle",
    [
     24,
     28,
     2,
     4,
     7,
     10
    ],
    "pack1:010"
   ],
   [
    "southeastern flour carts",
    [
     25,
     29,
     2,
     3,
     28,
     31
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "quern and grain screen",
    [
     7,
     7,
     2,
     6,
     22,
     25
    ],
    "pack2:015"
   ],
   [
    "sluice-axle shelter",
    [
     28,
     28,
     2,
     5,
     10,
     14
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    6,
    2,
    21,
    "miller dry-stone seat"
   ],
   [
    28,
    2,
    30,
    "flour cart piling"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 8,
  "dependency": "No flowing stream, operating quern, cog wheels, grain harvesting or final physical family orientation"
 },
 {
  "type": "mill",
  "biome": "desert",
  "size": "medium",
  "w": 41,
  "d": 39,
  "h": 38,
  "aisle": 20,
  "westX": 13,
  "westZ": 16,
  "eastX": 33,
  "eastZ": 29,
  "midZ": 20,
  "title": "broad west dune-souk quern cloister with a monumental full-depth arcade, opposite southeast wind shaft and sun-court",
  "west": "spice dategrain drying aisles",
  "east": "stone windscoop quern and packing house",
  "yard": "open-air caravan flour-switch court",
  "mask": [
   [
    18,
    25,
    0,
    38
   ],
   [
    2,
    18,
    3,
    24
   ],
   [
    28,
    39,
    13,
    37
   ],
   [
    29,
    40,
    0,
    8
   ],
   [
    0,
    10,
    28,
    38
   ],
   [
    3,
    11,
    0,
    2
   ],
   [
    0,
    15,
    24,
    38
   ],
   [
    0,
    14,
    0,
    27
   ]
  ],
  "roofs": [
   {
    "name": "northwest dategrain vault",
    "r": [
     3,
     16,
     5,
     22
    ],
    "top": 19,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "southern reed quern sawmill",
    "r": [
     29,
     37,
     15,
     26
    ],
    "top": 17,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "southeast wind tower gable",
    "r": [
     31,
     38,
     29,
     35
    ],
    "top": 21,
    "shape": "gable",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "north caravan windcatch",
    "r": [
     30,
     38,
     1,
     7
    ],
    "top": 14,
    "shape": "slope",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "southwest dategrain souk",
    "r": [
     2,
     12,
     27,
     36
    ],
    "top": 12,
    "shape": "saw",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "northwest dune suq nave",
    "r": [
     2,
     12,
     4,
     13
    ],
    "top": 14,
    "shape": "flat",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "dry dategrain storage bins",
    [
     5,
     12,
     2,
     5,
     8,
     13
    ],
    "pack4:057"
   ],
   [
    "wind quernstone bearing",
    [
     31,
     35,
     2,
     5,
     17,
     21
    ],
    "pack1:010"
   ],
   [
    "flour export barrel platform",
    [
     33,
     37,
     2,
     3,
     30,
     34
    ],
    "pack1:007"
   ],
   [
    "long southwest dategrain drying pad",
    [
     3,
     9,
     2,
     4,
     30,
     34
    ],
    "pack4:057"
   ],
   [
    "west adobe grain export shelves",
    [
     4,
     10,
     2,
     3,
     6,
     10
    ],
    "pack4:057"
   ]
  ],
  "partitions": [
   [
    "caravan quern grain wall",
    [
     7,
     7,
     2,
     7,
     14,
     20
    ],
    "pack1:002"
   ],
   [
    "east stone dust shield",
    [
     37,
     37,
     2,
     6,
     22,
     27
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    7,
    2,
    18,
    "dategrain shading foot"
   ],
   [
    36,
    2,
    33,
    "mill-export stone beacon"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "dependency": "biome130:006 sand family symbolic; no date harvesting, wind pressure, powered millstones or transport animals"
 },
 {
  "type": "mill",
  "biome": "snow",
  "size": "medium",
  "w": 45,
  "d": 42,
  "h": 43,
  "aisle": 21,
  "westX": 13,
  "westZ": 28,
  "eastX": 36,
  "eastZ": 13,
  "midZ": 21,
  "title": "three-lane snow-quern exchange with broad southwestern avalanche windbreak, high east stone gears and winter flour loft",
  "west": "blizzard sealed heavy grain loft",
  "east": "ice-safe quern drive vault",
  "yard": "cold-switch snowgrain freight nave",
  "mask": [
   [
    19,
    26,
    0,
    41
   ],
   [
    2,
    19,
    14,
    35
   ],
   [
    30,
    43,
    2,
    23
   ],
   [
    32,
    44,
    29,
    41
   ],
   [
    0,
    10,
    0,
    11
   ],
   [
    0,
    9,
    33,
    41
   ],
   [
    38,
    44,
    24,
    28
   ],
   [
    0,
    15,
    23,
    41
   ]
  ],
  "roofs": [
   {
    "name": "west polar grain crosshall",
    "r": [
     3,
     17,
     16,
     33
    ],
    "top": 20,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "upper-northeast quern gable",
    "r": [
     31,
     41,
     4,
     20
    ],
    "top": 22,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack2:022"
   },
   {
    "name": "southern frostshroud mill",
    "r": [
     33,
     42,
     31,
     39
    ],
    "top": 15,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "ice-picket lookout gallery",
    "r": [
     1,
     8,
     2,
     9
    ],
    "top": 15,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "southwestern frostgrain crossing",
    "r": [
     2,
     13,
     28,
     38
    ],
    "top": 17,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "iceproof barleygrain bins",
    [
     5,
     12,
     2,
     5,
     18,
     23
    ],
    "pack4:057"
   ],
   [
    "glacial-quern gearbox",
    [
     33,
     39,
     2,
     5,
     7,
     13
    ],
    "pack1:010"
   ],
   [
    "south packed flour crates",
    [
     35,
     41,
     2,
     3,
     34,
     37
    ],
    "pack1:007"
   ],
   [
    "southwest frostgrain buffer",
    [
     4,
     11,
     2,
     4,
     30,
     34
    ],
    "pack4:057"
   ]
  ],
  "partitions": [
   [
    "grain-insulation lintel",
    [
     7,
     7,
     2,
     7,
     24,
     30
    ],
    "pack1:002"
   ],
   [
    "quernstone service barrier",
    [
     40,
     40,
     2,
     7,
     14,
     18
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    8,
    2,
    27,
    "snowgrain retaining beam"
   ],
   [
    40,
    2,
    36,
    "ice-flour loading brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 11,
  "dependency": "biome130:094 thermal wall unregistered; no cold physics, wheat processing or water flow"
 },
 {
  "type": "mill",
  "biome": "enchanted-forest",
  "size": "large",
  "w": 57,
  "d": 53,
  "h": 48,
  "aisle": 28,
  "westX": 18,
  "westZ": 20,
  "eastX": 46,
  "eastZ": 38,
  "midZ": 27,
  "title": "moonwater grain citadel with spacious northwest open fae-wood flood meadows and two unequal east covered millhouses",
  "west": "fae moonseed sorting nave",
  "east": "rune-water heavy grain workshop",
  "yard": "enchanted open double root aqueduct grain lane",
  "mask": [
   [
    25,
    34,
    0,
    52
   ],
   [
    3,
    25,
    4,
    30
   ],
   [
    37,
    55,
    3,
    25
   ],
   [
    38,
    56,
    33,
    51
   ],
   [
    2,
    17,
    40,
    52
   ],
   [
    0,
    10,
    0,
    10
   ],
   [
    48,
    56,
    25,
    32
   ],
   [
    0,
    6,
    33,
    52
   ]
  ],
  "roofs": [
   {
    "name": "western moon-grain basilica",
    "r": [
     4,
     23,
     6,
     28
    ],
    "top": 24,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "north light-rune axle loft",
    "r": [
     39,
     53,
     5,
     23
    ],
    "top": 22,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "southern spore quern conservatory",
    "r": [
     40,
     54,
     35,
     49
    ],
    "top": 19,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "western fern canal roof",
    "r": [
     3,
     15,
     42,
     50
    ],
    "top": 15,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "west narrow moon-root arcade",
    "r": [
     1,
     5,
     41,
     49
    ],
    "top": 14,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "mythgrain root caskets",
    [
     6,
     16,
     2,
     5,
     9,
     15
    ],
    "pack4:057"
   ],
   [
    "moon-axle stoneworks",
    [
     41,
     49,
     2,
     5,
     9,
     15
    ],
    "pack1:010"
   ],
   [
    "luminous ground seed packery",
    [
     42,
     51,
     2,
     4,
     39,
     43
    ],
    "pack2:013"
   ],
   [
    "moonroot clipped grain stock",
    [
     2,
     4,
     2,
     3,
     43,
     46
    ],
    "pack4:057"
   ]
  ],
  "partitions": [
   [
    "west spore-grain transept",
    [
     8,
     8,
     2,
     8,
     17,
     25
    ],
    "pack2:015"
   ],
   [
    "east fernwork loom",
    [
     51,
     51,
     2,
     8,
     11,
     20
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    9,
    2,
    23,
    "livingwood-grain pier"
   ],
   [
    51,
    2,
    43,
    "moonwater hopper base"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 11,
  "dependency": "biome130:096 livingwood/fungal supports symbolic; no magic mill power, water simulation or grain harvest"
 },
 {
  "type": "mill",
  "biome": "mountain",
  "size": "large",
  "w": 60,
  "d": 55,
  "h": 50,
  "aisle": 29,
  "westX": 20,
  "westZ": 24,
  "eastX": 47,
  "eastZ": 15,
  "midZ": 28,
  "title": "high cliff-cut grain fortress with narrow west quarry headland, offset rock ledge aqueduct and east gated milling vaults",
  "west": "cliffside grain milling transept",
  "east": "elevated waterwheel and granite axle foundry",
  "yard": "highland quarry freight switching valley",
  "mask": [
   [
    26,
    35,
    0,
    54
   ],
   [
    3,
    26,
    8,
    21
   ],
   [
    3,
    13,
    22,
    34
   ],
   [
    38,
    57,
    2,
    24
   ],
   [
    40,
    59,
    32,
    53
   ],
   [
    1,
    16,
    43,
    54
   ],
   [
    0,
    11,
    0,
    7
   ],
   [
    51,
    59,
    25,
    31
   ],
   [
    48,
    59,
    23,
    35
   ],
   [
    0,
    18,
    34,
    43
   ],
   [
    0,
    10,
    20,
    52
   ]
  ],
  "roofs": [
   {
    "name": "west cliffgrist rib-crossroof",
    "r": [
     4,
     24,
     10,
     20
    ],
    "top": 27,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "north high aqueduct gable",
    "r": [
     40,
     55,
     4,
     22
    ],
    "top": 25,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south quarry-flour terrace",
    "r": [
     42,
     57,
     34,
     51
    ],
    "top": 20,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "west ledge grain custom vault",
    "r": [
     3,
     14,
     45,
     51
    ],
    "top": 15,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east elevated granite aqueduct arm",
    "r": [
     51,
     58,
     25,
     32
    ],
    "top": 17,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "western stepped ledge aqueduct",
    "r": [
     1,
     9,
     28,
     40
    ],
    "top": 19,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "cliff-grain vault shelves",
    [
     7,
     17,
     2,
     5,
     13,
     20
    ],
    "pack4:057"
   ],
   [
    "headrace stone gear foundation",
    [
     42,
     51,
     2,
     5,
     7,
     14
    ],
    "pack1:010"
   ],
   [
    "highland flour freight caches",
    [
     45,
     53,
     2,
     4,
     37,
     42
    ],
    "pack1:007"
   ],
   [
    "east aqueduct stone mill gears",
    [
     53,
     57,
     2,
     4,
     27,
     30
    ],
    "pack1:010"
   ],
   [
    "western stonewater grain hopper",
    [
     3,
     7,
     2,
     4,
     30,
     35
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "grain abbey retaining ribs",
    [
     9,
     9,
     2,
     9,
     21,
     28
    ],
    "pack1:002"
   ],
   [
    "turbine water-wall screen",
    [
     54,
     54,
     2,
     8,
     12,
     19
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    11,
    2,
    25,
    "aqueduct cliff footing"
   ],
   [
    55,
    2,
    43,
    "quern mine load pier"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 13,
  "dependency": "biome130:098 mountain anchors not registered; no powered axle, waterfall simulation or live cliff support"
 }
];
function create(p){
 const {w,d,h,aisle,westX,westZ,eastX,eastZ,midZ}=p;
 const id=assertSlot(p.type,p.biome,p.size,3),shape=new Set();
 const one=(x,z)=>flat(x,z);
 for(const [x0,x1,z0,z1] of p.mask)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)shape.add(one(x,z));
 const reserved=[B(aisle,2,0,2,3,d),
  B(westX,2,westZ,aisle-westX+2,3,2),
  B(aisle,2,eastZ,eastX-aisle+2,3,2)];
 // Physically author the complete freight bridges between offset structures.
 // Each route extension receives the same real foundation and floor as the
 // bespoke masked wings; no graph-only teleportation or hovering corridor.
 for(const q of reserved)for(let x=q.x;x<q.x+q.width;x++)
  for(let z=q.z;z<q.z+q.depth;z++)shape.add(one(x,z));
 const corridor=(x,y,z)=>reserved.some(q=>x>=q.x&&x<q.x+q.width&&y>=q.y&&y<q.y+q.height&&z>=q.z&&z<q.z+q.depth);
 const cells=new Map(),roles=new Map();
 function has(x,y,z){return cells.has(key(x,y,z));}
 function write(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=h||z<0||z>=d)throw Error(id+' outside local voxel bounds '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' unregistered candidate family '+ref);
  if(role!=='foundation'&&role!=='floor'&&!shape.has(one(x,z)))return false;
  if(corridor(x,y,z)||has(x,y,z))return false;
  cells.set(key(x,y,z),{role,x,y,z});
  if(!roles.has(role))roles.set(role,[]);
  roles.get(role).push([x,y,z,ref]);
  return true;
 }
 function volume(role,[x0,x1,y0,y1,z0,z1],ref){
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)write(role,x,y,z,ref);
 }
 // Voxel-exact non-rectangular building footprint includes open-air freight.
 for(const q of shape){const [x,z]=q.split(',').map(Number);
  write('foundation',x,0,z,'builtin:stone');write('floor',x,1,z,p.floor);
 }
 // Only actual footprint boundaries grow walls; no rectangular filler/outside blocks.
 for(const q of shape){const [x,z]=q.split(',').map(Number);
  if([[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,b])=>!shape.has(one(a,b))) && !corridor(x,2,z))
   for(let y=2;y<=p.roofWallHeight;y++)write('wall',x,y,z,p.wall);
 }
 const topOf=(roof,x,z)=>{
  const [x0,x1,z0,z1]=roof.r;
  if(roof.shape==='gable')return roof.top+Math.floor(Math.min(x-x0,x1-x)/3);
  if(roof.shape==='cross')return roof.top+Math.floor(Math.min(z-z0,z1-z)/4);
  if(roof.shape==='terrace')return roof.top+(x<=Math.floor((x0+x1)/2)?2:0);
  if(roof.shape==='saw')return roof.top+(Math.floor((x-x0)/3)%2);
  if(roof.shape==='slope')return roof.top+Math.floor((x-x0)/4);
  if(roof.shape==='lean')return roof.top+Math.floor((x-x0)/4);
  return roof.top;
 };
 for(const [n,roof] of p.roofs.entries()){
  const [x0,x1,z0,z1]=roof.r;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!shape.has(one(x,z)))throw Error(id+' invalid disconnected roof over missing foundation '+[x,z]);
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)write('roof',x,topOf(roof,x,z),z,roof.cover);
  // Join each stepped plane to preserve face-connected roof geometry.
  for(let x=x0+1;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const a=topOf(roof,x-1,z),b=topOf(roof,x,z);
   for(let y=Math.min(a,b);y<Math.max(a,b);y++)write('roof-step-x',a<b?x:x-1,y,z,'pack2:015');
  }
  for(let z=z0+1;z<=z1;z++)for(let x=x0;x<=x1;x++){
   const a=topOf(roof,x,z-1),b=topOf(roof,x,z);
   for(let y=Math.min(a,b);y<Math.max(a,b);y++)write('roof-step-z',x,y,a<b?z:z-1,'pack2:015');
  }
  const points=[[x0,z0],[x1,z0],[x0,z1],[x1,z1],
    [Math.floor((x0+x1)/2),z0],[Math.floor((x0+x1)/2),z1]];
  for(const [x,z] of points)for(let y=2;y<topOf(roof,x,z);y++)write('roof-pier-'+n,x,y,z,roof.post);
 }
 for(const [name,cube,ref] of p.cargo)volume(name,cube,ref);
 for(const [name,cube,ref] of p.partitions ?? [])volume('interior-'+name,cube,ref);
 for(const [x,y,z,label] of p.details)write('distinct-architectural-'+label,x,y,z,'pack1:010');
 for(const b of reserved)for(let x=b.x;x<b.x+b.width;x++)for(let y=b.y;y<b.y+b.height;y++)for(let z=b.z;z<b.z+b.depth;z++)
  if(cells.has(key(x,y,z)))throw Error(id+' blocked concrete two-wide aisle '+[x,y,z]);
 const nav={entry:'entry',nodes:[N('entry',aisle,d-1),N('center',aisle,midZ),N('west',westX,westZ),N('east',eastX,eastZ)],
   edges:[E('entry','center'),E('center','west'),E('center','east')]};
 const result={id,type:p.type,biome:p.biome,size:p.size,variant:3,status:'theoretical',activated:false,
  envelope:B(0,0,0,w,h,d),modules:[...roles].map(([role,cells])=>({id:role+'-01',role,cells})),
  clearances:reserved,openings:[{id:'two-wide-south-loading-door',facing:'south',x:aisle,y:2,z:d-1,width:2,height:3}],
  navigation:nav,
  spaces:[
    room('west-storage',p.west,B(1,2,1,aisle,6,d-2),'west'),
    room('open-cart-court',p.yard,B(aisle,2,1,2,6,d-1),'center'),
    room('east-industry',p.east,B(aisle+2,2,1,w-aisle-2,6,d-2),'east')
  ],
  features:[
    item('source-west-process-zone',westX,2,westZ,p.cargo[0][2]),
    item('source-east-warehouse',eastX,2,eastZ,p.cargo[1][2]),
    item('uneven-loading-zone',aisle,2,d-4,p.floor),
    item('stone-roof-bearing',p.details[0][0],p.details[0][1],p.details[0][2],'pack1:010'),
    item('unbuilt-working-machinery',w-2,3,d-4,null,p.dependency)
  ],
  architecture:{kind:p.title,footprintShape:'nonrectangular original mask of joined individual work bays',
    footprintCells:shape.size,openAirFreightCourt:true,roofProfiles:p.roofs.map(q=>q.shape),
    originalRoofRuns:p.roofs.map(q=>q.r),occupiedCoordinates:cells.size,
    creatorApproved:false,worldPlaced:false,perCellVariantResolved:false,perCellYawResolved:false},
  dependencies:[p.wall,p.floor,...p.roofs.map(q=>q.cover),...p.cargo.map(q=>q[2]),p.dependency,
    'Manual family numeric variant / yaw / multi-voxel physical support and collision unresolved'],
  implementation:'3B_THEORETICAL_VARIANT3_ONLY: no world placements, saves, biome registration, powered mills or harvesting'};
 validateBlueprint(result,ASSET_CATALOG);
 return result;
}
const plans=[...lumberPlans,...millPlans];
const bySlot=new Map(plans.map(p=>[p.type+':'+p.biome+':'+p.size,p]));
export function createVariant3SecondBlueprint(type,biome,size,variant=3){
 if(variant!==3)throw new RangeError('Only specifically authored variant 3 belongs to this independent batch');
 const p=bySlot.get(type+':'+biome+':'+size);
 if(!p)throw new RangeError('Unwritten variant-3 architecture '+[type,biome,size].join(':'));
 return create(p);
}
export function createVariant3SecondPool(){return plans.map(create);}
