// NEW focused authentic two-checkout test: immutable original Desert P3
// terrain + original Pack2 water / Pack3 / Manual14 CPU meshes are uploaded
// only into a strictly synthetic fake GL using exact source upload helper.
// NEVER create actual WebGL buffers or open any existing user saved world.
import test from 'node:test';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
import {surveyMountainV8Column,mountainV8TileRoot}
  from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
import {auditMountainV8P3Uplift}
  from '../src/manual-biomes/mountain-v8-p3-uplift-and-halo-audit.mjs';
import {planMountainV8ResearchMeshBatch}
  from '../src/manual-biomes/mountain-v8-p3-mesh-batch-rollback-research.mjs';
import {stageMountainV8MockGpuTransaction}
  from '../src/manual-biomes/mountain-v8-p3-mock-gpu-transaction-research.mjs';
import {GpuUploadRetry,uploadChunkBuffer,MAX_CHUNK_UPLOAD_BYTES}
  from '../src/gpu-recovery.mjs';
const root=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!root)throw Error('Exact pinned current-main original source checkout required');
const current=rel=>import(pathToFileURL(path.join(root,rel)).href);
const [{VoxelWorld,BLOCK,terrainHeight,meshChunk,worldKey},
  {WORLD_MAX_Y},
  {v6BiomeAt},
  {meshDepthSection},
  {pack2NormalizeState,pack2WaterSectionVertices},
  {combinePack3ChunkMesh},
  {createPack3RuntimeStage},
  {PACK3_BUILDER_SYMBOLS},
  {meshManual14Chunk},
  {MANUAL_FIVE_PACK_CATALOG},
  {uploadChunkBuffer:mainUploader,MAX_CHUNK_UPLOAD_BYTES:mainMax}]
  =await Promise.all([
    current('src/voxel.mjs'),current('src/depth.mjs'),
    current('src/manual-biomes/v6-balanced-biomes.mjs'),
    current('src/depth-mesh.mjs'),
    current('src/pack2-integration.mjs'),
    current('src/builder-assets/pack3-live.mjs'),
    current('src/builder-assets/pack3-runtime.mjs'),
    current('src/builder-assets/pack3.mjs'),
    current('src/builder-assets/manual14-mesh.mjs'),
    current('src/builder-assets/manual-five-pack.mjs'),
    current('src/gpu-recovery.mjs')
  ]);
const seed=179,world=new VoxelWorld(seed);
function originalProofs(){
  const result=[],chunks=new Set();
  for(let tz=24;tz<32;tz++)for(let tx=-88;tx<-80;tx++){
    const {rootX:x,rootZ:z}=mountainV8TileRoot(tx,tz,seed);
    const proposal=surveyMountainV8Column({x,z,seed,
      worldMaxY:WORLD_MAX_Y,ids:BLOCK,biomeAt:v6BiomeAt,
      heightAt:terrainHeight,
      readBlock:(a,b,c)=>world.naturalAndLandmarkBlock(a,b,c),
      protectedAt:(a,b,c)=>world.edits.has(worldKey(a,b,c))});
    if(!proposal)continue;
    const proof=auditMountainV8P3Uplift(proposal,{
      originalWorld:world,originalVoxelReaderIdentityVerified:true,
      sourceMainHead:'db4bbcc32156e5df311f733bcaa53d559c17313b'});
    if(proof&&!chunks.has(proof.geometryMeshKeys[0])){
      result.push(proof);chunks.add(proof.geometryMeshKeys[0]);
      if(result.length===2)return result;
    }
  }
  throw Error('No two authentic source Mountain proof chunks');
}
const proofs=originalProofs();
const originals=new Map(proofs.flatMap(p=>p.geometryMeshKeys)
  .map((key,i)=>[key,Object.freeze({
    buffer:Object.freeze({original:true,kind:'opaque',i}),
    waterBuffer:Object.freeze({original:true,kind:'water',i}),
    count:123,waterCount:42})]));
const plan=planMountainV8ResearchMeshBatch(proofs,originals);
const where=[proofs[0].x,19,proofs[0].z];
const p3world={seed,edits:new Map(),get:()=>BLOCK.AIR};
const pack3=createPack3RuntimeStage(p3world);
pack3.placeMany([{at:where,asset:PACK3_BUILDER_SYMBOLS[0],orientation:'north'}]);
const pack4=MANUAL_FIVE_PACK_CATALOG.find(x=>x.pack===4&&x.numericId===160);
const pack4Layer={entries:()=>[{
  at:[where[0]+1,where[1],where[2]],asset:pack4.symbol,
  numericId:pack4.numericId,sourcePack:4,orientation:0,variant:null}]};
const fluidState=pack2NormalizeState(76,{level:3,flow:'still'});
const fluid={pack2Cells:new Map([[[where[0],where[1],where[2]+1].join(','),
  {...fluidState,id:76}]])};
