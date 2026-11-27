// Phase46: detached finite-window retained structural deck revision.
// This is a NEW geometry candidate, not automatic veto-filter admission.
// No original terrain mutation, save, city approval, or production import.
import {createPeakGalleryProjection} from './peak-gallery-acceptance-renderer.mjs';
import {compactUpperHubResearchAirAt} from './compact-upper-hub-research.mjs';
import {planUnderworldRegion} from './worldwide-network.mjs';
import {GALLERY_CONSTRUCTION_LIMITS as limits} from './physical-gallery-construction.mjs';
import {engineWantedSections} from './gallery-streaming-working-set.mjs';
import {isCandidateGeologyMaterial} from './protected-entrance-envelope.mjs';
import {VoxelWorld,BLOCK,baseBlock,chunkCoord,collides} from '../voxel.mjs';
import {sectionForY,sectionBounds,depthMeshKey} from '../depth.mjs';
import {traverseRetainedDescent} from './retained-switchback-descent-route.mjs';
const key=(x,y,z)=>x+','+y+','+z,xyz=k=>k.split(',').map(Number);
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const cardinal=dirs.filter(d=>d[1]===0);
const owner=(x,y,z)=>{const s=sectionForY(y);return s===null?null:depthMeshKey(chunkCoord(x),chunkCoord(z),s);};
const check=(v,m)=>{if(!v)throw Error(m);};
const peak=engineWantedSections(-40,-135,-3),selected=engineWantedSections(-40,-136,-2);
const stage=['-39,-135,-2','-39,-135,-3','-40,-135,-2','-40,-135,-3','-40,-136,-2','-40,-136,-3'];
export const RETAINED_DECK_CANDIDATE=Object.freeze({
 id:'retained-gallery-deck-research-v1',geometry:'compact network with immutable original gallery support decks',
 preservesOriginalGalleryClearance:true,addsNoCellsOutsideOriginalNetwork:true,constructionAdmission:false
});
function components(cells,neighbors){
 const label=new Map(),sizes=[];
 for(const start of cells){
  if(label.has(start))continue;
  const id=sizes.length,q=[start];label.set(start,id);
  for(let i=0;i<q.length;i++)for(const n of neighbors(q[i])){
   if(cells.has(n)&&!label.has(n)){label.set(n,id);q.push(n);}
  }
  sizes.push(q.length);
 }
 return {label,sizes};
}
const around=k=>{const [x,y,z]=xyz(k);return dirs.map(([a,b,c])=>key(x+a,y+b,z+c));};
export function captureRetainedDeckSource(){
 const p=createPeakGalleryProjection(),{original,cuts,floors}=p,legacy=new VoxelWorld(original.seed);
 const owners=[...new Set([...peak,...selected])],domain=new Set(owners);
 check(owners.length===42,'FROZEN_OWNER_SCOPE_CHANGED');
 const inDomain=(x,y,z)=>domain.has(owner(x,y,z));
 const data=new Map(),rows=[],rawAir=new Set(),revisedAir=new Set(),future=new Set(),conflicts=new Set(),otherVetoes=[];
 const rawRequest=new Set(),revisedCuts=new Set(),floorValues=new Map(),halo=new Map();
 let sourceCalls=0,maxOwnerReads=0,checked=0;
 // Independent exact read of each full owner and its halo for both candidate
 // geometry and topology. All source calls charged BEFORE execution, no
 // uncounted cross-owner source reads inside each transaction. Reuse halo
 // samples across owner boundaries; direct entries, not internal generator work.
 for(const k of owners){
  const [cx,cz,s]=xyz(k),b=sectionBounds(s),row={key:k,reads:0,checked:0,requests:0,newCuts:0,retainedDeck:0,unsafe:0};
  const read=fn=>{if(row.reads>=limits.originalNaturalReads)throw Error('DECK_OWNER_READ_LIMIT:'+k);row.reads++;sourceCalls++;return fn();};
  const get=(x,y,z)=>{const c=key(x,y,z);if(!halo.has(c))halo.set(c,read(()=>original.get(x,y,z)));return halo.get(c);};
  // Full one-cell halo includes all six real face-neighbor source positions.
  for(let y=b.minY-1;y<=b.maxY+1;y++)for(let x=cx*16-1;x<=cx*16+16;x++)for(let z=cz*16-1;z<=cz*16+16;z++)get(x,y,z);
  for(let y=b.minY;y<=b.maxY;y++)for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++){
   const c=key(x,y,z),id=get(x,y,z);data.set(c,id);row.checked++;checked++;
   const mask=compactUpperHubResearchAirAt(original.seed,x,y,z);
   const baseAir=id===BLOCK.AIR||cuts.has(c);
   if(mask)rawRequest.add(c);
   if(baseAir||mask)rawAir.add(c);
   if(floors.has(c)){
    check(!baseAir,'RETAINED_DECK_BASELINE_NOT_SOLID:'+c);
    floorValues.set(c,id);
   }
   if(baseAir){revisedAir.add(c);if(mask&&id!==BLOCK.AIR)row.requests++;continue;}
   if(!mask)continue;
   row.requests++;row.newCuts++;
   if(floors.has(c)){conflicts.add(c);row.retainedDeck++;continue;}
   let reason=null;
   if(original.edits.has(c))reason='PLAYER_EDIT';
   else if(read(()=>original.environmentCaves.get(x,y,z))!==undefined)reason='AUTHORED_SOURCE';
   else if(read(()=>legacy.naturalAndLandmarkBlock(x,y,z))!==read(()=>baseBlock(x,y,z,original.seed)))reason='LANDMARK';
   else if(!isCandidateGeologyMaterial(id))reason='UNSAFE_MATERIAL';
   if(reason){row.unsafe++;otherVetoes.push({cell:c,reason});continue;}
   future.add(c);revisedAir.add(c);
  }
  maxOwnerReads=Math.max(maxOwnerReads,row.reads);rows.push(row);
 }
 // Refuse the ENTIRE revised geometry on any non-deck veto, never approve a
 // subset of a failed source request. Deck precedence is explicit geometry;
 // connectivity and combined budget proof are independent mandatory gates.
 check(otherVetoes.length===0,'NON_DECK_VETO:'+JSON.stringify(otherVetoes.slice(0,8)));
 for(const c of conflicts)check(floorValues.has(c)&&!revisedAir.has(c),'DECK_GEOMETRY_LOST:'+c);
 for(const c of future){check(rawRequest.has(c)&&!floors.has(c)&&!cuts.has(c),'NEW_GEOMETRY_ESCAPED:'+c);revisedCuts.add(c);}
 return {p,original,cuts,floors,owners,domain,inDomain,data,rows,rawAir,revisedAir,future,conflicts,rawRequest,floorValues,halo,sourceCalls,maxOwnerReads,checked};
}
export function inspectRetainedDeckCandidate(){
 const {p,original,cuts,floors,owners,domain,inDomain,data,rows,rawAir,revisedAir,future,conflicts,rawRequest,floorValues,halo,sourceCalls,maxOwnerReads,checked}=captureRetainedDeckSource();
 const otherVetoes=[],revisedCuts=future;
 const sourceAt=(x,y,z)=>{
  const c=key(x,y,z);if(!halo.has(c))throw Error('OUTSIDE_CAPTURED_ORIGINAL_HALO:'+c);return halo.get(c);
 };
 const projectedAt=(x,y,z)=>{
  const c=key(x,y,z);return cuts.has(c)||revisedCuts.has(c)?BLOCK.AIR:sourceAt(x,y,z);
 };
 const view={get:projectedAt,edits:new Map(),rotationAt:()=>0};
 // Independent binary full-cube face census on complete owner interiors and
 // halo, not the sparse changed-face accumulator from previous sessions.
 for(const row of rows){
  const [cx,cz,s]=xyz(row.key),b=sectionBounds(s);
  let oldFaces=0,galleryFaces=0,combinedFaces=0,galleryCuts=0,combinedCuts=0;
  const air=(x,y,z,mode)=>{const c=key(x,y,z);return sourceAt(x,y,z)===BLOCK.AIR||
   mode>=1&&cuts.has(c)||mode===2&&revisedCuts.has(c);};
  for(let y=b.minY;y<=b.maxY;y++)for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++){
   const a=air(x,y,z,0),g=air(x,y,z,1),n=air(x,y,z,2);
   if(!a&&g)galleryCuts++;if(!a&&n)combinedCuts++;
   if(n){}else for(const [dx,dy,dz] of dirs)combinedFaces+=Number(air(x+dx,y+dy,z+dz,2));
   if(!g)for(const [dx,dy,dz] of dirs)galleryFaces+=Number(air(x+dx,y+dy,z+dz,1));
   if(!a)for(const [dx,dy,dz] of dirs)oldFaces+=Number(air(x+dx,y+dy,z+dz,0));
  }
  Object.assign(row,{galleryCuts,combinedCuts,oldFaces,galleryFaces,combinedFaces,
   galleryGrowth:Math.max(0,galleryFaces-oldFaces),combinedGrowth:Math.max(0,combinedFaces-oldFaces)});
 }
 const cost=(keys,stageKeys=[])=>{
  const r=rows.filter(x=>keys.includes(x.key)),s=rows.filter(x=>stageKeys.includes(x.key));
  const sum=(a,f)=>a.reduce((n,x)=>n+x[f],0);
  const out={owners:r.length,galleryCuts:sum(r,'galleryCuts'),galleryFaces:sum(r,'galleryGrowth'),
   combinedCuts:sum(r,'combinedCuts'),combinedFaces:sum(r,'combinedGrowth'),
   maxOwnerFaces:Math.max(0,...r.map(x=>x.combinedGrowth)),
   stagedCuts:sum(r,'combinedCuts')+sum(s,'combinedCuts'),stagedFaces:sum(r,'combinedGrowth')+sum(s,'combinedGrowth')};
  return {...out,withinLimits:out.combinedCuts<=limits.ownedCarves&&out.combinedFaces<=limits.faceGrowth&&
   out.maxOwnerFaces<=limits.perChunkFaceGrowth&&out.stagedCuts<=limits.ownedCarves&&out.stagedFaces<=limits.faceGrowth};
 };
 // Six-neighbor AIR connectivity is independent of controller walkability.
 // Compare surviving cell membership for each original raw-air component.
 const before=components(rawAir,around),after=components(revisedAir,around),mapped=new Map();
 for(const c of revisedAir){const a=before.label.get(c),b=after.label.get(c);check(a!==undefined,'AIR_CREATED_OUTSIDE_RAW_GEOMETRY');if(!mapped.has(a))mapped.set(a,new Set());mapped.get(a).add(b);}
 const split=[...mapped].filter(([,ids])=>ids.size>1).map(([id,ids])=>({rawSize:before.sizes[id],pieces:[...ids].map(i=>after.sizes[i])}));
 let boundaryRaw=0,boundaryRevised=0,removedBoundary=0;
 for(const c of rawAir){const [x,y,z]=xyz(c);if(dirs.some(([a,b,d])=>!inDomain(x+a,y+b,z+d))){boundaryRaw++;if(revisedAir.has(c))boundaryRevised++;else removedBoundary++;}}
 // Walk graph: body and support use actual original native collision.
 // Only captured interior cells may be graph feet; one-cell halo is source
 // data, not a claim that future geometry outside the window is constructed.
 const feet=new Set();
 for(const c of revisedAir){
  const [x,y,z]=xyz(c);
  if(!inDomain(x,y-1,z)||!inDomain(x,y+1,z))continue;
  if(projectedAt(x,y-1,z)===BLOCK.AIR||projectedAt(x,y+1,z)!==BLOCK.AIR)continue;
  if(!collides(view,x+.5,y,z+.5)&&collides(view,x+.5,y-.002,z+.5))feet.add(c);
 }
 const adjacent=c=>{
  const [x,y,z]=xyz(c),out=[];
  for(const [a,,d] of cardinal)for(const dy of [0,1,-1]){
   const n=key(x+a,y+dy,z+d);if(!feet.has(n))continue;
   // A one-block riser must have headroom on the lower side in both directions.
   const low=dy>0?[x,y,z]:[x+a,y+dy,z+d];
   if(dy&&(!inDomain(low[0],low[1]+2,low[2])||projectedAt(low[0],low[1]+2,low[2])!==BLOCK.AIR))continue;
   out.push(n);
  }return out;
 };
 const walk=components(feet,adjacent),start=key(-628,-30,-2162);
 check(feet.has(start),'PREVIOUSLY_QUALIFIED_CAMERA_LOST');
 const parent=new Map([[start,null]]),distance=new Map([[start,0]]),queue=[start];
 for(let i=0;i<queue.length;i++)for(const n of adjacent(queue[i]))if(!parent.has(n)){parent.set(n,queue[i]);distance.set(n,distance.get(queue[i])+1);queue.push(n);}
 const routes=[],plan=planUnderworldRegion(original.seed,-3,-9);
 const replay=(label,target)=>{
  if(!target){routes.push({label,ok:false,reason:'NO_REACHABLE_SUPPORTED_TARGET'});return;}
  const path=[];for(let at=target;at!==null;at=parent.get(at))path.push(at);
  path.reverse();
  if(path.length>256){routes.push({label,ok:false,reason:'NATIVE_REPLAY_STATION_CAP',stations:path.length});return;}
  const points=path.map(c=>{const [x,feet,z]=xyz(c);return {x,feet,z};});
  let forward,reverse;
  try{forward=traverseRetainedDescent(view,points);reverse=traverseRetainedDescent(view,[...points].reverse());}
  catch(e){routes.push({label,target,ok:false,reason:String(e),stations:points.length});return;}
  routes.push({label,target,stations:points.length,forward,reverse,ok:forward.ok&&reverse.ok});
 };
 const reachableNew=queue.filter(c=>future.has(c));
 reachableNew.sort((a,b)=>distance.get(b)-distance.get(a)||a.localeCompare(b));
 replay('gallery to new cavern supported floor',reachableNew.find(c=>distance.get(c)<=180));
 const anchors=[];
 for(const [name,a] of [['upper hub',plan.layers[0].hub],...Object.entries(plan.layers[0].portals),['upper socket',plan.surfaceSocket]]){
  const inside=inDomain(a.x,a.y,a.z);
  if(!inside){anchors.push({name,anchor:a,scope:'outside finite owner union',qualified:false});continue;}
  const options=queue.filter(c=>{const [x,y,z]=xyz(c);return Math.hypot(x-a.x,z-a.z)<=3&&Math.abs(y-a.y)<=10;})
   .sort((a,b)=>distance.get(a)-distance.get(b));
  anchors.push({name,anchor:a,scope:'inside',reachableSupportedFeet:options.length,qualified:false});
  replay(name,options[0]);
 }
 const peakCost=cost(peak,stage),selectedCost=cost(selected,stage);
 const floorReadback=[...floorValues].every(([c,id])=>projectedAt(...xyz(c))===id);
 check(floorReadback,'RETAINED_DECK_READBACK_FAILED');
 check(JSON.stringify(original.save())===p.initial,'SOURCE_SAVE_MUTATED');
 return {candidate:RETAINED_DECK_CANDIDATE,owners:owners.length,checked,originalGalleryCuts:cuts.size,
  rawRequests:rows.reduce((n,r)=>n+r.requests,0),rawNewCuts:rows.reduce((n,r)=>n+r.newCuts,0),
  originalFloorConflicts:conflicts.size,remainingFloorConflicts:0,retainedFloorCells:floorValues.size,
  futureCuts:future.size,otherVetoes:otherVetoes.length,floorReadback,sourceCalls,maxOwnerReads,
  peakCost,selectedCost,rows,airConnectivity:{rawComponents:before.sizes.length,revisedComponents:after.sizes.length,
   splitComponents:split.length,splitExamples:split.slice(0,8),disappearedComponents:before.sizes.length-mapped.size,
   boundaryRaw,boundaryRevised,removedBoundary},
  walking:{feet:feet.size,components:walk.sizes.length,reachableFeet:queue.length,reachableNewFeet:reachableNew.length,routes,anchors},
  finiteWindowOnly:true,fullRegionPortalConnectivityQualified:false,fullDescentUnchanged:true,cityVetoUnchanged:true,
  sourceCallsAreDirectEntries:true,sourceSaveUnchanged:true,worldWrites:0,constructionAdmission:false};
}
