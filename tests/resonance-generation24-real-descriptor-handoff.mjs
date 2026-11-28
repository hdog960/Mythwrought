import test from 'node:test';
import assert from 'node:assert/strict';
import {describeGenerator,evaluateGenerator,MODELS} from '../src/resonance/generation24/index.mjs';
import {toNetwork36Candidate} from '../src/resonance/generation24/network36-integer.mjs';
const make=(model)=>describeGenerator({id:'source',model,seed:42,anchor:[1,2,3]});
const conditions={hand:{operator:true},crystal:{crystalPresent:true},waterwheel:{waterPresent:true,flow:0.8},windmill:{exposed:true,wind:0.8},heat:{heatPresent:true,fuelUnits:3}};
test('all five real source descriptors hand off bounded integer candidate outputs',()=>{
 for(const model of Object.keys(MODELS)){
  const descriptor=make(model),evaluation=evaluateGenerator(descriptor,conditions[model]);
  const handoff=toNetwork36Candidate(evaluation,0);
  assert.equal(handoff.networkProposal,'resonance-network36-proposal-v1');
  assert.ok(Number.isSafeInteger(handoff.output)&&handoff.output>=0);
  assert.ok(handoff.output<=evaluation.availablePerTick);
  assert.equal(handoff.delivered,false);assert.equal(handoff.fuelWithdrawn,false);
 }
});
test('environmentally blocked source yields no candidate power',()=>{
 for(const model of ['hand','crystal','waterwheel','windmill','heat']){
  const result=toNetwork36Candidate(evaluateGenerator(make(model),{}),0);
  assert.equal(result.output,0);
 }
});
test('recovery after environmental loss cannot replay prior tick',()=>{
 const descriptor=make('waterwheel');
 const first=toNetwork36Candidate(evaluateGenerator(descriptor,conditions.waterwheel),0);
 const blocked=toNetwork36Candidate(evaluateGenerator(descriptor,{}),1,first.checkpoint);
 const recovered=toNetwork36Candidate(evaluateGenerator(descriptor,conditions.waterwheel),2,blocked.checkpoint);
 assert.equal(blocked.output,0);assert.ok(recovered.output>0);
 assert.throws(()=>toNetwork36Candidate(evaluateGenerator(descriptor,conditions.waterwheel),1,recovered.checkpoint),/checkpoint/);
});
