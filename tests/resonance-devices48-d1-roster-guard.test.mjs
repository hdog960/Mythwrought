import test from 'node:test';
import assert from 'node:assert/strict';
import {stepGuardedDeviceControls as step} from '../src/resonance/devices48/d1-roster-guard-v1.mjs';
const devices=[{id:'lamp_a',type:'lamp',controlId:'lever_a'},{id:'lever_a',type:'lever'}];
const frame=(tick,devicesOverride=devices,actions=[])=>({worldId:'world_a',tick,devices:devicesOverride,actions});
test('deterministic toggle, candidate-only lamp and no authority',()=>{
 const a=step(null,frame(1,devices,[{id:'lever_a',kind:'toggle'}]));
 assert.equal(a.outputs[0].requested,true);
 assert.equal(a.outputs[0].energized,false);
 assert.equal(a.authoritativeDelivery,false);
 assert.equal(a.productionBound,false);
 assert.deepEqual(step(null,frame(1,[...devices].reverse(),[{id:'lever_a',kind:'toggle'}])).outputs,a.outputs);
});
test('rejects silent removal, control rewiring and type changes',()=>{
 const a=step(null,frame(1));
 assert.throws(()=>step(a.state,frame(2,[devices[1]])));
 assert.throws(()=>step(a.state,frame(2,[{...devices[0],controlId:'lever_b'},devices[1]])));
 assert.throws(()=>step(a.state,frame(2,[devices[0],{id:'lever_a',type:'button',durationTicks:3}])));
});
test('rejects forged previous state and stale ticks',()=>{
 const a=step(null,frame(1));
 assert.throws(()=>step({...a.state,devices:[{id:'lever_a',type:'lever',on:'yes'},devices[0]]},frame(2)));
 assert.throws(()=>step(a.state,frame(1)));
 assert.throws(()=>step({...a.state,worldId:'world_b'},frame(2)));
});
test('button duration cannot silently change',()=>{
 const initial=[{id:'button_a',type:'button',durationTicks:3},{id:'lamp_a',type:'lamp',controlId:'button_a'}];
 const a=step(null,frame(1,initial,[{id:'button_a',kind:'press'}]));
 assert.equal(a.outputs[0].requested,true);
 assert.throws(()=>step(a.state,frame(2,[{...initial[0],durationTicks:4},initial[1]])));
 assert.equal(step(a.state,frame(4,initial)).outputs[0].requested,false);
});
