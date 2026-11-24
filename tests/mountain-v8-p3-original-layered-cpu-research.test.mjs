// Exactly pinned original Desert P3 MAIN + isolated V8 branch. No user
// worlds, production WebGL, save storage, runtime activation or block IDs.
// In-memory construction fixtures exercise genuine original authoring sources.
import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {surveyMountainV8Column,mountainV8TileRoot}
  from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
import {auditMountainV8P3Uplift as uplift}
  from '../src/manual-biomes/mountain-v8-p3-uplift-and-halo-audit.mjs';
import {planMountainV8ResearchMeshBatch as plan}
  from '../src/manual-biomes/mountain-v8-p3-mesh-batch-rollback-research.mjs';
import {previewMountainV8OriginalLayeredCpu as layered}
  from '../src/manual-biomes/mountain-v8-p3-original-layered-cpu-research.mjs';

const root=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!root)throw Error('Read-only exact main source checkout REQUIRED');
const fromMain=p=>import(pathToFileURL(path.join(root,p)).href);
const [{VoxelWorld,BLOCK,terrainHeight,meshChunk,worldKey},
  {WORLD_MAX_Y,depthMeshKey},
  {v6BiomeAt},
  {meshDepthSection},
  {pack2NormalizeState,pack2WaterSectionVertices},
  {combinePack3ChunkMesh},
  {createPack3RuntimeStage},
  {PACK3_BUILDER_SYMBOLS},
  {meshManual14Chunk},
  {MANUAL_FIVE_PACK_CATALOG},
  {desertSeamEditAffectedChunks},
  {editAffectedChunks}
]=await Promise.all([
  fromMain('src/voxel.mjs'),fromMain('src/depth.mjs'),
  fromMain('src/manual-biomes/v6-balanced-biomes.mjs'),
  fromMain('src/depth-mesh.mjs'),
  fromMain('src/pack2-integration.mjs'),
  fromMain('src/builder-assets/pack3-live.mjs'),
  fromMain('src/builder-assets/pack3-runtime.mjs'),
  fromMain('src/builder-assets/pack3.mjs'),
  fromMain('src/builder-assets/manual14-mesh.mjs'),
  fromMain('src/builder-assets/manual-five-pack.mjs'),
  fromMain('src/manual-biomes/desert-seam-invalidation.mjs'),
  fromMain('src/chunks.mjs')
]);
const seed=179,world=new VoxelWorld(seed);
function realProofs(){
  const proofs=[],chunkKeys=new Set();
  for(let tz=24;tz<32;tz++)for(let tx=-88;tx<-80;tx++){
    const {rootX:x,rootZ:z}=mountainV8TileRoot(tx,tz,seed);
    const proposal=surveyMountainV8Column({
      x,z,seed,worldMaxY:WORLD_MAX_Y,
      biomeAt:v6BiomeAt,heightAt:terrainHeight,
      readBlock:(a,b,c)=>world.naturalAndLandmarkBlock(a,b,c),
      protectedAt:(a,b,c)=>world.edits.has(worldKey(a,b,c)),ids:BLOCK
    });
    if(!proposal)continue;
    const proof=uplift(proposal,{originalWorld:world,
      originalVoxelReaderIdentityVerified:true,
      sourceMainHead:'db4bbcc32156e5df311f733bcaa53d559c17313b'});
    if(proof&&!chunkKeys.has(proof.geometryMeshKeys[0])){
      proofs.push(proof);chunkKeys.add(proof.geometryMeshKeys[0]);
      if(proofs.length===2)return proofs;
    }
  }
  throw Error('No two different current-main original mountain source chunks');
}
const proofs=realProofs();
const loaded=new Map(proofs.flatMap(p=>p.geometryMeshKeys).map(
  (k,i)=>[k,Object.freeze({originalShownGpuHandle:'source-fixture-'+i})]));
const batch=plan(proofs,loaded);
const p=proofs[0],where=[p.x,19,p.z];
const physicalHost={seed,edits:new Map(),get:()=>BLOCK.AIR};
const runtime=createPack3RuntimeStage(physicalHost);
runtime.placeMany([{at:where,asset:PACK3_BUILDER_SYMBOLS[0],orientation:'north'}]);
const pack4=MANUAL_FIVE_PACK_CATALOG.find(row=>row.numericId===160);
assert.ok(pack4&&pack4.pack===4);
const manualEntry={at:[p.x,19,p.z+1],asset:pack4.symbol,
  numericId:pack4.numericId,sourcePack:4,orientation:0,variant:null};
