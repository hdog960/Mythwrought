import test from 'node:test';
import assert from 'node:assert/strict';
import {fixtureInstance,makeOptInBreakFixture} from '../src/nonblock-scene48/opt-in-break-fixture.mjs';
import {intersectSelectionAabb,pickBreakableRay,breakPickedRay} from '../src/nonblock-scene48/ray-pick-fixture.mjs';
const a={sceneId:'scene48:clover-clump',seed:12,anchor:[10,4,-2],variant:2};
test('slab ray intersection respects distance, direction, parallel axes and origin inside',()=>{
 const box={min:[1,-1,-1],max:[2,1,1]};
 assert.equal(intersectSelectionAabb([0,0,0],[1,0,0],box,2),1);
 assert.equal(intersectSelectionAabb([0,0,0],[-1,0,0],box,10),null);
 assert.equal(intersectSelectionAabb([0,2,0],[1,0,0],box,10),null);
 assert.equal(intersectSelectionAabb([1.5,0,0],[1,0,0],box,10),0);
 assert.equal(intersectSelectionAabb([0,0,0],[2,0,0],box,.9),null);
 assert.throws(()=>intersectSelectionAabb([0,0,0],[0,0,0],box),/invalid/);
});
test('nearest shaped object is selected, broken, and absent after tombstone reload',()=>{
 const b={...a,anchor:[12,4,-2]},fixture=makeOptInBreakFixture([a,b]);
 const near=fixtureInstance(a).selectionAabb;
 const center=near.min.map((v,i)=>(v+near.max[i])/2);
 const ray={origin:[center[0]-3,center[1],center[2]],direction:[1,0,0],maxDistance:8};
 const hit=pickBreakableRay(fixture,ray);
 assert.equal(hit?.instanceKey,fixtureInstance(a).instanceKey);
 assert.equal(breakPickedRay(fixture,ray)?.instanceKey,hit.instanceKey);
 assert.notEqual(pickBreakableRay(fixture,ray)?.instanceKey,hit.instanceKey);
 const reloaded=makeOptInBreakFixture([a,b],fixture.tombstoneSidecar().removed);
 assert.equal(reloaded.visible().length,1);
 assert.equal(reloaded.visible()[0].instanceKey,fixtureInstance(b).instanceKey);
});
test('ray selection rejects invalid reach and never breaks out-of-reach targets',()=>{
 const f=makeOptInBreakFixture([a]),box=f.visible()[0].selectionAabb;
 const ray={origin:[box.min[0]-20,(box.min[1]+box.max[1])/2,(box.min[2]+box.max[2])/2],direction:[1,0,0],maxDistance:2};
 assert.equal(breakPickedRay(f,ray),null);assert.equal(f.visible().length,1);
 assert.throws(()=>pickBreakableRay(f,{...ray,maxDistance:-1}),/invalid/);
});
