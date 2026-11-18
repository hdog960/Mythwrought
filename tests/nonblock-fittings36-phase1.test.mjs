import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTRACT,CONTRACT_SOURCE_SHA,FITTINGS,describeFitting,createFittingFixture} from '../src/nonblock-fittings36/fittings-phase1.mjs';
const mounts={'ground':{below:true},'ceiling':{above:true},'wall':{behind:true},'corner':{corner:true}};
test('five independently modeled F/G scene families, valid triangle arrays and bounded draw costs',()=>{
 assert.equal(CONTRACT,'nonblock-object-v1');assert.equal(CONTRACT_SOURCE_SHA,'d8f00bcc2d5fe186a9822eeeb48684f51222fad3');
 assert.equal(Object.keys(FITTINGS).length,5);
 const counts=new Set();
 for(const [sceneId,f] of Object.entries(FITTINGS)){
  const o=describeFitting({sceneId,seed:179,anchor:[16,-8,32],mount:mounts[f.attachment]});
  const {mesh,triangleCount,maxInstancesPerBatch}=o.render;
  assert.ok(mesh.positions instanceof Float32Array);assert.ok(mesh.materials instanceof Uint8Array);
  assert.equal(mesh.positions.length,triangleCount*9);assert.equal(mesh.materials.length,triangleCount);
  assert.ok(triangleCount>5&&triangleCount<256);assert.ok(maxInstancesPerBatch<=256);
  assert.ok([...mesh.positions].every(Number.isFinite));counts.add(triangleCount);
  assert.equal(o.breakIntent.targetKey,o.instanceKey);
  assert.equal(o.persistence.key,o.instanceKey);
  assert.equal(o.selectionAabbs.length,1);
  assert.equal(o.contract,CONTRACT);
 }
 assert.ok(counts.size>=4,'geometries must be distinct');
});
test('seed identity, attachment, orientation and protected edits fail closed',()=>{
 for(const [sceneId,f] of Object.entries(FITTINGS)){
  const base={sceneId,seed:2026,anchor:[15,-10,17],mount:mounts[f.attachment]};
  assert.deepEqual(describeFitting(base),describeFitting(base));
  assert.notEqual(describeFitting({...base,seed:-77}).instanceKey,describeFitting(base).instanceKey);
  assert.throws(()=>describeFitting({...base,mount:{}}));
  assert.throws(()=>describeFitting({...base,mount:{...base.mount,playerEdited:true}}));
  assert.throws(()=>describeFitting({...base,mount:{...base.mount,occupied:true}}));
  assert.throws(()=>describeFitting({...base,orientation:4}));
 }
});
test('opt-in break and tombstone restore never changes original descriptors',()=>{
 const objects=Object.entries(FITTINGS).map(([sceneId,f],i)=>describeFitting({sceneId,seed:1,anchor:[i*3,0,0],mount:mounts[f.attachment]}));
 const sidecar=createFittingFixture(1,objects);
 assert.equal(sidecar.visible().length,5);
 assert.equal(sidecar.breakObject(objects[2]).removed,true);
 assert.equal(sidecar.visible().length,4);
 const snapshot=sidecar.snapshot();const restored=createFittingFixture(1,objects);restored.restore(snapshot);
 assert.deepEqual(restored.snapshot(),snapshot);assert.equal(restored.visible().length,4);
 assert.equal(objects.length,5);
 assert.throws(()=>restored.restore({...snapshot,seed:2}));
 assert.throws(()=>restored.breakObject({}));
});
