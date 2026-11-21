import test from 'node:test';
import assert from 'node:assert/strict';
import {createControl,createControlFrame,stepControlFrame,controlDemandGate,CONTROL_CONTRACT} from '../src/resonance/devices48/controls-v1.mjs';
const lever=createControl({id:'lever_a',seed:9,kind:'lever'});
const button=createControl({id:'button_a',seed:9,kind:'button'});
const timer=createControl({id:'timer_a',seed:9,kind:'timer',period:2});
test('source-only deterministic ordering and seed isolation',()=>{
 assert.equal(CONTROL_CONTRACT.productionBound,false);
 assert.deepEqual(createControlFrame([lever,button,timer],{seed:9}),createControlFrame([timer,lever,button],{seed:9}));
 assert.throws(()=>createControlFrame([lever],{seed:8}));
 assert.throws(()=>createControlFrame([lever,lever],{seed:9}));
});
test('lever, momentary button and bounded timer',()=>{
 let f=createControlFrame([lever,button,timer],{seed:9});
 f=stepControlFrame([lever,button,timer],f,{tick:1,events:[{id:'lever_a',action:'toggle'},{id:'button_a',action:'press'}]});
 assert.equal(controlDemandGate(f,'lever_a'),true);assert.equal(controlDemandGate(f,'button_a'),true);
 f=stepControlFrame([lever,button,timer],f,{tick:2});
 assert.equal(controlDemandGate(f,'button_a'),false);assert.equal(controlDemandGate(f,'timer_a'),false);
 f=stepControlFrame([lever,button,timer],f,{tick:3,events:[{id:'lever_a',action:'toggle'}]});
 assert.equal(controlDemandGate(f,'lever_a'),false);
 f=stepControlFrame([lever,button,timer],f,{tick:4});assert.equal(controlDemandGate(f,'timer_a'),true);
});
test('rejects invalid events and non-sequential ticks',()=>{
 const f=createControlFrame([lever,button,timer],{seed:9});
 assert.throws(()=>stepControlFrame([lever,button,timer],f,{tick:2}));
 assert.throws(()=>stepControlFrame([lever,button,timer],f,{tick:1,events:[{id:'timer_a',action:'toggle'}]}));
 assert.throws(()=>stepControlFrame([lever,button,timer],f,{tick:1,events:[{id:'lever_a',action:'press'}]}));
 assert.throws(()=>stepControlFrame([lever,button,timer],f,{tick:1,events:[{id:'lever_a',action:'toggle'},{id:'lever_a',action:'toggle'}]}));
 assert.throws(()=>createControl({id:'x',seed:9,kind:'timer',period:0}));
});
