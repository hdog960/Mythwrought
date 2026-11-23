import test from 'node:test';
import assert from 'node:assert/strict';
import {auditStepTrace} from '../src/movement12/trace-audit.mjs';
const p=(x=0,y=1,z=0)=>({x,y,z});
const trace=()=>({frames:[{time:0,start:p(),end:p()},{time:.05,start:p(),end:p(.2)},{time:.1,start:p(.2),end:p(.4)}]});
test('accepts bounded continuous movement without claiming world geometry',()=>{const r=auditStepTrace(trace());assert.equal(r.valid,true);assert.equal(r.geometryCertified,false);});
test('rejects teleport-sized displacement',()=>{const t=trace();t.frames[1].end=p(3);t.frames[2].start=p(3);assert.equal(auditStepTrace(t).violations[0].kind,'horizontal-speed');});
test('rejects disconnected frame starts',()=>{const t=trace();t.frames[2].start=p(5);assert.ok(auditStepTrace(t).violations.some(v=>v.kind==='continuity'));});
test('rejects duplicate time',()=>{const t=trace();t.frames[2].time=.05;assert.ok(auditStepTrace(t).violations.some(v=>v.kind==='time'));});
test('rejects excessive vertical travel',()=>{const t=trace();t.frames[1].end=p(.2,10);assert.ok(auditStepTrace(t).violations.some(v=>v.kind==='vertical-speed'));});
test('rejects malformed nonfinite coordinates',()=>{const t=trace();t.frames[1].end.x=NaN;assert.throws(()=>auditStepTrace(t));});
test('rejects malformed empty trace',()=>assert.throws(()=>auditStepTrace({frames:[]})));
test('rejects moving anchor',()=>{const t=trace();t.frames[0].end=p(.1);assert.ok(auditStepTrace(t).violations.some(v=>v.kind==='anchor'));});

test('rejects malformed collision event booleans',()=>{const t=trace();t.frames[1].event={hitWall:'false'};assert.throws(()=>auditStepTrace(t),/Malformed/);});
test('rejects collision events on zero-time anchor',()=>{const t=trace();t.frames[0].event={jumped:true};assert.ok(auditStepTrace(t).violations.some(v=>v.kind==='anchor-event'));});
test('accepts real stepPlayer-shaped collision event flags',()=>{const t=trace();t.frames[1].event={stepped:false,landed:false,jumped:false,hitWall:true,ceiling:false};assert.equal(auditStepTrace(t).valid,true);});
test('rejects array pretending to be collision event',()=>{const t=trace();t.frames[1].event=[];assert.throws(()=>auditStepTrace(t),/Malformed/);});

test('rejects missing collision evidence on a non-anchor frame',()=>{
  const frames=[{time:0,start:{x:0,y:0,z:0},end:{x:0,y:0,z:0},event:null},{time:1/60,start:{x:0,y:0,z:0},end:{x:0,y:0,z:0}}];
  assert.throws(()=>auditStepTrace({frames,source:'injected-stepPlayer'}),/Malformed trace frame 1/);
});

test('rejects null collision evidence on a non-anchor frame',()=>{
  const frames=[{time:0,start:{x:0,y:0,z:0},end:{x:0,y:0,z:0},event:null},{time:1/60,start:{x:0,y:0,z:0},end:{x:0,y:0,z:0},event:null}];
  assert.throws(()=>auditStepTrace({frames,source:'injected-stepPlayer'}),/Malformed trace frame 1/);
});
