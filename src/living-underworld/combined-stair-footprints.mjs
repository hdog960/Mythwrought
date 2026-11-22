// True cross-route three-wide stair footprint census, READ-ONLY.
// Individually sound stairways can still block a different stairway's AIR.
// Shared support is okay. Support intersecting another route's clearance
// is NEVER okay, even when each route independently passes its own checks.
import {auditSupportedEntranceStairs} from './walkable-entrance-stairs.mjs';
import {planUnderworldRegion} from './worldwide-network.mjs';
import {isCandidateGeologyMaterial} from './protected-entrance-envelope.mjs';
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

// A connected stair network must also preserve future pedestrian clearance
// through all 16 original horizontal two-capsule galleries. This does not
// validate the original M7 world's authored voxels or player physics.
const MAIN_GALLERY_PAIRS=Object.freeze([
 0,2,4,6,8,10,12,14,17,19,21,23,26,28,30,32
]);
export function auditProposedSupportsAgainstMainGalleries(
 seed,rx,rz,proposals,{maxCells=150000,maxExamples=12}={}
){
 if(!integer(seed)||seed!==(seed|0)||
  ![rx,rz].every(integer)||
  !Array.isArray(proposals)||proposals.length<1||proposals.length>8||
  !integer(maxCells)||maxCells<1000||maxCells>250000||
  !integer(maxExamples)||maxExamples<1||maxExamples>30)
  throw TypeError('Invalid main gallery pedestrian clearance audit');
 const plan=planUnderworldRegion(seed,rx,rz);
 const horizontal=new Map(),horizontalSupport=new Map();
 let rawCells=0;
 for(const index of MAIN_GALLERY_PAIRS){
  const gallery=footprint({ok:true,segments:[
   plan.capsules[index],plan.capsules[index+1]
  ]});
  if(!gallery.ok)return Object.freeze({
   ok:false,reason:'HORIZONTAL_GALLERY_WALKING_GRADE_UNSAFE',
   galleryIndex:index,worldChanged:false
  });
  rawCells+=gallery.support.size+gallery.clearance.size;
  if(rawCells>maxCells)return Object.freeze({
   ok:false,reason:'GALLERY_FOOTPRINT_BUDGET',
   rawCells,maxCells,worldChanged:false
  });
  for(const cell of gallery.clearance)
   if(!horizontal.has(cell))horizontal.set(cell,index);
  for(const cell of gallery.support)
   if(!horizontalSupport.has(cell))horizontalSupport.set(cell,index);
 }
 const routes=[],examples=[];
 let blockedCells=0;
 for(let route=0;route<proposals.length;route++){
  const current=footprint(proposals[route]);
  if(!current.ok)return Object.freeze({
   ok:false,reason:current.reason,routeIndex:route,worldChanged:false
  });
  rawCells+=current.support.size+current.clearance.size;
  if(rawCells>maxCells)return Object.freeze({
   ok:false,reason:'GALLERY_FOOTPRINT_BUDGET',
   rawCells,maxCells,worldChanged:false
  });
  let affected=0;
  for(const cell of current.support){
   const crossed=horizontal.get(cell);
   if(crossed===undefined)continue;
   affected++;blockedCells++;
   if(examples.length<maxExamples)examples.push(Object.freeze({
    cell,routeIndex:route,horizontalPairIndex:crossed,
    type:'PROPOSED_SUPPORT_IN_GALLERY_HEADROOM'
   }));
  }
  for(const cell of current.clearance){
   const crossed=horizontalSupport.get(cell);
   if(crossed===undefined)continue;
   affected++;blockedCells++;
   if(examples.length<maxExamples)examples.push(Object.freeze({
    cell,routeIndex:route,horizontalPairIndex:crossed,
    type:'GALLERY_SUPPORT_IN_PROPOSED_HEADROOM'
   }));
  }
  routes.push(Object.freeze({routeIndex:route,blockingCells:affected}));
 }
 return Object.freeze({
  ok:blockedCells===0,
  reason:blockedCells?'PROPOSED_SUPPORT_BLOCKS_HORIZONTAL_GALLERY':null,
  seed,rx,rz,
  pedestrianHorizontalPairsChecked:MAIN_GALLERY_PAIRS.length,
  distinctGalleryClearanceCells:horizontal.size,
  distinctGallerySupportCells:horizontalSupport.size,
  proposedStairsAudited:proposals.length,blockedCells,rawCells,
  routes:Object.freeze(routes),examples:Object.freeze(examples),
  exactThreeWideThreeHighGradeSource:true,
  oldM7SourceIdentityNotVerified:true,
  physicallyTraversableInOriginalGame:false,
  newTerrainActuallyCarved:false,
  worldChanged:false
 });
}

