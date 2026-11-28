// Shared CPU mesh admission; GPU ownership and upload stay with the host.
import {buildLiquidMesh} from './mesh.mjs';
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const validId=id=>typeof id==='string'&&id.length>0&&id.length<=128;
const FACE_BYTES=120;

export function createLiquidMeshCache({engine,isLoaded,isOpen,describeBatch,
  maxBatches=128,maxVisits=4,maxCells=256,maxFaces=2560,
  maxResidentBytes=1048576,maxStagingBytes=307200}={}){
  if(typeof engine?.getCell!=='function'||[isLoaded,isOpen,describeBatch].some(f=>typeof f!=='function'))
    throw TypeError('Explicit mesh cache host required');
  if(!int(maxBatches,1,4096)||!int(maxVisits,1,4096)||!int(maxCells,1,4096)||
    !int(maxFaces,1,40960)||!int(maxResidentBytes,FACE_BYTES,2**30)||
    !int(maxStagingBytes,FACE_BYTES,2**30))throw RangeError('Invalid mesh cache budget');
  const faceLimit=Math.min(maxFaces,Math.floor(maxStagingBytes/FACE_BYTES));
  const entries=new Map(),pending=new Map();
  let revision=0,residentBytes=0,busy=false;
  function invalidate(ids){
    if(!Array.isArray(ids)||ids.length>maxBatches)throw RangeError('Invalid batch IDs');
    const unique=[...new Set(ids)];
    if(!unique.every(validId))throw RangeError('Invalid batch IDs');
    const additional=unique.filter(id=>!entries.has(id)).length;
    if(entries.size+additional>maxBatches)return false;
    if(revision>Number.MAX_SAFE_INTEGER-unique.length)throw RangeError('Revision exhausted');
    for(const id of unique){
      if(!entries.has(id))entries.set(id,{current:null});
      pending.set(id,++revision);
    }
    return true;
  }
  function get(id){return entries.get(id)?.current??null;}
  function stats(){return Object.freeze({tracked:entries.size,pending:pending.size,residentBytes});}
  function drop(id){
    if(busy)throw Error('Cannot drop during mesh build');
    const entry=entries.get(id);if(!entry)return false;
    residentBytes-=entry.current?.bytes??0;
    entries.delete(id);pending.delete(id);return true;
  }
  function step(limit=maxVisits){
    if(busy)throw Error('Reentrant mesh cache step');
    if(!int(limit,1,maxVisits))throw RangeError('Mesh visit budget');
    const selected=[];
    for(const id of pending.keys()){if(selected.length===limit)break;selected.push(id);}
    const published=[],deferred=[];
    function defer(id,reason){
      const latest=pending.get(id);
      pending.delete(id);pending.set(id,latest);
      deferred.push(Object.freeze({id,reason}));
    }
    busy=true;
    try{
      for(const id of selected){
        const rev=pending.get(id),entry=entries.get(id);
        let mesh;
        try{
          const spec=describeBatch(id);
          // Null means host data unavailable, never an empty replacement.
          if(spec===null){defer(id,'unavailable');continue;}
          if(!Array.isArray(spec.cells)||spec.cells.length>maxCells)throw RangeError('Batch cell budget');
          let unavailable=false;
          for(const p of spec.cells){
            if(!Array.isArray(p)||p.length!==3||![...p].every(Number.isSafeInteger)||p[1]<-210||p[1]>256)
              throw RangeError('Invalid batch coordinate');
            if(isLoaded(...p)!==true)unavailable=true;
          }
          if(unavailable){defer(id,'unavailable');continue;}
          mesh=buildLiquidMesh({engine,isLoaded,isOpen,cells:spec.cells,origin:spec.origin,maxCells,maxFaces:faceLimit});
        }catch{defer(id,'build-rejected');continue;}
        if(pending.get(id)!==rev){defer(id,'stale');continue;}
        const bytes=mesh.groups.reduce((n,g)=>n+g.positions.byteLength+g.normals.byteLength+g.indices.byteLength,0);
        if(bytes!==mesh.faceCount*FACE_BYTES||bytes>maxStagingBytes){defer(id,'staging-budget');continue;}
        const nextBytes=residentBytes-(entry.current?.bytes??0)+bytes;
        if(nextBytes>maxResidentBytes){defer(id,'resident-budget');continue;}
        // No callbacks during publication. Previous-good remains until admission.
        for(const g of mesh.groups)Object.freeze(g);
        Object.freeze(mesh.groups);Object.freeze(mesh.origin);Object.freeze(mesh);
        const replacement=Object.freeze({id,revision:rev,bytes,mesh});
        residentBytes=nextBytes;pending.delete(id);
        if(bytes===0)entries.delete(id);else entry.current=replacement;
        published.push(Object.freeze({id,revision:rev,bytes,empty:bytes===0}));
      }
      return Object.freeze({visited:selected.length,published:Object.freeze(published),
        deferred:Object.freeze(deferred),...stats()});
    }finally{busy=false;}
  }
  return Object.freeze({invalidate,get,stats,drop,step});
}
