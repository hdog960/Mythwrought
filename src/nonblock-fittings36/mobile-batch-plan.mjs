// :36 opt-in mobile batching proposal. No GPU calls, automatic placement or runtime writes.
import {CONTRACT} from './fittings-phase1.mjs';
export function planFittingBatches(objects,{maxTriangles=4096,maxInstances=256,maxTotalTriangles=65536,maxObjects=2048}={}){
 if(!Array.isArray(objects)||!Number.isSafeInteger(maxTriangles)||maxTriangles<1||
 !Number.isSafeInteger(maxInstances)||maxInstances<1||maxInstances>256||
 !Number.isSafeInteger(maxTotalTriangles)||maxTotalTriangles<1||
 !Number.isSafeInteger(maxObjects)||maxObjects<1)throw new TypeError('invalid batch budget');
 const seen=new Set(),groups=new Map(),canonical=new Map();let cumulativeTriangles=0;
 for(const o of objects){
  const triangles=o?.render?.triangleCount;
  if(o?.contract!==CONTRACT||typeof o.instanceKey!=='string'||!o.instanceKey||
   seen.has(o.instanceKey)||typeof o.sceneId!=='string'||!Number.isSafeInteger(triangles)||
   triangles<1||triangles>maxTriangles||o.render.mesh?.positions?.length!==triangles*9||
   o.render.mesh?.materials?.length!==triangles||
   o.render.localMesh?.positions?.length!==triangles*9||
   o.render.localMesh?.materials?.length!==triangles||
   !Array.isArray(o.render.transform?.translation)||
   o.render.transform.translation.length!==3||
   !o.render.transform.translation.every(Number.isSafeInteger)||
   !Number.isSafeInteger(o.render.transform.quarterTurnsY)||
   o.render.transform.quarterTurnsY<0||o.render.transform.quarterTurnsY>3||
   o.render.transform.quarterTurnsY!==o.orientation||
   o.render.transform.translation.some((v,i)=>v!==o.anchor?.[i])||
   !Array.from(o.render.mesh.positions).every(Number.isFinite)||
   !Array.from(o.render.localMesh.positions).every(Number.isFinite)||
   !Array.from(o.render.mesh.materials).every(m=>Number.isSafeInteger(m)&&m>=0&&m<=6)||
   !Array.from(o.render.localMesh.materials).every(m=>Number.isSafeInteger(m)&&m>=0&&m<=6)||
   !Number.isSafeInteger(o.variant)||o.variant<0||o.variant>3||
   o.render.instanced!==true||!['sparse','medium'].includes(o.render.lodTier))
   throw new TypeError('invalid or over-budget fitting');
  if(seen.size>=maxObjects||cumulativeTriangles+triangles>maxTotalTriangles)
   throw new RangeError('global fitting batch budget exceeded');
  cumulativeTriangles+=triangles;seen.add(o.instanceKey);
  const key=JSON.stringify([o.sceneId,o.variant,o.render.lodTier]);
  // Never combine different canonical geometry under one instanced draw group.
  const signature=JSON.stringify([Array.from(o.render.localMesh.positions),Array.from(o.render.localMesh.materials)]);
  if(canonical.has(key)&&canonical.get(key)!==signature)throw new TypeError('incompatible instanced geometry');
  canonical.set(key,signature);
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
  totalTriangles:cumulativeTriangles});
}
