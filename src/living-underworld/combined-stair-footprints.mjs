// True cross-route three-wide stair footprint census, READ-ONLY.
// Individually sound stairways can still block a different stairway's AIR.
// Shared support is okay. Support intersecting another route's clearance
// is NEVER okay, even when each route independently passes its own checks.
import {auditSupportedEntranceStairs} from './walkable-entrance-stairs.mjs';
const integer=Number.isSafeInteger;
const key=(x,y,z)=>x+','+y+','+z;
function footprint(proposal){
 const grade=auditSupportedEntranceStairs(proposal,{maxCells:20000});
 if(!grade.ok)return {ok:false,reason:'INDIVIDUAL_STAIR_UNSAFE',
  failures:grade.failures};
 const support=new Set(),clearance=new Set();let previous=null;
 for(const {a,b} of proposal.segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,
   horizontal=Math.max(Math.abs(dx),Math.abs(dz));
  const alongX=Math.abs(dx)>=Math.abs(dz);
  for(let i=0;i<=horizontal;i++){
   const t=i/horizontal,x=Math.round(a.x+dx*t),
    y=Math.round(a.y+dy*t),z=Math.round(a.z+dz*t);
   if(previous&&previous.x===x&&previous.z===z)continue;
   for(const [ox,oz] of (alongX?[[0,-1],[0,0],[0,1]]:
     [[-1,0],[0,0],[1,0]])){
    support.add(key(x+ox,y-1,z+oz));
    for(let h=0;h<3;h++)clearance.add(key(x+ox,y+h,z+oz));
   }
   previous={x,y,z};
  }
 }
 if(support.size!==grade.supportCells||
    clearance.size!==grade.clearanceCells)
  throw Error('Combined-footprint source diverged from strict stair geometry');
 for(const cell of support)if(clearance.has(cell))
  throw Error('Strict per-route floor/headroom conflict escaped');
 return {ok:true,support,clearance};
}
export function auditCombinedStairFootprints(proposals,{
 maxCells=50000,maxExamples=12
}={}){
 if(!Array.isArray(proposals)||proposals.length<1||proposals.length>8||
  !integer(maxCells)||maxCells<100||maxCells>100000||
  !integer(maxExamples)||maxExamples<1||maxExamples>24)
  throw TypeError('Invalid candidate walking network footprint audit');
 const solid=new Set(),open=new Set(),solidSource=new Map(),openSource=new Map();
 let sharedSupportCells=0,crossRouteBlockedCells=0,rawCells=0;
 const examples=[];
 for(let route=0;route<proposals.length;route++){
  const current=footprint(proposals[route]);
  if(!current.ok)return Object.freeze({ok:false,
   reason:current.reason,routeIndex:route,
   failures:current.failures,worldChanged:false});
  rawCells+=current.support.size+current.clearance.size;
  if(rawCells>maxCells)return Object.freeze({ok:false,
   reason:'COMBINED_FOOTPRINT_BUDGET',routeIndex:route,
   examinedCells:rawCells,maxCells,worldChanged:false});
  for(const cell of current.support){
   if(solid.has(cell))sharedSupportCells++;
   if(open.has(cell)){
    crossRouteBlockedCells++;
    if(examples.length<maxExamples)examples.push(Object.freeze({
     cell,supportRoute:route,clearanceRoute:openSource.get(cell)
    }));
   }
  }
  for(const cell of current.clearance)if(solid.has(cell)){
   crossRouteBlockedCells++;
   if(examples.length<maxExamples)examples.push(Object.freeze({
    cell,supportRoute:solidSource.get(cell),clearanceRoute:route
   }));
  }
  for(const cell of current.support){
   solid.add(cell);if(!solidSource.has(cell))solidSource.set(cell,route);
  }
  for(const cell of current.clearance){
   open.add(cell);if(!openSource.has(cell))openSource.set(cell,route);
  }
 }
 return Object.freeze({ok:crossRouteBlockedCells===0,
  reason:crossRouteBlockedCells?'CROSS_ROUTE_SUPPORT_BLOCKS_CLEARANCE':null,
  routeCount:proposals.length,rawCells,sharedSupportCells,
  distinctSupportCells:solid.size,distinctClearanceCells:open.size,
  crossRouteBlockedCells,examples:Object.freeze(examples),
  allRoutesPreviouslyIndividuallySafe:true,
  existingM7Modified:false,stepsActuallyPlaced:false,
  realPlayerWalkingVerified:false,infiniteWorldConnectivityVerified:false});
}
