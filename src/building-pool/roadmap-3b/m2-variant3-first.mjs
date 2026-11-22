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
  "size": "small",
  "w": 32,
  "d": 34,
  "h": 30,
  "aisle": 15,
  "westX": 8,
  "westZ": 21,
  "eastX": 26,
  "eastZ": 12,
  "midZ": 16,
  "title": "canal-lock spoke timber station with an oblique western timber loft, a projecting east boat-hoist and detached downstream carthouse",
  "west": "raftwright drying loft",
  "east": "downstream swing-boom works",
  "yard": "through-spine boatlock timber yard",
  "mask": [
   [
    13,
    19,
    0,
    33
   ],
   [
    2,
    13,
    13,
    29
   ],
   [
    22,
    29,
    3,
    18
   ],
   [
    23,
    31,
    24,
    32
   ],
   [
    0,
    7,
    1,
    9
   ]
  ],
  "roofs": [
   {
    "name": "cantilever-log-longhall",
    "r": [
     3,
     11,
     15,
     28
    ],
    "top": 14,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east-boat-crane-porch",
    "r": [
     23,
     28,
     5,
     17
    ],
    "top": 12,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "downstream-cart-gable",
    "r": [
     24,
     30,
     25,
     31
    ],
    "top": 13,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "upstream-canal-hut",
    "r": [
     1,
     6,
     2,
     7
    ],
    "top": 10,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "kiln-dried-beam-shelves",
    [
     4,
     8,
     2,
     4,
     18,
     21
    ],
    "builtin:wood"
   ],
   [
    "river-hoist-spare-wood",
    [
     25,
     27,
     2,
     3,
     8,
     11
    ],
    "pack2:013"
   ],
   [
    "downstream-cart-crates",
    [
     26,
     29,
     2,
     3,
     27,
     29
    ],
    "pack4:057"
   ]
  ],
  "partitions": [
   [
    "rafting-storage-rib",
    [
     5,
     5,
     2,
     6,
     22,
     25
    ],
    "pack2:015"
   ],
   [
    "east-boom-brace",
    [
     26,
     26,
     2,
     5,
     12,
     15
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    5,
    2,
    18,
    "river-pier-timber-heel"
   ],
   [
    28,
    2,
    28,
    "cart-hoist-sill"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 6,
  "dependency": "No moving river/raft or saw animation; actual family variant, orientation and multi-cell load clearance pending"
 },
 {
  "type": "lumberyard",
  "biome": "desert",
  "size": "large",
  "w": 57,
  "d": 48,
  "h": 42,
  "aisle": 28,
  "westX": 18,
  "westZ": 15,
  "eastX": 44,
  "eastZ": 35,
  "midZ": 23,
  "title": "cloistered ochre-oasis timber exchange with a C-shaped western cooling court, paired eastern sun-kilns and northern camel port",
  "west": "three-arcade sun-cured timber cloister",
  "east": "paired independent caravan beam warehouses",
  "yard": "oasis columned two-track freight court",
  "mask": [
   [
    25,
    33,
    0,
    47
   ],
   [
    2,
    25,
    2,
    23
   ],
   [
    35,
    54,
    10,
    26
   ],
   [
    38,
    55,
    32,
    46
   ],
   [
    5,
    18,
    34,
    45
   ],
   [
    43,
    56,
    0,
    7
   ],
   [
    0,
    8,
    24,
    34
   ]
  ],
  "roofs": [
   {
    "name": "west-sun-vault",
    "r": [
     3,
     22,
     3,
     12
    ],
    "top": 15,
    "shape": "saw",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "sun-recess-court",
    "r": [
     5,
     13,
     15,
     22
    ],
    "top": 14,
    "shape": "flat",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east-timber-thermal-gallery",
    "r": [
     36,
     52,
     11,
     24
    ],
    "top": 20,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "late-afternoon-export-arch",
    "r": [
     40,
     54,
     34,
     44
    ],
    "top": 15,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "ochre-beam-drying-racks",
    [
     5,
     14,
     2,
     4,
     5,
     8
    ],
    "builtin:wood"
   ],
   [
    "caravan-carved-wood-loads",
    [
     39,
     48,
     2,
     4,
     14,
     18
    ],
    "pack4:057"
   ],
   [
    "south-dune-freight-terrace",
    [
     43,
     51,
     2,
     3,
     36,
     40
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "wind-loom-west",
    [
     6,
     6,
     2,
     7,
     16,
     20
    ],
    "pack1:010"
   ],
   [
    "sun-kiln-camber-wall",
    [
     49,
     49,
     2,
     7,
     17,
     22
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    8,
    2,
    18,
    "adobe-shade-foot"
   ],
   [
    51,
    2,
    38,
    "quern-trade-column"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "dependency": "No caravan trade, powered timber dryer or oasis water; biome130:006 future material placement symbolic only"
 },
 {
  "type": "lumberyard",
  "biome": "snow",
  "size": "medium",
  "w": 43,
  "d": 41,
  "h": 41,
  "aisle": 21,
  "westX": 13,
  "westZ": 26,
  "eastX": 35,
  "eastZ": 13,
  "midZ": 20,
  "title": "avalanche-dodging glacial shed network with a widened northwest angled freight bastion, east ice-chute and southern sled freight crescent",
  "west": "subsnow deep beam vault",
  "east": "ice-chute export loading house",
  "yard": "north-to-south sled switching trench",
  "mask": [
   [
    18,
    26,
    0,
    40
   ],
   [
    2,
    18,
    16,
    35
   ],
   [
    29,
    40,
    4,
    21
   ],
   [
    32,
    42,
    28,
    39
   ],
   [
    1,
    9,
    2,
    11
   ],
   [
    0,
    8,
    34,
    40
   ],
   [
    0,
    16,
    0,
    13
   ]
  ],
  "roofs": [
   {
    "name": "deep-frostbeam-crossvault",
    "r": [
     3,
     16,
     18,
     33
    ],
    "top": 21,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "elevated-icechute-terrace",
    "r": [
     30,
     39,
     5,
     20
    ],
    "top": 23,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "backstop-sled-slope",
    "r": [
     33,
     41,
     29,
     37
    ],
    "top": 14,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "northwest-ice-picket",
    "r": [
     2,
     8,
     3,
     9
    ],
    "top": 12,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack2:022"
   },
   {
    "name": "nw-avalanche-sled-bastion",
    "r": [
     1,
     13,
     1,
     9
    ],
    "top": 13,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "subsnow-iced-timbers",
    [
     5,
     11,
     2,
     5,
     20,
     25
    ],
    "builtin:wood"
   ],
   [
    "northeast-sled-shafts",
    [
     33,
     37,
     2,
     4,
     8,
     12
    ],
    "pack4:057"
   ],
   [
    "snowchute-liner-rails",
    [
     35,
     40,
     2,
     3,
     31,
     35
    ],
    "pack1:010"
   ],
   [
    "northwest-avalanche-rack",
    [
     3,
     10,
     2,
     3,
     4,
     8
    ],
    "builtin:wood"
   ]
  ],
  "partitions": [
   [
    "winter-snowbrake",
    [
     6,
     6,
     2,
     8,
     26,
     31
    ],
    "pack1:002"
   ],
   [
    "sled-switch-rail",
    [
     37,
     37,
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
    "ice-frost-kiln-support"
   ],
   [
    39,
    2,
    34,
    "downhill-sled-bollard"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 11,
  "dependency": "biome130:094 cold-storage material unresolved, no avalanches, sled power, ice drift or harvestable logs"
 },
 {
  "type": "lumberyard",
  "biome": "enchanted-forest",
  "size": "small",
  "w": 34,
  "d": 33,
  "h": 34,
  "aisle": 16,
  "westX": 10,
  "westZ": 17,
  "eastX": 27,
  "eastZ": 25,
  "midZ": 14,
  "title": "twilight rootwheel saw kiosk with a narrow NW arboreal arch, independent southern fungal dome and a hollow fairy-ring timber dock",
  "west": "woodroot drying nave",
  "east": "independent spore-cargo cenotaph",
  "yard": "fae-ring exposed timber transfer",
  "mask": [
   [
    14,
    21,
    0,
    32
   ],
   [
    3,
    14,
    3,
    21
   ],
   [
    23,
    32,
    17,
    31
   ],
   [
    0,
    9,
    26,
    32
   ],
   [
    25,
    33,
    0,
    8
   ],
   [
    1,
    8,
    11,
    16
   ]
  ],
  "roofs": [
   {
    "name": "rootwheel-narrow-vault",
    "r": [
     4,
     12,
     4,
     20
    ],
    "top": 18,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "spore-cenotaph-domed-roof",
    "r": [
     24,
     31,
     19,
     29
    ],
    "top": 15,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "northern-faelanding-rail",
    "r": [
     26,
     32,
     2,
     7
    ],
    "top": 11,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "fungal-side-cloister",
    "r": [
     1,
     7,
     27,
     31
    ],
    "top": 12,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "moonwood-jointed-beams",
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
    "fungal-glowboard-stock",
    [
     26,
     30,
     2,
     3,
     21,
     25
    ],
    "pack2:013"
   ],
   [
    "sporewood-basket-rack",
    [
     27,
     31,
     2,
     3,
     3,
     6
    ],
    "pack4:057"
   ]
  ],
  "partitions": [
   [
    "fae-woodgrain-aisle",
    [
     6,
     6,
     2,
     6,
     12,
     17
    ],
    "pack2:015"
   ],
   [
    "spore-drying-screen",
    [
     29,
     29,
     2,
     5,
     24,
     27
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    7,
    2,
    17,
    "lunar-arch-brace"
   ],
   [
    30,
    2,
    26,
    "mycelium-pier-foot"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 7,
  "dependency": "biome130:096 physical livingwood unregistered; growing roots, interacting spore boards and powered saws not implemented"
 },
 {
  "type": "lumberyard",
  "biome": "mountain",
  "size": "large",
  "w": 59,
  "d": 52,
  "h": 47,
  "aisle": 30,
  "westX": 20,
  "westZ": 21,
  "eastX": 47,
  "eastZ": 39,
  "midZ": 24,
  "title": "glacierhead split stone-timber citadel with northwest ridge cradle, stacked east cliff lifting gallery and asymmetrically enclosed south switchback",
  "west": "three-aisle cliff timber-grading hall",
  "east": "canted mountain-rail freight foundry",
  "yard": "granite high-load twin-track central cut",
  "mask": [
   [
    27,
    35,
    0,
    51
   ],
   [
    4,
    27,
    5,
    28
   ],
   [
    37,
    57,
    4,
    19
   ],
   [
    39,
    58,
    31,
    50
   ],
   [
    2,
    17,
    40,
    51
   ],
   [
    0,
    11,
    1,
    5
   ],
   [
    52,
    58,
    21,
    28
   ]
  ],
  "roofs": [
   {
    "name": "west-ridge-heavy-cross",
    "r": [
     5,
     25,
     7,
     26
    ],
    "top": 25,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "northeast-beam-lift-terrace",
    "r": [
     38,
     55,
     5,
     18
    ],
    "top": 22,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "southern-cliff-cable-yard",
    "r": [
     40,
     56,
     33,
     48
    ],
    "top": 19,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "overburden-switchback-bridge",
    "r": [
     3,
     15,
     42,
     49
    ],
    "top": 14,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "ridge-hewn-log-beams",
    [
     7,
     15,
     2,
     5,
     10,
     15
    ],
    "builtin:wood"
   ],
   [
    "highcliff-wood-crates",
    [
     40,
     50,
     2,
     5,
     9,
     14
    ],
    "pack4:057"
   ],
   [
    "cable-rail-stone-joints",
    [
     44,
     53,
     2,
     3,
     37,
     44
    ],
    "pack1:010"
   ]
  ],
  "partitions": [
   [
    "ridge-cut-retaining-panel",
    [
     8,
     8,
     2,
     9,
     16,
     23
    ],
    "pack1:002"
   ],
   [
    "cable-load-column",
    [
     51,
     51,
     2,
     9,
     38,
     44
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    9,
    2,
    20,
    "cliff-load-bearing-seat"
   ],
   [
    54,
    2,
    43,
    "cable-turning-post"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "dependency": "biome130:098 future terrain anchors, cliff attachment and cable hoist physics not implemented"
 }
];
const millPlans=[
 {
  "type": "mill",
  "biome": "temperate",
  "size": "medium",
  "w": 45,
  "d": 42,
  "h": 43,
  "aisle": 22,
  "westX": 13,
  "westZ": 27,
  "eastX": 36,
  "eastZ": 12,
  "midZ": 21,
  "title": "tidal grist mill split by a long open watercourse, western stone quern basilica and northeast twin-granary grain exchange",
  "west": "watercourse-side grain milling transept",
  "east": "raised headrace and dual grain packing vault",
  "yard": "two-track streamwall receiving nave",
  "mask": [
   [
    20,
    28,
    0,
    41
   ],
   [
    3,
    20,
    14,
    35
   ],
   [
    30,
    43,
    2,
    21
   ],
   [
    31,
    44,
    29,
    40
   ],
   [
    0,
    12,
    0,
    8
   ],
   [
    0,
    8,
    33,
    41
   ]
  ],
  "roofs": [
   {
    "name": "west-watergrain-basilica",
    "r": [
     4,
     18,
     16,
     32
    ],
    "top": 20,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "high-northeast-wheelloft",
    "r": [
     31,
     41,
     3,
     19
    ],
    "top": 21,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "southern-flour-packery",
    "r": [
     32,
     42,
     31,
     38
    ],
    "top": 13,
    "shape": "slope",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "northwest-merchant-saw",
    "r": [
     1,
     10,
     1,
     6
    ],
    "top": 11,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "long-west-grain-trough",
    [
     6,
     12,
     2,
     4,
     19,
     24
    ],
    "pack4:057"
   ],
   [
    "tidal-axle-stone-vault",
    [
     34,
     39,
     2,
     5,
     7,
     12
    ],
    "pack1:010"
   ],
   [
    "south-flour-pallet-hall",
    [
     34,
     40,
     2,
     4,
     33,
     36
    ],
    "pack2:013"
   ]
  ],
  "partitions": [
   [
    "quern-grain-sorting-rib",
    [
     7,
     7,
     2,
     8,
     24,
     29
    ],
    "pack2:015"
   ],
   [
    "tidal-axle-maintenance",
    [
     40,
     40,
     2,
     8,
     10,
     16
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    7,
    2,
    27,
    "floodplain-quern-brace"
   ],
   [
    40,
    2,
    35,
    "flour-bay-backstop"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 9,
  "dependency": "No tides or waterwheel physics, grain processing or actual per-cell manual-family variant selection"
 },
 {
  "type": "mill",
  "biome": "desert",
  "size": "small",
  "w": 32,
  "d": 31,
  "h": 34,
  "aisle": 16,
  "westX": 9,
  "westZ": 13,
  "eastX": 26,
  "eastZ": 24,
  "midZ": 14,
  "title": "old-dune earthen quern court with a separate broad southwest wind gallery and dual northeast stone drive pavilions",
  "west": "northwest palmseed grain vault",
  "east": "arched sandproof quern and wind-drive annex",
  "yard": "sunlit sandstone grinding courtyard",
  "mask": [
   [
    14,
    20,
    0,
    30
   ],
   [
    2,
    14,
    2,
    19
   ],
   [
    22,
    30,
    16,
    29
   ],
   [
    1,
    8,
    24,
    30
   ],
   [
    24,
    31,
    1,
    11
   ],
   [
    0,
    11,
    20,
    30
   ]
  ],
  "roofs": [
   {
    "name": "sandgrain-low-cross",
    "r": [
     3,
     12,
     3,
     18
    ],
    "top": 14,
    "shape": "cross",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "south-shaft-terrace",
    "r": [
     23,
     29,
     18,
     27
    ],
    "top": 17,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "north-trade-wind-saw",
    "r": [
     25,
     30,
     2,
     9
    ],
    "top": 12,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "southwest-windscoop-transept",
    "r": [
     1,
     9,
     23,
     28
    ],
    "top": 12,
    "shape": "slope",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "palm-seed-bundle-crates",
    [
     5,
     10,
     2,
     3,
     5,
     9
    ],
    "pack4:057"
   ],
   [
    "sun-quern-bearings",
    [
     24,
     27,
     2,
     4,
     20,
     23
    ],
    "pack1:007"
   ],
   [
    "north-trade-grain-bales",
    [
     26,
     29,
     2,
     3,
     4,
     7
    ],
    "pack1:010"
   ],
   [
    "southwest-dategrain-brick-rack",
    [
     3,
     7,
     2,
     3,
     24,
     27
    ],
    "pack4:057"
   ]
  ],
  "partitions": [
   [
    "dategrain-shade-screen",
    [
     7,
     7,
     2,
     6,
     12,
     16
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    6,
    2,
    13,
    "grind-sunrib"
   ],
   [
    28,
    2,
    23,
    "quern-bearing-foot"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 7,
  "dependency": "biome130:006 candidate sand not final; real windmill rotors and date-grain mechanics absent"
 },
 {
  "type": "mill",
  "biome": "snow",
  "size": "large",
  "w": 59,
  "d": 53,
  "h": 48,
  "aisle": 28,
  "westX": 19,
  "westZ": 21,
  "eastX": 46,
  "eastZ": 37,
  "midZ": 25,
  "title": "four-hall glacial mill abbey with a high western furnace-granary, northeast enclosed ice turbine and southern stepped snowquern",
  "west": "deep insulated grain vault and dry milling nave",
  "east": "staggered headrace shaft and frostrim packery",
  "yard": "avalanche-protected two-wide cold cargo street",
  "mask": [
   [
    25,
    33,
    0,
    52
   ],
   [
    3,
    25,
    5,
    29
   ],
   [
    36,
    56,
    3,
    20
   ],
   [
    37,
    57,
    31,
    51
   ],
   [
    2,
    15,
    39,
    52
   ],
   [
    0,
    9,
    1,
    6
   ],
   [
    50,
    58,
    22,
    28
   ]
  ],
  "roofs": [
   {
    "name": "deep-icegrain-cathedral",
    "r": [
     4,
     23,
     6,
     27
    ],
    "top": 26,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "frost-high-axle-gable",
    "r": [
     37,
     54,
     4,
     19
    ],
    "top": 23,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack2:022"
   },
   {
    "name": "southern-avalanche-shelf",
    "r": [
     38,
     55,
     33,
     49
    ],
    "top": 19,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "winter-flour-guardhouse",
    "r": [
     3,
     13,
     41,
     49
    ],
    "top": 15,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "deep-winter-grain-sacks",
    [
     6,
     15,
     2,
     5,
     10,
     16
    ],
    "pack4:057"
   ],
   [
    "frost-axle-granite-seats",
    [
     39,
     49,
     2,
     5,
     7,
     13
    ],
    "pack1:010"
   ],
   [
    "snowflour-haul-cases",
    [
     41,
     51,
     2,
     4,
     36,
     43
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "thermowall-insulation-baffle",
    [
     9,
     9,
     2,
     9,
     18,
     24
    ],
    "pack1:002"
   ],
   [
    "upper-headrace-gear-split",
    [
     51,
     51,
     2,
     8,
     11,
     17
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    9,
    2,
    21,
    "winter-bearing-foot"
   ],
   [
    52,
    2,
    42,
    "avalanche-mill-buttress"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "dependency": "biome130:094 insulation unregistered; glacial physics, water and powered grinding absent"
 },
 {
  "type": "mill",
  "biome": "enchanted-forest",
  "size": "medium",
  "w": 43,
  "d": 44,
  "h": 40,
  "aisle": 21,
  "westX": 13,
  "westZ": 18,
  "eastX": 35,
  "eastZ": 31,
  "midZ": 24,
  "title": "hollow moonwater grain spirallock with two offset livingwood chapels, separate east crystal axle and western storage terrace",
  "west": "enchanted moonseed grain vault",
  "east": "leaf-glyph axle shrine and rune grain store",
  "yard": "hollow-lit double-root milling conduit",
  "mask": [
   [
    19,
    26,
    0,
    43
   ],
   [
    3,
    19,
    3,
    27
   ],
   [
    29,
    41,
    10,
    22
   ],
   [
    31,
    42,
    30,
    42
   ],
   [
    0,
    9,
    32,
    42
   ],
   [
    29,
    42,
    1,
    6
   ]
  ],
  "roofs": [
   {
    "name": "mythgrain-west-chapel",
    "r": [
     4,
     17,
     5,
     25
    ],
    "top": 20,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "moon-axle-crescent-saw",
    "r": [
     30,
     40,
     11,
     21
    ],
    "top": 19,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south-moonstone-cloister",
    "r": [
     32,
     41,
     32,
     40
    ],
    "top": 16,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "moonwater-record-nook",
    "r": [
     1,
     8,
     35,
     40
    ],
    "top": 12,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "rootgrain-archive-bins",
    [
     6,
     12,
     2,
     5,
     9,
     14
    ],
    "pack4:057"
   ],
   [
    "moonstone-rune-axle",
    [
     32,
     38,
     2,
     4,
     14,
     18
    ],
    "pack1:007"
   ],
   [
    "moonwater-flour-nook",
    [
     34,
     39,
     2,
     3,
     35,
     39
    ],
    "pack2:013"
   ]
  ],
  "partitions": [
   [
    "livingwood-rune-screen",
    [
     8,
     8,
     2,
     7,
     15,
     22
    ],
    "pack2:015"
   ],
   [
    "mythgrain-chapel-buttress",
    [
     37,
     37,
     2,
     6,
     35,
     39
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    8,
    2,
    19,
    "moonseed-twisted-foot"
   ],
   [
    39,
    2,
    38,
    "rune-axle-holding-stone"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 9,
  "dependency": "biome130:096 still future-only, no moonwater flow, livingwood growth or rune mill shaft mechanics"
 },
 {
  "type": "mill",
  "biome": "mountain",
  "size": "small",
  "w": 34,
  "d": 35,
  "h": 38,
  "aisle": 17,
  "westX": 10,
  "westZ": 20,
  "eastX": 27,
  "eastZ": 12,
  "midZ": 18,
  "title": "tight cliffside granite quern pass with west grain alcove, independent cantilevered east axle and rear stone flour crane",
  "west": "cliffgrain wet-free storeroom",
  "east": "high stone rotary axle chamber",
  "yard": "rock-cut two-wide mill pass",
  "mask": [
   [
    15,
    21,
    0,
    34
   ],
   [
    2,
    15,
    13,
    28
   ],
   [
    24,
    32,
    4,
    17
   ],
   [
    25,
    33,
    26,
    33
   ],
   [
    0,
    8,
    1,
    8
   ]
  ],
  "roofs": [
   {
    "name": "west-cliffgranary-terrace",
    "r": [
     3,
     13,
     15,
     26
    ],
    "top": 20,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east-axle-slope",
    "r": [
     25,
     31,
     5,
     16
    ],
    "top": 17,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "rear-millstone-lean",
    "r": [
     26,
     32,
     27,
     32
    ],
    "top": 13,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "stonegrain-short-bins",
    [
     4,
     9,
     2,
     5,
     17,
     21
    ],
    "pack4:057"
   ],
   [
    "granite-grind-axle-bearing",
    [
     26,
     29,
     2,
     4,
     8,
     12
    ],
    "pack1:010"
   ],
   [
    "cliff-flour-handcart",
    [
     27,
     31,
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
    "granite-quern-maintenance-wall",
    [
     5,
     5,
     2,
     6,
     22,
     26
    ],
    "pack1:002"
   ]
  ],
  "details": [
   [
    6,
    2,
    23,
    "cliff-grain-buttress"
   ],
   [
    30,
    2,
    12,
    "mountain-axle-sill"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 11,
  "dependency": "biome130:098 physical cliff anchors unregistered; real millwheel, granite cliff coupling and power absent"
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
export function createVariant3FirstBlueprint(type,biome,size,variant=3){
 if(variant!==3)throw new RangeError('Only specifically authored variant 3 belongs to this independent batch');
 const p=bySlot.get(type+':'+biome+':'+size);
 if(!p)throw new RangeError('Unwritten variant-3 architecture '+[type,biome,size].join(':'));
 return create(p);
}
export function createVariant3FirstPool(){return plans.map(create);}
