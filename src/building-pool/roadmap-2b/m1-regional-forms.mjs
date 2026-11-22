import {SCHEMA,validateBlueprint} from './schema.mjs';
// Three source-specific geometric L, hollow-U and hollow-ring constructions. No procedural generator seeds or gameplay registration.
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
  "biome": "mountain",
  "size": "large",
  "variation": 2,
  "title": "Hawkspine L-Cliff Clothworks",
  "w": 48,
  "d": 44,
  "h": 17,
  "plan": [
   [
    4,
    44,
    0,
    12
   ],
   [
    4,
    19,
    13,
    43
   ],
   [
    26,
    37,
    13,
    22
   ]
  ],
  "entry": [
   24,
   0
  ],
  "sky": [
   [
    20,
    27,
    3,
    6
   ]
  ],
  "divide": [
   [
    "z",
    13,
    5,
    18,
    [
     13
    ]
   ],
   [
    "z",
    29,
    5,
    18,
    [
     12
    ]
   ],
   [
    "z",
    13,
    27,
    36,
    [
     32
    ]
   ]
  ],
  "items": [
   [
    11,
    6,
    "display",
    "cliff-cloaks"
   ],
   [
    35,
    6,
    "display",
    "walking-ropes"
   ],
   [
    24,
    9,
    "counter",
    "highland-weft-sales"
   ],
   [
    11,
    21,
    "table",
    "stone-mill-dye-frames"
   ],
   [
    8,
    35,
    "crate",
    "deep-wool-bales"
   ],
   [
    31,
    18,
    "seat",
    "private-tailor-fittings"
   ],
   [
    37,
    9,
    "lamp",
    "forecourt-lantern",
    "decor"
   ]
  ],
  "steps": [
   [
    6,
    17,
    15,
    40,
    8,
    "stone",
    "long-lower-cliff-atelier"
   ],
   [
    8,
    15,
    18,
    37,
    9,
    "roof",
    "oblique-loom-mountain-ridge"
   ],
   [
    10,
    13,
    21,
    33,
    10,
    "stone",
    "upper-hardstone-loom-spine"
   ],
   [
    11,
    12,
    24,
    30,
    11,
    "roof",
    "slender-cliff-needle"
   ],
   [
    28,
    35,
    15,
    20,
    8,
    "wood",
    "right-short-fitting-roof"
   ],
   [
    30,
    33,
    16,
    19,
    9,
    "stone",
    "fitting-cross-gable"
   ],
   [
    31,
    32,
    17,
    18,
    10,
    "roof",
    "small-right-loom-crown"
   ],
   [
    31,
    31,
    17,
    17,
    11,
    "stone",
    "right-hawkbill-finial"
   ],
   [
    7,
    18,
    2,
    10,
    8,
    "stone",
    "western-front-long-shop-gable"
   ],
   [
    9,
    16,
    4,
    8,
    9,
    "wood",
    "front-left-weavers-bracing"
   ],
   [
    11,
    14,
    5,
    7,
    10,
    "roof",
    "front-left-crest"
   ],
   [
    30,
    41,
    2,
    10,
    8,
    "stone",
    "eastern-front-merchants-gable"
   ],
   [
    33,
    38,
    4,
    8,
    9,
    "roof",
    "front-right-rock-arcade"
   ],
   [
    35,
    36,
    5,
    7,
    10,
    "stone",
    "front-right-needle"
   ],
   [
    35,
    35,
    6,
    6,
    11,
    "roof",
    "front-tower-signal"
   ],
   [
    21,
    26,
    8,
    10,
    8,
    "wood",
    "central-price-board-awning"
   ]
  ],
  "rooms": [
   [
    "Wide highland cloth market front",
    [
     "sales-floor",
     "service-counter",
     "garment-display"
    ],
    [
     5,
     43,
     1,
     11
    ]
   ],
   [
    "Very long L-shaped west weaving and dyed-cloth loom",
    [
     "weaving-loft"
    ],
    [
     5,
     18,
     14,
     28
    ]
   ],
   [
    "Deep west protected fleece vault",
    [
     "fabric-archive"
    ],
    [
     5,
     18,
     30,
     42
    ]
   ],
   [
    "Short separate east custom fitting room",
    [
     "fitting-area"
    ],
    [
     27,
     36,
     14,
     21
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "mountain-main-street"
   ],
   [
    "sales-floor",
    "weaving-loft",
    "separate west high-loom door"
   ],
   [
    "weaving-loft",
    "fabric-archive",
    "deep-wool-archive-key"
   ],
   [
    "sales-floor",
    "fitting-area",
    "east-ridge-private-tailor"
   ]
  ],
  "targets": [
   [
    "public cloth",
    24,
    8
   ],
   [
    "loom",
    12,
    20
   ],
   [
    "fleece vault",
    10,
    36
   ],
   [
    "east fitting",
    32,
    18
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "garment-display",
   "weaving-loft",
   "fabric-archive",
   "fitting-area"
  ],
  "signature": "Genuine L with broad east-west storefront, single long south-left loom stem, short right fitting annex, independent perpendicular rooftop spires on two entirely different lengths"
 },
 {
  "category": "butcher",
  "biome": "enchanted-forest",
  "size": "small",
  "variation": 2,
  "title": "Greenthorn U-Court Coldroot Butchery",
  "w": 34,
  "d": 35,
  "h": 17,
  "plan": [
   [
    0,
    9,
    0,
    34
   ],
   [
    24,
    33,
    5,
    34
   ],
   [
    10,
    23,
    25,
    34
   ]
  ],
  "entry": [
   5,
   0
  ],
  "sky": [
   [
    2,
    7,
    3,
    7
   ]
  ],
  "divide": [
   [
    "z",
    15,
    1,
    8,
    [
     5
    ]
   ],
   [
    "z",
    25,
    1,
    8,
    [
     5
    ]
   ],
   [
    "x",
    24,
    25,
    33,
    [
     30
    ]
   ]
  ],
  "items": [
   [
    4,
    7,
    "counter",
    "public-fungal-venison"
   ],
   [
    4,
    19,
    "crate",
    "forest-root-cooled-food"
   ],
   [
    6,
    29,
    "crate",
    "deeper-chilled-stocks"
   ],
   [
    16,
    29,
    "table",
    "courtyard-smoke-inspection"
   ],
   [
    29,
    18,
    "table",
    "secure-stone-butcher-cutting"
   ],
   [
    30,
    28,
    "crate",
    "smoked-herb-inventory"
   ],
   [
    28,
    32,
    "lamp",
    "root-cold-illuminator",
    "decor"
   ]
  ],
  "steps": [
   [
    1,
    8,
    17,
    32,
    8,
    "leaf",
    "long-west-chilled-rootroof"
   ],
   [
    3,
    7,
    19,
    30,
    9,
    "wood",
    "west-root-reinforcing-rib"
   ],
   [
    4,
    6,
    22,
    28,
    10,
    "leaf",
    "deep-shaded-root-high-ridge"
   ],
   [
    5,
    5,
    24,
    26,
    11,
    "wood",
    "western-spire-of-root"
   ],
   [
    25,
    32,
    7,
    23,
    8,
    "wood",
    "long-east-sanitized-cutting-gable"
   ],
   [
    27,
    31,
    10,
    20,
    9,
    "leaf",
    "east-broad-greenroof"
   ],
   [
    28,
    30,
    13,
    18,
    10,
    "stone",
    "east-butcher-smoke-tower"
   ],
   [
    29,
    29,
    15,
    17,
    11,
    "leaf",
    "east-vent-tree-needle"
   ],
   [
    11,
    22,
    27,
    33,
    8,
    "roof",
    "rear-U-bridge-smoke-tunnel"
   ],
   [
    14,
    19,
    29,
    32,
    9,
    "wood",
    "rear-dry-cure-crossbeam"
   ],
   [
    16,
    17,
    30,
    31,
    10,
    "leaf",
    "rear-cure-crown"
   ],
   [
    1,
    8,
    8,
    10,
    8,
    "leaf",
    "west-public-courtyard-portal"
   ],
   [
    2,
    7,
    9,
    9,
    9,
    "wood",
    "open-market-lean-to"
   ]
  ],
  "rooms": [
   [
    "Accessible west public counter facing open courtyard",
    [
     "sales-floor",
     "service-counter"
    ],
    [
     1,
     8,
     1,
     14
    ]
   ],
   [
    "West long root-chilled cellar",
    [
     "cold-storage"
    ],
    [
     1,
     8,
     16,
     24
    ]
   ],
   [
    "Deeper western food reserve",
    [
     "provisions-vault"
    ],
    [
     1,
     8,
     26,
     33
    ]
   ],
   [
    "Connected south smoke inspection ring",
    [
     "curing-area"
    ],
    [
     10,
     23,
     26,
     33
    ]
   ],
   [
    "East hygienic guarded workshop branch",
    [
     "butcher-workspace"
    ],
    [
     25,
     32,
     6,
     33
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "west-bough-front-gate"
   ],
   [
    "sales-floor",
    "cold-storage",
    "west-forest-ice-gate"
   ],
   [
    "cold-storage",
    "provisions-vault",
    "deep-locked-root-archive"
   ],
   [
    "provisions-vault",
    "curing-area",
    "low-U-courtyard-bridge"
   ],
   [
    "curing-area",
    "butcher-workspace",
    "opposite-east-cutting-gate"
   ]
  ],
  "targets": [
   [
    "forest stall",
    5,
    8
   ],
   [
    "root cellar",
    5,
    21
   ],
   [
    "deep reserve",
    5,
    29
   ],
   [
    "smoking bridge",
    17,
    29
   ],
   [
    "east hygienic hall",
    29,
    19
   ]
  ],
  "features": [
   "sales-floor",
   "service-counter",
   "cold-storage",
   "provisions-vault",
   "curing-area",
   "butcher-workspace"
  ],
  "signature": "Hollow U with open-air central 14 by 25 groundless court and left and right parallel long halls connected at remote southern smoke bridge, forest root roof profile unlike any previous nested wings"
 },
 {
  "category": "jeweler",
  "biome": "mountain",
  "size": "large",
  "variation": 2,
  "title": "Vespercrag Hollow-Square Gem Treasury",
  "w": 52,
  "d": 47,
  "h": 17,
  "plan": [
   [
    0,
    51,
    0,
    10
   ],
   [
    0,
    11,
    11,
    46
   ],
   [
    40,
    51,
    11,
    46
   ],
   [
    12,
    39,
    37,
    46
   ]
  ],
  "entry": [
   26,
   0
  ],
  "sky": [
   [
    21,
    30,
    3,
    7
   ]
  ],
  "divide": [
   [
    "z",
    16,
    1,
    10,
    [
     6
    ]
   ],
   [
    "z",
    16,
    41,
    50,
    [
     45
    ]
   ]
  ],
  "items": [
   [
    22,
    5,
    "display",
    "mountain-star-opals"
   ],
   [
    30,
    7,
    "display",
    "raw-crystal-clusters"
   ],
   [
    26,
    9,
    "counter",
    "treasury-gem-ledger"
   ],
   [
    6,
    23,
    "crate",
    "left-unrefined-crystals"
   ],
   [
    8,
    40,
    "table",
    "lapidary-rubbing"
   ],
   [
    45,
    23,
    "table",
    "guarded-right-faceting"
   ],
   [
    46,
    42,
    "crate",
    "stone-vault"
   ],
   [
    26,
    42,
    "altar",
    "sun-exposed-gem-rating"
   ],
   [
    18,
    43,
    "lamp",
    "courtyard-reflection-light",
    "decor"
   ]
  ],
  "steps": [
   [
    2,
    9,
    18,
    43,
    8,
    "stone",
    "west-excavated-lapidary-terrace"
   ],
   [
    4,
    8,
    22,
    40,
    9,
    "roof",
    "west-perpendicular-crystal-roof"
   ],
   [
    5,
    7,
    26,
    35,
    10,
    "stone",
    "west-pitched-garnet-spine"
   ],
   [
    6,
    6,
    28,
    33,
    11,
    "roof",
    "west-narrow-ore-needle"
   ],
   [
    42,
    49,
    18,
    43,
    8,
    "stone",
    "east-deep-crystal-security-wing"
   ],
   [
    44,
    48,
    21,
    40,
    9,
    "roof",
    "east-guarded-gem-crest"
   ],
   [
    45,
    47,
    26,
    34,
    10,
    "stone",
    "east-faceted-diamond"
   ],
   [
    46,
    46,
    29,
    32,
    11,
    "roof",
    "east-shaft-spire"
   ],
   [
    14,
    37,
    39,
    45,
    8,
    "stone",
    "south-connecting-buttress-gallery"
   ],
   [
    18,
    33,
    40,
    44,
    9,
    "roof",
    "rear-straight-rare-gems-arch"
   ],
   [
    22,
    29,
    41,
    43,
    10,
    "stone",
    "high-south-treasury-vault"
   ],
   [
    25,
    26,
    42,
    42,
    11,
    "roof",
    "south-hill-peak"
   ],
   [
    2,
    19,
    2,
    9,
    8,
    "wood",
    "west-north-market-corner"
   ],
   [
    5,
    16,
    4,
    8,
    9,
    "stone",
    "west-front-exchange-gable"
   ],
   [
    8,
    13,
    5,
    7,
    10,
    "roof",
    "west-facade-peak"
   ],
   [
    33,
    48,
    2,
    9,
    8,
    "wood",
    "east-north-gem-enclosure"
   ],
   [
    36,
    45,
    4,
    8,
    9,
    "stone",
    "right-front-granite-gable"
   ],
   [
    39,
    42,
    5,
    7,
    10,
    "roof",
    "right-facade-crest"
   ],
   [
    22,
    29,
    8,
    9,
    8,
    "stone",
    "rear-public-inspection-balcony"
   ]
  ],
  "rooms": [
   [
    "North prestigious crystal display and sales gallery",
    [
     "sales-floor",
     "service-counter",
     "jewelry-display"
    ],
    [
     1,
     50,
     1,
     9
    ]
   ],
   [
    "West deep stone-cut secure lapidary and mineral archives",
    [
     "secure-workroom"
    ],
    [
     1,
     10,
     17,
     45
    ]
   ],
   [
    "East tall independent royal gemstone vault",
    [
     "vault"
    ],
    [
     41,
     50,
     17,
     45
    ]
   ],
   [
    "South enclosed courtyard-backed crystal authentication hall",
    [
     "valuation-gallery"
    ],
    [
     13,
     38,
     38,
     45
    ]
   ]
  ],
  "edges": [
   [
    "exterior",
    "sales-floor",
    "north-mountain-gem-arch"
   ],
   [
    "sales-floor",
    "secure-workroom",
    "west-guarded-crystal-door"
   ],
   [
    "sales-floor",
    "vault",
    "east-guarded-treasury-door"
   ],
   [
    "secure-workroom",
    "valuation-gallery",
    "southwest-ring-walkway"
   ],
   [
    "vault",
    "valuation-gallery",
    "southeast-ring-walkway"
   ]
  ],
  "targets": [
   [
    "north public gems",
    26,
    5
   ],
   [
    "left lapidary",
    6,
    25
   ],
   [
    "right bullion",
    45,
    25
   ],
   [
    "south appraisal",
    25,
    42
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
  "signature": "True O-ring gemstone manor with deeply hollow central no-ground courtyard bounded by four massive stone corridors, distinct front, two long parallel sides, rear cross-gallery and independently stepped rock tower skylines"
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
export const M1_REGIONAL_FORMS=Object.freeze(DESIGNS.map(author));
