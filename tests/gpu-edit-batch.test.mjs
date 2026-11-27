import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stageEditedChunkBuffers,MAX_EDIT_UPLOAD_BUFFERS,uploadChunkBuffer} from '../src/gpu-recovery.mjs';
const v=()=>new Float32Array(9),empty=()=>new Float32Array();
const batch=()=>[{key:'a',cx:0,cz:0,section:-1,vertices:v(),water:v()},
 {key:'b',cx:1,cz:0,section:1,vertices:v(),water:empty()}];
function mock({stale=0,failAllocation=0,failUpload=0,throwUpload=0,lostAt=0,allocationError=0}={}){
 let calls=0,alloc=0,uploads=0,lost=false,error=0;
 const deleted=[],created=[],events=[];
 const gl={NO_ERROR:0,ARRAY_BUFFER:34962,STATIC_DRAW:35044,
  isContextLost:()=>lost,
  getError(){calls++;events.push('check');if(stale>0){stale--;return 1280;}const e=error;error=0;return e;},
  createBuffer(){alloc++;events.push('allocate');if(alloc===failAllocation)return null;
   if(alloc===allocationError)error=1285;const b={id:alloc};created.push(b);return b;},
  bindBuffer(){},
  bufferData(){uploads++;events.push('upload');if(uploads===throwUpload)throw Error('injected upload throw');
   if(uploads===failUpload)error=1285;if(uploads===lostAt)lost=true;},
  deleteBuffer(b){deleted.push(b);}
 };
 return {gl,created,deleted,events,counts:()=>({calls,alloc,uploads})};
}
test('solid/water seam stages three buffers with exactly two checks',()=>{
 const m=mock(),ready=stageEditedChunkBuffers(m.gl,batch());
 assert.deepEqual(m.counts(),{calls:2,alloc:3,uploads:3});
 assert.deepEqual(m.events,['check','allocate','upload','allocate','upload','allocate','upload','check']);
 assert.equal(ready[0].buffer,m.created[0]);assert.equal(ready[0].waterBuffer,m.created[1]);
 assert.equal(ready[1].buffer,m.created[2]);assert.equal(ready[1].waterBuffer,null);
 assert.equal(ready[0].count,1);assert.equal(m.deleted.length,0);
});
test('bounded stale errors drain before the first allocation',()=>{
 const m=mock({stale:7});stageEditedChunkBuffers(m.gl,batch());
 assert.equal(m.counts().calls,9);assert.equal(m.events.indexOf('allocate'),8);
});
test('ninth stale error cannot permit any allocation',()=>{
 const m=mock({stale:9});assert.throws(()=>stageEditedChunkBuffers(m.gl,batch()),/queue did not clear/);
 assert.deepEqual(m.counts(),{calls:8,alloc:0,uploads:0});
});
for(const [label,options,pattern] of [
 ['null second allocation',{failAllocation:2},/allocation unavailable/],
 ['silent allocation error',{allocationError:1},/batch upload error 1285/],
 ['first upload error',{failUpload:1},/batch upload error 1285/],
 ['last upload error',{failUpload:3},/batch upload error 1285/],
 ['second upload exception',{throwUpload:2},/injected upload throw/]
])test(label+' retires all and only newly allocated buffers',()=>{
 const m=mock(options);assert.throws(()=>stageEditedChunkBuffers(m.gl,batch()),pattern);
 assert.deepEqual(m.deleted,m.created);
});
test('context loss refuses publication',()=>{
 const m=mock({lostAt:1});assert.throws(()=>stageEditedChunkBuffers(m.gl,batch()),/context lost/);
 assert.equal(m.counts().uploads,1);assert.equal(m.gl.isContextLost(),true);
});
test('all geometry is validated before any GL allocation',()=>{
 const m=mock(),b=batch();b[1].water=new Float32Array(8);
 assert.throws(()=>stageEditedChunkBuffers(m.gl,b),/packed vertex/);
 assert.equal(m.counts().alloc,0);
 assert.throws(()=>stageEditedChunkBuffers(m.gl,Array(MAX_EDIT_UPLOAD_BUFFERS/2+1).fill(b[0])),/batch size/);
});
test('empty upper owner has no allocation, legacy empty owner still has one',()=>{
 const m=mock(),r=stageEditedChunkBuffers(m.gl,[
  {section:1,vertices:empty(),water:empty()},{section:0,vertices:empty(),water:empty()}]);
 assert.equal(r[0].buffer,null);assert.equal(r[1].buffer,m.created[0]);
 assert.equal(m.counts().alloc,1);
});
const source=readFileSync(new URL('../src/main.mjs',import.meta.url),'utf8');
const start=source.indexOf('  function publishEditedChunkBatch(batch){');
const end=source.indexOf('  function refreshEditedMeshes(',start);
assert.ok(start>=0&&end>start);
// Execute the exact released publisher and its original per-buffer upload
// function together. The detached batch helper above remains independently tested.
const uploadStart=source.indexOf('  function uploadPack2Chunk(vertices,water,section=0){');
const uploadEnd=source.indexOf('  let editMeshBatches=',uploadStart);
assert.ok(uploadStart>=0&&uploadEnd>uploadStart);
const publisher=Function('gl','chunks','world','admitUpperGpuBatch','uploadChunkBuffer','deleteChunkBuffers','traceMeasure',
 source.slice(uploadStart,uploadEnd)+source.slice(start,end)+'\nreturn publishEditedChunkBatch;');
