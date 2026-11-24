// Original full repo Node22 dual pinned checkout: exact MAIN source readers,
// synthetic monotonic revision witnesses, and mock-only GPU retirement.
// No browser tabs, actual GPU, persistent save, Vault/Mirror, runtime or IDs.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {captureMountainV8SyntheticVersionedSource as capture,
 inspectMountainV8MockRevisionGuardedRetirement as review,
 MOUNTAIN_V8_SYNTHETIC_REVISION_OWNERS as owners}
 from '../src/manual-biomes/mountain-v8-p3-revision-vector-aba-preflight.mjs';
import {readMountainV8DetachedOriginalEpoch as originalEpoch,
 previewMountainV8DetachedPublication as publishShadow}
 from '../src/manual-biomes/mountain-v8-p3-source-epoch-projected-publication.mjs';
import {stageMountainV8MockGpuTransaction as mockStage}
 from '../src/manual-biomes/mountain-v8-p3-mock-gpu-transaction-research.mjs';
import {inspectMountainV8MockRetirementEligibility as retirement}
 from '../src/manual-biomes/mountain-v8-p3-mock-retirement-owner-evidence.mjs';
import {surveyMountainV8Column,mountainV8TileRoot}
 from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
import {auditMountainV8P3Uplift}
 from '../src/manual-biomes/mountain-v8-p3-uplift-and-halo-audit.mjs';
import {planMountainV8ResearchMeshBatch}
 from '../src/manual-biomes/mountain-v8-p3-mesh-batch-rollback-research.mjs';
import {GpuUploadRetry} from '../src/gpu-recovery.mjs';
const root=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!root)throw Error('Missing exact read-only current Desert P3 main checkout');
const main=p=>import(pathToFileURL(path.join(root,p)).href);
const [{VoxelWorld,BLOCK,terrainHeight,meshChunk,worldKey},
 {WORLD_MAX_Y},{v6BiomeAt},{createPack3RuntimeStage},
 {PACK3_BUILDER_SYMBOLS},{MANUAL_FIVE_PACK_CATALOG},
 {pack2NormalizeState,pack2WaterSectionVertices},
 {combinePack3ChunkMesh},{meshManual14Chunk},
 {GpuUploadRetry:mainRetry}]=await Promise.all([
 main('src/voxel.mjs'),main('src/depth.mjs'),
 main('src/manual-biomes/v6-balanced-biomes.mjs'),
 main('src/builder-assets/pack3-runtime.mjs'),
 main('src/builder-assets/pack3.mjs'),
 main('src/builder-assets/manual-five-pack.mjs'),
 main('src/pack2-integration.mjs'),main('src/builder-assets/pack3-live.mjs'),
 main('src/builder-assets/manual14-mesh.mjs'),main('src/gpu-recovery.mjs')]);
