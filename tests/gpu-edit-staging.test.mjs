// Real WebGL2 driver acceptance is in rapid-vertical-dig-browser.mjs.
// Native unit tests verify staging semantics and fail-closed buffer handling.
import test from 'node:test';
import assert from 'node:assert/strict';
import {uploadEditedChunkBuffer,uploadEditedChunkBuffersAtomic,MAX_REUSABLE_EDIT_BYTES,
  MAX_CHUNK_UPLOAD_BYTES} from '../src/gpu-recovery.mjs';

function fakeGL(){
  let current=null,nextId=1,error=0,failNextUpload=false,errorReads=0;
  const buffers=[],ops=[];
  const gl={
    ARRAY_BUFFER:34962,STATIC_DRAW:35044,DYNAMIC_DRAW:35048,
    NO_ERROR:0,OUT_OF_MEMORY:1285,
    createBuffer(){
      const b={id:nextId++,deleted:false,capacity:0,contents:new Uint8Array()};
      buffers.push(b);return b;
    },
    bindBuffer(target,b){assert.equal(target,gl.ARRAY_BUFFER);current=b;ops.push('bind');},
    bufferData(target,data,usage){
      assert.equal(target,gl.ARRAY_BUFFER);
      assert.ok(current&&!current.deleted);
      current.capacity=typeof data==='number'?data:data.byteLength;
      current.contents=new Uint8Array(current.capacity);
      if(data instanceof Float32Array)
        current.contents.set(new Uint8Array(data.buffer,data.byteOffset,data.byteLength));
      ops.push('alloc');
      if(failNextUpload){error=gl.OUT_OF_MEMORY;failNextUpload=false;}
    },
    bufferSubData(target,offset,data){
      assert.equal(target,gl.ARRAY_BUFFER);assert.equal(offset,0);
      assert.ok(current&&!current.deleted);
      assert.ok(data.byteLength<=current.capacity);
      current.contents.set(new Uint8Array(data.buffer,data.byteOffset,data.byteLength));
      ops.push('sub');
      if(failNextUpload){error=gl.OUT_OF_MEMORY;failNextUpload=false;}
    },
    getError(){errorReads++;const n=error;error=0;return n;},
    deleteBuffer(b){b.deleted=true;ops.push('delete');}
  };
  return {gl,buffers,ops,get errorReads(){return errorReads;},
    fail(){failNextUpload=true;}};
}
const packed=n=>new Float32Array(n*9);

test('bounded edit staging returns only unpublished buffers and reuses capacity',()=>{
  const t=fakeGL(),a=uploadEditedChunkBuffer(t.gl,packed(2));
  assert.equal(a.capacity,4096);
  assert.equal(a.buffer.deleted,false);
  assert.deepEqual(t.ops,['bind','alloc','sub']);
  t.ops.length=0;
  const b=uploadEditedChunkBuffer(t.gl,packed(6),a);
  assert.equal(b.buffer,a.buffer);
  assert.equal(b.capacity,4096);
  assert.deepEqual(t.ops,['bind','sub']);
  t.ops.length=0;
  const c=uploadEditedChunkBuffer(t.gl,packed(180),b);
  assert.equal(c.buffer,b.buffer);
  assert.equal(c.capacity,8192);
  assert.deepEqual(t.ops,['bind','alloc','sub']);
});

test('optional WebGL call timings preserve the original bounded upload semantics',()=>{
  const t=fakeGL(),times={};
  const a=uploadEditedChunkBuffer(t.gl,packed(2),null,times);
  assert.equal(a.capacity,4096);
  assert.equal(times.uploadCalls,1);
  assert.equal(times.uploadBytes,packed(2).byteLength);
  for(const key of ['createBufferMs','drainErrorMs','bindBufferMs',
    'allocateBufferMs','bufferSubDataMs','checkErrorMs'])
    assert.ok(Number.isFinite(times[key])&&times[key]>=0,key);
  assert.deepEqual(t.ops,['bind','alloc','sub']);
  assert.equal(a.buffer.deleted,false);
});

