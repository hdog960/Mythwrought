// :24 read-only descriptor bridge to :48 nonblock-object-v1 at coordinator HEAD
// 92578e5628063fb962c9632b35a2a25368be1ab9. No import from an unmerged PR.
import {makeEnvironmentObject,validateEnvironmentObject} from './interaction.mjs';
export const COORDINATOR_SHA='92578e5628063fb962c9632b35a2a25368be1ab9';
export const TARGET_CONTRACT='nonblock-object-v1';
const valid=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
export function exportEnvironmentV1(family,{seed,anchor,variant=0}={}){
 if(!valid(anchor)||!Number.isSafeInteger(seed)||!Number.isInteger(variant)||variant<0||variant>3)
  throw new TypeError('v1 requires safe integer seed, [x,y,z] anchor and variant 0..3');
 const source=makeEnvironmentObject(family,{seed,anchor:{x:anchor[0],y:anchor[1],z:anchor[2]},variant});
 validateEnvironmentObject(source);
 const positions=new Float32Array(source.mesh.positions);
 if(positions.some(n=>!Number.isFinite(n)))throw new RangeError('nonfinite float32 geometry');
 const count=source.mesh.triangleCount;
 const materials=new Uint8Array(count);
 const sceneId=source.sceneId;
 const instanceKey='nb1:'+encodeURIComponent(sceneId)+':'+seed+':'+anchor.join(',')+':'+variant;
 const selectionAabbs=source.selection.map(b=>({
  min:b.min.map((v,i)=>v+anchor[i]),max:b.max.map((v,i)=>v+anchor[i])
 }));
 const mesh={positions,materials,triangleCount:count};
 return Object.freeze({
  contract:TARGET_CONTRACT,sceneId,instanceKey,seed,anchor:[...anchor],variant,
  attachment:{face:source.attachment.face,requiresSolid:true,requiresClear:true},
  selectionAabbs,collisionIntent:source.collision,
  breakIntent:{action:'remove-object',targetKey:instanceKey,requiresOwner:':00'},
  persistence:{kind:'schema1-external-tombstone-sidecar',key:instanceKey,defaultRespawn:'never-until-explicit-reset'},
  render:{mesh,triangleCount:count,instanced:true,lodTier:'environment',alphaMode:'opaque-palette',maxInstancesPerBatch:512},
  sourceFingerprint:source.sceneId+':'+count+':'+variant,
  coordinatorSha:COORDINATOR_SHA,
  integrationStatus:'proposal-only: coordinator must register D/E scene IDs before canonical sidecar acceptance'
 });
}
export function validateEnvironmentV1(o){
 if(o?.contract!==TARGET_CONTRACT||o.coordinatorSha!==COORDINATOR_SHA||
    !valid(o.anchor)||!Number.isSafeInteger(o.seed)||!Number.isInteger(o.variant)||o.variant<0||o.variant>3)
  throw new TypeError('invalid v1 descriptor');
 const expected='nb1:'+encodeURIComponent(o.sceneId)+':'+o.seed+':'+o.anchor.join(',')+':'+o.variant;
 if(o.instanceKey!==expected||o.breakIntent?.targetKey!==expected||o.persistence?.key!==expected)
  throw new TypeError('noncanonical v1 identity');
 const m=o.render?.mesh;
 if(!(m?.positions instanceof Float32Array)||!(m.materials instanceof Uint8Array)||
    m.positions.length!==m.triangleCount*9||m.materials.length!==m.triangleCount||
    m.triangleCount>128||m.positions.some(n=>!Number.isFinite(n)))throw new TypeError('invalid v1 mesh');
 if(!Array.isArray(o.selectionAabbs)||!o.selectionAabbs.length)throw new TypeError('missing v1 pick volume');
 for(const b of o.selectionAabbs){
  if(!validBounds(b))throw new TypeError('invalid v1 AABB');
  for(let i=0;i<m.positions.length;i+=3)for(let j=0;j<3;j++)
   if(m.positions[i+j]+o.anchor[j]<b.min[j]-1e-5||m.positions[i+j]+o.anchor[j]>b.max[j]+1e-5)
    throw new RangeError('v1 mesh escapes pick volume');
 }
 return true;
}
function validBounds(b){return Array.isArray(b?.min)&&Array.isArray(b?.max)&&b.min.length===3&&b.max.length===3&&b.min.every((v,i)=>Number.isFinite(v)&&Number.isFinite(b.max[i])&&v<b.max[i]);}
