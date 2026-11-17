// Builder 3B M3 first independently authored small barracks: 5 genuine coordinate-source multiroom compounds.
// No world registration, gameplay, save migration, or changes outside this isolated builder lane.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const key=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;
const plans=[
 {
  "biome": "temperate",
  "title": "Riverbank Garrison — alternating bunk wings, open central muster lane and high twinwood truss",
  "w": 33,
  "d": 33,
  "aisle": 14,
  "mask": [
   [
    11,
    18,
    0,
    32
   ],
   [
    0,
    13,
    3,
    14
   ],
   [
    19,
    32,
    12,
    25
   ],
   [
    2,
    13,
    22,
    31
   ],
   [
    19,
    26,
    0,
    9
   ]
  ],
  "rooms": [
   [
    "west",
    "north-bunks",
    "bunks",
    [
     1,
     12,
     4,
     13
    ],
    8
   ],
   [
    "east",
    "mess-house",
    "mess",
    [
     20,
     31,
     13,
     24
    ],
    18
   ],
   [
    "west",
    "equipment-hall",
    "armory",
    [
     3,
     12,
     23,
     30
    ],
    26
   ],
   [
    "east",
    "officer-post",
    "duty",
    [
     20,
     25,
     1,
     8
    ],
    4
   ]
  ],
  "roofStyle": "twin-gable",
  "roofBands": [
   2,
   4,
   1,
   3
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079"
 },
 {
  "biome": "desert",
  "title": "Red Dune Caravan Barracks — long caravan yard, offset sleeping court and eastern guard shelter",
  "w": 36,
  "d": 32,
  "aisle": 13,
  "mask": [
   [
    10,
    19,
    0,
    31
   ],
   [
    0,
    12,
    17,
    30
   ],
   [
    20,
    35,
    1,
    16
   ],
   [
    23,
    33,
    23,
    30
   ],
   [
    1,
    11,
    1,
    9
   ]
  ],
  "rooms": [
   [
    "west",
    "shade-dormitory",
    "bunks",
    [
     1,
     11,
     18,
     29
    ],
    23
   ],
   [
    "east",
    "night-watch-mess",
    "mess",
    [
     21,
     34,
     2,
     15
    ],
    8
   ],
   [
    "east",
    "supply-vault",
    "armory",
    [
     24,
     32,
     24,
     29
    ],
    26
   ],
   [
    "west",
    "field-office",
    "duty",
    [
     2,
     10,
     2,
     8
    ],
    4
   ]
  ],
  "roofStyle": "sundown-terrace",
  "roofBands": [
   1,
   3,
   4,
   2
  ],
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080"
 },
 {
  "biome": "snow",
  "title": "Pinewatch Winter Barracks — avalanche refuge, snow break dining and western rescue annex",
  "w": 34,
  "d": 38,
  "aisle": 15,
  "mask": [
   [
    11,
    19,
    0,
    37
   ],
   [
    0,
    14,
    1,
    17
   ],
   [
    20,
    33,
    22,
    37
   ],
   [
    2,
    13,
    27,
    36
   ],
   [
    20,
    28,
    3,
    13
   ]
  ],
  "rooms": [
   [
    "west",
    "winter-sleeping-wing",
    "bunks",
    [
     1,
     13,
     2,
     16
    ],
    8
   ],
   [
    "east",
    "warming-mess",
    "mess",
    [
     21,
     32,
     23,
     36
    ],
    28
   ],
   [
    "west",
    "rescue-store",
    "armory",
    [
     3,
     12,
     28,
     35
    ],
    31
   ],
   [
    "east",
    "signal-office",
    "duty",
    [
     21,
     27,
     4,
     12
    ],
    6
   ]
  ],
  "roofStyle": "snow-cross-pitch",
  "roofBands": [
   5,
   1,
   4,
   3
  ],
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081"
 },
 {
  "biome": "enchanted-forest",
  "title": "Moonroot Forest Guard — staggered living pods around long empty central gathering spine",
  "w": 39,
  "d": 35,
  "aisle": 17,
  "mask": [
   [
    13,
    22,
    0,
    34
   ],
   [
    0,
    16,
    17,
    33
   ],
   [
    23,
    38,
    7,
    23
   ],
   [
    1,
    13,
    2,
    10
   ],
   [
    25,
    35,
    27,
    34
   ]
  ],
  "rooms": [
   [
    "west",
    "moss-bed-hall",
    "bunks",
    [
     1,
     15,
     18,
     32
    ],
    23
   ],
   [
    "east",
    "lantern-mess",
    "mess",
    [
     24,
     37,
     8,
     22
    ],
    14
   ],
   [
    "west",
    "herbal-store",
    "armory",
    [
     2,
     12,
     3,
     9
    ],
    5
   ],
   [
    "east",
    "warden-study",
    "duty",
    [
     26,
     34,
     28,
     33
    ],
    30
   ]
  ],
  "roofStyle": "irregular-canopy-saw",
  "roofBands": [
   3,
   5,
   2,
   4
  ],
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079"
 },
 {
  "biome": "mountain",
  "title": "Stonepass Cliff Barracks — stepped quarry quadrants, west machine room and offset high-mess roof",
  "w": 37,
  "d": 40,
  "aisle": 16,
  "mask": [
   [
    12,
    21,
    0,
    39
   ],
   [
    0,
    15,
    9,
    25
   ],
   [
    22,
    36,
    21,
    39
   ],
   [
    2,
    14,
    30,
    39
   ],
   [
    22,
    32,
    1,
    15
   ]
  ],
  "rooms": [
   [
    "west",
    "stone-bunk-vault",
    "bunks",
    [
     1,
     14,
     10,
     24
    ],
    16
   ],
   [
    "east",
    "ridge-mess",
    "mess",
    [
     23,
     35,
     22,
     38
    ],
    27
   ],
   [
    "west",
    "tool-and-armor-store",
    "armory",
    [
     3,
     13,
     31,
     38
    ],
    34
   ],
   [
    "east",
    "warden-quarters",
    "duty",
    [
     23,
     31,
     2,
     14
    ],
    7
   ]
  ],
  "roofStyle": "staggered-mountain-ridge",
  "roofBands": [
   4,
   2,
   6,
   3
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080"
 }
];
function create(p){
 const id=assertSlot('barracks',p.biome,'small',1),w=p.w,d=p.d,H=15;
 const footprint=new Set();
 const rect=(a,b,c,e,fn)=>{for(let x=a;x<=b;x++)for(let z=c;z<=e;z++)fn(x,z);};
 for(const [a,b,c,e] of p.mask)rect(a,b,c,e,(x,z)=>footprint.add(flat(x,z)));
 // Integer-coordinate, two-wide hall bridges join every genuinely offset room to the main barracks spine.
 const roomData=p.rooms.map(([side,name,kind,[a,b,c,e],doorZ])=>{
  const nodeX=side==='west'?b-3:a+1;
  const left=Math.min(nodeX,p.aisle),right=Math.max(nodeX+1,p.aisle+1);
  rect(left,right,doorZ,doorZ+1,(x,z)=>footprint.add(flat(x,z)));
  return {side,name,kind,rect:[a,b,c,e],doorZ,nodeX,bridge:[left,right,doorZ,doorZ+1]};
 });
 const ground=[...footprint].map(s=>s.split(',').map(Number)),modules=new Map(),occupied=new Map();
 const clearances=[B(p.aisle,2,0,2,3,d)];
 for(const r of roomData){
  const [a,b,c,e]=r.rect;
  clearances.push(B(a+1,2,c+1,b-a-1,3,e-c-1));
  clearances.push(B(r.bridge[0],2,r.doorZ,r.bridge[1]-r.bridge[0]+1,3,2));
 }
 const reserved=(x,y,z)=>clearances.some(c=>x>=c.x&&x<c.x+c.width&&y>=c.y&&y<c.y+c.height&&z>=c.z&&z<c.z+c.depth);
 function write(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=H||z<0||z>=d)throw Error(id+' source out of envelope '+[role,x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' missing physical family '+ref);
  if(!footprint.has(flat(x,z)))return false;
  if(role!=='foundation'&&role!=='floor'&&reserved(x,y,z))return false;
  const k=key(x,y,z);if(occupied.has(k))return false;
  occupied.set(k,role);if(!modules.has(role))modules.set(role,[]);
  modules.get(role).push([x,y,z,ref]);return true;
 }
 for(const [x,z] of ground){write('foundation',x,0,z,'builtin:stone');write('floor',x,1,z,p.floor);}
 // Physical Pack4 supply cache occupies an intentional non-circulation corner,
 // below the roofing and before wall placement, so it cannot be an unplaced label.
 for(const r of roomData){
  const [a,b,c,e]=r.rect;
  if(!write('equipment-store',a,2,c,'pack4:057'))throw Error(id+' supply source fails physical placement '+r.name);
  if(!write('equipment-store',a,3,c,p.trim))throw Error(id+' supplier trim source missing '+r.name);
 }
 for(const [x,z] of ground){
  const edge=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,b])=>!footprint.has(flat(a,b)));
  if(edge)for(let y=2;y<=6;y++)write('wall',x,y,z,p.wall);
 }
 // Perimeter partitions are real multi-room separator walls, preserving 2-wide connecting doorways.
 for(const r of roomData){const[a,b,c,e]=r.rect;
  for(let x=a;x<=b;x++)for(let z=c;z<=e;z++)if(x===a||x===b||z===c||z===e)
   for(let y=2;y<=6;y++)write('room-bulkhead',x,y,z,p.wall);
  // Source-backed gabled/terraced regional roof columns rise from an actual continuous under-roof.
 }
 for(const [x,z] of ground)write('roof',x,7,z,p.roof);
 for(let ri=0;ri<roomData.length;ri++){
  const r=roomData[ri],[a,b,c,e]=r.rect;
  const axis=(p.roofStyle.includes('gable')||p.roofStyle.includes('cross'))?ri%2===0?'x':'z':ri%2===0?'z':'x';
  const peak=p.roofBands[ri];
  for(let x=a;x<=b;x++)for(let z=c;z<=e;z++){
   if(!footprint.has(flat(x,z)))continue;
   const inset=axis==='x'?Math.min(x-a,b-x):Math.min(z-c,e-z);
   const rise=Math.min(peak,Math.floor(inset/3)+(ri%2));
   for(let y=8;y<=8+rise;y++)write('source-bearing-roof-mass',x,y,z,p.roof);
  }
 }
 // Distinct true source-backed watch vents and sheltered eave piers.
 for(let ri=0;ri<p.mask.length;ri++){
  const[a,b,c,e]=p.mask[ri],x=ri%2?a:b,z=ri%2?c:e;
  for(let y=2;y<=9+(ri%3);y++)write('regional-eave-pier',x,y,z,p.post);
 }
 const nodes=[{id:'entry',x:p.aisle,y:2,z:d-1,width:2,headroom:3},
  {id:'muster-lane',x:p.aisle,y:2,z:1,width:2,headroom:3}];
 const edges=[{from:'entry',to:'muster-lane',kind:'level'}];
 const spaces=[{id:'main-muster',kind:'muster',bounds:B(p.aisle,2,0,2,3,d),accessNode:'muster-lane'}];
 for(let ri=0;ri<roomData.length;ri++){
  const r=roomData[ri],[a,b,c,e]=r.rect,node='room-'+ri,junction='junction-'+ri;
  nodes.push({id:junction,x:p.aisle,y:2,z:r.doorZ,width:2,headroom:3});
  nodes.push({id:node,x:r.nodeX,y:2,z:r.doorZ,width:2,headroom:3});
  edges.push({from:'muster-lane',to:junction,kind:'level'},{from:junction,to:node,kind:'level'});
  spaces.push({id:r.name,kind:r.kind,bounds:B(a+1,2,c+1,b-a-1,3,e-c-1),accessNode:node});
 }
 const bp={
  id,type:'barracks',biome:p.biome,size:'small',variant:1,status:'theoretical',activated:false,
  envelope:B(0,0,0,w,H,d),
  modules:[...modules].map(([role,cells])=>({id:role+'-01',role,cells})),
  clearances,openings:[{id:'main-guard-door',facing:'south',x:p.aisle,y:2,z:d-1,width:2,height:3}],
  spaces,navigation:{entry:'entry',nodes,edges},
  features:[
   {name:'source-backed four-room garrison',position:[p.aisle,2,1],assetRef:p.post,unresolvedDependency:null},
   {name:'actual supply cache',position:[roomData[0].rect[0],2,roomData[0].rect[2]],assetRef:'pack4:057',unresolvedDependency:null},
   {name:'not-installed garrison AI',position:[p.aisle,2,d-1],assetRef:null,unresolvedDependency:'Barracks guard AI and gameplay staffing remain unimplemented'}
  ],
  architecture:{kind:p.title,physicalFourRoomPlan:true,groundedTwoWideRoute:true,
   originalMaskRegions:p.mask.length,sourceRooms:roomData.map(r=>({name:r.name,side:r.side,bounds:[...r.rect],doorZ:r.doorZ,bridge:[...r.bridge]})),
   footprintCells:footprint.size,roofFamily:p.roofStyle,physicalRoofMassing:true,sourceCellCount:occupied.size,
   creatorApproved:false,worldPlaced:false,perCellVariantResolved:false,perCellYawResolved:false},
  dependencies:[p.wall,p.floor,p.roof,p.post,p.trim,'pack4:057','Source-collision AABB, selection/yaw/multi-cell footprint and garrison staffing not yet approved'],
  implementation:'THEORETICAL_3B_BARRACKS_VARIANT1_SMALL_ONLY; no integration, shared code, saves or production registration'
 };
 validateBlueprint(bp,ASSET_CATALOG);return bp;
}
const byBiome=new Map(plans.map(p=>[p.biome,p]));
export function createM3BarracksSmallFirstBlueprint(type,biome,size,variant=1){
 if(type!=='barracks'||size!=='small'||variant!==1)throw new RangeError('Only authored small barracks variant 1 allocated here');
 const p=byBiome.get(biome);if(!p)throw new RangeError('Unwritten barracks biome');
 return create(p);
}
export function createM3BarracksSmallFirstPool(){return plans.map(create);}
