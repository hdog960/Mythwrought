import test from 'node:test';
import assert from 'node:assert/strict';
import {describeResonancePulse as pulse} from '../src/resonance/devices48/pulse-descriptor-v1.mjs';
const status=(tick=1,requested=5,observed=2)=>({schema:'resonance48-status-descriptor-v1',worldId:'w',simulationTick:tick,
 status:requested===0?'idle':requested===observed?'observed-satisfied':observed===0?'observed-unpowered':'observed-partial',
 requested,observed,deficit:requested-observed,historyTicks:1,windowDeficit:requested-observed,
 authoritativeDelivery:false,energized:false,movementAuthorized:false,productionBound:false});
test('partial output is gold and never authoritative',()=>{const x=pulse(null,status());assert.equal(x.palette,'rune-gold');assert.equal(x.intensity,1);assert.equal(x.energized,false);assert.equal(x.movementAuthorized,false);assert.ok(Object.isFrozen(x));});
test('satisfied is blue descriptor only',()=>{const x=pulse(null,status(1,5,5));assert.equal(x.palette,'rune-blue');assert.equal(x.authoritativeDelivery,false);});
test('unpowered and idle never glow',()=>{assert.equal(pulse(null,status(1,5,0)).intensity,0);assert.equal(pulse(null,status(1,0,0)).palette,'none');});
test('steady tick is deterministic',()=>{const a=status(1),b=status(2);assert.deepEqual(pulse(a,b),pulse(a,b));assert.equal(pulse(a,b).kind,'steady');});
test('state transition signals event',()=>{assert.equal(pulse(status(1),status(2,5,5)).kind,'status-change');});
test('stale, skipped, cross-world rejected',()=>{assert.throws(()=>pulse(status(1),status(1)));assert.throws(()=>pulse(status(1),status(3)));assert.throws(()=>pulse(status(1),{...status(2),worldId:'z'}));});
test('forged energized and authority rejected',()=>{assert.throws(()=>pulse(null,{...status(),energized:true}));assert.throws(()=>pulse(null,{...status(),authoritativeDelivery:true}));assert.throws(()=>pulse({...status(),movementAuthorized:true},status(2)));});
test('tampered totals and status rejected',()=>{assert.throws(()=>pulse(null,{...status(),deficit:1}));assert.throws(()=>pulse(null,{...status(),status:'observed-satisfied'}));assert.throws(()=>pulse(null,{...status(),windowDeficit:0}));});
test('bad previous status rejected',()=>{assert.throws(()=>pulse({...status(),status:'idle'},status(2)));});
