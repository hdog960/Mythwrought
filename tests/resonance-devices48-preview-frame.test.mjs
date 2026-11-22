import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDevicePreviewFrame} from '../src/resonance/devices48/preview-frame-v1.mjs';
const specs=[{id:'lamp_a',type:'lamp',anchor:[1,2,3],enabled:true},{id:'gate_b',type:'gate',anchor:[4,2,3],enabled:true}];
test('genuine consumer/status/pulse source handshake, stable under input order',()=>{
 const input={seed:42,tick:12,specs,grants:[{id:'lamp_a',granted:1},{id:'gate_b',granted:0}],produced:4,stored:8};
 const a=buildDevicePreviewFrame(input),b=buildDevicePreviewFrame({...input,specs:[...specs].reverse(),grants:[...input.grants].reverse()});
 assert.deepEqual(a,b);assert.equal(a.status.used,1);assert.equal(a.status.deficit,3);
 assert.equal(a.states.find(x=>x.id==='gate_b').motionAllowed,false);
 assert.equal(a.productionBound,false);
});
test('safe power loss, disabled demand and no fabricated motion',()=>{
 const a=buildDevicePreviewFrame({seed:2,tick:0,specs:[{...specs[1],enabled:false}]});
 assert.equal(a.demand[0].requested,0);assert.equal(a.states[0].mode,'off');assert.equal(a.pulses.length,0);
 const b=buildDevicePreviewFrame({seed:2,tick:0,specs:[specs[1]]});
 assert.equal(b.states[0].mode,'stopped');assert.equal(b.states[0].motionAllowed,false);
});
test('reject duplicates, unknown and excess grants, wrong seed, oversized frames',()=>{
 const base={seed:3,tick:4,specs:[specs[0]]};
 for(const patch of [{specs:[specs[0],specs[0]]},{grants:[{id:'other',granted:1}]},{grants:[{id:'lamp_a',granted:2}]},{grants:[{id:'lamp_a',granted:1},{id:'lamp_a',granted:1}]},{specs:[{...specs[0],anchor:[1.5,2,3]}]},{specs:Array(65).fill(specs[0])}])
 assert.throws(()=>buildDevicePreviewFrame({...base,...patch}));
});
