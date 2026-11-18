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
  "category": "theater",
  "biome": "desert",
  "size": "small",
  "variation": 2,
  "title": "Dustglass Tapered Shadowstage",
  "w": 31,
  "d": 34,
  "h": 15,
  "plan": [
   [
    0,
    30,
    0,
    8
   ],
   [
    5,
    25,
    9,
    26
   ],
   [
    11,
    19,
    27,
    33
   ],
   [
    0,
    9,
    16,
    23
   ]
  ],
  "entry": [
   15,
   0
  ],
  "sky": [
   [
    8,
    22,
    11,
    20
   ]
  ],
  "partitions": [
   [
    "z",
    27,
    12,
    18,
    [
     14,
     17
    ]
   ],
   [
    "x",
    10,
    16,
    25,
    [
     20
    ]
   ],
   [
    "z",
    16,
    5,
    9,
    [
     7
    ]
   ],
   [
    "z",
    23,
    5,
    9,
    []
   ]
  ],
  "furnishing": [
   [
    7,
    5,
    "counter",
    "tickets"
   ],
   [
    23,
    5,
    "display",
    "puppet-billboard"
   ],
   [
    8,
    14,
    "seat",
    "western-spectators"
   ],
   [
    22,
    14,
    "seat",
    "eastern-spectators"
   ],
   [
    4,
    20,
    "crate",
    "side-property"
   ],
   [
    13,
    30,
    "crate",
    "rear-puppets"
   ],
   [
    17,
    30,
    "table",
    "costume-repair"
   ],
   [
    7,
    21,
    "lamp",
    "west-gallery-light",
    "decor"
   ]
  ],
  "stage": [
   12,
   20,
   22,
   25
  ],
  "posts": [
   [
    10,
    22
   ],
   [
    21,
    22
   ],
   [
    6,
    25
   ],
   [
    24,
    25
   ]
  ],
  "mass": [
   [
    2,
    8,
    2,
    6,
    8,
    "stone",
    "left-trade-roof"
   ],
   [
    22,
    28,
    2,
    6,
    8,
    "roof",
    "right-trade-roof"
   ],
   [
    6,
    24,
    22,
    26,
    8,
    "stone",
    "four-pier-stage-canopy"
   ],
   [
    13,
    17,
    23,
    25,
    9,
    "roof",
    "high-puppet-sail"
   ],
   [
    14,
    16,
    24,
    24,
    10,
    "roof",
    "sundial-crest"
   ],
   [
    12,
    18,
    29,
    32,
    8,
    "roof",
    "rear-wardrobe-roof"
   ],
   [
    14,
    16,
    30,
    31,
    9,
    "stone",
    "rear-costume-ridge"
   ],
   [
    2,
    5,
    18,
    22,
    8,
    "stone",
    "far-left-prop-shelter"
   ]
  ],
  "rooms": [
   [
    "Open-air desert ticket and audience court",
    [
     "audience-area",
     "public-circulation"
    ],
    [
     1,
     29,
     1,
     21
    ]
   ],
   [
    "Raised shadow-puppet stage and side aisles",
    [
     "stage"
    ],
    [
     12,
     20,
     22,
     25
    ]
   ],
   [
    "Fully separated rear puppeteer dressing",
    [
     "backstage"
    ],
    [
     12,
     18,
     28,
     32
    ]
   ],
   [
    "Distinct west-side property workshop",
    [
     "prop-workshop"
    ],
    [
     1,
     9,
     17,
     22
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "audience-area",
    "southern trading approach"
   ],
   [
    "audience-area",
    "public-circulation",
    "open visitor aisle"
   ],
   [
    "public-circulation",
    "stage",
    "physical stair shape unresolved"
   ],
   [
    "public-circulation",
    "backstage",
    "guarded double rear doorway"
   ],
   [
    "public-circulation",
    "prop-workshop",
    "west property entry"
   ]
  ],
  "targets": [
   [
    "spectator seats",
    15,
    15
   ],
   [
    "approach to stage",
    15,
    21
   ],
   [
    "backstage dressing",
    15,
    30
   ],
   [
    "west property workshop",
    5,
    19
   ]
  ],
  "stairs": [
   [
    9,
    25
   ],
   [
    21,
    25
   ]
  ],
  "features": [
   "stage",
   "audience-area",
   "backstage",
   "public-circulation",
   "prop-workshop"
  ],
  "signature": "small desert puppet playhouse with genuinely tapered deep spectator area, supported roofed raised platform, accessible left rear aisle and independent prop workshop"
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
export const M1_SHADOWSTAGE=Object.freeze(DESIGNS.map(author));
