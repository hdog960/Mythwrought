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
  "category": "tailor",
  "biome": "desert",
  "size": "medium",
  "variation": 2,
  "title": "Sirocco Six-Room Loom Exchange",
  "w": 39,
  "d": 37,
  "h": 15,
  "plan": [
   [
    11,
    26,
    0,
    36
   ],
   [
    0,
    38,
    10,
    21
   ],
   [
    0,
    10,
    22,
    32
   ],
   [
    27,
    38,
    22,
    35
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
    11,
    11,
    20,
    [
     16
    ]
   ],
   [
    "x",
    26,
    11,
    20,
    [
     16
    ]
   ],
   [
    "z",
    22,
    12,
    25,
    [
     18
    ]
   ],
   [
    "x",
    11,
    22,
    32,
    [
     27
    ]
   ],
   [
    "x",
    26,
    22,
    35,
    [
     29
    ]
   ]
  ],
  "furnishing": [
   [
    15,
    5,
    "display",
    "public-linen"
   ],
   [
    23,
    6,
    "display",
    "travel-cloaks"
   ],
   [
    18,
    9,
    "counter",
    "trade-cloth"
   ],
   [
    5,
    15,
    "seat",
    "private-fitting"
   ],
   [
    31,
    15,
    "table",
    "dye-preparation"
   ],
   [
    18,
    28,
    "table",
    "weaving-loom"
   ],
   [
    6,
    27,
    "crate",
    "fabric-inventory"
   ],
   [
    33,
    29,
    "crate",
    "spool-stocks"
   ],
   [
    32,
    32,
    "lamp",
    "stock-lamp",
    "decor"
   ]
  ],
  "mass": [
   [
    2,
    10,
    12,
    20,
    8,
    "stone",
    "west-fitting-roof"
   ],
   [
    5,
    7,
    14,
    18,
    9,
    "roof",
    "west-sunshade"
   ],
   [
    28,
    37,
    12,
    20,
    8,
    "roof",
    "east-dye-roof"
   ],
   [
    32,
    34,
    14,
    18,
    9,
    "stone",
    "east-vent"
   ],
   [
    13,
    25,
    25,
    35,
    8,
    "wood",
    "north-loom-roof"
   ],
   [
    17,
    20,
    27,
    33,
    9,
    "roof",
    "north-high-crest"
   ],
   [
    2,
    9,
    24,
    31,
    8,
    "roof",
    "west-archive-roof"
   ],
   [
    28,
    37,
    24,
    34,
    8,
    "stone",
    "east-spool-roof"
   ],
   [
    31,
    34,
    26,
    31,
    9,
    "roof",
    "east-high-stock"
   ],
   [
    12,
    14,
    2,
    7,
    8,
    "roof",
    "front-asym-awning"
   ]
  ],
  "rooms": [
   [
    "Long southern public garment exchange",
    [
     "sales-floor",
     "service-counter",
     "garment-display"
    ],
    [
     12,
     25,
     1,
     21
    ]
   ],
   [
    "Western independent private tailoring room",
    [
     "fitting-area"
    ],
    [
     1,
     10,
     11,
     20
    ]
   ],
   [
    "Eastern enclosed desert dye workshop",
    [
     "dye-room"
    ],
    [
     27,
     37,
     11,
     20
    ]
   ],
   [
    "Protected rear brocade weaving loft",
    [
     "weaving-loft"
    ],
    [
     12,
     25,
     23,
     35
    ]
   ],
   [
    "Separately gated western cloth reserves",
    [
     "fabric-archive"
    ],
    [
     1,
     9,
     23,
     31
    ]
   ],
   [
    "Separate eastern colored-thread inventory",
    [
     "spool-store"
    ],
    [
     28,
     37,
     23,
     34
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "front market entrance"
   ],
   [
    "sales-floor",
    "fitting-area",
    "west fitting lock"
   ],
   [
    "sales-floor",
    "dye-room",
    "east dye threshold"
   ],
   [
    "sales-floor",
    "weaving-loft",
    "long back loom gate"
   ],
   [
    "fitting-area",
    "fabric-archive",
    "far west cloth access"
   ],
   [
    "dye-room",
    "spool-store",
    "far east spool access"
   ]
  ],
  "targets": [
   [
    "public sales",
    18,
    7
   ],
   [
    "western fitting",
    5,
    16
   ],
   [
    "eastern dye",
    33,
    16
   ],
   [
    "rear loom",
    18,
    30
   ],
   [
    "west fabric",
    5,
    28
   ],
   [
    "east stock",
    32,
    28
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "garment-display",
   "fitting-area",
   "dye-room",
   "weaving-loft",
   "fabric-archive",
   "spool-store"
  ],
  "signature": "six genuinely bounded desert weaving functions spread over a long nave and four asymmetric arms, supported multi-height roofs and actual absent ground corners"
 },
 {
  "category": "temple",
  "biome": "enchanted-forest",
  "size": "large",
  "variation": 2,
  "title": "Elderbloom Five-Sanctum Moonroot",
  "w": 47,
  "d": 45,
  "h": 17,
  "plan": [
   [
    15,
    30,
    0,
    44
   ],
   [
    0,
    46,
    14,
    25
   ],
   [
    0,
    12,
    26,
    39
   ],
   [
    34,
    46,
    26,
    43
   ],
   [
    13,
    33,
    37,
    44
   ]
  ],
  "entry": [
   23,
   0
  ],
  "sky": [
   [
    20,
    26,
    4,
    10
   ]
  ],
  "partitions": [
   [
    "x",
    15,
    15,
    24,
    [
     20
    ]
   ],
   [
    "x",
    30,
    15,
    24,
    [
     20
    ]
   ],
   [
    "z",
    26,
    1,
    11,
    [
     6
    ]
   ],
   [
    "z",
    26,
    35,
    45,
    [
     40
    ]
   ],
   [
    "z",
    37,
    15,
    30,
    [
     23
    ]
   ],
   [
    "x",
    13,
    38,
    39,
    []
   ],
   [
    "x",
    33,
    38,
    43,
    []
   ]
  ],
  "furnishing": [
   [
    20,
    6,
    "seat",
    "left-pews"
   ],
   [
    26,
    6,
    "seat",
    "right-pews"
   ],
   [
    23,
    11,
    "lamp",
    "ceremonial-lantern",
    "decor"
   ],
   [
    6,
    19,
    "seat",
    "west-shrine-seating"
   ],
   [
    40,
    19,
    "seat",
    "east-shrine-seating"
   ],
   [
    6,
    32,
    "altar",
    "west-root-votive"
   ],
   [
    40,
    35,
    "altar",
    "east-seed-votive"
   ],
   [
    20,
    39,
    "seat",
    "rear-pews"
   ],
   [
    23,
    42,
    "altar",
    "Moonroot-reliquary"
   ],
   [
    16,
    31,
    "lamp",
    "west-nave-lamp",
    "decor"
   ],
   [
    28,
    33,
    "lamp",
    "east-nave-lamp",
    "decor"
   ]
  ],
  "mass": [
   [
    1,
    11,
    16,
    24,
    8,
    "leaf",
    "west-transept-roof"
   ],
   [
    4,
    7,
    18,
    22,
    9,
    "wood",
    "west-tall-crest"
   ],
   [
    35,
    45,
    16,
    24,
    8,
    "wood",
    "east-transept-roof"
   ],
   [
    39,
    41,
    18,
    22,
    9,
    "leaf",
    "east-leaf-crest"
   ],
   [
    2,
    11,
    28,
    38,
    8,
    "leaf",
    "left-root-chapel-roof"
   ],
   [
    5,
    7,
    30,
    36,
    9,
    "wood",
    "left-chapel-crest"
   ],
   [
    35,
    45,
    28,
    42,
    8,
    "leaf",
    "right-seed-chapel-roof"
   ],
   [
    40,
    42,
    31,
    39,
    9,
    "wood",
    "right-seed-crest"
   ],
   [
    16,
    29,
    38,
    43,
    8,
    "wood",
    "north-Moonroot-apse"
   ],
   [
    20,
    26,
    40,
    42,
    9,
    "leaf",
    "north-crown"
   ],
   [
    17,
    19,
    2,
    7,
    8,
    "leaf",
    "front-porch-bough"
   ]
  ],
  "rooms": [
   [
    "Central deep processional forest nave",
    [
     "ceremonial-space",
     "public-circulation"
    ],
    [
     16,
     29,
     1,
     36
    ]
   ],
   [
    "West independently opened transept",
    [
     "west-transept"
    ],
    [
     1,
     14,
     15,
     24
    ]
   ],
   [
    "East separately opened sacred transept",
    [
     "east-transept"
    ],
    [
     31,
     45,
     15,
     24
    ]
   ],
   [
    "Far western restricted elder root chapel",
    [
     "west-chapel"
    ],
    [
     1,
     11,
     27,
     38
    ]
   ],
   [
    "Far eastern protected blooming seed chapel",
    [
     "east-chapel"
    ],
    [
     35,
     45,
     27,
     42
    ]
   ],
   [
    "Rear fully separate Moonroot altar",
    [
     "altar"
    ],
    [
     16,
     29,
     38,
     43
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "ceremonial-space",
    "public pilgrim entry"
   ],
   [
    "ceremonial-space",
    "public-circulation",
    "nave procession"
   ],
   [
    "ceremonial-space",
    "west-transept",
    "left gate"
   ],
   [
    "ceremonial-space",
    "east-transept",
    "right gate"
   ],
   [
    "west-transept",
    "west-chapel",
    "left shrine gate"
   ],
   [
    "east-transept",
    "east-chapel",
    "right shrine gate"
   ],
   [
    "ceremonial-space",
    "altar",
    "north sacred gate"
   ]
  ],
  "targets": [
   [
    "public nave",
    23,
    12
   ],
   [
    "west transept",
    6,
    20
   ],
   [
    "east transept",
    40,
    20
   ],
   [
    "root chapel",
    6,
    33
   ],
   [
    "seed chapel",
    40,
    34
   ],
   [
    "altar chamber",
    23,
    41
   ]
  ],
  "features": [
   "ceremonial-space",
   "altar",
   "public-circulation",
   "west-transept",
   "east-transept",
   "west-chapel",
   "east-chapel"
  ],
  "signature": "grand five-sanctum living forest cathedral, offset cross-transepts, two far rear chapel arms separated by true voids, centrally gated altar and raised livingwood roof assemblies"
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
export const M1_RITUAL_TRADES=Object.freeze(DESIGNS.map(author));
