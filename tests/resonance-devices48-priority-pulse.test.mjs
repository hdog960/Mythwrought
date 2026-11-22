import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPriorityPulseFrame} from '../src/resonance/devices48/priority-pulse-v1.mjs';
const frame=(tick,devices)=>({seed:7,tick,produced:16,stored:12,devices});
const ids=Array.from({length:16},(_,i)=>'d'+String(i).padStart(2,'0'));
test('interruptions outrank restoration even when the first eight IDs restore',()=>{
 const before=frame(1,ids.map((id,i)=>({id,requested:1,supplied:i<8?0:1})));
 const after=frame(2,ids.map((id,i)=>({id,requested:1,supplied:i<8?1:0})));
 for(const [width,height,max] of [[667,375,3],[844,390,5],[932,430,8]]){
  const r=buildPriorityPulseFrame(before,after,{width,height});
  assert.deepEqual(r.visible.map(x=>x.id),ids.slice(8,8+max));
  assert.ok(r.visible.every(x=>x.kind==='candidate-interrupted'));
  assert.equal(r.omitted,16-max);
  assert.equal(r.authoritative,false);assert.equal(r.rendererBound,false);
  assert.ok(Object.isFrozen(r.visible));assert.ok(Object.isFrozen(r.visible[0]));
 }
});
test('deterministic under shuffled device input and reduced motion',()=>{
 const before=frame(1,ids.map(id=>({id,requested:1,supplied:1})));
 const after=frame(2,ids.map(id=>({id,requested:1,supplied:0})));
 const a=buildPriorityPulseFrame(before,after,{width:667,height:375,reducedMotion:true});
 const b=buildPriorityPulseFrame(frame(1,[...before.devices].reverse()),frame(2,[...after.devices].reverse()),{width:667,height:375,reducedMotion:true});
 assert.deepEqual(a,b);
 assert.ok(a.visible.every(x=>x.durationTicks===0&&x.intensity===0));
});
test('rejects invalid dimensions, stale frames, mismatched worlds, roster changes',()=>{
 const before=frame(1,[{id:'a',requested:1,supplied:1}]);
 const after=frame(2,[{id:'a',requested:1,supplied:0}]);
 for(const [width,height] of [[667,390],[844,375],[932,375],[0,0],[667.5,375]])
  assert.throws(()=>buildPriorityPulseFrame(before,after,{width,height}));
 assert.throws(()=>buildPriorityPulseFrame(before,after,{width:667,height:375,reducedMotion:1}));
 assert.throws(()=>buildPriorityPulseFrame(before,before,{width:667,height:375}));
 assert.throws(()=>buildPriorityPulseFrame(before,{...after,seed:8},{width:667,height:375}));
 assert.throws(()=>buildPriorityPulseFrame(before,frame(2,[]),{width:667,height:375}));
});
