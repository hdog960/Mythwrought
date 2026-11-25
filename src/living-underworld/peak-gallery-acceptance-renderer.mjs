// Isolated acceptance renderer. No import by production main or save path.
// Uses genuine M7 and the real terrain/Pack2/Pack3/manual14 mesh builders.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR} from '../manual-biomes/profile-world.mjs';
import {VoxelWorld,BLOCK,baseBlock,chunkCoord,meshChunk} from '../voxel.mjs';
import {sectionForY,sectionBounds,depthMeshKey,verticalEditSections} from '../depth.mjs';
import {editAffectedChunks} from '../chunks.mjs';
import {meshDepthSection} from '../depth-mesh.mjs';
import {Pack2LiveWorld} from '../pack2-world.mjs';
import {pack2WaterSectionVertices} from '../pack2-integration.mjs';
import {createPack3RuntimeStage} from '../builder-assets/pack3-runtime.mjs';
import {combinePack3ChunkMesh,pack3SymbolForId} from '../builder-assets/pack3-live.mjs';
import {createManual14Layer} from '../builder-assets/manual14-layer.mjs';
import {meshManual14Chunk} from '../builder-assets/manual14-mesh.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../builder-assets/manual-five-pack.mjs';
import {planUnderworldRegion} from './worldwide-network.mjs';
import {compileGalleryConstructionFootprint} from './combined-stair-footprints.mjs';
import {auditProtectedSubsurfaceStairs} from './protected-subsurface-stairs.mjs';
import {GALLERY_PAIRS,GALLERY_CONSTRUCTION_LIMITS as limits} from './physical-gallery-construction.mjs';
import {actualGallerySectionCosts,engineWantedSections} from './gallery-streaming-working-set.mjs';
import {meshReadOnlySharedBatch} from './shared-native-mesh-snapshot.mjs';
import {uploadChunkBuffer} from '../gpu-recovery.mjs';
import {createCaveFarWallGpu} from '../manual-caves/c6-far-wall-gpu.mjs';
const xyz=k=>k.split(',').map(Number),key=(x,y,z)=>x+','+y+','+z;
const decode=k=>{const [cx,cz,s=0]=xyz(k);return {cx,cz,s};};
const owner=(x,y,z)=>depthMeshKey(chunkCoord(x),chunkCoord(z),sectionForY(y));
const join=(a,b)=>{const x=new Float32Array(a.length+b.length);x.set(a);x.set(b,a.length);return x;};
const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const check=(v,m)=>{if(!v)throw Error(m);};
export function createPeakGalleryProjection(){
 const seed=179,original=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
 const legacy=new VoxelWorld(seed),initial=JSON.stringify(original.save());
 const source={naturalAt:(...p)=>original.naturalAndLandmarkBlock(...p),
  authoredAt:(...p)=>original.environmentCaves.get(...p),
  editedAt:(...p)=>original.edits.has(key(...p)),
  protectedAt:(...p)=>legacy.naturalAndLandmarkBlock(...p)!==baseBlock(...p,seed)};
 const plan=planUnderworldRegion(seed,-3,-9),cuts=new Set(),floors=new Set();
 let sourceChecks=0;
 for(const i of GALLERY_PAIRS){
  const proposal={ok:true,segments:[plan.capsules[i],plan.capsules[i+1]]};
  const f=compileGalleryConstructionFootprint(proposal),p=auditProtectedSubsurfaceStairs(proposal,{...source,minY:-210,maxY:-4});
  check(f.ok&&p.ok,'PEAK_SOURCE_REFUSED');
  sourceChecks+=p.sourceChecks;
  for(const k of f.support){check(!cuts.has(k),'FLOOR_CUT');floors.add(k);}
  for(const k of f.clearance){
   check(!floors.has(k),'AIR_FLOOR');
   if(original.get(...xyz(k))!==BLOCK.AIR)cuts.add(k);
  }
 }
 const projection=Object.create(original);
 Object.defineProperty(projection,'get',{value(x,y,z){return cuts.has(key(x,y,z))?BLOCK.AIR:original.get(x,y,z);}});
 Object.defineProperty(projection,'set',{value(){throw Error('READ_ONLY_PROJECTION');}});
 const rows=actualGallerySectionCosts(cuts,source.naturalAt);
 const costs=new Map(rows.map(r=>[r.key,r]));
 return {original,projection,cuts,floors,costs,sourceChecks,initial};
}
// Full actual owner halo, including the legacy-offset section and all six
// neighboring faces. Independent comparison against sparse source projection.
function fullHaloDelta(original,projection,k){
 const {cx,cz,s}=decode(k),b=sectionBounds(s),w=18,h=b.maxY-b.minY+3;
 const a=new Uint8Array(w*w*h),p=new Uint8Array(a.length),idx=(x,y,z)=>x+w*(z+w*y);
 let reads=0;
 for(let y=0;y<h;y++)for(let z=0;z<w;z++)for(let x=0;x<w;x++){
  const q=[cx*16+x-1,b.minY+y-1,cz*16+z-1],i=idx(x,y,z);
  a[i]=Number(original.get(...q)!==BLOCK.AIR);p[i]=Number(projection.get(...q)!==BLOCK.AIR);reads++;
 }
 let before=0,after=0,cuts=0;
 for(let y=1;y<h-1;y++)for(let z=1;z<17;z++)for(let x=1;x<17;x++){
  const i=idx(x,y,z);if(a[i]&&!p[i])cuts++;
  for(const [dx,dy,dz] of dirs){const j=idx(x+dx,y+dy,z+dz);if(a[i]&&!a[j])before++;if(p[i]&&!p[j])after++;}
 }
 return {key:k,delta:after-before,cuts,before,after,reads};
}
export function runPeakGalleryNativeAndGpu(gl){
 check(gl&&typeof gl.createBuffer==='function','REAL_GL_REQUIRED');
 const p=createPeakGalleryProjection(),{original,projection,costs}=p;
 const wanted=engineWantedSections(-40,-135,-3),next=engineWantedSections(-39,-135,-3);
 const unique=[...new Set([...wanted,...next])];
 const halo=unique.map(k=>fullHaloDelta(original,projection,k));
 for(const r of halo){
  check(r.delta===(costs.get(r.key)?.delta??0),'FULL_HALO_FACE_PARITY:'+r.key);
  check(r.cuts===(costs.get(r.key)?.cuts??0),'FULL_HALO_CUT_PARITY:'+r.key);
 }
 // Populate actual isolated overlay layers on DISTINCT candidate-air cells.
 // These are temporary compatibility witnesses, not settlement or terrain edits.
 const world=new Pack2LiveWorld(projection);
 const candidates=[...p.cuts].map(xyz).filter(([x,y,z])=>wanted.includes(owner(x,y,z))&&
  projection.get(x,y-1,z)!==BLOCK.AIR);
 check(candidates.length>=4,'NO_GALLERY_OVERLAY_WITNESS');
 const [waterAt,pack3At,manualAt]=candidates;
 check(world.placePack2(...waterAt,76,{}),'PACK2_WATER_REFUSED');
 const pack3=createPack3RuntimeStage(world,{worldId:'underworld-peak-isolated'});
 world.pack3Runtime=pack3;
 pack3.placeMany([{at:pack3At,asset:pack3SymbolForId(116),orientation:0}]);
 const manual=createManual14Layer(world);world.manual14Layer=manual;
 const meta=MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===9);
 manual.placeMany([{at:manualAt,asset:meta.symbol,numericId:9,orientation:0,variant:'lower'}]);
 const meshes=new Map(),resident=new Map();let liveBytes=0,liveBuffers=0,peakBytes=0,peakBuffers=0,maxRead=0,cacheHits=0;
 let pack3Vertices=0,manualVertices=0,waterVertices=0,nonempty=0;
 const far=createCaveFarWallGpu(gl);
 const sample=()=>{peakBytes=Math.max(peakBytes,liveBytes);peakBuffers=Math.max(peakBuffers,liveBuffers);};
 const del=b=>{if(!b)return;gl.deleteBuffer(b.handle);liveBytes-=b.bytes;liveBuffers--;};
 const release=r=>{if(r){del(r.opaque);del(r.water);}};
 function upload(a){
  const handle=uploadChunkBuffer(gl,a),bytes=a.byteLength;
  gl.bindBuffer(gl.ARRAY_BUFFER,handle);
  check(gl.getBufferParameter(gl.ARRAY_BUFFER,gl.BUFFER_SIZE)===bytes,'REAL_BUFFER_SIZE_MISMATCH');
  liveBytes+=bytes;liveBuffers++;sample();return {handle,bytes,vertices:a.length/9};
 }
 function build(keys){
  const batch=meshReadOnlySharedBatch(world,keys);
  check(batch.ok,'SHARED_NATIVE_BATCH_REFUSED:'+batch.reason);
  maxRead=Math.max(maxRead,batch.calls);cacheHits+=batch.hits;
  const rows=[];
  for(const m of batch.meshes){
   const {cx,cz,s}=decode(m.key);
   const direct=s===0?meshChunk(world,cx,cz):meshDepthSection(world,cx,cz,s);
   check(same(direct,m.vertices),'GALLERY_NATIVE_CACHE_PARITY:'+m.key);
   const shaped=combinePack3ChunkMesh(m.vertices,pack3,cx,cz,s);
   const m14=meshManual14Chunk(manual,cx,cz,s),water=pack2WaterSectionVertices(world,cx,cz,s);
   const opaque=join(shaped,m14.opaque),transparent=join(water,m14.transparent);
   const counts={pack3:(shaped.length-m.vertices.length)/9,manual:m14.vertices,water:water.length/9,
    opaque:opaque.length/9,transparent:transparent.length/9};
   rows.push({key:m.key,opaque,transparent,counts});
  }
  return rows;
 }
 // All CPU meshes prepared before uploads. All old entries remain resident
 // until every new GPU allocation succeeds; rollback only staged handles.
 function publish(rows,{failAfter=-1}={}){
  const previous=rows.map(r=>resident.get(r.key)),staged=[];
  try{
   for(const r of rows){
    const entry={key:r.key,opaque:null,water:null};
    staged.push(entry);
    entry.opaque=upload(r.opaque);
    if(r.transparent.length)entry.water=upload(r.transparent);
    if(staged.length===failAfter)throw Error('INJECTED_STAGE_FAILURE');
   }
   check(!gl.isContextLost(),'CONTEXT_LOST');
   check(rows.every((r,i)=>resident.get(r.key)===previous[i]),'OWNER_CHANGED');
  }catch(err){for(const r of staged)release(r);throw err;}
  for(const r of staged)resident.set(r.key,r);
  for(const r of previous)release(r);
 }
 function arrive(k){
  const [r]=build([k]);meshes.set(k,r);publish([r]);
 }
 function transition(keys){
  const set=new Set(keys);far.invalidate();
  for(const [k,r] of resident)if(!set.has(k)){release(r);resident.delete(k);}
  for(const k of keys)if(!resident.has(k))arrive(k);
 }
 const stagedKeys=verticalEditSections(-36).flatMap(s=>editAffectedChunks(-625,-2160)
  .map(v=>depthMeshKey(v.cx,v.cz,s))).filter(k=>wanted.includes(k));
 // Multi-cell dirty-key union is computed once. This adjacent edit pair
 // deliberately shares the six-section bound. Arbitrary batches still HOLD.
 const multi=[...new Set([[-625,-36,-2160],[-625,-35,-2160]].flatMap(([x,y,z])=>
  verticalEditSections(y).flatMap(s=>editAffectedChunks(x,z).map(v=>depthMeshKey(v.cx,v.cz,s)))))
 ].filter(k=>wanted.includes(k));
 let initialBytes,stageBytes,rollbackPreserved,afterTransition,farStats,authoredFarStats,drawnVertices=0;
 try{
  transition(wanted);initialBytes=liveBytes;
  for(const k of wanted){const r=meshes.get(k);pack3Vertices+=r.counts.pack3;manualVertices+=r.counts.manual;waterVertices+=r.counts.water;if(r.counts.opaque)nonempty++;}
  check(pack3Vertices>0&&manualVertices>0&&waterVertices>0&&nonempty>0,'MISSING_OVERLAY_MESH');
  const old=new Map(resident),oldBytes=liveBytes;
  const staged=build(multi);
  try{publish(staged,{failAfter:2});throw Error('FAILURE_NOT_INJECTED');}
  catch(e){check(e.message==='INJECTED_STAGE_FAILURE','UNEXPECTED_ROLLBACK:'+e.message);}
  rollbackPreserved=liveBytes===oldBytes&&[...old].every(([k,r])=>resident.get(k)===r);
  check(rollbackPreserved,'ROLLBACK_OWNER_LOSS');
  publish(staged);stageBytes=liveBytes;
  const point=candidates[0],player={x:point[0]+.5,z:point[2]+.5,feet:point[1],yaw:0,pitch:0};
  // Use the exact peak owner camera center for far planner's near-window identity.
  player.x=-40*16+8;player.z=-135*16+8;player.feet=sectionBounds(-3).minY+8;
  for(let frame=0;frame<5;frame++)far.step({world,player,nearChunks:resident,nearPending:new Map(),frame,viewport:[844,390],enabled:true});
  farStats=far.stats();
  check(farStats.chunks<=4&&farStats.bytes<=1048576,'FAR_GPU_LIMIT');
  // Original native far-wall source fixture separate from the remote gallery.
  far.invalidate();
  const authoredCamera={x:204.5,z:136.5,feet:-123.99,yaw:0,pitch:0};
  const authoredKeys=engineWantedSections(chunkCoord(authoredCamera.x),chunkCoord(authoredCamera.z),sectionForY(authoredCamera.feet));
  transition(authoredKeys);
  for(let frame=0;frame<5;frame++)far.step({world,player:authoredCamera,nearChunks:resident,nearPending:new Map(),frame,viewport:[844,390],enabled:true});
  authoredFarStats=far.stats();
  transition(next);afterTransition=liveBytes;
  // Genuine GL draw through real original mesh buffer ABI (diagnostic shader,
  // NOT original main camera/material or gameplay acceptance).
  const compile=(type,code)=>{const sh=gl.createShader(type);gl.shaderSource(sh,code);gl.compileShader(sh);check(gl.getShaderParameter(sh,gl.COMPILE_STATUS),gl.getShaderInfoLog(sh));return sh;};
  const vs=compile(gl.VERTEX_SHADER,'#version 300 es\nin vec3 p; in vec3 c; out vec3 rgb; void main(){rgb=c;gl_Position=vec4((p.x+640.0)/32.0,(p.z+2160.0)/32.0,0.0,1.0);}');
  const fs=compile(gl.FRAGMENT_SHADER,'#version 300 es\nprecision mediump float; in vec3 rgb; out vec4 color; void main(){color=vec4(rgb,1.0);}');
  const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);check(gl.getProgramParameter(program,gl.LINK_STATUS),'GL_LINK');gl.useProgram(program);
  const pos=gl.getAttribLocation(program,'p'),col=gl.getAttribLocation(program,'c');
  gl.enableVertexAttribArray(pos);gl.enableVertexAttribArray(col);
  for(const r of resident.values())for(const b of [r.opaque,r.water])if(b&&b.vertices){
   gl.bindBuffer(gl.ARRAY_BUFFER,b.handle);gl.vertexAttribPointer(pos,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(col,3,gl.FLOAT,false,36,12);
   gl.drawArrays(gl.TRIANGLES,0,b.vertices);drawnVertices+=b.vertices;
  }
  gl.finish();check(gl.getError()===gl.NO_ERROR&&drawnVertices>0,'GL_DRAW');
  gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
 }finally{far.invalidate();for(const r of resident.values())release(r);resident.clear();}
 check(liveBytes===0&&liveBuffers===0,'GPU_LEAK');
 check(JSON.stringify(original.save())===p.initial,'ORIGINAL_SAVE_MUTATED');
 return {seed:179,regionCuts:p.cuts.size,sourceChecks:p.sourceChecks,fullHaloOwners:halo.length,
  fullHaloReadsPerBaseline:halo.reduce((n,r)=>n+r.reads,0),haloParity:true,
  peakFaces:wanted.reduce((n,k)=>n+(costs.get(k)?.faces??0),0),peakCuts:wanted.reduce((n,k)=>n+(costs.get(k)?.cuts??0),0),
  stagedKeys:stagedKeys.length,multiCellStageKeys:multi.length,rollbackPreserved,maxRead,cacheHits,
  nonempty,pack3Vertices,manualVertices,waterVertices,initialBytes,stageBytes,peakBytes,peakBuffers,afterTransition,
  farStats,authoredFarStats,drawnVertices,liveBytesAfterDispose:liveBytes,liveBuffersAfterDispose:liveBuffers,
  nativeMeshCacheParity:true,originalSaveUnchanged:true,projectionOnly:true,actualGpuUploadsAndDraw:true,
  mainRendererIntegrated:false,combinedFutureOverlaysQualified:false,constructionAdmission:false};
}
