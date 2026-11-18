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

test('corrupt meshes and malformed grouping identity fail closed',()=>{
 const original=objects(2026)[0];
 const corrupted=Float32Array.from(original.render.mesh.positions);
 corrupted[0]=NaN;
 assert.throws(()=>planFittingBatches([{...original,render:{...original.render,mesh:{...original.render.mesh,positions:corrupted}}}]),/invalid/);
 const infinite=Float32Array.from(original.render.mesh.positions);
 infinite[1]=Infinity;
 assert.throws(()=>planFittingBatches([{...original,render:{...original.render,mesh:{...original.render.mesh,positions:infinite}}}]),/invalid/);
 assert.throws(()=>planFittingBatches([{...original,render:{...original.render,mesh:{...original.render.mesh,materials:new Uint8Array(0)}}}]),/invalid/);
 assert.throws(()=>planFittingBatches([{...original,variant:'0'}]),/invalid/);
 assert.throws(()=>planFittingBatches([{...original,variant:4}]),/invalid/);
});

test('global object and triangle budgets fail closed across otherwise valid batches',()=>{
 const props=objects(179);
 const total=props.reduce((sum,o)=>sum+o.render.triangleCount,0);
 assert.equal(planFittingBatches(props,{maxTotalTriangles:total}).totalTriangles,total);
 assert.throws(()=>planFittingBatches(props,{maxTotalTriangles:total-1}),/global fitting batch budget/);
 assert.throws(()=>planFittingBatches(props,{maxObjects:4}),/global fitting batch budget/);
 for(const budget of [0,-1,1.5,NaN,Infinity]){
  assert.throws(()=>planFittingBatches(props,{maxObjects:budget}),/invalid batch budget/);
  assert.throws(()=>planFittingBatches(props,{maxTotalTriangles:budget}),/invalid batch budget/);
 }
});
test('unregistered palette material indices cannot enter mobile batches',()=>{
 const prop=objects(-77)[0],bad=Uint8Array.from(prop.render.mesh.materials);
 bad[0]=255;
 assert.throws(()=>planFittingBatches([{...prop,render:{...prop.render,mesh:{...prop.render.mesh,materials:bad}}}]),/invalid/);
});
