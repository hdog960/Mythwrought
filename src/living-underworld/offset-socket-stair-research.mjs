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
const proposalOf=route=>({ok:true,segments:route.slice(1).map((b,i)=>({a:route[i],b}))});
function helix(hub,socket,dir,rot,phase,lift,ox,oz,landingAxis){
 const route=[];let y=hub.y+lift;
 const terminal=socket.y-2,finishDelay=phase===2?1:2;
 let firstTop=-1;
 for(let i=0;i<160;i++){
  const j=(rot+dir*i+16000)%16;
  if(i&&j%4===phase)y++;
  if(y>terminal)break;
  const [x,z]=ring[j];route.push({x:hub.x+ox+x,y,z:hub.z+oz+z});
  // Leave the upper ring before another step's support enters the landing.
  // Earlier full top plateau made all 480 inward landings overlap their own AIR.
  if(y===terminal){if(firstTop<0)firstTop=i;if(i-firstTop===finishDelay)break;}
 }
 if(route.at(-1)?.y!==terminal)throw Error('SOCKET_STATION_CAP');
 // End on the original socket center, not simply somewhere nearby.
 for(const axis of landingAxis==='x'?['x','z']:['z','x']){
  while(route.at(-1)[axis]!==socket[axis]){
   const p=route.at(-1);route.push({...p,[axis]:p[axis]+Math.sign(socket[axis]-p[axis])});
  }
 }
 return route;
}
const cardinal=[[1,0],[-1,0],[0,1],[0,-1]];
function findOffsetApproach({hub,original,cuts,floors,spiral,fp}){
 const finish=spiral[0],end=key(finish.x,finish.y,finish.z);
 const startCandidates=new Set();
 for(const k of floors){
  const [x,sy,z]=xyz(k),y=sy+1;
  if(Math.abs(x-hub.x)>12||Math.abs(z-hub.z)>12||y<hub.y-2||y>hub.y+1)continue;
  // Existing gallery clearance at both body cells (source AIR also possible
  // but this planning search intentionally selects known physical gallery feet).
  if(cuts.has(key(x,y,z))&&cuts.has(key(x,y+1,z)))startCandidates.add(key(x,y,z));
 }
 // Exact incremental footprint: the existing compiler uses the arriving
 // edge's cross-axis, not the union of incoming and outgoing widths.
 // At a turn the current first station is provisional until prepended.
 const cells=(p,dx)=>{const support=[],air=[];for(let w=-1;w<=1;w++){
  const x=p.x+(dx?0:w),z=p.z+(dx?w:0);
  support.push(key(x,p.y-1,z));for(let h=0;h<3;h++)air.push(key(x,p.y+h,z));
 }return {support,air};};
 const tailSupport=new Set(),tailAir=new Set();
 for(let i=1;i<spiral.length;i++){const p=spiral[i],q=spiral[i-1],c=cells(p,p.x-q.x);for(const k of c.support)tailSupport.add(k);for(const k of c.air)tailAir.add(k);}
 const safe=(c,s,a)=>c.support.every(k=>!cuts.has(k)&&!a.has(k))&&c.air.every(k=>!floors.has(k)&&!s.has(k)&&networkAirAt(original.seed,...xyz(k)));
 const extend=(state,c)=>({s:new Set([...state.s,...c.support]),a:new Set([...state.a,...c.air])});
 const q=[{route:[finish],s:tailSupport,a:tailAir}],visits=new Map();
 let tried=0,pruned=0,searchNodes=0;
 // Bounded path-aware search; retain up to three genuinely different
 // arrival histories per location/heading instead of one shortest parent.
 // Never weaken the final independent full-footprint or source gate.
 for(let i=0;i<q.length&&i<4200;i++){
  const st=q[i],p=st.route[0];searchNodes++;
  if(st.route.length>=25)continue;
  for(const [dx,dz] of cardinal)for(const dy of [0,-1]){
   const n={x:p.x+dx,y:p.y+dy,z:p.z+dz},k=key(n.x,n.y,n.z);
   if(Math.abs(n.x-hub.x)>12||Math.abs(n.z-hub.z)>12||n.y<hub.y-2||st.route.some(v=>key(v.x,v.y,v.z)===k))continue;
   const arriving=cells(p,dx),first=cells(n,dx);
   if(!safe(arriving,st.s,st.a)){pruned++;continue;}
   const next=extend(st,arriving),prefix=[n,...st.route];
   if(startCandidates.has(k)&&prefix.length>=4&&safe(first,next.s,next.a)){
    const route=[...prefix,...spiral.slice(1)],proposal=proposalOf(route),combined=compileGalleryConstructionFootprint(proposal);
    tried++;
    if(combined.ok&&![...combined.support].some(k=>cuts.has(k))&&![...combined.clearance].some(k=>floors.has(k)||!networkAirAt(original.seed,...xyz(k))))return {route,proposal,footprint:combined,approachStations:prefix.length,searchNodes,tried,pruned};
   }
   const id=k+':'+dx+','+dz,seen=visits.get(id)??0;
   if(seen>=3||q.length>=4200)continue;
   visits.set(id,seen+1);q.push({route:prefix,...next});
  }
 }
 return {route:null,searchNodes,tried,pruned,availableGalleryFeet:startCandidates.size};
}
export function inspectOffsetSocketSpiral(){
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
  const support=c=>{const [x,y,z]=xyz(c);return Math.abs(x-hub.x)<=13&&Math.abs(z-hub.z)<=13&&y>=hub.y-3&&y<=hub.y+3&&
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
 let sourceAttempts=0,geometryPasses=0,skippedAfterCap=0;
 // Do not repeat the 128 failed same-axis ground-level shapes. Each new
 // candidate begins at a raised landing with an independently offset ramp.
 // Geometric alternatives are bounded and exact original-scope proof retained.
 for(const lift of [4,5,6])for(const [ox,oz] of [[1,0],[-1,0],[0,1],[0,-1]])
  for(const [dir,phase,rot] of (ox===1?[[1,2,12],[1,3,8],[-1,2,0],[-1,1,4]]:ox===-1?[[1,2,4],[1,3,0],[-1,2,8],[-1,1,12]]:oz===1?[[1,2,0],[1,3,12],[-1,2,4],[-1,1,8]]:[[1,2,8],[1,3,4],[-1,2,12],[-1,1,0]]))for(const landingAxis of [ox?'x':'z']){
  attempted++;
  const spiral=helix(hub,socket,dir,rot,phase,lift,ox,oz,landingAxis);
  const fp=compileGalleryConstructionFootprint(proposalOf(spiral));
  const r={dir,phase,rot,lift,offset:[ox,oz],landingAxis,stations:spiral.length};
  if(!fp.ok){candidates.push({...r,reason:'RAISED_SPIRAL_GEOMETRY',failures:fp.failures??[],detail:fp.reason});continue;}
  const galleryFloorConflicts=[...fp.clearance].filter(k=>floors.has(k));
  const galleryAirConflicts=[...fp.support].filter(k=>cuts.has(k));
  const outside=[...fp.clearance].filter(k=>!networkAirAt(original.seed,...xyz(k)));
  if(galleryFloorConflicts.length||galleryAirConflicts.length||outside.length){
   candidates.push({...r,reason:'RAISED_SPIRAL_ORIGINAL_GEOMETRY',galleryFloorConflicts:galleryFloorConflicts.length,galleryAirConflicts:galleryAirConflicts.length,outside:outside.length});continue;
  }
  const a=findOffsetApproach({hub,original,cuts,floors,spiral,fp});
  if(!a.route){candidates.push({...r,reason:'NO_THREE_WIDE_OFFSET_APPROACH',searchNodes:a.searchNodes,availableGalleryFeet:a.availableGalleryFeet,tried:a.tried,pruned:a.pruned});continue;}
  geometryPasses++;
  if(sourceAttempts>=16){skippedAfterCap++;continue;}
  const {route,proposal,footprint:f}=a;
  Object.assign(r,{stations:route.length,approachStations:a.approachStations,searchNodes:a.searchNodes,pruned:a.pruned});
  sourceAttempts++;
  const audit=auditProtectedSubsurfaceStairs(proposal,{...source,maxCells:20000,minY:-210,maxY:-4,stopOnFirstUnsafe:true});
  if(!audit.ok){candidates.push({...r,reason:'ORIGINAL_SOURCE_VETO',counts:audit.counts,examples:audit.examples,firstRefusal:audit.firstRefusal});continue;}
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
 return {seed:original.seed,hub,socket,attempted,geometryPasses,sourceAttempts,skippedAfterCap,reasonCounts,candidates,qualified:ranked.length,best:ranked[0]??null,
  sourceCalls,limit:limits.originalNaturalReads,sourceSaveUnchanged:true,worldWrites:0,
  // Even a local pass is not combined resident/staging or surface entrance
  // approval. No old authored descent re-use at unrelated coordinates.
  completeOriginalDescentUnchanged:true,surfaceOwnerNotQualified:true,combinedBudgetQualified:false,constructionAdmission:false};
}
