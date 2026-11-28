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
export function uploadChunkBuffer(gl,vertices,measure=null){
  const timed=(name,fn)=>measure?measure(name,fn):fn();
  if(!gl||typeof gl.createBuffer!=='function'||typeof gl.getError!=='function')
    throw Error('No usable WebGL upload context');
  validateChunkUploadBytes(vertices);
  const buffer=timed('glCreateBuffer',()=>gl.createBuffer());
  if(!buffer)throw Error('WebGL buffer allocation unavailable');
  try{
    // Some drivers carry unrelated GL errors from an earlier drawing command.
    // Drain a bounded number of stale codes before inspecting this upload.
    // Never confuse a ninth pre-existing driver error with this upload.
    // A bounded drain avoids unresponsive loops on a broken context.
    let cleared=false;
    for(let i=0;i<8;i++){
      if(timed('glPreGetError',()=>gl.getError())===gl.NO_ERROR){cleared=true;break;}
    }
    if(!cleared)throw Error('WebGL error queue did not clear before upload');
    timed('glBindBuffer',()=>gl.bindBuffer(gl.ARRAY_BUFFER,buffer));
    timed('glBufferData',()=>gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW));
    const error=timed('glPostGetError',()=>gl.getError());
    if(error!==gl.NO_ERROR)
      throw Error('WebGL buffer upload error '+error);
    return buffer;
  }catch(error){timed('glDeleteFailedBuffer',()=>gl.deleteBuffer(buffer));throw error;}
}

// One synchronous transaction, with no external callbacks between the initial
// error drain and final check. Never publish a partial batch. The original
// single-upload path remains in use for streaming and independent owners.
export const MAX_EDIT_UPLOAD_BUFFERS=68;
export function stageEditedChunkBuffers(gl,batch){
  if(!gl||typeof gl.isContextLost!=='function'||typeof gl.getError!=='function'||
     typeof gl.createBuffer!=='function'||typeof gl.deleteBuffer!=='function'||
     typeof gl.bindBuffer!=='function'||typeof gl.bufferData!=='function')
    throw Error('No usable WebGL edit upload context');
  if(!Array.isArray(batch)||batch.length>MAX_EDIT_UPLOAD_BUFFERS/2)
    throw Error('Invalid edit upload batch size');
  const plan=batch.map(item=>{
    validateChunkUploadBytes(item.vertices);
    validateChunkUploadBytes(item.water);
    return {...item,buffer:null,count:item.vertices.length/9,
      waterBuffer:null,waterCount:item.water.length/9};
  });
  if(gl.isContextLost())throw Error('Graphics context lost before edit upload');
  const allocated=[];
  try{
    // Drain BEFORE allocation so allocation errors cannot be classified as stale.
    let cleared=false;
    for(let i=0;i<8;i++){
      if(gl.getError()===gl.NO_ERROR){cleared=true;break;}
    }
    if(!cleared)throw Error('WebGL error queue did not clear before edit upload');
    const stage=vertices=>{
      if(gl.isContextLost())throw Error('Graphics context lost during edit upload');
      const buffer=gl.createBuffer();
      if(!buffer)throw Error('WebGL buffer allocation unavailable');
      allocated.push(buffer);
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
      return buffer;
    };
    for(const item of plan){
      if(item.section<=0||item.vertices.length)item.buffer=stage(item.vertices);
      if(item.water.length)item.waterBuffer=stage(item.water);
    }
    const error=gl.getError();
    if(error!==gl.NO_ERROR)throw Error('WebGL edit batch upload error '+error);
    if(gl.isContextLost())throw Error('Graphics context lost after edit upload');
    return plan;
  }catch(error){
    // A lost WebGL context invalidates every handle; otherwise retire only new
    // buffers, never the resident buffers owned by the calling transaction.
    if(!gl.isContextLost())for(const buffer of allocated)gl.deleteBuffer(buffer);
    throw error;
  }
}
