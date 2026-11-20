// Builder 3B M2: original variant-two completion for all 16 remaining industry biome/size slots.
// Real authored coordinate footprint/roof/pier/work-space definitions, symbolic machinery only.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const N=(id,x,z)=>({id,x,y:2,z,width:2,headroom:3});
const E=(from,to)=>({from,to,kind:'level'});
const room=(id,kind,bounds,accessNode)=>({id,kind,bounds,accessNode});
const item=(name,x,y,z,assetRef,unresolvedDependency=null)=>({name,position:[x,y,z],assetRef,unresolvedDependency});
const key=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;

// Eight new M2 LUMBERYARD variant-two diagrams. Every rectangle is an explicit
// source-authored footprint/roof/cargo/partition coordinate, not a seed or resize.
const lumberPlans=[
 {
  "type": "lumberyard",
  "biome": "temperate",
  "size": "large",
  "w": 52,
  "d": 48,
  "h": 39,
  "aisle": 25,
  "westX": 15,
  "westZ": 18,
  "eastX": 40,
  "eastZ": 33,
  "midZ": 22,
  "title": "canal timber exchange with cross-cut river loft, separated two-story wharf loading, customs gantry and side launching slip",
  "west": "covered riverwood sorting loft",
  "east": "eastern double-slip export warehouse",
  "yard": "sunlit split-dock bridge and crane-loading court",
  "mask": [
   [
    22,
    31,
    0,
    47
   ],
   [
    3,
    22,
    5,
    29
   ],
   [
    32,
    49,
    4,
    18
   ],
   [
    35,
    50,
    29,
    45
   ],
   [
    10,
    39,
    43,
    47
   ],
   [
    1,
    11,
    32,
    40
   ]
  ],
  "roofs": [
   {
    "name": "west-timber-cross-gable",
    "r": [
     4,
     20,
     6,
     27
    ],
    "top": 17,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "north-customs-saw",
    "r": [
     33,
     48,
     5,
     17
    ],
    "top": 14,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south-wharf-terrace",
    "r": [
     36,
     49,
     30,
     43
    ],
    "top": 13,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side-boat-slip",
    "r": [
     2,
     10,
     33,
     38
    ],
    "top": 11,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "riverwood-beam-racks",
    [
     6,
     14,
     2,
     4,
     10,
     15
    ],
    "builtin:wood"
   ],
   [
    "customs-dock-stone",
    [
     36,
     43,
     2,
     4,
     8,
     12
    ],
    "pack1:007"
   ],
   [
    "wharf-crated-timbers",
    [
     38,
     46,
     2,
     3,
     34,
     39
    ],
    "pack4:057"
   ]
  ],
  "partitions": [
   [
    "west-grading-stall",
    [
     8,
     8,
     2,
     6,
     18,
     23
    ],
    "pack2:015"
   ],
   [
    "north-import-rail",
    [
     45,
     45,
     2,
     6,
     8,
     14
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    8,
    2,
    38,
    "riverboat-slip-bollard"
   ],
   [
    46,
    2,
    36,
    "customs-crane-support"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 8,
  "dependency": "Canal boats, crane, saw blades, real running water and mounted physical numeric variants are future-only"
 },
 {
  "type": "lumberyard",
  "biome": "desert",
  "size": "medium",
  "w": 36,
  "d": 33,
  "h": 29,
  "aisle": 17,
  "westX": 10,
  "westZ": 10,
  "eastX": 28,
  "eastZ": 23,
  "midZ": 17,
  "title": "wind-tunnel desert timber depot with three separately sheltered caravan routes and open protected atrium",
  "west": "north adobe sun-dried beam vault",
  "east": "east caravan customs and shade shelter",
  "yard": "split sun-courtyard freight passage",
  "mask": [
   [
    15,
    21,
    0,
    32
   ],
   [
    2,
    14,
    2,
    13
   ],
   [
    23,
    33,
    10,
    27
   ],
   [
    3,
    15,
    23,
    31
   ],
   [
    8,
    29,
    30,
    32
   ],
   [
    27,
    35,
    0,
    5
   ]
  ],
  "roofs": [
   {
    "name": "sun-log-west-flat",
    "r": [
     3,
     12,
     3,
     12
    ],
    "top": 14,
    "shape": "flat",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "east-wind-checkpoint",
    "r": [
     24,
     32,
     11,
     24
    ],
    "top": 15,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "rear-caravan-arcade",
    "r": [
     5,
     13,
     24,
     29
    ],
    "top": 10,
    "shape": "saw",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "desert-timber-crib",
    [
     4,
     10,
     2,
     3,
     5,
     7
    ],
    "builtin:wood"
   ],
   [
    "reed-export-packages",
    [
     25,
     29,
     2,
     4,
     14,
     18
    ],
    "pack4:057"
   ],
   [
    "sandstone-cart-landing",
    [
     7,
     11,
     2,
     2,
     27,
     29
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "sand-baffle-west",
    [
     5,
     5,
     2,
     5,
     8,
     10
    ],
    "pack1:002"
   ],
   [
    "caravan-wind-screen",
    [
     30,
     30,
     2,
     5,
     17,
     21
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    4,
    2,
    8,
    "sun-kiln-buttress"
   ],
   [
    31,
    2,
    19,
    "reed-caravan-bracket"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 6,
  "dependency": "biome130:006 sand choice diagnostic; caravans, sun-kiln mechanics, multi-cell pack support and water are unresolved"
 },
 {
  "type": "lumberyard",
  "biome": "snow",
  "size": "small",
  "w": 29,
  "d": 30,
  "h": 30,
  "aisle": 14,
  "westX": 8,
  "westZ": 17,
  "eastX": 23,
  "eastZ": 10,
  "midZ": 13,
  "title": "half-buried snow log-cradle with west avalanche canopy, detached east thawing store and low rear freight notch",
  "west": "stormproof deep log-cradle",
  "east": "winter cargo warming-free bay",
  "yard": "wind-protected sled turnaround",
  "mask": [
   [
    12,
    18,
    0,
    29
   ],
   [
    2,
    12,
    8,
    24
   ],
   [
    20,
    27,
    3,
    16
   ],
   [
    19,
    27,
    23,
    28
   ],
   [
    0,
    8,
    24,
    29
   ]
  ],
  "roofs": [
   {
    "name": "west-snow-break-cross",
    "r": [
     3,
     10,
     9,
     22
    ],
    "top": 15,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east-frostvault-gable",
    "r": [
     21,
     26,
     4,
     14
    ],
    "top": 14,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack2:022"
   },
   {
    "name": "rear-sled-lean",
    "r": [
     20,
     26,
     24,
     27
    ],
    "top": 10,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "iced-rough-cut-timbers",
    [
     4,
     7,
     2,
     4,
     11,
     14
    ],
    "builtin:wood"
   ],
   [
    "glacial-sled-supply",
    [
     22,
     24,
     2,
     4,
     6,
     9
    ],
    "pack4:057"
   ],
   [
    "snowplow-stone-pads",
    [
     21,
     25,
     2,
     2,
     25,
     27
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "storm-excluder",
    [
     4,
     4,
     2,
     6,
     15,
     19
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    5,
    2,
    19,
    "avalanche-corner-post"
   ],
   [
    25,
    2,
    10,
    "frost-sled-pier"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 9,
  "dependency": "biome130:094 future thermal wall, sled traction, powered saws and real snow-shedding not available"
 },
 {
  "type": "lumberyard",
  "biome": "snow",
  "size": "medium",
  "w": 39,
  "d": 37,
  "h": 36,
  "aisle": 19,
  "westX": 12,
  "westZ": 16,
  "eastX": 31,
  "eastZ": 28,
  "midZ": 20,
  "title": "glacial iceport with northwest cold kiln, lower rock sled-slip and rear half-roofed haul court",
  "west": "northern frost-beam drying kiln",
  "east": "southern sled freight vault",
  "yard": "thermally sheltered two-wide haul spine",
  "mask": [
   [
    17,
    23,
    0,
    36
   ],
   [
    2,
    17,
    3,
    22
   ],
   [
    26,
    36,
    2,
    14
   ],
   [
    29,
    37,
    25,
    34
   ],
   [
    4,
    13,
    28,
    35
   ],
   [
    0,
    8,
    21,
    30
   ]
  ],
  "roofs": [
   {
    "name": "icekiln-triple-cross",
    "r": [
     3,
     15,
     4,
     20
    ],
    "top": 18,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "snowbound-upper-loader",
    "r": [
     27,
     35,
     3,
     13
    ],
    "top": 16,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "rear-sled-track-cover",
    "r": [
     30,
     36,
     26,
     33
    ],
    "top": 12,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "covered-frost-beams",
    [
     5,
     10,
     2,
     4,
     7,
     11
    ],
    "builtin:wood"
   ],
   [
    "steel-sled-crib",
    [
     29,
     33,
     2,
     3,
     5,
     8
    ],
    "pack4:057"
   ],
   [
    "glacial-turnout-ramp",
    [
     31,
     34,
     2,
     2,
     28,
     31
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "icekiln-vent-slot",
    [
     6,
     6,
     2,
     7,
     12,
     17
    ],
    "pack1:010"
   ],
   [
    "sled-baffle",
    [
     34,
     34,
     2,
     5,
     28,
     31
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    7,
    2,
    18,
    "icekiln-wall-anchor"
   ],
   [
    35,
    2,
    30,
    "sled-ice-brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 8,
  "dependency": "biome130:094 insulating block unregistered; kiln physics, snow collapse, sled vehicle not provided"
 },
 {
  "type": "lumberyard",
  "biome": "enchanted-forest",
  "size": "small",
  "w": 30,
  "d": 28,
  "h": 29,
  "aisle": 14,
  "westX": 9,
  "westZ": 12,
  "eastX": 23,
  "eastZ": 21,
  "midZ": 14,
  "title": "root-braided fae timber kiosk with a pierced moonlight courtyard, separate mushroom lean-to and north tree-drying cradle",
  "west": "thorn-root storage alcove",
  "east": "luminous mushroom freight nook",
  "yard": "circular moonlit coppice loading court",
  "mask": [
   [
    12,
    18,
    0,
    27
   ],
   [
    2,
    12,
    4,
    16
   ],
   [
    20,
    28,
    10,
    23
   ],
   [
    1,
    8,
    22,
    27
   ],
   [
    22,
    29,
    0,
    7
   ]
  ],
  "roofs": [
   {
    "name": "twisted-root-arch",
    "r": [
     3,
     10,
     5,
     15
    ],
    "top": 16,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "fae-mushroom-lean",
    "r": [
     21,
     27,
     11,
     22
    ],
    "top": 12,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "north-moonwood-portico",
    "r": [
     23,
     28,
     1,
     6
    ],
    "top": 13,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "rootwood-basket",
    [
     4,
     8,
     2,
     3,
     7,
     9
    ],
    "pack4:057"
   ],
   [
    "dried-fae-coppice",
    [
     22,
     25,
     2,
     3,
     13,
     16
    ],
    "builtin:wood"
   ],
   [
    "moonlit-board-stack",
    [
     23,
     27,
     2,
     2,
     3,
     5
    ],
    "pack2:013"
   ]
  ],
  "partitions": [
   [
    "vine-split",
    [
     4,
     4,
     2,
     5,
     10,
     12
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    5,
    2,
    13,
    "coppice-post"
   ],
   [
    26,
    2,
    19,
    "fungal-support-foot"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 5,
  "dependency": "biome130:096 growing livingwood unregistered; spore growth, harvestable flora, real glow are not features"
 },
 {
  "type": "lumberyard",
  "biome": "enchanted-forest",
  "size": "large",
  "w": 53,
  "d": 50,
  "h": 43,
  "aisle": 25,
  "westX": 16,
  "westZ": 19,
  "eastX": 43,
  "eastZ": 36,
  "midZ": 25,
  "title": "great druidic canopy terminal with northeast airy arboretum, northwest moon-gate conservatory, southern spore bridge and east smithy",
  "west": "tall greenwood sorting cathedral",
  "east": "four-stage mycelium freight and kiln",
  "yard": "moonbeam forest timber meadow",
  "mask": [
   [
    22,
    31,
    0,
    49
   ],
   [
    2,
    22,
    8,
    33
   ],
   [
    32,
    50,
    2,
    20
   ],
   [
    36,
    51,
    33,
    48
   ],
   [
    3,
    12,
    39,
    48
   ],
   [
    9,
    21,
    1,
    6
   ],
   [
    48,
    52,
    21,
    29
   ],
   [
    0,
    9,
    33,
    39
   ],
   [
    0,
    18,
    0,
    7
   ]
  ],
  "roofs": [
   {
    "name": "livingwood-cathedral-aisle",
    "r": [
     3,
     20,
     9,
     30
    ],
    "top": 20,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "spore-loom-sawtooth",
    "r": [
     33,
     48,
     3,
     18
    ],
    "top": 19,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "moonshade-kiln-shelf",
    "r": [
     38,
     50,
     34,
     46
    ],
    "top": 16,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "west-forest-greenhouse",
    "r": [
     4,
     10,
     41,
     46
    ],
    "top": 13,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "west-root-half-crescent",
    "r": [
     1,
     7,
     34,
     37
    ],
    "top": 11,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "northwest-moon-gate-conservatory",
    "r": [
     1,
     16,
     1,
     5
    ],
    "top": 12,
    "shape": "slope",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "greenwood-arched-trunks",
    [
     6,
     13,
     2,
     4,
     13,
     18
    ],
    "builtin:wood"
   ],
   [
    "livingwood-bloom-dryers",
    [
     37,
     44,
     2,
     4,
     8,
     13
    ],
    "pack4:057"
   ],
   [
    "fae-coppice-cart-bay",
    [
     40,
     47,
     2,
     3,
     36,
     40
    ],
    "pack2:013"
   ],
   [
    "fae-west-crescent-racks",
    [
     2,
     6,
     2,
     3,
     35,
     37
    ],
    "pack4:057"
   ],
   [
    "moon-arch-livingwood-vault",
    [
     3,
     10,
     2,
     3,
     2,
     4
    ],
    "pack4:057"
   ]
  ],
  "partitions": [
   [
    "arboretum-groove-partition",
    [
     7,
     7,
     2,
     7,
     19,
     25
    ],
    "pack2:015"
   ],
   [
    "canopy-drainage-workwall",
    [
     45,
     45,
     2,
     6,
     38,
     43
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    7,
    2,
    22,
    "wood-root-corner"
   ],
   [
    48,
    2,
    38,
    "sporebridge-post"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 8,
  "dependency": "biome130:096 physical livingwood not approved, no active sapling growth, magic tool power or harvesting"
 },
 {
  "type": "lumberyard",
  "biome": "mountain",
  "size": "small",
  "w": 29,
  "d": 32,
  "h": 35,
  "aisle": 13,
  "westX": 8,
  "westZ": 18,
  "eastX": 23,
  "eastZ": 9,
  "midZ": 16,
  "title": "split granite shelf logging store with a high northern clifftop beam cradle and a recessed south-side rope-loading bay",
  "west": "granite cut beam cellar",
  "east": "narrow cantilever transfer-shed",
  "yard": "rock cliff two-wide freight ledge",
  "mask": [
   [
    11,
    18,
    0,
    31
   ],
   [
    2,
    11,
    7,
    23
   ],
   [
    19,
    27,
    4,
    13
   ],
   [
    21,
    28,
    23,
    29
   ],
   [
    2,
    8,
    1,
    5
   ],
   [
    0,
    4,
    24,
    31
   ]
  ],
  "roofs": [
   {
    "name": "granite-cradle-terrace",
    "r": [
     3,
     10,
     8,
     21
    ],
    "top": 19,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "rope-cantilever-store",
    "r": [
     20,
     26,
     5,
     12
    ],
    "top": 14,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south-cliff-lean",
    "r": [
     22,
     27,
     24,
     28
    ],
    "top": 12,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "rock-timber-beam-pile",
    [
     4,
     7,
     2,
     4,
     10,
     13
    ],
    "builtin:wood"
   ],
   [
    "cliff-wrapped-logs",
    [
     21,
     24,
     2,
     3,
     6,
     9
    ],
    "pack4:057"
   ],
   [
    "stone-ledge-transfer",
    [
     22,
     26,
     2,
     2,
     25,
     27
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "cut-stone-groove",
    [
     5,
     5,
     2,
     6,
     15,
     18
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    3,
    2,
    16,
    "granite-clip-anchor"
   ],
   [
    25,
    2,
    9,
    "rope-tie-stanchion"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 11,
  "dependency": "biome130:098 future cliff footings, no running rope or load-bearing native mountain terrain tests"
 },
 {
  "type": "lumberyard",
  "biome": "mountain",
  "size": "medium",
  "w": 41,
  "d": 38,
  "h": 39,
  "aisle": 20,
  "westX": 13,
  "westZ": 17,
  "eastX": 33,
  "eastZ": 28,
  "midZ": 19,
  "title": "highland quarry port with off-axis northwest ravine retaining bench, deep left shed and twin granite cargo terraces",
  "west": "west overburden log chamber",
  "east": "east two-tier crated timber transfer",
  "yard": "high ridge granite cargo run",
  "mask": [
   [
    18,
    25,
    0,
    37
   ],
   [
    2,
    18,
    3,
    27
   ],
   [
    27,
    38,
    9,
    31
   ],
   [
    3,
    12,
    32,
    37
   ],
   [
    32,
    40,
    1,
    7
   ],
   [
    0,
    6,
    16,
    27
   ],
   [
    0,
    10,
    0,
    10
   ]
  ],
  "roofs": [
   {
    "name": "cliff-retaining-deep-saw",
    "r": [
     3,
     16,
     4,
     25
    ],
    "top": 21,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east-granite-cross-gallery",
    "r": [
     28,
     37,
     10,
     28
    ],
    "top": 17,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "north-high-ridge-portico",
    "r": [
     33,
     39,
     2,
     6
    ],
    "top": 13,
    "shape": "flat",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "northwest-retaining-bench",
    "r": [
     1,
     8,
     2,
     5
    ],
    "top": 13,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "moraine-rough-sawn-logs",
    [
     5,
     12,
     2,
     4,
     7,
     12
    ],
    "builtin:wood"
   ],
   [
    "quarry-boat-crates",
    [
     30,
     35,
     2,
     4,
     13,
     17
    ],
    "pack4:057"
   ],
   [
    "cliffhead-loading-stone",
    [
     33,
     38,
     2,
     2,
     3,
     5
    ],
    "pack1:007"
   ],
   [
    "northern-cliff-timber-stack",
    [
     2,
     6,
     2,
     3,
     2,
     4
    ],
    "builtin:wood"
   ]
  ],
  "partitions": [
   [
    "stone-log-split",
    [
     7,
     7,
     2,
     6,
     15,
     22
    ],
    "pack1:010"
   ],
   [
    "rail-ridge-screen",
    [
     36,
     36,
     2,
     5,
     16,
     24
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    5,
    2,
    21,
    "stone-retaining-foot"
   ],
   [
    35,
    2,
    25,
    "switchback-rail-anchor"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 11,
  "dependency": "biome130:098 physical cliff bolts unregistered; quarry rail, powered saw and terrain collision not active"
 }
];
const millPlans=[
 {
  "type": "mill",
  "biome": "temperate",
  "size": "medium",
  "w": 42,
  "d": 39,
  "h": 37,
  "aisle": 20,
  "westX": 12,
  "westZ": 17,
  "eastX": 33,
  "eastZ": 29,
  "midZ": 19,
  "title": "split river millhall with off-site southeast floating-log lock, long grain cathedral and independently covered sluice",
  "west": "graded grain receiving nave",
  "east": "separate sluice and shaft service hall",
  "yard": "two-wide stone millstone transfer quay",
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
    8,
    33
   ],
   [
    4,
    12,
    32,
    38
   ],
   [
    35,
    41,
    1,
    7
   ],
   [
    0,
    6,
    24,
    30
   ],
   [
    36,
    41,
    33,
    38
   ]
  ],
  "roofs": [
   {
    "name": "grain-cathedral-cross",
    "r": [
     3,
     16,
     4,
     22
    ],
    "top": 18,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "sluice-sawloft",
    "r": [
     29,
     38,
     9,
     30
    ],
    "top": 15,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "upstream-wheel-portico",
    "r": [
     36,
     40,
     2,
     6
    ],
    "top": 15,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east-canal-lock",
    "r": [
     37,
     40,
     34,
     37
    ],
    "top": 12,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "western-grain-bin-chests",
    [
     5,
     12,
     2,
     4,
     7,
     11
    ],
    "pack4:057"
   ],
   [
    "river-axle-stone-seats",
    [
     31,
     36,
     2,
     4,
     12,
     16
    ],
    "pack1:010"
   ],
   [
    "flour-crate-loading",
    [
     32,
     37,
     2,
     3,
     28,
     31
    ],
    "pack1:007"
   ],
   [
    "southeast-stone-canal-bearings",
    [
     38,
     40,
     2,
     3,
     35,
     37
    ],
    "pack1:010"
   ]
  ],
  "partitions": [
   [
    "west-grain-sorting",
    [
     7,
     7,
     2,
     7,
     13,
     20
    ],
    "pack2:015"
   ],
   [
    "sluice-wheel-division",
    [
     37,
     37,
     2,
     6,
     17,
     25
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    5,
    2,
    20,
    "granary-buttress"
   ],
   [
    36,
    2,
    27,
    "waterwheel-bearing"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 9,
  "dependency": "Water currents, turning wheel, power gearing and actual flour production are symbolic; numerical pack states unresolved"
 },
 {
  "type": "mill",
  "biome": "temperate",
  "size": "large",
  "w": 56,
  "d": 49,
  "h": 46,
  "aisle": 27,
  "westX": 17,
  "westZ": 18,
  "eastX": 43,
  "eastZ": 35,
  "midZ": 23,
  "title": "floodplain imperial grainworks with west canal lock and an uninterrupted eastern drive-train hall linking tall turbine and packing vaults",
  "west": "grain grading long cloister",
  "east": "hydraulic mill drive and packing production hall",
  "yard": "wide two-track watergrain freight atrium",
  "mask": [
   [
    24,
    32,
    0,
    48
   ],
   [
    3,
    24,
    5,
    29
   ],
   [
    34,
    53,
    3,
    19
   ],
   [
    39,
    55,
    31,
    46
   ],
   [
    2,
    14,
    39,
    48
   ],
   [
    11,
    21,
    1,
    4
   ],
   [
    50,
    55,
    20,
    28
   ],
   [
    0,
    10,
    30,
    40
   ],
   [
    32,
    55,
    19,
    32
   ]
  ],
  "roofs": [
   {
    "name": "imperial-grain-cross-vault",
    "r": [
     4,
     22,
     6,
     26
    ],
    "top": 22,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "north-wheelhouse-saw",
    "r": [
     35,
     51,
     4,
     18
    ],
    "top": 19,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "southern-stone-hall",
    "r": [
     40,
     54,
     32,
     44
    ],
    "top": 17,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "riverside-export-office",
    "r": [
     3,
     12,
     41,
     46
    ],
    "top": 13,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "west-canal-quern-service",
    "r": [
     1,
     8,
     32,
     37
    ],
    "top": 13,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east-continuous-gear-train-arcade",
    "r": [
     35,
     52,
     22,
     29
    ],
    "top": 15,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "great-grain-bulk-vault",
    [
     6,
     15,
     2,
     5,
     9,
     15
    ],
    "pack4:057"
   ],
   [
    "underwheel-stone-drive",
    [
     39,
     47,
     2,
     5,
     8,
     13
    ],
    "pack1:010"
   ],
   [
    "flour-customs-depot",
    [
     43,
     49,
     2,
     4,
     35,
     40
    ],
    "pack1:007"
   ],
   [
    "western-quern-groove-stone",
    [
     2,
     6,
     2,
     3,
     33,
     36
    ],
    "pack1:007"
   ],
   [
    "drive-train-bearings",
    [
     38,
     45,
     2,
     4,
     24,
     27
    ],
    "pack1:010"
   ]
  ],
  "partitions": [
   [
    "grain-quality-verifier",
    [
     8,
     8,
     2,
     8,
     18,
     24
    ],
    "pack2:015"
   ],
   [
    "wheel-shaft-protection",
    [
     49,
     49,
     2,
     8,
     10,
     16
    ],
    "pack1:002"
   ],
   [
    "east-gear-maintenance-screen",
    [
     45,
     45,
     2,
     5,
     22,
     28
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    6,
    2,
    20,
    "riverfront-grain-support"
   ],
   [
    50,
    2,
    36,
    "southern-flour-plinth"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack1:002",
  "roofWallHeight": 11,
  "dependency": "Turbines, grain economy, powered waterwheel, physical family collider selection and real lake levels not implemented"
 },
 {
  "type": "mill",
  "biome": "desert",
  "size": "small",
  "w": 28,
  "d": 29,
  "h": 31,
  "aisle": 13,
  "westX": 8,
  "westZ": 12,
  "eastX": 22,
  "eastZ": 22,
  "midZ": 16,
  "title": "earthen Z-court dategrain quernhouse with separate wind-facing baking vault and rear reed storage pier",
  "west": "sandproof dategrain store",
  "east": "quern and windshaft casement",
  "yard": "low shade-baffled millstone loading court",
  "mask": [
   [
    11,
    17,
    0,
    28
   ],
   [
    2,
    11,
    3,
    14
   ],
   [
    19,
    26,
    12,
    26
   ],
   [
    21,
    27,
    2,
    9
   ],
   [
    0,
    6,
    21,
    28
   ]
  ],
  "roofs": [
   {
    "name": "drydate-grain-flat",
    "r": [
     3,
     10,
     4,
     13
    ],
    "top": 13,
    "shape": "flat",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "windshaft-south-terrace",
    "r": [
     20,
     25,
     13,
     25
    ],
    "top": 17,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "east-north-vent-pavilion",
    "r": [
     22,
     26,
     3,
     8
    ],
    "top": 12,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "covered-dategrain-crates",
    [
     4,
     8,
     2,
     4,
     6,
     9
    ],
    "pack4:057"
   ],
   [
    "desert-quern-stonepair",
    [
     21,
     24,
     2,
     4,
     17,
     20
    ],
    "pack1:007"
   ],
   [
    "windshaft-brace-stones",
    [
     23,
     25,
     2,
     3,
     4,
     7
    ],
    "pack1:010"
   ]
  ],
  "partitions": [
   [
    "dategrain-salt-screen",
    [
     5,
     5,
     2,
     5,
     10,
     12
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    4,
    2,
    10,
    "sunproof-mill-stanchion"
   ],
   [
    24,
    2,
    22,
    "quern-vent"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 8,
  "dependency": "biome130:006 sand physical geometry unapproved; windshaft drive, dategrain harvesting and wind turbine not active"
 },
 {
  "type": "mill",
  "biome": "desert",
  "size": "large",
  "w": 53,
  "d": 47,
  "h": 43,
  "aisle": 25,
  "westX": 15,
  "westZ": 17,
  "eastX": 42,
  "eastZ": 34,
  "midZ": 22,
  "title": "great desert windmill caravansary with detached tilted-quern hall, west cooling maze and three high wind galleries",
  "west": "three-bay grain cistern palace",
  "east": "overhead windward mill vault",
  "yard": "four-way axle stonework transfer spine",
  "mask": [
   [
    22,
    31,
    0,
    46
   ],
   [
    3,
    22,
    6,
    23
   ],
   [
    31,
    50,
    3,
    18
   ],
   [
    2,
    14,
    32,
    45
   ],
   [
    36,
    51,
    29,
    45
   ],
   [
    11,
    21,
    0,
    5
   ],
   [
    48,
    52,
    20,
    27
   ]
  ],
  "roofs": [
   {
    "name": "grain-cistern-long-gable",
    "r": [
     4,
     20,
     7,
     21
    ],
    "top": 20,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "windmill-gear-terrace",
    "r": [
     32,
     48,
     4,
     17
    ],
    "top": 22,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "rear-drycaravan-arch",
    "r": [
     37,
     50,
     30,
     43
    ],
    "top": 18,
    "shape": "saw",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "cooling-maze-flat",
    "r": [
     3,
     12,
     34,
     43
    ],
    "top": 12,
    "shape": "flat",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "stored-grain-trading-bales",
    [
     6,
     12,
     2,
     5,
     10,
     15
    ],
    "pack4:057"
   ],
   [
    "stone-axle-wind-seats",
    [
     35,
     43,
     2,
     5,
     8,
     12
    ],
    "pack1:010"
   ],
   [
    "caravan-quern-export",
    [
     39,
     46,
     2,
     3,
     34,
     39
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "cistern-cool-partition",
    [
     8,
     8,
     2,
     7,
     15,
     20
    ],
    "pack1:002"
   ],
   [
    "windmill-gearing-brace",
    [
     46,
     46,
     2,
     7,
     10,
     16
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    6,
    2,
    18,
    "cistern-shade-rib"
   ],
   [
    47,
    2,
    39,
    "caravan-granary-anchor"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "dependency": "biome130:006 material cells unresolved; large windmill sails, water reserves and grain processing are nonfunctional"
 },
 {
  "type": "mill",
  "biome": "snow",
  "size": "small",
  "w": 31,
  "d": 29,
  "h": 33,
  "aisle": 14,
  "westX": 8,
  "westZ": 17,
  "eastX": 24,
  "eastZ": 10,
  "midZ": 14,
  "title": "winter ice-quern with asymmetrical west frost tunnels and independent eastern protected millstone loft",
  "west": "frostgrain warm-free vault",
  "east": "separate glacial stone bearing hall",
  "yard": "sheltered frost sluice crossing",
  "mask": [
   [
    12,
    19,
    0,
    28
   ],
   [
    2,
    12,
    9,
    26
   ],
   [
    21,
    28,
    3,
    14
   ],
   [
    1,
    8,
    1,
    7
   ],
   [
    23,
    30,
    21,
    28
   ]
  ],
  "roofs": [
   {
    "name": "winter-frostgrain-cross",
    "r": [
     3,
     11,
     10,
     24
    ],
    "top": 17,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "icequern-wheelhouse",
    "r": [
     22,
     27,
     4,
     13
    ],
    "top": 15,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack2:022"
   },
   {
    "name": "snow-loading-lean",
    "r": [
     24,
     29,
     22,
     27
    ],
    "top": 11,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "freezeproof-grain-pods",
    [
     4,
     7,
     2,
     4,
     12,
     16
    ],
    "pack4:057"
   ],
   [
    "packed-icequern-base",
    [
     23,
     26,
     2,
     3,
     6,
     9
    ],
    "pack1:007"
   ],
   [
    "sled-flour-export",
    [
     25,
     28,
     2,
     2,
     23,
     25
    ],
    "pack1:010"
   ]
  ],
  "partitions": [
   [
    "winter-storage-ridge",
    [
     5,
     5,
     2,
     5,
     18,
     21
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    4,
    2,
    21,
    "grain-frost-baffle"
   ],
   [
    26,
    2,
    10,
    "quern-shaft-prop"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "dependency": "biome130:094 thermal material unregistered, no frozen-water hydraulics, grain heating or powered shaft"
 },
 {
  "type": "mill",
  "biome": "snow",
  "size": "large",
  "w": 54,
  "d": 49,
  "h": 47,
  "aisle": 26,
  "westX": 16,
  "westZ": 19,
  "eastX": 43,
  "eastZ": 35,
  "midZ": 24,
  "title": "great glacier grain-hall with avalanche windbreak, northern frost wheelhouse and completely separate southern snow-quern",
  "west": "deep glacial granary chamber",
  "east": "winter headrace and two-level milling sheds",
  "yard": "raised cargo spine between protective snow vaults",
  "mask": [
   [
    23,
    32,
    0,
    48
   ],
   [
    3,
    23,
    4,
    28
   ],
   [
    32,
    50,
    7,
    20
   ],
   [
    36,
    52,
    31,
    45
   ],
   [
    4,
    12,
    38,
    48
   ],
   [
    44,
    53,
    0,
    5
   ],
   [
    0,
    8,
    27,
    37
   ]
  ],
  "roofs": [
   {
    "name": "frostgrain-high-cross",
    "r": [
     4,
     21,
     5,
     26
    ],
    "top": 24,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "north-glacial-wheel-terrace",
    "r": [
     33,
     49,
     8,
     19
    ],
    "top": 21,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south-snowmill-gable",
    "r": [
     37,
     51,
     32,
     43
    ],
    "top": 20,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack2:022"
   },
   {
    "name": "icewind-staging-flat",
    "r": [
     5,
     11,
     40,
     46
    ],
    "top": 14,
    "shape": "flat",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "icegrain-stored-crates",
    [
     6,
     14,
     2,
     5,
     8,
     13
    ],
    "pack4:057"
   ],
   [
    "frozen-headrace-axles",
    [
     36,
     44,
     2,
     5,
     10,
     15
    ],
    "pack1:010"
   ],
   [
    "snowflour-freight-ramp",
    [
     40,
     47,
     2,
     3,
     35,
     40
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "icegranary-thermobaffle",
    [
     8,
     8,
     2,
     8,
     15,
     21
    ],
    "pack1:002"
   ],
   [
    "wheelhouse-frost-room",
    [
     46,
     46,
     2,
     6,
     12,
     17
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    7,
    2,
    18,
    "avalanche-bearing"
   ],
   [
    48,
    2,
    38,
    "winter-mill-buttress"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "dependency": "biome130:094 insulated walls unregistered; flowing ice, headrace mill and snow wind systems unavailable"
 },
 {
  "type": "mill",
  "biome": "enchanted-forest",
  "size": "small",
  "w": 32,
  "d": 30,
  "h": 31,
  "aisle": 15,
  "westX": 9,
  "westZ": 13,
  "eastX": 25,
  "eastZ": 22,
  "midZ": 15,
  "title": "fairywood single-mill moonlit granary with narrow west root arch, two offset moonwater cisterns and separate stonewood crossing",
  "west": "narrow rootwoven grain vault",
  "east": "moonstone quern atelier",
  "yard": "moonwater transfer ring",
  "mask": [
   [
    13,
    20,
    0,
    29
   ],
   [
    2,
    13,
    3,
    18
   ],
   [
    22,
    30,
    11,
    26
   ],
   [
    2,
    9,
    23,
    28
   ],
   [
    27,
    31,
    2,
    8
   ],
   [
    0,
    5,
    18,
    24
   ]
  ],
  "roofs": [
   {
    "name": "rootgrain-twisted-cross",
    "r": [
     3,
     11,
     4,
     17
    ],
    "top": 16,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "moonquern-slope",
    "r": [
     23,
     29,
     12,
     24
    ],
    "top": 15,
    "shape": "slope",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "early-moonwater-garden",
    "r": [
     28,
     30,
     3,
     7
    ],
    "top": 12,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "fae-grain-cabinet",
    [
     4,
     8,
     2,
     4,
     6,
     10
    ],
    "pack4:057"
   ],
   [
    "luminous-quern-plinth",
    [
     24,
     27,
     2,
     3,
     15,
     19
    ],
    "pack1:007"
   ],
   [
    "mycelium-seed-dryer",
    [
     28,
     30,
     2,
     3,
     4,
     6
    ],
    "pack2:013"
   ]
  ],
  "partitions": [
   [
    "mythgrain-root-screen",
    [
     5,
     5,
     2,
     5,
     11,
     14
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    5,
    2,
    16,
    "livingwood-arch-base"
   ],
   [
    28,
    2,
    20,
    "moonwater-cistern-mount"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 7,
  "dependency": "biome130:096 physical livingwood unregistered; fungal grain, moonwater and rune grindstone not active"
 },
 {
  "type": "mill",
  "biome": "mountain",
  "size": "medium",
  "w": 43,
  "d": 40,
  "h": 42,
  "aisle": 21,
  "westX": 14,
  "westZ": 18,
  "eastX": 35,
  "eastZ": 30,
  "midZ": 21,
  "title": "ridgehead cliffstone mill with western cut-rock grain transept and two unequal headrace stone vaults",
  "west": "granite grain sorting transept",
  "east": "hydraulic-free highland millstone plinth",
  "yard": "high-headrace stone-grain freight groove",
  "mask": [
   [
    19,
    26,
    0,
    39
   ],
   [
    3,
    19,
    5,
    26
   ],
   [
    28,
    40,
    4,
    17
   ],
   [
    31,
    42,
    25,
    37
   ],
   [
    2,
    9,
    1,
    4
   ],
   [
    0,
    6,
    27,
    37
   ]
  ],
  "roofs": [
   {
    "name": "highland-grain-terrace",
    "r": [
     4,
     17,
     6,
     24
    ],
    "top": 23,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "north-hydraulic-gable",
    "r": [
     29,
     39,
     5,
     16
    ],
    "top": 20,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "lower-granite-axle-saw",
    "r": [
     32,
     41,
     26,
     36
    ],
    "top": 17,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "moraine-grainstone-bins",
    [
     5,
     12,
     2,
     5,
     9,
     13
    ],
    "pack4:057"
   ],
   [
    "headrace-stone-guides",
    [
     31,
     37,
     2,
     4,
     7,
     12
    ],
    "pack1:010"
   ],
   [
    "highland-flour-loading",
    [
     34,
     39,
     2,
     3,
     29,
     32
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "cliffgrain-retaining-wall",
    [
     7,
     7,
     2,
     7,
     14,
     19
    ],
    "pack1:002"
   ],
   [
    "mill-axle-service-split",
    [
     37,
     37,
     2,
     6,
     28,
     33
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    5,
    2,
    18,
    "mountain-cutstone-anchor"
   ],
   [
    39,
    2,
    32,
    "headrace-brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "dependency": "biome130:098 mounting family unregistered; flowing highland water, millwheel and terrain attachment remain symbolic"
 }
];
function create(p){
 const {w,d,h,aisle,westX,westZ,eastX,eastZ,midZ}=p;
 const id=assertSlot(p.type,p.biome,p.size,2),shape=new Set();
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
 const result={id,type:p.type,biome:p.biome,size:p.size,variant:2,status:'theoretical',activated:false,
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
  implementation:'3B_THEORETICAL_VARIANT2_ONLY: no world placements, saves, biome registration, powered mills or harvesting'};
 validateBlueprint(result,ASSET_CATALOG);
 return result;
}
const plans=[...lumberPlans,...millPlans];
const bySlot=new Map(plans.map(p=>[p.type+':'+p.biome+':'+p.size,p]));
export function createVariant2CompletionBlueprint(type,biome,size,variant=2){
 if(variant!==2)throw new RangeError('Only specifically authored variant 2 belongs to this independent batch');
 const p=bySlot.get(type+':'+biome+':'+size);
 if(!p)throw new RangeError('Unwritten variant-2 architecture '+[type,biome,size].join(':'));
 return create(p);
}
export function createVariant2CompletionPool(){return plans.map(create);}
