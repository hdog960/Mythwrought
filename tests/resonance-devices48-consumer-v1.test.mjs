import test from 'node:test';
import assert from 'node:assert/strict';
import {createDevice,stepDevices,demandSnapshot,DEVICE_CONTRACT} from '../src/resonance/devices48/consumer-v1.mjs';
const lamp=createDevice({id:'lamp_a',type:'lamp',seed:7,anchor:[0,1,2]});
const gate=createDevice({id:'gate_a',type:'gate',seed:7,anchor:[2,1,2]});
test('contract and priority deterministic regardless of input order',()=>{
 assert.equal(DEVICE_CONTRACT.productionBound,false);
 assert.deepEqual(demandSnapshot([lamp,gate]),demandSnapshot([gate,lamp]));
 assert.deepEqual(demandSnapshot([lamp,gate]).map(x=>x.id),['gate_a','lamp_a']);
});
test('shortage stops gate safely; full supply resumes without destructive event',()=>{
 const devices=[lamp,gate];
 const low=stepDevices(devices,[{id:'lamp_a',granted:1},{id:'gate_a',granted:2}],{tick:1,seed:7});
 assert.equal(low.find(x=>x.id==='gate_a').mode,'stopped');
 assert.equal(low.find(x=>x.id==='gate_a').motionAllowed,false);
 const full=stepDevices(devices,[{id:'lamp_a',granted:1},{id:'gate_a',granted:3}],{tick:2,seed:7});
 assert.equal(full.find(x=>x.id==='gate_a').mode,'running');
 assert.equal(full.find(x=>x.id==='gate_a').motionAllowed,true);
});
test('world isolation and malformed allocations fail closed',()=>{
 assert.throws(()=>stepDevices([lamp],[],{tick:0,seed:8}));
 assert.throws(()=>stepDevices([lamp],[{id:'lamp_a',granted:2}],{tick:0,seed:7}));
 assert.throws(()=>stepDevices([lamp],[{id:'other',granted:1}],{tick:0,seed:7}));
 assert.throws(()=>stepDevices([lamp,lamp],[],{tick:0,seed:7}));
 assert.throws(()=>createDevice({id:'bad',type:'lamp',seed:7,anchor:[NaN,0,0]}));
});
