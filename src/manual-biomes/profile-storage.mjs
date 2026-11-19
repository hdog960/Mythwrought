// MANUAL M1: checked per-seed generator identity. Production startup/export
// remain unchanged until explicitly approved M2 wiring.
import {worldSlotKey,SELECTED_SEED_KEY} from '../seeds.mjs';
import {saveFingerprint,loadWorldSafe,saveWorldSafe,
  SAVE_JOURNAL_SUFFIX,SAVE_BACKUP_SUFFIX} from '../persistence.mjs';
import {fourRegionProfile,validateFourRegionProfile,FourRegionWorld,
  restoreFourRegionWorld,FOUR_REGION_GENERATOR} from './profile-world.mjs';

export const BIOME_PROFILE_SUFFIX='-four-biomes-profile-v1';
const PROFILE_JOURNAL='-journal';
const profileKey=seed=>worldSlotKey(seed)+BIOME_PROFILE_SUFFIX;
const record=(profile)=>{
  const raw=JSON.stringify(validateFourRegionProfile(profile));
  return JSON.stringify({version:1,checksum:saveFingerprint(raw),raw});
};
const parseRecord=(raw,seed)=>{
  try{
    const entry=JSON.parse(raw);
    if(!entry||Object.keys(entry).sort().join(',')!=='checksum,raw,version'||
       entry.version!==1||typeof entry.raw!=='string'||
       saveFingerprint(entry.raw)!==entry.checksum)
      throw Error('Profile checksum/shape mismatch');
    return validateFourRegionProfile(JSON.parse(entry.raw),seed);
  }catch(error){throw Error('Invalid four-biome profile: '+String(error));}
};
export function readFourRegionProfile(storage,seed){
  if(!storage||typeof storage.getItem!=='function')
    throw Error('Missing profile storage');
  const key=profileKey(seed),a=storage.getItem(key),b=storage.getItem(key+PROFILE_JOURNAL);
  if(a===null&&b===null)return null;
  // A corrupted or contradictory record must not be treated as the legacy
  // world; a valid journal can recover a missing/invalid PRIMARY explicitly.
  let primary=null,journal=null;
  try{if(a!==null)primary=parseRecord(a,seed);}catch(_){}
  try{if(b!==null)journal=parseRecord(b,seed);}catch(_){}
  if(!primary&&!journal)throw Error('Damaged biome profile; refusing legacy fallback');
  if(primary&&journal&&JSON.stringify(primary)!==JSON.stringify(journal))
    throw Error('Conflicting biome profile records; refusing regeneration');
  return Object.freeze({profile:primary??journal,
    source:primary?'primary':'journal',recovered:!primary});
}
function assertFreshAndUnclaimed(storage,seed){
  const loaded=loadWorldSafe(storage,seed);
  if(loaded.source!=='new')
    throw Error('Existing seed/save cannot silently become a biome-enabled world');
  // No auto conversion of an explored world that happens to contain zero
  // edits. Check every seed-specific sidecar, map and prior selected seed.
  const base=worldSlotKey(seed);
  if(storage.getItem(SELECTED_SEED_KEY)===String(seed)||
     storage.getItem('mythwrought-exploration-v1-'+seed)!==null)
    throw Error('Previously selected/explored world is not fresh');
  if(typeof storage.key!=='function'||!Number.isInteger(storage.length))
    throw Error('Cannot audit existing per-seed storage keys');
  for(let i=0;i<storage.length;i++){
    const key=storage.key(i);
    if(typeof key==='string'&&(key===base||key.startsWith(base+'-')))
      throw Error('Existing world sidecar prevents new-profile activation');
  }
  return loaded;
}
export function activateFourRegionProfile(storage,seed,{
  explicitNewWorld=false,generator=FOUR_REGION_GENERATOR
}={}){
  if(!explicitNewWorld)throw Error('Explicit NEW biome-enabled world choice required');
  if(readFourRegionProfile(storage,seed))
    throw Error('World already has a generation profile');
  assertFreshAndUnclaimed(storage,seed);
  // A previously saved profile is never remapped. This option is used
  // solely AFTER a distinct, confirmed new-seed action or validated import.
  // Default remains the accepted v4 generator.
  const profile=fourRegionProfile(seed,generator);
  const key=profileKey(seed),raw=record(profile);
  // Immutable generator version. Write a verified journal before the primary
  // sidecar. An interrupted write never permits silent legacy regeneration.
  storage.setItem(key+PROFILE_JOURNAL,raw);
  if(storage.getItem(key+PROFILE_JOURNAL)!==raw)
    throw Error('Could not verify biome profile journal');
  storage.setItem(key,raw);
  if(storage.getItem(key)!==raw)
    throw Error('Could not verify biome profile primary');
  if(!readFourRegionProfile(storage,seed))
    throw Error('Biome profile not durably recorded');
  return new FourRegionWorld(seed,profile);
}
function selectedWorldPayload(storage,seed,source){
  const key=worldSlotKey(seed);
  let raw;
  if(source==='primary')raw=storage.getItem(key);
  else if(source==='backup')raw=storage.getItem(key+SAVE_BACKUP_SUFFIX);
  else if(source==='journal'){
    const journal=JSON.parse(storage.getItem(key+SAVE_JOURNAL_SUFFIX));
    if(!journal||typeof journal.raw!=='string'||
       saveFingerprint(journal.raw)!==journal.checksum)
      throw Error('Invalid selected world journal');
    raw=journal.raw;
  }else throw Error('Unsafe profiled world save origin: '+source);
  if(typeof raw!=='string')throw Error('Missing selected profiled world bytes');
  return JSON.parse(raw);
}
/** Explicit entry point for M2. Regular callers still use loadWorldSafe().
 * No global startup mutation; legacy seeds get their original world object.
 */
