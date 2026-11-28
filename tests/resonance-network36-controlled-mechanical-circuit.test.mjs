import test from 'node:test';
import assert from 'node:assert/strict';
import {createStarterCircuit} from '../src/resonance/network36/starter-circuit.mjs';
import {describeGenerator} from '../src/resonance/generation24/index.mjs';
import {ENVIRONMENT_BRIDGE} from '../src/resonance/generation24/environment-bridge.mjs';
const p=(id,x,y=0,z=0)=>({id,x,y,z,loaded:true});
const evidence=(d,tick,values)=>({authority:ENVIRONMENT_BRIDGE,verified:true,observedTick:tick,instanceKey:d.instanceKey,values});
const channels=[p('a',0)];
test('mechanical generation actually feeds shared lamp/storage allocation with bounded fractional carry',()=>{
 const w=describeGenerator({id:'wheel',seed:1,model:'waterwheel',anchor:[-1,0,0]});
 const c=createStarterCircuit({seed:1,generators:[w],lamps:[{id:'lamp',anchor:[1,0,0]}],stores:[{id:'bat',anchor:[0,1,0],capacity:10,charge:0,inputRate:10,outputRate:0}]});
 const step=(tick,flow)=>c.step({tick,channels,observations:{wheel:evidence(w,tick,{waterPresent:true,flow})}});
 const a=step(0,.5);assert.equal(a.allocation.totals.produced,2);assert.equal(a.receipt.total,1);assert.equal(a.stores[0].charge,1);
 const b=step(1,.5);assert.equal(b.allocation.totals.produced,3);assert.equal(b.stores[0].charge,3);
 const d=step(2,.39);assert.equal(d.allocation.totals.produced,0);assert.equal(d.states[0].mode,'stopped');
 assert.equal(c.step({tick:3,channels}).allocation.totals.produced,0);
});
test('windmill evidence rejects stale, foreign, bare and out-of-range inputs atomically',()=>{
 const w=describeGenerator({id:'wind',seed:1,model:'windmill',anchor:[-1,0,0]});
 const c=createStarterCircuit({seed:1,generators:[w],lamps:[{id:'lamp',anchor:[1,0,0]}]});
 const step=(tick,value)=>c.step({tick,channels,observations:{wind:value}});
 assert.throws(()=>step(0,{exposed:true,wind:1}));
 assert.throws(()=>step(0,evidence(w,1,{exposed:true,wind:1})));
 assert.throws(()=>step(0,{...evidence(w,0,{exposed:true,wind:1}),instanceKey:'foreign'}));
 assert.throws(()=>step(0,evidence(w,0,{exposed:true,wind:1.01})));
 assert.equal(step(0,evidence(w,0,{exposed:false,wind:1})).receipt.total,0);
 assert.equal(step(1,evidence(w,1,{exposed:true,wind:1})).receipt.total,1);
});
test('lever, button and timer alter real demand and receipts before allocation',()=>{
 const c=createStarterCircuit({seed:1,generators:[{id:'crystal',model:'crystal',anchor:[-1,0,0]}],lamps:[{id:'lamp1',anchor:[1,0,0]},{id:'lamp2',anchor:[0,1,0]},{id:'lamp3',anchor:[0,0,1]}],
 controls:[{id:'lever',kind:'lever'},{id:'button',kind:'button'},{id:'timer',kind:'timer',period:2}],
 controlLinks:[{deviceId:'lamp1',controlId:'lever'},{deviceId:'lamp2',controlId:'button'},{deviceId:'lamp3',controlId:'timer'}]});
 const run=(tick,controlEvents=[])=>c.step({tick,channels,observations:{crystal:{crystalPresent:true}},controlEvents});
 const a=run(0,[{id:'lever',action:'toggle'},{id:'button',action:'press'}]);assert.equal(a.receipt.total,3);
 const b=run(1);assert.equal(b.receipt.total,1);assert.equal(b.states.find(s=>s.id==='lamp2').mode,'off');assert.equal(b.states.find(s=>s.id==='lamp3').mode,'off');
 assert.throws(()=>run(2,[{id:'lever',action:'press'}]));
 const d=run(2,[{id:'lever',action:'toggle'}]);assert.equal(d.receipt.total,0);
 assert.equal(run(3).receipt.total,1);
});
test('lever disarms motor demand and continuity; restoration requires two supplied ticks',()=>{
 const c=createStarterCircuit({seed:1,generators:[{id:'c',model:'crystal',anchor:[-1,0,0]}],lamps:[],machines:[{id:'gate',kind:'gate',anchor:[1,0,0],travel:2,speed:.5}],controls:[{id:'lever',kind:'lever'}],controlLinks:[{deviceId:'gate',controlId:'lever'}]});
 const run=(tick,toggle=false)=>c.step({tick,channels,observations:{c:{crystalPresent:true}},commands:{gate:{desired:1,clearance:true}},controlEvents:toggle?[{id:'lever',action:'toggle'}]:[]});
 assert.equal(run(0,true).motions[0].position,0);
 assert.equal(run(1).motions[0].position,.5);
 const off=run(2,true);assert.equal(off.receipt.total,0);assert.equal(off.motions[0].position,.5);
 assert.equal(run(3,true).motions[0].position,.5);
 assert.equal(run(4).motions[0].position,1);
});
