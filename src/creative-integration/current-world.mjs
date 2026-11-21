// Creator-owned current-generation authority. Read-only until an explicit new-world
// commit; never relabel, rewrite or interpret legacy terrain as a newer generator.
import {M6_BALANCED_GENERATOR} from '../manual-biomes/profile-world.mjs';
import {worldSlotKey,SELECTED_SEED_KEY,LEGACY_WORLD_KEY,DEFAULT_WORLD_SEED} from '../seeds.mjs';
import {GAME_RELEASE} from '../app-update.mjs';
export const CURRENT_INSTALLED_GENERATOR=M6_BALANCED_GENERATOR;
export const WORLD_SAVE_SCHEMA=1;
export const GENERATION_AUTHORITY_ABI='mythwrought.current-world.v1';

export function inspectWorldGeneration(world){
  const seed=world?.seed;
  if(!Number.isSafeInteger(seed)||seed!==(seed|0))
    return Object.freeze({state:'unknown',generator:null,reason:'Invalid world identity'});
  const profile=world?.base?.generationProfile??world?.generationProfile??null;
  const generator=typeof profile?.generator==='string'?profile.generator:null;
  if(generator===CURRENT_INSTALLED_GENERATOR)
    return Object.freeze({state:'current',generator,seed,reason:'Installed accepted generator'});
  return Object.freeze({state:generator?'obsolete':'legacy',generator,seed,
    reason:generator?'Saved world uses an older generation baseline':
      'No verified generation profile for this legacy world'});
}
export function currentWorldMetadata({creativeCatalog,mobCatalog}={}){
  if(typeof creativeCatalog!=='string'||!creativeCatalog||
     typeof mobCatalog!=='string'||!mobCatalog)
    throw TypeError('World metadata needs both independently verified catalog revisions');
  return Object.freeze({authority:GENERATION_AUTHORITY_ABI,gameRelease:GAME_RELEASE,
    generator:CURRENT_INSTALLED_GENERATOR,worldSaveSchema:WORLD_SAVE_SCHEMA,
    creativeCatalog,mobCatalog});
}
export function seedHasAnySavedData(storage,seed){
  if(!storage||typeof storage.getItem!=='function'||
     !Number.isSafeInteger(seed)||seed!==(seed|0))
    throw TypeError('Verified storage and int32 seed required');
  // Existing schema-1 records and backup/journal never change key or bytes.
  const worldKey=worldSlotKey(seed);
  // A selected seed remains reserved even when its canonical save is empty,
  // and the pre-slot legacy save belongs to its original default seed.
  if(storage.getItem(SELECTED_SEED_KEY)===String(seed)||
     (seed===DEFAULT_WORLD_SEED&&storage.getItem(LEGACY_WORLD_KEY)!==null))
    return true;
  if([worldKey,worldKey+'-integrity-v009',worldKey+'-backup-v009',
    'mythwrought-caves-v1-seed-'+seed,
    'mythwrought-mobs-v1-seed-'+seed,
    'mythwrought.pack5.builder.seed.'+seed].some(key=>storage.getItem(key)!==null))
    return true;
  // Future independently-owned per-seed sidecars must also prohibit reuse.
  // Fail closed if the storage enumerator is unavailable or throws.
  if(!Number.isSafeInteger(storage.length)||typeof storage.key!=='function')
    throw Error('Cannot enumerate stored worlds safely');
  for(let i=0;i<storage.length;i++){
    const name=storage.key(i);
    if(typeof name!=='string')throw Error('Could not inspect saved world slots');
    if(name===worldKey||name.startsWith(worldKey+'-')||
       name.startsWith(worldKey+'.')||
       name.endsWith('-'+seed)||name.endsWith('.'+seed)||
       name.includes('-seed-'+seed+'.')||name.includes('.seed.'+seed+'.')||
       name.includes('-world-'+seed+'.'))
      return true;
  }
  return false;
}
export function chooseUnusedCurrentSeed(storage,randomInt32,attempts=32){
  if(typeof randomInt32!=='function'||!Number.isInteger(attempts)||
     attempts<1||attempts>128)throw TypeError('Unsafe new-world seed chooser');
  for(let i=0;i<attempts;i++){
    const seed=randomInt32();
    if(!Number.isSafeInteger(seed)||seed!==(seed|0))
      throw Error('New-world random source returned an invalid signed int32 seed');
    if(!seedHasAnySavedData(storage,seed))return seed;
  }
  throw Error('Could not verify an unused world seed; existing worlds preserved');
}
export function secureRandomWorldSeed(){
  if(!globalThis.crypto?.getRandomValues)
    throw Error('Secure random generator unavailable; refusing duplicate world creation');
  const value=new Uint32Array(1);
  globalThis.crypto.getRandomValues(value);
  return value[0]|0;
}
