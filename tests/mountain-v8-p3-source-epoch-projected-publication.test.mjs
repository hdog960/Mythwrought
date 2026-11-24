// ORIGINAL source + exact pinned read-only Desert P3 main dual checkout.
// A shadow renderer/epoch study only: new IN-MEMORY original world fixtures,
// synthetic GPU handles, no actual GL, localStorage, IndexedDB, merge or IDs.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {surveyMountainV8Column,mountainV8TileRoot}
  from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
import {auditMountainV8P3Uplift}
  from '../src/manual-biomes/mountain-v8-p3-uplift-and-halo-audit.mjs';
import {planMountainV8ResearchMeshBatch}
  from '../src/manual-biomes/mountain-v8-p3-mesh-batch-rollback-research.mjs';
import {stageMountainV8MockGpuTransaction}
  from '../src/manual-biomes/mountain-v8-p3-mock-gpu-transaction-research.mjs';
import {GpuUploadRetry} from '../src/gpu-recovery.mjs';
import {readMountainV8DetachedOriginalEpoch as ledger,
  previewMountainV8DetachedPublication as preview}
  from '../src/manual-biomes/mountain-v8-p3-source-epoch-projected-publication.mjs';
const root=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!root)throw Error('Immutable exact current-main source checkout required');
const fromMain=p=>import(pathToFileURL(path.join(root,p)).href);
const [{VoxelWorld,BLOCK,terrainHeight,meshChunk,worldKey},
  {WORLD_MAX_Y},
  {v6BiomeAt},{meshDepthSection},
  {pack2NormalizeState,pack2WaterSectionVertices},
  {combinePack3ChunkMesh},
  {createPack3RuntimeStage},{PACK3_BUILDER_SYMBOLS},
  {meshManual14Chunk},{MANUAL_FIVE_PACK_CATALOG},
  {GpuUploadRetry:currentMainGpuUploadRetry}
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
  fromMain('src/gpu-recovery.mjs')
]);
assert.equal(GpuUploadRetry.toString(),currentMainGpuUploadRetry.toString());
const seed=179,MAIN='db4bbcc32156e5df311f733bcaa53d559c17313b';
const union=(a,b)=>{
  if(!b.length)return a;
  const result=new Float32Array(a.length+b.length);
  result.set(a);result.set(b,a.length);return result;
};
function fixture(){
  const world=new VoxelWorld(seed),proofs=[],seen=new Set();
  for(let tz=24;tz<32&&proofs.length<2;tz++)
    for(let tx=-88;tx<-80&&proofs.length<2;tx++){
      const {rootX:x,rootZ:z}=mountainV8TileRoot(tx,tz,seed);
      const proposal=surveyMountainV8Column({x,z,seed,worldMaxY:WORLD_MAX_Y,
        biomeAt:v6BiomeAt,heightAt:terrainHeight,
        readBlock:(a,b,c)=>world.naturalAndLandmarkBlock(a,b,c),
        protectedAt:(a,b,c)=>world.edits.has(worldKey(a,b,c)),ids:BLOCK});
      if(!proposal)continue;
      const proof=auditMountainV8P3Uplift(proposal,{
        originalWorld:world,sourceMainHead:MAIN,
        originalVoxelReaderIdentityVerified:true});
      if(proof&&!seen.has(proof.geometryMeshKeys[0])){
        proofs.push(proof);seen.add(proof.geometryMeshKeys[0]);
      }
    }
  assert.equal(proofs.length,2);
  const originalChunks=new Map(proofs.flatMap(p=>p.geometryMeshKeys).map((k,i)=>
    [k,{buffer:{oldOpaque:i},waterBuffer:{oldWater:i},count:90,waterCount:20}]));
  const plan=planMountainV8ResearchMeshBatch(proofs,originalChunks);
  const [x,,z]=[proofs[0].x,19,proofs[0].z];
  const owner=createPack3RuntimeStage({seed,edits:new Map(),get:()=>BLOCK.AIR});
  owner.placeMany([{at:[x,19,z],asset:PACK3_BUILDER_SYMBOLS[0],orientation:'north'}]);
  const pack4=MANUAL_FIVE_PACK_CATALOG.find(r=>r.pack===4&&r.numericId===160);
  assert.ok(pack4);
  const entries=[{at:[x+1,19,z],asset:pack4.symbol,
    numericId:160,sourcePack:4,orientation:0,variant:null}];
  const manual14Layer={entries:()=>entries};
  const fluidAt=[x,19,z+1],waterKey=fluidAt.join(',');
  const fluidState=pack2NormalizeState(76,{level:3,flow:'still'});
  const pack2Cells=new Map([[waterKey,{...fluidState,id:76}]]);
  const waterSource={pack2Cells};
  const cpu=plan.loaded.map(item=>{
    const base=item.section===0?meshChunk(world,item.cx,item.cz):
      meshDepthSection(world,item.cx,item.cz,item.section);
    const pack3=combinePack3ChunkMesh(base,owner,item.cx,item.cz,item.section);
    const manual=meshManual14Chunk(manual14Layer,item.cx,item.cz,item.section);
    const water=pack2WaterSectionVertices(waterSource,item.cx,item.cz,item.section);
    return {key:item.key,opaque:union(pack3,manual.opaque),
      transparent:union(water,manual.transparent)};
  });
  assert.ok(cpu.some(c=>c.transparent.length>0));
  assert.ok(cpu.length>=2);
  let contextGeneration=9,contextLost=false;
  const epoch=()=>ledger({world,pack3Runtime:owner,manual14Layer,
    pack2Cells,contextGeneration});
  const baseline=epoch();
  const oldSnapshot=JSON.stringify(world.save());
  const originalEntries=[...originalChunks];
  function fakeGl(){
    let next=0,bound=null,glError=0;
    const made=[],deleted=[];
    const gl={mountainV8SyntheticDriver:true,NO_ERROR:0,
      ARRAY_BUFFER:34962,STATIC_DRAW:35044,
      isContextLost:()=>contextLost,
      createBuffer(){const h={newMock:++next};made.push(h);return h;},
      bindBuffer(target,buffer){bound=buffer;},
      bufferData(target,source,usage){assert.ok(made.includes(bound));},
      getError(){const e=glError;glError=0;return e;},
      deleteBuffer(h){assert.ok(made.includes(h));deleted.push(h);},
      made,deleted
    };
    return gl;
  }
  const gl=fakeGl();
  const mock=stageMountainV8MockGpuTransaction(plan,originalChunks,{
    mockGl:gl,sourceCpuBuffers:cpu,retry:new GpuUploadRetry(),
    originalOwnershipToken:'native-owner-fixture',
    readOwnershipToken:()=> 'native-owner-fixture',now:5000
  });
  assert.equal(mock.status,'synthetic-gpu-preview-only',mock.reason);
  const check=(more={})=>preview(mock,originalChunks,{
    expectedEpoch:baseline,readCurrentEpoch:epoch,
    contextGeneration:9,readContextGeneration:()=>contextGeneration,
    mockContextLost:()=>contextLost,...more});
  return {world,owner,pack2Cells,waterKey,entries,originalChunks,
    originalEntries,oldSnapshot,baseline,epoch,mock,gl,check,plan,
    setGeneration:n=>{contextGeneration=n;},
    loseContext:()=>{contextLost=true;}};
}
function protectedState(r){
  assert.equal(r.safeToIntegrate,false);
  assert.equal(r.productionBufferPublicationPerformed,false);
  assert.equal(r.productionBufferDeleted,false);
  assert.equal(r.originalLoadedChunkMapWritten,false);
  assert.equal(r.realWebGL2Used,false);
  assert.equal(r.originalM7P3RgbInherited,false);
  assert.equal(r.newV8IdsRegistered,0);
  assert.equal(r.savedSchema1Written,false);
  assert.equal(r.atomicCrossStoreLockObtained,false);
  assert.equal(r.installedHomeScreenPwaTested,false);
}
function allOldHandlesRemain(f){
  assert.deepEqual([...f.originalChunks],f.originalEntries);
  assert.ok([...f.originalChunks.values()].every(v=>
    v.buffer.oldOpaque!==undefined&&v.waterBuffer.oldWater!==undefined));
  assert.ok(f.gl.deleted.every(h=>h.newMock!==undefined));
}
test('actual source schema-1, Pack2, Pack3 and Manual14 produce stable non-authorizing ledger',()=>{
  const f=fixture();
  assert.equal(f.baseline.sourceMainHead,MAIN);
  assert.equal(f.baseline.originalAuxiliary.caveAttested,false);
  assert.equal(f.baseline.originalAuxiliary.mobAttested,false);
  assert.equal(f.baseline.originalAuxiliary.vaultAttested,false);
  assert.equal(f.baseline.originalAuxiliary.mirrorAttested,false);
  assert.deepEqual(f.epoch(),f.baseline);
  assert.equal(Object.isFrozen(f.baseline),true);
  assert.equal(f.baseline.sourceBrowserLockObtained,false);
  assert.equal(f.baseline.safeToIntegrate,false);
  assert.equal(JSON.stringify(f.world.save()),f.oldSnapshot);
  f.mock.disposeSyntheticHandles();
  allOldHandlesRemain(f);
});
test('genuine source-derived staged mock buffers can be projected ONLY into detached shadow Map',()=>{
  const f=fixture(),r=f.check();
  assert.equal(r.status,'detached-projection-only');
  assert.equal(r.realOwnerCommitAllowed,false);
  assert.equal(r.projectedChunkCount,f.plan.loaded.length);
  assert.equal(r.projectedChunks.size,f.originalChunks.size);
  assert.notStrictEqual(r.projectedChunks,f.originalChunks);
  for(const item of f.plan.loaded){
    assert.equal(r.projectedChunks.get(item.key).researchSyntheticProjectionOnly,true);
    assert.strictEqual(f.originalChunks.get(item.key),f.originalEntries.find(x=>x[0]===item.key)[1]);
  }
  assert.equal(f.gl.deleted.length,0);
  protectedState(r);
  f.mock.disposeSyntheticHandles();
  allOldHandlesRemain(f);
});
test('real in-memory original-world schema-1 edit after mock staging vetoes final publication',()=>{
  const f=fixture();
  assert.equal(f.world.set(0,-100,0,BLOCK.AIR),true);
  const r=f.check();
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'stale-original-source-before-projection');
  assert.equal(r.projectedChunks,null);
  assert.equal(f.gl.deleted.length,f.gl.made.length);
  protectedState(r);allOldHandlesRemain(f);
});
test('existing Pack2 water sidecar change after stage invalidates original render ownership',()=>{
  const f=fixture();
  f.pack2Cells.set(f.waterKey,{...f.pack2Cells.get(f.waterKey),level:7});
  const r=f.check();
  assert.equal(r.status,'rejected');
  assert.equal(r.projectedChunks,null);
  assert.equal(r.reason,'stale-original-source-before-projection');
  protectedState(r);allOldHandlesRemain(f);
});
test('original Pack3 actual source-stage serial changes are detected with no live edits',()=>{
  const f=fixture();
  f.owner.placeMany([{at:[0,19,0],asset:PACK3_BUILDER_SYMBOLS[0],orientation:'north'}]);
  const r=f.check();
  assert.equal(r.reason,'stale-original-source-before-projection');
  assert.equal(r.projectedChunks,null);
  protectedState(r);allOldHandlesRemain(f);
});
test('Manual14 authored layer mutation at second projected entry aborts entire shadow map',()=>{
  const f=fixture();
  assert.ok(f.plan.loaded.length>=2);
  const r=f.check({beforeProjectedEntry:i=>{
    if(i===1)f.entries.push({...f.entries[0],at:[0,19,0]});
  }});
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'stale-during-detached-projection');
  assert.equal(r.projectedChunks,null);
  assert.equal(f.gl.deleted.length,f.gl.made.length);
  protectedState(r);allOldHandlesRemain(f);
});
test('rendering context generation change after first projected key vetoes whole result',()=>{
  const f=fixture(),r=f.check({beforeProjectedEntry:i=>{
    if(i===0)f.setGeneration(10);
  }});
  assert.equal(r.reason,'stale-during-detached-projection');
  assert.equal(r.projectedChunks,null);
  protectedState(r);allOldHandlesRemain(f);
});
test('lost graphics context after staging but before projection never publishes',()=>{
  const f=fixture();
  f.loseContext();
  const r=f.check();
  assert.equal(r.reason,'stale-original-source-before-projection');
  assert.equal(r.projectedChunks,null);
  protectedState(r);allOldHandlesRemain(f);
});
test('concurrent newer loaded-chunk reference during shadow commit refuses stale candidate',()=>{
  const f=fixture();
  const key=f.plan.loaded[0].key;
  let newer=null;
  const r=f.check({beforeProjectedEntry:i=>{
    if(i===0){
      newer={concurrentSourceOwner:true};
      f.originalChunks.set(key,newer);
    }
  }});
  assert.equal(r.reason,'stale-during-detached-projection');
  assert.equal(r.projectedChunks,null);
  assert.strictEqual(f.originalChunks.get(key),newer);
  assert.ok(f.gl.deleted.every(h=>h.newMock!==undefined));
  protectedState(r);
});
test('test callback throws mid publication: no partial result and only new mock handles disposed',()=>{
  const f=fixture(),r=f.check({beforeProjectedEntry:()=>{throw Error('synthetic owner callback fault');}});
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'source-reader-or-projection-fault');
  assert.equal(r.projectedChunks,null);
  assert.equal(f.gl.deleted.length,f.gl.made.length);
  protectedState(r);allOldHandlesRemain(f);
});
test('forged transparent buffer count cannot alias opaque handles or original old buffers',()=>{
  for(const variant of ['original','duplicate','missing-water']){
    const f=fixture(),stages=f.mock.stages.map(x=>({...x}));
    if(variant==='original')stages[0].buffer=f.originalEntries[0][1].buffer;
    if(variant==='duplicate')stages[1].buffer=stages[0].buffer;
    if(variant==='missing-water')stages[0].waterBuffer=null;
    const projected=new Map(f.mock.projectedChunks);
    for(const x of stages)projected.set(x.key,{researchMockOnly:true,
      buffer:x.buffer,waterBuffer:x.waterBuffer});
    const fake={...f.mock,stages,projectedChunks:projected};
    const r=preview(fake,f.originalChunks,{
      expectedEpoch:f.baseline,readCurrentEpoch:f.epoch,
      contextGeneration:9,readContextGeneration:()=>9,
      mockContextLost:()=>false});
    assert.equal(r.status,'rejected',variant);
    assert.equal(r.projectedChunks,null);
    protectedState(r);allOldHandlesRemain(f);
  }
});
test('unknown cave/mob/Vault/Mirror ownership never becomes implicit permission',()=>{
  const f=fixture();
  const supplied=ledger({world:f.world,pack3Runtime:f.owner,
    manual14Layer:{entries:()=>f.entries},pack2Cells:f.pack2Cells,
    caveEvidence:{readOnly:true},mobEvidence:{readOnly:true},
    vaultEvidence:{readOnly:true},mirrorEvidence:{readOnly:true},
    contextGeneration:9});
  assert.equal(supplied.originalAuxiliary.caveAttested,true);
  assert.equal(supplied.originalAuxiliary.vaultAttested,true);
  assert.equal(supplied.safeToIntegrate,false);
  assert.equal(supplied.sourceBrowserLockObtained,false);
  const r=f.check();
  assert.equal(r.status,'detached-projection-only');
  protectedState(r);f.mock.disposeSyntheticHandles();allOldHandlesRemain(f);
});
