import test from 'node:test';
import assert from 'node:assert/strict';
import {GpuFrameAdmission} from '../src/gpu-frame-admission.mjs';
function mock(){
 let id=0;return {SYNC_GPU_COMMANDS_COMPLETE:1,TIMEOUT_EXPIRED:2,ALREADY_SIGNALED:3,CONDITION_SATISFIED:4,WAIT_FAILED:5,lost:false,completed:0,deleted:[],polls:[],
 fenceSync(){return ++id;},clientWaitSync(...p){this.polls.push(p);return p[0]<=this.completed?3:2;},
 deleteSync(f){this.deleted.push(f);},flush(){},isContextLost(){return this.lost;},getError(){throw Error('must not consume GL error queue');}};
}
test('two outstanding frames maximum; ordered retirement and no synchronous wait',()=>{
 const gl=mock(),a=new GpuFrameAdmission(gl),draws=[];
 assert.ok(a.run(1,t=>draws.push(t)));assert.ok(a.run(2,t=>draws.push(t)));
 for(let i=3;i<10;i++)assert.equal(a.run(i,t=>draws.push(t)),false);
 assert.equal(a.stats().pending,2);gl.completed=1;assert.ok(a.run(10,t=>draws.push(t)));
 assert.deepEqual(gl.deleted,[1]);assert.deepEqual(draws,[1,2,10]);assert.equal(a.stats().pending,2);
 gl.completed=3;assert.ok(a.run(11,t=>draws.push(t)));assert.deepEqual(gl.deleted,[1,2,3]);assert.ok(gl.polls.every(p=>p[1]===0&&p[2]===0));
});
test('loss discards both invalid handles without deletion; restore starts empty',()=>{
 const gl=mock(),a=new GpuFrameAdmission(gl);a.run(1,()=>{});a.run(2,()=>{});gl.lost=true;
 assert.equal(a.run(3,()=>{throw Error('draw lost');}),false);assert.equal(a.stats().pending,0);assert.deepEqual(gl.deleted,[]);
 gl.lost=false;assert.ok(a.run(4,()=>{}));assert.equal(a.stats().pending,1);
});
test('reset retires exactly two handles once',()=>{const gl=mock(),a=new GpuFrameAdmission(gl);a.run(1,()=>{});a.run(2,()=>{});a.reset();a.reset();assert.deepEqual(gl.deleted,[1,2]);});
test('wait failure retires owned handles and falls back to original rendering',()=>{const gl=mock(),a=new GpuFrameAdmission(gl);a.run(1,()=>{});a.run(2,()=>{});gl.clientWaitSync=()=>gl.WAIT_FAILED;assert.ok(a.run(3,()=>{}));assert.deepEqual(gl.deleted,[1,2]);assert.equal(a.stats().enabled,false);assert.equal(a.stats().faults,1);});
test('allocation failure cleans existing fence and retains original draw exception',()=>{const gl=mock(),a=new GpuFrameAdmission(gl);a.run(1,()=>{});gl.fenceSync=()=>null;a.run(2,()=>{});assert.deepEqual(gl.deleted,[1]);assert.equal(a.stats().enabled,false);assert.throws(()=>a.run(3,()=>{throw Error('draw');}),/draw/);});
