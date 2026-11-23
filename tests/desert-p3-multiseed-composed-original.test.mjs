// MYTHWROUGHT Desert P3 — original-source multiseed diagonal and composed
// loaded-GPU staging audit. Genuine V7/M7 biome generator and original assets;
// no synthetic terrains, extra shader, game changes or delivery/deployment.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR as M7}
  from '../src/manual-biomes/profile-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {meshChunk,BLOCK,chunkCoord} from '../src/voxel.mjs';
import {editAffectedChunks} from '../src/chunks.mjs';
import {desertSeamEditAffectedChunks} from '../src/manual-biomes/desert-seam-invalidation.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {pack2WaterSectionVertices,pack2NormalizeState}
  from '../src/pack2-integration.mjs';
import {createPack3RuntimeStage} from '../src/builder-assets/pack3-runtime.mjs';
import {PACK3_BUILDER_SYMBOLS} from '../src/builder-assets/pack3.mjs';
import {combinePack3ChunkMesh,PACK3_MAX_ADDED_VERTICES_PER_CHUNK}
  from '../src/builder-assets/pack3-live.mjs';
import {createManual14Layer} from '../src/builder-assets/manual14-layer.mjs';
import {meshManual14Chunk,MANUAL14_VERTICES_PER_CHUNK}
  from '../src/builder-assets/manual14-mesh.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';
import {verticalEditSections,depthMeshKey} from '../src/depth.mjs';
import {validateChunkUploadBytes,MAX_CHUNK_UPLOAD_BYTES}
  from '../src/gpu-recovery.mjs';

const NEW_SEEDS=[41,103,241,397,701,1151,2039,4099];
const CX_MIN=-88,CX_MAX=88;
const OFFSETS=Object.freeze([
  {sx:-2,sz:-2,tx:0,tz:0,dir:'NW-SE'},
  {sx:1,sz:-2,tx:-1,tz:0,dir:'NE-SW'},
  {sx:-2,sz:1,tx:0,tz:-1,dir:'SW-NE'},
  {sx:1,sz:1,tx:-1,tz:-1,dir:'SE-NW'}
]);
const report={seeds:NEW_SEEDS,cx:[CX_MIN,CX_MAX],climatePairs:0,
 originalPlanPairs:0,validOppositeCapPairs:0,
 protectedSourcePairs:0,actualDiagonalMeshes:0,
 confirmedDiagonalRgbEdits:0,verifiedNoChange:0,witnesses:[],
 perSeed:[]};
function capAt(world,cache,x,z){
 const key=x+','+z;
 if(cache.has(key))return cache.get(key);
 const p=world._columnPlan(x,z);
 let cap=null;
 if(p.size){
  const y=Math.max(...p.keys());
  cap={y,id:p.get(y)};
 }
 cache.set(key,cap);return cap;
}
function diagonalPair(source,target,sourceBiome,targetBiome) {
 const desertSource=source.id===258&&target.id===401;
 const screeSource=source.id===401&&target.id===258;
 if(!desertSource&&!screeSource)return false;
 if(Math.abs(source.y-target.y)>1)return false;
 if(desertSource)return sourceBiome?.name==='desert'&&sourceBiome.weight<=.5&&
  (targetBiome?.name==='desert'||targetBiome?.name==='mountain'&&targetBiome.weight<=.55);
 return targetBiome?.name==='desert'&&targetBiome.weight<=.5&&
  (sourceBiome?.name==='desert'||sourceBiome?.name==='mountain'&&sourceBiome.weight<=.55);
}
function compareNeighbor(a,b,source) {
 assert.equal(a.length,b.length,'Diagonal foreign block may not change recipient vertex count');
 let rgb=0,max=0;
 for(let i=0;i<a.length;i+=9){
  for(const j of [0,1,2,6,7,8])
   assert.equal(a[i+j],b[i+j],
    'Actual neighboring RGB change must preserve XYZ/UV/material and GPU layout');
  for(const j of [3,4,5]){
   const d=Math.abs(a[i+j]-b[i+j]);max=Math.max(d,max);
  }
  if(a[i+3]!==b[i+3]||a[i+4]!==b[i+4]||a[i+5]!==b[i+5]){
   rgb++;assert.ok(a[i+8]===40||a[i+8]===42);
  }
 }
 assert.ok(max<=.18,'Source RGB warmth remains bounded');
 return {rgb,max,source};
}
function concat9(a,b) {
 assert.equal(a.length%9,0);assert.equal(b.length%9,0);
 if(!b.length)return a;
 const combined=new Float32Array(a.length+b.length);
 combined.set(a);combined.set(b,a.length);return combined;
}

