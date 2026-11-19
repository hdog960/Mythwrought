import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCaveRubbleCluster,validateCaveRubbleCluster,CAVE_RUBBLE_SCENE_ID} from '../../src/nonblock-environments24/cave-rubble-cluster.mjs';
test('four fractured rubble variants have finite bounded triangle geometry',()=>{
 for(let variant=0;variant<4;variant++){
  const a=makeCaveRubbleCluster({seed:179,anchor:[4,-30,7],variant});
  assert.equal(a.sceneId,CAVE_RUBBLE_SCENE_ID);
  assert.equal(a.mesh.triangleCount,(3+variant)*10);
  assert.equal(a.mesh.positions.length,a.mesh.triangleCount*9);
  assert.equal(a.selectionAabbs.length,3+variant);
  assert.ok(a.mesh.positions.every(Number.isFinite));
  for(const box of a.selectionAabbs)assert.ok(box.min.every((n,i)=>Number.isFinite(n)&&n<=box.max[i]));
  assert.equal(validateCaveRubbleCluster(a),true);
  assert.deepEqual(a,makeCaveRubbleCluster({seed:179,anchor:[4,-30,7],variant}));
 }
});
test('stable identity, protected mount proposal, break and tombstone contracts',()=>{
 const a=makeCaveRubbleCluster({seed:1,anchor:[0,0,0]});
 assert.notEqual(a.instanceKey,makeCaveRubbleCluster({seed:2,anchor:[0,0,0]}).instanceKey);
 assert.notEqual(a.instanceKey,makeCaveRubbleCluster({seed:1,anchor:[1,0,0]}).instanceKey);
 assert.equal(a.breakIntent.targetKey,a.persistence.key);
 assert.equal(a.attachment.requiresClear,true);
 assert.equal(a.spawn,'explicit-opt-in-only');
 assert.equal(a.integrationStatus,'source-candidate-only');
});
test('reject malformed and forged geometry, attachment and removal descriptors',()=>{
 for(const x of [{seed:1,anchor:[0,0,0],variant:4},{seed:1,anchor:[.5,0,0]},{seed:Infinity,anchor:[0,0,0]}])assert.throws(()=>makeCaveRubbleCluster(x),TypeError);
 const a=makeCaveRubbleCluster({seed:1,anchor:[0,0,0]});
 assert.throws(()=>validateCaveRubbleCluster({...a,selectionAabbs:[]}),/noncanonical/);
 assert.throws(()=>validateCaveRubbleCluster({...a,breakIntent:{action:'none'}}),/noncanonical/);
 assert.throws(()=>validateCaveRubbleCluster({...a,attachment:{face:'ceiling'}}),/noncanonical/);
});
