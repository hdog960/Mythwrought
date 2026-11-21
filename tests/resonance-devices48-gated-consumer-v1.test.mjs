import test from 'node:test';
import assert from 'node:assert/strict';
import {createDevice} from '../src/resonance/devices48/consumer-v1.mjs';
import {createControl,createControlFrame,stepControlFrame} from '../src/resonance/devices48/controls-v1.mjs';
import {gatedDemand,applyGatedAllocation,DEVICE_GATE_CONTRACT} from '../src/resonance/devices48/gated-consumer-v1.mjs';
const devices=[createDevice({id:'lamp1',type:'lamp',seed:5,anchor:[0,0,0]}),createDevice({id:'gate1',type:'gate',seed:5,anchor:[1,0,0]})];
const lever=createControl({id:'lever1',seed:5,kind:'lever'});
test('control gates demand and safely stops unpowered devices',()=>{
 assert.equal(DEVICE_GATE_CONTRACT.productionBound,false);
 let frame=createControlFrame([lever],{seed:5});
 let gated=gatedDemand(devices,frame,[{deviceId:'gate1',controlId:'lever1'}]);
 assert.deepEqual(gated.demand.map(d=>[d.id,d.requested]),[['gate1',0],['lamp1',1]]);
 assert.equal(applyGatedAllocation(gated,[{id:'lamp1',granted:1}],{seed:5,tick:0}).find(x=>x.id==='gate1').mode,'off');
 frame=stepControlFrame([lever],frame,{tick:1,events:[{id:'lever1',action:'toggle'}]});
 gated=gatedDemand(devices,frame,[{deviceId:'gate1',controlId:'lever1'}]);
 assert.equal(gated.demand.find(d=>d.id==='gate1').requested,3);
 assert.equal(applyGatedAllocation(gated,[{id:'gate1',granted:0}],{seed:5,tick:1}).find(x=>x.id==='gate1').mode,'stopped');
 assert.equal(applyGatedAllocation(gated,[{id:'gate1',granted:3}],{seed:5,tick:1}).find(x=>x.id==='gate1').mode,'running');
});
test('reject duplicate links, unknown controls and forbidden allocations',()=>{
 const frame=createControlFrame([lever],{seed:5});
 assert.throws(()=>gatedDemand(devices,frame,[{deviceId:'gate1',controlId:'lever1'},{deviceId:'gate1',controlId:'lever1'}]));
 assert.throws(()=>gatedDemand(devices,frame,[{deviceId:'gate1',controlId:'missing'}]));
 const gated=gatedDemand(devices,frame,[{deviceId:'gate1',controlId:'lever1'}]);
 assert.throws(()=>applyGatedAllocation(gated,[{id:'gate1',granted:3}],{seed:5,tick:0}));
 assert.throws(()=>applyGatedAllocation(gated,[{id:'lamp1',granted:2}],{seed:5,tick:0}));
});