const manualLayer=Object.freeze({entries:()=>[manualEntry]});
const fluidAt=[p.x,19,p.z+2],state=pack2NormalizeState(76,{level:3,flow:'still'});
const waterKey=fluidAt.join(',');
const waterFixture={pack2Cells:new Map([[waterKey,{...state,id:76}]])};
const sourceBuilders=Object.freeze({
  world,pack3Runtime:runtime,manual14Layer:manualLayer,
  surfaceMesh:meshChunk,depthMesh:meshDepthSection,
  combinePack3:combinePack3ChunkMesh,
  pack2Water:(source,cx,cz,section)=>pack2WaterSectionVertices(waterFixture,cx,cz,section),
  manual14Mesh:meshManual14Chunk
});
const noWrites=result=>{
  assert.equal(result.safeToIntegrate,false);
  assert.equal(result.realGpuBufferAllocated,false);
  assert.equal(result.originalWorldWritten,false);
  assert.equal(result.originalSidecarsWritten,false);
  assert.equal(result.originalLoadedMapWritten,false);
  assert.equal(result.oldM7P3HaloInherited,false);
  assert.equal(result.newV8IdsRegistered,0);
  assert.equal(result.runtimeActivationAuthorized,false);
};
const hash=txt=>createHash('sha256').update(txt).digest('hex');

