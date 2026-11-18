// :24 opt-in interaction adapter. No production raycast/save/world mutation.
import {CONTRACT, FAMILIES, makeEnvironmentObject, canAttach} from './objects.mjs';
export const COMPATIBILITY = Object.freeze({producer:':24',contract:CONTRACT,requires:'nonblock-object-v1',coordinatorHead:'ffab31bc85c8de250949933f5a0631dddad29cf1',status:'proposal-only'});
const finite3 = a=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite);
const validKey = o=>typeof o?.instanceKey==='string'&&o.instanceKey.length>0&&o.removal?.tombstoneKey==='nonblock:'+o.instanceKey;
export function validateEnvironmentObject(o){
 if(o?.contract!==CONTRACT||!validKey(o)||!Object.values(FAMILIES).some(f=>f.sceneId===o.sceneId))throw new TypeError('invalid environment descriptor');
 const p=o.mesh?.positions;
 if(!Array.isArray(p)||p.length===0||p.length%9!==0||p.length/9!==o.mesh.triangleCount||p.some(n=>!Number.isFinite(n)))throw new TypeError('invalid triangle mesh');
 if(o.mesh.triangleCount>o.render?.maxTriangles||o.render.maxTriangles>128)throw new RangeError('mesh budget exceeded');
 if(!Array.isArray(o.selection)||o.selection.length===0)throw new TypeError('missing selection');
 for(const b of o.selection){
  if(!finite3(b.min)||!finite3(b.max)||b.min.some((n,i)=>n>=b.max[i]))throw new TypeError('invalid selection AABB');
  for(let i=0;i<p.length;i+=3)for(let axis=0;axis<3;axis++)if(p[i+axis]<b.min[axis]-1e-6||p[i+axis]>b.max[axis]+1e-6)throw new RangeError('mesh exceeds pick volume');
 }
 return true;
}
export function environmentRayPick(objects,origin,direction,maxDistance=6){
 if(!Array.isArray(objects)||!finite3(origin)||!finite3(direction)||!Number.isFinite(maxDistance)||maxDistance<=0)throw new TypeError('invalid ray');
 const length=Math.hypot(...direction);if(length<1e-10)throw new RangeError('zero ray');
 const d=direction.map(v=>v/length);let nearest=null;
 for(const o of objects){
  validateEnvironmentObject(o);
  for(const b of o.selection){
   const min=b.min.map((v,i)=>v+o.anchor[['x','y','z'][i]]),max=b.max.map((v,i)=>v+o.anchor[['x','y','z'][i]]);
   let near=0,far=maxDistance;
   for(let axis=0;axis<3;axis++){
    if(Math.abs(d[axis])<1e-12){if(origin[axis]<min[axis]||origin[axis]>max[axis])far=-1;}
    else {const a=(min[axis]-origin[axis])/d[axis],c=(max[axis]-origin[axis])/d[axis];near=Math.max(near,Math.min(a,c));far=Math.min(far,Math.max(a,c));}
   }
   if(near<=far&&(!nearest||near<nearest.distance||(near===nearest.distance&&o.instanceKey<nearest.instanceKey)))nearest={instanceKey:o.instanceKey,sceneId:o.sceneId,distance:near};
  }
 }
 return nearest;
}
export function createEnvironmentSession({seed,objects,blockAt,editedAt,occupiedAt,snapshot}){
 if(!Number.isSafeInteger(seed)||!Array.isArray(objects)||typeof blockAt!=='function'||typeof editedAt!=='function'||typeof occupiedAt!=='function')throw new TypeError('missing protected world interface');
 const keys=new Set();
 for(const o of objects){validateEnvironmentObject(o);if(o.seed!==seed||keys.has(o.instanceKey))throw new TypeError('duplicate or cross-seed object');keys.add(o.instanceKey);}
 const tombstones=new Set();
 if(snapshot!==undefined){
  if(snapshot?.contract!==CONTRACT||snapshot.seed!==seed||!Array.isArray(snapshot.tombstones)||snapshot.tombstones.some(k=>typeof k!=='string'||!objects.some(o=>o.removal.tombstoneKey===k)))throw new TypeError('invalid tombstone snapshot');
  snapshot.tombstones.forEach(k=>tombstones.add(k));
 }
 const eligible=o=>canAttach(o,{blockAt,editedAt,occupiedAt});
 const visible=()=>objects.filter(o=>!tombstones.has(o.removal.tombstoneKey)&&eligible(o));
 return Object.freeze({
  visible,
  pick:(origin,direction,maxDistance)=>environmentRayPick(visible(),origin,direction,maxDistance),
  breakByKey:instanceKey=>{const o=visible().find(x=>x.instanceKey===instanceKey);if(!o)return false;tombstones.add(o.removal.tombstoneKey);return true;},
  snapshot:()=>({contract:CONTRACT,seed,tombstones:[...tombstones].sort()})
 });
}
// Proposal-only. Integration must explicitly map :48 canonical key/descriptor semantics and :00 persistence.
export {makeEnvironmentObject};
