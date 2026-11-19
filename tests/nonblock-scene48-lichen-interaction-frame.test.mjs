import test from 'node:test';
import assert from 'node:assert/strict';
import {createLichenInteractionFrame,LICHEN_FRAME_VERSION} from '../src/nonblock-scene48/lichen-interaction-frame.mjs';
const view=[[-10,-10,-10],[10,10,10]];
const placements=[{anchor:[0,0,0],variant:1},{anchor:[3,0,0],variant:2},{anchor:[6,0,0],variant:3}];
test('all lichen variants have unique removal identities and persist through two reloads',()=>{
 const frame=createLichenInteractionFrame(71,placements,view);
 assert.equal(frame.draw().visibleCount,3);
 const keys=frame.visible().map(o=>o.instanceKey);
 assert.equal(new Set(keys).size,3);
 assert.equal(frame.breakByValidatedKey(keys[1]),true);
 assert.equal(frame.breakByValidatedKey(keys[1]),false);
 assert.equal(frame.draw().visibleCount,2);
 const saved=JSON.parse(JSON.stringify(frame.snapshot()));
 assert.equal(saved.contract,LICHEN_FRAME_VERSION);
 for(let i=0;i<2;i++){
  const reload=createLichenInteractionFrame(71,placements,view,saved);
  assert.deepEqual(reload.visible().map(o=>o.instanceKey),[keys[0],keys[2]]);
  assert.equal(reload.draw().visibleCount,2);
  assert.deepEqual(reload.snapshot().removed,[keys[1]]);
 }
 assert.equal(createLichenInteractionFrame(72,placements,view).draw().visibleCount,3);
});
test('actual lichen mesh triangle is ray-pickable and break removes only its instance',()=>{
 for(let variant=1;variant<=3;variant++){
  const frame=createLichenInteractionFrame(5,[{anchor:[0,0,0],variant}],view);
  const obj=frame.visible()[0],p=obj.mesh.positions;
  const x=(p[0]+p[3]+p[6])/3,z=(p[2]+p[5]+p[8])/3;
  assert.equal(frame.pickRay([x,2,z],[0,-1,0],4)?.instanceKey,obj.instanceKey);
  assert.equal(frame.breakRay([x,2,z],[0,-1,0],4)?.instanceKey,obj.instanceKey);
  assert.equal(frame.pickRay([x,2,z],[0,-1,0],4),null);
  assert.equal(frame.draw().visibleCount,0);
 }
});
test('invalid scope, sidecars, duplicate anchors and GPU budgets fail closed',()=>{
 const one=[placements[0]];
 const frame=createLichenInteractionFrame(71,one,view),key=frame.visible()[0].instanceKey;
 assert.throws(()=>createLichenInteractionFrame(71,one,view,{contract:LICHEN_FRAME_VERSION,seed:72,removed:[key]}),TypeError);
 assert.throws(()=>createLichenInteractionFrame(71,one,view,{contract:LICHEN_FRAME_VERSION,seed:71,removed:['foreign']}),TypeError);
 assert.throws(()=>createLichenInteractionFrame(71,one,view,{contract:LICHEN_FRAME_VERSION,seed:71,removed:[key,key]}),TypeError);
 assert.throws(()=>createLichenInteractionFrame(71,[one[0],one[0]],view),TypeError);
 assert.throws(()=>createLichenInteractionFrame(71,one,view,undefined,{maxTriangles:8,maxBatchTriangles:8}),RangeError);
 assert.equal(frame.draw().visibleCount,1);
});
