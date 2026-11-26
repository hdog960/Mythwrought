// Local acceptance only: immutable planned gallery AIR, not a saved or
// admitted construction. Use original M7 source and original owned layers.
import {createPeakGalleryProjection} from './peak-gallery-acceptance-renderer.mjs';
import {meshReadOnlySharedBatch} from './shared-native-mesh-snapshot.mjs';
import {BLOCK,collides,chunkCoord} from '../voxel.mjs';
import {sectionForY,depthMeshKey,verticalEditSections} from '../depth.mjs';
import {editAffectedChunks} from '../chunks.mjs';
import {compactUpperHubResearchAirAt} from './compact-upper-hub-research.mjs';
import {sectionBounds} from '../depth.mjs';
import {engineWantedSections} from './gallery-streaming-working-set.mjs';
import {VoxelWorld,baseBlock} from '../voxel.mjs';
import {isCandidateGeologyMaterial} from './protected-entrance-envelope.mjs';
import {planEnvironmentalScenery} from '../nonblock/staged-habitats.mjs';
import {GALLERY_CONSTRUCTION_LIMITS} from './physical-gallery-construction.mjs';
const xyz=k=>k.split(',').map(Number);
const key=(x,y,z)=>x+','+y+','+z;
export function createLocalGalleryGameWitness(){
 const p=createPeakGalleryProjection(),{original,cuts}=p,projection=Object.create(p.projection);
 let sourceScope=null;
 const charge=kind=>{
  if(sourceScope){if(sourceScope.reads+sourceScope.direct>=GALLERY_CONSTRUCTION_LIMITS.originalNaturalReads)throw Error('GALLERY_COMBINED_SOURCE_READ_LIMIT');sourceScope[kind]++;}
 };
 Object.defineProperty(projection,'get',{value(x,y,z){
  if(sourceScope&&!sourceScope.prepaidGet)charge('direct');
  return p.projection.get(x,y,z);
 }});
 // Existing environmental scenery plans against the natural reader; make
 // projected AIR visible to it, not just to the terrain get/collision path.
 const generated=original.naturalAndLandmarkBlock.bind(original);
 Object.defineProperty(projection,'naturalAndLandmarkBlock',{value(x,y,z){
  charge('direct');
  return cuts.has(key(x,y,z))?BLOCK.AIR:generated(x,y,z);
 }});
 // Charge direct method entry even during mesh composition. Calls nested
 // inside the original bound source are not claimed independently measured.
 for(const method of ['legacyBlockAt','environmentWaterState']){
  if(typeof original[method]!=='function')continue;
  const read=original[method].bind(original);
  Object.defineProperty(projection,method,{value(...args){charge('direct');return read(...args);}});
 }
 // The peak is a resident mesh window, not a guaranteed walkable center.
 // Derive exact feet from retained supports, including pre-existing AIR.
 const peakCenter=[-40,-135,-3],peakKeys=engineWantedSections(...peakCenter),peakSet=new Set(peakKeys);
 const owner=(x,y,z)=>depthMeshKey(chunkCoord(x),chunkCoord(z),sectionForY(y));
 const windows=new Map(),allFeet=[],oldEdit=[[-625,-36,-2160],[-625,-35,-2160]];
 const dirty=(cells,wanted)=>[...new Set(cells.flatMap(([x,y,z])=>
  verticalEditSections(y).flatMap(s=>editAffectedChunks(x,z).map(c=>depthMeshKey(c.cx,c.cz,s)))))].filter(k=>wanted.has(k)).sort();
 const totals=keys=>({faces:keys.reduce((n,k)=>n+(p.costs.get(k)?.faces??0),0),
  cuts:keys.reduce((n,k)=>n+(p.costs.get(k)?.cuts??0),0)});
 let camera,nearby,cameraProof;
 sourceScope={direct:0,reads:0,prepaidGet:false};
 try{
  for(const floor of p.floors){
   const [x,sy,z]=xyz(floor),y=sy+1,s=sectionForY(y);
   if(s===null||s>=0||!peakSet.has(owner(x,y,z)))continue;
   const at=[x,y,z],center=[chunkCoord(x),chunkCoord(z),s],id=center.join(',');
   if(projection.get(x,y-1,z)===BLOCK.AIR||projection.get(x,y,z)!==BLOCK.AIR||
      collides(projection,x+.5,y+.01,z+.5)||!collides(projection,x+.5,y-.03,z+.5))continue;
   allFeet.push(at);
   if(!windows.has(id)){
    const keys=engineWantedSections(...center),wanted=new Set(keys);
    const yy=sectionBounds(s).minY,xx=center[0]*16,zz=center[1]*16;
    const stageCells=dirty(oldEdit,wanted).length===6?oldEdit:[[xx,yy-1,zz],[xx,yy,zz]];
    windows.set(id,{center,keys,wanted,stageCells,stageKeys:dirty(stageCells,wanted),...totals(keys),
     peakOverlap:keys.filter(k=>peakSet.has(k)).length,feet:[]});
   }
   windows.get(id).feet.push(at);
  }
  const eligible=[...windows.values()].filter(w=>w.keys.length===27&&w.stageKeys.length===6&&w.faces>0);
  eligible.sort((a,b)=>b.faces-a.faces||b.cuts-a.cuts||b.peakOverlap-a.peakOverlap||
   b.feet.length-a.feet.length||a.center.join(',').localeCompare(b.center.join(',')));
  if(!eligible.length)throw Error('NO_SUPPORTED_GALLERY_WINDOW:'+JSON.stringify({feet:allFeet.length,windows:windows.size}));
  const win=eligible[0],scenes=new Map();
  for(const at of win.feet){
   const section=Math.floor(at[1]/8);
   if(!scenes.has(section))scenes.set(section,planEnvironmentalScenery(projection,win.center[0],win.center[1],{caveSection:section}).length);
  }
  const bestSection=[...scenes].sort((a,b)=>b[1]-a[1]||a[0]-b[0])[0][0];
  const candidates=win.feet.filter(at=>Math.floor(at[1]/8)===bestSection);
  const localTargets=at=>allFeet.filter(([x,y,z])=>win.wanted.has(owner(x,y,z))&&
   Math.abs(y-at[1])<=12&&Math.hypot(x-at[0],z-at[2])<=20&&Math.hypot(x-at[0],z-at[2])>=4);
  const ranked=candidates.map(at=>({at,targets:localTargets(at)}))
   .sort((a,b)=>b.targets.length-a.targets.length||a.at[0]-b.at[0]||a.at[1]-b.at[1]||a.at[2]-b.at[2]);
  if(ranked[0].targets.length<4)throw Error('NO_DISTINCT_GALLERY_OWNER_TARGETS');
  camera=ranked[0].at;nearby=ranked[0].targets;
  cameraProof={center:win.center,keys:win.keys,stageCells:win.stageCells,stageKeys:win.stageKeys,
   faces:win.faces,cuts:win.cuts,peakCenter,peakKeys,peakCosts:totals(peakKeys),peakOverlap:win.peakOverlap,
   exactPeakCamera:win.center.join(',')===peakCenter.join(','),exactPeakEligibleFeet:windows.get(peakCenter.join(','))?.feet.length??0,
   eligibleFeet:allFeet.length,eligibleWindows:eligible.length,plannedScenery:scenes.get(bestSection),
   supported:true,collisionFree:true,sourceCalls:sourceScope.direct,worldWrites:0};
 }finally{sourceScope=null;}
 return {...p,projection,camera,nearby,cameraProof,
  auditFuture(){return auditPeakFutureNetworkOverlap(p,cameraProof.keys);},
  build(world,keys,compose){
   if(sourceScope)throw Error('NESTED_MESH_TRANSACTION');
   sourceScope={direct:0,reads:0,prepaidGet:false};
   try{
    const batch=meshReadOnlySharedBatch(world,keys,{
     beforeRead:()=>{charge('reads');sourceScope.prepaidGet=true;},
     afterRead:()=>{sourceScope.prepaidGet=false;}
    });
    if(!batch.ok)throw Error(batch.reason);
    const rows=batch.meshes.map(m=>compose(m));
    const direct=sourceScope.direct;
    if(batch.calls!==sourceScope.reads)throw Error('GALLERY_READ_ACCOUNTING_MISMATCH');
    return {rows,reads:batch.calls,direct,hits:batch.hits,sourceCalls:batch.calls+direct};
   }finally{sourceScope=null;}
  },
  verifySave(){return JSON.stringify(original.save())===p.initial;}
 };
}
// One finite real-owner diagnostic of the unmodified future network mask.
// Not permission to cut: every requested solid cell is checked, including
// retained gallery support. A rejected cell invalidates full combined
// admission; we never silently use the safe subset as an approved overlay.
export function auditPeakFutureNetworkOverlap(p,selectedKeys=[]){
 const {original,cuts,floors}=p,legacy=new VoxelWorld(original.seed);
 const peak=engineWantedSections(-40,-135,-3),owners=[...new Set([...peak,...selectedKeys])];
 if(owners.length>54)throw Error('FUTURE_OWNER_UNION_LIMIT');
 const examples=[],rows=[];
 const fields=['checked','requests','newCuts','retainedFloorConflicts','authoredSolid','landmark','oreOrUnsafe','edits','sourceReads'];
 for(const k of owners){
  const [cx,cz,s=0]=xyz(k),b=sectionBounds(s),row={key:k,...Object.fromEntries(fields.map(v=>[v,0]))};
  const read=fn=>{if(row.sourceReads>=GALLERY_CONSTRUCTION_LIMITS.originalNaturalReads)throw Error('FUTURE_SOURCE_READ_LIMIT:'+k);row.sourceReads++;return fn();};
  for(let y=b.minY;y<=b.maxY;y++)for(let x=cx*16;x<cx*16+16;x++)for(let z=cz*16;z<cz*16+16;z++){
   row.checked++;
   if(!compactUpperHubResearchAirAt(original.seed,x,y,z))continue;
   const id=read(()=>original.get(x,y,z)),c=key(x,y,z);
   if(id===BLOCK.AIR)continue;
   row.requests++;
   if(cuts.has(c))continue;
   row.newCuts++;
   let reason=null;
   if(floors.has(c)){row.retainedFloorConflicts++;reason='RETAINED_GALLERY_FLOOR';}
   else if(original.edits.has(c)){row.edits++;reason='PLAYER_EDIT';}
   else if(read(()=>original.environmentCaves.get(x,y,z))!==undefined){row.authoredSolid++;reason='AUTHORED_SOURCE';}
   else if(read(()=>legacy.naturalAndLandmarkBlock(x,y,z))!==read(()=>baseBlock(x,y,z,original.seed))){row.landmark++;reason='LANDMARK';}
   else if(!isCandidateGeologyMaterial(id)){row.oreOrUnsafe++;reason='ORE_OR_UNSAFE';}
   if(reason&&examples.length<12)examples.push({x,y,z,reason,id,owner:k});
  }
  rows.push(row);
 }
 const sum=keys=>{
  const set=new Set(keys),r=rows.filter(x=>set.has(x.key)),result=Object.fromEntries(fields.map(f=>[f,r.reduce((n,x)=>n+x[f],0)]));
  const rejected=result.retainedFloorConflicts+result.authoredSolid+result.landmark+result.oreOrUnsafe+result.edits;
  return {...result,owners:r.length,rejected,fullFutureMaskSourceSafe:rejected===0,maxOwnerSourceReads:Math.max(0,...r.map(x=>x.sourceReads))};
 };
 return {...sum(owners),peak:sum(peak),selected:sum(selectedKeys),examples,
  sourceReadsCountDirectEntriesOnly:true,ownerSourceReadLimit:GALLERY_CONSTRUCTION_LIMITS.originalNaturalReads,
  combinedGeometryQualified:false,constructionAdmission:false,worldWrites:0};
}
