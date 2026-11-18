// nonblock-object-v1: opt-in scene object contract, no production world/save writes.
// All removal state is a disposable sidecar. :00/manual integrator owns persistence.
import {SCENE_FAMILIES,createSceneMesh,sceneVariant} from './flora-phase1.mjs';
import {UNDERGROWTH_FAMILIES,makeUndergrowthMesh} from './undergrowth-phase1.mjs';

export const NONBLOCK_OBJECT_VERSION='nonblock-object-v1';
export const NONBLOCK_FAMILIES=Object.freeze({...SCENE_FAMILIES,...UNDERGROWTH_FAMILIES});
const integer=n=>Number.isSafeInteger(n);
const validAnchor=a=>Array.isArray(a)&&a.length===3&&a.every(integer);
const familyIds=Object.keys(NONBLOCK_FAMILIES);
const hash32=(s)=>{let h=2166136261;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),16777619);}return (h>>>0).toString(16).padStart(8,'0');};
const requireFamily=id=>{if(!Object.hasOwn(NONBLOCK_FAMILIES,id))throw new RangeError('unknown nonblock family');};
export function nonblockInstanceKey({sceneId,seed,anchor,variant=0}){
 requireFamily(sceneId);
 if(!integer(seed)||!validAnchor(anchor)||!integer(variant)||variant<0||variant>3)throw new TypeError('invalid nonblock identity');
 // Canonical string includes full coordinates: hash alone is never the identity.
 return 'nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
}
export function describeNonblockObject({sceneId,seed,anchor,variant}){
 requireFamily(sceneId);
 if(!integer(seed)||!validAnchor(anchor))throw new TypeError('invalid nonblock anchor');
 const visual=sceneVariant(seed,...anchor,'scene48:low-grass');
 const resolvedVariant=variant??visual.variant;
 const key=nonblockInstanceKey({sceneId,seed,anchor,variant:resolvedVariant});
 const family=NONBLOCK_FAMILIES[sceneId];
 const source=Object.hasOwn(SCENE_FAMILIES,sceneId)?createSceneMesh(sceneId,seed,...anchor):makeUndergrowthMesh(sceneId,seed,...anchor);
 const mesh=source.mesh;
 if(!(mesh.positions instanceof Float32Array)||!(mesh.materials instanceof Uint8Array)||mesh.positions.length!==mesh.triangleCount*9||mesh.materials.length!==mesh.triangleCount)throw new TypeError('invalid mesh');
 const [width,height,depth]=family.footprint;
 if(![width,height,depth].every(n=>Number.isFinite(n)&&n>0))throw new RangeError('invalid footprint');
 // AABB centered on cell anchor horizontally; anchored at its base vertically.
 const selectionAabb={min:[anchor[0]-width/2,anchor[1],anchor[2]-depth/2],max:[anchor[0]+width/2,anchor[1]+height,anchor[2]+depth/2]};
 return Object.freeze({
  contract:NONBLOCK_OBJECT_VERSION,sceneId,instanceKey:key,seed,anchor:[...anchor],variant:resolvedVariant,
  attachment:family.attachment,selectionAabbs:[selectionAabb],
  collisionIntent:family.collision,breakIntent:{action:'remove-object',targetKey:key,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key,defaultRespawn:'never-until-explicit-reset'},
  render:{mesh,triangleCount:mesh.triangleCount,instanced:true,lodTier:family.tier,alphaMode:'opaque-palette',maxInstancesPerBatch:512},
  sourceFingerprint:hash32(sceneId+':'+mesh.triangleCount+':'+mesh.positions.length+':'+mesh.materials.length)
 });
}
export function pickNonblockRay(objects,origin,direction,maxDistance=6){
 if(!Array.isArray(objects)||!Array.isArray(origin)||!Array.isArray(direction)||origin.length!==3||direction.length!==3||![...origin,...direction,maxDistance].every(Number.isFinite)||maxDistance<=0)throw new TypeError('invalid ray');
 const len=Math.hypot(...direction);if(len<1e-9)throw new RangeError('zero direction');
 const d=direction.map(n=>n/len);let best=null;
 for(const obj of objects){
  if(!obj||obj.contract!==NONBLOCK_OBJECT_VERSION||!Array.isArray(obj.selectionAabbs))throw new TypeError('invalid object');
  for(const aabb of obj.selectionAabbs){
   let near=0,far=maxDistance;
   for(let i=0;i<3;i++){
    if(Math.abs(d[i])<1e-12){if(origin[i]<aabb.min[i]||origin[i]>aabb.max[i]){far=-1;break;}}
    else {const t1=(aabb.min[i]-origin[i])/d[i],t2=(aabb.max[i]-origin[i])/d[i];near=Math.max(near,Math.min(t1,t2));far=Math.min(far,Math.max(t1,t2));}
   }
   if(near<=far&&(best===null||near<best.distance||(near===best.distance&&obj.instanceKey<best.instanceKey)))best={instanceKey:obj.instanceKey,sceneId:obj.sceneId,distance:near};
  }
 }
 return best;
}
export function createNonblockSidecar(seed){
 if(!integer(seed))throw new TypeError('integer seed required');
 const removed=new Set();
 return {
  seed,has:key=>removed.has(key),
  breakObject:obj=>{if(obj?.contract!==NONBLOCK_OBJECT_VERSION||obj.seed!==seed||obj.breakIntent?.targetKey!==obj.instanceKey)throw new TypeError('invalid break target');removed.add(obj.instanceKey);return {action:'remove-object',instanceKey:obj.instanceKey,removed:true};},
  visible:objects=>objects.filter(o=>o.seed===seed&&!removed.has(o.instanceKey)),
  snapshot:()=>({contract:NONBLOCK_OBJECT_VERSION,seed,tombstones:[...removed].sort()}),
  restore:snapshot=>{if(snapshot?.contract!==NONBLOCK_OBJECT_VERSION||snapshot.seed!==seed||!Array.isArray(snapshot.tombstones)||snapshot.tombstones.some(k=>typeof k!=='string'||!k.startsWith('nb1:')))throw new TypeError('invalid tombstone sidecar');removed.clear();for(const k of snapshot.tombstones)removed.add(k);}
 };
}
// Explicit opt-in test fixture only. No automatic world generation or schema-1 mutation.
export function makeNonblockFixture(seed=17){
 const objects=[
  describeNonblockObject({sceneId:'scene48:low-grass',seed,anchor:[0,0,0]}),
  describeNonblockObject({sceneId:'scene48:short-fern',seed,anchor:[2,0,0]}),
  describeNonblockObject({sceneId:'scene48:button-mushroom',seed,anchor:[4,0,0]}),
  describeNonblockObject({sceneId:'scene48:clover-patch',seed,anchor:[6,0,0]})
 ];
 return {objects,sidecar:createNonblockSidecar(seed)};
}
export {familyIds as NONBLOCK_FAMILY_IDS};
