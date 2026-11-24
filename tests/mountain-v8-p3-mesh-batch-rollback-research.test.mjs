// Original two-checkout V8 CPU-ONLY staging / rollback contract.
// Real current-main source readers; research mock loaded chunks ONLY.
// NO production upload, no save write, no GPU context or V8 registration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {surveyMountainV8Column,mountainV8TileRoot}
  from '../src/manual-biomes/mountain-v8-source-adapter.mjs';
import {auditMountainV8P3Uplift as uplift}
  from '../src/manual-biomes/mountain-v8-p3-uplift-and-halo-audit.mjs';
import {previewMountainV8OriginalDirtyKeys as preview,
  planMountainV8ResearchMeshBatch as plan,
  stageMountainV8ResearchCpuPreview as stage,
  V8_RESEARCH_MAX_STAGE_BYTES}
  from '../src/manual-biomes/mountain-v8-p3-mesh-batch-rollback-research.mjs';

const root=process.env.MYTHWROUGHT_P3_MAIN_ROOT;
if(!root)throw Error('Pinned original production Desert P3 checkout REQUIRED');
const fromMain=relative=>import(pathToFileURL(path.join(root,relative)).href);
const [{VoxelWorld,BLOCK,terrainHeight,meshChunk,worldKey,chunkCoord,CHUNK_SIZE},
  {WORLD_MAX_Y,depthMeshKey,verticalEditSections},
  {v6BiomeAt},{editAffectedChunks},
  {desertSeamEditAffectedChunks},
  {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR},
  {MAX_CHUNK_UPLOAD_BYTES,validateChunkUploadBytes,uploadChunkBuffer,GpuUploadRetry}]
  =await Promise.all([
    fromMain('src/voxel.mjs'),fromMain('src/depth.mjs'),
    fromMain('src/manual-biomes/v6-balanced-biomes.mjs'),
    fromMain('src/chunks.mjs'),
    fromMain('src/manual-biomes/desert-seam-invalidation.mjs'),
    fromMain('src/manual-biomes/profile-world.mjs'),
    fromMain('src/gpu-recovery.mjs')
  ]);
const SEED=179,world=new VoxelWorld(SEED);
const readProposal=(x,z)=>surveyMountainV8Column({
  x,z,seed:SEED,worldMaxY:WORLD_MAX_Y,biomeAt:v6BiomeAt,
  heightAt:terrainHeight,
  readBlock:(a,b,c)=>world.naturalAndLandmarkBlock(a,b,c),
  protectedAt:(a,b,c)=>world.edits.has(worldKey(a,b,c)),
  ids:BLOCK
});
function realProofs(count=2){
  const proofs=[];
  for(let tz=24;tz<32;tz++)for(let tx=-88;tx<-80;tx++){
    const root=mountainV8TileRoot(tx,tz,SEED);
    const proposal=readProposal(root.rootX,root.rootZ);
    if(!proposal)continue;
    const p=uplift(proposal,{sourceMainHead:'db4bbcc32156e5df311f733bcaa53d559c17313b',
      originalVoxelReaderIdentityVerified:true,originalWorld:world});
    if(p)proofs.push(p);
    if(proofs.length===count)return proofs;
  }
  throw Error('Insufficient authentic current-main Mountain uplift source proofs');
}
const proofs=realProofs();
const loaded=(ps=proofs)=>new Map(ps.flatMap(p=>p.geometryMeshKeys)
  .map((k,i)=>[k,{originalGpuHandleForResearchOnly:'old-'+i,originalCount:30}]));
const compact=arr=>arr.map(x=>x.key);
const hash=b=>createHash('sha256').update(Buffer.from(
  b.buffer,b.byteOffset,b.byteLength)).digest('hex');
