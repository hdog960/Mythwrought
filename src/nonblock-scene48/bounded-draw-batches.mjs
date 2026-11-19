// :48 opt-in scene draw preparation; never mutates production renderer or world.
export const NONBLOCK_BATCH_PREP_VERSION='nonblock-batch-prep-v1';
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const validSceneId=s=>typeof s==='string'&&/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/.test(s);
const validKey=s=>typeof s==='string'&&s.length>0&&s.length<=512;
const validBounds=b=>Array.isArray(b)&&b.length===2&&b.every(p=>Array.isArray(p)&&p.length===3&&p.every(finite))&&b[0].every((n,i)=>n<=b[1][i]);
const overlaps=(a,b)=>a[0].every((n,i)=>n<=b[1][i]&&a[1][i]>=b[0][i]);
function meshBounds(o){
 const p=o?.mesh?.positions,a=o?.anchor;
 if(!p||!Array.isArray(a)||a.length!==3||!a.every(finite)||p.length===0||p.length%9!==0)throw new TypeError('invalid mesh');
 const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(let i=0;i<p.length;i++){const v=p[i];if(!finite(v))throw new TypeError('nonfinite mesh');const k=i%3,w=v+a[k];if(!finite(w))throw new TypeError('nonfinite world-space mesh');lo[k]=Math.min(lo[k],w);hi[k]=Math.max(hi[k],w);}
 return [lo,hi];
}
// Returns bounded, deterministic batches of visible geometry references; no draw calls.
// Callers own actual GPU uploads and must explicitly opt into this preparation.
export function prepareNonblockDrawBatches(objects,viewBounds,{maxObjects=4096,maxTriangles=65536,maxBatchTriangles=4096,removedKeys=[]}={}){
 if(!Array.isArray(objects)||objects.length>maxObjects||!validBounds(viewBounds)||
    ![maxObjects,maxTriangles,maxBatchTriangles].every(n=>Number.isSafeInteger(n)&&n>0)||
    maxBatchTriangles>maxTriangles)throw new TypeError('invalid batch budget');
 if(!Array.isArray(removedKeys)||removedKeys.some(k=>!validKey(k))||new Set(removedKeys).size!==removedKeys.length)throw new TypeError('invalid removed identities');
 if(removedKeys.length>maxObjects)throw new RangeError('removed identity budget exceeded');
 const removed=new Set(removedKeys);
 const seen=new Set(),visible=[];let triangles=0;
 for(const obj of objects){
  if(!validKey(obj?.instanceKey)||!validSceneId(obj?.sceneId)||seen.has(obj.instanceKey))throw new TypeError('duplicate/missing identity or invalid scene namespace');
  seen.add(obj.instanceKey);
  const bounds=meshBounds(obj),count=obj.mesh.positions.length/9;
  if(!Number.isSafeInteger(count)||count>maxBatchTriangles)throw new RangeError('oversized object');
  if(removed.has(obj.instanceKey)||!overlaps(bounds,viewBounds))continue;
  triangles+=count;
  if(triangles>maxTriangles)throw new RangeError('visible triangle budget exceeded');
  visible.push({instanceKey:obj.instanceKey,sceneId:obj.sceneId,triangles:count,bounds,mesh:obj.mesh,anchor:[...obj.anchor]});
 }
 if(removed.size && [...removed].some(key=>!seen.has(key)))throw new TypeError('unknown removed identity');
 visible.sort((a,b)=>a.sceneId===b.sceneId?a.instanceKey.localeCompare(b.instanceKey):String(a.sceneId).localeCompare(String(b.sceneId)));
 const batches=[];let current=null;
 for(const entry of visible){
  if(!current||current.sceneId!==entry.sceneId||current.triangles+entry.triangles>maxBatchTriangles){
   current={sceneId:entry.sceneId,triangles:0,instances:[]};batches.push(current);
  }
  current.instances.push(entry);current.triangles+=entry.triangles;
 }
 return {contract:NONBLOCK_BATCH_PREP_VERSION,visibleCount:visible.length,culledCount:objects.length-visible.length,triangles,batches};
}
