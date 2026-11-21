// MYTHWROUGHT v0.10 Gate A: bounded retries after WebGL allocation/upload failure.
// GPU faults are not Javascript exceptions. Preserve older valid chunk buffers,
// never spend every animation frame reuploading an OOM candidate.
export const MAX_CHUNK_UPLOAD_BYTES=8*1024*1024;
export function validateChunkUploadBytes(vertices,max=MAX_CHUNK_UPLOAD_BYTES){
  if(!(vertices instanceof Float32Array)||vertices.length%9!==0)
    throw Error('Chunk geometry is not packed vertex data');
  if(vertices.byteLength>max)
    throw Error('Chunk geometry exceeds the safe staging budget');
  return vertices.byteLength;
}
export class GpuUploadRetry{
  constructor({baseDelayMs=250,maxDelayMs=8000}={}){
    if(!Number.isFinite(baseDelayMs)||baseDelayMs<=0||
      !Number.isFinite(maxDelayMs)||maxDelayMs<baseDelayMs)
      throw Error('Invalid GPU retry budget');
    this.baseDelayMs=baseDelayMs;this.maxDelayMs=maxDelayMs;
    this.faults=new Map();this.totalFailures=0;this.recoveries=0;
  }
  ready(key,now){
    if(!Number.isFinite(now))throw Error('Invalid retry timestamp');
    return now >= (this.faults.get(key)?.until??-Infinity);
  }
  fail(key,now,reason='GPU upload failed'){
    if(!Number.isFinite(now)||typeof key!=='string')throw Error('Invalid GPU failure');
    const prev=this.faults.get(key),attempt=(prev?.attempt||0)+1;
    const delay=Math.min(this.maxDelayMs,this.baseDelayMs*2**Math.min(attempt-1,16));
    const state={attempt,until:now+delay,reason:String(reason).slice(0,140)};
    this.faults.set(key,state);this.totalFailures++;
    return state;
  }
  success(key){if(this.faults.delete(key))this.recoveries++;}
  keepOnly(keys){
    const allowed=new Set(keys);
    for(const key of this.faults.keys())if(!allowed.has(key))this.faults.delete(key);
  }
  clear(){this.faults.clear();}
  stats(){
    return {pendingRetries:this.faults.size,failures:this.totalFailures,
      recovered:this.recoveries,maxDelayMs:this.maxDelayMs};
  }
}


// Shared exact production upload operation. A failed staged buffer is deleted,
// but a caller's previously displayed healthy buffer is never touched here.
// Test adapters can produce an actual numeric WebGL OUT_OF_MEMORY code without
// monkeypatching browser-owned native methods.
export function uploadChunkBuffer(gl,vertices){
  if(!gl||typeof gl.createBuffer!=='function'||typeof gl.getError!=='function')
    throw Error('No usable WebGL upload context');
  validateChunkUploadBytes(vertices);
  const buffer=gl.createBuffer();
  if(!buffer)throw Error('WebGL buffer allocation unavailable');
  try{
    // Some drivers carry unrelated GL errors from an earlier drawing command.
    // Drain a bounded number of stale codes before inspecting this upload.
    // Never confuse a ninth pre-existing driver error with this upload.
    // A bounded drain avoids unresponsive loops on a broken context.
    let cleared=false;
    for(let i=0;i<8;i++){
      if(gl.getError()===gl.NO_ERROR){cleared=true;break;}
    }
    if(!cleared)throw Error('WebGL error queue did not clear before upload');
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    const error=gl.getError();
    if(error!==gl.NO_ERROR)
      throw Error('WebGL buffer upload error '+error);
    return buffer;
  }catch(error){gl.deleteBuffer(buffer);throw error;}
}

// Edit-only GPU staging. A retired, no-longer-published WebGLBuffer may be
// safely recycled after a frame delay; NEVER write to the currently displayed
// buffer. The returned staging buffer is still atomically published by caller.
// When capacity is sufficient, bufferSubData avoids repeated GPU allocations.
export const MAX_REUSABLE_EDIT_BYTES=256*1024;
export function uploadEditedChunkBuffer(gl,vertices,spare=null,stageTimings=null){
  // Read-only WebGL stage timing, only when explicitly requested. The source
  // upload order, GPU error checks and published-buffer rollback remain exact.
  const timed=(stage,operation)=>{
    if(!stageTimings)return operation();
    const start=performance.now();
    try{return operation();}
    finally{stageTimings[stage]=(stageTimings[stage]||0)+performance.now()-start;}
  };
  const bytes=validateChunkUploadBytes(vertices);
  if(stageTimings){
    stageTimings.uploadCalls=(stageTimings.uploadCalls||0)+1;
    stageTimings.uploadBytes=(stageTimings.uploadBytes||0)+bytes;
  }
  if(bytes>MAX_REUSABLE_EDIT_BYTES)
    return {buffer:timed('fallbackUploadMs',()=>uploadChunkBuffer(gl,vertices)),capacity:bytes};
  if(!gl||typeof gl.createBuffer!=='function'||typeof gl.bufferSubData!=='function'||
     typeof gl.getError!=='function')
    throw Error('No usable WebGL edit upload context');
  if(spare&&(!spare.buffer||!Number.isInteger(spare.capacity)||
     spare.capacity<0||spare.capacity>MAX_REUSABLE_EDIT_BYTES))
    throw Error('Invalid unpublished GPU staging buffer');
  const buffer=spare?.buffer??timed('createBufferMs',()=>gl.createBuffer());
  if(!buffer)throw Error('GPU edit staging buffer allocation unavailable');
  let capacity=spare?.capacity??0;
  try{
    let cleared=false;
    for(let i=0;i<8;i++){
      if(timed('drainErrorMs',()=>gl.getError())===gl.NO_ERROR){cleared=true;break;}
    }
    if(!cleared)throw Error('GPU edit error queue could not drain');
    timed('bindBufferMs',()=>gl.bindBuffer(gl.ARRAY_BUFFER,buffer));
    if(capacity<bytes||capacity===0){
      capacity=4096;
      while(capacity<bytes)capacity*=2;
      capacity=Math.min(capacity,MAX_REUSABLE_EDIT_BYTES);
      timed('allocateBufferMs',()=>gl.bufferData(gl.ARRAY_BUFFER,capacity,gl.DYNAMIC_DRAW));
    }
    if(bytes)timed('bufferSubDataMs',()=>gl.bufferSubData(gl.ARRAY_BUFFER,0,vertices));
    const error=timed('checkErrorMs',()=>gl.getError());
    if(error!==gl.NO_ERROR)
      throw Error('WebGL staged edit upload error '+error);
    return {buffer,capacity};
  }catch(error){timed('deleteBufferMs',()=>gl.deleteBuffer(buffer));throw error;}
}