export function loadFourRegionWorld(storage,seed,{
  enableNew=false,newGenerator=FOUR_REGION_GENERATOR
}={}){
  const metadata=readFourRegionProfile(storage,seed);
  if(enableNew){
    if(metadata)throw Error('Use existing profile; do not recreate');
    return Object.freeze({world:activateFourRegionProfile(storage,seed,
      {explicitNewWorld:true,generator:newGenerator}),mode:'four-regions',created:true});
  }
  const loaded=loadWorldSafe(storage,seed);
  if(!metadata)return Object.freeze({world:loaded.world,mode:'legacy',
    recovered:Boolean(loaded.recovered)});
  if(loaded.source==='legacy')
    throw Error('A profiled seed cannot load legacy-default bytes');
  const world=loaded.source==='new'?
    new FourRegionWorld(seed,metadata.profile):
    restoreFourRegionWorld(selectedWorldPayload(storage,seed,loaded.source),
      metadata.profile);
  return Object.freeze({world,mode:'four-regions',
    recovered:Boolean(loaded.recovered||metadata.recovered)});
}
export function saveFourRegionWorld(storage,world){
  if(!(world instanceof FourRegionWorld))throw Error('Not an authoritative biome world');
  const metadata=readFourRegionProfile(storage,world.seed);
  if(!metadata||JSON.stringify(metadata.profile)!==JSON.stringify(world.profile))
    throw Error('Missing/mismatched biome profile; refusing save');
  const status=saveWorldSafe(storage,world);
  if(!status.ok)return status;
  // Verify through the NEW profile-aware loader. Plain VoxelWorld.restore
  // would discard edits equal to OLD legacy terrain: that is not sufficient.
  const reload=loadFourRegionWorld(storage,world.seed);
  if(JSON.stringify(reload.world.save())!==JSON.stringify(world.save()))
    throw Error('Biome world profile-aware save roundtrip mismatch');
  return status;
}
export function exportFourRegionWorld(world){
  if(!(world instanceof FourRegionWorld))throw Error('Not a biome world export');
  return JSON.stringify({kind:'mythwrought-four-biomes-export',version:1,
    profile:world.profile,world:world.save()});
}
export function inspectFourRegionExport(raw){
  if(typeof raw!=='string'||raw.length>20*1024*1024)
    throw Error('Invalid biome bundle');
  const item=JSON.parse(raw);
  if(!item||Object.keys(item).sort().join(',')!=='kind,profile,version,world'||
     item.kind!=='mythwrought-four-biomes-export'||item.version!==1)
    throw Error('Unsupported biome bundle');
  const profile=validateFourRegionProfile(item.profile);
  // Inspection is pure. An actual import must explicitly backup/commit to
  // storage after M2 approval; do not replace an existing seed here.
  return restoreFourRegionWorld(item.world,profile);
}
