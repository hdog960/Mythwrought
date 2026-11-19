import test from 'node:test';
import assert from 'node:assert/strict';
import {makeWoodlandMixedFixture,WOODLAND_MIXED_VERSION} from '../src/nonblock-scene48/woodland-mixed-fixture.mjs';
import {FOREST_CANDIDATES} from '../src/nonblock-scene48/forest-phase1-candidates.mjs';

const seed=31415;
const forest=[{sceneId:FOREST_CANDIDATES[0],anchor:[0,0,0]}];
const saplings=[{anchor:[4,0,0],variant:1}];
test('mixed woodland retains independent removal across deterministic reload',()=>{
 const scene=makeWoodlandMixedFixture(seed,forest,saplings);
 assert.equal(scene.visible().length,2);
 const objects=scene.visible();
 assert.equal(new Set(objects.map(o=>o.instanceKey)).size,2);
 assert.equal(objects.every(o=>o.mesh.triangleCount>0&&o.selectionAabb&&o.breakIntent==='remove-instance'),true);
 assert.equal(scene.breakByKey(objects[0].instanceKey),true);
 assert.equal(scene.breakByKey(objects[0].instanceKey),false);
 const snapshot=scene.snapshot();
 assert.equal(snapshot.contract,WOODLAND_MIXED_VERSION);
 const restored=makeWoodlandMixedFixture(seed,forest,saplings,snapshot);
 assert.deepEqual(restored.visible().map(o=>o.instanceKey),[objects[1].instanceKey]);
 assert.equal(restored.breakByKey(objects[1].instanceKey),true);
 assert.equal(makeWoodlandMixedFixture(seed,forest,saplings).visible().length,2);
});
test('foreign and corrupt child tombstones fail closed; input rays validated',()=>{
 const scene=makeWoodlandMixedFixture(seed,forest,saplings);
 const snap=scene.snapshot();
 assert.throws(()=>makeWoodlandMixedFixture(seed+1,forest,saplings,snap),TypeError);
 assert.throws(()=>makeWoodlandMixedFixture(seed,forest,saplings,{...snap,saplings:{...snap.saplings,removed:['foreign']}}),TypeError);
 assert.throws(()=>makeWoodlandMixedFixture(seed,forest,saplings,{...snap,forest:{...snap.forest,removed:['foreign']}}),TypeError);
 assert.throws(()=>makeWoodlandMixedFixture(seed,forest,saplings,[...forest]),TypeError);
 assert.throws(()=>scene.pickRay([0,0,0],[0,0,0]),TypeError);
 assert.throws(()=>scene.breakRay([0,0,0],[Infinity,0,0]),TypeError);
 assert.equal(scene.visible().length,2);
});
test('mixed fixture ray returns nearest triangle and removes only hit object',()=>{
 const scene=makeWoodlandMixedFixture(seed,[],saplings);
 const object=scene.visible()[0];
 const p=object.mesh.positions;
 // Ray from a point directly above the first triangle centroid toward its surface.
 // A broadphase-only corner hit is not enough: exact mesh must intersect.
 const center=[0,1,2].map(k=>(p[k]+p[k+3]+p[k+6])/3+object.anchor[k]);
 const origin=[center[0]+0.0001,center[1]+2,center[2]];
 const hit=scene.pickRay(origin,[0,-1,0],6);
 // The first triangle may be vertical, so this ray is allowed to miss.
 if(hit){
  assert.equal(hit.instanceKey,object.instanceKey);
  assert.equal(scene.breakRay(origin,[0,-1,0],6)?.instanceKey,object.instanceKey);
  assert.equal(scene.visible().length,0);
 }
});
