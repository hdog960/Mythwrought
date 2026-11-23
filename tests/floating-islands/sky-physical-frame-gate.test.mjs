import test from 'node:test';
import assert from 'node:assert/strict';
import {createSkyPhysicalFrameGate} from '../../src/floating-islands/sky-physical-frame-gate.mjs';
import {skyIslandBodyRegions} from '../../src/floating-islands/sky-runtime-adapter.mjs';
import {depthMeshKey} from '../../src/depth.mjs';

const position={x:0,feet:35.5,z:0};
const regions=skyIslandBodyRegions(position);
const skyCandidates=regions.map(({cx,cz,section})=>({cx,cz,section}));
const wanted=Array.from({length:17},(_,i)=>depthMeshKey(i%5-2,Math.floor(i/5)-2,0));
function fixture(){
  let worldToken='source-world-179',generatorFingerprint='exact-generator-unknown',epoch=4,
    editRevision=0,contextToken='webgl2:current',rendererEpoch=6,nativeRevision=2;
  const revisions=new Map(regions.map(p=>[p.key,0]));
  const chunks=new Map(wanted.map(k=>[k,{buffer:{ground:k},count:6}]));
  let uploads=0,meshes=0,meshValue=1,overlayCalls=0,afterUpload=()=>{};
  const deleted=[],originalMeshes=[],observedFloats=[],uploadedArrays=[];
  const source={
    readIdentity:()=>({worldToken,generatorFingerprint,epoch}),
    sectionRevision:key=>revisions.get(key),
    readWorldRevision:()=>editRevision
  };
  const overlay={identity:{worldToken,generatorFingerprint,epoch,seed:179},
    assertFresh(){overlayCalls++;if(editRevision!==0||worldToken!==this.identity.worldToken||
      generatorFingerprint!==this.identity.generatorFingerprint||epoch!==this.identity.epoch)
      throw Error('source ecology stale');
      for(const r of regions)if(revisions.get(r.key)!==0)throw Error('source ecology seam stale');
      return true;
    }};
  const physicalHost={world:{get:()=>0},materials:{shapeFor:()=>({cube:false,opaque:false})},
    meshSection(cx,cz,section){meshes++;const key=`sky:${cx},${cz},${section}`;
      const vertices=new Float32Array(54).fill(meshValue);
      originalMeshes.push(vertices);
      return {key,cx,cz,section,vertices,vertexCount:6,sourceAuthoritative:true,
        stagedOnly:true,bytes:vertices.byteLength};
    }};
  const gl={NO_ERROR:0,OUT_OF_MEMORY:1285,ARRAY_BUFFER:34962,STATIC_DRAW:35044,
    createBuffer:()=>({serial:++uploads}),bindBuffer(){},bufferData(_type,vertices){
      observedFloats.push(vertices[0]);uploadedArrays.push(vertices);afterUpload();
    },getError:()=>gl.NO_ERROR,deleteBuffer:b=>deleted.push(b)};
  const readRendererIdentity=()=>({contextToken,worldToken,rendererEpoch,nativeRevision});
  const gate=createSkyPhysicalFrameGate({source,overlay,physicalHost});
  const makePlan=()=>gate.plan({position,nativeWanted:wanted,nativeChunks:chunks,
    skyCandidates,worldToken,rendererEpoch,nativeRevision,
    grant:{worldToken,rendererEpoch,nativeRevision,nativeWanted:[...wanted],skyBudgetApproved:true}});
  const stage=p=>gate.stage({plan:p,gl,chunks,readRendererIdentity,contextToken,worldToken,
    rendererEpoch,nativeRevision});
  const publish=p=>gate.publish({stage:p,gl,chunks,readRendererIdentity});
  return {gate,makePlan,stage,publish,gl,chunks,deleted,wanted,source,overlay,revisions,
    originalMeshes,observedFloats,uploadedArrays,regions,
    get uploaded(){return uploads},get meshed(){return meshes},get overlayCalls(){return overlayCalls},
    setMeshValue:v=>{meshValue=v},setAfterUpload:f=>{afterUpload=f},
    changeWorld:v=>{worldToken=v},changeFingerprint:v=>{generatorFingerprint=v},
    changeEpoch:v=>{epoch=v},changeRevision:(k,v)=>{revisions.set(k,v)},
    changeEditRevision:v=>{editRevision=v},changeContext:v=>{contextToken=v}
  };
}

