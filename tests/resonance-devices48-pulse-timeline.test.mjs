import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPulseTimeline,PULSE_TIMELINE_V1} from '../src/resonance/devices48/pulse-timeline-v1.mjs';
const frame=(tick,devices,extra={})=>({seed:7,tick,produced:8,stored:12,devices,...extra});
const before=frame(1,[{id:'z',requested:2,supplied:0},{id:'a',requested:2,supplied:2}]);
const after=frame(2,[{id:'a',requested:2,supplied:0},{id:'z',requested:2,supplied:2}]);
test('deterministic sorted pulses with explicit candidate provenance',()=>{
 const result=buildPulseTimeline(before,after);
 assert.deepEqual(result.pulses.map(x=>x.id),['a','z']);
 assert.deepEqual(result.pulses.map(x=>x.tone),['amber','rune-blue']);
 assert.equal(result.authoritative,false);
 assert.equal(result.productionBound,false);
 assert.equal(result.pulses[0].source,'candidate-only');
 assert.ok(Object.isFrozen(result.pulses));
 assert.ok(Object.isFrozen(result.pulses[0]));
 assert.equal(PULSE_TIMELINE_V1.maxPulses,16);
});
test('reduced motion removes animation without removing status signal',()=>{
 const result=buildPulseTimeline(before,after,{reducedMotion:true});
 assert.deepEqual(result.pulses.map(x=>x.durationTicks),[0,0]);
 assert.deepEqual(result.pulses.map(x=>x.intensity),[0,0]);
 assert.equal(result.pulses[0].kind,'candidate-interrupted');
});
test('bounded pulse budget exposes omissions deterministically',()=>{
 const result=buildPulseTimeline(before,after,{maxPulses:1});
 assert.equal(result.pulses.length,1);
 assert.equal(result.omitted,1);
 assert.equal(result.pulses[0].id,'a');
});
test('fail closed on invalid budgets, stale ticks and changed rosters',()=>{
 for(const opts of [{maxPulses:17},{maxPulses:-1},{maxPulses:0.5},{reducedMotion:1}])
   assert.throws(()=>buildPulseTimeline(before,after,opts));
 assert.throws(()=>buildPulseTimeline(before,before));
 assert.throws(()=>buildPulseTimeline(before,frame(2,[{id:'other',requested:1,supplied:1}])));
});