test('atomic small-edit batch checkpoints WebGL error once before publication',()=>{
  const t=fakeGL(),times={},a=packed(2),water=packed(1);
  const old=uploadEditedChunkBuffer(t.gl,packed(2));
  const before=t.errorReads;
  const result=uploadEditedChunkBuffersAtomic(t.gl,
    [{vertices:a,water},{vertices:a,water:packed(0)}],()=>null,times);
  assert.equal(t.errorReads-before,1,'only one synchronized GPU error check');
  assert.equal(result.length,2);
  assert.equal(result[0].count,2);
  assert.equal(result[0].waterCount,1);
  assert.equal(result[1].waterBuffer,null);
  assert.equal(times.uploadCalls,3);
  assert.equal(times.uploadBytes,3*a.byteLength+water.byteLength-a.byteLength);
  assert.ok(Number.isFinite(times.batchCheckErrorMs));
  assert.ok(result.every(r=>!r.buffer.deleted));
  assert.equal(old.buffer.deleted,false,'previously published GPU buffer unchanged');
});

test('atomic edit batch OOM deletes EVERY unpublished buffer but never the old one',()=>{
  const t=fakeGL(),old=uploadEditedChunkBuffer(t.gl,packed(2));
  const before=t.errorReads;
  t.fail();
  assert.throws(()=>uploadEditedChunkBuffersAtomic(t.gl,
    [{vertices:packed(2),water:packed(1)},{vertices:packed(2),water:packed(0)}],
    ()=>null),/WebGL staged batch upload error 1285/);
  assert.equal(t.errorReads-before,1);
  assert.equal(old.buffer.deleted,false,'visible geometry must survive GPU failure');
  assert.equal(t.buffers.length,4);
  assert.equal(t.buffers.filter(b=>b.deleted).length,3);
});

test('atomic staging rejects large geometry before allocating or borrowing',()=>{
  const t=fakeGL(),a=packed(Math.floor(MAX_REUSABLE_EDIT_BYTES/36)+1);
  let spares=0;
  assert.throws(()=>uploadEditedChunkBuffersAtomic(t.gl,
    [{vertices:a,water:packed(0)}],()=>{spares++;return null;}),
    /exceeds reusable edit budget/);
  assert.equal(spares,0);
  assert.equal(t.buffers.length,0);
});

test('GPU edit error deletes only the unpublished buffer',()=>{
  const t=fakeGL(),visible=uploadEditedChunkBuffer(t.gl,packed(2)),
    staging=uploadEditedChunkBuffer(t.gl,packed(3));
  t.fail();
  assert.throws(()=>uploadEditedChunkBuffer(t.gl,packed(4),staging),/WebGL staged edit upload error 1285/);
  assert.equal(staging.buffer.deleted,true);
  assert.equal(visible.buffer.deleted,false,'formerly published geometry remains untouched');
});

test('large edits fall back to original validated upload and unchanged cap',()=>{
  const t=fakeGL(),n=MAX_REUSABLE_EDIT_BYTES/36+1,
    huge=packed(Math.ceil(n));
  assert.ok(huge.byteLength>MAX_REUSABLE_EDIT_BYTES);
  assert.ok(huge.byteLength<=MAX_CHUNK_UPLOAD_BYTES);
  const upload=uploadEditedChunkBuffer(t.gl,huge);
  assert.equal(upload.capacity,huge.byteLength);
  assert.ok(t.ops.includes('alloc'));
  assert.ok(!t.ops.includes('sub'));
});

test('untrusted spare and above-budget geometry fail without touching GL',()=>{
  const t=fakeGL();
  assert.throws(()=>uploadEditedChunkBuffer(t.gl,packed(1),{buffer:{},capacity:-1}),/Invalid/);
  assert.throws(()=>uploadEditedChunkBuffer(t.gl,packed(Math.floor(MAX_CHUNK_UPLOAD_BYTES/36)+1)),/safe staging budget/);
  assert.equal(t.buffers.length,0);
});
