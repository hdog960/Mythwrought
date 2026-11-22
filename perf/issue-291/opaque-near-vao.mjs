// MYTHWROUGHT issue #291 — isolated candidate, NOT wired into production.
// Source-anchored to original main near-chunk opaque pass (Git blob
// 9a33a51e602236b66ed0a3146895e760d478d803) and GPU pipeline
// (9620576c3edb4a7ef273956f8038c0792c1c6bb3).
//
// Intention: preserve the exact opaque draw order, original buffer, vertex
// count, attribute layout and default-VAO state used by subsequent C6, water,
// Pack 5, creatures, recorder and outlines while eliminating repeated
// vertexAttribPointer calls for unchanged resident near buffers.
//
// No shader changes, mesh edits, skipped draws, new WebGL getError sites,
// uploading, gl.bufferData, world/saves or native cave source changes.
// This is a candidate for a *future separate* native integration, NOT a fix
// or real iPhone/WebGL2 pixel proof. Lifetime must be tied to GPU pipeline.
export const NEAR_OPAQUE_VAO_LIMIT = 34; // original 25 surface / <=34 shaft / 27 deep
export const NEAR_OPAQUE_LAYOUT = Object.freeze([
  Object.freeze({name:'atPos', size:3, offset:0}),
  Object.freeze({name:'atColor', size:3, offset:12}),
  Object.freeze({name:'atUv', size:2, offset:24}),
  Object.freeze({name:'atMat', size:1, offset:32})
]);

function locations(attributes){
  if(!attributes || NEAR_OPAQUE_LAYOUT.some(a=>
    !Number.isSafeInteger(attributes[a.name]) || attributes[a.name]<0))
    throw Error('291_NEAR_VAO_INVALID_TERRAIN_LOCATIONS');
  const out=NEAR_OPAQUE_LAYOUT.map(a=>attributes[a.name]);
  if(new Set(out).size!==out.length)throw Error('291_NEAR_VAO_DUPLICATE_TERRAIN_LOCATION');
  return out;
}
function same(a,b){return !!a&&a.length===b.length&&a.every((x,i)=>x===b[i]);}

