import test from 'node:test';
import assert from 'node:assert/strict';
import {makePebbleScatter,validatePebbleScatter,PEBBLE_SCATTER_SCENE_ID} from '../../src/nonblock-environments24/pebble-scatter.mjs';
test('four deterministic original low-poly pebble arrangements have exact triangle caps',()=>{
 for(let v=0;v<4;v++){
  const a=makePebbleScatter({seed:179,anchor:[4,-30,7],variant:v});
  assert.equal(a.sceneId,PEBBLE_SCATTER_SCENE_ID);
  assert.equal(a.mesh.triangleCount,(3+v)*8);
  assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  assert.equal(a.selectionAabbs.length,3+v);
  assert.ok(a.mesh.positions.every(Number.isFinite));
  assert.ok(a.selectionAabbs.every(b=>b.min.every((n,i)=>n<=b.max[i])));
  assert.equal(validatePebbleScatter(a),true);
  assert.deepEqual(a,makePebbleScatter({seed:179,anchor:[4,-30,7],variant:v}));
 }
});
test('seed and anchor alter stable removal identity, never physical block IDs',()=>{
 const a=makePebbleScatter({seed:1,anchor:[0,0,0]});
 assert.notEqual(a.instanceKey,makePebbleScatter({seed:2,anchor:[0,0,0]}).instanceKey);
 assert.notEqual(a.instanceKey,makePebbleScatter({seed:1,anchor:[1,0,0]}).instanceKey);
 assert.equal(a.breakIntent.targetKey,a.persistence.key);
 assert.equal(a.spawn,'explicit-opt-in-only');
 assert.equal(a.collisionIntent,'pass-through');
});
test('reject malformed identities and forged selection or removal descriptors',()=>{
 for(const input of [{seed:1,anchor:[0,0,0],variant:4},{seed:1,anchor:[0.5,0,0]},{seed:Infinity,anchor:[0,0,0]}])
  assert.throws(()=>makePebbleScatter(input),TypeError);
 const a=makePebbleScatter({seed:1,anchor:[0,0,0]});
 assert.throws(()=>validatePebbleScatter({...a,selectionAabbs:[]}),/noncanonical/);
 assert.throws(()=>validatePebbleScatter({...a,breakIntent:{action:'none'}}),/noncanonical/);
});