const ids=items=>items.map(b=>b.id).sort((a,b)=>a-b);
function ownerFixture(m,{beforeRetire=()=>{},measure=null}={}){
 const old=[{buffer:{id:'old-a'}},{buffer:{id:'old-b'}}],chunks=new Map([['a',old[0]],['b',old[1]]]);
 const retired=[];
 const publish=publisher(m.gl,chunks,{},()=>{},uploadChunkBuffer,item=>{
  beforeRetire(item,chunks,old);
  retired.push(item);if(item.buffer)m.gl.deleteBuffer(item.buffer);
  if(item.waterBuffer)m.gl.deleteBuffer(item.waterBuffer);
 },measure);
 return {old,chunks,retired,publish};
}
test('actual publisher retains both old owners on silent second upload fault',()=>{
 const m=mock({failUpload:2}),f=ownerFixture(m);
 assert.throws(()=>f.publish(batch()),/buffer upload error 1285/);
 assert.equal(f.chunks.get('a'),f.old[0]);assert.equal(f.chunks.get('b'),f.old[1]);
 assert.equal(f.retired.length,0);assert.deepEqual(ids(m.deleted),ids(m.created));
});
test('actual publisher retains old handles on context loss',()=>{
 const m=mock({lostAt:1}),f=ownerFixture(m);
 assert.throws(()=>f.publish(batch()),/context lost/);
 assert.equal(f.chunks.get('a'),f.old[0]);assert.equal(f.chunks.get('b'),f.old[1]);
 assert.equal(f.retired.length,0);
});
test('actual publisher retires old handles only after both replacements are visible',()=>{
 const m=mock(),f=ownerFixture(m,{beforeRetire:(item,chunks,old)=>{
  assert.notEqual(chunks.get('a'),old[0]);assert.notEqual(chunks.get('b'),old[1]);
 }});
 f.publish(batch());assert.deepEqual(f.retired,f.old);
});
test('actual publisher refuses owner identity change and retires staged buffers',()=>{
 const m=mock(),f=ownerFixture(m),replacement={buffer:{id:'external'}};
 const bufferData=m.gl.bufferData;
 m.gl.bufferData=(...args)=>{bufferData(...args);f.chunks.set('b',replacement);};
 assert.throws(()=>f.publish(batch()),/owner changed/);
 assert.equal(f.chunks.get('a'),f.old[0]);assert.equal(f.chunks.get('b'),replacement);
 assert.equal(f.retired.length,2);assert.deepEqual(ids(m.deleted),ids(m.created));
});
test('enabled trace observes actual publisher and upload without replacing handles',()=>{
 const m=mock(),labels=[],f=ownerFixture(m,{measure:(name,fn)=>{labels.push(name);return fn();}});
 f.publish(batch());assert.equal(labels[0],'gpuBatchPublish');
 assert.equal(labels.filter(n=>n==='glBufferData').length,3);
 assert.deepEqual(f.retired,f.old);
});
