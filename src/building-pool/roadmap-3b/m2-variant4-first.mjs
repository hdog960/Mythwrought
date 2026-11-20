// Builder 3B M2 original fourth-variation source-only industry buildings.
// Ten distinct manually coordinate-authored work programs; no production placement.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const N=(id,x,z)=>({id,x,y:2,z,width:2,headroom:3});
const E=(from,to)=>({from,to,kind:'level'});
const room=(id,kind,bounds,accessNode)=>({id,kind,bounds,accessNode});
const item=(name,x,y,z,assetRef,unresolvedDependency=null)=>({name,position:[x,y,z],assetRef,unresolvedDependency});
const key=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;
function create(p){
 const {w,d,h,aisle,westX,westZ,eastX,eastZ,midZ}=p;
 const id=assertSlot(p.type,p.biome,p.size,4),shape=new Set();
 const one=(x,z)=>flat(x,z);
 for(const [x0,x1,z0,z1] of p.mask)for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)shape.add(one(x,z));
 const reserved=[B(aisle,2,0,2,3,d),
  B(westX,2,westZ,aisle-westX+2,3,2),
  B(aisle,2,eastZ,eastX-aisle+2,3,2)];
 // Physically author the complete freight bridges between offset structures.
 // Each route extension receives the same real foundation and floor as the
 // bespoke masked wings; no graph-only teleportation or hovering corridor.
 for(const q of reserved)for(let x=q.x;x<q.x+q.width;x++)
  for(let z=q.z;z<q.z+q.depth;z++)shape.add(one(x,z));
 const corridor=(x,y,z)=>reserved.some(q=>x>=q.x&&x<q.x+q.width&&y>=q.y&&y<q.y+q.height&&z>=q.z&&z<q.z+q.depth);
 const cells=new Map(),roles=new Map();
 function has(x,y,z){return cells.has(key(x,y,z));}
 function write(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=h||z<0||z>=d)throw Error(id+' outside local voxel bounds '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' unregistered candidate family '+ref);
  if(role!=='foundation'&&role!=='floor'&&!shape.has(one(x,z)))return false;
  if(corridor(x,y,z)||has(x,y,z))return false;
  cells.set(key(x,y,z),{role,x,y,z});
  if(!roles.has(role))roles.set(role,[]);
  roles.get(role).push([x,y,z,ref]);
  return true;
 }
 function volume(role,[x0,x1,y0,y1,z0,z1],ref){
  for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)write(role,x,y,z,ref);
 }
 // Voxel-exact non-rectangular building footprint includes open-air freight.
 for(const q of shape){const [x,z]=q.split(',').map(Number);
  write('foundation',x,0,z,'builtin:stone');write('floor',x,1,z,p.floor);
 }
 // Only actual footprint boundaries grow walls; no rectangular filler/outside blocks.
 for(const q of shape){const [x,z]=q.split(',').map(Number);
  if([[x-1,z],[x+1,z],[x,z-1],[x,z+1]].some(([a,b])=>!shape.has(one(a,b))) && !corridor(x,2,z))
   for(let y=2;y<=p.roofWallHeight;y++)write('wall',x,y,z,p.wall);
 }
 const topOf=(roof,x,z)=>{
  const [x0,x1,z0,z1]=roof.r;
  if(roof.shape==='gable')return roof.top+Math.floor(Math.min(x-x0,x1-x)/3);
  if(roof.shape==='cross')return roof.top+Math.floor(Math.min(z-z0,z1-z)/4);
  if(roof.shape==='terrace')return roof.top+(x<=Math.floor((x0+x1)/2)?2:0);
  if(roof.shape==='saw')return roof.top+(Math.floor((x-x0)/3)%2);
  if(roof.shape==='slope')return roof.top+Math.floor((x-x0)/4);
  if(roof.shape==='lean')return roof.top+Math.floor((x-x0)/4);
  return roof.top;
 };
 for(const [n,roof] of p.roofs.entries()){
  const [x0,x1,z0,z1]=roof.r;
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)
   if(!shape.has(one(x,z)))throw Error(id+' invalid disconnected roof over missing foundation '+[x,z]);
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)write('roof',x,topOf(roof,x,z),z,roof.cover);
  // Join each stepped plane to preserve face-connected roof geometry.
  for(let x=x0+1;x<=x1;x++)for(let z=z0;z<=z1;z++){
   const a=topOf(roof,x-1,z),b=topOf(roof,x,z);
   for(let y=Math.min(a,b);y<Math.max(a,b);y++)write('roof-step-x',a<b?x:x-1,y,z,'pack2:015');
  }
  for(let z=z0+1;z<=z1;z++)for(let x=x0;x<=x1;x++){
   const a=topOf(roof,x,z-1),b=topOf(roof,x,z);
   for(let y=Math.min(a,b);y<Math.max(a,b);y++)write('roof-step-z',x,y,a<b?z:z-1,'pack2:015');
  }
  const points=[[x0,z0],[x1,z0],[x0,z1],[x1,z1],
    [Math.floor((x0+x1)/2),z0],[Math.floor((x0+x1)/2),z1]];
  for(const [x,z] of points)for(let y=2;y<topOf(roof,x,z);y++)write('roof-pier-'+n,x,y,z,roof.post);
 }
 for(const [name,cube,ref] of p.cargo)volume(name,cube,ref);
 for(const [name,cube,ref] of p.partitions ?? [])volume('interior-'+name,cube,ref);
 for(const [x,y,z,label] of p.details)write('distinct-architectural-'+label,x,y,z,'pack1:010');
 for(const b of reserved)for(let x=b.x;x<b.x+b.width;x++)for(let y=b.y;y<b.y+b.height;y++)for(let z=b.z;z<b.z+b.depth;z++)
  if(cells.has(key(x,y,z)))throw Error(id+' blocked concrete two-wide aisle '+[x,y,z]);
 const nav={entry:'entry',nodes:[N('entry',aisle,d-1),N('center',aisle,midZ),N('west',westX,westZ),N('east',eastX,eastZ)],
   edges:[E('entry','center'),E('center','west'),E('center','east')]};
 const result={id,type:p.type,biome:p.biome,size:p.size,variant:4,status:'theoretical',activated:false,
  envelope:B(0,0,0,w,h,d),modules:[...roles].map(([role,cells])=>({id:role+'-01',role,cells})),
  clearances:reserved,openings:[{id:'two-wide-south-loading-door',facing:'south',x:aisle,y:2,z:d-1,width:2,height:3}],
  navigation:nav,
  spaces:[
    room('west-storage',p.west,B(1,2,1,aisle,6,d-2),'west'),
    room('open-cart-court',p.yard,B(aisle,2,1,2,6,d-1),'center'),
    room('east-industry',p.east,B(aisle+2,2,1,w-aisle-2,6,d-2),'east')
  ],
  features:[
    item('source-west-process-zone',westX,2,westZ,p.cargo[0][2]),
    item('source-east-warehouse',eastX,2,eastZ,p.cargo[1][2]),
    item('uneven-loading-zone',aisle,2,d-4,p.floor),
    item('stone-roof-bearing',p.details[0][0],p.details[0][1],p.details[0][2],'pack1:010'),
    item('unbuilt-working-machinery',w-2,3,d-4,null,p.dependency)
  ],
  architecture:{kind:p.title,footprintShape:'nonrectangular original mask of joined individual work bays',
    footprintCells:shape.size,openAirFreightCourt:true,roofProfiles:p.roofs.map(q=>q.shape),
    originalRoofRuns:p.roofs.map(q=>q.r),occupiedCoordinates:cells.size,
    creatorApproved:false,worldPlaced:false,perCellVariantResolved:false,perCellYawResolved:false},
  dependencies:[p.wall,p.floor,...p.roofs.map(q=>q.cover),...p.cargo.map(q=>q[2]),p.dependency,
    'Manual family numeric variant / yaw / multi-voxel physical support and collision unresolved'],
  implementation:'3B_THEORETICAL_VARIANT4_ONLY: no world placements, saves, biome registration, powered mills or harvesting'};
 validateBlueprint(result,ASSET_CATALOG);
 return result;
}
const plans=[
 {
  "type": "lumberyard",
  "biome": "temperate",
  "size": "small",
  "w": 34,
  "d": 32,
  "h": 35,
  "aisle": 10,
  "westX": 4,
  "westZ": 22,
  "eastX": 26,
  "eastZ": 10,
  "midZ": 16,
  "title": "Creek-side raft trimming skerry with eccentric crane and southern floating pier",
  "mask": [
   [
    8,
    14,
    0,
    31
   ],
   [
    1,
    8,
    12,
    29
   ],
   [
    16,
    32,
    1,
    15
   ],
   [
    22,
    31,
    21,
    29
   ],
   [
    14,
    24,
    18,
    24
   ],
   [
    0,
    7,
    26,
    31
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 8,
  "west": "structural sawing and lumber sorting house",
  "east": "high timber cargo finishing and loading bay",
  "yard": "two-wide log handling and freight switch lane",
  "dependency": "Active timber saws/waterwheels and dynamic water remain uninstalled",
  "roofs": [
   {
    "name": "raft cross-lath",
    "r": [
     2,
     7,
     15,
     27
    ],
    "top": 16,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "offset saw head",
    "r": [
     20,
     30,
     3,
     12
    ],
    "top": 22,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "river barge shed",
    "r": [
     24,
     29,
     23,
     27
    ],
    "top": 13,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "raft-cut keel",
    [
     3,
     6,
     2,
     4,
     17,
     20
    ],
    "builtin:wood"
   ],
   [
    "saw pallets",
    [
     23,
     28,
     2,
     4,
     6,
     9
    ],
    "pack4:057"
   ],
   [
    "resin casks",
    [
     24,
     28,
     2,
     3,
     24,
     26
    ],
    "pack4:056"
   ]
  ],
  "partitions": [
   [
    "timber breakwall",
    [
     6,
     6,
     2,
     6,
     21,
     25
    ],
    "pack2:015"
   ],
   [
    "saw bearing",
    [
     29,
     29,
     2,
     6,
     8,
     11
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    4,
    2,
    26,
    "authored west load-bearing frame"
   ],
   [
    27,
    2,
    14,
    "authored east load-bearing frame"
   ]
  ]
 },
 {
  "type": "lumberyard",
  "biome": "desert",
  "size": "large",
  "w": 57,
  "d": 52,
  "h": 47,
  "aisle": 36,
  "westX": 18,
  "westZ": 12,
  "eastX": 49,
  "eastZ": 36,
  "midZ": 26,
  "title": "Dune caravanserai with twin hardwood courtyards and separated north and south cutting halls",
  "mask": [
   [
    33,
    41,
    0,
    51
   ],
   [
    3,
    33,
    1,
    20
   ],
   [
    1,
    30,
    25,
    48
   ],
   [
    20,
    35,
    27,
    46
   ],
   [
    43,
    55,
    27,
    47
   ],
   [
    44,
    55,
    0,
    19
   ],
   [
    38,
    46,
    10,
    20
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack5:080",
  "roofWallHeight": 12,
  "west": "structural sawing and lumber sorting house",
  "east": "high timber cargo finishing and loading bay",
  "yard": "two-wide log handling and freight switch lane",
  "dependency": "biome130:006 sandstone future candidate, wind-mill mechanics unresolved",
  "roofs": [
   {
    "name": "sun-lath adobe north",
    "r": [
     5,
     20,
     5,
     17
    ],
    "top": 22,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "palm trade hall",
    "r": [
     8,
     26,
     29,
     44
    ],
    "top": 18,
    "shape": "saw",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "east customs roof",
    "r": [
     45,
     53,
     3,
     17
    ],
    "top": 24,
    "shape": "cross",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "south datewood intake",
    "r": [
     45,
     53,
     30,
     43
    ],
    "top": 19,
    "shape": "slope",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "oasis hardwood cuttings",
    [
     7,
     14,
     2,
     4,
     7,
     13
    ],
    "builtin:wood"
   ],
   [
    "caravan timber crates",
    [
     10,
     18,
     2,
     4,
     33,
     37
    ],
    "pack4:057"
   ],
   [
    "sunshade barrels",
    [
     47,
     51,
     2,
     4,
     32,
     36
    ],
    "pack4:056"
   ]
  ],
  "partitions": [
   [
    "adobe heat baffle",
    [
     11,
     11,
     2,
     7,
     10,
     16
    ],
    "pack5:080"
   ],
   [
    "south freight racks",
    [
     15,
     15,
     2,
     6,
     35,
     42
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    18,
    2,
    16,
    "authored west load-bearing frame"
   ],
   [
    50,
    2,
    40,
    "authored east load-bearing frame"
   ]
  ]
 },
 {
  "type": "lumberyard",
  "biome": "snow",
  "size": "medium",
  "w": 45,
  "d": 42,
  "h": 44,
  "aisle": 30,
  "westX": 13,
  "westZ": 25,
  "eastX": 39,
  "eastZ": 10,
  "midZ": 21,
  "title": "Glacier saw cathedral with south avalanche quay and staggered east sled gantry",
  "mask": [
   [
    27,
    34,
    0,
    41
   ],
   [
    3,
    27,
    12,
    37
   ],
   [
    35,
    44,
    1,
    25
   ],
   [
    13,
    30,
    8,
    15
   ],
   [
    1,
    14,
    35,
    41
   ],
   [
    6,
    17,
    1,
    10
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "west": "structural sawing and lumber sorting house",
  "east": "high timber cargo finishing and loading bay",
  "yard": "two-wide log handling and freight switch lane",
  "dependency": "biome130:094 thermal walls not registered; winter weather and heating unresolved",
  "roofs": [
   {
    "name": "west pine nave",
    "r": [
     6,
     24,
     16,
     34
    ],
    "top": 21,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east winter sled rack",
    "r": [
     36,
     42,
     3,
     22
    ],
    "top": 24,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "rear insulated sled port",
    "r": [
     4,
     12,
     36,
     40
    ],
    "top": 15,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "north cold loft",
    "r": [
     10,
     16,
     3,
     9
    ],
    "top": 17,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "cold pine stays",
    [
     7,
     14,
     2,
     5,
     19,
     24
    ],
    "builtin:wood"
   ],
   [
    "sled export crates",
    [
     37,
     41,
     2,
     5,
     6,
     11
    ],
    "pack4:057"
   ],
   [
    "winter rail kits",
    [
     5,
     10,
     2,
     3,
     37,
     39
    ],
    "pack4:056"
   ]
  ],
  "partitions": [
   [
    "frost shoring",
    [
     8,
     8,
     2,
     7,
     28,
     32
    ],
    "pack1:010"
   ],
   [
    "glazed timber-service strip",
    [
     22,
     24,
     2,
     2,
     30,
     33
    ],
    "pack5:081"
   ]
  ],
  "details": [
   [
    13,
    2,
    29,
    "authored west load-bearing frame"
   ],
   [
    40,
    2,
    14,
    "authored east load-bearing frame"
   ]
  ]
 },
 {
  "type": "lumberyard",
  "biome": "enchanted-forest",
  "size": "small",
  "w": 33,
  "d": 34,
  "h": 37,
  "aisle": 17,
  "westX": 8,
  "westZ": 9,
  "eastX": 27,
  "eastZ": 26,
  "midZ": 17,
  "title": "Four-wing moonroot craft pier with separate livingwood and spore-curing sheds",
  "mask": [
   [
    14,
    21,
    0,
    33
   ],
   [
    3,
    14,
    2,
    15
   ],
   [
    22,
    32,
    18,
    33
   ],
   [
    19,
    25,
    16,
    24
   ],
   [
    22,
    31,
    2,
    14
   ],
   [
    20,
    25,
    8,
    17
   ],
   [
    1,
    12,
    23,
    32
   ],
   [
    10,
    18,
    21,
    26
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 8,
  "west": "structural sawing and lumber sorting house",
  "east": "high timber cargo finishing and loading bay",
  "yard": "two-wide log handling and freight switch lane",
  "dependency": "biome130:096 livingwood ribs unregistered; fungal enchantments unresolved",
  "roofs": [
   {
    "name": "moon bark western arbor",
    "r": [
     3,
     12,
     3,
     14
    ],
    "top": 18,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "southern livingwood ferry",
    "r": [
     24,
     30,
     22,
     31
    ],
    "top": 16,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "spore saw press",
    "r": [
     23,
     29,
     4,
     12
    ],
    "top": 19,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side nursery nook",
    "r": [
     3,
     10,
     25,
     31
    ],
    "top": 12,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "moon timber boards",
    [
     3,
     7,
     2,
     5,
     5,
     10
    ],
    "builtin:wood"
   ],
   [
    "sporewood seed crates",
    [
     25,
     29,
     2,
     4,
     24,
     28
    ],
    "pack4:057"
   ],
   [
    "northern branch reserves",
    [
     24,
     28,
     2,
     3,
     7,
     10
    ],
    "pack4:056"
   ]
  ],
  "partitions": [
   [
    "mushroom plaster retainer",
    [
     5,
     5,
     2,
     6,
     9,
     13
    ],
    "pack5:079"
   ],
   [
    "livingwood transfer brace",
    [
     26,
     26,
     2,
     6,
     8,
     11
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    8,
    2,
    13,
    "authored west load-bearing frame"
   ],
   [
    28,
    2,
    30,
    "authored east load-bearing frame"
   ]
  ]
 },
 {
  "type": "lumberyard",
  "biome": "mountain",
  "size": "large",
  "w": 60,
  "d": 57,
  "h": 53,
  "aisle": 43,
  "westX": 20,
  "westZ": 34,
  "eastX": 53,
  "eastZ": 17,
  "midZ": 28,
  "title": "Counterweighted cliff timber forge with five uneven terrace roofs and switchback cargo shunts",
  "mask": [
   [
    40,
    48,
    0,
    56
   ],
   [
    2,
    40,
    24,
    48
   ],
   [
    4,
    25,
    4,
    21
   ],
   [
    21,
    42,
    14,
    29
   ],
   [
    49,
    59,
    3,
    28
   ],
   [
    50,
    59,
    34,
    56
   ],
   [
    5,
    23,
    47,
    56
   ],
   [
    18,
    42,
    43,
    52
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "west": "structural sawing and lumber sorting house",
  "east": "high timber cargo finishing and loading bay",
  "yard": "two-wide log handling and freight switch lane",
  "dependency": "biome130:098 cliff anchors unregistered; winches and high-cliff interaction unresolved",
  "roofs": [
   {
    "name": "west rock caisson",
    "r": [
     5,
     21,
     27,
     45
    ],
    "top": 25,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "high northwest saw hall",
    "r": [
     6,
     22,
     7,
     19
    ],
    "top": 28,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "granite east cage",
    "r": [
     51,
     57,
     5,
     25
    ],
    "top": 31,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south winch tower",
    "r": [
     52,
     58,
     37,
     53
    ],
    "top": 22,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "lower shoring office",
    "r": [
     8,
     18,
     49,
     54
    ],
    "top": 16,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "cliff pine billets",
    [
     7,
     16,
     2,
     5,
     30,
     38
    ],
    "builtin:wood"
   ],
   [
    "high cliff saw crates",
    [
     8,
     17,
     2,
     4,
     10,
     15
    ],
    "pack4:057"
   ],
   [
    "winch ballast lumber",
    [
     53,
     57,
     2,
     5,
     40,
     45
    ],
    "pack4:056"
   ]
  ],
  "partitions": [
   [
    "granite cutout bracket",
    [
     13,
     13,
     2,
     8,
     12,
     18
    ],
    "pack1:010"
   ],
   [
    "south kiln brick belt",
    [
     12,
     12,
     2,
     7,
     49,
     52
    ],
    "pack5:080"
   ]
  ],
  "details": [
   [
    20,
    2,
    38,
    "authored west load-bearing frame"
   ],
   [
    54,
    2,
    21,
    "authored east load-bearing frame"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "temperate",
  "size": "medium",
  "w": 44,
  "d": 43,
  "h": 43,
  "aisle": 15,
  "westX": 7,
  "westZ": 29,
  "eastX": 35,
  "eastZ": 14,
  "midZ": 21,
  "title": "Floodplain double-watermill, eccentric west silt vault and detached lower flour store",
  "mask": [
   [
    12,
    20,
    0,
    42
   ],
   [
    1,
    12,
    15,
    39
   ],
   [
    22,
    41,
    3,
    22
   ],
   [
    25,
    42,
    25,
    40
   ],
   [
    18,
    28,
    25,
    29
   ],
   [
    2,
    12,
    1,
    13
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 10,
  "west": "grain staging and mill service nave",
  "east": "turning stone quern and flour machinery hall",
  "yard": "two-wide grain wagon transfer crossing",
  "dependency": "Active timber saws/waterwheels and dynamic water remain uninstalled",
  "roofs": [
   {
    "name": "west floodgrain transept",
    "r": [
     2,
     10,
     17,
     36
    ],
    "top": 22,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "upriver grinding hall",
    "r": [
     24,
     39,
     5,
     19
    ],
    "top": 24,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "downstream flour barn",
    "r": [
     27,
     40,
     28,
     37
    ],
    "top": 17,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "small sluice gatehouse",
    "r": [
     3,
     10,
     3,
     11
    ],
    "top": 16,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "river barley racks",
    [
     3,
     8,
     2,
     4,
     19,
     24
    ],
    "pack4:057"
   ],
   [
    "upper millstone",
    [
     27,
     36,
     2,
     5,
     9,
     14
    ],
    "pack1:010"
   ],
   [
    "downstream flour barrels",
    [
     28,
     38,
     2,
     4,
     30,
     34
    ],
    "pack4:056"
   ]
  ],
  "partitions": [
   [
    "grout ceramic flour court",
    [
     4,
     9,
     2,
     2,
     29,
     34
    ],
    "pack5:081"
   ],
   [
    "sluice drive brace",
    [
     36,
     36,
     2,
     7,
     13,
     17
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    7,
    2,
    33,
    "authored west load-bearing frame"
   ],
   [
    36,
    2,
    18,
    "authored east load-bearing frame"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "desert",
  "size": "small",
  "w": 32,
  "d": 33,
  "h": 36,
  "aisle": 21,
  "westX": 7,
  "westZ": 12,
  "eastX": 27,
  "eastZ": 24,
  "midZ": 16,
  "title": "Dunebelt split wind-quern with low western grain bazaar and eccentric eastern capstan",
  "mask": [
   [
    18,
    25,
    0,
    32
   ],
   [
    1,
    18,
    2,
    16
   ],
   [
    5,
    19,
    22,
    32
   ],
   [
    25,
    31,
    18,
    31
   ],
   [
    24,
    31,
    2,
    13
   ],
   [
    12,
    23,
    11,
    23
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack5:080",
  "roofWallHeight": 8,
  "west": "grain staging and mill service nave",
  "east": "turning stone quern and flour machinery hall",
  "yard": "two-wide grain wagon transfer crossing",
  "dependency": "biome130:006 sandstone future candidate, wind-mill mechanics unresolved",
  "roofs": [
   {
    "name": "dry dategrain loft",
    "r": [
     3,
     14,
     4,
     14
    ],
    "top": 19,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "caravan flour shelter",
    "r": [
     7,
     17,
     25,
     30
    ],
    "top": 15,
    "shape": "slope",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "east quern spindle",
    "r": [
     26,
     30,
     21,
     29
    ],
    "top": 17,
    "shape": "saw",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "north windscoop cap",
    "r": [
     25,
     30,
     4,
     11
    ],
    "top": 22,
    "shape": "gable",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "dategrain bins",
    [
     4,
     10,
     2,
     4,
     6,
     11
    ],
    "pack4:057"
   ],
   [
    "flour crates",
    [
     8,
     14,
     2,
     3,
     26,
     28
    ],
    "pack4:056"
   ],
   [
    "stone quern",
    [
     27,
     29,
     2,
     5,
     23,
     27
    ],
    "pack1:010"
   ]
  ],
  "partitions": [
   [
    "fired brick masonry screen",
    [
     8,
     8,
     2,
     6,
     10,
     13
    ],
    "pack5:080"
   ],
   [
    "windmill bearing",
    [
     28,
     28,
     2,
     7,
     7,
     11
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    7,
    2,
    16,
    "authored west load-bearing frame"
   ],
   [
    28,
    2,
    28,
    "authored east load-bearing frame"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "snow",
  "size": "large",
  "w": 60,
  "d": 56,
  "h": 52,
  "aisle": 24,
  "westX": 12,
  "westZ": 20,
  "eastX": 48,
  "eastZ": 36,
  "midZ": 28,
  "title": "Four-court winter grain refinery with distant northern turbine keep and sheltered snow-silo run",
  "mask": [
   [
    21,
    29,
    0,
    55
   ],
   [
    1,
    21,
    9,
    31
   ],
   [
    4,
    18,
    35,
    52
   ],
   [
    16,
    23,
    29,
    40
   ],
   [
    32,
    59,
    19,
    53
   ],
   [
    28,
    36,
    27,
    42
   ],
   [
    35,
    58,
    0,
    17
   ],
   [
    27,
    40,
    11,
    24
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "west": "grain staging and mill service nave",
  "east": "turning stone quern and flour machinery hall",
  "yard": "two-wide grain wagon transfer crossing",
  "dependency": "biome130:094 thermal walls not registered; winter weather and heating unresolved",
  "roofs": [
   {
    "name": "western snowgrain basilica",
    "r": [
     3,
     18,
     11,
     28
    ],
    "top": 26,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "southwest storage silo",
    "r": [
     6,
     17,
     38,
     50
    ],
    "top": 21,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "north frozen wheel keep",
    "r": [
     37,
     55,
     3,
     14
    ],
    "top": 31,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east quern gallery",
    "r": [
     35,
     57,
     23,
     50
    ],
    "top": 24,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "winter barley",
    [
     4,
     14,
     2,
     5,
     15,
     22
    ],
    "pack4:057"
   ],
   [
    "sealed flour supply",
    [
     8,
     15,
     2,
     3,
     41,
     47
    ],
    "pack4:056"
   ],
   [
    "stone turbine axle",
    [
     40,
     53,
     2,
     5,
     6,
     11
    ],
    "pack1:010"
   ]
  ],
  "partitions": [
   [
    "snow plaster retaining wall",
    [
     10,
     10,
     2,
     8,
     20,
     26
    ],
    "pack5:079"
   ],
   [
    "turbine granite footing",
    [
     54,
     54,
     2,
     9,
     9,
     13
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    12,
    2,
    24,
    "authored west load-bearing frame"
   ],
   [
    49,
    2,
    40,
    "authored east load-bearing frame"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "enchanted-forest",
  "size": "medium",
  "w": 47,
  "d": 43,
  "h": 45,
  "aisle": 32,
  "westX": 11,
  "westZ": 11,
  "eastX": 40,
  "eastZ": 31,
  "midZ": 21,
  "title": "Twinned moonseed open-lightwell mills with offset spore press and fern-grain galleries",
  "mask": [
   [
    29,
    36,
    0,
    42
   ],
   [
    3,
    28,
    2,
    20
   ],
   [
    3,
    28,
    24,
    38
   ],
   [
    25,
    32,
    18,
    29
   ],
   [
    38,
    46,
    22,
    41
   ],
   [
    35,
    42,
    25,
    35
   ],
   [
    38,
    46,
    2,
    16
   ],
   [
    35,
    40,
    10,
    18
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 10,
  "west": "grain staging and mill service nave",
  "east": "turning stone quern and flour machinery hall",
  "yard": "two-wide grain wagon transfer crossing",
  "dependency": "biome130:096 livingwood ribs unregistered; fungal enchantments unresolved",
  "roofs": [
   {
    "name": "northwest fern grain nave",
    "r": [
     5,
     25,
     4,
     17
    ],
    "top": 24,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "south spore quern hall",
    "r": [
     5,
     24,
     27,
     36
    ],
    "top": 20,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east mushroom mill pavilion",
    "r": [
     39,
     45,
     25,
     39
    ],
    "top": 22,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "northeast rune silo",
    "r": [
     39,
     45,
     4,
     13
    ],
    "top": 26,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "moonseed grain caskets",
    [
     7,
     17,
     2,
     5,
     7,
     12
    ],
    "pack4:057"
   ],
   [
    "fungal grain barrels",
    [
     7,
     17,
     2,
     4,
     29,
     33
    ],
    "pack4:056"
   ],
   [
    "fern seed quern",
    [
     41,
     44,
     2,
     4,
     28,
     33
    ],
    "pack1:010"
   ]
  ],
  "partitions": [
   [
    "plaster fairy curtain",
    [
     10,
     10,
     2,
     6,
     11,
     16
    ],
    "pack5:079"
   ],
   [
    "luminous spindle divider",
    [
     43,
     43,
     2,
     8,
     9,
     12
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    11,
    2,
    15,
    "authored west load-bearing frame"
   ],
   [
    41,
    2,
    35,
    "authored east load-bearing frame"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "mountain",
  "size": "small",
  "w": 36,
  "d": 34,
  "h": 37,
  "aisle": 13,
  "westX": 5,
  "westZ": 24,
  "eastX": 29,
  "eastZ": 10,
  "midZ": 17,
  "title": "Cliff-niche flour mill with western basalt granary and cantilevered southeast grindery",
  "mask": [
   [
    10,
    18,
    0,
    33
   ],
   [
    1,
    10,
    14,
    31
   ],
   [
    21,
    35,
    2,
    18
   ],
   [
    17,
    23,
    9,
    16
   ],
   [
    23,
    35,
    22,
    32
   ],
   [
    17,
    25,
    22,
    28
   ],
   [
    1,
    9,
    1,
    10
   ],
   [
    8,
    14,
    6,
    12
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 8,
  "west": "grain staging and mill service nave",
  "east": "turning stone quern and flour machinery hall",
  "yard": "two-wide grain wagon transfer crossing",
  "dependency": "biome130:098 cliff anchors unregistered; winches and high-cliff interaction unresolved",
  "roofs": [
   {
    "name": "western basalt grain belfry",
    "r": [
     1,
     8,
     17,
     29
    ],
    "top": 18,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "eastern wheel keep",
    "r": [
     23,
     33,
     4,
     16
    ],
    "top": 22,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "hanging flour chute",
    "r": [
     25,
     33,
     24,
     30
    ],
    "top": 16,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "north quarry chapelry",
    "r": [
     2,
     7,
     3,
     9
    ],
    "top": 14,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "mine grain shelves",
    [
     2,
     7,
     2,
     4,
     19,
     24
    ],
    "pack4:057"
   ],
   [
    "high millstone drive",
    [
     25,
     32,
     2,
     4,
     6,
     11
    ],
    "pack1:010"
   ],
   [
    "ledge flour boxes",
    [
     27,
     32,
     2,
     3,
     25,
     27
    ],
    "pack4:056"
   ]
  ],
  "partitions": [
   [
    "quarry fired brick screen",
    [
     6,
     6,
     2,
     6,
     23,
     27
    ],
    "pack5:080"
   ],
   [
    "cliff mill bearing",
    [
     32,
     32,
     2,
     7,
     9,
     13
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    5,
    2,
    28,
    "authored west load-bearing frame"
   ],
   [
    30,
    2,
    14,
    "authored east load-bearing frame"
   ]
  ]
 }
];
const bySlot=new Map(plans.map(p=>[p.type+':'+p.biome+':'+p.size,p]));
export function createVariant4FirstBlueprint(type,biome,size,variant=4){
 if(variant!==4)throw new RangeError('Only specifically authored variant 4 belongs to this independent batch');
 const p=bySlot.get(type+':'+biome+':'+size);
 if(!p)throw new RangeError('Unwritten variant-4 architecture '+[type,biome,size].join(':'));
 return create(p);
}
export function createVariant4FirstPool(){return plans.map(create);}
