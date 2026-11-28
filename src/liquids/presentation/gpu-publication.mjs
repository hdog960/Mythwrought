// Water B: isolated WebGL2 buffer publication, never a renderer mount.
const int=(n,a,b)=>Number.isSafeInteger(n)&&n>=a&&n<=b;
const id=v=>typeof v==='string'&&v.length>0&&v.length<=128;
const ids=['water','lava','acid','amber-sap','liquid-resonance'];
const quad=[0,1,2,0,2,3];
export function createLiquidGpuPublication({gl,maxBatches=128,maxFaces=2560,
  maxResidentBytes=1048576,maxStagingBytes=307200,maxOwnerBytes=307200}={}){
  if(!gl||['createBuffer','bindBuffer','bufferData','deleteBuffer','getParameter','getError','isContextLost'].some(k=>typeof gl[k]!=='function')||!int(gl.COPY_WRITE_BUFFER,1,65535)||!int(gl.COPY_WRITE_BUFFER_BINDING,1,65535))throw TypeError('WebGL2 upload host required');
  if(!int(maxBatches,1,4096)||!int(maxFaces,1,40960)||![maxResidentBytes,maxStagingBytes,maxOwnerBytes].every(n=>int(n,120,2**30)))throw RangeError('Invalid GPU budget');
  const entries=new Map(),owners=new Map();
  let residentBytes=0,busy=false,lost=false;
  function invalidateContext(){lost=true;entries.clear();owners.clear();residentBytes=0;}
  function ready(){if(gl.isContextLost())invalidateContext();return !lost;}
  function stats(){ready();return Object.freeze({tracked:entries.size,residentBytes,lost});}
  function get(batchId){return ready()?entries.get(batchId)?.current??null:null;}
  function removeBuffers(groups){for(const g of groups)for(const b of [g.positions,g.normals,g.indices])gl.deleteBuffer(b);}
  function publish(batch,{ownerByteLimit,availableStagingBytes}={}){
    if(busy)throw Error('Reentrant GPU publication');
    const {id:batchId,owner,revision,mesh}=batch??{};
    if(!id(batchId)||!id(owner)||!int(revision,1,Number.MAX_SAFE_INTEGER)||!int(ownerByteLimit,0,2**30)||!int(availableStagingBytes,0,2**30))throw RangeError('Invalid publication inputs');
    const reject=reason=>Object.freeze({status:reason,id:batchId,revision});
    if(!ready())return reject('context-lost');
    const old=entries.get(batchId);
    if(old&&old.owner!==owner)throw Error('Batch owner changed');
    if(old&&revision<=old.revision)return reject('stale');
    if(!old&&entries.size>=maxBatches)return reject('batch-budget');
    let bytes=0,faces=0;
    if(mesh!==null){
      if(mesh?.version!==1||!Array.isArray(mesh.origin)||mesh.origin.length!==3||!mesh.origin.every(Number.isSafeInteger)||mesh.origin[1]<-210||mesh.origin[1]>256||!int(mesh.faceCount,1,maxFaces)||!Array.isArray(mesh.groups)||mesh.groups.length>5)throw TypeError('Invalid mesh');
      const seen=new Set();
      for(const g of mesh.groups){
        if(!ids.includes(g.id)||seen.has(g.id)||!(g.positions instanceof Float32Array)||!(g.normals instanceof Float32Array)||!(g.indices instanceof Uint32Array)||!g.positions.length||g.positions.length%12||g.normals.length!==g.positions.length||g.indices.length!==g.positions.length/2)throw TypeError('Invalid mesh group');
        seen.add(g.id);faces+=g.indices.length/6;if(faces>mesh.faceCount)throw RangeError('Face budget');
        for(const p of g.positions)if(!Number.isFinite(p)||Math.abs(p)>4097)throw RangeError('Invalid position');
        for(const n of g.normals)if(!Number.isFinite(n)||Math.abs(n)>1)throw RangeError('Invalid normal');
        for(let i=0;i<g.indices.length;i++)if(g.indices[i]!==Math.floor(i/6)*4+quad[i%6])throw TypeError('Invalid indices');
        bytes+=g.positions.byteLength+g.normals.byteLength+g.indices.byteLength;
      }
      if(faces!==mesh.faceCount||bytes!==faces*120)throw TypeError('Invalid mesh byte count');
    }
    const oldBytes=old?.current?.bytes??0,ownerBytes=(owners.get(owner)??0)-oldBytes+bytes;
    const next=residentBytes-oldBytes+bytes;
    if(bytes>maxStagingBytes||bytes>availableStagingBytes)return reject('staging-budget');
    if(bytes>0&&(next>maxResidentBytes||ownerBytes>Math.min(maxOwnerBytes,ownerByteLimit)))return reject('resident-budget');
    // Host holds a synchronous upload/streaming lease and admits peak old+new bytes.
    const allocated=[],groups=[];let previous=null,restore=false,failed=false;
    busy=true;
    try{
      if(bytes>0){
        if(gl.getError()!==gl.NO_ERROR)return reject('preexisting-gl-error');
        previous=gl.getParameter(gl.COPY_WRITE_BUFFER_BINDING);restore=true;
      }
      const upload=data=>{
        const b=gl.createBuffer();if(!b)throw Error('Buffer allocation failed');allocated.push(b);
        gl.bindBuffer(gl.COPY_WRITE_BUFFER,b);gl.bufferData(gl.COPY_WRITE_BUFFER,data,gl.STATIC_DRAW);
        if(gl.getError()!==gl.NO_ERROR||!ready())throw Error('Buffer upload failed');return b;
      };
      for(const g of mesh?.groups??[])groups.push(Object.freeze({id:g.id,positions:upload(g.positions),normals:upload(g.normals),indices:upload(g.indices),indexCount:g.indices.length}));
    }catch{failed=true;}
    finally{
      try{if(restore&&ready()){gl.bindBuffer(gl.COPY_WRITE_BUFFER,previous);if(gl.getError()!==gl.NO_ERROR)failed=true;}}
      catch{failed=true;}
      if(failed&&ready())for(const b of allocated)gl.deleteBuffer(b);
      busy=false;
    }
    if(!ready())return reject('context-lost');
    if(failed)return reject('upload-failed');
    const current=mesh===null?null:Object.freeze({id:batchId,owner,revision,bytes,origin:Object.freeze([...mesh.origin]),groups:Object.freeze(groups)});
    // Publish only after every buffer and binding restoration succeeded.
    entries.set(batchId,{owner,revision,current});residentBytes=next;
    if(ownerBytes)owners.set(owner,ownerBytes);else owners.delete(owner);
    if(old?.current)removeBuffers(old.current.groups);
    return Object.freeze({status:'published',id:batchId,revision,bytes,empty:current===null});
  }
  // Only under an owner-retirement lease: host must discard all older work first.
  function forget(batchId,expectedRevision){
    if(busy)throw Error('Reentrant GPU retirement');
    if(!ready())return false;const e=entries.get(batchId);
    if(!e||e.revision!==expectedRevision||e.current!==null)return false;
    entries.delete(batchId);return true;
  }
  return Object.freeze({publish,get,stats,forget,invalidateContext});
}
