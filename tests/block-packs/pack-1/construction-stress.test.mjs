import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK1_BUILDER_CATALOG} from '../../../src/block-packs/pack-1/builder-handoff.mjs';
import {compilePack1Construction,inspectPack1Construction,
  removePack1Construction,estimatePack1SourceLoad} from '../../../src/block-packs/pack-1/construction-stress.mjs';

const request=(id,cell,options={})=>({
  symbolicRef:PACK1_BUILDER_CATALOG.find(v=>v.id===id).symbolicRef,
  candidateId:id,cell,...options
});
test('legacy schema-1 rows and unknown future-pack IDs survive disjoint Pack 1 metadata',()=>{
  const existingEdits=[[0,0,0,3],[1,0,0,4],[9,-7,9,109],[2,0,0,0]];
  const snapshot=compilePack1Construction([request(15,[3,2,4],{rotation:1,variant:'upper'}),
    request(32,[5,2,4]),request(9,[6,2,4])],{seed:179,existingEdits});
  assert.deepEqual(Object.keys(snapshot.world),['schema','seed','edits']);
  assert.deepEqual(snapshot.world.edits.filter(x=>existingEdits.some(y=>y[3]===x[3]&&y[0]===x[0])),existingEdits.sort((a,b)=>a[0]-b[0]));
  assert.deepEqual(snapshot.pack1State.turns,[{cell:[3,2,4],blockId:15,turns:1}]);
  assert.deepEqual(snapshot.pack1State.variants,[{cell:[3,2,4],blockId:15,variant:'upper'}]);
  const a=inspectPack1Construction(JSON.parse(JSON.stringify(snapshot)));
  assert.equal(a.pack1Count,3);assert.equal(a.otherCount,4);
  assert.equal(a.placements.find(x=>x.id===15).variant,'upper');
});
test('all rotations and upper slab/stair variants survive exact disjoint metadata restore',()=>{
  const requests=[];let n=0;
  for(const {id,symbolicRef,support} of PACK1_BUILDER_CATALOG){
    for(const rotation of [0,1,2,3]){
      const wallFace=support==='vertical-face'?'west':null;
      requests.push({candidateId:id,symbolicRef,cell:[n++*2,2,0],rotation,
        variant:id===15||id===16?'upper':'lower',wallFace});
    }
  }
  // Supply 4 authentic, full-cube support cells for each mounted variant.
  const existingEdits=requests.filter(p=>p.wallFace).map(p=>[p.cell[0]-1,2,0,3]);
  const snap=compilePack1Construction(requests,{existingEdits});
  const result=inspectPack1Construction(JSON.parse(JSON.stringify(snap)));
  assert.equal(result.pack1Count,120);
  assert.equal(snap.pack1State.turns.length,72);
  assert.equal(snap.pack1State.variants.length,8);
  assert.equal(snap.pack1State.mounts.length,8);
  assert.equal(result.placements.filter(x=>x.rotation===3).length,30);
  assert.deepEqual(result.placements.filter(x=>x.variant==='upper').map(x=>x.id).sort((a,b)=>a-b),
    [15,15,15,15,16,16,16,16]);
});
test('corrupt metadata, missing sidecar, stale block IDs and duplicate cells fail closed',()=>{
  const b=compilePack1Construction([request(16,[2,2,2],{rotation:2,variant:'upper'})]);
  const mutate=fn=>{const c=JSON.parse(JSON.stringify(b));fn(c);return c;};
  assert.throws(()=>inspectPack1Construction({world:b.world}),/Missing schema-1/);
  assert.throws(()=>inspectPack1Construction(mutate(x=>x.pack1State.turns[0].blockId=17)),/checksum|Stale/);
  assert.throws(()=>inspectPack1Construction(mutate(x=>x.pack1State.turns.push(x.pack1State.turns[0]))),/checksum|Duplicate/);
  assert.throws(()=>inspectPack1Construction(mutate(x=>x.pack1State.variants[0].variant='sideways')),/checksum|Stale/);
  assert.throws(()=>inspectPack1Construction(mutate(x=>x.world.edits.push([...x.world.edits[0]]))),/checksum|Duplicate/);
  assert.throws(()=>compilePack1Construction([request(32,[0,0,0]),request(33,[0,0,0])]),/occupied cell/);
});
test('mounted foliage requires a supporting full cube; removals never strand it',()=>{
  assert.throws(()=>compilePack1Construction([request(27,[1,3,0],{wallFace:'west'})]),/supporting cube/);
  const snap=compilePack1Construction([
    request(9,[0,3,0]),request(27,[1,3,0],{wallFace:'west'})]);
  assert.equal(inspectPack1Construction(snap).pack1Count,2);
  assert.throws(()=>removePack1Construction(snap,[0,3,0]),/Missing or stale wall support/);
  assert.equal(inspectPack1Construction(snap).pack1Count,2);
  const removed=removePack1Construction(snap,[1,3,0]);
  assert.equal(inspectPack1Construction(removed).pack1Count,1);
  assert.equal(removed.pack1State.mounts.length,0);
});
test('ambiguous family symbols cannot pick arbitrary building variants in dense plans',()=>{
  assert.throws(()=>compilePack1Construction([
    {symbolicRef:'pack1:053',cell:[0,0,0]}
  ]),/Ambiguous/);
  assert.throws(()=>compilePack1Construction([
    {symbolicRef:'pack1:053',candidateId:36,cell:[0,0,0]}
  ]),/not part/);
  assert.throws(()=>compilePack1Construction([
    request(9,[0,0,0],{rotation:4})
  ]),/quarter turn/);
});
test('deterministic 25-chunk, 6400-cell source geometry stress stays bounded without FPS claim',()=>{
  const ids=PACK1_BUILDER_CATALOG.filter(x=>x.support==='none').map(x=>x.id);
  const placements=[];
  let count=0;
  for(let z=0;z<80;z++)for(let x=0;x<80;x++){
    const id=ids[(count*7)%ids.length];
    const e=PACK1_BUILDER_CATALOG.find(a=>a.id===id);
    const rotation=count%5===0?1:0;
    placements.push({symbolicRef:e.symbolicRef,candidateId:id,cell:[x,2,z],rotation,
      variant:id===15&&count%11===0?'upper':'lower'});
    count++;
  }
  const a=compilePack1Construction(placements,{seed:179});
  assert.equal(inspectPack1Construction(a).pack1Count,6400);
  const metrics=estimatePack1SourceLoad(a);
  assert.equal(metrics.candidateCount,6400);
  assert.equal(metrics.chunkCount,25);
  assert.ok(metrics.sourceTriangles>6400&&metrics.sourceTriangles<10000000);
  assert.ok(metrics.cachedSurfaces<=120);
  assert.equal(metrics.shaderFPSMeasured,false);
  assert.equal(metrics.productionChunkMeshMeasured,false);
  assert.equal(metrics.physicalIPhoneMeasured,false);
  const serialized=JSON.stringify(a);
  assert.ok(serialized.length<1500000,'Stress sample metadata unexpectedly large');
  const replay=inspectPack1Construction(JSON.parse(serialized));
  assert.equal(replay.pack1Count,6400);
});
test('overbudget landscape chunk count is rejected rather than inferred as FPS approval',()=>{
  const requests=[request(9,[0,2,0]),request(10,[80,2,0])];
  const a=compilePack1Construction(requests);
  assert.throws(()=>estimatePack1SourceLoad(a,{maxChunks:1}),/chunk sample budget/);
  assert.equal(estimatePack1SourceLoad(a,{maxChunks:2}).shaderFPSMeasured,false);
});

test('omitting any rotation/variant/mount sidecar record fails integrity before an unnoticed shape change',()=>{
  const original=compilePack1Construction([request(9,[0,0,0]),
    request(27,[1,0,0],{wallFace:'west'}),
    request(15,[2,0,0],{rotation:2,variant:'upper'})]);
  for(const field of ['turns','variants','mounts']){
    const corrupt=JSON.parse(JSON.stringify(original));
    corrupt.pack1State[field]=[];
    assert.throws(()=>inspectPack1Construction(corrupt),/checksum/);
  }
  const tampered=JSON.parse(JSON.stringify(original));
  delete tampered.pack1State.checksum;
  assert.throws(()=>inspectPack1Construction(tampered),/checksum/);
});
