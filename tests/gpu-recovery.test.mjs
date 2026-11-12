import test from 'node:test';
import assert from 'node:assert/strict';
import {GpuUploadRetry,validateChunkUploadBytes,MAX_CHUNK_UPLOAD_BYTES} from '../src/gpu-recovery.mjs';
test('only packed finite-sized mesh buffers are uploaded to WebGL',()=>{
 assert.equal(validateChunkUploadBytes(new Float32Array(9)),36);
 assert.throws(()=>validateChunkUploadBytes(new Float32Array(8)),/packed vertex/);
 assert.throws(()=>validateChunkUploadBytes(new Float32Array(18),64),/staging budget/);
 assert.throws(()=>validateChunkUploadBytes([1,2,3]),/packed vertex/);
 assert.ok(MAX_CHUNK_UPLOAD_BYTES>=1024*1024);
});
test('exponential bounded GPU retry avoids every-frame infinite OOM reupload',()=>{
 const retry=new GpuUploadRetry({baseDelayMs:250,maxDelayMs:2000}),t=100;
 assert.equal(retry.ready('0,0',t),true);
 let state=retry.fail('0,0',t,'OUT_OF_MEMORY');
 assert.equal(state.attempt,1);assert.equal(state.until,t+250);
 assert.equal(retry.ready('0,0',t+249),false);
 assert.equal(retry.ready('0,1',t+1),true,'Unrelated chunk must make progress');
 state=retry.fail('0,0',t+250,'OOM');
 assert.equal(state.until,t+750);
 assert.equal(state.attempt,2);
 for(let i=3;i<=8;i++)state=retry.fail('0,0',state.until,'OOM');
 assert.ok(state.until<Number.MAX_VALUE);
 assert.equal(state.until-(state.until-2000),2000);
 assert.equal(retry.stats().pendingRetries,1);
 assert.equal(retry.stats().failures,8);
 retry.success('0,0');
 assert.equal(retry.stats().recovered,1);
 assert.equal(retry.ready('0,0',t),true);
});
test('world seed/chunk changes remove stale GPU error states safely',()=>{
 const r=new GpuUploadRetry({baseDelayMs:100,maxDelayMs:1000});
 r.fail('old',10);r.fail('kept',10);
 r.keepOnly(['kept','new']);
 assert.equal(r.ready('old',11),true);
 assert.equal(r.ready('kept',11),false);
 assert.equal(r.stats().pendingRetries,1);
 r.clear();
 assert.equal(r.ready('kept',11),true);
 assert.equal(r.stats().pendingRetries,0);
 assert.equal(r.stats().failures,2,'Diagnostic history should remain visible');
});
test('invalid retry budgets and timestamps hard fail',()=>{
 assert.throws(()=>new GpuUploadRetry({baseDelayMs:0}),/Invalid/);
 assert.throws(()=>new GpuUploadRetry({baseDelayMs:200,maxDelayMs:100}),/Invalid/);
 const r=new GpuUploadRetry();
 assert.throws(()=>r.ready('a',NaN),/Invalid/);
 assert.throws(()=>r.fail('a',Infinity),/Invalid/);
});
