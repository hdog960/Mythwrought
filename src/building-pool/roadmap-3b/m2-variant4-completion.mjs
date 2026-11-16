// Builder 3B M2 original fourth-variation source-only industry buildings.
// Twenty distinct manually coordinate-authored work programs; no production placement.
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
  "size": "medium",
  "w": 42,
  "d": 39,
  "h": 47,
  "aisle": 18,
  "westX": 10,
  "westZ": 26,
  "eastX": 34,
  "eastZ": 12,
  "midZ": 19,
  "title": "Riverslip timber bazaar",
  "mask": [
   [
    16,
    23,
    0,
    38
   ],
   [
    2,
    15,
    4,
    18
   ],
   [
    4,
    16,
    22,
    36
   ],
   [
    27,
    40,
    7,
    20
   ],
   [
    30,
    40,
    27,
    37
   ],
   [
    1,
    9,
    30,
    38
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     3,
     14,
     5,
     17
    ],
    "top": 23,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east offset machinery",
    "r": [
     28,
     39,
     8,
     19
    ],
    "top": 20,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side freight canopy",
    "r": [
     31,
     39,
     28,
     36
    ],
    "top": 17,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "outboard processing annex",
    "r": [
     5,
     15,
     23,
     35
    ],
    "top": 15,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     4,
     6,
     2,
     4,
     6,
     8
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     29,
     31,
     2,
     4,
     9,
     11
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     32,
     34,
     2,
     4,
     29,
     31
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     4,
     4,
     2,
     6,
     9,
     10
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    4,
    2,
    7,
    "west custom brace"
   ],
   [
    38,
    2,
    17,
    "east custom brace"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 10,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "No live timber saws or water wheels"
 },
 {
  "type": "lumberyard",
  "biome": "temperate",
  "size": "large",
  "w": 59,
  "d": 51,
  "h": 55,
  "aisle": 30,
  "westX": 16,
  "westZ": 16,
  "eastX": 50,
  "eastZ": 36,
  "midZ": 25,
  "title": "Four-fork shipwright timber basin",
  "mask": [
   [
    28,
    36,
    0,
    50
   ],
   [
    4,
    26,
    2,
    26
   ],
   [
    1,
    23,
    32,
    48
   ],
   [
    38,
    57,
    8,
    28
   ],
   [
    42,
    58,
    32,
    49
   ],
   [
    0,
    8,
    0,
    12
   ],
   [
    18,
    30,
    26,
    35
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     5,
     25,
     3,
     25
    ],
    "top": 26,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east offset machinery",
    "r": [
     39,
     56,
     9,
     27
    ],
    "top": 23,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side freight canopy",
    "r": [
     43,
     57,
     33,
     48
    ],
    "top": 20,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "outboard processing annex",
    "r": [
     2,
     22,
     33,
     47
    ],
    "top": 18,
    "shape": "slope",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     6,
     8,
     2,
     4,
     4,
     6
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     40,
     42,
     2,
     4,
     10,
     12
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     44,
     46,
     2,
     4,
     34,
     36
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     6,
     6,
     2,
     6,
     7,
     8
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    6,
    2,
    5,
    "west custom brace"
   ],
   [
    55,
    2,
    25,
    "east custom brace"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 12,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "No live timber saws or water wheels"
 },
 {
  "type": "lumberyard",
  "biome": "desert",
  "size": "small",
  "w": 32,
  "d": 34,
  "h": 40,
  "aisle": 14,
  "westX": 6,
  "westZ": 11,
  "eastX": 27,
  "eastZ": 25,
  "midZ": 17,
  "title": "Oasis cypress salvage and camelwood depot",
  "mask": [
   [
    12,
    20,
    0,
    33
   ],
   [
    1,
    12,
    3,
    16
   ],
   [
    0,
    9,
    22,
    32
   ],
   [
    22,
    30,
    17,
    32
   ],
   [
    24,
    31,
    0,
    10
   ],
   [
    8,
    16,
    15,
    25
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     2,
     11,
     4,
     15
    ],
    "top": 19,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     23,
     29,
     18,
     31
    ],
    "top": 16,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     25,
     30,
     1,
     9
    ],
    "top": 13,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     1,
     8,
     23,
     31
    ],
    "top": 11,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     3,
     5,
     2,
     4,
     5,
     7
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     24,
     26,
     2,
     4,
     19,
     21
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     26,
     28,
     2,
     4,
     2,
     4
    ],
    "pack5:080"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     3,
     3,
     2,
     6,
     8,
     9
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    3,
    2,
    6,
    "west custom brace"
   ],
   [
    28,
    2,
    29,
    "east custom brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack5:080",
  "roofWallHeight": 8,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "Wind-quern rotation and trading remain future work"
 },
 {
  "type": "lumberyard",
  "biome": "desert",
  "size": "medium",
  "w": 45,
  "d": 40,
  "h": 47,
  "aisle": 26,
  "westX": 13,
  "westZ": 27,
  "eastX": 39,
  "eastZ": 10,
  "midZ": 20,
  "title": "Sawtooth adobe timber excise court",
  "mask": [
   [
    24,
    31,
    0,
    39
   ],
   [
    1,
    23,
    17,
    37
   ],
   [
    4,
    17,
    2,
    12
   ],
   [
    33,
    43,
    3,
    19
   ],
   [
    35,
    44,
    28,
    39
   ],
   [
    17,
    25,
    9,
    20
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     2,
     22,
     18,
     36
    ],
    "top": 23,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     34,
     42,
     4,
     18
    ],
    "top": 20,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     36,
     43,
     29,
     38
    ],
    "top": 17,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     5,
     16,
     3,
     11
    ],
    "top": 15,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     3,
     5,
     2,
     4,
     19,
     21
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     35,
     37,
     2,
     4,
     5,
     7
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     37,
     39,
     2,
     4,
     30,
     32
    ],
    "pack5:080"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     3,
     3,
     2,
     6,
     22,
     23
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    3,
    2,
    20,
    "west custom brace"
   ],
   [
    41,
    2,
    16,
    "east custom brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack5:080",
  "roofWallHeight": 10,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "Wind-quern rotation and trading remain future work"
 },
 {
  "type": "lumberyard",
  "biome": "snow",
  "size": "small",
  "w": 34,
  "d": 33,
  "h": 40,
  "aisle": 21,
  "westX": 10,
  "westZ": 19,
  "eastX": 29,
  "eastZ": 7,
  "midZ": 16,
  "title": "Icebridge saw shelter and split sleigh lift",
  "mask": [
   [
    19,
    25,
    0,
    32
   ],
   [
    1,
    18,
    13,
    29
   ],
   [
    2,
    14,
    0,
    8
   ],
   [
    26,
    33,
    2,
    17
   ],
   [
    26,
    32,
    22,
    30
   ],
   [
    15,
    23,
    24,
    32
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     2,
     17,
     14,
     28
    ],
    "top": 19,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     27,
     32,
     3,
     16
    ],
    "top": 16,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     27,
     31,
     23,
     29
    ],
    "top": 13,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     3,
     13,
     1,
     7
    ],
    "top": 11,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     3,
     5,
     2,
     4,
     15,
     17
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     28,
     30,
     2,
     4,
     4,
     6
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     28,
     30,
     2,
     4,
     24,
     26
    ],
    "pack5:081"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     3,
     3,
     2,
     6,
     18,
     19
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    3,
    2,
    16,
    "west custom brace"
   ],
   [
    31,
    2,
    14,
    "east custom brace"
   ]
  ],
  "floor": "pack5:081",
  "wall": "pack1:002",
  "roofWallHeight": 8,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "biome130:094 insulated walls unregistered; no thermal machinery"
 },
 {
  "type": "lumberyard",
  "biome": "snow",
  "size": "large",
  "w": 57,
  "d": 54,
  "h": 55,
  "aisle": 21,
  "westX": 11,
  "westZ": 13,
  "eastX": 47,
  "eastZ": 38,
  "midZ": 27,
  "title": "Glacier timber causeway and winter logging naves",
  "mask": [
   [
    19,
    27,
    0,
    53
   ],
   [
    2,
    18,
    3,
    29
   ],
   [
    4,
    20,
    36,
    52
   ],
   [
    31,
    55,
    26,
    51
   ],
   [
    37,
    56,
    2,
    18
   ],
   [
    29,
    40,
    15,
    34
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     3,
     17,
     4,
     28
    ],
    "top": 26,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     32,
     54,
     27,
     50
    ],
    "top": 23,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     38,
     55,
     3,
     17
    ],
    "top": 20,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     5,
     19,
     37,
     51
    ],
    "top": 18,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     4,
     6,
     2,
     4,
     5,
     7
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     33,
     35,
     2,
     4,
     28,
     30
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     39,
     41,
     2,
     4,
     4,
     6
    ],
    "pack5:081"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     4,
     4,
     2,
     6,
     8,
     9
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    4,
    2,
    6,
    "west custom brace"
   ],
   [
    53,
    2,
    48,
    "east custom brace"
   ]
  ],
  "floor": "pack5:081",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "biome130:094 insulated walls unregistered; no thermal machinery"
 },
 {
  "type": "lumberyard",
  "biome": "enchanted-forest",
  "size": "medium",
  "w": 46,
  "d": 42,
  "h": 47,
  "aisle": 18,
  "westX": 9,
  "westZ": 30,
  "eastX": 38,
  "eastZ": 8,
  "midZ": 21,
  "title": "Moonwood ferryworks and east fungal press",
  "mask": [
   [
    16,
    24,
    0,
    41
   ],
   [
    2,
    15,
    18,
    38
   ],
   [
    1,
    10,
    1,
    13
   ],
   [
    27,
    44,
    2,
    21
   ],
   [
    29,
    45,
    27,
    40
   ],
   [
    23,
    31,
    14,
    31
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     3,
     14,
     19,
     37
    ],
    "top": 23,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east offset machinery",
    "r": [
     28,
     43,
     3,
     20
    ],
    "top": 20,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side freight canopy",
    "r": [
     30,
     44,
     28,
     39
    ],
    "top": 17,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "outboard processing annex",
    "r": [
     2,
     9,
     2,
     12
    ],
    "top": 15,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     4,
     6,
     2,
     4,
     20,
     22
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     29,
     31,
     2,
     4,
     4,
     6
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     31,
     33,
     2,
     4,
     29,
     31
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     4,
     4,
     2,
     6,
     23,
     24
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    4,
    2,
    21,
    "west custom brace"
   ],
   [
    42,
    2,
    18,
    "east custom brace"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 10,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "biome130:096 livingwood braces unregistered; no magical milling"
 },
 {
  "type": "lumberyard",
  "biome": "enchanted-forest",
  "size": "large",
  "w": 60,
  "d": 55,
  "h": 55,
  "aisle": 37,
  "westX": 20,
  "westZ": 15,
  "eastX": 52,
  "eastZ": 38,
  "midZ": 27,
  "title": "Darkwood rib-bridge shipyard with spore cloisters",
  "mask": [
   [
    35,
    43,
    0,
    54
   ],
   [
    2,
    33,
    2,
    26
   ],
   [
    9,
    31,
    31,
    52
   ],
   [
    45,
    59,
    25,
    53
   ],
   [
    45,
    57,
    2,
    17
   ],
   [
    29,
    40,
    18,
    36
   ],
   [
    0,
    8,
    44,
    54
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     3,
     32,
     3,
     25
    ],
    "top": 26,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east offset machinery",
    "r": [
     46,
     58,
     26,
     52
    ],
    "top": 23,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side freight canopy",
    "r": [
     46,
     56,
     3,
     16
    ],
    "top": 20,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "outboard processing annex",
    "r": [
     10,
     30,
     32,
     51
    ],
    "top": 18,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     4,
     6,
     2,
     4,
     4,
     6
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     47,
     49,
     2,
     4,
     27,
     29
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     47,
     49,
     2,
     4,
     4,
     6
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     4,
     4,
     2,
     6,
     7,
     8
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    4,
    2,
    5,
    "west custom brace"
   ],
   [
    57,
    2,
    50,
    "east custom brace"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 12,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "biome130:096 livingwood braces unregistered; no magical milling"
 },
 {
  "type": "lumberyard",
  "biome": "mountain",
  "size": "small",
  "w": 35,
  "d": 34,
  "h": 40,
  "aisle": 14,
  "westX": 6,
  "westZ": 9,
  "eastX": 29,
  "eastZ": 23,
  "midZ": 17,
  "title": "Basalt ledge lumber switch and cliff saw",
  "mask": [
   [
    12,
    20,
    0,
    33
   ],
   [
    0,
    11,
    2,
    17
   ],
   [
    0,
    9,
    22,
    33
   ],
   [
    22,
    34,
    16,
    31
   ],
   [
    23,
    33,
    1,
    11
   ],
   [
    19,
    26,
    12,
    22
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     1,
     10,
     3,
     16
    ],
    "top": 19,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     23,
     33,
     17,
     30
    ],
    "top": 16,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     24,
     32,
     2,
     10
    ],
    "top": 13,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     1,
     8,
     23,
     32
    ],
    "top": 11,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     2,
     4,
     2,
     4,
     4,
     6
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     24,
     26,
     2,
     4,
     18,
     20
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     25,
     27,
     2,
     4,
     3,
     5
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     2,
     2,
     2,
     6,
     7,
     8
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    2,
    2,
    5,
    "west custom brace"
   ],
   [
    32,
    2,
    28,
    "east custom brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 8,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "biome130:098 cliff anchor fittings unregistered; no rope lifts"
 },
 {
  "type": "lumberyard",
  "biome": "mountain",
  "size": "medium",
  "w": 44,
  "d": 42,
  "h": 47,
  "aisle": 27,
  "westX": 11,
  "westZ": 29,
  "eastX": 38,
  "eastZ": 10,
  "midZ": 21,
  "title": "Stepped granite cable-yard and shoring loop",
  "mask": [
   [
    25,
    32,
    0,
    41
   ],
   [
    1,
    24,
    19,
    39
   ],
   [
    5,
    20,
    2,
    13
   ],
   [
    34,
    43,
    4,
    18
   ],
   [
    34,
    42,
    24,
    39
   ],
   [
    19,
    28,
    12,
    24
   ],
   [
    0,
    9,
    0,
    7
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     2,
     23,
     20,
     38
    ],
    "top": 23,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     35,
     42,
     5,
     17
    ],
    "top": 20,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     35,
     41,
     25,
     38
    ],
    "top": 17,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     6,
     19,
     3,
     12
    ],
    "top": 15,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     3,
     5,
     2,
     4,
     21,
     23
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     36,
     38,
     2,
     4,
     6,
     8
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     36,
     38,
     2,
     4,
     26,
     28
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     3,
     3,
     2,
     6,
     24,
     25
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    3,
    2,
    22,
    "west custom brace"
   ],
   [
    41,
    2,
    15,
    "east custom brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "west": "timber cutting and shaping house",
  "east": "hoist-backed lumber storage",
  "yard": "two-wide real timber freight court",
  "dependency": "biome130:098 cliff anchor fittings unregistered; no rope lifts"
 },
 {
  "type": "mill",
  "biome": "temperate",
  "size": "small",
  "w": 32,
  "d": 33,
  "h": 40,
  "aisle": 19,
  "westX": 9,
  "westZ": 23,
  "eastX": 27,
  "eastZ": 8,
  "midZ": 16,
  "title": "Watercourse grist armature and split millwheel",
  "mask": [
   [
    17,
    24,
    0,
    32
   ],
   [
    1,
    16,
    14,
    30
   ],
   [
    0,
    10,
    0,
    8
   ],
   [
    25,
    31,
    2,
    19
   ],
   [
    24,
    31,
    22,
    31
   ],
   [
    11,
    20,
    9,
    20
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     2,
     15,
     15,
     29
    ],
    "top": 19,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east offset machinery",
    "r": [
     26,
     30,
     3,
     18
    ],
    "top": 16,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side freight canopy",
    "r": [
     25,
     30,
     23,
     30
    ],
    "top": 13,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "outboard processing annex",
    "r": [
     1,
     9,
     1,
     7
    ],
    "top": 11,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     3,
     5,
     2,
     4,
     16,
     18
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     27,
     29,
     2,
     4,
     4,
     6
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     26,
     28,
     2,
     4,
     24,
     26
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     3,
     3,
     2,
     6,
     19,
     20
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    3,
    2,
    17,
    "west custom brace"
   ],
   [
    29,
    2,
    16,
    "east custom brace"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 8,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "No live timber saws or water wheels"
 },
 {
  "type": "mill",
  "biome": "temperate",
  "size": "large",
  "w": 60,
  "d": 55,
  "h": 55,
  "aisle": 21,
  "westX": 10,
  "westZ": 34,
  "eastX": 48,
  "eastZ": 12,
  "midZ": 27,
  "title": "Estuary three-gate watermill and flood quern",
  "mask": [
   [
    19,
    27,
    0,
    54
   ],
   [
    1,
    18,
    18,
    51
   ],
   [
    3,
    17,
    1,
    13
   ],
   [
    30,
    58,
    3,
    28
   ],
   [
    32,
    56,
    33,
    54
   ],
   [
    26,
    41,
    26,
    41
   ],
   [
    1,
    10,
    47,
    54
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     2,
     17,
     19,
     50
    ],
    "top": 26,
    "shape": "slope",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east offset machinery",
    "r": [
     31,
     57,
     4,
     27
    ],
    "top": 23,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side freight canopy",
    "r": [
     33,
     55,
     34,
     53
    ],
    "top": 20,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "outboard processing annex",
    "r": [
     4,
     16,
     2,
     12
    ],
    "top": 18,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     3,
     5,
     2,
     4,
     20,
     22
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     32,
     34,
     2,
     4,
     5,
     7
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     34,
     36,
     2,
     4,
     35,
     37
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     3,
     3,
     2,
     6,
     23,
     24
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    3,
    2,
    21,
    "west custom brace"
   ],
   [
    56,
    2,
    25,
    "east custom brace"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 12,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "No live timber saws or water wheels"
 },
 {
  "type": "mill",
  "biome": "desert",
  "size": "medium",
  "w": 43,
  "d": 42,
  "h": 47,
  "aisle": 16,
  "westX": 7,
  "westZ": 9,
  "eastX": 35,
  "eastZ": 32,
  "midZ": 21,
  "title": "Sun-quern windcaravan grain market",
  "mask": [
   [
    14,
    22,
    0,
    41
   ],
   [
    1,
    13,
    2,
    19
   ],
   [
    3,
    15,
    26,
    40
   ],
   [
    24,
    41,
    21,
    39
   ],
   [
    27,
    41,
    0,
    15
   ],
   [
    12,
    26,
    16,
    29
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     2,
     12,
     3,
     18
    ],
    "top": 23,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     25,
     40,
     22,
     38
    ],
    "top": 20,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     28,
     40,
     1,
     14
    ],
    "top": 17,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     4,
     14,
     27,
     39
    ],
    "top": 15,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     3,
     5,
     2,
     4,
     4,
     6
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     26,
     28,
     2,
     4,
     23,
     25
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     29,
     31,
     2,
     4,
     2,
     4
    ],
    "pack5:080"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     3,
     3,
     2,
     6,
     7,
     8
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    3,
    2,
    5,
    "west custom brace"
   ],
   [
    39,
    2,
    36,
    "east custom brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack5:080",
  "roofWallHeight": 10,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "Wind-quern rotation and trading remain future work"
 },
 {
  "type": "mill",
  "biome": "desert",
  "size": "large",
  "w": 58,
  "d": 54,
  "h": 55,
  "aisle": 35,
  "westX": 19,
  "westZ": 39,
  "eastX": 50,
  "eastZ": 12,
  "midZ": 27,
  "title": "Caravansary windquern keep and dategrain court",
  "mask": [
   [
    33,
    41,
    0,
    53
   ],
   [
    2,
    32,
    27,
    51
   ],
   [
    3,
    26,
    3,
    19
   ],
   [
    44,
    57,
    2,
    26
   ],
   [
    43,
    57,
    31,
    52
   ],
   [
    25,
    36,
    17,
    30
   ],
   [
    1,
    12,
    44,
    53
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     3,
     31,
     28,
     50
    ],
    "top": 26,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     45,
     56,
     3,
     25
    ],
    "top": 23,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     44,
     56,
     32,
     51
    ],
    "top": 20,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     4,
     25,
     4,
     18
    ],
    "top": 18,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     4,
     6,
     2,
     4,
     29,
     31
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     46,
     48,
     2,
     4,
     4,
     6
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     45,
     47,
     2,
     4,
     33,
     35
    ],
    "pack5:080"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     4,
     4,
     2,
     6,
     32,
     33
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    4,
    2,
    30,
    "west custom brace"
   ],
   [
    55,
    2,
    23,
    "east custom brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack5:080",
  "roofWallHeight": 12,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "Wind-quern rotation and trading remain future work"
 },
 {
  "type": "mill",
  "biome": "snow",
  "size": "small",
  "w": 33,
  "d": 35,
  "h": 40,
  "aisle": 13,
  "westX": 5,
  "westZ": 25,
  "eastX": 27,
  "eastZ": 12,
  "midZ": 17,
  "title": "Polar barley refuge and glassed quern",
  "mask": [
   [
    11,
    19,
    0,
    34
   ],
   [
    0,
    8,
    17,
    31
   ],
   [
    1,
    10,
    0,
    9
   ],
   [
    21,
    32,
    2,
    17
   ],
   [
    24,
    32,
    22,
    33
   ],
   [
    17,
    25,
    10,
    26
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     1,
     7,
     18,
     30
    ],
    "top": 19,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     22,
     31,
     3,
     16
    ],
    "top": 16,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     25,
     31,
     23,
     32
    ],
    "top": 13,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     2,
     9,
     1,
     8
    ],
    "top": 11,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     2,
     4,
     2,
     4,
     19,
     21
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     23,
     25,
     2,
     4,
     4,
     6
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     26,
     28,
     2,
     4,
     24,
     26
    ],
    "pack5:081"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     2,
     2,
     2,
     6,
     22,
     23
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    2,
    2,
    20,
    "west custom brace"
   ],
   [
    30,
    2,
    14,
    "east custom brace"
   ]
  ],
  "floor": "pack5:081",
  "wall": "pack1:002",
  "roofWallHeight": 8,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "biome130:094 insulated walls unregistered; no thermal machinery"
 },
 {
  "type": "mill",
  "biome": "snow",
  "size": "medium",
  "w": 45,
  "d": 42,
  "h": 47,
  "aisle": 30,
  "westX": 13,
  "westZ": 8,
  "eastX": 40,
  "eastZ": 30,
  "midZ": 21,
  "title": "Two-tier icewater mill and winter barley store",
  "mask": [
   [
    28,
    35,
    0,
    41
   ],
   [
    2,
    27,
    2,
    20
   ],
   [
    5,
    22,
    28,
    41
   ],
   [
    36,
    44,
    18,
    38
   ],
   [
    35,
    44,
    1,
    13
   ],
   [
    21,
    32,
    18,
    32
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     3,
     26,
     3,
     19
    ],
    "top": 23,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     37,
     43,
     19,
     37
    ],
    "top": 20,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     36,
     43,
     2,
     12
    ],
    "top": 17,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     6,
     21,
     29,
     40
    ],
    "top": 15,
    "shape": "lean",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     4,
     6,
     2,
     4,
     4,
     6
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     38,
     40,
     2,
     4,
     20,
     22
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     37,
     39,
     2,
     4,
     3,
     5
    ],
    "pack5:081"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     4,
     4,
     2,
     6,
     7,
     8
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    4,
    2,
    5,
    "west custom brace"
   ],
   [
    42,
    2,
    35,
    "east custom brace"
   ]
  ],
  "floor": "pack5:081",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "biome130:094 insulated walls unregistered; no thermal machinery"
 },
 {
  "type": "mill",
  "biome": "enchanted-forest",
  "size": "small",
  "w": 35,
  "d": 33,
  "h": 40,
  "aisle": 22,
  "westX": 9,
  "westZ": 18,
  "eastX": 29,
  "eastZ": 6,
  "midZ": 16,
  "title": "Moonstream fungus mill and western grain grotto",
  "mask": [
   [
    20,
    27,
    0,
    32
   ],
   [
    0,
    19,
    12,
    30
   ],
   [
    1,
    15,
    0,
    9
   ],
   [
    28,
    34,
    1,
    18
   ],
   [
    27,
    34,
    21,
    31
   ],
   [
    16,
    25,
    13,
    22
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     1,
     18,
     13,
     29
    ],
    "top": 19,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east offset machinery",
    "r": [
     29,
     33,
     2,
     17
    ],
    "top": 16,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side freight canopy",
    "r": [
     28,
     33,
     22,
     30
    ],
    "top": 13,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "outboard processing annex",
    "r": [
     2,
     14,
     1,
     8
    ],
    "top": 11,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     2,
     4,
     2,
     4,
     14,
     16
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     30,
     32,
     2,
     4,
     3,
     5
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     29,
     31,
     2,
     4,
     23,
     25
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     2,
     2,
     2,
     6,
     17,
     18
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    2,
    2,
    15,
    "west custom brace"
   ],
   [
    32,
    2,
    15,
    "east custom brace"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 8,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "biome130:096 livingwood braces unregistered; no magical milling"
 },
 {
  "type": "mill",
  "biome": "enchanted-forest",
  "size": "large",
  "w": 59,
  "d": 56,
  "h": 55,
  "aisle": 24,
  "westX": 12,
  "westZ": 43,
  "eastX": 52,
  "eastZ": 14,
  "midZ": 28,
  "title": "Twilight rootmill valley and spore turbine keep",
  "mask": [
   [
    22,
    30,
    0,
    55
   ],
   [
    2,
    21,
    30,
    53
   ],
   [
    4,
    18,
    2,
    24
   ],
   [
    32,
    57,
    2,
    28
   ],
   [
    34,
    58,
    31,
    54
   ],
   [
    16,
    31,
    22,
    38
   ],
   [
    1,
    10,
    49,
    55
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     3,
     20,
     31,
     52
    ],
    "top": 26,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east offset machinery",
    "r": [
     33,
     56,
     3,
     27
    ],
    "top": 23,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "side freight canopy",
    "r": [
     35,
     57,
     32,
     53
    ],
    "top": 20,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "outboard processing annex",
    "r": [
     5,
     17,
     3,
     23
    ],
    "top": 18,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     4,
     6,
     2,
     4,
     32,
     34
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     34,
     36,
     2,
     4,
     4,
     6
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     36,
     38,
     2,
     4,
     33,
     35
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     4,
     4,
     2,
     6,
     35,
     36
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    4,
    2,
    33,
    "west custom brace"
   ],
   [
    55,
    2,
    25,
    "east custom brace"
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 12,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "biome130:096 livingwood braces unregistered; no magical milling"
 },
 {
  "type": "mill",
  "biome": "mountain",
  "size": "medium",
  "w": 46,
  "d": 43,
  "h": 47,
  "aisle": 19,
  "westX": 8,
  "westZ": 28,
  "eastX": 39,
  "eastZ": 11,
  "midZ": 21,
  "title": "Cliffgrain Z-turn and north granite axle mill",
  "mask": [
   [
    17,
    25,
    0,
    42
   ],
   [
    1,
    16,
    14,
    38
   ],
   [
    4,
    15,
    0,
    11
   ],
   [
    28,
    45,
    2,
    19
   ],
   [
    27,
    44,
    25,
    41
   ],
   [
    15,
    31,
    19,
    31
   ],
   [
    0,
    8,
    36,
    42
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     2,
     15,
     15,
     37
    ],
    "top": 23,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     29,
     44,
     3,
     18
    ],
    "top": 20,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     28,
     43,
     26,
     40
    ],
    "top": 17,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     5,
     14,
     1,
     10
    ],
    "top": 15,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     3,
     5,
     2,
     4,
     16,
     18
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     30,
     32,
     2,
     4,
     4,
     6
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     29,
     31,
     2,
     4,
     27,
     29
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     3,
     3,
     2,
     6,
     19,
     20
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    3,
    2,
    17,
    "west custom brace"
   ],
   [
    43,
    2,
    16,
    "east custom brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "biome130:098 cliff anchor fittings unregistered; no rope lifts"
 },
 {
  "type": "mill",
  "biome": "mountain",
  "size": "large",
  "w": 61,
  "d": 55,
  "h": 55,
  "aisle": 37,
  "westX": 20,
  "westZ": 15,
  "eastX": 52,
  "eastZ": 39,
  "midZ": 27,
  "title": "Granite transept mill citadel with two aqueducts",
  "mask": [
   [
    35,
    43,
    0,
    54
   ],
   [
    2,
    34,
    2,
    27
   ],
   [
    8,
    32,
    32,
    53
   ],
   [
    45,
    59,
    27,
    53
   ],
   [
    46,
    60,
    1,
    21
   ],
   [
    29,
    39,
    20,
    37
   ],
   [
    1,
    12,
    45,
    54
   ]
  ],
  "roofs": [
   {
    "name": "west workshop",
    "r": [
     3,
     33,
     3,
     26
    ],
    "top": 26,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "east offset machinery",
    "r": [
     46,
     58,
     28,
     52
    ],
    "top": 23,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "side freight canopy",
    "r": [
     47,
     59,
     2,
     20
    ],
    "top": 20,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "outboard processing annex",
    "r": [
     9,
     31,
     33,
     52
    ],
    "top": 18,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "source grain or timber sorting",
    [
     4,
     6,
     2,
     4,
     4,
     6
    ],
    "pack4:057"
   ],
   [
    "source machinery cargo",
    [
     47,
     49,
     2,
     4,
     29,
     31
    ],
    "pack4:056"
   ],
   [
    "source finished stock reserve",
    [
     48,
     50,
     2,
     4,
     3,
     5
    ],
    "pack5:079"
   ]
  ],
  "partitions": [
   [
    "interior load-bearing cross brace",
    [
     4,
     4,
     2,
     6,
     7,
     8
    ],
    "pack2:015"
   ]
  ],
  "details": [
   [
    4,
    2,
    5,
    "west custom brace"
   ],
   [
    57,
    2,
    50,
    "east custom brace"
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "west": "grain prep and quern vault",
  "east": "wheel-drive milling house",
  "yard": "two-wide open grain cart court",
  "dependency": "biome130:098 cliff anchor fittings unregistered; no rope lifts"
 }
];
const bySlot=new Map(plans.map(p=>[p.type+':'+p.biome+':'+p.size,p]));
export function createVariant4CompletionBlueprint(type,biome,size,variant=4){
 if(variant!==4)throw new RangeError('Only specifically authored variant 4 belongs to this independent batch');
 const p=bySlot.get(type+':'+biome+':'+size);
 if(!p)throw new RangeError('Unwritten variant-4 architecture '+[type,biome,size].join(':'));
 return create(p);
}
export function createVariant4CompletionPool(){return plans.map(create);}