// Atomic EDIT-only small-buffer staging. All replacement buffers are uploaded
// first, then ONE post-upload WebGL error checkpoint validates the entire batch
// BEFORE publication. As in the original upload helpers, pre-existing driver
// errors must first be drained with an eight-query bound; otherwise an old
// INVALID_OPERATION gets incorrectly attributed to this batch. If the queue
// cannot clear, or any fresh error occurs, discard EVERY unpublished buffer.
// Existing published geometry, save bytes and large-upload fallback survive.
export function uploadEditedChunkBuffersAtomic(gl,items,acquireSpare,stageTimings=null){
  if(!Array.isArray(items)||!items.length||
     typeof acquireSpare!=='function')
    throw Error('Invalid atomic GPU edit batch');
  // Validate ALL geometry before reserving or creating any buffers.
  for(const item of items){
    if(!item||!item.vertices||!item.water)throw Error('Invalid atomic GPU edit buffers');
    if(validateChunkUploadBytes(item.vertices)>MAX_REUSABLE_EDIT_BYTES||
       validateChunkUploadBytes(item.water)>MAX_REUSABLE_EDIT_BYTES)
      throw Error('Atomic GPU edit batch exceeds reusable edit budget');
  }
  if(!gl||typeof gl.createBuffer!=='function'||typeof gl.bufferSubData!=='function'||
     typeof gl.getError!=='function'||typeof gl.deleteBuffer!=='function')
    throw Error('No usable WebGL atomic edit upload context');
  const timed=(stage,operation)=>{
    if(!stageTimings)return operation();
    const start=performance.now();
    try{return operation();}
    finally{stageTimings[stage]=(stageTimings[stage]||0)+performance.now()-start;}
  };
  const owned=[],ready=[];
  const stage=vertices=>{
    const bytes=vertices.byteLength,spare=acquireSpare(bytes);
    if(spare&&(!spare.buffer||!Number.isInteger(spare.capacity)||
       spare.capacity<0||spare.capacity>MAX_REUSABLE_EDIT_BYTES||
       spare.capacity<bytes))
      throw Error('Invalid unpublished GPU staging spare');
    const buffer=spare?.buffer??timed('createBufferMs',()=>gl.createBuffer());
    if(!buffer)throw Error('GPU edit staging buffer allocation unavailable');
    owned.push(buffer);
    let capacity=spare?.capacity??0;
    timed('bindBufferMs',()=>gl.bindBuffer(gl.ARRAY_BUFFER,buffer));
    if(capacity<bytes||capacity===0){
      capacity=4096;
      while(capacity<bytes)capacity*=2;
      capacity=Math.min(capacity,MAX_REUSABLE_EDIT_BYTES);
      timed('allocateBufferMs',()=>gl.bufferData(gl.ARRAY_BUFFER,capacity,gl.DYNAMIC_DRAW));
    }
    if(bytes)timed('bufferSubDataMs',()=>gl.bufferSubData(gl.ARRAY_BUFFER,0,vertices));
    if(stageTimings){
      stageTimings.uploadCalls=(stageTimings.uploadCalls||0)+1;
      stageTimings.uploadBytes=(stageTimings.uploadBytes||0)+bytes;
    }
    return {buffer,capacity};
  };
  try{
    // Production drawing and other modules can leave a prior GL error queued.
    // The old single-buffer uploader drains it before measuring upload errors.
    // Preserve that exact bounded policy ONCE per atomic batch, not per buffer.
    let cleared=false;
    for(let i=0;i<8;i++){
      const prior=timed('batchDrainErrorMs',()=>gl.getError());
      if(prior===gl.NO_ERROR){cleared=true;break;}
      if(stageTimings)stageTimings.preexistingErrors=
        (stageTimings.preexistingErrors||0)+1;
    }
    if(!cleared)throw Error('GPU atomic edit error queue could not drain');
    for(const item of items){
      const opaque=stage(item.vertices),liquid=item.water.length?stage(item.water):null;
      ready.push({buffer:opaque.buffer,count:item.vertices.length/9,
        bufferCapacity:opaque.capacity,waterBuffer:liquid?.buffer??null,
        waterCount:item.water.length/9,waterCapacity:liquid?.capacity??item.water.byteLength});
    }
    // The authoritative fail-closed check remains BEFORE publication/save.
    // One GPU synchronization replaces two per old staged GL buffer.
    const error=timed('batchCheckErrorMs',()=>gl.getError());
    if(error!==gl.NO_ERROR)throw Error('WebGL staged batch upload error '+error);
    return ready;
  }catch(error){
    for(const buffer of owned)timed('deleteBufferMs',()=>gl.deleteBuffer(buffer));
    throw error;
  }
}
