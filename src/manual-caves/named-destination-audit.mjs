// Cave Roadmap #240 read-only bounded pathfinder for historic named :36
// chambers. Requires real physical 4-high AIR/solid support and source anchor;
// never creates cave voxels, edits saves, returns a synthetic teleport path,
// or claims published iPhone navigation.
import {BLOCK,collides} from '../voxel.mjs';
import {descentRoute,DESCENT_ORIGIN} from '../underground-switchback-descent.mjs';
const SUPPORT=new Set([BLOCK.DEEPSTONE,BLOCK.STONE]);
export const HISTORIC_NAMED_TARGETS=Object.freeze([
 Object.freeze({name:'Stepped Echo Hall',depth:-105,d:36,t:0,floor:-107}),
 Object.freeze({name:'Crescent Refuge',depth:-195,d:31,t:0,floor:-195}),
 Object.freeze({name:'Winding Erosion Vault',depth:-60,d:30,t:5,floor:-60}),
 Object.freeze({name:'Transverse Gallery',depth:-150,d:35,t:-7,floor:-150}),
 Object.freeze({name:'Bifurcated Mineral Gallery',depth:-120,d:38,t:0,floor:-120}),
 Object.freeze({name:'Fault Cathedral',depth:-170,d:29,t:-9,floor:-170}),
 Object.freeze({name:'Rift Terraces',depth:-90,d:33,t:10,floor:-92}),
 Object.freeze({name:'Erosion Labyrinth',depth:-45,d:41,t:-9,floor:-45}),
 Object.freeze({name:'Split-Fault Grotto',depth:-135,d:59,t:11,floor:-135}),
 Object.freeze({name:'Deep Fault Bypass',depth:-185,d:50,t:0,floor:-185}),
 Object.freeze({name:'Braided Ravine',depth:-70,d:56,t:0,floor:-70}),
 Object.freeze({name:'Forked Basalt Sanctuary',depth:-160,d:51,t:2,floor:-160}),
 Object.freeze({name:'Stepped Confluence',depth:-110,d:59,t:0,floor:-112}),
 Object.freeze({name:'Windcut Antechamber',depth:-20,d:51,t:-2,floor:-20}),
 Object.freeze({name:'Shattered Shelf',depth:-145,d:59,t:0,floor:-147}),
 Object.freeze({name:'Bedrock Labyrinth',depth:-200,d:79,t:0,floor:-200}),
 Object.freeze({name:'Broken-Column Grotto',depth:-35,d:57,t:2,floor:-35}),
 Object.freeze({name:'Ribbed Fault Canyon',depth:-150,d:67,t:2,floor:-153}),
 Object.freeze({name:'Vaulted Stone Fan',depth:-125,d:56,t:8,floor:-125}),
 Object.freeze({name:'Folded Fault Amphitheater',depth:-190,d:63,t:3,floor:-190}),
 Object.freeze({name:'Bedrock Whisper Gallery',depth:-202,d:43,t:-17,floor:-202})
]);
const k=(x,f,z)=>x+','+f+','+z;
function orient(depth){
 const anchor=descentRoute().find(p=>p.floor===depth);
 if(!anchor)throw Error('Missing original preserved descent anchor at '+depth);
 const lx=anchor.x-DESCENT_ORIGIN.x,lz=anchor.z-DESCENT_ORIGIN.z;
 const out=lz===0?[0,-1]:lz===28?[0,1]:lx===0?[-1,0]:[1,0];
 const across=[out[1],-out[0]];
 return {anchor,out,across,
  at(d,t){return {x:anchor.x+d*out[0]+t*across[0],
     z:anchor.z+d*out[1]+t*across[1]}},
  toLocal(x,z){const dx=x-anchor.x,dz=z-anchor.z;
    return {d:dx*out[0]+dz*out[1],t:dx*across[0]+dz*across[1]};}
 };
}
export function findNamedCavePlayerRoute(world,feature,{maxVisits=100000}={}){
 if(!world||typeof world.get!=='function'||!HISTORIC_NAMED_TARGETS.includes(feature))
  return Object.freeze({ok:false,reason:'UNAUTHENTIC_WORLD_OR_FEATURE'});
 const {anchor,at,toLocal}=orient(feature.depth),targetXY=at(feature.d,feature.t);
 const target={x:targetXY.x,z:targetXY.z,floor:feature.floor};
 const start={x:anchor.x,z:anchor.z,floor:feature.depth};
 const isOpen=(p)=>{
  const local=toLocal(p.x,p.z);
  if(local.d< -3||local.d>100||Math.abs(local.t)>48||
     p.floor<feature.depth-5||p.floor>feature.depth+2)return false;
  if(!SUPPORT.has(world.get(p.x,p.floor,p.z)))return false;
  for(let h=1;h<=4;h++)if(world.get(p.x,p.floor+h,p.z)!==BLOCK.AIR)return false;
  return !collides(world,p.x+.5,p.floor+1,p.z+.5);
 };
 if(!isOpen(start))return Object.freeze({ok:false,name:feature.name,
  reason:'ORIGINAL_SPIRAL_SOURCE_ANCHOR_BLOCKED',start});
 if(!isOpen(target))return Object.freeze({ok:false,name:feature.name,
  reason:'NAMED_SOURCE_CHAMBER_TARGET_NOT_STANDABLE',target});
 const q=[start],came=new Map([[k(start.x,start.floor,start.z),null]]),parents=new Map();
 let cursor=0,found=false;
 while(cursor<q.length&&cursor<maxVisits){
  const p=q[cursor++];
  const current=k(p.x,p.floor,p.z);
  if(p.x===target.x&&p.z===target.z&&p.floor===target.floor){found=true;break;}
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])
   for(const deltaY of [0,-1,1]){
    const n={x:p.x+dx,z:p.z+dz,floor:p.floor+deltaY};
    const id=k(n.x,n.floor,n.z);
    if(came.has(id)||!isOpen(n))continue;
    came.set(id,current);parents.set(id,n);
    q.push(n);
   }
 }
 if(!found)return Object.freeze({ok:false,name:feature.name,
  reason:cursor>=maxVisits?'BOUNDED_SOURCE_ROUTE_SEARCH_LIMIT':'NO_SUPPORTED_WALK_TO_NAMED_CHAMBER',
  searched:cursor,target});
 const route=[],root=k(start.x,start.floor,start.z);
 for(let id=k(target.x,target.floor,target.z);id!==null;id=came.get(id)){
  if(id===root)route.push(start);
  else route.push(parents.get(id));
 }
 route.reverse();
 for(let i=1;i<route.length;i++){
  const a=route[i-1],b=route[i];
  if(Math.abs(a.x-b.x)+Math.abs(a.z-b.z)!==1||Math.abs(a.floor-b.floor)>1)
   throw Error('Pathfinder emitted disconnected physical source path');
 }
 return Object.freeze({ok:true,name:feature.name,depth:feature.depth,
   sourceAnchor:start,target,route:Object.freeze(route),searched:cursor,
   sourceOnly:false,physicallySupported:true,actualControllerWalked:false,
   physicalIPhone:false});
}
