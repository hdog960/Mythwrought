// :24-only opt-in admission gate. Read-only callbacks; no placement or save writes.
import {auditEnvironmentV1Batch} from './v1-batch-audit.mjs';
import {validateEnvironmentV1} from './v1-bridge.mjs';
const integer3=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const keyOf=a=>a.join(',');
export function planEnvironmentV1Admission(descriptors,environment,{maxInstances=512,maxTriangles=32768}={}){
 if(!environment||typeof environment.isSolid!=='function'||
    typeof environment.isEdited!=='function'||typeof environment.hasTombstone!=='function')
  throw new TypeError('read-only terrain, edit and tombstone providers required');
 if(environment.isReserved!==undefined&&typeof environment.isReserved!=='function')
  throw new TypeError('invalid read-only reservation provider');
 const batch=auditEnvironmentV1Batch(descriptors,{maxInstances,maxTriangles});
 const overlap=new Set(batch.rejectedOverlapKeys);
 const accepted=[],rejected=[];
 // All callbacks must return actual booleans; an unknown terrain/edit state fails closed.
 const check=(fn,...args)=>{const v=fn(...args);if(typeof v!=='boolean')throw new TypeError('unknown environment state');return v;};
 for(const d of [...descriptors].sort((a,b)=>a.instanceKey.localeCompare(b.instanceKey))){
  validateEnvironmentV1(d);
  if(overlap.has(d.instanceKey)){rejected.push({instanceKey:d.instanceKey,reason:'overlap'});continue;}
  const a=d.anchor,face=d.attachment.face;
  if(!integer3(a)||!['ground','ceiling','wall'].includes(face))
   throw new TypeError('unsupported attachment');
  const offset=face==='ground'?[0,-1,0]:face==='ceiling'?[0,1,0]:null;
  // A wall mount cannot guess an attachment direction; require an explicit
  // owner-supplied support cell, never silently place against the wrong wall.
  const support=offset?a.map((v,i)=>v+offset[i]):null;
  if(!support){rejected.push({instanceKey:d.instanceKey,reason:'wall-support-unresolved'});continue;}
  if(check(environment.hasTombstone,d.instanceKey)){
   rejected.push({instanceKey:d.instanceKey,reason:'removed'});continue;
  }
  if(check(environment.isEdited,...a)||check(environment.isEdited,...support)){
   rejected.push({instanceKey:d.instanceKey,reason:'edited'});continue;
  }
  // Reserved supporting terrain is owned by another placement proposal. A\n  // solid support voxel is not automatically available for attachment.\n  if(typeof environment.isReserved==='function'&&check(environment.isReserved,...support)){\n   rejected.push({instanceKey:d.instanceKey,reason:'support-reserved'});continue;\n  }\n  if(!check(environment.isSolid,...support)||check(environment.isSolid,...a)){
   rejected.push({instanceKey:d.instanceKey,reason:'mount'});continue;
  }
  // Sample all integer voxel cells intersected by selection bounds. This is
  // deliberately conservative: uncertain, solid or edited cells block admission.
  let blocked=false;
  const visited=new Set();
  for(const box of d.selectionAabbs){
   const lo=box.min.map(Math.floor),hi=box.max.map(v=>Math.ceil(v)-1);
   if(hi.some((v,i)=>v-lo[i]>16))throw new RangeError('unbounded pick envelope');
   for(let x=lo[0];x<=hi[0]&&!blocked;x++)
    for(let y=lo[1];y<=hi[1]&&!blocked;y++)
     for(let z=lo[2];z<=hi[2];z++){
      const cell=[x,y,z],k=keyOf(cell);
      if(visited.has(k))continue;
      visited.add(k);
      if(check(environment.isEdited,x,y,z)||check(environment.isSolid,x,y,z)||
         (typeof environment.isReserved==='function'&&check(environment.isReserved,x,y,z))){blocked=true;break;}
     }
  }
  if(blocked){rejected.push({instanceKey:d.instanceKey,reason:'occupied'});continue;}
  accepted.push(d.instanceKey);
 }
 return Object.freeze({contract:'nonblock-object-v1',status:'proposal-only',spawnEnabled:false,
  admittedKeys:Object.freeze(accepted),rejected:Object.freeze(rejected.map(x=>Object.freeze(x))),
  requiresOwner:':00',batchTriangles:batch.totalTriangles});
}
