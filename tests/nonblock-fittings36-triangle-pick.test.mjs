import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting,createFittingFixture,FITTINGS} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {pickFittingTriangle,proposedBreakFromPick} from '../src/nonblock-fittings36/triangle-pick-fixture.mjs';
const mounts={ground:{below:true},ceiling:{above:true},wall:{behind:true},corner:{corner:true}};
const obj=(sceneId,orientation=0,anchor=[0,0,0],seed=179)=>describeFitting({sceneId,orientation,anchor,seed,mount:mounts[FITTINGS[sceneId].attachment]});
test('real signboard triangles can be picked at four cardinal orientations and return deterministic break intent',()=>{
 for(const orientation of [0,1,2,3]){
  const o=obj('scene36:signpost',orientation);
  const origin=orientation===0?[0,1.6,2]:orientation===1?[-2,1.6,0]:orientation===2?[0,1.6,-2]:[2,1.6,0];
  const direction=origin.map((v,i)=>i===1?0:-Math.sign(v));
  const hit=pickFittingTriangle([o],{origin,direction,maxDistance:3});
  assert.ok(hit,'oriented mesh must be selectable');
  assert.equal(hit.instanceKey,o.instanceKey);
  assert.deepEqual(proposedBreakFromPick(hit),{action:'remove-object',targetKey:o.instanceKey,requiresOwner:':00',persistVia:'schema1-external-tombstone-sidecar'});
 }
});
test('triangle pick rejects AABB-only empty air and respects solid-block occlusion',()=>{
 const o=obj('scene36:signpost');
 assert.equal(pickFittingTriangle([o],{origin:[.4,1,2],direction:[0,0,-1]}),null);
 assert.equal(pickFittingTriangle([o],{origin:[0,1.6,2],direction:[0,0,-1],blockedDistance:1}),null);
 assert.equal(pickFittingTriangle([o],{origin:[0,1.6,2],direction:[0,0,-1],maxDistance:.5}),null);
});
test('nearest visible triangle wins; seed and saved fixture tombstones remain independent',()=>{
 const near=obj('scene36:signpost',0,[0,0,0],179),far=obj('scene36:signpost',0,[0,0,-2],179);
 const ray={origin:[0,1.6,3],direction:[0,0,-1],maxDistance:8};
 const hit=pickFittingTriangle([far,near],ray);
 assert.equal(hit.instanceKey,near.instanceKey);
 const fixture=createFittingFixture(179,[near,far]);
 fixture.breakObject(near);
 assert.equal(pickFittingTriangle(fixture.visible(),ray).instanceKey,far.instanceKey);
 const restored=createFittingFixture(179,[near,far]);restored.restore(fixture.snapshot());
 assert.equal(pickFittingTriangle(restored.visible(),ray).instanceKey,far.instanceKey);
 assert.equal(near.breakIntent.requiresOwner,':00');
});
test('all five original family meshes can be passed through isolated picker without world mutation',()=>{
 for(const sceneId of Object.keys(FITTINGS)){
  const o=obj(sceneId);
  const result=pickFittingTriangle([o],{origin:[0,1,3],direction:[0,0,-1],maxDistance:5});
  assert.ok(result===null||result.instanceKey===o.instanceKey);
 }
 assert.throws(()=>pickFittingTriangle([],{origin:[0,0,0],direction:[0,0,0]}),RangeError);
 assert.throws(()=>pickFittingTriangle([],{origin:[0,0,0],direction:[1,0,0],blockedDistance:-1}),TypeError);
 assert.throws(()=>proposedBreakFromPick(null),TypeError);
});
