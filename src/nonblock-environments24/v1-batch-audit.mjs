// :24-only bounded, opt-in D/E descriptor admission audit. Never spawns objects.
import {validateEnvironmentV1} from './v1-bridge.mjs';
const LIMIT=512;
const intersects=(a,b)=>a.selectionAabbs.some(p=>b.selectionAabbs.some(q=>
 [0,1,2].every(i=>p.min[i]<q.max[i]&&q.min[i]<p.max[i])));
export function auditEnvironmentV1Batch(descriptors,{maxInstances=LIMIT,maxTriangles=32768}={}){
 if(!Array.isArray(descriptors)||!Number.isSafeInteger(maxInstances)||maxInstances<1||maxInstances>LIMIT||
    !Number.isSafeInteger(maxTriangles)||maxTriangles<1||maxTriangles>32768)
  throw new TypeError('invalid bounded environmental batch');
 if(descriptors.length>maxInstances)throw new RangeError('environmental instance cap exceeded');
 const keys=new Set();let triangles=0;
 const ordered=[...descriptors].sort((a,b)=>String(a?.instanceKey).localeCompare(String(b?.instanceKey)));
 const admitted=[],rejected=[];
 for(const d of ordered){
  validateEnvironmentV1(d);
  if(keys.has(d.instanceKey))throw new TypeError('duplicate environmental instance key');
  keys.add(d.instanceKey);
  triangles+=d.render.triangleCount;
  if(triangles>maxTriangles)throw new RangeError('environmental triangle cap exceeded');
  if(admitted.some(a=>intersects(a,d)))rejected.push(d.instanceKey);
  else admitted.push(d);
 }
 return Object.freeze({contract:'nonblock-object-v1',status:'proposal-only',
  admittedKeys:Object.freeze(admitted.map(d=>d.instanceKey)),
  rejectedOverlapKeys:Object.freeze(rejected),
  totalTriangles:triangles,instanceCount:ordered.length,
  requiresOwner:':00',spawnEnabled:false});
}