export function createOpaqueNearVaoRenderer(gl,{maxEntries=NEAR_OPAQUE_VAO_LIMIT}={}){
  if(!gl || typeof gl.bindBuffer!=='function' ||
     typeof gl.vertexAttribPointer!=='function' ||
     typeof gl.drawArrays!=='function' ||
     typeof gl.enableVertexAttribArray!=='function' ||
     !Number.isSafeInteger(maxEntries) || maxEntries<1 || maxEntries>NEAR_OPAQUE_VAO_LIMIT)
    throw Error('291_NEAR_VAO_BAD_GPU_OR_LIMITS');
  let cache=new Map(),currentLayout=null,contextLost=false;
  let creates=0,deletes=0,hits=0,fallbacks=0;
  const available=typeof gl.createVertexArray==='function'&&
    typeof gl.bindVertexArray==='function'&&typeof gl.deleteVertexArray==='function';
  const pointer=(attr,index)=>gl.vertexAttribPointer(index,attr.size,gl.FLOAT,false,36,attr.offset);
  function defaultDraw(chunk,indexes){
    gl.bindBuffer(gl.ARRAY_BUFFER,chunk.buffer);
    for(let i=0;i<NEAR_OPAQUE_LAYOUT.length;i++)pointer(NEAR_OPAQUE_LAYOUT[i],indexes[i]);
    gl.drawArrays(gl.TRIANGLES,0,chunk.count);
  }
  function dispose({lost=false}={}){
    if(!lost&&available)for(const vao of cache.values()){
      gl.deleteVertexArray(vao);deletes++;
    }
    cache.clear();currentLayout=null;contextLost=!!lost;
  }
  function forgetBuffer(buffer){
    // Critical integration contract: call BEFORE original deleteChunkBuffers()
    // deletes an opaque near WebGLBuffer, otherwise a VAO can retain its
    // reference until the next frame's pruning and delay GPU reclamation.
    if(contextLost)return false;
    const vao=cache.get(buffer);
    if(!vao)return false;
    gl.deleteVertexArray(vao);deletes++;cache.delete(buffer);
    return true;
  }
  function resetForLostContext(){dispose({lost:true});}
  function restored(){
    // Call only after the real GPU pipeline is rebuilt on context restore.
    // Old VAOs are invalid WebGL handles; never delete them on lost context.
    if(!contextLost)throw Error('291_NEAR_VAO_RESTORE_WITHOUT_LOSS');
    contextLost=false;currentLayout=null;cache.clear();
  }
  function render(chunks,attributes){
    if(contextLost)throw Error('291_NEAR_VAO_LOST_CONTEXT_DRAW_BLOCKED');
    const indexes=locations(attributes);
    // Real original source iterates chunks.values(); input is an iterable of
    // those existing records. Snapshot only their references, never geometry.
    const records=Array.from(chunks);
    for(const chunk of records){
      if(!chunk || !chunk.buffer || !Number.isSafeInteger(chunk.count) || chunk.count<0)
        throw Error('291_NEAR_VAO_INVALID_ORIGINAL_CHUNK');
    }
    if(!same(currentLayout,indexes)){
      dispose();currentLayout=[...indexes];
    }
    const resident=new Set(records.map(c=>c.buffer));
    // Deleted/replaced/streamed original buffers cannot keep stale VAOs.
    if(available)for(const [buffer,vao] of cache){
      if(!resident.has(buffer)){
        gl.deleteVertexArray(vao);deletes++;cache.delete(buffer);
      }
    }
    let draws=0,frameHits=0,frameCreates=0,frameFallbacks=0;
    const last=records.at(-1)||null;
    let failed;
    try{
      for(const chunk of records){
        if(!available){defaultDraw(chunk,indexes);frameFallbacks++;draws++;continue;}
        let vao=cache.get(chunk.buffer);
        if(!vao && cache.size<maxEntries){
          vao=gl.createVertexArray();
          if(vao){
            try{
              gl.bindVertexArray(vao);
              gl.bindBuffer(gl.ARRAY_BUFFER,chunk.buffer);
              for(let i=0;i<NEAR_OPAQUE_LAYOUT.length;i++){
                gl.enableVertexAttribArray(indexes[i]);
                pointer(NEAR_OPAQUE_LAYOUT[i],indexes[i]);
              }
              cache.set(chunk.buffer,vao);creates++;frameCreates++;
            }catch(error){
              gl.bindVertexArray(null);
              gl.deleteVertexArray(vao);deletes++;
              throw error;
            }
          }
        }else if(vao){hits++;frameHits++;}
        if(vao){
          gl.bindVertexArray(vao);
          gl.drawArrays(gl.TRIANGLES,0,chunk.count);
        }else{
          gl.bindVertexArray(null);
          defaultDraw(chunk,indexes);
          frameFallbacks++;
        }
        draws++;
      }
    }catch(error){failed=error;}
    finally{
      // Original near render operated on the default VAO. Restore exactly
      // its *last chunk's* default pointer+ARRAY_BUFFER state before any
      // subsequent C6 far/water/Pack5/outline draw or other graphics path.
      if(available){
        gl.bindVertexArray(null);
        if(last){
          gl.bindBuffer(gl.ARRAY_BUFFER,last.buffer);
          for(let i=0;i<NEAR_OPAQUE_LAYOUT.length;i++)
            pointer(NEAR_OPAQUE_LAYOUT[i],indexes[i]);
        }
      }
    }
    if(failed)throw failed;
    fallbacks+=frameFallbacks;
    return Object.freeze({draws,frameHits,frameCreates,frameFallbacks,
      residentVaos:cache.size,originalChunkOrderPreserved:true,
      originalGetErrorCallsAdded:0,shaderGeometryAndSavesUnchanged:true,
      actualBrowserPixelsProven:false,actualPerformanceImproved:false});
  }
  function stats(){return Object.freeze({residentVaos:cache.size,creates,deletes,hits,fallbacks,
    maxEntries,contextLost,vaoSupported:available});}
  return Object.freeze({render,stats,dispose,forgetBuffer,resetForLostContext,restored});
}
