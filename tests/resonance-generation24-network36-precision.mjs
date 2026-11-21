import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTRACT} from '../src/resonance/generation24/index.mjs';
import {toNetwork36Candidate} from '../src/resonance/generation24/network36-integer.mjs';
const reading = n => ({contract:CONTRACT.id,instanceKey:'precision-fixture',availablePerTick:n,capacityPerTick:Math.max(2,n)});
test('million submicro ticks never mint one unit from only 0.51 input',()=>{
 let checkpoint=null, delivered=0;
 for(let tick=0;tick<1000000;tick++){
  const r=toNetwork36Candidate(reading(0.00000051),tick,checkpoint);
  delivered+=r.output;checkpoint=r.checkpoint;
 }
 assert.equal(delivered,0);
 assert.equal(checkpoint.remainderMicro,0);
});
test('ordinary half-unit ticks conserve integer output',()=>{
 let checkpoint=null, total=0;
 for(let tick=0;tick<20;tick++){
  const r=toNetwork36Candidate(reading(0.5),tick,checkpoint);total+=r.output;checkpoint=r.checkpoint;
 }
 assert.equal(total,10);assert.equal(checkpoint.remainderMicro,0);
});
test('conservative floor never overstates cumulative input for decimal fractions',()=>{
 for(const rate of [0.00000051,0.123456789,0.99999999,1.00000001]){
  let checkpoint=null,total=0;
  for(let tick=0;tick<10000;tick++){
   const r=toNetwork36Candidate(reading(rate),tick,checkpoint);total+=r.output;checkpoint=r.checkpoint;
  }
  assert.ok(total<=rate*10000,`${rate}: ${total} exceeds ${rate*10000}`);
 }
});
test('invalid overflow and replay fail closed',()=>{
 assert.throws(()=>toNetwork36Candidate(reading(1e12),0),/unsafe/);
 const a=toNetwork36Candidate(reading(0.5),0);
 assert.throws(()=>toNetwork36Candidate(reading(0.5),0,a.checkpoint),/checkpoint/);
});