assert.equal(GpuUploadRetry.toString(),mainRetry.toString());
const SEED=179,HEAD='db4bbcc32156e5df311f733bcaa53d559c17313b';
const concat=(a,b)=>{if(!b.length)return a;const c=new Float32Array(a.length+b.length);c.set(a);c.set(b,a.length);return c;};
function fixture(){
 const world=new VoxelWorld(SEED),pack3=createPack3RuntimeStage({
   seed:SEED,edits:new Map(),get:()=>BLOCK.AIR
 });
 const pack4=MANUAL_FIVE_PACK_CATALOG.find(r=>r.pack===4&&r.numericId===160);
 assert.ok(pack4);
 const manualEntries=[{at:[-699,19,196],asset:pack4.symbol,
   numericId:160,sourcePack:4,orientation:0,variant:null}];
 const manual14Layer={entries:()=>manualEntries};
 const waterKey=[-699,19,197].join(',');
 const pack2Cells=new Map([[waterKey,{...pack2NormalizeState(76,{level:3,flow:'still'}),id:76}]]);
 const readers={world,pack3Runtime:pack3,manual14Layer,pack2Cells};
 const version=Object.fromEntries(owners.map(k=>[k,0]));
 const readVersions=()=>({...version});
 const readEpoch=()=>originalEpoch({...readers,contextGeneration:0});
 const sourceSave=JSON.stringify(world.save());
 const result={readers,world,pack3,manualEntries,pack2Cells,waterKey,
   version,readVersions,readEpoch,sourceSave};
 result.epoch=()=>capture(readers,{readVersions,contextGeneration:0});
 return result;
}
function expectedSafe(x){
 assert.equal(x.safeToIntegrate,false);
 assert.equal(x.realGpuUsed,false);
 assert.equal(x.oldGpuBufferDeleted,false);
 assert.equal(x.liveChunkMapChanged,false);
 assert.equal(x.registeredV8Ids,0);
 assert.equal(x.atomicBrowserLockObtained,false);
 assert.equal(x.realIphoneHomeScreenPwaAccepted,false);
}
function genuineMockRetirement(f){
 const proofs=[],seen=new Set(),world=f.world;
 for(let tz=24;tz<32&&proofs.length<2;tz++)
  for(let tx=-88;tx<-80&&proofs.length<2;tx++){
    const {rootX:x,rootZ:z}=mountainV8TileRoot(tx,tz,SEED);
    const survey=surveyMountainV8Column({x,z,seed:SEED,
      worldMaxY:WORLD_MAX_Y,ids:BLOCK,
      biomeAt:v6BiomeAt,heightAt:terrainHeight,
      readBlock:(a,b,c)=>world.naturalAndLandmarkBlock(a,b,c),
      protectedAt:(a,b,c)=>world.edits.has(worldKey(a,b,c))});
    if(!survey)continue;
    const proof=auditMountainV8P3Uplift(survey,{
      originalWorld:world,originalVoxelReaderIdentityVerified:true,
      sourceMainHead:HEAD});
    if(proof&&!seen.has(proof.geometryMeshKeys[0])){
      seen.add(proof.geometryMeshKeys[0]);proofs.push(proof);
    }
  }
 assert.equal(proofs.length,2);
 const old=new Map(proofs.flatMap(p=>p.geometryMeshKeys).map(
   (key,i)=>[key,{buffer:{originalOpaque:i},waterBuffer:{originalWater:i}}]));
 const before=new Map(old),plan=planMountainV8ResearchMeshBatch(proofs,old);
 const p=proofs[0];
 f.pack3.placeMany([{at:[p.x,19,p.z],asset:PACK3_BUILDER_SYMBOLS[0],
   orientation:'north'}]);
 f.manualEntries[0].at=[p.x+1,19,p.z];
 f.pack2Cells.clear();
 f.pack2Cells.set([p.x,19,p.z+1].join(','),{
   ...pack2NormalizeState(76,{level:3,flow:'still'}),id:76});
 const waterSource={pack2Cells:f.pack2Cells};
 const cpu=plan.loaded.map(s=>{
   const base=meshChunk(world,s.cx,s.cz);
   const pack3=combinePack3ChunkMesh(base,f.pack3,s.cx,s.cz,0);
   const manual=meshManual14Chunk(f.readers.manual14Layer,s.cx,s.cz,0);
   const water=pack2WaterSectionVertices(waterSource,s.cx,s.cz,0);
   return {key:s.key,opaque:concat(pack3,manual.opaque),
     transparent:concat(water,manual.transparent)};
 });
 assert.ok(cpu.some(s=>s.transparent.length>0));
 const made=[],deleted=[];let next=0,bound=null,lost=false;
 const gl={
   mountainV8SyntheticDriver:true,NO_ERROR:0,
   ARRAY_BUFFER:34962,STATIC_DRAW:35044,
   isContextLost:()=>lost,
   createBuffer(){const h={mockNew:++next};made.push(h);return h;},
   bindBuffer(target,h){bound=h;},
   bufferData(){assert.ok(made.includes(bound));},
   getError:()=>0,
   deleteBuffer(h){assert.ok(made.includes(h));deleted.push(h);}
 };
 const staged=mockStage(plan,old,{mockGl:gl,sourceCpuBuffers:cpu,
   readOwnershipToken:()=> 'source-fixture',originalOwnershipToken:'source-fixture',
   retry:new GpuUploadRetry(),now:100});
 assert.equal(staged.status,'synthetic-gpu-preview-only',staged.reason);
 const e=f.epoch();assert.equal(e.status,'synthetic-source-version-stable');
 const shadow=publishShadow(staged,old,{
   expectedEpoch:e.sourceEpoch,readCurrentEpoch:f.readEpoch,
   readContextGeneration:()=>0,contextGeneration:0,isContextLost:()=>lost
 });
 assert.equal(shadow.status,'detached-projection-only',shadow.reason);
 const oldProof=retirement(shadow,staged,old,{
   originalLoadedAtStage:before,expectedSourceEpoch:e.sourceEpoch,
   readCurrentSourceEpoch:f.readEpoch,
   expectedContextGeneration:0,readContextGeneration:()=>0,
   isContextLost:()=>lost,isSyntheticHandleLive:h=>
     made.includes(h)&&!deleted.includes(h)
 });
 assert.equal(oldProof.status,'retirement-plan-only',oldProof.reason);
 return {e,oldProof,old,staged,made,deleted};
}
test('original source Pack2/3/manual/schema1 stable capture produces NON-AUTHORIZING synthetic witness',()=>{
 const f=fixture(),r=f.epoch();
 assert.equal(r.status,'synthetic-source-version-stable');
 assert.equal(r.versions.world,0);assert.equal(r.versions.pack2,0);
 assert.equal(r.sourceEpoch.sourceMainHead,HEAD);
 assert.equal(r.atomicBrowserLockObtained,false);
 assert.equal(r.actualOwnerRevisionsAvailable,false);
 assert.equal(r.caveMobVaultMirrorUnverified,true);
 expectedSafe(r);
 assert.equal(JSON.stringify(f.world.save()),f.sourceSave);
});
test('real original schema-1 save ABA change+restore is rejected by mock writer revision even when serialized bytes identical',()=>{
 const f=fixture(),before=JSON.stringify(f.world.save());
 const r=capture(f.readers,{readVersions:f.readVersions,
   betweenReads:()=>{
     f.version.world++;
     f.world.set(0,-100,0,BLOCK.AIR);
     f.world.edits.delete(worldKey(0,-100,0));
     f.version.world++;
   }});
 assert.equal(JSON.stringify(f.world.save()),before);
 assert.equal(r.status,'rejected');
 assert.equal(r.reason,'synthetic-original-owner-aba-or-concurrent-write');
 expectedSafe(r);
});
test('Pack2 fluid source ABA restored to identical original state is caught by synthetic version',()=>{
 const f=fixture(),baseline=JSON.stringify([...f.pack2Cells]);
 const r=capture(f.readers,{readVersions:f.readVersions,
   betweenReads:()=>{
     const prev={...f.pack2Cells.get(f.waterKey)};
     f.version.pack2++;
     f.pack2Cells.set(f.waterKey,{...prev,level:7});
     f.pack2Cells.set(f.waterKey,prev);
     f.version.pack2++;
   }});
 assert.equal(JSON.stringify([...f.pack2Cells]),baseline);
 assert.equal(r.reason,'synthetic-original-owner-aba-or-concurrent-write');
 expectedSafe(r);
});
test('Manual14 placement ABA restoring authored exact coordinates still invalidates revision',()=>{
 const f=fixture(),before=JSON.stringify(f.manualEntries);
 const r=capture(f.readers,{readVersions:f.readVersions,
   betweenReads:()=>{
     f.version.manual14++;
     const original=f.manualEntries[0];
     f.manualEntries.push({...original,at:[0,19,0]});
     f.manualEntries.pop();
     f.version.manual14++;
   }});
 assert.equal(JSON.stringify(f.manualEntries),before);
 assert.equal(r.reason,'synthetic-original-owner-aba-or-concurrent-write');
});
test('Pack3 constructed source mutation with synthetic revision fails closed',()=>{
 const f=fixture();
 const r=capture(f.readers,{readVersions:f.readVersions,
   betweenReads:()=>{
     f.version.pack3++;
     f.pack3.placeMany([{at:[0,19,0],asset:PACK3_BUILDER_SYMBOLS[0],
       orientation:'north'}]);
     f.version.pack3++;
   }});
 assert.equal(r.status,'rejected');expectedSafe(r);
});
test('odd writer-in-progress versions cannot certify any original source',()=>{
 const f=fixture();f.version.world=1;
 const r=f.epoch();
 assert.equal(r.status,'rejected');
 assert.equal(r.reason,'synthetic-revision-or-original-source-read-error');
 expectedSafe(r);
});
test('missing renderer/loaded chunk revision makes source admission fail closed',()=>{
 const f=fixture();const bad={...f.readVersions()};delete bad.renderer;
 const r=capture(f.readers,{readVersions:()=>bad});
 assert.equal(r.status,'rejected');expectedSafe(r);
});
test('writer revision changing between adjacent source reads is refused even without data mutation',()=>{
 const f=fixture();
 const r=capture(f.readers,{readVersions:f.readVersions,
   betweenReads:()=>{f.version.loadedChunks+=2;}});
 assert.equal(r.reason,'synthetic-original-owner-aba-or-concurrent-write');
});
test('uninstrumented ABA is NOT detected: test explicitly demonstrates missing real owner counters',()=>{
 const f=fixture(),original=JSON.stringify(f.world.save());
 const r=capture(f.readers,{readVersions:f.readVersions,
   betweenReads:()=>{
     f.world.set(0,-100,0,BLOCK.AIR);
     f.world.edits.delete(worldKey(0,-100,0));
   }});
 assert.equal(JSON.stringify(f.world.save()),original);
 assert.equal(r.status,'synthetic-source-version-stable');
 assert.equal(r.realWriterInstrumentationInstalled,false);
 assert.equal(r.safeToIntegrate,false);
});
test('actual exact-source synthetic retirement proof can be reviewed, but old buffers NEVER released',()=>{
 const f=fixture(),g=genuineMockRetirement(f);
 const r=review(g.e,g.oldProof,{
   readVersions:f.readVersions,readCurrentOriginalEpoch:f.readEpoch,
   readContextGeneration:()=>0,contextGeneration:0
 });
 assert.equal(r.status,'synthetic-versioned-retirement-review-only');
 assert.equal(r.hypotheticalOldHandleCount,g.oldProof.hypotheticalOldHandles.length);
 assert.equal(r.oldBufferReleaseAuthorized,false);
 assert.equal(r.futureRendererOwnerCommitLockRequired,true);
 assert.equal(g.deleted.length,0);
 expectedSafe(r);
 g.staged.disposeSyntheticHandles();
});
test('ABA after original retirement evidence invalidates mock old-buffer review',()=>{
 const f=fixture(),g=genuineMockRetirement(f);
 const snapshot=f.readEpoch();
 f.version.world+=2; // original owner WOULD increment around ABA
 assert.deepEqual(f.readEpoch(),snapshot);
 const r=review(g.e,g.oldProof,{
   readVersions:f.readVersions,readCurrentOriginalEpoch:f.readEpoch,
   readContextGeneration:()=>0,contextGeneration:0
 });
 assert.equal(r.reason,'original-synthetic-writer-revision-drift');
 expectedSafe(r);
});
test('context generation change or loss never admits retirement despite same source bytes',()=>{
 const f=fixture(),g=genuineMockRetirement(f);
 const r=review(g.e,g.oldProof,{
   readVersions:f.readVersions,readCurrentOriginalEpoch:f.readEpoch,
   readContextGeneration:()=>1,contextGeneration:0
 });
 assert.equal(r.reason,'original-synthetic-renderer-context-lost');
 expectedSafe(r);
 const loss=review(g.e,g.oldProof,{
   readVersions:f.readVersions,readCurrentOriginalEpoch:f.readEpoch,
   readContextGeneration:()=>0,contextGeneration:0,isContextLost:()=>true
 });
 assert.equal(loss.status,'rejected');
 expectedSafe(loss);
});
test('renderer owner revision mutation DURING hypothetical release study is refused',()=>{
 const f=fixture(),g=genuineMockRetirement(f);
 const r=review(g.e,g.oldProof,{
   readVersions:f.readVersions,readCurrentOriginalEpoch:f.readEpoch,
   readContextGeneration:()=>0,contextGeneration:0,
   onInspection:()=>{f.version.renderer+=2;}
 });
 assert.equal(r.reason,'original-synthetic-writer-revision-drift');
 expectedSafe(r);
});
test('source mutation without synthetic revision is refused by actual original serialization',()=>{
 const f=fixture(),g=genuineMockRetirement(f);
 f.pack2Cells.set([...f.pack2Cells.keys()][0],{
   ...[...f.pack2Cells.values()][0],level:7});
 const r=review(g.e,g.oldProof,{
   readVersions:f.readVersions,readCurrentOriginalEpoch:f.readEpoch,
   readContextGeneration:()=>0,contextGeneration:0
 });
 assert.equal(r.reason,'original-source-epoch-drift');
 expectedSafe(r);
});
test('forged retirement approval or synthetic odd revision cannot license release',()=>{
 const f=fixture(),g=genuineMockRetirement(f);
 let r=review(g.e,{...g.oldProof,oldBufferReleaseAuthorized:true},{
   readVersions:f.readVersions,readCurrentOriginalEpoch:f.readEpoch,
   readContextGeneration:()=>0,contextGeneration:0
 });
 assert.equal(r.reason,'retirement-or-original-owner-evidence-invalid');
 f.version.context=1;
 r=review(g.e,g.oldProof,{
   readVersions:f.readVersions,readCurrentOriginalEpoch:f.readEpoch,
   readContextGeneration:()=>0,contextGeneration:0
 });
 assert.equal(r.reason,'original-source-or-version-read-failed');
 expectedSafe(r);
});
