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
  // Six full-cube masonry blocks are rotation-invariant; only 24 shaped IDs retain turn 3.
  assert.equal(result.placements.filter(x=>x.rotation===3).length,24);
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

test('current production biome130 256–315 edits and rotated schema-1 records are preserved byte-for-byte',()=>{
  const existingSave={
    schema:1,seed:417,
    edits:[[0,2,0,256],[1,2,0,315],[2,2,0,8],[3,2,0,109]],
    rotations:[[0,2,0,1],[1,2,0,3]]
  };
  const untouched=JSON.stringify(existingSave);
  const snapshot=compilePack1Construction([
    request(15,[5,2,0],{variant:'upper',rotation:2}),request(32,[6,2,0])
  ],{existingSave});
  assert.equal(JSON.stringify(existingSave),untouched);
  assert.equal(snapshot.world.seed,417);
  assert.deepEqual(snapshot.world.rotations,existingSave.rotations);
  assert.equal(inspectPack1Construction(JSON.parse(JSON.stringify(snapshot))).pack1Count,2);
  assert.equal(inspectPack1Construction(snapshot).otherCount,4);
  assert.deepEqual(snapshot.world.edits.filter(e=>e[0]<4),existingSave.edits);
  const after=removePack1Construction(snapshot,[5,2,0]);
  assert.deepEqual(after.world.rotations,existingSave.rotations);
  assert.deepEqual(after.world.edits.filter(e=>e[0]<4),existingSave.edits);
  assert.equal(inspectPack1Construction(after).pack1Count,1);
  assert.equal(JSON.stringify(existingSave),untouched);
});
test('biome rotation loss, stale rotation and unsupported schema-1 fields fail closed',()=>{
  const base={schema:1,seed:179,edits:[[0,0,0,256]],rotations:[[0,0,0,2]]};
  const snapshot=compilePack1Construction([request(9,[3,0,0])],{existingSave:base});
  const lost=JSON.parse(JSON.stringify(snapshot));
  delete lost.world.rotations;
  assert.throws(()=>inspectPack1Construction(lost),/checksum/);
  const drift=JSON.parse(JSON.stringify(snapshot));
  drift.world.rotations[0][3]=1;
  assert.throws(()=>inspectPack1Construction(drift),/checksum/);
  assert.throws(()=>compilePack1Construction([],{existingSave:{...base,edits:[[0,0,0,9]]}}),
    /registered biome/);
  assert.throws(()=>compilePack1Construction([],{existingSave:{...base,rotations:[[0,0,0,2],[0,0,0,1]]}}),
    /Duplicate/);
  assert.throws(()=>compilePack1Construction([],{existingSave:{...base,newFormat:1}}),
    /Unsupported existing save extension/);
  assert.throws(()=>compilePack1Construction([],{existingSave:base,seed:180}),/seed mismatch/);
  assert.throws(()=>compilePack1Construction([],{existingSave:base,existingEdits:[[1,0,0,3]]}),/never both/);
  assert.throws(()=>compilePack1Construction([],{existingEdits:[[0,0,0,255]]}),/Invalid schema-1/);
  assert.throws(()=>compilePack1Construction([],{existingEdits:[[0,0,0,65535]]}),/Invalid schema-1/);
});

test('incremental construction retains old Pack 1 structures and live biome save rotations',()=>{
  const original=compilePack1Construction([
    request(9,[0,3,0]),request(27,[1,3,0],{wallFace:'west'}),
    request(16,[4,3,0],{rotation:3,variant:'upper'})
  ],{existingSave:{schema:1,seed:179,
    edits:[[8,3,0,256],[9,3,0,315],[10,3,0,8]],
    rotations:[[8,3,0,1],[9,3,0,2]]}});
  const frozen=JSON.stringify(original);
  const next=compilePack1Construction([
    request(15,[5,3,0],{rotation:2,variant:'upper'}),
    request(33,[6,3,0])
  ],{existingSave:original.world,existingPack1State:original.pack1State});
  assert.equal(JSON.stringify(original),frozen);
  const restored=inspectPack1Construction(JSON.parse(JSON.stringify(next)));
  assert.equal(restored.pack1Count,5);assert.equal(restored.otherCount,3);
  assert.equal(restored.placements.find(p=>p.id===16).rotation,3);
  assert.equal(restored.placements.find(p=>p.id===15).variant,'upper');
  assert.equal(restored.placements.find(p=>p.id===27).wallFace,'west');
  assert.deepEqual(next.world.rotations,original.world.rotations);
  assert.deepEqual(next.pack1State.mounts,original.pack1State.mounts);
  assert.equal(next.pack1State.turns.length,2);
  assert.equal(next.pack1State.variants.length,2);
  assert.throws(()=>removePack1Construction(next,[0,3,0]),/Missing or stale wall support/);
  const withoutFlower=removePack1Construction(next,[6,3,0]);
  assert.equal(inspectPack1Construction(withoutFlower).pack1Count,4);
});
test('incremental construction rejects lost or stale state and occupied saved cells',()=>{
  const first=compilePack1Construction([request(15,[1,2,1],{rotation:1,variant:'upper'})]);
  assert.throws(()=>compilePack1Construction([request(33,[2,2,1])],
    {existingSave:first.world}),/metadata-aware restoration/);
  assert.throws(()=>compilePack1Construction([request(33,[2,2,1])],
    {existingPack1State:first.pack1State}),/requires existingSave/);
  assert.throws(()=>compilePack1Construction([request(33,[1,2,1])],
    {existingSave:first.world,existingPack1State:first.pack1State}),/occupied cell/);
  const damaged=JSON.parse(JSON.stringify(first.pack1State));
  damaged.variants=[];
  assert.throws(()=>compilePack1Construction([request(33,[2,2,1])],
    {existingSave:first.world,existingPack1State:damaged}),/checksum/);
  assert.equal(inspectPack1Construction(first).pack1Count,1);
});
test('current main vertical limits -210..19 accept deep edits but reject out-of-bounds saved world',()=>{
  for(const y of [-210,-100,-3,0,19]){
    const state=compilePack1Construction([request(9,[0,y,0])]);
    assert.equal(inspectPack1Construction(state).pack1Count,1);
  }
  for(const y of [-211,20]){
    assert.throws(()=>compilePack1Construction([request(9,[0,y,0])]),/vertical bounds/);
    assert.throws(()=>compilePack1Construction([],
      {existingSave:{schema:1,seed:179,edits:[[0,y,0,256]]}}),/Invalid schema-1 edit row/);
  }
});
