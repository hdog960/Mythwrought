import {SCHEMA,validateBlueprint} from './schema.mjs';
// Four original coordinate-authored, structurally different M1 architecture programs.
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
  "biome": "snow",
  "size": "medium",
  "variation": 2,
  "title": "Glaciergate Hooked-Ice Exchange",
  "w": 37,
  "d": 37,
  "h": 15,
  "plan": [
   [
    0,
    36,
    0,
    10
   ],
   [
    0,
    9,
    11,
    34
   ],
   [
    27,
    36,
    11,
    34
   ],
   [
    10,
    26,
    30,
    36
   ]
  ],
  "entry": [
   18,
   0
  ],
  "sky": [
   [
    13,
    23,
    2,
    8
   ]
  ],
  "divide": [
   [
    "z",
    11,
    1,
    8,
    [
     5
    ]
   ],
   [
    "z",
    11,
    28,
    35,
    [
     32
    ]
   ],
   [
    "x",
    10,
    31,
    34,
    [
     32
    ]
   ],
   [
    "x",
    26,
    31,
    34,
    [
     32
    ]
   ]
  ],
  "items": [
   [
    5,
    5,
    "display",
    "ice-stone-vendor"
   ],
   [
    31,
    5,
    "display",
    "snowfelt-vendor"
   ],
   [
    18,
    9,
    "counter",
    "caravan-keeper"
   ],
   [
    4,
    19,
    "table",
    "fish-weighing"
   ],
   [
    7,
    29,
    "crate",
    "frozen-fish"
   ],
   [
    32,
    19,
    "table",
    "wool-weights"
   ],
   [
    29,
    27,
    "crate",
    "dry-goods"
   ],
   [
    18,
    33,
    "table",
    "north-ledger"
   ],
   [
    14,
    34,
    "seat",
    "ledger-chair"
   ],
   [
    23,
    34,
    "lamp",
    "snow-navigation",
    "decor"
   ]
  ],
  "steps": [
   [
    2,
    8,
    14,
    33,
    8,
    "snow",
    "west-ice-gallery"
   ],
   [
    4,
    6,
    17,
    30,
    9,
    "roof",
    "western-frost-ridge"
   ],
   [
    4,
    5,
    21,
    25,
    10,
    "snow",
    "west-crest"
   ],
   [
    28,
    35,
    14,
    33,
    8,
    "stone",
    "east-dry-trade"
   ],
   [
    30,
    33,
    16,
    30,
    9,
    "snow",
    "east-overhang"
   ],
   [
    31,
    32,
    20,
    24,
    10,
    "roof",
    "east-signal"
   ],
   [
    11,
    25,
    31,
    35,
    8,
    "wood",
    "rear-ledger-bridge"
   ],
   [
    15,
    21,
    32,
    34,
    9,
    "snow",
    "north-drift"
   ],
   [
    17,
    19,
    33,
    34,
    10,
    "roof",
    "ledger-vent"
   ],
   [
    2,
    10,
    2,
    6,
    8,
    "snow",
    "front-snow-awning"
   ]
  ],
  "rooms": [
   [
    "South public snow market",
    [
     "square",
     "public-circulation"
    ],
    [
     1,
     35,
     1,
     10
    ]
   ],
   [
    "West winter fish and fur gallery",
    [
     "vendor-stalls"
    ],
    [
     1,
     8,
     12,
     33
    ]
   ],
   [
    "Right mountain dry-goods gallery",
    [
     "trading-gallery"
    ],
    [
     28,
     35,
     12,
     33
    ]
   ],
   [
    "Rear connected account bridge",
    [
     "ledger-room"
    ],
    [
     11,
     25,
     31,
     35
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "square",
    "public market gate"
   ],
   [
    "square",
    "public-circulation",
    "ticket queue"
   ],
   [
    "public-circulation",
    "vendor-stalls",
    "west insulated gate"
   ],
   [
    "public-circulation",
    "trading-gallery",
    "east dry stall gate"
   ],
   [
    "vendor-stalls",
    "ledger-room",
    "west ledger hatch"
   ],
   [
    "trading-gallery",
    "ledger-room",
    "east ledger hatch"
   ]
  ],
  "targets": [
   [
    "public market",
    18,
    6
   ],
   [
    "left fish stalls",
    5,
    21
   ],
   [
    "right dry stalls",
    32,
    21
   ],
   [
    "secured accounts",
    18,
    33
   ]
  ],
  "features": [
   "square",
   "public-circulation",
   "vendor-stalls",
   "trading-gallery",
   "ledger-room"
  ],
  "signature": "Snow hooked-ice market with twin unequal galleries, physically absent central courtyard and connected high ledger bridge with three entirely different roof crests"
 },
 {
  "category": "market-square",
  "biome": "enchanted-forest",
  "size": "small",
  "variation": 2,
  "title": "Glowfen Crescent Seed Bazaar",
  "w": 29,
  "d": 31,
  "h": 15,
  "plan": [
   [
    0,
    28,
    0,
    9
   ],
   [
    0,
    8,
    10,
    25
   ],
   [
    20,
    28,
    10,
    24
   ],
   [
    9,
    19,
    22,
    30
   ]
  ],
  "entry": [
   14,
   0
  ],
  "sky": [
   [
    11,
    17,
    2,
    7
   ]
  ],
  "divide": [
   [
    "z",
    10,
    1,
    7,
    [
     4
    ]
   ],
   [
    "z",
    10,
    21,
    27,
    [
     24
    ]
   ],
   [
    "x",
    9,
    23,
    25,
    [
     24
    ]
   ],
   [
    "x",
    19,
    23,
    24,
    [
     23
    ]
   ]
  ],
  "items": [
   [
    4,
    4,
    "display",
    "pollen-stand"
   ],
   [
    24,
    5,
    "display",
    "woodland-trade"
   ],
   [
    14,
    8,
    "counter",
    "seed-keeper"
   ],
   [
    4,
    17,
    "table",
    "grove-sorter"
   ],
   [
    6,
    23,
    "crate",
    "mushroom-stocks"
   ],
   [
    24,
    17,
    "table",
    "forest-amber"
   ],
   [
    14,
    27,
    "table",
    "rear-growing-ledger"
   ],
   [
    11,
    28,
    "lamp",
    "seed-light",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    7,
    12,
    23,
    8,
    "leaf",
    "west-living-bough"
   ],
   [
    2,
    5,
    14,
    22,
    9,
    "wood",
    "west-tall-seed-arch"
   ],
   [
    3,
    4,
    16,
    19,
    10,
    "leaf",
    "pollen-cupola"
   ],
   [
    21,
    27,
    12,
    22,
    8,
    "wood",
    "east-amber-wicker"
   ],
   [
    23,
    26,
    14,
    20,
    9,
    "leaf",
    "east-grove-canopy"
   ],
   [
    10,
    18,
    24,
    29,
    8,
    "leaf",
    "rear-cultivation-loft"
   ],
   [
    12,
    16,
    25,
    28,
    9,
    "wood",
    "rear-wood-crown"
   ],
   [
    13,
    15,
    26,
    27,
    10,
    "leaf",
    "grove-spire"
   ],
   [
    2,
    8,
    2,
    5,
    8,
    "wood",
    "offset-west-entry"
   ]
  ],
  "rooms": [
   [
    "Public luminous forest square",
    [
     "square",
     "public-circulation"
    ],
    [
     1,
     27,
     1,
     9
    ]
   ],
   [
    "West pollen and mushroom trades",
    [
     "vendor-stalls"
    ],
    [
     1,
     7,
     11,
     24
    ]
   ],
   [
    "East enchanted amber gallery",
    [
     "trading-gallery"
    ],
    [
     21,
     27,
     11,
     23
    ]
   ],
   [
    "North cultivated ledger",
    [
     "ledger-room"
    ],
    [
     10,
     18,
     23,
     29
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "square",
    "willow public entry"
   ],
   [
    "square",
    "public-circulation",
    "forest footpath"
   ],
   [
    "public-circulation",
    "vendor-stalls",
    "left pollen gate"
   ],
   [
    "public-circulation",
    "trading-gallery",
    "right amber gate"
   ],
   [
    "vendor-stalls",
    "ledger-room",
    "west rear locked hatch"
   ],
   [
    "trading-gallery",
    "ledger-room",
    "east rear locked hatch"
   ]
  ],
  "targets": [
   [
    "public seed market",
    14,
    6
   ],
   [
    "pollen merchants",
    4,
    19
   ],
   [
    "amber merchants",
    24,
    18
   ],
   [
    "rear ledger",
    14,
    27
   ]
  ],
  "features": [
   "square",
   "public-circulation",
   "vendor-stalls",
   "trading-gallery",
   "ledger-room"
  ],
  "signature": "Small forest crescent market with independent livingwood wings, real unoccupied ground courtyard, rear guarded seed ledger and sharply differentiated canopies"
 },
 {
  "category": "bookshop",
  "biome": "mountain",
  "size": "medium",
  "variation": 2,
  "title": "Cragscroll Broken-Spine Scriptorium",
  "w": 39,
  "d": 38,
  "h": 16,
  "plan": [
   [
    14,
    25,
    0,
    37
   ],
   [
    0,
    13,
    9,
    22
   ],
   [
    26,
    38,
    13,
    29
   ],
   [
    0,
    13,
    32,
    37
   ]
  ],
  "entry": [
   19,
   0
  ],
  "sky": [
   [
    17,
    22,
    3,
    9
   ]
  ],
  "divide": [
   [
    "x",
    14,
    9,
    22,
    [
     16
    ]
   ],
   [
    "x",
    25,
    13,
    29,
    [
     20
    ]
   ],
   [
    "x",
    14,
    33,
    36,
    [
     35
    ]
   ],
   [
    "z",
    31,
    15,
    24,
    [
     20
    ]
   ]
  ],
  "items": [
   [
    16,
    5,
    "display",
    "survey-guides"
   ],
   [
    23,
    7,
    "display",
    "cliff-travel"
   ],
   [
    19,
    12,
    "counter",
    "cliff-books"
   ],
   [
    5,
    15,
    "display",
    "west-records"
   ],
   [
    8,
    21,
    "crate",
    "parchments"
   ],
   [
    31,
    20,
    "seat",
    "east-reader"
   ],
   [
    35,
    25,
    "table",
    "scribe-desk"
   ],
   [
    19,
    30,
    "seat",
    "spine-meditation"
   ],
   [
    5,
    35,
    "crate",
    "mountain-archive"
   ],
   [
    19,
    35,
    "table",
    "binder"
   ],
   [
    9,
    34,
    "lamp",
    "vault-light",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    12,
    11,
    21,
    8,
    "stone",
    "west-stone-archives"
   ],
   [
    4,
    8,
    13,
    20,
    9,
    "roof",
    "short-west-ridge"
   ],
   [
    6,
    7,
    15,
    18,
    10,
    "stone",
    "survey-chimney"
   ],
   [
    27,
    37,
    15,
    28,
    8,
    "wood",
    "east-reading-wing"
   ],
   [
    30,
    35,
    18,
    26,
    9,
    "stone",
    "reader-ridge"
   ],
   [
    32,
    33,
    20,
    24,
    10,
    "roof",
    "high-east-spire"
   ],
   [
    2,
    12,
    33,
    36,
    8,
    "stone",
    "remote-archive-vault"
   ],
   [
    5,
    9,
    34,
    35,
    9,
    "roof",
    "vault-high-crest"
   ],
   [
    16,
    24,
    25,
    35,
    8,
    "roof",
    "central-scroll-spine"
   ],
   [
    19,
    21,
    28,
    33,
    9,
    "wood",
    "high-central-end"
   ]
  ],
  "rooms": [
   [
    "Long public caravan book gallery",
    [
     "sales-floor",
     "service-counter",
     "bookshelves"
    ],
    [
     15,
     24,
     1,
     30
    ]
   ],
   [
    "West ancient survey records",
    [
     "stockroom"
    ],
    [
     1,
     12,
     10,
     21
    ]
   ],
   [
    "East cliffside reading conservatory",
    [
     "reading-area"
    ],
    [
     27,
     37,
     14,
     28
    ]
   ],
   [
    "Rear private manuscript bindery",
    [
     "manuscript-room"
    ],
    [
     16,
     24,
     32,
     36
    ]
   ],
   [
    "Off-center west record vault",
    [
     "archive-vault"
    ],
    [
     1,
     12,
     33,
     36
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "mountain public front"
   ],
   [
    "sales-floor",
    "stockroom",
    "west record hatch"
   ],
   [
    "sales-floor",
    "reading-area",
    "east reader hatch"
   ],
   [
    "sales-floor",
    "manuscript-room",
    "north bindery port"
   ],
   [
    "manuscript-room",
    "archive-vault",
    "left rear vault gate"
   ]
  ],
  "targets": [
   [
    "book sales",
    19,
    10
   ],
   [
    "west records",
    5,
    18
   ],
   [
    "east reading",
    32,
    22
   ],
   [
    "back bindery",
    20,
    34
   ],
   [
    "vault",
    6,
    35
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "bookshelves",
   "stockroom",
   "reading-area",
   "manuscript-room",
   "archive-vault"
  ],
  "signature": "Mountain L-shifted bookhouse with radically unequal front wings and a detached-at-grade far-left archive accessed through narrow rear bindery, plus three supported roof terraces"
 },
 {
  "category": "bookshop",
  "biome": "snow",
  "size": "small",
  "variation": 2,
  "title": "Thawmark Three-Wing Chronicle House",
  "w": 29,
  "d": 33,
  "h": 15,
  "plan": [
   [
    0,
    28,
    0,
    10
   ],
   [
    0,
    10,
    11,
    30
   ],
   [
    11,
    20,
    21,
    32
   ],
   [
    21,
    28,
    15,
    26
   ]
  ],
  "entry": [
   14,
   0
  ],
  "sky": [
   [
    11,
    18,
    2,
    8
   ]
  ],
  "divide": [
   [
    "z",
    11,
    1,
    9,
    [
     5
    ]
   ],
   [
    "x",
    10,
    21,
    29,
    [
     25
    ]
   ],
   [
    "x",
    20,
    21,
    26,
    [
     24
    ]
   ]
  ],
  "items": [
   [
    5,
    4,
    "display",
    "winter-epics"
   ],
   [
    24,
    5,
    "display",
    "river-chronicles"
   ],
   [
    14,
    9,
    "counter",
    "snow-bookkeeper"
   ],
   [
    5,
    20,
    "crate",
    "warm-records"
   ],
   [
    8,
    28,
    "display",
    "snow-scrolls"
   ],
   [
    15,
    27,
    "table",
    "bookbinder"
   ],
   [
    24,
    21,
    "seat",
    "reader-window"
   ],
   [
    17,
    30,
    "lamp",
    "archive-warmth",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    9,
    13,
    29,
    8,
    "snow",
    "west-winter-archive"
   ],
   [
    3,
    7,
    16,
    26,
    9,
    "roof",
    "west-snow-gable"
   ],
   [
    4,
    6,
    18,
    23,
    10,
    "snow",
    "crowned-frost-crest"
   ],
   [
    12,
    19,
    23,
    31,
    8,
    "wood",
    "rear-copying-room"
   ],
   [
    14,
    17,
    25,
    30,
    9,
    "snow",
    "back-snow-roof"
   ],
   [
    15,
    16,
    26,
    29,
    10,
    "roof",
    "scribe-vent"
   ],
   [
    22,
    27,
    17,
    25,
    8,
    "stone",
    "short-east-reader"
   ],
   [
    24,
    26,
    18,
    23,
    9,
    "snow",
    "reader-ice-crest"
   ],
   [
    2,
    8,
    2,
    5,
    8,
    "snow",
    "public-frost-porch"
   ]
  ],
  "rooms": [
   [
    "Public winter atlas and story sales",
    [
     "sales-floor",
     "service-counter",
     "bookshelves"
    ],
    [
     1,
     27,
     1,
     10
    ]
   ],
   [
    "Long west winter record archive",
    [
     "stockroom"
    ],
    [
     1,
     9,
     12,
     29
    ]
   ],
   [
    "Rear independently controlled bookbinding",
    [
     "manuscript-room"
    ],
    [
     12,
     19,
     22,
     31
    ]
   ],
   [
    "Small east winter-reading retreat",
    [
     "reading-area"
    ],
    [
     22,
     27,
     16,
     25
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "south snowy front"
   ],
   [
    "sales-floor",
    "stockroom",
    "west records door"
   ],
   [
    "stockroom",
    "manuscript-room",
    "rear bindery lock"
   ],
   [
    "manuscript-room",
    "reading-area",
    "east reading lock"
   ]
  ],
  "targets": [
   [
    "public stories",
    14,
    6
   ],
   [
    "west archive",
    5,
    20
   ],
   [
    "rear bookbinding",
    15,
    28
   ],
   [
    "east winter reader",
    24,
    21
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "bookshelves",
   "stockroom",
   "manuscript-room",
   "reading-area"
  ],
  "signature": "Small snow bookstore with long west warm archive, physically separate right reading turret and high crooked rear scriptorium around missing central floor"
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
export const M1_NORTHERN_ARCADES=Object.freeze(DESIGNS.map(author));
