import test from 'node:test';
import assert from 'node:assert/strict';
import {compileFittingGpuPayload} from '../src/nonblock-fittings36/gpu-upload-payload.mjs';

// Preflight must reject unsafe user-provided limits without constructing GPU buffers.
test('upload compiler fails closed on invalid and oversized memory caps',()=>{
 for(const cap of [0,-1,NaN,Infinity,1.5,4*1024*1024+1,Number.MAX_SAFE_INTEGER]){
  assert.throws(()=>compileFittingGpuPayload([],{maxUploadBytes:cap}),RangeError);
 }
});
test('empty scene has zero upload bytes under a valid cap',()=>{
 const result=compileFittingGpuPayload([],{maxUploadBytes:1});
 assert.equal(result.uploadBytes,0);
 assert.deepEqual(result.payloads,[]);
});
