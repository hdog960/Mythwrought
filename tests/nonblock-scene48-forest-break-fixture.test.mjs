import test from 'node:test';
import assert from 'node:assert/strict';
import {makeForestBreakFixture,FOREST_FIXTURE_VERSION} from '../src/nonblock-scene48/forest-break-fixture.mjs';
const specs=[{sceneId:'scene48:exposed-root',seed:7,anchor:[0,0,0]},{sceneId:'scene48:fallen-branch',seed:7,anchor:[0,0,3]}];
test('forest objects are selectable, breakable, and absent after tombstone reload',()=>{
 const session=makeForestBreakFixture(specs);
 assert.equal(session.visible().length,2);
 const hit=session.pickRay([0,0.1,-2],[0,0,1],5);
 assert.ok(hit);assert.equal(hit.object.sceneId,'scene48:exposed-root');
 assert.equal(session.breakByKey(hit.object.instanceKey),true);
 assert.equal(session.breakByKey(hit.object.instanceKey),false);
 assert.equal(session.visible().length,1);
 const sidecar=session.tombstoneSidecar();
 assert.equal(sidecar.version,FOREST_FIXTURE_VERSION);
 const restored=makeForestBreakFixture(specs,sidecar);
 assert.equal(restored.visible().length,1);
 assert.equal(restored.visible()[0].sceneId,'scene48:fallen-branch');
});
test('reach, seed identity, and malformed rays fail closed',()=>{
 const session=makeForestBreakFixture(specs);
 assert.equal(session.pickRay([0,0.1,-2],[0,0,1],1),null);
 assert.throws(()=>session.pickRay([0,0,0],[0,0,0]),TypeError);
 assert.throws(()=>session.pickRay([0,0,0],[NaN,0,1]),TypeError);
 assert.throws(()=>makeForestBreakFixture([specs[0],specs[0]]),/duplicate/);
 assert.throws(()=>makeForestBreakFixture(specs,{version:'wrong',removed:[]}),TypeError);
 const other=makeForestBreakFixture([{...specs[0],seed:8}]);
 assert.notEqual(other.visible()[0].instanceKey,session.visible()[0].instanceKey);
});
