import test from 'node:test';
import assert from 'node:assert/strict';
import {COORDINATOR_SHA,exportEnvironmentV1,validateEnvironmentV1} from '../../src/nonblock-environments24/v1-bridge.mjs';

// :24-only exhaustive v1 export witness. This does not register D/E with :48,
// place objects in production, or claim runtime breaking.
const families=['stalagmite','stalactite','crystal','icicle','agave'];
const seeds=[-77,0,179,2026];
const anchor=[13,-8,21];

test('all twenty v1-eligible family/variant pairs have distinct stable identities and source meshes',()=>{
 const ids=new Set();
 for(const family of families)for(let variant=0;variant<4;variant++){
  const a=exportEnvironmentV1(family,{seed:179,anchor,variant});
  const b=exportEnvironmentV1(family,{seed:179,anchor,variant});
  assert.equal(validateEnvironmentV1(a),true);
  assert.equal(a.instanceKey,b.instanceKey);
  assert.deepEqual([...a.render.mesh.positions],[...b.render.mesh.positions]);
  assert.ok(!ids.has(a.instanceKey),'duplicate family/variant identity');
  ids.add(a.instanceKey);
  assert.equal(a.coordinatorSha,COORDINATOR_SHA);
  assert.equal(a.breakIntent.targetKey,a.instanceKey);
  assert.equal(a.persistence.key,a.instanceKey);
  assert.equal(a.persistence.defaultRespawn,'never-until-explicit-reset');
  assert.equal(a.render.instanced,true);
  assert.ok(a.render.triangleCount>0&&a.render.triangleCount<=128);
  assert.ok(a.selectionAabbs.length>0);
 }
 assert.equal(ids.size,20);
});

test('all v1 eligible families remain deterministic and seed-separated',()=>{
 for(const family of families)for(let variant=0;variant<4;variant++){
  const keys=new Set();
  for(const seed of seeds){
   const a=exportEnvironmentV1(family,{seed,anchor,variant});
   assert.equal(validateEnvironmentV1(a),true);
   assert.ok(!keys.has(a.instanceKey));
   keys.add(a.instanceKey);
  }
  assert.equal(keys.size,seeds.length);
 }
});

test('source mesh and pick envelopes cannot be altered after export without failing validation',()=>{
 for(const family of families){
  const a=exportEnvironmentV1(family,{seed:179,anchor,variant:0});
  a.render.mesh.positions[0]+=0.125;
  assert.throws(()=>validateEnvironmentV1(a),/noncanonical|invalid|escapes/);
  const b=exportEnvironmentV1(family,{seed:179,anchor,variant:0});
  b.selectionAabbs[0].max[0]+=0.125;
  assert.throws(()=>validateEnvironmentV1(b),/noncanonical|invalid/);
 }
});

test('unsupported v1 variants fail closed rather than claiming all forty variants are bridged',()=>{
 for(const family of families)for(const variant of [4,5,6,7])
  assert.throws(()=>exportEnvironmentV1(family,{seed:179,anchor,variant}),TypeError);
});
