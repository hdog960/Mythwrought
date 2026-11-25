// Read-only completion diagnostic: count the entire original 80-gallery
// union, even when it is unaffordable. Never builds or admits a proposal.
// The Phase40 construction limits are imported unchanged. Diagnostic reads
// are bounded by the exact finite footprint and its six-neighbor envelope,
// NOT an increased construction admission/read budget.
import {GALLERY_PAIRS,GALLERY_CONSTRUCTION_LIMITS,measureGalleryCutUnion}
 from './physical-gallery-construction.mjs';
import {planUnderworldRegion} from './worldwide-network.mjs';
import {compileGalleryConstructionFootprint} from './combined-stair-footprints.mjs';
import {auditProtectedSubsurfaceStairs} from './protected-subsurface-stairs.mjs';
import {createOriginalM7ReadOnlySource,inspectOriginalM7ReadOnlySource}
 from './original-m7-reader-provenance.mjs';
import {BLOCK} from '../voxel.mjs';
import {actualGallerySectionCosts,auditGalleryEngineWorkingSet} from './gallery-streaming-working-set.mjs';
export const GALLERY_CENSUS_SITES=Object.freeze([
 {biome:'plains',rx:-9,rz:0},{biome:'desert',rx:-3,rz:-9},
 {biome:'snow',rx:-6,rz:3},{biome:'mountain',rx:6,rz:9},
 {biome:'enchanted',rx:-9,rz:-6}].map(Object.freeze));
const key=(x,y,z)=>x+','+y+','+z,xyz=k=>k.split(',').map(Number);
const neighbors=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const union=(target,items)=>{for(const k of items)target.add(k);};
const roles=['naturalAt','authoredAt','editedAt','protectedAt'];
function centerline(segments){
 const cells=new Set();
 for(const {a,b} of segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,n=Math.max(Math.abs(dx),Math.abs(dz));
  for(let i=0;i<=n;i++){
   const x=Math.round(a.x+dx*i/n),y=Math.round(a.y+dy*i/n),z=Math.round(a.z+dz*i/n);
   // Even a one-cell-wide passage needs both cells for the original 1.78
   // high player at an exact nominal integer-foot station. This is only
   // a necessary lower bound for these FIXED centerlines, not a walkable
   // corridor or a lower bound for arbitrary redesigned routes.
   cells.add(key(x,y,z));cells.add(key(x,y+1,z));
  }
 }
 return cells;
}
const compactCost=r=>({ownedCarves:r.ownedCarves,faceGrowth:r.faceGrowth,
 maxChunkFaces:r.maxChunkFaces,affectedChunks:r.affectedChunks,ok:r.ok});
