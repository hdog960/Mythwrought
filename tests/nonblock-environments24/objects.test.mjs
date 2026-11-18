import test from 'node:test';
import assert from 'node:assert/strict';
import {FAMILIES,makeEnvironmentObject,canAttach,createFixture} from '../../src/nonblock-environments24/objects.mjs';
const a={x:17,y:-12,z:-33};
test('five distinct D/E families have deterministic original meshes and selection volumes',()=>{
 const ids=new Set();
 for(const family of Object.keys(FAMILIES)){
  for(let variant=0;variant<4;variant++){
   const o=makeEnvironmentObject(family,{seed:179,anchor:a,variant});
   assert.deepEqual(o,makeEnvironmentObject(family,{seed:179,anchor:a,variant}));
   assert.ok(o.mesh.triangleCount>0&&o.mesh.triangleCount<=o.render.maxTriangles);
   assert.equal(o.mesh.positions.length,o.mesh.triangleCount*9);
   assert.ok(o.mesh.positions.every(Number.isFinite));
   assert.ok(o.selection[0].min.every((v,i)=>v<o.selection[0].max[i]));
   assert.ok(!ids.has(o.instanceKey));ids.add(o.instanceKey);
   assert.match(o.sceneId,/^nonblock:[de]:/);
   assert.equal(o.removal.respawn,'never-unless-explicit-reset');
  }
 }
 assert.equal(ids.size,20);
});
test('mounts fail closed for missing or edited support and occupied clearance',()=>{
 for(const family of Object.keys(FAMILIES)){
  const o=makeEnvironmentObject(family,{anchor:a});
  const sy=a.y+(o.mount==='ground'?-1:1);
  const blockAt=(x,y,z)=>y===sy?3:0;
  assert.equal(canAttach(o,{}),false);
  assert.equal(canAttach(o,{blockAt}),true);
  assert.equal(canAttach(o,{blockAt,editedAt:(x,y)=>y===sy}),false);
  assert.equal(canAttach(o,{blockAt,occupiedAt:(x,y)=>y===a.y}),false);
  assert.equal(canAttach(o,{blockAt:()=>0}),false);
 }
});
test('isolated pick/break tombstone survives fixture restore and is independent',()=>{
 const objects=['stalagmite','crystal','agave'].map((family,i)=>makeEnvironmentObject(family,{seed:2026,anchor:a,variant:i}));
 const f=createFixture(objects);
 assert.equal(f.visible().length,3);
 assert.equal(f.breakByKey(objects[1].instanceKey),true);
 assert.equal(f.breakByKey(objects[1].instanceKey),false);
 assert.equal(f.visible().length,2);
 const restored=createFixture(objects,{tombstones:f.snapshot()});
 assert.deepEqual(restored.visible().map(x=>x.instanceKey),[objects[0].instanceKey,objects[2].instanceKey]);
});
