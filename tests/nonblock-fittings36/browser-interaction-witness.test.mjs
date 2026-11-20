import test from 'node:test';
import assert from 'node:assert/strict';
import {makeWitnessObjects,captureFittingsInteraction,REQUIRED_WITNESS_SIZES} from '../src/nonblock-fittings36/browser-interaction-witness.mjs';
test('all five witness objects have distinct deterministic shaped identities and break intents',()=>{
 const a=makeWitnessObjects(36),b=makeWitnessObjects(36);
 assert.equal(a.length,5);
 assert.deepEqual(a.map(x=>x.instanceKey),b.map(x=>x.instanceKey));
 assert.equal(new Set(a.map(x=>x.instanceKey)).size,5);
 for(const o of a){
  assert.ok(o.render.mesh.triangleCount>0);
  assert.equal(o.breakIntent.targetKey,o.instanceKey);
  assert.equal(o.persistence.defaultRespawn,'never-until-explicit-reset');
  assert.ok(o.selectionAabbs.length>0);
 }
});
test('browser witness refuses unsupported viewport before touching canvas',()=>{
 assert.throws(()=>captureFittingsInteraction({canvas:{},width:100,height:100,onStage:()=>{}}),/unsupported viewport/);
 assert.deepEqual(REQUIRED_WITNESS_SIZES,[[667,375],[844,390],[932,430]]);
});
test('browser witness requires explicit stage observer and genuine canvas methods',()=>{
 assert.throws(()=>captureFittingsInteraction({canvas:{},width:667,height:375,onStage:()=>{}}),/real browser canvas/);
 assert.throws(()=>captureFittingsInteraction({canvas:{},width:667,height:375}),/stage evidence callback/);
});
