import test from 'node:test';
import assert from 'node:assert/strict';
import {certifyMountainV8Seam as certify} from '../src/manual-biomes/mountain-v8-seam-certificate.mjs';
const create=(height=(x,z)=>12)=>((x,z,seed)=>({x,z,seed,top:height(x,z),legacyTop:5,
  cap:'slate',biome:'mountain',safeToIntegrate:false,
  generatorIdentityRequired:'v8-new-opt-in'}));
test('five source samples establish connected physical near slopes with strict count',()=>{
  let calls=0;const p=certify(-512,15,179,(x,z,s)=>{calls++;return create()(x,z,s)});
  assert.equal(p.checks,5);assert.equal(calls,5);assert.equal(p.greatestStep,0);
  assert.deepEqual(p.neighbors.map(a=>[a.x,a.z]),[[-511,15],[-513,15],[-512,16],[-512,14]]);
});
test('rejects steep cliff faces without modifying any source or proposing filler',()=>{
  assert.equal(certify(0,0,179,create((x,z)=>x===1?15:12)),null);
  assert.ok(certify(0,0,179,create((x,z)=>x===1?14:12)));
  assert.equal(certify(0,0,179,create(),{maxStep:3}),null);
});
test('source cave and foreign biome veto atomically',()=>{
  assert.equal(certify(0,0,179,(x,z,s)=>x===1?null:create()(x,z,s)),null);
  assert.equal(certify(0,0,179,(x,z,s)=>({...create()(x,z,s),biome:x===-1?'snow':'mountain'})),null);
  assert.equal(certify(0,0,179,(x,z,s)=>({...create()(x,z,s),safeToIntegrate:x===1})),null);
});
test('chunk edges and negative-coordinate seams are independent of traversal',()=>{
  const read=create((x,z)=>12+Math.floor(x/32)*0);
  assert.deepEqual(certify(-16,-1,2026,read),certify(-16,-1,2026,read));
  assert.ok(certify(15,0,2026,read));assert.ok(certify(16,0,2026,read));
});
test('malformed and adversarial source callbacks fail closed',()=>{
  assert.equal(certify(NaN,0,179,create()),null);
  assert.equal(certify(0,0,179.5,create()),null);
  assert.equal(certify(0,0,179,null),null);
  assert.equal(certify(Number.MAX_SAFE_INTEGER,0,179,create()),null);
  assert.equal(certify(0,0,179,(x,z,s)=>({...create()(x,z,s),top:NaN})),null);
});