// Diagnostic local-window statistic only; not a replacement or relaxation
// of the cumulative gate. Counts all owners in each possible 3x3x3 window.
function windowMaximum(rows){
 const map=new Map(rows.map(r=>[r.origin.map(n=>n/16).join(','),r]));
 const centers=new Set();
 for(const r of rows){
  const [x,y,z]=r.origin.map(n=>n/16);
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++)
   centers.add(key(x+a,y+b,z+c));
 }
 let maxFaces=0,maxCuts=0,maxOwners=0,faceCenter=null;
 for(const k of centers){
  const [x,y,z]=xyz(k);let faces=0,cuts=0,owners=0;
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(let c=-1;c<=1;c++){
   const r=map.get(key(x+a,y+b,z+c));if(!r)continue;
   faces+=r.faceGrowth;cuts+=r.ownedCarves;owners++;
  }
  if(faces>maxFaces){maxFaces=faces;faceCenter=[x*16,y*16,z*16];}
  maxCuts=Math.max(maxCuts,cuts);maxOwners=Math.max(maxOwners,owners);
 }
 return {windowsExamined:centers.size,maxFaces,maxCuts,maxOwners,faceCenter,
  diagnosticOnly:true,policyChanged:false,gpuVerified:false};
}
export function censusOriginal80GalleryCosts({engineWorkingSet=false}={}){
 const seed=179,source=createOriginalM7ReadOnlySource(seed);
 if(!inspectOriginalM7ReadOnlySource(source,{seed}).ok)throw Error('ORIGINAL_SOURCE_IDENTITY');
 const planned=[],floor=new Set(),air=new Set(),minimum=new Set();
 let rawCells=0;
 for(const site of GALLERY_CENSUS_SITES){
  const plan=planUnderworldRegion(seed,site.rx,site.rz);
  for(const index of GALLERY_PAIRS){
   const proposal={ok:true,segments:[plan.capsules[index],plan.capsules[index+1]]};
   const f=compileGalleryConstructionFootprint(proposal);
   if(!f.ok)throw Error('ORIGINAL_GEOMETRY_HOLD');
   if([...f.support].some(k=>air.has(k))||[...f.clearance].some(k=>floor.has(k)))
    throw Error('CROSS_GALLERY_FLOOR_CLEARANCE_HOLD');
   const core=centerline(proposal.segments);
   if([...core].some(k=>!f.clearance.has(k)))throw Error('CENTERLINE_OUTSIDE_ORIGINAL');
   union(floor,f.support);union(air,f.clearance);union(minimum,core);
   rawCells+=f.support.size+f.clearance.size;
   planned.push({site,index,proposal,f,core});
  }
 }
 if(planned.length!==80||rawCells>80*20000)throw Error('DIAGNOSTIC_FOOTPRINT_BOUND');
 const footprint=new Set([...floor,...air]),naturalEnvelope=new Set(footprint);
 // No uncapped terrain scan: all read coordinates are owned footprint or
 // immediate face neighbors of that exact footprint.
 for(const k of air){
  const [x,y,z]=xyz(k);
  for(const [dx,dy,dz] of neighbors)naturalEnvelope.add(key(x+dx,y+dy,z+dz));
 }
 const memo=Object.fromEntries(roles.map(r=>[r,new Map()]));
 const read=Object.freeze(Object.fromEntries(roles.map(role=>[role,(x,y,z)=>{
  const k=key(x,y,z),allowed=role==='naturalAt'?naturalEnvelope:footprint;
  if(!allowed.has(k))throw Error('DIAGNOSTIC_READ_OUTSIDE_FINITE_ENVELOPE');
  const m=memo[role];
  if(!m.has(k))m.set(k,source[role](x,y,z));
  return m.get(k);
 }])));
 const cuts=new Set(),minCuts=new Set(),rows=[],regions=[];
 let visited=0;
 for(const site of GALLERY_CENSUS_SITES){
  const regionCuts=new Set(),regionMin=new Set(),regionRows=[];
  for(const g of planned.filter(x=>x.site===site)){
   const proof=auditProtectedSubsurfaceStairs(g.proposal,{...read,maxCells:20000,minY:-210,maxY:-4});
   visited+=proof.sourceChecks;
   if(!proof.ok)throw Error('ORIGINAL_GALLERY_SOURCE_HOLD:'+JSON.stringify({site,index:g.index,reason:proof.reason,examples:proof.examples}));
   const previous=cuts.size;
   for(const k of g.f.clearance)if(read.naturalAt(...xyz(k))!==BLOCK.AIR){
    regionCuts.add(k);cuts.add(k);
   }
   for(const k of g.core)if(read.naturalAt(...xyz(k))!==BLOCK.AIR){
    regionMin.add(k);minCuts.add(k);
   }
   const row={biome:site.biome,index:g.index,sourceChecks:proof.sourceChecks,
    uniqueAdditionalCuts:cuts.size-previous,minimumHeadroomCells:g.core.size};
   rows.push(row);regionRows.push(row);
  }
  regions.push({biome:site.biome,galleries:regionRows.length,
   sourceChecks:regionRows.reduce((n,r)=>n+r.sourceChecks,0),
   original:compactCost(measureGalleryCutUnion(regionCuts,read.naturalAt)),
   fixedCenterlineTwoHigh:compactCost(measureGalleryCutUnion(regionMin,read.naturalAt))});
 }
 const full=measureGalleryCutUnion(cuts,read.naturalAt);
 const min=measureGalleryCutUnion(minCuts,read.naturalAt);
 const engine=engineWorkingSet?auditGalleryEngineWorkingSet(actualGallerySectionCosts(cuts,read.naturalAt)):null;
 if(engine&&engine.globalCuts!==cuts.size)throw Error('ENGINE_SECTION_CUT_PARITY');
 if(!inspectOriginalM7ReadOnlySource(source,{seed}).ok)throw Error('ORIGINAL_SOURCE_MUTATED');
 if(visited!==rawCells||regions.length!==5||rows.length!==80||
    rows.reduce((n,r)=>n+r.uniqueAdditionalCuts,0)!==cuts.size)
  throw Error('FULL_COHORT_ACCOUNTING_DRIFT');
 const limits=GALLERY_CONSTRUCTION_LIMITS;
 return {seed,sourceSafeGalleries:rows.length,sourceChecks:visited,
  uniqueFootprintCells:footprint.size,uniqueFloorCells:floor.size,uniqueClearanceCells:air.size,
  originalRoleCalls:Object.fromEntries(roles.map(r=>[r,memo[r].size])),
  finiteDiagnosticNaturalEnvelope:naturalEnvelope.size,
  original:compactCost(full),minimumFixedCenterlineHeadroom:compactCost(min),
  originalAffectedOwnerRows:full.rows,regions,rows,engineWorkingSet:engine,
  illustrative27ChunkWindows:windowMaximum(full.rows),
  limits,constructionAdmission:false,geometryFitsCumulativeCaps:full.ok,
  fixedCenterlineEvenMinimumExceedsCarveLimit:min.ownedCarves>limits.ownedCarves,
  sourceCensusOnly:true,noWorldWrites:true,noSupportPlacement:true,
  actualPhysicalGalleriesPreviouslyVerified:2,
  fullHaloAndGPUUnverified:true,releaseApproved:false};
}
