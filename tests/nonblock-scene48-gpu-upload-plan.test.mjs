import test from 'node:test';
import assert from 'node:assert/strict';
import {planBreakableGpuUploads} from '../src/nonblock-scene48/gpu-upload-plan.mjs';
const mesh={positions:new Float32Array([0,0,0,1,0,0,0,1,0]),materials:new Uint8Array([1])};
function fixture(){
 const batches=['a','b'].map((key)=>({mesh,sceneId:'scene48:grass',variant:0,offsets:new Float32Array([0,0,key==='a'?0:1]),instanceKeys:[key],instanceCount:1}));
 return {batches,bytes:24,geometryBytes:37,totalBytes:61,instances:2,uniqueMeshes:1};
}
test('shared geometry uploads once while preserving ordered pick identities',()=>{
 const plan=planBreakableGpuUploads(fixture());
 assert.equal(plan.meshes.length,1);assert.equal(plan.commands.length,2);
 assert.deepEqual(plan.commands.map(c=>c.instanceKeys[0]),['a','b']);
 assert.equal(plan.totalBytes,61);
});
test('rejects mismatched census, duplicate identities and nonfinite uploads',()=>{
 const a=fixture();a.instances=3;assert.throws(()=>planBreakableGpuUploads(a),/mismatch/);
 const b=fixture();b.batches[1].instanceKeys=['a'];assert.throws(()=>planBreakableGpuUploads(b),/duplicate/);
 const c=fixture();c.batches[0].offsets[0]=NaN;assert.throws(()=>planBreakableGpuUploads(c),/nonfinite/);
});
test('enforces explicit draw and byte limits',()=>{
 assert.throws(()=>planBreakableGpuUploads(fixture(),{maxDrawCalls:1}),/draw call/);
 assert.throws(()=>planBreakableGpuUploads(fixture(),{maxTotalBytes:60}),/budget/);
});