test('multiseed authentic M7 Desert/Mountain diagonal contact census and actual original mesh edit probes',()=>{
 // Direct original biome-selection search. Only source-backed candidates
 // reach _columnPlan, then only height-matched authentic 258/401 caps
 // justify a real diagonal original mesh rebuild.
 const MAX_MESHES=48;
 const MAX_PLAN_PAIRS=700;
 for(const seed of NEW_SEEDS){
  const w=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
  const sourceCaps=new Map(),recipientBaseline=new Map();
  const local={seed,climatePairs:0,planned:0,capMatches:0,
    veto:0,remeshed:0,rgbPositive:0};
  let firstContact=null;
  for(let cz=CX_MIN;cz<=CX_MAX;cz++)for(let cx=CX_MIN;cx<=CX_MAX;cx++){
   const vx=cx*16,vz=cz*16;
   for(const p of OFFSETS){
    const sx=vx+p.sx,sz=vz+p.sz,tx=vx+p.tx,tz=vz+p.tz;
    const rs=v6BiomeAt(sx,sz,seed),rt=v6BiomeAt(tx,tz,seed);
    // Original shape/biome pair must be a genuine Desert/Mountain seam.
    if(!((rs?.name==='desert'&&rt?.name==='mountain')||
         (rs?.name==='mountain'&&rt?.name==='desert')))continue;
    local.climatePairs++;report.climatePairs++;
    // Sample across the entire geography without overtaxing any original
    // cave/landmark source planners; fixed deterministic 1-in-5 filter.
    if((Math.abs(cx*19+cz*31+seed+p.sx*7+p.sz*11)%5)!==0)continue;
    if(report.originalPlanPairs>=MAX_PLAN_PAIRS||local.planned>=90)continue;
    const a=capAt(w,sourceCaps,sx,sz),b=capAt(w,sourceCaps,tx,tz);
    local.planned++;report.originalPlanPairs++;
    if(!a||!b){local.veto++;report.protectedSourcePairs++;continue;}
    if(!diagonalPair(a,b,rs,rt))continue;
    local.capMatches++;report.validOppositeCapPairs++;
    const sourceChunk=[chunkCoord(sx),chunkCoord(sz)];
    const targetChunk=[chunkCoord(tx),chunkCoord(tz)];
    assert.ok(sourceChunk[0]!==targetChunk[0]&&sourceChunk[1]!==targetChunk[1]);
    const oldGeom=editAffectedChunks(sx,sz);
    const visual=desertSeamEditAffectedChunks(w,sx,sz,a.y);
    assert.ok(visual.some(({cx,cz})=>cx===targetChunk[0]&&cz===targetChunk[1]),
     'Source-backed diagonal tint must require recipient refresh');
    assert.ok(!oldGeom.some(({cx,cz})=>cx===targetChunk[0]&&cz===targetChunk[1]),
     'Original one-block geometry refresh must miss this non-edge diagonal');
    firstContact??={source:[sx,a.y,sz,a.id],recipient:targetChunk,
     orient:p.dir};
    if(report.actualDiagonalMeshes>=MAX_MESHES)continue;
    const key=targetChunk.join(',');
    let before=recipientBaseline.get(key);
    if(!before){before=meshChunk(w,...targetChunk);recipientBaseline.set(key,before);}
    assert.equal(w.get(sx,a.y,sz),a.id);
    assert.ok(w.set(sx,a.y,sz,BLOCK.AIR));
    const after=meshChunk(w,...targetChunk);
    const metrics=compareNeighbor(before,after,[sx,a.y,sz]);
    assert.ok(w.set(sx,a.y,sz,a.id));
    assert.deepEqual(w.save().edits,[],'No persistent edits in research census');
    local.remeshed++;report.actualDiagonalMeshes++;
    if(metrics.rgb){
      local.rgbPositive++;report.confirmedDiagonalRgbEdits++;
      if(report.witnesses.length<12)report.witnesses.push({
        seed,source:[sx,a.y,sz,a.id],target:targetChunk,
        sourceBiome:rs?.name,recipientBiome:rt?.name,
        contactTop:b.y,changedRgbVertices:metrics.rgb,maxDelta:metrics.max
      });
    }else report.verifiedNoChange++;
   }
  }
  report.perSeed.push({...local,firstContact});
  assert.ok(w.cachedBiomeColumns<=1024);
  assert.deepEqual(w.save().edits,[]);
 }
 assert.ok(report.climatePairs>0,'Multiple original landscapes must exhibit Desert/Mountain climate edges');
 assert.ok(report.originalPlanPairs>0,'Must inspect actual guarded original source columns');
 assert.ok(report.perSeed.filter(row=>row.planned>0).length>=3,
  'Source audit should cover at least three NEW seeds, not one region');
 console.log('DESERT_P3_MULTISEED_DIAGONAL '+JSON.stringify(report));
});

