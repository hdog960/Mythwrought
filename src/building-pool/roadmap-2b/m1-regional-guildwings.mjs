import {SCHEMA,validateBlueprint} from './schema.mjs';
// Three original coordinate-authored, structurally different M1 architecture programs.
// Fixed source-coordinate occupied voxel definitions; no procedural seed and no world placement.
const A={stone:'pack1:002',path:'pack1:005',stair:'pack1:008',
 wood:'pack2:013',beam:'pack2:015',post:'pack2:022',
 roof:'pack3:023',snow:'pack3:025',leaf:'pack3:026',
 glass:'pack4:030',frame:'pack4:032',lamp:'pack4:035',
 crate:'pack4:057',seat:'pack4:058',table:'pack4:059',
 counter:'pack5:086',display:'pack5:087',altar:'pack5:093'};
const DESIGNS=[
 {
  "category": "butcher",
  "biome": "desert",
  "size": "small",
  "variation": 2,
  "title": "Khasim Cooling-Tower Meat Exchange",
  "w": 31,
  "d": 32,
  "h": 15,
  "plan": [
   [
    8,
    22,
    0,
    31
   ],
   [
    0,
    7,
    9,
    22
   ],
   [
    23,
    30,
    13,
    29
   ],
   [
    0,
    7,
    24,
    31
   ]
  ],
  "entry": [
   15,
   0
  ],
  "sky": [
   [
    11,
    19,
    2,
    8
   ]
  ],
  "divide": [
   [
    "x",
    8,
    9,
    22,
    [
     14
    ]
   ],
   [
    "x",
    22,
    13,
    29,
    [
     21
    ]
   ],
   [
    "x",
    8,
    24,
    30,
    [
     27
    ]
   ]
  ],
  "items": [
   [
    11,
    5,
    "counter",
    "caravan-salt-meats"
   ],
   [
    19,
    6,
    "counter",
    "preserved-game"
   ],
   [
    15,
    10,
    "display",
    "desert-smoked-jerky"
   ],
   [
    4,
    15,
    "crate",
    "west-salt-larder"
   ],
   [
    5,
    21,
    "crate",
    "dry-herb-storage"
   ],
   [
    26,
    17,
    "table",
    "clean-stone-processing"
   ],
   [
    25,
    25,
    "table",
    "sun-shaded-butchery"
   ],
   [
    4,
    28,
    "crate",
    "sealed-provision-backroom"
   ],
   [
    6,
    29,
    "lamp",
    "storage-safety-lamp",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    6,
    11,
    21,
    8,
    "stone",
    "western-cooling-cellar"
   ],
   [
    3,
    5,
    13,
    19,
    9,
    "roof",
    "west-ventilated-cap"
   ],
   [
    4,
    4,
    16,
    17,
    10,
    "stone",
    "tiny-windshaft"
   ],
   [
    24,
    29,
    15,
    28,
    8,
    "roof",
    "east-shaded-hygiene-works"
   ],
   [
    26,
    28,
    17,
    25,
    9,
    "stone",
    "east-evaporative-crest"
   ],
   [
    27,
    27,
    19,
    23,
    10,
    "roof",
    "high-east-wind-throat"
   ],
   [
    1,
    6,
    25,
    30,
    8,
    "stone",
    "sealed-rear-saltstore"
   ],
   [
    3,
    5,
    26,
    29,
    9,
    "roof",
    "rear-salt-vent"
   ],
   [
    9,
    10,
    2,
    7,
    8,
    "roof",
    "offset-market-sun-shade"
   ]
  ],
  "rooms": [
   [
    "Narrow public dry-meat trade spine",
    [
     "sales-floor",
     "service-counter"
    ],
    [
     9,
     21,
     1,
     30
    ]
   ],
   [
    "Western separated salted-food coldstore",
    [
     "cold-storage"
    ],
    [
     1,
     6,
     10,
     21
    ]
   ],
   [
    "Eastern independently sanitary cutting workshop",
    [
     "butcher-workspace"
    ],
    [
     24,
     29,
     14,
     28
    ]
   ],
   [
    "Rear west climate-protected provisions store",
    [
     "curing-area"
    ],
    [
     1,
     6,
     25,
     30
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "southern market entry"
   ],
   [
    "sales-floor",
    "cold-storage",
    "west thick cooling door"
   ],
   [
    "sales-floor",
    "butcher-workspace",
    "east sanitary threshold"
   ],
   [
    "sales-floor",
    "curing-area",
    "rear lockable dry-stock gate"
   ]
  ],
  "targets": [
   [
    "dry meat counter",
    15,
    7
   ],
   [
    "left curing cellar",
    4,
    18
   ],
   [
    "east clean workroom",
    26,
    22
   ],
   [
    "rear dry provisions",
    4,
    28
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "cold-storage",
   "butcher-workspace",
   "curing-area"
  ],
  "signature": "small desert cooled butchery with long slim north-south sales spine, two uneven hooked side rooms and separately secured rear left salt cellar, three contrasting evaporative roof vents"
 },
 {
  "category": "tailor",
  "biome": "temperate",
  "size": "large",
  "variation": 2,
  "title": "Brindleford Seven-Gable Cloth Guild",
  "w": 45,
  "d": 44,
  "h": 17,
  "plan": [
   [
    15,
    29,
    0,
    43
   ],
   [
    0,
    14,
    11,
    29
   ],
   [
    30,
    44,
    15,
    34
   ],
   [
    0,
    14,
    33,
    42
   ],
   [
    30,
    44,
    37,
    43
   ]
  ],
  "entry": [
   22,
   0
  ],
  "sky": [
   [
    19,
    25,
    3,
    9
   ]
  ],
  "divide": [
   [
    "x",
    15,
    11,
    29,
    [
     18
    ]
   ],
   [
    "x",
    29,
    15,
    34,
    [
     24
    ]
   ],
   [
    "x",
    15,
    33,
    42,
    [
     37
    ]
   ],
   [
    "x",
    29,
    37,
    42,
    [
     39
    ]
   ],
   [
    "z",
    31,
    16,
    28,
    [
     22
    ]
   ]
  ],
  "items": [
   [
    17,
    5,
    "display",
    "woolen-coats"
   ],
   [
    26,
    7,
    "display",
    "silk-capes"
   ],
   [
    22,
    11,
    "counter",
    "guild-seamstress"
   ],
   [
    6,
    19,
    "seat",
    "fitting-model-room"
   ],
   [
    9,
    26,
    "table",
    "handstitch-patterns"
   ],
   [
    36,
    22,
    "table",
    "satin-dye-vats"
   ],
   [
    40,
    30,
    "table",
    "cloth-cutting-station"
   ],
   [
    6,
    38,
    "crate",
    "northern-wool-stocks"
   ],
   [
    9,
    40,
    "crate",
    "linen-lots"
   ],
   [
    36,
    39,
    "crate",
    "export-thread-spools"
   ],
   [
    22,
    35,
    "table",
    "north-weaving-guild"
   ],
   [
    25,
    39,
    "seat",
    "fabric-inspector"
   ],
   [
    35,
    40,
    "lamp",
    "east-stock-night-lamp",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    13,
    13,
    28,
    8,
    "wood",
    "western-fitting-timber-gable"
   ],
   [
    4,
    11,
    16,
    26,
    9,
    "roof",
    "west-tailor-steep-gable"
   ],
   [
    7,
    9,
    19,
    23,
    10,
    "wood",
    "west-high-crest"
   ],
   [
    31,
    43,
    17,
    33,
    8,
    "stone",
    "eastern-dye-atelier-stone"
   ],
   [
    34,
    41,
    20,
    30,
    9,
    "roof",
    "east-satin-crossgabled-roof"
   ],
   [
    37,
    39,
    23,
    27,
    10,
    "stone",
    "eastern-exhaust-crest"
   ],
   [
    1,
    13,
    35,
    41,
    8,
    "wood",
    "northwest-garment-vault"
   ],
   [
    3,
    10,
    37,
    40,
    9,
    "roof",
    "northwest-fabric-crown"
   ],
   [
    31,
    43,
    38,
    42,
    8,
    "wood",
    "north-east-spool-store-roof"
   ],
   [
    34,
    39,
    39,
    41,
    9,
    "roof",
    "east-stock-high-gable"
   ],
   [
    17,
    27,
    33,
    42,
    8,
    "roof",
    "north-center-weaving-vault"
   ],
   [
    19,
    24,
    35,
    40,
    9,
    "wood",
    "north-weave-ridge"
   ],
   [
    21,
    22,
    37,
    39,
    10,
    "roof",
    "north-high-cutting-beacon"
   ],
   [
    16,
    18,
    2,
    7,
    8,
    "wood",
    "offset-guild-public-porch"
   ]
  ],
  "rooms": [
   [
    "Public long guild garment retail gallery",
    [
     "sales-floor",
     "service-counter",
     "garment-display"
    ],
    [
     16,
     28,
     1,
     30
    ]
   ],
   [
    "West deep custom fitting and cutting rooms",
    [
     "fitting-area"
    ],
    [
     1,
     13,
     12,
     28
    ]
   ],
   [
    "East ventilated garment dye works",
    [
     "dye-room"
    ],
    [
     31,
     43,
     16,
     33
    ]
   ],
   [
    "North guild protected weaving loft",
    [
     "weaving-loft"
    ],
    [
     16,
     28,
     32,
     42
    ]
   ],
   [
    "Rear west raw cloth supply and archives",
    [
     "fabric-archive"
    ],
    [
     1,
     13,
     34,
     41
    ]
   ],
   [
    "Right rear separately protected wool and spool room",
    [
     "spool-store"
    ],
    [
     31,
     43,
     38,
     42
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "large southerly street front"
   ],
   [
    "sales-floor",
    "fitting-area",
    "west client fitting gate"
   ],
   [
    "sales-floor",
    "dye-room",
    "right worker sanitary gate"
   ],
   [
    "sales-floor",
    "weaving-loft",
    "north weaving transfer"
   ],
   [
    "sales-floor",
    "fabric-archive",
    "western rear stock portal"
   ],
   [
    "sales-floor",
    "spool-store",
    "eastern rear store lock"
   ]
  ],
  "targets": [
   [
    "public guild display",
    22,
    8
   ],
   [
    "west private fitting",
    7,
    20
   ],
   [
    "east dye floors",
    37,
    24
   ],
   [
    "north weaving",
    22,
    37
   ],
   [
    "west archive",
    7,
    38
   ],
   [
    "east wool store",
    36,
    40
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
  "signature": "large temperate cross-lobed artisan guild with long exposed central sales spine, four asymmetrical privately gated fitting, dye and stock spurs and seven independently supported multi-height gables"
 },
 {
  "category": "jeweler",
  "biome": "snow",
  "size": "small",
  "variation": 2,
  "title": "Frostsilver Split-Vault Jeweler",
  "w": 29,
  "d": 32,
  "h": 15,
  "plan": [
   [
    9,
    19,
    0,
    31
   ],
   [
    0,
    8,
    11,
    25
   ],
   [
    20,
    28,
    15,
    23
   ],
   [
    0,
    8,
    27,
    31
   ]
  ],
  "entry": [
   14,
   0
  ],
  "sky": [
   [
    12,
    17,
    3,
    8
   ]
  ],
  "divide": [
   [
    "x",
    9,
    11,
    25,
    [
     16
    ]
   ],
   [
    "x",
    19,
    15,
    23,
    [
     19
    ]
   ],
   [
    "x",
    9,
    27,
    30,
    [
     29
    ]
   ]
  ],
  "items": [
   [
    11,
    5,
    "display",
    "frost-amber"
   ],
   [
    17,
    6,
    "display",
    "snow-silver"
   ],
   [
    14,
    9,
    "counter",
    "whiteglen-gem-merchant"
   ],
   [
    4,
    17,
    "table",
    "western-lapidary"
   ],
   [
    5,
    23,
    "crate",
    "uncut-icestones"
   ],
   [
    25,
    19,
    "stone",
    "secure-gem-pedestal"
   ],
   [
    24,
    22,
    "display",
    "snow-opals"
   ],
   [
    4,
    29,
    "crate",
    "back-silver-reserve"
   ],
   [
    3,
    30,
    "lamp",
    "west-vault-lamp",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    7,
    13,
    24,
    8,
    "snow",
    "left-long-silversmith-roof"
   ],
   [
    3,
    6,
    15,
    22,
    9,
    "roof",
    "west-steep-silver-gable"
   ],
   [
    4,
    5,
    17,
    20,
    10,
    "snow",
    "west-ice-finial"
   ],
   [
    21,
    27,
    17,
    22,
    8,
    "stone",
    "short-right-bank-vault"
   ],
   [
    23,
    25,
    18,
    21,
    9,
    "snow",
    "guarded-right-short-crest"
   ],
   [
    1,
    7,
    28,
    30,
    8,
    "stone",
    "remote-silver-vault-roof"
   ],
   [
    3,
    5,
    29,
    29,
    9,
    "snow",
    "far-rear-vault-crest"
   ],
   [
    10,
    11,
    2,
    6,
    8,
    "snow",
    "front-weather-arcade"
   ]
  ],
  "rooms": [
   [
    "Public winter gemstone sales passage",
    [
     "sales-floor",
     "service-counter",
     "jewelry-display"
    ],
    [
     10,
     18,
     1,
     30
    ]
   ],
   [
    "Long left goldsmith and lapidary works",
    [
     "secure-workroom"
    ],
    [
     1,
     7,
     12,
     24
    ]
   ],
   [
    "Short east sealed silver vault",
    [
     "vault"
    ],
    [
     21,
     27,
     16,
     22
    ]
   ],
   [
    "Rear independently gated reserve",
    [
     "valuation-gallery"
    ],
    [
     1,
     7,
     28,
     30
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "southern winter retail gate"
   ],
   [
    "sales-floor",
    "secure-workroom",
    "left private craft gate"
   ],
   [
    "sales-floor",
    "vault",
    "east bullion vault lock"
   ],
   [
    "sales-floor",
    "valuation-gallery",
    "far rear stock gate"
   ]
  ],
  "targets": [
   [
    "public silver counter",
    14,
    6
   ],
   [
    "left silverwork",
    4,
    18
   ],
   [
    "east gem vault",
    24,
    19
   ],
   [
    "rear silver reserves",
    4,
    29
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
  "signature": "tiny icy shop with narrow central merchandising spine, west elongate metalwork bough, completely separate right small guarded strongbox and off-rear left appraisal vault with three distinct snow ridges"
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
export const M1_REGIONAL_GUILDWINGS=Object.freeze(DESIGNS.map(author));
