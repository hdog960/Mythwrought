import test from 'node:test';
import assert from 'node:assert/strict';
import {createNonblockInteractiveSession} from '../src/nonblock-scene48/interactive-session.mjs';
import {prepareBreakableObjectDraws} from '../src/nonblock-scene48/breakable-draw-preparation.mjs';
import {stagePreparedBreakableDraws} from '../src/nonblock-scene48/gpu-instance-staging.mjs';

const placements=[
 {sceneId:'scene48:low-grass',anchor:[0,0,0]},
 {sceneId:'scene48:short-fern',anchor:[2,0,0]}
];
const stage=session=>stagePreparedBreakableDraws(
 prepareBreakableObjectDraws(session,{position:[0,0,0]}));
const keys=staged=>staged.batches.flatMap(b=>b.instanceKeys);

test('GPU instance offsets retain corresponding deterministic pick keys in draw order',()=>{
 const session=createNonblockInteractiveSession({seed:31,placements});
 const staged=stage(session);
 assert.equal(staged.instances,2);
 assert.deepEqual(new Set(keys(staged)),new Set(session.visible().map(o=>o.instanceKey)));
 for(const batch of staged.batches){
  assert.ok(Object.isFrozen(batch.instanceKeys));
  assert.equal(batch.instanceKeys.length,batch.instanceCount);
  for(let i=0;i<batch.instanceCount;i++){
   const object=session.visible().find(o=>o.instanceKey===batch.instanceKeys[i]);
   assert.ok(object);
   assert.deepEqual([...batch.offsets.slice(i*3,i*3+3)],object.anchor);
  }
 }
});

test('removed objects lose GPU pick identity and stay removed after tombstone reload',()=>{
 const session=createNonblockInteractiveSession({seed:31,placements});
 const before=keys(stage(session));
 const hit=session.breakAt([0,0,-2],[0,0,1]);
 assert.equal(hit.removed,true);
 assert.ok(before.includes(hit.instanceKey));
 assert.ok(!keys(stage(session)).includes(hit.instanceKey));
 const restored=createNonblockInteractiveSession({seed:31,placements,sidecarSnapshot:session.snapshot()});
 assert.deepEqual(keys(stage(restored)),keys(stage(session)));
});

test('different seeds preserve distinct staged identities',()=>{
 const a=stage(createNonblockInteractiveSession({seed:31,placements}));
 const b=stage(createNonblockInteractiveSession({seed:32,placements}));
 assert.equal(a.instances,b.instances);
 assert.ok(keys(a).every(key=>!keys(b).includes(key)));
});