const pack=(a,b)=>{
  if(!b.length)return a;
  const out=new Float32Array(a.length+b.length);
  out.set(a);out.set(b,a.length);return out;
};
const cpu=plan.loaded.map(item=>{
  const base=item.section===0?meshChunk(world,item.cx,item.cz):
    meshDepthSection(world,item.cx,item.cz,item.section);
  const overlay=combinePack3ChunkMesh(base,pack3,item.cx,item.cz,item.section);
  const m14=meshManual14Chunk(pack4Layer,item.cx,item.cz,item.section);
  const water=pack2WaterSectionVertices(fluid,item.cx,item.cz,item.section);
  return Object.freeze({key:item.key,opaque:pack(overlay,m14.opaque),
    transparent:pack(water,m14.transparent)});
});
assert.ok(cpu.some(x=>x.transparent.length>0),'Genuine Pack2 water source required');
assert.ok(cpu.length>=2,'Real two-source-chunk transaction required');
const originalSave=JSON.stringify(world.save()),pack3Bytes=pack3.serialize();
const oldEntries=[...originals];

function driver({failureOnUpload=0,loseAfterUpload=0,mutateAfterUpload=null,
  failDelete=false,wrongMockFlag=false}={}){
  let sequence=0,uploadCount=0,lost=false,lastError=0;
  const made=[],deleted=[],uploaded=[];
  return {
    mountainV8SyntheticDriver:!wrongMockFlag,
    NO_ERROR:0,OUT_OF_MEMORY:1285,ARRAY_BUFFER:34962,STATIC_DRAW:35044,
    isContextLost:()=>lost,
    createBuffer(){const handle={kind:'new-v8-synthetic',id:++sequence};
      made.push(handle);return handle;},
    bindBuffer(target,buffer){this.bound=buffer;},
    bufferData(target,data,usage){
      uploadCount++;uploaded.push({handle:this.bound,byteLength:data.byteLength});
      if(failureOnUpload===uploadCount)lastError=1285;
      if(loseAfterUpload===uploadCount)lost=true;
      if(mutateAfterUpload)mutateAfterUpload(uploadCount);
    },
    getError(){const e=lastError;lastError=0;return e;},
    deleteBuffer(buffer){if(failDelete)throw Error('Synthetic GL cleanup failed');
      if(!made.includes(buffer))throw Error('Tried to delete original buffer');
      deleted.push(buffer);},
    get made(){return made;},
    get deleted(){return deleted;},
    get uploaded(){return uploaded;},
    get uploadCount(){return uploadCount;}
  };
}
const guard=(gl,overrides={})=>stageMountainV8MockGpuTransaction(plan,originals,{
  mockGl:gl,sourceCpuBuffers:cpu,
  readOwnershipToken:()=> 'source-179:pack2-76:pack3:manual14',
  originalOwnershipToken:'source-179:pack2-76:pack3:manual14',
  retry:new GpuUploadRetry(),now:5000,...overrides});
const denied=r=>{
  assert.equal(r.safeToIntegrate,false);
  assert.equal(r.runtimeActivationAuthorized,false);
  assert.equal(r.realWebGL2Used,false);
  assert.equal(r.savedWorldWritten,false);
  assert.equal(r.originalSidecarsWritten,false);
  assert.equal(r.liveChunkMapMutated,false);
  assert.equal(r.originalM7RgbHaloInherited,false);
  assert.equal(r.registeredV8MaterialIds,0);
};
const intact=()=>{
  assert.deepEqual([...originals],oldEntries);
  assert.equal(JSON.stringify(world.save()),originalSave);
  assert.equal(pack3.serialize(),pack3Bytes);
};

