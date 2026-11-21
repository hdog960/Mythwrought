// Builder 3B independent watchtower variant 2 — ten independently source-authored medium/large voxel plans.
// This file never places or registers a structure in-game; PR #122's originals unchanged.
import {assertSlot} from './roster.mjs';
import {ASSET_CATALOG} from './assets.mjs';
import {validateBlueprint} from './contract.mjs';
const B=(x,y,z,width,height,depth)=>({x,y,z,width,height,depth});
const N=(id,x,y,z,kind='passage')=>({id,x,y,z,kind,width:2,headroom:2});
const E=(from,to,kind='level')=>({from,to,kind});
const key=(x,y,z)=>x+','+y+','+z,flat=(x,z)=>x+','+z;
const plans=[
 {
  "biome": "temperate",
  "size": "medium",
  "w": 34,
  "d": 42,
  "steps": 14,
  "aisle": 13,
  "title": "Riverwatch broken H-keep with west raft wharf and southeast signal chapel",
  "mask": [
   [
    3,
    17,
    0,
    41
   ],
   [
    0,
    10,
    3,
    15
   ],
   [
    21,
    33,
    24,
    40
   ],
   [
    21,
    32,
    2,
    12
   ],
   [
    5,
    10,
    29,
    38
   ],
   [
    16,
    22,
    7,
    9
   ],
   [
    16,
    22,
    27,
    30
   ]
  ],
  "canopy": [
   7,
   16,
   6,
   14
  ],
  "roofType": "gable",
  "cargo": [
   2,
   8
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079",
  "symbol": "",
  "roofRibs": [
   [
    1,
    8,
    5,
    12,
    "x",
    3
   ],
   [
    24,
    31,
    27,
    35,
    "z",
    2
   ]
  ]
 },
 {
  "biome": "desert",
  "size": "medium",
  "w": 37,
  "d": 41,
  "steps": 15,
  "aisle": 12,
  "title": "Sandglass forked caravan checkpoint with eastern crenel loft and west market lane",
  "mask": [
   [
    3,
    16,
    0,
    40
   ],
   [
    0,
    10,
    21,
    40
   ],
   [
    18,
    31,
    2,
    15
   ],
   [
    25,
    30,
    23,
    39
   ],
   [
    0,
    9,
    2,
    10
   ],
   [
    15,
    25,
    9,
    12
   ],
   [
    15,
    27,
    26,
    31
   ]
  ],
  "canopy": [
   7,
   15,
   7,
   15
  ],
  "roofType": "terrace",
  "cargo": [
   2,
   28
  ],
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "",
  "roofRibs": [
   [
    1,
    8,
    24,
    36,
    "z",
    2
   ],
   [
    20,
    29,
    5,
    12,
    "x",
    3
   ]
  ]
 },
 {
  "biome": "snow",
  "size": "medium",
  "w": 35,
  "d": 45,
  "steps": 16,
  "aisle": 12,
  "title": "Icepine split refuge with raised avalanche gallery and winter skywatch",
  "mask": [
   [
    3,
    17,
    0,
    44
   ],
   [
    0,
    11,
    2,
    24
   ],
   [
    19,
    34,
    19,
    44
   ],
   [
    22,
    29,
    5,
    11
   ],
   [
    0,
    7,
    34,
    44
   ],
   [
    16,
    24,
    23,
    26
   ],
   [
    16,
    25,
    6,
    9
   ]
  ],
  "canopy": [
   7,
   16,
   6,
   15
  ],
  "roofType": "cross",
  "cargo": [
   2,
   14
  ],
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081",
  "symbol": "biome130:094",
  "roofRibs": [
   [
    1,
    9,
    5,
    16,
    "x",
    3
   ],
   [
    21,
    32,
    24,
    35,
    "z",
    4
   ]
  ]
 },
 {
  "biome": "enchanted-forest",
  "size": "medium",
  "w": 39,
  "d": 43,
  "steps": 15,
  "aisle": 13,
  "title": "Moonroot forked lantern keep and opposing fungal skybridges",
  "mask": [
   [
    3,
    18,
    0,
    42
   ],
   [
    0,
    11,
    21,
    41
   ],
   [
    25,
    38,
    15,
    30
   ],
   [
    28,
    38,
    34,
    42
   ],
   [
    0,
    9,
    2,
    9
   ],
   [
    17,
    25,
    13,
    16
   ],
   [
    17,
    31,
    33,
    36
   ]
  ],
  "canopy": [
   7,
   17,
   6,
   14
  ],
  "roofType": "saw",
  "cargo": [
   2,
   30
  ],
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079",
  "symbol": "biome130:096",
  "roofRibs": [
   [
    1,
    10,
    25,
    36,
    "z",
    3
   ],
   [
    28,
    36,
    17,
    26,
    "x",
    3
   ]
  ]
 },
 {
  "biome": "mountain",
  "size": "medium",
  "w": 38,
  "d": 47,
  "steps": 17,
  "aisle": 13,
  "title": "Cliffgate staggered granite eyrie with side cable stages",
  "mask": [
   [
    3,
    19,
    0,
    46
   ],
   [
    0,
    10,
    16,
    46
   ],
   [
    21,
    37,
    7,
    16
   ],
   [
    23,
    31,
    29,
    40
   ],
   [
    0,
    8,
    1,
    9
   ],
   [
    18,
    27,
    8,
    11
   ],
   [
    18,
    30,
    32,
    35
   ]
  ],
  "canopy": [
   8,
   18,
   7,
   15
  ],
  "roofType": "slope",
  "cargo": [
   2,
   27
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "biome130:098",
  "roofRibs": [
   [
    1,
    8,
    22,
    40,
    "x",
    2
   ],
   [
    24,
    30,
    10,
    15,
    "z",
    4
   ]
  ]
 },
 {
  "biome": "temperate",
  "size": "large",
  "w": 50,
  "d": 55,
  "steps": 18,
  "aisle": 14,
  "title": "Riverbend split river fortress with tall west barrack and lower southeast timber bridge",
  "mask": [
   [
    3,
    21,
    0,
    54
   ],
   [
    0,
    12,
    4,
    23
   ],
   [
    0,
    15,
    34,
    54
   ],
   [
    24,
    49,
    3,
    17
   ],
   [
    29,
    49,
    24,
    52
   ],
   [
    20,
    30,
    8,
    11
   ],
   [
    20,
    33,
    33,
    37
   ]
  ],
  "canopy": [
   8,
   19,
   7,
   17
  ],
  "roofType": "cross",
  "cargo": [
   2,
   16
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079",
  "symbol": "",
  "roofRibs": [
   [
    1,
    11,
    8,
    20,
    "z",
    3
   ],
   [
    32,
    47,
    30,
    48,
    "x",
    4
   ]
  ]
 },
 {
  "biome": "desert",
  "size": "large",
  "w": 53,
  "d": 52,
  "steps": 19,
  "aisle": 15,
  "title": "Dune watch compound with broken windward caravan dock and eastern beacon tower",
  "mask": [
   [
    3,
    22,
    0,
    51
   ],
   [
    0,
    13,
    17,
    48
   ],
   [
    25,
    50,
    2,
    20
   ],
   [
    31,
    45,
    34,
    50
   ],
   [
    5,
    10,
    1,
    9
   ],
   [
    21,
    32,
    10,
    14
   ],
   [
    21,
    36,
    25,
    34
   ]
  ],
  "canopy": [
   8,
   20,
   7,
   17
  ],
  "roofType": "slope",
  "cargo": [
   2,
   29
  ],
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "",
  "roofRibs": [
   [
    1,
    11,
    25,
    43,
    "x",
    3
   ],
   [
    28,
    46,
    5,
    17,
    "z",
    3
   ]
  ]
 },
 {
  "biome": "snow",
  "size": "large",
  "w": 51,
  "d": 58,
  "steps": 19,
  "aisle": 15,
  "title": "Frostmark blizzard-wall observatory and snowport field hospital",
  "mask": [
   [
    3,
    21,
    0,
    57
   ],
   [
    0,
    12,
    3,
    26
   ],
   [
    0,
    15,
    42,
    57
   ],
   [
    29,
    44,
    21,
    54
   ],
   [
    32,
    45,
    5,
    13
   ],
   [
    20,
    32,
    1,
    11
   ],
   [
    20,
    32,
    31,
    35
   ]
  ],
  "canopy": [
   8,
   20,
   7,
   16
  ],
  "roofType": "gable",
  "cargo": [
   2,
   16
  ],
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081",
  "symbol": "biome130:094",
  "roofRibs": [
   [
    1,
    11,
    6,
    23,
    "z",
    4
   ],
   [
    32,
    42,
    28,
    47,
    "x",
    4
   ]
  ]
 },
 {
  "biome": "enchanted-forest",
  "size": "large",
  "w": 54,
  "d": 55,
  "steps": 20,
  "aisle": 15,
  "title": "Elderbloom asymmetrical root bastion with three canopy shrines",
  "mask": [
   [
    3,
    22,
    0,
    54
   ],
   [
    0,
    12,
    2,
    17
   ],
   [
    0,
    14,
    27,
    53
   ],
   [
    26,
    53,
    10,
    36
   ],
   [
    36,
    53,
    44,
    54
   ],
   [
    31,
    50,
    1,
    9
   ],
   [
    21,
    33,
    20,
    24
   ],
   [
    21,
    40,
    47,
    50
   ]
  ],
  "canopy": [
   8,
   21,
   7,
   16
  ],
  "roofType": "terrace",
  "cargo": [
   2,
   10
  ],
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079",
  "symbol": "biome130:096",
  "roofRibs": [
   [
    1,
    11,
    34,
    47,
    "x",
    2
   ],
   [
    30,
    48,
    15,
    30,
    "z",
    4
   ]
  ]
 },
 {
  "biome": "mountain",
  "size": "large",
  "w": 55,
  "d": 59,
  "steps": 21,
  "aisle": 16,
  "title": "Highcrag staggered cliff bastion with suspended stone lookout and mining camp",
  "mask": [
   [
    3,
    23,
    0,
    58
   ],
   [
    0,
    15,
    29,
    58
   ],
   [
    0,
    10,
    3,
    16
   ],
   [
    31,
    54,
    1,
    22
   ],
   [
    31,
    51,
    32,
    58
   ],
   [
    22,
    34,
    9,
    13
   ],
   [
    22,
    37,
    39,
    43
   ]
  ],
  "canopy": [
   8,
   21,
   7,
   18
  ],
  "roofType": "saw",
  "cargo": [
   2,
   40
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "biome130:098",
  "roofRibs": [
   [
    1,
    13,
    35,
    49,
    "z",
    4
   ],
   [
    34,
    51,
    6,
    19,
    "x",
    4
   ]
  ]
 }
];

function create(p){
 const {w,d,steps,aisle}=p,sx=4,sz=5,deckY=steps,lastZ=sz+steps-1;
 const id=assertSlot('watchtower',p.biome,p.size,2);
 const mask=new Set();
 for(const [x0,x1,z0,z1] of p.mask)
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++)mask.add(flat(x,z));
 const core=p.mask[0],isCore=(x,z)=>x>=core[0]&&x<=core[1]&&z>=core[2]&&z<=core[3];
 const halls=[
  B(aisle,2,0,2,3,d),B(sx,2,4,aisle-sx+2,3,1),
  ...Array.from({length:steps},(_,i)=>B(sx,2+i,sz+i,2,2,1)),
  B(sx+2,deckY+1,lastZ,aisle-sx,2,2),
  B(aisle,deckY+1,3,2,2,lastZ-1)
 ];
 const reserved=(x,y,z)=>halls.some(b=>x>=b.x&&x<b.x+b.width&&y>=b.y&&y<b.y+b.height&&z>=b.z&&z<b.z+b.depth);
 const blocks=new Map(),mods=new Map();
 function write(role,x,y,z,ref){
  if(![x,y,z].every(Number.isSafeInteger)||x<0||x>=w||y<0||y>=steps+14||z<0||z>=d)
   throw Error(id+' local voxel outside envelope '+[x,y,z]);
  if(!Object.hasOwn(ASSET_CATALOG,ref))throw Error(id+' missing source family '+ref);
  if(!mask.has(flat(x,z)))return false;
  if(role!=='foundation'&&role!=='floor'&&reserved(x,y,z))return false;
  const k=key(x,y,z);if(blocks.has(k))return false;
  blocks.set(k,role);if(!mods.has(role))mods.set(role,[]);
  mods.get(role).push([x,y,z,ref]);return true;
 }
 const stair=(x,z)=>x>=sx&&x<sx+2&&z>=sz&&z<=lastZ;
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  write('foundation',x,0,z,'builtin:stone');
  if(!stair(x,z))write('floor',x,1,z,p.floor);
 }
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  const boundary=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,b])=>!mask.has(flat(a,b)));
  if(boundary)for(let y=2;y<=(isCore(x,z)?deckY-1:6);y++)write('wall',x,y,z,p.wall);
 }
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  if(isCore(x,z)){if(!stair(x,z))write('roof',x,deckY,z,p.floor);}
  else write('roof',x,7,z,p.roof);
 }
 for(let i=0;i<steps;i++)for(let x=sx;x<sx+2;x++){
  const z=sz+i;
  for(let y=1;y<=i;y++)write('stair-support',x,y,z,p.post);
  write('stair',x,1+i,z,'pack1:008');
 }
 for(const cell of mask){
  const [x,z]=cell.split(',').map(Number);
  if(!isCore(x,z))continue;
  const edge=[[x+1,z],[x-1,z],[x,z+1],[x,z-1]].some(([a,b])=>!isCore(a,b));
  if(edge&&(x+z+steps)%4!==0)write('battlement',x,deckY+1,z,'pack3:070');
 }
 const [cx0,cx1,cz0,cz1]=p.canopy,top=(x,z)=>{
  if(p.roofType==='gable')return deckY+6+Math.floor(Math.min(x-cx0,cx1-x)/3);
  if(p.roofType==='cross')return deckY+6+Math.floor(Math.min(z-cz0,cz1-z)/3);
  if(p.roofType==='terrace')return deckY+6+(x<=(cx0+cx1)/2?2:0);
  if(p.roofType==='saw')return deckY+6+(Math.floor((x-cx0)/3)%2);
  return deckY+6+Math.floor((x-cx0)/4);
 };
 for(const [x,z] of [[cx0,cz0],[cx1,cz0],[cx0,cz1],[cx1,cz1]]){
  if(!isCore(x,z)||stair(x,z))throw Error(id+' unsupported canopy bearer');
  for(let y=deckY+1;y<top(x,z);y++)write('canopy-bearing',x,y,z,p.post);
 }
 for(let x=cx0;x<=cx1;x++)for(let z=cz0;z<=cz1;z++)write('canopy-roof',x,top(x,z),z,p.roof);
 for(let x=cx0+1;x<=cx1;x++)for(let z=cz0;z<=cz1;z++){
  const prev=top(x-1,z),next=top(x,z);
  for(let y=Math.min(prev,next);y<Math.max(prev,next);y++)write('canopy-x-brace',prev<next?x:x-1,y,z,p.post);
 }
 for(let z=cz0+1;z<=cz1;z++)for(let x=cx0;x<=cx1;x++){
  const prev=top(x,z-1),next=top(x,z);
  for(let y=Math.min(prev,next);y<Math.max(prev,next);y++)write('canopy-z-brace',x,y,prev<next?z:z-1,p.post);
 }
 // Explicit source-cell-supported pitched annex rooflines, unlike identical flat box roofs.
 // These extra authored roof ridges sit on existing y=7 bearing roofs, are not cosmetic SVG assets.
 for(const [x0,x1,z0,z1,axis,rise] of p.roofRibs){
  for(let x=x0;x<=x1;x++)for(let z=z0;z<=z1;z++){
   if(isCore(x,z)||!mask.has(flat(x,z)))continue;
   const inset=axis==='x'?Math.min(x-x0,x1-x):Math.min(z-z0,z1-z);
   const height=8+Math.min(rise,Math.floor(inset/3));
   for(let y=8;y<=height;y++)write('bearing-pitched-annex',x,y,z,p.roof);
  }
 }
 for(let y=2;y<=4;y++){
  write('cargo',p.cargo[0],y,p.cargo[1],'pack4:057');
  write('regional-inset',p.cargo[0]+1,y,p.cargo[1],p.trim);
 }
 const nodes=[N('entry',aisle,2,d-1,'entry'),N('base',aisle,2,4)];
 const edges=[E('entry','base')];
 for(let i=0;i<steps;i++){
  nodes.push(N('step-'+i,sx,2+i,sz+i,'stairs'));
  edges.push(E(i===0?'base':'step-'+(i-1),'step-'+i,i===0?'level':'stair'));
 }
 nodes.push(N('landing',sx+2,deckY+1,lastZ,'observation'));
 nodes.push(N('lookout',aisle,deckY+1,3,'observation'));
 edges.push(E('step-'+(steps-1),'landing'));edges.push(E('landing','lookout'));
 const bp={
  id,type:'watchtower',biome:p.biome,size:p.size,variant:2,status:'theoretical',activated:false,
  envelope:B(0,0,0,w,steps+14,d),
  modules:[...mods].map(([role,cells])=>({id:role+'-01',role,cells})),
  clearances:halls,openings:[{id:'guard-door',facing:'south',x:aisle,y:2,z:d-1,width:2,height:3}],
  spaces:[
   {id:'ground-guard',kind:'guard-access',bounds:B(aisle-1,2,1,4,4,d-2),accessNode:'base'},
   {id:'stair-chamber',kind:'upper-circulation',bounds:B(sx,2,4,aisle-sx+2,steps+1,lastZ-2),accessNode:'step-0'},
   {id:'upper-terrace',kind:'observation',bounds:B(sx+2,deckY+1,2,aisle-sx+3,2,lastZ),accessNode:'lookout'}
  ],
  navigation:{entry:'entry',nodes,edges},
  features:[
   {name:'two-wide physical stair',position:[sx,2,sz],assetRef:'pack1:008',unresolvedDependency:null},
   {name:'source-real upper-bearing',position:[cx0,deckY+1,cz0],assetRef:p.post,unresolvedDependency:null},
   {name:'real cargo source',position:[p.cargo[0],2,p.cargo[1]],assetRef:'pack4:057',unresolvedDependency:null},
   {name:'unbuilt smoke warning',position:[aisle,deckY+1,3],assetRef:null,unresolvedDependency:'Signal and fire not implemented'}
  ],
  architecture:{kind:p.title,sourceIrregularMaskedFoundation:true,footprintCells:mask.size,stairSteps:steps,
   observationAccess:true,observationY:deckY+1,roofProfile:p.roofType,
   realRoofBearingColumns:4,occupiedCoordinates:blocks.size,worldPlaced:false,creatorApproved:false,
   perCellVariantResolved:false,perCellYawResolved:false},
  dependencies:[p.wall,p.floor,p.roof,p.post,p.trim,'pack1:008','pack3:070','pack4:057',p.symbol,
   'Physical stair collider, per-cell numeric variants and yaw, multi-cell reservation unresolved'],
  implementation:'THEORETICAL_3B_WATCHTOWER_VARIANT2_ONLY: no gameplay placement, saves or runtime changes'
 };
 validateBlueprint(bp,ASSET_CATALOG);return bp;
}
const byBiomeSize=new Map(plans.map(p=>[p.biome+':'+p.size,p]));
export function createWatchtowerVariant2MediumLargeBlueprint(type,biome,size,variant=2){
 if(type!=='watchtower'||!['medium','large'].includes(size)||variant!==2)
  throw new RangeError('Only specifically authored medium/large watchtower variant 2 belongs to this cohort');
 const p=byBiomeSize.get(biome+':'+size);if(!p)throw new RangeError('Unwritten biome for watchtower second variation');
 return create(p);
}
export function createWatchtowerVariant2MediumLargePool(){return plans.map(create);}
