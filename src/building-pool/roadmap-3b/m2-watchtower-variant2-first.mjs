// Builder 3B independent watchtower variant 2 — five original integer voxel plans.
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
  "w": 24,
  "d": 29,
  "steps": 9,
  "aisle": 10,
  "title": "Riverwatch broken bastion",
  "mask": [
   [
    3,
    14,
    0,
    28
   ],
   [
    0,
    9,
    3,
    15
   ],
   [
    16,
    23,
    8,
    18
   ],
   [
    16,
    23,
    23,
    28
   ],
   [
    1,
    8,
    23,
    28
   ],
   [
    13,
    17,
    10,
    12
   ],
   [
    13,
    17,
    24,
    26
   ]
  ],
  "canopy": [
   6,
   13,
   5,
   11
  ],
  "roofType": "gable",
  "cargo": [
   2,
   10
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:023",
  "post": "pack2:015",
  "trim": "pack5:079",
  "symbol": ""
 },
 {
  "biome": "desert",
  "w": 26,
  "d": 27,
  "steps": 10,
  "aisle": 11,
  "title": "Oasis toll signal bastion",
  "mask": [
   [
    3,
    15,
    0,
    26
   ],
   [
    0,
    8,
    13,
    26
   ],
   [
    17,
    25,
    2,
    13
   ],
   [
    19,
    25,
    19,
    25
   ],
   [
    0,
    8,
    1,
    8
   ],
   [
    14,
    18,
    5,
    7
   ],
   [
    14,
    18,
    20,
    22
   ]
  ],
  "canopy": [
   6,
   14,
   6,
   12
  ],
  "roofType": "terrace",
  "cargo": [
   2,
   17
  ],
  "wall": "pack5:080",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": ""
 },
 {
  "biome": "snow",
  "w": 25,
  "d": 30,
  "steps": 11,
  "aisle": 10,
  "title": "Icepine blizzard stair sentinel",
  "mask": [
   [
    3,
    14,
    0,
    29
   ],
   [
    0,
    10,
    7,
    21
   ],
   [
    16,
    24,
    12,
    27
   ],
   [
    0,
    8,
    0,
    5
   ],
   [
    18,
    24,
    2,
    8
   ],
   [
    13,
    17,
    14,
    16
   ],
   [
    13,
    17,
    4,
    6
   ]
  ],
  "canopy": [
   6,
   13,
   6,
   14
  ],
  "roofType": "cross",
  "cargo": [
   2,
   11
  ],
  "wall": "pack1:002",
  "floor": "pack5:081",
  "roof": "pack3:025",
  "post": "pack2:015",
  "trim": "pack5:081",
  "symbol": "biome130:094"
 },
 {
  "biome": "enchanted-forest",
  "w": 27,
  "d": 31,
  "steps": 12,
  "aisle": 11,
  "title": "Moonbark split-root lantern tower",
  "mask": [
   [
    3,
    15,
    0,
    30
   ],
   [
    0,
    9,
    1,
    10
   ],
   [
    17,
    26,
    6,
    18
   ],
   [
    0,
    9,
    21,
    30
   ],
   [
    18,
    26,
    24,
    30
   ],
   [
    14,
    18,
    8,
    10
   ],
   [
    14,
    19,
    25,
    27
   ]
  ],
  "canopy": [
   6,
   14,
   6,
   15
  ],
  "roofType": "saw",
  "cargo": [
   2,
   4
  ],
  "wall": "pack2:015",
  "floor": "pack2:013",
  "roof": "pack3:023",
  "post": "pack2:022",
  "trim": "pack5:079",
  "symbol": "biome130:096"
 },
 {
  "biome": "mountain",
  "w": 28,
  "d": 33,
  "steps": 13,
  "aisle": 11,
  "title": "Rockspur cliff semaphore",
  "mask": [
   [
    3,
    16,
    0,
    32
   ],
   [
    0,
    9,
    15,
    31
   ],
   [
    18,
    27,
    2,
    12
   ],
   [
    21,
    27,
    23,
    32
   ],
   [
    16,
    22,
    13,
    25
   ],
   [
    15,
    19,
    4,
    7
   ],
   [
    15,
    20,
    24,
    26
   ]
  ],
  "canopy": [
   6,
   15,
   6,
   16
  ],
  "roofType": "slope",
  "cargo": [
   2,
   20
  ],
  "wall": "pack1:002",
  "floor": "pack1:007",
  "roof": "pack3:025",
  "post": "pack1:010",
  "trim": "pack5:080",
  "symbol": "biome130:098"
 }
];

function create(p){
 const {w,d,steps,aisle}=p,sx=4,sz=5,deckY=steps,lastZ=sz+steps-1;
 const id=assertSlot('watchtower',p.biome,'small',2);
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
  id,type:'watchtower',biome:p.biome,size:'small',variant:2,status:'theoretical',activated:false,
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
const byBiome=new Map(plans.map(p=>[p.biome,p]));
export function createWatchtowerVariant2FirstBlueprint(type,biome,size,variant=2){
 if(type!=='watchtower'||size!=='small'||variant!==2)
  throw new RangeError('Only specifically authored watchtower small variant 2 belongs to this cohort');
 const p=byBiome.get(biome);if(!p)throw new RangeError('Unwritten biome for watchtower second variation');
 return create(p);
}
export function createWatchtowerVariant2FirstPool(){return plans.map(create);}
