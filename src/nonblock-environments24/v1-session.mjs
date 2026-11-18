// :24 isolated v1 opt-in interaction witness. No production :00 raycast/save mutation.
import {exportEnvironmentV1,validateEnvironmentV1} from './v1-bridge.mjs';
import {createEnvironmentSession,makeEnvironmentObject} from './interaction.mjs';
const FAMILY=Object.freeze({'nonblock:e:small-stalagmite':'stalagmite','nonblock:e:hanging-stalactite':'stalactite','nonblock:e:crystal-shard':'crystal','nonblock:d:icicle-spear':'icicle','nonblock:d:agave-rosette':'agave'});
export function createEnvironmentV1Session({seed,descriptors,blockAt,editedAt,occupiedAt,snapshot}={}){
 if(!Number.isSafeInteger(seed)||!Array.isArray(descriptors)||typeof blockAt!=='function'||typeof editedAt!=='function'||typeof occupiedAt!=='function')throw new TypeError('missing v1 session inputs');
 const keys=new Set(),sourceToV1=new Map(),v1ToSource=new Map();
 const source=descriptors.map(d=>{
  validateEnvironmentV1(d);
  if(d.seed!==seed||keys.has(d.instanceKey))throw new TypeError('duplicate/cross-seed v1 object');
  keys.add(d.instanceKey);
  const family=FAMILY[d.sceneId];
  if(!family)throw new TypeError('unregistered candidate family');
  const canonical=exportEnvironmentV1(family,{seed:d.seed,anchor:d.anchor,variant:d.variant});
  if(canonical.instanceKey!==d.instanceKey)throw new TypeError('noncanonical v1 key');
  const obj=makeEnvironmentObject(family,{seed,anchor:{x:d.anchor[0],y:d.anchor[1],z:d.anchor[2]},variant:d.variant});
  sourceToV1.set(obj.instanceKey,d.instanceKey);
  v1ToSource.set(d.instanceKey,obj.instanceKey);
  return obj;
 });
 if(snapshot!==undefined){
  if(snapshot?.contract!=='nonblock-object-v1' ||snapshot.seed!==seed||!Array.isArray(snapshot.tombstones)||
     snapshot.tombstones.some(k=>!keys.has(k))||new Set(snapshot.tombstones).size!==snapshot.tombstones.length)
   throw new TypeError('invalid v1 tombstone sidecar');
 }
 const internalSnapshot=snapshot&&{contract:source[0]?.contract??'nonblock-object-v1-proposal-24',seed,
  tombstones:snapshot.tombstones.map(k=>'nonblock:'+v1ToSource.get(k))};
 const session=createEnvironmentSession({seed,objects:source,blockAt,editedAt,occupiedAt,snapshot:internalSnapshot});
 return Object.freeze({
  visible:()=>session.visible().map(o=>descriptors.find(d=>d.instanceKey===sourceToV1.get(o.instanceKey))),
  pick:(origin,direction,maxDistance)=>{const hit=session.pick(origin,direction,maxDistance);return hit&&Object.freeze({...hit,instanceKey:sourceToV1.get(hit.instanceKey)});},
  breakByKey:k=>v1ToSource.has(k)&&session.breakByKey(v1ToSource.get(k)),
  snapshot:()=>Object.freeze({contract:'nonblock-object-v1',seed,
    tombstones:session.snapshot().tombstones.map(k=>sourceToV1.get(k.slice('nonblock:'.length))).sort()})
 });
}
