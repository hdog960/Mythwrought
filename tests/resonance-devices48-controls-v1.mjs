import test from 'node:test';
import assert from 'node:assert/strict';
import {stepDeviceControls} from '../src/resonance/devices48/device-controls-v1.mjs';
const devices=[{id:'switch',type:'lever'},{id:'light',type:'lamp',controlId:'switch'},{id:'pulse',type:'button',durationTicks:2},{id:'beacon',type:'lamp',controlId:'pulse'}];
const run=(previous,tick,actions=[],ds=devices)=>stepDeviceControls(previous,{worldId:'world',tick,actions,devices:ds});
test('deterministic lever/button request transitions; never claim delivered power',()=>{
 let a=run(null,0,[{id:'switch',kind:'toggle'},{id:'pulse',kind:'press'}]);
 assert.deepEqual(a.outputs.map(o=>o.requested),[true,true]);
 assert.equal(a.outputs[0].energized,false);
 a=run(a.state,1); assert.deepEqual(a.outputs.map(o=>o.requested),[true,true]);
 a=run(a.state,2); assert.deepEqual(a.outputs.map(o=>o.requested),[false,true]);
 a=run(a.state,3,[{id:'switch',kind:'toggle'}]); assert.deepEqual(a.outputs.map(o=>o.requested),[false,false]);
});
test('fail closed on replay and cross-world frames',()=>{
 const a=run(null,0); assert.throws(()=>run(a.state,0));
 assert.throws(()=>stepDeviceControls(a.state,{worldId:'other',tick:1,devices,actions:[]}));
});
test('reject duplicate actions, invalid target, and duplicate devices',()=>{
 assert.throws(()=>run(null,0,[{id:'switch',kind:'toggle'},{id:'switch',kind:'toggle'}]));
 assert.throws(()=>run(null,0,[{id:'light',kind:'press'}]));
 assert.throws(()=>run(null,0,[],[...devices,devices[0]]));
});
test('reject invalid button duration and missing control',()=>{
 assert.throws(()=>run(null,0,[],[{id:'b',type:'button',durationTicks:0}]));
 assert.throws(()=>run(null,0,[],[{id:'light',type:'lamp',controlId:'missing'}]));
});
