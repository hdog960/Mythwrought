import test from 'node:test';
import assert from 'node:assert/strict';
import {GpuFrameAdmission} from '../src/gpu-frame-admission.mjs';
function mock(){
 let id=0;const g={SYNC_GPU_COMMANDS_COMPLETE:1,TIMEOUT_EXPIRED:2,ALREADY_SIGNALED:3,CONDITION_SATISFIED:4,WAIT_FAILED:5,lost:false,state:2,created:[],deleted:[],polls:[],flushes:0,
 fenceSync(){const f=++id;this.created.push(f);return f;},
 clientWaitSync(...a){this.polls.push(a);return this.state;},
 deleteSync(f){this.deleted.push(f);},flush(){this.flushes++;},isContextLost(){return this.lost;},
 getError(){throw Error('Must not consume actual error queue');}};
 return g;
}
test('one outstanding GPU frame and zero-timeout polling',()=>{
 const g=mock(),a=new GpuFrameAdmission(g),frames=[];
 assert.equal(a.run(1,n=>frames.push(n)),true);
 for(let i=2;i<=10;i++)assert.equal(a.run(i,n=>frames.push(n)),false);
 assert.deepEqual(frames,[1]);assert.equal(a.stats().pending,1);
 assert.ok(g.polls.every(p=>p[1]===0&&p[2]===0));
 g.state=g.CONDITION_SATISFIED;assert.equal(a.run(11,n=>frames.push(n)),true);
 assert.deepEqual(frames,[1,11]);assert.deepEqual(g.deleted,[1]);assert.equal(a.stats().pending,1);
});
test('context loss discards invalid fence and does not draw',()=>{
 const g=mock(),a=new GpuFrameAdmission(g);a.run(1,()=>{});g.lost=true;
 assert.equal(a.run(2,()=>{throw Error('draw lost');}),false);assert.deepEqual(g.deleted,[]);
 g.lost=false;assert.equal(a.run(3,()=>{}),true);assert.equal(a.stats().pending,1);
});
test('reset retires only the owned live fence',()=>{
 const g=mock(),a=new GpuFrameAdmission(g);a.run(1,()=>{});a.reset();a.reset();assert.deepEqual(g.deleted,[1]);
});
test('wait failure disables pacing without suppressing original drawing',()=>{
 const g=mock(),a=new GpuFrameAdmission(g);a.run(1,()=>{});g.state=g.WAIT_FAILED;
 assert.equal(a.run(2,()=>{}),true);assert.equal(a.stats().enabled,false);assert.equal(a.stats().faults,1);assert.deepEqual(g.deleted,[1]);
});
test('unavailable fence falls back and original draw exception is not swallowed',()=>{
 const g=mock();g.fenceSync=()=>null;const a=new GpuFrameAdmission(g);a.run(1,()=>{});assert.equal(a.stats().enabled,false);
 assert.throws(()=>a.run(2,()=>{throw Error('draw');}),/draw/);
});
