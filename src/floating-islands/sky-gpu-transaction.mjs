// MYTHWROUGHT: atomic WebGL2 staging contract for Floating Islands.
// This adapter is NOT wired into the game loop. The production renderer keeps
// sole authority to publish nextChunks and dispose superseded buffers.
// Supply the real src/gpu-recovery.mjs uploadChunkBuffer(gl,vertices) when wired.
export const SKY_GPU_SHARED_MAX_SLOTS=25;
export const SKY_GPU_MAX_UPLOADS_PER_FRAME=2;
const safe=n=>Number.isSafeInteger(n);
const fail=s=>{throw new TypeError('Sky GPU transaction: '+s);};
export function stageSkyIslandGpuTransaction({gl,existingChunks,batch,desiredKeys,
    uploadBuffer,maxResident=SKY_GPU_SHARED_MAX_SLOTS}={}){
  if(!gl||typeof gl.deleteBuffer!=='function'||!(existingChunks instanceof Map)||
     !batch||!Array.isArray(batch.meshes)||batch.meshes.length>SKY_GPU_MAX_UPLOADS_PER_FRAME||
     !Array.isArray(desiredKeys)||typeof uploadBuffer!=='function'||
     !safe(maxResident)||maxResident<1||maxResident>27||desiredKeys.length>maxResident||
     !desiredKeys.every(k=>typeof k==='string'&&k.length>0)||
     new Set(desiredKeys).size!==desiredKeys.length)
    fail('bounded renderer owner, desired keys, and uploader required');
  const target=new Set(desiredKeys),meshKeys=new Set();
  for(const m of batch.meshes){
    if(!m||typeof m.key!=='string'||!m.key.startsWith('sky:')||
       meshKeys.has(m.key)||!target.has(m.key)||
       !safe(m.cx)||!safe(m.cz)||!safe(m.section)||
       !(m.vertices instanceof Float32Array)||m.vertices.length%9!==0||
       m.vertices.byteLength>884736||m.vertexCount!==m.vertices.length/9)
      fail('invalid or out-of-budget staged upper mesh');
    meshKeys.add(m.key);
  }
  const staged=[];
  try{
    for(const m of batch.meshes){
      const buffer=uploadBuffer(gl,m.vertices);
      if(!buffer)fail('uploader returned no buffer');
      staged.push({key:m.key,buffer});
    }
  }catch(error){
    for(const {buffer} of staged)gl.deleteBuffer(buffer);
    throw error;
  }
  const nextChunks=new Map();
  for(const key of desiredKeys){
    const existing=existingChunks.get(key);
    if(existing)nextChunks.set(key,existing);
  }
  for(let i=0;i<batch.meshes.length;i++){
    const m=batch.meshes[i],buffer=staged[i].buffer;
    nextChunks.set(m.key,Object.freeze({x:m.cx,z:m.cz,section:m.section,
      buffer,count:m.vertexCount,sky:true,bytes:m.vertices.byteLength}));
  }
  const obsolete=[];
  for(const [key,old] of existingChunks)
    if(!nextChunks.has(key)||nextChunks.get(key)!==old)
      if(old?.buffer)obsolete.push(old.buffer);
  return Object.freeze({
    nextChunks,
    stagedBuffers:Object.freeze(staged.map(row=>row.buffer)),
    obsoleteBuffers:Object.freeze(obsolete),
    committed:false,
    // Ownership order after return: 1) assign nextChunks; 2) delete obsolete;
    // on refusal to assign nextChunks, delete stagedBuffers instead.
    ownership:'renderer-publish-then-delete-obsolete'
  });
}