// This is a READ-ONLY composer built from the same ACTUAL original exported
// game functions, not a hypothetical vertex multiplier. It deliberately
// excludes any asynchronous browser upload and never accesses saved storage.
function exactComposedBatch({world,pack3,manual,loaded,at}){
 const [x,y,z]=at,affected=desertSeamEditAffectedChunks(world,x,z,y);
 const rows=[];let opaque=0,transparent=0;
 const sections=verticalEditSections(y);
 for(const section of sections)for(const {cx,cz} of affected){
  const key=depthMeshKey(cx,cz,section);
  if(!loaded.has(key))continue;
  assert.equal(section,0,'Only authentic surface source caps are requested here');
  const original=meshChunk(world,cx,cz);
  const afterPack3=combinePack3ChunkMesh(original,pack3,cx,cz,section);
  const fourteen=meshManual14Chunk(manual,cx,cz,section);
  const solid=concat9(afterPack3,fourteen.opaque);
  const water=concat9(pack2WaterSectionVertices(world,cx,cz,section),
    fourteen.transparent);
  validateChunkUploadBytes(solid);
  if(water.length)validateChunkUploadBytes(water);
  rows.push({key,originalBytes:original.byteLength,
    composedOpaqueBytes:solid.byteLength,
    waterBytes:water.byteLength,
    manualOpaqueBytes:fourteen.opaque.byteLength,
    manualTransparentBytes:fourteen.transparent.byteLength,
    addedPack3Bytes:afterPack3.byteLength-original.byteLength,
    totalStageBytes:solid.byteLength+water.byteLength});
  opaque+=solid.byteLength;transparent+=water.byteLength;
 }
 return {affected:affected.map(({cx,cz})=>depthMeshKey(cx,cz,0)),
  loadedRows:rows,loadedCount:rows.length,
  opaqueBytes:opaque,transparentBytes:transparent,
  combinedBytes:opaque+transparent,
  // For one live edit, old buffers remain resident while the newly
  // composed replacement bytes are staged. This count excludes all other
  // resident chunks and may overstate/understate GPU driver allocation.
  overlappingOldAndNewBytesUpperBound:2*(opaque+transparent)};
}
test('source-exact composed M7 edit staging with real Pack2 water, Pack3 original geometry and manual14 pipeline',()=>{
 const main=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
 for(const token of [
  "const pack3Mesh=combinePack3ChunkMesh(original,pack3.runtime,cx,cz,section)",
  "return combineVertices(pack3Mesh,manual14AtChunk(cx,cz,section).opaque)",
  "return combineVertices(pack2WaterSectionVertices(world,cx,cz,section),",
  "manual14AtChunk(cx,cz,section).transparent)",
  "const affected=desertSeamEditAffectedChunks(world,x,z,y);"
 ])assert.ok(main.includes(token),'Exact original game composer must still use '+token);
 const seed=179,base=new FourRegionWorld(seed,fourRegionProfile(seed,M7));
 const world=new Pack2LiveWorld(base);
 const pack3=createPack3RuntimeStage(world,{worldId:'desert-p3-readonly-composed-budget'});
 world.pack3Runtime=pack3;
 const manual=createManual14Layer(world);
 world.manual14Layer=manual;
 const source=[-786,4,-1774];
 assert.equal(world.get(...source),401);
 let separateWater=null,pack3Asset=null;
 // Actual M7 air cells from the source are required. All overlays are
 // disposable in-memory original-engine sidecars, never persisted.
 const candidates=[[-785,16,-1773],[-786,16,-1773],[-787,16,-1774],
  [-783,16,-1772],[-784,17,-1771],[-786,18,-1772],[-786,19,-1773]];
 for(const at of candidates){
  if(world.get(...at)!==BLOCK.AIR)continue;
  if(!pack3Asset){
   try{pack3.placeMany([{at,asset:PACK3_BUILDER_SYMBOLS[0],orientation:'north'}]);
    pack3Asset=at;continue;}catch(e){throw Error('Original Pack3 real asset rejected: '+e.message);}
  }
  if(!separateWater&&at.join(',')!==pack3Asset.join(',')){
   assert.ok(world.set(...at,76));
   separateWater=at;
   break;
  }
 }
 assert.ok(pack3Asset,'Real original Pack3 candidate must stage authored geometry');
 assert.ok(separateWater,'Real original Pack2 fluid geometry must stage');
 assert.equal(world.get(...separateWater),76);
 assert.ok(pack3.size()>0);
 assert.equal(pack3.chunkMesh(chunkCoord(pack3Asset[0]),chunkCoord(pack3Asset[2]),0).length>0,true);
 assert.equal(manual.size(),0,'No artificial Manual14 assets added');
 assert.equal(PACK3_MAX_ADDED_VERTICES_PER_CHUNK,12000);
 assert.equal(MANUAL14_VERTICES_PER_CHUNK,12000);
 const selected=desertSeamEditAffectedChunks(world,...source);
 const loaded=new Set(selected.map(({cx,cz})=>depthMeshKey(cx,cz,0)));
 const full=exactComposedBatch({world,pack3,manual,loaded,at:source});
 assert.equal(full.loadedRows.length,selected.length);
 assert.ok(full.loadedRows.some(row=>row.addedPack3Bytes>0),
  'At least one genuine Pack3 physical asset must be included');
 assert.ok(full.loadedRows.some(row=>row.waterBytes>0),
  'At least one real Pack2 water sidecar must produce separate GPU data');
 let reducedLoaded=new Set([...loaded].slice(0,-1));
 const partial=exactComposedBatch({world,pack3,manual,loaded:reducedLoaded,at:source});
 assert.equal(partial.loadedCount,selected.length-1);
 for(const row of partial.loadedRows)
  assert.deepEqual(row,full.loadedRows.find(x=>x.key===row.key));
 assert.ok(full.combinedBytes<MAX_CHUNK_UPLOAD_BYTES*5);
 assert.equal(full.combinedBytes,full.opaqueBytes+full.transparentBytes);
 assert.equal(full.overlappingOldAndNewBytesUpperBound,full.combinedBytes*2);
 // Authored overlay selection is read-only from original source schema1.
 assert.deepEqual(base.save().edits,[]);
 console.log('DESERT_P3_REAL_COMPOSED_GPU_BUDGET '+JSON.stringify({
  source,pack3Asset,waterCell:separateWater,
  sourcePlan:full.affected,
  realOpaqueWaterAndPack3Rows:full.loadedRows,
  composedUploadBytes:full.combinedBytes,
  temporaryOldPlusNewUpperBoundBytes:full.overlappingOldAndNewBytesUpperBound,
  partialResidentUploadBytes:partial.combinedBytes,
  maxPerChunkBytes:MAX_CHUNK_UPLOAD_BYTES,
  manual14OriginalEmptyPipeline:true,
  caveat:'No manual14 placed objects, no GPU driver or physical iPhone timing'
 }));
});
