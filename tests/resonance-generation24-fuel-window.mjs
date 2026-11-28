import test from 'node:test';
import assert from 'node:assert/strict';
import {describeGenerator} from '../src/resonance/generation24/index.mjs';
import {evaluateFuelWindow} from '../src/resonance/generation24/fuel-window.mjs';
const d=model=>describeGenerator({id:'fuel',model,seed:7,anchor:[0,1,2]});
const sample=(tick,inputs)=>({observedTick:tick,verified:true,inputs});
test('repeated snapshots cannot spend the same fuel twice',()=>{
 const r=evaluateFuelWindow(d('heat'),[0,1,2,3].map(t=>sample(t,{heatPresent:true,fuelUnits:2})),0,2);
 assert.equal(r.fuelConsumed,2);assert.equal(r.remainingFuel,0);assert.equal(r.generated,14);
 assert.deepEqual(r.states.map(s=>s.status),['available','available','blocked','blocked']);
});
test('split windows conserve remaining budget',()=>{
 const a=evaluateFuelWindow(d('heat'),[sample(4,{heatPresent:true,fuelUnits:4})],4,2);
 const b=evaluateFuelWindow(d('heat'),[sample(5,{heatPresent:true,fuelUnits:4}),sample(6,{heatPresent:true,fuelUnits:4})],5,a.remainingFuel);
 assert.equal(a.generated+b.generated,14);assert.equal(a.fuelConsumed+b.fuelConsumed,2);
});
test('missing observations and invalid fuel fail closed',()=>{
 assert.throws(()=>evaluateFuelWindow(d('heat'),[sample(3,{heatPresent:true,fuelUnits:1})],2,1));
 assert.throws(()=>evaluateFuelWindow(d('heat'),[sample(2,{heatPresent:true,fuelUnits:1.5})],2,1));
 assert.throws(()=>evaluateFuelWindow(d('heat'),[],0,-1));
});
test('crystal generation is independent of fuel reservation',()=>{
 const r=evaluateFuelWindow(d('crystal'),[sample(0,{crystalPresent:true}),sample(1,{crystalPresent:true})],0,0);
 assert.equal(r.generated,6);assert.equal(r.fuelConsumed,0);
});
