// Exhaustive bounded frontier of the actual original d48 room's component.
// No spatial search envelope, no invented bridges, no generator changes.
// A closed result requires inspecting every legal cardinal +/-1 floor
// neighbor of every reachable owner-authenticated standing position.
import {UPPER_SITES,upperCaveCells} from '../cave-approaches/upper-network.mjs';
import {BLOCK,worldKey} from '../voxel.mjs';
import {deepCaveCells,DEEP_CAVE_ORIGIN} from '../deep-cave-network.mjs';
import {deepVaultCells} from '../deep-vault-galleries.mjs';
import {descentCells,DESCENT_ORIGIN} from '../underground-switchback-descent.mjs';
import {originalM7UpperOwnedPhysicalFloor} from './enchanted-original-upper-owner-walk-audit.mjs';
const names=['upper24-windcut','upper24-hollowbend'];
const tuple=p=>[p.x,p.surface,p.z],key=p=>tuple(p).join(',');
export function auditOriginalD48Component(world,name){
 const site=UPPER_SITES[names.indexOf(name)];
 if(!site)throw Error('Unknown original upper site');
 const reservation=descentCells(DESCENT_ORIGIN);
 const protectedCells=new Set([...deepCaveCells(DEEP_CAVE_ORIGIN).keys(),
  ...deepVaultCells(world.seed).keys(),...reservation.keys()]);
 const owner=upperCaveCells({seed:world.seed,site,descentReservation:reservation,
  protectedCells,editedCells:new Set(),legacyCells:()=>null});
 if(!owner.ok)return {ok:false,reason:owner.reason};
 const center=[site.x+48,-16,site.z+14];
 const first=originalM7UpperOwnedPhysicalFloor(world,name,...center);
 if(!first)return {ok:false,reason:'original-room-center-unavailable',center};
 const queue=[first],seen=new Set([key(first)]),inspected=new Map();
 let edges=0;
 for(let i=0;i<queue.length;i++){
  const p=queue[i];
  if(queue.length>2048)throw Error('Original component budget exceeded; no closure claim');
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const dy of [-1,0,1]){
   const x=p.x+dx,y=p.surface+dy,z=p.z+dz,k=[x,y,z].join(',');
   edges++;
   if(!inspected.has(k)){
    const material=owner.cells.get(worldKey(x,y,z));
    const head=[1,2,3].map(h=>owner.cells.get(worldKey(x,y+h,z)));
    const cap=originalM7UpperOwnedPhysicalFloor(world,name,x,y,z);
    inspected.set(k,{cap,ownerSupport:material!==undefined&&material!==BLOCK.AIR,
     ownerHeadAIR:head.every(v=>v===BLOCK.AIR)});
   }
   const n=inspected.get(k).cap;
   if(n&&!seen.has(key(n))&&Math.abs(n.feet-p.feet)<=1.00001){
    seen.add(key(n));queue.push(n);
   }
  }
 }
 const outside=queue.filter(p=>(p.x-center[0])**2+(p.z-center[2])**2>36||p.surface!==center[1]);
 const boundary=[...inspected].filter(([k])=>!seen.has(k)).map(([k,v])=>({at:k,...v}));
 const noSupport=boundary.filter(v=>!v.ownerSupport).length;
 const missingHead=boundary.filter(v=>v.ownerSupport&&!v.ownerHeadAIR).length;
 const physicalVeto=boundary.filter(v=>v.ownerSupport&&v.ownerHeadAIR&&!v.cap).length;
 const admittedBoundary=boundary.filter(v=>v.cap).length;
 const closed=outside.length===0&&admittedBoundary===0;
 return {ok:true,name,center,componentNodes:queue.length,edges,
  inspectedNeighborPositions:inspected.size,boundaryPositions:boundary.length,
  noOwnerSupport:noSupport,ownerHeadMissing:missingHead,physicalVeto,
  admittedBoundary,outsideOriginalRoom:outside.length,
  closedUnderOriginalCardinalStepRule:closed,
  completeNetworkAccepted:false};
}
