import test from 'node:test';
import assert from 'node:assert/strict';
import {describeGenerator} from '../src/resonance/generation24/index.mjs';
import {resumeGenerator} from '../src/resonance/generation24/resume.mjs';
const d=model=>describeGenerator({id:'fixture',model,seed:41,anchor:[2,3,4]});
const s=(tick,inputs,verified=true)=>({observedTick:tick,verified,inputs});
test('verified water restart, interruption and recovery produce bounded deterministic output',()=>{
 const samples=[s(20,{waterPresent:true,flow:1}),s(21,{waterPresent:false,flow:0}),s(22,{waterPresent:true,flow:0.5})];
 const a=resumeGenerator(d('waterwheel'),samples,20,23);
 assert.equal(a.generated,7.5);assert.deepEqual(a.statuses,['available','blocked','available']);
 assert.deepEqual(a,resumeGenerator(d('waterwheel'),samples,20,23));
});
test('no unobserved unloaded-time power or invented wind',()=>{
 assert.throws(()=>resumeGenerator(d('windmill'),[s(0,{exposed:true,wind:1})],0,2));
 assert.throws(()=>resumeGenerator(d('windmill'),[s(0,{exposed:true,wind:1},false)],0,1));
 assert.throws(()=>resumeGenerator(d('windmill'),[s(2,{exposed:true,wind:1})],0,1));
});
test('heat consumes only bounded verified per-tick fuel; crystal stays steady',()=>{
 const heat=resumeGenerator(d('heat'),[s(1,{heatPresent:true,fuelUnits:1}),s(2,{heatPresent:true,fuelUnits:0})],1,3);
 assert.equal(heat.generated,7);assert.equal(heat.fuelConsumed,1);
 const crystal=resumeGenerator(d('crystal'),[s(1,{crystalPresent:true}),s(2,{crystalPresent:true})],1,3);
 assert.equal(crystal.generated,6);assert.equal(crystal.fuelConsumed,0);
});
test('catchup limits fail closed',()=>{
 assert.throws(()=>resumeGenerator(d('crystal'),[],0,61));
 assert.throws(()=>resumeGenerator(d('crystal'),[],5,4));
});
