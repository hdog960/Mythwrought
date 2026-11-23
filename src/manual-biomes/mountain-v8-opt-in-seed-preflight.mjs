// Mountain V8 isolated cross-owner integration preparation only.
// Read-only inspection of ORIGINAL per-seed profile/save ownership.
// This is not a V8 generator, save path, block registry, or activation gate.
// A positive known-key inspection NEVER authorizes V8 world creation.
import {readFourRegionProfile,isUnclaimedWorldSeed}
  from './profile-storage.mjs';
import {loadWorldSafe} from '../persistence.mjs';

const verdict=(seed,reason,knownStorageUnclaimed=false)=>Object.freeze({
  seed,reason,knownStorageUnclaimed,
  // This standalone research/preflight module cannot grant runtime authority.
  approvedV8GeneratorIdentity:null,approvedV8MaterialMapping:null,
  runtimeActivationAuthorized:false,safeToIntegrate:false
});

/** Only existing original source APIs may judge known seed ownership.
 * Never writes storage, creates profiles, restores under V8, or allocates IDs.
 * A 'read-only-unclaimed-candidate' result is preliminary: owner sidecars,
 * cross-namespace collision audit, schema-1, and all game tests remain gated.
 */
export function inspectMountainV8OptInSeed(storage,seed){
  if(!Number.isInteger(seed)||seed!==(seed|0))
    throw new TypeError('Invalid original world seed');
  if(!storage||typeof storage.getItem!=='function'||
     typeof storage.key!=='function'||
     !Number.isInteger(storage.length)||storage.length<0)
    return verdict(seed,'unverifiable-original-storage');

  try{
    // Damaged or contradictory original M2-M7 profile sidecars fail closed.
    if(readFourRegionProfile(storage,seed))
      return verdict(seed,'existing-original-generation-profile');
    const loaded=loadWorldSafe(storage,seed);
    // Includes legacy, verified primary/journal/backup and recovered worlds.
    if(loaded.source!=='new')
      return verdict(seed,'existing-or-recovered-original-save');
    if(!isUnclaimedWorldSeed(storage,seed,loaded))
      return verdict(seed,'existing-selected-seed-or-owner-sidecar');
    return verdict(seed,'read-only-unclaimed-candidate',true);
  }catch(_){
    // Never downgrade a damaged/contradictory original to 'unused'.
    return verdict(seed,'damaged-conflicting-or-unverifiable-original');
  }
}
