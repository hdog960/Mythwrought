import test from 'node:test';
import assert from 'node:assert/strict';
import {createOpaqueNearLifecycle} from './opaque-near-lifecycle.mjs';
import {uploadChunkBuffer} from '../../src/gpu-recovery.mjs';
const attrs=()=>({atPos:0,atColor:1,atUv:2,atMat:3});
function fakeGL(){
 const vaos=new Set(),live=new Set(),deleted=[],calls={getError:0,ptr:0,draw:0,createVao:0,deleteVao:0};
 let current=null,bound=null;
 const gl={ARRAY_BUFFER:34962,FLOAT:5126,TRIANGLES:4,STATIC_DRAW:35044,NO_ERROR:0,
 calls,deleted,vaos,live,
 createBuffer(){const o={id:'b'+(live.size+1)};live.add(o);return o;},
 deleteBuffer(b){deleted.push(b);live.delete(b);},
 bindBuffer(type,b){assert.equal(type,this.ARRAY_BUFFER);bound=b;},
 bufferData(type,v,usage){assert.equal(type,this.ARRAY_BUFFER);assert.equal(usage,this.STATIC_DRAW);assert.ok(bound);},
 getError(){calls.getError++;return 0;},
 createVertexArray(){const o={id:'v'+(++calls.createVao)};vaos.add(o);return o;},
 deleteVertexArray(v){assert.notEqual(v,current);calls.deleteVao++;vaos.delete(v);},
 bindVertexArray(v){current=v;},
 enableVertexAttribArray(){},
 vertexAttribPointer(){calls.ptr++;},
 drawArrays(mode,first,n){assert.equal(mode,this.TRIANGLES);assert.equal(first,0);assert.ok(n>=0);calls.draw++;}
 };return gl;
}
function setup({stop=()=>true,del=null,gl=fakeGL()}={}){
 const originalDelete=del??(c=>{gl.deleteBuffer(c.buffer);if(c.waterBuffer)gl.deleteBuffer(c.waterBuffer)});
 const bridge=createOpaqueNearLifecycle({gl,attributes:attrs(),pipelineProgram:{id:'originalProgram'},originalDeleteChunkBuffers:originalDelete,stopRenderLoop:stop});
 const buffer=()=>uploadChunkBuffer(gl,new Float32Array(9));
 const records=n=>Array.from({length:n},(_,i)=>({buffer:buffer(),count:3,id:i,waterBuffer:buffer()}));
 return {gl,bridge,records};
}
for(const n of [0,1,2,9,25,27,34])test('original draw count and cached warm redraw '+n,()=>{
 const {gl,bridge,records}=setup();const items=records(n);
 const e=gl.calls.getError;const first=bridge.render(items);const second=bridge.render(items);
 assert.equal(first.draws,n);assert.equal(second.draws,n);assert.equal(second.frameHits,n);
 assert.equal(gl.calls.draw,n*2);assert.equal(gl.calls.getError,e);
 assert.equal(bridge.status().cache.residentVaos,n);
});
test('immediate VAO forget precedes original opaque AND water buffer deletion',()=>{
 const {gl,bridge,records}=setup();const chunks=records(2);
 bridge.render(chunks);
 const old=chunks[0],baseline=gl.calls.deleteVao;
 bridge.deleteChunkBuffers(old);
 assert.equal(gl.calls.deleteVao,baseline+1);
 assert.deepEqual(gl.deleted.slice(-2),[old.buffer,old.waterBuffer]);
 assert.equal(bridge.status().cache.residentVaos,1);
});
test('edit replacing opaque buffers cannot retain old VAO reference',()=>{
 const {bridge,records,gl}=setup(),chunks=records(4);
 bridge.render(chunks);const old=chunks[2];
 const newer=records(1)[0];chunks[2]=newer;
 bridge.deleteChunkBuffers(old);bridge.render(chunks);
 assert.equal(bridge.status().cache.residentVaos,4);
 assert.equal(gl.calls.deleteVao,1);assert.equal(gl.calls.createVao,5);
});
test('world-switch disposal clears VAOs without deleting original chunk buffers',()=>{
 const {bridge,records,gl}=setup();const c=records(3);bridge.render(c);
 const oldDeletes=gl.deleted.length;
 assert.equal(bridge.worldReset(),true);assert.equal(gl.deleted.length,oldDeletes);
 assert.equal(bridge.status().cache.residentVaos,0);
 bridge.render(c);assert.equal(gl.calls.createVao,6);
});
test('context loss makes NO invalid VAO deletion call and refuses draws',()=>{
 const {bridge,records,gl}=setup();const c=records(3);bridge.render(c);
 bridge.contextLost();assert.equal(bridge.status().phase,'lost');
 assert.equal(gl.calls.deleteVao,0);
 assert.throws(()=>bridge.render(c),/NOT_READY_lost/);
 assert.throws(()=>bridge.deleteChunkBuffers(c[0]),/NOT_READY_lost/);
});
test('restoration requires original program rebuild and new attributes',()=>{
 const {bridge,records}=setup();const c=records(1);
 bridge.render(c);bridge.contextLost();
 assert.throws(()=>bridge.contextRestored({...attrs(),atMat:0},{id:'newProgram'}),/BLOCKED/);
 assert.equal(bridge.status().phase,'blocked');
});
test('valid restored pipeline starts a new VAO cache generation',()=>{
 const {bridge,records,gl}=setup();const c=records(2);bridge.render(c);
 bridge.contextLost();assert.equal(bridge.contextRestored(attrs(),{id:'newProgram'}),true);
 assert.equal(bridge.render(c).frameCreates,2);
 assert.equal(gl.calls.deleteVao,0);
});
test('a restored context may not reuse a WebGLProgram from before context loss',()=>{
 const {bridge,records}=setup();const c=records(1);bridge.render(c);
 bridge.contextLost();
 assert.throws(()=>bridge.contextRestored(attrs()),/BLOCKED/);
 assert.equal(bridge.status().phase,'blocked');
});
test('original uploader numeric pre/post GL errors untouched during source cache lifetime',()=>{
 const {gl,bridge,records}=setup(),c=records(2);
 assert.equal(gl.calls.getError,8); // each chunk has opaque and water buffer, 2 calls/upload
 bridge.render(c);bridge.render(c);bridge.deleteChunkBuffers(c[0]);
 assert.equal(gl.calls.getError,8);
 const another=uploadChunkBuffer(gl,new Float32Array(9));
 assert.ok(another);assert.equal(gl.calls.getError,10);
 assert.equal(bridge.status().originalGetErrorCallsChanged,false);
});
test('original deletion exception forces hard stop without claiming GPU rollback',()=>{
 const gl=fakeGL(),stop=[];
 const {bridge,records}=setup({gl,del:()=>{throw Error('delete failed')},stop:x=>{stop.push(x);return true}});
 const c=records(1);bridge.render(c);
 assert.throws(()=>bridge.deleteChunkBuffers(c[0]),/BLOCKED/);
 assert.equal(stop.length,1);assert.equal(bridge.status().phase,'blocked');
 assert.equal(bridge.status().nativeRollbackProven,false);
 assert.throws(()=>bridge.render(c),/NOT_READY_blocked/);
});
test('native VAO destruction error fails closed rather than losing old buffer',()=>{
 const gl=fakeGL(),stop=[];gl.deleteVertexArray=()=>{throw Error('VAO delete failed')};
 const {bridge,records}=setup({gl,stop:x=>{stop.push(x);return true}});
 const c=records(1);bridge.render(c);const count=gl.deleted.length;
 assert.throws(()=>bridge.deleteChunkBuffers(c[0]),/BLOCKED/);
 assert.equal(gl.deleted.length,count);assert.equal(stop.length,1);
});
test('failed hard stop explicitly reports required external render-loop stop',()=>{
 const {bridge,records}=setup({stop:()=>false});const c=records(1);
 bridge.render(c);assert.throws(()=>bridge.render([{buffer:null,count:4}]),/BLOCKED/);
 assert.equal(bridge.status().requiresExternalStop,true);
 assert.equal(bridge.status().phase,'blocked');
});
test('without VAOs the wrapped renderer uses original pointer calls',()=>{
 const gl=fakeGL();delete gl.createVertexArray;delete gl.bindVertexArray;delete gl.deleteVertexArray;
 const {bridge,records}=setup({gl});const c=records(2),start=gl.calls.ptr;
 bridge.render(c);assert.equal(gl.calls.ptr-start,8);
 bridge.deleteChunkBuffers(c[0]);assert.equal(gl.deleted.length,2);
});
test('original near pass attributes are validated and duplicate locations rejected',()=>{
 const gl=fakeGL();assert.throws(()=>createOpaqueNearLifecycle({gl,attributes:{...attrs(),atMat:0},
 originalDeleteChunkBuffers:()=>{},pipelineProgram:{id:'p'},stopRenderLoop:()=>true}),/SOURCE_CONTRACT/);
});
test('pagehide dispose does not delete any original WebGLBuffer',()=>{
 const {gl,bridge,records}=setup();const c=records(3);bridge.render(c);
 const before=gl.deleted.length;bridge.dispose();
 assert.equal(gl.deleted.length,before);assert.equal(gl.calls.deleteVao,3);
});
test('no live integration or browser performance acceptance is claimed',()=>{
 const {bridge}=setup();const s=bridge.status();
 assert.equal(s.liveIntegrationApproved,false);assert.equal(s.nativeRollbackProven,false);
 assert.equal(s.originalBrowserPixelsProven,false);
});