test('source real production GPU helper matches detached original helper exactly',()=>{
  assert.equal(mainMax,MAX_CHUNK_UPLOAD_BYTES);
  assert.equal(mainMax,8*1024*1024);
  assert.equal(mainUploader.toString(),uploadChunkBuffer.toString());
  intact();
});
test('genuine original terrain, Pack3, Manual14 and water stage into MOCK buffers only',()=>{
  const gl=driver(),r=guard(gl);
  assert.equal(r.status,'synthetic-gpu-preview-only');
  assert.equal(r.stagedChunkCount,plan.loaded.length);
  assert.equal(r.projectedChunks.size,originals.size);
  assert.ok(r.stagedHandleCount>=3);
  assert.ok(r.bytesPlanned>0&&r.bytesPlanned<=16*1024*1024);
  assert.ok(gl.uploaded.some(x=>x.byteLength>0));
  for(const item of r.stages)
    assert.equal(r.projectedChunks.get(item.key).researchMockOnly,true);
  denied(r);intact();
  assert.equal(r.disposeSyntheticHandles(),r.stagedHandleCount);
  assert.equal(r.disposeSyntheticHandles(),0);
  assert.equal(gl.deleted.length,gl.made.length);
  intact();
});
test('second GPU stage fails on actual original Pack2 transparent buffer; delete ALL new handles only',()=>{
  const gl=driver({failureOnUpload:2}),r=guard(gl);
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'original-upload-helper-rejected-synthetic-stage');
  assert.equal(r.projectedChunks,null);
  assert.equal(r.cleanupComplete,true);
  assert.equal(gl.made.length,2);
  assert.equal(gl.deleted.length,2);
  assert.ok(gl.deleted.every(h=>h.kind==='new-v8-synthetic'));
  denied(r);intact();
});
test('later chunk failure rejects entire multi-chunk mock batch; first chunk is not published',()=>{
  const gl=driver({failureOnUpload:3}),r=guard(gl);
  assert.equal(r.status,'rejected');
  assert.equal(r.projectedChunks,null);
  assert.equal(gl.made.length,3);
  assert.equal(gl.deleted.length,3);
  denied(r);intact();
});
test('context loss after opaque upload rejects water and cleans staged synthetic handles',()=>{
  const gl=driver({loseAfterUpload:1}),r=guard(gl);
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'stale-original-epoch-or-lost-context');
  assert.equal(gl.uploadCount,1);
  assert.equal(gl.deleted.length,1);
  denied(r);intact();
});
test('context lost from start rejects before ANY GL candidate is created',()=>{
  const gl=driver();
  gl.isContextLost=()=>true;
  const r=guard(gl);
  assert.equal(r.reason,'stale-original-epoch-or-lost-context');
  assert.equal(gl.made.length,0);
  denied(r);intact();
});
test('sidecar or save epoch changes during first uploaded buffer abort before water',()=>{
  let token='source-179:pack2-76:pack3:manual14';
  const gl=driver({mutateAfterUpload:()=>{token='changed-in-other-tab';}});
  const r=guard(gl,{readOwnershipToken:()=>token});
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'stale-original-epoch-or-lost-context');
  assert.equal(gl.uploadCount,1);
  assert.equal(gl.deleted.length,1);
  denied(r);intact();
});
test('new newer loaded chunk identity during GPU upload aborts without deleting existing handles',()=>{
  const copied=new Map(originals),entry=copied.get(plan.loaded[0].key);
  let mutated=false;
  const gl=driver({mutateAfterUpload:n=>{
    if(n===1){copied.set(plan.loaded[0].key,{concurrent:true});mutated=true;}
  }});
  const r=stageMountainV8MockGpuTransaction(plan,copied,{
    mockGl:gl,sourceCpuBuffers:cpu,
    readOwnershipToken:()=> 'same',originalOwnershipToken:'same',
    retry:new GpuUploadRetry(),now:1});
  assert.equal(r.status,'rejected');
  assert.equal(gl.deleted.length,1);
  assert.equal(mutated,true);
  assert.equal(entry.buffer.original,true);
  assert.equal(originals.get(plan.loaded[0].key).buffer.original,true);
  denied(r);intact();
});
test('pre-existing GPU retry backoff blocks staging without GL allocation',()=>{
  const retry=new GpuUploadRetry({baseDelayMs:250,maxDelayMs:8000});
  retry.fail(plan.loaded[0].key,5000,'OOM');
  const gl=driver(),r=guard(gl,{retry,now:5100});
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'original-gpu-retry-backoff');
  assert.equal(gl.made.length,0);
  assert.equal(retry.stats().pendingRetries,1);
  denied(r);intact();
});
test('synthetic cleanup failures report UNCERTAIN and never pretend successful rollback',()=>{
  const gl=driver({failureOnUpload:2,failDelete:true}),r=guard(gl);
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'synthetic-candidate-cleanup-unverifiable');
  assert.equal(r.cleanupComplete,false);
  assert.equal(r.projectedChunks,null);
  denied(r);intact();
});
test('missing explicit synthetic driver flag rejects real-looking driver without touching GL',()=>{
  const gl=driver({wrongMockFlag:true}),r=guard(gl);
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'source-or-synthetic-driver-not-admitted');
  assert.equal(gl.made.length,0);
  denied(r);intact();
});
test('one forged water stride or 8MiB overflow is rejected before creating any mock buffers',()=>{
  for(const replacement of [new Float32Array(8),
    new Float32Array((Math.floor((8*1024*1024)/(9*4))+1)*9)]){
    const altered=cpu.map((x,i)=>i===0?{...x,transparent:replacement}:x);
    const gl=driver(),r=guard(gl,{sourceCpuBuffers:altered});
    assert.equal(r.status,'rejected');
    assert.equal(gl.made.length,0);
    denied(r);intact();
  }
});
test('synthetic research aggregate ceiling cannot exceed 16MiB and old P3 halo never inherited',()=>{
  const gl=driver();
  let r=guard(gl,{maxAggregateBytes:16*1024*1024+1});
  assert.equal(r.status,'rejected');assert.equal(gl.made.length,0);
  r=guard(gl,{maxAggregateBytes:16});
  assert.equal(r.status,'rejected');assert.equal(gl.made.length,0);
  assert.equal(r.originalM7RgbHaloInherited,false);
  denied(r);intact();
});