test('authentic original source Pack3 + Pack4 + Pack2 water are each represented in CPU layers',()=>{
  assert.equal(runtime.size(),1);
  assert.equal(pack4.numericId,160);
  const snap=JSON.stringify(world.save()),beforeLoaded=[...loaded];
  const r=layered(batch,loaded,sourceBuilders);
  assert.equal(r.status,'source-layered-cpu-preview');
  noWrites(r);
  assert.equal(r.projectedStageCount,batch.loaded.length);
  assert.equal(r.sourceStages.length,batch.loaded.length);
  assert.equal(r.pack2WaterPassPreserved,true);
  assert.equal(r.pack3AndManual14OrderingPreserved,true);
  const sourceChunk=depthMeshKey(Math.floor(p.x/16),Math.floor(p.z/16),0);
  const entry=r.sourceStages.find(x=>x.key===sourceChunk);
  assert.ok(entry&&entry.baseBytes>0);
  assert.ok(entry.pack3AddedBytes>0);
  assert.ok(entry.manualOpaqueBytes+entry.manualTransparentBytes>0);
  assert.ok(entry.pack2WaterBytes>0);
  assert.equal(entry.opaqueBytes,entry.baseBytes+
    entry.pack3AddedBytes+entry.manualOpaqueBytes);
  assert.equal(entry.waterBytes,entry.pack2WaterBytes+entry.manualTransparentBytes);
  assert.equal(JSON.stringify(world.save()),snap);
  assert.deepEqual([...loaded],beforeLoaded);
});
test('genuine source transparent water never gets silently combined into the opaque pass',()=>{
  const cx=Math.floor(p.x/16),cz=Math.floor(p.z/16);
  const water=pack2WaterSectionVertices(waterFixture,cx,cz,0);
  assert.ok(water.length>=27&&water.length%9===0);
  assert.ok(Array.from({length:water.length/9},(_,i)=>water[i*9+8])
    .every(material=>material>20&&material<21));
  const r=layered(batch,loaded,sourceBuilders);
  const row=r.sourceStages.find(x=>x.key===depthMeshKey(cx,cz,0));
  assert.ok(row.waterBytes>0);
  assert.ok(row.opaqueBytes>row.baseBytes);
  noWrites(r);
});
test('original manual Pack4 physical mesh and Pack3 meshes retain original authored source ABI',()=>{
  const cx=Math.floor(p.x/16),cz=Math.floor(p.z/16);
  const src=meshManual14Chunk(manualLayer,cx,cz,0);
  assert.equal(src.authoringSource,'original-Pack1-pixels-and-Pack4-material-meshes');
  assert.equal(src.instances,1);
  assert.ok((src.opaque.length+src.transparent.length)>0);
  const base=meshChunk(world,cx,cz);
  const with3=combinePack3ChunkMesh(base,runtime,cx,cz,0);
  assert.ok(with3.length>base.length);
  assert.deepEqual(with3.subarray(0,base.length),base);
  const result=layered(batch,loaded,sourceBuilders);
  assert.equal(result.status,'source-layered-cpu-preview');
});
test('source-only loaded/unloaded chunk distinction leaves other deep sections untouched',()=>{
  const old=new Map([[batch.loaded[0].key,loaded.get(batch.loaded[0].key)]]);
  const narrowed=plan(proofs,old),r=layered(narrowed,old,sourceBuilders);
  assert.equal(r.status,'source-layered-cpu-preview');
  assert.equal(r.sourceStages.length,1);
  assert.ok(narrowed.unloaded.length>=1);
  assert.equal(r.projectedChunks.size,old.size);
  assert.deepEqual([...old].map(x=>x[0]),[batch.loaded[0].key]);
  noWrites(r);
});
test('pack2 water source builder failure on second loaded mesh refuses full CPU preview',()=>{
  const old=[...loaded],save=JSON.stringify(world.save());let n=0;
  const r=layered(batch,loaded,{...sourceBuilders,
    pack2Water:(...args)=>{n++;if(n===2)throw Error('source water failure');
      return sourceBuilders.pack2Water(...args);}});
  assert.equal(r.status,'rejected');
  assert.equal(r.projectedChunks,null);
  assert.equal(n,2);
  assert.deepEqual([...loaded],old);
  assert.equal(JSON.stringify(world.save()),save);
  noWrites(r);
});
test('Pack3 composition source error and Manual14 source error reject without any old chunk publication',()=>{
  for(const func of ['combinePack3','manual14Mesh']){
    const original=[...loaded];
    const r=layered(batch,loaded,{...sourceBuilders,
      [func]:()=>{throw Error('injected owner source failure');}});
    assert.equal(r.status,'rejected',func);
    assert.deepEqual([...loaded],original);
    noWrites(r);
  }
});
test('invalid independent opaque or transparent source geometry never bypasses 9-float contract',()=>{
  for(const name of ['surfaceMesh','pack2Water','manual14Mesh']){
    let bad;
    if(name==='manual14Mesh')
      bad=()=>({opaque:new Float32Array(8),transparent:new Float32Array(0)});
    else bad=()=>new Float32Array(8);
    const r=layered(batch,loaded,{...sourceBuilders,[name]:bad});
    assert.equal(r.status,'rejected',name);
    noWrites(r);
  }
});
test('source-owned manual opacity layer or fluid buffer exceeding 8MiB refuses whole preview',()=>{
  const overflowing=new Float32Array((Math.floor((8*1024*1024)/(9*4))+1)*9);
  for(const name of ['surfaceMesh','pack2Water']){
    const before=[...loaded];
    const r=layered(batch,loaded,{...sourceBuilders,[name]:()=>overflowing});
    assert.equal(r.status,'rejected',name);
    assert.deepEqual([...loaded],before);
    noWrites(r);
  }
});
test('too-small aggregate stage limit preserves all old shown buffers and no preview',()=>{
  const r=layered(batch,loaded,{...sourceBuilders,limitBytes:40});
  assert.equal(r.status,'rejected');
  assert.equal(r.projectedChunks,null);
  noWrites(r);
});
test('current original M7 P3 RGB-only extra chunk remains outside all V8 layer previews',async()=>{
  const {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}=
    await fromMain('src/manual-biomes/profile-world.mjs');
  const m7=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
  const rgb=desertSeamEditAffectedChunks(m7,-786,-1774,4);
  const geometry=editAffectedChunks(-786,-1774);
  assert.ok(rgb.length>geometry.length);
  assert.ok(rgb.some(x=>x.cx===-50&&x.cz===-112));
  const r=layered(batch,loaded,sourceBuilders);
  assert.equal(r.oldM7P3HaloInherited,false);
  assert.equal(r.status,'source-layered-cpu-preview');
});
test('actual original schema1 saved bytes and original construction source fixture identities are preserved',()=>{
  const save=JSON.stringify(world.save()),pack3=runtime.serialize();
  const p2=JSON.stringify([...waterFixture.pack2Cells]),pack4before=JSON.stringify(manualEntry);
  const oldLoaded=[...loaded],r=layered(batch,loaded,sourceBuilders);
  assert.equal(r.status,'source-layered-cpu-preview');
  assert.equal(JSON.stringify(world.save()),save);
  assert.equal(runtime.serialize(),pack3);
  assert.equal(JSON.stringify([...waterFixture.pack2Cells]),p2);
  assert.equal(JSON.stringify(manualEntry),pack4before);
  assert.deepEqual([...loaded],oldLoaded);
  assert.equal(hash(save),hash(JSON.stringify(world.save())));
  noWrites(r);
});
