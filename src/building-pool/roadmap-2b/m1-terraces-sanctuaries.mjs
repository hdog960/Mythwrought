import {SCHEMA,validateBlueprint} from './schema.mjs';
// Four entirely different original coordinate-authored, structurally different M1 architecture programs.
// Fixed source-coordinate occupied voxel definitions; no procedural seed and no world placement.
const A={stone:'pack1:002',path:'pack1:005',stair:'pack1:008',
 wood:'pack2:013',beam:'pack2:015',post:'pack2:022',
 roof:'pack3:023',snow:'pack3:025',leaf:'pack3:026',
 glass:'pack4:030',frame:'pack4:032',lamp:'pack4:035',
 crate:'pack4:057',seat:'pack4:058',table:'pack4:059',
 counter:'pack5:086',display:'pack5:087',altar:'pack5:093'};
const DESIGNS=[
 {
  "category": "theater",
  "biome": "mountain",
  "size": "medium",
  "variation": 2,
  "title": "Talusreach Nine-Rock Performance Hall",
  "w": 39,
  "d": 39,
  "h": 17,
  "plan": [
   [
    11,
    27,
    0,
    38
   ],
   [
    0,
    10,
    10,
    26
   ],
   [
    28,
    38,
    15,
    30
   ],
   [
    0,
    10,
    33,
    38
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
  "divide": [
   [
    "x",
    11,
    10,
    26,
    [
     15
    ]
   ],
   [
    "x",
    27,
    15,
    30,
    [
     21
    ]
   ],
   [
    "x",
    11,
    33,
    37,
    [
     35
    ]
   ],
   [
    "z",
    23,
    12,
    26,
    [
     14,
     25
    ]
   ]
  ],
  "stage": [
   16,
   23,
   17,
   22
  ],
  "items": [
   [
    13,
    6,
    "seat",
    "front-queue"
   ],
   [
    25,
    7,
    "seat",
    "gallery-queue"
   ],
   [
    18,
    12,
    "seat",
    "first-audience-row"
   ],
   [
    23,
    14,
    "seat",
    "back-audience-row"
   ],
   [
    5,
    17,
    "table",
    "west-stone-mask-workshop"
   ],
   [
    7,
    24,
    "crate",
    "rock-scene-storage"
   ],
   [
    34,
    25,
    "table",
    "right-musician-score"
   ],
   [
    35,
    29,
    "crate",
    "instrument-cases"
   ],
   [
    19,
    30,
    "table",
    "backstage-lighting"
   ],
   [
    5,
    35,
    "crate",
    "rear-locked-scenery"
   ],
   [
    6,
    37,
    "lamp",
    "scenery-safety-light",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    9,
    12,
    24,
    8,
    "stone",
    "west-rockstage-terrace"
   ],
   [
    3,
    7,
    14,
    22,
    9,
    "roof",
    "west-raked-ledge"
   ],
   [
    4,
    6,
    16,
    19,
    10,
    "stone",
    "alpine-mask-high-ridge"
   ],
   [
    5,
    5,
    17,
    18,
    11,
    "roof",
    "single-ridge-beacon"
   ],
   [
    29,
    37,
    17,
    29,
    8,
    "wood",
    "east-musician-terrace"
   ],
   [
    31,
    35,
    20,
    27,
    9,
    "stone",
    "right-stone-counterroof"
   ],
   [
    32,
    34,
    23,
    25,
    10,
    "roof",
    "right-small-spire"
   ],
   [
    13,
    25,
    26,
    37,
    8,
    "roof",
    "north-backstage-vault"
   ],
   [
    16,
    22,
    29,
    35,
    9,
    "stone",
    "backstage-high-stone"
   ],
   [
    18,
    20,
    31,
    33,
    10,
    "roof",
    "northern-granite-crown"
   ],
   [
    1,
    9,
    34,
    37,
    8,
    "stone",
    "rear-left-scenery-warehouse"
   ],
   [
    3,
    7,
    35,
    36,
    9,
    "roof",
    "rear-rock-gable"
   ],
   [
    4,
    6,
    35,
    36,
    10,
    "stone",
    "far-left-high-arch"
   ],
   [
    12,
    14,
    2,
    7,
    8,
    "wood",
    "offset-ticket-terrace"
   ]
  ],
  "rooms": [
   [
    "Public mountain audience and ticket spine",
    [
     "audience-area",
     "public-circulation"
    ],
    [
     12,
     26,
     1,
     22
    ]
   ],
   [
    "Real raised mountain performance stage",
    [
     "stage"
    ],
    [
     16,
     23,
     17,
     22
    ]
   ],
   [
    "Long west rock-mask construction atelier",
    [
     "scenery-workshop"
    ],
    [
     1,
     9,
     11,
     25
    ]
   ],
   [
    "Tall east orchestral music chamber",
    [
     "music-room"
    ],
    [
     29,
     37,
     16,
     29
    ]
   ],
   [
    "Rear protected scene-changing hall",
    [
     "backstage"
    ],
    [
     12,
     26,
     24,
     37
    ]
   ],
   [
    "Independent left rear props vault",
    [
     "prop-vault"
    ],
    [
     1,
     9,
     34,
     37
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "public-circulation",
    "southern rock hall entrance"
   ],
   [
    "public-circulation",
    "audience-area",
    "public banks"
   ],
   [
    "audience-area",
    "stage",
    "central original timber raised stage"
   ],
   [
    "public-circulation",
    "scenery-workshop",
    "west performer-only hall"
   ],
   [
    "public-circulation",
    "music-room",
    "east protected music gate"
   ],
   [
    "audience-area",
    "backstage",
    "side aisles enter through paired rear gates"
   ],
   [
    "backstage",
    "prop-vault",
    "separate northwest locked supplies"
   ]
  ],
  "targets": [
   [
    "public audience",
    19,
    10
   ],
   [
    "west rock masks",
    5,
    20
   ],
   [
    "east musicians",
    34,
    22
   ],
   [
    "private backstage",
    21,
    31
   ],
   [
    "western prop vault",
    6,
    35
   ]
  ],
  "features": [
   "stage",
   "audience-area",
   "backstage",
   "public-circulation",
   "scenery-workshop",
   "music-room",
   "prop-vault"
  ],
  "signature": "Mountain long axial quarry-theatre with physically raised central stage, opposed jagged mask and instrument wings, separate left deep back storage spur, twin genuine performer aisles and four independent stone ledge ridges plus one narrow y11 crest"
 },
 {
  "category": "theater",
  "biome": "snow",
  "size": "large",
  "variation": 2,
  "title": "Winterspire Six-Wing Ice Opera",
  "w": 49,
  "d": 47,
  "h": 18,
  "plan": [
   [
    15,
    33,
    0,
    46
   ],
   [
    0,
    14,
    9,
    34
   ],
   [
    34,
    48,
    15,
    39
   ],
   [
    0,
    14,
    38,
    46
   ],
   [
    34,
    48,
    42,
    46
   ]
  ],
  "entry": [
   24,
   0
  ],
  "sky": [
   [
    20,
    28,
    3,
    8
   ]
  ],
  "divide": [
   [
    "x",
    15,
    9,
    34,
    [
     16
    ]
   ],
   [
    "x",
    33,
    15,
    39,
    [
     21
    ]
   ],
   [
    "x",
    15,
    38,
    45,
    [
     43
    ]
   ],
   [
    "x",
    33,
    42,
    45,
    [
     44
    ]
   ],
   [
    "z",
    26,
    16,
    32,
    [
     17,
     31
    ]
   ]
  ],
  "stage": [
   20,
   29,
   19,
   25
  ],
  "items": [
   [
    18,
    5,
    "seat",
    "front-snow-bench"
   ],
   [
    30,
    7,
    "seat",
    "opera-ticket"
   ],
   [
    17,
    13,
    "seat",
    "left-audience-row"
   ],
   [
    31,
    14,
    "seat",
    "right-audience-row"
   ],
   [
    7,
    19,
    "table",
    "ice-costume-cutting"
   ],
   [
    11,
    30,
    "crate",
    "costume-trunks"
   ],
   [
    41,
    25,
    "table",
    "strings-tuning"
   ],
   [
    44,
    36,
    "crate",
    "instrument-lockers"
   ],
   [
    24,
    36,
    "table",
    "backstage-frost-controls"
   ],
   [
    7,
    42,
    "crate",
    "west-lighting-stock"
   ],
   [
    41,
    44,
    "crate",
    "east-orchestra-stock"
   ],
   [
    38,
    45,
    "lamp",
    "exit-lamp",
    "decor"
   ]
  ],
  "steps": [
   [
    2,
    13,
    11,
    32,
    8,
    "snow",
    "massive-west-costume-ice-roof"
   ],
   [
    5,
    11,
    15,
    28,
    9,
    "roof",
    "west-arching-frost-gable"
   ],
   [
    7,
    9,
    18,
    25,
    10,
    "snow",
    "deep-snow-high-ridge"
   ],
   [
    8,
    8,
    20,
    22,
    11,
    "roof",
    "ice-opera-west-spire"
   ],
   [
    35,
    47,
    17,
    37,
    8,
    "wood",
    "east-musical-stepped-arcade"
   ],
   [
    38,
    44,
    21,
    34,
    9,
    "snow",
    "east-strings-ridge"
   ],
   [
    40,
    42,
    24,
    30,
    10,
    "roof",
    "violin-frost-crown"
   ],
   [
    41,
    41,
    26,
    28,
    11,
    "snow",
    "east-ice-needle"
   ],
   [
    17,
    31,
    29,
    45,
    8,
    "snow",
    "rear-snowstage-roof"
   ],
   [
    20,
    28,
    32,
    42,
    9,
    "roof",
    "rear-dominant-cold-gable"
   ],
   [
    22,
    26,
    35,
    39,
    10,
    "snow",
    "backstage-crown"
   ],
   [
    23,
    25,
    36,
    38,
    11,
    "roof",
    "backstage-twin-arch"
   ],
   [
    1,
    13,
    40,
    45,
    8,
    "stone",
    "left-rear-costume-store"
   ],
   [
    4,
    10,
    42,
    44,
    9,
    "snow",
    "west-store-snowcap"
   ],
   [
    35,
    47,
    43,
    45,
    8,
    "stone",
    "right-rear-audio-vault"
   ],
   [
    39,
    43,
    44,
    44,
    9,
    "snow",
    "right-rear-short-crest"
   ],
   [
    16,
    19,
    2,
    7,
    8,
    "snow",
    "asymmetric-snow-entry"
   ]
  ],
  "rooms": [
   [
    "South great public winter opera audience",
    [
     "public-circulation",
     "audience-area"
    ],
    [
     16,
     32,
     1,
     25
    ]
   ],
   [
    "Original raised snow opera performance platform",
    [
     "stage"
    ],
    [
     20,
     29,
     19,
     25
    ]
   ],
   [
    "West broad custom costume and mask wing",
    [
     "costume-workshop"
    ],
    [
     1,
     13,
     10,
     33
    ]
   ],
   [
    "East separate orchestral practice hall",
    [
     "orchestra"
    ],
    [
     35,
     47,
     16,
     38
    ]
   ],
   [
    "Center rear protected performer backstage",
    [
     "backstage"
    ],
    [
     16,
     32,
     27,
     45
    ]
   ],
   [
    "Northwest sealed costume requisitions",
    [
     "prop-vault"
    ],
    [
     1,
     13,
     39,
     45
    ]
   ],
   [
    "Northeast independent instrumental archives",
    [
     "score-vault"
    ],
    [
     35,
     47,
     43,
     45
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "public-circulation",
    "front winter market square"
   ],
   [
    "public-circulation",
    "audience-area",
    "both stage aisles"
   ],
   [
    "audience-area",
    "stage",
    "raised wood performance platform"
   ],
   [
    "public-circulation",
    "costume-workshop",
    "west costume security portal"
   ],
   [
    "public-circulation",
    "orchestra",
    "east musician gate"
   ],
   [
    "audience-area",
    "backstage",
    "paired opposite-stage entrances"
   ],
   [
    "backstage",
    "prop-vault",
    "west security store"
   ],
   [
    "backstage",
    "score-vault",
    "east protected score archive"
   ]
  ],
  "targets": [
   [
    "public frost audience",
    24,
    12
   ],
   [
    "west costume shop",
    7,
    22
   ],
   [
    "right orchestra",
    41,
    27
   ],
   [
    "backstage ice",
    24,
    35
   ],
   [
    "costume prop vault",
    8,
    43
   ],
   [
    "right score vault",
    42,
    44
   ]
  ],
  "features": [
   "stage",
   "audience-area",
   "backstage",
   "public-circulation",
   "costume-workshop",
   "orchestra",
   "prop-vault",
   "score-vault"
  ],
  "signature": "Very large snow opera with long central exposed auditorium, real 70-cell raised stage, six staggered climate-sealed arms including paired isolated rear stores, twin accessible staging aisles and multi-spired asymmetrical ice cliff y11 gables"
 },
 {
  "category": "temple",
  "biome": "desert",
  "size": "small",
  "variation": 2,
  "title": "Sundrift Five-Vigil Star Sanctuary",
  "w": 31,
  "d": 33,
  "h": 17,
  "plan": [
   [
    10,
    20,
    0,
    32
   ],
   [
    0,
    9,
    10,
    25
   ],
   [
    21,
    30,
    16,
    26
   ],
   [
    0,
    9,
    28,
    32
   ]
  ],
  "entry": [
   15,
   0
  ],
  "sky": [
   [
    13,
    17,
    3,
    7
   ]
  ],
  "divide": [
   [
    "x",
    10,
    10,
    25,
    [
     16
    ]
   ],
   [
    "x",
    20,
    16,
    26,
    [
     21
    ]
   ],
   [
    "x",
    10,
    28,
    31,
    [
     30
    ]
   ],
   [
    "z",
    25,
    11,
    19,
    [
     15
    ]
   ]
  ],
  "items": [
   [
    12,
    8,
    "seat",
    "pilgrim-prayer"
   ],
   [
    18,
    9,
    "seat",
    "west-morning-vigil"
   ],
   [
    15,
    20,
    "altar",
    "equinox-altar-symbol"
   ],
   [
    4,
    16,
    "table",
    "west-incense-holder"
   ],
   [
    6,
    23,
    "crate",
    "vigil-offerings"
   ],
   [
    26,
    20,
    "altar",
    "east-sealed-relic"
   ],
   [
    27,
    25,
    "lamp",
    "east-relic-lamp",
    "decor"
   ],
   [
    17,
    29,
    "table",
    "north-private-ritual"
   ],
   [
    5,
    30,
    "crate",
    "ancient-votive-store"
   ]
  ],
  "steps": [
   [
    1,
    8,
    12,
    24,
    8,
    "stone",
    "long-west-shade-shelter"
   ],
   [
    3,
    6,
    16,
    22,
    9,
    "roof",
    "incense-desert-windcatcher"
   ],
   [
    4,
    5,
    18,
    20,
    10,
    "stone",
    "incense-vent-crest"
   ],
   [
    22,
    29,
    18,
    25,
    8,
    "stone",
    "east-relic-sundrift-roof"
   ],
   [
    24,
    27,
    20,
    23,
    9,
    "roof",
    "east-gold-suncrest"
   ],
   [
    25,
    26,
    21,
    22,
    10,
    "stone",
    "central-relic-crown"
   ],
   [
    12,
    18,
    26,
    31,
    8,
    "roof",
    "north-sanctum-star-dome"
   ],
   [
    14,
    16,
    27,
    30,
    9,
    "stone",
    "north-dome-drum"
   ],
   [
    15,
    15,
    28,
    29,
    10,
    "roof",
    "north-sun-ray-pinnacle"
   ],
   [
    15,
    15,
    28,
    28,
    11,
    "stone",
    "highest-sun-needle"
   ],
   [
    1,
    8,
    29,
    31,
    8,
    "stone",
    "remote-left-votive-store"
   ],
   [
    3,
    6,
    30,
    30,
    9,
    "roof",
    "west-votive-cap"
   ],
   [
    11,
    12,
    2,
    6,
    8,
    "roof",
    "offcenter-pilgrim-porch"
   ]
  ],
  "rooms": [
   [
    "Long sunlit public desert pilgrim nave",
    [
     "ceremonial-space",
     "public-circulation"
    ],
    [
     11,
     19,
     1,
     24
    ]
   ],
   [
    "West guarded incense and preparation room",
    [
     "preparation-room"
    ],
    [
     1,
     8,
     11,
     24
    ]
   ],
   [
    "East separated guarded relic chamber",
    [
     "relic-room"
    ],
    [
     22,
     29,
     17,
     25
    ]
   ],
   [
    "North enclosed equinox altar sanctum",
    [
     "altar"
    ],
    [
     11,
     19,
     26,
     31
    ]
   ],
   [
    "Far west protected votive supplies",
    [
     "votive-vault"
    ],
    [
     1,
     8,
     29,
     31
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "public-circulation",
    "southern shade entry"
   ],
   [
    "public-circulation",
    "ceremonial-space",
    "unbroken central nave"
   ],
   [
    "ceremonial-space",
    "preparation-room",
    "west priest's portal"
   ],
   [
    "ceremonial-space",
    "relic-room",
    "east relic guard"
   ],
   [
    "ceremonial-space",
    "altar",
    "north sealed equinox altar gate"
   ],
   [
    "altar",
    "votive-vault",
    "farwest spiritual archive"
   ]
  ],
  "targets": [
   [
    "public prayer nave",
    15,
    12
   ],
   [
    "west incense",
    5,
    19
   ],
   [
    "east relic",
    26,
    21
   ],
   [
    "north altar",
    18,
    29
   ],
   [
    "west votive vault",
    6,
    29
   ]
  ],
  "features": [
   "ceremonial-space",
   "public-circulation",
   "altar",
   "relic-room",
   "preparation-room",
   "votive-vault"
  ],
  "signature": "Tiny sundrift pilgrimage chapel with impossibly long narrow nave, unequally offset west ritual preparation and right sun vault, far-left separate secure votive spur, and physically stepped y11 star-dome needle above the far sanctum"
 },
 {
  "category": "bookshop",
  "biome": "enchanted-forest",
  "size": "large",
  "variation": 2,
  "title": "Moonroot Six-Bough Living Archive",
  "w": 51,
  "d": 45,
  "h": 18,
  "plan": [
   [
    16,
    34,
    0,
    44
   ],
   [
    0,
    15,
    9,
    30
   ],
   [
    35,
    50,
    15,
    37
   ],
   [
    0,
    15,
    35,
    44
   ],
   [
    35,
    50,
    40,
    44
   ]
  ],
  "entry": [
   25,
   0
  ],
  "sky": [
   [
    22,
    29,
    3,
    8
   ]
  ],
  "divide": [
   [
    "x",
    16,
    9,
    30,
    [
     16
    ]
   ],
   [
    "x",
    34,
    15,
    37,
    [
     24
    ]
   ],
   [
    "x",
    16,
    35,
    43,
    [
     40
    ]
   ],
   [
    "x",
    34,
    40,
    43,
    [
     42
    ]
   ],
   [
    "z",
    33,
    17,
    33,
    [
     25
    ]
   ]
  ],
  "items": [
   [
    19,
    5,
    "display",
    "barkbound-druid-guides"
   ],
   [
    31,
    7,
    "display",
    "fungal-codices"
   ],
   [
    25,
    11,
    "counter",
    "forest-bookkeeper"
   ],
   [
    7,
    19,
    "crate",
    "living-paper-archive"
   ],
   [
    11,
    28,
    "display",
    "root-runes"
   ],
   [
    43,
    25,
    "seat",
    "moonroot-reader"
   ],
   [
    45,
    34,
    "table",
    "forest-ink-reading"
   ],
   [
    25,
    37,
    "table",
    "private-copy-scribe"
   ],
   [
    7,
    40,
    "crate",
    "sealed-moon-books"
   ],
   [
    43,
    42,
    "table",
    "illuminator's-vellum"
   ],
   [
    41,
    43,
    "lamp",
    "night-reading-lantern",
    "decor"
   ]
  ],
  "steps": [
   [
    2,
    14,
    11,
    28,
    8,
    "leaf",
    "west-long-livingwood-archive"
   ],
   [
    5,
    11,
    15,
    26,
    9,
    "wood",
    "root-library-ribbed-gable"
   ],
   [
    7,
    9,
    17,
    24,
    10,
    "leaf",
    "high-moonroot-crest"
   ],
   [
    8,
    8,
    19,
    21,
    11,
    "wood",
    "high-root-crown"
   ],
   [
    36,
    48,
    17,
    35,
    8,
    "wood",
    "east-reading-leaf-terrace"
   ],
   [
    39,
    45,
    21,
    32,
    9,
    "leaf",
    "east-thick-living-canopy"
   ],
   [
    41,
    43,
    24,
    29,
    10,
    "wood",
    "east-quiet-reading-finial"
   ],
   [
    18,
    32,
    35,
    43,
    8,
    "roof",
    "northern-scribe-gallery-roof"
   ],
   [
    21,
    29,
    37,
    41,
    9,
    "leaf",
    "scribe-lantern-crossvault"
   ],
   [
    24,
    26,
    38,
    40,
    10,
    "wood",
    "ink-ridge"
   ],
   [
    2,
    14,
    37,
    43,
    8,
    "wood",
    "west-rear-hidden-manuscripts"
   ],
   [
    5,
    11,
    39,
    41,
    9,
    "leaf",
    "west-rear-living-cap"
   ],
   [
    36,
    48,
    41,
    43,
    8,
    "wood",
    "east-rear-illuminator-cottage"
   ],
   [
    40,
    44,
    42,
    42,
    9,
    "leaf",
    "short-east-rear-canopy"
   ],
   [
    17,
    20,
    2,
    7,
    8,
    "wood",
    "offcenter-root-entry"
   ]
  ],
  "rooms": [
   [
    "Enchanted forest main public history and story hall",
    [
     "sales-floor",
     "service-counter",
     "bookshelves"
    ],
    [
     17,
     33,
     1,
     32
    ]
   ],
   [
    "Long western botanical codex research wing",
    [
     "stockroom",
     "herbarium"
    ],
    [
     1,
     14,
     10,
     29
    ]
   ],
   [
    "Eastern quiet livingwood reader conservatory",
    [
     "reading-area"
    ],
    [
     36,
     48,
     16,
     36
    ]
   ],
   [
    "North enclosed illuminated manuscript bindery",
    [
     "manuscript-room"
    ],
    [
     17,
     33,
     34,
     43
    ]
   ],
   [
    "Far-left secure moonlit rarebooks archive",
    [
     "rarebook-vault"
    ],
    [
     1,
     14,
     36,
     43
    ]
   ],
   [
    "Far-east small vellum artist sanctuary",
    [
     "illumination-studio"
    ],
    [
     36,
     48,
     41,
     43
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "forest root book arch"
   ],
   [
    "sales-floor",
    "service-counter",
    "reading guides"
   ],
   [
    "sales-floor",
    "stockroom",
    "west herbarium gate"
   ],
   [
    "sales-floor",
    "reading-area",
    "right conservatory door"
   ],
   [
    "sales-floor",
    "manuscript-room",
    "north illuminated bindery"
   ],
   [
    "manuscript-room",
    "rarebook-vault",
    "far-left moonroot seal"
   ],
   [
    "manuscript-room",
    "illumination-studio",
    "right rear color atelier"
   ]
  ],
  "targets": [
   [
    "public root books",
    25,
    10
   ],
   [
    "west herbarium",
    7,
    20
   ],
   [
    "east reading grove",
    43,
    26
   ],
   [
    "north manuscript",
    25,
    38
   ],
   [
    "west rarebook vault",
    8,
    41
   ],
   [
    "east vellum",
    45,
    43
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "bookshelves",
   "reading-area",
   "stockroom",
   "herbarium",
   "manuscript-room",
   "rarebook-vault",
   "illumination-studio"
  ],
  "signature": "Enormous livingwood book university with very deep asymmetrical western archive, eastern reader bough, independent northern bindery, separated west rarebook treehouse and east vellum turret, physically empty two side canyons and four differently pitched leaf ridge tiers"
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
 for(const [axis,n,a,b,doors] of s.divide){
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
 for(const [x,z,mat,role,kind='fixture']of s.items)
  put(x,2,z,A[mat],kind,{role});
 for(const [x0,x1,z0,z1,y,mat,role]of s.steps)
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
  architecturalSignature:s.signature,roof:{form:'custom source-coordinate gables and stepped high ridges across deeply recessed no-foundation courts',biomeSpecific:true},
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
export const M1_TERRACES_SANCTUARIES=Object.freeze(DESIGNS.map(author));