const proveNoPermissions=r=>{
  assert.equal(r.safeToIntegrate,false);
  assert.equal(r.actualGPUUploadPerformed,false);
  assert.equal(r.originalGPUBufferDeleted,false);
  assert.equal(r.originalWorldWritten,false);
  assert.equal(r.savedSchema1Changed,false);
  assert.equal(r.oldM7P3ColorHaloInherited,false);
  assert.equal(r.newV8MaterialIdsRegistered,0);
};
test('actual current-main original Mountain uplift certificates group only source geometry keys',()=>{
  const original=JSON.stringify(world.save()),map=loaded();
  const p=plan(proofs,map);
  assert.equal(p.sourceMainHead,'db4bbcc32156e5df311f733bcaa53d559c17313b');
  assert.equal(p.sourceColumns,2);
  assert.ok(p.sourcePhysicalCells<=36);
  assert.ok(p.loaded.length>=1);
  assert.ok(p.loaded.length<=6);
  assert.deepEqual(compact(p.loaded),compact(p.originalDirtyKeys));
  assert.equal(p.unloaded.length,0);
  assert.deepEqual(p.loaded.map(x=>x.section),Array(p.loaded.length).fill(0));
  assert.equal(p.originalEntries.length,p.loaded.length);
  proveNoPermissions(p);
  assert.equal(JSON.stringify(world.save()),original);
});
test('real original current-main source chunk meshes stage as 9-float CPU arrays, not GPU',()=>{
  const old=loaded(),before=JSON.stringify(world.save());
  const p=plan(proofs,old);
  const hashes=new Map();
  const built=(cx,cz,section)=>{
    assert.equal(section,0);
    const original=meshChunk(world,cx,cz);
    hashes.set(depthMeshKey(cx,cz,section),hash(original));
    return original;
  };
  const r=stage(p,old,{buildOpaque:built});
  assert.equal(r.status,'cpu-preview-only');
  assert.equal(r.stageCount,p.loaded.length);
  assert.ok(r.bytesStaged>0&&r.bytesStaged<=V8_RESEARCH_MAX_STAGE_BYTES);
  assert.equal(r.projectedChunks.size,old.size);
  assert.equal(r.wouldReplaceLoadedChunkCount,p.loaded.length);
  assert.equal(r.survivingOriginalChunkCount,old.size);
  proveNoPermissions(r);
  for(const item of p.originalEntries){
    assert.strictEqual(old.get(item.key),item.originalEntry);
    assert.equal(r.projectedChunks.get(item.key).researchPreviewOnly,true);
  }
  for(const item of p.loaded)
    assert.equal(hash(meshChunk(world,item.cx,item.cz)),hashes.get(item.key));
  assert.equal(JSON.stringify(world.save()),before);
});
test('injected SECOND CPU build fault rolls back entire candidate projection, keeps ALL original loaded entries',()=>{
  const old=loaded(),snapshot=[...old],p=plan(proofs,old);
  assert.ok(p.loaded.length>=2);
  let calls=0;
  const r=stage(p,old,{buildOpaque:(cx,cz,section)=>{
    calls++;
    if(calls===2)throw Error('Synthetic context loss before final CPU stage');
    return meshChunk(world,cx,cz);
  }});
  assert.equal(r.status,'rejected');
  assert.equal(r.stageCount,0);
  assert.equal(r.projectedChunks,null);
  assert.equal(r.bytesStaged,0);
  assert.equal(calls,2);
  assert.deepEqual([...old],snapshot);
  proveNoPermissions(r);
});
test('original packed-stride 9-float rule and 8MiB per uploaded buffer limit are enforced before projection',()=>{
  const old=loaded([proofs[0]]),p=plan([proofs[0]],old);
  assert.equal(MAX_CHUNK_UPLOAD_BYTES,8*1024*1024);
  let r=stage(p,old,{buildOpaque:()=>new Float32Array(8)});
  assert.equal(r.status,'rejected');assert.equal(r.projectedChunks,null);
  const tooManyFloats=(Math.floor(MAX_CHUNK_UPLOAD_BYTES/(9*4))+1)*9;
  r=stage(p,old,{buildOpaque:()=>new Float32Array(tooManyFloats)});
  assert.equal(r.status,'rejected');assert.equal(r.projectedChunks,null);
  assert.throws(()=>validateChunkUploadBytes(new Uint8Array(9)),
    /packed vertex/);
});
test('aggregate 16MiB research stage bound rejects before projected publication and never edits old map',()=>{
  const old=loaded([proofs[0]]),p=plan([proofs[0]],old),oldEntries=[...old];
  const r=stage(p,old,{buildOpaque:()=>new Float32Array(90),
    buildWater:()=>new Float32Array(90),stageTotalLimitBytes:500});
  assert.equal(r.status,'rejected');
  assert.equal(r.projectedChunks,null);
  assert.deepEqual([...old],oldEntries);
  assert.equal(V8_RESEARCH_MAX_STAGE_BYTES,16*1024*1024);
});
test('stale source loaded-map identities and missing original entries refuse stage',()=>{
  const old=loaded([proofs[0]]),p=plan([proofs[0]],old);
  const changedKey=p.loaded[0].key;
  old.set(changedKey,{newerOriginalSourceBuffer:true});
  let builds=0;
  const r=stage(p,old,{buildOpaque:()=>{builds++;return new Float32Array(9);}});
  assert.equal(r.status,'rejected');
  assert.equal(builds,0);
  assert.equal(r.projectedChunks,null);
});
test('source-only plan refuses fake IDs, old M7 RGB halo, mixed seed, invalid physical and duplicated columns',()=>{
  const old=loaded();
  for(const fake of [
    {...proofs[0],safeToIntegrate:true},
    {...proofs[0],sourceMainHead:'7016e14cd6289f45eaf7fc6a79a362b47996df65'},
    {...proofs[0],oldM7ColorHaloClaimed:true},
    {...proofs[0],newV8MaterialIdsRegistered:400},
    {...proofs[0],geometryMeshKeys:['-99,-99']},
    {...proofs[0],sourcePhysicalCells:19}
  ])assert.throws(()=>plan([fake],old));
  assert.throws(()=>plan([proofs[0],{...proofs[1],seed:2026}],old));
  assert.throws(()=>plan([proofs[0],proofs[0]],old));
});
test('original negative chunk seams and vertical section pairs yield exact separated depthMeshKeys',()=>{
  assert.equal(CHUNK_SIZE,16);
  for(const [x,y,z] of [[-16,-3,-1],[-1,-4,-16],[-32,-19,-32],
    [15,-20,15],[0,0,0],[16,-3,16]]){
    const c=preview(x,y,z);
    assert.equal(c.oldM7P3ColorHaloInherited,false);
    assert.deepEqual(compact(c.originalSourceDirtyKeys),
      verticalEditSections(y).flatMap(s=>editAffectedChunks(x,z).map(({cx,cz})=>
        depthMeshKey(cx,cz,s))));
    for(const item of c.originalSourceDirtyKeys){
      assert.equal(item.key,depthMeshKey(item.cx,item.cz,item.section));
      assert.ok(Math.abs(item.cx-chunkCoord(x))<=1);
      assert.ok(Math.abs(item.cz-chunkCoord(z))<=1);
    }
  }
  assert.deepEqual(verticalEditSections(-3),[0,-1]);
  assert.deepEqual(verticalEditSections(-4),[-1,0]);
});
test('unloaded original depth sections are deferred, never reconstructed from stale fake V8 world',()=>{
  const old=loaded([proofs[0]]),p=plan(proofs,old);
  assert.ok(p.unloaded.length>=1);
  let n=0;
  const r=stage(p,old,{buildOpaque:(cx,cz,section)=>{n++;return meshChunk(world,cx,cz);}});
  assert.equal(n,p.loaded.length);
  assert.equal(r.stageCount,p.loaded.length);
  assert.equal(r.projectedChunks.size,old.size);
  assert.deepEqual(p.unloaded.map(x=>x.key),
    p.originalDirtyKeys.filter(x=>!old.has(x.key)).map(x=>x.key));
});
test('actual M7 P3 negative scree halo is extra RGB only, never injected into new V8 geometry preview',()=>{
  const m7=new FourRegionWorld(SEED,fourRegionProfile(SEED,M7_ENVIRONMENT_GENERATOR));
  const x=-786,y=4,z=-1774,old=loaded();
  const expected=editAffectedChunks(x,z);
  const m7Halo=desertSeamEditAffectedChunks(m7,x,z,y);
  assert.ok(m7Halo.length>expected.length);
  assert.ok(m7Halo.some(c=>c.cx===-50&&c.cz===-112));
  const p=plan(proofs,old);
  assert.equal(p.oldM7P3ColorHaloInherited,false);
  assert.deepEqual(p.originalDirtyKeys.map(x=>x.section),
    p.originalDirtyKeys.map(()=>0));
  assert.deepEqual(m7.save().edits,[]);
});
test('actual original production upload helper deletes only a failed NEW mock WebGL candidate',()=>{
  const oldHandle={original:'displayed-existing-buffer'},deleted=[];
  let error=1285;
  const gl={NO_ERROR:0,ARRAY_BUFFER:34962,STATIC_DRAW:35044,
    createBuffer(){return {newCandidate:true};},
    bindBuffer(){},
    bufferData(){},
    getError(){const current=error;error=1285;return current;},
    deleteBuffer(b){deleted.push(b);}
  };
  // 8 old errors prevent reaching an upload, and only the staged candidate
  // is deleted; original previous active handle is never supplied here.
  assert.throws(()=>uploadChunkBuffer(gl,new Float32Array(9)),
    /error queue did not clear/);
  assert.equal(deleted.length,1);
  assert.notStrictEqual(deleted[0],oldHandle);
  assert.equal(deleted[0].newCandidate,true);
});
test('actual original GPU retry source backs off failed key without mutating loaded chunks',()=>{
  const old=loaded(),saved=[...old],retry=new GpuUploadRetry();
  const fail=retry.fail('-44,12',1000,'original GPU OOM');
  assert.equal(fail.attempt,1);
  assert.equal(retry.ready('-44,12',1001),false);
  assert.equal(retry.ready('-44,12',fail.until),true);
  retry.success('-44,12');
  assert.equal(retry.stats().pendingRetries,0);
  assert.deepEqual([...old],saved);
});
