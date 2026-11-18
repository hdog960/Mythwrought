// Opt-in interactive session for nonblock-object-v1; no production input, save or world writes.
import {NONBLOCK_OBJECT_VERSION,describeNonblockObject,createNonblockSidecar,pickNonblockRay} from './nonblock-object-v1.mjs';
const finiteVec=v=>Array.isArray(v)&&v.length===3&&v.every(n=>typeof n==='number'&&Number.isFinite(n));
export function createNonblockInteractiveSession({seed,placements,sidecarSnapshot=null,maxObjects=512}){
 if(!Number.isSafeInteger(seed)||!Array.isArray(placements)||!Number.isSafeInteger(maxObjects)||maxObjects<1||maxObjects>2048||placements.length>maxObjects)throw new TypeError('invalid opt-in session');
 const objects=placements.map(p=>describeNonblockObject({...p,seed}));
 const keys=new Set(objects.map(o=>o.instanceKey));
 if(keys.size!==objects.length)throw new TypeError('duplicate scene object placement');
 const sidecar=createNonblockSidecar(seed);
 if(sidecarSnapshot!==null)sidecar.restore(sidecarSnapshot);
 let revision=0;
 const visible=()=>sidecar.visible(objects);
 const target=(origin,direction,reach=6)=>{
  if(!finiteVec(origin)||!finiteVec(direction)||!Number.isFinite(reach)||reach<=0||reach>6)throw new TypeError('invalid selection ray or reach');
  return pickNonblockRay(visible(),origin,direction,reach);
 };
 return Object.freeze({
  contract:NONBLOCK_OBJECT_VERSION,seed,objects:Object.freeze(objects),
  visible,revision:()=>revision,target,
  breakAt:(origin,direction,reach=6)=>{
   const hit=target(origin,direction,reach);
   if(!hit)return {removed:false,reason:'no-target'};
   const obj=objects.find(o=>o.instanceKey===hit.instanceKey);
   const action=sidecar.breakObject(obj);
   revision++;
   return {...action,sceneId:obj.sceneId,distance:hit.distance,revision};
  },
  // :00/manual integration must own durable storage and edit-protection checks.
  snapshot:()=>sidecar.snapshot(),
  drawCandidates:()=>visible().map(o=>({sceneId:o.sceneId,instanceKey:o.instanceKey,mesh:o.render.mesh,anchor:o.anchor,variant:o.variant}))
 });
}