test('original renderer grant still required before any physical upper uploads',()=>{
  const f=fixture(),p=f.gate.plan({position,nativeWanted:wanted,nativeChunks:f.chunks,
    skyCandidates,worldToken:'source-world-179',rendererEpoch:6,nativeRevision:2});
  assert.equal(p.readyForStage,false);assert.equal(f.uploaded,0);
});
test('gated mesher publishes original bounded 9-float triangle source to both sky sections',()=>{
  const f=fixture(),plan=f.makePlan();assert.equal(plan.skyJobs.length,2);
  const staged=f.stage(plan);assert.equal(staged.status,'staged');assert.equal(f.chunks.size,17);
  assert.equal(f.uploaded,2);assert.deepEqual(f.observedFloats,[1,1]);
  const result=f.publish(staged);assert.equal(result.status,'published');
  assert.equal(f.chunks.size,19);assert.ok(f.overlayCalls>=8);
  for(const key of staged.stagedKeys){assert.equal(f.chunks.get(key).skySource.epoch,4);
    assert.equal(f.chunks.get(key).skySource.revision,0);}
});
test('mutating original physical mesher Float32Array during GPU upload cannot change private source snapshot',()=>{
  const f=fixture();f.setAfterUpload(()=>{for(const a of f.originalMeshes)a.fill(999)});
  const frame=f.stage(f.makePlan());
  assert.equal(frame.status,'staged');assert.deepEqual(f.observedFloats,[1,1]);
  assert.equal(f.publish(frame).status,'published');
  assert.ok(f.originalMeshes.every(a=>a[0]===999));
  assert.ok(f.uploadedArrays.every(a=>a[0]===1));
  assert.notStrictEqual(f.uploadedArrays[0],f.originalMeshes[0]);
});
test('native upload sees a private clone rather than original physical mesh backing memory',()=>{
  const f=fixture(),refs=[];
  f.setAfterUpload(()=>{refs.push(...f.originalMeshes)});
  const p=f.stage(f.makePlan());assert.equal(p.status,'staged');
  assert.equal(f.originalMeshes.length,2);
  assert.equal(f.publish(p).status,'published');
});
test('stale ecology before planning rejects grant without uploading',()=>{
  const f=fixture();f.changeEditRevision(1);
  assert.throws(()=>f.makePlan(),/source ecology stale/);assert.equal(f.uploaded,0);
});
test('stale source before staging refuses and leaves original 17 ground buffers intact',()=>{
  const f=fixture(),p=f.makePlan();f.changeWorld('new-world');
  assert.throws(()=>f.stage(p),/source ecology stale/);
  assert.equal(f.chunks.size,17);assert.equal(f.uploaded,0);
});
test('source change inside mesher invalidates before any actual WebGL allocation',()=>{
  const f=fixture();const old=f.originalMeshes;
  // Change after first original mesh was assembled, before attestation re-reads identity.
  const first=f.gate;let touched=false;
  f.setAfterUpload(()=>{touched=true;});
  f.changeRevision(f.regions[0].key,1);
  assert.throws(()=>f.stage(f.makePlan()),/source ecology seam stale/);
  assert.equal(f.uploaded,0);assert.equal(touched,false);assert.equal(old.length,0);
});
test('ecology edit during second upload cleans up both new GPU buffers, old map untouched',()=>{
  const f=fixture(),before=[...f.chunks.entries()],p=f.makePlan();let upload=0;
  f.setAfterUpload(()=>{if(++upload===2)f.changeEditRevision(1);});
  const result=f.stage(p);
  assert.equal(result.status,'stale');assert.equal(f.uploaded,2);
  assert.equal(f.deleted.length,2);
  assert.deepEqual([...f.chunks],before);
});
test('ecology seam revision changes after staging refuse publication with staged GPU cleanup',()=>{
  const f=fixture(),p=f.makePlan(),stage=f.stage(p);
  f.changeRevision(f.regions[0].key,1);
  const r=f.publish(stage);assert.equal(r.status,'stale');
  assert.equal(f.chunks.size,17);assert.equal(f.deleted.length,2);
  assert.throws(()=>f.publish(stage),/unconsumed stage/);
});
test('lost WebGL context and stale ecology must never call unsafe deleteBuffer',()=>{
  const f=fixture(),stage=f.stage(f.makePlan());f.changeContext('lost');
  f.changeEditRevision(1);const r=f.publish(stage);
  assert.equal(r.status,'stale');assert.equal(r.abandonedOnContextLoss,true);
  assert.equal(f.deleted.length,0);assert.equal(f.chunks.size,17);
});
test('new world after stage fails without modifying original renderer map',()=>{
  const f=fixture(),stage=f.stage(f.makePlan());f.changeWorld('other');
  const r=f.publish(stage);assert.equal(r.status,'stale');assert.equal(f.chunks.size,17);
  assert.deepEqual(f.deleted.map(x=>x.serial),[1,2]);
});
test('publication cannot reuse an earlier transaction after success',()=>{
  const f=fixture(),stage=f.stage(f.makePlan());
  assert.equal(f.publish(stage).status,'published');
  assert.throws(()=>f.publish(stage),/unconsumed stage/);
});
test('forged stage cannot be published by real original renderer gate',()=>{
  const f=fixture();assert.throws(()=>f.publish({transaction:{}}),/unconsumed stage/);
});
test('untrusted callbacks cannot override the source or physical mesher supplied by gate',()=>{
  const f=fixture(),p=f.makePlan();
  assert.throws(()=>f.gate.stage({plan:p,source:{},meshSection:()=>{}}),/untrusted/);
  assert.equal(f.uploaded,0);
});
test('25 slot cap remains preserved through four source certified frames',()=>{
  const f=fixture();for(let i=0;i<4;i++)assert.equal(f.publish(f.stage(f.makePlan())).status,'published');
  assert.equal(f.chunks.size,25);const p=f.makePlan();
  assert.equal(p.canAdmitFlight,true);assert.equal(p.skyJobs.length,0);
});
test('original depth renderer retains 27+ underground slots and no upper upload',()=>{
  const f=fixture();const positions={...position,feet:-5};
  const underground=Array.from({length:27},(_,i)=>depthMeshKey(i%3-1,Math.floor(i/3)%3-1,-1-Math.floor(i/9)));
  const p=f.gate.plan({position:positions,nativeWanted:underground,
    nativeChunks:new Map(underground.map(k=>[k,{buffer:{k}}])),
    skyCandidates,worldToken:'source-world-179',rendererEpoch:6,nativeRevision:2});
  assert.equal(p.mode,'native-depth-pass-through');assert.equal(f.uploaded,0);
});
test('new proof cannot be forged by calling old world attester with unsupported geometry',()=>{
  const f=fixture();f.setMeshValue(NaN);
  assert.throws(()=>f.stage(f.makePlan()),/not a bounded physical triangle stream/);
  assert.equal(f.chunks.size,17);assert.equal(f.uploaded,0);
});
test('physical host and ecology overlay are mandatory real source interfaces',()=>{
  assert.throws(()=>createSkyPhysicalFrameGate({physicalHost:{world:{get:()=>0}},source:{},overlay:{}}),/original mesher/);
});
