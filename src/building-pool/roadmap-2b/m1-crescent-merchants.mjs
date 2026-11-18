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
  "category": "market-square",
  "biome": "enchanted-forest",
  "size": "medium",
  "variation": 2,
  "title": "Whisperbough Crescent Trade Commons",
  "w": 39,
  "d": 39,
  "h": 17,
  "plan": [
   [
    0,
    38,
    0,
    10
   ],
   [
    0,
    9,
    11,
    35
   ],
   [
    27,
    38,
    11,
    36
   ],
   [
    9,
    29,
    32,
    38
   ]
  ],
  "entry": [
   19,
   0
  ],
  "sky": [
   [
    14,
    24,
    3,
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
    37,
    [
     33
    ]
   ],
   [
    "x",
    10,
    33,
    35,
    [
     34
    ]
   ],
   [
    "x",
    27,
    33,
    35,
    [
     34
    ]
   ]
  ],
  "items": [
   [
    6,
    5,
    "display",
    "seed-barter"
   ],
   [
    32,
    6,
    "display",
    "amber-trade"
   ],
   [
    19,
    9,
    "counter",
    "merchant"
   ],
   [
    4,
    21,
    "table",
    "pollen-scales"
   ],
   [
    7,
    30,
    "crate",
    "mushrooms"
   ],
   [
    33,
    22,
    "table",
    "weave-trade"
   ],
   [
    35,
    30,
    "crate",
    "spices"
   ],
   [
    19,
    35,
    "table",
    "customs"
   ],
   [
    16,
    36,
    "seat",
    "customs-clerk"
   ],
   [
    25,
    35,
    "lamp",
    "lantern",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    8,
    14,
    31,
    8,
    "leaf",
    "west-bough"
   ],
   [
    3,
    7,
    17,
    29,
    9,
    "wood",
    "west-high-branch"
   ],
   [
    4,
    6,
    19,
    27,
    10,
    "leaf",
    "west-upper-arch"
   ],
   [
    5,
    5,
    22,
    24,
    11,
    "wood",
    "west-high-vine"
   ],
   [
    28,
    37,
    14,
    32,
    8,
    "wood",
    "east-amber-gable"
   ],
   [
    31,
    35,
    17,
    30,
    9,
    "leaf",
    "east-foliage-ridge"
   ],
   [
    32,
    34,
    20,
    27,
    10,
    "wood",
    "east-wood-ridge"
   ],
   [
    33,
    33,
    22,
    25,
    11,
    "leaf",
    "east-high-signal"
   ],
   [
    11,
    26,
    33,
    37,
    8,
    "leaf",
    "rear-customs-bridge"
   ],
   [
    15,
    23,
    34,
    36,
    9,
    "wood",
    "rear-ledger-arch"
   ],
   [
    18,
    20,
    35,
    35,
    10,
    "leaf",
    "rear-clerk-crown"
   ],
   [
    2,
    12,
    2,
    6,
    8,
    "wood",
    "offset-market-canopy"
   ]
  ],
  "rooms": [
   [
    "Public grove bazaar",
    [
     "square",
     "public-circulation"
    ],
    [
     1,
     37,
     1,
     10
    ]
   ],
   [
    "Western seed traders",
    [
     "vendor-stalls"
    ],
    [
     1,
     8,
     12,
     34
    ]
   ],
   [
    "Eastern amber traders",
    [
     "trading-gallery"
    ],
    [
     28,
     37,
     12,
     35
    ]
   ],
   [
    "Protected rear merchant ledgers",
    [
     "ledger-room"
    ],
    [
     11,
     26,
     33,
     37
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "square",
    "market front"
   ],
   [
    "square",
    "public-circulation",
    "spacious trade"
   ],
   [
    "public-circulation",
    "vendor-stalls",
    "western gate"
   ],
   [
    "public-circulation",
    "trading-gallery",
    "eastern gate"
   ],
   [
    "vendor-stalls",
    "ledger-room",
    "west rear hatch"
   ],
   [
    "trading-gallery",
    "ledger-room",
    "east rear hatch"
   ]
  ],
  "targets": [
   [
    "front",
    19,
    5
   ],
   [
    "west",
    5,
    21
   ],
   [
    "east",
    33,
    23
   ],
   [
    "rear",
    20,
    36
   ]
  ],
  "features": [
   "square",
   "vendor-stalls",
   "public-circulation",
   "trading-gallery",
   "ledger-room"
  ],
  "signature": "Crescent U-shaped livingwood market wrapping a truly empty central grove with unequal arcade towers and raised rear customs bridge"
 },
 {
  "category": "market-square",
  "biome": "desert",
  "size": "small",
  "variation": 2,
  "title": "Sirocco Zigzag Shade Bazaar",
  "w": 31,
  "d": 30,
  "h": 17,
  "plan": [
   [
    8,
    22,
    0,
    29
   ],
   [
    0,
    7,
    8,
    21
   ],
   [
    23,
    30,
    13,
    24
   ],
   [
    0,
    7,
    25,
    29
   ]
  ],
  "entry": [
   15,
   0
  ],
  "sky": [
   [
    12,
    19,
    3,
    7
   ]
  ],
  "divide": [
   [
    "x",
    8,
    8,
    21,
    [
     14
    ]
   ],
   [
    "x",
    22,
    13,
    24,
    [
     18
    ]
   ],
   [
    "x",
    8,
    25,
    28,
    [
     27
    ]
   ]
  ],
  "items": [
   [
    11,
    5,
    "display",
    "salt"
   ],
   [
    19,
    6,
    "display",
    "copper"
   ],
   [
    15,
    10,
    "counter",
    "fees"
   ],
   [
    4,
    15,
    "table",
    "dates"
   ],
   [
    6,
    20,
    "crate",
    "oasis"
   ],
   [
    27,
    19,
    "table",
    "saffron"
   ],
   [
    24,
    23,
    "crate",
    "rope"
   ],
   [
    4,
    27,
    "table",
    "accounts"
   ],
   [
    6,
    28,
    "lamp",
    "night-bazaar",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    6,
    10,
    20,
    8,
    "stone",
    "west-dates"
   ],
   [
    2,
    5,
    13,
    18,
    9,
    "roof",
    "west-shade"
   ],
   [
    3,
    4,
    15,
    17,
    10,
    "stone",
    "west-vent"
   ],
   [
    3,
    3,
    16,
    16,
    11,
    "roof",
    "west-tower"
   ],
   [
    24,
    29,
    15,
    23,
    8,
    "roof",
    "east-windcatcher"
   ],
   [
    25,
    28,
    17,
    22,
    9,
    "stone",
    "east-hood"
   ],
   [
    26,
    27,
    19,
    20,
    10,
    "roof",
    "east-spine"
   ],
   [
    26,
    26,
    19,
    19,
    11,
    "stone",
    "east-louver"
   ],
   [
    1,
    6,
    26,
    28,
    8,
    "stone",
    "rear-accounts"
   ],
   [
    3,
    5,
    27,
    27,
    9,
    "roof",
    "rear-crown"
   ],
   [
    9,
    11,
    3,
    6,
    8,
    "stone",
    "front-porch"
   ]
  ],
  "rooms": [
   [
    "Public caravan market",
    [
     "square",
     "public-circulation"
    ],
    [
     9,
     21,
     1,
     28
    ]
   ],
   [
    "Western dates and spices",
    [
     "vendor-stalls"
    ],
    [
     1,
     6,
     9,
     20
    ]
   ],
   [
    "Eastern sheltered dye trades",
    [
     "trading-gallery"
    ],
    [
     24,
     29,
     14,
     23
    ]
   ],
   [
    "Rear private caravan ledger",
    [
     "ledger-room"
    ],
    [
     1,
     6,
     26,
     28
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "square",
    "market entrance"
   ],
   [
    "square",
    "public-circulation",
    "long market lane"
   ],
   [
    "public-circulation",
    "vendor-stalls",
    "west date gate"
   ],
   [
    "public-circulation",
    "trading-gallery",
    "east saffron door"
   ],
   [
    "public-circulation",
    "ledger-room",
    "rear customs port"
   ]
  ],
  "targets": [
   [
    "public",
    15,
    9
   ],
   [
    "western",
    4,
    17
   ],
   [
    "eastern",
    26,
    19
   ],
   [
    "customs",
    5,
    27
   ]
  ],
  "features": [
   "square",
   "vendor-stalls",
   "public-circulation",
   "trading-gallery",
   "ledger-room"
  ],
  "signature": "Narrow zigzag desert souk with independent left vendor pocket, smaller right trader room and far-left ledgers, stepped windcatcher peaks"
 },
 {
  "category": "bookshop",
  "biome": "temperate",
  "size": "medium",
  "variation": 2,
  "title": "Rosebridge Four-Spine Folio House",
  "w": 41,
  "d": 37,
  "h": 17,
  "plan": [
   [
    12,
    26,
    0,
    36
   ],
   [
    0,
    11,
    10,
    24
   ],
   [
    27,
    40,
    15,
    30
   ],
   [
    0,
    11,
    30,
    36
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
    12,
    10,
    24,
    [
     16
    ]
   ],
   [
    "x",
    26,
    15,
    30,
    [
     21
    ]
   ],
   [
    "x",
    12,
    30,
    35,
    [
     33
    ]
   ],
   [
    "z",
    29,
    13,
    25,
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
    "stories"
   ],
   [
    23,
    7,
    "display",
    "chapbooks"
   ],
   [
    19,
    11,
    "counter",
    "sales"
   ],
   [
    6,
    18,
    "crate",
    "folio-stock"
   ],
   [
    8,
    22,
    "display",
    "maps"
   ],
   [
    34,
    20,
    "seat",
    "reader"
   ],
   [
    36,
    28,
    "table",
    "club"
   ],
   [
    19,
    33,
    "table",
    "binder"
   ],
   [
    7,
    33,
    "crate",
    "archives"
   ],
   [
    5,
    35,
    "lamp",
    "vault-light",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    10,
    12,
    22,
    8,
    "wood",
    "west-paper-gable"
   ],
   [
    3,
    8,
    15,
    20,
    9,
    "roof",
    "west-ribbed-roof"
   ],
   [
    5,
    6,
    17,
    19,
    10,
    "wood",
    "west-crest"
   ],
   [
    5,
    5,
    18,
    18,
    11,
    "roof",
    "west-high-finial"
   ],
   [
    28,
    39,
    17,
    28,
    8,
    "stone",
    "east-reading-roof"
   ],
   [
    30,
    36,
    20,
    26,
    9,
    "roof",
    "east-tilted-ridge"
   ],
   [
    32,
    34,
    22,
    24,
    10,
    "wood",
    "east-high-crest"
   ],
   [
    33,
    33,
    23,
    23,
    11,
    "roof",
    "reading-needle"
   ],
   [
    14,
    24,
    30,
    35,
    8,
    "roof",
    "north-bindery"
   ],
   [
    17,
    21,
    32,
    34,
    9,
    "wood",
    "bindery-gable"
   ],
   [
    18,
    20,
    33,
    33,
    10,
    "roof",
    "ink-crown"
   ],
   [
    1,
    10,
    32,
    35,
    8,
    "stone",
    "farwest-archive"
   ],
   [
    3,
    8,
    33,
    34,
    9,
    "roof",
    "archive-gable"
   ],
   [
    13,
    14,
    2,
    6,
    8,
    "wood",
    "entry-caps"
   ]
  ],
  "rooms": [
   [
    "Public folio sales",
    [
     "sales-floor",
     "service-counter",
     "bookshelves"
    ],
    [
     13,
     25,
     1,
     28
    ]
   ],
   [
    "West independent stock",
    [
     "stockroom"
    ],
    [
     1,
     10,
     11,
     23
    ]
   ],
   [
    "East river reading salon",
    [
     "reading-area"
    ],
    [
     28,
     39,
     16,
     29
    ]
   ],
   [
    "North bindery",
    [
     "manuscript-room"
    ],
    [
     13,
     25,
     30,
     35
    ]
   ],
   [
    "West rear secure archive",
    [
     "archive-vault"
    ],
    [
     1,
     10,
     31,
     35
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "main books front"
   ],
   [
    "sales-floor",
    "stockroom",
    "stock room gate"
   ],
   [
    "sales-floor",
    "reading-area",
    "reading gate"
   ],
   [
    "sales-floor",
    "manuscript-room",
    "bindery gate"
   ],
   [
    "manuscript-room",
    "archive-vault",
    "archive gate"
   ]
  ],
  "targets": [
   [
    "front",
    19,
    10
   ],
   [
    "stock",
    6,
    17
   ],
   [
    "reading",
    34,
    22
   ],
   [
    "binder",
    21,
    33
   ],
   [
    "vault",
    6,
    33
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
  "signature": "Riverbank four-spine bookshop, narrow vertical public hall, west stock wing and off-shift rear archive connected behind the asymmetrical reading conservatory"
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
export const M1_CRESCENT_MERCHANTS=Object.freeze(DESIGNS.map(author));
