// Opt-in, renderer-agnostic WebGL2 upload plan. No GL calls or production registration.
// Uploads each exact shared mesh once and keeps ordered instance identities for picking.
export function planBreakableGpuUploads(staged,{maxDrawCalls=512,maxTotalBytes=4194304}={}){
 if(!Number.isSafeInteger(maxDrawCalls)||maxDrawCalls<1||maxDrawCalls>2048||
    !Number.isSafeInteger(maxTotalBytes)||maxTotalBytes<1||maxTotalBytes>16777216)throw new RangeError('invalid upload limits');
 if(!staged||!Array.isArray(staged.batches)||!Number.isSafeInteger(staged.totalBytes)||
    staged.totalBytes<0||staged.totalBytes>maxTotalBytes)throw new RangeError('invalid staged upload budget');
 const meshes=[],commands=[],seen=new Map(),keys=new Set();
 let geometryBytes=0,instanceBytes=0;
 for(const batch of staged.batches){
  const mesh=batch?.mesh;
  if(!(mesh?.positions instanceof Float32Array)||!(mesh.materials instanceof Uint8Array)||
     mesh.positions.length===0||mesh.positions.length%9!==0||
     mesh.materials.length!==mesh.positions.length/9||
     !(batch.offsets instanceof Float32Array)||batch.offsets.length%3!==0||
     !Array.isArray(batch.instanceKeys)||batch.instanceKeys.length!==batch.offsets.length/3||
     batch.instanceKeys.length!==batch.instanceCount||batch.instanceCount<1)throw new TypeError('invalid staged batch');
  if([...mesh.positions,...batch.offsets].some(v=>!Number.isFinite(v)))throw new TypeError('nonfinite upload data');
  for(const key of batch.instanceKeys){
   if(typeof key!=='string'||!key||keys.has(key))throw new TypeError('duplicate or invalid instance identity');
   keys.add(key);
  }
  let meshIndex=seen.get(mesh);
  if(meshIndex===undefined){
   meshIndex=meshes.length;seen.set(mesh,meshIndex);
   meshes.push(Object.freeze({meshIndex,positions:mesh.positions,materials:mesh.materials,triangleCount:mesh.positions.length/9}));
   geometryBytes+=mesh.positions.byteLength+mesh.materials.byteLength;
  }
  instanceBytes+=batch.offsets.byteLength;
  commands.push(Object.freeze({meshIndex,sceneId:batch.sceneId,variant:batch.variant,
    offsets:batch.offsets,instanceKeys:Object.freeze([...batch.instanceKeys]),instanceCount:batch.instanceCount}));
  if(commands.length>maxDrawCalls)throw new RangeError('draw call cap exceeded');
 }
 if(geometryBytes!==staged.geometryBytes||instanceBytes!==staged.bytes||
    geometryBytes+instanceBytes!==staged.totalBytes||keys.size!==staged.instances||
    meshes.length!==staged.uniqueMeshes)throw new TypeError('staging census or byte accounting mismatch');
 return Object.freeze({meshes:Object.freeze(meshes),commands:Object.freeze(commands),
  geometryBytes,instanceBytes,totalBytes:geometryBytes+instanceBytes,drawCalls:commands.length,instances:keys.size});
}