// Reusable, bounded and read-only MAIN gallery index. The same exact strict
// footprint() routine powers the legacy full audit and this candidate-search
// preflight, so neither accepts a support placed in gallery headroom.
// Only deterministic detached planned geometry is cached, never old M7 voxels.
const INDEX_CACHE=new Map(),MAX_INDEX_CACHE=8;
export function compileMainGalleryPedestrianClearance(seed,rx,rz,{
 maxCells=90000,maxExamples=12
}={}){
 if(!integer(seed)||seed!==(seed|0)||![rx,rz].every(integer)||
  !integer(maxCells)||maxCells<1000||maxCells>250000||
  !integer(maxExamples)||maxExamples<1||maxExamples>30)
  throw TypeError('Invalid bounded horizontal gallery index');
 const cacheKey=seed+':'+rx+':'+rz;
 const cached=INDEX_CACHE.get(cacheKey);
 if(cached&&cached.rawCells<=maxCells&&cached.maxExamples>=maxExamples)
  return cached;
 const region=planUnderworldRegion(seed,rx,rz);
 const horizontal=new Map(),horizontalSupport=new Map();let rawCells=0;
 for(const index of MAIN_GALLERY_PAIRS){
  const q=footprint({ok:true,segments:[
   region.capsules[index],region.capsules[index+1]
  ]});
  if(!q.ok)return Object.freeze({ok:false,
   reason:'HORIZONTAL_GALLERY_WALKING_GRADE_UNSAFE',
   galleryIndex:index,noWorldEdits:true});
  rawCells+=q.support.size+q.clearance.size;
  if(rawCells>maxCells)return Object.freeze({ok:false,
   reason:'GALLERY_FOOTPRINT_BUDGET',rawCells,maxCells,
   noWorldEdits:true});
  for(const k of q.clearance)if(!horizontal.has(k))
   horizontal.set(k,index);
  for(const k of q.support)if(!horizontalSupport.has(k))
   horizontalSupport.set(k,index);
 }
 const index=Object.freeze({
  ok:true,seed,rx,rz,rawCells,maxExamples,
  pedestrianHorizontalPairsChecked:MAIN_GALLERY_PAIRS.length,
  distinctGalleryClearanceCells:horizontal.size,
  distinctGallerySupportCells:horizontalSupport.size,
  // Exact same original stair raster as inspect(proposal), but allow a
  // whole planar city floor to be checked incrementally without allocating
  // a 150k-cell duplicate network footprint.
  inspectCell(x,y,z,kind){
   if(![x,y,z].every(integer)||!['support','clearance'].includes(kind))
    throw TypeError('Invalid planned city pad voxel');
   const crossed=(kind==='support'?horizontal:horizontalSupport).get(key(x,y,z));
   return crossed===undefined?null:Object.freeze({
    horizontalPairIndex:crossed,kind
   });
  },
  inspect(proposal){
   const q=footprint(proposal);
   if(!q.ok)return Object.freeze({ok:false,
    reason:q.reason,failures:q.failures??[],worldChanged:false});
   const examples=[];let blockedCells=0;
   for(const cell of q.support){
    const horizontalPairIndex=horizontal.get(cell);
    if(horizontalPairIndex===undefined)continue;
    blockedCells++;
    if(examples.length<maxExamples)examples.push(Object.freeze({
     cell,horizontalPairIndex,
     type:'PROPOSED_SUPPORT_IN_GALLERY_HEADROOM'
    }));
   }
   for(const cell of q.clearance){
    const horizontalPairIndex=horizontalSupport.get(cell);
    if(horizontalPairIndex===undefined)continue;
    blockedCells++;
    if(examples.length<maxExamples)examples.push(Object.freeze({
     cell,horizontalPairIndex,
     type:'GALLERY_SUPPORT_IN_PROPOSED_HEADROOM'
    }));
   }
   return Object.freeze({ok:blockedCells===0,
    reason:blockedCells?'PROPOSED_SUPPORT_BLOCKS_HORIZONTAL_GALLERY':null,
    blockedCells,supportCells:q.support.size,
    examples:Object.freeze(examples),
    worldChanged:false,sourceOnly:true,
    oldM7GeologyUnverified:true,
    nativePlayerWalkingUnverified:true});
  }
 });
 INDEX_CACHE.set(cacheKey,index);
 if(INDEX_CACHE.size>MAX_INDEX_CACHE)
  INDEX_CACHE.delete(INDEX_CACHE.keys().next().value);
 return index;
}

 
// Strict READ-ONLY check of what exists in the ORIGINAL M7 voxels TODAY.
// A geometric candidate may require new excavation/deck support; unless the
// old world already has those AIR and floor blocks, it is NOT as-built walking.
export function auditOriginalMainGalleryVoxelReadiness(seed,rx,rz,{
 materialAt,editedAt=()=>false,maxCells=100000,maxExamples=8
}={}){
 if(!integer(seed)||seed!==(seed|0)||![rx,rz].every(integer)||
  typeof materialAt!=='function'||typeof editedAt!=='function'||
  !integer(maxCells)||maxCells<100||maxCells>200000||
  !integer(maxExamples)||maxExamples<1||maxExamples>24)
  throw TypeError('Invalid original M7 horizontal gallery voxel readiness');
 const region=planUnderworldRegion(seed,rx,rz);
 let checked=0,blockedHeadroom=0,unsupportedDeck=0,editedCells=0;
 const examples=[],galleries=[];
 for(const index of MAIN_GALLERY_PAIRS){
  const f=footprint({ok:true,segments:[
   region.capsules[index],region.capsules[index+1]
  ]});
  if(!f.ok)return Object.freeze({ok:false,
   reason:'PLANNED_GALLERY_GRADE_UNSAFE',galleryIndex:index,
   failures:f.failures??[],sampledCells:checked,worldChanged:false});
  let blocked=0,missing=0,edits=0;
  for(const [kind,set] of [['support',f.support],['clearance',f.clearance]]){
   for(const cell of set){
    if(++checked>maxCells)return Object.freeze({ok:false,
     reason:'ORIGINAL_M7_GALLERY_VOXEL_BUDGET',galleryIndex:index,
     sampledCells:checked,maxCells,worldChanged:false});
    const [x,y,z]=cell.split(',').map(Number);
    const block=materialAt(x,y,z);
    if(!integer(block)||block<0)return Object.freeze({ok:false,
     reason:'INVALID_ORIGINAL_M7_MATERIAL',galleryIndex:index,
     cell,sampledCells:checked,worldChanged:false});
    if(editedAt(x,y,z)){editedCells++;edits++;}
    // AIR is cuttable clearance but is NEVER an existing walkable deck.
    if(kind==='support'&&(block===0||!isCandidateGeologyMaterial(block))){
     missing++;unsupportedDeck++;
     if(examples.length<maxExamples)examples.push(Object.freeze({
      galleryIndex:index,cell,kind,reason:'UNSUPPORTED_EXISTING_DECK',material:block
     }));
    }
    if(kind==='clearance'&&block!==0){
     blocked++;blockedHeadroom++;
     if(examples.length<maxExamples)examples.push(Object.freeze({
      galleryIndex:index,cell,kind,reason:'BLOCKED_EXISTING_HEADROOM',material:block
     }));
    }
   }
  }
  galleries.push(Object.freeze({galleryIndex:index,
   checkedSupport:f.support.size,checkedClearance:f.clearance.size,
   existingBlockedHeadroom:blocked,existingUnsupportedDeck:missing,
   existingEditedCells:edits,
   asBuiltDeckAndAirReady:blocked===0&&missing===0&&edits===0}));
 }
 return Object.freeze({ok:blockedHeadroom===0&&unsupportedDeck===0&&editedCells===0,
  seed,rx,rz,reason:blockedHeadroom||unsupportedDeck||editedCells?
   'PLANNED_GALLERIES_NOT_PRESENT_IN_ORIGINAL_M7':null,
  galleriesChecked:MAIN_GALLERY_PAIRS.length,sampledCells:checked,
  blockedHeadroom,unsupportedDeck,editedCells,
  galleries:Object.freeze(galleries),examples:Object.freeze(examples),
  actualThreeWideThreeHighVoxelReadinessChecked:true,
  actualPlayerCollisionAndMovementNotTested:true,
  environmentWorldEdited:false,worldChanged:false,
  deviceGpuAndPwaUnverified:true});
}

