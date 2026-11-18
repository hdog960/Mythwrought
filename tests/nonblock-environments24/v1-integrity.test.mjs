import test from 'node:test';
import assert from 'node:assert/strict';
import {exportEnvironmentV1,validateEnvironmentV1} from '../../src/nonblock-environments24/v1-bridge.mjs';
const make=()=>exportEnvironmentV1('crystal',{seed:2026,anchor:[12,-18,9],variant:2});
test('v1 rejects altered scene, geometry, pick volume, attachment and removal metadata',()=>{
 const o=make();
 assert.equal(validateEnvironmentV1(o),true);
 assert.throws(()=>validateEnvironmentV1({...o,sceneId:'nonblock:e:forged'}));
 assert.throws(()=>validateEnvironmentV1({...o,attachment:{...o.attachment,face:'down'}}));
 assert.throws(()=>validateEnvironmentV1({...o,collisionIntent:'pass-through'}));
 assert.throws(()=>validateEnvironmentV1({...o,breakIntent:{...o.breakIntent,requiresOwner:'other'}}));
 assert.throws(()=>validateEnvironmentV1({...o,persistence:{...o.persistence,defaultRespawn:'immediate'}}));
 assert.throws(()=>validateEnvironmentV1({...o,render:{...o.render,triangleCount:1}}));
 const p=new Float32Array(o.render.mesh.positions);p[0]+=.125;
 assert.throws(()=>validateEnvironmentV1({...o,render:{...o.render,mesh:{...o.render.mesh,positions:p}}}));
 const b=o.selectionAabbs[0];
 assert.throws(()=>validateEnvironmentV1({...o,selectionAabbs:[{min:[b.min[0]-.1,...b.min.slice(1)],max:b.max}]}));
});
test('v1 variants have stable source-specific identity and finite meshes',()=>{
 for(const seed of [179,1,2026,-77])for(const variant of [0,1,2,3]){
  const a=exportEnvironmentV1('icicle',{seed,anchor:[-5,8,12],variant});
  const b=exportEnvironmentV1('icicle',{seed,anchor:[-5,8,12],variant});
  assert.deepEqual(a.instanceKey,b.instanceKey);
  assert.deepEqual(Array.from(a.render.mesh.positions),Array.from(b.render.mesh.positions));
  assert.equal(validateEnvironmentV1(a),true);
 }
});
