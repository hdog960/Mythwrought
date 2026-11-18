import test from 'node:test';
import assert from 'node:assert/strict';
import {describeFitting} from '../src/nonblock-fittings36/fittings-phase1.mjs';
import {planFittingBatches} from '../src/nonblock-fittings36/mobile-batch-plan.mjs';
const fixtures=[
 ['scene36:signpost',{below:true}],['scene36:hanging-chain',{above:true}],
 ['scene36:cloth-banner',{behind:true}],['scene36:hanging-cobweb',{corner:true}],
 ['scene36:rope-coil',{below:true}]
];
const objects=seed=>fixtures.map(([sceneId,mount],i)=>describeFitting({sceneId,seed,anchor:[i*4,0,0],mount,orientation:i%4}));
test('five independent shaped props batch deterministically for four seeds',()=>{
 for(const seed of [179,1,2026,-77]){
  const props=objects(seed),a=planFittingBatches(props),b=planFittingBatches([...props].reverse());
  assert.deepEqual(a,b);assert.equal(a.objectCount,5);
  assert.equal(a.batches.flatMap(x=>x.instanceKeys).length,5);
  assert.equal(a.totalTriangles,props.reduce((n,o)=>n+o.render.triangleCount,0));
  assert.ok(a.batches.every(x=>x.triangles<=4096&&x.instanceKeys.length<=256));
 }
});
test('hard caps split batches without dropping or duplicating identities',()=>{
 const props=Array.from({length:8},(_,i)=>describeFitting({sceneId:'scene36:signpost',seed:179,anchor:[i*3,0,0],mount:{below:true},variant:0}));
 const per=props[0].render.triangleCount;
 const result=planFittingBatches(props,{maxTriangles:per*2,maxInstances:2});
 assert.equal(result.batches.length,4);assert.ok(result.batches.every(x=>x.triangles===per*2));
 assert.equal(new Set(result.batches.flatMap(x=>x.instanceKeys)).size,8);
});
test('duplicate keys and impossible triangle budgets fail closed',()=>{
 const props=objects(1);
 assert.throws(()=>planFittingBatches([props[0],props[0]]),/invalid/);
 assert.throws(()=>planFittingBatches(props,{maxTriangles:1}),/invalid/);
 assert.throws(()=>planFittingBatches(props,{maxInstances:257}),/invalid/);
 assert.throws(()=>planFittingBatches([{...props[0],render:{...props[0].render,triangleCount:0}}]),/invalid/);
});
