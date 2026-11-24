// Completion phase 40: real physical cuts in a NEW disposable M7 world.
// Never pass an existing world or persistent storage. No production imports,
// generation-profile registration, settlement placement or save writes.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../manual-biomes/profile-world.mjs';
import {VoxelWorld,BLOCK,baseBlock,collides} from '../voxel.mjs';
import {planUnderworldRegion} from './worldwide-network.mjs';
import {compileGalleryConstructionFootprint} from './combined-stair-footprints.mjs';
import {auditProtectedSubsurfaceStairs} from './protected-subsurface-stairs.mjs';
import {traverseRetainedDescent} from './retained-switchback-descent-route.mjs';

export const GALLERY_PAIRS=Object.freeze([0,2,4,6,8,10,12,14,17,19,21,23,26,28,30,32]);
export const GALLERY_CONSTRUCTION_LIMITS=Object.freeze({
 ownedCarves:10000,faceGrowth:3500,perChunkFaceGrowth:1200,
 originalNaturalReads:40000
});
const freeze=Object.freeze;
const key=(x,y,z)=>x+','+y+','+z;
const xyz=k=>k.split(',').map(Number);
const owner=(x,y,z)=>key(Math.floor(x/16)*16,Math.floor(y/16)*16,Math.floor(z/16)*16);
const neighbors=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
// Exact changed-face arithmetic for the binary full-cube metric used by
// chunk-carve-projection. Each retained neighbor owns its newly exposed face;
// each removed solid loses its prior faces against already-existing AIR.
// Unchanged faces cancel. Includes neighboring chunk owners even when the
// neighbor chunk contains no excavation. Not a full halo scan or GPU proof.
export function measureGalleryCutUnion(cuts,naturalAt){
 const deltas=new Map(),ownedCuts=new Map();
 const add=(m,k,n)=>m.set(k,(m.get(k)??0)+n);
 for(const k of cuts){
  const [x,y,z]=xyz(k);
  if(naturalAt(x,y,z)===BLOCK.AIR)throw Error('CUT_UNION_CONTAINS_OLD_AIR');
  const own=owner(x,y,z);add(ownedCuts,own,1);
  for(const [dx,dy,dz] of neighbors){
   const a=x+dx,b=y+dy,c=z+dz;
   if(cuts.has(key(a,b,c)))continue;
   if(naturalAt(a,b,c)===BLOCK.AIR)add(deltas,own,-1);
   else add(deltas,owner(a,b,c),1);
  }
 }
 const rows=[...new Set([...ownedCuts.keys(),...deltas.keys()])].sort().map(k=>
  freeze({origin:freeze(xyz(k)),ownedCarves:ownedCuts.get(k)??0,
   exposedFaceDelta:deltas.get(k)??0,faceGrowth:Math.max(0,deltas.get(k)??0)}));
 const faceGrowth=rows.reduce((n,r)=>n+r.faceGrowth,0);
 const maxChunkFaces=Math.max(0,...rows.map(r=>r.faceGrowth));
 const ok=cuts.size<=GALLERY_CONSTRUCTION_LIMITS.ownedCarves&&
  faceGrowth<=GALLERY_CONSTRUCTION_LIMITS.faceGrowth&&
  maxChunkFaces<=GALLERY_CONSTRUCTION_LIMITS.perChunkFaceGrowth;
 return freeze({ok,ownedCarves:cuts.size,faceGrowth,maxChunkFaces,
  affectedChunks:rows.length,rows:freeze(rows),
  exactBinaryChangedFaceAccounting:true,fullHaloCensusPerformed:false,
  gpuVerified:false});
}
function stations(segments){
 const route=[];
 for(const {a,b} of segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const n=Math.max(Math.abs(dx),Math.abs(dz));
  for(let i=0;i<=n;i++){
   const p={x:Math.round(a.x+dx*i/n),feet:Math.round(a.y+dy*i/n),z:Math.round(a.z+dz*i/n)};
   const last=route.at(-1);
   if(last&&last.x===p.x&&last.z===p.z)continue;
   route.push(freeze(p));
  }
 }
 return freeze(route);
}
// One immutable cohort request, one cumulative union, one actual world.
// Calling again creates a DIFFERENT disposable world; results from separate
// calls are NOT additive approval for a larger construction.
export function constructPhysicalGalleryCohort(seed,regions){
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||!Array.isArray(regions)||
    !regions.length||regions.length>5||
    regions.some(r=>!r||![r.rx,r.rz].every(Number.isSafeInteger)))
  throw TypeError('Explicit bounded isolated region cohort required');
 if(new Set(regions.map(r=>r.rx+','+r.rz)).size!==regions.length)
  throw TypeError('Duplicate gallery region');
 const profile=fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR);
 const world=new FourRegionWorld(seed,profile),legacy=new VoxelWorld(seed);
 if(world.edits.size||world.rotations.size)throw Error('FRESH_WORLD_REQUIRED');
 const initialSave=JSON.stringify(world.save());
 const memo=new Map();
 const counts={naturalAt:0,authoredAt:0,editedAt:0,protectedAt:0};
 const source=freeze({
  naturalAt(x,y,z){
   const k=key(x,y,z);
   if(!memo.has(k)){
    if(memo.size>=GALLERY_CONSTRUCTION_LIMITS.originalNaturalReads)
     throw Error('GALLERY_ORIGINAL_READ_BUDGET');
    memo.set(k,world.naturalAndLandmarkBlock(x,y,z));counts.naturalAt++;
   }
   return memo.get(k);
  },
  authoredAt(x,y,z){counts.authoredAt++;return world.environmentCaves.get(x,y,z);},
  editedAt(x,y,z){counts.editedAt++;return world.edits.has(key(x,y,z));},
  protectedAt(x,y,z){counts.protectedAt++;return legacy.naturalAndLandmarkBlock(x,y,z)!==baseBlock(x,y,z,seed);}
 });
 const accepted=[],refused=[];let cutUnion=new Set(),allFloor=new Set(),allAir=new Set();
 let budget=measureGalleryCutUnion(cutUnion,source.naturalAt);
 let sourceChecks=0;
 // Stop at first aggregate budget refusal. Do not reset or split the
 // cumulative union to approve the remainder of the requested cohort.
 outer:for(const {rx,rz} of regions){
  const region=planUnderworldRegion(seed,rx,rz);
  for(const index of GALLERY_PAIRS){
   const proposal={ok:true,segments:[region.capsules[index],region.capsules[index+1]]};
   const f=compileGalleryConstructionFootprint(proposal);
   if(!f.ok){refused.push({rx,rz,index,reason:f.reason});break outer;}
   const proof=auditProtectedSubsurfaceStairs(proposal,{...source,maxCells:20000,minY:-210,maxY:-4});
   sourceChecks+=proof.sourceChecks;
   if(!proof.ok){refused.push({rx,rz,index,reason:proof.reason,examples:proof.examples});break outer;}
   if([...f.support].some(k=>allAir.has(k))||[...f.clearance].some(k=>allFloor.has(k))){
    refused.push({rx,rz,index,reason:'CROSS_GALLERY_FLOOR_AIR'});break outer;
   }
   const next=new Set(cutUnion);
   for(const k of f.clearance)if(source.naturalAt(...xyz(k))!==BLOCK.AIR)next.add(k);
   if(next.size>GALLERY_CONSTRUCTION_LIMITS.ownedCarves){
    refused.push({rx,rz,index,reason:'CUMULATIVE_CARVE_BUDGET',requestedCuts:next.size});break outer;
   }
   let projected;
   try{projected=measureGalleryCutUnion(next,source.naturalAt);}
   catch(error){
    if(error.message!=='GALLERY_ORIGINAL_READ_BUDGET')throw error;
    refused.push({rx,rz,index,reason:error.message});break outer;
   }
   if(!projected.ok){refused.push({rx,rz,index,reason:'CUMULATIVE_FACE_OR_CARVE_BUDGET',
    requestedCuts:projected.ownedCarves,requestedFaceGrowth:projected.faceGrowth,
    requestedMaxChunkFaces:projected.maxChunkFaces});break outer;}
   const route=stations(proposal.segments);
   accepted.push({rx,rz,index,route,footprint:f,sourceChecks:proof.sourceChecks,
    addedCuts:next.size-cutUnion.size});
   for(const k of f.support)allFloor.add(k);
   for(const k of f.clearance)allAir.add(k);
   cutUnion=next;budget=projected;
  }
 }
 if(JSON.stringify(world.save())!==initialSave)throw Error('PREFLIGHT_MUTATED_WORLD');
 // Genuine physical edits in the fresh, disposable M7 instance; the native
 // original set/get/collides/stepPlayer paths see the excavated geometry.
 // These edits are never exported to a real save or installed in a profile.
 for(const k of cutUnion){
  const [x,y,z]=xyz(k);
  if(world.get(x,y,z)!==memo.get(k)||world.edits.has(k)||
     world.environmentCaves.get(x,y,z)!==undefined)
   throw Error('CONSTRUCTION_SOURCE_CHANGED:'+k);
  if(!world.set(x,y,z,BLOCK.AIR)||world.get(x,y,z)!==BLOCK.AIR)
   throw Error('ORIGINAL_M7_PHYSICAL_CUT_FAILED:'+k);
 }
 if(world.edits.size!==cutUnion.size)throw Error('PHYSICAL_EDIT_UNION_MISMATCH');
 for(const k of allFloor){
  const id=world.get(...xyz(k));
  if(id===BLOCK.AIR||id!==memo.get(k))throw Error('RETAINED_FLOOR_CHANGED:'+k);
 }
 for(const k of allAir)if(world.get(...xyz(k))!==BLOCK.AIR)
  throw Error('PHYSICAL_CLEARANCE_READBACK_FAILED:'+k);
 const rows=[];
 for(const g of accepted){
  const forward=traverseRetainedDescent(world,g.route);
  const reverse=traverseRetainedDescent(world,[...g.route].reverse());
  rows.push(freeze({rx:g.rx,rz:g.rz,index:g.index,stations:g.route.length,
   supportCells:g.footprint.support.size,clearanceCells:g.footprint.clearance.size,
   addedCuts:g.addedCuts,sourceChecks:g.sourceChecks,forward,reverse,
   physicallyBuilt:true,controllerAccepted:forward.ok&&reverse.ok}));
 }
 const walked=rows.filter(r=>r.controllerAccepted).length;
 return freeze({seed,requestedGalleries:regions.length*16,
  physicallyBuiltGalleries:rows.length,walkedGalleries:walked,
  completeCohort:walked===regions.length*16,
  rows:freeze(rows),refused:freeze(refused.map(freeze)),
  budget,limits:GALLERY_CONSTRUCTION_LIMITS,sourceChecks,
  originalRoleCalls:freeze({...counts}),actualPhysicalEdits:world.edits.size,
  retainedFloorCells:allFloor.size,clearanceCells:allAir.size,
  allBuiltFootprintReadbackPassed:true,oldAuthoredCellsChanged:0,
  historicalSaveWrites:0,worldDiscardedAfterAudit:true,
  noSupportPlacements:true,liveWalkingVerified:false,releaseApproved:false});
}
