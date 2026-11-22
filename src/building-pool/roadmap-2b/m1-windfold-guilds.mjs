import {SCHEMA,validateBlueprint} from './schema.mjs';
// Three mutually independent original coordinate-authored, structurally different M1 architecture programs.
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
  "biome": "snow",
  "size": "medium",
  "variation": 2,
  "title": "Hailweft Four-Loft Snow Tailory",
  "w": 37,
  "d": 39,
  "h": 17,
  "plan": [
   [
    11,
    25,
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
    26,
    36,
    14,
    31
   ],
   [
    0,
    10,
    31,
    38
   ]
  ],
  "entry": [
   18,
   0
  ],
  "sky": [
   [
    15,
    21,
    3,
    7
   ]
  ],
  "divide": [
   [
    "x",
    11,
    10,
    26,
    [
     17
    ]
   ],
   [
    "x",
    25,
    14,
    31,
    [
     22
    ]
   ],
   [
    "x",
    11,
    31,
    37,
    [
     35
    ]
   ],
   [
    "z",
    29,
    12,
    24,
    [
     18
    ]
   ]
  ],
  "items": [
   [
    14,
    5,
    "display",
    "fur-lined-garments"
   ],
   [
    23,
    7,
    "display",
    "winter-linen"
   ],
   [
    18,
    11,
    "counter",
    "tailor-merchant"
   ],
   [
    5,
    20,
    "seat",
    "private-winter-fitting"
   ],
   [
    8,
    25,
    "table",
    "cut-and-repair"
   ],
   [
    31,
    21,
    "table",
    "blue-ice-dyeworks"
   ],
   [
    33,
    29,
    "crate",
    "mineral-dyes"
   ],
   [
    19,
    33,
    "table",
    "rear-ice-weaving"
   ],
   [
    22,
    36,
    "crate",
    "loom-weights"
   ],
   [
    6,
    35,
    "crate",
    "heated-fabric-storage"
   ],
   [
    7,
    37,
    "lamp",
    "cloth-ward",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    9,
    12,
    25,
    8,
    "snow",
    "west-frost-fitting-longhouse"
   ],
   [
    3,
    7,
    15,
    23,
    9,
    "roof",
    "west-steep-fur-gable"
   ],
   [
    4,
    6,
    17,
    21,
    10,
    "snow",
    "left-high-frost-woven-ridge"
   ],
   [
    5,
    5,
    18,
    19,
    11,
    "wood",
    "west-woven-finial"
   ],
   [
    27,
    35,
    16,
    30,
    8,
    "wood",
    "east-shaded-dye-loft"
   ],
   [
    29,
    33,
    19,
    28,
    9,
    "snow",
    "right-snow-loom-roof"
   ],
   [
    30,
    32,
    22,
    25,
    10,
    "roof",
    "short-right-dye-exhaust"
   ],
   [
    13,
    23,
    31,
    37,
    8,
    "roof",
    "north-ice-weaving-gallery"
   ],
   [
    15,
    21,
    33,
    36,
    9,
    "snow",
    "north-tall-cutting-roof"
   ],
   [
    17,
    19,
    34,
    35,
    10,
    "wood",
    "north-loft-crown"
   ],
   [
    1,
    9,
    33,
    37,
    8,
    "stone",
    "west-rear-sealed-fabric-vault"
   ],
   [
    3,
    7,
    35,
    36,
    9,
    "snow",
    "far-left-store-drift"
   ],
   [
    12,
    14,
    2,
    6,
    8,
    "snow",
    "asymmetrical-front-porch"
   ]
  ],
  "rooms": [
   [
    "Public deep winter garment sales gallery",
    [
     "sales-floor",
     "service-counter",
     "garment-display"
    ],
    [
     12,
     24,
     1,
     28
    ]
   ],
   [
    "West sealed warm fitting and seam repair wing",
    [
     "fitting-area"
    ],
    [
     1,
     9,
     11,
     25
    ]
   ],
   [
    "Right guarded frost dye and cloth dye lab",
    [
     "dye-room"
    ],
    [
     27,
     35,
     15,
     30
    ]
   ],
   [
    "Rear independent shuttle-loom weaving hall",
    [
     "weaving-loft"
    ],
    [
     12,
     24,
     30,
     37
    ]
   ],
   [
    "Far-west separately sealed fabric store",
    [
     "fabric-archive"
    ],
    [
     1,
     9,
     32,
     37
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "winter cloth merchant front door"
   ],
   [
    "sales-floor",
    "fitting-area",
    "west private fitting gate"
   ],
   [
    "sales-floor",
    "dye-room",
    "east dye access"
   ],
   [
    "sales-floor",
    "weaving-loft",
    "north woven wool room"
   ],
   [
    "weaving-loft",
    "fabric-archive",
    "left far rear heated fabric vault"
   ]
  ],
  "targets": [
   [
    "public woolens",
    18,
    9
   ],
   [
    "west fitting",
    5,
    17
   ],
   [
    "east dye",
    31,
    23
   ],
   [
    "north weave",
    19,
    34
   ],
   [
    "far-left fabrics",
    6,
    34
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "garment-display",
   "fitting-area",
   "dye-room",
   "weaving-loft",
   "fabric-archive"
  ],
  "signature": "Large-bayed snow tailor with thin public mercantile spine and three nonadjacent protected wings: very long west fitting, stepped east dye attic, north loom hall, small rear-left heated vault, all genuinely roofed and physically split by high snow gables"
 },
 {
  "category": "butcher",
  "biome": "enchanted-forest",
  "size": "large",
  "variation": 2,
  "title": "Bramblewake Root-Cold Artisan Butchery",
  "w": 49,
  "d": 45,
  "h": 18,
  "plan": [
   [
    16,
    32,
    0,
    44
   ],
   [
    0,
    15,
    9,
    33
   ],
   [
    33,
    48,
    14,
    29
   ],
   [
    0,
    15,
    38,
    44
   ],
   [
    33,
    48,
    35,
    44
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
    16,
    9,
    33,
    [
     15
    ]
   ],
   [
    "x",
    32,
    14,
    29,
    [
     21
    ]
   ],
   [
    "x",
    16,
    38,
    43,
    [
     41
    ]
   ],
   [
    "x",
    32,
    35,
    43,
    [
     39
    ]
   ],
   [
    "z",
    32,
    17,
    31,
    [
     24
    ]
   ]
  ],
  "items": [
   [
    19,
    5,
    "counter",
    "enchanted-wild-game-counter"
   ],
   [
    29,
    7,
    "display",
    "herb-smoked-forestdraw"
   ],
   [
    23,
    11,
    "counter",
    "merchant-inspector"
   ],
   [
    8,
    18,
    "crate",
    "left-root-cellar"
   ],
   [
    11,
    30,
    "crate",
    "deep-forest-preserves"
   ],
   [
    41,
    19,
    "table",
    "fungal-safe-butchery"
   ],
   [
    45,
    27,
    "table",
    "game-cleaning"
   ],
   [
    24,
    36,
    "table",
    "northern-cold-smoke-room"
   ],
   [
    26,
    41,
    "crate",
    "smokeberry-herbs"
   ],
   [
    8,
    41,
    "crate",
    "west-cold-dry-reserve"
   ],
   [
    41,
    40,
    "table",
    "far-east-cured-meat-check"
   ],
   [
    44,
    43,
    "lamp",
    "forest-check-light",
    "decor"
   ]
  ],
  "steps": [
   [
    2,
    14,
    11,
    31,
    8,
    "leaf",
    "western-root-cellar-long-bough"
   ],
   [
    5,
    11,
    15,
    29,
    9,
    "wood",
    "root-chilled-fluted-ridge"
   ],
   [
    7,
    9,
    18,
    26,
    10,
    "leaf",
    "west-livingroot-high-arch"
   ],
   [
    8,
    8,
    21,
    23,
    11,
    "wood",
    "west-crest-leaf-needle"
   ],
   [
    34,
    47,
    16,
    27,
    8,
    "stone",
    "eastern-stone-hygiene-gallery"
   ],
   [
    37,
    44,
    19,
    26,
    9,
    "leaf",
    "east-cool-berry-crossroof"
   ],
   [
    40,
    42,
    21,
    24,
    10,
    "wood",
    "east-forest-fume-finial"
   ],
   [
    18,
    30,
    34,
    43,
    8,
    "wood",
    "northern-cold-smoking-bridge"
   ],
   [
    20,
    28,
    36,
    41,
    9,
    "leaf",
    "smokehill-low-root-dome"
   ],
   [
    23,
    25,
    37,
    39,
    10,
    "roof",
    "upper-forest-smoke-vent"
   ],
   [
    2,
    14,
    40,
    43,
    8,
    "stone",
    "rear-left-climate-reserve"
   ],
   [
    5,
    11,
    41,
    42,
    9,
    "leaf",
    "left-pantry-frost-bough"
   ],
   [
    34,
    47,
    37,
    43,
    8,
    "wood",
    "right-rear-curing-facility"
   ],
   [
    37,
    44,
    39,
    42,
    9,
    "leaf",
    "right-curing-broad-bough"
   ],
   [
    40,
    42,
    40,
    41,
    10,
    "wood",
    "right-cure-signal-ridge"
   ],
   [
    17,
    19,
    2,
    7,
    8,
    "leaf",
    "offcenter-west-public-arcade"
   ]
  ],
  "rooms": [
   [
    "Public forest trader butcher sales corridor",
    [
     "sales-floor",
     "service-counter"
    ],
    [
     17,
     31,
     1,
     31
    ]
   ],
   [
    "Far west vast buried chilled-root stockrooms",
    [
     "cold-storage"
    ],
    [
     1,
     14,
     10,
     32
    ]
   ],
   [
    "East sanitary oakstone game preparation",
    [
     "butcher-workspace"
    ],
    [
     34,
     47,
     15,
     28
    ]
   ],
   [
    "North central controlled wildflower smoke hall",
    [
     "curing-area"
    ],
    [
     17,
     31,
     33,
     43
    ]
   ],
   [
    "Rear-left separated reserved cellar",
    [
     "provisions-vault"
    ],
    [
     1,
     14,
     39,
     43
    ]
   ],
   [
    "Rear-right independent inspected drying room",
    [
     "inspection-room"
    ],
    [
     34,
     47,
     36,
     43
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "southern wild-game trading front"
   ],
   [
    "sales-floor",
    "cold-storage",
    "west root-cellar safety gate"
   ],
   [
    "sales-floor",
    "butcher-workspace",
    "east hygiene-controlled workshop"
   ],
   [
    "sales-floor",
    "curing-area",
    "northern-smoke-door"
   ],
   [
    "curing-area",
    "provisions-vault",
    "left dry-reserve hatch"
   ],
   [
    "curing-area",
    "inspection-room",
    "right inspected-smoking-door"
   ]
  ],
  "targets": [
   [
    "public forest market",
    24,
    12
   ],
   [
    "left rooted coldstore",
    8,
    20
   ],
   [
    "east butcher workroom",
    41,
    23
   ],
   [
    "northern smoky curing",
    24,
    38
   ],
   [
    "rear-left reserves",
    8,
    42
   ],
   [
    "rear-right quality inspection",
    41,
    41
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "cold-storage",
   "butcher-workspace",
   "curing-area",
   "provisions-vault",
   "inspection-room"
  ],
  "signature": "Enchanted five-fork butchery with real long left cooled roots, separate small right oakstone hygienic workroom, deep northern controlled smoke-bridge and two diagonal distinct rear storehouses under unequal y11 livingwood ventilation ridges"
 },
 {
  "category": "jeweler",
  "biome": "desert",
  "size": "large",
  "variation": 2,
  "title": "Qamar-Seam Faceted Star Treasury",
  "w": 47,
  "d": 43,
  "h": 18,
  "plan": [
   [
    14,
    32,
    0,
    42
   ],
   [
    0,
    13,
    9,
    28
   ],
   [
    33,
    46,
    14,
    35
   ],
   [
    0,
    13,
    33,
    42
   ],
   [
    33,
    46,
    38,
    42
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
    3,
    8
   ]
  ],
  "divide": [
   [
    "x",
    14,
    9,
    28,
    [
     15
    ]
   ],
   [
    "x",
    32,
    14,
    35,
    [
     20
    ]
   ],
   [
    "x",
    14,
    33,
    41,
    [
     38
    ]
   ],
   [
    "x",
    32,
    38,
    41,
    [
     40
    ]
   ],
   [
    "z",
    30,
    15,
    31,
    [
     23
    ]
   ]
  ],
  "items": [
   [
    18,
    5,
    "display",
    "desert-topaz"
   ],
   [
    28,
    7,
    "display",
    "heliodor-celestial-wares"
   ],
   [
    23,
    12,
    "counter",
    "qamar-gem-ledgers"
   ],
   [
    7,
    18,
    "table",
    "western-lapidary-faceting"
   ],
   [
    10,
    26,
    "crate",
    "raw-uncut-sandsilver"
   ],
   [
    40,
    20,
    "stone",
    "guarded-right-bullion-plinth"
   ],
   [
    44,
    31,
    "display",
    "jewelled-moon-ore"
   ],
   [
    23,
    36,
    "table",
    "north-back-appraisal-scope"
   ],
   [
    28,
    40,
    "seat",
    "sealed-valuation-chair"
   ],
   [
    7,
    38,
    "crate",
    "west-rear-rare-ore-deposit"
   ],
   [
    40,
    40,
    "table",
    "east-illumination-experiment"
   ],
   [
    43,
    41,
    "lamp",
    "laboratory-lantern",
    "decor"
   ]
  ],
  "steps": [
   [
    2,
    12,
    11,
    27,
    8,
    "stone",
    "west-sand-lapidary-terrace"
   ],
   [
    5,
    10,
    15,
    25,
    9,
    "roof",
    "western-faceted-angled-gable"
   ],
   [
    7,
    8,
    18,
    22,
    10,
    "stone",
    "faceting-crest"
   ],
   [
    7,
    7,
    19,
    20,
    11,
    "roof",
    "highest-west-topaz-needle"
   ],
   [
    34,
    45,
    16,
    33,
    8,
    "stone",
    "east-gold-guarded-strongbox"
   ],
   [
    37,
    43,
    20,
    30,
    9,
    "roof",
    "east-high-guarded-dome"
   ],
   [
    39,
    41,
    22,
    27,
    10,
    "stone",
    "eastern-appraised-ridge"
   ],
   [
    40,
    40,
    24,
    25,
    11,
    "roof",
    "east-needle"
   ],
   [
    16,
    30,
    32,
    41,
    8,
    "roof",
    "north-inspection-scope-gallery"
   ],
   [
    19,
    27,
    35,
    39,
    9,
    "stone",
    "north-faceted-longridge"
   ],
   [
    22,
    24,
    36,
    38,
    10,
    "roof",
    "north-mooncrest"
   ],
   [
    2,
    12,
    35,
    41,
    8,
    "stone",
    "left-separate-rare-ore-reserve"
   ],
   [
    5,
    10,
    37,
    39,
    9,
    "roof",
    "rearwest-heavy-lock-roof"
   ],
   [
    34,
    45,
    39,
    41,
    8,
    "stone",
    "rear-east-research-lab"
   ],
   [
    38,
    42,
    40,
    40,
    9,
    "roof",
    "far-east-lab-shortcrest"
   ],
   [
    15,
    18,
    2,
    7,
    8,
    "stone",
    "offset-public-portico"
   ]
  ],
  "rooms": [
   [
    "Long central desert gemstone merchandising hall",
    [
     "sales-floor",
     "service-counter",
     "jewelry-display"
    ],
    [
     15,
     31,
     1,
     29
    ]
   ],
   [
    "West full-depth skilled gemstone cutting school",
    [
     "secure-workroom"
    ],
    [
     1,
     12,
     10,
     27
    ]
   ],
   [
    "East wide sealed bullion and royal star vault",
    [
     "vault"
    ],
    [
     34,
     45,
     15,
     34
    ]
   ],
   [
    "North central appraisal and authentication court",
    [
     "valuation-gallery"
    ],
    [
     15,
     31,
     31,
     41
    ]
   ],
   [
    "Rear-west sealed uncut ores",
    [
     "ore-vault"
    ],
    [
     1,
     12,
     34,
     41
    ]
   ],
   [
    "Far-east separate astronomical gemstone laboratory",
    [
     "light-lab"
    ],
    [
     34,
     45,
     39,
     41
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "southern jewel exchange gate"
   ],
   [
    "sales-floor",
    "secure-workroom",
    "west crafts port"
   ],
   [
    "sales-floor",
    "vault",
    "east separately controlled vault"
   ],
   [
    "sales-floor",
    "valuation-gallery",
    "north guarded appraisal"
   ],
   [
    "valuation-gallery",
    "ore-vault",
    "northwest ore reserve door"
   ],
   [
    "valuation-gallery",
    "light-lab",
    "east constellation lab door"
   ]
  ],
  "targets": [
   [
    "public sun gems",
    23,
    10
   ],
   [
    "west apprentice cutting",
    7,
    20
   ],
   [
    "east royal vault",
    40,
    24
   ],
   [
    "north independent appraisal",
    25,
    37
   ],
   [
    "northwest rare ores",
    7,
    37
   ],
   [
    "right rear astral light",
    41,
    40
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "jewelry-display",
   "secure-workroom",
   "vault",
   "valuation-gallery",
   "ore-vault",
   "light-lab"
  ],
  "signature": "Huge desert gem fortress with five asymmetrically spoked private trade and research chambers, physically hollow side courts, and three differently elevated faceted roof pyramids plus isolated vault and stargazing parapets at y11"
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
  architecturalSignature:s.signature,roof:{form:'seven to sixteen region-specific supported multi-level gables across truly missing courtyard ground',biomeSpecific:true},
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
export const M1_WINDFOLD_GUILDS=Object.freeze(DESIGNS.map(author));
