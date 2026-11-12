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
    for(let i=0;i<8&&gl.getError()!==gl.NO_ERROR;i++){}
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    const error=gl.getError();
    if(error!==gl.NO_ERROR)
      throw Error('WebGL buffer upload error '+error);
    return buffer;
  }catch(error){gl.deleteBuffer(buffer);throw error;}
}
