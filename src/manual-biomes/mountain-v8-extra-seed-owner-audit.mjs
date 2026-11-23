// Mountain V8 isolated READ-ONLY audit of original owners omitted from the
// older profile-storage.isUnclaimedWorldSeed key-prefix list.
// No V8 registration, world/profile construction, localStorage mutation,
// existing owner code edits, backup deletion, or gameplay activation.
// Source: src/mobs/live-game.mjs mobSaveKey(seed,'cave') at original source
// blob 51bb65928f3ba98213d531c4f2d38b79dc78cf37.
// A cave-mob roster is a DISTINCT WORLD SAVE OWNERSHIP CLAIM even when the
// ordinary cave-profile key is missing (partial/out-of-order source recovery).
const CAVE_MOB_PREFIX='mythwrought-mobs-v1-caves-seed-';
const suffixes=Object.freeze(['','.backup']);
const validSeed=n=>Number.isSafeInteger(n)&&n===(n|0);
const result=(claim,reason)=>Object.freeze({
  claim,reason,requiresCrossOwnerStorageAudit:true,
  // Read-only preflight can NEVER grant the right to create a world.
  canCreateNewWorld:false,safeToIntegrate:false
});
export function auditMountainV8ExtraSeedOwners(storage,seed){
  if(!validSeed(seed))throw new TypeError('Invalid original int32 seed');
  if(!storage||typeof storage.key!=='function'||
     !Number.isSafeInteger(storage.length)||storage.length<0)
    throw new TypeError('Cannot enumerate original owner keys');
  const exactBase=CAVE_MOB_PREFIX+seed;
  const seen=new Set();
  for(let i=0;i<storage.length;i++){
    const key=storage.key(i);
    // A broken/partial enumeration must NOT certify a free seed.
    if(typeof key!=='string'||seen.has(key))
      throw new Error('Unverifiable original owner enumeration');
    seen.add(key);
    if(suffixes.some(s=>key===exactBase+s))
      return result(true,'existing-cave-mob-roster-or-backup');
  }
  return result(false,'no-known-extra-local-claims');
}
