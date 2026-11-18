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
  "category": "jeweler",
  "biome": "temperate",
  "size": "medium",
  "variation": 2,
  "title": "Amberleaf Three-Ledger Lapidary",
  "w": 39,
  "d": 35,
  "h": 15,
  "plan": [
   [
    0,
    38,
    0,
    12
   ],
   [
    0,
    13,
    13,
    34
   ],
   [
    25,
    38,
    13,
    28
   ],
   [
    14,
    24,
    26,
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
    23,
    3,
    8
   ]
  ],
  "partitions": [
   [
    "z",
    13,
    1,
    12,
    [
     7
    ]
   ],
   [
    "z",
    13,
    26,
    37,
    [
     31
    ]
   ],
   [
    "x",
    14,
    27,
    33,
    [
     30
    ]
   ]
  ],
  "furnishing": [
   [
    5,
    5,
    "display",
    "amber"
   ],
   [
    33,
    6,
    "display",
    "garnet"
   ],
   [
    19,
    10,
    "counter",
    "sales"
   ],
   [
    5,
    20,
    "table",
    "faceting"
   ],
   [
    8,
    30,
    "crate",
    "stone-storage"
   ],
   [
    30,
    19,
    "stone",
    "vault"
   ],
   [
    35,
    25,
    "display",
    "gems"
   ],
   [
    19,
    29,
    "table",
    "appraisal"
   ],
   [
    21,
    33,
    "seat",
    "appraisal-chair"
   ],
   [
    4,
    31,
    "lamp",
    "worklight",
    "decor"
   ]
  ],
  "mass": [
   [
    2,
    12,
    17,
    33,
    8,
    "wood",
    "west-craft-gable"
   ],
   [
    5,
    7,
    19,
    31,
    9,
    "roof",
    "western-crest"
   ],
   [
    26,
    37,
    17,
    27,
    8,
    "stone",
    "short-east-vault-roof"
   ],
   [
    30,
    32,
    19,
    25,
    9,
    "roof",
    "east-crest"
   ],
   [
    15,
    23,
    28,
    33,
    8,
    "roof",
    "offaxis-backbridge"
   ],
   [
    18,
    20,
    29,
    32,
    9,
    "wood",
    "ledger-hood"
   ],
   [
    2,
    11,
    2,
    6,
    8,
    "wood",
    "street-porch"
   ]
  ],
  "rooms": [
   [
    "Public front gemstone showroom",
    [
     "sales-floor",
     "service-counter",
     "jewelry-display"
    ],
    [
     1,
     37,
     1,
     12
    ]
   ],
   [
    "Long private precision faceting atelier",
    [
     "secure-workroom"
    ],
    [
     1,
     12,
     14,
     33
    ]
   ],
   [
    "Short secure eastern gemstone vault",
    [
     "vault"
    ],
    [
     26,
     37,
     14,
     27
    ]
   ],
   [
    "Rear independent bridge appraisal hall",
    [
     "valuation-gallery"
    ],
    [
     15,
     23,
     27,
     33
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "front trade entry"
   ],
   [
    "sales-floor",
    "secure-workroom",
    "western secure port"
   ],
   [
    "sales-floor",
    "vault",
    "east guarded gate"
   ],
   [
    "secure-workroom",
    "valuation-gallery",
    "rear appraisal portal"
   ]
  ],
  "targets": [
   [
    "public sales",
    19,
    8
   ],
   [
    "west lapidary",
    7,
    22
   ],
   [
    "east vault",
    31,
    21
   ],
   [
    "rear appraisal",
    20,
    30
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "jewelry-display",
   "secure-workroom",
   "vault",
   "valuation-gallery"
  ],
  "signature": "nonrectangular temperate jewel atelier with long west crafts wing, short right vault and far rear raised appraisal bridge across a true open-air void"
 },
 {
  "category": "jeweler",
  "biome": "enchanted-forest",
  "size": "large",
  "variation": 2,
  "title": "Fernsunder Four-Fork Gem Conservatory",
  "w": 47,
  "d": 44,
  "h": 16,
  "plan": [
   [
    0,
    46,
    0,
    14
   ],
   [
    0,
    14,
    15,
    43
   ],
   [
    31,
    46,
    15,
    31
   ],
   [
    16,
    29,
    15,
    27
   ],
   [
    14,
    30,
    34,
    43
   ]
  ],
  "entry": [
   23,
   0
  ],
  "sky": [
   [
    18,
    29,
    3,
    9
   ]
  ],
  "partitions": [
   [
    "z",
    15,
    1,
    13,
    [
     7
    ]
   ],
   [
    "z",
    15,
    17,
    28,
    [
     23
    ]
   ],
   [
    "z",
    15,
    32,
    45,
    [
     39
    ]
   ],
   [
    "x",
    15,
    35,
    42,
    [
     39
    ]
   ]
  ],
  "furnishing": [
   [
    6,
    5,
    "display",
    "grove-amber"
   ],
   [
    40,
    6,
    "display",
    "gem-bourse"
   ],
   [
    23,
    12,
    "counter",
    "trading"
   ],
   [
    7,
    22,
    "table",
    "root-polisher"
   ],
   [
    9,
    37,
    "crate",
    "ore-storage"
   ],
   [
    23,
    22,
    "table",
    "moonstone"
   ],
   [
    39,
    21,
    "stone",
    "vault-plinth"
   ],
   [
    42,
    27,
    "crate",
    "vault-safe"
   ],
   [
    22,
    39,
    "table",
    "back-valuation"
   ],
   [
    27,
    41,
    "seat",
    "appraisal-stool"
   ],
   [
    6,
    32,
    "lamp",
    "root-light",
    "decor"
   ]
  ],
  "mass": [
   [
    2,
    13,
    18,
    42,
    8,
    "leaf",
    "long-root-gallery"
   ],
   [
    5,
    8,
    20,
    39,
    9,
    "wood",
    "root-spine"
   ],
   [
    17,
    28,
    19,
    26,
    8,
    "roof",
    "polishing-canopy"
   ],
   [
    21,
    24,
    21,
    25,
    9,
    "leaf",
    "polish-spire"
   ],
   [
    32,
    45,
    18,
    30,
    8,
    "wood",
    "east-gem-vault"
   ],
   [
    37,
    40,
    20,
    28,
    9,
    "leaf",
    "high-bough"
   ],
   [
    17,
    29,
    37,
    42,
    8,
    "roof",
    "back-conservatory-bridge"
   ],
   [
    22,
    25,
    39,
    41,
    9,
    "wood",
    "upper-bridge-ridge"
   ],
   [
    2,
    12,
    2,
    7,
    8,
    "leaf",
    "low-entry-portico"
   ]
  ],
  "rooms": [
   [
    "Enchanted forest public gem bazaar",
    [
     "sales-floor",
     "service-counter",
     "jewelry-display"
    ],
    [
     1,
     45,
     1,
     14
    ]
   ],
   [
    "Very long left guarded root gem atelier",
    [
     "secure-workroom"
    ],
    [
     1,
     13,
     16,
     42
    ]
   ],
   [
    "Separate short central polishing school",
    [
     "polishing-room"
    ],
    [
     17,
     28,
     16,
     26
    ]
   ],
   [
    "Short broad right secure gem vault",
    [
     "vault"
    ],
    [
     32,
     45,
     16,
     30
    ]
   ],
   [
    "Deep rear elevated authentication study",
    [
     "valuation-gallery"
    ],
    [
     16,
     29,
     35,
     42
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "grove public entrance"
   ],
   [
    "sales-floor",
    "secure-workroom",
    "left guarded door"
   ],
   [
    "sales-floor",
    "polishing-room",
    "center private door"
   ],
   [
    "sales-floor",
    "vault",
    "right secure door"
   ],
   [
    "secure-workroom",
    "valuation-gallery",
    "long west rear restricted transfer"
   ]
  ],
  "targets": [
   [
    "public exchange",
    23,
    10
   ],
   [
    "west rootworks",
    7,
    27
   ],
   [
    "center polisher",
    23,
    23
   ],
   [
    "right strongbox",
    39,
    22
   ],
   [
    "rear inspection",
    20,
    40
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "jewelry-display",
   "secure-workroom",
   "vault",
   "polishing-room",
   "valuation-gallery"
  ],
  "signature": "four dramatically sized forest gemstone arms separated by two genuinely open chasms, offset back bridge and independent livingwood weather ridges"
 },
 {
  "category": "butcher",
  "biome": "mountain",
  "size": "large",
  "variation": 2,
  "title": "Gorgewatch Five-Coldworks",
  "w": 49,
  "d": 43,
  "h": 16,
  "plan": [
   [
    0,
    48,
    0,
    13
   ],
   [
    0,
    15,
    14,
    41
   ],
   [
    20,
    30,
    14,
    25
   ],
   [
    33,
    48,
    14,
    41
   ],
   [
    15,
    33,
    35,
    42
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
  "partitions": [
   [
    "z",
    14,
    1,
    14,
    [
     8
    ]
   ],
   [
    "z",
    14,
    21,
    29,
    [
     25
    ]
   ],
   [
    "z",
    14,
    34,
    47,
    [
     40
    ]
   ],
   [
    "x",
    16,
    36,
    41,
    [
     39
    ]
   ],
   [
    "x",
    33,
    35,
    41,
    [
     39
    ]
   ]
  ],
  "furnishing": [
   [
    7,
    5,
    "counter",
    "public-sales"
   ],
   [
    40,
    6,
    "counter",
    "game-counter"
   ],
   [
    24,
    10,
    "display",
    "frozen-fish"
   ],
   [
    7,
    23,
    "crate",
    "cold-stock"
   ],
   [
    9,
    35,
    "crate",
    "ice-cellar"
   ],
   [
    24,
    20,
    "table",
    "sanitary-cutting"
   ],
   [
    39,
    22,
    "table",
    "game-trim"
   ],
   [
    43,
    35,
    "crate",
    "smoke-meat"
   ],
   [
    24,
    39,
    "table",
    "receiving"
   ],
   [
    28,
    40,
    "lamp",
    "rear-light",
    "decor"
   ]
  ],
  "mass": [
   [
    2,
    14,
    19,
    40,
    8,
    "stone",
    "west-cold-roof"
   ],
   [
    6,
    10,
    21,
    37,
    9,
    "stone",
    "west-high-frost-crest"
   ],
   [
    21,
    29,
    18,
    24,
    8,
    "wood",
    "middle-sanitary-roof"
   ],
   [
    24,
    26,
    20,
    23,
    9,
    "stone",
    "middle-ridge"
   ],
   [
    34,
    47,
    18,
    40,
    8,
    "stone",
    "eastern-smoking-roof"
   ],
   [
    38,
    42,
    20,
    36,
    9,
    "roof",
    "east-tall-ridge"
   ],
   [
    17,
    31,
    37,
    41,
    8,
    "wood",
    "back-goods-bridge"
   ],
   [
    22,
    26,
    39,
    40,
    9,
    "stone",
    "bridge-vent"
   ],
   [
    2,
    13,
    2,
    7,
    8,
    "stone",
    "front-shield"
   ]
  ],
  "rooms": [
   [
    "Mountain public butcher sales hall",
    [
     "sales-floor",
     "service-counter"
    ],
    [
     1,
     47,
     1,
     13
    ]
   ],
   [
    "Deep west insulated coldworks",
    [
     "cold-storage"
    ],
    [
     1,
     14,
     15,
     40
    ]
   ],
   [
    "Central separate hygienic cutting hall",
    [
     "butcher-workspace"
    ],
    [
     21,
     29,
     15,
     24
    ]
   ],
   [
    "Long east dry smokehouse",
    [
     "curing-area"
    ],
    [
     34,
     47,
     15,
     40
    ]
   ],
   [
    "Back protected inspection crossing",
    [
     "inspection-room"
    ],
    [
     17,
     32,
     36,
     41
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "south trade front"
   ],
   [
    "sales-floor",
    "cold-storage",
    "west secured door"
   ],
   [
    "sales-floor",
    "butcher-workspace",
    "hygiene gate"
   ],
   [
    "sales-floor",
    "curing-area",
    "east smoke gate"
   ],
   [
    "cold-storage",
    "inspection-room",
    "back west lock"
   ],
   [
    "curing-area",
    "inspection-room",
    "back east lock"
   ]
  ],
  "targets": [
   [
    "public counter",
    24,
    9
   ],
   [
    "west cold",
    8,
    27
   ],
   [
    "center cutting",
    25,
    20
   ],
   [
    "east smoke",
    40,
    26
   ],
   [
    "rear inspection",
    22,
    39
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "butcher-workspace",
   "cold-storage",
   "curing-area",
   "inspection-room"
  ],
  "signature": "vast alpine butcher with three totally distinct coldcraft arms, heavy slate weathering, two open canyon voids and real secured rear goods bridge"
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
export const M1_BESPOKE_COURTS=Object.freeze(DESIGNS.map(author));
