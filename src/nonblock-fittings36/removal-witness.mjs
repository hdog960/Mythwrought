// :36 opt-in interaction witness: deterministic evidence, not a production :00 adapter.
// No rendering, save writes, automatic placement, or simulated authorization.
import {createFittingReplayFixture} from './fixture-replay.mjs';

export function witnessFittingRemoval({seed,objects,inspectMount,authorizeRemoval,ray,sidecar=null}){
 if(!ray || !Array.isArray(objects) || objects.length===0)throw new TypeError('invalid witness inputs');
 const fixture=createFittingReplayFixture({seed,objects,inspectMount,authorizeRemoval});
 if(sidecar!==null)fixture.restore(sidecar);
 const before=fixture.frame('before');
 const picked=fixture.pick(ray);
 const pickedKey=picked?.instanceKey??null;
 const removed=fixture.breakPicked(ray);
 const removedKey=removed?.instanceKey??null;
 const after=fixture.frame('after');
 const persisted=fixture.snapshot();
 // A successful break must remove precisely its selected object, never its siblings.
 const expected=before.visibleKeys.filter(key=>key!==removedKey);
 if(removedKey!==null && (removedKey!==pickedKey ||
   after.visibleKeys.length!==expected.length ||
   expected.some((key,i)=>key!==after.visibleKeys[i]) ||
   !persisted.tombstones.includes(removedKey)))
  throw new Error('inconsistent removal witness');
 if(removedKey===null && (before.visibleKeys.length!==after.visibleKeys.length ||
   before.visibleKeys.some((key,i)=>key!==after.visibleKeys[i])))
  throw new Error('unauthorized visibility change');
 // Reconstruct from the same original descriptors, without mutating the world/save.
 const reload=createFittingReplayFixture({seed,objects,inspectMount,authorizeRemoval});
 reload.restore(persisted);
 const reloaded=reload.frame('reloaded');
 if(reloaded.visibleKeys.length!==after.visibleKeys.length ||
    reloaded.visibleKeys.some((key,i)=>key!==after.visibleKeys[i]))
  throw new Error('tombstone reload mismatch');
 return Object.freeze({
  selectedKey:pickedKey,removedKey,
  beforeKeys:before.visibleKeys,afterKeys:after.visibleKeys,reloadedKeys:reloaded.visibleKeys,
  tombstones:Object.freeze([...persisted.tombstones]),
  // This is only an isolated, synchronous authorization fixture.
  productionAuthorized:false,productionPersistenceVerified:false
 });
}
