import {SCHEMA,validateBlueprint} from './schema.mjs';
// Independent original crossbar T-plan and canyon switchback L-plan trade buildings.
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
  "biome": "enchanted-forest",
  "size": "small",
  "variation": 2,
  "title": "Starfern T-Crossloom Tailory",
  "w": 35,
  "d": 36,
  "h": 17,
  "plan": [
   [
    0,
    34,
    0,
    11
   ],
   [
    13,
    23,
    12,
    35
   ],
   [
    2,
    10,
    12,
    19
   ]
  ],
  "entry": [
   17,
   0
  ],
  "sky": [
   [
    15,
    19,
    3,
    6
   ]
  ],
  "divide": [
   [
    "x",
    12,
    1,
    10,
    [
     6
    ]
   ],
   [
    "x",
    24,
    1,
    10,
    [
     6
    ]
   ],
   [
    "z",
    12,
    14,
    22,
    [
     18
    ]
   ],
   [
    "z",
    26,
    14,
    22,
    [
     18
    ]
   ],
   [
    "z",
    12,
    3,
    9,
    [
     6
    ]
   ]
  ],
  "items": [
   [
    17,
    8,
    "counter",
    "forest-village-seamstress"
   ],
   [
    5,
    6,
    "crate",
    "left-thread-pantry"
   ],
   [
    29,
    6,
    "display",
    "right-festival-robes"
   ],
   [
    6,
    15,
    "table",
    "separate-moss-dye-booth"
   ],
   [
    18,
    19,
    "table",
    "deep-tree-root-loom"
   ],
   [
    19,
    31,
    "crate",
    "moonlit-rare-silk"
   ],
   [
    30,
    9,
    "lamp",
    "elven-robe-light",
    "decor"
   ]
  ],
  "steps": [
   [
    2,
    10,
    2,
    9,
    8,
    "leaf",
    "T-left-wide-woven-bough"
   ],
   [
    4,
    8,
    4,
    8,
    9,
    "wood",
    "left-ribbed-slope"
   ],
   [
    5,
    7,
    5,
    7,
    10,
    "leaf",
    "left-loom-crest"
   ],
   [
    6,
    6,
    6,
    6,
    11,
    "wood",
    "left-signal-spire"
   ],
   [
    26,
    32,
    2,
    9,
    8,
    "wood",
    "T-right-cloth-market"
   ],
   [
    28,
    30,
    4,
    8,
    9,
    "leaf",
    "right-bough-hip"
   ],
   [
    29,
    29,
    5,
    7,
    10,
    "wood",
    "right-needle"
   ],
   [
    29,
    29,
    6,
    6,
    11,
    "leaf",
    "right-silk-finial"
   ],
   [
    15,
    21,
    14,
    33,
    8,
    "leaf",
    "T-deep-root-stem"
   ],
   [
    17,
    19,
    17,
    31,
    9,
    "wood",
    "T-narrow-deep-weaving-roof"
   ],
   [
    18,
    18,
    20,
    29,
    10,
    "leaf",
    "root-loom-high-ridge"
   ],
   [
    18,
    18,
    23,
    27,
    11,
    "wood",
    "root-loom-spire"
   ],
   [
    4,
    9,
    14,
    17,
    8,
    "wood",
    "left-short-moss-dye-lean-to"
   ],
   [
    6,
    8,
    15,
    16,
    9,
    "leaf",
    "left-dye-crossribs"
   ],
   [
    7,
    7,
    15,
    15,
    10,
    "wood",
    "side-leaf-vent"
   ],
   [
    14,
    22,
    8,
    9,
    8,
    "wood",
    "central-shaded-entrance"
   ]
  ],
  "rooms": [
   [
    "Middle public elven tailor counter",
    [
     "sales-floor",
     "service-counter",
     "garment-display"
    ],
    [
     13,
     23,
     1,
     11
    ]
   ],
   [
    "Wide left thread and trim reserve",
    [
     "fabric-archive"
    ],
    [
     1,
     11,
     1,
     10
    ]
   ],
   [
    "Right independent wedding and festival robe fitting gallery",
    [
     "fitting-area"
    ],
    [
     25,
     33,
     1,
     10
    ]
   ],
   [
    "Long deep southern root-thread loom",
    [
     "weaving-loft"
    ],
    [
     14,
     22,
     13,
     25
    ]
   ],
   [
    "Deep secure moonweave silk stock",
    [
     "stockroom"
    ],
    [
     14,
     22,
     27,
     34
    ]
   ],
   [
    "Short left attached moss dye booth",
    [
     "dye-room"
    ],
    [
     3,
     9,
     13,
     18
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "forest-public-robe-hall"
   ],
   [
    "sales-floor",
    "fabric-archive",
    "west-stock-lock"
   ],
   [
    "sales-floor",
    "fitting-area",
    "east-private-fitting"
   ],
   [
    "sales-floor",
    "weaving-loft",
    "deep-loom-door"
   ],
   [
    "weaving-loft",
    "stockroom",
    "private-stock-gate"
   ],
   [
    "fabric-archive",
    "dye-room",
    "left-moss-dye-cabinet"
   ]
  ],
  "targets": [
   [
    "public robes",
    19,
    8
   ],
   [
    "west thread",
    8,
    6
   ],
   [
    "right fitting",
    30,
    7
   ],
   [
    "deep looms",
    18,
    22
   ],
   [
    "moon-silk",
    17,
    32
   ],
   [
    "side dye",
    6,
    17
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "garment-display",
   "fabric-archive",
   "fitting-area",
   "weaving-loft",
   "stockroom",
   "dye-room"
  ],
  "signature": "True T-shaped small enchanted sewing school: full width crossbar above ultra-narrow long central south stem with only a tiny west side spur; four separately locked horizontal and vertical rooms and entirely different twig versus heartwood loft roofs"
 },
 {
  "category": "butcher",
  "biome": "mountain",
  "size": "medium",
  "variation": 2,
  "title": "Switchstone Canyon Larder Switchback",
  "w": 42,
  "d": 39,
  "h": 17,
  "plan": [
   [
    7,
    41,
    0,
    10
   ],
   [
    7,
    20,
    11,
    38
   ],
   [
    21,
    40,
    27,
    38
   ],
   [
    31,
    41,
    11,
    19
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
    6
   ]
  ],
  "divide": [
   [
    "z",
    11,
    8,
    19,
    [
     14
    ]
   ],
   [
    "z",
    27,
    8,
    19,
    [
     14
    ]
   ],
   [
    "x",
    21,
    28,
    37,
    [
     32
    ]
   ],
   [
    "z",
    11,
    32,
    40,
    [
     36
    ]
   ]
  ],
  "items": [
   [
    15,
    6,
    "display",
    "cured-hill-goat"
   ],
   [
    24,
    9,
    "counter",
    "cliff-game-trader"
   ],
   [
    12,
    18,
    "table",
    "west-knife-rinsing"
   ],
   [
    15,
    33,
    "crate",
    "deep-cold-salt-store"
   ],
   [
    31,
    32,
    "table",
    "far-right-suspended-smoke-room"
   ],
   [
    36,
    15,
    "crate",
    "small-ridge-frozen-food"
   ],
   [
    32,
    8,
    "lamp",
    "street-lantern",
    "decor"
   ]
  ],
  "steps": [
   [
    9,
    18,
    13,
    36,
    8,
    "stone",
    "west-long-cliff-coldstorage"
   ],
   [
    11,
    16,
    16,
    34,
    9,
    "roof",
    "west-arching-long-vent"
   ],
   [
    12,
    15,
    19,
    30,
    10,
    "stone",
    "west-chilled-granite-ridge"
   ],
   [
    13,
    14,
    23,
    28,
    11,
    "roof",
    "west-deep-wind-flue"
   ],
   [
    23,
    39,
    29,
    36,
    8,
    "wood",
    "rear-right-smoke-larder"
   ],
   [
    26,
    36,
    30,
    35,
    9,
    "stone",
    "rear-right-coldchain-ridge"
   ],
   [
    29,
    33,
    31,
    34,
    10,
    "roof",
    "rear-smoke-valley-crest"
   ],
   [
    31,
    31,
    32,
    33,
    11,
    "stone",
    "rear-canyon-needle"
   ],
   [
    33,
    39,
    13,
    17,
    8,
    "stone",
    "isolated-street-east-freezer"
   ],
   [
    35,
    37,
    14,
    16,
    9,
    "roof",
    "east-shed-ice-crown"
   ],
   [
    36,
    36,
    15,
    15,
    10,
    "stone",
    "east-short-vent"
   ],
   [
    9,
    17,
    2,
    9,
    8,
    "stone",
    "west-storefront-gable"
   ],
   [
    11,
    15,
    4,
    8,
    9,
    "roof",
    "west-market-steep-ridge"
   ],
   [
    12,
    14,
    5,
    7,
    10,
    "stone",
    "west-market-crest"
   ],
   [
    30,
    39,
    2,
    9,
    8,
    "stone",
    "east-market-front"
   ],
   [
    32,
    37,
    4,
    8,
    9,
    "roof",
    "right-storefront-pitch"
   ],
   [
    34,
    35,
    5,
    7,
    10,
    "stone",
    "right-front-highcap"
   ],
   [
    34,
    34,
    6,
    6,
    11,
    "roof",
    "front-canyon-flag"
   ]
  ],
  "rooms": [
   [
    "Broad public canyon meat market front",
    [
     "sales-floor",
     "service-counter"
    ],
    [
     8,
     40,
     1,
     10
    ]
   ],
   [
    "Left descending sanitized butchery work floor",
    [
     "butcher-workspace"
    ],
    [
     8,
     19,
     12,
     26
    ]
   ],
   [
    "Deep west long-term snow-cooled cold cellars",
    [
     "cold-storage"
    ],
    [
     8,
     19,
     28,
     37
    ]
   ],
   [
    "Right rear smokehouse across real switchback",
    [
     "curing-area"
    ],
    [
     22,
     39,
     28,
     37
    ]
   ],
   [
    "Small right front independent mountain provisions kiosk",
    [
     "provisions-vault"
    ],
    [
     32,
     40,
     12,
     18
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "west-mountain-market-street"
   ],
   [
    "sales-floor",
    "butcher-workspace",
    "long left workroom gate"
   ],
   [
    "butcher-workspace",
    "cold-storage",
    "deep cliff-ice second lock"
   ],
   [
    "cold-storage",
    "curing-area",
    "crossward canyon smokehouse door"
   ],
   [
    "sales-floor",
    "provisions-vault",
    "east short freezer kiosk"
   ]
  ],
  "targets": [
   [
    "public trader",
    24,
    8
   ],
   [
    "west hygiene",
    14,
    20
   ],
   [
    "west deepfreeze",
    13,
    33
   ],
   [
    "smoking switchback",
    32,
    33
   ],
   [
    "right-front freezer",
    36,
    16
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "butcher-workspace",
   "cold-storage",
   "curing-area",
   "provisions-vault"
  ],
  "signature": "Not a spoke layout: asymmetric canyon switchback with full east-west front mercantile shelf, one extremely long leftward mining-larder stem turning into offset right southern smoke wing and wholly separate small right front provision block; multiple perpendicular stone ventilation crests"
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
export const M1_CROSSBAR_SWITCHBACK=Object.freeze(DESIGNS.map(author));
