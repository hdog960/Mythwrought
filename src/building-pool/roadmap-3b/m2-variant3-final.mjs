// Builder 3B M2 original third-variation source-only industry buildings.
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
 const id=assertSlot(p.type,p.biome,p.size,3),shape=new Set();
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
 const result={id,type:p.type,biome:p.biome,size:p.size,variant:3,status:'theoretical',activated:false,
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
  implementation:'3B_THEORETICAL_VARIANT3_ONLY: no world placements, saves, biome registration, powered mills or harvesting'};
 validateBlueprint(result,ASSET_CATALOG);
 return result;
}
const plans=[
 {
  "type": "lumberyard",
  "biome": "temperate",
  "size": "large",
  "w": 58,
  "d": 52,
  "h": 44,
  "aisle": 26,
  "westX": 16,
  "westZ": 15,
  "eastX": 44,
  "eastZ": 35,
  "midZ": 26,
  "title": "Forked river shipwright with offset timber drydock, north beam loft and southern barge quay",
  "mask": [
   [
    24,
    31,
    0,
    51
   ],
   [
    2,
    23,
    3,
    21
   ],
   [
    9,
    23,
    22,
    32
   ],
   [
    8,
    22,
    33,
    46
   ],
   [
    1,
    15,
    38,
    51
   ],
   [
    35,
    56,
    24,
    49
   ],
   [
    37,
    54,
    2,
    18
   ],
   [
    31,
    43,
    17,
    27
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 12,
  "west": "open river-sawn keel shaping nave",
  "east": "high-racked beam assembly house",
  "yard": "double freight pier and launch court",
  "dependency": "Working sluice and timber processing still require runtime systems",
  "roofs": [
   {
    "name": "keel drydock transom",
    "r": [
     4,
     19,
     6,
     19
    ],
    "top": 22,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "northern sawbeam loft",
    "r": [
     39,
     53,
     4,
     15
    ],
    "top": 19,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "launch gantry asymmetrical pitch",
    "r": [
     37,
     54,
     28,
     45
    ],
    "top": 16,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "south barge repair pavilion",
    "r": [
     3,
     12,
     42,
     49
    ],
    "top": 13,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "keel stock",
    [
     5,
     12,
     2,
     5,
     9,
     14
    ],
    "builtin:wood"
   ],
   [
    "north beam rack",
    [
     41,
     48,
     2,
     6,
     7,
     12
    ],
    "pack4:057"
   ],
   [
    "barge crates",
    [
     5,
     10,
     2,
     4,
     44,
     48
    ],
    "pack4:057"
   ]
  ],
  "partitions": [
   [
    "shipwright keel braces",
    [
     8,
     8,
     2,
     7,
     16,
     19
    ],
    "pack2:015"
   ],
   [
    "loft rigging",
    [
     51,
     51,
     2,
     8,
     10,
     14
    ],
    "pack2:022"
   ]
  ],
  "details": [
   [
    9,
    2,
    18,
    "keel-gantry-foot"
   ],
   [
    47,
    2,
    40,
    "barge-rope-post"
   ]
  ]
 },
 {
  "type": "lumberyard",
  "biome": "desert",
  "size": "medium",
  "w": 41,
  "d": 38,
  "h": 37,
  "aisle": 18,
  "westX": 9,
  "westZ": 22,
  "eastX": 33,
  "eastZ": 10,
  "midZ": 18,
  "title": "Oasis timber customs court with offset mudbrick saw hall and wind-louver caravan timber sheds",
  "mask": [
   [
    16,
    23,
    0,
    37
   ],
   [
    2,
    15,
    9,
    29
   ],
   [
    0,
    7,
    29,
    37
   ],
   [
    3,
    11,
    2,
    9
   ],
   [
    27,
    39,
    2,
    17
   ],
   [
    29,
    39,
    20,
    34
   ],
   [
    23,
    31,
    15,
    24
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "west": "northwest palmwood saw room",
  "east": "covered datewood receiving house",
  "yard": "unroofed water-cask caravan exchange",
  "dependency": "biome130:006 sandstone, wind and oasis processing are symbolic only",
  "roofs": [
   {
    "name": "crosswind cut-room",
    "r": [
     4,
     13,
     11,
     25
    ],
    "top": 17,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "north windscoop shelter",
    "r": [
     29,
     37,
     4,
     15
    ],
    "top": 20,
    "shape": "saw",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "southern portico",
    "r": [
     31,
     37,
     22,
     32
    ],
    "top": 13,
    "shape": "lean",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "low adobe cistern store",
    "r": [
     2,
     6,
     31,
     36
    ],
    "top": 11,
    "shape": "flat",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "palmwood bundles",
    [
     5,
     8,
     2,
     4,
     13,
     17
    ],
    "builtin:wood"
   ],
   [
    "trade timber trunks",
    [
     32,
     36,
     2,
     4,
     6,
     9
    ],
    "pack4:057"
   ],
   [
    "cistern tools",
    [
     2,
     5,
     2,
     3,
     32,
     34
    ],
    "pack1:007"
   ]
  ],
  "partitions": [
   [
    "wind baffle",
    [
     6,
     6,
     2,
     6,
     18,
     22
    ],
    "pack1:010"
   ],
   [
    "saw stone pier",
    [
     36,
     36,
     2,
     6,
     10,
     13
    ],
    "pack1:010"
   ],
   [
    "plastered oasis wind-stopper",
    [
     6,
     6,
     2,
     6,
     20,
     23
    ],
    "pack5:079"
   ]
  ],
  "details": [
   [
    7,
    2,
    16,
    "oasis-saw-bearing"
   ],
   [
    34,
    2,
    29,
    "southern-gate-rib"
   ]
  ]
 },
 {
  "type": "lumberyard",
  "biome": "snow",
  "size": "small",
  "w": 31,
  "d": 34,
  "h": 33,
  "aisle": 13,
  "westX": 7,
  "westZ": 22,
  "eastX": 25,
  "eastZ": 9,
  "midZ": 17,
  "title": "Frostwood split saw refuge with staggered east sled-shed and low avalanche bracing gallery",
  "mask": [
   [
    11,
    18,
    0,
    33
   ],
   [
    1,
    10,
    13,
    29
   ],
   [
    2,
    7,
    29,
    33
   ],
   [
    21,
    29,
    1,
    19
   ],
   [
    18,
    26,
    21,
    27
   ],
   [
    7,
    13,
    8,
    15
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 8,
  "west": "snowproof fir trimming alcove",
  "east": "sled-borne lumber tally shed",
  "yard": "ice-free emergency log service lane",
  "dependency": "biome130:094 insulated walls not registered; no winter handling simulation",
  "roofs": [
   {
    "name": "west spruce winter vault",
    "r": [
     2,
     9,
     15,
     27
    ],
    "top": 15,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "high east sled rack",
    "r": [
     23,
     28,
     3,
     16
    ],
    "top": 17,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south avalanche port",
    "r": [
     19,
     25,
     22,
     26
    ],
    "top": 12,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "winter pine cordage",
    [
     3,
     6,
     2,
     4,
     18,
     23
    ],
    "builtin:wood"
   ],
   [
    "sled crates",
    [
     24,
     27,
     2,
     4,
     6,
     10
    ],
    "pack4:057"
   ],
   [
    "avalanche pier kit",
    [
     20,
     23,
     2,
     3,
     23,
     25
    ],
    "pack1:007"
   ],
   [
    "fireglaze cold-protection drying strip",
    [
     8,
     9,
     2,
     2,
     26,
     28
    ],
    "pack5:081"
   ]
  ],
  "partitions": [
   [
    "snow wedge wind wall",
    [
     4,
     4,
     2,
     6,
     24,
     27
    ],
    "pack1:002"
   ],
   [
    "sled-brake upright",
    [
     27,
     27,
     2,
     6,
     12,
     15
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    5,
    2,
    25,
    "frostwood-stay"
   ],
   [
    25,
    2,
    23,
    "sled-collar"
   ]
  ]
 },
 {
  "type": "lumberyard",
  "biome": "enchanted-forest",
  "size": "medium",
  "w": 47,
  "d": 44,
  "h": 43,
  "aisle": 21,
  "westX": 12,
  "westZ": 25,
  "eastX": 37,
  "eastZ": 11,
  "midZ": 21,
  "title": "Livingwood crescent craft canopy with offset spore-vault, moonlog bridge and moss-island yard",
  "mask": [
   [
    19,
    27,
    0,
    43
   ],
   [
    2,
    18,
    8,
    30
   ],
   [
    4,
    14,
    31,
    40
   ],
   [
    0,
    7,
    0,
    12
   ],
   [
    30,
    45,
    2,
    18
   ],
   [
    32,
    46,
    23,
    39
   ],
   [
    27,
    36,
    17,
    24
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 10,
  "west": "west moonlog shaping chamber",
  "east": "east spore-sealed branch press",
  "yard": "central fern-and-root cart promenade",
  "dependency": "biome130:096 livingwood attachment not registered; no living magic processing",
  "roofs": [
   {
    "name": "west livingwood crescent",
    "r": [
     4,
     16,
     11,
     26
    ],
    "top": 22,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east fungal saw vault",
    "r": [
     32,
     43,
     4,
     16
    ],
    "top": 18,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "southern moss louver",
    "r": [
     34,
     44,
     26,
     37
    ],
    "top": 16,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "moon bridge sapling perch",
    "r": [
     6,
     12,
     33,
     38
    ],
    "top": 12,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "fallen moonlimbs",
    [
     5,
     11,
     2,
     5,
     15,
     21
    ],
    "builtin:wood"
   ],
   [
    "spore-wood crates",
    [
     34,
     40,
     2,
     4,
     6,
     10
    ],
    "pack4:057"
   ],
   [
    "moss seedwood rack",
    [
     7,
     11,
     2,
     3,
     34,
     37
    ],
    "pack2:013"
   ]
  ],
  "partitions": [
   [
    "curved root transom",
    [
     9,
     9,
     2,
     7,
     19,
     24
    ],
    "pack2:015"
   ],
   [
    "high spore braces",
    [
     42,
     42,
     2,
     6,
     10,
     14
    ],
    "pack2:022"
   ]
  ],
  "details": [
   [
    10,
    2,
    24,
    "root-bridge-foot"
   ],
   [
    40,
    2,
    34,
    "glowwood-clasp"
   ]
  ]
 },
 {
  "type": "lumberyard",
  "biome": "mountain",
  "size": "medium",
  "w": 45,
  "d": 42,
  "h": 42,
  "aisle": 20,
  "westX": 12,
  "westZ": 14,
  "eastX": 35,
  "eastZ": 29,
  "midZ": 20,
  "title": "Switchback cliff timber terrace with offset north quarry brace and south cable-hoist shed",
  "mask": [
   [
    18,
    25,
    0,
    41
   ],
   [
    3,
    17,
    4,
    21
   ],
   [
    5,
    14,
    26,
    40
   ],
   [
    0,
    8,
    20,
    29
   ],
   [
    28,
    43,
    21,
    39
   ],
   [
    31,
    40,
    1,
    17
   ],
   [
    26,
    33,
    14,
    24
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "west": "cutrock timber intake vault",
  "east": "stepped rope-hoist timber bay",
  "yard": "cliff level twin-cart rope traverse",
  "dependency": "biome130:098 cliff anchor unregistered; no active cliff lifts or mills",
  "roofs": [
   {
    "name": "north cliff plank cut",
    "r": [
     5,
     15,
     6,
     18
    ],
    "top": 21,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south switchback hoist",
    "r": [
     30,
     41,
     24,
     36
    ],
    "top": 18,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "high rock rope canopy",
    "r": [
     33,
     38,
     3,
     14
    ],
    "top": 23,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "west stone shoring",
    "r": [
     6,
     12,
     29,
     37
    ],
    "top": 14,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "cliff pine billets",
    [
     5,
     10,
     2,
     5,
     8,
     13
    ],
    "builtin:wood"
   ],
   [
    "hoist timber pallets",
    [
     33,
     39,
     2,
     5,
     26,
     30
    ],
    "pack4:057"
   ],
   [
    "shoring stone",
    [
     7,
     11,
     2,
     3,
     31,
     35
    ],
    "pack1:007"
   ],
   [
    "fired brick timber-kiln breastwork",
    [
     32,
     34,
     2,
     3,
     25,
     29
    ],
    "pack5:080"
   ]
  ],
  "partitions": [
   [
    "north ledge tie",
    [
     8,
     8,
     2,
     7,
     13,
     17
    ],
    "pack1:010"
   ],
   [
    "hoist pin",
    [
     40,
     40,
     2,
     7,
     29,
     33
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    9,
    2,
    16,
    "cliff-timber-anchor"
   ],
   [
    38,
    2,
    33,
    "cable-landing"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "temperate",
  "size": "large",
  "w": 60,
  "d": 55,
  "h": 49,
  "aisle": 27,
  "westX": 16,
  "westZ": 31,
  "eastX": 49,
  "eastZ": 13,
  "midZ": 27,
  "title": "Three-headwater grist complex with unequal sluice mills, west grain transept and downstream flour market",
  "mask": [
   [
    25,
    34,
    0,
    54
   ],
   [
    1,
    24,
    19,
    39
   ],
   [
    4,
    19,
    3,
    17
   ],
   [
    0,
    8,
    40,
    54
   ],
   [
    38,
    58,
    2,
    22
   ],
   [
    37,
    58,
    31,
    53
   ],
   [
    33,
    43,
    20,
    34
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 12,
  "west": "long covered riverside grain cloister",
  "east": "north stone-waterwheel spindle hall",
  "yard": "wide open grain-cart turning court",
  "dependency": "Working sluice and timber processing still require runtime systems",
  "roofs": [
   {
    "name": "waterfront grain transept",
    "r": [
     3,
     21,
     22,
     36
    ],
    "top": 25,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "upper triple sluice mill",
    "r": [
     40,
     55,
     4,
     20
    ],
    "top": 23,
    "shape": "gable",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "southern flour barn",
    "r": [
     40,
     56,
     34,
     50
    ],
    "top": 18,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "small water-keeper store",
    "r": [
     6,
     16,
     5,
     15
    ],
    "top": 14,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "grain sacks",
    [
     6,
     13,
     2,
     5,
     24,
     30
    ],
    "pack4:057"
   ],
   [
    "sluice spindle stones",
    [
     43,
     52,
     2,
     5,
     8,
     14
    ],
    "pack1:010"
   ],
   [
    "downstream flour carts",
    [
     43,
     53,
     2,
     4,
     38,
     43
    ],
    "pack4:056"
   ],
   [
    "ceramic-washed quern dust apron",
    [
     41,
     46,
     2,
     2,
     6,
     11
    ],
    "pack5:081"
   ]
  ],
  "partitions": [
   [
    "river grain retaining pier",
    [
     9,
     9,
     2,
     8,
     31,
     35
    ],
    "pack2:015"
   ],
   [
    "waterwheel cage",
    [
     54,
     54,
     2,
     8,
     14,
     19
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    12,
    2,
    33,
    "sluice-transept-base"
   ],
   [
    51,
    2,
    42,
    "flour-stage-support"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "desert",
  "size": "large",
  "w": 59,
  "d": 54,
  "h": 48,
  "aisle": 26,
  "westX": 15,
  "westZ": 12,
  "eastX": 47,
  "eastZ": 39,
  "midZ": 27,
  "title": "Stepped dategrain citadel with open wind-court, diagonal-span terrace mass and dual off-axis flour towers",
  "mask": [
   [
    24,
    33,
    0,
    53
   ],
   [
    2,
    23,
    2,
    22
   ],
   [
    8,
    21,
    23,
    37
   ],
   [
    0,
    11,
    40,
    53
   ],
   [
    36,
    56,
    17,
    50
   ],
   [
    42,
    58,
    2,
    14
   ],
   [
    33,
    43,
    12,
    25
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 12,
  "west": "northern sun-grain drying arcades",
  "east": "recessed southern windquern gallery",
  "yard": "deep open caravan grain rotunda",
  "dependency": "biome130:006 sandstone, wind and oasis processing are symbolic only",
  "roofs": [
   {
    "name": "north shade-date cloister",
    "r": [
     4,
     21,
     4,
     20
    ],
    "top": 21,
    "shape": "terrace",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "south windquern massif",
    "r": [
     38,
     54,
     22,
     46
    ],
    "top": 25,
    "shape": "saw",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "secondary north windscoop",
    "r": [
     44,
     56,
     4,
     12
    ],
    "top": 28,
    "shape": "gable",
    "cover": "pack1:007",
    "post": "pack1:010"
   },
   {
    "name": "western caravan flour store",
    "r": [
     2,
     9,
     42,
     50
    ],
    "top": 14,
    "shape": "flat",
    "cover": "pack1:007",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "dry grain bins",
    [
     6,
     13,
     2,
     5,
     8,
     14
    ],
    "pack4:057"
   ],
   [
    "windquern stones",
    [
     41,
     50,
     2,
     5,
     30,
     36
    ],
    "pack1:010"
   ],
   [
    "flour barrel stage",
    [
     3,
     8,
     2,
     4,
     44,
     48
    ],
    "pack4:056"
   ]
  ],
  "partitions": [
   [
    "shaded date arch",
    [
     11,
     11,
     2,
     8,
     16,
     19
    ],
    "pack1:010"
   ],
   [
    "quern retaining pillar",
    [
     53,
     53,
     2,
     7,
     33,
     40
    ],
    "pack1:010"
   ],
   [
    "fired brick windquern hearth wall",
    [
     49,
     49,
     2,
     6,
     34,
     39
    ],
    "pack5:080"
   ]
  ],
  "details": [
   [
    12,
    2,
    18,
    "dategrain-sun-pier"
   ],
   [
    50,
    2,
    40,
    "south-stone-axle"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "snow",
  "size": "small",
  "w": 33,
  "d": 31,
  "h": 33,
  "aisle": 15,
  "westX": 8,
  "westZ": 10,
  "eastX": 27,
  "eastZ": 21,
  "midZ": 16,
  "title": "F-shaped winter grain mill with polar intake lobby, offset east frost-quern and snow-shelter outlet",
  "mask": [
   [
    13,
    19,
    0,
    30
   ],
   [
    1,
    12,
    2,
    16
   ],
   [
    4,
    10,
    20,
    30
   ],
   [
    22,
    31,
    12,
    27
   ],
   [
    23,
    31,
    0,
    8
   ],
   [
    19,
    25,
    25,
    30
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 8,
  "west": "iceproof northwest grain bay",
  "east": "east millstone cold-drive hut",
  "yard": "sheltered two-width frost-grain route",
  "dependency": "biome130:094 insulated walls not registered; no winter handling simulation",
  "roofs": [
   {
    "name": "north winter granary",
    "r": [
     3,
     10,
     4,
     14
    ],
    "top": 17,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "cold-quern stepped shed",
    "r": [
     23,
     29,
     14,
     25
    ],
    "top": 18,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "snow-baffle store",
    "r": [
     5,
     8,
     22,
     28
    ],
    "top": 12,
    "shape": "terrace",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "frost turbine upright",
    "r": [
     24,
     29,
     1,
     6
    ],
    "top": 20,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "barley insulation",
    [
     4,
     8,
     2,
     4,
     6,
     9
    ],
    "pack4:057"
   ],
   [
    "cold stone quern",
    [
     25,
     29,
     2,
     4,
     17,
     20
    ],
    "pack1:010"
   ],
   [
    "grain frostbag",
    [
     5,
     7,
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
    "winter doorway baffle",
    [
     6,
     6,
     2,
     6,
     11,
     14
    ],
    "pack1:002"
   ],
   [
    "frozen gear ring",
    [
     29,
     29,
     2,
     6,
     21,
     24
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    6,
    2,
    13,
    "winter-dust-screen"
   ],
   [
    27,
    2,
    23,
    "icegear-post"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "enchanted-forest",
  "size": "small",
  "w": 35,
  "d": 33,
  "h": 35,
  "aisle": 15,
  "westX": 8,
  "westZ": 24,
  "eastX": 28,
  "eastZ": 7,
  "midZ": 16,
  "title": "Twinned mushroom millhouses around exposed moonstream with offset southern spore-drying porch",
  "mask": [
   [
    13,
    20,
    0,
    32
   ],
   [
    1,
    12,
    14,
    31
   ],
   [
    2,
    8,
    1,
    11
   ],
   [
    24,
    33,
    1,
    17
   ],
   [
    24,
    32,
    20,
    30
   ],
   [
    20,
    27,
    16,
    25
   ]
  ],
  "floor": "pack2:013",
  "wall": "pack2:015",
  "roofWallHeight": 8,
  "west": "western luminous-grain mushroom cave",
  "east": "northern fern-quern alcove",
  "yard": "moonstream cross-cart channel",
  "dependency": "biome130:096 livingwood attachment not registered; no living magic processing",
  "roofs": [
   {
    "name": "glowgrain mushroom vault",
    "r": [
     2,
     10,
     17,
     29
    ],
    "top": 18,
    "shape": "cross",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "east fern-quern canopy",
    "r": [
     26,
     32,
     3,
     15
    ],
    "top": 16,
    "shape": "saw",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "spore-drying porch",
    "r": [
     25,
     31,
     23,
     28
    ],
    "top": 12,
    "shape": "terrace",
    "cover": "pack3:023",
    "post": "pack2:022"
   },
   {
    "name": "moonroot keeper nook",
    "r": [
     3,
     7,
     3,
     9
    ],
    "top": 11,
    "shape": "lean",
    "cover": "pack3:023",
    "post": "pack2:022"
   }
  ],
  "cargo": [
   [
    "luminous kernels",
    [
     3,
     8,
     2,
     4,
     21,
     26
    ],
    "pack4:057"
   ],
   [
    "fern quern slabs",
    [
     27,
     30,
     2,
     4,
     5,
     10
    ],
    "pack1:010"
   ],
   [
    "fungal drying trays",
    [
     26,
     29,
     2,
     3,
     25,
     27
    ],
    "pack2:013"
   ]
  ],
  "partitions": [
   [
    "west glowroot divider",
    [
     5,
     5,
     2,
     6,
     23,
     27
    ],
    "pack2:015"
   ],
   [
    "east mushroom spur",
    [
     31,
     31,
     2,
     5,
     9,
     13
    ],
    "pack2:022"
   ],
   [
    "spore-sealed plaster process baffle",
    [
     6,
     6,
     2,
     5,
     21,
     25
    ],
    "pack5:079"
   ]
  ],
  "details": [
   [
    6,
    2,
    24,
    "glowmill-root"
   ],
   [
    29,
    2,
    26,
    "spore-mill-foot"
   ]
  ]
 },
 {
  "type": "mill",
  "biome": "mountain",
  "size": "medium",
  "w": 47,
  "d": 44,
  "h": 43,
  "aisle": 21,
  "westX": 12,
  "westZ": 28,
  "eastX": 38,
  "eastZ": 12,
  "midZ": 22,
  "title": "Zigzag granite waterwheel exchange with northwest quarry ledge, high uphill chute and offset south flour house",
  "mask": [
   [
    19,
    26,
    0,
    43
   ],
   [
    1,
    18,
    16,
    38
   ],
   [
    5,
    13,
    1,
    14
   ],
   [
    0,
    7,
    36,
    43
   ],
   [
    30,
    45,
    3,
    20
   ],
   [
    32,
    46,
    27,
    42
   ],
   [
    26,
    35,
    18,
    30
   ]
  ],
  "floor": "pack1:007",
  "wall": "pack1:002",
  "roofWallHeight": 10,
  "west": "west quarry-fed grain vault",
  "east": "high east stonewater drive hall",
  "yard": "two-width stepped cliff-cart grain highway",
  "dependency": "biome130:098 cliff anchor unregistered; no active cliff lifts or mills",
  "roofs": [
   {
    "name": "western cliff-grain transept",
    "r": [
     3,
     16,
     19,
     35
    ],
    "top": 23,
    "shape": "cross",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "high mill drive",
    "r": [
     32,
     43,
     5,
     17
    ],
    "top": 25,
    "shape": "gable",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "south flour lookout",
    "r": [
     34,
     44,
     30,
     40
    ],
    "top": 17,
    "shape": "saw",
    "cover": "pack3:025",
    "post": "pack1:010"
   },
   {
    "name": "quarry-gate store",
    "r": [
     7,
     11,
     3,
     11
    ],
    "top": 13,
    "shape": "slope",
    "cover": "pack3:025",
    "post": "pack1:010"
   }
  ],
  "cargo": [
   [
    "ledge grain hoppers",
    [
     4,
     11,
     2,
     5,
     22,
     28
    ],
    "pack4:057"
   ],
   [
    "rock quern flywheel",
    [
     34,
     41,
     2,
     5,
     8,
     13
    ],
    "pack1:010"
   ],
   [
    "highland flour stock",
    [
     36,
     42,
     2,
     4,
     34,
     38
    ],
    "pack4:056"
   ]
  ],
  "partitions": [
   [
    "quarry ledge rib",
    [
     8,
     8,
     2,
     7,
     26,
     31
    ],
    "pack1:010"
   ],
   [
    "stone turbine buttress",
    [
     43,
     43,
     2,
     8,
     11,
     15
    ],
    "pack1:010"
   ]
  ],
  "details": [
   [
    9,
    2,
    29,
    "quarry-grain-clamp"
   ],
   [
    40,
    2,
    36,
    "flour-cliff-anchor"
   ]
  ]
 }
];
const bySlot=new Map(plans.map(p=>[p.type+':'+p.biome+':'+p.size,p]));
export function createVariant3FinalBlueprint(type,biome,size,variant=3){
 if(variant!==3)throw new RangeError('Only specifically authored variant 3 belongs to this independent batch');
 const p=bySlot.get(type+':'+biome+':'+size);
 if(!p)throw new RangeError('Unwritten variant-3 architecture '+[type,biome,size].join(':'));
 return create(p);
}
export function createVariant3FinalPool(){return plans.map(create);}
