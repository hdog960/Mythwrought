import test from 'node:test';
import assert from 'node:assert/strict';
import {makeSnowgrass,validateSnowgrass,SNOWGRASS_SCENE_ID} from '../../src/nonblock-environments24/snowgrass.mjs';
const options={seed:179,anchor:[10,20,-3],variant:2};
test('snowgrass creates original bounded double-sided geometry with valid pick envelope',()=>{
 const o=makeSnowgrass(options);assert.equal(o.sceneId,SNOWGRASS_SCENE_ID);
 assert.equal(validateSnowgrass(o),true);
 assert.equal(o.mesh.triangleCount,22);
 assert.ok(o.mesh.triangleCount<=o.render.maxTrianglesPerInstance);
 for(let i=0;i<o.mesh.positions.length;i+=3)
  for(let axis=0;axis<3;axis++)assert.ok(o.mesh.positions[i+axis]>=o.selectionAabbs[0].min[axis]-1e-6&&o.mesh.positions[i+axis]<=o.selectionAabbs[0].max[axis]+1e-6);
 assert.equal(o.collisionIntent,'pass-through');assert.equal(o.spawn,'explicit-opt-in-only');
 assert.equal(o.breakIntent.targetKey,o.persistence.key);
});
test('snowgrass identity and geometry are deterministic across seeds, anchors and variants',()=>{
 const a=makeSnowgrass(options),b=makeSnowgrass(options);
 assert.deepEqual(a,b);
 for(const change of [{seed:180},{anchor:[10,21,-3]},{variant:3}]){
  const c=makeSnowgrass({...options,...change});assert.notEqual(c.instanceKey,a.instanceKey);
 }
});
test('snowgrass rejects forged mesh, pick volume, and removal identity',()=>{
 const o=makeSnowgrass(options);
 assert.throws(()=>validateSnowgrass({...o,mesh:{...o.mesh,positions:[...o.mesh.positions.slice(0,-1),999]}}));
 assert.throws(()=>validateSnowgrass({...o,selectionAabbs:[{min:[0,0,0],max:[1,1,1]}]}));
 assert.throws(()=>validateSnowgrass({...o,persistence:{...o.persistence,key:'wrong'}}));
});
test('snowgrass fails closed for unsafe placement identities and variants',()=>{
 for(const bad of [{seed:1.5},{anchor:[0,1,NaN]},{variant:4},{variant:-1},{seed:Number.MAX_SAFE_INTEGER+1}])
  assert.throws(()=>makeSnowgrass({...options,...bad}));
});
