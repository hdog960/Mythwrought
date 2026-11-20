import test from 'node:test';
import assert from 'node:assert/strict';
import {exportEnvironmentV1,validateEnvironmentV1,COORDINATOR_SHA} from '../../src/nonblock-environments24/v1-bridge.mjs';
const families=['stalagmite','stalactite','crystal','icicle','agave'];
test('all 20 four-variant D/E objects conform to the pinned v1 descriptor shape',()=>{
 const keys=new Set();
 for(const family of families)for(let variant=0;variant<4;variant++){
  const o=exportEnvironmentV1(family,{seed:179,anchor:[17,-12,-33],variant});
  assert.equal(validateEnvironmentV1(o),true);
  assert.equal(o.coordinatorSha,COORDINATOR_SHA);
  assert.equal(o.render.mesh.positions.length,o.render.triangleCount*9);
  assert.equal(o.render.mesh.materials.length,o.render.triangleCount);
  assert.equal(o.persistence.key,o.instanceKey);
  assert.ok(!keys.has(o.instanceKey));keys.add(o.instanceKey);
 }
 assert.equal(keys.size,20);
});
test('v1 key uses full safe-integer identity and world-space AABB',()=>{
 const a=exportEnvironmentV1('crystal',{seed:179,anchor:[4,-12,8],variant:2});
 const b=exportEnvironmentV1('crystal',{seed:179+2**32,anchor:[4,-12,8],variant:2});
 assert.notEqual(a.instanceKey,b.instanceKey);
 assert.match(a.instanceKey,/^nb1:nonblock%3Ae%3Acrystal-shard:179:4,-12,8:2$/);
 assert.ok(a.selectionAabbs[0].min[0]<4&&a.selectionAabbs[0].max[0]>4);
 assert.throws(()=>exportEnvironmentV1('crystal',{seed:179,anchor:[4,-12,8],variant:7}));
 assert.throws(()=>exportEnvironmentV1('crystal',{seed:179,anchor:[Number.MAX_SAFE_INTEGER+1,-12,8]}));
});
test('forged v1 tombstone, malformed pick volume and mesh fail closed',()=>{
 const o=exportEnvironmentV1('stalagmite',{seed:-77,anchor:[2,-8,9]});
 assert.throws(()=>validateEnvironmentV1({...o,instanceKey:'forged'}));
 assert.throws(()=>validateEnvironmentV1({...o,selectionAabbs:[{min:[0,0,0],max:[1,1,1]}]}));
 assert.throws(()=>validateEnvironmentV1({...o,render:{...o.render,mesh:{...o.render.mesh,positions:new Float32Array(1)}}}));
});
