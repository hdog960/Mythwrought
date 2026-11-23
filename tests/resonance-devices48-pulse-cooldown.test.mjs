import test from 'node:test';
import assert from 'node:assert/strict';
import {scheduleCandidatePulses} from '../src/resonance/devices48/pulse-cooldown-v1.mjs';
const pulse=(id,kind,tick)=>({id,kind,tick,source:'candidate-only'});
const frame=(toTick,visible,seed=7)=>({seed,toTick,visible,authoritative:false,productionBound:false,rendererBound:false});
test('restoration flicker throttled but interruption always emitted',()=>{
 const a=scheduleCandidatePulses(null,frame(1,[pulse('a','candidate-restored',1)]));
 const b=scheduleCandidatePulses(a.state,frame(2,[pulse('a','candidate-changed',2)]));
 assert.equal(b.suppressed,1);assert.equal(b.emitted.length,0);
 const c=scheduleCandidatePulses(b.state,frame(3,[pulse('a','candidate-interrupted',3)]));
 assert.equal(c.emitted.length,1);
 const d=scheduleCandidatePulses(c.state,frame(7,[pulse('a','candidate-restored',7)]));
 assert.equal(d.emitted.length,1);
});
test('priority and ordering deterministic, results frozen',()=>{
 const f=frame(4,[pulse('z','candidate-restored',4),pulse('b','candidate-interrupted',4),pulse('a','candidate-interrupted',4)]);
 const a=scheduleCandidatePulses(null,f),b=scheduleCandidatePulses(null,{...f,visible:[...f.visible].reverse()});
 assert.deepEqual(a,b);assert.deepEqual(a.emitted.map(e=>e.id),['a','b','z']);
 assert.ok(Object.isFrozen(a.state.lastEmitted));assert.ok(Object.isFrozen(a.emitted[0]));
});
test('provenance, duplicate identities, stale ticks fail closed',()=>{
 const a=scheduleCandidatePulses(null,frame(1,[pulse('a','candidate-restored',1)]));
 assert.throws(()=>scheduleCandidatePulses(a.state,frame(1,[])));
 assert.throws(()=>scheduleCandidatePulses(a.state,frame(2,[],8)));
 assert.throws(()=>scheduleCandidatePulses(null,frame(2,[pulse('a','candidate-restored',2),pulse('a','candidate-restored',2)])));
 assert.throws(()=>scheduleCandidatePulses(null,{...frame(2,[]),authoritative:true}));
 assert.throws(()=>scheduleCandidatePulses(null,frame(2,[]),{cooldownTicks:121}));
});