// Standalone opt-in source-agnostic floor/headroom index for up to eight
// selected walkable stair proposals. This is geometry only: callers must
// separately authenticate original M7 ownership of every proposed voxel.
// No mutable world instances or voxel answers are cached.
export function compileSelectedStairPedestrianClearance(proposals,{
 maxCells=50000,maxExamples=12
}={}){
 if(!Array.isArray(proposals)||proposals.length<1||proposals.length>8||
  !integer(maxCells)||maxCells<100||maxCells>100000||
  !integer(maxExamples)||maxExamples<1||maxExamples>24)
  throw TypeError('Invalid bounded selected-stair clearance index');
 const combined=auditCombinedStairFootprints(proposals,{maxCells,maxExamples});
 if(!combined.ok)return Object.freeze({ok:false,reason:combined.reason,
  crossRouteBlockedCells:combined.crossRouteBlockedCells??null,
  examinedCells:combined.rawCells??null,worldChanged:false});
 const supports=new Map(),air=new Map();
 let rawCells=0;
 for(let i=0;i<proposals.length;i++){
  const q=footprint(proposals[i]);
  if(!q.ok)return Object.freeze({ok:false,reason:q.reason,
   routeIndex:i,worldChanged:false});
  rawCells+=q.support.size+q.clearance.size;
  if(rawCells>maxCells)return Object.freeze({ok:false,
   reason:'SELECTED_STAIR_FOOTPRINT_BUDGET',rawCells,
   maxCells,worldChanged:false});
  for(const cell of q.support)if(!supports.has(cell))supports.set(cell,i);
  for(const cell of q.clearance)if(!air.has(cell))air.set(cell,i);
 }
 return Object.freeze({ok:true,routeCount:proposals.length,
  rawCells,distinctSupportCells:supports.size,distinctAirCells:air.size,
  inspectCell(x,y,z,kind){
   if(![x,y,z].every(integer)||!['support','clearance'].includes(kind))
    throw TypeError('Invalid selected-stair comparison cell');
   const routeIndex=(kind==='support'?air:supports).get(key(x,y,z));
   return routeIndex===undefined?null:Object.freeze({routeIndex,kind});
  },
  originalM7SourceOwnershipNotVerified:true,
  actualPlayerWalkingNotVerified:true,
  worldChanged:false});
}
