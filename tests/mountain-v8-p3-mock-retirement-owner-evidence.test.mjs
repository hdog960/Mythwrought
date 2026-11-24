// Full ORIGINAL two-source checkout, native Node22: V8 research-only
// snapshot repetition and old GPU handle hypothetical retirement eligibility.
// No actual WebGL, persistent saves, browser sidecars, registered V8 ID or
// real GPU publication. All fixtures are source-authentic IN-MEMORY originals.
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
import {readMountainV8DetachedOriginalEpoch,
  previewMountainV8DetachedPublication}
  from '../src/manual-biomes/mountain-v8-p3-source-epoch-projected-publication.mjs';
import {inspectMountainV8RepeatedOriginalSnapshot as doubleRead,
  inspectMountainV8MockRetirementEligibility as retirement}
  from '../src/manual-biomes/mountain-v8-p3-mock-retirement-owner-evidence.mjs';
const mainRoot=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!mainRoot)throw Error('Exact immutable main checkout required');
const main=p=>import(pathToFileURL(path.join(mainRoot,p)).href);
const [{VoxelWorld,BLOCK,terrainHeight,meshChunk,worldKey},
  {WORLD_MAX_Y},{v6BiomeAt},{meshDepthSection},
  {pack2NormalizeState,pack2WaterSectionVertices},
  {combinePack3ChunkMesh},{createPack3RuntimeStage},
  {PACK3_BUILDER_SYMBOLS},{meshManual14Chunk},{MANUAL_FIVE_PACK_CATALOG},
  {GpuUploadRetry:currentMainRetry}
] = await Promise.all([
  main('src/voxel.mjs'),main('src/depth.mjs'),
  main('src/manual-biomes/v6-balanced-biomes.mjs'),main('src/depth-mesh.mjs'),
  main('src/pack2-integration.mjs'),main('src/builder-assets/pack3-live.mjs'),
  main('src/builder-assets/pack3-runtime.mjs'),
  main('src/builder-assets/pack3.mjs'),
  main('src/builder-assets/manual14-mesh.mjs'),
  main('src/builder-assets/manual-five-pack.mjs'),
  main('src/gpu-recovery.mjs')
]);
assert.equal(GpuUploadRetry.toString(),currentMainRetry.toString());
const MAIN='db4bbcc32156e5df311f733bcaa53d559c17313b';
function concat(a,b){
  if(!b.length)return a;
  const c=new Float32Array(a.length+b.length);
  c.set(a);c.set(b,a.length);return c;
}
function fixture(){
  const seed=179,world=new VoxelWorld(seed),proofs=[],chunksSeen=new Set();
  for(let tz=24;tz<32&&proofs.length<2;tz++)
    for(let tx=-88;tx<-80&&proofs.length<2;tx++){
      const {rootX:x,rootZ:z}=mountainV8TileRoot(tx,tz,seed);
      const proposed=surveyMountainV8Column({x,z,seed,
        worldMaxY:WORLD_MAX_Y,ids:BLOCK,biomeAt:v6BiomeAt,
        heightAt:terrainHeight,
        readBlock:(a,b,c)=>world.naturalAndLandmarkBlock(a,b,c),
        protectedAt:(a,b,c)=>world.edits.has(worldKey(a,b,c))});
      if(!proposed)continue;
      const proof=auditMountainV8P3Uplift(proposed,{
        originalWorld:world,originalVoxelReaderIdentityVerified:true,
        sourceMainHead:MAIN});
      if(proof&&!chunksSeen.has(proof.geometryMeshKeys[0])){
        chunksSeen.add(proof.geometryMeshKeys[0]);proofs.push(proof);
      }
    }
  assert.equal(proofs.length,2);
  const originals=new Map(proofs.flatMap(p=>p.geometryMeshKeys)
    .map((key,i)=>[key,{buffer:{oldOpaque:i},waterBuffer:{oldWater:i},count:35}]));
  const atStage=new Map(originals),plan=planMountainV8ResearchMeshBatch(proofs,originals);
  const {x,z}=proofs[0],pack3=createPack3RuntimeStage({
    seed,edits:new Map(),get:()=>BLOCK.AIR});
  pack3.placeMany([{at:[x,19,z],asset:PACK3_BUILDER_SYMBOLS[0],
    orientation:'north'}]);
  const p4=MANUAL_FIVE_PACK_CATALOG.find(row=>row.pack===4&&row.numericId===160);
  assert.ok(p4);
  const manualEntries=[{at:[x+1,19,z],asset:p4.symbol,
    numericId:160,sourcePack:4,orientation:0,variant:null}];
  const manual14Layer={entries:()=>manualEntries};
  const waterId=[x,19,z+1].join(',');
  const waterState=pack2NormalizeState(76,{level:3,flow:'still'});
  const pack2Cells=new Map([[waterId,{...waterState,id:76}]]);
  const waterSource={pack2Cells};
  const cpu=plan.loaded.map(item=>{
    const base=item.section===0?meshChunk(world,item.cx,item.cz):
      meshDepthSection(world,item.cx,item.cz,item.section);
    const opaque=combinePack3ChunkMesh(base,pack3,item.cx,item.cz,item.section);
    const manual=meshManual14Chunk(manual14Layer,item.cx,item.cz,item.section);
    const water=pack2WaterSectionVertices(waterSource,item.cx,item.cz,item.section);
    return {key:item.key,opaque:concat(opaque,manual.opaque),
      transparent:concat(water,manual.transparent)};
  });
  assert.ok(cpu.length>=2&&cpu.some(c=>c.transparent.length));
  let generation=5,lost=false;
  const readers={world,pack3Runtime:pack3,manual14Layer,pack2Cells};
  const originalEpoch=readMountainV8DetachedOriginalEpoch({...readers,contextGeneration:5});
  const snapshot=JSON.stringify(world.save());
  let bound=null,sequence=0;
  const made=[],deleted=[];
  const mockGl={
    mountainV8SyntheticDriver:true,NO_ERROR:0,ARRAY_BUFFER:34962,STATIC_DRAW:35044,
    isContextLost:()=>lost,
    createBuffer(){const item={newSynthetic:++sequence};made.push(item);return item;},
    bindBuffer(target,buffer){bound=buffer;},
    bufferData(){assert.ok(made.includes(bound));},
    getError(){return 0;},
    deleteBuffer(buffer){assert.ok(made.includes(buffer));deleted.push(buffer);},
    made,deleted
  };
  const mock=stageMountainV8MockGpuTransaction(plan,originals,{
    mockGl,sourceCpuBuffers:cpu,readOwnershipToken:()=> 'source-fixture',
    originalOwnershipToken:'source-fixture',
    retry:new GpuUploadRetry(),now:5000
  });
  assert.equal(mock.status,'synthetic-gpu-preview-only',mock.reason);
  const currentEpoch=()=>readMountainV8DetachedOriginalEpoch({
    ...readers,contextGeneration:generation});
  const shadow=previewMountainV8DetachedPublication(mock,originals,{
    expectedEpoch:originalEpoch,readCurrentEpoch:currentEpoch,
    contextGeneration:5,readContextGeneration:()=>generation,
    mockContextLost:()=>lost
  });
  assert.equal(shadow.status,'detached-projection-only',shadow.reason);
  const inspect=opts=>retirement(shadow,mock,originals,{
    originalLoadedAtStage:atStage,
    expectedSourceEpoch:originalEpoch,
    readCurrentSourceEpoch:currentEpoch,
    expectedContextGeneration:5,
    readContextGeneration:()=>generation,
    isContextLost:()=>lost,
    isSyntheticHandleLive:h=>made.includes(h)&&!deleted.includes(h),
    ...opts
  });
  const oldData=[...originals];
  return {world,pack3,manualEntries,pack2Cells,waterId,readers,
    originals,atStage,oldData,snapshot,originalEpoch,currentEpoch,
    plan,mock,shadow,mockGl,made,deleted,inspect,
    setGeneration:g=>generation=g,loseContext:()=>lost=true};
}
const protections=result=>{
  assert.equal(result.safeToIntegrate,false);
  assert.equal(result.runtimeActivationAuthorized,false);
  assert.equal(result.productionBufferPublicationPerformed,false);
  assert.equal(result.oldBufferDeleted,false);
  assert.equal(result.originalLoadedMapWritten,false);
  assert.equal(result.actualWebGL2Used,false);
  assert.equal(result.crossTabLockAcquired,false);
  assert.equal(result.V8MaterialIdsRegistered,0);
  assert.equal(result.M7P3ColorHaloInherited,false);
};
function unchanged(x){
  assert.deepEqual([...x.originals],x.oldData);
  assert.equal(JSON.stringify(x.world.save()),x.snapshot);
  assert.ok(x.deleted.every(h=>h.newSynthetic!==undefined));
}
test('real original schema1 Pack2/3 Manual14 repeat source snapshot is consistent but not a cross-store lock',()=>{
  const x=fixture(),proof=doubleRead(x.readers,{requiredGeneration:5});
  assert.equal(proof.status,'repeated-original-source-consistent');
  assert.equal(proof.intertabAtomicityProved,false);
  assert.equal(proof.ownershipSeedAdmissionGranted,false);
  assert.equal(proof.coherent.sourceMainHead,MAIN);
  assert.equal(proof.coherent.originalAuxiliary.vaultAttested,false);
  protections(proof);unchanged(x);
});
test('original Pack2 sidecar change between two source reads fails closed',()=>{
  const x=fixture(),res=doubleRead(x.readers,{requiredGeneration:5,
    betweenReads:()=>x.pack2Cells.set(x.waterId,{
      ...x.pack2Cells.get(x.waterId),level:7})});
  assert.equal(res.status,'rejected');
  assert.equal(res.reason,'original-source-changed-during-snapshot');
  protections(res);
});
test('original Pack3 authored serial change between reads cannot be treated as coherent source epoch',()=>{
  const x=fixture(),res=doubleRead(x.readers,{requiredGeneration:5,
    betweenReads:()=>x.pack3.placeMany([{at:[0,19,0],
      asset:PACK3_BUILDER_SYMBOLS[0],orientation:'north'}])});
  assert.equal(res.status,'rejected');
  protections(res);
});
test('Manual14 source placement change between read passes refuses stale opaque/translucent preview',()=>{
  const x=fixture(),res=doubleRead(x.readers,{requiredGeneration:5,
    betweenReads:()=>x.manualEntries.push({...x.manualEntries[0],at:[0,19,0]})});
  assert.equal(res.reason,'original-source-changed-during-snapshot');
  protections(res);
});
test('genuine original schema-1 edit between reads refuses source epoch',()=>{
  const x=fixture(),res=doubleRead(x.readers,{requiredGeneration:5,
    betweenReads:()=>x.world.set(0,-100,0,BLOCK.AIR)});
  assert.equal(res.status,'rejected');
  protections(res);
});
test('synthetic final projection yields exact retire-ELIGIBLE old handles but never deletes any',()=>{
  const x=fixture(),r=x.inspect();
  assert.equal(r.status,'retirement-plan-only',r.reason);
  assert.equal(r.oldBufferReleaseAuthorized,false);
  assert.equal(r.oldBufferReleaseMustFollowAtomicPublication,true);
  assert.equal(r.futureRendererCommitLockRequired,true);
  assert.equal(r.hypotheticalReplacedChunks,x.plan.loaded.length);
  assert.equal(r.hypotheticalNewHandles.length,x.mock.stagedHandleCount);
  assert.equal(r.hypotheticalOldHandles.length,x.plan.loaded.length*2);
  assert.equal(x.deleted.length,0);
  protections(r);unchanged(x);
  x.mock.disposeSyntheticHandles();
  assert.equal(x.deleted.length,x.made.length);
});
test('mock new handles already disposed cannot produce later buffer-retirement proof',()=>{
  const x=fixture();
  x.mock.disposeSyntheticHandles();
  const r=x.inspect();
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'old-new-handle-alias-or-disposed-candidate');
  protections(r);unchanged(x);
});
test('lost context or later context-generation change always vetoes old handle release',()=>{
  const lost=fixture();lost.loseContext();
  let r=lost.inspect();
  assert.equal(r.reason,'stale-source-or-context-before-retirement');
  protections(r);
  const fresh=fixture();fresh.setGeneration(6);r=fresh.inspect();
  assert.equal(r.reason,'stale-source-or-context-before-retirement');
  protections(r);
});
test('eviction or new chunk reference since original GPU stage cannot retroactively gain retirement rights',()=>{
  const x=fixture(),k=x.plan.loaded[0].key;
  x.originals.delete(k);
  let r=x.inspect();
  assert.equal(r.reason,'stale-source-or-context-before-retirement');
  protections(r);
  const y=fixture();y.originals.set(y.plan.loaded[0].key,{buffer:{newer:true}});
  r=y.inspect();
  assert.equal(r.reason,'stale-source-or-context-before-retirement');
  protections(r);
});
test('later Pack2 mutation AFTER shadow stage invalidates old buffer release plan',()=>{
  const x=fixture();
  x.pack2Cells.set(x.waterId,{...x.pack2Cells.get(x.waterId),level:1});
  const r=x.inspect();
  assert.equal(r.reason,'stale-source-or-context-before-retirement');
  protections(r);
});
test('old buffer reused by multiple loaded chunks is not silently released as if uniquely owned',()=>{
  const x=fixture(),[first,second]=x.plan.loaded;
  // Forged original stage evidence to demonstrate fail-closed ALIAS guard.
  const shared=x.originals.get(first.key).buffer;
  const old=x.originals.get(second.key);
  const overwritten={...old,buffer:shared};
  x.originals.set(second.key,overwritten);
  const atStage=new Map(x.originals);
  const r=x.inspect({originalLoadedAtStage:atStage});
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'old-buffer-shared-across-loaded-chunks');
  protections(r);
});
test('old buffer retirement cannot reuse mock projected alias or duplicate candidate handle',()=>{
  const x=fixture();
  const stages=x.mock.stages.map(s=>({...s}));
  stages[1].buffer=stages[0].buffer;
  const forged={...x.mock,stages};
  const r=retirement(x.shadow,forged,x.originals,{
    originalLoadedAtStage:x.atStage,
    expectedSourceEpoch:x.originalEpoch,
    readCurrentSourceEpoch:x.currentEpoch,
    expectedContextGeneration:5,readContextGeneration:()=>5,
    isContextLost:()=>false,
    isSyntheticHandleLive:h=>x.made.includes(h)&&!x.deleted.includes(h)});
  assert.equal(r.status,'rejected');
  protections(r);
});
test('retirement check detects a race introduced DURING eligibility inspection',()=>{
  const x=fixture(),r=x.inspect({beforeRetirementInspection:()=>{
    x.originals.set(x.plan.loaded[0].key,{newConcurrentChunk:true});
  }});
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'stale-source-or-context-during-retirement');
  protections(r);
});
test('original-source reader exception cannot grant synthetic retirement or repeated epoch success',()=>{
  const x=fixture();
  let r=x.inspect({readCurrentSourceEpoch:()=>{throw Error('original vault offline');}});
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'source-reader-or-retirement-inspection-fault');
  protections(r);
  r=doubleRead({...x.readers,pack3Runtime:{serialize(){throw Error('invalid pack3');}}},
    {requiredGeneration:5});
  assert.equal(r.status,'rejected');
  assert.equal(r.reason,'original-source-read-failed');
  protections(r);
});
