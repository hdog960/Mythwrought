// Mythwrought #240 C3: actual supported stone + AIR connectors between
// historical :24 deep spiral and archived :36 deep-vault gallery floors.
// No source producer modification, no cave removal and no runtime registration.
// Fail closed on any authored-cell conflict; never choose a winning AIR/stone.
import {BLOCK,worldKey,collides} from '../voxel.mjs';
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from '../depth.mjs';
import {deepCaveRoute} from '../deep-cave-network.mjs';
import {VAULT_JUNCTION,VAULT_LEVELS} from '../deep-vault-galleries.mjs';
export const CAVE_BRIDGE_MAX_BFS=35000;
export const CAVE_BRIDGE_MAX_SOURCE_CELLS=600000;
const directions=[[1,0],[-1,0],[0,1],[0,-1]];
const xy=(x,z)=>x+','+z;
const key=(x,y,z)=>worldKey(x,y,z);
const floorIds=[BLOCK.DEEPSTONE,BLOCK.STONE];
function routeForBand(source,previous,floor,origin,target){
 const targetKey=xy(target.x,target.z),startKey=xy(origin.x,origin.z);
 const xmin=Math.min(origin.x,target.x)-35,xmax=Math.max(origin.x,target.x)+35;
 const zmin=Math.min(origin.z,target.z)-35,zmax=Math.max(origin.z,target.z)+35;
 const valid=(x,z)=>{
  if(x<xmin||x>xmax||z<zmin||z>zmax)return false;
  for(let h=0;h<=4;h++){
   const id=h?BLOCK.AIR:BLOCK.DEEPSTONE,k=key(x,floor+h,z);
   const old=source.get(k)??previous.get(k);
   if(old!==undefined&&old!==id)return false;
  }
  return true;
 };
 if(!valid(origin.x,origin.z))
  return {ok:false,reason:'SOURCE_ANCHOR_IS_BLOCKED',floor,origin};
 if(!valid(target.x,target.z))
  return {ok:false,reason:'VAULT_JUNCTION_IS_BLOCKED',floor,target};
 const q=[[origin.x,origin.z]],found=new Map([[startKey,null]]);
 let index=0;
 while(index<q.length&&index<CAVE_BRIDGE_MAX_BFS){
  const [x,z]=q[index++];
  if(xy(x,z)===targetKey)break;
  for(const [dx,dz] of directions){
   const nx=x+dx,nz=z+dz,k=xy(nx,nz);
   if(found.has(k)||!valid(nx,nz))continue;
   found.set(k,xy(x,z));q.push([nx,nz]);
  }
 }
 if(!found.has(targetKey))
  return {ok:false,reason:'NO_SAFE_PHYSICAL_VAULT_CONNECTION',floor,
    searchCells:index,origin,target};
 const route=[];
 for(let k=targetKey;k!==null;k=found.get(k)){
  const [x,z]=k.split(',').map(Number);
  route.push(Object.freeze({x,z,floor,feet:floor+1}));
 }
 route.reverse();
 const cells=new Map();
 const put=(x,z)=>{
  for(let h=0;h<=4;h++){
   const k=key(x,floor+h,z),id=h?BLOCK.AIR:BLOCK.DEEPSTONE;
   if(source.has(k)||previous.has(k))continue;
   const before=cells.get(k);
   if(before!==undefined&&before!==id)throw Error('Internal bridge floor/head conflict');
   cells.set(k,id);
  }
 };
 for(const p of route)put(p.x,p.z);
 // Three-wide shoulders wherever they do not interfere with any previous
 // producer. The centerline alone remains a full player-body-width passage.
 let widened=0;
 for(let i=1;i<route.length-1;i++){
  const p=route[i],before=route[i-1],after=route[i+1];
  const dx=after.x-before.x,dz=after.z-before.z;
  const across=dx!==0?[0,1]:[1,0];
  const a=[p.x+across[0],p.z+across[1]],
    b=[p.x-across[0],p.z-across[1]];
  if(valid(...a)&&valid(...b)){
   put(...a);put(...b);widened++;
  }
 }
 return {ok:true,floor,origin,target,route:Object.freeze(route),
   cells,widened,searchCells:index};
}
export function planDeepVaultConnections({sourceCells,seed=179}={}){
 if(!(sourceCells instanceof Map)||sourceCells.size>CAVE_BRIDGE_MAX_SOURCE_CELLS||
    !Number.isInteger(seed)||seed!==(seed|0))
  return Object.freeze({ok:false,reason:'INVALID_AUTHORED_CAVE_SOURCE'});
 const deepRoute=deepCaveRoute(),joint={x:VAULT_JUNCTION.x,z:VAULT_JUNCTION.z};
 const bridges=[],cells=new Map(),failures=[];
 for(const floor of VAULT_LEVELS){
  if(floor>=LEGACY_WORLD_MIN_Y||floor<WORLD_MIN_Y+1){
   failures.push({floor,reason:'UNSAFE_DEPTH'});continue;
  }
  const origin=deepRoute.find(p=>p.floor===floor);
  if(!origin){failures.push({floor,reason:'MISSING_REAL_SPIRAL_ANCHOR'});continue;}
  const segment=routeForBand(sourceCells,cells,floor,origin,joint);
  if(!segment.ok){failures.push(segment);continue;}
  for(const [k,id] of segment.cells){
   if(sourceCells.has(k)&&sourceCells.get(k)!==id)
    throw Error('Connector would overwrite historical AIR or stone');
   if(cells.has(k)&&cells.get(k)!==id)
    throw Error('Connector sibling conflict');
   cells.set(k,id);
  }
  bridges.push(Object.freeze({floor,route:segment.route,sourceAnchor:origin,
    junction:Object.freeze(joint),steps:segment.route.length,
    widened:segment.widened,searchCells:segment.searchCells}));
 }
 return Object.freeze({ok:bridges.length===4&&failures.length===0,
  profile:'new-cave-world-only',sourceConnected:bridges.length===4&&failures.length===0,
  runtimeEnabled:false,worldEditsModified:false,
  bridges:Object.freeze(bridges),failures:Object.freeze(failures),cells});
}
export function auditBridgePlayerClearance(world,plan){
 if(!plan?.ok||!world||typeof world.get!=='function')
  return Object.freeze({ok:false,reason:'NO_SAFE_BRIDGE_PLAN'});
 const problems=[];
 for(const bridge of plan.bridges){
  for(let i=0;i<bridge.route.length;i++){
   const p=bridge.route[i],prev=bridge.route[i-1];
   if(!floorIds.includes(world.get(p.x,p.floor,p.z)))
    problems.push({floor:bridge.floor,step:i,reason:'UNSUPPORTED'});
   for(let h=1;h<=4;h++)
    if(world.get(p.x,p.floor+h,p.z)!==BLOCK.AIR)
      problems.push({floor:bridge.floor,step:i,reason:'BLOCKED_HEAD',height:h});
   if(collides(world,p.x+.5,p.feet,p.z+.5))
    problems.push({floor:bridge.floor,step:i,reason:'PLAYER_BODY_COLLISION'});
   if(prev&&Math.abs(prev.x-p.x)+Math.abs(prev.z-p.z)!==1)
    problems.push({floor:bridge.floor,step:i,reason:'DISCONNECTED'});
  }
 }
 return Object.freeze({ok:problems.length===0,
  sampleCount:plan.bridges.reduce((n,b)=>n+b.route.length,0),
  problems:Object.freeze(problems.slice(0,100))});
}
