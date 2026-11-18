// :36 opt-in mobile batching proposal. No GPU calls, automatic placement or runtime writes.
import {CONTRACT} from './fittings-phase1.mjs';
export function planFittingBatches(objects,{maxTriangles=4096,maxInstances=256}={}){
 if(!Array.isArray(objects)||!Number.isSafeInteger(maxTriangles)||maxTriangles<1||
 !Number.isSafeInteger(maxInstances)||maxInstances<1||maxInstances>256)throw new TypeError('invalid batch budget');
 const seen=new Set(),groups=new Map();
 for(const o of objects){
  const triangles=o?.render?.triangleCount;
  if(o?.contract!==CONTRACT||typeof o.instanceKey!=='string'||!o.instanceKey||
   seen.has(o.instanceKey)||typeof o.sceneId!=='string'||!Number.isSafeInteger(triangles)||
   triangles<1||triangles>maxTriangles||o.render.mesh?.positions?.length!==triangles*9||
   o.render.instanced!==true||!['sparse','medium'].includes(o.render.lodTier))
   throw new TypeError('invalid or over-budget fitting');
  seen.add(o.instanceKey);
  const key=o.sceneId+':'+o.variant+':'+o.render.lodTier;
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(o);
 }
 const batches=[];
 for(const key of [...groups.keys()].sort()){
  const group=groups.get(key).sort((a,b)=>a.instanceKey.localeCompare(b.instanceKey));
  let current=[],count=0;
  for(const o of group){
   if(current.length&&(current.length===maxInstances||count+o.render.triangleCount>maxTriangles)){
    batches.push(Object.freeze({group:key,instanceKeys:Object.freeze(current),triangles:count}));
    current=[];count=0;
   }
   current.push(o.instanceKey);count+=o.render.triangleCount;
  }
  if(current.length)batches.push(Object.freeze({group:key,instanceKeys:Object.freeze(current),triangles:count}));
 }
 return Object.freeze({contract:CONTRACT,objectCount:seen.size,batches:Object.freeze(batches),
  totalTriangles:batches.reduce((n,b)=>n+b.triangles,0)});
}
