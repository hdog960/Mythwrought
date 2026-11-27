// Detached upper socket geometry research. Preserve all original gallery
// support and clearance, source vetoes and protected -3 surface. A new
// staircase may use original network envelope, not necessarily the smaller
// compact mask. No physical edits, production registration or admission.
import {createPeakGalleryProjection} from './peak-gallery-acceptance-renderer.mjs';
import {planUnderworldRegion,networkAirAt} from './worldwide-network.mjs';
import {compactUpperHubResearchAirAt} from './compact-upper-hub-research.mjs';
import {compileGalleryConstructionFootprint} from './combined-stair-footprints.mjs';
import {auditProtectedSubsurfaceStairs} from './protected-subsurface-stairs.mjs';
import {traverseRetainedDescent} from './retained-switchback-descent-route.mjs';
import {GALLERY_CONSTRUCTION_LIMITS as limits} from './physical-gallery-construction.mjs';
import {VoxelWorld,BLOCK,baseBlock,collides} from '../voxel.mjs';
const key=(x,y,z)=>x+','+y+','+z,xyz=k=>k.split(',').map(Number);
const ring=[];for(let x=-2;x<=2;x++)ring.push([x,-2]);
for(let z=-1;z<=2;z++)ring.push([2,z]);
for(let x=1;x>=-2;x--)ring.push([x,2]);
for(let z=1;z>=-1;z--)ring.push([-2,z]);
function helix(hub,socket,dir,rot,phase){
 const route=[];let y=hub.y;
 const terminal=socket.y-2;
 for(let i=0;i<160;i++){
  const j=(rot+dir*i+16000)%16;
  if(i&&j%4===phase)y++;
  if(y>terminal)break;
  const [x,z]=ring[j];route.push({x:hub.x+x,y,z:hub.z+z});
 }
 if(route.at(-1)?.y!==terminal)throw Error('SOCKET_STATION_CAP');
 return {route,proposal:{ok:true,segments:route.slice(1).map((b,i)=>({a:route[i],b}))}};
}
export function inspectOriginalSocketSpiral(){
 const p=createPeakGalleryProjection(),{original,cuts,floors}=p,legacy=new VoxelWorld(original.seed);
 const plan=planUnderworldRegion(original.seed,-3,-9),hub=plan.layers[0].hub,socket=plan.surfaceSocket;
 if(hub.x!==socket.x||hub.z!==socket.z)throw Error('SOCKET_AXIS_CHANGED');
 const maps=Object.fromEntries(['get','naturalAt','authoredAt','editedAt','protectedAt'].map(r=>[r,new Map()]));
 let sourceCalls=0;
 const read=fn=>{if(sourceCalls>=limits.originalNaturalReads)throw Error('SOCKET_SOURCE_LIMIT');sourceCalls++;return fn();};
 const cached=(role,fn)=>(x,y,z)=>{
  const c=key(x,y,z),m=maps[role];if(!m.has(c))m.set(c,fn(x,y,z));return m.get(c);
 };
 const get=cached('get',(...at)=>read(()=>original.get(...at)));
 const source={
  naturalAt:cached('naturalAt',(...at)=>read(()=>original.naturalAndLandmarkBlock(...at))),
  authoredAt:cached('authoredAt',(...at)=>read(()=>original.environmentCaves.get(...at))),
  editedAt:cached('editedAt',(...at)=>read(()=>original.edits.has(key(...at)))),
  protectedAt:cached('protectedAt',(...at)=>read(()=>legacy.naturalAndLandmarkBlock(...at))!==read(()=>baseBlock(...at,original.seed)))
 };
 const candidates=[],qualified=[];let attempted=0;
 const walkStart={x:-625,feet:-31,z:-2153};
 const join=(view,target)=>{
  const start=key(walkStart.x,walkStart.feet,walkStart.z),end=key(target.x,target.y,target.z);
  const support=c=>{const [x,y,z]=xyz(c);return Math.abs(x-hub.x)<=7&&Math.abs(z-hub.z)<=7&&y>=hub.y-3&&y<=hub.y+3&&
   !collides(view,x+.5,y,z+.5)&&collides(view,x+.5,y-.002,z+.5);};
  if(!support(start)||!support(end))return null;
  const q=[start],parent=new Map([[start,null]]);
  for(let i=0;i<q.length&&i<1800;i++){
   if(q[i]===end){const path=[];for(let a=end;a!==null;a=parent.get(a)){const [x,feet,z]=xyz(a);path.push({x,feet,z});}return path.reverse();}
   const [x,y,z]=xyz(q[i]);
   for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const dy of [0,1,-1]){
    const c=key(x+dx,y+dy,z+dz);
    if(!parent.has(c)&&support(c)){parent.set(c,q[i]);q.push(c);}
   }
  }return null;
 };
 for(const dir of [1,-1])for(let phase=0;phase<4;phase++)for(let rot=0;rot<16;rot++){
  attempted++;
  const {route,proposal}=helix(hub,socket,dir,rot,phase),f=compileGalleryConstructionFootprint(proposal);
  const r={dir,phase,rot,stations:route.length};
  if(!f.ok){candidates.push({...r,reason:'STRICT_STAIR_GEOMETRY',detail:f.failures});continue;}
  const galleryFloorConflicts=[...f.clearance].filter(k=>floors.has(k));
  const galleryAirConflicts=[...f.support].filter(k=>cuts.has(k));
  const outside=[...f.clearance].filter(k=>!networkAirAt(original.seed,...xyz(k)));
  if(galleryFloorConflicts.length||galleryAirConflicts.length||outside.length){
   candidates.push({...r,reason:'ORIGINAL_GEOMETRY_CONFLICT',galleryFloorConflicts:galleryFloorConflicts.length,galleryAirConflicts:galleryAirConflicts.length,outside:outside.length,examples:[...galleryFloorConflicts,...galleryAirConflicts,...outside].slice(0,4)});continue;
  }
  const audit=auditProtectedSubsurfaceStairs(proposal,{...source,maxCells:20000,minY:-210,maxY:-4});
  if(!audit.ok){candidates.push({...r,reason:'ORIGINAL_SOURCE_VETO',counts:audit.counts,examples:audit.examples});continue;}
  const added=new Set([...f.clearance].filter(k=>!cuts.has(k)&&get(...xyz(k))!==BLOCK.AIR));
  const outsideCompact=[...added].filter(k=>!compactUpperHubResearchAirAt(original.seed,...xyz(k)));
  const view={get(x,y,z){const c=key(x,y,z);return cuts.has(c)||added.has(c)?BLOCK.AIR:get(x,y,z);},edits:new Map(),rotationAt:()=>0};
  const supportOK=[...f.support].every(k=>view.get(...xyz(k))===get(...xyz(k))&&get(...xyz(k))!==BLOCK.AIR);
  if(!supportOK){candidates.push({...r,reason:'RETAINED_SOURCE_SUPPORT'});continue;}
  const points=route.map(({x,y,z})=>({x,feet:y,z}));
  const forward=traverseRetainedDescent(view,points),reverse=traverseRetainedDescent(view,[...points].reverse());
  const approach=join(view,route[0]);let joinedForward=null,joinedReverse=null;
  if(approach&&forward.ok&&reverse.ok){
   const combined=[...approach,...points.slice(1)];
   joinedForward=traverseRetainedDescent(view,combined);joinedReverse=traverseRetainedDescent(view,[...combined].reverse());
  }
  const ok=!!(forward.ok&&reverse.ok&&joinedForward?.ok&&joinedReverse?.ok);
  const record={...r,reason:ok?null:'NATIVE_CONTROLLER_OR_JOIN',ok,supports:f.support.size,clearance:f.clearance.size,
   addedCuts:added.size,outsidePreviousCompactMask:outsideCompact.length,forward,reverse,
   joinedStations:approach?approach.length+points.length-1:0,joinedForward,joinedReverse,
   topFeet:route.at(-1).y,topClearance:route.at(-1).y+2};
  candidates.push(record);
  if(ok)qualified.push({...record,route,approach,support:[...f.support],air:[...f.clearance]});
 }
 const ranked=qualified.sort((a,b)=>a.addedCuts-b.addedCuts||a.outsidePreviousCompactMask-b.outsidePreviousCompactMask);
 const reasonCounts={};for(const r of candidates)reasonCounts[r.reason??'SOURCE_AND_CONTROLLER_PASS']=(reasonCounts[r.reason??'SOURCE_AND_CONTROLLER_PASS']??0)+1;
 if(JSON.stringify(original.save())!==p.initial)throw Error('SOCKET_SOURCE_SAVE_MUTATED');
 return {seed:original.seed,hub,socket,attempted,reasonCounts,candidates,qualified:ranked.length,best:ranked[0]??null,
  sourceCalls,limit:limits.originalNaturalReads,sourceSaveUnchanged:true,worldWrites:0,
  // Even a local pass is not combined resident/staging or surface entrance
  // approval. No old authored descent re-use at unrelated coordinates.
  completeOriginalDescentUnchanged:true,surfaceOwnerNotQualified:true,combinedBudgetQualified:false,constructionAdmission:false};
}
