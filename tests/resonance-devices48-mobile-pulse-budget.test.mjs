import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMobilePulseBudget,MOBILE_PULSE_BUDGET_V1} from '../src/resonance/devices48/mobile-pulse-budget-v1.mjs';
const frame=(tick,devices)=>({seed:7,tick,produced:16,stored:12,devices});
const ids=Array.from({length:10},(_,i)=>'d'+String(i).padStart(2,'0'));
const before=frame(1,ids.map(id=>({id,requested:1,supplied:1})));
const after=frame(2,ids.map(id=>({id,requested:1,supplied:0})));
test('three supported phone landscapes have deterministic capped descriptors and omission accounting',()=>{
 for(const [width,height,limit] of [[667,375,3],[844,390,5],[932,430,8]]){
  const result=buildMobilePulseBudget(before,after,{width,height});
  assert.equal(result.visible.length,limit);
  assert.equal(result.omitted,10-limit);
  assert.deepEqual(result.visible.map(p=>p.id),ids.slice(0,limit));
  assert.equal(result.authoritative,false);
  assert.equal(result.productionBound,false);
  assert.equal(result.rendererBound,false);
  assert.equal(result.placement,'gameplay-owned-safe-area');
  assert.ok(Object.isFrozen(result.visible));
  assert.ok(Object.isFrozen(result.visible[0]));
 }
 assert.equal(MOBILE_PULSE_BUDGET_V1.maxVisible,8);
});
test('reduced motion retains status without animation',()=>{
 const result=buildMobilePulseBudget(before,after,{width:667,height:375,reducedMotion:true});
 assert.equal(result.visible.length,3);
 assert.ok(result.visible.every(p=>p.durationTicks===0&&p.intensity===0));
});
test('fail closed for unsupported viewport, stale frame and changed roster',()=>{
 for(const [width,height] of [[667,390],[844,375],[932,375],[0,0],[667.5,375]])
  assert.throws(()=>buildMobilePulseBudget(before,after,{width,height}));
 assert.throws(()=>buildMobilePulseBudget(before,after,{width:667,height:375,reducedMotion:1}));
 assert.throws(()=>buildMobilePulseBudget(before,before,{width:667,height:375}));
 assert.throws(()=>buildMobilePulseBudget(before,frame(2,[]),{width:667,height:375}));
});
test('interruptions outrank restoration when display budget is tight',()=>{
 const a=frame(1,[{id:'a',requested:1,supplied:0},{id:'b',requested:1,supplied:1},{id:'c',requested:1,supplied:1},{id:'d',requested:1,supplied:1}]);
 const b=frame(2,[{id:'a',requested:1,supplied:1},{id:'b',requested:1,supplied:0},{id:'c',requested:1,supplied:0},{id:'d',requested:1,supplied:0}]);
 const result=buildMobilePulseBudget(a,b,{width:667,height:375});
 assert.deepEqual(result.visible.map(p=>p.id),['b','c','d']);
 assert.equal(result.omitted,1);
});
