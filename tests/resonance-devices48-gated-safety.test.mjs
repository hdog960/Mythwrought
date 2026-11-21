import test from 'node:test';
import assert from 'node:assert/strict';
import {createDevice} from '../src/resonance/devices48/consumer-v1.mjs';
import {createControl,createControlFrame} from '../src/resonance/devices48/controls-v1.mjs';
import {gatedDemand,applyGatedAllocation} from '../src/resonance/devices48/gated-consumer-v1.mjs';
const seed=42;
const gate=createDevice({id:'gate_a',type:'gate',seed,anchor:[0,0,0]});
const lever=createControl({id:'lever_a',seed,kind:'lever',initial:true});
const frame=createControlFrame([lever],{seed,tick:0});
test('valid enabled control powers gated device only with full allocation',()=>{
 const snapshot=gatedDemand([gate],frame,[{deviceId:'gate_a',controlId:'lever_a'}]);
 assert.equal(snapshot.demand[0].requested,3);
 assert.equal(applyGatedAllocation(snapshot,[{id:'gate_a',granted:3}],{seed,tick:0})[0].mode,'running');
 assert.equal(applyGatedAllocation(snapshot,[{id:'gate_a',granted:2}],{seed,tick:0})[0].mode,'stopped');
});
test('foreign world and duplicate devices fail closed',()=>{
 assert.throws(()=>gatedDemand([{...gate,seed:99}],frame,[]));
 assert.throws(()=>gatedDemand([gate,gate],frame,[]));
});
test('tampered snapshot and duplicate grants are rejected',()=>{
 const snapshot=gatedDemand([gate],frame,[]);
 assert.throws(()=>applyGatedAllocation({...snapshot,demand:[{id:'gate_a',requested:0,priority:1}]},[],{seed,tick:0}));
 assert.throws(()=>applyGatedAllocation(snapshot,[{id:'gate_a',granted:1},{id:'gate_a',granted:1}],{seed,tick:0}));
});
test('disabled controls request zero and cannot consume grants',()=>{
 const off=createControlFrame([createControl({id:'lever_a',seed,kind:'lever',initial:false})],{seed,tick:0});
 const snapshot=gatedDemand([gate],off,[{deviceId:'gate_a',controlId:'lever_a'}]);
 assert.equal(snapshot.demand[0].requested,0);
 assert.throws(()=>applyGatedAllocation(snapshot,[{id:'gate_a',granted:1}],{seed,tick:0}));
 assert.equal(applyGatedAllocation(snapshot,[],{seed,tick:0})[0].mode,'off');
});
