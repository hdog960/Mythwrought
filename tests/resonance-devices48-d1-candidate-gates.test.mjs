import test from 'node:test';
import assert from 'node:assert/strict';
import {stepCandidateGates as step} from '../src/resonance/devices48/candidate-gates-v1.mjs';
const devices=[{id:'lever_a',type:'lever'}];
const gates=[{id:'gate_a',controlId:'lever_a',travelTicks:8}];
const frame=(tick, actions=[], override={})=>({worldId:'world_a',tick,devices,actions,gates,...override});
test('lever requests opening but never authorizes physical movement',()=>{
 const a=step(null,frame(1,[{id:'lever_a',kind:'toggle'}]));
 assert.equal(a.intents[0].requestedOpen,true);
 assert.equal(a.intents[0].requestedUnits,2);
 assert.equal(a.intents[0].movementAuthorized,false);
 assert.equal(a.intents[0].collisionCleared,false);
 assert.equal(a.intents[0].physicalProgress,0);
 assert.equal(a.authoritativeDelivery,false);
 assert.equal(a.physicsBound,false);
 const b=step(a.state,frame(2));
 assert.equal(b.intents[0].requestedOpen,true);
 const c=step(b.state,frame(3,[{id:'lever_a',kind:'toggle'}]));
 assert.equal(c.intents[0].requestedOpen,false);
});
test('rejects changed gate travel, rewiring and removal',()=>{
 const a=step(null,frame(1));
 assert.throws(()=>step(a.state,frame(2,[],{gates:[{...gates[0],travelTicks:9}]})));
 assert.throws(()=>step(a.state,frame(2,[],{gates:[{...gates[0],controlId:'lever_b'}]})));
 assert.throws(()=>step(a.state,frame(2,[],{gates:[]})));
});
test('rejects stale world and invalid control and duplicates',()=>{
 const a=step(null,frame(1));
 assert.throws(()=>step(a.state,frame(1)));
 assert.throws(()=>step(a.state,frame(2,[],{worldId:'world_b'})));
 assert.throws(()=>step(null,frame(1,[],{gates:[gates[0],gates[0]]})));
 assert.throws(()=>step(null,frame(1,[],{gates:[{...gates[0],controlId:'missing'}]})));
});
test('button requests open for bounded ticks without real movement',()=>{
 const d=[{id:'button_a',type:'button',durationTicks:2}];
 const g=[{id:'gate_a',controlId:'button_a',travelTicks:4}];
 const a=step(null,frame(5,[{id:'button_a',kind:'press'}],{devices:d,gates:g}));
 assert.equal(a.intents[0].requestedOpen,true);
 const b=step(a.state,frame(6,[],{devices:d,gates:g}));
 assert.equal(b.intents[0].requestedOpen,true);
 const c=step(b.state,frame(7,[],{devices:d,gates:g}));
 assert.equal(c.intents[0].requestedOpen,false);
 assert.equal(c.intents[0].movementAuthorized,false);
});
