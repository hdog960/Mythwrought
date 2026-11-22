import test from 'node:test';
import assert from 'node:assert/strict';
import {compareStatusFrames} from '../src/resonance/devices48/status-transition-v1.mjs';
const sourceSha='0cc51c6a89fce1a9928216caeebf2930b5e07f45';
const d=(id,requested,delivered)=>({id,requested,delivered,deficit:requested-delivered,state:requested===delivered?'supplied':'stopped'});
const frame=(tick,devices)=>({contract:'resonance-devices48-receipt-status-v1',seed:8,tick,sourceSha,devices,
 requested:devices.reduce((s,d)=>s+d.requested,0),delivered:devices.reduce((s,d)=>s+d.delivered,0),
 deficit:devices.reduce((s,d)=>s+d.deficit,0),authoritative:false,productionBound:false});
const a=frame(5,[d('lamp',1,1),d('gate',3,0)]), b=frame(6,[d('gate',3,3),d('lamp',1,0)]);
const opts={expectedSeed:8,expectedNetworkSha:sourceSha};
test('deterministic restore and interruption, no physical action',()=>{
 const x=compareStatusFrames(a,b,opts);
 assert.deepEqual(x.events.map(e=>[e.id,e.transition,e.visual]),[['gate','restored','rune-blue'],['lamp','interrupted','amber']]);
 assert.equal(x.authoritative,false);assert.equal(x.productionBound,false);
 assert.deepEqual(x.physicalActions,[]);assert.ok(Object.isFrozen(x.events));
 assert.deepEqual(x,compareStatusFrames(frame(5,[...a.devices].reverse()),frame(6,[...b.devices].reverse()),opts));
});
test('steady frames emit no pulse',()=>{
 const x=compareStatusFrames(a,frame(6,[...a.devices]),opts);
 assert.ok(x.events.every(e=>e.transition==='steady'&&e.visual==='none'));
});
test('reject stale, skipped, replayed and foreign frames',()=>{
 for(const f of [a,frame(7,b.devices),{...b,seed:9},{...b,sourceSha:'a'.repeat(40)},{...b,authoritative:true}])
  assert.throws(()=>compareStatusFrames(a,f,opts));
});
test('reject malformed accounting, duplicate or changed identities',()=>{
 for(const f of [{...b,delivered:100},{...b,devices:[b.devices[0],b.devices[0]]},
  frame(6,[d('other',3,3),d('lamp',1,0)]),frame(6,[d('gate',3,4),d('lamp',1,0)]),
  {...b,devices:[{...b.devices[0],state:'stopped'},b.devices[1]]}])
  assert.throws(()=>compareStatusFrames(a,f,opts));
});
