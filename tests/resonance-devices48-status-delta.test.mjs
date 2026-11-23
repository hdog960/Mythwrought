import test from 'node:test';
import assert from 'node:assert/strict';
import {buildStatusDelta} from '../src/resonance/devices48/status-delta-v1.mjs';
const frame=(tick,devices,extra={})=>({seed:7,tick,produced:8,stored:12,devices,...extra});
test('restoration remains explicitly candidate-only',()=>{
 const result=buildStatusDelta(frame(1,[{id:'lamp',requested:4,supplied:0}]),frame(2,[{id:'lamp',requested:4,supplied:4}]));
 assert.equal(result.events[0].kind,'candidate-restored');
 assert.equal(result.authoritative,false);
 assert.equal(result.productionBound,false);
 assert.equal(result.aggregates.usedDelta,4);
 assert.ok(Object.isFrozen(result.events));
});
test('deterministic order and interruption',()=>{
 const a=frame(3,[{id:'z',requested:3,supplied:3},{id:'a',requested:2,supplied:2}]);
 const b=frame(4,[{id:'a',requested:2,supplied:0},{id:'z',requested:3,supplied:0}]);
 assert.deepEqual(buildStatusDelta(a,b).events.map(e=>e.id),['a','z']);
 assert.deepEqual(buildStatusDelta(a,b).events.map(e=>e.kind),['candidate-interrupted','candidate-interrupted']);
});
test('rejects stale, foreign and changed rosters',()=>{
 const a=frame(2,[{id:'a',requested:1,supplied:1}]);
 assert.throws(()=>buildStatusDelta(a,frame(2,[{id:'a',requested:1,supplied:1}])));
 assert.throws(()=>buildStatusDelta(a,frame(3,[{id:'a',requested:1,supplied:1}],{seed:8})));
 assert.throws(()=>buildStatusDelta(a,frame(3,[{id:'b',requested:1,supplied:1}])));
});
test('rejects malformed or over-budget frames',()=>{
 const a=frame(1,[]);
 assert.throws(()=>buildStatusDelta(a,frame(2,[{id:'x',requested:1,supplied:2}])));
 assert.throws(()=>buildStatusDelta(a,frame(2,[],{stored:-1})));
});
