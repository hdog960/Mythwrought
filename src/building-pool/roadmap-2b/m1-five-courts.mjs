import {SCHEMA,validateBlueprint} from './schema.mjs';
// Five original coordinate-authored, structurally different M1 architecture programs.
// Fixed source-coordinate occupied voxel definitions; no procedural seed and no world placement.
const A={stone:'pack1:002',path:'pack1:005',stair:'pack1:008',
 wood:'pack2:013',beam:'pack2:015',post:'pack2:022',
 roof:'pack3:023',snow:'pack3:025',leaf:'pack3:026',
 glass:'pack4:030',frame:'pack4:032',lamp:'pack4:035',
 crate:'pack4:057',seat:'pack4:058',table:'pack4:059',
 counter:'pack5:086',display:'pack5:087',altar:'pack5:093'};
const DESIGNS=[
 {
  "category": "market-square",
  "biome": "desert",
  "size": "large",
  "variation": 2,
  "title": "Qamar Split-Court Caravan Exchange",
  "w": 45,
  "d": 41,
  "h": 15,
  "plan": [
   [
    0,
    44,
    0,
    12
   ],
   [
    0,
    11,
    13,
    40
   ],
   [
    33,
    44,
    13,
    40
   ],
   [
    12,
    32,
    31,
    40
   ]
  ],
  "entry": [
   22,
   0
  ],
  "sky": [
   [
    16,
    28,
    3,
    10
   ]
  ],
  "partitions": [
   [
    "z",
    13,
    1,
    10,
    [
     6
    ]
   ],
   [
    "z",
    13,
    34,
    43,
    [
     39
    ]
   ],
   [
    "x",
    12,
    32,
    39,
    [
     35
    ]
   ],
   [
    "x",
    32,
    32,
    39,
    [
     35
    ]
   ]
  ],
  "furnishing": [
   [
    5,
    5,
    "display",
    "desert-pottery-merchant"
   ],
   [
    39,
    5,
    "display",
    "caravan-spice-trade"
   ],
   [
    22,
    10,
    "counter",
    "courtyard-trade-desk"
   ],
   [
    5,
    20,
    "table",
    "western-pavilion-trade"
   ],
   [
    8,
    34,
    "crate",
    "sheltered-caravan-stock"
   ],
   [
    39,
    22,
    "display",
    "eastern-silk-market"
   ],
   [
    36,
    35,
    "table",
    "copper-weighing-station"
   ],
   [
    20,
    37,
    "table",
    "rear-caravan-ledger"
   ],
   [
    25,
    37,
    "seat",
    "broker-seating"
   ],
   [
    29,
    35,
    "lamp",
    "rear-night-navigation",
    "decor"
   ]
  ],
  "mass": [
   [
    2,
    10,
    17,
    29,
    8,
    "stone",
    "west-shaded-spice-galerie"
   ],
   [
    5,
    7,
    19,
    27,
    9,
    "roof",
    "west-wind-ridge"
   ],
   [
    34,
    42,
    17,
    29,
    8,
    "stone",
    "east-high-cloth-galerie"
   ],
   [
    38,
    40,
    19,
    27,
    9,
    "roof",
    "east-striped-crest"
   ],
   [
    14,
    30,
    33,
    39,
    8,
    "roof",
    "rear-ledger-crossbridge"
   ],
   [
    20,
    24,
    35,
    37,
    9,
    "stone",
    "rear-broker-high-dome"
   ],
   [
    3,
    10,
    2,
    6,
    8,
    "roof",
    "low-west-trade-sunshade"
   ]
  ],
  "rooms": [
   [
    "Open front caravan trading court",
    [
     "square",
     "public-circulation"
    ],
    [
     1,
     43,
     1,
     12
    ]
   ],
   [
    "Long west independent vendor cloister",
    [
     "vendor-stalls"
    ],
    [
     1,
     10,
     14,
     39
    ]
   ],
   [
    "East protected textile and weighing hall",
    [
     "weighing-gallery"
    ],
    [
     34,
     43,
     14,
     39
    ]
   ],
   [
    "Rear upper caravan accounting gallery",
    [
     "ledger-room"
    ],
    [
     13,
     31,
     32,
     39
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "square",
    "public south gate"
   ],
   [
    "square",
    "public-circulation",
    "front shaded arcade"
   ],
   [
    "public-circulation",
    "vendor-stalls",
    "west guarded entrance x6,z13"
   ],
   [
    "public-circulation",
    "weighing-gallery",
    "east guarded entrance x39,z13"
   ],
   [
    "vendor-stalls",
    "ledger-room",
    "crossbridge west gate x12,z35"
   ]
  ],
  "targets": [
   [
    "public square",
    22,
    8
   ],
   [
    "west vendor lane",
    6,
    25
   ],
   [
    "east weighing",
    39,
    25
   ],
   [
    "rear accounting",
    22,
    36
   ]
  ],
  "features": [
   "square",
   "vendor-stalls",
   "public-circulation",
   "weighing-gallery",
   "ledger-room"
  ],
  "signature": "large four-sided oasis market with 378 physically missing central foundation columns, unequal twin shaded trading wings and walkable crosswise rear accounting bridge"
 },
 {
  "category": "tailor",
  "biome": "mountain",
  "size": "medium",
  "variation": 2,
  "title": "Ironridge Offset-Loft Clothworks",
  "w": 37,
  "d": 37,
  "h": 15,
  "plan": [
   [
    10,
    27,
    0,
    36
   ],
   [
    0,
    36,
    11,
    22
   ],
   [
    0,
    10,
    23,
    34
   ]
  ],
  "entry": [
   18,
   0
  ],
  "sky": [
   [
    15,
    22,
    3,
    8
   ]
  ],
  "partitions": [
   [
    "x",
    10,
    12,
    21,
    [
     17
    ]
   ],
   [
    "x",
    27,
    12,
    21,
    [
     17
    ]
   ],
   [
    "z",
    23,
    11,
    26,
    [
     18
    ]
   ],
   [
    "x",
    10,
    24,
    33,
    [
     29
    ]
   ]
  ],
  "furnishing": [
   [
    14,
    5,
    "display",
    "cliff-wool-bolts"
   ],
   [
    23,
    7,
    "display",
    "goat-felt-stacks"
   ],
   [
    18,
    10,
    "counter",
    "shepherd-tailor-counter"
   ],
   [
    5,
    15,
    "seat",
    "private-stone-fitting"
   ],
   [
    8,
    20,
    "display",
    "mountain-mantle-gallery"
   ],
   [
    33,
    16,
    "table",
    "handloom-workbench"
   ],
   [
    30,
    20,
    "table",
    "dye-planning"
   ],
   [
    18,
    28,
    "table",
    "rear-cutting-worktable"
   ],
   [
    23,
    31,
    "crate",
    "loom-thread-store"
   ],
   [
    7,
    31,
    "crate",
    "cold-weather-fabric"
   ],
   [
    4,
    30,
    "lamp",
    "annex-safety-beacon",
    "decor"
   ]
  ],
  "mass": [
   [
    1,
    9,
    13,
    21,
    8,
    "stone",
    "west-fitting-cliff-gallery"
   ],
   [
    4,
    6,
    15,
    19,
    9,
    "roof",
    "west-narrow-fitted-ridge"
   ],
   [
    28,
    35,
    13,
    21,
    8,
    "stone",
    "east-dye-bay"
   ],
   [
    30,
    32,
    15,
    19,
    9,
    "roof",
    "east-dye-exhaust-gable"
   ],
   [
    12,
    25,
    25,
    35,
    8,
    "wood",
    "long-upper-spinning-loft"
   ],
   [
    17,
    19,
    28,
    33,
    9,
    "roof",
    "north-central-high-spindle"
   ],
   [
    2,
    8,
    25,
    33,
    8,
    "wood",
    "offset-west-wool-store"
   ],
   [
    4,
    6,
    27,
    31,
    9,
    "roof",
    "far-west-annex-crest"
   ],
   [
    11,
    14,
    2,
    7,
    8,
    "roof",
    "short-forward-weatherhood"
   ]
  ],
  "rooms": [
   [
    "Central narrow mountain sales nave",
    [
     "sales-floor",
     "service-counter",
     "garment-display"
    ],
    [
     11,
     26,
     1,
     22
    ]
   ],
   [
    "West private shepherd fitting",
    [
     "fitting-area"
    ],
    [
     1,
     9,
     12,
     21
    ]
   ],
   [
    "East dye and pattern cutting gallery",
    [
     "cutting-area"
    ],
    [
     28,
     35,
     12,
     21
    ]
   ],
   [
    "Long rear elevated loom workroom",
    [
     "weaving-loft"
    ],
    [
     11,
     26,
     24,
     35
    ]
   ],
   [
    "Westward asymmetric raw-wool annexe",
    [
     "storage-room"
    ],
    [
     1,
     9,
     24,
     33
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "southern lintel"
   ],
   [
    "sales-floor",
    "fitting-area",
    "left gate x10,z17"
   ],
   [
    "sales-floor",
    "cutting-area",
    "right gate x27,z17"
   ],
   [
    "sales-floor",
    "weaving-loft",
    "north gate x18,z23"
   ],
   [
    "fitting-area",
    "storage-room",
    "west annexe gated x10,z29"
   ]
  ],
  "targets": [
   [
    "shop nave",
    18,
    8
   ],
   [
    "west private fitting",
    5,
    17
   ],
   [
    "east dye tables",
    32,
    18
   ],
   [
    "northern loom",
    18,
    31
   ],
   [
    "west wool annexe",
    5,
    29
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "garment-display",
   "fitting-area",
   "cutting-area",
   "weaving-loft",
   "storage-room"
  ],
  "signature": "offset true cross plus west rear crooked wool annexe, deliberately empty cliff corner blocks and independently elevated slate-and-wood spinning roofs"
 },
 {
  "category": "butcher",
  "biome": "snow",
  "size": "medium",
  "variation": 2,
  "title": "Whiteglen Triple-Arm Smokehouse",
  "w": 39,
  "d": 35,
  "h": 14,
  "plan": [
   [
    0,
    38,
    0,
    12
   ],
   [
    0,
    12,
    13,
    34
   ],
   [
    22,
    38,
    13,
    24
   ],
   [
    13,
    21,
    25,
    34
   ]
  ],
  "entry": [
   19,
   0
  ],
  "sky": [
   [
    16,
    22,
    3,
    8
   ]
  ],
  "partitions": [
   [
    "z",
    13,
    1,
    11,
    [
     6
    ]
   ],
   [
    "z",
    13,
    23,
    37,
    [
     30
    ]
   ],
   [
    "x",
    13,
    26,
    33,
    [
     29
    ]
   ]
  ],
  "furnishing": [
   [
    10,
    5,
    "counter",
    "winter-public-salted-meat"
   ],
   [
    29,
    5,
    "counter",
    "snow-game-market"
   ],
   [
    19,
    10,
    "display",
    "preserved-fish-display"
   ],
   [
    4,
    19,
    "crate",
    "ice-packed-meat"
   ],
   [
    7,
    30,
    "crate",
    "north-west-frozen-larder"
   ],
   [
    30,
    18,
    "table",
    "clean-stone-cleaver"
   ],
   [
    36,
    20,
    "table",
    "sanitary-work-bench"
   ],
   [
    18,
    29,
    "table",
    "private-smoke-curing"
   ],
   [
    17,
    33,
    "lamp",
    "rear-smokehouse-vent-lamp",
    "decor"
   ]
  ],
  "mass": [
   [
    2,
    11,
    17,
    33,
    8,
    "snow",
    "west-deep-frost-cellar"
   ],
   [
    5,
    7,
    20,
    30,
    9,
    "roof",
    "west-snow-trap-ridge"
   ],
   [
    23,
    37,
    16,
    23,
    8,
    "snow",
    "east-fresh-cutting-pavilion"
   ],
   [
    29,
    31,
    18,
    21,
    9,
    "roof",
    "east-ventilated-butchery-crest"
   ],
   [
    15,
    20,
    27,
    33,
    8,
    "wood",
    "rear-connected-smokehouse"
   ],
   [
    17,
    18,
    29,
    31,
    9,
    "roof",
    "rear-vertical-smoke-vent"
   ],
   [
    2,
    13,
    2,
    6,
    8,
    "snow",
    "west-winter-market-porch"
   ]
  ],
  "rooms": [
   [
    "South public whiteglen butcher storefront",
    [
     "sales-floor",
     "service-counter"
    ],
    [
     1,
     37,
     1,
     12
    ]
   ],
   [
    "West deep insulated meat and coldhouse",
    [
     "cold-storage"
    ],
    [
     1,
     11,
     14,
     33
    ]
   ],
   [
    "East separated clean butcher workshop",
    [
     "butcher-workspace"
    ],
    [
     23,
     37,
     14,
     23
    ]
   ],
   [
    "Rear narrow connected salting smokehouse",
    [
     "curing-area"
    ],
    [
     14,
     20,
     26,
     33
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "south snow entrance"
   ],
   [
    "sales-floor",
    "cold-storage",
    "west sliding cold doorway x6,z13"
   ],
   [
    "sales-floor",
    "butcher-workspace",
    "east hygiene door x30,z13"
   ],
   [
    "cold-storage",
    "curing-area",
    "guarded return hatch x13,z29"
   ]
  ],
  "targets": [
   [
    "retail meat",
    19,
    8
   ],
   [
    "cold larder",
    6,
    24
   ],
   [
    "clean workspace",
    30,
    20
   ],
   [
    "rear smokehouse",
    17,
    30
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "butcher-workspace",
   "cold-storage",
   "curing-area"
  ],
  "signature": "asymmetric triple-prong butcher with no phantom center floor, one severed right branch and short independently connected rear smoker entered through a side passage"
 },
 {
  "category": "bookshop",
  "biome": "desert",
  "size": "medium",
  "variation": 2,
  "title": "Sunspoke Crescent Archive",
  "w": 39,
  "d": 39,
  "h": 15,
  "plan": [
   [
    0,
    38,
    0,
    13
   ],
   [
    0,
    13,
    14,
    38
   ],
   [
    24,
    38,
    14,
    38
   ],
   [
    14,
    23,
    30,
    38
   ]
  ],
  "entry": [
   19,
   0
  ],
  "sky": [
   [
    15,
    23,
    3,
    8
   ]
  ],
  "partitions": [
   [
    "z",
    14,
    1,
    12,
    [
     6
    ]
   ],
   [
    "z",
    14,
    25,
    37,
    [
     31
    ]
   ],
   [
    "x",
    14,
    31,
    37,
    [
     34
    ]
   ],
   [
    "x",
    23,
    31,
    37,
    [
     34
    ]
   ]
  ],
  "furnishing": [
   [
    5,
    5,
    "display",
    "sandstone-catalogue"
   ],
   [
    33,
    5,
    "display",
    "travel-chronicles"
   ],
   [
    19,
    11,
    "counter",
    "scholarly-order-desk"
   ],
   [
    5,
    22,
    "crate",
    "cool-library-parchment"
   ],
   [
    9,
    34,
    "display",
    "protected-older-scripts"
   ],
   [
    31,
    22,
    "seat",
    "reading-mashrabiya"
   ],
   [
    35,
    30,
    "seat",
    "east-garden-study"
   ],
   [
    19,
    33,
    "table",
    "rare-map-preservation"
   ],
   [
    18,
    36,
    "crate",
    "manuscript-cache"
   ],
   [
    27,
    37,
    "lamp",
    "rear-archive-safe-light",
    "decor"
   ]
  ],
  "mass": [
   [
    2,
    12,
    18,
    37,
    8,
    "stone",
    "west-sunshield-storage-wing"
   ],
   [
    5,
    7,
    21,
    34,
    9,
    "roof",
    "west-vent-roof-crown"
   ],
   [
    25,
    37,
    18,
    37,
    8,
    "roof",
    "east-reading-mashrabiya"
   ],
   [
    30,
    32,
    21,
    34,
    9,
    "roof",
    "east-high-reading-ridge"
   ],
   [
    15,
    22,
    32,
    37,
    8,
    "stone",
    "rear-rare-script-bridge"
   ],
   [
    17,
    20,
    34,
    36,
    9,
    "roof",
    "small-rear-scribe-cupola"
   ],
   [
    2,
    13,
    2,
    7,
    8,
    "roof",
    "western-low-book-market-awning"
   ]
  ],
  "rooms": [
   [
    "South covered book bazaar",
    [
     "sales-floor",
     "service-counter",
     "bookshelves"
    ],
    [
     1,
     37,
     1,
     13
    ]
   ],
   [
    "West ink-cooled document preservation",
    [
     "stockroom"
    ],
    [
     1,
     12,
     15,
     37
    ]
   ],
   [
    "East light-filled private reading cloister",
    [
     "reading-area"
    ],
    [
     25,
     37,
     15,
     37
    ]
   ],
   [
    "North rear crosswise secret-script gallery",
    [
     "manuscript-room"
    ],
    [
     15,
     22,
     31,
     37
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "sunward bookstore entrance"
   ],
   [
    "sales-floor",
    "stockroom",
    "west preservation door x6,z14"
   ],
   [
    "sales-floor",
    "reading-area",
    "east reader threshold x31,z14"
   ],
   [
    "stockroom",
    "manuscript-room",
    "back left gate x14,z34"
   ],
   [
    "reading-area",
    "manuscript-room",
    "back right gate x23,z34"
   ]
  ],
  "targets": [
   [
    "book catalog",
    19,
    9
   ],
   [
    "west archive",
    6,
    26
   ],
   [
    "east study",
    31,
    26
   ],
   [
    "rear documents",
    19,
    34
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "bookshelves",
   "reading-area",
   "stockroom",
   "manuscript-room"
  ],
  "signature": "independent mid-size sun crescent archive with genuine vacant central courtyard ring, two different height reading/storage wings and enclosed north rare-script connector"
 },
 {
  "category": "theater",
  "biome": "temperate",
  "size": "large",
  "variation": 2,
  "title": "Rainbridge Staggered Opera House",
  "w": 47,
  "d": 43,
  "h": 16,
  "plan": [
   [
    0,
    46,
    0,
    10
   ],
   [
    4,
    42,
    11,
    30
   ],
   [
    15,
    31,
    31,
    42
   ],
   [
    0,
    11,
    20,
    34
   ],
   [
    35,
    46,
    19,
    31
   ]
  ],
  "entry": [
   23,
   0
  ],
  "sky": [
   [
    13,
    34,
    13,
    27
   ]
  ],
  "partitions": [
   [
    "z",
    32,
    16,
    30,
    [
     20,
     26
    ]
   ]
  ],
  "furnishing": [
   [
    8,
    5,
    "counter",
    "left-entry-ticket-window"
   ],
   [
    38,
    5,
    "counter",
    "right-entry-ticket-window"
   ],
   [
    23,
    8,
    "display",
    "opera-performance-programme"
   ],
   [
    8,
    15,
    "seat",
    "west-audience-row"
   ],
   [
    12,
    21,
    "seat",
    "western-lower-gallery"
   ],
   [
    38,
    15,
    "seat",
    "east-audience-row"
   ],
   [
    35,
    24,
    "seat",
    "east-upper-gallery"
   ],
   [
    20,
    38,
    "crate",
    "stage-properties"
   ],
   [
    27,
    38,
    "table",
    "backstage-costumes"
   ],
   [
    5,
    28,
    "crate",
    "side-greenroom-equipment"
   ],
   [
    41,
    26,
    "seat",
    "musician-rest-seats"
   ],
   [
    5,
    30,
    "lamp",
    "left-wing-backstage-light",
    "decor"
   ]
  ],
  "stage": [
   17,
   29,
   28,
   30
  ],
  "posts": [
   [
    15,
    29
   ],
   [
    31,
    29
   ],
   [
    16,
    33
   ],
   [
    30,
    33
   ]
  ],
  "mass": [
   [
    2,
    10,
    2,
    8,
    8,
    "wood",
    "separate-entry-west-lantern-roof"
   ],
   [
    36,
    44,
    2,
    8,
    8,
    "wood",
    "separate-entry-east-lantern-roof"
   ],
   [
    5,
    11,
    19,
    29,
    8,
    "wood",
    "projection-west-greenroom-roof"
   ],
   [
    8,
    10,
    22,
    27,
    9,
    "roof",
    "west-greenroom-gable"
   ],
   [
    36,
    41,
    18,
    28,
    8,
    "roof",
    "projection-east-musician-roof"
   ],
   [
    38,
    40,
    21,
    26,
    9,
    "wood",
    "east-musician-crest"
   ],
   [
    16,
    30,
    33,
    41,
    8,
    "roof",
    "high-backed-costume-gallery"
   ],
   [
    20,
    26,
    36,
    39,
    9,
    "roof",
    "rear-opera-fly-loft"
   ],
   [
    15,
    31,
    28,
    30,
    8,
    "wood",
    "real-covered-stage-overhang"
   ],
   [
    21,
    25,
    29,
    29,
    9,
    "roof",
    "raised-proscenium-keystone"
   ]
  ],
  "rooms": [
   [
    "Open rainbridge terraced audience",
    [
     "audience-area",
     "public-circulation"
    ],
    [
     5,
     41,
     11,
     29
    ]
   ],
   [
    "Real elevated central performance platform",
    [
     "stage"
    ],
    [
     17,
     29,
     28,
     30
    ]
   ],
   [
    "Rear sealed wardrobe and costume corridor",
    [
     "backstage"
    ],
    [
     16,
     30,
     33,
     41
    ]
   ],
   [
    "West offset private company greenroom",
    [
     "green-room"
    ],
    [
     1,
     10,
     21,
     33
    ]
   ],
   [
    "East staggered musician rehearsal lodge",
    [
     "music-gallery"
    ],
    [
     36,
     45,
     20,
     30
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "public-circulation",
    "double ticketed south arcade"
   ],
   [
    "public-circulation",
    "audience-area",
    "central open spectator court"
   ],
   [
    "public-circulation",
    "stage",
    "physical stair geometry unresolved"
   ],
   [
    "public-circulation",
    "backstage",
    "two guarded rear stage-side portals x20 and x26,z32"
   ],
   [
    "public-circulation",
    "green-room",
    "west side gallery"
   ],
   [
    "public-circulation",
    "music-gallery",
    "east side gallery"
   ]
  ],
  "targets": [
   [
    "public audience",
    23,
    20
   ],
   [
    "stage side approach",
    14,
    29
   ],
   [
    "backstage costumes",
    23,
    37
   ],
   [
    "west greenroom",
    7,
    26
   ],
   [
    "east musician gallery",
    40,
    24
   ]
  ],
  "stairs": [
   [
    15,
    30
   ],
   [
    31,
    30
   ]
  ],
  "features": [
   "stage",
   "audience-area",
   "backstage",
   "public-circulation",
   "green-room",
   "music-gallery"
  ],
  "signature": "large five-part asymmetric staggered opera ground with detached front gate projections, actual central unroofed auditorium, raised stage, supported forest of overhangs and two independent greenroom and musician side halls"
 }
];
function author(s){
 const inside=(x,z)=>x>=0&&z>=0&&x<s.w&&z<s.d&&s.plan.some(([a,b,c,d])=>x>=a&&x<=b&&z>=c&&z<=d);
 const cells=new Map(),key=(x,y,z)=>x+','+y+','+z;
 const put=(x,y,z,material,kind,meta={})=>{
  if(!inside(x,z)||y<0||y>=s.h||cells.has(key(x,y,z)))
   throw Error(s.title+' invalid or overlapping source voxel '+key(x,y,z));
  cells.set(key(x,y,z),{x,y,z,kind,material,...meta});
 };
 for(let x=0;x<s.w;x++)for(let z=0;z<s.d;z++)if(inside(x,z)){
  put(x,0,z,A.stone,'foundation');
  put(x,1,z,x===s.entry[0]?A.path:A.wood,'floor');
 }
 const boundary=[];
 for(let x=0;x<s.w;x++)for(let z=0;z<s.d;z++)if(inside(x,z)&&[[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dz])=>!inside(x+dx,z+dz))){
  boundary.push([x,z]);
  for(let y=2;y<=6;y++)if(!(x===s.entry[0]&&z===s.entry[1]&&y<=4))
   put(x,y,z,A.beam,'wall',{role:'actually-concave-weather-perimeter'});
 }
 for(let i=5;i<boundary.length;i+=9){
  const [x,z]=boundary[i];
  if(x===s.entry[0]&&z===s.entry[1])continue;
  for(const y of [3,4])if(cells.has(key(x,y,z)))
   cells.set(key(x,y,z),{x,y,z,kind:'window',material:y===3?A.glass:A.frame,role:'physical-exterior-window'});
 }
 const skies=(x,z)=>s.sky.some(([a,b,c,d])=>x>=a&&x<=b&&z>=c&&z<=d);
 for(let x=0;x<s.w;x++)for(let z=0;z<s.d;z++)if(inside(x,z)&&!skies(x,z))
  put(x,7,z,s.biome==='snow'?A.snow:s.biome==='enchanted-forest'?A.leaf:A.roof,'roof',{role:'real-concave-supported-weather-roof'});
 const doorPorts=[];
 for(const [axis,n,a,b,doors] of s.partitions){
  for(let q=a;q<=b;q++){
   const x=axis==='z'?q:n,z=axis==='z'?n:q;
   if(!inside(x,z))throw Error('actual architectural division outside plan '+key(x,1,z));
   for(let y=2;y<=5;y++)if(y===5||!doors.includes(q))
    put(x,y,z,A.beam,'wall',{role:'actual-restricted-room-partition'});
  }
  for(const d of doors)doorPorts.push(axis==='z'?[d,n]:[n,d]);
 }
 for(const [x,z]of(s.posts||[]))for(let y=2;y<=6;y++)
  if(!cells.has(key(x,y,z)))put(x,y,z,A.post,'wall',{role:'foundation-bearing-architectural-post'});
 if(s.stage){const [x0,x1,z0,z1]=s.stage;for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
  put(x,2,z,A.wood,'fixture',{role:'raised-original-performance-stage'});
 }
 for(const [x,z,mat,role,kind='fixture']of s.furnishing)
  put(x,2,z,A[mat],kind,{role});
 for(const [x0,x1,z0,z1,y,mat,role]of s.mass)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(!cells.has(key(x,y-1,z)))throw Error('floating upper architectural roof '+role+' '+key(x,y,z));
   put(x,y,z,A[mat],'roof',{role});
  }
 for(const [x,z]of(s.stairs||[]))put(x,2,z,A.stair,'fixture',{role:'symbolic-stage-step',shapeRotationStatus:'unresolved-symbolic'});
 const voxels=[...cells.values()].sort((a,b)=>a.y-b.y||a.z-b.z||a.x-b.x);
 const symbols=[...new Set([...voxels.map(v=>v.material),'pack2:020'])].sort();
 const bp={
  schema:SCHEMA,id:'r2:'+s.category+':'+s.biome+':'+s.size+':'+String(s.variation).padStart(2,'0'),
  category:s.category,biome:s.biome,size:s.size,variation:s.variation,title:s.title,status:'authored-candidate',
  isolated:true,worldPlaced:false,numericIdsAssigned:false,
  extents:{x:s.w,y:s.h,z:s.d},units:'fixed author-authored complete physical occupied-cell architecture; real Pack ABI unresolved',
  architecturalSignature:s.signature,roof:{form:'multiple bespoke elevated supported gables across genuinely nonrectangular occupied ground',biomeSpecific:true},
  footprintRectangles:s.plan.map(([x0,x1,z0,z1])=>({x0,x1,z0,z1})),
  deliberatelyAbsentFootprintCells:s.w*s.d-voxels.filter(v=>v.y===0).length,
  rooms:s.rooms.map(([name,uses,[x0,x1,z0,z1]])=>({name,uses,bounds:{x0,x1,z0,z1}})),
  circulation:s.edges.map(([from,to,via])=>({from,to,via})),features:s.features,
  openings:[{type:'entrance',x:s.entry[0],y:2,z:s.entry[1],clearHeightCells:3,doorSymbol:'pack2:020',doorOpenState:'unverified'},
   ...voxels.filter(v=>v.kind==='window').map(v=>({type:'window',x:v.x,y:v.y,z:v.z,material:v.material})),
   ...doorPorts.map(([x,z])=>({type:'internal-doorway',x,y:2,z,clearHeightCells:3}))],
  routeTargets:s.targets.map(([name,x,z])=>({name,x,z})),
  intentionallyOpenRoof:s.sky.map(([x0,x1,z0,z1])=>({x0,x1,z0,z1})),
  symbolicStairApproaches:(s.stairs||[]).map(([x,z])=>({x,y:2,z,shapeRotationStatus:'unresolved-symbolic'})),
  unresolvedDependencies:symbols.map(ref=>({ref,issue:'Real Pack-family authored variant, orientation/rotation, multi-cell AABB/reservations, collision, weather/lighting, glazing and schema-1 save unresolved'})),
  voxels
 };
 validateBlueprint(bp);return Object.freeze(bp);
}
export const M1_FIVE_COURTS=Object.freeze(DESIGNS.map(author));
