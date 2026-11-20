// :24 opt-in guarded interaction facade. Never calls production raycast or save APIs.
import {pickEnvironmentWithoutWall} from './occlusion.mjs';

// A single guarded operation prevents a caller from using a visible-but-occluded
// candidate key to bypass voxel occlusion. No side effects on failed picks.
export function breakVisibleEnvironment(session,{origin,direction,maxDistance,blockAt,editedAt}={}){
 if(!session||typeof session.pick!=='function'||typeof session.breakByKey!=='function'||
    typeof session.snapshot!=='function')throw new TypeError('invalid isolated session');
 const hit=pickEnvironmentWithoutWall(session,origin,direction,maxDistance,blockAt,editedAt);
 if(!hit)return Object.freeze({removed:false,reason:'no-visible-hit'});
 if(typeof hit.instanceKey!=='string'||!hit.instanceKey.startsWith('nonblock:'))
  throw new TypeError('invalid isolated hit identity');
 const removed=session.breakByKey(hit.instanceKey)===true;
 return Object.freeze({removed,instanceKey:hit.instanceKey,
  tombstones:removed?[...session.snapshot().tombstones]:undefined});
}
