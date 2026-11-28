import test from 'node:test';
import assert from 'node:assert/strict';
import {describeGenerator,evaluateGenerator} from '../src/resonance/generation24/index.mjs';
import {toNetwork36Candidate,INTEGER_HANDOFF} from '../src/resonance/generation24/network36-integer.mjs';
const d=describeGenerator({id:'wheel',model:'waterwheel',seed:1,anchor:[1,2,3]});
const reading=evaluateGenerator(d,{waterPresent:true,flow:0.5});
test('fractional generator output accumulates without creating extra integer power',()=>{
 let prior=null,total=0;
 for(let tick=0;tick<4;tick++){const r=toNetwork36Candidate(reading,tick,prior);total+=r.output;prior=r.checkpoint;
 assert.equal(r.delivered,false);assert.equal(r.fuelWithdrawn,false);}
 assert.equal(total,10);assert.equal(prior.remainderMicro,0);
});
test('blocked generator cannot release fractional remainder as invented energy',()=>{
 const half=evaluateGenerator(d,{waterPresent:true,flow:0.5});
 const partial=toNetwork36Candidate({...half,availablePerTick:0.5},0);
 const blocked=evaluateGenerator(d,{});
 const next=toNetwork36Candidate(blocked,1,partial.checkpoint);
 assert.equal(next.output,0);assert.equal(next.checkpoint.remainderMicro,500000);
});
test('rejects replay, substitution, invalid amounts and unsafe arithmetic',()=>{
 const first=toNetwork36Candidate(reading,0);
 assert.throws(()=>toNetwork36Candidate(reading,0,first.checkpoint),/checkpoint/);
 assert.throws(()=>toNetwork36Candidate({...reading,instanceKey:'other'},1,first.checkpoint),/checkpoint/);
 assert.throws(()=>toNetwork36Candidate({...reading,availablePerTick:Infinity},1),/invalid/);
 assert.throws(()=>toNetwork36Candidate(reading,Number.MAX_SAFE_INTEGER),/tick/);
 assert.equal(first.contract,INTEGER_HANDOFF);
});
